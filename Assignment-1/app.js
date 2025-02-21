(function () {
    'use strict';

    angular.module('LunchCheckApp', [])
        .controller('LunchCheckController', LunchCheckController);

    LunchCheckController.$inject = ['$scope'];

    function LunchCheckController($scope) {
        $scope.lunchItems = "";
        $scope.message = "";

        $scope.checkIfTooMuch = function () {
            if ($scope.lunchItems.trim() === "") {
                $scope.message = "Please enter data first";
                return;
            }

            var items = $scope.lunchItems.split(',');
            var filteredItems = items.filter(function (item) {
                return item.trim() !== "";
            });

            if (filteredItems.length <= 3) {
                $scope.message = "Enjoy!";
            } else {
                $scope.message = "Too much!";
            }
        };
    }
})();
