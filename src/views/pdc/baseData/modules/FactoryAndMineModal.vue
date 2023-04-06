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
          prop="mineName"
          label="煤矿名称">
          <a-input placeholder="请输入煤矿名称" v-model="model.mineName"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="煤矿编码">
          <a-input placeholder="请输入煤矿编码" v-model="model.mineCode"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="parentCode"
          label="子公司名称">
          <a-input placeholder="请输入子公司名称" v-model="model.parentCode"/>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="appType"
          label="标识">
          <a-input placeholder="请输入子公司名称" v-model="model.appType"/>
          <!-- <j-dict-select-tag :triggerChange="true" dictCode="appType" v-model="model.appType" placeholder="请选择标识">
          </j-dict-select-tag> -->
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="coalYardType"
          label="选煤厂性质">
          <j-dict-select-tag :triggerChange="true" dictCode="coalYardType" v-model="model.coalYardType" placeholder="请选择选煤厂性质">
          </j-dict-select-tag>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="井口编码">
          <a-input placeholder="请输入井口编码" v-model="model.wellCode"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="年生产能力(万吨)">
          <a-input-number style="width: 100%" placeholder="请输入年生产能力" v-model="model.capacityAnnual"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="月生产能力(吨)">
          <a-input-number style="width: 100%" placeholder="请输入月生产能力" v-model="model.capacityMonth"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="日生产能力(吨)">
          <a-input-number style="width: 100%" placeholder="请输入日生产能力" v-model="model.capacityDay"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="时生产能力(吨)">
          <a-input-number style="width: 100%" placeholder="请输入时生产能力" v-model="model.capacityHour"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="折算系数">
          <a-input-number style="width: 100%" placeholder="请输入折算系数" v-model="model.mineConversion"/>
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
    name: "FactoryAndMineModal",
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
          mineName:[{ required: true, message: '请输入煤矿名称!' }],
          parentCode:[{ required: true, message: '请输入子公司名称!' }],
          appType: [{ required: true, message: '请输入标识!' }],
          orgCategory:[{required: true, message: '请输入机构类型!'}]
        },
        coalYardType: [{ required: true, message: '请输入选煤厂性质!' }],
        url: {
          add: "/receive/api/v1/basic/receiveBasic",
          edit: "/receive/api/v1/basic/receiveBasic",
        },
      }
    },
    watch: {
      'model.appType': {
        handler (v) {
          if(v == '2') {
            this.validatorRules = Object.assign({}, this.validatorRules, {coalYardType: this.coalYardType})
          } else {
            this.validatorRules = this.$options.data().validatorRules
          }
        },
        immediate: true
      }
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