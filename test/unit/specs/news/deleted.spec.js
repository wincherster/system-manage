import 'babel-polyfill'
import Vue from 'vue'
import deleted from '@/views/news/deleted/deleted'

describe('deleted.vue', () => {
  it('deleted', () => {
    const Constructor = Vue.extend(deleted)
    const vm = new Constructor().$mount()
    expect(deleted)
  })
})
