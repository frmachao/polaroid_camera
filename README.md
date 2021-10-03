# Making the HTML&CSS&JavaScript Polaroid camera come to life! 📸 
> [https://blog.frmachao.top/polaroid_camera/](https://blog.frmachao.top/polaroid_camera/)

![3tZBqj](https://cdn.jsdelivr.net/gh/frmachao/images@blog/uPic/3tZBqj.png)

![R73wre](https://cdn.jsdelivr.net/gh/frmachao/images@blog/uPic/R73wre.png)
## 前言

起初我被 仅用 HTML/CSS 制作的[宝丽来相机@fossheim](https://dev.to/fossheim/how-i-recreated-a-polaroid-camera-with-css-gradients-only-4la5) 震撼了。如果你错过了，去这里看看。
同时感谢 [Bryce Dorn](https://dev.to/bryce/bringing-the-css-only-polaroid-camera-to-life-2881) 为其添加的拍照按钮交互、闪光灯、可变镜头 

于是我决定再他们的基础上再加上一些交互，使它更像一个 `真实的相机`

## 我需要做的 🤔

- 使他可以真的调用摄像头拍摄
- 支持照片展示
- 给照片添加拍立得效果的滤镜
- 支持照片导出

## 记录与反思
1、

我从互联网上得到的最好的经验之一，就是永远不要复制和粘贴不是自己编写的代码。如果你一定要复制，那就照着它逐字输入，逼着自己思考，这些代码实际上是什么意思。

-- [Hacker News](https://news.ycombinator.com/item?id=27534343)

2、

巧妙的 HTML+CSS ,但不容易编写「知乎」为什么 CSS 这么难学？
[知乎](https://huangxuan.me/2017/10/06/css-complaints/)

## 遇到的问题
1、

使用 `html2canvas` 来绘制带有拍立得特效的图片时，一些 css 属性会失效，比如: `box-shadow`、`filter`;
目标元素的父元素如果是 `position: fixed` 绘制出的 canvas 会显示不全

是否解决： 否

## 兼容性

- 推荐使用桌面端浏览器访问，不支持 `IE`
- 微信浏览器访问时无法生成图片
- ios 14 safari 、chrome 测试通过
## 参考
- [一个使用css filter属性给图片添加滤镜的调试网站](https://www.cssfilters.co/)
- [深入理解javascript中的立即执行函数(function(){…})()](https://www.jb51.net/article/50967.htm)
