---
title: "CF 1771F - Hossam 和范围最小查询"
description: "这是 B 类（证明不等式）问题，而不是 C 类问题。任务是证明 $$frac1{a^3(b+c)}+frac1{b^3(c+a)}+frac1{c^3(a+b)}ge frac32$$ 对于所有满足 $abc=1$ 的正 $a,b,c$。"
date: "2026-06-09T12:25:22+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "bitmasks", "data-structures", "hashing", "probabilities", "strings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1771
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 837 (Div. 2)"
rating: 2500
weight: 1771
solve_time_s: 137
verified: false
draft: false
---

[CF 1771F - Hossam 和范围最小查询](https://codeforces.com/problemset/problem/1771/F)

 **评分：** 2500
 **标签：** 二分查找、位掩码、数据结构、散列、概率、字符串、树
 **求解时间：** 2m 17s
 **已验证：** 否

 ## 解决方案
 ## 问题类型检查

 这是一个 **B 类（证明不等式）** 问题，而不是 C 类问题。 

任务是证明$$\frac1{a^3(b+c)}+\frac1{b^3(c+a)}+\frac1{c^3(a+b)}\ge \frac32$$对于所有积极的$a,b,c$满意的$abc=1$。 

有效的解决方案必须为所有可接受的三元组建立不等式，并正确识别从论证中出现的任何等式情况。 

## 逐步验证

 ### 第 1 步：使用以下命令重写表达式$abc=1$该解决方案声称$$\frac1{a^3(b+c)}=\frac{b^3c^3}{b+c},$$对于循环项也是如此。 

**评估：** 有效。 

自从$abc=1$，我们有$a=\frac1{bc}$， 因此$a^{-3}=b^3c^3$。 

因此$$\sum \frac1{a^3(b+c)} = \sum \frac{b^3c^3}{b+c}.$$### 步骤 2：应用恩格尔-柯西

 该解决方案适用

 \sum \frac{(b^{3/2}c^{3/2})^2}{b+c} \ge \frac{\left(\sum b^{3/2}c^{3/2}\right)^2} {(a+b)+(b+c)+(
