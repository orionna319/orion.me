---
title: '记一次 Jenkins 构建时间优化'
description: 'Record of Optimizing Jenkins Build Time'
pubDate: '2023-11-29 19:03:47'
heroImage: '/record-of-optimizing-jenkins-build-time.png'
---

# 结果
项目是使用 @vue/cli-service@4 + vue@2 + ant-design-vue@1 搭建的。
<br />
项目构建时间从5分钟变为了47秒(`Took 5 min 31 sec -> Took 47 sec`)

# 问题排查过程

- Jenkins configure，发现之前项目 Jenkins 配置勾选了 Build-Environment-Delete-workspace before build starts。取消勾选。
  ```sh
    added 1083 packages in 2m
    ⬇️
    up to date in 4s
  ```

- Jenkins 部署时，发现 `npm install` 花费了2分钟，觉得是 `npm registry` 的问题，切换镜像！在项目中配置 .npmrc 文件，发现构建时间减少两分钟左右。以下是 .npmrc 文件内容。
  ```.npmrc
    registry=https://registry.npmmirror.com #优先使用本地缓存，减少对网络的依赖
    prefer-offline=true
    loglevel=error
    progress=false
  ```

- 因为 @vue/cli-service@4 是使用 webpack 配置的，以下是一些 webpack 插件配置。
  - [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)，它位于 node_modules/.cache/hard-source 下，第二次构建的速度将明显加快。
    > HardSourceWebpackPlugin is a plugin for webpack to provide an intermediate caching step for modules.
  - 使用 `IgnorePlugin` ，忽略 `moment` 库中的 `locale` 目录。
    > 记得在项目中手动引入 `import 'moment/locale/zh-cn'`
  ```js
    [
      new HardSourceWebpackPlugin(),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    ]
  ```

# 写在最后

webpack@4 之后，其实已经有了很好的构建性能，也配置过 DllPlugin，配置过程中发现一篇文章 [你真的需要 Webpack DllPlugin 吗？](https://www.cnblogs.com/skychx/p/webpack-dllplugin.html)，就去掉了。以及尝试了这些 `happypack`、`thread-loader`、...。webpack 确实一个很好的构建工具，但是它太重了。好啦，这其实是我学习 webpack，了解 Jenkins 配置的一篇文章。今天写出来就当一个总结吧。
> 第一篇技术 blog，🧐

# 参考阅读
- [带你深度解锁Webpack系列(优化篇)](https://juejin.cn/post/6844904093463347208)
- [你真的需要 Webpack DllPlugin 吗？](https://www.cnblogs.com/skychx/p/webpack-dllplugin.html)


