<template>
  <div id="devProfile">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="开发者详情" name="profile">
            {{profile.mobile}}<br>
            {{profile.nickName}}<br/>
            {{profile.email}}<br/>
    </el-tab-pane>
    <el-tab-pane label="应用列表" name="apps">
      <el-table
        :data="apps"
        style="width: 100%"
        >
        <el-table-column
          prop="name"
          label="应用名称"
          width="180">
        </el-table-column> 

        <el-table-column
          prop="role"
          label="角色"
          width="180">
        </el-table-column> 

        <el-table-column
            label="状态"
            width="200">
            <template slot-scope="scope"> 
                <span v-if="scope.row.isDefault == 1">默认</span>
            </template>
        </el-table-column>

        <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">       
                <el-button v-if="scope.row.isDefault == 0" @click="setDefault(scope.row)" type="success" size="small">设为默认</el-button>
            </template>
            </el-table-column> 
      </el-table>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import router from "../router";

export default {
  name: "devProfile",
  data() {
    return {
      apiUrl: "http://localhost:8091",
      options: {},
      activeName: "profile",
      profile: {},
      apps: []
    };
  },
  mounted: function() {
    var token = sessionStorage.getItem("accessToken");
    console.log("token>>>>>>>>>>" + token);
    if (token == null || token == undefined) {
      console.log("--------");
      router.push("login");
    } else {
      this.options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      };
      this.getProfile();
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == "apps" && this.apps.length == 0) {
        this.getApps();
      } else if (this.profile == "") {
        this.getProfile();
      }
    },
    //获取用户详情
    getProfile() {
      this.$http.get(this.apiUrl + "/api/profile", this.options).then(
        resp => {
          var ret = resp.body;
          if (ret.code == "200") {
            this.profile = ret.data;
          }
        },
        resp => {
          console.log(resp);
          // this.do403();
        }
      );
    },
    getApps() {
      this.$http.get(this.apiUrl + "/api/apps", this.options).then(
        resp => {
          var ret = resp.body;
          if (ret.code == "200") {
            this.apps = ret.data;
          }
        },
        resp => {
          // this.do403();
          console.log(resp);
        }
      );
    },
    setDefault(row) {
      this.$http
        .put(this.apiUrl + "/api/setDef/" + row.id, {}, this.options)
        .then(
          resp => {
            var ret = resp.body;
            if (ret.code == "200") {
              getApps();
            }
          },
          resp => {
            sessionStorage.removeItem("accessToken");
            router.push("/login");
          }
        );
    },
    do403() {
      console.log("do43");
    }
  }
};
</script>

<style>

</style>

