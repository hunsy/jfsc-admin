<template>
  <el-container id="register">
      <el-form
        label-position="right"
        label-width="100px"
        :v-model="user">
        <el-form-item label="手机号码">
            <el-input v-model="user.mobile"></el-input>
        </el-form-item>

        <el-form-item label="密码">
            <el-input v-model="user.password"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
  </el-container>
</template>

<script>
import router from "../router";

export default {
  name: "register",
  data() {
    return {
      apiUrl: "http://localhost:8090/api",
      user: {
        mobile: "",
        password: ""
      }
    };
  },
  methods: {
    register: function() {
      this.$http.post(this.apiUrl + "/register", this.user).then(
        resp => {
          let data = resp.body;
          if (data.code == 200) {
            router.push("/");
          } else {
            console.log(data);
          }
        },
        err => {}
      );
    }
  }
};
</script>
