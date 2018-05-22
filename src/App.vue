<template>
  <div>
    <page-header :user="user"></page-header>
    <div class="container">
      <h1 class="title mt-5">AiME Results</h1>
      <div class="row pt-2 pb-3">
        <div class="col-lg-4">
          <report-instance name="depressionRisk" />
        </div>
        <div class="col-lg-4">
          <div class="col-sep"></div>
          <report-instance name="anxietyRisk" />
        </div>
        <div class="col-lg-4">
          <div class="col-sep"></div>
          <report-instance name="opioidAddictionRisk" />
        </div>
      </div>
      <!--<div class="row">-->
        <!--<div class="col-lg-4">-->
          <!--<report-instance name="verbalSentiment" />-->
        <!--</div>-->
        <!--<div class="col-lg-4">-->
          <!--<report-instance name="eyeEnergy" />-->
        <!--</div>-->
        <!--<div class="col-lg-4">-->
          <!--<report-instance name="inflectionVariance" :average="0.5" :legend="['Monotone', 'Animated']" />-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="row">-->
        <!--<div class="col-lg-4">-->
          <!--<report-instance name="mouthMapping" />-->
        <!--</div>-->
        <!--<div class="col-lg-4">-->
          <!--<report-instance name="eyeEngagement" />-->
        <!--</div>-->
        <!--<div class="col-lg-4">-->
          <!--<report-instance name="modalityDissonance" :average="0.5" :legend="['Harmony', 'Dissonance']" />-->
        <!--</div>-->
      <!--</div>-->
      <hr />
      <h2 class="title">Patient Summary</h2>
      <div class="row mb-5">
        <div class="col-lg-8">
          <p class="round-bg">
            {{ summary }}
          </p>
        </div>
        <div class="col-lg-4">
          <button type="button" class="btn btn-outline-secondary btn-lg btn-block" @click="viewHeatmaps">
            View Heatmaps
            <i class="fa fa-angle-double-right"></i>
          </button>
          <div class="coming-soon">
            <label>Coming soon!</label>
            <div class="click-guard"></div>
            <div class="mt-2 d-flex blur">
              <button type="button" class="btn btn-outline-secondary flex-grow-1">View Transcript</button>
              <button type="button" class="btn btn-outline-secondary ml-2 mr-2">
                <i class="fa fa-download"></i>
              </button>
              <button type="button" class="btn btn-outline-secondary">
                <i class="fa fa-print"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="showHeatmaps">
        <hr />
        <heatmap-evaluation :metrics="timeMetrics"></heatmap-evaluation>
        <hr />

        <div class="row">
          <div class="col-lg-8">
            <h2 class="title">Patient: {{ user.name }} (#{{ user.id }})</h2>
            <video-player></video-player>
          </div>
          <div class="col-lg-4">
            <chart-waves v-for="tm in timeMetrics" :metric="[tm]" :key="tm.metricName" v-if="tm.checked" />
            <chart-waves :metric="timeMetrics" title="Overlay Heatmap"  />
          </div>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
  import PageHeader from './components/Header.vue'
  import ReportInstance from './components/ReportInstance.vue'
  import HeatmapEvaluation from './components/HeatMapEvaluation.vue'
  import ChartWaves from './components/ChartWaves.vue'
  import VideoPlayer from './components/VideoPlayer.vue'
  import { ReportSummary } from './model/ReportDescriptionModel'
  import $ from 'jquery'
  import Vue from 'vue'

  const defaultMetrics = ['depressionRisk', 'anxietyRisk', 'opioidAddictionRisk']

  export default {
    data () {
      return {
        showHeatmaps: false,
        user: { // TODO get it from backend API
          name: 'John Doe',
          dob: '7-16-1985',
          id: 'Ax18547qsaa91',
          examDate: '1-25-2018'
        }
      }
    },
    computed: {
      summary () {
        return ReportSummary(this.$store.state.report)
      },
      timeMetrics () {
        const showMetrics = []

        for(const metric of this.$store.state.report.timeMetrics) {
          if(defaultMetrics.indexOf(metric.metricName) !== -1) {
            metric.checked = true
            showMetrics.push(metric)
          }
        }

        return showMetrics
      } /* ,
      selectedWaves () {
        let arr = []
        for (var key in this.patient) {
          if (this.patient.hasOwnProperty(key)) {
            let val = this.patient[key]
            if (val.checked) {
              arr.push(val)
            }
          }
        }
        return {
          overlay: arr,
          title: 'Overlay Heatmap'
        }
      } */
    },
    components: {
      PageHeader,
      ReportInstance,
      HeatmapEvaluation,
      ChartWaves,
      VideoPlayer
    },
    methods: {
      async viewHeatmaps() {
        this.showHeatmaps = true

        const $heatmapEl = $('.heatmap-evaluation')
        await Vue.nextTick()
        $('html, body').animate({ scrollTop: $heatmapEl.position().top })
      }
    },
    created () {
      // call report and video APIs and update the store's state
      this.$store.dispatch('setFullReport')
      this.$store.dispatch('setQuestions')
    }
  }
</script>

<style src="../node_modules/bootstrap/dist/css/bootstrap.css"></style>
<style lang="scss" src="scss/styles.scss"></style>

<style>
  .coming-soon {
    position: relative;
  }

  .coming-soon label {
    text-align: center;
    font-weight: bold;
    position: absolute;
    width: 100%;
    top: 3px;
    font-size: 20px;
    color: lightslategray;
  }

  .coming-soon .click-guard {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  }

  .coming-soon .blur {
    filter: blur(1px);
    opacity: 0.35;
  }
</style>