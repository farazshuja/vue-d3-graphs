import ExamAPI from '../api/examAPI'

export default {
  setFullReport ({commit}) {
    ExamAPI.getFullReport()
      .then(({data}) => {
        commit('setFullReport', data)
        const report = {
          finalMetrics: data.finalMetrics,
          timeMetrics: data.timeMetrics
        }
        commit('setReport', report)
      })
      .catch(err => console.log(err))
  },
  setReport ({commit}) {
    ExamAPI.getReport()
      .then(({data}) => {
        commit('setReport', data)
      })
      .catch(err => console.log(err))
  },
  setVideo ({commit}) {
    ExamAPI.getVideo()
      .then(({data}) => {
        commit('setVideo', data)
      })
      .catch(err => console.log(err))
  },
  setVideoIsAtTime ({commit}, time) {
    const mod = time % 1000
    commit('setVideoIsAtTime', time - mod)
    commit('setVideoIsAtTimeFine', time)
  },
  setQuestions ({commit}, questions) {
    ExamAPI.getQuestions()
      .then(({data}) => {
        commit('setQuestions', data)
      })
      .catch(err => console.log(err))
  }
}
