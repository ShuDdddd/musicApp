<template>
  <div class="login_box main_box">
    <div class="pic_box">
        <a class="login_btn" @click="toLogin"></a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toLogin () {
      this.$bus.$emit('toLogin')
    }
  }
}
</script>

<style>
.login_box {
    height: 700px;
    overflow: hidden;
}
.pic_box {
    position: relative;
    margin: 104px auto;
    padding-top: 1px;
    width: 807px;
    height: 268px;
    background: url('../../assets/img/login.png') no-repeat;
}
.login_box .pic_box .login_btn {
    display: block;
    width: 167px;
    height: 45px;
    margin: 200px 0 0 482px;
    background: url('../../assets/img/login.png') no-repeat;
    background-position: 0 9999px;
    text-indent: -9999px;
}
</style>
