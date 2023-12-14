<template>
  <div class="edit_box">
    <!--导航条-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><a @click="toPlaylist">{{playlist.name}}</a></el-breadcrumb-item>
      <el-breadcrumb-item><a @click="uploadVisible = false">编辑歌单</a></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="edit_info_mod" v-if="!uploadVisible">
      <el-form ref="form" label-position="left"
      :model="form"
      label-width="80px">
      <el-form-item label="歌单名">
        <el-input v-model="playlist.name"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <a>选择标签</a>
      </el-form-item>
      <el-form-item label="介绍">
        <el-input type="textarea" v-model="playlist.description"></el-input>
      </el-form-item>
      <el-form-item label="封面">
        <div class="img_mod">
          <img :src="playlist.coverImgUrl" onerror="this.src='https://p1.music.126.net/jWE3OEZUlwdz0ARvyQ9wWw==/109951165474121408.jpg';this.onerror=null">
          <div class="img_btn" @click="showUpload">编辑封面</div>
          <div class="img_btn_cover"></div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    </div>
    <div class="edit_img_mod" v-if="uploadVisible">
      <UploadImg></UploadImg>
    </div>
  </div>
</template>

<script>
import UploadImg from '../../commons/UploadImg.vue'
export default {
  components: {
    UploadImg
  },
  data () {
    return {
      playlist: {}, // id name coverImgUrl tags description
      imageUrl: '',
      uploadVisible: false
    }
  },
  methods: {
    async getPlaylistMes (id) {
      const { data: res } = await this.$http.get('playlist/detail', { params: { id: id } })
      if (res.code !== 200) {
        this.$message.error('获取歌单信息失败')
      }
      this.playlist = res.playlist
    },
    // 修改歌单信息
    async onSubmit () {

    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 展示图片上传模块并添加导航条-编辑封面
    showUpload () {
      this.uploadVisible = true
      const elLast = window.$('.el-breadcrumb')
      const ele = window.$('<el-breadcrumb-item></el-breadcrumb-item>').text('编辑封面')
      elLast.append(ele)
      console.log(elLast)
    },
    // 退回歌单展示页面
    toPlaylist () {
      this.$bus.$emit('showPlaylist', this.playlist.id)
    }
  }
}
</script>

<style>
@import url('../../../assets/css/editPlaylist.css');
</style>
