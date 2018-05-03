<template>
  <div id="appEvent">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="searchForm.name" placeholder="事件名称"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="loadPage();">查询</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="openNewModal();">新增</el-button>
        </el-form-item>
    </el-form>

    <el-table
        :data="datas"
        >
        <el-table-column
            prop="id"
            label="ID"
            width="180px">
        </el-table-column>

        <el-table-column
            prop="name"
            label="名称">
        </el-table-column>

        <el-table-column
            prop="score"
            label="分值"
            width="280px">
        </el-table-column>
        
        
<!--         <el-table-column
            label="事件类型"
            width="200">
            <template slot-scope="scope"> 
                <span v-if="scope.row.type == 1">成长事件</span>
                <span v-if="scope.row.type == 2">积分事件</span>
                <span v-if="scope.row.type == 3">金币事件</span>
            </template>
        </el-table-column> -->

        <el-table-column
            prop="updatedAt"
            label="最后变更时间"
            width="280px">
        </el-table-column> 

        <el-table-column
            fixed="right"
            label="操作"
            width="400px">
            <template slot-scope="scope"> 
                <el-button @click="openEditModal(scope.row)" type="success" size="small">编辑</el-button>
                <el-button @click="handleDel(scope.row)" type="danger" size="small">删除</el-button>
<!--                 <el-button @click="openNewConditionModal(scope.row)" type="success" size="small">新增事件</el-button>
                <el-button @click="showConditions(scope.row)" type="danger" size="small">事件细则</el-button> -->
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
    :title="operate" 
    :visible.sync="dialogFormVisible">
    <el-form 
      :rules="rules"
      :model="saveForm" 
      ref="saveForm"
      label-width="150px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="saveForm.name" ></el-input>
      </el-form-item>


      <el-form-item label="分值" prop="name">
        <el-input-number v-model="saveForm.score" :min="0"></el-input-number>
      </el-form-item>
<!--       <el-form-item 
        label="类型" 
        :required="true"
        prop="type">
        <el-select 
          v-model="saveForm.type" 
          placeholder="请选择类型"
          >
          <el-option
            v-for="item in types"
            :key="item.type"
            :label="item.display"
            :value="item.type">
          </el-option>
        </el-select>
      </el-form-item>  -->

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate('saveForm')">确 定</el-button>
    </div>
  </el-dialog>

  <!-- <el-dialog 
    title="事件条件" 
    :visible.sync="conditionListDialogVisible">
    <el-table
        :data="conditions"
        >
        <el-table-column
            prop="id"
            label="ID"
            width="200">
        </el-table-column>

        <el-table-column
            prop="name"
            label="条件名称"
            width="200">
        </el-table-column>
 
        <el-table-column
            prop="getCondition"
            label="获取条件"
            width="100">
        </el-table-column>

        <el-table-column
            prop="value"
            label="事件的值"
            width="100">
        </el-table-column>

        <el-table-column
            prop="updatedAt"
            label="最后变更时间"
            width="150">
        </el-table-column> 

        <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope"> 
                <el-button @click="openConditionEditModal(scope.row)" type="success" size="small">编辑</el-button>
            </template>
            </el-table-column> 
    </el-table>
  </el-dialog>



  <el-dialog 
    :title="conditionOperate" 
    :visible.sync="conditionDialogFormVisible">
    <el-form 
      :rules="conditionRules"
      :model="saveConditionForm" 
      ref="saveConditionForm"
      label-width="150px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="saveConditionForm.name" ></el-input>
      </el-form-item>

      <el-form-item label="条件">
        <el-input-number v-model="saveConditionForm.getCondition" :min="0"></el-input-number>
      </el-form-item>
      
      <el-form-item label="值">
        <el-input-number v-model="saveConditionForm.value" :min="0"></el-input-number>
      </el-form-item>

      <el-form-item label="文案">
        <el-input type="textarea" v-model="saveConditionForm.words"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="conditionDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdateCondition('saveConditionForm')">确 定</el-button>
    </div>
  </el-dialog> -->




  </div>
</template>

<script>
import router from "../router";
import comm from "../js/commons";

export default {
  name: "appEvent",
  data() {
    return {
      apiUrl: "http://localhost:8091/api/event",
      appId: "",
      headers: {},
      total: 0,
      pageNo: 1,
      pageSize: 10,
      datas: [],
      searchForm: {
        name: ""
      },
      //   types: [],
      rules: {
        name: [
          { required: true, message: "请输入事件名称", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur"
          }
        ]
      },
      operate: "新增事件",
      dialogFormVisible: false,
      saveForm: {
        id: "",
        name: "",
        score: 0
      } /* ,
      conditionListDialogVisible: false,
      conditions: [],
      conditionOperate: "新增条件",
      conditionDialogFormVisible: false,
      conditionRules: {
        name: [
          { required: true, message: "请输入条件名称", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur"
          }
        ]
      },
      saveConditionForm: {
        id: "",
        eventId: "",
        name: "",
        getCondition: 0,
        valud: 0,
        words: ""
      } */
    };
  },
  mounted: function() {
    this.appId = sessionStorage.getItem("currentAppId");
    this.loadPage();
  },
  methods: {
    /*     loadTypes() {
      if (this.types.length == 0) {
        this.$http
          .get("http://localhost:8091/api/event/types", {
            headers: this.headers
          })
          .then(
            function(resp) {
              var ret = resp.body;
              if (ret.code == "200") {
                this.types = ret.data;
              }
            },
            function(resp) {
              console.error(resp);
            }
          );
      }
    }, */
    handleCurrentChange(currentPage) {
      this.pageNo = currentPage;
    },
    loadPage() {
      let url =
        "/api/event/page?appId=" +
        this.appId +
        "&pageNo=" +
        this.pageNo +
        "&pageSize=" +
        this.pageSize;
      if (this.searchForm.name != "" && this.searchForm.name != undefined) {
        url += "&name=" + this.searchForm.name;
      }
      comm.doGet(url, comm.getOptions(), data => {
        this.datas = data.dataResult;
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
      //         this.datas = data.dataResult;
      //         this.total = data.totalNum;
      //         this.pageNo = data.currentPage;
      //       }
      //     },
      //     function(resp) {
      //       console.error(resp);
      //     }
      //   );
    },
    openNewModal() {
      //   this.loadTypes();
      this.dialogFormVisible = true;
    },
    saveOrUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveForm.appId = this.appId;
          //更新
          if (this.saveForm.id != "" && this.saveForm.id != undefined) {
            comm.doPut("/api/event", this.saveForm, comm.getOptions(), () => {
              this.loadPage();
              this.saveForm = {};
              this.dialogFormVisible = false;
            });

            //   this.$http
            //     .put("http://localhost:8091/api/event", this.saveForm, {
            //       headers: this.headers
            //     })
            //     .then(
            //       function(resp) {
            //         var ret = resp.body;
            //         if (ret.code == "200") {
            //           this.loadPage();
            //         }
            //       },
            //       function(resp) {
            //         console.error(resp);
            //       }
            //     );
          } else {
            comm.doPost("/api/event", this.saveForm, comm.getOptions(), () => {
              this.loadPage();
              this.saveForm = {};
              this.dialogFormVisible = false;
            });

            // this.$http
            //   .post("http://localhost:8091/api/event", this.saveForm, {
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
    },
    openEditModal(row) {
      //   this.loadTypes();
      this.operate = "更新事件";
      comm.doGet("/api/event/" + row.id, comm.getOptions(), data => {
        this.saveForm = data;
        this.dialogFormVisible = true;
      });

      // let url = this.apiUrl + "/" + row.id;
      // let options = {
      //   headers: this.headers
      // };
      // this.$http.get(url + row.id, options).then(
      //   resp => {
      //     var ret = resp.body;
      //     if (ret.code == "200") {
      //       this.saveForm = ret.data;
      //     }
      //   },
      //   resp => {
      //     console.error(resp);
      //   }
      // );
      // this.dialogFormVisible = true;
    } /* ,
    openNewConditionModal(row) {
      this.saveConditionForm = {};
      this.saveConditionForm.eventId = row.id;
      this.conditionDialogFormVisible = true;
    },
    saveOrUpdateCondition(formName) {
      let eventId = this.saveConditionForm.eventId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveConditionForm.appId = this.appId;
          //更新
          if (
            this.saveConditionForm.id != "" &&
            this.saveConditionForm.id != undefined
          ) {
            this.$http
              .put(
                "http://localhost:8091/api/event/condition",
                this.saveConditionForm,
                {
                  headers: this.headers
                }
              )
              .then(
                function(resp) {
                  var ret = resp.body;
                  if (ret.code == "200") {
                    this.loadConditions(eventId);
                  }
                },
                function(resp) {
                  console.error(resp);
                }
              );
          } else {
            this.$http
              .post(
                "http://localhost:8091/api/event/condition",
                this.saveConditionForm,
                {
                  headers: this.headers
                }
              )
              .then(
                function(resp) {
                  var ret = resp.body;
                  if (ret.code == "200") {
                  }
                },
                function(resp) {
                  console.error(resp);
                }
              );
          }

          this.conditionDialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showConditions(row) {
      this.conditionListDialogVisible = true;
      this.loadConditions(row.id);
    },
    openConditionEditModal(row) {
      this.conditionOperate = "更新事件条件";
      this.$http
        .get("http://localhost:8091/api/event/condition/" + row.id, {
          headers: this.headers
        })
        .then(
          function(resp) {
            var ret = resp.body;
            if (ret.code == "200") {
              this.saveConditionForm = ret.data;
            }
          },
          function(resp) {
            console.error(resp);
          }
        );

      this.conditionDialogFormVisible = true;
    },
    loadConditions(id) {
      let url = "http://localhost:8091/api/event/condition/list/" + id;
      this.$http
        .get(url, {
          headers: this.headers
        })
        .then(
          function(resp) {
            var ret = resp.body;
            if (ret.code == "200") {
              this.conditions = ret.data;
            }
          },
          function(resp) {
            console.error(resp);
          }
        );
    } */
  }
};
</script>

<style>

</style>


