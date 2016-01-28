"use strict"

import Rx from "rx"
import _ from "underscore"
import angular from "angular"

let moduleName = "NFL"

function NFLController($scope, rx) {

  let calcWinValue = mp => c => mp - c
  let calcLossValue = (a, v) => a - v 
  let calcReturn = (s, v) => ((((s + v) - s) / s) * 100).toFixed(2)
  let updateSpent = s => $scope.spent = s

  let PPW = 10
  $scope.spent = 0

  let selected = []
  let teams = [
    { id: 0, name: "DEN", cost: 5 }, 
    { id: 1, name: "NE",  cost: 5 }, 
    { id: 2, name: "CIN", cost: 3 }, 
    { id: 3, name: "HOU", cost: 3 },
    { id: 4, name: "KC",  cost: 4 }, 
    { id: 5, name: "PIT", cost: 4 },
    { id: 6, name: "CAR", cost: 6 },
    { id: 7, name: "ARZ", cost: 6 }, 
    { id: 8, name: "WAS", cost: 3 }, 
    { id: 9, name: "MIN", cost: 3 }, 
    { id: 10, name: "GB",  cost: 3 }, 
    { id: 11, name: "SEA", cost: 5 }
  ]

  let matchups = [
    [ 0, 5 ],
    [ 1, 4 ],
    [ 7, 10 ],
    [ 6, 11 ]
  ]

  $scope.scores = []
  $scope.returns = []
  $scope.teams = teams
  $scope.matchups = matchups
  $scope.selected = {}

  $scope.isDisabled = function() {
    return selected.length <= 0
  }

  $scope.update = function() {
    let s = Rx.Observable.from(selected)
    let ts = Rx.Observable.from(teams)
    let ms = Rx.Observable.from(matchups)
    let spent = Rx.Observable.of($scope.spent)

    let sc = s
      .flatMap(i => ts
        .elementAt(i)
        .map(o => { 
          return { index: i, name: o.name, cost: o.cost }
        }
      )
    )

    let matchesOfInterest = ms
      .flatMap(m => sc
        .filter(o => _.indexOf(m, o.index) !== -1)
        .map(() => [ m[0], m[1] ])
        .distinct())

    let win = matchesOfInterest.flatMap(m => {
      return Rx.Observable.from(m).flatMap(x => {
        return sc
          .filter(o => o.index === x)
          .map(o => o.cost)
      })
      .sum()
      .map(calcWinValue(PPW))
    })

    let loss = matchesOfInterest.flatMap(m => {
      return Rx.Observable.from(m).flatMap(x => {
        return sc
          .filter(o => o.index === x)
          .map(o => o.cost)
          .defaultIfEmpty(PPW)
      })
      .sum()
      .map(s => PPW - s)
    })

    let spread = matchesOfInterest.flatMap((v, n) => 
      win
        .slice(0, n + 1)
        .sum()
        .flatMap(w => 
          loss
            .slice(n + 1)
            .sum()
            .map(l => w + l)
          )
        )

    let allValues = Rx.Observable
      .concat(loss.sum(), spread)
      .distinct()
  
    let returns = spent
      .tap(console.log.bind(console))
      .combineLatest(allValues, calcReturn)
      .tap(console.log.bind(console))


    returns.subscribe(console.log.bind(console))

    returns.toArray().subscribe(a => $scope.returns = a)
    allValues.toArray().subscribe(a => $scope.scores = a)
  }

  let accSelected = rx.createObservableFunction($scope, "updateSelected")
    .map(() => {
      let result = []
      Object
        .keys($scope.selected)
        .filter(k => $scope.selected[k] === true)
        .forEach(k => result.push(parseInt(k)))

      return result
    })

  accSelected
    .subscribe(r => selected = r)

  accSelected
    .flatMapLatest(a => Rx.Observable.from(a).map(i => teams[i].cost).sum())
    .subscribe(v => $scope.spent = v)
}

angular.module(moduleName, ["rx"]).controller(moduleName, NFLController)

export default moduleName