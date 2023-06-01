<template>
  <div class="app-container">
    囤货场列表

    <!-- 工具按钮 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="add()" style="margin-left: 10px;">添加</el-button>
      <el-button class="btn-add" @click="batchRemove()">批量删除</el-button>
      <el-button class="btn-add" :disabled="loading" @click="updataAi()" style="float:right;background-color: green;color: #ffcc66">AI智能补货更新推荐模型
      </el-button>
<!--      <el-loading v-if="loading" fullscreen text="正在更新AI算法模板，请稍等..."></el-loading>-->
    </el-card>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"/>
      <el-table-column
        label="#"
        width="50"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="照片" width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="scope.row.title" width="100%">
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="名称" width="130"/>

      <el-table-column prop="phone" label="电话" width="120"/>
      <el-table-column label="城市" width="50">
        <template slot-scope="scope">
          {{ scope.row.param.chengshi }}
        </template>
      </el-table-column>
      <el-table-column label="详细地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="入驻时间" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="removeById(scope.row.id)">删除</el-button>
          <router-link :to="'/vod/teacher/edit/'+scope.row.id">
            <el-button type="text" size="mini">修改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    />

  </div>
</template>

<script>
//引入定义接口js文件
import tungyApi from '@/api/thc/tungy'
import { Loading, MessageBox } from 'element-ui';
export default {
  data() {  //初始值
    return {
      list: [], // 囤货场列表
      total: 0, // 总记录数
      page: 1, // 当前页码
      loading: false,
      limit: 10, // 每页记录数
      multipleSelection: []// 批量删除选中的记录列表

    }
  },
  created() { //页面渲染之前
    this.fetchData()
  },
  methods: { //具体方法
    updataAi() {
      // 使用 MessageBox.confirm 代替 this.$confirm
      MessageBox.confirm('此操作将更新囤货场AI智能推荐模型（近一周订单重新训练）, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 使用 Loading.service 代替 this.$loading
        const loadingInstance = Loading.service({
          lock: true,
          text: '更新中，请稍等...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        tungyApi.aiGoods()
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '更新成功!'
            });
            //刷新
            this.fetchData();
          })
          .finally(() => {
            this.$nextTick(() => {
              // 关闭 loading
              loadingInstance.close();
            });
          });
      })
    },

    //批量删除
    batchRemove() {
      //判断非空
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将删除该囤货场信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var idList = []
        // [1,2,3]
        //遍历数组
        for (var i = 0; i < this.multipleSelection.length; i++) {
          var obj = this.multipleSelection[i]
          var id = obj.id
          //放到数组
          idList.push(id)
        }
        //调用接口删除
        tungyApi.batchRemove(idList)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            //刷新
            this.fetchData()
          })
      })
    },
    //复选框发生变化，调用方法，选中复选框行内容传递
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    //跳转到添加表单页面
    add() {
      this.$router.push({ path: '/vod/teacher/create' })
    },
    fetchData() {
      //ajax
      tungyApi.getChildList(this.page, this.limit)
        .then(response => {
          this.list = response.data.records
          this.total = response.data.total
        })
    },
    //改变每页显示记录数
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },
    //改变页码数
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },
    //清空
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    //讲师删除
    removeById(id) {
      this.$confirm('此操作将删除该囤货场信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用接口删除
        tungyApi.removeTeacherId(id)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            //刷新
            this.fetchData()
          })
      })
    }
  }
}
</script>
