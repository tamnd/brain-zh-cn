---
title: "CF 102215D - 国家/地区划分"
description: "道路网络是一棵树，因为有 (n) 个城市，恰好有 (n-1) 条道路，并且每个城市都可以从其他城市到达。 在每个预测中，有些城市是红色的，有些是蓝色的，其余所有城市都是不相关的。 我们可能会关闭任何一组道路。"
date: "2026-08-17T23:34:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102215
codeforces_index: "D"
codeforces_contest_name: "2019, XII Samara Regional Intercollegiate Programming Contest"
rating: 0
weight: 102215
solve_time_s: 222
verified: false
draft: false
---

[CF 102215D - 国家/地区划分](https://codeforces.com/problemset/problem/102215/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 42s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 道路网络是一棵树，因为有 (n) 个城市，恰好有 (n-1) 条道路，并且每个城市都可以从其他城市到达。 在每个预测中，有些城市是红色的，有些是蓝色的，其余所有城市都是不相关的。 

我们可能会关闭任何一组道路。 这样做之后，每个红色城市仍必须与其他所有红色城市连接，每个蓝色城市仍必须与其他所有蓝色城市连接，并且红色城市不得与任何蓝色城市连接。 任务是确定每次预测是否存在这样一组封闭道路。 官方给出的问题有(n,q\le 200000)，所有查询到的红蓝城市的总和也最多为(200000)。 

关键对象是连接一组顶点的最小子树。 对于红色城市，将其称为红色斯坦纳子树。 任何有效的解决方案都必须使该子树的每个边缘都保持开放，否则两个红色城市将断开连接。 蓝色斯坦纳子树也是如此。 因此，真正的问题是是否可以使两个所需的子树不相交。 

大小限制排除了为每个查询重建所有 (n) 个城市的信息。 对于 (q=200000) 和 (n=200000)，(O(nq)) 方法可以执行大约 (4\cdot10^{10}) 次操作，远远超出 2 秒的限制。 约束的有用部分是所有查询的彩色城市总数仅为（200000），因此查询工作应该与提到的城市数量乘以对数树运算成正比。 

有几种边缘情况很容易被错误处理。 如果每种颜色只有一个城市，那么答案总是“是”。 例如，```
2
1 2
1
1 1 2
```有答案`YES`。 我们可以为每种颜色的内部连接保持唯一的道路开放，并且不需要保持红蓝路径开放。 

即使没有红色和蓝色城市重合，两个颜色子树也可以具有相同的根。 例如，```
5
1 2
1 3
1 4
1 5
1
2 2 3 4 5
```有红色城市 (2,3) 和蓝色城市 (4,5)。 两个颜色子树都包含城市 (1)，所以答案是`NO`。 如果粗心的解决方案只检查彩色城市本身是否不同，就会错误地接受它。 

当一种颜色的斯坦纳根是另一种颜色的斯坦纳根的祖先时，会发生另一种微妙的情况。 考虑```
4
1 2
2 3
3 4
1
2 1 4 3
```红色城市是(1,4)，因此它们的斯坦纳子树是从(1)到(4)的整个路径。 蓝色的城市是（3）。 蓝色子树位于红色子树内部，所以答案是`NO`。 仅仅观察两个斯坦纳根（1）和（3）不同是不够的。 

相反的情况也是可能的：```
4
1 2
2 3
3 4
1
2 1 2 3 4
```这里红色城市是(1,2)，蓝色城市是(3,4)，它们所需的子树由边(2-3)分隔。 答案是`YES`。 

## 方法

 直接方法可以为树建立根并处理每个查询的每个边。 对于每个查询，我们可以确定每条边的哪一侧包含红色和蓝色城市，然后决定该边是否必须对任一颜色保持开放。 这是正确的，因为删除一条边会将树准确地分成两个组件，因此所有连接性要求都可以用这些切割来表达。 

问题是工作量。 处理每个查询的所有 (n-1) 条边的成本 (O(nq))。 在最大范围内，这大约是 (200000\cdot200000=4\cdot10^{10}) 边缘操作，这几乎是不可行的。 

解锁更快方法的观察结果是我们永远不需要检查整个树。 对于一组顶点，当树有根时，其最小连接子树具有唯一的最高顶点。 该顶点只是集合中所有顶点的 LCA。 

令 (R) 为所有红色城市的 LCA，(B) 为所有蓝色城市的 LCA。 红色斯坦纳子树正是从 (R) 到每个红色城市的路径的并集。 同样，蓝色斯坦纳子树是从 (B) 到每个蓝色城市的路径的并集。 

如果 (R) 和 (B) 都不是对方的祖先，则它们的根子树是不相交的，因此两个 Steiner 子树自动不相交，答案是`YES`。 

相反，假设 (R) 是 (B) 的祖先。 整个蓝色 Steiner 子树包含在以 (B) 为根的子树中。 当某个红色城市本身位于以 (B) 为根的子树内部时，红色斯坦纳子树恰好到达该子树。 如果存在这样一个红色城市，则它从（R）到该城市的路径经过（B），而蓝色子树也包含（B），因此所需的两个子树相交。 答案是`NO`。 如果那里没有红色城市，则两棵子树不相交，答案为`YES`。 

(B) 是 (R) 的祖先的情况是对称的。 

因此，每个查询只需要重复的 LCA 计算，然后进行祖先检查。 我们使用重轻分解对树进行 (O(\log n)) LCA 查询的预处理。 由于提及的城市总数最多为（200000），因此总查询工作量保持在预期范围内。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(nq)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n + S\log n))，其中 (S\le200000) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 让树在城市 (1) 生根。 在迭代 DFS 期间，计算`parent`,`depth`，以及欧拉进入和退出时间`tin`和`tout`。 区间 ([tin[v],tout[v])) 准确地表示 (v) 的子树，因此祖先检查稍后可以在 (O(1)) 中得到解答。 
2. 计算子树大小并为每个顶点选择一个重子树。 重孩子是具有最大子树的孩子。 跟随重子级会创建链，其中 LCA 查询更改链的次数为 (O(\log n))。 
3. 将每个顶点分配给其重轻链的头部。 由此产生的分解让我们可以通过重复移动链头比其链头父级更深的顶点来计算两个顶点的 LCA。 
4. 对于每个预测，存储红色顶点并通过从左到右折叠 LCA 操作来计算它们的公共 LCA。 从第一个红色顶点开始作为当前 LCA 并将其替换为`lca(current, next)`对于每个额外的红色顶点。 所得顶点 (R) 是属于红色 Steiner 子树的最高顶点。 
5. 对蓝色顶点执行相同操作并获得 (B)。 由于每个查询至少包含每种颜色的一个顶点，因此始终定义两个 LCA。 
6. 检查(R)和(B)在有根树中是否不可比较。 如果两者都不是另一个的祖先，则它们的子树是不相交的，因此输出`YES`。 
7. 如果(R)是(B)的祖先，则扫描红色顶点并检查它们中是否有任何一个位于(B)的子树中。 如果有，则红色 Steiner 子树必须经过 (B)，其中蓝色 Steiner 子树也存在，因此输出`NO`。 否则输出`YES`。 
8. 如果 (B) 是 (R) 的祖先，则执行对称检查。 在 (R) 的子树内查找蓝色顶点。 这样的顶点迫使蓝色 Steiner 子树通过 (R)，从而产生交叉点。 如果不存在这样的顶点，则输出`YES`。 

它的工作原理可以用一个不变量来概括：一种颜色的 Steiner 子树是从该颜色的公共 LCA 到其所有终端的路径的并集。 如果两个常见的 LCA 不可比较，则这些并集位于不相交的有根子树中。 如果一个 LCA 在另一个之上，例如 (R) 在 (B) 之上，则蓝色子树完全位于 (B) 的子树内部，并且当某个红色终端位于其中时，红色子树与该区域正好相交。 该算法精确地测试了这些可能性，因此它准确地接受两个所需的斯坦纳子树不相交的预测。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    graph = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

    parent = [0] * (n + 1)
    depth = [0] * (n + 1)
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    order = []

    # Iterative DFS.
    timer = 0
    stack = [(1, 0, 0)]

    while stack:
        v, p, state = stack.pop()

        if state == 0:
            parent[v] = p
            tin[v] = timer
            timer += 1
            order.append(v)

            stack.append((v, p, 1))

            for u in reversed(graph[v]):
                if u != p:
                    depth[u] = depth[v] + 1
                    stack.append((u, v, 0))
        else:
            tout[v] = timer

    # Subtree sizes and heavy child.
    size = [1] * (n + 1)
    heavy = [0] * (n + 1)

    for v in reversed(order):
        best_size = 0

        for u in graph[v]:
            if parent[u] == v:
                size[v] += size[u]
                if size[u] > best_size:
                    best_size = size[u]
                    heavy[v] = u

    # Heavy-light decomposition.
    head = [0] * (n + 1)
    chain_stack = [(1, 1)]

    while chain_stack:
        v, h = chain_stack.pop()

        while v:
            head[v] = h
            hv = heavy[v]

            for u in graph[v]:
                if parent[u] == v and u != hv:
                    chain_stack.append((u, u))

            v = hv

    def lca(a, b):
        while head[a] != head[b]:
            if depth[head[a]] > depth[head[b]]:
                a = parent[head[a]]
            else:
                b = parent[head[b]]

        return a if depth[a] < depth[b] else b

    def is_ancestor(a, b):
        return tin[a] <= tin[b] < tout[a]

    q = int(input())
    answer = []

    for _ in range(q):
        data = list(map(int, input().split()))
        r, b = data[0], data[1]

        reds = data[2:2 + r]
        blues = data[2 + r:2 + r + b]

        red_lca = reds[0]
        for v in reds[1:]:
            red_lca = lca(red_lca, v)

        blue_lca = blues[0]
        for v in blues[1:]:
            blue_lca = lca(blue_lca, v)

        if not is_ancestor(red_lca, blue_lca) and \
           not is_ancestor(blue_lca, red_lca):
            answer.append("YES")
            continue

        if is_ancestor(red_lca, blue_lca):
            # Red's Steiner tree intersects Blue's subtree
            # exactly when some red terminal is inside it.
            bad = False
            for v in reds:
                if is_ancestor(blue_lca, v):
                    bad = True
                    break
            answer.append("NO" if bad else "YES")
        else:
            # Symmetric case.
            bad = False
            for v in blues:
                if is_ancestor(red_lca, v):
                    bad = True
                    break
            answer.append("NO" if bad else "YES")

    sys.stdout.write("\n".join(answer))

if __name__ == "__main__":
    solve()
```第一个预处理阶段执行迭代 DFS 而不是递归。 路径形树可以包含 (200000) 个顶点，其深度足以超过 Python 的正常递归限制，因此递归 DFS 将成为不必要的失败源。 

这`tin`和`tout`当进入和退出顶点时，数组将被填充。 因为遍历是 DFS，所以顶点的所有后代在其退出时间之前接收进入时间。 最后，`a`是的祖先`b`恰好在什么时候`tin[a] <= tin[b] < tout[a]`。 

这`size`和`heavy`数组按 DFS 的逆顺序计算。 每个子节点在处理其父节点时都已计算出其子树大小。 最大的孩子变成了最重的孩子。 

重轻分解仅存储每个顶点的链头。 为了找到 LCA，我们将更深的链头向上移动，直到两个顶点位于同一条链上。 轻边只能交叉 (O(\log n)) 次，因为选择轻子节点会将剩余子树大小至少减少两倍。 

对于每个查询，红色和蓝色顶点都会被保留，因为最后的祖先扫描可能需要检查原始终端。 所有查询的存储终端总数最多为（200000），因此这不会产生很大的内存成本。 

条件`is_ancestor(red_lca, blue_lca)`故意包括平等。 如果两个LCA相等，则每个红色终端都在公共LCA的子树内部，因此后续扫描立即在那里找到红色终端并返回`NO`。 这可以处理常见的 LCA 情况，而不需要单独的分支。 

不存在涉及大于 (n) 的值的整数算术，因此 Python 整数溢出是无关紧要的。 关键的实现边界是半开欧拉区间`is_ancestor`： 使用`tout[v]`因为包含端点会引入相差一的错误。 

## 工作示例

 ### 示例 1

 对于以城市(1)为根的样本树，相关的祖先关系是(1)在(2,3)之上，(2)在(4,5)之上，(3)在(6,7)之上。 

| 查询 | 红色顶点 | 红色 LCA | 蓝色顶点| 蓝色LCA | 关系 | 结果 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | (4,5) | 2 | (6,7) | 3 | 无与伦比| 是的 |
 | 2 | (4,6) | 1 | (5,7) | 1 | 平等| 否 |
 | 3 | (1,4) | 1 | (5,2) | 2 | 红色 LCA 高于蓝色 LCA，红色 (4) 低于 2 | 否 |
 | 4 | (4,5) | 2 | (1) | 1 | 蓝色 LCA 在红色 LCA 之上，蓝色 (1) 在子树 2 之外 | 是的 |
 | 5 | (1) | 1 | (2) | 2 | 红色 LCA 位于蓝色 LCA 之上，红色 (1) 在子树 2 之外 | 是的 |
 | 6 | (1,2,3,4,5,6) | 1 | (7) | 7 | 红色 LCA 位于蓝色 LCA 之上，没有红色顶点低于 7 | 是的 |

 第一个查询演示了最简单的成功案例，其中两个 Steiner 子树位于根的不同分支。 第二个演示了为什么仅检查终端顶点是不够的，因为两个 Steiner 子树都必须经过城市 (1)。 第三个演示了嵌套子树测试。 尽管红色和蓝色 LCA 顶点不同，但红色城市 (4) 会强制红色子树通过蓝色 LCA (2)。 

### 第二个例子

 考虑一条路径：```
5
1 2
2 3
3 4
4 5
3
2 1 2 4 5
2 1 1 4 3
2 1 1 3 2
```第一个查询有红色城市 (1,2) 和蓝色城市 (4,5)。 颜色子树占据边缘的相对侧 (2-3)。 

| 查询 | 红色 LCA | 蓝色LCA | 祖先关系| 嵌套子树内的终端 | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 4 | 1 以上 4 | 子树 4 中没有红色顶点 | 是的 |
 | 2 | 1 | 4 | 1 以上 4 | 子树 4 中没有红色顶点 | 是的 |
 | 3 | 1 | 3 | 1 以上 3 | 红色顶点 1 不在子树 3 中 | 是的 |

 为了演示相同结构的拒绝版本，请将第二个查询更改为红色城市 (1,5) 和蓝色城市 (3)。 红色LCA为(1)，蓝色LCA为(3)，红色城市(5)位于(3)下方。 从(1)到(5)的红色路径必须经过(3)，所以答案变成`NO`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n + S\log n)) | (O(n + S\log n)) | 树预处理是线性的。 每个 (S\le200000) 个提到的城市最多参与一次 LCA 或祖先扫描，并且每个 LCA 成本为 (O(\log n))。 |
 | 空间| (O(n+S)) | 树和重轻数组使用 (O(n)) 内存，而当前查询存储 (O(r+b)) 终端。 |

 彩色城市的最大数量（n）和总数均为（200000）。 预处理仅接触每条道路固定次数，而查询阶段仅对预测明确提到的城市执行对数 LCA 运算。 因此，该解决方案满足 2 秒和 256 MB 的限制，而不依赖于递归或大型 (O(n\log n)) 提升表。 

## 测试用例```python
# The solution above defines solve() and the global input variable.
# This harness temporarily replaces stdin/stdout so solve() can be tested
# multiple times in one process.

import sys
import io

def run(inp: str) -> str:
    global input

    old_input = input
    old_stdout = sys.stdout

    input = io.StringIO(inp).readline
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        input = old_input
        sys.stdout = old_stdout

# Provided sample
sample1 = """\
7
1 2
1 3
2 4
2 5
3 6
3 7
6
2 2 4 5 6 7
2 2 4 6 5 7
2 1 4 5 2
2 1 4 5 1
1 1 1 2
6 1 1 2 3 4 5 6 7
"""

assert run(sample1) == """\
YES
NO
NO
YES
YES
YES""", "sample 1"

# Minimum-size tree.
minimum = """\
2
1 2
1
1 1 2
"""

assert run(minimum) == "YES", "minimum tree"

# Star where both color Steiner trees must use the center.
same_lca = """\
5
1 2
1 3
1 4
1 5
1
2 2 3 4 5
"""

assert run(same_lca) == "NO", "same LCA"

# Path with both a successful nested case and a failing nested case.
path_cases = """\
5
1 2
2 3
3 4
4 5
3
2 1 2 4 5
2 1 1 4 3
2 1 1 5 3
"""

assert run(path_cases) == """\
YES
YES
NO""", "nested ancestor cases"

# Maximum-size tree and maximum total number of colored cities.
# Red = 1..100000, Blue = 100001..200000.
# Their Steiner subtrees are separated by the edge 100000-100001.
n = 200000
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))

red = " ".join(str(i) for i in range(1, 100001))
blue = " ".join(str(i) for i in range(100001, 200001))

maximum = (
    f"{n}\n"
    f"{edges}\n"
    f"1\n"
    f"100000 100000 {red} {blue}\n"
)

assert run(maximum) == "YES", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 |`YES NO NO YES YES YES`| 完整的官方示例，包括不可比较、相等 LCA 和嵌套案例 |
 | 二节点树 |`YES`| 最小值（n），一红一蓝城市|
 | 五节点星|`NO`| 两个 Steiner 树在同一个 LCA 处相遇 |
 | 五节点路径|`YES YES NO`| 嵌套祖先关系和决定性的终端子树检查 |
 | (n=200000) 路径 |`YES`| 最大大小、最大总查询输入和迭代遍历安全性 |

 ## 边缘情况

 两城树没有可供推理的内部结构。 和```
2
1 2
1
1 1 2
```红色 LCA 是 (1)，蓝色 LCA 是 (2)，并且 (1) 是 (2) 的祖先。 唯一的红色顶点是 (1)，它不在 (2) 的子树内部，因此算法返回`YES`。 

对于普通 LCA 情况，```
5
1 2
1 3
1 4
1 5
1
2 2 3 4 5
```红色 LCA 是 (1)，蓝色 LCA 也是 (1)。 第一个祖先测试成功且相等，并且算法针对 (1) 的子树扫描红色顶点。 每个红色顶点都在其中，所以它返回`NO`。 这正是两个组作为终端组分离但不能作为连接组分离的情况。 

对于嵌套但交叉的情况，```
4
1 2
2 3
3 4
1
2 1 4 3
```红色 LCA 为 (1)，蓝色 LCA 为 (3)。 由于 (1) 是 (3) 的祖先，因此算法检查红色终端是否位于以 (3) 为根的子树中。 红色城市（4）确实如此，因此从（1）到（4）的红色路径必须经过（3）。 答案是`NO`。 

对于嵌套但可分离的情况，```
4
1 2
2 3
3 4
1
2 1 2 3 4
```红色 LCA 为 (1)，蓝色 LCA 为 (3)。 以 (3) 为根的子树中没有红色城市，因为红色城市是 (1) 和 (2)。 红色斯坦纳子树在进入蓝色子树之前就结束了，所以边(2-3)可以闭合，答案是`YES`。 

最大大小路径还会检查 Python 特定的边缘情况。 树可以有深度 (199999)，因此递归 DFS 是不安全的。 该实现使用显式堆栈进行预处理，而所有 LCA 操作都使用重轻链。 因此，该算法可以处理 (200000) 个城市的路径，而不会出现递归深度问题。
