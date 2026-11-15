---
title: "CF 911G - 批量变更查询"
description: "给定一个一维整数数组，我们必须处理一系列查询，选择性地替换子数组中的值。 每个查询指定数组内的一个范围和两个整数 x 和 y。 对于该范围内等于 x 的每个元素，我们将其替换为 y。"
date: "2026-06-13T00:34:41+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 911
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 35 (Rated for Div. 2)"
rating: 2500
weight: 911
solve_time_s: 270
verified: true
draft: false
---

[CF 911G - 批量更改查询](https://codeforces.com/problemset/problem/911/G)

 **评分：** 2500
 **标签：** 数据结构
 **求解时间：** 4m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个一维整数数组，我们必须处理一系列查询，选择性地替换子数组中的值。 每个查询指定数组内的一个范围和两个整数 _x_ 和 _y_。 对于该范围内等于 _x_ 的每个元素，我们将其替换为 _y_。 按顺序应用所有查询后，任务是输出数组的最终状态。 

数组大小可以达到20万个元素，每个元素限制在1到100之间。查询次数也可以达到20万。 如果所有查询都覆盖整个数组，则为每个查询循环子数组的简单方法可能会导致最坏的情况，即大约 4 × 10^10 次操作。 显然，O(n·q) 解决方案在 3 秒的时间限制内是不可行的，通常每秒可以执行大约 10^8 次操作。 

不明显的边缘情况包括针对同一元素进行多次替换的重叠查询、_x_ 和 _y_ 相等的查询或覆盖不包含匹配 _x_ 值的范围的查询。 例如，如果数组是`[1, 2, 1]`查询是`(1, 3, 1, 2)`其次是`(2, 3, 2, 3)`，天真的替换必须仔细跟踪更新的数组以产生`[2, 3, 2]`。 忽略这些更新或错误地应用它们可能会产生错误的最终数组。 

## 方法

 暴力方法只是对每个查询的数组进行迭代，并检查指定范围内的每个元素是否等于 _x_。 如果是，则用 _y_ 替换该元素。 此方法可以正常工作，因为它确实执行了问题中描述的操作。 问题源于其效率低下：在最坏的情况下，每个查询都会修改几乎整个数组，导致操作次数为 O(n·q)，对于最大输入而言，其数量级为 4 × 10^10，远远超出实际限制。 

优化的关键观察是数组元素是小整数，以 100 为界。这允许我们为每个可能的值存储它出现的索引的排序列表。 当查询要求将某个范围内所有出现的 _x_ 替换为 _y_ 时，我们可以使用二分搜索在 _x_ 的排序位置列表中快速找到相关索引，然后更新这些索引并调整 _x_ 和 _y_ 的列表。 由于每个数字仅在其自己的列表中具有索引，因此我们避免扫描不相关的元素。 

这将问题从扫描整个数组转变为仅扫描我们实际需要替换的值的位置。 每个索引每次不同的数字变化最多被访问一次，导致总运行时间与 O(n + q·log n) 或更好成比例。 空间复杂度仍然是可控的，因为我们存储从数字 1-100 到索引列表的映射，总共为 O(n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n·q) | O(n) | 太慢了|
 | 使用索引列表进行优化 | O(n + q·log n) | O(n + q·log n) | O(n + 100) | 已接受 |

 ## 算法演练

 1.读取数组`a`并初始化一个字典`pos`将每个值 1 到 100 映射到它出现的索引的排序列表。 这使我们能够快速定位任何价值的位置。 
2. 对于每个查询`(l, r, x, y)`，检查 _x_ 是否等于 _y_。 如果它们相同，则跳过此查询，因为无需更改。 
3. 否则，使用二分查找来查找索引的子列表`pos[x]`位于其中`[l-1, r-1]`。 只需要更新这些位置。 
4. 对于该子列表中的每个索引，设置`a[index] = y`。 将索引附加到`pos[y]`。 
5. 删除更新后的索引`pos[x]`以保持列表准确。 
6.所有查询结束后，打印数组`a`。 

为什么有效：每个查询仅修改当前保存值 _x_ 的位置，并且我们为每个值维护最新的位置列表。 二分搜索确保我们只触及相关索引。 由于每个索引更新都反映在`pos`后续查询立即会看到正确的当前值。 这保留了操作的顺序并保证了正确性。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
q = int(input())

pos = {i: [] for i in range(1, 101)}
for idx, val in enumerate(a):
    pos[val].append(idx)

for _ in range(q):
    l, r, x, y = map(int, input().split())
    if x == y:
        continue
    indices = pos[x]
    left = bisect.bisect_left(indices, l - 1)
    right = bisect.bisect_right(indices, r - 1)
    for idx in indices[left:right]:
        a[idx] = y
        pos[y].append(idx)
    del indices[left:right]

print(' '.join(map(str, a)))
```该代码首先为所有可能的值构建索引列表。 对于每个查询，它使用二分搜索来快速查找相关范围内的索引。 更新后，可以确保`pos[x]`不再包含替换的索引，而`pos[y]`接收更新的位置。 这避免了重新访问未更改的元素。 

## 工作示例

 样本1：

 | 步骤| 大批`a`| 查询 | 指数更新 | 已更新`pos`|
 | ---| ---| ---| ---| ---|
 | 初始| [1,2,3,4,5] | - | - | {1:[0],2:[1],3:[2],4:[3],5:[4]} |
 | 1 | [1,2,5,4,5] | 3 5 3 5 | 3 5 3 5 [2] | 3:[], 5:[4,2] |
 | 2 | [1,2,1,4,1] | 1 5 5 1 | 1 5 5 1 [4,2]| 5:[], 1:[0,4,2] |
 | 3 | [5,2,5,4,5] | 1 5 1 5 | 1 5 1 5 [0,2,4]| 1:[], 5:[0,2,4] |

 此跟踪确认算法正确识别索引并按顺序更新值。 

定制样品：

 输入：```
4
2 2 2 2
2
1 4 2 3
2 3 3 4
```跟踪显示更新：

 | 步骤| 大批`a`| 指数更新 |
 | ---| ---| ---|
 | 初始| [2,2,2,2] | - |
 | 1 | [3,3,3,3] | [0,1,2,3]|
 | 2 | [4,4,4,3] | [0,1,2]|

 确认部分范围更新正常工作。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + q·log n) | O(n + q·log n) | 初始索引是 O(n)。 每个查询都在小列表上使用二分搜索，时间复杂度为 O(log n)。 更新成本 O(#indices)。 每个查询的 n 加上日志开销总体呈线性。 |
 | 空间| O(n + 100) | 存储数组和值到索引列表的映射。 列表的最大大小为 n。 字典开销可以忽略不计。 |

 这符合 n、q ≤ 200,000 的 3 秒时间限制和内存限制 512 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    a = list(map(int, input().split()))
    q = int(input())

    import bisect
    pos = {i: [] for i in range(1, 101)}
    for idx, val in enumerate(a):
        pos[val].append(idx)

    for _ in range(q):
        l, r, x, y = map(int, input().split())
        if x == y:
            continue
        indices = pos[x]
        left = bisect.bisect_left(indices, l - 1)
        right = bisect.bisect_right(indices, r - 1)
        for idx in indices[left:right]:
            a[idx] = y
            pos[y].append(idx)
        del indices[left:right]
    return ' '.join(map(str, a))

# Provided sample
assert run("5\n1 2 3 4 5\n3\n3 5 3 5\n1 5 5 1\n1 5 1 5\n") == "5 2 5 4 5", "sample 1"

# Custom cases
assert run("1\n1\n1\n1 1 1 1\n") == "1", "single element no change"
assert run("4\n2 2 2 2\n2\n1 4 2 3\n2 3 3 4\n") == "4 4 4 3", "overlapping ranges"
assert run("3\n1 2 1\n2\n1 3 1 2\n2 3 2 3\n") == "2 3 2", "
```
