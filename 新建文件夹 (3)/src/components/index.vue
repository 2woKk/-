<template>
  <!-- 背景 -->
  <div class="main-container">
    <!-- 导航栏 -->
    <el-container class="common-layout">
      <el-header>
        <!-- 图标 -->
        <img :src="icon" id="icon" />
        <h1>一站式视频库</h1>
        <li><a id="my-file">我的文件</a></li>
        <li><a id="my-item">我的项目</a></li>
        <li><button id="create" @click="tocreating">开始创作</button></li>
        <li id="userbackli">
          <el-dropdown id="userback">
            <span class="el-dropdown-link">
              <div id="username">
                {{ msg1 }}
                <el-icon class="el-icon--right" id="usernamedown">
                  <arrow-down />
                </el-icon>
              </div>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="backtologin"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
      </el-header>
      <el-main>
        <!-- 功能展示 -->
        <div class="function-field">
          <!-- 上传文件video -->
          <el-upload
            class="upload-demo"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="3"
            :on-exceed="handleExceed"
            accept="video/*"
          >
            <el-button type="primary" id="new-video">
              <img src="@/assets/image/folder.png" alt="没有图片" />
              上传文件
            </el-button>
          </el-upload>
          <el-button
            type="success"
            id="new-folder"
            @click="dialogFormVisible = true"
          >
            <img
              src="@/assets/image/Create a new folder.png"
              id="new-folder-img"
              alt="没有图片"
            />
            新建文件夹
          </el-button>
          <!-- 目录 -->
          <el-button
            @click="showre"
            type="primary"
            class="btn-delete"
          >
            <el-icon><Delete /></el-icon>
            回收站
          </el-button>
          <el-dialog v-model="dialogTableVisible" title="Recycle Bin">
            <el-table :data="gridData">
              <el-table-column property="date" label="删除日期" width="250" />
              <el-table-column property="name" label="文件名" width="200" />
              <el-table-column property="address" label="文件地址" />
            </el-table>
          </el-dialog>
        </div>

        <!-- 列表展示区 -->
        <div class="list-container">
          <div
            class="list-item"
            v-for="(item, index) in tableData"
            :key="index"
          >
            <div style="display: flex">
              <el-dropdown @command="(cmd) => handleCommand(cmd, item)">
                <span class="el-dropdown-link">
                  <img
                    class="el-icon--right"
                    src="@/assets/image/unfold.png"
                    alt=""
                  />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <template v-if="item.folderType === 1">
                      <el-dropdown-item command="rename"
                        >重命名</el-dropdown-item
                      >
                      <el-dropdown-item command="delete">
                        删除
                      </el-dropdown-item>
                    </template>
                    <template v-if="item.folderType !== 1">
                      <el-dropdown-item command="show">预览</el-dropdown-item>
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="download"
                        >下载</el-dropdown-item
                      >
                      <el-dropdown-item command="cancel"
                        >取消发布</el-dropdown-item
                      >
                    </template>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <div style="margin-left: 8px">
                <el-icon size="50" color="yellow" v-if="item.folderType === 1">
                  <Folder />
                </el-icon>
                <div v-else>
                  <el-image
                    style="width: 270px; height: 160px"
                    fit="cover"
                    :src="`${DefaultBaseUrl}/${item.videoThunURL}`"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
            </div>
            <div class="name">
              <img
                style="width: 16px; height: 16px"
                src="@/assets/image/folder.svg"
              />
              {{ item.fileName }}
            </div>
            <div class="createTime">{{ item.createTime }}</div>
          </div>
        </div>
        <!-- 分页 -->
        <!-- <div style="display: flex;justify-content: flex-end;width: 100%;">
                            <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
                        </div> -->

        <!-- <el-scrollbar ref="scrollbarRef" height="400px" always @scroll="scroll">
          <div ref="innerRef"></div>
        </el-scrollbar> -->

        <!-- <el-slider v-model="value" :max="max" :format-tooltip="formatTooltip" @input="inputSlider" /> -->
      </el-main>
    </el-container>
    <el-dialog v-model="dialogFormVisible" title="新建文件夹" align-center>
      <el-form :model="form" label-width="120px">
        <el-form-item label="文件夹名">
          <el-input v-model="a" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleNewFolder"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogRenameFolder" title="重命名文件夹" align-center>
      <el-form :model="folderItemInfo" label-width="120px">
        <el-form-item label="文件夹名">
          <el-input v-model="folderItemInfo.fileName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogRenameFolder = false">取消</el-button>
          <el-button type="primary" @click="handleRenameFolder">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogRenameVideo" title="重命名视频文件" align-center>
      <el-form :model="folderItemInfo" label-width="120px">
        <el-form-item label="视频文件名">
          <el-input v-model="folderItemInfo.videoTitle" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogRenameVideo = false">取消</el-button>
          <el-button type="primary" @click="handleRenameVideo">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 在弹窗中添加一个video元素用于接收视频url -->
    <el-dialog
      title="视频预览"
      :destroy-on-close="true"
      @close="closedialog"
      v-model="showvideodialog"
      append-to-body
    >
      <video
        id="myvideo"
        controls
        crossOrigin="anonymous"
        :src="videourl"
        style="width: 100%; height: 400px"
      ></video>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import { DefaultBaseUrl } from "@/constants";
import {
  getVideoList,
  getFolderList,
  deleteFolder,
  newFolder,
  renameFoleder,
  getVideoImage,
  downloadVideo,
  deleteVideo,
  showVideo,
  renameVideo,
  getUserName,
  getRecycle,
} from "../api/video";
// 新建文件夹element
import { nextTick, proxyRefs, reactive, ref, Ref, toRef, onMounted } from "vue";
import axios from "axios";
// import { ElMessage } from 'element-plus'
// import { ArrowDown } from '@element-plus/icons-vue'
import { defineComponent } from "vue";
import {
  dayjs,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElMessage,
  ElMessageBox,
  linkEmits,
} from "element-plus";
import item from "element-plus/es/components/space/src/item";
// @ts-ignore
import icon from "@/assets/image/pic.png";
import { useRouter } from "vue-router";
// @ts-ignore
import { saveAs } from "file-saver";

import type { UploadProps, UploadUserFile } from "element-plus";
// const api = {
//     loadDataList: "",
//     rename: "/folder/rename",
//     newFolder: "/folder/newFolder"
// };
import { ElScrollbar } from "element-plus";
import {relist} from "../store"
const max = ref(0);
const value = ref(0);
const innerRef = ref<HTMLDivElement>();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const msg1 = ref("");
const list = [{}];
const b = ref();
const c = ([{
  name: "",
  date: "",
  address: "",
}]);
const tore = () => {
  location.reload();
}
onMounted(() => {
  // max.value = innerRef.value!.clientHeight - 380
  // if (location.href.indexOf("#reloaded") == -1) {
  //     location.href = location.href + "#reloaded";
  //     location.reload();
  // }
  getUserName({}).then((res) => {
    console.log(res.data.userName);
    msg1.value = res.data.userName;
  });
});
const inputSlider = (value: number) => {
  scrollbarRef.value!.setScrollTop(value);
};
const scroll = ({ scrollTop }) => {
  value.value = scrollTop;
};
const formatTooltip = (value: number) => {
  return `${value} px`;
};
const route = useRouter();
const imglist = ref<any>([]);
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};

let dialogFormVisible = ref(false);

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const tableData: Ref<any[]> = ref([]);
const editing: Ref<boolean> = ref(false);
const dialogVideoVisible = ref(false);
// 重命名弹窗
const dialogRenameFolder = ref(false);
const dialogRenameVideo = ref(false);
// 当前选中的文件夹/文件信息
const folderItemInfo = ref({ fileName: "", videoId: "", videoTitle: "" });
const handleCommand = (cmd, item) => {
  console.log(cmd);
  console.log("item", item);
  folderItemInfo.value = { ...item };
  if (cmd === "rename") {
    dialogRenameFolder.value = true;
  } else if (cmd === "delete") {
    ElMessageBox.confirm("确定删除当前文件夹并放到回收站?", "删除提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        handleDeleteFolder(item);
      })
      .catch(() => {
        console.log("取消");
      });
  } else if (cmd === "cancel") {
    ElMessageBox.confirm("确定删除当前视频并放到回收站?", "删除提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        handleDeleteVideo(item);
      })
      .catch(() => {
        console.log("取消");
      });
  } else if (cmd === "show") {
    dialogVideoVisible.value = true; // 打开弹窗
    handleShowVideo(item);
  } else if (cmd === "download") {
    handleDownloadVideo(item);
  } else if (cmd === "edit") {
    dialogRenameVideo.value = true;
  }
};

// 获取文件夹列表
const handleGetFolderList = () => {
  getFolderList({ filePid: "0" }).then((res) => {
    console.log("res", res);
    if (res.code === 200) {
      tableData.value = res.data.list.map((item) => {
        return {
          ...item,
          createTime: dayjs(item.videoUploadTime).format("YYYY-MM-DD hh:mm"),
        };
      });
    }
  });
};

const a = ref();
const handleNewFolder = () => {
  dialogFormVisible.value = false;
  newFolder({
    filePid: "0",
    folderName: a.value,
  }).then((res) => {
    console.log(res);
    console.log(res.data.data.videoUploadTime);
    // newFolders(res.data.data.videoUploadTime)
    handleGetFolderList();
  });
};
//删除文件夹
// const delid = ref()
const handleDeleteFolder = (data) => {
  // delid.value = String(data.videoId)
  // console.log(delid.value)
  deleteFolder({
    fileIDs: data.videoId,
  }).then((res) => {
    console.log(res);
    if (res.code === 200) {
      handleGetFolderList();
    }
    ElMessage.success(res.message);
  });
};
//重命名文件夹
const handleRenameFolder = () => {
  console.log("folderItemInfo", folderItemInfo.value);
  renameFoleder({
    folderID: folderItemInfo.value.videoId,
    newFolderName: folderItemInfo.value.fileName,
  }).then((res) => {
    if (res.code === 200) {
      dialogRenameFolder.value = false;
      handleGetFolderList();
    }
  });
};

//取消发布
// const delid = ref()
const handleDeleteVideo = (data) => {
  // delid.value = String(data.videoId)
  // console.log(delid.value)
  deleteVideo({
    videoID: data.videoId,
  }).then((res) => {
    console.log(res);
    if (res.code === 200) {
      handleGetFolderList();
    }
    ElMessage.success(res.message);
  });
};

// //下载视频
const handleDownloadVideo = (rowData) => {
  saveAs(`${DefaultBaseUrl}/covers/` + rowData.fileName, rowData.fileName);
};
const showvideodialog = ref(false);
const videourl = ref("");

//预览视频
const handleShowVideo = (rowData) => {
  showvideodialog.value = true;
  videourl.value = `${DefaultBaseUrl}/covers/` + rowData.fileName;
};

//重命名视频文件
const handleRenameVideo = () => {
  console.log("folderItemInfo", folderItemInfo.value);
  renameVideo({
    videoID: folderItemInfo.value.videoId,
    newVideoTitle: folderItemInfo.value.videoTitle,
  }).then((res) => {
    if (res.code === 200) {
      dialogRenameVideo.value = false;
      handleGetFolderList();
    }
    ElMessage.success(res.message);
  });
};

handleGetFolderList();

// 回收站展示
const dialogTableVisible = ref(false);
const gridData = relist;
const showre = () => {
  dialogTableVisible.value = true;
  getRecycle({}).then((res) => {
    console.log("垃圾站", res);
    let i = 0;
    const grid = {
      date: "",
      name: "",
      address: "",
    };
    for (i; i < res.data.detail.length; i++) {
      b.value = i;
      list.push(grid);
      relist[i] = {
        name:res.data.detail[i].fileName,
        date:dayjs(res.data.detail[i].recoveryTime).format(
        "YYYY-MM-DD hh:mm"
        ),
        address:res.data.detail[i].videoPath,
      }
      // c[i].name = res.data.detail[i].fileName;
      // c[i].date = dayjs(res.data.detail[i].recoveryTime).format(
      //   "YYYY-MM-DD hh:mm"
      // );
      grid.address = res.data.detail[i].videoPath;
      console.log(relist);
    }
  });
}

const tocreating = () => {
  route.push("/creating");
};
//返回登录
const backtologin = () => {
  sessionStorage.clear();
  route.push("/login");
};
const closedialog = () => {
  showvideodialog.value = false;
};
</script>

<style scoped lang="less">
:deep(.el-header) {
  padding: 0px;
  background-color: rgb(31, 42, 60);
  height: 80px;
  padding-top: 12px;
  display: flex;
  justify-content: flex-start;
}

/* bg 1161*771 */
/* 背景 */
.main-container {
  //   position: fixed;
  height: 100%;
  margin-top: 0px;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-color: rgba(44, 49, 58, 1);
  z-index: 2;
  overflow: hidden;
}

/* 导航栏 */
nav {
  background-color: rgb(31, 42, 60);
  height: 60px;
  display: flex;
  justify-content: flex-start;
}

/* 图标 */
#icon {
  margin-left: 8%;
  margin-top: 0.6%;
  width: 43.38px;
  height: 43.38px;
}

/* 标题 */
h1 {
  margin-left: 1%;
  margin-top: 0.8%;
  width: 144px;
  height: 31px;
  opacity: 1;

  /** 文本 */
  margin-left: 1%;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0px;
  line-height: 30.48px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;
  white-space: nowrap;
}

li {
  margin-top: 1.1%;
  margin-left: 2%;
}

/* 我的文件 */
#my-file {
  opacity: 1;
  color: gray;
  white-space: nowrap;
  cursor: pointer;
}

/* 我的项目 */
#my-item {
  opacity: 1;
  color: gray;
  white-space: nowrap;
  cursor: pointer;
}

/* 开始创作 */
#create {
  position: absolute;
  margin-left: 45%;
  margin-top: -11px;
  width: 104px;
  height: 45px;
  border-radius: 15px;
  border: 0px;
  background: rgba(41, 128, 227, 1);
  flex: 1;
  color: #fff;
  z-index: 10000;
  cursor: pointer;
}

/* 功能展现 */
.function-field {
  display: flex;
}
.btn-delete {
  display: block;
  width: 100px;
  margin-left: auto;
}

/* 新建文件夹按钮 + 弹窗element */

/* 按钮文字 */
h4 {
  margin-left: 13px;
  color: rgba(255, 255, 255, 1);
}

/* 按钮图标 */
#new-folder-img {
  width: 13px;
  height: 15px;
}

/* 按钮 */
#new-folder {
  margin-left: 2%;
  width: 140px;
  height: 45px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 1);
  display: flex;
  color: #fff;
}


/* 按钮样式 */
#new-video {
  width: 130px;
  height: 45px;
  border-radius: 15px;
}

// 侧边栏
.common-layout {
  height: 100%;
}

/* 目录 */
.el-breadcrumb {
  margin-top: 0.6%;
  margin-left: 5%;
  display: flex;
  flex-direction: row;
  text-align: center;
  /* 防止文字换行 */
  white-space: nowrap;
}

#myfile {
  color: blue;
}

/* 垃圾站 */
#trash {
  margin-top: 1%;
  margin-left: 54.3%;
  width: 110px;
  height: 45px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 1);
  display: flex;
  text-align: center;
}

#trash-img {
  width: 13px;
  height: 15px;
}

/* 列表展示区 */
.list-container {
  display: flex;
  flex-wrap: wrap;

  .list-item {
    left: 242px;
    top: 135px;
    width: 344px;
    height: 251px;
    opacity: 1;
    padding: 20px;
    border-radius: 10px;
    background: rgba(44, 49, 58, 1);
    cursor: pointer;

    .name {
      color: white;
    }

    .el-dropdown-link {
      width: 16px;
      height: 16px;
    }

    .createTime {
      color: rgba(255, 255, 255, 1);
    }
  }
}

.video-column {
  display: flex;
  flex-wrap: wrap;

  .list-item {
    left: 242px;
    top: 135px;
    width: 344px;
    height: 251px;
    opacity: 1;
    border-radius: 10px;
    background: rgba(44, 49, 58, 1);

    .name {
      color: white;
    }

    .el-dropdown-link {
      width: 16px;
      height: 16px;
      left: 551px;
      top: 604px;
    }

    .createTime {
      color: rgba(255, 255, 255, 1);
    }
  }
}

#userback {
  position: absolute;
  margin-top: -11px;
  margin-left: 40%;
  width: 104px;
  height: 45px;
  border-radius: 15px;

  background: rgba(41, 128, 227, 1);
  display: flex;
  color: #fff;
  text-align: center;

  cursor: pointer;
}

#usernamedown {
  position: relative;
  top: 5%;
}

#username {
  margin-left: 20%;
  margin-top: 12%;
}

#userbackli {
  margin-left: 37%;
}

@media all and (max-width: 1382px) {
  #userbackli {
    margin-left: 37%;
  }

  #create {
    margin-left: 48%;
  }
}

@media all and (max-width: 1163px) {
  #userbackli {
    margin-left: 23%;
    margin-top: 1.8%;
  }

  #create {
    margin-left: 37%;
    margin-top: -0.5%;
  }

  #trash {
    margin-left: 38%;
  }
}

@media all and (max-width: 936px) {
  #userbackli {
    margin-left: 12%;
    margin-top: 1.8%;
  }

  #create {
    margin-left: 28%;
    margin-top: -0.5%;
  }

  #trash {
    margin-left: 35%;
  }
}
</style>
