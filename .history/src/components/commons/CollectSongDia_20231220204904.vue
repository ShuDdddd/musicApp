<template>
    <div class="addto_playlist_box">
        <el-dialog :visible.sync="dialogVisible"
                   title="添加到歌单"
                   :before-close="handleClose">
            <div>
                <div class="icon"></div>
                <div>创建新歌单</div>
            </div>
            <ul>
                <li>
                    <el-image/>
                    <div>
                        <div class="title">我的音乐</div>
                        <div class="count">7首</div>
                    </div>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
      myPlayList: []
    }
  },
  created () {
    this.getMyPlaylist()
  },
  mounted () {
  },
  methods: {
    async getMyPlaylist () {
      const userId = this.$store.state.user.id
      const { data: res } = await axios.get('/user/playlist', { params: { uid: userId } })
      if (res.code !== 200) {
        this.$message.error('获取用户歌单失败 请重试')
      } else {
        for (let i = 0; i < res.playlist.length; i++) {
          if (!res.playlist[i].subscribed) {
            this.myPlayList.push(res.playlist[i])
          }
        }
      }
      console.log(this.myPlayList)
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
