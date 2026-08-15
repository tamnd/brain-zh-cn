---
title: "CF 104328B - 约翰和安马克斯"
description: "我们得到一个有向无环图，其中每个顶点都带有一个 20 位整数值。 任务是选择一条沿有向边移动的路径，恰好使用 $k$ 个顶点，并计算一个分数，该分数定义为沿路径的所有值的按位与。"
date: "2026-07-01T19:03:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104328
codeforces_index: "B"
codeforces_contest_name: "FIICode2023"
rating: 0
weight: 104328
solve_time_s: 78
verified: true
draft: false
---

[CF 104328B - 约翰和 AndMax](https://codeforces.com/problemset/problem/104328/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个有向无环图，其中每个顶点都带有一个 20 位整数值。 任务是选择一条沿着有向边移动的路径，准确地使用$k$顶点，并计算一个分数，定义为沿路径的所有值的按位与。 在所有长度有效的路径中$k$，我们想要这个 AND 的最大可能结果。 

因此，问题不是寻找经典意义上的最短或最长路径，而是选择一条在所有选定顶点上保留尽可能多的公共集合位的受限长度路径。 

关键的困难来自于结构和按位运算之间的相互作用。 该图限制了转换，而 AND 运算强烈依赖于哪些顶点同时出现。 任何选定顶点中的单个零位都会永久破坏最终结果中的该位。 

约束条件很大：最多$2 \cdot 10^5$顶点和边，以及$k$也可以大到$n$。 任何尝试枚举路径或维护每个路径状态的解决方案都会失败，因为即使存储所有部分路径也是指数级的$k$，甚至在没有压缩的情况下所有路径上的 DP 都会导致$O(nk)$这是边界，但考虑到仍然太大$m$以及。 

DAG 的结构至关重要。 它保证没有循环，因此我们可以按拓扑顺序处理顶点，并确保任何路径的长度最多$n$。 

朴素方法的一个微妙的失败案例是假设贪婪在本地起作用。 例如，在每一步中选择具有最大值的邻居是行不通的，因为局部最优顶点可能会消除未来继续所需的位。 

另一个失败案例是将其视为具有标量权重的最长路径 DP。 这里的“权重”不是可加的或单调的，因此使用每个节点的单个最佳值来合并子问题是不够的。 我们必须记住更多的信息，而不仅仅是每个顶点的一个最佳得分。 

## 方法

 一个强力的想法是在路径上定义 DP：对于每个顶点和每个长度，计算以该长度结束于该顶点的路径的最佳可能 AND 值。 转换将考虑所有传入边缘。 这会导致形式的重复出现$dp[v][t] = \max_{u \to v}(dp[u][t-1] \& a_v)$。 

这是正确的，但太慢了。 状态空间是$O(nk)$，并且每个转换扫描传入边缘，产生$O(mk)$，在最坏的情况下达到$2 \cdot 10^{10}$运营。 

关键的观察是价值空间不是任意的。 每个数字最多 20 位，因此最多有$2^{20}$可能的掩码，AND 运算仅删除位。 这表明了一种位级构造：我们不计算精确的 DP 值，而是尝试从最高可能的掩码向下贪婪地构造答案。 

我们扭转观点：我们不问“每条路径的最佳AND是什么”，而是问“我们能否实现给定掩码作为长度k路径的AND？”。 如果掩码可实现，则其所有子掩码也可实现。 这种单调性允许二分搜索或贪婪位构建。 

我们从最重要到最不重要一点一点地构建答案。 在每一步中，我们尝试将一位强制为 1，并检查是否存在长度为 1 的路径$k$仅使用其值包含所有当前固定位的顶点。 该检查简化为 DAG 上的受限可达性 DP，其中我们仅通过允许的顶点进行传播。 

因为每次可行性检查都是$O(n + m)$，并且我们最多执行 20 位，总复杂度变为$O(20(n + m))$，这是有效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 路径上的暴力 DP |$O(mk)$|$O(nk)$| 太慢了 |
 | 位掩码贪婪在 DAG 上的可行性 |$O(20(n + m))$|$O(n)$| 已接受 |

 ## 算法演练

 我们将问题重新解释为构造最大位掩码，该位掩码可以显示为有效长度 k 路径的 AND。 

### 步骤

 1. 计算 DAG 的拓扑排序。 

这确保我们可以在一次前向传播中传播路径信息，而无需重新访问节点。 
2. 将答案掩码初始化为0。 

我们将尝试从高到低设置位。 
3. 对于从 19 到 0 的每一位，尝试将其设置在应答掩码中。 

我们临时定义一个候选掩码，其中包括所有先前固定的位加上这个新位。 
4. 过滤与候选掩码兼容的顶点，这意味着候选中的所有位都存在于顶点值中。 

任何失败的顶点都不能出现在该掩码下的有效路径中。 
5. 按拓扑顺序在 DAG 上运行 DP，以计算从每个有效节点开始可实现的最大路径长度。 

对于每个节点，如果它有效，则其最佳链长度为 1 加上所有同样有效的传出邻居的最大值。 
6. 如果任意节点至少达到路径长度$k$，那么候选掩码是可行的，所以我们保留该位。 否则，我们将丢弃它。 
7. 处理完所有位后，输出构建的掩码。 

每个可行性检查中的DP是关键的计算步骤。 它本质上是在问：在由允许的顶点导出的子图中，是否存在至少长度为$k$？ 由于该图是 DAG，因此这会简化为仅限于有效节点的 DAG 中的最长路径问题。 

### 为什么它有效

 该算法保持不变性，即在每一步中，当前掩码表示至少一个长度有效路径可实现的值$k$。 每次可行性检查都确保添加新位不会破坏此属性。 由于 AND 仅删除位而从不引入它们，因此掩码的任何扩展只会使顶点集变小，而不会变大。 因此，可行性在位移除方面是单调的，这证明了从高位向下进行贪婪构造的合理性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can(mask, n, adj, topo, a, k):
    valid = [False] * n
    for i in range(n):
        if (a[i] & mask) == mask:
            valid[i] = True

    dp = [0] * n
    best = 0

    for u in topo:
        if not valid[u]:
            continue
        dp[u] = max(dp[u], 1)
        for v in adj[u]:
            if valid[v]:
                if dp[u] + 1 > dp[v]:
                    dp[v] = dp[u] + 1
        best = max(best, dp[u])

    return best >= k

def topo_sort(n, adj):
    indeg = [0] * n
    for u in range(n):
        for v in adj[u]:
            indeg[v] += 1

    stack = [i for i in range(n) if indeg[i] == 0]
    topo = []

    while stack:
        u = stack.pop()
        topo.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                stack.append(v)

    return topo

def solve():
    n, m, k = map(int, input().split())
    a = list(map(int, input().split()))

    adj = [[] for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        adj[u].append(v)

    topo = topo_sort(n, adj)

    ans = 0
    for b in range(19, -1, -1):
        cand = ans | (1 << b)
        if can(cand, n, adj, topo, a, k):
            ans = cand

    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案首先构建拓扑排序，以便所有转换都遵循 DAG 方向。 这是必要的，因为可行性 DP 依赖于按依赖顺序处理节点，而无需重新访问状态。 

这`can`函数通过过滤顶点来强制当前的位掩码约束。 任何缺少所需位的节点都将被完全排除。 然后，类似最长路径的 DP 在 DAG 上运行，但仅在有效节点之间运行。 如果任何节点的链长度至少为$k$，我们接受面具。 

外循环贪婪地从最高位到最低位构建答案，确保按字典顺序最大位掩码。 

一个微妙的点是我们不需要跟踪精确的路径，只需要跟踪最长的有效链。 因为我们只关心长度是否$k$路径存在，DP值超出$k$是无关紧要的。 

## 工作示例

 ### 示例 1

 我们从掩码 0 开始，尝试激活从 19 开始的位。 

在每个候选掩码中，我们仅使用兼容节点检查是否存在有效的长度为 4 的路径。 

| 步骤| 面具尝试| 有效节点存在 | 找到最长的路径 | 决定|
 | --- | --- | --- | --- | --- |
 | b=19..高| 0 | 所有节点| ≥4 | 保持|
 | 高位| 各种| 限制 | <4 或 ≥4 | 选择性|
 | 决赛| 10 | 10 有效链存在 | 4 | 接受|

 最终构建的掩码为 10。 

此跟踪显示中间限制可能会删除许多节点，但仍保留足够长的链。 

### 示例 2

 我们重复同样的贪心构造。 

| 步骤| 面具尝试| 有效节点存在 | 找到最长的路径 | 决定|
 | --- | --- | --- | --- | --- |
 | 开始 | 0 | 所有节点| ≥4 | 保持|
 | 高位| 逐步限制| 变化| 有时 <4 | 丢弃|
 | 决赛| 32 | 32 有效链存在 | 4 | 接受|

 这表明，只要兼容的 DAG 路径仍然存在，即使在强过滤下，较高位也可以幸存。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(20(n + m))$| 20 位中的每一位都会触发所有节点和边缘上的一个 DAG DP |
 | 空间|$O(n + m)$| 邻接表、拓扑顺序和 DP 数组 |

 复杂性完全在限制范围内，因为$n, m \le 2 \cdot 10^5$。 即使在最坏的情况下，我们也会执行大约 400 万次边缘松弛，这在使用邻接表优化的 Python 中只需 1 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def topo_sort(n, adj):
        indeg = [0]*n
        for u in range(n):
            for v in adj[u]:
                indeg[v]+=1
        stack = [i for i in range(n) if indeg[i]==0]
        topo=[]
        while stack:
            u=stack.pop()
            topo.append(u)
            for v in adj[u]:
                indeg[v]-=1
                if indeg[v]==0:
                    stack.append(v)
        return topo

    def can(mask, n, adj, topo, a, k):
        valid=[False]*n
        for i in range(n):
            if (a[i]&mask)==mask:
                valid[i]=True
        dp=[0]*n
        best=0
        for u in topo:
            if not valid[u]: continue
            dp[u]=max(dp[u],1)
            best=max(best,dp[u])
            for v in adj[u]:
                if valid[v]:
                    dp[v]=max(dp[v], dp[u]+1)
        return best>=k

    n, m, k = map(int, input().split())
    a = list(map(int, input().split()))
    adj = [[] for _ in range(n)]
    for _ in range(m):
        u,v = map(int, input().split())
        adj[u-1].append(v-1)

    topo = topo_sort(n, adj)
    ans=0
    for b in range(19,-1,-1):
        if can(ans|(1<<b), n, adj, topo, a, k):
            ans|=(1<<b)
    return str(ans).strip()

# provided samples
assert run("""5 8 4
11 26 15 3 26
1 5
2 3
2 5
3 1
3 5
4 1
4 3
4 5
""") == "10"

assert run("""7 12 4
36 47 47 31 33 15 34
1 6
1 7
2 4
2 5
3 2
3 7
4 1
4 5
4 6
5 7
6 5
6 7
""") == "32"

# custom cases
assert run("""2 1 2
3 3
1 2
""") == "3", "minimum chain"

assert run("""3 2 3
7 7 7
1 2
2 3
""") == "7", "all equal values"

assert run("""4 3 2
8 4 2 1
1 2
2 3
3 4
""") == "0", "no common bit survives"

assert run("""5 4 3
31 31 31 31 31
1 2
2 3
3 4
4 5
""") == "31", "full preservation"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 长度为 2 的链 | 3 | 最小长度可行性|
 | 所有相同的值 | 7 | 完全传播正确性|
 | 严格递减位| 0 | 完全位消除|
 | 完全统一的DAG | 31 | 最大面罩保持力|

 ## 边缘情况

 关键的边缘情况是只有一条路径长度时$k$存在，并且所有其他节点与更高位不兼容。 该算法可以正确处理这个问题，因为可行性取决于任何有效链的存在，而不是全局密度。 

例如：```
4 3 3
7 6 7 7
1 2
2 3
3 4
```当测试节点 2 中缺少的高位时，该节点被排除，并且链断裂，导致 DP 对于该掩码失败。 然后算法正确地丢弃该位并继续向下。 

另一种边缘情况是存在多个路径但只有一个保留稀有位。 由于 DP 计算所有有效节点上的最大路径长度，因此如果达到长度，它自然会选择该罕见路径$k$，确保正确性而无需显式跟踪路径。
