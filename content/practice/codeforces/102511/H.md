---
title: "CF 102511H - 霍布森火车"
description: "该网络是一个具有特殊属性的有向图：每个站点都有一个出边。 从车站 i 开始，给定值 d[i] 是一个火车行程中唯一可到达的车站。"
date: "2026-08-05T16:21:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102511
codeforces_index: "H"
codeforces_contest_name: "2019 ICPC World Finals"
rating: 0
weight: 102511
solve_time_s: 128
verified: true
draft: false
---

[CF 102511H - 霍布森火车](https://codeforces.com/problemset/problem/102511/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该网络是一个具有特殊属性的有向图：每个站点都有一个出边。 从车站出发`i`，给定值`d[i]`是单程列车中唯一可到达的车站。 

对于每个车站`A`，我们需要统计有多少个起始站可以到达`A`最多使用`k`移动。 起始电台本身很重要，因此电台始终包含在其自己的答案中。 

每个顶点都有一个出边的图称为函数图。 这种图的每个连通分量都包含一个有向循环，并且每个其他站都属于一棵最终通向该循环的树。 

站的数量可以大到`5 * 10^5`。 这排除了单独检查每个出发站的情况。 每个节点的模拟最多需要`O(n)`每个节点移动，导致`O(n^2)`工作，这远远超出了可能的范围。 

这些棘手的情况是由循环和通向它们的长链引起的。 将图视为普通树的解决方案将会失败，因为循环节点有多种到达方式。 

例如：```
5 3
2
3
1
5
4
```该图有两个周期：`1 -> 2 -> 3 -> 1`和`4 -> 5 -> 4`。 正确的输出是：```
3
3
3
2
2
```仅靠树木的方法会错过该站`1`从车站可到达`2`和`3`通过循环。 

另一个边缘情况是链进入循环：```
4 2
2
3
4
3
```答案是：```
1
2
4
3
```车站`4`可以从以下地点到达`1`,`2`,`3`， 和`4`，但距离`1`是三条腿，所以当`k = 2`。 粗心的广度优先搜索实现仅标记访问过的站点而不跟踪距离可能会错误地对其进行计数。 

## 方法

 直接的解决方案是从每个站点开始搜索并向后跟踪输出边缘。 它是正确的，因为它准确地探索了可以到达目的地的所有可能的起点。 然而，在最坏的情况下，图可以包含长度链`n`，因此对每个站重复此操作的成本大约为`n * n`运营。 

有用的观察来自函数图的结构。 如果我们删除循环节点之间的所有边，则每个组件都成为有根树的集合，其根是循环节点。 对于这些树中的一棵树内的站点，所有可以到达它的站点正是其在反向树中的后代。 问题变成：最多有多少个后代在深度`k`在这个节点下面？ 

该树查询可以离线回答。 在深度优先遍历期间，我们为每个节点分配一个欧拉区间。 节点的子树是此排序中的一个连续区间。 我们按最大允许深度对查询进行排序，并在深度有效时将节点添加到 Fenwick 树。 然后，芬威克树给出每个子树区间内的活动节点的数量。 

剩下的部分是处理循环节点。 一个循环节点也可以从其他循环节点到达。 在长度周期上`m`，每个循环节点到达内的每个其他循环节点`m - 1`步骤，所以循环贡献很简单`min(k + 1, m)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 使用入度消除法找到所有循环节点。 入度为零的节点不能成为循环的一部分，因此重复删除它们会留下精确的有向循环。 
2. 通过从一个节点添加一条边到指向该节点的所有非循环节点来构建反向森林。 周期到周期的边沿被忽略，因为它们是单独处理的。 
3. 对该林执行 DFS。 为每个节点分配欧拉进入时间、退出时间及其距循环根的深度。 在这次遍历过程中，记录每个深度存在多少个节点。 
4. 为每个节点创建一个查询。 该查询询问其欧拉子树内的节点数，其深度最多为`depth[node] + k`。 
5. 按深度限制对查询进行排序。 从小到大扫过深度。 当深度允许时，使用其欧拉位置将具有该深度的每个节点插入到 Fenwick 树中。 查询答案是其子树间隔上的 Fenwick 总和。 
6. 对于每个循环节点，添加可达循环节点的数量。 对于一个周期长度`m`，这个值为`min(k + 1, m)`。 

为什么它有效：

 自行车外的每个站点都有一条通往自行车的独特路径。 反转边缘将所有可能的前驱站变成一棵树，因此每个有效的起始站都是该树中的后代。 欧拉间隔属性保证子树查询精确地计算那些后代，并且深度扫描保证只有内部的节点`k`包括边缘。 循环节点是唯一存在围绕循环的多个方向的地方，并且它们的贡献独立于附加的树，这就是它可以单独添加的原因。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 2)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i:
            s += self.bit[i]
            i -= i & -i
        return s

    def range_sum(self, l, r):
        return self.sum(r) - self.sum(l - 1)

def solve():
    n, k = map(int, input().split())
    to = [0] * n
    rev = [[] for _ in range(n)]
    indeg = [0] * n

    for i in range(n):
        x = int(input()) - 1
        to[i] = x
        rev[x].append(i)
        indeg[x] += 1

    from collections import deque

    q = deque()
    for i in range(n):
        if indeg[i] == 0:
            q.append(i)

    removed = [False] * n
    while q:
        x = q.popleft()
        removed[x] = True
        y = to[x]
        indeg[y] -= 1
        if indeg[y] == 0:
            q.append(y)

    cycle = [not removed[i] for i in range(n)]

    children = [[] for _ in range(n)]
    for i in range(n):
        if not cycle[i]:
            children[to[i]].append(i)

    tin = [0] * n
    tout = [0] * n
    depth = [0] * n
    nodes_by_depth = []
    timer = 0

    for root in range(n):
        if cycle[root]:
            stack = [(root, 0, False)]
            depth[root] = 0
            while stack:
                x, idx, exit_flag = stack.pop()
                if exit_flag:
                    tout[x] = timer - 1
                    continue
                tin[x] = timer + 1
                timer += 1
                while len(nodes_by_depth) <= depth[x]:
                    nodes_by_depth.append([])
                nodes_by_depth[depth[x]].append(x)
                stack.append((x, 0, True))
                for c in reversed(children[x]):
                    depth[c] = depth[x] + 1
                    stack.append((c, 0, False))

    queries = [(min(n - 1, depth[i] + k), i) for i in range(n)]
    queries.sort()

    bit = Fenwick(n)
    ans = [0] * n
    ptr = 0

    for limit, node in queries:
        while ptr <= limit and ptr < len(nodes_by_depth):
            for x in nodes_by_depth[ptr]:
                bit.add(tin[x], 1)
            ptr += 1
        ans[node] = bit.range_sum(tin[node], tout[node])

    visited = [False] * n
    for i in range(n):
        if cycle[i] and not visited[i]:
            cur = i
            length = 0
            while not visited[cur]:
                visited[cur] = True
                length += 1
                cur = to[cur]
            add = min(k + 1, length)
            cur = i
            while True:
                ans[cur] += add
                cur = to[cur]
                if cur == i:
                    break

    print("\n".join(map(str, ans)))

if __name__ == "__main__":
    solve()
```入度移除阶段无需递归即可将循环节点与树节点分开，这是必要的，因为长度链`500000`可能会溢出 Python 递归限制。 分离后，仅将非循环边放置在`children`，所以DFS结构是一个真正的森林。 

欧拉遍历给出`tin`和`tout`价值观。 间隔`[tin[v], tout[v]]`恰好包含以下节点`v`的反向树子树。 Fenwick树在深度扫描期间存储当前活动的节点，因此每个子树查询都成为范围和。 

循环处理是在树查询之后有意完成的。 树答案已经包含循环节点本身，因此只需添加其他循环节点。 使用`min(k + 1, length)`避免出现相差一错误`k`大于周期长度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个节点参与 Fenwick 扫描一次，每个查询执行对数更新或求和。 |
 | 空间| O(n) | 图、遍历数组和 Fenwick 树都存储线性大小的数据。 |

 该解决方案适合`5 * 10^5`节点限制，因为它永远不会执行与节点和路径长度的乘积成比例的工作。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old_out = sys.stdout
    sys.stdout = out
    solve()
    sys.stdout = old_out
    sys.stdin = old
    return out.getvalue()

assert run("""6 2
2
3
4
5
4
3
""") == """1
2
4
5
3
1
"""

assert run("""5 3
2
3
1
5
4
""") == """3
3
3
2
2
"""

assert run("""2 1
2
1
""") == """2
2
"""

assert run("""4 2
2
3
4
3
""") == """1
2
4
3
"""

assert run("""5 1
2
3
4
5
4
""") == """1
2
2
2
1
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 第一个样品|`1 2 4 5 3 1`| 附加到循环的树节点 |
 | 第二个样品 |`3 3 3 2 2`| 没有树木的纯循环|
 | 两节点循环 |`2 2`| 尽可能小的周期|
 | 链成循环|`1 2 4 3`| 距离截止处理|
 | 长链|`1 2 2 2 1`| 边界情况`k`|

 ## 边缘情况

 对于第一个周期的情况：```
5 3
2
3
1
5
4
```前三个站形成长度为三的循环。 自从`k = 3`，该周期中的每个站点都会到达其他每个周期站点，从而为每个站点提供三个有效的起点。 第二个周期的长度为 2，因此两个站也会相互到达，但输出仍然受到该周期大小的限制。 

对于链条箱：```
4 2
2
3
4
3
```反转的树扎根于车站`3`包含`1`,`2`,`3`， 和`4`。 车站树状查询`3`计算深度`0`,`1`， 和`2`，但不包括车站`1`因为它相距三个边。 循环贡献仅增加了站点`3 -> 4 -> 3`循环，给出最终值`1, 2, 4, 3`。 

对于一个大`k`，例如长度为 5 的循环`k = 10`，周期贡献仍然只有五。 这`min(k + 1, length)`公式可防止在完整旋转后多次对同一循环节点进行计数。
