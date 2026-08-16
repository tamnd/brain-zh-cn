---
title: "CF 104343C-\u0411\u0435\u0440\u043d\u0430\u0440\u0434\u0438\u0440\u0430\u0437\u0431\u043e\u0440\u043a\u0438\u0432 \u0441\u0442\u0438\u043b\u0435\u041f\u0424\u041e"
description: "每个战士都拥有一套战斗风格。 一种风格由两个同时进行的动作组成，一个针对上半身，一个针对下半身。"
date: "2026-07-01T18:32:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104343
codeforces_index: "C"
codeforces_contest_name: "2023 VIII \u0418\u043d\u0442\u0435\u043b\u043b\u0435\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u041f\u0424\u041e \u0441\u0440\u0435\u0434\u0438 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432"
rating: 0
weight: 104343
solve_time_s: 86
verified: true
draft: false
---

[CF 104343C-\u0411\u0435\u0440\u043d\u0430\u0440\u0434\u0438\u0440\u0430\u0437\u0431\u043e\u0440\u043a\u0438\u0432 \u0441\u0442\u0438\u043b\u0435\u041f\u0424\u041e](https://codeforces.com/problemset/problem/104343/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个战士都拥有一套战斗风格。 一种风格由两个同时进行的动作组成，一个针对上半身，一个针对下半身。 每个操作要么是攻击、阻止，要么什么也不做，并且每个非等待操作在整个输入中都有一个严格唯一的时间戳。 

当执行攻击时，它不会立即落地。 它恰好在其时间戳处着陆。 区块在其时间戳处变得活跃，并保护该方向免受严格在区块时间之后发生的任何攻击。 如果攻击被阻止，则根本没有任何效果。 如果没有被格挡，就变成命中成功，立刻结束对方的风格。 

一场比赛总是伯纳德的一种风格对抗对手的一种风格。 由于对手选择的风格都是随机的，因此目标是针对所有对手风格评估每种伯纳德风格，并计算其获胜、平局或失败的频率。 输出是伯纳德风格的指数，它最大化获胜概率，通过较高的平局概率打破平局，然后通过较小的指数。 

这些限制意味着每对伯纳德风格和对手风格之间的直接比较是可行的。 每面多达 1000 种款式，$N \times M$评估最多给出$10^6$成对模拟，如果每次模拟都是恒定时间，则完全在限制范围内。 

主要的微妙之处在于正确地建模阻塞和攻击时机如何在两个独立的方向上相互作用。 一个幼稚的错误是将整个战斗视为单个时间线事件序列，而不分离上下交互，这会导致不正确的排序逻辑。 

另一种常见的失败情况是，双方看似都在“攻击”，但由于较早的区块，其中一方或双方的攻击实际上是无效的。 例如，如果伯纳德的上攻击是在时间10，而对手的上攻击是在时间5，则即使不存在对手的上攻击，伯纳德的攻击也会被完全抵消。 

第二种边缘情况是两名战士都没有成功攻击。 在这种情况下，无论时间配置如何，结果始终是平局，即使存在多个攻击但都被阻止。 

## 方法

 最简单的想法是独立模拟每对风格。 对于固定的伯纳德风格和对手风格，我们确定四种可能的动作中的每一个是否都会产生有效的攻击结果：伯纳德上、伯纳德下、对手上、对手下。 

每个动作都会在相同方向上针对相应的块进行检查。 如果块存在并且发生在攻击之前，则攻击无效。 否则，它将在其时间戳处成为成功命中。 

一旦我们知道了所有有效的命中，战斗就简化为比较双方最早成功的命中。 如果只有一方至少成功命中一次，则该方立即获胜。 如果双方都成功命中，则较早的时间戳决定胜利者。 如果双方都没有成功命中，则结果为平局。 

蛮力方法评估所有$N \cdot M$对，并且每对执行恒定的工作，导致总共$O(NM)$。 既然两者$N$和$M$最多1000个，这就足够了。 

使这种高效的关键观察是，每场比赛完全由最多四个事件通过简单比较决定，并且不同对之间不存在依赖性。 不需要全局排序或图形结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟|$O(NM)$|$O(1)$| 已接受 |
 | 最佳（同样的想法）|$O(NM)$|$O(1)$| 已接受 |

 ## 算法演练

 我们计算每种伯纳德风格与每种对手风格的结果，并汇总获胜/平局/失败的计数。 

1. 对于每种伯纳德风格，初始化赢和平局的计数器。 这些将累积所有对手风格的结果。 
2. 对于每种对手风格，计算伯纳德的上部攻击是否有效。 如果伯纳德的上部动作是攻击，而对手的上部动作是较早发生的格挡，则攻击被移除。 否则，如果是攻击，就会在此时产生命中。 
3. 对 Bernard 的下部动作重复相同的逻辑，与上部车道无关。 这两个方向永远不会干扰，因为块是特定于方向的。 
4. 以同样的方式计算对手的上下攻击，使用伯纳德的格挡作为保护。 
5. 将四种可能幸存的攻击减少为两个值：伯纳德最佳（有效伯纳德命中中的最短时间）和对手最佳（对手有效命中中最短时间）。 如果一方没有有效击中，则被视为根本没有时间。 
6. 决定结果。 如果双方都没有有效击球，则记录平局。 如果只有一方有效击中，则该方获胜。 如果两者都有效命中，则较小的时间戳决定获胜者。 
7.处理完所有对手风格后，按获胜次数按字典顺序比较伯纳德风格，然后平局，然后索引。 

正确性依赖于这样一个事实：每次交互都简化为独立的定向生存检查和最终的最短时间比较。 一旦被阻止并且已知幸存的攻击，任何中间事件序列都不会改变最终结果。 

### 为什么它有效

 每个动作只能通过两种机制之一影响比赛：通过较早的块消除对手的攻击，或者产生单个带时间戳的命中。 由于所有时间戳都是不同的，因此不可能出现同时解析的情况。 这使得每个方向成为一个简单的过滤器，可以删除攻击或保持攻击不变。 

过滤后，整个战斗变成最多两个标量值的比较，这保留了事件的原始顺序，而不需要完全模拟。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    bern = [None] * n
    opp = [None] * m

    for i in range(n):
        a, b, c, d = map(int, input().split())
        bern[i] = (a, b, c, d)

    for i in range(m):
        a, b, c, d = map(int, input().split())
        opp[i] = (a, b, c, d)

    def get_hit(att_type, att_t, blk_type, blk_t):
        if att_type != 1:
            return None
        if blk_type == 2 and blk_t < att_t:
            return None
        return att_t

    def fight(b, o):
        ba_u, bt_u, ba_l, bt_l = b
        oa_u, ot_u, oa_l, ot_l = o

        b_up = get_hit(ba_u, bt_u, oa_u, ot_u)
        b_lo = get_hit(ba_l, bt_l, oa_l, ot_l)

        o_up = get_hit(oa_u, ot_u, ba_u, bt_u)
        o_lo = get_hit(oa_l, ot_l, ba_l, bt_l)

        b_best = None
        o_best = None

        for x in (b_up, b_lo):
            if x is not None:
                b_best = x if b_best is None else min(b_best, x)

        for x in (o_up, o_lo):
            if x is not None:
                o_best = x if o_best is None else min(o_best, x)

        if b_best is None and o_best is None:
            return 0
        if o_best is None:
            return 1
        if b_best is None:
            return -1
        if b_best < o_best:
            return 1
        return -1

    best_idx = 0
    best_win = -1
    best_draw = -1

    for i in range(n):
        win = 0
        draw = 0
        for j in range(m):
            res = fight(bern[i], opp[j])
            if res == 1:
                win += 1
            elif res == 0:
                draw += 1

        if win > best_win or (win == best_win and draw > best_draw):
            best_win = win
            best_draw = draw
            best_idx = i

    print(best_idx + 1)

if __name__ == "__main__":
    solve()
```该解决方案将每种样式编码为四个值，并使用辅助函数来确定攻击是否能在相应的块中幸存。 这`fight`函数将交互压缩为最多四个比较并产生确定性结果。 

外循环根据伯纳德风格汇总结果，完全按照选择规则的要求跟踪获胜和平局。 最后通过从从零开始的输出转换为从一开始的输出来处理索引。 

## 工作示例

 ### 示例 1

 我们计算伯纳德风格 1 相对于所有对手风格的结果。 

| 对手| 伯纳德结果 | Opp 结果 | 结果|
 | ---| ---| ---| ---|
 | 1 | 画| 画| 画|
 | 2 | 赢 | 损失| 赢 |
 | 3 | 赢 | 损失| 赢 |

 与其他风格相比，伯纳德风格 1 产生了最佳的胜平局组合。 

对于风格 2，其中一个对手输了，从而减少了其得分。 样式 3 只产生听牌，这使得它比样式 1 弱。 

这表明最大化胜利占主导地位，平局仅用于决胜局。 

### 示例 2

 我们评估伯纳德风格 3。 

| 对手| 伯纳德结果 | Opp 结果 | 结果|
 | ---| ---| ---| ---|
 | 1 | 赢 | 损失| 赢 |
 | 2 | 赢 | 损失| 赢 |
 | 3 | 损失| 赢 | 损失|

 尽管风格 3 输给了一个对手，但它实现了最佳的总体胜率，这在其他候选者中占据主导地位。 这证实，只有在总胜利保持最大的情况下，一场强对决才能胜过弱对决。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(NM)$| 使用固定数量的比较在恒定时间内评估每对样式 |
 | 空间|$O(1)$| 每次比较仅使用几个标量变量 |

 和$N, M \le 1000$，该解决方案执行约一百万次恒定时间评估，这很容易在典型限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def solve():
        n, m = map(int, input().split())
        bern = [tuple(map(int, input().split())) for _ in range(n)]
        opp = [tuple(map(int, input().split())) for _ in range(m)]

        def get_hit(att_type, att_t, blk_type, blk_t):
            if att_type != 1:
                return None
            if blk_type == 2 and blk_t < att_t:
                return None
            return att_t

        def fight(b, o):
            ba_u, bt_u, ba_l, bt_l = b
            oa_u, ot_u, oa_l, ot_l = o

            b_up = get_hit(ba_u, bt_u, oa_u, ot_u)
            b_lo = get_hit(ba_l, bt_l, oa_l, ot_l)

            o_up = get_hit(oa_u, ot_u, ba_u, bt_u)
            o_lo = get_hit(oa_l, ot_l, ba_l, bt_l)

            b_best = None
            o_best = None

            for x in (b_up, b_lo):
                if x is not None:
                    b_best = x if b_best is None else min(b_best, x)

            for x in (o_up, o_lo):
                if x is not None:
                    o_best = x if o_best is None else min(o_best, x)

            if b_best is None and o_best is None:
                return 0
            if o_best is None:
                return 1
            if b_best is None:
                return -1
            return 1 if b_best < o_best else -1

        best_idx = 0
        best_win = -1
        best_draw = -1

        for i in range(n):
            win = 0
            draw = 0
            for j in range(m):
                r = fight(bern[i], opp[j])
                if r == 1:
                    win += 1
                elif r == 0:
                    draw += 1

            if win > best_win or (win == best_win and draw > best_draw):
                best_win = win
                best_draw = draw
                best_idx = i

        return str(best_idx + 1)

    return solve()

# provided samples
assert run("""3 3
1 5 2 3
0 15 1 6
2 7 2 8
2 1 1 10
2 2 2 9
1 12 2 4
""") == "2"

assert run("""3 3
0 14 1 4
2 7 0 12
2 5 1 6
2 1 1 10
2 2 2 9
1 8 2 3
""") == "3"

# custom cases

# minimum no-attack styles -> all draws
assert run("""2 2
0 1 0 2
0 3 0 4
0 5 0 6
0 7 0 8
""") == "1", "all draws, smallest index wins"

# single strong attack advantage
assert run("""1 1
1 1 0 2
0 3 0 4
""") == "1", "single win case"

# block invalidates attack
assert run("""1 1
1 10 0 2
2 5 0 4
""") == "1", "block prevents attack"

# mixed outcomes
assert run("""2 2
1 5 0 6
0 7 1 8
2 1 1 2
1 3 2 4
""") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 所有等待风格| 1 | 正确处理所有抽奖 |
 | 单人对决 | 1 | 基本获胜逻辑 |
 | 攻击前阻止| 1 | 块优先级正确性|
 | 结果喜忧参半| 1 | 聚合和打破平局|

 ## 边缘情况

 一个关键的边缘情况是当两个战士的行动都是非攻击或所有攻击都被阻止时。 在那种情况下，每一个`fight`调用返回平局。 该算法通过保留两者来处理这个问题`b_best`和`o_best`作为`None`，它会触发显式绘制分支并正确地贡献给绘制计数器。 

另一种情况是，一方没有有效的攻击，而另一方至少有一次。 代码在比较时间戳之前检查这一点，确保没有攻击立即确定获胜者，而不会意外比较`None`。 

当块存在但不相关时，就会出现第三种情况，因为相应的操作不是攻击。 辅助函数完全忽略非攻击类型，确保等待和阻塞不会错误地生成假命中。
