<script setup lang="ts">
import { onMounted,ref,watch } from 'vue'
import { videoList, videoSelected,videoTime,videoTime2 } from '../../store'
import { formatTime, interval } from './../../utils/string.js'
let video: any
let timeline: HTMLElement
onMounted(() => {
  timeline = document.getElementById('timeline')!
  video = document.getElementById('video')

  video.addEventListener('timeupdate', updateScrubber)
  timeline.addEventListener('click', updateVideoTime)
})

const scrubberLeft = ref('0')
// 根据视频时间更新滑块位置
function updateScrubber() {
  requestAnimationFrame(() => {
    const time = video.currentTime
    videoTime2.value = time
    videoList[videoSelected.value].currentSecond = Math.floor(video.currentTime)
    const duration = video.duration
    let position = (time / duration) * 100
    if (time === 0) {
      position = 0
    }
    scrubberLeft.value = `${position.toFixed(2)}%`
  })
}

// 鼠标点击底部区域更新视频时间
function updateVideoTime(event: MouseEvent) {
  var targetRect = timeline.getBoundingClientRect()
  var targetX = targetRect.left
  const position = event.clientX - targetX - 2

  const duration = video.duration
  const time = (position / timeline.offsetWidth) * duration
  video.currentTime = time
  videoTime.value = time 
  videoList[videoSelected.value].currentSecond = Math.floor(video.currentTime)
  video.pause()
}
const props = defineProps(['duration'])
const ticks = ref<any[]>([])
const loading = ref(false)
watch(
  () => props.duration,
  (newDuration: number) => {
    if (!newDuration) return
    loading.value = true
    setTimeout(() => {
      let hasHours = false
      if (Math.floor(newDuration / 3600) > 0) {
        hasHours = true
      }
      const tmp = interval(newDuration)
      ticks.value = tmp.map((item, index) => {
        const y = (index / (tmp.length - 1)) * 100
        return {
          left: `${y.toFixed(2)}%`,
          tickTime: formatTime(item, hasHours)
        }
      })
      loading.value = false
    })
  }
)
</script>

<template>
  <div id="timeline" v-loading="loading">
    <div class="scrubber" :style="{ left: scrubberLeft }"></div>
    <div
      class="tick"
      v-for="(item, index) of ticks"
      :key="index"
      :style="{ left: item.left }"
    >
      {{ loading ? '' : item.tickTime }}
    </div>
  </div>
</template>

<style lang="less" scoped>
#timeline {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 100%;
  margin: 0 10px;
  cursor: pointer;
  overflow: hidden;
}
#timeline .scrubber {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background-color: #409eff;
  transition: left  linear;
}
#timeline .tick {
  position: absolute;
  top: 6px;
  width: auto;
  height: 15px;
  font-size: 12px;
}
#timeline .tick::after {
  content: '|';
  position: relative;
  top: -10px;
  left: calc(-100% + 1.8px);
  width: 1px;
  height: 4px;
  font-size: 12px;
}
</style>
