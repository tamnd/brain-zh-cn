---
title: "CF 300B - 客车"
description: "我们被要求将 n 个学生分成正好三人的小组。 一些学生明确要求与某些其他学生在同一个团队。 这些请求是相互的，因此如果学生 2 想要与学生 5 组队，那么学生 5 也想要学生 2。"
date: "2026-06-05T18:28:15+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dfs-and-similar", "graphs"]
categories: ["algorithms"]
codeforces_contest: 300
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 181 (Div. 2)"
rating: 1500
weight: 300
solve_time_s: 131
verified: false
draft: false
---

[CF 300B - 教练](https://codeforces.com/problemset/problem/300/B)

 **评分：** 1500
 **标签：** 暴力破解、dfs 和类似的、图表
 **求解时间：** 2m 11s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求划分`n`学生分成正好三人的小组。 一些学生明确要求与某些其他学生在同一个团队。 这些请求是相互的，因此如果学生 2 想要与学生 5 组队，那么学生 5 也想要学生 2。我们的任务是以尊重所有此类请求的方式将学生分配到三人组。 如果这是不可能的，我们必须输出`-1`。 否则，我们应该打印实际的团队。 

输入包括`n`（能被 3 整除）和`m`一对想在一起的学生。 输出是`-1`如果不存在有效的安排，或者`n/3`由三个整数组成的行，每个整数代表一个团队。 

限制很小：`n ≤ 48`和`m ≤ n(n-1)/2`。 这表明任何复杂度高达大约`O(n^2)`将在 2 秒内轻松运行。 因此，我们可以考虑扫描所有学生、建立小组或模拟团队的方法，而不必担心大型数据集的优化。 

当学生提出相互冲突的要求，迫使小组人数超过三人时，就会出现一个关键的边缘情况。 例如，如果学生 1、2、3 和 4 都请求加入同一团队（通过一系列请求），则不可能组成正好由三人组成的团队。 另一种情况是，一些学生是孤立的，必须与其他学生结合起来形成一个完整的团队。 

## 方法

 暴力方法会尝试将学生分成三人一组，并检查所有请求是否得到满足。 这种做法在理论上是正确的，但在实践中却行不通。 分区方式的数量`n`学生分成三人一组，顺序为`(n!) / ((3!)^(n/3) * (n/3)!)`。 为了`n = 48`，这是一个天文数字，无法枚举。 

最佳方法观察到请求定义了图中的连接组件：每个学生都是一个节点，一条边代表“想要在一起”的请求。 每个连接的组件必须完全适合一个或多个团队。 如果任何组件有超过三名学生，则不可能将他们分成三人一组，因为请求是相互的并且必须得到尊重。 规模 1 或 2 的组件可以组合成团队。 

其见解是按尺寸对组件进行分类。 3 号的组件立即组成完整的团队。 尺寸 2 的组件需要尺寸 1 组件中的一名额外学生。 大小为 1 的组件可以分成三组组成一个团队。 如果在任何时候数字不匹配，则不存在有效的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了|
 | 连接组件+贪婪团队分配| O(n^2) | O(n^2) | O(n + m) | 已接受 |

 ## 算法演练

 1. 使用邻接表将学生及其请求表示为无向图。 每个学生都是一个节点，每个学生都请求一条双向边。 这使我们能够有效地找到连接的组。 
2. 使用深度优先搜索或广度优先搜索遍历图形以识别所有连接的组件。 每个组件代表一组必须属于同一团队的学生。 存储每个组件的大小以及其中的学生列表。 
3. 如果任何组件的大小大于 3，则输出`-1`并终止。 这样的组件不能在保留请求的同时分成恰好三个的组。 
4. 将组件分为三组：尺寸 3、尺寸 2、尺寸 1。尺寸 3 的组件形成一个完整的团队。 规模 2 的组成部分需要来自规模 1 组的一名学生才能组成一个团队。 尺寸为 1 的组件可以三个一组组合起来形成完整的团队。 
5. 如果 size-1 学生的数量不足以与 size-2 组件配对，或者配对后不能被 3 整除，则输出`-1`。 
6. 按以下顺序组建团队：首先，由 3 号学生组成小组，然后将每个 2 号学生与一名 1 号学生配对，最后将剩余的 1 号学生分成三人一组。 
7.输出所有队伍。 每队印有三个学生编号。 

为什么有效：基于图的分解保证所有相互请求都得到尊重。 超过三个的组件将被拒绝，因为它们无法容纳在一个团队中。 将 2 号学生与 1 号学生贪婪地组合在一起，并将剩余的 1 号学生分成三组，确保所有学生都只包含一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, m = map(int, input().split())
    adj = [[] for _ in range(n)]
    
    for _ in range(m):
        a, b = map(int, input().split())
        adj[a-1].append(b-1)
        adj[b-1].append(a-1)

    visited = [False]*n
    components = []

    def dfs(u, comp):
        visited[u] = True
        comp.append(u)
        for v in adj[u]:
            if not visited[v]:
                dfs(v, comp)

    for i in range(n):
        if not visited[i]:
            comp = []
            dfs(i, comp)
            if len(comp) > 3:
                print(-1)
                return
            components.append(comp)

    ones, twos, threes = [], [], []
    for c in components:
        if len(c) == 1:
            ones.append(c[0])
        elif len(c) == 2:
            twos.append(c)
        else:
            threes.append(c)

    if len(ones) < len(twos):
        print(-1)
        return

    teams = []
    for t in threes:
        teams.append(t)
    for i, t in enumerate(twos):
        teams.append(t + [ones[i]])
    remaining_ones = ones[len(twos):]

    if len(remaining_ones) % 3 != 0:
        print(-1)
        return

    for i in range(0, len(remaining_ones), 3):
        teams.append(remaining_ones[i:i+3])

    for team in teams:
        print(' '.join(str(x+1) for x in team))

if __name__ == "__main__":
    main()
```该代码首先构建图并使用 DFS 查找连接的组件。 大于三个的组件立即触发`-1`。 组件按大小划分，然后以贪婪的方式构建团队。 仔细的索引确保学生只被分配一次，并且所有 2 年级的组件都由 1 年级的学生完成。 

## 工作示例

 **示例输入 1**```
3 0
```| 步骤| 组件| 那些 | 两两| 三人行 | 团队|
 | --- | --- | --- | --- | --- | --- |
 | 初始| [[0],[1],[2]] | [0,1,2]| []| []| []|
 | 组装| [[0,1,2]] | []| []| []| [0,1,2]|

 所有学生都被隔离。 他们被分成三人一组。 

**示例输入 2**```
6 2
1 2
3 4
```| 步骤| 组件| 那些 | 两两| 三人行 | 团队|
 | --- | --- | --- | --- | --- | --- |
 | 初始 DFS | [[0,1],[2,3],[4],[5]] | [4,5]| [[0,1],[2,3]] | []| []|
 | 组装| - | [4,5]| [[0,1],[2,3]] | []| [[0,1,4],[2,3,5]] |

 两人与一组成完整的团队。 输出有效。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | DFS对每条边遍历一次； n ≤ 48，因此即使 O(n^2) 邻接检查也可以。 |
 | 空间| O(n + m) | 邻接表存储边； 访问数组和组件列表存储 n 个元素。 |

 对于 n ≤ 48 且 m ≤ n(n-1)/2，时间和内存都远低于限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    main()
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# Provided samples
assert run("3 0\n") in ["1 2 3","3 2 1"], "sample 1"

# Custom cases
assert run("6 2\n1 2\n3 4\n") in ["1 2 5\n3 4 6","1 2 6\n3 4 5"], "size-2 pairing"
assert run("3 1\n1 2\n") == "1 2 3", "2 wants together, 1 alone"
assert run("3 1\n1 2\n") == "1 2 3", "size-2 + single"
assert run("6 1\n1 2\n") in ["1 2 3\n4 5 6","1 2 4\n3 5
```
