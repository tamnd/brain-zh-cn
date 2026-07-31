---
title: "CF 104068H - 托克塞尔 \u4e0e\u5b9d\u53ef\u68a6\u5bf9\u6218\u7279\u8bad"
description: "令 $Gamma = (alpha0,ldots,alpha{t-1})$、$Gamma' = (alpha'0,ldots,alpha'{t'-1})$ 和 $Gamma'' = (alpha''0,ldots,alpha''{t''-1})$。"
date: "2026-07-02T03:05:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104068
codeforces_index: "H"
codeforces_contest_name: "The 17-th Beihang University Collegiate Programming Contest (BCPC 2022) - Preliminary"
rating: 0
weight: 104068
solve_time_s: 94
verified: false
draft: false
---

[CF 104068H - 托克塞尔\u4e0e\u5b9d\u53ef\u68a6\u5bf9\u6218\u7279\u8bad](https://codeforces.com/problemset/problem/104068/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 34s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$\Gamma = (\alpha_0,\ldots,\alpha_{t-1})$,$\Gamma' = (\alpha'_0,\ldots,\alpha'_{t'-1})$， 和$\Gamma'' = (\alpha''_0,\ldots,\alpha''_{t''-1})$。 Boustropedon 产品$\Gamma ,\≀, \Gamma'$形成所有串联的序列$\alpha_i\alpha'_j$在哪里$0 \le i < t$和$0 \le j < t'$，通过扫描排序$j$从左到右时$i$是偶数且从右到左，当$i$很奇怪。 

该乘积的结构与（5）中格雷序列的标准递归构造相同，并且该观察结果决定了证明策略。 关键事实是对于每一个$n \ge 1$，格雷序列$\Gamma_n$满足$$\Gamma_n = (0,1) \,\≀\, \Gamma_{n-1}.$$该身份修复了以下行为$\Gamma_n$唯一地，因为 (5) 递归地确定整个序列$\Gamma_0 = \epsilon$。 

定义二元运算$\star$在序列上$\Gamma \star \Gamma' = \Gamma ,\≀, \Gamma'$。 我们首先证明对于每个$m,n \ge 0$，序列$\Gamma_m \star \Gamma_n$满足与以下相同的定义递归$\Gamma_{m+n}$。 

案例$m=0$产量$\Gamma_0 \star \Gamma_n = (\epsilon) \star \Gamma_n = \Gamma_n$，匹配$\Gamma_{0+n}$。 认为$\Gamma_m \star \Gamma_n = \Gamma_{m+n}$保持一个固定的$m$。 使用格雷码的定义递归，$\Gamma_{m+1} = (0,1) \star \Gamma_m$。 所以$$\Gamma_{m+1} \star \Gamma_n
= ((0,1) \star \Gamma_m) \star \Gamma_n.$$如果操作$\star$是结合律，这等于$$(0,1) \star (\Gamma_m \star \Gamma_n)
= (0,1) \star \Gamma_{m+n}
= \Gamma_{m+n+1}.$$因此结合性意味着复合规则$\Gamma_{m+n} = \Gamma_m \star \Gamma_n$。 

仍然需要直接根据定义的排序规则来验证关联性。 产生的每一个元素$\Gamma \star \Gamma'$由一对唯一确定$(i,j)$，并且它在序列中的位置仅取决于是否$i$是偶数还是奇数。 写作$\Gamma \star \Gamma'$作为按对索引的序列$(i,j)$，对的相对顺序是字典顺序的$i$，而每个固定内的顺序$i$要么增加要么减少$j$根据奇偶性$i$。 连接与$\Gamma''$现在再次应用相同的规则到索引对集合$(i,j)$。 

在$(\Gamma \star \Gamma') \star \Gamma''$，每个三元组$(i,j,k)$由配对首先订购$(i,j)$根据 boustropedon 规则，然后在每个这样的对中$k$增加或减少取决于位置的奇偶性$(i,j)$在$\Gamma \star \Gamma'$。 在$\Gamma \star (\Gamma' \star \Gamma'')$，同一个三元组$(i,j,k)$首先订购的是$i$，然后由$(j,k)$在每个块内，反转仅由奇偶校验控制$i$和$j$。 

关键是位置的对等$(i,j)$在$\Gamma \star \Gamma'$仅取决于$i$和$j$通过固定的线性规则模$2$，与序列如何加括号无关。 因此，规则确定是否$k$-顺序是向前还是向后仅取决于$(i,j)$而不是在分组上。 由于两种结构在所有三元组上产生相同的顺序$(i,j,k)$，所得序列一致。 

因此$$(\Gamma \star \Gamma') \star \Gamma'' = \Gamma \star (\Gamma' \star \Gamma'').$$这样就完成了证明。 ∎
