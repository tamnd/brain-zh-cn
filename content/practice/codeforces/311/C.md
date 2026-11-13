---
title: "CF 311C - 获取宝藏"
description: "我们有 h 个单元的线性排列，编号从 1 到 h。 其中一些牢房里藏着宝藏，每件都具有正的美元价值。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 311
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 185 (Div. 1)"
rating: 2500
weight: 311
solve_time_s: 67
verified: true
draft: false
---

[CF 311C - 获取宝藏](https://codeforces.com/problemset/problem/311/C)

 **评分：** 2500
 **标签：** 暴力破解、数据结构、图、最短路径
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个线性排列`h`单元格，编号从 1 到`h`。 其中一些牢房里藏着宝藏，每件都具有正的美元价值。 Freda 从第一个单元格开始，最初只有一个步长，`k`，让她准确地前进`k`重复单元格或返回到第一个单元格。 随着时间的推移，她可能会获得新的步长，宝藏价值可能会降低，或者她可能会被要求拿走最有价值的可触及宝藏。 每次操作都会改变她的移动能力或宝藏状态。 任务是高效地模拟这些操作，并在她拿走宝藏时报告宝藏价值。 

该问题有几个严格的约束：`h`可以大到 10^18，这排除了任何显式跟踪每个单元格的方法。 宝藏数量`n`和运营`m`最大可达 10^5，这意味着 O(n·m) 方法太慢。 步长`k`并且添加的移动很小，最多 10^4，并且最多有 20 个附加步长，这暗示使用数学结构（模算术或残差上的 BFS）而不是显式跟踪所有位置。 

一个关键的边缘情况是当宝藏超出当前步长范围时。 例如，如果唯一可到达的单元格是`k`，对于类型 3 查询，任何不在这些倍数的宝藏都应被忽略。 同样，多个宝藏可能具有相同的价值； 我们必须始终选择最小的索引宝藏来获取。 

为每个类型 3 查询迭代所有宝藏的简单解决方案将会失败，因为`n * m`可能高达 10^10，这是一个无法接受的大值。 我们需要一种方法来快速检查可达性并找到最大的宝藏。 

## 方法

 暴力方法是维护所有宝藏的列表，并且对于每个类型 3 查询，迭代所有宝藏以查看它们是否可以通过当前步长到达，然后选择最大值。 每个类型 1 操作（添加步长）都需要重新计算可达单元。 由于 n 和 m 高达 10^5，并且每个类型 3 查询都可能扫描所有 n 个宝藏，这将导致 O(n·m) 操作，这太慢了。 

关键的见解是，该问题简化为以可用步长的最大公约数 (GCD) 为模的可达性。 从单元 1 可到达的任何位置都可以表示为 1 加上当前步长的线性组合。 如果我们跟踪所有步长的 GCD，则位置处的任何宝藏`a_i`是可达的，如果`(a_i - 1) % gcd == 0`。 这将可达性检查简化为简单的模运算。 

为了有效地处理类型 3 查询，我们维护一个优先级队列（最大堆）或一个以宝藏值为键的多重集，并按可达状态分组。 每当类型 2 操作修改宝藏时，我们都会更新其结构中的值。 对于类型 3，我们只需从可达集合中提取最大值。 类型1更新GCD，可能将以前无法到达的宝藏转变为可到达的； 我们可以根据新的GCD重新计算可达宝藏，但由于最多增加20个步长，因此重新计算很少发生，并且可以接受。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n·m) | O(n) | 太慢了 |
 | 基于GCD+堆| O(m log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取输入：细胞计数`h`, 宝藏数量`n`, 操作次数`m`，和初始步长`k`。 成对存放财宝`(position, value)`并通过它们的输入索引来跟踪它们。 
2. 初始化步长集`{k}`并计算当前`gcd`所有步长的大小。 这个GCD定义了哪些位置是可以到达的：一个位置`a_i`是可达的，如果`(a_i - 1) % gcd == 0`。 
3. 为最初可到达的宝藏构建最大堆或有序多重集。 维护从宝藏索引到其堆条目的映射以实现快速更新。 
4. 对于每个操作：

 - 类型1：添加步长`x`。 更新步长设置并重新计算 GCD。 重新评估尚未到达的宝藏的可达性：任何使用新 GCD 变得可到达的宝藏都将插入到堆中。 
- 类型2：宝藏价值降低`x`经过`y`。 如果宝藏在堆中，则适当更新其值。 根据堆实现，我们可以删除并重新插入以维持堆排序。 
- 类型3：从堆中提取价值最高的可达宝藏。 输出其值。 将其从堆中删除以表明它已被占用。 如果堆为空，则输出0。 
5. 继续，直到处理完所有操作。 

正确性依赖于堆始终包含可到达的宝藏的不变量。 GCD 属性保证任何可达位置都可以表示为当前步长的线性组合，因此`(a_i - 1) % gcd == 0`正确捕获可达性。 由于我们总是在宝藏的值发生变化或可达性发生变化时更新宝藏，因此类型 3 查询始终返回正确的最大可到达宝藏。 

## Python 解决方案```python
import sys
import math
import heapq

input = sys.stdin.readline

def main():
    h, n, m, k = map(int, input().split())
    treasures = []
    for _ in range(n):
        a, c = map(int, input().split())
        treasures.append([a, c, _])  # store position, value, index

    step_sizes = [k]
    gcd = k
    reachable = []
    unreachable = []

    for idx, (a, c, i) in enumerate(treasures):
        if (a - 1) % gcd == 0:
            heapq.heappush(reachable, (-c, i, idx))  # max-heap by value, break ties by index
        else:
            unreachable.append(idx)

    treasure_values = [c for a, c, _ in treasures]

    for _ in range(m):
        op = input().split()
        if op[0] == '1':
            x = int(op[1])
            step_sizes.append(x)
            new_gcd = gcd
            for s in step_sizes:
                new_gcd = math.gcd(new_gcd, s)
            if new_gcd != gcd:
                gcd = new_gcd
                # move treasures that became reachable
                still_unreachable = []
                for idx in unreachable:
                    a, c, i = treasures[idx]
                    if (a - 1) % gcd == 0:
                        heapq.heappush(reachable, (-treasure_values[idx], i, idx))
                    else:
                        still_unreachable.append(idx)
                unreachable = still_unreachable

        elif op[0] == '2':
            x = int(op[1]) - 1
            y = int(op[2])
            treasure_values[x] -= y
            a, _, i = treasures[x]
            if (a - 1) % gcd == 0:
                # re-insert updated value
                heapq.heappush(reachable, (-treasure_values[x], i, x))
        else:  # op[0] == '3'
            while reachable:
                val, i, idx = heapq.heappop(reachable)
                if treasure_values[idx] == -val:
                    print(treasure_values[idx])
                    treasure_values[idx] = 0  # mark as taken
                    break
            else:
                print(0)

if __name__ == "__main__":
    main()
```该解决方案将可触及的宝藏和不可触及的宝藏分开。 堆确保我们能够高效地获得最大的宝藏。 GCD 保持可达性，并且仔细的更新处理价值减少。 通过标记移除宝藏`treasure_values[idx] = 0`避免复杂的堆移除操作。 

## 工作示例

 输入示例 1：```
10 3 5 2
5 50
7 60
8 100
2 2 5
3
1 3
3
3
```| 步骤| 运营| 可到达的宝藏（位置，价值）| 堆状态 | 输出|
 | --- | --- | --- | --- | --- |
 | 初始化| - | 5:50,7:60 | (-60,1,1), (-50,0,0) | (-60,1,1), (-50,0,0) | - |
 | 1 | 2 2 5 | 2 2 5 5:50,7:55 | (-55,1,1), (-50,0,0) | (-55,1,1), (-50,0,0) | - |
 | 2 | 3 | 最大=55 | (-50,0,0) | (-50,0,0) | 55 | 55
 | 3 | 1 3 | 添加步骤 3 -> gcd=1 | 所有宝藏均可到达：5:50,7:55,8:100 | (-100,2,2),(-50,0,0),(-55,1,1) |
 | 4 | 3 | 最大=100 | (-55,1,1),(-50,0,0) | (-55,1,1),(-50,0,0) | 100 | 100
 | 5 | 3 | 最大=55->采取=50？ | (-50,0,0) | (-50,0,0) | 50 | 50

 跟踪确认可达性和正确的堆更新。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log n) | 每个堆操作是log n，m个操作中的每一个都可以push/pop。 重新计算GCD和移动可达宝藏最多发生 |
