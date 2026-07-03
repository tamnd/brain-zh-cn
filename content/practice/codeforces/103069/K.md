---
title: "CF 103069K - 阿林"
description: "我们得到了一个简化的单挑德州扑克情况，只有两名玩家并且没有弃牌。 每个测试用例提供五张牌：两张代表狼鸡的私人牌和三张代表翻牌的共享公共牌。"
date: "2026-07-04T01:01:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103069
codeforces_index: "K"
codeforces_contest_name: "2020 ICPC Asia East Continent Final"
rating: 0
weight: 103069
solve_time_s: 46
verified: true
draft: false
---

[CF 103069K - Allin](https://codeforces.com/problemset/problem/103069/K)

 **评级：** -
 **标签：** -
 **Solve time:** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个简化的单挑德州扑克情况，只有两名玩家并且没有弃牌。 每个测试用例提供五张牌：两张代表狼鸡的私人牌和三张代表翻牌的共享公共牌。 Two more community cards and the opponent’s two private cards are still unknown.

 The question is not to simulate an actual poker game, but to decide something stronger: whether Wolf Chicken can guarantee a win regardless of how the remaining four cards are chosen from the unseen deck. If there exists even one possible completion of the board and opponent hand that allows the opponent to tie or beat Wolf Chicken, then Wolf Chicken must not go all-in. Only if Wolf Chicken’s current information already forces a strict win in every possible future state should we answer that he can all-in.

 This transforms the problem into a worst-case dominance check over all completions of a 7-card poker evaluation problem.

 The constraints are extremely large, up to 100000 test cases. Each test case is constant-sized input, so the solution must be O(1) per case after preprocessing. Any attempt to enumerate possible community cards or opponent hands is immediately impossible because there are tens of thousands of combinations even for a single test case.

 The key difficulty is not evaluating poker hands, but reasoning about certainty under adversarial completion of hidden information.

 A few subtle edge cases illustrate why naive reasoning fails. If Wolf Chicken already has a strong made hand like a straight or flush from the flop plus hole cards, it is still not automatically winning because the opponent may form an even stronger hand depending on unknown cards. For example, having a flush draw or even a completed flush does not guarantee victory if a straight flush is still possible for the opponent with remaining cards.

 Another edge case is full house vs potential four of a kind. 即使狼鸡目前持有三条，剩余的未知牌也可能让对手完成四边形，这严格击败了葫芦。 So local evaluation of current strength is insufficient.

 The real challenge is to recognize when the visible cards already force a “locked” strongest possible poker configuration that cannot be overtaken by any completion of the remaining cards.

 ## 方法

 A direct brute force solution would attempt to simulate all possible outcomes of the remaining two community cards and all possible opponent hole cards drawn from the remaining deck. For each completion, we would evaluate both players’ best five-card hands over seven cards and check if Wolf Chicken always wins.

 This approach is conceptually correct but completely infeasible. After removing five known cards, there are 47 unknown cards. We must choose 4 of them for the opponent and future community, leading to combinatorial explosion on the order of hundreds of millions of cases per test. Even with aggressive pruning, evaluating poker strength for each configuration is far beyond any reasonable limit.

 The key observation is that “certainty of winning” is extremely rare in poker and only happens when Wolf Chicken already has a maximal structure that cannot be broken by any future draw. The only way to guarantee a win is to already hold a royal flush, and more importantly, ensure that no unknown card configuration can create an equal or higher-ranked royal flush for the opponent.

 However, since suits are not shared and cards are unique, if Wolf Chicken already has a royal flush formed entirely from known cards (hole + flop), then no future cards can improve the opponent’s hand beyond that level, because a royal flush is the absolute maximum hand type and is defined on a specific suit structure that cannot be replicated without the exact missing cards.

因此，问题归结为检查狼鸡是否已经使用他的两张底牌加上三张翻牌牌完成了皇家同花顺。 

如果是，答案是“allin”。 否则，答案是“过牌”，因为在所有其他情况下，至少存在一种完成情况，对手可以匹配或击败可能最好的一手牌。 

This reduction is powerful because it avoids reasoning about all hand classes. Instead, we identify that only the absolute top hand has a certainty property under adversarial completion.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 所有完成的暴力枚举 | O(C(47,4) × 评估) | O(1) | O(1) | 太慢了 |
 | 仅检查现有的皇家同花顺 | 每次测试 O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 We reduce each test case to checking whether the five visible cards already form a royal flush.

 1. 将每张牌的等级转换为数字刻度，其中“十”、“杰克”、“皇后”、“国王”、“A”依次对应于连续的高值。 This allows direct comparison and pattern matching without string logic. This step is necessary because we only care about exact rank structure, not suit interactions beyond equality.
 2. 将五张给定的牌按花色分组。 A royal flush must lie entirely within a single suit, so any candidate solution must have all five cards sharing the same suit.
 3. For each suit group, collect the ranks present and check whether the set contains exactly Ten, Jack, Queen, King, Ace. 这验证了完整性和精确结构。 
4. 如果任何花色满足此条件，则立即输出“allin”，因为玩家已经持有可能最强的扑克牌，并且未来的组合无法超越它。 
5. 如果没有花色满足条件，则输出“check”，因为当前配置不会强制在任何隐藏牌完成的情况下保证获胜。 

The reason this is sufficient is that poker hand rankings are strictly ordered, and royal flush is the unique maximal element. 任何尚未成为皇家同花顺的手牌都可以通过隐藏牌的对抗性完成来改进或匹配，因此它不能保证严格获胜。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

RANK_MAP = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
    '7': 7, '8': 8, '9': 9, 'T': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
}

ROYAL = {10, 11, 12, 13, 14}

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        parts = input().split()
        suits = {}
        ranks_by_suit = {}

        for card in parts:
            r = RANK_MAP[card[0]]
            s = card[1]
            if s not in ranks_by_suit:
                ranks_by_suit[s] = set()
            ranks_by_suit[s].add(r)

        ok = False
        for s in ranks_by_suit:
            if ranks_by_suit[s] == ROYAL:
                ok = True
                break

        out.append("allin" if ok else "check")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```The code first encodes ranks so comparisons are consistent and fast. It then aggregates cards by suit using sets to avoid duplication issues and to allow direct equality checking against the royal flush requirement. The final check is a simple set comparison, which captures both presence and completeness of the required five ranks.

 A subtle point is that we do not need to ensure ordering or continuity explicitly, because the royal flush condition fully determines both.

 ## 工作示例

 Consider a case where all five visible cards form a royal flush in hearts.

 | 步骤| 心集|
 | ---| ---|
 | 流程卡| {10、J、Q、K、A} |
 | 检查状况 | 等于皇家|
 | 结果 | 阿林 |

 This demonstrates the winning condition is detected purely by set equality.

 Now consider a mixed-suit case where only part of a royal structure exists.

 | 步骤| 铲子套装|
 | ---| ---|
 | 流程卡| {10，J，Q，A}|
 | 检查状况 | 缺少K |
 | 结果 | 检查 |

 This shows that incomplete structures cannot qualify even if they look close to a royal flush.

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(T)| Each test processes exactly 5 cards with constant-time operations |
 | 空间| O(1) | O(1) | Only fixed-size maps and sets are used per test |

 The solution easily fits within limits since even 100000 test cases only involve a few hundred thousand constant operations.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("""2
AC KC QC JC TC
AC TD 8S 5H 2C
""") == """allin
check"""

# already a royal flush
assert run("""1
AH KH QH JH TH
""") == "allin"

# almost royal but missing one card
assert run("""1
AH KH QH JH 9H
""") == "check"

# mixed suits cannot form royal flush
assert run("""1
AS KH QH JH TH
""") == "check"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 皇家同花顺 | 阿林 | 阳性检测|
 | 缺少排名 | 检查 | 差点被拒 |
 | 混合套装| 检查 | 诉讼约束执行|

 ## 边缘情况

 一个关键的边缘情况是所有五张牌都有正确的等级，但分散在不同的花色中。 例如，有 10 到 A 存在，但不是单一花色。 

输入：```
AH KH QH JS TS
```尽管存在所有必需的等级，但它们并不是按花色统一的，因此不存在皇家同花顺。 该算法正确地按花色分组，但未通过相等性检查，产生“检查”。 

另一个边缘情况是存在多个部分皇家模式的花色之间类似重复的等级分布。 即使如此，由于没有任何一种花色包含所有五个必需的等级，因此不会发生误报。
