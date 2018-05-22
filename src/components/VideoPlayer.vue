<template>
  <div class="video-player" v-if="videoSrc">
    <div class="video-wrapper">
      <transition name="fade">
        <div class="play-btn-overlay" v-if="showPlayBtn">
          <div class="play-btn"></div>
        </div>
      </transition>
      <video class="br-20" ref="videoPlayer"
        @click="playPause"
        @play="onVideoPlay"
        @pause="onVideoPause">
          <source :src="videoSrc" type="video/webm">
      </video>
    </div>
    <div class="video-controls">
        <div class="timestamp">{{timestamp}}</div>
        <div 
          @mousemove="mouseOverProgressBar"
          @mouseout="mouseOutProgressBar"
          @click="scrabberClicked"
          ref="progressHolder" class="progress">  
          <div ref="progressBox" class="progress-box" :style="{'width': progress + '%'}"></div>
        </div>
        <div class="video-markers">
            <div class="video-marker"
              v-for="marker in qMarkers"
              :key="marker.questionNum"
              :style="{'left': marker.left + '%'}"
              @mouseover="onMarkerMouseOver(marker)"
              @mouseout="onMarkerMouseOut(marker)">
              <span>Q{{marker.questionNum}}</span>
              <p v-if="marker.showLabel" class="video-marker-label">{{marker.question}}</p>
            </div>
        </div>
        <div v-if="isScreenShotVisible" class="screenshot" :style="{'left': shotLeft + 'px'}">
          <video-screen-shot :videoSrc="videoSrc" :seekTo="screenShotAt"></video-screen-shot>
          {{hoverTime}}
        </div>
    </div>    
  </div>
</template>

<script>
import format from 'format-duration'
import VideoScreenShot from './VideoScreenShot'
export default {
  data () {
    return {
      playProgressInterval: null,
      timestamp: '0:00',
      hoverTime: '0:00',
      progress: 0,
      totalDuration: null,
      isScreenShotVisible: false,
      screenShotAt: 0,
      shotLeft: 0,
      qMarkers: [],
      showPlayBtn: true
    }
  },
  computed: {
    videoSrc () {
      return 'src/data/video.mp4'
    }
  },
  components: {
    VideoScreenShot
  },
  methods: {
    playPause () {
      let video = this.$refs.videoPlayer
      if (video.paused || video.ended) {
        if (video.ended) {
          video.currentTime = 0
        }
        video.play()
      } else {
        video.pause()
      }
    },
    onVideoPlay () {
      this.showPlayBtn = false
      this.trackVideoPlay()
    },
    onVideoPause () {
      clearTimeout(this.playProgressInterval)
    },
    scrabberClicked (e) {
      const mouseX = e.pageX - this.findPosX()
      const boxWidth = this.$refs.progressHolder.offsetWidth
      const time = (this.totalDuration / boxWidth) * mouseX
      this.$refs.videoPlayer.currentTime = time
      this.updatePlayProgress()
    },
    mouseOverProgressBar (e) {
      this.isScreenShotVisible = true
      const mouseX = e.pageX - this.findPosX()
      this.shotLeft = mouseX - 40
      const boxWidth = this.$refs.progressHolder.offsetWidth
      const time = (this.totalDuration / boxWidth) * mouseX
      const milliseconds = time * 1000
      this.hoverTime = format(milliseconds)
      this.screenShotAt = time
    },
    mouseOutProgressBar () {
      this.isScreenShotVisible = false
    },
    onMarkerMouseOver (marker) {
      marker.showLabel = true
    },
    onMarkerMouseOut (marker) {
      marker.showLabel = false
    },
    trackVideoPlay () {
      this.updatePlayProgress()
      this.playProgressInterval = setTimeout(this.trackVideoPlay, 50)
    },
    updatePlayProgress () {
      let video = this.$refs.videoPlayer
      let milliseconds = video.currentTime * 1000
      this.timestamp = format(milliseconds)
      this.progress = video.currentTime / video.duration * 100
      this.$store.dispatch('setVideoIsAtTime', milliseconds)
    },
    initScrubber () {
      let questions = this.$store.state.questions
      let mergedVideoAnswerTimes = this.$store.state.fullReport.mergedVideoAnswerTimes.slice() // create a copy
      mergedVideoAnswerTimes.unshift(0)

      if (questions.length > 0) {
        this.qMarkers = mergedVideoAnswerTimes.map((timestamp, index) => {
          const seconds = timestamp / 1000
          return {
            questionNum: index + 1,
            question: questions[index].question,
            left: seconds / this.totalDuration * 100,
            showLabel: false
          }
        })
      }
    },
    getLoadTime () {
      if (typeof this.totalDuration === 'number' && this.$store.state.questions.length > 0) {
        this.initScrubber()
      } else {
        setTimeout(() => {
          let video = this.$refs.videoPlayer
          if (video && video.readyState > 0) {
            this.totalDuration = video.duration
            this.$store.commit('setVideoDurationMillis', video.duration * 1000)
          }
          this.getLoadTime()
        }, 50)
      }
    },
    findPosX () {
      let progressHolder = this.$refs.progressHolder
      var curleft = 0
      while (progressHolder != null) {
        curleft += progressHolder.offsetLeft
        progressHolder = progressHolder.offsetParent
      }
      return curleft
    }
  },
  mounted () {
    this.getLoadTime()
  }
}
</script>


<style lang="scss">
  .video-wrapper {
    position: relative;
    cursor: pointer;

    .play-btn-overlay {
      background: rgba(#fff, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .play-btn {
        background: url(../assets/img/play-btn.svg) no-repeat center;
        background-size: 100px;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transition: opacity,background-size 200ms;
      }
    }

    &:hover .play-btn {
      opacity: 0.8;
      background-size: 110px;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 200ms;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .video-player {
    video {
      width: 100%;
    }

    .br-20 {
      border-radius: 20px;
    }

    padding-bottom: 50px;
  }

  .video-controls {
    position: relative;
    cursor: pointer;
    z-index: 99;
  }
  .video-controls .progress {
    width: 100%;
    height: 10px;
    background: #bfc2c4;
    position: relative;
  }
  .video-controls .progress .progress-box {
    position: absolute;
    width: 0;
    height: 10px;
    background: #696d6e;
  }
  .video-controls .video-markers {
    position: relative;
    width: 100%;
  }
  .video-controls .video-marker {
    width: 1px;
    height: 30px;
    border-right: 2px dashed rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 0;
    top: 0;
  }
  .video-controls .video-marker span {
    font-size: 12px;
    position: absolute;
    left: -7px;
    bottom: -20px;
  }
  .video-controls .screenshot {
    position: absolute;
    top: -70px;
    width: 100px;
    height: 90px;    
    text-align: center;
    background: #e1e1e1;
    padding: 2px;
    border-radius: 3px;
    font-size: 10px;
  }
  .video-controls .screenshot video {
    width: 100%;
    border: 2px solid #d1d1d1;    
    display: block;
  }
  .video-marker-label {
    background: #aacaca;
    border-radius: 3px;
    color: #333;
    position: absolute;
    width: 150px;
    margin-left: -75px;
    top: -70px;
    padding: 5px;
  }
</style>

