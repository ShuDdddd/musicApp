<template>
  <el-dialog
    id="login"
    class="login_dia"
    :modal="false"
    title="登录"
    :visible.sync="loginDialogVisible"
    width="30%"
    :before-close="loginDialogClose">
    <el-form :model="telLoginForm"
             :rules="rules"
             ref="telLoginRef"
             label-width="auto"
             class="demo-ruleForm">
      <el-form-item prop="phone">
        <el-input type="tel"
                  clearable
                  placeholder="手机号"
                  v-model="telLoginForm.phone"
                  @input="handleTelInp"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" v-if="isCaptcha">
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
      <el-form-item prop="password" v-else>
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
                 v-if="isCaptcha" @click="isCaptcha = false">
          <div class="switch_btn">密码登录</div>
        </el-link>
        <el-link type="info" :underline="false"
                 v-if="!isCaptcha" @click="isCaptcha = true">
          <div class="switch_btn">短信登录</div>
        </el-link>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="telLogin('ruleForm')">登录</el-button>
      </el-form-item>
    </el-form>
    <el-image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAklEQVR4AewaftIAAAeTSURBVO3BQQ4by5LAQLKg+1+Z42WuGmhI9n9TyAj7g7UucVjrIoe1LnJY6yKHtS5yWOsih7UucljrIoe1LnJY6yKHtS5yWOsih7UucljrIoe1LnJY6yIfvqTyL1W8ofKkYlKZKiaVqeKXVKaKSWWq+IbKVDGp/EsV3zisdZHDWhc5rHWRDz9W8Usq36iYVCaVqeJJxaQyVbyhMlVMKlPFpPKNijcqfknllw5rXeSw1kUOa13kw1+m8kbFGypTxTdUpoq/qWJSeaPiGypTxRsqb1T8TYe1LnJY6yKHtS7y4TIqb1Q8UZkqpopJZap4o2JSeaLypGJSudlhrYsc1rrIYa2LfLhMxaQyVTxRmSomlW+ovFExqUwVT1Smipsd1rrIYa2LHNa6yIe/rOJfUvkllScVk8qTiknlicpU8UbFpPKk4o2K/5LDWhc5rHWRw1oX+fBjKv9LFZPKE5WpYlKZKiaVqWJSmSqeVEwqT1SmikllqphU3lD5LzusdZHDWhc5rHUR+4P/x1SeVEwqU8UvqbxRMalMFZPKVPFE5UnFTQ5rXeSw1kUOa13kw5dUpopJ5ZcqpopJZVKZKp6ofKPiicqTim+oTBWTyhsqv1TxNx3WushhrYsc1rrIhy9VTCpTxRsqU8WkMlU8qXiiMlU8UZkqJpUnFZPKVDGpPFGZKiaVqWJSeVLxSypTxS8d1rrIYa2LHNa6iP3BF1T+lyqeqHyjYlJ5UjGpPKmYVKaKN1SmikllqphUpopJZaqYVL5R8Y3DWhc5rHWRw1oXsT/4gsqTikllqphUpoonKlPFpPKk4onKk4o3VL5R8YbKVPFE5ZcqnqhMFd84rHWRw1oXOax1kQ8/VvGk4knFpDJVPFF5UjGpTBVTxaTyROWNiicqT1SeVEwq36iYVJ6o/EuHtS5yWOsih7UuYn/wQypTxROVJxW/pPJGxROVqeKJyhsVk8pU8UsqU8WkMlX8lxzWushhrYsc1rrIhy+pTBWTylTxpGJSmSreUJkq3lD5hspUMalMFU8qJpVvVDxReaLypGJSeVLxjcNaFzmsdZHDWhf58GMqU8U3Kr5RMak8qXij4knFGypPKqaKb6hMFZPKGxVPKiaVXzqsdZHDWhc5rHWRD1+qeKIyVUwVk8obFd+oeFLxDZWpYqp4Q+WNiicVb1RMKk9U/qXDWhc5rHWRw1oX+fCXVUwqU8VU8UTlDZWp4hsqb1R8Q+VJxaTyhsqTiicV36j4pcNaFzmsdZHDWhexP/iCyjcqnqhMFZPKVDGp/FLFv6QyVUwq/0sVb6g8qfjGYa2LHNa6yGGti3z4UsWk8ksVk8o3KiaVJxVPVKaKJypTxaQyVUwqU8UbKt+omFSmiicVk8ovHda6yGGtixzWusiHL6k8qZhU3lCZKt6omFSmiknlGypPKp5UPKmYVN6oeKLyDZUnFVPFLx3WushhrYsc1rqI/cEXVJ5UPFGZKv4llaniGyrfqJhUnlRMKlPFGypTxRsqU8WkMlX80mGtixzWushhrYt8+FLFE5UnFZPKk4onKlPFL6m8UfGGylTxRsWk8kbFpPJLFZPKVPGNw1oXOax1kcNaF/nwJZWp4g2VqeINlScqU8UTlTcqJpVJZaqYVJ6oPKl4o+KJyjcqnqj8TYe1LnJY6yKHtS7y4R+reKLypOJJxaQyqUwVk8pUMalMKlPFGxVPVN5QmSomlaliqphUvqEyVUwqv3RY6yKHtS5yWOsiH/7jKp5UvFHxhsqTiicqTyqeVEwqk8pUMalMFU9Upoo3VKaKJxW/dFjrIoe1LnJY6yIf/jGVqeKJylQxqbyhMlV8Q+WNikllqphUpoonKlPFpDJVTBWTypOKJypvVHzjsNZFDmtd5LDWRT78ZRWTyqTypGJSmSomlaliUvmliicqTyomlW9UTCpPVJ5UfKPiXzqsdZHDWhc5rHWRD/9YxaQyVUwqb1RMKk9UpoonKpPKL1VMKk9U/iaVNyomlanibzqsdZHDWhc5rHUR+4P/x1TeqJhUnlT8ksobFZPKGxWTypOKN1SeVEwqU8UvHda6yGGtixzWusiHL6n8SxVTxaTyROVJxROVJxWTylQxqbxR8Y2KSeWJylTxpGJSmSomlaniG4e1LnJY6yKHtS7y4ccqfknlico3Kt6oeKNiUnlDZap4Q2WqeKPiDZWp4knFLx3WushhrYsc1rrIh79M5Y2KX6qYVJ6oTBWTylTxROWNiicq31B5ovKNiknljYpvHNa6yGGtixzWusiHy6lMFW+oPFGZKqaKSWWqmFTeqJhUpoo3VJ5UTCpPKp6o/NJhrYsc1rrIYa2LfLhMxaTyRsXfVDGpTBVvqDxReaPijYo3VP6mw1oXOax1kcNaF7E/+ILKVPFLKlPFL6lMFZPKVDGpTBWTyi9VvKEyVUwqb1RMKk8qnqhMFd84rHWRw1oXOax1kQ8/pvIvqbxRMVVMKt9QeVLxhsoTlTdUpopJ5RsVk8q/dFjrIoe1LnJY6yL2B2td4rDWRQ5rXeSw1kUOa13ksNZFDmtd5LDWRQ5rXeSw1kUOa13ksNZFDmtd5LDWRQ5rXeSw1kX+D0Vk+H0xB43KAAAAAElFTkSuQmCC">
    </el-image>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      canSend: true,
      isWarning: false,
      isCaptcha: true,
      capTimer: '',
      capSecond: 60,
      telLoginForm: {
        phone: '',
        captcha: '',
        password: ''
      },
      loginDialogVisible: false,
      loginTelDialogVisible: false,
      key: '',
      // 二维码base64
      erWei: '',
      // 账号校正
      /* rules: {
        phone: [
          { required: true, message: '..........', trigger: 'blur' }
        ]
      }, */
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
    this.getErweima()
    this.checkErweima()
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
      return resKey.data.qrimg
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
