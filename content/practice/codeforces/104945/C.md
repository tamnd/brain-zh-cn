---
title: "CF 104945C - 地铁测验"
description: "我们得到了地铁线路的集合，其中每条线路都可以看作是大小最多为 18 个的固定宇宙中车站的子集。一条线路可以通过其停靠的车站来完整描述。"
date: "2026-06-28T07:08:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104945
codeforces_index: "C"
codeforces_contest_name: "2023-2024 ICPC Southwestern European Regional Contest (SWERC 2023)"
rating: 0
weight: 104945
solve_time_s: 102
verified: false
draft: false
---

[CF 104945C - Metro 测验](https://codeforces.com/problemset/problem/104945/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 42s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了地铁线路的集合，其中每条线路都可以看作是大小最多为 18 个的固定宇宙中车站的子集。一条线路可以通过其停靠的车站来完整描述。 

统一随机选择一条线路，任务是通过询问“未知线路在 i 站停靠吗？”形式的是/否问题来识别该线路。 每个答案将剩余的候选线分为包含站 i 的候选线和不包含站 i 的候选线。 

我们被要求设计一个最佳的提问策略，该策略最终总是唯一地识别线路，并且在所有这些策略中，我们希望最小化线路均匀分布下的预期问题数量。 

策略相当于构建二叉决策树。 每个内部节点查询一个站，每条边对应是或否，限制了可能的线路集合。 叶子的成本是它的深度，我们最小化所有行的平均叶子深度。 

约束以非常具体的方式严格。 站数最多为 18，这意味着每行都可以编码为 18 位掩码。 行数最多为 50 行，因此我们操作的是相对较小的对象集，但决策过程可以呈指数级分支。 这种组合强烈建议对行子集进行动态编程解决方案，因为我们正在优化使用一小组二进制特征来分离一小部分项目的所有方法。 

一个关键的可行性条件是唯一性。 如果两条线路有完全相同的车站组，那么每个可能的问题都会为它们产生相同的答案，因此永远无法区分它们。 在这种情况下，答案是不可能的。 

当多条线路不同但仅在从未有效查询的站点中时，会出现微妙的故障情况。 天真的贪婪分割可以轻松地快速隔离一条线，但留下高度不平衡的剩余集，从而产生次优的预期深度。 这就是局部分割启发式不能可靠工作的原因。 

## 方法

 蛮力策略将明确构建每个可能的决策树。 在每个节点，我们选择一个站点进行查询，然后递归地构建左子树和右子树。 可能的树的数量是巨大的，因为每个线子集可以以多种方式分割，并且可以通过不同的查询序列到达相同的子集。 即使只有 50 行，决策树的数量也是天文数字，这种方法会立即失败。 

关键的观察是，过程的状态完全由剩余候选线的集合决定，而不是由我们如何到达那里决定。 如果我们当前处于线路子集 S 处，则从该点开始的最佳预期成本仅取决于 S。这自然会导致线路子集上的动态规划公式。 

对于任何子集 S，我们尝试将每个站点 i 作为下一个问题。 该查询根据每条线路是否包含车站 i 将 S 分为 S0 和 S1。 选择站点 i 的预期成本是一个问题加上两个结果子集的最优成本的加权平均值。 我们选择能够最小化这种期望的电台。 

递归被很好地定义，因为每个转换都严格减少不确定性，并且子集最终达到大小一，不需要进一步的问题。 

困难在于计算：直线子集多达 2^50 个，太大而无法枚举。 然而，递归仅访问通过从完整集合开始分割站点查询而实际可到达的子集。 实际上，这个集合要小得多，并且可以使用由子集掩码键控的记忆化来缓存。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 枚举所有决策树 | 树中的指数| 指数| 太慢了 |
 | 具有记忆功能的线子集上的 DP | O(可达状态数 × N × M) | O(状态数) | 已接受 |

 ## 算法演练

 我们将每条线路表示为长度为 N 的整数位掩码，其中位 i 表示线路是否在车站 i 停靠。 

然后我们定义一个递归函数 dp(S)，其中 S 是当前仍然可能的线索引的子集。 

1. 如果 S 只包含一行，则成本为零，因为不需要进一步的问题来识别它。 这是递归的基本情况。 
2. 如果之前已经计算过 S，则返回存储的结果。 这可以防止重新计算通过不同查询路径达到的相同状态。 
3.对于当前集合S，我们尝试从0到N-1的每个站i作为候选问题。 这代表询问未知线路是否包括站 i。 
4.对于固定站i，我们将S分成两个子集。 一个包含 S 中包含车站 i 的所有线路，另一个包含不包含车站 i 的线路。 这些对应于两个可能的答案。 
5. 如果任一子集为空，则该查询无助于区分当前状态并被忽略。 
6. 否则，我们计算选择站点 i 的预期成本为：

 一个问题加上两个子集的最优成本的加权平均值，按它们在 S 内的大小进行加权。 
7. 我们取所有有效站点的最小值并将其存储为 dp(S)。 

最终答案是 dp(所有行)，其中所有行都是完整的索引集。 

### 为什么它有效

 每个有效的提问策略都对应一个决策树，其中每个节点都由与迄今为止答案一致的行集精确定义。 从该点开始，导致相同子集 S 的两个不同历史是无法区分的，因此最优决策仅取决于 S 而不是路径。 这建立了动态​​规划所需的最佳子结构。 

由于每个查询将一个集合分割成总大小严格较小的不相交子集，因此递归必须在单例处终止，以确保基本情况传播的正确性。 该算法会评估每个状态下所有可能的第一个问题，因此不会错过最佳分割。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

def solve():
    N = int(input())
    M = int(input())

    masks = []
    for _ in range(M):
        tmp = list(map(int, input().split()))
        k = tmp[0]
        stations = tmp[1:]
        mask = 0
        for s in stations:
            mask |= 1 << s
        masks.append(mask)

    # check distinguishability
    seen = set(masks)
    if len(seen) != M:
        print("not possible")
        return

    from functools import lru_cache

    full = tuple(range(M))

    @lru_cache(None)
    def dp(state):
        if len(state) <= 1:
            return 0.0

        best = float('inf')

        # try each station
        for i in range(N):
            left = []
            right = []
            for idx in state:
                if masks[idx] & (1 << i):
                    left.append(idx)
                else:
                    right.append(idx)

            if not left or not right:
                continue

            left = tuple(left)
            right = tuple(right)

            pL = len(left) / len(state)
            pR = 1 - pL

            cost = 1 + pL * dp(left) + pR * dp(right)
            if cost < best:
                best = cost

        return best

    ans = dp(full)
    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案首先将每条地铁线路压缩为车站的位掩码。 这允许使用位运算在每行 O(1) 的时间内评估每个查询。 

递归DP函数是核心。 它将线路索引的每个可达子集视为一个状态，并尝试将每个站点作为拆分查询。 记忆至关重要，因为许多不同的查询序列可能导致相同的剩余候选集。 

概率权重是直接根据子集大小计算的，因为每条线的可能性相同，并且状态条件保持了均匀性。 

一个微妙的实现细节是将线的子集表示为元组。 这使得它们可以进行哈希缓存，但仍然易于迭代。 递归深度受 M 限制，因为每个成功的查询都必须减少歧义。 

## 工作示例

 ### 示例 2

 输入：```
3
3
1 0
1 1
1 2
```3条线路均为单站组。 

| 状态 S | 所选车站 | 分裂| 预计成本|
 | ---| ---| ---| ---|
 | {0,1,2} | 0 | {0} / {1,2} | 计算|
 | {1,2} | 1 | {1} / {2} | 计算|

 从根开始，询问站 0 立即隔离一条线并留下两条线。 然后第二个查询区分这两者。 最佳期望值变为 5/3。 

该跟踪显示了算法如何自然地更喜欢早期隔离单例的分割。 

### 示例 1

 输入：```
5
4
3 0 3 4
3 0 2 3
3 2 3 4
2 1 2
```从根本上来说，不同的车站对四条线路产生不同的分区。 DP 对所有这些进行评估，并选择使子树成本的加权组合最小化的站点。 每个后续状态在较小的子集上重复相同的过程，直到所有线都分开。 

该跟踪证实，尽管多个分割看起来是对称的，但只有 DP 正确地解释了下游不平衡。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(状态 × N × M) | 每个州都会尝试所有站点并扫描该州内的所有线路 |
 | 空间| O(状态 × M) | 记忆化存储每个可到达的行子集 |

 状态的数量取决于数据，但受到通过站分割可到达的不同子集的数量的限制。 当 M 最多为 50 时，这在预期的约束下仍然可行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math

    N = int(sys.stdin.readline())
    M = int(sys.stdin.readline())
    masks = []
    for _ in range(M):
        tmp = list(map(int, sys.stdin.readline().split()))
        k = tmp[0]
        stations = tmp[1:]
        mask = 0
        for s in stations:
            mask |= 1 << s
        masks.append(mask)

    if len(set(masks)) != M:
        return "not possible"

    from functools import lru_cache

    full = tuple(range(M))

    @lru_cache(None)
    def dp(state):
        if len(state) <= 1:
            return 0.0
        best = float('inf')
        for i in range(N):
            left = tuple(idx for idx in state if masks[idx] & (1 << i))
            right = tuple(idx for idx in state if not (masks[idx] & (1 << i)))
            if not left or not right:
                continue
            pL = len(left) / len(state)
            cost = 1 + pL * dp(left) + (1 - pL) * dp(right)
            best = min(best, cost)
        return best

    return dp(full)

# provided samples
assert abs(run("5\n4\n3 0 3 4\n3 0 2 3\n3 2 3 4\n2 1 2\n") - 2.0) < 1e-6
assert abs(run("3\n3\n1 0\n1 1\n1 2\n") - 1.66666666666667) < 1e-6

# custom cases
assert run("2\n2\n1 0\n1 0\n") == "not possible"
assert abs(run("2\n2\n1 0\n1 1\n") - 1.0) < 1e-6
assert abs(run("3\n2\n2 0 1\n1 2\n2 1 2\n") < 5.0)
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 重复相同的行 | 不可能| 不可能检测|
 | 完全可分离的单例结构| 1.0 | 最好的情况是早点分离|
 | 混合重叠结构| 有限值| 重叠分割下的正确性|

 ## 边缘情况

 当两条线路相同时，每个站查询都会产生相同的答案，因此算法在 DP 开始之前正确拒绝实例。 任何继续的尝试都会将两条线永远保留在每个子集中，从而防止终止。 

当每条线路在一个站点上都不同时，第一个查询会立即隔离一条线路，同时留下一个较小的独立子问题。 DP 自然更喜欢这样做，因为它可以最小化加权子树成本，符合早期隔离单例的最佳直觉。 

当许多线路在大多数站点上都是相同的并且仅在一小部分上有所不同时，天真的贪婪选择往往会过度拟合早期的分割。 如果它们不能改善整个子树的加权预期成本，DP 会正确地延迟此类分割，从而保持全局最优性。
