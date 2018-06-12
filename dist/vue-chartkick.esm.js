/*
 * Vue Chartkick
 * Create beautiful JavaScript charts with one line of Vue
 * https://github.com/ankane/vue-chartkick
 * v0.3.3
 * MIT License
 */

import Chartkick from 'chartkick';
import deepEqual from 'deep-equal';

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
      if (!deepEqual(currentState, this.savedState)) {
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

export default VueChartkick;
