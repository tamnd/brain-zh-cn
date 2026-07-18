---
title: "CF 103648I - 阿黛尔克的鸟群"
description: "令 $x 位于 [0,1)$ 中，并在 {0,1} 中写出其二进展开式 $$x = 0.x1 x2 x3 ldots,qquad xj。$$ 令 $rj(x)$ 表示第 $j$ 个 Rademacher 函数，$$rj(x) = (-1)^{xj}。"
date: "2026-07-02T22:05:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103648
codeforces_index: "I"
codeforces_contest_name: "UTPC Contest 04-08-22 Div. 1 (Advanced)"
rating: 0
weight: 103648
solve_time_s: 133
verified: false
draft: false
---

[CF 103648I - 阿黛尔克的鸟群](https://codeforces.com/problemset/problem/103648/I)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 13s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$x \in [0,1)$并写出它的二元展开式$$x = 0.x_1 x_2 x_3 \ldots,\qquad x_j \in \{0,1\}.$$让$r_j(x)$表示$j$-th Rademacher 函数，$$r_j(x) = (-1)^{x_j}.$$让$k$有二进制展开$$k = (b_m \cdots b_1 b_0)_2,\qquad b_j \in \{0,1\},$$并让 Walsh 函数定义为$$w_k(x) = \prod_{j \ge 0} r_{j+1}(x)^{b_j}.$$### 下的变换$x \mapsto 1-x$对于二元展开式，替换$x$经过$1-x$翻转每个二进制数字，即每个 Rademacher 函数改变符号：$$r_j(1-x) = -r_j(x),$$自从$j$-th 二进制数字在下补码$x \mapsto 1-x$在二元系统中，因此$(-1)^{(1-x_j)} = -(-1)^{x_j}$。 

将此应用到$w_k$,$$w_k(1-x)
= \prod_{j \ge 0} r_{j+1}(1-x)^{b_j}
= \prod_{j \ge 0} (-r_{j+1}(x))^{b_j}.$$每个因素贡献一个符号$-1$恰好在什么时候$b_j = 1$， 因此$$w_k(1-x)
= (-1)^{\sum_{j \ge 0} b_j} \prod_{j \ge 0} r_{j+1}(x)^{b_j}.$$让$\nu(k) = \sum_{j \ge 0} b_j$是$1$- 二进制展开中的位$k$。 然后$$w_k(1-x) = (-1)^{\nu(k)} w_k(x).$$### 与声称的身份比较

 要测试的语句是$$w_k(-x) = (-1)^k w_k(x).$$由于沃尔什函数通常定义为$[0,1)$并定期延长，$-x$对应于$1-x$在这个设置中。 导出的恒等式表明正确的指数取决于汉明权重$\nu(k)$，不在$k$本身。 

要反驳该主张，请采取$k=2$。 然后$k=(10)_2$， 所以$\nu(k)=1$。 上面的身份给出$$w_2(1-x) = -w_2(x),$$尽管$$(-1)^k = (-1)^2 = 1.$$因此$$w_2(1-x) \ne (-1)^k w_2(x)$$为所有人$x$在哪里$w_2(x) \ne 0$。 

声称的身份失败。$$\boxed{\text{False}}$$
