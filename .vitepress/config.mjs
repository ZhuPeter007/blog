import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "带派不老铁",
  description: "A VitePress Site",
  themeConfig: {
    outline: 'deep',
    outlineTitle: '大纲',
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      src: '/yinyang.svg',
      alt: 'VitePress Logo'
    },
    nav: [
      { text: '家',items:[
          { text: '关于我', link: '/about' },
          { text: '项目', link: '/project' },
        ]
      },
      { text: '演示', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown 演示', link: '/markdown-examples' },
          { text: 'Runtime API 演示', link: '/api-examples' }
        ]
      },
      {
        text: 'Examples2',
        items: [
          { text: 'Markdown 演示2', link: '/markdown-examples' },
          { text: 'Runtime API 演示2', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      { icon: 'twitter', link: 'https://twitter.com/vite_js' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈'
            },
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索'
            },

          }
        }
      }
    },
  },
  base: '/blog/',
})
