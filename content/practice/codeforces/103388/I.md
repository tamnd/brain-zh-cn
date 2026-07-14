---
title: "CF 103388I - 反转一切"
description: "将 $N$ 写成二进制形式 $$N = (am a{m-1}dots a0)2 = sum{i=0}^m ai 2^i.$$ 让 $kappat N$ 表示最小整数 $M ge N$，其二进制展开正好包含 $t$ 个，即"
date: "2026-07-03T18:09:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103388
codeforces_index: "I"
codeforces_contest_name: "2021-2022 ACM-ICPC Brazil Subregional Programming Contest"
rating: 0
weight: 103388
solve_time_s: 137
verified: false
draft: false
---

[CF 103388I - 反转一切](https://codeforces.com/problemset/problem/103388/I)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 17s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 写$N$二进制形式$$N = (a_m a_{m-1}\dots a_0)_2 = \sum_{i=0}^m a_i 2^i.$$让$\kappa_t N$表示最小整数$M \ge N$其二进制展开式恰好包含$t$那些，即$$M = \sum_{i \in S} 2^i \quad \text{for some } |S| = t.$$这个定义意味着如果$N$已经有确切的$t$那些，那么$\kappa_t N = N$， 自从$N$是可接受的且数量最少$\ge N$具有相同的属性。 

认为$N$没有确切地$t$那些。 让$j$是最高的位置，使得$M$和$N$略有不同$j$， 在哪里$M = \kappa_t N$。 通过最小化$M$，所有高位都同意：$$a_i(M) = a_i(N) \quad \text{for } i > j,$$并在位置$j$，构建$M$力量$a_j(M)=1$尽管$a_j(N)=0$。 否则可接受的数字较小$\ge N$将最高的 1 放置在低于$j$，与极小性相矛盾。 

全部剩余$t-1$的$M$必须严格位于以下位置$j$。 在所有选择中$t-1$以下职位$j$，通过将它们放置在最低的可用位置来获得最小的可能值$0,1,\dots,t-2$。 这给出了下界$$M \le 2^j + (2^{t-1}-1).$$现在比较一下$N$和$M$。 自从$a_j(N)=0$并且所有高位都一致，差异满足$$M - N \le \bigl(2^j + (2^{t-1}-1)\bigr) - (2^j - 1),$$在哪里$2^j - 1$是较低位的最大可能贡献$N$在进位到位的约束下$j$需要用于$M \ge N$。 这简化为$$M - N \le 2^{t-1}.$$为了表明达到了这个界限，取$$N = 2^m - 1$$对于任何$m \ge t-1$。 然后$N$具有二进制形式，包括$m$那些。 最小整数$\ge N$恰好与$t$必须在位置处放置 1$m$并分配剩余的$t-1$处于最低位置的人，给予$$\kappa_t N = 2^m + (2^{t-1}-1).$$因此$$\kappa_t N - N = \bigl(2^m + (2^{t-1}-1)\bigr) - (2^m - 1) = 2^{t-1}.$$不可能有更大的值，因为前面的参数给出了$\kappa_t N - N \le 2^{t-1}$为所有人$N \ge 0$。 

这样就完成了证明。 ∎$$\boxed{2^{t-1}}$$
