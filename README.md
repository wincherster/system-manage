# tzx

> 后台管理

``` bash
# 安装项目依赖
npm install

# 开发环境启动
npm run dev

# 启动项目
npm run start

# 生产环境上线打包
npm run build

# 代码规范检验
npm run lint

# 测试环境进行unit测试 文档生成在 test/unit/coverage 下面 浏览器打开 lcov-report/index.html
npm run unit

# 测试环境进行e2e测试
npm run e2e

# 测试环境进行case测试  文档生成在 test/unit/tests/doc下面 浏览器打开 mochawesome.html
npm run case

# 测试环境进行测试
npm test
```

# 因chromedriver 驱动需要翻墙下载总是失败。解决方式如下

```
npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver --save-dev

```