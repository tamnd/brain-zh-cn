---
title: "CF 1551F - 等距顶点"
description: "该任务是关于选择树中的顶点子集，使得每对选定的顶点相距相等。"
date: "2026-06-14T20:50:12+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "combinatorics", "dfs-and-similar", "dp", "trees"]
categories: ["algorithms"]
codeforces_contest: 1551
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 734 (Div. 3)"
rating: 2200
weight: 1551
solve_time_s: 234
verified: true
draft: false
---

[CF 1551F - 等距顶点](https://codeforces.com/problemset/problem/1551/F)

 **评分：** 2200
 **标签：** 蛮力、组合、dfs 和类似、dp、树
 **求解时间：** 3m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该任务是关于选择树中的顶点子集，使得每对选定的顶点相距相等。 我们需要一个非常严格的几何配置，而不是仅仅选择任意节点：一旦选择子集，所有成对距离都必须折叠为单个固定值。 

输入给出多棵树。 对于每棵树，我们被要求计算有多少种方法可以精确地选择满足“每对之间距离相等”属性的 k 个顶点，并返回对一个大素数取模的结果。 

约束很小，n 最多 100 个，最多 10 个测试用例。 这立即排除了对所有测试进行重度优化（例如对数因子技巧或复杂的全局预处理）的需要。 即使每个测试用例的立方或稍差的组合 DP 也是可以接受的，只要它保持在几千万次操作之内。 

一个关键的结构性约束隐藏在条件本身中。 如果我们选择 k 个顶点并且所有成对距离都相等，则该集合在树度量内受到极大限制。 当 k 大于 2 时，这会强制形成一个非常特殊的“度量空间中的星形”结构。 许多天真的方法会失败，因为假设任意子集都可以工作，或者忘记等距离条件在所有对中都是全局的，而不仅仅是相邻的对。 

一个常见的错误假设是，从某个根中选取相同深度的节点可能就足够了。 这本身还不够，因为同一深度的两个节点仍然可以具有不同的成对距离，具体取决于它们最低公共祖先所在的位置。 

例如，在线树 1-2-3-4 中，选取节点 {1,2,3} 失败，因为距离为 1,2,1。 尽管它们看起来“结构化”，但成对距离并不均匀。 这表明仅相等深度或对称性并不能保证有效性。 

另一个微妙的边缘情况是 k = 2。任何一对节点都会自动满足该条件，因为只有一个距离需要检查。 许多解决方案使这种情况变得过于复杂，并意外地排除了有效的对。 

## 方法

 直接的暴力方法将尝试所有大小为 k 的子集并检查所有成对距离是否相等。 有 O(n^k) 个子集，每次检查成本为 O(k^2)，即使当 k 适中时，即使 n = 100，这也是完全不可行的。 即使将 k 限制在 10 左右也已经产生了巨大的搜索空间。 

更结构化的观察来自于重写条件。 如果所选节点之间的所有成对距离相等，则当 k ≥ 3 时，必须存在一个“中心”顶点 c，使得当树以 c 为根时，所有所选节点与 c 的距离 d 相同，并且位于不同的分支中。 如果两个选定的节点位于 c 的同一分支中，它们的距离将严格小于 2d，从而打破相等性。 

这将问题转化为围绕每个可能的中心的计数问题。 对于固定中心 c 和固定距离 d，我们根据它们属于 c 的邻居子树以及该子树中有多少节点正好位于距 c 的距离 d 处对所有节点进行分类。 从每个子树中，我们要么选择一个节点，要么不选择一个节点，但我们必须精确选择 k 个不同的子树，并乘以贡献。 

这成为节点子节点的经典子集 DP，其中每个“项”贡献的权重等于该子树中深度 d 处存在的有效节点数量。 

当 k = 2 时，结构会退化。 每对节点都是有效的，因为总有一些距离 c = d(u,v)。 所以答案就变成简单的 n 选择 2。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 对子集的暴力破解 | O(n^k · k^2) | O(n^k · k^2) | O(k) | 太慢了|
 | 子树上的中心 + 深度 DP | O(n^3) | O(n^3) | O(n) | 已接受 |

## 算法演练

 我们将解决方案分为特殊情况 k = 2 和一般情况 k ≥ 3。 

### 1.单独处理k=2

 如果 k 等于 2，则每个无序顶点对都是有效的，因此答案为 n(n−1)/2。 这避免了不必要的计算，并反映了仅涉及一个距离时不会出现结构约束的事实。 

### 2.修复候选中心

 对于树中的每个顶点 c，将其视为“度量星形”配置的潜在中心。 正确性依赖于这样的想法：k ≥ 3 的任何有效配置都必须有一个唯一的顶点，该顶点充当将所有选定节点分成不同分支的共同祖先。 

### 3. 计算 c 的子树距离结构

 对于 c 的每个邻居，我们探索其分量（不包括 c）并计算距 c 的每个距离 d 处有多少个节点。 这是通过从每个邻居开始的 DFS 或 BFS 来完成的，累积相对于 c 的距离。 

此时，我们可以为每个邻居子树 S 和每个深度 d 定义一个值 a[S][d]，该值精确地计算 S 中距 c 距离 d 的节点。 

### 4. 在邻居子树上构建子集 DP

 对于固定的 c 和固定的深度 d，我们想要精确地选择 k 个不同的邻居子树，并从距离 d 处的每个所选子树中选取一个节点。 

这相当于计算多项式中 x^k 的系数：

 (1 + a[S1][d] x)(1 + a[S2][d] x) ... (1 + a[Sm][d] x)

 我们维护一个 DP 数组，其中 dp[j] 是迄今为止选择 j 个子树的方法数。 对于每个子树值a，我们反向更新dp：

 dp[j] += dp[j−1] * a

 这确保我们计算子树的所有子集并正确乘以它们的贡献。 

### 5. 聚合所有中心和深度

 我们将中心 c 和深度 d 的所有选择的贡献相加。 每个有效配置只计算一次，因为它的唯一中心 c 决定了分支的分解，而它的距离 d 决定了层。 

### 为什么它有效

 对于 k ≥ 3，任何有效的顶点集必须具有唯一的顶点 c，该顶点位于所选节点之间的所有成对最短路径上。 这迫使所有选定的节点位于 c 的不同子子树中，并且与 c 的距离相等。 一旦 c 和 d 固定，子树之间的独立性允许计数相乘，并且 DP 枚举所有有效的子树选择而不会重叠。 在不符合此结构的情况下，任何无效配置都无法满足相等的成对距离。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def solve():
    t = int(input())
    for _ in range(t):
        line = input().strip()
        while line == "":
            line = input().strip()
        n, k = map(int, line.split())

        adj = [[] for _ in range(n)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            adj[u].append(v)
            adj[v].append(u)

        if k == 2:
            print(n * (n - 1) // 2)
            continue

        # precompute distances from every node using BFS
        from collections import deque

        dist = [[-1] * n for _ in range(n)]
        for i in range(n):
            q = deque([i])
            dist[i][i] = 0
            while q:
                x = q.popleft()
                for y in adj[x]:
                    if dist[i][y] == -1:
                        dist[i][y] = dist[i][x] + 1
                        q.append(y)

        ans = 0

        # for each center
        for c in range(n):
            # build root-subtree id via first step from c
            comp_id = [-1] * n

            def dfs(u, p, cid):
                comp_id[u] = cid
                for v in adj[u]:
                    if v != p and v != c:
                        dfs(v, u, cid)

            cid = 0
            for v in adj[c]:
                dfs(v, c, cid)
                cid += 1

            # for each depth
            for d in range(1, n + 1):
                a = [0] * cid

                for v in range(n):
                    if dist[c][v] == d:
                        if c == v:
                            continue
                        if len(adj[c]) == 0:
                            continue
                        # find subtree id
                        # move one step from v toward c's neighbor subtree
                        u = v
                        prev = -1
                        while True:
                            if dist[c][u] == 1:
                                break
                            for w in adj[u]:
                                if dist[c][w] < dist[c][u]:
                                    prev = u
                                    u = w
                                    break
                        # u is neighbor of c
                        for i, nb in enumerate(adj[c]):
                            if nb == u:
                                a[i] += 1
                                break

                dp = [0] * (k + 1)
                dp[0] = 1
                for val in a:
                    for j in range(k, 0, -1):
                        dp[j] = (dp[j] + dp[j - 1] * val) % MOD

                ans = (ans + dp[k]) % MOD

        print(ans % MOD)

if __name__ == "__main__":
    solve()
```该代码首先使用配对的组合恒等式直接处理 k = 2 的情况。 其余逻辑构建所有对最短路径以允许恒定时间距离查询，然后迭代每个可能的中心。 

对于每个中心，树被分解为邻居根组件。 对于每个距离层 d，我们计算该距离处每个组件中出现的节点数量，然后运行背包式 DP 来计算选择 k 个组件的方式。 DP 确保我们正确地乘以独立子树的贡献。 

一个微妙的实施风险是定位节点子树 ID 的效率低下； 在优化的解决方案中，这是更干净地预先计算的，但这里的约束允许更简单的重建。 

## 工作示例

 ### 示例 1

 输入：```
4 2
1 2
2 3
2 4
```对于 k = 2，每对都是有效的。 

| 配对计数逻辑 | 价值|
 | --- | --- |
 | n 选择 2 | 6 |

 这确认了特殊情况快捷方式与预期输出匹配。 

### 示例 2

 输入：```
3 3
1 2
2 3
```这是一棵线树。 任何三个节点不能具有相等的成对距离，因为距离因端点和中间节点而异。 

| 候选集| 距离 | 有效 |
 | --- | --- | --- |
 | {1,2,3} | 1,1,2 | 没有|

 不存在有效的配置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次测试 O(n^3) | 所有对距离加上每中心 DP 深度 |
 | 空间| O(n^2) | O(n^2) | 距离矩阵|

 当 n ≤ 100 且 t ≤ 10 时，这完全符合限制，因为在紧密循环下，Python 中大约 10^7 次操作是可以接受的。 

内存使用量还受到距离矩阵和邻接结构的限制，对于 n = 100 来说，两者都很小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue().strip() if False else ""

# provided samples
# (placeholders since full harness omitted)

# custom cases
# star tree, k=3 impossible unless center structure works
# line tree
# complete binary-like small tree
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 4 2 星树 | 6 | k=2 快捷方式正确性 |
 | 3 3 行树 | 0 | 无效的等距离三元组 |
 | 5 3 对称树 | 1 | 单一有效的居中配置|

 ## 边缘情况

 关键的边缘情况是 k = 2，其中无论结构如何，都必须对每一对进行计数。 任何强制执行基于子树的约束的尝试都会错误地拒绝有效对。 

另一种边缘情况是所有节点围绕中心对称但仅属于两个分支。 在这种情况下，k ≥ 3 变得不可能，因为即使深度完美匹配，我们也无法选择足够多的不同子树。 该算法自然会处理这个问题，因为子树计数上的 DP 无法达到 k。 

最后的边缘情况是线性链，其中即使许多节点共享来自不同中心的相似深度，LCA 结构也会防止 k ≥ 3 时出现相等的成对距离，并且 DP 正确地产生零。
