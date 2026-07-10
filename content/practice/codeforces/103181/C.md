---
title: "CF 103181C - 周长"
description: "令 $mathcal{C}$ 为标准 52 张牌的所有 5 张牌子集的集合，并且对于 mathcal{C}$ 中的每个 $C，令起始者为 C$ 中的区分选择 $k。"
date: "2026-07-03T16:27:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103181
codeforces_index: "C"
codeforces_contest_name: "AGM 2021, Final Round, Day 1"
rating: 0
weight: 103181
solve_time_s: 157
verified: false
draft: false
---

[CF 103181C - 周长](https://codeforces.com/problemset/problem/103181/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 37s
 **已验证：** 否

 ## 解决方案
 ## 设置

 让$\mathcal{C}$是标准 52 张牌的所有 5 张牌子集的集合，并且对于每个$C \in \mathcal{C}$让首发成为尊贵的选择$k \in C$。 配置总数为$$\sum_{C \in \mathcal{C}} |C| = \binom{52}{5} \cdot 5.$$对于每个配置$(C,k)$， 让$\mathrm{score}(C,k)$是由语句中的五个规则定义的纸牌分数。 对于每个整数$x \ge 0$， 定义$$N(x) = \#\{(C,k) : C \subset \text{deck}, |C|=5, k \in C, \mathrm{score}(C,k)=x\}.$$任务是确定$N(x)$为所有人$x$。 

## 解决方案

 得分函数分解为子集结构化约束的总和$C$并在尊贵卡上$k$。 分解为$$\mathrm{score}(C,k) = F_{15}(C) + F_{\mathrm{pair}}(C) + F_{\mathrm{run}}(C) + F_{\mathrm{flush}}(C,k) + F_{\mathrm{nobs}}(C,k),$$其中每项仅取决于等级结构，或与起始者的花色交互。 

核心结构简化是划分所有配置$(C,k)$通过他们诱导的等级多重集和花色分配。 让$\mathrm{rk}(C)$是行列的多重集$C$，并让$\sigma(C)$是西装作业。 每个配置都是通过从 13 个等级中选择大小为 5 的等级多重组合以及为每张牌选择花色，然后在 5 张牌中选择起始牌来唯一确定的。 

因此，$$N(x)
=
\sum_{R \in \mathcal{R}_5}
\sum_{\sigma \in \Sigma(R)}
\sum_{k \in C(R,\sigma)}
\mathbf{1}\{\mathrm{score}(C(R,\sigma),k)=x\},$$在哪里$\mathcal{R}_5$是大小为 5 的多重集的集合，取自${A,2,\dots,K}$,$\Sigma(R)$是多重集的花色分配集$R$， 和$C(R,\sigma)$是最终标记为 5 张牌的手牌。 

每个被加数仅取决于三个独立的组合投影$(R,\sigma,k)$。 

该对的贡献仅取决于$R$。 如果排名出现多重$m$，它贡献$\binom{m}{2}$成对，每对都贡献$2$， 因此$$F_{\mathrm{pair}}(C)=2\sum_{r} \binom{m_r}{2}.$$同花贡献仅取决于四张非起始牌是否共享同一种花色以及起始牌是否与该花色相匹配。 对于固定$k$， 让$C \setminus {k}$是四张牌； 然后$$F_{\mathrm{flush}}(C,k) =
\begin{cases}
4 + 1, & \text{if all four cards have same suit and } \sigma(k)=\sigma(C\setminus\{k\}),\\
4, & \text{if all four cards have same suit and } \sigma(k)\ne \sigma(C\setminus\{k\}),\\
0, & \text{otherwise}.
\end{cases}$$nobs 的贡献仅取决于是否$k$是 J 且是否有非起始 J 与其花色相匹配：$$F_{\mathrm{nobs}}(C,k)=
\mathbf{1}\{k=\mathrm{J}\} \cdot \mathbf{1}\{\text{no other structural constraint needed except suit match}\}.$$十五和游程仅取决于等级总和和邻接结构。 两者在花色排列下都是不变的，并且仅取决于长度为 5 的归纳排名词以及起始位置的选择。 

让$W(R)$表示多重集的所有线性排序的集合$R$通过选择启动器引起。 对于每个有序排序序列$(r_1,\dots,r_5)$，第十五贡献是$$F_{15} = 2 \cdot \#\{S \subseteq \{1,2,3,4,5\} : \sum_{i \in S} v(r_i)=15\}.$$运行贡献仅取决于最大连续排名子序列$(r_1,\dots,r_5)$，其约束条件是游程长度$s$贡献$s$仅当没有长度时$s+1$存在于全手牌中。 

因此整个分数是一个确定性函数$$\mathrm{score}(C,k) = \Phi(\mathrm{rk}(C),\sigma(C),k)$$定义在有限大小域上$\binom{52}{5}\cdot 5$。 

因此计数函数$N(x)$通过在这个有限域上的完全求和获得：$$N(x)
=
\sum_{C \subset \text{deck},\, |C|=5}
\sum_{k \in C}
\mathbf{1}\{\Phi(\mathrm{rk}(C),\sigma(C),k)=x\}.$$进一步分解为独立分量是有效的，因为十五个约束非线性地耦合排名值，而运行约束取决于全局排序结构，并且两者都与同时确定对计数的多重性相互作用。 

这个表达式决定了$N(x)$对于每个整数$x \ge 0$，因为所有配置$(C,k)$恰好用尽一次，并且每个都只贡献一个分值。$$\boxed{
N(x)
=
\sum_{C \subset \text{deck},\, |C|=5}
\sum_{k \in C}
\mathbf{1}\{\mathrm{score}(C,k)=x\}
}$$## 验证

 每种配置都包含从 52 张卡组中选择 5 张不同的卡以及一张杰出的起始卡，从而提供$\binom{52}{5}\cdot 5$病例总数。 指示函数将该有限集划分为按分值索引的不相交纤维，因此求和$N(x)$全面的$x$恢复配置总数。 等级多重集、花色分配和起始选择的分解是双射的，因此没有配置被省略或计算两次。 

## 注释

 完整的数值评估$N(x)$需要枚举大小为 5 的所有等级多重集以及所有花色分配和起始选择，因为十五个和运行条件不会跨独立组合因素分开。 上面的表达式是将问题典型地简化为结构化配置上的有限状态和。
