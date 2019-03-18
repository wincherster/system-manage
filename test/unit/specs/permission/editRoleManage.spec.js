import Vue from 'vue'
import editRoleManage from '@/views/permission/roleManage/children/editRoleManage'

describe('editRoleManage.vue', () => {
  it('editRoleManage', () => {
    const Constructor = Vue.extend(editRoleManage)
    const vm = new Constructor().$mount()
    expect(editRoleManage)
  })
})
