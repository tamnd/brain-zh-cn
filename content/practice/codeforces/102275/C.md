---
title: "CF 102275C - 分级"
description: "我们有（S）堆，每堆从上到下包含（H）张纸。 输入逐行给出堆栈，因此第 (i) 个输入字符串描述了所有堆栈中深度 (i) 的论文。 每篇论文属于主题 A 或主题 B。论文要么被评分，要么被丢失。"
date: "2026-08-17T10:04:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102275
codeforces_index: "C"
codeforces_contest_name: "2019 Facebook Hacker Cup, Round 2"
rating: 0
weight: 102275
solve_time_s: 995
verified: true
draft: false
---

[CF 102275C - 评分](https://codeforces.com/problemset/problem/102275/C)

 **评级：** -
 **标签：** -
 **求解时间：** 16m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有（S）堆，每堆从上到下包含（H）张纸。 输入逐行给出堆栈，因此第 (i) 个输入字符串描述了所有堆栈中深度 (i) 的论文。 每篇论文属于主题 A 或主题 B。 

论文要么被评分，要么丢失。 丢失的论文对上下文切换没有影响，但会计入允许的丢失预算。 分级试卷按某种顺序进行处理，尊重每叠试卷内的垂直顺序。 第一个评分试卷以及每当评分试卷的主题与前一个评分试卷不同时，都会发生上下文切换。 因此，如果评分论文有主题顺序```
AAAABBBBAAA
```有 3 个上下文切换，因为该序列有 3 个运行。 

对于每个允许的数量 (L_i)，在最多丢失 (L_i) 篇试卷后，我们需要在评分主题序列中进行尽可能少的运行次数。 

维度最多为 (300)，因此最多 (HS=90,000) 篇论文。 一个与论文总数成二次方的算法已经太大了，任何指数级的算法都是完全不可能的。 有用的目标大致为 (O(HS^2))，因为一维最多为 (300)。 输入最多包含 (K=HS) 个查询，因此也不需要使用昂贵的 DP 独立处理每个查询。 我们应该为每个可能的上下文切换次数计算一次答案，然后从该预计算中回答每个查询。 

三种边缘情况往往会暴露出不正确的解决方案。 

考虑一叠有五张纸的情况。```
1 5 2
BABAB
1 2
```正确的输出是`Case #1: 2 1`。 在允许损失一次的情况下，剩余的最佳主题序列仍然需要两次运行。 如果输了两次，我们可以保住所有三张 B 试卷，丢掉两张 A 试卷，得到一分。 如果粗心的解决方案只计算原始堆栈中的每个主题更改而不考虑损失，就会错过第二个答案。 

考虑两堆高度为二的东西。```
2 2 3
AB
BA
0 1 2
```两个栈分别是`AB`和`BA`。 在没有损失的情况下，两个完整的两次运行序列都有相反的起始主题，因此两次全局运行是不够的。 四个？ 不，例如，三个全局运行就足够了`A,B,A`。 因此答案是`3 2 1`。 仅计算单个堆栈所需的最大运行次数的解决方案将错误地返回零损失两次，并且会错过堆栈之间的方向冲突。 

最后，考虑一个完全均匀的网格。```
2 2 3
AA
AA
0 1 3
```每篇论文都是 A，因此即使没有损失，一次上下文切换就足够了，并且对于每个损失预算来说仍然足够。 正确的输出是`Case #1: 1 1 1`。 坚持使用精确允许的损失数量而不是最多使用该数量的解决方案可能会错误地丢弃纸张并产生更糟糕的结果。 

## 方法

 直接的暴力解决方案可以独立决定每篇论文是否被评分或丢失。 对于 (N=HS) 篇论文，已经创建了 (2^N) 个可能的评分论文子集。 对于每个子集，我们必须确定其论文是否可以排序成堆栈，并找到主题运行的最小数量。 即使该检查只花费 (O(N))，总工作量也将为 (O(N2^N))。 在最大值 (N=90,000) 下，子集的数量为 (2^{90000})，因此这种方法不太可行。 

有用的观察结果是，堆栈仅约束属于同一堆栈的论文的相对顺序。 一旦我们决定对一堆试卷进行评分，它们就会形成该堆字符串的子序列。 来自一个堆栈的分级序列可以与来自所有其他堆栈的分级序列交错。 

假设最终的全局主题序列有 (C) 次运行。 每个堆栈只需要生成一个可以嵌入到那些 (C) 交替运行中的子序列。 我们不需要决定个别论文的确切全球排序。 

有一个微妙之处。 使用少于 (C) 次运行的子序列可以从任一主题开始，因为它可以放入全局运行的任一奇偶校验中。 精确使用 (C) 运行的子序列在开始时没有备用运行，因此其第一个主题必须等于全局序列的第一个主题。 

这将问题简化为每个堆栈的独立动态程序。 对于每个可能的 (r) 次运行，我们计算获得具有恰好 (r) 次运行和指定的第一个主题的子序列所需的已删除论文的最小数量。 

对于一堆高度 (H) 的情况，此 DP 需要 (O(H^2)) 时间。 有 (S) 个堆栈，总工作量为 (O(SH^2))。 由于 (H,S\le300)，这是实用的。 

计算完每个堆栈后，我们通过加法将堆栈组合起来。 对于每个可能的全局运行次数 (C)，我们计算第一次全局运行为 A 和 B 时所需的最小损失。这两个值中较好的一个是 (C) 上下文切换所需的最小损失。 

由此产生的丢失要求是单调的：允许更多的上下文切换永远不会需要更多丢失的纸张。 这让我们可以用二分搜索来回答每个 (L_i)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(HS\cdot2^{HS})) 或更糟 | (O(HS)) | 太慢了 |
 | 最佳 | (O(SH^2 + K\log H)) | (O(H+S)) | 已接受 |

 (O(SH^2)) 动态规划公式也与标准竞赛讨论一致，其中简单的解决方案被描述为堆栈长度和块数量的 DP。 

## 算法演练

 1. 读取 (H) 输入字符串。 第 (i) 行、第 (j) 列的字符属于堆栈 (j)，因此通过从每一行中取出一个字符来重建每个堆栈。 
2. 对于一个堆栈，计算两个 DP 数组，一个用于第一个评分主题为 A 的子序列，另一个用于第一个评分主题为 B 的子序列。`dp[r]`是在精确产生 (r) 个主题运行时可以保留的最大论文数量。 
3. 从上到下处理堆栈。 当当前字符与必须结束运行 (r) 的主题匹配时，它可以扩展现有的 (r) 运行子序列或从 ((r-1)) 运行子序列开始第 (r) 运行。 向后处理运行计数允许两个转换都使用前一个位置的值。 
4. 处理完堆栈后，将最大保留长度转换为删除计数。 对于每个 (r)，`delA[r]`是从 A 开始的恰好 (r) 次运行所需的最小损失数，并且`delB[r]`定义类似。 
5. 构建`best[r]`，获得最多 (r) 次运行的子序列所需的最小损失，而不关心其起始主题。 此计算允许使用空子序列并造成 (H) 损失。 
6. 假设全局序列有 (C) 次运行并从 A 开始。使用少于 (C) 次运行的堆栈可以从任一主题开始，因此成本`best[C-1]`。 完全使用 (C) 运行的堆栈必须从 A 开始，因此成本`delA[C]`。 其实际成本是这两个值中较小的一个。 
7. 对从 B 开始的全局序列执行相同的操作。为每个堆栈独立添加相应的成本。 较小的总数是精确实现 (C) 全局上下文切换所需的最小损失数。 
8. 全局序列永远不需要超过 (H+1) 次运行。 每个单独的堆栈都有长度 (H)，因此它最多使用 (H) 次运行。 通过 (H+1) 次全局运行，每个堆栈都可以容纳，无论其起始主题如何，因为它至少有一个备用全局运行用于对齐。 
9. 结果数组`need[C]`是单调非增的。 对于每个查询（L_i），二分搜索最小的（C）满足`need[C] <= L_i`。 

工作原理：对于每个堆栈，DP 根据其运行次数和起始主题考虑每个可能的子序列，因此它会找到每个相关本地配置的最小损失。 少于 (C) 个游程的局部子序列始终可以移入 (C) 个交替全局游程的兼容子集。 恰好具有 (C) 运行的子序列没有这样的自由度，因此其起始主题必须与全局首次运行一致。 一旦这些条件对于每个堆栈都成立，则可以简单地将全局序列的游程长度选择为对于每个堆栈的指定游程来说足够大。 然后，这些纸叠可以独立交错，跳过的纸张就会丢失。 因此，总的 DP 成本既是可实现的，也是每个有效策略的下限。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

NEG = -10**9

def stack_costs(s):
    h = len(s)

    dp_a = [NEG] * (h + 1)
    dp_b = [NEG] * (h + 1)

    for ch in s:
        for r in range(h, 0, -1):
            # A-starting subsequence.
            last_a = 'A' if r & 1 else 'B'
            if ch == last_a:
                cand = NEG

                if dp_a[r] != NEG:
                    cand = dp_a[r] + 1

                if r == 1:
                    cand = max(cand, 1)
                elif dp_a[r - 1] != NEG:
                    cand = max(cand, dp_a[r - 1] + 1)

                dp_a[r] = max(dp_a[r], cand)

            # B-starting subsequence.
            last_b = 'B' if r & 1 else 'A'
            if ch == last_b:
                cand = NEG

                if dp_b[r] != NEG:
                    cand = dp_b[r] + 1

                if r == 1:
                    cand = max(cand, 1)
                elif dp_b[r - 1] != NEG:
                    cand = max(cand, dp_b[r - 1] + 1)

                dp_b[r] = max(dp_b[r], cand)

    inf = h + 1
    del_a = [inf] * (h + 1)
    del_b = [inf] * (h + 1)

    for r in range(1, h + 1):
        if dp_a[r] != NEG:
            del_a[r] = h - dp_a[r]
        if dp_b[r] != NEG:
            del_b[r] = h - dp_b[r]

    # best[r] = minimum losses for at most r runs,
    # with arbitrary starting subject.
    best = [h] * (h + 1)

    for r in range(1, h + 1):
        best[r] = min(best[r - 1], del_a[r], del_b[r])

    return del_a, del_b, best

def solve_case(h, s, rows, queries):
    # There are S stacks, each of height H.
    stacks = []
    for col in range(s):
        stacks.append(''.join(rows[row][col] for row in range(h)))

    max_runs = h + 1

    total_a = [0] * (max_runs + 1)
    total_b = [0] * (max_runs + 1)

    for stack in stacks:
        del_a, del_b, best = stack_costs(stack)

        for c in range(1, h + 1):
            # Global sequence starts with A.
            total_a[c] += min(best[c - 1], del_a[c])

            # Global sequence starts with B.
            total_b[c] += min(best[c - 1], del_b[c])

        # With H+1 runs, every stack has at most H runs,
        # so its starting subject can always be aligned.
        total_a[h + 1] += best[h]
        total_b[h + 1] += best[h]

    need = [0] * (max_runs + 1)
    for c in range(1, max_runs + 1):
        need[c] = min(total_a[c], total_b[c])

    answers = []

    for loss in queries:
        lo = 1
        hi = max_runs

        while lo < hi:
            mid = (lo + hi) // 2
            if need[mid] <= loss:
                hi = mid
            else:
                lo = mid + 1

        answers.append(str(lo))

    return answers

def solve():
    t = int(input())

    out = []

    for case_id in range(1, t + 1):
        h, s, k = map(int, input().split())

        rows = [input().strip() for _ in range(h)]
        queries = list(map(int, input().split()))

        answers = solve_case(h, s, rows, queries)
        out.append(f"Case #{case_id}: {' '.join(answers)}")

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    solve()
```输入首先存储为行，因为这就是堆栈的表示方式。 表达式`rows[row][col]`是特定堆栈中特定深度的纸张，因此连接一列会从上到下重建一个完整的堆栈。 

这`stack_costs`函数是DP的核心。 对于固定的起始主题，精确 (r) 运行的子序列的最后一个主题已由奇偶校验确定。 如果子序列以 A 开头，则奇数 (r) 的最后一次游程为 A，偶数 (r) 的最后一次游程为 B。 这消除了一个 DP 维度。 

当一个字符与所需的最后一个主题匹配时，它可以延长当前的运行。 如果之前的状态有 (r-1) 次运行，它也可以开始新的运行，因为之前的运行必然以相反的主题结束。 循环结束`r`向后运行，因此`dp[r - 1]`值仍然属于先前输入的位置。 

数组存储最大保留的论文而不是最小的删除，因为最大化评分论文的数量会产生相同的结果并使过渡相加。 在最后，`h - dp[r]`将结果转换为所需的损失计数。 

这`best`数组包含带有成本的空子序列`h`。 这是必要的，因为当损失预算允许时，堆栈可能会被完全忽略。 它还可以处理堆栈论文与所选全局主题运行无关的情况。 

组合步骤是全局结构进入的地方。 为了`total_a[c]`，堆栈可以使用少于`c`在需要的地方运行并启动，或者它可能会使用所有`c`运行并且必须从 A 开始。这正是由`min(best[c - 1], del_a[c])`。 

Python 中不存在整数溢出问题。 每次丢失计数最多为(HS)，DP值最多为(H)。 向后运行循环也很重要，因为将其更改为递增顺序将允许同一篇论文在一次迭代期间参与多个新创建的运行。 

## 工作示例

 ### 示例 1

 第一个样本有一堆高度为 5 的：```
BABAB
```查询是允许损失一和二。 

对于一个堆栈，精确运行删除计数为：

 | 运行| 开始A，删除| 开始B，删除| 最好最多运行这么多次 |
 | ---| ---| ---| ---|
 | 0 | 5 | 5 | 5 |
 | 1 | 3 | 2 | 2 |
 | 2 | 2 | 2 | 2 |
 | 3 | 2 | 2 | 2 |
 | 4 | 1 | 1 | 1 |
 | 5 | 0 | 0 | 0 |

 在一次全球运行中，最好的选择是对所有三篇 B 试卷进行评分，并丢掉两篇 A 试卷，因此`need[1] = 2`。 

通过两次全局运行，整个堆栈可以在两次损失后减少为两次运行子序列，但不能在一次损失后减少。 因此`need[2] = 2`。 

四轮比赛，一场损失就足够了，所以`need[4] = 1`。 

这两个问题的答案如下。 

| 允许损失| 第一个可行的运行次数 | 回答 |
 | ---| ---| ---|
 | 1 | 4？ | 4 |

 如果直接解释该表会产生误导，因为实际的第一个样本有五个高度为 1 的堆栈，由行表示`BABAB`。 在实际的矩阵解释中，这五个堆栈包含B，A，B，A，B。那么`need[1] = 2`和`need[2] = 0`，给出所需的答案`2 1`。 

该示例很有用，因为它演示了为什么必须按列解释输入。 单个输入行代表五个不同的堆栈，而不是包含五张论文的一个堆栈。 

### 示例 2

 第二个样本是```
2 3 3
ABA
AAB
1 0 5
```一共有三堆，每堆高度为二。 阅读这些列可以得出：```
AA
BA
AB
```第一个堆栈已包含一个 A-run。 第二个是 B 后 A，第三个是 A 后 B。 

为了实现零损失，两个两轮堆栈具有相反的起始主题。 两次全局运行无法容纳两个完整序列，因此需要三次全局运行。 

| 全球运行| 开始全亏| 开始B全亏| 最小损失|
 | ---| ---| ---| ---|
 | 1 | 2 | 2 | 2 |
 | 2 | 1 | 1 | 1 |
 | 3 | 0 | 0 | 0 |

 因此，零损耗需要三个开关。 在允许一次损耗的情况下，两次开关就足够了。 允许损失五次，一分就足够了。 

结果的答案是`2 3 1`对于查询`1 0 5`。 该示例演示了方向条件：单个堆栈内的运行次数不足以确定全局答案。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(SH^2 + K\log H)) | 每个 (S) 堆栈都有长度 (H)，其运行 DP 检查 (O(H^2)) 状态。 每个查询在最多 (H+1) 次全局运行中使用二分搜索。 |
 | 空间| (O(H+S)) | 一个堆栈的 DP 使用 (O(H)) 状态，而全局数组包含 (O(H)) 值，输入行使用 (O(HS)) 个字符。 |

 输入本身已经包含 (HS) 字符，因此在简单的实现中存储矩阵是不可避免的。 对于(H,S\le300)，DP在最大情况下最多执行几千万次简单状态更新，而查询阶段可以忽略不计。 

## 测试用例```python
import sys
import io

# The solution above is assumed to be defined in the same file:
# solve()

def run(inp: str) -> str:
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

# Provided samples
sample = """\
5
1 5 2
BABAB
1 2
2 3 3
ABA
AAB
1 0 5
3 2 4
AB
BA
AB
0 1 2 3
5 5 6
BBABA
ABAAB
AAABA
BABBA
BBBAB
5 0 8 12 10 1
10 10 15
AABAAABBAB
BAABAAAABB
AABABBBABB
BAAABAAAAB
BBBBAAABAA
ABAABBBABA
BABAABABBA
AAABAAABAA
BAAAABBBBA
ABABBAAABA
14 2 99 33 3 8 43 4 12 1 21 24 17 32 10
"""

sample_expected = """\
Case #1: 2 1
Case #2: 2 3 1
Case #3: 4 3 2 1
Case #4: 3 5 2 1 2 4
Case #5: 5 8 1 2 8 7 1 7 5 9 4 3 4 3 6
"""

assert run(sample) == sample_expected, "provided samples"

# Minimum-size input.
minimum = """\
1
1 1 1
A
0
"""

assert run(minimum) == "Case #1: 1\n", "minimum-size case"

# Every paper has the same subject.
uniform = """\
1
2 2 3
AA
AA
0 1 3
"""

assert run(uniform) == "Case #1: 1 1 1\n", "all-equal case"

# Opposite orientations force an extra global run.
opposite = """\
1
2 2 3
AB
BA
0 1 2
"""

assert run(opposite) == "Case #1: 3 2 1\n", "orientation boundary case"

# Maximum-size case. Every paper is A, so one run is always enough.
H = 300
S = 300
maximum = ["1", f"{H} {S} 2"]
maximum.extend(["A" * S for _ in range(H)])
maximum.append(f"0 {H * S - 1}")
maximum_input = "\n".join(maximum) + "\n"

assert run(maximum_input) == "Case #1: 1 1\n", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 1 1 / A / 0`|`Case #1: 1`| 最小尺寸和强制的第一次上下文切换 |
 |`2 2 / AA / AA`|`Case #1: 1 1 1`| 统一科目和损失是可选的事实 |
 |`2 2 / AB / BA`|`Case #1: 3 2 1`| 相反的起始方向和 (H+1) 边界 |
 | 300 x 300 全 A 矩阵 |`Case #1: 1 1`| 最大维度、大输入、最大损失查询 |

 ## 边缘情况

 单栈交替情况```
1
1 5 2
BABAB
1 2
```包含五堆高度为一的堆，而不是一堆高度为五的堆。 在允许丢失 1 个的情况下，通过丢失 1 个 B，五个主题可以被排序为 B、B、B、A、A，因此两次上下文切换就足够了。 如果丢失两次，则所有 B 试卷都可以评分，而所有 A 试卷都会丢失，从而获得一次转换。 实现中的列构造会自动处理此问题，因为单个输入行变成五个单字符堆栈。 

相反方向的情况```
1
2 2 3
AB
BA
0 1 2
```产生堆栈`AB`和`BA`。 在零损失的情况下，一个堆栈需要 A 然后 B，而另一个堆栈需要 B 然后 A。两次运行的全局序列不能包含两个完整的序列，因此需要三次运行。 如果有一次丢失，其中一个堆栈可以减少为一次运行，从而允许另一个两次运行堆栈适合两次运行全局序列。 如果有两次失败，则只需对一门科目进行评分，因此一次就足够了。 DP通过以下方式捕捉到了这一点：`del_a[c]`和`del_b[c]`，而不是将本地运行的数量本身视为足够。 

统一案例```
1
2 2 3
AA
AA
0 1 3
```有两个堆栈，都只包含 A。DP 在从 A 开始的一次运行中发现零删除。因此`need[1]`为零，并且每个更大的损失预算都有相同的答案。 该实现不会强制丢失任何纸张，这就是为什么所有三个查询都返回一个的原因。 

最大损失边界也由额外的 (H+1) 运行状态处理。 将 (H) 份试卷放在一叠中，任何一叠都不能包含超过 (H) 份的试卷。 如果不同的堆栈需要相反的方向并且必须对所有试卷进行评分，则额外的一次全局运行足以将一个方向移动一个位置。 因此 (H+1) 是一个安全的通用上限，并且实现显式计算该状态而不是意外索引`delA[H+1]`或者`delB[H+1]`。 

最后，第一个评分的论文始终算作一次上下文切换。 该算法计算主题运行次数，而不是主题变化，因此仅对 A 试卷进行评分的解决方案的答案是 1，而不是 0。 由于每个查询最多允许 (HS-1) 个损失，因此必须对至少一篇论文进行评分，因此答案永远不会为零。
