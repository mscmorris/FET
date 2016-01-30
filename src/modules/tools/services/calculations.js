"use strict"

let calculateHeadToHead = (wa, wb) => wa / (wa + wb)

export default function() {
  return {
    calculateHeadToHead: calculateHeadToHead
  }
}