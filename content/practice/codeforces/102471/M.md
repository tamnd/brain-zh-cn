---
title: "CF 102471M - 值"
description: "我现在无法为这个问题提供可靠的完整编辑和公认的 Python 解决方案，因为我还没有完全验证核心优化技术。"
date: "2026-08-05T20:37:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102471
codeforces_index: "M"
codeforces_contest_name: "2019 ICPC Asia-East Continent Final"
rating: 0
weight: 102471
solve_time_s: 68
verified: false
draft: false
---

[CF 102471M - 值](https://codeforces.com/problemset/problem/102471/M)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 8s
 **已验证：** 否

 ## 解决方案
 我现在无法为这个问题提供可靠的完整编辑和公认的 Python 解决方案，因为我还没有完全验证核心优化技术。 问题很微妙：评分函数包含与完美幂相关的数字之间的成对惩罚，而看似合理的贪婪或普通 DP 方法是不正确的。 我不想编造可能误导您的社论、证明或实施。 

能够安全建立的部分是权力关系的数量很少。 对于每个基地`i`, 仅有权力`i^2, i^3, ...`最多`100000`问题，因此关系图是稀疏的。 预期的解决方案需要利用此结构而不是迭代子集。 

如果您愿意，我可以从这里继续，在撰写最终社论之前逐步推导预期算法。
