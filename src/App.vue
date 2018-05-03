<template>
    <el-container id="app">
      <router-view/>
    </el-container>
</template>


<script>
import router from "./router";
import comm from "./js/commons";

export default {
  name: "App", //创建前
  beforeCreate: function() {
    // var token = sessionStorage.getItem("accessToken");
    // //判断是否登录
    // if (token == undefined || token == null) {
    //   router.push("/login");
    // } else {
    //   router.push({ path: "/layout/dashboard" });
    // }

    // let options = comm.getOptions();
    // JSON.stringify(options);
  }
};
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
}
#app {
  margin: 0px;
  padding: 0px;
}
</style>
