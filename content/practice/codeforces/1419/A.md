---
title: "CF 1419A - 数字游戏"
description: "我们被要求模拟两个代理 Raze 和 Breach 之间的简单回合制数字游戏。 每个游戏都以一个由 $n$ 个数字组成的正整数开始。 数字从左到右编号，从 1 开始。"
date: "2026-06-11T06:43:05+07:00"
tags: ["codeforces", "competitive-programming", "games", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1419
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 671 (Div. 2)"
rating: 900
weight: 1419
solve_time_s: 73
verified: true
draft: false
---

[CF 1419A - 数字游戏](https://codeforces.com/problemset/problem/1419/A)

 **评分：** 900
 **标签：** 游戏、贪婪、实现
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟两个代理 Raze 和 Breach 之间的简单回合制数字游戏。 每个游戏都以一个正整数开始，其中包括$n$数字。 数字从左到右编号，从1开始。Raze只能标记奇数位置的数字，Breach只能标记偶数位置的数字。 他们交替标记数字，直到只剩下一个数字。 获胜者由最后一位数字的奇偶性决定：如果是奇数，Raze 获胜；如果是奇数，则 Raze 获胜。 如果是平局，则 Breach 获胜。 拉兹总是先行动。 输入包括$t$独立游戏，对于每场游戏我们必须打印谁获胜。 

限制条件适中。 每个号码最多可以有1000位数字，最多可以有100个游戏。 这排除了任何试图模拟每一圈标记数字的算法，因为这可能需要最多$n$每场比赛的操作数，这是可以接受的，但我们可以通过在不完全模拟的情况下推理最终数字来做得更好。 

边缘情况是指$n = 1$，这意味着只有一位数字并且无法移动。 在这种情况下，最后一位数字立即成为获胜者的决定因素。 例如，输入`1\n2`应该输出`2`因为个位数是偶数。 另一个微妙的情况是，当玩家可以访问的所有数字都具有错误的奇偶性时，迫使他们进入次优的标记序列。 尽早认识到这些场景使我们无需模拟每一步棋即可计算出获胜者。 

## 方法

 暴力方法将模拟每个回合：跟踪哪些数字未标记，让 Raze 和 Breach 交替标记有效数字，然后继续，直到剩下一个数字。 此时，我们检查其奇偶性。 这种方法是正确的，但它涉及到$O(n)$每场比赛的操作。 最多 100 个游戏，每个游戏有 1000 个数字，这会导致大约 100,000 次操作，这是可以接受的，但不是必需的。 它还需要仔细处理交替转弯和分度，这很容易出错。 

最佳方法源于观察最后一位数字是唯一重要的数字。 每个玩家总是试图将最后剩下的数字逼入他们的获胜平价。 因此，关键是检查最后移动的玩家是否至少有一位数字可以不标记他们的首选平价。 对于奇数长度的数字，Raze 在奇数位置最后移动，因此我们检查奇数位置是否有奇数数字。 如果是，Raze 可以确保最后一位数字是奇数。 否则，Breach 获胜。 类似地，对于偶数长度的数字，Breach 在偶数位置上最后移动，因此我们检查偶数位置中是否有偶数位。 这个推理允许直接$O(n)$每场比赛检查一次，扫描数字一次，无需模拟回合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每场比赛 O(n) | O(n) | 已接受但没有必要 |
 | 最佳 | 每场比赛 O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取游戏数量$t$。 对于每个游戏，读取位数$n$和表示整数的字符串。 
2. 判断是否$n$是奇数还是偶数。 如果$n$为奇数，Raze 将拥有与奇数位置相关的最终着法； 如果$n$是偶数时，Breach 将采取与偶数位置相关的最终行动。 
3.如果$n$是奇数，扫描奇数位置的所有数字（1、3、5、...）并检查其中是否有奇数。 如果至少有一个是奇数，Raze 可以确保剩下的最后一位数字是奇数，因此 Raze 获胜。 否则，Breach 获胜。 
4. 如果$n$是偶数，扫描偶数位置上的所有数字（2、4、6、...）并检查其中是否有偶数。 如果至少有一个是偶数，则 Breach 可以确保剩下的最后一位数字是偶数，因此 Breach 获胜。 否则，拉兹获胜。 
5、输出`1`如果 Raze 获胜或`2`如果 Breach 每场比赛都获胜。 

为什么有效：最后剩下的数字决定了获胜者，每个玩家都可以最佳地控制自己的可访问位置。 通过检查最后移动的玩家在其允许的位置上是否有可用的获胜数字，我们保证正确的结果，而无需模拟每个回合。 任何移动序列都不能覆盖这一点，因为对方玩家无法删除唯一的获胜选择（如果存在）。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    s = input().strip()
    if n % 2 == 1:
        # Raze has the final move on odd positions
        for i in range(0, n, 2):  # odd positions in 0-based indexing
            if int(s[i]) % 2 == 1:
                print(1)
                break
        else:
            print(2)
    else:
        # Breach has the final move on even positions
        for i in range(1, n, 2):  # even positions in 0-based indexing
            if int(s[i]) % 2 == 0:
                print(2)
                break
        else:
            print(1)
```我们使用从零开始的索引来简化位置处理。 循环`for i in range(0, n, 2)`访问基于 1 的索引中的位置 1、3、5。 这`else`如果循环没有中断，则运行 for 循环的子句，这意味着没有找到获胜数字。 这避免了引入单独的标志变量。 我们剥离输入字符串以删除尾随换行符`input()`。 

## 工作示例

 ### 示例输入轨迹 1

 输入：```
1
3
102
```| 步骤| n | Positions checked | 结果 |
 | ---| ---| ---| ---|
 | 1 | 3 | 奇数位置 1,3 → 数字 1,2 | digit 1 is odd |
 | 2 | n 奇数，Raze 检查奇数位 | 在位置 1 发现奇怪的 | Raze wins |

 这表明 Raze 获胜，因为他们可以将最后一位数字保留为奇数。 

### Sample Input Trace 2

 输入：```
1
4
2069
```| 步骤| n | 已检查职位 | 结果 |
 | ---| ---| ---| ---|
 | 1 | 4 | 偶数位置 2,4 → 数字 0,9 | 数字 0 是偶数 |
 | 2 | n 偶数，Breach 检查偶数位 | 甚至在位置 2 也发现了 | 违规获胜 |

 这证实了算法正确识别了 Breach 的获胜策略。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每场比赛 O(n) | 我们扫描奇数或偶数位置一次，这与位数呈线性 |
 | 空间| O(1) | O(1) | 除了输入字符串存储和循环变量之外，没有额外的内存 |

 给定$t \le 100$和$n \le 1000$，最坏的情况是 100,000 位数字检查，这完全在 1 秒限制和 256 MB 内存之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution
    t = int(input())
    for _ in range(t):
        n = int(input())
        s = input().strip()
        if n % 2 == 1:
            for i in range(0, n, 2):
                if int(s[i]) % 2 == 1:
                    print(1)
                    break
            else:
                print(2)
        else:
            for i in range(1, n, 2):
                if int(s[i]) % 2 == 0:
                    print(2)
                    break
            else:
                print(1)
    return output.getvalue().strip()

# Provided samples
assert run("4\n1\n2\n1\n3\n3\n102\n4\n2069\n") == "2\n1\n1\n2", "sample cases"

# Custom cases
assert run("2\n1\n1\n2\n8") == "1\n2", "single-digit edge cases"
assert run("2\n5\n13579\n6\n246802") == "1\n2", "all odd or all even"
assert run("1\n3\n222") == "2", "odd length, no odd digits"
assert run("1\n4\n1357") == "1", "even length, no even digits"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1\n1\n1`| 1 | 单位数奇数，Raze 立即获胜 |
 |`1\n1\n2`| 2 | 单位数偶数，Breach 立即获胜 |
 |`5\n13579`| 1 | 奇数长度全奇数，Raze 可以获胜 |
 |`6\n246802`| 2 | 偶数长度全偶数，突破即可获胜 |
 |`3\n222`| 2 | 奇数长度，无奇数数字，Raze 输了 |
 |`4\n1357`| 1 | 偶数长度，无偶数，违反不能获胜 |

 ## 边缘情况

 对于`n = 1`，算法立即检查唯一的数字。 为了`1\n3`, Raze 获胜，因为数字是奇数
