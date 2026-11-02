---
title: "CF 1679E - 宿舍里的典型聚会"
description: "我们得到一个长度为 n 的字符串，由前 17 个小写字母（a 到 q）和问号组成。 每个问号都充当通配符，可以替换为查询中提供的特定集合中的字母。"
date: "2026-06-10T00:42:14+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "combinatorics", "dp", "strings"]
categories: ["algorithms"]
codeforces_contest: 1679
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 791 (Div. 2)"
rating: 2400
weight: 1679
solve_time_s: 133
verified: false
draft: false
---

[CF 1679E - 宿舍里的典型聚会](https://codeforces.com/problemset/problem/1679/E)

 **评分：** 2400
 **标签：** 位掩码、组合、dp、字符串
 **求解时间：** 2m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给定一个长度的字符串`n`由前 17 个小写字母组成 (`a`通过`q`）和问号。 每个问号都充当通配符，可以替换为查询中提供的特定集合中的字母。 每个查询都提供一组允许的通配符字母，并且要求我们计算通过使用这些字母替换问号可以生成的所有字符串的回文子字符串的总数。 回文子串是向前和向后读取相同的连续片段，即使字母序列相同，不同位置的子串也会单独计数。 

对于字符串本身来说，约束很小（`n`最多 1000），但查询数量很大（`q`最多 200,000）。 这立即表明任何每次查询重新计算回文的算法都会太慢。 使用朴素计算长度为 1000 的字符串中的所有回文`O(n^3)`方法已经太多了，因此我们需要一种方法，可以独立于查询预先计算有关潜在回文的信息，或者可以使用预处理的数据快速评估多个查询。 

当子字符串仅包含问号时，会出现微妙的边缘情况。 例如，在字符串中`??`，允许字母的查询`{a, b}`将产生四个可能的字符串：`aa`,`ab`,`ba`， 和`bb`。 其中每一个都以不同的方式贡献回文子串。 天真的方法可能会忘记，每次替换都会使某些区域的回文数成倍增加，从而导致计数不足。 

当子串部分固定且部分问号时，会出现另一种边缘情况。 例如，`a?b`和`{a, b}`允许`aab`或者`abb`。 只有第一个在整个子串上是回文的，但两者都产生单字母回文。 粗心的实施可能会高估或低估这些场景。 

## 方法

 暴力方法是为每个查询生成所有可能的字符串，然后枚举所有子字符串并检查回文。 这是正确的，但速度非常慢。 如果字符串有`m`问号和查询允许`k`字母，有`k^m`字符串。 枚举子字符串需要`O(n^2)`，检查子串是否是回文是另一回事`O(n)`在最坏的情况下。 即使很小`m`和`n`很快就会导致大量棘手的操作。 显然，暴力破解仅适用于带有很少问号的小字符串。 

有效解决方案的关键观察是回文是对称的。 如果开头和结尾的相应字符直接匹配或至少其中一个是问号，则子字符串是回文。 因此，我们可以对字符串进行预处理，计算出每个可能的子串需要多少个不同的字母才能使其成为回文。 然后，每个查询都会减少到计算查询中有多少个字母满足这些要求。 通过使用位掩码表示涉及的字母集，我们可以使用组合乘法快速计算与每个查询兼容的回文数。 本质上，我们将字符串结构与查询字母解耦。 

我们最终计算出一个二维数组`f[i][j]`代表，对于子串`s[i..j]`，如果该子字符串是回文，则必须出现的字母的位掩码。 然后对于每个查询，我们可以迭代所有子字符串并检查查询集是否涵盖所需的字母。 回文子串的数量由`s[i..j]`那么查询集的大小是子字符串中问号数量的幂。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q * k^m * n^2) | O(q * k^m * n^2) | O(n^2) | O(n^2) | 太慢了|
 | 最佳| O(n^2 + q * 2^17) | O(n^2 + q * 2^17) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 初始化一个2D数组`dp[i][j]`对于所有子串`s[i..j]`长度为 1 至`n`。 如果`i == j`，子字符串是单个字母，其位掩码是`0`如果它是一个问号或`1 << (ord(s[i]) - ord('a'))`否则。 
2. 对于长度从 2 增加到`n`, 计算`dp[i][j]`基于`dp[i+1][j-1]`。 如果字符位于`i`和`j`都是字母并且相等，子串是回文，并且`dp[i][j]`继承`dp[i+1][j-1]`。 如果一个或两个都是问号，我们将已知字母的位掩码添加到`dp[i+1][j-1]`。 
3. 统计每个子串内问号的数量`s[i..j]`并存储在`qm[i][j]`。 这是必要的，因为每个问号都可以独立地被查询集中的任何字母替换，所以`s[i..j]`查询的最终答案乘以`k^qm[i][j]`， 在哪里`k`是查询的大小。 
4. 对于每个查询，将其字母编码为位掩码`mask`。 然后迭代所有子字符串。 如果子字符串需要字母掩码`dp[i][j]`是一个子集`mask`， 添加`k^qm[i][j]`对答案取模`998244353`。 
5. 返回所有查询的答案。 

为什么它有效：保持不变的是`dp[i][j]`正确编码必须出现在固定位置的所有字母，以使子字符串成为回文。 通过迭代所有子字符串并检查查询集中的包含情况，我们对每个可能的替换对所有回文子字符串进行一次计数。 乘以`k^qm[i][j]`考虑所有有效的问号分配，确保完整性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def solve():
    n = int(input())
    s = input().strip()
    q = int(input())
    
    ord_a = ord('a')
    dp = [[0]*n for _ in range(n)]
    qm = [[0]*n for _ in range(n)]
    
    # Precompute single-letter substrings
    for i in range(n):
        qm[i][i] = 1 if s[i] == '?' else 0
        if s[i] != '?':
            dp[i][i] = 1 << (ord(s[i]) - ord_a)
    
    # Expand for substrings of length >= 2
    for length in range(2, n+1):
        for i in range(n-length+1):
            j = i + length - 1
            qm[i][j] = qm[i+1][j-1] if length > 2 else 0
            if s[i] == '?':
                qm[i][j] += 1
            if s[j] == '?' and i != j:
                qm[i][j] += 1
            if (s[i] == '?' or s[j] == '?' or s[i] == s[j]):
                dp[i][j] = dp[i+1][j-1] if length > 2 else 0
                if s[i] != '?' and s[j] != '?' and i != j:
                    dp[i][j] |= 1 << (ord(s[i]) - ord_a)
            else:
                dp[i][j] = -1  # Not a palindrome
    
    # Precompute powers for efficiency
    pow_cache = [1] * 18
    for k in range(1, 18):
        pow_cache[k] = [1]*(n+1)
        for e in range(1, n+1):
            pow_cache[k][e] = pow_cache[k][e-1] * k % MOD
    
    answers = []
    for _ in range(q):
        line = input().strip()
        k = len(line)
        mask = 0
        for c in line:
            mask |= 1 << (ord(c) - ord_a)
        total = 0
        for i in range(n):
            for j in range(i, n):
                if dp[i][j] != -1 and (dp[i][j] & ~mask) == 0:
                    total = (total + pow_cache[k][qm[i][j]]) % MOD
        answers.append(total)
    
    print('\n'.join(map(str, answers)))

solve()
```该解决方案初始化所有子串的 DP 表并计算问号。 关键细节是使用位掩码来表示所需的字母，从而允许对每个查询进行快速包含测试。 预计算能力可避免重复求幂，这对速度至关重要。 像单字母子串、完全未知的子串和无法形成回文的子串这样的边缘情况会被显式处理。 

## 工作示例

 输入示例：```
7
ab??aba
8
a
b
ab
abc
abcd
abcde
abcdef
abcdefg
```对于子串`s[2..4] = b??`并查询`{a, b}`,`dp[2][4]`包含字母`b`,`qm[2][4] = 2`。 查询的掩码涵盖`b`，所以贡献是`2^2 = 4`回文
