---
title: "CF 102297H - 摘星"
description: "印章是一个固定轴对齐的十字形，由五个单元组成：中心单元及其四个正交相邻的单元。 冲压将这五个纸电池变成黑色。"
date: "2026-08-13T22:44:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102297
codeforces_index: "H"
codeforces_contest_name: "UCF Locals 2015"
rating: 0
weight: 102297
solve_time_s: 112
verified: true
draft: false
---

[CF 102297H - 摘星](https://codeforces.com/problemset/problem/102297/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 印章是一个固定轴对齐的十字形，由五个单元组成：中心单元及其四个正交相邻的单元。 冲压将这五个纸电池变成黑色。 由于黑色墨水在另一次压印后仍保持黑色，因此允许重叠压印，但压印永远不能接触到应该保持白色的单元格。 

任务是找到最少数量的此类交叉放置，其并集恰好是黑色单元格的集合。 如果图片已经全白，则答案为零。 如果某个黑色单元格不能被任何合法印章覆盖，那么答案是不可能的。 

每个图像最多有 9 行和 9 列。 Codeforces页面目前给出了2.5秒的时间限制和256 MB的内存限制。 网格的绝对尺寸很小，但在 9 x 9 图像中最多可以有 49 个可能的印记中心。 这使得尝试印记位置的每个子集与可以容纳印记的单元格数量呈指数关系，而不仅仅是网格宽度的指数关系。 

第一个有用的观察是印章中心只能是内部单元，因为所有四个臂必须保留在纸张内。 法律中心还必须有`#`十字占据了所有五个单元格。 一旦满足这些条件，放置印章总是安全的。 这让我们可以将问题分解为选择合法的印章中心并确保他们的工会覆盖每个黑牢房。 

有几种边缘情况无法实现更简单的实现。 无法对单格黑色图像进行标记：```
1
1 1
#
```正确的输出是`Image #1: impossible`，因为邮票无法放入 1 x 1 的纸张内。 

空图像根本不需要标记：```
1
1 1
.
```答案是`Image #1: 0`。 坚持寻找邮票的搜索会错误地宣称这是不可能的。 

黑角也是无法遮盖的。 例如，```
1
3 3
###
###
###
```是不可能的。 3 x 3 纸张中唯一可能的印章中心是中间单元格，并且其十字不包含任何一个角。 如果一个粗心的解决方案只检查每个选定的标记是否安全，则可能会接受该图像，而不检查每个黑色单元是否都被覆盖。 

还有另一种微妙的情况，即存在合法印章但还不够。 为了```
1
3 3
.#.
###
.#.
```中心十字是一个合法的标记，覆盖了每个黑色单元格，因此答案恰好是 1。对于较大的图像，仅检查合法中心的存在是不够的，因为仍然必须覆盖所有黑色单元格。 

## 方法

 最直接的暴力方法是识别每个合法的标记位置并尝试这些位置的每个子集。 对于每个子集，我们可以构建所得的黑色单元格，将它们与目标进行比较，并保留最小的子集。 

这是正确的，因为每个可能的压印序列都可以由被压印的位置集表示。 重复相同的位置永远不会有帮助，因为第二次冲压不会改变细胞。 然而，9 x 9 的板有 7 x 7 或 49 个可能的印章中心。 在最坏的情况下，每一个都可能有一个合法的印章，给`2^49 = 562,949,953,421,312`子集。 即使检查一个子集只需要几次操作，这也远远超出了可用时间。 

使问题易于管理的关键结构是每个标记仅影响一行及其两相邻行。 在其自己的行内，它影响三个连续的列。 这意味着在逐行处理图像时，当前行的覆盖范围仅取决于前一行、当前行和下一行中的图章选择。 

因为最多有 9 列，所以我们可以用位掩码来表示一行中选择的所有图章中心。 印记中心只能出现在其中之一`c - 2`内部柱子，所以最多有`2^7 = 128`一排的可能掩码。 

假设前一行使用掩码`prev`,当前行使用掩码`cur`，下一行使用掩码`nxt`。 当前行接收垂直覆盖范围`prev`和`nxt`。 它接收水平覆盖`cur`，因为每个选定的中心也会对紧邻其左侧和右侧的单元格进行着色。 如果`horizontal[cur]`表示`cur | (cur << 1) | (cur >> 1)`,

 那么当前行的完整覆盖是`prev | horizontal[cur] | nxt`。 

我们可以检查这是否完全涵盖了目标行中所需的内容。 由于已知每个选定的中心都是合法的图章，因此没有选定的图章可以为点着色。 因此我们只需要检查每个目标`#`被覆盖。 

这给出了一个动态程序，其状态记住两个连续的行掩码。 当我们选择下一个行掩码时，最旧的行就完全确定了，可以检查和丢弃。 蛮力之所以有效，是因为它明确地考虑了每组邮票，但当存在许多可能的中心时，它就会失败。 交叉的行局部性质让我们可以用一个小的位掩码动态程序来代替 49 个位置上的指数搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(2^((r-2)(c-2)) * rc)`|`O(rc)`| 太慢了|
 | 最佳|`O(r * 2^(3(c-2)))`|`O(2^(2(c-2)))`| 已接受 |

 和`c <= 9`，最佳转移界限至多大致为`9 * 2^21`，这对于这些微小的网格来说很实用。 

## 算法演练

 1. 阅读网格并确定哪些内部单元格可以作为印章中心。 一个中心`(i,j)`当中心及其四个邻居都为时是合法的`#`。 这种印章可以安全使用，因为它不会在目标点上产生黑色墨水。 
2. 对于每一行，构建一个位掩码`allowed[row]`包含该行中的所有合法印章中心。 边界行自动有一个空蒙版，因为图章无法在此处居中。 
3. 生成每个子掩码`allowed[row]`。 每个子掩码代表将哪些合法标记放置在该行中的一种可能选择。 包含零掩码是因为在一行中不放置邮票是一个有效的选择。 
4. 预先计算每个可能的行掩码的水平覆盖范围。 如果`cur`选择一些印章中心，`cur`,`cur << 1`， 和`cur >> 1`代表中心单元及其水平臂。 它们的并集正是当前行中以该行为中心的图章着色的部分。 
5. 用两个空行初始化动态程序。 从概念上讲，图像之前的行没有标记，并且第一图像行也没有可能的标记中心，因此初始状态为`(prev, cur) = (0, 0)`成本为零。 
6. 从上到下处理图像。 对于当前行，选择一个掩码`nxt`从下一行可能的邮票掩码中。 然后，当前行就完全确定了，因为它的垂直覆盖范围来自于`prev`和`nxt`，而其水平覆盖范围来自`cur`。 
7. 计算`covered = prev | horizontal[cur] | nxt`。 仅当当前目标行中的每个黑色单元格都包含在`covered`。 在位掩码形式中，条件是`(covered & target[row]) == target[row]`。 
8. 将动态编程状态从`(prev, cur)`到`(cur, nxt)`并添加所选邮票的数量`nxt`到成本。 所选邮票的数量很简单`nxt.bit_count()`。 
9. 在最后一行，用力`nxt = 0`。 这可以防止邮票被放置在纸张之外，并为最后一行提供完整的覆盖检查。 
10. 处理完最后一行后，在所有幸存状态中取最小成本。 如果没有状态幸存，目标图像是不可能的。 

### 为什么它有效

 不变量是 DP 状态`(prev, cur)`表示当前行中所有可能的邮票选择，并且恰好存储了最小数量的邮票，同时仅留下下一行未决定。 当算法选择`nxt`，现在已知可以影响当前行的每个标记：它们位于上一行、当前行或下一行的中心。 因此覆盖测试是准确的。 当当前行的黑色单元全部被覆盖时，会精确地保持过渡，并且由于每个选定的标记都是单独合法的，因此不会有任何点被着色。 检查完该行后，前一行可能会被忘记，因为未来的邮票无法到达它。 每个有效的标记配置都会产生 DP 考虑的行掩码序列，并且每个 DP 序列对应于合法的标记，因此最小化标记的累积数量给出了真正的最佳值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**9

def solve_case(r, c, grid):
    # A stamp center must be strictly inside the grid.
    # allowed[i] contains the columns where a legal stamp can be centered.
    allowed = [0] * r

    for i in range(1, r - 1):
        mask = 0
        for j in range(1, c - 1):
            if (
                grid[i][j] == '#'
                and grid[i - 1][j] == '#'
                and grid[i + 1][j] == '#'
                and grid[i][j - 1] == '#'
                and grid[i][j + 1] == '#'
            ):
                mask |= 1 << j
        allowed[i] = mask

    # Every possible set of stamp centers in a row.
    choices = []
    for mask in allowed:
        row_choices = []
        sub = mask
        while True:
            row_choices.append(sub)
            if sub == 0:
                break
            sub = (sub - 1) & mask
        choices.append(row_choices)

    # Target row as a bitmask.
    target = []
    for row in grid:
        mask = 0
        for j, ch in enumerate(row):
            if ch == '#':
                mask |= 1 << j
        target.append(mask)

    # Horizontal coverage produced by stamps centered in each row.
    full = (1 << c) - 1
    horizontal = [0] * (1 << c)
    for mask in range(1 << c):
        horizontal[mask] = (
            mask
            | ((mask << 1) & full)
            | (mask >> 1)
        )

    # dp[(prev, cur)] = minimum number of stamps selected so far.
    # Initially both rows contain no stamps.
    dp = {(0, 0): 0}

    for i in range(r):
        ndp = {}

        if i + 1 < r:
            next_choices = choices[i + 1]
        else:
            # Nothing may be centered outside the paper.
            next_choices = [0]

        for (prev, cur), cost in dp.items():
            base = prev | horizontal[cur]

            for nxt in next_choices:
                covered = base | nxt

                # Every '#' in this row must be covered.
                if (covered & target[i]) != target[i]:
                    continue

                new_cost = cost + nxt.bit_count()
                state = (cur, nxt)

                old = ndp.get(state, INF)
                if new_cost < old:
                    ndp[state] = new_cost

        dp = ndp

        if not dp:
            return None

    return min(dp.values()) if dp else None

def solve():
    t = int(input())

    out = []

    for case in range(1, t + 1):
        r, c = map(int, input().split())
        grid = [input().strip() for _ in range(r)]

        answer = solve_case(r, c, grid)

        if answer is None:
            result = "impossible"
        else:
            result = str(answer)

        out.append(f"Image #{case}: {result}")
        out.append("")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一部分`solve_case`识别合法的印章中心。 五单元测试是在动态程序之前特意进行的，因为一旦中心通过了它，就保证以后每次使用该中心都不会产生不需要的黑色单元。 

这`allowed`mask 使用实际列号作为位位置。 这使得水平移位直接与网格列对齐，因此压缩后的列索引和原始列索引之间没有转换。 由于法律中心仅位于列`1`通过`c - 2`，向左或向右移动他们的面具留在纸内。 

这`choices`构造枚举每行的法律中心的每个子集。 这不是枚举所有列的任意子集。 在最坏的情况下，只有 7 个可能的中心列，因此一行最多有 128 个选择。 

目标行也表示为掩码。 表达式`(covered & target[i]) == target[i]`检查覆盖范围，而不关心黑色单元是否被覆盖一次或多次。 这与物理冲压过程相匹配，其中重复的黑色墨水与单层无法区分。 

动态编程状态恰好包含两个行掩码。`prev`提供当前行上方居中的邮票向下臂，`cur`提供当前行的中心和水平臂，并且`nxt`提供位于其下方中心的向上的邮票臂。 检查当前行后，`prev`不再需要。 

Python 中不存在整数溢出问题，并且最大掩码仅使用九位。 这`INF`值远大于可用邮票的最大可能数量（49）。 

最后一个转换明确使用`[0]`为了`nxt`。 如果没有此边界条件，DP 在概念上可以使用位于纸张下方中心的图章来覆盖最后一行中的单元格，这将违反整个图章保留在纸张内的要求。 

## 工作示例

 第一个示例图像是一张仅包含一个点的 1 x 1 纸张。 没有理由贴邮票，事实上，任何邮票都放不下。 DP 从空掩码开始，并立即验证空覆盖范围是否满足空目标行。 

| 行|`prev`|`cur`|`nxt`| 目标| 覆盖范围| 成本|
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 |`0`|`0`|`0`|`0`|`0`|`0`|

 由于目标不包含黑细胞，因此转换得以保留。 最终最小值为零，给出`Image #1: 0`。 这说明了为什么必须将空图片视为有效的零标记解决方案。 

第二个示例图像是单个黑色单元格。 同样，只有一排，因此不可能有合法的印章中心。 目标位掩码包含一位，但唯一可能的覆盖范围为零。 

| 行|`prev`|`cur`|`nxt`| 目标| 覆盖范围| 成本|
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 |`0`|`0`|`0`|`1`|`0`| 无效 |

 覆盖测试失败的原因是`(0 & 1) != 1`。 没有 DP 状态存活，所以结果是`impossible`。 这证实了该算法能够区分空目标和包含未覆盖的黑色单元格的目标。 

对于第三个样本，3 x 3 十字只有一个合法中心。```
.#.
###
.#.
```唯一可能的印记掩模是中心位。 第一行没有可能的中心，因此 DP 选择中心为`nxt`检查顶行时。 中心向上的手臂覆盖了该行中唯一的黑色单元格。 

| 行|`prev`|`cur`|`nxt`| 目标| 覆盖范围| 成本|
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 |`0`|`0`| 中心 | 中心 | 中心 |`1`|
 | 1 |`0`| 中心 |`0`| 左、中、右 | 左、中、右 |`1`|
 | 2 | 中心 |`0`|`0`| 中心 | 中心 |`1`|

 检查完所有三行后，选定的单个中心将覆盖每个黑色单元格。 答案是1。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(r * 2^(3(c-2)))`| 最多`2^(c-2)`在最坏的情况下考虑三个连续行中每一行的掩码 |
 | 空间|`O(2^(2(c-2)))`| 一个状态存储两个行掩码，最多有`2^(c-2)`每个的可能性|

 为了`r,c <= 9`，连续最多有七个可能的邮票中心列。 因此，DP 每行最多使用 128 个掩码，最多可处理 16,384 个两行状态。 即使最差的转换界限对于 2.5 秒限制来说也足够小，并且仅使用 256 MB 内存限制的一小部分。 

## 测试用例```python
import sys
import io

INF = 10**9

def solve_case(r, c, grid):
    allowed = [0] * r

    for i in range(1, r - 1):
        mask = 0
        for j in range(1, c - 1):
            if (
                grid[i][j] == '#'
                and grid[i - 1][j] == '#'
                and grid[i + 1][j] == '#'
                and grid[i][j - 1] == '#'
                and grid[i][j + 1] == '#'
            ):
                mask |= 1 << j
        allowed[i] = mask

    choices = []
    for mask in allowed:
        row_choices = []
        sub = mask
        while True:
            row_choices.append(sub)
            if sub == 0:
                break
            sub = (sub - 1) & mask
        choices.append(row_choices)

    target = []
    for row in grid:
        mask = 0
        for j, ch in enumerate(row):
            if ch == '#':
                mask |= 1 << j
        target.append(mask)

    full = (1 << c) - 1
    horizontal = [0] * (1 << c)
    for mask in range(1 << c):
        horizontal[mask] = (
            mask
            | ((mask << 1) & full)
            | (mask >> 1)
        )

    dp = {(0, 0): 0}

    for i in range(r):
        ndp = {}
        next_choices = choices[i + 1] if i + 1 < r else [0]

        for (prev, cur), cost in dp.items():
            base = prev | horizontal[cur]

            for nxt in next_choices:
                covered = base | nxt

                if (covered & target[i]) != target[i]:
                    continue

                state = (cur, nxt)
                new_cost = cost + nxt.bit_count()

                if new_cost < ndp.get(state, INF):
                    ndp[state] = new_cost

        dp = ndp

        if not dp:
            return None

    return min(dp.values()) if dp else None

def solve():
    input = sys.stdin.readline
    t = int(input())
    out = []

    for case in range(1, t + 1):
        r, c = map(int, input().split())
        grid = [input().strip() for _ in range(r)]

        ans = solve_case(r, c, grid)
        value = "impossible" if ans is None else str(ans)

        out.append(f"Image #{case}: {value}")
        out.append("")

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

sample_input = """5
1 1
.
1 1
#
3 3
.#.
###
.#.
3 5
.#.#.
#####
.#.#.
4 7
.##.#..
######.
.######
..#..#.
"""

sample_output = """Image #1: 0

Image #2: impossible

Image #3: 1

Image #4: 2

Image #5: 5

"""

assert run(sample_input) == sample_output, "provided samples"

assert run("""1
1 1
.
""") == """Image #1: 0

""", "minimum-size empty image"

assert run("""1
1 1
#
""") == """Image #1: impossible

""", "minimum-size black image"

assert run("""1
3 3
###
###
###
""") == """Image #1: impossible

""", "corner cells cannot be covered"

assert run("""1
3 3
.#.
###
.#.
""") == """Image #1: 1

""", "single legal stamp"

max_empty = "9 9\n" + "\n".join(["........."] * 9) + "\n"
assert run("1\n" + max_empty) == """Image #1: 0

""", "maximum-size empty image"
```第一个定制案例检查尽可能小的纸张，并验证全白图像是否需要零印章。 第二个使用相同的尺寸和一个黑色单元，测试空目标和不可能目标之间的区别。 第三个发现了仅检查邮票本身是否合法的常见错误，因为 3 x 3 全黑网格有一个合法的中心，但其角落未被覆盖。 第四个是最小的非平凡有效冲压并检查中心边界条件。 第五个练习最大 9 x 9 维度，同时将答案保持为零，这还检查最大允许输入大小下的掩模创建和 DP 行为。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`和`.`|`Image #1: 0`| 最小尺寸和空目标|
 |`1 1`和`#`|`Image #1: impossible`| 邮票无法装入|
 |`3 3`与所有`#`|`Image #1: impossible`| 不可掩盖的角落|
 |`3 3`十字|`Image #1: 1`| 精确的单图章解决方案 |
 |`9 9`与所有`.`|`Image #1: 0`| 最大尺寸和零掩模处理|

 ## 边缘情况

 对于全白图像，每个目标行的掩码为零。 DP 始终可以选择零标记，并且每一行都通过覆盖测试，因为`(0 & 0) == 0`。 例如，```
1
1 1
.
```产生`Image #1: 0`。 在实现中不需要特殊情况，因为空的标记集自然地由零掩码表示。 

对于小于图章的黑色图像，没有合法的中心位置。 考虑```
1
1 1
#
```这`allowed`数组仅包含零。 唯一的 DP 状态覆盖率为零，但目标包含一个黑色位，因此覆盖率测试会拒绝它。 最终状态集为空，答案变为`impossible`。 

黑色角永远不会被十字覆盖，因为印章没有对角单元。 在```
1
3 3
###
###
###
```该中心是合法的，但其覆盖范围```
.#.
###
.#.
```角位仍然不存在。 当DP检查第一行时，所选择的中心只能覆盖中间位，因此目标掩码不包含在覆盖掩码中。 配置在到达最后一行之前被拒绝。 

有效的中心还要求所有五个印章单元均为黑色。 例如，```
1
3 3
...
.#.
...
```有一个黑色的中心，但没有合法的印记，因为放置十字会使四个点着色。 中心未添加到`allowed`，所以DP没有办法使用它并正确报告`impossible`。 

重叠的邮票不需要特殊处理。 在 3 x 5 样本中，```
.#.#.
#####
.#.#.
```两个十字可以集中在两个内部黑色柱子上。 有些单元格被两个标记覆盖，但目标只关心单元格是否至少有一次是黑色的。 DP 使用的按位并自然消除了一次覆盖和多次覆盖之间的任何区别，最小值为 2。 

最后一行边界通过强制处理`nxt`为零。 如果没有这种限制，过渡可以使用纸张下方的假设中心，其向上的臂覆盖最后一行中的目标单元格。 相同的原理已经应用于顶部到初始零状态，因此不允许任何印章延伸超出任何垂直边界。
