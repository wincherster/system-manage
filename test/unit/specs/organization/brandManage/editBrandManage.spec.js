import 'babel-polyfill'
import Vue from 'vue'
import editBrandManage from '@/views/organization/brandManage/children/editBrandManage'

describe('editBrandManage.vue', () => {
  it('editBrandManage', () => {
    const Constructor = Vue.extend(editBrandManage)
    const vm = new Constructor().$mount()
    expect(editBrandManage)
  })
})
