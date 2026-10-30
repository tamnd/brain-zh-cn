---
title: "CF 1575A - 另一个排序问题"
description: "我们有一系列不同的书名，并且长度都相同。 这些书籍不按普通词典顺序排序。 当比较两个标题时，我们从左到右扫描，直到找到它们不同的第一个位置。"
date: "2026-06-10T11:01:24+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "sortings", "strings"]
categories: ["algorithms"]
codeforces_contest: 1575
codeforces_index: "A"
codeforces_contest_name: "COMPFEST 13 - Finals Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 1100
weight: 1575
solve_time_s: 767
verified: false
draft: false
---

[CF 1575A - 另一个排序问题](https://codeforces.com/problemset/problem/1575/A)

 **评分：** 1100
 **标签：** 数据结构、排序、字符串
 **求解时间：** 12m 47s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一系列不同的书名，并且长度都相同。 这些书籍不按普通词典顺序排序。 

当比较两个标题时，我们从左到右扫描，直到找到它们不同的第一个位置。 如果该位置是奇数，则较小的字母应排在前面。 如果该位置是偶数，则较大的字母应该排在前面。 

任务是按照这个自定义顺序排序后输出书籍的原始索引。 

约束条件$n \cdot m \le 10^6$是关键观察。 字符串数据总量最多为一百万个字符。 任何在自定义比较器期间重复逐字符比较字符串的解决方案都可能变得昂贵。 将每个字符串转换一次然后使用该语言的内置排序的解决方案将轻松满足该限制。 周围的复杂性$O(nm)$预处理加$O(n \log n)$排序是完全可以接受的。 

一个常见的错误是错误地比较偶数位置。 该语句使用从 1 开始的位置。 位置 2、4、6... 是下降的。 在 Python 中，字符串是从 0 开始的，因此索引 1、3、5... 对应于偶数位置。 

考虑：```
2 2
AA
AB
```在位置 2 处，我们按降序比较。 自从$B > A$, 字符串`AB`应该先来`AA`。 将位置 2 视为升序会产生错误的顺序。 

当第一个差异出现在偶数位置时，会出现另一种微妙的情况：```
2 3
ABC
AAC
```第一个差异是在位置 2 处。由于位置 2 是下降的，`ABC`出现在之前`AAC`，即使普通的字典顺序会放置`AAC`第一的。 

## 方法

 暴力方法是直接实现比较规则并使用该比较器进行排序。 每次比较最多可扫描$m$人物。 排序需要$O(n \log n)$比较、给予$O(nm \log n)$时间。 总字符数为一百万，这仍然可能比必要的重，特别是在自定义比较器昂贵的语言中。 

排序的结构提出了一个更清晰的想法。 在奇数位置，我们需要通常的字母顺序。 在偶数位置，我们需要相反的字母顺序。 

假设我们变换每个偶数位置的字符。 代替$$A \leftrightarrow Z,\quad B \leftrightarrow Y,\quad C \leftrightarrow X,\ldots$$经过此变换后，偶数位置处较大的原始字符变成较小的变换字符。 偶数位置的降序比较被转换为普通的升序比较。 

一旦每个字符串都以这种方式转换，自定义顺序就成为转换后字符串的标准字典顺序。 然后我们就可以正常排序了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力比较器|$O(nm \log n)$|$O(1)$额外 | 已接受但没有必要 |
 | 变换+普通排序|$O(nm + n\log n)$|$O(nm)$| 已接受 |

 ## 算法演练

 1. 读取所有字符串并记住它们的原始索引。 
2. 对于每个字符串，构建一个转换后的版本。 
3. 保持奇数位置的字符不变。 
4. 对于偶数位置的字符，将其替换为字母镜像：$$c \mapsto \text{'Z'} - (c-\text{'A'})$$这会将降序比较转换为升序比较。 
5. 存储该对`(transformed_string, original_index)`。 
6. 按转换后的字符串对所有对进行排序。 
7. 按排序顺序输出原始索引。 

### 为什么它有效

 取两根弦$a$和$b$。 让$k$成为他们不同的第一个位置。 

如果$k$是奇数，变换使两个字符保持不变。 它们在普通词典比较中的顺序正是问题所要求的顺序。 

如果$k$是偶数，变换用字母表中的镜像替换每个字符。 较大的原始字符变成较小的变形字符。 这样问题所要求的降序比较在变换后就变成了升序比较。 

第一个不同的位置保持不变，因此转换后的字符串完全按照普通字典顺序进行比较，而原始字符串则按照升序-降序结束顺序进行比较。 因此，对转换后的字符串进行排序可以精确地产生所需的顺序。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def transform(s):
    chars = list(s)
    for i in range(1, len(chars), 2):  # 0-based indices => even positions in statement
        chars[i] = chr(ord('Z') - (ord(chars[i]) - ord('A')))
    return ''.join(chars)

def solve():
    n, m = map(int, input().split())

    arr = []
    for idx in range(1, n + 1):
        s = input().strip()
        arr.append((transform(s), idx))

    arr.sort()

    print(*[idx for _, idx in arr])

if __name__ == "__main__":
    solve()
```预处理阶段创建每个标题的转换表示。 循环从索引处开始`1`因为Python使用基于0的索引，并且问题的偶数位置对应于索引`1, 3, 5, ...`。 

变换使用字母表镜像。 例如，`A`变成`Z`,`B`变成`Y`， 和`Z`变成`A`。 

转换后，不需要自定义比较器。 Python 的本机字符串排序已经与所需的顺序相匹配。 最终输出使用存储的原始索引。 

## 工作示例

 ### 示例 1

 输入：```
5 2
AA
AB
BB
BA
AZ
```改造：

 | 原创| 转变| 索引 |
 | --- | --- | --- |
 | AA | AZ | 1 |
 | AB | 啊| 2 |
 | BB | 由| 3 |
 | 学士 | BZ | 4 |
 | AZ | AA | 5 |

 按转换后的字符串排序：

 | 排名| 转变| 索引 |
 | --- | --- | --- |
 | 1 | AA | 5 |
 | 2 | 啊| 2 |
 | 3 | AZ | 1 |
 | 4 | 由| 3 |
 | 5 | BZ | 4 |

 输出：```
5 2 1 3 4
```这演示了位置 2 处的降序比较如何转换为普通的升序排序。 

### 示例 2

 输入：```
3 3
ABC
AAC
BAC
```改造：

 | 原创| 转变|
 | --- | --- |
 | ABC | AYC |
 | 瑞声 | AZC |
 | 北汽 | BZC |

 排序后的转换字符串：

 | 转变| 原始索引 |
 | --- | --- |
 | AYC | 1 |
 | AZC | 2 |
 | BZC | 3 |

 输出：```
1 2 3
```前两个字符串在位置 2 处不同。由于位置 2 是下降的，`B`应该先来`A`，这正是变换后的顺序所达到的效果。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(nm + n\log n)$| 将所有字符转换一次，然后排序$n$按键 |
 | 空间|$O(nm)$| 存储转换后的字符串 |

 总输入大小最多为$10^6$人物。 处理每个字符一次的成本很低。 排序$n$转换后的密钥可以轻松地在时间限制内完成。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve_io(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    n, m = map(int, input().split())

    arr = []
    for idx in range(1, n + 1):
        s = input().strip()

        chars = list(s)
        for i in range(1, len(chars), 2):
            chars[i] = chr(ord('Z') - (ord(chars[i]) - ord('A')))

        arr.append(("".join(chars), idx))

    arr.sort()
    return " ".join(str(idx) for _, idx in arr)

# provided sample
assert solve_io(
"""5 2
AA
AB
BB
BA
AZ
"""
) == "5 2 1 3 4"

# minimum size
assert solve_io(
"""1 1
A
"""
) == "1"

# first difference at even position
assert solve_io(
"""2 2
AA
AB
"""
) == "2 1"

# odd-position comparison dominates
assert solve_io(
"""3 2
BA
AZ
BZ
"""
) == "2 1 3"

# longer strings
assert solve_io(
"""3 3
ABC
AAC
BAC
"""
) == "1 2 3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单弦 |`1`| 最小输入尺寸 |
 |`AA`,`AB`|`2 1`| 降偶头寸的正确处理 |
 |`BA`,`AZ`,`BZ`|`2 1 3`| 奇数位置仍采用正常升序 |
 | 三个长度为 3 的字符串 |`1 2 3`| 混合奇数/偶数位置行为 |

 ## 边缘情况

 考虑输入```
2 2
AA
AB
```第一个差异出现在位置 2。那里的规则是降序，所以`AB`必须先来`AA`。 转换图`AA -> AZ`和`AB -> AY`。 自从`AY < AZ`，普通排序返回正确的顺序。 

考虑```
2 3
ABC
AAC
```第一个差异出现在位置 2。原始比较是`B`相对`A`，位置 2 是下降的。 转换后字符串变成`AYC`和`AZC`。 转换后的比较现在以普通升序进行，并且仍然将正确的字符串放在第一位。 

考虑```
2 4
AZAZ
AZAY
```第一个差异出现在位置 4，另一个下降位置。 该转换仅更改位置 2 和 4，保留第一个不同字符的位置。 顺序仍然正确，因为每个偶数位置比较都始终相反。
