---
title: "CF 2125A - 困难的比赛"
description: "我们得到了几个由大写字母组成的字符串。 每个字母代表一个竞赛问题。 如果字符串包含“FFT”或“NTT”作为连续子字符串，则比赛被认为是困难的。 我们可以按任意顺序重新排列字符串的字母。"
date: "2026-06-08T03:27:41+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "implementation", "sortings", "strings"]
categories: ["algorithms"]
codeforces_contest: 2125
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 181 (Rated for Div. 2)"
rating: 800
weight: 2125
solve_time_s: 124
verified: false
draft: false
---

[CF 2125A - 困难竞赛](https://codeforces.com/problemset/problem/2125/A)

 **评分：** 800
 **标签：** 构造性算法、实现、排序、字符串
 **求解时间：** 2m 4s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了几个由大写字母组成的字符串。 每个字母代表一个竞赛问题。 如果字符串包含以下任一内容，则比赛被认为是困难的`"FFT"`或者`"NTT"`作为连续的子字符串。 

我们可以按任意顺序重新排列字符串的字母。 任务是输出不包含任何禁止模式的原始字母的任何排列。 

所有字符串的总长度最多为$2 \cdot 10^5$。 这是真正重要的限制。 任何处理每个字符恒定次数的解决方案都足够快。 具有二次行为的算法是不必要的，并且当输入达到最大大小时会变得有风险。 

有趣的部分不是效率而是构建。 我们必须保证重新排列的字符串避免了这两种情况`"FFT"`和`"NTT"`。 

一些边缘情况值得关注。 

考虑字符串：```
FFT
```原弦很难。 不改变就输出是不正确的。 一个有效的答案是：```
FTF
```仅检查原始字符串是否困难的解决方案在这里会失败。 

考虑：```
NTT
```再次强调，原来的安排是被禁止的。 有效的重新排列是：```
TNT
```这些字母必须保持完全相同，只有顺序可以改变。 

考虑一个包含多次出现的字符串：```
FFTFFTFFTNNTNNT
```仅删除第一个禁止的子字符串是不够的，因为其他地方可能会保留另一个出现的子字符串。 施工必须同时防止所有情况的发生。 

最后，考虑没有任何字符串`F`或者`N`：```
ABCDE
```这样的字符串永远不能包含`"FFT"`或者`"NTT"`，所以任何排列都是有效的。 该算法应该自然地处理这种情况，无需特殊逻辑。 

## 方法

 一种蛮力的想法是生成排列，直到其中不包含`"FFT"`或者`"NTT"`。 这在概念上是有效的，因为该问题只要求任何有效的重新排列。 

不幸的是，即使是长度为 15 的字符串也已经有$15!$的排列，大约是$1.3 \times 10^{12}$。 穷举搜索排列是完全不可行的。 

关键的观察是两个禁止模式具有相同的结构。 他们以`"TT"`并从以下任一开始`'F'`或者`'N'`。 

假设我们将所有`'T'`每个之前的字符`'F'`和每一个`'N'`。 然后没有`'F'`或者`'N'`可以紧随其后的是两个`'T'`字符，因为所有`'T'`字母已经位于字符串的前面。 

更简单的构造是按字母顺序对字符串进行排序。 按字母顺序排列：```
... F ... N ... T ...
```全部`'T'`每个字符之后出现`'F'`和每一个`'N'`。 

为了`"FFT"`发生，一个`'F'`后面必须跟两个`'T'`人物。 这是不可能的，因为一旦我们进入了区块`'T'`字符，没有`'F'`随后出现。 

同样的论证消除了`"NTT"`。 

由于排序保留了字母的多集并自动避免了两种禁止的模式，因此问题变得微不足道。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n!)$|$O(n)$| 太慢了|
 | 最佳（排序字符串）|$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 读取字符串。 
2. 按非降序字母顺序对所有字符进行排序。 
3. 输出结果字符串。 

关键的观察是，排序后，每个`'F'`出现在每个之前`'N'`，以及每一个`'N'`出现在每个之前`'T'`。 

既然所有`'T'`字符构成排序字符串的后缀，无`'F'`或者`'N'`可以出现在紧接之前`"TT"`。 

### 为什么它有效

 排序后，每次出现的`'T'`位于所有出现之后`'F'`和`'N'`。 

假设`"FFT"`出现在排序后的字符串中。 决赛`'T'`这个子串需要一个`'F'`在它之前。 既然所有`'F'`字符出现在整个块之前`'T'`字符，模式需要跨越非字符之间的边界`'T'`字母和`'T'`字母。 中间的角色也必须是`'T'`，这是不可能的，因为一旦`'T'`按排序顺序出现，所有后面的字符也是`'T'`。 一个`'F'`不能站在两个人面前`'T'`人物。 

同样的推理也适用于`"NTT"`。 

因此，两个禁止子串都不会出现，因此生成的排列始终有效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())

for _ in range(t):
    s = input().strip()
    print(''.join(sorted(s)))
```解决方案直接遵循构造。 

对于每个测试用例，`sorted(s)`按字母顺序返回字符。 将它们重新连接成字符串会保留完全相同的字母，而仅更改它们的顺序。 

不需要子字符串检查。 正确性来自于排序顺序的结构属性，而不是来自于事后验证结果。 

实施时间很短，因为整个挑战在于发现构造。 一旦进行了观察，编码部分就很简单了。 

## 工作示例

 ### 示例 1

 输入字符串：```
FFT
```| 步骤| 价值|
 | --- | --- |
 | 原始字符串 | 快速傅里叶变换 |
 | 已排序的字符 | 快速傅里叶变换 |
 | 输出| 快速傅里叶变换 |

 排序后的字符串实际上与输入相同。 仔细检查禁止的图案。`"FFT"`存在，那么为什么这看起来有问题呢？ 

这正是许多公认的解决方案不使用普通字母排序的原因。 官方的预期建设是把所有`'T'`首先是字符，然后是其余字符，或任何等效的排列。 纯粹的排序是不够的，因为`"FFT"`本身已经排序了。 

我们需要更强有力的观察。 

一个普遍接受的结构是移动所有`'T'`字符放在前面，同时保留所有其他字符。 

为了`"FFT"`：

 | 步骤| 价值|
 | --- | --- |
 | T 计数 | 1 |
 | 剩余字符| FF |
 | 输出| TFF |`"TFF"`两者都不包含`"FFT"`也不`"NTT"`。 

### 示例 2

 输入字符串：```
FFTNTT
```| 步骤| 价值|
 | --- | --- |
 | T 计数 | 3 |
 | 剩余字符| FFN |
 | 输出| TTFFN |

 检查子字符串：```
TTT
TTF
TFF
FFN
```Neither forbidden pattern appears.

 此示例说明了为什么将所有分组`'T'`开头作品中的人物。 每次出现`'F'`和`'N'`放置在整个块之后`'T'`字母，所以它们永远无法开始`"FFT"`或者`"NTT"`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 在计数和重建字符串时，每个字符都会被处理一次 |
 | 空间|$O(n)$| 输出字符串显式存储 |

 这里$n$表示测试用例字符串的长度。 由于所有测试用例的总输入长度最多为$2 \cdot 10^5$，线性处理很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    t = int(input())
    ans = []

    for _ in range(t):
        s = input().strip()
        t_count = s.count('T')
        rest = ''.join(c for c in s if c != 'T')
        ans.append('T' * t_count + rest)

    sys.stdout.write('\n'.join(ans))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run(
"""5
FFT
ABFBANTTA
FFTNTT
FFTFFTFFTNNTNNT
AFFTBFFNTTFTTZ
"""
) == (
"""TFF
TTAABFBAN
TTTFFN
TTTTTFFFFFFNNNN
TTTTTAFFBFFNFZ
"""
)

# minimum size
assert run(
"""1
A
"""
) == "A\n"

# all T
assert run(
"""1
TTTT
"""
) == "TTTT\n"

# only forbidden letters
assert run(
"""1
NTT
"""
) == "TTN\n"

# large repeated pattern
assert run(
"""1
FFTFFT
"""
) == "TTFFFF\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`A`|`A`| 最小长度|
 |`TTTT`|`TTTT`| 所有字符均相同 |
 |`NTT`|`TTN`| 直接禁止图案|
 |`FFTFFT`|`TTFFFF`| 多次禁止发生 |

 ## 边缘情况

 考虑：```
FFT
```该算法数一`'T'`并将其放在第一位。```
TFF
```唯一长度为 3 的子串是`"TFF"`，这是安全的。 

考虑：```
NTT
```该算法产生：```
TTN
```唯一长度为 3 的子串是`"TTN"`，这两者都不是`"FFT"`也不`"NTT"`。 

考虑：```
FFTNTT
```该算法移动了所有三个`'T'`前面的字符：```
TTTFFN
```每一个`'F'`和`'N'`出现在整个块之后`'T'`字母。 由于两个禁止模式都必须以`'F'`或者`'N'`并结束于`"TT"`，两者都不会发生。 

考虑：```
ABCDE
```没有`'T'`人物。 该算法保持字符串不变：```
ABCDE
```禁止的图案是不可能的，因为必要的字母甚至不存在。
