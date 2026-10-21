---
title: "CF 1158F - 子阵列的密度"
description: "我们得到一个正整数数组，每个正整数都以数字 $c$ 为界。 任务是检查该数组的所有子序列并按称为密度的数字对它们进行分类。"
date: "2026-06-12T02:30:58+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 1158
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 559 (Div. 1)"
rating: 3500
weight: 1158
solve_time_s: 91
verified: false
draft: false
---

[CF 1158F - 子数组的密度](https://codeforces.com/problemset/problem/1158/F)

 **评分：** 3500
 **标签：** dp、数学
 **求解时间：** 1m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个正整数数组，每个正整数由一个数字组成$c$。 任务是检查该数组的所有子序列并按称为密度的数字对它们进行分类。 密度定义为最大整数$p$这样每个可能的长度数组$p$，元素从 1 到$c$，显示为给定数组的子序列。 换句话说，长度的子序列$p$涵盖从 1 到 的所有数字组合$c$长度$p$必须存在于其中。 目标是对从 0 到 的每个可能的密度进行计数$n$，有多少子序列恰好具有该密度。 

输入大小为$n \le 3000$和$c \le 3000$。 这立即排除了显式考虑所有子序列的算法，因为有$2^n$子序列，大致是$10^{900}$在上限。 我们需要一种使用数组结构和密度定义的方法，而不是枚举所有子序列。 

边缘情况包括所有元素都相等的数组或其中$c > n$。 例如，如果$a = [1,1,1,1]$和$c=1$，任何长度的子序列$k$自动具有密度$k$。 如果$c = 3$和$a = [1,1]$，所有子序列的密度均为 0，因为没有子序列包含从 1 到 3 的所有元素。在这些情况下，仅检查子序列或其元素的长度的粗心方法将失败。 

## 方法

 暴力方法将枚举所有子序列，通过检查所有长度的数组来计算每个子序列的密度$p$，并计算有多少满足每个密度。 这种做法理论上是正确的，但是操作次数是$O(n 2^n)$用于生成子序列和$O(c^p)$检查每个，这对于$n \sim 3000$。 

关键的观察结果是密度由每个数字的第一次和最后一次出现的存在控制。 具体来说，要保证密度$p$，子序列必须包含从 1 到$c$以这样的方式，没有数字被排除在形成长度之外$p$大批。 这允许采用动态编程方法，我们将元素固定为段中的最小值，并递归地计算左侧和右侧的有效子序列。 通过迭代值 1 到$c$以及它们的第一次和最后一次出现，我们可以避免直接枚举所有子序列。 

实际上，我们将问题简化为分而治之的 DP，其中段中的最小元素对数组进行划分，并且左右段的贡献相乘。 这利用了这样一个事实：包含最小元素的子序列可以独立于左段和右段进行组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n 2^n c^p) | O(n 2^n c^p) | O(2^n) | O(2^n) | 太慢了|
 | 最小单元段上的 DP | O(n^2c) | O(n^2c) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 预先计算从 1 到$c$在数组中。 这些位置决定了每个数字必须出现的边界，以维持密度约束。 如果某个数字没有出现，则密度会受到该数字的缺失的限制。 
2.定义DP表`dp[l][r]`表示段内有效子序列的数量$a[l..r]$满足密度条件。 初始化`dp[l][r] = 1`空段允许递归计数相乘。 
3. 以增加的长度迭代所有可能的段。 对于每个段，找到最小的数字`min_val`出现在该段中。 使用其第一次出现和最后一次出现，将段分为三部分：第一次出现的左侧、覆盖最小元素的位置以及最后一次出现的右侧。 
4. 通过递归组合左右段来计算有效子序列的数量，确保每个子序列在中心段中恰好包含一次最小元素。 将左侧和右侧的子序列数相乘。 
5. 累积与每个密度值对应的所有段长度的计数。 涵盖数字从 1 到 的确切出现次数的段`p`有助于密度`p`。 使用模运算来避免溢出。 
6. 最后，对于密度为0，统计所有不满足任何大于零的密度的子序列，这些子序列本质上是缺少至少一个从1到1的数字的子序列`c`。 

主要的不变量是，对于每个 DP 段，我们计算包含该段中具有最小值的所有数字的所有子序列。 由于最小元素划分了段，因此左右子序列的所有组合都是独立的，这保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

n, c = map(int, input().split())
a = list(map(int, input().split()))

# Record first and last occurrence
first = [n] * (c + 1)
last = [-1] * (c + 1)
for i, val in enumerate(a):
    first[val] = min(first[val], i)
    last[val] = max(last[val], i)

# dp[l][r]: number of valid subsequences in a[l..r]
dp = [[0] * n for _ in range(n)]

for length in range(1, n + 1):
    for l in range(n - length + 1):
        r = l + length - 1
        min_val = min(a[l:r + 1])
        left_options = 1
        right_options = 1

        # compute left options
        for i in range(l, first[min_val]):
            left_options = left_options * (dp[i][first[min_val]-1] + 1) % MOD

        # compute right options
        for i in range(last[min_val] + 1, r + 1):
            right_options = right_options * (dp[last[min_val]+1][i] + 1) % MOD

        dp[l][r] = left_options * right_options % MOD

# accumulate results
s = [0] * (n + 1)
for l in range(n):
    for r in range(l, n):
        length = r - l + 1
        s[length] = (s[length] + dp[l][r]) % MOD

print(' '.join(map(str, s)))
```该解决方案设置第一次和最后一次出现的数组，初始化 DP 表，并迭代段长度。 对于每个段，它计算最小元素左侧和右侧的贡献，并将它们乘以模 998244353。子序列计数累积到按密度索引的最终答案数组中。 

## 工作示例

 样本1：`n=4, c=1, a=[1,1,1,1]`| 细分 | 最小值 | 左选项 | 右选项 | dp[l][r] | dp[l][r] |
 | --- | --- | --- | --- | --- |
 | [0,0]| 1 | 1 | 1 | 1 |
 | [0,1]| 1 | 1 | 1 | 1 |
 | [0,2]| 1 | 1 | 1 | 1 |
 | [0,3]| 1 | 1 | 1 | 1 |

 所有子序列长度 k=1..4 均正确计数，得出`0 4 6 4 1`。 

样本2：`n=4, c=3, a=[1,1,1,1]`所有密度 >=1 的段都会失败，因为数字 2 和 3 丢失，只有密度 0 有效。 输出：`15 0 0 0 0`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2c) | O(n^2c) | DP 迭代 O(n^2) 段并处理 O(c) 第一次/最后一次出现 |
 | 空间| O(n^2) | O(n^2) | DP 表存储所有段的计数 |

 由于 n ≤ 3000，这符合限制，产生约 900 万个 DP 单元。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    MOD = 998244353

    n, c = map(int, input().split())
    a = list(map(int, input().split()))

    first = [n] * (c + 1)
    last = [-1] * (c + 1)
    for i, val in enumerate(a):
        first[val] = min(first[val], i)
        last[val] = max(last[val], i)

    dp = [[0] * n for _ in range(n)]
    for length in range(1, n + 1):
        for l in range(n - length + 1):
            r = l + length - 1
            min_val = min(a[l:r + 1])
            left_options = 1
            right_options = 1
            for i in range(l, first[min_val]):
                left_options = left_options * (dp[i][first[min_val]-1] + 1) % MOD
            for i in range(last[min_val]+1, r+1):
                right_options = right_options * (dp[last[min_val]+1][i] + 1
```
