---
title: "CF 74A - 室长"
description: "我们会获得 Codeforces 房间中每个参与者的记分牌数据。 每个参赛者都有一个手柄、成功破解次数、失败破解次数以及从问题 A 到问题 E 获得的分数。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 74
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 68"
rating: 1000
weight: 74
solve_time_s: 95
verified: true
draft: false
---

[CF 74A - 房间领导](https://codeforces.com/problemset/problem/74/A)

 **评分：** 1000
 **标签：** 实施
 **求解时间：** 1m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们会获得 Codeforces 房间中每个参与者的记分牌数据。 每个参赛者都有一个手柄、成功破解次数、失败破解次数以及从问题 A 到问题 E 获得的分数。 

一名参与者的总分计算如下：

 - 五个问题分数的总和，
 - 加`100 × successful_hacks`，
- 减`50 × unsuccessful_hacks`。 

我们的任务只是确定哪个参与者最终得分最高并打印他们的句柄。 

限制非常小。 参与者最多有50个，每个参与者只有固定数量的信息。 即使是低效的解决方案也能在时间限制内轻松完成。 对参赛者进行一次传递就足够了。 

主要的实施风险不是算法复杂性，而是正确计算分数并正确处理负总数。 

一个容易犯的错误就是忘记了不成功的黑客行为会扣分。 

例子：```
2
alice 0 0 500 500 500 500 500
bob 0 10 500 500 500 500 500
```爱丽丝有`2500`点。 

鲍勃有`2500 - 10 × 50 = 2000`。 

正确的输出是：```
alice
```忽略黑客惩罚的粗心实现会错误地选择 Bob 为平局或相等。 

另一个微妙的情况是，参赛者什么也没解决，但由于黑客攻击失败而仍然得到负分。 

例子：```
2
x 0 5 0 0 0 0 0
y 0 0 0 0 0 0 0
```选手`x`有`-250`， 尽管`y`有`0`。 

正确的输出是：```
y
```如果我们将最佳分数初始化为`0`而不是安全的小东西，那么全阴性的情况可能会失败。 

第三个常见错误是错误地读取输入，因为句柄是字符串，而其余字段是整数。 

例子：```
1
tourist_123 1 0 500 1000 1500 2000 2500
```正确的输出是：```
tourist_123
```解析器必须将句柄与数值分开。 

## 方法

 蛮力的想法很简单。 对于每个参与者，根据输入字段计算他们的最终分数，然后将其与其他每个参与者进行比较以检查是否是最大值。 

这是有效的，因为参赛者的数量很少。 如果有`n`参与者，这种方法的表现大致如下`n²`比较。 和`n ≤ 50`，那就只有`2500`最坏情况下的比较。 

这种方法的问题不在于性能，而在于不必要的工作。 一旦我们计算了参赛者的分数，我们实际上不需要将其与其他人单独进行比较。 我们只关心当前的最大值。 

这种观察导致了最佳方法。 在一一阅读参与者的同时，我们立即计算他们的分数并维护两个变量：

 - 迄今为止最好的成绩，
 - 相应的句柄。 

每当新参与者得分较高时，我们都会更新这两个值。 

这减少了从重复比较到单个线性扫描的工作量。 问题的结构使这一点变得很自然，因为获胜者仅取决于最高分，而不取决于参赛者之间的任何配对关系。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 已接受 |
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取整数`n`，参赛者人数。 
2.初始化两个变量：

 -`best_score`作为一个极少数，
 -`best_handle`作为空字符串。 

我们需要这些变量来在处理输入时跟踪当前的领导者。 
3. 对于每位参赛者：

 - 读取手柄，
 - 读取成功黑客攻击的数量，
 - 读取不成功的黑客攻击的数量，
 - 阅读五个问题的分数。 
4. 使用以下公式计算参赛者的总分：```
total = sum(problem_scores) + 100 × successful_hacks - 50 × unsuccessful_hacks
```5. 将此总分与`best_score`。 
6. 如果新分数更大：

 - 更新`best_score`，
- 更新`best_handle`。 

这可以在处理完每个参赛者后保持领导者信息的正确性。 
7. 所有参赛者处理完毕后，打印`best_handle`。 

### 为什么它有效

 处理完参赛者的任意前缀后，`best_score`存储所有已处理参与者中的最高分数，以及`best_handle`存储相应的句柄。 

最初这个不变量是正确的，因为还没有处理任何参赛者，并且`best_score`小于任何可能的真实分数。 

当处理新的参赛者时，只有两种可能：

 - 他们的分数不大于当前的最大值，因此领导者不会改变，
 - 他们的分数更大，因此替换存储的领导者可以保持不变式为真。 

在最终参赛者之后，不变量保证存储的句柄属于整个房间中得分最高的参赛者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())

best_score = -10**18
best_handle = ""

for _ in range(n):
    parts = input().split()

    handle = parts[0]
    plus = int(parts[1])
    minus = int(parts[2])

    scores = list(map(int, parts[3:]))

    total = sum(scores) + plus * 100 - minus * 50

    if total > best_score:
        best_score = total
        best_handle = handle

print(best_handle)
```解决方案直接遵循算法。 

第一个重要的细节是如何解析输入行。 句柄是单独存储的，因为它是字符串，而其余字段是整数。 

分数计算完全符合比赛规则。 成功的黑客添加`100`积分，不成功的黑客减去`50`，五个问题的分数按正常情况求和。 

变量`best_score`被初始化为一个非常小的值而不是`0`。 这可以避免当每个参赛者都有负分时出现错误。 

该解决方案在计算每个参与者的分数后立即更新领导者，因此不需要额外的数组或排序。 

## 工作示例

 ### 示例 1

 输入：```
5
Petr 3 1 490 920 1000 1200 0
tourist 2 0 490 950 1100 1400 0
Egor 7 0 480 900 950 0 1000
c00lH4x0R 0 10 150 0 0 0 0
some_participant 2 1 450 720 900 0 0
```| 参赛者| 问题总和| 黑客奖励/惩罚 | 总计 | 现任领导者 |
 | --- | --- | --- | --- | --- |
 | 彼得 | 3610 | 3610 +250 | 3860 | 3860 彼得 |
 | 旅游| 3940 | 3940 +200 | 4140 | 4140 旅游|
 | 叶戈尔 | 3330| +700 | 4030 | 4030 旅游|
 | c00lH4x0R | 150 | 150 -500| -350 | -350 旅游|
 | 一些_参与者 | 2070 | 2070 +150 | 2220 | 2220 旅游|

 最终输出：```
tourist
```此跟踪显示仅当出现较大分数时运行最大值如何变化。 

### 示例 2

 输入：```
3
alice 0 5 0 0 0 0 0
bob 0 0 0 0 0 0 0
charlie 1 0 0 0 0 0 0
```| 参赛者| 问题总和| 黑客奖励/惩罚 | 总计 | 现任领导者 |
 | --- | --- | --- | --- | --- |
 | 爱丽丝 | 0 | -250 | -250 -250 | -250 爱丽丝 |
 | 鲍勃 | 0 | 0 | 0 | 鲍勃 |
 | 查理| 0 | +100 | 100 | 100 查理|

 最终输出：```
charlie
```此示例演示了为什么必须正确处理负分数以及为什么领导者可以在扫描期间多次更改。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个参赛者只被处理一次 |
 | 空间| O(1) | O(1) | 仅存储了几个变量|

 由于最多有 50 名参赛者，该解决方案远远低于时间和内存限制。 即使较慢的方法也可以通过，但线性扫描是最干净、最简单的实现。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    n = int(input())

    best_score = -10**18
    best_handle = ""

    for _ in range(n):
        parts = input().split()

        handle = parts[0]
        plus = int(parts[1])
        minus = int(parts[2])

        scores = list(map(int, parts[3:]))

        total = sum(scores) + plus * 100 - minus * 50

        if total > best_score:
            best_score = total
            best_handle = handle

    print(best_handle)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided sample
assert run(
"""5
Petr 3 1 490 920 1000 1200 0
tourist 2 0 490 950 1100 1400 0
Egor 7 0 480 900 950 0 1000
c00lH4x0R 0 10 150 0 0 0 0
some_participant 2 1 450 720 900 0 0
"""
) == "tourist", "sample 1"

# minimum-size input
assert run(
"""1
solo 0 0 0 0 0 0 0
"""
) == "solo", "single contestant"

# negative scores
assert run(
"""2
x 0 5 0 0 0 0 0
y 0 0 0 0 0 0 0
"""
) == "y", "negative totals"

# hack bonus changes winner
assert run(
"""2
alice 0 0 500 500 500 500 500
bob 3 0 500 500 500 500 500
"""
) == "bob", "successful hacks matter"

# boundary-style large values
assert run(
"""2
maxer 50 0 500 1000 1500 2000 2500
other 0 0 500 1000 1500 2000 2500
"""
) == "maxer", "large bonuses"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单人参赛 |`solo`| 最小尺寸输入 |
 | 负分案例 |`y`| 负总数的正确处理|
 | 相同的问题分数但不同的技巧 |`bob`| Successful hacks are added properly |
 | 大额案例|`maxer`| 上限式算术 |

 ## 边缘情况

 考虑除一个零分外所有分数均为负数的情况。 

输入：```
2
x 0 5 0 0 0 0 0
y 0 0 0 0 0 0 0
```该算法从一个非常小的`best_score`。 

加工`x`：

 - 总计 =`-250`- 领导者成为`x`加工`y`：

 - 总计 =`0`- 自从`0 > -250`，领导者变为`y`输出是：```
y
```这是有效的，因为初始值`best_score`is smaller than every possible contestant score.

 现在考虑一个黑客惩罚决定获胜者的情况。 

输入：```
2
alice 0 0 500 500 500 500 500
bob 0 10 500 500 500 500 500
```该算法计算：

 -`alice = 2500`-`bob = 2000`领导者依然存在`alice`。 

输出是：```
alice
```这证实了不成功的黑客被正确减去。 

最后，考虑包含下划线和数字的句柄。 

输入：```
1
tourist_123 1 0 500 1000 1500 2000 2500
```解析器存储：

 - 手柄=`tourist_123`- 剩余值为整数

 正常计算总分，输出为：```
tourist_123
```这验证了实现是否正确地将字符串句柄与数字字段分开。
