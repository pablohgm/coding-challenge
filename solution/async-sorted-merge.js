"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const _ = require("lodash");
const P = require("bluebird");

module.exports = async (logSources, printer) => {
  // Fill out the map with the first log of each log source using promise all
  const swapMap = new Map()
  const responses = await P.all(logSources.map((sourceLog) => sourceLog.popAsync()))
  _.each(responses, (log, index) => {
    if (log) {
      swapMap.set(index, log)
    }
  })

  for (const [,] of swapMap) {
    // Find the oldest log
    const [oldestKey, oldestLog] = _.minBy([...swapMap.entries()], ([, log]) => log.date)

    // Print and delete log from map
    printer.print(oldestLog)
    swapMap.delete(oldestKey)

    // refilled log from log source
    const refilledLog = await logSources[oldestKey].popAsync()
    if (refilledLog) {
      swapMap.set(oldestKey, refilledLog)
    }
  }

  printer.done()

  return new Promise((resolve, reject) => {
    resolve(console.log("Async sort complete."));
  });
};
