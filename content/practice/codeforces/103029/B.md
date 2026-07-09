---
title: "CF 103029B - 约翰，卡蒂亚"
description: "该练习引用了“基本压缩引理 (85)”，但 (85) 的陈述未包含在第 7.2.1.3 节提供的摘录中。"
date: "2026-07-04T02:20:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103029
codeforces_index: "B"
codeforces_contest_name: "Quick (fast) contest #1"
rating: 0
weight: 103029
solve_time_s: 66
verified: false
draft: false
---

[CF 103029B - 约翰，卡蒂亚](https://codeforces.com/problemset/problem/103029/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 否

 ## 解决方案
 该练习引用了“基本压缩引理 (85)”，但 (85) 的陈述未包含在第 7.2.1.3 节提供的摘录中。 

如果没有（85）的精确表述，要证明的主张就无法明确确定，因为该部分包含组合表示之间的几个不同的“压缩”变换，包括位串之间的映射$a_{n-1}\ldots a_0$，递减序列$c_t\ldots c_1$和非负组合$q_t\ldots q_0$。 

证明取决于确定这些变换中的哪一个被断言为方程（85）中的引理。 一旦该陈述可用，就可以通过显示映射是明确定义的、可逆的并保留所需的结构（通常是字典顺序或生成序列中的邻接性）来直接进行论证，根据公式使用（3）、（6）或（11）中的单调性约束。 

提供方程（85）的显式陈述，完整的证明可以用 Knuth 的符号和风格编写。
