---
title: "CF 102263F - 音乐椅"
description: "我们有 n 个玩家围成一圈，Essa 从位置 p 开始。 有 n - 1 轮淘汰赛。 对于第 i 轮，歌曲持续 a[i] 秒，椅子 order[i] 是该轮结束时将不可用的椅子。"
date: "2026-08-17T20:00:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102263
codeforces_index: "F"
codeforces_contest_name: "ArabellaCPC 2019"
rating: 0
weight: 102263
solve_time_s: 147
verified: true
draft: false
---

[CF 102263F - 音乐椅](https://codeforces.com/problemset/problem/102263/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`队员围成一圈，Essa 从指定位置开始`p`。 有`n - 1`淘汰赛。 圆形用`i`，歌曲持续`a[i]`秒和椅子`order[i]`是该轮结束时将不可用的椅子。 在播放每一首歌曲之前，Essa 可以选择顺时针或逆时针移动，每个玩家沿所选方向每秒移动一个位置。 

关键的细节是圆圈不是固定的。 椅子被消除后，相应的位置就会从圆圈中消失，因此它之后的所有位置都会移动一位。 因此，下一轮在少一个位置的圆上进行。 输入给出了歌曲长度以及椅子消失的确切顺序。 我们只需要决定至少一种顺时针和逆时针选择序列是否可以让 Essa 生存下来`n - 1`回合。 官方给出的问题是`n <= 1000`、1 秒时间限制和 256 MB 内存限制。 

歌曲长度可以长达`10^9`，因此一次模拟一秒是不可能的。 只有以当前圆圈大小为模的长度才重要，因为按照圆圈大小移动会将玩家返回到相同的位置。 自从`n`只有 1000 个`O(n^2)`动态规划是实用的，而所有方向序列的指数枚举则不实用。 

在一些简单的情况下，直接实现可能会悄无声息地出错。 第一个是当歌曲长度远大于当前圈子时。 例如，```
2 1
2
1
```有答案`No`。 有两个位置，Essa 从位置 1 开始，向任一方向移动两步，他就会处于位置 1。椅子 1 是被淘汰的椅子，所以他输了。 忘记模运算或将两个方向视为不同的方向会给出错误的结果。 

另一个微妙的情况是当被移除的椅子位于内部位置时。 例如，```
5 3
4 4 4 4
4 3 2 1
```有答案`Yes`。 椅子消失后，该椅子之后的位置将重新编号。 如果我们保留 Essa 的旧索引而不压缩它，则后面的轮次会使用错误的位置。 

当两个方向选择都导致相同位置时，就会出现第三种边缘情况。 每当发生这种情况`2 * a[i]`可以被当前圆的大小整除。 例如，```
3 1
3 1
1 2
```有答案`No`。 在第一轮中，圆圈的大小为 3，向任一方向迈出三步后，Essa 将处于位置 1，这正是被淘汰的椅子。 

## 输入

 第一行包含`n`和`p`， 在哪里`n`是初始玩家数量，`p`是 Essa 使用基于 1 的索引的初始位置。 

第二行包含`n - 1`歌曲长度。 这`i`-th 值是回合的秒数`i`。 

第三行包含`n - 1`独特的椅子标签。 这`i`-th 值标识圆形消失的椅子`i`。 

椅子标签是不同的，因此明确维护幸存的椅子对于`n <= 1000`。 

## 输出

 打印`Yes`如果存在一系列顺时针和逆时针决策，允许 Essa 保留到最后。 否则，打印`No`。 

## 方法

 直接的暴力解决方案可以尝试所有可能的方向序列。 每一项都有两个选择`n - 1`轮次，所以有`2^(n-1)`可能的序列。 对于每个序列，我们可以模拟 Essa 在所有回合中的位置，并在每次淘汰后更新圆圈。 即使在维持循环后在恒定时间内处理每一轮，这也会给出`O(n * 2^n)`在最坏的情况下工作。 在`n = 1000`，这的顺序是`1000 * 2^1000`状态转换，这是完全不可行的。 

蛮力是正确的，因为完整的方向序列完全决定了艾莎的轨迹。 问题是许多不同的方向序列在同一轮到达相同的位置。 一旦两个历史融合到相同的当前位置，它们先前的差异就无关紧要了。 未来只取决于现在的圈子和艾莎现在的位置。 

这给了我们一个自然的动态编程状态。 在每轮开始时，不要记住整个决策顺序，而是记住 Essa 当前可能所处的每个位置。 布尔数组`dp`就足够了：`dp[q]`当存在一些有效的早期选择序列使 Essa 处于当前位置时，该结果正是正确的`q`。 

假设当前圆的大小`m`，移除的椅子位于索引处`r`，并且歌曲持续`a`秒。 从可到达的位置`q`，顺时针运动达到`(q + a) mod m`逆时针运动达到`(q - a) mod m`。 

如果任一目的地等于`r`，该选择将输掉该轮并被丢弃。 所有其他目的地都幸存下来，但在椅子之后`r`消失，位置大于`r`向左移动一位。 我们可以在构建下一个 DP 数组时直接应用这种压缩。 

圆圈本身可以存储为普通的 Python 列表，其中包含幸存椅子的标签。 找到移除的椅子`alive.index(...)`并删除它`pop(...)`成本`O(n)`每轮，已经在`O(n^2)`预算。 没有理由为这些约束引入 Fenwick 树或其他数据结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n * 2^n)`|`O(n)`| 太慢了 |
 | 动态规划|`O(n^2)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 按循环顺序存储当前幸存的椅子标签。 最初这是`[1, 2, ..., n]`。 将 Essa 的起始位置从从一开始的索引转换为从零开始的索引，并将其标记为唯一可到达的位置。 
2. 对于每首歌曲，让`m`是当前幸存位置的数量。 找到被消除的椅子`alive`列出并调用其从零开始的索引`r`。 索引对于运动来说很重要，因为圆圈是由连续的位置而不是原始的椅子标签表示的。 
3. 减少歌曲长度模数`m`。 如果这首歌能持续下去`a`秒，移动`a`位置与移动完全相同`a % m`围绕大小圆的位置`m`。 这避免了做任何与潜在的巨大歌曲长度成比例的工作。 
4. 对于每个可到达的位置`q`，计算两个可能的目的地。 顺时针方向的目的地是`(q + step) % m`，逆时针方向的目的地是`(q - step) % m`。 
5. 拒绝每个目的地等于`r`。 该位置在歌曲结束时不再有椅子，因此 Essa 将成为该轮中被淘汰的玩家。 
6. 对于每个幸存的目的地`x`，将其转换为椅子之后的索引`r`被删除。 如果`x < r`，其索引不变。 如果`x > r`，就变成`x - 1`。 将结果位置存储在下一个 DP 数组中。 
7. 将相应的椅子从`alive`并继续下一首歌曲。 如果 DP 数组变空，则所有可能的策略都已失败，因此答案立即`No`。 
8. 毕竟`n - 1`一轮之后，只剩下一个位置。 如果可以到达最终位置，则 Essa 具有获胜的方向选择序列，因此打印`Yes`。 

不变量是在每一轮之前，`dp[q]`对于当前圈中的位置来说，这正是正确的，在当前圈中，艾莎在经过一系列在前几轮中幸存下来的选择之后可以处于这样的位置。 过渡会考虑每个此类位置的两种合法选择，精确删除与被淘汰主席相对应的位置，然后在圆圈缩小后将幸存位置转换为新索引。 因此，每轮之后都会保留不变量。 最后，当存在一个完整的选择序列且 Essa 永远不会被淘汰时，就存在可到达的位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve(data: str) -> str:
    values = list(map(int, data.split()))
    it = iter(values)

    n = next(it)
    p = next(it)

    songs = [next(it) for _ in range(n - 1)]
    order = [next(it) for _ in range(n - 1)]

    alive = list(range(1, n + 1))

    dp = [False] * n
    dp[p - 1] = True

    for song, removed_chair in zip(songs, order):
        m = len(alive)

        # Index of the chair that disappears in the current circle.
        r = alive.index(removed_chair)

        # Only the remainder modulo the current circle size matters.
        step = song % m

        after_move = [False] * m

        for q in range(m):
            if not dp[q]:
                continue

            clockwise = (q + step) % m
            if clockwise != r:
                after_move[clockwise] = True

            counterclockwise = (q - step) % m
            if counterclockwise != r:
                after_move[counterclockwise] = True

        if not any(after_move):
            return "No"

        # Remove the chair and compress all surviving positions.
        next_dp = [False] * (m - 1)

        for x in range(m):
            if not after_move[x]:
                continue

            new_pos = x if x < r else x - 1
            next_dp[new_pos] = True

        dp = next_dp
        alive.pop(r)

    return "Yes" if dp[0] else "No"

def main():
    data = sys.stdin.buffer.read().decode()
    print(solve(data))

if __name__ == "__main__":
    main()
```这`alive`list 表示当前循环的循环顺序。 它的值是原始椅子标签，这让我们可以从输入中找到椅子，而不会丢失哪张物理椅子被删除的轨迹。 

DP 数组由当前循环位置索引，而不是原始椅子标签。 这种区别很重要，因为移除椅子会改变其后所有椅子的位置。 这`alive.index(removed_chair)`调用将原始椅子标签转换为其当前位置。 

表达式`song % m`是必要的，因为运动是循环的。 Python 整数不会溢出，因此即使最大歌曲长度也是安全的，但尽早减少它也可以使转换变得简单。 

两个目的地是独立计算的。 例如，当圆大小为 2 或运动为半圆时，它们可能相等。 将两个目的地分配给同一个布尔数组单元可以自然地处理这种情况。 

压缩步骤使用`x if x < r else x - 1`。 被移除的椅子之前的位置保留其索引，而其之后的每个位置左移一位。 删除的位置本身已被丢弃，因此永远不会在下一个数组中访问它。 

最终 DP 数组的长度为 1。 检查`dp[0]`就足够了，因为最终淘汰后游戏只剩下一个位置。 

## 工作示例

 ### 示例 1

 对于示例，Essa 从从零开始的位置 2 开始。幸存的椅子标签和可到达位置的演变如下。 

| 圆形| 移除前圈出| 移除椅子|`m`|`step`| 搬家前可到达 | 搬家后可到达 | 删除后即可访问 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 |`[1,2,3,4,5]`| 4 | 5 | 4 |`{2}`|`{1}`|`{1}`|
 | 2 |`[1,2,3,5]`| 3 | 4 | 0 |`{1}`|`{1}`|`{1}`|
 | 3 |`[1,2,5]`| 2 | 3 | 1 |`{1}`|`{0,2}`|`{0,1}`|
 | 4 |`[1,5]`| 1 | 2 | 0 |`{0,1}`|`{0,1}`|`{1}`|

 第一轮，从位置 2 顺时针移动四个位置到达位置 1，逆时针移动四个位置到达位置 3。位置 3 是被移除的椅子，所以只有位置 1 幸存。 第二轮结束后，歌曲长度可以被圆圈大小整除，因此 Essa 不会改变位置。 后面的几轮再次分支，并且在最后一轮至少有一个可达状态可以避免被移除的椅子。 答案是`Yes`。 

### 强制碰撞示例

 考虑：```
3 1
3 1
1 2
```第一首歌曲的长度为 3，而圆圈的大小为 3，因此有效运动为零。 

| 圆形| 移除前圈出| 移除椅子|`m`|`step`| 搬家前可到达 | 目的地 | 删除后即可访问 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 |`[1,2,3]`| 1 | 3 | 0 |`{0}`|`{0}`|`{}`|

 顺时针和逆时针运动都会使 Essa 处于位置 0，因为三步即可完成一整圈。 位置 0 正是被淘汰的椅子。 没有任何状态能够在第一轮中幸存下来，所以答案是`No`。 

此示例说明了为什么 DP 必须在应用运动后针对移走的椅子测试目的地。 仅仅检查 Essa 是否从安全的椅子上开始是不够的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n^2)`| 有`n - 1`轮次，每轮最多扫描`n`DP 位置和执行`O(n)`制定尚存主席名单。 |
 | 空间|`O(n)`| 当前和下一个 DP 数组，以及幸存的主席列表，每个最多包含`n`元素。 |

 和`n <= 1000`，在最坏的情况下，DP 只执行大约几百万次简单操作。 歌曲长度不会影响运行时间，因为每首歌曲的长度都会以当前圆圈大小为模进行缩减。 内存使用呈线性且远低于 256 MB 限制。 

## 测试用例```python
import io
import sys

def solve(data: str) -> str:
    values = list(map(int, data.split()))
    it = iter(values)

    n = next(it)
    p = next(it)

    songs = [next(it) for _ in range(n - 1)]
    order = [next(it) for _ in range(n - 1)]

    alive = list(range(1, n + 1))

    dp = [False] * n
    dp[p - 1] = True

    for song, removed_chair in zip(songs, order):
        m = len(alive)
        r = alive.index(removed_chair)
        step = song % m

        after_move = [False] * m

        for q in range(m):
            if not dp[q]:
                continue

            x = (q + step) % m
            if x != r:
                after_move[x] = True

            x = (q - step) % m
            if x != r:
                after_move[x] = True

        if not any(after_move):
            return "No"

        next_dp = [False] * (m - 1)

        for x in range(m):
            if after_move[x]:
                next_dp[x if x < r else x - 1] = True

        dp = next_dp
        alive.pop(r)

    return "Yes" if dp[0] else "No"

def run(inp: str) -> str:
    return solve(inp).strip()

# Provided sample
assert run("""\
5 3
4 4 4 4
4 3 2 1
""") == "Yes", "sample 1"

# Minimum size, large even song length.
# Essa starts on the chair that disappears and makes a full number
# of revolutions, so both directions lose.
assert run("""\
2 1
2
1
""") == "No", "minimum size and modulo"

# Minimum size, boundary starting position.
# Essa starts at chair 2, so the same even movement keeps him safe.
assert run("""\
2 2
2
1
""") == "Yes", "minimum size, last position"

# Forced collision caused by the song length being a multiple
# of the current circle size.
assert run("""\
3 1
3 1
1 2
""") == "No", "forced collision"

# Boundary starting position with a changing circle.
assert run("""\
3 3
1 1
3 2
""") == "Yes", "initial position n"

# Maximum-size case. All songs are equal and the elimination order
# is increasing. The DP still finishes with a reachable position.
n = 1000
maximum_case = (
    f"{n} 1\n"
    + " ".join(["1"] * (n - 1))
    + "\n"
    + " ".join(map(str, range(1, n)))
    + "\n"
)
assert run(maximum_case) == "Yes", "maximum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 1 / 2 / 1`|`No`| 最小尺寸和以圆尺寸为模的运动 |
 |`2 2 / 2 / 1`|`Yes`| 边界起始位置为`p = n`|
 |`3 1 / 3 1 / 1 2`|`No`| 两个方向选择都崩溃到相同的失败位置 |
 |`3 3 / 1 1 / 3 2`|`Yes`| 最终椅子标签处的初始位置和位置压缩 |
 |`n = 1000`, 所有歌曲`1`，增加消除顺序 |`Yes`| 最大输入大小和全部相等的歌曲长度 |

 ## 边缘情况

 对于最小尺寸的情况```
2 1
2
1
```当前圆圈的大小为 2，歌曲长度减少为`2 % 2 = 0`。 因此，无论方向如何，Essa 都保持在位置 0。 由于椅子 1 位于位置 0 并且已被移除，因此两个选择都被拒绝。 DP变空并返回`No`。 

对于与 Essa 在另一个边界处的同一个圆，```
2 2
2
1
```他的初始零基位置为 1。有效移动仍然为零，但位置 1 不是位置 0 处被移除的椅子。该状态在唯一一轮中幸存下来，留下一个可到达的位置，所以答案是`Yes`。 

对于内部拆除，```
5 3
4 4 4 4
4 3 2 1
```第一个移除的椅子 4 的当前索引为 3。Essa 从索引 2 开始。随着移动`4 mod 5 = 4`，两个目的地是索引 1 和 3。索引 3 被消除，留下索引 1。一旦椅子 4 被移除，幸存的圈子就变成`[1,2,3,5]`，因此索引 1 仍然指椅子 2。压缩是保持后续位置正确的原因。 

对于强制碰撞，```
3 1
3 1
1 2
```第一个动作是`3 mod 3 = 0`。 Essa从索引0开始，两个方向都到达索引0，索引0就是被淘汰的椅子。 DP在第一轮之后就没有存活状态，所以后面的歌曲永远不需要考虑。 

对于最大尺寸的情况，圆从 1000 个位置开始，然后一次缩小一个位置。 每首歌曲的长度为 1，因此每轮只考虑两个相邻的目的地。 尽管可以存在许多不同的方向序列，DP 也会合并到达相同位置的所有序列。 在任何一轮中最多检查 1000 个状态，从而实现二次增长而不是指数增长。
