---
title: "CF 19E-仙女"
description: "我们得到一个无向图。 每条边代表两点之间绘制的一段。 我们可以恰好删除一条边，删除它后我们希望剩余的图变成二分图。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "divide-and-conquer", "dsu"]
categories: ["algorithms"]
codeforces_contest: 19
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 19"
rating: 2900
weight: 19
solve_time_s: 110
verified: true
draft: false
---
[CF 19E - 仙女](https://codeforces.com/problemset/problem/19/E)

 **评分：** 2900
 **标签：** dfs 和类似、分而治之、dsu
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个无向图。 每条边代表两点之间绘制的一段。 我们可以恰好删除一条边，删除它后我们希望剩余的图变成二分图。 

如果我们可以使用两种颜色为每个顶点着色，使得每条边连接不同颜色的顶点，则图是二分图。 同一件事的另一种说法是，该图必须不包含奇数环。 

任务是输出每一条被删除的边，使整个图成为二分图。 

该图最多可以包含$10^4$顶点和$10^4$边缘。 如果常数因子很大，则该大小立即排除顶点和边中的任何二次方。 删除所有边并从头开始检查二分性的简单解决方案将执行完整的 DFS 或 BFS$m$次。 每张支票费用$O(n+m)$，因此总复杂度变为$O(m(n+m))$。 两个值都接近$10^4$，大约达到$2 \cdot 10^8$操作，这在Python中风险太大。 

棘手的部分是图表可能会断开连接。 这是一个粗心的实现，只有来自顶点 1 的 DFS 会错过其他组件中的奇数周期。 

当图已经是二分图时，会发生另一种微妙的情况。 然后删除任何边仍然留下二分图，因此必须打印每条边。 

例如：```
3 2
1 2
2 3
```该图已经是二分图了。 正确输出：```
2
1 2
```仅搜索参与奇数循环的“坏”边缘的错误方法可能会错误地不打印任何内容。 

还有一种相反的极端，即多个奇数周期独立存在。 如果删除一条边不能破坏所有奇数循环，则答案为空。 

例子：```
6 6
1 2
2 3
3 1
4 5
5 6
6 4
```有两个不相连的三角形。 删除一条边只会破坏一个三角形，而另一个奇数循环仍然存在。 正确输出：```
0
```天真的“边属于某个奇数循环”标准在这里失败了，因为每条边都位于奇数循环上，但没有一条边可以修复整个图。 

最困难的边缘情况是重叠奇数周期。 有时，几个奇数循环共享边，并且只有共享边才起作用。 

例子：```
5 6
1 2
2 3
3 1
3 4
4 5
5 3
```两个三角形共享顶点 3 但不共享边。 没有单个边缘移除会破坏两个奇数周期，因此答案仍然为空。 

## 方法

 蛮力的想法很简单。 对于每条边，暂时将其删除并使用 BFS 或 DFS 着色测试剩余图是否是二分图。 

双方检查本身是标准的。 我们在遍历过程中分配交替的颜色。 如果我们遇到连接具有相同颜色的顶点的边，则该图包含奇循环并且不是二分图。 

这是有效的，因为删除边缘与着色过程无关。 每个候选边都可以直接测试。 

问题是总成本。 我们重复一个$O(n+m)$对每条边进行图遍历，产生$O(m(n+m))$总体时间。 和$m = 10^4$，这变得太大了。 

关键的观察结果是奇数周期是双向性的唯一障碍。 仅当该边属于图中的每个奇数循环时，删除一条边才有帮助。 

这完全改变了问题。 我们不是在每次删除后重新计算二分性，而是研究单个 DFS 树内奇数循环的结构。 

假设我们通过深度奇偶性对图和颜色顶点进行 DFS。 树的边缘总是连接相反的颜色。 非树边的行为有所不同：

 如果它连接不同奇偶性的顶点，则形成偶循环。 

如果它连接相同奇偶校验的顶点，则形成奇循环。 

这些“坏”后边缘完全表征了图中的奇数周期。 

现在考虑如何删除一条边来消除所有奇数循环。 每个奇数循环对应于一个坏后边缘及其端点之间的树路径。 当一条边属于所有这些奇数循环时，它就是有效的。 

这就变成了DFS树上的一个计数问题。 

我们为每个坏后边缘沿其端点之间的路径分配一个贡献。 自下而上累积贡献后，每个树边都知道有多少个奇数循环经过它。 

如果该图恰好包含$k$由不良后沿引起的奇数周期，则：

 如果$k = 0$，每个边缘都有效。 

如果$k > 0$，一条边有效当且仅当它属于所有人$k$奇数周期。 

如果非树坏边是唯一负责一个奇数循环贡献的边，那么它们本身也起作用。 

这将整个问题简化为一次 DFS 加上一次累积传递。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(m(n+m))$|$O(n+m)$| 太慢了 |
 | 最佳 |$O(n+m)$|$O(n+m)$| 已接受 |

 ## 算法演练

 1. 构建无向图并存储每条边的索引。 
2. 在每个连接的组件上运行 DFS。 

在DFS期间，存储：

 - 每个顶点的深度
 - DFS树中的父边
 - 使用深度模 2 的奇偶颜色
 3. DFS 期间对边进行分类。 

如果已经访问过的邻居不是父邻居，我们就找到了后边缘。 

如果两个端点具有相同的奇偶校验，则该后沿将创建奇数周期。 
4. 全局计数所有奇数后沿。 

设该值为`odd_cnt`。 

如果`odd_cnt == 0`，该图已经是二分图，因此每条边都是有效的。 
5. 对于每个奇数后边缘$(u,v)$，添加路径贡献。 

认为`depth[u] > depth[v]`。 

增量`mark[u] += 1`递减`mark[v] -= 1`稍后，当我们通过 DFS 树向上聚合值时，从`u`到`v`收到一份贡献。 
6.再次DFS累加子树和。 

对于每个顶点，将子节点对父节点的贡献求和。 

让`sub[x]`表示最终的累计值。 

如果从父节点到子节点的树边有`sub[child] == odd_cnt`，那么每个奇数循环都会经过这条边，因此删除它可以修复图形。 
7. 单独处理非树奇边。 

每个奇数后沿单独属于一个奇数周期描述符。 这样的优势有效当且仅当`odd_cnt == 1`。 
8. 收集所有有效的边索引并排序打印它们。 

### 为什么它有效

 无向 DFS 中的每个奇数循环都可以由一个奇数后边加上连接其端点的树路径来表示。 

贡献传播准确地标记属于每个奇数循环的树边。 经过积累，`sub[x]`等于通过树边连接的奇数循环的数量`x`给它的父级。 

如果一条边属于所有奇数循环，则删除它会同时破坏每个奇数循环，从而使图成为二分图。 

如果一条边错过了甚至一个奇数周期，则该周期在移除后仍然存在，因此图仍然是非二分图。 

该算法精确地检查这个条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1 << 25)

n, m = map(int, input().split())

g = [[] for _ in range(n + 1)]
edges = [None]

for i in range(1, m + 1):
    u, v = map(int, input().split())
    edges.append((u, v))
    g[u].append((v, i))
    g[v].append((u, i))

depth = [0] * (n + 1)
visited = [False] * (n + 1)
parent = [0] * (n + 1)
parent_edge = [0] * (n + 1)

mark = [0] * (n + 1)

odd_edges = []
odd_cnt = 0

def dfs(u, pe):
    global odd_cnt

    visited[u] = True

    for v, idx in g[u]:
        if idx == pe:
            continue

        if not visited[v]:
            depth[v] = depth[u] + 1
            parent[v] = u
            parent_edge[v] = idx
            dfs(v, idx)
        elif depth[v] < depth[u]:
            if (depth[u] - depth[v]) % 2 == 0:
                odd_cnt += 1
                odd_edges.append(idx)

                mark[u] += 1
                mark[v] -= 1

for i in range(1, n + 1):
    if not visited[i]:
        dfs(i, -1)

if odd_cnt == 0:
    print(m)
    print(*range(1, m + 1))
    sys.exit()

ans = []

def collect(u, pe):
    subtotal = mark[u]

    for v, idx in g[u]:
        if idx == pe:
            continue

        if parent[v] == u:
            child_sum = collect(v, idx)

            if child_sum == odd_cnt:
                ans.append(idx)

            subtotal += child_sum

    return subtotal

for i in range(1, n + 1):
    if parent[i] == 0:
        collect(i, -1)

if odd_cnt == 1:
    ans.extend(odd_edges)

ans.sort()

print(len(ans))
print(*ans)
```第一个 DFS 构建 DFS 树并检测奇数后边缘。 奇偶校验测试来自DFS深度。 如果两个端点之间的深度差是偶数，则循环长度变为奇数。 

这`mark`array 实现路径累积。 对于奇怪的后边缘$(u,v)$，在更深的端点处递增并在祖先处递减会导致该路径上的每个树边缘在子树聚合期间接收一个贡献。 

第二个 DFS 自下而上计算子树总和。 如果树边恰好携带`odd_cnt`贡献，然后所有奇数周期都通过它。 

条件`depth[v] < depth[u]`避免对同一后边缘进行两次处理。 如果没有它，将从两个方向对无向边缘进行计数。 

对非树奇数边的单独处理是微妙的。 这样的边缘本身会闭合一个奇数循环。 仅当它是整个图中唯一的奇数循环描述符时，删除它才能修复图。 

必须增加递归限制，因为 DFS 树可能会变成一条长度较长的链$10^4$。 

## 工作示例

 ### 示例 1

 输入：```
4 4
1 2
1 3
2 4
3 4
```DFS遍历：

 | 步骤| 边缘 | 深度| 奇怪的后边缘？ | 奇数_cnt |
 | ---| ---| ---| ---| ---|
 | 1 | 1-2 | 1-2 0,1 | 没有 | 0 |
 | 2 | 2-4 | 2-4 1,2 | 没有 | 0 |
 | 3 | 4-3 | 2,3 | 没有 | 0 |
 | 4 | 3-1 | 3-1 3,0 | 没有 | 0 |

 不存在奇数循环。 该图已经是二分图了。 

输出：```
4
1 2 3 4
```此示例演示了特殊情况`odd_cnt == 0`。 每条边都是有效的，因为删除边不能破坏二分性。 

### 示例 2

 输入：```
3 3
1 2
2 3
3 1
```DFS遍历：

 | 步骤| 边缘 | 深度| 奇怪的后边缘？ | 奇数_cnt |
 | ---| ---| ---| ---| ---|
 | 1 | 1-2 | 1-2 0,1 | 没有 | 0 |
 | 2 | 2-3 | 2-3 1,2 | 没有 | 0 |
 | 3 | 3-1 | 3-1 2,0 | 是的 | 1 |

 贡献传播：

 | 顶点| 收集前标记| 最终子树总和 |
 | ---| ---| ---|
 | 3 | +1 | 1 |
 | 2 | 0 | 1 |
 | 1 | -1 | 0 |

 两个树边都接收值 1，等于`odd_cnt`。 

后边缘本身也起作用，因为`odd_cnt == 1`。 

输出：```
3
1 2 3
```该迹线表明单个奇数循环的每个边缘都是可移除的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n+m)$| 每条边和顶点都会被处理固定次数 |
 | 空间|$O(n+m)$| 图存储加DFS数组|

 至多有$10^4$顶点和边，线性复杂度很容易符合限制。 该算法仅对每个边执行两次 DFS 遍历和一些恒定时间操作。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    sys.setrecursionlimit(1 << 25)

    n, m = map(int, input().split())

    g = [[] for _ in range(n + 1)]
    edges = [None]

    for i in range(1, m + 1):
        u, v = map(int, input().split())
        edges.append((u, v))
        g[u].append((v, i))
        g[v].append((u, i))

    depth = [0] * (n + 1)
    visited = [False] * (n + 1)
    parent = [0] * (n + 1)

    mark = [0] * (n + 1)

    odd_edges = []
    odd_cnt = 0

    def dfs(u, pe):
        nonlocal odd_cnt

        visited[u] = True

        for v, idx in g[u]:
            if idx == pe:
                continue

            if not visited[v]:
                depth[v] = depth[u] + 1
                parent[v] = u
                dfs(v, idx)
            elif depth[v] < depth[u]:
                if (depth[u] - depth[v]) % 2 == 0:
                    odd_cnt += 1
                    odd_edges.append(idx)

                    mark[u] += 1
                    mark[v] -= 1

    for i in range(1, n + 1):
        if not visited[i]:
            dfs(i, -1)

    if odd_cnt == 0:
        print(m)
        print(*range(1, m + 1))
        return

    ans = []

    def collect(u, pe):
        subtotal = mark[u]

        for v, idx in g[u]:
            if idx == pe:
                continue

            if parent[v] == u:
                child = collect(v, idx)

                if child == odd_cnt:
                    ans.append(idx)

                subtotal += child

        return subtotal

    for i in range(1, n + 1):
        if parent[i] == 0:
            collect(i, -1)

    if odd_cnt == 1:
        ans.extend(odd_edges)

    ans.sort()

    print(len(ans))
    if ans:
        print(*ans)
    else:
        print()

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run(
"""4 4
1 2
1 3
2 4
3 4
"""
) == "4\n1 2 3 4\n"

# single triangle
assert run(
"""3 3
1 2
2 3
3 1
"""
) == "3\n1 2 3\n"

# two disconnected odd cycles
assert run(
"""6 6
1 2
2 3
3 1
4 5
5 6
6 4
"""
) == "0\n\n"

# no edges
assert run(
"""1 0
"""
) == "0\n\n"

# already bipartite chain
assert run(
"""5 4
1 2
2 3
3 4
4 5
"""
) == "4\n1 2 3 4\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单三角形 | 所有边均有效 | 一个奇数周期|
 | 两个不相连的三角形 | 空答案 | 一条边不能破坏多个奇数周期 |
 | 无边| 空答案 | 最小图 |
 | 简单链条| 所有边均有效 | 已经是二部图 |

 ## 边缘情况

 考虑没有奇数循环的图：```
4 3
1 2
2 3
3 4
```DFS 永远不会找到奇怪的后沿，所以`odd_cnt = 0`。 该算法立即输出所有边。 这是正确的，因为从二分图中删除任何边可以保留二分性。 

现在考虑两个断开的奇数周期：```
6 6
1 2
2 3
3 1
4 5
5 6
6 4
```DFS 检测到两个奇数后沿，因此`odd_cnt = 2`。 

每个树边仅从一个三角形接收贡献 1，而不是 2。没有边同时属于两个奇数循环，因此答案仍然为空。 

最后，考虑重叠结构：```
5 6
1 2
2 3
3 1
3 4
4 5
5 3
```DFS 发现两个奇数周期。 第一个三角形内的边仅收到一个贡献。 第二个三角形内的边也收到一项贡献。 无边缘到达`odd_cnt = 2`。 

该算法正确打印：```
0
```因为移除一条边仍然会留下另一个奇数循环。
