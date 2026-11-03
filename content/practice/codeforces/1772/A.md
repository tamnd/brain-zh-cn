---
title: "CF 1772A - A+B？"
description: "这是 B 类（证明不等式）问题，而不是 C 类问题。任务是证明 $$frac1{a^3(b+c)}+frac1{b^3(c+a)}+frac1{c^3(a+b)}ge frac32$$ 对于所有满足 $abc=1$ 的正 $a,b,c$。"
date: "2026-06-09T12:17:44+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1772
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 839 (Div. 3)"
rating: 800
weight: 1772
solve_time_s: 149
verified: false
draft: false
---

[CF 1772A - A+B？](https://codeforces.com/problemset/problem/1772/A)

 **评分：** 800
 **标签：** 实施
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
