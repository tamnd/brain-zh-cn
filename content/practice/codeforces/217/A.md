---
title: "CF 217A - 滑冰"
description: "我们在二维网格上得到一组具有整数坐标的雪堆。 Bajtek 只能沿着 x 或 y 轴直线移动，从一个漂移处滑行，直到撞到另一个漂移处。"
date: "2026-06-05T00:53:21+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dfs-and-similar", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 217
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 134 (Div. 1)"
rating: 1200
weight: 217
solve_time_s: 87
verified: false
draft: false
---

[CF 217A - 滑冰](https://codeforces.com/problemset/problem/217/A)

 **评分：** 1200
 **标签：** 暴力破解、dfs 和类似、dsu、图表
 **求解时间：** 1m 27s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在二维网格上得到一组具有整数坐标的雪堆。 Bajtek 只能沿着 x 或 y 轴直线移动，从一个漂移处滑行，直到撞到另一个漂移处。 换句话说，如果两个雪堆共享相同的 x 坐标或相同的 y 坐标，则它们是相连的。 Bajtek 希望能够直接或间接地在任意两个雪堆之间移动，因此我们需要添加最少数量的新雪堆，以使集合在这些移动规则下完全连接。 

输入给出现有漂移的数量$n$（最多 100 个）及其坐标。 输出是一个整数：连接所有现有漂移所需的最少附加漂移。 的小值$n$表明一个$O(n^2)$解决方案是可以接受的，这使我们能够在确定连通性时考虑所有的漂移对。 

当漂移处于孤立的集群中时，就会出现一个微妙的问题。 例如，如果在 (1,1) 和 (2,2) 处有两个漂移，它们不能直接相互到达。 在 (1,2) 或 (2,1) 处添加一个漂移将它们连接起来。 粗心的方法可能会尝试仅考虑直接的成对移动或假设对角邻接有效，这将在这种情况下产生错误的零答案。 

另一种边缘情况是所有漂移都位于同一行或同一列。 例如，(1,1)、(1,2)、(1,3) 处的三个漂移已经形成单个连通分量，因此不需要新的漂移。 对此的误解可能会导致增加不必要的漂移。 

## 方法

 一种强力方法是尝试在 x 和 y 方向上从 1 到 1000 的每个整数坐标处放置新的漂移，直到网格连接为止。 这是不切实际的，因为即使对于$n = 100$，可能的放置数量约为$10^6$，并且反复检查连接性的成本很高。 

关键的见解来自于将雪堆视为一个图表：每个雪堆都是一个节点，如果节点共享相同的 x 或 y 坐标，则节点之间存在一条边。 然后，问题就简化为查找该图中连通分量的数量。 每个连接的组件都已经可以在内部访问。 连接$k$组件集成到一个连接的网络中，我们需要准确$k-1$额外的漂移，因为每个新的漂移可以桥接两个组件。 这类似于连接网络中的单独岛屿：以减少$k$岛屿为一，$k-1$桥梁是充分且必要的。 

一旦我们理解了这一点，解决方案就变得简单了：构建图表，计算连通分量，然后减一即可得到答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((1000*1000)^n) | O((1000*1000)^n) | O(1000*1000) | 太慢了|
 | 图+DFS/BFS | O(n^2) | O(n^2) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 将每个雪堆表示为图中的一个节点。 如果两个节点的 x 或 y 坐标匹配，则它们被连接。 这精确地模拟了滑动运动约束。 
2. 初始化一个已访问数组以跟踪已探索过哪些漂移。 
3. 迭代每个漂移。 如果尚未访问某个漂移，则从该漂移开始深度优先搜索 (DFS) 以标记所有可到达的漂移。 每个 DFS 调用都标识一个连接的组件。 
4. 计算步骤 3 中发现的连通分量的总数。 
5. 所需附加漂移的最小数量是连接组件的数量减一。 每个新漂移可以连接两个组件，因此$k-1$漂移连接$k$组件合而为一。 

工作原理：DFS 正确地发现从给定起始漂移沿有效移动可到达的所有漂移。 根据定义，每次 DFS 遍历都恰好标记一个连接的组件。 由于每个新漂移可以恰好桥接两个组件，因此连接$k$组件需要$k-1$额外的漂移，保证最小化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10000)

def main():
    n = int(input())
    drifts = [tuple(map(int, input().split())) for _ in range(n)]
    
    graph = [[] for _ in range(n)]
    for i in range(n):
        for j in range(i + 1, n):
            if drifts[i][0] == drifts[j][0] or drifts[i][1] == drifts[j][1]:
                graph[i].append(j)
                graph[j].append(i)
    
    visited = [False] * n
    
    def dfs(u):
        visited[u] = True
        for v in graph[u]:
            if not visited[v]:
                dfs(v)
    
    components = 0
    for i in range(n):
        if not visited[i]:
            dfs(i)
            components += 1
    
    print(components - 1)

if __name__ == "__main__":
    main()
```邻接表构造确保每个漂移都连接到共享 x 或 y 的所有其他漂移，直接建模合法的移动。 DFS 标记从起始漂移可到达的每个漂移，保证每个分量都被计数一次。`components - 1`给出连接所有组件的最小数量的附加漂移。 当所有漂移形成单个线性链时，我们增加递归限制以处理 DFS 中最坏情况的深度。 

## 工作示例

 **样品1**

 输入：```
2
2 1
1 2
```| 步骤| 访问过 | 组件 |
 | --- | --- | --- |
 | 开始 | [错误，错误] | 0 |
 | 从 0 开始的 DFS | [对，错] | 1 |
 | DFS 从 1 | [真实，真实]| 2 |

 输出：`2 - 1 = 1`解释：两个孤立的漂移需要一个新的漂移来连接。 

**自定义示例**

 输入：```
4
1 1
1 2
3 4
4 4
```| 步骤| 访问过 | 组件 |
 | --- | --- | --- |
 | 开始 | [F，F，F，F] | 0 |
 | 从 0 开始的 DFS | [T，T，F，F] | 1 |
 | DFS 从 2 | [T，T，T，T] | 2 |

 输出：`2 - 1 = 1`解释：两个组件 [(1,1),(1,2)] 和 [(3,4),(4,4)] 需要一个漂移来连接。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 构建邻接表对每对漂移进行一次比较； DFS 为 O(n+n^2) = O(n^2)。 |
 | 空间| O(n^2) | O(n^2) | 邻接列表存储共享 x 或 y 的每对漂移的边。 |

 给定$n \le 100$,$n^2 = 10000$操作在 2 秒的时间限制内轻松完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().strip()

# Provided sample
assert run("2\n2 1\n1 2\n") == "1", "sample 1"

# Custom cases
assert run("1\n5 5\n") == "0", "single drift needs no connection"
assert run("3\n1 1\n1 2\n1 3\n") == "0", "all drifts in same column"
assert run("4\n1 1\n1 2\n3 4\n4 4\n") == "1", "two separate components"
assert run("5\n1 1\n2 1\n3 1\n1 2\n2 2\n") == "0", "all drifts connected via x or y"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | (5,5) 处 1 次漂移 | 0 | 单节点，无需连接 |
 | 同列3漂| 0 | 通过垂直移动连接 |
 | 两个独立的组件| 1 | 正确计数断开连接的簇 |
 | 复杂连接集群| 0 | DFS 捕获所有可到达的漂移 |

 ## 边缘情况

 对于单个漂移`(5,5)`，DFS 访问该节点并没有找到邻居。 Components = 1，output = 0。对于沿一行或一列对齐的漂移，DFS 正确标记所有节点，因此 Components = 1，output = 0。当存在多个隔离集群时，DFS 独立发现每个集群，确保`components - 1`计算所需连接漂移的确切数量。 对于重叠的 x 或 y 坐标，邻接表构造保证表示每个可能的合法移动。
