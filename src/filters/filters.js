import angular from "angular"


angular.module("FEFilters", [])
  .filter("percentage", ["$filter", function($filter) {
    return function(input, decimals) {
      return $filter("number")(input * 100, decimals) + "%"
    }
}])