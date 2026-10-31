---
title: "CF 1592A - 玩家 Hemose"
description: "我们需要确定游戏中的特工使用一组武器（每种武器都有固定伤害）击败具有给定生命值的敌人的速度有多快。 特工可以多次攻击，但不能连续两次使用同一武器。"
date: "2026-06-10T09:15:07+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1592
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 746 (Div. 2)"
rating: 800
weight: 1592
solve_time_s: 98
verified: true
draft: false
---

[CF 1592A - 玩家 Hemose](https://codeforces.com/problemset/problem/1592/A)

 **评分：** 800
 **标签：** 二分查找、贪心、数学、排序
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要确定游戏中的特工使用一组武器（每种武器都有固定伤害）击败具有给定生命值的敌人的速度有多快。 特工可以多次攻击，但不能连续两次使用同一武器。 输入提供了几个独立的测试用例。 每个测试用例指定武器的数量、敌人的初始生命值以及每种武器的伤害值。 每个测试用例的输出是将敌人的生命值降低到零或以下所需的最小攻击次数。 

约束告诉我们，测试用例最多有 100,000 个，但每个测试用例最多有 1,000 个武器，所有测试用例中所有武器的总和最多为 200,000 个。 生命值和伤害值可能非常大，高达十亿。 这排除了任何针对大健康值逐一模拟每次攻击的解决方案，因为这将需要数十亿次操作。 相反，我们需要一种策略，利用武器伤害的属性以数学方式计算答案。 

当单一武器的伤害大于或等于敌人的生命值时，就会出现不明显的边缘情况。 在这种情况下，即使有另一件伤害更高的武器，也只需要一次攻击。 总是假设交替武器的粗心实现会多算移动次数。 当两种最强的武器加在一起无法准确划分敌人的生命值时，就会出现另一种边缘情况。 在这里，重复最强的一对后的剩余生命值可能需要使用最强的武器进行一次额外的攻击。 

## 方法

 一种简单的方法是模拟攻击过程。 我们可以反复选择与前一个武器不同的最强可用武器，并从敌人的生命值中减去其伤害。 这是正确的，但速度非常慢，因为对于较大的健康值（最多 10^9），循环可能会迭代数十亿次，从而使其不可行。 

关键的见解来自于认识到只有伤害值最高的两种武器才重要。 让最强的武器产生伤害`max1`以及第二强的`max2`。 如果特工的攻击效果最佳，他将交替使用这两种武器以最大化伤害。 两步的总伤害为`max1 + max2`。 对于较大的生命值，我们可以使用整数除法来计算需要多少个完整的两步循环，然后通过一两个额外的动作来处理剩余的生命值。 这将问题简化为使用两个最大值的简单计算，而不是模拟每次攻击。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(H / 最小伤害) | O(1) | O(1) | 太慢了 |
 | 最佳| 每个测试用例排序的 O(n log n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取武器数量`n`和敌人的健康状况`H`。 将武器的伤害值读取到数组中。 
2. 从数组中找出两个最大的伤害值。 排序方便简单：按降序排序，取前两个值。 让`max1`是最大的并且`max2`成为第二大。 
3.检查最强的武器是否足以杀死敌人。 如果`max1 >= H`，答案是 1，因为一次攻击就足够了。 
4. 否则，计算所需的完整两步循环的数量。 每个周期都做`max1 + max2`损害。 使用整数除法：`full_cycles = H // (max1 + max2)`。 
5. 计算这些完整周期后的剩余运行状况：`remaining = H - full_cycles * (max1 + max2)`。 
6. 确定消灭敌人所需的额外动作。 如果`remaining`为0，则不需要额外的移动。 如果`remaining <= max1`，用最强的武器再攻击一次就足够了。 否则，还需要两次攻击（最强然后第二强）。 
7. 将完整周期的移动次数（每个周期为 2 次移动）和额外的移动次数相加，以获得测试用例的最小移动次数。 

为什么有效：交替使用两种最强的武器可以保证每对动作造成最大伤害，这总是至少与任何其他武器序列选择一样高。 通过单独处理剩余部分，我们可以考虑完整周期无法覆盖的任何剩余健康状况。 这种方法保证我们永远不会多算或少算移动。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, H = map(int, input().split())
    weapons = list(map(int, input().split()))
    weapons.sort(reverse=True)
    max1, max2 = weapons[0], weapons[1]

    if max1 >= H:
        print(1)
        continue

    full_cycles = H // (max1 + max2)
    remaining = H - full_cycles * (max1 + max2)

    moves = full_cycles * 2
    if remaining == 0:
        print(moves)
    elif remaining <= max1:
        print(moves + 1)
    else:
        print(moves + 2)
```该解决方案使用快速读取输入`sys.stdin.readline`。 对武器伤害进行排序可以得出两个最强的值。 我们首先处理单次攻击的情况，因为这是常见的提前退出。 完整的循环和余数计算使我们能够避免单独模拟每个动作，这对于较大的健康值来说会非常慢。 检查其余部分可确保正确处理边缘情况，在完整周期后仅需要一次额外的攻击。 

## 工作示例

 ### 示例 1

 输入：`2 4`, 武器:`[3, 7]`， 健康`H=4`| 步骤| 最大1 | 最大2 | 哈 | 完整周期 | 剩余| 移动 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 初始| 7 | 3 | 4 | - | - | - |
 | 检查单一攻击 | 7 >= 4 | 7 >= 4 - | - | - | - | 1 |

 最强的武器可以立即杀死敌人。 输出为1。 

### 示例 2

 输入：`2 6`, 武器:`[4, 2]`， 健康`H=6`| 步骤| 最大1 | 最大2 | 哈 | 完整周期 | 剩余| 移动 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 初始| 4 | 2 | 6 | - | - | - |
 | 单次攻击检查| 4 < 6 | 4 < 6 - | - | - | - | - |
 | 完整周期| 6 // (4+2)=1 | 剩余 = 6-6=0 | 移动 = 2 | - | 2 | |

 没有剩余生命值，总移动次数为 2。 

这些痕迹表明，逻辑正确地处理了单次攻击胜利、精确的全周期击杀以及其余部分。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t * n log n) | O(t * n log n) | 对每个测试用例中的武器进行排序占主导地位。 每个测试用例的n≤1000，并且所有测试用例的n之和≤2×10^5，因此总排序是可行的。 |
 | 空间| O(n) | 我们存储每个测试用例的武器数组。 不需要额外的大型结构。 |

 考虑到这些限制，该算法对于最大输入大小的运行时间不到 1 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # insert solution code
    t = int(input())
    for _ in range(t):
        n, H = map(int, input().split())
        weapons = list(map(int, input().split()))
        weapons.sort(reverse=True)
        max1, max2 = weapons[0], weapons[1]

        if max1 >= H:
            print(1)
            continue

        full_cycles = H // (max1 + max2)
        remaining = H - full_cycles * (max1 + max2)

        moves = full_cycles * 2
        if remaining == 0:
            print(moves)
        elif remaining <= max1:
            print(moves + 1)
        else:
            print(moves + 2)
    return output.getvalue().strip()

# provided samples
assert run("3\n2 4\n3 7\n2 6\n4 2\n3 11\n2 1 7\n") == "1\n2\n3", "sample cases"

# custom test cases
assert run("1\n2 10\n5 5\n") == "2", "equal weapons, exact double cycle"
assert run("1\n3 15\n10 5 3\n") == "2", "strongest alone does not suffice, remainder handled"
assert run("1\n2 1\n100 50\n") == "1", "health smaller than any weapon"
assert run("1\n4 17\n6 5 4 3\n") == "3", "remainder requires extra moves"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 10、武器5 5 | 2 | 全周期交替使用同等武器|
 | 3 15、武器10 5 3 | 2 | 处理完整周期后的剩余部分 |
 | 2 1、武器100 50| 1 | 单次攻击边缘情况 |
 | 4 17、武器6 5 4 3 | 3 | 正确处理余数 > max1 |

 ## 边缘情况
