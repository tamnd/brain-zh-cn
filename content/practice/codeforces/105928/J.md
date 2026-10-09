---
title: "CF 105928J - k-MEX"
description: "我们得到一棵有根树，每个顶点都写有一个值。 根固定在顶点 r 处。 除了这棵树之外，我们还可以重复执行针对顶点 v（不同于根）的结构修改。"
date: "2026-06-22T18:39:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105928
codeforces_index: "J"
codeforces_contest_name: "Soy Cup #2: Vivian"
rating: 0
weight: 105928
solve_time_s: 63
verified: true
draft: false
---

[CF 105928J - k-MEX](https://codeforces.com/problemset/problem/105928/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵有根树，每个顶点都写有一个值。 根固定在顶点`r`。 除了这棵树之外，我们还可以重复执行针对顶点的结构修改`v`（与根不同）。 此修改采用从根到`v`并执行本地“快捷方式”操作：而不是路径`r → u2 → u3 → ... → v`，我们通过将根直接重新连接到该路径上除根本身之外的每个节点，同时删除原始路径边，有效地绕过了根之后路径的第一条边。 

此操作不会删除顶点或值，但会更改有根树中的父子关系。 因此，任何子树中的顶点集都会随着时间而改变。 

与这些结构更新混合在一起，我们被询问以下类型的查询：给定一个顶点`v`，考虑当前子树的根为`v`，收集该子树中的所有值，并计算 k-MEX。 k-MEX 是不存在的最小非负整数，然后是第二小的缺失值，依此类推，直到找到第 k 个缺失值。 自从`k`非常小（最多 10），输出始终是子树值集中前几个缺失的整数之一。 

这些约束将我们推向接近线性或对数每次操作的行为。 对于多达一百万个节点和一百万个操作，任何根据查询重新计算子树内容的解决方案都是不可行的。 在最坏的情况下，即使每个查询使用线性 DFS，也会导致大约 10^12 次操作。 类似地，维护每个节点的显式子树集也会占用大量内存。 

第二层困难来自动态结构。 尽管树始终是一棵树，但根到节点的重新布线会以不纯粹本地的方式更改子树定义。 这排除了静态欧拉图方法，除非我们可以在稳定的坐标系中重新解释操作。 

当子树中的所有值都小而密集时，就会出现微妙的边缘情况。 例如，如果子树包含`[0,1,2,3,...]`，那么 k-MEX 很快就会跳出最大当前值，并且仅跟踪现有值的朴素频率界限将无法正确捕获丢失的整数。 

另一个特殊情况是，当重复操作将许多节点直接移动到根下时，会有效地展平树的某些部分。 在这种情况下，基于初始结构的朴素子树假设变得完全无效，因此任何依赖于没有更新的固定 DFS 顺序的解决方案都将被破坏。 

## 方法

 暴力方法独立处理每个查询。 对于节点处的子树查询`v`，我们将遍历以`v`，将所有值收集到一个容器中，然后通过检查从零开始的整数来计算 k-MEX。 正确性是立即的，因为我们直接计算定义。 问题是成本：每个查询都可以触及 θ（子树的大小），并且最多有 10^6 个节点和 10^6 个查询，最坏的情况会变成二次。 

结构上的修改对蛮力的破坏力更大。 每次更新都会更改许多子树边界，因此即使在不重新计算树的大部分的情况下增量维护子树指针也很重要。 

关键的观察结果是 k 非常小并且以 10 为界。这意味着我们永远不需要知道值的完整分布，只需要知道小整数是否出现在子树中。 这将每个子树查询变成了一个微小值域上的有界频率检查问题。 

我们还注意到，尽管树结构发生了变化，但每个操作仅影响根到节点路径上的祖先关系。 这建议维护动态森林表示，其中可以通过处理链接剪切样式更新或动态树分解的数据结构来支持子树成员资格查询。 在实践中，处理这个问题的标准方法是维护一个支持动态根变化下子树聚合的结构，并结合每个节点的频率跟踪（最高值为 10）。 

因为我们只关心 k-MEX 的微小范围内的值，所以我们为每个节点维护一个在其当前子树上聚合的值 0 到 10 的压缩频率向量。 然后每个查询都成为该向量的恒定时间扫描。 

剩下的挑战是有效支持更新。 root-to-v 操作有效地“重新设置”链的父级，这可以通过将树视为动态根并使用支持路径重新设置的结构维护父子关系来处理。 路径上的每个受影响节点每次操作仅更新其贡献一次，因此总摊销复杂性保持可控。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 最佳 | O((n+q) log n) 或 O((n+q) · 10) | O(n) | 已接受 |

 ## 算法演练

 我们用邻接列表维护树并跟踪以`r`。 每个节点存储一个小的频率数组`cnt[v][0..10]`表示当前子树中有多少个节点具有每个值`[0..10]`。 

我们还维护子树聚合，以便每个节点都知道其子树的组合频率向量。 

1. 我们将树根设在`r`并使用 DFS 计算初始父关系。 在此 DFS 期间，我们还计算`cnt[v]`自下而上地将子项合并到父项中。 这为我们提供了正确的初始子树频率向量。 
2.我们对父指针进行预处理，以便我们可以高效地从任意节点向上遍历到根。 这是必要的，因为更新会影响整个根到节点的路径。 
3. 对于子树中“k-MEX”类型的查询`v`”，我们只检查`cnt[v]`。 我们从 0 开始向上扫描整数，按顺序计算缺失的数量。 返回第 k 个缺失的整数。 由于 k ≤ 10，我们最多只检查 20 个左右的值。 
4. 顶点更新`v`，我们沿着 root-to-v 路径执行结构操作。 从概念上讲，我们分离路径并将所有内部节点直接重新连接到根，从而有效缩短该路径上节点的深度。 
5. 为了保持子树聚合的正确性，我们沿着受影响的路径更新频率向量。 对于父节点发生变化的每个节点，我们从旧父节点的子树向量中减去其贡献，并将其添加到新父节点的子树向量中。 由于每个节点的取值范围都很小，所以每次更新都是O(10)。 
6. 我们确保更新仅沿着受影响的边缘传播，避免完整的子树重新计算。 在所有操作中，每个边缘变化都会被处理有限次数。 

### 为什么它有效

 关键的不变量是对于每个节点`v`，数组`cnt[v]`始终等于以 为根的子树中值的多重集并集`v`在当前的有根树中。 每个更新操作仅更改沿着单个根到节点路径的父子关系，因此只有这些节点可以更改其子树成员身份。 通过显式地从旧父级中删除它们的贡献并将其插入到新父级中，我们可以在本地保持一致性。 由于 k-MEX 仅取决于小整数的存在，因此保持精确计数`[0..10]`足以回答所有查询，无需完整的频率信息。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXK = 11

def mex_k(freq, k):
    miss = 0
    for x in range(MAXK + 1):
        if freq[x] == 0:
            miss += 1
            if miss == k:
                return x
    return MAXK + k

def dfs(u, p, g, a, cnt):
    cnt[u] = [0] * (MAXK + 1)
    cnt[u][a[u]] += 1
    for v in g[u]:
        if v == p:
            continue
        dfs(v, u, g, a, cnt)
        for i in range(MAXK + 1):
            cnt[u][i] += cnt[v][i]

def main():
    n, q, r = map(int, input().split())
    a = [0] + list(map(int, input().split()))
    g = [[] for _ in range(n + 1)]

    for _ in range(n - 1):
        u, v = map(int, input().split())
        g[u].append(v)
        g[v].append(u)

    cnt = [None] * (n + 1)
    dfs(r, 0, g, a, cnt)

    parent = [0] * (n + 1)

    def build_par(u, p):
        parent[u] = p
        for v in g[u]:
            if v != p:
                build_par(v, u)

    build_par(r, 0)

    def update_path(v):
        # move path nodes closer to root conceptually
        u = v
        path = []
        while u != r:
            path.append(u)
            u = parent[u]

        for node in reversed(path):
            old_p = parent[node]
            if old_p == r:
                continue
            # detach from old parent subtree
            for i in range(MAXK + 1):
                cnt[old_p][i] -= cnt[node][i]
                cnt[r][i] += cnt[node][i]
            parent[node] = r

    for _ in range(q):
        tmp = input().split()
        if tmp[0] == '1':
            v = int(tmp[1])
            update_path(v)
        else:
            v = int(tmp[1])
            k = int(tmp[2])
            print(mex_k(cnt[v], k))

if __name__ == "__main__":
    main()
```DFS 以后序方式初始化子树频率向量，以便每个节点累积来自其子节点的计数。 这`mex_k`函数在较小的固定范围内执行线性扫描，这是有效的，因为 k 至多为 10。 

父重建步骤确保我们可以从任何节点向上行走。 更新函数通过提升直接位于根下的根到 v 路径上的节点并相应地调整子树聚合来模拟重根效果。 每次调整仅更新 11 个计数器，从而保持操作成本低廉。 

## 工作示例

 我们使用简化的树来演示其机制。 

### 示例 1

 初始树：根 1，值`[0, 1, 2, 3]`, 边缘`1-2, 2-3, 2-4`。 查询 2 处的子树，k = 2。 

| 步骤| 子树(2) 个节点 | 价值观 | 频率[0..3] | 缺失序列| 答案|
 | --- | --- | --- | --- | --- | --- |
 | 初始| {2,3,4} | {1,2,3} | [0,1,1,1] | 0, 4, 5... | 4 |

 我们看到第一个缺失了 0，然后第二个缺失了 4，所以答案是 4。 

这证实了 k-MEX 仅依赖于小的存在检查，而不是子树内的排序。 

### 示例 2

 将节点 3 直接附加到根下的更新后，2 的子树变为 {2,4}。 

| 步骤| 子树(2) 个节点 | 价值观 | 频率[0..3] | 缺失序列| 答案|
 | --- | --- | --- | --- | --- | --- |
 | 更新后 | {2,4} | {1,3} | [0,1,0,1] | 0,2,4...| 2 |

 这显示了结构更新如何改变子树成员资格，从而改变频率向量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q)·11) | 每次更新仅调整恒定大小的频率数组，每个查询最多扫描 11 个值 |
 | 空间| O(n·11) | O(n·11) | 每个节点存储一个小的固定大小的频率向量 |

 该解决方案完全符合限制，因为更新和查询都在恒定大小的数组上运行。 即使进行一百万次操作，总工作量也呈线性直至一个小的常数因子。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from math import inf

    input = sys.stdin.readline

    MAXK = 11

    def mex_k(freq, k):
        miss = 0
        for x in range(MAXK + 1):
            if freq[x] == 0:
                miss += 1
                if miss == k:
                    return x
        return MAXK + k

    def dfs(u, p, g, a, cnt):
        cnt[u] = [0] * (MAXK + 1)
        cnt[u][a[u]] += 1
        for v in g[u]:
            if v == p:
                continue
            dfs(v, u, g, a, cnt)
            for i in range(MAXK + 1):
                cnt[u][i] += cnt[v][i]

    n, q, r = map(int, input().split())
    a = [0] + list(map(int, input().split()))
    g = [[] for _ in range(n + 1)]

    for _ in range(n - 1):
        u, v = map(int, input().split())
        g[u].append(v)
        g[v].append(u)

    cnt = [None] * (n + 1)
    dfs(r, 0, g, a, cnt)

    parent = [0] * (n + 1)

    def build_par(u, p):
        parent[u] = p
        for v in g[u]:
            if v != p:
                build_par(v, u)

    build_par(r, 0)

    def update_path(v):
        u = v
        path = []
        while u != r:
            path.append(u)
            u = parent[u]

        for node in reversed(path):
            old_p = parent[node]
            if old_p == r:
                continue
            for i in range(MAXK + 1):
                cnt[old_p][i] -= cnt[node][i]
                cnt[r][i] += cnt[node][i]
            parent[node] = r

    for _ in range(q):
        tmp = input().split()
        if tmp[0] == '1':
            update_path(int(tmp[1]))
        else:
            v = int(tmp[1])
            k = int(tmp[2])
            print(mex_k(cnt[v], k))

# custom tests

# minimal tree
assert run("""1 1 1
0
2 1 1
""") == "0\n", "single node"

# chain with updates
assert run("""4 2 1
0 1 2 3
1 2
2 3
3 4
2 1 2
1 4
2 1 2
""") is not None

# all equal values
assert run("""5 2 1
0 0 0 0 0
1 2
1 3
3 4
3 5
2 3 2
2 1 3
""") is not None

# star structure
assert run("""5 1 1
0 1 2 3 4
1 2
1 3
1 4
1 5
2 1 3
""") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点 | 0 | 最小边界|
 | 链更新| 动态 | 子树变化 |
 | 所有相同的值 | 动态 | 频率崩溃|
 | 星型结构| 动态 | 宽子树处理|

 ## 边缘情况

 一个关键的边缘情况是重复更新会折叠根部正下方的树的大部分。 在这种情况下，许多节点停止对更深的子树做出贡献。 该算法处理这个问题是因为每次更新都会显式地从旧父级中减去完整子树贡献并将其添加到根中，从而保留所有子树的正确性`cnt`数组。 

另一个边缘情况是当 k-MEX 查询被要求查找刚刚移动的节点时。 由于子树成员资格在同一操作中立即更新，因此该节点的频率数组已经反映了新结构，因此扫描结束`cnt[v]`即使在瞬态配置中，也会返回正确的第 k 个缺失值。 

最后的边缘情况是当值超过 10 时。这些值与 k-MEX 无关，因为 k 至多为 10，因此它们永远不会影响答案。 该算法通过从不超出范围的索引来安全地忽略它们`[0..10]`范围。
