<template>
    <div class="mian_box main_search">
        <el-input></el-input>
        <div>
            <el-tabs v-model="activeName"
                     type="card"
                     @tab-click="handleClick">
              <el-tab-pane
                           label="单曲" name="first">
                           ss
              </el-tab-pane>
              <el-tab-pane
                           label="歌手" name="first">
                           歌曲
              </el-tab-pane>
              <el-tab-pane
                           label="歌单" name="first">
                           歌曲
              </el-tab-pane>
              <el-tab-pane
                           label="用户" name="first">
                           歌曲
              </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      song: {},
      art: {},
      gedan: {},
      user: {}
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>
@import url('../assets/css/search.css');
</style>
