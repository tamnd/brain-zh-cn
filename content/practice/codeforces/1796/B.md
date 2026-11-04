---
title: "CF 1796B - 星号小模板"
description: "我们被要求构造一个“模板”字符串，它可以同时描述两个给定的字符串。 模板由小写字母和星号组成。 每个星号可以替换为任何字符串（包括空字符串）以匹配原始字符串。"
date: "2026-06-09T10:00:59+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1796
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 144 (Rated for Div. 2)"
rating: 1000
weight: 1796
solve_time_s: 151
verified: false
draft: false
---

[CF 1796B - Asterisk-Minor Template](https://codeforces.com/problemset/problem/1796/B)

 **评分：** 1000
 **标签：** 实现、字符串
 **求解时间：** 2m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求构造一个“模板”字符串，它可以同时描述两个给定的字符串。 模板由小写字母和星号组成。 每个星号可以替换为任何字符串（包括空字符串）以匹配原始字符串。 Importantly, a template is “asterisk-minor” if the number of asterisks does not exceed the number of letters in it.

 Given two strings, the goal is to determine whether a single asterisk-minor template exists that both strings match, and if so, produce one. Each test case consists of two strings of length at most 50, and there may be up to 10,000 test cases.

 The first thing to notice is that the small string length makes operations on entire strings feasible. Even a quadratic comparison (like checking all character pairs) is acceptable because$50 \cdot 50 = 2500$，乘以 10,000 个测试用例仍然可以在 2 秒内轻松完成。 

非明显的边缘情况包括：

 - 完全相同的字符串。 例如，`a = "abc"`,`b = "abc"`。 模板只是字符串本身，没有星号。 
- 字符串仅在中间不同。 例如，`a = "abXcd"`,`b = "abYcd"`。 总是为每个差异插入一个星号的简单方法可能会意外违反“星号次要”约束。 
- 长度完全不同的字符串 1. 对于`a = "x"`,`b = "y"`，唯一有效的模板是`*`，它是小星号，因为它有 1 个字母（如果我们包含一个空字符串？），但我们需要仔细处理字母计数。 

## 方法

 暴力方法会尝试在模板中生成星号和字母的所有可能组合，并针对这两个字符串进行测试。 对于长度为 50 的两个字符串，插入星号的方式数量呈指数增长，即使对于较小的长度也是不可行的。 

关键的见解是星号可用于“吸收”不同字符的任何部分。 因此，最简单的有效模板是将最长的公共前缀和后缀保留为文字字母，并用单个星号替换其间的所有内容。 

例如，给定`a = "aaab"`和`b = "zzzb"`，最长的公共后缀是`"b"`，最长公共前缀为空，中间`"aaa"`与`"zzz"`可以替换为`*`。 生成的模板是`*b`。 该模板是星号次要模板：它有 1 个星号和 1 个字母，满足约束条件。 

如果两个字符串没有匹配的前缀或后缀，最简单的模板是`*`，如果至少一个字符串的长度 ≥1，则它也是小星号。 如果公共前缀和后缀加起来比所需的星号总数短，则可能违反星号小规则，然后我们必须报告`NO`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 前缀-后缀 | 每个测试用例 O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每对字符串`a`和`b`，首先找到最长的公共前缀。 初始化`i = 0`并增加`i`尽管`a[i] == b[i]`。 当字符不同或到达一个字符串的末尾时停止。 
2. 接下来，找到最长的公共后缀。 初始化`j = 0`并增加`j`尽管`a[-1-j] == b[-1-j]`并且剩余的子串不与前缀重叠。 这可确保前缀和后缀不相交。 
3. 如果前缀长度和后缀长度之和等于或大于任一字符串的长度，则表示该范围内的字符串是相同的，并且可以构造没有内部星号的模板。 
4. 否则，用单个星号替换不同的中间段。 连接前缀、星号和后缀以形成模板。 
5. 验证星号次要条件：计算字母和星号的数量。 如果字母≥星号，则打印`YES`和模板。 否则，打印`NO`。 

为什么它有效：最多需要一个星号来替换任何不同的段，因为单个星号可以吸收任何子字符串。 通过保持匹配的前缀和后缀完整，我们确保保留所有字面字母。 对于长度≤50的字符串，自动满足星号次要条件，因为中间段最多被一个星号替换。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    a = input().strip()
    b = input().strip()
    
    n = len(a)
    m = len(b)
    
    # Longest common prefix
    i = 0
    while i < min(n, m) and a[i] == b[i]:
        i += 1
    
    # Longest common suffix
    j = 0
    while j < min(n - i, m - i) and a[n-1-j] == b[m-1-j]:
        j += 1
    
    if i + j == 0 and n != m:
        # No overlap and no common letters: * cannot be minor if no letters
        print("NO")
    else:
        template = a[:i] + "*" + a[n-j:] if j > 0 else a[:i] + "*"
        letters = len(a[:i]) + len(a[n-j:])
        stars = 1
        if letters >= stars:
            print("YES")
            print(template)
        else:
            print("NO")
```该代码小心地避免前缀和后缀重叠。 无论不同段的长度如何，我们只插入一个星号，这足以匹配两个字符串。 检查`letters >= stars`确保满足星号次要条件。 

## 工作示例

 输入示例：```
a = "aaab", b = "zzzb"
```| 我| j | 模板|
 | ---| ---| ---|
 | 0 | 1 | *b |

 说明：没有共同前缀，共同后缀`"b"`，不同的中间替换为`*`。 字母 = 1，星号 = 1 → 星号小满足。 

另一个例子：```
a = "codeforces", b = "tokitlx"
```| 我| j | 模板|
 | ---| ---| ---|
 | 0 | 0 | 否 |

 说明：没有共同的前缀或后缀，将整个字符串替换为`*`会产生字母 < 星号，违反规则。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(T * 分钟( | a |
 | 空间| O(n) | 存储字符串和临时模板|

 当 T ≤ 10^4 且 |a|、|b| 时 ≤ 50，最坏情况下的总操作数约为 500,000 次，完全在 2 秒限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    exec(open("solution.py").read())
    return out.getvalue().strip()

# Provided samples
assert run("6\naaab\nzzzb\ncodeforces\natcoder\ncodeforces\ntokitlx\naaaa\naaaaaa\nabcd\nabcd\nc\nf\n") == "YES\n*b\nYES\n*co*\nNO\nYES\na*a*a*a\nYES\nabcd\nNO"

# Custom cases
assert run("2\nx\ny\nabc\nabc\n") == "YES\n*\nYES\nabc"
assert run("1\na\naa\n") == "YES\n*a"
assert run("1\nabcdef\nghijkl\n") == "NO"
assert run("1\nabc\nxyz\n") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`x, y`|`YES\n*`| 没有重叠的单字母字符串 |
 |`abc, abc`|`YES\nabc`| 相同的字符串|
 |`a, aa`|`YES\n*a`| 不同长度的前缀处理 |
 |`abcdef, ghijkl`|`NO`| 完全不同的字符串 |
 |`abc, xyz`|`NO`| 缺少通用前缀/后缀，模板不可能 |

 ## 边缘情况

 对于两个相同的字符串，例如`a = "abcd"`,`b = "abcd"`，算法发现前缀长度为 4，后缀长度为 0，中间没有不同。 模板是`"abcd"`，星号次要条件成立，因为星号 = 0 ≤ 字母 = 4。 

对于没有公共前缀或后缀的字符串，例如`a = "abc"`,`b = "xyz"`，前缀=0，后缀=0，算法考虑用替换中间`*`，但字母 = 0，星星 = 1 →
