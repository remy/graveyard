'use strict';
var cache = []; // should be moved to something beyond memory

var graveyard = function (req, res, next) {
  // if we have a hit on the cache, return the 410 early.
  if (cache.indexOf(req.url) !== -1) {
    return res.send(410);
  }

  // otherwise, attach to the headers being sent, and check if it's a 410
  res.on('header', function () {
    if (res.status === 410) {
      // add to cache
      cache.push(req.url);
    }
  });

  next();
};

module.exports = graveyard;