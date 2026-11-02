---
title: "CF 1702C - 训练和查询"
description: "我们得到了一条沿着索引非常大的车站的火车路线，从 1 到 $10^9$。 火车按照 $u1、u2、dots、un$ 列表的确切顺序行驶，并且可以多次重访车站。"
date: "2026-06-09T21:41:54+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1702
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 805 (Div. 3)"
rating: 1100
weight: 1702
solve_time_s: 157
verified: true
draft: false
---

[CF 1702C - 训练和查询](https://codeforces.com/problemset/problem/1702/C)

 **评分：** 1100
 **标签：** 数据结构，贪心
 **求解时间：** 2m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一条火车路线，沿途索引非常大，从 1 到$10^9$。 火车按照列表中的确切顺序行驶$u_1, u_2, \dots, u_n$并且可以多次重访车站。 对于每个包含两个站点的查询$a_j$和$b_j$，我们需要确定火车是否可以运载乘客$a_j$到$b_j$沿着路线的前进方向。 

挑战来自于大范围的站点索引以及潜在的许多查询。 约束允许最多$2 \cdot 10^5$每个测试用例的站和查询，所有测试用例的总和也同样有界。 这排除了对每个查询的路线进行迭代的任何算法，因为这可能会到达$2 \cdot 10^5 \times 2 \cdot 10^5 = 4 \cdot 10^{10}$操作对于 3 秒的限制来说太大了。 

重复的站点会产生微妙的效果。 如果$u = [1, 2, 1]$并且查询是从 2 到 1，如果忽略 1 在 2 之前和之后出现这一事实，天真的“第一次出现到最后一次出现”方法可能会失败。正确的解决方案必须考虑起始站的第一次出现和结束站的最后一次出现，以尊重前向。 

另一种边缘情况是起点站或终点站不在路线上。 如果$a_j$或者$b_j$没有出现在路线中，答案自动为“否”。 

## 方法

 暴力方法很简单：对于每个查询，从左到右扫描火车路线，看看是否可以到达$b_j$遇到之后$a_j$。 这是可行的，因为路线是明确定义的，但对于大输入来说它会失败。 对于最坏的情况$n = k = 2 \cdot 10^5$，这需要最多$O(n \cdot k) = 4 \cdot 10^{10}$的操作，这是不可行的。 

最佳方法使用预计算洞察力。 对于路线中的每个车站索引，我们存储它第一次出现的时间和最后一次出现的时间。 然后，对于来自的查询$a_j$到$b_j$，如果第一次出现，则答案为“是”$a_j$在最后一次出现之前$b_j$。 这是可行的，因为火车只会向前行驶； 第一次登机的机会$a_j$必须在最后到达机会之前到达$b_j$。 

这将每个查询减少到$O(1)$查找，并构建第一个/最后一个出现的字典是$O(n)$。 因此，每个测试用例的总复杂度变为$O(n + k)$，在时间限制内很合适。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*k) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n + k) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 对于每个测试用例，请阅读$n$和$k$，路线长度和查询次数。 
2. 阅读火车路线$u$。 初始化两个字典：`first_occurrence`和`last_occurrence`。 迭代$u$带索引$i$。 对于每个站$x = u[i]$， 如果$x$尚未进入`first_occurrence`，将其设置为$i$。 随时更新`last_occurrence[x] = i\`。 
3. 对于每个查询$a_j, b_j$，检查路线中是否存在两个站点。 如果其中一个缺失，则打印 NO。 否则，比较索引：如果`first_occurrence[a_j] <= last_occurrence[b_j]`，打印YES； 否则，打印NO。 

为什么它有效：该算法保持了不变式`first_occurrence[x]`是最早可以登车的地点$x$和`last_occurrence[y]`是您可以在车站下车的最晚点$y$。 如果有第一次登机的机会$a_j$在最后一次到达机会之后$b_j$，火车不能运载来自$a_j$到$b_j$在前进的方向。 否则，也可以。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    input()  # blank line
    n, k = map(int, input().split())
    u = list(map(int, input().split()))
    
    first_occurrence = {}
    last_occurrence = {}
    
    for i, station in enumerate(u):
        if station not in first_occurrence:
            first_occurrence[station] = i
        last_occurrence[station] = i
    
    for _ in range(k):
        a, b = map(int, input().split())
        if a not in first_occurrence or b not in last_occurrence:
            print("NO")
        elif first_occurrence[a] <= last_occurrence[b]:
            print("YES")
        else:
            print("NO")
```该解决方案首先预先计算每个站的第一次和最后一次出现。 这避免了为每个查询重复扫描路线。 检查字典中是否存在也可以处理车站未出现在路线中的情况。 

## 工作示例

 **测试用例1：**

 路线：`[3, 7, 1, 5, 1, 4]`查询：`(3, 5), (1, 7), (3, 10)`| 车站| 第一 | 最后 |
 | --- | --- | --- |
 | 3 | 0 | 0 |
 | 7 | 1 | 1 |
 | 1 | 2 | 4 |
 | 5 | 3 | 3 |
 | 4 | 5 | 5 |

 查询1：`3 -> 5`→ 第一个_occ[3] = 0，最后一个_occ[5] = 3 → 是

 查询2：`1 -> 7`→ 第一个_occ[1] = 2，最后一个_occ[7] = 1 → 否

 查询3：`3 -> 10`→ 10 不在航线中 → 否

 **测试用例2：**

 路线：`[1, 2, 1]`查询：`(2, 1), (1, 2), (4, 5)`| 车站| 第一 | 最后 |
 | --- | --- | --- |
 | 1 | 0 | 2 |
 | 2 | 1 | 1 |

 查询1：`2 -> 1`→ 第一个_occ[2] = 1，最后一个_occ[1] = 2 → 是

 查询2：`1 -> 2`→ 第一个_occ[1] = 0，最后一个_occ[2] = 1 → 是

 查询3：`4 -> 5`→ 4 人失踪 → 否

 这表明重复的站点得到了正确处理，并且丢失站点的查询被拒绝。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n + k) | 构建第一个/最后一个出现的映射需要 O(n)，回答 k 个查询则需要 O(k) |
 | 空间| O(n) | 我们存储路线中每个唯一车站的第一次和最后一次出现|

 假定所有测试用例的 n 和 k 之和不超过$2 \cdot 10^5$，该解决方案可以轻松地在 3 秒内运行，并且内存开销较低。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    exec(open("solution.py").read(), globals())
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# Provided sample
assert run("3\n\n6 3\n3 7 1 5 1 4\n3 5\n1 7\n3 10\n\n3 3\n1 2 1\n2 1\n1 2\n4 5\n\n7 5\n2 1 1 1 2 4 4\n1 3\n1 4\n2 1\n4 1\n1 2") == \
"""YES
NO
NO
YES
YES
NO
NO
YES
YES
NO
YES"""

# Minimum size input
assert run("1\n\n1 1\n1\n1 1") == "YES"

# All equal stations
assert run("1\n\n4 2\n2 2 2 2\n2 2\n2 3") == "YES\nNO"

# Maximum k with repeated first/last
assert run("1\n\n5 3\n1 2 3 2 1\n1 3\n2 2\n3 1") == "YES\nYES\nNO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n\n1 1\n1\n1 1`| 是 | 最小输入边缘情况 |
 | `1\n\n4 2\n2 2 2 2\n2 2\n2 | | |
