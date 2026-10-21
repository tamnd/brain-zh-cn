---
title: "CF 1143A - 门"
description: "该问题可以重述如下。 布莱克先生的房子有两扇门，每扇门通向一个单独的出口：左门和右门。 每扇门最初都是关闭的，我们知道布莱克先生打开它们的确切顺序。"
date: "2026-06-12T03:35:26+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1143
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 549 (Div. 2)"
rating: 800
weight: 1143
solve_time_s: 71
verified: true
draft: false
---

[CF 1143A - 门](https://codeforces.com/problemset/problem/1143/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题可以重述如下。 布莱克先生的房子有两扇门，每扇门通向一个单独的出口：左门和右门。 每扇门最初都是关闭的，我们知道布莱克先生打开它们的确切顺序。 一旦至少一个出口的所有门都打开，他就可以离开房子。 任务是在可能的情况下找到序列中的最早点。 

输入由一个整数组成`n`代表门的总数，后面跟着一个列表`n`整数，其中每个整数是`0`如果门属于左侧出口，或者`1`如果属于右侧出口。 我们需要确定该序列中打开其中一个出口的所有门的最小前缀。 输出是这个前缀长度`k`。 

约束允许最多`n = 200,000`门。 这排除了任何具有二次时间复杂度的方法，因为`n^2`运算量将达到400亿，远远超过1秒的时间限制。 线性或近线性解是可行的。 要考虑的主要边缘情况是一个出口只有一扇门时； 如果那扇门最后打开，天真的前缀检查方法可能会错误地报告第一个退出机会。 

一个小但说明性的例子是`n = 3`有顺序`1 0 0`。 左出口有两扇门，右出口有一扇门。 打开第一扇门（右侧出口）后，布莱克先生已经可以离开，所以正确的输出是`1`。 仅计算打开的门总数或首先从左侧出口进行扫描的粗心方法可能会错误地产生`3`。 

## 方法

 暴力法很简单：对于序列的每个前缀，检查左出口的所有门是否打开或右出口的所有门是否打开。 为了实现这一点，我们将维护两组：一组用于左侧出口保持关闭的门，一组用于右侧出口。 对于每扇打开的门，将其从相应的组中取出。 一旦任一集合变空，就输出当前索引。 这是正确的，但是构建集合并在每一步检查空性大约涉及`O(n)`每个前缀的操作，给出`O(n^2)`全部的。 和`n`达到20万，这个方法太慢了。 

最佳方法依赖于计数。 首先，我们计算有多少扇门属于左侧出口，有多少扇门属于右侧出口。 然后，当我们迭代序列时，我们维护每个出口打开的门的计数器。 当任一计数器达到该出口的门总数时，我们就知道该出口中的所有门都打开，并且我们可以立即返回当前位置作为答案。 这在线性时间内有效`O(n)`因为每扇门都只被处理一次，并且只需要为柜台提供恒定的额外空间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.初始化两个变量`left_total`和`right_total`计算每个出口的门数。 迭代输入一次以填充这些计数。 这是了解出口中所有门都打开时的目标计数所必需的。 
2.初始化两个计数器`left_opened`和`right_opened`为零。 这些将跟踪到目前为止每个出口已打开的门数。 
3. 使用单遍迭代门序列。 对于每扇门，增加相应的计数器（`left_opened`对于一个`0`和`right_opened`对于一个`1`）。 
4. 更新计数器后，检查它是否等于该出口的门总数（`left_opened == left_total`或者`right_opened == right_total`）。 该条件第一次成立时，输出当前索引（从 1 开始）并终止。 
5. 由于问题保证每扇门最终都会打开，因此我们保证在到达序列末尾之前找到解决方案。 

为什么它有效：在每一步，`left_opened`和`right_opened`准确地表示每个出口当前打开的门的数量。 一旦其中之一与该出口中的门总数匹配，则意味着该出口中的所有门都打开，满足出口条件。 因为我们在第一次出现时立即返回，所以我们保证找到最小的`k`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
doors = list(map(int, input().split()))

left_total = doors.count(0)
right_total = n - left_total

left_opened = 0
right_opened = 0

for i, door in enumerate(doors, start=1):
    if door == 0:
        left_opened += 1
    else:
        right_opened += 1
    if left_opened == left_total or right_opened == right_total:
        print(i)
        break
```该解决方案首先计算每个出口属于多少扇门。 当我们迭代序列时，打开的门的计数器就会更新。 这`enumerate`函数与`start=1`以匹配所需的基于 1 的输出。 条件检查确保立即返回出口完全打开的第一时刻。 使用`doors.count(0)`是一个简单的线性传递，与主循环相比可以忽略不计，保持整体复杂度呈线性。 通过基于 1 的索引可以避免差一错误`enumerate`。 

## 工作示例

 样本1：`5`， 顺序`0 0 1 0 0`。 

| 我| 门| 左开| 右打开| 状况 |
 | ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | 0 | 假 |
 | 2 | 0 | 2 | 0 | 假 |
 | 3 | 1 | 2 | 1 | 真实 |

 打开第三扇门后，右侧出口的所有门（仅一扇门）都打开，因此输出为`3`。 

样本2：`6`， 顺序`1 0 1 0 0 1`。 

| 我| 门| 左开| 右打开| 状况 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 1 | 假 |
 | 2 | 0 | 1 | 1 | 假 |
 | 3 | 1 | 1 | 2 | 假 |
 | 4 | 0 | 2 | 2 | 假 |
 | 5 | 0 | 3 | 2 | 真实 |

 第五扇门之后所有左边的门（总共 3 扇）都打开，所以答案是`5`。 此跟踪确认算法正确跟踪计数器并识别最小前缀。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 计算门数和遍历序列都是线性的`n`|
 | 空间| O(1) | O(1) | 仅使用四个整数计数器，独立于`n`|

 该算法可以在不到一秒的时间内轻松处理 200,000 个门的最大输入大小。 与 256 MB 限制相比，内存使用量微不足道。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    doors = list(map(int, input().split()))
    left_total = doors.count(0)
    right_total = n - left_total
    left_opened = right_opened = 0
    for i, door in enumerate(doors, start=1):
        if door == 0:
            left_opened += 1
        else:
            right_opened += 1
        if left_opened == left_total or right_opened == right_total:
            return str(i)

# provided samples
assert run("5\n0 0 1 0 0\n") == "3", "sample 1"
assert run("6\n1 0 1 0 0 1\n") == "5", "sample 2"

# custom cases
assert run("2\n0 1\n") == "1", "minimum size, either door first opens an exit"
assert run("4\n1 1 0 0\n") == "2", "first exit fully opened immediately"
assert run("5\n0 0 0 1 1\n") == "3", "left exit completes before right"
assert run("5\n1 1 1 0 0\n") == "3", "right exit completes before left"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2\n0 1 | 2 1 | 最少数量的门，立即出口 |
 | 4\n1 1 0 0 | 4\n1 1 0 0 2 | 第一个出口按顺序提前结束 |
 | 5\n0 0 0 1 1 | 5\n0 0 0 1 1 | 3 | 左出口先完成，右出口未完成 |
 | 5\n1 1 1 0 0 | 5\n1 1 1 0 0 3 | 右出口先完成，左出口未完成 |

 ## 边缘情况

 对于单门出口，一旦门打开，算法就会立即检测到出口。 输入`2\n0 1\n`显示打开第一扇门（右侧出口）允许布莱克先生离开，即使左侧出口仍然存在
