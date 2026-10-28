---
title: "CF 144C - 字谜搜索"
description: "我们被要求计算字符串 s 中可以转换为给定字符串 p 的字谜词的子字符串的数量。 字符串 s 可以包含问号 ?，可以用任何小写字母替换。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 144
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 103 (Div. 2)"
rating: 1500
weight: 144
solve_time_s: 83
verified: true
draft: false
---

[CF 144C - 字谜搜索](https://codeforces.com/problemset/problem/144/C)

 **评分：** 1500
 **标签：** 实现、字符串
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算一个字符串的子串数量`s`可以转换为给定字符串的字谜词`p`。 字符串`s`可以包含问号`?`，可以用任何小写字母替换。 子串被定义为连续的段`s`，并且从不同位置开始的两个子字符串即使相同也被认为是不同的。 

输入尺寸允许`s`和`p`每个长度最多为 100,000 个字符。 生成所有子字符串并单独检查它们的简单方法大约需要`O(n^2 * m)`操作，其中`n`的长度是`s`和`m`的长度是`p`。 和`n`和`m`最多 10^5，这会导致大约 10^15 次操作，这对于 2 秒的时间限制来说太慢了。 我们需要一个`O(n)`或者`O(n * 26)`保持效率的方法。 

非明显的边缘情况包括子串长度为`s`小于`p`，它应该立即产生零个有效子字符串。 当子字符串仅包含问号时，会出现另一个微妙的情况 - 它可以匹配任何字谜`p`只要长度匹配。 例如，如果`s = "???"`和`p = "abc"`，子字符串是有效的，因为三个问号可以按某种顺序替换为“a”、“b”、“c”。 粗心的解决方案可能会误算或遗漏此类情况。 

## 方法

 蛮力方法迭代所有子串`s`长度等于`p`并检查他们是否可以通过计算字母和问号来形成字谜。 对于每个子字符串，我们将计算字母的频率数组，并查看之间的差异`p`的字母计数和子字符串的计数可以被问号精确覆盖。 这在逻辑上可行，但运行在`O(n*m)`时间。 对于最大的输入，大约需要 10^10 次操作 - 太慢了。 

关键的观察是检查固定长度的子字符串适合滑动窗口。 通过维护长度窗口的频率计数`m`（长度为`p`），当窗口向右移动一个位置时，我们可以有效地更新计数。 我们还维护窗口中问号的数量。 对于每个班次，我们只需要检查窗口中的字母是否相对于`p`正好等于问号的数量。 这将每个窗口的检查减少到`O(26)`操作，使完整的算法`O(n*26)`，这足够快了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*m) | O(26) | 太慢了 |
 | 滑动窗 | O(n*26) | O(26) | 已接受 |

 ## 算法演练

 1. 计算频率数组`freq_p`对于字符串`p`， 在哪里`freq_p[i]`计算字母出现的次数`'a'+i`。 
2.初始化一个长度的滑动窗口`m`超过`s`。 计算`freq_window`计算第一个窗口的字母并计算问号的数量`q_count`。 
3. 对于每个窗口，计算与`p`通过求和`max(0, freq_p[i] - freq_window[i])`跨越所有字母。 如果这个总和等于`q_count`，窗户很好。 
4. 将窗口向右滑动一位。 更新`freq_window`和`q_count`通过减少离开窗口的字符计数并增加进入窗口的字符计数。 
5. 重复步骤 3 和 4，直到到达字符串末尾。 

这样做的原因是，每个字母缺陷必须被问号精确覆盖，才能将子串转换为字谜词`p`。 滑动窗口可确保我们有效地检查每个可能的子字符串，而无需从头开始重新计算计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()
p = input().strip()

len_s = len(s)
len_p = len(p)

if len_p > len_s:
    print(0)
    sys.exit()

# frequency of letters in p
freq_p = [0] * 26
for ch in p:
    freq_p[ord(ch) - ord('a')] += 1

# frequency of letters in the current window
freq_window = [0] * 26
q_count = 0
for i in range(len_p):
    if s[i] == '?':
        q_count += 1
    else:
        freq_window[ord(s[i]) - ord('a')] += 1

result = 0

def is_good():
    missing = 0
    for i in range(26):
        if freq_p[i] > freq_window[i]:
            missing += freq_p[i] - freq_window[i]
    return missing == q_count

if is_good():
    result += 1

for i in range(len_p, len_s):
    # remove leftmost character
    left = s[i - len_p]
    if left == '?':
        q_count -= 1
    else:
        freq_window[ord(left) - ord('a')] -= 1
    # add new character
    right = s[i]
    if right == '?':
        q_count += 1
    else:
        freq_window[ord(right) - ord('a')] += 1
    if is_good():
        result += 1

print(result)
```该解决方案初始化了两者的字母计数`p`和第一个窗口`s`。 窗口的每次移动仅更新进入和离开的字符，使每个窗口的检查保持恒定时间（26 个字母）。 使用`max(0, freq_p[i]-freq_window[i])`避免负赤字，正确处理窗口中出现的超出需要的字母。 这`?`计数增量调整，防止重新计算。 

## 工作示例

 输入示例 1：```
s = "bb??x???"
p = "aab"
```| 窗口| 频率窗口 | q_count | 丢失的字母| 好的？ |
 | --- | --- | --- | --- | --- |
 | “bb？” | b = 2 | 1 | 缺失a=2 → 缺失=2 | 2==1？ 没有 |
 | “乙？” | b = 1 | 2 | 缺失a=2 → 缺失=2 | 2==2？ 是的 |
 | “？？？” | 0 | 3 | 缺失 a=2, b=1 → 缺失=3 | 3==3？ 是的 |
 | “？x？” | x=1 | 2 | 缺失 a=2, b=1 → 缺失=3 | 3！= 2？ 没有 |
 | “×？” | x=1 | 2 | 缺失 a=2, b=1 → 缺失=3 | 3！= 2？ 没有 |
 | “？？？” | 0 | 3 | 缺失 a=2, b=1 → 缺失=3 | 3==3？ 是的 |

 计算了两个子串。 

输入示例 2：```
s = "ab?c"
p = "abc"
```| 窗口| 频率窗口 | q_count | 失踪| 好的？ |
 | --- | --- | --- | --- | --- |
 | “阿布？” | a = 1，b = 1 | 1 | c=1 → 缺失=1 | 1==1 是 |
 | “b？c”| b = 1，c = 1 | 1 | a=1 → 缺失=1 | 1==1 是 |

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n*26) | n 个窗口中的每一个都执行 26 个字母的缺陷检查。 滑动窗口更新时间复杂度为 O(1)。 |
 | 空间| O(26*2) = O(1) | O(26*2) = O(1) | 两个大小为 26 的频率阵列和一些计数器。 |

 该解决方案非常适合 n 高达 100,000 时的 2 秒限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    s = input().strip()
    p = input().strip()
    len_s = len(s)
    len_p = len(p)
    if len_p > len_s:
        return "0"
    freq_p = [0]*26
    for ch in p:
        freq_p[ord(ch)-ord('a')] += 1
    freq_window = [0]*26
    q_count = 0
    for i in range(len_p):
        if s[i]=='?':
            q_count += 1
        else:
            freq_window[ord(s[i])-ord('a')] +=1
    result=0
    def is_good():
        missing=0
        for i in range(26):
            if freq_p[i]>freq_window[i]:
                missing += freq_p[i]-freq_window[i]
        return missing==q_count
    if is_good():
        result +=1
    for i in range(len_p,len_s):
        left = s[i-len_p]
        if left=='?':
            q_count -=1
        else:
            freq_window[ord(left)-ord('a')]-=1
        right = s[i]
        if
```
