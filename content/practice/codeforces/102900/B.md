---
title: "CF 102900B - 扫雷车 II"
description: "设 $n ge m ge 1$ 并设 $a1 ge a2 ge cdots ge am ge 1$ 为 $n$ 的划分，使得 $ 实际上，如果 $a1$ 是最大部分，$am$ 是最小部分，则条件给出 $a1 - am le 1$，因此 $am 在 {a1, a1 - 1}$ 中。 因此，每个部分都等于 $a1$ 或 $a1 - 1$。"
date: "2026-07-04T08:16:05+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102900
codeforces_index: "B"
codeforces_contest_name: "2020 ICPC Shanghai Site"
rating: 0
weight: 102900
solve_time_s: 161
verified: false
draft: false
---

[CF 102900B - 扫雷器 II](https://codeforces.com/problemset/problem/102900/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 41s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$n \ge m \ge 1$并让$a_1 \ge a_2 \ge \cdots \ge a_m \ge 1$是一个分区$n$这样$|a_i - a_j| \le 1$为所有人$i,j$。 那么不同部分值的集合最多包含两个连续的整数。 

确实，如果$a_1$是最大部分并且$a_m$是最小部分，条件给出$a_1 - a_m \le 1$， 因此$a_m \in {a_1, a_1 - 1}$。 因此每个部分都等于$a_1$或者$a_1 - 1$。 

让$k$表示零件数等于$a_1$。 然后$m-k$部分相等$a_1 - 1$，总和条件变为$$n = k a_1 + (m-k)(a_1 - 1).$$展开给出$$n = k a_1 + m a_1 - k a_1 - m + k = m(a_1 - 1) + k.$$因此$$k = n - m(a_1 - 1).$$自从$0 \le k \le m$, 整数$a_1$受到限制$$m(a_1 - 1) \le n \le m(a_1 - 1) + m,$$这相当于$$a_1 - 1 \le \frac{n}{m} \le a_1.$$因此$a_1 = \left\lceil \frac{n}{m} \right\rceil$。 写作$n = qm + r$和$0 \le r < m$，这产生$q = \left\lfloor \frac{n}{m} \right\rfloor$和$$a_1 =
\begin{cases}
q, & r = 0,\\
q+1, & r > 0.
\end{cases}$$如果$r = 0$， 然后$k = n - m(q-1) = mq - m(q-1) = m$，所以所有部分都相等$q$。 

如果$r > 0$， 然后$a_1 = q+1$， 和$$k = n - m q = r.$$因此确切地说$r$部分相等$q+1$，以及剩余的$m-r$部分相等$q$。 

因为分区是非增的，所以第一个$r$零件是$q+1$和剩余的$m-r$零件是$q$，所以$j$第一部分是$$a_j =
\begin{cases}
q+1, & 1 \le j \le r,\\
q, & r < j \le m.
\end{cases}$$任何最佳平衡分区都必须具有这种形式，因为等于较大值的部分数量是由总和约束唯一确定的，并且没有其他值的选择最多相差$1$可以满足要求的总量。 这样就完成了证明。 ∎
