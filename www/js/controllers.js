angular.module('controllers', [])

.controller('CreateCtrl', function($scope, $state, SQLiteService){
  $scope.car = {
    brand: "BMW",
    model: "",
    doors: "3",
    colors: "",
    price: ""
  }

  $scope.create = function(car){
    SQLiteService.addCar(car)
    .then(function(ok){
      console.log(ok);
    },function(error){
      console.log(error);
    });
  }
})

.controller('AssignCtrl', function($scope, $state, branchs, SQLiteService){
    $scope.branchItems = branchs.rows;
    $scope.assign = {
      branchName: $scope.branchItems[0],
    }

    $scope.reloadNumbers = function(){
      SQLiteService.getBranchNumber($scope.assign.branchName)
      .then(function(numbers){
        $scope.branchNumbers = numbers.rows;
        $scope.assign.numbers = $scope.branchNumbers[0];
      }, function(error){
        console.log(error);
      })
    }

    $scope.reloadNumbers();

})
