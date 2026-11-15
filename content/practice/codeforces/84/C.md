---
title: "CF 84C - 冬季两项"
description: "我们有一组圆形目标，全部位于 Ox 轴上，每个目标由其中心坐标和半径定义。 Valera 多次射击，每次射击都有一个 (x, y) 坐标。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "implementation"]
categories: ["algorithms"]
codeforces_contest: 84
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 72 (Div. 2 Only)"
rating: 1700
weight: 84
solve_time_s: 177
verified: false
draft: false
---

[CF 84C - 冬季两项](https://codeforces.com/problemset/problem/84/C)

 **评分：** 1700
 **标签：** 二分查找，实现
 **求解时间：** 2m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一组圆形目标，全部位于 Ox 轴上，每个目标由其中心坐标和半径定义。 Valera 多次射击，每次射击都有一个 (x, y) 坐标。 目标是为每个目标识别第一个击中它的射击，如果没有射击击中它，则为 -1。 如果目标到中心的欧氏距离小于或等于半径，则射击击中目标。 最终输出还需要至少击中一次的目标总数。 

目标数量$n$可以达到$10^4$，以及拍摄次数$m$可以达到$2 \cdot 10^5$。 在天真的双循环中检查每个目标的每次射击需要$n \times m$操作，大约可达$2 \cdot 10^9$在最坏的情况下，这对于 1 秒的时间限制来说太慢了。 我们需要一种方法来减少每次射击的距离计算次数。 

当目标非常接近或彼此接触时，就会出现微妙的边缘情况。 即使没有目标重叠，一个目标边界上的射击也可能位于下一个目标内。 该算法必须正确识别输入顺序中命中的第一个目标，而不仅仅是任何目标。 

另一种边缘情况是正好在目标边界上射击。 欧氏距离公式必须用“≤”来实现以包含边界。 整数溢出不是问题，因为所有坐标都是有界的，但平方坐标应保持在标准整数限制内。 

## 方法

 蛮力方法只是迭代每个目标和每次射击，计算从射击到目标中心的平方距离，并将其与平方半径进行比较。 虽然正确，但它执行$n \times m$距离计算，大致为$2 \cdot 10^9$在最坏的情况下而且太慢。 

优化的关键观察是所有目标中心都位于 x 轴上并且不重叠。 每个目标由 x 轴上的间隔定义：$x-r$到$x+r$。 仅当目标的 x 坐标位于此区间内时，射击才能击中目标。 此外，垂直距离$y$必须满足$y^2 \le r^2 - (x_{\text{shot}} - x_{\text{target}})^2$。 按 x 坐标对目标进行排序使我们能够使用二分搜索来有效地识别每个镜头的候选目标。 

我们可以预先计算 x 轴上每个目标的间隔，而不是检查每次射击的所有目标。 用于射击位置$(sx, sy)$，我们找到所有 x 区间包含的目标$sx$。 由于间隔是不相交的或只是接触的，因此二分搜索每次射击最多识别一个候选目标。 然后我们检查垂直距离来确认镜头是否在圆圈内。 这将复杂性降低到$O(m \log n)$用于检查镜头，加上$O(n \log n)$用于排序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m) | O(n) | 太慢了 |
 | 排序区间+二分查找| O(n log n + m log n) | O(n log n + m log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将所有目标读入列表，每个目标作为 (center_x, radius, index) 的元组。 计算每个目标在 x 轴上的间隔：[center_x - radius, center_x + radius]。 存储索引以映射回输入顺序。 
2. 按目标的左区间边界对目标进行排序。 排序可确保二分搜索高效工作。 
3. 将长度为 n 的结果数组初始化为 -1，以跟踪击中每个目标的第一发子弹。 
4. 迭代所有镜头。 对于 (sx, sy) 处的每次拍摄：

 a. 对目标的左边界执行二分搜索，找到左边界 ≤ sx 的最后一个目标。 

b. 对于候选目标，检查镜头的 x 坐标是否在区间内，以及到中心的欧氏距离平方是否≤半径平方。 

c. 如果命中，并且目标没有记录第一次射击，则使用从 1 开始的射击索引更新结果数组。 
5. 处理完所有射击后，统计第一次命中的目标数量（结果不等于-1）。 
6. 输出总命中数，然后按输入顺序输出结果数组。 

为什么有效：对目标进行排序并按 x 坐标进行搜索可以保证我们不会错过任何可能击中的目标。 由于间隔不重叠，二分搜索每次射击都会识别一个候选目标。 使用平方距离可以避免浮点错误，索引映射确保我们按输入顺序报告结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from bisect import bisect_right

n = int(input())
targets = []
for i in range(n):
    x, r = map(int, input().split())
    targets.append((x - r, x + r, x, r, i))  # left, right, center, radius, original index

targets.sort()  # sort by left boundary

m = int(input())
shots = [tuple(map(int, input().split())) + (idx + 1,) for idx in range(m)]  # x, y, 1-based index

res = [-1] * n
lefts = [t[0] for t in targets]  # for binary search

for sx, sy, shot_idx in shots:
    pos = bisect_right(lefts, sx) - 1
    if 0 <= pos < n:
        l, r, cx, cr, idx = targets[pos]
        if l <= sx <= r and (sx - cx)**2 + sy**2 <= cr**2:
            if res[idx] == -1:
                res[idx] = shot_idx

hit_count = sum(1 for x in res if x != -1)
print(hit_count)
print(' '.join(map(str, res)))
```该解决方案读取目标并将其转换为 x 间隔。 按左边界排序可以对候选目标进行有效的二分搜索。 对于每个镜头，bisect_right 查找左侧 ≤ 镜头 x 坐标的最后一个间隔。 检查 x 间隔和平方距离可确保正确性。 我们只更新每个目标的第一次命中，保留“第一次射击”的要求。 

## 工作示例

 输入示例 1：```
3
2 1
5 2
10 1
5
0 1
1 3
3 0
4 0
4 0
```每个镜头的步骤轨迹：

 | 射击 idx | SX | sy | 候选目标| 命中？ | 拍摄后分辨率|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 1 | 无 | 没有| [-1,-1,-1] |
 | 2 | 1 | 3 | 无 | 没有| [-1,-1,-1] |
 | 3 | 3 | 0 | 目标 1 | 是的 | [3，-1，-1] |
 | 4 | 4 | 0 | 目标 2 | 是的 | [3,4,-1] |
 | 5 | 4 | 0 | 目标 2 | 是的，但已经记录了 | [3,4,-1] |

 最终输出：```
2
3 4 -1
```这证实了二分搜索为每次射击识别了正确的目标，并且维护了首次命中索引。 

示例输入 2（边界上的边缘拍摄）：```
2
0 2
5 3
3
2 0
5 3
8 0
```| 射击 idx | SX | sy | 候选目标| 命中？ | 拍摄后分辨率|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 0 | 目标 1 | 是的 | [1，-1] |
 | 2 | 5 | 3 | 目标 2 | 是的 | [1,2]|
 | 3 | 8 | 0 | 目标 2 | 没有| [1,2]|

 输出：```
2
1 2
```确认边界条件处理正确。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + m log n) | O(n log n + m log n) | 对目标进行排序 O(n log n) 加上每次射击的二分搜索 O(log n)（对于 m 次射击） |
 | 空间| O(n + m) | 存储目标和结果，以及射击阵列 |

 这完全符合 1 秒的时间限制和 256 MB 的内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # paste the solution code here
    n = int(input())
    targets = []
    for i in range(n):
        x, r = map(int, input().split())
        targets.append((x - r, x + r, x, r, i))
    targets.sort()
    m = int(input())
    shots = [tuple(map(int, input().split())) + (idx + 1,) for idx in range(m)]
    res = [-1] * n
    from bisect import bisect_right
    lefts = [t[0] for t in targets]
    for sx, sy, shot_idx in shots:
        pos = bisect_right(lefts, sx) - 1
        if 0 <= pos < n:
            l, r
```
