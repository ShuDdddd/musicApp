<template>
    <div class="mian_box main_search">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="searchKey">
      </el-input>
            <div class="result_box">
          <div class="tip">搜索“ {{ searchKey }} ”,
            找到<span> {{ resultCount }} </span>{{ prompt }}</div>
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
                  <li v-for="(item,index) in artists" :key="index">
                    <el-image :src="item.picUrl"></el-image>
                    <div class="name ellipsis">{{ item.name }}</div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="歌单" name="third">
                <ul class="gd_ul">
                  <li v-for="(item, index) in playlists" :key="index">
                    <div class="playicon">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bofang-01"></use>
                      </svg>
                    </div>
                    <div class="img_box">
                      <el-image :src="item.coverImgUrl"></el-image>
                    </div>
                    <div class="title ellipsis">{{ item.name}}</div>
                    <div class="trackcount">{{ item.trackCount }}首</div>
                    <div class="user ellipsis">by: <span>{{ item.creator.nickname }}</span></div>
                    <div class="bookcount">收藏：{{ item.bookCount | millionFormat }}</div>
                    <div class="playcount">收听：{{ item.playCount | millionFormat }}</div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="用户" name="fourth">
                <ul class="yh_ul">
                  <li v-for="(item,index) in users" :key="index">
                    <el-image :src="item.avatarUrl"></el-image>
                    <div class="info">
                      <div class="name">{{ item.nickname }}</div>
                      <div class="intro ellipsis">{{ item.signature }}</div>
                    </div>
                    <button>关注</button>
                    <div class="playlistcount">歌单： {{ item.playlistCount }}</div>
                    <div class="followeds">粉丝： {{ item.followeds }}</div>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
            <div class="pagination">
              <el-pagination
                  background
                  :page-size="limit"
                  :pager-count="11"
                  layout="prev, pager, next"
                  :total="resultCount"
                  @current-change="handleCurrentChange"
                  :hide-on-single-page="true"
                  prev-text="上一页"
                  next-text="下一页">
             </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      searchKey: '',
      searchType: 1,
      activeName: 'first',
      resultCount: 0, // 搜索结果总数
      prompt: '首单曲', // 根据搜索类型修改用词
      songs: [],
      artists: [],
      playlists: [],
      users: {},
      // 分页设置
      totalPage: 1,
      page: 1,
      limit: 30
    }
  },
  created () {
    this.$bus.$on('searchRouter', () => {
      console.log(this.searchKey)
      this.search()
    })
    this.searchKey = this.$route.params.key
    if (this.searchKey) {
      this.search()
    }
  },
  mounted () {
    console.log('????')
  },
  methods: {
    tabClick (tab, event) {
      if (tab.index === '0') {
        this.searchType = 1
      } else if (tab.index === '1') {
        this.searchType = 100
      } else if (tab.index === '2') {
        this.searchType = 1000
      } else if (tab.index === '3') {
        this.searchType = 1002
      }
      this.page = 1
      this.search()
    },
    // 改变当前页数
    handleCurrentChange (e) {
      this.page = e
      this.search()
    },
    async search () {
      // type: 搜索类型； 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV,
      // 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音
      this.songs = []
      const params = {
        keywords: this.searchKey,
        type: this.searchType,
        offset: (this.page - 1) * this.limit
      }
      const { data: res } = await axios.get('cloudsearch', { params })
      if (res.code !== 200) {
        return this.$message.error('搜索失败请重新搜索')
      }
      // 单曲数据处理
      if (this.searchType === 1) {
        this.prompt = '首单曲'
        this.resultCount = res.result.songCount
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
      } else if (this.searchType === 100) {
        // 歌手数据处理
        this.prompt = '个歌手'
        this.resultCount = res.result.artistCount
        this.artists = res.result.artists
      } else if (this.searchType === 1000) {
        // 歌单数据处理
        this.prompt = '个歌单'
        this.resultCount = res.result.playlistCount
        this.playlists = res.result.playlists
      } else if (this.searchType === 1002) {
        // 用户数据处理
        this.prompt = '位用户'
        this.resultCount = res.result.userprofileCount
        this.users = res.result.userprofiles
      }
      this.totalPage = ((this.resultCount % this.limit) === 0) ? this.resultCount / this.limit : (this.resultCount / this.limit + 1)
    }
  }
}
</script>

<style scoped>
@import url('../assets/css/search.css');
</style>
