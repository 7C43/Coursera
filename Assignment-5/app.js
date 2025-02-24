// app.js
(function() {
    'use strict';
  
    angular.module('MenuApp', ['ngRoute'])
      .config(config)
      .controller('SignUpController', SignUpController)
      .controller('MyInfoController', MyInfoController)
      .service('UserService', UserService);
  
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'home.html'
        })
        .when('/signup', {
          templateUrl: 'signup.html',
          controller: 'SignUpController',
          controllerAs: 'signUpCtrl'
        })
        .when('/myinfo', {
          templateUrl: 'myinfo.html',
          controller: 'MyInfoController',
          controllerAs: 'myInfoCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  
    SignUpController.$inject = ['UserService', '$http'];
    function SignUpController(UserService, $http) {
      var signUpCtrl = this;
      signUpCtrl.user = {};
      signUpCtrl.saved = false;
      signUpCtrl.invalidDish = false;
  
      signUpCtrl.submitForm = function(form) {
        if (form.$valid) {
          $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json').then(function(response) {
            var menuItems = response.data;
            var found = false;
  
            for (var category in menuItems) {
              if (menuItems.hasOwnProperty(category)) {
                var items = menuItems[category].menu_items;
                for (var i = 0; i < items.length; i++) {
                  if (items[i].short_name === signUpCtrl.user.favoriteDish) {
                    found = true;
                    UserService.saveUser(signUpCtrl.user);
                    signUpCtrl.saved = true;
                    signUpCtrl.invalidDish = false;
                    break;
                  }
                }
              }
              if (found) break;
            }
  
            if (!found) {
              signUpCtrl.invalidDish = true;
            }
          });
        }
      };
    }
  
    MyInfoController.$inject = ['UserService', '$http'];
    function MyInfoController(UserService, $http) {
      var myInfoCtrl = this;
      myInfoCtrl.user = UserService.getUser();
  
      if (myInfoCtrl.user.favoriteDish) {
        $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json').then(function(response) {
          var menuItems = response.data;
          var found = false;
  
          for (var category in menuItems) {
            if (menuItems.hasOwnProperty(category)) {
              var items = menuItems[category].menu_items;
              for (var i = 0; i < items.length; i++) {
                if (items[i].short_name === myInfoCtrl.user.favoriteDish) {
                  myInfoCtrl.favoriteDish = items[i];
                  found = true;
                  break;
                }
              }
            }
            if (found) break;
          }
        });
      }
    }
  
    function UserService() {
      var service = this;
      var user = {};
  
      service.saveUser = function(userInfo) {
        user = userInfo;
      };
  
      service.getUser = function() {
        return user;
      };
    }
  })();
  