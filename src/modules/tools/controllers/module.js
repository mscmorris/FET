"use strict"

import angular from "angular"
import HeadToHeadController from "./headtohead.js"

export default function($scope, $mdDialog) {
  $scope.openHeadToHead = function(ev) {
    $mdDialog.show({
      controller: HeadToHeadController,
      templateUrl: "/partials/tools/headtohead.html",
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: true
    })
  }
}