<template>
  <div class="chart-container"></div>  
</template>

<script>
import ChartGradientGauge from '../d3/chartGradientGauge'

export default {
  props: ['value', 'time', 'name'],
  data () {
    return {
      chart: null
    }
  },
  watch: {
    value (newVal) {
      this.chart.animateOn(newVal)
    },
    time (newVal, oldVal) {
      let tm = this.$store.state.report.timeMetrics.filter(tm => tm.metricName === this.name)
      let value = tm[0].metricValueAtMillis[newVal] || 0
      let lastValue = tm[0].metricValueAtMillis[oldVal] || 0
      this.chart.moveTo(value, lastValue)
    }
  },
  mounted () {
    this.chart = ChartGradientGauge(this.$el)
    if (typeof this.time !== 'undefined') {
      this.chart.moveTo(this.time)
    } else {
      this.chart.animateOn(this.value)
    }
  }
}
</script>

<style scoped>
  .chart-container {
    padding-left: 0;
    margin-left: -5px;
  }
</style>