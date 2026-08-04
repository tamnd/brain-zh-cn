---
title: "CF 102694D - 循环自由流动"
description: "这个问题中的图是一个连通的无向树。 每条边都有一个容量值。 对于每个查询，我们都会被要求提供在特殊规则下可以在两个给定顶点之间发送的最大流量：每个流量单位必须经过完整的路径......"
date: "2026-08-01T23:23:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102694
codeforces_index: "D"
codeforces_contest_name: "AlgorithmsThread Tree Basics Contest"
rating: 0
weight: 102694
solve_time_s: 65
verified: true
draft: false
---

[CF 102694D - 循环自由流](https://codeforces.com/problemset/problem/102694/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这个问题中的图是一个连通的无向树。 每条边都有一个容量值。 对于每个查询，我们都会被要求提供在特殊规则下可以在两个给定顶点之间发送的最大流量：每个流量单位必须经过完整的路径，将该路径上的每条边的容量减少一。 任务是找到可以在两个查询的顶点之间路由的此类单元的最大可能数量。 

输入描述了树的边，然后描述了一系列顶点对。 每对的输出是一个整数，即这两个顶点之间的最大可能流量。 由于该图没有环，因此任意两个顶点之间只有一条路径。 

限制允许最多 300000 个顶点和边，边容量达到 10^9。 探索每个查询的整个路径的解决方案可能会变得太慢，因为查询的数量也可能很大。 在最坏的情况下，每个查询的线性扫描可以达到大约 9 * 10^10 次边缘检查，这远远超出了实际情况。 该解决方案需要预处理，以便在对数时间内回答每个查询。 

主要的边缘情况来自树结构和流的定义。 具有一条边的路径必须直接返回该边的容量。 例如：```
2 1
1 2 7
2
1 2
2 1
```正确的输出是：```
7
7
```仅从编号较小的顶点进行搜索或假设存在方向的粗心实现可能会在反向查询上失败。 

另一种情况是最小容量边缘不靠近任一端点。 考虑：```
4 3
1 2 10
2 3 3
3 4 8
1
1 4
```答案是：```
3
```流量受到中间瓶颈边缘的限制。 仅检查相邻边的方法会错误地返回 10 或 8。 

最后一个重要的情况是非常大的容量。 例如：```
2 1
1 2 1000000000
1
1 2
```答案是：```
1000000000
```该实现必须使用 Python 整数存储容量。 具有固定大小整数类型的语言在这里需要小心。 

## 方法

 直接的方法是通过从一个顶点走到另一个顶点来回答每个查询，找到唯一树路径上的每条边，并取其中的最小容量。 这是正确的，因为一单位流量消耗路径上每条边的一单位容量。 单元总数不能超过最小容量边缘，并且始终可以通过重复使用同一路径来发送多个单元。 

问题是一棵树可以有很长的链。 如果每个查询都询问两个遥远的顶点，则每个查询可能会检查几乎每条边。 由于有 300000 个顶点和许多查询，在最坏的情况下总工作量会变成二次方。 

关键的观察是该图是一棵树，因此每个路径查询都要求沿着唯一的根到节点路径的聚合值。 这允许我们使用二进制提升。 在预处理过程中，对于每个顶点和每个 2 的幂，我们存储其在该距离处的祖先以及跳转到该祖先的最小边容量。 在回答查询时，我们将两个顶点向上提升并组合存储的最小值，直到它们相遇。 

暴力破解之所以有效，是因为答案仅取决于唯一的路径，但会失败，因为它会重复重建路径。 通过观察相同的祖先和路径段被重复使用，我们可以将所有可能的向上运动压缩为对数数量的跳跃。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(n) | O(n) | 太慢了 |
 | 最佳 | O(n log n) 预处理后每个查询的 O(log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 以顶点 1 为树根并运行 DFS。 在遍历过程中，存储每个顶点的深度、其直接父顶点以及将其连接到其父顶点的边的容量。 这将每个路径查询转换为有根树内的移动问题。 
2. 搭建二元升降台。 对于每个顶点和每个跳跃长度 2^k，存储该跳跃后到达的祖先以及该跳跃期间遇到的最小边容量。 存储最小值的原因是答案是瓶颈值，因此组合两个路径段只需要取它们的最小值。 
3. 对于顶点a和b之间的查询，首先确保两个顶点处于相同的深度。 将更深的顶点向上提升为 2 的幂，同时用每次跳跃中看到的最小容量更新当前答案。 
4. 如果均衡深度后顶点不同，则将两个顶点一起从最大跳跃大小提升到零。 每当它们的祖先不同时，将该跳转应用于两个顶点并用两个存储的最小值更新答案。 
5. 在上一步之后，两个顶点都是其最低共同祖先的直接子节点。 包括从每个顶点到其父顶点的最终边，并输出在此过程中收集的最小容量。 

为什么它有效：

 在树中，每个查询路径可以分为从第一个顶点到最低公共祖先的向上段和从第二个顶点到同一祖先的向上段。 二元提升将两个部分分解为两次跳跃的不相交幂。 每个存储的跳转值恰好是该段的最小容量。 对所有已使用的段取最小值即可得到整个路径上的最小容量，这正是最大可能的流量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    graph = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v, w = map(int, input().split())
        graph[u].append((v, w))
        graph[v].append((u, w))

    LOG = n.bit_length()

    up = [[0] * (n + 1) for _ in range(LOG)]
    mn = [[10**18] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1)

    stack = [(1, 0, 10**18)]
    order = []
    while stack:
        v, p, w = stack.pop()
        up[0][v] = p
        mn[0][v] = w
        order.append(v)
        for to, weight in graph[v]:
            if to != p:
                depth[to] = depth[v] + 1
                stack.append((to, v, weight))

    for k in range(1, LOG):
        prev = up[k - 1]
        cur = up[k]
        prev_mn = mn[k - 1]
        cur_mn = mn[k]
        for v in range(1, n + 1):
            parent = prev[v]
            cur[v] = prev[parent]
            cur_mn[v] = min(prev_mn[v], prev_mn[parent])

    def query(a, b):
        ans = 10**18

        if depth[a] < depth[b]:
            a, b = b, a

        diff = depth[a] - depth[b]
        bit = 0
        while diff:
            if diff & 1:
                ans = min(ans, mn[bit][a])
                a = up[bit][a]
            diff >>= 1
            bit += 1

        if a == b:
            return ans

        for k in range(LOG - 1, -1, -1):
            if up[k][a] != up[k][b]:
                ans = min(ans, mn[k][a], mn[k][b])
                a = up[k][a]
                b = up[k][b]

        ans = min(ans, mn[0][a], mn[0][b])
        return ans

    q = int(input())
    out = []
    for _ in range(q):
        a, b = map(int, input().split())
        out.append(str(query(a, b)))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```DFS 部分创建树的有根表示。 迭代堆栈避免了 Python 递归深度问题，因为树可以包含数十万个顶点。 

二元提升结构填充了前一个更高的水平。 如果一个顶点可以跳跃 2^(k-1) 条边两次，那么它就可以跳跃 2^k 条边。 较大跳跃的最小容量是两个较小跳跃中的最小值。 

查询函数首先对齐深度，因为两个顶点只有在处于可比级别后才能在其最低公共祖先处相交。 稍后的同时提升可避免意外移动超过答案点。 最终的父边是单独处理的，因为在循环之后，两个顶点都位于其共同祖先的正下方。 

Python 整数可处理高达 10^9 的容量，而无需担心溢出。 初始值 10^18 充当无穷大，因为每个实际边缘容量都较小。 

## 工作示例

 对于第一个样本：```
2 1
1 2 2768
2
1 2
2 1
```该路径仅包含一条边。 

| 查询 | 深度调节 | 电梯操作| 回答 |
 | --- | --- | --- | --- |
 | 1 到 2 | 将 2 向上移动到 1 | 使用边缘容量 2768 | 2768 | 2768
 | 2 比 1 | 将 2 向上移动到 1 | 使用边缘容量 2768 | 2768 | 2768

 跟踪显示该算法以相同的方式处理两个方向，因为树路径是无向的。 

再举个例子：```
5 4
1 2 10
2 3 4
3 4 8
3 5 6
1
1 5
```唯一路径是1到2到3到5。 

| 查询 | 电梯操作| 收集的能力| 回答 |
 | --- | --- | --- | --- |
 | 1 至 5 | 举起 5 至 3，然后举起 3 至 1 | 6、4、10 | 4 |

 该迹线表明，答案是由路径上的最小边确定的，而不是由任一端点边确定的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + q log n) | O(n log n + q log n) | 预处理构建跳转表，每个查询最多使用 log n 次跳转 |
 | 空间| O(n log n) | O(n log n) | 祖先和最小容量表存储每个顶点的 log n 值 |

 由于对数因子较小，预处理适合300000个顶点。 每个查询都避免遍历树，从而将总工作量保持在所需的限制内。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    if not data:
        return ""

    it = iter(data)
    n = int(next(it))
    m = int(next(it))

    graph = [[] for _ in range(n + 1)]
    for _ in range(m):
        u = int(next(it))
        v = int(next(it))
        w = int(next(it))
        graph[u].append((v, w))
        graph[v].append((u, w))

    LOG = n.bit_length()
    up = [[0] * (n + 1) for _ in range(LOG)]
    mn = [[10**18] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1)

    stack = [(1, 0, 10**18)]
    while stack:
        v, p, w = stack.pop()
        up[0][v] = p
        mn[0][v] = w
        for to, weight in graph[v]:
            if to != p:
                depth[to] = depth[v] + 1
                stack.append((to, v, weight))

    for k in range(1, LOG):
        for v in range(1, n + 1):
            up[k][v] = up[k - 1][up[k - 1][v]]
            mn[k][v] = min(mn[k - 1][v], mn[k - 1][up[k - 1][v]])

    def query(a, b):
        ans = 10**18
        if depth[a] < depth[b]:
            a, b = b, a
        d = depth[a] - depth[b]
        k = 0
        while d:
            if d & 1:
                ans = min(ans, mn[k][a])
                a = up[k][a]
            d >>= 1
            k += 1
        if a == b:
            return ans
        for k in range(LOG - 1, -1, -1):
            if up[k][a] != up[k][b]:
                ans = min(ans, mn[k][a], mn[k][b])
                a = up[k][a]
                b = up[k][b]
        return min(ans, mn[0][a], mn[0][b])

    q = int(next(it))
    ans = []
    for _ in range(q):
        ans.append(str(query(int(next(it)), int(next(it)))))
    return "\n".join(ans)

assert run("""2 1
1 2 2768
2
1 2
2 1
""") == "2768\n2768", "sample 1"

assert run("""5 4
4 2 10348
1 4 2690
5 4 9807
3 4 8008
5
5 4
1 5
5 4
5 4
1 5
""") == "9807\n2690\n9807\n9807\n2690", "sample 2"

assert run("""2 1
1 2 1
3
1 2
2 1
1 2
""") == "1\n1\n1", "minimum tree"

assert run("""4 3
1 2 10
2 3 3
3 4 8
2
1 4
2 4
""") == "3\n3", "middle bottleneck"

assert run("""3 2
1 2 1000000000
2 3 1000000000
2
1 3
2 3
""") == "1000000000\n1000000000", "large capacities"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 具有一条边的两个顶点 | 1 | 最小尺寸的树木处理 |
 | 中边小长链 | 3 | 瓶颈检测|
 | 大容量| 1000000000 | 整数处理 |
 | 反向查询| 两个方向的值相同 | 无向路径处理 |

 ## 边缘情况

 单边树由提升步骤本身处理。 对于输入：```
2 1
1 2 7
1
2 1
```更深的顶点被提升一次，存储的最小值变为7，查询返回7。叶顶点不需要特殊情况。 

对于隐藏的瓶颈：```
4 3
1 2 10
2 3 3
3 4 8
1
1 4
```该算法将路径分割为二进制跳转。 一次跳跃包含容量 3 的边缘，另一次跳跃包含容量 8 的边缘，最终答案是所有收集值中的最小值。 它返回 3，与实际最大流量匹配。 

对于大容量：```
2 1
1 2 1000000000
1
1 2
```存储的值是Python整数，因此容量被准确保留。 初始无穷大值也大于任何可能的答案，防止在处理真实边缘之前意外减小。
