"use strict";

const _ = require("lodash");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  // Fill out the map with the first log of each log source
  const swapMap = new Map()
  _.each(logSources, (sourceLog, index) => {
    const log = sourceLog.pop()
    if (log) {
      swapMap.set(index, log)
    }
  })

  swapMap.forEach((key, value, map) => {
    // Find the oldest log
    const [oldestKey, oldestLog] = _.minBy([...map.entries()], ([, log]) => log.date)

    // Print and delete log from map
    printer.print(oldestLog)
    map.delete(oldestKey)

    // refilled log from log source
    const refilledLog = logSources[oldestKey].pop()
    if (refilledLog) {
      map.set(oldestKey, refilledLog)
    }
  })

  printer.done()

  return console.log("Sync sort complete.");
};
