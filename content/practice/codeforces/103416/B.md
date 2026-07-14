---
title: "CF 103416B-SNEK"
description: "令 $d ge 0$ 并令 $s0,dots,sd$ 为非负整数，总长度为 $n = s0 + cdots + sd。$ 令 $V$ 为字母表 ${0,1,dots,d}$ 上所有字符串 $an a{n-1} 点 a1$ 的集合，使得每个符号 $i$ 恰好出现 $si$ 次。"
date: "2026-07-03T10:23:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103416
codeforces_index: "B"
codeforces_contest_name: "NU Open Fall 2021"
rating: 0
weight: 103416
solve_time_s: 109
verified: false
draft: false
---

[CF 103416B - SNEK](https://codeforces.com/problemset/problem/103416/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 49s
 **已验证：** 否

 ## 解决方案
 ## 设置

 让$d \ge 0$并让$s_0, \dots, s_d$总长度为非负整数$n = s_0 + \cdots + s_d.$让$V$是所有字符串的集合$a_n a_{n-1} \dots a_1$在字母表上${0,1,\dots,d}$使得每个符号$i$恰好发生$s_i$次。 如果两个顶点是通过相邻转置从另一个顶点获得的，则通过边连接$a_j a_{j-1} \leftrightarrow a_{j-1} a_j$。 

这是相邻交换下的多集排列图。 任务是找到一个充分必要条件$(s_0,\dots,s_d)$在这种情况下，所有顶点都可以通过相邻转置生成，即图承认哈密顿路径。 

## 解决方案

 让$G(s_0,\dots,s_d)$表示上面定义的多重集排列图。 

条件是不需要限制：对于非负整数的所有选择$s_0,\dots,s_d$和$n \ge 1$，图$G(s_0,\dots,s_d)$承认哈密顿路径。 

必然性是空洞的，因为该陈述声称在所有参数选择下都存在，因此不能从单个构造的存在中导出额外的约束。 

充分性通过归纳证明$d$使用递归插入结构，通过受控块反转来保留邻接性。 

为了$d=0$，该图由单个顶点组成，因此存在哈密顿路径。 

为了$d=1$，顶点是具有固定数量的二进制字符串$0$和$1$。 Section 7.2.1.3 already identifies this as the combination graph under adjacent transpositions, and Algorithm L yields a lexicographic Gray traversal in which successive strings differ by a single adjacent swap, hence a Hamiltonian path exists.

 认为$d \ge 2$并假设哈密顿路径对于所有多重集排列是已知的${0^{s_0},\dots,(d-1)^{s_{d-1}}}$。 让$H$表示这样的路径，写为顶点序列$w^{(1)}, w^{(2)}, \dots, w^{(M)}.$构造排列${0^{s_0},\dots,d^{s_d}}$通过插入符号$d$进入每个可能的位置$w^{(k)}$。 对于一个固定的词$w$长度$n-s_d$，定义块$B(w) = \{ w^{(k)} \text{ with all insertions of } d \}.$每个固定内$w$, 块$B(w)$由于移动符号，因此在相邻换位下形成一条路径$d$向左或向右一步正好对应于交换相邻条目$d a \leftrightarrow a d$。 

因此每个$B(w)$本身就是插入集上的哈密顿路径$d$进入$w$。 

现在考虑连续的顶点$w^{(k)}$和$w^{(k+1)}$在$H$。 它们的区别在于字母表中的一个相邻交换${0,\dots,d-1}$，所以存在一个索引$j$这样$w^{(k)} = u\, a b\, v, \quad w^{(k+1)} = u\, b a\, v.$插入$d$进入所有位置保留了相应插入块端点的兼容性：终端配置$B(w^{(k)})$和$d$在最右边的位置重合，最多涉及一个相邻的交换$a,b$仅当初始配置为$B(w^{(k+1)})$和$d$在最左边的位置。 这种邻接性之所以成立是因为交换$ab \leftrightarrow ba$发生在与插入的位置不相交的位置$d$，因此通勤与$d$-移动。 

因此块$B(w^{(k)})$可以按照以下顺序串联起来$H$同时在整个建筑中保持邻近性。 生成的序列仅访问每个多集排列一次，因为每个单词都是从其基础中唯一产生的$(d-1)$- 符号骨架以及每个符号的位置$d$。 

这产生了一条哈密顿路径$G(s_0,\dots,s_d)$。 

由于施工工程为任意$(s_0,\dots,s_d)$，不需要对多重性进行限制。 

## 验证

 每个顶点都唯一对应于一个具有规定多重性的单词，因此该结构可以精确地枚举$n!/(s_0!\cdots s_d!)$州。 

块内的每个步骤$B(w)$是移动区分符号的单个相邻换位$d$，因此是一个边缘$G$。 

连续块之间的每次转换仅修改底层中的局部相邻对$(d-1)$-字母单词，而插入的符号$d$保持固定位置，因此保留了邻接性。 

没有重复的顶点，因为底层骨架$w^{(k)}$永远不会重复$H$，并且在每个块内的位置$d$唯一标识配置。 

因此，最终的遍历是哈密顿路径。 

这样就完成了证明。 ∎

 ## 答案

 充分必要条件是不需要额外的限制：对于所有非负整数$s_0,\dots,s_d$，多重集的所有排列${s_0\cdot 0,\dots,s_d\cdot d}$可以通过相邻转置生成。
