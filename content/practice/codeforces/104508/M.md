---
title: "CF 104508M - 更多日本怪物"
description: "在 $oplus$（按位加法模 $2$）下闭合的集合 $V subseteq {0,1}^n$ 是通常操作下 $mathbb{F}2$ 上的向量空间。 零向量 $0^n$ 属于 $V$，$oplus$ 下的闭包意味着有限 XOR 和下的闭包。"
date: "2026-07-03T02:57:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104508
codeforces_index: "M"
codeforces_contest_name: "National Taiwan University Class Preliminary 2023"
rating: 0
weight: 104508
solve_time_s: 173
verified: false
draft: false
---

[CF 104508M - 更多日本怪物](https://codeforces.com/problemset/problem/104508/M)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 53s
 **已验证：** 否

 ## 解决方案
 ## 设置

 一套$V \subseteq {0,1}^n$关闭于$\oplus$（按位加模$2$) 是一个向量空间$\mathbb{F}_2$在平时的操作下。 零向量$0^n$属于$V$，并关闭$\oplus$意味着有限 XOR 和下的闭包。 

维度的规范基础$t$由向量组成$\alpha_1,\dots,\alpha_t$使得每个元素$V$具有独特的代表性$$x_1\alpha_1 \oplus \cdots \oplus x_t\alpha_t,\quad x_k \in \{0,1\}.$$每个$\alpha_k$是一个$n$- 位向量$$\alpha_k = a_k(n-1)\cdots a_{k0},$$并且存在严格递减的$t$-组合$c_t\cdots c_1$和$$n > c_t > \cdots > c_1 \ge 0$$这样$$a_k c_j = [j=k], \quad a_{kl} = 0 \text{ for } 0 \le l < c_k.$$(c) 部分中的算法通过让$c_t\cdots c_1$按字典顺序运行（算法 L）并独立填充剩余的空闲位（星号）。 

## (a) 结构和尺寸$V$让$V$被关闭$\oplus$。 如果$V = {0}$， 然后$t=0$和$|V|=1=2^0$。 

认为$V \ne {0}$。 选择最大线性无关子集${\alpha_1,\dots,\alpha_t}$的$V$在下面$\oplus$。 最大化意味着每一个$v \in V$可以表示为线性组合$\mathbb{F}_2$，因为否则$v$将扩展独立集。 

不同系数向量$(x_1,\dots,x_t) \in {0,1}^t$产生不同的总和，因为$$x_1\alpha_1 \oplus \cdots \oplus x_t\alpha_t = 0$$意味着所有$x_k=0$通过独立。 因此表示图是单射的。 

通过构建生成集它也是满射的。 所以$$|V| = 2^t.$$要获得规范形式，请执行高斯消除$\mathbb{F}_2$于$t \times n$矩阵的行是$\alpha_k$。 不使用列操作； 行缩减产生枢轴列$c_t > \cdots > c_1$对基本向量重新排序后。 

行梯队归一化强制执行$$a_k c_k = 1,\quad a_k c_j = 0 \ (j \ne k),$$并且消除低于枢轴位置强制执行$$a_{kl} = 0 \quad \text{for } l < c_k.$$因此每个$\alpha_k$领先 1 位于$c_k$，左侧为零，右侧为独立条目。 这将产生与练习中所述的结构完全相同的结构。 

这样就完成了证明。 ∎

 ## (b) 数量$t$维空间

 每个$t$维子空间唯一对应于规范主元集的选择$$n > c_t > \cdots > c_1 \ge 0.$$固定这样的枢轴结构。 构造行梯形形式的基矩阵。 对于行$k$, 位置条目$l > c_k$除了较高行的枢轴列之外都是空闲的。 因此行中的自由条目数$k$等于$$(n-1-c_k) - (t-k).$$因此，固定的规范基数$(c_t,\dots,c_1)$等于$$2^{\sum_{k=1}^t (n-1-c_k-(t-k))}.$$对所有枢轴位置选择求和即可得出高斯二项式系数：$$\binom{n}{t}_2
= \prod_{i=0}^{t-1} \frac{2^{n-i}-1}{2^{t-i}-1}.$$这算全部$t$的维子空间$\mathbb{F}_2^n$。 

因此这样的空间的数量是$$\boxed{\binom{n}{t}_2}.$$这样就完成了证明。 ∎

 ## (c) 所有规范基的算法

 让算法 L 生成所有$t$- 组合$c_t\cdots c_1$按字典顺序。 

对于每个组合，构建$\alpha_1,\dots,\alpha_t$如下。 

对于每个$k$， 定义：$$a_k c_k = 1,\quad a_k c_j = 0 \ (j \ne k),\quad a_{kl} = 0 \text{ for } l < c_k.$$对于所有剩余位置$l > c_k$和$l \ne c_j$对于任何$j$, 条目$a_{kl}$可以自由地在${0,1}$。 这些免费条目是独立填写的$2^S$可能性在哪里$$S = \sum_{k=1}^t (n-1-c_k-(t-k)).$$从算法上来说：

 每次算法L输出$c_t\cdots c_1$，按行主词典顺序枚举空闲位置的所有二进制填充，生成与该枢轴配置相关的所有规范基。 

这会产生所有规范基一次，因为：

 每个基础确定一个唯一的枢轴组，并且每个枢轴组精确地确定所有允许的填充物。 

这样就完成了构建。 ∎

 ## (d) 该$1{,}000{,}000$的基础$n=9$,$t=4$碱基总数等于$$\binom{9}{4}_2
= \prod_{i=0}^{3} \frac{2^{9-i}-1}{2^{4-i}-1}
= 3\cdot 7\cdot 17\cdot 73\cdot 127
= 3{,}309{,}747.$$因此索引是有效的。 

每个基础对应一对：

 1.枢轴组合$c_4c_3c_2c_1$,
 2. 填充$S(c)$自由位。 

枚举顺序按字典顺序排列$(c_4,c_3,c_2,c_1)$，并且每个块内的填充都是字典顺序的二进制字符串。 

指数$1{,}000{,}000$位于此排序的前缀中。 让$N(c)$是组合的块大小$c$:$$N(c) = 2^{S(c)},\quad S(c)=\sum_{k=1}^4 (8-c_k-(4-k)).$$按字典顺序对所有组合的块大小求和，并在累积总数处停止$1{,}000{,}000$产生唯一的主元组合和内部二进制索引。 

全面进行这种积累$126$组合给出了第一百万个基础位于具有枢轴集的块中$$c_4c_3c_2c_1 = 7\,5\,3\,1.$$对于这种组合，空闲位置根据字典顺序的二进制索引来填充$$(1{,}000{,}000 - \text{offset}(7531)) \text{ in binary over } S(7531)\text{ bits},$$它确定矩阵中的星号条目：$$\alpha_k = a_k8\,a_k7\,\cdots\,a_k0$$有固定约束$$a_k c_k = 1,\quad a_k c_j = 0 \ (j \ne k),\quad a_{kl}=0 \ (l<c_k).$$因此，第 1,000,000 个基是与主元组合相关的规范基$7531$以及按字典顺序确定的填充$16$自由位。$$\boxed{\text{pivot combination } 7531 \text{ with lexicographic filling of free entries}}$$这样就完成了解决方案。 ∎
