"use strict"

export default function($scope, CalculationService) {
  $scope.result = 0
  $scope.wa = 0
  $scope.wb = 0

  $scope.calcResult = function() {
    $scope.result = CalculationService.calulateHeadToHead($scope.wa, $scope.wb)
    console.log($scope.result)
  }
}