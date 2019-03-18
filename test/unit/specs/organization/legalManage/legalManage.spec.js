import 'babel-polyfill'
import Vue from 'vue'
import legalManage from '@/views/organization/legalManage/legalManage'

describe('legalManage.vue', () => {
  it('legalManage', () => {
    const Constructor = Vue.extend(legalManage)
    const vm = new Constructor().$mount()
    expect(legalManage)
  })
})
