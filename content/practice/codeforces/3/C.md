---
title: "CF 3C - 井字游戏"
description: "我们得到了一个 tic-tac-toe 棋盘的快照，表示为 3×3 网格。 每个单元格要么为空 (.)，要么包含十字 (X)，要么包含零 (0)。 第一个玩家总是放置十字，第二个玩家放置零。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "games", "implementation"]
categories: ["algorithms"]
codeforces_contest: 3
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 3"
rating: 1800
weight: 3
solve_time_s: 277
verified: true
draft: false
---
[CF 3C - 井字游戏](https://codeforces.com/problemset/problem/3/C)

 **评分：** 1800
 **标签：** 暴力破解、游戏、实施
 **求解时间：** 4m 37s
 **已验证：** 是的

 ## 问题理解

 我们得到了一个 tic-tac-toe 棋盘的快照，表示为 3×3 网格。 每个单元格要么是空的（`.`），包含一个十字（`X`)，或不包含任何内容 (`0`）。 第一个玩家总是放置十字，第二个玩家放置零。 棋盘可能被部分填充、完全填充，甚至处于不可能的状态。 

任务是确定游戏处于什么状态。我们可以输出六种可能的结果之一：第一个玩家赢了，第二个玩家赢了，接下来轮到第一个玩家，接下来轮到第二个玩家，游戏平局，或者棋盘不合法。 当 X 和 0 的放置不符合规则时，就会出现非法棋盘，例如，如果第二个玩家比第一个玩家玩的次数多，或者两个玩家同时都有获胜线。 

限制很小：固定的 3×3 板。 这告诉我们，任何对单元进行恒定次数迭代的解决方案都可以在 1 秒的时间限制下运行良好。 不需要基于n进行优化，因为n总是9或更少。 边缘情况很棘手，因为对“谁有更多 X”的简单检查可能无法检测到两个玩家似乎都有获胜线或计数与回合顺序不匹配的非法状态。 例如：```
XXX
000
...
```在这里，两位玩家似乎都有获胜线。 正确的输出是`illegal`。 如果不小心实现独立检查胜利而不验证回合计数，则会错误地返回`first player won`或者`second player won`。 另一个微妙的情况是：```
X0X
0X0
X..
```这里，第一个玩家沿着第一列有一条获胜线，但是 X 和 0 的计数仍然必须与第一个先移动的玩家一致。 正确的结果是`the first player won`， 不是`illegal`。 

## 方法

 暴力方法会考虑生成可能导致给定棋盘的所有可能的移动序列，并检查它是否合法。 每回合最初最多有 9 个选项，下一回合有 8 个选项，依此类推。这是阶乘复杂度 (9!)，考虑到棋盘的固定尺寸较小，这是不必要的。 这是正确的，但过于麻烦。 

最佳方法的见解是，合法性和游戏状态完全可以由两个因素决定：X 和 0 的计数以及获胜线的存在。 如果 X 的数量等于 0 的数量或者比 0 的数量多 1，则该棋盘是合法的。 如果有获胜线，获胜者必须是最后玩的，并且计数必须对齐：仅当 X 比 0 多 1 时，X 获胜； 仅当 Xs 等于 0 时，0 获胜。 X 和 0 都有获胜线的棋盘始终是非法的。 一旦合法性确定，通过比较计数来确定下一个轮到谁就很简单了。 如果棋盘已满并且没有玩家获胜，则为平局。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(9!) | O(1) | O(1) | 太慢/不必要|
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 数一下板上X和0的数量。 让这些成为`count_X`和`count_0`。 计数决定轮到谁了。 如果`count_0 > count_X`或者`count_X - count_0 > 1`，该板是非法的。 这确保了轮流顺序得到遵守。 
2. 检查获胜线。 将获胜线定义为行、列或对角线上的三个相同符号。 迭代所有行、列和两条对角线，标记 X 是否获胜以及 0 是否获胜。 
3. 如果 X 和 0 同时有获胜线，则该棋盘是非法的。 井字游戏无法达到两个玩家都在同一个棋盘上完成一条获胜线的状态，因为当一个玩家获胜时游戏立即结束。 
4. 如果 X 有获胜线，请检查`count_X == count_0 + 1`。 如果这是错误的，则该董事会是非法的。 如果为真，则输出`the first player won`。 
5. 如果 0 有获胜线，请检查`count_X == count_0`。 如果这是错误的，则该董事会是非法的。 如果为真，则输出`the second player won`。 
6. 如果没有人获胜，请检查棋盘是否已满。 如果满则输出`draw`。 如果未满，则确定轮到谁：如果`count_X == count_0`，轮到第一个玩家了； 如果`count_X == count_0 + 1`，轮到第二个玩家了。 

工作原理：该算法保持了任何决定都与井字游戏规则一致的不变性：从X开始轮流交替，当有人获胜时游戏立即结束，并且棋盘上的符号数与获胜者一致。 通过按此顺序检查计数和获胜线，所有非法配置都会被捕获。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def check_winner(board, symbol):
    for i in range(3):
        if all(board[i][j] == symbol for j in range(3)):
            return True
        if all(board[j][i] == symbol for j in range(3)):
            return True
    if all(board[i][i] == symbol for i in range(3)):
        return True
    if all(board[i][2-i] == symbol for i in range(3)):
        return True
    return False

board = [input().strip() for _ in range(3)]
count_X = sum(row.count('X') for row in board)
count_0 = sum(row.count('0') for row in board)

x_wins = check_winner(board, 'X')
o_wins = check_winner(board, '0')

if count_0 > count_X or count_X - count_0 > 1:
    print("illegal")
elif x_wins and o_wins:
    print("illegal")
elif x_wins:
    print("the first player won" if count_X == count_0 + 1 else "illegal")
elif o_wins:
    print("the second player won" if count_X == count_0 else "illegal")
elif count_X + count_0 == 9:
    print("draw")
else:
    print("first" if count_X == count_0 else "second")
```该解决方案首先计算 X 和 0 来验证轮次顺序。 这`check_winner`函数评估所有行、列和对角线以确定获胜者。 此后的每个决策都直接实现算法演练中描述的规则。 

## 工作示例

 **样品1**

 输入：```
X0X
.0.
.X.
```| 变量| 价值|
 | ---| ---|
 | 计数_X | 3 |
 | 计数_0 | 2 |
 | x_wins | 假 |
 | o_wins | 假 |
 | 董事会已满？ | 假 |

 还没有获胜者，计数是`count_X = count_0 + 1`，所以轮到第二个玩家了。 输出是`second`。 

**样品2**

 输入：```
XXX
0.0
..0
```| 变量| 价值|
 | ---| ---|
 | 计数_X | 3 |
 | 计数_0 | 3 |
 | x_wins | 真实|
 | o_wins | 假 |

 X 有一条获胜线，但是`count_X`不是`count_0 + 1`。 输出是`illegal`。 

这些痕迹显示了计数和线路检查如何强制合法性并确定回合或获胜者。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 固定 3×3 网格，恒定数量的检查（3 行 + 3 列 + 2 对角线）。 |
 | 空间| O(1) | O(1) | 只有柜台和板存储，没有额外的结构。 |

 该解决方案完全适合 1 秒时间和 64 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        # solution
        board = [input().strip() for _ in range(3)]
        count_X = sum(row.count('X') for row in board)
        count_0 = sum(row.count('0') for row in board)

        def check_winner(board, symbol):
            for i in range(3):
                if all(board[i][j] == symbol for j in range(3)):
                    return True
                if all(board[j][i] == symbol for j in range(3)):
                    return True
            if all(board[i][i] == symbol for i in range(3)):
                return True
            if all(board[i][2-i] == symbol for i in range(3)):
                return True
            return False

        x_wins = check_winner(board, 'X')
        o_wins = check_winner(board, '0')

        if count_0 > count_X or count_X - count_0 > 1:
            print("illegal")
        elif x_wins and o_wins:
            print("illegal")
        elif x_wins:
            print("the first player
```
