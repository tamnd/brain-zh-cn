---
title: "CF 105381J - 随机字符串匹配算法"
description: "我们有两个字符串，一个长文本 s 和一个模式 t。 我们扫描 s 中 t 可以容纳的每个起始位置。 对于每个这样的位置，托尼算法尝试确定子字符串是否等于 t，但它不是检查所有字符，而是执行 k 次随机探测。"
date: "2026-06-23T16:09:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105381
codeforces_index: "J"
codeforces_contest_name: "National Yang Ming Chiao Tung University 2024 Team Selection Programming Contest"
rating: 0
weight: 105381
solve_time_s: 65
verified: true
draft: false
---

[CF 105381J - 随机字符串匹配算法](https://codeforces.com/problemset/problem/105381/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个字符串，一个长文本`s`和一个图案`t`。 我们扫描每个起始位置`s`在哪里`t`可以适合。 对于每个这样的位置，托尼的算法尝试确定子字符串是否等于`t`，但它不是检查所有字符，而是执行`k`随机探针。 每个探针在内部选择一个随机索引`t`并比较相应的字符`s`和`t`。 如果所有探针碰巧仅落在匹配位置，则算法接受子字符串作为匹配项。 

输出与哪些位置匹配无关。 相反，我们必须计算此随机过程在字符串中的任何位置都不会产生误报的概率，这意味着它永远不会错误地将不匹配的子字符串报告为匹配项。 

字符串仅使用前 8 个小写字母，总长度可达 200,000。 这立即排除了每个位置的任何二次比较。 即使每个位置具有较大常数的线性也是有风险的； 我们需要近线性预处理和每个班次的恒定时间评估。 

微妙的边缘情况来自仅在一个位置与模式不同的子字符串。 对于这种情况，该算法特别脆弱，因为它可能会错过不匹配的概率，具体取决于对不同索引进行采样的频率。 

第二种边缘情况是子字符串与模式完全不同。 在这种情况下，每个随机探针都会立即检测到不匹配，因此这些位置实际上是安全的并且贡献概率为 1。 

## 方法

 直接模拟将迭代中的每个位置`s`，并且对于每一个模拟`k`随机检查。 仅此一点就已经太慢了，因为`k`最大可达十亿。 即使我们限制模拟，随机性也使得我们无法准确推断正确性概率。 

关键的观察是每个位置`i`在正确性方面表现独立。 仅当至少一个不匹配的子串被错误接受时，该算法才会失败。 所以我们计算每个班次`i`，这种转变不是误报的概率，并将这些概率相乘。 

对于固定班次，定义`d_i`作为位置的数量，其中`s[i + j] != t[j]`。 在一次随机探测期间，算法选择一个索引`r`从图案长度均匀。 当它选择其中之一时，它会准确地检测到错误`d_i`位置不匹配。 因此单个探针无法检测到概率不匹配`(m - d_i) / m`， 在哪里`m = |t|`。 后`k`独立的探针，算法仍然无法检测到不匹配的概率为`((m - d_i) / m)^k`。 这正是该转变的误报概率，当`d_i > 0`。 

所以剩下的任务就是计算所有`d_i`高效。 这是一个经典的模式匹配重构：我们计算每个班次之间有多少个位置匹配`s`和`t`。 由于字母表大小只有 8，因此我们构建 8 个二进制指示符数组并使用卷积计算相关性。 轮班匹配数`i`是对齐匹配的字符之和，不匹配直接跟随。 

一旦我们拥有了一切`d_i`，我们乘以贡献：

 为了`d_i = 0`，子串确实相等，因此它贡献因子 1。 

为了`d_i > 0`，我们乘以`(1 - ((m - d_i)/m)^k)`。 

这将问题转化为卷积加上每个位置的模幂。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力模拟 | O(n·k) | O(n·k) | O(1) | O(1) | 太慢了 |
 | 卷积+概率聚合| O(8·n log n) | O(8·n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算`m = |t|`和`n = |s|`。 我们将评估每个班次`i`从`0`到`n - m`。 
2. 对于每个角色`c`从`'a'`到`'h'`，构建二进制数组来标记出现的情况`s`和`t`。 我们反转一侧，以便卷积对齐位置以进行移位比较。 
3. 对每个字符运行卷积。 对于每个班次，这给出`i`，有多少个位置与该字符匹配。 对所有字符求和得出`match[i]`。 
4. 计算`d_i = m - match[i]`。 这是之间不匹配位置的数量`t`和开始于的子字符串`i`。 
5. 预计算`inv_m = m^{-1} mod MOD`。 还计算`inv_m_k = inv_m^k mod MOD`，因为它在所有班次之间共享。 
6. 对于每个班次，`d_i > 0`，计算：`base = m - d_i`

`p_i = (base^k mod MOD) * inv_m_k mod MOD`这是算法未能检测到不匹配的概率。 
7. 将答案乘以`(1 - p_i)`所有此类移位的模 MOD。 

### 为什么它有效

 每个移位的行为都是独立的，因为算法的随机性是每个位置的局部性，并且不会在不同的起始索引之间相互作用。 对于固定班次，产生错误输出的唯一方法是避免对所有不匹配的索引进行采样`k`试验。 该事件发生的概率仅取决于`d_i`，不在其他位置。 由于正确性要求避免每个不匹配班次的失败，因此最终概率是独立的每个班次成功概率的乘积。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def ntt_convolution(a, b):
    # iterative NTT for 998244353
    def bitrev(a):
        n = len(a)
        j = 0
        for i in range(1, n):
            bit = n >> 1
            while j & bit:
                j ^= bit
                bit >>= 1
            j ^= bit
            if i < j:
                a[i], a[j] = a[j], a[i]

    def ntt(a, invert):
        n = len(a)
        bitrev(a)
        length = 2
        while length <= n:
            wlen = pow(3, (MOD - 1) // length, MOD)
            if invert:
                wlen = pow(wlen, MOD - 2, MOD)
            i = 0
            while i < n:
                w = 1
                for j in range(i, i + length // 2):
                    u = a[j]
                    v = a[j + length // 2] * w % MOD
                    a[j] = (u + v) % MOD
                    a[j + length // 2] = (u - v) % MOD
                    w = w * wlen % MOD
                i += length
            length <<= 1
        if invert:
            inv_n = pow(n, MOD - 2, MOD)
            for i in range(n):
                a[i] = a[i] * inv_n % MOD

    n = 1
    while n < len(a) + len(b):
        n <<= 1
    fa = a + [0] * (n - len(a))
    fb = b + [0] * (n - len(b))

    ntt(fa, False)
    ntt(fb, False)
    for i in range(n):
        fa[i] = fa[i] * fb[i] % MOD
    ntt(fa, True)
    return fa

s = input().strip()
t = input().strip()
k = int(input())

n, m = len(s), len(t)

if m > n:
    print(1)
    sys.exit()

match = [0] * (n - m + 1)

for c in range(8):
    ch = chr(ord('a') + c)
    A = [0] * n
    B = [0] * m
    for i in range(n):
        if s[i] == ch:
            A[i] = 1
    for i in range(m):
        if t[i] == ch:
            B[m - 1 - i] = 1

    conv = ntt_convolution(A, B)
    for i in range(n - m + 1):
        match[i] += conv[i + m - 1]

inv_m = pow(m, MOD - 2, MOD)
inv_m_k = pow(inv_m, k, MOD)

ans = 1

for i in range(n - m + 1):
    d = m - match[i]
    if d == 0:
        continue
    base = m - d
    p = pow(base, k, MOD) * inv_m_k % MOD
    ans = ans * (1 - p) % MOD

print(ans % MOD)
```卷积步骤构建每个班次的重叠计数。 反转模式数组可确保卷积索引对齐，以便每个输出位置对应于之间的特定对齐`s`和`t`。 然后直接根据失配计数进行概率计算。 

模幂`pow(base, k, MOD)`是必需的，因为每次移位都会提高概率的幂`k`独立试验。 

## 工作示例

 由于原始样本未完全指定，请考虑两个说明性案例。 

首先，让`s = "abca"`和`t = "bc"`， 和`k = 1`。 

在移位 0 处，子串是`"ab"`，不匹配计数为 2。未能检测到不匹配的概率为`(0/2)^1 = 0`，所以贡献为1。 

在移位 1 处，子串是`"bc"`，失配计数为0，因此贡献1。 

在移位 2 时，子串是`"ca"`，失配计数为 2，再次贡献 1。 

| 班次 | 子串| 不匹配 d | p_i | 因素|
 | --- | --- | --- | --- | --- |
 | 0 | ab | 2 | 0 | 1 |
 | 1 | 公元前 | 0 | - | 1 |
 | 2 | 加州 | 2 | 0 | 1 |

 最终答案是1。 

二、取`s = "aaa"`和`t = "aa"`,`k = 2`。 

Shift 0 和 1 都是完整匹配，因此两者都没有贡献。 每个对齐都是正确的，概率为 1，确认相同的重叠不会引入随机性。 

这些例子表明，随机性仅在存在不匹配时才重要，即使如此，也只能通过它们的计数而不是它们的位置来影响。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(8·n log n + n) | O(8·n log n + n) | 字母表上的 8 次卷积加上线性聚合 |
 | 空间| O(n) | 用于卷积和匹配计数的数组 |

 这些限制允许最多 200,000 个字符，并且由于字母表大小的常数因子很小，基于卷积的模式匹配可以轻松地满足时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdin.read().strip()

# Since full solution is not wrapped as function here, these are structural placeholders
# In actual use, integrate solution into callable function.

# Minimal edge cases
# assert run("a\na\n1") == "1"

# Custom conceptual tests
# all equal strings
# random mismatch-heavy case
# single character pattern
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | s=t, k 大 | 1 | 全场比赛稳定性|
 | s=“aaaa”，t=“b”，k=5 | 1 | 始终不匹配安全 |
 | 交替字母| 取决于| 部分不匹配处理 |

 ## 边缘情况

 当`s`和`t`是相同的，每个班次都有`d_i = 0`，因此没有引入概率失效项。 该算法正确输出概率 1，因为每个子串都是真正的匹配，不能被拒绝或错误分类。 

什么时候`t`是单个字符，每次尝试都会立即检测到每个不匹配，概率为 1。 这使得每个非等移贡献因子为 1，因为`(0/1)^k = 0`，最终产品再次保持稳定。 

当子串在每个位置都不同时`t`，我们有`d_i = m`， 所以`base = 0`误报概率变为 0。因子变为 1，这意味着完全不相关的子串不会导致错误，这符合每个探测器总是立即检测到不匹配的直觉。
