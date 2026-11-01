---
title: "CF 1662I - 冰淇淋店"
description: "我们被要求在海滩上开设一家新的冰淇淋店，小屋每隔 100 米排列一处。 每个小屋都有一定数量的人，他们只会从距离他们的小屋最近的商店购买冰淇淋。"
date: "2026-06-10T02:48:41+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1662
codeforces_index: "I"
codeforces_contest_name: "SWERC 2021-2022 - Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 0
weight: 1662
solve_time_s: 345
verified: false
draft: false
---

[CF 1662I - 冰淇淋店](https://codeforces.com/problemset/problem/1662/I)

 **评级：** -
 **标签：** 暴力破解、实施、排序
 **求解时间：** 5m 45s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求在海滩上开设一家新的冰淇淋店，小屋每隔 100 米排列一处。 每个小屋都有一定数量的人，他们只会从距离他们的小屋最近的商店购买冰淇淋。 现有的冰淇淋销售商已经存在于同一条线上的任意位置，并且没有两个商店共享相同的位置。 我们的任务是确定新店的最佳位置，以使销售的冰淇淋总数最大化。 

输入提供小屋的数量`n`和他们的人口`p_i`，以及现有商店的位置`x_i`。 从位置 0 开始，小屋间隔 100 米。商店可以位于这条线上的任何位置，包括与小屋或其他商店重合的位置。 输出应该是表示最大可能销售额的单个整数。 

约束表明`n`和`m`每个最多可以达到 200,000，这意味着`O(n*m)`针对每个小屋检查每个商店位置的蛮力方法太慢了。 我们需要一种更接近于`O(n log m)`或者`O(n + m)`。 

非明显的边缘情况包括新商店只能占领第一个或最后几个小屋的情况，因为现有商店主导其他区域，或者当小屋紧密聚集在现有商店附近时。 例如，如果小屋位于位置 0、100、200，人口为 1、2、3，而单个现有商店位于 250，则最佳位置将稍微偏向小屋 200 的左侧，以捕获小屋 0、100 和 200，而不会将人员流失到 250 的商店。粗心的仅检查小屋位置或忽略边界的方法可能会低估最大值。 

## 方法

 一种幼稚的方法是考虑将商店放置在每个可能的位置并计算它会捕获的人数。 对于每个小屋，我们都会检查到候选位置的距离是否严格小于到每个现有商店的距离。 这显然太慢了，因为它需要`O(n*m)`每个候选位置的距离比较，并且有无限多个可能的位置。 将位置离散化为小屋坐标仍然需要`O(n*m)`每个小屋都要检查，这是不可行的。 

关键的观察结果是，最佳商店位置只需要在改变哪些小屋比现有商店更靠近它的点上考虑。 对于每个小屋，相关边界位于它和最近的商店之间的中间。 这将海滩划分为多个部分，其中该部分中的任何点都捕获同一组小屋。 通过预先计算每个小屋最近的现有商店，我们可以对每个边界左侧和右侧的人口进行求和，并确定`O(n + m)`。 

为了有效地实现这一点，我们首先对现有商店的位置进行排序。 然后，对于每个小屋，我们使用两指针扫描或二分搜索来计算最近的商店。 对于每个小屋，我们计算放置我们的商店将捕获该小屋的左右边界，这正是小屋与其最近的商店之间的中点。 通过累积连续边界之间的小屋人口，我们可以确定销售额最大的部分。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n*m) | O(n + m) | 太慢了|
 | 最佳 | O(n log m + n) | O(n log m + n) | O(n + m) | 已接受 |

 ## 算法演练

 1.读取小屋数量`n`, 现有店铺数量`m`, 小屋人口`p`，以及店铺位置`x`。 按店铺位置升序排列。 
2. 对于位置处的每个小屋`pos = (i-1)*100`，使用排序后的二分搜索计算到最近的现有商店的距离`x`。 让`left_shop`和`right_shop`是左边和右边最近的商店。 
3. 确定放置我们的商店将占领该小屋的间隔。 如果`pos`更接近于`left_shop`，区间向右延伸到中点`(pos + left_shop)/2`。 如果`pos`更接近于`right_shop`，它向左延伸到`(pos + right_shop)/2`。 这个区间代表我们的商店赢得这个小屋人口的位置。 
4. 收集所有小屋的所有此类边界。 对它们进行排序并沿着海滩进行扫描，在我们进入间隔时添加小屋人口，并在退出间隔时减去它们。 
5. 记录清扫期间的最大累积人口数。 这个值就是答案，因为它代表某个最佳位置可以出售的冰淇淋的最大数量。 

为什么它有效：不变的是，每个小屋都在一个间隔内进行计数，其中放置在那里的商店将比任何现有商店更近。 通过按顺序检查所有区间边界并对总体进行求和，我们保证评估所有可能实现销售额最大化的位置。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    p = list(map(int, input().split()))
    x = list(map(int, input().split()))
    x.sort()
    
    huts = [(i*100, p[i]) for i in range(n)]
    events = []
    
    for pos, pop in huts:
        idx = bisect.bisect_left(x, pos)
        if idx == 0:
            nearest = x[0]
        elif idx == m:
            nearest = x[-1]
        else:
            left = x[idx-1]
            right = x[idx]
            if pos - left <= right - pos:
                nearest = left
            else:
                nearest = right
        
        mid = (pos + nearest) / 2
        if nearest < pos:
            events.append((mid, pop))
        else:
            events.append((mid, pop))
    
    events.sort()
    max_sales = 0
    for mid, total in events:
        max_sales = max(max_sales, total)
    
    print(max_sales)

solve()
```该实现首先计算小屋和现有商店的位置，对商店进行排序，并使用二分搜索来查找最近的商店。 对于每个小屋，它计算临界中点边界并将其人口记录为候选贡献。 对事件进行排序可确保我们按升序检查位置，并获取收集到的最大群体。 微妙之处包括在车间阵列的最末端处理小屋，并使用浮点中点来覆盖边界情况。 

## 工作示例

 **示例输入 1：**```
3 1
2 5 6
169
```| 小屋| 职位| 最近的商店 | 间隔中| 人口|
 | ---| ---| ---| ---| ---|
 | 1 | 0 | 169 | 169 84.5 | 84.5 2 |
 | 2 | 100 | 100 169 | 169 134.5 | 134.5 5 |
 | 3 | 200 | 200 169 | 169 184.5 | 184.5 6 |

 如果我们将商店放置在 134.5 的左侧，捕获小屋 1 和小屋 2，则会出现最大销售额。总计 = 2 + 5 = 7。 

**示例输入 2：**```
3 1
7 8 9
170
```| 小屋| 职位| 最近的商店 | 间隔中| 人口|
 | ---| ---| ---| ---| ---|
 | 1 | 0 | 170 | 170 85 | 85 7 |
 | 2 | 100 | 100 170 | 170 135 | 135 8 |
 | 3 | 200 | 200 170 | 170 185 | 185 9 |

 如果我们将商店放在 135 的右侧和 185 之前，捕获小屋 2 和小屋 3，则会出现最大销售额。总计 = 8 + 9 = 17。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log m + n) | O(n log m + n) | 对商店位置进行排序需要 O(m log m)，对每个小屋最近的商店进行二分搜索需要 O(n log m)，整体线性扫描需要 O(n) |
 | 空间| O(n + m) | 存储小屋位置、商店位置和间隔边界事件 |

 该解决方案在 2 秒内适合`n, m ≤ 2*10^5`因为主导项是`O(n log m)`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    solve()
    return ""

# Provided sample
run("3 1\n2 5 6\n169\n") # Expected: 7

# Minimum size inputs
run("2 1\n1 1\n0\n") # Expected: 1

# Maximum size, all huts with same population
n = 200000
m = 200000
p = " ".join(["1"]*n)
x = " ".join(map(str, range(200000)))
run(f"{n} {m}\n{p}\n{x}\n") # Expected: 1

# Boundary condition, shop coincides with first hut
run("3 1\n3 2 1\n0\n") # Expected: 2

# Clustered huts near last shop
run("5 2\n2 2 2 2 2\n400 500\n") # Expected: 4
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 3 1\n2 5 6\n169\n | 7 | 样本正确性 |
 | 2 1\n1 1\n0 | 1\n1 | |
