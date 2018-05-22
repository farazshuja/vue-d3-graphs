<template>
  <div class="chart-container"></div>  
</template>

<script>
import ChartBars from '../d3/chartBars'

export default {
  props: ['value', 'time', 'name'],
  data () {
    return {
      chart: null
    }
  },
  watch: {
    value (newVal) {
      this.chart.animateOn(newVal.value)
    },
    time (newVal, oldVal) {
      let tm = this.$store.state.report.timeMetrics.filter(tm => tm.metricName === this.name)
      let value = tm[0].metricValueAtMillis[newVal] || 0
      let lastValue = tm[0].metricValueAtMillis[oldVal] || 0
      this.chart.moveTo(value, lastValue)
    }
  },
  mounted () {
    // this.value = { average, value, legend }
    this.chart = ChartBars(this.$el, this.value)

    // animateOn will accept [average, value] type structre
    this.chart.animateOn(this.value.value)
  }
}
</script>
