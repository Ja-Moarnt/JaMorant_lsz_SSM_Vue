<template>
  <div class="app-container">
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="title"
        label="名称"
        width="150"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
      />
    </el-table>

    <div class="el-toolbar">
      <div class="el-toolbar-body" style="justify-content: flex-start;">
        <el-button type="text" @click="exportData"><i class="fa fa-plus" /> 导出</el-button>
        <el-button type="text" @click="importData"><i class="fa fa-plus" /> 导入</el-button>
      </div>
    </div>

    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="480px">
      <el-form label-position="right" label-width="170px">
        <el-form-item label="文件">
          <el-upload
            :multiple="false"
            :on-success="onUploadSuccess"
            :action="'https://localhost:8333/admin/thc/chengshi/importData'"
            class="upload-demo"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImportVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chengshiApi from '@/api/thc/chengshi'
export default {
  data() {
    return {
      dialogImportVisible: false,
      list: [] // 数据字典列表数组
    }
  },
  created() {
    this.getSubList(0)
  },
  methods: {
    importData() {
      this.dialogImportVisible = true
    },
    onUploadSuccess(response, file) {
      this.$message.info('上传成功')
      this.dialogImportVisible = false
      this.getSubList(0)
    },

    // 导出
    exportData() {
      window.open('https://localhost:8333/admin/thc/chengshi/exportData')
    },
    // 数据字典列表
    getSubList(id) {
      chengshiApi.getChildList(id)
        .then(response => {
          this.list = response.data
        })
    },
    load(tree, treeNode, resolve) {
      chengshiApi.getChildList(tree.id).then(response => {
        resolve(response.data)
      })
    }
  }
}
</script>
