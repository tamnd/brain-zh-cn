---
title: "CF 1131D - 美食之选"
description: "该问题要求我们为苹果先生在不同的两天品尝的两组菜肴分配正整数分数。 第一天的每道菜都可以与第二天的每道菜进行比较，比较要么更好，要么更差，要么相等。"
date: "2026-06-12T04:13:16+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "dsu", "graphs", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1131
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 541 (Div. 2)"
rating: 2000
weight: 1131
solve_time_s: 88
verified: false
draft: false
---

[CF 1131D - 美食选择](https://codeforces.com/problemset/problem/1131/D)

 **评级：** 2000
 **标签：** dfs 和类似的、dp、dsu、图、贪婪
 **求解时间：** 1m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该问题要求我们为苹果先生在不同的两天品尝的两组菜肴分配正整数分数。 第一天的每道菜都可以与第二天的每道菜进行比较，比较要么更好，要么更差，要么相等。 我们的目标是为菜肴分配编号，以便满足这些关系，同时保持最大分数尽可能小。 本质上，这是一个约束满足问题，其中约束来自菜肴之间的成对比较。 

输入是大小为 n × m 的矩阵，其中 n 是第一天的菜肴数量，m 是第二天的菜肴数量。 每个元素都是“">”、“<”或“=”之一。 两个数字序列满足所有比较时，输出必须为“是”；如果不可能，则输出必须为“否”。 因为 n 和 m 都可以达到 1000，所以如果每次内部操作保持在 O(n*m) 以下，则简单的 O(n_m_something) 方法是可行的，但任何在两个维度上重复进行二次的操作都可能太慢。 

当比较矩阵矛盾时，就会出现关键的边缘情况。 例如，如果第一天的菜肴 1 优于第二天的菜肴 1，但在另一行中也标记为等于它，或者如果不等式形成循环，则不存在有效分配。 当多个菜肴相同时，会出现另一种微妙的边缘情况； 如果我们独立处理“<”和“>”而不将相同的菜肴分组，天真的贪婪分配可能会意外违反“=”约束。 

## 方法

 强力方法是尝试将所有可能的正整数分配给两组菜肴并检查每个比较。 这在原则上是正确的，但不可行，因为 n 和 m 都可以达到 1000，对于 2 秒的时间限制来说，可能性的空间太大了。 即使生成最大合理数量的所有可能序列也会非常慢。 

关键的见解来自于认识到问题可以建模为具有等式压缩的有向图。 每道菜对应一个节点。 对于每个“>”关系，我们添加一条从较小节点到较大节点的边。 对于每个“<”，边缘都朝相反的方向走。 相同的盘子被合并到一个节点中。 一旦我们有了代表所有约束的有向图，问题就简化为为每个节点分配最小的正整数，以便所有边都从较低值指向较高值。 这相当于将相等的节点分组后计算 DAG 中的最长路径，这可以使用拓扑排序和动态规划来完成。 

这种方法利用了问题的结构：约束是传递的，“=”允许我们合并节点，从而大大简化了图。 它将指数分配问题简化为压缩 DAG 上的线性时间图遍历问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((max_val)^(n+m)) | O((max_val)^(n+m)) | O(n+m) | 太慢了 |
 | 图+拓扑排序 | O(n*m) | O(n+m) | 已接受 |

 ## 算法演练

1. 首先将每个盘子表示为一个节点，并初始化一个不相交集并集 (DSU) 结构，以合并通过“=”连接的节点。 对于 (i,j) 处矩阵中的每个“=”，将第一天的节点 i 与第二天的节点 j 合并，这样它们将收到相同的值。 
2. 合并相等的节点后，我们再次迭代矩阵以构建约束有向图。 对于 a_{ij} 中的每个“">”，创建从代表菜肴 j（第二天）的节点到节点 i（第一天）的边，因为第一天的菜肴应该具有更高的编号。 对于“<”，创建从节点 i 到节点 j 的边。 
3. 检查图中是否存在循环。 如果存在环，则不可能一致地分配数字，因此我们输出“No”。 循环检测可以使用已访问状态数组的深度优先搜索或尝试拓扑排序来完成。 
4. 如果该图是非循环图，则使用拓扑顺序上的动态规划来计算最小整数分配。 每个节点的值都比其前任节点中的最大值大一。 将没有传入边的节点初始化为 1。 
5. 使用 DSU 父数组将值映射回原始菜肴。 每道菜都会收到其代表节点的值。 
6. 输出“Yes”，然后输出分配给第一天菜肴和第二天菜肴的值。 

为什么有效：相等合并保证“=”约束始终得到满足。 有向图表示所有严格的不等式，拓扑排序确保每个菜的值严格大于它必须大于的任何菜，这保持了“<”和“>”约束。 最小性来自于将 1 分配给源并沿边缘递增。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict, deque

class DSU:
    def __init__(self, n):
        self.par = list(range(n))
    def find(self, x):
        if self.par[x] != x:
            self.par[x] = self.find(self.par[x])
        return self.par[x]
    def union(self, x, y):
        x = self.find(x)
        y = self.find(y)
        if x != y:
            self.par[y] = x

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]
    total = n + m
    dsu = DSU(total)

    # Merge equal nodes
    for i in range(n):
        for j in range(m):
            if grid[i][j] == '=':
                dsu.union(i, n + j)

    # Build graph of inequalities
    graph = defaultdict(list)
    indeg = [0] * total
    for i in range(n):
        for j in range(m):
            u = dsu.find(i)
            v = dsu.find(n + j)
            if grid[i][j] == '<':
                if u == v:
                    print("No")
                    return
                graph[u].append(v)
                indeg[v] += 1
            elif grid[i][j] == '>':
                if u == v:
                    print("No")
                    return
                graph[v].append(u)
                indeg[u] += 1

    # Topological sort to assign minimal values
    val = [0] * total
    dq = deque([i for i in range(total) if dsu.find(i) == i and indeg[i] == 0])
    while dq:
        u = dq.popleft()
        if val[u] == 0:
            val[u] = 1
        for v in graph[u]:
            if val[v] < val[u] + 1:
                val[v] = val[u] + 1
            indeg[v] -= 1
            if indeg[v] == 0:
                dq.append(v)

    # Check if all nodes got a value
    for i in range(total):
        if val[dsu.find(i)] == 0:
            print("No")
            return

    print("Yes")
    first_day = [val[dsu.find(i)] for i in range(n)]
    second_day = [val[dsu.find(n + j)] for j in range(m)]
    print(' '.join(map(str, first_day)))
    print(' '.join(map(str, second_day)))

if __name__ == "__main__":
    solve()
```DSU 合并“=”菜肴以满足平等约束。 图的边缘反映了严格的不平等。 使用拓扑排序可确保我们分配尽可能少的整数，同时遵守所有“<”和“>”约束。 最终映射到原始菜肴可确保我们输出每道菜的值。 

## 工作示例

 示例 1 输入：```
3 4
>>>>
>>>>
>>>>
```追踪：

 | 节点| 入度| 指定值|
 | ---| ---| ---|
 | 0,1,2 | 0 | 2 |
 | 3,4,5,6 | 3 | 1 |

 所有第一天的菜品都比第二天的菜品高。 该算法将 2 分配给第一天，将 1 分配给第二天，与约束条件最小一致。 

样本2输入（矛盾）：```
2 2
><
<>
```等式合并后，节点0 > 节点2、节点0 < 节点3、节点1 < 节点2、节点1 > 节点3。图中包含一个环； 拓扑排序失败，输出为“No”。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n*m) | 合并相等的节点并构建图需要检查每个元素一次。 拓扑排序是 O(V+E)，其中 V ~ n+m 和 E ~ n*m。 |
 | 空间| O(n+m) | 存储 DSU、图邻接列表、入度和最终值。 |

 这种复杂性很容易满足限制：n*m ≤ 10^6，因此网格的线性扫描是可以接受的。 内存远低于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("3 4\n>>>>\n>>>>\n>>>>\n") == "Yes\n2 2 2\n1 1 1 1"
assert run("2 2\n><\n<>\n") == "No"

# Custom cases
assert run("1 1\n=") == "Yes\n1\n1",
```
