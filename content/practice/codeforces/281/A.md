---
title: "CF 281A - 单词大写"
description: "任务是获取一个由英文字母组成的单词，并确保它的第一个字符是大写的。 其余字母必须与输入中的字母完全相同。 例如，给定输入“apple”，输出应为“Apple”。"
date: "2026-06-05T09:13:28+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 281
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 172 (Div. 2)"
rating: 800
weight: 281
solve_time_s: 283
verified: true
draft: false
---

[CF 281A - 单词大写](https://codeforces.com/problemset/problem/281/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 4m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是获取一个由英文字母组成的单词，并确保它的第一个字符是大写的。 其余字母必须与输入中的字母完全相同。 例如，给定输入“apple”，输出应为“Apple”。 如果输入已经以大写字母开头，例如“Apple”，则输出应保持不变。 输入可以混合小写和大写字母，例如“ApPLe”，在这种情况下，只有第一个字符需要修改。 

约束很简单：单词非空且长度不超过 103 个字符。 This is a very small input size, so any algorithm that inspects the characters sequentially or performs constant-time string operations will run well within the 2-second limit. 无需大量优化； 即使是简单的方法也会在微秒内完成。 

Edge cases arise when the first character is already uppercase, when the word is a single letter, or when the first character is lowercase and the rest are a mix of uppercase and lowercase letters. 例如，输入“a”应生成“A”。 输入“Zebra”应保持“Zebra”。 如果粗心的实现将整个单词转换为大写，则会错误地将“aPpLe”转换为“APPLE”而不是“APPpLe”。 

## 方法

 解决该问题的最简单方法是手动检查字符串的第一个字符。 如果是小写，则将其转换为大写，然后将其与字符串的其余部分保持不变连接。 这是可行的，因为字符串索引和连接对于如此小的长度来说是恒定时间的操作。 对于输入大小来说，这种强力方法既正确又快速，只需少量操作。 

稍微不同的观点是使用内置字符串函数，例如 Python`str.capitalize()`。 然而，`str.capitalize()`将第一个字符转换为大写，但也强制所有其他字符转换为小写，这在这里是不可接受的。 This demonstrates why reading documentation carefully matters: a standard library function that seems to do "capitalization" may have side effects that break correctness.

 因此，最佳方法非常简单：仅将第一个字符转换为大写，其余部分保持不变。 This exploits the small fixed structure of the problem - we only care about one character at a time, and the remainder of the string does not need inspection or modification. 除了切片之外，不需要对整个字符串进行迭代。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（手动检查并修改第一个字符） | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 使用`str.capitalize()`| O(n) | O(n) | 混合大小写输入不正确 |
 | 最佳（大写第一个字符，连接余数）| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取输入单词并删除所有尾随换行符或空格。 这确保我们只处理实际的字母。 
2. 提取单词的第一个字符。 该角色是唯一可能需要修改的角色。 
3. 将第一个字符转换为大写。 在 Python 中，这可以通过以下方式完成`upper()`方法。 
4. 从索引 1 开始，将大写的第一个字符与由单词中所有剩余字符组成的子字符串连接起来。这会保留单词其余部分的原始大小写。 
5. 打印结果字符串。 

这是有效的，因为不变量很简单：第一个字符保证为大写，字符串的其余部分保持与输入中完全相同。 由于字符串切片保留了顺序和内容，因此不会丢失任何信息，并且算法始终会生成正确的大写单词。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

word = input().strip()
capitalized = word[0].upper() + word[1:]
print(capitalized)
```代码首先使用删除任何尾随换行符`strip()`以确保只保留字母。 然后它访问`word[0]`隔离第一个字符并应用`upper()`。 连接与`word[1:]`保留所有剩余字母原样。 最后，打印结果。 此实现可以正确处理单字符单词，因为切片`word[1:]`在单字符字符串上生成一个空字符串，因此串联不会出现错误。 

## 工作示例

 输入：“ApPLe”

 | 步骤| 词| 第一个字符 | 余数 | 大写|
 | --- | --- | --- | --- | --- |
 | 1 | “AppPLe”| “A”| “pPLe”| “A”+“pPLe”|
 | 2 | 输出| “AppPLe” | | |

 这表明如果第一个字符已经是大写，则不会发生任何修改。 

输入：“苹果”

 | 步骤| 词| 第一个字符 | 余数 | 大写|
 | --- | --- | --- | --- | --- |
 | 1 | “苹果”| “一个”| “苹果”| “A”+“苹果” |
 | 2 | 输出| “苹果”| | |

 这演示了转换第一个字母，同时保持其余字母不变。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅修改第一个字符，其余字符被切片而不迭代。 最大字符串长度为 103。 
| 空间| O(1) | O(1) | 没有与输入成正比的额外空间； 仅创建一个新字符串。 |

 考虑到这些限制，该解决方案非常适合时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    word = input().strip()
    return word[0].upper() + word[1:]

# provided sample
assert run("ApPLe\n") == "ApPLe", "sample 1"

# custom cases
assert run("apple\n") == "Apple", "lowercase first letter"
assert run("z\n") == "Z", "single character lowercase"
assert run("Z\n") == "Z", "single character uppercase"
assert run("aPpLe\n") == "APpLe", "mixed case first letter lowercase"
assert run("AbcDEfG\n") == "AbcDEfG", "already capitalized"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | “苹果”| “苹果”| 小写第一个字母 |
 | “z”| “Z”| 单字符小写 |
 | “Z”| “Z”| 单字符大写|
 | “苹果”| “苹果” | 混合大小写首字母小写 |
 | “AbcDEfG” | “AbcDEfG” | 已经大写|

 ## 边缘情况

 对于像“z”这样的单字符小写单词，该算法访问`word[0]`, 适用`upper()`，产生“Z”，并与`word[1:]`，这是空的。 输出是正确的。 

对于像“Z”这样的单字符大写单词，`word[0].upper()`将其保留为“Z”并与`word[1:]`（空）不会改变它。 

对于像“aPpLe”这样的混合大小写输入，第一个字符将转换为“A”，而其余的“PpLe”保持不变。 这证实了该算法没有错误地小写或修改剩余的字母。
