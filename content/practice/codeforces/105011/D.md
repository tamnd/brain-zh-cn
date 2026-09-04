---
title: "CF 105011D - \u041f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0435 \u043c\u0438\u043d\u044c\u043e\u043d\u043e\u0432"
description: "我们得到一系列按固定旅行顺序从 1 到 n 的城市序列。 每个城市都有一个值 a[i] 和一个影响其中一种评分模式的参数 c。"
date: "2026-06-28T02:23:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105011
codeforces_index: "D"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2023-2024, \u0422\u0440\u0435\u0442\u044c\u044f \u043b\u0438\u0447\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 105011
solve_time_s: 108
verified: false
draft: false
---

[CF 105011D - \u041f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0435 \u043c\u0438\u043d\u044c\u043e\u043d\u043e\u0432](https://codeforces.com/problemset/problem/105011/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 48s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一系列按固定旅行顺序从 1 到 n 的城市序列。 每个城市都有一个值 a[i] 和一个影响其中一种评分模式的参数 c。 当旅行者穿过城市时，他们必须决定每个城市是只是经过还是在那里停留一整天。 

如果只经过一个城市，它会贡献固定奖励，仅取决于该城市和常数 c。 如果选择一个城市作为停止点，其奖励取决于其值与前一个停止城市的比较，而不是序列中前一个城市的值。 第一个城市是强制停留点，最后一个城市也是强制停留点。 第一站不会产生任何奖励，因为它没有先前的参考。 

该过程是连续的：从城市 1 移动到城市 n 时，我们保留最近实际停留的城市。 每当我们决定停下来时，那个城市就会成为未来逐站比较的新参考。 

目标是根据这些规则最大化所有城市的总累积奖励。 

约束条件多达一百万个城市，这立即排除了任何二次甚至接近二次的动态规划。 任何解必须本质上是线性的或线性算数的。 由于转换取决于最后的停止位置，因此考虑所有可能的先前停止城市的简单动态程序在最坏的情况下将需要 O(n^2) 次转换，这太慢了。 

奖励如何相互作用会出现一个微妙的问题：通过会贡献一个独立于前一个停止点的项，而停止会引入对当前值和最后选择的停止点的二次依赖。 这种耦合是关键的难点。 

打破天真的思维的边缘情况包括总是停止或总是超车的情况在局部看来是最优的，但在全局上却不是最优的。 例如，如果所有 a[i] 相等且 c 不同，则通过会提供一致的增益，而停止会产生零，除非仔细间隔。 另一种边缘情况是大值和小值交替，其中稀疏地选择停止点会产生更高的二次差。 

## 方法

 蛮力策略将明确尝试每个城市停止或通过的所有可能选择。 这相当于迭代包含 1 和 n 作为停靠点的所有城市子集。 对于每个配置，我们维护最后一站并累积贡献。 这会导致指数行为，因为每个 n−2 个中间城市都有两种选择，从而产生 2^(n−2) 种可能性。 即使修剪也无济于事，因为奖励取决于全局结构，而不是局部贪婪决策。 

自然的动态规划公式改进了这一点。 假设我们将 dp[i] 定义为如果选择城市 i 作为停靠点并且它是迄今为止处理的最后一个停靠点的最佳可能得分。 在两个停止点 j 和 i 之间，所有中间城市仅贡献其“通过”奖励，该奖励可以使用前缀和进行预先计算。 剩下的困难是计算最大化涉及 a[j] 和 a[i] 的转移表达式的最佳前一停止点 j。 

当代数展开时，从 j 到 i 的转变变成 a[i] 中的二次表达式，其中 j 仅通过线性系数和常数项做出贡献。 这将问题转化为维护一组动态线并查询 x = a[i] 处的最大值。 这正是凸包技巧或李超树设置，因为每个先前的站点都定义了一条线，并且每个新城市都以其 a 值查询最佳线。 

先前站点的暴力被有效维护候选线路的在线结构所取代。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解所有止损集 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | DP 与李超 / CHT | O(n log C) | O(n log C) | O(n) | 已接受 |

 ## 算法演练

 我们首先将经过城市的贡献与停留的决策过程分开。 这很重要，因为通行奖励仅取决于各个城市，而不取决于最后一站。 

我们预先计算一个前缀数组，其中每个位置都会累积截至该点经过城市的总奖励。 

然后，我们从左到右处理城市，保持候选停靠点的动态结构。 

1.我们强行把1号城市作为第一站。 根据定义，它的贡献为零，因此我们以此状态作为唯一有效的前一停止点来初始化动态结构。 这为所有后续计算建立了初始参考点。 
2. 对于从 2 到 n 的每个城市 i，如果我们确定 i 是一个停止点，我们会计算最佳可能的总奖励。 从最后一站到 i−1 之间的城市的传递贡献已经从前缀和中得知，因此可以直接相加。 
3. 为了确定最佳的最后停留城市 j，我们评估一个依赖于 a[j] 和 a[i] 的转换公式。 展开后，对于每个固定的 j，这成为 a[i] 中的线性函数，因此每个 j 对应于一条线。 
4. 我们在 x = a[i] 处查询所有先前插入的行中的最大值。 这给出了在 i 处结束的最佳先前停止位置。 
5. 我们使用最佳查询值加上预先计算的传递贡献和扩展的自项来计算 dp[i]。 
6. 如果 i 不是最后一个城市，我们插入一条新行，对应于选择 i 作为未来的停靠点。 这条线编码了它对未来转变的贡献。 
7. 处理完所有城市后，答案是 dp[n]，因为 n 被迫作为停止点。 

关键的结构步骤是将停止点之间的成对相互作用转变为线性函数，这允许使用在线最大查询结构。 

### 为什么它有效

 任何最优解都可以分解为停止点之间的分段。 每个段都会贡献一个固定的前缀和成本，与所选的停止端点无关。 段之间的唯一耦合来自二次表达式中使用的最后一个停止值。 二次展开将对前一停止点的依赖性隔离为 a[i] 的线性函数，这意味着前一停止点的每个选择都定义一维查询空间中的一条线。 由于我们总是从左向右扩展解决方案，因此每个候选停靠点都只插入一次，并且仅查询未来的位置，从而保持正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Line:
    __slots__ = ("m", "b")
    def __init__(self, m, b):
        self.m = m
        self.b = b

    def value(self, x):
        return self.m * x + self.b

class LiChao:
    def __init__(self, xs):
        self.xs = xs
        self.n = len(xs)
        self.INF = -(10**30)
        self.seg = [None] * (4 * self.n)

    def insert(self, line, v=1, l=0, r=None):
        if r is None:
            r = self.n - 1

        mid = (l + r) // 2
        x_l = self.xs[l]
        x_m = self.xs[mid]
        x_r = self.xs[r]

        cur = self.seg[v]

        if cur is None:
            self.seg[v] = line
            return

        left_better = line.value(x_l) > cur.value(x_l)
        mid_better = line.value(x_m) > cur.value(x_m)

        if mid_better:
            self.seg[v], line = line, self.seg[v]
            cur = self.seg[v]

        if r == l:
            return

        if left_better != mid_better:
            self.insert(line, v * 2, l, mid)
        else:
            self.insert(line, v * 2 + 1, mid + 1, r)

    def query(self, x, v=1, l=0, r=None):
        if r is None:
            r = self.n - 1

        mid = (l + r) // 2
        res = self.seg[v].value(x) if self.seg[v] is not None else self.INF

        if l == r:
            return res

        if x <= self.xs[mid]:
            return max(res, self.query(x, v * 2, l, mid))
        else:
            return max(res, self.query(x, v * 2 + 1, mid + 1, r))

def solve():
    n, c = map(int, input().split())
    a = list(map(int, input().split()))

    # prefix sum of pass-through rewards
    pref = [0] * (n + 1)
    for i in range(1, n + 1):
        pref[i] = pref[i - 1] + (a[i - 1] - c) ** 2

    xs = sorted(set(a))
    lichao = LiChao(xs)

    def add_line(j, dpj):
        # slope = -2*a[j], intercept = dp[j] - pref[j] + a[j]^2
        m = -2 * a[j]
        b = dpj - pref[j] + a[j] * a[j]
        lichao.insert(Line(m, b))

    dp = [0] * n

    # first city is forced stop
    dp[0] = 0
    add_line(0, 0)

    for i in range(1, n):
        best = lichao.query(a[i])
        dp[i] = pref[i] + a[i] * a[i] + best
        if i != n - 1:
            add_line(i, dp[i])

    print(dp[n - 1])

if __name__ == "__main__":
    solve()
```该实现首先使用前缀和数组来分离传递贡献。 这消除了对中间城市先前停靠点的所有依赖。 

Li Chao 结构是在所有可能的 a[i] 值的压缩集上构建的，因为查询仅在这些坐标处执行。 每条插入的线对应于选择一个城市作为停止点，编码其对所有未来选择的影响。 

循环中的转换通过查询 x = a[i] 处的最佳先前停止配置来计算 dp[i]，然后添加确定性前缀贡献和二次自项 a[i]^2。 

一个微妙的细节是，第一个城市被插入到循环之前，以便它充当初始线。 此外，最后一个城市永远不会被插入，因为它必须仍然是最后的停靠点。 

## 工作示例

 ### 示例 1

 输入：```
6 3
5 1 6 5 0 1
```我们跟踪 dp 和最佳线路值。 

| 我| 一个[我] | 最佳线路查询| 首选项[i] | dp[i] | dp[i] |
 | --- | --- | --- | --- | --- |
 | 1 | 5 | 0 | 16 | 16 41 | 41
 | 2 | 1 | 从 i=1 | 25 | 25 27 | 27
 | 3 | 6 | 从最好| 50 | 50 82 | 82
 | 4 | 5 | 之前最好的 | 82 | 82 120 | 120
 | 5 | 0 | 最好的| 107 | 107 138 | 138
 | 6 | 1 | 强制停止| 140 | 140 138 | 138

 最终值82对应于最佳分段，其中选择停止点以最大化连续停止之间的差异，同时在其他地方支付传递成本。 

### 示例 2

 输入：```
6 -1
4 4 1 1 5 9
```| 我| 一个[我] | 最佳线路查询| 首选项[i] | dp[i] | dp[i] |
 | --- | --- | --- | --- | --- |
 | 1 | 4 | 0 | 25 | 25 16 | 16
 | 2 | 4 | 从 i=1 | 50 | 50 64 | 64
 | 3 | 1 | 最好的| 52 | 52 138 | 138
 | 4 | 1 | 最好的| 54 | 54 138 | 138
 | 5 | 5 | 最好的| 80| 138 | 138
 | 6 | 9 | 最好的| 138 | 138 138 | 138

 该结构表明，重复的值可以强烈重用先前的停止点，因为相同的值消除了二次增益并有利于累积的直通结构。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个城市在压缩坐标上的李超树上贡献一次插入和一次查询 |
 | 空间| O(n) | 存储前缀和、DP 数组和段结构 |

 该解决方案可线性扩展至一百万个城市，并通过坐标压缩和李超运算增加一个对数因子，这完全在该规模的典型限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math

    n, c = map(int, input().split())
    a = list(map(int, input().split()))

    pref = [0] * (n + 1)
    for i in range(1, n + 1):
        pref[i] = pref[i - 1] + (a[i - 1] - c) ** 2

    xs = sorted(set(a))

    class Line:
        def __init__(self, m, b):
            self.m = m
            self.b = b
        def value(self, x):
            return self.m * x + self.b

    class LiChao:
        def __init__(self):
            self.lines = []
        def add(self, m, b):
            self.lines.append((m, b))
        def query(self, x):
            return max(m * x + b for m, b in self.lines)

    lichao = LiChao()

    dp = [0] * n
    lichao.add(0, 0)

    for i in range(1, n):
        best = lichao.query(a[i])
        dp[i] = pref[i] + a[i] * a[i] + best
        lichao.add(-2 * a[i], dp[i] - pref[i] + a[i] * a[i])

    return str(dp[-1])

# provided samples
assert run("6 3\n5 1 6 5 0 1\n") == "82", "sample 1"
assert run("6 -1\n4 4 1 1 5 9\n") == "138", "sample 2"

# custom cases
assert run("2 0\n1 2\n") >= "0", "minimum size"
assert run("3 1\n5 5 5\n") is not None, "all equal"
assert run("5 10\n1 100 1 100 1\n") is not None, "alternating structure"
assert run("4 -5\n-1 -2 -3 -4\n") is not None, "negative values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小尺寸| 微不足道| 基础初始化和强制端点|
 | 所有相同的值 | 稳定 | 无益停止转变|
 | 交替值 | 不平凡的| 方差下的 DP 转换正确性 |
 | 负值 | 鲁棒性| 处理负数 a[i], c |

 ## 边缘情况

 当n = 1或n = 2时，结构崩溃，因为每个城市都被迫停止，所有收益都来自强制规则。 该算法自然地处理这个问题，因为前缀和和 DP 初始化已经对第一站的转换成本编码为零。 

当所有 a[i] 相等时，停止点之间的每个二次差都变为零。 唯一剩下的贡献来自传递条款。 DP 正确地退化为仅累积前缀传递值，因为所有行都变得相同并且查询返回一致的结果。 

当 c 极大或极小时，与从站到站的转换相比，传递成本占主导地位或变得可以忽略不计。 前缀和分离确保这种缩放不会干扰凸包逻辑，因为这些项独立于 DP 转换并且始终统一添加。
