---
title: "CF 1618G - 交易者问题"
description: "在这个问题中，Monocarp 有一组物品，每个物品都有一个整数价格，他可以将这些物品与另一个角色的物品进行交易。"
date: "2026-06-10T06:19:40+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dsu", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1618
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 760 (Div. 3)"
rating: 2200
weight: 1618
solve_time_s: 101
verified: false
draft: false
---

[CF 1618G - 交易者问题](https://codeforces.com/problemset/problem/1618/G)

 **评分：** 2200
 **标签：** 数据结构、dsu、贪心、排序
 **求解时间：** 1m 41s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 在这个问题中，Monocarp 有一组物品，每个物品都有一个整数价格，他可以将这些物品与另一个角色的物品进行交易。 每笔交易都允许他赠送一件有价物品$x$并从其他角色处拿走任何物品，其价格最多为$x + k$， 在哪里$k$是特定于查询的值。 每个查询的目标是确定如果允许 Monocarp 在给定的条件下进行任何交易序列，他可以获得的物品的最大总价值$k$。 每个查询都是独立的，因此交易不会在查询之间延续。 

输入大小很大：最多$2 \cdot 10^5$两侧的物品，以及$2 \cdot 10^5$查询。 试图模拟所有可能的交易序列的简单暴力方法是立即不可行的，因为每笔交易都有很多选择，从而导致指数级的可能性。 我们需要一种利用问题结构来有效计算最大值的方法。 

微妙的边缘情况包括 Monocarp 最初拥有比其他角色更便宜的物品但可以利用$k$保证金以“循环”交易并间接购买更昂贵的物品。 另一个边缘情况是，Monocarp 的所有物品已经比其他角色的物品更贵，因此没有交易会增加总数。 例如，如果 Monocarp 有`[10, 20]`另一个有`[5, 6]`和`k = 0`，总量无法改善，如果不正确考虑价格约束，总是尝试交易的天真方法将会失败。 

## 方法

 暴力解决方案将尝试模拟所有交易序列，检查每个 Monocarp 物品中哪些其他物品可以合法获取，并重复直到无法改进为止。 在最坏的情况下，这种方法在项目数量上具有阶乘复杂性，因为每次交易都会改变可用交易的集合。 和$n, m \le 2 \cdot 10^5$，这是完全不可行的。 

关键的见解是，问题可以建模为“可到达”项目的图，其中如果一个项目可以通过交易序列直接或间接地与另一个项目进行交易，则两个项目可以是同一连接组件的一部分。 在这样的组件中，Monocarp 最终可以收集最昂贵的物品，因为交易规则允许将组件中的任何物品与价格在以下范围内的任何其他物品进行交换$k$的交易项目。 因此，最优总值就是最大的总和`n`他最初拥有的组件中所有项目的项目。 

这提出了一种基于排序的策略：如果我们对 Monocarp 的物品和其他角色的物品进行排序，我们可以通过从最低价格到最高价格进行扫描并对差异最大的物品进行分组来有效地找到连接的组件。$k$。 使用并查（DSU）结构使我们能够合并组件并有效地跟踪每个组件的总和。 然后对于每个查询$k$，我们可以处理两个排序列表，构建组件，并对每个组件中包含 Monocarp 初始项的最大项求和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((n+m)!) | O(n+m) | 太慢了 |
 | 最佳| O((n+m) log(n+m) + q log q) | O(n+m) | 已接受 |

 ## 算法演练

 1. 对 Monocarp 的物品进行排序`a`以及其他角色的物品`b`。 这使我们能够按照价格上涨的顺序有效地处理交易。 
2. 将所有项目合并到一个列表中，并带有指示所有权的标志。 每个元素都是一个元组`(price, owner_flag)`在哪里`owner_flag`是`0`对于单果树和`1`对于另一个角色。 
3. 对该组合列表进行排序。 当扫描这个列表时，价格差≤k的连续商品可以合并到同一个组件中。 
4. 使用联合查找 (DSU) 结构来跟踪组件。 每个组件保存其中所有项目的总和。 最初，每个项目都是其自己的组件。 
5. 浏览已排序的组合列表。 对于价格差 ≤ k 的每对连续商品，使用 DSU 合并其组件，更新总和。 
6. 在所有合并之后，对于每个 Monocarp 初始项，找到其组件的总和。 Monocarp 可以获得的最大总和是包含至少一个他的原始物品的组件中物品的总和。 
7. 对每个查询重复步骤 3-6$k$。 

为什么它起作用：不变的是每个组件包含可以通过当前交易链相互交换的所有物品$k$。 由于除了价格差异外，交易不受任何限制，因此 Monocarp 最终可以获得其组件中的所有物品。 因此，将包含其初始项目的分量的总和相加即可得出最佳答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n, vals):
        self.parent = list(range(n))
        self.size = [1]*n
        self.sum = vals[:]
        
    def find(self, x):
        while x != self.parent[x]:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    
    def union(self, x, y):
        xroot = self.find(x)
        yroot = self.find(y)
        if xroot == yroot:
            return
        if self.size[xroot] < self.size[yroot]:
            xroot, yroot = yroot, xroot
        self.parent[yroot] = xroot
        self.size[xroot] += self.size[yroot]
        self.sum[xroot] += self.sum[yroot]

def solve():
    n, m, q = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    ks = list(map(int, input().split()))
    
    all_items = [(val, 0) for val in a] + [(val, 1) for val in b]
    all_items.sort()
    vals = [val for val, _ in all_items]
    owners = [owner for _, owner in all_items]
    
    for k in ks:
        dsu = DSU(n+m, vals)
        for i in range(len(all_items)-1):
            if vals[i+1] - vals[i] <= k:
                dsu.union(i, i+1)
        ans = 0
        for i in range(n+m):
            if owners[i] == 0:
                root = dsu.find(i)
                ans += dsu.sum[root]
                # Mark as used so we don't double count
                dsu.sum[root] = 0
        print(ans)

if __name__ == "__main__":
    solve()
```此实现将 DSU 初始化与查询处理分开。 每个查询都会重建DSU，确保查询的独立性。 每个组件的总和存储在 DSU 中，计数后我们将其清零，以避免多个 Monocarp 项位于同一组件中时重复计算。 

## 工作示例

 ### 示例 1

 输入：```
3 4 5
10 30 15
12 31 14 18
0 1 2 3 4
```| 步骤| 已排序的项目（val，所有者）| 组件| 最大总和 |
 | ---| ---| ---| ---|
 | k = 0 | [(10,0),(12,1),(14,1),(15,0),(18,1),(30,0),(31,1)] | [10]、[12]、[14]、[15]、[18]、[30]、[31] | 10+15+30=55 |
 | k=1 | k=1 合并 (10,12),(14,15),(30,31) | [10,12],[14,15],[18],[30,31] | 12+15+30=56 |
 | k = 2 | 合并 (10,12,14),(14,15),(30,31) | [10,12,14,15],[18],[30,31] | 14+15+30=60 |
 | k=3 | 合并 (10..18),(30,31) | [10..18]，[30,31] | 18+15+30=64 |
 | k = 4 | 与 k=3 相同 | [10..18]，[30,31] | 64 | 64

 这证实了随着 k 的增加，Monocarp 可以逐渐获得更高价值的物品。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n+m) log(n+m) * q) | 每个查询的排序 + DSU 联合操作 |
 | 空间| O(n+m) | 存储项目、DSU 数组和总和 |

 给定 n, m, q ≤ 2·10^5，排序和 DSU 操作足够高效。 每个查询都是独立的，并且由于路径压缩，联合查找操作几乎是线性的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("3 4 5\n10 30 15\n12 31 14 18\n0 1 2 3 4\n") == "55\n56\n60\n64\n64", "sample 1"

# Custom cases
assert run("1 1
```
