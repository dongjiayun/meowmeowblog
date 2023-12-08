<template>
    <el-dialog
        v-model="dialogVisible"
        title="登陆"
        class="login"
        width="300px"
    >
        <div class="login">
            <div v-if="loginType === 'emailWithPassword'">
                <el-form
                    ref="passwordFormRef"
                    :rules="passwordFormRules"
                    :model="passwordForm"
                >
                    <el-form-item label="邮箱" prop="email">
                        <el-input
                            v-model="passwordForm.email"
                            placeholder="请输入邮箱"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            v-model="passwordForm.password"
                            type="password"
                            show-password
                            clearable
                            placeholder="请输入密码"
                        />
                    </el-form-item>
                </el-form>
                <div class="login-other" @click="triggleMethod('email')">使用验证码登录</div>
                <div class="login-button">
                    <el-button type="primary" @click="handleLogin">登陆</el-button>
                </div>
            </div>
            <div v-if="loginType === 'email'">
                <el-form
                    ref="emailFormRef"
                    :rules="emailFormRules"
                    :model="emailForm"
                >
                    <el-form-item label="邮箱" prop="email">
                        <el-input
                            v-model="emailForm.email"
                            placeholder="请输入邮箱"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item label="验证码" prop="otp">
                        <div class="login-form-otp">
                            <el-input
                                v-model="emailForm.otp"
                                placeholder="请输入验证码"
                                clearable
                            />
                            <el-button
                                :disabled="otpDelay > 0"
                                style="margin-left: 10px"
                                @click="handleSendOtp"
                            >{{ otpDelay === 0 ? '获取验证码' : `${otpDelay}秒后重试` }}</el-button>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="login-other" @click="triggleMethod('emailWithPassword')">使用邮箱密码登录</div>
                <div class="login-button">
                    <el-button type="primary" @click="handleLogin">登陆/注册</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Email } from '@/utils/valids'
import { AuthModel } from '@/api'
import { ElLoading, ElMessage } from 'element-plus'

const loginType = ref('emailWithPassword')

const passwordForm = ref({
    email: '',
    password: ''
})

const emailForm = ref({
    email: '',
    otp: ''
})

const emailFormRef = ref()
const passwordFormRef = ref()

const emailValidator = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入邮箱'))
    } else if (!Email.test(value)) {
        callback(new Error('请输入正确的邮箱'))
    } else {
        callback()
    }
}

const passwordFormRules = ref({
    email: {
        required: true,
        validator: emailValidator,
    },
    password: {
        required: true,
        message: '请输入密码',
    }
})

const emailFormRules = ref({
    email: {
        required: true,
        validator: emailValidator,
    },
    otp: {
        required: true,
        message: '请输入验证码',
    }
})

const dialogVisible = ref(false)
const open = () => {
    dialogVisible.value = true
}
const triggleMethod = method => {
    loginType.value = method
}

const otpDelay = ref(0)
let ticket
let interval
const handleSendOtp = async() => {
    await emailFormRef.value.validateField('email')
    const params = {
        email: emailForm.value.email
    }
    const loading = ElLoading.service({
        lock: true,
        text: '请稍后~'
    })
    AuthModel.sendEmailOtp(params).then(res => {
        if (res.status === 0) {
            ticket = res.data
            ElMessage({
                type: 'success',
                message: '验证码已发送'
            })
            otpDelay.value = 60
            interval = setInterval(() => {
                otpDelay.value--
                if (otpDelay.value <= 0) {
                    clearInterval(interval)
                }
            }, 1000)
        } else {
            ElMessage({
                type: 'error',
                message: res.message
            })
        }
    }).finally(() => {
        loading.close()
    })
}

const handleLogin = async() => {
    if (loginType.value === 'emailWithPassword') {
        await passwordFormRef.value.validate()
        const params = {
            loginType: loginType.value,
            email: passwordForm.value.email,
            password: passwordForm.value.password
        }
        const loading = ElLoading.service({
            lock: true,
            text: '请稍后~'
        })
        AuthModel.login(params).then(res => {
            if (res.status === 0) {
                ElMessage({
                    type: 'success',
                    message: '登陆成功'
                })
                dialogVisible.value = false
            } else {
                ElMessage({
                    type: 'error',
                    message: res.message
                })
            }
        }).finally(() => {
            loading.close()
        })
    } else if (loginType.value === 'email') {
        await emailFormRef.value.validate()
        const params = {
            loginType: loginType.value,
            otp: emailForm.value.otp,
            email: emailForm.value.email,
            ticket
        }
        const loading = ElLoading.service({
            lock: true,
            text: '请稍后~'
        })
        AuthModel.login(params).then(res => {
            if (res.status === 0) {
                ElMessage({
                    type: 'success',
                    message: '登陆成功'
                })
                dialogVisible.value = false
            } else {
                ElMessage({
                    type: 'error',
                    message: res.message
                })
            }
        }).finally(() => {
            loading.close()
        })
    }
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.login{
    &-other{
        text-align: right;
        color: #FFAA2C;
    }
    &-button{
        margin-top: 10px;
        text-align: center;
    }
}
.login-form-otp{
    display: flex;
    align-items: center;
}
</style>
