---
title: "CF 119C - 教育改革"
description: "我们有多达 50 个科目。 每个主题都有三个属性。 区间 $[ai, bi]$ 描述了该科目可以布置多少作业练习。 我们可以自由选择该区间内的任何值。 值 $ci$ 是主题复杂性。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 119
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 90"
rating: 2000
weight: 119
solve_time_s: 179
verified: false
draft: false
---

[CF 119C - 教育改革](https://codeforces.com/problemset/problem/119/C)

 **评级：** 2000
 **标签：** dp
 **求解时间：** 2m 59s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有多达 50 个科目。 每个主题都有三个属性。 

间隔$[a_i, b_i]$描述该科目可能布置多少作业练习。 我们可以自由选择该区间内的任何值。 

价值$c_i$是主题的复杂性。 时间表必须严格按照复杂性递增的顺序使用科目，因此如果我们选择科目$p_1, p_2, \dots, p_n$， 然后：$$c_{p_1} < c_{p_2} < \dots < c_{p_n}$$家庭作业计数还必须遵循特殊的转换规则。 如果当天有$x$练习，那么第二天必须包含：$$x + k$$或者$$x \cdot k$$在所有有效时间表中$n$科目，我们想要练习总数最多的科目。 

约束中最重要的是间隔的大小。 值本身可以大到$10^{16}$，所以暴力破解家庭作业是不可能的。 但区间宽度满足：$$b_i - a_i \le 100$$这改变了一切。 尽管数值很大，但每个科目最多只允许 101 个不同的作业计数。 这意味着真实的状态空间很小。 

第二个重要的限制是$m \le 50$。 一个复杂的解决方案$50^3 \cdot 100^2$是完全安全的。 

问题最难的部分是认识到我们不应该考虑任意整数。 我们只关心实际出现在某个主题区间内的值。 

一些边缘情况很容易被错误处理。 

认为$k = 1$。 那么两个允许的转换变为：$$x_i = x_{i-1} + 1$$或者$$x_i = x_{i-1}$$粗心的实现可能会假设乘法总是增加值并意外地创建循环或无效转换。 

例如：```
2 2 1
5 5 1
5 5 2
```正确答案是：```
YES
1 5
2 5
```因为乘以 1 会保持该值不变。 

另一个危险的情况是重复的复杂性。 具有相同复杂程度的科目不能同时出现在时间表中。 

例子：```
2 3 2
1 10 5
1 10 5
2 20 6
```我们可能只选择前两个科目中的一个。 

大值还会在具有固定宽度整数的语言中产生溢出陷阱。 

例子：```
2 2 100
10000000000000000 10000000000000000 1
10000000000000100 10000000000000100 2
```该转换有效，因为：$$10^{16} + 100 = 10000000000000100$$使用 32 位整数将完全打破这种情况。 

当贪婪地最大化总和时，会出现一个更微妙的问题。 选择本地最大的作业数量可能会阻碍未来的转换。 

例子：```
3 3 2
1 5 1
6 6 2
8 20 3
```如果我们在第一天贪婪地选择 5，那么下一个值必须是 7 或 10，这两个值都不适合主题 2。最佳有效序列是：```
4 -> 6 -> 8
```总共 18 个。 

## 方法

 暴力方法会尝试每个子集$n$科目、按复杂性排列的每个有效排序以及每个间隔内的每个作业都算在内。 

每个科目最多有 101 个可能的作业值。 即使我们修复了主题，也已经大致给出：$$101^n$$可能的序列。 和$n = 50$，这是一个天文数字。 

暴力破解在概念上是有效的，因为转换规则是局部的。 一旦我们知道了昨天的作业数量，我们就可以确定今天的可能性。 问题很简单，就是分支因子太大。 

关键的观察是每个可用的作业值必须属于某个区间$[a_i, b_i]$，每个区间最多包含 101 个数字。 由于最多有 50 个科目，因此整个输入中不同作业值的总数最多为：$$50 \cdot 101 = 5050$$这对于动态规划来说足够小了。 

我们可以将每个状态视为：$$(dp[i][v])$$含义：

 “我们以主题结束$i$使用作业计数$v$”。

 如果满足以下条件，我们可以从一种状态转换到另一种状态：

 1. 下一个主题具有更大的复杂性。 
2. 下一个作业数等于$v + k$或者$v \cdot k$。 
3. 下一个值位于下一个主题区间内。 

由于目标是最大化总和，因此 DP 存储可实现的最佳总和。 

问题变成了有向无环图上的最长路径式DP。 复杂性排序保证了非循环性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O\left(\binom{m}{n} \cdot 101^n\right)$| 指数| 太慢了 |
 | 最佳DP |$O(m^2 \cdot 101^2)$|$O(m \cdot 101)$| 已接受 |

 ## 算法演练

 1. 阅读所有主题并按复杂程度对它们进行排序。 

排序是必要的，因为有效的时间表必须使用严格递增的复杂性。 排序后，每个有效的转换都会在数组中向前推进。 
2. 对于每个科目，枚举其区间内所有可能的作业数。 

由于每个间隔宽度最多为 100，因此每个主题最多生成 101 个值。 
3. 定义DP状态。 

让：$$dp[i][t]$$表示以主题结尾的有效序列的最大总练习数$i$使用$t$其间隔中的第一个值。 
4. 初始化所有单主体序列。 

任何单个科目都可以开始时间表，因此：$$dp[i][t] = value$$最初。 
5. 尝试在每对主题之间进行转换。 

对于科目$j \to i$，只有在以下情况下才允许转换：$$c_j < c_i$$然后对于每个作业值$x$主题的$j$，计算仅有的两个可能的下一个值：$$x + k$$和$$x \cdot k$$如果任一值属于主题$i$的间隔，我们可以更新DP。 
6. 存储父指针。 

每当转换提高 DP 值时，记录之前的状态。 这允许稍后重建时间表。 
7. 单独跟踪序列长度。 

我们正好需要$n$科目，而不仅仅是最大金额。 因此每个 DP 状态还存储使用了多少个主题。 
8. 在所有使用准确的状态中$n$科目，选择总和最大的一项。 
9. 使用父指针重建答案。 
10. 如果没有状态达到长度$n$， 打印`"NO"`。 

### 为什么它有效

 DP 对每个有效的最终状态只处理一次。 

以主题结尾的有效时间表$i$和价值$v$必须恰好来自之前的一项作业计数：$$v - k$$或一些满足的值：$$v = previous \cdot k$$转换规则是局部的，因此扩展最优部分时间表始终可以保持最优性。 由于复杂度严格增加，转换形成 DAG，并且不会出现循环依赖关系。 

DP 不变量为：$$dp[i][t]$$存储以该确切状态结束的所有有效序列中的最大总练习量。 

每一条合法的时间表都对应着DP图中的一条路径，每条DP路径都对应着一条合法的时间表。 因为我们最大化所有长度的路径$n$，算法是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())

    subjects = []
    for idx in range(1, m + 1):
        a, b, c = map(int, input().split())
        vals = list(range(a, b + 1))
        subjects.append((c, idx, vals))

    subjects.sort()

    # dp[i][t] = best total sum
    # len_dp[i][t] = length of sequence
    dp = []
    len_dp = []
    parent = []

    for _, _, vals in subjects:
        sz = len(vals)
        dp.append(vals[:])
        len_dp.append([1] * sz)
        parent.append([None] * sz)

    for i in range(m):
        ci, _, vals_i = subjects[i]

        pos_i = {}
        for t, v in enumerate(vals_i):
            pos_i[v] = t

        for j in range(i):
            cj, _, vals_j = subjects[j]

            if cj >= ci:
                continue

            for pj, x in enumerate(vals_j):
                candidates = [x + k, x * k]

                for y in candidates:
                    if y not in pos_i:
                        continue

                    pi = pos_i[y]

                    new_len = len_dp[j][pj] + 1
                    new_sum = dp[j][pj] + y

                    if new_len > len_dp[i][pi]:
                        len_dp[i][pi] = new_len
                        dp[i][pi] = new_sum
                        parent[i][pi] = (j, pj)

                    elif new_len == len_dp[i][pi] and new_sum > dp[i][pi]:
                        dp[i][pi] = new_sum
                        parent[i][pi] = (j, pj)

    best = None
    best_sum = -1

    for i in range(m):
        vals = subjects[i][2]

        for t, v in enumerate(vals):
            if len_dp[i][t] == n and dp[i][t] > best_sum:
                best_sum = dp[i][t]
                best = (i, t)

    if best is None:
        print("NO")
        return

    ans = []

    cur = best
    while cur is not None:
        i, t = cur
        _, idx, vals = subjects[i]
        ans.append((idx, vals[t]))
        cur = parent[i][t]

    ans.reverse()

    print("YES")
    for x in ans:
        print(*x)

solve()
```第一个主要的实现选择是存储每个科目的明确作业值。 由于间隔宽度永远不会超过 100，因此可以保持紧凑并避免复杂的坐标压缩。 

DP 保留两条独立的信息。`len_dp[i][t]`存储在该状态结束的最佳序列中使用了多少主题。`dp[i][t]`存储相应的总和。 

比较的顺序很重要。 我们总是首先选择较大的序列长度，因为问题需要精确$n$科目。 在相同长度的序列中，我们最大化总练习量。 

一个微妙的实现细节是处理重复的转换结果。 什么时候$k = 1$，两个转变：```
x + k
x * k
```可能会变成连续的值，例如`x + 1`和`x`，甚至在特殊情况下重复值。 代码自然会处理这个问题，因为两者都是独立检查的。 

这`pos_i`字典给出$O(1)$查找下一个间隔内是否存在目标值。 如果没有它，每次转换都需要重复扫描最多 101 个值。 

父重建仅存储先前的 DP 状态。 由于转换形成按复杂性排序的 DAG，因此重建非常简单。 

## 工作示例

 ### 示例 1

 输入：```
4 5 2
1 10 1
1 10 2
1 10 3
1 20 4
1 100 5
```一种最佳路径是：```
8 -> 10 -> 20 -> 40
```| 步骤| 主题 | 作业 | 过渡 | 总计 |
 | ---| ---| ---| ---| ---|
 | 1 | 2 | 8 | 开始 | 8 |
 | 2 | 3 | 10 | 10$8 + 2$| 18 | 18
 | 3 | 4 | 20 |$10 \times 2$| 38 | 38
 | 4 | 5 | 40|$20 \times 2$| 78 | 78

 该跟踪显示了为什么动态规划是必要的。 序列可以在加法和乘法转换之间交替，因此贪婪的局部决策是不可靠的。 

### 示例 2

 输入：```
3 3 2
1 5 1
6 6 2
8 20 3
```| 步骤| 主题 | 作业 | 过渡 | 总计 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 4 | 开始 | 4 |
 | 2 | 2 | 6 |$4 + 2$| 10 | 10
 | 3 | 3 | 8 |$6 + 2$| 18 | 18

 如果我们从 5 开始，下一个值将需要是 7 或 10，这两个值都不适合主题 2。该示例表明，最大的局部选择可能会破坏未来的可行性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(m^2 \cdot 101)$| 检查每对科目，每个科目最多有 101 个值 |
 | 空间|$O(m \cdot 101)$| DP 表存储每个间隔值的状态 |

 和$m \le 50$，状态总数很少。 该解决方案很容易满足 1 秒的限制，并且使用很少的内存。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    import sys
    input = sys.stdin.readline

    out = io.StringIO()
    sys.stdout = out

    def solve():
        n, m, k = map(int, input().split())

        subjects = []
        for idx in range(1, m + 1):
            a, b, c = map(int, input().split())
            vals = list(range(a, b + 1))
            subjects.append((c, idx, vals))

        subjects.sort()

        dp = []
        len_dp = []
        parent = []

        for _, _, vals in subjects:
            sz = len(vals)
            dp.append(vals[:])
            len_dp.append([1] * sz)
            parent.append([None] * sz)

        for i in range(m):
            ci, _, vals_i = subjects[i]

            pos_i = {v: t for t, v in enumerate(vals_i)}

            for j in range(i):
                cj, _, vals_j = subjects[j]

                if cj >= ci:
                    continue

                for pj, x in enumerate(vals_j):
                    for y in (x + k, x * k):
                        if y not in pos_i:
                            continue

                        pi = pos_i[y]

                        new_len = len_dp[j][pj] + 1
                        new_sum = dp[j][pj] + y

                        if new_len > len_dp[i][pi]:
                            len_dp[i][pi] = new_len
                            dp[i][pi] = new_sum
                            parent[i][pi] = (j, pj)

                        elif new_len == len_dp[i][pi] and new_sum > dp[i][pi]:
                            dp[i][pi] = new_sum
                            parent[i][pi] = (j, pj)

        best = None
        best_sum = -1

        for i in range(m):
            vals = subjects[i][2]

            for t, v in enumerate(vals):
                if len_dp[i][t] == n and dp[i][t] > best_sum:
                    best_sum = dp[i][t]
                    best = (i, t)

        if best is None:
            print("NO")
            return

        ans = []

        cur = best
        while cur is not None:
            i, t = cur
            _, idx, vals = subjects[i]
            ans.append((idx, vals[t]))
            cur = parent[i][t]

        ans.reverse()

        print("YES")
        for x in ans:
            print(*x)

    solve()

    sys.stdout = sys.__stdout__
    return out.getvalue()

# provided sample
assert run(
"""4 5 2
1 10 1
1 10 2
1 10 3
1 20 4
1 100 5
"""
).startswith("YES")

# minimum case
assert run(
"""1 1 5
10 10 1
"""
) == "YES\n1 10\n"

# impossible case
assert run(
"""2 2 10
1 1 1
2 2 2
"""
) == "NO\n"

# k = 1
assert run(
"""2 2 1
5 5 1
5 5 2
"""
) == "YES\n1 5\n2 5\n"

# equal complexities
assert run(
"""2 3 2
1 1 5
3 3 5
5 5 6
"""
) == "NO\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单科| 是的，这个主题| 最小尺寸处理 |
 | 不可能的转变 | 否 | 适当的可行性检测|
 |$k = 1$| 允许相同的家庭作业值 | 正确的乘法处理 |
 | 同等复杂性 | 否 | 严格的复杂度排序 |

 ## 边缘情况

 考虑以下情况：```
2 2 1
5 5 1
5 5 2
```该算法将两个状态初始化为长度 1。从值 5 开始，转换为：$$5 + 1 = 6$$和$$5 \times 1 = 5$$第二个转换存在于下一个间隔中，因此 DP 将序列扩展为长度 2。输出变为：```
YES
1 5
2 5
```这证实了当以下情况时，实现可以正确处理非递增乘法：$k = 1$。 

现在考虑重复的复杂性：```
2 3 2
1 10 5
1 10 5
2 20 6
```在转换期间，算法显式检查：```
if cj >= ci:
    continue
```因此，前两个主题之间的转换是被禁止的，因为它们的复杂度都是 5。由于不存在长度为 2 的有效链，算法输出：```
NO
```最后，考虑一个贪婪陷阱：```
3 3 2
1 5 1
6 6 2
8 20 3
```DP 探索从 1 到 5 的所有起始作业值。 

从 5 开始立即失败，因为 7 和 10 都不属于第二个区间。 

从4开始成功：$$4 \to 6 \to 8$$DP 保留这条有效链并返回最优总数。 这说明了为什么探索整个紧凑状态空间是必要的。
