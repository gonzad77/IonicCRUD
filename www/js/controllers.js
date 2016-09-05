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
    $scope.cars = {
      branchName: $scope.branchItems[0],
      carBrand: $scope.carBrands[0],
      quantity: ""
    }

    $scope.reloadNumbers = function(){
      SQLiteService.getBranchNumber($scope.cars.branchName)
      .then(function(numbers){
        $scope.branchNumbers = numbers.rows;
        $scope.cars.branchNumber = $scope.branchNumbers[0];
      }, function(error){
        console.log(error);
      })
    }
    $scope.reloadNumbers();

    $scope.reloadModels = function(){
      SQLiteService.getCarModels($scope.cars.carBrand)
      .then(function(models){
        $scope.carModels = models.rows;
        $scope.cars.carModel = $scope.carModels[0];
        $scope.reloadColors();
      }, function(error){
        console.log(error);
      })
    }
    $scope.reloadModels();

    $scope.reloadColors = function(){
      SQLiteService.getCarColors($scope.cars.carBrand, $scope.cars.carModel)
      .then(function(colors){
        $scope.carColors = colors.rows;
        $scope.cars.carColor = $scope.carColors[0];
      }, function(error){
        console.log(error);
      })
    }

    $scope.doAssign = function(cars){
      SQLiteService.assign(cars)
      .then(function(res){
        console.log(res);
      },function(error){
        console.log(error);
      })
    }
})

.controller('UpdateCtrl', function($scope, $state, cars, SQLiteService){
  $scope.carRows = cars.rows;

  $scope.edit = function(rowid){
    $state.go('edit', {rowId: rowid});
  }
})

.controller('EditCtrl', function($scope, $state, car, SQLiteService){

})
