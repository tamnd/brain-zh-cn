---
title: "CF 103150B - 箭头过程"
description: "令 κt(N) 为 $N$ 度 $t$ 组合表示中的主导参数，因此 κt(N) 是满足 $$binom{nt}{t} le N < binom{nt+1}{t} 的唯一整数 $nt$。"
date: "2026-07-03T19:54:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103150
codeforces_index: "B"
codeforces_contest_name: "EZ Programming Contest #1"
rating: 0
weight: 103150
solve_time_s: 78
verified: false
draft: false
---

[CF 103150B - 箭头过程](https://codeforces.com/problemset/problem/103150/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 18s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 令 κ_t(N) 为度数中的主要参数 -$t$的组合表示$N$，因此 κ_t(N) 是唯一的整数$n_t$满意的$$\binom{n_t}{t} \le N < \binom{n_t+1}{t}.$$这一特征源自定理 K 中隐含的贪婪构造和练习 75 中的表示，其中 κ_t(N) 是出现在$t$-代表$N$。 

写$n_t = \kappa_t(N)$。 那么存在余数$R$这样$$N = \binom{n_t}{t} + R, \qquad 0 \le R < \binom{n_t+1}{t} - \binom{n_t}{t}.$$特别是，定义不平等意味着$$0 \le R < \binom{n_t+1}{t} - \binom{n_t}{t},$$自从$\binom{n_t+1}{t} > \binom{n_t}{t}$，增量$N \mapsto N+1$变化$n_t$仅当$R$在进位到下一个二项式阈值之前达到其最大可能值。 

为了$N+1$，有两种情况。 

如果$R+1 < \binom{n_t+1}{t} - \binom{n_t}{t}$， 然后$N+1$仍处于同一区间$$\binom{n_t}{t} \le N+1 < \binom{n_t+1}{t},$$因此 κ_t(N+1) = n_t，因此 κ_t(N+1) - κ_t(N) = 0。 

如果$R$达到其最大值兼容$n_t$， 然后$N+1$到达下一个二项式边界，意味着$$N+1 = \binom{n_t+1}{t}.$$在这种情况下，κ_t 力的最大值属性$$\kappa_t(N+1) = n_t+1,$$自从$\binom{n_t+1}{t}$是需要领先索引大于的第一个值$n_t$在组合表示中。 

不会发生更大的跳跃，因为 κ_t 的定义不等式表明，增加$N$经过$1$最多可以跨越该形式的一个二项式阈值$\binom{m}{t}$。 

所以，$$\kappa_t(N+1) - \kappa_t(N) =
\begin{cases}
1, & \text{if } N+1 = \binom{m}{t} \text{ for some } m,\\[4pt]
0, & \text{otherwise}.
\end{cases}$$等价地，增量正好发生在$N+1$是一个$t$帕斯卡三角形枚举中的第 - 个二项式系数，并且在所有其他情况下领先组合索引保持不变。$$\boxed{\kappa_t(N+1)-\kappa_t(N)\in\{0,1\},\ \text{equal to }1 \text{ iff } N+1=\binom{m}{t}\text{ for some }m.}$$这样就完成了解决方案。 ∎
