// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import {inBrowser} from "vitepress";
import DefaultTheme from 'vitepress/theme'
import HomeUnderline from "./components/HomeUnderline.vue"
import HomeHeroRight from "./components/HomeHeroRight.vue"
import update from "./components/update.vue"

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
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('HomeUnderline', HomeUnderline)
    app.component('update', update)

    if (inBrowser) {
      NProgress.configure({ showSpinner: true })
      router.onBeforeRouteChange = () => {
        NProgress.start() // 开始进度条
      }
      router.onAfterRouteChanged = () => {
        NProgress.done() // 停止进度条
      }
    }
  }
}

