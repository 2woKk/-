<template>
    <body>
        <div class="loginform">
            <div class="top">
                <img :src="Tub" id="top-img">
                <h1>一站式视频库</h1>
            </div>
            <div class="index">
                <img :src="Img" id="index-img">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="登录" name="first">
                        <!-- 登录表单 -->
                        <el-form ref="loginFormRef" :model="loginruleform" status-icon :rules="loginrules"
                            label-width="120px" class="demo-ruleForm">
                            <el-form-item label="用户名" prop="user" class="login-form">
                                <el-input v-model="loginruleform.user" />
                            </el-form-item>
                            <el-form-item label="密码" prop="pass">
                                <el-input v-model="loginruleform.pass" type="password" autocomplete="off" show-password />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="loginsubmitForm(loginFormRef)">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="注册" name="second">
                        <!-- 注册表单 -->
                        <el-form ref="registerFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                            class="demo-ruleForm">
                            <el-form-item label="用户名" prop="user">
                                <el-input v-model.str="ruleForm.user" />
                            </el-form-item>
                            <el-form-item label="密码" prop="pass">
                                <el-input v-model="ruleForm.pass" type="password" autocomplete="off" show-password />
                            </el-form-item>
                            <el-form-item label="确认密码" prop="checkPass">
                                <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" show-password />
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model.str="ruleForm.email" />
                            </el-form-item>
                            <el-form-item label="电话" prop="phone">
                                <el-input v-model.number="ruleForm.phone" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm(registerFormRef)">注册</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="忘记密码" name="third">
                        <el-form ref="forgetFormRef" :model="forgetruleForm" status-icon :rules="forgetrules"
                            label-width="120px" class="demo-ruleForm">
                            <el-form-item label="用户名" prop="user">
                                <el-input v-model="forgetruleForm.user" />
                            </el-form-item>
                            <el-form-item label="新密码" prop="pass">
                                <el-input v-model="forgetruleForm.pass" type="password" autocomplete="off" show-password/>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="checkPass">
                                <el-input v-model="forgetruleForm.checkPass" type="password" autocomplete="off"
                                    show-password />
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email" id="forget-email">
                                <el-input v-model="forgetruleForm.email" autocomplete="off" />
                                <el-button type="primary" id="code" @click="GetCode">发送验证码</el-button>
                            </el-form-item>
                            <el-form-item label="验证码" prop="code">
                                <el-input v-model="forgetruleForm.code" autocomplete="off" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="forgetsubmitForm(forgetFormRef)">重置密码</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </body>
</template>

<script lang="ts" setup>
// @ts-ignore
import Tub from '../assets/image/pic.png'
// @ts-ignore
import Img from '../assets/image/index-img.png'
//axios
import {login,forgot,register,getcode} from '../api/auth' 

// 登录注册切换
import { reactive, ref, onMounted } from 'vue'
import type { TabsPaneContext } from 'element-plus'
//路由引用
import { useRouter } from 'vue-router'

onMounted(() => {

})

const router = useRouter()

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
}

import type { FormInstance, FormRules } from 'element-plus'

const registerFormRef = ref<FormInstance>()
const loginFormRef = ref<FormInstance>()
const forgetFormRef = ref<FormInstance>()


// 检测用户名
const checkuser = (rule: any, value: any, callback: any) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/
    if (!value) {
        callback(new Error('请输入用户名'))
    } else if (!usernameRegex.test(value)) {
        callback(new Error('3-16个字符，由字母、数字、“_”和“-”组成'))
    } else {
        callback()
    }
}

// 检测密码
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else if (value.length < 6 || value.length > 10) {
        callback(new Error('密码长度为8-10个字符'))
    } else if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        callback(new Error('至少一个大写字母、小写字母和一个数字'))
    } else {
        if (ruleForm.checkPass !== '') {
            if (!registerFormRef.value) return
            registerFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
    // 判断输入框是否为空
    if (value === '') {
        // 若为空，则返回错误信息
        callback(new Error('请重新输入密码'))
    } else if (value !== ruleForm.pass) {
        // 若不为空，但和ruleForm.pass不相等，则返回错误信息
        callback(new Error("两次密码不匹配!"))
    } else {
        // 若输入框和ruleForm.pass相等，则返回成功信息
        callback()
    }
}

// 检测邮箱
const checkemail = (rule: any, value: any, callback: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
        callback(new Error('请输入邮箱'));
    } else if (!emailRegex.test(value)) {
        callback(new Error('请输入有效的电子邮件地址'));
    } else {
        callback();
    }
}

// 检测手机
const checkphone = (rule: any, value: any, callback: any) => {
    const mobileRegex = /^[1][3-9]\d{9}$/
    if (!value) {
        callback(new Error('请输入手机号码'))
    } else if (!mobileRegex.test(value)) {
        callback(new Error('请输入有效的手机号码'))
    } else {
        callback()
    }
}

// 检测验证码
const checkcode = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('请输入验证码'))
    }
    // 下面逻辑写验证验证码逻辑
    else if (!value) {
        callback(new Error('验证码错误'))
    } else {
        callback()
    }
}

// 登录认证
const loginruleform = reactive({
    // 用户
    user: '',
    // 密码
    pass: ''
})

const loginsubmitForm = (formEl: FormInstance | undefined) => {
    // 判断表单实例是否存在
    if (!formEl) return
    // 验证表单
    formEl.validate((valid) => {
        // 验证通过
        if (valid) {
            console.log('submit!')
            // 验证不通过
        } else {
            console.log('error submit!')
            return false
        }
    })
    login({username: loginruleform.user, password: loginruleform.pass}).then((res) => {
        if(res.code === 200){
            sessionStorage.setItem('token', res.data.token)
            router.push('/')
        }

    })
}

const loginrules = reactive<FormRules<typeof loginruleform>>({
    // 用户验证规则
    user: [{ validator: checkuser, trigger: 'blur' }],
    // 密码验证规则
    pass: [{ validator: validatePass, trigger: 'blur' }]
})


// 注册验证
const ruleForm = reactive({
    // 用户
    user: '',
    // 密码
    pass: '',
    // 确认密码
    checkPass: '',
    // 邮箱
    email: '',
    // 手机
    phone: ''
})

const rules = reactive<FormRules<typeof ruleForm>>({
    // 用户验证规则
    user: [{ validator: checkuser, trigger: 'blur' }],
    // 密码验证规则
    pass: [{ validator: validatePass, trigger: 'blur' }],
    // 确认密码验证规则
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
    // 邮箱验证规则
    email: [{ validator: checkemail, trigger: 'blur' }],
    // 手机验证规则
    phone: [{ validator: checkphone, trigger: 'blur' }]
})

const submitForm = (formEl: FormInstance | undefined) => {
    // 判断表单实例是否存在
    if (!formEl) return
    // 验证表单
    formEl.validate((valid) => {
        // 验证通过
        if (valid) {
            console.log('submit!')
            // 验证不通过
        } else {
            console.log('error submit!')
            return false
        }
    })
    register({username: ruleForm.user, password: ruleForm.pass, email: ruleForm.email, phone: ruleForm.phone}).then((res) => {
        console.log(res)
        if(res.code == 200){
            alert('注册成功')
        }
    })
}

// 忘记密码
const forgetruleForm = reactive({
    // 用户
    user: '',
    // 密码
    pass: '',
    // 确认密码
    checkPass: '',
    // 邮箱验证
    email: '',
    // 验证码
    code: ''
})
const validatePass3 = (rule: any, value: any, callback: any) => {
    // 判断输入框是否为空
    if (value === '') {
        // 若为空，则返回错误信息
        callback(new Error('请重新输入密码'))
    } else if (value !== forgetruleForm.pass) {
        // 若不为空，但和ruleForm.pass不相等，则返回错误信息
        callback(new Error("两次密码不匹配!"))
    } else {
        // 若输入框和ruleForm.pass相等，则返回成功信息
        callback()
    }
}
const forgetrules = reactive<FormRules<typeof forgetruleForm>>({
    // 用户验证规则
    user: [{ validator: checkuser, trigger: 'blur' }],
    // 密码验证规则
    pass: [{ validator: validatePass, trigger: 'blur' }],
    // 确认密码验证规则
    checkPass: [{ validator: validatePass3, trigger: 'blur' }],
    // 邮箱验证规则
    email: [{ validator: checkemail, trigger: 'blur' }],
    // 验证码验证规则
    code: [{ validator: checkcode, trigger: 'blur' }]
})

const forgetsubmitForm = (formEl: FormInstance | undefined) => {
    // 判断表单实例是否存在
    if (!formEl) return
    // 验证表单
    formEl.validate((valid) => {
        // 验证通过
        if (valid) {
            console.log('submit!')
            // 验证不通过
        } else {
            console.log('error submit!')
            return false
        }
    })
    forgot({email: forgetruleForm.email,newPassword: forgetruleForm.pass},forgetruleForm.code).then((res => {
        if(res.code == 200){
            alert('修改成功')
            console.log(res)
        }
    }))
    console.log(forgetruleForm.code)

}
const GetCode = () =>{
    getcode({email: forgetruleForm.email}).then((res => {
        if(res.code == 200){
            alert('发送成功')
        }
    }))
}
</script>

<style>
body {
    overflow: hidden;

}

/* 登录表单 */
.loginform {
    margin: 4% 13%;
    width: 1000px;
    height: 630px;

}

.top {
    width: 100%;
    height: 80px;
    padding-top: 1%;

    display: flex;
}

/* h1 */
h1 {
    margin: 0.5% 25% 0% 1%;
    display: inline-block;
}

/* img */
#top-img {
    margin: 1% 0% 0% 50%;

    height: 65%;
    width: 4.6%;
}

.index {
    margin-left: 12%;
    margin-top: 7%;
    width: 100%;
    display: flex;
}

#index-img {
    margin: -1% 0% 0% 2%;

    height: 50%;
    width: 50%;
}

/* 表单切换 */
.demo-tabs>.el-tabs__content {
    margin-top: -10%;
    padding: 24px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.demo-tabs {
    margin-left: 8%;
    width: 350px;
}

.el-tabs__item {
    padding-left: 60%;
    left: 5%;
    width: 200%;
}

.el-form {
    margin-top: 9%;
}

/* 登录样式 */
.login-form {
    margin-top: 15%;
}


/* 注册样式 */
.el-form-item__label {
    margin-left: -25%;
    width: 100%;
    margin-top: 2%;
    height: 49px;
}

.el-form-item__error {
    width: 1000px;
}

.el-button {
    margin-top: 4%;
    margin-left: -60%;
    margin-right: -10%;
    width: 500px;
}

#code {
    width: 70%;
    margin-top: -37%;
    margin-left: 111%;
}

#forget-email {
    width: 70%;
    margin-left: -8.2%;

    display: flex;
}

@media all and (max-width: 1285px) {
    #top-img {
        margin: 1vh 0vh 0vh 45vh;

        height: 65%;
        width: 4.6%;
    }

    .index {
        margin-left: 2vh;
        margin-top: 9vh;
        width: 100vh;
        display: flex;
    }
}

@media all and (max-width: 990px) {
    #top-img {
        margin: 1vh 0vh 0vh 30vh;

        height: 65%;
        width: 4.6%;
    }

    .index {
        margin-left: 17vh;
        margin-top: 7vh;
        width: 100vh;
        display: flex;
    }

    #index-img {
        display: none;
    }
}

@media all and (max-width: 666px) {
    #top-img {
        margin: 1vh 0vh 0vh 13vh;

        height: 65%;
        width: 4.6%;
    }

    .index {
        margin-left: -1vh;
        margin-top: 7vh;
        width: 100vh;
        display: flex;
    }

    #index-img {
        display: none;
    }
}

@media all and (max-width: 510px) {
    #top-img {
        margin: 1vh 0vh 0vh 6vh;

        height: 65%;
        width: 4.6%;
    }

    .index {
        margin-left: -7vh;
        margin-top: 7vh;
        width: 100vh;
        display: flex;
    }

    #index-img {
        display: none;
    }
}
</style>