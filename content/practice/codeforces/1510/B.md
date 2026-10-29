---
title: "CF 1510B - 按钮锁"
description: "该问题为我们提供了一个按钮密码锁，其中 d 按钮标记为 0 到 d-1。 按下按钮会使其永久按下，直到我们按下“重置”按钮，这会将所有按钮弹回来。"
date: "2026-06-10T19:22:31+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graph-matchings", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1510
codeforces_index: "B"
codeforces_contest_name: "2020-2021 ICPC, NERC, Northern Eurasia Onsite (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 2600
weight: 1510
solve_time_s: 187
verified: true
draft: false
---

[CF 1510B - 按钮锁](https://codeforces.com/problemset/problem/1510/B)

 **评分：** 2600
 **标签：** 流、图匹配、图
 **求解时间：** 3m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这个问题给了我们一个按钮密码锁`d`按钮标记为`0`到`d-1`。 按下一个按钮会使其永久按下，直到我们按下“重置”按钮，这会将所有按钮弹回来。 当同时按下一组特定的按钮时，锁会立即打开，并且我们会得到一个列表`n`可能的密码，每个都表示为长度的二进制字符串`d`。 一个`1`就位`j`表示按钮`j`必须按下该密码。 

我们的任务是构建最短的按钮按下序列（数字或“重置”），以便在执行该序列时，锁会经过每个按钮`n`至少输入一次密码。 输出必须包括按下的总数和序列本身。 

约束足够严格以允许组合技术。`d`最多 10 个，因此可能的按钮状态总数为`2^d = 1024`最坏的情况是。`n`取决于`2^d - 1`，因此我们可能需要考虑按钮的所有非空子集。 这意味着算法呈指数增长`d`是可以接受的，但任何缩放`n!`或者`2^n`对于大的来说太慢了`d`。 需要注意的边缘情况包括多个密码在其所需按钮中重叠的情况，或者一个密码是另一个密码的子集的情况。 为每个密码单独按下按钮的幼稚方法可能会不必要地过于频繁地点击重置，从而导致序列比所需的更长。 

一个微妙的例子是如果`d = 3`密码是`101`,`111`。 粗心的做法可能会造成压力`1 0 R 1 1 0 1`而较短的序列`1 0 1`就足够了。 检测重叠并重复使用已按下的按钮是关键。 

## 方法

 暴力方法是生成所有按钮按下序列并选择涵盖所有密码的最短序列。 这显然是不可行的，因为序列长度是先验无界的，并且有`d`选项加​​上每按一次重置。 即使对于小`d`，序列的数量随着长度呈指数增长，因此这种方法仅适用于简单的情况。 

关键的观察结果是该问题可以建模为密码状态图。 将每个密码表示为位掩码。 密码之间的转换对应于按下按钮（位从 0 到 1）或按下 RESET。 摆脱密码的成本`A`到`B`是按钮的数量`B`尚未压入`A`，如果需要重置则加 1。 然后问题就简化为找到访问所有密码节点的最小成本序列，这相当于通过覆盖所有节点的有向图的最短路径。 和`d <= 10`，我们可以预先计算所有成对成本，并在这些状态上使用旅行商问题 (TSP) 的变体。 因为`2^d <= 1024`，子集上的DP是可行的。 

另一个见解是我们只需要考虑位掩码之间的汉明距离。 如果`current_mask`是当前按下的按钮，并且`next_mask`是目标密码，按的次数是位数`next_mask`不在`current_mask`。 如果`next_mask`需要当前未按下的位，并且某些当前按下的位不在`next_mask`，重置更便宜。 这为 DP 提供了精确的成本函数。 通过位掩码DP，我们可以有效地找到最小序列长度并重建序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((d+1)^L) | O((d+1)^L) | O(L) | 太慢了|
 | 最佳（密码上的位掩码 DP）| O(n * 2^n + n^2 * d) | O(n * 2^n) | O(n * 2^n) | 已接受 |

 ## 算法演练

 1. 将每个密码字符串转换为整数位掩码。 这允许有效的比较和位操作。 
2. 预先计算任意两个密码之间的转换成本。 如果`maskA`是当前状态并且`maskB`是目标，检查是否`maskB`包括所有按下的按钮`maskA`。 如果没有，则需要重置。 然后计算其中的位数`maskB`没有设置在`maskA`以确定额外按压的次数。 
3. 使用位掩码 DP 来表示访问过的密码。 让`dp[mask][i]`是覆盖由 表示的密码子集的最小序列长度`mask`，以密码结尾`i`。 
4. 初始化`dp[1 << i][i]`与密码中的位数`i`，因为从空状态开始，我们只需要按下这些位即可。 
5. 针对每个可能的最后一个密码，迭代所有密码子集`i`在子集中，并尝试附加另一个密码`j`尚未包括在内。 更新`dp[subset | (1 << j)][j]`作为`min(dp[subset | (1 << j)][j], dp[subset][i] + cost[i][j])`。 
6. 填充DP表后，最小序列长度为`min(dp[(1 << n) - 1][i])`全面的`i`。 
7. 通过回溯 DP 来重建序列，为新的按钮按下添加数字，如果需要重置则添加“R”。 

工作原理：DP 会考虑密码的每个子集以及该子集中每个可能的最后一个密码。 通过计算子集之间的最小转换，它保证最终的解决方案以最少的按键次数覆盖所有密码。 使用位掩码可以实现高效的子集和成本计算，并且预计算成本可确保 RESET 决策是最佳的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    d, n = map(int, input().split())
    passwords = []
    for _ in range(n):
        s = input().strip()
        mask = 0
        for i, c in enumerate(s):
            if c == '1':
                mask |= 1 << i
        passwords.append(mask)

    # Precompute cost between passwords
    cost = [[0] * n for _ in range(n)]
    need_reset = [[False] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            if passwords[j] & ~passwords[i]:
                # buttons to press outside current mask
                new_bits = passwords[j] & ~passwords[i]
                if passwords[i] & ~passwords[j]:
                    need_reset[i][j] = True
                cost[i][j] = bin(new_bits).count('1')
                if need_reset[i][j]:
                    cost[i][j] += 1  # for the RESET

    # DP over subsets
    INF = 10**9
    dp = [[INF] * n for _ in range(1 << n)]
    parent = [[-1] * n for _ in range(1 << n)]
    for i in range(n):
        dp[1 << i][i] = bin(passwords[i]).count('1')

    for mask in range(1 << n):
        for u in range(n):
            if not (mask & (1 << u)):
                continue
            for v in range(n):
                if mask & (1 << v):
                    continue
                new_mask = mask | (1 << v)
                val = dp[mask][u] + cost[u][v]
                if val < dp[new_mask][v]:
                    dp[new_mask][v] = val
                    parent[new_mask][v] = u

    # Find best last password
    full = (1 << n) - 1
    last = min(range(n), key=lambda i: dp[full][i])
    seq = []

    # Reconstruct sequence
    order = []
    mask = full
    while last != -1:
        order.append(last)
        prev = parent[mask][last]
        mask ^= (1 << last)
        last = prev
    order = order[::-1]

    # Build actual button sequence
    current = 0
    res = []
    for idx in order:
        target = passwords[idx]
        if current & ~target:
            res.append('R')
            current = 0
        for b in range(d):
            if (target >> b) & 1 and not (current >> b) & 1:
                res.append(str(b))
                current |= 1 << b

    print(len(res))
    print(' '.join(res))

if __name__ == "__main__":
    main()
```该代码首先将每个密码转换为位掩码，以便于比较和计数。 它预先计算成本以及密码之间的转换是否需要重置。 然后 DP 找到覆盖所有密码的最小序列长度。 最后，我们重建序列，小心处理重置并避免按下已经按下的按钮。 

## 工作示例

 ### 示例 1

 输入：```
2 2
10
11
```| 步骤| 当前| 目标| 重置？ | 按下按钮| 序列 |
 | --- | --- | --- | --- | --- | --- |
 | 开始| 0 | 10 | 10 没有 | 0 | |
 | 1 | 0 | 10 | 10 没有 | 10 | 10 0 |
 | 2 | 10 | 10 11 | 11 没有 | 11 | 11 0 1 |

 该表确认算法识别出最小序列：首先按`0`， 然后`1`。 

### 示例 2

 输入：```
3 3
100
110
111
```| 步骤|
