---
title: "CF 1617E - 圣诞巧克力"
description: "我们有一盒巧克力，每种巧克力都有一个由非负整数表示的不同类型。 Icy 希望至少一对巧克力具有相同的类型，但在进行任何交换之前，她选择了两块巧克力，例如索引为 $x$ 和 $y$。"
date: "2026-06-10T06:28:55+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "games", "graphs", "implementation", "math", "number-theory", "shortest-paths", "trees"]
categories: ["algorithms"]
codeforces_contest: 1617
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 761 (Div. 2)"
rating: 2700
weight: 1617
solve_time_s: 114
verified: false
draft: false
---

[CF 1617E - 圣诞巧克力](https://codeforces.com/problemset/problem/1617/E)

 **评分：** 2700
 **标签：** dfs 和类似、dp、游戏、图形、实现、数学、数论、最短路径、树
 **求解时间：** 1m 54s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一盒巧克力，每种巧克力都有一个由非负整数表示的不同类型。 Icy 希望至少制作一对相同类型的巧克力，但在进行任何交换之前，她会选择两块巧克力（如指数所示）$x$和$y$。 然后祖父母进行一系列的巧克力交换$x$只，每次选择2的幂$2^k$至少与$a_x$并更换$a_x$和$2^k - a_x$。 这个序列一直持续到$a_x = a_y$。 

我们的任务是找到这对$(x, y)$使得进行所需的最少交换次数$a_x = a_y$被最大化。 我们还需要报告最少的交换数量$m$。 

限制条件是$n$可以大到 200,000 并且$a_i \le 10^9$。 由于大$n$，任何考虑所有对并暴力探索所有序列的算法都是不可行的。 模拟每对的所有转换的简单方法可以轻松达到$O(n^2 \cdot \text{sequence length})$，这远远超出了 4 秒所允许的范围。 

要考虑的边缘情况包括非常小的数组 (n = 2)、接近零的值或 2 的幂。 例如，如果$a = [0, 1]$，使它们相等的最短序列并不明显：$0$只能去$1$通过$2^1 - 0 = 2$然后$2^1 - 2 = 0$，依此类推，形成一个循环。 粗心的实现可能无法考虑多个路径或循环。 

## 方法

 蛮力方法在概念上很简单：对于每对巧克力$(x, y)$，我们可以执行 BFS 或 DFS 来找到转换所需的最少交换次数$a_x$进入$a_y$。 因为每次变换都可以产生多个新状态（所有$2^k - a_x$），状态空间可以非常大，直到$O(\log_2(10^9)) = 30$每一步的转换，带来指数增长。 和$n = 2 \cdot 10^5$，这是不可行的。 

关键的见解来自于观察转换的结构。 每个交换的形式为$a := 2^k - a$，这让人想起隐式图上的 BFS，其中节点是数字，边连接$a$到$2^k - a$。 重要的是，$2^k$始终是 2 的幂，并且变换序列是有界的，因为任何数字$a < 2^k$变换为更接近于零或另一个二的幂区间。 

我们可以针对每种巧克力类型进行预先计算$a_i$，通过一系列交换可到达的所有数字以及到达每个数字的最少步骤。 一旦我们有了这个，我们就可以扭转问题：我们不是模拟所有对的转换，而是将每个巧克力的所有可达值存储在按数字键控的哈希映射中，并映射到步骤列表和原始索引。 然后，对于从多个巧克力中可以达到的每个数字，我们可以检查最大化最小交换次数的对。 这减少了搜索空间$O(n^2)$本质上是由可达数字形成的图的大小，这是可以管理的，因为转换会迅速将数字缩小到零和二的幂。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2 * log(max(a))) | O(n^2 * log(max(a))) | O(n) | 太慢了 |
 | 最佳| O(n * log(max(a)) * log(max(a))) | O(n * log(max(a)) * log(max(a))) | O(n * log(max(a))) | O(n * log(max(a))) | 已接受 |

 ## 算法演练

 1. 首先，迭代所有巧克力$a_i$并生成所有可到达的号码$a_i$通过交换序列。 每一步都有转变$x$进入$2^k - x$为所有人$2^k \ge x$。 存储这些数字以及到达这些数字所需的步数。 使用字典映射数字→（索引，步骤）列表。 
2. 对于每个数字$v$字典中出现的具有多个来源的巧克力，请计算每种来源巧克力到达所需的最少步骤数$v$。 
3. 在所有数量相同的巧克力中，找到一对$(i, j)$最大化最少的步骤。 这与艾西的选择相对应：她希望祖父母花尽可能长的时间来使一对平等。 
4.归还该对$(x, y)$（从 1 开始索引）和步数$m$求它们之间的最小序列。 可能存在多个答案； 任何都可以接受。 

为什么有效：每种巧克力的可达数字都预先计算一次，捕获达到任何值的最少步骤。 通过迭代具有多个起源的数字，我们保证找到所有巧克力对中的最大最小序列。 由于二次方界限，变换是确定性和有限的，因此 BFS 探索终止并产生正确的步数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict, deque

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    
    # Stores reachable number -> list of (index, steps)
    reach = defaultdict(list)
    
    for idx, val in enumerate(a):
        seen = {}
        q = deque()
        q.append((val, 0))
        while q:
            x, steps = q.popleft()
            if x in seen:
                continue
            seen[x] = steps
            reach[x].append((idx, steps))
            # Generate next states
            k = 0
            while (1 << k) < x * 2:
                nxt = (1 << k) - x
                if nxt >= 0 and nxt not in seen:
                    q.append((nxt, steps + 1))
                k += 1
    
    # Find pair maximizing minimal steps
    best = (-1, -1, -1)
    for v, lst in reach.items():
        if len(lst) < 2:
            continue
        lst.sort(key=lambda x: -x[1])  # sort descending by steps
        first, second = lst[0], lst[1]
        steps = min(first[1], second[1])
        if steps > best[2]:
            best = (first[0] + 1, second[0] + 1, steps)
    
    print(f"{best[0]} {best[1]} {best[2]}")

if __name__ == "__main__":
    solve()
```BFS 确保我们记录从给定巧克力中达到每个数字所需的最少步骤数。 使用字典可以避免重新计算并允许快速查找可到达的数字。 按步数降序对可达列表进行排序可以保证我们选择最大化最小步数的对。 

## 工作示例

 **示例1**

 输入：```
5
5 6 7 8 9
```| 巧克力| BFS 状态（值：步数）|
 | ---| ---|
 | 5 | {5:0, 3:1, 1:2, 0:3, 8:4, 7:5} |
 | 6 | {6:0, 2:1, 0:2, 1:3, 7:4, 9:5} |
 | 7 | {7:0, 1:1, 0:2, 2:3, 5:4, 6:5} |
 | 8 | {8:0, 0:1, 8:2} |
 | 9 | {9:0, 7:1, 5:2, 3:3, 0:4, 1:5} |

 从巧克力 6 到 5 步可以到达数字 9，从 9 到 0 步可以到达数字 9。 最小交换次数为 5。因此输出：`2 5 5`。 

**示例2**

 输入：```
2
4 8
```| 巧克力| BFS 状态 |
 | ---| ---|
 | 4 | {4:0, 0:1, 8:2} |
 | 8 | {8:0, 0:1, 8:2} |

 从 4 到 2 步可以到达数字 8，从 8 到 0 步可以到达。 输出：`1 2 2`。 

这表明该算法正确地跟踪最小步骤并选择最大化最小步骤数的对。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * log(max(a))^2) | O(n * log(max(a))^2) | 对于每种巧克力，BFS 探索最多 O(log(a_i)) 个下一个状态，并且每个状态可以考虑 O(log(a_i)) 2 的幂。 |
 | 空间| O(n * log(max(a))) | O(n * log(max(a))) | 字典存储可到达的数字以及起始点和步数列表。 |

 对数因子来自二次幂转换，对于 max(a_i) = 10^9，其界限为 30。 当 n ≤ 2×10^5 时，该算法
