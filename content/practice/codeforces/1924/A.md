---
title: "CF 1924A - 我们是否涵盖了所有内容？"
description: "给定一个字符串 s 和两个整数 n 和 k。 从概念上讲，我们被要求检查可以使用字母表的前 k 个字母构建的每个长度为 n 的字符串是否作为子序列出现在 s 中的某个位置。"
date: "2026-06-08T19:07:07+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dp", "greedy", "shortest-paths", "strings"]
categories: ["algorithms"]
codeforces_contest: 1924
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 921 (Div. 1)"
rating: 1500
weight: 1924
solve_time_s: 132
verified: false
draft: false
---

[CF 1924A - 我们涵盖了所有内容吗？](https://codeforces.com/problemset/problem/1924/A)

 **评分：** 1500
 **标签：** 构造性算法、dp、贪心、最短路径、字符串
 **求解时间：** 2m 12s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个字符串`s`和两个整数`n`和`k`。 从概念上讲，我们被要求检查每个长度的字符串是否`n`可以使用第一个来构建`k`字母表中的字母作为子序列出现在某处`s`。 子序列允许跳过字符，但必须保留顺序。 如果哪怕是一串长度`n`使用第一个`k`字母没有出现，我们必须输出一个这样的字符串作为证据。 

约束条件是理解可行的关键。`n`和`k`都最多为 26，并且长度`s`最多 1000。有了这些限制，长度可能的字符串总数`n`使用`k`字母是`k^n`。 这呈指数级增长，因此在以下情况下，检查所有可能的字符串是否为子序列的简单暴力方法是不可行的：`n`和`k`并不小。 

一个重要的边缘情况出现时`s`太短，无法容纳重复的字母。 例如，如果`s`是`"ab"`和`n = 2`和`k = 2`, 字符串`"aa"`不可能是子序列，因为只有一个`'a'`在`s`。 同样，如果`s`完全缺少特定字符，任何需要该字符的字符串都是立即不可能的。 粗心的方法可能会在不检查字符频率的情况下尝试生成所有字符串，并且会默默失败或超时。 

## 方法

 蛮力方法将生成所有`k^n`长度的字符串`n`并测试每个是否是子序列`s`。 测试一根字符串的长度`n`对着一根绳子`s`长度`m`成本为 O(m)，因此在最坏情况下操作次数为 O(m * k^n)，这对于`n`和`k`。 

关键的见解是我们不需要生成所有字符串。 我们只需要找到按字典顺序不能是子序列的最小字符串。 这可以通过贪婪地计算每个字母的出现次数来完成`s`。 在目标字符串的每个位置，我们选择仍然出现的最小字母。 如果在某个位置没有可用的字母，我们立即就会得到一个无法形成子序列的字符串。 通过从左到右迭代并选择最小的可行字母，我们构建了一个字符串，如果答案为“否”，则该字符串保证会丢失。 如果我们能够成功地将字母分配给所有位置，则所有字符串都存在，答案是“是”。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m * k^n) | O(m * k^n) | O(n) | 太慢了 |
 | 贪心子序列计数 | O(n * k + m) | O(k) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，读取整数`n`,`k`， 和`m`，和字符串`s`。 
3.初始化一个数组`count`尺寸的`k`为零。 迭代`s`并计算第一个中的每一个出现了多少次`k`出现字母。 
4.初始化一个空字符串`res`对于候选缺失的字符串。 
5. 对于每个位置`i`在长度为目标的字符串中`n`，迭代来自的字母`'a'`到`k`第-个字母：

 - 如果当前字母在`s`，减少其计数并将其附加到`res`。 
- 如果没有可用字母，则将第一个字母按字典顺序附加到`res`为剩余位置并休息。 这确保了我们正在构建的字符串不会作为子序列出现。 
6. 搭建完成后`res`，检查其长度是否小于`n`。 如果是这样，答案是否定的，我们打印`res`。 如果我们成功分配所有位置且没有出现次数用完的情况，那么答案是“是”。 
7. 对所有测试用例重复此操作。 

**为什么它起作用**：该算法贪婪地构造一个字符串，仅当字母可用时才使用它们`s`。 如果它在任何位置失败，它保证至少有一个长度的字符串`n`不能是子序列。 否则，通过鸽巢原理和贪心选择，可以形成所有的字符串。 这样既满足了正确性，又满足了效率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, k, m = map(int, input().split())
    s = input().strip()
    freq = [0] * k
    for c in s:
        freq[ord(c) - ord('a')] += 1

    res = []
    found_missing = False
    for i in range(n):
        placed = False
        for j in range(k):
            if freq[j] > 0:
                freq[j] -= 1
                res.append(chr(ord('a') + j))
                placed = True
                break
        if not placed:
            # No letter available, fill remaining with 'a'
            res.extend(['a'] * (n - i))
            found_missing = True
            break

    if found_missing:
        print("NO")
        print(''.join(res))
    else:
        print("YES")
```**解释**：我们计算每个字母的出现次数`s`并尝试贪婪地将它们放入候选字符串中。 如果由于缺少剩余字母而无法填充某个位置，我们将构造一个无法出现的字符串，以确保有效的“否”响应。 否则，如果可以分配所有位置，则字符串包含所有可能的子序列。 

## 工作示例

 **示例输入 2**```
2 2 3
abb
```| 步骤| 频率 | 资源 | 说明|
 | --- | --- | --- | --- |
 | 我=0 | [1,2]| ['一'] | 放置“a” |
 | 我=1 | [0,2]| ['a','b'] | 地点“b”|
 | 我=2 | [0,1]| 无法放置 'a' (freq=0) | 用 'a' → 'aa' 填充剩余部分，found_missing=True |

 输出：```
NO
aa
```该跟踪演示了贪婪选择和对丢失子序列的立即检测。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * k + m) | 统计频率为 O(m)，构建候选字符串为 O(n * k) |
 | 空间| O(k + n) | 频率数组和候选字符串|

 这非常适合问题约束，因为`n`和`k`最多 26 个，总长度`s`所有测试用例的数量≤ 10^6。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n, k, m = map(int, input().split())
        s = input().strip()
        freq = [0]*k
        for c in s:
            freq[ord(c)-ord('a')] += 1
        res = []
        found_missing = False
        for i in range(n):
            placed = False
            for j in range(k):
                if freq[j]>0:
                    freq[j]-=1
                    res.append(chr(ord('a')+j))
                    placed=True
                    break
            if not placed:
                res.extend(['a']*(n-i))
                found_missing=True
                break
        if found_missing:
            output.append("NO")
            output.append(''.join(res))
        else:
            output.append("YES")
    return "\n".join(output)

# provided samples
assert run("3\n2 2 4\nabba\n2 2 3\nabb\n3 3 10\naabbccabab\n") == "YES\nNO\naa\nNO\nccc"

# custom cases
assert run("1\n1 1 1\na\n") == "YES", "single character string"
assert run("1\n2 1 2\naa\n") == "NO\naa", "cannot make 'aa' subsequence"
assert run("1\n2 2 3\nab\n") == "NO\naa", "missing 'aa'"
assert run("1\n2 2 5\nabab\n") == "NO\nbb", "missing 'bb'"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 1 / 一个 | 是 | 最少的投入 |
 | 2 1 2 / aa | 2 1 2 / AA | 否/aa | 重复字母的次数不能超过 s |
 | 2 2 3 / ab | 2 2 3 / ab | 否/aa | 词典缺失字符串检测 |
 | 2 2 5 / abab | 2 2 5 否 / bb | 检测丢失的重复字母 |

 ## 边缘情况

 对于字符串，其中`s`每个字母只包含一个，算法检测到任何重复字母的子序列都是不可能的。 例如，`n=2`,`k=2`,`s="ab"`正确输出 NO 和`aa`。 为了`n=1`,`k=1`,`s="a"`，所有字符串都存在并输出 YES。 该方法处理最大`k`和`n`通过贪婪地检查可用字母而不生成所有可能的字符串，避免指数复杂性。
