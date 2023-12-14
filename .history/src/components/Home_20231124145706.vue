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
            <div class="searchBox">
              <el-input placeholder="请输入内容"
                        @blur="inputBlur"
                        @keyup.enter.native="search"
                        clearable
                        style="width: 180px"
                        size="mini"
                        prefix-icon="el-icon-search"
                        v-model="searchKey">
              </el-input>
              <el-card class="search_card" v-if="searchMusics.length!==0">
                <ul>
                  <li v-for="item in searchMusics" :key="item.id">
                    <el-link @click="clickMusic(item)">
                      {{item.name}} - {{item.singer}}
                    </el-link>
                  </li>
                </ul>
              </el-card>
            </div>
            <!--已登录显示个人信息板块-->
            <div class="top_cover" v-if="$store.state.isLogin">
              <el-badge :value="mesCount">
                <el-avatar :src='$store.state.user.img'></el-avatar>
              </el-badge>
              <div class="user_mes_mod">
                <ul>
                  <li>我的主页</li>
                  <li>
                    我的消息
                    <span>{{mesCount}}</span>
                  </li>
                  <li @click.stop="logout">退出</li>
                </ul>
              </div>
            </div>
            <el-button size="mini" class="login_btn"
                       v-else
                       @click="showLogDia">
              登录
            </el-button>
          </div>
          <!--登录对话框组件-->
          <LoginDialog ref="loginDialog"/>
        </el-header>
        <!--主内容-->
        <el-main>
            <DiscoverNav ref="discoverMenu"
                          :currentPath="activePath">
            </DiscoverNav>
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
  import DiscoverNav from './commons/DiscoverNav'
  import LoginDialog from './commons/LoginDialog'
  import axios from 'axios'
  import getUser from '../plugin/user.js'
  export default {
    components: {
      MusicPlayer,
      DiscoverNav,
      LoginDialog
    },
    data () {
      return {
        activeIndex: '/discover',
        searchKey: '',
        activePath:'',
        menuList: [
          {title: '发现音乐', path: 'discover'},
          {title: '我的音乐', path: 'tologin'},
          {title: '关注', path: 'friend'},
          {title: '下载客户端', path: 'download'}
        ],
        searchMusics: [],
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
      //歌曲搜索
      async search () {
        this.searchMusics = [];
        const { data: res } = await this.$http.get ('search', {params: {keywords: this.searchKey}})
        if (res.code !== 200) {
          return this.$message.error('搜索失败请重新搜索')
        }
        console.log(res.result.songs)
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
      //搜索框失去焦点
      inputBlur (e) {
        setTimeout(()=> {
          this.searchMusics = []
        },2000)
      },
      clickMusic(data) { //点击列表播放音乐
        this.$refs.musicPlayer.addMusic([data.id]) //将音乐添加到列表
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
  .mod_search {
    width: 300px;
    margin-right: 30px;
    height: 60px;
    display: flex;
  }
  /deep/ .mod_search input {
    margin-left: 0!important;
  }
  .search_card {
    width: 200px;
    margin-top: -8px;
    height: 200px;
    font-size: 10px;
    z-index: 100 !important;
  }
  .search_card ul {
    margin-top: -20px;
    padding-top: 5px;
  }
  .search_card li {
    height: 28px;
    overflow: hidden;
    line-height: 30px;
    z-index: 100;
  }
  .top_cover {
    position: relative;
    margin-left: 50px;
    margin-top: 12px;
  }
  .login_btn {
    margin-left: 50px;
  }
  .user_mes_mod {
    position: absolute;
    top: 40px;
    left: -30px;
    width: 120px;
    height: 90px;
    visibility: hidden;
    background-color: #2B2B2B;
  }
  .user_mes_mod li {
    padding-left: 25px;
    height: 30px;
    cursor: pointer;
    font-size: 13px;
    line-height: 30px;
  }
  .user_mes_mod li span {
    display: inline-block;
    margin-left: 5px;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    background-color: #C20C0C;
    line-height: 15px;
    text-align: center;
  }
  .user_mes_mod li:hover {
    background-color: #353535;
  }
  .top_cover:hover .user_mes_mod {
      visibility: visible;
  }
  /deep/ .top_cover:hover .el-badge .el-badge__content {
    visibility: hidden;
  }
  audio {
    width: 500px;
    background-color: #42b983;
  }
  .m_footer{
    width: 1500px;
    height: 100px;
    border-top: 1px solid #d6d6d6;
    background-color: #F5F5F5;
  }
  /deep/ .el-dialog__title {
    display: block!important;;
  }
  @import url('../assets/css/home.css');
</style>
