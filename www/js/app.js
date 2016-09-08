// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','controllers','services'])

.run(function($ionicPlatform,$cordovaSQLite) {
  var db = null;
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    // db = $cordovaSQLite.openDB("my.db");
    // db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
    // // $cordovaSQLite.execute(db,'DROP TABLE IF EXISTS branch');
    // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS branch (name text, number integer, PRIMARY KEY (name, number))");

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('menu', {
    url: '/menu',
    templateUrl: "views/menu.html",
    // controller: 'MenuCtrl',
    resolve:{
          creatDB: function(SQLiteService){
            return SQLiteService.CreateDataBase();
          }
      }
  })

  .state('create',{
    url: '/create',
    templateUrl: "views/create.html",
    controller: 'CreateCtrl'
  })

  .state('consult',{
    url: '/consult',
    templateUrl: "views/consult.html",
    controller: 'ConsultCtrl',
    resolve:{
      brands: function(SQLiteService){
        return SQLiteService.getBrands();
      }
    }
  })

  .state('assign',{
    url: '/assign',
    templateUrl: "views/assign.html",
    controller: 'AssignCtrl',
    resolve:{
      branchs: function(SQLiteService){
        return SQLiteService.getBranchsName();
      },
      brands: function(SQLiteService){
        return SQLiteService.getBrands();
      }

    }
  })

  .state('delete',{
    url: '/delete',
    templateUrl: "views/delete.html",
    controller: 'DeleteCtrl',
    resolve:{
      cars: function(SQLiteService){
        return SQLiteService.getCars();
      }
    }
  })

  .state('update',{
    url: '/update',
    templateUrl: "views/update.html",
    controller: 'UpdateCtrl',
    resolve:{
      cars: function(SQLiteService){
        return SQLiteService.getCars();
      }
    }
  })

  .state('edit',{
    url:'/edit/:rowId',
    templateUrl: "views/edit.html",
    controller: 'EditCtrl',
    resolve:{
      car: function(SQLiteService, $stateParams){
        return SQLiteService.getCar($stateParams.rowId);
      },
      brands: function(SQLiteService){
        return SQLiteService.getBrands();
      }
    }
  })

  $urlRouterProvider.otherwise('/menu');
})

;
