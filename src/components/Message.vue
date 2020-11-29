<template>
<div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading ='loading'>
      <el-table-column
        prop="create_time"
        label="创建日期"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户姓名"
        >
      </el-table-column>
      <el-table-column
        prop="content"
        label="留言内容">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="data">
            <el-button type="text" style="margin-right:15px" @click="visit(data.row)">查看</el-button>
            <el-popconfirm title="确定删除？" @onConfirm="handleClick(data.row.message_id)">
                <el-button  type="text" slot="reference">删除</el-button> 
            </el-popconfirm>
            <!-- <el-button type="text" size="small">编辑</el-button> -->
            <!-- <el-button type="danger" icon="el-icon-delete"></el-button> -->
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
    <el-dialog title="信息详情" :visible.sync='dialogFormVisibale' width='700px'>
        <div style="width:550px;margin:0 auto">
           <el-form :model="dialogFormData"  label-width="100px">
            <el-form-item label='用户姓名：'>
                <el-input v-model="dialogFormData.name"></el-input>
            </el-form-item>
            <el-form-item label='提交日期：'>
                <el-input v-model="dialogFormData.create_time"></el-input>
            </el-form-item>
            <el-form-item label='联系电话：'>
                <el-input v-model="dialogFormData.number"></el-input>
            </el-form-item>
            <el-form-item label='邮箱：'>
                <el-input v-model="dialogFormData.email"></el-input>
            </el-form-item>
            <el-form-item label='邮政编码：'>
                <el-input v-model="dialogFormData.postal_code"></el-input>
            </el-form-item>
            <el-form-item label='通讯地址：'>
                <el-input v-model="dialogFormData.adress"></el-input>
            </el-form-item>
            <el-form-item label='留言内容：'>
                <el-input type='textarea' v-model="dialogFormData.content" :rows="5"></el-input>
            </el-form-item>
        </el-form>
        </div>
    </el-dialog>
</div>
</template>


<script>
export default {
    data() {
        return {
            // tableData: [{
            //     date: '2016-05-02',
            //     name: '王小虎',
            //     content: '上海市普陀区金沙江路 1518 弄'
            // }, {
            //     date: '2016-05-04',
            //     name: '王小虎',
            //     content: '上海市普陀区金沙江路 1517 弄'
            // }, {
            //     date: '2016-05-01',
            //     name: '王小虎',
            //     content: '上海市普陀区金沙江路 1519 弄'
            // }, {
            //     date: '2016-05-03',
            //     name: '王小虎',
            //     content: '上海市普陀区金沙江路 1516 弄'
            // }],
            loading:true,
            tableData:[],
            dialogFormData:[],
            dialogFormVisibale:false,
            currentPage: 1,
            pageSize: 15,
            total:1,
        }
    },
    methods:{
        handleClick(data){
            // console.log(data);
            let fd = new FormData
                fd.append('message_id',data)
                this.$axios.post(`${this.baseURL}/Message/delete`,fd).then(res=>{
                // console.log(res.data);
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

        },
        visit(data){
            this.dialogFormData = data
            this.dialogFormVisibale=true
        },
        handleCurrentChange(val){
              this.currentPage = val
              this.getTableData()
        },
        getTableData(){
              let fd = new FormData
              fd.append('per_page',this.pageSize)
              fd.append('current_page',this.currentPage)
              this.$axios.post(`${this.baseURL}/Message/finds`,fd).then(res=>{
                  console.log(res.data.data.data);
                  this.tableData = res.data.data.data
                  this.currentPage = res.data.data.current_page
                  this.pageSize = Number(res.data.data.per_page)
                  this.total = res.data.data.total
                  this.loading = false
                //   console.log(this.pageSize);
              })
              .catch(()=>{
                  this.loading=false
                  this.$notify({
                      title:'失败',
                      type:'error',
                      message:'请求超时'
                  })
              })
        },
    },
    mounted(){
        this.getTableData()
    }
}
  </script>