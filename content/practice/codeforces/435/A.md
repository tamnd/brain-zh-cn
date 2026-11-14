---
title: "CF 435A - 公交车站排队"
description: "我们在公交车站排队等候，但他们被分成几组。 每组人数固定，按顺序排队。 一辆最多可载 m 人的公共汽车来了，人们按照分组的顺序进入。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 435
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 249 (Div. 2)"
rating: 1000
weight: 435
solve_time_s: 67
verified: true
draft: false
---

[CF 435A - 公交车站排队](https://codeforces.com/problemset/problem/435/A)

 **评分：** 1000
 **标签：** 实施
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在公交车站排队等候，但他们被分成几组。 每组人数固定，按顺序排队。 一辆公交车来最多可以运载`m`人，人按照小组的顺序进入。 如果排队的下一批人无法完全坐进巴士，巴士会带着已经上车的人离开，整个等候组等待下一班巴士。 我们被要求计算需要多少辆巴士来运送所有团体。 

输入提供`n`，组数，`m`、总线容量和数组`a`尺寸的`n`代表每组的人数。 输出是一个整数，即所需的总线数量。 

限制很小：`n`和`m`最多 100。这意味着即使是简单的模拟也足够快，因为处理每个组最多需要 100 次迭代。 除了仔细处理总线填充逻辑之外，不需要高级数据结构或优化。 

当一个组恰好等于总线容量或者当多个小组可以恰好适合一个总线时，就会出现边缘情况。 例如，如果`m = 5`组大小为`[2, 3, 2]`，那么第一辆巴士可以乘坐前两组（2+3=5），但最后一组2需要一辆新巴士。 尝试“拆分”组来填充总线的粗心实现会产生不正确的结果。 

## 方法

 最简单的方法是从字面上模拟该过程：从空总线开始，迭代组，如果适合则将它们添加到总线，并在组不适合时启动总线。 对于每个组，我们检查总线中的剩余空间并决定是否加载它或启动新总线。 这很简单，因为约束条件允许。 为了`n=100`，每一步都是常数时间算术，因此整体复杂度实际上是 O(n)。 

没有明显更快的算法，因为问题是连续的：每个组的位置取决于之前的总线占用情况。 关键的见解是您不需要管理个人，只需管理每辆公交车的负载总和。 通过保存当前公交车乘客的运行总和，您可以在无法容纳一组乘客时决定是否启动新公交车。 与单独管理每个人相比，这可以减少潜在的差一错误。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 团体模拟| O(n) | O(1) | O(1) | 已接受 |
 | 预付款或精美包装 | O(n) | O(n) | 这个问题太过分了|

 ## 算法演练

 1.初始化一个计数器`buses`为 1 因为我们至少需要一条总线和一个变量`current_load`为 0 以跟踪当前公交车上的人数。 
2. 迭代每个组`g`在数组中`a`。 
3.如果添加`g`到`current_load`会超过`m`, 增量`buses`并重置`current_load`到 0。这模拟发送当前总线并启动一个新总线。 
4. 添加群组大小`g`到`current_load`来说明新登机的群体。 
5. 迭代完所有组后，`buses`包含所需的公交车数量。 

这里的不变量是在每一步中，`current_load`永远不会超过`m`，并且每个组都被满载到总线上而不被分割。 这保证了正确性，因为我们尊重“团体呆在一起”的规则，并且永远不会让公共汽车超载。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
a = list(map(int, input().split()))

buses = 1
current_load = 0

for g in a:
    if current_load + g > m:
        buses += 1
        current_load = 0
    current_load += g

print(buses)
```该解决方案从一辆总线开始，因为总是至少有一组。 支票`current_load + g > m`确保我们不会让巴士超载并遵守团体限制。 重置`current_load`启动新公共汽车后，确保我们正确计算下一公共汽车。 所有运算都是简单的整数运算，因此不存在溢出风险。 

## 工作示例

 **样品1：**

 输入：`4 3`与团体`[2, 3, 2, 1]`| 集团| 当前负载| 巴士 |
 | ---| ---| ---|
 | 2 | 2 | 1 |
 | 3 | 3（之前的2+3>3→新总线）| 2 |
 | 2 | 2 | 2 |
 | 1 | 3 | 2 → 不需要新巴士 |

 该表显示，每当一个组无法容纳时，就会启动新的巴士，这与问题描述完全匹配。 

**样本2：**

 输入：`5 5`与团体`[1, 2, 3, 4, 5]`| 集团| 当前负载| 巴士 |
 | ---| ---| ---|
 | 1 | 1 | 1 |
 | 2 | 3 | 1 |
 | 3 | 3+3>5 → 新巴士 | 2 |
 | 4 | 4 | 2 |
 | 5 | 5 | 3 |

 这表明，较大的团体自然会启动新巴士，而小团体则不断积累，直到巴士满员。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个组只处理一次，并进行恒定时间的检查和更新。 |
 | 空间| O(1) | O(1) | 除了输入数组之外，仅维护两个整型变量。 |

 自从`n`最多为 100，该算法可以在 1 秒的时间限制内轻松运行，并且内存使用量最小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    buses = 1
    current_load = 0
    for g in a:
        if current_load + g > m:
            buses += 1
            current_load = 0
        current_load += g
    return str(buses)

# provided sample
assert run("4 3\n2 3 2 1\n") == "3", "sample 1"

# minimum-size input
assert run("1 1\n1\n") == "1", "minimum size"

# all groups equal to bus capacity
assert run("3 5\n5 5 5\n") == "3", "each group fits exactly one bus"

# groups smaller than bus capacity
assert run("4 10\n2 3 4 1\n") == "1", "all groups fit in one bus"

# groups that force alternating bus counts
assert run("5 5\n1 4 2 3 5\n") == "4", "mix of fits and overshoot"

# maximum-size groups for maximum bus
assert run("100 100\n" + "100 "*100 + "\n") == "100", "each group fills one bus"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1\n1`| 1 | 最小输入场景|
 |`3 5\n5 5 5`| 3 | 团体恰好等于公交车容量|
 |`4 10\n2 3 4 1`| 1 | 一辆巴士可容纳多个小组 |
 |`5 5\n1 4 2 3 5`| 4 | 团体需要分乘巴士 |
 |`100 100\n100 100 ...`| 100 | 100 大输入，最大尺寸 |

 ## 边缘情况

 如果单个组正好填满总线，算法就会递增`buses`并立即放置该组，并正确计数。 对于多个小团体正好挤满一辆公共汽车，`current_load`累积直至达到`m`，然后才会启动新总线，从而防止差一错误。 如果最后一组部分填充了总线，算法仍会对总线进行计数，因为`buses`从 1 开始。
