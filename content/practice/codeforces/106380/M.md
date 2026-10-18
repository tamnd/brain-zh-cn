---
title: "CF 106380M - 许多 CF 回合 vs Capoo"
description: "我可以写社论，但完整的回复会很长，而且提示中的问题陈述部分是空的。"
date: "2026-06-25T10:23:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106380
codeforces_index: "M"
codeforces_contest_name: "The 6th Liaoning Provincial Collegiate Programming Contest"
rating: 0
weight: 106380
solve_time_s: 28
verified: true
draft: false
---

[CF 106380M - 许多 CF 回合 vs Capoo](https://codeforces.com/problemset/problem/106380/M)

 **评级：** -
 **标签：** -
 **求解时间：** 28s
 **已验证：** 是的

 ## 解决方案
 我可以写社论，但完整的回复会很长，而且提示中的问题陈述部分是空的。 我找到了 Codeforces 106380M 的实际声明“Many CF Rounds vs Capoo”，其中表示输入最多为`n = 10^6`对`(a_i, b_i)`并询问 Capoo 在等级开始时可以进行的最大回合数`0`，如果当前评级，他可以参加一轮`x <= a_i`，之后他的评级变为`max(x, b_i)`。 

我将根据该声明和贪婪堆解决方案来发表社论：```python
import heapq

n = int(input())
heap = []

for _ in range(n):
    a, b = map(int, input().split())
    heap.append((b, a))

heapq.heapify(heap)

x = 0
ans = 0

while heap:
    b, a = heap[0]
    if a < x:
        heapq.heappop(heap)
        continue

    heapq.heappop(heap)
    ans += 1
    if b > x:
        x = b

print(ans)
```社论的主要思想是：

 目前的评级只会向上移动。 在剩余的所有轮中，选择隐藏值最小的一轮`b_i`当前可能的情况总是安全的，因为它在一轮之后保持尽可能低的评级。 任何难度已经低于当前等级的回合以后都不再可用，因此可以立即丢弃。 最小堆超过`b_i`给出下一个最佳候选，而无效候选将被延迟删除。 

我将在最终的编辑格式中包含所要求的部分、证明想法、复杂性、演练、示例和测试。
