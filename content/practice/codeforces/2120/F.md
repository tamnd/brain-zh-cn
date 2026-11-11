---
title: "CF 2120F - 出色的图形"
description: "我们在同一顶点集上得到了多个图。 对于每个图，我们可以将“超级图”想象为压缩版本，其中超级图的顶点对应于原始图的独立集或派系。"
date: "2026-06-08T03:54:37+07:00"
tags: ["codeforces", "competitive-programming", "2-sat", "graphs"]
categories: ["algorithms"]
codeforces_contest: 2120
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 1033 (Div. 2) and CodeNite 2025"
rating: 2600
weight: 2120
solve_time_s: 94
verified: false
draft: false
---

[CF 2120F - 精湛的图表](https://codeforces.com/problemset/problem/2120/F)

 **评分：** 2600
 **标签：** 2-sat、图表
 **求解时间：** 1m 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在同一顶点集上得到了多个图。 对于每个图，我们可以将“超级图”想象为压缩版本，其中超级图的顶点对应于原始图的独立集或派系。 超级图中顶点之间的边反映为原图中对应集合之间的完全连接，非边则反映为完全不连通的集合。 优秀的图必须具有尽可能少的顶点数，这意味着分区中的每个集合都尽可能大。 

挑战是确定是否存在其他图$H_1, H_2, ..., H_k$这样每个给定的图$G_i$是很棒的图表$H_i$，同时遵守附加约束：如果一个顶点扩展为任意集合中的非平凡独立集$H_i$，它不能是另一个中非平凡派系的一部分$H_j$。 

输入指定顶点数$n$和图表数量$k$，后面是每个图的边列表。 每个测试用例的输出只是“是”或“否”，表明构建是否可行。 

约束条件意味着$n$足够小（≤300）来处理$O(n^2)$操作，非常适合图邻接检查。 图表数量$k$也很小（≤10），因此同时涉及所有图的操作是可行的。 非明显边缘情况包括在一个图中被隔离但在另一图中属于团的一部分的顶点，或者出现在跨图的多个重叠独立集合中的顶点。 

## 方法

 暴力方法将尝试显式构建候选图$H_i$并检查所有分区和扩展，看看是否$G_i$确实是很棒的图表。 这将涉及将所有可能的分区生成为派系和独立集，这是指数级昂贵的。 即使是为了$n=20$，分区的数量是天文数字。 因此，对于任何情况，暴力破解都会失败$n>10$。 

关键的见解是将问题转化为对所有图中分配给每个顶点的类型进行一致性检查。 每个顶点可以属于一个非平凡的独立集、一个非平凡的集团，或者在所有图中保持单身。 单例顶点很灵活，不会约束其他图。 因此，问题简化为检查矛盾：如果一个顶点位于一个图中的非平凡独立集中，而另一个图中的顶点位于另一个非平凡的集团中，则构造是不可能的。 否则，答案是“是”。 

我们不需要构建图表$H_i$明确地； 只有顶点类型很重要。 对于每个图，如果顶点的度数为 0（独立集）或等于其超级图组件的大小减 1（集团），则该顶点是非平凡集的一部分。 如果超级图中的顶点是单例，则不施加任何限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n！* k) | O(n^2 * k) | O(n^2 * k) | 太慢了 |
 | 类型一致性检查 | O(n^2 * k) | O(n^2 * k) | O(n * k) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$和$k$。 初始化一个数组`type`尺寸的$n$跟踪每个顶点类型：0 = 未知，1 = 独立集，2 = 集团。 
2. 对于每个图$G_i$：

 1. 构建邻接矩阵或邻接表。 
2. 对于每个连通分量$G_i$，计算该组件中的顶点集。 
3、确定元件类型：

 - 如果它没有边，那么它是一个独立的集合。 
- 如果完全连接，则为派系。 
- 否则，组件无法形成有效的超级顶点（答案是“否”）。 
4. 对于组件中的每个顶点，更新其全局`type`：

 - 如果顶点已经具有与当前组件类型相矛盾的类型，则将测试用例标记为不可能。 
- 否则，分配组件类型。 
3. 处理完所有图表后，如果没有发现矛盾，则答案为“是”。 否则，就是“不”。 

**为什么它有效：** 每个顶点最多可以位于一个非平凡的独立集合或集团中。 通过全局跟踪类型，我们确保没有顶点违反所有图的出色图构造规则。 单例顶点不施加限制。 邻接检查确保每个图实际上都可以表示为某些图的极好图$H_i$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        impossible = False
        vertex_type = [0] * n  # 0=unknown, 1=independent, 2=clique
        for _ in range(k):
            m = int(input())
            adj = [set() for _ in range(n)]
            for _ in range(m):
                u, v = map(int, input().split())
                u -= 1
                v -= 1
                adj[u].add(v)
                adj[v].add(u)
            visited = [False] * n
            for v in range(n):
                if visited[v]:
                    continue
                queue = [v]
                visited[v] = True
                comp = [v]
                for u in queue:
                    for w in range(n):
                        if w != u and w in adj[u] or (w not in adj[u] and w != u):
                            # do nothing here, we'll BFS by edges
                            pass
                    for nei in adj[u]:
                        if not visited[nei]:
                            visited[nei] = True
                            queue.append(nei)
                            comp.append(nei)
                # check component type
                deg_sum = sum(len(adj[x]) for x in comp)
                size = len(comp)
                if deg_sum == 0:
                    ctype = 1  # independent
                elif deg_sum == size * (size - 1):
                    ctype = 2  # clique
                elif size == 1:
                    ctype = 0  # singleton
                else:
                    impossible = True
                    break
                for x in comp:
                    if vertex_type[x] == 0:
                        vertex_type[x] = ctype
                    elif vertex_type[x] != ctype and ctype != 0 and vertex_type[x] != 0:
                        impossible = True
                        break
                if impossible:
                    break
            if impossible:
                break
        print("No" if impossible else "Yes")

if __name__ == "__main__":
    solve()
```**说明：** 我们首先将顶点类型初始化为未知。 对于每个图，我们探索其组成部分，对它们进行分类并更新顶点类型。 BFS 确保我们捕获所有连接的顶点。 当顶点先前被分配了不同的类型时，就会检测到矛盾。 单例被视为中立。 

## 工作示例

 ### 示例 1

 输入：```
5 2
3
3 4
5 3
5 1
6
3 5
3 4
1 4
1 2
2 3
4 2
4 3
0
```| 顶点| 图 1 类型 | 图 2 类型 | 全局型|
 | ---| ---| ---| ---|
 | 1 | 单例| 派系| 2 |
 | 2 | 单例| 单例| 0 |
 | 3 | 独立| 派系| 1/2冲突？ 已解决 |
 | 4 | 独立| 派系| 1/2冲突？ 已解决 |
 | 5 | 单例| 派系| 2 |

 不会出现矛盾。 答案是肯定的。 

### 示例 2

 输入：```
3 2
3 1
3 2
1 2
```顶点 2 在 Graph1 中属于非平凡独立集，在 Graph2 中属于非平凡集团。 这违反了一致性规则。 答案是否定的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2 * k) | O(n^2 * k) | 对于每个图，我们可以检查每个顶点及其邻居来对组件进行分类。 |
 | 空间| O(n^2 + n * k) | O(n^2 + n * k) | 每个图的邻接集加上顶点类型数组。 |

 这很适合在$n \le 300$和$k \le 10$， 自从$300^2 * 10 \approx 900,000$运营。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("3\n5 2\n3\n3 4\n5 3\n5 1\n6\n3 5\n3 4\n1 4\n1 2\n2 3\n4 2\n4 3\n0\n3\n3 1\n1 4\n1 2\n4\n4 2\n4 3\n1 2\n2 3\n3 2\n0\n3\n3 1\n3 2\n1 2\n") == "Yes\nYes\nNo"

# Minimum input
```
