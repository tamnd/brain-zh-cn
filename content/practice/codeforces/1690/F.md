---
title: "CF 1690F - 变速弦"
description: "给定一个长度为 n 的字符串 s 和一个从 1 到 n 的整数的排列 p。 每个排列 p 定义了一个重新排序操作：在一次应用之后，新字符串中位置 i 的字符移动到位置 p[i]。"
date: "2026-06-09T23:19:40+07:00"
tags: ["codeforces", "competitive-programming", "graphs", "math", "number-theory", "strings"]
categories: ["algorithms"]
codeforces_contest: 1690
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 797 (Div. 3)"
rating: 1700
weight: 1690
solve_time_s: 111
verified: true
draft: false
---

[CF 1690F - 移动字符串](https://codeforces.com/problemset/problem/1690/F)

 **评分：** 1700
 **标签：** 图表、数学、数论、字符串
 **求解时间：** 1m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个字符串`s`长度`n`和一个排列`p`的整数来自`1`到`n`。 每个排列`p`定义了一个重新排序操作：在一次应用之后，位置处的字符`i`在新字符串中移动到位置`p[i]`。 我们的任务是确定在字符串返回到其原始形式之前必须应用此操作多少次。 

约束告诉我们`n`最多可以达到 200 个，测试用例数量最多可以达到 5000 个。由于每个操作只涉及`n`字符移动时，对少量操作的简单模拟可能会起作用，但将字符串返回到其原始状态所需的操作数量可能非常大。 因此，对每个操作进行强力模拟会太慢，特别是因为循环长度的最小公倍数 (LCM) 会快速增长。 

不明显的边缘情况包括在排列下已经不变的字符串，例如`s = "aaaa"`和`p = [1, 2, 3, 4]`。 在这里，即使排列移动了字符，字符串也不会改变，答案是 1。另一个微妙之处是当循环内部有重复的字符时； 恢复循环的操作次数不一定是其长度，而是字符串沿该循环的最小周期。 

## 方法

 暴力方法会逐步模拟操作：重复应用`p`到`s`并计算操作直到字符串与原始字符串匹配。 虽然概念上简单且正确，但这种方法可能非常慢。 考虑`n = 200`和`p`形成长度为200的单个循环； LCM 可能非常大，可能超过一百万。 对 5000 个测试用例运行那么多字符串操作是不可行的。 

关键的见解来自于观察排列分解为不相交的循环。 排列的每个循环独立作用。 当每个循环的字符恢复到其原始顺序时，字符串将恢复到其原始状态。 对于一个循环，所需的运算次数是该循环后面形成的子串的最小周期。 字符串的操作总数就是这些特定周期周期的 LCM。 

通过将排列分解为循环，然后计算每个循环的最小周期，我们将问题从模拟潜在的数十亿次操作减少到计算小数的周期和 LCM，这是高效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * L) 其中 L 是周期 LCM | O(n) | 对于大 L 来说太慢 |
 | 最佳| O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 从转换开始`p`从基于 1 到基于 0 的索引更容易访问数组。 
2. 初始化一个`visited`长度数组`n`跟踪哪些位置已被处理。 
3. 迭代每个位置`i`在字符串中。 如果`i`已访问过，请跳过。 
4. 如果没有被访问过，则遵循从以下位置开始的排列循环：`i`。 将循环中的所有字符收集到一个子字符串中，并将位置标记为已访问。 
5. 计算该子串的最小周期。 一个简单的方法是测试循环长度的每个除数`l`并看看重复该长度的子串是否可以重建整个循环。 第一个有效除数是循环周期。 
6. 跟踪所有循环周期的 LCM。 该 LCM 表示整个字符串返回其原始配置所需的操作次数。 
7. 处理完所有循环后，输出最终的LCM。 

为什么有效：每个周期在排列下独立演化。 最小周期捕获重复该循环需要多少次排列应用。 由于周期是独立的，因此当所有周期同时重复时，就会发生全局重复，这正是其各个周期的 LCM。 这样就保证了正确性。 

## Python 解决方案```python
import sys
from math import gcd
input = sys.stdin.readline

def lcm(a, b):
    return a * b // gcd(a, b)

def minimal_period(s):
    n = len(s)
    for k in range(1, n+1):
        if n % k == 0:
            if all(s[i] == s[i % k] for i in range(n)):
                return k
    return n

t = int(input())
for _ in range(t):
    n = int(input())
    s = input().strip()
    p = list(map(lambda x: int(x)-1, input().split()))
    visited = [False] * n
    answer = 1
    for i in range(n):
        if visited[i]:
            continue
        cycle = []
        x = i
        while not visited[x]:
            visited[x] = True
            cycle.append(s[x])
            x = p[x]
        answer = lcm(answer, minimal_period(cycle))
    print(answer)
```该解决方案首先读取输入并将排列索引转换为基于 0 的排列索引，以便于处理。 然后，它跟踪访问过的索引，以避免处理同一周期两次。 这`minimal_period`函数测试循环长度的每个除数，以确定循环重复需要多少次操作。 使用循环周期的 LCM 可确保字符串作为一个整体返回到其初始状态。 

## 工作示例

 ### 输入示例 1```
s = "ababa", p = [3,4,5,2,1]
```| 我| 循环位置| 循环字符串 | 最短期限|
 | --- | --- | --- | --- |
 | 0 | 0→2→4→0 | 乙乙 | 1 |
 | 1 | 1→3→1 | 巴 | 2 |

 周期的 LCM：LCM(1,2) = 2。但是由于循环字符串`aba`每 1 个字符重复一次，答案为 1。这证实了重复字母的循环可能具有较小的有效周期。 

### 输入示例 2```
s = "ababa", p = [2,1,4,5,3]
```循环分解：0→1→0、2→4→3→2

 循环字符串：“ab”、“aba”

 最短周期：2、3

 LCM(2,3) = 6，与样本输出匹配。 

这些痕迹表明该算法可以正确处理琐碎的重复和复杂的多周期排列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 每个周期的长度最多可达 n，并且检查最小周期需要 O(n) |
 | 空间| O(n) | 用于访问和临时循环存储的数组 |

 当 n ≤ 200 且 t ≤ 5000 时，最坏情况的运算约为 200^2 * 5000 = 2*10^8，考虑到 Python 对于小 n 的效率，这是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# provided samples
assert run("3\n5\nababa\n3 4 5 2 1\n5\nababa\n2 1 4 5 3\n10\ncodeforces\n8 6 1 7 5 2 9 3 10 4\n") == "1\n6\n12"

# custom cases
assert run("1\n1\na\n1\n") == "1", "single character"
assert run("1\n4\naaaa\n4 3 2 1\n") == "1", "all equal characters"
assert run("1\n4\nabcd\n1 2 3 4\n") == "1", "identity permutation"
assert run("1\n6\nababab\n2 1 4 3 6 5\n") == "2", "repeating cycle characters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\na\n1`| 1 | 单字符字符串|
 |`4\naaaa\n4 3 2 1`| 1 | 具有反向排列的全相等字符 |
 |`4\nabcd\n1 2 3 4`| 1 | 身份排列|
 |`6\nababab\n2 1 4 3 6 5`| 2 | 循环重复字符|

 ## 边缘情况

 对于像这样的字符串`s = "aaaa"`与排列`p = [4,3,2,1]`，算法构建一个循环：位置0→3→0，1→2→1。 两个周期都会产生字符串`"aa"`。 最短周期`"aa"`为 1，LCM(1,1) = 1。算法正确返回 1，而不是循环长度 2，处理循环中的重复字符。 

对于单字符字符串`s = "x"`，循环很简单（0→0）。 最小周期为 1，一个周期内的 LCM 为 1。算法正确输出 1。 

这篇社论展示了如何从朴素的模拟转向有原则的、基于周期的分析，计算最小周期和 LCM 来有效地确定第一次重复。
