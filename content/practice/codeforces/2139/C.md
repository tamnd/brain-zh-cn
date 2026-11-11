---
title: "CF 2139C - 蛋糕作业"
description: "该解决方案正确地解释了问题。 “长度 $r$ 的间隙”是指在下一个 $U$ 落入该区间之前，连续 $U$ 落入 $[alpha, beta)$ 之外的次数。"
date: "2026-06-09T04:13:21+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2139
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1048 (Div. 2)"
rating: 1100
weight: 2139
solve_time_s: 65
verified: false
draft: false
---

[CF 2139C - 蛋糕作业](https://codeforces.com/problemset/problem/2139/C)

 **评分：** 1100
 **标签：** 位掩码，构造性算法，贪婪
 **求解时间：** 1m 5s
 **已验证：** 否

 ## 解决方案
 ## 正确性

 该解决方案正确地解释了问题。 “长度差距”$r$" 是连续数$U$掉到外面了$[\alpha, \beta)$在下一个之前$U$落在该区间内。 这是一个标准的几何分布场景，成功的概率是$p = \beta - \alpha$。 

该解决方案正确定义了$X$作为数量$U$需要观察单个间隙。 通过识别$X = r+1$对于长度的间隙$r$，该解决方案将问题简化为计算第一次成功之前计算失败的几何随机变量的均值和方差。 公式$$E[X] = \frac{1}{p}, \quad \operatorname{Var}(X) = \frac{1-p}{p^2}$$是正确且标准的。 

为了$n$独立间隙，求和$n$独立的几何变量来获得$S_n$正确使用期望的线性和方差的独立性。 结果表达式$$E[S_n] = \frac{n}{p}, \quad \sigma = \sqrt{\operatorname{Var}(S_n)} = \frac{\sqrt{n(1-p)}}{p}$$因此有理有据，直接回答问题。 

## 差距和错误

 论证中的所有步骤都是标准的并且正确应用。 该解决方案明确说明概率模型，定义随机变量，使用标准公式计算期望和方差，并应用独立性。 不存在遗漏的步骤、循环论证或未经证实的主张。 正确调用第一次成功之前计数失败的几何变量的方差和标准差公式。 

## 总结

 所提出的解决方案正确计算了预期的数量$U$需要观察$n$差距和相应的标准偏差。 推理完整、严谨，并且符合标准概率论。 

结论：通过 - 解决方案正确且完整。
