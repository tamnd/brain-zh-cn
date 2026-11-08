---
title: "CF 2A - 获胜者"
description: "游戏记录一系列回合。 在每一轮中，一名玩家要么获得或失去一定数量的分数。 最后，总得分最高的玩家应该获胜。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "hashing", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 2"
rating: 1500
weight: 2
solve_time_s: 69
verified: true
draft: false
---
## 问题理解

 游戏记录一系列回合。 在每一轮中，一名玩家要么获得或失去一定数量的分数。 最后，总得分最高的玩家应该获胜。 

当几个玩家获得相同的最高分时，棘手的部分就会出现。 在这种情况下，获胜者不是任意选择的。 在所有最终得分等于最大值的玩家中，我们选择在比赛中最先达到该得分的玩家。 

输入已经按时间顺序给出，因此轮次顺序很重要。 每行包含玩家的姓名和该轮的得分变化。 游戏过程中分数可能会变成负数，并且玩家可以多次移动高于或低于最终获胜分数。 

约束足够小，几乎任何合理的实现都会通过。 最多有1000轮，所以即使是$O(n^2)$解决方案仅执行大约一百万次操作。 这很容易满足时间限制。 不过，问题不在于优化，而在于正确处理平局打破规则。 

最常见的错误是仅根据最终得分来决定获胜者。 考虑这个输入：```
4
alice 5
bob 5
alice -2
bob -2
```双方球员最终各得3分。 Alice 首先达到了 3，因为在她第一步之后她已经有了 5。Bob 后来达到了 3。 正确答案是：```
alice
```仅检查最终总数的粗心解决方案无法区分这种情况。 

另一种微妙的情况发生在玩家提前达到目标分数但最终没有获得最高分数时。```
5
alice 10
bob 3
alice -8
bob 5
bob 2
```最终成绩为：```
alice = 2
bob = 10
```Alice先达到了10分，但她没有资格，因为她的最终分数不是最高分。 获胜者是：```
bob
```错误的实现可能会错误地选择第一个达到最高分数的玩家。 

与负面价值观也有重要的相互作用：```
5
alice 2
bob 3
alice 3
bob -1
alice -2
```最终成绩：```
alice = 3
bob = 2
```最终最高得分为 3。爱丽丝成为获胜者，尽管她之前暂时获得了 5 分。 该规则基于至少达到最终最高分数，不一定在某一轮结束时完全匹配它。 

## 方法

 暴力解决方案可以模拟整个游戏并在每轮后重复重新计算每个玩家的得分。 对于每一轮，我们可以扫描之前的所有轮次来确定当前的总数，然后尝试确定某人是否已经有资格成为获胜者。 

这是可行的，因为约束很小。 和$n = 1000$， 一个$O(n^2)$解决方案执行大约一百万次更新，这是完全可以接受的。 

这种方法的问题不在于性能，而在于清晰度。 平局决胜条件取决于两种不同的得分概念：

 首先，所有玩家最终的最高分。 

其次，玩家最终在游戏中达到该最大值的最早时刻。 

尝试同时计算两者会变得混乱。 

更清晰的观察是，问题自然地分为两遍。 

在第一遍中，我们计算每个玩家的最终得分。 一旦这关结束，我们就知道最终的最高分数$mx$。 

现在打破平局的规则变得更加简单。 我们只关心最终得分等于的玩家$mx$。 在这些玩家中，我们想要第一个跑分至少达到$mx$。 

这导致了非常直接的第二次传递。 我们按时间顺序重玩游戏，同时保持累计总数。 一旦玩家满足这两个条件：

 1. 最终得分相等$mx$。 
2. 他们的跑步成绩至少为$mx$。 

那个球员一定就是答案。 

第二个条件使用“至少”而不是“等于”，因为玩家可能会在稍后准确结束之前超出目标分数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有回合并将其存储在列表中，因为我们需要处理游戏两次。 
2. 在第一遍期间，维护一个字典`final_score[name]`存储每个玩家在所有回合后的总得分。 
3. 每轮处理完后，计算最终最高得分`mx`。 
4. 按时间顺序开始第二轮。 维护另一个字典`current_score[name]`代表游戏过程中的分数。 
5. 对于每一轮，更新该玩家的跑分。 
6. After updating the running score, check two conditions:

 1. 玩家最终得分等于`mx`。 
2. 玩家的跑分至少为`mx`。 
7. 第一个满足这两个条件的玩家获胜。 打印他们的名字并立即停止。 

这样做的原因是只有最终得分的玩家`mx`有资格获胜。 第二遍会发现其中谁最早达到目标，因为回合是按时间顺序处理的。 

### 为什么它有效

 第一遍之后，`mx`是游戏结束时获得的最高分。 最终得分较小的玩家无论之前的临时得分有多大，都不可能获胜。 

在第二遍的过程中，`current_score[name]`始终等于该玩家当前回合后的得分。 第一个符合条件的玩家，其总成绩至少达到`mx`正是游戏过程中最先达到获胜门槛的玩家。 

由于回合是按顺序处理的，所以后来的玩家不可能更早达到阈值。 这样就保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())

rounds = []
final_score = {}

for _ in range(n):
    name, score = input().split()
    score = int(score)

    rounds.append((name, score))

    if name not in final_score:
        final_score[name] = 0

    final_score[name] += score

mx = max(final_score.values())

current_score = {}

for name, score in rounds:
    if name not in current_score:
        current_score[name] = 0

    current_score[name] += score

    if final_score[name] == mx and current_score[name] >= mx:
        print(name)
        break
```该解决方案直接遵循两遍结构。 

第一个循环存储每一轮并计算最终总数。 将回合保留在列表中是必要的，因为第二遍必须按时间顺序重播游戏。 

字典`final_score`将每个玩家映射到所有回合后的得分。 当第一遍完成后，`mx`成为获胜的最终分数。 

第二个循环逐步重建游戏。 字典`current_score`跟踪游戏过程中的得分而不是最终总分。 

操作顺序很重要。 我们首先更新跑分，然后检查玩家是否合格。 更新之前进行检查会将每个分数移动一轮并产生错误的答案。 

条件：```
current_score[name] >= mx
```是微妙但必不可少的。 假设获胜分数为 5，而玩家暂时达到 7，随后又以 5 结束。 他们仍然算较早达到了目标。 

在找到第一个有效玩家后立即中断是正确的，因为回合是按时间顺序处理的。 

## 工作示例

 ### 示例 1

 输入：```
3
mike 3
andrew 5
mike 2
```第一遍：

 | 圆形| 玩家| 达美航空 | 最终成绩|
 | --- | --- | --- | --- |
 | 1 | 迈克| +3 | 麦克 = 3 |
 | 2 | 安德鲁 | +5 | 迈克 = 3，安德鲁 = 5 |
 | 3 | 迈克| +2 | 迈克 = 5，安德鲁 = 5 |

 最终得分最高为 5 分。 

第二遍：

 | 圆形| 玩家| 跑步成绩| 有资格的？ |
 | --- | --- | --- | --- |
 | 1 | 迈克| 3 | 没有 |
 | 2 | 安德鲁 | 5 | 是的 |

 输出：```
andrew
```该跟踪显示了为什么第二遍有效。 两名选手最终都得到了 5 分，但安德鲁在比赛中较早达到了 5 分。 

### 示例 2

 输入：```
5
alice 10
bob 3
alice -8
bob 5
bob 2
```第一遍：

 | 圆形| 玩家| 达美航空 | 最终成绩|
 | --- | --- | --- | --- |
 | 1 | 爱丽丝 | +10 | 爱丽丝 = 10 |
 | 2 | 鲍勃 | +3 | 爱丽丝 = 10，鲍勃 = 3 |
 | 3 | 爱丽丝 | -8 | 爱丽丝 = 2，鲍勃 = 3 |
 | 4 | 鲍勃 | +5 | 爱丽丝 = 2，鲍勃 = 8 |
 | 5 | 鲍勃 | +2 | 爱丽丝 = 2，鲍勃 = 10 |

 最终得分最高为 10 分。 

第二遍：

 | 圆形| 玩家| 跑步成绩| 有资格的？ |
 | --- | --- | --- | --- |
 | 1 | 爱丽丝 | 10 | 10 不，最终分数只有2 |
 | 2 | 鲍勃 | 3 | 没有 |
 | 3 | 爱丽丝 | 2 | 没有 |
 | 4 | 鲍勃 | 8 | 没有 |
 | 5 | 鲍勃 | 10 | 10 是的 |

 输出：```
bob
```此示例演示了最重要的边缘情况。 在游戏中达到最高分数是不够的。 玩家还必须以最高分数结束比赛。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每轮处理两次 |
 | 空间| O(n) | 字典和存储回合使用线性空间 |

 最多 1000 轮时，该解决方案完全在限制范围内。 即使慢得多的方法也会通过，但线性解决方案更清晰并且自然地匹配问题的结构。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    n = int(input())

    rounds = []
    final_score = {}

    for _ in range(n):
        name, score = input().split()
        score = int(score)

        rounds.append((name, score))

        final_score[name] = final_score.get(name, 0) + score

    mx = max(final_score.values())

    current_score = {}

    for name, score in rounds:
        current_score[name] = current_score.get(name, 0) + score

        if final_score[name] == mx and current_score[name] >= mx:
            print(name)
            return

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output.strip()

# provided sample
assert run(
"""3
mike 3
andrew 5
mike 2
"""
) == "andrew", "sample 1"

# minimum input size
assert run(
"""1
alice 10
"""
) == "alice", "single round"

# tie resolved by earliest reach
assert run(
"""4
alice 5
bob 5
alice -2
bob -2
"""
) == "alice", "earliest reach wins"

# temporary high score should not matter
assert run(
"""5
alice 10
bob 3
alice -8
bob 5
bob 2
"""
) == "bob", "must finish with maximum"

# negative values and multiple crossings
assert run(
"""6
a 2
b 3
a 3
b 2
a -2
b -1
"""
) == "b", "running totals handled correctly"

# all players equal final score
assert run(
"""6
x 1
y 2
x 1
y 0
x 0
y 0
"""
) == "y", "first to reach maximum among tied players"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单轮比赛| 爱丽丝 | 最小输入尺寸 |
 | 决赛平局 | 爱丽丝 | 最早到达规则 |
 | 暂时高分| 鲍勃 | 最终分数资格 |
 | 负分转换| 乙| 正确处理减少|
 | 最终总分相等| y | 按时间顺序打破平局|

 ## 边缘情况

 考虑这样一种情况：两名玩家最终得分相同，但其中一人较早达到：```
4
alice 5
bob 5
alice -2
bob -2
```最终成绩为：```
alice = 3
bob = 3
```最终得分最高为3分。 

在第二遍期间：```
alice reaches 5 after round 1
bob reaches 5 after round 2
```两个跑步分数第一次出现时都已经至少为 3，但 Alice 按时间顺序出现得更早。 该算法立即打印`alice`。 

现在考虑一个暂时领先但没有首先完成比赛的玩家：```
5
alice 10
bob 3
alice -8
bob 5
bob 2
```最终得分最高为10分。重播时，Alice先达到10分，但最终得分只有2分。条件：```
final_score[name] == mx
```正确地拒绝了她。 鲍勃最终达到 10 并获胜。 

最后，考虑目标分数的重复交叉：```
6
a 2
b 3
a 3
b 2
a -2
b -1
```最终成绩：```
a = 3
b = 4
```最终胜出的比分是4分。 

重播：```
a: 2
b: 3
a: 5
b: 5
```什么时候`b`达到5，运行分数至少为4，最终分数等于4，所以`b`立即获胜。 该算法不关心`a`早些时候超过 4 因为`a`没有以获胜总数结束。
