---
title: "CF 463D - Gargari 和排列"
description: "我们得到从 1 到 n 的 k 个数字排列。 排列只是这些数字的重新排列。 我们的目标是找到在所有 k 个排列中以相同相对顺序出现的最长数字序列的长度。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 463
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 264 (Div. 2)"
rating: 1900
weight: 463
solve_time_s: 58
verified: true
draft: false
---

[CF 463D - Gargari 和排列](https://codeforces.com/problemset/problem/463/D)

 **评级：** 1900
 **标签：** dfs 和类似的、dp、图、实现
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到从 1 到 _n_ 的 _k_ 种数字排列。 排列只是这些数字的重新排列。 我们的目标是找到在所有 _k_ 排列中以相同相对顺序出现的最长数字序列的长度。 换句话说，我们需要计算多个排列中的最长公共子序列（LCS），而不仅仅是两个字符串或序列。 

这些约束给我们 _n_ 最大为 1000，_k_ 最大为 5。这立即排除了任何迭代所有子序列的蛮力方法，因为长度 _n_ 的子序列数量为 2^n，这对于 _n_ = 1000 来说是一个天文数字。即使是两个序列的标准动态编程方法 (O(n^2)) 也可以很好地扩展 _n_ = 1000，但我们需要一个能够有效扩展到 _k_ 个序列的解决方案。 

一个微妙的边缘情况是所有排列都相同。 在这种情况下，LCS 只是长度 _n_ 的完整排列。 另一种情况是排列彼此之间的顺序完全相反。 例如，如果 n=3、k=2 并且序列为 [1,2,3] 和 [3,2,1]，则 LCS 仅为 [2] 或 [1] 或 [3]，即长度 1。仅将第一个序列与其他序列进行成对比较的粗心方法可能会过度计算元素并给出错误答案。 

## 方法

 暴力方法将尝试生成第一个排列的所有子序列，并检查每个子序列是否出现在所有其他排列中。 这是可行的，因为检查另一个排列中序列的成员资格是线性的，但子序列的数量是 2^n，所以即使 n=20 它也已经太慢了。 对于n=1000，这是不可行的。 

有效解决这个问题的关键在于每个排列都包含数字 1 到 n。 这使我们能够将数字映射到每个排列中的位置。 对于出现在所有排列中的任何子序列，这些数字的相对顺序必须在所有序列的索引位置中递增。 因此，问题简化为找到最长的数字序列 1..n，其索引在所有排列中同时增加。 

一旦我们将每个数字编码为所有 k 个排列的位置元组，问题就相当于在 k 维空间中寻找最长的递增序列。 由于 n ≤ 1000 且 k ≤ 5，因此动态编程方法可以按第一次排列的顺序迭代数字并检查先前的数字。 具体来说，我们可以将 dp[x] 定义为以 x 结尾的最长公共子序列的长度。 我们按照第一个排列的顺序迭代数字，并且对于每个数字，检查所有先前的数字以查看它们是否在所有其他排列中出现较早。 如果是这样，我们可以从 dp[y] + 1 扩展 dp[x]。 

这会产生 O(n^2 * k) 解决方案，这是可行的，因为 n^2 * k ≤ 1000^2 * 5 = 5 * 10^6 次操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * n * k) | O(2^n * n * k) | O(n) | 太慢了 |
 | 带有位置映射的动态规划 | O(n^2 * k) | O(n^2 * k) | O(n * k) | 已接受 |

 ## 算法演练

 1.读取元素个数n和排列数k。 
2.将所有k个排列存储在列表列表中以便于访问。 
3. 为每个排列构建一个位置图：pos[i][x] 存储排列 i 中数字 x 的从 0 开始的索引。 这允许对数字索引进行恒定时间查找。 
4. 初始化一个长度为n+1的数组dp。 dp[x] 将存储以数字 x 结尾的最长公共子序列的长度。 
5. 按照第一次排列的顺序迭代数字。 对于每个数字`current`，初始化 dp[current] = 1，因为仅包含该数字的子序列的长度为 1。 
6. 对于每个数字`previous`之前的`current`在第一个排列中，检查它是否出现在之前`current`在所有其他排列中。 这是通过比较从 1 到 k-1 的所有 i 的 pos[i][previous] < pos[i][current] 来完成的。 
7. 如果`previous`出现在之前`current`在所有排列中，更新 dp[current] = max(dp[current], dp[previous] + 1)。 
8、处理完所有数字后，dp中的最大值就是最长公共子序列的长度。 
9. 打印该最大值。 

工作原理：dp[x] 正确存储以 x 结尾的最长公共子序列，因为我们仅使用所有排列中有效前驱的数字来扩展序列。 通过按照第一个排列的顺序处理数字，我们确保子序列根据第一个序列保持有序，并且对其他排列的检查确保全局尊重子序列顺序。 这个不变量保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
perms = [list(map(int, input().split())) for _ in range(k)]

# position mapping: pos[i][x] = index of x in permutation i
pos = [{} for _ in range(k)]
for i in range(k):
    for idx, val in enumerate(perms[i]):
        pos[i][val] = idx

dp = [0] * (n + 1)
first_perm = perms[0]

for current in first_perm:
    dp[current] = 1
    for previous in first_perm:
        if previous == current:
            break
        if all(pos[i][previous] < pos[i][current] for i in range(1, k)):
            dp[current] = max(dp[current], dp[previous] + 1)

print(max(dp))
```位置图确保我们可以快速比较排列之间的相对顺序。 在第一个排列中迭代数字可保证 dp 的构建尊重至少一个排列中的序列。 这`all`检查确保所有序列的 LCS 条件。 

## 工作示例

 ### 示例 1

 输入：```
4 3
1 4 2 3
4 1 2 3
1 2 4 3
```| 当前| 上一页 | 邮政支票| dp[当前] |
 | --- | --- | --- | --- |
 | 1 | - | - | 1 |
 | 4 | 1 | 是的 | 2 |
 | 2 | 1 | 是的 | 2 |
 | 2 | 4 | 没有| 2 |
 | 3 | 1 | 是的 | 2 |
 | 3 | 4 | 是的 | 3 |
 | 3 | 2 | 是的 | 3 |

 最大dp = 3，对应子序列[1,2,3]。 

### 示例 2

 输入：```
3 2
1 2 3
3 2 1
```| 当前| 上一页 | 邮政支票| dp[当前] |
 | --- | --- | --- | --- |
 | 1 | - | - | 1 |
 | 2 | 1 | 没有| 1 |
 | 3 | 1 | 没有| 1 |
 | 3 | 2 | 没有| 1 |

 最大 dp = 1，这是正确的，因为 LCS 长度为 1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2 * k) | O(n^2 * k) | 对于第一个排列中的每个数字，我们检查所有先前的数字并比较 k 个排列中的位置 |
 | 空间| O(n * k) | 位置图和大小为 n+1 的 dp 数组 |

 假设 n ≤ 1000 且 k ≤ 5，则 n^2 * k ≤ 5 * 10^6，这完全在 2 秒限制内。 内存使用量极低，轻松低于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    perms = [list(map(int, input().split())) for _ in range(k)]
    pos = [{} for _ in range(k)]
    for i in range(k):
        for idx, val in enumerate(perms[i]):
            pos[i][val] = idx
    dp = [0] * (n + 1)
    first_perm = perms[0]
    for current in first_perm:
        dp[current] = 1
        for previous in first_perm:
            if previous == current:
                break
            if all(pos[i][previous] < pos[i][current] for i in range(1, k)):
                dp[current] = max(dp[current], dp[previous] + 1)
    return str(max(dp))

# Provided samples
assert run("4 3\n1 4 2 3\n4 1 2 3\n1 2 4 3\n") == "3", "sample 1"
assert run("3 2\n1 2 3\n3 2 1\n") == "1", "reversed order"

# Custom cases
assert run("1 2\n1\n1\n") == "1", "single element"
assert run("5 2\n1 2 3 4 5\n1 2 3 4 5\n") == "5", "all identical"
assert run("5 3\n1 2 3 4 5\n5 4 3
```
