---
title: "CF 106A - 卡牌游戏"
description: "我们得到了杜拉克游戏的王牌套装和两张牌。 任务是决定在游戏规则下第一张牌能否击败第二张牌。 每张牌都有一个等级和花色。 排名的顺序如下：一张牌可以在两种情况下击败另一张牌。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 106
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 82 (Div. 2)"
rating: 1000
weight: 106
solve_time_s: 97
verified: true
draft: false
---

[CF 106A - 卡牌游戏](https://codeforces.com/problemset/problem/106/A)

 **评分：** 1000
 **标签：** 实施
 **求解时间：** 1m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了杜拉克游戏的王牌套装和两张牌。 任务是决定在游戏规则下第一张牌能否击败第二张牌。 

每张牌都有一个等级和花色。 排名顺序如下：```
6 < 7 < 8 < 9 < T < J < Q < K < A
```一张牌可以在两种情况下击败另一张牌。 

如果两张牌的花色相同，则排名较高的牌获胜。 

如果花色不同，则第一张牌仅在属于王牌花色时获胜，而第二张牌则不属于王牌花色。 

输入尺寸很小，只有两张牌和一套王牌。 这里不存在性能挑战。 任何恒定时间的实现都很容易在限制内足够快。 

棘手的部分是以正确的顺序处理规则。 有几个案例看起来相似但行为不同。 

一个容易犯的错误是忘记一张王牌胜过任何非王牌，无论等级如何。 

例如：```
Trump = H
6H  AS
```正确答案是：```
YES
```尽管Ace比正常排名中的6强得多，但红心牌是王牌。 

另一个常见的错误是允许不同非王牌花色的较高等级的牌获胜。 

例如：```
Trump = D
AS  KC
```正确答案是：```
NO
```花色不同，而且两张牌都不是王牌，因此第一张牌无法击败第二张牌。 

第三种边缘情况是两张牌都是王牌。 在这种情况下，排名比较再次变得重要。 

例如：```
Trump = S
7S  9S
```正确答案是：```
NO
```两张牌都是王牌，所以我们正常比较等级，7比9弱。 

## 方法

 思考这个问题的一种强力方法是手动编码卡牌之间每一种可能的获胜关系。 由于只有 36 张牌，理论上我们可以预先计算哪张牌击败哪张牌，然后执行查找。 

这种方法之所以有效，是因为卡片的数量非常少。 完整的比较表最多包含：```
36 × 36 = 1296
```关系。 

不过，这是不必要的。 游戏规则已经描述了直接比较过程。 我们可以立即评估两张牌之间的关系，而不是存储每对可能的牌。 

关键的观察是只有三个事实很重要：

 首先，花色是否相等。 

第二，第一张牌是否是王牌。 

第三，队伍的相对顺序。 

一旦我们围绕这些条件组织规则，实施就会变得简单。 

如果花色相等，我们会比较等级值。 

如果花色不同，则只有当第一张牌是王牌时才获胜，而第二张牌不是王牌时才获胜。 

其他一切都输了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(36²) 预处理 | O(36²) | 已接受但没有必要 |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读王牌花色。 
2. 阅读两张卡片。 
3. 将每张牌分成其等级和花色部分。 
4. 将排名顺序存储在字符串或映射中：```
"6789TJQKA"
```该字符串中的索引代表卡牌强度。 

1. 检查两张牌的花色是否相同。 

如果他们这样做，请比较他们的排名位置。 仅当第一张牌的等级指数较大时，它才能击败第二张牌。 

1. 如果花色不同，检查第一张牌是否是王牌，第二张牌是否不是王牌。 

如果该条件成立，则打印`"YES"`。 

1. 在所有其余情况下，打印`"NO"`。 

### 为什么它有效

 该算法直接反映了游戏规则。 

当花色匹配时，只有排名很重要，因此比较排名指数会给出正确的获胜者。 

当花色不同时，击败另一张牌的唯一方法是用王牌对抗非王牌。 该算法准确地检查该条件。 

规则中不存在其他获胜情况，因此每个可能的输入都会得到正确处理。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    trump = input().strip()
    first, second = input().split()

    rank_order = "6789TJQKA"

    r1, s1 = first[0], first[1]
    r2, s2 = second[0], second[1]

    if s1 == s2:
        if rank_order.index(r1) > rank_order.index(r2):
            print("YES")
        else:
            print("NO")
    else:
        if s1 == trump and s2 != trump:
            print("YES")
        else:
            print("NO")

solve()
```解决方案从阅读王牌花色和两张牌开始。 每张牌都由两个字符表示，因此提取牌号和花色只是简单地索引到字符串中。 

字符串`"6789TJQKA"`定义等级层次结构。 索引越大意味着卡牌越强。 这避免了长的条件链并保持比较逻辑紧凑。 

第一个主要分支检查花色是否匹配。 如果是的话，游戏规则规定只有排名才重要，所以我们比较指数。 

如果花色不同，除非涉及特朗普，否则排名不再重要。 该代码检查第一张牌是否为王牌，而第二张牌是否为王牌。 这是唯一的跨花获胜条件。 

一个微妙的一点是，较弱的特朗普仍然会击败较强的非特朗普。 该实现会自动处理这个问题，因为当花色不同时，排名比较会被跳过。 

## 工作示例

 ### 示例 1

 输入：```
H
QH 9S
```| 变量| 价值|
 | ---| ---|
 | 特朗普 | 哈 |
 | 第一| QH |
 | 第二 | 9S |
 | s1 | 哈 |
 | s2 | S |

 花色不同，因此排名比较被忽略。 

第一张牌属于王牌花色，而第二张牌则不属于王牌花色。 

输出：```
YES
```此示例演示了王牌规则优先于正常排名顺序。 

### 示例 2

 输入：```
S
7S 9S
```| 变量| 价值|
 | ---| ---|
 | 特朗普 | S |
 | 第一| 7S |
 | 第二 | 9S |
 | s1 | S |
 | s2 | S |
 | 排名(7) | 1 |
 | 排名(9) | 3 |

 花色相同，所以我们直接比较等级。 

自从`1 < 3`，第一张牌较弱。 

输出：```
NO
```这个例子表明，当两张牌具有相同的花色时，即使是王牌也遵循正常的排名顺序。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 仅执行少量比较和查找 |
 | 空间| O(1) | O(1) | 该算法使用恒定量的额外内存 |

 该解决方案很容易满足限制，因为工作量从不取决于输入大小。 仅处理两张卡。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    trump = input().strip()
    first, second = input().split()

    rank_order = "6789TJQKA"

    r1, s1 = first[0], first[1]
    r2, s2 = second[0], second[1]

    if s1 == s2:
        if rank_order.index(r1) > rank_order.index(r2):
            print("YES")
        else:
            print("NO")
    else:
        if s1 == trump and s2 != trump:
            print("YES")
        else:
            print("NO")

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup
    return out.getvalue()

# provided sample
assert run("H\nQH 9S\n") == "YES\n", "sample 1"

# same suit, higher rank wins
assert run("D\nAH KH\n") == "YES\n", "same suit higher rank"

# same suit, lower rank loses
assert run("C\n7S TS\n") == "NO\n", "same suit lower rank"

# trump beats stronger non-trump
assert run("H\n6H AS\n") == "YES\n", "trump overrides rank"

# different suits, no trump involved
assert run("D\nAS KC\n") == "NO\n", "different non-trump suits"

# both trump cards, compare rank normally
assert run("S\nJS QS\n") == "NO\n", "both trump cards"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`H / QH 9S`|`YES`| 王牌胜过非王牌|
 |`D / AH KH`|`YES`| 同花等级对比|
 |`C / 7S TS`|`NO`| 相同花色中较低等级输掉 |
 |`H / 6H AS`|`YES`| 弱特朗普仍击败强非特朗普|
 |`D / AS KC`|`NO`| 不同的非将牌花色不能互相击败 |
 |`S / JS QS`|`NO`| 特朗普对特朗普仍取决于排名|

 ## 边缘情况

 考虑弱王牌击败强非王牌的情况。 

输入：```
H
6H AS
```该算法首先发现花色不同。 它不比较排名。 相反，它检查王牌条件。 自从`6H`是特朗普并且`AS`不是，答案变成`"YES"`。 

现在考虑两种不同的非王牌花色。 

输入：```
D
AS KC
```花色不同，因此算法会检查第一张牌是否为王牌。 它不是。 由于不适用获胜规则，因此输出为`"NO"`。 

最后，考虑两张王牌。 

输入：```
S
7S 9S
```花色相等，因此算法直接比较排名。 的索引为`7`小于索引`9`，所以第一张牌输了，输出是`"NO"`。 

这些案例证实，该实现正确地将同花色逻辑与王牌逻辑分开，这是问题的核心细节。
