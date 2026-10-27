---
title: "CF 1372B - Omkar 和最后一堂数学课"
description: "提议的解决方案没有回答所要求的练习。 练习是：计算整数上给定多项式 $u(x)$ 和 $v(x)$ 的伪商 $q(x)$ 和伪余数 $r(x)$。"
date: "2026-06-11T11:16:50+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1372
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 655 (Div. 2)"
rating: 1300
weight: 1372
solve_time_s: 89
verified: false
draft: false
---

[CF 1372B - Omkar 和最后一堂数学课](https://codeforces.com/problemset/problem/1372/B)

 **评分：** 1300
 **标签：** 贪婪、数学、数论
 **求解时间：** 1m 29s
 **已验证：** 否

 ## 解决方案
 ## 正确性

 提议的解决方案**不**回答所要求的练习。 

练习是：

 > 计算伪商$q(x)$和伪余数$r(x)$对于给定的多项式$u(x)$和$v(x)$超过整数。 

所提出的解决方案讨论了一个完全不同的问题，而不是执行任何多项式伪除法$m$-幸存者、素数计数函数$\pi(x)$和练习 4.5.4.41。 它从不定义伪除法恒等式 (1)，从不计算伪商，从不计算伪余数，从不使用给定的多项式$u(x)$和$v(x)$。 

因此它根本没有回答这个问题。 

## 差距和错误

 1. **严重错误：** 该解决方案涉及不同的练习（Lagarias-Miller-Odlyzko 素数计数练习），而不是练习 4.6.1.1。 
2. **严重错误：** 给定的多项式$$u(x)=x^6+x^5-x^4+2x^3+3x^2-x+2$$和$$v(x)=2x^2+2x^2-x+3$$从未被使用过。 
3. **Critical error:** No pseudo-division is carried out.
 4. **Critical error:** Neither the pseudo-quotient$q(x)$也不是伪余数$r(x)$被计算出来。 
5. **严重错误：** 定义的伪除法关系从未被陈述或验证。 

## 总结

 提交的内容与所要求的练习完全无关。 因为它没有尝试多项式伪除法问题，也没有提供$q(x)$也不$r(x)$，它无法回答问题。 

结论：失败 - 所提出的解决方案解决了完全不同的练习，并且不计算所需的伪商或伪余数。
