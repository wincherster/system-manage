import 'babel-polyfill'
import Vue from 'vue'
import systemNews from '@/views/news/systemNews/systemNews'

describe('systemNews.vue', () => {
  it('systemNews', () => {
    const Constructor = Vue.extend(systemNews)
    const vm = new Constructor().$mount()
    expect(systemNews)
  })
})
