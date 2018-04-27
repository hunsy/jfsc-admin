import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Register from '@/components/Register'

import Layout from '@/components/Layout'
import Dashboard from '@/components/Dashboard'
import AppInfo from '@/components/AppInfo'
import AppLevel from "@/components/AppLevel"
import AppEvent from "@/components/AppEvent"
import AppModal from "@/components/AppModal"
import DevProfile from "@/components/DevProfile"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: '/layout',
      name: 'Layout',
      component: Layout,
      meta: { requireAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { requireAuth: true }
        },
        {
          path: 'appInfo',
          name: 'AppInfo',
          component: AppInfo,
          meta: { requireAuth: true }
        },
        {
          path: 'appLevel',
          name: 'AppLevel',
          component: AppLevel,
          meta: { requireAuth: true }
        },
        {
          path: 'appEvent',
          name: 'AppEvent',
          component: AppEvent,
          meta: { requireAuth: true }
        },
        {
          path: 'appModal',
          name: 'AppModal',
          component: AppModal,
          meta: { requireAuth: true }
        },
        {
          path: 'devProfile',
          name: 'DevProfile',
          component: DevProfile,
          meta: { requireAuth: true }
        }
      ]
    }
  ]
})
