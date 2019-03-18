import Vue from 'vue'
import personManage from '@/views/permission/personManage/personManage'

describe('personManage.vue', () => {
  it('personManage', () => {
    const Constructor = Vue.extend(personManage)
    const vm = new Constructor().$mount()
    expect(personManage)
  })
})
