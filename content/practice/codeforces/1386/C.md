---
title: "CF 1386C - 小丑"
description: "设$N = pq$，其中$p 等于3 pmod 8$，$q 等于7 pmod 8$。 我们首先证明所声称的涉及雅可比符号的恒等式。"
date: "2026-06-11T10:39:50+07:00"
tags: ["codeforces", "competitive-programming", "*special", "bitmasks", "data-structures", "divide-and-conquer", "dsu"]
categories: ["algorithms"]
codeforces_contest: 1386
codeforces_index: "C"
codeforces_contest_name: "Baltic Olympiad in Informatics 2020, Day 1 (IOI, Unofficial Mirror Contest, Unrated)"
rating: 2800
weight: 1386
solve_time_s: 144
verified: false
draft: false
---

[CF 1386C - 小丑](https://codeforces.com/problemset/problem/1386/C)

 **评分：** 2800
 **标签：** *特殊、位掩码、数据结构、分而治之、dsu
 **求解时间：** 2m 24s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$N = pq$在哪里$p \equiv 3 \pmod 8$和$q \equiv 7 \pmod 8$。 我们首先证明所声称的涉及雅可比符号的恒等式。 回想一下，雅可比符号是乘法的并且满足$$\left(\frac{a}{N}\right) = \left(\frac{a}{p}\right) \left(\frac{a}{q}\right)$$对于任意整数$a$。 我们计算$\left(\frac{-1}{N}\right)$和$\left(\frac{2}{N}\right)$分别地。 

根据二次互易定律和标准公式$-1$和$2$作为分子，我们有$$\left(\frac{-1}{p}\right) = (-1)^{(p-1)/2} = (-1)^{(3-1)/2} = (-1)^1 = -1,$$

$$\left(\frac{-1}{q}\right) = (-1)^{(q-1)/2} = (-1)^{(7-1)/2} = (-1)^3 = -1.$$因此$$\left(\frac{-1}{N}\right) = \left(\frac{-1}{p}\right)\left(\frac{-1}{q}\right) = (-1)(-1) = 1.$$接下来，对于带有分子的符号$2$, 回想一下$$\left(\frac{2}{p}\right) = (-1)^{(p^2-1)/8}, \qquad \left(\frac{2}{q}\right) = (-1)^{(q^2-1)/8}.$$计算$$(p^2 - 1)/8 = (3^2 - 1)/8 = (9 - 1)/8 = 1,$$

$$(q^2 - 1)/8 = (7^2 - 1)/8 = (49 - 1)/8 = 48/8 = 6.$$所以$$\left(\frac{2}{p}\right) = (-1)^1 = -1, \qquad \left(\frac{2}{q}\right) = (-1)^6 = 1.$$相乘得出$$\left(\frac{2}{N}\right) = \left(\frac{2}{p}\right)\left(\frac{2}{q}\right) = (-1)(1) = -1.$$我们已经确定$$\left(\frac{-1}{N}\right) = 1 = -(-1) = -\left(\frac{2}{N}\right),$$这证明了第一个主张。 

该属性允许毫无歧义地设计 Rabin 型加密方案。 让一条明文消息$m$满足$0 \le m < N$。 定义密文$$c \equiv m^2 \pmod N.$$解密需要解决$x^2 \equiv c \pmod N$。 模数有四种解$N$因为$N$是两个不同奇素数的乘积。 我们可以通过考虑雅可比符号模来区分它们$N$。 计算$$\left(\frac{x}{N}\right) \quad \text{and} \quad \left(\frac{x - 1}{2}\right)$$或等效地将一位冗余编码为$m$使得四个平方根中恰好有一个满足预定的雅可比符号条件。 身份$\left(\frac{-1}{N}\right) = -\left(\frac{2}{N}\right)$确保映射来自$m$到根是明确的：四个根可以分为雅可比符号不同的对，因此选择具有适当符号的根可以恢复原始消息。 

明确地，让$m$被编码以便$$\left(\frac{m}{N}\right) = 1, \quad m \text{ even or odd according to a chosen convention}.$$计算后$x \equiv \sqrt{c} \pmod N$，选择具有雅可比符号的唯一解$1$和预定奇偶性。 这产生了确定性解码函数$$m \equiv \text{Dec}(c) \pmod N$$毫无歧义。 加密仍然存在$$c \equiv m^2 \pmod N$$解密只需选择满足固定雅可比符号条件的根即可。 该恒等式保证四个根中恰好有一个满足标准，从而消除了原始 Rabin SQRT 框中存在的双重歧义。 

这样就完成了证明。 

∎
