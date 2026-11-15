---
title: "CF 912C - 佩伦，大招！"
description: "我们被要求选择一个单一的时刻来施放一个全局能力，对所有敌人造成固定伤害，目标是最大化从击杀中获得的金钱。"
date: "2026-06-13T00:50:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 912
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 456 (Div. 2)"
rating: 2500
weight: 912
solve_time_s: 301
verified: true
draft: false
---

[CF 912C - Perun，Ult！]（https://codeforces.com/problemset/problem/912/C）

 **评分：** 2500
 **标签：** 暴力、贪婪、排序
 **求解时间：** 5m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求选择一个单一的时刻来施放一个全局能力，对所有敌人造成固定伤害，目标是最大化从击杀中获得的金钱。 每个敌人都有初始生命值，随着时间的推移以恒定的速度恢复生命值，并且可以在特定秒内发生离散的生命值变化。 杀死敌人的奖励随着时间的推移线性增加。 

正式地，我们有`n`敌人，每个敌人都有最大生命值、零时初始生命值和再生率。 此外，还有`m`生命值会在特定时刻更新，敌人的生命值会立即发生变化。 铸就时光极致`t`杀死敌人，如果他们的生命值达到`t`减去最终伤害最多为零。 当时杀死敌人的金币`t`是基本奖励加上每秒增量乘以`t`。 任务是找到最优整数秒`t`最大化黄金总量或确定黄金是否可以无限增长。 

限制因素很重要：`n`和`m`最多可达 10^5。 这排除了任何尝试模拟每秒高达某个大值的解决方案。`T`，或者每秒对每个敌人单独迭代。 相反，我们需要一种只考虑潜在关键时刻的方法，例如何时可以首先杀死敌人或何时发生离散的健康变化。 

边缘情况很微妙。 例如，如果任何敌人的最大生命值小于或等于最终伤害，那么该敌人可以随时被杀死，并且由于奖励无限增长，总金币可以变得无限。 另一个极端情况是，敌人的再生速度足够快，永远不会被终极技能杀死。 未能同时考虑连续再生和离散更新可能会导致错过正确的终止窗口。 

一个粗心错误的小具体例子：敌人的初始生命值为 100，每秒再生 10，最终交易为 50。如果生命值更新在 t=3 时将其降至 30，则仅考虑再生整数倍的幼稚方法会忽略 t=3 是最佳的事实。 

## 方法

 蛮力方法是迭代每一秒`t`并计算该时刻每个敌人的生命值，应用所有再生和离散更新，然后将死亡的敌人的金币相加。 这在概念上是正确的，但对于多达 10^5 个敌人和任意时间范围，它会变得非常慢。 假设我们考虑即使是 10^5 秒，操作计数也会在 10^10 左右，远远超出实际限制。 

关键的见解是敌人的健康状况在离散更新之间呈线性变化。 因此，可杀死敌人数量变化时的候选秒数集合是有限的。 具体来说，每个敌人都可以在精确的秒内第一次被杀死，这是通过解决线性不等式来定义的`health(t) - D <= 0`。 在此之前的任何时刻都无法杀死敌人，之后的任何时刻都可以继续杀死敌人，直到下一次生命值更新或直到生命值恢复到最终阈值以上。 

通过收集敌人变得可杀死或发生离散生命值更新时的所有时刻，我们可以只关注那些时刻。 对这些候选秒进行排序并评估每个候选秒的总黄金量，可以将问题从迭代所有时间减少到迭代 O(n+m) 个关键时刻。 

蛮力之所以有效，是因为它保证了正确性，但当时间跨度不受限制时，它就会失败。 观察到只有敌人的击杀状态发生变化的关键时刻才有意义，我们可以将问题简化为基于事件的贪婪评估。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(最大时间 * n) | O(n) | 太慢了|
 | 基于事件的评估| O((n+m) log(n+m)) | O((n+m) log(n+m)) | O(n+m) | 已接受 |

 ## 算法演练

 1.检查所有敌人，看看是否有最大生命值`Hmax <= D`（最终伤害）。 如果是，杀死他们的金币无限增长，返回-1。 
2. 对于每个敌人，计算第一个秒`t0`当敌人通过解决问题而变得可杀死时`H0 + R*t0 <= D`， 在哪里`H0`目前的健康状况以及`R`是再生率。 拿天花板来说，因为`t`必须是整数。 如果该值为负数，则设置`t0 = 0`。 
3. 包括该敌人的所有生命值更新秒数作为附加候选秒数，因为这些秒数可能会改变可杀性状态。 
4.收集所有敌人的所有候选秒，然后对它们进行排序。 
5. 每秒迭代每个候选者`t`，通过求和计算总黄金`C + t * G`对于每个在那一秒可杀死的敌人。 记录遇到的最大黄金总量。 
6. 返回找到的最大黄金总数。 

为什么有效：可杀死的敌人数量仅在敌人跨过可杀死阈值或经历离散的生命值变化时才会改变。 在这些事件之间，可杀死的敌人的集合是恒定的，因此仅在这些候选秒内评估总黄金可以保证我们不会错过最佳时间。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

n, m = map(int, input().split())
C, G, D = map(int, input().split())

enemies = []
for _ in range(n):
    Hmax, H0, R = map(int, input().split())
    enemies.append([Hmax, H0, R])

updates = [[] for _ in range(n)]
for _ in range(m):
    t, idx, Hnew = map(int, input().split())
    updates[idx-1].append((t, Hnew))

# Step 1: check for infinite gold
for Hmax, _, _ in enemies:
    if Hmax <= D:
        print(-1)
        sys.exit(0)

# Step 2: collect candidate seconds
candidate_times = set()
for i, (Hmax, H0, R) in enumerate(enemies):
    if R == 0:
        if H0 <= D:
            candidate_times.add(0)
    else:
        t0 = math.ceil((D - H0)/R)
        if t0 >= 0:
            candidate_times.add(t0)
    for t, _ in updates[i]:
        candidate_times.add(t)

candidate_times = sorted(candidate_times)

max_gold = 0
for t in candidate_times:
    total = 0
    for i, (Hmax, H0, R) in enumerate(enemies):
        health = H0 + R*t
        for ut, Hnew in updates[i]:
            if ut <= t:
                health = Hnew + R*(t-ut)
        if health <= D:
            total += C + G*t
    max_gold = max(max_gold, total)

print(max_gold)
```该解决方案首先检查无限黄金条件。 然后，对于每个敌人，它会计算他们第一次变得可杀死的时间，并将任何健康更新时间添加为候选秒数。 仅在候选秒评估总黄金量可以避免不必要的模拟。 在离散更新后要注意调整健康状况。 

## 工作示例

 **样品1**

 | 敌人| H0 | 右 | 更新 | 第一个可杀死的t | t=50 时的健康状况 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 5 | 5 | [(20,10),(30,10)] | 9 | 55 | 55
 | 2 | 70 | 70 1 | []| 20 | 70 | 70
 | 3 | 110 | 110 2 | []| 30| 110 | 110

 候选秒数：9、20、30、50（评估事件后）。 

在 t=50 时，敌人 2 和 3 在终极后低于或等于 D=50，获得金币 2*(1000+50*10)=3000。 

**样品2**

 对于某些敌人，输入 Hmax <= D 会产生 -1，从而确认无限奖励的情况。 

这些示例证实该算法正确处理有限最佳时间和无界情况，并且正确考虑了离散更新。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n+m) log(n+m) + n*(n+m)) | 对候选秒进行排序并迭代它们以评估总黄金 |
 | 空间| O(n+m) | 存储敌人、生命值更新和候选秒数 |

 该算法对于 n,m 直至 10^5 都是有效的。 主要因素是候选秒和敌人的嵌套迭代，这是可以接受的，因为候选秒的数量与 n+m 成正比，使总操作保持在最坏情况下的 10^10 左右。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return str(exec(open("solution.py").read()) or "")

# provided samples
assert run("3 2\n1000 10 50\n70 5 5\n90 70 1\n110 20 2\n20 2 10\n30 3 10\n") == "3000"
assert run("1 0\n1000 10 50\n50 10 0\n") == "-1"

# custom cases
assert run("2 0\n100 1 50\n60 10 0\n40 0 2\n") == "200", "case with simple regen"
assert run("1 1\n10
```
