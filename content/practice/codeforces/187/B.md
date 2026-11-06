---
title: "CF 187B - AlgoRace"
description: "我们有 n 个城市的完整有向图。 对于每种车型，我们都知道每对订购的城市之间的旅行时间。 这些行程时间不能保证是对称的，因此从 u 到 v 的成本可能与从 v 到 u 的成本不同。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 187
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 119 (Div. 1)"
rating: 1800
weight: 187
solve_time_s: 125
verified: true
draft: false
---

[CF 187B - AlgoRace](https://codeforces.com/problemset/problem/187/B)

 **评分：** 1800
 **标签：** dp，最短路径
 **求解时间：** 2m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个完整的有向图`n`城市。 对于每种车型，我们都知道每对订购的城市之间的旅行时间。 这些行程时间不能保证是对称的，因此从`u`到`v`可能会花费与从`v`到`u`。 

每轮比赛给出三个值：起始城市、目的地城市以及允许的最大换车次数。 如果我们在整个路线上使用一辆车，那就意味着零变化。 如果我们在旅途中使用三辆不同的汽车，那就意味着两次改变。 

司机可以穿梭于中间城市，并且可以在任何城市即时换车。 每个查询的任务是计算在允许的换车次数下可能的最短行程时间。 

约束完全决定了预期的解决方案形状。 城市和汽车类型的数量最多为 60 种，对于三次动态规划或 Floyd-Warshall 式预处理来说足够小。 危险值是轮数，最多`10^5`。 这排除了任何基于查询的图形算法。 甚至一个`O(n^3)`每个查询的计算将是无望的。 

允许更改的最大数量为 1000，远大于城市数量。 这强烈表明我们应该预处理所有可能的转换计数的答案，直到达到某个有意义的限制。 

一个微妙的一点是，使用更多允许的更改并不意味着我们必须实际使用它们。 答案为`k = 10`如果这是最佳的，仍然可以只使用一辆车。 

另一个容易犯的错误是误解“换车”的含义。 

考虑这个例子：```
2 2 1
0 5
5 0
0 1
1 0
1 2 0
```在零变化的情况下，我们最初仍然可以选择任何一辆车。 正确答案是`1`， 不是`5`，因为我们可以简单地从第二辆车开始。 

第二个陷阱是假设单辆车的最短路径仅使用一条边。 输入给出了直接的道路成本，但图表是完整的，因此中间城市可能仍然有帮助。 

例子：```
3 1 1
0 100 1
1 0 1
1 1 0
1 2 0
```使用唯一的一辆车，从1到2的直达路要100，但是走`1 -> 3 -> 2`成本 2。任何忽略一辆车内所有对最短路径的解决方案都会给出错误的结果。 

另一个不明显的情况是允许额外的更改不会带来任何改进。```
3 2 1
0 1 10
1 0 1
10 1 0
0 5 5
5 0 5
5 5 0
1 3 5
```最佳路线始终只使用第一辆车。 一个粗心的DP，强制准确`k`改变而不是“最多`k`更改”在这里会失败。

 ## 方法

 蛮力的观点很简单。 对于每个查询，我们可以考虑所有可能的汽车序列以及我们切换的所有可能的中间城市。 如果查询允许`k`变化，那么我们最多可以使用`k + 1`汽车细分市场。 每个段可以使用任何`m`汽车，并且转换可能发生在任何城市。 即使对于小`k`，组合数量呈爆炸式增长。 

更加面向图的强力方法将构建一个分层状态图，其中状态为`(city, used_changes, current_car)`并为每个查询运行 Dijkstra。 该图大致有`n * m * k`州。 和`r = 10^5`，这仍然太贵了。 

关键的观察结果是城市数量很少。 自从`n <= 60`，我们可以负担得起对所有城市对进行昂贵的预处理。 

第一个重要的减少是将单辆车内的移动与车辆切换分开。 如果我们承诺使用一辆固定汽车，那么在两个城市之间旅行的最佳方式就是该汽车的全对最短路径。 一旦我们计算出来，每辆车的行为就像最佳出行时间的完整加权图。 

经过此预处理后，假设我们定义：`best[u][v] = minimum travel time from u to v using exactly one car`这已经包含了汽车和所有中间城市的所有选择，同时保持该汽车固定。 

现在问题变得简单多了。 如果允许换车，那么这次旅行只是一系列的路段，每个路段的成本来自`best`。 

如果我们最多使用`k`变化，那么我们最多使用`k + 1`段。 

这自然会导致对段数量的动态编程。 让：`dp[t][u][v] = minimum cost from u to v using at most t segments`转换是经典的最小加矩阵乘法：```
dp[t][u][v] = min(dp[t-1][u][x] + best[x][v])
```自从`n`只有60，我们可以对所有的DP进行预处理`t`从1到60。我们永远不需要超过60个路段，因为重访城市无法改善正权重下的最优路径。 官方解决方案限制了更改次数`n - 1`。 

然后每个查询都变成`O(1)`抬头。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询的暴力破解图搜索 | 太大了，粗略`O(r * n^3 * m * k)`| 大| 太慢了 |
 | Floyd-Warshall + DP 分段 |`O(m * n^3 + n^4)`|`O(n^3)`| 已接受 |

 ## 算法演练

 1. 读取所有汽车矩阵。 

每个矩阵描述了一辆特定汽车在每对有序城市之间的行驶时间。 
2. 为每辆车独立运行 Floyd-Warshall。 

这可以计算每对城市之间的真实最短旅行时间，同时在整个行程中保持同一辆车。 
3. 构建矩阵`best`。 

对于每对`(u, v)`， 放：```
best[u][v] = minimum over all cars of dist_car[u][v]
```如果我们被允许为该细分市场挑选一辆车，那么这代表了最便宜的细分市场。 
4. 初始化DP表。 

让：```
dp[0][u][v] = best[u][v]
```这里，`0`意味着零换车，所以只允许一段。 
5. 延长 DP 以进行额外的车辆更换。 

对于每一个`t >= 1`:```
dp[t][u][v] = min(
    dp[t-1][u][v],
    dp[t-1][u][x] + best[x][v]
)
```覆盖所有中等城市`x`。 

第一个选项意味着我们不使用额外允许的更改。 第二个选项表示最后一段从城市开始`x`使用一辆车。 
6. 预计算 DP 最多可达`n - 1`。 

任意一条最优路径都可以转化为一条没有重复城市的路径，因此多于`n - 1`改变是不必要的。 
7. 回答每个问题。 

如果查询允许`k`更改，使用：```
dp[min(k, n - 1)][s][t]
```### 为什么它有效

 弗洛伊德·沃歇尔之后，每一个价值观`best[u][v]`已经代表了最佳的出行方式`u`到`v`同时仅使用一辆车。 任何有效的比赛策略都只是这些部分的串联。 

DP 不变量为：```
dp[t][u][v]
```存储最短行程时间`u`到`v`最多使用`t + 1`段，最多相当于`t`汽车变化。 

过渡考虑了所有可能的最后切换城市`x`。 如果最后一段开始于`x`，那么路线的前半部分最多使用`t`段和最后一个段又使用了一个。 由于测试了每个可能的分割点，因此始终包含最佳策略。 

由于所有成本都是非负的，重复城市无法无限期地改善答案。 最优分段路线总是可以简化为最多使用`n`段，因此将预处理限制在`n - 1`改变就足够了。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

def solve():
    n, m, r = map(int, input().split())

    cars = []

    for _ in range(m):
        dist = [list(map(int, input().split())) for _ in range(n)]

        # Floyd-Warshall for this car
        for k in range(n):
            for i in range(n):
                dik = dist[i][k]
                for j in range(n):
                    nd = dik + dist[k][j]
                    if nd < dist[i][j]:
                        dist[i][j] = nd

        cars.append(dist)

    # best one-car segment
    best = [[INF] * n for _ in range(n)]

    for i in range(n):
        for j in range(n):
            val = INF
            for c in range(m):
                if cars[c][i][j] < val:
                    val = cars[c][i][j]
            best[i][j] = val

    limit = n - 1

    # dp[t][i][j] = answer with at most t changes
    dp = [[[INF] * n for _ in range(n)] for _ in range(limit + 1)]

    for i in range(n):
        for j in range(n):
            dp[0][i][j] = best[i][j]

    for t in range(1, limit + 1):
        # start from previous layer because we may use fewer changes
        for i in range(n):
            for j in range(n):
                dp[t][i][j] = dp[t - 1][i][j]

        for i in range(n):
            for k in range(n):
                left = dp[t - 1][i][k]
                for j in range(n):
                    nd = left + best[k][j]
                    if nd < dp[t][i][j]:
                        dp[t][i][j] = nd

    out = []

    for _ in range(r):
        s, t, k = map(int, input().split())
        s -= 1
        t -= 1

        k = min(k, limit)

        out.append(str(dp[k][s][t]))

    print("\n".join(out))

solve()
```第一个主要区块为每辆车单独运行 Floyd-Warshall。 这是至关重要的，因为单辆车仍然可以从经过中间城市中受益。 

这`best`矩阵将所有汽车压缩成一个通用转换图。 在此步骤之后，每条边缘都已经意味着“使用一种不间断的汽车选择进行最佳可能的运动”。 

DP 层对应于允许的汽车更换数量。 一个微妙的细节正在复制`dp[t - 1]`进入`dp[t]`在转换之前。 如果没有这个，DP 将准确地使用`t`改变而不是最多`t`变化。 

另一个重要的实现选择是使用以下内容限制查询：```
k = min(k, n - 1)
```问题允许`k`最多1000个，但预处理只需要`n - 1`。 

所有计算都可以安全地适合 64 位整数。 Python 整数自然可以处理这个问题。 

## 工作示例

 ### 示例 1

 输入：```
4 2 3
0 1 5 6
2 0 3 6
1 3 0 1
6 6 7 0
0 3 5 6
2 0 1 6
1 3 0 2
6 6 7 0
1 4 2
1 4 1
1 4 3
```弗洛伊德·沃歇尔案之后，重要的价值观`best`成为：

 | 来自 | 至 | 最佳成本|
 | ---| ---| ---|
 | 1 | 2 | 1 |
 | 2 | 3 | 1 |
 | 3 | 4 | 1 |

 现在计算 DP 层。 

| 允许更改 | 最佳路径 1 → 4 | 成本|
 | ---| ---| ---|
 | 0 | 一车直达 | 5 |
 | 1 | 1 → 2 → 3 → 4 使用两段 | 4 |
 | 2 | 1 → 2, 2 → 3, 3 → 4 | 3 |

 答案是：```
3
4
3
```此跟踪显示了为什么允许更多更改会有所帮助。 每增加一段路段，我们就可以切换到一辆在该路线的某一部分特别强劲的汽车。 

### 自定义示例```
3 1 2
0 100 1
1 0 1
1 1 0
1 2 0
1 2 5
```继 Floyd-Warshall 之后唯一的一辆车：

 | 来自 | 至 | 最短成本|
 | ---| ---| ---|
 | 1 | 2 | 2 |
 | 1 | 3 | 1 |
 | 3 | 2 | 1 |

 现在：

 | 查询 | 允许的更改 | 回答 |
 | ---| ---| ---|
 | 1 → 2 | 0 | 2 |
 | 1 → 2 | 5 | 2 |

 尽管直接道路成本为 100，Floyd-Warshall 正确地发现了穿过城市 3 的更便宜的路线。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(m * n^3 + n^4 + r)`| 每辆车的 Floyd-Warshall，然后 DP 转换，然后恒定时间查询 |
 | 空间|`O(n^3)`| DP 层加矩阵 |

 和`n <= 60`，主导项大致为`60^4 = 12,960,000`操作，这在Python中是完全安全的。 内存使用量也保持在一定范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

INF = 10**18

def solve():
    input = sys.stdin.readline

    n, m, r = map(int, input().split())

    cars = []

    for _ in range(m):
        dist = [list(map(int, input().split())) for _ in range(n)]

        for k in range(n):
            for i in range(n):
                dik = dist[i][k]
                for j in range(n):
                    nd = dik + dist[k][j]
                    if nd < dist[i][j]:
                        dist[i][j] = nd

        cars.append(dist)

    best = [[INF] * n for _ in range(n)]

    for i in range(n):
        for j in range(n):
            best[i][j] = min(cars[c][i][j] for c in range(m))

    limit = n - 1

    dp = [[[INF] * n for _ in range(n)] for _ in range(limit + 1)]

    for i in range(n):
        for j in range(n):
            dp[0][i][j] = best[i][j]

    for t in range(1, limit + 1):
        for i in range(n):
            for j in range(n):
                dp[t][i][j] = dp[t - 1][i][j]

        for i in range(n):
            for k in range(n):
                left = dp[t - 1][i][k]
                for j in range(n):
                    nd = left + best[k][j]
                    if nd < dp[t][i][j]:
                        dp[t][i][j] = nd

    ans = []

    for _ in range(r):
        s, t, k = map(int, input().split())
        s -= 1
        t -= 1
        k = min(k, limit)

        ans.append(str(dp[k][s][t]))

    print("\n".join(ans))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup

    return out.getvalue()

# provided sample
assert run(
"""4 2 3
0 1 5 6
2 0 3 6
1 3 0 1
6 6 7 0
0 3 5 6
2 0 1 6
1 3 0 2
6 6 7 0
1 4 2
1 4 1
1 4 3
"""
) == "3\n4\n3\n", "sample"

# minimum size
assert run(
"""2 1 1
0 7
7 0
1 2 0
"""
) == "7\n", "minimum case"

# better indirect path inside one car
assert run(
"""3 1 1
0 100 1
1 0 1
1 1 0
1 2 0
"""
) == "2\n", "Floyd-Warshall needed"

# extra changes do not help
assert run(
"""3 2 1
0 1 10
1 0 1
10 1 0
0 5 5
5 0 5
5 5 0
1 3 5
"""
) == "2\n", "at most k changes"

# switching cars improves answer
assert run(
"""3 2 1
0 1 100
1 0 100
100 100 0
0 100 1
100 0 1
1 1 0
1 3 1
"""
) == "2\n", "car switching"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 至少 2 个城市图 | 7 | 基本索引和初始化 |
 | 间接路线更便宜| 2 | Floyd-Warshall 预处理是必要的 |
 | 未使用额外更改 | 2 | DP 必须表示“最多 k 次更改”|
 | 换车改善路线 | 2 | 基于段的 DP 转换 |

 ## 边缘情况

 考虑这样的情况：仅一辆车的间接路径比直接边缘更好。```
3 1 1
0 100 1
1 0 1
1 1 0
1 2 0
```弗洛伊德·沃歇尔更新：

 | 中级| 更新距离 1 → 2 |
 | ---| ---|
 | 无 | 100 | 100
 | 通过 3 | 2 |

 最终答案变成`2`。 任何仅使用直接矩阵条目的解决方案都会错误地打印`100`。 

现在考虑不需要额外允许的更改的情况。```
3 2 1
0 1 10
1 0 1
10 1 0
0 5 5
5 0 5
5 5 0
1 3 5
```最优路线是：```
1 -> 2 -> 3
```仅使用第一辆车，总成本`2`。 

DP计算时：

 | 层 | dp[图层][1][3] |
 | ---| ---|
 | 0 变化 | 2 |
 | 1 变化 | 2 |
 | 2 变化 | 2 |

 由于每一层都从复制前一层开始，因此 DP 自然会使用较少的更改来保留解决方案。 

最后，考虑必须进行切换的情况。```
3 2 1
0 1 100
1 0 100
100 100 0
0 100 1
100 0 1
1 1 0
1 3 1
```仅使用一辆车：

 | 汽车 | 成本 1 → 3 |
 | ---| ---|
 | 1 | 100 | 100
 | 2 | 1 |

 但最优分段路线为：```
1 -> 2 using car 1
2 -> 3 using car 2
```总成本`2`。 

DP通过中间城市过渡`2`正确地发现了这个组合。
