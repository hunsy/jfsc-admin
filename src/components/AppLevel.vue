<template>
  <div id="appLevel">

    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="searchForm.name" placeholder="等级名称"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search();">查询</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="openNewModal();">新增</el-button>
        </el-form-item>
    </el-form>
    <el-table
      :data="levels"
      >
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>

    <el-table-column
        prop="level"
        label="等级"
        width="180">
      </el-table-column>   

      <el-table-column
        prop="name"
        label="等级名称">
      </el-table-column>    

      <el-table-column
        prop="minScore"
        label="等级下限"
        width="180">
      </el-table-column>

      <el-table-column
        prop="updatedAt"
        label="最后变更时间"
        width="280">
      </el-table-column> 

      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope"> 
            <el-button @click="handleUpdate(scope.row)" type="success" size="small">编辑</el-button>
             <el-button @click="handleDel(scope.row)" type="danger" size="small">删除</el-button>
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


  <el-dialog :title="oprate" :visible.sync="dialogFormVisible">
    <el-form 
      :rules="rules"
      :model="levelForm" 
      ref="levelForm"
      label-width="150px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="levelForm.name" ></el-input>
      </el-form-item>

      <el-form-item label="最低分" prop="">
        <el-input-number v-model="levelForm.minScore" :min="0"></el-input-number>
      </el-form-item> 

      <el-form-item label="等级描述">
        <el-input type="textarea" v-model="levelForm.levelWords"></el-input>
      </el-form-item> 

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdateLevel('levelForm')">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog 
    :title="delOprate" 
    :visible.sync="delDialogFormVisible"
    width="25%">
    <p>这将删除【{{delLevel.name}}】,并将在它之后的等级分别提升一级。</p>
    <p>
        确定删除当前等级?
    </p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="delDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="doDel()">确 定</el-button>
    </div>
  </el-dialog>

  </div>
</template>

<script>
import router from "../router";
import comm from "../js/commons";

export default {
  name: "appLevel",
  data() {
    return {
      appId: "",
      headers: {},
      searchForm: {
        name: ""
      },
      oprate: "新增等级",
      total: 0,
      pageNo: 1,
      pageSize: 10,
      levels: [],
      levelForm: {
        id: "",
        name: "",
        minScore: "",
        levelWords: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入等级名称", trigger: "blur" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      delOprate: "",
      delDialogFormVisible: false,
      delLevel: {}
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
    loadPage: function() {
      let url =
        "/api/level/page?appId=" +
        this.appId +
        "&pageNo=" +
        this.pageNo +
        "&pageSize=" +
        this.pageSize;
      if (this.searchForm.name != "" && this.searchForm.name != undefined) {
        url += "&name=" + this.searchForm.name;
      }
      comm.doGet(url, comm.getOptions(), data => {
        this.levels = data.dataResult;
        this.total = data.totalNum;
        this.pageNo = data.currentPage;
      });
      // this.$http
      //   .get(url, {
      //     headers: this.headers
      //   })
      //   .then(
      //     function(resp) {
      //       var ret = resp.body;
      //       if (ret.code == "200") {
      //         let data = ret.data;
      //         this.levels = data.dataResult;
      //         this.total = data.totalNum;
      //         this.pageNo = data.currentPage;
      //       }
      //     },
      //     function(resp) {
      //       console.error(resp);
      //     }
      //   );
    },
    search: function() {
      this.loadPage();
    },
    openNewModal: function() {
      this.dialogFormVisible = true;
    },
    saveOrUpdateLevel: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.levelForm.appId = this.appId;
          //更新
          if (this.levelForm.id != "" && this.levelForm.id != undefined) {
            comm.doPut("/api/level", this.levelForm, comm.getOptions(), () => {
              this.dialogFormVisible = false;
              this.loadPage();
            });

            // this.$http
            //   .put("http://localhost:8091/api/level", this.levelForm, {
            //     headers: this.headers
            //   })
            //   .then(
            //     function(resp) {
            //       var ret = resp.body;
            //       if (ret.code == "200") {
            //         this.loadPage();
            //       }
            //     },
            //     function(resp) {
            //       console.error(resp);
            //     }
            //   );
          } else {
            comm.doPost("/api/level", this.levelForm, comm.getOptions(), () => {
              this.dialogFormVisible = false;
              this.loadPage();
            });

            // this.$http
            //   .post("http://localhost:8091/api/level", this.levelForm, {
            //     headers: this.headers
            //   })
            //   .then(
            //     function(resp) {
            //       var ret = resp.body;
            //       if (ret.code == "200") {
            //         this.loadPage();
            //       }
            //     },
            //     function(resp) {
            //       console.error(resp);
            //     }
            //   );
          }

          // this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.resetForm();
    },
    resetForm: function() {
      this.levelForm = {};
    },
    handleDel: function(row) {
      console.log(JSON.stringify(row));
      this.delOprate = "删除等级->【" + row.name + "】";
      this.delLevel = row;
      this.delDialogFormVisible = true;
    },
    doDel: function() {
      comm.doDelete("/api/level/" + this.delLevel.id, comm.getOptions(), () => {
        this.delLevel = {};
        this.delDialogFormVisible = false;
        this.loadPage();
      });

      // this.$http
      //   .delete("http://localhost:8091/api/level/" + this.delLevel.id, {
      //     headers: this.headers
      //   })
      //   .then(
      //     function(resp) {
      //       var ret = resp.body;
      //       if (ret.code == "200") {
      //         this.loadPage();
      //       }
      //     },
      //     function(resp) {
      //       console.error(resp);
      //     }
      //   );
      // this.delLevel = {};
      // this.delDialogFormVisible = false;
    },
    handleUpdate: function(row) {
      comm.doGet("/api/level/" + row.id, comm.getOptions(), data => {
        this.levelForm = data;
        this.dialogFormVisible = true;
      });
    }
  }
};
</script>

