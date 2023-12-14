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
                  <span class="fl_l">创建的歌单</span>
                  <el-button class="fl_r"
                    @click.stop="showAddDialog"
                    icon="el-icon-plus">
                  新建
                  </el-button>
                </template>
                <el-menu-item class="cf"
                  v-for="(item, index) in builtList"
                  @click="showPlaylist(item.id)"
                  v-bind:key="index">
                  <img class="fl_l" :src="item.coverImgUrl"/>
                  <div class="list_info fl_l">
                    <div class="name">{{item.name}}</div>
                    <div class="count fl_l">{{item.trackCount}}首</div>
                    <div class="built_oper fl_r" v-if="index > 0">
                      <i class="el-icon-edit-outline" @click.stop="editPlaylist(item.id)"></i>
                      <i class="el-icon-delete" @click="deletePlaylist(item.id)"></i>
                    </div>
                  </div>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <span>收藏的歌单</span>
                </template>
                <el-menu-item class="cf"
                  @click="showPlaylist(item.id)"
                  v-bind:key="index"
                  v-for="(item, index) in collectList">
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
          <PlaylistMain class="aa"
           v-if="showChilden"
           :listid="currentId">
          </PlaylistMain>
          <!--编辑歌单信息模块-->
          <EditPlaylist
           :style="{visibility:editVisible}"
           ref="edit">
          </EditPlaylist>
          <!--编辑封面图片模块-->
        </div>
        <!-- 创建歌单对话框模块-->
        <el-dialog
            :modal="false"
            title="创建歌单"
            :visible.sync="addDialogVisible"
            width="40%"
            :before-close="hiddenAddDialog">
            <el-form :model="addForm"
                     ref="telLoginRef"
                     label-width="auto"
                     class="demo-ruleForm">
              <el-form-item prop="phone">
                <el-input type="telephone"
                          placeholder="歌单名"
                          v-model="addForm.name"
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <span class="tips">
                  可通过“收藏”将音乐添加到新歌单中
                </span>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click="addPlaylist">创建</el-button>
                <el-button size="mini" @click="addDialogVisible=false">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
      </div>
</template>

<script>
import PlaylistMain from './playList/PlaylistMain'
import EditPlaylist from './playList/EditPlaylist'

export default {
  name: 'mySong',
  components: {
    PlaylistMain,
    EditPlaylist
  },
  data () {
    return {
      userId: '',
      builtList: [
      ],
      collectList: [],
      addDialogVisible: false,
      addForm: {
        name: ''
      },
      addName: '',
      currentId: '', // 当前点击歌单的ID
      showChilden: false,
      editVisible: 'hidden'
    }
  },
  beforeCreate () {
    this.userId = this.$route.params.id
  },
  async created () {
    this.userId = this.$route.params.id
    await this.getUserPlaylist()
    this.$bus.$on('showPlaylist', id => {
      this.showPlaylist(id)
    })
  },
  methods: {
    async getUserPlaylist () {
      this.builtList = []
      this.collectList = []
      const { data: res } = await this.$http.get('/user/playlist', { params: { uid: this.userId } })
      if (res.code !== 200) {
        this.$message.error('获取用户歌单失败')
      } else {
        for (let i = 0; i < res.playlist.length; i++) {
          if (res.playlist[i].subscribed) {
            this.collectList.push(res.playlist[i])
          } else {
            this.builtList.push(res.playlist[i])
          }
        }
        this.$nextTick(() => {
          this.currentId = this.builtList[0].id
          setTimeout(() => {
            this.showChilden = true
          }, 0)
        })
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    hideenAddDialog () {
      this.addDialogVisible = false
    },
    async addPlaylist () {
      const { data: res } = await this.$http.get('/playlist/create', { params: { name: this.addForm.name } })
      if (res.code !== 200) {
        this.$message.error('创建歌单歌单失败')
      } else {
        this.$message.success('创建成功')
        console.log(res)
        await this.getUserPlaylist()
        this.$bus.$emit('show', [res.id])
        this.addDialogVisible = false
      }
    },
    async deletePlaylist (id) {
      const { data: res } = await this.$http.get('/playlist/delete', { params: { id: id } })
      if (res.code !== 200) {
        this.$message.error('删除失败')
      } else {
        this.$message.success('删除成功')
        console.log(res)
        await this.getUserPlaylist()
      }
    },
    // 修改歌单信息 展示歌单修改模块
    async editPlaylist (id) {
      this.showChilden = false
      this.editVisible = 'visible'
      this.$refs.edit.getPlaylistMes(id)
    },
    // 展示歌单模块
    showPlaylist (id) {
      this.showChilden = true
      this.editVisible = 'hidden'
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
  @import "../assets/css/mySong.css";
</style>
