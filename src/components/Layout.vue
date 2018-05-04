<template>
 <el-container id="layout">

    <el-header class="header">
      <el-container>
        <div style="width:80px;height:60px;">
            <img src="../assets/logo.png" height="50px;">
        </div>
        <el-main style="padding:0px 120px;">
          <el-menu
            mode="horizontal"
            background-color="#2196f3"
            text-color="#fff"
            active-text-color="#ffd04b">

            <el-submenu index="1">
              <template slot="title">我的应用</template>
              <el-menu-item v-for="appv in apps"  @click="selectApp(appv)" index="app.id" :data="appv" :key="appv.id">{{appv.name}}</el-menu-item>

            </el-submenu>

            <el-menu-item index="2" @click="openAppModal">添加应用</el-menu-item>
          </el-menu>


        </el-main>

        <div style="width:80px;height:60px;line-height: 60px;">
          <el-menu
            mode="horizontal"
            background-color="#2196f3"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true">
            <el-menu-item index="3" route="appInfo" >{{currentApp.name}}</el-menu-item>
          </el-menu>
        </div>
        <!-- 用户信息部分 -->
        <div style="width:80px;height:60px;line-height: 60px;">
          <el-menu
            default-active="1"
            mode="horizontal"
            background-color="#2196f3"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="false">
            <el-submenu index="1">
              <template slot="title">
                <icon name="user"></icon>&nbsp;{{profile.nickName}}
              </template>
              <el-menu-item index="1-1" @click="devProfile();"><font color="black">{{profile.nickName}}</font></el-menu-item>
              <el-menu-item index="1-2" @click="logout();"><font color="black">退出登录</font></el-menu-item>
            </el-submenu>  
           </el-menu>
        </div>
      </el-container>

<!--       <el-dropdown>
        <span class="el-dropdown-link">
            <icon name="user-circle"></icon>
            <b>{{profile.nickName}}</b>&nbsp;<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
          <el-dropdown-item>新增</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      
      
    </el-header>
    <el-container>
        <el-aside
          class="menu"
          width="200px">

          <el-menu
              default-active="1"
              background-color="#2196F3"
              text-color="#fff"
              active-text-color="#ffd04b"
              index="x"
              :router="true"
              >

            <el-menu-item 
                index="1" 
                route="dashboard">
                <icon name="chart-line"></icon>&nbsp;&nbsp;

                <span slot="title">
                <!-- <router-link class="router-link" :to="{ name: 'Dashboard', params: {} }"></router-link> -->
                概览
                </span>
            </el-menu-item>

            <el-menu-item 
                index="2" 
                route="appInfo">
                <icon name="mobile"></icon>&nbsp;&nbsp;

                <span slot="title">
                <!-- <router-link class="router-link" :to="{ name: 'Dashboard', params: {} }"></router-link> -->
                应用详情
                </span>
            </el-menu-item>

            <el-menu-item 
                index="3" 
                route="appLevel">
                <icon name="level-up-alt"></icon>&nbsp;&nbsp;

                <span slot="title">
                <!-- <router-link class="router-link" :to="{ name: 'Dashboard', params: {} }"></router-link> -->
                等级定义
                </span>
            </el-menu-item>

            <el-menu-item 
                index="4" 
                route="appEvent">
                <icon name="thumbtack"></icon>&nbsp;&nbsp;

                <span slot="title">
                <!-- <router-link class="router-link" :to="{ name: 'Dashboard', params: {} }"></router-link> -->
                事件定义
                </span>
            </el-menu-item>

            <el-menu-item 
                index="5" 
                route="appMedal">
                <icon name="bookmark"></icon>&nbsp;&nbsp;

                <span slot="title">
                <!-- <router-link class="router-link" :to="{ name: 'Dashboard', params: {} }"></router-link> -->
                勋章定义
                </span>
            </el-menu-item>     

            <el-menu-item 
                index="6" 
                route="userInfo">
                <icon name="users"></icon>&nbsp;&nbsp;

                <span slot="title">
                <!-- <router-link class="router-link" :to="{ name: 'Dashboard', params: {} }"></router-link> -->
                用户管理
                </span>
            </el-menu-item>           
            </el-menu>
        </el-aside>

        <el-main>
            <router-view/>
        </el-main>
    </el-container>


  <el-dialog title="应用" :visible.sync="dialogFormVisible">
    <el-form :model="appForm">
      <el-form-item label="活动名称" label-width="100">
        <el-input v-model="appForm.name" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveApp">确 定</el-button>
    </div>
  </el-dialog>

 </el-container>
</template>

<script>
import router from "../router";
import comm from "../js/commons";

export default {
  name: "layout",
  data() {
    return {
      apiUrl: "http://localhost:8091",
      profile: {
        nickName: "",
        avatar: ""
      },
      apps: [],
      dialogFormVisible: false,
      appForm: {
        name: ""
      },
      currentApp: {},
      options: {}
    };
  },
  mounted: function() {
    //获取用户详情
    this.getProfile();
    this.getMyApps();
  },
  methods: {
    //获取用户信息
    getProfile: function() {
      comm.doGet("/api/profile", comm.getOptions(), data => {
        this.profile = data;
      });
    },
    //获取用户的应用
    getMyApps: function() {
      comm.doGet("/api/apps", comm.getOptions(), data => {
        this.apps = data;
        if (this.apps.length != 0) {
          for (var i = 0; i < this.apps.length; i++) {
            var app = this.apps[i];
            if (app.isDefault == 1) {
              this.currentApp = app;
              sessionStorage.setItem("currentAppId", app.appId);
              break;
            }
          }
        }
      });
    },
    openAppModal: function() {
      this.appForm = {};
      this.dialogFormVisible = true;
    },
    saveApp: function() {
      comm.doPost("/api/app", this.appForm, comm.getOptions(), () => {
        this.dialogFormVisible = false;
        this.getMyApps();
      });
    },
    selectApp: function(app) {
      this.currentApp = app;
      sessionStorage.setItem("currentAppId", app.appId);
      router.push({ path: "/layout/dashboard" });
    },
    devProfile() {
      router.push("devProfile");
    },
    logout() {
      comm.logout();
    }
  }
};
</script>

<style>
.header {
  text-align: right;
  background-color: #2196f3;
  color: #fff;
  line-height: 60px;
  height: 60px;
  background: #2196f3;
}
.menu {
  min-height: 600px;
  background: #2196f3;
  padding-right: -5px;
}
</style>


