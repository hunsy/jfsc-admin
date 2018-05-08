import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'

import Layout from '@/components/Layout'
import Dashboard from '@/components/Dashboard'
import AppInfo from '@/components/AppInfo'
import AppLevel from "@/components/AppLevel"
import AppEvent from "@/components/AppEvent"
import AppMedal from "@/components/AppMedal"
import DevProfile from "@/components/DevProfile"
import AppUserInfo from '@/components/AppUserInfo'
import AppMenu from '@/components/AppMenu'

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
          path: 'appMedal',
          name: 'AppMedal',
          component: AppMedal,
          meta: { requiresAuth: true }
        },
        {
          path: 'devProfile',
          name: 'DevProfile',
          component: DevProfile,
          meta: { requiresAuth: true }
        }
        ,
        {
          path: 'userInfo',
          name: 'AppUserInfo',
          component: AppUserInfo,
          meta: { requiresAuth: true }
        }
        ,
        {
          path: 'appMenu',
          name: 'AppMenu',
          component: AppMenu,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
