---
title: "CF 44B - 可乐"
description: "我们被要求确定冬季学校的组织者可以通过多少种方式使用有限供应的三种尺寸的瓶子（0.5 升、1 升和 2 升）恰好购买 n 升可乐。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 44
codeforces_index: "B"
codeforces_contest_name: "School Team Contest 2 (Winter Computer School 2010/11)"
rating: 1500
weight: 44
solve_time_s: 69
verified: true
draft: false
---

[CF 44B - 可乐](https://codeforces.com/problemset/problem/44/B)

 **评分：** 1500
 **标签：** 实施
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定冬季学校的组织者可以通过多少种方式准确购买`n`升可乐，使用有限供应的三种尺寸瓶子：0.5 升、1 升和 2 升。 输入`a`,`b`， 和`c`分别表示每种尺寸的可用瓶子数量。 任务是计算瓶子数量的不同组合，使总体积恰好等于`n`升。 如果两种组合使用至少一种尺寸的不同数量的瓶子，则它们被视为不同。 

限制是适度的，但需要一些注意。 所需总体积`n`最多可达10000个，每种瓶子最多可达5000个。 直接尝试所有可能的组合的简单暴力方法将涉及最多`a * b * c`迭代。 在最坏的情况下，`5000 * 5000 * 5000`是 1250 亿次迭代，这对于 2 秒的时间限制显然是不可行的。 

当某些瓶子类型不足以满足总体积或没有必要时，就会出现不明显的边缘情况。 例如，如果`n = 1`和`a = 0, b = 0, c = 1`，仅使用 2 升的瓶子不可能精确地获得 1 升，因此正确的输出为 0。另一种微妙的情况发生在`n`很小，但可以使用更大的瓶子：如果`n = 1`和`a = 2, b = 0, c = 1`，该解决方案必须使用两个 0.5 升的瓶子，而不是 2 升的瓶子，如果总是优先考虑较大的瓶子，那么天真的实现可能会忽略这一点。 

## 方法

 最直接的方法是蛮力：尝试从 0 到 0.5 升瓶子的每一个计数`a`，每个 1 升瓶子的数量从 0 到`b`，以及从 0 到 2 升瓶子的每个计数`c`。 对于每个组合，计算总体积。 如果它等于`n`，增加一个计数器。 这是有效的，因为它详尽地检查了每一种可能性。 然而，迭代次数最多可达`5000 * 5000 * 5000 = 125,000,000,000`在最坏的情况下，远远超出 2 秒窗口内可行的范围。 

降低复杂性的关键是要注意 0.5 升和 1 升瓶子贡献的体积是线性的，我们可以计算所需的 2 升瓶子的确切数量，而不是迭代所有可能性。 更具体地说，选择后`x`半升和`y`一升瓶，剩余体积达到`n`升可表示为`n - (0.5 * x + 1 * y)`。 如果这个剩余体积是非负的并且可以被2整除，并且需要的2升瓶子的数量不超过`c`，则该组合有效。 这将 0.5 升和 1 升瓶子的三重嵌套循环减少为双循环，使该解决方案变得可行。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(a * b * c) | O(1) | O(1) | 太慢了|
 | 优化的 2D 循环 | O(a * b) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.初始化一个计数器`count`到 0。这将跟踪有效组合的数量。 
2.循环`half`从 0 到`a`，代表使用的 0.5 升瓶子的数量。 每次迭代代表半升瓶子的候选数量。 
3.循环`one`从 0 到`b`，代表使用的 1 升瓶子的数量。 
4. 计算所选半升和 1 升瓶子贡献的当前体积：`current_volume = 0.5 * half + 1 * one`。 
5. 计算剩余体积达到`n`：`remaining_volume = n - current_volume`。 如果该值为负数，则跳至内部循环的下一次迭代，因为使用更多瓶子将超出`n`。 
6. 检查是否`remaining_volume`可以被 2 整除，因为每个 2 升的瓶子正好提供 2 升。 如果不是，则继续下一次迭代。 
7. 计算所需 2 升瓶子的数量：`two_needed = remaining_volume / 2`。 如果`two_needed`超过`c`，跳过这个组合。 
8. 如果满足所有条件，则递增`count`。 
9. 两个循环完成后，打印`count`。 

工作原理：循环迭代半升和 1 升瓶子的所有可行计数。 对于每个选择，我们都会计算能够完成准确目标体积的 2 升瓶子的唯一数量。 这些条件确保该数字是非负整数，并且不超过可用供应量。 不会跳过任何有效组合，也不计算无效组合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, a, b, c = map(int, input().split())

count = 0
for half in range(a + 1):
    for one in range(b + 1):
        current_volume = 0.5 * half + 1 * one
        remaining_volume = n - current_volume
        if remaining_volume < 0:
            continue
        if remaining_volume % 2 != 0:
            continue
        two_needed = int(remaining_volume // 2)
        if two_needed <= c:
            count += 1

print(count)
```该代码直接实现了所描述的双循环。 我们仔细计算`remaining_volume`并检查可分性以确保仅考虑 2 升瓶子的有效计数。 使用`remaining_volume // 2`保证整数值`two_needed`。 循环范围包括使用的可用瓶子数量`range(a + 1)`和`range(b + 1)`当取零瓶时盖上箱子。 

## 工作示例

 **示例1**

 输入：`10 5 5 5`| 一半| 一| 当前音量 | 剩余体积 | 需要两个 | 有效的？ |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 0.0 | 0.0 10.0 | 5 | 是的 |
 | 0 | 1 | 1.0 | 9.0 | 4.5 | 4.5 没有|
 | 0 | 2 | 2.0 | 8.0 | 4 | 是的 |
 | ... | ... | ... | ... | ... | ... |

 这一直持续到所有组合`half`和`one`被测试。 仅计算 2 升瓶子总数≤ 5 的组合。 最终计数为9。 

**示例2**

 输入：`1 0 1 1`| 一半| 一| 当前音量 | 剩余体积 | 需要两个 | 有效的？ |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 0 | 1 | 0.5 | 0.5 没有|
 | 0 | 1 | 1 | 0 | 0 | 是的 |

 仅存在一种有效组合：一瓶 1 升的瓶子。 输出为1。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(a * b) | 我们循环计算 0.5 升和 1 升瓶子的所有计数； a 和 b ≤ 5000，因此最坏情况下需要 2500 万次迭代。 每次迭代都是常数时间。 |
 | 空间| O(1) | O(1) | 仅使用计数器和循环变量。 没有与输入大小成正比的额外内存。 |

 该解决方案完全在时间和内存限制之内。 2 秒内可以轻松执行 2500 万次迭代。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, a, b, c = map(int, input().split())
    count = 0
    for half in range(a + 1):
        for one in range(b + 1):
            current_volume = 0.5 * half + 1 * one
            remaining_volume = n - current_volume
            if remaining_volume < 0:
                continue
            if remaining_volume % 2 != 0:
                continue
            two_needed = int(remaining_volume // 2)
            if two_needed <= c:
                count += 1
    return str(count)

# provided sample
assert run("10 5 5 5\n") == "9", "sample 1"

# custom tests
assert run("1 0 1 1\n") == "1", "minimum 1-liter"
assert run("1 2 0 1\n") == "1", "using two 0.5-liter bottles"
assert run("5 0 0 3\n") == "0", "impossible to reach 5 with 2-liter bottles"
assert run("4 5 5 0\n") == "3", "combination of 0.5 and 1-liter bottles"
assert run("0 0 0 0\n") == "1", "0 liters, no bottles, exactly 0 ways"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 0 1 1 | 1 0 1 1 1 | 最少 1 升 |
