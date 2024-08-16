import request from '@/helpers/request'
// 测试接口
export const test = () => {
  return request({
    url: '/user/hello',
    method: 'GET',
  })
};
export const upload = (data) =>{
    return request({
        url: '/video/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
};
export const login = (data) =>{
    return request({
        url: '/user/login',
        method: 'POST',
        username:'',
        password:'',
        data
    })
};
export const register = (data) =>{
    return request({
        url: '/user/register',
        method: 'POST',
        username: '',
        password: '',
        email:'',
        phone:'',
        headers:{'Content-Type':'application/json'},
        data
    })
};
export const getcode = (data) =>{
    return request({
        url: '/user/email',
        method: 'POST',
        email: '',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
};
export const forgot = (data,emailCode='') =>{
    return request({
        url: '/user/reset/password?',
        method: 'POST',
        email: '',
        newPassword: '',
        data,
        params:{
            emailCode
        }
    })
};
export const getVideo = (data)=> {
    return request({
        url: '/video/index',
        method: 'GET',
        data
    })
};
export const getImg = (data) => {
    return request({
        url:'/video/getImage',
        method:'GET',
        data
    })
}
export const videoplay = (data,videoTitle='') => {
    return request({
        url:'/video/stream?',
        method:'POST',
        data,
        params:{
            videoTitle
        }
    })
}
export  const videorespeed = (data) => {
    return request({
        url:'/video/speed',
        method:'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        file:'',
        speed:'',
        data
    })
}
export const videorevolume =(data) => {
    return request({
        url:'video/volume',
        method:'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        file:'',
        decibel:'',
        data
    })
}
export const videomerge = (data) => {
    return request({
        url:'video/merge',
        method:'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        file1:'',
        file2:'',
        outputVideoName:'',
        data
    })
}