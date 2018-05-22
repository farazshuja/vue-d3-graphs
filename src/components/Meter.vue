<template>
  <div style='text-align: center'>
    <canvas class='meterContainer' style='width: 100%' height='180px'></canvas>
  </div>
</template>

<script>
  import { Gauge } from 'gaugeJS'
  import $ from 'jquery'

  let meter

  const desiredAspectRatio = 0.66580395507199

  export default {
    props: ['value', 'maxValue', 'minValue'],
    mounted () {
      const opts = {
        lines: 1,
        angle: 0,
        lineWidth: 0.5,
        highDpiSupport: true,
        pointer: {
          color: '#151b1e',
          length: 0.5
        },
        percentColors: [[0.0, '#a9d70b'], [0.50, '#f9c802'], [1.0, '#ff0000']],
        strokeColor: '#E0E0E0',
        generateGradient: true
      }

      const target = this.$el.getElementsByClassName('meterContainer')[0]
      meter = new Gauge(target).setOptions(opts)

      meter.setMinValue(0)
      meter.maxValue = 100

      meter.animationSpeed = 32
      this.updateMeterValue()
      this.resizeMeter()

      $(window).bind('resize', this.resizeMeter)
    },
    methods: {
      updateMeterValue () {
        meter.set(parseFloat(this.value))
      },
      resizeMeter () {
        const $meterContainer = $(this.$el).find('.meterContainer:first')
        console.log($meterContainer)
        if (!$meterContainer.length || !meter) {
          return
        }

        const width = $meterContainer.parent().width()
        console.log(width)
        $meterContainer.width(width).height(width * desiredAspectRatio)
        meter.render()
      }
    },
    watch: {
      value (value) {
        meter.set(parseFloat(value))
      }
    },
    beforeDestroy () {
      $(window).unbind('resize', this.resizeMeter)
    }
}
</script>