<template>
  <div class="music_player_box">
    <div class="operation">
      <!--上一首-->
      <div class="pre">
        <svg class="icon" font-size="14px"
             @click="preOrNext(-1)"
             aria-hidden="true">
          <use xlink:href="#icon-zuo-02"></use>
        </svg>
      </div>
      <!--暂停播放模块-->
      <div class="stop">
        <audio id="myAudio" :src="orderList[current].musicUrl"></audio>
        <svg class="icon stop" aria-hidden="true"
             v-if="stopMusic"
             @click="stop">
          <use xlink:href="#icon-zanting-01"></use>
        </svg>
        <svg class="icon play" aria-hidden="true"
             id="bofang"
             @click="play"
             v-else>
          <use xlink:href="#icon-bofang-01"></use>
        </svg>
      </div>
      <!--下一首-->
      <div class="next">
        <svg class="icon" font-size="14px"
             @click="preOrNext(1)"
             aria-hidden="true">
          <use xlink:href="#icon-you-02"></use>
        </svg>
      </div>
    </div>
    <div class="message">
      <div class="img_box">
        <img :src="orderList[current].picUrl ? orderList[current].picUrl : '@/assets/img/2.png'"
             @click="toSong"
             :onerror='defaultImg'>
      </div>
      <div class="song_box">
        <div class="song_info">
          <a class="song_name">{{orderList[current].name}}</a>
          <a class="singer">{{orderList[current].singer}}</a>
        </div>
          <div class="progress_box">
          <div class="progress"
               @mousedown="downProgress($event)">
            <div id="progress_move"></div>
          </div>
          <div class="circle"
               @mousemove="moveCircle($event)"
               id="circle"></div>
          <div class="show_time">{{currentTime | timeFormat}}/{{ orderList[current].totalTime | timeFormat}}</div>
        </div>
      </div>
    </div>
    <!--音量-->
    <div class="volume">
      <a>
        <img src="../../assets/img/yinliang.png" class="opa_8">
      </a>
      <div class="sound_block" v-click-outside>
          <el-slider vertical
                     height="100px"
                     @change="volumeHandle"
                     v-model="soundVolume"></el-slider>
      </div>
    </div>
    <div class="music_list">
      <div class="list_btn">
        <svg class="icon_list opa_8"
             aria-hidden="true">
          <use xlink:href="#icon-liebiao-01"></use>
        </svg>
      </div>
      <div class="list_card"
           v-click-outside>
        <div class="card_hd cf">
          <span class="fl_l" style="font-weight: bold">播放列表</span>
          <a class="fl_r opa_7">清空</a>
        </div>
        <div v-for="(item, index) in orderList" :key="index"
             @click="changeMusic(item.id)"
             class="list">
         {{item.name}} - {{item.singer}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getElementX } from '../../plugin/getPosition.js'
import { percentage } from '../../plugin/util.js'

export default {
  created () {
    this.listMap = new Map()
    this.$bus.$on('playMusic', id => {
      this.changeMusic(id)
    })
    this.$bus.$on('add', arr => {
      this.addMusic(arr)
    })
  },
  mounted () {
    this.circle = window.$('#circle')
    this.progressGo = window.$('#progress_move')
    this.audio = document.getElementById('myAudio')
    this.showProgress = window.$('.progress_box')[0]
    // 监听点击事件 播放列表
    window.$('body').on('click', function (e) {
      if (!e.target.closest('.list_card')) {
        this.listVisible = true
      }
    })
    this.soundVolume = this.audio.volume
  },
  data () {
    return {
      // 抓取的元素
      circle: {},
      showProgress: {},
      progressGo: {},
      audio: {},
      progressTimer: {}, // 计时器
      circleTimer: '', // 小球移动计时器
      circleLeft: -8, // 小球位置
      circleIfMove: false,
      stopMusic: false,
      // totalTime: 0,
      currentTime: 0,
      musicList: [],
      listMap: [],
      orderList: [{}], // 有序的音乐播放列表
      randomList: [], // 随机播放的音乐列表
      current: 0, // 当前播放音乐的序列
      soundVolume: 50, // 音量
      sliderVisible: false
    }
  },
  methods: {
    // 获取歌曲基本信息和url
    async getMusicMes (id) {
      const mes = {}
      const { data: res } = await this.$http.get('song/detail', { params: { ids: id } })
      if (res.code === 200) {
        mes.id = id
        mes.name = res.songs[0].name
        mes.picUrl = res.songs[0].al.picUrl
        mes.singer = res.songs[0].ar[0].name
        mes.singerId = res.songs[0].al.id
        mes.mvId = res.songs[0].mv
        mes.totalTime = res.songs[0].dt / 1000 // 歌曲时长
      }
      const { data: url } = await this.$http.get('song/url', { params: { id: id } })
      if (url.code === 200) {
        mes.musicUrl = url.data[0].url
      }
      return mes
    },
    // 获取音乐时长
    // getTotalTime () {
    //   if (!this.orderList[this.current].musicUrl) {
    //     this.totalTime = 0
    //     return
    //   }
    //   setTimeout(() => { // radio的数据好像只能等一会才拿到，直接拿是NaN
    //     this.totalTime = this.audio.duration
    //   }, 300)
    // },
    // 播放音乐
    play () {
      if (!this.orderList[this.current].musicUrl) {
        return this.$message.info('当前音乐无法播放~')
      }
      this.stopMusic = true
      this.audio.play()
      console.log(this.progressTimer)
      this.progressTimer = window.setInterval(() => {
        this.currentTime = this.audio.currentTime
        this.circleLeft = Math.round(this.currentTime / this.orderList[this.current].totalTime * 400) - 8
        this.progressGo.css('width', percentage(this.currentTime, this.orderList[this.current].totalTime) + '%')
        this.circle.css('left', this.circleLeft + 'px')
        // 单曲播放
        // if (this.audio.ended) {
        //   this.stop()
        // }
        // 循环播放
        if (this.audio.ended) {
          this.preOrNext(1)
        }
      }, 500)
    },
    // 跳转到音乐界面
    toSong () {
      this.$router.push({
        name: 'song',
        params: { id: this.orderList[this.current].id }
      })
    },
    // 音乐暂停
    stop () {
      this.stopMusic = false
      clearInterval(this.progressTimer)
      this.audio.pause()
    },
    // 切换上/下一首，播放状态下自动播放，暂停状态下也随之暂停
    async preOrNext (num) {
      if (this.current < -1) {
        return
      }
      this.current += num
      if (this.current >= this.orderList.length) this.current = 0
      else if (this.current < 0) this.current = this.orderList.length - 1
      // 修改进度条为0
      this.audio.currentTime = 0
      this.currentTime = 0
      this.circle.css('left', '-8px')
      this.progressGo.css('width', '0')
      if (this.stopMusic) {
        // 如果此时有音乐播放 则继续播放切换后的音乐
        await this.stop()
        this.play()
      }
    },
    // 切换当前选中音乐
    /* 查看列表是否存在
      * 不存在则添加进音乐列表
      * 修改当前播放音乐索引
      * 继续播放
      * */
    async changeMusic (id) {
      if (!this.listMap.get(id)) {
        await this.addMusic([id])
      }
      this.current = this.listMap.get(id)
      // 查看url是否存在
      if (!this.orderList[this.current].musicUrl) {
        this.$message.error('获取歌曲播放地址失败')
      }
      // if (this.stopMusic) { // 如果此时有音乐播放 停止播放并改变图标
      //   this.stopMusic = false
      //   this.clearHandler()
      //   this.audio.pause()
      //   this.stop()
      //   // this.circle.css('left', '-8px')
      // }
      clearInterval(this.progressTimer)
      // 进度条修改
      this.audio.currentTime = 0
      this.currentTime = 0
      this.circle.css('left', '-8px')
      this.progressGo.css('width', '0')
      this.play()
    },
    // 音乐列表添加音乐
    async addMusic (arr) {
      if (this.orderList.length === 1 && this.orderList[0].id == null) {
        this.orderList.shift()
      }
      // 目前vue版本不支持map迭代 map存id和下标 arr存歌曲信息
      for (let i = 0; i < arr.length; i++) {
        const length = this.listMap.size ? this.listMap.size : 0
        if (this.listMap.has(arr[i])) continue
        this.listMap.set(arr[i], length)
        const mes = await this.getMusicMes(arr[i])
        this.orderList.push(mes)
      }
    },
    // clearHandler () { // 不单独写计时器停不下来，不知道为啥
    //   window.clearInterval(this.progressTimer)
    // },
    // 进度条小球
    moveCircle (e) {
      if (!this.orderList[this.current].totalTime || !e.buttons) {
        return
      }
      e.preventDefault() // 阻止拖动时禁用图标的出现
      const x = e.clientX - getElementX(this.showProgress) - 8
      if (x >= -8 && x <= 392) {
        this.circle.css('left', x + 'px')
        this.progressGo.css('width', percentage(x + 8, 400) + '%')
        this.currentTime = Math.round((x + 8) / 400 * this.orderList[this.current].totalTime)
        this.audio.currentTime = this.currentTime
      }
    },
    // 点击进度条小球移动到该位置
    downProgress (e) {
      if (!this.orderList[this.current].totalTime) {
        return
      }
      const x = e.clientX - getElementX(this.showProgress) - 8 // 小球相对x坐标
      this.circle.css('left', x + 'px')
      this.progressGo.css('width', percentage(x + 8, 400) + '%')
      this.currentTime = Math.round((x + 8) / 400 * this.orderList[this.current].totalTime)
      this.audio.currentTime = this.currentTime
    },
    volumeHandle (e) {
      this.audio.volume = e / 100
    }
  },
  computed: {
    // 设置播放器图片的默认地址
    defaultImg () {
      return 'this.src="' + require('../../assets/img/2.png') + '"'
    }
  }
}
</script>

<style scoped>
  /*断点*/
  .music_player_box {
    position: relative;
    display: flex;
    width: 1000px;
    height: 60px;
    margin: auto;
    background-color: #f7c3c7;
  }
  .operation {
    display: flex;
    width: 100px;
    padding-top: 5px;
    margin: auto 10px;
    justify-content: space-between;
  }
  .pre, .next, .stop {
    position: relative;
    height: 60px;
  }
  .pre, .next{
    width: 31%;
  }
  .stop {
    width: 38%;
  }
  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -1em;
    margin-top: -1em;
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    opacity: 80%;
    color: white;
  }
  .icon_list {
    width: 1.3em;
    height: 1.3em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    font-weight: bold;
    color: white;
  }
  .icon:hover {
    opacity: 100%;
  }
  .message {
    display: flex;
  }
  .img_box {
    width: 50px;
    height: 50px;
    border-radius: 2px;
    background-color: #42b983;
    margin: auto 10px;
  }
  .img_box img {
    width: 50px;
    height: 50px;
    border-radius: 3px;
  }
  .song_info {
    margin: 5px 5px;
    width: 200px;
    height: 15px;
    font-size: 12px;
    display: flex;
  }
  .song_info a {
    margin-right: 4px;
    max-width: 90px;
    height: 15px;
    display: inline-block;
    overflow: hidden;
  }
  .song_box {
    width: 500px;
    height: 50px;
  }
  .progress_box {
    margin-top: 10px;
    position: relative;
    height: 20px;
  }
  .progress {
    position: relative;
    width: 400px;
    height: 6px;
    border-radius: 5px;
    background: lightcoral;
  }
  #progress_move{
    width: 0;
    height: 6px;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    background: white;
  }
  .circle {
    position: absolute;
    left: -8px;
    top: -4px;
    width: 10px;
    height: 10px;
    background-color: #f08080;
    border: white 3px solid;
    border-radius: 50%;
  }
  .circle:hover {
    box-shadow: 3px 3px 10px #f1609d;
  }
  .show_time {
    position: absolute;
    top: -4px;
    right: 8px;
  }
  .volume {
    position: relative;
    width: 30px;
  }
  .sound_block {
    position: absolute;
    display: none;
    bottom: 60px;
  }
  .volume a {
    display: block;
    width: 25px;
    height: 21px;
    margin-left: 10px;
    margin-top: 20px;
  }
  .volume img {
    width: 100%;
    height: 100%;
  }
  .el-slider {
    padding-top: 15px;
    background-color: #F7C3C7;
    z-index: 999;
  }
  /deep/ .el-slider__bar {
    background: lightcoral!important;
  }
  /deep/ .el-slider__button {
    border: 2px solid lightcoral;
  }
  .music_list {
    position: relative;
  }
  .list_btn {
    margin-left: 30px;
    margin-top: 20px;
  }
  .list_card {
    position: absolute;
    display: none;
    bottom: 60px;
    width: 250px;
    padding: 10px 0;
    max-height: 200px;
    background-color: #f7c3c7;
    overflow: scroll;
    z-index: 999;
    font-size: 12px;
    color: white;
  }
  .card_hd {
    height: 25px;
    padding-left: 18px;
    border-bottom: 1px solid lightcoral;
    line-height: 25px;
  }
  .card_hd a {
    margin-right: 10px;
    color: white;
  }
  .list_card .list {
    padding: 5px 18px;
    cursor: pointer;
  }
  .list_card .list:hover {
    background-color: lightcoral;
  }
</style>
