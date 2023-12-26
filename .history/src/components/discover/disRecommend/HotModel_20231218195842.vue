<template>
    <div>
        <ul class="hot_ul">
            <li class="hot_li" v-bind:key="index" v-for="(item, index) in hotList">
              <div class="img_box" @click="toPlayList(item.id)">
                <img :src="item.picUrl">
                <div class="operation">
                  <div class="lis">
                    <img src="@/assets/img/listenIcon.png">
                    <a>{{item.playCount | millionFormat}}</a>
                  </div>
                    <svg class="icon" @click.stop="PlayPlaylist(item.id)"
                         aria-hidden="true"
                         id="bofang">
                      <use xlink:href="#icon-bofang-01"></use>
                    </svg>
                </div>
              </div>
              <a>{{item.name}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      hotList: [] // name:标题，picUrl，id，playCount:播放量
    }
  },
  created () {
    this.getHot()
  },
  methods: {
    toPlayList (id) {
      this.$router.push({ name: 'playlist', params: { id: id } })
    },
    async getHot () {
      const { data: ras } = await this.$http.get('personalized', { params: { limit: 8 } })
      if (ras.code !== 200) {
        this.$message.error('获取热门推荐失败')
      }
      for (let i = 0; i < ras.result.length; i++) {
        this.hotList.push(ras.result[i])
      }
    },
    async PlayPlaylist (id) {
      const { data: res } = await axios.get('/playlist/detail', { params: { id: id } })
      if (res.code !== 200) {
        return this.$message.error('获取歌曲列表失败 请重试')
      }
      const idList = []
      for (let i = 0; i < res.playlist.trackIds.length; i++) {
        idList.push(res.playlist.trackIds[i].id)
      }
      // 添加到播放列表并开始播放
      await this.$bus.$emit('add', idList)
      await this.$bus.$emit('playMusic', idList[0])
    }
  }

}
</script>

<style scoped>
@import url('../../../assets/css/discover/hotModel.css');
</style>
