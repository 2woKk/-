import request from '@/helpers/request'

// 获取文件夹列表
export const getFolderList = (data) => {
  return request({
    url: `/folder/loadAllFolder`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
};
// 获取首页视频列表
export const getVideoList = () => {
  return request({
    url: `/video/index`,
    method: 'GET'
  })
};

//新建文件夹
export const newFolder = (data) => {
  return request({
    url: `/folder/newFolder`,
    method: 'Post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
};
// 删除文件夹
export const deleteFolder = (data) => {
  return request({
    url: `/folder/del`,
    method: 'Post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
};
//重命名文件夹
export const renameFoleder = (data) => {
  return request({
    url: `/folder/rename`,
    method: 'Post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
};

//首页获取视频封面
export const getVideoImage = (data) => {
  return request({
    url: `video/getImage`,
    method: 'GET',
    data
  })
};

//播放视频
export const showVideo  = (data) => {
  return request({
    url: `/video/stream?videoTitle=1701850525608_nagakusa_kun.mp4`,
    method: 'Post',
    data: data
  })
};

//重命名视频
export const renameVideo = (data) => {
  return request({
    url: `/video/rename`,
    method: 'Post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
};

//视频下载
export const downloadVideo = (data) => {
  return request({
    url: `/video/download/742959963_nb3-1-16.mp4`,
    method: 'GET',
    data
  })
};

//视频删除进入回收站
export const deleteVideo = (data) => {
  return request({
    url: `/video/del`,
    method: 'Put',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
};
//获取用户名

export const getUserName = (data) => {
  return request({
    url: `/user/info`,
    method: 'POST',
    data
  })
}
//回收站
export const getRecycle = (data) => {
  return request({
    url: '/video/recovery',
    method: 'GET',
    data
  })
}
