// Helper/Utility methods to re-structure response coming up from backend into required client side's structure
import moment from 'moment'
import Patient from '../model/patient'
import TimeMetrics from '../model/timeMetrics'

// a random data generator for waves graph, to be remove later once the real API is connected
/* let wavesGenerator = () => {
  let arr = []
  for (let i = 0; i < 200; i++) {
    arr.push(Math.floor(Math.random() * 50))
  }
  return arr
}

function pad(number) {
  return number < 10 ? '0' + number : String(number)
} */

export const ParseReport = (report) => {
  Patient.details = Object.assign(Patient.details, {
    id: report.workerId,
    examDate: moment(report.createdAt).format('MM-DD-YYYY')
  })

  const metrics = report.finalMetrics.reduce((last, metric) => {
    last[metric.metricName] = metric.metricValue
    return last
  }, {})

  const timeMetrics = report.timeMetrics.reduce((last, metric) => {
    last[metric.metricName] = metric.metricValueAtMillis
    return last
  }, {})

  console.log(timeMetrics)

  Patient.depression = Object.assign(Patient.depression, {
    value: metrics['depressionRisk'],
    data: timeMetrics['depressionRisk']
  })

  Patient.anxiety.value = metrics['anxietyRisk']
  Patient.opioidAddiction.value = metrics['opioidAddictionRisk']
  Patient.sentiment.value = metrics['verbalSentiment']
  Patient.eyeEnergy.value = metrics['eyeEnergy']
  Patient.inflectionVariance.value.data[1].value = metrics['inflectionVariance']
  Patient.mouthMapping.value = metrics['mouthMapping']
  Patient.eyeEngagement.value = metrics['eyeEngagement']
  Patient.modality.value.data[1].value = metrics['modalityDissonance']

  return Patient
}

export const ParseTimeMetrics = (timeMetrics) => {
  return TimeMetrics
}
