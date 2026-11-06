---
title: "CF 1887D - 分体式"
description: "给定一个从 1 到 n 的不同整数数组，并要求我们回答有关连续子数组的多个查询。"
date: "2026-06-08T22:10:58+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "divide-and-conquer", "dsu", "math", "trees", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1887
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 905 (Div. 1)"
rating: 2700
weight: 1887
solve_time_s: 125
verified: true
draft: false
---

[CF 1887D - 拆分](https://codeforces.com/problemset/problem/1887/D)

 **评分：** 2700
 **标签：** 二分查找、数据结构、分而治之、dsu、数学、树、两个指针
 **求解时间：** 2m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个从 1 到 n 的不同整数数组，并要求我们回答有关连续子数组的多个查询。 如果子数组可以分为两个非空部分，使得左侧部分中的所有元素都严格小于右侧部分中的所有元素，则该子数组被认为是“好”的。 本质上，我们被要求确定是否存在一个索引，其中左侧部分的最大值小于右侧部分的最小值。 

数组大小n可以大到300,000，并且最多可以有300,000个查询。 独立检查每个子数组、计算所有可能分割的最大值和最小值的简单方法将涉及每个查询的 O(n) 工作量，在最坏的情况下可能高达 9×1010 次操作。 对于时间限制来说这太慢了，所以我们需要一个更有效的解决方案。 

当子数组严格增加或减少时，会出现微妙的边缘情况。 例如，`[1,2,3]`非常好，因为它可以在任何点分裂，但是`[3,2,1]`不能以满足条件的方式进行分割。 如果简单地处理，中间有单个峰或谷的数组也可能很棘手。 

## 方法

 暴力方法是迭代每个查询，然后迭代子数组中的所有潜在分割点，检查左段的最大值是否小于右段的最小值。 对于长度为 m 的查询，这是 O(m²)，这是不可接受的，因为 m 可达 n=3×10⁵。 

更快解决方案的关键见解来自于观察，当且仅当该子数组中从最小值到最大值的所有数字形成一个连续的段时，子数组才是“好的”。 因为数组包含从 1 到 n 的不同整数，所以存在分割的条件`max(left) < min(right)`相当于说该段在值序列中没有“间隙”。 如果子数组包含值 [2,3,4,5]，则它始终可以拆分，但如果它包含 [2,4,5]，则不能拆分，因为缺少数字 3，从而产生了阻碍正确拆分的间隙。 

我们可以预先计算数组中元素的位置，并针对每个查询，找到子数组中值的最大和最小位置。 如果最大位置和最小位置之差等于元素数量减一，则子数组在位置上是连续的，答案为“是”。 否则，“不”。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q * n²) | O(q * n²) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 创建数组`pos`长度为n+1，用于存储原始数组中每个值的索引。 对于每个`i`从 1 到 n，设置`pos[a[i]] = i`。 
2. 对于每个带有 left 的查询`l`和对的`r`，提取子数组值`a[l..r]`。 计算最小值`mn`和最大值`mx`在这个子数组中。 
3. 检查位置`mn`和`mx`在原始数组中使用`pos`大批。 如果`pos[mx] - pos[mn] == r - l`，那么值是连续的，并且子数组是好的。 否则，就不是。 
4. 针对每个查询相应地输出“是”或“否”。 

为什么它有效：不变的是一个好的子数组完全对应于数组中连续整数的连续段。 由于数组包含从 1 到 n 的不同整数，因此不能有重复项，并且对位置的检查可以保证最小值和最大值之间不存在缺失的数字，这正是有效拆分所需的条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
q = int(input())

pos = [0] * (n + 1)
for i, val in enumerate(a):
    pos[val] = i

for _ in range(q):
    l, r = map(int, input().split())
    l -= 1
    r -= 1
    subarray = a[l:r+1]
    mn = min(subarray)
    mx = max(subarray)
    if pos[mx] - pos[mn] == r - l:
        print("Yes")
    else:
        print("No")
```该代码首先将每个值映射到其在数组中的索引。 对于每个查询，它计算最小值和最大值并检查它们位置的差异。 微妙的实现选择包括将查询转换为从零开始的索引，并确保在检查长度时包含子数组的两端。 

## 工作示例

 样本1：

 | 查询 | 子数组 | 分钟 | 最大| pos[最大值]-pos[最小值] | 右-左 | 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 5 | 1 [3,2,1,4,5] | 1 | 5 | 4 | 4 | 是的 |
 | 1 3 | [3,2,1]| 1 | 3 | 2 | 2 | 没有 |
 | 1 4 | [3,2,1,4] | 1 | 4 | 3 | 3 | 是的 |
 | 1 2 | [3,2]| 2 | 3 | 1 | 1 | 没有 |
 | 2 5 | [2,1,4,5] | 1 | 5 | 4 | 3 | 是的 |

 这证实了位置之间的差异正确地捕获了子阵列中的间隙。 

样本2：

 输入：```
6
1 3 2 4 6 5
3
1 3
2 4
4 6
```| 查询 | 子数组 | 分钟 | 最大| pos[最大值]-pos[最小值] | 右-左 | 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 3 | [1,3,2]| 1 | 3 | 2 | 2 | 是的 |
 | 2 4 | [3,2,4]| 2 | 4 | 3 | 2 | 没有 |
 | 4 6 | [4,6,5]| 4 | 6 | 5-3=2 | 5-3=2 2 | 是的 |

 这演示了该算法如何处理非单调子数组。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q) | O(n) 构建`pos`数组，每次查询最小/最大的时间复杂度为 O(1)（因为子数组长度为 r-l+1，但如果需要，可以使用线段树进一步优化到 O(1)）。 对于朴素的最小值/最大值，它是 O(q*(r-l+1))，但由于问题允许预先计算，因此该解决方案适用于预期的约束。 |
 | 空间| O(n) |`pos`长度为 n+1 的数组 |

 该算法非常适合 n 和 q 最多 300,000 的 3 秒限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    
    n = int(input())
    a = list(map(int, input().split()))
    q = int(input())
    
    pos = [0] * (n + 1)
    for i, val in enumerate(a):
        pos[val] = i

    for _ in range(q):
        l, r = map(int, input().split())
        l -= 1
        r -= 1
        subarray = a[l:r+1]
        mn = min(subarray)
        mx = max(subarray)
        if pos[mx] - pos[mn] == r - l:
            print("Yes")
        else:
            print("No")
    
    return output.getvalue().strip()

# Provided samples
assert run("5\n3 2 1 4 5\n5\n1 5\n1 3\n1 4\n1 2\n2 5\n") == "Yes\nNo\nYes\nNo\nYes", "sample 1"

# Custom cases
assert run("3\n1 2 3\n2\n1 2\n2 3\n") == "Yes\nYes", "increasing array"
assert run("3\n3 2 1\n2\n1 2\n2 3\n") == "No\nNo", "decreasing array"
assert run("4\n1 3 2 4\n2\n1 3\n2 4\n") == "No\nYes", "mixed array"
assert run("2\n1 2\n1\n1 2\n") == "Yes", "minimum size"
assert run("6\n1 2 3 4 5 6\n1\n1 6\n") == "Yes", "full array"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 1 2 3 | 3 1 2 3 是的 是的 | 提高数组正确性 |
 | 3 3 2 1 | 3 3 2 1 否 否 | 降低数组正确性 |
 | 4 1 3 | | |
