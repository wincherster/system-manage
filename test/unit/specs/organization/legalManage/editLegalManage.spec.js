import 'babel-polyfill'
import Vue from 'vue'
import editLegalManage from '@/views/organization/legalManage/children/editLegalManage'

describe('editLegalManage.vue', () => {
  it('editLegalManage', () => {
    const Constructor = Vue.extend(editLegalManage)
    const vm = new Constructor().$mount()
    expect(editLegalManage)
  })
})
