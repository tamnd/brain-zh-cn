---
title: "CF 106196A - \u041a\u0440\u0443\u0433\u043b\u0430\u044f\u043a\u0430\u0440\u0442\u0430"
description: "该任务描述了纸牌游戏 Durak 中的一个决定。 我们得到了王牌花色和两张不同的牌。 第一张牌作为攻击牌打出，我们需要决定它是否可以覆盖第二张牌。 一张牌可以在两种情况下覆盖另一张牌。"
date: "2026-06-25T10:34:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106196
codeforces_index: "A"
codeforces_contest_name: "\u0423\u0440\u0430\u043b\u044c\u0441\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2025"
rating: 0
weight: 106196
solve_time_s: 32
verified: true
draft: false
---

[CF 106196A - \u041a\u0440\u0443\u0433\u043b\u0430\u044f \u043a\u0430\u0440\u0442\u0430](https://codeforces.com/problemset/problem/106196/A)

 **评级：** -
 **标签：** -
 **求解时间：** 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该任务描述了纸牌游戏 Durak 中的一个决定。 我们得到了王牌花色和两张不同的牌。 第一张牌作为攻击牌打出，我们需要决定它是否可以覆盖第二张牌。 

一张牌可以在两种情况下覆盖另一张牌。 如果两张牌的花色相同，则第一张牌的点数较高时获胜。 如果第一张牌属于王牌花色而第二张牌不属于王牌花色，则无论等级如何，第一张牌也获胜。 所有其他组合都在失败。 

输入包含王牌花色的单个字符，后跟两张牌的描述。 每张牌都有两个字符：第一个是它的等级，第二个是它的花色。 输出是`YES`当第一张牌覆盖第二张牌时，否则是`NO`。 

The constraints are tiny because there are only two cards and no repeated processing. A simulation, sorting, or any advanced data structure would be unnecessary. The solution only needs a few comparisons, so constant time is enough.

 The main mistakes come from confusing the two rules or forgetting their order. A common wrong approach is to compare ranks before checking suits, which incorrectly allows a strong non-trump card to beat a trump card.

 例如：```
Input:
H
AS KH

Output:
NO
```粗心的实施可能会发现`A`高于`K`并回答`YES`，但花色不同，第一张牌不是王牌。 第二张牌不能被覆盖。 

另一种极端情况是两张牌都是王牌。```
Input:
S
7S 6S

Output:
YES
```The trump rule does not need to be used here. 牌只是花色相同，比较等级决定结果。 

最后的边缘情况是第一张牌是王牌而第二张不是王牌，即使王牌的点数较小。```
Input:
C
6C AS

Output:
YES
```仅排名比较就会失败，因为`6`低于`A`，但王牌规则优先于排名。 

## 方法

 The brute-force approach would be to try to model the entire game logic, checking possible ways cards could interact and searching through all rules. This would still produce the correct result because the game has only one comparison to make, but it solves a much larger problem than necessary. Even a tiny simulation is wasted work here because the answer depends only on the two given cards and the trump suit.

 关键的观察是覆盖关系有一个直接的定义。 我们不需要探索可能性。 We only need to translate the two winning conditions into boolean checks.

 The brute-force idea fails in the sense that it adds unnecessary complexity. The observation that there are only two independent reasons for one card to beat another reduces the problem to a constant number of character comparisons.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(模拟游戏状态数) | O(模拟状态数) | 任务太复杂 |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. Read the trump suit and the two card descriptions. Split each card into its rank and suit so the two properties can be compared independently.
 2. 检查第一张牌是否为王牌，而第二张牌是否为王牌。 If this is true, the first card immediately covers the second one because trump always beats a non-trump card.
 3. 如果王牌条件没有决定答案，则检查两张牌的花色是否相同。 When the suits match, compare their ranks using the given rank order.
 4. 输出`YES`如果同一个箱子里第一张牌的等级更高。 否则输出`NO`。 

为什么有效：该算法遵循覆盖关系的完整定义。 唯一获胜的情况是一张王牌击败一张非王牌或两张相同花色的牌，其中第一张牌的点数较高。 由于每一对可能的牌要么满足这些条件之一，要么不满足，因此结果总是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    trump = input().strip()
    a, b = input().split()

    ranks = "6789TJQKA"

    a_rank, a_suit = a[0], a[1]
    b_rank, b_suit = b[0], b[1]

    if a_suit == trump and b_suit != trump:
        print("YES")
    elif a_suit == b_suit and ranks.index(a_rank) > ranks.index(b_rank):
        print("YES")
    else:
        print("NO")

if __name__ == "__main__":
    solve()
```字符串`ranks`按升序存储卡片。 使用`index`将排名字符转换为可以直接比较的数字。 例如，`K`出现在之后`Q`，所以它的指数更大。 

首先执行王牌检查，因为它不依赖于排名。 低王牌仍然可以击败高非王牌，因此在检查王牌之前比较等级会引入错误。 

第二个条件处理相同花色的牌。 由于输入保证了卡牌不同，因此两张卡牌之间不可能出现同等的情况，但严格比较也完全符合规则。 

该实现仅使用几个变量并且从不创建额外的集合，因此不存在边界或内存问题。 

## 工作示例

 ### 示例 1

 输入：```
H
QH 9S
```第一张卡是`QH`，第二个是`9S`。 

| 步骤| 特朗普 | 第一张卡| 第二张卡 | 状况检查 | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 哈 | QH | 9S | 第一张牌是王牌，第二张不是王牌 | 真实|
 | 2 | 哈 | QH | 9S | 覆盖成功| 是 |

 The first card is a heart, which is trump, while the second card is not. 排名比较无关紧要。 

### 示例 2

 输入：```
S
8D 6D
```| 步骤| 特朗普 | 第一张卡| 第二张卡 | 状况检查 | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | S | 8D | 6D | 第一张牌是王牌，第二张不是王牌 | 假 |
 | 2 | S | 8D | 6D | 相同花色，等级更高 | 真实|
 | 3 | S | 8D | 6D | 最终答案| 是 |

 这个例子证实了正常的同花比较。 王牌花色并不重要，因为两张牌都不是王牌。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 仅执行固定数量的字符比较和排名查找 |
 | 空间| O(1) | O(1) | 仅存储少量字符串和变量 |

 该解决方案很容易满足限制，因为工作不依赖于任何大的输入大小。 它对每个测试用例执行相同数量的计算。 

## 测试用例```python
import sys
import io

def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    trump = sys.stdin.readline().strip()
    a, b = sys.stdin.readline().split()

    ranks = "6789TJQKA"

    a_rank, a_suit = a[0], a[1]
    b_rank, b_suit = b[0], b[1]

    if a_suit == trump and b_suit != trump:
        ans = "YES"
    elif a_suit == b_suit and ranks.index(a_rank) > ranks.index(b_rank):
        ans = "YES"
    else:
        ans = "NO"

    sys.stdin = old_stdin
    return ans

assert solve_data("H\nQH 9S\n") == "YES", "sample 1"
assert solve_data("S\n8D 6D\n") == "YES", "sample 2"
assert solve_data("C\n7H AS\n") == "NO", "sample 3"

assert solve_data("C\n6C AS\n") == "YES", "trump beats stronger non-trump"
assert solve_data("H\n6S AH\n") == "NO", "non-trump cannot beat trump"
assert solve_data("D\nAD KD\n") == "YES", "same suit highest rank"
assert solve_data("S\n6H 7H\n") == "NO", "same suit lower rank"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`C / 6C AS`| 是 | Trump rule works even with a lower rank |
 |`H / 6S AH`| 否 | 非王牌打不过王牌|
 |`D / AD KD`| 是 | 同花色最高排名对比 |
 |`S / 6H 7H`| 否 | 下同花牌失败|

 ## 边缘情况

 对于特朗普与非特朗普的情况：```
Input:
C
6C AS
```该算法首先检查第一张牌是否是王牌。`6C`有王牌套装并且`AS`没有，所以它立即返回`YES`。 它永远不会比较`6`和`A`，这避免了拒绝有效的王牌举动的常见错误。 

对于第二张牌是王牌的情况：```
Input:
H
6S AH
```第一张牌不是王牌，花色也不同。 第一个条件不成立，同花条件也不成立。 算法返回`NO`, which matches the rule that non-trump cards cannot cover trump cards.

 对于同花色的牌：```
Input:
D
AD KD
```两张卡都有钻石。 王牌花色无关紧要，因为第一张牌已经通过在同一花色中具有更高的等级而获胜。 排名查找给出`A`比`K`，所以答案是`YES`。 

对于较低等级的同花案件：```
Input:
S
6H 7H
```两张牌都是红心，但第一张牌的点数较小。 算法达到同花比较并返回`NO`，防止仅检查花色是否匹配而导致错误答案。
