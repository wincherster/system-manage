import 'babel-polyfill'
import Vue from 'vue'
import editCompany from '@/views/organization/organizaManage/children/company/editCompany'

describe('editCompany.vue', () => {
  it('editCompany', () => {
    const Constructor = Vue.extend(editCompany)
    const vm = new Constructor().$mount()
    expect(editCompany)
  })
})
