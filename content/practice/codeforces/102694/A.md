---
title: "CF 102694A - 树的周长"
description: "树被视为一个几何对象，其中直径是任意两个节点之间的最长路径。 该问题定义了一个不寻常的周长版本：我们使用 pi = 3，而不是 pi 的实际值。"
date: "2026-08-01T23:22:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102694
codeforces_index: "A"
codeforces_contest_name: "AlgorithmsThread Tree Basics Contest"
rating: 0
weight: 102694
solve_time_s: 59
verified: true
draft: false
---

[CF 102694A - 树的周长](https://codeforces.com/problemset/problem/102694/A)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 树被视为一个几何对象，其中直径是任意两个节点之间的最长路径。 该问题定义了一个不寻常的周长版本：我们使用 pi = 3，而不是 pi 的实际值。由于周长通常是直径乘以 pi，因此所需的答案是树直径的三倍。 输入描述了一个无向树`n`顶点和`n - 1`边缘，输出是修改后的定义下的周长值。 

主要任务不是模拟任何几何体。 就是求一棵树中两个顶点之间的最长距离。 该约束允许最多`3 * 10^5`顶点，因此需要一种能够对树进行固定次数探索的算法。 尝试每对顶点的方法需要大约`n^2 / 2`对，变成周围`4.5 * 10^10`检查最大输入，并且远远超出一秒限制可以支持的范围。 

边缘情况来自树的结构。 单个顶点没有边，因此其直径为零，答案也必须为零。 例如：```
Input:
1

Output:
0
```在构建邻接列表或从不存在的邻居运行搜索时，假设始终存在至少一条边的粗心实现可能会失败。 

有两个顶点的树的直径为一，而不是二。 例如：```
Input:
2
1 2

Output:
3
```最长的路径包含一条边，因此周长为`1 * 3`。 一个常见的错误是计算顶点而不是边并生成`6`。 

星形树是另一个有用的例子。 例如：```
Input:
5
1 2
1 3
1 4
1 5

Output:
6
```最长的路径从一片叶子经过中心到达另一片叶子，包含两条边。 仅检查一个任意根的最深子级的实现可能会错误地返回 1 而不是 2。 

## 方法

 直接的解决方案是计算每对顶点之间的距离并保留最大值。 对于每个起始顶点，我们可以运行 DFS 或 BFS 来查找到每个其他顶点的距离。 这是正确的，因为直径恰好是所有对之间的最大距离。 然而，从每个顶点执行此操作的成本`O(n^2)`时间。 和`n = 300000`，这将需要数百亿次运算。 

树的有用特性是只需两次遍历即可找到直径。 选择任意起始顶点并找到距它最远的顶点。 该顶点保证是直径的一个端点。 然后从该端点开始另一次遍历。 第二次遍历找到的最远距离就是直径长度。 

这样做的原因来自于树中路径的形状。 每对顶点之间都只有一条路径。 如果我们从任意点开始，尽可能远地移动会将我们带向树的最末端。 从该极端开始的第二次搜索到达相反的极端，给出最长的可能路径。 

在找到边数的直径后，最终的答案很简单`diameter * 3`因为该问题将 pi 定义为 3。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 为树建立邻接表。 每条边连接两个顶点，因此必须存储两个方向，因为树是无向的。 
2.从任意顶点运行DFS或BFS，例如vertex`1`，并记录距该顶点的距离。 找到距离最大的顶点。 

第一次遍历不需要从特殊的顶点开始。 它找到的最远顶点足以开始实际直径搜索。 

1. 从上一步中找到的顶点运行第二个 DFS 或 BFS。 再次记录距离并取得达到的最大距离。 

该最大距离是按边缘测量的树的直径。 

1. 将直径乘以`3`并打印结果。 

该算法正确的原因是树的每对顶点之间都有唯一的路径。 第一次遍历到达最长路径一侧的叶子。 从该端点开始，第二次遍历必须到达最长路径的相反端点，因此找到的最大距离恰好是直径。 由于已考虑通过此端点的每个有效直径路径，因此不能存在更大的距离。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def farthest(start, graph):
    stack = [(start, -1, 0)]
    best_node = start
    best_dist = 0

    while stack:
        node, parent, dist = stack.pop()

        if dist > best_dist:
            best_dist = dist
            best_node = node

        for nxt in graph[node]:
            if nxt != parent:
                stack.append((nxt, node, dist + 1))

    return best_node, best_dist

def solve():
    n = int(input())

    graph = [[] for _ in range(n + 1)]

    for _ in range(n - 1):
        a, b = map(int, input().split())
        graph[a].append(b)
        graph[b].append(a)

    if n == 1:
        print(0)
        return

    endpoint, _ = farthest(1, graph)
    _, diameter = farthest(endpoint, graph)

    print(diameter * 3)

if __name__ == "__main__":
    solve()
```邻接表将树存储在`O(n)`内存，这是必要的，因为必须访问每条边。 辅助函数`farthest`执行迭代 DFS。 使用显式堆栈可以避免可能是长度链的树上的 Python 递归深度问题`300000`。 

第一次致电`farthest`仅确定直径搜索的良好起始端点。 它返回的距离被忽略，因为它不一定是最终直径。 第二次调用从该端点开始，其返回的距离是实际直径。 

找到直径后进行乘法。 直径计算边缘，因此路径`k`边缘有圆周`3k`。 Python 中不存在整数溢出问题，因为整数会自动增长。 

## 工作示例

 ### 示例 1

 输入：```
1
```该树仅包含一个顶点。 

| 步骤| 起始节点 | 最远节点 | 直径| 回答 |
 | --- | --- | --- | --- | --- |
 | 初始树 | 1 | 1 | 0 | 0 |

 该示例证实了孤立顶点的情况。 不同顶点之间没有路径，因此直径为零。 

### 示例 2

 输入：```
5
4 2
1 4
5 4
3 4
```这棵树是一颗以顶点为中心的星形树`4`。 

| 步骤| 起始节点 | 最远节点 | 最大距离|
 | --- | --- | --- | --- |
 | 第一次穿越 | 1 | 2 | 2 |
 | 第二次遍历| 2 | 1 | 2 |

 第二次遍历找到两条边的直径。 乘以三得出所需的周长为六。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 树被遍历两次，并且每条边都被处理固定次数。 |
 | 空间| O(n) | 邻接表和 DFS 堆栈最多包含线性数量的元素。 |

 最大输入大小为`300000`顶点，因此需要线性算法。 两棵树的遍历足够小，可以轻松地适应限制。 

## 测试用例```python
import sys
import io

def solve(data):
    sys.stdin = io.StringIO(data)
    input = sys.stdin.readline

    n = int(input())
    graph = [[] for _ in range(n + 1)]

    for _ in range(n - 1):
        a, b = map(int, input().split())
        graph[a].append(b)
        graph[b].append(a)

    def farthest(start):
        stack = [(start, -1, 0)]
        node = start
        dist = 0

        while stack:
            cur, parent, d = stack.pop()
            if d > dist:
                node = cur
                dist = d
            for nxt in graph[cur]:
                if nxt != parent:
                    stack.append((nxt, cur, d + 1))
        return node, dist

    if n == 1:
        return "0"

    a, _ = farthest(1)
    _, d = farthest(a)
    return str(d * 3)

assert solve("1\n") == "0", "single vertex"

assert solve("""3
3 2
2 1
""") == "6", "sample 2"

assert solve("""5
4 2
1 4
5 4
3 4
""") == "6", "sample 3"

assert solve("""2
1 2
""") == "3", "two vertices"

assert solve("""5
1 2
1 3
1 4
1 5
""") == "6", "star tree"

assert solve("""6
1 2
2 3
3 4
4 5
5 6
""") == "15", "long chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单顶点| 0 | 处理尽可能最小的树 |
 | 两个顶点 | 3 | 确认直径计算的是边，而不是顶点 |
 | 星树| 6 | 检查分支结构 |
 | 长链| 15 | 15 检查最大深度样式树 |
 | 案例案例| 6 | 确认标准示例 |

 ## 边缘情况

 对于单顶点树：```
Input:
1
```该算法跳过遍历并直接返回零。 如果没有此条件，假设存在第二端点的代码可能会访问无效数据。 

对于二顶点树：```
Input:
2
1 2
```第一次遍历找到距离为一的另一个顶点。 第二次遍历也发现最大距离为1，所以答案是`1 * 3 = 3`。 这证实了距离是通过边缘测量的。 

对于星树：```
Input:
5
1 2
1 3
1 4
1 5
```从顶点开始`1`，最远的节点是距离为一的叶子。 从其中一个叶子开始，第二次遍历到达距离为 2 的另一个叶子。 该算法正确地找到通过中心的路径，而不是只考虑直接子节点。
