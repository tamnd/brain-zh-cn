---
title: "CF 915A - 花园"
description: "我们被要求使用 n 个桶中的一个来浇灌长度为 k 的线性花园。 每个水桶每小时浇灌花园的固定部分，特别是一段连续的长度ai。 卢巴必须给整个花园浇水，不留间隙，并且不能对任何部分浇水两次。"
date: "2026-06-13T01:46:54+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 915
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 36 (Rated for Div. 2)"
rating: 900
weight: 915
solve_time_s: 704
verified: true
draft: false
---

[CF 915A - 花园](https://codeforces.com/problemset/problem/915/A)

 **评分：** 900
 **标签：** 实施
 **求解时间：** 11m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求使用 _n_ 个桶之一给长度为 _k_ 的线性花园浇水。 每个水桶每小时浇灌花园的固定部分，特别是一段长度_a_i_的连续区域。 卢巴必须给整个花园浇水，不留间隙，并且不能对任何部分浇水两次。 我们的任务是确定哪个桶可以最小化所需的总小时数。 

输入在第一行给出水桶的数量和花园的长度，然后是每个水桶一小时内可以浇水的长度。 输出是一个整数，即使用单个水桶浇灌花园所需的最少小时数。 

约束很小：_n_ 和 _k_ 都最多为 100。这意味着即使是迭代所有存储桶的简单方法也是高效的。 我们可以安全地依次检查每个桶并执行简单的算术，看看它是否均匀地划分了花园。 可能导致简单实现失败的边缘情况是水桶的浇水长度不能均匀地划分花园长度。 例如，如果 _k_ = 6 并且水桶为 [5, 2]，则长度为 5 的水桶无法完全浇灌花园，而 2 正好除以 6，得到 3 小时。 

## 方法

 蛮力方法很简单。 对于每个桶，检查其浇水长度是否正好除以花园长度。 如果是，则计算所需的小时数：`k // a_i`。 跟踪所有存储桶的最小小时数。 这是正确的，因为浇水只能在桶长度的连续段中进行，并且不允许对段进行部分浇水。 

一个简单的变体可能会尝试模拟放置长度的片段`a_i`沿着花园，但这是不必要的，因为除法直接处理它。 由于 _n_ 和 _k_ 的最大值为 100，因此迭代所有存储桶并执行整数除法的速度非常快，运算次数最多为 100，可以忽略不计。 

简化这个问题的关键见解是认识到问题可以简化为整数除法。 对于精确划分花园长度的每个桶，小时数为`k // a_i`。 我们只需要选择最大的桶，因为较大的段会减少小时数。 观察结果表明`k % a_i == 0`允许我们丢弃无法在整数小时内完全浇灌花园的水桶。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n) | O(1) | O(1) | 已接受 |
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取桶数`n`和花园长度`k`。 
2.读取桶长度列表`a`。 
3. 初始化变量`min_hours`大量跟踪最短小时数。 
4. 迭代每个桶的长度`length`在`a`。 
5. 检查是否`k % length == 0`。 如果没有，请跳过这个水桶，因为它无法在整数小时内完全浇灌花园。 
6. 计算小时数为`hours = k // length`。 
7. 更新`min_hours`如果`hours`小于当前的`min_hours`。 
8. 检查完所有桶后，打印`min_hours`。 

这里的不变性是我们只考虑精确划分花园的桶长度​​。 由于该问题保证至少有一个有效的桶，`min_hours`将始终更新为正确的值。 由于较大的分段会减少小时数，因此这种方法可确保我们找到最小的小时数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
a = list(map(int, input().split()))

min_hours = float('inf')
for length in a:
    if k % length == 0:
        hours = k // length
        if hours < min_hours:
            min_hours = hours

print(min_hours)
```该解决方案可以有效地读取输入`sys.stdin.readline`。 我们初始化`min_hours`无穷大以确保任何有效小时数都较小。 我们迭代所有桶，检查花园长度的整除性，并更新最短小时数。 支票`k % length == 0`至关重要，因为它保证了花园的完全覆盖。 最终打印输出最短时间。 

## 工作示例

 ### 示例 1

 输入：```
3 6
2 3 5
```| 铲斗长度| k % 长度 | 小时（k//长度）| 分钟_小时 |
 | --- | --- | --- | --- |
 | 2 | 0 | 3 | 3 |
 | 3 | 0 | 2 | 2 |
 | 5 | 1 | - | 2 |

 这表明仅考虑精确划分花园长度的桶。 最短小时数为 2。 

### 示例 2

 输入：```
2 7
1 3
```| 铲斗长度| k % 长度 | 小时（k//长度）| 分钟_小时 |
 | --- | --- | --- | --- |
 | 1 | 0 | 7 | 7 |
 | 3 | 1 | - | 7 |

 这里只有桶长度 1 有效，需要 7 小时。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 对每个存储桶迭代一次 |
 | 空间| O(n) | 存储桶长度列表 |

 给定小约束 n ≤ 100 和 k ≤ 100，该算法在 1 秒的时间限制内立即运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    min_hours = float('inf')
    for length in a:
        if k % length == 0:
            hours = k // length
            if hours < min_hours:
                min_hours = hours
    return str(min_hours)

# provided samples
assert run("3 6\n2 3 5\n") == "2", "sample 1"
assert run("1 1\n1\n") == "1", "sample 2"

# custom cases
assert run("2 7\n1 3\n") == "7", "only bucket 1 works"
assert run("5 100\n1 2 4 5 10\n") == "10", "bucket 10 is optimal"
assert run("3 15\n4 5 6\n") == "3", "bucket 5 is best"
assert run("1 100\n100\n") == "1", "single bucket matches exactly"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 7\n1 3 | 7 7 | 仅桶 1 有效 |
 | 5 100\n1 2 4 5 10 | 5 100\n1 2 4 5 10 10 | 10 选择除数最大的桶 |
 | 3 15\n4 5 6 | 3 | 多个除数之间的正确选择 |
 | 1 100\n100 | 1 100 1 | 单桶等于花园长度|

 ## 边缘情况

 如果花园长度等于最大桶，例如 k = 100 且桶 = 100，则算法正确识别 1 小时。 如果最小的桶是唯一的除数，例如 k = 7 且桶 = 1，则算法会产生 7 小时。 该算法自动忽略不分水桶，防止不正确的部分浇水。 所有边缘情况都包含在可分性检查中，并保证至少有一个桶可以工作。
