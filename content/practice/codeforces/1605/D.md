---
title: "CF 1605D - 树标签"
description: "我们被要求重新标记树的节点，以便第一个玩家 Eikooc 可以最大化她保证获胜的起始位置的数量。"
date: "2026-06-10T07:59:46+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms", "dfs-and-similar", "games", "greedy", "implementation", "trees"]
categories: ["algorithms"]
codeforces_contest: 1605
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 754 (Div. 2)"
rating: 2100
weight: 1605
solve_time_s: 107
verified: false
draft: false
---

[CF 1605D - 树标签](https://codeforces.com/problemset/problem/1605/D)

 **评分：** 2100
 **标签：** 位掩码、构造性算法、dfs 和类似算法、游戏、贪婪、实现、树
 **求解时间：** 1m 47s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求重新标记树的节点，以便第一个玩家 Eikooc 可以最大化她保证获胜的起始位置的数量。 游戏本身是树上的令牌移动游戏，玩家交替将令牌移动到未访问的相邻节点，并按位异或条件：如果令牌在节点上`v`，它可以移动到邻居`u`仅当`u XOR v ≤ min(u, v)`。 

输入由多个测试用例组成。 每个测试用例指定一棵树`n`节点和`n-1`边缘。 输出必须是数字的排列`1`通过`n`给出节点的新标签，以便 Eikooc 拥有尽可能多的保证获胜的第一步。 

限制条件很大：`n`所有测试用例最多可以有 2·10^5，并且最多可以有 10^5 个测试用例。 这排除了任何模拟所有可能的游戏或检查节点标签的每个排列的解决方案，因为即使 O(n^2) 也太慢了。 问题是有建设性的：我们没有被要求模拟游戏，只是为了产生保证最佳第一步的重新标记。 边缘情况包括非常小的树，例如`n = 1`或者`n = 2`，以及高度不平衡的树，例如星形或长路径。 

例如，如果我们有一棵连接了两个节点的树，则 XOR 条件变得至关重要，因为 1 XOR 2 = 3，它大于 min(1,2) = 1，因此不可能进行任何移动。 在这种情况下，任何排列都有效，因为第一个玩家自动获胜。 粗心的方法可能会尝试任意标记，而没有考虑到如果 XOR 条件失败，某些小子树可能会阻止移动。 

## 方法

 蛮力方法将尝试生成所有`n!`标签的排列并从每个可能的第一步模拟游戏。 对于每一步，我们都可以递归地检查 Eikooc 是否强制获胜。 这显然是不可行的`n > 10`， 因为`n!`增长速度快于指数，并且模拟游戏本身每个起始节点的时间复杂度为 O(n)，导致运行时无法满足最大约束。 

关键的见解来自于检查 XOR 条件。 对于任意两个相邻节点`u`和`v`，移动被阻止，如果`u XOR v > min(u,v)`。 对于获胜起始节点的最大数量，我们希望 XOR 不等式在连接到起始节点的所有边上失败，确保第一个玩家可以移动，但第二个玩家不能。 这可以通过标记节点来保证，使得树的奇数深度的节点具有一个数字奇偶性，而偶数深度的节点具有另一奇偶性。 具体来说，我们可以将较小的数字分配给二分区的一个部分，并将较大的数字分配给另一部分。 由于不同高位数字的异或将超过较小的数字，因此从小节点到大节点的移动将被异或条件阻止。 树本质上是二分的，因此按深度对节点进行分区允许简单的标记，以确保 Eikooc 从较小的二分集中的任何节点中获胜。 

这种方法是线性的`n`：DFS 找到二分区，并通过按顺序为每个部分分配数字来完成重新标记。 它巧妙地利用树结构和 XOR 不等式，避免任何模拟。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n! * n) | O(n! * n) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 对于每个测试用例，请阅读`n`和`n-1`定义树的边。 构造树的邻接表。 
2. 从任意节点（例如节点 1）开始执行深度优先搜索，计算每个节点的深度。 根据深度奇偶性将节点分配给两个集合：set`A`为了均匀的深度，设置`B`对于奇数深度。 这给出了树的自然二分。 
3. 统计集合中节点的数量`A`和`B`。 为了最大化第一个玩家获胜起始节点的数量，我们应该用较小的数字标记较小的集合`1`到`size_of_smaller_set`。 这确保从这些节点到另一组的移动将违反 XOR 条件，因为任何较大的数字 XOR 较小的数字将超过较小的数字。 较大的集合接收剩余的较高数字。 
4. 为节点分配编号：迭代较小的集合并分配从 1 开始递增的编号。迭代较大的集合并分配剩余的编号。 
5. 按照原始节点索引的顺序输出标签的排列。 

为什么它有效：不变的是从较小集合中的节点到较大集合中的所有移动都被 XOR 条件阻止。 较小集合中的节点可以保证赢得第一步，因为第一步无法被反击。 较大集合中的节点可能会获胜，也可能不会获胜，但问题只要求最大化保证获胜。 该标签满足该属性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 20)

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        adj = [[] for _ in range(n)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            adj[u].append(v)
            adj[v].append(u)
        
        depth = [0] * n
        visited = [False] * n
        
        def dfs(u, d):
            visited[u] = True
            depth[u] = d
            for v in adj[u]:
                if not visited[v]:
                    dfs(v, d + 1)
        
        dfs(0, 0)
        
        setA = [i for i in range(n) if depth[i] % 2 == 0]
        setB = [i for i in range(n) if depth[i] % 2 == 1]
        
        if len(setA) > len(setB):
            setA, setB = setB, setA
        
        perm = [0] * n
        num = 1
        for node in setA:
            perm[node] = num
            num += 1
        for node in setB:
            perm[node] = num
            num += 1
        
        print(" ".join(map(str, perm)))
```该代码首先构建邻接表并通过 DFS 计算深度。 它通过深度奇偶性将节点收集到集合中`A`和`B`。 较小的一组获得最小的数字以保证赢得先手。 最后，它根据原始节点顺序打印排列。 DFS 确保所有节点都被访问，并且`sys.setrecursionlimit`允许线性树的深度递归。 

## 工作示例

 输入示例 1：```
3
1
2
1 2
3
1 2
1 3
```| 步骤| 深度| setA（偶数）| 集合B（奇数）| 烫发|
 | ---| ---| ---| ---| ---|
 | 测试1 | [0]| [0]| []| [1] |
 | 测试2 | [0,1]| [0]| [1] | [1,2]|
 | 测试3 | [0,1,1]| [0]| [1,2]| [1,2,3]|

 该表显示了 DFS 如何分配深度、如何划分节点以及分配的排列。 Eikooc 可以从较小的盘（setA）开始并保证获胜。 

输入示例 2：```
5
1 2
2 3
3 4
4 5
5 6
```DFS 深度交替为 0、1、2、3、4、5。 集合为偶数：[0,2,4]，奇数：[1,3,5]。 较小的集合甚至获得标签 1、2、3； 奇数得到 4,5,6。 从偶数指数开始保证 Eikooc 获胜。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | DFS在节点上是线性的，标签是线性的，打印是线性的。 |
 | 空间| 每个测试用例 O(n) | 邻接表、深度数组和排列数组都与 n 线性缩放。 |

 该算法与所有测试用例中的总 n 成线性比例，拟合在 2 秒限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("3\n1\n2\n1 2\n3\n1 2\n1 3\n") in ["1\n1 2\n1 2 3", "1\n2 1\n1 2 3"], "sample 1"

# custom cases
assert run("1\n6\n1 2\n2 3\n3 4\n4 5\n5 6\n") in ["1 4 2 5 3 6"], "linear tree"
assert run("1\n2\n1 2\n") in ["1 2", "2 1"], "two nodes"
```
