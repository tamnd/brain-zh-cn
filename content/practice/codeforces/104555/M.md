---
title: "CF 104555M - 最大限度提高飞行效率"
description: "我们得到一个完整的加权图，其中每个顶点代表一个城市，并且每对城市都有已知成本的直飞航班。 成本矩阵是对称的，因此在两个城市之间旅行的两个方向的成本相同。"
date: "2026-06-30T08:52:02+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104555
codeforces_index: "M"
codeforces_contest_name: "2023-2024 ICPC Brazil Subregional Programming Contest"
rating: 0
weight: 104555
solve_time_s: 62
verified: true
draft: false
---

[CF 104555M - 最大化飞行效率](https://codeforces.com/problemset/problem/104555/M)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个完整的加权图，其中每个顶点代表一个城市，并且每对城市都有已知成本的直飞航班。 成本矩阵是对称的，因此在两个城市之间旅行的两个方向的成本相同。 目标是确定这些直飞航班价格是否与最短路径推理内在一致，如果一致，则确定有多少直飞航班是不必要的，因为间接航线永远不会比它们更贵。 

当对于每对城市来说，直飞航班成本已经是它们之间最便宜的旅行方式时，表被认为是一致的。 用图术语来说，这意味着给定的邻接矩阵必须已经满足所有对最短路径属性。 

如果表不一致，则更便宜的间接路线的存在会使定价模型无效，我们必须输出 -1。 

如果一致，我们可以删除尽可能多的直接边，但只能删除那些冗余的边，因为存在一条成本恰好等于直接边的替代路线。 移除不得增加任何两个城市之间的任何最短路径成本。 

约束允许最多 100 个城市，因此我们要处理矩阵中最多 10,000 个条目。 N 中的三次算法是可以接受的。 任何比 O(N^3) 更糟糕的事情都是不必要的，而 O(N^4) 已经接近舒适度的上限。 

当直接边缘严格地比两跳路径差时，就会出现微妙的边缘情况。 例如，如果我们有：```
0 5 10
5 0 4
10 4 0
```这里，路径 1 → 2 → 3 的成本为 9，比直接 1 → 3 的成本 10 便宜。这意味着该表不连贯，必须返回 -1。 如果不系统地应用于所有三元组，则仅检查一个方向上的三角形不等式但错过中间比较的简单方法可能会失败。 

当存在多个等成本路径时，会出现另一种边缘情况。 例如：```
0 2 2
2 0 2
2 2 0
```所有直接边都已经是最佳的，但不能删除任何一条，因为删除任何一条都会增加最短路径成本。 即使替代路径不是严格较短但相等，但仍必须保持最短路径相等，天真的“如果存在路径则删除”方法会错误地删除边缘。 

## 方法

 暴力方法将通过重复松弛边缘或从每个节点运行 Dijkstra 来计算每对城市之间的最短路径，然后将计算出的最短路径距离与给定矩阵进行比较。 如果任何对存在不匹配，即给定边不等于计算的最短路径，则该表是不连贯的。 

这种方法是正确的，因为它直接检查矩阵是否已经编码了全对最短路径解。 然而，从每个节点运行 Dijkstra 的成本为 O(N^3 log N) 或优化后的 O(N^3)，而 Floyd-Warshall 的成本也为 O(N^3)，因此暴力破解已经是临界点，但仍然可以接受。 当我们尝试单独测试边缘去除时，真正的低效率就会出现，这会将复杂性乘以另一个 N^2 因子。 

关键的观察是我们不需要模拟移除。 一旦我们使用 Floyd-Warshall 计算所有对最短路径，我们就可以同时验证一致性和计算冗余。 如果存在某个中间节点 k，使得 i → k → j 实现与直接边完全相同的成本，则 i 和 j 之间的边是可移除的。 如果任何中间路径严格小于直接边缘，则该表无效。 

这将问题简化为一次 Floyd-Warshall 运行，然后对所有对和中间体进行三次扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（每对最短路径+检查）| O(N^3) 到 O(N^4) | O(N^2) | O(N^2) | 太慢了|
 | Floyd-Warshall 优化检查 | O(N^3) | O(N^3) | O(N^2) | O(N^2) | 已接受 |

 ## 算法演练

 ## 算法演练

 1. 读取矩阵并将其存储为dist。 这代表输入直接边和我们的工作最短路径表。 我们最初保持它不变，因为我们将使用中间顶点逐步细化它。 
2. 对所有三元组 (k, i, j) 运行 Floyd-Warshall，更新 dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])。 此步骤使用任何中间城市计算每对之间的真实最短路径。 这样做的原因是任何最短路径都可以分解为子路径，随着 k 的增加，子路径的中间顶点最终将被考虑。 
3. 计算最短路径后，通过检查每对 (i, j) 的原始直接成本是否等于计算的最短路径成本来验证一致性。 如果任何直接边大于最短路径，则表不一致，我们立即输出-1。 这确保没有间接航线比直飞航班更便宜。 
4. 如果一致性成立，我们就计算可移动边缘。 对于每一对 (i, j)，我们检查是否存在某个不同于 i 和 j 的中间节点 k，使得 dist[i][j] 等于 dist[i][k] + dist[k][j]。 如果存在这样的 k，则直接边缘是多余的，因为替代路径实现了相同的最优成本。 
5. 为了避免重复计算，我们只考虑对 i < j，因为图是无向的。 每个可移动边缘对答案的贡献恰好为 1。 
6. 输出可移除边的总数。 

### 为什么它有效

Floyd-Warshall 步骤确保 dist 包含所有可能路线下的真实最短路径距离。 如果任何直接边大于该值，则它不能成为任何最优结构的一部分，并且输入不一致。 如果等式成立，则直接边已经是最优的，但它可能是唯一的，也可能不是唯一的。 检查保持相等的中间 k 可以准确识别何时不唯一需要边缘。 因为任何具有相同成本的最短路径足以保留所有对的距离，所以删除这样的边不会改变任何最短路径值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    dist = [list(map(int, input().split())) for _ in range(n)]

    # Floyd–Warshall
    for k in range(n):
        for i in range(n):
            dik = dist[i][k]
            if dik == 10**18:
                continue
            for j in range(n):
                nd = dik + dist[k][j]
                if nd < dist[i][j]:
                    dist[i][j] = nd

    # Check coherence
    for i in range(n):
        for j in range(n):
            if dist[i][j] != dist[i][j]:
                pass
    # Actually we need original matrix, so recompute carefully
    # Store original
    # (Fix approach: re-read logic cleanly)

def solve():
    n = int(input())
    orig = [list(map(int, input().split())) for _ in range(n)]
    dist = [row[:] for row in orig]

    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    # coherence check
    for i in range(n):
        for j in range(n):
            if dist[i][j] != orig[i][j]:
                print(-1)
                return

    removable = 0

    for i in range(n):
        for j in range(i + 1, n):
            for k in range(n):
                if k != i and k != j:
                    if dist[i][j] == dist[i][k] + dist[k][j]:
                        removable += 1
                        break

    print(removable)

if __name__ == "__main__":
    solve()
```该解决方案首先复制输入矩阵，以便我们保留原始直飞成本，同时单独计算最短路径。 弗洛伊德·沃歇尔随后转变`dist`进入真正的全对最短路径矩阵。 

一致性检查将每一对与原始矩阵进行比较。 任何不匹配都意味着输入包含严格次优的直飞航班，因此该结构无效。 

最后的循环对通过某个中间节点具有替代等成本分解的边进行计数。 这`break`确保每条边仅计算一次，因为我们只需要存在一个这样的见证节点。 

## 工作示例

 ### 示例 1

 输入：```
3
0 1 2
1 0 1
2 1 0
```Floyd-Warshall 之后，最短路径保持不变：

 | 我| j | 原创| 最短|
 | ---| ---| ---| ---|
 | 0 | 1 | 1 | 1 |
 | 0 | 2 | 2 | 2 |
 | 1 | 2 | 1 | 1 |

 没有哪对有严格意义上更好的间接路线。 然而，边 (0,2) 是多余的，因为 0 → 1 → 2 的成本为 1 + 1 = 2，与直接边匹配。 

所以我们可以精确地删除一条边。 

输出：```
1
```### 示例 2

 输入：```
3
0 2 2
2 0 2
2 2 0
```Floyd-Warshall 并没有提高任何价值。 每对都已经有其直接优势作为唯一的最短路径成本。 

检查可移除性：

 对于 (0,1)，通过 2 的任何路径都会给出 2 + 2 = 4，这比 2 更差。所有对都相同。 

没有边缘可移除。 

输出：```
0
```## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N^3) | O(N^3) | Floyd-Warshall 在城市上空的三个嵌套循环占据主导地位
 | 空间| O(N^2) | O(N^2) | 两个矩阵存储原始路径距离和最短路径距离 |

 当 N ≤ 100 时，每个循环级别 10^6 次迭代是可以接受的。 常数因子很小并且完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return str(solve_output(inp)).strip()

# Re-define safe runner since solve prints
def solve_output(inp: str) -> str:
    import sys
    from io import StringIO
    backup = sys.stdin
    sys.stdin = StringIO(inp)

    out = StringIO()
    backup_out = sys.stdout
    sys.stdout = out

    solve()

    sys.stdin = backup
    sys.stdout = backup_out
    return out.getvalue()

# provided samples
assert solve_output("""3
0 1 2
1 0 1
2 1 0
""") == "1\n"

assert solve_output("""3
0 2 2
2 0 2
2 2 0
""") == "0\n"

# custom cases
assert solve_output("""2
0 5
5 0
""") == "0\n", "minimum non-trivial graph"

assert solve_output("""3
0 1 10
1 0 1
10 1 0
""") == "-1\n", "incoherent triangle violation"

assert solve_output("""4
0 1 2 3
1 0 1 2
2 1 0 1
3 2 1 0
""") == "3\n", "chain redundancy"

assert solve_output("""1
0
""") == "0\n", "single node"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 节点对称 | 0 | 结构最小，无需拆除 |
 | 三角形违规| -1 | 不相干检测|
 | 链图| 3 | 最大冗余情况|
 | 单节点| 0 | 边界条件|

 ## 边缘情况

 对于单个城市，没有需要验证或删除的边，算法在跳过 Floyd-Warshall 改进和配对检查后立即生成零。 

对于一条边严格比两步路径差的三角形，Floyd-Warshall 步骤严格减少该条目，导致与原始矩阵立即不匹配并返回 -1。 这可以防止对无效数据的可移动边缘进行计数的任何尝试。 

对于完全等成本的完全图，每条边都直接等于所有替代的两跳路径，因此每条边都被标记为可移除一次。 该算法正确地对每个无向对计数一次，因为内部循环仅在至少存在一个中间相等时才递增。
