/*
 * Vue Chartkick
 * Create beautiful JavaScript charts with one line of Vue
 * https://github.com/ankane/vue-chartkick
 * v0.3.3
 * MIT License
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('chartkick')) :
	typeof define === 'function' && define.amd ? define(['chartkick'], factory) :
	(global.VueChartkick = factory(global.Chartkick));
}(this, (function (Chartkick) { 'use strict';

	Chartkick = Chartkick && Chartkick.hasOwnProperty('default') ? Chartkick['default'] : Chartkick;

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var keys = createCommonjsModule(function (module, exports) {
	exports = module.exports = typeof Object.keys === 'function'
	  ? Object.keys : shim;

	exports.shim = shim;
	function shim (obj) {
	  var keys = [];
	  for (var key in obj) { keys.push(key); }
	  return keys;
	}
	});
	var keys_1 = keys.shim;

	var is_arguments = createCommonjsModule(function (module, exports) {
	var supportsArgumentsClass = (function(){
	  return Object.prototype.toString.call(arguments)
	})() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}
	exports.unsupported = unsupported;
	function unsupported(object){
	  return object &&
	    typeof object == 'object' &&
	    typeof object.length == 'number' &&
	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
	    false;
	}});
	var is_arguments_1 = is_arguments.supported;
	var is_arguments_2 = is_arguments.unsupported;

	var deepEqual_1 = createCommonjsModule(function (module) {
	var pSlice = Array.prototype.slice;



	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) { opts = {}; }
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	  // 7.3. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
	    return opts.strict ? actual === expected : actual == expected;

	  // 7.4. For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	};

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer (x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') { return false; }
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') { return false; }
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    { return false; }
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) { return false; }
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (is_arguments(a)) {
	    if (!is_arguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) { return false; }
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) { return false; }
	    }
	    return true;
	  }
	  try {
	    var ka = keys(a),
	        kb = keys(b);
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    { return false; }
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      { return false; }
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) { return false; }
	  }
	  return typeof a === typeof b;
	}
	});

	var chartId = 1;

	var createComponent = function(Vue, tagName, chartType) {
	  var chartProps = [
	    "colors", "curve", "dataset", "decimal", "discrete", "donut", "download", "label",
	    "legend", "library", "max", "messages", "min", "points", "prefix", "refresh",
	    "stacked", "suffix", "thousands", "title", "xtitle", "xtype", "ytitle"
	  ];
	  Vue.component(tagName, {
	    props: ["data", "id", "width", "height"].concat(chartProps),
	    render: function(createElement) {
	      return createElement(
	        "div",
	        {
	          attrs: {
	            id: this.chartId
	          },
	          style: this.chartStyle
	        },
	        ["Loading..."]
	      )
	    },
	    data: function() {
	      return {
	        chartId: null
	      }
	    },
	    computed: {
	      chartStyle: function() {
	        // hack to watch data and options
	        this.data;
	        this.chartOptions;

	        return {
	          height: this.height || "300px",
	          lineHeight: this.height || "300px",
	          width: this.width || "100%",
	          textAlign: "center",
	          color: "#999",
	          fontSize: "14px",
	          fontFamily: "'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif"
	        }
	      },
	      chartOptions: function() {
	        var this$1 = this;

	        var options = {};
	        var props = chartProps;
	        for (var i = 0; i < props.length; i++) {
	          var prop = props[i];
	          if (this$1[prop] !== undefined) {
	            options[prop] = this$1[prop];
	          }
	        }
	        return options
	      }
	    },
	    created: function() {
	      this.chartId = this.chartId || this.id || ("chart-" + chartId++);
	    },
	    mounted: function() {
	      this.chart = new chartType(this.chartId, this.data, this.chartOptions);
	      this.savedState = this.currentState();
	    },
	    updated: function() {
	      // avoid updates when literal objects are used as props
	      // see https://github.com/ankane/vue-chartkick/pull/52
	      // and https://github.com/vuejs/vue/issues/4060
	      var currentState = this.currentState();
	      if (!deepEqual_1(currentState, this.savedState)) {
	        this.chart.updateData(this.data, this.chartOptions);
	        this.savedState = currentState;
	      }
	    },
	    beforeDestroy: function() {
	      if (this.chart) {
	        this.chart.destroy();
	      }
	    },
	    methods: {
	      currentState: function() {
	        return {
	          data: this.data,
	          chartOptions: this.chartOptions
	        }
	      }
	    }
	  });
	};

	var VueChartkick = {
	  version: "0.3.3",
	  install: function(Vue, options) {
	    if (options && options.adapter) {
	      Chartkick.addAdapter(options.adapter);
	    }
	    createComponent(Vue, "line-chart", Chartkick.LineChart);
	    createComponent(Vue, "pie-chart", Chartkick.PieChart);
	    createComponent(Vue, "column-chart", Chartkick.ColumnChart);
	    createComponent(Vue, "bar-chart", Chartkick.BarChart);
	    createComponent(Vue, "area-chart", Chartkick.AreaChart);
	    createComponent(Vue, "scatter-chart", Chartkick.ScatterChart);
	    createComponent(Vue, "geo-chart", Chartkick.GeoChart);
	    createComponent(Vue, "timeline", Chartkick.Timeline);
	    createComponent(Vue, "combochart", Chartkick.ComboChart);
	  },
	  addAdapter: function(library) {
	    Chartkick.addAdapter(library);
	  }
	};

	// in browser
	if (typeof window !== "undefined" && window.Vue) {
	  window.Vue.use(VueChartkick);
	}

	return VueChartkick;

})));
