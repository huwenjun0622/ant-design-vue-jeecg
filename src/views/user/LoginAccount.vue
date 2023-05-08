<template>
    <div>
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item required prop="username">
          <a-input v-model="model.username" size="large" placeholder="请输入帐户名">
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-model-item>
        <a-form-model-item required prop="password">
          <a-input v-model="model.password" size="large" type="password" autocomplete="false" placeholder="请输入密码">
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-model-item>

        <a-row :gutter="0">
          <a-col :span="16">
            <a-form-model-item required prop="inputCode">
              <a-input v-model="model.inputCode" size="large" type="text" placeholder="请输入验证码">
                <a-icon slot="prefix" type="smile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" style="text-align: right">
            <Verify width="100%" height="40px" ref="verify" fontSize="22px" :codeLength="4" :type="1"></Verify>
            <!-- <img v-if="requestCodeSuccess" style="margin-top: 2px;" :src="randCodeImage" @click="handleChangeCheckCode"/>
            <img v-else style="margin-top: 2px;" src="../../assets/checkcode.png" @click="handleChangeCheckCode"/> -->
          </a-col>
        </a-row>
      </a-form-model>
    </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import Verify from 'vue2-verify'
  export default {
    name: 'LoginAccount',
    components: {
      Verify
    },
    data(){
      return {
        requestCodeSuccess: false,
        randCodeImage: '',
        currdatetime: '',
        loginType: 0,
        model:{
          username: '',
          password: '',
          inputCode: ''
        },
        loginList: [
          {
            username: 'admin',
            password: '123456'
          },
          {
            username: 'belt',
            password: 'belt@123!'
          }
        ],
        validatorRules:{
          username: [
            { required: true, message: '请输入用户名!' },
            { validator: this.handleUsernameOrEmail }
          ],
          password: [{
            required: true, message: '请输入密码!', validator: 'click'
          }],
          inputCode: [{
            required: true, message: '请输入验证码!'
          }]
        }

      }
    },
    created() {
      // refresh
      
      // this.handleChangeCheckCode();
    },
    methods:{
      ...mapActions(['Login']),
      /**刷新验证码*/
      handleChangeCheckCode(){
        this.$refs.verify.$refs.instance.refresh()
      },
      // 判断登录类型
      handleUsernameOrEmail (rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        callback()
      },
      /**
       * 验证字段
       * @param arr
       * @param callback
       */
      validateFields(arr, callback){
        let promiseArray = []
        for(let item of arr){
          let p = new Promise((resolve, reject) => {
            this.$refs['form'].validateField(item, (err)=>{
              if(!err){
                resolve();
              }else{
                reject(err);
              }
            })
          });
          promiseArray.push(p)
        }
        Promise.all(promiseArray).then(()=>{
          callback()
        }).catch(err=>{
          callback(err)
        })
      },
      acceptUsername(username){
        this.model['username'] = username
      },
      //账号密码登录
      handleLogin(rememberMe){
        
        // codeChose
        let code = this.$refs.verify.$refs.instance.codeChose
        let username = this.model.username
        let password = this.model.password
        this.validateFields([ 'username', 'password', 'inputCode' ], (err)=>{
          if(!err){
            let loginParams = {
              username: username,
              password: password,
              captcha: this.model.inputCode,
              checkKey: this.currdatetime,
              remember_me: rememberMe,
            }
            if (code.toUpperCase() !== this.model.inputCode.toUpperCase()) {
                this.$message.error('验证码错误')
                this.$emit('validateFail')
                return
            }
            let obj = this.loginList.filter(e =>  e.username == username && e.password == password)
            if (obj.length > 0 ) {
              
              this.$emit('success', '登陆成功')
            } else {
              this.handleChangeCheckCode();
              this.$emit('fail', {message: '账号密码错误'})
            }
          }else{
            this.$emit('validateFail')
          }
        })
      }


    }

  }
</script>

<style scoped>

</style>