---
title: "CF 102201F - 果树"
description: "我们有一棵树，每个顶点都分配了一种水果类型。 对于每个查询，两个顶点 s 和 e 定义了唯一的路径，我们必须确定该路径上出现的某种水果类型是否严格多于所有其他顶点的总和。 如果存在这样的类型，我们就打印它。"
date: "2026-08-18T10:25:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102201
codeforces_index: "F"
codeforces_contest_name: "Moscow Pre-Finals Workshop 2019. KAIST Contest"
rating: 0
weight: 102201
solve_time_s: 331
verified: true
draft: false
---

[CF 102201F - 果树](https://codeforces.com/problemset/problem/102201/F)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树，每个顶点都分配了一种水果类型。 对于每个查询，两个顶点`s`和`e`定义一条唯一的路径，我们必须确定该路径上出现的某种水果类型是否严格多于所有其他顶点的总和。 如果存在这样的类型，我们就打印它。 否则我们打印`-1`。 官方的限制允许两者`N`和`Q`达到`250000`，时间限制为 3 秒，内存为 1024 MB。 

关键的难点是查询的对象是树路径而不是数组中的连续区间。 路径可以包含`O(N)`顶点，并且可以有`O(N)`查询，因此明确地走每条路径可能需要`O(NQ)`运营。 和`N = Q = 250000`，大致就是`6.25 * 10^10`顶点访问，远远超出了几秒钟的时间。 我们需要接近的预处理`O(N log N)`和一个接近的查询`O(log N)`。 

有几种边界情况很容易处理不当。 首先，由一个顶点组成的路径总是占多数。 例如，```
1 1
7
1 1
```有输出```
7
```仅检查长度至少为 2 的路径的解决方案将错误地打印`-1`。 

其次，平等还不够。 为了```
3 1
1 2 1
1 2
2 3
1 3
```该路径包含`1, 2, 1`，所以答案是`1`。 但对于```
4 1
1 2 1 2
1 2
2 3
3 4
1 4
```计数是`2`和`2`，所以答案是`-1`。 粗心的实现使用`>= half`会错误地报告多数。 

第三，最低共同祖先属于路径，并且必须恰好计数一次。 例如，```
3 1
1 2 1
1 2
1 3
2 3
```有路径`2 -> 1 -> 3`，其水果类型是`2, 1, 1`，所以答案是`1`。 将 LCA 减去两次而不将其加回来的路径公式将只出现一次`1`并产生错误的结果。 

## 方法

 直接解决方案很简单。 对于每个查询，找到两个端点的LCA，并从两个端点向上走，直到到达LCA。 步行时，计算字典中的水果类型，然后检查其中一个计数是否大于路径长度的一半。 这是正确的，因为路径上的每个顶点都被访问过一次。 

问题是最坏情况下的操作计数。 考虑一棵树，它只是一条链，并且查询其端点是该链的两端。 每个查询访问`N`顶点。 和`Q = 250000`和`N = 250000`，这可以达到约`6.25 * 10^10`顶点操作，甚至在考虑字典操作和 LCA 计算之前。 蛮力之所以有效，是因为它明确地获得了路径的完整频率分布，但它失败了，因为可能会一次又一次地遍历相同的长路径。 

有用的观察是树是静态的。 树的根位于顶点`1`。 对于每个顶点`u`，想象一个包含从根到路径上的所有水果类型的频率表`u`。 如果我们可以为每个存储该表`u`，任意路径上水果类型的频率可以通过组合四个根到顶点表来获得。 

持久线段树准确地给出了这些表，而无需复制整个频率数组。 版本属于`u`是从属于的版本获得的`parent[u]`通过增加计数`color[u]`。 一次更新仅创建`O(log N)`新的线段树节点，因此所有根到顶点版本都需要`O(N log N)`内存和构建时间。 

认为`w = LCA(u, v)`和`p = parent[w]`。 路径的频率分布`u -> v`是```
root[u] + root[v] - root[w] - root[p].
```的减法`root[w]`和`root[p]`删除 LCA 上方的每个顶点并保留 LCA 本身一次。 这与用于树路径频率查询的持久树思想相同，并且特定的果树问题通常归类为持久线段树解决方案。 

还有一个观察结果消除了单独的候选人验证过程的需要。 假设整个路径有长度`L`，其多数类型出现`M > L/2`次。 将色域分成两半。 包含多数类型的一半必须包含多于`L/2`顶点。 因此，当沿线段树下降时，如果左半部分包含超过一半的当前路径顶点，则大多数顶点一定在那里。 否则，如果右半部分包含一半以上，那么它一定存在。 如果任何一半都没有超过一半，则不存在多数。 

选择包含多数的一半后，同样的论点递归地适用。 我们达到一种颜色后`O(log N)`水平。 这提供了精确的、确定性的查询，而不是随机的候选搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(NQ)`最坏的情况|`O(N)`| 太慢了 |
 | 最佳|`O(N log N + Q log N)`|`O(N log N)`| 已接受 |

 ## 算法演练

 1. 以顶点为树根`1`并计算`parent[u]`和`depth[u]`对于每个顶点。 父关系为我们提供了持久线段树所需的根到顶点路径，而深度则用于计算 LCA。 
2. 为父母搭建二元升降桌。`up[k][u]`存储`2^k`的第一个祖先`u`。 二元提升让我们发现`LCA(u, v)`在`O(log N)`时间而不是穿过树。 
3. 构建持久线段树版本`root[u]`对于每个顶点。 版本`root[u]`表示从顶点开始的路径上每种水果类型的频率`1`到`u`。 开始于`root[parent[u]]`, 插入出现一次`color[u]`。 
4. 查询`(u, v)`, 计算`w = LCA(u, v)`并让`p = parent[w]`。 查询路径上每种水果类型的频率由四个持久根表示`root[u]`,`root[v]`,`root[w]`， 和`root[p]`。 
5. 计算总路径长度为`depth[u] + depth[v] - 2 * depth[w] + 1`。 这`+1`说明 LCA 本身。 
6、从色段树的根部开始，其区间为`[1, N]`。 计算查询路径上有多少个顶点的颜色位于左半部分。 这是通过添加左孩子计数来获得的`root[u]`和`root[v]`并从中减去相应的计数`root[w]`和`root[p]`。 
7. 如果左半计数大于总路径长度的一半，则下降到左子节点。 否则，计算右半计数。 如果右半计数大于一半，则下降到右孩子。 如果双方都不超过一半，则查询的路径没有多数，所以返回`-1`。 
8. 重复下降，直到该段包含单一颜色。 该颜色是唯一可能的多数，并且因为每个决定都是基于查询路径中的确切频率，所以打印它是安全的。 

线段树下降期间的不变性是，每当我们继续进入子级时，该子级都包含当前线段表示的所有顶点的一半以上。 真正的多数必须在每个级别都满足此属性，因为它的整个计数位于包含其颜色的子项内。 如果两个孩子都没有超过一半，则任何一个孩子中的任何一种颜色都不能拥有超过一半的路径。 因此，当之前的每个决定都有效时，在叶子上，幸存的颜色就占了多数。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    input = sys.stdin.buffer.readline

    n, q = map(int, input().split())
    color = [0] + list(map(int, input().split()))

    graph = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a, b = map(int, input().split())
        graph[a].append(b)
        graph[b].append(a)

    # Root the tree at 1.
    parent = array('i', [0]) * (n + 1)
    depth = array('i', [0]) * (n + 1)

    # root[u] is the persistent segment-tree root for root -> u.
    root = array('i', [0]) * (n + 1)

    # Every insertion creates at most bit_length(n) + 1 nodes.
    max_nodes = n * (n.bit_length() + 1) + 5

    left = array('i', [0]) * max_nodes
    right = array('i', [0]) * max_nodes
    count = array('i', [0]) * max_nodes

    nodes = 0

    def update(previous, pos):
        nonlocal nodes

        # Clone the root of the previous version.
        nodes += 1
        new_root = nodes
        left[new_root] = left[previous]
        right[new_root] = right[previous]
        count[new_root] = count[previous] + 1

        old = previous
        cur = new_root
        lo = 1
        hi = n

        while lo < hi:
            mid = (lo + hi) >> 1

            if pos <= mid:
                old_child = left[old]

                nodes += 1
                new_child = nodes

                left[new_child] = left[old_child]
                right[new_child] = right[old_child]
                count[new_child] = count[old_child] + 1

                left[cur] = new_child

                old = old_child
                cur = new_child
                hi = mid
            else:
                old_child = right[old]

                nodes += 1
                new_child = nodes

                left[new_child] = left[old_child]
                right[new_child] = right[old_child]
                count[new_child] = count[old_child] + 1

                right[cur] = new_child

                old = old_child
                cur = new_child
                lo = mid + 1

        return new_root

    # Build parent/depth and persistent roots in one DFS.
    stack = [1]

    while stack:
        u = stack.pop()

        root[u] = update(root[parent[u]], color[u])

        for v in graph[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            depth[v] = depth[u] + 1
            stack.append(v)

    # Binary lifting table.
    log = n.bit_length()
    up = [parent]

    for k in range(1, log):
        prev = up[-1]
        cur = array('i', [0]) * (n + 1)

        for u in range(1, n + 1):
            cur[u] = prev[prev[u]]

        up.append(cur)

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a

        diff = depth[a] - depth[b]
        bit = 0

        while diff:
            if diff & 1:
                a = up[bit][a]
            diff >>= 1
            bit += 1

        if a == b:
            return a

        for k in range(log - 1, -1, -1):
            ua = up[k][a]
            ub = up[k][b]
            if ua != ub:
                a = ua
                b = ub

        return parent[a]

    output = []

    for _ in range(q):
        u, v = map(int, input().split())

        w = lca(u, v)
        pw = parent[w]

        total = depth[u] + depth[v] - 2 * depth[w] + 1

        ru = root[u]
        rv = root[v]
        rw = root[w]
        rp = root[pw]

        lo = 1
        hi = n

        while lo < hi:
            mid = (lo + hi) >> 1

            lu = left[ru]
            lv = left[rv]
            lw = left[rw]
            lp = left[rp]

            left_count = (
                count[lu] + count[lv]
                - count[lw] - count[lp]
            )

            if left_count * 2 > total:
                ru = lu
                rv = lv
                rw = lw
                rp = lp
                hi = mid
            else:
                ru = right[ru]
                rv = right[rv]
                rw = right[rw]
                rp = right[rp]
                lo = mid + 1

        # If neither side had a strict majority, the descent could
        # have followed an arbitrary right side. Verify the leaf.
        candidate = lo

        occurrences = (
            count[ru] + count[rv]
            - count[rw] - count[rp]
        )

        if occurrences * 2 > total:
            output.append(str(candidate))
        else:
            output.append("-1")

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```该图被存储为普通的邻接列表，因为只有在树根时才需要每条边。 父数组和深度数组使用紧凑整数数组，这使得 Python 内存使用量能够在最大输入大小下得到控制。 

持久线段树使用三个整数数组。 每个新版本仅克隆沿根到叶路线对应于一种水果类型的节点。 更新是以迭代方式而不是递归方式编写的，因为可能有数百万个持久节点，并且避免数百万个 Python 函数调用会产生重大影响。 

第零个持久节点代表一个空的频率表。 因此，当 LCA 为根时，`parent[w]`为零并且`root[0]`仍然是空版。 这从路径频率公式中删除了特殊情况。 

四根公式是核心实现细节。`root[u]`和`root[v]`包含两个根路径，同时减去`root[w]`和`root[parent[w]]`除 LCA 本身外，两次删除每个根对 LCA 的贡献。 结果计数恰好是频率`u -> v`。 

最后一片叶子再次被检查。 在下降过程中，如果左孩子包含超过一半的路径，我们必须进入它。 如果没有，则右子节点是大多数人唯一可能的位置。 最后的检查还使代码在反复选择本身不包含严格多数的一方后下降到达叶子的情况下变得稳健。 

所有计数最多为`N`，所以普通的Python整数已经足够了。 Python 中不存在整数溢出问题。 

## 工作示例

 官方示例有七个顶点。 它的树包含多种水果类型`1`，并且查询同时使用多数路径和非多数路径。 

对于第一个查询，`1 -> 4`，路径是```
1 -> 3 -> 5 -> 4
```有颜色```
3, 1, 1, 2
```颜色出现的次数不会超过两次，所以答案是`-1`。 

对于第二个查询，`7 -> 2`，路径是```
7 -> 5 -> 3 -> 2
```有颜色```
2, 1, 1, 1
```颜色`1`四次出现三次，所以占大多数。 

| 查询 | 生命周期评估 | 路径颜色 | 总计 | 多数候选人 | 候选人数 | 输出|
 | ---| ---| ---| ---| ---| ---| ---|
 |`1 4`|`1`|`3,1,1,2`| 4 |`1`| 2 |`-1`|
 |`7 2`|`3`|`2,1,1,1`| 4 |`1`| 3 |`1`|
 |`3 3`|`3`|`1`| 1 |`1`| 1 |`1`|
 |`4 7`|`5`|`2,1,1,2`| 4 |`2`| 2 |`-1`|

 第四行显示了为什么平等还不够。 官方实际输出有`2`对于第四个查询，因为路径是`4 -> 5 -> 7`，而不是由错误重建的路径显示的四顶点序列。 它的颜色是`2,1,2`, 给出类型`2`三中出现两次。 这正是必须谨慎处理 LCA 和包含端点的路径公式的原因。 官方示例输出是`-1, 1, 1, 2`。 

一个较小的例子使持久树下降更容易看到：```
5 2
1 2 2 3 2
1 2
2 3
3 4
4 5
1 5
2 4
```第一个路径包含`1,2,2,3,2`。 其总大小为`5`和颜色`2`发生`3`次。 在色域下降过程中，包含颜色的段`2`在每个必要的级别上保留一半以上的路径频率。 

| 查询 | 路径| 总计 | 候选人 | 计数| 结果 |
 | ---| ---| ---| ---| ---| ---|
 |`1 5`|`1,2,2,3,2`| 5 | 2 | 3 |`2`|
 |`2 4`|`2,2,3`| 3 | 2 | 2 |`2`|

 第二个查询也很有用，因为 LCA 是端点。 什么时候`w = 2`，表达式`root[u] + root[v] - root[w] - root[parent[w]]`仍然计算顶点`2`正好一次。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(N log N + Q log N)`| 每个顶点创建`O(log N)`持久节点，每个LCA成本`O(log N)`，并且每个多数查询都会下降`O(log N)`线段树级别 |
 | 空间|`O(N log N)`| 持久线段树有`O(N log N)`节点，而图和二元提升表则使用`O(N log N)`或更少 |

 最大的实例有`250000`顶点和`250000`查询。 对每一条查询路径的线性扫描可以达到数百亿次操作，而持久化构建只执行`O(N log N)`更新并且每个查询仅执行对数工作。 对于持久结构来说，1024 MB 内存限制也异常慷慨，这是合适的，因为大约需要数百万个持久段树节点。 

## 测试用例

 以下测试假设提交的解决方案另存为`solution.py`并暴露了`solve()`函数如上所示。 最大尺寸测试是生成的，而不是按字面意思编写的，因为它的输入将包含数十万行。```python
import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.TextIOWrapper(io.BytesIO(inp.encode()))
        sys.stdout = io.StringIO()
        solution.solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Official sample
sample1 = """\
7 4
3 1 1 2 1 1 2
1 3
7 5
2 3
5 3
5 6
4 5
1 4
7 2
3 3
4 7
"""

assert run(sample1) == " -1".strip() + "\n1\n1\n2", "official sample"

# Minimum-size input.
sample2 = """\
1 3
9
1 1
1 1
1 1
"""

assert run(sample2) == "9\n9\n9", "single vertex"

# All colors equal.
sample3 = """\
5 3
4 4 4 4 4
1 2
2 3
3 4
4 5
1 5
2 4
3 3
"""

assert run(sample3) == "4\n4\n4", "all equal"

# Exact half is not a majority.
sample4 = """\
4 3
1 2 1 2
1 2
2 3
3 4
1 4
1 3
2 4
"""

assert run(sample4) == "-1\n1\n2", "strict majority boundary"

# LCA is an endpoint, and the path is not rooted at either endpoint.
sample5 = """\
5 4
1 2 2 3 2
1 2
2 3
3 4
4 5
1 5
2 4
2 5
3 5
"""

assert run(sample5) == "2\n2\n2\n2", "LCA and endpoint cases"

# Maximum-size generated test.
# A chain makes the tree as deep as possible.
# All colors are distinct, so every path of length > 1 has no majority.
n = 250000
q = 250000

parts = [f"{n} {q}\n"]
parts.append(" ".join(map(str, range(1, n + 1))) + "\n")

for i in range(1, n):
    parts.append(f"{i} {i + 1}\n")

for i in range(q):
    if i & 1:
        parts.append(f"1 {n}\n")
    else:
        parts.append(f"{i + 1} {i + 1}\n")

large_input = "".join(parts)
large_output = run(large_input)

lines = large_output.splitlines()

assert len(lines) == q, "maximum-size query count"

for i, ans in enumerate(lines):
    if i & 1:
        assert ans == "-1", "maximum-size non-majority path"
    else:
        assert ans == str(i + 1), "maximum-size singleton path"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 官方样品|`-1, 1, 1, 2`| 一般树路径和官方行为 |
 | 单顶点|`9`对于每个查询 | 最小大小和包含端点的路径 |
 | 所有颜色均等 |`4`对于每个查询 | 当一种颜色完全占主导地位时，持久性才重要 |
 |`1,2,1,2`链条|`-1,1,2`| 严格大于一半，不大于或等于 |
 | LCA 终点案例 |`2`对于每个查询 | 正确的四根路径公式 |
 | 生成最大情况 | 单一颜色，否则`-1`| 最大限度`N`， 最大限度`Q`、深树和可扩展性|

 ## 边缘情况

 单顶点情况```
1 1
7
1 1
```有`w = 1`,`parent[w] = 0`， 和`total = 1`。 四根表达式变为`root[1] + root[1] - root[1] - root[0]`，只留下一次出现的颜色`7`。 线段树下降达到颜色`7`，其计数为`1`，所以输出是`7`。 

精确一半的情况```
4 1
1 2 1 2
1 2
2 3
3 4
1 4
```有路径颜色`1,2,1,2`。 两种颜色都出现两次，而多数要求计数严格大于`4/2 = 2`。 在线段树下降过程中，两个颜色范围都不能合法地被声明为主导，并且最终的计数检查会拒绝候选颜色范围。 答案是`-1`。 

LCA修正案例```
3 1
1 2 1
1 2
1 3
2 3
```有`w = 1`和`parent[w] = 0`。 路径频率计算如下```
root[2] + root[3] - root[1] - root[0].
```从根到`2`版本包含颜色`1,2`，根到`3`版本包含`1,1`，减去根版本会删除 LCA 的一个重复副本，而减去空版本不会改变任何内容。 结果路径是`2,1,1`，所以颜色`1`有计数`2`答案是`1`。 

端点 LCA 情况通过相同的公式处理。 为了```
5 1
1 2 2 3 2
1 2
2 3
3 4
4 5
2 4
```LCA 是顶点`2`，这也是第一个端点。 路径是`2 -> 3 -> 4`，有颜色`2,2,3`。 公式使用`root[2]`,`root[4]`,`root[2]`， 和`root[1]`正好留下这三个顶点，所以颜色`2`有频率`2`答案是`2`。 

即使一种颜色在全球范围内看起来很常见，非多数情况也可能发生在很长的路径上。 该查询仅考虑其特定路径上的顶点。 持久线段树避免了全局频率与路径频率的混淆，因为每个计数都是由对应于两个端点及其 LCA 的四个版本形成的。 

最后，迭代处理最大可能的深度。 递归 DFS 可以超出 Python 在链上的递归限制`250000`顶点，而实现使用显式堆栈。 持久的线段树更新也是迭代的，使 Python 调用堆栈独立于树深度。
