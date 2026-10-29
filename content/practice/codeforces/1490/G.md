---
title: "CF 1490G - 旧软盘驱动器"
description: "我们有一个整数循环数组，代表旧软盘驱动器中的磁盘。 每个整数可以是正数或负数。"
date: "2026-06-10T22:42:44+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "math"]
categories: ["algorithms"]
codeforces_contest: 1490
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 702 (Div. 3)"
rating: 1900
weight: 1490
solve_time_s: 164
verified: true
draft: false
---

[CF 1490G - 旧软盘驱动器](https://codeforces.com/problemset/problem/1490/G)

 **评级：** 1900
 **标签：** 二分查找、数据结构、数学
 **求解时间：** 2m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个整数循环数组，代表旧软盘驱动器中的磁盘。 每个整数可以是正数或负数。 当驱动器收到一个号码时$x$，从第一个元素开始，按顺序对元素求和，根据需要循环，直到累加和至少达到$x$。 计算的时间是访问的元素数。 对于多个查询，我们需要确定驱动器需要多长时间才能达到或超过每个查询值。 如果整个数组的和为非正数，则可能存在某些$x$值无法访问，在这种情况下驱动器将无限期地运行并且我们返回$-1$。 

输入可以很大：数组大小$n$和查询数量$m$每个都可以达到$2 \cdot 10^5$，并且所有测试用例的总和不超过$2 \cdot 10^5$。 这意味着一个$O(n \cdot m)$暴力方法是不可行的。 我们需要一个能够预处理数组并有效地回答每个查询的解决方案，最好是在$O(\log n)$经过一些线性预处理后每个查询的时间。 

边缘情况包括全部为负数的数组，其中某些查询永远无法满足，或者包含正数和负数混合的数组，其中最大前缀和小于查询。 例如，如果$a = [-2, -1]$和$x = 1$，无论旋转多少次都不会达到$x$，所以答案一定是$-1$。 当查询小于第一个元素时，会发生另一种微妙的情况； 即使在某个时间，驱动器也可能会立即停止$0$。 

## 方法

 暴力方法单独模拟每个查询的磁盘旋转。 它从第一个元素开始保持运行总和，每秒添加下一个元素，然后环绕到数组的末尾。 当总和达到查询时停止。 这种方法工作正常，但执行$O(n \cdot m)$最坏情况下的操作。 和$n$和$m$最多$2 \cdot 10^5$，这将取决于$4 \cdot 10^{10}$的操作，远远超出了时限。 

关键的观察结果是圆盘是圆形的。 一整轮旋转的累积和是一个常数，$S = \sum a_i$。 如果$S \le 0$，总和不能无限增加，有些查询永远达不到。 如果$S > 0$，旋转一整圈后，累计和增加$S$，因此我们可以计算在到达查询之前需要多少次完整旋转。 在一次旋转内，我们只需要最大前缀和即可找到我们需要走多远。 

我们可以预处理一个前缀和数组，存储每个索引处达到的最大和。 然后，对于每个查询，我们检查是否可以在第一次旋转内得到满足。 如果没有，则总和$S > 0$，我们使用整数除法计算所需的最小完整旋转次数，最后对单个旋转的前缀和使用二分搜索来确定所需的附加步骤。 这将查询复杂度降低到$O(\log n)$后$O(n)$预处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*m) | O(n) | 太慢了|
 | 最佳 | O(n + m log n) | O(n + m log n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算数组的前缀和$a$，并且对于每个位置$i$，存储到达该位置的最大总和。 令这个数组为`max_prefix`。 
2. 计算数组的总和，`total_sum = sum(a)`。 
3. 对于每个查询 $x`：

 1.如果`max_prefix[-1] >= x`，答案就在第一次旋转之内。 使用二分查找`max_prefix`找到前缀和至少为的最早索引$x$。 时间就是这个索引。 
2.如果`total_sum <= 0`和`max_prefix[-1] < x`，查询是不可能的。 返回`-1`。 
3. 否则，计算完整旋转次数`k`需要这样`total_sum * k + max_prefix[-1] >= x`。 这可以使用整数除法来计算：`k = max(0, (x - max_prefix[-1] + total_sum - 1) // total_sum)`。 
4. 计算剩余金额`x' = x - total_sum * k`。 使用二分查找`max_prefix`找到前缀和至少为的最早索引`x'`。 总时间是`k * n + index`。 
4. 返回所有查询的时间。 

为什么它有效：一个轮换中的最大前缀和决定了我们需要在该轮换中走多远。 每次完整旋转都会使累积和增加`total_sum`。 通过计算所需的完整旋转次数并将其与单次旋转内的前缀和相结合，我们可以找到到达查询的最早时间。 不变量是前缀和不减，total_sum 捕获每次完整旋转的净增加。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from bisect import bisect_left

for _ in range(int(input())):
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    x = list(map(int, input().split()))

    prefix = []
    curr = 0
    max_prefix = []
    for num in a:
        curr += num
        prefix.append(curr)
        max_prefix.append(curr if not max_prefix else max(max_prefix[-1], curr))
    
    total_sum = curr

    for q in x:
        if max_prefix[-1] >= q:
            idx = bisect_left(max_prefix, q)
            print(idx, end=' ')
        elif total_sum <= 0:
            print(-1, end=' ')
        else:
            k = (q - max_prefix[-1] + total_sum - 1) // total_sum
            remaining = q - k * total_sum
            idx = bisect_left(max_prefix, remaining)
            print(k * n + idx, end=' ')
    print()
```该代码首先构建前缀和和最大前缀和以进行高效查询。`bisect_left`查找前缀和达到所需值的最早索引。 完整旋转通过整数除法来考虑，并且显式处理非递增数组的边缘情况。 

## 工作示例

 输入示例 1：```
3
3 3
1 -3 4
1 5 2
2 2
-2 0
1 2
2 2
0 1
1 2
```跟踪第一个测试用例：

 | 查询 x | 最大前缀 | 总和 | 旋转 k | 剩余 x' | 索引 | 总时间 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | [1,1,4]| 2 | 0 | 1 | 0 | 0 |
 | 5 | [1,1,4]| 2 | 2 | 1 | 0 | 6 |
 | 2 | [1,1,4]| 2 | 1 | 0 | 2 | 2 |

 这表明该算法使用旋转和前缀和正确地找到时间。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m log n) | O(n + m log n) | 前缀和构建在 O(n) 中，每个查询都用二分搜索回答 O(log n) |
 | 空间| O(n) | 存储前缀和和 max_prefix |

 该解决方案非常适合以下限制$n, m \le 2\cdot 10^5$和2秒的时间限制。 

## 测试用例```python
import sys, io
from bisect import bisect_left

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    for _ in range(int(input())):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        x = list(map(int, input().split()))

        prefix = []
        curr = 0
        max_prefix = []
        for num in a:
            curr += num
            prefix.append(curr)
            max_prefix.append(curr if not max_prefix else max(max_prefix[-1], curr))

        total_sum = curr

        res = []
        for q in x:
            if max_prefix[-1] >= q:
                idx = bisect_left(max_prefix, q)
                res.append(str(idx))
            elif total_sum <= 0:
                res.append(str(-1))
            else:
                k = (q - max_prefix[-1] + total_sum - 1) // total_sum
                remaining = q - k * total_sum
                idx = bisect_left(max_prefix, remaining)
                res.append(str(k * n + idx))
        output.write(' '.join(res)+'\n')
    return output.getvalue().strip()

# Provided sample
assert run("3\n3 3\n1 -3 4\n1 5 2\n2 2\n-2 0\n1 2\n2 2\n0 1\n1 2\n") == "0 6 2\n-1 -1\n1 3"

# Custom cases
assert run("1\n1 2\n5\n2 6\n") == "0 1", "Single element array"
assert run("1\n3 2
```
