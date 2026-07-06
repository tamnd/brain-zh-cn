---
title: "CF 102904F - 练习"
description: "令 $a1 ge cdots ge an ge 0$ 和 $a'1 ge cdots ge a'n ge 0$ 为 $n$ 的分区，并用零填充至长度 $n$。"
date: "2026-07-04T10:15:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102904
codeforces_index: "F"
codeforces_contest_name: "\u0426\u0438\u043a\u043b \u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434, \u0421\u0435\u0437\u043e\u043d 2020-21, \u041f\u044f\u0442\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 102904
solve_time_s: 70
verified: false
draft: false
---

[CF 102904F - 练习](https://codeforces.com/problemset/problem/102904/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 10s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$a_1 \ge \cdots \ge a_n \ge 0$和$a'_1 \ge \cdots \ge a'_n \ge 0$是 的划分$n$，用零填充长度$n$。 它们的共轭体定义为$$b_k = |\{ i \mid a_i \ge k \}|, \qquad b'_k = |\{ i \mid a'_i \ge k \}|.$$目标是比较字典顺序$b_1 b_2 \cdots b_n$和$b'_1 b'_2 \cdots b'_n$与颠倒序列的字典顺序$a_n \cdots a_1$和$a'_n \cdots a'_1$。 

让$r_i = a_{n-i+1}$和$r'_i = a'_{n-i+1}$是相反的序列。 字典顺序比较$r$和$r'$由最小索引确定$i$这样$r_i \ne r'_i$，相当于最大索引$j = n-i+1$这样$a_j \ne a'_j$。 

让$j$是最大的索引$a_j \ne a'_j$。 然后$a_{j+1} = a'_{j+1}, \ldots, a_n = a'_n = 0$，并且反转序列首先在位置上不同$i = n-j+1$。 

认为$a_j < a'_j$; 相反的情况是对称的。 那么对于所有$k > a'_j$， 两个都$a_j$和$a'_j$是$< k$，所以行$1,\ldots,j$不参与$b_k$或者$b'_k$。 为了$k \le a_j$，两行$j$贡献，以及之间的区别$b_k$和$b'_k$完全由指数决定$1,\ldots,j-1$， 在哪里$a$和$a'$重合。 因此$b_k = b'_k$为所有人$k \le a_j$。 

在$k = a_j + 1$， 排$j$有助于$b'_k$但不$b_k$， 自从$a_j < a'_j$。 因此$b'_{a_j+1} = b_{a_j+1} + 1$， 所以$b < b'$按字典顺序。 

现在我们将其与相反的序列联系起来。 自从$j$是差异最大的指标，第一个差异$r$和$r'$发生在位置$n-j+1$， 在哪里$r_{n-j+1} = a_j$和$r'_{n-j+1} = a'_j$。 因此$r < r'$按字典顺序。 

这表明如果$a_n \cdots a_1 < a'_n \cdots a'_1$， 然后$b_1 \cdots b_n < b'_1 \cdots b'_n$。 

反之，假设$b < b'$并让$k$是最小的索引$b_k \ne b'_k$。 然后$b_1 = b'_1, \ldots, b_{k-1} = b'_{k-1}$，所以对于所有$i$和$a_i \ge k-1$，这些指数的计数一致$a$和$a'$。 行结构中的第一个差异必须出现在最高行索引处$j$使得其中之一$a_j, a'_j$跨过门槛$k$。 这意味着$a_j < a'_j$并且所有索引较高的行都是相等的。 

因此$j$正是最大的索引，其中$a_j \ne a'_j$，并且反转序列中的第一个差异出现在位置$n-j+1$和$a_j < a'_j$。 因此$a_n \cdots a_1 < a'_n \cdots a'_1$。 

这两个含义都成立，因此两个词典比较是等效的。 

这样就完成了证明。 ∎
