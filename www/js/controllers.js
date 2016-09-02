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

.controller('AssignCtrl', function($scope, $state, branchs, brands,SQLiteService){
    $scope.branchItems = branchs.rows;
    $scope.carBrands = brands.rows;
    $scope.assign = {
      branchName: $scope.branchItems[0],
      carBrand: $scope.carBrands[0],
    }

    $scope.reloadNumbers = function(){
      SQLiteService.getBranchNumber($scope.assign.branchName)
      .then(function(numbers){
        $scope.branchNumbers = numbers.rows;
        $scope.assign.branchNumber = $scope.branchNumbers[0];
      }, function(error){
        console.log(error);
      })
    }
    $scope.reloadNumbers();

    $scope.reloadModels = function(){
      SQLiteService.getCarModels($scope.assign.carBrand)
      .then(function(models){
        $scope.carModels = models.rows;
        $scope.assign.carModel = $scope.carModels[0];
        $scope.reloadColors();
      }, function(error){
        console.log(error);
      })
    }
    $scope.reloadModels();

    $scope.reloadColors = function(){
      SQLiteService.getCarColors($scope.assign.carBrand, $scope.assign.carModel)
      .then(function(colors){
        $scope.carColors = colors.rows;
        $scope.assign.carColor = $scope.carColors[0];
      }, function(error){
        console.log(error);
      })
    }


})
