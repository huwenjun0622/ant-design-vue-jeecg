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
          <j-dict-select-tag :triggerChange="true" dictCode="type" v-model="model.type" placeholder="请选择类型">
          </j-dict-select-tag>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="coalequipmentState"
          label="当前输煤设备运行状态">
          <j-dict-select-tag :triggerChange="true" dictCode="coalequipmentState" v-model="model.coalequipmentState" placeholder="请选择状态">
          </j-dict-select-tag>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="coalequipmentStarttime"
          label="当前状态开始时刻">
          <a-date-picker class="width100" show-time v-model="model.coalequipmentStarttime" ></a-date-picker>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="coalequipmentEndtime"
          label="上个运行状态的开始时刻">
          <a-date-picker class="width100" show-time v-model="model.coalequipmentEndtime" ></a-date-picker>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="当前状态持续时长(s)">
          <a-input placeholder="请输入" v-model="model.coalequipmentRuntime"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="五分钟累计产量(吨)">
          <a-input placeholder="请输入" v-model="model.outputMinutes"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="当时产量(吨)">
          <a-input placeholder="请输入当时产量" v-model="model.outputHour"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="当日产量(吨)">
          <a-input placeholder="请输入当日产量" v-model="model.outputDay"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="当月产量(吨)">
          <a-input placeholder="请输入当月产量" v-model="model.outputMonth"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="当年产量(吨)">
          <a-input placeholder="请输入当年产量" v-model="model.outputYear"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="AI识别">
          <a-input placeholder="请输入" v-model="model.AIdiscern"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="识别时间">
          <a-date-picker class="width100" show-time v-model="model.discernTime" ></a-date-picker>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="水平振动(mm/s)">
          <a-input placeholder="请输入水平振动" v-model="model.vibrationx"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="垂直振动(mm/s)">
          <a-input placeholder="请输入垂直振动" v-model="model.vibrationy"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="vibrationStatus"
          label="振动状态">
          <j-dict-select-tag :triggerChange="true" dictCode="vibrationStatus" v-model="model.vibrationStatus" placeholder="请选择振动状态">
          </j-dict-select-tag>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="vibrationExceptionTime"
          label="振动异常开始时间">
          <a-date-picker class="width100" show-time v-model="model.vibrationExceptionTime" ></a-date-picker>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="receiveTime"
          label="接收时间">
          <a-date-picker class="width100" show-time v-model="model.receiveTime" ></a-date-picker>
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
    name: "BeltModel",
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