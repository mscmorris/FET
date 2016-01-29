"use strict"

function combineArrays(arrays, i = 0) {
  let tmp = [], result = []

  if(!Array.isArray(arrays[i])) {
    return []
  }

  if(i === arrays.length - 1) {
    return arrays[i]
  }

  tmp = combineArrays(arrays, i + 1)

  arrays[i].forEach(v => {
    tmp.forEach(t => {
      result.push(Array.isArray(t) ? [v].concat(t) : [v, t])
    })
  })

  return result
}

export { combineArrays }