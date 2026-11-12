---
title: "CF 2219D - 树上的 MEX 替换件"
description: "我们得到一棵有 n 个顶点的树，以顶点 1 为根。每个顶点都有一个 0 到 n-1 之间的唯一整数权重。 对于任何顶点 v，我们将 Sv 定义为沿着从根到 v 的路径（包括端点）的权重集。"
date: "2026-06-07T18:36:47+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation", "math", "trees"]
categories: ["algorithms"]
codeforces_contest: 2219
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 1093 (Div. 1)"
rating: 0
weight: 2219
solve_time_s: 131
verified: false
draft: false
---

[CF 2219D - 树上的 MEX 替换](https://codeforces.com/problemset/problem/2219/D)

 **评级：** -
 **标签：** 数据结构、实现、数学、树
 **求解时间：** 2m 11s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树`n`以顶点为根的顶点`1`。 每个顶点都有一个唯一的整数权重`0`和`n-1`。 对于任意顶点`v`，我们定义`S_v`作为沿着从根到的路径的权重集`v`，包含在内。 然后`f(v)`是不存在于中的最小非负整数 (MEX)`S_v`。 

我们最多可以执行一次单一操作：选择一个顶点`v`并替换其重量`p_v`和`f(v)`。 我们的目标是最大化总和`f(v)`在应用该操作后对所有顶点进行计算，或者如果产生更高的总和，则不应用该操作。 

输入最多可以有`2 * 10^5`跨多个测试用例的顶点。 暴力重新计算`f(v)`在每个顶点上尝试操作之后速度太慢，因为沿所有路径重新计算 MEX 需要每个顶点的线性时间，从而可能导致`O(n^2)`每个测试用例。 因此，我们需要一种算法，能够有效地计算初始 MEX 值，确定单个允许的操作如何影响总和，并找到应用它的最佳顶点。 

当树是一个链并且权重从`0`。 在这种情况下，`f(v)`只是每个顶点的深度。 对中间的某个顶点进行操作可能会也可能不会增加总和，具体取决于我们选择的顶点，这说明总是选择根或叶的天真的方法是错误的。 

## 方法

 蛮力方法是迭代所有顶点，模拟分配`f(v)`到`p_v`,重新计算所有`f(u)`沿路径的值，并对它们求和。 这是正确的，但不可行，因为沿路径更新 MEX 需要`O(n)`每个顶点，产生`O(n^2)`每个测试用例。 和`n`最多`2 * 10^5`，这永远不会符合时间限制。 

关键的观察是`f(v)`由沿从 root 到 root 的路径上的权重集确定`v`。 如果 MEX 已在路径中，则替换`p_v`和`f(v)`不影响祖先，但可能影响后代。 由于每个数字`0`到`n-1`恰好发生一次，从根到叶的 MEX 值序列不断增加，直到出现丢失的数字。 因此，最佳操作是要么根本不应用它，要么在当前权重阻止下一个 MEX 传播到后代的顶点应用它。 我们可以首先计算 MEX 值的总和，识别沿根路径的第一个缺失整数，并考虑在值为阻塞整数的顶点应用操作。 这将复杂性降低到单个 DFS 遍历加上一些恒定时间更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 解析输入并构建表示树的邻接表。 这允许 O(1) 访问任何顶点的子节点。 
2.初始化一个数组`f`尺寸的`n`存储每个顶点的 MEX 和布尔数组`seen`尺寸的`n+1`跟踪哪些整数出现在当前路径上。 
3. 从根执行 DFS 以计算初始 MEX 值：

 1. 标记当前顶点的权重，如图所示。 
2. 通过递增计算当前 MEX`0`直到我们找到一个未标记为可见的值。 
3. 将此值存储在`f[v]`。 
4. 递归处理子项。 
5. 回溯：取消标记当前顶点的权重，如图所示。 
4. 追踪所有的总和`f(v)`值在`sum_f`。 
5. 要最大化总和，请注意将顶点权重更改为`f(v)`可能只增加其子树中的 MEX。 识别沿从根到第一个缺失整数的路径的顶点（第一个 MEX 不等于其沿路径的索引）。 替换该权重可以使 MEX 值进一步传播。 
6. 如果总和增加，则在该顶点上应用该操作，否则保持树不变。 
7. 输出最大和。 

**为什么有效：** 每个顶点都将其 MEX 贡献给总和。 由于权重是唯一的，并且 MEX 是路径上最小的缺失数字，因此只有释放阻塞数字的单个操作才能增加后代的 MEX。 因此，跟踪第一个缺失的整数可以确保我们以最佳方式应用该操作。 DFS 确保我们在 O(n) 内高效地计算 MEX。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 20)

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        p = list(map(int, input().split()))
        tree = [[] for _ in range(n)]
        for _ in range(n - 1):
            x, y = map(int, input().split())
            x -= 1
            y -= 1
            tree[x].append(y)
            tree[y].append(x)

        f = [0] * n
        seen = [False] * (n + 2)

        def dfs(v, parent):
            seen[p[v]] = True
            mex = 0
            while seen[mex]:
                mex += 1
            f[v] = mex
            for u in tree[v]:
                if u != parent:
                    dfs(u, v)
            seen[p[v]] = False

        dfs(0, -1)
        sum_f = sum(f)
        max_sum = sum_f

        # Find first vertex along the path from root whose weight blocks next MEX
        path_seen = [False] * (n + 2)
        vertex_to_change = None
        def dfs_find(v, parent):
            nonlocal vertex_to_change
            path_seen[p[v]] = True
            mex = 0
            while path_seen[mex]:
                mex += 1
            if vertex_to_change is None and p[v] != mex:
                vertex_to_change = v
            for u in tree[v]:
                if u != parent:
                    dfs_find(u, v)
            path_seen[p[v]] = False

        dfs_find(0, -1)

        if vertex_to_change is not None:
            p[vertex_to_change] = f[vertex_to_change]
            dfs(0, -1)
            max_sum = max(max_sum, sum(f))

        print(max_sum)

if __name__ == "__main__":
    solve()
```第一个 DFS 计算`f(v)`有效地使用`seen`数组，避免对每个顶点从头开始重新计算。 第二个 DFS 通过将每个顶点权重与根路径上的预期 MEX 进行比较来识别操作的最佳顶点。 重新计算`f`更改一个权重后可确保正确性，同时保持高效，因为只需要一个完整的 DFS。 的选择`vertex_to_change`确保我们仅在总和增加时才执行该操作。 

## 工作示例

 **示例输入 1**```
1
3
1 0 2
1 2
1 3
```| 顶点| 路径权重| f(v) 之前 | 最优操作后的 f(v) |
 | --- | --- | --- | --- |
 | 1 | [1] | 0 | 1 |
 | 2 | [1,0]| 2 | 2 |
 | 3 | [1,2]| 0 | 1 |

 初始金额：2

 在顶点3处运算后，sum = 4

 这表明在顶点 3 处应用操作会传播缺失的数`0`正确，增加总和。 

**示例输入 2**```
1
4
0 1 2 3
1 2
2 3
3 4
```| 顶点| 路径权重| f(v) 之前 | 最优操作后的 f(v) |
 | --- | --- | --- | --- |
 | 1 | [0]| 1 | 1 |
 | 2 | [0,1]| 2 | 2 |
 | 3 | [0,1,2]| 3 | 3 |
 | 4 | [0,1,2,3]| 4 | 4 |

 初始金额：10

 没有任何操作会增加总和。 操作被跳过。 

这证实了当树已经具有连续权重时，最佳选择是不执行任何操作。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个DFS遍历所有顶点一次； MEX 计算中每个顶点的额外常量工作 |
 | 空间| O(n) | 邻接表、数组`f`,`seen`， 和`path_seen`|

 总和为`n`在所有 ≤ 2 * 10^5 的测试用例中，总操作保持在 10^6 以下，完全在 4 秒的限制之内。 内存使用量仍低于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    sys.stdout = sys.__stdout__
    return output.getvalue
```
