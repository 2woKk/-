
<script lang="ts" setup>
import { gVideoFrame } from '../module/useFfmpeg'
import { videoList, videoSelected } from '../store'
import { interval } from '../utils/string'

const btnClick = async () => {
  const selectedVideo = videoList[videoSelected.value]
  let tmp
  // selectedVideo.frameList = []
  try {
    tmp = await gVideoFrame(
      selectedVideo.videoUrl!,
      interval(selectedVideo.duration),
      selectedVideo.fileName
    )
  } catch (error) {
    return
  }

  selectedVideo.frameList = tmp
}
</script>

<template>
  <button @click="btnClick" id="video"> {{ '视频取帧' }} </button>
</template>
<style scoped>
#video{
  position: absolute;
  margin: auto;
  top: 99.2%;
  right: 6%;
  width: 37px;
  height: 37px;
  border-radius: 30%;
  color: white;
  background-color: rgba(41, 128, 227, 1);
  border: none;
  z-index: 999;
  cursor: pointer;
}

@media all and (max-width: 1480px) {
  #video{
    right: 10%;
  }
}
</style>
