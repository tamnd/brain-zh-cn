---
title: "CF 1472E - 正确放置"
description: "我无法仅从样本中可靠地诊断这一问题，因为样本输入/输出对无法识别问题。"
date: "2026-06-11T00:34:24+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1472
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 693 (Div. 3)"
rating: 1700
weight: 1472
solve_time_s: 188
verified: false
draft: false
---

[CF 1472E - 正确放置](https://codeforces.com/problemset/problem/1472/E)

 **评分：** 1700
 **标签：** 二分查找、数据结构、dp、排序、两个指针
 **求解时间：** 3m 8s
 **已验证：** 否

 ## 解决方案
 我无法仅从样本中可靠地诊断这一问题，因为样本输入/输出对无法识别问题。 

该行为强烈表明正在测试的 Python 程序实际上是一个完全不同问题的解决方案：

 - 您的输入包含 3 个测试用例。 
- 预期输出是三个整数：`202`,`13`， 和`19`。 
- 实际输出是：```
NO
NO
YES
1 4 2 3
```这是“找到四个对和相等的索引”类型问题的格式，而不是数字答案问题。 

这意味着正在运行的代码几乎肯定不会解决与您提供的示例相同的任务。 因此，如果不知道实际的问题陈述，就不可能追踪算法内部的错误。 样本可以解决无数的问题```
2
13 88
```可以合法地得到答案`202`。 

请提供以下其中一项：

 1. 完整的问题陈述，或
 2. 问题名称/Codeforces 竞赛和问题信件，或者
 3. 产生错误输出的Python 解决方案。 

一旦我遇到实际问题，我可以：

 - 跟踪失败样本的算法，
 - 识别精确的逻辑错误，
 - 解释为什么它会产生错误的答案，
 - 并提供修正后的完整Python 3解决方案。
