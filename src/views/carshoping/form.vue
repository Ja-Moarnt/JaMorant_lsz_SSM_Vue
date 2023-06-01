<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="active" finish-status="success" simple style="margin-bottom: 40px">
      <el-step title="填写商品基本信息" />
    </el-steps>
    <!-- 填写课程基本信息 -->
    <info v-if="active === 0" />
  </div>
</template>

<script>
// 引入子组件
import Info from '@/views/carshoping/components/Info'

export default {
  components: { Info }, // 注册子组件
  data() {
    return {
      active: 0,
      carshopingId: null
    }
  },
  created() {
    // 获取路由id
    if (this.$route.params.id) {
      this.carshopingId = this.$route.params.id
    }
  }
}
</script>
