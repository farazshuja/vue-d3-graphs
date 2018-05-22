<template>
  <div class="report-instance">
    <h2 class="report-instance__title mt-0">
      {{name | sentenceCase}}
      <!--<i class="fa fa-question-circle-o"></i>-->
    </h2>
    <div class="report-instance__graph" :class="layoutClass">
      <component :is="graph" :value="value"></component>
      <div class="report-instance__text">
        <p class="round-bg mb-0">{{description}}</p>
      </div>
    </div>
  </div>
</template>

<script>
// import Gauge from '../d3/gauge.js'
import ChartGauge from '../components/ChartGauge'
import ChartGradientGauge from '../components/ChartGradientGauge'
import ChartGradientBar from '../components/ChartGradientBar'
import ChartBars from '../components/ChartBars'
import ReportDescription from '../model/ReportDescriptionModel'
import GraphNameByType from '../helper/GraphNameByType'

export default {
  props: ['result', 'type', 'layoutClass', 'name', 'average', 'legend'],
  computed: {
    value () {
      const metric = this.$store.state.report.finalMetrics.filter(m => m.metricName === this.name)
      const _value = metric[0] ? metric[0].metricValue : 0
      if (this.average) {
        return {
          value: _value,
          average: this.average,
          legend: this.legend
        }
      }
      return _value
    },
    graph () {
      return GraphNameByType(this.name)
    },
    description () {
      return ReportDescription(this.name, this.value)
    }
  },
  components: {
    ChartGauge,
    ChartGradientGauge,
    ChartGradientBar,
    ChartBars
  }
}
</script>
<style>
  .report-instance {
    max-width: 400px;
    margin: auto;
  }
  .report-instance__title {
    color: #8a8989;
    font-size: 2.6rem;
    margin: 20px 0;
  }
  .report-instance__text {
    width: 100%;
  }
  .report-instance__text p {
    min-height: 70px;
  }
  .report-instance__title .fa {
    font-size: 2.0rem;
    position: relative;
    top: -10px;
    cursor: pointer;
  }

  .report-instance__graph.chart--column {
    flex-direction: column;
  }
  .report-instance__graph.chart--column .report-instance__text {
    width: 100%;
  }

  @media screen and (max-width: 1023px) {
    .report-instance__graph {
      flex-direction: column;
    }
  }

  /* Graphs */
  .chart-container {
    width: 100%;
    padding: 0 10px;
  }
  .chart-color1 {
    fill: #72dc54;
  }
  .chart-color2 {
    fill: #cfec73;
  }
  .chart-color3 {
    fill: #fcef57;
  }
  .chart-color4 {
    fill: #ffb67a;
  }
  .chart-color5 {
    fill: #ef8f75;
  }
  .chart-color6 {
    fill: #ba1a1a;
  }
  .needle,
  .needle-center,
  .arrow,
  .chart-gauge-legend,
  .chart-gauge-value {
    fill: #9d9d9d;
  }
  .needle-pin {
    fill: #9d9d9d;
    stroke: #9d9d9d;
    stroke-width: 2;
  }

  .chart-gauge-legend {
    font-size: 16px;
  }
  .chart-gauge-value {
    font-size: 26px;
    text-anchor: middle;
  }
  .bar-average { 
    fill: #b5e3e2;
  }
  .bar-patient {
    fill: #49c3c0;
  }
  .text-end {
    text-anchor: end;
  }

  .chart-bars-axis--x path.domain, .chart-bars-axis--x line {
    display: none;
  }
  .chart-bars-axis--x .tick text{
    font-size: 1.8rem;
    fill: #fff !important;    
  }

</style>

