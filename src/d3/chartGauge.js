import * as d3 from 'd3'

const ChartGauge = function (selector) {
  const barWidth = 90

  const numSections = 6
  const needleRadius = 12
  const needleLength = 140

  const sectionPerc = 1 / numSections / 2
  const padRad = 0.02

  const chartInset = 10

  let totalPercent = 0.75

  const el = d3.select(selector)

  const width = 400 // el.node().offsetWidth - margin.left - margin.right
  const height = 250
  const radius = Math.max(width, height) / 2

  const percToDeg = (perc) => perc * 360

  const percToRad = (perc) => degToRad(percToDeg(perc))

  const degToRad = (deg) => deg * Math.PI / 180

  const svg = el.append('svg')
    .attr('class', 'chart-gauge')
    .attr('viewBox', `0 0 ${width} ${height}`)

  const chart = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${width / 2})`)

  for (let sectionIndx = 1; sectionIndx <= numSections; sectionIndx++) {
    let arcStartRad = percToRad(totalPercent)
    let arcEndRad = arcStartRad + percToRad(sectionPerc)
    totalPercent += sectionPerc

    let startPadRad = sectionIndx === 0 ? 0 : padRad / 2
    let endPadRad = sectionIndx === numSections ? 0 : padRad / 2

    const innerVariation = (sectionIndx === 1 || sectionIndx === numSections) ? 4 : 0
    let arc = d3.arc()
      .outerRadius(radius - chartInset)
      .innerRadius((radius - chartInset - barWidth) - innerVariation)
      .startAngle(arcStartRad + startPadRad)
      .endAngle(arcEndRad - endPadRad)

    chart.append('path')
      .attr('class', `arc chart-color${sectionIndx}`)
      .attr('d', arc)
  }

  // draw needle
  chart.append('circle')
    .attr('class', 'needle-center')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', needleRadius)

  let needle = chart.append('path')
    .attr('class', 'needle')
    .attr('d', mkCmd(0))

  // draw legend
  chart.append('text')
    .attr('class', 'chart-gauge-legend')
    .attr('x', -190)
    .attr('y', 20)
    .text('0%')

  chart.append('text')
    .attr('class', 'chart-gauge-legend')
    .attr('x', 150)
    .attr('y', 20)
    .text('100%')

  let valText = chart.append('text')
    .attr('class', 'chart-gauge-value')
    .attr('x', 0)
    .attr('y', 40)
    .text('0%')

  function animateOn (perc) {
    el.transition().delay(200).ease(d3.easeElastic).duration(3000).selectAll('.needle').tween('progress', function () {
      return function (percentOfPercent) {
        var progress = percentOfPercent * perc
        valText.text(Math.round(100 * progress) + '%')
        return needle.attr('d', mkCmd(progress))
      }
    })
  }

  function moveTo (perc, oldPerc = 0) {
    // calculate domain range using slop equation y = mx + b
    let m = perc - oldPerc
    const b = oldPerc
    el.transition().duration(1000).selectAll('.needle').tween('progress', function () {
      return function (percentOfPercent) {
        const progress = (m * percentOfPercent) + b
        valText.text(Math.round(100 * progress) + '%')
        return needle.attr('d', mkCmd(progress))
      }
    })
  }

  function mkCmd (perc) {
    let thetaRad = percToRad(perc) / 2

    let centerX = 0
    let centerY = 0

    let topX = centerX - needleLength * Math.cos(thetaRad)
    let topY = centerY - needleLength * Math.sin(thetaRad)

    let leftX = centerX - needleRadius * Math.cos(thetaRad - Math.PI / 2)
    let leftY = centerY - needleRadius * Math.sin(thetaRad - Math.PI / 2)

    let rightX = centerX - needleRadius * Math.cos(thetaRad + Math.PI / 2)
    let rightY = centerY - needleRadius * Math.sin(thetaRad + Math.PI / 2)

    return `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`
  }

  return {
    animateOn,
    moveTo
  }
}

export default ChartGauge
