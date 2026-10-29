---
title: "CF 1513D - GCD 和 MST"
description: "我们被要求计算由正整数数组构造的加权图的最小生成树（MST）。"
date: "2026-06-10T18:46:27+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dsu", "graphs", "greedy", "number-theory", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1513
codeforces_index: "D"
codeforces_contest_name: "Divide by Zero 2021 and Codeforces Round 714 (Div. 2)"
rating: 2000
weight: 1513
solve_time_s: 144
verified: true
draft: false
---

[CF 1513D - GCD 和 MST](https://codeforces.com/problemset/problem/1513/D)

 **评级：** 2000
 **标签：** 构造性算法、DSU、图、贪心、数论、排序
 **求解时间：** 2m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算由正整数数组构造的加权图的最小生成树（MST）。 每个数组元素对应一个顶点，边存在于具有固定权重的相邻元素之间`p`或任意一对顶点之间`(i, j)`如果所有元素的最大公约数 (GCD)`a[i]`到`a[j]`等于该子数组中的最小值。 这样一条边的权重就是子数组的最小值。 目标不是显式构造所有边，而是有效计算 MST 权重。 

约束表明`n`每个测试用例最多可达 2·10^5，并且总和`n`所有测试用例的总和也是 2·10^5。 这意味着每个测试用例需要 O(n^2) 时间的任何方法都立即不可行，因为它需要大约 4·10^10 次操作。 我们需要一种接近线性或线性算术的算法`n`。 

当所有数组元素等于或小于时，会出现微妙的边缘情况`p`。 例如，如果`n = 3`,`p = 5`， 和`a = [3, 3, 3]`，朴素的邻接处理可能会尝试在非相邻顶点之间创建不必要的边，或者错过更便宜的边。 类似地，如果数组有一个小元素被较大元素包围，贪婪连接必须正确识别通过这个小元素进行连接可以将 MST 成本降低到以下`p`每条边。 

## 方法

 蛮力方法是逐字生成所有候选边。 对于每对`(i, j)`你计算 GCD`a[i..j]`以及该范围内的最小值。 如果相等，则添加一条带权重的边`min(a[i..j])`。 相邻的顶点总是有一条权重边`p`。 生成边后，运行 Kruskal 或 Prim 算法来计算 MST。 这是正确的，因为它完全遵循问题规则，但在边缘生成和排序的最坏情况下它是 O(n^2 log n)，这对于`n = 2·10^5`。 

关键的见解是我们不需要所有的边。 任何权重大于的边`p`永远不会比使用相邻的更便宜`p`MST 中的边缘。 因此，我们可以将注意力限制在边缘上`min(a[i..j]) < p`。 对于这些，考虑每个元素`a[k]`作为连接最小范围的连续范围的候选者，并划分该范围内的所有元素。 这将问题转化为贪婪构造：从最小的元素开始，向左和向右扩展，同时 GCD 仍可被该元素整除。 这些范围给出了我们可以使用不相交集联合 (DSU) 添加到 MST 的边。 这使我们能够避免对所有对进行显式 GCD 计算，并将问题简化为对数组进行粗略排序并执行联合查找操作，从而为每个测试用例提供 O(n log n) 复杂度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2 log n) | O(n^2 log n) | O(n^2) | O(n^2) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读`n`,`p`，和数组`a`。 
2. 初始化一个不相交集并集 (DSU) 结构`n`元素。 这将跟踪 MST 中已连接的顶点。 
3. 创建索引列表`idx`按对应的数组值排序`a[i]`。 这使我们能够按升序处理潜在的最小值。 
4. 初始化`mst_weight = 0`和`edges_used = 0`。 这些将累积 MST 总权重并跟踪我们添加了多少条边。 
5. 迭代排序的索引。 对于每个`i`：

 - 跳过如果`a[i] >= p`因为这样的边永远不会比固定的边便宜`p`边缘。 
- 尝试向左扩展：当前一个元素存在时，尚未在 DSU 中连接，并且可被`a[i]`，联合它们并添加`a[i]`到`mst_weight`。 
- 同样，向右延伸，合并相邻的可整除元素。 
- 每个并集对应添加一条MST边，因此递增`edges_used`。 
6. 处理完所有小元素后，可能会剩下未连接对。 对于每一个相邻的对`(i, i+1)`不在同一个 DSU 组件中，将它们合并并添加`p`到`mst_weight`。 
7. 打印`mst_weight`对于测试用例。 

工作原理：通过从最小到最大处理数组元素，我们确保每当创建 MST 边时，它对于该组件来说都是最便宜的。 可整除性保证了连续范围满足 GCD 条件。 剩余的带有权重的相邻边`p`处理没有更小的元素可以连接两个顶点的情况，确保 MST 完整。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
    
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    
    def union(self, x, y):
        x_root, y_root = self.find(x), self.find(y)
        if x_root == y_root:
            return False
        self.parent[y_root] = x_root
        return True

def solve():
    t = int(input())
    for _ in range(t):
        n, p = map(int, input().split())
        a = list(map(int, input().split()))
        dsu = DSU(n)
        idx = sorted(range(n), key=lambda i: a[i])
        mst_weight = 0
        edges_used = 0
        
        for i in idx:
            if a[i] >= p:
                break
            j = i - 1
            while j >= 0 and a[j] % a[i] == 0 and dsu.union(i, j):
                mst_weight += a[i]
                edges_used += 1
                j -= 1
            j = i + 1
            while j < n and a[j] % a[i] == 0 and dsu.union(i, j):
                mst_weight += a[i]
                edges_used += 1
                j += 1

        for i in range(n - 1):
            if dsu.union(i, i + 1):
                mst_weight += p
                edges_used += 1

        print(mst_weight)

if __name__ == "__main__":
    solve()
```该代码首先定义了一个具有路径压缩的 DSU，以实现高效的联合和查找。 对索引进行排序可确保我们首先处理最便宜的潜在 MST 边。 左右扩展联合连续的可整除元素，对应于满足 GCD 条件的边。 最后，剩余的权重相邻边`p`保证MST连通。 

## 工作示例

 输入示例 1：```
n = 2, p = 5
a = [10, 10]
```| 步骤| 行动| DSU 家长 | MST 重量 | 使用的边缘|
 | --- | --- | --- | --- | --- |
 | 1 | 按值对索引排序 | [0, 1] | 0 | 0 |
 | 2 | i=0, a[i]=10 >= p, 跳过 | [0,1]| 0 | 0 |
 | 3 | 连接剩余的相邻对 (0,1) 与 p=5 | [0,0]| 5 | 1 |

 输出是`5`。 

输入示例 2：```
n = 2, p = 5
a = [3, 3]
```| 步骤| 行动| DSU 家长 | MST 重量 | 使用的边缘|
 | --- | --- | --- | --- | --- |
 | 1 | 按值对索引排序 | [0,1]| 0 | 0 |
 | 2 | i=0，a[i]=3 < p | 不需要左/右联合 | [0,0]| 3 |
 | 3 | 无需剩余边缘 | - | - | - |

 输出是`3`。 

这些痕迹表明，小元素被贪婪地用于基于 GCD 的连接，而剩余的邻接边则处理其余部分。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序索引需要 O(n log n)，联合查找和路径压缩几乎是线性的。 |
 | 空间| O(n) | DSU 存储父数组，索引数组使用 O(n) |

 给定约束和n ≤ 2·10^5，该算法在2秒内高效运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("4\n2 5\n10 10\n2 5\n3 3\n4 5\n5 2 4 9\n8 8\n5 3 3 6 10 100 9 15\n") == "5\n3\n12\n46"

# Custom cases
assert run("1\n2 1\n1 1\n") == "1", "minimum values, p=1"
assert run("1\n3 10\n5 5
```
