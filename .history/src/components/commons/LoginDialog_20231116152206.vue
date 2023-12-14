<template>
  <el-dialog
    id="login"
    class="login_dia"
    :modal="false"
    title="登录"
    :visible.sync="loginDialogVisible"
    width="30%"
    :before-close="loginDialogClose">
    <div v-if="loginWay === 'ewm'">
      <h4>扫码登录</h4>
      <el-image :src="erweima" >
      </el-image>
      <p>使用网易云app扫码登录</p>
      <el-button @click="loginWay='mm'">使用其他方式登录</el-button>
    </div>
    <el-form :model="telLoginForm"
             :rules="rules"
             ref="telLoginRef"
             label-width="auto"
             v-if="loginWay !== 'ewm'"
             class="demo-ruleForm">
      <el-form-item prop="phone">
        <el-input type="tel"
                  clearable
                  placeholder="手机号"
                  v-model="telLoginForm.phone"
                  @input="handleTelInp"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" v-if="loginWay === 'yzm'">
        <el-col :span="14">
          <el-input type="text"
                    placeholder="验证码"
                    v-model="telLoginForm.captcha"
                    autocomplete="off"></el-input>
        </el-col>
        <el-col :span="10">
          <div class="cap_btn" v-if="canSend"
               @click.stop="sendCaptcha">
            <div>发送验证码</div>
            <div class="shade bl_bg"></div>
          </div>
          <div class="disable_btn" v-else>
            <div>{{capSecond}}秒后再次发送</div>
          </div>
        </el-col>
      </el-form-item>
      <el-form-item prop="password" v-if="loginWay === 'mm'">
        <el-input type="password"
                  clearable
                  placeholder="请输入密码"
                  v-model="telLoginForm.password"
                  autocomplete="off"></el-input>
      </el-form-item>
      <div class="warn_box" v-show="isWarning">
        请输入正确的手机号
      </div>
      <el-form-item>
        <el-link type="info" :underline="false"
                 v-if="loginWay === 'yzm'" @click="loginWay='mm'">
          <div class="switch_btn">密码登录</div>
        </el-link>
        <el-link type="info" :underline="false"
                 v-if="loginWay === 'mm'" @click="loginWay='yzm'">
          <div class="switch_btn">短信登录</div>
        </el-link>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="telLogin('ruleForm')">登录</el-button>
      </el-form-item>
      <el-button @click="loginWay='ewm'">使用二维码扫码登录</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      // 登录方式 二维码ewm 验证码yzm 密码mm
      loginWay: 'ewm',
      canSend: true,
      isWarning: false,
      isCaptcha: false,
      capTimer: '',
      capSecond: 60,
      telLoginForm: {
        phone: '',
        captcha: '',
        password: ''
      },
      loginDialogVisible: false,
      loginTelDialogVisible: false,
      // 二维码key
      key: '',
      // 二维码base64
      erweima: '',
      // 节点
      warningNode: {}
    }
  },
  created () {
    this.$bus.$on('showLogin', () => {
      this.loginDialogVisible = true
    })
  },
  mounted () {
    // this.getErweima()
    // this.checkErweima()
  },
  watch: {
    loginWay: {
      handler (newVal, oldVal) {
        console.log(newVal + 'new')
        console.log(oldVal + 'old')
      }
    }
  },
  methods: {
    // 获取二维码
    async getErweima () {
      const { data: res } = await this.$http.get('/login/qr/key')
      if (res.code !== 200) {
        return this.$message.error('获取二维码失败请重试')
      }
      this.key = res.data.unikey
      const params = {
        key: res.data.unikey,
        qrimg: true
      }
      const { data: resKey } = await this.$http.post('/login/qr/create', params)
      if (resKey.code !== 200) {
        return this.$message.error('获取二维码失败请重试')
      }
      this.erweima = resKey.data.qrimg
    },
    // 检查二维码是否过期
    async checkErweima () {
      const { data: res } = await this.$http.post('/login/qr/check', { key: this.key })
      console.log(res)
      if (res.code === 200) {
        console.log(res)
      }
    },
    // 监听手机号对话框输入
    handleTelInp (val) {
      if (!(/[0-9]+/.test(val) || val.length === 0)) {
        return this.showWarning('手机号必须是数字')
      }
      this.isWarning = false
    },
    // 登录对话框关闭
    loginDialogClose (done) {
      this.loginDialogVisible = false
      // this.isWarning = false
    },
    showWarning (mes) {
      this.warningNode = window.$('.warn_box')
      this.isWarning = true
      this.warningNode.html(mes)
    },
    // 校正手机格式 应该用自带的event，以后再改
    checkTel () {
      // 手机号可能会有更新
      if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.telLoginForm.phone))) {
        this.isWarning = true
        this.showWarning('请输入正确的手机号码')
        return false
      }
      return true
    },
    // 发送验证码
    sendCaptcha (e) {
      this.$refs.telLoginRef.validate(async (valid) => {
        // 手机不为空且格式正确
        this.checkTel()
        if (!this.isWarning) {
          // 60秒后再次发送验证码
          this.canSend = false
          this.capTimer = window.setInterval(() => {
            this.capSecond--
            if (this.capSecond <= 0) {
              this.canSend = true
              clearInterval(this.capTimer)
              this.capTimer = 60
            }
          }, 1000)
          const { data: res } = await this.$http.get('captcha/sent',
            { params: { phone: this.telLoginForm.phone } })
          if (res.code !== 200) {
            return this.$message.error({
              message: '发送失败',
              offset: 200,
              center: false
            })
          }
          console.log(res)
          this.$message.success('验证码发送成功', { offset: '200px' })
        }
      })
    },
    // 手机号登陆中的验证码/密码登陆界面模式
    switchPswCap () {
      this.ifCaptcha = !this.ifCaptcha``
    },
    // 手机账号登录
    async telLogin () {
      if (!this.telLoginForm.phone) return this.showWarning('手机号不能为空')
      if (!(this.telLoginForm.password || this.telLoginForm.captcha)) {
        const key = this.isCaptcha ? '验证码' : '密码'
        return this.showWarning(key + '不能为空')
      }
      if (!this.checkTel()) return
      const { data: res } = await this.$http.post('/login/cellphone', this.telLoginForm)
      if (res.code !== 200) {
        this.$store.commit('updateLogStatus', false)
        return this.showWarning('账号或密码错误请重试')
      }
      this.$store.commit('updateLogStatus', true)
      window.sessionStorage.setItem('isLogin', 1)
      window.sessionStorage.setItem('token', res.token)
      const user = {
        id: res.profile.userId,
        img: res.profile.avatarUrl,
        name: res.profile.nickname
      }
      this.$store.commit('updateUser', user)
      this.loginDialogVisible = false
      this.$bus.$emit('getMes')
    }
  }
}
</script>

<style scoped>
  .login_dia {
    min-width: 300px;
  }
  .cap_btn {
    position: relative;
    width: 95px;
    height: 38px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid #C0C4CC;
    background-color: #ffffff;
    color: #898a8e;
    text-align: center;
  }
  .disable_btn {
    position: relative;
    width: 120px;
    height: 38px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid #C0C4CC;
    background-color: #dbdfe8;
    color: #898a8e;
    text-align: center;
  }
  .switch_btn {
    margin-left: 15px;
  }
  .login_dia .warn_box {
    position: absolute;
    top: 175px;
    margin-bottom: 0;
    margin-left: 15px;
    color: #af101d;
  }
</style>
