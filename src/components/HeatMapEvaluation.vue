<template>
  <div class="heatmap-evaluation">
    <h1 class="title">AiME Heatmap Evaluation</h1>
    <!--<div class="row">-->
      <!--<div v-for="metric in metrics" :key="metric.metricName" class="col-lg-3">-->
        <!--<p class="round-bg" :class="{'round-bg&#45;&#45;checked': metric.checked}">-->
          <!--<input type="checkbox" v-model="metric.checked" /> {{metric.metricName | sentenceCase}}-->
        <!--</p>-->
      <!--</div>-->
    <!--</div>-->
    <div class="row">
      <div v-for="metric in metrics" :key="metric.metricName" class="col-lg-4" v-if="metric.checked">
        <div class="chart-box" :class="metric.metricName">
          <h3 class="text-center">{{metric.metricName | sentenceCase}}</h3>
          <component :is="graph(metric.metricName)" :value="getValue(metric.metricName)" :time="time" :name="metric.metricName"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartGauge from '../components/ChartGauge'
import ChartGradientGauge from '../components/ChartGradientGauge'
import ChartGradientBar from '../components/ChartGradientBar'
import ChartBars from '../components/ChartBars'
import GraphNameByType from '../helper/GraphNameByType'

export default {
  props: ['metrics'],
  components: {
    ChartGauge,
    ChartGradientGauge,
    ChartGradientBar,
    ChartBars
  },
  computed: {
    time () {
      return this.$store.state.videoIsAtTime
    }
  },
  methods: {
    conClass (title) {
      return typeof title === 'string' ? [title.toLowerCase().replace(/\s/g, '-')] : null
    },
    graph (name) {
      return GraphNameByType(name)
    },
    getValue (name) {
      const graphType = GraphNameByType(name)
      if (graphType === 'chart-bars') {
        return {
          value: 0,
          average: 0.5,
          legend: name === 'inflectionVariance' ? ['Monotone', 'Animated'] : ['Harmony', 'Dissonance']
        }
      }
      return 0
    },
    getTime (name) {
      let fm = this.$store.state.report.finalMetrics.filter(fm => fm.metricName === name)
      let time = fm[0][this.$store.state.videoTime]
      return time || 0
    }
  }
}
</script>

<style>
  .heatmap-evaluation .chart-box {
    border: 4px solid #ff7070;
    border-radius: 5px;
    min-height: 230px;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    margin: 10px auto;
  }
  .heatmap-evaluation p.round-bg {
    border: 1px solid #d1d1d1;
    background: #fff;
  }
  .heatmap-evaluation p.round-bg--checked {
    background: #cff0f2;
  }
  .heatmap-evaluation svg.chart-bars {
    padding-top: 0px;
  }
  .heatmap-evaluation svg.chart-gradient-bar {
    padding-top: 0px;
  }
  .heatmap-evaluation h3 {
    color: #8a8989;
  }
  .chart-box.depression-risk .chart-container {
    margin: auto;
    width: 80%;
  }
</style>


