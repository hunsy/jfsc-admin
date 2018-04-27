<template>
  <div id="login">

    <el-card 
      shadow="hover"
      class="box-card">
      <div slot="header" class="clearfix">
          <b>积分商城管理系统</b>
          <el-button style="float: right; padding: 3px 0" type="text" @click="toRegister">注册</el-button>
      </div>
      <el-form
        label-position="right"
        label-width="80px"
        size="small"
        :model="userForm"
        :rules="rules"
        ref="userForm">
          <el-form-item 
            label="手机号码"
            prop="mobile">
            <el-input 
              type="text"
              v-model="userForm.mobile"
              placeholder="请输入手机号码">
            </el-input>
          </el-form-item>
          <el-form-item 
            label="密   码"
            prop="password">
            <el-input 
              type="password" 
              v-model="userForm.password"
              placeholder="请输入密码"
              minlength="6"
              maxlength="16">
            </el-input>
          </el-form-item>
      </el-form>
        <div class="login-footer">
            <el-button type="primary" @click="login('userForm');" size="small" style="width:300px;">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
        </div>
    </el-card>


    <el-dialog 
      width="30%"
      title="注册用户" 
      :visible.sync="dialogFormVisible">
      <el-form
        label-position="right"
        label-width="80px"
        size="small"
        :model="registerForm"
        :rules="regRules"
        ref="registerForm">
          <el-form-item 
            label="手机号码"
            prop="mobile">
            <el-input 
              type="text"
              v-model="registerForm.mobile"
              placeholder="请输入手机号码">
            </el-input>
          </el-form-item>
          <el-form-item 
            label="密   码"
            prop="password">
            <el-input 
              type="password" 
              v-model="registerForm.password"
              placeholder="请输入密码"
              minlength="6"
              maxlength="16">
            </el-input>
          </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="register('registerForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import router from "../router";

export default {
  name: "login",
  data() {
    var validateMobile = (rule, value, callback) => {
      var mobile = this.userForm.mobile;
      if (mobile == "" || mobile == undefined) {
        callback(new Error("请输入手机号码"));
      } else {
        if (!/^1[3|4|5|7|8][0-9]{9}$/.test(mobile)) {
          callback(new Error("请输入正确格式的手机号码"));
        } else {
          callback();
        }
      }
    };

    var validatePass = (rule, value, callback) => {
      var pwd = this.userForm.password;
      if (pwd == "" || pwd == undefined) {
        callback(new Error("请输入密码"));
      } else {
        if (pwd.length < 6 || pwd.length > 16) {
          callback(new Error("请输入在 6 到 16 之间的密码"));
        } else {
          callback();
        }
      }
    };

    var regValidateMobile = (rule, value, callback) => {
      var mobile = this.registerForm.mobile;
      if (mobile == "" || mobile == undefined) {
        callback(new Error("请输入手机号码"));
      } else {
        if (!/^1[3|4|5|7|8][0-9]{9}$/.test(mobile)) {
          callback(new Error("请输入正确格式的手机号码"));
        } else {
          callback();
        }
      }
    };

    var regValidatePass = (rule, value, callback) => {
      var pwd = this.registerForm.password;
      if (pwd == "" || pwd == undefined) {
        callback(new Error("请输入密码"));
      } else {
        var pwd = this.registerForm.password;
        if (pwd.length < 6 || pwd.length > 16) {
          callback(new Error("请输入在 6 到 16 之间的密码"));
        } else {
          callback();
        }
      }
    };
    return {
      apiUrl: "http://localhost:8091",
      rules: {
        mobile: [{ validator: validateMobile, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }]
      },
      userForm: {
        mobile: "",
        password: ""
      },
      regRules: {
        mobile: [{ validator: regValidateMobile, trigger: "blur" }],
        password: [{ validator: regValidatePass, trigger: "blur" }]
      },
      registerForm: {
        mobile: "",
        password: ""
      },
      dialogFormVisible: false
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post(this.apiUrl + "/login", this.userForm).then(
            resp => {
              var ret = resp.body;
              console.log(ret);
              if (ret.code == 200) {
                var token = ret.data.token;
                sessionStorage.setItem("accessToken", token);
                //跳转首页
                router.push("/layout/dashboard");
              } else {
                //错误处理
              }
            },
            resp => {}
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toRegister() {
      this.registerForm = {};
      this.dialogFormVisible = true;
    },
    register(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post(this.apiUrl + "/api", this.registerForm).then(
            resp => {
              var ret = resp.body;
              if (ret.code == 200) {
                this.dialogFormVisible = false;
              } else {
                //错误处理
              }
            },
            resp => {}
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style>
#login {
  margin: 0 auto;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
  margin-top: 150px;
}
.login-input {
  margin-top: 15px;
  margin-bottom: 15px;
}
.login-footer {
  text-align: center;
}
</style>