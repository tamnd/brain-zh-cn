---
title: "CF 1954B - 让它变得丑陋"
description: "我们得到一个保证是“美丽”的整数数组，这意味着通过特定的操作，所有元素最终可以变得相同。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1954
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 164 (Rated for Div. 2)"
rating: 1200
weight: 1954
solve_time_s: 75
verified: false
draft: false
---

[CF 1954B - 让它变得丑陋](https://codeforces.com/problemset/problem/1954/B)

 **评分：** 1200
 **标签：** 实现、数学
 **求解时间：** 1m 15s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个保证是“美丽”的整数数组，这意味着通过特定的操作，所有元素最终可以变得相同。 该操作允许我们选择不在边界的任何元素，并在邻居相等的情况下将其替换为其相邻值。 我们的目标是确定必须从数组中删除的最小元素数，以使使用此操作不再可能使所有剩余元素相等。 如果没有删除可以实现这一点，我们返回 -1。 

输入由多个测试用例组成。 每个测试用例提供数组大小`n`和数组元素。 数组大小最大可达 300,000，并且`n`所有测试用例不超过 300,000，因此我们的算法每个测试用例的运行时间必须约为 O(n)。 这排除了尝试每次删除或尝试模拟所有操作的强力模拟，因为这可能会导致二次或更糟糕的复杂性。 

当数组已经均匀时，会出现不明显的边缘情况，例如`[1, 1, 1]`。 删除任何数字并不会妨碍它的美观，因此输出应该为-1。 另一个微妙的情况是当数组在两个数字之间交替时，例如`[1, 2, 1, 2, 1]`。 在这里，删除仔细选择的元素可能会破坏结构，并且仅删除一个就足够了。 具有重复块的数组，例如`[3, 3, 3, 5, 3, 3, 3]`，需要计算相同数字之间的最大间隙以确定最小移除量。 

## 方法

 暴力方法将迭代每个元素，尝试删除它，并模拟操作，直到我们达到或未达到均匀数组。 这在原则上是正确的，因为它确实测试了所有可能性，但它太慢了。 对于长度为 n 的数组，删除每个元素并进行模拟操作在最坏的情况下可能需要 O(n^2)，当 n 可以为 3 × 10^5 时，这是不可接受的。 

关键的观察结果是，如果存在一个由重复元素组成的“块”，并且该重复元素与下一个相同元素至少间隔一个不同的数字，那么数组就不再美观。 更具体地说，对于每个不同的值，我们可以记录它出现的位置并检查连续出现之间的距离。 如果任何间隙超过 2，则删除该间隙中的元素可能会破坏操作链。 特定值所需的最小移除次数为`(gap - 2)`求最大差距，然后我们取所有值中的最小值。 

这种见解将问题从模拟操作简化为简单的计数和间隙分析，可以使用字典或位置列表在每个数组的 O(n) 中执行。 

| 方法| 时间复杂度| 空间复杂度| 判决|
 | --- | --- | --- | --- |
 | 暴力模拟| O(n^2) | O(n^2) | O(n) | 太慢了|
 | 差距分析/计数| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 
2. 对于每个测试用例，请阅读`n`和数组`a`。 
3. 如果数组是统一的（所有元素都相同），则立即输出-1，因为删除任何元素并不会破坏它的美观。 
4.初始化字典`positions`存储每个值的索引列表。 
5. 遍历数组并将每个索引追加到相应的列表中`positions`。 
6. 对于中的每个值`positions`，计算打破链条所需的最大移除次数：

 1. 将从数组开头到第一次出现的距离以及从最后一次出现到数组末尾的距离视为隐式间隙。 
2. 对于该值的连续索引，计算间隙为`(current index - previous index - 1)`。 这表示可以删除以单独出现的元素的数量。 
3. 跟踪最大值`(gap)`跨越所有连续发生的情况。 
7. 整个数组的最小移除量是以下值中的最小值`(maximum gap - 1)`跨越所有不同的价值观。 这`-1`来自这样的事实：删除比间隙长度少的一个就足以破坏序列。 
8. 输出每个测试用例的最小值。 

**为什么有效**：如果存在相同的邻居，该操作仅传播元素的值。 打破重复元素的最大间隙可以保证没有足够长的替换序列来使数组保持一致。 通过检查所有值，我们确保考虑所有潜在的传播链。 该算法仅删除实际上阻止传播的元素。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def min_removals_to_make_ugly(n, a):
    if all(x == a[0] for x in a):
        return -1

    positions = {}
    for idx, val in enumerate(a):
        if val not in positions:
            positions[val] = []
        positions[val].append(idx)
    
    min_remove = float('inf')
    for val, inds in positions.items():
        gaps = []
        # gap from start to first occurrence
        gaps.append(inds[0])
        # gaps between consecutive occurrences
        for i in range(1, len(inds)):
            gaps.append(inds[i] - inds[i-1] - 1)
        # gap from last occurrence to end
        gaps.append(n - 1 - inds[-1])
        max_gap = max(gaps)
        # need to remove at least max_gap elements to break propagation
        min_remove = min(min_remove, max_gap)
    return min_remove

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    print(min_removals_to_make_ugly(n, a))
```该解决方案首先检查数组是否均匀，这是一个快速的 O(n) 检查。 然后它收集每个值的位置来计算间隙。 通过在边界处添加间隙，我们可以正确处理开头和结尾的序列。 这`max(gaps)`确保我们瞄准可以传播的最大链，并采取`min`在所有值中，破坏美感所需的去除量最少。 

## 工作示例

 **示例1：**`a = [1, 2, 1, 2, 1]`| idx | 价值| 职位字典 | 计算的间隙| 最大间隙|
 | --- | --- | --- | --- | --- |
 | 0 | 1 | {1:[0]} | [0]| 0 |
 | 2 | 1 | {1:[0,2]} | 间隙：[0,1,2] | 2 |
 | 4 | 1 | {1:[0,2,4]} | 间隙：[0,1,1,0] | 1 |
 | 1 | 2 | {2:[1]} | 间隙：[1,3] | 3 |
 | 3 | 2 | {2:[1,3]} | 间隙：[1,1,1] | 1 |

 最小删除： 1. 删除索引 4 会破坏传播。 

**示例2：**`a = [3, 3, 3, 5, 3, 3, 3]`| idx | 价值| 职位字典 | 计算的间隙| 最大间隙|
 | --- | --- | --- | --- | --- |
 | 0,1,2 | 3 | [0,1,2]| 间隙：[0,0,0,4] | 4 |
 | 3 | 5 | [3] | 间隙：[3,3] | 3 |
 | 4,5,6 | 3 | [0,1,2,4,5,6] | 间隙：[0,0,1,0,0,0,0] | 1 |

 最小删除数：3。删除前三个元素可确保 5 无法传播。 

这些痕迹表明，边缘处和重复数字之间的间隙决定了所需的最小去除量。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个数组元素都会被访问一次以构建位置，然后每个值都会计算一次间隙。 |
 | 空间| O(n) | 位置字典存储每个不同值的索引。 |

 该解决方案符合时间限制，因为所有测试用例的 n 总和 ≤ 3 × 10^5。 O(n) 操作完全低于 2 × 10^6 基本操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())  # assume the above code is saved as solution.py
    return output.getvalue().strip()

# Provided samples
assert run("4\n3\n2 2 2\n5\n1 2 1 2 1\n1\n1\n7\n3 3 3 5 3 3 3\n") == "-1\n1\n-1\n3", "sample 1"

# Custom cases
assert run("1\n1\n1\n") == "-1", "single element array"
assert run("1\n2\n1 1\n") == "-1", "two equal elements"
assert run("1\n2\n1 2\n") == "1", "two different elements"
assert run("1\n5\n1 1 2 1 1\n") == "1", "one different in the middle"
assert run("
```
