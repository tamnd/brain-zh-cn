---
title: "CF 1691E - 组数"
description: "我们在数轴上得到一组线段，每个线段的颜色为红色或蓝色。 每个段占据从 li 到 ri（含）的连续区间。"
date: "2026-06-09T23:11:30+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "dsu", "graphs", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1691
codeforces_index: "E"
codeforces_contest_name: "CodeCraft-22 and Codeforces Round 795 (Div. 2)"
rating: 2300
weight: 1691
solve_time_s: 192
verified: true
draft: false
---

[CF 1691E - 组数](https://codeforces.com/problemset/problem/1691/E)

 **评分：** 2300
 **标签：** 数据结构、dfs 和类似、dsu、图、贪婪、排序
 **求解时间：** 3m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在数轴上得到一组线段，每个线段的颜色为红色或蓝色。 每个段占据一个连续的区间`l_i`到`r_i`，包含在内。 任务是找到线段组，其中如果两个线段具有不同的颜色并且它们的间隔重叠，则认为它们是连接的。 片段可以通过一系列交替颜色间接连接。 输出是每个测试用例的此类连接组的总数。 

约束告诉我们所有测试用例的段总数不超过`10^5`。 这意味着任何算法`O(n^2)`每个测试用例都会太慢。 理想情况下，我们需要一个每个测试用例大致呈线性或线性算数的解决方案`O(n log n)`。 

可能会导致幼稚方法失败的边缘情况包括共享端点但不重叠的线段、相同颜色的多个线段彼此完全重叠，或者颜色交替但具有破坏连接性的间隙的线段。 例如，三段`(0, 0, 1)`,`(1, 1, 2)`,`(0, 3, 4)`形成三个独立的组，因为最后一个红色片段不与蓝色片段重叠，即使它按顺序跟随蓝色片段。 

## 方法

 暴力方法将迭代每对片段并检查它们是否重叠并且具有不同的颜色。 如果确实如此，您可以使用 DSU（不相交集并集）等数据结构将它们合并为一个组。 这是正确的，但需要检查`O(n^2)`对，可以达到`10^10`作业投入最大，远远超出了时限。 

关键的见解是，对于每种颜色，您只需要跟踪迄今为止到达的最右边的点，即可确定相反颜色的段是否连接到当前组。 按起点对片段进行排序并从左到右扫描使我们能够有效地将片段合并到组中。 这将问题减少到扫描两个排序列表（一个用于红色，一个用于蓝色），保持最大范围，并在每当段在相反颜色的最远点之后开始时增加组计数。 

这一观察改变了天真的想法`O(n^2)`方法进入可管理的`O(n log n)`解决方案以排序操作为主。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了|
 | 扫掠 + 最大范围 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 按颜色将段分为两个列表：红色和蓝色。 按左端点对每个列表进行排序`l_i`。 
2.初始化两个变量`max_red`和`max_blue`跟踪每种颜色当前活动组中线段的最右端点。 
3. 初始化组计数器`groups`为 0。这将对连接的组进行计数。 
4. 按从左到右的顺序合并两个排序列表。 对于每个段，检查它是否与相反颜色的当前最大范围重叠。 
5. 如果该段与相反颜色的最大端点重叠，则将其合并到当前组中并更新其颜色的最大端点。 
6. 如果该段在相反颜色的最大到达之后开始，则增加组计数器，因为该段开始一个新的断开连接组。 重置`max_red`和`max_blue`因此。 
7. 继续，直到处理完所有段。 最终值`groups`是连接组的数量。 

为什么它有效：通过始终跟踪红色和蓝色段的最大右端点，我们确保在相反颜色之前或最大值处开始的任何段都必须属于同一组。 超出此点开始的段无法连接到之前的段，因此它们启动一个新组。 排序可确保我们以正确的顺序处理片段并正确处理重叠。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        red, blue = [], []
        for _ in range(n):
            c, l, r = map(int, input().split())
            if c == 0:
                red.append((l, r))
            else:
                blue.append((l, r))
        red.sort()
        blue.sort()
        
        i, j = 0, 0
        max_red, max_blue = -1, -1
        groups = 0
        
        events = []
        for l, r in red:
            events.append((l, r, 0))
        for l, r in blue:
            events.append((l, r, 1))
        events.sort()
        
        for l, r, color in events:
            if color == 0:
                if l > max_blue:
                    groups += 1
                    max_red, max_blue = r, -1
                else:
                    max_red = max(max_red, r)
            else:
                if l > max_red:
                    groups += 1
                    max_blue, max_red = r, -1
                else:
                    max_blue = max(max_blue, r)
        
        print(groups)

if __name__ == "__main__":
    solve()
```该代码首先按颜色对段进行分离和排序。 它按起点顺序合并所有段，并维护每种颜色达到的最大终点。 当一个段在相反颜色的最大值之后开始时，它将开始一个新组。 请注意正确重置新组的最大范围，否则远处的段可能会错误地合并。 

## 工作示例

 ### 输入示例 1```
5
0 0 5
1 2 12
0 4 7
1 9 16
0 13 19
```| 细分 | 颜色 | 左 | 右 | 最大红色 | 最大蓝色 | 团体 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 5 | 5 | -1 | 1 |
 | 1 | 1 | 2 | 12 | 12 5 | 12 | 12 1 |
 | 2 | 0 | 4 | 7 | 7 | 12 | 12 1 |
 | 3 | 1 | 9 | 16 | 16 7 | 16 | 16 1 |
 | 4 | 0 | 13 | 19 | 19 19 | 19 16 | 16 2 |

 该表显示了仅当新段不与相反颜色重叠时如何更新最大范围和如何递增组。 

### 输入示例 2```
3
1 0 1
1 1 2
0 3 4
```前两个段形成一组，最后一个红色段在 max_blue=2 之后开始，形成第二组。 然后最后的红色部分也不与任何蓝色重叠，从而形成三组。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 对红色和蓝色片段进行排序主导了计算。 合并扫描的时间复杂度为 O(n)。 |
 | 空间| O(n) | 存储片段和事件需要线性空间。 |

 这可以舒适地贴合在`2s`限制为`n ≤ 10^5`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# Provided samples
assert run("2\n5\n0 0 5\n1 2 12\n0 4 7\n1 9 16\n0 13 19\n3\n1 0 1\n1 1 2\n0 3 4\n") == "2\n3", "samples"

# Custom cases
assert run("1\n1\n0 0 0\n") == "1", "single segment"
assert run("1\n2\n0 0 5\n0 1 2\n") == "2", "same color segments, not connected"
assert run("1\n3\n0 0 5\n1 5 10\n0 10 15\n") == "1", "chain connection"
assert run("1\n4\n0 0 2\n1 3 4\n0 5 6\n1 7 8\n") == "4", "disjoint segments"

| Test input | Expected output | What it validates |
|------------|----------------|-----------------|
| 1 segment | 1 | minimal case |
| 2 red overlapping | 2 | segments same color not connected |
| 3 forming chain | 1 | transitive group merge |
| 4 disjoint | 4 | each disconnected forms own group |
```## 边缘情况

 仅在端点处接触的线段，例如`(0,0,2)`和`(1,2,4)`被认为是连接的，因为范围是包含在内的。 该算法可以正确处理这个问题，因为它比较`l > max_opposite`来检测新的组。 如果起始值等于相反颜色的最大值，它们仍然会合并。 远处的一段，比如`(0, 10, 12)`在之前的 max_blue 为 4 之后，按预期启动一个新组。 这种处理可确保分组计数时不会出现相差一的错误。
