---
title: "CF 2199A - 游戏"
description: "Alice 和 Bob 玩三轮纸牌游戏，每轮都有 0 到最大 k 之间的独立分数。 前两轮已经进行，Alice 和 Bob 在第一轮得分 a1、b1，在第二轮得分 a2、b2。"
date: "2026-06-07T20:22:56+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 2199
codeforces_index: "A"
codeforces_contest_name: "Kotlin Heroes: Episode 14"
rating: 1000
weight: 2199
solve_time_s: 196
verified: true
draft: false
---

[CF 2199A - 游戏](https://codeforces.com/problemset/problem/2199/A)

 **评分：** 1000
 **标签：** *特别
 **求解时间：** 3m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 爱丽丝和鲍勃玩三轮纸牌游戏，每轮之间都有独立的分数`0`和最大`k`。 前两轮已经进行，爱丽丝和鲍勃得分`a1, b1`在第一轮和`a2, b2`在第二轮中。 第三轮比赛还没有开始，但比分肯定不同，而且都在`[0, k]`。 目标是确定鲍勃在第三轮中是否有任何场景可以让他赢得比赛，或者无论第三轮的结果如何，爱丽丝是否都会获胜。 

获胜主要取决于所有三轮的总积分。 如果总分相同，则三人中赢得回合数多的玩家获胜。 这意味着，如果分差足够小，或者到目前为止，Alice 和 Bob 的回合胜利次数相同，第三轮就有可能推翻获胜者。 

限制很小：`k`最多 50 个，最多有`10^4`测试用例。 这使得详尽的模拟变得可行，因为第三轮每个玩家最多只有 51 种可能性，并且每个测试用例都可以独立评估。 非明显的边缘情况包括爱丽丝总共领先一分或以微弱优势赢得两轮的情况，因为第三轮中的小比分操纵可能会改变获胜者或决胜局。 

例如，如果`k=5`,`a1=3, b1=4`,`a2=2, b2=1`，即使爱丽丝赢得了第二轮，鲍勃仍然可以在第三轮中得分 5 分而获胜，而爱丽丝得分 0。 粗心的实施可能只比较总分而忽略回合胜利，从而在总分平局时产生错误的判决。 

## 方法

 天真的方法是蛮力：枚举每个可能的分数对`(a3, b3)`对于第三轮，`0 ≤ a3, b3 ≤ k`和`a3 ≠ b3`，然后计算总分并计算每个场景赢得的回合数。 如果 Bob 在任意组合中获胜，则输出`YES`; 否则，`NO`。 这有效是因为`k`很小，但在最坏的情况下，每个测试用例的时间复杂度为 O(k^2)，这对于`k=50`和`t=10^4`但可以优化。 

关键的观察是只有极端的分数才重要。 鲍勃获胜的最佳机会是在第三轮中最大化他的分数，同时最小化爱丽丝的分数。 相反，即使在鲍勃的最佳情况下，爱丽丝仍然拥有更高的总分，或者不能在获胜的回合中失去决胜局，但爱丽丝都会获胜。 这将问题简化为一个简单的检查：计算鲍勃在第三轮中可以产生的最大分数差（`b3 - a3 = k - 0 = k`），将其添加到他当前的领先优势（或落后优势）中，然后比较总数和获胜的回合数。 如果鲍勃在总积分上无法超过爱丽丝，或者即使在最大增量下也无法赢得更多回合，那么爱丽丝无条件获胜。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个测试用例 O(k^2) | O(1) | O(1) | 已接受但可以简化 |
 | 最佳 | 每个测试用例 O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`k`和分数`a1, b1`和`a2, b2`。 
3. 计算Alice当前的总分（`totalA = a1 + a2`）和鲍勃（`totalB = b1 + b2`）。 
4. 计算 Alice 赢得的回合数（`roundA`）并且鲍勃赢了（`roundB`）在前两轮中通过比较`a1 > b1`和`a2 > b2`。 
5. 计算Bob在第三轮中可以达到的最大分数差，即`k - 0 = k`。 
6. 通过添加来检查 Bob 是否可以超过 Alice 的总分`k`到`totalB`假设爱丽丝在第三轮得分为 0。 如果`totalB + k > totalA`， 输出`YES`。 
7. 如果第三轮后总成绩平局，则检查该轮获胜。 鲍勃必须能够比爱丽丝赢得更多回合。 如果回合胜差太大，鲍勃无法在一轮中克服，则输出`NO`。 
8. 如果总分和回合数均不允许 Bob 获胜，则输出`NO`。 

为什么有效：不变的是，只有在鲍勃在第三轮中尽最大努力的情况下，爱丽丝要么获得更高的总分，要么赢得决胜局，才会无条件获胜。 这保证了正确性，因为我们只需要考虑Bob的极端评分场景，避免不必要的枚举。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    k = int(input())
    a1, b1 = map(int, input().split())
    a2, b2 = map(int, input().split())
    
    totalA = a1 + a2
    totalB = b1 + b2
    
    roundsA = (a1 > b1) + (a2 > b2)
    roundsB = (b1 > a1) + (b2 > a2)
    
    # Maximum Bob can score and minimum Alice can score in round 3
    maxBob = totalB + k
    minAlice = totalA + 0
    
    if maxBob > minAlice:
        print("YES")
    elif maxBob == minAlice:
        # Check if Bob can win the tie-breaker (round wins)
        # Bob can only win one additional round in third round
        if roundsB + 1 > roundsA:
            print("YES")
        else:
            print("NO")
    else:
        print("NO")
```该代码计算前两轮的总数和胜负。 然后，它模拟极端可能的第三轮，以检查鲍勃是否可以通过总分或轮数获胜。 使用直接比较可以避免完全枚举，在保持正确性的同时简化逻辑。 边界情况，例如`a3=0, b3=k`本质上会被处理，因为我们假设对鲍勃来说是最好的。 

## 工作示例

 **示例1**

 输入：`k=6`,`a1=2, b1=3`,`a2=1, b2=4`| 总计A | 总计 B | 回合A | 回合 B | 麦克斯鲍勃 | 敏爱丽丝 | 决定|
 | --- | --- | --- | --- | --- | --- | --- |
 | 3 | 7 | 0 | 2 | 13 | 3 | 是 |

 Bob 在第 3 轮中得分为 6，Alice 得分为 0。TotalB = 7 + 6 = 13 > 3，因此 Bob 有获胜的情况。 

**示例2**

 输入：`k=3`,`a1=3, b1=1`,`a2=3, b2=1`| 总计A | 总计 B | 回合A | 回合 B | 麦克斯鲍勃 | 敏爱丽丝 | 决定|
 | --- | --- | --- | --- | --- | --- | --- |
 | 6 | 2 | 2 | 0 | 5 | 6 | 否 |

 即使鲍勃在第 3 轮中得分为 3，而爱丽丝得分为 0，totalB = 5 < 6。爱丽丝无条件获胜。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t) | 每个测试用例都在恒定时间内处理，因为我们只计算总数并比较 |
 | 空间| O(1) | O(1) | 每个测试用例仅使用固定数量的变量 |

 给定`t ≤ 10^4`，该算法很容易在 2 秒的限制内运行，并且内存占用可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        k = int(input())
        a1, b1 = map(int, input().split())
        a2, b2 = map(int, input().split())
        totalA = a1 + a2
        totalB = b1 + b2
        roundsA = (a1 > b1) + (a2 > b2)
        roundsB = (b1 > a1) + (b2 > a2)
        maxBob = totalB + k
        minAlice = totalA + 0
        if maxBob > minAlice:
            output.append("YES")
        elif maxBob == minAlice:
            output.append("YES" if roundsB + 1 > roundsA else "NO")
        else:
            output.append("NO")
    return "\n".join(output)

# Provided samples
assert run("5\n6\n2 3\n1 4\n5\n3 1\n3 1\n3\n3 1\n3 1\n10\n0 1\n10 0\n4\n3 1\n3 1\n") == "YES\nYES\nNO\nYES\nNO"

# Custom cases
assert run("1\n1\n0 1\n0 1\n") == "YES" # Bob can tie in totals but win last round
assert run("1\n50\n50 0\n50 0\n") == "NO" # Alice already guaranteed win
assert run("1\n10\n5 5\n5 5\n") == "YES" # Close totals, Bob can surpass
```
