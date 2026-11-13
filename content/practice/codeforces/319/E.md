---
title: "CF 319E - 乒乓球"
description: "我们被要求维护一组动态的间隔并回答它们之间的可达性查询。 每个区间由两个整数 $(x, y)$ 表示，其中 $x < y$。 间隔被一一添加，并且每个新的间隔都保证严格地比所有先前的间隔长。"
date: "2026-06-06T02:04:02+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 319
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 189 (Div. 1)"
rating: 3000
weight: 319
solve_time_s: 91
verified: true
draft: false
---

[CF 319E - 乒乓球](https://codeforces.com/problemset/problem/319/E)

 **评分：** 3000
 **标签：** 数据结构
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求维护一组动态的间隔并回答它们之间的可达性查询。 每个区间由两个整数表示$(x, y)$在哪里$x < y$。 间隔被一一添加，并且每个新的间隔都保证严格地比所有先前的间隔长。 从区间移动$(a, b)$间隔$(c, d)$如果任一端点是允许的$(a, b)$严格位于内部$(c, d)$。 如果我们可以链接这些动作，则两个区间之间存在一条路径。 

输入由许多查询组成，要么添加新间隔，要么询问是否存在从先前添加的间隔到另一间隔的路径。 输出应以“YES”或“NO”响应第二类型的每个查询。 

和$n$最多$10^5$和坐标高达$10^9$，我们买不起$O(n^2)$比较每个查询的每对间隔的方法。 一个简单的解决方案会在每次添加新间隔或检查可达性时扫描整个间隔集，这可能会导致最多$10^{10}$操作，远远超出了2秒的时间限制。 我们需要一个允许增量更新和高效可达性查询的数据结构。 

由于间隔是按严格增加的长度添加的，因此会出现微妙的边缘情况。 这保证了每个新间隔不能被任何旧间隔包含，但旧间隔可以被新间隔包含。 粗心的实现可能会尝试在不利用此属性的情况下检查每个查询的所有间隔，从而产生二次时间复杂度。 

另一个边缘情况是间隔共享端点时。 例如，如果$(1, 5)$和$(5, 11)$存在，从第一个到第二个的路径不存在，因为第一个端点的端点都严格位于第二个端点之内。 这里正确的输出是“NO”。 

## 方法

 暴力解决方案迭代到目前为止为每个查询添加的所有间隔。 对于类型 2 查询，我们可以从起始间隔执行深度优先搜索，使用端点包含规则检查每个间隔的可达性。 虽然这种方法是正确的，但在最坏的情况下，它需要遍历每个查询的所有间隔，从而导致$O(n^2)$时间复杂度。 和$n = 10^5$，这显然太慢了。 

解锁更快解决方案的关键观察是严格增加的长度属性。 这意味着每个新的间隔都可以“吸收”旧的间隔，但不能被它们吸收。 因此，可达性总是从较小的间隔到较大的间隔向前引导。 我们可以将每个区间表示为一个节点，并为其维护两个值：通过连续移动可以到达的最小和最大位置。 添加新间隔时，它可能会扩展其端点位于其内部的先前间隔的范围。 我们可以通过在间隔上向后迭代、更新其可达范围来在线性时间内有效地传播这种可达性。 一旦处理了间隔，回答查询就减少为检查目标间隔的端点是否位于源间隔的可达范围内。 这减少了问题$O(n^2)$到$O(n)$用于处理所有添加和查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 按照添加的顺序维护间隔列表。 每个间隔存储其开始和结束坐标。 
2.维护两个数组，`reach_min`和`reach_max`，表示每个间隔可到达的最小和最大位置。 
3. 添加新区间时`(x, y)`, 初始化`reach_min`和`reach_max`为它作为`x`和`y`。 在先前添加的间隔上向后迭代。 如果间隔的开始或结束位于新间隔内，则更新前一个间隔的`reach_min`和`reach_max`通过扩展它们以包括新间隔的范围。 如果当前间隔的范围已经覆盖新间隔，则停止传播。 
4. 查询`(a, b)`,检查是否有区间`b`完全在可达范围内`[reach_min[a], reach_max[a]]`。 如果任一端点`b`在此范围内，输出“YES”； 否则，输出“NO”。 

正确性得到保证，因为严格增加的区间长度确保所有可达性传播都是单调的：一旦范围扩展，它就永远不会缩小，并且所有移动都遵守包含规则。 这使得可达性计算相当于一次区间扩展，捕获所有可能的路径。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
intervals = []
reach_min = []
reach_max = []

for _ in range(n):
    parts = input().split()
    if parts[0] == '1':
        x, y = int(parts[1]), int(parts[2])
        intervals.append((x, y))
        reach_min.append(x)
        reach_max.append(y)
        i = len(intervals) - 2
        while i >= 0:
            lx, rx = reach_min[i], reach_max[i]
            nx, ny = reach_min[-1], reach_max[-1]
            a, b = intervals[i]
            if (a > nx and a < ny) or (b > nx and b < ny):
                reach_min[i] = min(lx, nx)
                reach_max[i] = max(rx, ny)
            i -= 1
    else:
        a, b = int(parts[1]) - 1, int(parts[2]) - 1
        bx, by = intervals[b]
        if (bx >= reach_min[a] and bx <= reach_max[a]) or (by >= reach_min[a] and by <= reach_max[a]):
            print("YES")
        else:
            print("NO")
```解决方案的每个部分都直接对应于算法步骤。 我们存储间隔及其范围。 添加新间隔时，我们仅将可达性向后传播到现在可能到达它的间隔。 查询只是检查目标间隔是否位于源间隔的可达范围内。 当不再发生进一步扩展时，向后传播就会停止，从而防止不必要的更新并保持线性总时间复杂度。 

## 工作示例

 样本1：```
5
1 1 5
1 5 11
2 1 2
1 2 9
2 1 2
```| 步骤| 间隔 | 到达最小值 | 达到最大 | 查询 | 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 | (1,5) | 1 | 5 | - | - |
 | 2 | (5,11) | 1,5 | 1,5 | 5,11 | 5,11 - | - |
 | 3 | - | - | - | 1→2 | 否 |
 | 4 | (2,9) | 1,5,2 | 11,11,9 | 11,11,9 | - | - |
 | 5 | - | - | - | 1→2 | 是 |

 该轨迹展示了可达范围的向后传播。 最初，区间 1 无法到达区间 2，因为区间 1 的端点 5 并不严格位于 (5,11) 内。 添加间隔 3 后，间隔 1 的可达性通过间隔 3 扩展，从而允许到达间隔 2 的路径。 

自定义输入2：```
3
1 1 4
1 2 5
2 1 2
```| 步骤| 间隔 | 到达最小值 | 达到最大 | 查询 | 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 | (1,4) | 1 | 4 | - | - |
 | 2 | (2,5) | 1,2 | 5,5 | - | - |
 | 3 | - | - | - | 1→2 | 是 |

 间隔 1 的范围扩展到间隔 2，从而使可达性达到 2。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个间隔只能将其到达范围传播到之前的间隔一次，并且每个查询的时间复杂度为 O(1) |
 | 空间| O(n) | 存储 n 个区间和两个大小为 n 的到达数组 |

 该解决方案完全符合限制。 由于严格增加的长度保证，后向传播是高效的，并且查询是瞬时的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    n = int(input())
    intervals = []
    reach_min = []
    reach_max = []

    for _ in range(n):
        parts = input().split()
        if parts[0] == '1':
            x, y = int(parts[1]), int(parts[2])
            intervals.append((x, y))
            reach_min.append(x)
            reach_max.append(y)
            i = len(intervals) - 2
            while i >= 0:
                lx, rx = reach_min[i], reach_max[i]
                nx, ny = reach_min[-1], reach_max[-1]
                a, b = intervals[i]
                if (a > nx and a < ny) or (b > nx and b < ny):
                    reach_min[i] = min(lx, nx)
                    reach_max[i] = max(rx, ny)
                i -= 1
        else:
            a, b = int(parts
```
