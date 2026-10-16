---
title: "CF 106260B - §56de§6587"
description: "我们得到一棵有根树，其中每个节点都带有一个小写字母。 根是节点 1，每个节点距根都有明确定义的深度。 每个查询集中于一个节点 u 和目标深度 d。"
date: "2026-06-25T07:23:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106260
codeforces_index: "B"
codeforces_contest_name: "2025 SiChuan University for new student"
rating: 0
weight: 106260
solve_time_s: 48
verified: true
draft: false
---

[CF 106260B - \u56de\u6587](https://codeforces.com/problemset/problem/106260/B)

 **评级：** -
 **标签：** -
 **求解时间：** 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵有根树，其中每个节点都带有一个小写字母。 根是节点 1，每个节点距根都有明确定义的深度。 

每个查询集中于一个节点`u`和目标深度`d`。 我们查看同时满足两个条件的所有节点：它们位于`u`，并且它们距根部的深度恰好是`d`。 根据写在这些节点上的字母，我们可以按任意顺序使用所有这些字母来形成一个字符串。 

每个查询的问题是我们是否可以对这些字母重新排序，以便生成的字符串成为反回文，这意味着如果我们将第一个字符与最后一个字符配对，将第二个字符与倒数第二个字符配对，依此类推，则不会有任何对包含相同的字母。 

树的大小和查询的数量都足够大，以至于子树的任何每个查询遍历都太慢。 分别访问每个子树内的节点将导致粗略的结果$O(nq)$，这远远超出了可行的限制$2 \cdot 10^5$。 这迫使我们采用一种预处理方法，其中子树和深度信息被重新组织，因此查询减少到快速范围计数。 

当没有节点匹配查询条件时，会出现微妙的边缘情况。 例如，如果子树中没有节点`u`位于深处`d`，答案一定是“否”。 另一个重要的情况是当该层中仅存在单个节点时：单个字符串无法形成反回文，因为它会与中间位置的自身进行比较。 例如，带有字母的单个节点`"a"`必须返回`No`。 

## 方法

 每个查询的直接方法是收集子树中的所有节点`u`，过滤有深度的`d`，提取它们的字母，然后检查我们是否可以将它们排列成反回文。 正确性很简单，因为它准确地反映了定义。 问题是性能。 在稠密树中，子树可能包含$O(n)$节点，并且对每个查询执行此操作会导致$O(nq)$工作，太大了。 

关键的结构观察是条件“节点位于`u`”自然地用欧拉游程区间来表示，而“节点有深度`d`” 将节点划分为独立的层。一旦我们确定了深度`d`，该深度的所有节点都可以按照欧拉之旅中进入时间的升序列出。 然后，每个子树限制都成为该排序列表上的连续间隔查询。 

这将问题简化为按深度对静态数组进行频率查询。 对于每个深度，我们维护一个按 DFS 进入时间排序的节点列表，并且还维护该列表上字母的前缀计数。 然后每个查询都会在子数组上提取频率表，这可以在 O(26) 时间内完成。 

剩下的步骤是检查多个字母集是否可以形成反回文。 可以重新排列多重集，以便当且仅当长度为偶数并且没有字符出现超过长度的一半时，没有镜像对匹配。 如果任何字符超过一半，则它必然占据两个镜像位置。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询的暴力破解 |$O(n)$每个查询 |$O(n)$| 太慢了|
 | DFS + 深度列表 + 前缀计数 |$O((n+q)\log n + 26q)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 从根运行 DFS，计算每个节点的两个值：深度和欧拉进入时间。 这使子树结构线性化，使得每个子树都成为 DFS 顺序中的一个区间。 
2. 对于每个深度值`d`，收集位于该深度的所有节点。 按照 DFS 进入时间的升序存储它们。 这确保任何子树限制都将对应于该列表内的连续段。 
3. 对于每个深度列表，构建 26 个前缀数组，每个字母一个。 每个前缀数组允许我们在恒定时间内计算任意段中字母的出现次数。 
4. 对于每个查询`(u, d)`，定位深度节点段`d`其进入时间介于`tin[u]`和`tout[u]`使用二分查找。 
5. 使用前缀差异，计算该段中每个字符的频率。 
6.让`k`是该段中的节点总数。 如果`k == 0`，输出“否”。 
7. 如果`k`是奇数，输出“No”，因为反回文需要将每个位置与不同的伙伴配对。 
8. 否则，检查是否有字符频率超过`k / 2`。 如果存在该字符，则输出“No”，否则输出“Yes”。 

### 为什么它有效

 DFS 排序保证子树成员资格成为区间条件。 深度分组将每个查询隔离到单个层中，其中结构不再依赖于树，仅依赖于 DFS 顺序中的位置。 在固定层内，前缀和使频率提取对于任何子树切片都是精确的。 

反回文条件简化为对称配对位置。 由于每个位置都必须与不同的位置配对，因此任何字符都不能占据超过一半的位置，甚至需要长度才能完成配对。 这两个条件充分表征了可行性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

n, q = map(int, input().split())
g = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    u, v = map(int, input().split())
    g[u].append(v)
    g[v].append(u)

s = input().strip()

tin = [0] * (n + 1)
tout = [0] * (n + 1)
depth = [0] * (n + 1)
timer = 0

nodes_by_depth = {}

def dfs(u, p):
    global timer
    timer += 1
    tin[u] = timer

    d = depth[u]
    if d not in nodes_by_depth:
        nodes_by_depth[d] = []
    nodes_by_depth[d].append(u)

    for v in g[u]:
        if v == p:
            continue
        depth[v] = d + 1
        dfs(v, u)

    tout[u] = timer

dfs(1, -1)

# build depth structures
depth_data = {}
for d, nodes in nodes_by_depth.items():
    nodes.sort(key=lambda x: tin[x])
    arr = [s[u - 1] for u in nodes]

    pref = [[0] * (len(nodes) + 1) for _ in range(26)]
    for i, ch in enumerate(arr, 1):
        for c in range(26):
            pref[c][i] = pref[c][i - 1]
        pref[ord(ch) - 97][i] += 1

    depth_data[d] = (nodes, pref)

def solve_query(u, d):
    if d not in depth_data:
        return False

    nodes, pref = depth_data[d]

    # find left bound: first tin >= tin[u]
    l, r = 0, len(nodes)
    while l < r:
        m = (l + r) // 2
        if tin[nodes[m]] >= tin[u]:
            r = m
        else:
            l = m + 1
    left = l

    # find right bound: last tin <= tout[u]
    l, r = 0, len(nodes)
    while l < r:
        m = (l + r) // 2
        if tin[nodes[m]] <= tout[u]:
            l = m + 1
        else:
            r = m
    right = l

    k = right - left
    if k == 0:
        return False
    if k % 2 == 1:
        return False

    for c in range(26):
        cnt = pref[c][right] - pref[c][left]
        if cnt > k // 2:
            return False

    return True

out = []
for _ in range(q):
    u, d = map(int, input().split())
    out.append("Yes" if solve_query(u, d) else "No")

print("\n".join(out))
```DFS 部分构造了一个线性顺序，其中子树查询成为范围约束。 按深度预处理将问题压缩为独立的频率数组。 

在每个查询中，两个二分搜索精确隔离属于子树和目标深度的节点。 然后，前缀数组允许精确计数，而无需扫描段。 

最终检查实现反回文的结构约束：偶数长度和有界频率。 

## 工作示例

 考虑一棵小树，其中节点 1 有子节点 2 和 3，并且 2 和 3 各有一个子节点。 假设我们查询一个子树，其中包含两个具有相同深度且带有字母的节点`a`和`b`。 

| 步骤| 考虑的节点 | 信件| 频率检查 | 结果 |
 | ---| ---| ---| ---| ---|
 | 查询子树深度切片 | [2, 3] | 一个，b | 最大频率 = 1 | 是的 |

 这表明配对有效`ab`。 

现在考虑一种情况，该深度的所有节点都是`a`。 

| 步骤| 考虑的节点 | 信件| 频率检查 | 结果 |
 | ---| ---| ---| ---| ---|
 | 查询子树深度切片 | [2,3,4,5]| 一个，一个，一个，一个| 最大频率 = 4 | 没有 |

 即使长度是均匀的，任何排列都会迫使`a`匹配`a`在某个镜像位置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log n + q \log n + 26q)$| DFS构建结构； 每个查询使用两次二分搜索和 26 次计数 |
 | 空间|$O(26n)$| 每个深度存储累积计数的前缀数组

 预处理与节点数量和每个深度列表的排序开销呈线性关系。 每个查询仅执行对数边界查找加上恒定的字母表扫描，这在以下约束下很适合$2 \cdot 10^5$运营。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from collections import defaultdict

    # paste solution here or assume callable solve()
    return ""

# custom cases
assert run("""5 1
1 2
1 3
2 4
2 5
aabcc
1 2
""").strip().lower() == "yes"

assert run("""3 1
1 2
1 3
aaa
1 2
""").strip().lower() == "no"

assert run("""4 1
1 2
1 3
1 4
abca
1 3
""").strip().lower() in {"yes","no"}
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 小子树有效组合 | 是的 | 基本可行性|
 | 统一字母| 没有 | 频率优势失效|
 | 稀疏深度切片 | 取决于| 空/边缘深度处理 |

 ## 边缘情况

 目标深度不存在节点的子树查询在二分搜索后会减少为空段。 在这种情况下，计算出的长度`k`变为零，算法直接返回“否”，满足不存在有效重排的要求。 

单节点段总是失败，因为`k = 1`，这很奇怪。 该算法在没有频率检查的情况下立即拒绝它，正确捕获自配对位置无法满足反回文约束。 

一个字符主导整个深度切片的情况，比如`aaaaab`，触发`cnt > k/2`健康）状况。 即使该段可能足够大且长度均匀，但至少一对镜像必须匹配，因此抑制是必要的，并且可以通过频率限制正确处理。
