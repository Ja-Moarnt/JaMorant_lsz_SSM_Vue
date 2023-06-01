<template>
  <div class="app-container">
    <!--查询表单-->
    <el-card class="operate-container" shadow="never">
    <el-form :inline="true" class="demo-form-inline">

      <!-- 司机 -->
      <el-form-item label="司机">
        <el-select
          v-model="searchObj.teacherId"
          placeholder="请选择司机">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="城市">
        <el-select
          v-model="searchObj.chengshiParentId"
          placeholder="请选择"
          @change="chengshiLevelOneChanged"
        >
          <el-option
            v-for="chenghsi in ChengshiList"
            :key="chenghsi.id"
            :label="chenghsi.title"
            :value="chenghsi.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="searchObj.chengshiId" placeholder="请选择">
          <el-option
            v-for="chengshi in ChengshiLevelTwoList"
            :key="chengshi.id"
            :label="chengshi.title"
            :value="chengshi.id"
          />
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    </el-card>

    <!-- 工具按钮 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="add()">添加</el-button>
      <el-button class="btn-add" @click="batchRemove()" >批量删除</el-button>
    </el-card>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="车牌号" width="100" align="center">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.carId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="司机" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.param.teacherName }}
        </template>
      </el-table-column>
      <el-table-column label="城市" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.param.Chengshi }}
        </template>
      </el-table-column>
      <el-table-column label="货柜号" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.guiId }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.carStatus === '0' ? 'warning' : 'success'">{{ scope.row.carStatus === '0' ? '未审核' : '已审核' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当前订单" width="200" align="center" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.param.OrderLiu== null" type="info">无订单</el-tag>
          <el-tag v-else>{{ scope.row.param.OrderLiu }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当前广告"  align="center" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.param.videoTitle== null" type="info">无广告</el-tag>
          <el-tag v-else type="success">{{ scope.row.param.videoTitle }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="210" align="center">
        <template slot-scope="scope">
          <router-link :to="'/vodcar/car/info/'+scope.row.id">
            <el-button type="text" icon="el-icon-edit" >修改</el-button>
          </router-link>
          <el-button type="text" icon="el-icon-delete" @click="removeById(scope.row.id)" >删除</el-button>
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
import carApi from '@/api/vod/car'
import teacherApi from '@/api/vod/teacher'
import chengshiApi from '@/api/thc/chengshi'
export default {

  data() {
    return {
      list: [], // 货物列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {
        chengshiId: ''// 解决查询表单无法选中二级类别
      }, // 查询条件
      teacherList: [], // 司机列表,
      ChengshiList: [], // 城市一级列表,
      ChengshiLevelTwoList: [], // 二级分类列表,
      multipleSelection: []// 批量删除选中的记录列表
    }
  },

  created() {
    this.fetchData()
    // 获取讲师列表
    this.initTeacherList()
    // 初始化分类列表
    this.initChengshiList()
  },

  methods: {
    //批量删除
    batchRemove() {
      //判断非空
      if(this.multipleSelection.length===0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将删除该商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var idList = []
        // [1,2,3]
        //遍历数组
        for(var i=0;i<this.multipleSelection.length;i++) {
          var obj = this.multipleSelection[i]
          var id = obj.id
          //放到数组
          idList.push(id)
        }
        //调用接口删除
        carApi.batchRemove(idList)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //刷新
            this.fetchData()
          })
      })
    },
    //复选框发生变化，调用方法，选中复选框行内容传递
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    fetchData() {
      carApi.getPageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.records
        console.log(this.list)
        this.total = response.data.totalCount
      })
    },

    initTeacherList() {
      teacherApi.list().then(response => {
        this.teacherList = response.data
      })
    },
    initChengshiList() {
      chengshiApi.getChildList(0).then(response => {
        this.ChengshiList = response.data
      })
    },

    chengshiLevelOneChanged(value) {
      chengshiApi.getChildList(value).then(response => {
        this.ChengshiLevelTwoList = response.data
        this.searchObj.chengshiId = ''
      })
    },

    add() {
      this.$router.push({ path: '/vodcar/car/info' })
    },

    // 每页记录数改变，size：回调参数，表示当前选中的“每页条数”
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },

    // 改变页码，page：回调参数，表示当前选中的“页码”
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },

    // 重置表单
    resetData() {
      this.searchObj = {}
      this.subjectLevelTwoList = [] // 二级分类列表
      this.fetchData()
    },

    // 根据id删除数据
    removeById(id) {
      this.$confirm('此操作将永久删除该课程，以及该课程下的章节和视频，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return carApi.removeById(id)
      }).then(response => {
        this.fetchData()
        this.$message.success(response.message)
      })
    }
  }
}
</script>
