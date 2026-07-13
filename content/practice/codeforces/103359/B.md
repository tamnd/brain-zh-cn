---
title: "CF 103359B-\u041b\u043e\u0432\u0443\u0448\u043a\u0430\u0434\u043b\u044f\u0414\u0436\u0435\u0440\u0440\u0438"
description: "让 $n = s + t$ 如 (1) 中所示，并考虑 $t$ 组合 $ct cdots c1$ 与 $n ct cdots c1 ge 0$ 以及附加邻接限制 $c{j+1} cj + 1 qquad (t j ge 1)。$ 定义新整数 $c'j = cj - (j-1), qquad 1 le j le t。"
date: "2026-07-03T13:26:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103359
codeforces_index: "B"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2020-2021, \u0422\u0440\u0435\u0442\u044c\u044f \u043b\u0438\u0447\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 103359
solve_time_s: 70
verified: false
draft: false
---

[CF 103359B - \u041b\u043e\u0432\u0443\u0448\u043a\u0430\u0434\u043b\u044f \u0414\u0436\u0435\u0440\u0440\u0438](https://codeforces.com/problemset/problem/103359/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 10s
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
