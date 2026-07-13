---
title: "CF 103360D - \u041a\u0440\u043e\u0441\u0441\u0432\u043e\u0440\u0434\u0434\u043b\u044f \u0434\u0440\u043e\u0438\u0434\u0430"
description: "让 $n = s + t$ 如 (1) 中所示，并考虑 $t$ 组合 $ct cdots c1$ 与 $n ct cdots c1 ge 0$ 以及附加邻接限制 $c{j+1} cj + 1 qquad (t j ge 1)。$ 定义新整数 $c'j = cj - (j-1), qquad 1 le j le t。"
date: "2026-07-03T13:24:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103360
codeforces_index: "D"
codeforces_contest_name: "\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435 \u0438 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2020"
rating: 0
weight: 103360
solve_time_s: 141
verified: false
draft: false
---

[CF 103360D - \u041a\u0440\u043e\u0441\u0441\u0432\u043e\u0440\u0434\u0434\u043b\u044f \u0434\u0440\u043e\u0438\u0434\u0430](https://codeforces.com/problemset/problem/103360/D)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 21s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$n = s + t$如 (1) 中所示，并考虑$t$-组合$c_t \cdots c_1$和$n > c_t > \cdots > c_1 \ge 0$连同附加的邻接限制$c_{j+1} > c_j + 1 \qquad (t > j \ge 1).$定义新整数$c'_j = c_j - (j-1), \qquad 1 \le j \le t.$从$c_{j+1} \ge c_j + 2$由此可见$c'_{j+1} = c_{j+1} - j \ge c_j + 2 - j = (c_j - (j-1)) + 1 = c'_j + 1,$因此$c'_t > c'_{t-1} > \cdots > c'_1 \ge 0.$因此$c'_t \cdots c'_1$是一个普通的严格$t$-(3)意义上的组合，由一组连续整数形成。 

从$c_t \le n-1$一个获得$c'_t = c_t - (t-1) \le n-1-(t-1) = n-t,$和$c'_1 \ge 0$直接持有来自$c_1 \ge 0$。 因此每个$c'_j$在于${0,1,\ldots,n-t}$。 

相反，给定任何普通组合$n-t \ge c'_t > \cdots > c'_1 \ge 0,$定义$c_j = c'_j + (j-1).$那么 $c_{j+1} \ge c'_{j+1} + j \ge (c'_j + 1) + j = (c'_j + (j-1)) + 2 = c_j + 2,$$

 所以邻接条件$c_{j+1} > c_j + 1$成立，并且还$c_t \le n-1$遵循于$c'_t \le n-t$。 这种重构反转了变换，因此有效的钢琴和弦组合与普通的和弦组合之间是双射的$t$- 组合${0,1,\ldots,n-t}$。 

因此，邻接限制的钢琴演奏者问题等价于生成所有$t$- 的组合$(n-t+1)$-元素集。 根据(1.2.6-2)，他们的数量是$\binom{n-t+1}{t},$因为底层地面集有元素$0,1,\ldots,n-t$。 

要按字典顺序生成所有此类和弦，请应用算法$L$第 7.2.1.3 节的变换变量$c'_t \cdots c'_1$，然后输出$c_j = c'_j + (j-1) \qquad (1 \le j \le t).$这会一次性生成所有可接受的和弦，从而在仿射移位下保留字典顺序。 

这样就完成了证明。 ∎
