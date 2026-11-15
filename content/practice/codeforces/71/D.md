---
title: "CF 71D - 纸牌"
description: "我们有一个长方形的棋盘，里面装满了扑克牌。 牌面大小最多为 17 美元乘以 17 美元，但放置的牌总数永远不会超过 52 张，因为这副牌只有 52 张普通牌加上两张王牌。 有效的 3×3 正方形必须满足以下两个属性之一： 1."
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 71
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 65 (Div. 2)"
rating: 2200
weight: 71
solve_time_s: 138
verified: true
draft: false
---

[CF 71D - 纸牌](https://codeforces.com/problemset/problem/71/D)

 **评分：** 2200
 **标签：** 暴力破解、实施
 **求解时间：** 2m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个长方形的棋盘，里面装满了扑克牌。 电路板尺寸最大为$17 \times 17$，但放置的牌总数永远不会超过 52 张，因为这副牌只有 52 张普通牌加上两张王牌。 

有效的 3×3 正方形必须满足以下两个属性之一：

 1. 所有 9 张牌的花色相同。 
2. 所有 9 张牌都有成对不同的等级。 

两个这样的正方形必须存在且不重叠。 

转折来自小丑。 输入可能包含`J1`和`J2`，代表牌组中两个不同的小丑。 在检查情况之前，我们可能会用剩余牌组中任何未使用的牌替换每个小丑。 替换的卡片必须是不同的，并且不得已经出现在板上。 

任务不仅是确定解是否存在，而且还要打印一个有效的小丑替换以及两个 3×3 正方形的坐标。 

这些限制足够小，以至于对董事会职位进行暴力攻击是现实的。 可能的 3×3 正方形的数量最多为：$$(17 - 2)^2 = 225$$因此，即使检查所有的方块对也是很便宜的：$$225^2 \approx 5 \times 10^4$$昂贵的部分是小丑替换。 对所有可能的卡片分配进行简单搜索可以大致得出：$$54^2 \cdot 225^2 \approx 1.5 \times 10^8$$一旦添加了验证逻辑，这在 Python 中就会让人感到不舒服。 

关键的观察结果是每个 3×3 的正方形仅包含 9 个单元格。 一个方格是否有效仅取决于这 9 张牌，而不取决于棋盘上的其余部分。 这使我们能够独立地预处理每个方块并记录哪些小丑分配使其有效。 

一些边缘情况很容易被错误处理。 

小丑可能位于所选方格之外。 在这种情况下，它的替换仍然很重要，因为牌组中的每张牌都必须保持唯一。 粗心的实现可能会为两个小丑分配相同的替换卡，因为两个小丑都不参与方格。 

例如：```
3 6
2S 3S 4S 5S 6S 7S
8S 9S TS JS QS KS
AS J1 J2 2H 3H 4H
```两个小丑与有效方格无关，但他们仍然必须收到不同的未使用的牌。 

另一个微妙的情况是重叠检测。 两个 3×3 的正方形即使共用一个单元格也是无效的。 

例如，在 4×4 棋盘中：```
(1,1) square covers rows 1..3 and cols 1..3
(2,2) square covers rows 2..4 and cols 2..4
```它们在 2×2 区域中重叠并且不能一起使用。 

一个常见的错误是仅检查左上角是否不同。 

排名条件还要求所有 9 个排名都成对不同。 即使花色不同，重复的等级也会立即使方格无效。 

例子：```
2S 3H 4D
5C 6S 7H
8D 2C 9S
```这在排名规则下无效，因为排名`2`出现两次。 

## 方法

 最直接的解决办法就是暴力破解。 

我们可以枚举每对 3×3 方块，枚举每个小丑的所有可能的替换，构建最终的棋盘，并测试两个方块是否满足任一条件。 

棋盘最多包含 225 个可能的方格。 每个小丑最多有 54 张候选卡。 测试一个方格需要花费恒定的时间，因为它总是恰好包含 9 个单元格。 

这给出了最坏情况的复杂性：$$225^2 \cdot 54^2$$在考虑验证开销之前，这已经超过 1 亿个组合。 Python 可能会遇到这个问题。 

重要的结构观察是正方形是独立的。 方格只关心自己 9 个方格内的牌。 因此，我们可以预处理每个方块并询问：

 “哪些小丑替代品使这个特定的方格有效？”

 由于小丑最多有两个，因此替换组合的数量很少：

 - 没有小丑：只有一个状态
 - 一张小丑：最多 52 张可能的牌
 - 两个小丑：最多$52 \cdot 51$对于每个方格，我们对每个合法小丑分配进行一次测试，并存储使该方格有效的所有分配。 

经过预处理后，解决问题就变得很容易了：

 1. 枚举不重叠的正方形对。 
2. 检查它们的有效分配集是否兼容。 
3. 兼容性是指双方就最终小丑替换达成一致。 

这将问题从重复的昂贵验证问题转变为查找问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(S^2 \cdot C^2)$|$O(1)$| 太慢了 |
 | 最佳|$O(S \cdot C^2 + S^2 \cdot A)$|$O(S \cdot A)$| 已接受 |

 这里：

-$S \le 225$是正方形的数量
 -$C \le 54$是卡片分配的数量
 -$A$是每平方的有效分配数

 在实践中，$A$很小。 

## 算法演练

 1. 解析棋盘并收集所有使用过的普通卡牌。 

小丑被排除在外，因为它们以后可能会成为任何未使用的牌。 
2. 从完整的 52 张牌中生成未使用的牌的列表。 

这些是小丑的唯一合法替代品。 
3. 数出板上每一个 3×3 的方格。 

正方形由其左上角来标识。 
4. 对于每个方格，测试每个可能的小丑分配。 

如果没有小丑，则只有一项任务。 

如果有一张小丑，请尝试每一张未使用的牌。 

如果有两张百搭牌，请尝试每对有序的不同未使用的牌。 
5. 将百搭值代入方格内后，测试方格是否有效。 

如果满足以下任一条件，则正方形有效：

 - 所有套装均相同
 - 所有等级都是不同的
 6. 存储使正方形有效的每项分配。 

存储的密钥是完整的全局小丑分配：

 -`()`如果没有小丑
 -`(card,)`如果存在一个小丑
 -`(card1, card2)`如果两者都存在
 7. 枚举所有的方块对。 

跳过区域重叠的对。 
8. 对于不重叠的对，检查两个方格的有效分配集中是否存在小丑分配。 

由于小丑的替换是全局性的，因此两个方块必须就相同的最终任务达成一致。 
9. 一旦找到兼容的对，就打印所需的输出。 
10. 如果没有配对有效，则打印`"No solution."`### 为什么它有效

 每个方格都会在每次合法小丑替换下进行评估。 预处理步骤准确地记录了正方形变得有效的分配。 

稍后，当组合两个方块时，需要共享分配保证相同的全局小丑替换使两个方块同时有效。 

显式检查非重叠，因此最终配置始终满足所有约束。 

因为每个合法的赋值和每个平方对都会被检查，所以不会错过任何有效的解决方案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

RANKS = "23456789TJQKA"
SUITS = "CDHS"

ALL_CARDS = [r + s for r in RANKS for s in SUITS]

def overlap(r1, c1, r2, c2):
    return not (
        r1 + 2 < r2 or
        r2 + 2 < r1 or
        c1 + 2 < c2 or
        c2 + 2 < c1
    )

def valid_square(cells):
    suits = [x[1] for x in cells]
    if len(set(suits)) == 1:
        return True

    ranks = [x[0] for x in cells]
    return len(set(ranks)) == 9

def solve():
    n, m = map(int, input().split())
    board = [input().split() for _ in range(n)]

    jokers = []
    used = set()

    for i in range(n):
        for j in range(m):
            card = board[i][j]
            if card in ("J1", "J2"):
                jokers.append(card)
            else:
                used.add(card)

    unused = [c for c in ALL_CARDS if c not in used]

    joker_count = len(jokers)

    assignments = []

    if joker_count == 0:
        assignments.append(())
    elif joker_count == 1:
        for c in unused:
            assignments.append((c,))
    else:
        for c1 in unused:
            for c2 in unused:
                if c1 != c2:
                    assignments.append((c1, c2))

    square_info = []

    for r in range(n - 2):
        for c in range(m - 2):
            valid_assignments = set()

            for assn in assignments:
                cells = []

                ok = True

                for i in range(r, r + 3):
                    for j in range(c, c + 3):
                        card = board[i][j]

                        if card == "J1":
                            if joker_count == 1:
                                card = assn[0]
                            else:
                                card = assn[0]
                        elif card == "J2":
                            card = assn[1]

                        cells.append(card)

                if valid_square(cells):
                    valid_assignments.add(assn)

            square_info.append((r, c, valid_assignments))

    total = len(square_info)

    for i in range(total):
        r1, c1, s1 = square_info[i]

        if not s1:
            continue

        for j in range(i + 1, total):
            r2, c2, s2 = square_info[j]

            if not s2:
                continue

            if overlap(r1, c1, r2, c2):
                continue

            common = s1 & s2

            if common:
                assn = next(iter(common))

                print("Solution exists.")

                if joker_count == 0:
                    print("There are no jokers.")
                elif joker_count == 1:
                    print(f"Replace {jokers[0]} with {assn[0]}.")
                else:
                    print(f"Replace J1 with {assn[0]} and J2 with {assn[1]}.")

                print(f"Put the first square to ({r1 + 1}, {c1 + 1}).")
                print(f"Put the second square to ({r2 + 1}, {c2 + 1}).")
                return

    print("No solution.")

solve()
```实现直接遵循预处理策略。`valid_square`检查两个允许的模式。 首先测试花色相等，因为它稍微便宜一些。 排名唯一性仅使用集合。 

这`assignments`列表代表了所有合法的全球小丑替代品。 当两个小丑都存在时，顺序很重要，因为`J1 -> A`,`J2 -> B`不同于`J1 -> B`,`J2 -> A`。 

每个方块存储一组有效的分配。 使用集合可以使以后的交叉测试更加高效。 

重叠测试很容易出错。 仅当其中一个完全位于另一个的上方、下方、左侧或右侧时，两个 3×3 正方形才不会重叠。 所有其他配置都会重叠。 

方形结构内的替换逻辑有意仅替换小丑单元。 所有普通卡保持不变。 

最终搜索只是找到一对具有非空赋值交集的方块。 

## 工作示例

 ### 示例 1

 输入：```
4 6
2S 3S 4S 7S 8S AS
5H 6H 7H 5S TC AC
8H 9H TH 7C 8C 9C
2D 2C 3C 4C 5C 6C
```可能的正方形：

 | 广场| 左上角| 有效|
 | --- | --- | --- |
 | 一个 | (1,1) | 没有 |
 | 乙| (1,2) | 没有 |
 | C | (1,3) | 没有 |
 | d | (1,4) | 没有 |
 | 电子| (2,1) | 没有 |
 | F | (2,2) | 没有 |
 | G | (2,3) | 没有 |
 | 哈 | (2,4) | 没有 |

 没有一个方块满足任何一条规则，因此没有一对可以工作。 

输出：```
No solution.
```此示例表明，即使视觉结构化区域也可能会失败，因为排名唯一性要求所有九个排名完全不同。 

### 示例 2

 输入：```
3 6
2S 3S 4S 5H 6H 7H
5S 6S 7S 8H 9H TH
8S 9S TS J1 QH KH
```未使用的卡有很多可能性。 

左边的 3×3 正方形包含：

 | 2S | 3S | 4S |
 | --- | --- | --- |
 | 5S | 6S | 7S |
 | 8S | 9S | TS |

 所有套装都是`S`，因此该平方立即有效。 

右边的 3×3 正方形包含等级：

 | 哈 | 哈 | 哈 |
 | --- | --- | --- |
 | 哈 | 哈 | 哈 |
 | J1 | 哈 | 哈 |

 更换`J1`和`AH`使所有等级不同：$$5,6,7,8,9,T,A,Q,K$$该算法将此分配记录为对第二个方格有效，并找到兼容的对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(S \cdot C^2 + S^2 \cdot A)$| 预处理所有方块和赋值，然后测试方块对 |
 | 空间|$O(S \cdot A)$| 存储每个方块的有效分配 |

 由于最多有 225 个方格和最多几千个小丑分配，该解决方案很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    out = io.StringIO()
    sys.stdout = out

    RANKS = "23456789TJQKA"
    SUITS = "CDHS"

    ALL_CARDS = [r + s for r in RANKS for s in SUITS]

    def overlap(r1, c1, r2, c2):
        return not (
            r1 + 2 < r2 or
            r2 + 2 < r1 or
            c1 + 2 < c2 or
            c2 + 2 < c1
        )

    def valid_square(cells):
        suits = [x[1] for x in cells]
        if len(set(suits)) == 1:
            return True

        ranks = [x[0] for x in cells]
        return len(set(ranks)) == 9

    input = sys.stdin.readline

    n, m = map(int, input().split())
    board = [input().split() for _ in range(n)]

    jokers = []
    used = set()

    for i in range(n):
        for j in range(m):
            card = board[i][j]
            if card in ("J1", "J2"):
                jokers.append(card)
            else:
                used.add(card)

    unused = [c for c in ALL_CARDS if c not in used]

    joker_count = len(jokers)

    assignments = []

    if joker_count == 0:
        assignments.append(())
    elif joker_count == 1:
        for c in unused:
            assignments.append((c,))
    else:
        for c1 in unused:
            for c2 in unused:
                if c1 != c2:
                    assignments.append((c1, c2))

    square_info = []

    for r in range(n - 2):
        for c in range(m - 2):
            valid_assignments = set()

            for assn in assignments:
                cells = []

                for i in range(r, r + 3):
                    for j in range(c, c + 3):
                        card = board[i][j]

                        if card == "J1":
                            card = assn[0]
                        elif card == "J2":
                            card = assn[1]

                        cells.append(card)

                if valid_square(cells):
                    valid_assignments.add(assn)

            square_info.append((r, c, valid_assignments))

    total = len(square_info)

    for i in range(total):
        r1, c1, s1 = square_info[i]

        for j in range(i + 1, total):
            r2, c2, s2 = square_info[j]

            if overlap(r1, c1, r2, c2):
                continue

            if s1 & s2:
                print("Solution exists.")
                return out.getvalue()

    print("No solution.")
    return out.getvalue()

# provided sample
assert run(
"""4 6
2S 3S 4S 7S 8S AS
5H 6H 7H 5S TC AC
8H 9H TH 7C 8C 9C
2D 2C 3C 4C 5C 6C
"""
).strip() == "No solution.", "sample 1"

# minimum board
assert "No solution." in run(
"""3 3
2S 3S 4S
5S 6S 7S
8S 9S TS
"""
), "single square cannot form two non-overlapping squares"

# simple positive case
assert "Solution exists." in run(
"""3 6
2S 3S 4S 2H 3H 4H
5S 6S 7S 5H 6H 7H
8S 9S TS 8H 9H TH
"""
), "two disjoint suit squares"

# overlap trap
assert "No solution." in run(
"""4 4
2S 3S 4S 5S
6S 7S 8S 9S
TS JS QS KS
AH 2H 3H 4H
"""
), "overlapping valid squares are forbidden"

# joker replacement
assert "Solution exists." in run(
"""3 6
2S 3S 4S 5H 6H 7H
5S 6S 7S 8H 9H TH
8S 9S TS J1 QH KH
"""
), "joker creates distinct ranks"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3×3 单个有效方格 | 没有解决办法| 需要两个不重叠的正方形 |
 | 两个水平花色方格| 解决方案存在 | 基本正面案例|
 | 4×4 重叠候选人 | 没有解决办法| 正确的重叠检测 |
 | 百搭修复一| 解决方案存在 | 小丑替换逻辑 |

 ## 边缘情况

 再次考虑重叠问题。 

输入：```
4 4
2S 3S 4S 5S
6S 7S 8S 9S
TS JS QS KS
AH 2H 3H 4H
```广场位于`(1,1)`有效，因为所有花色都是黑桃。 

广场位于`(2,2)`看起来也很有希望：```
7S 8S 9S
JS QS KS
2H 3H 4H
```有缺陷的实现可能会接受两者，因为它们的左上角坐标不同。 

该算法正确地拒绝它们，因为行`2..3`和列`2..3`重叠。 

另一个棘手的情况涉及重复的排名。 

输入：```
3 3
2S 3H 4D
5C 6S 7H
8D 2C 9S
```西装并不统一。 

排名是：```
2 3 4
5 6 7
8 2 9
```秩`2`出现两次，因此该正方形无效。 

该算法使用`len(set(ranks)) == 9`，它立即捕获了这一点。 

最后，考虑活跃方格之外的小丑。 

输入：```
3 6
2S 3S 4S 5S 6S 7S
8S 9S TS JS QS KS
AS J1 J2 2H 3H 4H
```左边的方格已经满足了花色条件。 小丑与此无关。 

粗心的解决方案可能会为两个小丑分配同一张未使用的牌，因为它们从未被检查过。 

该算法仅使用有序的不同对生成分配，保证全局牌组的一致性。
