---
title: "CF 1392H - ZS 洗牌"
description: "算法B是二元gcd算法。 减法和移位循环由一次减法组成，然后从所得差值中除去 $2$ 的所有幂。"
date: "2026-06-11T10:13:26+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1392
codeforces_index: "H"
codeforces_contest_name: "Codeforces Global Round 10"
rating: 3000
weight: 1392
solve_time_s: 152
verified: false
draft: false
---

[CF 1392H - ZS 洗牌](https://codeforces.com/problemset/problem/1392/H)

 **评分：** 3000
 **标签：** 组合数学、dp、数学、概率
 **求解时间：** 2m 32s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 算法B是二元gcd算法。 减法和移位循环包括一次减法，然后去除所有幂$2$从由此产生的差异。 练习35要求相应图中的最长路径； 练习 36 要求一个结构达到$m+1$减法步骤。 

拿$$u=2^m,\qquad v=2^n,$$和$m\ge n\ge1$。 

然后$$\lfloor\lg u\rfloor=m,\qquad \lfloor\lg v\rfloor=n,$$因此所需的对数条件成立。 

让我们追踪算法 B。因为两个数字都是$2$，公因数$2^n$被算法 B 的初始化阶段立即删除。工作对变为$$(U,V)=(2^{m-n},1).$$现在考虑当当前对是时的减法和移位循环$$(2^k,1),\qquad k\ge1.$$减法步骤给出$$2^k-1.$$自从$2^k-1$为奇数，不发生偏移。 因此下一个状态是$$(2^k-1,1).$$下面的减法给出$$(2^k-1)-1=2^k-2    =2(2^{k-1}-1).$$算法 B 现在正好删除了一个因子$2$，生产$$(2^{k-1}-1,1).$$重复同样的推理会得到$$(2^{k-1}-1,1) \to (2^{k-2}-1,1) \to\cdots\to (1,1).$$直接计算减法步数更方便。 开始于$(2^k,1)$，较大的条目减少$1$每次减法直到达到相等：$$(2^k,1)\to(2^k-1,1)\to(2^k-2,1)\to\cdots\to(1,1).$$这正好需要$$2^k-1$$减法。 对于当前的练习，我们确切地需要$m+1$减法步骤，不是$2^k-1$。 因此，单独的两个幂并不是所需的结构。 

而是选择$$u=2^m,\qquad v=2^m-(m+1).$$对数条件为$u$是立即的。 自从$$2^{m-1}\le 2^m-(m+1)<2^m \qquad(m\ge3),$$我们有$$\lfloor\lg v\rfloor=m-1.$$这仅涵盖案例$n=m-1$，因此需要更灵活的构造。 

让$$u=2^m,\qquad v=2^n(2^{m-n}-(m+1)).$$然后$$\lfloor\lg u\rfloor=m, \qquad \lfloor\lg v\rfloor=n,$$假如$2^{m-n}>m+1$。 

公因数后$2^n$被删除，算法 B 开始于$$(U,V)=\bigl(2^{m-n},\,2^{m-n}-(m+1)\bigr).$$他们的区别正是$$m+1.$$由于第二个分量超过第一个分量的一半，因此每个减法和移位循环都会将较大的条目减少该差值的一个单位，并且该序列贯穿$$(2^{m-n},\,2^{m-n}-(m+1)),$$

$$(2^{m-n}-(m+1),\,m+1),$$然后通过链条$$(m+1,m),\, (m,m-1),\, \ldots,\, (2,1),\, (1,1).$$减法步数为$$1+m=m+1.$$因此算法 B 准确执行$m+1$减法步骤。 

因此，一个有效的家庭是$$\boxed{ u=2^m,\qquad v=2^n\!\left(2^{m-n}-(m+1)\right) }$$每当$2^{m-n}>m+1$。 本构造满足$$\lfloor\lg u\rfloor=m,\qquad \lfloor\lg v\rfloor=n,$$算法 B 准确地要求$m+1$减法步骤。 ∎
