<template>
  <div class="comment_box">
    <div class="comment_hd">
      <h3>评论</h3>
      <span>共{{totalComments}}条评论</span>
    </div>
    <div class="publish_com">
      <div class="pub_com_hd">
        <img :src="$store.state.user.img ? $store.state.user.img : defaultImg">
      </div>
      <div class="pub_com_bd com_quill">
        <QuillEditor pla="评论"
                        :id=this.id
                        :type = this.type
                        ref="quillEditor">
        </QuillEditor>
      </div>
    </div>
    <div class="hot_com mod_com" v-if="hotComments.length > 0">
      <h3 class="hot_com_hd">
        精彩评论
      </h3>
      <ul>
        <li class="cf" v-bind:key="index"
            v-for="(item, index) in hotComments">
          <img :src="item.user.avatarUrl">
          <div class="com_info">
            <a class="blue">{{item.user.nickname}}</a>
            <span>:&nbsp;{{item.content}}</span>
            <div class="com_operation cf">
              <div class="fl_l">{{item.timeStr}}</div>
              <div class="fl_r">
                <div class="del_com_btn fl_l"
                     @click='removeCom (item.commentId)'
                     v-if="item.user.userId===$store.state.user.id">
                  删除
                </div>
                <a>
                  <svg @click="clickLiked($event,item)"
                       :class="item.liked ? 'red': 'info'"
                       class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dianzan"></use>
                  </svg>
                  <span>({{item.likedCount}})</span>
                </a>
                <i @click="shoeReplyBox($event)">  回复</i>
              </div>
            </div>
            <div class="com_quill com_reply">
              <QuillEditor
                :id="id"
                :pla="'回复' + item.user.nickname"
                :commentId="item.commentId"
                :type="2"
                ref="quillEditor">
              </QuillEditor>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="new_com mod_com">
      <h3 class="new_com_hd">
        最新评论
      </h3>
      <ul>
        <li class="cf" v-bind:key="index"
            v-for="(item, index) in newComments">
          <img :src="item.user.avatarUrl">
          <div class="com_info">
            <a class="blue">{{item.user.nickname}}</a>
            <span>:&nbsp;{{item.content}}</span>
            <div class="com_operation cf">
              <div class="fl_l">{{item.timeStr}}</div>
              <div class="fl_r">
                <div class="del_com_btn fl_l"
                     @click='removeCom (item.commentId)'
                     v-if="item.user.userId===$store.state.user.id">
                  删除
                </div>
                <a>
                  <svg @click="clickLiked($event,item)"
                       :class="item.liked ? 'red': 'info'"
                       class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dianzan"></use>
                  </svg>
                  <span>({{item.likedCount}})</span>
                </a>
                <i @click="shoeReplyBox($event)">  回复</i>
              </div>
            </div>
            <div class="com_quill com_reply">
              <QuillEditor
                :id="id"
                :pla="'回复' + item.user.nickname"
                :commentId="item.commentId"
                :type="2"
                ref="quillEditor">
              </QuillEditor>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import QuillEditor from './QuillEditor'
import '../../assets/css/comment.css'
import { Message } from 'element-ui'
export default {
  name: 'Comment',
  components: {
    QuillEditor
  },
  props: ['id', 'type'], // 0:歌曲 1:mv 2:歌单 3:专辑 4:电台 5:视频 6:动态
  data () {
    return {
      defaultImg: require('../../assets/img/youke.png'), // 游客模式头像
      myComment: '',
      hotComments: [],
      newComments: [],
      totalComments: 0,
      replyVisible: false
    }
  },
  created () {
    this.getCom()
  },
  methods: {
    async getCom () {
      let type
      switch (this.type) {
        case '0':
          type = 'music'
          break
        case '2':
          type = 'playlist'
          break
      }
      const { data: res } = await this.$http.get('/comment/' + type, { params: { id: this.id } })
      if (res.code !== 200) {
        this.$message.error('获取歌曲评论失败')
      }
      this.newComments = res.comments
      this.hotComments = res.hotComments
      this.totalComments = res.total
    },
    // 显示回复框
    shoeReplyBox (e) {
      if (!this.$store.state.user.id) {
        return this.$bus.$emit('showLogin')
      }
      const ele = window.$(e.path[3]).children('.com_reply')
      if (ele.css('display') === 'block') {
        ele.css('display', 'none')
      } else {
        window.$('.com_reply').css('display', 'none')
        ele.css('display', 'block')
      }
    },
    // 删除评论
    async removeCom (commentId) {
      const params = {
        t: 0,
        type: this.type,
        id: this.id,
        commentId: commentId
      }
      const { data: res } = await this.$http.get('/comment', { params: params })
      if (res.code !== 200) {
        return Message.error('删除失败')
      }
      return Message('删除成功')
    },
    // 点赞/取消点赞
    async clickLiked (e, item) {
      if (!this.$store.state.user.id) {
        return this.$bus.$emit('showLogin')
      }
      let res
      if (item.liked) {
        res = await this.handleLiked(item.commentId, 0)
        if (res) {
          item.likedCount--
          item.liked = false
        }
      } else {
        res = await this.handleLiked(item.commentId, 1)
        if (res) {
          item.likedCount++
          item.liked = true
        }
      }
    },
    async handleLiked (cid, t) {
      const params = {
        id: this.id,
        cid: cid,
        t: t,
        type: this.type
      }
      const { data: res } = await this.$http.get('/comment/like', { params: params })
      if (res.code !== 200) {
        if (t === 1) {
          Message.error('点赞失败')
        } else {
          Message.error('取消点赞失败')
        }
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
