<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-title"></div>
            <div class="login-form">
                <el-form :model="loginForm" label-width ='0px' :rules='rules' ref="loginFormRef">
                    <el-form-item prop='username'>
                        <el-input placeholder="账号" v-model="loginForm.username" ></el-input>
                    </el-form-item>
                    <el-form-item prop='password'>
                        <el-input placeholder="密码" v-model="loginForm.password" type='password' v-on:keyup.enter.native="login"></el-input>
                    </el-form-item>
                    <div style="text-align:left">
                       <el-checkbox v-model="check">记住密码</el-checkbox> 
                    </div>
                    <el-form-item class="btn">
                        <el-button type='primary' @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    data(){
        return{
            //登录表单数据绑定
            loginForm:{
                username:'',
                password:'',
            },
            //表单验证规则
            rules:{
                username:[{required:true,message:'请输入用户名',trigger: 'blur'}],
                password:[{required:true,message:'请输入密码',trigger: 'blur'}]
            },
            check:false,
        }
    },
    //挂载
    mounted(){
        this.getCookie();
    },
    methods:{
        login(){
            this.$refs.loginFormRef.validate(valid =>{
                if(!valid) return;
                var fd = new FormData()
                    fd.append("user_account",this.loginForm.username)
                    fd.append("user_password",this.loginForm.password)
                this.$axios.post(`${this.baseURL}/User/login`,fd).then(res=>{
                    if(res.data.msg == "ok"){
                        this.$notify({
                                title: '成功',
                                message: '登录成功',
                                type: 'success'
                            })
                        window.sessionStorage.setItem('save_username',res.data.data.user_name);
                        console.log(res.data);
                        sessionStorage.setItem('save_userid',res.data.data.user_id);
                        sessionStorage.setItem('save_useraccount',this.loginForm.username)

                        if(this.check == true){
                            // console.log(this.loginForm.password);
                            this.setCookie(this.loginForm.username,this.loginForm.password,7);
                        }
                        else{
                            this.clearCookie();
                        }
                        this.$router.push('/News')
                    }
                    else{
                        this.$notify({
                                title: '失败',
                                message: '登陆失败',
                                type: 'error'
                            })
                    }
                })
            })          
        },
        //设置cookie
        setCookie(username, password, days) {
            var saveDays = new Date(); //获取时间
            saveDays.setTime(saveDays.getTime() + 24 * 60 * 60 * 1000 * days); //保存的天数
            //字符串拼接存入cookie
            window.document.cookie = "username" + "=" + username + ";path=/;expires=" + saveDays.toGMTString();
            window.document.cookie = "password" + "=" + password + ";path=/;expires=" + saveDays.toGMTString();
        },
        //获取cookie
        getCookie() {
            if (document.cookie.length > 0) {
                var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                for (var i = 0; i < arr.length; i++) { 
                    var arr2 = arr[i].split('='); //再次切割
                    if (arr2[0] == 'username') {
                        this.loginForm.username = arr2[1]; //拿到账号
                    } 
                    else if (arr2[0] == 'password') {
                        this.loginForm.password = arr2[1];//拿到密码
                    }
                }
            }
        },
        //清除cookie
        clearCookie(){
            this.setCookie("","",0);
        }
    }
}
</script>

<style scoped>
    .login-container{
        /* background-image: url(http://183.58.29.34:8081/img/background.jpg); */
        width: 100%;
        height: 100%;
        /* background-size: cover; */
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }
    .login-box{
        width: 300px;
        height: 250px;
        margin: 0 auto;
    }
    
    .login-title{
        margin-top: 0px;
        position: relative;
        font-weight: 600;
        text-align: center;
        font-size:29px;
        color: #0050b3;
        font-family: "Myriad Pro","Helvetica Neue",Arial,Helvetica,sans-serif;
    }
    .login-form{
        position: relative;
        margin-top: 50px;
    }
    .btn button{
        width: 100%;
        margin-top: 15px;
    }
</style>