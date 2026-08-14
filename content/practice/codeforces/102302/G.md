---
title: "CF 102302G - 左堆栈游戏"
description: "我们有三堆从左到右排列的岩石，分别包含 a、b 和 c 岩石。 在每一回合中，当前玩家选择一个非空堆并移除 1 到 m 块石头。"
date: "2026-08-13T07:44:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102302
codeforces_index: "G"
codeforces_contest_name: "2019 USP-ICMC"
rating: 0
weight: 102302
solve_time_s: 221
verified: true
draft: false
---

[CF 102302G - 左堆栈游戏](https://codeforces.com/problemset/problem/102302/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有三个堆栈，从左到右排列，包含`a`,`b`， 和`c`岩石。 在每一回合中，当前玩家选择一个非空堆栈并在`1`和`m`岩石。 唯一的限制是移除堆栈中的最后一块石头：只有当堆栈左侧的每个堆栈都已空时，堆栈才可能变空。 

第一个堆栈的左侧没有堆栈，因此它总是可以被清空。 只有在第一个堆栈消失后才能清空第二个堆栈，只有在前面的两个堆栈都消失后才能清空第三个堆栈。 移走整个位置上最后一块石头的玩家获胜，因此这是一场正常的公平游戏。 我们需要确定在最佳发挥下，Tomaz 的初始位置是获胜还是失败。 

四个输入值都可以达到(10^{18})。 这立即排除了对岩石数量的任何动态编程，甚至与匝数成比例的模拟也是不可能的。 该解决方案必须仅依赖于算术属性，例如余数模`m + 1`，具有恒定或对数运行时间。 

有两种边界效应很容易被错误处理。 首先，当较早的堆栈非空时，后面的堆栈不能被清空。 例如，与`m = 1`并输入`1 1 2`，Tomaz 无法在第一步中从第二堆石头中移除单个岩石，因为第一堆石头仍然包含一块石头。 将三个堆栈视为独立的减法游戏的解决方案会导致游戏状态错误。 

第二个边缘情况是第一个堆栈总是可以被清空。 和`m = 3`并输入`3 1 1 1`，托马兹从第一堆石头中取出唯一的一块石头，然后丹菲托被迫进入第二堆石头，托马兹从第三堆石头中取出最后一块石头。 正确答案是`Tomaz`。 将“左边有东西时不能清空”限制应用于第一个堆栈的解决方案将错误地拒绝获胜的第一步。 

当堆栈小到足以一次清空时，就会发生第三种微妙的情况。 例如，与`m = 3`，一个堆栈包含`1`,`2`， 或者`3`岩石直接移动到零，而包含的堆栈`4`没有。 因此，最优公式最多对值进行单独处理`m`。 

## 方法

 直接递归解决方案遵循游戏的定义。 来自一个州`(a,b,c)`，尝试从每一堆中移除所有合法数量的石头，递归地确定结果位置是否获胜，如果至少有一个移动到达失败位置，则宣布当前位置获胜。 这是正确的，因为每次移动都会严格减少石头的总数，因此游戏图是有限的。 

问题在于状态和动作的数量。 一个州最多可以有`3m`合法的动作，一场比赛最多可以包含`a + b + c`轮流。 当值大到 (10^{18}) 时，即使是假设的线性遍历也已经远远超出了限制。 递归博弈树的情况呈指数级恶化。 

关键的观察是，虽然一堆石头还不能被清空，但从中减去一块石头相当于在少一块石头上玩普通的减法游戏。 对于单个减法游戏，我们可以删除`1`通过`m`岩石，一堆大小的格伦迪值`x`是`x mod (m + 1)`。 因此，当一个堆栈被其左侧的非空堆栈锁定时，一堆`x`岩石的行为就像是大小减法堆`x - 1`，赋予 Grundy 值`(x - 1) mod (m + 1)`。 

这会将右侧锁定的堆栈变成普通的 Nim 位置。 唯一的特殊事件是当最左边的当前活动堆栈小到足以一次清空时。 此时游戏从后缀的锁定版本更改为后缀的完全解锁版本。 由于只有三个堆栈，我们可以显式处理此转换。 

同样的推理可以先解决二栈游戏，然后使用该结果作为三栈游戏的后缀状态。 对于足够大的第一栈来说，它不可能一次清空，所以当前的游戏只是第一栈的减法游戏值和锁定的后缀值的异或。 对于较小的第一堆，可以进行归零移动，并且结果根据第一堆的奇偶性进行交替，具体取决于解锁的后缀是赢还是输。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数为`a+b+c`| 指数为`a+b+c`具有记忆功能| 太慢了|
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 让`k = m + 1`。 一种普通的减法游戏，可以消除`1`通过`m`岩石具有格伦迪价值`x mod k`。 
2.首先解决两栈位置`(b,c)`，因为这将是原始三栈游戏的解锁后缀。 
3.同时`b`非空，堆栈`c`不能被清空。 因此其锁定值为`(c - 1) mod k`。 如果`b > m`， 堆`b`也不能一步清空，因此两个堆栈表现为具有值的独立减法游戏`b mod k`和`(c - 1) mod k`。 当它们的 XOR 为零时，仓位就会亏损。 
4.如果`b <= m`， 堆`b`可以立即清空。 如果`(c - 1) mod k`非零，则锁定的后缀具有非零 Nim 值，因此当前位置获胜，因为玩家可以将后缀修改为零 Nim 值。 
5. 剩下的两叠案例有`(c - 1) mod k = 0`。 那么锁定的后缀就是一个失败的位置。 清空`b`直接进入普通的单堆游戏`(c)`。 那个单堆位置正在失去的时候`c mod k = 0`。 
6. 因此，当`b <= m`和`(c - 1) mod k = 0`，两个堆栈位置与奇偶校验交替`b`。 如果`(c mod k) != 0`，解锁后缀获胜，太奇怪了`b`给出一个失败的位置。 如果`(c mod k) == 0`，解锁的后缀正在丢失，所以即使`b`给出一个失败的位置。 
7. 现在计算原始后缀的锁定 Grundy 值`(b,c)`:`locked = ((b - 1) mod k) XOR ((c - 1) mod k)`。 
这是有效的，因为两者都不是`b`也不`c`可能会被清空`a`是积极的。 
8. 如果`a > m`，第一栈不能一次清空。 因此，整个位置是减法游戏的普通不相交和`a`和锁定的后缀。 托马兹获胜的时间正是`a mod k XOR locked != 0`。 
9.如果`a <= m`和`locked != 0`, Tomaz 可以在锁定的后缀内做出获胜的动作，因此该位置是获胜的。 
10.如果`a <= m`和`locked == 0`，每一个变化的动作`b`或者`c`走向胜利的位置。 唯一剩下的问题是当第一个堆栈减少到零时会发生什么。 该移动到达已经计算出的两叠位置`(b,c)`。 如果该后缀获胜，则具有该后缀的州`a = 1,2,3,...`以奇数的失败状态开始交替`a`。 如果后缀丢失，它们会以偶数的丢失状态开始交替`a`。 

### 为什么它有效

 不变量是，禁止变空的堆栈在从中移除一块概念石头后，其行为与减法游戏完全相同。 其合法值为`x -> x-d`为了`1 <= d <= min(m,x-1)`，这正是普通的减法游戏`x-1`岩石。 因此，锁定后缀具有通过对这些移位残基进行异或运算而获得的标准 Nim 值。 

此锁定 Nim 模型未表示的唯一移动是清空当前最左侧堆栈的移动。 这样的举动改变了后缀的规则，因为下一个堆栈变得不可解锁。 对于两个堆栈，我们直接计算这个未锁定的后缀，然后将其用作第一个堆栈的最终结果。 由于较小的第一堆栈可以移动到每个较小的正大小，也可以移动到零，因此其获胜和失败状态按奇偶性交替。 对于较大的第一堆栈，一次移动无法达到零，因此应用普通的 XOR 表征。 这些案例涵盖了每一个法律举措，给出了准确正确的结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def two_stack_wins(m, b, c):
    k = m + 1

    # While b > 0, c cannot be emptied.
    locked_c = (c - 1) % k

    if b > m:
        return ((b % k) ^ locked_c) != 0

    # b can be emptied immediately.
    if locked_c != 0:
        return True

    # If b is emptied, the remaining game is a normal
    # one-stack subtraction game on c.
    suffix_wins = (c % k) != 0

    # With locked suffix of Grundy value 0, outcomes alternate
    # as b goes through 1, 2, ..., m.
    if suffix_wins:
        # Losing for odd b.
        return (b % 2) == 0
    else:
        # Losing for even b.
        return (b % 2) == 1

def solve():
    m, a, b, c = map(int, input().split())
    k = m + 1

    # Outcome of the suffix after the first stack has been emptied.
    suffix_wins = two_stack_wins(m, b, c)

    # While a > 0, both later stacks are locked against becoming empty.
    locked = ((b - 1) % k) ^ ((c - 1) % k)

    if a > m:
        # The first stack cannot reach zero in one move, so the
        # position is an ordinary disjoint sum.
        first_value = a % k
        wins = (first_value ^ locked) != 0
    else:
        if locked != 0:
            wins = True
        else:
            # locked suffix is a P-position. The only exceptional
            # transition is a -> 0, which reaches the unlocked suffix.
            if suffix_wins:
                # P for odd a.
                wins = (a % 2) == 0
            else:
                # P for even a.
                wins = (a % 2) == 1

    print("Tomaz" if wins else "Danftito")

if __name__ == "__main__":
    solve()
```这`two_stack_wins`函数实现演练中的递归后缀分析。 表达式`(c - 1) % k`是移位减法游戏值`c`当堆栈`b`仍然是非空的。 

什么时候`b > m`，第二个堆栈不能一次性清空，因此无法到达特殊转换。 状态只是两个锁定减法游戏的异或。 什么时候`b <= m`，归零转换必须单独处理。 

main 函数在前一级应用了完全相同的想法。 价值`locked`是移位值的异或`b`和`c`。 如果`a > m`，从第一个堆栈无法到达零，因此普通的 XOR 测试就足够了。 如果`a <= m`，存在归零转换，并且结果取决于已计算的解锁后缀。 

Python 整数具有任意精度，因此 (10^{18}) 边界不需要特殊的溢出处理。 表达式`m + 1`也是安全的，并且在 XOR 比较之前执行模运算。 

## 工作示例

 ### 示例 1

 输入是：```
3 1 1 1
```这里`m = 3`， 所以`k = 4`。 

| 变量| 价值|
 | --- | --- |
 |`m`| 3 |
 |`k`| 4 |
 |`a`| 1 |
 |`b`| 1 |
 |`c`| 1 |
 |`(b-1)%k`| 0 |
 |`(c-1)%k`| 0 |
 |`locked`| 0 |

 对于两栈后缀`(1,1)`， 堆`b`很小并且锁定值`c`为零。 清空`b`留下单堆游戏`c = 1`，即获胜。 因此，两层后缀本身正在丢失。 

原来的`a = 1`也很小并且`locked = 0`。 由于后缀丢失，奇数`a`给出一个获胜的位置。 

输出是：```
Tomaz
```真正的获胜玩法正是直观的顺序：Tomaz 清空第一堆，Danftito 清空第二堆，Tomaz 清空第三堆。 

### 自定义跟踪

 考虑：```
1 2 1 1
```这里`m = 1`， 所以`k = 2`。 

| 变量| 价值|
 | --- | --- |
 |`m`| 1 |
 |`k`| 2 |
 |`a`| 2 |
 |`b`| 1 |
 |`c`| 1 |
 |`(b-1)%k`| 0 |
 |`(c-1)%k`| 0 |
 |`locked`| 0 |
 |`a%k`| 0 |
 | 最终结果| 普 |

 自从`a = 2 > m`，第一栈不能一次清空。 锁定后缀的值为零，第一个堆栈的值`2 % 2 = 0`。 他们的 XOR 为零，因此该位置正在丢失。 

托马兹只能从第一堆石头中取出一块石头，留下`(1,1,1)`，丹菲托获胜。 这证实了大堆栈异或的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 执行恒定数量的模、异或、比较和奇偶校验运算。 |
 | 空间| O(1) | O(1) | 仅存储固定数量的整数变量。 |

 输入值可能大到 (10^{18})，但算法永远不会迭代其大小。 它将每个相关堆栈减少为余数模`m + 1`并检查恒定数量的案例，因此它可以轻松满足 1 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve_case(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        m, a, b, c = map(int, input().split())
        k = m + 1

        def two_stack_wins(m, b, c):
            k = m + 1
            locked_c = (c - 1) % k

            if b > m:
                return ((b % k) ^ locked_c) != 0

            if locked_c != 0:
                return True

            suffix_wins = (c % k) != 0

            if suffix_wins:
                return (b % 2) == 0
            return (b % 2) == 1

        suffix_wins = two_stack_wins(m, b, c)
        locked = ((b - 1) % k) ^ ((c - 1) % k)

        if a > m:
            wins = ((a % k) ^ locked) != 0
        else:
            if locked != 0:
                wins = True
            elif suffix_wins:
                wins = (a % 2) == 0
            else:
                wins = (a % 2) == 1

        print("Tomaz" if wins else "Danftito")
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert solve_case("3 1 1 1\n") == "Tomaz\n", "sample 1"

# Minimum-size parameters, same state as the sample with m = 1.
assert solve_case("1 1 1 1\n") == "Tomaz\n", "minimum values"

# Large first stack whose residue makes the whole position losing.
assert solve_case("1 2 1 1\n") == "Danftito\n", "large-stack XOR boundary"

# All stacks equal, with a modulus boundary.
assert solve_case("3 4 4 4\n") == "Danftito\n", "all equal"

# Maximum-size values, exercising arbitrary-precision arithmetic.
assert solve_case(
    "1000000000000000000 1000000000000000000 "
    "1000000000000000000 1000000000000000000\n"
) == "Tomaz\n", "maximum-size values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 1 1 1`|`Tomaz`| 提供样例及小栈解锁 |
 |`1 1 1 1`|`Tomaz`| 最低限度`m`和最小堆栈大小|
 |`1 2 1 1`|`Danftito`| 大的第一堆栈和零异或边界 |
 |`3 4 4 4`|`Danftito`| 相等的堆栈和值恰好位于`m+1`|
 |`10^18 10^18 10^18 10^18`|`Tomaz`| 最大输入幅度和 Python 整数处理 |

 ## 边缘情况

 第一个重要的边缘情况是第一个堆栈可能总是被清空。 为了`3 1 1 1`,`a = 1 <= m`，这样 Tomaz 就可以直接移动到`(0,1,1)`。 两栈后缀`(1,1)`输了，因为丹菲托必须清空第二堆，之后托马兹拿走最后一块石头。 该算法计算`locked = 0`，找到后缀丢失，并使用奇数`a`将原始状态分类为获胜。 

第二种边缘情况是稍后的堆栈，尚无法清空。 考虑`1 1 2 1`。 这里`k = 2`，后缀的锁定值为`((2-1) mod 2) XOR ((1-1) mod 2) = 1`。 因为锁定值不为零，所以当前位置立即获胜。 玩家可以在锁定的后缀内进行游戏，而不会非法清空第二个堆栈。 治疗`b`因为普通的堆会错过这个限制。 

第三个边缘情况是第一个堆栈大于`m`。 为了`1 2 1 1`，第一堆包含两块石头，而每次移动只能移除一块，因此它不能立即归零。 锁定后缀的值为零并且`a mod 2 = 0`，总异或为零。 托马兹没有进入失败状态，所以答案是`Danftito`。 这正是普通 Nim 分解再次变得有效的情况。 

最终的边缘情况是正好位于模数边界的堆栈。 和`m = 3`, 一堆`4`具有减法游戏价值`4 mod 4 = 0`，而一堆锁着的`4`有价值`(4-1) mod 4 = 3`。 混淆这两个表达式是一个典型的差一错误。 该算法使用`x % (m+1)`仅适用于可能被清空的堆栈，并且`(x-1) % (m+1)`对于当前禁止清空的堆栈，匹配每个阶段中实际的合法移动。
