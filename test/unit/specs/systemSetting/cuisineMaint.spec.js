import Vue from 'vue'
import cuisineMaint from '@/views/systemSetting/cuisineMaint/cuisineMaint'

describe('cuisineMaint.vue', () => {
  it('cuisineMaint', () => {
    const Constructor = Vue.extend(cuisineMaint)
    const vm = new Constructor().$mount()
    expect(cuisineMaint)
  })
})
