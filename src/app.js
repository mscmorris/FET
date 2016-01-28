"use strict"

// Angular mods
import angular from "angular"
import "angular-route"
import "angular-aria"
import "angular-animate"
import "angular-material"
import "rx-angular"

// Our mods
import "./controllers/nfl.js"

let FEApp = angular.module("FEApp", [
  "ngRoute", 
  "ngAria", 
  "ngAnimate", 
  "ngMaterial", 
  "rx", 
  "NFL"
  ])

FEApp.config(["$routeProvider", ($routeProvider) => {
  $routeProvider
  .when("/nfl", {
    templateUrl: "/partials/nfl.html",
    controller:  "NFL"
  })
  .otherwise({
    redirectTo: "/nfl"
  })
}])