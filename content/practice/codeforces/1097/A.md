---
title: "CF 1097A - 根纳季和纸牌游戏"
description: "根纳迪玩的游戏涉及按等级或花色匹配牌。 实际上，桌上有一张牌，手上有五张牌。"
date: "2026-06-12T05:45:26+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1097
codeforces_index: "A"
codeforces_contest_name: "Hello 2019"
rating: 800
weight: 1097
solve_time_s: 77
verified: true
draft: false
---

[CF 1097A - 根纳迪和纸牌游戏](https://codeforces.com/problemset/problem/1097/A)

 **评分：** 800
 **标签：** 暴力破解、实施
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 根纳迪玩的游戏涉及按等级或花色匹配牌。 实际上，桌上有一张牌，手上有五张牌。 每张牌由两个字符表示：第一个字符是等级，可以是从 2 到 9 的数字或 T、J、Q、K、A 的字母。第二个字符是花色，可以是 D、C、S 或 H 之一。任务是确定您手中的至少一张牌是否与桌牌共享等级或花色。 如果存在这样的卡，则可以打它，并且输出应该为“YES”。 否则，输出应为“NO”。 

限制很小。 您只有一张桌牌和五张手牌。 这意味着任何单独检查每张卡的算法都足够快。 不需要高级数据结构、散列或排序。 由于输入大小固定，问题本质上是恒定时间，主要挑战是仔细实现而不是算法效率。 

非明显的边缘情况包括手牌包含仅按花色或仅按等级与桌牌匹配的牌的情况。 例如，如果桌牌是 9H，你的手牌是 2H 3D 4S 5C 6D，那么你可以打 2H，因为它与花色相匹配。 另一个微妙的情况是手上有多张可以打的牌； 你仍然只需要输出一次“YES”，并且无论是哪张卡。 粗心的实现可能会错误地要求等级和花色都匹配，这在这些示例中会失败。 

## 方法

 最直接的方法是暴力破解：遍历手中的每张牌，检查其等级是否与桌牌等级匹配或其花色是否与桌牌花色匹配。 由于只有五张卡，因此这实际上是恒定数量的操作。 暴力方法可以保证正确，因为它会详尽地检查所有可能性，并且对于给定的输入，其运行时间可以忽略不计。 

就渐近复杂性而言，没有更快的方法，因为暴力方法已经检查了所有卡一次。 允许立即做出决定的观察结果是，一旦找到匹配的卡，您就可以返回“YES”。 一旦发现有效的走法，就无需检查剩余的牌。 这个小的提前退出是一个小的优化，但澄清了逻辑：一旦存在匹配，你就完成了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 有效 O(5) → O(1) | O(1) | O(1) | 已接受 |
 | 最佳| 有效 O(5) → O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读桌牌和五张手牌。 每个字符串的第一个字符是等级，第二个字符是花色。 
2. 为了清楚起见，将牌桌牌中的等级和花色提取到单独的变量中。 
3. 迭代你手中的每张牌。 
4. 对于每张手牌，提取其点数和花色。 
5. 检查牌号是否与桌牌的牌号相符或花色是否与桌牌的花色相符。 
6. 如果发现匹配，立即打印“YES”并停止程序。 
7. 如果循环完成后没有找到任何匹配项，则打印“NO”。 

该算法之所以有效，是因为不变量很简单：只有当一张牌与桌牌的点数或花色匹配时，我们才可以打出该牌。 通过单独检查每张手牌并在成功匹配后立即返回，我们保证不会遗漏任何有效的牌，也不会触发“是”的无效牌。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

table_card = input().strip()
hand_cards = input().strip().split()

table_rank = table_card[0]
table_suit = table_card[1]

for card in hand_cards:
    if card[0] == table_rank or card[1] == table_suit:
        print("YES")
        break
else:
    print("NO")
```该代码首先读取牌桌并将手牌分成一个列表。 它显式地存储了桌牌的点数和花色，从而避免了重复索引。 循环依次检查每张手牌。 使用`else`for 循环上的子句确保仅当没有卡片匹配时才打印“NO”，这是一种微妙但干净的 Python 方法。 

## 工作示例

 **样品1**

 输入：```
AS
2H 4C TH JH AD
```| 步骤| 卡| 排名匹配？ | 西装搭配？ | 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 2小时 | 没有 | 是（H）| 打印是，停止|

 这表明花色匹配是足够的，确认算法正确识别可玩的牌。 

**样品2**

 输入：```
4D
5H 6S 7C 8H 9S
```| 步骤| 卡| 排名匹配？ | 西装搭配？ | 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 5小时| 没有 | 没有 | 继续 |
 | 2 | 6S | 没有 | 没有 | 继续 |
 | 3 | 7C| 没有 | 没有 | 继续 |
 | 4 | 8H | 没有 | 没有 | 继续 |
 | 5 | 9S | 没有 | 没有 | 继续 |
 | 结束 | - | - | - | 打印号码 |

 此处，没有卡片匹配，说明 else 子句正确触发。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(5) → O(1) | 总是有五张牌，每张检查一次。 |
 | 空间| O(1) | O(1) | 仅使用了一些字符串变量和手牌列表。 |

 考虑到卡的数量是固定的，该算法的运行时间和内存可以忽略不计，很容易满足 1 秒和 256 MB 的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    table_card = input().strip()
    hand_cards = input().strip().split()
    table_rank = table_card[0]
    table_suit = table_card[1]
    for card in hand_cards:
        if card[0] == table_rank or card[1] == table_suit:
            return "YES"
    return "NO"

# Provided samples
assert run("AS\n2H 4C TH JH AD\n") == "YES", "sample 1"
assert run("4D\n5H 6S 7C 8H 9S\n") == "NO", "sample 2"

# Custom cases
assert run("9H\n9D 2C 3S 4D 5C\n") == "YES", "rank match only"
assert run("KH\n2H 3H 4H 5H 6H\n") == "YES", "suit match multiple"
assert run("TD\n2C 3S 4H 5C 6S\n") == "NO", "no match at all"
assert run("AS\nAD 2D 3D 4D 5D\n") == "YES", "rank match with first card"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 9H\n9D 2C 3S 4D 5C | 是 | 仅限排名赛|
 | KH\n2H 3H 4H 5H 6H | 是 | 多张牌搭配花色|
 | TD\n2C 3S 4H 5C 6S | 否 | 没有一张牌与等级或花色相匹配 |
 | AS\nAD 2D 3D 4D 5D | 是 | 第一张牌匹配排名 |

 ## 边缘情况

 对于只有西装匹配的情况，`table_card = 7C`和`hand_cards = 2C 3H 4S 5D 6H`，第一手牌有花色搭配。 循环立即识别它，打印“YES”并退出。 对于仅排名匹配的情况，`table_card = 5D`和`hand_cards = 5H 2S 3C 4H 6S`，第一张牌按等级匹配，同样触发“YES”。 对于没有匹配的手牌，循环在没有找到匹配的情况下完成，并且`else`子句正确打印“NO”。 这证实了该算法可以正确处理所有非明显的边缘情况。
