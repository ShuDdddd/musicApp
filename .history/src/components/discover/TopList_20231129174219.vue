<template>
      <div class="main_box cf">
        <div class="mod_playlist fl_l">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose">
              <el-submenu index="1">
                <template slot="title">
                  <span class="fl_l">云音乐特色榜</span>
                </template>
                <el-menu-item class="cf"
                  v-for="(item, index) in teseList"
                  @click="showPlaylist(item.id)"
                  v-bind:key="index">
                  <img class="fl_l" :src="item.coverImgUrl"/>
                  <div class="list_info fl_l">
                    <div class="name">{{item.name}}</div>
                    <div class="count fl_l">{{item.trackCount}}首</div>
                  </div>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <span>全球媒体榜</span>
                </template>
                <el-menu-item class="cf"
                  @click="showPlaylist(item.id)"
                  v-bind:key="index"
                  v-for="(item, index) in meitiList">
                  <img class="fl_l" :src="item.coverImgUrl"/>
                  <div class="list_info fl_l">
                    <div class="name">{{item.name}}</div>
                    <div class="count">{{item.trackCount}}首</div>
                  </div>
                </el-menu-item>
              </el-submenu>
            </el-menu>
        </div>
        <div class="mod_focus fl_l">
          <PlaylistMain
           :listid="currentId">
          </PlaylistMain>
        </div>
      </div>
</template>

<script>
import PlaylistMain from './PlayList/PlaylistMain.vue'

export default {
  name: 'topList',
  components: {
    PlaylistMain
  },
  data () {
    return {
      userId: '',
      teseList: [],
      meitiList: [],
      currentId: '' // 当前点击歌单的ID
    }
  },
  async created () {
    this.userId = this.$route.params.id
    await this.getToplist()
  },
  methods: {
    async getToplist () {
      this.teseList = []
      this.meitiList = []
      const { data: res } = await this.$http.get('/toplist')
      if (res.code !== 200) {
        this.$message.error('获取榜单失败')
      } else {
        for (let i = 0; i < res.list.length; i++) {
          if (i <= 3) {
            this.teseList.push(res.list[i])
          } else {
            this.meitiList.push(res.list[i])
          }
        }
        console.log(this.teseList)
        this.$nextTick(() => {
          this.currentId = this.teseList[0].id
        })
      }
    },
    showPlaylist (id) {
      this.currentId = id
    },
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/mySong.css";
</style>
