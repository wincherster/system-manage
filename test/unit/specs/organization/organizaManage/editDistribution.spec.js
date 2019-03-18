import 'babel-polyfill'
import Vue from 'vue'
import editDistribution from '@/views/organization/organizaManage/children/distribution/editDistribution'

describe('editDistribution.vue', () => {
  it('editDistribution', () => {
    const Constructor = Vue.extend(editDistribution)
    const vm = new Constructor().$mount()
    expect(editDistribution)
  })
})
