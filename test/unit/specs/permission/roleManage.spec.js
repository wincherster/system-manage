import Vue from 'vue'
import roleManage from '@/views/permission/roleManage/roleManage'

describe('roleManage.vue', () => {
  it('roleManage', () => {
    const Constructor = Vue.extend(roleManage)
    const vm = new Constructor().$mount()
    expect(roleManage)
  })
})
