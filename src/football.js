"use strict"

var Rx = require("rx"),
    _  = require("underscore")

var log = console.log.bind(console)
var PPW = 10

var teams = [
  { name: "DEN", cost: 5 }, 
  { name: "NE",  cost: 5 }, 
  { name: "CIN", cost: 3 }, 
  { name: "HOU", cost: 3 },
  { name: "KC",  cost: 4 }, 
  { name: "PIT", cost: 4 },
  { name: "CAR", cost: 6 },
  { name: "ARZ", cost: 6 }, 
  { name: "WAS", cost: 3 }, 
  { name: "MIN", cost: 3 }, 
  { name: "GB",  cost: 3 }, 
  { name: "SEA", cost: 5 }
]

var selections = [ 0, 1, 6, 7 ]

var matchups = [
  [ 0, 5  ],
  [ 1, 4  ],
  [ 7, 10 ],
  [ 6, 11 ]
]

var ms = Rx.Observable.from(matchups)
var ts = Rx.Observable.from(teams)
var s  = Rx.Observable.from(selections)

var calcWinValue = mp => c => mp - c
var calcLossValue = (a, v) => a - v

var spent = s.sum(i => teams[i].cost)
var sc = s.flatMap(i => ts.elementAt(i).map(o => { 
  return { index: i, name: o.name, cost: o.cost }
}))

var matchesOfInterest = ms
  .flatMap(m => sc
    .filter(o => _.indexOf(m, o.index) !== -1)
    .map(() => m)
    .distinct())

var win = matchesOfInterest.flatMap(m => {
  return Rx.Observable.from(m).flatMap(x => {
    return sc
      .filter(o => o.index === x)
      .map(o => o.cost)
  })
  .sum()
  .map(calcWinValue(PPW))
})

var loss = matchesOfInterest.flatMap(m => {
  return Rx.Observable.from(m).flatMap(x => {
    return sc
      .filter(o => o.index === x)
      .map(o => o.cost)
      .defaultIfEmpty(PPW)
  })
  .sum()
  .map(s => PPW - s)
})

var spread = matchesOfInterest.flatMap((v, n) => 
  win
    .slice(0, n + 1)
    .sum()
    .flatMap(w => 
      loss
        .slice(n + 1)
        .sum()
        .map(l => w + l)))

var values = Rx.Observable.concat(loss.sum(), spread, win.sum()).distinct()

values.subscribe(log)