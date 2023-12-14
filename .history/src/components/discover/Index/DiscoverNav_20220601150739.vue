<template>
  <div class="box">
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
        { title: '排行', path: 'toplist' },
        { title: '歌单', path: 'playlist' },
        { title: '歌手', path: 'artlist' }
      ]
    }
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
  },
  mounted () {
    this.box = window.$('box')
    this.elMenu = window.$('.discoverNav')
  }
}
</script>

<style scoped>
  .box {
    height: 35px;
    width: 100%;
    background-color: #cf111f;
    border-bottom: #A40011 1px solid;
    border-top: #A40011 1px solid;
  }
  .discover_menu {
    background-color: #cf111f;
    margin: 0 auto;
    width: 600px;
    height: 35px;
    z-index: 0;
  }
  .box .menu_item {
    line-height: 35px;
    height: 35px;
    margin: 0 30px;
  }
  .el-menu-item:hover {
    background-color: #af101d !important;
  }
  .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
    background-color: #af101d;
  }
  .el-card {
    width: 1000px;
    height: 200px;
  }
</style>
