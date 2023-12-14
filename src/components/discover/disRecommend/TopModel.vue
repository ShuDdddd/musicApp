<template>
<div class="top_box">
  <div class="top_sm_box">
    <div class="top_sm_hd">
      <div class="top_cover">
        <img :src="biaosheng.coverImgUrl">
      </div>
      <div class="top_tit">
        <a class="top_title">飙升榜</a>
        <div>
          <svg class="top_tit_icon" aria-hidden="true">
            <use xlink:href="#icon-jia-01"></use>
          </svg>
          <svg class="top_tit_icon" aria-hidden="true"
               id="bofang">
            <use xlink:href="#icon-shoucang"></use>
          </svg>
        </div>
      </div>
    </div>
    <ul class="top_sm_bd">
      <li class="top_li"
          v-for="(item,index) in biaosheng.tracks" :key="index">
        <div v-if="index < 3" class="sortRed">{{index + 1}}</div>
        <div v-else class="sort">{{index + 1}}</div>
        <div class="c">
          <div class="song ellipsis" @click="toSong(item.id)">{{item.name}}</div>
          <div class="operation">
            <svg class="icon" aria-hidden="true"
                 @click="toSong(item.id)"
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
        </div>
      </li>
      <li class="top_li last_li">
        <div class="more" @click="toPlaylist('19723756')">查看更多&nbsp;></div>
      </li>
    </ul>
  </div>
  <div class="top_sm_box">
    <div class="top_sm_hd">
      <div class="top_cover">
        <img :src="xinge.coverImgUrl">
      </div>
      <div class="top_tit">
        <a class="top_title">新歌榜</a>
        <div >
          <svg class="top_tit_icon" aria-hidden="true">
            <use xlink:href="#icon-jia-01"></use>
          </svg>
          <svg class="top_tit_icon" aria-hidden="true"
               id="bofang">
            <use xlink:href="#icon-shoucang"></use>
          </svg>
        </div>
      </div>
    </div>
    <ul class="top_sm_bd">
      <li class="top_li"
          v-for="(item,index) in xinge.tracks" :key="index">
        <div v-if="index < 3" class="sortRed">{{index + 1}}</div>
        <div v-else class="sort">{{index}}</div>
        <div class="c">
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
        </div>
      </li>
      <li class="top_li last_li">
        <div class="more" @click="toPlaylist(2884035)">查看更多&nbsp;></div>
      </li>
    </ul>
  </div>
  <div class="top_sm_box">
    <div class="top_sm_hd">
      <div class="top_cover">
        <img :src="yuanchuang.coverImgUrl">
      </div>
      <div class="top_tit">
        <a class="top_title">原创榜</a>
        <div >
          <svg class="top_tit_icon" aria-hidden="true">
            <use xlink:href="#icon-jia-01"></use>
          </svg>
          <svg class="top_tit_icon" aria-hidden="true"
               id="bofang">
            <use xlink:href="#icon-shoucang"></use>
          </svg>
        </div>
      </div>
    </div>
    <ul class="top_sm_bd">
      <li class="top_li"
          v-for="(item,index) in yuanchuang.tracks" :key="index">
        <div v-if="index < 3" class="sortRed">{{index + 1}}</div>
        <div v-else class="sort">{{index}}</div>
        <div class="c">
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
        </div>
      </li>
      <li class="top_li last_li">
        <div class="more" @click="toPlaylist(3779629)">查看更多&nbsp;></div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'TopModel',
  data () {
    return {
      biaosheng: {}, // coverImgUrl:封面图片
      xinge: {},
      yuanchuang: {},
      limit: 10,
      liList: [],
      opeList: [],
      opeShow: false
    }
  },
  methods: {
    async getTop () {
      const { data: bs } = await this.$http.get('playlist/detail',
        {
          params: {
            limit: this.limit,
            id: 19723756
          }
        })
      if (bs.code !== 200) {
        this.$message.error('获取飙升数据失败')
      } else {
        this.biaosheng = bs.playlist
        this.biaosheng.tracks.splice(10, this.biaosheng.tracks.length - 10)
      }
      const { data: yc } = await this.$http.get('playlist/detail',
        {
          params: {
            limit: 10,
            id: 2884035,
            offset: 0
          }
        })
      if (yc.code !== 200) {
        this.$message.error('获取原创数据失败')
      } else {
        this.yuanchuang = yc.playlist
        this.yuanchuang.tracks.splice(10, this.yuanchuang.tracks.length - 10)
      }
      const { data: xg } = await this.$http.get('playlist/detail',
        {
          params: {
            limit: 10,
            id: 3779629,
            offset: 0
          }
        })
      if (xg.code !== 200) {
        this.$message.error('获取新歌数据失败')
      } else {
        this.xinge = xg.playlist
        this.xinge.tracks.splice(10, this.xinge.tracks.length - 10)
      }
    },
    toSong (id) {
      this.$router.push({ name: 'song', params: { id: id } })
    },
    toPlaylist (id) {
      this.$router.push({ name: 'playlist', params: { id: id } })
    }
  },
  mounted () {
    setTimeout(() => {
      this.liList = document.getElementsByClassName('top_li')
      this.opeList = document.getElementsByClassName('operation')
    }, 10000)
  },
  created () {
    this.getTop()
  }
}
</script>

<style scoped>
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .top_box {
    margin: 20px auto;
    width: 900px;
    border: 1px solid #d6d6d6;
    background-color: white;
    display: flex;
  }
  .top_sm_box {
    width: 300px;
    height: 100%;
    background-color: #F4F4F4;
    border: 1px solid #d6d6d6;
  }
  .top_sm_hd {
    width: 230px;
    height: 130px;
    margin: 3px auto;
    display: flex;
  }
  .top_cover {
    width: 100px;
    height: 100px;
    margin-top: 10px;
    box-shadow: #323131 0 3px 6px;
  }
  .top_tit {
    width: 120px;
    height: 100px;
    margin-top: 10px;
    padding-left: 25px;
    padding-top: 10px;
  }
  .top_title {
    padding-top: 5px;
    font-weight: bold;
    font-size: 18px;
  }
  .top_tit_icon {
    margin-top: 7px;
    margin-right: 5px;
    width: 25px;
    height: 25px;
    vertical-align: -0.15em;
    fill: currentColor;
    color: #C1C1C1;
    overflow: hidden;
    cursor: pointer;
  }
  .top_tit_icon:hover {
    color: #9b9b9b;
  }
  .top_sm_bd {
    list-style: none;
    padding: 0;
    overflow: hidden;
  }
  .top_li {
    position: relative;
    display: flex;
    padding-left: 35px;
    height: 30px;
    line-height: 30px;
    font-size: 15px;
  }
  .top_li:nth-child(2n) {
    background-color: #F4F4F4;
  }
  .top_li:nth-child(2n+1) {
    background-color: #E8E8E8;
  }
  .top_li:hover .operation{
    display: flex;
  }
  .top_li:hover .song{
    width: 140px;
    text-decoration: underline;
  }
  .sort {
    width: 30px;
    height: 30px;
    font-size: 18px;
  }
  .sortRed {
    width: 30px;
    height: 30px;
    color: darkred;
    font-size: 18px;
  }
  .c {
    width: 200px;
    height: 30px;
  }
  .song {
    position: absolute;
    overflow: hidden;
    left: 65px;
    width: 200px;
    height: 30px;
    z-index: 1;
    cursor: pointer;
  }
  .operation {
    position: absolute;
    right: 15px;
    width: 80px;
    height: 30px;
    z-index: 3;
    display: none;
  }
  .icon {
    flex: 1;
    width: 20px;
    height: 20px;
    margin-top: 5px;
    vertical-align: -0.15em;
    fill: currentColor;
    color: #888777;
    overflow: hidden;
    cursor: pointer;
  }
  .icon:hover {
    color: #666666;
  }
  /*更多*/
  .top_li:last-child {
    flex-direction: row-reverse;
    padding-right: 20px;
    font-size: 13px;
  }
  .top_li .more {
    display: block;
    float: right;
    cursor: pointer;
  }
  .top_li .more:hover {
    text-decoration:underline
  }
</style>
