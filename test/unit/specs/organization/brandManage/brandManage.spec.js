import 'babel-polyfill'
import Vue from 'vue'
import brandManage from '@/views/organization/brandManage/brandManage'

describe('brandManage.vue', () => {
  it('brandManage', () => {
    const Constructor = Vue.extend(brandManage)
    const vm = new Constructor().$mount()
    expect(brandManage)
  })
})
