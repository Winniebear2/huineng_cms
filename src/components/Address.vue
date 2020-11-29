<template>
<div>
    <div style="text-align:left;margin-bottom:30px">
        <el-button type="primary" @click="addData()">添加</el-button>
    </div>
    <div style="text-align:left;font-size:20px">总公司</div>
    <el-table
    :data="tableData"
    style="width: 100%"
    :default-sort = "{prop: 'date', order: 'descending'}"
    v-loading='loading'
    >
        <el-table-column
        prop="create_time"
        label="创建日期"
        sortable
        >
        </el-table-column>
        <el-table-column label="公司地址"
        prop='adress'>
        </el-table-column>
        <el-table-column
        prop="number"
        label="公司电话"
        >
        </el-table-column>
        <el-table-column
        prop="email"
        label="公司邮箱"
        >
        </el-table-column>
        <el-table-column
        label="操作">
        <template slot-scope="data">
            <el-button @click="handleClick(data.row)" type="primary" icon="el-icon-edit"></el-button>
            <!-- <el-button type="text" size="small">编辑</el-button> -->
            <el-button type="danger" icon="el-icon-delete" @click="deleteItem(data.row.company_id)"></el-button>
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
    <div style="text-align:left;font-size:20px">分公司</div>
    <el-table
    :data="tableData2"
    style="width: 100%"
    :default-sort = "{prop: 'date', order: 'descending'}"
    v-loading='loading'
    >
        <el-table-column
        prop="create_time"
        label="创建日期"
        sortable
        >
        </el-table-column>
        <el-table-column label="公司地址"
        prop='adress'>
        </el-table-column>
        <el-table-column
        prop="number"
        label="公司电话"
        >
        </el-table-column>
        <el-table-column
        prop="email"
        label="公司邮箱"
        >
        </el-table-column>
        <el-table-column
        label="操作">
        <template slot-scope="data">
            <el-button @click="handleClick(data.row)" type="primary" icon="el-icon-edit"></el-button>
            <!-- <el-button type="text" size="small">编辑</el-button> -->
            <el-button type="danger" icon="el-icon-delete" @click="deleteItem(data.row.company_id)"></el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-pagination
    :current-page="currentPage2"
    :page-size="pageSize2"
    layout="total, prev, pager, next, jumper"
    :total="total2"
    @current-change="handleCurrentChange2">
</el-pagination>
    <el-dialog title="信息详情" :visible.sync='dialogFormVisibale' @closed="closed()">
        <el-form :model="dialogFormData"  label-width="100px" :rules="rules">
            <el-form-item label='公司地址' prop='adress'>
                <el-input v-model="dialogFormData.adress"></el-input>
            </el-form-item>
            <el-form-item label='公司电话' prop='number'>
                <el-input v-model="dialogFormData.number"></el-input>
            </el-form-item>
            <el-form-item label='公司邮箱' prop='email'>
                <el-input v-model="dialogFormData.email"></el-input>
            </el-form-item>
            <el-form-item label='公司类型' style="text-align:left">
                <el-radio v-model="dialogFormData.is_headquarters" label=1>总公司</el-radio>
                <el-radio v-model="dialogFormData.is_headquarters" label=2>分公司</el-radio>
            </el-form-item>
            <el-form-item label='地理位置' v-if="mapV">
                <div style="text-align:left;color:red">(请点击地图以标记位置)</div>
                <el-input v-model="see" :disabled=true style="margin-bottom:20px"></el-input>
                <el-amap
                    :center='center'
                    :zoom ='zoom'
                    class="amap"
                    :events="events"
                ><el-amap-marker vid="Marker" :position="Marker.position" :visible="true" ></el-amap-marker>
                </el-amap>
                
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibale=false" >取 消</el-button>
            <el-button type="primary" v-if="dialogFlag=='update'" @click="updateData(dialogFormData.company_id)">确 定</el-button>
            <el-button type="primary" @click="insertData()" v-if="dialogFlag=='add'">增 加</el-button>
        </span>
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
        let self = this;
        return {
          see:"",
          loading:true,
          zoom:15,
        //   longitude:"119.30536",
        //   latitude:"26.11798",
          center:[119.30536,26.11798],
          district:"",
          lng:"",
          lat:"",
          tableData:[],
          tableData2:[],
          Marker:{
              position:[]
          },
          mapV:false,
          dialogFormData:{},
          dialogFormVisibale:false,
          dialogFlag:"update",
          currentPage: 1,
          pageSize: 10,
          total:1,
          currentPage2:1,
          total2:1,
          pageSize2:10,
          rules:{
              adress:[{required:true,message:"地址不可为空",trigger:'blur'}],
              number:[{required:true,message:"联系电话不可为空",trigger:'blur'}],
              email:[{required:true,message:"邮箱不可为空",trigger:'blur'}],
          },
          events:{
              click(e){
                    let {lng,lat} = e.lnglat
                    self.lng = lng
                    self.lat = lat
                //   console.log(self.longitude);   
                    self.Marker.position=[]
                    self.dialogFormData.longitude=e.lnglat.lng;
                    self.dialogFormData.latitude=e.lnglat.lat;
                    self.Marker.position.push(e.lnglat.lng)
                    self.Marker.position.push(e.lnglat.lat)
                  var geocoder = new AMap.Geocoder({
                      radius:1000,
                      extensions:'all'
                  });
                  geocoder.getAddress([e.lnglat.lng,e.lnglat.lat],(status,result)=>{
                      if(status === 'complete' && result.info==='OK'){
                      if(result && result.regeocode){
                          self.see = result.regeocode.formattedAddress;
                          self.$nextTick();
                      }
                      }
                      else{
                          alert('shibai')
                      }
                  })
              }
              
          }
        }
      },
      methods:{
          //总公司表
          getTableData(){
              this.loading = true
              let fd = new FormData
              fd.append('per_page',this.pageSize)
              fd.append('current_page',this.currentPage)
              fd.append('is_headquarters',1)
              this.$axios.post(`${this.baseURL}/Company/finds`,fd).then(res=>{
                  this.tableData = res.data.data.data
                  this.currentPage = res.data.data.current_page
                  this.pageSize = Number(res.data.data.per_page)
                  this.total = res.data.data.total
                  this.loading = false
              }).catch(()=>{
                  this.loading=false
                  this.$notify({
                      title:'失败',
                      type:'error',
                      message:'请求超时'
                  })
              })
          },
          //分公司表
          getTableData2(){
              this.loading = true
              let fd = new FormData
              fd.append('per_page',this.pageSize)
              fd.append('current_page',this.currentPage)
              fd.append('is_headquarters',2)
              this.$axios.post(`${this.baseURL}/Company/finds`,fd).then(res=>{
                  this.tableData2 = res.data.data.data
                  this.currentPage2 = res.data.data.current_page
                  this.pageSize2 = Number(res.data.data.per_page)
                  this.total2 = res.data.data.total
                  this.loading = false
              }).catch(()=>{
                  this.loading=false
                  this.$notify({
                      title:'失败',
                      type:'error',
                      message:'请求超时'
                  })
              })
          },
          closed(){
              //通过v-if让dialog关闭后组件刷新
              this.mapV=false
              this.Marker.position=[]
          },
          handleCurrentChange(val){
              this.currentPage = val
              this.getTableData()
          },
          handleCurrentChange2(val){
              this.currentPage2 = val
              this.getTableData2()
          },
          handleClick(data){
              this.$forceUpdate()
            //   console.log(data);
              this.dialogFormData = JSON.parse(JSON.stringify(data));//深拷贝 防止表格数据被影响
              this.dialogFormData.is_headquarters = String(this.dialogFormData.is_headquarters)
              this.Marker.position.push(this.dialogFormData.longitude)
              this.Marker.position.push(this.dialogFormData.latitude)
              this.center = this.Marker.position
              this.mapV=true
            //   console.log(this.dialogFormData);
              this.dialogFormVisibale = true;
              this.dialogFlag = 'update'
          },
          addData(){
              
              this.dialogFlag = "add"
              this.dialogFormData = {adress:"",number:"",email:"",is_headquarters:"",longitude:0,latitude:0}       
              this.Marker.position=[113.39030891534425,22.527302844871176]
              this.center = this.Marker.position
              this.mapV=true
              this.dialogFormVisibale = true
          },
          insertData(){
            //   console.log(this.dialogFormData.longitude);
             if(!this.dialogFormData.adress||!this.dialogFormData.number||!this.dialogFormData.email||!this.dialogFormData.is_headquarters||!this.dialogFormData.longitude||!this.dialogFormData.latitude){
                this.$message.error('输入内容不完整')
              }
              else{
                this.$confirm('是否确定提交?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    console.log(this.dialogFormData.longitude);
                    // this.tableData.unshift(this.dialogFormData)
                    // console.log(this.tableData); 
                    let fd = new FormData
                    fd.append('adress',this.dialogFormData.adress)
                    fd.append('number',this.dialogFormData.number)
                    fd.append('email',this.dialogFormData.email)
                    fd.append('is_headquarters',Number(this.dialogFormData.is_headquarters))
                    fd.append('longitude',String(this.dialogFormData.longitude))
                    fd.append('latitude',String(this.dialogFormData.latitude))
                    this.$axios.post(`${this.baseURL}/Company/create`,fd).then(res=>{
                        // console.log(res.data);
                        if(res.data.msg=='ok'){
                            this.getTableData()
                            this.getTableData2()
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
                if(!this.dialogFormData.adress||!this.dialogFormData.number||!this.dialogFormData.email||!this.dialogFormData.is_headquarters||!this.dialogFormData.longitude||!this.dialogFormData.latitude){
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
                    // console.log(this.dialogFormData.longitude);
                    let fd = new FormData
                    fd.append('company_id',data)
                    fd.append('adress',this.dialogFormData.adress)
                    fd.append('number',this.dialogFormData.number)
                    fd.append('email',this.dialogFormData.email)
                    fd.append('is_headquarters',Number(this.dialogFormData.is_headquarters))
                    fd.append('longitude',String(this.dialogFormData.longitude))
                    fd.append('latitude',String(this.dialogFormData.latitude))
                    this.$axios.post(`${this.baseURL}/Company/edit`,fd).then(res=>{
                        // console.log(data);
                        if(res.data.msg=='ok'){
                            this.getTableData()
                            this.getTableData2()
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
                console.log(data);
                this.$confirm('是否确定删除?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'error'
                }).then(()=>{
                    let fd = new FormData
                    fd.append('company_id',data)
                    this.$axios.post(`${this.baseURL}/Company/delete`,fd).then(res=>{
                        console.log(res.data);
                        if(res.data.msg=='ok'){
                            this.getTableData()
                            this.getTableData2()
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
        },
        mounted(){
            this.getTableData()
            this.getTableData2()
        }
    }
</script>

<style scoped>
.amap{
    height:300px
}
</style>