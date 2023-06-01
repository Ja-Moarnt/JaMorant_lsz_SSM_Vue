<template>
  <div class="app-container">
    <!-- 输入表单 -->
    <el-form label-width="120px">
      <el-form-item label="司机名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="teacher.phone"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="teacher.password"/>
      </el-form-item>
      <el-form-item label="openid">
        <el-input v-model="teacher.openId"/>
      </el-form-item>
      <el-form-item label="司机简介">
        <el-input v-model="teacher.intro"/>
      </el-form-item>


      <!-- 讲师头像 -->
      <!-- 讲师头像 -->
    <el-form-item label="司机头像">
      <el-upload
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-error="handleAvatarError"
        :action="BASE_API+'/admin/vod/file/upload'"
        class="avatar-uploader">
        <img v-if="teacher.avatar" :src="teacher.avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"/>
      </el-upload>
    </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/vod/teacher'
export default {
  data() {
    return {
      teacher:{
        sort: 0,
        level: 1
      },
      BASE_API: 'https://localhost:8333',
    }
  },
  created() {
    // 获取路径id值，根据id查询得到数据
    if (this.$route.params.id) {
      const id = this.$route.params.id
      this.fetchDataById(id)
    }
  },
  methods: {
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      // console.log(res)
      if (res.code == 20000) {
        // console.log(res)
        this.teacher.avatar = res.data
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败 （非0）')
      }
    },

    // 错误处理
    handleAvatarError() {
      console.log('error')
      this.$message.error('上传失败（http失败）')
    },

    // 上传校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 根据id查询讲师
    fetchDataById(id) {
      teacherApi.getTeacherById(id)
        .then(response => {
          this.teacher = response.data
        })
    },
    //添加
    save() {
      //添加
      teacherApi.saveTeacher(this.teacher)
        .then(response => {
          //提示
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          //跳转列表页面
          this.$router.push({path:'/vod/teacher/list'})
        })
    },
    //修改
    update() {
      //添加
      teacherApi.updateTeacher(this.teacher)
        .then(response => {
          //提示
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          //跳转列表页面
          this.$router.push({path:'/vod/teacher/list'})
        })
    },
    //添加和修改
    saveOrUpdate() {
      if(!this.teacher.id) { //没有id，添加
        this.save()
      } else { //有id，修改
        this.update()
      }
    }
  }
}
</script>
