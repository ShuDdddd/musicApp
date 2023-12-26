<template>
  <div class="mainBox">
    <div class="center cf">
      <div class="focus_box fl_l">
        <div class="mod_song">
          <div class="al_img_box">
            <div class="circle">
              <el-image class="al_img"
                        style="width: 150px; height: 150px;top: 28px; left: 28px;
                               position: absolute; z-index: 20; border-radius: 50%"
                        :src="songMes.al.picUrl">
                      </el-image>
            </div>
            <div class="link">生成链接</div>
          </div>
          <div class="info_box">
            <div class="name_box">
              <el-tag type="danger" size="medium"
                      class="gedan_icon">歌单</el-tag>
              <div class="name">{{songMes.name}}</div>
            </div>
            <div class="auth">
              歌手：&nbsp;{{songMes.ar[0].name}}
            </div>
            <div class="al_name">
              所属专辑：&nbsp;{{songMes.al.name}}
            </div>
            <div class="operation">
              <div>
                <el-button-group class="btnGroup">
                  <el-button id="operationBtn"
                            @click="palyMusic"
                            class="el-icon-video-play">
                    播放
                  </el-button>
                  <el-button icon="el-icon-plus" class="smallBtn"></el-button>
                </el-button-group>
              </div>
              <el-button class="operationBtn" @click="collection(988756367)" icon="el-icon-folder-add">收藏</el-button>
              <el-button class="operationBtn" icon="el-icon-link">分享</el-button>
              <el-button class="operationBtn" icon="el-icon-download">下载</el-button>
              <el-button class="operationBtn" icon="el-icon-s-comment">({{comments.length}})</el-button>
            </div>
            <div class="word_box">
              <div v-for="(item, index) in songWord" v-bind:key="index">
                <p v-if="index < expand">
                  {{item[1]}}
                </p>
              </div>
            </div>
            <div>
              <div class="show_btn" v-if="hidden"
                   @click="showWord">展开</div>
              <div class="show_btn" v-else
                   @click="hiddenWord">收起</div>
            </div>
          </div>
        </div>
        <div class="comment_box">
          <div class="comment_hd">
            <h3>评论</h3>
            <span>共{{comments.length}}条评论</span>
          </div>
          <div class="publish_com">
            <div class="pub_com_hd"></div>
            <div class="pub_com_bd">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="评论"
                v-model="myComment">
              </el-input>
              <div class="pub_com_tools">
                <i>表情</i>
                <i>@</i>
                <el-button size="mini">评论</el-button>
                <span>140</span>
              </div>
            </div>
          </div>
          <div class="hot_com mod_com" v-if="hotComments.length > 0">
            <h3 class="hot_com_hd">
              精彩评论
            </h3>
            <ul>
              <li class="cf">
                <img src="../assets/img/2.png">
                <div class="com_info"></div>
                <div class="com_operation"></div>
              </li>
            </ul>
          </div>
          <div class="new_com mod_com">
            <h3 class="new_com_hd">
              最新评论
            </h3>
            <ul>
              <li class="cf" v-bind:key="index"
                  v-for="(item, index) in comments">
                <img :src="item.user.avatarUrl">
                <div class="com_info">
                  <a>{{item.user.nickname}}</a>
                  <span>:&nbsp;{{item.content}}</span>
                  <div class="com_operation cf">
                    <div class="fl_l">{{item.timeStr}}</div>
                    <div class="fl_r">
                      <a>点赞<span>(1)</span></a>
                      <i>回复</i>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="relative_box fl_l"></div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      id: '',
      songMes: {}, // name:歌名, ar[].id/name:歌手id姓名, al.id/name/picUrl专辑
      songWord: {},
      wordBox: {},
      isAll: false,
      expand: 16, // 控制歌词展开与收起
      hidden: true,
      myComment: '',
      comments: [],
      hotComments: []
    }
  },
  methods: {
    async getSongDetail () {
      const { data: res } = await this.$http.get('/song/detail', { params: { ids: this.id } })
      if (res.code !== 200) {
        this.$message.error('获取歌曲失败 请刷新')
      }
      this.songMes = res.songs[0]
      console.log(res)
    },
    async getSongWord () {
      const { data: res } = await this.$http.get('/lyric', { params: { id: this.id } })
      if (res.code !== 200) {
        this.$message.error('获取歌曲失败 请刷新')
      }
      this.handleWord(res.lrc.lyric)
    },
    handleWord (str) { // 将歌词转换成Map类型
      this.songWord = new Map()
      const arr = str.split('\n')
      for (const item of arr) {
        const str1 = item.substr(1, 9)
        const str2 = item.substr(11)
        this.songWord.set(str1, str2)
      }
      console.log(this.showWord)
    },
    showWord () {
      this.expand = this.songWord.size
      this.hidden = false
    },
    // 收起歌词
    hiddenWord () {
      this.expand = 15
      this.hidden = true
    },
    async getComments () {
      const { data: res } = await this.$http.get('/comment/music', { params: { id: this.id } })
      if (res.code !== 200) {
        this.$message.error('获取歌曲评论失败')
      }
      this.comments = res.comments
      this.hotComments = res.hotComments
    },
    // 收藏歌曲
    async collection (pid) {
      const params = {
        pid: pid,
        op: 'add',
        tracks: this.id
      }
      const { data: res } = await this.$http.get('/playlist/tracks', { params: params })
      if (res.code !== 200) {
        this.$message.error('添加成功')
      }
      console.log(res)
    },
    // 播放歌曲
    palyMusic () {
      this.$bus.$emit('playMusic', this.id)
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getSongDetail()
    this.getSongWord()
    this.getComments()
  },
  mounted () {
    setTimeout(() => { // 貌似渲染太慢了 不延迟抓取不到
      this.wordBox = window.$('.word_box')
    }, 2000)
  }
}
</script>

<style scoped>
  @import '../assets/css/song.css';
  .center {
  position: relative;
  margin: 0 auto;
  width: 1000px;
  height: 100%;
  background-color: white;
  border: 1px solid #D3D3D3;
  border-top: none;
}
  .focus_box {
    width: 679px;
    padding: 35px;
    border-right: 1px solid #D3D3D3;
  }
  .mod_song {
    display: flex;
  }
  .al_img_box {
    position: relative;
    width:230px;
    height: 400px;
  }
  .link {
    position: absolute;
    left: 80px;
    top: 275px;
    font-size: 14px;
  }
  .circle {
    position: absolute;
    top: 40px;
    width: 210px;
    height: 210px;
    background-color: #212121;
    border-radius: 50%;
    z-index: 1;
    box-shadow: #000000 0 0 8px;
  }
  .al_img {
    border: 2px solid #000000;
  }
  .info_box {
    width: 449px;
    height: 100%;
    background-color: white;
  }
  .name_box {
    width: 440px;
    height: fit-content;
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 22px;
    display: flex;
  }
  .name {
    margin-left: 10px;
    font-size: 24px;
    font-weight: bold;
  }
  .auth, .al_name{
    font-size: 14px;
    margin: 10px 0;
  }
  .operation {
    width: 480px;
    height: 40px;
    display: flex;
    margin-bottom: 10px;
  }
  .el-button {
    margin-top: 10px;
    width: 60px;
    height: 30px;
    padding: 0;
    line-height: 30px;
  }
  .el-button:first-child {
    background-color: #3E8DD7;
    color: white;
    width: 70px;
    font-size: 14px;
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
.word_box {
  width: 400px;
  font-size: 14px;
}
.word_box p {
  margin: 10px 0;
}
.show_btn {
  cursor: pointer;
  font-size: 15px;
  color: #0C73C4;
}
.relative_box {
  width: 250px;
  height: 100%;
}
</style>
