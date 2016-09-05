angular.module('services', [])

.service('SQLiteService', function($cordovaSQLite, $q){

  this.CreateDataBase = function(){
    var deferred = $q.defer();
    var db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS branch (name text, number integer, PRIMARY KEY (name, number))");
    db.transaction(function(tx) {
      var query = "INSERT INTO branch VALUES (?,?)";
      tx.executeSql(query, ['AutoCar', 1]);
      tx.executeSql(query, ['AutoCar', 2]);
      tx.executeSql(query, ['AutoCar', 3]);
      tx.executeSql(query, ['SuperCars', 1]);
      tx.executeSql(query, ['SuperCars', 2]);
      tx.executeSql(query, ['SuperCars', 3]);
      tx.executeSql(query, ['SuperCars', 4]);
      tx.executeSql(query, ['Soled', 1]);
      tx.executeSql(query, ['Soled', 2]);
      tx.executeSql(query, ['YouCar', 1]);
      tx.executeSql(query, ['YouCar', 2]);
      tx.executeSql(query, ['YouCar', 3]);
      tx.executeSql(query, ['Movility', 1]);
      tx.executeSql(query, ['Movility', 2]);
    }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
        deferred.resolve(error.message);
    }, function() {
        console.log('Populated database OK');
        deferred.resolve("OK");
    });
    return deferred.promise;
  }

  this.addCar = function(car){
    var deferred = $q.defer();
    var db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS car (brand text, model text, doors integer, color text, price integer, used integer, PRIMARY KEY (brand, model, color))");
    db.transaction(function(tx) {
      var query = "INSERT INTO car VALUES (?,?,?,?,?,?)";
      for(var i= 0; i < car.colors.length; i++){
        if(car.used){
          tx.executeSql(query,[car.brand, car.model, car.doors ,car.colors[i], car.price, 1]);
        }
        else{
          tx.executeSql(query,[car.brand, car.model, car.doors ,car.colors[i], car.price, 0]);
        }
      }
    }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
        deferred.resolve(error.message);
    }, function() {
        console.log('Populated database OK');
        deferred.resolve("OK");
    });
    return deferred.promise;
  }

  this.getBranchsName = function(){
    var deferred = $q.defer();
    var db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    var query = "SELECT name FROM branch GROUP BY name";
    $cordovaSQLite.execute(db,query)
    .then(function(res){
      deferred.resolve(res);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  this.getBranchNumber = function(branchName){
    var deferred = $q.defer();
    var db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    var query = "SELECT number FROM branch Where branch.name = ? " ;
    $cordovaSQLite.execute(db,query,[branchName.name])
    .then(function(res){
      deferred.resolve(res);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  this.getBrands = function(){
    var deferred = $q.defer();
    var db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    var query = "SELECT brand FROM car GROUP BY brand";
    $cordovaSQLite.execute(db,query)
    .then(function(res){
      deferred.resolve(res);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  this.getCarModels = function(carBrand){
    var deferred = $q.defer();
    var db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    var query = "SELECT model FROM car Where car.brand = ? GROUP BY model" ;
    $cordovaSQLite.execute(db,query,[carBrand.brand])
    .then(function(res){
      deferred.resolve(res);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  this.getCarColors = function(carBrand, carModel){
    var deferred = $q.defer();
    var db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    var query = "SELECT color FROM car Where car.brand = ? AND car.model = ?" ;
    $cordovaSQLite.execute(db,query,[carBrand.brand, carModel.model])
    .then(function(res){
      deferred.resolve(res);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  this.assign = function(cars){
    var deferred = $q.defer(),
    db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000),
    createQuery = "CREATE TABLE IF NOT EXISTS assign (brandId integer, branch text, branchNumber integer, quantity integer,PRIMARY KEY(brandId, branch, branchNumber), FOREIGN KEY (branch,branchNumber) REFERENCES branch(name,number))"
    //$cordovaSQLite.execute(db,'DROP TABLE IF EXISTS assign');
    $cordovaSQLite.execute(db, createQuery);
    var selectQuery = "SELECT rowid FROM car WHERE car.brand = ? AND car.model = ? AND car.color = ?";
    $cordovaSQLite.execute(db,selectQuery,[cars.carBrand.brand, cars.carModel.model, cars.carColor.color])
    .then(function(res){
      db.transaction(function(tx) {
        var insertQuery = "INSERT INTO assign VALUES (?,?,?,?)";
        tx.executeSql(insertQuery,[res.rows[0].rowid, cars.branchName.name, cars.branchNumber.number, cars.quantity]);
      }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
        deferred.resolve(error.message);
      }, function() {
        console.log('Populated database OK');
        deferred.resolve("OK");
      });
    }, function(error){
      deferred.reject(error);
    })
    return deferred.promise;
  }

  this.getCars = function(){
    var deferred = $q.defer(),
    db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    $cordovaSQLite.execute(db,'Select car.brand, car.model, car.color, car.rowid FROM car')
    .then(function(res){
      deferred.resolve(res);
    },function(error){
      deferred.reject(error);
    })
    return deferred.promise;
  }

  this.getCar = function(rowId){
    var deferred = $q.defer(),
    db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    $cordovaSQLite.execute(db,'Select * FROM car WHERE car.rowid = ?',[rowId])
    .then(function(res){
      deferred.resolve(res.rows);
    }, function(error){
      deferred.reject(error);
    })
    return deferred.promise;
  }
})
