---
title: "CF 1482B - 恢复模数"
description: "我无法仅从样本中可靠地诊断这一问题，因为样本输入/输出对无法识别问题。"
date: "2026-06-10T23:23:09+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1482
codeforces_index: "B"
codeforces_contest_name: "\u0422\u0435\u0445\u043d\u043e\u043a\u0443\u0431\u043e\u043a 2021 - \u0424\u0438\u043d\u0430\u043b"
rating: 1500
weight: 1482
solve_time_s: 169
verified: false
draft: false
---

[CF 1482B - 恢复模数](https://codeforces.com/problemset/problem/1482/B)

 **评分：** 1500
 **标签：** 实现、数学
 **求解时间：** 2m 49s
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
