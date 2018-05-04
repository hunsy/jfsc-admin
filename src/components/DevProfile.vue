<template>
  <div id="devProfile">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="开发者详情" name="profile">

    <el-card class="box-card">
      <div slot="header">
        <span>我的信息</span>
      </div>
      <div class="text item">
        <el-form 
          :model="profile"
          label-width="150px"
          label-position="left">

          <el-form-item label="账号">
            <el-input 
              :disabled="true"
              v-model="profile.mobile"
              placeholder=""
              ></el-input>
          </el-form-item>

        <el-form-item label="昵称">
            <el-input 
              :disabled="profileEdit"
              v-model="profile.nickName"
              placeholder="昵称"
              ></el-input>
        </el-form-item>

         <el-form-item label="绑定的邮箱">
            <el-input
              v-model="profile.email"
              :disabled="profileEdit"
              type="text"
              ></el-input>
          </el-form-item>

        </el-form>    
        <div class="box-footer">
          <el-button type="success" @click="profileEdit = false" v-show="profileEdit" size="small">编辑</el-button>
          <el-button type="primary" @click="saveProfile()" v-show="!profileEdit" size="small">保存</el-button>
          <el-button type="default" @click="profileEdit = true" v-show="!profileEdit" size="small">取消</el-button>
        </div> 
      </div>
    </el-card>



    </el-tab-pane>
    <el-tab-pane label="应用列表" name="apps">
      <el-table
        :data="apps"
        >
        <el-table-column
          prop="name"
          label="应用名称">
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
import comm from "../js/commons";

export default {
  name: "devProfile",
  data() {
    return {
      apiUrl: "http://localhost:8091",
      options: {},
      profileEdit: true,
      activeName: "profile",
      profile: {},
      apps: []
    };
  },
  mounted: function() {
    // var token = sessionStorage.getItem("accessToken");
    // console.log("token>>>>>>>>>>" + token);
    // if (token == null || token == undefined) {
    //   console.log("--------");
    //   router.push("login");
    // } else {
    //   this.options = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token
    //     }
    //   };
    this.getProfile();
    // }
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
      comm.doGet("/api/profile", comm.getOptions(), data => {
        this.profile = data;
      });
      // this.$http.get(this.apiUrl + "/api/profile", this.options).then(
      //   resp => {
      //     var ret = resp.body;
      //     if (ret.code == "200") {
      //       this.profile = ret.data;
      //     }
      //   },
      //   resp => {
      //     console.log(resp);
      //     // this.do403();
      //   }
      // );
    },
    getApps() {
      comm.doGet("/api/apps", comm.getOptions(), data => {
        this.apps = data;
      });
      // this.$http.get(this.apiUrl + "/api/apps", this.options).then(
      //   resp => {
      //     var ret = resp.body;
      //     if (ret.code == "200") {
      //       this.apps = ret.data;
      //     }
      //   },
      //   resp => {
      //     // this.do403();
      //     console.log(resp);
      //   }
      // );
    },
    setDefault(row) {
      comm.doPut("/api/setDef/" + row.id, {}, comm.getOptions(), () => {
        this.getApps();
      });

      // this.$http
      //   .put(this.apiUrl + "/api/setDef/" + row.id, {}, this.options)
      //   .then(
      //     resp => {
      //       var ret = resp.body;
      //       if (ret.code == "200") {
      //         getApps();
      //       }
      //     },
      //     resp => {
      //       sessionStorage.removeItem("accessToken");
      //       router.push("/login");
      //     }
      //   );
    },
    saveProfile() {
      comm.doPut("/api/profile", this.profile,comm.getOptions(), () => {
        this.profileEdit = true;
      });
    }
  }
};
</script>

<style>
.box-card {
  width: 550px;
}
.box-footer {
  margin: 0 auto;
}
</style>

