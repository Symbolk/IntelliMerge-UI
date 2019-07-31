import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Icon from 'vue-awesome/components/Icon'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

import 'vue-awesome/icons/arrow-up'
import 'vue-awesome/icons/arrow-down'
import 'vue-awesome/icons/cogs'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/save'
import 'vue-awesome/icons/arrows-alt-h'

Vue.component('v-icon', Icon)
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueSidebarMenu)

new Vue({
  render: h => h(App)
}).$mount('#app')
