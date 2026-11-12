---
title: "CF 2167B - 你的名字"
description: "我们有两个字符串 s 和 t，每个字符串的长度为 n。 第一个字符串代表一行字母立方体，第二个字符串是目标名称。 任务是确定是否可以重新排列 s 的字母以与 t 完全匹配。"
date: "2026-06-07T23:24:19+07:00"
tags: ["codeforces", "competitive-programming", "sortings", "strings"]
categories: ["algorithms"]
codeforces_contest: 2167
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1062 (Div. 4)"
rating: 800
weight: 2167
solve_time_s: 74
verified: true
draft: false
---

[CF 2167B - 你的名字](https://codeforces.com/problemset/problem/2167/B)

 **评分：** 800
 **标签：** 排序、字符串
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个字符串，`s`和`t`，每个长度`n`。 第一个字符串代表一行字母立方体，第二个字符串是目标名称。 任务是确定是否可以重新排列字母`s`完全匹配`t`。 本质上，我们正在检查是否`t`是一个排列`s`。 

限制很小：`n`最多 20 个，最多可以有 1000 个测试用例。 这意味着我们可以进行三次甚至阶乘运算`n`对于单个测试用例，尽管更简单的方法会更快、更干净。 输入字符串仅包含小写字母，因此任何检查字母频率的解决方案都足够了。 

当字符串包含重复的字母时，会出现微妙的边缘情况。 例如，`s = "aaab"`和`t = "abaa"`应该返回“YES”，因为字母在数量上匹配，但是如果实施不正确，简单地逐个字符地比较排序的字符串而不考虑频率的天真检查可能会失败。 另一种情况是当`s`和`t`具有相同的字母但不同的计数，例如`s = "abc"`和`t = "aab"`，它必须返回“NO”。 

## 方法

 蛮力方法是生成所有排列`s`并检查是否有任何等于`t`。 这是正确的，因为它确实测试了所有可能的重新排列，但其复杂性是`O(n!)`每个测试用例。 即使与`n = 20`，这是完全不可行的，因为 20 阶乘大约是 2.4 × 10^18 次运算。 显然，我们需要一种更快的方法。 

关键的观察结果是字母的顺序并不重要，重要的是它们的计数。 如果`s`可以重新排列形成`t`， 然后`s`和`t`必须包含完全相同且频率相同的字母。 这将问题简化为简单的频率比较。 一种方便的方法是对两个字符串进行排序并逐个字符进行比较。 或者，我们可以使用长度为 26 的数组（对于“a”到“z”）来计算每个字母的出现次数并比较计数。 两种方法都具有线性或近线性时间复杂度`n`，鉴于尺寸较小，速度非常快`n`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 排序和比较 | O(n log n) | O(n log n) | O(n) | 已接受 |
 | 计算频率 | O(n) | O(26) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量，`q`。 
2. 对于每个测试用例，请阅读`n`和两个字符串`s`和`t`。 
3. 对两个字符串进行排序。 排序可确保字符按字典顺序排列。 如果`s`可以重新排列成`t`，它们的排序版本必须相同。 
4. 比较排序后的字符串。 如果完全相等，则输出“YES”； 否则，输出“NO”。 

为什么有效：排序将排列问题转化为线性比较。 字母计数或字符的任何不匹配都会出现在排序后的字符串中，以保证正确性。 不变的是排序后的字符串保留了字符的多重集； 如果多重集相同，则一个字符串是另一个字符串的排列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

q = int(input())
for _ in range(q):
    n = int(input())
    s, t = input().split()
    if sorted(s) == sorted(t):
        print("YES")
    else:
        print("NO")
```该解决方案首先读取测试用例的数量并迭代每个测试用例。 这`input().split()`调用有效地从同一行读取两个字符串。 对两个字符串进行排序可以将问题简化为简单的相等性检查。 此实现正确处理多个测试用例，并利用 Python 高效的内置排序，这对于`n <= 20`。 

## 工作示例

 **示例1：**`s = "humitsa"`,`t = "mitsuha"`| 步骤| 已排序 | t 排序 | 比较|
 | --- | --- | --- | --- |
 | 初始| 胡米萨 | 三叶 | |
 | 排序后| 啊我是你| 啊我是你| 等于 → 是 |

 跟踪确认排序确实对齐了字母，因此返回“YES”。 

**示例2：**`s = "aakima"`,`t = "makima"`| 步骤| 已排序 | t 排序 | 比较|
 | --- | --- | --- | --- |
 | 初始| 亚基马 | 马基马 | |
 | 排序后| a a i k m m | a a i k m m | 等于 → 否 |

 排序后，我们发现每个字母的计数不同。 这证实了算法正确识别字符串何时不是排列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q * n log n) | O(q * n log n) | 对每个字符串进行排序在成本上占主导地位；`q`测试用例乘以这个。 |
 | 空间| O(n) | 排序会创建与字符串长度成比例的临时数组。 |

 给定`q <= 1000`和`n <= 20`，总操作最多为 1000 × 20 log 20 ≈ 1000 × 80 = 80,000，完全符合 1 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution function
    q = int(input())
    for _ in range(q):
        n = int(input())
        s, t = input().split()
        if sorted(s) == sorted(t):
            print("YES")
        else:
            print("NO")
    return output.getvalue().strip()

# Provided samples
assert run("5\n7\nhumitsa mitsuha\n4\norhi hori\n6\naakima makima\n6\nnezuqo nezuko\n6\nmisaka mikasa\n") == "YES\nYES\nNO\nNO\nYES"

# Custom tests
assert run("1\n1\na a\n") == "YES", "single character, equal"
assert run("1\n1\na b\n") == "NO", "single character, different"
assert run("1\n4\naaaa aaaa\n") == "YES", "all letters same"
assert run("1\n4\naabb abab\n") == "YES", "letters same but shuffled"
assert run("1\n4\naabb abbc\n") == "NO", "different counts"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1\n1\na 一个 | 是 | 最小尺寸输入，相同的字母 |
 | 1\n1\na b | 否 | 最小尺寸输入，不同字母 |
 | 1\n4\naaaa aaaa | 1\n4\naaaa aaaa | 是 | 所有字母相同|
 | 1\n4\naabb abab | 1\n4\naabb abab | 是 | 字母洗牌|
 | 1\n4\naabb abbc | 1\n4\naabb abbc | 否 | 计数不匹配 |

 ## 边缘情况

 对于最小尺寸输入`s = "a"`,`t = "a"`，算法将两者排序为“a”并返回“YES”。 如果`t = "b"`，排序后的字符串不同，返回“NO”。 对于重复的字母，例如`s = "aabb"`和`t = "abab"`，两个字符串的排序结果都是“aabb”，确认算法正确处理字母的多集，而不仅仅是唯一元素。
