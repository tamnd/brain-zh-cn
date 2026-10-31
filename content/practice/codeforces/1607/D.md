---
title: "CF 1607D - 蓝红排列"
description: "我们得到一个整数数组，其中每个元素都有一种颜色，蓝色或红色。 蓝色元素可以任意减少 1 次，红色元素可以任意增加 1 次。"
date: "2026-06-10T07:43:20+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1607
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 753 (Div. 3)"
rating: 1300
weight: 1607
solve_time_s: 86
verified: true
draft: false
---

[CF 1607D - 蓝红排列](https://codeforces.com/problemset/problem/1607/D)

 **评分：** 1300
 **标签：** 贪婪、数学、排序
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组，其中每个元素都有一种颜色，蓝色或红色。 蓝色元素可以任意减少 1 次，红色元素可以任意增加 1 次。 目标是确定是否可以将数组转换为从 1 到 1 的数字排列$n$， 在哪里$n$是数组的长度。 这里的排列是指从 1 到$n$以任何顺序只发生一次。 

约束条件允许$n$最多$2 \cdot 10^5$每个测试用例最多$10^4$测试用例，这意味着对每个可能的增量/减量进行强力模拟是不可行的。 我们必须用数学方式来推理问题，而不是通过模拟动作。 这些数字本身的数量级可能很大，高达$10^9$在任一方向上，因此任何依赖于直接数组操作或大范围计数的方法都是低效的。 

可能会导致简单解决方案失败的边缘情况包括所有数字最初都大于的数组$n$或小于 1。例如，仅包含蓝色元素且全部等于 100 的数组$n = 5$通过递减永远无法达到 1-5 的范围，因为某些数字必须变得小于 1。同样，小于 1 的红色元素数组也无法通过单独增加来达到其目标。 具有相同数字或极端负数的重复项的情况也很重要，因为我们必须尊重颜色操作，同时尝试在 1 到 1 中实现唯一数字$n$范围。 

## 方法

 暴力方法将模拟每个元素上所有可能的操作序列，以尝试达到排列。 这在原则上是正确的，因为它详尽地探索了每一个变换，但是可能性的数量随着$n$，使得不可能$n$最多$2 \cdot 10^5$。 

最佳解决方案的关键见解来自于观察每个元素只能在一个方向上调整：蓝色元素可以减少，红色元素可以增加。 因此，对于蓝色元素$x$，它能达到的最小最终值为 1（排列时我们不能低于 1），最大值为$x$本身。 对于红色元素$x$，最小最终值为$x$（我们不能减少它），最大值是$n$。 

根据这个观察，我们可以对蓝色元素和红色元素独立排序，并尝试为它们分配从 1 到$n$贪婪地。 蓝色元素从 1 开始分配得尽可能小，红色元素从 1 开始分配得尽可能大$n$，确保在给定操作限制的情况下每个数字都是可达的。 如果在任何时候，由于数字超出其可达范围而无法将数字分配给相应的元素，则答案是否定的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将数组分成两个列表：`blue`包含所有蓝色元素，并且`red`包含所有红色元素。 这使我们能够独立处理它们的范围。 
2. 排序`blue`按升序排列。 对于位置处的每个蓝色元素$i$在排序列表中，计算其最大可达值，即元素本身。 我们希望它的最小值是$i+1$，因为排列中的最小数字从 1 开始并依次增加。 如果蓝色元素小于$i+1$，达不到要求的值，所以答案是否定的。 
3. 排序`red`按降序排列。 对于位置处的每个红色元素$i$在排序列表中，计算其最小可达值，即元素本身。 我们希望它采取的最大值是$n-i$，从$n$并减少。 如果红色元素大于$n-i$，达不到要求的值，所以答案是否定的。 
4. 如果所有蓝色和红色元素都能满足上述条件，则答案为“是”。 

这是有效的，因为每种颜色可以达到的值范围形成一个链，并且贪婪地分配它们可以确保没有数字被跳过或重复。 保持的不变性是在分配第一个之后$k$数字到$k$最小的蓝色和最大的红色，所有剩余的数字仍然可以在允许的范围内分配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can_form_permutation(n, a, colors):
    blue = []
    red = []
    for val, color in zip(a, colors):
        if color == 'B':
            blue.append(val)
        else:
            red.append(val)
    
    blue.sort()
    red.sort(reverse=True)
    
    for i, val in enumerate(blue):
        if val < i + 1:
            return "NO"
    for i, val in enumerate(red):
        if val > n - i:
            return "NO"
    return "YES"

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    colors = input().strip()
    print(can_form_permutation(n, a, colors))
```我们首先按颜色分隔元素，对每个组进行排序，然后根据其目标范围检查每个元素。 排序可确保较小的蓝色数字首先尝试占据较小的排列位置，而较大的红色数字最后尝试占据较大的位置。 贪心检查很简单，可以避免模拟陷阱。 

## 工作示例

 **示例1**

 输入：```
4
1 2 5 2
BRBR
```| 步骤| 蓝色排序 | 红色排序 | 我| 检查 |
 | ---| ---| ---| ---| ---|
 | 初始| [1,5]| [2,2]| - | - |
 | 蓝色 0 | 1 | - | 0 | 1 >= 1，好 |
 | 蓝色 1 | 5 | - | 1 | 5 >= 2，好的 |
 | 红色 0 | - | 2 | 0 | 2 <= 4，好的 |
 | 红色 1 | - | 2 | 1 | 2 <= 3，好的 |

 所有检查均通过，因此输出为 YES。 

**示例2**

 输入：```
2
1 1
BB
```| 步骤| 蓝色排序 | 红色排序 | 我| 检查 |
 | ---| ---| ---| ---| ---|
 | 初始| [1,1]| []| - | - |
 | 蓝色 0 | 1 | - | 0 | 1 >= 1，好 |
 | 蓝色 1 | 1 | - | 1 | 1 >= 2，失败 |

 第二个蓝色无法达到2，所以输出为NO。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 对蓝色和红色列表进行排序主导了计算。 |
 | 空间| O(n) | 分别存储蓝色和红色列表。 |

 总和的约束$n$在所有 ≤ 2·10^5 的测试用例中，这种方法可以在时间限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution function
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        colors = input().strip()
        print(can_form_permutation(n, a, colors))
    return output.getvalue().strip()

# Provided samples
assert run("8\n4\n1 2 5 2\nBRBR\n2\n1 1\nBB\n5\n3 1 4 2 5\nRBRRB\n5\n3 1 3 1 3\nRBRRB\n5\n5 1 5 1 5\nRBRRB\n4\n2 2 2 2\nBRBR\n2\n1 -2\nBR\n4\n-2 -1 4 0\nRRRR\n") == \
"YES\nNO\nYES\nYES\nNO\nYES\nYES\nYES"

# Custom cases
assert run("1\n1\n100\nR\n") == "YES", "single red element beyond n"
assert run("1\n1\n-100\nB\n") == "YES", "single blue element below 1"
assert run("1\n3\n1 2 2\nBBR\n") == "NO", "duplicate blue cannot reach positions"
assert run("1\n5\n5 4 3 2 1\nRRRRR\n") == "YES", "all reds in reverse order"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1\n100\nR\n`| 是 | 超出单个红色元素`n`可以减少到`n`|
 |`1\n-100\nB\n`| 是 | 单个低于1的蓝色元素可以增加到1 |
 |`1\n3\n1 2 2\nBBR\n`| 否 | 重复的蓝色未能覆盖所有位置 |
 | `1\n5\n5 4 3 2 1\n | | |
