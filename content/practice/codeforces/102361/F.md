---
title: "CF 102361F - 森林计划"
description: "我们有一个无向图，其连接组件都是仙人掌。 我们可以选择任何一组边缘来删除。 删除之后，每个连通分量都必须是一棵树，这相当于说剩余的图必须不包含环。"
date: "2026-08-13T00:12:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102361
codeforces_index: "F"
codeforces_contest_name: "2019 China Collegiate Programming Contest Qinhuangdao Onsite"
rating: 0
weight: 102361
solve_time_s: 84
verified: true
draft: false
---

[CF 102361F - 森林计划](https://codeforces.com/problemset/problem/102361/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个无向图，其连接组件都是仙人掌。 我们可以选择任何一组边缘来删除。 删除之后，每个连通分量都必须是一棵树，这相当于说剩余的图必须不包含环。 

观察仙人掌的有用方法是将其边缘分为两种。 一些边属于一个循环，并且每条这样的边都属于一个循环。 其余边不属于任何循环。 由于仙人掌中的循环不共享边，因此为不同循环做出的决策是独立的。 

假设一个循环包含 (k) 个边。 保留所有 (k) 条边将使该循环保持完整，因此禁止单一选择。 其边的每个其他子集都是有效的，给出

 [
 2^k-1
 ]

 选择。 每个循环之外的边缘可以被删除或保留，提供两种选择。 

如果循环长度为 (c_1,c_2,\ldots,c_t)，并且它们的边总数为

 [
 C=c_1+c_2+\cdots+c_t,
 ]

 那么答案是

 [
 2^{m-C}\prod_{i=1}^{t}(2^{c_i}-1)。 
]

 剩下的任务是有效地找到每个周期及其长度。 

官方给出的问题有(n\le300000)、(m\le500000)，时间限制为1秒，内存限制为1024MB。 重复扫描整个图以获取指数数量的边子集的算法是完全不可行的。 我们需要对图的大小进行本质上的线性运算，或许还需要对模幂进行对数因子。 

有几种边缘情况很容易导致错误的解决方案。 

对于无边图，```
1 0
```答案是`1`。 恰好存在一种可能的移除集，即空集。 假设每个组件都包含一个循环的解决方案可能会意外返回零。 

对于一棵有一条边的树来说，```
2 1
1 2
```答案是`2`。 我们可能会保留边缘或将其移除。 两个结果图都是森林。 只计算打破循环的方法的解决方案可能会回归`1`，忘记非循环边也可以独立移除。 

断开的组件必须单独处理。 为了```
6 6
1 2
2 3
3 1
4 5
5 6
6 4
```有两个独立的三角形，所以答案是

 [
 (2^3-1)^2=7^2=49。 
]

 仅从顶点 1 开始的 DFS 将完全错过第二个组件并返回`7`。 

最后，考虑一个带有桥的循环：```
4 4
1 2
2 3
3 1
3 4
```三角形贡献`7`选择和桥梁的贡献`2`，所以答案是`14`。 将每条边视为属于循环，或者完全忽略非循环边，都会给出错误的结果。 

## 方法

 最直接的方法是枚举 (m) 条边的每个子集。 对于每个子集，保留选定的边并测试生成的图是否是非循环的。 标准的 DFS 或基于 DSU 的检查可以确定在 (O(n+m)) 时间内是否存在循环。 由于有 (2^m) 个子集，因此需要

 [
 O(2^m(n+m))
 ]

 时间。 在最大值 (m=500000) 下，这意味着检查大约 (2^{500000})，大约 (10^{150515}) 个不同的子集。 该方法是正确的，因为它明确地检查了每种可能的删除方案，但搜索空间远远超出了任何实际限制。 

仙人掌的结构给了我们更强有力的观察。 当某个原始循环完全存活时，剩余的图就不能成为森林。 因此，每个原始循环仅施加一个条件：必须移除至少一个边缘。 对于长度为 (k) 的循环，其边的所有 (2^k) 个子集都是可能的，除了一个不删除任何内容的子集（给出 (2^k-1)）。 

循环外的边根本不施加任何限制。 Removing such an edge cannot create a cycle, and keeping it cannot create a cycle because the edge was not part of one in the original graph. 因此，每个这样的边缘都会贡献一个因子`2`。 

剩下的唯一图形问题是识别所有周期长度。 DFS 正是我们所需要的。 在无向 DFS 树中，每个非树边都将一个顶点连接到其祖先之一。 如果当前顶点的深度为(d_u)，祖先的深度为(d_v)，则它们之间的树路径包含(d_u-d_v)条边，非树边闭合一个长度为的环

 [
 d_u-d_v+1。 
]

 仙人掌的生长条件使得这里特别干净。 每个非树边对应一个不同的简单循环，因此计算这些后边可以使每个循环恰好一次。 

暴力方法之所以有效，是因为它显式地检查每个可能的子集，但会失败，因为子集的数量是指数级的。 仙人掌观察将整个问题简化为用一个 DFS 检测周期长度并乘以独立贡献。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^m(n+m))) | (O(n+m)) | 太慢了 |
 | 仙人掌上的 DFS | (O(n+m)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 构建无向图，同时为每个输入边分配边 ID。 该实现使用邻接数组存储图，以便即使两个端点都已被访问，也可以区分无向边与其反向边。 
2. 从每个未指定深度的顶点开始 DFS。 图不一定是连通的，因此从顶点开始进行 DFS`1`是不够的。 
3.指定起始顶点深度`0`。 每当 DFS 发现未访问的顶点时`v`从`u`， 分配`depth[v] = depth[u] + 1`并记住用来到达的边缘`v`作为其父边。 
4. 当检查已经访问过的邻居时`v`的`u`，忽略父边的反向。 如果`depth[v] < depth[u]`， 然后`v`是的祖先`u`，所以这条边是一个闭环的非树边。 
5. 计算周期长度为`depth[u] - depth[v] + 1`。 树路径从`v`到`u`有`depth[u] - depth[v]`边，当前边再加一条。 
6. 将答案乘以 (2^{k}-1)，其中 (k) 是发现的循环长度。 还将 (k) 添加到`cycle_edges`，属于循环的边数。 
7. DFS完成后，正好`m - cycle_edges`边缘位于所有循环之外。 其中每一个都可以独立保留或删除，因此将答案乘以

 [
 2^{m-\text{cycle_edges}}。 
]

 1. 计算 2 的所有幂`n`模数`998244353`在DFS之前。 一个循环不能包含超过`n`edges, so every factor (2^k) can then be obtained in constant time.

 ### 为什么它有效

 考虑该算法产生的任何删除方案。 对于每个原始循环，因子 (2^k-1) 选择其边的子集而不是空的已删除子集，因此该循环的至少一个边被删除。 由于每个原始循环都被破坏，因此没有原始循环保持完整。 

相反，假设移除方案留下了一个循环。 每个剩余的边都存在于原始图中，因此该循环也是原始仙人掌的循环。 该方案将不会从该循环中删除任何边缘，这正是被其 (2^k-1) 因子排除的一个禁止选择。 因此，按照公式计算的每个方案都会留下一片森林。 

DFS 对每个仙人掌周期计数一次。 无向 DFS 中的每个非树边都将一个顶点与祖先连接起来，相应的树路径加上该边形成一个环。 因为仙人掌的每条边至多属于一个简单环，所以两个这样发现的环不能代表同一个边环。 因此，收集到的循环长度恰好说明了所有循环边缘，并且每个剩余边缘确实位于每个循环之外。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def solve():
    n, m = map(int, input().split())

    head = [-1] * n
    to = [0] * (2 * m)
    nxt = [0] * (2 * m)

    edge_ptr = 0

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        to[edge_ptr] = v
        nxt[edge_ptr] = head[u]
        head[u] = edge_ptr
        edge_ptr += 1

        to[edge_ptr] = u
        nxt[edge_ptr] = head[v]
        head[v] = edge_ptr
        edge_ptr += 1

    pow2 = [1] * (n + 1)
    for i in range(1, n + 1):
        pow2[i] = (pow2[i - 1] * 2) % MOD

    depth = [-1] * n
    parent_edge = [-1] * n
    current_edge = [-1] * n

    answer = 1
    cycle_edges = 0

    for root in range(n):
        if depth[root] != -1:
            continue

        depth[root] = 0
        parent_edge[root] = -1
        current_edge[root] = head[root]

        stack = [root]

        while stack:
            u = stack[-1]
            e = current_edge[u]

            if e == -1:
                stack.pop()
                continue

            current_edge[u] = nxt[e]

            if parent_edge[u] != -1 and e == (parent_edge[u] ^ 1):
                continue

            v = to[e]

            if depth[v] == -1:
                depth[v] = depth[u] + 1
                parent_edge[v] = e
                current_edge[v] = head[v]
                stack.append(v)
            elif depth[v] < depth[u]:
                length = depth[u] - depth[v] + 1
                cycle_edges += length
                answer = answer * (pow2[length] - 1) % MOD

    answer = answer * pow2[m - cycle_edges] % MOD
    print(answer)

if __name__ == "__main__":
    solve()
```邻接结构使用`head`,`to`， 和`nxt`而不是每个边的 Python 元组列表。 每个输入边创建两个有向邻接条目，并且这两个条目具有连续的索引。 这就是为什么父边的反转是通过以下方式获得的`parent_edge[u] ^ 1`。 

DFS 是迭代的而不是递归的。 高达`300000`顶点，Python 的默认递归深度对于路径形状的仙人掌来说是不够的，并且增加递归限制仍然会留下递归开销。 明确的`stack`避免了这两个问题。`depth[v] == -1`是未访问的条件。 一旦顶点具有深度，通向较浅顶点的边将被视为后边。 通向更深顶点的边将被忽略，因为它们是 DFS 树边或已处理的非树边的相反方向。 

表达式`depth[u] - depth[v] + 1`是精确的周期长度。 这`+1`很容易被忽略，因为深度差仅计算树边，而当前非树边是闭合循环的最终边。`cycle_edges`存储循环长度的总和，而不是循环数。 由于仙人掌循环是边不相交的，因此这正是禁止被视为独立桥状边的边数。 

模运算在 Python 中是安全的，因为整数具有任意精度。 每次乘法后的显式模数使中间值保持较小并遵循所需的模数`998244353`。 

该实现还从每个未访问的顶点启动 DFS。 这可以处理孤立的顶点和断开的仙人掌组件，没有任何特殊情况。 

## 工作示例

 ### 示例 1

 该图是一个三角形。```
3 3
1 2
2 3
3 1
```DFS可以选择树的边`1-2`和`2-3`。 当它到达边缘时`3-1`, 顶点`1`是顶点的祖先`3`，因此找到一个循环。 

| 当前顶点 | 邻居 | 电流深度| 邻居深度 | 行动| 周期长度|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 0 | -1 | 发现 2 | |
 | 2 | 3 | 1 | -1 | 发现 3 | |
 | 3 | 1 | 2 | 0 | 后缘| 3 |
 | 3 | 2 | 2 | 1 | 父边缘 | |
 | 2 | 1 | 1 | 0 | 父边缘 | |

 循环贡献为

 [
 2^3-1=7。 
]

 所有三个边都属于这个循环，所以`cycle_edges = 3`并且不存在独立的非循环边。 最终的答案是`7`。 

这演示了中心计数规则：三角形边的每个子集都是有效的，除了不删除任何内容的子集。 

### 示例 2

 该图包含两个共享顶点的三角形`2`:```
6 6
1 2
2 3
3 1
2 4
4 5
5 2
```DFS 树可以包含边`1-2`,`2-3`,`2-4`， 和`4-5`。 其余两条边关闭两个单独的循环。 

| 当前顶点 | 邻居 | 电流深度| 邻居深度 | 行动| 周期长度|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 1 | 0 | 树边| |
 | 2 | 3 | 0 | -1 | 发现 3 | |
 | 3 | 1 | 1 | 1 | 回到祖先| 3 |
 | 2 | 4 | 0 | -1 | 发现 4 | |
 | 4 | 5 | 1 | -1 | 发现 5 | |
 | 5 | 2 | 2 | 0 | 回到祖先| 3 |

 有两个周期长度`3`，所以周期因子为

 [
 (2^3-1)(2^3-1)=7\cdot7=49。 
]

 所有六个边都属于这些循环之一，因此不存在独立的边。 答案是`49`。 

共享一个顶点的两个三角形不会干扰彼此的选择，因为它们不共享边。 这正是仙人掌属性所提供的独立性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n+m)) | 每个顶点和邻接条目都会被处理固定次数，并且在 (O(n)) 中预先计算 2 的幂。 |
 | 空间| (O(n+m)) | 邻接数组、DFS 状态、功率表和显式堆栈都使用线性空间。 |

 限制最多允许`300000`顶点和`500000`边缘。 该算法对图进行线性处理，因此避免了对可能的边缘去除方案数量的指数依赖性。 迭代 DFS 还避免了长树状组件上的 Python 递归深度失败。 

## 测试用例```python
import sys
import io

MOD = 998244353

def solve_data(inp: str) -> str:
    data = inp.split()
    it = iter(data)

    n = int(next(it))
    m = int(next(it))

    head = [-1] * n
    to = [0] * (2 * m)
    nxt = [0] * (2 * m)

    ptr = 0

    for _ in range(m):
        u = int(next(it)) - 1
        v = int(next(it)) - 1

        to[ptr] = v
        nxt[ptr] = head[u]
        head[u] = ptr
        ptr += 1

        to[ptr] = u
        nxt[ptr] = head[v]
        head[v] = ptr
        ptr += 1

    pow2 = [1] * (n + 1)
    for i in range(1, n + 1):
        pow2[i] = pow2[i - 1] * 2 % MOD

    depth = [-1] * n
    parent_edge = [-1] * n
    current_edge = [-1] * n

    answer = 1
    cycle_edges = 0

    for root in range(n):
        if depth[root] != -1:
            continue

        depth[root] = 0
        current_edge[root] = head[root]
        stack = [root]

        while stack:
            u = stack[-1]
            e = current_edge[u]

            if e == -1:
                stack.pop()
                continue

            current_edge[u] = nxt[e]

            if parent_edge[u] != -1 and e == (parent_edge[u] ^ 1):
                continue

            v = to[e]

            if depth[v] == -1:
                depth[v] = depth[u] + 1
                parent_edge[v] = e
                current_edge[v] = head[v]
                stack.append(v)
            elif depth[v] < depth[u]:
                length = depth[u] - depth[v] + 1
                cycle_edges += length
                answer = answer * (pow2[length] - 1) % MOD

    answer = answer * pow2[m - cycle_edges] % MOD
    return str(answer)

# Provided samples
assert solve_data(
    """3 3
1 2
2 3
3 1
"""
) == "7", "sample 1"

assert solve_data(
    """6 6
1 2
2 3
3 1
2 4
4 5
5 2
"""
) == "49", "sample 2"

# Minimum-size graph: one isolated vertex.
assert solve_data(
    """1 0
"""
) == "1", "minimum graph"

# A tree with four edges. Every edge is independent, so there are 2^4 schemes.
assert solve_data(
    """5 4
1 2
1 3
1 4
1 5
"""
) == "16", "tree with independent edges"

# One triangle plus one bridge.
assert solve_data(
    """4 4
1 2
2 3
3 1
3 4
"""
) == "14", "cycle plus bridge"

# Two disconnected triangles.
assert solve_data(
    """6 6
1 2
2 3
3 1
4 5
5 6
6 4
"""
) == "49", "disconnected cycles"

# Large boundary case: 300000 vertices, 149999 triangles sharing vertex 1.
# This gives 300000 vertices and 449997 edges.
n = 300000
lines = [f"{n} 449997"]
for i in range(149999):
    a = 2 + 2 * i
    b = a + 1
    lines.append(f"1 {a}")
    lines.append(f"{a} {b}")
    lines.append(f"{b} 1")

large_input = "\n".join(lines) + "\n"
expected = str(pow(7, 149999, MOD))

assert solve_data(large_input) == expected, "large cactus boundary case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0`|`1`| 孤立的顶点和零边|
 | 五角星|`16`| 每条边都在循环之外，可以单独删除 |
 | 三角加一桥|`14`| 正确分离循环边缘和非循环边缘 |
 | 两个不相连的三角形 |`49`| 多个连接组件和独立循环因子 |
 | 300000 顶点仙人掌，有 149999 个三角形 | (7^{149999}\bmod998244353) | 大顶点数、多周期、迭代 DFS 和性能 |

 ## 边缘情况

 对于孤立顶点，输入为```
1 0
```DFS 从顶点开始`1`，指定深度`0`，并立即完成，因为它的邻接表为空。 没有找到循环，所以`cycle_edges = 0`。 最终因子是 (2^0=1)，给出输出`1`。 这正确地计算了空移除集。 

对于一棵树，例如```
5 4
1 2
1 3
1 4
1 5
```每个 DFS 边都是树边，并且没有边将顶点连接到祖先。 因此，答案中没有乘以循环因子。 所有四个边都是外循环，因此最终因子是 (2^4=16)。 该算法正确地允许删除或保留这些边缘的每种组合。 

对于带有桥的三角形，```
4 4
1 2
2 3
3 1
3 4
```DFS检测闭合三角形的后沿并获得周期长度`3`。 它添加了`3`到`cycle_edges`，离开`4-3=1`独立边缘。 答案就变成了

 [
 (2^3-1)2=7\cdot2=14.
 ]

 即使不需要打破循环，桥也可以被移除，这就是为什么它的因子必须保留在公式中。 

对于不相连的三角形，```
6 6
1 2
2 3
3 1
4 5
5 6
6 4
```第一个 DFS 找到一个长度为三的循环，然后外循环到达顶点`4`并启动另一个 DFS，因为它仍未被访问。 第二个 DFS 找到第二个长度为三的循环。 所得乘积为 (7\cdot7=49)。 这说明了为什么所有顶点上的外循环是必要的。 

对于包含许多短循环的大型仙人掌，显式堆栈可以防止递归深度问题。 在149999个三角形的测试中，每个周期都贡献因子`7`，所以答案是 (7^{149999}) 模`998244353`。 DFS 仍然仅处理大约 450000 条边中的每条边恒定次数，从而保留了线性复杂度。
