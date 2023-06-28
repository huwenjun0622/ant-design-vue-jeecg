import Vue from 'vue'
import { USER_INFO, ENHANCE_PRE } from "@/store/mutation-types"
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => {state.user.avatar = Vue.ls.get(USER_INFO).avatar; return state.user.avatar},
  username: state => state.user.info.username,
  nickname: state => {state.user.info.realname = Vue.ls.get(USER_INFO).realname; return state.user.info.realname},
  welcome: state => state.user.welcome,
  // permissionList: state => state.user.permissionList,
  permissionList: state => {
    return [
      {
        meta: {title: '矿点皮带实时数据', icon: 'dashboard'},
        path: '/pdc/EquipmentRawData/BeltData',
        fullPath: '/pdc/EquipmentRawData/BeltData',
        name: 'BeltData',
      },
      {
        meta: {title: '选煤厂皮带实时数据', icon: 'dashboard'},
        path: '/pdc/EquipmentRawData/FactoryBeltData',
        fullPath: '/pdc/EquipmentRawData/FactoryBeltData',
        name: 'FactoryBeltData',
      }
    ]
  },
  userInfo: state => {state.user.info = Vue.ls.get(USER_INFO); return state.user.info},
  addRouters: state => state.permission.addRouters,
  onlAuthFields: state => {return state.online.authFields },
  enhanceJs:(state) => (code) => {
    state.enhance.enhanceJs[code] = Vue.ls.get(ENHANCE_PRE+code);
    return state.enhance.enhanceJs[code]
  },
  sysSafeMode: state => state.user.sysSafeMode,

}

export default getters
