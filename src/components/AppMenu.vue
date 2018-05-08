<template>
  <div id="appMenu">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/layout/dashboard' }">概览</el-breadcrumb-item>
        <el-breadcrumb-item>菜单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :inline="true" :model="searchForm" class="query-form">
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
      border
      >
    <el-table-column
        prop="id"
        label="ID"
        width="180">
    </el-table-column>

    <el-table-column
        label="名称"
        prop="name">
    </el-table-column>   

      <el-table-column
        label="路径"
        prop="path">
    </el-table-column>  


    <el-table-column
        prop="updatedAt"
        label="最后变更时间"
        width="180">
    </el-table-column> 

      <el-table-column
        fixed="right"
        label="操作"
        width="250">
        <template slot-scope="scope"> 
            <el-button @click="handleUpdate(scope.row)" type="success" size="small">编辑</el-button>
           <el-button @click="showDetail(scope.row)" type="primary" size="small">详情</el-button>
        </template>
        </el-table-column> 
    </el-table>




  <el-dialog 
    :title="oprate" 
    :visible.sync="dialogFormVisible">
    <el-form 
      :rules="rules"
      :model="menuForm" 
      ref="menuForm"
      label-width="150px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="menuForm.name"></el-input>
      </el-form-item>

      <el-form-item label="路径" prop="path">
        <el-input v-model="menuForm.path" ></el-input>
      </el-form-item>

      <el-form-item label="图标" prop="icon">
        <el-input v-model="menuForm.icon" ></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate('menuForm')">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog 
    title="菜单详情" 
    :visible.sync="dialogTreeVisible">
    <el-tree
      :data="treeDatas"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
<!--         <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button> 
        </span>
        -->
      </span>
    </el-tree>

  </el-dialog>





  </div>
</template>

<script>
import router from "../router";
import comm from "../js/commons";

export default {
  name: "appMenu",
  data() {
    return {
      searchForm: {
        name: ""
      },
      total: 0,
      pageNo: 1,
      pageSize: 10,
      datas: [],
      dialogFormVisible: false,
      oprate: "新增菜单",
      menuForm: {},
      rules: {
        name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 2 到 16 个字符", trigger: "blur" }
        ]
      },
      dialogTreeVisible: false,
      treeDatas: []
    };
  },
  mounted: function() {
    this.loadPage();
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.pageNo = currentPage;
      this.loadPage();
    },
    loadPage() {
      let path =
        "/api/menu/page?pageNo=" + this.pageNo + "&pageSize=" + this.pageSize;
      if (this.searchForm.name != "" && this.searchForm.name != undefined) {
        path += "&name=" + this.searchForm.name;
      }
      comm.doGet(path, comm.getOptions(), data => {
        // console.log(data);
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
      this.menuForm = {};
      this.dialogFormVisible = true;
    },
    saveOrUpdate(formName) {
      this.$refs[formName].validate(validate => {
        if (validate) {
          if (this.menuForm.id != null && this.menuForm.id != undefined) {
            comm.doPut("/api/menu", this.menuForm, comm.getOptions(), () => {
              this.dialogFormVisible = false;
              this.loadPage();
            });
          } else {
            comm.doPost("/api/menu", this.menuForm, comm.getOptions(), () => {
              this.dialogFormVisible = false;
              this.loadPage();
            });
          }
        } else {
          console.log("validate fail");
          return false;
        }
      });
    },
    showDetail(row) {
      comm.doGet("/api/menu/tree/" + row.id, comm.getOptions(), data => {
        this.treeDatas = data;
        this.dialogTreeVisible = true;
      });
    }
  }
};
</script>

<style>
.query-form {
  margin-top: 20px;
  padding-top: 25px;
  padding-left: 25px;
  background-color: #f2f2f2;
}

.custom-tree-node {
  display: block;
}
</style>
