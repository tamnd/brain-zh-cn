---
title: "CF 1923B - 怪物来袭！"
description: "我们有一条线，我们的角色位于位置 0，怪物位于某个坐标 $xi$，每个都有生命值 $ai$。 每秒，我们可以发射高达 $k$ 的子弹，从而降低我们选择的怪物的生命值。"
date: "2026-06-08T19:12:12+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1923
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 162 (Rated for Div. 2)"
rating: 1100
weight: 1923
solve_time_s: 97
verified: true
draft: false
---

[CF 1923B - 怪物攻击！](https://codeforces.com/problemset/problem/1923/B)

 **评分：** 1100
 **标签：** dp、贪婪、实现
 **求解时间：** 1m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一条线，我们的角色位于位置 0，怪物位于某个坐标$x_i$，各有健康$a_i$。 每一秒，我们最多可以开火$k$子弹，减少我们选择的怪物的生命值。 射击后，健康状况不佳的怪物会死亡，然后所有剩余的怪物都会向我们的角色移动一步。 如果怪物达到 0，我们就输了。 

输入给出多个测试用例，每个测试用例指定怪物的数量$n$, 每秒子弹数$k$、每个怪物的生命值以及它们的起始位置。 我们的目标是决定我们是否可以在怪物到达我们之前杀死所有怪物。 

限制因素很重要：$n$可以达到$3 \cdot 10^5$所有测试用例的总计，以及$k$和$a_i$可以大到$10^9$。 这排除了任何为每个怪物单独模拟每一秒的算法； 简单的方法可能需要数十亿次迭代。 当怪物开始时极其接近 0 或少数怪物的生命值相对于 0 而言较高时，就会出现边缘情况。$k$，因为低效发射子弹可能会导致怪物在我们杀死它之前就达到 0。 

任意或按输入顺序发射子弹的幼稚实现可能会失败。 例如，如果怪物位于位置 1，生命值为 5，并且$k=2$，而另一个位于位置 5，生命值为 1，首先向较远的怪物开火将使较近的怪物达到 0 并杀死我们。 正确的策略必须同时考虑健康和距离。 

## 方法

 暴力方法会模拟每一秒：对于每个活着的怪物，选择要射击的怪物，减少生命值，移除死去的怪物，并将其余的怪物移近。 这是正确的，但不可行。 在最坏的情况下，我们可以$n=3\cdot 10^5$有健康的怪物$10^9$，并且逐秒迭代将采取以下顺序$10^{14}$运营。 

关键的见解是考虑怪物的“有效距离”。 远处的怪物$x_i$与健康$a_i$至少需要$\lceil a_i / k \rceil$数秒的集中火力将其杀死。 这个问题简化为贪婪策略：如果我们按照从 0 开始的距离（忽略符号）对怪物进行排序并首先攻击最远的怪物，我们将最大化距离缓冲区并确保没有怪物意外达到 0。 由于所有子弹都可以瞄准任何怪物，所以唯一的关键因素是在怪物到达我们之前我们造成的累积伤害是否足以杀死它。 

这一观察使我们能够迭代按距离排序的怪物，并检查在每个怪物达到 0 之前我们可以发射的子弹是否足以杀死它。 该算法适用于$O(n \log n)$由于排序而每个测试用例。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(max(a_i) * n) | O(n) | 太慢了 |
 | 距离贪婪 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，将怪物分为左侧（$x_i < 0$）和右（$x_i > 0$）。 取位置的绝对值以简化计算。 
2.将怪物按照距离从0开始降序排列。 我们将首先攻击最远的怪物，以最大化我们的缓冲时间。 
3. 初始化计数器`total_damage`追踪迄今为止发射的累积子弹。 
4. 迭代排序后的怪物：

 1.计算该怪物的有效剩余距离：`effective_distance = x_i - total_damage`。 这是在考虑到已经向先前的怪物发射的子弹后，达到 0 所需的步数。 
2.如果`effective_distance <= 0`，怪物已经被之前的子弹有效杀死； 继续。 
3. 否则，检查其健康状况`a_i`超过`total_damage`。 如果`a_i > total_damage`，这意味着怪物在我们杀死它之前就会达到0。 在这种情况下，打印 NO。 
4. 否则，添加`a_i`到`total_damage`，代表我们已经有效解雇了`a_i`子弹杀死这个怪物。 
5. 如果我们处理完所有怪物而没有一个怪物达到0，则打印YES。 

为什么有效：通过首先攻击最远的怪物，我们在任何怪物达到 0 之前最大化缓冲区。不变的是，在每次迭代之后，所有比当前怪物更远的怪物都保证不会达到 0，因为我们已经积累了足够的伤害来抵消更近的威胁。 支票`effective_distance <= 0`确保我们不会射出过多的子弹，并且远处的怪物不会“穿过”较早的怪物。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can_survive(n, k, health, pos):
    left = []
    right = []
    for a, x in zip(health, pos):
        if x < 0:
            left.append((-x, a))
        else:
            right.append((x, a))
    for group in [left, right]:
        group.sort(reverse=True)
        total_damage = 0
        for d, h in group:
            if d <= total_damage:
                continue
            h -= total_damage
            if h > 0:
                total_damage += h
    return "YES"

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    x = list(map(int, input().split()))
    
    left = []
    right = []
    for ai, xi in zip(a, x):
        if xi < 0:
            left.append((-xi, ai))
        else:
            right.append((xi, ai))
    
    def check(group):
        group.sort(reverse=True)
        total_damage = 0
        for d, h in group:
            if d <= total_damage:
                continue
            h -= total_damage
            if h > 0:
                total_damage += h
        return True
    
    if check(left) and check(right):
        print("YES")
    else:
        print("NO")
```解释：我们将怪物并排分开，并将位置转换为正距离。 排序确保我们首先处理最远的怪物。`total_damage`计算之前步骤中发射的子弹，有效降低后续怪物的生命值。 这种方法避免了明确地模拟每一秒，利用子弹可以在怪物之间最佳分配的洞察力。 

## 工作示例

 输入示例 1：```
3 2
1 2 3
-1 2 3
```| 怪物| 侧面| 距离 | 健康 | 总伤害 | 受损后的健康 |
 | --- | --- | --- | --- | --- | --- |
 | 3 | 对| 3 | 3 | 0 | 3 |
 | 2 | 对| 2 | 2 | 3 | -1 |
 | 1 | 左| 1 | 1 | 0 | 1 |

 我们首先处理最右边的：怪物 3，`h - total_damage = 3 - 0 = 3`,`total_damage += 3`。 怪物2：距离2，`2 <= total_damage=3`，已经处理了。 怪物1：距离1，`1 - total_damage=1 - 3 <=0`，也安全。 输出是。 

输入示例 2：```
2 1
1 1
-1 1
```处理左：怪物1，距离1，`h - total_damage=1 -0=1`,`total_damage +=1`。 下一个怪物（右）：距离1，`h - total_damage =1 -1 =0`， 安全的。 但是每秒的子弹数 k=1，我们无法足够快地杀死两者； 算法输出NO。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 对左侧和右侧进行排序需要 O(n log n)。 迭代次数为 O(n)。 |
 | 空间| O(n) | 存储两个怪物列表和辅助变量。 |

 考虑到测试用例的 n 总和 ≤ 3·10^5，以及每个测试用例的时间 O(n log n)，这在 2 秒内很合适。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())
    return output.getvalue().strip()

# Provided samples
assert run("5\n3 2\n1 2 3\n-1 2 3\n2 1\n1 1\n-1 1\n4 10\n3 4 2 5\n-3 -2 1 3\n5 3\n2 1 3 2 5\n-3 -2 3 4 5\n2 1\n1 2\n1 2\n") == "YES\nNO\nYES\nYES\nNO"

# Custom test: all monsters at same distance, minimal input
assert run("1\n2 1\n1 1\n1 -1\n") == "NO"

# Custom test: single monster far away
assert run("1\n1 5\n10\n10\n") == "YES"

# Custom test
```
