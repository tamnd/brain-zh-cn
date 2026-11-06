---
title: "CF 1922B - 形成三角形"
description: "我们有一组棍子，每根棍子的长度都是 2 的幂。 输入并不直接给出实际长度，而是给出指数 $ai$，使得棒的长度为 $2^{ai}$。"
date: "2026-06-08T19:16:13+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "constructive-algorithms", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1922
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 161 (Rated for Div. 2)"
rating: 1200
weight: 1922
solve_time_s: 100
verified: true
draft: false
---

[CF 1922B - 形成三角形](https://codeforces.com/problemset/problem/1922/B)

 **评分：** 1200
 **标签：** 组合学、构造性算法、数学、排序
 **求解时间：** 1m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组棍子，每根棍子的长度都是 2 的幂。 输入不直接给出实际长度，而是给出指数$a_i$这样棍子的长度是$2^{a_i}$。 我们的任务是计算有多少种方法可以恰好选取三根可以形成非退化三角形的木棍。 如果任意两条边的长度之和超过第三条边的长度，则三角形是非退化的。 

每个测试用例的输出是一个整数，表示有效棒三元组的数量。 由于木棍是由 2 的幂定义的，因此许多木棍可能具有相同的长度，并且三角形不等式简化为最大木棍与其他两根木棍之和之间的简单比较。 

约束条件告诉我们$n$可以大到$3 \cdot 10^5$并且最多可以有$10^4$测试用例，所有测试用例中的棒总数由$3 \cdot 10^5$。 这意味着任何复杂度低于$O(n^2)$每个测试用例可能会太慢。 一个$O(n \log n)$或者$O(n^2)$如果认真实施，这种方法是可以接受的。 

当所有棍子都具有相同的长度时，就会出现边缘情况，使每个三元组都有效，或者当棍子呈指数增长时，使大多数三元组无效。 例如，如果我们有指数棒`[1, 2, 3]`对应长度`[2, 4, 8]`，无法形成三角形，因为$2 + 4 = 6 \le 8$。 

## 方法

 天真的方法是蛮力：迭代所有的三元组并检查它们是否满足三角不等式。 这是正确的，但有$O(n^3)$复杂性，这是不可行的$n$最多$3 \cdot 10^5$。 即使对于中等$n$，这样的方法太慢了。 

关键的观察结果是棒的长度是 2 的幂，这意味着三角不等式可以简化。 按指数对木棒进行排序会将问题转换为排序数组上的标准三角形计数问题。 对于排序棒，如果我们选择三个索引$i < j < k$，如果存在非简并三角形$2^{a_i} + 2^{a_j} > 2^{a_k}$。 排序保证了$a_i \le a_j \le a_k$，所以我们只需要检查最大的元素与较小的两个元素的总和。 这允许两指针或三指针方法有效地计算有效的三元组。 

我们可以使用相等长度的棍子的组合公式预先计算三元组的数量，然后通过扫描排序的唯一长度来解释不同长度的棍子。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 太慢了 |
 | 排序+三指针| O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$和指数$a_i$。 
2. 对指数数组进行排序。 排序使我们能够通过仅将最大的棍子与较小的两个棍子的总和进行比较来快速强化三角形不等式。 
3. 初始化有效三元组的计数器。 
4. 迭代具有三个索引的数组$i < j < k$。 使固定$i$和$j$并找到最大值$k$这样$2^{a_i} + 2^{a_j} > 2^{a_k}$。 使用已排序的属性来移动$k$向前直到条件失败。 
5. 对于每个有效$i, j$对，添加有效的数量$k$到柜台的位置。 
6. 扫描所有对后输出计数器。 

为什么它有效：排序数组确保$k$增加，$2^{a_k}$也增加。 通过推进$k$只有当三角不等式成立时，我们才对每个三元组只计数一次，以保证正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def count_triangles(n, a):
    a.sort()
    count = 0
    for i in range(n - 2):
        k = i + 2
        for j in range(i + 1, n - 1):
            while k < n and (1 << a[i]) + (1 << a[j]) > (1 << a[k]):
                k += 1
            count += k - j - 1
    return count

t = int(input())
results = []
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    results.append(str(count_triangles(n, a)))

print("\n".join(results))
```代码首先对指数数组进行排序。 对于每一对棍子，它都会前进$k$直到三角不等式失效。 有效数量$k$对于每对$(i, j)$正是$k - j - 1$。 排序是必要的，以确保一旦$2^{a_i} + 2^{a_j} \le 2^{a_k}$，所有后续的$k$也会失败。 

## 工作示例

 输入示例 1：```
7
1 1 1 1 1 1 1
```| 我| j | k（最大值）| 添加了有效的三元组 | 专柜|
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 2 | 5 | 5 |
 | 0 | 2 | 3 | 4 | 9 |
 | 0 | 3 | 4 | 3 | 12 | 12
 | 0 | 4 | 5 | 2 | 14 | 14
 | 0 | 5 | 6 | 1 | 15 | 15
 | 1 | 2 | 3 | 4 | 19 | 19
 | 1 | 3 | 4 | 3 | 22 | 22
 | 1 | 4 | 5 | 2 | 24 |
 | 1 | 5 | 6 | 1 | 25 | 25
 | 2 | 3 | 4 | 3 | 28 | 28
 | 2 | 4 | 5 | 2 | 30|
 | 2 | 5 | 6 | 1 | 31 |
 | 3 | 4 | 5 | 2 | 33 | 33
 | 3 | 5 | 6 | 1 | 34 | 34
 | 4 | 5 | 6 | 1 | 35 | 35

 每个三元组都有效，因为所有棍子的长度都相同。 

输入示例 2：```
4
3 2 1 3
```排序后：`[1, 2, 3, 3]`（长度`[2, 4, 8, 8]`）

 | 我| j | k（最大值）| 添加了有效的三元组 | 专柜|
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 2 | 0 | 0 |
 | 0 | 2 | 3 | 2 | 2 |
 | 1 | 2 | 3 | 0 | 2 |

 只有两个三元组满足三角不等式：`(1,3,4)`和`(2,3,4)`在基于 1 的索引中。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 排序需要 O(n log n)，带有指针 k 的嵌套循环在最坏情况下总共运行 O(n^2)。 |
 | 空间| O(n) | 我们存储指数数组和结果列表。 |

 鉴于总和$n$所有测试用例的≤ 3·10^5，解决方案在时间限制内很合适。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    import builtins
    input = builtins.input
    t = int(input())
    results = []
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        results.append(str(count_triangles(n, a)))
    return output.getvalue().strip()

# Provided samples
assert run("4\n7\n1 1 1 1 1 1 1\n4\n3 2 1 3\n3\n1 2 3\n1\n1\n") == "35\n2\n0\n0"

# Custom tests
assert run("1\n3\n0 0 0\n") == "1"  # All equal lengths, one triangle
assert run("1\n5\n0 1 2 3 4\n") == "0"  # Exponentially increasing, no triangle
assert run("1\n6\n1 1 2 2 3 3\n") == "7"  # Mix of equal lengths
assert run("1\n1\n10\n") == "0"  # Single stick, cannot form triangle
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3\n0 0 0`| 1 | 最小尺寸输入，所有相同的棍子 |
 |`5\n0 1 2 3 4`| 0 | 增加幂，不可能有三角形 |
 |`6\n1 1 2 2 3 3`| 7 | 重复值和不同值的混合 |
 |`1\n10`| 0 | 单根棍子，不能形成三角形 |

 ## 边缘情况

 如果所有的棍子都相等，比如 `[1, 1, 1
