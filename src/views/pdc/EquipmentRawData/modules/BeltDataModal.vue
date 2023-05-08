<template>
  <a-modal
      :visible="visible"
      :title="title"
      :width="1200"
      @cancel="handleCancel"
      cancelText="关 闭">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="设备名称" prop="deviceId">
              <a-select  placeholder="请选择设备名称" v-model="queryParam.deviceId" >
                <a-select-option v-for="(item, index) in deviceOptions" :key="index" :value="item.deviceId">
                    {{ item.equipmentName}}
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
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">

      </a-table>
    </div>
  </a-modal>
</template>

<script>
  import { postAction} from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  export default {
    name: "BeltModel",
    mixins: [JeecgListMixin],
    data() {
      return {
        title: "操作",
        visible: false,
        // 新增修改按钮是否显示
        show: true,
        deviceOptions:[],
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
            dataIndex: 'receiveTime',
            align: "center"
          }
        ],
        url: {
          list: "/beltData/page",
          device:'/minesApp/getDeviceListByAppId'
        },
        queryParam: {
          page: 1,
          pageSize: 10,
          appId: '',
          deviceId: ''
        },
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
      }
    },
    watch: {
    },
    mounted() {
      
    },
    methods: {
      openDio () {
        this.visible = true;
        this.dataSource = []
        this.queryParam.page = 1
        this.getDeviceList()
      },
      add() {
        this.edit();
      },
      edit(record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      async getDeviceList () {
        let param = {
          appId: this.queryParam.appId
        }
        let res = await postAction(this.url.device, param)
        this.deviceOptions = res.data || []
        this.loadData(1)
      },
      getQueryParams() {
        var param = Object.assign(this.queryParam ,this.filters);
        param.page = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData(arg) {
        if (!this.queryParam.appId) return
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
      handleCancel() {
        this.close()
      },
        


    }
  }
</script>

<style scoped>

</style>