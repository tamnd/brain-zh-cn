---
title: "CF 102261C - \u0418\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u0430\u044f\u0438\u0433\u0440\u0430"
description: "Petya 有 N 张牌的序列，每张牌都包含一个非负整数。 游戏开始前，Vasya 选择目标分数 K。Petya 然后从左到右翻牌。"
date: "2026-08-17T20:45:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102261
codeforces_index: "C"
codeforces_contest_name: "\u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e - \u043a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f (\u042f\u043d\u0434\u0435\u043a\u0441)"
rating: 0
weight: 102261
solve_time_s: 75
verified: true
draft: false
---

[CF 102261C - \u0418\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u0430\u044f \u0438\u0433\u0440\u0430](https://codeforces.com/problemset/problem/102261/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Petya 有 N 张牌的序列，每张牌都包含一个非负整数。 游戏开始前，Vasya 选择目标分数 K。Petya 然后从左到右翻牌。 

一张能被 5 整除的牌给 Vasya 1 分，而一张能被 3 整除的牌给 Petya 1 分。 能被 3 和 5 整除的数字不会给任何人得分，同样不能被 3 和 5 整除的数字也不会得分。 当一名玩家达到 K 分时，游戏立即结束。 如果所有牌都处理完毕，而没有任何一个玩家到达 K，则分数较大的玩家获胜，分数相同则平局。 

输入给出 K（目标分数），后跟 N 和 N 张牌值。 所需的输出是`Petya`,`Vasya`， 或者`Draw`，取决于这个精确的连续游戏的获胜者。 

重要的约束是 N <= 10^6。 解决方案必须与卡片数量基本呈线性，因为这里甚至不需要 O(N log N)，而在最坏的情况下，任何二次方都需要大约 10^12 次运算。 每张卡的值最多为 1000，因此可以通过常数时间余数运算来测试是否能被两个固定数字 3 和 5 整除。 

有几种边缘情况可能会使看似合理的实现变得错误。 首先，能同时被 3 和 5 整除的数字没有分数。 例如，```
1 1
15
```产生`Draw`， 不是`Petya`或者`Vasya`。 由于 15 可以被这两个数字整除，因此两个数字都不会改变。 

其次，牌的顺序很重要，因为游戏会立即停止。 例如，```
2 3
3 5 3
```产生`Petya`。 Petya 从第一张和第三张牌中获得分数，但在第三张牌之后，他达到 2 分并获胜。 一个简单地计算所有牌并比较总数的解决方案可能会正确地解决这种情况，但该方法无法重现一个玩家在处理后面的牌之前达到 K 的情况。 

第三，零可以被每个正整数整除。 因此，```
1 1
0
```产生`Draw`，因为零可以被 3 和 5 整除，并且不会给任何人得分。 将零视为不能被两者整除将错误地给出结果`Petya`或者`Vasya`取决于实施。 

## 方法

 直接的暴力实现可以模拟游戏，但假设整除性是通过对每张卡的可能除数进行通用搜索来处理的。 对于值为 x 的卡，这样的方法可以在决定卡的行为之前检查最多 x 个候选者。 由于 x 可以是 1000 并且可以有 10^6 张牌，因此最坏的情况达到约 10^9 除数检查。 这远远超出了一秒的极限所能容忍的范围。 

暴力模拟在概念上是正确的，因为每张卡牌都会根据其可分性属性准确地影响分数，并且按顺序处理卡牌会重现实际游戏。 问题不在于模拟本身。 浪费来自于将一个非常简单的整除性测试视为一般的算术搜索。 

关键的观察是，唯一相关的约数是预先固定的：3 和 5。我们不需要发现一个数字是否可以被它们整除。 两个余数运算，`x % 3`和`x % 5`，完全决定了卡牌的效果。 

关于停止条件还有另一个有用的观察结果。 当任一分数达到 K 时，答案就已经知道，因此没有理由检查后面的牌。 在最坏的情况下，我们仍然处理所有 N 张卡，但复杂度为 O(N)，这是最优的，因为输入本身包含 N 个值。 

由此产生的方法只是从左到右的一次扫描。 对于每张牌，首先检查它能被 3 和 5 整除的情况，因为这种情况不得分。 否则，如果Petya的分数能被3整除，则增加Petya的分数，或者如果Vasya的分数能被5整除，则增加Vasya的分数。在每张计分卡之后，检查相应玩家是否达到K。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 通用除数搜索 | O(N·最大(A)) | O(1) | O(1) | 太慢了 |
 | 直接模拟`% 3`和`% 5`| O(N) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取K和N，然后从第一张到最后一张处理卡片。 必须保留顺序，因为达到 K 会立即结束游戏。 
2.维护两个柜台，`petya`和`vasya`，最初都为零。 它们代表了迄今为止处理完所有卡片后的准确分数。 
3. 对于每个值`x`,首先检查是否`x`可被 3 和 5 整除。如果是，则保持两个计数器不变。 在进行单独的整除性测试之前必须检查此条件，因为这样的牌不会给任何玩家任何分数。 
4. 如果`x`能被 3 整除但不能被 5 整除，增量`petya`。 立即检查是否`petya == K`。 如果是这样，则打印`Petya`并终止，因为后来的牌无法改变获胜者。 
5. 如果`x`能被 5 整除但不能被 3 整除，增量`vasya`。 立即检查是否`vasya == K`。 如果是这样，则打印`Vasya`并以同样的理由终止。 
6. 如果所有 N 张牌都已处理完，但没有任何一位玩家达到 K，则比较两个最终得分。 分数大者决胜负，分数相等则获胜`Draw`。 

不变量是，处理完卡序列的任意前缀后，`petya`和`vasya`正是在比赛尚未结束的情况下，真实比赛当时的得分。 每张牌都属于一个相关类别：可被两者整除，只能被 3 整除，只能被 5 整除，或者不能被两者整除。 该算法完全应用该类别的规则。 因为它会在每次分数增加后立即检查目标，所以它也会停在与真实游戏停止的完全相同的卡上。 如果没有达到目标，则最终计数器是实际的最终分数，因此它们的比较给出了所需的结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    K, N = map(int, input().split())

    petya = 0
    vasya = 0

    for _ in range(N):
        x = int(input().split()[0]) if False else None

    # The official input places all N numbers on the next line.
    # Re-read using a direct iterator for fast processing.
```输入包含下一行的所有 N 卡值，因此干净的实现是直接迭代该行：```python
import sys
input = sys.stdin.readline

def solve():
    K, N = map(int, input().split())

    petya = 0
    vasya = 0

    cards = map(int, input().split())

    for x in cards:
        divisible_by_3 = (x % 3 == 0)
        divisible_by_5 = (x % 5 == 0)

        if divisible_by_3 and divisible_by_5:
            continue

        if divisible_by_3:
            petya += 1
            if petya == K:
                print("Petya")
                return

        elif divisible_by_5:
            vasya += 1
            if vasya == K:
                print("Vasya")
                return

    if petya > vasya:
        print("Petya")
    elif vasya > petya:
        print("Vasya")
    else:
        print("Draw")

if __name__ == "__main__":
    solve()
```前两个变量存储当前分数。 它们永远不需要超过 K，因为当分数达到目标时函数会立即返回。 

这两个布尔表达式对每张卡计算一次可分性属性。 首先处理组合情况，这对于 0、15、30 以及其他 15 的倍数等值至关重要。 

的`elif`结构还保证一张只能被 3 整除的牌给 Petya 正好 1 分，而一张只能被 5 整除的牌给 Vasya 正好 1 分。 不能被两者整除的数到达两个分支。 

对 K 进行相等性检查就足够了，因为计数器仅增加 1。 分数不能从 K-1 跳到大于 K 的值。该函数在确定获胜者后立即返回，因此剩余的牌不会影响结果。 

该方案直接遵循输入格式，不存储整个卡片阵列。`map`从分割的输入标记中延迟生成转换后的整数，从而有效地保持算法的附加数据结构的大小恒定。 

## 工作示例

 对于示例 1，输入为：```
3 10
1 2 3 4 5 6 7 8 9 10
```目标是 3。能被 3 整除的值给出 Petya 点，能被 5 整除的值给出 Vasya 点。 

| 卡| 价值| 佩蒂亚得分 | 瓦斯亚分数 | 行动|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 0 | 没有意义|
 | 2 | 2 | 0 | 0 | 没有意义|
 | 3 | 3 | 1 | 0 | 佩蒂亚得分 |
 | 4 | 4 | 1 | 0 | 没有意义|
 | 5 | 5 | 1 | 1 | 瓦夏得分 |
 | 6 | 6 | 2 | 1 | 佩蒂亚得分 |
 | 7 | 7 | 2 | 1 | 没有意义|
 | 8 | 8 | 2 | 1 | 没有意义|
 | 9 | 9 | 3 | 1 | 佩蒂亚 (Petya) 达到 K |

 Petya 在第九张牌上达到了三点，因此算法立即返回`Petya`。 最终的牌与结果无关。 

对于示例 2，输入为：```
4 16
1 2 3 4 5 6 7 8 9 10 15 20 25 24 21 18
```这里K是4。能被3和5整除的牌，比如15，一定不能给分。 

| 卡| 价值| 佩蒂亚得分 | 瓦斯亚分数 | 行动|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 0 | 没有意义|
 | 2 | 2 | 0 | 0 | 没有意义|
 | 3 | 3 | 1 | 0 | 佩蒂亚得分 |
 | 4 | 4 | 1 | 0 | 没有意义|
 | 5 | 5 | 1 | 1 | 瓦夏得分 |
 | 6 | 6 | 2 | 1 | 佩蒂亚得分 |
 | 7 | 7 | 2 | 1 | 没有意义|
 | 8 | 8 | 2 | 1 | 没有意义|
 | 9 | 9 | 3 | 1 | 佩蒂亚得分 |
 | 10 | 10 10 | 10 3 | 2 | 瓦夏得分 |
 | 11 | 11 15 | 15 3 | 2 | 两者都可以整除，没有意义|
 | 12 | 12 20 | 3 | 3 | 瓦夏得分 |
 | 13 | 25 | 25 3 | 4 | 瓦夏 (Vasya) 达到 K |

 Vasya 在第 13 张牌上达到了 4 点，因此游戏到此结束，答案是`Vasya`。 最后三张牌并不重要。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N) | 每张卡都会被检查一次并使用恒定数量的算术运算。 |
 | 空间| O(1) 辅助 | 仅显式存储 K、N 和两个分数计数器。 |

 当 N 达到 10^6 时，线性扫描最多执行一百万次卡片迭代，这适合约束条件。 没有排序、嵌套迭代或与 N 成比例的辅助数组。直接余数检查还避免了对常量时间算术之外的数值的任何依赖。 

## 测试用例```python
import sys
import io

input = sys.stdin.readline

def solve():
    K, N = map(int, input().split())

    petya = 0
    vasya = 0

    for x in map(int, input().split()):
        by3 = (x % 3 == 0)
        by5 = (x % 5 == 0)

        if by3 and by5:
            continue

        if by3:
            petya += 1
            if petya == K:
                print("Petya")
                return

        elif by5:
            vasya += 1
            if vasya == K:
                print("Vasya")
                return

    if petya > vasya:
        print("Petya")
    elif vasya > petya:
        print("Vasya")
    else:
        print("Draw")

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input

    try:
        sys.stdin = io.StringIO(inp)
        input = sys.stdin.readline

        old_stdout = sys.stdout
        sys.stdout = io.StringIO()

        try:
            solve()
            return sys.stdout.getvalue().strip()
        finally:
            sys.stdout = old_stdout
    finally:
        sys.stdin = old_stdin
        input = old_input

# Provided samples
assert run("""3 10
1 2 3 4 5 6 7 8 9 10
""") == "Petya", "sample 1"

assert run("""4 16
1 2 3 4 5 6 7 8 9 10 15 20 25 24 21 18
""") == "Vasya", "sample 2"

assert run("""3 5
3 5 15 15 15
""") == "Draw", "sample 3"

# Minimum-size input, zero is divisible by both 3 and 5.
assert run("""1 1
0
""") == "Draw", "zero gives nobody a point"

# K is reached exactly on the final card.
assert run("""2 3
5 3 6
""") == "Petya", "Petya reaches K on the final card"

# All cards are divisible by both 3 and 5.
assert run("""1 4
0 15 30 45
""") == "Draw", "all cards give no points"

# Vasya reaches K before a later Petya-scoring card.
assert run("""2 4
5 10 3 3
""") == "Vasya", "immediate stopping"

# Large N. Petya reaches K very early, while the remaining cards are irrelevant.
large_input = "1000 1000000\n" + "3 " * 1000000
assert run(large_input) == "Petya", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 0`|`Draw`| 最小输入和零的特殊整除性行为
 |`2 3 / 5 3 6`|`Petya`| 最后一张牌正好达到 K |
 |`1 4 / 0 15 30 45`|`Draw`| 每张牌都可以被 3 和 5 整除 |
 |`2 4 / 5 10 3 3`|`Vasya`| 当 Vasya 达到 K 时游戏立即停止 |
 |`1000 1000000 / 3 ...`|`Petya`| 最大 N 和提前终止 |

 ## 边缘情况

 第一个边缘情况是一张可以同时被 3 和 5 整除的卡片。考虑：```
1 1
15
```为了`x = 15`， 两个都`x % 3 == 0`和`x % 5 == 0`是真的。 组合条件执行`continue`，因此两个分数均为零。 现在所有牌都用完，分数相等，结果是`Draw`。 如果没有合并检查，同一张卡可能会错误地将分数奖励给其中一位玩家。 

第二个边缘情况为零：```
1 1
0
```零满足两个整除性测试，因为 0 是每个正整数的倍数。 因此，该算法将其视为 15，并且不奖励任何分数。 最终得分为0和0，所以结果为`Draw`。 

第三种边缘情况是立即终止：```
2 4
5 10 3 3
```在第一张牌之后，分数是 0 和 1。在第二张牌之后，分数是 0 和 2，所以 Vasya 达到 K 并且算法打印`Vasya`立即地。 剩下的两张牌会给 Petya 两分，但绝对不能考虑它们，因为实际的游戏已经结束了。 

第四个边缘情况正好在最后达到 K：```
2 3
5 3 6
```前两张牌后的分数是 Vasya 为 1，Petya 为 1。 最后一张牌 6 可以被 3 整除，但不能被 5 整除，因此 Petya 成为第一个达到 2 点的玩家。 算法打印`Petya`在那一刻，而不是落入最终的分数比较。 

第五个边缘情况是没有人到达 K，最终得分决定获胜者。 例如，```
5 4
3 5 6 5
```Petya 从 3 和 6 中得到两分，而 Vasya 从两个 5 中得到两分。 两者都没有达到 5，因此两张牌的分数相同，结果是`Draw`。 仅在处理整个序列且没有较早获胜者的情况下才使用最终比较。
