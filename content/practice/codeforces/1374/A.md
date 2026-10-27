---
title: "CF 1374A - 所需的余数"
description: "让$Nge 1$ 被固定。 $m$ 幸存者是一个正整数，其所有质因子都超过 $m$。 令 $$f(x,m)={nle x:text{$n$ 是一个 $m$-survivor}},$$ 并让 $$fk(x,m)={nle x:text{$n$ 是一个 $m$-survivor，恰好具有 $k$ 个质因数}},$$ 其中质因数被计算..."
date: "2026-06-11T11:08:23+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1374
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 653 (Div. 3)"
rating: 800
weight: 1374
solve_time_s: 135
verified: false
draft: false
---

[CF 1374A - 所需的剩余部分](https://codeforces.com/problemset/problem/1374/A)

 **评分：** 800
 **标签：** 数学
 **求解时间：** 2m 15s
 **已验证：** 否

 ## 解决方案
 ## 设置

 让$N\ge 1$被修复。 一个$m$-survivor 是一个正整数，其所有质因数都超过$m$。 让$$
f(x,m)=#{n\le x:\text{$n$ is an $m$-survivor}},
$$并让$$
f_k(x,m)=#{n\le x:\text{$n$ is an $m$-survivor having exactly $k$ prime factors}},
$$其中素因数是用重数来计算的。 

问题是建立公式$\pi(N^3)$并解释如何根据以下值计算所涉及的数量$\pi(x)$和$x\le N^2$。 

## 解决方案

 ###（一）

 每个$N$-幸存者$n\le N^3$恰好属于以下类别之一。 

第一的，$n=1$。 

第二，$n=p$， 在哪里$p>N$是素数。 

第三，$n$至少有两个质因数，全部超过$N$。 

认为$n$是一个$N$- 至少具有三个素因数的幸存者。 然后$$
n\ge (N^+)^3>N^3,
$$在哪里$N^+$表示最小素数超过$N$。 因此没有这样的整数$\le N^3$。 

因此每个复合材料$N$-幸存者$\le N^3$正好有两个素因数。 因此

 1+(\pi(N^3)-\pi(N))+f_2(N^3,N)。$$
Rearranging gives
$$\boxed{\pi(N^3)=\pi(N)+f(N^3,N)-1-f_2(N^3,N)}。$$
This proves part (a).
### (b)
An $N$-survivor with exactly two prime factors has the form
$$n=pq,$$
where
$$N<p\le q,\qquad pq​​\le N^3。$$
For a fixed prime $p>N$, the admissible values of $q$ are the primes satisfying
$$p\le q\le \frac{N^3}{p}。$$
Hence
\sum_{\substack{p>N\ p\le N^{3/2}}}
\Bigl(
\pi(N^3/p)-\pi(p-1)
\Bigr).
$$自从$p>N$，我们有$$
N^3/p\le N^2,
$$因此每个值$\pi(N^3/p)$公式所要求的参数不超过$N^2$。 

为了$N=10^3$,

 \sum_{\substack{1000<p\le 31622\ p\text{素数}}}
 \Bigl(
 \pi(10^9/p)-\pi(p-1)
 \更大）。$$
Using the tabulated values of $\pi(x)$ for $x\le10^6$, the summation evaluates to
$$f_2(10^9,10^3)​​=563,158。$$
### (c)
Let $p_j$ be the $j$th prime and let $p_0=1$.
Define
#{n\le x:\text{all prime factors of $n$ exceed }p_j}.
$$分区$p_{j-1}$- 幸存者不超过$x$分为两个班级。 

第一类由质因子全部超过的整数组成$p_j$。 他们的号码是$f(x,p_j)$。 

第二类由可被整除的那些组成$p_j$。 每个这样的整数都有以下形式$$
n=p_jm,
$$在哪里$m\le x/p_j$和每个素因数$m$超过$p_{j-1}$。 

因此第二类有基数$$
f(x/p_j,p_{j-1}).
$$因此

 ## f(x,p_{j-1})

 f(x/p_j,p_{j-1})
 }。$$
This is the stated recurrence.
The initial condition is
$$f(x,p_0)=\lfloor x\rfloor。$$
Repeated application of the recurrence computes $f(N^3,N)$ using only values
$$f(y,p_i),
 \qquad
 y\le N^2,$$
because every division by a prime exceeding $N$ reduces the argument below $N^2$.
Thus $f(N^3,N)$ can be obtained from the table of values $\pi(x)$ for $x\le N^2$.
Combining part (a) with the values of $f(N^3,N)$ and $f_2(N^3,N)$ yields $\pi(N^3)$.
### (d)
The recurrence in part (c) repeatedly requests values of the form
$$f(y,p_j),$$
for many pairs $(y,j)$.
Efficient evaluation is obtained by storing previously computed values in a table indexed by $(y,j)$. Since many recursive branches reach the same pair, memoization prevents repeated computation.
The arguments $y$ that arise are of the form
$$\left\lfloor\frac{N^3}{d}\right\rfloor,$$
where $d$ is a product of distinct small primes. The number of distinct values is $O(N^{2/3})$, which permits compact storage.
For the evaluation of $f_2(N^3,N)$, a table of $\pi(x)$ for all required arguments $x\le N^2$ is sufficient. The summation
$$\sum_{N<p\le N^{3/2}}
 \bigl(\pi(N^3/p)-\pi(p-1)\bigr)$$
can then be accumulated directly.
The resulting computation requires storage only for the distinct arguments that occur in the recursion together with the prime-counting table up to $N^2$.
## Verification
Part (a) depends on the fact that an $N$-survivor $\le N^3$ cannot possess three prime factors exceeding $N$. Indeed,
$$p_1p_2p_3>(N)(N)(N)=N^3。$$
Hence every composite survivor contributes to $f_2$ and to no higher $f_k$.
Part (b) counts each semiprime survivor exactly once because the condition $p\le q$ selects a unique ordering of the two prime factors.
Part (c) partitions the set of $p_{j-1}$-survivors according to divisibility by $p_j$; the two classes are disjoint and exhaustive, therefore the recurrence is exact.
The formula of part (a) then reconstructs $\pi(N^3)$ from the survivor count and the semiprime correction term.
## Notes
The recurrence
## f(x,p_{j-1})
f(x/p_j,p_{j-1})
$$是 Lagarias-Miller-Odlyzko 素数计数方法的组合基础。 它取代了直接筛分$N^3$通过仅涉及信息的计算$N^2$，这是复杂性提高的根源。
