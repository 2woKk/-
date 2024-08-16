
<script setup lang="ts">
import { ref, onMounted, watch, shallowReactive } from 'vue'
import { videoList, videoSelected,delvideolist } from '../store'
// @ts-ignore
import VideoListComponent from './VideoListComponent.vue'
// @ts-ignore
import VideoAddFrame from './VideoAddFrame.vue'


const videoDom = ref<HTMLVideoElement | null>(null)
let video: HTMLVideoElement
onMounted(() => {
  videoDom.value!.addEventListener('loadeddata', () => {
    videoList[videoSelected.value].duration = videoDom.value!.duration
  })
  videoDom.value!.addEventListener('pause', () => {
    videoList[videoSelected.value].playStatus = false
  })
  video = document.getElementById('video') as HTMLVideoElement
})
watch(
  () => videoList.length,
  newV => {
    videoSelected.value = newV - 1
  }
)

watch(
  () => videoList[videoSelected.value]?.playStatus,
  newV => {
    if (newV) {
      videoDom.value!.play()
    } else {
      videoDom.value!.pause()
    }
  }
)
const changeVideo = (index: number) => {
  videoList[videoSelected.value].playStatus = false
  videoSelected.value = index

}
const playOrPause = () => {
  videoList[videoSelected.value].playStatus =
    !videoList[videoSelected.value].playStatus
}

const fullScreen = () => {
  if (video.requestFullscreen) {
    video.requestFullscreen()
  }
}
const props = defineProps(['videospeed', 'videovolume'])
</script>

<template>
  <div v-if="!videoList[videoSelected]" style="
      width: 890px;
      height: 400px;
      text-align: center;
      border: 1px inset #e8e1e1;
      margin: 10px;
      border-radius: 6px;
      color: #fff;
    " id="videolist">
    视频显示区, 待上传视频
  </div>
  <div class="iconplace">
    <img src="../assets/image/Play.png" @click="playOrPause" style="width: 30px; 
        height: 30px; cursor: pointer; ">
    <IEpVideoPlay v-if="!videoList[videoSelected]?.playStatus" />
    <IEpVideoPause v-else />
    <img src="../assets/image/Full screen.png" :size="20"
      style="height: 38px; width: 38px; margin-top: -4px ; margin-left: 10px; cursor: pointer;;" @click="fullScreen">
    <IEpFullScreen />
  </div>
  <div class="showvideo">
    <video v-show="videoList[videoSelected]" id="video" ref="videoDom" crossOrigin="anonymous"
      :src="videoList[videoSelected]?.videoUrl" style="padding: 3px; width: 890px; height: 400px;
      border: 1px inset #e8e1e1;
      margin: 10px;
      border-radius: 6px;"></video>
  </div>
  <VideoAddFrame></VideoAddFrame>
  <div class="h-c-list">
    视频：<VideoListComponent :list="videoList" :selected="videoSelected" @switch="changeVideo"
      style="height: 90px; flex: 1;background-color: rgba(44, 49, 58, 1);"></VideoListComponent>
  </div>
</template>
<style scoped>
.h-c-list {
  position: absolute;
  top: 106%;
  left: 0%;
  align-items: center;
  width: 920px;
  z-index: 999;

  color: #fff;
}

.iconplace {
  position: absolute;
  top: 99.8%;
  left: 45%;
  z-index: 999;
  display: flex;
}

@media all and (max-width: 1550px) {
  #videolist {
    transform: scaleX(0.99);
    transform-origin: left;
  }

  #video {
    transform: scaleX(0.99);
    transform-origin: left;
  }
}

@media all and (max-width: 1529px) {
  #videolist {
    transform: scaleX(0.95);
    transform-origin: left;
  }

  #video {
    transform: scaleX(0.95);
    transform-origin: left;
  }
}

@media all and (max-width: 1480px) {
  #videolist {
    transform: scaleX(0.92);
    transform-origin: left;
  }

  #video {
    transform: scaleX(0.92);
    transform-origin: left;
  }
}

@media all and (max-width: 1432px) {
  #videolist {
    transform: scaleX(0.90);
    transform-origin: left;
  }

  #video {
    transform: scaleX(0.90);
    transform-origin: left;
  }
}

@media all and (max-width: 1480px) {
  #videolist {
    transform: scaleX(0.90);
    transform-origin: left;
  }

  #video {
    transform: scaleX(0.90);
    transform-origin: left;
  }
}

@media all and (max-width: 1400px) {
  #videolist {
    transform: scaleX(0.85);
    transform-origin: left;
  }

  #video {
    transform: scaleX(0.85);
    transform-origin: left;
  }
}
</style>