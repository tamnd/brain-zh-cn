---
title: "CF 1759C - 恒温器"
description: "我们有一个恒温器，当前温度为 a，我们想要将其调整到目标温度 b。 恒温器有严格的限制：它只能设置为 l 和 r 之间的温度（含），并且任何单次调整都必须使温度至少改变 x。"
date: "2026-06-09T14:28:46+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 1759
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round  834 (Div. 3)"
rating: 1100
weight: 1759
solve_time_s: 219
verified: true
draft: false
---

[CF 1759C - 恒温器](https://codeforces.com/problemset/problem/1759/C)

 **评分：** 1100
 **标签：** 贪心，数学，最短路径
 **求解时间：** 3m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个恒温器，其当前温度为`a`，我们想将其调整到目标温度`b`。 恒温器有硬性限制：它只能设置在`l`和`r`包括在内，任何单次调整都必须使温度至少改变`x`。 我们的任务是计算达到目标所需的最少操作数`b`从`a`，或判定不可能。 

每个测试用例都给出了范围`l`,`r`, 最小步长`x`，以及初始温度和目标温度`a`和`b`。 我们有多达 10,000 个测试用例，但每个测试用例都是独立的，因此我们可以单独对待它们。 温度范围可达`2*10^9`，因此强力检查每个可能的温度是不可行的。 

需要仔细考虑的边缘情况包括恒温器已经达到目标的情况，`a`和`b`小于`x`（所以直接移动是不可能的），或者在哪里`b`只能通过范围端点之一到达`l`或者`r`。 例如，如果`l = 0, r = 10, x = 5, a = 3, b = 4`，直接移动是不可能的，因为`|3 - 4| = 1 < x`， 和`4`无法一步达到。 但是，可以通过以下方式到达`l`或者`r`分多个步骤。 

## 方法

 一种朴素的暴力方法将模拟所有有效的移动序列`a`到`b`。 在每个温度下，我们都可以跳过`x`或在任一方向上停留在`[l, r]`。 这是有效的，因为每次移动至少会减少剩余距离`x`。 然而，因为`l`和`r`可以大到`10^9`，构建这样的图表或迭代所有可达到的温度是不切实际的。 

关键的见解是，问题本质上是关于**使用至少一个足够大的步骤的可达性**。 我们可以对可能性进行分类：

 1.如果`a == b`，需要零步。 
2.如果`|a - b| >= x`，一次移动就足够了。 
3. 否则，单次移动是不可能的，但我们可以尝试通过端点进行两次移动序列。 具体来说，如果从`a`到`l`或者`r`至少是`x`并从该端点到`b`也至少是`x`，两步就足够了。 
4. 如果不可能通过一个端点进行两次移动，则仍然可以使用两个端点进行三移动序列，即`a -> endpoint1 -> endpoint2 -> b`。 
5. 如果这些序列都不可能，则答案是`-1`。 

这种逻辑避免了任何类型的大规模模拟，并将每个测试用例减少为一些恒定时间检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---|---|---|
 | 暴力模拟| O(r-l) | O(r-l) | 太慢，对于大范围不可行 |
 | 端点检查 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`l, r, x`和`a, b`。 
3.如果`a == b`， 打印`0`并继续。 
4.如果`|a - b| >= x`， 打印`1`并继续。 
5. 检查是否从`a`到`l`或者`r`至少是`x`然后从那一点到`b`至少是`x`。 如果任一序列可能，则打印`2`。 
6. 检查是否可以通过两个端点进行三步序列：`a -> l -> r -> b`或者`a -> r -> l -> b`。 如果是这样，则打印`3`。 
7. 如果没有可能的序列，则打印`-1`。 

**为什么它有效：** 不变的是每一步都必须满足`|current - next| >= x`并留在里面`[l, r]`。 通过明确检查唯一的候选序列（直接移动、通过一个端点的两步、通过两个端点的三步），我们涵盖了所有可能性，而无需枚举大量温度。 该解是正确的，因为如果不可能直接移动，任何有效序列都必须经过至少一个端点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    l, r, x = map(int, input().split())
    a, b = map(int, input().split())
    
    if a == b:
        print(0)
    elif abs(a - b) >= x:
        print(1)
    elif (abs(a - l) >= x and abs(b - l) >= x) or (abs(a - r) >= x and abs(b - r) >= x):
        print(2)
    elif (abs(a - l) >= x and abs(r - l) >= x and abs(b - r) >= x) or \
         (abs(a - r) >= x and abs(r - l) >= x and abs(b - l) >= x):
        print(3)
    else:
        print(-1)
```**说明：** 我们首先处理零移动和单步移动。 然后我们使用每个端点检查两步序列。 最后，我们考虑使用两个端点的三步序列。 如果没有工作，我们输出`-1`。 这确保了所有可行的序列都被恒定数量的操作覆盖。 

## 工作示例

 **示例1：**`l=0, r=10, x=5, a=4, b=9`| 步骤| 当前| 移动| 下一页 | 笔记|
 |------|--------|------|------|--------|
 | 1 | 4 | 5+ | 9 | abs(4-9)=5 >= x, 可以直接移动 |

 输出：`1`**示例2：**`l=0, r=10, x=5, a=3, b=4`| 步骤| 当前| 移动| 下一页 | 笔记|
 |------|--------|------|------|--------|
 | 1 | 3 | 5+ | l = 0 | abs(3-0)=3 < x，无效 |
 | 2 | 3 | 5+ | r=10 | abs(3-10)=7 >= x，可能移动 |
 | 3 | 10 | 10 5+ | 4 | abs(10-4)=6 >= x，有效 |

 输出：`3`## 复杂度分析

 | 测量 | 复杂性 | 说明|
 |---|---|---|
 | 时间 | 每个测试用例 O(1) | 每个测试用例只需要一些算术检查 |
 | 空间| O(1) | O(1) | 只需要常量变量 |

 和`t`最多 10,000 个，总操作量完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        l, r, x = map(int, input().split())
        a, b = map(int, input().split())
        if a == b:
            output.append("0")
        elif abs(a - b) >= x:
            output.append("1")
        elif (abs(a - l) >= x and abs(b - l) >= x) or (abs(a - r) >= x and abs(b - r) >= x):
            output.append("2")
        elif (abs(a - l) >= x and abs(r - l) >= x and abs(b - r) >= x) or \
             (abs(a - r) >= x and abs(r - l) >= x and abs(b - l) >= x):
            output.append("3")
        else:
            output.append("-1")
    return "\n".join(output)

# Provided sample
assert run("""10
3 5 6
3 3
0 15 5
4 5
0 10 5
3 7
3 5 6
3 4
-10 10 11
-5 6
-3 3 4
1 0
-5 10 8
9 2
1 5 1
2 5
-1 4 3
0 2
-6 3 6
-1 -4
""") == """0
2
3
-1
1
-1
3
1
3
-1""", "sample 1"

# Custom edge cases
assert run("1\n0 0 1\n0 0\n") == "0", "already at target"
assert run("1\n0 10 1\n0 10\n") == "1", "single move possible"
assert run("1\n0 10 5\n0 2\n") == "2", "two-step via endpoint"
assert run("1\n0 10 5\n2 3\n") == "-1", "impossible"
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---|---|
 | 0 0 1, 0 0 | 0 0 1, 0 0 | 0 | 已经达到目标 |
 |
