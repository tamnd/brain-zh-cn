---
title: "CF 103098F - 朋友圈"
description: "令 $X = a{n-1}a{n-2}cdots a0$ 为 $(s,t)$ 组合的二进制表示，因此 $sum ai = t$。 将其关联的栅栏形式写成方程 (14)，$$X = 0^{qt}1,0^{q{t-1}}1cdots 1,0^{q0},$$，其中每个 $qi ge 0$ 且 $sum{i=0}^t qi = s$。"
date: "2026-07-04T00:37:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103098
codeforces_index: "F"
codeforces_contest_name: "2020-2021 Winter Petrozavodsk Camp, UPC contest"
rating: 0
weight: 103098
solve_time_s: 82
verified: false
draft: false
---

[CF 103098F - 朋友圈](https://codeforces.com/problemset/problem/103098/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 22s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$X = a_{n-1}a_{n-2}\cdots a_0$是一个的二进制表示$(s,t)$- 组合，所以$\sum a_i = t$。 写出其相关的栅栏柱形式，如方程（14）所示，$$X = 0^{q_t}1\,0^{q_{t-1}}1\cdots 1\,0^{q_0},$$其中每个$q_i \ge 0$和$\sum_{i=0}^t q_i = s$。 的传播$X$，表示为$X^{\sim}$, 是组成$(q_t,\ldots,q_0)$从连续 1 之间的零块长度中提取。 

对偶，以零块结构写入相同的二进制字符串，$$X = 1^{p_t}0\,1^{p_{t-1}}0\cdots 0\,1^{p_0},$$和$p_i \ge 1$和$\sum_{i=0}^t p_i = n+1$。 其核心是$X$，表示为$X^{\circ}$, 是组成$(p_t,\ldots,p_0)$由 1-块的长度和边界调整确定，如方程（10）所示。 

让$X^{+}$表示按位求补，替换每个$0$经过$1$和每个$1$经过$0$。 此操作交换零块和一块而不改变它们的长度。 

正在申请$+$到栅栏柱代表处$X$给出$$X^{+} = 1^{q_t}0\,1^{q_{t-1}}0\cdots 0\,1^{q_0}.$$块结构为$X^{+}$因此由相同的整数控制$q_t,\ldots,q_0$，但现在解释为由单个 0 分隔的连续 1 块的长度。 将此表示转换为核心数据使用与方程（10）完全相同的规则，因此核心为$X^{+}$是$$(X^{+})^{\circ} = (q_t,\ldots,q_0)^{\circ}.$$另一方面，申请$\sim$到$X^{\circ}$对应于将解释从 1 块结构反转为 0 块结构，因为双重编码交换了底层中选定元素和未选定元素的角色$(s,t)$-组合。 该操作转换相同的块长度序列$(q_t,\ldots,q_0)$转化为变换配置的扩展表示。 

因此，两种构造都从相同的底层块分解中提取相同的有序元组$X$，交换0和1的角色后得到。 块长度数据不会因互补而改变，只有其作为扩展或核心的解释发生变化。 

因此这两个变换是一致的，$$X^{\sim +} = X^{\circ \sim}.$$这样就完成了证明。 ∎
