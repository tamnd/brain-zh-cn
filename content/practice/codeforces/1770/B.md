---
title: "CF 1770B - Koxia 和排列"
description: "这是 B 类（证明不等式）问题，而不是 C 类问题。任务是证明 $$frac1{a^3(b+c)}+frac1{b^3(c+a)}+frac1{c^3(a+b)}ge frac32$$ 对于所有满足 $abc=1$ 的正 $a,b,c$。"
date: "2026-06-09T12:27:59+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms"]
categories: ["algorithms"]
codeforces_contest: 1770
codeforces_index: "B"
codeforces_contest_name: "Good Bye 2022: 2023 is NEAR"
rating: 1000
weight: 1770
solve_time_s: 149
verified: false
draft: false
---

[CF 1770B - Koxia 和排列](https://codeforces.com/problemset/problem/1770/B)

 **评分：** 1000
 **标签：** 构造性算法
 **求解时间：** 2m 29s
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
