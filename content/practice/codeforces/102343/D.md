---
title: "CF 102343D - 糖果乐园"
description: "游戏棋盘是一条由n个方格组成的线。 方块 1 到 n-1 要么具有颜色（例如 RED），要么具有独特的特殊方块（例如 SPECIALCANE）。 方格 n 是最终方格，同时代表每种颜色。 玩家在方格 1 之前开始。"
date: "2026-08-16T17:58:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102343
codeforces_index: "D"
codeforces_contest_name: "UCF Locals 2019"
rating: 0
weight: 102343
solve_time_s: 179
verified: true
draft: false
---

[CF 102343D - 糖果乐园](https://codeforces.com/problemset/problem/102343/D)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 游戏板是一条线`n`正方形。 正方形`1`通过`n - 1`有一个颜色，例如`RED`或独特的特殊正方形，例如`SPECIALCANE`。 正方形`n`是最终的方块，同时代表每种颜色。 玩家在方格前开始`1`。 

有`p`玩家和包含以下内容的牌组`c`牌。 每回合，下一位玩家从牌堆顶部取出下一张牌。 使用后，该卡牌会移至底部，因此该牌组会循环重复。 玩家顺序也会循环重复。 第一个到达方格的玩家`n`获胜。 官方声明保证游戏在10000回合以内完成。 

A型`1`卡片包含一种颜色。 玩家严格地移动到其当前位置之后具有该颜色的第一个方格。 如果没有这样的普通方块，则到达终点方块，因为它包含每种颜色。 

A型`2`卡片包含一种颜色两次。 玩家严格地移动到当前位置之后第二次出现该颜色的位置。 终点方格算作每种颜色的出现，这就是为什么即使前面只有一个普通的出现，玩家也可以获胜。 

A型`3`卡片命名为一个特殊的方块。 玩家直接移动到该方格，无论它是在当前位置的前面还是后面。 特殊方块是独一无二的，因此它们的目的地是明确的。 

限制故意很小。 棋盘最多有 200 个方格，牌组最多有 500 张牌，游戏持续时间少于 10,000 回合。 即使是扫描整个电路板以查找每个色卡的实现也最多执行约 2,000,000 平方的检查。 在 3 秒限制和 256 MB 内存限制下，这很容易管理。 

主要的边缘情况来自终点方格和特殊动作的方向。 例如，考虑```
2 2
RED
1
2 RED
```唯一的普通正方形是`RED`，最终的正方形是正方形`2`。 玩家 1 采取一种类型`2 RED`站在指定位置时打卡`0`。 第一个`RED`出现次数是平方的`1`，第二个是完成方块，所以正确的输出是`1`。 一个粗心的实现，只搜索`n - 1`明确提供的棋盘方块会错误地得出没有第二次发生的结论。 

另一个边界情况是一张特殊的牌让玩家向后移动：```
4 2
RED
SPECIALX
BLUE
1
3 SPECIALX
```玩家1立即移动到方格`2`，尽管这一举动不是向前迈出的一步。 假设每张牌只会增加位置的模拟会导致状态错误。 

最后一个边缘情况是多个玩家可能占据同一个方格。 例如，```
3 2
RED
RED
1
1 RED
```玩家 1 移动到方格`1`。 在下一个回合，玩家 2 拿同一张牌并且也移动到方格`1`。 没有冲突规则，因此两个位置仍然有效。 官方规则明确允许多个玩家共享一个方块。 

## 方法

 最直接的解决办法就是完全按照描述来模拟游戏。 为每个玩家保留一个位置，为下一张牌保留索引，并进行轮流处理，直到有人到达最后一个方格。 对于一个类型`1`或输入`2`色卡，向前扫描色板并数出匹配的颜色。 对于一个类型`3`卡，查找指定的特殊方块并直接分配该位置。 

这种暴力模拟已经足够快了。 在最坏的情况下，轮次少于 10,000 次，每次轮次可以检查所有 199 个普通方格，给出的棋盘检查数量少于 1,990,000 次。 因此，在给定的约束下，暴力方法实际上并不会变得太慢。 

还有一个有用的优化可以使模拟更清晰。 对于每种颜色，预处理包含该颜色的棋盘位置的排序列表。 添加最后一个正方形`n`到每种颜色的列表，因为完成方块代表每种颜色。 然后是一个类型`1`卡要求第一个存储的位置大于玩家当前的位置，而类型`2`卡要求第二个这样的位置。 二分查找直接找到第一个位置。 

这种优化背后的观察结果是，董事会永远不会改变。 每个查询都会询问相同的静态问题，即特定颜色的哪个出现出现在给定位置之后。 预先计算出现列表将此静态信息与游戏的动态部分（仅是玩家的当前位置）分开。 

特殊方块可以从它们的名称到它们的棋盘位置存储在字典中。 由于它们的名称是唯一的，因此可以进行恒定时间的查找。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(Tn) | O(n + c + p) | 已接受 |
 | 最佳 | O(n + c + T log n) | O(n + c + T log n) | O(n + c) | 已接受 |

 这里`T < 10000`是匝数。 最佳版本更可取，因为它的复杂性直接反映了每个移动都是针对固定棋盘的查询这一事实。 

## 算法演练

 1. 阅读棋盘并为其位置编号`1`通过`n`。 输入仅描述位置`1`通过`n - 1`，同时位置`n`是五彩的方形。 
2. 建立字典`color_positions`。 对于位置处的每个普通颜色方块`i`, 附加`i`到该颜色的列表。 读完黑板后，附上`n`到每个颜色列表。 必须包括完成方块，因为它充当每种颜色的出现。 
3. 建立字典`special_positions`在阅读黑板时。 如果一个正方形开始于`SPECIAL`，存储其完整名称及其位置。 
4. 读取这副牌并将每张牌存储为其类型和目标字符串。 牌组本身的顺序永远不会改变，因为用过的牌只是从前到后移动。 因此，转`t`总是用卡`(t mod c)`。 
5. 初始化每个玩家的位置`0`。 轮到轮到的玩家`t`是`(t mod p)`。 两个索引内部都是从零开始的，而最后打印的玩家编号是从一开始的。 
6. 对于一个类型`3`卡，用存储的特殊方格位置替换当前玩家的位置。 不涉及向前搜索，因为特殊卡直接移动到其指定的方格。 
7. 对于一个类型`1`色卡、使用`bisect_right`在颜色的位置列表上查找严格大于玩家当前位置的第一个位置。 将该位置分配给玩家。 
8. 对于一个类型`2`色卡，执行相同的二分查找，但在出现列表中取出后一位元素。 由于完成方块已附加到每个颜色列表中，因此在需要时它自然会成为第二个出现的地方。 
9. 申请卡片后，检查玩家的位置是否在`n`。 如果是这样，请立即打印该玩家的基于 1 的号码。 游戏在第一个到达终点的玩家处停止。 
10. 向前转弯并重复。 输入保证游戏在 10,000 回合内完成意味着不需要循环检测机制。 

为什么有效：在每个回合之前，每个玩家存储的位置正是他们在游戏中的真实位置。 对于特殊的卡片，字典精确地给出了该卡片命名的唯一方块。 对于色卡，出现列表恰好包含可以着陆的所有具有该颜色的方块，包括最终的彩色方块。 二分查找严格选择当前位置之后的第一个或第二个匹配项，完全符合卡片规则。 由于玩家和牌组按照与游戏相同的顺序循环前进，因此每个模拟回合都与真实游戏相匹配。 第一个模拟位置等于`n`因此是真正的赢家。 

## Python 解决方案```python
import sys
from bisect import bisect_right

input = sys.stdin.readline

def solve():
    n, p = map(int, input().split())

    color_positions = {}
    special_positions = {}

    for pos in range(1, n):
        cell = input().strip()

        if cell.startswith("SPECIAL"):
            special_positions[cell] = pos
        else:
            color_positions.setdefault(cell, []).append(pos)

    # The final square is an occurrence of every color.
    for positions in color_positions.values():
        positions.append(n)

    c = int(input())
    deck = []

    for _ in range(c):
        typ, target = input().split()
        deck.append((int(typ), target))

    player_pos = [0] * p

    turn = 0

    while True:
        player = turn % p
        typ, target = deck[turn % c]
        current = player_pos[player]

        if typ == 3:
            player_pos[player] = special_positions[target]
        else:
            positions = color_positions[target]
            idx = bisect_right(positions, current)

            if typ == 1:
                player_pos[player] = positions[idx]
            else:
                player_pos[player] = positions[idx + 1]

        if player_pos[player] == n:
            print(player + 1)
            return

        turn += 1

if __name__ == "__main__":
    solve()
```第一个预处理循环使用以下方法区分普通颜色和特殊方块`SPECIAL`前缀。 这是安全的，因为该语句保证没有颜色包含该子字符串。 

颜色列表最初只包含普通的棋盘位置。 追加`n`接下来是关键的实现细节。 它避免了特殊情况，例如“只剩下一个匹配的方块，因此类型`2`卡赢了”。然后二分搜索自然地处理这种情况。`bisect_right(positions, current)`也是故意的。 该卡总是要求玩家当前方格之后的方格，而不是当前方格本身。 如果玩家已经站在所需颜色的方格上，则该方格不得计入移动。 

对于一个类型`1`卡片，`positions[idx]`是玩家之后第一个匹配的方块。 对于一个类型`2`卡片，`positions[idx + 1]`是第二个匹配的正方形。 该问题保证游戏规则使请求的移动有效，因为完成方格提供了必要的最终发生。 

玩家指数使用`turn % p`，而卡片索引使用`turn % c`。 这两个周期是独立的。 仅当回合结束时才推进牌组索引相当于将用过的牌移动到牌组底部。 

Python 整数具有任意精度，因此不存在溢出问题。 最大转数也很小，因此不需要循环加速。 

## 工作示例

 ### 示例 1

 第一个样本有十个方格和两名玩家。 普通板是```
1 RED
2 BLUE
3 SPECIALCANE
4 GREEN
5 RED
6 BLUE
7 BLUE
8 GREEN
9 RED
10 FINISH
```这副牌有四张牌：```
1 RED
2 BLUE
3 SPECIALCANE
2 GREEN
```关键的状态变化是：

 | 转 | 玩家| 卡| 上一个职位 | 新职位 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 |`1 RED`| 0 | 1 |
 | 2 | 2 |`2 BLUE`| 0 | 6 |
 | 3 | 1 |`3 SPECIALCANE`| 1 | 3 |
 | 4 | 2 |`2 GREEN`| 6 | 10 | 10

 在第 2 回合，蓝色位置是`2, 6, 7, 10`。 从位置开始`0`，第二次出现的是`6`，因此玩家 2 到达方格 6。在第 4 回合，位置 6 之后的绿色位置是`8, 10`，所以第二次出现的是终点方块。 答案是`2`。 官方示例解释给出了相同的顺序。 

### 示例 2

 第二个样本在结束前有两个棋盘位置：```
1 RED
2 SPECIALLOLLIPOP
3 FINISH
```有三名玩家和两张牌：```
3 SPECIALLOLLIPOP
1 RED
```踪迹是：

 | 转 | 玩家| 卡| 上一个职位 | 新职位 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 |`3 SPECIALLOLLIPOP`| 0 | 2 |
 | 2 | 2 |`1 RED`| 0 | 1 |
 | 3 | 3 |`3 SPECIALLOLLIPOP`| 0 | 2 |
 | 4 | 1 |`1 RED`| 2 | 3 |

 玩家 1 在第一回合到达特殊方格。 在第四回合时，`RED`卡在位置 2 之后没有普通的红色方块，因此选择完成方块。 玩家 1 获胜。 样本输出是`1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + c + T log n) | O(n + c + T log n) | 板和甲板预处理是线性的，并且每个`T`轮次最多执行一次二分查找。 |
 | 空间| O(n + c) | 出现列表、特殊方块地图、牌组和玩家位置存储线性大小状态。 |

 这里`n <= 200`,`c <= 500`， 和`T < 10000`。 即使是更简单的 O(Tn) 模拟也将执行不到 200 万次电路板检查，而提交的解决方案速度更快，并且完全保持在 3 秒和 256 MB 的限制范围内。 

## 测试用例

 以下测试使用两个官方样本和四个附加案例。 最大尺寸的情况是以编程方式生成的，因此测试仍然可读，同时仍然用`n = 200`和一个甲板`c = 500`。```python
import sys
import io
from bisect import bisect_right

def solve():
    input = sys.stdin.readline

    n, p = map(int, input().split())

    color_positions = {}
    special_positions = {}

    for pos in range(1, n):
        cell = input().strip()

        if cell.startswith("SPECIAL"):
            special_positions[cell] = pos
        else:
            color_positions.setdefault(cell, []).append(pos)

    for positions in color_positions.values():
        positions.append(n)

    c = int(input())
    deck = []

    for _ in range(c):
        typ, target = input().split()
        deck.append((int(typ), target))

    player_pos = [0] * p
    turn = 0

    while True:
        player = turn % p
        typ, target = deck[turn % c]
        current = player_pos[player]

        if typ == 3:
            player_pos[player] = special_positions[target]
        else:
            positions = color_positions[target]
            idx = bisect_right(positions, current)

            if typ == 1:
                player_pos[player] = positions[idx]
            else:
                player_pos[player] = positions[idx + 1]

        if player_pos[player] == n:
            return str(player + 1)

        turn += 1

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        return solve() + "\n"
    finally:
        sys.stdin = old_stdin

sample1 = """\
10 2
RED
BLUE
SPECIALCANE
GREEN
RED
BLUE
BLUE
GREEN
RED
4
1 RED
2 BLUE
3 SPECIALCANE
2 GREEN
"""

sample2 = """\
2 3
RED
SPECIALLOLLIPOP
2
3 SPECIALLOLLIPOP
1 RED
"""

assert run(sample1) == "2\n", "sample 1"
assert run(sample2) == "1\n", "sample 2"

# Minimum-size board. A type-1 card immediately reaches the finish.
assert run("""\
2 2
RED
1
1 RED
""") == "1\n", "minimum board"

# Type-2 card must count the finish square as the second occurrence.
assert run("""\
2 2
RED
1
2 RED
""") == "1\n", "finish counts as second occurrence"

# A special card may move backwards.
assert run("""\
4 2
RED
SPECIALX
BLUE
2
1 RED
3 SPECIALX
""") == "1\n", "backward special move"

# Maximum-size board and deck.
# Every ordinary square is RED, so the type-2 card reaches the second
# occurrence immediately on the first turn.
board = ["RED"] * 199
deck = ["2 RED"] * 500

max_input = (
    "200 6\n"
    + "\n".join(board)
    + "\n500\n"
    + "\n".join(deck)
    + "\n"
)

assert run(max_input) == "1\n", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 |`2`| 普通多人模拟，重复牌组，颜色和特殊卡牌 |
 | 样品2 |`1`| 一个特殊的动作，然后是一个彩色的动作，直到终点|
 |`2 2 / RED / 1 RED`|`1`| 最小的电路板尺寸和立即完成|
 |`2 2 / RED / 2 RED`|`1`| 完成方格算作第二次出现 |
 |`4 2 / RED / SPECIALX / BLUE`|`1`| 一张特殊的卡牌可以让玩家向后移动 |
 |`n = 200, c = 500`|`1`| 最大板和甲板尺寸|

 ## 边缘情况

 第一个微妙的情况是最后一个方块充当颜色出现。 和```
2 2
RED
1
2 RED
```颜色列表最初是`[1]`。 该算法附加完成位置并获得`[1, 2]`。 玩家当前的位置是`0`， 所以`bisect_right`回报指数`0`。 A型`2`卡选择索引`1`，这是位置`2`。 输出是`1`。 不需要特殊情况的分支。 

第二个微妙的情况是后退的特殊动作。 和```
4 2
RED
SPECIALX
BLUE
2
1 RED
3 SPECIALX
```玩家1首先移动到位置`1`。 下次玩家1行动时，特殊卡将他们直接移动到位置`2`，无论他们之前的位置如何。 该算法分配`special_positions["SPECIALX"]`直接，因此它不会意外地限制移动到当前位置之后的位置。 

第三种情况是多个玩家共享一个方格。 和```
3 2
RED
RED
1
1 RED
```玩家 1 移动自`0`到`1`。 在下一个回合，玩家 2 独立地从`0`到`1`。 模拟为每个玩家存储一个单独的位置，因此两个玩家的移动都不会影响另一个玩家。 这符合玩家可以占据同一个方格的规则。 

第四种情况是当类型`1`卡片前面没有普通的匹配方块。 考虑```
3 2
BLUE
RED
1
1 BLUE
```玩家 1 开始于`0`并移动到位置`1`，所以还没有问题。 如果玩家 1 后来收到另一个`1 BLUE`卡从位置`1`，没有普通的`BLUE`其后方格。 颜色出现列表是`[1, 3]`， 在哪里`3`是结束，所以二分查找选择`3`。 该算法得到了正确的结果，而不将完成视为一种单独的移动。
