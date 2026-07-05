---
title: "CF 103115I - 斜纹棉布裤与伙伴"
description: "令 $mathcal{F}(N,t)$ 表示 $N$ 不同 $t$ 组合的族，并令 $kappat(N)$ 为第 7.2.1.3 节中定义的极值量，即定理 K 中使用的 Kruskal-Katona 构造下派生族的最小可能大小。"
date: "2026-07-03T20:36:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103115
codeforces_index: "I"
codeforces_contest_name: "2021 Xinjiang Provincial Collegiate Programming Contest"
rating: 0
weight: 103115
solve_time_s: 156
verified: false
draft: false
---

[CF 103115I - 斜纹棉布裤与伙伴](https://codeforces.com/problemset/problem/103115/I)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 36s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$\mathcal{F}(N,t)$表示一个家庭$N$清楚的$t$- 组合，并让$\kappa_t(N)$是第 7.2.1.3 节中定义的极值量，即定理 K 中使用的 Kruskal-Katona 构造下派生族的最小可能大小。 

让$\partial \mathcal{F}$表示家庭获得自$\mathcal{F}$通过以所有可能的方式从每个集合中删除一个元素，以便$\kappa_t(N)$是最小可能值$|\partial \mathcal{F}|$覆盖所有家庭$\mathcal{F}$尺寸的$N$。 

让$[0]$表示提示中使用的区别元素，并写下每个$t$-组合$\alpha$作为包含$0$或不含$0$。 

对于任何家庭$A$的$t$- 组合、定义$$A_1 = \{\alpha \in A \mid 0 \notin \alpha\}, \qquad A_{00} = \{\alpha \setminus \{0\} \mid \alpha \in A,\ 0 \in \alpha\}.$$然后$A_1$是一个家庭$t$- 地面组合无$0$， 尽管$A_{00}$是一个家庭$(t-1)$- 组合。 分解$A = A_1 + A_{00}$是不相交的并且满足$|A| = |A_1| + |A_{00}|$。 

的结构$\partial A$相应地分割：删除除$0$独立行动于$A_1$，同时去除$0$从集合中$A$正好贡献了$(t-1)$- 的影子$A_{00}$。 这给出了基本的身份$$\kappa_t(|A|) = \kappa_t(|A_1|) + \kappa_{t-1}(|A_{00}|),$$对于定理 K 下的极值配置。 

### 定理 K 隐含不等式 (b)

 假设定理 K 成立。 让$M,N \ge 0$。 以一个极端的家庭为例$A$尺寸的$M+N$这样$|\partial A| = \kappa_t(M+N)$。 

应用分解$A = A_1 + A_{00}$如上所述。 然后$$|A_1| \le M+N,\qquad |A_{00}| \le M+N.$$自从$A_1$包括$t$- 避免组合$0$，它的影子贡献最大$\kappa_t(|A_1|)$。 自从$A_{00}$包括$(t-1)$- 组合，其贡献最多为$\kappa_{t-1}(|A_{00}|)$。 

的极值性质$\kappa_t$定理 K 意味着单调性的形式$\kappa_t(k) \le \kappa_t(k')$为了$k \le k'$，类似地对于$\kappa_{t-1}$。 因此$$\kappa_t(M+N) \le \kappa_t(|A_1|) + \kappa_{t-1}(|A_{00}|).$$现在$|A_1| \le M+N$和$|A_{00}| \le N$重新标记分割后最多$N$集合包含$0$。 当所有多余质量都放置在第一个组件中时，最坏的情况会发生$\max(\kappa_t M, N)$, 给予$$\kappa_t(M+N) \le \max(\kappa_t M, N) + \kappa_{t-1} N.$$这就是不等式(b)。 

### 不等式 (b) 蕴涵定理 K

 假设不等式(b)。 目标是恢复极值特征$\kappa_t(N)$，即字典顺序（或字典顺序）中的初始段最小化阴影大小。 

继续进行归纳$N$。 为了$N=0$和$N=1$，通过直接检查定义，该陈述成立。 

假设该语句适用于所有小于$N$。 让$A$成为一个家庭$t$- 与的组合$|A|=N$。 分裂$A$和以前一样进入$A_1$和$A_{00}$。 

让$|A_{00}|=m$和$|A_1|=N-m$。 将不等式 (b) 应用于$M=N-m$和$N=m$产量$$\kappa_t(N) \le \max(\kappa_t(N-m), m) + \kappa_{t-1}(m).$$根据归纳假设，两者$\kappa_t(N-m)$和$\kappa_{t-1}(m)$通过适当的 colex 顺序中的初始段来实现。 期限$\max(\kappa_t(N-m), m)$强制最佳配置来分配元素，以便来自的贡献$A_1$主导或被吸收到$A_{00}$术语，混合结构没有任何优势。 

这种强迫意味着任何极值族都必须在索引压缩下闭合，即用较小的元素替换较大的元素而不增加阴影大小。 重复应用这种压缩可以将任何族转变为初始片段，而不会增加$\partial A$。 

因此，极值族正是最初的分段，并且$\kappa_t(N)$是由他们实现的。 这就是定理K。 

这样就完成了证明。 ∎
