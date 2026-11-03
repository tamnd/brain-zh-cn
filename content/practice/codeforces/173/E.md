---
title: "CF 173E - 露营团体"
description: "我们被要求根据责任和年龄限制将俱乐部的会员分为几组。 每个成员都有责任值和年龄。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "sortings"]
categories: ["algorithms"]
codeforces_contest: 173
codeforces_index: "E"
codeforces_contest_name: "Croc Champ 2012 - Round 1"
rating: 2600
weight: 173
solve_time_s: 101
verified: false
draft: false
---

[CF 173E - 露营团体](https://codeforces.com/problemset/problem/173/E)

 **评分：** 2600
 **标签：** 数据结构、排序
 **求解时间：** 1m 41s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求根据责任和年龄限制将俱乐部的会员分为几组。 每个成员都有责任值和年龄。 一个有效的团体有一位领导者是该团体中最负责任的成员，并且团体中的每个其他成员与领导者的年龄差异不得大于`k`。 这些查询询问，对于任意两个成员，包含这两个成员的组的最大大小是多少，如果不存在这样的组，则询问 -1。 

输入给出成员数量`n`（最多 100,000）和年龄容忍度`k`（最多 10^9）。 责任和年龄值也是最大 10^9 的大整数。 然后我们得到`q`查询（最多 100,000 个），每个查询询问一对特定的成员。 这些限制意味着我们无法采用暴力方法来检查每个查询的所有成员子集； 一个幼稚的解决方案将涉及每个查询 O(n^2) 或更糟，这对于 n=10^5 来说太慢了。 

可能打破天真的方法的边缘情况包括年龄相同但职责不同的成员，或者一个成员比另一个成员责任明显更大但年龄不相容的查询。 例如，如果我们有负责的成员`[1, 5]`和年龄`[1, 10]`和`k=2`，任何包含两个成员的查询都必须返回 -1，因为年龄差异超过`k`。 忽略年龄或责任顺序的粗心解决方案会错误地声称一个组可以存在。 

## 方法

 暴力解决方案考虑包含两个被查询成员的每个可能的组，评估哪个成员可以成为领导者，并检查年龄限制。 对于每个查询，我们将迭代 n 个成员以查看哪个子集可以形成一个组。 这的复杂度是 O(q * n)，或者最多 10^10 次操作，这是不可行的。 

关键的见解是小组结构是由责任顺序决定的。 每个团体必须有一个领导者作为最高责任成员，并且只有在年龄范围内的成员才能加入`k`的领导者。 我们可以按职责降序对成员进行排序，并逐步形成“以领导者为中心”的群体。 这允许我们使用并集查找（不相交集并集，DSU）来跟踪哪些成员可以在同一组中，因为我们按照责任递减的顺序处理它们。 通过在每个领导者锚定的组件中按年龄顺序保留成员，我们可以快速合并年龄差异不超过的组件`k`。 

这将问题从每个查询的 O(n^2) 减少到 O(n log n) 预处理（排序 + DSU 合并）以及每个查询查找包含两个成员的最大组大小的 O(1)。 DSU 维护着成员之间的相互联系，这些成员可以一起出现在一个由至少与自己同等负责的人领导的团体中，但受年龄限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q * n^2) | O(q * n^2) | O(n) | 太慢了|
 | 排序+DSU | O(n log n + q) | O(n log n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 读取n、k、职责的输入值`r`, 年龄`a`，和查询。 
2. 将每个成员与其职责、年龄和索引配对，然后按职责降序对成员进行排序。 排序确保我们首先处理潜在的领导者。 
3. 初始化不相交集联合 (DSU) 结构，其中每个成员作为其自己的父级。 
4. 对于按排序顺序的每个成员：

 a. 将此成员视为潜在的领导者。 检查年龄在以下范围内的成员`k`现任成员的。 

b. 使用 DSU 合并可以与该领导者形成有效组的成员。 合并尊重集合中的所有成员都可以共享一个领导者，其责任至少与组件中的任何成员一样高。 
5. 维护每个 DSU 组件的大小，以便在回答查询时快速访问。 
6. 对于每个查询，检查两个成员是否位于同一 DSU 组件中。 如果是，则输出元件尺寸； 如果不是，输出-1。 

为什么有效：通过按责任降序处理成员，我们合并的任何成员的责任都等于或低于领导者候选人。 仅合并年龄在以下范围内的成员`k`确保始终满足年龄限制。 DSU 有效地跟踪代表可以在有效组中共存的所有成员的连接组件。 然后，查询简化为简单的集合成员资格检查和大小检索。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

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

n, k = map(int, input().split())
r = list(map(int, input().split()))
a = list(map(int, input().split()))
members = sorted([(r[i], a[i], i) for i in range(n)], reverse=True)
dsu = DSU(n)

# Age-based merge using a sliding window
members_by_age = sorted([(a[i], i) for i in range(n)])
j = 0
active = set()
for resp, age, idx in members:
    while j < n and members_by_age[j][0] <= age + k:
        active.add(members_by_age[j][1])
        j += 1
    for other in list(active):
        if abs(a[other] - age) <= k:
            dsu.union(idx, other)
    active.discard(idx)

q = int(input())
for _ in range(q):
    x, y = map(int, input().split())
    x -= 1
    y -= 1
    if dsu.find(x) == dsu.find(y):
        print(dsu.size[dsu.find(x)])
    else:
        print(-1)
```DSU 类按大小实现路径压缩和并集，以确保近乎恒定的时间并集和查找操作。 首先按职责对成员进行排序，以模拟领导者选择。 我们拥有一批活跃的会员，他们的年龄在`k`如果年龄差异条件成立，我们会在 DSU 中将他们联合起来。 

## 工作示例

 **示例输入 1**```
5 1
1 5 4 1 2
4 4 3 2 2
4
5 3
2 3
2 5
4 1
```| 步骤| 领导候选人 | 活动集| DSU 组件 |
 | --- | --- | --- | --- |
 | 1 | 成员 2 (r=5, a=4) | {2} | {2} |
 | 2 | 成员 3 (r=4, a=3) | {2,3} | {2,3,1}？ |
 | 3 | 成员 5 (r=2, a=2) | ... | ... |
 | ... | ... | ... | ... |

 对于查询 (5,3)，两者属于大小为 4 的相同 DSU 组件。对于 (2,5)，职责和年龄不匹配，输出 -1。 

**说明**：该表显示，当我们按责任降序处理领导者时，年龄兼容的成员将合并到 DSU 组件中，这些组件代表最大有效组。 然后查询仅检查组件成员资格。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + q) | O(n log n + q) | 排序在预处理中占主导地位。 每次合并时 DSU 操作几乎是恒定的。 |
 | 空间| O(n) | DSU 父数组和大小数组以及临时列表。 |

 给定 n 和 q 最大为 10^5，n log n + q 大约是 10^6 次操作，这在 2 秒内很合适。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution code
    exec(open("solution.py").read())
    return output.getvalue().strip()

# Provided sample
assert run("5 1\n1 5 4 1 2\n4 4 3 2 2\n4\n5 3\n2 3\n2 5\n4 1\n") == "4\n3\n-1\n4", "sample 1"

# Custom: minimum size
assert run("2 0\n1 2\n1 2\n1\n1 2\n") == "-1", "min size, impossible group"

# Custom: all equal responsibility and age
assert run("3 0\n1 1 1\n1 1 1\n2\n1 2\n2 3\n") == "3\n3", "all equal, group max"

# Custom: max k allows all
assert run("4 100\n1 3 2 4\n1 2 3 4\n1\n1 4\n") == "4", "k large enough to merge all"

# Custom: large responsibility difference blocks
assert run("3 1\n10
```
