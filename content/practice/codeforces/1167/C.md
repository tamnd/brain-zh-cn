---
title: "CF 1167C - 新闻发布"
description: "我们有一个包含 n 个用户和 m 个朋友组的社交网络。 每个组都包含彼此互为好友的用户列表。"
date: "2026-06-12T02:11:02+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1167
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 65 (Rated for Div. 2)"
rating: 1400
weight: 1167
solve_time_s: 198
verified: true
draft: false
---

[CF 1167C - 新闻发布](https://codeforces.com/problemset/problem/1167/C)

 **评分：** 1400
 **标签：** dfs 和类似、dsu、图表
 **求解时间：** 3m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个社交网络`n`用户和`m`一群朋友。 每个组都包含彼此互为好友的用户列表。 友谊是通过这些组传递的：如果两个用户在同一个组中，他们就是朋友，并且消息通过友谊链传播。 对于每个用户，我们需要计算如果该用户是唯一的初始来源，则有多少用户最终会知道一条新闻。 

从概念上讲，这是一个图问题。 每个用户都是一个节点，如果属于同一组，两个用户之间就有一条边。 消息沿着该图的连接部分传播。 因此，最终知道该新闻的用户数是从用户开始的`x`等于包含的连接组件的大小`x`。 

限制条件很高：`n`和`m`可以达到`5 * 10^5`，并且组成员总数也达到`5 * 10^5`。 任何显式计算每个用户的邻居并从每个节点运行 BFS 或 DFS 的解决方案都将太慢，因为它可能需要`O(n*(n+m))`最坏情况下的操作。 这迫使我们找到一种避免重复遍历同一组件的方法。 

不明显的边缘情况包括空组和单用户组。 一组与`0`用户应该被忽略，因为它没有连接任何人。 具有一个用户的组不会增加连接性，但不得破坏联合逻辑。 例如，所有组均为空的输入将产生以下输出`1`对于每个用户，因为每个用户形成一个单例组件。 

## 方法

 最简单的方法是构建所有用户的邻接列表，然后对每个用户运行 BFS 或 DFS 来计算连接组件的大小。 这是正确的，但效率低下。 为了`n = 5*10^5`，运行广度优先搜索`n`时间非常慢，因为累计操作可能会超过`10^{11}`在最坏的情况下。 

关键的见解是连通性是对称的和传递的。 同一连接组件中的用户将始终共享相同的最终答案。 这表明我们只需要计算每个连接组件的大小一次。 一个自然的结构是不相交集并集 (DSU)，也称为并查集。 我们可以迭代每个组并将其所有成员合并到一组中。 处理完所有组后，每个集合代表一个连接组件，每个集合的大小给出了其所有成员的答案。 这将时间复杂度降低到组成员总数的近线性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 来自每个用户的强力 BFS/DFS | O(n*(n+m)) | O(n*(n+m)) | O(n+m) | 太慢了|
 | DSU / Union-在组上查找 | O(n + m + 组总大小 * α(n)) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化 DSU`n`元素，其中每个用户最初属于他们自己的集合。 每组都跟踪其大小。 
2. 迭代每个组。 对于团体规模`k`, 合并所有`k`用户归为一组。 我们可以通过按顺序将第一个用户与每个剩余用户合并来做到这一点。 
3.处理完所有组后，每个连通分量已合并为一个集合，该集合的大小表示从任何成员可到达的用户数量。 
4. 对于每个用户`1`到`n`，输出它们所属集合的大小。 这是如果该用户开始分发新闻就会知道该新闻的用户数量。 

工作原理：联合查找结构确保可以通过任何组序列相互联系的所有用户都合并到一个集合中。 通过跟踪设置的大小，我们可以准确地知道每个初始用户可以覆盖多少用户。 路径压缩保证`find`操作速度很快，总体复杂性接近线性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        x_root = self.find(x)
        y_root = self.find(y)
        if x_root == y_root:
            return
        if self.size[x_root] < self.size[y_root]:
            x_root, y_root = y_root, x_root
        self.parent[y_root] = x_root
        self.size[x_root] += self.size[y_root]

n, m = map(int, input().split())
dsu = DSU(n)

for _ in range(m):
    line = list(map(int, input().split()))
    k = line[0]
    if k == 0:
        continue
    users = [x-1 for x in line[1:]]
    first = users[0]
    for u in users[1:]:
        dsu.union(first, u)

result = [dsu.size[dsu.find(i)] for i in range(n)]
print(*result)
```该代码定义了具有路径压缩的标准 DSU。 对于每个组，它将用户 ID 转换为基于 0 的索引，并联合该组的所有成员。 所有并集之后，将打印包含每个用户的集合的大小。 使用路径压缩可确保重复`find`即使对于大量输入，调用也很快。 

## 工作示例

 **示例输入 1**```
7 5
3 2 5 4
0
2 1 2
1 1
2 6 7
```| 步骤| 集团加工| DSU 状态（父级）| 元件尺寸|
 | --- | --- | --- | --- |
 | 初始| - | 0 1 2 3 4 5 6 | 0 1 2 3 4 5 6 1 1 1 1 1 1 1 | 1 1 1 1 1 1 1
 | 组1 2,5,4 | 合并(2,5), 合并(2,4) | 0 1 2 2 2 2 6 | 0 1 2 2 2 2 6 1 1 3 3 3 3 1 | 1 1 3 3 3 3 1
 | 组 2 空 | - | 不变| 不变|
 | 组3 1,2 | 合并(1,2) | 0 2 2 2 2 2 6 | 0 2 2 2 2 2 6 4 4 4 4 3 3 1 | 4 4 4 4 3 3 1
 | 第 4 组 1 | 单身| 不变| 不变|
 | 组5 6,7 | 合并(5,6) | 0 2 2 2 2 5 5 | 0 2 2 2 2 5 5 4 4 4 4 4 2 2 | 4 4 4 4 4 2 2

 输出：`4 4 1 4 4 2 2`该跟踪确认每个用户属于大小正确的连接组件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m + 组总大小 * α(n)) | 每个联合和发现几乎是恒定的； 我们对每个小组成员处理一次 |
 | 空间| O(n) | DSU 父数组和大小数组为每个用户存储一个整数 |

 和`n, m`最多`5*10^5`团体总规模可达`5*10^5`，该算法很容易满足 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline
    
    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
            self.size = [1]*n
        def find(self, x):
            if self.parent[x] != x:
                self.parent[x] = self.find(self.parent[x])
            return self.parent[x]
        def union(self, x, y):
            x_root = self.find(x)
            y_root = self.find(y)
            if x_root == y_root: return
            if self.size[x_root] < self.size[y_root]:
                x_root, y_root = y_root, x_root
            self.parent[y_root] = x_root
            self.size[x_root] += self.size[y_root]

    n, m = map(int, input().split())
    dsu = DSU(n)
    for _ in range(m):
        line = list(map(int, input().split()))
        k = line[0]
        if k == 0: continue
        users = [x-1 for x in line[1:]]
        first = users[0]
        for u in users[1:]:
            dsu.union(first, u)

    return ' '.join(str(dsu.size[dsu.find(i)]) for i in range(n))

# Provided sample
assert run("7 5\n3 2 5 4\n0\n2 1 2\n1 1\n2 6 7\n") == "4 4 1 4 4 2 2", "sample 1"

# Custom cases
assert run("5 0\n0\n0\n0\n0\n0\n") == "1 1 1 1 1", "all empty groups"
assert run("3 3\n1 1\n1 2\n1 3\n") == "1 1 1", "singletons"
assert run("4 2\n2 1 2\n2 3
```
