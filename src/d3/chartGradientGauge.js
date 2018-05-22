import * as d3 from 'd3'

const ChartGradientGauge = function (selector) {
  const barWidth = 20

  const numSections = 1
  const sectionPerc = 1 / numSections / 2
  const padRad = 0
  const chartInset = 20
  let totalPercent = 0.75

  const el = d3.select(selector)

  const width = 400
  const height = 210
  const radius = 170

  const percToDeg = (perc) => perc * 360

  const percToRad = (perc) => degToRad(percToDeg(perc))

  const degToRad = (deg) => deg * Math.PI / 180

  const svg = el.append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)

  const chart = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${width / 2})`)

  for (let sectionIndx = 1; sectionIndx <= numSections; sectionIndx++) {
    let arcStartRad = percToRad(totalPercent)
    let arcEndRad = arcStartRad + percToRad(sectionPerc)
    totalPercent += sectionPerc

    let startPadRad = sectionIndx === 0 ? 0 : padRad / 2
    let endPadRad = sectionIndx === numSections ? 0 : padRad / 2

    let arc = d3.arc()
      .outerRadius(radius - chartInset)
      .innerRadius((radius - chartInset - barWidth))
      .startAngle(arcStartRad + startPadRad)
      .endAngle(arcEndRad - endPadRad)

    chart.append('path')
      .attr('class', `arc`)
      .attr('d', arc)
      .attr('fill', `url(#svgGradient${sectionIndx})`)
  }

  // draw needle
  let needle1 = chart.append('line')
    .attr('class', 'needle-pin')

  // draw legend
  chart.append('text')
    .attr('class', 'chart-gauge-legend')
    .attr('x', -180)
    .attr('y', 1)
    .text('0%')

  chart.append('text')
    .attr('class', 'chart-gauge-legend')
    .attr('x', 160)
    .attr('y', 1)
    .text('100%')

  let valText = chart.append('text')
    .attr('class', 'chart-gauge-value')
    .attr('x', 0)
    .attr('y', 40)
    .text('')

  function animateOn (perc) {
    el.transition().delay(500).ease(d3.easeElastic).duration(3000).selectAll('.needle-pin').tween('progress', function () {
      return function (percentOfPercent) {
        var progress
        progress = percentOfPercent * perc
        valText.text(Math.round(100 * progress) + '%')
        mkCmd(progress)
      }
    })
  }

  function moveTo (perc, oldPerc = 0) {
    // calculate domain range using slop equation y = mx + b
    let m = perc - oldPerc
    const b = oldPerc

    el.transition().duration(150).selectAll('.needle-pin').tween('progress', function () {
      return function (percentOfPercent) {
        const progress = (m * percentOfPercent) + b
        valText.text(Math.round(100 * progress) + '%')
        mkCmd(progress)
      }
    })
  }

  function mkCmd (perc) {
    let thetaRad = percToRad(perc) / 2

    let centerX = 0
    let centerY = 0

    let outerX = centerX - (radius + 5) * Math.cos(thetaRad)
    let outerY = centerY - (radius + 5) * Math.sin(thetaRad)

    let innerX = centerX - (radius - 50) * Math.cos(thetaRad)
    let innerY = centerY - (radius - 50) * Math.sin(thetaRad)

    let valueX = centerX - (radius - 90) * Math.cos(thetaRad)
    let valueY = centerY - (radius - 90) * Math.sin(thetaRad)

    needle1.attr('x1', innerX).attr('y1', innerY).attr('x2', outerX).attr('y2', outerY)
    valText.attr('x', valueX).attr('y', valueY)
  }

  var defs = svg.append('defs')

  var gradient = defs.append('linearGradient')
    .attr('id', 'svgGradient1')
    .attr('x1', '100%')
    .attr('x2', '0%')
    .attr('y1', '0%')
    .attr('y2', '0%')

  gradient.append('stop').attr('class', 'start').attr('offset', '0%').attr('stop-color', '#c61c1c')
  gradient.append('stop').attr('class', 'start').attr('offset', '10%').attr('stop-color', '#e6a23b')
  gradient.append('stop').attr('class', 'start').attr('offset', '20%').attr('stop-color', '#effa55')
  gradient.append('stop').attr('class', 'start').attr('offset', '30%').attr('stop-color', '#8aff79')
  gradient.append('stop').attr('class', 'start').attr('offset', '80%').attr('stop-color', '#effa55')
  gradient.append('stop').attr('class', 'start').attr('offset', '90%').attr('stop-color', '#e6a23b')
  gradient.append('stop').attr('class', 'start').attr('offset', '100%').attr('stop-color', '#c61c1c')

  return {
    animateOn,
    moveTo
  }
}

export default ChartGradientGauge
