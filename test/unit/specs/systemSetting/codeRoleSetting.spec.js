import Vue from 'vue'
import codeRoleSetting from '@/views/systemSetting/advancedSetting/codeRoleSetting/codeRoleSetting'

describe('codeRoleSetting.vue', () => {
  it('codeRoleSetting', () => {
    const Constructor = Vue.extend(codeRoleSetting)
    const vm = new Constructor().$mount()
    expect(codeRoleSetting)
  })
})
