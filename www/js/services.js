angular.module('services', [])

.service('SQLiteService', function($cordovaSQLite, $q){

  this.addCar = function(car){
    var deferred = $q.defer();
    var db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    db.transaction(function(tx) {
      var query = "INSERT INTO car VALUES (?,?,?,?,?,?)";
      for(var i= 0; i < car.colors.length; i++){
        if(car.used){
          tx.executeSql(query,[car.brand, car.model, car.colors[i], car.doors, car.price, 1]);
        }
        else{
          tx.executeSql(query,[car.brand, car.model, car.colors[i], car.doors, car.price, 0]);
        }
      }
    }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
        deferred.reject(error.message);
    }, function() {
        console.log('Populated database OK');
        deferred.resolve("OK");
    });
    return deferred.promise;
  }

  this.getBranchsName = function(){
    var deferred = $q.defer(),
    db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'}),
    query = "SELECT name FROM branch GROUP BY name",
    names = [];
    db.transaction(function (tx) {
       tx.executeSql(query, [], function (tx, resultSet) {
           for(var x = 0; x < resultSet.rows.length; x++) {
               names.push({
                 name: resultSet.rows.item(x).name,
               });
           }
       },
       function (tx, error) {
           console.log('SELECT error: ' + error.message);
           deferred.reject(error.message);
       });
   }, function (error) {
       console.log('transaction error: ' + error.message);
       deferred.reject(error.message);
   }, function () {
       console.log('transaction ok');
       deferred.resolve(names);
   });
    return deferred.promise;
  }

  this.getBranchNumber = function(branchName){
    var deferred = $q.defer();
    var db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    var query = "SELECT number FROM branch Where branch.name = ? " ;
    var numbers = [];
    $cordovaSQLite.execute(db,query,[branchName.name])
    .then(function(res){
      for(var x = 0; x < res.rows.length; x++) {
          numbers.push({
            number : res.rows.item(x).number,
          });
      }
      deferred.resolve(numbers);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  this.getBrands = function(){
    var deferred = $q.defer(),
    db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'}),
    query = "SELECT brand FROM car GROUP BY brand",
    brands = [];
    db.transaction(function (tx) {
       tx.executeSql(query, [], function (tx, resultSet) {
           for(var x = 0; x < resultSet.rows.length; x++) {
               brands.push({
                 brand: resultSet.rows.item(x).brand,
               });
           }
       },
       function (tx, error) {
           console.log('SELECT error: ' + error.message);
           deferred.reject(error.message);
       });
   }, function (error) {
       console.log('transaction error: ' + error.message);
       deferred.reject(error.message);
   }, function () {
       console.log('transaction ok');
       deferred.resolve(brands);
   });
    return deferred.promise;
  }

  this.getCarModels = function(carBrand){
    var deferred = $q.defer();
    var db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    var query = "SELECT model FROM car Where car.brand = ? GROUP BY model" ;
    var models = [];
    $cordovaSQLite.execute(db,query,[carBrand.brand])
    .then(function(res){
      for(var x = 0; x < res.rows.length; x++) {
          models.push({
            model : res.rows.item(x).model,
          });
      }
      deferred.resolve(models);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  this.getAllModels = function(){
    var deferred = $q.defer();
    var db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    var query = "SELECT model FROM car GROUP BY model" ;
    var models= [];
    $cordovaSQLite.execute(db,query)
    .then(function(res){
      for(var x = 0; x < res.rows.length; x++) {
          models.push({
            model : res.rows.item(x).model,
          });
      }
      deferred.resolve(models);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  this.getCarColors = function(carBrand, carModel){
    var deferred = $q.defer();
    var db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    var query = "SELECT color FROM car Where car.brand = ? AND car.model = ?" ;
    var colors = [];
    $cordovaSQLite.execute(db,query,[carBrand.brand, carModel.model])
    .then(function(res){
      for(var x = 0; x < res.rows.length; x++) {
          colors.push({
            color : res.rows.item(x).color,
          });
      }
      deferred.resolve(colors);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }

  this.assign = function(cars){
    var deferred = $q.defer(),
    db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'}),
    createQuery = "CREATE TABLE IF NOT EXISTS assign (brandId integer, branch text, branchNumber integer, quantity integer,PRIMARY KEY(brandId, branch, branchNumber), FOREIGN KEY (branch,branchNumber) REFERENCES branch(name,number))"
    //$cordovaSQLite.execute(db,'DROP TABLE IF EXISTS assign');
    $cordovaSQLite.execute(db, createQuery);
    var selectQuery = "SELECT rowid FROM car WHERE car.brand = ? AND car.model = ? AND car.color = ?";
    $cordovaSQLite.execute(db,selectQuery,[cars.carBrand.brand, cars.carModel.model, cars.carColor.color])
    .then(function(res){
      db.transaction(function(tx) {
        var insertQuery = "INSERT INTO assign VALUES (?,?,?,?)";
        var rowid = '';
        for(var x = 0; x < res.rows.length; x++) {
            rowid = res.rows.item(x).rowid;
        };
        tx.executeSql(insertQuery,[rowid, cars.branchName.name, cars.branchNumber.number, cars.quantity]);
      }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
        deferred.reject(error.message);
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
    db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    var cars = [];
    $cordovaSQLite.execute(db,'Select car.brand, car.model, car.color, car.rowid FROM car')
    .then(function(res){
      for(var x = 0; x < res.rows.length; x++) {
          cars.push({
            brand: res.rows.item(x).brand,
            model: res.rows.item(x).model,
            color: res.rows.item(x).color,
            rowid: res.rows.item(x).rowid
          });
      }
      deferred.resolve(cars);
    },function(error){
      deferred.reject(error);
    })
    return deferred.promise;
  }

  this.getCar = function(rowId){
    var deferred = $q.defer(),
    db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    $cordovaSQLite.execute(db,'Select * FROM car WHERE car.rowid = ?',[rowId])
    .then(function(res){
      for(var x = 0; x < res.rows.length; x++) {
          var car = {
            brand: res.rows.item(x).brand,
            color: res.rows.item(x).color,
            model: res.rows.item(x).model,
            doors: res.rows.item(x).doors,
            price: res.rows.item(x).price
          };
      }
      deferred.resolve(car);
    }, function(error){
      deferred.reject(error);
    })
    return deferred.promise;
  }

  this.updateCar = function(rowId, newCar) {
    var deferred = $q.defer(),
    db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    db.transaction(function(tx){
      var query = 'UPDATE car SET brand = ?, model = ?, doors = ?, color = ?, price = ? WHERE car.rowid = ?';
      tx.executeSql(query,[newCar.brand, newCar.model, newCar.doors, newCar.color, newCar.price, rowId]);
    }, function(error){
      deferred.reject(error);
    },function(){
      deferred.resolve('OK');
    })
    return deferred.promise;
  }

  this.deleteCar = function(rowId){
    var service = this;
    var deferred = $q.defer(),
    db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    db.transaction(function(tx){
      var query = 'Delete FROM car WHERE car.rowid = ?';
      tx.executeSql(query,[rowId]);
    }, function(error){
      deferred.reject(error);
    },function(){
      service.getCars()
      .then(function(res){
        deferred.resolve(res)
      },function(error){
        deferred.reject(error);
      })
    })
    return deferred.promise;
  }

  this.consult = function(car){
    var deferred = $q.defer(),
    db = $cordovaSQLite.openDB({name: 'test.db', location: 'default'});
    var branches = [];
    var query = '';
    var parameters = [];
    if(car.carBrand.brand === 'All Brands'){
      if(car.carModel.model === 'All Models'){
        if(car.color === 'All Colors'){
          query = 'Select car.rowid FROM car';
        }
        else{
          query = 'Select car.rowid FROM car WHERE car.color = ?';
          parameters.push(car.color);
        }
      }
      else{
        parameters.push(car.carModel.model);
        if(car.color === 'All Colors'){
          query = 'Select car.rowid FROM car WHERE car.model = ?';
        }
        else{
          query = 'Select car.rowid FROM car WHERE car.model = ? AND car.color = ?';
          parameters.push(car.color);
        }
      }
    }
    else {
      parameters.push(car.carBrand.brand);
      if(car.carModel.model === 'All Models'){
        if(car.color === 'All Colors'){
          query = 'Select car.rowid FROM car WHERE car.brand = ?';
        }
        else{
          query = 'Select car.rowid FROM car WHERE car.brand = ? AND car.color = ?';
          parameters.push(car.color);
        }
      }
      else{
        parameters.push(car.carModel.model);
        if(car.color === 'All Colors'){
          query = 'Select car.rowid FROM car WHERE car.brand = ? AND car.model = ?';
        }
        else{
          query = 'Select car.rowid FROM car WHERE car.brand = ? AND car.model = ? AND car.color = ?';
          parameters.push(car.color);
        }
      }
    }

    $cordovaSQLite.execute(db, query, parameters)
    .then(function(res){
      if(res.rows.length === 0) deferred.reject("error");
      for(var i= 0 ; i < res.rows.length ; i++){
        var carBrand = '';
        var carModel = '';
        $cordovaSQLite.execute(db,'Select car.brand, car.model FROM car WHERE car.rowid = ?' , [res.rows.item(i).rowid])
        .then(function(car){
          carBrand = car.rows.item(0).brand;
          carModel = car.rows.item(0).model;
        },function(error){
          deferred.reject(error);
        })
        $cordovaSQLite.execute(db,'Select assign.branch, assign.branchNumber, assign.quantity FROM assign WHERE assign.brandId = ?' , [res.rows.item(i).rowid])
        .then(function(result){
          if(result.rows.length === 0) deferred.reject("error");
          for(var x = 0; x < result.rows.length; x++) {
              branches.push({
                branch: result.rows.item(x).branch,
                branchNumber: result.rows.item(x).branchNumber,
                quantity: result.rows.item(x).quantity,
                brand: carBrand,
                model: carModel
              });
          }
          deferred.resolve(branches);
        }, function(error){
          deferred.reject(error);
        })
      }
    },function(error){
      deferred.reject(error);
    })
    return deferred.promise;
  }
})
