---
title: "CF 104303E - \u8bfb\u4e2d\u56fd\u6570\u5b57"
description: "令 [0,1)$ 中的 $x 具有三元扩展 $x = 0.x1 x2 x3 cdots 四元（{0,1,2} 中的 xj），$ 其中使用非终止表示。 定义 $omega = e^{2pi i/3}$，因此 $omega^3 = 1$ 且 $1 + omega + omega^2 = 0$。"
date: "2026-07-01T20:11:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104303
codeforces_index: "E"
codeforces_contest_name: "2023 Xiangtan Unversity Freshman Conteset"
rating: 0
weight: 104303
solve_time_s: 135
verified: false
draft: false
---

[CF 104303E - \u8bfb\u4e2d\u56fd\u6570\u5b57](https://codeforces.com/problemset/problem/104303/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 15s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$x \in [0,1)$具有三元展开式$x = 0.x_1 x_2 x_3 \cdots \quad (x_j \in \{0,1,2\}),$使用非终止表示的地方。 

定义$\omega = e^{2\pi i/3}$， 所以$\omega^3 = 1$和$1 + \omega + \omega^2 = 0$。 

对于每个$j \ge 1$，定义三元Rademacher函数$r_j(x) = \omega^{x_j}.$每个$r_j(x)$仅取决于$j$第一个三进制数字，取值于${1,\omega,\omega^2}$。 

让$k$是一个三元表示的非负整数$k = k_0 + 3k_1 + 3^2 k_2 + \cdots,$其中只有有限多个$k_j$都是非零且每个$k_j \in {0,1,2}$。 

定义三元沃尔什函数$w_k(x)$经过$w_k(x) = \prod_{j \ge 1} r_j(x)^{k_{j-1}}.$等价地，$w_k(x) = \omega^{\sum_{j \ge 1} k_{j-1} x_j} = \omega^{\sum_{j \ge 0} k_j x_{j+1}}.$指数取模$3$， 自从$\omega^m$仅取决于$m \bmod 3$。 

对于每个固定$k$，产品是有限的，因为$k_j = 0$对于所有足够大的$j$。 

让$m \ge 1$并限制于$\sigma$-由第一个生成的代数$m$三进制数字。 然后$w_k$仅取决于$x_1,\dots,x_m$每当$k_j = 0$为了$j \ge m$。 

对于整数$k,\ell$带三进制数字$(k_j)$和$(\ell_j)$，产品满足$w_k(x)\,\overline{w_\ell(x)} = \omega^{\sum_{j \ge 1} (k_{j-1}-\ell_{j-1})x_j}.$正交性是通过逐位积分来计算的。 对于每个固定$j$,$\int_0^1 \omega^{a x_j}\,dx = \frac{1}{3}(1 + \omega^a + \omega^{2a})$在哪里$a \in {0,1,2}$。 这等于$1$什么时候$a \equiv 0 \pmod 3$并且等于$0$否则。 

由于三进制数字$x_j$在 Lebesgue 测度下是独立且均匀分布的$[0,1)$，积分因式分解：

 = \prod_{j \ge 1} \frac{1}{3}\left(1 + \omega^{k_{j-1}-\ell_{j-1}} + \omega^{2(k_{j-1}-\ell_{j-1})}\right)。$$ Each factor equals $1$ if $k_{j-1} = \ell_{j-1}$ and equals $0$ otherwise. The product is therefore $1$ when $k = \ell$ and $0$ when $k \ne \ell$, yielding $$\int_0^1 w_k(x)\,\overline{w_\ell(x)}\,dx = \delta_{k\ell}.$$ 系统$\{w_k\}$完成于$L^2[0,1)$因为它与紧阿贝尔群的字符系统重合$\prod_{j \ge 1} \mathbb{Z}/3\mathbb{Z}$在三元展开给出的标识下，字符形成相应的正交基$L^2$空间。 下数字图之间$[0,1)$和三元序列，该群与具有勒贝格测度的单位区间保持测度同构。 从而将二进制数字和符号组替换得到三进制沃尔什系统$\{\pm 1\}$具有三元数字和单位三次根的乘法群，通过数字独立性保持正交性和完整性。 这就完成了沃尔什函数的三元推广的构造。 ∎
