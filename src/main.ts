import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { directive } from './utils/directive'
import { router } from './router'
import { i18n } from './i18n'
import 'virtual:svg-icons-register'

import '@/icons/iconfont/iconfont'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import '@/styles/atom.scss'
import '@/styles/search-wrapper.scss'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import MaComponent from '@/components/index'
import SvgIcon from '@/components/SvgIcon.vue'
import SubHeader from '@/components/SubHeader.vue'

VXETable.config({
  zIndex: 3000,
  select: {
    transfer: true,
  },
})

const app = createApp(App)

// element plus图标 全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('SvgIcon', SvgIcon)
app.component('SubHeader', SubHeader)

app.use(createPinia())

// 注册 自定义指令
directive(app)
app.use(i18n)
app.use(router)
app.use(MaComponent)
app.use(ElementPlus)
app.use(VXETable)

app.mount('#app')
