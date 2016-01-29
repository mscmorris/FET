"use strict"

export default function(n) {
  if(n < 0) {
    return -1
  }

  if(n === 0) {
    return 1
  }

  return n * factorial(n - 1)
}