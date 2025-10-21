// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HomeUnderline from "./components/HomeUnderline.vue"
import update from "./components/update.vue"

import './style.css'
import './style/index.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('HomeUnderline', HomeUnderline)
    app.component('update', update)
  }
}
