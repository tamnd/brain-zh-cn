---
title: "CF 100D - 口碑世界"
description: "我们从一个初始字符串开始，并将其传递给由 n 个人组成的圆圈。 每个人只能通过以下两种方式之一修改字符串： 1. 从末尾删除一个字符。 2. 在末尾添加一个字符。 一个人也可以选择什么都不做。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "strings"]
categories: ["algorithms"]
codeforces_contest: 100
codeforces_index: "D"
codeforces_contest_name: "Unknown Language Round 3"
rating: 1500
weight: 100
solve_time_s: 138
verified: true
draft: false
---

[CF 100D - 口碑世界](https://codeforces.com/problemset/problem/100/D)

 **评分：** 1500
 **标签：** *特殊、字符串
 **求解时间：** 2m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个初始字符串开始并将其传递到一个圆圈`n`人们。 每个人都只能通过以下两种方式之一修改字符串：

 1. 从末尾删除一个字符。 
2. 在末尾添加一个字符。 

一个人也可以选择什么都不做。 

恰好之后`n`传输，我们得到最终的字符串。 我们必须决定最终的字符串是否可以从初始字符串合法地生成。 

关键细节是每个操作仅影响字符串的后缀。 中间的角色永远不会被直接触摸。 唯一可变的部分是字符串的当前末尾。 

限制异常大。 移动次数可达`8 * 10^6`，每个字符串的长度可达`10^7`。 任何具有二次行为的算法都是不可能的。 即使是线性算法也必须避免不必要的复制或重复扫描。 重复重建字符串或一一模拟操作的解决方案将会超时或耗尽内存。 

大的输入量也迫使我们仔细思考在此过程中实际发生的变化。 由于操作仅发生在末尾，因此保留字符的相对顺序永远不会改变。 这个观察就是整个问题。 

一些边缘情况很容易被错误处理。 

考虑：```
n = 2
initial = abc
final = abc
```正确答案是`Yes`。 两个人都可能什么都不做。 假设每个动作都必须修改字符串的粗心解决方案会错误地拒绝这一点。 

现在考虑：```
n = 1
initial = abc
final = ab
```正确答案是`Yes`。 删除一次就够了。 但：```
n = 1
initial = abc
final = a
```正确答案是`No`，因为一次移动最多可以将长度改变 1。 

另一种微妙的情况是一个字符串是另一个字符串的前缀：```
n = 3
initial = abc
final = abcde
```答案是`Yes`。 我们只需要两次append操作，剩下的move就可以不用了。 

但这失败了：```
n = 1
initial = abc
final = abcde
```答案是`No`，因为增长两个字符至少需要两次操作。 

最重要的结构边缘情况是当字符串在较短的字符串结束之前不一致时：```
n = 10
initial = abcd
final = abxd
```答案是`No`。 因为只有结局可以改变，所以我们永远无法改变结局`c`进入`x`无需先删除其后的所有内容。 保留的部分必须始终是公共前缀。 

## 方法

 蛮力的想法是模拟所有可能的操作序列。 在每一步中，我们可以添加一个字符、删除最后一个字符或不执行任何操作。 即使我们将附加选择限制为目标字符串中出现的字母，分支因子也是巨大的。 后`n`步骤，可能的状态数量呈指数级增长。 

另一种强力改进是从最后的字符串开始向后思考。 我们可以尝试各种可能的删除和添加。 这仍然变得不可行，因为字符串可能包含数百万个字符。 

蛮力之所以有吸引力，是因为每个动作都很简单。 但移动序列的数量巨大，而实际的结构自由度却很小。 

关键的观察是操作仅影响后缀。 这意味着第一次不匹配之前的每个字符都必须永远保持不变。 因此，当且仅当两个字符串共享某个公共前缀时，转换才是可能的，并且该前缀之后的所有内容最多都可以删除并重建`n`运营。 

假设最长公共前缀长度为`L`。 

改造：```
initial -> final
```我们必须：

 1.删除最后一个`len(initial) - L`人物。 
2. 追加最后一个`len(final) - L`人物。 

所需的最少操作是：```
(len(initial) - L) + (len(final) - L)
```如果这个值最多是`n`，那么我们可以花费额外的动作什么都不做，因为每个人都可以保持字符串不变。 

因此，整个问题简化为计算最长公共前缀并检查所需的编辑计数是否适合`n`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳 | O(min( | s | , |

 ## 算法演练

 1. 阅读`n`, 初始字符串`s`，以及最后的字符串`t`。 
2. 当字符匹配时从左到右扫描两个字符串。 

维护索引`L`，最长公共前缀的长度。 

一旦我们遇到第一个不匹配，就无法保留后面的字符，因为操作仅修改后缀。 
3. 计算需要删除多少次。 

我们必须删除其中的每个字符`s`位置后`L`。 

该计数是：```
len(s) - L
```4. 计算需要多少追加操作。 

我们必须构建剩余的后缀`t`。 

该计数是：```
len(t) - L
```5. 将两个值相加以获得所需的最少操作数。 
6. 如果所需的最少操作最多为`n`， 打印`Yes`。 

否则打印`No`。 

### 为什么它有效

 字符串的保留部分必须始终保留前缀，因为所有操作都发生在末尾。 一旦两个字符串在某个位置不同，原始字符串中后面的每个字符最终都必须被删除，然后才能构造目标后缀。 

因此，最长的公共前缀是我们可以保持不变的最大部分。 任何有效的转换都必须删除初始字符串的剩余部分并附加目标字符串的剩余部分。 这给出了所需操作的最少数量，任何额外的移动都可能简单地使字符串保持不变。 所以这个条件既是必要的，又是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    s = input().strip()
    t = input().strip()

    l = 0
    limit = min(len(s), len(t))

    while l < limit and s[l] == t[l]:
        l += 1

    operations = (len(s) - l) + (len(t) - l)

    if operations <= n:
        print("Yes")
    else:
        print("No")

solve()
```该实现直接反映了数学论证。 

该循环计算最长的公共前缀而不创建子字符串。 这很重要，因为字符串可能包含多达一千万个字符。 重复切片会分配大量内存并显着减慢程序速度。 

循环后，索引后的每个字符`l`必须删除原始字符串中的每个字符以及索引之后的每个字符`l`必须附加在目标字符串中。 公式为`operations`直接来自该观察。 

比较使用`<= n`， 不是`== n`。 这是错误的常见来源。 人们可以在移动过程中保持弦不变，因此有额外的未使用的移动是完全有效的。 

另一个微妙的细节是使用`strip()`读取字符串时。 输入行包含不应成为字符串一部分的尾随换行符。 

## 工作示例

 ### 示例 1

 输入：```
100
Codeforces
MMIODPC
```| 步骤| 价值|
 | --- | --- |
 | 初始字符串|`Codeforces`|
 | 最后的字符串|`MMIODPC`|
 | 最长公共前缀长度 |`0`|
 | 需要删除|`10`|
 | 需要补充|`7`|
 | 总运营|`17`|
 | 与比较`n=100`|`17 <= 100`|

 输出：```
Yes
```这个例子表明额外的动作并不重要。 我们只需要修改17处，剩下的83人就可以将字符串原样传递。 

### 示例 2

 输入：```
2
abcd
abxy
```| 步骤| 价值|
 | --- | --- |
 | 初始字符串|`abcd`|
 | 最后的字符串|`abxy`|
 | 最长公共前缀长度 |`2`|
 | 需要删除|`2`|
 | 需要补充|`2`|
 | 总运营|`4`|
 | 与比较`n=2`|`4 > 2`|

 输出：```
No
```这说明了为什么只有公共前缀才能生存。 后缀`cd`之前必须删除`xy`可以追加。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(分钟( | s |
 | 空间| O(1) 额外 | 仅使用了少数整数变量 |

 该解决方案完全符合限制。 即使对于长度为一千万的字符串，如果仔细实现而无需创建子字符串或重复连接，则在 Python 中单次线性扫描也是可行的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    n = int(input())
    s = input().strip()
    t = input().strip()

    l = 0
    limit = min(len(s), len(t))

    while l < limit and s[l] == t[l]:
        l += 1

    operations = (len(s) - l) + (len(t) - l)

    if operations <= n:
        print("Yes")
    else:
        print("No")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.strip()

# provided sample
assert run(
"""100
Codeforces
MMIODPC
"""
) == "Yes", "sample 1"

# identical strings, zero operations needed
assert run(
"""2
abc
abc
"""
) == "Yes", "same strings"

# not enough operations
assert run(
"""1
abc
a
"""
) == "No", "requires two deletions"

# pure append
assert run(
"""3
abc
abcde
"""
) == "Yes", "two appends fit"

# mismatch inside string
assert run(
"""2
abcd
abxy
"""
) == "No", "needs four operations"

# full replacement
assert run(
"""6
aaaa
bbbb
"""
) == "No", "needs eight operations"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`abc -> abc`|`Yes`| 额外的动作可能未使用|
 |`abc -> a`和`n=1`|`No`| 仅长度差异就可以超出限制|
 |`abc -> abcde`和`n=3`|`Yes`| 纯追加操作 |
 |`abcd -> abxy`和`n=2`|`No`| 内部不匹配需要重建后缀 |
 |`aaaa -> bbbb`和`n=6`|`No`| 完整更换成本|

 ## 边缘情况

 考虑：```
1
abc
ab
```最长的公共前缀是`ab`， 所以`L = 2`。 

我们需要：```
3 - 2 = 1 deletion
2 - 2 = 0 additions
```总操作 =`1`。 

自从`1 <= n`，算法打印`Yes`。 

现在考虑：```
1
abc
a
```最长公共前缀只有`a`， 所以：```
3 - 1 = 2 deletions
1 - 1 = 0 additions
```总操作 =`2`。 

自从`2 > 1`，算法正确打印`No`。 

接下来，检查字符串中间不同的情况：```
10
abcd
abxd
```最长的公共前缀是`ab`。 

该算法计算：```
4 - 2 = 2 deletions
4 - 2 = 2 additions
```总操作 =`4`。 

Even though the strings have equal length, changing`c`进入`x`仍然需要删除后缀并重建它。 该算法通过公共前缀逻辑自动捕获这一点。 

最后，考虑相同的字符串：```
5
hello
hello
```最长公共前缀长度为`5`。 

所需操作：```
0 deletions
0 additions
```总操作 =`0`。 

由于允许未使用的移动，因此算法正确地打印`Yes`。
