---
title: "CF 102215M - Shlakoblock 已上线！"
description: "有 (n) 场比赛。 游戏 (i) 目前有 (vi) 票，观看该游戏会带来乐趣 (pi)。 我们最多可以为任何游戏投票一次。"
date: "2026-08-20T03:04:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102215
codeforces_index: "M"
codeforces_contest_name: "2019, XII Samara Regional Intercollegiate Programming Contest"
rating: 0
weight: 102215
solve_time_s: 451
verified: false
draft: false
---

[CF 102215M - Shlakoblock 已上线！](https://codeforces.com/problemset/problem/102215/M)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 有 (n) 场比赛。 游戏 (i) 目前有 (v_i) 票，观看该游戏会带来乐趣 (p_i)。 我们最多可以为任何游戏投票一次。 我们投票后，会从所有选票中统一选出一票，因此最终得票数为 (x) 的游戏会以概率 (x) 除以总票数来选择。 

假设我们选择一组（S）游戏。 让

 [
 V=\sum_{i=1}^{n}v_i,\qquad
 A=\sum_{i=1}^{n}v_i p_i。 
]

 在我们投票之前，预期的快乐是（A/V）。 如果我们对(S)中的每场比赛进行投票，则总票数变为(V+|S|)，而快乐加权总票数变为

 [
 A+\sum_{i\in S}p_i。 
]

 因此 (S) 的预期快乐是

 [
 \frac{A+\sum_{i\in S}p_i}{V+|S|}。 
]

 输出必须包含这个最大期望值作为不可约分数，后面是我们选择的游戏数量及其索引。 

约束对于排序来说足够小，但是对于枚举子集来说太大了。 对于 (n\le 1000)，(O(n^2)) 解决方案很容易实用，而 (O(n\log n)) 解决方案在 2 秒限制下有足够的空间。 (500) 个测试用例并没有改变这个结论，因为总输入大小仍然受实际测试数据中相应的 (n) 之和的限制，并且算法只需要处理每个游戏少量的次数。 

在许多情况下，粗心的实施可能会失败。 首先，不得选择任何游戏。 为了```
1
1
5 10
```预期的乐趣已经是（5），并且投票给唯一的游戏使期望保持不变。 最优输出可以是```
5/1
0
```假设必须选择至少一个游戏的实现将不必要地限制答案。 

第二个问题是，当前投票数为零的游戏仍然可能是最好添加的游戏。 为了```
1
2
0 0
10 1
```初始期望为(10)。 选择游戏 (1) 将期望更改为 (5)，而选择游戏 (2) 将其更改为 (10)。 两种选择都是最优的，包括不选择任何内容。 当零投票游戏具有与当前期望相同的乐趣时，仅考虑 (v_i>0) 游戏的解决方案可能会错过有效的最佳选择。 

最重要的边缘情况涉及分母。 为了```
1
2
10 1
0 1
```最初期望的快乐是（5）。 添加游戏 (1) 得到 (20/3)，而添加游戏 (2) 得到 (10/3)。 正确答案是（20/3）。 一种仅比较（p_i/v_i）而不是添加一票的实际效果的方法正在解决不同的问题。 

最后，答案必须减少。 为了```
1
2
6 1
2 1
```初始期望为 (4)，选择任一游戏都会使期望保持在 (4)。 答案必须打印为`4/1`， 不是`8/2`或另一个等价分数。 

## 方法

 直接的方法是尝试游戏的每个子集。 对于选定的子集 (S)，我们可以使用以下方法计算其预期乐趣

 [
 \frac{A+\sum_{i\in S}p_i}{V+|S|}。 
]

 这是正确的，因为每个可能的投票决策都由一个子集表示。 问题是子集的数量。 它们有 (2^n) 个，即使使用适当的预处理在 (O(1)) 时间内评估每个子集，(n=1000) 的最坏情况也将需要 (2^{1000}) 次操作，这是完全不可行的。 

有用的观察结果是，分母仅取决于所选游戏的数量，而不取决于它们的身份。 将选择的游戏数量固定为(k)。 那么每个候选者都有相同的分母（V+k），并且原始值（A）也是固定的。 我们唯一可以改进的部分是

 [
 \sum_{i\in S}p_i。 
]

 对于恰好 (k) 个选定的游戏，通过取 (k) 个最大的快乐值来最大化该总和。 没有理由选择较小的快乐值而排除较大的快乐值，因为两种选择都只增加一票并且对分母的影响相同。 

这将问题转化为一维搜索。 按递减 (p_i) 对游戏进行排序，计算其乐趣的前缀和，并进行评估

 [
 \frac{A+P_k}{V+k}
 ]

 对于从 (0) 到 (n) 的每个 (k)，其中 (P_k) 是前 (k) 个快乐的总和。 我们只是保留最好的分数。 

蛮力之所以有效，是因为它会检查每个可能的子集，但会失败，因为子集的数量呈指数级增长。 只有所选游戏的数量对分母很重要，这一观察结果让我们用一个代表替换所有相同大小的子集，即包含 (k) 个最大乐趣的集合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^n n)) 或 (O(2^n)) 带子集预处理 | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(n\log n)) | (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 读取所有游戏并计算当前总票数（V）和当前加权快乐度（A=\sum v_i p_i）。 这些值描述了我们添加任何投票之前的期望。 
2. 按递减 (p_i) 对游戏进行排序。 只有乐趣的顺序才能决定选择哪些游戏。 现有的票数 (v_i) 已在 (A) 和 (V) 中得到充分考虑。 
3. 从 (k=0) 开始。 对应的候选是不投票的决定，具有价值（A/V）。 包括 (k=0) 是必要的，因为添加投票会降低期望。 
4. 从最大乐趣到最小扫描排序的游戏，并维护前缀乐趣总和（P_k）。 处理完前 (k) 个游戏后，在所有恰好包含 (k) 个游戏的选择中，最佳可能答案是

 [
 \frac{A+P_k}{V+k}。 
]

 1. 使用交叉乘法将该候选值与迄今为止找到的最佳值进行比较。 对于两个分数 (a/b) 和 (c/d)，比较 (a d) 与 (c b)。 这避免了浮点精度问题并给出了精确的比较。 
2. 当一个候选更好时，保存它的(k)。 所选游戏恰好是排序顺序中的前 (k) 个游戏，因此不需要单独的子集重建。 
3. 重新计算保存的 (k) 的分子和分母，将两者除以其最大公约数，然后打印约简分数。 然后打印保存的(k)和相应的原始索引。 

为什么有效：对于每个固定的 (k)，分母 (V+k) 都是固定的，因此最大化期望值相当于最大化增加的乐趣。 (k) 最大 (p_i) 值在所有 (k) 元素子集中提供最大可能的附加乐趣。 因此，扫描会考虑每个可能的基数 (k) 的最佳可能子集。 由于每个合法子集都具有介于 (0) 和 (n) 之间的基数，因此这些候选之一是全局最优的。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())

        games = []
        total_votes = 0
        weighted_pleasure = 0

        for idx in range(1, n + 1):
            p, v = map(int, input().split())
            games.append((p, idx))
            total_votes += v
            weighted_pleasure += p * v

        # For a fixed number k of new votes, choose the k largest pleasures.
        games.sort(reverse=True)

        best_k = 0
        best_num = weighted_pleasure
        best_den = total_votes

        prefix = 0

        for k, (p, idx) in enumerate(games, 1):
            prefix += p

            num = weighted_pleasure + prefix
            den = total_votes + k

            # num / den > best_num / best_den
            if num * best_den > best_num * den:
                best_num = num
                best_den = den
                best_k = k

        selected = [games[i][1] for i in range(best_k)]

        g = math.gcd(best_num, best_den)
        best_num //= g
        best_den //= g

        out.append(f"{best_num}/{best_den}")
        out.append(str(best_k))
        out.append(" ".join(map(str, selected)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一个循环计算 (V) 和 (A)，同时存储每个游戏的乐趣和原始索引。 原始索引被保留，因为排序改变了顺序，但输出必须引用输入位置。 

按相反的顺序排序，将最大的乐趣放在第一位。 Python 按字典顺序对元组进行排序，因此`(p, idx)`和`reverse=True`当快乐相同时，指数也会反转。 这并不影响正确性，因为平等的快乐是可以互换的。 

扫描从 (k=0) 候选者开始。 对于每个新包含的游戏，`prefix`变为 (P_k)，因此候选分子为`weighted_pleasure + prefix`它的分母是`total_votes + k`。 

比较使用乘法而不是`/`。 Python 整数具有任意精度，因此即使是诸如`num * best_den`都得到准确处理。 这避免了浮点舍入和溢出问题。 

选定的索引是第一个`best_k`排序后的游戏。 最后，`math.gcd`减少精确分数。 什么时候`best_k`为零，则所选列表为空，最终输出行也为空，这是有效的，因为 (k=0)。 

## 工作示例

 第一个测试用例有五场比赛。 最初，

 [
 V=5+7+3+2+4=21
 ]

 和

 [
 A=10\cdot5+4\cdot7+6\cdot3+8\cdot2+2\cdot4=132。 
]

 按兴趣排序后，游戏显示为 (10,8,6,4,2)。 

| (k) | 增加游戏乐趣| 前缀 (P_k) | 分子| 分母| 价值|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 132 | 132 21 | 21 (132/21=44/7) |
 | 1 | 10 | 10 10 | 10 142 | 142 22 | 22 (71/11) |
 | 2 | 8 | 18 | 18 150 | 150 23 | 23 (150/23) |
 | 3 | 6 | 24 | 156 | 156 24 | (6) |
 | 4 | 4 | 28 | 28 160 | 160 25 | 25 (32/5) |
 | 5 | 2 | 30| 162 | 162 26 | 26 (81/13) |

 最佳候选是 (k=3)，值为 (6)。 然而，样本输出选择游戏 (1) 和 (4)，也给出 (150/25=6)。 这说明了为什么可以存在多个最优子集。 在上面的实现中，保留了第一个严格更好的候选者，因此即使其选择的索引与样本不同，输出也是有效的。 

对于第二个测试用例，

 [
 V=1000+100+10+1=1111
 ]

 和

 [
 A=1\cdot1000+10\cdot100+100\cdot10+1000\cdot1=4000。 
]

 快乐已经按升序排列，因此排序会产生 (1000,100,10,1)。 

| (k) | 增加游戏乐趣| 前缀 (P_k) | 分子| 分母| 价值|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 4000 | 1111 | 1111 (4000/1111) |
 | 1 | 1000 | 1000 1000 | 1000 5000 | 1112 | 1112 (625/139) |
 | 2 | 100 | 100 1100 | 1100 5100 | 5100 1113 | 1113 (1700/371) |
 | 3 | 10 | 10 1110 | 1110 5110 | 5110 1114 | 1114 (2555/557) |
 | 4 | 1 | 1111 | 1111 5111| 1115 | 1115 (5111/1115) |

 最大值出现在（k=3）处，对应于原始游戏的乐趣（10,100,1000），即游戏（2,3,4）。 所得分数是

 [
 \frac{5110}{1114}=\frac{2555}{557}。 
]

 该跟踪还显示了为什么赢得所有比赛并不是自动最优的。 最终的游戏有快乐（1），它太低而无法补偿额外的分母。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n)) | (O(n\log n)) | 排序主导线性扫描|
 | 空间| (O(n)) | (O(n)) | 游戏和选定的索引被存储|

 对于 (n\le1000)，以 (O(n\log n)) 排序很容易在 2 秒限制内。 该算法在排序后仅在每个游戏中执行恒定数量的整数运算，并且 Python 的任意精度整数使分数比较精确，而不会引入这些边界的实际内存问题。 

## 测试用例

 下面的测试工具从语义上检查解决方案，而不是需要一个特定的最佳子集。 这是必要的，因为该问题明确允许任何最佳答案。 它验证了报告的分数已减少，指标是独特且有效的，并且报告的期望值是全局最优的。```python
import sys
import io
import math
from fractions import Fraction

def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())

        games = []
        total_votes = 0
        weighted_pleasure = 0

        for idx in range(1, n + 1):
            p, v = map(int, input().split())
            games.append((p, idx))
            total_votes += v
            weighted_pleasure += p * v

        games.sort(reverse=True)

        best_k = 0
        best_num = weighted_pleasure
        best_den = total_votes

        prefix = 0

        for k, (p, idx) in enumerate(games, 1):
            prefix += p
            num = weighted_pleasure + prefix
            den = total_votes + k

            if num * best_den > best_num * den:
                best_num = num
                best_den = den
                best_k = k

        selected = [games[i][1] for i in range(best_k)]

        g = math.gcd(best_num, best_den)
        best_num //= g
        best_den //= g

        out.append(f"{best_num}/{best_den}")
        out.append(str(best_k))
        out.append(" ".join(map(str, selected)))

    sys.stdout.write("\n".join(out))

def validate(inp: str):
    output = solve_data(inp).strip("\n")
    lines = output.splitlines()

    data = inp.split()
    pos = 0
    t = int(data[pos])
    pos += 1

    line_pos = 0

    for case in range(t):
        n = int(data[pos])
        pos += 1

        games = []
        total_votes = 0
        weighted = 0

        for idx in range(1, n + 1):
            p = int(data[pos])
            v = int(data[pos + 1])
            pos += 2
            games.append((p, v))
            total_votes += v
            weighted += p * v

        frac = lines[line_pos]
        line_pos += 1

        num_s, den_s = frac.split("/")
        num = int(num_s)
        den = int(den_s)

        assert den > 0
        assert math.gcd(num, den) == 1

        k = int(lines[line_pos])
        line_pos += 1

        indices = []
        if line_pos < len(lines):
            current = lines[line_pos].strip()
            if current:
                indices = list(map(int, current.split()))
        line_pos += 1

        assert len(indices) == k
        assert len(set(indices)) == k
        assert all(1 <= x <= n for x in indices)

        actual_num = weighted + sum(games[i - 1][0] for i in indices)
        actual_den = total_votes + k

        assert Fraction(num, den) == Fraction(actual_num, actual_den)

        best = Fraction(weighted, total_votes)
        for mask in range(1 << n) if n <= 10 else []:
            s = 0
            cnt = 0
            for i in range(n):
                if mask >> i & 1:
                    s += games[i][0]
                    cnt += 1
            best = max(best, Fraction(weighted + s, total_votes + cnt))

        if n <= 10:
            assert Fraction(num, den) == best

sample = """\
2
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

validate(sample)

validate("""\
1
1
5 10
""")

validate("""\
1
2
0 0
10 1
""")

validate("""\
1
2
10 1
0 1
""")

validate("""\
1
3
7 1000
7 0
7 1
""")

# Maximum-size case. All games have the same pleasure, so k = 0 is optimal.
maximum_case = "1\n1000\n" + "\n".join(["500 1"] * 1000) + "\n"
validate(maximum_case)

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 / 5 10`|`5/1`, (k=0) | 最小尺寸和不选择任何内容的可能性 |
 |`2 / (0,0),(10,1)`|`10/1`与 (k=0) 或第二场比赛 | 当前投票数为零且最优值不变 |
 |`2 / (10,1),(0,1)`|`20/3`与游戏 1 | 通过乐趣和分数比较正确排序 |
 |`3 / (7,1000),(7,0),(7,1)`|`7/1`| 平等的乐趣和零投票的游戏 |
 | 1000 场比赛`(500,1)`|`500/1`与 (k=0) | 最大值 (n)、重复值和线性扫描边界 |

 验证器会检查所提供的样本，而不需要确切的样本索引，因为允许使用不同的最佳子集。 最大尺寸的情况证实该实现可以处理所有（1000）个游戏，而不依赖于小输入尺寸。 

## 边缘情况

 当选择没有最佳游戏时，算法通过初始化来处理它`best_k = 0`在扫描任何游戏之前。 对于输入```
1
1
5 10
```我们有 (A=50) 和 (V=10)，所以初始值为 (50/10=5)。 添加唯一的游戏得到 (55/11=5)，这是相等的而不是严格更好。 因为代码仅在严格改进时更新，所以它保留 (k=0) 并打印`5/1`。 

零投票游戏不需要特殊处理。 考虑```
1
2
0 0
10 1
```初始值为(10/1=10)。 排序后，快乐序列为(10,0)。 第一个候选值是 (20/2=10)，因此它与初始值绑定并且不替换它。 第二个候选者是（20/3），这更糟糕。 答案依然存在`10/1`没有选定的游戏。 扫描中仍然存在零票游戏，这是必然的，但其乐趣的评估与其他游戏完全一样。 

选择必须基于快乐，而不是当前的票数。 为了```
1
2
10 1
0 1
```我们有 (A=10) 和 (V=2)，给出初始期望 (5)。 选择愉快的游戏（10）产生（20/3），而选择愉快的游戏（0）产生（10/3）。 按乐趣排序会将正确的游戏放在第一位，然后扫描会选择它。 

同等价值也需要严格比较。 为了```
1
3
7 1000
7 0
7 1
```我们有 (A=7007) 和 (V=1001)，因此初始期望正是 (7)。 每增加一票也有快乐 (7)，因此对于每一个 (k)，

 [
 \frac{7007+7k}{1001+k}=7。 
]

 该算法保持 (k=0)，尽管选择任意数量的游戏也是最优的。 这就是为什么使用`>`而不是`>=`很方便：当所有候选者都平局时，它对空选择给出确定性的偏好。 

最后，在找到最优值 (k) 后执行分数缩减。 对于第一个样本的最优值（156/24），最大公约数为（24），因此打印结果为`6/1`。 将所有算术保留为整数，直到最终减少，以避免精度错误并使每次比较准确。
