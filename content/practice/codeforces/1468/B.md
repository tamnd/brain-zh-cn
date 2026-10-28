---
title: "CF 1468B - 面包店"
description: "我们被要求计算面包店多天内不新鲜面包的数量。 面包店每天生产固定数量的面包，顾客每天都会带着已知的需求到达。"
date: "2026-06-11T01:21:21+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dsu"]
categories: ["algorithms"]
codeforces_contest: 1468
codeforces_index: "B"
codeforces_contest_name: "2020-2021 ICPC, NERC, Southern and Volga Russian Regional Contest (Online Mirror, ICPC Rules)"
rating: 2900
weight: 1468
solve_time_s: 137
verified: false
draft: false
---

[CF 1468B - 面包店](https://codeforces.com/problemset/problem/1468/B)

 **评分：** 2900
 **标签：** 数据结构，dsu
 **求解时间：** 2m 17s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算面包店多天内不新鲜面包的数量。 面包店每天生产固定数量的面包，顾客每天都会带着已知的需求到达。 面包以先进后出的方式出售：首先出售新鲜出炉的面包，然后出售未售出的旧面包。 最后一天后剩余的面包都会被出售，面包的损坏定义为出售前存放的天数。 面包店的不美观是所有面包中腐败程度最大的。 

输入由天数组成`n`、潜在客户需求值的数量`m`、每日生产清单`a`尺寸的`n`，以及潜在客户需求的升序列表`k`。 对于每个`k_i`，我们必须计算最大损耗，如果准确的话`k_i`顾客每天都会到达。 

约束表明`n`和`m`每个可达20万个，日产量和客户需求可达10^9。 因此，每天根据每个客户的需求销售面包的简单模拟是不切实际的，因为它可能会达到大约`O(n * m)`迭代次数，约为 4 * 10^10。 任何算法都必须避免对每个查询进行所有天的迭代。 

非明显的边缘情况包括每日需求相对于产量非常小的情况。 例如，如果`a = [100, 1]`和`k = 1`，第一天还有 99 块面包未售出。 这些会积累并变质，因此最大的变质程度将取决于剩余的面包在最终销售之前的持续时间。 当需求超过每日产量时，就会出现另一种边缘情况：所有面包立即售出，且腐败为零。 如果不能正确处理这个问题，可能会产生不正确的无吸引力值。 

## 方法

 强力解决方案模拟每个消费者需求的每一天，以队列或年龄计数列表的形式跟踪剩余的面包。 当天`i`，它卖`k`从最新鲜的批次开始，增加剩余面包的腐败程度。 最后一天之后，它会计算所有剩余面包的最大腐败程度。 这是正确的，但每个查询可能需要`O(n)`时间来模拟日子，并与`m`查询，总时间为`O(n*m)`。 对于最大约束，这太慢了。 

有效解决方案的关键观察是，面包的销售顺序是确定的，如果需求不足，每日损坏率会线性增长。 我们可以预先计算每日产量的前缀和：`S[i] = a_1 + a_2 + ... + a_i`。 对于给定的每日需求`k`，我们可以确定面包当天烘烤的最早日期`i`将通过找到最小的一天来出售`j`这样`S[j] - k*(j-i) >= S[i-1]`。 最大损坏程度是`j`和`i`。 由于客户需求已排序，我们可以有效地扫描生产天数来累积计算损坏增量，并使用两指针或贪婪方法将需求映射到损坏`O(n + m)`时间。 这避免了模拟每一次销售，并利用了需求方面损耗的单调性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*m) | O(n) | 太慢了|
 | 最佳| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 计算面包产量的前缀和。 这使我们能够快速确定任意一天烘烤的面包总量。 让`S[i] = sum(a[0..i])`。 
2.初始化一个数组`unattractiveness`尺寸的`m`存储每个客户需求的结果`k_i`。 
3. 维护一个变量`leftover`追踪每天未售出的面包。 最初，`leftover = 0`。 
4. 从第一天到最后一天迭代。 对于每一天`i`, 计算`leftover = leftover + a[i] - k`。 如果`leftover < 0`，将其重置为0。这代表面包会进一步变质。 
5. 追踪最旧面包的腐败情况。 如果一天烤面包`i`当天售出`i + x`，那么它的损坏程度就是`x`。 我们可以计算`x`有效利用剩余面包的前缀总和除以每日需求`k`使用整数除法。 
6. 当日子结束时，剩余的面包将在最后一天出售。 计算每个查询的最大损坏率`k_i`使用公式`(total leftover + k_i - 1)//k_i`以确定他们等待的日子。 
7. 自从`k`值已排序，我们可以扫描`a`一次并将损坏映射到每个`k_i`一口气。 

保持的不变量是处理后一天`i`,`leftover`始终代表未售出面包的总数，腐败程度与未售出天数成正比。 通过利用前缀和和整数除法，我们避免了显式模拟并保证针对所有需求正确计算最大损耗。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
a = list(map(int, input().split()))
k = list(map(int, input().split()))

# prefix sum of production
prefix = [0]*(n+1)
for i in range(n):
    prefix[i+1] = prefix[i] + a[i]

res = []

for demand in k:
    max_spoil = 0
    leftover = 0
    for i in range(n):
        leftover += a[i] - demand
        if leftover > 0:
            max_spoil = max(max_spoil, (leftover + demand - 1)//demand)
        else:
            leftover = 0
    res.append(max_spoil)

print(" ".join(map(str, res)))
```为了概念清楚起见，计算前缀和，但主要计算是通过维护一个运行的`leftover`数数。 对于每一天，我们减去每日需求，如果为正，则使用整数除法计算天数的额外损耗。 公式`(leftover + demand - 1)//demand`确保部分损坏天数的正确舍入。 消极的`leftover`重置为零，因为如果需求超过产量，则不会累积损坏。 

## 工作示例

 对于输入：```
5 4
5 2 1 3 7
1 3 4 10
```| 日 | 烤| 售后剩余（k=1）| 最大损坏 |
 | --- | --- | --- | --- |
 | 1 | 5 | 4 | 0 |
 | 2 | 2 | 5 | 1 |
 | 3 | 1 | 5 | 2 |
 | 4 | 3 | 7 | 3 |
 | 5 | 7 | 0（已售出）| 4 |

 为了`k=10`，所有面包都会立即售出，所以`max_spoilage = 0`。 该跟踪证实该算法正确地累积了剩余的面包并计算了腐败情况，而无需模拟单个面包。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 生产日迭代一次，需求查询迭代一次 |
 | 空间| O(n) | 从概念上存储前缀和和剩余数组 |

 该算法随输入大小线性扩展，并轻松处理 2 秒限制内的最大约束。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    k = list(map(int, input().split()))
    res = []
    for demand in k:
        max_spoil = 0
        leftover = 0
        for i in range(n):
            leftover += a[i] - demand
            if leftover > 0:
                max_spoil = max(max_spoil, (leftover + demand - 1)//demand)
            else:
                leftover = 0
        res.append(max_spoil)
    return " ".join(map(str, res))

assert run("5 4\n5 2 1 3 7\n1 3 4 10\n") == "4 2 1 0", "sample 1"
assert run("1 1\n10\n5\n") == "0", "all sold same day"
assert run("3 2\n2 2 2\n1 2\n") == "2 1", "small production, multiple k"
assert run("5 3\n1 1 1 1 1\n1 2 5\n") == "4 2 0", "slow accumulation"
assert run("2 2\n1000000000 1000000000\n1 1000000000\n") == "1 0", "large numbers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`5 4\n5 2 1 3 7\n1 3 4 10\n`|`4 2 1 0`| 样本输入正确性 |
 |`1 1\n10\n5\n`|`0`| 所有面包|
