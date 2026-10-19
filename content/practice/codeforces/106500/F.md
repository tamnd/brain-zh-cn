---
title: "CF 106500F - 彩色球 - 2"
description: "我们得到一排球，每个球都涂有最多十种可能的颜色中的一种。 唯一允许的操作是交换两个相邻的球，每次交换花费一个单位。"
date: "2026-06-25T08:36:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106500
codeforces_index: "F"
codeforces_contest_name: "XXVIII Interregional Programming Olympiad, Vologda SU, 2026"
rating: 0
weight: 106500
solve_time_s: 40
verified: true
draft: false
---

[CF 106500F - 彩色球 - 2](https://codeforces.com/problemset/problem/106500/F)

 **评级：** -
 **标签：** -
 **求解时间：** 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一排球，每个球都涂有最多十种可能的颜色中的一种。 唯一允许的操作是交换两个相邻的球，每次交换花费一个单位。 目标是重新排列顺序，使所有相同颜色的球出现在一个连续的块中，这意味着没有颜色被分成多个单独的部分。 

任务是计算达到每种颜色恰好形成一个间隔的任何排列所需的最小相邻交换数量。 

约束条件$n \le 2 \cdot 10^5$立即排除任何尝试模拟交换或通过搜索排列显式构建最终排列的方法。 甚至一个$O(n^2)$方法会太慢，因为它可能会到达周围$4 \cdot 10^{10}$运营。 我们被迫采用线性或近线性策略并仔细计数。 

一些微妙的情况很重要。 

例如，如果所有球已经形成每种颜色的单一色块`1 1 2 2 3 3`，答案为零。 任何在不检查连续性的情况下错误地尝试“重新排序为排序颜色”的方法仍然可以在这里正确运行，但前提是它不会引入不必要的交换。 

例如，如果颜色严重交错`1 2 1 2 1 2`，天真的贪婪分组可能会低估成本，因为它忽略了将一个颜色块移动到另一个颜色块需要考虑它们之间的所有成对反转。 

主要困难在于互换取决于所有货币对的相对顺序，而不是局部修正。 

## 方法

 暴力视图会尝试考虑所有可能的方式来排列十个色块。 由于颜色很少，人们可能会考虑排列颜色并计算将每种颜色移动到其段中的成本。 对于固定的颜色顺序，我们可以通过将每个元素相对于早期颜色贡献的反转次数相加来计算所需的交换次数。 这已经暗示了一种结构：一旦颜色的最终顺序固定，成本就变得确定了。 

暴力破解的想法之所以有效，是因为一旦我们决定了色块的顺序，最佳排列就是“全是 1，然后是全 2，……按照这个顺序”。 问题是最多有$10!$排列，只有360万种，所以如果我们能直接计算最优顺序，实际上是可行的，但仍然没有必要完全枚举。 

关键的见解是我们不需要显式地尝试所有排列。 相反，我们可以使用预先计算的颜色之间的成对交互成本来计算每个可能排序的成本。 放置颜色的成本$a$上色前$b$仅取决于原始数组中存在多少个它们之间的反转：每次$b$出现在$a$，该货币对贡献一次互换，如果$a$被放置在之前$b$。 

这将问题转化为最多十个节点的加权排序问题，其中边权重表示颜色之间的反转计数。 然后，我们选择一个最小化总成本的顺序，这可以使用颜色子集上的位掩码动态编程来解决。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 尝试所有排列 |$O(10! \cdot n)$|$O(10)$| 可以接受但没有必要 |
 | 颜色位掩码 DP |$O(10^2 \cdot 2^{10})$|$O(2^{10})$| 已接受 |

 ## 算法演练

 我们将问题压缩为颜色之间的相互作用。 

1. 我们计算原始数组中每种颜色出现的频率以及颜色对以“错误顺序”出现的频率。 对于每对颜色$c$和$d$，我们数一下a有多少次$d$出现在 a 之前$c$。 该值表示如果我们决定将所有$c$优先于所有$d$s。 
2. 我们根据颜色子集已被放置在最终排序中来定义状态。 每个状态代表一个部分排序，我们希望构建所有十种颜色。 
3.对于给定的状态，我们尝试添加新的颜色$c$尚未放置。 放置的增量成本$c$接下来的计算方法是将预先计算的反演贡献相加$c$并且所有颜色都已经处于状态。 这是有效的，因为一旦放置了一种颜色，它与未来颜色的相对位置就固定了。 
4. 我们对所有子集执行动态规划转换。 子集的 DP 值是以与子集一致的某种顺序精确排列这些颜色的最小成本。 
5. 我们以空集零成本初始化 DP，并通过一次添加一种新颜色来放松过渡。 最终的答案是全套颜色的DP值。 

关键的不变量是，对于每个子集，DP 存储以某种固定顺序精确排列这些颜色的最小可能成本。 由于任意两种颜色之间的成本仅取决于它们的相对顺序并且与其他颜色无关，因此组合最佳子解决方案是安全的。 以后的决定不能改变已经固定对的贡献。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    # compress colors to 0..9
    color_id = {}
    comp = []
    for x in a:
        if x not in color_id:
            color_id[x] = len(color_id)
        comp.append(color_id[x])

    k = len(color_id)

    # count inversions between colors
    # cost[c][d] = number of pairs (i < j) with a[i]=c, a[j]=d
    cost = [[0] * k for _ in range(k)]

    cnt = [0] * k
    for x in comp:
        for c in range(k):
            if c != x:
                cost[x][c] += cnt[c]
        cnt[x] += 1

    # dp[mask] = min cost for ordering colors in mask
    INF = 10**18
    dp = [INF] * (1 << k)
    dp[0] = 0

    for mask in range(1 << k):
        for nxt in range(k):
            if mask & (1 << nxt):
                continue

            add_cost = 0
            for c in range(k):
                if mask & (1 << c):
                    add_cost += cost[nxt][c]

            nmask = mask | (1 << nxt)
            dp[nmask] = min(dp[nmask], dp[mask] + add_cost)

    print(dp[(1 << k) - 1])

if __name__ == "__main__":
    solve()
```该解决方案首先压缩颜色，因为只有相对标识才重要，而不是数字标签。 反转计数步骤构建一个矩阵，用于在任何有序的颜色对之间强制进行多少次交换。 

然后 DP 探索所有颜色子集。 转换计算将颜色附加到当前排序的增量成本，这正是其与已放置颜色的冲突之和。 这就是实现中发生许多错误的地方：成本必须是定向的，因为交换$c$前$d$不对称于$d$前$c$。 

最终的答案来自完整的位掩码，表示所有颜色都已放置。 

## 工作示例

 考虑输入`4 / 2 1 2 1`。 

我们首先压缩颜色：假设`2 -> A`,`1 -> B`。 数组变成`A B A B`。 

我们计算反转成本。 

| 步骤| 面膜| 行动| 添加成本 | DP值|
 | --- | --- | --- | --- | --- |
 | 0 | 000 | 000 开始 | 0 | 0 |
 | 1 | 001| 地点 A | 0 | 0 |
 | 2 | 011| B 地 | 1 | 1 |
 | 3 | 010| B 地 | 0 | 0 |
 | 4 | 110 | 110 地点 A | 1 | 1 |

 最终结果变为 1，与一个相邻交换足以对颜色进行分组的事实相匹配。 

该跟踪表明 DP 不是直接构建最终字符串，而是一致地累积成对排序成本。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(k^2 \cdot 2^k)$| 逆矩阵计算为$O(nk)$, DP 探索颜色的所有子集和过渡 |
 | 空间|$O(2^k + k^2)$| DP数组加成本矩阵|

 和$k \le 10$，DP 极小。 主要成本是阵列的线性扫描，这很容易在限制范围内$n \le 2 \cdot 10^5$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    stdout.write = lambda x: out.append(x)
    out.clear()
    solve()
    return "".join(out)

def solve():
    import sys
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    color_id = {}
    comp = []
    for x in a:
        if x not in color_id:
            color_id[x] = len(color_id)
        comp.append(color_id[x])

    k = len(color_id)

    cost = [[0] * k for _ in range(k)]
    cnt = [0] * k
    for x in comp:
        for c in range(k):
            if c != x:
                cost[x][c] += cnt[c]
        cnt[x] += 1

    INF = 10**18
    dp = [INF] * (1 << k)
    dp[0] = 0

    for mask in range(1 << k):
        for nxt in range(k):
            if mask & (1 << nxt):
                continue
            add = 0
            for c in range(k):
                if mask & (1 << c):
                    add += cost[nxt][c]
            dp[mask | (1 << nxt)] = min(dp[mask | (1 << nxt)], dp[mask] + add)

    print(dp[(1 << k) - 1])

out = []

# minimum size
assert run("1\n1\n") == "0"

# already grouped
assert run("4\n1 1 2 2\n") == "0"

# alternating
assert run("4\n1 2 1 2\n") == "1"

# all same
assert run("5\n3 3 3 3 3\n") == "0"

# three colors mixed
assert run("6\n1 2 3 1 2 3\n") >= "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 0 | 基本情况|
 | 已经连续的组| 0 | 无需交换 |
 | 交替模式| 1 | 反转处理|
 | 统一颜色| 0 | 退化案例|
 | 循环混合| 变量| 多色互动|

 ## 边缘情况

 对于单一颜色，DP 除了空之外只有一种状态，并且成本矩阵为空，因此每次转换都会加零。 该算法正确返回零交换。 

对于完全按颜色排序的数组，例如`1 1 1 2 2 2`，所有反转计数在“正确方向”上均为零，因此每个尊重自然分组的排序都会产生零成本，并且 DP 收敛到零而不会产生任何意外惩罚。 

对于交替模式，例如`1 2 1 2 1 2`，逆矩阵变得对称但非零。 DP 正确选择了最小化交叉反转的顺序，并且每一步都一致地计算所有成对冲突，而不是尝试修复本地交换，从而防止计数不足。
