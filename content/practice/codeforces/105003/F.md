---
title: "CF 105003F - Erd&u0151s-斯特劳斯猜想"
description: "我们需要确定是否存在一对正整数 $x, y$，使得固定有理表达式等于三个埃及分数之和，其中第三个分母被限制为乘积 $xy$。"
date: "2026-06-28T03:16:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105003
codeforces_index: "F"
codeforces_contest_name: "XXVIII Spain Olympiad in Informatics, Online Qualifier"
rating: 0
weight: 105003
solve_time_s: 38
verified: false
draft: false
---

[CF 105003F - Erd\u0151s-斯特劳斯猜想](https://codeforces.com/problemset/problem/105003/F)

 **评级：** -
 **标签：** -
 **求解时间：** 38s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求判断一对正整数是否$x, y$存在这样一个固定的有理表达式等于三个埃及分数之和，其中第三个分母被限制为乘积$xy$。 对于每个测试用例，我们要么输出一对有效的结果，要么报告不可能性。 

重写方程后，输入$n$充当控制两个未知整数上的丢番图条件的参数。 该任务不是关于实数的近似或搜索，而是关于精确的整数结构。 

约束条件$n \le 10^9$最多 100 个测试用例意味着任何迭代次数达到$n$立刻就不可能了。 甚至二次扫描也可能$x, y$对是遥不可及的，因为那会爆炸到$10^{18}$在最坏的情况下。 唯一可行的策略必须将问题简化为除数枚举或代数分解之类的问题，其中搜索空间是次线性的$n$，通常约为$O(\sqrt n)$或更好地摊销。 

出现微妙的边缘情况时$n = 1$。 表达方式
