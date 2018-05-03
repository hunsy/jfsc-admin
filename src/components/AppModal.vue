<template>
  <div id="appModal">

    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="searchForm.name" placeholder="勋章名称"></el-input>
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
            label="勋章类型"
            width="200px">
            <template slot-scope="scope"> 
                <span v-if="scope.row.type == 1">成长勋章</span>
                <span v-if="scope.row.type == 2">积分勋章</span>
                <span v-if="scope.row.type == 3">消费勋章</span>
            </template>
        </el-table-column>

        <el-table-column
            label="状态"
            width="200px">
            <template slot-scope="scope"> 
                <span v-if="scope.row.status == 0">下架</span>
                <span v-if="scope.row.status == 1">上架</span>
            </template>
        </el-table-column>

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
            <!--     <el-button @click="handleDel(scope.row)" type="danger" size="small">删除</el-button> -->
                <el-button @click="openNewModalE(scope.row)" type="success" size="small">新增勋章</el-button>
                <el-button @click="showModals(scope.row)" type="danger" size="small">勋章列表</el-button>
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

      <el-form-item 
        label="名称" 
        prop="name">
        <el-input v-model="saveForm.name" ></el-input>
      </el-form-item>

      <el-form-item 
        label="勋章类型" 
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
      </el-form-item> 

      <el-form-item 
        label="状态" 
        prop="status"
        >
        <el-select  
          v-model="saveForm.status"
          placeholder="请选择状态"
          >
            <el-option
                v-for="item in statuses"
                :key="item.key"
                :label="item.name"
                :value="item.key">
            </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate('saveForm')">确 定</el-button>
    </div>
  </el-dialog>

<el-dialog 
    title="勋章列表" 
    :visible.sync="modalListDialogVisible">
    <el-table
        :data="modals"
        >
        <el-table-column
            prop="id"
            label="ID"
            width="200">
        </el-table-column>

        <el-table-column
            prop="name"
            label="勋章名称"
            width="200">
        </el-table-column>
 
        <el-table-column
            prop="getCondition"
            label="获取条件"
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
                <el-button @click="openEditModalE(scope.row)" type="success" size="small">编辑</el-button>
            </template>
            </el-table-column> 
    </el-table>
  </el-dialog>



  <el-dialog 
    :title="modalOperate" 
    :visible.sync="modalDialogFormVisible">
    <el-form 
      :rules="modalRules"
      :model="saveModalForm" 
      ref="saveModalForm"
      label-width="150px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="saveModalForm.name" ></el-input>
      </el-form-item>

      <el-form-item label="条件">
        <el-input-number v-model="saveModalForm.getCondition" :min="0"></el-input-number>
      </el-form-item>
        
      <el-form-item label="触发事件">
        <el-autocomplete
            v-model="saveModalForm.eventName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            value-key="name"
            @select="handleSelect"
            >
            <template slot-scope="{ item }">
                <div>{{ item.name }}->({{item.score}})</div>
            </template>
        </el-autocomplete>
      </el-form-item>
      
      <el-form-item label="勋章描述">
        <el-input type="textarea" v-model="saveModalForm.getConditionWords"></el-input>
      </el-form-item>


      <el-form-item label="激励文案">
        <el-input type="textarea" v-model="saveModalForm.stimulateWords"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="modalDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdateModal('saveModalForm')">确 定</el-button>
    </div>
  </el-dialog>


  </div>
</template>

<script>
import router from "../router";
import comm from "../js/commons";

export default {
  name: "appModal",
  data() {
    return {
      appId: "",
      headers: {},
      total: 0,
      pageNo: 1,
      pageSize: 10,
      datas: [],
      searchForm: {
        name: ""
      },
      types: [],
      statuses: [
        {
          key: 0,
          name: "下架"
        },
        {
          key: 1,
          name: "上架"
        }
      ],
      rules: {
        name: [
          { required: true, message: "请输入勋章名称", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur"
          }
        ],
        type: [{ required: true, message: "请选择勋章类型", trigger: "blur" }],
        status: [{ required: true, message: "请选择勋章类型", trigger: "blur" }]
      },
      operate: "新增勋章系列",
      dialogFormVisible: false,
      saveForm: {
        id: "",
        name: "",
        type: 0,
        status: 1
      },
      modalListDialogVisible: false,
      modals: [],
      modalOperate: "新增勋章",
      modalDialogFormVisible: false,
      modalRules: {
        name: [
          { required: true, message: "请输入勋章名称", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur"
          }
        ]
      },
      saveModalForm: {
        id: "",
        eventId: "",
        eventName: "",
        name: "",
        getCondition: 0,
        valud: 0,
        words: ""
      }
    };
  },
  mounted: function() {
    this.appId = sessionStorage.getItem("currentAppId");
    // let token = localStorage.getItem("token");
    // if (token == undefined) {
    //   localStorage.removeItem("currentAppId");
    //   router.push("/login");
    // }
    // this.headers = {
    //   "Content-Type": "application/json",
    //   Authorization: "Bearer " + token
    // };
    this.loadPage();
  },
  methods: {
    loadTypes() {
      if (this.types.length == 0) {
        comm.doGet("/api/modalSerial/types", comm.getOptions(), data => {
          this.types = data;
        });
        //   this.$http
        //     .get("http://localhost:8091/api/modalSerial/types", {
        //       headers: this.headers
        //     })
        //     .then(
        //       function(resp) {
        //         var ret = resp.body;
        //         if (ret.code == "200") {
        //           this.types = ret.data;
        //         }
        //       },
        //       function(resp) {
        //         console.error(resp);
        //       }
        //     );
      }
    },
    handleCurrentChange(currentPage) {
      this.pageNo = currentPage;
    },
    loadPage() {
      let url =
        "http://localhost:8091/api/modalSerial/page?appId=" +
        this.appId +
        "&pageNo=" +
        this.pageNo +
        "&pageSize=" +
        this.pageSize;
      if (this.searchForm.name != "" && this.searchForm.name != undefined) {
        url += "&name=" + this.searchForm.name;
      }
      this.$http
        .get(url, {
          headers: this.headers
        })
        .then(
          function(resp) {
            var ret = resp.body;
            if (ret.code == "200") {
              let data = ret.data;
              this.datas = data.dataResult;
              this.total = data.totalNum;
              this.pageNo = data.currentPage;
            }
          },
          function(resp) {
            console.error(resp);
          }
        );
    },
    openNewModal() {
      this.operate = "新增勋章系列";
      this.loadTypes();
      this.saveForm = {};
      this.dialogFormVisible = true;
    },
    saveOrUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveForm.appId = this.appId;
          //更新
          if (this.saveForm.id != "" && this.saveForm.id != undefined) {
            this.$http
              .put("http://localhost:8091/api/modalSerial", this.saveForm, {
                headers: this.headers
              })
              .then(
                function(resp) {
                  var ret = resp.body;
                  if (ret.code == "200") {
                    this.loadPage();
                  }
                },
                function(resp) {
                  console.error(resp);
                }
              );
          } else {
            this.$http
              .post("http://localhost:8091/api/modalSerial", this.saveForm, {
                headers: this.headers
              })
              .then(
                function(resp) {
                  var ret = resp.body;
                  if (ret.code == "200") {
                    this.loadPage();
                  }
                },
                function(resp) {
                  console.error(resp);
                }
              );
          }

          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    openEditModal(row) {
      this.loadTypes();
      this.operate = "更新勋章系列";
      this.$http
        .get("http://localhost:8091/api/modalSerial/" + row.id, {
          headers: this.headers
        })
        .then(
          function(resp) {
            var ret = resp.body;
            if (ret.code == "200") {
              this.saveForm = ret.data;
            }
          },
          function(resp) {
            console.error(resp);
          }
        );
      this.dialogFormVisible = true;
    },
    openNewModalE(row) {
      this.modalOperate = "新增勋章";
      this.saveModalForm = {};
      this.saveModalForm.serialId = row.id;
      this.modalDialogFormVisible = true;
    },
    saveOrUpdateModal(formName) {
      let serialId = this.saveModalForm.serialId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveModalForm.appId = this.appId;
          //更新
          if (
            this.saveModalForm.id != "" &&
            this.saveModalForm.id != undefined
          ) {
            this.$http
              .put("http://localhost:8091/api/modal", this.saveModalForm, {
                headers: this.headers
              })
              .then(
                function(resp) {
                  var ret = resp.body;
                  if (ret.code == "200") {
                    this.loadModals(serialId);
                  }
                },
                function(resp) {
                  console.error(resp);
                }
              );
          } else {
            this.$http
              .post("http://localhost:8091/api/modal", this.saveModalForm, {
                headers: this.headers
              })
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

          this.modalDialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    openEditModalE(row) {
      this.modalOperate = "更新勋章";
      this.$http
        .get("http://localhost:8091/api/modal/" + row.id, {
          headers: this.headers
        })
        .then(
          function(resp) {
            var ret = resp.body;
            if (ret.code == "200") {
              this.saveModalForm = ret.data;
            }
          },
          function(resp) {
            console.error(resp);
          }
        );

      this.modalDialogFormVisible = true;
    },
    showModals(row) {
      this.modalListDialogVisible = true;
      this.loadModals(row.id);
    },
    loadModals(id) {
      let url = "http://localhost:8091/api/modal/list/" + id;
      this.$http
        .get(url, {
          headers: this.headers
        })
        .then(
          function(resp) {
            var ret = resp.body;
            if (ret.code == "200") {
              this.modals = ret.data;
            }
          },
          function(resp) {
            console.error(resp);
          }
        );
    },
    querySearchAsync(str, cb) {
      let url =
        "http://localhost:8091/api/event/list?appId=" +
        this.appId +
        "&name=" +
        str;
      this.$http
        .get(url, {
          headers: this.headers
        })
        .then(
          function(resp) {
            var ret = resp.body;
            if (ret.code == "200") {
              cb(ret.data);
            }
          },
          function(resp) {
            console.error(resp);
          }
        );
    },
    handleSelect(item) {
      this.saveModalForm.eventId = item.id;
      this.saveModalForm.eventName = item.name;
    }
  }
};
</script>

<style>

</style>
