---
title: "CF 139B - 壁纸"
description: "我们被要求计算在每个房间都是长方体的公寓中粉刷所有墙壁的最低成本。 对于每个房间，给出了长度、宽度和高度。 房间的周长决定了需要多少条壁纸。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 139
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 99 (Div. 2)"
rating: 1600
weight: 139
solve_time_s: 87
verified: true
draft: false
---

[CF 139B - 壁纸](https://codeforces.com/problemset/problem/139/B)

 **评分：** 1600
 **标签：** 实现、数学
 **求解时间：** 1m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算在每个房间都是长方体的公寓中粉刷所有墙壁的最低成本。 对于每个房间，给出了长度、宽度和高度。 房间的周长决定了需要多少条壁纸。 每种类型的壁纸都有固定宽度和长度的卷，并且卷不能旋转。 沿着卷筒垂直切割条带，每个房间都必须贴上单一类型的壁纸。 允许部分卷，但不能在房间之间共享卷。 我们的目标是为每个房间选择壁纸类型和卷数，以最大限度地降低总成本。 

限制是适度的：房间数量和壁纸类型最多为 500。尺寸和价格上限为 500。这允许算法最多粗略地$O(n \cdot m)$复杂。 由于所有输入数字都是小整数，因此无需担心浮点精度，但在计算每卷条数时需要仔细的整数运算以避免差一错误。 

需要注意的一个边缘情况是卷的宽度大于房间周长，因此单卷就足够了。 另一种情况是当卷长度仅允许少量条带时，需要多卷。 例如，一个周长6米、高5米的房间，使用长4米、宽2米的卷筒，需要仔细计算才能确保我们买两卷而不是买错一卷。 

## 方法

 蛮力方法很简单：对于每个房间，迭代每种壁纸类型并计算完全覆盖房间所需的卷数。 将卷数乘以价格即可得出该组合的成本。 然后为房间选择最便宜的壁纸类型。 将所有房间的这些最低成本相加。 这是可行的，因为每个房间都是独立的； 然而，我们必须仔细计算每卷的条数以及需要多少卷。 和$n \le 500$房间和$m \le 500$壁纸类型，这种方法最多会导致$500 \cdot 500 = 250,000$操作，2 秒的时间限制是可以接受的。 

简化计算的关键观察是，一卷可以提供的条带数量是卷长度除以房间高度的整数，而所需条带的数量是房间周长除以卷宽度的整数，向上舍入。 通过这两个整数除法，我们可以计算任何壁纸类型-房间组合所需的最小卷数。 不需要动态编程或图形算法，因为房间不交互。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * m) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n * m) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取输入值：房间数量、房间尺寸、壁纸类型数量、卷规格及价格。 
2. 初始化变量`total_cost`为零。 
3. 对于每个房间，计算周长：`2 * (length + width)`并存储高度。 
4. 初始化`min_cost`将当前房间设置为无穷大。 
5. 对于每种壁纸类型，通过将卷长度除以房间高度来确定单卷提供的垂直条数。 
6. 将周长除以卷宽度并向上舍入，确定房间所需的条带总数。 
7. 计算所需的卷数作为上限`required_strips / strips_per_roll`。 
8. 将卷数乘以壁纸类型的价格即可得出该壁纸类型的总成本。 
9. 更新`min_cost`如果这个成本低于当前`min_cost`。 
10. 考虑房间的所有壁纸类型后，添加`min_cost`到`total_cost`。 
11. 打印`total_cost`。 

正确性取决于两个事实：每个房间都只覆盖一种壁纸类型，并且条带不能在卷或房间之间共享。 使用整数算术计算条带和卷的数量可确保我们不会低估所需的卷。 考虑到所有壁纸类型可保证独立找到每个房间的最低成本，因此跨房间求和即可得出全局最小值。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

n = int(input())
rooms = []
for _ in range(n):
    l, w, h = map(int, input().split())
    rooms.append((l, w, h))

m = int(input())
wallpapers = []
for _ in range(m):
    roll_length, roll_width, price = map(int, input().split())
    wallpapers.append((roll_length, roll_width, price))

total_cost = 0

for length, width, height in rooms:
    perimeter = 2 * (length + width)
    min_cost = float('inf')
    for roll_length, roll_width, price in wallpapers:
        strips_per_roll = roll_length // height
        if strips_per_roll == 0:
            continue
        strips_needed = (perimeter + roll_width - 1) // roll_width
        rolls_needed = (strips_needed + strips_per_roll - 1) // strips_per_roll
        cost = rolls_needed * price
        min_cost = min(min_cost, cost)
    total_cost += min_cost

print(total_cost)
```该代码首先读取所有房间和壁纸，以避免输入处理与计算交错。 整数除法确保我们正确计算每卷的条数和所需的卷数。 添加的`roll_width - 1`和`strips_per_roll - 1`整数除法之前模拟了取整运算，避免了浮点运算，保证了正确性。 

## 工作示例

 ### 示例 1

 输入：```
1
5 5 3
3
10 1 100
15 2 320
3 19 500
```| 房间| 周长| 壁纸| 条状/卷状| 需要条带| 劳斯莱斯 | 成本| 最低成本|
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 5x5x3 | 5x5x3 20 | 10x1,100 | 10x1,100 3 | 20 | 7 | 700 | 640 | 640
 | | | 15x2,320 | 5 | 10 | 10 2 | 640 | 640 640 | 640
 | | | 3x19,500 | 3x19,500 1 | 20 | 2 | 1000 | 1000 640 | 640

 该算法正确选择了第二种壁纸类型，总成本为 640。 

### 示例 2

 输入：```
2
3 4 2
6 5 3
2
10 2 200
6 1 100
```| 房间| 周长| 壁纸| 条状/卷状| 需要条带| 劳斯莱斯 | 成本| 最低成本|
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 3x4x2 | 3x4x2 14 | 14 10x2,200 | 10x2,200 5 | 7 | 2 | 400 | 400 |
 | | | 6x1,100 | 6x1,100 3 | 14 | 14 5 | 500 | 500 400 |
 | 6x5x3 | 6x5x3 22 | 22 10x2,200 | 10x2,200 3 | 11 | 11 4 | 800 | 800 |
 | | | 6x1,100 | 6x1,100 2 | 22 | 22 11 | 11 1100 | 1100 800 |

 总成本 = 400 + 800 = 1200。 

这表明该算法可以正确计算每卷的条数以及多个房间所需的卷数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * m) | 对于 n 个房间中的每一个，我们检查 m 个壁纸类型，每次迭代计算一些整数除法。 |
 | 空间| O(n + m) | 我们存储房间尺寸和壁纸规格。 |

 和$n, m \le 500$，总操作次数最多为 250,000 次，轻松满足 2 秒的时间限制和 256 MB 内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    rooms = [tuple(map(int, input().split())) for _ in range(n)]
    m = int(input())
    wallpapers = [tuple(map(int, input().split())) for _ in range(m)]
    
    total_cost = 0
    for length, width, height in rooms:
        perimeter = 2 * (length + width)
        min_cost = float('inf')
        for roll_length, roll_width, price in wallpapers:
            strips_per_roll = roll_length // height
            if strips_per_roll == 0:
                continue
            strips_needed = (perimeter + roll_width - 1) // roll_width
            rolls_needed = (strips_needed + strips_per_roll - 1) // strips_per_roll
            cost = rolls_needed * price
            min_cost = min(min_cost, cost)
        total_cost += min_cost
    return str(total_cost)

# provided sample
assert run("1\n5 5 3\n3\n10 1 100\n15 2 320\n3 19 500\n") == "640", "sample 1"

# minimum input
assert run("1\n1 1 1\n1\n1 1 1\n") == "1", "minimum input"

# equal dimensions and prices
assert run("2\n2 2 2\n2 2 2\n2\n4 1 2\n4 2 3\n") ==
```
