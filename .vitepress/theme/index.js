import { h } from 'vue'
import {inBrowser} from "vitepress";
import DefaultTheme from 'vitepress/theme'
import HomeUnderline from "./components/HomeUnderline.vue"
import HomeHeroRight from "./components/HomeHeroRight.vue"
import update from "./components/update.vue"
import MouseFollower from './components/MouseFollower.vue'
import MouseClick from './components/MouseClick.vue'
import CustomDOC from './components/CustomDOC.vue'
import {patchH1,emergeAnima} from './components/CustomDOC.js'

import { bindFancybox, destroyFancybox } from './components/ImgViewer' // 图片查看器
import { NProgress } from 'nprogress-v2/dist/index.js' // 进度条组件
import 'nprogress-v2/dist/index.css' // 进度条样式

import './style.css'
import './style/index.css'



/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HomeHeroRight),
      'layout-top': () => h(MouseFollower),
      'doc-before': () => h(CustomDOC),
      'layout-bottom': () => h(MouseClick),
    })
  },
  enhanceApp({ app, router, siteData }) {

    app.component('HomeUnderline', HomeUnderline)
    app.component('update', update)

    if (inBrowser) {
      NProgress.configure({ showSpinner: true })

      router.onBeforeRouteChange = () => {
        NProgress.start() // 开始进度条
        destroyFancybox() // 销毁图片查看器
      }

      router.onAfterRouteChanged = () => {
        NProgress.done() // 停止进度条
        bindFancybox() // 绑定图片查看器
        emergeAnima()
        patchH1()

      }


    }




  },
}

