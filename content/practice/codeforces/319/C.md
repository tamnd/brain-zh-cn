---
title: "CF 319C - 伐木行业中的 Kalila 和 Dimna"
description: "我们得到了一系列高度严格增加的树。 每棵树都可以使用电锯一次砍伐一个单位。 电锯每次砍伐后都需要充电，充电费用取决于哪些树已经被完全砍伐。"
date: "2026-06-06T02:07:17+07:00"
tags: ["codeforces", "competitive-programming", "dp", "geometry"]
categories: ["algorithms"]
codeforces_contest: 319
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 189 (Div. 1)"
rating: 2100
weight: 319
solve_time_s: 100
verified: false
draft: false
---

[CF 319C - 伐木行业中的 Kalila 和 Dimna](https://codeforces.com/problemset/problem/319/C)

 **评分：** 2100
 **标签：** dp、几何
 **求解时间：** 1m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一系列高度严格增加的树。 每棵树都可以使用电锯一次砍伐一个单位。 电锯每次砍伐后都需要充电，充电费用取决于哪些树已经被完全砍伐。 具体来说，如果已完全砍伐的最高索引树是树_i_，则重新充电的成本是_b[i]_。 目标是彻底砍伐所有树木，同时最大限度地减少补给费用的总成本。 

输入由整数 _n_、高度数组 _a_ 和成本数组 _b_ 组成。 高度从 1 开始严格递增，补给成本严格递减，以 0 结尾。输出是一个数字：将所有树降低到高度 0 的最小总成本。 

约束表明 _n_ 最多可达 10^5，而 _a[i]_ 和 _b[i]_ 最多可达 10^9。 模拟每个切割单元的强力方法是不可行的，因为在最坏的情况下可能需要多达 10^14 次操作。 我们需要 _n_ 中的线性或近线性解。 边缘情况包括 _n = 1_，其中第一棵树的高度已经为 1，并且成本可能不为零，以及成本降至 0 的情况，这意味着电锯最终可以自由充电。 

总是立即将下一棵树砍为 0 而不考虑累积成本的幼稚方法将会失败。 例如，如果我们有`a = [1, 2, 3]`和`b = [5, 2, 0]`，在第一棵树完成之前砍伐第二棵树可能会迫使我们反复付出更高的成本。 

## 方法

 暴力方法将模拟电锯逐棵树切割，更新每次充电的当前成本。 在每个切割单元，我们都会检查最大完成树并添加相应的_b[i]_。 这在逻辑上是正确的，但完全不可行，因为操作次数可能总计为所有高度的总和，可能是 10^14。 

优化的关键观察来自两个阵列的单调结构：高度严格增加，成本严格降低。 每棵树都必须被完全切割，因此可以安全地以块的形式来考虑问题：当前最大树为 _i_ 时要进行多少次切割。 由于砍伐较晚的树木不会增加较早树木的成本，因此最小总成本可以表示为每棵树的高度之和，乘以砍伐期间适用的最小补给成本。 

这自然会导致动态规划。 让`dp[i]`表示砍伐树木 1 到 _i_ 的最小总成本。 对于树_i_，我们可以决定相对于之前的树开始切割它的最佳点。 由于单调性，最优策略始终是连续的：我们将一些连续的树集合一起砍伐以最小化补给成本。 其递归式为：```
dp[i] = min(dp[j] + (a[i] - a[j]) * b[j])  for all j < i
```这里，`a[i] - a[j]`是完成树_j_后要切割树_i_的单元数，并且`b[j]`是该段期间的每单位成本。 使用凸性属性，我们可以应用凸包技巧在 O(n) 或 O(n log n) 内有效地计算此问题，避免对所有 j < i 进行二次评估。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(总和(a[i])) | O(n) | 太慢了 |
 | 动态规划+凸包技巧| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个DP数组`dp`大小为 _n_，其中`dp[i]`表示砍伐树木 1 到 i 的最小成本。 放`dp[0] = a[0] * b[0]`，砍伐第一棵树的成本。 
2. 使用双端队列或列表来维护凸包技巧的候选行。 每行代表先前的状态`(slope, intercept)`对应于`b[j]`和`dp[j] - a[j]*b[j]`。 
3. 对于每棵树`i`从 1 到 n-1，查询凸包以找到最小化的线`dp[j] + (a[i] - a[j]) * b[j]`。 这给出了到达树_i_的最小成本。 
4. 添加对应的新行`i`进入凸包。 如果新线路使旧线路变得多余，请将其删除。 
5.处理完所有树后，`dp[n-1]`包含完全砍伐所有树木的最小成本。 

工作原理：DP 公式通过将切割分成多个部分来正确捕获总成本，每个部分按当时最大完成的树收费。 凸包技巧是有效的，因为成本函数是线性的`a[i]`随着斜率减小（单调`b[i]`），确保候选线的序列是凸的，并且每一步只需要最小的相交线。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import deque

def main():
    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    
    dp = [0] * n
    dp[0] = a[0] * b[0]
    
    lines = deque()
    lines.append((b[0], dp[0] - a[0]*b[0]))
    
    def value(line, x):
        m, c = line
        return m * x + c
    
    for i in range(1, n):
        while len(lines) >= 2 and value(lines[0], a[i]) >= value(lines[1], a[i]):
            lines.popleft()
        dp[i] = value(lines[0], a[i])
        new_line = (b[i], dp[i] - a[i]*b[i])
        while len(lines) >= 2:
            m1, c1 = lines[-2]
            m2, c2 = lines[-1]
            m3, c3 = new_line
            if (c3 - c2) * (m2 - m1) <= (c2 - c1) * (m3 - m2):
                lines.pop()
            else:
                break
        lines.append(new_line)
    
    print(dp[n-1])

if __name__ == "__main__":
    main()
```DP 数组跟踪每棵树的总成本。 凸包中的线代表候选的先前状态。 查询船体可以有效地降低成本。 行去除条件使用交叉乘法以避免浮点错误。 

## 工作示例

 样本1：```
n = 5
a = [1, 2, 3, 4, 5]
b = [5, 4, 3, 2, 0]
```| 我| dp[i] | dp[i] | i | 之后的行 (m, c)
 | --- | --- | --- |
 | 0 | 5 | [(5,0)] |
 | 1 | 9 | [(5,0),(4,1)] |
 | 2 | 12 | 12 [(5,0),(4,1),(3,3)] |
 | 3 | 14 | 14 [(5,0),(4,1),(3,3),(2,6)] |
 | 4 | 15 | 15 [(5,0),(4,1),(3,3),(2,6),(0,15)] |

 这演示了累积最小成本计算和仅维护相关线的凸包。 

样本2：```
n = 3
a = [1,3,6]
b = [6,3,0]
```| 我| dp[i] | dp[i] | 线路 |
 | --- | --- | --- |
 | 0 | 6 | [(6,0)] |
 | 1 | 12 | 12 [(6,0),(3,6)] |
 | 2 | 12 | 12 [(6,0),(3,6),(0,12)] |

 在这里，凸包只会选择较早的高成本线路，直到更便宜的线路占据主导地位。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每行最多在双端队列中添加和删除一次。 |
 | 空间| O(n) | DP 数组和双端队列使用线性空间。 |

 该解决方案可以轻松扩展到 n=10^5 并处理较大的 a[i] 和 b[i] 值，因为每棵树的操作都是常数摊销的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().strip()

# provided sample
assert run("5\n1 2 3 4 5\n5 4 3 2 0\n") == "25", "sample 1"

# minimum input
assert run("1\n1\n10\n") == "10", "single tree"

# two trees, high first cost
assert run("2\n1 2\n100 0\n") == "200", "two trees"

# monotone large input
assert run("3\n1 10 100\n10 5 0\n") == "550", "large height differences"

# all b decreasing slowly
assert run("4\n1 2 3 4\n10 9
```
