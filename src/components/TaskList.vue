<template>
    <div class="task-list">
     <p v-if="err!==''">{{err}}</p> <!-- 用来显示报错 -->
     <table  v-if="content!==''"> <!-- 设置居中,如果没获取到内容则不显示 -->
      <tr><th v-for="h in content[0]" :key="h.id">{{h}}</th></tr> <!-- 循环读取数据并显示 -->
      <tr v-for="row in content.slice(1,)" :key=row.id>
       <td v-for="item in row" :key=item.id>{{item}}</td>
      </tr>
     </table>
    </div>
   </template>
<script>
import axios from 'axios'
import XLSX from 'xlsx'
import transformSheets from '../scripts/readXlsx' // 导入转制函数

export default {
  name: 'TaskList',
  data: function () {
    return {
      content: '', // 初始化数据
      err: ''
    }
  },
  created () {
    var url = '/task_list.xlsx' // 放在public目录下的文件可以直接访问
    // 读取二进制excel文件,参考https://github.com/SheetJS/js-xlsx#utility-functions
    axios.get(url, {responseType: 'arraybuffer'})
      .then((res) => {
        var data = new Uint8Array(res.data)
        var wb = XLSX.read(data, {type: 'array'})
        var sheets = wb.Sheets
        this.content = transformSheets(sheets)
      }).catch(err => {
        this.err = err
      })
  }
}
