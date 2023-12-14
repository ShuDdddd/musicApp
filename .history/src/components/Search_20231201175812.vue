<template>
    <div class="mian_box main_search">
        <el-input></el-input>
        <div class="result_box">
          <div class="tip">搜索“{{ searchKey }}”，找到<span>100</span>首单曲</div>
            <el-tabs v-model="activeName" type="card"
                     @tab-click="tabClick">
              <el-tab-pane label="单曲" name="first">
                <ul>
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
              <el-tab-pane label="歌手" name="second">配置管理</el-tab-pane>
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
      console.log(tab)
    },
    async search () {
      this.songs = []
      const { data: res } = await axios.get('cloudsearch', { params: { keywords: this.searchKey } })
      if (res.code !== 200) {
        return this.$message.error('搜索失败请重新搜索')
      }
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
</script>

<style scoped>
@import url('../assets/css/search.css');
</style>
