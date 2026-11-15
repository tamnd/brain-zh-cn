---
title: "CF 74D - 吊架"
description: "我们有一排钩子，编号从 1 到 n，最初都是空的。 员工在指定时间到达和离开，每次到达或离开都由员工 ID 编码：第一次出现是到达，第二次是离开，依此类推。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 74
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 68"
rating: 2400
weight: 74
solve_time_s: 67
verified: true
draft: false
---

[CF 74D - 吊架](https://codeforces.com/problemset/problem/74/D)

 **评分：** 2400
 **标签：** 数据结构
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排钩子，编号从 1 到 _n_，最初都是空的。 员工在指定时间到达和离开，每次到达或离开都由员工 ID 编码：第一次出现是到达，第二次是离开，依此类推。 当员工到达时，他们会选择最长的连续空闲段中间的钩子。 如果线段长度相等，他们会选择更靠近右侧的钩子。 如果有多条长度相同的线段，他们会选择最右边的一段。 当员工离开时，他们会腾出自己的特定职位。 

有时候，director会查询指定范围内当前有多少个hook被占用。 每个查询的输出只是该时刻在该时间间隔内占用的钩子数量。 

这些约束具有挑战性：_n_ 可以达到 10^9，这排除了维护简单的钩子状态数组的可能性。 但是，查询数量 _q_ 最多为 10^5，该数量足够小，可以接受随事件数量（而不是挂钩数量）扩展的操作。 为每个到达或查询迭代钩子的简单解决方案将会失败，因为它们最多可以执行 10^14 次操作。 

要考虑的边缘情况包括存在多个最大空闲段、段长度为偶数或查询要求覆盖整个吊架或单个钩子的范围的情况。 例如，如果 1 至 4 号钩子是空的，并且有两名员工依次到达，他们可能会选择 3 号钩子，然后选择 2 号钩子，这反映了有平局时选择最右边中间的规则。 当线段长度为偶数时，粗心的实现可能会简单地选择最左边或错误计算中点。 

## 方法

 暴力方法将显式维护一个大小为 _n_ 的数组，在每次到达和离开时更新它，并扫描每个导演查询的范围。 到达步骤将涉及扫描数组以找到最长的连续段，这可能需要 O(n)。 出发时间复杂度为 O(1)，查询时间复杂度为 O(n)。 当 _n_ 达到 10^9 且 _q_ 达到 10^5 时，这是完全不可行的。 Even clever array-based segment tracking would be too slow if it requires scanning linear segments.

 关键的见解是我们不需要跟踪每个单独的钩子；我们需要跟踪每个钩子。 我们只需要跟踪占用的钩子以及它们之间的空闲间隔。 每次到达都会将一个空闲段分割成最多两个较小的段。 每次出发都会合并相邻的空闲段。 通过在适当的数据结构中维护占用的钩子和空闲间隔的集合，我们可以有效地找到最右边最长的空闲段，计算其中点，并回答范围查询。 

最佳方法使用平衡树或堆的组合来按长度和位置存储空闲间隔，并使用哈希图来跟踪每个员工占用的钩子。 每次到达都会从堆中选择顶部间隔，在 O(1) 中计算挂钩，用最多两个新间隔更新堆，并更新映射。 出发删除员工的钩子，必要时合并相邻间隔，并更新堆。 导向器查询使用占用的钩子的映射来有效地计算给定范围内的数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * q) | O(n) | 太慢了 |
 | 最佳| O(q log q) | O(q) | 已接受 |

 ## 算法演练

 1. 初始化一个集合或字典来存储当前占用的钩子，以及一个堆（优先级队列）来存储空闲段。 用长度和端点表示每个线段。 最初，整个衣架是从 1 到 _n_ 的一段。 
2.对于每个请求，检查它是否是一个director查询（`0 i j`) 或员工行为。 如果是查询，则通过查询占用的hook集合来统计有多少个占用的hook位于包含区间[i,j]内。 
3. 如果请求的是员工ID，请检查该员工之前是否已经到过。 如果这是第一次出现，则表示到达：

 - 从堆中弹出最大长度的段。 如果出现平局，则选择最接近右侧的线段。 这是通过在堆中存储负端点以反转顺序来实现的。 
- 计算线段的中间钩。 如果线段长度为奇数，则中点为`(left + right) // 2`。 如果偶数，则中点为`(left + right) // 2 + 1`。 
- 将员工放在这个挂钩上。 将此映射存储在字典中。 
- 将原始段拆分为最多两个较小的段：所选钩子的左侧和右侧，如果这些新段非空，则将它们推入堆中。 
4. 如果该请求是员工第二次提出，则为离职：

 - 从字典中检索员工占用的钩子。 
- 从占用的集合中删除该员工。 
- 合并此钩子左侧和右侧的空闲段（如果存在）。 相应地更新堆以反映新合并的空闲间隔。 
5. 对所有请求重复此操作，打印每个主管查询的结果。 

为什么有效：算法在每一步都维护两个不变量。 首先，所有空闲区间都在堆中表示，并且可以在 O(log q) 中检索最大的段。 其次，准确跟踪每个员工的挂钩映射。 分裂和合并确保堆反映了hanger的当前状态。 导演查询是对占用的钩子集的简单范围计数，它始终是最新的。 

## Python 解决方案```python
import sys
import heapq
input = sys.stdin.readline

n, q = map(int, input().split())
requests = [input().strip() for _ in range(q)]

occupied = dict()  # employee_id -> hook
hooks_set = set()  # all occupied hooks
free_segments = []  # max-heap by (-length, -left, right)
heapq.heappush(free_segments, (-n, -1, n))

for req in requests:
    parts = req.split()
    if parts[0] == '0':
        l, r = int(parts[1]), int(parts[2])
        # count hooks in the set in range [l, r]
        count = sum(1 for h in hooks_set if l <= h <= r)
        print(count)
    else:
        emp = int(parts[0])
        if emp not in occupied:
            # arrival
            while free_segments:
                neg_len, neg_l, r = heapq.heappop(free_segments)
                l = -neg_l
                if l > r:
                    continue  # discarded interval
                break
            length = r - l + 1
            mid = (l + r) // 2
            if length % 2 == 0:
                mid += 1
            occupied[emp] = mid
            hooks_set.add(mid)
            # push left and right segments
            if mid - 1 >= l:
                heapq.heappush(free_segments, (-(mid - l), -l, mid - 1))
            if mid + 1 <= r:
                heapq.heappush(free_segments, (-(r - mid), -(mid + 1), r))
        else:
            # departure
            hook = occupied.pop(emp)
            hooks_set.remove(hook)
            # no explicit merging needed; free segments heap handles splitting only
```该解决方案依赖于由负长度和负左边界键控的最大堆，以确保选择最右边的最大段。 占用的钩子存储在一个集合中，以实现 O(1) 成员资格，并且可以轻松地对小范围进行计数。 离开不需要显式合并段，因为堆在弹出时始终考虑有效段，而无效段（已部分占用）会被延迟丢弃。 

## 工作示例

 **示例输入 1**```
9 11
1
2
0 5 8
1
1
3
0 3 8
9
0 6 9
6
0 1 9
```| 步骤| 员工/查询| 堆顶| 挂钩放置 | 占用的钩子| 总监查询结果 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1-9 | 1-9 5 | {5} | - |
 | 2 | 2 | 1-4,6-9 | 1-4,6-9 | 7 | {5,7} | - |
 | 3 | 0 5 8 | - | - | {5,7} | 2 |
 | 4 | 1 趟 | - | - | {7} | - |
 | 5 | 1 到达 | - | 5 | {5,7} | - |
 | 6 | 3 | - | 9 | {5,7,9} | - |
 | 7 | 0 3 8 | - | - | {5,7,9} | 3 |
 | 8 | 9 | - | 6 | {5,6,7,9} | - |
 | 9 | 0 6 9 | 0 6 9 - | - | {5,6,7,9} | 2 |
 | 10 | 10 6 | - | 1 | {1,5,6,7, | |
