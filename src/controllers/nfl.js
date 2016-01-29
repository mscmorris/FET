"use strict"

import Rx from "rx"
import _ from "underscore"
import angular from "angular"

import { combineArrays } from "../lib/array_utils.js"

let moduleName = "NFL"

function NFLController($scope, rx) {

  let calcWinValue = mp => c => mp - c
  let calcLossValue = (a, v) => a - v 
  let calcReturn = (s, v) => ((calcAbsolutePoints(s, v) - s) / s)
  let calcAbsolutePoints = (s, v) => s + v
  let toPct = v => (v * 100).toFixed(2)
  let calcWinPct = (w, l) => w / (w + l)
  let calcHeadToHead = (w, l) => w / (w - l)
  let updateSpent = s => $scope.spent = s

  let PPW = 10
  $scope.spent = 0


  let selected = []

  $scope.teams = [
    { id: 0, name: "DEN", cost: 5, win: 12, loss: 4 }, 
    { id: 1, name: "NE",  cost: 5, win: 12, loss: 4 }, 
    { id: 2, name: "CIN", cost: 3, win: 12, loss: 4 }, 
    { id: 3, name: "HOU", cost: 3 },
    { id: 4, name: "KC",  cost: 4, win: 11, loss: 5 }, 
    { id: 5, name: "PIT", cost: 4, win: 10, loss: 6 },
    { id: 6, name: "CAR", cost: 6, win: 5, loss: 1 },
    { id: 7, name: "ARZ", cost: 6, win: 13, loss: 3 }, 
    { id: 8, name: "WAS", cost: 3 }, 
    { id: 9, name: "MIN", cost: 3 }, 
    { id: 10, name: "GB",  cost: 3, win: 10, loss: 6 }, 
    { id: 11, name: "SEA", cost: 5, win: 10, loss: 6 }
  ]

  $scope.matchups = [
    [ 0, 5 ],
    [ 1, 4 ],
    [ 7, 10 ],
    [ 6, 11 ]
  ]

  $scope.scores = []
  $scope.returns = []
  $scope.absolutePoints = []
  $scope.probabilities = []
  $scope.selected = {}

  $scope.calcWinPct = (w, l) => calcWinPct(parseInt(w), parseInt(l))
  $scope.calcHeadToHead = (w, l) => calcHeadToHead(parseInt(w), parseInt(l))

  $scope.isDisabled = function() {
    return selected.length <= 0
  }

  $scope.update = function() {
    let s = Rx.Observable.from(selected)
    let ts = Rx.Observable.from($scope.teams)
    let ms = Rx.Observable.from($scope.matchups)
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

    let results = win
      .zip(loss, (w,l) => w === l ? [w] : [w, l])
      .toArray()
      .map(combineArrays)
      .flatMap(a => Rx.Observable.from(a))
      .flatMap(a => Rx.Observable.from(a).sum())

    let pointsReturned = results.distinct()

    let resultsProbability = pointsReturned
      .flatMap(s => results.count(v => v === s))
      .flatMap(c => results.count().map(rc => c / rc))

    let returns = spent
      .combineLatest(pointsReturned, calcReturn)
      .map(toPct)

    let absolutePoints = spent
      .combineLatest(pointsReturned, calcAbsolutePoints)

    resultsProbability.toArray().subscribe(a => $scope.probabilities = a)
    absolutePoints.toArray().subscribe(a => $scope.absolutePoints = a)
    returns.toArray().subscribe(a => $scope.returns = a)
    pointsReturned.toArray().subscribe(a => $scope.scores = a)
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
    .flatMapLatest(a => Rx.Observable.from(a).map(i => $scope.teams[i].cost).sum())
    .subscribe(v => $scope.spent = v)
}

angular.module(moduleName, ["rx"]).controller(moduleName, NFLController)

export default moduleName