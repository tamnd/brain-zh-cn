---
title: "CF 1380B - 通用解决方案"
description: "我们得到一个描述石头剪刀布游戏中循环对手策略的字符串。 对手不适应； 相反，他们根据固定的圆弦来选择移动。 如果它们从某个位置开始，它们就会按顺序跟随字符串并永远环绕。"
date: "2026-06-16T13:39:17+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1380
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 91 (Rated for Div. 2)"
rating: 1400
weight: 1380
solve_time_s: 304
verified: false
draft: false
---

[CF 1380B - Universal Solution](https://codeforces.com/problemset/problem/1380/B)

 **评分：** 1400
 **标签：** 贪婪
 **求解时间：** 5m 4s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个描述石头剪刀布游戏中循环对手策略的字符串。 对手不适应； 相反，他们根据固定的圆弦来选择移动。 如果它们从某个位置开始，它们就会按顺序跟随字符串并永远环绕。 

We must construct our own length n sequence of moves. The catch is that we do not know the opponent’s starting position. 对于对手的每一个可能的起始动作，我们进行 n 轮并计算我们的动作击败他们的次数。 每个班次都会产生不同的获胜次数，我们关心所有班次中这些获胜次数的平均值。 

So the task is not to maximize performance against a single alignment. Instead, we are optimizing the total number of wins aggregated over all cyclic alignments of the opponent string.

 The constraint n up to 200000 across all test cases implies we need a linear or near-linear construction per test. 任何显式模拟所有移位的方法都需要 O(n^2)，这太慢了，因为在最坏的情况下将达到大约 4e10 次操作。 

当对手的字符串均匀时，会出现微妙的边缘情况。 For example, if the string is "RRRR", then any position is equivalent. 一种天真的贪婪策略，改变每个位置的移动可能看起来合理，但它没有帮助，因为每个位置在所有班次中都是对称的，所以只有总频率才重要。 

Another corner case is when the string is balanced like "RSP". 在这里，我们移动的不同选择对不同的轮班影响不均匀，但同样，重要的是所有轮换的总贡献，而不是每个轮班的优化。 

## 方法

 A brute-force construction tries every possible candidate sequence of our moves. For each candidate, it simulates all n cyclic shifts of the opponent string, computes win counts, and averages them. 每次模拟的成本为 O(n)，并且候选序列的数量呈指数级增长，这使得这完全不可行。 

We can reduce this drastically by observing how each position in our sequence contributes to the global score. 修复序列中的位置 i。 As the opponent shift varies, the character aligned with position i cycles through every character of the opponent string exactly once. 这意味着位置 i 的贡献仅取决于它可以在整个字符串中击败多少个对手字符，而不取决于位置特定的对齐方式。 

这将问题解耦：我们答案中的每个位置都可以独立选择，我们只需要最大化它击败的对手字符串中的字符数即可。 由于所有位置在循环移位下表现相同，因此每个位置的最佳选择都是相同的。 

因此，问题简化为计算对手字符串中 R、S 和 P 的频率，并选择击败最频繁目标的着法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n · n^2) | O(2^n · n^2) | O(n) | 太慢了|
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 ### 关键思想

 我们为答案中的所有位置选择单一的移动，基于该移动在对手串中产生最多的总胜利。 

### 步骤

 1. Count how many times each character R, S, and P appears in the opponent string.

 目标是评估每个可能的动作相对于对手动作的完整分布的总体有效性。 
2. 计算每一步可能的获胜次数：

 如果我们玩R，我们就能赢S。 

如果我们玩S，我们就能赢P。 

如果我们玩P，我们就能赢R。 

其中每一个都对应于对手字符串中的特定频率。 
3. 比较三个值：

 wins(R) = 字符串中 S 的计数，

 胜利（S）= P 的计数，

胜利(P) = R 的计数。 
4. 选择获胜值最大的着法。 如果出现平局，则任何平局的棋步均有效。 
5.输出重复n次的移动以形成最终答案。 

### 为什么它有效

 For any fixed position in our sequence, across all cyclic shifts of the opponent string, it interacts once with every character in the opponent string. 因此，它的总贡献仅取决于对手符号的全局频率，而不取决于它们的顺序。 Since every position has identical behavior under averaging over shifts, choosing the same optimal move everywhere preserves optimality and maximizes the total sum of wins.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    s = input().strip()
    n = len(s)

    cntR = cntS = cntP = 0
    for ch in s:
        if ch == 'R':
            cntR += 1
        elif ch == 'S':
            cntS += 1
        else:
            cntP += 1

    # wins if we choose each move
    winR = cntS
    winS = cntP
    winP = cntR

    if winR >= winS and winR >= winP:
        best = 'R'
    elif winS >= winP:
        best = 'S'
    else:
        best = 'P'

    print(best * n)

if __name__ == "__main__":
    t = int(input())
    for _ in range(t):
        solve()
```计数步骤将字符串分成三个累加器，这是对手需要的唯一信息。 比较直接评估了三种可能的策略。 

关键的实施细节是必须一致地处理关系。 任何平局都是正确的，因此代码只是按照条件顺序优先选择 R，然后是 S，然后是 P。 

## 工作示例

 ### 示例 1：`RSP`我们计算频率：R = 1、S = 1、P = 1。 

| 候选人变动 | 节拍| 总胜利 |
 | --- | --- | --- |
 | 右 | S | 1 |
 | S | 普 | 1 |
 | 普 | 右 | 1 |

 所有动作都是等效的，因此任何统一的字符串都是最佳的。 假设我们选择“R”。 

对于每次轮换，每个位置都会恰好看到每个对手角色一次，因此每次轮班在每个完整周期中都会产生一次胜利，从而产生统一的行为。 

### 示例 2：`RRRR`频率：R = 4，S = 0，P = 0。 

| 候选人变动 | 节拍| 总胜利 |
 | --- | --- | --- |
 | 右 | S | 0 |
 | S | 普 | 0 |
 | 普 | 右 | 4 |

 最好的移动是 P，因此输出是“PPPP”。 

这证实了即使对手从未玩过 S 或 P，选择 P 也利用了 P 在每种排列中都击败 R 的事实。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个测试用例扫描字符串一次以计算频率 |
 | 空间| O(1) | O(1) | 无论输入大小如何，仅使用三个计数器 |

 测试用例的总输入大小以 2e5 为界，因此每个测试用例的线性扫描在时间限制下很容易足够快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def solve():
        s = input().strip()
        cntR = cntS = cntP = 0
        for ch in s:
            if ch == 'R':
                cntR += 1
            elif ch == 'S':
                cntS += 1
            else:
                cntP += 1

        winR = cntS
        winS = cntP
        winP = cntR

        if winR >= winS and winR >= winP:
            best = 'R'
        elif winS >= winP:
            best = 'S'
        else:
            best = 'P'

        return best * len(s)

    t = int(sys.stdin.readline())
    out = []
    for _ in range(t):
        s = sys.stdin.readline().strip()
        cntR = s.count('R')
        cntS = s.count('S')
        cntP = s.count('P')

        winR = cntS
        winS = cntP
        winP = cntR

        if winR >= winS and winR >= winP:
            out.append('R' * len(s))
        elif winS >= winP:
            out.append('S' * len(s))
        else:
            out.append('P' * len(s))

    return "\n".join(out) + "\n"

# provided samples
assert run("3\nRRRR\nRSP\nS\n") == "PPPP\nRSP\nR\n"

# all same character
assert run("1\nSSSSS\n") == "PPPPP\n"

# skewed distribution
assert run("1\nRRSS") == "PPPP\n"

# single char
assert run("1\nR\n") == "P\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | RRRR | RRRR | 点对点 | 对抗统一的对手，最大化胜利 |
 | 退休储蓄计划 | 任何最佳的统一选择| 均衡分配处理|
 | RSS | PPP | 频率偏差正确性 |
 | S | 右 | 最小输入正确性 |

 ## 边缘情况

 对于像“R”这样的单字符字符串，对手在每个班次中总是打R。 该算法计数 R = 1 并选择 P，因为 P 击败 R。输出变为“P”，这在每次评估中都保证获胜。 

对于像“RRRRRR”这样的统一字符串，每个班次都是相同的。 该算法正确地识别出只移动击败 R 的物质，因此它为所有位置选择 P。 由于每个排列都是相同的，因此这种选择可以同时最大化所有获胜计数。 

对于高度混合的字符串（例如“RSPRSP”），所有频率都是相等的。 R、S 或 P 中的任何一个都是最优的，并且打破平局规则会产生有效的统一答案。
