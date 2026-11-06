---
title: "CF 1857D - 强顶点"
description: "我们有两个数组，a 和 b，长度均为 n。 我们被要求从这些数组构建一个具有 n 个顶点的有向图。 如果差值 a[u] - a[v] 大于或等于 b[u] - b[v]，则从顶点 u 到顶点 v（对于 u != v）存在一条边。"
date: "2026-06-09T00:47:26+07:00"
tags: ["codeforces", "competitive-programming", "math", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1857
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 891 (Div. 3)"
rating: 1300
weight: 1857
solve_time_s: 106
verified: false
draft: false
---

[CF 1857D - 强顶点](https://codeforces.com/problemset/problem/1857/D)

 **评分：** 1300
 **标签：** 数学、排序、树
 **求解时间：** 1m 46s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个数组，`a`和`b`, 两者的长度`n`。 从这些数组中，我们被要求构造一个有向图`n`顶点。 从顶点有一条边`u`到顶点`v`（为了`u != v`）如果有差异`a[u] - a[v]`大于或等于`b[u] - b[v]`。 构建此图后，我们想要识别所有_强顶点_。 如果从该顶点存在到图中每个其他顶点的有向路径，则该顶点是强的。 

输入由多个测试用例组成，其总和`n`所有测试用例高达 200,000 个。 这个界限立即告诉我们，一种显式检查所有顶点对的简单方法，这需要`O(n^2)`每个测试用例的时间太慢。 和`n`最多 2·10^5，我们需要一个大致的解决方案`O(n log n)`或者`O(n)`每个测试用例的时间。 

需要注意的边缘情况是所有顶点都可以相互到达，例如，如果`a`和`b`都是递增序列。 在这种情况下，每个顶点都是强的。 当一个顶点明显更高时，会发生另一种微妙的情况`a[i]`相对于`b[i]`与其他人相比； 它可能占据主导地位并成为唯一的强顶点。 例如，`a = [1, 2, 3]`和`b = [1, 1, 1]`仅产生最后一个强度相同的顶点。 

## 方法

 蛮力方法将迭代所有对`(u, v)`并显式构造有向边。 之后，我们可以使用 BFS 或 DFS 从每个顶点执行可达性检查。 这是正确的，因为它直接遵循问题陈述，但它需要`O(n^2)`每个测试用例的操作次数，最坏情况下可以达到4·10^10。 这太慢了。 

关键的观察是重新制定边缘条件。 不平等`a[u] - a[v] >= b[u] - b[v]`可以重写为`(a[u] - b[u]) >= (a[v] - b[v])`。 表示`c[i] = a[i] - b[i]`。 然后一条边从`u`到`v`每当`c[u] >= c[v]`。 这揭示了一个结构：具有更高的顶点`c[i]`可以到达更低的顶点`c[i]`。 因此，最强的顶点是具有最大的顶点`c[i]`价值。 这些顶点可以到达所有小于或等于的顶点`c[i]`，以及较小的顶点`c[i]`无法到达较大的顶点`c[i]`。 这种见解将问题分解为计算最大值`c[i]`并确定哪些指数实现了这一目标。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n^2) | O(n^2) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取数组`a`和`b`。 
2. 计算辅助数组`c`在哪里`c[i] = a[i] - b[i]`。 
3. 求最大值`max_c`在`c`。 
4. 识别所有指标`i`在哪里`c[i] == max_c`。 这些索引对应于强顶点。 
5. 按升序输出强顶点的数量及其索引列表。 

这是有效的，因为条件`c[u] >= c[v]`确保顶点具有最大`c`可以到达所有其他人。 较小的顶点`c`无法到达较大的顶点`c`自从`c[u] < c[v]`失败了不平等，所以他们不能强大。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    
    c = [a[i] - b[i] for i in range(n)]
    max_c = max(c)
    
    strong = [i + 1 for i in range(n) if c[i] == max_c]
    print(len(strong))
    print(*strong)
```该解决方案首先读取测试用例的数量。 对于每个测试用例，它读取数组`a`和`b`并计算`c[i] = a[i] - b[i]`。 的最大值`c`确定哪些顶点是强的。 我们存储达到该最大值的从 1 开始的顶点索引并打印结果。 该实现正确处理多个测试用例并保留顺序。 

## 工作示例

 **样品1**

 输入数组：`a = [3, 1, 2, 4]`

`b = [4, 3, 2, 1]`计算`c = a - b = [-1, -2, 0, 3]`。 

最大限度`c`是`3`，仅在索引处实现`4`。 

| 我| 一个[我] | b[i] | c[i] |
 | --- | --- | --- | --- |
 | 1 | 3 | 4 | -1 |
 | 2 | 1 | 3 | -2 |
 | 3 | 2 | 2 | 0 |
 | 4 | 4 | 1 | 3 |

 强顶点：`[4]`。 

**样品2**

 输入数组：`a = [1, 2, 4, 1, 2]`

`b = [5, 2, 3, 3, 1]`计算`c = [-4, 0, 1, -2, 1]`。 

最大限度`c`是`1`，在指数上实现`3`和`5`。 

| 我| 一个[我] | b[i] | c[i] |
 | --- | --- | --- | --- |
 | 1 | 1 | 5 | -4 |
 | 2 | 2 | 2 | 0 |
 | 3 | 4 | 3 | 1 |
 | 4 | 1 | 3 | -2 |
 | 5 | 2 | 1 | 1 |

 强顶点：`[3, 5]`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 计算`c`需要 O(n)，查找最大值需要 O(n)，识别索引需要 O(n) |
 | 空间| O(n) | 大批`c`存储长度为 n 的 |

 所有测试用例的总操作总数为 O(total n) ≤ 2·10^5，完全在 2 秒限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        c = [a[i] - b[i] for i in range(n)]
        max_c = max(c)
        strong = [i + 1 for i in range(n) if c[i] == max_c]
        print(len(strong))
        print(*strong)
    return output.getvalue().strip()

# Provided samples
assert run("5\n4\n3 1 2 4\n4 3 2 1\n5\n1 2 4 1 2\n5 2 3 3 1\n2\n1 2\n2 1\n3\n0 2 1\n1 3 2\n3\n5 7 4\n-2 -3 -6") == "1\n4\n2\n3 5\n1\n2\n3\n1 2 3\n2\n2 3"

# Custom cases
assert run("1\n2\n0 0\n0 0") == "2\n1 2", "All equal"
assert run("1\n3\n1 2 3\n3 2 1") == "1\n3", "Single max at end"
assert run("1\n4\n4 4 4 4\n1 1 1 1") == "4\n1 2 3 4", "All vertices strong"
assert run("1\n5\n1 2 3 4 5\n5 4 3 2 1") == "1\n5", "Increasing difference at last"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a=[0,0], b=[0,0]`|`2\n1 2`| 所有顶点均等的情况，人人都是强的 |
 |`a=[1,2,3], b=[3,2,1]`|`1\n3`| 单顶点很强，检查正确的最大计算 |
 |`a=[4,4,4,4], b=[1,1,1,1]`|`4\n1 2 3 4`| 所有顶点 |
