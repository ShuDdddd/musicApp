<template>
  <div class="mainBox">
    <div class="center">
      <PlaylistMain :listid="id"></PlaylistMain>
      <div class="mod_related"></div>
    </div>
  </div>
</template>

<script>
import PlaylistMain from './PlaylistMain.vue'
export default {
  name: 'PlayList',
  components: {
    PlaylistMain
  },
  data () {
    return {
      id: '' // 歌单id
    }
  },
  created () {
    this.id = this.$route.params.id
    console.log(this.id)
  },
  mounted () {
  }
}
</script>

<style scoped>
.center {
  width: 980px;
  height: 100%;
  background-color: white;
  border: 1px solid #d6d6d6;
  border-top: none;
  margin: 0 auto;
}
  .mod_list {
    width: 640px;
    padding: 35px;
    border-right: 1px solid #d6d6d6;
  }
  .mod_related {
    width: 340px;
    height: 100%;
    background-color: #bb8493;
  }
  .list_hd {
    position: relative;
    width: 100%;
    display: flex;
  }
  .list_bd {
    position: relative;
    width: 100%;
  }
  .list_cover {
    width: 200px;
    height: 200px;
    margin-right: 30px;
    border: #D5D5D5 1px solid;
  }
  .list_info {
    width: 450px;
    height: inherit;
  }
  .list_name {
    width: 440px;
    display: flex;
    margin-bottom: 12px;
  }
  .icon_gedan {
    margin-right: 10px;
  }
.list_info p {
  display: block;
  margin: 0 5px;
  width: 200px;
  height: 40px;
  line-height: 40px;
}
  .operation {
    display: flex;
    width: 420px;
    height: 40px;
    margin-bottom: 25px;
  }
  .el-button {
    height: 30px;
    margin-top: 10px;
    margin-right: 0;
    margin-left: 6px;
    padding: 0 5px;
    font-size: 12px;
    line-height: 30px;
  }
  .el-button:first-child {
    background-color: #3E8DD7;
    color: white;
    width: 66px;
    font-size: 12px;
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
  .auth_info {
    display: flex;
    width: 420px;
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    margin-bottom: 10px;
  }
  .list_babel {
    width: 420px;
    height: 40px;
    display: flex;
    margin-top: 10px;
    font-size: 14px;
  }
  .intro {
    width: 420px;
    font-size: 12px;
    color: #666666;
  }
  .tags{
    margin-left: 10px;
  }
  .flex_box {
    position: relative;
    display: flex;
  }
  .btn_mv {
    width: 25px;
    height: 20px;
    border: 1px #DBDBDB solid;
    border-radius: 3px;
    margin-left: 6px;
    box-shadow: 0 0 2px #aca9a9;
  }
  .btn_mv:hover {
    box-shadow: none;
  }
  .btn_mv i {
    color: #af101d;
    font-weight: bold;
    display: block;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  }
  .sortBox {
    display: flex;
    justify-content: space-around;
  }
  #bofang {
    width: 18px;
    height: 18px;
    color: #B3B3B3;
    margin-top: 3px;
    font-weight: bold;
  }
#bofang:hover {
  color: #666666;
}
  .page {
    width: fit-content;
    height: fit-content;
    margin: auto;
  }
</style>
