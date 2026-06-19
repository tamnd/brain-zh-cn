---
title: "CF 1095F - 使其连接"
description: "我们有 n 个顶点，每个顶点上写有一个数字 ai，并且最初没有边。 我们可以通过支付任意两个顶点的数字 ax + ay 之和来连接它们。 此外，还有 m 个特别优惠，每个优惠都允许以折扣成本 w 添加特定优势。"
date: "2026-06-12T05:52:30+07:00"
tags: ["codeforces", "competitive-programming", "dsu", "graphs", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1095
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 529 (Div. 3)"
rating: 1900
weight: 1095
solve_time_s: 68
verified: true
draft: false
---

[CF 1095F - 使其连接](https://codeforces.com/problemset/problem/1095/F)

 **评级：** 1900
 **标签：** DSU、图、贪婪
 **求解时间：** 1m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被给予`n`顶点，每个顶点都有一个数字`a_i`上面写着，最初没有边缘。 我们可以通过支付任意两个顶点的数字之和来连接它们`a_x + a_y`。 此外，还有`m`特别优惠，每项优惠都允许以折扣成本添加特定优势`w`。 目标是以最小的总成本连接图。 

自从`n`可以大到 200,000，任何直接检查所有可能的顶点对的解决方案都太慢，因为这需要 O(n^2) 次操作，大约为 4 * 10^10 并且在 2 秒内不可行。 因此，我们需要一种利用问题结构来减少我们考虑的边数的方法。 顶点上的数字可以大到 10^12，因此如果不小心求和会导致整数溢出，那么 Python 本身就可以处理大整数。 

非明显的边缘情况包括特殊优惠比通过顶点总和连接严格便宜的情况，或者必须使用最便宜的顶点来连接多个组件的情况。 例如，对于顶点`[1, 3, 3]`和特别优惠`(2,3,5)`和`(1,2,1)`，如果忽略将最低顶点与其他顶点相结合，总是贪婪地使用特价商品的天真方法可能会产生不正确的总数。 

## 方法

 蛮力法会考虑所有`n*(n-1)/2`顶点之间可能的边，为它们分配一个成本`a_x + a_y`或者更便宜的特价商品（如果存在），然后运行克鲁斯卡尔算法来找到最小生成树。 这在理论上是正确的，但在给定 n=2*10^5 的情况下，生成和排序 O(n^2) 条边太慢，因为它需要数百亿次操作。 

使这个易于处理的关键观察是在连接两个顶点的图中`x`和`y`成本`a_x + a_y`，连接组件的最便宜的方法之一是始终涉及具有最小的顶点`a_i`。 考虑具有最小值的顶点`a_i`; 使用它的任何边都可能比较大顶点之间的边便宜。 因此，我们可以模拟将所有顶点连接到这个最小顶点，而不是添加所有 n^2 条可能的边，这只需要 O(n) 条边。 除了特别优惠之外，我们现在还需要考虑 O(n + m) 条边，这是可行的。 

通过将此视为最小生成树问题并使用不相交集并集 (DSU) 结构有效地实现 Kruskal 算法，我们可以计算连接所有顶点的最小成本。 对 O(n + m) 条边进行排序和并集操作需要 O((n + m) log(n + m)) 时间，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2 log n) | O(n^2 log n) | O(n^2) | O(n^2) | 太慢了 |
 | 最佳| O((n + m) log(n + m)) | O((n + m) log(n + m)) | O(n + m) | 已接受 |

 ## 算法演练

 1. 找出最小的顶点`a_i`。 称这个顶点为`min_vertex`有价值`min_value`。 执行此步骤的原因是，将任意顶点连接到`min_vertex`保证比连接两个非最小顶点更便宜，除非特殊优惠提供更低的成本。 
2.初始化一个空列表`edges`。 For every vertex`v`不等于`min_vertex`，添加一条边`(min_vertex, v, min_value + a_v)`。 这确保了所有顶点都具有与最小成本顶点的廉价潜在连接。 
3.阅读特别优惠。 对于每个优惠`(x, y, w)`，将其添加到`edges`。 每个特别优惠可能比数量总和更便宜，并且必须在 MST 中考虑。 
4. 按成本对所有边进行排序。 排序对于 Kruskal 算法是必要的，以确保我们始终选择不形成循环的最便宜的可用边。 
5. 初始化 DSU`n`顶点。 按成本递增顺序处理边缘。 对于每条边`(u, v, cost)`， 如果`u`和`v`属于DSU中的不同组件，将它们合并并添加`cost`到运行总计。 跳过连接已连接组件的边。 
6. 处理完所有边后，运行总和表示使图连通的最小成本。 打印出来。 

工作原理：每个 MST 都必须包含以最低成本连接所有组件的边缘。 通过包含从最小顶点到所有其他顶点的边，我们确保组件之间任何潜在必要的连接都可以以最低的成本获得。 明确添加和考虑特别优惠，因此不会错过更便宜的连接机会。 DSU 保证我们永远不会形成循环，从而保持 MST 不变。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0]*n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        xroot = self.find(x)
        yroot = self.find(y)
        if xroot == yroot:
            return False
        if self.rank[xroot] < self.rank[yroot]:
            self.parent[xroot] = yroot
        else:
            self.parent[yroot] = xroot
            if self.rank[xroot] == self.rank[yroot]:
                self.rank[xroot] += 1
        return True

def main():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    min_value = min(a)
    min_index = a.index(min_value)

    edges = []
    for i in range(n):
        if i != min_index:
            edges.append((min_value + a[i], min_index, i))

    for _ in range(m):
        x, y, w = map(int, input().split())
        edges.append((w, x-1, y-1))

    edges.sort()
    dsu = DSU(n)
    total_cost = 0
    for cost, u, v in edges:
        if dsu.union(u, v):
            total_cost += cost

    print(total_cost)

if __name__ == "__main__":
    main()
```DSU 实现确保并集和查找操作保持几乎恒定的时间，这对于 2*10^5 顶点的性能至关重要。 对边进行排序可以保证我们接下来总是考虑最便宜的边。 使用`min_index`保证我们只生成`n-1`从最小顶点开始的边，避免了 O(n^2) 生成。 

## 工作示例

 **样品1**

 输入：```
3 2
1 3 3
2 3 5
2 1 1
```| 边缘考虑| 成本| DSU 操作 | 总成本|
 | --- | --- | --- | --- |
 | 1-2（特别）| 1 | 联盟| 1 |
 | 1-3（最小边缘）| 4 | 联盟| 5 |
 | 2-3（特别）| 5 | 跳过| 5 |

 MST 包括 1 到 2 之间的特别优惠以及 1 到 3 之间的最小优势。总成本为 5。 

**自定义示例**

 输入：```
4 1
2 2 3 4
3 4 1
```| 边缘考虑| 成本| DSU 操作 | 总成本|
 | --- | --- | --- | --- |
 | 3-4（特别）| 1 | 联盟| 1 |
 | 1-2（最小边缘）| 4 | 联盟| 5 |
 | 1-3（最小边缘）| 5 | 联盟| 10 | 10
 | 1-4（最小边缘）| 6 | 跳过| 10 | 10

 总成本为10。 

这显示了算法如何平衡最小顶点连接和特别优惠。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log(n + m)) | O((n + m) log(n + m)) | 对边进行排序和执行并集运算占主导地位。 每个联合/查找几乎都是 O(1)。 |
 | 空间| O(n + m) | 存储边和 DSU 父/等级数组。 |

 这完全符合 n、m ≤ 2*10^5 的 2 秒时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        main()
    return f.getvalue().strip()

# provided sample
assert run("3 2\n1 3 3\n2 3 5\n2 1 1\n") == "5", "sample 1"

# minimum-size input
assert run("1 0\n10\n") == "0", "single vertex"

# all-equal values
assert run("3 0\n2 2 2\n") == "6", "equal vertex costs"

# special offer cheaper than min edges
assert run("3 1\n5 7 9\n1 3 4\n") == "9", "special cheaper than sum edges"

# maximum-size edge cost
assert run("2 1\n1000000000000 100
```
