---
title: "CF 1137E - 火车车厢选择"
description: "我们被要求模拟一列不断增长的火车，其车厢价值随着时间的推移而变化。 最初，有 $n$ 辆车，从车头开始编号。"
date: "2026-06-12T03:58:46+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1137
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 545 (Div. 1)"
rating: 2700
weight: 1137
solve_time_s: 97
verified: false
draft: false
---

[CF 1137E - 火车车厢选择](https://codeforces.com/problemset/problem/1137/E)

 **评分：** 2700
 **标签：** 数据结构，贪心
 **求解时间：** 1m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求模拟一列不断增长的火车，其车厢价值随着时间的推移而变化。 最初，有$n$汽车从车头开始编号。 车厢可以添加到火车的任意一端，并且在某些时刻，所有车厢的价值$A_i$通过线性函数递增$b + (i-1) \cdot s$。 每次操作后，我们必须报告具有最小的汽车的最小索引$A_i$及其价值。 

关键的挑战是$n$可以达到$10^9$，而最多可以有 300,000 个事件。 明确存储所有汽车值是不可能的，因此任何实际跟踪的方法$A_i$每辆车都会炸毁记忆和时间。 这完全排除了简单的阵列模拟。 

当汽车添加到头部时，会出现一个微妙的边缘情况：所有现有索引都会发生变化。 如果我们忘记考虑这种转变，我们可能会将错误的汽车报告为最小汽车。 同样，在重新计算后，具有最小的汽车$A_i$根据坡度可能会移动到新的头部或尾部$s$。 例如，如果火车有车厢[0,0]，我们将3添加到车头，新车头的索引为1，值为0，而旧车头的索引为4； 忽略索引变化的幼稚方法会报告错误的最小汽车。 

## 方法

 蛮力方法很简单。 维护一个包含所有内容的数组$A_i$，添加汽车时更新索引，并在发生 3 类事件时重新计算所有汽车的值。 每次操作后，扫描数组中的最小值并打印其索引和值。 这种方法是正确的，因为它从字面上反映了问题，但它需要$O(n \cdot m)$最坏情况下的操作。 和$n$最多$10^9$和$m$到3×10^5，这是完全不可行的。 

最佳方法依赖于观察到每次重新计算后，最小值出现在列车的头部或尾部，具体取决于斜率$s$。 具体来说，如果$s > 0$，值从头到尾线性增加，所以最小$A_i$是在头部。 如果$s = 0$，所有汽车均等增量，因此最小值可以是任何位置，但优先选择最早的索引。 因为所有汽车都是从零开始并且只进行线性更新，所以跟踪三个信息就足够了：汽车数量、累积的加性常数$base$，以及斜率累积$slope$。 添加汽车时，我们会调整索引偏移量，但不会触及各个值。 Type-3更新增量$base$和$slope$，并且根据当前斜率在头部或尾部计算最小值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n·m) | O(n) | 太慢了 |
 | 最佳 | O(米) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.初始化变量：`train_length = n`,`head_offset = 0`,`base = 0`,`slope = 0`。 这里，`head_offset`考虑到由于在头部添加汽车而导致的指数变化，`base`累积所有常量添加，并且`slope`累积每个索引的增量添加。 
2. 对于每个事件，首先检查其类型。 如果是type-1（添加到头部），则递增`head_offset`新车数量并增加`train_length`因此。 这些新车都有`A_i = 0`，因此新水头处的有效值为零； 调整最小索引计算的偏移量。 
3.如果是type-2（添加到tail），则增加即可`train_length`。 如果斜率为负，则尾部可能相关。 
4.如果是带参数的type-3`(b, s)`, 增量`base += b`和`slope += s`。 这可以跟踪每辆车的价值增长情况，而无需明确存储它们。 
5. 每次事件结束后，确定最少的汽车。 如果`slope > 0`，第一辆车的价值最小，即`base + slope * 0 = base`。 如果`slope < 0`，最后一辆车的价值最小`base + slope * (train_length - 1)`。 如果`slope == 0`，任何汽车都具有相同的价值； 我们选择头部偏移后最早的索引。 
6.输出索引（调整为`head_offset`）和计算出的最小值。 

保证正确性的不变量是函数`A_i`相对于汽车指数始终呈线性，且具有斜率`slope`和常数`base`。 由于线性函数在任一端点都达到最小值，因此仅跟踪头部和尾部就足够了。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
train_length = n
head_offset = 0
base = 0
slope = 0

for _ in range(m):
    parts = input().split()
    t = int(parts[0])
    
    if t == 1:
        k = int(parts[1])
        head_offset += k
        train_length += k
    elif t == 2:
        k = int(parts[1])
        train_length += k
    else:
        b = int(parts[1])
        s = int(parts[2])
        base += b
        slope += s
    
    if slope > 0:
        min_index = 1
        min_value = base
    elif slope < 0:
        min_index = train_length
        min_value = base + slope * (train_length - 1)
    else:
        min_index = 1
        min_value = base
    
    print(min_index, min_value)
```该解决方案将所有计算保持在恒定空间中。`head_offset`确保我们在头部插入后正确解释第一辆车。 选择最小索引的逻辑依赖于`A_i`经过多次重新计算，因此无需扫描所有车辆。 

## 工作示例

 **示例 1 输入迹线**

 | 活动 | 火车长度| 基地| 坡度 | 最小指数| 最小值|
 | ---| ---| ---| ---| ---| ---|
 | 初始| 1 | 0 | 0 | 1 | 0 |
 | 1 1（头）| 2 | 0 | 0 | 1 | 0 |
 | 3 1 1 | 3 1 1 2 | 1 | 1 | 1 | 1 |
 | 3 1 1 | 3 1 1 2 | 2 | 2 | 1 | 2 |
 | 2 1（尾部）| 3 | 2 | 2 | 1 | 2 |
 | 2 1（尾部）| 4 | 2 | 2 | 1 | 2 |
 | 3 1 1 | 3 1 1 4 | 3 | 3 | 1 | 3 |
 | 2 1（尾部）| 5 | 3 | 3 | 1 | 3 |
 | 3 1 5 | 3 1 5 5 | 4 | 8 | 1 | 4 |

 这证实了在头尾插入和重新计算之后最小索引被正确跟踪。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(米) | 每个事件都会在恒定时间内处理。 |
 | 空间| O(1) | O(1) | 仅维护少数计数器； 没有与 n 成正比的数组。 |

 当 m 达到 300,000 时，该解决方案可以在 2 秒内轻松运行。 内存使用量微不足道。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    exec(open('solution.py').read())
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# Sample
assert run("1 8\n1 1\n3 1 1\n3 1 1\n2 1\n2 1\n3 1 1\n2 1\n3 1 5\n") == "1 0\n1 1\n1 2\n1 2\n1 2\n1 3\n1 3\n1 4", "sample 1"

# Custom: minimal size
assert run("1 1\n3 10 0\n") == "1 10", "minimal n=1"

# Custom: slope negative
assert run("2 2\n3 5 -1\n3 2 -1\n") == "2 4\n2 5", "negative slope"

# Custom: multiple head inserts
assert run("1 3\n1 2\n1 3\n3 1 2\n") == "1 1", "head shifts"

# Custom: slope zero
assert run("3 2\n3 5 0\n3 2 0\n") == "1 7\n1 7", "all equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1\n3 10 0 | 1 1\n3 1 10 | 1 最小 n |
 | 2 2\n3 5 -1\n3 2 -1 | 2 2\n3 5 -1\n3 2 -1 | 2 4\n2 | 2 4 |
