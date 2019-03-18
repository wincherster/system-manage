import 'babel-polyfill'
import Vue from 'vue'
import upLoad from '@/views/guide/upLoad/upLoad'

describe('upLoad.vue', () => {
  it('upLoad', () => {
    const Constructor = Vue.extend(upLoad)
    const vm = new Constructor().$mount()
    expect(upLoad)

  })
})
