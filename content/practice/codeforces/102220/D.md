---
title: "CF 102220D - 数据结构硕士"
description: "我们有一棵树，其顶点以零值开始。 每个事件要么更改一个简单路径的每个顶点上的值，要么要求在这样的路径上进行聚合。"
date: "2026-08-17T22:32:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102220
codeforces_index: "D"
codeforces_contest_name: "The 13th Chinese Northeast Collegiate Programming Contest"
rating: 0
weight: 102220
solve_time_s: 360
verified: true
draft: false
---

[CF 102220D - 数据结构硕士](https://codeforces.com/problemset/problem/102220/D)

 **评级：** -
 **标签：** -
 **求解时间：** 6m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树，其顶点以零值开始。 每个事件要么更改一个简单路径的每个顶点上的值，要么要求在这样的路径上进行聚合。 这些更新是故意混合的：加法是普通算术，异或是按位计算，减法是有条件的，因为小于减法量的值必须保持不变。 查询要求路径总和、路径异或、最大值和最小值之间的差，或者路径上最接近给定整数的值。 

输入最多包含五个测试用例。 一棵树可能包含 500,000 个顶点，而只有 2,000 个事件。 这种不对称性是关键的限制。 该树太大，无法扫描每个事件。 直接实现每个事件可以触及 500,000 个顶点，在最坏的情况下提供大约 1,000,000,000 个顶点操作。 尽管 2,000 很小，但还不足以弥补 500,000 的影响。 另一方面，2,000 个事件足够小，以至于可以几乎直接处理仅包含几千个仔细选择的树顶点的结构。 

有几种容易被忽略的边界情况。 第一个是不应该执行任何操作的减法。 例如，```
1
1 2
1 1 1 5
3 1 1 7
4 1 1
```第一次运算后该值变为 5，并且忽略 7 的减法，因为 5 小于 7。正确的输出是`5`。 粗心的实现使用`max(0, w-k)`会意外地产生零，这不是指定的操作。 

第二种情况是对偶数个相等值进行异或。 考虑一个二顶点树：```
1
2 2
1 2
1 1 2 5
5 1 2
```两个顶点都变为 5，但是`5 XOR 5 = 0`，所以正确的输出是`0`。 当压缩树边表示多个原始顶点时，XOR 贡献仅取决于该重数是奇数还是偶数。 

第三种情况涉及压缩边缘本身。 在有五个顶点的链上，```
1
5 2
1 2
2 3
3 4
4 5
1 1 5 3
4 1 5
```所有五个顶点都收到 3，所以答案是`15`。 仅包含顶点 1 和 5 的虚拟树将具有一条边，但该边也代表三个内部顶点。 忽略那些省略的顶点将错误地返回 6 而不是 15。 

## 方法

 最简单的解决方案存储每个树顶点的当前值。 对于更新，找到其两个端点之间的路径并访问该路径上的每个顶点。 对于查询，访问相同的路径并计算请求的聚合。 这是正确的，因为每个事件都是根据一条简单路径上的顶点直接定义的。 

问题是最坏的情况。 一条路径可以包含全部 500,000 个顶点，并且可以有 2,000 个事件。 因此，暴力实现可以执行大约

 [
 500000 \乘以2000 = 10^9
 ]

 顶点访问。 的大值`n`排除这一点。 

有用的观察结果是端点集很小。 所有事件中只有`2m`端点顶点，最多 4,000 个`m = 2000`。 我们可以构建一个虚拟树，其中包含每个端点以及连接它们所需的每个 LCA。 一棵虚拟树最多有`4m`顶点，所以这里最多有 8,000 个。 相同的压缩策略是针对该问题已发布的解决方案的中心思想。 

有一个微妙之处。 我们不能简单地丢弃两个虚拟树顶点之间的原始顶点。 假设虚拟树包含一条边`a`到`b`，但原始树路径来自`a`到`b`有十个内部顶点。 每个相关路径要么使用整个链，要么根本不使用它，因为没有端点或所需的 LCA 严格位于链内部。 因此，所有这些内部顶点始终具有相同的值。 我们可以存储整个压缩链的一个值及其顶点数。 

虚拟树顶点存储该原始顶点的值。 虚拟树边存储相应原始树链上所有省略的内部顶点共享的值。 然后，可以通过将虚拟树父级爬向其 LCA 来处理两个端点之间的路径。 每个虚拟边都被访问一次，而不是为其代表的每个原始顶点访问一次。 

这两种方法可以总结如下。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 虚拟树| O(n log n + m²) | O(n log n + m²) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 以顶点 1 为原始树的根并计算`parent`,`depth`、DFS 顺序和子树大小。 DFS 顺序与子树大小一起让我们测试一个顶点是否是另一个顶点的祖先，这是构建虚拟树时所需要的。 
2.为祖先建造一个二元升降台。 这给出了`LCA(u, v)`时间复杂度为 O(log n)，这在创建虚拟树和处理单个事件时都需要。 
3. 在执行任何事件之前读取所有事件。 收集每个事件的两个端点。 最多有`2m`因此，即使原始树有 500,000 个顶点，树的完整相关部分也很小。 
4. 按 DFS 顺序对不同端点进行排序。 对于按该顺序的每两个连续端点，计算它们的 LCA 并将其添加到相关的顶点集。 还要添加根。 再次排序并删除重复项后，这些顶点恰好形成虚拟树所需的关键顶点。 
5. 用栈构造虚拟树。 按 DFS 顺序处理关键顶点。 堆栈代表当前的虚拟祖先链。 对于每个新顶点，弹出顶点直到堆栈顶部是新顶点的祖先，然后使该顶部成为虚拟父顶点。 
6. 对于子节点的每个虚拟树边`x`到它的虚拟父级`p`，存储两条信息。 子顶点`x`有自己的值，而边则严格存储其之间原始顶点的值`p`和`x`。 他们的计数是

 [
 深度[x]-深度[p]-1。 
]

 计数可以为零，在这种情况下，边没有遗漏的顶点。 

1. 通过查找端点的 LCA 来处理更新。 通过虚拟父母从每个端点爬向 LCA。 每个被访问的虚拟顶点都会收到更新，并且每个相应的压缩边也会收到更新。 最后，将更新应用到 LCA 本身。 
2. 对于查询，执行相同的两次爬升。 对于遇到的每个虚拟顶点，包含其值的一份副本。 对于每个压缩边，包含其存储的重数值`depth[x] - depth[parent[x]] - 1`。 总和乘以该重数，仅当重数为奇数时才包括 XOR，并且最小值、最大值和距离`k`计算使用存储的值一次，因为每个表示的顶点都具有相同的值。 
3. 对于查询类型 4，返回累计总和。 对于类型 5，返回累积的 XOR。 对于类型 6 返回`maximum - minimum`。 对于类型 7，返回最小绝对差值`k`。 

**为什么它有效。** 考虑来自的任何压缩虚拟树边缘`p`到`x`。 通过构造，没有端点或所需的 LCA 严格位于来自`p`到`x`。 其端点来自收集的端点集的每个事件路径必须包含整个内部链或不包含任何内部链。 因此，该链上的所有内部顶点始终经历完全相同的更新序列，因此它们始终具有一个共同的值。 虚拟顶点值单独表示每个关键原始顶点，而每个压缩边表示其所有省略的内部顶点及其精确的重数。 因此，每个路径操作都应用于与未压缩树中完全相同的原始顶点，并且每个查询都聚合完全相同的顶点。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    t = int(input())
    output = []

    for _ in range(t):
        n, m = map(int, input().split())

        head = array('i', [-1]) * (n + 1)
        to = array('i', [0]) * (2 * (n - 1))
        nxt = array('i', [0]) * (2 * (n - 1))
        edge_count = 0

        for _ in range(n - 1):
            u, v = map(int, input().split())

            to[edge_count] = v
            nxt[edge_count] = head[u]
            head[u] = edge_count
            edge_count += 1

            to[edge_count] = u
            nxt[edge_count] = head[v]
            head[v] = edge_count
            edge_count += 1

        parent = array('i', [0]) * (n + 1)
        depth = array('i', [0]) * (n + 1)
        tin = array('i', [0]) * (n + 1)
        order = array('i')

        stack = [1]
        timer = 0

        while stack:
            x = stack.pop()
            timer += 1
            tin[x] = timer
            order.append(x)

            e = head[x]
            while e != -1:
                y = to[e]
                if y != parent[x]:
                    parent[y] = x
                    depth[y] = depth[x] + 1
                    stack.append(y)
                e = nxt[e]

        size = array('i', [1]) * (n + 1)
        for x in reversed(order):
            p = parent[x]
            if p:
                size[p] += size[x]

        log = n.bit_length()
        up = [parent]

        for _ in range(1, log):
            prev = up[-1]
            cur = array('i', [0]) * (n + 1)
            for i in range(1, n + 1):
                cur[i] = prev[prev[i]]
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

            for j in range(log - 1, -1, -1):
                ua = up[j][a]
                ub = up[j][b]
                if ua != ub:
                    a = ua
                    b = ub

            return parent[a]

        operations = []
        endpoints = []

        for _ in range(m):
            parts = list(map(int, input().split()))
            typ, u, v = parts[0], parts[1], parts[2]
            k = parts[3] if len(parts) == 4 else 0

            operations.append((typ, u, v, k))
            endpoints.append(u)
            endpoints.append(v)

        critical = sorted(set(endpoints), key=tin.__getitem__)

        extra = []
        for i in range(1, len(critical)):
            extra.append(lca(critical[i - 1], critical[i]))

        virtual_nodes = sorted(
            set(critical + extra + [1]),
            key=tin.__getitem__
        )

        def is_ancestor(a, b):
            return tin[a] <= tin[b] < tin[a] + size[a]

        vparent = [0] * (n + 1)
        edge_id = [0] * (n + 1)

        edge_value = [0]
        vstack = []

        for x in virtual_nodes:
            if not vstack:
                vstack.append(x)
                continue

            while not is_ancestor(vstack[-1], x):
                vstack.pop()

            p = vstack[-1]
            vparent[x] = p
            edge_id[x] = len(edge_value)
            edge_value.append(0)

            vstack.append(x)

        value = [0] * (n + 1)

        def change(x, k, typ):
            if typ == 1:
                return x + k
            if typ == 2:
                return x ^ k
            if x >= k:
                return x - k
            return x

        for typ, u, v, k in operations:
            if typ <= 3:
                a = lca(u, v)

                x = u
                while x != a:
                    value[x] = change(value[x], k, typ)
                    e = edge_id[x]
                    edge_value[e] = change(edge_value[e], k, typ)
                    x = vparent[x]

                x = v
                while x != a:
                    value[x] = change(value[x], k, typ)
                    e = edge_id[x]
                    edge_value[e] = change(edge_value[e], k, typ)
                    x = vparent[x]

                value[a] = change(value[a], k, typ)
                continue

            a = lca(u, v)

            total_sum = 0
            total_xor = 0
            maximum = -1
            minimum = 10**30
            closest = 10**30

            x = u
            while x != a:
                cur = value[x]

                total_sum += cur
                total_xor ^= cur
                if cur > maximum:
                    maximum = cur
                if cur < minimum:
                    minimum = cur
                d = abs(cur - k)
                if d < closest:
                    closest = d

                p = vparent[x]
                cnt = depth[x] - depth[p] - 1

                if cnt:
                    cur = edge_value[edge_id[x]]
                    total_sum += cnt * cur

                    if cnt & 1:
                        total_xor ^= cur

                    if cur > maximum:
                        maximum = cur
                    if cur < minimum:
                        minimum = cur

                    d = abs(cur - k)
                    if d < closest:
                        closest = d

                x = p

            x = v
            while x != a:
                cur = value[x]

                total_sum += cur
                total_xor ^= cur
                if cur > maximum:
                    maximum = cur
                if cur < minimum:
                    minimum = cur
                d = abs(cur - k)
                if d < closest:
                    closest = d

                p = vparent[x]
                cnt = depth[x] - depth[p] - 1

                if cnt:
                    cur = edge_value[edge_id[x]]
                    total_sum += cnt * cur

                    if cnt & 1:
                        total_xor ^= cur

                    if cur > maximum:
                        maximum = cur
                    if cur < minimum:
                        minimum = cur

                    d = abs(cur - k)
                    if d < closest:
                        closest = d

                x = p

            cur = value[a]
            total_sum += cur
            total_xor ^= cur

            if cur > maximum:
                maximum = cur
            if cur < minimum:
                minimum = cur

            d = abs(cur - k)
            if d < closest:
                closest = d

            if typ == 4:
                output.append(str(total_sum))
            elif typ == 5:
                output.append(str(total_xor))
            elif typ == 6:
                output.append(str(maximum - minimum))
            else:
                output.append(str(closest))

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```邻接结构使用三个紧凑整数数组而不是 Python 列表列表。 这很重要，因为原始树可以包含 500,000 个顶点和近一百万个有向邻接条目。 这些阵列使内存占用量大大减少。 

最初的 DFS 是迭代的而不是递归的。 一棵树可以是长度为 500,000 的单链，这将超出 Python 的正常递归限制，并且还会使递归 Python 调用变得不必要的昂贵。 

这`parent`,`depth`,`tin`， 和`size`数组足以确定祖先。 对于顶点`a`和`b`,`a`是的祖先`b`恰好在什么时候`tin[a] <= tin[b] < tin[a] + size[a]`。 子树占据 DFS 顺序的一个连续区间。 

二进制提升存储在`array('i')`因为 500,000 个顶点乘以大约 19 个级别大约有一千万个祖先条目。 普通的 Python 整数矩阵会消耗更多的内存。 

虚拟树仅构建一次，因为每个事件在执行之前都是已知的。 这是较小值的一个主要优点`m`。 这`vparent`数组从每个虚拟顶点指向其虚拟父节点，而`edge_id[x]`识别紧邻上方的压缩边缘`x`。 

值数组按原始顶点编号进行索引，但只有虚拟顶点才会收到非零值。 压缩的边值被单独存储，因为一条边可能表示许多原始顶点，并且这些顶点不能与子虚拟顶点表示的端点混淆。 

对于减法，比较是`x >= k`， 不是`x > k`。 什么时候`x == k`，结果值为零。 什么时候`x < k`，值保持不变。 

对于 XOR 查询，压缩边包含`cnt`当相同的值贡献该值时`cnt`是奇数并且贡献为零`cnt`是均匀的。 这正是重复异或的奇偶性。 

Python 整数具有任意精度，因此潜在的大路径和不需要显式 64 位处理。 C++ 实现需要 64 位整数类型，但 Python 的整数表示形式已经可以处理所需的范围。 

## 工作示例

 对于提供的示例，语句中显示的输入代表一个测试用例。 包括测试用例计数后，它是：```
1
5 8
5 2
5 1
2 4
2 3
1 4 4 5
3 4 4 1
2 3 1 4
6 3 5
4 2 5
5 1 3
6 5 4
7 1 4 2
```该树是一个链状结构，顶点 2 连接到 3 和 4，顶点 5 连接到 2 和 1。 

| 活动 | 路径| 事件后的值 | 回答 |
 | --- | --- | --- | --- |
 |`1 4 4 5`|`{4}`|`w4 = 5`| |
 |`3 4 4 1`|`{4}`|`w4 = 4`| |
 |`2 3 1 4`|`{3,2,5,1}`|`w1=w2=w3=w4=w5=4`| |
 |`6 3 5`|`{3,2,5}`| 所有三个值均为 4 |`0`|
 |`4 2 5`|`{2,5}`| 两个值都是 4 |`8`|
 |`5 1 3`|`{1,5,2,3}`| 四个值为 4 |`0`|
 |`6 5 4`|`{5,2,4}`| 所有三个值均为 4 |`0`|
 |`7 1 4 2`|`{1,5,2,4}`| 所有四个值均为 4 |`2`|

 因此输出是`0`,`8`,`0`,`0`， 和`2`。 该跟踪表明，XOR 更新可以完全消除早期算术更新所产生的区别，因此数据结构必须存储实际的当前值，而不是尝试总结操作的历史记录。 

对于第二个示例，请考虑：```
1
3 6
1 2
2 3
1 1 3 5
2 2 3 3
3 1 2 6
4 1 3
5 1 3
7 1 3 4
```状态的演变如下。 

| 活动 | 路径| 事件后的值 | 回答 |
 | --- | --- | --- | --- |
 |`1 1 3 5`|`{1,2,3}`|`(5,5,5)`| |
 |`2 2 3 3`|`{2,3}`|`(5,6,6)`| |
 |`3 1 2 6`|`{1,2}`|`(5,0,6)`| |
 |`4 1 3`|`{1,2,3}`|`(5,0,6)`|`11`|
 |`5 1 3`|`{1,2,3}`|`(5,0,6)`|`3`|
 |`7 1 3 4`|`{1,2,3}`|`(5,0,6)`|`1`|

 第三个事件练习条件减法。 顶点 1 的值为 5，小于 6，因此它仍为 5，而顶点 2 则变为 0。 最终查询要求最接近 4 的值，而 5 的距离为 1，因此答案为 1。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + m²) | O(n log n + m²) | 二元提升需要 O(n log n)，而每个 O(m) 事件最多遍历 O(m) 个虚拟顶点 |
 | 空间| O(n log n) | O(n log n) | 二叉提升表在紧凑树数组中占主导地位 |

 最多有`2m`原始端点和排序后每个连续对最多一个 LCA，因此虚拟树最多包含约`4m + 1`顶点。 和`m <= 2000`，最多大约有 8,000 个虚拟顶点。 因此，在最坏的情况下，处理所有事件需要大约 1600 万次虚拟树访问，而不是 10 亿次原始树顶点访问。 大的`n`在预处理期间处理一次，而小的`m`控制昂贵的动态部分。 

## 测试用例

 以下测试工具假设提交的解决方案保存为`solution.py`。 最大尺寸情况是生成的，而不是显式写出的，因此它仍然代表完整的约束。```python
import io
import subprocess
import sys

def run(inp: str) -> str:
    result = subprocess.run(
        [sys.executable, "solution.py"],
        input=inp,
        text=True,
        capture_output=True,
        check=True,
    )
    return result.stdout.strip()

sample1 = """\
1
5 8
5 2
5 1
2 4
2 3
1 4 4 5
3 4 4 1
2 3 1 4
6 3 5
4 2 5
5 1 3
6 5 4
7 1 4 2
"""

assert run(sample1) == "0\n8\n0\n0\n2", "sample 1"

sample2 = """\
1
3 6
1 2
2 3
1 1 3 5
2 2 3 3
3 1 2 6
4 1 3
5 1 3
7 1 3 4
"""

assert run(sample2) == "11\n3\n1", "sample 2"

minimum_case = """\
1
1 5
1 1 1 5
3 1 1 7
4 1 1
2 1 1 3
5 1 1
"""

assert run(minimum_case) == "5\n6", "minimum-size and ignored subtraction"

equal_case = """\
1
4 6
1 2
2 3
3 4
1 1 4 7
4 1 4
5 1 4
6 1 4
7 1 4 5
3 1 4 7
"""

assert run(equal_case) == "28\n0\n0\n2", "all-equal values"

compressed_edge_case = """\
1
5 5
1 2
2 3
3 4
4 5
1 1 5 3
4 1 5
3 2 4 2
4 1 5
7 1 5 2
"""

assert run(compressed_edge_case) == "15\n9\n1", "compressed edge multiplicity"

n = 500000
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))
maximum_case = (
    f"1\n{n} 2\n"
    + edges
    + f"\n1 1 {n} 1\n4 1 {n}\n"
)

assert run(maximum_case) == str(n), "maximum-size chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 提供样品1 |`0 8 0 0 2`| 组合算术、XOR、范围、总和和最近值查询 |
 | 样品2 |`11 3 1`| 条件减法和混合查询类型 |
 | 最小尺寸外壳 |`5 6`| 单个顶点和减法`w < k`|
 | 一切平等的情况|`28 0 0 2`| 异或奇偶校验、零范围和最近值计算 |
 | 压缩边缘外壳 |`15 9 1`| 正确删除虚拟树顶点的重数 |
 | 最大尺寸链条|`500000`| 大的`n`包含整个树的路径 |

 ## 边缘情况

 条件减法的情况直接在`change`。 为了```
1
1 2
1 1 1 5
3 1 1 7
4 1 1
```第一个事件后唯一的顶点值为 5。 自从`5 < 7`，第二个事件返回值不变，查询输出`5`。 除非减法量完全等于该值，否则该实现永远不会用零替换该值。 

当查询压缩边时处理 XOR 重数情况。 假设一条边代表四个原始顶点，全部值为 5。代码添加`5`仅当`cnt & 1`是真的。 由于四是偶数，贡献为零，匹配`5 XOR 5 XOR 5 XOR 5 = 0`。 这可以避免将压缩边扩展回其原始顶点。 

压缩边边界情况是通过将每个虚拟顶点与其正下方的内部顶点分离来处理的。 在```
1
5 2
1 2
2 3
3 4
4 5
1 1 5 3
4 1 5
```虚拟树基本上可以由顶点 1 和 5 组成。顶点 1 存储 3，顶点 5 存储 3，虚拟边存储 3（具有多重性）`5 - 1 - 1 = 3`。 查询计算`3 + 3 * 3 + 3 = 15`，完全匹配所有五个原始顶点。 

案例`u = v`还需要小心，因为路径只包含一个顶点。 更新循环自`u`朝向 LCA，但当端点相同时，`u == lca(u, v)`并且两个攀爬循环执行次数为零。 然后 LCA 本身只更新一次。 同样的推理使得单个顶点上的每个查询都返回该顶点的当前值。 

每个事件端点都可以不存在根。 该构造显式地将顶点 1 插入到虚拟树中，以便每个虚拟顶点都有一个明确定义的祖先链。 这不会改变任何事件路径，因为根只是一个结构顶点，除非实际路径经过它。 

最后，压缩边可以具有零个内部顶点。 当原树中两个虚拟顶点相邻时，`depth[x] - depth[parent[x]] - 1`等于零。 该代码仍然分配一个边缘值以实现一致性，但只要其多重性为零，查询和更新逻辑就会跳过它。 这可以防止人为的额外顶点输入任何答案。
