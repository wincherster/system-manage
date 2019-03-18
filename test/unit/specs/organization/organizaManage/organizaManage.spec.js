import 'babel-polyfill'
import Vue from 'vue'
import organizaManage from '@/views/organization/organizaManage/organizaManage'

describe('organizaManage.vue', () => {
  it('organizaManage', () => {
    const Constructor = Vue.extend(organizaManage)
    const vm = new Constructor().$mount()
    expect(organizaManage)
  })
})
