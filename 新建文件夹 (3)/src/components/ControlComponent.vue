<!--
 * @Author: huhaibiao huhaibiao@do-global.com
 * @Date: 2023-04-22 22:21:54
-->
<script setup lang="ts">
import { ref,onMounted,onBeforeUnmount } from 'vue'
import {
  initVideo,
  writeImage,
  getFirstFrame,
} from '../module/useFfmpeg'
import {
  videoList,
  imageList,
  store,
} from '../store'
import ControlBtns from './ControlBtns.vue'


const accept = ref('.mp4')
const videoInput = ref<HTMLInputElement | null>(null)

//点击上传视频
const selectVideo = async () => {
  accept.value = '*'
  setTimeout(() => {
    videoInput.value!.click()
  }, 200)
}
//input上传时处理
const uploadVideo = async (event: any) => {
  const file = event.target.files[0]
  const url = window.webkitURL.createObjectURL(file)
  if (accept.value.includes('image')) {
    await writeImage(file)
    imageList.push({
      url
    })
    return
  }
  //视频
  videoList.push({ videoUrl: '', coverUrl: '' })
  videoInput.value!.value = ''

  //ffmpeg加载视频
  try {
    await initVideo(file)
    const fileName = `video${store.id++}`
    const { url: coverUrl, videoInfo } = await getFirstFrame(url, fileName)
    videoList[videoList.length - 1] = {
      videoUrl: url,
      coverUrl,
      fileName,
      videoInfo
    }
  } catch (error) {
    console.log('此视频：', error)
    alert('此视频无法进行编辑，可以进行观看体验')
    const url = URL.createObjectURL(new Blob([file], { type: 'video/mp4' }))
    videoList[videoList.length - 1] = {
      videoUrl: url
      // coverUrl,
      // fileName,
      // videoInfo
    }
  }
}

onMounted(() => {
  videoInput.value!.addEventListener('change', uploadVideo)
})
onBeforeUnmount(() => {
  videoInput.value!.removeEventListener('change', uploadVideo)
})

// const playOrPause = () => {
//   videoList[videoSelected.value].playStatus =
//     !videoList[videoSelected.value].playStatus
// }

// const fullScreen = () => {
//   if (video.requestFullscreen) {
//     video.requestFullscreen()
//   }
// }

</script>

<template>
  <div class="control">

    <ControlBtns
      @select-video="selectVideo"
    ></ControlBtns>
    <input type="file" v-show="false" ref="videoInput" :accept="accept" />


  </div>
</template>

<style lang="less" scoped>
.control {
  height: 100%;
  padding: 10px;
  overflow-y: auto;
}

.font-list {
  height: 40px;
  flex: 1;
  display: flex;
  align-items: center;
}

.h-c-list {
  position: absolute;
  margin: auto;
  top: 10%;
  left: 10%;
  align-items: center;
  width: 500px;
}
</style>
