<template>
  <a-modal
      :visible="visible"
      :title="title"
      :width="800"
      :confirmLoading="confirmLoading"
      :okButtonProps="{ props: {disabled: disableSubmit} }"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="取消">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="deviceId"
          label="设备">
          <j-dict-select-tag :triggerChange="true" dictCode="equipmentType" v-model="model.deviceId" placeholder="请选择设备">
          </j-dict-select-tag>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="type"
          label="煤种类型">
          <j-dict-select-tag :triggerChange="true" dictCode="type" v-model="model.type" placeholder="请选择煤种类型">
          </j-dict-select-tag>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="contractNo"
          label="合同编号">
          <a-input v-model="model.contractNo" placeholder="请输入合同编号"></a-input>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="startTime"
          label="拉运时间">
          <a-date-picker class="width100" show-time v-model="model.startTime" ></a-date-picker>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发货净重(吨)">
          <a-input placeholder="请输入发货净重" v-model="model.nw"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发货毛重(吨)">
          <a-input placeholder="请输入发货毛重" v-model="model.gw"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发货皮重(吨)">
          <a-input placeholder="请输入发货皮重" v-model="model.pw"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收货单位(吨)">
          <a-input placeholder="请输入收货单位" v-model="model.orgNameGet"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="归属单位(吨)">
          <a-input placeholder="请输入归属单位" v-model="model.orgNameSend"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="车牌号">
          <a-input placeholder="请输入归属单位" v-model="model.carNo"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="remarks"
          label="备注">
          <a-textarea placeholder="请输入备注" v-model="model.remarks"/>
        </a-form-model-item>

      </a-form-model>
      
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "HighWayModel",
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },

        confirmLoading: false,
        validatorRules: {},
        disableSubmit: false,
        validatorRules:{
          equipmentType:[{ required: true, message: '请选择设备类型!' }],
          equipmentName:[{ required: true, message: '请输入设备名称!' }],
          equipmentNumber: [{ required: true, message: '请输入设备编号!' }]
        },
        url: {
          add: "/sys/message/sysMessage/add",
          edit: "/sys/message/sysMessage/edit",
        },
      }
    },
    watch: {
    },
    mounted() {
      
    },
    methods: {
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
      handleOk() {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = this.model;
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })


          }else{
            return false;
          }
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