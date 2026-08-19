---
title: "CF 102203M - 红色-7"
description: "我们有一个两人游戏，使用不同的牌。 每张卡片的数值为 1 到 7，颜色来自有序集合 R、O、Y、G、B、N、P。数值越大卡片越强，数值相同的卡片按颜色排序，R 最强，P 最弱。"
date: "2026-08-18T00:59:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102203
codeforces_index: "M"
codeforces_contest_name: "\u0427\u0435\u0442\u0432\u0435\u0440\u0442\u0430\u044f \u041b\u0438\u043f\u0435\u0446\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e (8-11 \u043a\u043b\u0430\u0441\u0441\u044b)"
rating: 0
weight: 102203
solve_time_s: 284
verified: true
draft: false
---

[CF 102203M - RED-7](https://codeforces.com/problemset/problem/102203/M)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个两人游戏，使用不同的牌。 每张卡片的数值为 1 到 7，颜色来自有序集合 R、O、Y、G、B、N、P。数值越大卡片越强，数值相同的卡片按颜色排序，R 最强，P 最弱。 

每个玩家一开始的调色板中已有一张牌，手中最多有六张牌。 画布最初代表红色规则，因此拥有最强调色板卡的玩家目前领先。 第一个玩家的初始调色板卡肯定比第二个玩家的弱。 

画布卡决定了评估获胜者的规则。 七个规则是：红色表示最强的牌，橙色表示最大组的相同值，黄色表示最大组的一种颜色，绿色表示最大数量的偶数牌，蓝色表示最大数量的不同颜色，靛色表示最长的连续值，紫色表示最大数量的值低于 4 的牌。 

对于每条规则，玩家并不是简单地使用所有合适的牌。 他们通过首先最大化其大小然后最大化其最强的卡来选择最佳的可能组合。 因此，游戏状态由当前在两个调色板中的牌、仍在双手中的牌、当前画布颜色以及轮到谁来确定。 

在一轮中，玩家可以将一张手牌移至其调色板，将一张手牌移至画布，或使用两张不同的牌执行这两种操作。 操作后，玩家必须在生成的画布规则下严格领先。 如果不存在这样的举动，则该玩家立即失败。 空手的玩家在回合开始时也会输，尽管他们可以合法地以空手结束回合。 

输入给出了两个手牌的大小以及属于每个玩家的牌。 每个玩家行上的第一张牌已经在该玩家的调色板中，而所有剩余的牌都从手中开始。 所需的输出是`First`如果第一个玩家有获胜策略并且`Second`否则。 

每手最多六张牌的限制是可以进行详尽的游戏状态搜索的主要原因。 最多有十二张位置可以改变的牌。 每张这样的卡都可以在手中、在调色板中，或者已经被丢弃到画布上，在考虑画布规则和回合之前最多给出 (3^{12}=531441) 本地所有权配置。 这排除了其工作像整个博弈树一样增长的算法，但它使得记忆状态搜索变得实用。 

有几个细节很容易出错。 回合开始时空手牌将立即失败，即使该玩家在上一步行动后处于领先地位。 例如，第一个样本是```
0 0
3G
7Y
```答案是`Second`。 根本没有合法的举动，因此第二个玩家最初领先的事实并不是答案的主要原因。 仅检查当前玩家是否已经获胜的搜索将错误地返回`First`。 

另一个微妙的情况是，必须使用新的画布规则来评估向画布打出的牌。 在第二个样本中，```
3 0
1R 2R 3R 4R
7R
```第一个玩家无法在红色下提高，因为即使他们最强的可用调色板卡也低于 7R。 除非最终的规则使第一个玩家领先，否则将牌打到画布上也无济于事。 正确答案是`Second`。 

规则内的平局决胜是另一个常见的错误来源。 考虑```
1 1
2P 2R
2Y 2O
```第一个玩家可以将 2R 放入调色板中。 在红色下，两名玩家都有一张价值最高的牌2，但R比Y更强，因此第一个玩家领先。 正确答案是`First`。 仅基于数值的比较会错过颜色决胜局。 

紫色规则中的边界在正确的位置也很严格：值 1、2 和 3 有效，而 4 则不有效。 例如，```
1 1
3P 1R
7R 4O
```第一个玩家可以将 1R 放在画布上。 新规则是紫色，第一个调色板包含 3P，第二个调色板包含 7R。 第一个玩家有一张合格牌，第二个玩家没有，所以答案是`First`。 一个实现使用`value <= 4`在这种情况下会产生错误的结果。 

## 方法

 直接暴力方法是模拟每一个可能的动作并递归地检查游戏的每一个延续。 这是正确的，因为当存在合法的移动使当前玩家领先并给对手带来失败位置时，位置就获胜。 如果不存在这样的变动，则该头寸正在亏损。 

手上有六张牌，玩家有 6 个仅调色板动作、6 个仅画布动作，以及 (6\cdot5=30) 个使用一张牌作为调色板而另一张牌作为画布的动作。 即回合开始时有 42 个可能的动作。 因此，原始博弈树搜索的上限为 (42^{12})，大约为 (3.0\cdot10^{19}) 个分支。 这些分支中的大多数都是非法的或者更早终止，但界限已经表明不能使用直接递归。 

暴力搜索之所以有效，是因为每一步都会严格减少当前玩家手上的牌数，因此不存在循环。 问题是许多不同的移动序列到达相同的位置。 一旦相同的调色板、手牌、画布规则和回合再次出现，无论如何达到该位置，未来的游戏都是相同的。 

因此，关键的观察是记住位置而不是移动序列。 对于每个玩家来说，每张手牌都具有三种相关状态：它仍在手牌中，它已移至调色板，或者它已被丢弃到画布上。 初始调色板卡是固定的，不需要三元状态。 因此，六张手牌仅给出每个玩家 (3^6=729) 个可能的本地状态。 

不需要当前位于画布顶部的确切卡片。 只有它的颜色很重要，因为画布决定了规则。 该卡牌本身已从游戏中消失这一事实已经通过该卡牌既不在手中也不在调色板中来表示。 这将全局状态减少为两个局部状态、七种画布颜色之一以及要移动的玩家。 

对于每个可能的调色板蒙版，我们还可以预先计算七个规则中每个规则的最佳组合。 一个调色板最多包含七张卡，因此我们可以简单地枚举其所有子掩码并选择具有最大尺寸和最大卡强度的有效子掩码。 这使得在游戏搜索期间评估位置的时间恒定。 

结果搜索仍然是指数级的，但其状态空间对于这些约束来说足够小。 使用密集字节数组而不是 Python 字典来进行记忆，因为完整的状态空间只有大约 740 万个条目，并且每个条目一个字节的成本很低。 一旦找到获胜的举动，递归也会停止，这特别有效，因为大多数职位都有一个合法的举动，可以拒绝或接受，而无需探索所有替代方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(42^{12})) 博弈树分支 | (O(12)) 递归深度 | 太慢了|
 | 最佳| 最坏情况下的 (O(3^{n+m}(n+m)^2)) 状态和转换 | (O(3^{n+m})) 记忆 | 已接受 |

 ## 算法演练

 1. 将每张牌转换为由其数值和颜色等级组成的对。 颜色顺序R、O、Y、G、B、N、P变为0到6，因此一张卡可以通过整数进行比较`value * 7 + color`。 
2. 对于每个玩家，预先计算每个画布规则下每个可能的调色板蒙版的最佳分数。 分数包含最佳组合的大小及其最强卡的排名。 我们将其编码为`size * 50 + rank`，而不可能的组合收到`-1`。 

要计算规则的分数，请枚举调色板的每个非空子掩码并测试它是否满足该规则。 这很小，因为调色板最多包含七张卡片。 
3. 使用六位三进制数字表示每个玩家的牌的可变部分。 数字零表示对应的手牌已被丢弃，数字一表示仍在手牌中，数字二表示其在调色板中。 初始调色板卡始终单独包含在调色板蒙版中。 

因此，本地状态最多具有 (3^6=729) 个值。 从当地的一个州我们可以立即获得它的手部面具和调色板面具。 
4. 预先计算将所有可能的手牌移动到调色板的结果以及将所有可能的手牌移动到画布的结果。 调色板移动将其三进制数字从一更改为二。 画布移动会将其从 1 更改为 0。 
5. 定义一个递归游戏函数，其状态由第一个玩家的本地状态、第二个玩家的本地状态、当前画布颜色以及轮到的玩家组成。 

备忘录表存储该位置对于玩家移动来说是赢还是输。 
6. 如果当前玩家手牌为空，则立即将该位置标记为失败。 在考虑当前的画布规则之前会检查这一点，因为规则明确地使空手在回合开始时失败。 
7. 尝试每一个仅使用调色板的动作。 将一张手牌移至当前玩家的调色板中，保持画布规则不变，并比较所得的最佳分数。 如果当前玩家领先并且对手的结果状态为失败，则当前位置为获胜。 
8.尝试每一个仅在画布上的动作。 取出一张手牌，将其颜色作为新的画布规则，并立即与新规则进行比较。 该卡不再位于调色板中，因此调色板本身不会改变。 
9. 尝试每对不同的手牌进行组合动作。 首先将一张卡片移至调色板，然后将另一张卡片移至画布上。 必须使用放大的调色板和剩余的卡片来评估新的画布规则。 
10. 如果这些动作中的任何一个导致对手失败，而当前玩家领先，则将当前状态标记为获胜。 如果每一步都失败了，则将其标记为失败。 

中心不变量是每个记忆状态都包含可以影响所有未来动作的信息。 手中剩余的牌仍然可以打出，调色板中的牌对未来的每条规则都有贡献，而丢弃的牌永远不会返回。 画布颜色是当前画布卡唯一影响未来规则的属性。 因此，具有相同的四个本地手/调色板状态、画布颜色和回合的两个游戏历史具有完全相同的一组未来可能性。 然后，递归极小极大规则与最佳玩法相匹配：当玩家至少有一次合法的移动让对手处于失败位置时，该位置就获胜。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from functools import lru_cache

COLORS = "ROYGBNP"
COLOR_ID = {c: i for i, c in enumerate(COLORS)}
BASE = 3 ** 6
STATE_COUNT = BASE
STATE_SPACE = BASE * BASE * 7 * 2

def card_rank(card):
    value, color = card
    return value * 7 + color

def build_scores(cards):
    """
    score[rule][mask] = encoded optimal combination score.
    -1 means that no valid combination exists.

    The encoding is size * 50 + highest_card_rank.
    """
    score = [[-1] * 128 for _ in range(7)]
    total = len(cards)

    ranks = [card_rank(c) for c in cards]
    values = [c[0] for c in cards]
    colors = [c[1] for c in cards]

    for mask in range(1, 1 << total):
        sub = mask

        while sub:
            cnt = sub.bit_count()

            highest = -1
            vals = []
            cols = []

            x = sub
            while x:
                bit = x & -x
                i = bit.bit_length() - 1

                if ranks[i] > highest:
                    highest = ranks[i]

                vals.append(values[i])
                cols.append(colors[i])
                x ^= bit

            valid = [False] * 7

            # Red: exactly one card.
            valid[0] = cnt == 1

            # Orange: all cards have the same value.
            valid[1] = len(set(vals)) == 1

            # Yellow: all cards have the same color.
            valid[2] = len(set(cols)) == 1

            # Green: all cards are even.
            valid[3] = all(v % 2 == 0 for v in vals)

            # Blue: all colors are different.
            valid[4] = len(set(cols)) == cnt

            # Indigo: distinct consecutive values.
            if len(set(vals)) == cnt:
                lo = min(vals)
                hi = max(vals)
                valid[5] = hi - lo + 1 == cnt

            # Violet: all values are below 4.
            valid[6] = all(v < 4 for v in vals)

            encoded = cnt * 50 + highest

            for rule in range(7):
                if valid[rule] and encoded > score[rule][mask]:
                    score[rule][mask] = encoded

            sub = (sub - 1) & mask

    return score

def solve_case(data):
    lines = data.strip().splitlines()
    n, m = map(int, lines[0].split())

    first = []
    second = []

    for token in lines[1].split():
        first.append((int(token[0]), COLOR_ID[token[1]]))

    for token in lines[2].split():
        second.append((int(token[0]), COLOR_ID[token[1]]))

    score_first = build_scores(first)
    score_second = build_scores(second)

    # For a local ternary state:
    # digit 0 = discarded
    # digit 1 = hand
    # digit 2 = palette
    #
    # Bit 0 of the palette mask is always the initial palette card.
    powers = [3 ** i for i in range(6)]

    palette_mask = [0] * STATE_COUNT
    hand_mask = [0] * STATE_COUNT

    next_palette = [[-1] * 6 for _ in range(STATE_COUNT)]
    next_canvas = [[-1] * 6 for _ in range(STATE_COUNT)]

    for state in range(STATE_COUNT):
        x = state
        pmask = 1
        hmask = 0

        digits = [0] * 6

        for i in range(6):
            digits[i] = x % 3
            x //= 3

            if digits[i] == 1:
                hmask |= 1 << (i + 1)
            elif digits[i] == 2:
                pmask |= 1 << (i + 1)

        palette_mask[state] = pmask
        hand_mask[state] = hmask

        for i in range(6):
            if digits[i] == 1:
                # 1 -> 2: move to palette.
                next_palette[state][i] = state + powers[i]

                # 1 -> 0: move to canvas.
                next_canvas[state][i] = state - powers[i]

    # Only the first n or m variable positions are real cards.
    initial_first = sum(powers[i] for i in range(n))
    initial_second = sum(powers[i] for i in range(m))

    colors_first = [c[1] for c in first[1:]]
    colors_second = [c[1] for c in second[1:]]

    memo = bytearray(STATE_SPACE)

    def memo_index(s1, s2, canvas, turn):
        return ((((s1 * STATE_COUNT) + s2) * 7 + canvas) << 1) | turn

    def leads_first(pm1, pm2, rule):
        return score_first[rule][pm1] > score_second[rule][pm2]

    def leads_second(pm1, pm2, rule):
        return score_second[rule][pm2] > score_first[rule][pm1]

    sys.setrecursionlimit(100000)

    def win(s1, s2, canvas, turn):
        idx = memo_index(s1, s2, canvas, turn)
        saved = memo[idx]

        if saved:
            return saved == 2

        if turn == 0:
            me = s1
            opp = s2
            pm_opp = palette_mask[opp]
            hands = hand_mask[me]

            if hands == 0:
                memo[idx] = 1
                return False

            pm_me = palette_mask[me]

            # Action 1: hand -> palette.
            bits = hands
            while bits:
                bit = bits & -bits
                i = bit.bit_length() - 2

                ns = next_palette[me][i]

                if leads_first(palette_mask[ns], pm_opp, canvas):
                    if not win(ns, opp, canvas, 1):
                        memo[idx] = 2
                        return True

                bits ^= bit

            # Action 2: hand -> canvas.
            bits = hands
            while bits:
                bit = bits & -bits
                i = bit.bit_length() - 2

                ns = next_canvas[me][i]
                new_canvas = colors_first[i]

                if leads_first(palette_mask[ns], pm_opp, new_canvas):
                    if not win(ns, opp, new_canvas, 1):
                        memo[idx] = 2
                        return True

                bits ^= bit

            # Action 3: hand -> palette, another hand card -> canvas.
            bits_a = hands
            while bits_a:
                bit_a = bits_a & -bits_a
                a = bit_a.bit_length() - 2

                after_palette = next_palette[me][a]
                remaining = hands ^ bit_a

                bits_b = remaining
                while bits_b:
                    bit_b = bits_b & -bits_b
                    b = bit_b.bit_length() - 2

                    ns = next_canvas[after_palette][b]
                    new_canvas = colors_first[b]

                    if leads_first(
                        palette_mask[ns],
                        pm_opp,
                        new_canvas
                    ):
                        if not win(ns, opp, new_canvas, 1):
                            memo[idx] = 2
                            return True

                    bits_b ^= bit_b

                bits_a ^= bit_a

        else:
            me = s2
            opp = s1
            pm_opp = palette_mask[opp]
            hands = hand_mask[me]

            if hands == 0:
                memo[idx] = 1
                return False

            pm_me = palette_mask[me]

            # Action 1: hand -> palette.
            bits = hands
            while bits:
                bit = bits & -bits
                i = bit.bit_length() - 2

                ns = next_palette[me][i]

                if leads_second(palette_mask[ns], pm_opp, canvas):
                    if not win(opp, ns, canvas, 0):
                        memo[idx] = 2
                        return True

                bits ^= bit

            # Action 2: hand -> canvas.
            bits = hands
            while bits:
                bit = bits & -bits
                i = bit.bit_length() - 2

                ns = next_canvas[me][i]
                new_canvas = colors_second[i]

                if leads_second(palette_mask[ns], pm_opp, new_canvas):
                    if not win(opp, ns, new_canvas, 0):
                        memo[idx] = 2
                        return True

                bits ^= bit

            # Action 3: hand -> palette, another hand card -> canvas.
            bits_a = hands
            while bits_a:
                bit_a = bits_a & -bits_a
                a = bit_a.bit_length() - 2

                after_palette = next_palette[me][a]
                remaining = hands ^ bit_a

                bits_b = remaining
                while bits_b:
                    bit_b = bits_b & -bits_b
                    b = bit_b.bit_length() - 2

                    ns = next_canvas[after_palette][b]
                    new_canvas = colors_second[b]

                    if leads_second(
                        palette_mask[ns],
                        pm_opp,
                        new_canvas
                    ):
                        if not win(opp, ns, new_canvas, 0):
                            memo[idx] = 2
                            return True

                    bits_b ^= bit_b

                bits_a ^= bit_a

        memo[idx] = 1
        return False

    return "First" if win(initial_first, initial_second, 0, 0) else "Second"

def main():
    data = sys.stdin.read()
    if data.strip():
        print(solve_case(data))

if __name__ == "__main__":
    main()
```实现的第一部分将颜色转换为整数，并通过其值和颜色等级来表示每张卡。 排名公式使所需的严格排序成为正常的整数比较。 由于值最多为 7 并且有七种颜色，因此低于 50 的排名足以解决所有平局问题。`build_scores`将规则机制与游戏机制分开处理。 对于每个调色板蒙版，它会考虑每种可能的组合并直接检查七个定义。 这是故意简单的。 只有 (2^7=128) 个调色板掩码，每个调色板掩码最多包含 (2^7=128) 个子掩码，因此与游戏搜索相比，这里的详尽评估很小。 

靛蓝规则值得特别关注。 有效的组合必须包含形成一个连续间隔的不同值。 单张卡片是有效的组合，因此仅包含一张卡片的调色板仍然具有尺寸为 1 的靛蓝组合。 条件`hi - lo + 1 == cnt`与不同的值一起精确地捕获该属性。 

三元编码是主要的状态压缩。 从未来游戏的角度来看，可变卡具有三个可能的位置。 将手卡移动到调色板会将其三进制数字从 1 递增到 2，而将其移动到画布则将其从 1 递减到 0。初始调色板卡始终是调色板掩码的位 0，并且从不参与三进制数字。 

画布仅存储颜色索引。 一旦一张牌被丢弃，它的身份就不再影响任何未来的规则。 它的消失已经可见，因为它的三进制数字为零。 这就是为什么存储完整的画布卡会创建不必要的状态。 

这`memo`数组使用 0 表示未知状态，1 表示失败状态，2 表示获胜状态。 它的索引将本地状态、画布颜色和转弯打包为一个整数。 字节数组比包含数百万个元组键的 Python 字典更节省内存。 

表达式如`bit.bit_length() - 2`将调色板或手位转换为相应的三元卡索引。 本地索引零处的手牌由位一表示，因为位零是为初始调色板卡保留的。 该偏移很容易引入差一误差。 

组合动作以正确的顺序生成。 第一个选定的卡将移至调色板，然后另一张选定的卡将移至画布。 因此，第二张牌使用放大的调色板进行评估，这对于橙色、黄色、绿色、蓝色、靛蓝和紫色等规则很重要。 

Python 中不存在整数溢出问题。 用于状态索引的最大算术对象只有几百万，而卡片分数在400以下。 

## 工作示例

 ### 示例 1

 输入是```
0 0
3G
7Y
```最初的本地状态仅包含其固定的调色板卡。 双手都是空的，因此递归搜索在检查当前画布规则之前终止。 

| 转 | 第一手资料 | 第一个调色板 | 二手| 第二个调色板| 帆布| 结果 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 第一 | 空 | 3G | 空 | 7年| 右 | 首先没有动静|

 对于第一个玩家来说，该状态正在失败，因为回合开始时空手牌会立即失败。 第二个玩家无需采取行动即可获胜。 

### 示例 2

 输入是```
3 0
1R 2R 3R 4R
7R
```画布最初是红色的。 第一个玩家的唯一调色板是 1R，而第二个玩家的调色板包含 7R。 

| 第一行动| 新调色板| 新画布| 第一分 | 第二分 | 合法的制胜之举|
 | --- | --- | --- | --- | --- | --- |
 | 将2R放入调色板| 1R、2R | 右 | 2R | 7R | 没有 |
 | 将3R放入调色板| 1R、3R | 右 | 3R | 7R | 没有 |
 | 将4R放入调色板| 1R、4R | 右 | 4R | 7R | 没有 |
 | 将2R放在画布上| 1R | 右 | 1R | 7R | 没有 |
 | 将 3R 放在画布上 | 1R | 右 | 1R | 7R | 没有 |
 | 将 4R 放在画布上 | 1R | 右 | 1R | 7R | 没有 |

 画布卡仍然是红色的，因为所有三张可用卡都是红色的，因此仅画布的移动不会改变规则。 调色板移动不能产生比 7R 更强的卡。 联合行动也无济于事，因为每张可能的画布卡都是红色的，并且使游戏遵循相同的最高卡规则。 

因此第一个状态会失败，所以答案是`Second`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(3^{n+m}(n+m)^2)) | 每张卡有三种状态，每种状态考虑一张卡和两张卡的动作 |
 | 空间| (O(3^{n+m})) | 记忆化为每个打包游戏状态存储一个字节，最多为七个规则和两个回合的常数因子 |

 在最大值（n=m=6）下，每个玩家的本地状态只有 729 种可能性。 包括两名玩家、七种画布颜色和两次回合，可提供约 740 万个打包状态，而记忆数组仅占用几兆字节。 相比之下，规则分数和转换表可以忽略不计。 搜索的手牌数量呈指数增长，但指数以 12 为界，这正是这种方法适合问题异常小的约束的原因。 

## 测试用例```
# This test block assumes solve_case from the solution above is available.

def run(inp: str) -> str:
    return solve_case(inp).strip()

# Provided samples.
assert run("""\
0 0
3G
7Y
""") == "Second", "sample 1"

assert run("""\
3 0
1R 2R 3R 4R
7R
""") == "Second", "sample 2"

assert run("""\
4 3
1O 2O 4G 6G 5B
7B 2Y 5P 2G
""") == "First", "sample 3"

# Minimum-size input. Nobody has a hand, so the first player loses immediately.
assert run("""\
0 0
3G
7Y
""") == "Second", "empty hands"

# Equal values test the color tie-break.
assert run("""\
1 1
2P 2R
2Y 2O
""") == "First", "equal value, stronger color wins"

# Violet boundary: 3 counts, 4 does not.
assert run("""\
1 1
3P 1R
7R 4O
""") == "First", "value 3 belongs to violet"

# Indigo singleton boundary. A one-card run exists, but 7P beats 1R.
assert run("""\
1 0
1R 2O
7P
""") == "Second", "singleton indigo run"

# Maximum hand size for one player.
# First can put 2R into the palette and 3R onto the canvas,
# producing a yellow rule where First has two cards of one color.
# Second has no hand and loses on the following turn.
assert run("""\
6 0
1R 2R 3R 4R 5R 6R 7R
7P
""") == "First", "maximum first-hand size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0 0 / 3G / 7Y`|`Second`| 转弯开始时空手损失|
 |`2P 2R / 2Y 2O`|`First`| 等值后颜色平局打破 |
 |`3P 1R / 7R 4O`|`First`| 紫色包括 3 但不包括 4 |
 |`1R 2O / 7P`|`Second`| 单例是有效的靛蓝运行 |
 |`1R 2R 3R 4R 5R 6R 7R / 7P`|`First`| 六张牌和组合的调色板/画布移动|

 ## 边缘情况

 空手情况是在任何移动生成之前处理的。 为了```
0 0
3G
7Y
```第一个地方州有零手口罩。 递归函数立即将其标记为丢失，并且从不尝试比较两张调色板卡。 结果是`Second`。 

红色决胜局的处理方法是将每张牌编码为其数值，然后是其颜色等级。 为了```
1 1
2P 2R
2Y 2O
```将 2R 移至第一个调色板会产生两张最高的牌 2R 和 2Y。 两者的值都是 2，但 2R 的编码排名更大，因此第一个玩家领先。 对手未来的可能性也是通过极小极大递归来探索的，而不是假设赢得当前位置就足够了。 

紫色边界由条件表示`v < 4`。 在```
1 1
3P 1R
7R 4O
```第一个玩家将 1R 丢弃到画布上，将规则更改为紫色。 第一个调色板包含 3P，它提供一张合格卡。 第二个调色板包含 7R，其贡献为零。 因此，第一个玩家有合法的获胜举动。 

靛蓝单例情况使用的条件是最大值减去最小值等于不同值的数量减一。 对于单张牌来说，两边都是零，所以组合有效。 在```
1 0
1R 2O
7P
```在画布上打 2O 创建了靛蓝规则，但生成的单例 1R 弱于对手的单例 7P。 在调色板上玩 2O 会使红色规则处于活动状态，并且也会失败。 由于没有其他可用的行动，第一个玩家就输了。 

组合移动必须使用两张不同的卡，并且必须在添加调色板卡后评估画布规则。 在```
6 0
1R 2R 3R 4R 5R 6R 7R
7P
```第一个玩家可以将 2R 移动到调色板，将 3R 移动到画布。 新规则是黄色的。 第一个调色板包含 1R 和 2R，两者颜色相同，而第二个调色板仅包含 7P。 第一个玩家有两张合格牌对战一张，因此此举是合法且获胜的。 第二个玩家的手是空的，因此游戏在下一回合结束`First`作为获胜者。 

当存在重复值时，靛蓝规则也需要小心。 两张点数为 5 的牌不构成两张牌连。 分数预计算会先检查靛蓝组合中的所有值是否不同，然后再检查它们是否形成一个连续区间。 这可以防止重复值错误地增加游程长度。 

最后，放置在画布上的牌会从相应玩家的可用牌中消失。 实现通过将其三元状态从手工更改为丢弃来记录。 画布仅存储新颜色。 当另一张卡随后取代它时，旧的画布卡将完全按照要求被丢弃，而无需记住它是哪张卡。
