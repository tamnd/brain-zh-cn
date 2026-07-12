---
title: "CF 103336B - 音乐节"
description: "令 $rs,dots,r0$ 满足 $$t = rs + cdots + r1 + r0,qquad 0 le rj le mjquad (s ge j ge 0)。$$ 写入 $$Mj = sum{i=0}^j mi,qquad Tj = t - sum{i=j+1}^s ri,$$ 所以 $Tj$ 是要在索引 $0,dots,j$ 之间分配的剩余总和 修复 $rs,dots,r{j+1}$ 后。"
date: "2026-07-03T14:00:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103336
codeforces_index: "B"
codeforces_contest_name: "OPEI 2021 - Senior"
rating: 0
weight: 103336
solve_time_s: 157
verified: false
draft: false
---

[CF 103336B - Festival de Presentes](https://codeforces.com/problemset/problem/103336/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 37s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$r_s,\dots,r_0$满足$$t = r_s + \cdots + r_1 + r_0,\qquad 0 \le r_j \le m_j \quad (s \ge j \ge 0).$$写$$M_j = \sum_{i=0}^j m_i,\qquad T_j = t - \sum_{i=j+1}^s r_i,$$所以$T_j$是要在指数之间分配的剩余金额$0,\dots,j$固定后$r_s,\dots,r_{j+1}$。 

在位置$j$，值$r_j$受到完成作文的可行性的限制。 选择后$r_j$, 剩余值$T_{j-1} = T_j - r_j$必须满足$$0 \le T_{j-1} \le M_{j-1}.$$因此$$T_j - M_{j-1} \le r_j \le T_j,$$与...一起$0 \le r_j \le m_j$。 因此，允许的间隔是$$L_j = \max(0,\, T_j - M_{j-1}),\qquad U_j = \min(m_j,\, T_j).$$字典顺序为$(r_s,\dots,r_0)$被采取与$r_s$最重要的是，所以$r_0$变化最快。 

第一个解决方案是通过选择每个组件的最小可行值来获得的$T_s = t$:$$r_j = L_j \quad (s \ge j \ge 0).$$### 算法 B（有界组合）

 哨兵$M_{-1} = 0$,$r_{s+1} = 0$用于统一索引。 

**B1。 [初始化。]** 设置$r_j \leftarrow 0$为了$0 \le j \le s$。 放$r_{s+1} \leftarrow 0$。 放$T \leftarrow t$。 计算$M_j = \sum_{i=0}^j m_i$为了$0 \le j \le s$。 

为了$j$从$s$下降到$0$， 放$$r_j \leftarrow \max(0,\, T - M_{j-1}),$$然后更新$T \leftarrow T - r_j$。 

**B2。 [访问。]** 访问$(r_s,\dots,r_0)$。 

**B3。 [寻找$j$。]** 放$j \leftarrow 0$。 尽管$j \le s$和$$r_j = U_j,$$放$j \leftarrow j+1$。 

**B4。 [完成？]** 如果$j > s$，终止。 

**B5。 [增加$r_j$。]** 放$T \leftarrow T + r_j$。 代替$r_j \leftarrow r_j + 1$。 那么对于$k = j-1, j-2, \dots, 0$， 放$$r_k \leftarrow L_k(T),$$在哪里$L_k(T) = \max(0,, T - M_{k-1})$用当前剩余金额计算$T$，并更新$T \leftarrow T - r_k$。 返回B2。 

正确性来自于不变量$T_j$和可行性界限。 在每个步骤 B3 中，索引$0,\dots,j-1$都处于最大可行值，因此任何增量$r_j$保留后缀的字典最小性。 步骤B5在更新后的剩余金额下恢复最小可行完成，确保产生下一个词典编排。 当没有索引可以增加时，就会发生耗尽，这相当于$r_j = U_j$为所有人$j$，因此所有有界组合都会生成一次且仅生成一次。 

这样就完成了证明。 ∎
