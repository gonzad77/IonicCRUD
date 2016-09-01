angular.module('controllers', [])

.controller('CreateCtrl', function($scope, $state){
  $scope.car = {
    brand: "BMW",
    model: "",
    doors: "3",
    colors: "",
    price: ""
  }
});
