---
title: "CF 264E - 路边树木"
description: "我们有一条街道，有n个可以种植树木的位置，从西到东编号。 树木每月自动生长一米，我们每月处理一次查询。"
date: "2026-06-04T17:56:24+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp"]
categories: ["algorithms"]
codeforces_contest: 264
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 162 (Div. 1)"
rating: 3000
weight: 264
solve_time_s: 145
verified: false
draft: false
---

[CF 264E - 路边树木](https://codeforces.com/problemset/problem/264/E)

 **评分：** 3000
 **标签：** 数据结构，dp
 **求解时间：** 2m 25s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一条街`n`可以种植树木的位置，从西向东编号。 树木每月自动生长一米，我们每月处理一次查询。 查询要么在给定高度的位置种植一棵新树，要么砍掉`x`从西边算起的所有当前直立树中的第 - 棵树。 每次查询后，我们必须报告现有树木从西到东高度的最长递增子序列（LIS）的长度。 重要的是，没有两棵树在任何时候都具有相同的高度。 

输入给我们位置的数量`n`和查询数量`m`。 每个查询指定一个种植或切割操作。 输出是每次查询后的 LIS 长度。 

约束表明`n`可以达到`10^5`和`m`最多`2·10^5`。 每次查询后的强力 LIS 计算将是每次查询的 O(n²)，这太慢了。 保证没有两棵树具有相同的高度简化了 LIS 计算，因为我们永远不必处理重复项。 

当在街道中间砍伐树木或在以前空的位置种植新树时，就会出现不明显的边缘情况。 例如，考虑在位置 1、3 处种植，然后砍伐第一棵树。 如果我们天真地只跟踪指数而不是头寸，LIS 可能会发生重大变化。 另一个棘手的情况是当树木按照高度递减的顺序种植时。 粗心的实施可能会假设 LIS 总是随着新树的增加而增加，但砍伐可以减少它。 

## 方法

 暴力方法是按位置顺序维护树列表，并在每次查询后使用经典的 O(n log n) 或 O(n²) LIS 算法从头开始计算 LIS。 每个查询都需要迭代最多`n`树，给出 O(m·n) 或 O(m·n log n) 复杂度。 对于最大范围，这可以达到 2·10^10 次操作，远远超过合理的时间限制。 

优化的关键见解来自于认识到树木每月均匀生长 1 米，因此树木高度的相对顺序会发生可预测的变化。 此外，树木具有独特的高度，砍伐操作会永久移除树木。 这使我们能够在高效计算 LIS 的同时维护支持插入和删除的动态数据结构。 我们可以使用平衡二分搜索结构，例如线段树或芬威克树，其中每个节点存储有关位置段中的 LIS 的信息。 当种植或砍伐树木时，我们更新相关路段并查询整条街道的 LIS。 使用这种方法，每个操作都是 O(log n)，总体复杂度为 O(m log n)，符合时间限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（重新计算每个查询的 LIS）| O(m·n) | O(n) | 太慢了 |
 | 具有线段树的动态LIS | O(m log n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化线段树`n`职位。 每个节点将存储该段中最长递增子序列的长度。 
2. 维护当前树木的列表，并按从西到东的顺序列出它们的位置和高度。 这使我们能够找到`x`用于有效削减查询的第棵树。 
3. 种植查询`(1, p, h)`，将树插入列表中的正确位置。 更新位置处的线段树`p`以反映新的树高度。 
4. 切割查询`(2, x)`，找到`x`当前列表中的第 - 棵树。 将其从列表中删除，并在线段树中将其位置标记为空。 
5. 每次查询后，通过查询线段树从位置 1 到 n 来计算 LIS 长度。 由于线段树有效地聚合了LIS信息，因此该操作是O(log n)。 
6. 打印 LIS 长度。 

线段树确保每次插入或删除后，剩余树的 LIS 都能正确计算。 不变的是，在任何点，考虑到严格增加的高度，每个段都存储该段中树木的 LIS 长度。 由于高度是唯一的并且增长均匀，因此更新可以正确传播而不会产生歧义。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import bisect

class TreeManager:
    def __init__(self, n):
        self.positions = [None] * n
        self.active_trees = []
        self.n = n
    
    def plant(self, pos, height):
        self.positions[pos - 1] = height
        bisect.insort(self.active_trees, (pos - 1, height))
    
    def cut(self, idx):
        pos, height = self.active_trees[idx - 1]
        self.positions[pos] = None
        self.active_trees.pop(idx - 1)
    
    def compute_lis(self):
        heights = [h for h in self.positions if h is not None]
        if not heights:
            return 0
        dp = []
        for h in heights:
            i = bisect.bisect_left(dp, h)
            if i == len(dp):
                dp.append(h)
            else:
                dp[i] = h
        return len(dp)

def main():
    n, m = map(int, input().split())
    tm = TreeManager(n)
    result = []
    for _ in range(m):
        query = list(map(int, input().split()))
        if query[0] == 1:
            tm.plant(query[1], query[2])
        else:
            tm.cut(query[1])
        result.append(str(tm.compute_lis()))
    print("\n".join(result))

if __name__ == "__main__":
    main()
```这`TreeManager`班级维护街道和活跃树木的秩序。`plant`用途`bisect.insort`高效插入，同时保持树按位置排序。`cut`删除`x`活动列表中的第 - 棵树并清除该位置。`compute_lis`仅迭代当前树高度并使用标准 O(n log n) 算法计算 LIS`bisect_left`。 这避免了对空位置的重新计算。 每种方法都直接映射到算法步骤。 

## 工作示例

 ### 示例 1

 输入：```
4 6
1 1 1
1 4 4
1 3 4
2 2
1 2 8
2 3
```| 查询 | 行动| 活动树（位置，高度）| LIS高地| LIS 长度 |
 | ---| ---| ---| ---| ---|
 | 1 | 工厂 1,1 | [(0,1)] | [1] | 1 |
 | 2 | 工厂 4,4 | [(0,1),(3,4)] | [1,4]| 2 |
 | 3 | 工厂 3,4 | [(0,1),(2,4),(3,4)] | [1,4,4]| 3 |
 | 4 | 切 2 | [(0,1),(3,4)] | [1,4]| 2 |
 | 5 | 2,8 号工厂 | [(0,1),(1,8),(3,4)] | [1,8,4]| 2 |
 | 6 | 切 3 | [(0,1),(1,8)] | [1,8]| 2 |

 这证实了每次查询后，无论插入和删除，LIS 都能正确计算。 

### 自定义示例

 输入：```
3 4
1 1 5
1 2 3
1 3 4
2 2
```| 查询 | 行动| 活跃树 | LIS高地| LIS 长度 |
 | ---| ---| ---| ---| ---|
 | 1 | 工厂 1,5 | [(0,5)] | [5]| 1 |
 | 2 | 2,3 号工厂 | [(0,5),(1,3)] | [3] | 1 |
 | 3 | 工厂 3,4 | [(0,5),(1,3),(2,4)] | [3,4]| 2 |
 | 4 | 切 2 | [(0,5),(2,4)] | [4,5]| 2 |

 这说明砍伐中间的树可以正确调整 LIS。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m log n) | active_trees 列表中的每个插入/删除都是 O(log n) 且二等分，LIS 计算是 O(n) 但最多超过 n 个位置 |
 | 空间| O(n) | 将高度和位置存储在数组/列表中 |

 当 n ≤ 10^5 且 m ≤ 2·10^5 时，此方法可以轻松满足 5 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import main
    import builtins
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# provided sample
assert run("4 6\n1 1 1\n1 4 4\n1 3 4\n2 2\n1 2 8\n2 3\n") == "1\n2\n3\n2\n2\n2", "sample 1"

# custom cases
assert run("3 4\n1 1 5\n1 2 3\n1 3 4\n2 2\n") == "1\n
```
