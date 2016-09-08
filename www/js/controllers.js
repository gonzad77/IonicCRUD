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

.controller('EditCtrl', function($scope, $state, $stateParams, car, brands,SQLiteService){
  $scope.carBrands = brands.rows;

  var actualBrand = {
    brand: car.brand
  };

  $scope.newCar = {
    brand: actualBrand,
    doors: ""+car.doors+"",
    price: car.price,
    model: car.model,
    color:car.color
  }

  $scope.update = function(newCar){
    SQLiteService.updateCar($stateParams.rowId, newCar)
    .then(function(res){
      console.log(res);
      $scope.error = false;
    },function(error){
      console.log(error);
      $scope.error = true;
    })
  }
})

.controller('DeleteCtrl', function($scope, $state, cars, SQLiteService){
  $scope.carRows = cars.rows;

  $scope.delete = function(rowid){
    SQLiteService.deleteCar(rowid)
    .then(function(res){
      $scope.carRows = res.rows;
    },function(error){
      console.log(error);
    })
  }
})

.controller('ConsultCtrl', function($scope, $state, brands, SQLiteService){
  var allBrands = [];
  var allModels = [];
  $scope.car = {
    carBrand: "",
    carModel: "",
    color: "all"
  }
  for (var i=0 ; i < brands.rows.length ; i++){
    allBrands.push(brands.rows[i]);
  }
  allBrands.unshift({
    brand: "All Brands"
  })
  $scope.carBrands = allBrands;
  $scope.car.carBrand = allBrands[0];

  $scope.reloadModels = function(){
    allModels = [];
    if($scope.car.carBrand.brand === "All Brands"){
      SQLiteService.getAllModels()
      .then(function(models){
        for (var i=0 ; i < models.rows.length ; i++){
          allModels.push(models.rows[i]);
        }
        allModels.unshift({
          model: "All Models"
        })
        $scope.carModels = allModels;
        $scope.car.carModel = allModels[0];
      })
    }
    else{
      SQLiteService.getCarModels($scope.car.carBrand)
      .then(function(models){
        for (var i=0 ; i < models.rows.length ; i++){
          allModels.push(models.rows[i]);
        }
        allModels.unshift({
          model: "All Models"
        })
        $scope.carModels = allModels;
        $scope.car.carModel = $scope.carModels[0];
      }, function(error){
        console.log(error);
      })
    }
  }
  $scope.reloadModels();

  $scope.consult = function(car){
    SQLiteService.consult(car)
    .then(function(res){
      $scope.branches = res.rows;
      $scope.error = false;
      $scope.showTable = true;
      console.log(res);
    }, function(error){
      $scope.error = true;
      $scope.showTable = false;
      console.log(error);
    })
  }
})
