// import {ParseReport} from '../helper/helper'

export default {
  setFullReport (state, report) {
    state.fullReport = report
  },
  setReport (state, report) {
    report.timeMetrics.map(tm => {
      tm.checked = false
      return tm
    })
    state.report = report
  },
  setVideo (state, video) {
    state.video = video
  },
  setVideoIsAtTime (state, time) {
    state.videoIsAtTime = time
  },

  /** For fine-grained video time. */
  setVideoIsAtTimeFine (state, time) {
    state.videoIsAtTimeFine = time
  },

  setVideoDurationMillis (state, videoDurationMillis) {
    state.videoDurationMillis = videoDurationMillis
  },
  setQuestions (state, questions) {
    state.questions = questions
  }
}
