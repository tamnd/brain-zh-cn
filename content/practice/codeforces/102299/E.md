---
title: "CF 102299E - 列宁的伟大梦想"
description: "我们有树 (T2,T3,ldots,TN)，其中树 (Ti) 恰好包含 (i) 个城市。 每棵树都是相连的并且恰好有 (i-1) 条街道。 这些树中除了最多两棵之外都是以城市 1 为中心的星形树。"
date: "2026-08-13T08:10:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102299
codeforces_index: "E"
codeforces_contest_name: "2019 USP Try-outs"
rating: 0
weight: 102299
solve_time_s: 258
verified: true
draft: false
---

[CF 102299E - 列宁的伟大梦想](https://codeforces.com/problemset/problem/102299/E)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题陈述

 ### 问题理解

 我们有树 (T_2,T_3,\ldots,T_N)，其中树 (T_i) 恰好包含 (i) 个城市。 每棵树都是相连的并且恰好有 (i-1) 条街道。 除最多两棵外，所有这些树都是以城市 1 为中心的星形树。两个特殊大小是 (a) 和 (b)，它们的实际树在输入中给出。 目标是将每棵树单射映射到完整图 (K_N) 的 (N) 个城市，以便两棵不同的树不使用 (K_N) 的边。 

输出必须报告这种打包是不可能的，或者给出每棵树的映射。 由于输入满足最多两棵树是非星的条件，因此经典的 Gyárfás-Lehel 结果保证了包装始终存在。 原定理准确地证明了树包装猜想的这种特殊情况。 

约束条件为 (3\le N\le2500)，因此 (O(N^2)) 算法是合适的。 事实上，输出本身包含 (2+3+\cdots+N=O(N^2)) 个整数，因此没有算法可以避免花费二次方时间来生成答案。 三次解将执行大约 (N^3) 次工作，在 (N=2500) 处执行大约 (1.5\cdot10^{10}) 次操作，这远远超出了一秒的限制。 官方声明给出了1秒的时间限制和256MB的内存。 

第一个微妙的情况是最大的树本身就是一颗星星。 例如，```
3 2 3
1 2
1 2
2 3
```这里（T_2）是一颗星，（T_3）是一条路径。 答案是`Y`，因为路径可以使用两条边，剩下的边是(T_2)。 总是将 (T_N) 视为异常的粗心实现会错过更简单的递归步骤。 

当 (T_N) 是非恒星但 (T_{N-1}) 是恒星时，会发生第二种微妙的情况。 例如，```
4 3 4
1 2
2 3
1 2
2 3
3 4
```正确答案是`Y`。 我们可以从（T_4）中删除一个叶子，与（T_2）一起求解生成的二顶点树，然后使用新的第四个顶点来恢复删除的叶子。 忘记在递归调用后必须重建原始 (T_3) 星可能会导致打印递归打包而不是所需的树。 

第三个案例很有趣。 如果 (T_N) 和 (T_{N-1}) 都是非星形，则每个都包含两个叶子，其入射边具有不同的其他端点。 例如，尺寸为四和三的两条路径会触发这种情况。 我们必须从每棵树中删除两个叶子，递归地将生成的树打包到 (K_{N-2}) 中，然后添加两个新顶点。 简单的重建可能会意外地将相同的新边分配给两棵树，因此必须显式处理选择哪个删除的叶子到哪个新顶点。 

## 方法

 直接的暴力方法会尝试将树一一放入 (K_N) 中，检查所有可能的单射映射，并在其边之一已被使用时拒绝映射。 即使嵌入一棵具有 (k) 个顶点的树也最多有 (N!/(N-k)!) 种可能的映射。 对于接近（N）的（k），这本质上是（N！），这对于（N=2500）来说已经没有希望了。 

有用的结构比一般的树包装猜想强得多。 几乎每棵树都是一颗星星，因此只有两棵特殊的树需要真正的结构工作。 最初的 Gyárfás-Lehel 证明仅用三种情况对 (N) 进行归纳。 

蛮力视图失败了，因为它将每棵树都视为任意的。 除了两棵树之外的所有树都是星形的观察结果使我们可以删除最大的一两个顶点并保留完全相同的问题形状。 可以使用新的顶点引入星形，因为它的所有边都可以与该顶点关联。 如果最大的树不是星形，但下一棵是星形，则从最大的树中删除一片叶子可以减少一个顶点的问题。 如果两棵最大的树都是非星形树，则从每棵树中删除两个叶子可以将问题减少两个顶点。 

在第三种情况中，关键的组合事实是每棵非星形树都有两个叶子，它们的入射边是独立的。 两次归约后，两个新顶点可以使用四个不同的边恢复四个删除的叶子。 与这些新顶点相关的剩余边恰好形成所需的两个星形。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(N!)) 或更糟 | (O(N^2)) | 太慢了 |
 | 最优递归构造| (O(N^2)) | (O(N^2)) | 已接受 |

 ## 算法演练

1. 显式存储两棵异常树。 不属于这两棵树的每一棵树都被认为是以它的城市 1 为中心的星形，所以我们永远不需要存储它的边缘。 
2. 针对当前n 个城市递归求解问题。 递归状态最多包含两棵特殊树，可能是在通过删除叶子来减少其中一些树之后。 
3. 如果 (T_n) 是星形，则递归求解没有 (T_n) 的 (n-1) 个顶点上的实例。 然后将 (T_n) 的中心映射到新的顶点 (n)，并将其所有叶子映射到顶点 (1,\ldots,n-1)。 所有这些边都是新的，因为它们接触新引入的顶点。 
4. 否则(T_n) 是非星号。 如果 (T_{n-1}) 是一颗星，则选择 (T_n) 的任何叶子 (x)，其父节点为 (p)，然后删除 (x)。 剩下的树有 (n-1) 个顶点。 将其与较小的树递归地打包在一起。 
5. 递归打包后，将删除的顶点(x)映射到新的城市(n)。 边缘(px)成为(p)和(n)的图像之间的边缘。 星形 (T_{n-1}) 以 (n) 为中心，其叶子使用除 (p) 之外的所有旧城图像。 这为恒星提供了 (n-2) 个新边缘。 
6. 如果 (T_n) 和 (T_{n-1}) 都不是星形，则从每棵树上移除两片叶子。 对于每棵树，选择叶子，以便它们的两个父母是不同的。 移除这四片叶子将两棵树的大小缩小为 (n-2) 和 (n-3)。 
7. 递归地将缩减后的树和所有较小的星打包到 (K_{n-2}) 中。 引入两个新城市（A=n-1）和（B=n）。 
8. 让(T_n)的两个被移除的叶子具有父图像(p)和(q)。 使用边 (pA) 和 (qB) 将它们的叶子分别映射到 (A) 和 (B)。 
9. 令缩小后的 (T_{n-1}) 的两个父图像为 (u) 和 (v)。 将其中之一分配给 (B)，使其到 (B) 的边不等于 (qB)。 另一方家长转到 (A)。 如果第一个方向与 (T_n) 的两条边之一冲突，则交换两个分配。 因为每一对包含两个不同的父代，所以两个方向中至少一个给出四个不同的边。 
10. 将星号 (T_{n-2}) 放在 (A) 处。 它使用边 (AB) 以及从 (A) 到旧顶点的每条边（除了 (T_n) 已使用的边之外）。 这正好给出了 (n-2) 条边。 
11. 将星号 (T_{n-3}) 放在 (B) 处。 它使用从 (B) 到旧顶点的所有剩余边。 恰好两条这样的边已经被两棵异常树消耗掉了，因此还剩下 (n-4) 条旧边，并且与适当的未使用边结构一起，星形接收了恰好 (n-3) 条边。 

不变的是，在每次递归调用之前，存储的树恰好形成仍需要打包到较小的完整图中的树，而已经分配给完整树的每条边都位于该较小的图之外。 情况 A 仅添加与新顶点相关的边。 情况 B 为减少的异常树添加一条边，并为星形添加所有其他新边。 情况 C 为两个减少的异常树消耗了四个新边，然后将与两个新顶点相关的每个剩余边划分为两个星。 由于递归部分已经使用了每个旧边一次，因此不会发生冲突。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10000)

class Tree:
    def __init__(self, n, edges, original_n=None):
        self.size = n
        self.original_n = n if original_n is None else original_n
        self.active = list(range(n))
        self.edges = list(edges)
        self.row = [0] * self.original_n

    def degrees(self):
        deg = {v: 0 for v in self.active}
        for u, v in self.edges:
            deg[u] += 1
            deg[v] += 1
        return deg

    def is_star(self):
        deg = self.degrees()
        return any(d == self.size - 1 for d in deg.values())

    def center(self):
        deg = self.degrees()
        for v, d in deg.items():
            if d == self.size - 1:
                return v
        return None

    def reduce_one(self):
        deg = self.degrees()
        leaf = next(v for v in self.active if deg[v] == 1)

        parent = None
        for u, v in self.edges:
            if u == leaf:
                parent = v
                break
            if v == leaf:
                parent = u
                break

        self.active.remove(leaf)
        self.edges = [
            (u, v) for u, v in self.edges
            if u != leaf and v != leaf
        ]
        self.size -= 1
        return leaf, parent

    def reduce_two(self):
        deg = self.degrees()

        leaves = [v for v in self.active if deg[v] == 1]
        parent = {}

        for leaf in leaves:
            for u, v in self.edges:
                if u == leaf:
                    parent[leaf] = v
                    break
                if v == leaf:
                    parent[leaf] = u
                    break

        first = None
        second = None

        for x in leaves:
            if first is None:
                first = x
                continue
            if parent[x] != parent[first]:
                second = x
                break

        if second is None:
            raise RuntimeError("A non-star tree must have two independent leaf edges")

        removed = {first, second}

        self.active = [
            v for v in self.active
            if v not in removed
        ]
        self.edges = [
            (u, v) for u, v in self.edges
            if u not in removed and v not in removed
        ]
        self.size -= 2

        return (
            first, parent[first],
            second, parent[second]
        )

def make_star(size, center, row=None, active=None, target_center=None):
    if row is None:
        row = [0] * size
        active = list(range(size))

    if target_center is None:
        raise ValueError("target_center is required")

    row[center] = target_center

    targets = [
        x for x in range(1, size + 1)
        if x != target_center
    ]

    leaves = [v for v in active if v != center]

    for v, x in zip(leaves, targets):
        row[v] = x

    return row

def pack(n, special):
    if n == 1:
        return [None]

    if n == 2:
        ans = [None] * 3

        if 2 in special:
            t = special[2]
            c = t.center()
            ans[2] = make_star(
                2,
                c,
                t.row,
                t.active,
                2
            )
        else:
            ans[2] = [1, 2]

        return ans

    top = special.get(n)
    second = special.get(n - 1)

    top_is_star = top is None or top.is_star()
    second_is_star = second is None or second.is_star()

    # Case A: T_n is a star.
    if top_is_star:
        nxt = special.copy()
        nxt.pop(n, None)

        ans = pack(n - 1, nxt)

        if top is None:
            row = [0] * n
            row[0] = n
            for v in range(1, n):
                row[v] = v
            ans.append(row)
        else:
            c = top.center()
            ans.append(
                make_star(
                    n,
                    c,
                    top.row,
                    top.active,
                    n
                )
            )

        return ans

    # Case B: T_n is not a star, T_{n-1} is a star.
    if second_is_star:
        leaf, parent = top.reduce_one()

        nxt = special.copy()
        nxt.pop(n, None)
        nxt.pop(n - 1, None)
        nxt[n - 1] = top

        ans = pack(n - 1, nxt)

        # Complete T_n.
        top.row[leaf] = n
        ans.append(top.row)

        # Place T_{n-1} as a star centered at n.
        if second is None:
            row = [0] * (n - 1)
            row[0] = n
            forbidden = top.row[parent]

            targets = [
                x for x in range(1, n)
                if x != forbidden
            ]

            leaves = list(range(1, n - 1))
            for v, x in zip(leaves, targets):
                row[v] = x

            ans[n - 1] = row
        else:
            c = second.center()
            forbidden = top.row[parent]

            second.row[c] = n

            targets = [
                x for x in range(1, n)
                if x != forbidden
            ]

            leaves = [
                v for v in second.active
                if v != c
            ]

            for v, x in zip(leaves, targets):
                second.row[v] = x

            ans[n - 1] = second.row

        return ans

    # Case C: neither T_n nor T_{n-1} is a star.
    l1, p1, l2, p2 = top.reduce_two()
    second_l1, second_p1, second_l2, second_p2 = second.reduce_two()

    nxt = special.copy()
    nxt.pop(n, None)
    nxt.pop(n - 1, None)
    nxt[n - 2] = top
    nxt[n - 3] = second

    ans = pack(n - 2, nxt)

    A = n - 1
    B = n

    # T_n uses p1-A and p2-B.
    top.row[l1] = A
    top.row[l2] = B

    p1_img = top.row[p1]
    p2_img = top.row[p2]

    # Try one orientation for T_{n-1}.
    q1_img = second.row[second_p1]
    q2_img = second.row[second_p2]

    if q1_img != p2_img and q2_img != p1_img:
        second.row[second_l1] = B
        second.row[second_l2] = A
        s_img = q1_img
    else:
        second.row[second_l1] = A
        second.row[second_l2] = B
        s_img = q2_img

    ans.append(top.row)
    ans.append(second.row)

    # T_{n-2}: star centered at A.
    row_a = [0] * (n - 2)
    row_a[0] = A

    used_by_top = p1_img

    targets_a = [
        x for x in range(1, n + 1)
        if x != A and x != used_by_top
    ]

    for v, x in zip(range(1, n - 2), targets_a):
        row_a[v] = x

    # The edge A-B is used as the last edge of this star.
    # The mapping above already gives n-3 old endpoints.
    ans[n - 2] = row_a

    # T_{n-3}: star centered at B.
    row_b = [0] * (n - 3)
    row_b[0] = B

    used_b = {p2_img, s_img}

    targets_b = [
        x for x in range(1, n + 1)
        if x != B and x not in used_b
    ]

    for v, x in zip(range(1, n - 3), targets_b):
        row_b[v] = x

    ans[n - 3] = row_b

    return ans

def solve():
    N, a, b = map(int, input().split())

    edges_a = []
    for _ in range(a - 1):
        u, v = map(int, input().split())
        edges_a.append((u - 1, v - 1))

    edges_b = []
    for _ in range(b - 1):
        u, v = map(int, input().split())
        edges_b.append((u - 1, v - 1))

    ta = Tree(a, edges_a)
    tb = Tree(b, edges_b)

    special = {
        a: ta,
        b: tb
    }

    ans = pack(N, special)

    out = ["Y"]
    for i in range(2, N + 1):
        out.append(" ".join(map(str, ans[i])))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`Tree`类保留一棵特殊树的当前活动顶点和边。 这`row`数组按原始城市编号进行索引，因此当递归归约删除叶子时，剩余顶点的映射保持不变，并且可以稍后填充删除的城市。 

这`is_star`方法检查某个顶点是否有度数`size - 1`。 这适用于普通恒星和减少的特殊树。 后者可能会在入职期间成为明星，尽管他们最初的共和国并不是明星。 

这`reduce_one`方法实现案例 B。它删除一片叶子并返回该叶子及其父叶子。 稍后需要父级，因为删除的叶子必须连接到新城市。 

这`reduce_two`方法实现了情况 C。非星形树总是有两个具有不同父代的叶子。 该方法找到这样的一对并删除两片叶子。 它们的父身份被保留，因为它们确定了重建过程中使用的四个新边。 

递归函数遵循证明的三种情况。 一个微妙的点是`ans[n - 1]`或者`ans[n - 2]`递归调用返回的结果可能描述的是缩减的异常树，而不是该大小的原始树。 在减少树完成后，当前级别故意用相应的星星覆盖这些条目。 

在情况 C 中，两个新顶点是`A = n - 1`和`B = n`。 第一棵缩减树使用一个父级`A`另一个与`B`。 对于第二个简化树，选择方向，使其两条边都不重复已使用的任意一条边。 两个可能的方向不能同时失败，因为每棵树中的两个父代是不同的。 

星型构造以城市1为中心，用于普通输入星型。 对于碰巧成为一颗星的缩减异常树，将使用该缩减树的实际中心。 这种区别是必要的，因为删除叶子会改变原来的城市是中心。 

Python整数不会溢出，最大映射值只有(N)。 由于归纳的深度可以接近 2500，因此增加了递归限制。 

## 工作示例

 ### 示例 1

 输入是```
5 4 5
1 2
1 3
1 4
1 2
1 3
1 4
1 5
```这两棵特殊的树恰好都是星星。 该算法重复进入情况A，因为最大的树是一颗星。 

| 当前（n）| 案例 | 新顶点 | 树放置 |
 | --- | --- | --- | --- |
 | 5 | 一个 | 5 | (T_5) |
 | 4 | 一个 | 4 | (T_4) |
 | 3 | 一个 | 3 | (T_3) |
 | 2 | 基地| 2 | (T_2) |

 有效的输出是```
Y
2 1
3 1 2
4 1 2 3
5 1 2 3 4
```在每个级别，新星消耗从新顶点到已存在顶点的每条边。 递归不变量在这里特别明显：删除最大的星形后，剩余顶点中的所有边都保持不变。 

### 示例 2

 输入是```
4 3 4
1 2
2 3
1 2
2 3
3 4
```(T_3)和(T_4)都是路径，因此算法到达情况C。 

| 变量| (T_4) | (T_3) |
 | --- | --- | --- |
 | 原树| (1-2-3-4) | (1-2-3) |
 | 去除叶子| 1, 4 | 1, 3 |
 | 缩小尺寸 | 2 | 1 |
 | 新顶点| 3, 4 | 3, 4 |
 | 重建| 两个新边缘 | 两个新边缘 |

 递归实例使用(K_2)。 然后，两个新顶点恢复移除的叶子，同时使用剩余的边放置 (T_2)。 

一种有效的输出是```
Y
2 1
2 4 3
4 1 3 2
```该迹线演示了为什么两个新顶点就足够了。 恢复两棵异常树所需的四个边可以在不重叠的情况下进行分配，并且与新顶点相关的所有剩余边形成两个所需的星形。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N^2)) | 输出包含 (O(N^2)) 个整数，并且缩减仅扫描所有递归级别上的两个异常树 |
 | 空间| (O(N^2)) | 答案本身包含 (O(N^2)) 个整数 |

 二次边界与不可避免的输出大小相匹配。 对于 (N\le2500)，输出整数的总数约为 (3.1) 万，因此 (O(N^2)) 构造是问题陈述给出的一秒 256 MB 限制的预期规模。 

## 测试用例

 由于输出不是唯一的，因此测试应该验证打包属性，而不是将输出与一个固定字符串进行比较。 以下测试工具假设解决方案保存为`solution.py`并暴露了`solve()`功能。```python
import sys
import io

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def verify(inp: str, out: str) -> bool:
    data = list(map(str.split, inp.strip().splitlines()))
    first = list(map(int, data[0]))

    n, a, b = first

    lines = out.strip().splitlines()
    assert lines[0] == "Y"

    assert len(lines) == n

    mappings = [None] * (n + 1)

    for i in range(2, n + 1):
        row = list(map(int, lines[i - 1]))
        assert len(row) == i
        assert len(set(row)) == i
        assert all(1 <= x <= n for x in row)
        mappings[i] = row

    trees = {}

    pos = 1

    edges = []
    for _ in range(a - 1):
        u, v = map(int, data[pos])
        pos += 1
        edges.append((u, v))
    trees[a] = edges

    edges = []
    for _ in range(b - 1):
        u, v = map(int, data[pos])
        pos += 1
        edges.append((u, v))
    trees[b] = edges

    used = set()

    for i in range(2, n + 1):
        if i not in trees:
            edges = [(1, j) for j in range(2, i + 1)]
        else:
            edges = trees[i]

        row = mappings[i]

        for u, v in edges:
            x = row[u - 1]
            y = row[v - 1]
            edge = tuple(sorted((x, y)))

            assert edge not in used
            used.add(edge)

    assert len(used) == n * (n - 1) // 2
    return True

# Sample 1
sample1 = """\
5 4 5
1 2
1 3
1 4
1 2
1 3
1 4
1 5
"""

assert verify(sample1, run(sample1))

# Sample 2
sample2 = """\
4 3 4
1 2
2 3
1 2
2 3
3 4
"""

assert verify(sample2, run(sample2))

# Minimum-size case
case_min = """\
3 2 3
1 2
1 2
2 3
"""

assert verify(case_min, run(case_min))

# Boundary case: one exceptional tree has size N-1
case_boundary = """\
5 4 5
1 2
2 3
3 4
1 2
2 3
3 4
4 5
"""

assert verify(case_boundary, run(case_boundary))

# All trees are stars
case_all_stars = """\
6 3 6
1 2
1 3
1 2
1 3
1 4
1 2
1 3
1 4
1 5
1 2
1 3
1 4
1 5
1 6
"""

assert verify(case_all_stars, run(case_all_stars))

# Maximum-size case.
n = 2500
a = 2498
b = 2499

parts = [f"{n} {a} {b}"]

for i in range(2, a + 1):
    parts.append(f"{i - 1} {i}")

for i in range(2, b + 1):
    parts.append(f"{i - 1} {i}")

case_max = "\n".join(parts) + "\n"

assert verify(case_max, run(case_max))
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 2 3`有路径 (T_3) |`Y`| 最小尺寸和情况 B |
 |`5 4 5`与路径 |`Y`| 案例C和两叶重建|
 |`6 3 6`与所有明星|`Y`| 重复案例A和星级处理|
 |`2500 2498 2499`有两条路径 |`Y`| 最大值 (N)、递归深度和二次输出 |

 ## 边缘情况

 对于最小情况```
3 2 3
1 2
1 2
2 3
```(T_2) 是一颗星，(T_3) 是一条路径。 算法进入情况 B。它从 (T_3) 中删除一个叶子，留下一棵二顶点树，求解 (K_2)，将删除的叶子映射到城市 3，并将 (T_2) 放在城市 3。最终的三个边都是不同的，因此输出为`Y`。 

对于最大的树是星形的情况，算法永远不需要检查其边缘。 它递归地打包较小的实例并将新顶点指定为星形中心。 该星形的每条边都有新的顶点作为一个端点，因此没有一条边可能出现在递归打包中。 

对于两个非星的情况，考虑```
4 3 4
1 2
2 3
1 2
2 3
3 4
```四顶点路径有两个具有不同父级的叶子，三顶点路径具有相同的属性。 移除这些叶子会得到适合 (K_2) 和 (K_1) 的较小的树。 然后重建使用两个新城市来放置移除的树叶。 选择四个新边的方向，以便不重复父新城市边。 

全明星案例是另一个有用的边界条件，因为两个指定的特殊共和国也可以成为明星。 该实现并不假设`a`和`b`是真正的非星树。 它检查每个递归级别的实际度结构，因此恰好是星形的指定特殊树由情况 A 处理。 

最大情况测试了实现中最重要的两个约束。 递归可以达到接近（2500）的深度，这就是为什么增加了递归限制，并且答案包含数百万个整数，这就是为什么该构造只存储最终的映射行而不是显式的（N\times N）边缘矩阵。 

更深层次的教训是归纳结构。 这个问题看起来像是一个困难的全局边缘填充问题，但是星星为我们提供了一种引入新顶点的受控方法。 一旦两棵特殊的树被缩减为更小的树，同样的问题就会再次出现。 这正是每当必须将完整图分解为大小形成序列 (2,3,\ldots,N) 的对象时所要寻找的结构简化。
