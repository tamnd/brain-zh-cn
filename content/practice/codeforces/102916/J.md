---
title: "CF 102916J - 失落之岛"
description: "令 $a1 ge a2 ge cdots ge am ge 1$ 为将 $n$ 划分为 $m$ 个最佳平衡部分，这意味着 $ 令 $t$ 为等于 $x$ 的部分数量，$m-t$ 为等于 $x-1$ 的部分数量。 该分区的总和为 $$n = tx + (m-t)(x-1) = mx - (m-t)。"
date: "2026-07-04T08:03:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102916
codeforces_index: "J"
codeforces_contest_name: "Samara Farewell Contest 2020 (XXI Open Cup, Grand Prix of Samara)"
rating: 0
weight: 102916
solve_time_s: 152
verified: false
draft: false
---

[CF 102916J - 失落之岛](https://codeforces.com/problemset/problem/102916/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 32s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$a_1 \ge a_2 \ge \cdots \ge a_m \ge 1$是一个分区$n$进入$m$零件达到最佳平衡，意味着$|a_i-a_j|\le 1$为所有人$1\le i,j\le m$。 该条件相当于要求最大和最小部分最多相差$1$，所以如果$a_1 = x$，那么每个部分都满足$a_m \in {x, x-1}$并且不可能有其他值。 

让$t$零件数等于$x$和$m-t$零件数等于$x-1$。 该分区有总和$$n = tx + (m-t)(x-1) = mx - (m-t).$$解决$x$给出$$mx = n + m - t,\quad x = \frac{n+m-t}{m}.$$自从$x$是一个整数，$n+m-t \equiv 0 \pmod m$， 因此$t \equiv n \pmod m$。 写$$n = mq + r,\quad 0 \le r < m,$$所以$q = \lfloor n/m \rfloor$和$r = n \bmod m$。 

代入表达式为$n$,$$n = m q + r.$$最佳平衡分区必须使用最多不同的部分$1$，所以唯一可能的值为$q$和$q+1$。 让$t$零件数等于$q+1$， 和$m-t$零件数等于$q$。 那么总和约束就变成了$$n = t(q+1) + (m-t)q = mq + t.$$与相比$n = mq + r$给出$t = r$。 因此确切地说$r$零件是$q+1$和剩余的$m-r$零件是$q$。 

这确定了一个唯一的分区，因为序列被迫为非递增的，所有较大的部分都放在前面：$$a_1 = \cdots = a_r = q+1,\quad a_{r+1} = \cdots = a_m = q.$$为了验证最佳平衡，任何一对零件的不同之处在于$0$或者$1$因为唯一存在的值是$q$和$q+1$， 所以$|a_i-a_j|\le 1$成立。 任何其他分区$m$部分必须偏离商和余数的这种分布，这将迫使某些部分至少$q+2$或者至多$q-1$，与总和约束或具有最小分布的非增加条件相矛盾。 

这样就存在一个最佳平衡分区。 

这$j$因此，这部分是$$a_j =
\begin{cases}
\left\lfloor \frac{n}{m} \right\rfloor + 1 & \text{if } 1 \le j \le n \bmod m,\\[6pt]
\left\lfloor \frac{n}{m} \right\rfloor & \text{if } n \bmod m < j \le m.
\end{cases}$$这样就完成了证明。 ∎
