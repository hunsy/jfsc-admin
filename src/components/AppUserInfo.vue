<template>
  <div id="userInfo">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/layout/dashboard' }">概览</el-breadcrumb-item>
        <el-breadcrumb-item>用户</el-breadcrumb-item>
    </el-breadcrumb>
    
    <hr>
    <!-- 查询表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="searchForm.userAccount" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search();">查询</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="openModal();">新增</el-button>
        </el-form-item>
    </el-form>

    <el-table
      :data="datas"
      >
    <el-table-column
        prop="id"
        label="ID"
        width="180">
    </el-table-column>

    <el-table-column
        prop="userAccount"
        label="账号"
        width="200">
    </el-table-column>   

    <el-table-column
        prop="nickName"
        label="昵称">
    </el-table-column>    

    <el-table-column
        prop="medalNum"
        label="勋章数"
        width="150">
    </el-table-column>


    <el-table-column
        prop="score"
        label="成长值"
        width="150">
    </el-table-column>

    <el-table-column
        prop="currentLevel"
        label="等级"
        width="150">
    </el-table-column>


    <el-table-column
        prop="integral"
        label="积分"
        width="180">
    </el-table-column>

    <el-table-column
        prop="virtualIcons"
        label="金币"
        width="150">
    </el-table-column>


    <el-table-column
        prop="updatedAt"
        label="最后变更时间"
        width="180">
    </el-table-column> 

      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope"> 
            <el-button @click="handleUpdate(scope.row)" type="success" size="small">编辑</el-button>
            <!--  <el-button @click="handleDel(scope.row)" type="danger" size="small">删除</el-button> -->
        </template>
        </el-table-column> 
    </el-table>

    <el-row>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="pageNo"
        @current-change="handleCurrentChange">
        </el-pagination>
    </el-row>

  <el-dialog 
    :title="oprate" 
    :visible.sync="dialogFormVisible">
    <el-form 
      :rules="rules"
      :model="userForm" 
      ref="userForm"
      label-width="150px">

      <el-form-item label="账号" prop="userAccount">
        <el-input v-model="userForm.userAccount" :disabled="userForm.id"></el-input>
      </el-form-item>

      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="userForm.nickName" ></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate('userForm')">确 定</el-button>
    </div>
  </el-dialog>

  </div>



</template>

<script>
import router from "../router";
import comm from "../js/commons";
export default {
  name: "userInfo",
  data() {
    return {
      appId: "",
      searchForm: {
        userAccount: ""
      },
      total: 0,
      pageNo: 1,
      pageSize: 10,
      datas: [],
      oprate: "新增用户",
      rules: {
        userAccount: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ]
      },
      userForm: {},
      dialogFormVisible: false
    };
  },
  mounted: function() {
    this.appId = sessionStorage.getItem("currentAppId");
    this.loadPage();
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.pageNo = currentPage;
      this.loadPage();
    },
    loadPage() {
      let path =
        "/api/user/page?pageNo=" + this.pageNo + "&pageSize=" + this.pageSize;
      if (
        this.searchForm.userAccount != null &&
        this.searchForm.userAccount != undefined
      ) {
        path += "&userAccount=" + this.searchForm.userAccount;
      }
      comm.doGet(path, comm.getOptions(), data => {
        this.datas = data.dataResult;
        this.total = data.totalNum;
        this.pageNo = data.currentPage;
      });
    },
    search() {
      this.pageNo = 1;
      this.loadPage();
    },
    openModal() {
      this.oprate = "新增用户";
      this.userForm = {};
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      comm.doGet("/api/user/" + row.id, comm.getOptions(), data => {
        this.userForm = data;
        this.dialogFormVisible = true;
      });
    },
    saveOrUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.userForm.appId = this.appId;
          if (this.userForm.id != null && this.userForm.id != undefined) {
            comm.doPut("/api/user", this.userForm, comm.getOptions(), () => {
              this.loadPage();
            });
          } else {
            comm.doPost("/api/user", this.userForm, comm.getOptions(), () => {
              this.loadPage();
            });
          }
        } else {
          console.log("validate fail");
          return false;
        }
        this.dialogFormVisible = false;
      });
    }
  }
};
</script>

<style>

</style>
