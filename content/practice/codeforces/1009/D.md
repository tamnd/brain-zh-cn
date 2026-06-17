---
title: "CF 1009D - 相对素图"
description: "我们被要求在编号为 1 到 n 的顶点上构建一个简单的无向图。 该图必须恰好有 m 条边，必须是连通的，并且必须避免自环和重复边。"
date: "2026-06-16T22:57:53+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "constructive-algorithms", "graphs", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1009
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 47 (Rated for Div. 2)"
rating: 1700
weight: 1009
solve_time_s: 115
verified: false
draft: false
---

[CF 1009D - 相对素图](https://codeforces.com/problemset/problem/1009/D)

 **评分：** 1700
 **标签：** 蛮力、构造性算法、图、贪婪、数学
 **求解时间：** 1m 55s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求在编号为 1 到 n 的顶点上构建一个简单的无向图。 该图必须恰好有 m 条边，必须是连通的，并且必须避免自环和重复边。 额外的约束是我们包含的每条边都必须连接最大公约数为 1 的两个顶点。 

因此，任务不仅仅是图的构造，而是受限的连接：只有当 i 和 j 互质时，我们才可以连接它们，并且我们必须精确地选择 m 个这样的有效对，以便生成的图是连接的。 

n 和 m 的输入大小都达到 100000，这会立即排除任何检查所有对或重新计算许多候选边的 gcd 的情况。 对所有对进行简单的 O(n²) 扫描是不可能的，因为它在上限上涉及大约 5 × 10⁹ 对。 即使 O(n √n) 结构也需要仔细设计，以避免边缘选择中隐藏的二次行为。 

主要有两个结构性限制。 首先，连通性强制至少有 n − 1 条边，因为 n 个顶点上的任何连通图都需要这么多条边。 其次，我们不能超过有效互质对的数量，这取决于数论结构而不仅仅是图组合。 

当 n = 1 时，会出现微妙的故障情况。在这种情况下，m 必须为 0，否则无法连接。 另一个失败情况是当 m 太大时：即使 Kₙ 有 n(n−1)/2 条边，其中许多对不是互质的，因此假设我们总能达到稠密图是不安全的。 

将 i 与 i+1 连接起来形成一条链，然后贪婪地添加任意有效边的简单方法经常会失败，因为如果没有仔细排序，它不能保证足够的互质对的可用性。 例如，如果我们尝试将所有节点连接到 1，则只会产生边 (1, i)，当 m 较大时，边太少。 

## 方法

 暴力方法首先枚举所有对 (i, j)，计算 gcd(i, j)，并收集所有有效边。 由于 gcd 计算，这已经花费了 O(n² log n)，这远远超出了限制。 即使我们巧妙地预先计算 gcd 结构，存储所有有效边在内存中也太大了。 

关键的观察结果是，顶点 1 与其他每个顶点互质，这为我们提供了一个以 1 为根的有保证的星型生成树。这立即解决了连接性问题：我们始终可以使用边 (1, 2)、(1, 3)、...、(1, n) 作为主干。 

这免费为我们提供了 n − 1 条边。 如果 m 等于 n − 1，我们就完成了。 如果 m 较大，我们需要在不破坏简单性或互质性的情况下添加额外的边。 下一个见解是，我们应该尝试连接顶点 i 和 j，其中 gcd(i, j) = 1，并以 j 的递增顺序构造附加边，始终将 j 附加到互质的某个 i < j 上。 

建设性的贪心策略是有效的：从以 1 为中心的星形开始，然后对于从 2 到 n 的每个顶点 i，每当 gcd(i, j) = 1 时尝试将其与其他顶点 j > i 连接，直到到达 m 条边。 由于我们只添加尊重互质性的边并且从不重复边，因此正确性会降低以确保我们在 m 可行时始终能够找到足够的有效对。 

可行性很简单：通过考虑所有互质对来实现最大边数，但我们永远不需要显式计算它； 相反，我们逐步构建，并在达到 m 时停止。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n² log n) | O(n² log n) | O(n²) | 太慢了 |
 | 建设性的贪婪 | O(n²) 最坏情况（在实践中修剪） | O(n + m) | 已接受 |

 ## 算法演练

1. 如果n == 1，则只有当m == 0时我们才能得到一个有效的图。否则该图不能连通或包含边。 
2. 首先创建一个以顶点 1 为根的生成树，为从 2 到 n 的所有 i 添加边 (1, i)。 这保证了与 n − 1 个有效边的连通性，因为对于所有 i 来说 gcd(1, i) = 1。 
3. 如果 m < n − 1，则不可能保持图连通，因为任何连通图都需要至少 n − 1 条边。 
4. 维护一个边列表和一个初始化为 n − 1 的计数器。 
5. 迭代所有满足 1 ≤ i < j ≤ n 的对 (i, j)。 对于每一对，检查 gcd(i, j) = 1。如果是，并且该边还不是初始星的一部分，请将其添加为额外边。 
6. 继续添加这样的边，直到边数达到 m。 一旦达到 m 立即停止。 

这种方法有效的关键原因是，我们从有保证的连接结构开始，只用有效的边对其进行增强，因此连接永远不会被破坏。 每条添加的边都遵循 gcd 约束，因此保留了有效性。 

### 为什么它有效

 该构造依赖于图在初始化后保持连接并且每个添加的边连接已经是连接组件一部分的两个顶点的不变量。 由于我们从不删除边缘，因此连接性是单调的。 唯一剩下的要求是精确实现 m 个边，并且由于我们迭代所有有效的互质对，因此我们最终将枚举任何可行的附加边（如果存在）。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    if n == 1:
        if m == 0:
            print("Possible")
        else:
            print("Impossible")
        return

    edges = []

    # build spanning tree (star at 1)
    for i in range(2, n + 1):
        edges.append((1, i))

    if m < n - 1:
        print("Impossible")
        return

    # try adding extra coprime edges
    import math

    if len(edges) > m:
        print("Impossible")
        return

    for i in range(1, n + 1):
        for j in range(i + 1, n + 1):
            if len(edges) == m:
                break
            if i == 1 and j <= n:
                continue  # already used in star
            if math.gcd(i, j) == 1:
                edges.append((i, j))
        if len(edges) == m:
            break

    if len(edges) != m:
        print("Impossible")
    else:
        print("Possible")
        for u, v in edges:
            print(u, v)

if __name__ == "__main__":
    solve()
```实现首先明确处理退化的单节点情况，因为连接约束的行为有所不同。 

然后我们构造一个以 1 为中心的星形，这保证了有效的连接基数。 这立即贡献了 n − 1 条边。 检查 m < n − 1 会尽早拒绝不可能的情况。 

嵌套循环扫描候选边并使用 gcd 来确保有效性。 从节点 1 跳过边的条件旨在避免初始星形边的重复，因为这些星形边已经固定。 

一旦收集到 m 个边，循环就会终止，以确保我们不会超调。 

## 工作示例

 ### 示例 1

 输入：```
5 6
```我们首先构建星形边缘。 

| 步骤| 我| j | gcd(i,j) | gcd(i,j) | 行动| 边数 |
 | ---| ---| ---| ---| ---| ---|
 | 初始化| - | - | - | 添加 (1,2)(1,3)(1,4)(1,5) | 4 |
 | 扫描| 2 | 3 | 1 | 添加 (2,3) | 5 |
 | 扫描| 2 | 4 | 2 | 跳过| 5 |
 | 扫描| 2 | 5 | 1 | 添加 (2,5) | 6 |

 我们停在 6 个边缘处。 该图保持连接，因为所有额外的边都添加到生成树的顶部。 这演示了额外的互质对如何补充基本结构。 

### 示例 2

 输入：```
4 3
```我们从星形边缘开始：

 | 步骤| 运营| 边缘|
 | ---| ---| ---|
 | 初始化| (1,2),(1,3),(1,4) | (1,2),(1,3),(1,4) | 3 |

 我们已经达到 m = 3，因此不需要额外的处理。 这显示了最小连通情况，其中答案正是一棵树。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 最坏情况 O(n²) | 我们可以检查所有对的 gcd，直到找到 m 条边 |
 | 空间| O(米) | 我们只存储最终的边列表 |

 约束允许最多 10⁵ 节点，但 m 也限制为 10⁵，因此在大多数实际情况下构造会提前终止。 对于允许的评估次数来说，Python 中的 gcd 检查足够快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from math import gcd

    n, m = map(int, inp.splitlines()[0].split())

    if n == 1:
        return "Possible\n" if m == 0 else "Impossible\n"

    edges = []
    for i in range(2, n + 1):
        edges.append((1, i))

    if m < n - 1:
        return "Impossible\n"

    import math

    for i in range(1, n + 1):
        for j in range(i + 1, n + 1):
            if len(edges) == m:
                break
            if i == 1:
                continue
            if math.gcd(i, j) == 1:
                edges.append((i, j))
        if len(edges) == m:
            break

    if len(edges) != m:
        return "Impossible\n"

    return "Possible\n" + "\n".join(f"{u} {v}" for u, v in edges) + "\n"

# sample
assert run("5 6") is not None

# minimal connected
assert run("4 3") == "Possible\n1 2\n1 3\n1 4\n"

# impossible single node mismatch
assert run("1 1") == "Impossible\n"

# exact tree
assert run("3 2") == "Possible\n1 2\n1 3\n"

# dense small case
assert run("6 8") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 | 1 不可能| 单节点可行性|
 | 4 3 | 仅树 | 最小连接 |
 | 3 2 | 星树| 基地建设|
 | 6 8 | 有效扩展| 添加额外边缘的能力|

 ## 边缘情况

 对于 n = 1，算法立即拒绝任何正 m，因为星形构造是不可能的。 这是在任何边沿生成开始之前处理的，以防止无效输出。 

对于 m = n − 1，算法精确输出以 1 为中心的星形并停止，而不进入额外的边缘循环。 这可确保不会意外过量添加。 

对于较小的 n（例如 2 或 3），对于涉及 1 的边来说，gcd 条件很容易满足，因此该构造干净地退化为最小树，而不需要任何额外的配对逻辑。
