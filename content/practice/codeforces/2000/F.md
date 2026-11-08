---
title: "CF 2000F - 彩色行和列"
description: "每个矩形都是由 $ai$ 列和 $bi$ 行组成的网格。 我们可以将单个细胞一一着色。 每当一行完全着色时，我们就获得一分。 每当一根柱子完全着色时，我们也获得一分。 矩形是独立的。"
date: "2026-06-08T14:15:32+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 2000
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 966 (Div. 3)"
rating: 1900
weight: 2000
solve_time_s: 244
verified: true
draft: false
---

[CF 2000F - 行和列的颜色](https://codeforces.com/problemset/problem/2000/F)

 **评级：** 1900
 **标签：** dp、贪婪、实现、数学
 **求解时间：** 4m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个矩形都是一个网格$a_i$列和$b_i$行。 我们可以将单个细胞一一着色。 每当一行完全着色时，我们就获得一分。 每当一根柱子完全着色时，我们也获得一分。 

矩形是独立的。 在一个矩形中着色的单元格不会影响任何其他矩形。 我们的目标是至少赚取$k$所有矩形上的总点数，同时最小化彩色单元格的总数。 

关键的困难在于，对单元格进行着色可以有助于完成行和列的完成。 例如，如果我们为整个列着色，我们立即获得一分。 稍后，在足够多的列完全着色后，某些行可能会自动完成并产生额外的分数。 

约束揭示了预期的方向。 我们最多有$1000$所有测试用例上的矩形，但是$k \le 100$。 的小值$k$这是最重要的事实。 任何其复杂性取决于多项式的解决方案$k$可能是可以接受的，而任何事情都取决于矩形面积$a_i b_i$是不可能的，因为尺寸可以大到$100$。 

一个常见的错误是将矩形内的每个点视为具有相同的成本。 

考虑一个$6 \times 3$长方形。```
1 4
6 3
```获得四个点的最佳方法是给四个完整的列着色。 每列成本$3$细胞，所以答案是$12$。 一个天真的“点成本分钟（a，b）”想法会错误地预测$4 \cdot 3 = 12$even when the fourth point is obtained differently in other rectangles.

 Another subtle case occurs when rows and columns interact.

 对于一个$2 \times 2$长方形：```
1 3
2 2
```要获得三分，请为两列着色。 这需要花费$4$细胞。 完成的两列给出两分，两行自动完成，再给出两分。 用成本可以达到三点$4$， 不是$6$。 

最后的边缘情况是不可能的。```
2 100
1 2
5 6
```第一个矩形最多可以贡献$1+2=3$点，最多第二个$5+6=11$，总共$14$。 达到$100$点是不可能的，所以答案是$-1$。 

## 方法

 暴力的观点是准确地决定每个矩形中的哪些单元格要着色。 那立刻就没有希望了。 单个$100 \times 100$矩形已经包含$10^4$细胞，因此可能的子集数量是天文数字。 

第一个观察结果是，只有完成的行和完成的列才重要。 永远不会完成一行或一列的部分进度是没有用的。 

假设我们关注一个大小为$a \times b$。 想象一下我们想要的$p$来自这个矩形的点。 所需的彩色细胞的最小数量是多少？ 

如果我们将一列完全着色，则成本为$b$单元格，我们获得一列点。 如果我们将一行完全着色，则成本为$a$单元格，我们获得一个行点。 

关键的见解是，单个矩形的最佳策略总是通过完成整行或整列来贪婪地进行。 让$$x = \text{number of completed columns}, \qquad y = \text{number of completed rows}.$$那么我们就获得了$x+y$点。 

费用是多少？ 

属于已完成列的所有单元格都必须着色，有助于$xb$细胞。 之后，每个完成的行已经包含$x$有色细胞，所以只有$a-x$每个完成的行都需要额外的单元格。 

因此$$\text{cost}(x,y) = xb + y(a-x).$$对称地，我们可以先从行开始。 通过重复采用剩余两个方向中更便宜的一个来获得最优序列。 自从$a,b \le 100$，我们可以明确计算每个可达到的点数的最小成本$p$。 

一旦每个矩形都提供了一个表格$$best_i[p] = \text{minimum cost to obtain } p \text{ points},$$全球问题变成了一个背包。 

对于每个矩形，选择从中获取多少个点。 总分必须至少达到$k$，并且成本之和应该是最小的。 

自从$k \le 100$，标准 DP 点很容易足够快。 

| 方法| 时间复杂度| 空间复杂度| 判决|
 | --- | --- | --- | --- |
 | 蛮力 | 矩形面积的指数| 指数| 太慢了|
 | 最佳|$O(nk^2)$预处理后 |$O(k)$| 已接受 |

 ## 算法演练

 ### 计算一个矩形的成本表

 对于一个矩形$a \times b$， 让$m=a+b$，最大可能的点。 

我们构建一个数组`cost[p]`在哪里`cost[p]`是准确获得所需的有色细胞的最小数量`p`点。 

编辑解决方案使用简单的贪婪模拟。 

认为$a \le b$。 完成专栏成本$b$单元格和完成行成本$a$细胞。 最初，行的成本较低，因此我们重复完成行，直到它们耗尽。 完成一行后，未来的列完成会变得更便宜，因为每列的一部分已经着色。 

当以下情况时，相同的推理对称地起作用：$b < a$。 

通过模拟最便宜的可用完成序列，我们获得每个点计数的最小累积成本$1$到$a+b$。 

### 全球背包

 让`dp[j]`是准确获得所需的最少总操作数`j`处理一些矩形后的点。 

最初：```
dp[0] = 0
dp[j] = INF for j > 0
```对于每个矩形，我们都有其本地表`cost`。 

We create a new DP array. 对于每个当前分数`j`以及每一项可以实现的贡献`p`从这个矩形中，我们更新$$ndp[\min(k, j+p)] = \min( ndp[\min(k,j+p)], dp[j] + cost[p] ).$$分数以上$k$上限为$k$，因为只有“至少$k$” 的事情。

 处理完所有矩形后，`dp[k]`包含答案。 

### 为什么它有效

 对于固定的矩形，每个完成的行或列只贡献一分。 贪婪构造生成每个连续点所需的最小额外单元数。 获得相同数量点的任何替代方法都必须完成相同数量的行和列，并且不能使用更少的新着色单元格。 

全局DP依赖于最优子结构。 一旦我们知道每个矩形中每个可达到的点数的最小成本，矩形就成为独立的选择。 背包DP枚举了矩形中点的所有分布，并为每个总分保留最便宜的成本。 由于每种可能的分配都会被考虑一次，因此最终值是最优的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10 ** 18

def rectangle_costs(a, b):
    m = a + b
    res = [INF] * (m + 1)
    res[0] = 0

    for cols in range(a + 1):
        cost = cols * b
        points = cols

        res[points] = min(res[points], cost)

        cur_cost = cost
        for rows in range(1, b + 1):
            cur_cost += a - cols
            res[points + rows] = min(
                res[points + rows],
                cur_cost
            )

    return res

def solve():
    t = int(input())

    answers = []

    for _ in range(t):
        n, k = map(int, input().split())

        dp = [INF] * (k + 1)
        dp[0] = 0

        total_possible = 0

        rects = []
        for _ in range(n):
            a, b = map(int, input().split())
            rects.append((a, b))
            total_possible += a + b

        if total_possible < k:
            answers.append("-1")
            continue

        for a, b in rects:
            local = rectangle_costs(a, b)

            ndp = dp[:]

            for cur in range(k + 1):
                if dp[cur] == INF:
                    continue

                for gain in range(1, len(local)):
                    if local[gain] == INF:
                        continue

                    nxt = min(k, cur + gain)

                    ndp[nxt] = min(
                        ndp[nxt],
                        dp[cur] + local[gain]
                    )

            dp = ndp

        answers.append(str(dp[k]))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    solve()
```帮手`rectangle_costs`计算一个矩形内每个可达到的分数的最小成本。 我们枚举完成了多少列。 一旦这些列被固定，每个完成的行只需要`a - cols`额外的单元格，因为交叉单元格已经着色。 

该公式是关键的实施细节。 使用`rows * a`将对位于已完成的列内的单元格进行双重计数。 

DP是一个标准的多选背包。 每个矩形在几种可能的得分增益中提供一种选择。 分数上限为`k`所以 DP 数组永远不会超过大小`101`。 

不可能检查`total_possible < k`不需要正确性，但它避免了不必要的计算。 

## 工作示例

 ### 示例 1

 输入：```
1
1 4
6 3
```对于单个矩形：

 | 已完成专栏 | 已完成行| 积分 | 成本|
 | --- | --- | --- | --- |
 | 1 | 0 | 1 | 3 |
 | 2 | 0 | 2 | 6 |
 | 3 | 0 | 3 | 9 |
 | 4 | 0 | 4 | 12 | 12

 本地表给出：

 | 积分 | 最低成本|
 | --- | --- |
 | 0 | 0 |
 | 1 | 3 |
 | 2 | 6 |
 | 3 | 9 |
 | 4 | 12 | 12

 DP 从这个矩形中选择 4 个点并输出 12。 

此示例表明，重复完成列是最佳的，因为每列仅花费三个单元格。 

### 示例 2

 输入：```
1
3 11
2 2
3 3
4 4
```当地最高分数：

 | 矩形| 最大积分 |
 | --- | --- |
 | 2×2 | 4 |
 | 3×3 | 3×3 6 |
 | 4×4 | 8 |

 DP逐渐将这些可能性结合起来。 

| 后处理| 可达到的分数|
 | --- | --- |
 | 第一个矩形| 0..4 | 0..4
 | 第二个矩形 | 0..10 | 0..10
 | 第三个矩形| 0..18 | 0..18

 由于分数可以达到 11，DP 记录总分数至少为 11 的所有分配中的最小成本。 

该迹线证明了矩形的独立性。 DP 从不关心具体的行或列被着色，只关心每个分数的最佳成本。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(nk^2)$| 每个矩形更新一个尺寸的DP$k$，尝试达到$k$可能的收益|
 | 空间|$O(k)$| 仅存储当前的 DP 数组 |

 和$k \le 100$和总计$n \le 1000$，状态转换的数量仅约为$10^7$在最坏的情况下，它完全符合极限。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    from math import inf

    data = io.StringIO(inp)
    input = data.readline

    INF = 10 ** 18

    def rectangle_costs(a, b):
        m = a + b
        res = [INF] * (m + 1)
        res[0] = 0

        for cols in range(a + 1):
            cost = cols * b
            res[cols] = min(res[cols], cost)

            cur = cost
            for rows in range(1, b + 1):
                cur += a - cols
                res[cols + rows] = min(
                    res[cols + rows],
                    cur
                )
        return res

    t = int(input())
    out = []

    for _ in range(t):
        n, k = map(int, input().split())

        rects = []
        total = 0

        for _ in range(n):
            a, b = map(int, input().split())
            rects.append((a, b))
            total += a + b

        if total < k:
            out.append("-1")
            continue

        dp = [INF] * (k + 1)
        dp[0] = 0

        for a, b in rects:
            local = rectangle_costs(a, b)
            ndp = dp[:]

            for i in range(k + 1):
                if dp[i] == INF:
                    continue

                for gain in range(1, len(local)):
                    j = min(k, i + gain)
                    ndp[j] = min(
                        ndp[j],
                        dp[i] + local[gain]
                    )

            dp = ndp

        out.append(str(dp[k]))

    return "\n".join(out)

# sample 1
assert run(
"""1
1 4
6 3
"""
) == "12"

# minimum size
assert run(
"""1
1 1
1 1
"""
) == "1"

# impossible
assert run(
"""1
1 3
1 1
"""
) == "-1"

# exact maximum score
assert run(
"""1
1 4
2 2
"""
) == "4"

# two rectangles
assert run(
"""1
2 2
1 1
1 1
"""
) == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1×1 矩形，k=1 | 1 | 最小的非平凡案例 |
 | 1×1 矩形，k=3 | -1 | 不可能的目标|
 | 2×2 矩形，k=4 | 4 | 完全完成一个矩形|
 | 两个 1×1 矩形，k=2 | 2 | 结合多个矩形的贡献 |

 ## 边缘情况

 ### 目标分数超过所有可用分数

 输入：```
1
1 3
1 1
```该矩形包含一行和一列，因此最多可以获得两分。 该算法计算`total_possible = 2`，小于`k = 3`，并立即返回`-1`。 

### 通过重叠获得的点

 输入：```
1
1 3
2 2
```对两列进行着色需要四个单元格。 

| 专栏 | 行| 积分 | 成本|
 | --- | --- | --- | --- |
 | 2 | 0 | 2 | 4 |
 | 2 | 1 | 3 | 4 |
 | 2 | 2 | 4 | 4 |

 该实现通过仅添加来正确地考虑交叉点`a - cols`每完成行新单元格。 一旦所有列都被着色，每一行就已经完成，因此额外的分数可以以零额外成本出现。 

### 大矩形与小目标

 输入：```
1
1 2
100 100
```一个粗心的解决方案可能会尝试推理所有$10^4$细胞。 该算法仅计算点数最多的成本$a+b=200$，那么全局 DP 仅使用分数高达$k=2$。 The answer is obtained efficiently without ever touching individual cells.
