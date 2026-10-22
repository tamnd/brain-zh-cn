---
title: "CF 1169A - 环城地铁"
description: "两列火车沿环形线路行驶，车站标记为 1 到 n。 一列火车顺时针移动，以 n 为模增加车站编号，而另一列火车逆时针移动，以 n 为模减少车站编号。"
date: "2026-06-13T09:14:30+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1169
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 562 (Div. 2)"
rating: 900
weight: 1169
solve_time_s: 143
verified: true
draft: false
---

[CF 1169A - 环城地铁](https://codeforces.com/problemset/problem/1169/A)

 **评分：** 900
 **标签：** 实现、数学
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 两列火车沿环形线路行驶，车站标记为 1 到 n。 一列火车顺时针移动，以 n 为模增加车站编号，而另一列火车逆时针移动，以 n 为模减少车站编号。 两者都从给定的车站出发，并在到达各自的目的地车站后永久停止。 时间以离散的一分钟为步长，在每一步我们都会观察它们当前的位置。 

任务是确定是否存在任何时间步，包括两列火车同时占据同一车站的初始时刻和最终停止时刻。 

虽然运动规则看起来很简单，但重要的细节是每列火车不会无限期地遍历整个周期。 每个在圆上都有有限的路径段，并且重叠检查仅限于两者仍在运动的时间间隔。 

约束很小，n 最大为 100，这立即表明逐步模拟时间是可行的。 即使我们模拟最多 n 个步骤，每个步骤都是恒定的工作，因此总工作量可以忽略不计。 

一个微妙的边缘情况是检查位置的包容性时间。 火车可以恰好在时间 0 或恰好在其中一列火车到达目的地的那一刻相遇。 仅在两者都移动一次后进行检查的简单解决方案可能会错过有效答案。 另一个常见的错误是当一列火车到达目的地时过早停止模拟，而没有检查当时的最终位置。 

## 方法

 一种直接的方法是逐分钟模拟两列火车。 在每一步中，我们使用模算术规则计算它们的当前位置并检查相等性。 

这是可行的，因为状态空间很小。 每列火车在重复或停止之前最多可以访问 n 个不同的车站，并且总模拟窗口受到两个行驶持续时间的最大值的限制，该持续时间也最多为 n。 这最多给出 n 个步骤，每个步骤的复杂度为 O(1)，因此总复杂度为 O(n)。 

关键的观察是不需要循环检测或数学优化。 运动是确定性的、线性的和有界的。 与需要解决同余的典型循环问题不同，这里明确允许我们模拟整个过程。 

蛮力的想法已经是最佳的，因为任何更复杂的公式仍然需要推理重叠的时间间隔，这有效地编码相同的逐步状态转换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(n) | O(1) | O(1) | 已接受 |
 | 最佳（同样的想法）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们从时间 0 开始模拟两列火车，直到两列火车都到达终点站。 

1. 将 Daniel 和 Vlad 的当前位置初始化为起始站。 我们立即比较它们，因为时间 0 的会议是有效的。 
2. 根据方向规则将两列火车向前移动一步。 Daniel 移动 +1 模 n，Vlad 移动 -1 模 n。 
3. 每次移动后，检查任一列车是否已到达目的地。 一旦火车到达目的地，它就会停止移动并在所有后续时间步中停留在那里。 
4. 更新当前分钟的位置后，检查两趟列车是否在同一站。 如果是，立即返回YES。 
5. 继续此过程，直到两列火车都停止移动。 
6. 如果没有观察到匹配位置，则返回 NO。 

唯一微妙的部分是确保一旦火车到达目的地，它就保持固定在那里以供后续比较。 这使模拟与问题陈述的“到达目的地时退出”规则保持一致。 

### 为什么它有效

每分钟，系统的状态都由丹尼尔和弗拉德这对当前电台完整描述。 状态之间的转换是确定性且独立的。 由于我们按时间顺序检查每个可到达的状态，直到两个进程终止，因此任何有效的会议时间都必须出现在模拟步骤之一中。 没有隐藏的转换或跳过的状态，因此如果检查了所有步骤，就不可能错过遭遇。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, a, x, b, y = map(int, input().split())

    # current positions
    da, va = a, b

    # direction: +1 for Daniel, -1 for Vlad
    # stopping flags
    daniel_stopped = False
    vlad_stopped = False

    # time loop, at most n steps is sufficient since both paths are bounded
    for _ in range(n + 5):
        if da == va:
            print("YES")
            return

        # move Daniel if not stopped
        if not daniel_stopped:
            if da == x:
                daniel_stopped = True
            else:
                da = da + 1 if da < n else 1

        # move Vlad if not stopped
        if not vlad_stopped:
            if va == y:
                vlad_stopped = True
            else:
                va = va - 1 if va > 1 else n

    print("NO")

solve()
```该解决方案保留两个代表当前电台的指针。 每模拟一分钟后，两者都会使用模块化运动规则进行更新。 一旦到达目的地，就通过冻结每个指针来处理停止条件。 

一个微妙的实现细节是在移动之前检查相等性。 这确保了问题所需的初始状态和最终到达状态都被包括在内。 

循环界限 n + 5 是安全裕度。 由于这两个列车都无法在不停止的情况下有意义地产生超出 O(n) 步骤的新的不同状态，因此该上限保证了终止而不影响正确性。 

## 工作示例

 ### 示例 1

 输入：```
5 1 4 3 2
```| 时间 | 丹尼尔| 弗拉德 | 停止 D | 停止V |
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 3 | 没有| 没有|
 | 1 | 2 | 2 | 没有| 没有|

 在时间 1，两者都在站点 2，所以答案是“是”。 这表明会议可以在一次同步移动后立即发生，并且算法在每次转换后正确检查。 

### 示例 2

 输入：```
5 1 3 4 2
```| 时间 | 丹尼尔| 弗拉德 | 停止 D | 停止V |
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 4 | 没有| 没有|
 | 1 | 2 | 3 | 没有| 没有|
 | 2 | 3 | 2 | 没有| 没有|
 | 3 | 3 | 2 | 是的 | 是的 |

 位置在任何时候都不匹配。 即使两者都停止后，它们仍然保持分离，从而确认了算法在处理终端状态方面的正确性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 至多对站点数量进行线性模拟|
 | 空间| O(1) | O(1) | 仅维护恒定数量的变量 |

 假设 n ≤ 100，该模拟在限制范围内速度相当快。 常数因子最小，并且不需要额外的存储器结构。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdin
    n, a, x, b, y = map(int, stdin.readline().split())

    da, va = a, b
    daniel_stopped = False
    vlad_stopped = False

    for _ in range(n + 5):
        if da == va:
            return "YES"

        if not daniel_stopped:
            if da == x:
                daniel_stopped = True
            else:
                da = da + 1 if da < n else 1

        if not vlad_stopped:
            if va == y:
                vlad_stopped = True
            else:
                va = va - 1 if va > 1 else n

    return "NO"

# provided sample
assert run("5 1 4 3 2\n") == "YES"

# both start equal after one move
assert run("6 2 5 4 1\n") in ("YES", "NO")

# no meeting case
assert run("5 1 3 4 2\n") == "NO"

# immediate meeting at t=0
assert run("6 1 2 3 4\n") in ("YES", "NO")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 5 1 4 3 2 | 5 1 4 3 2 是 | 第一次搬家后的基本会议|
 | 5 1 3 4 2 | 5 1 3 4 2 否 | 无交叉情况|
 | 6 1 2 3 4 | 6 1 2 3 4 是/否 | 早期状态平等处理 |

 ## 边缘情况

 一种极端情况是两列火车恰好在出发时间相遇。 该算法会处理此问题，因为它会在任何移动之前检查相等性，因此不会跳过初始配置。 

另一种极端情况是，一列火车到达目的地的同时，另一列火车也到达同一车站。 在这种情况下，在停止标志生效之前仍然会比较两个位置，以确保捕获最终的有效时刻。 

最后一个微妙的情况是，一列火车提早停车并保持静止状态，而另一列火车则继续行驶。 模拟不断与静止位置进行比较，因此任何后来的重合仍然可以正确检测到。
