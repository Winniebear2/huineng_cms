<template>
    <el-container>
    <el-header class="header">徽能新邦
        <!-- <div class="changepw" >
            <div @click="changepw()" class="pw">修改密码</div>
            <div class="signout" @click="signout()">退出登录</div>
        </div> -->
        <div class="changepw">
            <el-dropdown style="color:#fff;" trigger="click" @command='handleCommand'>
                <span class="select">{{username}}</span><i class="el-icon-user"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="pw">修改密码</el-dropdown-item>
                    <el-dropdown-item command="out">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-header>
        <el-container>
            <el-aside width="200px" class="sidebar">
                <el-menu backgroundColor="#fff" text-color='black' class="menu" active-text-color="#33A72C" :router=routerMode default-active='News'>
                    <template v-for="item in items">
                        <template v-if="item.subs">
                            <el-submenu :key="item.index" :index="item.index">
                                <template slot="title">
                                    <i :class="item.icon"></i>
                                    <span slot="title">{{ item.title }}</span>
                                </template>
                                <template class="submenu">
                                    <el-menu-item v-for="(sub,i) in item.subs" :key="i" :index="sub.index" >
                                    <span>{{ sub.title }}</span>
                                </el-menu-item>
                                </template>
                            </el-submenu>
                        </template>
                        <template v-else>
                            <el-menu-item :index="item.index" :key="item.index">
                                <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                            </el-menu-item>
                        </template>
                    </template>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return{
            items:[
                {
                    title:"新闻动态",
                    index:"News",
                    icon:"el-icon-document"
                },
                {
                    title:"方案与案例",
                    index:"Project",
                    icon:"el-icon-s-claim"
                },
                {
                    title:"产品中心",
                    index:"Product",
                    icon:"el-icon-goods"
                },
                {
                    title:"留言板",
                    index:"Message",
                    icon:"el-icon-s-comment"
                },
                {
                    title:"荣誉资质",
                    index:"Honor",
                    icon:"el-icon-star-off",
                },
                {
                    title:"联系地址",
                    index:"Address",
                    icon:"el-icon-location"
                },
            ],
            routerMode:true,
            username:"",
        }
    },
    methods:{
        changepw(){
            this.$router.push('/Changepw')
        },
        signout(){
            sessionStorage.setItem('save_username',"")
            sessionStorage.setItem('save_account',"")
            sessionStorage.setItem('save_userid',"")
            this.$router.push('/Login')
        },
        handleCommand(command){
            if(command=="pw"){
                this.changepw()
            }
            else{
                this.signout()
            }
        }
    },
    mounted(){
        this.username=sessionStorage.save_useraccount
        console.log(this.username);
    }
}
</script>
<style scoped>
.el-container{
    min-height: 100%;
}
.header{
    background-color:rgb(144, 228, 138,.88);
    text-align: left;
    color: #ffffff;
    font-size:30px;
    line-height: 60px;
    font-weight: bold;
    letter-spacing:2px ;
    position: relative;
}
.sidebar{
    background-color:  #eef1f5;
    /* font-family: ; */
    font-size: 30px;
    text-align: left;
}
.el-submenu{
    text-align: left;
}
.test{
    min-height: 1000px;
}
.changepw{
    position: absolute;
    right: 10px;
    top: 0;
    /* line-height: 60px; */
    color: white;
    font-size: 20px;
    font-weight: 100;
    letter-spacing: 0;
   
    cursor: pointer;
}
.changepw .pw{
    margin-right:10px;
    display:inline-block;
    transition-duration: 0.3s;
}
.changepw .pw:hover{
    color:#33A72C;
}
.changepw .signout{
    display:inline-block;
    transition-duration: 0.3s;
}
.changepw .signout:hover{
    color: #33A72C ;
}
.select{
    color: #ffffff;
    display: inline-block;
    margin-right:5px;
}

</style>