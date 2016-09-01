angular.module('services', [])

.service('SQLiteService', function($cordovaSQLite, $q){

  this.CreateDataBase = function(){
    var deferred = $q.defer();
    var db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    // $cordovaSQLite.execute(db,'DROP TABLE IF EXISTS branch');
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
})
