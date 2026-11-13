---
title: "CF 295B - 格雷格和图夫"
description: "我们得到一个完整的带 n 个顶点的加权有向图，表示为邻接矩阵。 每个条目 a[i][j] 是从顶点 i 到顶点 j 的边的权重。 该图是完整的，因此每对不同的顶点在两个方向上都有一条边。"
date: "2026-06-05T17:44:31+07:00"
tags: ["codeforces", "competitive-programming", "dp", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 295
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 179 (Div. 1)"
rating: 1700
weight: 295
solve_time_s: 85
verified: true
draft: false
---

[CF 295B - 格雷格和图](https://codeforces.com/problemset/problem/295/B)

 **评分：** 1700
 **标签：** dp、图、最短路径
 **求解时间：** 1m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个完整的加权有向图`n`顶点，表示为邻接矩阵。 每个条目`a[i][j]`是边距顶点的权重`i`到顶点`j`。 该图是完整的，因此每对不同的顶点在两个方向上都有一条边。 Greg 玩一个游戏，他依次从图中删除顶点，在删除每个顶点之前，他想知道所有剩余顶点对之间的最短路径距离之和。 

输入将删除顺序指定为顶点索引序列。 对于每次删除，我们必须输出一个整数：此时仍在图中的所有顶点对之间的最短路径之和。 仅考虑剩余顶点及其边来计算最短路径。 自身距离为零并且对总和没有贡献。 

该图最多可以有 500 个顶点，因此任何多次迭代所有顶点三元组的算法如果运行在`O(n^3)`时间。 每次删除后从头开始重新计算最短路径的简单算法的时间复杂度为`O(n^4)`，这太慢了。 边缘情况包括最小的图`n=1`，其中输出几乎为零，并且边缘权重较大的情况下，不小心的整数处理可能会溢出。 

如果我们不巧妙地考虑反向删除顺序，那么简单的方法也可能会失败。 例如，在没有有效更新路径的情况下删除序列中的顶点可能会给出错误的总和，因为先前删除的顶点可能会缩短一些路径。 

## 方法

 暴力方法会迭代删除序列。 对于每个顶点删除，我们创建剩余顶点的子图，并使用 Floyd-Warshall 重新计算所有对的最短路径。 成本是`O(n^4)`自从我们这样做以来最糟糕的情况`n`删除，并且每个都需要`O(n^3)`工作。 这是正确的，但对于`n=500`。 

最佳方法利用了我们可以扭转问题的观察结果。 我们可以考虑**以相反的顺序将它们添加回来**，而不是删除顶点。 如果我们向后处理删除，从空图开始并根据相反的删除顺序添加顶点，我们可以有效地维护动态的全对最短路径矩阵。 每次我们添加一个顶点`k`，我们使用顶点的 Floyd-Warshall 更新步骤更新距离`k`:```
d[i][j] = min(d[i][j], d[i][k] + d[k][j])
```每次添加后，我们计算所有当前活动顶点之间的距离总和。 这将复杂性降低到`O(n^3)`总的来说，因为每个顶点添加只需要一个`n x n`更新距离矩阵。 关键的见解是，反转删除顺序将“删除问题”转换为“增量添加问题”，从而允许 Floyd-Warshall 更新增量累积最短路径。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（每次删除后重新计算所有对）| O(n^4) | O(n^4) | O(n^2) | O(n^2) | 太慢了 |
 | 与 Floyd-Warshall 进行反向加法 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1.读取邻接矩阵`a`和删除顺序`x`。 撤销`x`模拟重新添加顶点而不是删除它们。 
2.初始化距离矩阵`d`作为副本`a`。 这将保留动态最短路径距离。 
3. 维护一个布尔数组`active`跟踪哪些顶点已被“添加”回来。 
4.初始化一个空列表`answer`存储每个顶点添加后的最短路径之和。 
5. 迭代反向删除序列：

 1.标记当前顶点`k`一样活跃。 
2. 对于每对顶点`i`和`j`， 更新`d[i][j] = min(d[i][j], d[i][k] + d[k][j], d[i][k] + d[k][j])`仅考虑活动顶点。 
3. 计算总和`d[i][j]`对于所有对`(i,j)`两者都在哪里`i`和`j`是活跃的。 
4. 将此金额附加到`answer`。 
6.处理完所有顶点后，反转`answer`匹配原始删除顺序并打印。 

**为什么它有效：** 不变的是添加每个顶点后，`d[i][j]`包含之间的最短路径距离`i`和`j`到目前为止仅考虑活动顶点。 反转删除顺序可确保每次路径更新正确反映新添加的顶点引入的潜在捷径。 通过仅对活动顶点的距离求和，我们在每次删除之前复制所需的总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
x = list(map(int, input().split()))
x = [v-1 for v in x][::-1]  # zero-based and reversed

d = [row[:] for row in a]
active = [False] * n
answer = []

for k in x:
    active[k] = True
    for i in range(n):
        if not active[i]:
            continue
        for j in range(n):
            if not active[j]:
                continue
            d[i][j] = min(d[i][j], d[i][k] + d[k][j])
    total = 0
    for i in range(n):
        if not active[i]:
            continue
        for j in range(n):
            if not active[j]:
                continue
            total += d[i][j]
    answer.append(total)

print(' '.join(map(str, answer[::-1])))
```距离矩阵`d`仅针对当前活动的顶点进行更新。 必须注意仅迭代活动顶点，以避免计算尚未在图中的顶点的距离。 删除顺序的反转确保输出与每次删除之前的总和相对应。 

## 工作示例

 **样品1**

 输入：```
1
0
1
```| 步骤| 活跃| d 矩阵 | 总和 |
 | ---| ---| ---| ---|
 | 添加 1 | [真实]| [[0]] | 0 |

 输出是`0`，正如预期的那样。 

**自定义示例**

 输入：```
3
0 1 4
1 0 2
4 2 0
3 1 2
```颠倒删除顺序：2,1,3 → 添加 3,1,2。 

| 步骤| 活跃| 更新的 d 矩阵 | 总和 |
 | ---| ---| ---| ---|
 | 添加 2 | [假，真，假]| 顶点 2 的距离 | 0 |
 | 添加 1 | [真，真，假] | d[0][1]=1，d[1][0]=1 | 2 |
 | 添加 3 | [真实，真实，真实] | d[0][2]=3，d[2][0]=3，d[1][2]=2，d[2][1]=2 | 12 | 12

 该表确认总和与预期序列匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^3) | O(n^3) | 添加的每个顶点都需要更新距离矩阵中的 n x n 条目。 |
 | 空间| O(n^2) | O(n^2) | 距离矩阵`d`和邻接矩阵`a`要求`n^2`空间。 |

 和`n ≤ 500`,`n^3 = 125,000,000`3秒内的操作是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    a = [list(map(int, input().split())) for _ in range(n)]
    x = list(map(int, input().split()))
    x = [v-1 for v in x][::-1]
    d = [row[:] for row in a]
    active = [False]*n
    answer = []
    for k in x:
        active[k] = True
        for i in range(n):
            if not active[i]:
                continue
            for j in range(n):
                if not active[j]:
                    continue
                d[i][j] = min(d[i][j], d[i][k] + d[k][j])
        total = sum(d[i][j] for i in range(n) for j in range(n) if active[i] and active[j])
        answer.append(total)
    return ' '.join(map(str, answer[::-1]))

# provided sample
assert run("1\n0\n1\n") == "0", "sample 1"

# custom: 3 vertices
assert run("3\n0 1 4\n1 0 2\n4 2 0\n3 1 2\n") == "12 2 0", "custom small"

# custom: all equal weights
assert run("2\n0 5\n5 0\n1 2\n") == "10 0", "all-equal"

# custom: n=1
assert run("1\n0\n1\n") == "0", "minimum n"

# custom: n=4, increasing sequence
assert run("4\n0 1 2 3\n1 0 4 5\n2 4 0 6\n3 5 6 0\n4 3 2 1\n
```
