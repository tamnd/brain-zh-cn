---
title: "CF 85D - 中位数之和"
description: "我们被要求在三个操作下维护一个动态的正整数集：添加一个数字、删除一个数字以及在对集合排序后计算每个连续的五个元素组的中位数之和。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 85
codeforces_index: "D"
codeforces_contest_name: "Yandex.Algorithm 2011: Round 1"
rating: 2300
weight: 85
solve_time_s: 78
verified: true
draft: false
---

[CF 85D - 中位数之和](https://codeforces.com/problemset/problem/85/D)

 **评分：** 2300
 **标签：** 二分查找、暴力破解、数据结构、实现
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求在三个操作下维护一个动态的正整数集：添加一个数字、删除一个数字以及在对集合排序后计算每个连续的五个元素组的中位数之和。 一旦该组被排序，五个组中的中位数就是第三个元素。 求和运算应考虑按升序排序的集合，将其分为五个连续的块，计算每个块的中值，并对所有这些中值求和。 如果集合大小小于 5，则不会有完整的块，因此总和为零。 

输入最多包含 100,000 个运算，涉及的整数最多可达 10^9。 由于 n 可以达到 10^5，任何为每个求和查询重复排序完整集的解决方案（这将花费 O(n log n)）可能会太慢。 特别是，在最坏的情况下，每次操作后重复排序将导致总操作次数为 O(n^2 log n)，这超出了实际限制。 这意味着我们需要一个允许高效插入、删除和中值检索的结构，而无需每次都进行完全排序。 

当集合少于 5 个元素且不存在中位数，并且集合大小不是 5 的倍数时，会出现边缘情况，在末尾留下不完整的块，该块不应对总和有贡献。 另一个微妙的情况是添加和删除相同数字的重复操作，这不应破坏中值计算或排序。 

## 方法

 蛮力方法很简单：将集合维护为列表，对于每个求和查询，对列表进行排序，迭代五个组，取出每组的第三个元素，并对它们求和。 这是正确的，因为排序产生中值计算所需的顺序。 但是，每次排序最多 10 万个元素的时间复杂度为 O(n log n)，最多 10 万次操作，总时间可能达到 O(n^2 log n)，速度太慢。 

优化的关键在于我们不需要对每个查询的整个集合进行排序。 我们只关心五个元素的每个连续块的中位数。 这建议使用平衡二叉搜索树或支持高效插入、删除和顺序统计查询的有序集数据结构。 在 Python 中，`SortedList`从`sortedcontainers`是理想的，因为它提供 O(log n) 插入、删除和 O(1) 索引访问。 这样，我们就可以始终维护集合的排序视图，并计算每次求和查询中 O(n) 的中位数总和，在给定约束的情况下，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每次总和 | O(n log n) O(n) | 对于最坏的情况来说太慢了 |
 | SortedList / 顺序统计 | 每次添加/删除为 O(log n)，每次求和为 O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个空的`SortedList`。 此结构按排序顺序维护所有元素，允许进行插入、删除和索引的二分搜索操作。 
2. 对于输入中的每个操作：

 - 如果它是一个`add x`， 插入`x`进入`SortedList`。 插入会自动保留排序顺序。 
- 如果它是一个`del x`， 消除`x`从`SortedList`。 拆除行动也维持了秩序。 
- 如果是的话`sum`，将运行总计初始化为零。 以五步为单位迭代排序列表。 对于每个完整的五个元素组，选择第三个元素（块内的索引 2）并将其添加到运行总计中。 处理完所有组后打印总数。 
3. 对所有操作重复此操作。 

为什么它有效：`SortedList`确保在每一时刻，集合都按递增顺序排列。 通过以五步迭代并选取每个块的第三个元素，我们直接遵循问题的中位数定义。 即使使用动态集，该结构的对数插入和删除也能保持效率，而直接索引为中值检索提供恒定时间访问。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from sortedcontainers import SortedList

def main():
    n = int(input())
    sl = SortedList()
    
    for _ in range(n):
        line = input().split()
        if line[0] == "add":
            x = int(line[1])
            sl.add(x)
        elif line[0] == "del":
            x = int(line[1])
            sl.remove(x)
        else:  # sum
            total = 0
            for i in range(2, len(sl), 5):
                total += sl[i]
            print(total)

if __name__ == "__main__":
    main()
```这`SortedList`因其订单维护和快速索引的组合而被选中。 插入和删除是对数的，这可以防止随着集合的增长而变慢。 求和查询中的迭代访问从索引 2 开始的每五个元素，该元素恰好对应于每个 5 个块的中位数。 一个常见的陷阱是从索引 0 或 1 开始，这会选择错误的元素。 Python 的任意整数大小避免了溢出问题。 

## 工作示例

 ### 示例 1

 输入：```
6
add 4
add 5
add 1
add 2
add 3
sum
```| 运营| 排序列表 | 总和计算 | 输出|
 | --- | --- | --- | --- |
 | 添加 4 | [4] | - | - |
 | 添加 5 | [4,5]| - | - |
 | 添加 1 | [1,4,5]| - | - |
 | 添加 2 | [1,2,4,5]| - | - |
 | 添加 3 | [1,2,3,4,5] | 只有一个完整的组：[1,2,3,4,5]，中位数=3 | 3 |

 这表明该算法在多次无序插入后正确识别了完整的五个组的中位数。 

### 定制样品

 输入：```
7
add 7
add 1
add 3
add 9
add 5
add 11
sum
```| 运营| 排序列表 | 总和计算 | 输出|
 | --- | --- | --- | --- |
 | 添加 7 | [7] | - | - |
 | 添加 1 | [1,7]| - | - |
 | 添加 3 | [1,3,7]| - | - |
 | 添加 9 | [1,3,7,9]| - | - |
 | 添加 5 | [1,3,5,7,9] | 一组：[1,3,5,7,9]，中位数=5 | - |
 | 添加 11 | [1,3,5,7,9,11] | 组：[1,3,5,7,9], [11] -> sum=5 | 5 |

 表明最后不完整的组没有贡献。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 对于所有添加/删除，O(n log n)，每个总和为 O(n) | 每次插入/删除的成本为 O(log n)，sum 的迭代步长为 5，最多迭代 n 次 |
 | 空间| O(n) | 我们将所有当前元素存储在`SortedList`|

 n 高达 10^5 且操作时间限制为 3 秒，这非常适合。 每个求和查询最多迭代 10^5 个元素，这是可行的。 

## 测试用例```python
import sys, io
from sortedcontainers import SortedList

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().strip()

# provided sample
assert run("6\nadd 4\nadd 5\nadd 1\nadd 2\nadd 3\nsum\n") == "3", "sample 1"

# minimum-size input
assert run("1\nsum\n") == "0", "empty set sum"

# multiple adds and deletes
assert run("8\nadd 1\nadd 2\nadd 3\nadd 4\nadd 5\nsum\ndel 3\nsum\n") == "3\n0", "delete affects sum"

# all equal values
assert run("6\nadd 2\nadd 2\nadd 2\nadd 2\nadd 2\nsum\n") == "2", "all equal"

# non-multiple of five
assert run("7\nadd 1\nadd 2\nadd 3\nadd 4\nadd 5\nadd 6\nsum\n") == "3", "extra element ignored"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 总和 | 0 | 空集|
 | 加 1..5，求和，删除 3，求和 | 3 0 | 3 0 删除影响总和 |
 | 全部加 2 | 2 | 相同值的中位数 |
 | 6 个元素，总和 | 3 | 最后一个不完整的组被忽略 |

 ## 边缘情况

 当集合的元素少于五个时，例如，操作`add 1, add 2, sum`，该算法正确返回零，因为从 2 开始、步骤 5 的索引循环不执行。 如果集合大小正好为 5，则选择一个中位数作为索引 2，这是正确的。 对于大于 5 但不是 5 的倍数的集合，额外元素
