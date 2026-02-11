import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import  router  from "./router";

async function registerVisBadge() {
  // Prefer loading the web component bundle from a public URL (e.g. GitHub Pages).
  // Set at build time: VUE_APP_VIS_BADGE_WC_URL="https://<you>.github.io/<repo>/vis-badge.js"
  //
  // Fallback: serve a local copy from `public/vis-badge.js`.
  const url = process.env.VUE_APP_VIS_BADGE_WC_URL || `${process.env.BASE_URL}vis-badge.js`
  await import(/* webpackIgnore: true */ url)
}

import './assets/main.css'
import './assets/css/font.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

registerVisBadge().then(() => {
  const app = createApp(App)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.use(ElementPlus).use(router).mount('#app')
})