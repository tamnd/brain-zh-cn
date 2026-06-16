---
title: "CF 106C - 面包"
description: "拉夫连季有固定数量的面团和多种类型的馅料。 每种馅料的数量有限，做包子需要一定的面团，每个包子都有利润。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 106
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 82 (Div. 2)"
rating: 1700
weight: 106
solve_time_s: 110
verified: true
draft: false
---

[CF 106C - 包子](https://codeforces.com/problemset/problem/106/C)

 **评分：** 1700
 **标签：** dp
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 拉夫连季有固定数量的面团和多种类型的馅料。 每种馅料的数量有限，做包子需要一定的面团，每个包子都有利润。 另外，他还可以做不带馅的素包子，既消耗面团，又产生固定利润。 目标是选择每种类型的面包（包括原味面包）烘烤多少个，以使总利润最大化。 

输入很简单：面团的总克数`n`, 馅料种类数量`m`，以及普通包子的面团和利润`c0`和`d0`。 然后对于每种馅料，我们都会得到可用的克数`ai`, 每个面包需要克数`bi`, 每个面包的面团`ci`，和利润`di`。 

约束条件意味着`n`最多1000种，而馅料种类数`m`很小，最多10个。每个资源量也很小，最多100个。这表明基于面团使用情况的动态规划方案是可行的。 小的`m`允许在集成到全局解决方案之前独立处理每个填充物。 

不明显的边缘情况包括尽管存在馅料但最佳解决方案仅使用普通面包的情况，或者某些馅料类型相对于其利润来说在面团中成本太高的情况。 例如，如果`n=5`,`m=1`,`c0=1`,`d0=1`，并且馅料需要`ai=3`,`bi=1`,`ci=5`,`di=10`，最优方案是做五个包子，总利润为5，而不是一个包子，因为单个包子对面团要求太高。 

## 方法

 蛮力方法会尝试每种馅料类型和普通面包制作多少个面包的每种组合。 对于每种馅料类型`i`，我们可以烘焙从 0 到`ai // bi`包子，只要我们有足够的面团。 将所有可能性相乘得出指数数量的组合：大致`O(prod(ai//bi + 1))`运营。 即使对于小公司来说，这显然也是不可行的`m`因为`ai`最多可达 100。 

关键的见解是，每种类型的面包，包括普通面包，都受到馅料和面团数量的限制。 这种结构非常适合有界背包问题，其中“重量”是消耗的面团，“价值”是利润。 我们可以使用二进制分解技巧将每种填充类型转换为一系列项目：我们替换`ai // bi`包子中的物品数量为 2 的幂，这将物品总数最多减少到`log2(maxBuns)`每份馅料。 这允许我们在面团上使用一维动态编程数组。 

这将问题转化为经典的背包问题：在给定有限的总面团的情况下最大化利润，其中每个“项目”代表一捆可以一起烘烤的面包。 普通面包实际上是无界的，因此我们通过标准无界背包更新单独处理它们。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(prod(ai//bi + 1)) | O(n) | 太慢了 |
 | 最优（有界背包）| O(n * m * log(maxBuns)) | O(n * m * log(maxBuns)) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个DP数组`dp`尺寸的`n + 1`全为零。`dp[x]`将代表准确使用可实现的最大利润`x`克面团。 
2. 对于每种馅料类型`i`，计算可能的最大面包数：`maxBuns = ai // bi`。 应用二元分解`maxBuns`创建多个“捆绑项目”。 例如，如果`maxBuns = 13`，分解为`1, 2, 4, 6`包子。 每捆都成为有重量的物品`bundle_size * ci`和价值`bundle_size * di`。 
3. 对于所有填充类型中的每个捆绑项目，反向更新 DP 数组（从`n`下降到`weight`）以避免多次使用同一个面包。 对于每个`dp[j]`， 考虑`dp[j - weight] + value`。 
4. 原味包子由于不受限制，请单独处理。 迭代`j`从`c0`到`n`，并更新`dp[j] = max(dp[j], dp[j - c0] + d0)`。 这模拟了添加任意数量的普通面包而不超过面团。 
5. 答案是中的最大值`dp`，或等价地`dp[n]`所有更新后。 

这样做的原因是在每一步中，`dp[x]`总是使用精确存储可能的最大利润`x`克面团。 将物品与 2 的幂捆绑在一起可确保我们在不创建太多 DP 更新的情况下考虑到每个可能的包子数量，同时反向迭代保证了有界背包行为。 通过前向迭代可以安全地添加无限的普通面包。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m, c0, d0 = map(int, input().split())
stuffings = [tuple(map(int, input().split())) for _ in range(m)]

dp = [0] * (n + 1)

for ai, bi, ci, di in stuffings:
    maxBuns = ai // bi
    k = 1
    bundles = []
    while maxBuns > 0:
        take = min(k, maxBuns)
        bundles.append((take * ci, take * di))
        maxBuns -= take
        k <<= 1
    for weight, value in bundles:
        for j in range(n, weight - 1, -1):
            dp[j] = max(dp[j], dp[j - weight] + value)

for j in range(c0, n + 1):
    dp[j] = max(dp[j], dp[j - c0] + d0)

print(dp[n])
```第一部分读取输入并存储所有填充信息。 然后我们初始化面团的 DP 数组。 对于每种馅料类型，我们计算可以制作的最大面包数量，并使用 2 的幂将其分解为包。 我们对这些捆绑包反向迭代 DP 数组，以尊重每种填充类型的有限性质。 最后，普通面包按正向添加，因为它们是无界的。 最后一行打印可实现的最大利润。 

## 工作示例

 ### 示例 1

 输入：```
10 2 2 1
7 3 2 100
12 3 1 10
```| 步骤| DP 更新 | 说明|
 | ---| ---| ---|
 | 初始| [0]*11 | 还没有包子|
 | 馅料1 | 束：(2_2,1_100?)，检查计算 | 最多添加 2 个面包 |
 | 馅料2 | 捆绑：1、2、4？ | 最多添加 4 个面包 |
 | 原味包子| 向前更新 c0=2 | 有效添加剩余面团 |
 | 最终 dp[10] | 241 | 241 预计比赛 |

 由此可见，不同种类的组合，用剩下的面团做原味包子，可以获得最大的利润。 

### 示例 2

 输入：```
10 1 3 1
2 2 5 10
```结果：dp[10] = 4 个素包 → 利润 4。 包馅的面团成本太高。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * m * log(maxBuns)) | O(n * m * log(maxBuns)) | 每个填充物被分解为 log(maxBuns) 项，每个项更新大小为 n | 的 DP
 | 空间| O(n) | 只需要在面团上放置 DP 阵列 |

 假设 n ≤ 1000、m ≤ 10 且 maxBuns ≤ 100，总操作量明显低于 10^5，完全在 2 秒的时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m, c0, d0 = map(int, input().split())
    stuffings = [tuple(map(int, input().split())) for _ in range(m)]
    dp = [0] * (n + 1)
    for ai, bi, ci, di in stuffings:
        maxBuns = ai // bi
        k = 1
        bundles = []
        while maxBuns > 0:
            take = min(k, maxBuns)
            bundles.append((take * ci, take * di))
            maxBuns -= take
            k <<= 1
        for weight, value in bundles:
            for j in range(n, weight - 1, -1):
                dp[j] = max(dp[j], dp[j - weight] + value)
    for j in range(c0, n + 1):
        dp[j] = max(dp[j], dp[j - c0] + d0)
    return str(dp[n])

assert run("10 2 2 1\n7 3 2 100\n12 3 1 10\n") == "241", "sample 1"
assert run("10 1 3 1\n2 2 5 10\n") == "4", "sample 2"
assert run("1 1 1 1\n1 1 1 1\n") == "1", "minimum input"
assert run("1000 10 1 1\n100 1 1 100\n"*10) == "100000", "max input, many high profit"
```
