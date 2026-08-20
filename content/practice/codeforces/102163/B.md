---
title: "CF 102163B - 让我睡觉"
description: "宿舍可以建模为无向图。 每个房间都是一个顶点，每个门户都是一条边。 当删除该边缘会断开其连接的组件（这是桥的标准定义）时，门户对于主管来说非常有用。"
date: "2026-08-19T14:38:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102163
codeforces_index: "B"
codeforces_contest_name: "NCD 2019"
rating: 0
weight: 102163
solve_time_s: 461
verified: true
draft: false
---

[CF 102163B - 让我睡觉](https://codeforces.com/problemset/problem/102163/B)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 宿舍可以建模为无向图。 每个房间都是一个顶点，每个门户都是一条边。 当删除该边缘会断开其连接的组件（这是桥的标准定义）时，门户对于主管来说非常有用。 

哈桑可能会在两个房间之间添加一个新的传送门。 添加边可能会破坏一些现有的桥，因为新边可能会创建包含它们的循环。 目标是选择新的门户，以便保留尽可能少的桥梁。 

输入包含几个独立的图。 对于每个图，所需的输出是添加一条边后桥的最小可能数量。 

在一个测试用例中，边界最多允许 (10^5) 个顶点和 (10^5) 个边。 官方问题页面给出了 3 秒的时间限制和 256 MB 的内存限制。 有了这个大小，算法应该在大致线性或接近线性的时间内处理该图。 枚举所有顶点对已经花费了 (O(N^2))，最大大小约为 (5\cdot10^9) 对，因此任何单独检查每个可能的新门户的解决方案都太慢了。 

有几个图表细节可能会导致粗心的实施失败。 首先，图表可能是断开的。 例如，```
1
4 2
1 2
3 4
```有两个桥，但是在不同连接组件的顶点之间添加边不会创建循环，所以答案是`2`。 将整个桥梁结构视为一棵树的解决方案可能会错误地连接两个组件，并声称两座桥梁都消失了。 

其次，图可以包含循环。 为了```
1
3 3
1 2
2 3
3 1
```已经没有桥梁了，所以答案是`0`。 简单地计算边数或假设连通图中的每条边都是桥的解决方案会犯这个错误。 

第三，如果出现重复边缘，需要正确处理。 为了```
1
2 2
1 2
1 2
```两条边都不是桥，因为删除其中一条边仍然会留下另一条连接。 答案是`0`。 Tarjan 的算法必须区分两条物理边缘，而不是将第二次出现的边缘视为同一边缘。 

如果输入包含自循环，则自循环是另一种无害的情况。 为了```
1
1 1
1 1
```边缘无法断开任何连接，所以答案是`0`。 下面的实现自然可以处理它。 

## 方法

 直接的解决方案将尝试每对可能的房间作为新门户的端点。 对于每一对，从概念上添加边缘，运行桥查找算法，计算剩余的桥，并保留最小值。 这是正确的，因为新门户的每个合法选择都经过明确评估。 

问题在于选择的数量。 有 (O(N^2)) 对，查找所有桥的成本为 (O(N+M))，因此总复杂度为 (O(N^2(N+M)))。 对于 (N=M=10^5)，这相当于 (10^{15}) 个图运算，这几乎是不可行的。 

有用的观察结果是，添加一条边只能使一条特定路径上的边不再是桥梁。 假设两个房间已经连接。 在所有现有桥梁收缩后，它们的边缘双连接组件之间存在一条独特的路径。 添加新边会创建一个由新边和该路径组成的循环。 道路上的每座桥梁现在都是循环的一部分，不再是桥梁。 小路外的桥梁仍然是桥梁。 

这建议将不包含桥的每个最大区域压缩为一个组件。 压缩后，每个剩余的边都是一座桥，而产生的结构是一片森林。 在这个森林的每棵树中，在两个组件之间添加一条边会精确地删除其独特路径上的桥边。 

那么问题就变得简单多了。 设桥梁总数为 (B)。 如果桥林中最长的路径长度为 (D)，我们可以在属于该路径两个端点的房间之间添加一个门户，并精确删除 (D) 座桥。 答案是

 [
 B-D。 
]

 如果原始图被断开，则压缩后的结构是一片森林而不是一棵树。 两棵不同树之间的边不能移除任何旧桥，因此我们采用所有树的最大直径。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(N^2(N+M))) | (O(N+M)) | 太慢了 |
 | 最佳| (O(N+M)) | (O(N+M)) | 已接受 |

 ## 算法演练

 1. 为每个入口存储带有显式边 ID 的无向图。 使用边缘 ID 是必要的，因为两个不同的门户可能连接同一对房间。 
2. 运行Tarjan 的桥接算法。 对于每个顶点，保持其发现时间`tin`及其最短的可达发现时间`low`。 对于从 (u) 到 (v) 的 DFS 树边，当满足以下条件时，该边就是桥：`low[v] > tin[u]`。 

该实现使用显式堆栈而不是递归 DFS。 对于 (10^5) 个顶点，递归 Python DFS 可能会达到递归限制或产生不必要的开销，而迭代版本则保留相同的 Tarjan 逻辑。 
3. 忽略每个桥并找到剩余图的连通分量。 每个这样的组件都是一个边双连接组件，这意味着它内部的任何单个边都不能断开该组件。 
4. 为每个边双连通分量指定一个压缩顶点 ID。 每个原始桥连接两个不同的压缩组件。 
5. 构建一个仅包含这些桥的新图。 由于所有内部非桥边都收缩了，因此该图是一个森林。 其中的每条边都代表一座原始桥梁。 
6. 计算所有桥边。 将此值称为 (B)。 
7. 对于桥林中的每棵树，计算其直径。 由于所有压缩边都具有单位长度，因此直径就是路径上桥接边的最大数量。 
8. 标准的二次遍历方法求出每棵树的直径。 从任意顶点开始并找到最远的顶点 (a)。 从 (a) 开始，找到最远的顶点 (b)。 从 (a) 到 (b) 的距离是树的直径。 
9. 保持所有树木中最大的直径（D）。 从该路径的两个端点组件连接房间会创建一个恰好包含那些 (D) 桥的循环，因此这些桥会消失。 
10. 返回`total_bridges - maximum_diameter`。 

**为什么有效。** 在收缩所有非桥边之后，每个剩余的边都是桥，压缩后的图是森林。 在连接的组件内添加一条边恰好创建一个循环，由新边和压缩树中其端点之间的唯一路径组成。 确切地说，该路径上的桥边缘不再是桥，而其他所有桥仍然是桥。 因此，移除的桥的数量正是路径长度。 最佳可能路径是直径，因此从原始桥梁数量中减去最大森林直径即可得出剩余桥梁的最小可能数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    answers = []

    for _ in range(t):
        n, m = map(int, input().split())

        adj = [[] for _ in range(n)]
        edges = []

        for eid in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            edges.append((u, v))
            adj[u].append((v, eid))
            adj[v].append((u, eid))

        tin = [-1] * n
        low = [0] * n
        parent = [-1] * n
        parent_edge = [-1] * n
        it = [0] * n
        is_bridge = [False] * m

        timer = 0

        for root in range(n):
            if tin[root] != -1:
                continue

            tin[root] = low[root] = timer
            timer += 1

            stack = [root]

            while stack:
                v = stack[-1]

                if it[v] < len(adj[v]):
                    to, eid = adj[v][it[v]]
                    it[v] += 1

                    if eid == parent_edge[v]:
                        continue

                    if tin[to] == -1:
                        parent[to] = v
                        parent_edge[to] = eid
                        tin[to] = low[to] = timer
                        timer += 1
                        stack.append(to)
                    else:
                        if tin[to] < low[v]:
                            low[v] = tin[to]
                else:
                    stack.pop()
                    p = parent[v]

                    if p != -1:
                        pe = parent_edge[v]

                        if low[v] > tin[p]:
                            is_bridge[pe] = True

                        if low[v] < low[p]:
                            low[p] = low[v]

        comp = [-1] * n
        component_count = 0

        for start in range(n):
            if comp[start] != -1:
                continue

            comp[start] = component_count
            stack = [start]

            while stack:
                v = stack.pop()

                for to, eid in adj[v]:
                    if is_bridge[eid]:
                        continue
                    if comp[to] != -1:
                        continue

                    comp[to] = component_count
                    stack.append(to)

            component_count += 1

        forest = [[] for _ in range(component_count)]
        total_bridges = 0

        for eid, (u, v) in enumerate(edges):
            if not is_bridge[eid]:
                continue

            a = comp[u]
            b = comp[v]

            forest[a].append(b)
            forest[b].append(a)
            total_bridges += 1

        seen = [False] * component_count

        def farthest(start, mark):
            stack = [(start, -1, 0)]
            far_vertex = start
            far_distance = 0

            while stack:
                v, parent_vertex, distance = stack.pop()

                if mark:
                    seen[v] = True

                if distance > far_distance:
                    far_distance = distance
                    far_vertex = v

                for to in forest[v]:
                    if to == parent_vertex:
                        continue
                    stack.append((to, v, distance + 1))

            return far_vertex, far_distance

        maximum_diameter = 0

        for start in range(component_count):
            if seen[start]:
                continue

            endpoint, _ = farthest(start, True)
            _, diameter = farthest(endpoint, False)

            if diameter > maximum_diameter:
                maximum_diameter = diameter

        answers.append(str(total_bridges - maximum_diameter))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    solve()
```该图首先存储为邻接表。 每个邻接条目都包含相邻顶点和物理边 ID，这使 Tarjan 可以正确区分平行边。 

第一次遍历计算`tin`和`low`。 当 DFS 孩子`v`完成，条件`low[v] > tin[parent[v]]`将父边标识为桥。 父边本身是使用其 ID 来跳过的，而不是通过跳过父顶点来跳过，这是多重图所需的微妙细节。 

知道网桥后，第二次遍历会分配组件 ID，同时拒绝跨网桥。 这些组件正是压缩森林的顶点。 然后，我们检查每个原始边缘一次，并仅添加桥接边缘`forest`。 

直径计算使用包含以下内容的堆栈`(vertex, parent, distance)`。 因为`forest`是一个森林，记住父级足以防止向后行走，因此不需要额外的每次遍历访问数组。 树的第一次遍历将其顶点标记为`seen`，这可以防止再次处理同一棵树。 

Python 中不存在整数溢出问题。 最大可能的答案最多是 (10^5)，而 Python 整数无论如何都可以处理任意大小。 距离从零开始，因此没有桥边缘的压缩组件的直径为零，并且对移除桥的数量没有任何贡献。 

## 工作示例

 ### 示例案例1

 该图是```
1 -- 2 -- 3
```两边都是桥。 收缩非桥区域后，什么都没有收缩，因此桥林仍然是一条由三部分组成的路径。 

| 相| 组件| 桥边 | 桥梁总数| 最大直径| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 原图| 3 | 2 | 2 | 2 | 0 |
 | 选择端点 1 和 3 后 | 3 | 2 | 2 | 2 | 0 |

 在房间 1 和房间 3 之间添加门户会形成循环`1-2-3-1`。 两座原来的桥现在都位于自行车道上，所以它们都不再是桥了。 答案是`2 - 2 = 0`。 

### 示例案例2

 该图在房间 2、3 和 8 上包含一个三角形。房间 1、4、5 和 7 也通过多条路径连接，因此所有这些边都属于一个边双连通分量。 剩下的桥梁结构是一棵三叶树。 

| 相| 压缩组件| 桥边 | 桥梁总数| 最大直径| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 桥梁检测后| 4 |`(triangle)-(core)`,`(core)-6`,`(core)-9`| 3 | 2 | 1 |
 | 选择叶子 2 和 6 | 4 | 3 座原创桥梁 | 3 | 2 删除 | 1 |

 三座桥分别是从房间 1 到房间 2 的入口、从房间 4 到房间 6 的入口、从房间 5 到房间 9 的入口。压缩森林是一个星形，其中心是大循环组件，叶子是三角形组件、房间 6 和房间 9。 

最长的路径包含两座桥。 连接两个叶子会创建一个包含这两个桥的循环，只留下一个桥。 因此样本输出是`1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N+M)) | Tarjan、组件构建、森林构建和直径遍历每个过程每个顶点和边仅恒定次数 |
 | 空间| (O(N+M)) | 原始邻接表、网桥数据、组件 ID 和压缩森林在图大小上都是线性的 |

 对于 (N,M\le10^5)，该算法仅执行少量恒定数量的线性图遍历。 这是官方 3 秒和 256 MB 限制的正确比例。 

## 测试用例

 以下测试工具假设提交的解决方案保存为`solution.py`并暴露了`solve()`函数如上所示。```python
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

sample = """\
2
3 2
1 2
2 3
9 11
3 2
3 8
2 8
1 2
1 5
1 4
5 9
7 5
4 5
6 4
4 7
"""

assert run(sample) == "0\n1", "provided sample"

assert run("""\
1
1 1
1 1
""") == "0", "single vertex and self-loop"

assert run("""\
1
4 3
1 2
2 3
3 4
""") == "0", "a path can be closed into one cycle"

assert run("""\
1
2 2
1 2
1 2
""") == "0", "parallel edges are not bridges"

assert run("""\
1
4 2
1 2
3 4
""") == "1", "two disconnected components"

n = 100000
m = 100000
maximum_case = "1\n" + f"{n} {m}\n" + ("1 1\n" * m)
assert run(maximum_case) == "0", "maximum size with repeated self-loops"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 官方样品|`0\n1`| 主要案例、周期、桥梁和断开的图 |
 |`1 1`有边缘`1 1`|`0`| 最小尺寸和自环处理|
 | 小路`1-2-3-4`|`0`| 直径可以消除每一个桥梁|
 | 两条平行边 |`0`| 正确处理重复边缘的边缘 ID |
 | 两个断开的单边组件 |`1`| 必须取得森林的最大直径|
 | (N=M=10^5)，所有边`1 1`|`0`| 最大输入大小和重复相同端点 |

 ## 边缘情况

 对于断开连接的图，例如```
1
4 2
1 2
3 4
```Tarjan 发现两条边都是桥梁。 由于没有非桥边，每个房间都成为自己的压缩组件，桥林由两棵独立的树组成，每棵树都包含一个边。 每棵树的直径为一，因此最大直径为一。 总桥数为二，给出`2 - 1 = 1`。 该算法永远不会错误地连接两棵断开连接的树，因为它只使用一个森林组件内的路径。 

对于已经包含循环的图，```
1
3 3
1 2
2 3
3 1
```Tarjan 没有发现任何桥梁。 所有三个顶点都放置在同一个压缩组件中，因此桥林有一个孤立的顶点，并且最大直径为零。 总桥数也为零，给出正确答案`0`。 

对于平行边，```
1
2 2
1 2
1 2
```两个门户具有不同的边缘 ID。 在DFS期间，当遇到第二条物理边时，它被视为后边而不是与DFS父边混淆。 因此，低链路值下降得足够大，以至于两个门户都无法满足桥接条件。 压缩图包含一个分量，桥数为零，答案为`0`。 

对于自循环，```
1
1 1
1 1
```边在同一顶点开始和结束。 它无法断开图的连接，因此 Tarjan 不会将其标记为桥。 唯一的房间成为一个压缩构件，桥林的直径为零，答案是`0`。 

最能说明问题的是一条简单的路径，```
1
4 3
1 2
2 3
3 4
```所有三个边都是桥，因此压缩森林是长度为三的路径。 第一个直径遍历到达一个端点，第二个到达距离为 3 的另一个端点。 该算法计算`total_bridges = 3`,`maximum_diameter = 3`，并返回`0`。 在房间 1 和房间 4 之间添加门户会创建一个包含每个原始边缘的循环，这正是最佳操作。
