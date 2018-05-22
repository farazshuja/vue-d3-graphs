import axios from 'axios'

// Root of the the API
// const API_URL = 'https://aime.textpert.ai/exam'
const API_URL = '/src/data'

const examAPI = {
  getFullReport (id = 'fake-exam-id') {
    return axios.get(`${API_URL}/${id}.json`)
  },
  getReport (id = 'fake-exam-id') {
    return axios.get(`${API_URL}/${id}/report`)
  },
  getVideo (id = 'fake-exam-id', videoId = '5adf997c55a7981e0f7870c6') {
    return axios.get(`${API_URL}/${id}/video/${videoId}/transcript`)
  },
  getQuestions (questionsId = 'questions.json') {
    return axios.get(`${API_URL}/${questionsId}`)
  }
}

export default examAPI
