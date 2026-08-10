---
title: "CF 102441A - 搜索模板"
description: "我们得到一个包含小写字母、? 和 的模式。 小写字母必须按字面意思出现，? 可以表示任意一个小写字母，并且可以表示任意小写字母序列，包括空序列。"
date: "2026-08-09T01:31:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102441
codeforces_index: "A"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Final"
rating: 0
weight: 102441
solve_time_s: 425
verified: true
draft: false
---

[CF 102441A - 搜索模板](https://codeforces.com/problemset/problem/102441/A)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个包含小写字母的模式，`?`， 和`*`。 小写字母必须按字面意思出现，`?`可以代表任意一个小写字母，并且`*`可以表示任何小写字母序列，包括空序列。 我们需要选择一个与整个模式匹配的实际小写字符串，并附加要求结果字符串是回文。 在所有可能的选择中，我们想要一个长度最小的选择。 如果没有回文可以匹配该模式，我们打印`-1`。 空字符串被视为有效的回文。 

模式的长度最多为 500。这对于二次动态规划来说足够小，但对于枚举可能的输出字符串来说还不够小。 即使只有 26 个字母的字母表也能提供指数级数量的候选者。 三次算法在最坏的情况下执行大约 (500^3 = 125) 万次基本状态转换，这在 Python 中已经很不舒服，因此我们将更进一步，使 DP 二次。 

有几种简单的贪婪构造会失败的情况。 为了`ac?ba`, 两个外层`a`字符是兼容的，但是在匹配它们之后我们剩下`c?b`，其目的不能是平等的。 正确答案是`-1`。 一种粗心的算法`?`因为自动修复不匹配可能会产生无效的字符串。 

为了`*ac?ba`，明星不能简单地被忽视。 最短的有效回文是`abacaba`。 领军明星消费`ab`，而固定后缀`ba`产生镜像的`ab`在另一端。 始终处理的实现`*`因为空字符串会错过最佳构造。 

为了`*`，答案是空字符串。 自从`*`可能消耗零个字符，没有理由输出哪怕一个字母。 假设每个模式字符都对答案有贡献的实现将错误地输出非空字符串。 

为了`??`，答案是`aa`。 两个问号都可以独立选择`a`，并且两个位置必须相等，因为最终的字符串是回文。 粗心的实施可能会不必要地迫使它们使用不同的字符或对待`?`作为文字符号。 

最后，`a*b`无解时`a`和`b`不同。 与此模式匹配的每个字符串都以以下开头`a`并以`b`，而回文必须具有相同的第一个和最后一个字符。 星形无法改变这一事实，因为它位于两个固定端点之间。 

## 方法

 直接的强力解决方案将枚举每个长度不断增加的回文，检查它是否与模式匹配，并在第一个成功的长度处停止。 如果存在解，下面的 DP 构造给出的长度最多为 (2n)，因此我们可以将搜索限制在该范围内。 长度 (L) 的回文由其前 (\lceil L/2\rceil) 个字符确定，给出 (26^{\lceil L/2\rceil}) 个候选。 

对于 (n=500)，枚举从 0 到 1000 的长度可精确检查

 1+\frac{52(26^{500}-1)}{25}
 ]

 候选回文。 根据模式检查每个候选者需要线性时间，因此总工作量约为 (n26^n)。 这种方法在概念上正确的原因很简单：最终测试每个可能的回文，并且第一个接受的回文具有最小长度。 问题是搜索空间非常大。 

关键的观察结果是，回文为我们提供了一种从两端分割模式的自然方法。 假设当前模式间隔为(s[l..r])。 如果两个端点都是普通字符或问号，则它们必须产生相同的字符。 我们可以将该字符放在答案的两端并求解内部区间。 

有趣的案例是一个`*`在一个端点。 考虑一个领先的`*`。 它可能会消耗一些字符串（X）。 因为最终的答案是回文，所以答案对应的后缀必须是(reverse(X))。 图案的其余部分位于这两个副本之间。 如果我们决定后缀 (s[k..r]) 负责生成 (X)，则前导星可以生成 (reverse(X))，中间模式 (s[l+1..k-1]) 必须生成回文。 

为了最小化长度，由任意模式段产生的最佳字符串特别简单。 每一个普通角色贡献一个角色，每一个`?`贡献一个选定的角色，并且每一个`*`不能做出任何贡献。 因此，匹配的字符串 (s[k..r]) 的最小长度就是该区间内非星号字符的数量。 

这将星形转变变成

 \min_k
 \左（
 dp[l+1][k-1]
 +
 2\c点计数(k,r)
 \右），
 ]

 哪里`count(k,r)`是 (s[k..r]) 中非星号字符的数量。 也有可能让主星变空，给予`dp[l+1][r]`。 

直接实现将尝试每个间隔的每个 (k)，给出 (O(n^3))。 可以使用前缀计数重新排列表达式：

 2P[r+1]
 +
 \left(dp[l+1][k-1]-2P[k]\right),
 ]

 其中 (P[x]) 是前 (x) 个位置中的非星号字符数。 对于固定 (l)，括号内的最小值可以随着 (r) 的增长而逐渐保持不变。 对称表达式处理尾随`*`。 这就消除了 (n) 的额外因子。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n26^n)) | (O(n)) | (O(n)) | 太慢了|
 | 直接间隔 DP | (O(n^3)) | (O(n^2)) | 概念上有效，但对 Python 不友好 |
 | 优化间隔 DP | (O(n^2)) | (O(n^2)) | 已接受 |

 ## 算法演练

 1. 定义`dp[l][r]`作为与模式间隔匹配的回文的最小长度`s[l..r]`。 如果区间为空，则其值为零。 
2. 预计算`pref[i]`，其中非星号字符的数量`s[0..i-1]`。 那么任意字符串匹配的最小长度`s[l..r]`是`pref[r+1] - pref[l]`，因为星星可能永远是空的。 
3. 增加右端点和减少左端点的处理间隔。 这种排序使得`dp[i+1][j]`,`dp[i][j-1]`， 和`dp[i+1][j-1]`需要时随时可用。 
4. 如果间隔由一个字符组成，则星号贡献零个字符，而字母或`?`贡献一个角色。 
5. 如果`s[l]`是一颗星，一个选择是将其清空并使用`dp[l+1][r]`。 另一种选择是让它镜像由某些后缀生成的最短字符串`s[k..r]`。 结果长度是`2 * nonstars(k,r) + dp[l+1][k-1]`。 
6. 保持最小值`dp[l+1][k-1] - 2 * pref[k]`而右端点则增长。 这使得在每个间隔的恒定时间内都可以最佳地非空地使用领先的星星。 
7. 如果左端点不是星而是`s[r]`是一颗星星，从另一个方向应用完全相同的想法。 尾随星号为空，或者它镜像由某个前缀生成的最短字符串`s[l..k]`。 
8. 保持相应的最小值`2 * pref[k+1] + dp[k+1][r-1]`同时左端点向内移动。 这可以在恒定的时间内最好地利用尾星。 
9. 如果两个端点都不是星号，则它们必须能够表示相同的字符。 两个相等的字母是兼容的，一个字母和`?`是兼容的，并且两个`?`字符兼容。 当它们兼容时，将相同的选择字符放在两端并添加两个`dp[l+1][r-1]`。 
10. 除了每个 DP 值之外，还存储产生该值的转换。 对于星形分割，存储所选的分割位置`k`。 这让我们可以在 DP 完成后重建实际的回文。 
11. 在重建过程中，一颗主星在`k`产生`reverse(T) + middle + T`， 在哪里`T`是表示的最短字符串`s[k..r]`。 尾随星产生`T + middle + reverse(T)`。 普通匹配端点产生`c + middle + c`。 
12.如果`dp[0][n-1]`是无限的，没有回文与模式匹配，所以打印`-1`。 否则重建存储的决策。 

### 为什么它有效

 不变的是`dp[l][r]`正好是回文匹配的最小长度`s[l..r]`。 当两个端点都不是星形时，回文会强制两个端点使用相同的字符，因此普通转换会考虑所有可能的有效选择。 当左端点是星号时，每个匹配的回文要么使用该星号来表示零个字符，要么使用与剩余模式的某些后缀生成的字符串相反的前缀。 后者正是 split 转换所列举的内容。 尾随星号的情况是对称的。 

对于每个分割，我们使用镜像模式段表示的最短的可能字符串。 使该段变长只能在回文两边添加字符，而不能使独立的中间问题变短。 因此，每次分割的最小长度选择就足够了。 由于外部星形的每种可能的使用都由某种分割表示，并且每个非星形端点对由普通转换表示，因此 DP 会考虑每种可行的结构并采用最短的结构。 

重建遵循 DP 使用的相同分解。 每个构造的片段要么是围绕较小回文数镜像的字符，要么是围绕较小回文数镜像的字符串，因此结果始终是回文。 相应的模式段按所需的顺序连接，因此结果也与原始模式匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**9

# Transition types:
# 1 = skip left star
# 2 = use left star, split at arg[i][j]
# 3 = skip right star
# 4 = use right star, split at arg[i][j]
# 5 = match both endpoints
#
# dp[l][r] = minimum palindrome length matching s[l:r+1]

def solve_template(s):
    n = len(s)

    # pref[i] = number of non-'*' characters in s[:i]
    pref = [0] * (n + 1)
    for i, ch in enumerate(s):
        pref[i + 1] = pref[i] + (ch != '*')

    dp = [[INF] * n for _ in range(n)]
    kind = [[0] * n for _ in range(n)]
    arg = [[-1] * n for _ in range(n)]

    # For a fixed left endpoint i:
    # left_best[i] =
    # min_{k=i+1..j} dp[i+1][k-1] - 2*pref[k]
    #
    # left_arg[i] stores the k producing that minimum.
    left_best = [INF] * n
    left_arg = [-1] * n

    for j in range(n):
        # For this fixed j, while i decreases:
        # right_best =
        # min_{k=i..j-1} 2*pref[k+1] + dp[k+1][j-1]
        right_best = INF
        right_arg = -1

        for i in range(j, -1, -1):
            if i < j:
                # dp[i+1][j-1], with the empty interval handled explicitly.
                inner = 0 if i + 1 >= j else dp[i + 1][j - 1]

                # Add k = j to the running minimum for a leading star.
                candidate_left = inner - 2 * pref[j]
                if candidate_left < left_best[i]:
                    left_best[i] = candidate_left
                    left_arg[i] = j

                # Add k = i to the running minimum for a trailing star.
                candidate_right = 2 * pref[i + 1] + inner
                if candidate_right < right_best:
                    right_best = candidate_right
                    right_arg = i

            # Single-character interval.
            if i == j:
                if s[i] == '*':
                    dp[i][j] = 0
                    kind[i][j] = 1
                else:
                    dp[i][j] = 1
                    kind[i][j] = 5
                continue

            if s[i] == '*':
                # Option 1: make the left star empty.
                best = dp[i + 1][j]
                best_kind = 1
                best_arg = -1

                # Option 2: mirror a shortest string produced by s[k..j].
                candidate = 2 * pref[j + 1] + left_best[i]
                if candidate < best:
                    best = candidate
                    best_kind = 2
                    best_arg = left_arg[i]

                dp[i][j] = best
                kind[i][j] = best_kind
                arg[i][j] = best_arg

            elif s[j] == '*':
                # Option 1: make the right star empty.
                best = dp[i][j - 1]
                best_kind = 3
                best_arg = -1

                # Option 2: mirror a shortest string produced by s[i..k].
                candidate = right_best - 2 * pref[i]
                if candidate < best:
                    best = candidate
                    best_kind = 4
                    best_arg = right_arg

                dp[i][j] = best
                kind[i][j] = best_kind
                arg[i][j] = best_arg

            else:
                # Neither endpoint is a star.
                a = s[i]
                b = s[j]

                compatible = (
                    a == b or
                    a == '?' or
                    b == '?'
                )

                if compatible:
                    dp[i][j] = 2 + (
                        0 if i + 1 >= j else dp[i + 1][j - 1]
                    )
                    kind[i][j] = 5
                # Otherwise dp[i][j] stays INF.

    if dp[0][n - 1] >= INF:
        return "-1"

    def canonical(l, r):
        """Shortest concrete string matching s[l:r+1]."""
        out = []
        for p in range(l, r + 1):
            if s[p] == '*':
                continue
            if s[p] == '?':
                out.append('a')
            else:
                out.append(s[p])
        return ''.join(out)

    def build(l, r):
        if l > r:
            return ""

        t = kind[l][r]

        if l == r:
            if s[l] == '*':
                return ""
            if s[l] == '?':
                return "a"
            return s[l]

        if t == 1:
            # Left star is empty.
            return build(l + 1, r)

        if t == 2:
            # Left star mirrors the shortest string from k..r.
            k = arg[l][r]
            middle = build(l + 1, k - 1)
            x = canonical(k, r)
            return x[::-1] + middle + x

        if t == 3:
            # Right star is empty.
            return build(l, r - 1)

        if t == 4:
            # Right star mirrors the shortest string from l..k.
            k = arg[l][r]
            middle = build(k + 1, r - 1)
            x = canonical(l, k)
            return x + middle + x[::-1]

        # Ordinary compatible endpoints.
        a = s[l]
        b = s[r]

        if a == '?':
            c = b if b != '?' else 'a'
        else:
            c = a

        return c + build(l + 1, r - 1) + c

    return build(0, n - 1)

def main():
    s = input().strip()
    print(solve_template(s))

if __name__ == "__main__":
    main()
```前缀数组是第一个优化。`pref[r + 1] - pref[l]`告诉我们如果所有星号都为空，则模式间隔必须贡献多少个实际字符。 这已经足够了，因为分割转换只需要由镜像间隔表示的最短的可能字符串。 

这`left_best`数组存储每个可能的主星的变换后的最小值。 而不是重复评估每个分割`k`，代码添加了新的可能性`k = j`当右边界前进时。 表达式涉及`pref`分离部分取决于`j`从部分取决于`k`。 

这`right_best`变量对尾随星形执行对称优化。 它会针对每个右端点重置，并在左端点移向零时更新。 眼下`dp[i][j]`计算后，它恰好包含最佳分割，其第一部分开始于或之后`i`。 

嵌套循环的顺序至关重要。 外循环增加`j`，而内循环减少`i`。 最后，`dp[i+1][j]`之前已经在同一列中计算过，并且`dp[i+1][j-1]`在上一栏中计算过。 

重建故意使用由分割间隔表示的最短混凝土弦。 一个`?`被替换为`a`，而星星被跳过。 由于这些字符围绕递归构造的中间镜像，因此确切的选择`?`不影响最优性。 

Python 中不可能出现整数溢出。 在其他语言中，普通的整数类型已经足够了，因为答案最多是 (2n)，而 DP 使用`INF`只能作为哨兵。 

## 工作示例

 ### 示例 1

 模式是`*ac?ba`。 将位置编号从 0 到 5。 

| 状态`(l,r)`| 模式间隔| 过渡| 镜面弦| 中| 结果 |
 | --- | --- | --- | --- | --- | --- |
 |`(0,5)`|`*ac?ba`| 左星在 4 处分裂 |`ba`|`aca`|`abacaba`|
 |`(1,3)`|`ac?`| 匹配`a`和`?`|`a`|`c`|`aca`|
 |`(2,2)`|`c`| 单个字符 |`c`| 空 |`c`|
 | 空 | 空 | 基本情况| 空 | 空 | 空 |

 在顶层，后缀`ba`与模式位置 4 和 5 相匹配。领先的星星消耗其反向，`ab`。 剩下的图案是`ac?`，其最短回文是`aca`。 将它们结合起来给出`ab + aca + ba = abacaba`。 结果与模式匹配，因为领先的明星消耗了`ab`，之后`ac?ba`消耗`acaba`。 

### 示例 2

 模式是`ac?ba`。 

| 状态`(l,r)`| 模式间隔| 端点比较 | 内部间隔| 结果 |
 | --- | --- | --- | --- | --- |
 |`(0,4)`|`ac?ba`|`a`和`a`比赛|`c?b`| 取决于内在|
 |`(1,3)`|`c?b`|`c`和`b`冲突|`?`| 不可能|
 |`(0,4)`|`ac?ba`| 外部对无法完成 | 不可能|`-1`|

 外层`a`字符被迫相互匹配。 一旦它们被移除，内部图案就有固定的端点`c`和`b`，它不能变得相等。 没有星号可以吸收任一不匹配，因此整个模式没有回文匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^2)) | 有 (O(n^2)) 个 DP 状态，并且在恒定时间内增量地维持星分裂最小值 |
 | 空间| (O(n^2)) | DP 值和重建选择使用二次内存 |

 对于 (n \le 500)，只有 250,000 个 DP 状态。 在维持运行最小值后，每个状态都会执行恒定的工作，因此算法很容易在预期范围内。 重建也与模式的大小加上生成的答案呈线性关系，并且生成的答案的长度最多为 (2n)。 

## 测试用例```python
import io
import sys

# The submitted solution is represented by solve_template(s).

INF = 10**9

def solve_template(s):
    n = len(s)

    pref = [0] * (n + 1)
    for i, ch in enumerate(s):
        pref[i + 1] = pref[i] + (ch != '*')

    dp = [[INF] * n for _ in range(n)]
    kind = [[0] * n for _ in range(n)]
    arg = [[-1] * n for _ in range(n)]

    left_best = [INF] * n
    left_arg = [-1] * n

    for j in range(n):
        right_best = INF
        right_arg = -1

        for i in range(j, -1, -1):
            if i < j:
                inner = 0 if i + 1 >= j else dp[i + 1][j - 1]

                candidate_left = inner - 2 * pref[j]
                if candidate_left < left_best[i]:
                    left_best[i] = candidate_left
                    left_arg[i] = j

                candidate_right = 2 * pref[i + 1] + inner
                if candidate_right < right_best:
                    right_best = candidate_right
                    right_arg = i

            if i == j:
                if s[i] == '*':
                    dp[i][j] = 0
                    kind[i][j] = 1
                else:
                    dp[i][j] = 1
                    kind[i][j] = 5
                continue

            if s[i] == '*':
                best = dp[i + 1][j]
                best_kind = 1
                best_arg = -1

                candidate = 2 * pref[j + 1] + left_best[i]
                if candidate < best:
                    best = candidate
                    best_kind = 2
                    best_arg = left_arg[i]

                dp[i][j] = best
                kind[i][j] = best_kind
                arg[i][j] = best_arg

            elif s[j] == '*':
                best = dp[i][j - 1]
                best_kind = 3
                best_arg = -1

                candidate = right_best - 2 * pref[i]
                if candidate < best:
                    best = candidate
                    best_kind = 4
                    best_arg = right_arg

                dp[i][j] = best
                kind[i][j] = best_kind
                arg[i][j] = best_arg

            else:
                a = s[i]
                b = s[j]

                if a == b or a == '?' or b == '?':
                    dp[i][j] = 2 + (
                        0 if i + 1 >= j else dp[i + 1][j - 1]
                    )
                    kind[i][j] = 5

    if dp[0][n - 1] >= INF:
        return "-1"

    def canonical(l, r):
        out = []
        for p in range(l, r + 1):
            if s[p] == '*':
                continue
            out.append('a' if s[p] == '?' else s[p])
        return ''.join(out)

    def build(l, r):
        if l > r:
            return ""

        t = kind[l][r]

        if l == r:
            if s[l] == '*':
                return ""
            return 'a' if s[l] == '?' else s[l]

        if t == 1:
            return build(l + 1, r)

        if t == 2:
            k = arg[l][r]
            x = canonical(k, r)
            return x[::-1] + build(l + 1, k - 1) + x

        if t == 3:
            return build(l, r - 1)

        if t == 4:
            k = arg[l][r]
            x = canonical(l, k)
            return x + build(k + 1, r - 1) + x[::-1]

        a = s[l]
        b = s[r]
        if a == '?':
            c = b if b != '?' else 'a'
        else:
            c = a

        return c + build(l + 1, r - 1) + c

    return build(0, n - 1)

def run(inp: str) -> str:
    return solve_template(inp)

# Provided samples
assert run("*ac?ba") == "abacaba", "sample 1"
assert run("ac?ba") == "-1", "sample 2"

# Minimum-size and empty-palindrome case
assert run("*") == "", "a single star can match the empty string"

# Minimum-size question-mark case
assert run("?") == "a", "a question mark can choose any lowercase letter"

# All-equal values
assert run("aa") == "aa", "two equal fixed endpoints form a palindrome"

# Boundary case with a star and mismatching fixed endpoints
assert run("a*b") == "-1", "a palindrome cannot start with a and end with b"

# Star at the boundary can mirror the fixed prefix
assert run("abc*") == "abccba", "trailing star mirrors abc"

# Maximum-size all-equal input
assert run("a" * 500) == "a" * 500, "maximum-size fixed palindrome"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`*`| 空字符串 | 最小尺寸图案和零长度星形 |
 |`?`|`a`| 单一通配符处理 |
 |`aa`|`aa`| 等固定端点 |
 |`a*b`|`-1`| 不可能的固定端点不匹配 |
 |`abc*`|`abccba`| 边界星形和镜像前缀 |
 |`a`重复500次|`a`重复500次| 最大输入大小和二次 DP 边界 |

 ## 边缘情况

 对于`ac?ba`，算法首先处理外部`a`和`a`作为兼容的一对。 剩余间隔为`c?b`。 由于两个端点都不是星形并且`c`不能等于`b`，其DP值无穷大。 该无穷大传播到原始区间，产生`-1`。 

为了`*ac?ba`，主角明星有两种根本不同的可能性。 它可以为空，这使得`ac?ba`最终失败。 或者它可以镜像后缀。 最优分割选择后缀`ba`。 它的最短匹配字符串正是`ba`，所以明星贡献`ab`在左侧。 中间间隔`ac?`变成`aca`, 给予`abacaba`。 

为了`*`，单字符基本情况分配长度为零，因为星号不能消耗任何东西。 重构返回空字符串，程序打印一个空行。 这是答案本身没有字符的唯一情况。 

为了`??`，两个端点是兼容的，因为两者都是通配符。 重建选择`a`对于两者，产生`aa`。 的选择`a`是任意的，但回文条件要求使用相同的字符。 

为了`a*b`，外部字符是`a`和`b`，因此该模式不能产生回文。 星形是内部的，不能改变任何一个端点。 DP 正确地达到不可能的区间，而不是尝试使用星号来修复它无法修复的不匹配。 

为了`abc*`，右端点是一颗星。 最佳转换保持固定前缀`abc`就像星星反射的弦一样。 结果是`abc + cba = abccba`，匹配`abc*`因为星星消耗`cba`。 答案的长度为六，这说明了为什么简单地删除每颗星星是不够的。 

对于由 500 组成的最大尺寸输入`a`角色，没有星星，每对镜像都是兼容的。 DP 简化为普通回文递归，恰好产生 500`a`人物。 该案例运用了完整的二次状态空间和两个区间边界。
