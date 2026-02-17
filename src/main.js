import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import  router  from "./router";

function addCacheBust(url) {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}v=${Date.now()}`
}

async function registerVisBadge() {
  const baseUrl = (process.env.VUE_APP_VIS_BADGE_WC_BASE_URL || 'https://vedelsbrunner.github.io/badge-lib/dist-wc').replace(/\/+$/, '')
  const pinnedFile = (process.env.VUE_APP_VIS_BADGE_WC_FILE || '').trim()
  const alwaysLive = process.env.VUE_APP_VIS_BADGE_ALWAYS_LIVE === 'true'
  const localUrl = `${process.env.BASE_URL}vis-badge.js`
  const pinnedUrl = pinnedFile ? `${baseUrl}/${pinnedFile}` : ''
  const latestUrl = `${baseUrl}/vis-badge.js`

  const urlsToTry = []
  if (process.env.NODE_ENV === 'development') {
    urlsToTry.push(addCacheBust(localUrl))
    if (pinnedUrl) urlsToTry.push(addCacheBust(pinnedUrl))
    urlsToTry.push(addCacheBust(latestUrl))
    urlsToTry.push(localUrl)
  } else {
    if (pinnedUrl) urlsToTry.push(pinnedUrl)
    urlsToTry.push(alwaysLive ? addCacheBust(latestUrl) : latestUrl)
    urlsToTry.push(localUrl)
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
      `- Set VUE_APP_VIS_BADGE_WC_BASE_URL and optional VUE_APP_VIS_BADGE_WC_FILE, or\n` +
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
