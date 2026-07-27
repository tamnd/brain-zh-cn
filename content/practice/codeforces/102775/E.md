---
title: "CF 102775E - \u041a\u0430\u043c\u0435\u043d\u044c，\u043d\u043e\u0436\u043d\u0438\u0446\u044b， \u0431\u0443\u043c\u0430\u0433\u0430..."
description: "游戏有七种可能的走法，两名玩家各选择一招。 输入中的第一个单词是快乐控制器的动作，第二个单词是悲伤控制器的动作。"
date: "2026-07-27T20:38:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102775
codeforces_index: "E"
codeforces_contest_name: "ICPC Central Russia Regional Contest (CRRC 20), \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u0426\u0435\u043d\u0442\u0440\u0430\u043b\u044c\u043d\u043e\u0439 \u0420\u043e\u0441\u0441\u0438\u0438, \u043a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434"
rating: 0
weight: 102775
solve_time_s: 42
verified: true
draft: false
---

[CF 102775E - \u041a\u0430\u043c\u0435\u043d\u044c，\u043d\u043e\u0436\u043d\u0438\u0446\u044b， \u0431\u0443\u043c\u0430\u0433\u0430...](https://codeforces.com/problemset/problem/102775/E)

 **评级：** -
 **标签：** -
 **求解时间：** 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 游戏有七种可能的走法，两名玩家各选择一招。 输入中的第一个单词是快乐控制器的动作，第二个单词是悲伤控制器的动作。 任务是从快乐控制器的角度确定结果：输出`1`如果第一个玩家获胜，`-1`如果第二个玩家获胜，并且`0`如果双方选择相同的举动。 

可能的移动次数固定为七，因此没有大的输入大小可供优化。 主要的困难不是表现，而是正确地表达规则。 对所有情况进行直接模拟就足够了，因为只有少量可能的对。 即使是检查每种可能组合的方法也只能执行恒定量的工作。 

输入恰好包含两个字符串，因此内存使用量自然是恒定的。 不需要随着输入大小而增长的数据结构。 任何仅执行少量字典查找或比较的解决方案都可以轻松满足时间限制。 

主要错误来自于规则处理不彻底。 粗心的实现可能只存储一半的获胜关系，而忘记获胜者取决于两个玩家的顺序。 例如，输入：```
stone scissors
```正确的输出是：```
1
```因为石头胜剪刀。 仅检查第二步是否可以击败第一步的程序可能会逆转结果。 

另一个常见的错误是忘记抽奖箱。 例如：```
ax ax
```有正确的输出：```
0
```因为相同的动作总是会导致平局。 仅搜索获胜对的程序可能会错误地报告失败，因为它找不到获胜关系。 

## 方法

 最简单的方法是为快乐的控制者列出每对获胜的对。 当读取第一步和第二步时，我们检查该对是否出现在获胜组合中。 如果是的话，答案是`1`。 如果出现相反的对，则第二个控制器获胜，答案是`-1`。 如果两者都没有发生，则移动是相等的，答案是`0`。 

这种蛮力的想法已经足够快了，因为游戏只有七步。 最多有 49 个可能的有序走法对，检查它们需要固定数量的操作。 

更结构化的实现将所有获胜关系存储在一个集合中。 这将解决方案从手动检查许多条件更改为执行单个成员资格测试。 关键的观察是，规则描述了一种有向关系：一个动作可以击败另一个动作，但反之则并不总是如此。 一组有序对恰好代表了这种结构。 

蛮力解决方案之所以有效，是因为状态空间很小，但如果移动次数增加，它可能会变得难以维护。 通过观察规则只是有向边的集合，我们可以紧凑地表示游戏并通过恒定时间查找来回答查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读所选的两个动作。 第一个值属于快乐控制器，第二个值属于悲伤控制器，因此保持这个顺序对于确定答案的符号是必要的。 
2. 存储第一个元素击败第二个元素的所有获胜棋子对。 每对都是有向的，因为`stone`殴打`scissors`并不意味着`scissors`节拍`stone`。 
3.检查是否配对`(first_move, second_move)`出现在获胜组中。 如果存在，则快乐的控制器获胜，答案是`1`。 
4.检查是否配对`(second_move, first_move)`存在。 如果存在，则悲伤的控制器获胜，因为第二个玩家的移动击败了第一个玩家的移动。 
5. 如果两个有序对都不存在，则唯一剩下的可能性是两个动作相同。 输出`0`。 

这样做的原因是每个非平局游戏状态都有一个获胜方向。 存储的关系包含所有可能的胜利，因此当有获胜者时，必须找到两个有序对之一。 相同的动作在任何一个方向上都不会产生获胜关系，这自然会产生平局。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    first, second = input().split()

    wins = {
        ("stone", "scissors"),
        ("stone", "controller"),
        ("stone", "knife"),
        ("scissors", "paper"),
        ("scissors", "pliers"),
        ("scissors", "controller"),
        ("paper", "ax"),
        ("paper", "stone"),
        ("paper", "pliers"),
        ("pliers", "stone"),
        ("pliers", "knife"),
        ("pliers", "ax"),
        ("knife", "controller"),
        ("knife", "paper"),
        ("knife", "scissors"),
        ("ax", "knife"),
        ("ax", "scissors"),
        ("ax", "stone"),
        ("controller", "pliers"),
        ("controller", "ax"),
        ("controller", "paper"),
    }

    if (first, second) in wins:
        print(1)
    elif (second, first) in wins:
        print(-1)
    else:
        print(0)

if __name__ == "__main__":
    solve()
```输入部分精确读取两个字符串并保持它们的顺序，因为第一个值始终代表快乐的控制器。 

这`wins`集合包含有序对。 使用集合可以避免一长串的条件语句，并使游戏规则和实现之间的关系变得直接。 每次查找都是恒定时间。 

第一次成员资格检查询问快乐的控制器是否有获胜的动作。 第二次检查反转配对并询问悲伤的控制器是否获胜。 相等的动作或任何不可能的对到达最后的分支并产生平局。 

没有边界计算、循环或数值运算，因此不会出现溢出或相差一错误等问题。 唯一需要注意的实施细节是以正确的方向编写每个获胜关系。 

## 工作示例

 ### 示例 1

 输入：```
stone paper
```追踪：

 | 步骤| 第一步| 第二招| 格纹对 | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 石头| 纸| （石头、纸）| 不在胜利|
 | 2 | 石头| 纸| （纸、石头）| 在胜利|
 | 3 | 石头| 纸| 输出| -1 |

 第一个玩家与纸上没有获胜关系。 存在相反的关系，因为纸战胜了石头，所以悲伤的控制者获胜。 

### 示例 2

 输入：```
ax ax
```追踪：

 | 步骤| 第一步| 第二招| 格纹对 | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 斧头| 斧头| （斧头，斧头）| 不在胜利|
 | 2 | 斧头| 斧头| （斧头，斧头）| 不在胜利|
 | 3 | 斧头| 斧头| 输出| 0 |

 两个玩家都没有获胜关系，因为两人都选择了相同的着法。 该算法正确识别平局。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 该算法执行两次包含固定数量移动的集合查找。 |
 | 空间| O(1) | O(1) | 获胜关系包含固定数量的对，与输入大小无关。 |

 该解决方案很容易满足限制，因为整个计算是恒定时间并且仅使用少量固定内存。 

## 测试用例```python
import sys
import io

def solve():
    first, second = input().split()

    wins = {
        ("stone", "scissors"),
        ("stone", "controller"),
        ("stone", "knife"),
        ("scissors", "paper"),
        ("scissors", "pliers"),
        ("scissors", "controller"),
        ("paper", "ax"),
        ("paper", "stone"),
        ("paper", "pliers"),
        ("pliers", "stone"),
        ("pliers", "knife"),
        ("pliers", "ax"),
        ("knife", "controller"),
        ("knife", "paper"),
        ("knife", "scissors"),
        ("ax", "knife"),
        ("ax", "scissors"),
        ("ax", "stone"),
        ("controller", "pliers"),
        ("controller", "ax"),
        ("controller", "paper"),
    }

    if (first, second) in wins:
        return "1"
    if (second, first) in wins:
        return "-1"
    return "0"

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        return solve()
    finally:
        sys.stdin = old_stdin

assert run("stone paper\n") == "-1", "sample 1"
assert run("ax ax\n") == "0", "sample 2"

assert run("stone scissors\n") == "1", "direct win"
assert run("controller paper\n") == "1", "controller special move"
assert run("paper ax\n") == "1", "reverse direction check"
assert run("knife stone\n") == "-1", "second player win"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 石头纸| -1 | 检查第二个玩家获胜的情况。 |
 | 斧头 斧头 | 0 | 检查绘图条件。 |
 | 石头剪刀| 1 | 检查第一玩家的直接胜利。 |
 | 控制纸| 1 | 检查特殊动作交互之一。 |
 | 纸斧| 1 | 检查是否正确处理了存储的方向。 |
 | 刀石| -1 | 检查逆转获胜关系。 |

 ## 边缘情况

 对于相同的移动，算法会检查两个方向并发现没有获胜的对。 对于输入：```
ax ax
```这对`(ax, ax)`胜出组中不存在，并且反转对相同且也不存在。 最终分支输出`0`，符合规则。 

对于逆转的胜利，输入的顺序很重要。 和：```
knife stone
```这对`(knife, stone)`不是一种双赢的关系。 反转对`(stone, knife)`存在是因为石头战胜了刀。 算法输出`-1`，正确地将胜利分配给第二个控制器。 

为了特殊的举动`controller`，实现将其视为其他所有动作。 和：```
controller ax
```这对`(controller, ax)`存在，所以第一个控制器获胜，答案是`1`。 这证实了不常见的动作不会被意外地忽略或以不同的方式处理。 

如果您需要更接近官方竞赛解释的内容，我还可以将其改编成更短的 Codeforces 风格的编辑格式。
