import { ref, reactive,computed } from 'vue'

export let store = {
  id: 0
}
export const ffmpegCoreLoaded = ref(false)

export const processData = ref(0)

export type vT = {
  duration?: number
  currentSecond?: number
  tickCounts?: number
  playStatus?: Boolean
  id?: number
  fileName?: string
  videoInfo?: string
  url?: string
  videoUrl?: string
  coverUrl?: string
  fileUrl?: string
  frameList?: any[] //视频帧
  name?: string
  date?: string
  address?: string
}
/**视频列表 */
export const videoList = reactive<[vT]>([
  {
    videoUrl: '',
    coverUrl: ''
  }
])

videoList.pop()
/**删除视频列表 */
export const delvideolist = reactive<[vT]>([
  {
    videoUrl: '',
    coverUrl: ''
  }
])

delvideolist.pop()
// 整合列表
export const mervideolist = reactive<[vT]>([
  {
    videoUrl: '',
    coverUrl: ''
  }
])

mervideolist.pop()
export const relist = reactive<[vT]>([
  {
    name: '',
    date: '',
    address: ''
  }
])
relist.pop()
/**当前选中的视频下标 */
export const videoSelected = ref(0)
export const imgSelected = ref(0)
export const videoTime = ref(0)
export const videoTime2 = ref(0)
/** 贴图列表  {url}*/
export const imageList = reactive<any[]>([])

/**多少个刻度 */
export const tickCounts = computed(() => {
  const videoInfo = videoList[videoSelected.value] || {}
  return videoInfo.duration! >= 20 ? 20 : Math.floor(videoInfo.duration!)
})
