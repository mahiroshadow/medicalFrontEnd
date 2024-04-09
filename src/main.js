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


import * as echarts from 'echarts'

import 'echarts-gl'
import CodeEditor from 'bin-code-editor'




// cm-setting.js
// 组件样式
import "codemirror/lib/codemirror.css";
// 主题
import "codemirror/theme/3024-day.css"; // 引入主题样式，根据设置的theme的主题引入
import "codemirror/theme/ayu-mirage.css";
import "codemirror/theme/monokai.css";
import 'codemirror/theme/rubyblue.css';

	
// html代码高亮
import "codemirror/mode/htmlmixed/htmlmixed.js"; 

// 语言模式
import 'codemirror/mode/javascript/javascript.js'





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
// Vue.component("codemirror", codemirror);
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
//挂载echarts
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
