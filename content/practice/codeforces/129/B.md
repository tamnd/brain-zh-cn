---
title: "CF 129B - 学生和鞋带"
description: "我们可以将学生和鞋带建模为无向图。 每个学生都是一个顶点，两个学生之间的每条鞋带都是一条边。 在一轮中，每个学位恰好为 1 的学生都会同时被删除。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dfs-and-similar", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 129
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 94 (Div. 2 Only)"
rating: 1200
weight: 129
solve_time_s: 135
verified: true
draft: false
---

[CF 129B - 学生和鞋带](https://codeforces.com/problemset/problem/129/B)

 **评分：** 1200
 **标签：** 暴力破解、dfs 和类似、图表、实现
 **求解时间：** 2m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们可以将学生和鞋带建模为无向图。 每个学生都是一个顶点，两个学生之间的每条鞋带都是一条边。 

在一轮中，每个学位恰好为 1 的学生都会同时被删除。 当这些学生离开时，所有事件边缘也会消失。 这可能会为下一轮创建新的 1 度顶点。 该过程一直持续到没有度数为 1 的顶点为止。 

任务是计算发生了多少轮移除。 

这些约束足够小，我们不需要复杂的图论机制，但它们足够大，不小心的重复重新计算可能会变得昂贵。 如果我们在每一轮之后从头开始重新计算每个顶点的度数，那么在密集图中我们可能会多次扫描几乎所有边。 解决方案围绕$O(n + m)$或者$O(n^2)$这里绝对安全，而更近的地方$O(nm)$开始变得有风险。 

最危险的实施细节是同时删除。 假设我们将学生一一删除，而不是将整个组一起删除。 这会在一轮中改变图表，并可能错误地删除多余的学生。 

考虑这个图：```
1 - 2 - 3
```输入：```
3 2
1 2
2 3
```正确的流程是：

 第一轮将 1 和 3 一起移除。 

第二轮淘汰2人。 

答案=2。 

如果我们一次贪婪地删除一个，那么先删除 1 会使 2 立即变为度数 1，并且我们可能会在同一轮中错误地删除它。 

另一个容易犯的错误是孤立顶点处理不当。 度数为 0 的学生永远不会被删除，因为该规则仅删除度数为 1 的顶点。 

例子：```
3 0
```所有学生从一开始就被隔离。 没有人离开，所以答案是：```
0
```粗心的实现会删除度数最多为 1 的所有顶点，从而错误地生成 1。 

周期是另一个重要的边缘情况。 在一个循环中，每个顶点的度数都是 2，因此什么也不会发生。 

例子：```
4 4
1 2
2 3
3 4
4 1
```正确输出：```
0
```任何假设重复修剪最终删除每个连接组件的解决方案都会在这里失败。 

## 方法

 直接模拟很简单。 我们维护当前图，找到度为 1 的所有顶点，同时删除它们，更新图，然后重复，直到没有这样的顶点为止。 

暴力版本在每轮之后从头开始重新计算每个度数。 在最坏的情况下，长链每轮仅删除两个顶点。 如果有$n$顶点，我们可以执行关于$n/2$回合。 每次重新计算所有度数的成本$O(m)$，大致导致$O(nm)$。 

这仍然可以满足小的限制，但它做了不必要的工作，因为大多数边缘在轮次之间不会改变。 

关键的观察结果是，只有已删除顶点的邻居才能更改其度数。 一旦学生离开，我们只需要更新相邻学生的度数，而不需要重建所有内容。 

这将问题转化为分层的叶子去除过程。 我们保持当前的度数并重复删除度数为 1 的所有顶点。每条边仅在其端点之一消失时才进行处理，因此总工作量与图的大小呈线性关系。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(nm)$|$O(n + m)$| 概念上太慢|
 | 最佳|$O(n + m)$|$O(n + m)$| 已接受 |

 ## 算法演练

 1. 为图构建邻接表并计算每个顶点的度。 
2. 找到所有度数恰好为 1 的顶点。这些顶点就是第一轮被淘汰的学生。 
3. 当当前回合不为空时，一次处理一整轮。 
4. 将答案加 1，因为一组学生将被开除。 
5. 将当前回合中的每个顶点标记为已移除。 我们一起处理整个批次，因为移除是同时进行的。 
6. 对于每个移除的顶点，迭代其邻居。 
7. 如果邻居尚未被移除，则将其度数减 1，因为一个入射边消失了。 
8. 如果更新后邻居的度恰好变为 1，则将其放入下一轮。 
9. 用下一轮替换当前轮并继续。 
10. 当没有剩余 1 度顶点时，停止并打印轮数。 

### 为什么它有效

 在每时每刻，度数数组都与删除所有先前轮次后的当前图相匹配。 当前回合结束后，当顶点的度数变为 1 时，该顶点正好进入下一轮。 因为我们是批量处理删除的，所以该算法完全符合语句的同时删除规则。 没有顶点被移除得太早或太晚。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    graph = [[] for _ in range(n)]
    degree = [0] * n

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        graph[u].append(v)
        graph[v].append(u)

        degree[u] += 1
        degree[v] += 1

    removed = [False] * n

    current = deque()

    for i in range(n):
        if degree[i] == 1:
            current.append(i)

    rounds = 0

    while current:
        rounds += 1

        next_round = deque()

        current_nodes = list(current)
        current.clear()

        for node in current_nodes:
            removed[node] = True

        for node in current_nodes:
            for nei in graph[node]:
                if removed[nei]:
                    continue

                degree[nei] -= 1

                if degree[nei] == 1:
                    next_round.append(nei)

        current = next_round

    print(rounds)

solve()
```邻接列表有效地存储图，度数数组跟踪每个学生当前剩余邻居的数量。 

第一个循环收集所有初始叶子，即度数恰好为 1 的顶点。这些形成第一轮。 

微妙的部分是正确处理同时删除。 我们首先将当前队列中的所有顶点复制到`current_nodes`并在更新邻居之前将它们全部标记为已删除。 这可以防止回合内的一次删除影响同一回合中的另一个顶点是否仍然存在。 

这`removed`array 防止对已删除的顶点进行多次更新。 如果没有它，度数可能会变成负数，或者顶点可能会重复插入到未来的回合中。 

一个常见的错误是每当度数变得小于或等于 1 时就将顶点添加到下一轮。这会错误地删除孤立的顶点。 条件必须准确无误`degree[nei] == 1`。 

## 工作示例

 ### 示例 1

 输入：```
3 3
1 2
2 3
3 1
```初始图形是一个三角形。 

| 圆形| 当前度数数组 | 1 度顶点 | 删除了这一轮|
 | ---| ---| ---| ---|
 | 开始| [2,2,2]| 无 | 无 |

 没有顶点的度数为 1，因此该过程立即停止。 

回答：```
0
```这个例子表明循环永远存在，因为移除叶子永远不会开始。 

### 示例 2

 输入：```
4 3
1 2
2 3
3 4
```这是一个简单的链条。 

| 圆形| 当前度数数组 | 1 度顶点 | 删除了这一轮|
 | ---| ---| ---| ---|
 | 1 | [1,2,2,1]| 1, 4 | 1, 4 |
 | 2 | [0, 1, 1, 0] | 2, 3 | 2, 3 |
 | 结束 | [0, 0, 0, 0] | 无 | 无 |

 答案是：```
2
```该跟踪说明了为什么必须逐层进行删除。 仅当端点消失后，中间顶点才可移动。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n + m)$| 每个顶点和边仅被处理固定次数 |
 | 空间|$O(n + m)$| 邻接表、度数组、队列和移除数组 |

 这很容易满足限制。 即使对于最大的有效图，顶点和边上的线性处理也能在 2 秒限制内快速完成。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n, m = map(int, input().split())

        graph = [[] for _ in range(n)]
        degree = [0] * n

        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1

            graph[u].append(v)
            graph[v].append(u)

            degree[u] += 1
            degree[v] += 1

        removed = [False] * n

        current = deque()

        for i in range(n):
            if degree[i] == 1:
                current.append(i)

        rounds = 0

        while current:
            rounds += 1

            current_nodes = list(current)
            current.clear()

            next_round = deque()

            for node in current_nodes:
                removed[node] = True

            for node in current_nodes:
                for nei in graph[node]:
                    if removed[nei]:
                        continue

                    degree[nei] -= 1

                    if degree[nei] == 1:
                        next_round.append(nei)

            current = next_round

        return str(rounds)

    return solve()

# provided sample
assert run(
"""3 3
1 2
2 3
3 1
"""
) == "0", "sample 1"

# chain of length 4
assert run(
"""4 3
1 2
2 3
3 4
"""
) == "2", "simple chain"

# isolated vertices only
assert run(
"""5 0
"""
) == "0", "isolated vertices are never removed"

# star graph
assert run(
"""5 4
1 2
1 3
1 4
1 5
"""
) == "1", "center becomes isolated, not removable"

# single edge
assert run(
"""2 1
1 2
"""
) == "1", "both endpoints removed together"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 三角循环| 0 | 循环永远不会开始移除|
 | 长度 4 的链条 | 2 | 多轮分层清除 |
 | 无边| 0 | 0 度顶点永远保留 |
 | 星图| 1 | 中心变得孤立，不可移除|
 | 单边| 1 | 同步端点移除 |

 ## 边缘情况

 考虑孤立的顶点：```
3 0
```初始度数为`[0, 0, 0]`。 没有顶点的度数为 1，因此队列开始为空。 循环永远不会运行，答案仍然是 0。这符合规则，因为孤立的学生不会受到训斥。 

现在考虑一个星图：```
5 4
1 2
1 3
1 4
1 5
```初始度数为`[4, 1, 1, 1, 1]`。 

在第一轮中，顶点 2、3、4 和 5 同时被删除。 顶点 1 失去了 4 条边，其度数变为 0。由于只有度数为 1 的顶点可移除，因此该过程在一轮后停止。 答案是1。 

粗心的实现使用`degree <= 1`会在第二轮中错误地删除顶点 1。 

最后，考虑一条链：```
5 4
1 2
2 3
3 4
4 5
```第 1 轮删除顶点 1 和 5。 

度数变成`[0, 1, 2, 1, 0]`。 

第 2 轮删除顶点 2 和 4。 

度数变成`[0, 0, 0, 0, 0]`。 

顶点 3 永远不会变成度数 1，因为两个邻居在同一轮中消失。 该过程以答案 2 结束。 

这证实了同步更新的重要性。
