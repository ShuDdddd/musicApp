import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Test from '../components/Test'
import Search from '../components/Search'
// import MusicPlayer from '@/components/MusicPlayer'
import TopList from '../components/discover/TopList'
import ArtList from '../components/discover/ArtList'
import PlayList from '../components/discover/PlayList/PlayList'
import Discover from '../components/discover/Index/Discover'
import Song from '../components/Song'
import MySong from '../components/MySong'
import QuillEditor from '../components/commons/QuillEditor'
import ToLogin from '../components/commons/ToLogin'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/discover',
      children: [
        {
          path: '/discover',
          component: Discover
        },
        {
          path: '/discover/toplist',
          component: TopList
        },
        {
          path: '/toplist',
          component: TopList
        },
        {
          path: '/playlist/:id',
          name: 'playlist',
          component: PlayList
        },
        {
          path: '/artlist',
          component: ArtList
        },
        {
          path: '/friend',
          component: Discover
        },
        {
          path: '/my/:id',
          component: MySong
        },
        {
          path: '/tologin',
          component: ToLogin
        },
        {
          path: '/download',
          component: Discover
        },
        {
          path: '/song/:id',
          name: 'song',
          component: Song
        },
        {
          path: '/search',
          component: Search
        }
      ]
    },
    {
      path: '/test',
      component: Test
    },
    {
      path: '/edit',
      component: QuillEditor
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) {
//     this.$message.info('尚未登陆')
//   }
// })
export default router
