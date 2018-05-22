import * as d3 from 'd3'

const ChartGradientBar = function (selector) {
  const width = 400 // chart width
  const height = 210 // chart height
  const barRadius = 30 // bar height will double

  const el = d3.select(selector)
  const svg = el.append('svg')
    .attr('class', 'chart-gradient-bar')
    .attr('viewBox', `0 0 ${width} ${height}`)

  const chart = svg.append('g')

  chart.append('circle')
    .attr('cx', barRadius)
    .attr('cy', height / 2)
    .attr('r', barRadius)
    .attr('fill', '#ff6661')

  chart.append('circle')
    .attr('cx', width - barRadius)
    .attr('cy', height / 2)
    .attr('r', barRadius)
    .attr('fill', '#ff6661')

  chart.append('rect')
    .attr('x', barRadius)
    .attr('y', height / 2 - barRadius)
    .attr('width', width - (barRadius * 2))
    .attr('height', barRadius * 2)
    .attr('fill', 'url(#rectGradient)')

  const lineBase = height / 2 - barRadius
  chart.append('line')
    .attr('class', 'needle-pin')
    .attr('x1', width * 0.3)
    .attr('y1', lineBase - 10)
    .attr('x2', width * 0.3)
    .attr('y2', lineBase + (barRadius * 2) + 10)

  chart.append('line')
    .attr('class', 'needle-pin')
    .attr('x1', width * 0.7)
    .attr('y1', lineBase - 10)
    .attr('x2', width * 0.7)
    .attr('y2', lineBase + (barRadius * 2) + 10)

  chart.append('text')
    .attr('class', 'chart-gauge-legend')
    .attr('x', 0)
    .attr('y', height * 0.72)
    .text('0%')

  chart.append('text')
    .attr('class', 'chart-gauge-legend')
    .attr('x', width - 42)
    .attr('y', height * 0.72)
    .text('100%')

  const arrow = chart.append('polygon')
    .attr('class', 'arrow')

  const valueText = chart.append('text')
    .attr('class', 'chart-gauge-value')
    .text('')

  function animateOn (perc, oldPerc = 0, delay = 500, ease = d3.easeElastic, duration = 2000) {
    const triWidth = 32
    const triHeight = 35
    let triX = 0
    const triY = height * 0.53
    const ratio = width / 100
    // calculate domain range using slop equation y = mx + b
    let m = perc - oldPerc
    const b = oldPerc

    el.transition().delay(delay).ease(ease).duration(duration).selectAll('.needle-pin').tween('progress', function () {
      return function (percentOfPercent) {
        const progress = (m * percentOfPercent) + b
        triX = progress * ratio * 100
        arrow.attr('points', `${triX + (triWidth / 2)},${triY} ${0 + triX},${triHeight + triY} ${triWidth + triX},${triHeight + triY}`)
        valueText.text(Math.round(triX / ratio) + '%')
          .attr('x', triX + (triWidth / 2))
          .attr('y', triY + triHeight + 25)
      }
    })
  }

  function moveTo (perc, oldPerc) {
    animateOn(perc, oldPerc, 0, d3.easeCubicOut, 1000)
  }

  var defs = svg.append('defs')

  var leftCircle = defs.append('linearGradient').attr('id', 'leftCircle')
  leftCircle.append('stop').attr('class', 'start').attr('offset', '0%').attr('stop-color', '#ff6661')
  leftCircle.append('stop').attr('class', 'start').attr('offset', '75%').attr('stop-color', '#fe8560')

  var rightCircle = defs.append('linearGradient').attr('id', 'rightCircle')
  rightCircle.append('stop').attr('class', 'start').attr('offset', '0%').attr('stop-color', '#fe8560')
  rightCircle.append('stop').attr('class', 'start').attr('offset', '75%').attr('stop-color', '#ff6661')

  var rectGradient = defs.append('linearGradient').attr('id', 'rectGradient')
  rectGradient.append('stop').attr('class', 'start').attr('offset', '0%').attr('stop-color', '#ff6661')
  rectGradient.append('stop').attr('class', 'start').attr('offset', '15%').attr('stop-color', '#fccb5f')
  rectGradient.append('stop').attr('class', 'start').attr('offset', '30%').attr('stop-color', '#cefa5e')
  rectGradient.append('stop').attr('class', 'start').attr('offset', '50%').attr('stop-color', '#6cf85d')
  rectGradient.append('stop').attr('class', 'start').attr('offset', '70%').attr('stop-color', '#cefa5e')
  rectGradient.append('stop').attr('class', 'start').attr('offset', '85%').attr('stop-color', '#fccb5f')
  rectGradient.append('stop').attr('class', 'start').attr('offset', '100%').attr('stop-color', '#ff6661')

  return {
    animateOn,
    moveTo
  }
}

export default ChartGradientBar
