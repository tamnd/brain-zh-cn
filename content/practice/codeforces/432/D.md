---
title: "CF 432D - 前缀和后缀"
description: "我们得到了一串大写字母。 我们的目标是识别字符串中与某些后缀相同的所有前缀，并且对于每个这样的前缀，计算它作为连续子字符串在字符串内任何位置出现的次数。"
date: "2026-06-07T02:36:37+07:00"
tags: ["codeforces", "competitive-programming", "dp", "string-suffix-structures", "strings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 432
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 246 (Div. 2)"
rating: 2000
weight: 432
solve_time_s: 251
verified: true
draft: false
---

[CF 432D - 前缀和后缀](https://codeforces.com/problemset/problem/432/D)

 **评级：** 2000
 **标签：** dp、字符串后缀结构、字符串、两个指针
 **求解时间：** 4m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一串大写字母。 我们的目标是识别字符串中与某些后缀相同的所有前缀，并且对于每个这样的前缀，计算它作为连续子字符串在字符串内任何位置出现的次数。 例如，如果字符串是`"ABACABA"`, 前缀`"A"`也是长度为一的后缀，在字符串中总共出现四次。 

输入字符串最长可达 100,000 个字符。 一种简单的方法，根据每个可能的子字符串检查每个可能的前缀，其执行顺序如下：$10^{10}$最坏情况下的操作，远远超过一秒的时间限制。 这告诉我们需要一个线性或近线性的解决方案。 

可能导致幼稚实现失败的边缘情况包括每个字符都相同的字符串，例如`"AAAAA"`。 在这种情况下，多个不同长度的前缀与后缀匹配，并且它们的计数随着重叠出现而增长。 粗心的解决方案可能会错误计算重叠子字符串或省略长度等于整个字符串的前缀。 同样，没有重复模式的字符串，例如`"ABCDEFG"`，要求算法正确地仅返回长度为 1 的匹配项（如果有），而不会错误地识别更长的不存在的匹配项。 

## 方法

 暴力方法迭代所有可能的前缀长度。 对于每个前缀，它检查是否与相同长度的相应后缀匹配。 然后它扫描整个字符串以计算该前缀出现的次数。 虽然正确，但这种方法的复杂度大约为$O(n^2)$，因为每次前缀检查都需要扫描字符串，而前缀总数为$O(n)$。 这对于$n = 10^5$。 

最佳方法利用了这样一个事实：我们可以使用 Knuth-Morris-Pratt (KMP) 算法中的前缀函数有效地计算重复出现的子字符串。 位置处的前缀函数$i$告诉我们子串的最长正确前缀的长度$s[0..i]$这也是该子字符串的后缀。 使用这个函数，我们可以在线性时间内识别前缀与后缀匹配的所有长度。 此外，通过计算每个前缀长度在前缀函数数组中出现的次数，我们可以确定每个候选子串作为子串出现的频率。 这将问题减少到$O(n)$时间。 

暴力破解之所以有效，是因为它直接实现问题定义，但对于长字符串则失败。 通过观察前缀函数对所有重复的前缀-后缀关系进行编码，我们可以将前缀-后缀识别和子串计数减少为字符串上的线性传递。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了|
 | KMP / 前缀功能 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算字符串的前缀函数。 对于每个位置`i`,`pi[i]`存储最长的适当前缀的长度`s[0..i]`匹配结尾为的后缀`i`。 该函数捕获所有重复的前缀-后缀关系。 
2. 使用前缀函数数组计算字符串中每个前缀长度的频率。 初始化一个大小为 count 的数组`n+1`带零。 对于每个`pi[i]`, 增量`count[pi[i]]`。 这将帮助我们稍后计算每个前缀作为子字符串出现的次数。 
3. 将计数从较长的前缀传播到较短的前缀。 由于前缀长度`x`也贡献于作为其适当前缀的所有前缀，从最大长度到最小长度迭代：`count[pi[i]] += count[i+1]`。 这确保每个前缀都包含所有出现的较长重叠前缀。 
4. 识别所有同时也是后缀的前缀长度。 从完整字符串长度开始并遵循前缀函数链：`length = n`， 然后`length = pi[length-1]`，重复直到`length == 0`。 收集这些长度。 
5. 对于每个收集的前缀长度，出现的次数为`count[length] + 1`，因为根据定义每个前缀至少出现一次。 按长度递增的顺序输出它们。 

工作原理：前缀函数在线性时间内对所有重复的前缀后缀结构进行编码。 通过将计数从较长的前缀传播到较短的前缀，我们可以解决重叠出现的情况。 链条如下`pi[length-1]`保证我们找到所有同时也是后缀的前缀，并按包含顺序排列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()
n = len(s)

# Step 1: Compute prefix function
pi = [0] * n
for i in range(1, n):
    j = pi[i-1]
    while j > 0 and s[i] != s[j]:
        j = pi[j-1]
    if s[i] == s[j]:
        j += 1
    pi[i] = j

# Step 2: Count occurrences of each prefix length
count = [0] * (n + 1)
for length in pi:
    count[length] += 1

# Step 3: Propagate counts
for i in range(n, 0, -1):
    count[pi[i-1]] += count[i]

# Step 4: Collect prefix-suffix matches
lengths = []
k = n
while k > 0:
    lengths.append(k)
    k = pi[k-1]
lengths.sort()

# Step 5: Output results
print(len(lengths))
for l in lengths:
    print(l, count[l] + 1)
```第一个循环中的前缀函数计算是标准 KMP。 步骤2初始化频率数组。 步骤 3 将出现的事件从较长的前缀传播到其正确的子前缀，从而考虑到重叠匹配。 步骤 4 迭代前缀函数链以查找所有作为后缀的前缀。 排序可确保输出按升序排列。 这`+1`在步骤 5 中考虑了前缀本身至少出现一次。 

## 工作示例

 输入示例：`"ABACABA"`| 我| s[i] | 圆周率[i] | 第 2 步后计数 |
 | ---| ---| ---| ---|
 | 0 | 一个 | 0 | [0,0,0,0,0,0,0,0] |
 | 1 | 乙| 0 | 相同|
 | 2 | 一个 | 1 | [0,1,0,0,0,0,0,0] |
 | 3 | C | 0 | [0,1,0,0,0,0,0,0] |
 | 4 | 一个 | 1 | [0,2,0,0,0,0,0,0] |
 | 5 | 乙| 2 | [0,2,1,0,0,0,0,0] |
 | 6 | 一个 | 3 | [0,2,1,1,0,0,0,0] |

 传播计数并跟踪前缀后缀链后，长度`[1, 3, 7]`被识别。 它们的出现次数是`[4, 2, 1]`，匹配示例输出。 

自定义输入：`"AAAA"`| 我| 圆周率[i] |
 | ---| ---|
 | 0 | 0 |
 | 1 | 1 |
 | 2 | 2 |
 | 3 | 3 |

 计数传播给出计数`[4,3,2,1]`，前缀后缀链产生长度`[1,2,3,4]`与事件`[4,3,2,1]`。 

这些痕迹确认了重叠重复和完整字符串匹配的正确性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 前缀函数计算是线性的； 计数传播和前缀后缀追踪也是线性的 |
 | 空间| O(n) | 数组`pi`和`count`使用`O(n)`空间|

 给定$n \le 10^5$和运营$O(n)$，该解决方案可以在 1 秒内轻松运行，并且使用的内存少于 256 MB 的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())
    return output.getvalue().strip()

# Provided sample
assert run("ABACABA\n") == "3\n1 4\n3 2\n7 1", "sample 1"

# Minimum-size input
assert run("A\n") == "1\n1 1", "single character"

# All equal characters
assert run("AAAA\n") == "4\n1 4\n2 3\n3 2\n4 1", "all same"

# No repeating prefix-suffix
assert run("ABCDEFG\n") == "1\n1 1", "no repeats"

# Overlapping occurrences
assert run("ABABAB\n") == "3\n2 3\n4 2\n6 1", "overlapping repeats"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`"A"`|`"1\n1 1"`| 正确处理最小字符串 |
 |`"AAAA"`| `"4\n1 4 | |
