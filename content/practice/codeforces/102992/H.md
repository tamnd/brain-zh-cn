---
title: "CF 102992H - 和谐矩形"
description: "令 $T=binom{2t-1}{t}$ 并写入 $x=N/T$。 在第 7.2.1.3 节中，数字 $kappa{tN}$ 通过 $N$ 的二进制表示形式来表示，方法是将相应的 $(s,t)$ 组合分解为 (11) 的相关组合 $qt,dots,q0$。"
date: "2026-07-04T06:23:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102992
codeforces_index: "H"
codeforces_contest_name: "2020-2021 ACM-ICPC, Asia Nanjing Regional Contest (XXI Open Cup, Grand Prix of Nanjing)"
rating: 0
weight: 102992
solve_time_s: 151
verified: false
draft: false
---

[CF 102992H - 和谐矩形](https://codeforces.com/problemset/problem/102992/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 31s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$T=\binom{2t-1}{t}$并写$x=N/T$。 在第 7.2.1.3 节中，数量$\kappa_{tN}$通过二进制表示来表达$N$通过分解对应的$(s,t)$-组合成相关组合物$q_t,\dots,q_0$(11)。 导致练习 84 的论证表明，$\kappa_{tN}-N$受定义 Takagi 函数的相同加法结构控制，即形式的二进贡献$r_k(x)=(-1)^{\lfloor 2^k x\rfloor}$通过表示（14）的二进制进位结构累加。 

功能$\lambda_{tN}$和$\mu_{tN}$由相同的分解产生，但中间二进制配置的极端选择与固定前缀一致$(s,t)$-代表$N$。 同样地，当一个人表达$x$以二进制形式记录并跟踪组合物的诱导序列$q_t,\dots,q_0$，值$\kappa_{tN}$仅取决于有限的数字窗口，直到表示之间转换中的进位传播仍然会影响该值的位置。 截断这种依赖性会产生两个极值阶梯函数：$\lambda_{tN}$通过最小化所有未解决的套利贡献而获得，以及$\mu_{tN}$通过最大化它们来获得。 

就 Takagi 展开而言，这对应于替换完整的无限 Rademacher 级数表示$\tau(x)$通过部分和，其中未决定的位$x$固定为$0$为了$\lambda_{tN}$并到$1$为了$\mu_{tN}$。 每个这样的未定位都贡献一个有符号的二项量值$2^{-k}$与(13)-(14)中的方式相同，因此所有未解析位置的累积效应正是由高木函数编码的振荡误差。 

练习 84 中的渐近关系，$$\kappa_{tN}-N=\frac{T}{t}\,\tau(x)+O\!\left(\frac{(\log t)^3}{t}\right),$$意味着两个极值结构都满足具有相同首项的相应不等式，因为更改每个未确定的数字只能在其二进增量范围内改变 Takagi 贡献。 因此，截断过程产生以下形式的界限$$\lambda_{tN}-N \;\le\; \frac{T}{t}\,\tau(x) \;\le\; \mu_{tN}-N,$$与两者$\lambda_{tN}$和$\mu_{tN}$不同于$\kappa_{tN}$至多是未解决的套利头寸的累积影响，这与练习 84 中的误差项具有相同的数量级。 

由于 Takagi 函数本身是通过对所有位位置上的有符号二进贡献求和而生成的，因此该函数$\lambda_{tN}$和$\mu_{tN}$精确对应于下包络线和上包络线近似值$\tau(x)$通过修复二进制表示中未解析的数字而引起$x=N/T$。 从这个意义上说，$\lambda_{tN}$和$\mu_{tN}$是相同 Rademacher-sum 结构的离散极值实现，该结构定义$\tau(x)$， 和$\tau(x)$缩放后恢复为它们的共同渐近中心$T/t$。 

这样就完成了证明。 ∎
