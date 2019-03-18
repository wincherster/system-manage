var expect = require('chai').expect
var obj = {name: 'name1'}
describe('基本测试', function () {
  it('数字类型 相等 操作 使用', function () {
    expect(4 + 5).to.be.equal(9)
  })
  it('数字类型 不相等 操作 使用', function () {
    expect(4 + 5).to.be.not.equal(10)
  })
  it('对象类型 相等 操作 使用', function () {
    expect(obj).to.be.deep.equal({ name: 'name' })
  })
  it('布尔类型 相等 操作 使用', function () {
    expect('everthing').to.be.ok
  })
  it('布尔类型 不相等 操作 使用', function () {
    expect(false).to.not.be.ok
  })
  it('类型判断 相等 操作 使用', function () {
    expect('test').to.be.a('string')
  })
  it('对象类型 相等 操作 使用', function () {
    expect({ foo: 'bar' }).to.be.an('object')
  })
  it('对象类型 不相等 操作 使用', function () {
    expect(obj).to.be.an.instanceof(Object)
  })
  it('是否包含 操作 使用', function () {
    expect([1, 2, 3]).to.include(4)
    expect('foobar').to.contain('foo')
    expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo')
  })
  it('是否为空 操作 使用', function () {
    expect([]).to.be.empty
    expect('').to.be.empty
    expect({}).to.be.empty
  })
  it('正则匹配 操作 使用', function () {
    expect('foobar').to.match(/^foo/)
  })
})
