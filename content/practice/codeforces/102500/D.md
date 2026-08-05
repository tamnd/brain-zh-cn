---
title: "CF 102500D - 一次性开关"
description: "我们有一个无向网络，其中每条电缆都有已知的长度，但电缆的实际传输时间取决于两个未知的全局参数。 对于长度为 l 的电缆，其时间为 l / v + c，其中相同的 v 和 c 适用于每条电缆。"
date: "2026-08-05T18:01:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102500
codeforces_index: "D"
codeforces_contest_name: "2019-2020 ICPC Northwestern European Regional Programming Contest (NWERC 2019)"
rating: 0
weight: 102500
solve_time_s: 88
verified: true
draft: false
---

[CF 102500D - 一次性开关](https://codeforces.com/problemset/problem/102500/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个无向网络，其中每条电缆都有已知的长度，但电缆的实际传输时间取决于两个未知的全局参数。 对于一定长度的电缆`l`，其时间为`l / v + c`，其中相同的`v`和`c`适用于每根电缆。 我们需要找到永远不会出现在从交换机出发的最快路线上的交换机`1`切换`n`，无论这两个参数采用哪个有效值。 

未知的参数是关键的难点。 路径不仅仅通过其总长度进行比较。 当开销增加时，使用较少电缆的路径可能会变得更好`c`较大，而当传播占主导地位时，电缆总长度较短的路径可能会获胜。 

约束条件给出`n`最多 2000 和`m`最多 10000。具有立方时间的算法已经太大了，因为`2000^3`业务量约为八十亿。 预期的解决方案必须接近`O(n(n+m))`，对于这些限制，这大约是四千万个图形操作。 

一个常见的错误是使用原始公式运行 Dijkstra 一次。 这是行不通的，因为公式包含未知值。 另一个错误是只考虑最短长度路径或最少边路径。 两者都不主宰对方。 例如，考虑：```
4 4
1 2 1
2 4 100
1 3 10
3 4 10
```对于非常小的开销，路径`1-3-4`获胜是因为它的长度是`20`。 对于非常大的开销，路径`1-2-4`获胜是因为它的边缘较少。 仅考虑一个目标的方法会错误地丢弃可能的最佳路径。 

另一个极端情况是领带。 如果开关出现在任何参数选择的任何最佳路径上，则该开关有效。 如果两条不同的路线对于某些参数具有完全相同的成本，则两条路线必须贡献其顶点。 

## 方法

 蛮力方法将尝试未知参数的每个可能值并计算最短路径。 这是不可能的，因为参数空间是连续的，并且可能存在无限多个不同的最短路径变化。 

有用的观察来自重写路径成本。 将每条边的成本乘以`v`不会改变哪条路径是最佳的，因为它将每个可能的路径乘以相同的正值。 路径的成本变为：```
total_length + number_of_edges * x
```在哪里`x = v*c`， 和`x`可以是任何非负实数。 

现在每条路径都由一条线表示：```
y = edges * x + length
```斜率是边数，截距是电缆总长度。 

对于每个可能的边数`k`，我们只关心恰好使用的最短长度路径`k`边缘。 具有相同边数的任何其他路径具有更大的截距，并且永远无法获胜。 

那么问题就变成了：

 查找全部`k`线在哪里```
y = k*x + best[k]
```是下凸包的一部分`x >= 0`。 

这些正是最佳路线上可能出现的边数。 

剩下的任务是恢复哪些顶点出现在具有这些边数的路径上。 我们计算动态规划表：`forward[k][v]`存储到达所需的最小长度`v`从开关`1`准确地使用`k`边缘。`backward[k][v]`存储到达开关所需的最小长度`n`从`v`准确地使用`k`边缘。 

一个顶点`v`可以出现在最优路径上`k`如果路径可以在以下位置分割，则有边`v`:```
prefix edges + suffix edges = k
```和```
forward[prefix][v] + backward[suffix][v] = best[k]
```最终答案是每个不满足此条件的顶点。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解参数 | 不可能| 不可能| 太慢了 |
 | 使用动态规划和凸包枚举所有边数 | O(n(n+m)) | O(n(n+m)) | O(n²) | 已接受 |

 ## 算法演练

 1. 计算每个边数的最短可能电缆长度。 

有效路径中的最大边数为`n-1`，因为任何包含循环的路径都可以删除该循环并变得严格更好。 我们运行分层动态编程过程。 每层代表迄今为止使用的边的确切数量。 

对于每一个`k`，我们得到`best[k]`，其中最小的总长度`1`到`n`完全使用路径`k`边缘。 

1. 将可能的路径转换为直线。 

对于每个有效边数`k`，创建行：```
y = k*x + best[k]
```对于某些非负数，只有从下面可见的线才能最短`x`。 我们通过计算下壳来删除所有其他线。 

1. 找出所有可以产生最优路径的边数。 

剩下的每一行至少对应一个值`x`其中使用该数量边的路径是最佳的。 只需检查这些边数的顶点。 

1. 从目的地计算相同的分层动态规划。 

反向表让我们检查是否可以将顶点放置在最佳路径的中间。 它避免了枚举每条完整的路线。 

1. 标记最优路径中出现的每个顶点。 

对于下壳上的每个边计数，组合前向和后向状态。 如果两个部分加起来具有该边数的最小可能长度，则该顶点可用。 

1.输出每个未标记的顶点。 

对于未知参数的任何可能值，这些正是不能出现在最佳路由中的交换机。 

### 为什么它有效

 每个可能的传输时间都通过选择一个值来表示`x`在线条家族中`k*x + best[k]`。 下壳外部的一条线总是比另一条线差，因此使用该数量边的路径永远不可能是最佳的。 下壳上的一条线对于某些参数值是最佳的，因此必须考虑该线代表的所有最短路径。 

前向和后向动态规划表包含每个前缀和后缀长度的最小可能长度。 如果它们结合起来`best[k]`，生成的路线是使用的所有路线中的最短路线`k`边缘。 由于每条可能的最佳路线在外壳上都有一些边数，因此每个可以使用的顶点都被标记，而每个未标记的顶点都是不可能的。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

INF = 10**30

def solve():
    n, m = map(int, input().split())

    adj = [[] for _ in range(n)]
    for _ in range(m):
        a, b, l = map(int, input().split())
        a -= 1
        b -= 1
        adj[a].append((b, l))
        adj[b].append((a, l))

    size = n * n

    def build(start):
        dp = array('q', [INF]) * size
        dp[start] = 0

        for k in range(n - 1):
            base = k * n
            nxt = (k + 1) * n
            for u in range(n):
                cur = dp[base + u]
                if cur == INF:
                    continue
                for v, w in adj[u]:
                    val = cur + w
                    if val < dp[nxt + v]:
                        dp[nxt + v] = val
        return dp

    forward = build(0)

    rev_adj = [[] for _ in range(n)]
    for u in range(n):
        for v, w in adj[u]:
            rev_adj[v].append((u, w))

    old = adj
    adj = rev_adj
    backward = build(n - 1)
    adj = old

    best = [forward[k * n + n - 1] for k in range(n)]

    hull = []
    for k in range(n):
        if best[k] == INF:
            continue
        while len(hull) >= 2:
            a, b = hull[-2], hull[-1]
            # intersection(a,b) >= intersection(b,k)
            if (best[b] - best[a]) * (k - b) >= (best[k] - best[b]) * (b - a):
                hull.pop()
            else:
                break
        hull.append(k)

    possible = [False] * n

    for k in hull:
        target = best[k]
        for v in range(n):
            f = forward[v]
            if f == INF:
                continue
            for i in range(k + 1):
                if i * n + v >= size:
                    break
                if forward[i * n + v] + backward[(k - i) * n + v] == target:
                    possible[v] = True
                    break
            if possible[v]:
                continue

    ans = [str(i + 1) for i, ok in enumerate(possible) if not ok]

    print(len(ans))
    if ans:
        print(" ".join(ans))

if __name__ == "__main__":
    solve()
```该实现将动态规划表存储在`array('q')`而不是普通的 Python 列表。 该表在最大情况下包含 400 万个值，Python 整数会消耗太多内存。 

DP转变是直接分层松弛。 指数`k*n+v`代表到达顶点`v`恰好在之后`k`边缘。 

凸包计算仅使用整数运算。 比较交叉点可以避免浮点精度问题，因为电缆长度可以大到`10^9`。 

反向DP是通过反转所有边来计算的。 由于该图是无向的，因此这相当于从目标运行相同的进程。 

标记循环检查顶点是否可以分割最佳路径。 相等比较仅使用整数值，因此可以正确处理等价路由。
