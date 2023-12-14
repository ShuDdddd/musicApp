<template>
  <div class="container">
    <DiscoverNav ref="discoverMenu"
                :currentPath="activePath">
    </DiscoverNav>
    <router-view></router-view>
    <div class="focus_slider">
      <div class="block">
        <el-carousel trigger="click" height="285px">
          <el-carousel-item v-for="(item, index) in bannerList" :key="index">
            <img class="focus_img"
                 @click="bannerToElse(index)"
                 :src="item.imageUrl">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="mod_download">
        <a></a>
        <p>PC 安卓 iPhone WP iPad Mac 六大客户端</p>
      </div>
    </div>
    <div class="main_body">
      <div class="mod_hot">
        <div class="mod_title">
          <div class="red_circle"></div>
          <div class="title">热门推荐</div>
          <a class="most" href="/discover">更多</a>
        </div>
          <ul class="hot_ul">
            <li class="hot_li" v-bind:key="index" v-for="(item, index) in hotList">
              <div class="img_box" @click="toPlayList(item.id)">
                <img :src="item.picUrl">
                <div class="operation">
                  <div class="lis">
                    <img src="@/assets/img/listenIcon.png">
                    <a>{{item.playCount | millionFormat}}</a>
                  </div>
                    <svg class="icon" aria-hidden="true"
                         id="bofang">
                      <use xlink:href="#icon-bofang-01"></use>
                    </svg>
                </div>
              </div>
              <a>{{item.name}}</a>
            </li>
          </ul>
      </div>
      <div class="mod_new">
        <div class="mod_title">
          <div class="red_circle"></div>
          <div class="title">新碟上架</div>
          <a class="most">更多</a>
        </div>
        <NewModel></NewModel>
      </div>
      <div class="mod_top">
        <div class="mod_title">
          <div class="red_circle"></div>
          <div class="title">榜单</div>
          <router-link class="most" to="/toplist">更多</router-link>
        </div>
        <TopModel></TopModel>
      </div>
    </div>
  </div>
</template>

<script>
import DiscoverNav from './DiscoverNav'
import NewModel from './NewModel'
import TopModel from './TopModel'
export default {
  components: {
    TopModel,
    NewModel,
    DiscoverNav
  },
  data () {
    return {
      bannerList: [], // url:链接，imageUrl:图片链接
      hotList: [] // name:标题，picUrl，id，playCount:播放量
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    bannerToElse (index) {
      if (this.bannerList[index].url) {
        window.location = this.bannerList[index].url
      } else {
        this.$message.info('暂无链接')
      }
    },
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
    async getBanner () {
      const { data: res } = await this.$http.get('banner')
      if (res.code !== 200) {
        this.$message.error('获取轮播图失败')
      }
      this.bannerList = res.banners
    }
  },
  created () {
    this.getHot()
    this.getBanner()
  },
  mounted () {

  }
}
</script>
<style scoped>
  /* .el-carousel__item h3 {
    color: #a3912a;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  } */

  .focus_slider {
    width: 1000px;
    height: 285px;
    display: flex;
    margin: 0 auto;
  }
  .block {
    width: 746px;
    height: 285px;
    margin: 0 auto;
  }
  .mod_download {
    width: 254px;
    height: 285px;
    margin: 0;
    background-color: #352924;
  }

  .focus_img {
    width: 100%;
    height: 100%;
  }
  .main_body {
    width: 1000px;
    margin: 0 auto;
  }
  .mod_hot {
    padding-top: 25px;
    width: 1000px;
    height: 490px;
    background-color: #FFFFFF;
    border-left: 1px solid #D3D3D3;
    border-right: 1px solid #D3D3D3;
  }
  .mod_new {
    padding-top: 10px;
    width: 1000px;
    height: 230px;
    background-color: #ffffff;
    border-left: 1px solid #D3D3D3;
    border-right: 1px solid #D3D3D3;
  }
  .mod_top {
    padding-top: 10px;
    width: 1000px;
    height: 560px;
    background-color: #ffffff;
    border-left: 1px solid #D3D3D3;
    border-right: 1px solid #D3D3D3;
  }
  .mod_title {
    position: relative;
    margin: 0 20px 10px 20px;
    width: 960px;
    height: 30px;
    display: flex;
    line-height: 30px;
    font-size: 20px;
    border-bottom: #af101d 2px solid;
  }
  .red_circle {
    width: 7px;
    height: 7px;
    background-color: whitesmoke;
    border-radius: 50%;
    border: #af101d solid 5px;
    margin: auto 5px;
  }
  .title {
    margin-left: 8px;
    margin-right: 10px;
  }
  .most {
    position: absolute;
    right: 0;
    margin: 0 5px;
    font-size: 13px;
    text-decoration: none;
  }
  ul {
    list-style: none;
  }
  .hot_ul {
    width: 840px;
    height: 400px;
    display: flex;
    flex-wrap: wrap;
    margin-left: 50px;
  }
  .hot_li{
    position: relative;
    width: 150px;
    height: 190px;
    margin: 10px 30px;
    font-size: 13px;
  }
  .hot_li img {
    width: 100%;
    height: 100%;
  }
  .hot_li .img_box {
    width: 150px;
    height: 150px;
  }
  .hot_li .operation {
    width: 150px;
    height: 28px;
    position: absolute;
    top: 120px;
    background-color: #323131;
    opacity: 75%;
    border-top: black 1px solid;
    border-bottom: black 1px solid;
    display: flex;
  }
  .hot_li a {
    display: block;
    width: 150px;
    height: 20px;
    font-size: 14px;
    padding-top: 4px;
    padding-left: 3px;
    font-weight: 500;
  }
  .lis {
    padding-left: 5px;
    height: 28px;
    width: 100px;
    display: flex;
    font-size: 11px;
    color: whitesmoke;
    line-height: 20px;
  }
  .lis img {
    height: 16px;
    width: 16px;
    margin: auto 3px;
  }
  .icon {
    width: 1.6em;
    height: 1.6em;
    vertical-align: -0.15em;
    color: white;
    fill: currentColor;
    overflow: hidden;
    margin: auto 10px;
    opacity: 70%;
  }
  .icon:hover {
    opacity: 95%;
  }
@import url('../../../assets/css/discover.css')
</style>
