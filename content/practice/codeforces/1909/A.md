---
title: "CF 1909A - 独特的按钮"
description: "我们被要求从原点开始在无限网格上移动。 我们有四种可能的移动，对应于四个基本方向：上、下、左、右。"
date: "2026-06-08T20:28:13+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1909
codeforces_index: "A"
codeforces_contest_name: "Pinely Round 3 (Div. 1 + Div. 2)"
rating: 800
weight: 1909
solve_time_s: 96
verified: true
draft: false
---

[CF 1909A - 不同的按钮](https://codeforces.com/problemset/problem/1909/A)

 **评分：** 800
 **标签：** 实现、数学
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求从原点开始在无限网格上移动。 我们有四种可能的移动，对应于四个基本方向：上、下、左、右。 每个动作都是由控制器上的单独按钮触发，但控制器很脆弱：如果我们在旅途中至少按下所有四个按钮一次，控制器就会损坏。 因此，我们只能使用最多三个不同的方向来到达所有给定的点。 每个测试用例都提供一组具有整数坐标的点，我们需要确定是否可以在不按下所有四个按钮的情况下访问所有这些点。 

限制条件适中。 每个测试用例最多可以有 100 个点，最多可以有 1000 个测试用例。 每个坐标都很小，在-100到100之间，这使得我们可以对坐标进行简单的扫描，而不用担心效率低下。 关键的挑战不是计算性能，而是几何推理：我们需要弄清楚到达所有点所需的方向。 

一个幼稚的错误是尝试以任意顺序访问点并跟踪精确的按钮按下情况。 例如，如果点跨越相对于原点的所有四个象限，粗心的方法可能会尝试按顺序访问每个象限的路径，并错误地认为它总是可能的。 例如，用点`(1,1)`,`(-1,-1)`,`(1,-1)`， 和`(-1,1)`，任何路径都必须使用所有四个方向，所以正确答案是“NO”。 

## 方法

 暴力方法将尝试这些点的所有排列，并查看是否存在最多使用三个方向的访问它们的顺序。 这是不切实际的，因为即使对于适度的情况，排列的阶乘增长也会爆炸。`n=10`。 原则上是正确的，但由于我们的限制，这是不可行的。 

关键的观察是我们不需要模拟路径或顺序。 每个点相对于原点的象限决定了需要哪些方向。 我们可以通过 x 和 y 坐标对每个点进行分类：

 - 要到达 x > 0 的点，我们必须能够向右移动。 
- 要到达 x < 0 的点，我们必须能够向左移动。 
- 要到达 y > 0 的点，我们必须能够向上移动。 
- 为了到达 y < 0 的点，我们必须能够向下移动。 

这会产生四个潜在方向，对应于四个按钮。 如果需要所有四个方向才能到达这些点，控制器就会损坏。 否则，就安全了。 

因此，对于每个测试用例，我们检查是否同时存在正 x、负 x、正 y 和负 y 的点。 如果这四个都存在，则答案为“否”。 否则，为“是”。 这将问题简化为简单的坐标扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 最佳 | 每个测试用例 O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，初始化四个标志：`need_right`,`need_left`,`need_up`,`need_down`到`False`。 这些代表我们是否必须按下相应的按钮才能到达任何点。 
2. 迭代测试用例中的所有点。 对于每个点`(x, y)`，更新标志：

 - 如果`x > 0`， 放`need_right = True`。 
- 如果`x < 0`， 放`need_left = True`。 
- 如果`y > 0`， 放`need_up = True`。 
- 如果`y < 0`， 放`need_down = True`。 
3. 处理完所有点后，检查所有四个标志是否都已`True`。 如果是，则输出“NO”，因为访问所有点都需要所有四个按钮。 否则，输出“YES”。 
4. 对所有测试用例重复此操作。 

为什么它有效：标志捕获到达所有点所需的最小方向集。 如果不需要任何按钮，控制器不会损坏。 由于我们只计算需要哪些按钮，因此访问点的实际顺序并不重要。 当且仅当最多需要三个按钮时，该解决方案才能正确回答“是”。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    need_right = need_left = need_up = need_down = False
    for _ in range(n):
        x, y = map(int, input().split())
        if x > 0:
            need_right = True
        if x < 0:
            need_left = True
        if y > 0:
            need_up = True
        if y < 0:
            need_down = True
    if need_right and need_left and need_up and need_down:
        print("NO")
    else:
        print("YES")
```代码一步步遵循算法。 每个点的标志都是独立更新的。 我们避免存储点，因为我们只需要方向信息。 点位于轴上的边界条件会自动处理，因为`x=0`或者`y=0`不需要任何水平或垂直移动。 使用`sys.stdin.readline`确保大量测试用例的快速输入。 

## 工作示例

 考虑第一个示例测试用例：

 | 步骤| 观点`(x, y)`| 更新后的标志 |
 | --- | --- | --- |
 | 1 | (1, -1) | (1, -1) | 右=真，左=假，上=假，下=真 |
 | 2 | (0, 0) | (0, 0) | 右=真，左=假，上=假，下=真 |
 | 3 | (1, -1) | (1, -1) | 右=真，左=假，上=假，下=真 |

 没有一个标志同时全部`True`，所以输出为“YES”。 跟踪确认只需要两个按钮：向右和向下。 

考虑第三个样本：

 | 步骤| 观点`(x, y)`| 更新后的标志 |
 | --- | --- | --- |
 | 1 | (1,1) | 右=真，左=假，上=真，下=假 |
 | 2 | (-1,-1) | (-1,-1) | 右=真，左=真，上=真，下=真 |
 | 3 | (1,-1) | (1,-1) | 右=真，左=真，上=真，下=真 |
 | 4 | (-1,1) | (-1,1) | 右=真，左=真，上=真，下=真 |

 所有四个标志均为 True，因此输出为“NO”。 该轨迹表明所有四个象限中的点都需要所有四个按钮。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t * n) | 每个测试用例需要扫描所有n个点，并且t≤1000，n≤100 |
 | 空间| O(1) | O(1) | 每个测试用例仅存储四个布尔标志 |

 考虑到 t 和 n 的最大值较小，操作总数最多为 1000 * 100 = 100,000，这很容易满足 1 秒的时间限制。 内存使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    t = int(input())
    for _ in range(t):
        n = int(input())
        need_right = need_left = need_up = need_down = False
        for _ in range(n):
            x, y = map(int, input().split())
            if x > 0:
                need_right = True
            if x < 0:
                need_left = True
            if y > 0:
                need_up = True
            if y < 0:
                need_down = True
        if need_right and need_left and need_up and need_down:
            print("NO")
        else:
            print("YES")
    return output.getvalue().strip()

# Provided samples
assert run("6\n3\n1 -1\n0 0\n1 -1\n4\n-3 -2\n-3 -1\n-3 0\n-3 1\n4\n1 1\n-1 -1\n1 -1\n-1 1\n6\n-4 14\n-9 -13\n-14 5\n14 15\n-8 -4\n19 9\n6\n82 64\n39 91\n3 46\n87 83\n74 21\n7 25\n1\n100 -100") == "YES\nYES\nNO\nNO\nYES\nYES"

# Custom cases
assert run("1\n1\n0 0") == "YES", "single origin point"
assert run("1\n2\n0 5\n0 -5") == "YES", "vertical line requires up/down only"
assert run("1\n2\n5 0\n-5 0") == "YES", "horizontal line requires left/right only"
assert run("1\n4\n1 1\n1 -1\n-1 1\n-1 -1") == "NO", "points in all four quadrants"
assert run("1\n3\n0 1\n1 0\n0 -1") == "YES", "three directions only"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 原点 1 点 | 是 | 无需运动 |
 | 垂直点 | 是 | 仅使用两个方向 |
 | 水平点 | 是 | 仅使用两个方向 |
 | 四象限| 否 | 需要所有四个方向 |
 | 三个方向 | 是 | 正好需要三个按钮，有效 |

 ## 边缘情况

 如果所有点
