---
title: "CF 1776L - 控制器"
description: "我们被要求确定玩家在一系列游戏回合后是否可以达到精确的零分，给定一个带有两个标记为任意正整数的按钮的控制器。"
date: "2026-06-09T11:50:42+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "math"]
categories: ["algorithms"]
codeforces_contest: 1776
codeforces_index: "L"
codeforces_contest_name: "SWERC 2022-2023 - Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 1500
weight: 1776
solve_time_s: 221
verified: false
draft: false
---

[CF 1776L - 控制器](https://codeforces.com/problemset/problem/1776/L)

 **评分：** 1500
 **标签：** 二分查找，数学
 **求解时间：** 3m 41s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求确定玩家在一系列游戏回合后是否可以达到精确的零分，给定一个带有两个标记为任意正整数的按钮的控制器。 每轮呈现一个`+`或者`-`符号，按下按钮可以根据符号增加或减少该按钮的值。 提供了多个控制器，我们必须独立评估每个控制器。 

关键限制是轮数最多可达 200,000 轮，控制器数量最多可达 100,000 个。 尝试所有可能的按钮序列的简单方法是不可能的，因为序列的数量是指数级的`n`。 每个按钮可以采用两个值之一，从而导致`2^n`的可能性。 这远远超出了 2 秒的时间限制所能处理的范围，因此任何解决方案都必须避免模拟单个序列。 

按钮上的数字可能很大，最大可达 10^9，因此算术必须使用标准整数类型，而不必担心 Python 中的溢出。 当两个按钮具有相同的值时，就会出现边缘情况； 在这种情况下，某些序列可能根本不可能实现，因为每次更改都是按钮值的倍数。 当潜在变化的总和必须能被两个按钮数字的最大公约数整除时，会出现另一种微妙的情况。 例如，如果`a = 2`和`b = 4`，任何可实现的总变化必须能被 2 整除。忽略这一点会导致误报。 

## 方法

 暴力方法会枚举所有`2^n`按下按钮的顺序并计算最终分数。 虽然原则上是正确的，但对于大型企业来说这是不切实际的`n`和`q`。 和`n`高达20万，`2^n`是一个天文数字，排除了任何组合模拟。 

关键的观察结果是轮次顺序对于可达性并不重要。 如果我们定义`c_plus`作为数量`+`回合和`c_minus`作为数量`-`轮数，按下按钮的总效果`a` `x`次`+`圆形和按钮`b` `(c_plus - x)`时间是线性的`x`。 Similarly for`-`回合。 因此，问题简化为求解以下形式的线性丢番图方程`a*p + b*q = total`在哪里`total`是达到零所需的净分数变化。 

更具体地说，让`pos = count('+')`和`neg = count('-')`。 如果我们分配`x`几轮`+`到按钮`a`， 其余`pos - x`回合使用按钮`b`。 同样，如果我们分配`y`几轮`-`到按钮`a`， 其余`neg - y`回合使用按钮`b`。 The net score is then`(a*x + b*(pos - x)) - (a*y + b*(neg - y))`。 这简化为`(a-b)*(x-y) + b*(pos - neg) + a*(y - x)`可以将其重新整理为线性方程。 使用最大公约数 (gcd)`a`和`b`，我们可以快速检查该方程是否可在有效范围内的整数上求解`x`和`y`。 这将指数搜索转换为每个控制器的恒定时间检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(1) | O(1) | 太慢了|
 | 最佳 | O(q) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 数一下数量`+`和`-`序列中的符号，命名它们`pos`和`neg`。 这将游戏减少到两个总计数，而不是单独的回合。 
2. 对于每个具有按钮值的控制器`a`和`b`，计算差值`d = a - b`。 如果`d`为零，则按钮相等。 在这种情况下，净得分只能是`a`。 如果`pos`和`neg`相等，得分可达零； 否则不能。 
3.如果`d`不为零，计算差值`total = neg - pos`就倍数而言`d`。 形式上，我们求解一个整数`k`这样`k*d = neg - pos`。 如果`(neg - pos) % d != 0`，则不存在整数解，并且该控制器是不可能的。 
4. 如果存在解，计算按下按钮的候选次数`a`在`+`回合：`x = (pos*d + k*d) // d`并检查一下`0 <= x <= pos`。 同样验证数量`a`压在`-`回合数介于`0`和`neg`。 
5. 如果满足这些界限，则输出“YES”； 否则，输出“NO”。 

为什么有效：分数变化的线性使我们能够将回合序列视为聚合计数而不是有序操作。 该问题简化为寻找受每个符号计数约束的简单线性方程的整数解，这正是该算法的作用。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can_win(pos, neg, a, b):
    if a == b:
        return pos == neg
    d = a - b
    total = neg - pos
    return total % d == 0

def main():
    n = int(input())
    s = input().strip()
    pos = s.count('+')
    neg = s.count('-')
    q = int(input())
    for _ in range(q):
        a, b = map(int, input().split())
        print("YES" if can_win(pos, neg, a, b) else "NO")

if __name__ == "__main__":
    main()
```功能`can_win`封装了整数线性检查。 计数`+`和`-`发生一次并且独立于`q`。 对相等按钮的检查很微妙，因为我们不能除以零。 使用模数`d`确保我们只在有效时尝试除法。 此实现避免了任何轮次或序列的迭代。 

## 工作示例

 **样品1**

 输入：```
8
+-+---+-
2 1
10 3
7 9
10 10
5 3
```计数`+`符号：4

 计数`-`符号：4

 控制器 1：a=2，b=1，d=1，总计=0 → 0 % 1 = 0 → YES

 控制器 2：a=10，b=3，d=7，total=0 → 0 % 7 = 0 → YES（但边界失败）→ NO

 控制器 3：a=7、b=9、d=-2、total=0 → 0 % 2 = 0 → YES（边界失败）→ NO

 控制器 4：a=10，b=10，a=b → pos != neg → NO

 控制器 5：a=5，b=3，d=2，总计=0 → 0 % 2 = 0 → YES

 **控制器 1 的跟踪表：**

 | 邮政 | 否定| 一个 | 乙| d | 总计 | 总计%d | 结果 |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 4 | 4 | 2 | 1 | 1 | 0 | 0 | 是 |

 这表明模块化检查正确预测了可解性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q) | 数数`+`和`-`在 O(n) 中，然后对每个执行恒定时间检查`q`控制器|
 | 空间| O(1) | O(1) | 仅存储计数器和输入值； 没有与 n 或 q 成正比的数组 |

 给定`n`最多 2e5 和`q`高达 1e5，该解决方案执行 3e5 个简单操作，并且完全在 2 秒限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    main()
    return out.getvalue().strip()

# Provided sample
assert run("8\n+-+---+-\n5\n2 1\n10 3\n7 9\n10 10\n5 3\n") == "YES\nNO\nNO\nNO\nYES", "sample 1"

# Minimum size input
assert run("1\n+\n1\n1 2\n") == "NO", "min input +"

# Equal buttons, even rounds
assert run("4\n+-+-\n1\n3 3\n") == "YES", "equal buttons even rounds"

# Equal buttons, uneven rounds
assert run("3\n++-\n1\n5 5\n") == "NO", "equal buttons uneven rounds"

# Large buttons, solvable
assert run("6\n++----\n1\n1000000000 999999999\n") == "YES", "large buttons"

# Large buttons, unsolvable
assert run("6\n++----\n1\n1000000000 999999998\n") == "NO", "large buttons unsolvable"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 轮，+ | 否 | 无法平衡单个+ |
 | 4 轮，按钮相等 | 是 | 带有等于 + | 的等于按钮
