---
title: "CF 1163D - 神秘代码"
description: "我们得到一个字符串 c，它表示部分不可读的代码。 c中的某些位置是可读的小写字母，其他位置是代表未知字符的星号。"
date: "2026-06-12T02:22:06+07:00"
tags: ["codeforces", "competitive-programming", "dp", "strings"]
categories: ["algorithms"]
codeforces_contest: 1163
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 558 (Div. 2)"
rating: 2100
weight: 1163
solve_time_s: 66
verified: true
draft: false
---

[CF 1163D - 神秘代码](https://codeforces.com/problemset/problem/1163/D)

 **评分：** 2100
 **标签：** dp、字符串
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个字符串`c`它代表部分不可读的代码。 一些职位在`c`是可读的小写字母，其他是代表未知字符的星号。 我们还得到两个字符串：`s`，我们希望在最终恢复的代码中尽可能多地出现，并且`t`，我们希望在同一字符串中最小化。 任务是替换中的星号`c`用小写字母来最大化出现次数之间的差异`s`和`t`。 

字符串`c`最长可达 1000 个字符，而`s`和`t`长度最多为 50 个字符。 因为`c`相对较小，跨位置进行动态规划是可行的`c`。 主要的挑战是星号中的每个替换都会影响多个可能的子字符串匹配`s`和`t`，并且必须谨慎处理重叠的情况。 尝试所有可能的替换的简单方法需要检查`26^1000`最坏情况下的可能性是天文数字般巨大且完全不可行。 

非明显的边缘情况包括以下情况`s`和`t`部分重叠，或者其中的每个字符`c`是一个星号。 例如，如果`c = "***"`,`s = "aa"`， 和`t = "aaa"`，一种粗心的贪心方法，最大化`s`本地可能会无意中产生额外的情况`t`，降低总分。 另一个边缘情况是当`s`和`t`共享公共前缀； 最大化`s`可能会同时产生`t`如果忽略重叠。 

## 方法

 A brute-force solution would generate all possible replacements of asterisks and count occurrences of`s`和`t`对于每个候选字符串。 这适用于极小的字符串，但是`|c|`最多 1000 个，最多可能有`26^1000`候选字符串，这是完全不可行的。 

关键的观察是，问题可以简化为使用字符串匹配自动机的动态规划。 我们可以维护一个DP表`dp[pos][state_s][state_t]`在哪里`pos`是当前位置`c`,`state_s`是前缀的长度`s`到目前为止匹配，并且`state_t`是前缀的长度`t`到目前为止匹配。 对于中的每个字符`c`（或者每个替换，如果它是星号），我们根据有限自动机的转换来更新状态，该有限自动机跟踪有多少`s`和`t`已匹配。 当满`s`匹配时，我们将分数加 1，当满分时`t`匹配后，我们将分数减 1。 

有效构建自动机依赖于 Knuth-Morris-Pratt 失效函数。 这使我们能够在恒定时间内计算给定状态和下一个字符，即自动机中的下一个状态。 通过这种方法，我们将指数问题简化为 DP`n * |s| * |t|`状态与`O(26)`每个状态的转换，这对于给定的约束是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(26^n * n) | O(26^n * n) | O(n) | 太慢了 |
 | 自动机 DP | O(n * | s | * |

 ## 算法演练

 1. 预先计算失效函数`s`和`t`允许部分匹配之间的快速转换。 对于一个字符串`p`,`fail[i]`是最长前缀的长度`p`这是一个后缀`p[0:i]`。 这让我们知道，给定部分匹配和下一个字符，新的匹配长度是多少。 
2. 构建转换表`next_s[state][char]`和`next_t[state][char]`为了`s`和`t`分别。`next_s[state][char]`告诉我们新前缀的长度`s`看到后匹配`char`鉴于我们已经匹配`state`到目前为止的人物。 这同样适用于`t`。 
3.初始化DP表`dp[pos][state_s][state_t]`充满负无穷除了`dp[0][0][0] = 0`。 这里`pos`是索引`c`,`state_s`是有多少个字符`s`我们匹配的结尾为`pos-1`， 和`state_t`是有多少个字符`t`我们匹配的结尾为`pos-1`。 
4. 迭代位置`pos`从 0 到`len(c)-1`。 对于每个`(state_s, state_t)`，尝试所有可能的下一个字符。 如果`c[pos]`是已知字母，则仅考虑该字母； 否则，将考虑所有 26 个字母。 
5. 对于每个角色`ch`，计算接下来的状态`new_s = next_s[state_s][ch]`和`new_t = next_t[state_t][ch]`。 更新DP：`dp[pos+1][new_s][new_t] = max(dp[pos+1][new_s][new_t], dp[pos][state_s][state_t] + score)`， 在哪里`score`是 1 如果`new_s`达到满`|s|`（减去`|s|`从`new_s`计数后）和 -1 如果`new_t`达到满`|t|`（减去`|t|`从`new_t`数完后）。 
6.填完DP表后，答案就是所有的最大值`dp[len(c)][*][*]`。 

为什么它有效：DP 保持不变式`dp[pos][state_s][state_t]`是可达到的最大值`f(c', s) - f(c', t)`使用第一个`pos`的字符`c`并以部分匹配结束`state_s`和`state_t`。 自动转换确保正确处理重叠事件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def compute_kmp_transition(pattern):
    m = len(pattern)
    fail = [0] * m
    for i in range(1, m):
        j = fail[i-1]
        while j > 0 and pattern[i] != pattern[j]:
            j = fail[j-1]
        if pattern[i] == pattern[j]:
            j += 1
        fail[i] = j
    nxt = [[0]*26 for _ in range(m+1)]
    for state in range(m+1):
        for c in range(26):
            if state < m and ord(pattern[state]) - ord('a') == c:
                nxt[state][c] = state + 1
            else:
                j = state
                while j > 0 and (j == m or ord(pattern[j]) - ord('a') != c):
                    j = fail[j-1]
                if j < m and ord(pattern[j]) - ord('a') == c:
                    nxt[state][c] = j + 1
                else:
                    nxt[state][c] = 0
    return nxt

def main():
    c = input().strip()
    s = input().strip()
    t = input().strip()
    n = len(c)
    ns = len(s)
    nt = len(t)
    nxt_s = compute_kmp_transition(s)
    nxt_t = compute_kmp_transition(t)
    INF = float('-inf')
    dp = [[ [INF]*(nt+1) for _ in range(ns+1)] for _ in range(n+1)]
    dp[0][0][0] = 0
    for i in range(n):
        for ps in range(ns+1):
            for pt in range(nt+1):
                if dp[i][ps][pt] == INF:
                    continue
                chars = [ord(c[i])-ord('a')] if c[i] != '*' else list(range(26))
                for ch in chars:
                    ns_state = nxt_s[ps][ch]
                    nt_state = nxt_t[pt][ch]
                    score = 0
                    if ns_state == ns:
                        score += 1
                        ns_state = nxt_s[ns_state-1][ch]
                    if nt_state == nt:
                        score -= 1
                        nt_state = nxt_t[nt_state-1][ch]
                    dp[i+1][ns_state][nt_state] = max(dp[i+1][ns_state][nt_state], dp[i][ps][pt] + score)
    result = max(dp[n][ps][pt] for ps in range(ns+1) for pt in range(nt+1))
    print(result)

if __name__ == "__main__":
    main()
```这`compute_kmp_transition`函数为每个可能的字符的模式的每个前缀预先计算下一个状态转换。 DP表`dp[i][ps][pt]`跟踪部分匹配的每个组合的最佳可达到的分数。 处理星号时，会尝试所有 26 个字母，而已知字符会强制执行一次转换。 更新 DP`max`确保我们始终保持最优选择。 

## 工作示例

 对于输入：```
*****
katie
shiro
```| 我| 附：| 点 | dp[i][ps][pt] | dp[i][ps][pt] | ch 尝试过 | ns_状态 | nt_state | 新 DP |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 0 | | | | | | | |
