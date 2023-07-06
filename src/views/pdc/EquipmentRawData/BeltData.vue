<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="分公司名称">
              <a-select  placeholder="请选择分公司名称" v-model="queryParams.parentCode" >
                <a-select-option v-for="(item, index) in companyOptions" :key="index" :value="item.key">
                    {{ item.value}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="false"
        @change="handleTableChange">

        <!-- 字符串超长截取省略号显示-->
        <span slot="appId" @click="handleDetail(record)" slot-scope="text, record" style="color: blue;text-decoration: underline;cursor: pointer;">
          {{ text }}
        </span>
        <span slot="receiveTime" slot-scope="text, record" :style="{'color': record.warning? 'red': ''}">
          {{ text }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="handleDetail(record)">详情</a>
          <!-- <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多<a-icon type="down"/></a>
            <a-menu slot="overlay">
               <a-menu-item v-show="show">
                <a  @click="handleEdit(record)">编辑</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <belt-data-model ref="dialog"></belt-data-model>
  </a-card>
</template>

<script>
  import BeltDataModel from './modules/BeltDataModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";
  import { postAction } from '@/api/manage'
  export default {
    name: "Belt",
    mixins: [JeecgListMixin],
    components: {
      JEllipsis,
      BeltDataModel
    },
    
    data() {
      return {
        // 新增修改按钮是否显示
        show: true,
        companyOptions:[],
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '分公司名称',
            align: "center",
            dataIndex: 'parentName'
          },
          {
            title: '厂矿名称',
            align: "center",
            dataIndex: 'appId_',
            scopedSlots: {customRender: 'appId'},
          },
        //  {
        //     title: '洗选类型',
        //     align: "center",
        //     dataIndex: 'deviceId_'
        //   },
          {
            title: '设备名称',
            align: "center",
            dataIndex: 'deviceId_'
          },
          {
            title: '当时产量(吨)',
            align: "center",
            dataIndex: 'outputHour'
          },
          {
            title: '当日产量(吨)',
            align: "center",
            dataIndex: 'outputDay'
          },
          {
            title: '当月产量(吨)',
            align: "center",
            dataIndex: 'outputMonth'
          },
          {
            title: '当年产量(吨)',
            align: "center",
            dataIndex: 'outputYear'
          },
          {
            title: '数据时间',
            align: "center",
            dataIndex: 'receiveTime',
            scopedSlots: {customRender: 'receiveTime'},
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/beltData/lastList",
          company:'/minesApp/companyList'
        },
        queryParams: {
          parentCode: ''
        },
        timer: '',
        outTime: 1000*60*60*12
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created () {
      this.getCompanyList()
      if(this.timer) clearInterval(this.timer)
      // 1000 * 60 * 5
      this.timer = setInterval(() => {
        this.loadData()
      }, 1000 * 60 * 5 )
    },
    methods: {
      async getCompanyList () {
        let res = await postAction(this.url.company)
        this.companyOptions = res.data || []
        this.queryParams.parentCode = res.data[0].key
        this.loadData(1)
      },
      getQueryParams() {
        var param = Object.assign(this.queryParams ,this.filters);
        param.page = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      /** 查看按钮操作 */
    handleDetail(row) {
        this.$refs.dialog.queryParam.appId = row.appId
        this.$refs.dialog.openDio()
      },
      loadData(arg) {
        if (!this.queryParams.parentCode) return
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        postAction(this.url.list, params).then((res) => {
          if (res.code === '0000') {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            res.data.forEach(element => {
              if (element.receiveTime && new Date().getTime() - new Date(element.receiveTime).getTime() > this.outTime) {
                element.warning = true
              }
            });
            
            this.dataSource = res.data;
            if(res.total)
            {
              this.ipagination.total = res.total;
            }else{
              this.ipagination.total = 0;
            }
            //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          }else{
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
    },
    beforeDestroy () {
      clearInterval(this.timer)
      this.timer = ''
    }
  }
</script>
<style lang="less" scoped>
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }

  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>