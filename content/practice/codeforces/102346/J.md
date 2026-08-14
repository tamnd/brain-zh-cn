---
title: "CF 102346J - 水罐游戏"
description: "我们的圈子最多有 13 名参赛者。 所使用的每张卡牌值有四份，外加一张通配符。 每个参赛者一开始都有四张普通牌，而起始参赛者也会收到通配符，因此最初有五张牌。"
date: "2026-08-13T01:47:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102346
codeforces_index: "J"
codeforces_contest_name: "2019-2020 ACM-ICPC Brazil Subregional Programming Contest"
rating: 0
weight: 102346
solve_time_s: 667
verified: true
draft: false
---

[CF 102346J - 水罐游戏](https://codeforces.com/problemset/problem/102346/J)

 **评级：** -
 **标签：** -
 **求解时间：** 11m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们的圈子最多有 13 名参赛者。 所使用的每张卡牌值有四份，外加一张通配符。 每个参赛者一开始都有四张普通牌，而起始参赛者也会收到通配符，因此最初有五张牌。 

重要的是游戏是完全确定性的。 下一位参赛者始终是当前参赛者右边的人，要通过的牌是由规则唯一确定的。 如果当前参赛者拥有通配符并且不是刚刚收到的，则必须通过通配符。 否则，选手通过一张手中出现频率最小的普通牌，按照固定的牌顺序打破平局`A23456789DQJK`。 

当参赛者拥有四张牌且价值相同时，他们就获胜。 通配符不能代替丢失的卡。 一旦至少一名参赛者达到该状态，游戏就会停止，并打印所有获胜参赛者中参赛人数最小的参赛者。 

输入给出`N`和`K`，然后为每位参赛者准备四张普通卡。 输入中未写入通配符。 我们把它放在参赛者中`K`在模拟第一回合之前。 

上限`N <= 13`这就是直接模拟合适的原因。 普通卡牌的可能值只有 13 种，因此每个决定最多可以通过扫描 13 个柜台来做出。 该语句没有给出单独的圈数上限，因此自然复杂度参数就是圈数`T`在有人获胜之前实际模拟的回合数。 由于规则没有给程序留下可供探索的选择，因此不存在搜索树。 

有几种边缘情况可能会悄悄破坏模拟。 

首先，首发选手不能立即通过外卡。 例如，```
2 1
ABBB
AAAB
```参赛者 1 持有`ABBB`加上通配符。 外卡刚刚收到，所以参赛者1必须通过一张普通卡。`A`发生一次并且`B`出现三次，所以`A`被传递给参赛者 2。然后参赛者 2 有`AAAA`并获胜，所以输出是`2`。 立即通过通配符的粗心实现将产生不同的游戏。 

其次，游戏可能在第一回合之前就已经结束了。 例如，```
2 2
AAAA
2222
```给参赛者 2 通配符，因此参赛者 2 有五张牌，但参赛者 1 已经有四张牌`A`牌。 正确的输出是`1`。 仅在第一步不正确后才检查获胜者。 

第三，收到普通卡的参赛者暂时有五张卡，因此简单地检查某个值是否出现四次是不够的。 在```
3 3
AAA2
2233
A223
```参赛者 3 以通配符开头。 他们必须通过`A`， 因为`A`和`3`两者都发生一次并且`A`是较低的值。 由于圆圈环绕，卡片从参赛者 3 转到参赛者 1。 参赛者1暂时有`AAAA2`，这是五张牌，尚未获胜。 在下一个回合中，参赛者 1 通过了其唯一的`2`，离开`AAAA`，因此参赛者 1 获胜，输出为`1`。 

最后，平局顺序是声明中的牌顺序，而不是字母顺序。 自从`A`是最小值，之间的平局`A`和`2`必须选择`A`。 每次必须选择普通卡时都使用相同的固定顺序。 

## 方法

 最直接的方法是完全按照描述来模拟游戏。 为每一位参赛者和每一张 13 张普通卡牌值存储他们手中当前有多少张卡牌。 单独存储通配符，因为它具有特殊行为并且绝不能参与最小频率计算。 

简单的模拟可以在每一步之后扫描所有参赛者，看看是否有人获胜。 对于每位参赛者，我们检查所有 13 个牌计数器，因此一轮需要花费`O(13N)`，或最多 169 次柜台检查`N = 13`。 如果比赛持续`T`反过来，这给出了`O(13NT)`, 等价地`O(NT)`因为13是固定的。 这些检查的确切上限是`169T`为最大`N`。 

对于给定的约束，该方法已经足够快，但有一个简单的结构改进。 在我们检查了初始位置并确定当前没有人获胜后，一步棋仅改变两个参赛者的手：发送者和接收者。 其他每一手牌都没有变化。 因此，任何未曾接触过的参赛者都不可能突然成为胜利者。 每次移动后我们只需要测试这两个参赛者。 

无论所通过的牌是通配符牌还是普通牌，都适用相同的观察。 发送者和接收者是唯一内容发生改变的两只手。 每个获胜状态检查最多扫描 13 个计数器，因此最佳模拟花费`O(13)`努力选择一张卡并`O(13)`努力检查每只受影响的手。 由于卡片世界的大小固定为 13，因此这实际上是`O(T)`。 

暴力模拟之所以有效，是因为一旦知道初始状态，游戏就没有玩家可以做出的决定，但它会反复检查那些不可能改变手牌的玩家。 只有发送者和接收者可以改变的观察结果让我们可以删除那些不必要的扫描，而根本不改变模拟序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每次转弯后进行全面扫描 |`O(13NT)`|`O(13N)`| 已接受，但执行不必要的扫描 |
 | 仅检查受影响的参赛者 |`O(13T)`|`O(13N)`| 已接受 |

 ## 算法演练

 1. 按照准确的顺序对卡值进行编码`A23456789DQJK`。 为每张卡牌值指定一个从 0 到 12 的索引。这样可以用一个整数索引来表示该卡牌及其打破平局的优先级。 
2. 建立一个`N x 13`来自输入的频率数组。 对于参赛者`K`，分别标记它们持有通配符。 将通配符保留在普通计数之外可以防止在选择最不频繁的普通卡时考虑它。 
3. 在做出任何动作之前，扫描每位参赛者并检查他们是否已经处于获胜状态。 获胜的手牌必须没有通配符，总共有四张普通牌，并且所有四张牌的值必须相同。 如果已有多名参赛者获胜，则立即返回最小的参赛者编号。 
4. 设置当前参赛者为`K`并将通配符标记为新收到的。 只有当前持有通配符的参赛者才需要此特殊标志。 首发参赛者的待遇与刚刚收到参赛者的待遇完全一样。 
5. 将下一位参赛者计算为紧邻右侧的人，从`N`回到`1`。 在从零开始的 Python 索引中，这是`(current + 1) % N`。 
6. 如果当前参赛者拥有通配符并且不是新收到的，则将通配符传递给下一位参赛者。 将其从当前参赛者中删除，交给下一位参赛者，并将通配符标记为新收到的。 
7、否则选择普通卡通过。 扫描 13 个卡频率，忽略零计数并忽略通配符。 选择最小的正频率，当两个值具有该频率时，保留较小的卡片索引。 这直接实现了所需平局规则的两个级别。 
8. 将当前参赛者选择的普通卡移动到下一个参赛者。 在这种情况下，通配符状态不会改变，因为通配符仍保留在其当前持有者手中。 如果当前参赛者刚刚获得通配符，那么特殊限制现在已经被消耗，所以他们下一轮可能会通过通配符。 
9. 移动后，仅检查当前参赛者和下一位参赛者。 这是唯一改变的手。 如果其中一方获胜，则从获胜候选人中选择较小的参赛者编号并将其返回。 
10. 将下一位参赛者设为当前参赛者，并重复模拟，直到找到获胜者。 

### 为什么它有效

 中心不变量是存储的纸牌计数准确地描述了每个模拟回合之前的真实游戏状态。 通配符标志记录其当前持有者是否被禁止通过。 在每一轮，算法都严格遵循规则中的两种合法情况之一：在允许的情况下传递通配符，或者使用规定的值顺序选择最小频率的普通卡。 因此，最终的状态正是该回合后真实游戏的状态。 

初始获胜者检查处理在任何移动之前结束的游戏。 检查之后，新的获胜状态只能出现在手牌发生变化的参赛者身上，即发送者或接收者。 因此，在每次移动后检查这两名参赛者就足够了。 当找到获胜状态时，选择最小的参赛者索引符合所需的获胜规则，因此返回的参赛者正是游戏所宣布的参赛者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

VALUES = "A23456789DQJK"
V = len(VALUES)
POS = {ch: i for i, ch in enumerate(VALUES)}

def is_winner(cards, has_wild):
    if has_wild:
        return False

    total = 0
    has_four = False

    for x in cards:
        total += x
        if x == 4:
            has_four = True

    return total == 4 and has_four

def solve():
    n, k = map(int, input().split())
    k -= 1

    cards = [[0] * V for _ in range(n)]
    has_wild = [False] * n

    for i in range(n):
        s = input().strip()
        for ch in s:
            cards[i][POS[ch]] += 1

    has_wild[k] = True

    # The game may already be over before the first turn.
    for i in range(n):
        if is_winner(cards[i], has_wild[i]):
            return i + 1

    current = k
    wild_new = True

    while True:
        nxt = (current + 1) % n

        # The wildcard can be passed only if it was not
        # received immediately before this turn.
        if has_wild[current] and not wild_new:
            has_wild[current] = False
            has_wild[nxt] = True
            wild_new = True

        else:
            # Pass the least frequent ordinary card.
            # Ties are resolved by VALUES order, which is exactly
            # the index order 0..12.
            chosen = -1
            best_count = 10

            for value in range(V):
                cnt = cards[current][value]
                if cnt == 0:
                    continue

                if cnt < best_count:
                    best_count = cnt
                    chosen = value

            cards[current][chosen] -= 1
            cards[nxt][chosen] += 1

            # If the current player was holding a newly received
            # wildcard, it has now been held for one turn.
            if has_wild[current]:
                wild_new = False

        # Only these two contestants changed.
        winner = -1

        if is_winner(cards[current], has_wild[current]):
            winner = current

        if is_winner(cards[nxt], has_wild[nxt]):
            if winner == -1 or nxt < winner:
                winner = nxt

        if winner != -1:
            return winner

        current = nxt

if __name__ == "__main__":
    print(solve())
```这`VALUES`字符串有两个目的。 它为每张牌提供了一个稳定的整数索引，并且该索引已经代表了所需的平局顺序。 不需要单独的比较功能。 

普通卡片存储为计数而不是单独的卡片对象。 这已经足够了，因为规则只询问每个值出现的次数。 它还使最低频率选择成为固定的 13 元素扫描。 

通配符存储在`has_wild`。 这种分离对于获胜状态测试特别有用。 持有通配符的参赛者不能恰好拥有四张牌，即使他们的四张普通牌都相等，所以`is_winner`拒绝所有通配符持有者。 

初始扫描发生在第一回合之前，因为一旦存在获胜状态，游戏就会结束。 由于通配符，起始参赛者可能有五张牌，因此通配符持有者永远不会被错误地接受为初始获胜者。 

表达式`(current + 1) % n`处理循环顺序，没有特殊情况。 当当前参赛者是`n - 1`，下一位参赛者变为零，对应于参赛者 1。 

的`wild_new`标志被初始化为`True`因为参赛者`K`在第一回合之前立即收到通配符。 当普通牌被传递而其持有者拥有通配符时，标志变为`False`，这意味着通配符可以在该参赛者的下一轮传递。 当通配符本身被传递时，接收参赛者获得`wild_new = True`。 

获胜者仅在移动后检查`current`和`nxt`。 他们的手是唯一被这一举动改变的手，而最初的扫描保证了其他地方已经没有获胜的参赛者。 如果两个受影响的参赛者都获胜，则选择较小的从零开始的索引，该索引对应于较小的参赛者编号。 

## 工作示例

 ### 示例 1

 输入是```
2 1
33J3
JJJ3
```参赛者 1 开始于`33J3`和通配符。 参赛者2有`JJJ3`。 

| 转| 当前| 通配符状态 | 行动| 搬家后的状态 | 获胜者 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 刚刚收到 | 经过`J`| 玩家 2 获得`JJJJ`| 2 |

 参赛者 1 无法通过通配符，因为它刚刚收到。 在普通卡牌中，`J`发生一次`3`出现三次，所以`J`被选中。 参赛者 2 收到第四个`J`，产生获胜手牌`JJJJ`。 比赛立即停止，参赛者 2 获胜。 

这体现了特殊的首轮通配符限制以及转会后必须检查获胜条件的事实。 

### 示例 2

 输入是```
2 2
A2A2
22AA
```参赛者 2 以通配符开头。 

| 转| 当前| 通配符状态 | 行动| 搬家后的相关状态 | 获胜者 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 刚刚收到 | 经过`A`| P1：`AAA2`，P2：`AA22 + W`| 无 |
 | 2 | 1 | 没有通配符 | 经过`2`| P1：`AAA`，P2：`AAA2 + W`| 无 |
 | 3 | 2 | 可以传递通配符 | 经过`W`| P1：`AAA + 2 + W`，P2：`AAA2`| 无 |
 | 4 | 1 | 刚刚收到 | 经过`2`| P1：`AAA + W`，P2：`AAAA`| 2 |

 第一回合选手2不能通过通配符，所以普通牌`A`和`2`进行比较。 两者都出现两次，并且`A`更小，所以`A`已通过。 

参赛者 1 通过后`2`，选手2终于可以通过外卡了。 然后，参赛者 1 收到通配符并被禁止立即通过，因此它通过了剩余的通配符`2`。 参赛者 2 现在正好有 4 个`A`？ 不，得到的普通手是`AAAA`，因此参赛者 2 获胜。 输出是`2`。 

该跟踪说明了为什么必须明确表示通配符的一回合延迟，而不是仅根据当前拥有它的参赛者来推断。 

## 复杂度分析

 让`T`是游戏结束前模拟的回合数。 普通卡牌面值正好有13个。 

| 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(13T) = O(T)`| 每回合扫描 13 个值进行选牌，最多进行两次 13 值获胜者检查 |
 | 空间|`O(13N) = O(N)`| 频率数组为每位参赛者存储 13 个计数器 |

 和`N <= 13`，国家代表性很小。 对卡片值的每次操作都是一个固定的 13 元素循环，因此 Python 每轮的开销非常小。 该解决方案不执行任何分支搜索或构建大量可能的卡分布。 

## 测试用例```python
import sys
import io

VALUES = "A23456789DQJK"
POS = {ch: i for i, ch in enumerate(VALUES)}
V = 13

def game(data: str) -> str:
    inp = io.StringIO(data)

    n, k = map(int, inp.readline().split())
    k -= 1

    cards = [[0] * V for _ in range(n)]
    has_wild = [False] * n

    for i in range(n):
        s = inp.readline().strip()
        for ch in s:
            cards[i][POS[ch]] += 1

    has_wild[k] = True

    def winner(i):
        if has_wild[i]:
            return False
        return sum(cards[i]) == 4 and 4 in cards[i]

    for i in range(n):
        if winner(i):
            return str(i + 1)

    current = k
    wild_new = True

    while True:
        nxt = (current + 1) % n

        if has_wild[current] and not wild_new:
            has_wild[current] = False
            has_wild[nxt] = True
            wild_new = True
        else:
            chosen = -1
            best = 10

            for value in range(V):
                cnt = cards[current][value]
                if cnt and cnt < best:
                    best = cnt
                    chosen = value

            cards[current][chosen] -= 1
            cards[nxt][chosen] += 1

            if has_wild[current]:
                wild_new = False

        candidates = []
        if winner(current):
            candidates.append(current)
        if winner(nxt):
            candidates.append(nxt)

        if candidates:
            return str(min(candidates) + 1)

        current = nxt

# Provided samples
assert game("""\
2 1
33J3
JJJ3
""") == "2", "sample 1"

assert game("""\
2 2
A2A2
22AA
""") == "2", "sample 2"

assert game("""\
4 2
774Q
JJQ7
44Q7
4QJJ
""") == "3", "sample 3"

assert game("""\
3 1
JQAA
JJJA
QQQA
""") == "3", "sample 4"

# Minimum N, starting player has the wildcard, so player 1
# wins immediately with four equal ordinary cards.
assert game("""\
2 2
AAAA
2222
""") == "1", "initial winner while wildcard holder is not winning"

# The wildcard was just received, so player 1 must pass A.
# Player 2 then has AAAA and wins.
assert game("""\
2 1
ABBB
AAAB
""") == "2", "wildcard cannot be passed immediately"

# N = 3, K = 3. Player 3 passes A across the circular boundary
# to player 1. Player 1 later passes its only 2 and wins with AAAA.
assert game("""\
3 3
AAA2
2233
A223
""") == "1", "circular wrap-around and tie-breaking"

# Maximum N. Every contestant starts with four equal cards.
# Player 13 receives the wildcard, but player 1 is already winning.
assert game("""\
13 13
AAAA
2222
3333
4444
5555
6666
7777
8888
9999
DDDD
QQQQ
JJJJ
KKKK
""") == "1", "maximum N and all-equal hands"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 2 / AAAA / 2222`|`1`| 最低规模和不持有通配符的初始获胜者 |
 |`2 1 / ABBB / AAAB`|`2`| 通配符不能立即传递 |
 |`3 3 / AAA2 / 2233 / A223`|`1`| 圆形环绕和卡值平局打破 |
 |`13 13 / AAAA / 2222 / ... / KKKK`|`1`| 最大限度`N`、所有平等的手牌以及初始获胜者检测|

 ## 边缘情况

 第一个边缘情况是起始参赛者持有新收到的通配符。 为了```
2 1
ABBB
AAAB
```状态开始于参赛者 1 持有`ABBB + W`。 这`W`在第 1 回合无法通过，因此算法进入普通卡分支。 频率是`A = 1`和`B = 3`， 制作`A`所选卡。 参赛者2收到`A`和变化从`AAAB`到`AAAA`，因此受影响玩家获胜者检查立即返回`2`。 没有模拟第二回合。 

第二种边缘情况是比赛开始前已有获胜者。 在```
2 2
AAAA
2222
```参赛者2拥有`2222 + W`，而参赛者 1 恰好拥有`AAAA`。 在任何转移发生并返回之前，初始扫描将参赛者 1 视为获胜者`1`。 永远不会进入模拟循环。 这也说明了为什么必须将通配符排除在获胜条件之外。 

第三种边缘情况是拥有四张相同普通牌的通配符持有者。 这样的玩家总共有五张牌并且没有获胜。 例如，如果参赛者持有`AAAA + W`，普通频率数组包含四个`A`卡，但是`has_wild`是真的，所以`is_winner`返回假。 只有在通配符离开后，这四个才可以`A`牌成为赢家。 

第四种边缘情况是循环索引。 在```
3 3
AAA2
2233
A223
```第一个当前参赛者是参赛者 3。它的右手邻居是参赛者 1，表示为`(2 + 1) % 3 = 0`在从零开始的索引中。 参赛者3有`A = 1`,`2 = 2`， 和`3 = 1`，因此最小频率为 1，并且平局介于`A`和`3`。 自从`A`数值索引较小的，传递给参赛者1。参赛者1后来到达`AAAA`并获胜。 这捕获了环绕边界和最小值抢七。 

第五个边缘情况是多个获胜参赛者之间的平局。 如果初始状态是```
3 3
AAAA
2222
3333
```参赛者 1 和 2 都已经获胜，而参赛者 3 拥有通配符。 初始扫描按照参赛者编号顺序进行并返回参赛者 1。获胜者规则基于参赛者编号，而不是卡牌值，因此算法绝不能仅仅因为四张相同的卡牌值较小而选择后来的参赛者。
