<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="box">
    <div id="leftBtn"
         @click="leftMove"
         class="moveBtn"><</div>
    <div id="rightBtn"
         @click="rightMove"
         class="moveBtn">></div>
    <div class="newBox">
      <ul id="One" class="ulClass">
        <li v-bind:key="index"
          v-for="(item,index) in listTwo">
          <div class="listBox">
            <div class="picBox">
              <div class="whiteBlock"></div>
              <div class="blackCircle"></div>
              <img :src="item.picUrl">
              <svg class="icon" aria-hidden="true"
                   id="bofang">
                <use xlink:href="#icon-bofang-01"></use>
              </svg>
            </div>
            <div class="mesBox">
              <a class="albumName">{{item.name}}</a>
              <a class="singer">{{item.artist.name}}</a>
            </div>
          </div>
        </li>
      </ul>
      <ul id="Two" class="ulClass">
        <li v-bind:key="index"
        v-for="(item,index) in listOne">
          <div class="listBox">
            <div class="picBox">
              <div class="whiteBlock"></div>
              <div class="blackCircle"></div>
              <img :src="item.picUrl">
              <svg class="icon" aria-hidden="true"
                   id="bofang">
                <use xlink:href="#icon-bofang-01"></use>
              </svg>
            </div>
            <div class="mesBox">
              <a class="albumName">{{item.name}}</a>
              <a class="singer">{{item.artist.name}}</a>
            </div>
          </div>
        </li>
      </ul>
      <ul id="Three" class="ulClass">
        <li v-bind:key="index"
          v-for="(item,index) in listTwo">
          <div class="listBox">
            <div class="picBox">
              <div class="whiteBlock"></div>
              <div class="blackCircle"></div>
              <img :src="item.picUrl">
              <svg class="icon" aria-hidden="true"
                   id="bofang">
                <use xlink:href="#icon-bofang-01"></use>
              </svg>
            </div>
            <div class="mesBox">
              <a class="albumName">{{item.name}}</a>
              <a class="singer">{{item.artist.name}}</a>
            </div>
          </div>
        </li>
      </ul>
      <ul id="Four" class="ulClass">
        <li v-bind:key="index"
            v-for="(item,index) in listOne">
          <div class="listBox">
            <div class="picBox">
              <div class="whiteBlock"></div>
              <div class="blackCircle"></div>
              <img :src="item.picUrl">
              <svg class="icon" aria-hidden="true"
                   id="bofang">
                <use xlink:href="#icon-bofang-01"></use>
              </svg>
            </div>
            <div class="mesBox">
              <a class="albumName">{{item.name}}</a>
              <a class="singer">{{item.artist.name}}</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewModel',
  data () {
    return {
      listOne: [], // id,picUrl:封面 name:碟名 artist.name:歌手
      listTwo: [],
      One: {},
      Two: {},
      Three: {},
      Four: {},
      ulList: [],
      leftMoveTimer: '',
      rightMoveTimer: '',
      imgIndex: 1
    }
  },
  mounted () {
    // this.One = document.getElementById('One')
    // this.Two = document.getElementById('Two')
    // this.Three = document.getElementById('Three')
    // this.Four = document.getElementById('Four')
    this.getNewAlbum()
    this.ulList = document.getElementsByClassName('ulClass')
  },
  methods: {
    leftMove () {
      if (this.imgIndex === 3) {
        for (let i = 0; i < this.ulList.length; i++) {
          this.ulList[i].style.left = this.ulList[i].offsetLeft + 1800 + 'px'
        }
        this.imgIndex = 1
      }
      const speed = 25
      this.imgIndex++
      this.leftMoveTimer = setInterval(() => {
        for (let i = 0; i < this.ulList.length; i++) {
          this.ulList[i].style.left = this.ulList[i].offsetLeft - speed + 'px'
        }
        if (this.ulList[this.imgIndex].offsetLeft <= 0) {
          clearInterval(this.leftMoveTimer)
        }
      }, 50)
    },
    rightMove () {
      if (this.imgIndex === 0) {
        for (let i = 0; i < this.ulList.length; i++) {
          this.ulList[i].style.left = this.ulList[i].offsetLeft - 1800 + 'px'
        }
        this.imgIndex = 2
      }
      const speed = 25
      this.imgIndex--
      this.leftMoveTimer = setInterval(() => {
        for (let i = 0; i < this.ulList.length; i++) {
          this.ulList[i].style.left = this.ulList[i].offsetLeft + speed + 'px'
        }
        if (this.ulList[this.imgIndex].offsetLeft >= 0) {
          clearInterval(this.leftMoveTimer)
        }
      }, 50)
    },
    async getNewAlbum () {
      const { data: res } = await this.$http.get('album/newest')
      if (res.code !== 200) {
        this.$message.error('获取新碟列表失败')
      } else {
        for (let i = 0; i < 5; i++) {
          this.listOne.push(res.albums[i])
        }
        for (let j = 5; j < 10; j++) {
          this.listTwo.push(res.albums[j])
        }
      }
    }
  }
}
</script>

<style scoped>
  .box {
    position: relative;
    margin: 20px auto;
    width: 940px;
    height: 150px;
  }
  .newBox {
    position: relative;
    margin: 0 auto;
    width: 900px;
    height: 160px;
    overflow: hidden;
    border: 1px solid #d6d6d6;
  }
  #leftBtn {
    left: 2px;
  }
  #rightBtn {
    right: -3px;
  }
  .moveBtn {
    width: 20px;
    height: 20px;
    font-weight: bold;
    font-size: 25px;
    position: absolute;
    top: 65px;
    z-index: 100;
    cursor: pointer;
  }
  #One {
    position: absolute;
    left: -900px;
  }
  #Two {
    position: absolute;
    left: 0;
  }
  #Three {
    position: absolute;
    left: 900px;
  }
  #Four {
    position: absolute;
    left: 1800px;
  }
  ul {
    margin: 0;
    padding: 0;
    top: 0;
    width: 900px;
    height: 160px;
    list-style: none;
    display: flex;
    background-color: #F5F5F5;
  }
  li {
    width: 180px;
    height: 150px;
    margin-top: 8px;
  }
  .picBox {
    width: 120px;
    height: 110px;
    margin: 0 auto;
    position: relative;
  }
  .picBox img {
    position: absolute;
    width: 110px;
    height: 110px;
    z-index: 3;
  }
  .whiteBlock {
    position: absolute;
    left: 7px;
    top: 2px;
    width: 105px;
    height: 103px;
    border: 1px #d6d6d6 solid;
    background-color: whitesmoke;
    opacity: 40%;
    z-index: 2;
  }
  .blackCircle {
    position: absolute;
    right: -7px;
    top: 5px;
    width: 100px;
    height: 100px;
    background-color: black;
    border-radius: 50%;
    z-index: 1;
    box-shadow: 3px 0 1px #716b6b;
  }
  .icon {
    position: absolute;
    top: 90px;
    right: 15px;
    color: whitesmoke;
    z-index: 4;
  }
  .mesBox {
    width: 116px;
    height: 35px;
    padding-top: 3px;
    margin: 3px auto;
    padding-right: 6px;
    font-size: 14px;
  }
  .mesBox a {
    display: block;
    height: 16px;
    width: 116px;
    overflow: hidden;
  }
  .singer {
    font-size: 12px;
    color: #666666;
  }

</style>
