---
title: "CF 1612C - 聊天禁令"
description: "我们被要求模拟一个聊天场景，其中用户想要发送一个由表情数量先增加后减少的消息组成的“表情三角形”。"
date: "2026-06-10T06:57:15+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "math"]
categories: ["algorithms"]
codeforces_contest: 1612
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 117 (Rated for Div. 2)"
rating: 1300
weight: 1612
solve_time_s: 75
verified: true
draft: false
---

[CF 1612C - 聊天禁令](https://codeforces.com/problemset/problem/1612/C)

 **评分：** 1300
 **标签：** 二分查找，数学
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟一个聊天场景，其中用户想要发送一个由表情数量先增加后减少的消息组成的“表情三角形”。 对于给定尺寸$k$，第一条消息有一个表情，第二条消息有两个，最多$k$第 条消息$k$表情，那么接下来的消息就会减少到一条。 这形成了一个序列$2k-1$消息，其中消息中的表情数量$i$是$\min(i, 2k-i)$。 

聊天平台有一个审核系统，一旦发送的表情总数达到或超过给定阈值，就会禁止用户$x$。 任务是确定用户在被禁止之前可以发送多少条消息。 如果用户完成三角形但未超过$x$，答案是$2k-1$。 

限制条件很大：$k$可以达到$10^9$和$x$最多$10^{18}$。 逐条消息求和表情的简单模拟会太慢，因为它可能需要最多$2 \cdot 10^9$每个测试用例的添加。 这迫使解决方案在每个测试用例中以对数或恒定时间工作。 

不明显的边缘情况包括小$k$而且很小$x$， 例如$k=1, x=1$。 该三角形只有一条消息，用户可能会立即被禁止。 另一个边缘情况是当$x$大于整个三角形的总和。 为了$k=4$和$x=20$，三角形的和为16。在这种情况下，用户完成所有消息而不会被禁止。 

## 方法

 暴力方法很简单：生成消息序列，保留运行总和，并对消息进行计数，直到总和达到或超过$x$。 这适用于小型$k$但失败时$k$很大，因为对数十亿条消息求和太慢了。 最坏情况下的操作次数是$O(k)$每个测试用例，这是不可接受的$k$最多$10^9$和$t$最多$10^4$。 

关键的观察结果是三角形每一半中的表情数量形成一个简单的算术级数。 上半场从 1 增加到$k$总和为$k(k+1)/2$。 下半年减少$k-1$为 1，求和为$(k-1)k/2$。 三角形的总和是$k^2$。 这使我们能够快速确定是否$x$超过三角形和，在这种情况下，用户写入所有$2k-1$消息。 

如果$x$小于$k(k+1)/2$，增加部分用户被禁止。 我们可以使用第一个求和的公式$m$自然数并求解二次不等式$m(m+1)/2 \ge x$找到最小的$m$。 如果$x$超过$k(k+1)/2$但小于$k^2$，禁令发生在递减部分。 我们可以转移问题：减去前半部分的总和$x$计算剩余的表情，然后将类似的公式应用于递减序列。 在消息计数上使用二分搜索在两半中都可以有效地工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(k) | O(1) | O(1) | 对于大 k 来说太慢 |
 | 最优（对半三角形进行二分搜索）| O(log k) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，计算前半部分的总表情$S_1 = k(k+1)/2$。 比较$x$到$S_1$。 
2.如果$x \le S_1$，禁令发生在增加的部分。 在 1 到 范围内使用二分查找$k$找到最少的消息数$m$这样$m(m+1)/2 \ge x$。 返回$m$。 
3.如果$x > S_1$和$x \le k^2$，禁令发生在递减部分。 计算剩余的表情$x' = x - S_1$。 减少的部分包括$k-1$带有表情的消息$k-1, k-2, ..., 1$。 使用二分查找$1..k-1$找到最少的消息数$m$这样$(k-1 + k-2 + ... + (k-m)) \ge x'$。 等价地，最后的总和$m$数字来自$k-1$下：总和=$m(2k-m-1)/2$。 返回$k + m$。 
4.如果$x > k^2$，用户完成所有消息而不会被禁止。 返回$2k-1$。 

原理：三角形先严格递增，然后严格递减。 使用算术级数公式可以保证我们找到累加和达到的准确点$x$无需迭代每条消息。 二分查找可确保正确计算最少数量的消息。 不变量是累积和界限和算术级数和，它们是精确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def messages_before_ban(k, x):
    total = k * k
    if x >= total:
        return 2 * k - 1
    first_half = k * (k + 1) // 2
    if x <= first_half:
        # binary search in increasing part
        l, r = 1, k
        while l < r:
            m = (l + r) // 2
            if m * (m + 1) // 2 >= x:
                r = m
            else:
                l = m + 1
        return l
    else:
        # banned in decreasing part
        x_rem = x - first_half
        l, r = 1, k - 1
        while l < r:
            m = (l + r) // 2
            if m * (2 * k - m - 1) // 2 >= x_rem:
                r = m
            else:
                l = m + 1
        return k + l

t = int(input())
for _ in range(t):
    k, x = map(int, input().split())
    print(messages_before_ban(k, x))
```该解决方案首先检查用户是否在不超过禁止阈值的情况下完成了三角形。 它使用算术和公式来分别处理增加部分和减少部分。 Binary search is employed to efficiently find the minimal message count that exceeds the threshold, avoiding off-by-one mistakes by careful loop invariants.

 ## 工作示例

 **示例1：**$k = 4, x = 6$| 步骤| 我| r | 米 | 总和| 决定|
 | ---| ---| ---| ---| ---| ---|
 | 开始 | 1 | 4 | 2 | 3 | 总和 < x → l = 3 |
 | 下一个 | 3 | 4 | 3 | 6 | 总和 ≥ x → r = 3 |

 输出为 3。用户发送 3 条消息后被禁止。 

**示例2：**$k = 3, x = 7$上半部分总和 = 6 < x → 减少部分禁止。 剩余 x = 1。递减序列 = 2,1。 

| 步骤| 我| r | 米 | 总和| 决定|
 | ---| ---| ---| ---| ---| ---|
 | 开始 | 1 | 2 | 1 | 2 | 总和 ≥ x → r = 1 |

 输出 = k + l = 3 + 1 = 4。用户在第 4 条消息时被禁止。 

这些跟踪确认二分搜索正确识别了两半中的最小消息计数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例的 O(log k) | 最多 k 个元素的增加或减少一半的二分搜索 |
 | 空间| O(1) | O(1) | 仅用于算术计算的变量，不需要数组 |

 给定$t \le 10^4$和$k \le 10^9$,$O(t \log k)$2 秒的时间限制是可以接受的。 Python 处理的整数可达$10^{18}$没有溢出。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        k, x = map(int, input().split())
        print(messages_before_ban(k, x))
    return output.getvalue().strip()

# provided samples
assert run("7\n4 6\n4 7\n1 2\n3 7\n2 5\n100 1\n1000000000 923456789987654321\n") == \
"3\n4\n1\n4\n3\n1\n1608737403", "sample 1"

# custom tests
assert run("2\n1 1\n1
```
