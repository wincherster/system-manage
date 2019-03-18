import 'babel-polyfill'
import Vue from 'vue'
import saasFooter from '@/components/saasFooter'

describe('saasFooter.vue', () => {
  it('saasFooter', () => {
    const Constructor = Vue.extend(saasFooter)
    const vm = new Constructor().$mount()
    expect(saasFooter)

  })
})
