<script src="../plugin/.postcssrc.js"></script>
<template>
      <el-container>
        <el-header>
          <div class="mod_logo">
            <img src="../assets/img/flower.png">
            <span>网易云音乐</span>
          </div>
          <!--头部导航栏-->
          <el-menu :default-active="activeIndex"
                   class="header_menu"
                   active-text-color="white"
                   text-color="white"
                   router
                   mode="horizontal"
                   @select="handleSelect">
            <el-menu-item v-for="item in menuList"
                          :key="item.title"
                          :index="'/'+item.path">
              <span>{{item.title}}</span>
              <div class="triangle"></div>
            </el-menu-item>
          </el-menu>
          <!--搜索框-->
          <div class="mod_search">
              <el-input placeholder="请输入内容"
                        ref="searchInt"
                        @blur="inputBlur"
                        @keyup.enter.native="toSearch"
                        @focus="onFocus"
                        clearable
                        size="mini"
                        prefix-icon="el-icon-search"
                        v-model="searchKey">
              </el-input>
              <el-card class="search_card" v-if="searchMusics.length!==0">
                <ul>
                  <li v-for="item in searchMusics" :key="item.id">
                    <el-link @click="clickMusic(item.id)">
                      {{item.name}} - {{item.singer}}
                    </el-link>
                  </li>
                </ul>
              </el-card>
          </div>
          <!--已登录显示个人信息板块-->
          <div class="mod_user" v-if="$store.state.isLogin">
              <el-badge :value="mesCount">
                <el-avatar :src='$store.state.user.img'></el-avatar>
              </el-badge>
              <ul>
                <li>我的主页</li>
                <li>
                  我的消息
                  <span>{{mesCount}}</span>
                </li>
                <li @click.stop="logout">退出</li>
              </ul>
          </div>
          <!--未登录显示登录按钮-->
          <el-button size="mini" class="login_btn"
                     v-else
                     @click="showLogDia">
            登录
          </el-button>
          <!--登录对话框组件-->
          <LoginDialog ref="loginDialog"/>
        </el-header>
        <!--主内容-->
        <el-main>
            <router-view></router-view>
            <div class="m_footer"></div>
        </el-main>
        <el-footer>
          <MusicPlayer
            ref="musicPlayer">
          </MusicPlayer>
        </el-footer>
      </el-container>
</template>

<script>
  import MusicPlayer from './commons/MusicPlayer'
  import LoginDialog from './commons/LoginDialog'
  import axios from 'axios'
  import getUser from '../plugin/user.js'
  export default {
    components: {
      MusicPlayer,
      LoginDialog
    },
    data () {
      return {
        activeIndex: '/discover',
        searchKey: '',
        // activePath:'',
        menuList: [
          {title: '发现音乐', path: 'discover'},
          {title: '我的音乐', path: 'tologin'},
          {title: '关注', path: 'friend'},
          {title: '下载客户端', path: 'download'}
        ],
        searchMusics: [],
        searchTimer: {}, // 搜索框获得焦点时触发定时器
        mes: {}, //通知----通知、评论、艾特、私信
        mesCount: 0, //登录用户的消息提示
      }
    },
    created () {
      this.$bus.$on('toLogin', () => {
        this.loginDialogVisible = true
      })
      this.$bus.$on('getMes', () => {
        this.getUserMes()
        this.getMes()
        this.menuList[1].path = 'my/' + this.$store.state.user.id
      })
      this.getLoginStatus()
    },
    mounted () {
    },
    methods: {
      // 显示登录面板
      showLogDia () {
        this.$refs.loginDialog.loginDialogVisible = true
        this.$refs.loginDialog.changeLoginWay('ewm')
      },
      // 获取登录状态
      async getLoginStatus () {
        const { data: res } = await this.$http('/login/status')
        if(res.data.profile != null) {
          const user = {
            id: res.data.profile.userId,
            img: res.data.profile.avatarUrl,
            name: res.data.profile.nickname
          }
          this.$store.commit('updateUser', user)
          this.$store.commit('updateLogStatus',true)
          this.loginDialogVisible =false
          this.menuList[1].path = 'my/' + res.data.profile.userId
          window.sessionStorage.setItem('isLogin', 1)
          await this.getUserMes()
          await this.getMes()
        }
      },
      // 账号退出
      async logout () {
        let my = false
        if (window.location.href.indexOf('/my') > 0) {
          my = true
        }
        const { data: res } = await this.$http('/logout')
        console.log(res)
        if(res.code !== 200) {
          return this.$message.error('退出账号失败，请重试')
        }
        this.$store.commit('updateLogStatus',false)
        window.sessionStorage.setItem('isLogin', 0)
        this.loginDialogVisible =false
        this.menuList[1].path = 'tologin'
        if(my) this.$router.push('/discover')
      },
      // 点击头部菜单 改变二级菜单样式
      handleSelect (key, keyPath) {
        this.activePath = key
        this.$refs.discoverMenu.showMenu(key)
      },
      //回车键开启歌曲搜索
      async toSearch () {
        this.$refs.searchInt.blur()
        this.$router.push({ name: 'search', params: { key: this.searchKey } })
        if (this.$router.history.current.name === 'search') {
          this.$bus.$emit('searchRouter', this.searchKey)
        }
      },
      // 歌曲搜索
      async search() {
        this.searchMusics = [];
        const { data: res } = await this.$http.get ('search', {params: {keywords: this.searchKey}})
        if (res.code !== 200) {
          return this.$message.error('搜索失败请重新搜索')
        }
        console.log(res)
        for (let i = 0; i < res.result.songs.length; i++) {
          var obj = {
            id: res.result.songs[i].id,
            name: res.result.songs[i].name,
            singer: res.result.songs[i].artists[0].name,
            singerId: res.result.songs[i].artists[0].id,
            mvId: res.result.songs[i].mvid
          }
          this.searchMusics.push(obj)
        }
      },
      //当搜索框失去焦点
      inputBlur(e) {
        clearInterval(this.searchTimer)
        setTimeout(()=> {
          this.searchMusics = []
        },2000)
      },
      // 搜索框获得焦点
       onFocus() {
        let pre = this.searchKey;
        this.searchTimer = setInterval(()=> {
          // 查看搜索词是否变化 减少查询次数
          if(pre === this.searchKey) return
          else pre = this.searchKey
          if( this.searchKey.trim()!== '') {
            this.search()
          }
        },500)
      },
      clickMusic(id) { //点击列表播放音乐
        this.$refs.musicPlayer.changeMusic(id) //将音乐添加到列表
      },
      // 获取用户信息
      async getUserMes () {
        const { data: res } = await axios.get('/user/detail', { params: { uid: this.$store.state.user.id } })
        if (res.code !== 200) {
          this.$message.error('获取用户信息失败')
        }
      },
      // 获取通知
      async getMes () {
        this.mes.not = await getUser.getNotices()
        this.mes.com = await getUser.getComments(this.$store.state.user.id)
        this.mes.for = await getUser.getForwards()
        this.mes.pri = await getUser.getPrivate()
        this.mesCount = this.mes.for.newCount + this.mes.pri.newMsgCount > 99 ? '99+' :  this.mes.for.newCount + this.mes.pri.newMsgCount
      },
      // 头部菜单跳转
      // headMenuSelect (key, keyPath) {
      //   console.log(key)
      //   console.log(keyPath)
      // }
    }
  }
</script>

<style scoped>

  .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
    background-color: #F7C3C7;
  }
  audio {
    width: 500px;
    background-color: #42b983;
  }
  /deep/ .el-dialog__title {
    display: block!important;;
  }
  @import url('../assets/css/home.css');
</style>
