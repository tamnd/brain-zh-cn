---
title: "CF 58A - 聊天室"
description: "问题是，输入一串小写字母的 Vasya 是否能够有效地说出“你好”。 目标不是检查输入的字符串是否完全是“hello”，而是我们是否可以删除一些字母（可能为零）以按顺序生成序列 h、e、l、l、o。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 58
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 54 (Div. 2)"
rating: 1000
weight: 58
solve_time_s: 80
verified: true
draft: false
---

[CF 58A - 聊天室](https://codeforces.com/problemset/problem/58/A)

 **评分：** 1000
 **标签：** 贪心，字符串
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 问题在于，输入一串小写字母的 Vasya 是否能够有效地说出“你好”。 目标不是检查输入的字符串是否恰好是“hello”，而是我们是否可以删除一些字母（可能为零）来生成序列`h`,`e`,`l`,`l`,`o`为了。 

输入是长度在 1 到 100 之间的单个字符串。如果可以从中提取单词“hello”，则输出为“YES”，否则输出为“NO”。 

限制非常宽松。 和`n ≤ 100`并且时间限制为 1 秒，即使是查看所有子序列的简单解决方案理论上也可以工作，但问题的本质实际上是扫描字符串中的目标序列。 可能欺骗天真的方法的边缘情况包括字母存在但顺序混乱的字符串，例如`hlelo`，其中包含“hello”的所有字母，但不保留它们的顺序。 另一个边缘情况是最小输入，例如，`h`，应该明确输出“NO”。 

## 方法

 暴力方法会尝试输入字符串的每个可能的子序列，看看它是否与“hello”匹配。 对于一个长度的字符串`n`， 有`2^n`子序列，即使对于`n = 100`，大致产生`10^30`检查。 显然，这种做法原则上是正确的，但不实用。 

关键的见解是我们不需要显式地考虑所有子序列。 我们只关心在扫描字符串时能否按顺序匹配“hello”的每个字符。 这表明贪婪扫描：保留索引`j`对于目标词“hello”。 遍历输入字符串`s`从左到右。 每当一个字符匹配时`hello[j]`, 增量`j`。 如果`j`达到“hello”的长度（5），我们已经成功找到了这个单词。 这与字符串的长度成线性关系，并直接编码问题的顺序要求。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(1) | O(1) | 太慢了 |
 | 贪婪扫描| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`target = "hello"`和一个索引`j = 0`跟踪我们当前正在寻找的“hello”的哪个字符。 
2. 迭代每个字符`c`在输入字符串中`s`。 
3.如果`c`等于`target[j]`, 增量`j`。 这会将我们移至需要匹配的下一个字符。 我们自动跳过所有其他字符，因为它们不会破坏顺序。 
4. 扫描字符串后，检查是否`j`等于 5。如果是，则打印“YES”，否则打印“NO”。 

为什么有效：贪婪方法依赖于以下不变量：`j`始终指向需要匹配的“hello”的下一个字符。 每次字符匹配时，它都会使索引前进。 中间的任何字符都将被忽略，因为它们不会阻止形成子序列。 这保证了如果`j`达到 5 时，所有字母均已按正确顺序匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()
target = "hello"
j = 0

for c in s:
    if c == target[j]:
        j += 1
        if j == len(target):
            break

print("YES" if j == len(target) else "NO")
```该代码读取输入并删除所有尾随换行符。 我们维护一个指针`j`通过“hello”来跟踪我们的进度。 当我们迭代时`s`，我们增加`j`每当我们匹配当前目标字符时。 如果我们到达终点`target`，我们为了效率提前停下来。 最后，如果所有字母都匹配，我们打印“YES”，否则打印“NO”。 

## 工作示例

 ### 示例 1

 输入：`ahhellllloou`| s[i] | c | 目标[j] | j |
 | --- | --- | --- | --- |
 | 0 | 一个 | 小时 | 0 |
 | 1 | 小时 | 小时 | 1 |
 | 2 | 小时 | 电子| 1 |
 | 3 | 电子| 电子| 2 |
 | 4 | 我| 我| 3 |
 | 5 | 我| 我| 4 |
 | 6 | 我| 哦| 4 |
 | 7 | 我| 哦| 4 |
 | 8 | 我| 哦| 4 |
 | 9 | 哦| 哦| 5 |

 所有目标字母均按顺序匹配。 输出：`YES`。 

### 示例 2

 输入：`hlelo`| s[i] | c | 目标[j] | j |
 | --- | --- | --- | --- |
 | 0 | 小时 | 小时 | 1 |
 | 1 | 我| 电子| 1 |
 | 2 | 电子| 电子| 2 |
 | 3 | 我| 我| 3 |
 | 4 | 哦| 我| 3 |`j`永远不会达到 5。输出：`NO`。 

这些痕迹证实该算法正确跟踪顺序匹配并拒绝无序字母。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 我们扫描每个字符一次，对每个字符最多执行一次比较和指针增量 |
 | 空间| O(1) | O(1) | 无论输入长度如何，仅使用几个变量 |

 和`n ≤ 100`，这完全在时间和内存限制之内。 即使`n`更大时，这种线性扫描可以很好地缩放。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    s = input().strip()
    target = "hello"
    j = 0
    for c in s:
        if c == target[j]:
            j += 1
            if j == len(target):
                break
    return "YES" if j == len(target) else "NO"

# Provided sample
assert run("ahhellllloou") == "YES", "sample 1"

# Custom cases
assert run("hlelo") == "NO", "letters out of order"
assert run("h") == "NO", "single letter"
assert run("helicopterlo") == "YES", "interleaved extra letters"
assert run("aaaaa") == "NO", "no relevant letters"
assert run("hhheeellllooo") == "YES", "duplicates before matches"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 赫洛 | 否 | 顺序命令执行|
 | 小时 | 否 | 最小输入处理|
 | 直升机| 是 | 跳过不相关的字母 |
 | 啊啊啊| 否 | 缺少目标字母 |
 | hheeellllooo | 是 | 处理多个连续匹配|

 ## 边缘情况

 对于`s = "h"`，算法迭代一次，看到`h`比赛`target[0]`, 增量`j = 1`。 没有更多的字符，`j < 5`，所以输出是`NO`。 为了`s = "hhheeellllooo"`，算法递增`j`仅当下一个所需字母匹配时，跳过重复项。 毕竟角色，`j = 5`,正确输出`YES`。 这些证实了贪婪扫描可以正确处理不足和重复的输入。
