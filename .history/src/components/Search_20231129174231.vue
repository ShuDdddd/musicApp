<template>
    <div class="mian_box main_search">
        <el-input></el-input>
        <div>
            <el-tabs v-model="activeName"
                     type="card"
                     @tab-click="handleClick">
              <el-tab-pane v-for="(item, index) in category"
                           v-bind:key="index"
                           :label="item" name="first">{{ item }}</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      category: ['单曲', '歌手', '歌单', '用户']
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
