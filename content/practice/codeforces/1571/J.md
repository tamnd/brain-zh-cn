---
title: "CF 1571J - 两条铁路"
description: "这个问题不是一个小的实现错误。 整个算法方法从根本上来说是错误的。 让我们追踪一下立即反驳它的样本：所提出的算法至少看到一个“1”，然后只检查第一个和最后一个字符： - s[0] = ')' → 需要翻转 -..."
date: "2026-06-10T11:33:46+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 1571
codeforces_index: "J"
codeforces_contest_name: "Kotlin Heroes: Episode 8"
rating: 3000
weight: 1571
solve_time_s: 562
verified: false
draft: false
---

[CF 1571J - 两条铁路](https://codeforces.com/problemset/problem/1571/J)

 **评分：** 3000
 **标签：** *特别
 **求解时间：** 9m 22s
 **已验证：** 否

 ## 解决方案
 这个问题不是一个小的实现错误。 整个算法方法从根本上来说是错误的。 

让我们追踪立即反驳它的样本：```
n = 6
s = ))(()(
a = 101
```所提出的算法至少看到一个`'1'`，然后只检查第一个和最后一个字符：

 -`s[0] = ')'`→ 需要翻转
 -`s[5] = '('`→ 需要翻转

 它返回`2`。 

但正确答案是`4`。 

为什么？ 因为约束是关于**每个长度为 4 的窗口，其对应位在`a`是 1**。 

这里：

 - 窗户`[0..3]`必须是规则的括号序列。 
- 窗户`[2..5]`必须是规则的括号序列。 

这些窗口重叠。 他们的内在性格很重要。 简单地固定第一个和最后一个字符并不能保证任一窗口都有效。 

事实上，整篇社论声称“只有第一个和最后一个字符重要”是错误的。 

CF 1571E 的实际解决方案在 4 个位置的滑动窗口上使用动态规划。 由于每个约束仅涉及 4 个连续字符，因此我们可以从左到右处理字符串，同时保留最后 3 个分配的字符作为状态。 

对于每个位置，我们决定最终角色是否是`'('`或者`')'`。 如果我们保留原始字符，成本为 0，如果翻转它，成本为 1。 

每当我们分配了 4 个连续字符时，我们就会检查相应的约束位：

 - 如果`a[i] = '1'`，4 字符块必须是两个有效的长度为 4 的常规括号序列之一：

 -`(())`-`()()`- 如果`a[i] = '0'`，没有施加任何限制。 

这给出了 DP 仅$2^3 = 8$州。 

正确的解决方案是：```python
import sys
input = sys.stdin.readline

INF = 10 ** 18

VALID = {
    0b1100,  # (())
    0b1010,  # ()()
}

t = int(input())

for _ in range(t):
    n = int(input())
    s = input().strip()
    a = input().strip()

    dp = {}

    # initialize first character
    for b in range(2):
        cost = (s[0] != ('(' if b else ')'))
        dp[(1, b)] = cost

    for i in range(1, n):
        ndp = {}

        for (length, mask), cur_cost in dp.items():
            for b in range(2):
                add = (s[i] != ('(' if b else ')'))

                if length < 3:
                    nmask = (mask << 1) | b
                    key = (length + 1, nmask)
                    old = ndp.get(key, INF)
                    if cur_cost + add < old:
                        ndp[key] = cur_cost + add
                else:
                    block = ((mask << 1) | b)

                    start = i - 3

                    if a[start] == '1' and block not in VALID:
                        continue

                    nmask = block & 0b111
                    key = (3, nmask)

                    old = ndp.get(key, INF)
                    if cur_cost + add < old:
                        ndp[key] = cur_cost + add

        dp = ndp

    ans = min(dp.values(), default=INF)
    print(-1 if ans == INF else ans)
```这运行在$O(n \cdot 8 \cdot 2)$每个测试用例，它与总输入大小呈线性并且很容易满足约束。
