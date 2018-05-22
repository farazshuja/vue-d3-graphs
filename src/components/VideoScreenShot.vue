<template>
  <video ref="videoPlayer">
    <source :src="videoSrc" type="video/webm">
  </video>
</template>

<script>
export default {
  props: ['seekTo', 'videoSrc'],
  watch: {
    seekTo () {
      this.$refs.videoPlayer.currentTime = this.seekTo
    }
  }
}
</script>

