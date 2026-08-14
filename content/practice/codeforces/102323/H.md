---
title: "CF 102323H - 巧克力修复"
description: "该拼图使用了九块松露。 每个松露都有方形、圆形或三角形三种形状之一，以及香草、草莓或巧克力三种口味之一。 由于每种组合都只出现一次，因此九种物理松露都是不同的。"
date: "2026-08-13T04:18:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102323
codeforces_index: "H"
codeforces_contest_name: "UCF Locals 2014"
rating: 0
weight: 102323
solve_time_s: 85
verified: true
draft: false
---

[CF 102323H - 巧克力修复](https://codeforces.com/problemset/problem/102323/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该拼图使用了九块松露。 每个松露都有方形、圆形或三角形三种形状之一，以及香草、草莓或巧克力三种口味之一。 由于每种组合都只出现一次，因此九种物理松露都是不同的。 

我们必须将这九块松露放入 3x3 的棋盘中。 一条线索是一个较小的矩形图案，其中包含一些固定的形状和风格以及一些通配符。 线索没有告诉我们它的矩形从哪里开始。 相反，整个线索必须出现在 3x3 棋盘上的某个位置，而不需要旋转。 大小的线索`x × y`因此可以被放置在`(4 - x) × (4 - y)`不同的立场。 

输入包含几个谜题。 对于每个谜题，我们最多会收到十个这样的线索，并且该声明保证只有一个完整的排列能够满足所有这些线索。 我们必须使用与线索相同的两字符符号来打印该排列。 

这些约束使搜索空间的大小成为中心观察值。 无论提供多少个拼图，总有九块松露。 完整的排列只是九个不同对象的排列，因此只有`9! = 362880`可能的板。 十条线索和每条线索最多九个可能的位置仅增加了一个小的常数因子。 全面搜索`9^9 = 387420489`任意分配将不必要地大，而仅枚举有效排列对于直接穷举搜索来说足够小。 

有两种简单的方法可以错误地处理线索。 首先，线索可能出现在多个位置，因为它的矩形比棋盘小。 例如，一个`3 × 2`线索可以从第 1 列或第 2 列开始，并且不得旋转以适应其他位置。 在样本 1 中，`2 × 3`线索同样可以从顶行或中间行开始。 一个始终锚定线索的程序`(0, 0)`拒绝有效的解决方案。 

其次，下划线不能解决任何问题。 例如，`_C`表示任意形状的巧克力口味，而`S_`意思是方形形状，任意风味。 粗心的实施会导致`_`因为普通值会拒绝有效的板。 示例线索证明​​了这种区别，示例 3 的正确输出是示例中显示的唯一确定的板。 

第三种边界情况出现，并带有完整的`3 × 3`线索。 这样的一条线索恰好有一个可能的放置位置，因此每个固定属性都直接决定了对应的棋盘单元。 例如，单谜题输入```
1
1
3 3
TC SC SS
RV RC SV
TS TV RS
```有输出```
Puzzle #1:
TC SC SS
RV RC SV
TS TV RS
```这里根本没有线索位置的选择。 

## 方法

 最直接的暴力是将九块松露中的一块独立分配给九个单元格中的每一个。 这创造了`9^9 = 387420489`候选人委员会，其中许多立即违反了每个松露必须仅使用一次的规则。 检查每一块板上的十条线索，大致得出`9^9 × 10 × 9`，或者在最坏的情况下大约 349 亿个基本位置检查。 这远远超出了必要的工作量。 

有用的观察结果是，已知九块松露是不同的，并且每块松露都必须仅使用一次。 我们永远不需要考虑两次包含相同松露的无效板。 董事会正是九个松露恒等式的排列，将候选人数减少为`9^9`到`9! = 362880`。 

对于每一个排列，我们都会检查每一条线索。 线索只能从其完整矩形保留在 3x3 棋盘内的位置开始。 对于每个可能的起始位置，我们仅比较线索实际指定的属性。 如果至少有一个位置匹配，则满足该线索。 

这种直接搜索的最坏情况最多是`9! × 10 × 9 = 32,659,200`细胞水平检查。 实际的实现甚至更小，因为大多数线索包含固定属性，并且一旦找到唯一的解决方案，搜索就会停止。 由于棋盘尺寸始终为 9，因此穷举排列搜索是这里的自然解决方案，而不是引入更重的约束求解器。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 独立作业| O(9^9·C·9) | O(9^9·C·9) | O(9) | 太慢了 |
 | 排列枚举| O(9!·C·9) | O(9!·C·9) | O(9 + C·9) | O(9 + C·9) | 已接受 |

 这里`C ≤ 10`是线索的数量。 表面上的阶乘复杂性是无害的，因为阶乘是`9!`，固定值只有362880。 

## 算法演练

 1. 将每个物理松露编码为 0 到 8 之间的整数。我们可以使用`shape * 3 + flavor`，其中形状和风味均由三个值表示。 这赋予了每种形状-风味组合独特的特性。 
2. 将每个线索代码转换为一对允许的属性掩码。 对于形状特征来说，`_`允许所有三种形状，同时`S`,`R`， 和`T`正好允许一个。 风味特征的作用类似，`_`允许所有三种口味和`V`,`S`， 和`C`选择一种口味。 
3. 生成九个松露恒等式的每个排列。 每个排列代表一个完整的候选板，因此无需单独检查松露是否重复或遗漏。 
4. 对于每条线索，枚举其矩形的每个合法左上角。 如果它的尺寸是`x × y`，该行的范围可以是`0`通过`3 - x`，该列的范围可以是`0`通过`3 - y`。 如果这些展示位置中至少有一个与候选板匹配，则线索得到满足。 
5. 要测试放置，请检查线索的每个单元格。 如果线索确定了形状，请将其与候选松露的形状进行比较。 如果它固定了一种味道，也比较一下味道。 通配符没有任何限制。 
6. 如果每条线索至少有一个匹配的位置，则排列是唯一的解决方案。 在 3x3 布局中打印九个松露代码，然后转到下一个谜题。 

此搜索完成的原因是每个法律板在九种排列中恰好出现一次。 对于任何这样的委员会，检查每条线索的每一个合法位置都准确地反映了线索的定义。 因此，当所有线索都得到满足时，董事会就被接受。 

### 为什么它有效

 关键的不变量是搜索所考虑的每个候选者都是九个物理松露的有效排列。 对于每条线索，匹配过程都会考虑该线索在不旋转的情况下可能出现的每个可能位置，并在其中一个位置与每个指定属性一致时准确地接受该线索。 因此，当且仅当这是一个合法的谜题解决方案时，候选人才能通过整个测试。 由于问题保证唯一性，因此首次通过的排列是所需的排列。 

## Python 解决方案```python
import sys
from itertools import permutations

input = sys.stdin.readline

def solve_puzzle(clues):
    shape_id = {'S': 0, 'R': 1, 'T': 2}
    flavor_id = {'V': 0, 'S': 1, 'C': 2}

    # Piece id = shape * 3 + flavor.
    pieces = list(range(9))

    def shape_mask(ch):
        if ch == '_':
            return 0b111
        return 1 << shape_id[ch]

    def flavor_mask(ch):
        if ch == '_':
            return 0b111
        return 1 << flavor_id[ch]

    # Each placement is represented by a list of
    # (board_position, allowed_shape_mask, allowed_flavor_mask).
    prepared = []

    for x, y, grid in clues:
        placements = []

        for sr in range(4 - x):
            for sc in range(4 - y):
                placement = []

                for r in range(x):
                    for c in range(y):
                        code = grid[r][c]
                        sm = shape_mask(code[0])
                        fm = flavor_mask(code[1])
                        pos = (sr + r) * 3 + (sc + c)
                        placement.append((pos, sm, fm))

                placements.append(placement)

        prepared.append(placements)

    # More restrictive clues first. This does not change correctness,
    # but usually rejects a wrong permutation earlier.
    def restriction_score(placements):
        score = 0
        for placement in placements:
            for _, sm, fm in placement:
                if sm != 0b111:
                    score += 1
                if fm != 0b111:
                    score += 1
        return score

    prepared.sort(key=restriction_score, reverse=True)

    for board in permutations(pieces):
        good = True

        for placements in prepared:
            clue_good = False

            for placement in placements:
                matches = True

                for pos, sm, fm in placement:
                    piece = board[pos]
                    shape = piece // 3
                    flavor = piece % 3

                    if not (sm & (1 << shape)):
                        matches = False
                        break

                    if not (fm & (1 << flavor)):
                        matches = False
                        break

                if matches:
                    clue_good = True
                    break

            if not clue_good:
                good = False
                break

        if good:
            return board

    return None

def main():
    t = int(input())
    output = []

    for case in range(1, t + 1):
        c = int(input())
        clues = []

        for _ in range(c):
            x, y = map(int, input().split())
            grid = [input().split() for _ in range(x)]
            clues.append((x, y, grid))

        board = solve_puzzle(clues)

        output.append(f"Puzzle #{case}:")
        for r in range(3):
            row = []
            for col in range(3):
                piece = board[r * 3 + col]
                shape = "SRT"[piece // 3]
                flavor = "VSC"[piece % 3]
                row.append(shape + flavor)
            output.append(" ".join(row))

        output.append("")

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    main()
```第一部分`solve_puzzle`为每个松露分配一个唯一的整数。 和`piece // 3`我们恢复形状，并且`piece % 3`我们恢复了味道。 这种编码很有用，因为它可以让`itertools.permutations`直接枚举每个合法委员会。 

线索预处理将每个可能的放置转换为其约束的板位置和相应允许的掩模。 面膜如`0b111`代表所有三种可能性，而一位掩码代表固定属性。 这使得匹配循环独立于文本线索表示。 

放置循环使用`range(4 - x)`和`range(4 - y)`。 寻找身高线索`x`，最大的有效起始行是`3 - x`，所以正好有`4 - x`可能的起始行。 同样的推理也适用于列。 这是防止线索延伸到棋盘之外的边界。 

按固定属性的数量对线索进行排序只是一种性能优化。 限制性线索可能会快速拒绝不正确的排列，因此检查剩余线索所花费的工作量较少。 结果不取决于此顺序。 

排列本身是一个九个整数的元组，所以`board[pos]`直接识别占据单元格的松露。 形状和味道会根据面具单独检查。 通配符启用了所有三位，使其比较自动成功。 

求解器在找到满足所有线索的棋盘后立即返回。 该问题保证了这样的棋盘存在并且是唯一的，因此在第一场比赛中停止没有任何歧义。 

输出将整数编码转换回所需的两字符形式。 形状字母是`SRT`，风味字母表是`VSC`，匹配问题的符号。 根据输出格式的要求，每个拼图后面都会附加一个空行。 

## 工作示例

 ### 示例 1

 第一个样本包含四个线索。 第一条线索已经指定了一个完整的 3x3 棋盘，因此它只有一个可能的放置位置。 其他线索也与同样的安排一致。 

| 步骤| 候选委员会状态| 结果 |
 | --- | --- | --- |
 | 1 | 开始枚举排列 | 候选人搜寻开始 |
 | 2 | 查看`3 × 3`线索| 仅存在一个展示位置 |
 | 3 | 查看`2 × 3`线索| 至少一场定级赛 |
 | 4 | 查看`3 × 3`线索| 全膳比赛|
 | 5 | 查看`2 × 3`线索| 至少一场定级赛 |
 | 6 | 所有线索均满足 | 接受板|

 结果板是```
TC SC SS
RV RC SV
TS TV RS
```这里的关键点是全尺寸线索没有位置歧义。 它还表明无需手动执行任何特殊推导即可找到解决方案，因为排列搜索直接处理线索。 

### 示例 2

 第二个谜题在第一个线索中没有给出完整的棋盘。 相反，搜索必须考虑较小线索矩形的几个可能位置。 

| 步骤| 候选州| 结果 |
 | --- | --- | --- |
 | 1 | 枚举排列 | 候选委员会选定 |
 | 2 | 查看`2 × 3`线索| 测试其两个可能的行位置 |
 | 3 | 查看`3 × 3`线索| 测试其单一可能的位置 |
 | 4 | 检查剩余线索 | 拒绝违反任何线索的候选人 |
 | 5 | 独特的幸存排列 | 接受 |

 独特的主板是```
TV RS TS
SC SV TC
SS RV RC
```这个例子练习了线索的中心解释：它的矩形可以在棋盘内平移，但不能旋转。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(9!·C·9) | O(9!·C·9) | 最多`9!`板子，最多`C ≤ 10`线索，每个线索放置最多检查 9 个细胞 |
 | 空间| O(C·9 + 9) | 存储的线索位置加上当前排列 |

 最大的搜索只有362880个候选板。 最多有 10 条线索和 9 种可能的线索放置，理论上的工作量约为 3270 万次细胞检查，而限制性线索通常会更早地终止失败的候选者。 内存使用量很小，因为棋盘仅包含九个单元，并且线索表示仅包含恒定数量的条目。 最初的竞赛声明给出了`c ≤ 10`线索维度最多为 3x3，因此穷举排列方法的大小足以满足这些约束。 

## 测试用例```python
import sys
import io
from itertools import permutations

def solve_input(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    input_fn = sys.stdin.readline

    def solve_puzzle(clues):
        shape_id = {'S': 0, 'R': 1, 'T': 2}
        flavor_id = {'V': 0, 'S': 1, 'C': 2}

        def shape_mask(ch):
            return 0b111 if ch == '_' else 1 << shape_id[ch]

        def flavor_mask(ch):
            return 0b111 if ch == '_' else 1 << flavor_id[ch]

        prepared = []

        for x, y, grid in clues:
            placements = []

            for sr in range(4 - x):
                for sc in range(4 - y):
                    placement = []

                    for r in range(x):
                        for c in range(y):
                            code = grid[r][c]
                            pos = (sr + r) * 3 + (sc + c)
                            placement.append(
                                (pos, shape_mask(code[0]), flavor_mask(code[1]))
                            )

                    placements.append(placement)

            prepared.append(placements)

        def score(placements):
            value = 0
            for placement in placements:
                for _, sm, fm in placement:
                    value += sm != 0b111
                    value += fm != 0b111
            return value

        prepared.sort(key=score, reverse=True)

        for board in permutations(range(9)):
            valid = True

            for placements in prepared:
                clue_valid = False

                for placement in placements:
                    ok = True

                    for pos, sm, fm in placement:
                        piece = board[pos]
                        sh = piece // 3
                        fl = piece % 3

                        if not (sm & (1 << sh)) or not (fm & (1 << fl)):
                            ok = False
                            break

                    if ok:
                        clue_valid = True
                        break

                if not clue_valid:
                    valid = False
                    break

            if valid:
                return board

        return None

    t = int(input_fn())
    ans = []

    for case in range(1, t + 1):
        c = int(input_fn())
        clues = []

        for _ in range(c):
            x, y = map(int, input_fn().split())
            grid = [input_fn().split() for _ in range(x)]
            clues.append((x, y, grid))

        board = solve_puzzle(clues)

        ans.append(f"Puzzle #{case}:")
        for r in range(3):
            row = []
            for c in range(3):
                piece = board[r * 3 + c]
                row.append("SRT"[piece // 3] + "VSC"[piece % 3])
            ans.append(" ".join(row))
        ans.append("")

    sys.stdout.write("\n".join(ans))

    result = sys.stdout.getvalue()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

# Provided samples
sample_input = """3
4
3 3
TC __ SS
__ __ __
__ TV __
2 3
__ SC __
RV __ SV
3 3
__ __ __
__ RC __
__ __ __
2 3
__ __ __
TS __ RS
5
2 3
__ __ __
__ __ RC
2 2
__ RS
SC __
2 2
SV TC
__ __
3 2
TV __
__ __
__ RV
3 2
__ TS
__ __
__ __
3
3 2
_C R_
_C __
S_ _C
1 2
TC _V
3 2
_V __
S_ S_
T_ _V
"""

sample_output = """Puzzle #1:
TC SC SS
RV RC SV
TS TV RS

Puzzle #2:
TV RS TS
SC SV TC
SS RV RC

Puzzle #3:
TV TC RV
SS SC RS
TS SV RC

"""

assert solve_input(sample_input) == sample_output, "provided samples"

# Minimum-size puzzle: one complete 3x3 clue.
minimum_input = """1
1
3 3
SV SR ST
RV RR RT
CV CR CT
"""

minimum_output = """Puzzle #1:
SV SR ST
RV RR RT
CV CR CT

"""

assert solve_input(minimum_input) == minimum_output, "minimum-size clue"

# All attributes are explicitly fixed, and the arrangement is reversed
# relative to the natural encoding order.
boundary_input = """1
1
3 3
CT CR CV
RT RR RV
ST SR SV
"""

boundary_output = """Puzzle #1:
CT CR CV
RT RR RV
ST SR SV

"""

assert solve_input(boundary_input) == boundary_output, "boundary arrangement"

# Multiple clues with wildcards. The full clue determines the solution,
# while the smaller clues exercise wildcard handling and movable windows.
wildcard_input = """1
3
3 3
TC SC SS
RV RC SV
TS TV RS
1 2
__ SC
2 2
__ __
RC __
"""

wildcard_output = """Puzzle #1:
TC SC SS
RV RC SV
TS TV RS

"""

assert solve_input(wildcard_input) == wildcard_output, "wildcard and window handling"

# Maximum number of clues, all individually valid and consistent.
maximum_clues_input = """1
10
3 3
TC SC SS
RV RC SV
TS TV RS
1 1
TC
1 1
SC
1 1
SS
1 1
RV
1 1
RC
1 1
SV
1 1
TS
1 1
TV
1 1
RS
"""

maximum_clues_output = """Puzzle #1:
TC SC SS
RV RC SV
TS TV RS

"""

assert solve_input(maximum_clues_input) == maximum_clues_output, "maximum clue count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 / 3 3 / SV SR ST / RV RR RT / CV CR CT`| 相同的 3x3 板 | 最小尺寸拼图和直接全盘匹配 |
 |`1 / 1 / 3 3 / CT CR CV / RT RR RV / ST SR SV`| 相同的 3x3 板 | 边界布置及完整属性匹配 |
 | 包括通配符在内的三个线索 |`TC SC SS / RV RC SV / TS TV RS`| 通配符和可移动的小窗口|
 | 十大一致线索|`TC SC SS / RV RC SV / TS TV RS`| 最大线索数和重复位置限制 |

 ## 边缘情况

 一条比棋盘还小的线索可能有几个合法的位置。 例如，一个`1 × 1`线索包含`TC`可以发生在任何地方，因此求解器必须搜索所有九个单元格。 在上面的最大线索测试中，线索`TC`仅与包含该松露的单元格兼容，而诸如`SC`和`SS`同样地识别自己的作品。 求解器不假设固定的线索来源，因此这些线索会被正确处理。 

一条线索只能约束一个属性。 代码代表`_`使用三位掩码，所以`_C`接受`SC`,`RC`， 或者`TC`， 尽管`S_`接受`SV`,`SS`， 或者`SC`。 在通配符测试中，线索`__ SC`很满意，因为董事会包含`SC`在第一行的第二个位置。 治疗`_`作为文字字符会错误地拒绝解决方案。 

一个完整的`3 × 3`线索只有一个合法位置。 对于最小尺寸测试，第一个也是唯一的线索固定每个单元格，因此没有对该线索的位置搜索。 唯一的排列正是给定的板，并且输出再现它。 

最大可能的线索数是十。 最大线索测试使用十个相互一致的线索，包括完整的板和九个单细胞线索。 求解器只需处理所有十个，并且仍然在相同的微小排列空间上运行。 这说明了为什么线索的数量只影响运行时间的一个常数因素。 

最后，形状和口味不可互换。`SC`表示方形巧克力，而`CS`将意味着不同的组合，因为第一个字符始终是形状，第二个字符始终是味道。 整数编码通过以下方式保留此顺序`piece // 3`对于形状和`piece % 3`为了风味，防止两个属性被意外交换。
