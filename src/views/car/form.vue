<template>
  <div class="app-container">
    <h2 style="text-align: center;">添加新车辆</h2>
    <el-steps :active="active" finish-status="success" simple style="margin-bottom: 40px">
      <el-step title="填写车辆基本信息" />
    </el-steps>
    <!-- 填写课程基本信息 -->
    <info v-if="active === 0" />
  </div>
</template>

<script>
// 引入子组件
import Info from '@/views/car/components/Info'

export default {
  components: { Info }, // 注册子组件
  data() {
    return {
      active: 0,
      carId: null
    }
  },
  created() {
    // 获取路由id
    if (this.$route.params.id) {
      this.carId = this.$route.params.id
    }
  }
}
</script>
