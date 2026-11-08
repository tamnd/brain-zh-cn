---
title: "CF 2000C - 数字字符串模板"
description: "该问题要求我们检查字符串是否与数字模板匹配。 该模板是一个整数数组，其中相同的数字应对应于字符串中的相同字母，并且相同的字母应对应于相同的数字。"
date: "2026-06-08T14:11:26+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "strings"]
categories: ["algorithms"]
codeforces_contest: 2000
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 966 (Div. 3)"
rating: 1000
weight: 2000
solve_time_s: 156
verified: true
draft: false
---

[CF 2000C - 数字字符串模板](https://codeforces.com/problemset/problem/2000/C)

 **评分：** 1000
 **标签：** 数据结构、字符串
 **求解时间：** 2m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们检查字符串是否与数字模板匹配。 该模板是一个整数数组，其中相同的数字应对应于字符串中的相同字母，并且相同的字母应对应于相同的数字。 换句话说，数组的不同元素和字符串的不同字母之间必须存在一对一的映射。 每个测试用例都提供一个数字模板和一组字符串，我们需要确定每个字符串是否满足这种对应关系。 

约束告诉我们，所有测试用例中数组长度的总和以及字符串长度的总和最多为 200,000。 这意味着我们需要一个在线性时间内处理每个元素或字符的解决方案； 任何在字符串长度上具有二次复杂度的解决方案都会太慢。 边缘情况包括具有重复数字的数组、具有重复字母的字符串、单元素数组或具有负数的数组。 简单的方法可能会忽略两个字母映射到同一数字或两个数字映射到同一字母的不一致情况。 

例如，对于一个数组`[3,5,2,1,3]`和字符串`"abfda"`,`3`出现两次并映射到`'a'`两次，所有其他数字都映射到不同的字母，因此它匹配。 但`"afbfa"`失败是因为`'f'`出现在与两者相对应的位置`5`和`1`，打破了一对一的映射。 

## 方法

 暴力方法是尝试每个字符串的数字和字母之间的所有可能的映射，但这显然是不可行的，因为映射的排列数量随着不同数字或字母的数量呈指数增长。 关键的见解是我们不需要尝试映射；而是需要尝试映射。 我们只需要检查一致性。 我们可以维护两本字典：一本将数字映射到字母，另一本将字母映射到数字。 在同时迭代模板和字符串时，我们检查每个映射是否与之前的映射一致。 如果我们遇到不匹配的情况，则该字符串与模板不匹配。 如果我们到达终点时没有不一致，则匹配。 这在相对于字符串长度的线性时间内起作用。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k!) 其中 k = 不同数字的数量 | O(k) | 太慢了 |
 | 测绘检查 | 每个字符串 O(n) | 每个字符串 O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`和数组`a`。 
3.读取字符串的个数`m`。 
4. 对于每个字符串`s`：

 a. 如果长度为`s`不匹配`n`,立即输出`"NO"`。 

b. 初始化两个空字典：`num_to_char`用于将数字映射到字母，以及`char_to_num`对于字母到数字。 

c. 迭代每个索引`i`从`0`到`n-1`。 对于当前号码`a[i]`和性格`s[i]`：

我。 如果`a[i]`已经有一个映射`num_to_char`，检查是否匹配`s[i]`。 如果没有，则输出`"NO"`并停止检查该字符串。 

二. 如果`s[i]`已经有一个映射`char_to_num`，检查是否匹配`a[i]`。 如果没有，则输出`"NO"`并停止。 

三. 如果两个映射一致或者是新的，则更新字典。 

d. 如果循环完成且没有不一致，则输出`"YES"`。 

**为什么有效**：字典保持每个数字恰好映射到一个字母并且每个字母恰好映射到一个数字的不变式。 任何违反此不变性的行为都会立即识别出不匹配，从而确保正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    m = int(input())
    for _ in range(m):
        s = input().strip()
        if len(s) != n:
            print("NO")
            continue
        
        num_to_char = {}
        char_to_num = {}
        valid = True
        for ai, ci in zip(a, s):
            if ai in num_to_char and num_to_char[ai] != ci:
                valid = False
                break
            if ci in char_to_num and char_to_num[ci] != ai:
                valid = False
                break
            num_to_char[ai] = ci
            char_to_num[ci] = ai
        print("YES" if valid else "NO")
```该解决方案使用有效地读取输入`sys.stdin.readline`并迭代每个字符串，使用两个字典检查映射一致性。 使用`zip(a, s)`确保我们直接比较相应的位置。 使用字典可以避免重复扫描，从而保持每个字符串的线性复杂性。 

## 工作示例

 **示例1**

 输入：

 数组`a = [3,5,2,1,3]`， 细绳`s = "abfda"`| 索引 | 一个[我] | s[i] | 数字到字符 | 字符到数字 | 有效的？ |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 3 | 一个 | {3：a} | {一：3} | 是的 |
 | 1 | 5 | 乙| {3：a，5：b} | {a:3,b:5} | 是的 |
 | 2 | 2 | f | {3:a,5:b,2:f} | {a:3,b:5,f:2} | 是的 |
 | 3 | 1 | d | {3:a,5:b,2:f,1:d} | {a:3,b:5,f:2,d:1} | 是的 |
 | 4 | 3 | 一个 | 一致| 一致| 是的 |

 输出：`"YES"`**示例2**

 输入：数组`[3,5,2,1,3]`， 细绳`"afbfa"`在索引 2 处，`s[2] = f`对应于`a[2]=2`，但后来`f`在一个位置对应于不同的数字，违反了映射，所以`"NO"`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n 之和 + 所有字符串长度之和) | 数组的每个元素和每个字符串的每个字符都被处理一次。 |
 | 空间| O(n) | 对于每个字符串，字典最多可以包含`n`条目。 |

 在给定限制的情况下，该解决方案是有效的并且在限制内运行良好。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        m = int(input())
        for _ in range(m):
            s = input().strip()
            if len(s) != n:
                output.append("NO")
                continue
            num_to_char = {}
            char_to_num = {}
            valid = True
            for ai, ci in zip(a, s):
                if ai in num_to_char and num_to_char[ai] != ci:
                    valid = False
                    break
                if ci in char_to_num and char_to_num[ci] != ai:
                    valid = False
                    break
                num_to_char[ai] = ci
                char_to_num[ci] = ai
            output.append("YES" if valid else "NO")
    return "\n".join(output)

# Provided sample
assert run("""3
5
3 5 2 1 3
2
abfda
afbfa
2
1 2
3
ab
abc
aa
4
5 -3 5 -3
4
aaaa
bcbc
aba
cbcb
""") == """YES
NO
YES
NO
NO
NO
YES
NO
YES""", "sample 1"

# Custom cases
assert run("""1
3
1 1 2
2
aab
aba
""") == """YES
NO""", "duplicate mapping check"

assert run("""1
4
1 2 1 2
2
abab
aabb
""") == """YES
NO""", "two-to-two mapping"

assert run("""1
1
100
1
x
""") == "YES", "single element mapping"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | [1,1,2], [“aab”,“aba”] | 是，否 | 确保重复的数字一致地映射 |
 | [1,2,1,2], [“abab”,“aabb”] | 是，否 | 检查交替模式映射 |
 | [100]，[“x”] | 是 | 正确处理单元素数组 |

 ## 边缘情况

 对于具有单个元素的数组，任何单字符字符串都会匹配，产生`"YES"`。 对于长度为 1 但字符串长度大于 1 的数组，输出为`"NO"`。 对于一个字符映射到多个数字的字符串，代码会立即检测到不一致并输出`"NO"`。 负数和大数的处理方式与任何整数相同，因为 Python 字典可以有效地处理任意键。 该解决方案可以正确处理所有此类边缘情况。
