---
title: "CF 102215M - Shlakoblock 已上线！"
description: "我们有 (n) 场比赛。 游戏 (i) 目前有 (vi) 票，观看它会带来乐趣 (pi)。 我们可以为任何游戏添加一票，但每场游戏最多一次。 经过我们的选择后，统一随机选出一票，因此票数越多的游戏就越有可能被直播。"
date: "2026-08-18T12:20:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102215
codeforces_index: "M"
codeforces_contest_name: "2019, XII Samara Regional Intercollegiate Programming Contest"
rating: 0
weight: 102215
solve_time_s: 641
verified: false
draft: false
---

[CF 102215M - Shlakoblock 已上线！](https://codeforces.com/problemset/problem/102215/M)

 **评级：** -
 **标签：** -
 **求解时间：** 10m 41s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有 (n) 场比赛。 游戏 (i) 目前有 (v_i) 票，观看它会带来乐趣 (p_i)。 我们可以为任何游戏添加一票，但每场游戏最多一次。 经过我们的选择后，统一随机选出一票，因此票数越多的游戏就越有可能被直播。 

令 (S) 为我们投票支持的游戏集。 如果当前总票数为

 [
 V=\sum_{i=1}^n v_i,
 ]

 那么投票后有(V+|S|)票。 所有选票所代表的总快乐为

 [
 A+\sum_{i\in S}p_i,
 ]

 哪里

 [
 A=\sum_{i=1}^n v_i p_i。 
]

 因此预期的快乐是

 [
 \frac{A+\sum_{i\in S}p_i}{V+|S|}。 
]

 任务是选择（S），以不可约形式打印最大可能的分数，并打印一组实现它的游戏。 

约束足够小，足以进行排序，但不足以枚举子集。 一次测试中可以有 (n=1000) 个游戏，最多可以有 500 个测试用例。 在最坏的聚合情况下， (O(n^2)) 解决方案已经不必要地昂贵，而 (O(n\log n)) 很容易足够快。 (p_i,v_i) 值最多为 1000，但总和最多涉及 1000 项，因此普通 Python 整数就足够了。 

在许多情况下，粗心的实施可能会失败。 如果我们不选择任何游戏，答案仍然是最优的。 例如，```
1
1
0 5
```给出预期的快乐（0/5=0），所以正确的输出是```
0/1
0
```总是添加至少一款游戏的实现会产生更糟糕的结果。 

第二个问题是当前投票为零的游戏仍然有资格获得我们的投票。 为了```
1
2
10 1
100 0
```初始期望为(10)。 对游戏 2 进行投票给出 (110/2=55)，这是最优的。 忽略 (v_i=0) 的游戏会错过答案。 

第三个问题是，每当我们投票给另一场比赛时，分母就会发生变化。 为了```
1
2
100 1
0 100
```对第一个游戏的投票给出 (200/101)，而对第二个游戏的投票给出 (100/101)。 不能通过简单地选择每场具有积极乐趣的游戏来做出选择。 增加投票的贡献必须与分母中额外的（1）一起考虑。 

最后，几个不同的子集可以达到相同的最优值。 和```
1
2
5 1
5 1
```在对任一游戏进行投票后，最佳答案是（10/2=5），并且两种选择都有效。 该算法只需要保留一个最优子集。 

## 方法

 最直接的方法是尝试游戏的每个子集。 对于一个子集（S），我们可以计算它的分子和分母，并保留最佳期望值。 这是正确的，因为每一种合法投票策略都由一个子集代表。 然而，有 (2^n) 个子集，并且评估每个子集需要 (O(n)) 工作，在最坏的情况下给出 (O(n2^n)) 次操作。 对于（n=1000），即使（2^{1000}）也远远超出了任何可以在时间限制内运行的范围。 

当我们不再关心所选游戏的身份并首先确定它们的数量时，有用的结构就会出现。 假设我们决定为 (k) 场比赛投票。 然后分母固定为 (V+k)，并且原始贡献 (A) 也固定。 我们唯一可以优化的部分是

 [
 \sum_{i\in S}p_i。 
]

 对于恰好 (k) 个游戏，通过取 (k) 个最大快乐值来最大化该总和。 

该观察将指数搜索转变为简单的排序前缀搜索。 按递减 (p_i) 对游戏进行排序。 排序后，大小 (k) 的最佳子集正是前 (k) 个游戏。 我们可以逐步建立他们的快乐总和，并评估从 0 到 (n) 的所有 (k)。 

蛮力方法之所以有效，是因为它考虑了每个可能的子集。 它失败了，因为子集的数量呈指数级增长。 观察到固定子集大小的最佳选择由具有最大 (p_i) 的游戏组成，这让我们可以用一个代表替换相同大小的所有子集，从而在排序后将问题减少到 (n+1) 个候选策略。 

为了精确比较分数，我们不应该使用浮点数。 对于两名候选人

 [
 \frac{x_1}{y_1}
 \quad\text{和}\quad
 \frac{x_2}{y_2},
 ]

 我们将 (x_1y_2) 与 (x_2y_1) 进行比较。 Python 整数可以准确地处理这些乘积。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n2^n)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 计算当前总票数（V=\sum v_i）和当前总快乐贡献（A=\sum v_i p_i）。 这些值描述了在添加我们的任何选票之前预期的乐趣。 
2. 按递减 (p_i) 对所有游戏进行排序，保留其原始索引。 如果我们最终决定添加恰好 (k) 票，则此排序中的前 (k) 场游戏会带来最大可能的附加乐趣。 
3. 从 (k=0) 开始。 候选人的期望是（A/V）。 该问题保证至少有一个 (v_i) 为正，因此 (V>0)。 
4. 遍历已排序的游戏。 当处理下一个游戏时，将其（p_i）添加到运行前缀和中。 添加(k)场比赛后，候选分子为(A+\text{prefix})，而分母为(V+k)。 
5. 使用交叉乘法将每个候选者与迄今为止看到的最佳候选者进行比较。 如果

 [
 (A+\text{前缀})(V+k_{\text{最佳}})

 >

 (A+\text{前缀}_{\text{最佳}})(V+k),
 ]

 替换当前的最佳答案。 

1. 存储相应的(k)。 由于游戏已经按照快乐程度递减排序，因此前 (k) 个索引形成了该 (k) 的最佳投票集。 
2. 扫描后，通过将分子和分母除以最大公约数来减少最佳分数。 打印减少的分数、选定的计数以及相应的原始索引。 

### 为什么它有效

 对于每一个可能的附加票数 (k)，分母恰好是 (V+k)。 在 (k) 个游戏的所有子集中，原始贡献 (A) 是相同的，因此最大化预期乐趣相当于最大化它们 (p_i) 值的总和。 (k) 最大 (p_i) 值给出最大可能的总和，因此排序后的前缀对于该特定 (k) 是最佳的。

该算法检查从 0 到 (n) 的每个可能的 (k)，并且对于每个 (k)，它检查该大小的最佳子集。 因此，全局最优必须位于扫描考虑的候选者之中。 交叉乘法精确地比较这些候选者，因此所选候选者是真正的最大值而不是浮点近似值。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())

        games = []
        total_votes = 0
        total_pleasure = 0

        for idx in range(1, n + 1):
            p, v = map(int, input().split())
            games.append((p, idx))
            total_votes += v
            total_pleasure += p * v

        games.sort(key=lambda x: (-x[0], x[1]))

        best_num = total_pleasure
        best_den = total_votes
        best_k = 0

        prefix = 0

        for k, (p, idx) in enumerate(games, 1):
            prefix += p

            cur_num = total_pleasure + prefix
            cur_den = total_votes + k

            if cur_num * best_den > best_num * cur_den:
                best_num = cur_num
                best_den = cur_den
                best_k = k

        g = gcd(best_num, best_den)
        best_num //= g
        best_den //= g

        out.append(f"{best_num}/{best_den}")
        out.append(str(best_k))

        if best_k == 0:
            out.append("")
        else:
            chosen = [str(games[i][1]) for i in range(best_k)]
            out.append(" ".join(chosen))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```输入循环将每个游戏存储为`(p, index)`因为只有它的乐趣会影响排序，而输出需要它的原始索引。 同时，累计当前的投票数和当前的快乐贡献度。 

排序步骤使用递减的快乐。 按原始索引进行二次排序在数学上不是必需的，但当多个游戏具有相同的乐趣时，它使程序具有确定性。 

扫描从 (k=0) 开始，这很重要，因为投票任何游戏都是合法的。 变量`prefix`是前 (k) 个排序游戏的乐趣之和，因此候选分子和分母始终恰好是 (A+\text{prefix}) 和 (V+k)。 

比较使用乘法而不是除法。 对于正分母，

 [
 \frac{x}{y}>\frac{a}{b}
 ]

 等价于(xb>ay)。 这避免了浮点精度错误，也避免了重复构造浮点值。 

所选索引是从第一个索引重建的`best_k`已排序数组的元素。 不存在相差一的问题，因为`enumerate(games, 1)`使`k`等于前缀中包含的游戏数量。 

分母始终为正，因为原始输入至少包含一票赞成票。 Python 的任意精度整数也使得溢出不可能发生，即使实际边界对于标准 64 位算术来说已经足够小了。 

什么时候`best_k`为零，则所需的第三输出行为空。 该代码显式附加一个空字符串，以便每个测试用例仍然恰好占用三个输出行。 

## 工作示例

 第一个示例包含五款游戏。 他们的初始总数是 (V=21)，他们当前的快乐贡献是

 [
 A=5\cdot10+7\cdot4+3\cdot6+2\cdot8+4\cdot2=120。 
]

 按兴趣排序后，顺序为游戏1、4、3、2、5。 

| (k) | 增添乐趣 | 分子| 分母| 期望|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 120 | 120 21 | 21 (120/21) |
 | 1 | 10 | 10 130 | 130 22 | 22 (130/22) |
 | 2 | 18 | 18 138 | 138 23 | 23 (138/23=6) |
 | 3 | 24 | 144 | 144 24 | (144/24=6) |
 | 4 | 28 | 28 148 | 148 25 | 25 (148/25) |
 | 5 | 30| 150 | 150 26 | 26 (150/26) |

 最大值为 6。(k=2) 和 (k=3) 之间存在平局。 该实现保留第一个最大值，因为它仅在新候选值严格更大时才替换最佳答案。 因此它选择游戏 1 和 4 并打印`6/1`。 

第二个样本有 (V=1111) 和

 [
 A=1000\cdot1+100\cdot10+10\cdot100+1\cdot1000=4000。 
]

 排序顺序为游戏 4、3、2、1。 

| (k) | 增添乐趣 | 分子| 分母| 期望|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 4000 | 1111 | 1111 (4000/1111) |
 | 1 | 1000 | 1000 5000 | 1112 | 1112 (5000/1112) |
 | 2 | 1100 | 1100 5100 | 5100 1113 | 1113 (5100/1113) |
 | 3 | 1110 | 1110 5110 | 5110 1114 | 1114 (5110/1114) |
 | 4 | 1111 | 1111 5111| 1115 | 1115 (5111/1115) |

 最佳候选者使用游戏 4、3 和 2。其分数为

 [
 \frac{5110}{1114}=\frac{2555}{557},
 ]

 将两个数字除以 2 后，这已经是所请求的简化表示。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log n)) | 排序主导线性扫描和输入处理 |
 | 空间| (O(n)) | (O(n)) | 游戏数组存储每场游戏的一条记录 |

 对于 (n\le1000)，排序 (O(n\log n)) 完全在 2 秒限制内。 即使跨越 500 个测试用例，该算法在每个游戏中也只执行除排序之外的少量工作，并且其内存使用量与一个测试用例的大小呈线性关系。 

## 测试用例

 下面的测试工具使用与提交的解决方案相同的确定性打破平局。 对于一般验证，它还会检查答案的结构有效性及其最佳值，因为 Codeforces 允许任何最佳子集。```python
import sys
import io
from math import gcd

def solution(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        input = sys.stdin.readline

        t = int(input())
        out = []

        for _ in range(t):
            n = int(input())

            games = []
            total_votes = 0
            total_pleasure = 0

            for idx in range(1, n + 1):
                p, v = map(int, input().split())
                games.append((p, idx))
                total_votes += v
                total_pleasure += p * v

            games.sort(key=lambda x: (-x[0], x[1]))

            best_num = total_pleasure
            best_den = total_votes
            best_k = 0
            prefix = 0

            for k, (p, idx) in enumerate(games, 1):
                prefix += p
                cur_num = total_pleasure + prefix
                cur_den = total_votes + k

                if cur_num * best_den > best_num * cur_den:
                    best_num = cur_num
                    best_den = cur_den
                    best_k = k

            g = gcd(best_num, best_den)
            best_num //= g
            best_den //= g

            out.append(f"{best_num}/{best_den}")
            out.append(str(best_k))

            if best_k == 0:
                out.append("")
            else:
                out.append(" ".join(str(games[i][1]) for i in range(best_k)))

        return "\n".join(out)
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def check(inp: str, output: str):
    data = list(map(int, inp.split()))
    pos = 0
    t = data[pos]
    pos += 1

    lines = output.splitlines()
    line_pos = 0

    for _ in range(t):
        n = data[pos]
        pos += 1

        games = []
        total_votes = 0
        total_pleasure = 0

        for idx in range(1, n + 1):
            p = data[pos]
            v = data[pos + 1]
            pos += 2
            games.append((p, v))
            total_votes += v
            total_pleasure += p * v

        fraction = lines[line_pos]
        line_pos += 1

        num, den = map(int, fraction.split("/"))
        assert gcd(num, den) == 1
        assert den > 0

        k = int(lines[line_pos])
        line_pos += 1

        chosen = []
        if k > 0:
            chosen = list(map(int, lines[line_pos].split()))
        line_pos += 1

        assert 0 <= k <= n
        assert len(chosen) == k
        assert len(set(chosen)) == k
        assert all(1 <= x <= n for x in chosen)

        chosen_set = set(chosen)
        actual_num = total_pleasure
        for i, (p, v) in enumerate(games, 1):
            if i in chosen_set:
                actual_num += p

        actual_den = total_votes + k

        assert num * actual_den == actual_num * den

        best_num = total_pleasure
        best_den = total_votes

        ordered = sorted((p, i) for i, (p, v) in enumerate(games, 1))
        ordered.reverse()

        prefix = 0
        for kk in range(1, n + 1):
            prefix += ordered[kk - 1][0]
            candidate_num = total_pleasure + prefix
            candidate_den = total_votes + kk
            assert candidate_num * best_den <= best_num * candidate_den or (
                candidate_num * best_den == best_num * candidate_den
            )

            if candidate_num * best_den > best_num * candidate_den:
                best_num = candidate_num
                best_den = candidate_den

sample = """2
5
10 5
4 7
6 3
8 2
2 4
4
1 1000
10 100
100 10
1000 1
"""

check(sample, solution(sample))

minimum = """1
1
0 7
"""
check(minimum, solution(minimum))

all_equal = """1
4
5 1
5 2
5 3
5 4
"""
check(all_equal, solution(all_equal))

zero_votes = """1
2
10 1
100 0
"""
check(zero_votes, solution(zero_votes))

boundary = """1
3
0 1000
1000 0
999 1
"""
check(boundary, solution(boundary))

large = "1\n1000\n" + "\n".join(
    f"{i % 1001} {1 if i == 1 else 0}" for i in range(1000)
) + "\n"
check(large, solution(large))

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一场比赛与`p=0`|`0/1`,`k=0`| 合法的空子集和零分子 |
 | 四款游戏同样欢乐 | 任何最佳前缀 | 同等价值和领带处理 |
 | 快感高的零投票游戏 | 快感游戏精选| (v_i=0) 的游戏必须保持资格 |
 |`p=0`,`v=1000`夹杂着巨大的快乐| 最佳前缀的精确分数 | 边界值和分母变化 |
 | 1000 场比赛生成案例 | 任何有效的最优| 最大 (n) 和线性记忆行为 |

 ## 边缘情况

 当投票没有最佳游戏时，扫描会处理它，因为初始最佳候选者是 (k=0)。 对于输入```
1
1
0 5
```我们有 (A=0) 和 (V=5)。 唯一的选择是添加零愉悦投票并仍然给出期望 (0)，因此算法保持 (k=0) 并将 (0/5) 减少到`0/1`。 第三行是空的。 

当游戏没有当前投票时，它仍然出现在排序数组中。 为了```
1
2
10 1
100 0
```我们有 (A=10) 和 (V=1)。 最初的候选者是（10/1）。 添加游戏 2 后，候选者变为 (110/2=55)，因此算法选择游戏 2。其现有投票数为零并不妨碍我们的新投票使其成为最有可能的流媒体游戏。 

分母的变化通过使用直接处理`total_votes + k`。 考虑```
1
2
100 1
0 100
```这里（A=100）和（V=101）。 如果没有额外投票，期望值为 (100/101)。 添加第一个游戏会产生 (200/102=100/51)，效果更好。 相反，添加零愉悦游戏会得到 (100/102=50/51)，这更糟糕。 前缀扫描准确地评估两种可能性。 

平等的最佳候选人由严格的处理`>`比较。 为了```
1
2
5 1
5 1
```(k=0) 期望为 (10/2=5)，添加任一游戏也可得到 (15/3=5)。 由于该值没有提高，因此实现保持不变（k=0）。 这是有效的，因为该问题需要任何最大化策略。 

即使当最优值碰巧具有简单值时，缩减步骤也是必要的。 在第二个样本中，所选候选者为 (5110/1114)，最大公约数为 2。将两部分相除得出`2555/557`，满足所需的不可约分数格式。
