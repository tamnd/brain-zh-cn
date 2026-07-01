---
title: "CF 104217G - 诺姆之旅"
description: "令 $f(x1,dots,xn)$ 的给定 BDD 为有根有向无环图，其分支节点由变量 $V(u)in{1,dots,n}$ 标记，其汇节点为 $bot,top$，有序性确保沿着每个有向路径标签严格增加。"
date: "2026-07-01T23:54:02+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104217
codeforces_index: "G"
codeforces_contest_name: "UTPC Contest 03-03-23 Div. 2 (Beginner)"
rating: 0
weight: 104217
solve_time_s: 30
verified: false
draft: false
---

[CF 104217G - 诺姆之旅](https://codeforces.com/problemset/problem/104217/G)

 **评级：** -
 **标签：** -
 **求解时间：** 30s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让给定的 BDD 为$f(x_1,\dots,x_n)$是一个有根有向无环图，其分支节点由变量标记$V(u)\in{1,\dots,n}$其汇聚节点是$\bot,\top$，有序性确保标签沿着每条有向路径严格增加。 

一个向量$(x_1,\dots,x_n)$满足$f(x_1,\dots,x_n)=1$恰好当评估路径通过从根开始并遵循 LO 边缘来确定值时$0$以及价值的 HI 边缘$1$终止于$\top$。 

要生成所有此类向量，只需遍历所有根到-$\top$BDD 中的路径，同时考虑未沿路径测试的变量。 如果路径到达标记为$V(u)=j$在有最近固定的变量之后$x_k$和$k<j-1$，然后变量$x_{k+1},\dots,x_{j-1}$不受BDD结构的约束并且可以任意选择。 

定义递归过程$\mathrm{ENUM}(u,k,a_1,\dots,a_k)$， 在哪里$u$是一个BDD节点，$k$是最后分配的变量索引，并且$(a_1,\dots,a_k)$是当前的部分向量。 

在汇聚节点，该过程的行为如下。 如果$u=\bot$，不可能完成，并且过程返回但没有输出。 如果$u=\top$，那么所有完成的$(a_1,\dots,a_k)$到一个$n$-tuple 是有效输出，因此该过程输出每个向量$(a_1,\dots,a_n)$和$a_{k+1},\dots,a_n\in{0,1}$。 

在分支节点$u$和$V(u)=j$，变量$x_{k+1},\dots,x_{j-1}$尚未分配。 因此，该过程首先枚举所有$2^{j-k-1}$对这些变量的赋值，将当前前缀扩展为$(a_1,\dots,a_k,b_{k+1},\dots,b_{j-1})$与每个$b_i\in{0,1}$。 在此扩展之后，它通过分配继续 BDD 下降$x_j=0$并调用$\mathrm{ENUM}(\mathrm{LO}(u),j,\dots)$，并分别赋值$x_j=1$并调用$\mathrm{ENUM}(\mathrm{HI}(u),j,\dots)$。 

最初的调用是$\mathrm{ENUM}(\mathrm{ROOT},0)$带有空前缀。 

正确性来自于每次调用时的不变量$\mathrm{ENUM}(u,k,a_1,\dots,a_k)$前缀精确编码变量$x_1,\dots,x_k$，并且该前缀的每个扩展对应于BDD中与排序约束一致的唯一路径。 有序性确保离开节点后不会重新访问任何变量，因此每个分配都通过分支节点处的选择以及跳过索引上的自由选择来确定一次。 BDD 的减少确保不会产生虚假的重复节点生成重复的不一致子结构，因为相同的子图是共享的，因此会产生相同的连续集。 

如果$(x_1,\dots,x_n)$满足$f=1$，其评价路径达到$\top$在某个节点$u$，当过程达到时，递归必然会产生它$u$并完全如上扩展无约束变量。 相反，该过程产生的任何向量都遵循一条到达的路径$\top$，因为输出仅从接收器发生$\top$并且所有前面的转换都遵循 BDD 评估的 LO 和 HI 语义。 因此，该过程准确地输出一组令人满意的作业。 

这样就完成了证明。 ∎
