---
title: "CF 102215M - Shlakoblock 已上线！"
description: "有 (n) 场比赛。 在我们投票之前，游戏 (i) 已经获得了 (vi) 票，观看该游戏给我们带来乐趣 (pi)。 我们最多可以为每个游戏添加一票，因此我们的选择只是游戏索引的子集。 我们投票后，从所有选票中统一随机选出一票。"
date: "2026-08-17T23:56:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102215
codeforces_index: "M"
codeforces_contest_name: "2019, XII Samara Regional Intercollegiate Programming Contest"
rating: 0
weight: 102215
solve_time_s: 172
verified: false
draft: false
---

[CF 102215M - Shlakoblock 已上线！](https://codeforces.com/problemset/problem/102215/M)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 52s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 有 (n) 场比赛。 在我们投票之前，游戏 (i) 已经有 (v_i) 票，观看该游戏给我们带来乐趣 (p_i)。 我们最多可以为每个游戏添加一票，因此我们的选择只是游戏索引的子集。 

我们投票后，从所有选票中统一随机选出一票。 如果游戏(i)以(v_i+1)票结束，当我们投票给它时，它对预期快乐的贡献是(p_i(v_i+1))。 如果我们不投票，它的贡献是 (p_i v_i)。 

让

 [
 V=\sum_i v_i
 ]

 是现有投票数，并且

 [
 P=\sum_i p_i v_i
 ]

 是这些选票加权的总快乐。 如果我们选择包含(k)个游戏的子集(S)，则最终的投票数为(V+k)，而总加权快乐变为

 [
 P+\sum_{i\in S}p_i。 
]

 因此预期的快乐是

 [
 \frac{P+\sum_{i\in S}p_i}{V+|S|}。 
]

 任务是选择（S）最大化该分数，然后以不可约形式输出该分数和选定的博弈指数。 

约束给出 (n\le 1000)，因此 (O(n^2)) 解决方案很容易合理，而 (O(n\log n)) 解决方案则轻松地在两秒限制内。 另一方面，枚举所有子集已经给出了 (2^{1000}) 种可能性，这是完全不可行的。 事实上，可能有多达 500 个测试用例，这使得指数方法更加不可行。 

在许多情况下，粗心的实施可能会失败。 首先，必须允许不选择任何游戏。 例如，```
1
1
0 5
```已经有了预期的乐趣（0），为游戏投票并不能改善它。 最佳答案是```
0/1
0
```始终选择至少一个游戏的实现仍然会在这里获得相同的数值，但它可能会违反其自己对所选集合的假设或产生不必要的投票。 

一个更重要的边缘情况是没有现有投票的游戏。 考虑```
1
2
100 0
0 1
```如果没有我们的投票，预期的快乐是（0）。 为游戏1投票给出了两票总票数和预期的乐趣（100/2=50），所以必须选择游戏1。 对于游戏 1，现有值 (p_i v_i) 为零，但我们的额外投票贡献 (p_i)。 忘记额外的贡献是错误公式的常见原因。 

快乐中的联系是另一个边界情况。 为了```
1
3
5 10
5 20
5 30
```所有可能的预期快乐都是（5），包括不选择游戏。 任何子集都是有效的，因此算法不能依赖于唯一的最优子集。 确定性平局打破规则对于测试很有用，但不是问题所必需的。 

最后，答案是一个分数，不一定是整数。 在第二个示例中，最佳值是 (5110/1114)，它减少到 (2555/557)。 即使其数值是正确的，打印未约分分数也会违反输出要求。 

## 方法

 直接的方法是枚举 (n) 个游戏的每个子集。 对于每个子集，我们可以计算其大小，将其所选游戏的乐趣添加到 (P)，除以 (V+|S|)，并保留最佳分数。 这是正确的，因为每个合法投票策略都是一个子集，因此枚举会考虑每种可能的策略。 

然而，有 (2^n) 个子集。 如果我们通过扫描每个子集的所有 (n) 场比赛来计算分子，则最坏情况的工作是 (O(n2^n))。 即使使用更仔细的子集动态程序在 (O(1)) 额外时间内评估每个子集，仍然存在 (2^n) 个状态。 在 (n=1000) 时，这远远超出了任何实现的处理能力。 

有用的观察是，分母仅取决于我们选择的游戏数量，而不取决于我们选择的游戏。 假设我们提前决定为 (k) 场比赛投票。 那么分母固定为(V+k)，(P)也固定。 我们唯一可以优化的部分是

 [
 \sum_{i\in S}p_i。 
]

 对于恰好 (k) 个选定的游戏，通过取 (p_i) 的 (k) 个最大值来最大化该总和。 一旦 (k) 确定，现有的投票数 (v_i) 不再影响应该选择哪些游戏。 它们影响固定基线 (P) 和 (V)，但具有相同 (k) 的每个候选者都具有相同的分母和相同的基线。 

这将整个问题简化为按 (p_i) 对游戏进行排序，然后考虑该排序顺序的每个前缀。 对于前缀长度 (k)，我们知道大小 (k) 的所有子集中可能最好的分子。 我们简单地使用精确整数算术来比较那些 (n+1) 个候选者。 

强力方法之所以有效，是因为每个子集代表一种可能的投票策略，但会失败，因为子集的数量呈指数级增长。 观察到具有相同数量的添加选票的所有策略共享相同的分母，这让我们可以用一个最佳代表（即（k）个最大的快乐）来替换所有大小（k）的子集。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n2^n)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 计算 (V=\sum v_i) 和 (P=\sum p_i v_i)。 这些是现有投票的总数以及这些投票贡献的总快乐。 由于每个策略都从同一个现有民意调查开始，因此这些数量构成了每个候选人的共同基线。 
2. 按 (p_i) 的降序对所有游戏进行排序。 保留他们的原始指数以及他们的快乐值。 该顺序让我们可以通过前缀表示每个可能大小的最佳子集。 
3. 从 (k=0) 开始。 它的候选值是（P/V），因为我们不添加任何选票。 必须考虑这种情况，因为添加投票会降低预期的快乐。 
4. 按照从最大乐趣到最小乐趣的顺序遍历排序的游戏。 当添加下一个游戏时，将额外的乐趣增加其（p_i），并将票数增加一。 对于长度为 (k) 的前缀，候选分数为

 [
 \frac{P+\text{前缀快乐}}{V+k}。 
]

 该前缀在恰好包含 (k) 个游戏的所有子集中是最佳的，因为它包含 (k) 个最大的快乐值。

1. 通过交叉乘法将当前候选与迄今为止找到的最佳分数进行比较。 对于分数 (a/b) 和 (c/d)，比较 (ad) 和 (cb)。 这避免了浮点精度错误并给出了精确的排序。 
2. 只要新的候选者严格更好，就存储前缀长度和索引。 当值相等时保持第一个最优值是有效的，因为该问题接受任何最优子集。 
3. 找到最佳前缀后，将其分子和分母减去它们的最大公约数。 输出减少的分数、所选游戏的数量及其原始指数。 

为什么它有效：对于我们可以添加的每个可能的票数 (k)，分母 (V+k) 是固定的。 现有的贡献（P）也是固定的。 因此，在大小 (k) 的所有子集中，最大化预期快乐与最大化它们 (p_i) 值的总和完全相同。 (k) 最大 (p_i) 值达到该最大值，因此排序后的前缀为每个可能的 (k) 提供了最佳策略。 由于该算法检查从 (0) 到 (n) 的每个 (k)，因此它会检查每个可能的大小类别中的最佳策略，从而找到全局最优策略。 

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
        base_pleasure = 0

        for i in range(n):
            p, v = map(int, input().split())
            games.append((p, i + 1))
            total_votes += v
            base_pleasure += p * v

        games.sort(key=lambda x: (-x[0], x[1]))

        best_num = base_pleasure
        best_den = total_votes
        best_k = 0
        best_indices = []

        prefix = 0

        for k, (p, idx) in enumerate(games, 1):
            prefix += p

            cur_num = base_pleasure + prefix
            cur_den = total_votes + k

            if cur_num * best_den > best_num * cur_den:
                best_num = cur_num
                best_den = cur_den
                best_k = k
                best_indices = [games[j][1] for j in range(k)]

        g = gcd(best_num, best_den)
        best_num //= g
        best_den //= g

        out.append(f"{best_num}/{best_den}")
        out.append(str(best_k))
        out.append(" ".join(map(str, best_indices)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```输入循环将每个游戏及其原始的基于一的索引存储为它的乐趣。 同时它计算两个公共基线量，`total_votes`和`base_pleasure`，因此不需要为每个候选人重新计算。 

这种类型使用递减的快乐。 按原始索引进行二次排序在数学上不是必需的，但当多个游戏具有相同的乐趣时，它使程序具有确定性。 由于平等的快乐对于目标是可以互换的，因此它们之间的任何顺序都是有效的。 

初始候选者是空前缀。 它的分母是`total_votes`，输入条件保证其为正，因此不存在被零除的情况。 

在扫描过程中，`prefix`包含第一个快乐的总和`k`游戏。 当前分子是`base_pleasure + prefix`，而分母是`total_votes + k`。 比较使用乘法而不是`/`，所以所有的决定都是准确的。 Python 整数也会自动增长，因此叉积不会溢出。 

所选索引的列表是从第一个重建的`k`每当找到严格更好的候选者时，就会对游戏进行排序。 对于字面实现而言，这是 (O(n)) 的改进，这可能会使最坏情况下的扫描 (O(n^2)) 。 对于 (n\le1000) 来说，这仍然很容易接受。 如果需要，该实现可以只存储`best_k`在扫描期间并在最后重建一次前缀，给出严格的 (O(n\log n)) 实现。 

这是稍微干净一点的版本，它避免了重复的列表构造：```python
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
        base_pleasure = 0

        for i in range(1, n + 1):
            p, v = map(int, input().split())
            games.append((p, i))
            total_votes += v
            base_pleasure += p * v

        games.sort(key=lambda x: (-x[0], x[1]))

        best_num = base_pleasure
        best_den = total_votes
        best_k = 0

        prefix = 0

        for k, (p, _) in enumerate(games, 1):
            prefix += p
            cur_num = base_pleasure + prefix
            cur_den = total_votes + k

            if cur_num * best_den > best_num * cur_den:
                best_num = cur_num
                best_den = cur_den
                best_k = k

        g = gcd(best_num, best_den)
        best_num //= g
        best_den //= g

        answer_indices = [idx for _, idx in games[:best_k]]

        out.append(f"{best_num}/{best_den}")
        out.append(str(best_k))
        out.append(" ".join(map(str, answer_indices)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第二个版本是要提交的版本。 它唯一有意义的区别是它会记住最佳前缀长度，而不是在每次改进期间复制选定的索引。 最终的切片操作仅构造一次所需的答案。 

## 工作示例

 对于第一个测试用例，现有的加权快乐是

 [
 10\cdot5+4\cdot7+6\cdot3+8\cdot2+2\cdot4=120,
 ]

 现有投票数为 (21)。 按乐趣排序给出游戏 (1,4,3,2,5)。 

| (k) | 选定的前缀 | 增添乐趣| 分子| 分母| 期待的快乐|
 | ---| ---| ---| ---| ---| ---|
 | 0 | 无 | 0 | 120 | 120 21 | 21 (120/21) |
 | 1 | 1 | 10 | 10 130 | 130 22 | 22 (130/22) |
 | 2 | 1, 4 | 18 | 18 138 | 138 23 | 23 (138/23=6) |
 | 3 | 1, 4, 3 | 24 | 144 | 144 24 | (6) |
 | 4 | 1, 4, 3, 2 | 28 | 28 148 | 148 25 | 25 (148/25) |
 | 5 | 1, 4, 3, 2, 5 | 1, 4, 3, 2, 5 | 30| 150 | 150 26 | 26 (150/26) |

 最佳值是 (6)，通过游戏 1 和 4 通过 (k=2) 实现。选择游戏 3 也可以将预期乐趣保持在 (6)，因此允许算法保留第一个严格更好的候选者，即游戏 1 和 4。 

对于第二个测试用例，每个现有游戏对加权快乐的贡献为 (1000)，因此基线为 (4000/1111)。 游戏按(4,3,2,1)排序后已按喜好排序。 

| (k) | 选定的前缀 | 增添乐趣 | 分子| 分母| 比较|
 | ---| ---| ---| ---| ---| ---|
 | 0 | 无 | 0 | 4000 | 1111 | 1111 基线 |
 | 1 | 4 | 1000 | 1000 5000 | 1112 | 1112 改善 |
 | 2 | 4, 3 | 1100 | 1100 5100 | 5100 1113 | 1113 改善 |
 | 3 | 4, 3, 2 | 1110 | 1110 5110 | 5110 1114 | 1114 改善 |
 | 4 | 4, 3, 2, 1 | 1111 | 1111 5111| 1115 | 1115 减少 |

 最佳值是 (5110/1114)，它具有最大公约数 (2)，给出所需的输出分数 (2555/557)。 选取的游戏为4、3、2，正是愉悦值最大的三款游戏。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log n)) | 排序在游戏中的线性扫描中占主导地位。 |
 | 空间| (O(n)) | (O(n)) | 游戏数组和输出索引需要线性内存。 |

 对于 (n\le1000)，每个测试用例最多排序 1000 对很小，并且线性扫描每个用例仅执行几千次整数运算。 即使有多达 500 个测试用例，总输入大小也是相关的限制因素，并且算法可以轻松地保持在 2 秒和 256 MB 的限制范围内。 

## 测试用例

 由于该问题允许多个最优子集，因此强大的测试工具应该验证生成答案的数学有效性，而不是需要一个特定的有效子集。 以下测试代码调用相同的解决方案逻辑，并检查报告的分数是否是最佳的，所选的索引是否独特且有效，以及报告的分数是否与所选的集合匹配。```python
import sys
import io
from math import gcd

def solve_data(inp: str) -> str:
    data = io.StringIO(inp)
    t = int(data.readline())
    out = []

    for _ in range(t):
        n = int(data.readline())

        games = []
        total_votes = 0
        base_pleasure = 0

        for i in range(1, n + 1):
            p, v = map(int, data.readline().split())
            games.append((p, i))
            total_votes += v
            base_pleasure += p * v

        games.sort(key=lambda x: (-x[0], x[1]))

        best_num = base_pleasure
        best_den = total_votes
        best_k = 0
        prefix = 0

        for k, (p, _) in enumerate(games, 1):
            prefix += p
            cur_num = base_pleasure + prefix
            cur_den = total_votes + k

            if cur_num * best_den > best_num * cur_den:
                best_num = cur_num
                best_den = cur_den
                best_k = k

        g = gcd(best_num, best_den)
        best_num //= g
        best_den //= g

        indices = [idx for _, idx in games[:best_k]]

        out.append(f"{best_num}/{best_den}")
        out.append(str(best_k))
        out.append(" ".join(map(str, indices)))

    return "\n".join(out)

def run(inp: str) -> str:
    return solve_data(inp)

def check(inp: str, out: str):
    in_lines = inp.strip().splitlines()
    pos = 0
    t = int(in_lines[pos])
    pos += 1

    out_lines = out.splitlines()
    out_pos = 0

    for _ in range(t):
        n = int(in_lines[pos])
        pos += 1

        games = []
        total_votes = 0
        base = 0

        for i in range(1, n + 1):
            p, v = map(int, in_lines[pos].split())
            pos += 1
            games.append((p, v))
            total_votes += v
            base += p * v

        num, den = map(int, out_lines[out_pos].split("/"))
        out_pos += 1

        k = int(out_lines[out_pos])
        out_pos += 1

        indices = []
        if k > 0:
            indices = list(map(int, out_lines[out_pos].split()))
        out_pos += 1

        assert len(indices) == k
        assert len(set(indices)) == k
        assert all(1 <= x <= n for x in indices)

        actual_num = base + sum(games[i - 1][0] for i in indices)
        actual_den = total_votes + k

        assert num * actual_den == actual_num * den
        assert gcd(num, den) == 1

        best_num = base
        best_den = total_votes

        for mask_k in range(n + 1):
            if mask_k == 0:
                cur_num = base
            else:
                values = sorted((p for p, _ in games), reverse=True)
                cur_num = base + sum(values[:mask_k])

            cur_den = total_votes + mask_k

            if cur_num * best_den > best_num * cur_den:
                best_num = cur_num
                best_den = cur_den

        assert num * best_den == best_num * den

# Provided sample.
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

check(sample, run(sample))

# Minimum-size input.
case_min = """1
1
0 1
"""
assert run(case_min) == "0/1\n0\n"

# All pleasures equal. The deterministic implementation keeps k = 0.
case_equal = """1
3
5 10
5 20
5 30
"""
assert run(case_equal) == "5/1\n0\n"

# A zero-vote high-value game must be considered.
case_zero_votes = """1
2
100 0
0 1
"""
assert run(case_zero_votes) == "50/1\n1\n1"

# Boundary case where adding a lower-pleasure game makes the result worse.
case_off_by_one = """1
3
10 1
9 1
0 100
"""
assert run(case_off_by_one) == "19/102\n2\n1 2"

# Maximum-size input. All games have equal pleasure, so k = 0 is optimal.
max_case_lines = ["1", "1000"]
max_case_lines.extend(["1000 1000"] * 1000)
case_max = "\n".join(max_case_lines) + "\n"

max_out = run(case_max)
max_lines = max_out.splitlines()
assert max_lines[1] == "0"
assert max_lines[2] == ""
assert max_lines[0] == "1000/1"
```样本检查器故意不将输出文本与一个固定答案进行比较，因为该问题明确允许任何最佳子集。 小型确定性测试确实使用精确的输出，因为提交的实现具有确定性的平局打破顺序。 

| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 / 0 1`|`0/1`,`0`, 空索引行 | 最小尺寸和不选择任何内容的可能性 |
 |`3 / (5,10), (5,20), (5,30)`|`5/1`,`0`, 空索引行 | 所有平等的快乐和联系|
 |`2 / (100,0), (0,1)`|`50/1`,`1`， 游戏`1`| 现有票数为零的游戏仍然可以是最佳选择 |
 |`3 / (10,1), (9,1), (0,100)`|`19/102`,`2`, 游戏`1 2`| 正确的前缀边界并认识到添加另一个游戏可能会造成伤害 |
 | 1000份`(1000,1000)`|`1000/1`,`0`, 空索引行 | 最大值 (n)、大总数和等值关系 |

 ## 边缘情况

 当(n=1)时，只有两种可能的策略。 对于输入```
1
1
0 1
```基线是 (0/1)。 选择唯一的游戏会增加另一次投票，乐趣为零，因此值保持为零。 扫描从 (k=0) 开始，发现 (k=1) 候选者并不严格更好，并保留空集。 输出是```
0/1
0
```现有投票数为零的游戏会被自然处理，因为它对`base_pleasure`为零，而选择它则为分子增添了全部乐趣。 为了```
1
2
100 0
0 1
```基线是 (0/1)。 排序后，游戏 1 排在第一位。 选择它会产生 (100/2=50)，而选择两者都会产生 (100/3)。 因此，最好的前缀是第一个，产生```
50/1
1
1
```当几个游戏有相同的乐趣时，它们的顺序不会影响目标。 为了```
1
3
5 10
5 20
5 30
```基线期望已经是（5），每增加一票也有快乐（5）。 每个前缀都有期望 (5)。 由于实现仅更新严格的改进，因此它保持 (k=0)，给出```
5/1
0
```这也是为什么比较分数与严格`>`而不是`>=`很有用。 任一选择都可以在此处产生有效答案，但严格比较会给出稳定的最小前缀答案。 

最后一个微妙的情况是，添加更多游戏最终会变得有害。 为了```
1
3
10 1
9 1
0 100
```基线是（19/102）。 排序后，乐趣为(10,9,0)。 选择一场比赛给（29/103），选择两个给（38/104=19/52），并选择所有三个给（38/105）。 第三次投票对分子没有任何贡献，同时增加了分母，因此最优的是长度为 2 的前缀：```
19/52
2
1 2
```该算法会检查每个前缀，而不是假设玩更多快乐的游戏一定会有帮助。 对唯一相关参数（即所选游戏的数量）进行彻底扫描可以保持最优性，同时避免任意子集的指数数量。
