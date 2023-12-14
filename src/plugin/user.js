import axios from 'axios'
import { Message } from 'element-ui'
class GetUser {
// 获取通知-通知
  async getNotices () {
    const { data: res } = await axios.get('/msg/notices')
    if (res.code !== 200) {
      Message.error('获取用户通知失败')
    }
    return res
  }

  // 获取通知-评论
  async getComments (id) {
    const { data: res } = await axios.get('/msg/comments', { params: { uid: id } })
    if (res.code !== 200) {
      Message.error('获取用户通知-评论失败')
    }
    return res.comments
  }

  // 获取通知-@我
  async getForwards () {
    const { data: res } = await axios.get('/msg/forwards')
    if (res.code !== 200) {
      Message.error('获取用户通知-@失败')
    }
    return res
  }

  // 获取通知-私信
  async getPrivate () {
    const { data: res } = await axios.get('/msg/private')
    if (res.code !== 200) {
      Message.error('获取用户通知-私信失败')
    }
    return res
  }
}
const getUser = new GetUser()
export default getUser
