---
title: "CF 1758A - SSeeeeiinngg DDoouubbllee"
description: "我们得到一个字符串 s。 如果我们“双倍”字符串，每个字符都会出现两次。 例如，“abc”成为“aabbcc”中的多重字符集。 我们的任务不是输出双倍字符串本身。"
date: "2026-06-09T14:37:51+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "strings"]
categories: ["algorithms"]
codeforces_contest: 1758
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 836 (Div. 2)"
rating: 800
weight: 1758
solve_time_s: 157
verified: false
draft: false
---

[CF 1758A - SSeeeeiinngg DDoouubbllee](https://codeforces.com/problemset/problem/1758/A)

 **评分：** 800
 **标签：** 构造算法、字符串
 **求解时间：** 2m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个字符串`s`。 如果我们将字符串“加倍”，则每个字符都会出现两次。 例如，`"abc"`成为字符的多重集`"aabbcc"`。 

我们的任务不是输出双倍字符串本身。 我们可以按任何顺序重新排列这些双倍字符，只要最终字符串是回文并且使用完全相同的字符即可。 

回文从左到右和从右到左读起来都是一样的。 由于双倍字符串中的每个字符出现偶数次，因此回文排列总是可能的。 

限制非常小。 每个字符串的长度最多为 100，并且最多有 1000 个测试用例。 甚至一个$O(n^2)$解决方案在这里就可以了。 真正的挑战是找到始终有效的简单结构。 

一个容易犯的错误是过度考虑重新排列并开始计算字符频率。 例如：```
s = "abc"
```双倍字符串包含每个字母的两个副本。 基于频率的解决方案可行，但没有必要。 

另一个微妙的情况是所有字符都相同：```
s = "aaaa"
```加倍的字符串是`"aaaaaaaa"`，这已经是一个回文。 任何正确的构造仍然必须产生有效的回文。 

第三种情况是字符不规则重复：```
s = "abca"
```粗心的做法可能会直接输出双倍字符串：```
aabbccaa
```这不是回文。 我们需要一种无论原始字符串内的字符模式如何都能保证对称性的结构。 

## 方法

 暴力的观点是生成双字符串的所有重新排列并检查它们中是否有一个是回文。 

这显然是正确的，因为每一种可能的安排都会被检查。 问题是排列的数量。 如果双倍字符串的长度为 200，则重新排列的次数将是天文数字，大约为$200!$。 即使对于长度20，这也已经完全不可行了。 

关键的观察来自于直接思考回文而不是考虑重新排列。 

假设我们将原始字符串放在答案的左半部分：```
s = abc
```如果我们将原始字符串的反转放在右半部分：```
abc + cba = abccba
```结果自动是一个回文。 

为什么这完全使用所需的字符？ 每个角色都来自`s`左半区出现一次，后半区出现一次。 因此，每个原始字符总共出现两次，这正是加倍字符串的字符多重集。 

这意味着我们不需要任何频率计数、排序或特殊处理。 答案始终是：```
s + reverse(s)
```### 比较

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O((2n)!)$|$O((2n)!)$| 太慢了|
 | 最佳|$O(n)$|$O(n)$| 已接受 |

 ## 算法演练

 1.读取字符串`s`。 
2. 计算其逆运算。 
3. 连接原始字符串及其反向字符串。 
4. 输出结果字符串。 

关键的想法是上半场和下半场完全镜像。 由于后半部分与前半部分相反，因此整个字符串从两个方向读取都是相同的。 

### 为什么它有效

 设原字符串为：```
s = c1 c2 ... cn
```该算法输出：```
c1 c2 ... cn cn ... c2 c1
```对于从左边开始的每个位置，从右边开始的相应位置包含相同的字符。 因此该字符串是回文字符串。 

原始字符串的每个字符在前半部分中出现一次，在镜像后半部分中出现一次。 因此，每个字符恰好出现两次，与加倍字符串的字符多重集匹配。 输出既是回文也是双倍字符串的有效重新排列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())

for _ in range(t):
    s = input().strip()
    print(s + s[::-1])
```解决方案直接遵循构造。 

表达式`s[::-1]`创建反转的字符串。 连接`s`与其相反，立即产生回文。 

没有需要特殊处理的边界情况。 长度为 1 的字符串变成两个相同的字符，仍然是回文。 重复的字符很自然地发挥作用，因为其构造不依赖于字符的唯一性。 

该实现对于每个测试用例仅执行一次反转和一次串联，使其既简单又高效。 

## 工作示例

 ### 示例 1

 输入字符串：```
sururu
```| 步骤| 价值|
 | --- | --- |
 | 原始字符串 |`sururu`|
 | 反向|`ururus`|
 | 输出|`sururuururus`|

 检查对称性：```
sururuururus
||||||||||||
sururuururus
```从任一方向读取都会给出相同的字符串。 原著中的每个角色都恰好出现两次。 

### 示例 2

 输入字符串：```
errorgorn
```| 步骤| 价值|
 | --- | --- |
 | 原始字符串 |`errorgorn`|
 | 反向|`nrogrorre`|
 | 输出|`errorgornnrogrorre`|

 左半部分是原始字符串，右半部分是它的镜像。 这保证了回文，无需任何频率分析。 

这些例子证明了中心不变量：后半部分总是与前半部分相反。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 反转字符串和连接都需要线性时间 |
 | 空间|$O(n)$| 输出字符串和反向副本均具有线性大小 |

 这里，$n$是当前字符串的长度。 自从$n \le 100$，运行时间很小。 即使跨越 1000 个测试用例，该解决方案也能轻松满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    t = int(input())
    for _ in range(t):
        s = input().strip()
        print(s + s[::-1])

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return out

# provided sample
assert run(
"""4
a
sururu
errorgorn
anutforajaroftuna
"""
) == (
"""aa
sururuururus
errorgornnrogrorre
anutforajaroftunaanutforajaroftuna
"""
)

# minimum size
assert run(
"""1
a
"""
) == (
"""aa
"""
), "single character"

# repeated characters
assert run(
"""1
aaaa
"""
) == (
"""aaaaaaaa
"""
), "all characters equal"

# distinct characters
assert run(
"""1
abc
"""
) == (
"""abccba
"""
), "basic palindrome construction"

# boundary length pattern
assert run(
"""1
abca
"""
) == (
"""abcaacba
"""
), "repeated and distinct characters mixed"
```### 测试覆盖率摘要

 | 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`aa`| 最小长度|
 |`aaaa`|`aaaaaaaa`| 所有字符均相同 |
 |`abc`|`abccba`| 基本镜子结构|
 |`abca`|`abcaacba`| 混合重复和独特的字符 |

 ## 边缘情况

 考虑尽可能最小的输入：```
1
a
```该算法计算：```
a + a = aa
```结果是一个回文，并且包含原始字符的两个副本。 

现在考虑一个每个字符都相同的字符串：```
1
aaaa
```反面依然是`"aaaa"`，因此输出变为：```
aaaaaaaa
```每个位置都会自动匹配其镜像位置。 

最后，考虑一个混合字符串：```
1
abca
```该算法执行：

 | 步骤| 价值|
 | --- | --- |
 | 原创|`abca`|
 | 反向|`acba`|
 | 结果 |`abcaacba`|

 检查镜像位置：```
a b c a a c b a
a b c a a c b a
```每个对称对都匹配。 输出恰好包含原始字符串中每个字符的两个副本，因此它是双倍字符串的有效重新排列。
