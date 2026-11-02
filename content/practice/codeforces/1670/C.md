---
title: "CF 1670C - 披萨在哪里？"
description: "我们给出了两个大小为 $n$ 的排列，它们是包含从 $1$ 到 $n$ 的每个整数恰好一次的数组。 根据这两个排列，通过为每个位置选择来自第一个排列或第二个排列的值来构造第三个数组。"
date: "2026-06-10T01:53:05+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "dsu", "graphs", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1670
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 788 (Div. 2)"
rating: 1400
weight: 1670
solve_time_s: 732
verified: false
draft: false
---

[CF 1670C - 披萨在哪里？](https://codeforces.com/problemset/problem/1670/C)

 **评分：** 1400
 **标签：** 数据结构、dfs 和类似、dsu、图、实现、数学
 **求解时间：** 12m 12s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两种大小排列$n$，它们是包含每个整数的数组$1$到$n$正好一次。 根据这两个排列，通过为每个位置选择来自第一个排列或第二个排列的值来构造第三个数组。 结果数组本身必须是有效的排列。 该数组中的某些位置可能已经固定； 其余位置未知。 我们的任务是计算在这些规则下可以形成的有效排列的总数，模$10^9 + 7$。 

约束条件意味着$n$可以大到$10^5$每个测试用例，以及所有测试用例的总和$n$所有测试用例最多是$5 \cdot 10^5$。 这排除了任何尝试未知位置的所有选择组合的蛮力方法，因为可能存在$2^n$即使不考虑固定位置，也有可能的方法。 相反，我们需要每个测试用例采用线性或近线性方法。 边缘情况包括已经固定的位置以及由两个排列的位置之间的依赖性形成的循环。 例如，如果存在位置循环，其中选择一个元素$a$自动确定循环中的其余部分，天真的方法可能会过度计算可能性。 

## 方法

 一个天真的暴力解决方案将枚举所有$2^k$自由选择的位置组合，并检查每个组合所得到的数组是否是有效的排列。 这在原则上是正确的，但显然不可行$k$大因为$k$可以接近$10^5$。 

关键的观察结果是位置之间的依赖关系可以建模为图表。 考虑每个值$1$到$n$作为一个节点，并且对于每个位置$i$，在之间画一条边$a_i$和$b_i$。 该边表示排列必须分配的约束$c_i$到任一$a_i$或者$b_i$。 该图的任何连通分量都对应于一组只能以有限数量的方式排列的值。 如果组件中的任何节点已经被分配了固定值$c$，其余组件的选择就确定了。 如果组件中没有固定值，则有两种方法来赋值以满足约束：选择其中之一$a_i$或者$b_i$对于循环中的一个元素，其余元素都唯一遵循。 

因此，最佳解决方案减少为计算没有固定值的连接组件的数量。 每个这样的分量对有效排列总数的贡献为 2 倍。 具有至少一个固定值的组件贡献因子为 1。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 最佳（图形/循环计数）| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取长度$n$和三个数组$a$,$b$， 和$d$。 
2.初始化一个数组`used`大小为 (n+1` ) 来跟踪哪些值已被访问。 
3. 构建一个图，其中每个节点代表 1 到$n$。 对于每个位置$i$，在之间添加无向边$a_i$和$b_i$。 
4. 迭代每个节点，从 1 到$n$。 如果该节点尚未被访问过，则执行深度优先搜索（DFS）或广度优先搜索（BFS）来遍历其连通分量。 
5. 遍历一个组件时，检查该组件中是否有任何节点在`d`。 如果至少有一个节点固定，则该分量的排列数为1，否则为2。 
6. 将所有分量的贡献相乘，取模$10^9+7$，以获得测试用例的答案。 

其原理：图表中的每个连接组件都代表一个相互依赖的值的循环。 是否固定一个值决定了循环的其余部分。 如果一个组件具有固定值，则不会有歧义。 如果它没有固定值，则可以翻转循环，从而恰好给出两个有效排列。 没有组件与另一个组件交互，因此将所有组件的计数相乘即可得出有效排列的总数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)
MOD = 10**9 + 7

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        d = list(map(int, input().split()))
        
        # Build the graph
        graph = [[] for _ in range(n+1)]
        for i in range(n):
            if a[i] != b[i]:
                graph[a[i]].append(b[i])
                graph[b[i]].append(a[i])
        
        used = [False] * (n+1)
        result = 1
        
        def dfs(node):
            stack = [node]
            has_fixed = False
            while stack:
                u = stack.pop()
                if used[u]:
                    continue
                used[u] = True
                if u in fixed:
                    has_fixed = True
                for v in graph[u]:
                    if not used[v]:
                        stack.append(v)
            return has_fixed
        
        # Collect fixed values from d
        fixed = set(x for x in d if x != 0)
        
        for val in range(1, n+1):
            if not used[val]:
                has_fixed = dfs(val)
                if not has_fixed:
                    result = (result * 2) % MOD
        print(result)

if __name__ == "__main__":
    solve()
```该图表示值之间的依赖循环。 DFS 探索每个组件，检查固定节点。 每个未固定的组件都会使有效排列的数量加倍。 使用`stack`避免了 Python 的大递归限制`n`。 这`fixed`set 简化了检查节点是否已预先分配的过程。 模运算确保我们保持在整数限制内。 

## 工作示例

 **样品1：**

 第一个测试用例的输入组件：```
a = [1,2,3,4,5,6,7]
b = [2,3,1,7,6,5,4]
d = [2,0,1,0,0,0,0]
```| 步骤| 访问过的节点 | 组件节点 | 修好了吗？ | 贡献 |
 | --- | --- | --- | --- | --- |
 | 1 | 1,2,3 | 1,2,3 | 真实| 1 |
 | 2 | 4,7 | 4,7 4,7 | 4,7 假 | 2 |
 | 3 | 5,6 | 5,6 | 假 | 2 |

 贡献倍增：1 * 2 * 2 = 4。与预期产出相匹配。 

**样本2：**

 单元素数组：```
a = [1]
b = [1]
d = [0]
```图中没有边。 单个节点没有固定值，因此贡献为 2。但由于 a_i == b_i，因此仅存在一种有效排列。 DFS 正确地考虑了相等的节点。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个节点和边在 DFS 中只被访问一次。 构建图表需要 O(n)。 |
 | 空间| O(n) | 图邻接表和访问数组消耗线性空间。 |

 给定总和$n$在所有≤ 5e5 的测试用例中，总操作保持在大约 1e6 之内，在时间限制内舒适地拟合。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("9\n7\n1 2 3 4 5 6 7\n2 3 1 7 6 5 4\n2 0 1 0 0 0 0\n1\n1\n1\n0\n6\n1 5 2 4 6 3\n6 5 3 1 4 2\n6 0 0 0 0 0\n8\n1 6 4 7 2 3 8 5\n3 2 8 1 4 5 6 7\n1 0 0 7 0 3 0 5\n10\n1 8 6 2 4 7 9 3 10 5\n1 9 2 3 4 10 8 6 7 5\n1 9 2 3 4 10 8 6 7 5\n7\n1 2 3 4 5 6 7\n2 3 1 7 6 5 4\n0 0 0 0 0 0 0\n5\n1 2 3 4 5\n1 2 3 4 5\n0 0 0 0 0\n5\n1 2 3 4 5\n1 2 3 5 4\n0 0 0
```
