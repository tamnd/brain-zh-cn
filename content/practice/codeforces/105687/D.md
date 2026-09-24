---
title: "CF 105687D - 媒人"
description: "我们得到一个小写字符串和许多子字符串查询。 对于每个查询区间 $[l, r]$，我们只查看该子字符串。 两个相等的字母可以组成一个匹配项，并且每个字符最多可以属于一个匹配项。"
date: "2026-06-25T06:12:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105687
codeforces_index: "D"
codeforces_contest_name: "AlgoChief Sprint Round 2"
rating: 0
weight: 105687
solve_time_s: 50
verified: true
draft: false
---

[CF 105687D - 媒人](https://codeforces.com/problemset/problem/105687/D)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个小写字符串和许多子字符串查询。 对于每个查询间隔$[l, r]$，我们只查看该子字符串。 

两个相等的字母可以组成一个匹配项，并且每个字符最多可以属于一个匹配项。 目标是在所选子字符串内实现尽可能多的匹配。 在创建匹配之前，我们可以更改字符，用我们想要的任何小写字母替换任何位置。 

对于每个查询，我们必须找到所需的最少字符更改次数，以便子字符串能够达到最大可能的匹配次数。 

如果子串有长度$m$，不相交对的最大可能数量是$\lfloor m/2 \rfloor$。 任何有效的最终排列必须最多留下一个未配对的字符。 

输入尺寸很大。 在所有测试用例中，总价值$n + q$至多是$2 \cdot 10^5$。 扫描每个查询子字符串的每个字符的解决方案需要$O(nq)$在最坏的情况下工作，速度太慢了。 我们需要一些接近的东西$O(1)$或者$O(\text{alphabet size})$per query.

 有几种情况很容易处理不当。 

考虑：```
substring = "abcdef"
```Every frequency is 1. The length is 6, so we need 3 pairs. 我们必须执行 3 项更改，例如：```
abcdef -> aabbcc
```诸如“更改字符直到所有字母变得相等”之类的贪婪想法将使用比必要的更多的操作。 

考虑：```
substring = "aaabbb"
```频率是$3$和$3$。 我们已经有两对：```
aaa -> one pair + one leftover
bbb -> one pair + one leftover
```只少了一对，所以答案是 1。 

考虑：```
substring = "abcde"
```长度是奇数。 允许一个字符保持不匹配。 答案是 2，而不是 3：```
abcde -> aabcd
```这是许多实现尝试将每个字符配对而犯错误的地方。 

## 方法

 暴力视图是检查查询的子字符串，计算频率，并以某种方式搜索达到完全可配对配置所需的最小编辑次数。 这很快就变得不切实际，因为可能有多达$10^5$每个测试用例的查询。 即使从头开始为每个查询重新计算频率也会花费$O(nq)$最坏情况下的操作。 

关键的观察来自于对奇偶性的观察。 

假设出现一个字母$c$次。 它贡献$\lfloor c/2 \rfloor$现有对。 对所有字母求和即可得出已存在的对的数量。 

设子串长度为$m$，并让`odd`是出现频率为奇数的字母的数量。 

使用$$\sum \left\lfloor \frac{c_i}{2} \right\rfloor
=
\frac{m - \text{odd}}{2},$$当前的对数完全由奇数频率的数量决定。 

最大可能的对数是$\lfloor m/2 \rfloor$。 缺失的对数是$$\left\lfloor \frac{m}{2} \right\rfloor
-
\frac{m-\text{odd}}{2}.$$计算该表达式得出：

 对于甚至$m$:$$\frac{\text{odd}}{2}$$对于奇数$m$:$$\frac{\text{odd}-1}{2}$$两种情况都准确无误$$\left\lfloor \frac{\text{odd}}{2} \right\rfloor.$$现在考虑一个角色的改变。 我们可以从一个奇数频率字母中取出剩余的字符，并将其转换为另一个奇数频率字母，消除两个奇数计数并创建一对额外的字符。 因此，每增加一对就需要换一次零钱。 

该问题简化为查找每个查询子串中奇数频率的数量。 

由于字母表仅包含 26 个小写字母，因此我们可以构建前缀频率数组。 然后每个查询重建 26 个频率$O(26)$时间并计算有多少个奇数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n)$每个查询|$O(1)$| 太慢了|
 | 最佳 |$O(26)$每个查询|$O(26n)$| 已接受 |

 ## 算法演练

 1. 构建所有 26 个小写字母的前缀频率计数。 
2. 对于每个查询$[l, r]$，使用前缀差异计算子字符串内每个字母的频率。 
3. 计算这 26 个频率中有多少个是奇数。 调用这个值`odd`。 
4. 输出`odd // 2`。 

步骤 4 起作用的原因是每次更改都可以将两个奇数频率组合并为一对附加频率组。 如果有`odd`奇数计数，我们必须消除所有计数，最多删除其中一个。 所需消除的次数正好是`odd // 2`。 

### 为什么它有效

 不变量是具有偶奇偶校验的频率不会贡献任何不匹配的字符，而具有奇奇偶校验的频率恰好贡献一个不匹配的字符。 

一个子串与`odd`奇数频率字母恰好有`odd`不匹配的字符。 为了实现最大可能的匹配，最多可以保留一个不匹配的字符。 每次编辑都可以将不匹配的字符数减少两个，因为它将一个字符从一个奇数组移动到另一个奇数组。 因此，所需的最小编辑次数恰好是`odd // 2`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n, q = map(int, input().split())
        s = input().strip()

        pref = [[0] * (n + 1) for _ in range(26)]

        for i, ch in enumerate(s, 1):
            idx = ord(ch) - ord('a')

            for c in range(26):
                pref[c][i] = pref[c][i - 1]

            pref[idx][i] += 1

        ans = []

        for _ in range(q):
            l, r = map(int, input().split())

            odd = 0

            for c in range(26):
                freq = pref[c][r] - pref[c][l - 1]
                odd += freq & 1

            ans.append(str(odd // 2))

        sys.stdout.write("\n".join(ans) + "\n")

solve()
```前缀数组存储每个字母的累积计数。 一个字母在查询区间内出现的频率是通过减去两个前缀值得到的。 

对于每个查询，我们从不检查子字符串本身。 我们只检查 26 个字母的计数。 答案完全取决于这些计数中有多少是奇数。 

最常见的实现错误是忘记查询是 1 索引的。 使用`pref[c][r] - pref[c][l - 1]`避免了相差一的错误。 

另一个微妙之处是答案不是基于子串长度。 一旦频率已知，只有奇偶校验模式很重要。 如果两个长度完全不同的子串具有相同数量的奇数频率字母，则它们可以产生相同的答案。 

## 工作示例

 ### 示例 1

 输入：```
6 1
abcdef
1 6
```查询中的频率：

 | 信| 频率| 奇怪的？ |
 | --- | --- | --- |
 | 一个 | 1 | 是的 |
 | 乙| 1 | 是的 |
 | c | 1 | 是的 |
 | d | 1 | 是的 |
 | 电子| 1 | 是的 |
 | f | 1 | 是的 |`odd = 6`| 奇数| 答案|
 | --- | --- |
 | 6 | 3 |

 输出：```
3
```这演示了每个字符都无法匹配的极端情况。 三次编辑创建三对。 

### 示例 2

 输入：```
6 1
aaabbb
1 6
```频率：

 | 信| 频率| 奇怪的？ |
 | --- | --- | --- |
 | 一个 | 3 | 是的 |
 | 乙| 3 | 是的 |`odd = 2`| 奇数| 答案|
 | --- | --- |
 | 2 | 1 |

 输出：```
1
```这个例子表明只有奇偶校验才重要。 尽管已经有很多重复的字母，但仍然存在两个奇怪的组，需要进行一次编辑。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(26q + 26n)$| 构建前缀并检查每个查询的 26 个字母 |
 | 空间|$O(26n)$| 每个字母的前缀计数 |

 由于字母表大小固定为 26，因此运行时间与总输入大小实际上呈线性关系。 和$\sum(n+q) \le 2 \cdot 10^5$，这完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    out = []

    t = int(input())

    for _ in range(t):
        n, q = map(int, input().split())
        s = input().strip()

        pref = [[0] * (n + 1) for _ in range(26)]

        for i, ch in enumerate(s, 1):
            idx = ord(ch) - ord('a')

            for c in range(26):
                pref[c][i] = pref[c][i - 1]

            pref[idx][i] += 1

        for _ in range(q):
            l, r = map(int, input().split())

            odd = 0
            for c in range(26):
                freq = pref[c][r] - pref[c][l - 1]
                odd += freq & 1

            out.append(str(odd // 2))

    return "\n".join(out)

# provided sample
assert run(
"""2
6 4
abcdef
1 6
2 2
3 6
1 4
6 3
aaabbb
1 3
4 6
1 6
"""
) == "\n".join(["3", "0", "2", "2", "0", "0", "1"])

# minimum size
assert run(
"""1
1 1
a
1 1
"""
) == "0"

# all equal
assert run(
"""1
5 1
aaaaa
1 5
"""
) == "0"

# all distinct odd length
assert run(
"""1
5 1
abcde
1 5
"""
) == "2"

# off-by-one boundary query
assert run(
"""1
4 2
abca
1 1
1 4
"""
) == "\n".join(["0", "1"])
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`0`| 最小尺寸 |
 |`aaaaa`|`0`| 已经最优 |
 |`abcde`|`2`| 奇数长度子串 |
 |`abca`与边界查询|`0`,`1`| 前缀索引正确性 |

 ## 边缘情况

 考虑：```
1
1 1
a
1 1
```频率数组包含一个奇数计数。 该算法计算：```
odd = 1
answer = 1 // 2 = 0
```单个字符不能形成一对，但它已经是最佳的，因为允许有一个不匹配的字符。 

考虑：```
1
1
abcdef
1 6
```所有六个频率都是奇数。```
odd = 6
answer = 6 // 2 = 3
```该算法正确地确定需要进行三次编辑才能创建三对。 

考虑：```
1
1
abcde
1 5
```有五个奇数频率。```
odd = 5
answer = 5 // 2 = 2
```因为长度是奇数，所以可能保留一个奇数频率。 该公式会自动处理此问题，无需任何特殊情况。 

考虑：```
1
1
aaabbb
1 6
```频率是$3$和$3$。```
odd = 2
answer = 1
```将一个剩余字符从一组更改为另一组会创建最终的缺失对，从而匹配最佳结果。
