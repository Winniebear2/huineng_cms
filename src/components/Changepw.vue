<template>
    <div class="form">
        <el-form :model="form" label-width="80px" :rules="rules">
            <el-form-item label="账号：">
                <el-input disabled=true v-model="form.account"></el-input>
            </el-form-item>
             <!-- <el-form-item label="用户名：" prop="user">
                <el-input  v-model="form.user" ></el-input>
            </el-form-item> -->
            <el-form-item label="新密码：" prop="password">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            form:{
                user:"",
                password:"",
                account:"",
                userid:"",
            },
            rules:{
                password:[{required:true,message:'请输入密码',trigger:'blur'}],
                user:[{required:true,message:'请输入用户名',trigger:'blur'}]

            }
        }
    },
    methods:{
        onSubmit(){
            if(!this.form.password){
                this.$message.error('密码不可为空')
            }
            if(!this.form.user){
                this.$message.error('用户名不可为空')
            }
            else{
                let fd = new FormData
                fd.append('user_id',this.form.userid)
                fd.append('user_name',this.form.user_name)
                fd.append('user_account',this.form.account)
                fd.append('user_password',this.form.password)
                this.$axios.post(`${this.baseURL}/User/edit`,fd).then(res=>{
                    if(res.data.msg=='ok'){
                        this.$notify({
                            title:"成功",
                            message:"修改成功",
                            type:"success"
                        })
                        sessionStorage.setItem('save_useraccount',this.form.account)
                        // sessionStorage.setItem('save_username',this.form.user)
                    }
                    else{
                        this.$notify({
                            title:"失败",
                            message:res.data.msg,
                            type:"error",
                        })
                    }
                })
            }
        }
    },
    mounted(){
        this.form.user = sessionStorage.save_username
        this.form.account = sessionStorage.save_useraccount
        this.form.userid = sessionStorage.save_userid
    }
}
</script>
<style scoped>
.form{
    width: 380px;
    margin: 30px auto;
}
</style>