<template>
<div>
    <div style="text-align:left;margin-bottom:30px">
        <el-button type="primary" @click="addData()">添加</el-button>
    </div>
    <el-table
    :data="tableData"
    style="width: 100%"
    :default-sort = "{prop: 'date', order: 'descending'}"
    v-loading ='loading'>
        <el-table-column
        prop="create_time"
        label="创建日期"
        sortable
        >
        </el-table-column>
        <el-table-column
        prop="title"
        label="标题"
        >
        </el-table-column>
        <el-table-column label="图片">
            <template slot-scope="scope">
                <div @click="handlePictureCardPreview(scope.row.picture_url)" style="cursor:pointer">
                   <img :src="scope.row.picture_url" style="height:80px"> 
                </div>
                
            </template>
        </el-table-column>
        <el-table-column
        label="操作">
        <template slot-scope="data">
            <el-button @click="handleClick(data.row)" type="primary" icon="el-icon-edit"></el-button>
            <!-- <el-button type="text" size="small">编辑</el-button> -->
            <el-button type="danger" icon="el-icon-delete" @click="deleteItem(data.row.honor_id)"></el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-pagination
    :current-page="currentPage"
    :page-size="pageSize"
    layout="total, prev, pager, next, jumper"
    :total="total"
    @current-change="handleCurrentChange">
</el-pagination>
    <el-dialog title="信息详情" :visible.sync='dialogFormVisibale'>
        <el-form :model="dialogFormData"  label-width="100px" :rules="rules">
            <el-form-item label='标题' prop='title'>
                <el-input v-model="dialogFormData.title"></el-input>
            </el-form-item>
            <!-- <el-form-item label='日期' style="text-align:left">
                <el-date-picker
                    v-model="dialogFormData.date"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <div id="div1"></div>
            </el-form-item> -->
            <el-form-item>
                <upload @imgUrl="getImageUrl" :imgSrc="dialogFormData.picture_url" v-if="dialogFormVisibale"></upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibale=false" >取 消</el-button>
            <el-button type="primary" v-if="dialogFlag=='update'" @click="updateData(dialogFormData.honor_id)">确 定</el-button>
            <el-button type="primary" @click="insertData()" v-if="dialogFlag=='add'">增 加</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible2">
        <img width="100%" :src="fileUrl" alt="">
    </el-dialog>
</div>
</template>

<script>
    import upload from '../components/upload.vue'
    export default {
        components:{
            upload,
        },
        data() {
        return {
          tableData: [],
          dialogFormData:{},
          dialogFormVisibale:false,
          dialogVisible2:false,
          dialogFlag:"update",
          currentPage: 1,
          pageSize: 8,
          total:1,
          fileUrl:"",
          rules:{
              title:[{required:true,message:"标题不可为空",trigger:'blur'}],
            //   date:[{required:true,message:"时间",trigger:'blur'}],
            //   content:[{required:true,message:"内容不可为空",trigger:'blur'}],
          },
          loading:true
        }
      },
      methods:{
          getTableData(){
              this.loading=true
              let fd = new FormData
              fd.append('per_page',this.pageSize)
              fd.append('current_page',this.currentPage)
              this.$axios.post(`${this.baseURL}/Honor/finds`,fd).then(res=>{
                  console.log(res.data.data.data);
                  this.tableData = res.data.data.data
                  this.currentPage = res.data.data.current_page
                  this.pageSize = Number(res.data.data.per_page)
                  this.total = res.data.data.total
                  this.loading = false
                //   console.log(this.pageSize);
              }).catch(()=>{
                  this.loading=false
                  this.$notify({
                      title:'失败',
                      type:'error',
                      message:'请求超时'
                  })
              })
          },
          getImageUrl(data){
              this.dialogFormData.picture_url = data
              console.log(this.dialogFormData.picture_url);
          },
          handleCurrentChange(val){
              this.currentPage = val
              this.getTableData()
          },
          handleClick(data){
              this.$forceUpdate()
            //   console.log(data);
              this.dialogFormData = JSON.parse(JSON.stringify(data));//深拷贝 防止表格数据被影响
              this.dialogFormVisibale = true;
              this.dialogFlag = 'update'
          },
          addData(){
              this.dialogFlag = "add"
              this.dialogFormData = {title:"",picture_url:""}
              this.dialogFormVisibale = true
          },
          insertData(){
              if(this.dialogFormData.title==""||this.dialogFormData.picture_url==""){
                this.$message.error('输入内容不完整')
              }
              else{
                this.$confirm('是否确定修改?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    // console.log(this.dialogFormData);
                    // this.tableData.unshift(this.dialogFormData)
                    // console.log(this.tableData); 
                    let fd = new FormData
                    fd.append('title',this.dialogFormData.title)
                    fd.append('picture_url',this.dialogFormData.picture_url)
                    this.$axios.post(`${this.baseURL}/Honor/create`,fd).then(res=>{
                        // console.log(res.data);
                        if(res.data.msg=='ok'){
                            this.getTableData()
                            this.$notify({
                                title: '成功',
                                message: '新增成功',
                                type: 'success'
                            })
                        }
                        else{
                            this.$notify({
                                title: '失败',
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                    this.dialogFormVisibale = false
                })  
                }  
            },
            updateData(data){
                // this.dialogFormData=""
                if(this.dialogFormData.title==""||this.dialogFormData.picture_url==""){
                this.$message.error('输入内容不完整')
                }
                else{
                    this.$confirm('是否确定修改?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    // this.tableData.push(this.dialogFormData)
                    // console.log(this.tableData); 
                    console.log(this.dialogFormData);
                    let fd = new FormData
                    fd.append('honor_id',data)
                    fd.append('title',this.dialogFormData.title)
                    fd.append('picture_url',this.dialogFormData.picture_url)
                    this.$axios.post(`${this.baseURL}/Honor/edit`,fd).then(res=>{
                        console.log(data);
                        if(res.data.msg=='ok'){
                            this.getTableData()
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success'
                            })
                        }
                        else{
                            this.$notify({
                                title: '失败',
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                    this.dialogFormVisibale = false
                })  
                }  
            },
            deleteItem(data){
                // console.log(data);
                this.$confirm('是否确定删除?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'error'
                }).then(()=>{
                    let fd = new FormData
                    fd.append('honor_id',data)
                    this.$axios.post(`${this.baseURL}/Honor/delete`,fd).then(res=>{
                        console.log(res.data);
                        if(res.data.msg=='ok'){
                            this.getTableData()
                            this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            })
                        }
                        else{
                            this.$notify({
                                title: '失败',
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                }) 
            },
            handlePictureCardPreview(data){
                this.dialogVisible2 = true
                this.fileUrl = data
            },
        },
        mounted(){
            // this.editor()
            this.getTableData()
        }
    }
</script>

<style scoped>

</style>