<template>
    <div class="addto_playlist_box">
        <el-dialog :visible.sync="dialogVisible"
                   title="添加到歌单"
                   width="30%"
                   :before-close="handleClose">
            <div>
                <div class="icon"></div>
                <div>创建新歌单</div>
            </div>
            <ul>
                <li v-for="(item, index) in myPlayList" :key="index">
                    <el-image :src="item.coverImgUrl"/>
                    <div>
                        <div class="title">{{ item.name }}</div>
                        <div class="count">7首</div>
                    </div>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="addToPlayList">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      dialogVisible: false,
      userId: '',
      myPlayList: [] // name,id,coverImgUrl
    }
  },
  created () {
    this.getMyPlaylist()
  },
  mounted () {
  },
  methods: {
    async getMyPlaylist () {
      const user = this.$store.state.user
      const { data: res } = await axios.get('/user/playlist', { params: { uid: user.id } })
      if (res.code !== 200) {
        this.$message.error('获取用户歌单失败 请重试')
      } else {
        for (let i = 0; i < res.playlist.length; i++) {
          console.log(res.playlist[i])
          if (!res.playlist[i].subscribed) {
            const mes = {
              id: res.playlist[i].id,
              name: res.playlist[i].name,
              coverImgUrl: res.playlist[i].coverImgUrl
            }
            this.myPlayList.push(mes)
          }
        }
      }
      console.log(this.myPlayList)
    },
    addToPlayList () {

    },
    handleClose () {
      this.dialogVisible = false
      this.myPlayList = []
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
