---
title: "CF 48A - 剪刀石头布"
description: "三名玩家同时选择一种经典的石头剪刀布手势：“石头”、“布”或“剪刀”。 仅当玩家的手势击败其他玩家所显示的手势时，玩家才会获胜。"rock\", \"paper\", or \"scissors\". A player wins only if their gesture defeats the gestures shown by both other players."
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "schedules"]
categories: ["algorithms"]
codeforces_contest: 48
codeforces_index: "A"
codeforces_contest_name: "School Personal Contest #3 (Winter Computer School 2010/11) - Codeforces Beta Round 45 (ACM-ICPC Rules)"
rating: 900
weight: 48
solve_time_s: 91
verified: true
draft: false
---
[CF 48A - 剪刀石头布](https://codeforces.com/problemset/problem/48/A)

 **评分：** 900
 **标签：** 实施、时间表
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 三名玩家同时选择一种经典的石头剪刀布手势：`"rock"`,`"paper"`， 或者`"scissors"`。 仅当玩家的手势击败其他玩家所显示的手势时，玩家才会获胜。 

这意味着只有在以下情况下才有赢家：

 - 一名玩家展示石头，而另外两名玩家展示剪刀。 
- 一名玩家展示剪刀，另外两名玩家展示布。 
- 一名玩家展示纸，而另外两名玩家展示石头。 

所有其他配置都不会产生赢家。 

输入恰好由三个字符串组成。 第一个属于费奥多尔叔叔，第二个属于 Matroskin，第三个属于 Sharic。 输出是代表获胜者的单个字符：`"F"`,`"M"`,`"S"`， 或者`"?"`如果没有人唯一获胜。 

限制很小，因为总是只有三个玩家并且只有三种可能的手势。 任何解决方案都会立即运行。 即使手动检查每个可能的交互也需要花费恒定的时间。 真正的挑战是正确实现游戏逻辑而不遗漏边缘情况。 

棘手的是，许多州没有赢家。 粗心的实现通常会假设总是有一个。 

考虑这个输入：```
rock
paper
scissors
```每一个姿势相对于另一个姿势来说既有利又不利。 没有人能同时击败两个对手，所以正确答案是：```
?
```简单地检查成对胜利的简单实现可能会错误地宣布获胜者。 

当两个玩家用相同的手势打平时，就会出现另一个容易的错误：```
paper
rock
rock
```正确的输出是：```
F
```纸胜石，由于两个对手都展示了石，费奥多叔叔同时击败了两者。 

相反的情况也必须正确处理：```
rock
paper
paper
```现在正确的答案是：```
M
```尽管有两名选手做出了获胜的姿态，但根据规则，仍然没有唯一的获胜者。 第一个纸上玩家获胜，因为游戏识别的是单个玩家，而不是集体手势。 由于 Matroskin 是唯一一个能够击败两个对手的玩家，因此他是胜利者。 

最后，当每个人都选择相同的手势时：```
scissors
scissors
scissors
```没有人获胜，所以输出是：```
?
```## 方法

 最直接的方法是完全按照描述来模拟游戏。 对于每个玩家，检查他们的手势是否击败了其他玩家的手势。 如果是，则该玩家获胜。 

由于只有三个玩家，这种暴力方法已经非常有效。 我们可以定义一个辅助规则，例如：

 - 石头胜剪刀
 - 剪刀胜布
 - 纸胜石

 然后，将每个玩家的手势与其他两个玩家进行比较。 

总工作量是恒定的，因为我们只进行了几次比较。 即使是最简单的实现也很容易满足限制。 

关键的观察是石头剪刀布的结构使得获胜条件变得非常小。 只有当其他两个手势相同并且特别容易受到获胜者手势的影响时，玩家才能获胜。 

例如：

 - 石头只能战胜两把剪刀
 - 剪刀只能赢两张布
 - 纸只能战胜两块石头

 这让我们可以进一步简化实现。 我们可以直接检查三种可能的获胜模式，而不是模拟每次决斗。 

这给出了一个短而干净的恒定时间解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将三个手势读入代表 Fyodor、Matroskin 和 Sharic 的变量中。 
2. 创建一个映射来描述哪个手势击败了哪个手势：

 -`"rock"`失败`"scissors"`-`"scissors"`失败`"paper"`-`"paper"`失败`"rock"`3. 检查 Fyodor 是否击败了其他两名玩家。 

当费奥多尔的手势击败了 Matroskin 的手势并且也击败了 Sharic 的手势时，情况就是如此。 
4. 如果 Fyodor 获胜，则打印`"F"`并停止。 
5. 对 Matroskin 重复相同的检查。 

如果他的手势击败了两个对手，则打印`"M"`。 
6. 对 Sharic 重复相同的检查。 

如果他的手势击败了两个对手，则打印`"S"`。 
7. 如果三个条件都不满足，则打印`"?"`。 

这涵盖了石头剪刀布之类的循环以及所有手势都相同的情况。 

### 为什么它有效

 规则将获胜者定义为手势同时击败其他手势的人。 该算法独立地检查每个玩家的确切条件。 

石头剪刀布具有确定性的结果。 一种姿态要么会打败另一个姿态，要么不会。 由于每个可能的获胜者都必须满足算法检查的条件，并且每个检查的条件都完全符合游戏规则，因此算法不会错过有效的获胜者或发明无效的获胜者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# solution

f = input().strip()
m = input().strip()
s = input().strip()

beats = {
    "rock": "scissors",
    "scissors": "paper",
    "paper": "rock"
}

if beats[f] == m and beats[f] == s:
    print("F")
elif beats[m] == f and beats[m] == s:
    print("M")
elif beats[s] == f and beats[s] == m:
    print("S")
else:
    print("?")
```程序首先按照语句要求的固定顺序读取三个手势。 使用`.strip()`是必要的，因为输入行包含换行符。 

这`beats`字典直接编码游戏规则。 例如：```
beats["rock"] == "scissors"
```意思是石头战胜剪刀。 

每个条件都会检查一名玩家是否击败了两名对手。 例如：```
beats[f] == m and beats[f] == s
```询问费奥多尔的手势是否同时击败了 Matroskin 的手势和 Sharic 的手势。 

检查的顺序并不重要，因为最多有一名玩家可以满足获胜条件。 如果没有任何条件匹配，则游戏没有唯一的获胜者，因此程序打印`"?"`。 

一个微妙的点是，关系的处理是自然的。 假设输入是：```
paper
rock
rock
```然后：```
beats["paper"] == "rock"
```对于两个对手来说都是如此，所以费奥多尔获胜是正确的。 

## 工作示例

 ### 示例 1

 输入：```
rock
rock
rock
```| 变量| 价值|
 | --- | --- |
 | f | 摇滚|
 | 米 | 摇滚|
 | s | 摇滚|

 | 检查 | 结果 |
 | --- | --- |
 | 摇滚胜摇滚| 假|
 | 没有一个玩家能够同时击败两个对手 | 真实|

 输出：```
?
```此示例显示了全平等的情况。 任何姿态都不能战胜自己，所以没有人能同时击败对手。 

### 示例 2

 输入：```
paper
rock
rock
```| 变量| 价值|
 | --- | --- |
 | f | 纸|
 | 米 | 摇滚|
 | s | 摇滚|

 | 检查 | 结果 |
 | --- | --- |
 | 纸胜石| 真实|
 | 纸再次击败石头| 真实|
 | 费奥多尔获胜 | 真实|

 输出：```
F
```该轨迹展示了关键的获胜模式：一名玩家展示的手势击败了两名对手的相同手势。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅执行固定次数的比较 |
 | 空间| O(1) | O(1) | 该程序仅存储三个字符串和一本小字典 |

 输入大小永远不会增长，因此运行时间和内存使用量保持不变。 该解决方案很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    f = input().strip()
    m = input().strip()
    s = input().strip()

    beats = {
        "rock": "scissors",
        "scissors": "paper",
        "paper": "rock"
    }

    if beats[f] == m and beats[f] == s:
        print("F")
    elif beats[m] == f and beats[m] == s:
        print("M")
    elif beats[s] == f and beats[s] == m:
        print("S")
    else:
        print("?")

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup
    return out.getvalue()

# provided sample
assert run("rock\nrock\nrock\n") == "?\n", "sample 1"

# custom cases
assert run("paper\nrock\nrock\n") == "F\n", "Fyodor wins"
assert run("rock\npaper\nrock\n") == "M\n", "Matroskin wins"
assert run("rock\nrock\npaper\n") == "S\n", "Sharic wins"
assert run("rock\npaper\nscissors\n") == "?\n", "cyclic case"
assert run("scissors\nscissors\nscissors\n") == "?\n", "all equal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`paper rock rock`|`F`| 第一个击败两个势均力敌的对手的玩家 |
 |`rock paper rock`|`M`| 第二位玩家获胜 |
 |`rock rock paper`|`S`| 第三名玩家获胜 |
 |`rock paper scissors`|`?`| 循环无赢者配置 |
 |`scissors scissors scissors`|`?`| 均等配置|

 ## 边缘情况

 考虑循环配置：```
rock
paper
scissors
```该算法分别检查每个玩家。 

费奥多尔用石头，打败了剪刀，却输给了布，所以他赢不了。 

Matroskin 使用纸，它可以打败石头，但输给剪刀。 

沙里克使用剪刀，它打败了布，但输给了石头。 

由于没有人击败两个对手，算法到达最后一个分支并打印：```
?
```现在考虑一个重复的失败手势：```
paper
rock
rock
```该算法首先检查 Fyodor：```
beats["paper"] == "rock"
```对于两个对手来说都是如此，所以答案变成：```
F
```其余的检查将被跳过，因为已经找到了有效的获胜者。 

最后，考虑所有手势都是平等的：```
rock
rock
rock
```每一次比较都会失败，因为摇滚不能打败摇滚。 三个获胜条件均不成立，因此算法正确输出：```
?
```
