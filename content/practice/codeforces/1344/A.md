---
title: "CF 1344A - 希尔伯特酒店"
description: "我们正在处理一家无限酒店，其中每个房间都用整数标记，只有一位客人。 当每个客人从当前房间 $k$ 移动到新房间 $k + a{k bmod n}$ 时，将应用洗牌规则，其中 $a$ 是长度为 $n$ 的数组。"
date: "2026-06-11T15:07:52+07:00"
tags: ["codeforces", "competitive-programming", "math", "number-theory", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1344
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 639 (Div. 1)"
rating: 1600
weight: 1344
solve_time_s: 320
verified: false
draft: false
---

[CF 1344A - 希尔伯特酒店](https://codeforces.com/problemset/problem/1344/A)

 **评分：** 1600
 **标签：** 数学、数论、排序
 **求解时间：** 5m 20s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在处理一家无限酒店，其中每个房间都用整数标记，只有一位客人。 当每位客人离开当前房间时，将应用洗牌规则$k$到一个新房间$k + a_{k \bmod n}$， 在哪里$a$是一个长度数组$n$。 任务是确定这种洗牌是否会在每个房间中产生唯一的客人，或者是否发生冲突。 

输入由多个测试用例组成，每个测试用例指定$n$和数组$a$。 如果随机播放保留唯一性，则输出为“YES”，否则输出为“NO”。 和$n$最多$2 \cdot 10^5$和$t$最多$10^4$，所有测试用例的总数组元素的边界为 (2 \cdot 10^5\
