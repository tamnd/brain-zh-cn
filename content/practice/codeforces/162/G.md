---
title: "CF 162G - 非十进制和"
description: "我们给出了几个以 2 到 36 之间的任意基数书写的整数。9 以上的数字用大写字母表示，因此在 16 基数中，数字序列继续为 A、B、C、D、E、F，而在更大的基数中，可能会继续到 Z。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 162
codeforces_index: "G"
codeforces_contest_name: "VK Cup 2012 Wild-card Round 1"
rating: 2000
weight: 162
solve_time_s: 106
verified: true
draft: false
---

[CF 162G - 非十进制和](https://codeforces.com/problemset/problem/162/G)

 **评级：** 2000
 **标签：** *特别
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了几个以 2 到 36 之间的任意基数书写的整数。9 以上的数字用大写字母表示，因此在 16 基数中，数字序列继续为`A, B, C, D, E, F`，并且在更大的基数中，它可能会持续到`Z`。 

任务只是计算所有数字的总和并以相同的基数打印结果。 

有趣的是，输入的数字不是以十进制表示的。 我们必须根据给定的基数正确解释每个数字，进行加法，然后将最终的十进制值转换回相同的数字系统。 

限制非常小。 最多有 10 个数字，每个数字最多包含 5 位数字。 即使在最大基数中，一个数字的最大值也是：$$36^5 - 1 = 60,\!466,\!175$$The total sum easily fits inside standard integer types, and Python integers handle values much larger anyway. 这意味着效率不是这里的挑战。 The real challenge is correctly implementing base conversion.

 Several edge cases can silently break careless implementations.

 一个常见的错误是错误处理前导零。 考虑：```
2
10
0012
0008
```正确的输出是：```
20
```The leading zeros are part of the input representation only. 它们不影响数值。 

Another easy mistake is forgetting that digits above 9 are letters. 例如：```
2
16
A
1
```正确的输出是：```
B
```如果解决方案仅使用转换字符`'0'`到`'9'`，它将在十六进制数字上失败。 

Base 2 还很快暴露了转换错误：```
2
2
1111
1
```正确的输出是：```
10000
```这会检查在转换回目标基数期间是否正确处理进位。 

当总和为零时，会出现另一种微妙的情况：```
3
8
0
00
000
```正确的输出是：```
0
```当值为正时重复除法的转换循环可能会意外打印空字符串而不是`"0"`。 

## 方法

 最直接的解决办法是手动模拟数制转换。 

对于每个输入字符串，我们可以从左到右扫描数字并评估其十进制值，这与位置表示法的工作方式完全相同：$$(((d_1)\cdot radix + d_2)\cdot radix + d_3)\cdots$$获得所有小数值后，我们将它们加在一起。 

最后，我们通过重复对余数取模，将得到的十进制数转换回目标基数`radix`。 每个余数成为一个输出数字。 

由于每个数字最多 5 位，最多 10 个数字，因此即使完全手动实现也只执行几百次操作。 

一种强力的替代方法是直接在目标基数中进行逐位加法，模拟教科书上带有进位的加法。 这也有效，因为琴弦很小。 我们将所有数字按最低有效数字对齐，对每列求和，传播进位，并构造答案。 

手动基数转换方法更简单，因为 Python 已经可以安全地处理任意大小的整数。 我们没有在每个基数中实现加法逻辑，而是将任务简化为：

 1. Convert every input number to decimal.
 2.正常添加。 
3. 将最终值转换回来。 

位置数字系统的结构使这种简化变得自然。 一旦数字被解释为整数，算术就不再依赖于其原始表示形式。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力数字模拟 | O(n * L) | O(L) | 已接受 |
 | 最佳转换方法| O(n * L) | O(L) | 已接受 |

 这里，`L`是最大位数，最多 5 个。 

## 算法演练

 1. 阅读`n`和`radix`。 
2. 创建数字转换的辅助函数。 

人物`'0'`通过`'9'`映射到值`0`通过`9`， 尽管`'A'`通过`'Z'`映射到`10`通过`35`。 
3. 将每个输入字符串转换为十进制形式。 

从价值开始`0`。 对于每个角色：$$value = value \times radix + digit$$这遵循位置符号的定义。 
4. 将所有转换后的值相加为一个整数`total`。 
5、特殊情况处理`total == 0`。 

输出`"0"`立即地。 否则转换循环将产生一个空字符串。 
6. 转换`total`回到目标基地。 

反复：

 - 采取`total % radix`- 将余数转换为其字符表示形式
 - 附加它
 - 划分`total //= radix`数字以相反的顺序出现，因为我们首先提取最低有效数字。 
7. 将收集到的数字取反并打印结果。 

### 为什么它有效

 该算法依赖于数字系统的位置定义。 

当逐位读取数字时，将当前值乘以基数会将所有先前的数字向左移动一位。 添加新数字会插入下一个最低有效数字。 处理整个字符串后，计算出的整数等于原始符号表示的数学值。 

反向转换也遵循位置符号。 取模`radix`提取最低有效数字，因为每个较高的位置都可以被基数整除。 重复除法将处理过的数字一一删除，直到重建整个表示。 

由于这两种转换都准确地保留了数值，因此最终打印的字符串表示原始基数中的正确总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def char_to_value(c):
    if '0' <= c <= '9':
        return ord(c) - ord('0')
    return ord(c) - ord('A') + 10

def to_decimal(s, radix):
    value = 0
    for ch in s:
        value = value * radix + char_to_value(ch)
    return value

def from_decimal(x, radix):
    if x == 0:
        return "0"

    result = []

    while x > 0:
        result.append(DIGITS[x % radix])
        x //= radix

    return ''.join(reversed(result))

def solve():
    n = int(input())
    radix = int(input())

    total = 0

    for _ in range(n):
        s = input().strip()
        total += to_decimal(s, radix)

    print(from_decimal(total, radix))

solve()
```该解决方案分为两个独立的转换功能。`to_decimal`解释给定基数中的字符串。 乘法步骤将先前处理的数字左移一个基数位置，就像手动构造数字一样。`from_decimal`执行逆变换。 余数运算从最低有效位到最高有效位提取数字，因此收集的列表必须在最后反转。 

这`DIGITS`字符串提供了从数字值到字符的清晰映射。 指数`10`变成`'A'`， 指数`15`变成`'F'`， 等等。 

对零的特殊处理至关重要。 没有它，转换循环将永远不会执行`x == 0`，产生一个空字符串而不是`"0"`。 

Python 整数已经支持任意精度，因此溢出永远不是问题。 

## 工作示例

 ### 示例 1

 输入：```
3
16
F0
20B
004
```### 转换为十进制

 | 字符串| 当前数字 | 中间值|
 | ---| ---| ---|
 | F0| F = 15 | 15 | 15
 | F0| 0 = 0 | 15 × 16 + 0 = 240 | 15 × 16 + 0 = 240 |
 | 20B | 20B 2 = 2 | 2 |
 | 20B | 20B 0 = 0 | 2 × 16 + 0 = 32 | 2 × 16 + 0 = 32 |
 | 20B | 20B B = 11 | 32 × 16 + 11 = 523 | 32 × 16 + 11 = 523
 | 004| 0 = 0 | 0 |
 | 004| 0 = 0 | 0 |
 | 004| 4 = 4 | 4 |

 总计：

 | 价值观 | 总和 |
 | ---| ---|
 | 240 + 523 + 4 | 240 + 523 + 4 767 | 767

 ### 转换回基数 16

 | 当前值| 剩余| 数字|
 | ---| ---| ---|
 | 767 | 767 15 | 15 F |
 | 47 | 47 15 | 15 F |
 | 2 | 2 | 2 |

 数字按相反顺序收集：`F F 2`。 

最终答案：```
2FF
```该轨迹显示了两个转换方向的协同作用。 前导零`"004"`自然消失，因为它们不改变数值。 

### 示例 2

 输入：```
2
2
1111
1
```### 转换为十进制

 | 字符串| 当前数字 | 中间值|
 | ---| ---| ---|
 | 1111 | 1111 1 | 1 |
 | 1111 | 1111 1 | 3 |
 | 1111 | 1111 1 | 7 |
 | 1111 | 1111 1 | 15 | 15
 | 1 | 1 | 1 |

 总计：

 | 价值观 | 总和 |
 | ---| ---|
 | 15 + 1 | 16 | 16

 ### 转换回基数 2

 | 当前值| 剩余| 数字|
 | ---| ---| ---|
 | 16 | 16 0 | 0 |
 | 8 | 0 | 0 |
 | 4 | 0 | 0 |
 | 2 | 0 | 0 |
 | 1 | 1 | 1 |

 将数字反转可得：```
10000
```此示例演示了跨多个位置的进位传播。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * L) | 每个数字在解析期间处理一次，在输出转换期间处理一次 |
 | 空间| O(L) | 输出数字列表最多存储答案中的位数 |

 这里，`n ≤ 10`和`L ≤ 5`，所以实际的运行时间很小。 该程序仅执行几十个算术运算，并且很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def char_to_value(c):
    if '0' <= c <= '9':
        return ord(c) - ord('0')
    return ord(c) - ord('A') + 10

def to_decimal(s, radix):
    value = 0
    for ch in s:
        value = value * radix + char_to_value(ch)
    return value

def from_decimal(x, radix):
    if x == 0:
        return "0"

    result = []

    while x > 0:
        result.append(DIGITS[x % radix])
        x //= radix

    return ''.join(reversed(result))

def solve():
    input = sys.stdin.readline

    n = int(input())
    radix = int(input())

    total = 0

    for _ in range(n):
        total += to_decimal(input().strip(), radix)

    print(from_decimal(total, radix))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output

# provided sample
assert run(
"""3
16
F0
20B
004
"""
) == "2FF", "sample 1"

# minimum size
assert run(
"""1
2
0
"""
) == "0", "minimum case"

# carry propagation in binary
assert run(
"""2
2
1111
1
"""
) == "10000", "binary carry"

# leading zeros
assert run(
"""2
10
0012
0008
"""
) == "20", "leading zeros"

# largest digit symbols
assert run(
"""2
36
Z
1
"""
) == "10", "base 36 carry"

# many equal values
assert run(
"""4
16
FF
FF
FF
FF
"""
) == "3FC", "multiple additions"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 以 2 为基数的单个零 |`0`| 总和为零的正确处理|
 |`1111 + 1`二进制|`10000`| 跨多位进行传播 |
 | 带有前导零的数字 |`20`| 正确忽略前导零 |
 |`Z + 1`以 36 为基数 |`10`| 最高合法数字转换 |
 | 四份`FF`|`3FC`| 重复加法正确性 |

 ## 边缘情况

 ### 总和为零

 输入：```
3
8
0
00
000
```每个数字都转换为十进制值`0`，所以总数也是`0`。 

反向转换时，算法立即返回`"0"`在进入除法循环之前。 

正确输出：```
0
```如果没有这种特殊情况，数字列表将保持为空。 

### 前导零

 输入：```
2
10
0012
0008
```追踪：

 | 处理后的字符串 | 十进制值 |
 | ---| ---|
 | 0012| 12 | 12
 | 0008| 8 |

 总计变为`20`。 

前导零永远不会影响累加值，因为将零乘以基数仍然会产生零。 

正确输出：```
20
```### 支持的最高数字

 输入：```
2
36
Z
1
```

`Z`映射到数字值`35`。 

总计变为：$$35 + 1 = 36$$转换`36`回到基数 36 给出：

 | 当前值| 剩余|
 | ---| ---|
 | 36 | 36 0 |
 | 1 | 1 |

 颠倒过来后，答案是：```
10
```这证实了字母数字转换在基数范围的上限处正确工作。
