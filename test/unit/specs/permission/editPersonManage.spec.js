import Vue from 'vue'
import editPersonManage from '@/views/permission/personManage/children/editPersonManage'

describe('editPersonManage.vue', () => {
  it('editPersonManage', () => {
    const Constructor = Vue.extend(editPersonManage)
    const vm = new Constructor().$mount()
    expect(editPersonManage)
  })
})
