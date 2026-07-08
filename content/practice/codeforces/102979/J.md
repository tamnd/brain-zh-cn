---
title: "CF 102979J - 俊基姆的比赛"
description: "让 $U$ 表示多重组合 (92) 的基础集合。 在表示（6）中，每个多重组合都是一个非增序列 $$dt ge d{t-1} ge cdots ge d1,qquad s ge dt,$$ 其相对于 $U$ 的补码是通过取 $U$ not… 的元素形成的"
date: "2026-07-04T04:10:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102979
codeforces_index: "J"
codeforces_contest_name: "2020-2021 Winter Petrozavodsk Camp, Day 9 Contest (XXI Open Cup, Grand Prix of Suwon)"
rating: 0
weight: 102979
solve_time_s: 138
verified: false
draft: false
---

[CF 102979J - Junkyeom 竞赛](https://codeforces.com/problemset/problem/102979/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 18s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$U$表示多重组合 (92) 的基础集合。 在表示式(6)中，每个多重组合都是一个非增序列$$d_t \ge d_{t-1} \ge \cdots \ge d_1,\qquad s \ge d_t,$$及其关于的补充$U$是由以下元素组成$U$不由给定的选择表示，然后将它们再次写为相同类型的非递增序列。 提示明确列出了这些补充：$$3211,\;3210,\;3200,\;3110,\;3100,\;3000,\;2110,\;2100,\;2000,\;1100,\;1000.$$在(92)的设置中，每个对象$U$通过多重组合中的成员资格或补集中的成员资格仅表示一次，因此补集定义了映射$$\mathcal{C}: \mathcal{M}_{s,t} \to \mathcal{M}_{t,s},$$在哪里$\mathcal{M}_{s,t}$表示多重组合的集合 (92)。 该定义内部仅使用集合补码$U$，因此对于任何多重组合$A \subseteq U$,$$\mathcal{C}(A) = U \setminus A.$$应用两次补码可以恢复原始集合，因为$$U \setminus (U \setminus A) = A,$$所以$\mathcal{C}$是对合。 这意味着$\mathcal{C}$是所考虑的对象族与其图像之间的双射。 

(92)的结构在参数上是对称的$s$和$t$因为选择的补集$t$元素来自$(s+t)$-元素宇宙是一个选择$s$来自同一个宇宙的元素。 在多组合编码（6）中，这种对称性对应于替换序列$(d_t,\dots,d_1)$通过提示中列出的互补序列，它又是非递增的并且满足与$s$和$t$互换了。 

因此，补码操作会转换计数中的每个配置$\partial$推论 C 的一半变成一个独特的配置，算在相反的位置$\partial$一半，相反，因为$\mathcal{C}$是它自己的逆。 这在两个类之间建立了双射。 

因此，任何身份或声明证明一个人$\partial$一半适用于另一半$\partial$一半是通过补双射传输物体。 

这样就完成了证明。 ∎
