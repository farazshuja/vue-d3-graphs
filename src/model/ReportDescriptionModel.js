const ReportDescription = (reportName, value) => {
  value = Math.ceil(value * 100)
  if (reportName === 'depressionRisk') {
    return `Patient is currently showing symptoms at a ${value}% risk of clinical depression`
  }

  if (reportName === 'anxietyRisk') {
    return `Patient is currently showing symptoms at a ${value}% risk of clinical anxiety`
  }

  if (reportName === 'opioidAddictionRisk') {
    return `Patient is currently showing symptoms at a ${value}% risk of clinical opioid addiction`
  }

  if (reportName === 'verbalSentiment') {
    if (value <= 15) {
      return 'Patient exhibited unusually negative verbal sentiment'
    }
    if (value <= 30) {
      return 'Patient exhibited somewhat negative verbal sentiment'
    }
    if (value <= 70) {
      return 'Patient exhibited predominantly neutral verbal sentiment'
    }
    if (value <= 85) {
      return 'Patient exhibited somewhat positive verbal sentiment'
    }
    return 'Patient exhibited unusually positive verbal sentiment'
  }

  if (reportName === 'eyeEnergy') {
    if (value <= 15) {
      return 'Patient exhibited unusually low levels of eye energy'
    }
    if (value <= 30) {
      return 'Patient exhibited somewhat low levels of eye energy'
    }
    if (value <= 70) {
      return 'Patient exhibited average levels of eye energy'
    }
    if (value <= 85) {
      return 'Patient exhibited somewhat high levels of eye energy'
    }
    return 'Patient exhibited unusually high levels of eye energy'
  }

  if (reportName === 'inflectionVariance') {
    if (value <= 15) {
      return 'Patient exhibited unusually monotonic speech'
    }
    if (value <= 30) {
      return 'Patient exhibited speech of somewhat limited affect'
    }
    if (value <= 70) {
      return 'Patient exhibited average speech patterns'
    }
    if (value <= 85) {
      return 'Patient exhibited somewhat animated speech patterns'
    }
    return 'Patient exhibited unusually animated speech patterns'
  }

  if (reportName === 'mouthMapping') {
    if (value <= 15) {
      return 'Patient exhibited mouth movements unusually biased toward negative emotions'
    }
    if (value <= 30) {
      return 'Patient exhibited mouth movements somewhat biased toward negative emotions'
    }
    if (value <= 70) {
      return 'Patient exhibited mouth movements indicating no particular emotional bias'
    }
    if (value <= 85) {
      return 'Patient exhibited mouth movements somewhat biased toward positive emotions'
    }
    return 'Patient exhibited mouth movements unusually biased toward positive emotions'
  }

  if (reportName === 'eyeEngagement') {
    if (value <= 15) {
      return 'Patient exhibited unusually low eye engagement'
    }
    if (value <= 30) {
      return 'Patient exhibited somewhat low eye engagement'
    }
    if (value <= 70) {
      return 'Patient exhibited average eye engagement'
    }
    if (value <= 85) {
      return 'Patient exhibited somewhat high eye engagement'
    }
    return 'Patient exhibited unusually high eye engagement'
  }

  if (reportName === 'modalityDissonance') {
    if (value <= 60) {
      return 'Patient’s verbals and nonverbals are complementary'
    }
    if (value <= 80) {
      return 'Patient’s verbals and nonverbals are somewhat contradictory'
    }
    return 'Patient’s verbals and nonverbals are highly contradictory'
  }

  return '[No description]'
}

export const ReportSummary = ({finalMetrics}) => {
  let data = finalMetrics.reduce((last, metric) => {
    let value = Math.ceil(metric.metricValue * 100)
    let property = metric.metricName
    let risk = 'high'

    if (property === 'modalityDissonance') {
      risk = value <= 60 ? 'complementary with'
        : value <= 80 ? 'somewhat dissonant from' : 'vastly dissonant from'
    } else {
      risk = value <= 25 ? 'low'
        : value <= 65 ? 'moderate' : 'high'
    }

    last[property] = {
      value,
      risk
    }

    return last
  }, {})

  return `
Patient showed ${data['depressionRisk'].risk} risk of depression, ${data['anxietyRisk'].risk} risk of anxiety,
and ${data['opioidAddictionRisk'].risk} risk of opioid addiction.
`

  // return `Patient showed ${data['depressionRisk'].risk} risk of depression and ${data['anxietyRisk'].risk} risk of anxiety. Verbal sentiment indicated an overall ${data['verbalSentiment'].risk} tone. Patient showed ${data['eyeEngagement'].risk} levels of engagement,
  //   and ${data['eyeEnergy'].risk} levels of energy. Speech content of patient was ${data['modalityDissonance'].risk} verbal tone.`
}

export default ReportDescription
