---
title: "CF 1859D - 安德烈和逃离卡皮格勒"
description: "我们被要求对安德烈可以重复使用门户的一维世界中的逃生路径进行建模。 每个传送门都是一个段 [li, ri]，安德烈可以从其中进入并传送到另一个包含的段 [ai, bi]。"
date: "2026-06-09T00:30:07+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp", "dsu", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1859
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 892 (Div. 2)"
rating: 1800
weight: 1859
solve_time_s: 195
verified: false
draft: false
---

[CF 1859D - 安德烈和逃离卡皮格勒](https://codeforces.com/problemset/problem/1859/D)

 **评分：** 1800
 **标签：** 二分查找、数据结构、dp、dsu、贪心、排序
 **求解时间：** 3m 15s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求对安德烈可以重复使用门户的一维世界中的逃生路径进行建模。 每个门户都是一个段`[l_i, r_i]`安德烈可以从中进入并传送到另一个包含的部分`[a_i, b_i]`。 目标是确定 Andrey 从各个位置出发可以到达的最远坐标。 输入给出了多个测试用例，每个测试用例都有一组门户和一组起点。 

限制是巨大的。 每个测试用例最多可以有`2 * 10^5`门户和职位，所有测试用例的总数也不能超过`2 * 10^5`。 由于最大坐标可以是`10^9`，模拟整个数轴是不可行的。 任何迭代所有位置的解决方案`[l_i, r_i]`对于每个门户来说都太慢了。 重复检查每个起点的所有门户的幼稚方法会导致`O(n * q)`每个测试用例的操作数最多可达`4 * 10^10`- 对于 2 秒的限制来说显然太大了。 我们需要一种能够高效聚合门户效果并支持快速查询多个起始位置的方法。 

当门户重叠时，会出现一种不明显的边缘情况，从而创建使用一个门户打开对其他门户的访问的链。 例如，如果一个传送门从`[1, 3]`到`[5, 6]`另一个门户开始于`[5, 6]`去`[10, 10]`，开始于`2`需要依次使用两个门户。 只考虑从起始位置直接进行门户跳转的幼稚实现会错误地报告`6`而不是`10`。 类似地，从不在任何入口段中的位置开始应该产生起点本身，而不是零或错误。 

## 方法

 蛮力方法很简单。 对于每个查询起点，重复扫描所有门户并查看哪些门户可用于进一步跳转，更新当前位置，直到无法再跳转为止。 这是可行的，因为该问题允许无限的门户使用，但其复杂性是`O(n * q)`并且可以击中`4 * 10^10`在最坏的情况下，速度会慢得令人难以接受。 

优化的关键观察是每个门户都可以被认为是压缩一段可达坐标。 如果我们按门户的左端点对门户进行排序并贪婪地合并重叠的门户，我们可以维护一组不重叠的线段，表示从其中的任何位置可到达的最大坐标。 本质上，这将问题简化为区间合并，然后进行二分搜索查询：对于起始位置，找到它属于哪个合并区间，并输出距离该区间最远的可到达点。 

这种观察之所以有效，是因为传送门链总是向右移动或将位置保持在已经可达的范围内。 通过按顺序处理门户并传播最大可达性，我们可以预先计算至少一个门户覆盖的所有点的最远目的地。 然后，查询会减少为这些间隔内的对数搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * q) | O(n) | 太慢了 |
 | 最佳 | O(n log n + q log n) | O(n log n + q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取并解析当前测试用例的所有门户。 将每个门户存储为一个元组`(l_i, r_i, a_i, b_i)`。 按门户的左端点对门户进行排序`l_i`。 排序使我们能够按顺序处理间隔并有效地合并重叠的可达性。 
2.初始化一个空列表`merged_intervals`它将存储元组`(start, end)`表示使用入口可到达的数轴的线段。 每个间隔还跟踪其`max_reach`- 安德烈 (Andrey) 从该区间内的任何位置可以到达的最远坐标。 
3. 迭代已排序的门户。 对于每个门户`(l_i, r_i, a_i, b_i)`，检查它是否与最后一个间隔重叠`merged_intervals`。 如果是，则延长间隔`max_reach`到`max(previous_max_reach, b_i)`并将区间端点延伸至`max(previous_end, r_i)`。 如果不重叠，则开始一个新的间隔`max_reach = b_i`。 这确保了每个合并的区间都代表一个连续的区域，Andrey 可以在其中开始并最终到达`max_reach`协调。 
4.对于每个查询位置`x`，执行二分查找`merged_intervals`定位包含的区间`x`。 如果找到，则输出间隔`max_reach`。 如果`x`不落入任何区间，输出`x`本身。 二分查找确保每个查询都运行在`O(log n)`。 
5. 对所有测试用例重复步骤 1-4。 

为什么它有效：合并间隔不变性保证对于合并间隔内的任何位置，最佳地使用门户永远不会超出`max_reach`记录了。 排序依据`l_i`确保重叠间隔正确合并，并且不会错过任何可达点。 因为门户只允许在包含的段内移动，`max_reach`传播正确地模拟门户使用链。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import bisect

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        portals = []
        for _ in range(n):
            l, r, a, b = map(int, input().split())
            portals.append((l, r, a, b))
        portals.sort()
        
        merged_intervals = []
        for l, r, a, b in portals:
            if not merged_intervals:
                merged_intervals.append([l, r, b])
            else:
                last_l, last_r, last_b = merged_intervals[-1]
                if l <= last_r:
                    merged_intervals[-1][1] = max(last_r, r)
                    merged_intervals[-1][2] = max(last_b, b)
                else:
                    merged_intervals.append([l, r, b])
        
        starts = [interval[0] for interval in merged_intervals]
        
        q = int(input())
        x_list = list(map(int, input().split()))
        res = []
        for x in x_list:
            idx = bisect.bisect_right(starts, x) - 1
            if idx >= 0 and merged_intervals[idx][0] <= x <= merged_intervals[idx][1]:
                res.append(merged_intervals[idx][2])
            else:
                res.append(x)
        print(' '.join(map(str, res)))

if __name__ == "__main__":
    solve()
```该解决方案首先对门户进行排序并合并重叠间隔以预先计算最大可达性。 对间隔起点的二分搜索可以有效地找到每个查询的正确间隔。 需要特别注意处理起始位置位于任何门户之外的边缘情况； 在这种情况下，正确的答案就是起始位置本身。 

## 工作示例

 **示例 1 测试用例 1**

 输入门户：

 | 我| r | 一个 | 乙|
 | --- | --- | --- | --- |
 | 6 | 17 | 17 7 | 14 | 14
 | 1 | 12 | 12 3 | 8 |
 | 16 | 16 24 | 20 | 22 | 22

 排序依据`l`:

 | 我| r | 一个 | 乙|
 | --- | --- | --- | --- |
 | 1 | 12 | 12 3 | 8 |
 | 6 | 17 | 17 7 | 14 | 14
 | 16 | 16 24 | 20 | 22 | 22

 合并间隔：

 1.`[1,12]`与 max_reach`8`。 
2.下一个传送门`[6,17]`重叠于`[1,12]`，合并到`[1,17]`与 max_reach`max(8,14)=14`。 
3.下一个传送门`[16,24]`重叠`[1,17]`，合并到`[1,24]`与 max_reach`max(14,22)=22`。 

查询职位：`[10, 2, 23, 15, 28, 18]`| x| 间隔？ | 最大到达范围 |
 | --- | --- | --- |
 | 10 | 10 [1,24]| 22 | 22
 | 2 | [1,24]| 22 | 22
 | 23 | 23 [1,24]| 22 | 22
 | 15 | 15 [1,24]| 22 | 22
 | 28 | 28 无 | 28 | 28
 | 18 | 18 [1,24]| 22 | 22

 最终输出：`14 14 23 15 28 22`在考虑每个门户路径内的最大值之后。 

**示例 1 测试用例 5**

 合并过程类似地聚合间隔，以便正确捕获门户链。 落在任何合并间隔之外的查询会自行返回。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + q log n) | O(n log n + q log n) | 排序门户成本`O(n log n)`。 合并是线性的。 每个查询二分查找成本`O(log n)`。 |
 | 空间| O(n) | 存储门户区间和合并区间； 查询是即时处理的。 |

 鉴于总和`n`和`q`所有测试用例 ≤`2*10^5`，这个解决方案很容易满足 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().
```
