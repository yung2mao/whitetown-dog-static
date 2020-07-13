<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="5">
          <el-input
            placeholder="请输入角色名称"
            prefix-icon="el-icon-search"
            v-model="roleName">
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            v-model="timeScope"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
            :picker-options="pickerOptions"
            style="width: 240px">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="layui-btn-group">
            <button type="button" class="layui-btn" @click="">搜索</button>
            <button type="button" class="layui-btn" @click="addRoleDialog = true">添加</button>
            <button type="button" class="layui-btn">导出</button>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="roleList"
        style="width: 100%"
        height="600"
        empty-text="当前项没有数据"
        :header-cell-style="{background: '#eef1f6',color:'#606266',textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          fixed
          prop="name"
          label="角色名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="description"
          label="角色描述"
          width="150">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="角色序号"
          width="120">
        </el-table-column>
        <el-table-column
          label="角色状态"
          width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.roleStatus==0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="260">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="260">
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-primary"
                    @click="">编辑
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-danger"
                    @click="">删除
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-normal"
                    @click="">查看用户
            </button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加菜单"
      :visible.sync="addRoleDialog"
      width="30%"
      center
      @close="addRoleReset()">
      <el-form :model="addRoleInfo" :rules="addRoleRules" ref="addRoleRef" label-width="70px"
               class="demo-ruleForm">
        <el-form-item label="名 称: " prop="roleName">
          <el-input v-model="addRoleInfo.roleName" placeholder="请输入英文名称"></el-input>
        </el-form-item>
        <el-form-item label="描 述: " prop="description">
          <el-input v-model="addRoleInfo.description" placeholder="请输入中文描述"></el-input>
        </el-form-item>
        <el-form-item label="序 号: " prop="sort">
          <el-input v-model="addRoleInfo.sort" placeholder="请输入数字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole()">确 定</el-button>
        <el-button @click="addRoleDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "role",
        data() {
            return {
                roleName: '',
                roleList: [],
                timeScope: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                },
                addRoleInfo: {},
                addRoleDialog: false,
                addRoleRules: {
                    roleName: [
                        {
                            required: true,
                            message: '请输入角色名称',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 20,
                            message: '角色名称长度3-20',
                            trigger: 'blur'
                        }
                    ],
                    description: [
                        {
                            required: true,
                            message: '请输入角色描述',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 20,
                            message: '角色描述长度3-20',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created() {
            this.initRoleList()
        },
        methods: {
            async initRoleList() {
                const {data: res} = await this.$http.get('/role/getAll')
                if(res.status != 200){
                    return console.log(res.statusName)
                }
                this.roleList = res.data
            },
            //添加用户对话框关闭
            addRoleReset () {
                this.$refs.addRoleRef.resetFields()
            },
            addRole() {
                this.$refs.addRoleRef.validate(valid => {
                    if(!valid){
                        return
                    }else {
                        var regex = /^\d+$/
                        if(!regex.test(this.addRoleInfo.sort)){
                            return layer.msg("序号输入格式错误", {
                                offset: '15px',
                                icon: 5,
                                time: 1000
                            })
                        }
                        const that = this
                        this.$http.post('/role/add', this.addRoleInfo).then(function (result) {
                            const res = result.data
                            if(res.status == 200){
                                layer.msg('添加成功', {
                                    offset: '15px',
                                    icon: 1,
                                    time: 1000
                                }, function () {
                                    that.addRoleDialog = false
                                    that.initRoleList()
                                })
                            }else {
                                layer.msg(res.statusName, {
                                    offset: '15px',
                                    icon: 5,
                                    time: 1000
                                })
                            }
                        })
                    }

                })
            }
        }
    }
</script>

<style lang="less" scoped>
  .el-table {
    align-items: center;
  }
</style>
