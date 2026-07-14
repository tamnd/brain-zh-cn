---
title: "CF 103389H - 4G\u7f51\u7edc"
description: "令 $alpha = a1 a2dots an$ 为 ${1,dots,n}$ 的排列。 令$pi$表示逆排列，因此$pi(ai)=i$。 第 7.2.1.2 节中的反演表由 $cj = {, i : pi(i) pi(j), i < j }, qquad 1 le j le n,$ so $0 le cj < j$ 定义。"
date: "2026-07-03T12:15:03+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103389
codeforces_index: "H"
codeforces_contest_name: "2021\u5e74\u4e2d\u56fd\u5927\u5b66\u751f\u7a0b\u5e8f\u8bbe\u8ba1\u7ade\u8d5b\u5973\u751f\u4e13\u573a"
rating: 0
weight: 103389
solve_time_s: 151
verified: false
draft: false
---

[CF 103389H - 4G\u7f51\u7edc](https://codeforces.com/problemset/problem/103389/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 31s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$\alpha = a_1 a_2 \dots a_n$是一个排列${1,\dots,n}$。 让$\pi$表示逆排列，所以$\pi(a_i)=i$。 第 7.2.1.2 节中的反演表定义为$c_j = \#\{\, i : \pi(i) > \pi(j),\ i < j \}, \qquad 1 \le j \le n,$所以$0 \le c_j < j$。 排名被定义为阶乘系统中该表的混合基值。 

定义$r(\alpha) = \sum_{j=1}^n c_j (j-1)!.$界限$c_j < j$意味着$0 \le r(\alpha) < n!$因为这是数字的标准阶乘表示$c_n,c_{n-1},\dots,c_1$。 

计算$r(\alpha)$在线性时间内，无需重复扫描所有对即可获得反演表。 维护一个数组$\pi[1..n]$这样$\pi[x]$是值的位置$x$。 这是一次性构建的：$\pi[a_i] \leftarrow i \quad (1 \le i \le n).$价值观$c_j$然后从集合中确定${1,\dots,j-1}$以及它们相对于的位置$\pi(j)$。 为了有效地支持这些计数，请维护一个位置数据结构，该结构为已处理的值的每个子集存储其位置位于给定前缀中的元素的数量。 有了二叉索引树$1..n$，每个插入和前缀查询的执行时间与单个树遍历成正比。 

处理值$j=1,2,\dots,n$按升序排列，维护包含职位的结构$\pi(1),\dots,\pi(j-1)$。 然后$c_j = (j-1) - \#\{ i<j : \pi(i) \le \pi(j)\}.$第二项是作为索引处的前缀和查询获得的$\pi(j)$，所以每个$c_j$是在对结构进行一次更新和一次查询后计算的。 由于每个操作都遍历单个根到叶路径，因此所有操作的总工作量$j$在第 7.2.1.2 节中使用的字 RAM 意义上是线性的。 

因此$r(\alpha)$通过累加计算得到$c_j (j-1)!$在同一次扫描期间，产生$k=r(\alpha)$在$O(n)$步骤。 

对于逆映射，令$k$被赋予$0 \le k < n!$。 写$k$在阶乘表示中$k = \sum_{j=1}^n c_j (j-1)!,$通过除法顺序获得的数字：$c_j = k \bmod j,\qquad k \leftarrow \left\lfloor k/j \right\rfloor,\qquad n \ge j \ge 1.$重建$\alpha$，维持一组$S$最初包含${1,\dots,n}$。 为了$j=n,n-1,\dots,1$，选择$(c_j+1)$-st 的最小元素$S$并将其附加为$a_{n-j+1}$，然后将其删除$S$。 这一选择是通过上面使用的相同位置结构来实现的，支持每次操作一次遍历中的删除和顺序统计。 每一步都会从其中删除一个元素$S$，所以总更新次数为$n$，并且每个选择都是在相同单位成本假设下以恒定摊销时间执行的。 

该构造产生一个排列，其倒排表恰好是$(c_1,\dots,c_n)$，因此其阶乘展开等于$k$，所以得到的排列是$r^{-1}(k)$。 

两种映射都使用对索引的单次扫描以及每个索引的一次更新和一次查询，给出了第 7.2.1.2 节中模型意义上的线性时间。 

这样就完成了证明。 ∎
