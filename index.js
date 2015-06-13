'use strict';

var graveyard = function (ignore) {
  var cache = []; // should be moved to something beyond memory

  if (typeof ignore === 'string') {
    ignore = [ignore];
  }

  if (!ignore) {
    ignore = [];
  }

  return function (req, res, next) {
    // if we have a hit on the cache, return the 410 early.
    var url = req.url.replace(/\?.*$/g, '');

    if (ignore.indexOf(url) !== -1) {
      return next();
    }

    if (cache.indexOf(url) !== -1) {
      return next(410);
    }

    // otherwise, attach to the headers being sent, and check if it's a 410
    res.on('header', function () {
      if (res.statusCode === 410) {
        // add to cache
        cache.push(url);
      }
    });

    next();
  };
};

module.exports = graveyard;
