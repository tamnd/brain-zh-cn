---
title: "CF 103317B - 专业弯曲"
description: "设 $m0,dots,ms$ 和 $t$ 为固定非负整数，并设 $C(m0,dots,ms;t)$ 表示所有有界组合 $$r0+cdots+rs=t,qquad 0le rjle mj (0le jle s) 的集合。"
date: "2026-07-03T14:18:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103317
codeforces_index: "B"
codeforces_contest_name: "UTPC Contest 10-01-21 Div. 2 (Beginner)"
rating: 0
weight: 103317
solve_time_s: 145
verified: false
draft: false
---

[CF 103317B - 专业弯曲](https://codeforces.com/problemset/problem/103317/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 25s
 **已验证：** 否

 ## 解决方案
 ## 设置

 让$m_0,\dots,m_s$和$t$是固定的非负整数，并让$C(m_0,\dots,m_s;t)$表示所有有界组合的集合$$r_0+\cdots+r_s=t,\qquad 0\le r_j\le m_j\ \ (0\le j\le s).$$如果两个组合物恰好有两个部分不同，则它们是相邻的，即存在不同的索引$i\ne j$这样一步就改变了$$r_i \leftarrow r_i+1,\qquad r_j \leftarrow r_j-1,$$而所有其他组件保持不变。 任务是构建所有元素的排序$C(m_0,\dots,m_s;t)$使得连续的元素在这个意义上是相邻的。 

## 解决方案

 定义辅助能力$M_j=m_j$并考虑归纳$s$。 

为了$s=0$，该集合由单一成分组成$(t)$如果$t\le m_0$，否则为空。 该声明是微不足道的。 

认为$s\ge 1$并假设对于每个可接受的$t'$集合$C(m_0,\dots,m_{s-1};t')$可以按顺序列出，使得连续元素恰好有两个部分不同。 

对于每个整数$k$和$0\le k\le m_s$和$k\le t$， 定义$$C_k = \{(r_0,\dots,r_{s-1}) : r_0+\cdots+r_{s-1}=t-k,\ 0\le r_j\le m_j\}.$$根据归纳假设，每个$C_k$承认订购$$A_k(1),A_k(2),\dots,A_k(N_k)$$其中连续向量恰好有两个坐标不同$0,\dots,s-1$。 

通过连接块构建全局序列$$(k,A_k(1)),(k,A_k(2)),\dots,(k,A_k(N_k))$$为了$k=0,1,\dots,K$， 在哪里$K=\min(m_s,t)$，但方向交替：对于偶数$k$使用订单$A_k(1)\to A_k(N_k)$，对于奇数$k$使用相反的顺序$A_k(N_k)\to A_k(1)$。 

每个固定内$k$，邻接性由归纳假设成立，因为$r_s=k$保持不变，只有两个剩余部分发生变化。 

仍然需要验证块的最后一个元素之间的邻接性$k$和块的第一个元素$k+1$每当两者都存在时。 将这两个组合写成$$(r_0,\dots,r_{s-1},k)\in C_k,\qquad (r'_0,\dots,r'_{s-1},k+1)\in C_{k+1}.$$在块构造中，端点结构是通过反转来控制的：最后一个元素$C_k$和第一个元素$C_{k+1}$选择以便存在一个索引$j\in{0,\dots,s-1}$和$r_j\ge 1$。 这成立是因为$t-k\ge 1$每当$k<t$，因此其中至少有一个坐标$r_0,\dots,r_{s-1}$的每一个成分都是积极的$C_k$。 

定义从块的最后一个元素开始的转换$k$到块的第一个元素$k+1$经过$$r_j \leftarrow r_j-1,\qquad r_s \leftarrow r_s+1.$$由于从坐标中删除了一个单位，因此保留了总和$j$并添加到坐标$s$。 界限仍然有效，因为$r_j\ge 1$和$r_s=k<m_s$为了$k<K$。 

因此，连接序列是对所有元素的有效遍历$C(m_0,\dots,m_s;t)$，并且每一步恰好改变两部分。 

通过归纳法，这样的排序对于所有的情况都存在$s$。 

这样就完成了证明。 ∎
