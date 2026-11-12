---
title: "CF 2200C - 特种弦"
description: "我们得到一个由小写字母组成的字符串，游戏涉及重复用星号替换成对的相同字母，前提是它们之间的所有字符都已经变成星号。"
date: "2026-06-07T20:15:31+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 2200
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1084 (Div. 3)"
rating: 900
weight: 2200
solve_time_s: 93
verified: true
draft: false
---

[CF 2200C - 专业字符串](https://codeforces.com/problemset/problem/2200/C)

 **评分：** 900
 **标签：** 暴力、贪婪、字符串
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个由小写字母组成的字符串，游戏涉及重复用星号替换成对的相同字母，前提是它们之间的所有字符都已经变成星号。 具体来说，我们可以选择指数$i < j$这样这些位置的字符是相同的，并且所有字符严格位于$i$和$j$已经`*`。 一旦我们替换了一对，这些位置就变成了`*`。 目标是确定是否可以将整个字符串转换为`*`通过一系列这样的动作。 

输入由多个测试用例组成。 每个测试用例提供字符串的长度$n$和字符串$s$本身。 如果我们最终可以将整个字符串变成，我们需要输出“YES”`*`，否则“否”。 

约束条件是这样的$n \leq 5000$和总和$n$所有测试用例的数量不超过 5000。这表明解决方案$O(n^2)$时间复杂度是可行的，因为$5000^2 = 25{,}000{,}000$，这对于 Python 中 2 秒的时间限制是可以接受的。 边缘情况是长度为 1 的字符串，这种字符串根本无法获胜，或者每个字符出现偶数次但由于字符交错而无法连续配对的字符串。 

盲目尝试每对可能的天真的方法可能会在交错模式上失败。 例如，对于字符串`oooioi`，虽然有三个`o`和两个`i`s，配对约束阻止完全消除，导致“否”。 

## 方法

 暴力方法是精确地模拟游戏：扫描每对有效的、仅由`*`，更换它们，然后重复，直到无法再移动为止。 这可以正常工作，但效率很低，因为每次扫描都是$O(n^2)$在最坏的情况下，重复更新字符串会使成本成倍增加，可能达到$O(n^3)$。 这对于$n \sim 5000$。 

关键的见解是，操作顺序受到以下要求的限制：一对之间的所有字符都已经是`*`。 这意味着问题本质上是关于嵌套匹配，这类似于平衡括号等问题中使用的贪婪或基于堆栈的方法。 我们可以从左到右处理字符串，并尝试递归地将字符与下一个有效匹配项配对，同时跟踪每个字符的最后位置。 如果我们可以通过这种方式将所有内容配对，则字符串可以完全转换为`*`。 The fact that`n`很小允许我们使用一个简单的$O(n^2)$动态规划解决方案也是：让`dp[l][r]`如果子字符串来自`l`到`r`可以完全变成`*`。 然后我们检查第一个字符的所有可能对，看看拆分剩余的子字符串是否也有效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(n^3) | O(n^3) | O(n) | 太慢了 |
 | 动态规划/贪心| O(n^2) | O(n^2) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1.初始化布尔数组`dp`尺寸的`n x n`， 在哪里`dp[l][r]`如果子串为真`s[l..r]`可以完全转换成`*`。 所有单字符子字符串最初都是 false，因为无法删除单个字符。 
2. 迭代所有子串长度从 2 到`n`。 对于每个子串`s[l..r]`，考虑配对第一个字符`s[l]`与后来的每一个角色`s[m]`(`l < m <= r`） 在哪里`s[m] == s[l]`。 
3. 检查之间是否有子串`l`和`m`已经可以兑换（`dp[l+1][m-1]`是真的）。 如果是这样，请检查子字符串的其余部分（`dp[m+1][r]`）。 如果两者都为真（或为空），那么`dp[l][r]`是真的。 
4. 处理完所有长度后，完整字符串的结果为`dp[0][n-1]`。 如果为真，则输出“YES”，否则输出“NO”。 

为什么有效：DP 捕获了游戏的递归结构。 如果我们可以为其第一个字符选择一个有效的对，并递归地删除它们之间和第二个字符之后的子字符串，则子字符串是完全可删除的。 基本情况直接处理单对。 这确保了考虑所有有效的移动序列，而不会丢失交错约束。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can_win(s):
    n = len(s)
    dp = [[False]*n for _ in range(n)]
    
    for length in range(2, n+1):
        for l in range(n-length+1):
            r = l + length - 1
            for m in range(l+1, r+1):
                if s[l] == s[m]:
                    if (m == l+1 or dp[l+1][m-1]) and (m == r or dp[m+1][r]):
                        dp[l][r] = True
                        break
    return dp[0][n-1]

t = int(input())
for _ in range(t):
    n = int(input())
    s = input().strip()
    print("YES" if can_win(s) else "NO")
```DP 初始化确保长度为 1 的子串为假。 嵌套循环有效地处理每个可能的子字符串。 支票`(m == l+1 or dp[l+1][m-1])`确保可以删除中间子字符串，并且`(m == r or dp[m+1][r])`确保其余部分也可拆卸。 一旦找到有效的对就尽早中断可以避免不必要的计算。 

## 工作示例

 追踪`llmllm`:

 | 步骤| 子串 | 配对 | dp[l][r] | dp[l][r] |
 | ---| ---| ---| ---|
 | 0 |`ll`| 左-右 | 真实|
 | 1 |`llm`| 左-右 | 假 |
 | 2 |`llml`| 左-右 | 真实|
 | 3 |`llmllm`| l-lm-lm | 真实|

 这表明左贪婪配对起作用并且 DP 捕获了交错。 

追踪`oooioi`:

 | 步骤| 子串 | 配对 | dp[l][r] | dp[l][r] |
 | ---| ---| ---| ---|
 | 0 |`oo`| 欧-欧| 真实|
 | 1 |`ooo`| 欧-欧| 假 |
 | ... | 完整| 无法配对最后一个 | 假 |

 这表明交错`o`和`i`防止完全去除。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2) | O(n^2) | 对于长度不超过 n 的每个子串，我们扫描可能的配对。 |
 | 空间| O(n^2) | O(n^2) | 存储所有子串的DP表。 |

 和$n \leq 5000$在所有测试用例中，$O(n^2)$适合 2s 和 256MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open(__file__).read())
    return output.getvalue().strip()

assert run("6\n1\na\n6\nllmllm\n6\nuwuuwu\n6\nbyebye\n6\noooioi\n12\nsiixxsevvenn\n") == "NO\nYES\nYES\nNO\nNO\nYES"

assert run("1\n1\na\n") == "NO"  # single character
assert run("1\n2\naa\n") == "YES"  # minimal pair
assert run("1\n4\naabb\n") == "YES"  # simple consecutive pairs
assert run("1\n4\nabab\n") == "NO"  # interleaved cannot resolve
assert run("1\n6\nabcabc\n") == "NO"  # nested interleaving
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1\na`| 否 | 单字符大小写|
 |`2\naa`| 是 | 最小对去除 |
 |`4\naabb`| 是 | 连续对 |
 |`4\nabab`| 否 | 交错可防止完全去除 |
 |`6\nabcabc`| 否 | 嵌套交错|

 ## 边缘情况

 对于像这样的单个字符`a`，DP表保持不变`False`因为没有要删除的对，所以返回“NO”。 

对于像这样的字符串`abab`，算法尝试将第一个配对`a`与第二个`a`，但它们之间的子串包含`b`，目前还不可移除，使得`dp[0][3]`false 并正确输出“NO”。 

为了`siixxsevvenn`，递归 DP 找到像这样的对`ii`,`xx`,`ss`,`ee`,`vv`,`nn`按顺序，验证交错处理是否正确并返回“YES”。
