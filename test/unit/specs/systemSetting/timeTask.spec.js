import Vue from 'vue'
import timeTask from '@/views/systemSetting/advancedSetting/timeTask/timeTask'

describe('timeTask.vue', () => {
  it('timeTask', () => {
    const Constructor = Vue.extend(timeTask)
    const vm = new Constructor().$mount()
    expect(timeTask)
  })
})
