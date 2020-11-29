<template> 
<div>
    <el-upload
    action=""
    class="avatar-uploader"
    :http-request='httpRequest'
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    >
    <img :src="fileUrl" alt="" v-if="fileUrl">
    <i class="el-icon-plus avatar-uploader-icon"></i>
    <!-- <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="fileUrl" alt="">
    </el-dialog> -->
    </el-upload>
    </div>
</template>

<script>
import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
export default {
    props:{
        imgSrc:String
    },
    data(){
        return{
            //oss相关
            ossTokenData:{
                accessKeyId:"",
                policy:"",
                signature:"",
                host:"https://s-p-internet.oss-cn-shenzhen.aliyuncs.com",
            },
            imageUrl:"",
            fileUrl:"",
            dialogVisible:false,
        }
    },
    methods:{
        beforeAvatarUpload(file) {
           const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if(!(isJPG || isPNG)){
                this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                return false
            }
                return (isJPG || isPNG) && isLt2M;
        },
        // handlePictureCardPreview(){
        //     this.dialogVisible = true
        // },
        
        //el-upload自定义http请求
        httpRequest(item){
            console.log(item);
            let fd = new FormData()
            let key = item.file.uid
            fd.append('key',key)//以文件uid作为上传oss的唯一路径
            fd.append('file',item.file)
            fd.append('OSSAccessKeyId',this.ossTokenData.accessKeyId)
            fd.append('policy',this.ossTokenData.policy)
            fd.append('signature',this.ossTokenData.signature)
            fd.append('success_action_status','200')
            fd.append('name',item.file.name)
            console.log(fd);
            axios({
                url:this.ossTokenData.host,
                method:'POST',
                data:fd,
                processData:false,
                contentType:false,
                cache:false,
            }).then((res)=>{
                // console.log(res);
                this.fileUrl = this.ossTokenData.host+'/'+key//拼接获得上传后的文件地址
                // console.log(this.fileUrl);
                this.$notify({
                    title: '成功',
                    message: '上传成功',
                    type: 'success'
                })
                this.$emit('imgUrl',this.fileUrl)
            })
            .catch(err=>{
                console.log('x');
                console.log(err);
                this.$notify({
                    title: '失败',
                    message: '上传失败',
                    type: 'error'
                });
            })

        }
    },
    mounted(){
        console.log(this.imgSrc);
        if(this.imgSrc){
            this.fileUrl =this.imgSrc
        }
    }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    max-width: 400px;
    max-height: 200px;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader .el-upload img{
    width: 100%;
    height: 100%;
}
</style>
<style scoped>
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 400px;
    height: 200px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    /* width: 178px; */
    /* height: 178px; */
    display: block;
}

</style>