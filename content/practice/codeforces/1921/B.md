---
title: "CF 1921B - 安排猫"
description: "任务是使用最少的操作将盒子中猫的初始排列转换为目标排列。 每个盒子要么包含一只猫，要么为空，初始状态由二进制字符串 s 给出，而目标状态由二进制字符串 f 给出。"
date: "2026-06-08T19:22:03+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1921
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 920 (Div. 3)"
rating: 800
weight: 1921
solve_time_s: 123
verified: true
draft: false
---

[CF 1921B - 排列猫](https://codeforces.com/problemset/problem/1921/B)

 **评分：** 800
 **标签：** 贪心，实现
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是使用最少的操作将盒子中猫的初始排列转换为目标排列。 每个盒子要么包含一只猫，要么为空，初始状态由二进制字符串给出`s`，而目标状态由二进制字符串给出`f`。 操作包括将一只新猫放入空盒子中，从已装满的盒子中取出一只猫，或将一只猫从一个盒子移动到另一个盒子。 每个操作需要一天的时间，因此目标是尽量减少所需的天数。 

约束条件允许`n`达到`10^5`在单个测试用例中，以及总和`n`所有测试用例也达到`10^5`。 这意味着任何解都必须是线性的`n`每个测试用例。 尝试逐个模拟移动猫的二次方法会太慢。 

当初始和最终安排具有相同数量的猫时，当所有盒子最初为空或满时，或者当移动可以直接取代移除和添加时，就会出现边缘情况。 例如，改造`s = 10010`到`f = 00001`需要将一只猫从第一个盒子移动到第五个盒子，并移除第四个盒子中多余的猫，从而产生两次操作。 将移动视为独立的添加和删除的幼稚方法可能会多算。 

## 方法

 暴力解决方案将通过重复查找要移动的猫或要填充或清空的盒子来模拟该过程，并显式地跟踪操作。 这可以正常工作，但速度太慢，最多`O(n^2)`在最坏的情况下。 

更好的方法是用简单的计数策略来处理问题。 对于每个位置，判断是否需要添加一只猫（`f[i] = 1, s[i] = 0`）或删除（`f[i] = 0, s[i] = 1`）。 让`add_count`是需要一只猫的位置数量，`remove_count`是需要移除的位置的数量。 猫可以从需要移除的盒子转移到需要添加的盒子，从而减少单独操作的数量。 因此，最小天数是最大天数`add_count`和`remove_count`，因为每次移动都会同时计算添加和删除猫的数量。 这一观察将问题简化为`O(n)`每个测试用例。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(n²) | O(n) | 太慢了 |
 | 计数 + 最大添加和删除 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.初始化计数器`add_count`和`remove_count`为零。 这些将分别跟踪需要添加或删除多少只猫的盒子。 
2. 迭代每个位置`i`从 0 到`n-1`。 
3.如果`s[i] = 0`和`f[i] = 1`, 增量`add_count`。 这表明这里必须添加一只猫。 
4. 如果`s[i] = 1`和`f[i] = 0`, 增量`remove_count`。 这表明必须将猫从这里移走。 
5. 处理完所有仓位后，所需最少天数为`max(add_count, remove_count)`。 移动可以同时满足加法和删除，因此最大值算真正的最小值。 
6. 输出该值。 

为什么有效：每个无法配对的添加或删除都必须单独处理。 每个移动操作都会同时处理一次添加和一次删除，因此两个计数的最大值可以正确捕获所需的总天数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    s = input().strip()
    f = input().strip()
    add_count = 0
    remove_count = 0
    for i in range(n):
        if s[i] == '0' and f[i] == '1':
            add_count += 1
        elif s[i] == '1' and f[i] == '0':
            remove_count += 1
    print(max(add_count, remove_count))
```该解决方案使用有效地读取输入`sys.stdin.readline`并对每个字符串精确地迭代一次。 使用`max(add_count, remove_count)`正确地解释了可以同时执行添加和删除的动作，这是粗心的实现可能会忽略的微妙点。 

## 工作示例

 输入样本`s = 10010`,`f = 00001`:

 | 我| s[i] | f[i] | f[i] 添加计数 | 删除计数 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 0 | 0 | 1 |
 | 1 | 0 | 0 | 0 | 1 |
 | 2 | 0 | 0 | 0 | 1 |
 | 3 | 1 | 0 | 0 | 2 |
 | 4 | 0 | 1 | 1 | 2 |`max(add_count, remove_count) = max(1, 2) = 2`，与预期输出匹配。 

为了`s = 000`,`f = 111`:

 | 我| s[i] | f[i] | f[i] 添加计数 | 删除计数 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 1 | 1 | 0 |
 | 1 | 0 | 1 | 2 | 0 |
 | 2 | 0 | 1 | 3 | 0 |`max(add_count, remove_count) = max(3, 0) = 3`，根据需要。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 我们遍历每个位置一次来计算添加和删除的数量。 |
 | 空间| O(1) | O(1) | 每个测试用例仅使用两个整数计数器，不需要额外的数据结构。 |

 每个测试用例的线性复杂度确保即使高达`10^5`总计，程序在 2 秒的时间限制下高效运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n = int(input())
        s = input().strip()
        f = input().strip()
        add_count = 0
        remove_count = 0
        for i in range(n):
            if s[i] == '0' and f[i] == '1':
                add_count += 1
            elif s[i] == '1' and f[i] == '0':
                remove_count += 1
        output.append(str(max(add_count, remove_count)))
    return "\n".join(output)

# provided samples
assert run("6\n5\n10010\n00001\n1\n1\n1\n3\n000\n111\n4\n0101\n1010\n3\n100\n101\n8\n10011001\n11111110\n") == "2\n0\n3\n2\n1\n4"

# custom cases
assert run("2\n1\n0\n1\n1\n1\n0\n") == "1\n1", "single box add/remove"
assert run("2\n3\n111\n111\n3\n000\n000\n") == "0\n0", "no operations needed"
assert run("1\n5\n10101\n01010\n") == "3", "alternating positions"
assert run("1\n4\n0000\n1111\n") == "4", "all additions"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1\n0\n1 | 1\n0\n1 1 | 单盒，需加猫|
 | 1\n1\n0 | 1\n1\n0 | 1 | 单盒，需要取出一只猫|
 | 3\n111\n111 | 3 0 | 无需任何操作|
 | 5\n10101\n01010 | 3 | 交替移动需要配对添加和删除 |
 | 4\n0000\n1111 | 4 | 所有添加都必须执行 |

 ## 边缘情况

 当所有框最初都与目标匹配时，`add_count = remove_count = 0`，因此输出为 0。当所有框都为空并且必须全部填充时，`remove_count = 0`，最大值就是`add_count`。 当添加和删除的数量相等时，移动可以将它们最佳配对，因此输出正是这个计数，如交替位置测试用例所示。 这证实了该算法可以正确处理极端情况和混合情况。
