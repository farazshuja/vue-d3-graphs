const GraphNameByType = (name) => {
  switch (name) {
  case 'depressionRisk':
  case 'anxietyRisk':
  case 'opioidAddictionRisk': return 'chart-gauge'
  case 'verbalSentiment':
  case 'mouthMapping': return 'chart-gradient-bar'
  case 'eyeEnergy':
  case 'eyeEngagement': return 'chart-gradient-gauge'
  case 'inflectionVariance':
  case 'modalityDissonance': return 'chart-bars'
  default: return 'chart-gauge'
  }
}
export default GraphNameByType
