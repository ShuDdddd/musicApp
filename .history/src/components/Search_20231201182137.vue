<template>
    <div class="mian_box main_search">
        <el-input></el-input>
        <div class="result_box">
          <div class="tip">搜索“{{ searchKey }}”，找到<span>100</span>首单曲</div>
            <el-tabs v-model="activeName" type="card"
                     @tab-click="tabClick">
              <el-tab-pane label="单曲" name="first">
                <ul class="dq_ul">
                  <li v-for="(item,index) in songs" :key="index">
                      <div class="song ellipsis">{{item.name}}</div>
                      <div class="operation">
                        <svg class="icon" aria-hidden="true"
                             id="bofang">
                          <use xlink:href="#icon-bofang-01"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true"
                             id="bofang">
                          <use xlink:href="#icon-jia-01"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true"
                             id="bofang">
                          <use xlink:href="#icon-shoucang"></use>
                        </svg>
                      </div>
                      <div class="singer ellipsis">{{ item.singer }}</div>
                      <div class="album ellipsis">{{ item.album }}</div>
                      <div class="time">{{ item.time | timeFormat }}</div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="歌手" name="second">
                <ul class="gs_ul">
                  <li>
                    <el-image></el-image>
                    <div class="name"></div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="歌单" name="third">角色管理</el-tab-pane>
              <el-tab-pane label="用户" name="fourth">定时任务补偿</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      searchKey: '勇气',
      activeName: 'first',
      songs: [],
      artist: {},
      songList: {},
      user: {},
      page: 0,
      limit: 40
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    tabClick (tab, event) {
      if (tab.index === 0) {
        this.search(1)
      } else if (tab.index === 1) {
        this.search(100)
      } else if (tab.index === 2) {
        this.search(1000)
      } else if (tab.index === 3) {
        this.search(1002)
      }
    },
    async search (type = 1) {
      // type: 搜索类型； 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV,
      // 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音
      this.songs = []
      const { data: res } = await axios.get('cloudsearch', { params: { keywords: this.searchKey, type: type } })
      if (res.code !== 200) {
        return this.$message.error('搜索失败请重新搜索')
      }
      if (type === 1) {
        for (let i = 0; i < res.result.songs.length; i++) {
          const obj = {
            id: res.result.songs[i].id,
            name: res.result.songs[i].name,
            singer: res.result.songs[i].ar[0].name,
            singerId: res.result.songs[i].ar[0].id,
            time: res.result.songs[i].dt / 1000,
            album: res.result.songs[i].al.name,
            albumId: res.result.songs[i].al.id
          }
          this.songs.push(obj)
        }
      }
    }
  }
}
</script>

<style scoped>
@import url('../assets/css/search.css');
</style>
