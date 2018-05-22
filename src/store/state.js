import report from '../model/ReportModel'
import video from '../model/VideoModel'
// const user = {} // Todo

const questions = []
const fullReport = {}

export default {
  videoIsAtTime: 0, // track the played time of video
  videoIsAtTimeFine: 0, // fine-grained time
  fullReport,
  report,
  video,
  videoDurationMillis: 0,
  questions
}
