<template>
  <div class="chart-container">
    <h3>{{metricName}}</h3>
    <svg ref="chartwave" class="chart-waves" :viewBox="`0 0 ${width} ${height}`">
      <g :transform="`translate(0, ${this.height/2})`">
        <line class="needle-pin" x1="0" y1="0" :x2="width" y2="0"></line>
      </g>
      <line class="time-needle" :x1="timeNeedlePosPct + '%'" y1="-50%" :x2="timeNeedlePosPct + '%'" y2="100%"></line>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { sentenceCase } from 'change-case'
import { mapState } from 'vuex'

export default {
  props: ['metric'],
  computed: {
    metricName () {
      let name = ''
      if (this.metric && Array.isArray(this.metric)) {
        name = this.metric.length === 1 ? sentenceCase(this.metric[0].metricName) : 'Overlay Heatmap'
      }
      return name
    },

    timeNeedlePosPct() {
      return (this.videoIsAtTimeFine / this.videoDurationMillis * 100) || 0
    },

    ...mapState(['videoIsAtTimeFine', 'videoDurationMillis'])
  },
  data() {
    return {
      width: 400,
      height: 140
    }
  },
  watch: {
    metric(newVal) {
      this.metric.forEach(m => {
        if (m) {
          this.generateWaves(m)
        }
      })
    }
  },
  methods: {
    generateWaves(metric) {
      if (!metric.metricValueAtMillis) {
        return 0 // do nothing
      }

      const totalLines = this.width / 4 - 20
      const lineStroke = 2

      // get keys and convert to numbers and sort in order
      const keys = Object.keys(metric.metricValueAtMillis).map(k => +k)
      const values = Object.values(metric.metricValueAtMillis)

      const widthToKeys = d3
        .scaleLinear()
        .domain([0, totalLines])
        .range(d3.extent(keys))

      const keysToValues = d3
        .scaleLinear()
        .domain(keys)
        .range(values)

      const y = d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, this.height / 2.5])

      let data = d3.range(0, totalLines)

      const g = d3.select(this.$refs.chartwave).select('g')
      g.selectAll('ellipse.' + metric.metricName).remove()
      g
        .selectAll('ellipse' + metric.metricName)
        .data(data)
        .enter()
        .append('ellipse')
        .attr('class', metric.metricName)
        .attr('cx', (d, i) => i * 5 + lineStroke)
        .attr('cy', 0)
        .attr('ry', d => y(keysToValues(widthToKeys(d))))
        .attr('rx', lineStroke)
    }
  },
  mounted() {
    this.metric.forEach(m => {
      if (m) {
        this.generateWaves(m)
      }
    })
  }
}
</script>

<style lang="scss">
  .chart-waves {
    ellipse.depressionRisk {
      fill: #ff7070;
    }
    ellipse.anxietyRisk {
      fill: #6effa9;
    }
    ellipse.opioidAddictionRisk {
      fill: #1691c0;
    }
  }

  .heatmap-evaluation {
    $border-width: 4px;
    $border-style: solid;
    div.depressionRisk {
      border: $border-width $border-style #ff7070;
    }
    div.anxietyRisk {
      border: $border-width $border-style #6effa9;
    }
    div.opioidAddictionRisk {
      border: $border-width $border-style #1691c0;
    }
  }

  .time-needle {
    stroke: black;
  }
</style>
