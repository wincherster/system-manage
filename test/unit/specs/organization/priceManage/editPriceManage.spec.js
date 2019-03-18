import Vue from 'vue'
import editPriceManage from '@/views/organization/priceManage/children/editPriceManage'

describe('editPriceManage.vue', () => {
  it('editPriceManage', () => {
    const Constructor = Vue.extend(editPriceManage)
    const vm = new Constructor().$mount()
    expect(editPriceManage)
  })
})
