import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'

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
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { requiresAuth: true }
        },
        {
          path: 'appInfo',
          name: 'AppInfo',
          component: AppInfo,
          meta: { requiresAuth: true }
        },
        {
          path: 'appLevel',
          name: 'AppLevel',
          component: AppLevel,
          meta: { requiresAuth: true }
        },
        {
          path: 'appEvent',
          name: 'AppEvent',
          component: AppEvent,
          meta: { requiresAuth: true }
        },
        {
          path: 'appModal',
          name: 'AppModal',
          component: AppModal,
          meta: { requiresAuth: true }
        },
        {
          path: 'devProfile',
          name: 'DevProfile',
          component: DevProfile,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
