let app = new Vue({
    el: '#app',
    data: {
        form: {
            username: '',
            password: '',
            remember: false,
            code: '',
        },
    },
    created() {
        if (window.localStorage.getItem("info") != null) {
            //如果浏览器localStorage中储存了用户信息，就先清空浏览器localStorage
            window.localStorage.removeItem("info");
        }
    },
    mounted() {
        this.$refs.loader.style.display = 'none';
    },
    methods: {
        _notify(message, type) {
            this.$message({
                message: message,
                type: type
            })
        },

        //登录
        login(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.$http.post(api.login, this.form).then(response => {
                        if (response.body.code == 200) {
                            //获取UserInfo
                            this.$http.get(api.info).then(result => {
                                //将UserInfo数据存储到浏览器的localStorage中
                                window.localStorage.setItem("info", JSON.stringify(result.body.data));
                                if (result.body.code == 200 && window.localStorage.getItem("info") != null) {
                                    window.location.href = "/";
                                } else {
                                    this._notify('获取用户信息失败', "error")
                                }
                            });
                        } else {
                            this._notify(response.body.msg, 'error');
                        }
                    })
                } else {
                    return false;
                }
            })
        },
    }

})