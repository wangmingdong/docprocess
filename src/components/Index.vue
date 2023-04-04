<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-col :span="6">
          <el-upload
          ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-upload="upload"
            :show-file-list="false"
            :multiple="true"
            accept=".xlsx,.xls"
            style="width: 100px; display: flex; flex-direction: row;"
          >
            <el-button
              size="small"
              type="primary"
            >
              添加Excel文件
            </el-button>
          </el-upload>
            <div v-for="file in fileList" class="file-describe" :key="file.index" @click="removeFile(file)">
              <el-link>{{file.name}}<i class="el-icon-view el-icon-close"></i> </el-link>
            </div>
        </el-col>
        <el-col :span="6">
        </el-col>
      </el-col>
    </el-row>
    <el-table
    :data="tableData.slice((tableInfo.currentPage - 1) * tableInfo.pageSize, tableInfo.currentPage * tableInfo.pageSize)"
    v-loading="loading"
    height="550"
    stripe
    style="width: 100%">
    <el-table-column label="序号" width="100" sortable>
        <template slot-scope="scope">
            {{ scope.$index + 1 + (tableInfo.currentPage - 1) * tableInfo.pageSize}}
        </template>
    </el-table-column>
    <el-table-column label="日期" prop="__EMPTY" width="100" sortable>
        <template slot-scope="scope">
            {{ scope.row['__EMPTY'] }}
        </template>
    </el-table-column>
    <el-table-column label="案件" prop="__EMPTY_1" width="300" sortable>
        <template slot-scope="scope">
            {{ scope.row['__EMPTY_1'] }}
        </template>
    </el-table-column>
    <el-table-column label="办理单位" prop="__EMPTY_2" width="100" sortable>
        <template slot-scope="scope">
            {{ scope.row['__EMPTY_2'] }}
        </template>
    </el-table-column>
    <el-table-column label="上报部门" prop="__EMPTY_3" width="100" sortable>
        <template slot-scope="scope">
            {{ scope.row['__EMPTY_3'] }}
        </template>
    </el-table-column>
    <!-- <el-table-column label="现场记录" prop="__EMPTY_4" width="200">
        <template slot-scope="scope">
            {{ scope.row['__EMPTY_4'] }}
        </template>
    </el-table-column> -->
    <el-table-column label="处理状态" prop="__EMPTY_5" width="100" sortable>
        <template slot-scope="scope">
            {{ scope.row['__EMPTY_5'] }}
        </template>
    </el-table-column>
    <!-- <el-table-column label="处置结果" prop="__EMPTY_6" width="200">
        <template slot-scope="scope">
            {{ scope.row['__EMPTY_6'] }}
        </template>
    </el-table-column> -->
    <el-table-column label="案件大类" prop="__EMPTY_7" width="100" sortable>
        <template slot-scope="scope">
            {{ scope.row['__EMPTY_7'] }}
        </template>
    </el-table-column>
    <el-table-column label="案件小类" prop="__EMPTY_8" width="100" sortable>
        <template slot-scope="scope">
            {{ scope.row['__EMPTY_8'] }}
        </template>
    </el-table-column>
    <el-table-column label="案件发生区域" prop="__EMPTY_9" sortable>
        <template slot-scope="scope">
            {{ scope.row['__EMPTY_9'] }}
        </template>
    </el-table-column>
    <!-- <el-table-column
      align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
    </el-table-column> -->
    </el-table>
    <!-- 分页器 -->
    <div class="block" style="margin-top: 15px">
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableInfo.currentPage"
        :page-sizes="[10, 50, 100, 500]"
        :page-size="tableInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
    <!-- 数据分析 -->
    <div class="analyse-container">
      <el-row>
      <el-col :span="6">
        <el-button type="primary" @click="analyseData">数据分析</el-button>
      </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-collapse v-model="activeNames">
        <el-collapse-item title="一致性 Consistency" name="1">
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
        <el-collapse-item title="反馈 Feedback" name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
        <el-collapse-item title="效率 Efficiency" name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
        <el-collapse-item title="可控 Controllability" name="4">
          <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
          <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        </el-collapse-item>
      </el-collapse>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import XLSX from 'xlsx'
import { read, utils } from 'xlsx'
export default {
  name: 'HelloWorld',
  data () {
    return {
      fileData: {
        name: '未上传'
      },
      tableInfo: {
        currentPage: 1, // 当前页码
        total: 50, // 总条数
        pageSize: 50 // 每页的数据条数
      },
      // 文件列表
      fileList: [],
      headerData: [],
      headerItem: [],
      tableData: [],
      loading: false,
      // 折叠打开状态
      activeNames: ['1'],
      // 分类信息
      classDetail: {
        // 小类
        subName: '',
        // 大类
        className: '',
        subClass: ['']
      }
    }
  },
  methods: {
    upload (file, fileList) {
      console.log('file', file)
      console.log('fileList', fileList)
      let files = {0: file}
      this.readExcel1(files)
    },
    // 表格导入
    readExcel1 (files) {
      // var that = this
      // this.fileData = files[0]
      this.fileList.push(files[0])
      console.log(files)
      // 此处判断不严谨，思路只是根据传入的参数校验数据的完整性，可根据自己需求修改
      // 如果没有文件名
      if (files.length <= 0) {
        return
      }
      if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error('文件格式不正确，请选取xls或者xlsx格式')
        return
      }

      this.loading = true
      const fileReader = new FileReader()
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result
          const workbook = read(data, {
            type: 'binary'
          })
          // 取第一张表
          const wsname = workbook.SheetNames[0]
          // 生成json表格内容
          const ws = utils.sheet_to_json(workbook.Sheets[wsname])
          console.log(ws)
          // 表头数据
          this.headerItem = []
          for (let key in ws[0]) {
            this.headerItem.push(ws[0][key])
          }
          // 内容数据
          for (let i = 1; i < ws.length - 1; i++) {
            for (let item in ws[i]) {
              if (item === '__EMPTY') {
                ws[i][item] = this.formatExcelDate(ws[i][item])
              }
            }
            ws[i].uid = files[0].uid
            this.tableData.push(ws[i])
          }
          this.loading = false
          // 后续为自己对ws数据的处理
        } catch (e) {
          this.loading = false
          return false
        }
      }
      fileReader.readAsBinaryString(files[0])
    },
    deleteC (id) {
      const index = this.initData.findIndex(x => x.id === id)
      this.initData.splice(index, 1)
    // },
    // sheetjsexport () {
    //   let wb = XLSX.utils.table_to_book(
    //     document.getElementById('TableToExport'),
    //     { raw: true }
    //   )
    //   XLSX.writeFile(wb, 'SheetJSTable.xlsx')
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.tableInfo.currentPage = 1
      this.tableInfo.pageSize = val
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.tableInfo.currentPage = val
    },
    // 当前表格数据
    getCurrentTable () {
      let data = this.tableData.slice((this.tableInfo.currentPage - 1) * this.tableInfo.pageSize, this.tableInfo.currentPage * this.tableInfo.pageSize)
      console.log(data)
    },
    // 日期格式化
    formatExcelDate (num, format = '-') {
      if (!/^\d+$/.test(num)) return
      num = parseInt(num)
      let millisecond = 0 // 转化后的毫秒数
      if (num > 60) { // 对大于60的日期进行减1处理
        millisecond = (num - 25568 - 1) * 3600 * 24 * 1000
      } else {
        millisecond = (num - 25568) * 3600 * 24 * 1000
      }
      const date = new Date(millisecond) // 根据转化后的毫秒数获取对应的时间
      const yy = date.getFullYear()
      const m = date.getMonth() + 1
      const mm = m >= 10 ? m : '0' + m
      const d = date.getDate()
      const dd = d >= 10 ? d : '0' + d
      return yy + format + mm + format + dd // 返回格式化后的日期
    },
    // 移除文件
    removeFile (file) {
      // 文件列表
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].uid === file.uid) {
          this.fileList.splice(i, 1)
          break
        }
      }
      // 表格数据
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].uid === file.uid) {
          this.tableData.splice(i, 1)
          i--
        }
      }
      // 删除后重置第一页
      this.tableInfo.currentPage = 1
      this.$message({
        message: `${file.name}文件已移除`,
        type: 'success'
      })
    },
    // 分析数据小类
    analyseData () {
      this.classDetail = {}
      for (let i = 0; i < this.tableData.length; i++) {
        let rowData = this.tableData[i]
        if (rowData['__EMPTY_8']) {
          let obj = {
            className: rowData['__EMPTY_7'],
            value: rowData['__EMPTY_1']
          }
          let classKeyArr = this.classDetail[rowData['__EMPTY_8']]
          if (classKeyArr && classKeyArr.length) {
            classKeyArr.push(obj)
          } else {
            this.classDetail[rowData['__EMPTY_8']] = [obj]
          }
        }
      }
      console.log(this.classDetail)
    },
    // 提取关键词
    extractKeyword () {
      console.log()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.file-describe {
  display: flex;
}
.analyse-container {
  border: 1px solid #e4e7ed;
  padding: 0 10px;
  margin: 10px;
  border-radius: 4px;
}
</style>
