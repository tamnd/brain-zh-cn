---
title: "CF 102428H - 保留还是继续？"
description: "在每个决策点，Catelyn 的永久得分为 C，临时回合总数为 X。Hoster 的永久得分为 H。Catelyn 必须在保留当前回合总数或再次掷骰子之间做出选择。"
date: "2026-08-12T07:18:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102428
codeforces_index: "H"
codeforces_contest_name: "2019-2020 ACM-ICPC Latin American Regional Programming Contest"
rating: 0
weight: 102428
solve_time_s: 175
verified: true
draft: false
---

[CF 102428H - 保留还是继续？](https://codeforces.com/problemset/problem/102428/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 在每个决策点，凯特琳都有一个永久的分数`C`和临时回合总数`X`。 主机拥有永久积分`H`。 凯特琳必须在保留当前回合总数或再次掷骰子之间做出选择。 目标不是最大化即时分数，而是假设两名玩家都做出最佳决策，凯特琳最终在霍斯特之前达到 75 分的概率。 

如果凯特琳成立，她的分数变为`C + X`。 如果正好是 75，她立即获胜。 如果小于 75，则 Hoster 进行下一轮。 如果凯特琳继续，则掷骰结果为 1 会立即通过该回合，而不会改变任何永久得分。 从 2 到 6 的掷骰会增加`X`。 如果新的总数使`C + X`超过 75，则该回合失败而不是得分。 

在达到 75 分之前，玩家最多有 74 个相关永久分数，并且回合总数也受到到 75 分的距离的限制。官方问题页面给出了 5 秒的时间限制和 1024 MB 的内存限制。 这些界限在绝对意义上是慷慨的，但随机游戏在两个玩家之间具有循环依赖性，因此简单的递归搜索是不够的。 75 的小目标值是基于分数对的完整动态程序成为可能的关键原因。 

第一个微妙的案例是准确的打击。 例如，```
1
73 0 2
```必须产生`H`。 持有分数正好为 75 并立即获胜。 一个粗心的实施，仅仅将持有视为“将回合交给对手”，将会错误地失去这个获胜的转变。 

第二个微妙的情况达到了 74。考虑```
1
72 0 2
```如果 Catelyn 成立，她的分数将变为 74。她永远不可能恰好达到 75，因为每次非 1 掷骰至少会增加 2，因此该决策最终获胜的概率为零。 粗心的实现可能会将 74 视为普通的未完成分数，并允许未来掷骰子 1 或某种人为增量达到 75。 

第三个微妙的情况是翻滚破坏了转弯。 如果凯特琳有`C = 70`和`X = 4`，再掷 2 点，临时总分为 6，永久得分为 76。该结果不会得分并通过该回合。 这不是一种得分为 76 的状态，将其视为一种会破坏复发。 

第四个微妙的情况是参与者之间的循环依赖。 即使所有临时回合状态都按递减排序`X`，Catelyn 回合开始时的值取决于 Hoster 玩时的回合开始值。 普通的非循环 DP 无法独立解析这两个值。 

## 方法

 直接的暴力方法会扩展整个游戏树。 每次掷骰都有六种可能的结果，每次非 1 结果后有两种选择：坚持或继续。 游戏甚至不能保证在固定的掷骰次数后终止，因为玩家可以重复掷 1 或失败，而不会改变他们的分数。 如果我们人为地停下来`D`滚动，单独滚动序列的数量是`6^D`。 为了`D = 20`，这大约是`3.66 × 10^15`在考虑策略选择之前离开。 因此，详尽的模拟无法给出精确的解决方案。 

一种更结构化的方法是动态规划。 让`dp[c][h][x]`是当轮到的玩家得分时凯特琳获胜的概率`c`, 对手有分数`h`，当前回合总数为`x`。 一旦知道对手下一回合的概率，每个临时总数的值就可以从大的`x`降到小`x`，因为继续只会移动`x`向上。 

困难在于状态`x = 0`。 让`A = dp[c][h][0]`。 在持有或掷出 1 后，游戏切换到对手，因此我们还需要`dp[h][c][0]`。 这在两个回合开始状态之间创建了一个循环。 

关键的观察是博弈是零和博弈。 从两个普通的非终结得分状态开始，恰好有一个玩家最终以概率 1 获胜，因此`dp[c][h][0] + dp[h][c][0] = 1`。 

因此，我们不需要猜测两个未知的概率，而只需要找到一个值`A`。 如果我们暂时猜测凯特琳在回合开始时的获胜概率为`A`，那么Hoster对应的概率为`1 - A`。 固定该值后，可以从较大的转弯总数到较小的转弯总数确定性地计算 Catelyn 的所有临时转弯状态。 这给出了一个函数`F(A)`， 在哪里`F(A)`是在最优决策下实际掷第一个骰子所获得的概率。 

真实值满足`A = F(A)`。 

因为从回合中获得的值相对于猜测的对手概率是单调的，所以我们可以通过二分查找找到这个不动点。 小分数限制使得这变得实用。 我们按降序处理分数对`c + h`，因此每当持有移动当前永久分数`c`到`c + x`，所需的回合开始状态具有严格更大的分数总和并且已经被计算。 

这提供了从蛮力到最终方法的清晰进展。 蛮力之所以有效，是因为每种可能的未来都被明确表示，但树呈指数增长并且可能不会终止。 动态规划删除了重复的子树，而定点观察则删除了剩余的两状态循环。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(6^D)`对于一个`D`-roll 截断 |`O(D)`与DFS | 太慢而且不准确|
 | 最佳|`O(75^3 log(1/ε))`|`O(75^2)`| 已接受 |

 ## 算法演练

 1. 定义`dp[c][h]`当轮到玩家的永久分数为 时，轮到玩家获胜的概率`c`对手的永久得分为`h`，有一个空的临时转弯。 

该游戏是对称的，因此对于每个非终结对，我们有`dp[c][h] = 1 - dp[h][c]`。 同等分数因此具有确切的价值`0.5`。 
2. 处理所有对`(c, h)`按降序排列`c + h`。 

假设我们正在解决一对总得分`c + h`。 如果 Catelyn 积累后持有`x > 0`，她的新分数是`c + x`，所以对手的回合开始状态有分数总和`h + c + x`，它严格来说更大。 该状态已经被计算出来。 
3. 对于固定的猜测`A`为了`dp[c][h]`， 使用`1 - A`作为对手回合开始获胜概率。 

我们现在知道当前回合结束时会发生什么。 掷骰为 1 或破坏回合的掷骰将给予对手下一个回合，因此当前玩家的价值为`1 - (1 - A) = A`当对手的状态用自己的获胜概率来表示时。 更直接地实现，如果对手获胜的概率是`p`，每一次立即转弯损失都有价值`1 - p`。 
4. 计算临时转弯值（从最大可能总数到 2）。 

让`v[x]`是当前玩家准确积累后的最优获胜概率`x`回合中的点数。 持有给予`1 - dp[h][c+x]`，除非当`c+x = 75`，其中持有立即获胜并且值为 1。 

继续给出六个结果的平均值。 1 的卷给出`1 - p`。 从 2 到 6 的掷骰要么移动到`v[x+d]`当所得分数不超过 75 分时，或给出`1 - p`当回合失败时。 

所以，`v[x] = max(hold, continue)`。 

由于每`continue`过渡到更大的临时总数，下降`x`使这种循环成为非循环的。 
5.计算完所有临时状态后，评估回合的开始。 

凯特琳必须滚动一次。 结果1立即结束回合。 2 到 6 中的每个结果要么达到已计算的结果之一`v[d]`状态或半身像。 它们的平均值是当前猜测产生的值。 
6. 对回合开始概率进行二分搜索。 

设当前猜测为`A`。 计算结果概率`F(A)`。 如果`F(A) > A`，猜测值太小，因此将下限向上移动。 否则将上限向下移动。 

五十次迭代将数值间隔减小到远低于所需值`10^-5`两个动作之间的分离。 
7. 存储分数对的结果值。 

为了`c < h`，将计算值存储在`dp[c][h]`及其补集`dp[h][c]`。 为了`c = h`， 店铺`0.5`直接地。 
8. 完整的表可用后，通过重建其临时轮值来回答每个查询`(C, H)`一对。 

保持值为`1`什么时候`C + X = 75`，否则就是`1 - dp[H][C+X]`。 继续值是六次可能的下一次掷骰的平均值，使用预先计算的临时回合值并将每次失败视为立即回合损失。 输出`H`当保持值较大时，并且`C`否则。 

计算背后的不变量是，当求解时`(c, h)`，保持所需的每个永久得分状态都有严格更大的得分总和并且已经是精确的。 唯一未解决的依赖性是对手的回合开始概率，并且对称关系将该依赖性减少到一个标量。 二分搜索收敛到唯一的不动点，因此从中计算出的临时值正是该分数对的最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAX_SCORE = 73
TARGET = 75

def solve(data):
    it = iter(data.split())
    q = int(next(it))
    queries = []

    for _ in range(q):
        c = int(next(it))
        h = int(next(it))
        x = int(next(it))
        queries.append((c, h, x))

    # dp[c][h] = probability that the player to move wins
    # with permanent scores c and h and an empty turn.
    #
    # Columns 74 and 75 are useful boundary states:
    # dp[c][74] = 1 for c < 74, because the opponent at 74
    # can never reach exactly 75.
    # dp[c][75] = 0 because the opponent has already won.
    dp = [[0.0] * 76 for _ in range(74)]

    for c in range(74):
        dp[c][74] = 1.0
        dp[c][75] = 0.0

    def turn_value(c, h, opponent_win):
        """
        Compute the optimal value of the current turn when:
          current permanent score = c
          opponent permanent score = h
          opponent's beginning-of-turn win probability = opponent_win

        Returns the beginning-of-turn value for the current player.
        """
        max_x = TARGET - c
        lose_turn = 1.0 - opponent_win

        v = [0.0] * (max_x + 8)
        suffix = [0.0] * (max_x + 9)

        # Reaching exactly 75 means the player can hold and win.
        v[max_x] = 1.0
        suffix[max_x] = 1.0

        row = dp[h]

        for x in range(max_x - 1, 1, -1):
            # Holding scores c + x.
            hold = 1.0 - row[c + x]

            # Continue:
            # roll 1 is always a turn loss.
            # Rolls 2..6 either reach a known state or bust.
            left = x + 2
            right = min(x + 6, max_x)

            if left <= right:
                known = right - left + 1
                future = suffix[left] - suffix[right + 1]
            else:
                known = 0
                future = 0.0

            continue_value = (
                future + (6 - known) * lose_turn
            ) / 6.0

            v[x] = max(hold, continue_value)
            suffix[x] = suffix[x + 1] + v[x]

        # First roll of a new turn.
        left = 2
        right = min(6, max_x)

        if left <= right:
            known = right - left + 1
            future = suffix[left] - suffix[right + 1]
        else:
            known = 0
            future = 0.0

        return (future + (6 - known) * lose_turn) / 6.0

    # Solve score pairs from larger c+h to smaller c+h.
    for total in range(146, -1, -1):
        lo_c = max(0, total - 73)
        hi_c = min(73, total)

        for c in range(lo_c, hi_c + 1):
            h = total - c

            if c > h:
                continue

            if c == h:
                dp[c][h] = 0.5
                continue

            # We solve for A = dp[c][h].
            # The swapped state has value 1-A.
            lo = 0.0
            hi = 1.0

            for _ in range(50):
                mid = (lo + hi) * 0.5

                # If dp[c][h] = mid, then the opponent's
                # beginning-of-turn probability is 1-mid.
                got = turn_value(c, h, 1.0 - mid)

                if got > mid:
                    lo = mid
                else:
                    hi = mid

            a = (lo + hi) * 0.5
            dp[c][h] = a
            dp[h][c] = 1.0 - a

    def turn_states(c, h, opponent_win):
        """
        Same recurrence as turn_value, but keeps all temporary
        turn states because queries need v[X].
        """
        max_x = TARGET - c
        lose_turn = 1.0 - opponent_win

        v = [0.0] * (max_x + 8)
        suffix = [0.0] * (max_x + 9)

        v[max_x] = 1.0
        suffix[max_x] = 1.0

        row = dp[h]

        for x in range(max_x - 1, 1, -1):
            hold = 1.0 - row[c + x]

            left = x + 2
            right = min(x + 6, max_x)

            if left <= right:
                known = right - left + 1
                future = suffix[left] - suffix[right + 1]
            else:
                known = 0
                future = 0.0

            continue_value = (
                future + (6 - known) * lose_turn
            ) / 6.0

            v[x] = max(hold, continue_value)
            suffix[x] = suffix[x + 1] + v[x]

        return v

    answer = []

    for c, h, x in queries:
        opponent_win = dp[h][c]
        v = turn_states(c, h, opponent_win)

        if c + x == TARGET:
            hold = 1.0
        else:
            hold = 1.0 - dp[h][c + x]

        lose_turn = 1.0 - opponent_win

        left = x + 2
        right = min(x + 6, TARGET - c)

        if left <= right:
            known = right - left + 1
            future = sum(v[d] for d in range(left, right + 1))
        else:
            known = 0
            future = 0.0

        continue_value = (
            future + (6 - known) * lose_turn
        ) / 6.0

        answer.append("H" if hold > continue_value else "C")

    return "\n".join(answer)

if __name__ == "__main__":
    data = sys.stdin.buffer.read()
    print(solve(data))
```桌子`dp`仅存储回合开始概率。 临时总计是根据需要计算的，因为保留了每个`(c, h, x)`值会增加内存，但不会帮助分数对计算。 

边界列75代表已经完成的游戏，因此对于否则轮将开始的玩家来说其值为零。 第 74 栏更为微妙。 如果对手有 74 分，则该对手不可能得分恰好为 75，因此得分低于 74 的玩家最终以 1 的概率获胜。这两个边界值可防止特殊情况泄漏到主循环中。 

里面`turn_value`,`max_x = 75 - c`是仍然合法的最大临时总数。 正好处于状态`max_x`值为 1，因为持有达到 75。更大的总数永远不会显示为状态，因为这些结果是失败并立即通过转牌。 

这`suffix`数组是一个小的优化。 延续自`x`需要五个值`x+2`通过`x+6`。 由于递归是向后处理的，因此所有这些都是已知的。 后缀和将这部分从每个状态五次添加减少到恒定时间。 

二分查找使用 50 次迭代，比二分查找准确得多`10^-5`声明所要求的区别。 Python整数在这里不会溢出，所有涉及概率的算术都使用双精度浮点。 

最终的查询评估故意直接比较两个操作值，而不是与任意阈值进行比较。 这很重要，因为正确的决定取决于当前的回合总数和对手的最佳反应。 

## 工作示例

 提供的样品是```
15 0 3
35 50 40
15 0 30
```输出是```
C
H
H
```对于第一个查询，相关状态是`(C,H,X) = (15,0,3)`。 预计算已经确定了每个回合开始状态，其得分总和大于`15`。 然后，该算法重建凯特琳的分数对的临时回合值`(15,0)`。 

| 状态| 意义| 决策比较| 结果 |
 | --- | --- | --- | --- |
 |`(15, 0, 3)`| 凯特琳 (Catelyn) 拥有 15 点永久点数，回合中拥有 3 点 |`continue_value > hold`|`C`|
 |`(35, 50, 40)`| 持有将使凯特琳的得分为 75 |`hold = 1`|`H`|
 |`(15, 0, 30)`| 大转总量使得风险持续占主导地位`hold > continue_value`|`H`|

 第二个查询练习精确目标边界。 凯特琳有 35 点永久点数，当前回合有 40 点，因此持有的点数正好是 75 点。任何概率计算都无法改善立即获胜的情况，使得`H`被迫的。 

对于第二个跟踪，请考虑自定义输入```
2
73 0 2
72 0 3
```两个查询都是精确命中。 

| 查询 | C | 哈 | X | C + X | 保值| 输出|
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 73 | 73 0 | 2 | 75 | 75 1 |`H`|
 | 2 | 72 | 72 0 | 3 | 75 | 75 1 |`H`|

 第一个查询还执行可以立即获胜的最小可能临时总数。 第二个确认该实现使用`C + X == 75`，而不是相差一的条件，例如`C + X >= 75`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(75^3 log(1/ε))`| 有`O(75^2)`分数对，每个都使用二分搜索`O(log(1/ε))`迭代，每次迭代计算`O(75)`临时状态|
 | 空间|`O(75^2)`| 永久得分 DP 表仅包含回合开始值 |

 通过 50 次二分搜索迭代，数值精度远小于要求`10^-5`。 最大维度仅为 75，因此分数对的大致二次数和线性临时状态计算完全符合官方的 5 秒和 1024 MB 限制。 

## 测试用例```python
import io
import sys

def solve(inp: str) -> str:
    data = inp.encode()
    it = iter(data.split())

    q = int(next(it))
    queries = []

    for _ in range(q):
        c = int(next(it))
        h = int(next(it))
        x = int(next(it))
        queries.append((c, h, x))

    TARGET = 75

    dp = [[0.0] * 76 for _ in range(74)]

    for c in range(74):
        dp[c][74] = 1.0
        dp[c][75] = 0.0

    def turn_value(c, h, opponent_win):
        max_x = TARGET - c
        lose_turn = 1.0 - opponent_win

        v = [0.0] * (max_x + 8)
        suffix = [0.0] * (max_x + 9)

        v[max_x] = 1.0
        suffix[max_x] = 1.0

        row = dp[h]

        for x in range(max_x - 1, 1, -1):
            hold = 1.0 - row[c + x]

            left = x + 2
            right = min(x + 6, max_x)

            if left <= right:
                known = right - left + 1
                future = suffix[left] - suffix[right + 1]
            else:
                known = 0
                future = 0.0

            cont = (future + (6 - known) * lose_turn) / 6.0
            v[x] = max(hold, cont)
            suffix[x] = suffix[x + 1] + v[x]

        left = 2
        right = min(6, max_x)

        if left <= right:
            known = right - left + 1
            future = suffix[left] - suffix[right + 1]
        else:
            known = 0
            future = 0.0

        return (future + (6 - known) * lose_turn) / 6.0

    for total in range(146, -1, -1):
        lo_c = max(0, total - 73)
        hi_c = min(73, total)

        for c in range(lo_c, hi_c + 1):
            h = total - c

            if c > h:
                continue

            if c == h:
                dp[c][h] = 0.5
                continue

            lo = 0.0
            hi = 1.0

            for _ in range(50):
                mid = (lo + hi) * 0.5
                got = turn_value(c, h, 1.0 - mid)

                if got > mid:
                    lo = mid
                else:
                    hi = mid

            a = (lo + hi) * 0.5
            dp[c][h] = a
            dp[h][c] = 1.0 - a

    def turn_states(c, h, opponent_win):
        max_x = TARGET - c
        lose_turn = 1.0 - opponent_win

        v = [0.0] * (max_x + 8)
        suffix = [0.0] * (max_x + 9)

        v[max_x] = 1.0
        suffix[max_x] = 1.0

        row = dp[h]

        for x in range(max_x - 1, 1, -1):
            hold = 1.0 - row[c + x]

            left = x + 2
            right = min(x + 6, max_x)

            if left <= right:
                known = right - left + 1
                future = suffix[left] - suffix[right + 1]
            else:
                known = 0
                future = 0.0

            cont = (future + (6 - known) * lose_turn) / 6.0
            v[x] = max(hold, cont)
            suffix[x] = suffix[x + 1] + v[x]

        return v

    ans = []

    for c, h, x in queries:
        opponent_win = dp[h][c]
        v = turn_states(c, h, opponent_win)

        if c + x == TARGET:
            hold = 1.0
        else:
            hold = 1.0 - dp[h][c + x]

        lose_turn = 1.0 - opponent_win

        left = x + 2
        right = min(x + 6, TARGET - c)

        if left <= right:
            known = right - left + 1
            future = sum(v[d] for d in range(left, right + 1))
        else:
            known = 0
            future = 0.0

        cont = (future + (6 - known) * lose_turn) / 6.0

        ans.append("H" if hold > cont else "C")

    return "\n".join(ans)

def run(inp: str) -> str:
    return solve(inp)

# Provided sample
assert run(
    """3
15 0 3
35 50 40
15 0 30
"""
) == "C\nH\nH", "sample 1"

# Minimum-size input and exact-hit boundary
assert run(
    """1
73 0 2
"""
) == "H", "minimum query, exact 75"

# Off-by-one boundary: 72 + 3 is exactly 75
assert run(
    """2
72 0 3
73 0 2
"""
) == "H\nH", "exact-hit boundaries"

# Equal permanent scores, including the maximum allowed input scores
assert run(
    """2
73 73 2
73 73 2
"""
) == "H\nH", "equal scores and maximum scores"

# Maximum Q
big_input = "1000\n" + "73 73 2\n" * 1000
assert run(big_input) == "\n".join(["H"] * 1000), "maximum Q"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 / 15 0 3 / 35 50 40 / 15 0 30`|`C H H`| 提供了示例和两个操作 |
 |`1 / 73 0 2`|`H`| 最少查询立即获胜 |
 |`2 / 72 0 3 / 73 0 2`|`H H`| 精确 75 边界和逐一处理 |
 |`2 / 73 73 2 / 73 73 2`|`H H`| 同等分数和最高分数值 |
 | 1000份`73 73 2`| 1000行`H`| 最大查询数和重复状态处理 |

 ## 边缘情况

 为了立即准确获胜，输入```
1
73 0 2
```有`C + X = 75`。 查询评估器采用精确命中分支并将保持值设置为 1，而无需咨询另一个 DP 状态。 继续不能提高概率 1，所以答案是`H`。 

对于无法达到的分数 74，请考虑从```
1
72 0 2
```持有创造永久得分 74。对应的对手状态是`dp[0][74] = 1`，这意味着对手最终获胜，因为 74 的玩家永远无法恰好达到 75。因此，持有值是`1 - 1 = 0`。 该边界在 DP 表中明确表示，因此 74 永远不会被意外地视为 75 的有效前任。 

对于半身像，假设当前状态有`C = 70`和`X = 4`。 掷出 6 分后，临时总分为 10 分，永久得分为 80 分。重复无法访问`v[10]`，因为该状态超出了法律范围。 相反，它贡献了失去当前回合的价值，`1 - opponent_win`。 同样的处理方法适用于每卷超过 75 的卷。 

对于相等的分数，状态是对称的。 如果两个玩家具有相同的永久分数并且这是回合的开始，则交换他们的身份不会改变任何事情。 因此每个玩家的获胜概率为 0.5。 该实现使用这种精确的对称性，而不是对已知的状态运行二分搜索。 

对于循环依赖，求解时`(c,h)`，二分查找从不尝试递归求解`(h,c)`。 它使用零和恒等式`dp[h][c] = 1 - dp[c][h]`，并且通过持有创建的所有其他依赖项都具有严格更大的分数总和。 这就是将游戏从循环随机过程转换为一系列一维定点计算的原因。
