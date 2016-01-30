"use strict"

// Angular mods
import angular from "angular"
import "angular-route"
import "angular-aria"
import "angular-animate"
import "angular-material"
import "rx-angular"

// Our mods
import "./filters/filters.js"
import "./controllers/nfl.js"

import toolsModule from "./modules/tools/module.js"

let FEApp = angular.module("FEApp", [
  "ngRoute", 
  "ngAria", 
  "ngAnimate", 
  "ngMaterial", 
  "rx",
  toolsModule, 
  "FEFilters",
  "NFL"
  ])

FEApp.controller("AppController", function($scope, $mdSidenav) {
  $scope.openSideNav = navBuilder("left")
  function navBuilder(name) {
    return function() {
      $mdSidenav(name)
        .toggle()
    }
  }
})

FEApp.config(["$routeProvider", ($routeProvider) => {
  $routeProvider
  .when("/nfl", {
    templateUrl: "/partials/nfl.html",
    controller:  "NFL"
  })
  .when("/tools/headtohead", {
    templateUrl: "/partials/tools/headtohead.html",
    contoller: "HeadToHeadController"
  })
  .otherwise({
    redirectTo: "/nfl"
  })
}])