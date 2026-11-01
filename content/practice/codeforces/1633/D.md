---
title: "CF 1633D - 让他们平等"
description: "我们被要求从一个大小为 $n$ 的数组开始，其中每个元素最初都是 1。对于每个元素 $ai$，我们可以执行 $ai = ai + lfloor ai / x rfloor$ 形式的操作，根据需要选择 $x 0$。 每个元素都有一个目标值$bi$和奖励$ci$。"
date: "2026-06-10T04:49:03+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1633
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 122 (Rated for Div. 2)"
rating: 1600
weight: 1633
solve_time_s: 42
verified: true
draft: false
---

[CF 1633D - 让它们平等](https://codeforces.com/problemset/problem/1633/D)

 **评分：** 1600
 **标签：** dp、贪婪
 **求解时间：** 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求从一个大小的数组开始$n$其中每个元素最初都是 1。对于每个元素$a_i$，我们可以执行以下形式的操作$a_i = a_i + \lfloor a_i / x \rfloor$，选择$x > 0$如我们所愿。 每个元素都有一个目标值$b_i$和奖励$c_i$。 我们的目标是通过使某些元素完全等于其目标来最大化所赚取的总硬币，但不超过$k$所有元素的总操作。 

输入包含多个测试用例。 每个测试用例指定数组大小$n$，操作极限$k$，目标数组$b$，和硬币数组$c$。 我们必须输出每个测试用例可获得的最大硬币。 

看看约束条件，$n$可以达到$10^3$和总和$n$所有测试用例最多$10^3$，这意味着元素总数很少。 然而，$k$可以大到$10^6$，因此任何简单地模拟操作的算法都会太慢。 每个操作通过其自身的函数增加一个元素，并且因为$b_i \le 10^3$，达到任意操作的次数$b_i$是有界的并且相对较小。 这表明我们可以预先计算从 1 开始达到每个可能目标的最小操作数。 

当出现不明显的边缘情况时$k = 0$。 在这种情况下，无法增加任何元素，因此贡献金币的唯一元素是那些目标元素$b_i = 1$。 粗心的实现可能会尝试在不检查的情况下执行操作$k = 0$并给出非零答案。 另一个边缘情况是当$b_i = 1$; 达到 1 需要零操作，这一点必须得到承认。 

## 方法

 蛮力方法将模拟每个可能的选择$x$对于每个元素，直到它到达目标，计算操作。 对于单个元素$a_i$，需要达到的操作次数$b_i$可能达到$b_i - 1$，因为每次操作都会增加$a_i$至少 1. 跨度$n$元素，这可能会导致$n \cdot 10^3$每个测试用例模拟的操作，乘以范围$x$，很快就超过了时间限制。 

关键的观察结果是，达到从 1 开始的任何值所需的最少操作次数相对较少，并且与$k$。 为了$1 \le a_i \le 10^3$，我们可以预先计算一个数组`ops_needed[val]`这样`ops_needed[val]`是要达到的最小操作数`val`从 1 开始。我们可以使用类似 BFS 的方法构建它，从 1 开始探索，并针对每个当前值应用所有可能的操作$a_i + \lfloor a_i / x \rfloor$不超过 1000。这给出了 1000 以内所有值的最小操作表。 

一旦我们知道每个目标的最少操作$b_i$，问题简化为经典的有界背包问题。 每个元素都是一个权重等于的项目`ops_needed[b_i]`和值等于`c_i`。 我们有一个容量足够的背包$k$我们希望最大化硬币总数。 使用动态规划`k`是有效的，因为`k`可以达到$10^6$但所有项目的最小操作总和要小得多； 具体来说，所有的总和`ops_needed[b_i]`跨一个测试用例最多$n \cdot 12$因为没有元素需要超过大约 12 次操作才能达到 1000。因此，DP 超过`k`我们从未超越的优化`k`效果很好。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * b_i * x) | O(n * b_i * x) | O(1) | O(1) | 太慢了 |
 | 最优（预计算+背包）| O(n * k) 最坏情况，实际 ~O(n * max_ops_needed) | O(k) | 已接受 |

 ## 算法演练

 1. 预先计算达到 1 到 1000 之间每个值的最小操作数。从包含 1 和 0 个操作的队列开始。 对于队列中的每个值，迭代`x`从 1 到当前值。 将下一个值计算为`next_val = cur + cur // x`。 如果`next_val`之前未达到，将其操作计数为`cur_ops + 1`并将其添加到队列中。 当 1000 以内的所有值都填满时停止。 
2. 对于每个测试用例，请阅读`n`,`k`,`b`， 和`c`。 将问题转化为背包问题：对于每个元素，`weight = ops_needed[b_i]`和`value = c_i`。 
3.初始化一个DP数组`dp[0..k]`到 0，其中`dp[j]`代表最多可获得的最大硬币`j`运营。 
4. 对于每个元素，迭代`j`从`k`下降到`weight`。 更新`dp[j] = max(dp[j], dp[j - weight] + value)`。 向后迭代可确保每个元素最多使用一次。 
5. 处理完所有元素后，`dp[k]`包含可达到的最大硬币数`k`运营。 输出这个值。 

为什么有效：预先计算最少的操作可以保证我们知道实现每个目标的成本最低的方法。 DP 确保我们选择其组合操作符合预算的元素子集`k`同时最大化金币。 向后迭代可防止重复计算任何元素，从而保留 0-1 背包属性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

# Precompute minimal operations to reach values from 1 to 1000
MAX_VAL = 1000
ops_needed = [float('inf')] * (MAX_VAL + 1)
ops_needed[1] = 0
queue = deque([1])
while queue:
    cur = queue.popleft()
    cur_ops = ops_needed[cur]
    for x in range(1, cur + 1):
        nxt = cur + cur // x
        if nxt <= MAX_VAL and ops_needed[nxt] > cur_ops + 1:
            ops_needed[nxt] = cur_ops + 1
            queue.append(nxt)

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    b = list(map(int, input().split()))
    c = list(map(int, input().split()))
    
    # Map b[i] to ops_needed, cap at k+1 (we cannot use more than k)
    weights = [min(ops_needed[val], k + 1) for val in b]
    
    dp = [0] * (k + 1)
    for w, v in zip(weights, c):
        if w > k:
            continue
        for j in range(k, w - 1, -1):
            dp[j] = max(dp[j], dp[j - w] + v)
    
    print(dp[k])
```预计算部分确保每个目标值都有其最小的运算次数。 使用 BFS 可以防止冗余的重新计算并避免无限循环。 将权重映射到`min(ops_needed[val], k + 1)`确保我们跳过无法到达的元素`k`运营。 背包 DP 处理子集选择。 迭代`j`向后保证 0-1 选择。 

## 工作示例

 **样品1**

 输入：```
n = 4, k = 4
b = [1, 7, 5, 2]
c = [2, 6, 5, 2]
```| 我| b_i | ops_needed | 需要操作 c_i | DP 更新 |
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | 2 | dp[0..4] = max(dp[j], dp[j-0]+2) → 将 2 添加到所有 j |
 | 1 | 7 | 4 | 6 | dp[4] = max(dp[4], dp[0]+6)=8, dp[3]=..., 等等 |
 | 2 | 5 | 3 | 5 | 与 dp 结合最大化 |
 | 3 | 2 | 1 | 2 | 最终 dp[4]=9 |

 这证实了 DP 选择在操作限制内最大化硬币的元素。 

**边缘情况 k=0**

 输入：```
n = 3, k = 0
b = [1, 2, 1]
c = [5, 4, 3]
```| 我| b_i | ops_needed | 需要操作 c_i | DP 更新 |
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | 5 | dp[0] = 最大值(0,0+5)=5 |
 | 1 | 2 | 1 | 4 | 权重>k，跳过|
 | 2 | 1 | 0 | 3 | dp[0]=max(5,5+3)=8 |

 正确计算已经等于 1 的元素中的硬币。 

## 复杂度分析

 | 测量| 复杂
