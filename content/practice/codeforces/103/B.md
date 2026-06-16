---
title: "CF 103B - 克苏鲁"
description: "我们得到一个无向图，需要决定它是否匹配一个非常具体的结构。 该图应该恰好包含一个简单循环，并且每个其他顶点都必须属于附加到该循环上某个顶点的树。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 103
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 80 (Div. 1 Only)"
rating: 1500
weight: 103
solve_time_s: 103
verified: true
draft: false
---

[CF 103B - 克苏鲁](https://codeforces.com/problemset/problem/103/B)

 **评分：** 1500
 **标签：** dfs 和类似、dsu、图表
 **求解时间：** 1m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个无向图，需要决定它是否匹配一个非常具体的结构。 

该图应该恰好包含一个简单循环，并且每个其他顶点都必须属于附加到该循环上某个顶点的树。 另一种描述方式是该图是连通的并且恰好有一个循环。 

该声明将其表述为几棵有根的树，其根位于一个简单的循环上。 一旦循环被固定，从它分支出来的每条额外的边都会形成一棵附加到循环顶点之一的树。 

输入描述最多具有 100 个顶点的无向图。 每条边连接两个不同的顶点，并且不存在重复边或自环。 

约束很小，所以即使$O(n^2)$或者$O(n^3)$解决方案会很顺利地通过。 尽管如此，图结构给出了更清晰的表征，从而产生了简单的线性解决方案。 

关键的观察结果是，连通无向图仅包含一个循环当且仅当：$$m = n$$在哪里$n$是顶点数，$m$是边的数量。 

连通图与$n$顶点和$n-1$边缘是一棵树。 再添加一条边恰好创建一个循环。 这正是这里所需要的结构。 

一些边缘情况可能会破坏粗心的实现。 

考虑一个断开的图，其中一个组件是循环的。 

输入：```
4 4
1 2
2 3
3 1
4 4
```这个例子实际上是无效的，因为自循环是被禁止的，但重要的想法是一个在某处包含循环的断开图。 一个天真的检查`m == n`会错误地接受断开连接的图。 

一个有效的断开连接示例是：```
4 3
1 2
2 3
3 1
```正确的输出是：```
NO
```该图有环，但顶点 4 是孤立的，因此该图不连通。 

另一种棘手的情况是具有多个循环的连通图。 

输入：```
4 5
1 2
2 3
3 1
3 4
4 1
```正确的输出是：```
NO
```该图是连通的，但包含两个循环。 仅检查连接性的 DFS 在这里会失败。 

第三个重要的例子是纯树。 

输入：```
5 4
1 2
2 3
3 4
4 5
```正确的输出是：```
NO
```该图是连通的，但根本没有环。 

## 方法

 暴力方法会尝试显式检测循环并在删除循环后验证结构。 一种可能的方法是枚举边，暂时删除每一条边，然后检查图是否变成一棵树。 由于约束很小，所以这是有效的。 

对于每条边，我们可以：

 1. 去除边缘。 
2. 运行DFS 或BFS 检查连通性。 
3. 验证剩余的图是否是非循环的。 

这费用大约是$O(m \cdot (n + m))$。 和$n \le 100$，这还是够快的。 

一旦我们记住了经典的图属性，问题就会变得简单得多。 

对于无向图：

 - 一棵树恰好有$n-1$边缘。 
- 每一个额外的边缘都会引入一个额外的周期。 

所以一个连通图与$n$边缘恰好有一个周期。 

这与所需的“附有树木的循环”结构完美匹配。 不在循环上的每个顶点都必须属于悬挂在其上的树，因为第二个循环将需要另一个额外的边。 

这将整个问题减少为两项检查：

 1.图形必须是连通的。 
2.图形必须满足$m = n$。 

连接性通过单个 DFS 或 BFS 进行验证。 边数已在输入中给出。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m(n + m)) | O(m(n + m)) | O(n + m) | 已接受 |
 | 最佳| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 阅读图形并构建邻接表。 

邻接表允许在线性时间内进行高效的 DFS 遍历。 
2. 检查边数是否等于顶点数。 

恰好有一个循环的连通无向图必须满足$m = n$。 如果这个条件不成立，我们可以立即打印`"NO"`。 
3. 从任意顶点运行 DFS，例如顶点 1。 

DFS 标记每个可到达的顶点。 由于图是无向的并且连通性在全局范围内都很重要，因此一次遍历就足够了。 
4. 计算有多少个顶点被访问。 

如果某些顶点仍未被访问，则图将断开连接并且无法匹配所需的结构。 
5. 如果两个条件都成立，则打印`"FHTAGN!"`。 否则打印`"NO"`。 

### 为什么它有效

 该算法依赖于标准图定理。 

连通无向图$n$顶点和$n-1$边缘是一棵树。 恰好添加一条额外的边就创建了一个简单的循环。 

所以：

 - 如果图是连通的并且$m = n$，它恰好包含一个周期。 
- 每个剩余的边都属于附加到该循环的树。 
- 这正是问题中所需的定义。 

相反，每个有效的 Cthulhu 图都包含一个环和树枝，因此它必须是连通的，并且必须比树多包含一条边，这意味着$m = n$。 

这两个条件都是充分必要的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def dfs(node, graph, visited):
    visited[node] = True

    for nei in graph[node]:
        if not visited[nei]:
            dfs(nei, graph, visited)

def solve():
    n, m = map(int, input().split())

    graph = [[] for _ in range(n + 1)]

    for _ in range(m):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

    if m != n:
        print("NO")
        return

    visited = [False] * (n + 1)

    dfs(1, graph, visited)

    for node in range(1, n + 1):
        if not visited[node]:
            print("NO")
            return

    print("FHTAGN!")

solve()
```第一部分构建邻接表。 由于该图是无向的，因此每条边都在两个方向上插入。 

条件`m != n`在 DFS 之前检查，因为它会立即消除不可能的情况。 这避免了不必要的遍历工作。 

DFS 标记从顶点 1 可到达的所有顶点。如果图是连通的，则每个顶点最终都必须被访问。 

所有顶点上的循环显式验证连通性。 缺少此步骤是一个常见错误，因为仅检测循环是不够的。 

图的尺寸很小，因此递归深度在这里是完全安全的。 

## 工作示例

 ### 示例 1

 输入：```
6 6
6 3
6 4
5 1
2 5
1 4
5 4
```该图有：

 -$n = 6$-$m = 6$所以边数条件已经匹配。 

DFS遍历：

 | 步骤| 当前节点| 新访问 | 访问集 |
 | ---| ---| ---| ---|
 | 1 | 1 | 1 | {1} |
 | 2 | 5 | 5 | {1,5} |
 | 3 | 2 | 2 | {1,2,5} |
 | 4 | 4 | 4 | {1,2,4,5} |
 | 5 | 6 | 6 | {1,2,4,5,6} |
 | 6 | 3 | 3 | {1,2,3,4,5,6} |

 所有顶点都变得可达。 

输出：```
FHTAGN!
```该迹线展示了中心不变量：连通性加上$m=n$保证正好一个周期。 

### 示例 2

 输入：```
5 4
1 2
2 3
3 4
4 5
```这里：

-$n = 5$-$m = 4$该算法立即停止，因为`m != n`。 

| 变量| 价值|
 | ---| ---|
 | n | 5 |
 | 米 | 4 |
 | 条件 m == n | 假|

 输出：```
NO
```此示例说明了为什么简单的连接检查是不够的。 图是连通的，但它只是一棵树。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | DFS 访问每个顶点和边一次 |
 | 空间| O(n + m) | 邻接表和访问数组|

 由于最多有 100 个顶点，该解决方案远远低于限制。 即使慢得多的算法也可以通过，但线性方法更简单，数学上更清晰。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def dfs(node, graph, visited):
        visited[node] = True

        for nei in graph[node]:
            if not visited[nei]:
                dfs(nei, graph, visited)

    def solve():
        n, m = map(int, input().split())

        graph = [[] for _ in range(n + 1)]

        for _ in range(m):
            u, v = map(int, input().split())
            graph[u].append(v)
            graph[v].append(u)

        if m != n:
            return "NO"

        visited = [False] * (n + 1)

        dfs(1, graph, visited)

        for node in range(1, n + 1):
            if not visited[node]:
                return "NO"

        return "FHTAGN!"

    return solve()

# provided sample
assert run(
"""6 6
6 3
6 4
5 1
2 5
1 4
5 4
""") == "FHTAGN!", "sample 1"

# tree, connected but no cycle
assert run(
"""5 4
1 2
2 3
3 4
4 5
""") == "NO", "tree should fail"

# disconnected graph with one cycle
assert run(
"""4 3
1 2
2 3
3 1
""") == "NO", "disconnected graph should fail"

# connected graph with multiple cycles
assert run(
"""4 5
1 2
2 3
3 1
3 4
4 1
""") == "NO", "multiple cycles should fail"

# smallest valid cycle
assert run(
"""3 3
1 2
2 3
3 1
""") == "FHTAGN!", "simple cycle should pass"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 具有 5 个顶点的树 | 否 | 没有循环的连通图失败 |
 | 断开的三角形| 否 | 需要连接 |
 | 二周期图| 否 | 超过1个周期无效 |
 | 三角形| FHTAGN！ | 最小有效结构|

 ## 边缘情况

 一个只有一个周期的断开图可以欺骗仅检查的解决方案`m == n`。 

输入：```
6 6
1 2
2 3
3 1
4 5
5 6
6 4
```该图有两个不相连的组件。 从顶点1开始的DFS只访问顶点`{1,2,3}`。 

由于顶点 4、5 和 6 仍未被访问，因此访问检查失败。 

该算法正确打印：```
NO
```具有多个循环的连通图可以欺骗仅检查连通性的解决方案。 

输入：```
4 5
1 2
2 3
3 1
3 4
4 1
```该图是连通的，但是：$$m = 5,\quad n = 4$$自从`m != n`，算法立即拒绝它。 

输出是：```
NO
```树可以欺骗仅检查连接性的解决方案。 

输入：```
4 3
1 2
2 3
3 4
```DFS 访问每个节点，因此图是连通的。 但：$$m = 3,\quad n = 4$$缺少额外的边意味着没有循环。 

算法正确输出：```
NO
```
