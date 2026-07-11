---
title: "CF 103214A - 阶乘"
description: "令 $A$ 为 $t$ 组合族，并令 $partial A$ 表示其影子，即 $A$ 成员中包含的所有 $(t-1)$ 组合族。"
date: "2026-07-03T17:36:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103214
codeforces_index: "A"
codeforces_contest_name: "XXV Spain Olympiad in Informatics, Day 1"
rating: 0
weight: 103214
solve_time_s: 151
verified: false
draft: false
---

[CF 103214A - 阶乘](https://codeforces.com/problemset/problem/103214/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 31s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$A$成为一个家庭$t$- 组合，并让$\partial A$表示它的影子，所有人的家庭$(t-1)$- 成员中包含的组合$A$。 我们寻求最小可能的尺寸$A$这样$|\partial A| < |A|$。 

关键工具是克鲁斯卡尔-卡托纳定理，这意味着在所有族中$A$的$t$- 与固定基数的组合，影子$\partial A$通过采取最小化$A$是编纂顺序的初始部分。 因此，如果任何给定规模的家庭满足$|\partial A| < |A|$，那么同样的不等式适用于该大小的 colex 初始段。 由此可见，问题归结为研究由所有组成的形式的初始部分$t$- 的子集${1,2,\dots,n}$，因为阈值出现在二项式层。 

对于这样一个全层家庭$A = \binom{[n]}{t}$，阴影由所有$(t-1)$- 的子集${1,2,\dots,n}$， 因此$$|A| = \binom{n}{t}, \quad |\partial A| = \binom{n}{t-1}.$$这些数量之间的比率是$$\frac{|\partial A|}{|A|} = \frac{\binom{n}{t-1}}{\binom{n}{t}} = \frac{t}{n-t+1}.$$不平等$|\partial A| < |A|$因此相当于$$\frac{t}{n-t+1} < 1,$$这简化为$$t < n - t + 1,$$或同等地$$n > 2t - 1.$$最小整数$n$满足这个条件就是$n = 2t$。 对于这个值，$$|A| = \binom{2t}{t}, \quad |\partial A| = \binom{2t}{t-1}.$$比率变为$$\frac{|\partial A|}{|A|} = \frac{t}{t+1} < 1,$$所以$|\partial A| < |A|$成立于$A = \binom{[2t]}{t}$。 

它仍然是为了显示最小化$|A|$。 对于任何$m < \binom{2t}{t}$，考虑 colex 初始段$A_m$尺寸的$m$。 克鲁斯卡尔-卡托纳定理意味着它的影子至少与任何其他大小族的影子一样大$m$。 在水平上$n = 2t - 1$, 一个有$$\binom{2t-1}{t-1} = \binom{2t-1}{t},$$因此整个图层的阴影大小等于图层本身的大小。 这是可以实现平等的最后一点。 将大小增加到超过此阈值必然会迫使该族在 colex 排序中包含来自下一层结构的集合，并且上面的二项式比率表明第一个严格不等式$|\partial A| < |A|$恰好在传递到时发生$n = 2t$。 

因此，最小的可能家庭出现在以下情况：$A$是所有的完整集合$t$-a的子集$2t$-元素集。 

因此最小尺寸为$$|A| = \binom{2t}{t}.$$

$$\boxed{\binom{2t}{t}}$$这样就完成了证明。 ∎
