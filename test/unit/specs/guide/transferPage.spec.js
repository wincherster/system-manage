import 'babel-polyfill'
import Vue from 'vue'
import transferPage from '@/views/guide/transferPage/transferPage'

describe('transferPage.vue', () => {
  it('transferPage', () => {
    const Constructor = Vue.extend(transferPage)
    const vm = new Constructor().$mount()
    expect(transferPage)
  })
})
