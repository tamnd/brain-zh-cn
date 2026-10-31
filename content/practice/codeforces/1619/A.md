---
title: "CF 1619A - 方弦？"
description: "给定几个字符串，我们需要确定每个字符串是否为方串。 如果一个字符串可以表示为与自身连接的某个子字符串，则该字符串是方形的。"
date: "2026-06-10T06:09:18+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1619
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 762 (Div. 3)"
rating: 800
weight: 1619
solve_time_s: 99
verified: false
draft: false
---

[CF 1619A - 方弦？](https://codeforces.com/problemset/problem/1619/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定几个字符串，我们需要确定每个字符串是否为方串。 如果一个字符串可以表示为与自身连接的某个子字符串，则该字符串是方形的。 例如，“abab”是方形的，因为它是“ab”重复两次，而“abcab”不是方形的，因为没有重复两次的子字符串会产生原始字符串。 

输入由一个整数组成`t`其次是`t`字符串。 每个字符串的长度在 1 到 100 之间。如果字符串是方形，则输出为“YES”，否则为“NO”。 

限制很小：最多 100 个字符串，长度最多为 100。这使我们能够使用字符串长度的二次算法，但理想情况下我们的目标是对每个字符串进行线性或近线性检查。 

需要注意的边缘情况包括奇数长度的字符串。 例如，“aaa”的长度为 3，无法将其平均分成相等的两半。 任何奇数长度的字符串都自动不是方形的。 另一个微妙的情况是像“aa”或“aaaa”这样的字符串，它们是完美的正方形，但如果不小心，简单的子字符串搜索可能会使解决方案变得过于复杂。 长度为 1 的字符串（如“a”）永远不是方形的。 

## 方法

 蛮力方法是考虑所有可能的长度子串`n/2`并检查重复它们是否会产生原始字符串。 对于一个长度的字符串`n`，只有一个候选子串的长度`n/2`（上半场）。 简单的检查会将字符串分成前半部分和后半部分并进行比较。 每次比较都需要 O(n/2) 时间。 由于长度最多为 100 的字符串最多有 100 个，因此这种方法是可以接受的，但我们可以进一步推理。 

关键的观察是，当且仅当字符串的长度为偶数并且前半部分与后半部分相同时，字符串才是正方形的。 这一观察立即将我们的问题简化为一个简单的检查：如果长度是奇数，则输出“NO”； 如果长度是偶数，则直接比较两半。 每个字符串都是线性的，并且仅使用 O(1) 额外空间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力子串重复检查 | 每个字符串 O(n) | O(n) | 已接受 |
 | 半分割比较| 每个字符串 O(n) | O(1) | O(1) | 已接受 |

 半分割方法在这里是最佳的并且易于实现。 

## 算法演练

 1.读取测试用例数量`t`。 
2. 循环每个字符串输入。 
3. 对于每个字符串，计算其长度`n`。 
4.如果`n`是奇数，立即打印“NO”，因为奇数长度的字符串不能是正方形。 
5. 如果`n`是偶数，将字符串分成两半：前半部分包含字符`s[0:n//2]`，下半场`s[n//2:n]`。 
6. 比较两半。 如果相等，则打印“YES”； 否则，打印“NO”。 

为什么它有效：一根绳子只有由两个相同的半部分组成，才能成为正方形。 首先检查长度确保我们不会尝试分割奇数长度的字符串，直接比较两半可以保证正确性，因为两半中的任何不匹配都会立即使平方属性无效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    s = input().strip()
    n = len(s)
    if n % 2 == 1:
        print("NO")
    else:
        mid = n // 2
        if s[:mid] == s[mid:]:
            print("YES")
        else:
            print("NO")
```该解决方案使用有效地读取所有输入`sys.stdin.readline`。 删除换行符对于确保字符串长度正确非常重要。 我们首先检查长度奇偶性以捕获明显的“否”情况，然后直接比较两半。 

## 工作示例

 **示例 1：“abab”**

 | 变量| 价值|
 | ---| ---|
 | s | “阿巴”|
 | n | 4 |
 | 中| 2 |
 | s[:中] | “ab”|
 | s[中：] | “ab”|
 | 比较| 等于 → 是 |

 该算法正确地将“abab”识别为正方形。 

**示例 2：“abcab”**

 | 变量| 价值|
 | ---| ---|
 | s | “abcab”|
 | n | 5 |
 | 平价| 奇数 → 否 |

 奇数长度检查立即产生“NO”，正确处理这种边缘情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * t) | 每个字符串比较的时间复杂度为 O(n)，总共 t 个字符串 |
 | 空间| O(1) | O(1) | 我们只存储字符串切片和整数用于索引 |

 和`t ≤ 100`和`n ≤ 100`，总工作量最多为 10,000 个字符比较，完全在 1 秒的限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        s = input().strip()
        n = len(s)
        if n % 2 == 1:
            print("NO")
        else:
            mid = n // 2
            if s[:mid] == s[mid:]:
                print("YES")
            else:
                print("NO")
    return output.getvalue().strip()

# provided sample
assert run("10\na\naa\naaa\naaaa\nabab\nabcabc\nabacaba\nxxyy\nxyyx\nxyxy\n") == \
"NO\nYES\nNO\nYES\nYES\nYES\nNO\nNO\nNO\nYES"

# custom cases
assert run("3\nb\ncc\ndd\n") == "NO\nYES\nYES", "single and double letters"
assert run("2\nabcdabcd\nabcabc\n") == "YES\nYES", "multiple repeated substrings"
assert run("1\na"*100+"\n") == "YES", "max size even repeated char"
assert run("1\na"*99+"\n") == "NO", "max size odd repeated char"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 乙、抄送、DD | 不，是，是 | 单字母边缘和双字母正确性 |
 | abcdabcd、abcabc | 是的，是的 | 多字符重复 |
 | 'a'*100 | 'a'*100 | 是 | 最大大小偶数重复字符 |
 | 'a'*99 | 'a'*99 | 否 | 最大奇数重复字符 |

 ## 边缘情况

 对于像“a”这样长度为 1 的字符串，算法检测到奇数长度并输出“NO”。 对于像“aa”这样长度为2的字符串，它分为“a”和“a”，发现它们相等，并输出“YES”。 对于像“xxyy”这样的字符串，它会分成“xx”和“yy”，检测不等式，并输出“NO”。 该算法可以正确处理所有最小、最大和非均匀重复。
