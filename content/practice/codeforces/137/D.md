---
title: "CF 137D - 回文"
description: "给定一个字符串和一个整数 k。 我们可以更改任何我们想要的字符，目标是将字符串转换为最多 k 个回文的串联，同时最小化修改字符的数量。 分区边界不固定。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "strings"]
categories: ["algorithms"]
codeforces_contest: 137
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 98 (Div. 2)"
rating: 1900
weight: 137
solve_time_s: 129
verified: true
draft: false
---

[CF 137D - 回文](https://codeforces.com/problemset/problem/137/D)

 **评级：** 1900
 **标签：** dp、字符串
 **求解时间：** 2m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定一个字符串和一个整数`k`。 我们可以改变任何我们想要的字符，目标是将字符串转换成最多`k`回文，同时最小化修改字符的数量。 

分区边界不固定。 我们必须决定在哪里分割字符串以及在每个部分内更改哪些字符。 

例如，如果字符串是`abcdef`和`k = 2`，一种可能的分区是：`abc | def`车削`abc`成回文成本`1`更改，因为只有一对镜像不同。 对于`def`。 总成本变为`2`。 

另一个分区可能会给出较小的答案，因此我们必须搜索所有有效的分段。 

字符串长度最多为`500`。 这个大小对于三次复杂度的动态规划来说足够小，但是任何指数级的事情都是不可能的。 暴力分区枚举大约涉及`2^(n-1)`分割字符串的方法，即使对于`n = 50`。 

隐藏的困难是每个子串都有自己的回文转换成本。 在 DP 内部重复重新计算该成本会引入另一个因素`O(n)`，使得总复杂度太大。 我们需要一种方法来回答：

 “需要改变多少个字符才能生成子串`s[l:r]`回文？”

 预处理后在恒定时间内。 

有几种边缘情况很容易破坏粗心的实现。 

考虑：```
s = "abc"
k = 3
```最优答案是`0`，因为我们可以分为：```
a+b+c
```每个字符都已经是回文。 精确强制的解决方案`k`段而不是“最多`k`" 可能会意外地使 DP 变得过于复杂。

 另一个微妙的情况是：```
s = "ab"
k = 1
```答案是`1`。 任何一个`aa`或者`bb`作品。 错误地计算不匹配对的幼稚实现可能会认为两个字符都必须更改并返回`2`。 

混合大小写字母也很重要：```
s = "Aa"
k = 1
```这仍然需要一项修改，因为`'A' != 'a'`。 

最后，重构很容易出错。 认为：```
s = "abcdef"
k = 2
```最低成本还不够。 我们还必须输出一个实际转换后的字符串`+`分隔符。 如果我们在 DP 期间不存储父母的决定，那么之后重建答案就会变得困难。 

## 方法

 蛮力方法在概念上很简单。 

我们可以尝试将字符串的每个可能的分区最多分为`k`件。 对于每个片段，我们计算有多少镜像字符对不同。 每对不同的都贡献一个所需的修改。 

对于长度为的子串`m`，计算其回文成本直接需要`O(m)`时间。 由于分区数量呈指数级增长，因此总复杂度变得非常大。 

即使我们使用DP改进分区搜索，重复重新计算回文成本仍然很昂贵。 假设我们定义：`dp[i][j] = minimum cost to split first i characters into j palindromes`从每个较早的分割点转换得出：```
dp[i][j] = min(dp[p][j-1] + cost[p+1][i])
```有`O(n^2 * k)`过渡。 如果每个回文成本计算本身需要`O(n)`，总复杂度变为`O(n^4)`。 和`n = 500`，那太慢了。 

关键的观察结果是回文转换成本仅取决于镜像不匹配。 我们可以对每个子串成本进行一次预处理。 

对于子串`s[l:r]`，所需的最小更改等于位置数，其中：```
s[l+i] != s[r-i]
```这可以用简单的区间 DP 来计算。 

经过预处理后，每个转换都变成恒定时间，将主 DP 减少为`O(n^2 * k)`。 

问题自然分为两层：

 首先，计算将每个子串转换为回文的成本。 

其次，使用动态规划计算最佳划分。 

我们还存储重建信息，以便之后可以重建一个有效的转换字符串。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳| O(n²k + n²) | O(n²k + n²) | O(n² + nk) | O(n² + nk) | 已接受 |

 ## 算法演练

 1. 预先计算所有子串的回文转换成本。 

定义：```
cost[l][r] = minimum changes needed to make s[l:r+1] a palindrome
```如果`s[l] == s[r]`，那么外部字符已经匹配并且：```
cost[l][r] = cost[l+1][r-1]
```否则我们必须修改其中之一：```
cost[l][r] = cost[l+1][r-1] + 1
```我们通过增加长度来处理子串，因此较小的间隔是已知的。 
2. 构建分区DP。 

定义：```
dp[i][p] = minimum cost to split first i characters into exactly p palindromes
```最后一段的过渡：```
dp[i][p] = min(
    dp[t][p-1] + cost[t][i-1]
)
```最后一个回文在哪里`s[t:i]`。 
3. 存储重建信息。 

每当过渡有所改善时`dp[i][p]`,保存分割点`t`。 

稍后，这让我们可以向后重建所选分区。 
4. 在所有分区计数中找到最佳答案`1`到`k`。 

该声明最多要求`k`回文，不完全是`k`。 

我们选择：```
min(dp[n][p]) for 1 <= p <= k
```5. 重建选定的片段。 

开始于`(n, best_p)`，重复向后跟踪存储的父指针。 

这给出了所有回文片段的间隔。 
6. 将每个选定的子字符串转换为实际的回文。 

使用两端的两个指针。 

如果字符不同，请更改一侧以匹配另一侧。 任何一种选择都可以，因为两者都只花费一次操作。 
7. 将所有重建的回文连接起来`'+'`。 

### 为什么它有效

 预处理 DP 正确计算每个子串的最小修改，因为每个镜像对都是独立贡献的。 匹配对不需要任何成本，不匹配的对只需要一次更改。 

分区 DP 是正确的，因为每个有效分解都有唯一的最终段。 计算时`dp[i][p]`，我们尝试最后一个回文的所有可能的起始位置。 由于较早的前缀本身必须最优地划分为`p-1`回文，递归探索所有有效的解决方案并保持最小值。 

重建之所以有效，是因为每个 DP 状态都存储产生其最优值的分割点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**9

def make_palindrome(t):
    arr = list(t)
    l, r = 0, len(arr) - 1

    while l < r:
        if arr[l] != arr[r]:
            arr[r] = arr[l]
        l += 1
        r -= 1

    return ''.join(arr)

def solve():
    s = input().strip()
    k = int(input())

    n = len(s)

    # cost[l][r] = minimum changes to make s[l:r+1] palindrome
    cost = [[0] * n for _ in range(n)]

    for length in range(2, n + 1):
        for l in range(n - length + 1):
            r = l + length - 1

            if length == 2:
                cost[l][r] = 0 if s[l] == s[r] else 1
            else:
                cost[l][r] = cost[l + 1][r - 1]
                if s[l] != s[r]:
                    cost[l][r] += 1

    # dp[i][p] = min cost for first i chars using p palindromes
    dp = [[INF] * (k + 1) for _ in range(n + 1)]
    parent = [[-1] * (k + 1) for _ in range(n + 1)]

    dp[0][0] = 0

    for i in range(1, n + 1):
        for p in range(1, min(k, i) + 1):
            for t in range(i):
                cur = dp[t][p - 1] + cost[t][i - 1]

                if cur < dp[i][p]:
                    dp[i][p] = cur
                    parent[i][p] = t

    best_cost = INF
    best_p = -1

    for p in range(1, k + 1):
        if dp[n][p] < best_cost:
            best_cost = dp[n][p]
            best_p = p

    parts = []

    i = n
    p = best_p

    while p > 0:
        t = parent[i][p]
        parts.append((t, i))
        i = t
        p -= 1

    parts.reverse()

    answer_parts = []

    for l, r in parts:
        piece = s[l:r]
        answer_parts.append(make_palindrome(piece))

    print(best_cost)
    print('+'.join(answer_parts))

solve()
```第一部分计算每个子串的回文转换成本。 通过增加长度进行处理是必要的，因为`cost[l][r]`取决于`cost[l+1][r-1]`。 如果我们以任意顺序处理区间，内部值可能还不存在。 

DP表使用`i`作为前缀长度，而不是索引。 该约定避免了许多相差一的错误，因为子字符串`s[t:i]`自然地表示结束于位置的最后一段`i-1`。 

过渡：```
dp[t][p - 1] + cost[t][i - 1]
```意思是：

 首先对之前的前缀进行优化划分`t`，然后将剩余后缀转换为一个回文。 

重建数组存储先前的分割点。 如果没有这个，我们可以计算最小成本，但不知道哪个分区产生了它。 

里面`make_palindrome`，当镜像字符不同时，我们将左侧字符复制到右侧。 复制另一个方向也是正确的，因为无论哪种方式，每个不匹配都需要一次修改。 

## 工作示例

 ### 示例 1

 输入：```
abacaba
1
```整个字符串已经是一个回文。 

| 状态| 价值|
 | --- | --- |
 | 成本[0][6] | 0 |
 | dp[7][1] | dp[7][1] | 0 |
 | 选择分区| [0, 7) |

 构建结果：```
abacaba
```跟踪显示预处理正确地检测到零个不匹配的镜像对。 

### 示例 2

 输入：```
abcdef
2
```重要的 DP 状态：

 | 我| p| 最佳分体式| 细分 | 分部成本| 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 3 | 1 | 0 | ABC | 1 | 1 |
 | 6 | 2 | 3 | 定义 | 1 | 2 |
 | 6 | 2 | 2 | cdf| 2 | 3 |
 | 6 | 2 | 4 | EF | 1 | 3 |

 最优重建：```
abc + def
```回文转换后：```
aba + ded
```总修改量变为`2`。 

此示例演示了 DP 如何评估每个可能的最终分段并选择全局最优分割。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n²k + n²) | O(n²k + n²) | O(n²) 预处理和 O(n²k) DP 转换 |
 | 空间| O(n² + nk) | O(n² + nk) | 子串成本、DP 表和父指针 |

 和`n ≤ 500`，最坏情况下 DP 转换的数量大致为：```
500 × 500 × 500 = 125 million
```在具有简单整数运算的优化 Python 中，这符合限制。 内存使用量也轻松低于 256 MB。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    INF = 10**9

    def make_palindrome(t):
        arr = list(t)
        l, r = 0, len(arr) - 1

        while l < r:
            if arr[l] != arr[r]:
                arr[r] = arr[l]
            l += 1
            r -= 1

        return ''.join(arr)

    s = input().strip()
    k = int(input())

    n = len(s)

    cost = [[0] * n for _ in range(n)]

    for length in range(2, n + 1):
        for l in range(n - length + 1):
            r = l + length - 1

            if length == 2:
                cost[l][r] = 0 if s[l] == s[r] else 1
            else:
                cost[l][r] = cost[l + 1][r - 1]
                if s[l] != s[r]:
                    cost[l][r] += 1

    dp = [[INF] * (k + 1) for _ in range(n + 1)]
    parent = [[-1] * (k + 1) for _ in range(n + 1)]

    dp[0][0] = 0

    for i in range(1, n + 1):
        for p in range(1, min(k, i) + 1):
            for t in range(i):
                cur = dp[t][p - 1] + cost[t][i - 1]

                if cur < dp[i][p]:
                    dp[i][p] = cur
                    parent[i][p] = t

    best_cost = min(dp[n][1:k + 1])

    print(best_cost)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.strip()

# provided sample
assert run("abacaba\n1\n") == "0", "sample 1"

# minimum size
assert run("a\n1\n") == "0", "single character"

# already splittable without changes
assert run("abc\n3\n") == "0", "all single-char palindromes"

# case-sensitive mismatch
assert run("Aa\n1\n") == "1", "uppercase/lowercase differ"

# even-length mismatch
assert run("ab\n1\n") == "1", "one replacement needed"

# all equal characters
assert run("aaaaaa\n1\n") == "0", "already palindrome"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a, k=1`|`0`| 最小尺寸输入 |
 |`abc, k=3`|`0`| 通过拆分更多来使用更少的更改 |
 |`Aa, k=1`|`1`| 区分大小写 |
 |`ab, k=1`|`1`| 正确的错配计数 |
 |`aaaaaa, k=1`|`0`| 已经是回文偶数长度 |

 ## 边缘情况

 考虑：```
abc
3
```DP 允许精确划分为`1`,`2`， 或者`3`回文。 最佳解决方案使用三个单字符段：```
a+b+c
```每个子串的回文转换成本为零。 该算法正确地最小化了所有`p ≤ k`，而不是完全强制`k`。 

现在考虑：```
Aa
1
```预处理期间：```
cost[0][1] = 1
```因为`'A' != 'a'`。 

DP 选择唯一可能的分区，即整个字符串。 重建可能会产生：```
AA
```或者```
aa
```两者都需要进行一次修改。 

另一个微妙的情况是：```
abcd
1
```镜像比较是：```
a vs d -> mismatch
b vs c -> mismatch
```所以：```
cost[0][3] = 2
```该算法正确地计算每个镜像对的更改，而不是每个字符。 

最后，考虑：```
abcdef
6
```最优答案是`0`因为每个字符都可以成为自己的回文。 DP 自然会处理这个问题，因为转换具有段长度`1`总是有成本的`0`。
