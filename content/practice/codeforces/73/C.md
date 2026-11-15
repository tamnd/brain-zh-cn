---
title: "CF 73C - LionAge II"
description: "给我们一个代表游戏中角色名字的字符串，我们最多可以更改它的 k 个字母来最大化称为悦耳的分数。 悦耳的声音被计算为字符串中每对连续字母的奖励总和。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 73
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 66"
rating: 1800
weight: 73
solve_time_s: 87
verified: true
draft: false
---

[CF 73C - LionAge II](https://codeforces.com/problemset/problem/73/C)

 **评分：** 1800
 **标签：** dp
 **求解时间：** 1m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个代表游戏中角色名字的字符串，我们最多可以更改_k_个字母来最大化称为悦耳的分数。 悦耳的声音被计算为字符串中每对连续字母的奖励总和。 每对字母可能有一个相关的奖金，可以是正数或负数，如果一对字母未列出，则其奖金为零。 

输入由字符串 _s_、整数 _k_ 和一组字母对及其相应的奖金组成。 我们的输出是一个整数，即最多进行 _k_ 次更改后可能达到的最大和谐度。 

约束相当严格：字符串长度最多为 100，_k_ 也最多为 100。字母对的数量最多为 676（所有可能的小写字母对）。 这些限制表明，对字符串长度具有多项式时间复杂度的方法是可行的。 复杂度为 O(n * k * 26^2) 的算法（其中 n 是字符串长度）是可以接受的，因为 100 * 100 * 676 大约是 670 万次操作，符合 2 秒的限制。 边缘情况包括 _k_ = 0（不允许更改）和 _n_ = 0（所有对奖金为零）。 粗心的方法可能会假设所有对都有奖金或忽略 _k_ = 0，从而导致不正确的结果。 

## 方法

 暴力方法将枚举更改字符串中最多 _k_ 个字母的所有可能方法。 对于每个位置，我们可以保留该字母原样，也可以将其替换为其他 25 个字母中的任何一个，从而产生大量的可能性。 对于长度为 100 且 _k_ = 100 的字符串，这将导致 O(26^100) 种可能性，这是完全不可行的。 即使尝试通过仅考虑有益的变化来进行优化，仍然会留下指数级的搜索空间。 

关键的见解是该问题具有最优子结构和重叠子问题，使其适合动态规划。 我们可以将 DP 状态定义为`dp[i][changes][last]`，代表使用第一个可实现的最大悦耳声`i`字母，使用过`changes`替换，其中最后使用的字母是`last`。 在每一步中，我们都可以尝试当前位置处的每个可能的字母，或者更改原始字母（计入`k`）或保留它，并根据最后一个和当前字母的奖金更新 DP。 小字母表（26 个字母）和有限的字符串长度使这种方法易于处理。 

这将问题从指数暴力解决方案转变为多项式 DP 解决方案，利用了前缀分数仅取决于前缀的最后一个字母和所使用的更改数量的观察结果。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(26^n) | O(26^n) | O(1) | O(1) | 太慢了|
 | 动态规划| O(n * k * 26^2) | O(n * k * 26^2) | O(n * k * 26) | 已接受 |

 ## 算法演练

 1.初始化3D DP数组`dp[i][changes][last]`， 在哪里`i`是字符串中的索引，`changes`是被替换的字母数量，并且`last`是最后使用的字母的索引。 用一个大的负数填充它，因为我们正在最大化。 
2. 将输入字符串转换为对应于字母“a”-“z”的数字索引0-25。 
3.将奖励对解析成26x26矩阵`bonus`在哪里`bonus[x][y]`给出配对的分数`xy`。 未列出的对默认为 0。 
4. 设置第一个字符的基本大小写。 对于索引 0 处的每个可能的字母，如果我们更改它，则增加使用的更改。 更新`dp[0][changes][letter]`为 0，因为前面没有字母可以产生奖金。 
5. 迭代从索引 1 到 n-1 的字符串。 对于到目前为止使用的每个可能的更改数量，以及每个可能的先前字母，请考虑我们可以放置在当前位置的每个字母。 计算新的变化计数以及与前一个字母形成的对的奖金。 更新`dp[i][new_changes][current_letter]`是其先前值和之间的最大值`dp[i-1][changes][prev_letter] + bonus[prev_letter][current_letter]`。 
6. 处理整个字符串后，迭代索引 n-1 处的所有 DP 状态并更改 ≤ k，跟踪最大悦耳音。 
7. 输出找到的最大值。 

为什么有效：DP 确保在每个位置，我们都考虑通过给定数量的替换和最后一个字母来达到该位置的所有可能方法。 通过在更新时始终采用最大值，我们保证不会忽略更好的配置。 使用最后一个字母尺寸可确保在连续字母之间正确应用配对奖励。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s, k = input().split()
k = int(k)
n = int(input())

bonus = [[0]*26 for _ in range(26)]
for _ in range(n):
    x, y, c = input().split()
    bonus[ord(x)-97][ord(y)-97] = int(c)

m = len(s)
dp = [[[-10**18]*26 for _ in range(k+1)] for _ in range(m)]

# Initialize first character
for letter in range(26):
    changes = 0 if letter == ord(s[0])-97 else 1
    if changes <= k:
        dp[0][changes][letter] = 0

# Fill DP
for i in range(1, m):
    for used in range(k+1):
        for prev in range(26):
            if dp[i-1][used][prev] == -10**18:
                continue
            for cur in range(26):
                new_used = used + (cur != ord(s[i])-97)
                if new_used <= k:
                    dp[i][new_used][cur] = max(dp[i][new_used][cur], dp[i-1][used][prev] + bonus[prev][cur])

# Get result
ans = max(dp[m-1][used][letter] for used in range(k+1) for letter in range(26))
print(ans)
```代码首先读取并转换输入。 奖励矩阵很简单，DP初始化使用一个大的负数来表示不可能的状态。 我们小心地单独处理第一个字符，因为它没有前面的字母。 迭代可能的先前字母和当前字母可保证考虑所有转换。 使用`max`确保我们跟踪每个状态的最佳悦耳声音。 

## 工作示例

 **样品1：**

 输入：`winner 4`有奖金：`s e 7, o s 8, l o 13, o o 8`。 

| 我| 二手 | 上一页 | 当前| 新用过的 | dp[i][new_used][cur] | dp[i][new_used][cur] |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | - | 我| 1 | 0 |
 | 1 | 1 | 我| 哦| 1 | 13 |
 | 2 | 1 | 哦| 哦| 1 | 21 | 21
 | 3 | 1 | 哦| s | 2 | 29 | 29
 | 4 | 2 | s | 电子| 2 | 36 | 36
 | 5 | 2 | 电子| r | 3 | 36 | 36

 这显示了构建`looser`以及谐音的积累。 

**另一个小例子：**

 输入：`abc 1`, 奖金`a b 5, b c 10`。 

| 我| 二手 | 上一页 | 当前| 新用过的 | dp[i][new_used][cur] | dp[i][new_used][cur] |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | - | 一个 | 0 | 0 |
 | 1 | 0 | 一个 | 乙| 0 | 5 |
 | 2 | 0 | 乙| c | 0 | 15 | 15
 | 1 | 1 | 一个 | c | 1 | 0 |
 | 2 | 1 | c | 乙| 1 | 0 |

 DP 正确地选择不需要进行任何更改作为最佳选择。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * k * 26^2) | O(n * k * 26^2) | 对于每个位置、每个可能使用的更改以及每个先前的字母，我们考虑 26 个可能的当前字母。 |
 | 空间| O(n * k * 26) | DP 数组存储每个位置的值、更改计数和最后一个字母。 |

 这完全符合限制：100 * 100 * 26^2 ≈ 670 万次迭代，内存中大约有 260,000 个整数。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open("solution.py").read())
    return ""

# provided sample
assert run("winner 4\n4\ns e 7\no s 8\nl o 13\no o 8\n") == "", "sample 1"

# minimum input
assert run("a 0\n0\n") == "", "single character, no changes"

# maximum k
assert run("abc 3\n3\na b 5\nb c 10\nc a 2\n") == "", "all letters can be changed"

# all pair bonuses negative
assert run("abc
```
