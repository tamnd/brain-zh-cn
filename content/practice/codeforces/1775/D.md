---
title: "CF 1775D - 友善的蜘蛛"
description: "我们在火星上看到了一群蜘蛛，每只蜘蛛都通过其腿的数量来识别。 如果两只蜘蛛的腿数的最大公约数大于 1，则它们被视为朋友。"
date: "2026-06-09T11:53:38+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "math", "number-theory", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 1775
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 843 (Div. 2)"
rating: 1800
weight: 1775
solve_time_s: 27
verified: false
draft: false
---

[CF 1775D - 友好蜘蛛](https://codeforces.com/problemset/problem/1775/D)

 **评分：** 1800
 **标签：** dfs 和类似的、图、数学、数论、最短路径
 **求解时间：** 27s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在火星上看到了一群蜘蛛，每只蜘蛛都通过其腿的数量来识别。 如果两只蜘蛛的腿数的最大公约数大于 1，则它们被视为朋友。 友谊允许即时消息传递； 否则，消息必须沿着朋友链从一个蜘蛛跳到另一个蜘蛛。 任务是计算从一个特定蜘蛛到另一个特定蜘蛛的消息传输的最短路径，并提供沿该路径的有效蜘蛛序列。 

输入提供多达 300,000 只蜘蛛，每只蜘蛛的腿数多达 300,000 条。 源蜘蛛和目标蜘蛛由基于 1 的索引标识。 有了这些输入大小和 2 秒的限制，我们无法负担直接检查所有成对友谊的算法，因为这需要高达 9·10^10 gcd 计算，这是不可行的。 因此，解决方案必须利用数论结构而不是简单的成对检查。 

当蜘蛛的腿数为素数并且与任何其他蜘蛛没有共同因素时，就会出现一种不明显的边缘情况
