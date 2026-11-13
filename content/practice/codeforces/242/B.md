---
title: "CF 242B - 大段"
description: "我们得到了数轴上的线段列表，每个线段由左端点和右端点定义。 任务是找出其中是否存在一个完全包含所有其他段的段。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 242
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 149 (Div. 2)"
rating: 1100
weight: 242
solve_time_s: 72
verified: true
draft: false
---

[CF 242B - 大段](https://codeforces.com/problemset/problem/242/B)

 **评分：** 1100
 **标签：** 实施、排序
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了数轴上的线段列表，每个线段由左端点和右端点定义。 任务是找出其中是否存在一个完全包含所有其他段的段。 如果存在这样的段，我们应该返回它从 1 开始的索引； 否则，我们返回-1。 

输入大小可达10万段，每个坐标可达10亿。 这排除了将每个段与其他每个段进行比较的解决方案，因为 O(n²) 算法将执行大约 1010 次操作，远远超过 2 秒的时间限制。 输出是一个整数，因此问题本质上是搜索满足全局包含属性的段。 

非明显的边缘情况包括所有段不相交或长度相等但不完全重叠的情况。 例如，如果段是`1 2`,`2 3`， 和`3 4`，没有一个段包含所有其他段，因此输出必须是`-1`。 当只有一个段时，会发生另一种微妙的情况； 它简单地包含自身，所以输出应该是`1`。 

## 方法

 一种强力方法是检查每个段是否包含所有其他段。 这需要在所有段上进行两个嵌套循环，从而进行 O(n²) 比较。 虽然这适用于非常小的`n`，当`n`是 100,000，因为它会导致数百亿次操作。 

优化的关键观察是，当且仅当一个线段的左端点是所有左端点中的最小值并且其右端点是所有右端点中的最大值时，该线段覆盖所有其他端点。 这将问题简化为寻找最小值`l`和最大`r`，然后检查是否有任何段与这些值完全匹配。 这种方法将时间复杂度从 O(n²) 降低到 O(n)，并且除了存储段之外仅使用恒定的额外空间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 将所有段及其原始索引读入列表以保留输入顺序。 这使我们能够在最后返回正确的从 1 开始的索引。 
2.初始化两个变量，`min_left`和`max_right`，跟踪所有线段中的最小左端点和最大右端点。 
3. 迭代各个段。 对于每个段，更新`min_left`如果线段的左端点较小并更新`max_right`如果线段的右端点更大。 
4. 在第一遍之后，再次迭代这些线段以找到左端点等于的线段`min_left`右端点等于`max_right`。 如果存在这样的段，则返回其索引； 否则，返回-1。 

不变的是，任何覆盖所有其他线段的左端点必须等于全局最小值，右端点必须等于全局最大值。 这保证了没有其他段超出它。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
segments = []

min_left = float('inf')
max_right = float('-inf')

for i in range(n):
    l, r = map(int, input().split())
    segments.append((l, r, i + 1))  # store 1-based index
    if l < min_left:
        min_left = l
    if r > max_right:
        max_right = r

answer = -1
for l, r, idx in segments:
    if l == min_left and r == max_right:
        answer = idx
        break

print(answer)
```该解决方案读取段，计算全局最小左端点和最大右端点，并检查与两者匹配的段。 通过将原始索引存储在元组中，我们可以立即返回从 1 开始的位置，而无需进行额外的搜索。 唯一的微妙点是初始化`min_left`和`max_right`正确处理极端情况并记住在报告答案时使用从 1 开始的索引。 

## 工作示例

 样本1：

 输入：```
3
1 1
2 2
3 3
```| 细分 | 我| r | 左分钟 | 最大右| 候选人？ |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 1 | 1 | 没有 |
 | 2 | 2 | 2 | 1 | 2 | 没有 |
 | 3 | 3 | 3 | 1 | 3 | 没有 |

 处理后，没有段匹配`min_left=1`和`max_right=3`。 输出是`-1`。 

样本2：

 输入：```
4
1 5
2 3
1 5
4 5
```| 细分 | 我| r | 左分钟 | 最大右| 候选人？ |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 5 | 1 | 5 | 是的 |

 第一段与两者都匹配`min_left`和`max_right`，所以我们返回索引`1`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个段都会处理两次：一次查找最小值/最大值，一次检查覆盖范围 |
 | 空间| O(n) | 存储所有段以保留原始索引 |

 该解决方案很容易满足 n=100,000 的 2 秒限制和 256 MB 的内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    segments = []
    min_left = float('inf')
    max_right = float('-inf')
    for i in range(n):
        l, r = map(int, input().split())
        segments.append((l, r, i + 1))
        min_left = min(min_left, l)
        max_right = max(max_right, r)
    for l, r, idx in segments:
        if l == min_left and r == max_right:
            return str(idx)
    return "-1"

# provided sample
assert run("3\n1 1\n2 2\n3 3\n") == "-1", "sample 1"

# custom cases
assert run("1\n7 7\n") == "1", "single segment"
assert run("4\n1 5\n2 3\n1 5\n4 5\n") == "1", "segment covers all"
assert run("3\n2 4\n1 5\n3 5\n") == "2", "middle segment covers all"
assert run("5\n1 3\n2 4\n3 5\n2 5\n1 5\n") == "5", "last segment covers all"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n7 7`| 1 | 单段简单地覆盖了自身 |
 |`4\n1 5\n2 3\n1 5\n4 5`| 1 | 多个段，第一个段覆盖全部 |
 |`3\n2 4\n1 5\n3 5`| 2 | 中段涵盖全部，测试订单处理 |
 |`5\n1 3\n2 4\n3 5\n2 5\n1 5`| 5 | 最后一段涵盖了所有内容，确认了正确的索引选择 |

 ## 边缘情况

 对于单个段的情况`1 1`,`min_left`和`max_right`两者相等`1`。 该段与两者都匹配，因此输出是`1`。 

对于不完全重叠的段，例如`1 2`,`2 3`,`3 4`,`min_left`是`1`和`max_right`是`4`。 没有段跨越两者，因此算法正确输出`-1`。 

对于具有相同最小/最大端点的多个段，该算法按输入顺序返回满足覆盖条件的第一个段，保留基于 1 的索引要求。
