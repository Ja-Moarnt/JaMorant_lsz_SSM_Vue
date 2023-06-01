<template>
  <div class="app-container">
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        label="序号"
        width="60"
        align="center"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="cover" label="商品图" width="160">
        <template slot-scope="scope">
          <img :src="scope.row.cover" alt="scope.row.title" width="100%">
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名"/>
      <el-table-column label="单价(元)" width="100" align="center">
        <template slot-scope="scope">
          <!-- {{ typeof '0' }}  {{ typeof 0 }} {{ '0' == 0 }} -->
          <!-- {{ typeof scope.row.price }}
          {{ typeof Number(scope.row.price) }}
          {{ typeof Number(scope.row.price).toFixed(2) }} -->

          <el-tag v-if="Number(scope.row.price) === 0" type="success">免费</el-tag>

          <!-- 前端解决保留两位小数的问题 -->
          <!-- <el-tag v-else>{{ Number(scope.row.price).toFixed(2) }}</el-tag> -->

          <!-- 后端解决保留两位小数的问题，前端不用处理 -->
          <el-tag v-else>{{ scope.row.price }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="购买数量" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag >{{ scope.row.buyCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="allprcie" label="总价" width="156">
        <template slot-scope="scope">
          <el-tag >{{ scope.row.buyCount * scope.row.price}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="caeateTime" label="添加商品时间" width="260">
      <template slot-scope="scope">
        {{ scope.row.createTime}}
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
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />
  </div>
</template>
<script>
import orderInfoApi from '@/api/order/orderinfo'

export default {
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {} // 查询表单对象
    }
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData()
  },
  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    console.log('list mounted......')
  },
  methods: {
    // 当页码发生改变的时候
    changeSize(size) {
      this.limit = size
      this.fetchData(1)
    },
    // 加载banner列表数据
    fetchData(page = 1) {
      // 异步获取远程数据（ajax）
      this.page = page
      orderInfoApi.getOderDetail(this.$route.params.id).then(
        response => {
          this.list = response.data
          // 数据加载并绑定成功
          this.listLoading = false
        }
      )
    },
    // 重置查询表单
    resetData() {
      console.log('重置查询表单')
      this.searchObj = {}
      this.fetchData()
    }
  }
}
</script>
