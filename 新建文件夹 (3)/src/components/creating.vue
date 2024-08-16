<template>
  <div id="bg">
    <nav>
      <!-- 图标 -->
      <img :src="icon" id="icon" />
      <h1>一站式视频库</h1>
      <button id="export" @click="downloadvideo">导出</button>
      <button id="publish" @click="publish">发布</button>
      <img src="../assets/image/back.png" style="width: 16px;width: 32px; position: absolute; top: 10px;left: 20px; cursor: pointer;" @click="back">
    </nav>
    <div id="createbox">
      <div class="videodata">
        <div class="app-title">
          <div class="progressContain">
            <div class="progress" :style="{ width: processData * 100 + '%' }"></div>
          </div>
        </div>
        <div class="video-edit" v-loading="!ffmpegCoreLoaded">
          <div class="top">
            <el-dialog v-model="dialogTableVisible" title="试题" style="z-index: 1000;width: 400px;">
              <p>1: 1+1 = ()</p>
              <el-radio-group v-model="radio" size="small" class="radio_group" style="z-index: 1000;left: 0px;">
                  <el-radio :label="1" style="width: 100%; height: 30px;">A:
                    <p style="position: absolute; top: 5px; left: 35px;">1</p>
                  </el-radio>
                  <el-radio :label="2" style="width: 100%; height: 30px;">B:
                    <p style="position: absolute; top: 5px; left: 35px;">2</p>
                  </el-radio>
                  <el-radio :label="3" style="width: 100%; height: 30px;">C:
                    <p style="position: absolute; top: 5px; left: 35px;">3</p>
                  </el-radio>
                  <el-radio :label="4" style="width: 100%; height: 30px;">D:
                    <p style="position: absolute; top: 5px; left: 35px;">4</p>
                  </el-radio>
                  <button style="position: absolute;left: 310px;bottom: 0px;background-color: rgb(37, 121, 219);color: white;border: none;border-radius: 15px;width: 64px;height: 32px;" @click="Extest">确定</button>
                </el-radio-group>
            </el-dialog>
            <!-- //上左-视频区域 -->
            <div class="top-left video">
              <VideoComponent :videospeed="videospeed" :videovolume="volume">
              </VideoComponent>
            </div>
            <!-- 上传-->
            <div class="control">
              <input type="file" v-show="false" ref="videoInput" :accept="accept" />
            </div>
          </div>
        </div>
      </div>
      <el-tabs tab-position="top" v-model="activeName" class="demo-tabs" @tab-click="handleClick" style="position: relative; margin-left: 74%;">
        <el-tab-pane label="导入" name="first">
          <div id="uploadbox" class="Feature">
            <p id="lable">本地文件</p>
            <img src="../assets/image/local.png" id="localimg" @click="selectVideo" />
            <p id="minelable" v-if="showmineimg">我的文件</p>
            <img src="../assets/image/mine.png" id="mineimg" @click="getimglist" v-if="showmineimg" />
            <div class="h-list" v-show="showimglist">
              我的文件：<imglistindex :list="mineVideo" :selected="imgSelected" @switch="changeImg"
                style="height: 90px; flex: 1;background-color: rgba(44, 49, 58, 1);"></imglistindex>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="编辑" name="second">
          <div id="editbox" class="Feature">
            <img src="../assets/image/changespeed.png" id="changeimg" />
            <p id="changelable">变速</p>
            <el-select v-model="value" class="m-2" placeholder="Select" size="small" :teleported="false">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                @click="changespeed" />
            </el-select>
            <img src="../assets/image/volume.png" id="volumeimg" />
            <p id="volumelable">音量</p>
            <div class="slider-demo-block">
              <el-slider v-model="volumevalue" :min="-20" :max="20" :marks="marks" placement="bottom"
                @click="changevolume" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="字幕" name="third">
          <div id="lablebox" class="Feature">
            <p id="lableac">字幕识别:</p>
            <button id="acidentify">开始识别</button>
            <p id="lablesize">
              字&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:
            </p>
            <div id="labledata">{{ msg }}</div>
            <img src="../assets/image/up.png" id="upimg" @click="sizeup" />
            <img src="../assets/image/dowm.png" id="downimg" @click="sizedown" />
            <p id="lagchange">语言选择：</p>
            <p id="CN">中文</p>
            <p id="EN">英文</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="添加题目" name="fifth">
          <div id="add_question" class="Feature">
            <el-tabs v-model="feature" class="feature-tabs" @tab-click="select_feature">
              <el-tab-pane label="单选题" name="scq">
                <p id="scqtext1">时间点:   {{ msg1 }}</p>
                <p id="scqtext2">题目:</p>
                <textarea name="topic" id="input2" cols="18" rows="3"></textarea>
                <p id="scqtext3">选项:</p>
                <el-radio-group v-model="radio" size="small" class="radio_group">
                  <el-radio :label="3" style="width: 100%; height: 30px;">A：
                    <input type="text">
                  </el-radio>
                  <el-radio :label="6" style="width: 100%; height: 30px;">B：
                    <input type="text">
                  </el-radio>
                  <el-radio :label="9" style="width: 100%; height: 30px;">C：
                    <input type="text">
                  </el-radio>
                  <el-radio :label="12" style="width: 100%; height: 30px;">D：
                    <input type="text">
                  </el-radio>
                </el-radio-group>
                <button name="acbt" id="confirm-bt1">确定</button>
              </el-tab-pane>
              <el-tab-pane label="多选题" name="mcq">
                <p id="scqtext1">时间点:{{ msg1 }}</p>
                <p id="scqtext2">题目:</p>
                <textarea name="topic" id="input2" cols="18" rows="3"></textarea>
                <p id="scqtext3">选项:</p>
                <el-radio-group v-model="radio" size="small" class="radio_group">
                  <el-radio :label="3" style="width: 100%; height: 30px; ">A：
                    <input type="text" class="radiotext">
                  </el-radio>
                  <el-radio :label="6" style="width: 100%; height: 30px;">B：
                    <input type="text">
                  </el-radio>
                  <el-radio :label="9" style="width: 100%; height: 30px;">C：
                    <input type="text">
                  </el-radio>
                  <el-radio :label="12" style="width: 100%; height: 30px;">D：
                    <input type="text">
                  </el-radio>
                </el-radio-group>
                <button name="acbt" id="confirm-bt2">确定</button>
              </el-tab-pane>
              <el-tab-pane label="填空题" name="gf">
                <p id="scqtext1">时间点:</p>
                <input type="range" id="input1">
                <p id="scqtext2">题目:</p>
                <textarea name="topic" id="input2" cols="27" rows="5"></textarea>
                <p id="scqtext3">答案:</p>
                <textarea name="topic" id="input2" cols="27" rows="5"></textarea>
                <div>
                  <button name="acbt" id="confirm-bt3">确定</button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="简答题" name="saq">
                <p id="scqtext1">时间点:</p>
                <input type="range" id="input1">
                <p id="scqtext2">题目:</p>
                <textarea name="topic" id="input2" cols="27" rows="5"></textarea>
                <p id="scqtext3">答案:</p>
                <textarea name="topic" id="input2" cols="27" rows="5"></textarea>
                <div>
                  <button name="acbt" id="confirm-bt4">确定</button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频打点" name="sixth">
          <div id="video-dot" class="Feature">
            <p id="dottext1">时间点:</p>
            <input type="range" id="dotinput1">
            <p id="dottext2">添加描述:</p>
            <textarea name="topic" id="dotinput2" cols="25" rows="5" v-model="dotinput2"></textarea>
          </div>
          <button name="dotbt" id="descriptionButton" @click="copyText">确定</button>
          <textarea name="" id="description" cols="30" rows="10" disabled v-model="description"></textarea>
        </el-tab-pane>
      </el-tabs>
      <!-- //预览 -->
      <button id="showbt" @click="view">预览</button>
      <div id="funimgbox">
        <img src="../assets/image/shear.png" id="funimg" @click="sliceClick" />
        <img src="../assets/image/create.png" id="funimg"  @click="remix" />
        <img src="../assets/image/left.png" id="funimg" @click="delvideo" />
        <img src="../assets/image/right.png" id="funimg" @click="addvideo" />
      </div>
      <!-- 工作台 -->
      <div id="workbench">
        <div class="bottom">
          <TimeTrack v-if="videoList[videoSelected]" :duration="videoInfo.duration"></TimeTrack>

          <div class="bottom-content">
            <BottomItem title="视频帧" content-component="image" :data="frameList" style="margin: 0 8px; margin-top: 16px">
              <span style="margin: auto; color: rgb(174, 171, 171)">请点击「视频取帧」按钮, 进行视频解帧</span>
            </BottomItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import icon from "../assets/image/pic.png";
import type { TabsPaneContext } from "element-plus";
// @ts-ignore
import imglistindex from "./imglistindex.vue"
import { ElMessage, makeList } from "element-plus";
import { ref, reactive, computed, onMounted, onBeforeUnmount, watchEffect } from "vue";
import type { CSSProperties, Ref } from "vue";
import axios from "axios";
//剪切
import {
  getFirstFrame,
  ffmpegSliceVideo,
  initVideo,
  writeImage,
  // ffmpegVolume,
  // ffmpegSpeed
} from "../module/useFfmpeg";

import {
  store,
  videoList,
  videoSelected,
  delvideolist,
  ffmpegCoreLoaded,
  processData,
  imageList,
  imgSelected,
  videoTime,
  mervideolist,
  videoTime2
} from "../store";
// @ts-ignore
import TimeTrack from "./bottom-tracks/TimeTrack.vue";
// @ts-ignore
import BottomItem from "./BottomItem.vue";
import { formatTime } from "../utils/string";
// @ts-ignore
import { upload, getVideo, getImg, videoplay, videorespeed, videorevolume, videomerge } from "../api/auth";
import { loadRouteLocation } from "vue-router";
import { useRouter } from "vue-router";
// @ts-ignore
import VideoComponent from "./VideoComponent.vue";
import { fetchFile } from "@ffmpeg/ffmpeg";
const route = useRouter();
// import { isArray } from 'element-plus/es/utils';
interface Mark {
  style: CSSProperties;
  label: string;
}
type Marks = Record<number, Mark | string>;
const marks = reactive<Marks>({
  "-20": "-20",
  20: "20",
  0: {
    style: {
      color: "#1989FA",
    },
    label: "0",
  },
});
const dialogTableVisible = ref(false);
const activeName = ref("first");
const msg1 = ref('0')
const handleClick = (tab: TabsPaneContext, event: Event) => { };

const value = ref("1.0");
const volumevalue = ref(0);

const options = [
  {
    value: "0.5",
    label: "0.5x",
  },
  {
    value: "1",
    label: "1.0x",
  },
  {
    value: "1.5",
    label: "1.5x",
  },
  {
    value: "2",
    label: "2.0x",
  },
];
const videospeed = ref("1");
const getvideourl = ref()
//视频加速后端转前端处理
const Tofile = (blobUrl, fileName): Promise<ResponseType> => {
  return new Promise((resolve, reject) => {
    axios({
      url: blobUrl,
      responseType: "blob",
      method: "get",
    }).then((res) => {
      if (res.status === 200) {
        const blob = res.data;
        const file = new File([blob], fileName);
        blobtfile.value = file
        videorespeed({ file: file, speed: videospeed.value }).then((res) => {
          if (res.code === 200) {
            resolve(res.data)
            console.log(res.data.url)
            getvideourl.value = res.data.url
            getFileFromUrl(getvideourl.value, 'video.mp4').then((response) => {
              const file = response
              uploadurlvideo(file)
              console.log(file)
              ElMessage({
      showClose: true,
      message:'改变完成',
      type: 'success',
  })
            })
              .catch((e) => {
                console.error(e)
              });
          } else {
            reject(res)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    })
  })
}
//视频变速处理
const changespeed = async () => {
  ElMessage({
    showClose: true,
    message:'过程可能要几分钟请耐心等待',
  })
  videospeed.value = String(value.value);
  if (!videoList.length) {
    ElMessage.error("没有视频")
  } else {
    Tofile(
      videoList[videoSelected.value].videoUrl!,
      videoList[videoSelected.value].fileName! + ".mp4"
    )
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
const volume = ref('0');
//视频改变音量前端处理
const volumeTofile = (blobUrl, fileName): Promise<ResponseType> => {
  return new Promise((resolve, reject) => {
    axios({
      url: blobUrl,
      responseType: "blob",
      method: "get",
    }).then((res) => {
      if (res.status === 200) {
        const blob = res.data;
        const file = new File([blob], fileName);
        blobtfile.value = file
        videorevolume({ file: file, decibel: volume.value }).then((res) => {
          if (res.code === 200) {
            resolve(res.data)
            console.log(res.data.url)
            getvideourl.value = res.data.url
            getFileFromUrl(getvideourl.value, 'video.mp4').then((response) => {
              const file = response
              uploadurlvideo(file)
              console.log(file)
              ElMessage({
    showClose: true,
    message:'改变完成',
    type: 'success',
  })
            })
              .catch((e) => {
                console.error(e)
              });
          } else {
            reject(res)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    })
  })
}
const changevolume = async () => {
  ElMessage({
    showClose: true,
    message:'过程可能要几分钟请耐心等待',
  })
  volume.value = String(volumevalue.value)
  if (!videoList.length) {
    ElMessage.error("没有视频")
  } else {
    volumeTofile(
      videoList[videoSelected.value].videoUrl!,
      videoList[videoSelected.value].fileName! + ".mp4"
    )
      .then((res) => {

      })
      .catch((err) => {
        console.log(err);
      });
  }
};
const i = ref(0);
const labelop = ["6", "8", "10", "12", "18", "20", "24", "30", "40"];
const msg = ref(labelop[0]);
const sizeup = () => {
  i.value = i.value + 1;
  if (i.value > 8) {
    i.value = 0;
  }
  msg.value = labelop[i.value];
};
const sizedown = () => {
  if (i.value == 0) {
    msg.value = labelop[0];
  } else {
    i.value = i.value - 1;
    msg.value = labelop[i.value];
  }
};

const videoInfo = computed(() => {
  return videoList[videoSelected.value];
});
const frameList = computed(() => {
  return videoList[videoSelected.value]?.frameList || [];
});

const emit = defineEmits([
  "selectVideo",
  "upLoadFont",
  "upLoadImage",
  "upLoadSubTitle",
  "downloadVideo",
  "postVideo",
]);
const accept = ref(".mp4");
const videoInput = ref<HTMLInputElement | null>(null);

//点击上传视频
const selectVideo = async () => {
  accept.value = "*";
  setTimeout(() => {
    videoInput.value!.click();
  }, 200);
};
//input上传时处理
const uploadVideo = async (event: any) => {
  const file = event.target.files[0];
  const url = window.webkitURL.createObjectURL(file);
  if (accept.value.includes("image")) {
    await writeImage(file);
    imageList.push({
      url,
    });
    return;
  }
  //视频
  videoList.push({ videoUrl: "", coverUrl: "" });
  videoInput.value!.value = "";

  //ffmpeg加载视频
  try {
    await initVideo(file);
    const fileName = `video${store.id++}`;
    const { url: coverUrl, videoInfo } = await getFirstFrame(url, fileName);
    videoList[videoList.length - 1] = {
      videoUrl: url,
      fileUrl: file,
      coverUrl,
      fileName,
      videoInfo,
    };
    ElMessage({
    showClose: true,
    message:'改变完成',
    type: 'success',
  })
  } catch (error) {
    console.log("此视频：", error);
    ElMessage({
    showClose: true,
    message:'此视频无法进行编辑，可以进行观看体验',
    type: 'warning',
  })
    const url = URL.createObjectURL(new Blob([file], { type: "video/mp4" }));
    videoList[videoList.length - 1] = {
      videoUrl: url,
      // coverUrl,
      // fileName,
      // videoInfo
    };
  }
};
let video : any
onMounted(() => {
  videoInput.value!.addEventListener("change", uploadVideo);
  video = document.getElementById('video')
  if(location.href.indexOf("#reloaded")==-1){
        location.href=location.href+"#reloaded";
        location.reload();
    }
});
onBeforeUnmount(() => {
  videoInput.value!.removeEventListener("change", uploadVideo);
});
//剪切
const sliceClick = async () => {
  const selectItem = videoList[videoSelected.value];

  const resArr = await ffmpegSliceVideo(
    selectItem.videoUrl!,
    selectItem.fileName!,
    String(videoTime.value)
  );

  for (let index = 0; index < resArr.length; index++) {
    const item = resArr[index];
    const fileName = `video${store.id++}`;
    const { url: coverUrl, videoInfo } = await getFirstFrame(item, fileName);
    videoList.push({
      videoUrl: item,
      coverUrl,
      fileName,
      videoInfo,
    });
  }
};
const k = ref(0);
const delvideo = () => {
  for (let p = 0; p < videoList.length; p++) k.value = p;
  if (k.value == 0) {
    ElMessage.error("无可返回操作");
  } else if (k.value > 0) {
    delvideolist.push(videoList[k.value]);
    videoList.splice(k.value, 1);
  }
};
const A = ref(0);
const addvideo = () => {
  for (let p = 0; p <= delvideolist.length; p++) A.value = p;
  if (A.value == 0) {
    ElMessage.error("无可返回操作");
  } else {
    videoList.push(delvideolist[A.value - 1]);
    delvideolist.splice(A.value - 1, 1);
  }
};
const downloadvideo = () => {
  if(videoList.length < 1){
    ElMessage.error("没有可下载的视频");
  }else{
    const link = document.createElement("a");
  link.href = videoList[videoSelected.value].videoUrl!;
  link.download = new Date().toLocaleString() + ".mp4";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  }
};
const blobtfile = ref()
const blobToFile = (blobUrl, fileName): Promise<ResponseType> => {
  return new Promise((resolve, reject) => {
    axios({
      url: blobUrl,
      responseType: "blob",
      method: "get",
    }).then((res) => {
      if (res.status === 200) {
        const blob = res.data;
        const file = new File([blob], fileName);
        upload({ file }).then((response) => {
          if (response.code === 200) {
            resolve(response.data);
            // console.log(response.data);
          } else {
            reject(response);
          }
        });
      } else {
        reject(new Error("Failed to convert Blob URL to File"));
      }
    });
  });
};

const publish = async () => {
  const promiseList = [] as Promise<string>[];
  // 如果要上传剪切后的所有视频就循环
  // videoList.forEach((item) => {
  //   promiseList.push(blobToFile(item.videoUrl!, item.fileName! + ".mp4"));
  // });
  // Promise.all(promiseList)
  //   .then((res) => {
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // 如果是单个就用下面这种
  if (!videoList.length) {
    ElMessage.error("没有视频")
  } else {
    blobToFile(
      videoList[videoSelected.value].videoUrl!,
      videoList[videoSelected.value].fileName! + ".mp4"
    )
      .then((res) => {
        console.log("res", res);
        getImg({}).then((res) => {
    if (res.code === 200) {
      mineVideo.value = mineVideo.value.slice(0,0)
      for (let i = 0; i < res.data.data.length; i++) {
        mineVideo.value.push(res.data.data[i])
      }
    }
  });
        ElMessage({
    showClose: true,
    message:'上传成功',
    type: 'success',
          
  })
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
const mineVideo = ref<any>([])
const mineVideoList = ref<any>([])
//后端url处理
const uploadurlvideo = async (file) => {
  const url = window.webkitURL.createObjectURL(file);
  if (accept.value.includes("image")) {
    await writeImage(file);
    imageList.push({
      url,
    });
    return;
  }
  //视频
  videoList.push({ videoUrl: "", coverUrl: "" });
  videoInput.value!.value = "";

  //ffmpeg加载视频
  try {
    await initVideo(file);
    const fileName = `video${store.id++}`;
    const { url: coverUrl, videoInfo } = await getFirstFrame(url, fileName);
    videoList[videoList.length - 1] = {
      videoUrl: url,
      coverUrl,
      fileName,
      videoInfo,
    };
  } catch (error) {
    console.log("此视频：", error);
    ElMessage({
    showClose: true,
    message:'此视频无法进行编辑，可以进行观看体验',
    type: 'warning',
  })
    const url = URL.createObjectURL(new Blob([file], { type: "video/mp4" }));
    videoList[videoList.length - 1] = {
      videoUrl: url,
      // coverUrl,
      // fileName,
      // videoInfo
    };
  }
};
//url转file
const getFileFromUrl = (url, fileName) => {
  return new Promise((resolve, reject) => {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Accept', 'video/mp4');
    xhr.responseType = "blob";
    // 加载时处理
    xhr.onload = () => {
      // 获取返回结果
      blob = xhr.response;
      let file = new File([blob!], fileName, { type: 'video/mp4' });
      // 返回结果
      resolve(file);
    };
    xhr.onerror = (e) => {
      reject(e)
    };
    // 发送
    xhr.send();
  });
}
const getimgtovurl = ref()
const mergelist = ref<any>([])
//blob to file
const blobTFile = async (blobUrl, fileName) => {
  return new Promise((resolve, reject) => {
    axios({
      url: blobUrl,
      responseType: "blob",
      method: "get",
    }).then((res) => {
      if (res.status === 200) {
        const blob = res.data;
        const file = new File([blob], fileName);
        mergelist.value.push(file)
        resolve(blob)
      } else {
        reject(new Error("Failed to convert Blob URL to File"));
      }
    });
  });
};
const addlist = async (url,filename) => {
  return new Promise((resolve, reject) => {
    blobTFile(url, filename + '.mp4').then((res) => {
      resolve(200)
    })
  })

}
const remix = () => {
  if (mervideolist.length < 2) {
    ElMessage({
    showClose: true,
    message:'请在视频列表选择两个视频',
  })
  } else if (mervideolist.length >= 2) {
    ElMessage({
    showClose: true,
    message:'该过程可能要几分钟请耐心等待',
  })
    addlist(mervideolist[0].videoUrl!,mervideolist[0].fileName!).then((res) => {
      if (res == 200) {
        addlist(mervideolist[0 + 1].videoUrl!,mervideolist[0 + 1].fileName!).then((res) => {
          if (res == 200) {
            videomerge({ file1: mergelist.value[0], file2: mergelist.value[1], outputVideoName: 'video1' }).then((res) => {
              getFileFromUrl(res.data.data, 'video1.mp4').then((response) => {
                const file = response
                uploadurlvideo(file)
                mergelist.value.splice(0, mergelist.value.length)
                mervideolist.splice(0, mervideolist.length)
                ElMessage({
    showClose: true,
    message:'合并成功',
    type: 'success',
  })
              })
            }).catch((err) => {
              console.log(err)
            })
          }
        })
      }
    })
  }
}
const test = async () => {


  // for(let i = 0; i < mervideolist.length; i++){
  //     blobTFile(mervideolist[i].videoUrl!, mervideolist[i].fileName! + '.mp4').then((res) => {{
  //       console.log(res)
  //     }})
  //   }
  // videomerge({mergeVideoList:[mergelist.value[0],mergelist.value[1]]}).then((res) => {
  //   console.log(res)
  // }).catch((err) => {
  //   console.log(err)
  // })
  // alert('请在视频展示区选取两个视频')
  // console.log(mervideolist)
  // videoplay({},mineVideoList.value[imgSelected.value]).then((res) =>{
  // console.log(res)
  // }).catch((err) => {
  //   console.log(err);
  //   // console.log(m)
  // })
  // console.log(videoTime.value)
  // console.log(blobtfile.value)
  // console.log(getvideourl.value)
};
const showmineimg = ref(true)
const showimglist = ref(false)
watchEffect(() => {
  getImg({}).then((res) => {
    if (res.code === 200) {
      for (let i = 0; i < res.data.data.length; i++) {
        mineVideo.value.push(res.data.data[i])
      }
    }
  });
  msg1.value = String(videoTime.value)
  if (videoTime2.value < 5 && videoTime2.value > 4.7){
    videoList[videoSelected.value].playStatus = false
    dialogTableVisible.value = true
  }
})
const getimglist = () => {
  // getImg({}).then((res) => {
  //   if (res.code === 200){
  //     for(let i = 0; i < res.data.data.length; i++){
  //       mineVideo.value.push(res.data.data[i])
  //     }
  //   }
  // });
  showmineimg.value = false
  showimglist.value = true
}
const changeImg = (index: number) => {
  imgSelected.value = index
  let a = confirm('确认选择该文件')
  if (a == true) {
    ElMessage({
    showClose: true,
    message:'过程可能需要几分钟时间',
  })
    getVideo({}).then((res) => {
      if (res.code == 200) {
        for (let i = 0; i < res.data.detail.length; i++) {
          mineVideoList.value.push(res.data.detail[i].videoTitle)
        }
        console.log(res)
        console.log(mineVideoList.value[imgSelected.value])
        getimgtovurl.value = 'http://47.115.219.192:8080/covers/' + mineVideoList.value[imgSelected.value]
        console.log(getimgtovurl.value)
        getFileFromUrl(getimgtovurl.value, 'video.mp4').then((response) => {
          const file = response
          uploadurlvideo(file)
          console.log(file)
        })
          .catch((e) => {
            console.error(e)
          });
      }
    });
  } else {
    ElMessage({
    showClose: true,
    message:'请选择其他文件',
  })
  }
}

// 添加题目
const feature = ref('scq')

const select_feature = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const radio = ref(0)

// 文本转移
// 定义响应式数据
const dotinput2 = ref('')
const description = ref('')

// 复制文本的方法
const copyText = () => {
  description.value = dotinput2.value
}
//试题
const Extest =() => {
  if(radio.value == 2){
    ElMessage({
      showClose: true,
      message:'答案正确',
      type: 'success',
    })
    dialogTableVisible.value = false
    videoList[videoSelected.value].playStatus = true
  }else{
    ElMessage({
      showClose: true,
      message:'答案错误',
      type: 'error',
    })
  }
}
//返回首页
const back = () => {
  route.push('/')
}
//预览
const view = () => {
  if(videoList.length < 1){
    ElMessage({
      showClose: true,
      message:'请添加视频',
      type: 'error',
    })
  }else{
    if (video.requestFullscreen) {
    video.requestFullscreen()
  }
  }
}
</script>

<style scoped lang="less">
button {
  cursor: pointer;
}

.videodata {
  position: absolute;
}

.video-edit {
  padding: 0 10px;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;

  .top {
    display: flex;
    border: 0;
    margin: 0;
    padding: 0;

    .bottom {
      flex: 1;
      flex-grow: 1;
      min-width: 100vw;
      height: 25%;
      border: 1px solid 1px #e8e1e1;
      border-radius: 6px;
      margin: auto;
      top: 75%;
      position: absolute;
      padding: 10px 0;
      background-color: #fff;
    }

    .bottom-content {
      height: 100%;
      overflow-y: auto;
      overflow: hidden;
    }
  }

  .app-title {
    padding: 0 20px;
    margin-top: 6px;
    min-height: 30px;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
}

.progressContain {
  position: absolute;
  width: 940px;
  height: 6px;
  margin-top: 61%;
  border-radius: 4px;
  z-index: 999;
  border: 0.5px rgba(37, 122, 219, 0.621) solid;
  background-color: white;
  overflow: hidden;

  .progress {
    position: absolute;
    z-index: 999;
    height: 100%;
    width: 0;
    background-color: rgb(37, 121, 219);
  }
}

#bg {
  width: 100%;
  height: 100vh;
  background-size: 100% 100%;
  background: rgba(39, 46, 59, 1);
  z-index: -1;
}

/* 导航栏 */
nav {
  background-color: rgb(31, 42, 60);
  height: 60px;
}

/* 图标 */
#icon {
  position: absolute;
  left: 222px;
  top: 8px;
  width: 43.38px;
  height: 43.38px;
}

/* 标题 */
h1 {
  position: absolute;
  left: 280px;
  top: 14px;
  width: 144px;
  height: 31px;
  opacity: 1;
  /** 文本1 */
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0px;
  line-height: 30.48px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
}

#publish {
  position: absolute;
  right: 100px;
  top: 8px;
  width: 74px;
  height: 40px;
  opacity: 1;
  border-radius: 20px;
  background: rgba(41, 128, 227, 1);
  color: white;
  border: none;
}

#export {
  position: absolute;
  right: 208px;
  top: 8px;
  width: 74px;
  height: 40px;
  opacity: 1;
  border-radius: 20px;
  background: rgba(41, 128, 227, 1);
  color: white;
  border: none;
}

#createbox {
  width: 80%;
  height: 90%;
  opacity: 1;
  background: rgba(44, 49, 58, 1);
  box-sizing: border-box;
  margin: auto;
}

#uploadbox {
  padding: 5px;
  width: 420px;
  height: 600px;
  box-sizing: border-box;
  margin: 0px 0px auto auto;
  padding-left: 10px;

}

#lable {
  width: 63px;
  height: 17px;
  opacity: 1;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
}

#minelable {
  margin-top: 20%;
  width: 63px;
  height: 17px;
  opacity: 1;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
}

#localimg {
  cursor: pointer;

  height: 60px;
  width: 60px;
  margin: 18% 0px 0px 28%;
}

#mineimg {
  cursor: pointer;

  height: 60px;
  width: 80px;
  margin: 18% 0px 0px 28%;
}

#showbt {
  position: absolute;
  margin: auto;
  right: 10.6%;
  top: 60%;
  width: 64px;
  height: 32px;
  opacity: 1;
  border-radius: 20px;
  color: white;
  border: none;
  background: rgba(41, 128, 227, 1);
}

#showbt2 {
  position: absolute;
  margin: auto;
  right: 10%;
  top: 57%;
  width: 64px;
  height: 32px;
  opacity: 1;
  border-radius: 20px;
  color: white;
  border: none;
  background: rgba(41, 128, 227, 1);
}

#workbench {
  position: absolute;
  margin: auto;
  bottom: 0%;
  width: 80%;
  height: 33%;
  opacity: 1;
  background: rgba(41, 45, 52, 1);
  z-index: 10000;
}

#funimgbox {
  position: absolute;
  margin: auto;
  right: 20%;
  top: 63%;
  z-index: 3;
  cursor: pointer;
}

#funimg {
  width: 16px;
  height: 16px;
  margin-left: 16px;
}

#editbox {
  padding-left: 5%;
  width: 300px;
  height: 65vh;
  box-sizing: border-box;
  margin: 0px 0px auto auto;

}

#changeimg {
  position: absolute;
  width: 16px;
  height: 16px;

  top: 2.9%;
  left: 5%;
}

#volumeimg {
  position: absolute;
  margin: auto;
  top: 35%;
  width: 16px;
  height: 16px;

  left: 5%;
}

#brightnessimg {
  position: absolute;
  margin: auto;
  top: 59.2%;
  width: 16px;
  height: 16px;

  left: 68%;
}

#changelable {
  position: absolute;
  margin: auto;
  top: 1.9%;
  left: 12%;
  width: 40px;
  height: 40px;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
}

#volumelable {
  position: absolute;
  margin: auto;
  top: 34%;
  left: 12%;
  width: 40px;
  height: 40px;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
}

#lightlable {
  position: absolute;
  margin: auto;
  top: 58%;
  left: 70%;
  width: 40px;
  height: 40px;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
}

#lablebox {
  padding: 5px;
  width: 420px;
  height: 70vh;
  box-sizing: border-box;
  margin: 0px 0px auto auto;
  padding-left: 10px;

  display: flex;
}

#lableac {
  margin-top: 2%;
  width: 100px;
  height: 26px;
  opacity: 1;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;

}

#acidentify {
  position: absolute;
  margin: auto;
  top: 2%;
  left: 24%;
  width: 80px;
  height: 26px;
  opacity: 1;
  border-radius: 20px;
  border: none;
  color: white;
  background: rgba(41, 128, 227, 1);
}

#lablesize {
  position: absolute;
  margin: auto;
  top: 15%;
  width: 100px;
  height: 26px;
  opacity: 1;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
}

#labledata {
  position: absolute;
  margin: auto;
  top: 15%;
  left: 24%;
  padding-top: 2px;
  width: 50px;
  height: 30px;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  background: rgba(166, 166, 166, 0.18);
}

#upimg {
  position: absolute;
  margin: auto;
  left: 29%;
  top: 12%;
  width: 16px;
  height: 16px;

  cursor: pointer;
}

#downimg {
  position: absolute;
  margin: auto;
  left: 29%;
  top: 20%;
  width: 16px;
  height: 16px;

  cursor: pointer;
}

#lagchange {
  position: absolute;
  margin: auto;
  top: 28%;
  width: 100px;
  height: 26px;
  opacity: 1;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
}

#CN {
  cursor: pointer;

  color: rgba(166, 166, 166, 1);
  position: absolute;
  width: 40px;
  height: 32px;
  left: 19%;
  top: 43%;
  font-size: 18px;
}

#EN {
  cursor: pointer;

  color: rgba(166, 166, 166, 1);
  position: absolute;
  width: 40px;
  height: 32px;
  left: 49%;
  top: 43%;
  font-size: 18px;
}

.h-list {
  align-items: center;
  z-index: 1000;
  color: #fff;
  margin-top: 24%;
}

:deep(.el-tabs__item) {
  height: 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 16px;
  display: inline-block;
  list-style: none;
  font-size: 10px;
  font-weight: 500;
  color: white;
  position: relative;
}

:deep(.el-tabs__item.is-active) {
  color: #ffdead;
  font-size: 16px;
  font-weight: 1000;
}

:deep(.el-tabs__active-bar) {
  background-color: transparent !important;
}

:deep(.el-tabs__nav-wrap::after) {
  position: static;
}

:deep(.el-select) {
  position: absolute;
  border-radius: 28px;
  border: none;
  color: white;
  width: 90px;
  height: 30px;
  margin-top: 30px;
  margin-left: 100px;
  --el-select-input-focus-border-color: none !important;

  top: 10%;
  left: 2%;
}

:deep(.el-select .el-input__wrapper) {
  background-color: rgba(166, 166, 166, 0.18);
  color: white;
  box-shadow: none !important;
}

:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: none !important;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: none !important;
  color: white;
}

:deep(.el-select:hover:not(.el-select--disabled) .el-input__wrapper) {
  box-shadow: none !important;
}

:deep(.el-select-dropdown__item) {
  color: white;
}

:deep(.el-select .el-input__inner) {
  color: white;
}

:deep(.el-popper) {
  background-color: rgba(166, 166, 166, 0.18);
  border: none;
}

:deep(.el-popper .el-popper__arrow::before) {
  border: none;
  background-color: rgba(166, 166, 166, 0.18);
}

.el-select-dropdown__item.hover {
  background-color: black;
}

:deep(.el-dropdown-menu__item:not(.is-disabled)) {
  color: white;
}

.slider-demo-block {
  position: absolute;
  margin-top: 94%;
  margin-left: -1%;
}

.slider-block {
  position: absolute;
  margin-top: 26%;
  margin-left: 5%;
}

:deep(.el-tabs__nav-next) {
  position: absolute;
  top: 8px;
}

:deep(.el-tabs__nav-prev) {
  position: absolute;
  top: 8px;
  left: -7px;
}

:deep(.el-slider) {

  width: 200px;
  height: 3px;
}

:deep(.el-slider__bar) {
  background-color: white;
}

:deep(.el-slider__runway) {
  background-color: rgba(211, 206, 206, 0.5);
}

:deep(.el-slider__button) {
  width: 16px;
  height: 16px;
  border: none;
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;

  margin-left: 80%;
}

:deep(.el-tabs__item) {
  padding: 21px;
  text-align: center;
  width: 100%;
  height: 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 16px;
  display: inline-block;
  list-style: none;
  font-size: 11px;
  font-weight: 500;
  color: white;
  position: relative;
}


/* 滚动条element */

#audio {
  padding: 0px 5px;
  width: 300px;
  box-sizing: border-box;
  margin: 10px 0px auto auto;
}

#audio1 {
  position: relative;
  padding-top: 8px;
  display: flex;
  height: 75px;

  cursor: pointer;
}

#audio1 #playback,
#audio1 button {
  display: none;
}

#audio1:hover #playback,
#audio1:hover button {
  position: absolute;
  display: block;
}

#playback {
  margin: 8% 0px 0px 9%;
  width: 20px;
  height: 20px;
}


#audio1_text1 {
  margin: 1% 0px 0px 10%;

  /* #文本 */
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0px;
  line-height: 22.86px;
  color: rgba(166, 166, 166, 1);
}

#audio1_text_time1 {
  margin: 15% 0px 0px -10%;

  /** 文本1 */
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 17.78px;
  color: rgba(166, 166, 166, 1);
  text-align: left;
  vertical-align: top;
}

.append_button {
  width: 17px;
  height: 17px;
  margin: 15% 0px 0px 85%;

  border-radius: 10px;
  border: none;

  background-image: url("../assets/image/append.png");
  background-size: cover;

  cursor: pointer;
}

/* 添加题目 */
#add_question {
  width: 420px;
  height: 70vh;
  box-sizing: border-box;
  margin: 0px 0px auto auto;
  padding-left: 10px;

  display: flex;
}

.addque-button {
  margin-top: 7%;
  margin-right: 4%;
}


/* 单选题文本 */
p#scqtext1,
p#scqtext2,
p#scqtext3 {
  /** 文本1 */
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;

}

#scqtext2 {
  margin-top: 5%;
}


#input1 {
  position: absolute;
  top: 2.5%;
  left: 20%;

  background: rgba(166, 166, 166, 0.18);

}

#input2 {
  position: relative;
  margin-top: -7%;
  left: 20%;
  width: 200px;
  color: #fff;
  border-radius: 5px;
  background: rgba(166, 166, 166, 0.18);
}

/* 单选题 */

input {
  background-color: rgba(166, 166, 166, 0.18);
  border-radius: 5px;
  opacity: 1;
  color: #fff;

  padding-left: 5px;
  letter-spacing: 1px;
}

textarea {
  padding-left: 5px;
  letter-spacing: 1px;
  resize: none;
}

.radio_group {
  height: 120px;

  position: relative;
  left: 20%;
}

.feature-tabs button {
  position: relative;

  left: 65%;
  top: 92%;
  width: 50px;
  height: 25px;
  opacity: 1;
  border-radius: 20px;
  color: white;
  border: none;
  background: rgba(41, 128, 227, 1);
}

#video-dot {
  padding-left: 10px;
  width: 420px;
  height: 70vh;
  box-sizing: border-box;
  margin: 0px 0px auto auto;

}

#video-dot p {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 25.4px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
  flex: 1;
}

#dotinput1 {
  position: absolute;
  margin-top: -5.5%;
  left: 22%;
  width: 200px;

  background: rgba(166, 166, 166, 0.18);
}

#dottext2 {
  position: absolute;
  top: 12%;
}

#dotinput2 {
  position: relative;
  left: 0%;
  margin-top: 30%;
  width: 270px;
  height: 100px;

  border-radius: 5px;
  color: #fff;
  background: rgba(166, 166, 166, 0.18);
}

#descriptionButton {
  position: relative;
  margin: 4% 0px 0px 60%;
  width: 50px;
  height: 25px;
  opacity: 1;
  border-radius: 20px;
  color: white;
  border: none;
  background: rgba(41, 128, 227, 1);
}

:deep(#pane-sixth.el-tab-pane) {
  width: 100%;
  height: 100%;
}

#description {
  position: relative;
  margin: 6% 0px 0px 0%;
  width: 270px;
  height: 90px;

  border-radius: 5px;
  color: #fff;
  background: rgba(166, 166, 166, 0.18);
}

@media all and (max-width: 1550px) {
  .Feature {
    transform: scale(0.97);
  }

  :deep(.el-tabs__nav-wrap.is-scrollable) {
    transform: scale(0.97);
  }

  .slider-demo-block {
    position: absolute;
    margin-top: 110%;
    margin-left: 7%;
    transform: scale(0.97);
  }
}

@media all and (max-width: 1539px) {
  .Feature {
    transform: scale(0.93);
  }

  .addque-button {
    margin-right: 9%;
  }

  :deep(.el-tabs__nav-wrap.is-scrollable) {
    transform: scale(0.95);
  }

  .progressContain {
    transform: scaleX(0.95);

    .progress {
      transform: scaleX(0.95);
    }
  }

}

@media all and (max-width: 1480px) {
  .Feature {
    transform: scale(0.92);
  }

  :deep(.el-tabs__nav-wrap.is-scrollable) {
    transform: scale(0.92);
  }

  .progressContain {
    transform: scaleX(0.90);
    transform-origin: left;

    .progress {
      transform: scaleX(0.90);
      transform-origin: left;
    }
  }
}
</style>
