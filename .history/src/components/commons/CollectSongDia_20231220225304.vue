<template>
    <div class="add_song_box">
        <el-dialog :visible.sync="dialogVisible"
                   title="添加到歌单"
                   width="30%"
                   :before-close="handleClose">
            <div class="add">
                <div class="icon"></div>
                <p>创建新歌单</p>
            </div>
            <ul class="show">
                <li v-for="(item, index) in myPlayList"
                    @click="addToPlayList(item.id)"
                    :key="index">
                    <el-image :src="item.coverImgUrl"/>
                    <div class="m_t">
                        <p class="title">{{ item.name }}</p>
                        <p class="count">{{item.trackCount}}首</p>
                    </div>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['songId'],
  data () {
    return {
      dialogVisible: false,
      userId: '',
      myPlayList: [] // name,id,coverImgUrl,trackCount
    }
  },
  created () {
  },
  mounted () {
    // this.getMyPlaylist()
  },
  methods: {
    async getMyPlaylist () {
      const user = this.$store.state.user
      const { data: res } = await axios.get('/user/playlist', { params: { uid: user.id } })
      if (res.code !== 200) {
        this.$message.error('获取用户歌单失败 请重试')
      } else {
        for (let i = 0; i < res.playlist.length; i++) {
          if (!res.playlist[i].subscribed) {
            const mes = {
              id: res.playlist[i].id,
              name: res.playlist[i].name,
              coverImgUrl: res.playlist[i].coverImgUrl,
              trackCount: res.playlist[i].trackCount
            }
            this.myPlayList.push(mes)
          }
        }
      }
    },
    // 歌单添加歌曲
    async addToPlayList (pid) {
      const params = {
        pid: pid,
        op: 'add',
        tracks: this.songId
      }
      const { data: res } = await axios.get('/playlist/tracks', { params: params })
      console.log(res)
      console.log('oooooooooooo')
      this.$message.error('由于接口问题该功能无法实现')
    },
    handleClose () {
      this.dialogVisible = false
      this.myPlayList = []
    }
  }

}
</script>

<style scoped>
@import url('../../assets/css/commons/colSongDia.css');
</style>
