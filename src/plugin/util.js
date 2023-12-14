import axios from 'axios'
import { Message } from 'element-ui'

// 计算百分数
export function percentage (num, total) {
  if (parseInt(num) === 0 || parseInt(total) === 0) {
    return 0
  }
  return (Math.round((parseInt(num) / parseInt(total) * 10000) / 100.00))
}
// 发表评论
export async function addComment (id, t, type, content, commentId) {
  const params = {
    t: t,
    type: type,
    id: id,
    content: content,
    commentId: commentId
  }
  const { data: res } = await axios.get('/comment', { params: params })
  if (res.code !== 200) {
    Message.error('发送失败')
    return false
  }
  Message('发表评论成功')
  return true
}
// 删除评论
export async function deleteCom (id, type, commentId) {
  const params = {
    t: 0,
    type: type,
    id: id,
    commentId: commentId
  }
  const { data: res } = await axios.get('/comment', { params: params })
  if (res.code !== 200) {
    return Message.error('删除失败')
  }
  return Message('删除成功')
}
// 点赞、取消点赞
export async function handleLiked (id, cid, t, type) {
  const params = {
    id: id,
    cid: cid,
    t: t,
    type: type
  }
  const { data: res } = await axios.get('/comment/like', { params: params })
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
// 打开文件
export function openFile () {
  var inputObj = document.createElement('input')
  inputObj.setAttribute('id', '_ef')
  inputObj.setAttribute('type', 'file')
  inputObj.setAttribute('style', 'visibility:hidden')
  document.body.appendChild(inputObj)
  inputObj.click()
  inputObj.value()
}
