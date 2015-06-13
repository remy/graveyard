'use strict';
/*global describe:true, it: true */
var test = require('tape');
var graveyard = require('../');

test('graveyard default', function (t) {
  t.plan(2);
  var mw = graveyard();

  var req = {
    url: '/foo?bar=10',
  };

  var callback;

  var res = {
    statusCode: 200,
    on: function (event, handler) {
      callback = function () {
        handler();
        t.ok(res.statusCode !== 410, 'status is not 410: ' + res.statusCode);
        t.end();
      };
    },
  };

  mw(req, res, function (status) {
    t.ok(status !== 410, 'no 410');
    callback();
  });
});

test('graveyard with ignores', function (t) {
  t.plan(2);
  var mw = graveyard([
    '/foo',
  ]);

  var req = {
    url: '/foo?bar=10',
  };

  var callback;

  var res = {
    statusCode: 410,
    on: function (event, handler) {
      callback = function () {
        handler();
      };
    },
  };

  mw(req, res, function (status) {
    var s = (status || res.statusCode);
    t.ok(s === 410,
      'res.statusCode has not changed: ' + s);
    if (callback) {
      callback();
    }
  });

  res.statusCode = 200;
  mw(req, res, function (status) {
    t.ok((status || res.statusCode) === 200,
      'res.statusCode has not changed: ' + res.statusCode);
    if (callback) {
      callback();
    }
  });

  t.end();

});

test('graveyard caches', function (t) {
  t.plan(2);
  var mw = graveyard();

  var req = {
    url: '/foo?bar=10',
  };

  var callback;

  var res = {
    statusCode: 410,
    on: function (event, handler) {
      callback = function () {
        handler();
      };
    },
  };

  mw(req, res, function (status) {
    t.ok((status || res.statusCode) === 410,
      'res.statusCode has not changed: ' + res.statusCode);
    if (callback) {
      callback();
    }
  });

  res.statusCode = 200;
  mw(req, res, function (status) {
    var s = status || res.statusCode;
    t.ok(s === 410,
      'res.statusCode has changed: ' + s);
    if (callback) {
      callback();
    }
  });

  t.end();

});