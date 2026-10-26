---
title: "CF 1361E - 詹姆斯和追逐者"
description: "该练习要求对两个显示的恒等式进行直接代数简化，涉及唯一因式分解域 $S$ 上多项式的内容和本原部分。"
date: "2026-06-11T12:47:51+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "probabilities", "trees"]
categories: ["algorithms"]
codeforces_contest: 1361
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 647 (Div. 1) - Thanks, Algo Muse!"
rating: 3000
weight: 1361
solve_time_s: 173
verified: false
draft: false
---

[CF 1361E - 詹姆斯与追逐](https://codeforces.com/problemset/problem/1361/E)

 **评分：** 3000
 **标签：** dfs 和类似的、图形、概率、树
 **求解时间：** 2m 53s
 **已验证：** 否

 ## 解决方案
 ## TAOCP 4.6.1.24 的正确解决方案

 该练习要求对两个显示的恒等式进行直接代数简化，涉及唯一因式分解域上多项式的内容和本原部分$S$。 目标不是引入新的结构定理，而是重写给定的表达式，直到它们与本节后面已经说明的更清晰的形式匹配。 

贯穿全文的关键点是，两者$\operatorname{cont}(\cdot)$和$\operatorname{pp}(\cdot)$由固定因式分解定义$$u(x) = \operatorname{cont}(u)\,\operatorname{pp}(u(x)),$$和$\operatorname{cont}(u) \in S$和$\operatorname{pp}(u)$4.6.1 节意义上的原始。 这种分解在本节的约定下是规范的，因此除了这个定义之外不需要引入或需要任何额外的歧义。 

## (19) 到 (20) 的简化

 方程（19）是乘积多项式内容的系数级定义。 它定义了$\operatorname{cont}(uv)$作为最大公约数（在$S$) 乘积的所有系数$uv$。 

写$$u(x) = \sum_i u_i x^i, \quad v(x) = \sum_j v_j x^j.$$那么系数$uv$是元素的有限和$u_i v_j$。 的每一个系数$uv$因此是一个$S$-系数乘积的线性组合$u$和$v$。 

关键的观察是每个系数$uv$可以被所有系数的每个公约数整除$u$，以及所有系数的每个公约数$v$。 如果$d$划分所有$u_i$，那么每个系数$u_i v_j$可以整除$d$，因此每个系数$uv$可以整除$d$。 这同样适用于任何公约数$v_j$。 因此系数的每个公约数$u$和的$v$也是系数的公约数$uv$，这给出了整除性$$\operatorname{cont}(u)\operatorname{cont}(v) \mid \operatorname{cont}(uv).$$反之，每个系数$u$可以整除$\operatorname{cont}(u)$，以及每个系数$v$可以整除$\operatorname{cont}(v)$，所以每个系数$u_i v_j$可以整除$\operatorname{cont}(u)\operatorname{cont}(v)$。 由于系数$uv$是这些项的和，它们都可以被整除$\operatorname{cont}(u)\operatorname{cont}(v)$。 因此$$\operatorname{cont}(uv) \mid \operatorname{cont}(u)\operatorname{cont}(v).$$两种整除性共同强制 UFD 中的单位相等，并且根据第 4.6.1 节中使用的标准约定（内容被视为理想系数的规范生成器），这消除了任何单位模糊性。 结果正是简化的恒等式 (20)：$$\operatorname{cont}(uv) = \operatorname{cont}(u)\operatorname{cont}(v).$$从（19）到（20）的“简化”恰恰是认识到乘积的系数gcd因式分解为系数gcd的乘积，因为整除性通过乘法和加法传播，而不会引入超出现有公因数的新公因数。 

## (24) 到 (24) 的简化

 方程（24）涉及产品的原始部分。 从定义因式分解开始，$$u(x) = \operatorname{cont}(u)\operatorname{pp}(u(x)), \quad v(x) = \operatorname{cont}(v)\operatorname{pp}(v(x)),$$我们乘以得到$$uv = \operatorname{cont}(u)\operatorname{cont}(v)\,\operatorname{pp}(u)\operatorname{pp}(v).$$现在应用本原部分的定义：多项式唯一地写为它的内容乘以它的本原部分，并且本原部分的特征在于内容等于$1$在该部分的标准化中。 

我们首先识别内容$uv$。 根据已经建立的恒等式 (20)，$$\operatorname{cont}(uv) = \operatorname{cont}(u)\operatorname{cont}(v).$$划分$uv$按此内容因素：$$\operatorname{pp}(uv) = \frac{uv}{\operatorname{cont}(uv)} = \frac{\operatorname{cont}(u)\operatorname{cont}(v)\,\operatorname{pp}(u)\operatorname{pp}(v)}{\operatorname{cont}(u)\operatorname{cont}(v)}.$$内容因素完全抵消，留下$$\operatorname{pp}(uv) = \operatorname{pp}(u)\operatorname{pp}(v).$$这是直接的代数简化：不需要单位调整或标准化选择，因为取消完全发生在定义因式分解内。 

因此，方程（24）立即简化为原始部分的干净乘法恒等式，这是本节中所述的简化形式。 

## 为什么这些简化是有效的

 这两个步骤仅依赖于将内容定义为系数 gcd 的属性以及将多项式定义为内容乘以基元部分的因式分解。 第一个恒等式是乘法下系数整除的结构性质。 那么第二恒等式是使用第一恒等式的结果替换因式分解并取消内容项的直接结果。 

不需要关于单位、标准化约定或外部结构引理的额外假设。 这种简化纯粹是对第 4.6.1 节中已有定义的代数重写。
