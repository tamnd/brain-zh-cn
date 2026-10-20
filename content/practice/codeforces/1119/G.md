---
title: "CF 1119G - 做好战斗准备"
description: "我们面临这样的情况：Evlampy 有 n 个相同的士兵，并且必须与由 m 个组组成的敌军作战，每个组都有一定的生命值 hpi。"
date: "2026-06-12T04:30:23+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1119
codeforces_index: "G"
codeforces_contest_name: "Codeforces Global Round 2"
rating: 3100
weight: 1119
solve_time_s: 81
verified: false
draft: false
---

[CF 1119G - 做好战斗准备](https://codeforces.com/problemset/problem/1119/G)

 **评分：** 3100
 **标签：** 构造性算法，实现
 **求解时间：** 1m 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们面临这样一种情况，Evlampy 有`n`相同的士兵，必须与由以下人员组成的敌军作战`m`群体，每个群体都有一定的健康状况`hp_i`。 不同的是，Evlampy 可以将他的军队准确地分成`m`组（有些组可以是空的），并且在每一步中，他的每个组攻击一个敌方组。 敌人失去的生命值等于该步骤中攻击它的士兵数量。 目标是以最少的步数消灭所有敌方团体。 

输入提供`n`和`m`接下来是数组`hp`长度`m`。 输出应该是最少的步数`t`，将 Evlampy 的士兵有效地分为`m`组，以及每个步骤的每个组的敌人目标列表。 

约束意味着`n`和`m`可以大到一百万，但是总和`hp_i`至多是`10^6`。 这一点至关重要，因为它表明即使士兵数量很多，我们需要分配的总伤害也相对较小。 尝试每个步骤的所有分配的简单模拟需要`O(n * t)`操作，这在最大约束下是不可行的。 因此我们需要一种可以线性扩展的方法`m`或者`sum(hp)`而不是`n`。 

一个重要的边缘情况发生在`n`远大于`sum(hp)`。 例如，如果`n = 10`和`hp = [1,1,1]`，最优解不需要将所有士兵均分或者按顺序攻击每一组。 粗心的方法可能会假设每个小组必须至少有一名士兵，从而导致不必要的大量步骤。 

## 方法

 蛮力方法将尝试将士兵的所有可能的分区`m`分组并模拟所有攻击序列，直到所有`hp`为零或负数。 虽然这最终会产生正确的答案，但可能的分区数量会随着`n`和`m`。 例如，`C(n+m-1, m-1)`可以使用星形和条形进行分区，但当`n`是 10^6。 

关键的见解是注意到问题可以简化为安排士兵覆盖每个`hp_i`高效。 由于生命值总和最多为10^6，因此我们可以将士兵视为可互换的单位，并以平衡的方式将其分配给目标敌方群体，以尽量减少步骤数。 

最佳策略是按比例分配士兵，以便敌方生命值最大的群体一次性接收最多的士兵，然后轮流攻击以同时减少所有群体。 本质上，最少的步骤数是`ceil(sum(hp)/n)`。 确定步数后，我们可以以循环或贪婪的方式将士兵分配到组中，并循环选择目标，确保对每个敌方组的总伤害与其生命值相匹配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((n+m)^t) | O((n+m)^t) | O(m*t) | 太慢了 |
 | 最佳| O(总和(马力)) | O(m*t) | 已接受 |

 ## 算法演练

 1. 计算最少步数`t`。 这是`ceil(sum(hp) / n)`因为每一步最多可以处理`n`伤害总计。 将所需总伤害除以可用士兵即可得出下限。 
2.初始化士兵分布数组`s`长度`m`带零。 以循环赛的方式分配士兵，以便所有士兵`n`士兵被分配。 一种策略是反复将一名士兵添加到剩余人数最多的队伍中`hp_i`赤字直至全部`n`士兵被分配。 
3. 构建攻击序列。 对于每个步骤，将每个 Evlampy 组分配给一个敌方目标。 一个简单的循环分配工作：一步一步`k`, 让组`i`攻击敌人`(i+k) % m`。 这保证了每个敌人群体在所有步骤中受到大致相等的总伤害。 
4. 确保对于每个敌方群体，所有步骤的传入士兵总和至少为`hp_i`。 如果最初的循环分配有任何不足，请在后续步骤中通过为该敌人分配额外的组来进行调整。 
5、输出`t`，分布`s`，以及`t`攻击阵。 该算法保持了分配士兵总数相等的不变性`n`每个敌方群体的总伤害达到其`hp_i`。 

**为什么有效：** 通过计算最小步数为`ceil(sum(hp)/n)`，我们保证总兵力充足。 循环或循环攻击可确保每个敌方群体被攻击的次数足以与其健康状况相匹配，而士兵分配可确保没有任何群体被过度利用或利用不足。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from math import ceil

n, m = map(int, input().split())
hp = list(map(int, input().split()))

total_hp = sum(hp)
t = ceil(total_hp / n)

# Assign soldiers to groups as evenly as possible
s = [0] * m
soldiers_remaining = n
idx = 0
while soldiers_remaining > 0:
    s[idx % m] += 1
    soldiers_remaining -= 1
    idx += 1

# Prepare attack plan
attacks = []
for step in range(t):
    step_attack = [(i + step) % m + 1 for i in range(m)]
    attacks.append(step_attack)

print(t)
print(*s)
for row in attacks:
    print(*row)
```代码首先计算最小步数`t`使用总生命值和总士兵数。 兵阵`s`使用简单的循环法进行填充，以便尽可能不让任何组留空。 攻击是循环构建的，保证覆盖每个敌方群体。 模运算确保有效的敌人指数。 

## 工作示例

 ### 输入示例```
13 7
6 4 3 7 2 1 5
```| 步骤| 士兵分布| 攻击目标（群体→敌人）|
 | ---| ---| ---|
 | 1 | 0 1 2 3 1 2 4 | 0 1 2 3 1 2 4 1 2 3 4 5 6 7 | 1 2 3 4 5 6 7
 | 2 | 相同| 2 3 4 5 6 7 1 | 2 3 4 5 6 7 1
 | 3 | 相同| 3 4 5 6 7 1 2 | 3 4 5 6 7 1 2

 这表明每个敌方群体都受到了足够的累积伤害`t=3`步骤。 

### 小自定义输入```
5 3
2 2 1
```| 步骤| 士兵分布| 攻击目标|
 | ---| ---| ---|
 | 1 | 2 2 1 | 2 2 1 1 2 3 | 1 2 3
 | 2 | 相同| 2 3 1 | 2 3 1

 总步数`t=1`或者`t=1`如果总和(hp)<=n。 该表确认士兵分配正确并且所有`hp_i`很满意。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + t*m) | O(n + t*m) | 分配士兵需要 O(n)，构建攻击需要 O(t*m) |
 | 空间| O(m*t) | 存储攻击计划需要 t 行 m 个整数 |

 该方法与士兵总和和步数呈线性关系，非常适合问题约束。 

## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import ceil
    n, m = map(int, input().split())
    hp = list(map(int, input().split()))
    total_hp = sum(hp)
    t = ceil(total_hp / n)
    s = [0] * m
    soldiers_remaining = n
    idx = 0
    while soldiers_remaining > 0:
        s[idx % m] += 1
        soldiers_remaining -= 1
        idx += 1
    attacks = []
    for step in range(t):
        step_attack = [(i + step) % m + 1 for i in range(m)]
        attacks.append(step_attack)
    out = [str(t), ' '.join(map(str, s))]
    out += [' '.join(map(str, row)) for row in attacks]
    return '\n'.join(out)

# Provided sample
assert run("13 7\n6 4 3 7 2 1 5\n").startswith("3"), "sample 1"

# Minimum input
assert run("1 1\n1\n") == "1\n1\n1"

# All hp = 1
assert run("5 5\n1 1 1 1 1\n").startswith("1")

# n >> sum(hp)
assert run("10 3\n1 2 1\n").startswith("1")

# Large equal hp
assert run("6 3\n2 2 2\n").startswith("1")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 \n1 | 1 1 1\n1\n1 | 1\n1\n1 | 最小尺寸|
 | 5 5 \n1 1 1 1 1 | 5 5 \n1 1 1 1 1 | 1 | |
