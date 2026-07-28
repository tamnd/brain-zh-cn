---
title: "CF 102835G - 图形卡"
description: "输入描述了一副图形卡。 每张卡片都包含一个无向简单图。 一张卡片是有效的，因为该图具有相同数量的顶点和边并且是连通的，这意味着每张卡片都代表一个连通的单环图：一棵树，其中恰好有一个..."
date: "2026-07-26T14:59:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102835
codeforces_index: "G"
codeforces_contest_name: "The 2020 ICPC Asia Taipei-Hsinchu Site Programming Contest"
rating: 0
weight: 102835
solve_time_s: 41
verified: true
draft: false
---

[CF 102835G - 图形卡](https://codeforces.com/problemset/problem/102835/G)

 **评级：** -
 **标签：** -
 **求解时间：** 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入描述了一副图形卡。 每张卡片都包含一个无向简单图。 一张卡片是有效的，因为该图具有相同数量的顶点和边并且是连通的，这意味着每张卡片都代表一个连通的单环图：一棵只有一条附加边的树。 当两张卡片的图形可以重新标记为相同时，它们被认为是相同的。 任务是计算整副牌中出现了多少种不同的图形形状。 

输入上的图形标签不相关。 带有编号的顶点的图`1,2,3`和带有编号的顶点的相同图`10,20,30`应该只贡献一次。 挑战在于构建忽略顶点名称的结构表示。 

卡片中的顶点数量可能很大，因此使用通用图同构算法检查每对图是不切实际的。 一般的同构比较可能非常昂贵，而这个问题有额外的结构。 具有相等数量的顶点和边的连通图恰好具有一个循环，并且该循环之外的所有内容都是有根树的集合。 该结构使我们能够为每张卡创建线性时间的规范表示。 

边缘情况来自循环的对称性和附加到循环的树。 从任意顶点开始的简单遍历都会失败，因为对于两个相同的图，所选的起点可能不同。 

例如，以下两张卡片描述了具有不同编号顶点的同一循环：```
1
3 1 2 2 3 3 1
3 2 3 3 1 1 2
```正确的输出是：```
1
```记录访问顶点顺序的遍历可能会产生不同的字符串，因为它从循环上的不同位置开始。 

另一个常见的错误是忽略循环可以在任一方向遍历。 例如：```
1
4 1 2 2 3 3 4 4 1
4 1 4 4 3 3 2 2 1
```正确的输出是：```
1
```第二张图只是向后看的第一张图。 仅检查旋转但不检查反向旋转的表示将它们视为不同的。 

第三种边缘情况是具有多个附加分支的循环顶点。 考虑一个循环，其中一个顶点有两个相同的子叶。 子项没有顺序，因此需要对子项描述进行排序。 如果不进行排序，两个等效的树可以接收不同的编码。 

## 方法

 蛮力的想法是比较每对卡片并运行图同构检查。 这是有效的，因为当两张牌的图之间存在同构时，两张牌是完全相同的。 问题是，如果卡片很多，比较的次数就会成二次方。 和`n`卡，这已经需要`O(n^2)`比较，并且每次比较可能需要检查每个边和顶点，使得总工作量太大。 

有用的观察结果是，该问题中的每个图都恰好有一个周期。 我们不需要通用的图同构算法。 我们可以首先识别唯一的循环，从概念上删除它，然后查看悬挂在每个循环顶点上的有根树。 

有根树具有简单的规范形式。 叶子由一对空括号表示。 顶点由其子级规范形式的排序列表表示，并用括号括起来。 排序消除了对子排序的依赖。 

唯一剩下的困难是周期本身。 该循环是有根树描述的循环序列。 如果两个循环序列可以旋转或反转以获得另一个，则这两个循环序列相等。 我们生成序列的所有旋转和反转序列的所有旋转中的最小表示。 

蛮力方法失败是因为它反复解决相同的结构问题。 规范表示每张卡解决一次，并将相等性检查转变为字符串或元组比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(C²·V) | O(V) | 太慢了|
 | 最佳 | O(C·V log V) | O(C·V log V) | O(V) | 已接受 |

 这里`C`是卡片的数量，`V`是一张卡中的顶点总数。 对数因子来自对树节点的子节点进行排序。 

## 算法演练

 1. 读取一张图形卡并构建其邻接表。 顶点编号只是临时标识符，因为最终表示一定不依赖于它们。 
2. 使用叶子修剪找到唯一的循环。 每个度数为 1 的顶点都不能成为循环的一部分，因此重复删除叶子会恰好留下循环顶点。 这是可行的，因为单环图只有一个闭合分量。 
3. 对于每个循环顶点，计算与其相连的树的规范形式，同时忽略两个循环邻居。 树编码按排序顺序递归地组合所有子编码。 
4. 将获得的树编码放入循环周围的顺序中。 起始循环顶点是任意的，因此生成每个旋转。 还生成相反顺序的每个旋转，因为相同的循环可以沿相反的方向行走。 
5. 选择字典顺序最小的循环表示。 该值是整个图的规范标识符。 
6. 将标识符插入集合中。 所有卡片处理完毕后，集合的大小就是不同图形卡片的数量。 

为什么它有效：

 树编码是唯一的，因为每个节点都由其子子树的多重集表示，并且排序将该多重集转换为确定性顺序。 循环编码是独特的，因为考虑了起点和方向的每一种可能的选择。 任何两个同构单环图必须具有相同的循环长度和相同的附加有根树序列直到旋转和反转，因此它们的规范标识符匹配。 非同构图不能产生相同的标识符，因为标识符重建了完整的循环和每个附加的树。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def rooted_tree_code(v, parent, adj, on_cycle):
    children = []
    for u in adj[v]:
        if u != parent and not on_cycle[u]:
            children.append(rooted_tree_code(u, v, adj, on_cycle))
    children.sort()
    return "(" + "".join(children) + ")"

def canonical_graph(edges, n):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    degree = [len(x) for x in adj]
    alive = [True] * n
    stack = [i for i in range(n) if degree[i] == 1]

    while stack:
        v = stack.pop()
        alive[v] = False
        for u in adj[v]:
            if alive[u]:
                degree[u] -= 1
                if degree[u] == 1:
                    stack.append(u)

    cycle = [i for i in range(n) if alive[i]]
    on_cycle = alive[:]

    cycle_adj = [[] for _ in range(n)]
    for v in cycle:
        for u in adj[v]:
            if on_cycle[u]:
                cycle_adj[v].append(u)

    start = cycle[0]
    order = []
    prev = -1
    cur = start

    while True:
        order.append(cur)
        nxt = cycle_adj[cur][0]
        if nxt == prev:
            nxt = cycle_adj[cur][1]
        prev, cur = cur, nxt
        if cur == start:
            break

    parts = [rooted_tree_code(v, -1, adj, on_cycle) for v in order]

    m = len(parts)
    best = None

    for arr in (parts, list(reversed(parts))):
        for i in range(m):
            cand = tuple(arr[i:] + arr[:i])
            if best is None or cand < best:
                best = cand

    return best

def solve():
    t = int(input())
    ans = []
    for _ in range(t):
        cards = int(input())
        seen = set()

        for _ in range(cards):
            data = list(map(int, input().split()))
            k = data[0]
            vals = data[1:]

            edges = []
            mx = 0
            for i in range(k):
                u = vals[2 * i] - 1
                v = vals[2 * i + 1] - 1
                edges.append((u, v))
                mx = max(mx, u, v)

            seen.add(canonical_graph(edges, mx + 1))

        ans.append(str(len(seen)))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```邻接表存储临时图表示。 叶子修剪循环删除每个树顶点，只留下唯一的循环。 布尔值`on_cycle`数组将循环与附加的树分开。`rooted_tree_code`永远不会进入另一个循环顶点，因此每个递归调用都停留在一棵有根树内。 在构建结果之前对子级进行排序，这是消除对输入排序的依赖的细节。 

循环遍历创建循环的一个方向。 最后的循环处理所有可能的起始位置和两个方向。 元组用于最终标识符，因为它可以自然地进行比较并避免连接字符串之间的歧义。 

该实现不对循环本身使用递归。 递归深度只是附属树的深度，这是需要在结构上表示的部分。 

## 工作示例

 考虑一张三角形卡：```
1
3 1 2 2 3 3 1
```踪迹是：

 | 步骤| 剩余周期| 附树代码| 当前最佳|
 | ---| ---| ---| ---|
 | 修剪后| 1,2,3 |`()`,`()`,`()`| 取消设置 |
 | 第一个方向 |`(),(),()`| 所有旋转都相等 |`(),(),()`|
 | 反向 |`(),(),()`| 所有旋转都相等 |`(),(),()`|

 该图接收一个规范标识符，因此相同的三角形会被合并。 

考虑一个带有额外叶子的循环：```
1
4 1 2 2 3 3 1 1 4
```踪迹是：

 | 步骤| 剩余周期| 附树代码| 当前最佳|
 | ---| ---| ---| ---|
 | 修剪后| 1,2,3 |`(()),(),()`| 取消设置 |
 | 旋转 1 |`(()),(),()`| 选择|`(()),(),()`|
 | 其他轮换 |`(),(()),()`和`(),(),(())`| 更大| 不变|
 | 反向旋转| 已检查 | 不变|`(()),(),()`|

 叶子连接到特定的循环顶点，并且规范的循环顺序保留了这种关系。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每张卡 O(V log V) | 每个顶点被处理一次，并且子列表在树编码期间被排序 |
 | 空间| O(V) | 邻接表、剪枝数组和递归状态存储一张卡的信息 |

 该算法避免了成对图比较，因此总工作量随着卡片数量线性增长。 单环图的结构使得规范化在一定范围内成为可能。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    it = iter(data)
    t = int(next(it))
    out = []

    for _ in range(t):
        c = int(next(it))
        seen = set()
        for _ in range(c):
            k = int(next(it))
            edges = []
            mx = 0
            for _ in range(k):
                u = int(next(it)) - 1
                v = int(next(it)) - 1
                edges.append((u, v))
                mx = max(mx, u, v)
            seen.add(canonical_graph(edges, mx + 1))
        out.append(str(len(seen)))

    return "\n".join(out)

assert run("""1
2
4 1 2 2 3 3 1 1 4
4 1 2 2 3 3 1 2 4
""") == "1"

assert run("""1
3
3 1 2 2 3 3 1
4 1 2 2 3 3 4 4 1
4 1 4 4 3 3 2 2 1
""") == "2"

assert run("""1
1
3 1 2 2 3 3 1
""") == "1"

assert run("""1
2
4 1 2 2 3 3 1 1 4
5 1 2 2 3 3 1 1 4 4 5
""") == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 两个不同标记的三角形 | 1 | 忽略顶点编号 |
 | 具有反向遍历的循环 | 2 | 处理反射对称性 |
 | 单三角形 | 1 | 最小仅循环图 |
 | 添加分支的相同循环 | 2 | 区分附属树木 |

 ## 边缘情况

 处理没有附加树的循环，因为每个循环顶点接收相同的空树代码。 循环标准化仍然检查旋转和反转，因此无论输入编号如何，都能正确识别三角形或更大的环。 

唯一区别是循环行走方向的图表是通过比较原始序列及其反向序列来处理的。 例如，输入```
1
4 1 2 2 3 3 4 4 1
```向后列出的相同循环都生成相同的最小循环表示。 

具有许多相同子节点的顶点通过对子节点编码进行排序来处理。 对于连接到两个叶子的循环顶点，附加的树代码成为两个相同叶子代码的排序组合。 该算法从不依赖于边在输入中出现的顺序，因此相同的分支结构始终接收相同的表示。
