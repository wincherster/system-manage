import 'babel-polyfill'
import Vue from 'vue'
import index from '@/views/home/index'

describe('index.vue', () => {
  it('index', () => {
    const Constructor = Vue.extend(index)
    const vm = new Constructor().$mount()
    expect(index)
  })
})
