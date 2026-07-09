---
title: "CF 103034A - 吃豆人和能量球"
description: "设$$Fn(z)=prod{j=0}^{n-1}(1+z+cdots+z^{sj})，qquad left(!binom{S(n)}{k}!right)=[z^k]Fn(z).$$则$Fn=F{n-1}(1+z+cdots+z^{s{n-1}})$，因此系数提取给出 $$left(!binom{S(n)}{k}!right) = sum{r=0}^{s{n-1}}left(!binom{S(n-1)}{k-r}!"
date: "2026-07-04T05:21:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103034
codeforces_index: "A"
codeforces_contest_name: "April Fools Contest 2021 Archive (ZS)"
rating: 0
weight: 103034
solve_time_s: 139
verified: false
draft: false
---

[CF 103034A - Pacman 和 Power Pellet](https://codeforces.com/problemset/problem/103034/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 19s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$$F_n(z)=\prod_{j=0}^{n-1}(1+z+\cdots+z^{s_j}),
\qquad 
\left(\!\binom{S(n)}{k}\!\right)=[z^k]F_n(z).$$然后$F_n=F_{n-1}(1+z+\cdots+z^{s_{n-1}})$，因此系数提取给出$$\left(\!\binom{S(n)}{k}\!\right)
=
\sum_{r=0}^{s_{n-1}}\left(\!\binom{S(n-1)}{k-r}\!\right),$$按照惯例$\left(!\binom{S(n-1)}{k-r}!\right)=0$什么时候$k-r<0$。 这是帕斯卡规则的精确模拟，直接从系数卷积推导出来。 

使固定$k$。 对于每个$n$，序列$\left(!\binom{S(n)}{k}!\right)$严格递增于$n$每当$k\le \sum_{j=0}^{n-1}s_j$，自从扩大$n$在上面的卷积中引入新的非负贡献，并且至少一项在以下情况下变为严格正数：$k$对于新因子来说是可行的。 特别地，对于每个固定的$k$有一个独特的最小$n$和$\left(!\binom{S(n)}{k}!\right)>0$。 

### 表示的存在

 让$N\ge 0$并修复$t$。 定义$n_t$作为表格的最大索引$s_j\cdot j$这样$$\left(\!\binom{S(n_t)}{t}\!\right)\le N.$$这样一个$n_t$存在是因为$\left(!\binom{S(n)}{t}!\right)$最终超过$N$作为$n$增长，而且还在增加$n$。 

放$$N^{(t-1)} = N - \left(\!\binom{S(n_t)}{t}\!\right).$$根据卷积恒等式，$$\left(\!\binom{S(n_t)}{t}\!\right)
=
\left(\!\binom{S(n_t-1)}{t}\!\right)
+
\left(\!\binom{S(n_t-1)}{t-1}\!\right)
+
\cdots
+
\left(\!\binom{S(n_t-1)}{t-s_{n_t-1}}\!\right),$$所以减去$\left(!\binom{S(n_t)}{t}!\right)$删除最后一个坐标位于的所有配置$[0,s_{n_t-1}]$。 剩下的$N^{(t-1)}$因此仅使用严格小于的索引即可表示$n_t$。 

重复相同的构造会产生$n_{t-1}\le n_t$这样$$N^{(t-1)}=\left(\!\binom{S(n_{t-1})}{t-1}\!\right)+N^{(t-2)},$$和持续的收益率$$N=
\left(\!\binom{S(n_t)}{t}\!\right)+
\left(\!\binom{S(n_{t-1})}{t-1}\!\right)+\cdots+
\left(\!\binom{S(n_1)}{1}\!\right),$$和$n_t\ge n_{t-1}\ge\cdots\ge n_1\ge 0$和每个$n_i$从允许的集合中提取${s_0\cdot 0,s_1\cdot 1,\dots}$因为每个减法步骤只允许与卷积定义的支持兼容的索引$S(\cdot,\cdot)$。 

### 独特性

 假设存在两种表示：$$N=\sum_{i=1}^t \left(\!\binom{S(n_i)}{i}\!\right)
=\sum_{i=1}^t \left(\!\binom{S(m_i)}{i}\!\right),
\qquad
n_t\ge\cdots\ge n_1,\; m_t\ge\cdots\ge m_1.$$让$r$是最大的索引，使得$n_r\ne m_r$。 不失一般性$n_r>m_r$。 那么单调性为$n$给出$$\left(\!\binom{S(n_r)}{r}\!\right)\ge \left(\!\binom{S(m_r+1)}{r}\!\right)>\left(\!\binom{S(m_r)}{r}\!\right).$$所有较高指数的术语$i>r$通过前缀相等取消，因此左侧超过右侧，与$N$。 这迫使$n_r=m_r$为所有人$r$，证明唯一性。 

这就完成了表示定理。 ∎

 ### 公式为$|\partial P_{N_t}|$在推论 C 中，边界算子$\partial$通过减少由表示编码的组合结构中的一个坐标来起作用。 每学期$$\left(\!\binom{S(n_i)}{i}\!\right)$$精确地贡献了减少其中一种方法的数量$i$选定的单位，对应于选择其中之一$i$对该术语有贡献的职位。 减少这样的职位可将贡献计算为$S(n_i,i)$计算为 1$S(n_i,i-1)$。 

对所有级别求和得出$$|\partial P_{N_t}|
=
\sum_{i=1}^t \left(\!\binom{S(n_i)}{i-1}\!\right),$$与公约$\left(!\binom{S(n_i)}{0}!\right)=1$。 

边界在各个级别上唯一分解，因为$N$是唯一的，每次归约只影响一个被加数，不同的被加数之间不会重叠$i$。 ∎
