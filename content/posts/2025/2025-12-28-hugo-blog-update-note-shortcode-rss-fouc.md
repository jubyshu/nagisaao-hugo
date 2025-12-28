---
layout: post
title: Hugo博客更新笔记：Shortcode、RSS与FOUC
date: 2025-12-28 21:30:18+08:00
categories: 
- journal
tags: 
- 笔记
slug: hugo-blog-update-note-shortcode-rss-fouc
code: true
---

### 行内Shortcode去除空格

初衷是不再在博客的内文插入html标签，从而关闭Hugo的unsafe模式。一番整理后，只剩一处`<ruby>`标签不舍得删，虽不知何时会再用到，还是为它写了一个简单的shortcode。Hugo的shortcode是块元素，插入行内时会产生空格，`{{-  -}}`的写法也消除不掉。我是强迫症，非要苛求这一个像素的完美，然而ChatGPT提供的诸多方法无一生效。久不用搜索引擎，一搜就找到了解法，AI竟然不知，也是奇怪。

去掉所有空格的方法很简单，在末尾加`{{- "" -}}`即可，示例如下：

```html
<ruby>{{ .Get 0 }}<rt>{{ .Get 1 }}</rt></ruby>{{- "" -}}
```

### RSS输出保留HTML标签

这是另一个ChatGPT未能帮我解决的问题，它提供的方法要么不能防止html标签转义，要么会导致XML校验报错。正确的写法就在Hugo的官方示例中，AI竟然也没学到，令人诧异。

官方写法如下，如果不这么写，Inoreader阅读器将无法正确排版。

```xml
{{ .Content | transform.XMLEscape | safeHTML }}
```

### 页面切换闪屏

给博客新加了一个暗色主题后，切换页面开始出现闪屏现象，本地运行没有问题，发布之后却有问题。试了AI提供的各种方法均无效果，准备放弃之际，无意中看到植入博客的`rocket-loader.min.js`脚本，罪魁祸首原来是它，导致资源的加载顺序有问题从而闪屏。这是域名迁移到Cloudflare后打开的功能，当时并未细查有何用处，而AI也没有想到这一点，似乎不太应该。
