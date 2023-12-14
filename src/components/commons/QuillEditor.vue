<template>
<div>
  <div class="border"></div>
  <div class="tool">
      <i class="fl_l">@</i>
      <el-button class="com_btn fl_r"
        @click="handleClick()"
        type="primary">{{btn}}</el-button>
      <span class="fl_r">140</span>
  </div>
<quill-editor
    v-model="comment"
    ref="myQuillEditor"
    :options="editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @change="onEditorChange($event)"
    @ready="onEditorReady($event)">
    <div class="ql-conatiner"></div>
    <div class="ql-toolbar"></div>
</quill-editor>
</div>
</template>

<script>
import { Quill, quillEditor } from 'vue-quill-editor'
import quillEmoji from 'quill-emoji'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'quill-emoji/dist/quill-emoji.css'
import { addComment } from '../../plugin/util'
Quill.register('modules/quillEmoji', quillEmoji)
export default {
  name: 'QuillEditor',
  components: {
    quillEditor
  },
  props: ['pla', 'commentId', 'id', 'type'],
  data () {
    return {
    // 富文本编辑器配置
      editorOption: {
        modules: {
          'emoji-toolbar': true,
          'emoji-shortname': true,
          toolbar: [
            ['emoji']
          ]
        },
        comLimit: 140, // 评论字数限制
        placeholder: this.pla
      },
      comment: '',
      comToString: '',
      btn: '评论'
    }
  },
  created () {
  },
  mounted () {
    if (this.pla !== '评论') {
      this.btn = '回复'
    }
  },
  methods: {
    // 失去焦点事件
    onEditorBlur (quill) {
      // console.log('editor blur!', quill)
    },
    // 获得焦点事件
    onEditorFocus (quill) {
      if (!this.$store.state.user.id) {
        return this.$bus.$emit('showLogin')
      }
    },
    // 准备富文本编辑器
    onEditorReady (quill) {
      // console.log('editor ready!', quill)
    },
    // 内容改变事件
    onEditorChange ({ quill, html, text }) {
      const reg = new RegExp(/<[^>]+>/g)
      this.comToString = html.replace(reg, '')
      this.comLimit = 140 - this.comToString.length
    },
    handleClick () {
      if (this.pla === '评论') {
        this.addComment()
      } else {
        this.addReply()
      }
    },
    // 发表评论
    async addComment () {
      if (!this.$store.state.user.id) {
        return this.$bus.$emit('showLogin')
      }
      if (!this.comToString) {
        return
      }
      const res = await addComment(this.id, 1, this.type, this.comToString)
      if (res === true) {
        this.comment = ''
        this.comToString = ''
      }
    },
    async addReply () {
      const res = await addComment(this.id, 1, this.type, this.comToString, this.commentId)
      console.log(res)
      if (res === true) {
        this.comment = ''
        this.comToString = ''
      }
    }
  }
}
</script>

<style>
  .quill-editor {
    position: relative;
    width: 100%;
    height: 60px;
  }
  .ql-toolbar {
    position: absolute;
    width: 100%;
    bottom: -40px!important;
    border: none!important;
  }
  .ql-container {
    position: absolute;
    width: 100%;
    top: 0!important;
    border: none!important;
  }
  .border {
    position: absolute;
    top: 0;
    width: 100%;
    height: 59px;
    border: 1px solid #d9d9d9;
  }
  .tool {
    position: absolute;
    top: 60px;
    left: 40px;
    width: 538px;
    line-height: 40px;
    z-index: 10;
    color: #9999A6;
  }
  .tool span {
    font-size: 12px;
  }
  .tool .com_btn {
      margin-top: 10px;
      margin-left: 10px;
      padding: 0;
      width: 35px;
      height: 20px;
      line-height: 19px;
      cursor: pointer;
  }
</style>
