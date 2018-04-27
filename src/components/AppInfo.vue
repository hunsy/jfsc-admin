<template>
  <el-container id="app_info">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="应用详情" name="appInfo">
            {{appInfo.id}}->{{appInfo.name}}
    </el-tab-pane>
    <el-tab-pane label="开发者" name="developers">

      <el-form 
        :inline="true" 
        :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="开发者名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchDev()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="openAddModal">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="developers"
        style="width: 100%"
        >
        <el-table-column
          prop="mobile"
          label="开发者账号"
          width="180">
        </el-table-column>

        <el-table-column
          prop="nickName"
          label="开发者名称"
          width="180">
        </el-table-column>    

        <el-table-column
          prop="role"
          label="开发者角色"
          width="180">
        </el-table-column> 
      </el-table>

    </el-tab-pane>
  </el-tabs>


  <el-dialog title="添加开发者" :visible.sync="dialogFormVisible">
    <el-form :model="devAddForm" label-width="150px">

      <el-form-item label="开发者账号">
        <el-input v-model="devAddForm.mobile"></el-input>
      </el-form-item>

      <el-form-item label="请选择角色">
        <el-select 
          v-model="devAddForm.role" 
          placeholder="请选择角色"
          >
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveDev()">确 定</el-button>
    </div>
  </el-dialog>

  </el-container>
</template>

<script>
import router from "../router";

export default {
  name: "appInfo",
  data() {
    return {
      apiUrl: "http://localhost:8091",
      options: {},
      appId: "",
      activeName: "appInfo",
      appInfo: {
        id: "",
        name: ""
      },
      developers: [],
      searchForm: {
        name: ""
      },
      dialogFormVisible: false,
      devAddForm: {
        appId: "",
        mobile: "",
        role: ""
      },
      roles: [
        {
          name: "管理员",
          value: "master"
        },
        {
          name: "开发者",
          value: "developer"
        }
      ]
    };
  },
  mounted: function() {
    var token = sessionStorage.getItem("accessToken");
    if (token == null || token == undefined) {
      router.push({ path: "/login" });
    }
    this.options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    };
    this.appId = sessionStorage.getItem("currentAppId");
    this.activeName = "appInfo";
    this.getAppInfo();
    this.getDvelopers();
  },
  methods: {
    handleClick(tab, event) {},
    getAppInfo() {
      this.$http.get(this.apiUrl + "/api/app/" + this.appId, this.options).then(
        resp => {
          var ret = resp.body;
          console.log("appInfo->" + ret);
          if (ret.code == "200") {
            this.appInfo = ret.data;
          }
        },
        resp => {
          // this.do403();
        }
      );
    },
    getDvelopers() {
      this.$http
        .get(this.apiUrl + "/api/app/developer/" + this.appId, this.options)
        .then(
          resp => {
            var ret = resp.body;
            if (ret.code == "200") {
              this.developers = ret.data;
            }
          },
          resp => {
            if (resp.code == 403) {
              this.do403();
            }
          }
        );
    },
    saveDev() {
      this.$http
        .post(this.apiUrl + "/api/app/dev", this.devAddForm, this.options)
        .then(
          resp => {
            var ret = resp.body;
            if (ret.code == "200") {
              this.getDvelopers();
            }
          },
          resp => {
            if (resp.code == 403) {
              this.do403();
            }
          }
        );
      this.dialogFormVisible = false;
    },
    openAddModal() {
      this.devAddForm = {};
      this.dialogFormVisible = true;
    },
    searchDev: function() {},
    do403() {
      sessionStorage.removeItem("accessToken");
      router.push({ path: "/login" });
    }
  }
};
</script>

<style>

</style>


