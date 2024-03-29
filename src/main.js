import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import * as API from './api';

import CategorySelector from './components/CategorySelector'; // 全局注册CategorySelector
import HintButton from './components/HintButton/HintButton.vue';

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.component('CategorySelector', CategorySelector)
Vue.component('HintButton', HintButton)

Vue.config.productionTip = false
Vue.prototype.$API =API  // 把所有的接口请求函数最终挂载到vue原型身上,每个组件都可使用
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
