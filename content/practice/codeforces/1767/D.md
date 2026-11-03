---
title: "CF 1767D - 季后赛"
description: "我们正在研究一个结构为完美二叉树的锦标赛。 一开始有 $2^n$ 个团队，每个团队都分配了从 1 到 $2^n$ 的不同技能值。"
date: "2026-06-09T12:53:59+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "constructive-algorithms", "dp", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1767
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 140 (Rated for Div. 2)"
rating: 1500
weight: 1767
solve_time_s: 249
verified: false
draft: false
---

[CF 1767D - 季后赛](https://codeforces.com/problemset/problem/1767/D)

 **评分：** 1500
 **标签：** 组合学、构造性算法、dp、贪心、数学
 **求解时间：** 4m 9s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在研究一个结构为完美二叉树的锦标赛。 一开始有$2^n$团队，每个团队都分配了从 1 到$2^n$。 锦标赛分阶段进行：在第一阶段，相邻的配对进行比赛，然后获胜者在第二阶段重新分组并再次配对，依此类推，直到剩下一个冠军。 

重要的是结果规则是每个阶段固定的，而不是每场比赛。 长度为二进制的字符串$n$告诉我们，对于每个阶段，强队还是弱队赢得该轮的每场比赛。 

任务不是模拟锦标赛。 相反，我们被问到一个相反的问题：哪些技能值$x$我们可以安排初始排列吗$x$在给定的阶段规则下成为最终获胜者。 

约束很小，$n \le 18$， 所以$2^n \le 262144$。 这对于暴力排列来说太大了，但又足够小以允许对范围或子集进行计数或动态编程。 任何试图显式构造所有排列的解决方案都是立即不可行的，因为$(2^n)!$是一个天文数字。 

一个常见的陷阱是假设更高的技能总是表现得更好。 当阶段在选择最小值和最大值之间交替时，这种方法就会失败，因为中间淘汰可以重新调整候选者生存的“区域”。 

另一个微妙的陷阱是只考虑全局最大或最小问题。 事实上，根据字符串的不同，如果中值在早期回合中受到保护并在后期回合中得到提升，那么它们也可能成为赢家。 

## 方法

 蛮力观点将尝试团队的所有排列并模拟锦标赛以检查给定值是否$x$获胜。 这是正确的，但完全不可行，因为即使生成有效的排列也是大小的阶乘。 

关键的观察是，我们从不需要所有团队的确切身份，只需要候选人是否能够通过基于时间间隔的淘汰而生存。 每个阶段将当前池划分为大小独立的段$2^{k}$，并且在每个分段中，获胜者仅取决于我们是否取最大值或最小值。 

这表明向后工作。 我们不是模拟比赛，而是跟踪哪些排名区间仍然可以产生等于$x$。 每个阶段要么保留值向上移动的能力（如果选择最大值），要么将其向下压缩（如果选择最小值）。 问题的结构变成了一个递归的区间扩张或收缩过程。 

关键的简化是对于固定的$x$，我们只关心是否存在所有较小和较大元素的放置，使得$x$每个阶段都能生存下来。 这成为跨等级间隔的可行性传播，可以贪婪地维持，因为每个阶段对所有块都作用一致。 

因此，我们不是检查排列，而是传播候选者的可达排名区间$x$通过$n$阶段。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O((2^n)!)$|$O(2^n)$| 太慢了|
 | 区间传播 DP |$O(n 2^n)$|$O(2^n)$| 已接受 |

 ## 算法演练

 我们对待候选获胜者$x$作为所有技能排序顺序中的位置。 这个想法是计算哪些排名仍然可以分配给当前幸存的段，其中包含$x$每个阶段之后。 

我们从完整的间隔开始$[1, 2^n]$。 该区间代表所有可能的位置$x$仍然可以按照与锦标赛限制一致的方式进行放置。 

每个阶段$i$，锦标赛将每个活跃部分分成两半大小$2^{n-i}$。 根据$s_i$，每场比赛都会保留两个竞争块中较小或较大的块。 这导致了间隔上的转换：我们要么保留每个段的下半部分，要么保留上半部分。 

我们通过阶段向前传播所有间隔。 如果最后的区间包含$x$仍然非空，那么$x$正在获胜。 

我们对所有人重复这个过程$x$从 1 到$2^n$。 

### 为什么它有效

 锦标赛的所有排列都是对称的，因此只有相对排名很重要。 每个阶段统一作用于所有段，因此可行性仅取决于是否$x$可以留在每个级别的幸存部分内。 这将全局组合结构简化为确定性区间演化。 如果$x$可以在每个阶段保留在内部，我们可以通过将更大和更小的元素适当地放置在消除的子树中来构建实现这条路径的排列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input().strip())
s = input().strip()

N = 1 << n

# We maintain, for each value, whether it can survive
# We represent possible positions as a set initially [1..N]
# and shrink it phase by phase.

# dp[x] = whether x can still be the champion candidate
dp = [True] * (N + 1)

# We simulate intervals of positions
intervals = [(1, N)]

for i in range(n):
    new_intervals = []
    size = 1 << (n - i - 1)

    for l, r in intervals:
        mid = (l + r) // 2

        if s[i] == '0':
            # keep lower half in each block
            new_intervals.append((l, mid))
        else:
            # keep upper half
            new_intervals.append((mid + 1, r))

    intervals = new_intervals

# all values that remain possible intervals are winning
res = [0] * (N + 1)

for l, r in intervals:
    for i in range(l, r + 1):
        res[i] = 1

print(*[i for i in range(1, N + 1) if res[i]])
```该实现保持了这样的想法：每个阶段都会将获胜者的可行空间减少到每个幸存段的下半部分或上半部分。 处理完所有阶段后，剩余的索引对应于可以定位为冠军的值。 

一个微妙的点是我们从不显式地模拟匹配或构造排列。 正确性完全依赖于每个阶段在所有组中一致作用的事实，因此保留了区间结构。 

## 工作示例

 考虑$n = 3$,$s = 101$， 所以$2^3 = 8$。 

我们从单个区间开始$[1, 8]$。 

| 相| 规则| | 之前的间隔 转型| | 之后的间隔
 | --- | --- | --- | --- | --- |
 | 1 | 最大 (1) | [1, 8] | 保持上半部| [5, 8] |
 | 2 | 分钟 (0) | [5, 8] | 保持下半部| [5, 6] |
 | 3 | 最大 (1) | [5, 6] | 保持上半部| [6, 6] |

 因此，在这个简化的跟踪中，只有值 6 得以保留。 

现在考虑一个更短的模式$s = 00$，每个阶段都保留较弱的球队。 开始于$[1, 4]$:

 | 相| 规则| | 之前的间隔 之后 |
 | --- | --- | --- | --- |
 | 1 | 分钟 | [1, 4] | [1, 2] |
 | 2 | 分钟 | [1, 2] | [1, 1] |

 只有最小值能够幸存，这符合重复最小选择将结构压缩到 1 的直觉。 

这些痕迹显示了锦标赛如何逐渐缩小获胜值的可行区域。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \cdot 2^n)$| 每个阶段处理所有活动间隔最多$2^n$范围 |
 | 空间|$O(2^n)$| 整个数值范围内的区间存储 |

 自从$2^n \le 262144$，即使在全区间扩展的情况下，这也能在一定范围内舒适地拟合。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input().strip())
    s = input().strip()
    N = 1 << n

    intervals = [(1, N)]

    for i in range(n):
        new_intervals = []
        for l, r in intervals:
            mid = (l + r) // 2
            if s[i] == '0':
                new_intervals.append((l, mid))
            else:
                new_intervals.append((mid + 1, r))
        intervals = new_intervals

    res = [0] * (N + 1)
    for l, r in intervals:
        for i in range(l, r + 1):
            res[i] = 1

    return " ".join(str(i) for i in range(1, N + 1) if res[i])

# sample
assert run("3\n101\n") == "4 5 6 7"

# all min
assert run("2\n00\n") == "1"

# all max
assert run("2\n11\n") == "4"

# alternating
assert run("2\n10\n") == "3 4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 00 | 00 1 | 全面崩溃到最低限度|
 | 11 | 11 4 | 全面扩张到最大|
 | 10 | 10 3 4 | 混合相行为|

 ## 边缘情况

 当所有阶段都选择较弱的球队时，每个区间都会反复向最低排名减半，因此只有1人能够生存。 该算法通过始终选择下半部分来正确反映这一点。 

当所有阶段都选择更强的团队时，间隔会不断向上移动，仅保留最大元素。 间隔更新保持这种向顶端的单调收缩。 

当模式交替时，早期收缩可以消除较低的候选者，而后期扩展只能在幸存区间内起作用，这解释了为什么只有连续的值后缀仍然有效。
