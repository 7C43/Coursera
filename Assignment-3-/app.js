(function() {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm = "";
    ctrl.found = [];

    ctrl.narrowItDown = function() {
      if (ctrl.searchTerm.trim() === "") {
        ctrl.found = [];
        return;
      }

      MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function(items) {
        ctrl.found = items;
      }).catch(function(error) {
        console.error("Error fetching menu items:", error);
        ctrl.found = [];
      });
    };

    ctrl.removeItem = function(index) {
      ctrl.found.splice(index, 1);
    };
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
      return $http({
        method: "GET",
        url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
      }).then(function(response) {
        console.log("Response data:", response.data);
        var allItems = [];
        for (var category in response.data) {
          if (response.data.hasOwnProperty(category)) {
            allItems = allItems.concat(response.data[category].menu_items);
          }
        }
        var foundItems = allItems.filter(function(item) {
          return item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase());
        });
        return foundItems;
      }).catch(function(error) {
        console.error("Error in getMatchedMenuItems:", error);
        throw error;
      });
    };
  }

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'dirCtrl',
      bindToController: true
    };
    return ddo;
  }

  function FoundItemsDirectiveController() {
    var dirCtrl = this;
  }
})();