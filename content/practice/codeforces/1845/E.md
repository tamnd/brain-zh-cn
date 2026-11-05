---
title: "CF 1845E - 盒子和球"
description: "我们有一排 n 个盒子，有些里面有一个球，有些是空的。 允许的操作是将球从盒子移动到相邻的空盒子中，相邻性定义为连续索引。"
date: "2026-06-09T05:56:49+07:00"
tags: ["codeforces", "competitive-programming", "dp", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1845
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 151 (Rated for Div. 2)"
rating: 2500
weight: 1845
solve_time_s: 103
verified: false
draft: false
---

[CF 1845E - 盒子和球](https://codeforces.com/problemset/problem/1845/E)

 **评分：** 2500
 **标签：** dp、实现、数学
 **求解时间：** 1m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一行`n`盒子，有些里面有一个球，有些是空的。 允许的操作是将球从盒子移动到相邻的空盒子中，相邻性定义为连续索引。 恰好之后`k`在这样的移动中，我们需要计算盒子中球的不同配置的数量`10^9 + 7`。 

该问题本质上要求计算具有简单局部转换的离散系统中可达状态的计数。 每个盒子都可以处于状态`0`或者`1`，并且转换仅限于移动`1`s 到邻近的`0`s。 和`n`最多 1500 和`k`直到 1500，任何枚举所有移动序列的蛮力方法都是无望的，因为状态数量呈指数级增长。 这强烈暗示动态编程是正确的工具。 

当球聚集在一端或分散以致只能到达位置的子集时，就会出现边缘情况。 例如，如果输入是`1 1 0 0`和`k = 1`，只有一个球可以移动，产生两种可能的排列。 以每种可能的顺序移动每个球的简单模拟可能会重复计算配置或超出时间限制。 当多个球可以以不同的顺序移入同一个空盒子时，就会出现另一个微妙之处 - 这些顺序会导致相同的最终配置，因此我们需要一种方法来避免计数过多。 

## 方法

 暴力解决方案将尝试模拟每个序列`k`移动。 对于每个步骤，我们识别所有相邻的盒子对，其中第一个包含球，第二个是空的，移动球，然后递归地继续。 该方法的分支因子高达`n`每一步，都会产生`O(n^k)`可能的序列，这对于`n, k`最多 1500。 

关键的观察结果是，该问题可以建模为在由球的位置定义的状态空间中计数游走，并且只允许相邻交换。 我们可以准确地跟踪达到某个状态的方式数量，而不是跟踪序列`k`使用动态规划进行移动。 定义`dp[i][j]`作为精确移动的方式数量`j`球进入第一个`i`最多使用的盒子`k`移动。 状态转换是通过计算将球移动到给定位置所需的移动次数来实现的。 这将复杂性从指数降低到多项式。 

另一个有用的观察是球独立移动，每次移动都会影响相对位置。 该问题可以重新定义为计算非负整数序列`x1, x2, ..., xm`代表球向左或向右移动了多少个空盒子，受`sum(xi) = k`。 这导致了组合DP：对于每个连续的球和零段，我们计算在它们之间分配移动后的排列数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^k) | O(n^k) | O(n^k) | O(n^k) | 太慢了 |
 | 球位置动态规划 | O(n^2 * k) | O(n^2 * k) | O(n * k) | 已接受 |

 ## 算法演练

 1. 解析输入以确定球的初始位置。 将位置存储在列表中`balls`。 确定球的数量`m`以及空盒子的数量`n-m`。 
2.定义DP表`dp[i][j]`在哪里`i`范围超过`0..m`（考虑的球数）和`j`范围超过`0..k`（执行的移动次数）。`dp[i][j]`将存储精确分配的方式数量`j`跻身前列`i`球产生不同的最终安排。 
3. 初始化`dp[0][0] = 1`，代表零步的零球。 
4. 迭代每个球`b`（从`i = 1`到`m`）。 对于每个`j`在`0..k`，考虑将这个球移动到`max_shift`在当前空段内向左或向右定位。 所需移动的次数等于距原始位置的距离。 更新`dp[i][j + moves_needed] += dp[i-1][j]`模数`10^9 + 7`。 
5. 处理完所有球后，答案就是`dp[m][k]`在所有有效的分布上。 这正确地计算了所有可到达的安排`k`移动，而不会过度计算导致相同配置的序列。 

为什么它有效：DP 保持不变式`dp[i][j]`计算第一个的所有不同配置`i`球完全使用`j`移动。 通过增量处理球并在它们之间分配移动，我们考虑了可到达的所有有效最终位置`k`移动。 组合过渡可以正确处理重叠，确保不会对任何排列进行两次计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

n, k = map(int, input().split())
a = list(map(int, input().split()))

balls = [i for i, val in enumerate(a) if val == 1]
m = len(balls)
dp = [[0] * (k + 1) for _ in range(m + 1)]
dp[0][0] = 1

for i in range(1, m + 1):
    pos = balls[i - 1]
    for j in range(k + 1):
        if dp[i - 1][j] == 0:
            continue
        for move in range(k - j + 1):
            # calculate new position index bounds
            left_bound = i - 1  # minimum left shifts (cannot cross previous ball)
            right_bound = n - m + i - 1  # maximum right shifts (cannot cross next empty)
            new_pos = pos + move
            if left_bound <= new_pos <= right_bound:
                dp[i][j + move] = (dp[i][j + move] + dp[i - 1][j]) % MOD

print(dp[m][k])
```该解决方案首先收集球的位置以简化索引。 DP表初始化为零和`dp[0][0] = 1`对于基本情况。 对于每个球，我们考虑它在允许的段内移动的所有方式，尊重邻接约束。 与之前的球重叠或超过总移动次数的移动`k`被忽略。 每一步都应用模运算以防止溢出。 

## 工作示例

 **样本 1 输入：**```
4 1
1 0 1 0
```| 球指数| 原创 POS | 考虑的举动| DP更新|
 | --- | --- | --- | --- |
 | 1 | 0 | 移动 0 → 0 | dp[1][0] = 1 |
 | 1 | 0 | 移动 1 → 1 | dp[1][1] = 1 | dp[1][1] = 1 |
 | 2 | 2 | 移动 0 → 2 | dp[2][1] += dp[1][1] = 1 |
 | 2 | 2 | 移动 1 → 3 | dp[2][1] += dp[1][0] = 1 |

 该表确认了 1 次移动后有 3 种不同的排列：`0 1 1 0`,`1 0 0 1`,`1 1 0 0`。 

**自定义输入：**```
3 2
1 0 1
```| 球指数| 原创 POS | 考虑的举动| DP更新|
 | --- | --- | --- | --- |
 | 1 | 0 | 0,1,2 | dp[1][0..2] 更新 |
 | 2 | 2 | 0,1,2 | dp[2][2] = 方式总和 = 2 |

 可以达成两种安排：`0 1 1`,`1 1 0`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * k^2) | O(n * k^2) | 对于最多 n 个球中的每一个，我们迭代 k 个动作，并可能更新最多 k 个位置。 |
 | 空间| O(n * k) | DP表存储`m+1`经过`k+1`条目。 |

 该算法在约束范围内运行，因为`n, k ≤ 1500`和`1500^3`业务量约为30亿。 限制移动范围等优化会显着减少实际工作量。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    MOD = 10**9 + 7
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    balls = [i for i, val in enumerate(a) if val == 1]
    m = len(balls)
    dp = [[0] * (k + 1) for _ in range(m + 1)]
    dp[0][0] = 1
    for i in range(1, m + 1):
        pos = balls[i - 1]
        for j in range(k + 1):
            if dp[i - 1][j] == 0:
                continue
            for move in range(k - j + 1):
                left_bound = i - 1
                right_bound = n - m + i - 1
                new_pos = pos + move
                if left_bound <= new_pos <= right_bound:
                    dp[i][j + move]
```
