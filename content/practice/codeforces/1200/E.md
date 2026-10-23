---
title: "CF 1200E - 压缩字"
description: "我们给出了形成句子的单词序列，任务是通过从左到右合并它们将它们压缩为单个字符串。"
date: "2026-06-11T23:54:24+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "hashing", "implementation", "string-suffix-structures", "strings"]
categories: ["algorithms"]
codeforces_contest: 1200
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 578 (Div. 2)"
rating: 2000
weight: 1200
solve_time_s: 77
verified: true
draft: false
---

[CF 1200E - 压缩单词](https://codeforces.com/problemset/problem/1200/E)

 **评级：** 2000
 **标签：** 暴力破解、哈希、实现、字符串后缀结构、字符串
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了形成句子的单词序列，任务是通过从左到右合并它们将它们压缩为单个字符串。 合并规则是，当我们将一个单词附加到当前字符串时，新单词中与当前字符串的后缀匹配的任何前缀都会被删除。 目标是在处理所有单词后生成最终的压缩字符串。 

输入由一个整数组成`n`为单词数，后面是单词本身。 所有单词的总长度最多可达 100 万个字符。 这意味着与字符总长度成正比的算法（例如 O(total_length)）是可行的，但任何长度的二次方 (O(total_length²)) 都太慢。 这排除了在长字符串中逐字符重复比较后缀和前缀的简单方法。 

边缘情况包括一个单词完全是下一个单词的前缀，或者两个单词共享重叠部分的情况。 例如，合并`"abc"`和`"bcd"`应该产生`"abcd"`。 一个总是附加而不计算最长重叠后缀前缀的简单实现会产生`"abcbcd"`，这是不正确的。 另一个微妙的情况是，当一个单词与前一个字符串相同时，重叠部分等于整个第二个单词，并且不应附加任何内容。 

## 方法

 暴力解决方案会迭代每个单词，并针对每个新单词检查当前字符串的每个可能的后缀，以查看它是否与新单词的前缀匹配。 这需要最多 O(L²) 次比较，其中 L 是迄今为止累积的字符串的长度。 对于最多 10^6 个字符，在最坏的情况下这会导致大约 10^12 次操作，这显然太慢了。 

加速这一过程的关键在于认识到这是一个经典的字符串重叠问题，可以使用 Knuth-Morris-Pratt (KMP) 算法来解决。 我们可以通过连接新单词、分隔符和累积字符串的最后部分来构造一个临时字符串，然后计算前缀函数（KMP 失败数组），而不是手动比较后缀和前缀。 前缀函数的最后一个值告诉我们最大重叠的长度。 通过仅附加新单词的不重叠后缀，我们可以有效地合并单词。 这将总工作量减少到 O(total_length)，因为在计算前缀函数时每个字符都会被处理固定次数。 

故事是，暴力破解是有效的，因为我们总是可以检查所有后缀-前缀组合，但由于二次时间，它会失败。 观察到可以使用 KMP 有效地计算重叠，从而将问题转化为线性时间字符串操作任务。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(总长度²) | O(总长度) | 太慢了 |
 | 基于KMP的最优| O(总长度) | O(总长度) | 已接受 |

 ## 算法演练

 1. 初始化`compressed`作为第一个单词，它成为我们的起始字符串。 
2. 迭代句子中的每个后续单词。 
3. 对于当前单词，计算与当前单词的最大重叠度`compressed`细绳。 连接当前单词，一个唯一的分隔符（例如，`#`），以及最后一个`len(word)`的字符`compressed`。 
4. 为该连接字符串构建前缀函数。 前缀函数数组的最后一个值表示当前单词匹配后缀的最长前缀的长度`compressed`。 
5. 附加到`compressed`仅当前单词不重叠的部分。 
6. 继续，直到处理完所有单词。 
7.输出最终结果`compressed`细绳。 

该算法之所以有效，是因为在每一步我们都明确计算当前字符串和下一个单词之间的最大重叠。 KMP 前缀函数保证我们永远不会错过更长的重叠，因此不变式“压缩始终包含以最大重叠正确合并的所有单词”始终成立。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def compute_prefix_function(s):
    n = len(s)
    pi = [0] * n
    for i in range(1, n):
        j = pi[i - 1]
        while j > 0 and s[i] != s[j]:
            j = pi[j - 1]
        if s[i] == s[j]:
            j += 1
        pi[i] = j
    return pi

def main():
    n = int(input())
    words = input().strip().split()
    
    compressed = words[0]
    
    for word in words[1:]:
        # only need last len(word) chars for overlap check
        overlap_check = word + "#" + compressed[-len(word):] if len(compressed) >= len(word) else word + "#" + compressed
        pi = compute_prefix_function(overlap_check)
        overlap_len = pi[-1]
        compressed += word[overlap_len:]
    
    print(compressed)

if __name__ == "__main__":
    main()
```该解决方案首先读取输入并使用第一个单词初始化压缩字符串。 对于每个后续单词，它构造用于计算前缀函数的字符串。 前缀数组的最后一个值确定与现有压缩字符串的后缀匹配的新单词的前缀长度。 仅附加不重叠的部分可以保证正确的合并。 仅使用最后一个`len(word)`的字符`compressed`避免不必要的工作，保持算法线性。 

## 工作示例

 **样品1**

 输入：`"I want to order pizza"`| 步骤| 压缩| 当前词 | 重叠| 追加|
 | ---| ---| ---| ---| ---|
 | 1 | “我” | “想要”| 0 | “想要”|
 | 2 | “我想要”| “到”| 0 | “到”|
 | 3 | “我想要” | “订单”| 0 | “订单”|
 | 4 | “我要订购”| “披萨”| 0 | “披萨”|

 最终输出：`"Iwanttoorderpizza"`**样品2**

 输入：`"abc bc c"`| 步骤| 压缩| 当前词 | 重叠| 追加|
 | ---| ---| ---| ---| ---|
 | 1 | “abc”| “BC”| 2 | “” |
 | 2 | “abc”| “c”| 1 | “” |

 最终输出：`"abc"`此跟踪确认算法正确检测到最大重叠并仅附加必要的字符。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(总长度) | 每个字符最多被处理两次：一次在前缀计算中，一次在附加 |
 | 空间| O(总长度) | 每个单词串联的前缀函数数组使用与单词长度成正比的空间 |

 考虑到单词的总长度 ≤ 10^6，这完全适合 1 秒和 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import main
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# provided sample
assert run("5\nI want to order pizza\n") == "Iwanttoorderpizza", "sample 1"

# minimum size input
assert run("1\na\n") == "a", "minimum size"

# complete overlap
assert run("3\nabc bc c\n") == "abc", "overlap"

# partial overlaps
assert run("3\nabc bcd cde\n") == "abcde", "partial overlaps"

# no overlaps
assert run("3\nhello world test\n") == "helloworldtest", "no overlaps"

# long overlap with same word
assert run("2\naaaa aaa\n") == "aaaa", "long overlap same letter"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | “5\n我想订披萨” | “我想点披萨” | 正常合并|
 | “1\na”| “一个”| 最小输入|
 | “3\nabc bc c” | “abc”| 完全重叠 |
 | “3\nabc bcd cde” | “abcde” | 部分重叠 |
 | "3\n你好世界测试" | “你好世界测试”| 没有重叠|
 | “2\naaaa aaa”| “啊啊”| 与重复字符重叠 |

 ## 边缘情况

 对于输入`"abc bc c"`，算法首先合并`"abc"`和`"bc"`。 最后两个字符`"bc"`重叠于`"bc"`，所以没有附加任何内容。 下一个，`"c"`与最后一个字符完全重叠`"abc"`，所以再次没有附加任何内容。 最后的字符串仍然存在`"abc"`，这是正确的。 前缀函数可以正确识别最大重叠，即使它们跨越整个新单词。 用于输入`"aaaa aaa"`，重叠为三个字符，将压缩字符串保留为`"aaaa"`。 这些边缘情况表明该算法可以正确处理完全和部分重叠，而无需附加冗余字符。
