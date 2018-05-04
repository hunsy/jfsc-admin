
import router from '../router'
import Vue from 'vue'
import VueResource from 'vue-resource';
import { Notification } from 'element-ui';

export default {
    domain: "http://localhost:8091",
    getOptions() {
        let token = sessionStorage.getItem("accessToken");
        let options = {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        }
        return options;
    },
    doGet(path, options, cb) {
        var options = options || {};
        Vue.http.get(this.domain + path, options)
            .then(resp => {
                let body = resp.body;
                if (body.code == 200 && body.data != null) {
                    cb(body.data);
                } else {
                    this.showErr(body.msg);
                }
            }, resp => {
                if (resp.status == 403) {
                    this.logout();
                }
            })
    },
    doPost(path, body, options, cb) {
        Vue.http.post(this.domain + path, body, options)
            .then(resp => {
                let body = resp.body;
                if (body.code == 200) {
                    cb();
                } else {
                    this.showErr(body.msg);
                }
            }, resp => {
                if (resp.status == 403) {
                    this.logout();
                }
            })
    },
    doPut(path, body, options, cb) {
        Vue.http.put(this.domain + path, body, options)
            .then(resp => {
                let body = resp.body;
                if (body.code == 200) {
                    cb();
                } else {
                    this.showErr(body.msg);
                }
            }, resp => {
                if (resp.status == 403) {
                    this.logout();
                }
            })
    },
    doDelete(path, options, cb) {
        Vue.http.delete(this.domain + path, options)
            .then(resp => {
                let body = resp.body;
                if (body.code == 200) {
                    cb();
                } else {
                    this.showErr(body.msg);
                }
            }, resp => {
                if (resp.status == 403) {
                    this.logout();
                }
            })
    },
    doLogin(user) {
        Vue.http.post(this.domain + "/login", user)
            .then(resp => {
                let body = resp.body;
                console.log(JSON.stringify(body));
                if (body.code == 200 && body.data != null) {
                    var token = body.data.token;
                    sessionStorage.setItem("accessToken", token);
                    router.push("/layout/dashboard");
                } else {
                    this.showErr(body.msg);
                }
            }, resp => {

            });
    },
    doRegister(user, cb) {
        Vue.http.post(this.domain + "/api/register", user)
            .then(resp => {
                let body = resp.body;
                if (body.code == 200) {
                    cb();
                } else {
                    this.showErr(body.msg);
                }
            }, resp => {

            });
    },
    //登出
    logout() {
        console.log("logout");
        //清空缓存
        sessionStorage.clear();
        router.push("/login");
    },
    showErr(msg) {
        alert(msg);
        // this.$notify.error({
        //     title: '错误',
        //     message: msg
        // });
    }

}