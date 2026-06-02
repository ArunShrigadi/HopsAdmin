void 0 === window.navatticQueue && (
  window.navatticQueue = [],
  window.navattic = new Proxy({}, {
    get: function n(t, u, e) {
      return function() {
        for (var n = arguments.length, t = Array(n), e = 0; e < n; e++) {
          t[e] = arguments[e];
        }
        return navatticQueue.push({ function: u, arguments: t });
      };
    }
  })
);