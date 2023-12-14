<template>
      <div class="mod_list">
        <div class="list_hd">
          <div class="list_cover">
            <el-image style="width: 194px; height: 194px; margin: 3px"
                      fit="cover"
                      :src="playListInt.coverImgUrl">
            </el-image>
          </div>
          <div class="list_info">
            <div class="list_name">
              <el-tag type="danger" size="small"
                      class="icon_gedan">歌单</el-tag>
              <h2>{{playListInt.name}}</h2>
            </div>
            <div class="auth_info">
              <el-image style="width: 30px; height: 30px; margin: 3px"
                        fit="cover"
                        :src="playListInt.creator.avatarUrl">
              </el-image>
              <a> &nbsp;{{playListInt.creator.nickname}}</a>
              <a>&nbsp;{{playListInt.createTime|dateFormat}}创建</a>
            </div>
            <div class="operation">
              <el-button-group>
                <el-button id="operationBtn" class="el-icon-video-play">
                  播放
                </el-button>
                <el-button icon="el-icon-plus" class="smallBtn" @click="plusList()"></el-button>
              </el-button-group>
              <el-button icon="el-icon-folder-add">({{playListInt.subscribedCount | millionFormat}})</el-button>
              <el-button icon="el-icon-link">({{playListInt.shareCount | millionFormat}})</el-button>
              <el-button icon="el-icon-download">下载</el-button>
              <el-button icon="el-icon-s-comment">评论({{playListInt.commentCount | millionFormat}})</el-button>
            </div>
            <div class="list_babel">
              标签：
                <div class="tags"
                     v-bind:key="index"
                  v-for="(item, index) in playListInt.tags">
                  <el-tag type="info"
                          size="mini">{{item}}</el-tag>
                </div>
            </div>
            <div class="intro">
              <div v-bind:key="index"
                v-for="(item,index) in this.intro">
                <span v-if="index===0">介绍：</span>{{item}}
              </div>
            </div>
            <a class="expand" v-if="introIf"
               @click="expandIntro">展开</a>
            <a class="expand" v-if="!introIf"
               @click="putIntro">收起</a>
          </div>
        </div>
        <div class="list_bd">
          <div class="list_bd_title">
            <h3>歌曲列表</h3>
            <span class="song_count">{{playListInt.trackCount}}首歌</span>
            <div class="play_count">
              播放：
              <strong>{{playListInt.playCount}}</strong>次
            </div>
          </div>
          <el-table :data="listShow"
                      size="mini"
                      :cell-style="{padding: '0'}"
                      :row-style="{height:'30px',fontSize: '12px'}"
                      :header-cell-style="headerStyle"
                      :stripe="true"
              style="width: 638px">
              <el-table-column
                type="index"
                align="center"
                class-name="sortBox"
                width="78">
                <template slot-scope="scope">
                  <div class="sortBox">
                    {{scope.$index + 1}}
                    <svg class="icon" aria-hidden="true"
                         @click="playSong(scope.row.id)"
                         id="bofang">
                      <use xlink:href="#icon-bofang-01"></use>
                    </svg>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="歌曲标题"
                width="230"
                prop="name">
                <template slot-scope="scope">
                  <div class="flex_box">
                    <div class="ellipsis"
                      @click="toSongPage(scope.row.id)">
                      {{scope.row.name}}
                    </div>
                    <div v-if="scope.row.mv!==0">
                      <div class="btn_mv"
                                 @click="toMV(scope.row.mv)">
                        <i class="el-icon-video-camera"></i>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="时长"
                width="110"
                prop="dt">
                <template slot-scope="scope">
                  <div class="time_dyn">
                    {{(scope.row.dt/1000)|timeFormat}}
                  </div>
                  <div class="icon_dyn_box">
                    <i class="el-icon-plus" @click="plus(scope.row)"></i>
                    <i class="el-icon-folder-add"></i>
                    <i class="el-icon-link"></i>
                    <i class="el-icon-download"></i>
                    <i class="el-icon-delete" @click="deleteSong(scope.row)"
                    v-if="playListInt.creator.userId == userId"></i>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="歌手"
                width="90"
                prop="ar[0].name">
                <template slot-scope="scope">
                  <div class="ellipsis">
                    {{scope.row.ar[0].name}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="专辑"
                width="130"
                prop="al.name">
                <template slot-scope="scope">
                  <div class="ellipsis">
                    {{scope.row.al.name}}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          <div class="page">
            <el-pagination
              layout="prev, pager, next"
              @current-change="pageChange"
              :page-size="pageSize"
              :current-page="pageCurrent"
              :page-count="pageCount">
            </el-pagination>
          </div>
          <!--评论板块-->
          <Comment :id="listid" type=2 />
        </div>
      </div>
</template>

<script>
import Comment from '../commons/Comment.vue'
export default {
  components: {
    Comment
  },
  name: 'PlaylistMain',
  props: ['listid'],
  data () {
    return {
      id: '', // 歌单id
      headerClassName: 'className',
      headerStyle: { // 表头样式
        color: '#666666',
        fontSize: '11px',
        fontWeight: 'normal',
        borderLeft: '1px solid #d6d6d6',
        borderBottom: '1px solid #d6d6d6',
        background: '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#FFFFFF), to(#F0F0F0))'
      },
      allId: [], // 歌曲的所有id
      listShow: [], // 要展示的列表
      pageSize: 20, // 每页显示的个数
      pageCount: 0, // 总页数
      pageCurrent: 1, // 当前页数
      playListInt: {},
      introDiv: {},
      listDynamic: {}, // 歌单详情动态部分 commentCount,playCount,shareCount
      search: '',
      listImgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      intro: [],
      introIf: false
    }
  },
  methods: {
    async getList () {
      const start = (this.pageCurrent - 1) * this.pageSize
      const { data: res } = await this.$http.get('playlist/track/all', { params: { id: this.id, limit: this.pageSize, offset: start } })
      if (res.code !== 200) {
        this.$message.error('获取歌单列表失败')
      }
      this.listShow = res.songs
    },
    async getListInfo () {
      this.allId = []
      const { data: res } = await this.$http.get('playlist/detail', { params: { id: this.id } })
      const { data: counts } = await this.$http.get('playlist/detail/dynamic', { params: { id: this.id } })
      if (res.code !== 200) {
        console.log(res)
        this.$message.error('获取歌单信息失败')
      }
      for (const item of res.playlist.trackIds) {
        this.allId.push(item.id)
      }
      this.pageCount = (this.allId.length % this.pageSize > 0) ? (parseInt(this.allId.length / this.pageSize) + 1) : parseInt(this.allId.length / this.pageSize)
      this.listDynamic = counts
      this.playListInt = res.playlist
      this.putIntro()
    },
    pageChange (newPage) {
      this.pageCurrent = newPage
      this.getList()
    },
    playSong (id) {
      this.$bus.$emit('playMusic', id)
    },
    toSongPage (id) {
      this.$router.push({ name: 'song', params: { id: id } })
    },
    // 展开介绍
    expandIntro () {
      this.intro = this.playListInt.description.split('\n')
      this.introIf = false
    },
    // 收起介绍
    putIntro () {
      this.intro = this.playListInt.description.split('\n', 5)
      this.introIf = true
    },
    // 歌曲加入播放列表
    plus (data) {
      this.$bus.$emit('add', [data.id])
    },
    // 歌单加入播放列表
    plusList () {
      this.$bus.$emit('add', this.allId)
    },
    // 歌单中删除歌曲
    async deleteSong (data) {
      console.log(data)
      const params = {
        op: 'del',
        pid: this.id,
        trackIds: data.id
      }
      const { data: res } = await this.$http.get('playlist/tracks', { params: params })
      if (res.code !== 200) {
        this.$message.error('删除失败')
      }
      console.log(res)
    }
  },
  created () {
    this.id = this.listid
    this.userImg = window.sessionStorage.getItem('userImg')
    this.userId = window.sessionStorage.getItem('userId')
    this.getList()
    this.getListInfo()
    this.$bus.$on('show', id => {
      this.id = id
      this.getList()
      this.getListInfo()
    })
  },
  mounted () {
  },
  watch: {
    listid (val) {
      this.id = val
      this.getList()
      this.getListInfo()
    }
  },
  computed: {
  }
}
</script>

<style scoped>
  @import '../../assets/css/playlist.css';
.center {
  width: 980px;
  height: 100%;
  background-color: white;
  border: 1px solid #d6d6d6;
  border-top: none;
  margin: 0 auto;
}
  .mod_list {
    width: 640px;
    padding: 35px;
    border-right: 1px solid #d6d6d6;
  }
  .mod_related {
    width: 340px;
    height: 100%;
    background-color: #bb8493;
  }
  .list_hd {
    position: relative;
    width: 100%;
    display: flex;
  }
  .list_bd {
    position: relative;
    width: 100%;
  }
  .list_cover {
    width: 200px;
    height: 200px;
    margin-right: 30px;
    border: #D5D5D5 1px solid;
  }
  .list_info {
    width: 450px;
    height: inherit;
  }
  .list_name {
    width: 440px;
    display: flex;
    margin-bottom: 12px;
  }
  .icon_gedan {
    margin-right: 10px;
  }
.list_info p {
  display: block;
  margin: 0 5px;
  width: 200px;
  height: 40px;
  line-height: 40px;
}
  .operation {
    display: flex;
    width: 420px;
    height: 40px;
    margin-bottom: 25px;
  }
  .el-button {
    height: 30px;
    margin-top: 10px;
    margin-right: 0;
    margin-left: 6px;
    padding: 0 5px;
    font-size: 12px;
    line-height: 30px;
  }
  .el-button:first-child {
    background-color: #3E8DD7;
    color: white;
    width: 66px;
    font-size: 12px;
    border: 1px solid #2D69A2;
  }
  .smallBtn {
    width: 30px;
    height: 30px;
    background-color: #3E8DD7;
    color: white;
    border: 1px solid #2D69A2;
  }
 .el-button:first-child:hover {
   background-color:#589FE0 ;
 }
 .smallBtn:hover {
   background-color: #589FE0;
 }
  .auth_info {
    display: flex;
    width: 420px;
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    margin-bottom: 10px;
  }
  .list_babel {
    width: 420px;
    height: 40px;
    display: flex;
    margin-top: 10px;
    font-size: 14px;
  }
  .intro {
    width: 420px;
    font-size: 12px;
    color: #666666;
  }
  .tags{
    margin-left: 10px;
  }
  .flex_box {
    position: relative;
    display: flex;
  }
  .btn_mv {
    width: 25px;
    height: 20px;
    border: 1px #DBDBDB solid;
    border-radius: 3px;
    margin-left: 6px;
    box-shadow: 0 0 2px #aca9a9;
  }
  .btn_mv:hover {
    box-shadow: none;
  }
  .btn_mv i {
    color: #af101d;
    font-weight: bold;
    display: block;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  }
  .sortBox {
    display: flex;
    justify-content: space-around;
  }
  #bofang {
    width: 18px;
    height: 18px;
    color: #B3B3B3;
    margin-top: 3px;
    font-weight: bold;
  }
#bofang:hover {
  color: #666666;
}
  .page {
    width: fit-content;
    height: fit-content;
    margin: auto;
  }
</style>
