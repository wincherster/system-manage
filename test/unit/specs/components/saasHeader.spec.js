import 'babel-polyfill'
import Vue from 'vue'
import saasHeader from '@/components/saasHeader'

describe('saasHeader.vue', () => {
  it('saasHeader', () => {
    const Constructor = Vue.extend(saasHeader)
    const vm = new Constructor().$mount()
    expect(saasHeader)

  })
})
