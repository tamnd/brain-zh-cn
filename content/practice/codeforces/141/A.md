---
title: "CF 141A - 有趣的笑话"
description: "我们得到了三个大写字符串。 前两串是写在门上的名字，第三串是第二天早上有人把所有东西混合在一起后发现的一堆信件。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "sortings", "strings"]
categories: ["algorithms"]
codeforces_contest: 141
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 101 (Div. 2)"
rating: 800
weight: 141
solve_time_s: 91
verified: true
draft: false
---

[CF 141A - 有趣的笑话](https://codeforces.com/problemset/problem/141/A)

 **评分：** 800
 **标签：** 实现、排序、字符串
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了三个大写字符串。 前两串是写在门上的名字，第三串是第二天早上有人把所有东西混合在一起后发现的一堆信件。 

任务是检查第三个字符串是否包含与前两个字符串组合完全相同的字母。 每个角色都很重要，包括它出现的次数。 如果组合名称包含三个`'A'`字符，该堆还必须恰好包含三个`'A'`人物。 不能缺少任何字母，也不允许有多余的字母。 

每个字符串的最大长度仅为 100，因此即使效率相当低的操作也是完全安全的。 二次解仍然可以立即运行。 这使我们可以自由地选择最清晰的实现，而不必担心微观优化。 

主要的危险是忘记了字符频率很重要，而不仅仅是字符的存在。 粗心的解决方案可能只会检查每个不同的字符是否出现在堆中的某个位置。 

考虑这个输入：```
AAB
C
ABAC
```正确的输出是：```
YES
```组合名称包含两个`'A'`， 一`'B'`，和一个`'C'`。 该堆包含完全相同的计数。 

现在看这个案例：```
AAB
C
ABC
```正确的输出是：```
NO
```简单的基于存在的检查会错误地接受这一点，因为所有需要的字母至少出现一次。 问题是一个`'A'`失踪了。 

另一个容易犯的错误是忘记拒绝多余的字母。```
ABC
DEF
ABCDEFX
```正确的输出是：```
NO
```所有必需的字母都存在，但额外的字母`'X'`使该堆无效。 

最后一种边缘情况是长度已经不一致的情况。```
AB
CD
ABC
```正确的输出是：```
NO
```组合起来的名字需要四个字母，但一堆只有三个字母。 任何正确的解决方案都必须立即拒绝或通过计数检测不匹配。 

## 方法

 蛮力的想法是生成组合名称的每种可能的排列，并检查其中之一是否等于桩字符串。 这是可行的，因为问题实际上是在问这堆字母是否可以重新排列成原始字母。 

如果组合长度为`n`， 有`n!`排列。 即使是为了`n = 20`，这变得大得不可思议，实际限制可以达到 200 个字符。 阶乘时间算法是完全不可行的。 

关键的观察结果是字符的顺序根本不重要。 该堆可以任意洗牌。 当且仅当每个字符在两个字符串中出现相同的次数时，两个字符串在任意重新排序下是等效的。 

这减少了比较字符频率的问题。 

有两种常见的方法可以做到这一点。 一种是使用数组或哈希映射来计算字符数。 另一种是对两个字符串进行排序并比较排序结果。 由于输入大小很小，因此任何一种方法都可以轻松接受。 

基于排序的解决方案尤其简洁。 我们连接前两个字符串，对结果进行排序，对堆字符串进行排序，然后直接比较它们。 如果排序后的版本匹配，则字符多重集相同。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力排列 | O(n!) | O(n) | 太慢了 |
 | 排序和比较 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取访客名称、主机名称和桩字符串。 
2. 连接前两个字符串，因为它们一起代表所有应该存在的字母。 
3. 对连接的字符串进行排序。 排序将相同的字母分组在一起，使频率比较变得简单。 
4.同理对桩串进行排序。 
5. 比较两个已排序的字符串。 

如果它们相同，则每个字符在两个字符串中出现的次数相同，因此 print`"YES"`。 
6. 否则，打印`"NO"`。 

### 为什么它有效

 排序将每个字符串转换为规范形式，其中相同的字符多重集变成相同的字符串。 如果两个字符串包含完全相同且频率相同的字符，则它们的排序版本必须逐个字符匹配。 即使有一个字符数不同，排序后的字符串也会在某处有所不同。 这保证了比较是必要的和充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

guest = input().strip()
host = input().strip()
pile = input().strip()

combined = guest + host

if sorted(combined) == sorted(pile):
    print("YES")
else:
    print("NO")
```第一步读取三个输入字符串并使用删除尾随换行符`strip()`。 

变量`combined`如果没有人添加或删除任何内容，则存储应存在的所有字母。 

致电给`sorted()`将每个字符串转换为已排序的字符列表。 Python 按字典顺序比较列表，因此只有当两个列表包含相同计数的完全相同的字符时，相等才会成功。 

一个微妙的细节是，仅排序就已经可以自动处理长度不匹配的情况。 如果一个字符串有多余或缺失的字母，则排序后的列表不可能相等。 

由于 Python 的内置排序可以有效地处理所有繁重的工作，因此实现时间很短。 

## 工作示例

 ### 示例 1

 输入：```
SANTACLAUS
DEDMOROZ
SANTAMOROZDEDCLAUS
```| 步骤| 价值|
 | ---| ---|
 | 访客|`SANTACLAUS`|
 | 主持人|`DEDMOROZ`|
 | 合并 |`SANTACLAUSDEDMOROZ`|
 | 桩|`SANTAMOROZDEDCLAUS`|
 | 排序组合 |`AACDDELMNOORRSSTTUZ`|
 | 排序堆|`AACDDELMNOORRSSTTUZ`|
 | 结果 |`YES`|

 该迹线显示了算法的中心不变量。 一旦通过排序删除了顺序，两个字符串就会变得相同，因为它们包含完全相同的字符频率。 

### 示例 2

 输入：```
AAB
C
ABC
```| 步骤| 价值|
 | ---| ---|
 | 访客|`AAB`|
 | 主持人|`C`|
 | 合并 |`AABC`|
 | 桩|`ABC`|
 | 排序组合 |`AABC`|
 | 排序堆|`ABC`|
 | 结果 |`NO`|

 这个例子说明了为什么频率很重要。 该堆包含所有必需的不同字母，但只有一个`'A'`而不是两个。 排序会立即暴露不匹配的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序在运行时占据主导地位
 | 空间| O(n) | 排序的字符列表需要额外的内存 |

 这里，`n`是涉及的字符总数。 由于最大可能长度仅为 200，因此与限制相比，运行时间很小。 该解决方案很容易满足时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    guest = input().strip()
    host = input().strip()
    pile = input().strip()

    combined = guest + host

    if sorted(combined) == sorted(pile):
        print("YES")
    else:
        print("NO")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output

# provided sample
assert run(
    "SANTACLAUS\nDEDMOROZ\nSANTAMOROZDEDCLAUS\n"
) == "YES\n", "sample 1"

# missing repeated character
assert run(
    "AAB\nC\nABC\n"
) == "NO\n", "missing repeated character"

# extra character
assert run(
    "ABC\nDEF\nABCDEFX\n"
) == "NO\n", "extra character"

# minimum size valid
assert run(
    "A\nB\nAB\n"
) == "YES\n", "minimum valid case"

# all characters equal
assert run(
    "AAA\nAAAA\nAAAAAAA\n"
) == "YES\n", "all equal characters"

# maximum-style boundary case
assert run(
    "A" * 100 + "\n" +
    "B" * 100 + "\n" +
    "A" * 100 + "B" * 100 + "\n"
) == "YES\n", "large boundary case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`AAB / C / ABC`|`NO`| 检测丢失的重复字符 |
 |`ABC / DEF / ABCDEFX`|`NO`| 拒绝多余字母 |
 |`A / B / AB`|`YES`| 最小有效输入 |
 |`AAA / AAAA / AAAAAAA`|`YES`| 处理重复的相同字符 |
 | 100`'A'`和 100`'B'`|`YES`| 边界大小输入 |

 ## 边缘情况

 考虑重复字符不匹配的情况：```
AAB
C
ABC
```该算法将前两个字符串连接成`"AABC"`。 排序后我们得到：```
AABC
```该堆排序为：```
ABC
```字符串不同，因为一`'A'`失踪了。 算法正确打印`"NO"`。 

现在考虑额外字母的情况：```
ABC
DEF
ABCDEFX
```组合后的字符串排序为：```
ABCDEF
```该堆排序为：```
ABCDEFX
```额外的`'X'`排序后仍然可见，因此比较失败，答案是`"NO"`。 

最后，考虑纯粹的长度不匹配：```
AB
CD
ABC
```组合名称包含四个字符，而一堆名称仅包含三个字符。 排序后：```
Combined: ABCD
Pile:     ABC
```排序后的字符串无法匹配，因为它们的长度不同。 该算法会自动拒绝输入，无需任何特殊情况逻辑。
