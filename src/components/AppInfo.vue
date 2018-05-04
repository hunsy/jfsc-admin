<template>
  <div id="app_info">
  
  <el-tabs 
    v-model="activeName" 
    @tab-click="handleClick"
    width="100%">
    <el-tab-pane 
      label="应用详情" 
      name="appInfo"
      >

    <el-card class="box-card">
      <div slot="header">
        <span>应用详情</span>
      </div>
      <div class="text item">
        <el-form 
          :model="appInfo"
          label-width="150px"
          label-position="left">

          <el-form-item label="应用名称">
            <el-input 
              :disabled="appInfoEdit"
              v-model="appInfo.name"
              placeholder="应用名称"
              ></el-input>
          </el-form-item>

        <el-form-item label="应用KEY">
            <el-input 
              :disabled="true"
              v-model="appInfo.appKey"
              ></el-input>
        </el-form-item>

         <el-form-item label="应用SECRET">
            <el-input 
              :disabled="true"
              v-model="appInfo.appSecret"
              type="password"
              ></el-input>
          </el-form-item>

        </el-form>    
        <div class="box-footer">
          <el-button type="success" @click="appInfoEdit = false" v-show="appInfoEdit" size="small">编辑</el-button>
          <el-button type="primary" @click="saveApp()" v-show="!appInfoEdit" size="small">保存</el-button>
          <el-button type="default" @click="appInfoEdit = true" v-show="!appInfoEdit" size="small">取消</el-button>
        </div> 
      </div>
      

      </el-card>
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
          width="350px">
        </el-table-column>

        <el-table-column
          prop="nickName"
          label="开发者名称">
        </el-table-column>    

        <el-table-column
          prop="role"
          label="开发者角色"
          width="300px">
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

  </div>
</template>

<script>
import router from "../router";
import comm from "../js/commons";

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
      appInfoEdit: true,
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
    this.appId = sessionStorage.getItem("currentAppId");
    this.activeName = "appInfo";
    this.getAppInfo();
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == "developers") {
        if (this.developers.length == 0) {
          this.getDvelopers();
        }
      } else {
        if (this.appInfo == "") {
          this.getAppInfo();
        }
      }
    },
    getAppInfo() {
      comm.doGet("/api/app/" + this.appId, comm.getOptions(), data => {
        this.appInfo = data;
      });
    },
    getDvelopers() {
      let path = "/api/app/developer/" + this.appId;
      if (this.searchForm.name != undefined && this.searchForm.name != null) {
        path += "?name=" + this.searchForm.name;
      }
      comm.doGet(path, comm.getOptions(), data => {
        this.developers = data;
      });
    },
    saveDev() {
      this.devAddForm.appId = this.appId;
      comm.doPost("/api/app/dev", this.devAddForm, comm.getOptions(), () => {
        this.dialogFormVisible = false;
        this.getDvelopers();
      });
    },
    openAddModal() {
      this.devAddForm = {};
      this.dialogFormVisible = true;
    },
    searchDev: function() {
      this.getDvelopers();
    },
    saveApp() {
      comm.doPut("/api/app", this.appInfo, comm.getOptions(), () => {
        this.appInfoEdit = true;
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


