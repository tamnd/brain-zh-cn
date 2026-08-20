---
title: "CF 102185D - \u0415\u0432\u0440\u043e\u0432\u0438\u0434\u0435\u043d\u0438\u0435"
description: "我们需要构造一首恰好 T 秒的歌曲。 合唱的长度为 A，可以重复任意多次。"
date: "2026-08-19T06:28:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102185
codeforces_index: "D"
codeforces_contest_name: "Southern Russia Open Championship \u2013 ContestSFedU 2019, Team Final."
rating: 0
weight: 102185
solve_time_s: 223
verified: true
draft: false
---

[CF 102185D - \u0415\u0432\u0440\u043e\u0432\u0438\u0434\u0435\u043d\u0438\u0435](https://codeforces.com/problemset/problem/102185/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要准确地创作一首歌曲`T`秒。 副歌有长度`A`并且可以任意重复多次。 每个现有的间奏最多可以使用一次，而每个诗句都有长度`B`并代表一个新写的副本，所以如果我们使用`k`诗句，小组必须至少能够写出`k`诗句。 

假设我们选择一些子集`N`插曲。 设其总持续时间为`x`它的大小是`m`。 然后我们需要一些数字`c`的合唱这样`x + kB + cA = T`。 

排序限制也可以用数字表示。 有`k`诗节，所以在连续的诗节之间我们至少需要`k - 1`其他部分。 所选的间奏和副歌正是可以分隔诗句的部分。 因此我们需要`m + c >= k - 1`。 

输入包含`T`,`A`， 和`B`，然后是最多 500 个间奏，其持续时间最多为 500。目标`T`可以大到`10^18`，因此由歌曲总时长索引的动态节目是不可能的。 有用的小参数是`A`,`B`，以及间奏曲数。 自从`A <= 500`，涉及余数模的状态空间`A`足够小。 

答案还有一个有用的结构界限。 如果一首有效的歌曲至少使用`A`诗句，准确删除`A`诗句并添加`B`合唱。 Their total durations are equal, because`A * B`秒被删除并且`B * A`添加秒数。 诗节数量减少，而可用分隔符的数量增加。 因此，由此产生的歌曲仍然有效。 因此，最小解总是少于`A`诗句。 

这将表面上对诗句数量的无限制搜索变为最多 500 种可能性。 

The first edge case is having no interludes. 例如，```
10 3 10
0
```有答案`1`。 一首诗已经持续了10秒，所以它构成了整首歌。 A solution that insists on having a chorus between verses would incorrectly reject it, because there is only one verse and no separation is needed.

 第二种边缘情况是零节。 例如，```
10 5 1
3
2 5 3
```有答案`0`，因为两个合唱的总持续时间已经为 10。从一节开始检查的粗心实现会错过有效答案。 

第三种边缘情况是分离条件本身。 在第一个样本中，三个主节是可能的，只是因为所选的间奏和副歌一起提供了足够的分隔符。 仅仅检查方程的总持续时间是不够的，因为仍然无法安排数值解。 

第四种边缘情况是目标可能比每​​个 DP 值大得多。 The interludes have total duration at most`500 * 500 = 250000`， 尽管`T`可以是`10^18`。 我们决不能分配与以下比例成比例的数组：`T`，以及所有涉及的算术`T`必须使用整数算术而不是关于有界机器大小的持续时间的假设。 

## 方法

 直接的强力解决方案将枚举插曲的每个子集。 对于每个子集，我们知道它的持续时间`x`及其元素数量`m`。 然后我们可以尝试所有可能数量的诗句`0`通过`A - 1`，计算所需的合唱数量，并检查持续时间和分隔符条件。 

蛮力是正确的，因为每首合法歌曲都准确地确定了使用哪些插曲、使用多少节经文以及使用多少副歌。 问题是子集枚举。 和`N = 500`， 有`2^500`子集，甚至每个子集只做一个恒定量的工作已经远远超出了限制。 尝试达到`A`诗节计数使简单版本大致`O(A * 2^N)`。 

关键的观察是合唱的数量不受限制。 一旦我们知道所选插曲的总持续时间模`A`，方程`x + kB + cA = T`决定了可能的值`k`模数`A`。 由于最小答案总是小于`A`，对于每个残基，至多有一个候选最小值`k`。 

剩下的问题是所选间奏的数量，因为每个所选间奏也是一个分隔符。 我们用有界子集和 DP 来解决这个问题。 对于每个可能数量的选定插曲和每个余数模`A`，我们存储实现该状态的最小总插曲持续时间。 

我们不需要区分大于或等于的计数`A - 1`。 每一位候选人`k`下面是`A`，因此分隔符条件仅询问间奏的数量是否已达到以下某个阈值`A`。 我们至少对所有计数使用一个上限 DP 状态`A - 1`。 这使 DP 保持在`O(N A^2)`状态和转换。 

比较结果为：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(A * 2^N)`|`O(1)`除了子集状态 | 太慢了 |
 | 最佳DP |`O(N A^2)`|`O(A^2)`| 已接受 |

 ## 算法演练

 1.让`m`是所选插曲的数量，`x`他们的总持续时间。 对于固定数量的诗句`k`，歌曲必须满足`x + kB + cA = T`。 

该安排恰好可以在以下时间进行：`m + c >= k - 1`。 
2.证明考虑足够`0 <= k < A`。 如果一首有效的歌曲有`k >= A`， 消除`A`诗句并添加`B`合唱。 这两个操作都会改变持续时间`AB`，因此持续时间保持不变。 分隔符的数量没有减少，而诗节的数量却减少了。 重复这个转换最终会得到一首有效的歌曲，其数量少于`A`诗句。 
3. 对于每一种可能的残留物`r`模数`A`，找到最小的`k`在`[0, A - 1]`满意的`kB ≡ T - r (mod A)`。 

这可以简单地通过枚举最多`A`的可能值`k`并记录每一个对应于哪个残基。 某些残留物可能无法溶解`gcd(A, B)`不分开`T - r`。 
4.构建DP子集。 让`dp[m][r]`是恰好包含的子集的最小总持续时间`m`间奏和持续时间一致`r`模数`A`。 

我们只在下面存储准确的计数`A - 1`。 最后一个状态，`m = A - 1`, 意味着至少`A - 1`精选的插曲。 

处理持续时间的插曲时`s`, 过渡自`m`到`m + 1`并从残留物中`r`到`(r + s) % A`。 计数维度被向后处理，以便每个插曲最多使用一次。 
5. 对于每个残基`r`, 获取其候选者`k`。 如果没有候选者，则该残留物无法产生具有尽可能少的诗句的歌曲。 
6. 对于每个 DP 状态代表`m`选定的间奏，计算间奏加上分隔符条件强制的副歌所占用的最小秒数。 

如果`m >= k - 1`，不需要额外的副歌，所以所需的非主歌持续时间很简单`x`。 

如果`m < k - 1`，至少`k - m - 1`需要合唱，因此非主歌时长为`x + A * (k - m - 1)`。 
7. 令所需的最小非诗句持续时间为`need`。 诗句之后的剩余持续时间是`T - kB`。 候选人在以下情况下是可行的：`need <= T - kB`。 

剩余的差值是非负倍数`A`，因此可以填充额外的合唱。 
8. 取最小的可行值`k`覆盖所有残留物。 

工作原理：DP 包含每一个可能的插曲子集，按其计数和持续时间模数分组`A`，并存储每个此类状态的最小持续时间。 对于固定的残数，同余性决定了可能的最小节数。 对于最小解决方案来说，不需要更多数量的经文。 然后 DP 检查精确地添加分隔诗句所需的最小数量的副歌。 如果结果持续时间适合`T`，未使用的持续时间可除以`A`并可以填充任意额外的合唱。 相反，每首有效歌曲对应一个 DP 状态和一个候选残差，因此不会错过有效的最小解。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

def solve_case(T, A, B, S):
    n = len(S)

    # A minimum answer is always < A.
    # We only need exact counts below A - 1.
    # The last state represents all counts >= A - 1.
    K = min(n, A - 1)

    dp = [[INF] * A for _ in range(K + 1)]
    dp[0][0] = 0

    for s in S:
        # We only transition from exact states m < K.
        # The state K is already "at least K", and adding the
        # current item cannot improve its minimum sum.
        for m in range(K - 1, -1, -1):
            cur = dp[m]
            nxt = dp[m + 1]

            for r in range(A):
                x = cur[r]
                if x == INF:
                    continue

                nr = (r + s) % A
                nx = x + s
                if nx < nxt[nr]:
                    nxt[nr] = nx

    # candidate[r] = smallest k in [0, A - 1] satisfying
    # k * B == T - r (mod A).
    candidate = [-1] * A

    for k in range(A):
        r = (T - k * B) % A
        if candidate[r] == -1:
            candidate[r] = k

    answer = A

    for r in range(A):
        k = candidate[r]
        if k == -1:
            continue

        verse_time = k * B
        if verse_time > T:
            continue

        budget = T - verse_time

        for m in range(K + 1):
            x = dp[m][r]
            if x == INF:
                continue

            if m < k - 1:
                x += A * (k - m - 1)

            if x <= budget:
                answer = min(answer, k)
                break

    return -1 if answer == A else answer

def solve():
    T, A, B = map(int, input().split())
    N = int(input())

    if N:
        S = list(map(int, input().split()))
    else:
        S = []

    print(solve_case(T, A, B, S))

if __name__ == "__main__":
    solve()
```第一部分实施集`K = min(N, A - 1)`。 DP 不需要大于`A - 1`，因为每个候选诗节数都小于`A`。 最后一个状态代表至少具有以下特征的所有子集`A - 1`元素。 

过渡迭代`m`向后。 这是就地实现零或一子集转换的标准方法。 国家`K`故意不用作转换源。 由于它已经代表了每个足够大的计数，因此添加另一个插曲只能增加持续时间，同时保持状态处于相同的资格类别。 它无法提高存储在那里的最短持续时间。 

这`candidate`array 避免了为每个留数单独求解模方程。 我们列举了所有可能的情况`k`一次并计算残差`r = (T - kB) mod A`。 

如果两个值`k`产生相同的残数，较小的残数将是唯一相关的，因为任务要求最少的节数。 

最后的循环检查每个残基和每个 DP 计数。 什么时候`m < k - 1`，缺失的分隔符必须由合唱团提供，这有助于`A * (k - m - 1)`秒。 什么时候`m >= k - 1`，排序条件不会强制合唱。 

所有持续时间计算都使用 Python 整数，因此`10^18`绑定于`T`不会导致溢出。 DP 本身最多仅包含总间奏持续时间的值`250000`，加上小的分隔符修正。 

## 工作示例

 ### 示例 1

 输入是```
100 11 20
3
13 7 24
```有用的候选者是仅包含持续时间插曲的子集`7`。 其余数取模`11`是`7`。 对于这个残渣，`3 * 20 ≡ 100 - 7 (mod 11)`,

 所以最小的候选者是`k = 3`。 

相关的DP状态和最终检查是：

 |`m`|`r`|`x`|`k`| 强迫合唱| 所需的非节拍时间 | 预算|
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 7 | 7 | 3 |`3 - 1 - 1 = 1`|`7 + 11 = 18`|`100 - 60 = 40`|

 剩余的 22 秒不用于强制合唱计算，因为方程是按模处理的`A`。 在选定的间奏和三段主歌之后，33秒可以由三段副歌占据，`7 + 3 * 20 + 3 * 11 = 100`。 

因此答案是`3`。 

### 示例 2

 输入是```
10 5 1
3
2 5 3
```对于零节，空子集有残差`0`， 和`T = 10`可以整除`A = 5`。 DP 开头为`dp[0][0] = 0`。 

候选人是`k = 0`，并且因为没有诗句，所以不需要分隔符。 

|`m`|`r`|`x`|`k`| 强迫合唱| 所需的非节拍时间 | 预算|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 0 | 0 | 0 | 0 | 10 | 10

 剩下的10秒充满了两段副歌。 因此最少的诗句数是`0`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(N A^2)`| 有`N`间奏，`O(A)`计算州数，以及`O(A)`残留物|
 | 空间|`O(A^2)`| DP最多有`A`计算州和`A`残留物|

 这里`N <= 500`和`A <= 500`，因此理论界限最多约为 1.25 亿次简单 DP 状态检查。 内存消耗仅为约250000个整数状态。 最重要的是，该算法从不依赖于`T`作为 DP 维度，这是必要的，因为`T`可以达到`10^18`。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve_case(T, A, B, S):
    INF = 10**30
    n = len(S)

    K = min(n, A - 1)

    dp = [[INF] * A for _ in range(K + 1)]
    dp[0][0] = 0

    for s in S:
        for m in range(K - 1, -1, -1):
            cur = dp[m]
            nxt = dp[m + 1]

            for r in range(A):
                x = cur[r]
                if x == INF:
                    continue

                nr = (r + s) % A
                nx = x + s
                if nx < nxt[nr]:
                    nxt[nr] = nx

    candidate = [-1] * A

    for k in range(A):
        r = (T - k * B) % A
        if candidate[r] == -1:
            candidate[r] = k

    answer = A

    for r in range(A):
        k = candidate[r]
        if k == -1:
            continue

        budget = T - k * B
        if budget < 0:
            continue

        for m in range(K + 1):
            x = dp[m][r]
            if x == INF:
                continue

            if m < k - 1:
                x += A * (k - m - 1)

            if x <= budget:
                answer = min(answer, k)
                break

    return -1 if answer == A else answer

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    try:
        T, A, B = map(int, input().split())
        N = int(input())
        S = list(map(int, input().split())) if N else []
        return str(solve_case(T, A, B, S))
    finally:
        sys.stdin = old_stdin

# Provided samples
assert run("""100 11 20
3
13 7 24
""") == "3", "sample 1"

assert run("""10 5 1
3
2 5 3
""") == "0", "sample 2"

assert run("""8 9 2
2
1 2
""") == "-1", "sample 3"

assert run("""10 3 10
0
""") == "1", "sample 4"

# Minimum-size input.
assert run("""1 1 1
0
""") == "0", "minimum-size case"

# No interludes, with the verse being the only possible construction.
assert run("""10 3 10
0
""") == "1", "single verse boundary case"

# All interludes equal to the chorus length.
# The empty subset already works because T is divisible by A.
assert run("""6 3 2
4
3 3 3 3
""") == "0", "all-equal interludes"

# Maximum-size N and very large T.
large_interludes = " ".join(["500"] * 500)
assert run(f"""1000000000000000000 500 499
500
{large_interludes}
""") == "0", "maximum-size and large-T case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 1`,`N=0`|`0`| 最小值和零宇宙情况 |
 |`10 3 10`,`N=0`|`1`| 一首诗可以组成整首歌 |
 |`6 3 2`, 四个插曲`3`|`0`| 所有间奏都等于合唱持续时间|
 |`T=10^18`,`A=500`,`B=499`, 500 个插曲`500`|`0`| 最大限度`N`、最大持续时间和巨大`T`|

 ## 边缘情况

 零节情况可以通过允许直接处理`k = 0`。 在第二个样本中，空子集的残差为零，并且`T`是的倍数`A`，所以 DP 发现`dp[0][0] = 0`并立即接受。 

当只有一节时，分隔符要求是`k - 1 = 0`。 因此，诗节之间不需要合唱或间奏。 输入```
10 3 10
0
```有`k = 1`,`c = 0`，总持续时间为 10，所以答案是`1`。 

什么时候`A = 1`，每个持续时间都有余数零模`A`。 候选人`k = 0`始终存在，任何目标持续时间都可以完全由合唱填充。 DP 也仍然有效，因为它的残差尺寸为一。 

什么时候`N = 0`，DP 仅包含空子集。 这已经足够了，因为合唱是无限的，因此所有剩余的持续时间必须由合唱提供，唯一的问题是诗节计数是否具有正确的剩余模数`A`。 

分隔符条件与模方程分开处理。 子集可能具有完全正确的持续时间残差，但包含的间奏太少而无法分隔所有诗节。 表达式`A * (k - m - 1)`准确添加缺失的合唱分隔符，防止这样的子集被错误地接受。 

的巨大价值`T`不影响DP大小。 例如，与`T = 10^18`，所有插曲总和仍受`250000`。 DP 只处理这些小额款项，而`T`用于最终的算术检查。
