import 'babel-polyfill'
import store from '../../../../src/store/index'
import {expect} from 'chai'

describe('获取store对象', function () {
  it('获取store对象', function () {
    expect(store.state).to.be.deep.equal(
      {sessionId: '1235',
        navTabs: [],
        activeTabValue: '0',
        fullscreenMode: false,
        cacheData: {}})
  })
})
