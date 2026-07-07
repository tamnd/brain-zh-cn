---
title: "CF 102947D - 木柴"
description: "让 $n,m 等于 1$。 目标是将 $n$ 的所有分区生成最多 $m$ 个部分，即序列 $a1 ge a2 ge cdots ge ak ge 1,quad k le m,quad a1+cdots+ak=n。"
date: "2026-07-04T07:29:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102947
codeforces_index: "D"
codeforces_contest_name: "UTPC Contest 02-05-21 Div. 1 (Advanced)"
rating: 0
weight: 102947
solve_time_s: 125
verified: false
draft: false
---

[CF 102947D - 柴火](https://codeforces.com/problemset/problem/102947/D)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 5s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$n,m \ge 1$。 目标是生成所有分区$n$最多进入$m$部分，意思是序列$a_1 \ge a_2 \ge \cdots \ge a_k \ge 1,\quad k \le m,\quad a_1+\cdots+a_k=n.$关键的观察是，这样的划分双射对应于$n+m$准确地进入$m$通过统一的转变积极的部分。 

给定任意分区$n$最多进入$m$部分，以填充形式将其写为$m$-元组$a_1 \ge a_2 \ge \cdots \ge a_m \ge 0,\quad a_1+\cdots+a_m=n.$定义$b_i = a_i + 1.$然后$b_1 \ge b_2 \ge \cdots \ge b_m \ge 1,$和$b_1+\cdots+b_m = n+m.$反之，每个分区$b_1 \ge \cdots \ge b_m \ge 1$的$n+m$准确地进入$m$零件产生一个独特的分区$n$最多进入$m$减去部分$1$来自每个组件。 其中零条目的数量$a_i$正是其中的单位零件的数量$b_i$，删除零最多可以恢复一个分区$m$积极的部分。 因此，这种对应关系是双射的。 

算法 H 将一个整数的所有分区精确地生成为$m$积极的部分。 将其应用到$n+m$而不是$n$产生所有$m$-元组$b_1,\dots,b_m$和$b_1+\cdots+b_m=n+m,\quad b_i\ge 1.$因此，所需的修改仅限于步骤H1，替换输入的原始初始化$n$通过输入的初始化$n+m$。 

在算法 H 的步骤 H1 中，分配$a_1 \leftarrow n - m + 1,\quad a_j \leftarrow 1 \ (1<j\le m)$被替换为通过替换获得的赋值$n+m$为了$n$，即$a_1 \leftarrow (n+m) - m + 1 = n+1,\quad a_j \leftarrow 1 \ (1<j\le m),$与哨兵$a_{m+1} \leftarrow -1$不变。 

然后该算法生成所有分区$n+m$准确地进入$m$部分。 每次输出后，替换每个$a_i$经过$a_i-1$产生非增$m$-非负整数的元组总和为$n$，并且删除零精确地产生了$n$最多进入$m$部分。 

这种修改不会影响算法 H 的任何后续步骤，因为其中使用的所有不变量仅依赖于各部分之间的相对差异以及总和的保存，两者在均匀平移下都保持不变$1$。 ∎
