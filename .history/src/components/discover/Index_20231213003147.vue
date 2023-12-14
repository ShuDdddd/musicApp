<template>
  <div class="container">
    <div class="menu_box">
        <el-menu :default-active="activeIndex"
             class="discover_menu"
             active-text-color="white"
             text-color="white"
             router
             mode="horizontal">
            <el-menu-item v-for="item in tabsList"
                    class="menu_item"
                    :key="item.title"
                    :index="'/'+item.path">
                <span>{{item.title}}</span>
            </el-menu-item>
        </el-menu>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      box: {},
      elMenuItem: [],
      elMenu: {},
      activeName: 'second',
      tabsList: [
        { title: '推荐', path: '' },
        { title: '排行', path: 'discover/toplist' },
        { title: '歌单', path: 'discover/playlist' },
        { title: '歌手', path: 'discover/artlist' }
      ]
    }
  },
  mounted () {
    this.box = window.$('box')
    this.elMenu = window.$('.discoverNav')
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    showMenu (key) {
      if (key === '/discover') {
        this.box.css('height', '35px')
        this.elMenu.css('display', 'block')
      } else {
        this.box.css('height', '20px')
        this.elMenu.css('display', 'none')
      }
    }
  }
}
</script>

<style scoped>
@import url('../../assets/css/discover.css');
</style>
