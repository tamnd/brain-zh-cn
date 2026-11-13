---
title: "CF 259A - 小象和国际象棋"
description: "我们有一块 8×8 的棋盘，其中每个单元格要么是白色 (W)，要么是黑色 (B)。 目标是确定这个棋盘是否可以转化为标准棋盘。 标准棋盘在水平和垂直方向上具有交替的颜色。"
date: "2026-06-04T17:39:39+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "strings"]
categories: ["algorithms"]
codeforces_contest: 259
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 157 (Div. 2)"
rating: 1000
weight: 259
solve_time_s: 155
verified: true
draft: false
---

[CF 259A - 小象和国际象棋](https://codeforces.com/problemset/problem/259/A)

 **评分：** 1000
 **标签：** 暴力破解、字符串
 **求解时间：** 2m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一块 8×8 的棋盘，其中每个单元格要么是白色的（`W`）或黑色（`B`）。 目标是确定这个棋盘是否可以转化为标准棋盘。 

标准棋盘在水平和垂直方向上具有交替的颜色。 由于左上角必须是白色，因此只有两种有效的行模式：```
WBWBWBWB
BWBWBWBW
```行必须在这两种模式之间交替。 

唯一允许的操作是选择一行并执行循环右移任意次数。 由于一行恰好包含八个单元，因此重复移位可以将该行旋转到其八个循环位置中的任何一个。 

棋盘尺寸固定为8×8。 这意味着即使是详尽的搜索也很小。 只有八行，每行长度为八，因此任何多次检查所有单元格的算法都足够快。 挑战不在于效率，而在于识别循环移位创建的结构。 

一个微妙的观察是，将交替行移动一个位置只是在两个有效的棋盘图案之间交换它。 例如：```
WBWBWBWB  -> shift once ->  BWBWBWBW
```移动两个位置将使其恢复到原始模式。 由于行长度是偶数，因此交替行的每次循环移位都会产生这两种模式之一，而不产生其他模式。 

主要边缘情况是内部不交替的行。 

例子：```
WWWBWBWB
```没有多少循环移位可以删除相邻的相等`W`s。 任何旋转仍然包含行中某处的一对相邻的相等单元格。 正确答案是`NO`。 

另一个容易犯的错误是只检查每一行是否可以独立地成为有效的交替模式。 

例子：```
WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
```每行都是单独有效的，但正确的棋盘要求相邻行不同。 正确答案仍然是`YES`，因为我们可以每隔一行移动一次并获得交替的行序列。 仅将行与其当前位置进行比较的解决方案将错误地拒绝这种情况。 

最后的边缘情况是已经形成合适棋盘的棋盘。 答案一定是`YES`因为允许使用零运算。 

## 方法

 最直接的蛮力想法是对每一行尝试每种可能的循环移位，并检查所得棋盘是否是有效的棋盘。 

每行有 8 种可能的旋转，因此有：$$8^8 = 16,777,216$$可能的配置。 尽管委员会很小，但检查超过一千六百万个州是没有必要的。 

关键的观察来自于对单行的研究。 为了使行出现在有效的棋盘中，其颜色必须交替。 由于行长度是偶数，因此每次循环移位都保留了交替特性。 更重要的是，交替行只能旋转为以下两种模式之一：```
WBWBWBWB
BWBWBWBW
```如果一行不是交替的，则任何旋转都不可能使其交替。 

这极大地减少了问题。 我们不需要考虑所有可能的移位，而只需验证每一行是否在内部交替。 一旦这是真的，每一行都可以旋转成我们需要的两个棋盘行模式中的任何一个。 

对于目标棋盘的奇数行，我们需要：```
WBWBWBWB
```对于偶数行，我们需要：```
BWBWBWBW
```由于通过选择适当的移位奇偶性，每个交替的行都可以转换为任一模式，因此当且仅当每行都是交替的时，整个板才是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(8^8·64) | O(8^8·64) | O(64) | 不必要|
 | 最佳 | O(64) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取棋盘上的八行。 
2. 对于每一行，检查该行内的每对相邻单元格。 
3.如果有任何相邻单元格颜色相同，则立即输出`NO`。 

棋盘上的一行必须交替颜色。 循环移位仅旋转位置，不会改变循环周围的颜色顺序。 如果循环中的两个相邻单元相等，则该缺陷永远不会消失。 
4. 如果所有行都通过交替检查，则输出`YES`。 

现在每一行都是一个交替循环。 由于行长度是偶数，因此旋转行可以产生以下任一结果：`WBWBWBWB`或者`BWBWBWBW`。 我们可以为每一行独立选择所需的版本并构建标准棋盘。 

### 为什么它有效

 将一行视为八个单元格的循环。 循环移位仅改变该循环的起始位置。 

如果一行在循环中的某个位置包含两个相等的相邻单元格，则每次旋转仍然包含相同的相等对。 这样的一行永远不可能成为棋盘上的交替行。 

相反，如果循环中的每个相邻对都有不同的颜色，则该行必须完全交替。 由于循环长度是偶数，因此该行由交替的`W`和`B`围绕整个周期。 旋转这样的行可以从任一颜色开始，从而准确地产生两个棋盘行图案。 

由于每一行都可以独立地成为所需的交替图案，因此当每一行交替时，整个棋盘可以准确地排列成合适的棋盘。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    board = [input().strip() for _ in range(8)]

    for row in board:
        for i in range(7):
            if row[i] == row[i + 1]:
                print("NO")
                return

    print("YES")

if __name__ == "__main__":
    solve()
```直接按照证明进行实现。 

外循环处理所有八行。 对于每一行，我们检查该行内的七个相邻对。 如果任何对包含相同的颜色，则该行不能通过任何循环移位序列转换为交替的棋盘行，因此我们立即打印`NO`。 

如果每一行都通过了测试，那么每一行就已经是一个交替序列。 这些行可以旋转以任一颜色开始，这使我们能够在每个板行上放置所需的图案。 然后我们打印`YES`。 

一个常见的错误是试图模拟轮班。 证明表明模拟是不必要的。 唯一重要的属性是每行是否交替。 

## 工作示例

 ### 示例 1

 输入：```
WBWBWBWB
BWBWBWBW
BWBWBWBW
BWBWBWBW
WBWBWBWB
WBWBWBWB
BWBWBWBW
WBWBWBWB
```| 行| 找到相邻的相等对？ |
 | --- | --- |
 | WBWBWBWB | 没有 |
 | BWBWBWBW | BWBWBWBW | 没有 |
 | BWBWBWBW | BWBWBWBW | 没有 |
 | BWBWBWBW | BWBWBWBW | 没有 |
 | WBWBWBWB | 没有 |
 | WBWBWBWB | 没有 |
 | BWBWBWBW | BWBWBWBW | 没有 |
 | WBWBWBWB | 没有 |

 所有行在内部交替，因此算法输出：```
YES
```此示例演示了行最初不需要处于正确的棋盘排列中。 由于每一行都是交替的，适当的旋转可以创建所需的图案。 

### 示例 2

 考虑：```
WWWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
```| 行| 第一个相等的相邻对 |
 | --- | --- |
 | WWWWWWWB | 位置 1 和 2 |
 | BWBWBWBW | BWBWBWBW | 无 |
 | WBWBWBWB | 无 |
 | BWBWBWBW | BWBWBWBW | 无 |
 | WBWBWBWB | 无 |
 | BWBWBWBW | BWBWBWBW | 无 |
 | WBWBWBWB | 无 |
 | BWBWBWBW | BWBWBWBW | 无 |

 第一行包含两个连续的`W`s。 没有循环移位可以消除该缺陷。 

输出：```
NO
```这个例子说明了关键的不变量：每次旋转后，相等的相邻单元格在某处保持相邻。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(64) | 八行，每行七次邻接检查 |
 | 空间| O(1) | O(1) | 仅存储输入板|

 电路板尺寸固定为 8×8，因此运行时间实际上是恒定的。 该解决方案远远低于时间和内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    board = [input().strip() for _ in range(8)]

    for row in board:
        for i in range(7):
            if row[i] == row[i + 1]:
                return "NO"

    return "YES"

# provided sample
assert run(
"""WBWBWBWB
BWBWBWBW
BWBWBWBW
BWBWBWBW
WBWBWBWB
WBWBWBWB
BWBWBWBW
WBWBWBWB
"""
) == "YES", "sample"

# already a perfect chessboard
assert run(
"""WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
"""
) == "YES", "already valid"

# all white
assert run(
"""WWWWWWWW
WWWWWWWW
WWWWWWWW
WWWWWWWW
WWWWWWWW
WWWWWWWW
WWWWWWWW
WWWWWWWW
"""
) == "NO", "all equal"

# one bad row
assert run(
"""WBWBWBWB
BWBWBWBW
WBWWWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
"""
) == "NO", "single invalid row"

# all rows alternating but identical
assert run(
"""WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
WBWBWBWB
"""
) == "YES", "rows can be shifted independently"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 完美棋盘| 是 | 允许零操作 |
 | 所有白细胞| 否 | 相邻相等颜色无法固定|
 | 糟糕的一排| 否 | 单个无效行使棋盘无法进行 |
 | 所有行均等且交替 | 是 | 独立的行旋转就足够了 |

 ## 边缘情况

 考虑董事会：```
WWWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
```第一行包含`WW`一开始。 在扫描过程中，算法发现`row[0] == row[1]`并立即返回`NO`。 旋转该行只是将该对移动到另一个位置，因此拒绝是正确的。 

考虑一个每行都等于的板：```
WBWBWBWB
```重复八次。 

该算法在任何行中都找不到相等的相邻单元格并返回`YES`。 这是正确的，因为每隔一行可以移动一次，产生：```
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
...
```这正是一个合适的棋盘。 

考虑一个已经是有效棋盘的棋盘：```
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
WBWBWBWB
BWBWBWBW
```每行交替，因此算法返回`YES`。 由于不允许执行任何操作，因此这是正确的结果。
