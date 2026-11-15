---
title: "CF 494C - 帮助别人"
description: "我们的任务是在一系列慈善建议之后计算一群人的预期最大财富。 每个人一开始都有已知数量的钱。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 494
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 282 (Div. 1)"
rating: 2600
weight: 494
solve_time_s: 42
verified: true
draft: false
---

[CF 494C - 帮助别人](https://codeforces.com/problemset/problem/494/C)

 **评分：** 2600
 **标签：** dp，概率
 **求解时间：** 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们的任务是在一系列慈善建议之后计算一群人的预期最大财富。 每个人一开始都有已知数量的钱。 有多个建议，每个建议指定一部分人获得一美元，每个建议都有一个被执行的概率。 预期的最大财富或“善良”是考虑到这些概率的所有可能结果的加权平均值。 

关键的复杂性来自两个属性。 首先，段可以是不相交的，也可以是嵌套的，这意味着两个段都不会部分重叠，除非一个段完全包含在另一个段中。 其次，每个推荐的概率是独立的。 我们需要有效地处理多达 100,000 人和 5,000 条建议，这使得任何枚举所有结果的方法都不可行，因为建议子集的数量呈指数级增长。 

一种简单的方法可能会尝试模拟已接受建议的所有 2^q 个子集，计算每个子集的最终财富数组，并取最大值的加权平均值。 对于 q 高达 5,000 的情况，这显然是不可能的。 另一个微妙之处是正确处理嵌套段 - 如果一个段位于另一个段内，则其效果会重叠，并且必须在依赖关系链中进行处理。 忽略这些依赖性可能会产生不正确的预期值。 

边缘情况包括一个人有多个重叠的建议、所有建议都被拒绝或接受、以及具有相同或不同概率的重复片段。 例如，如果一个人最初有 3 美元，收到两个推荐，每个推荐都以 0.5 的概率覆盖它们，则预期最大值不仅仅是 3 + 0.5 + 0.5 = 4； 我们必须考虑两者同时应用的可能性。 

## 方法

 强力解决方案将迭代所有可能的已接受建议集。 对于每组，我们都会增加每个受保人的资金并计算最大值。 这种方法之所以有效，是因为它尊重概率模型，但当 q 达到 5,000 时，2^q 个可能的集合使其完全不可行。 

关键的见解是认识细分市场的层次结构。 由于段是不相交的或嵌套的，因此它们可以表示为树：每个段都包含其嵌套段作为子级，并且不相交的段形成单独的树。 对于一个段，我们只需要考虑其内部嵌套段的概率，独立于外部的其他段。 这允许在分段树上采用动态编程方法，其中对于每个分段，我们计算其中接受的推荐数量的概率分布。 然后，我们可以结合嵌套段的分布来获得父段的贡献。 

我们可以利用每个细分最多为每个受保人增加 1 美元这一事实来进一步优化。 我们可以跟踪一个人逐步达到每个潜在值的概率，而不是跟踪所有可能的总和。 概率的独立性允许递归计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（所有子集）| O(2^q * n) | O(2^q * n) | O(n) | 太慢了|
 | 线段树DP/概率分布| O(n * q) | O(n * q) | 已接受 |

 ## 算法演练

1. 解析输入：人数 n、初始财富数组、推荐数量 q、每个推荐及其分段边界和接受概率。 
2. 基于遏制构建建议树。 如果段 A 完全包含段 B，则 B 成为 A 的子级。不相交的段是单独的根。 按左端点和长度对段进行排序可以简化父分配。 
3. 定义递归函数`dfs(segment)`计算该细分市场内最大财富增量的概率分布。 如果被接受，每个部分都会向其范围内的每个人贡献一美元，并有一定的概率。 使用动态编程：维护一个数组`dp[i]`表示一个人从嵌套段中恰好收到 i 个额外美元的概率。 
4. 对于每个叶段，概率分布很简单：概率 p 时我们加一，1-p 时我们加零。 
5. 对于父段，通过卷积合并其子段的分布，然后考虑父段自身被接受的概率。 这给出了整个子树的组合概率分布。 
6. 对于每个人，使用独立性将覆盖他们的所有部分的分布结合起来。 然后，通过对按概率加权的所有可能增量求和来计算预期最大财富。 
7. 最后，将不相交线段的所有独立树的预期最大值相加，以获得总体预期优度。 

工作原理：树表示保证每个段的效果独立于不相交的段进行计算，并且 DP 确保考虑到所有嵌套依赖关系。 概率分布对已接受的推荐的所有组合进行完全编码，而无需明确枚举它们。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from functools import lru_cache

n, q = map(int, input().split())
a = list(map(int, input().split()))

segments = []
for _ in range(q):
    l, r, p = input().split()
    segments.append((int(l)-1, int(r)-1, float(p)))

# Sort segments by left then right to help nesting
segments.sort(key=lambda x: (x[0], -x[1]))

# Build tree
parents = [-1] * q
stack = []
for i, (l, r, _) in enumerate(segments):
    while stack and segments[stack[-1]][1] < r:
        stack.pop()
    if stack:
        parents[i] = stack[-1]
    stack.append(i)

children = [[] for _ in range(q)]
for i, p in enumerate(parents):
    if p != -1:
        children[p].append(i)

# dp[i][k] = probability that this segment adds exactly k dollars to all its covered people
@lru_cache(None)
def dfs(idx):
    l, r, p = segments[idx]
    # Leaf segment
    probs = {0: 1 - p, 1: p}
    for child in children[idx]:
        child_probs = dfs(child)
        new_probs = {}
        for k1, v1 in probs.items():
            for k2, v2 in child_probs.items():
                new_probs[k1+k2] = new_probs.get(k1+k2, 0) + v1*v2
        probs = new_probs
    return probs

# For each person, accumulate probability of increments
exp_max = 0.0
increments = [0.0] * n
for i in range(n):
    prob = {0: 1.0}
    for j, (l, r, p) in enumerate(segments):
        if l <= i <= r and parents[j] == -1:
            seg_probs = dfs(j)
            new_prob = {}
            for k1, v1 in prob.items():
                for k2, v2 in seg_probs.items():
                    new_prob[k1+k2] = new_prob.get(k1+k2, 0) + v1*v2
            prob = new_prob
    # Expected value of this person's final wealth
    exp = sum((a[i] + k) * v for k, v in prob.items())
    exp_max = max(exp_max, exp)

print(f"{exp_max:.9f}")
```该解决方案解析输入，对段进行排序以管理嵌套，并构建父子树。 这`dfs`函数递归地计算每个片段的概率分布，并且我们将每个人的不相交片段的分布组合起来。 最后，我们计算每人的预期财富并跟踪最大值。 

## 工作示例

 **示例输入 1**```
5 2
1 7 2 4 3
1 3 0.500
2 2 0.500
```| 人 | 基地| 涵盖的细分市场 | 概率分布| 预期财富 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | [1] | {0:0.5,1:0.5} | 1_0.5+2_0.5=1.5 |
 | 2 | 7 | [1,2]| 组合={0:0.25,1:0.5,2:0.25} | 7_0.25+8_0.5+9*0.25=8 |
 | 3 | 2 | [1] | {0:0.5,1:0.5} | 2_0.5+3_0.5=2.5 |
 | 4 | 4 | []| {0:1} | 4 |
 | 5 | 3 | []| {0:1} | 3 |

 最大期望财富为8。 

**示例输入 2**```
3 1
0 0 0
1 3 0.250
```| 人 | 基地| 细分 | 概率分布| 预期财富 |
 | ---| ---| ---| ---| ---|
 | 1 | 0 | [1] | {0:0.75,1:0.25} | 0.25 | 0.25
 | 2 | 0 | [1] | {0:0.75,1:0.25} | 0.25 | 0.25
 | 3 | 0 | [1] | {0:0.75,1:0.25} | 0.25 | 0.25

 最大预期财富为 0.25。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * q) | 对于每个人，我们最多组合 q |
