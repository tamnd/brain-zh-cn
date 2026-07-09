---
title: "CF 103003D - 点集"
description: "令$n=s+t$如(1)中那样，并令$(s,t)$-组合写成满足(3)的$ct cdots c2 c1$形式，即$n ct cdots c2 c1 ge 0。"
date: "2026-07-04T02:23:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103003
codeforces_index: "D"
codeforces_contest_name: "box 2020"
rating: 0
weight: 103003
solve_time_s: 163
verified: false
draft: false
---

[CF 103003D - 点集](https://codeforces.com/problemset/problem/103003/D)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 43s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$n=s+t$如 (1) 所示，并让$(s,t)$- 组合写成形式$c_t \cdots c_2 c_1$满足式(3)，即$n > c_t > \cdots > c_2 > c_1 \ge 0.$定义关联的非负整数$q_t, \ldots, q_0$由（11）和（12）：$q_t = s - d_t,\quad q_{t-1} = d_t - d_{t-1},\quad \ldots,\quad q_1 = d_2 - d_1,\quad q_0 = d_1,$其中整数$d_j$与 (7) 的组合相关，$c_j = d_j + j - 1 \quad (1 \le j \le t).$从这些关系来看，$q_t + \cdots + q_1 + q_0 = s,$所以每个$(s,t)$-组合决定了组成$s$进入$t+1$非负部分。 

为了证明压缩引理（85），只需证明该对应关系是双射的即可。 

内射性来自重构$d_1, \ldots, d_t$独特地来自$q_0, \ldots, q_t$。 从(12)，$d_1 = q_0,$

$d_2 = q_1 + d_1,$

$d_3 = q_2 + d_2,$和一般情况下$d_j = q_{j-1} + d_{j-1} \quad (2 \le j \le t).$因此每个$d_j$是由唯一确定的$q$- 序列，然后每个$c_j = d_j + j - 1$是唯一确定的。 因此，不同的组合产生不同的结果$q$- 序列。 

满射性是通过反转构造获得的。 让$q_t, \ldots, q_0$可以是以下任意组合$s$进入$t+1$非负部分。 定义$d_1 = q_0$并递归地$d_j = q_{j-1} + d_{j-1} \quad (2 \le j \le t),$然后设置$c_j = d_j + j - 1 \quad (1 \le j \le t).$递归意味着$d_1 \le d_2 \le \cdots \le d_t$， 因此$c_1 < c_2 < \cdots < c_t,$还有$c_t \le (q_0 + \cdots + q_{t-1}) + (t-1) = (s - q_t) + (t-1) < s + t = n,$所以$n > c_t > \cdots > c_1 \ge 0$持有、制作$c_t \cdots c_1$一个有效的$(s,t)$-组合。 

因此每一个组成$s$产生于一个独特的组合，并且每个组合都会产生一个组合，因此对应关系是双射的。 这建立了压缩引理 (85)。 ∎
