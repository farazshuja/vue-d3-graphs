import * as d3 from 'd3'

const ChartBars = function (selector, chartData) {
  const width = 400 // chart width
  const height = 210 // chart height
  const margin = { left: 100, top: 0 }
  const titleArray = ['Average', 'Patient']
  const _data = [chartData.average, chartData.value]
  const legend = chartData.legend.slice()

  const el = d3.select(selector)
  const svg = el.append('svg')
    .attr('class', 'chart-bars')
    .attr('viewBox', `0 0 ${width} ${height}`)

  svg.append('g')

  var x = d3.scaleBand().rangeRound([0, width - margin.left]).padding(0)
  var y = d3.scaleLinear().rangeRound([height, 0])

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  x.domain(titleArray)
  y.domain([0, 1])

  g.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', height)
    .attr('stroke', '#d1d1d1')

  var baseLegend = svg.append('g')
    .attr('transform', `translate(${margin.left - 10},${height - 15})`)

  baseLegend.append('text')
    .attr('class', 'chart-gauge-legend text-end')
    .attr('x', 0)
    .attr('y', 0)
    .text(legend[0])
    .attr('transform', 'rotate(-10)')

  var topLegend = svg.append('g')
    .attr('transform', `translate(${margin.left - 10},${15})`)

  topLegend.append('text')
    .attr('class', 'chart-gauge-legend text-end')
    .attr('x', 0)
    .attr('y', 0)
    .text(legend[1])
    .attr('transform', 'rotate(-10)')

  g.selectAll('.bar')
    .data(_data)
    .enter().append('rect')
    .attr('class', (d, i) => `bar-${titleArray[i].toLowerCase()}`)
    .attr('x', function (d, i) { return x(titleArray[i]) })
    .attr('y', function (d, i) { return y(d) })
    .attr('height', function (d) { return height - y(d) })
    .attr('width', x.bandwidth())

  // pass the value of patient only
  function animateOn (value, oldValue, duration = 1000, ease = d3.easeExp) {
    let data = [_data[0], value]
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', (d, i) => i === 0 ? 'bar-average' : 'bar-patient')
      .attr('x', function (d, i) {
        return x(titleArray[i])
      })
      .attr('y', height)
      .transition().duration(duration)
      .ease(ease)
      .attr('y', function (d) { return y(d) })
      .attr('height', function (d) { return height - y(d) })
      .attr('width', x.bandwidth())

    g.selectAll('.chart-bars-axis--x').remove()
    const bottomAxis = g.append('g')
      .attr('class', 'chart-bars-axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

    bottomAxis.selectAll('.tick text').attr('y', -20)
  }

  function moveTo(data, oldData) {
    animateOn(data, oldData, 150, d3.easeLinear)
  }

  return {
    animateOn,
    moveTo
  }
}

export default ChartBars
