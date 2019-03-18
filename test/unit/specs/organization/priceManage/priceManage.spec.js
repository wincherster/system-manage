import Vue from 'vue'
import priceManage from '@/views/organization/priceManage/priceManage'

describe('priceManage.vue', () => {
  it('priceManage', () => {
    const Constructor = Vue.extend(priceManage)
    const vm = new Constructor().$mount()
    expect(priceManage)
  })
})
