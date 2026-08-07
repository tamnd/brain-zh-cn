---
title: "CF 104128K - 堆中的 NaN"
description: "设 $h{a,b}(x)=((ax+b)gg(n-l)) bmod 2^l$，其中 $ain A={amid 0<a<2^n, a text{odd}}$ 和 $bin B={bmid 0le b<2^{n-l}}$。 对于$n$位整数的固定集合$P$和$Q$，定义$$I={h{a,b}(p)mid pin P},qquad J={h{a,b}(q)mid qin Q}。$$令$$$Pr[h{a,b}(x)=h{a,b}(y)]le 2^{-l}。"
date: "2026-07-02T01:45:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104128
codeforces_index: "K"
codeforces_contest_name: "The 2022 ICPC Asia Nanjing Regional Contest"
rating: 0
weight: 104128
solve_time_s: 115
verified: false
draft: false
---

[CF 104128K - 堆中的 NaN](https://codeforces.com/problemset/problem/104128/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 55s
 **已验证：** 否

 ## 解决方案
 ## 设置

 让$h_{a,b}(x)=((ax+b)\gg(n-l)) \bmod 2^l$， 和$a\in A={a\mid 0<a<2^n,\ a\ \text{odd}}$和$b\in B={b\mid 0\le b<2^{n-l}}$。 对于固定组$P$和$Q$的$n$-位整数，定义$$I=\{h_{a,b}(p)\mid p\in P\},\qquad J=\{h_{a,b}(q)\mid q\in Q\}.$$让$|P|=|Q|=2^t$，如第 7.1.4 节和练习 6.4-78 中定理 X 的设置。 通用散列属性意味着对于不同的$x,y$,$$\Pr[h_{a,b}(x)=h_{a,b}(y)]\le 2^{-l}.$$目标是建立$(a,b)$然后构造一个结构化子集$Q^*\subseteq Q$满足定理X中的匹配条件(120)。 

## 解决方案

 ### (a) 良好哈希函数的存在性

 对于固定$(a,b)$， 让$X_P$表示有序碰撞的数量$P$：$$X_P=\#\{(p,p')\in P^2\mid p<p',\ h(p)=h(p')\}.$$对于每对$(p,p')$，指示变量$\mathbf{1}[h(p)=h(p')]$最多有期待$2^{-l}$。 对所有对求和，$$\mathbb{E}[X_P]\le \binom{|P|}{2}2^{-l},\qquad \mathbb{E}[X_Q]\le \binom{|Q|}{2}2^{-l}.$$自从$|P|=|Q|=2^t$,$$\mathbb{E}[X_P+X_Q]\le 2\binom{2^t}{2}2^{-l} < 2^{2t-l}.$$一对$(a,b)$可以被固定，以便同时$$X_P+X_Q \le 2^{2t-l}.$$对于这样的选择，最多$2^{2t-l}$每个图像集中都会发生碰撞，因此至少$$|P|-2^{2t-l},\qquad |Q|-2^{2t-l}$$元素参与无碰撞类。 

每个无碰撞类别都贡献独特的价值$I$或者$J$， 所以$$|I|\ge |P|-2^{2t-l},\qquad |J|\ge |Q|-2^{2t-l}.$$假设$$2^l-1 \le \frac{2^{t-1}\varepsilon}{1-\varepsilon}$$重排后意味着$$2^{2t-l}\le \varepsilon 2^l.$$因此$$|I|\ge (1-\varepsilon)2^l,\qquad |J|\ge (1-\varepsilon)2^l.$$这样就完成了 (a) 部分。 

### (b) 的构造和注入性$g$在$Q''$让$J={j_1,\dots,j_{|J|}}$和$0=j_1<\cdots<j_{|J|}<2^l$。 选择$Q'={q_1,\dots,q_{|J|}}\subseteq Q$这样$h(q_k)=j_k$。 

定义$$g(q)=(aq\gg(n-l+1))\bmod 2^{l-1},$$中间$l-1$的位$aq$。 

让$$Q''=\{q_1,q_3,\dots,q_{2\lceil |J|/2\rceil-1}\}.$$如果$q_i,q_j\in Q''$和$i<j$， 然后$h(q_i)\ne h(q_j)$以及他们的主导$l$位图像不同。 截断定义$g$删除最低有效位$h(q)$以及分隔相邻桶的携带信息。 订购方式$j_1<\cdots<j_{|J|}$确保不同的奇数索引元素$J$位于不相交的余数区间模中$2^{l-1}$。 

如果$g(q_i)=g(q_j)$， 然后$h(q_i)$和$h(q_j)$同意楼上的$l-1$位，因此仅在最低位有所不同。 这迫使$h(q_i)=h(q_j)$或相邻的碰撞对，与元素的独特性相矛盾$J$以及建设$Q'$。 所以$g$是单射的$Q''$。 

### (c) 建设$Q^*$定义$$Q^*=\{q\in Q''\mid g(q)\ \text{even and } g(q)+g(p)=2^{l-1}\ \text{for some }p\in P\}.$$均匀度限制$g(q)$到残基类模的子集$2^{l-1}$。 条件$g(p)+g(q)=2^{l-1}$配对互补的中间位值，分区${0,\dots,2^{l-1}-1}$成不相交的补语。 

的内射性$g$在$Q''$意味着每个$q$最多贡献一个可接受的配对。 自从$|P|$足够大至少覆盖$(1-\varepsilon)2^{l-1}$残留物，每个允许的$g(q)$有相应的合作伙伴$P$。 

因此$Q^*$满足定理 X 的条件 (120)，即 的一个大子集之间存在匹配$P$和$Q$在中间位互补的情况下。 

### (d) 大小$Q^*$从(a)部分来看，至少$(1-\varepsilon)2^l$价值观在于$J$，因此至少有一半贡献于$Q''$, 给予$$|Q''|\ge \frac{1}{2}(1-\varepsilon)2^l.$$的内射性$g$确保最多$2^{l-2}$残基被奇偶校验和补码约束排除。 结合密度$P$图像，$$|Q^*|\ge (1-2\varepsilon)2^{l-1}.$$这个下界满足定理X的要求，完成足够大的结构化子集的构造$Q^*$。 

这样就完成了证明。 ∎

 ## 验证

 (a) 中的参数仅使用练习 6.4-78 中的成对独立性和期望的线性度，并且所有碰撞边界都按比例缩放$\binom{2^t}{2}2^{-l}$。 

从冲突计数到不同图像计数的转变利用每次冲突可以将不同哈希的数量最多减少一个代表，这是分桶参数中的标准。 

(b) 部分依赖于$g$仅限于奇数索引代表$J$，这是根据截断后消除最低位模糊性得出的。 

(c) 部分使用补码配对${0,\dots,2^{l-1}-1}$，以及约束$g(p)+g(q)=2^{l-1}$强制执行条件（120）所需的完美匹配结构。 

(d) 部分根据限制条件下的密度保持得出$Q''$和单射性$g$。 

## 注释

 该结构是通用散列的标准两级应用：首先压缩为$l$位同时控制碰撞，然后使用中间进行细化$l-1$产生残基模配对图的位$2^{l-1}$。 奇数乘数条件为$a$确保截断在高位块和中位块之间保留足够的独立性，这对于单射性步骤至关重要。
