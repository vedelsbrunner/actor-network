import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import  router  from "./router";

async function registerVisBadge() {
  const configuredUrl = process.env.VUE_APP_VIS_BADGE_WC_URL
  const localUrl = `${process.env.BASE_URL}vis-badge.js`

  const urlsToTry = []
  if (process.env.NODE_ENV === 'development') {
    urlsToTry.push(localUrl)
    if (configuredUrl && configuredUrl !== localUrl) urlsToTry.push(configuredUrl)
  } else {
    if (configuredUrl) urlsToTry.push(configuredUrl)
    if (!configuredUrl || configuredUrl !== localUrl) urlsToTry.push(localUrl)
  }

  let lastError
  for (const url of urlsToTry) {
    try {
      await import(/* webpackIgnore: true */ url)
      return
    } catch (err) {
      lastError = err
      // Keep going; we may have another URL to try.
      console.warn(`[vis-badge] Failed to import ${url}`, err)
    }
  }

  console.error(
    `[vis-badge] Could not load vis-badge web component bundle.\n` +
      `Tried:\n` +
      `- ${urlsToTry.join('\n- ')}\n` +
      `Fix:\n` +
      `- Set VUE_APP_VIS_BADGE_WC_URL to a valid public URL, or\n` +
      `- Add public/vis-badge.js so ${localUrl} exists.\n`,
    lastError
  )
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
