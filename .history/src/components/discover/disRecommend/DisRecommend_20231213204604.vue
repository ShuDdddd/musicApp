<template>
    <div class="recommend">
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
            <HotModel></HotModel>
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
import NewModel from './NewModel'
import HotModel from './HotModel'
import TopModel from './TopModel'
export default {
  components: {
    NewModel,
    HotModel,
    TopModel
  },
  data () {
    return {
      bannerList: [] // url:链接，imageUrl:图片链接
    }
  },
  created () {
    this.getBanner()
  },
  methods: {
    async getBanner () {
      const { data: res } = await this.$http.get('banner')
      if (res.code !== 200) {
        this.$message.error('获取轮播图失败')
      }
      this.bannerList = res.banners
    },
    bannerToElse (index) {
      if (this.bannerList[index].url) {
        window.location = this.bannerList[index].url
      } else {
        this.$message.info('暂无链接')
      }
    }
  }
}
</script>

<style scoped>
@import url('../../../assets/css/discover/disRecommend.css');
</style>
