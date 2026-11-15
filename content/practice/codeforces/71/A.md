---
title: "CF 71A - 单词太长"
description: "我们得到了几个小写单词，并且必须只缩短那些被认为“太长”的单词。 如果单词的长度大于 10，则该单词太长。缩短规则非常具体。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "strings"]
categories: ["algorithms"]
codeforces_contest: 71
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 65 (Div. 2)"
rating: 800
weight: 71
solve_time_s: 88
verified: true
draft: false
---

[CF 71A - 单词太长](https://codeforces.com/problemset/problem/71/A)

 **评分：** 800
 **标签：** 字符串
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了几个小写单词，并且必须只缩短那些被认为“太长”的单词。 如果单词的长度大于 10，则该单词太长。 

缩短规则非常具体。 我们保留第一个字符和最后一个字符，然后用删除的字符数替换中间的所有内容。 例如，`"localization"`有12个字符，所以我们保留`'l'`和`'n'`，并且它们之间有10个字符。 结果变成`"l10n"`。 

每个输入单词都是独立处理的。 对于每个单词，我们要么原封不动地打印它，要么打印它的缩写。 

限制非常小。 最多有 100 个单词，每个单词的长度最多为 100。即使是简单的逐字符解决方案也很容易满足限制。 处理的文本总量很小，因此任何线性时间方法都绰绰有余。 

棘手的部分不是性能，而是正确处理边界条件。 

一个常见的错误是缩写长度恰好为 10 的单词。条件严格要求大于 10。 

输入示例：```
1
abcdefghij
```正确输出：```
abcdefghij
```粗心的实现使用`>= 10`会错误地产生：```
a8j
```另一个错误是错误地计算了中间计数。 插入的数字是第一个字符和最后一个字符之间的字符数，即`len(word) - 2`。 

输入示例：```
1
localization
```正确输出：```
l10n
```如果有人使用`len(word) - 1`，他们会错误地打印：```
l11n
```单字符单词是另一个值得检查的边缘情况。 

输入示例：```
1
a
```正确输出：```
a
```该词不够长，无法缩写，因此必须保持不变。 访问第一个和最后一个字符在这里仍然有效，因为它们是相同的字符。 

## 方法

 解决问题最直接的方法就是暴力模拟。 对于每个单词，我们都会检查其长度。 如果长度最多为 10，我们将原样打印该单词。 否则，我们通过获取第一个字符、计算中间有多少个字符并附加最后一个字符来构建缩写。 

这已经很有效了，因为约束非常小。 即使每个单词的长度为 100，我们最多也只能处理 10,000 个字符。 这实际上是即时的。 

较慢的暴力变体实际上是逐个计算中间字符，而不是使用算术。 例如，对于长度为 20 的字，我们可以从索引 1 循环到索引 18 并递增计数器。 这仍然可以通过，因为输入很小，但它执行了不必要的工作。 

关键的观察结果是不需要手动计算删除的字符数。 一旦我们知道了单词长度，中间的计数总是：```
length - 2
```除了读取输入本身之外，这将每个字的操作时间减少到恒定。 

暴力破解的想法之所以有效，是因为每个单词都是独立的。 单词之间没有交互，没有复杂的数据结构，也没有隐藏的优化技巧。 唯一的任务是一致地应用固定的转换规则。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 手动暴力计算中间字母 | O(总字符数) | O(1) | O(1) | 已接受 |
 | 最优算术构造 | O(总字符数) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取整数`n`，字数。 
2. 重复`n`次并每次迭代读一个单词。 
3. 检查字长。 

如果长度小于或等于10，则原样打印该单词，因为它不被认为太长。 
4. 否则，构造缩写。 

使用第一个字符`word[0]`。 
5. 计算第一个字符和最后一个字符之间有多少个字符。 

这个值是`len(word) - 2`因为我们只排除了两个字符，第一个和最后一个。 
6. 使用以下命令获取最后一个字符`word[-1]`。 
7. 将第一个字符、转换为字符串的中间计数和最后一个字符连接起来，然后打印结果。 

### 为什么它有效

 该算法直接遵循缩写的定义。 每个长单词都会转化为：```
first letter + number of middle letters + last letter
```中间字母的计数始终是总长度减去两个保留的边界字符。 由于每个单词都是独立处理的，并且转换与所需的格式完全匹配，因此该算法始终会产生正确的输出。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())

for _ in range(n):
    word = input().strip()

    if len(word) <= 10:
        print(word)
    else:
        abbreviated = word[0] + str(len(word) - 2) + word[-1]
        print(abbreviated)
```程序首先读取单词数。 然后它独立地处理每个单词。 

这`strip()`调用从输入中删除尾随换行符。 如果没有它，换行符将成为字符串长度的一部分并产生不正确的结果。 

条件`len(word) <= 10`与问题陈述完全匹配。 使用`< 10`或者`>= 10`会引入一个差一错误。 

对于长单词，缩写由三部分组成。`word[0]`给出第一个字符，`len(word) - 2`给出跳过的中间字符的数量，并且`word[-1]`给出最终的字符。 

使用`word[-1]`很方便，因为无论单词长度如何，它始终引用最后一个字符。 

## 工作示例

 ### 示例 1

 输入：```
4
word
localization
internationalization
pneumonoultramicroscopicsilicovolcanoconiosis
```追踪：

 | 词| 长度 | 太长？ | 中计数 | 输出|
 | --- | --- | --- | --- | --- |
 | 词| 4 | 没有 | - | 词|
 | 本地化| 12 | 12 是的 | 10 | 10 本地化 |
 | 国际化| 20 | 是的 | 18 | 18 国际化 |
 | 肺超显微硅火山沉着病 | 45 | 45 是的 | 43 | 43 p43s | p43s |

 这条轨迹显示了问题的中心规则。 短单词保持不变，而长单词则被压缩为第一个字母、中间计数和最后一个字母。 

### 示例 2

 输入：```
5
abcdefghij
abcdefghijk
a
codeforces
short
```追踪：

 | 词| 长度 | 太长？ | 中计数 | 输出|
 | --- | --- | --- | --- | --- |
 | abcdefghij | 10 | 10 没有 | - | abcdefghij |
 | abcdefghijk | 11 | 11 是的 | 9 | a9k | a9k |
 | 一个 | 1 | 没有 | - | 一个 |
 | 代码力量 | 10 | 10 没有 | - | 代码力量 |
 | 短| 5 | 没有 | - | 短|

 此示例重点关注边界条件。 长度正好为 10 的单词不会被缩写。 只有严格大于 10 的长度才有资格。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(总字符数) | 每个单词被读取一次并在相对于其长度的线性时间内处理 |
 | 空间| O(1) | O(1) | 无论输入大小如何，仅使用几个变量 |

 限制很小，因此该解决方案可以轻松满足 1 秒时间限制和 256 MB 内存限制。 即使单独处理每个字符也足够快了。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    out = []

    for _ in range(n):
        word = input().strip()

        if len(word) <= 10:
            out.append(word)
        else:
            out.append(word[0] + str(len(word) - 2) + word[-1])

    print("\n".join(out))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue()

# provided sample
assert run(
"""4
word
localization
internationalization
pneumonoultramicroscopicsilicovolcanoconiosis
"""
) == (
"""word
l10n
i18n
p43s
"""
), "sample 1"

# minimum-size input
assert run(
"""1
a
"""
) == (
"""a
"""
), "single character word"

# boundary length 10 should not abbreviate
assert run(
"""2
abcdefghij
codeforces
"""
) == (
"""abcdefghij
codeforces
"""
), "length exactly 10"

# length 11 should abbreviate
assert run(
"""1
abcdefghijk
"""
) == (
"""a9k
"""
), "length 11"

# multiple equal long words
assert run(
"""3
localization
localization
localization
"""
) == (
"""l10n
l10n
l10n
"""
), "repeated inputs"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`a`| 最小可能字长 |
 |`abcdefghij`|`abcdefghij`| 长度为 10 时的边界条件 |
 |`abcdefghijk`|`a9k`| 应缩写的第一个长度 |
 | 重复`localization`| 重复`l10n`| 跨多个单词的一致处理 |

 ## 边缘情况

 长度恰好为 10 的单词必须保持不变。 

输入：```
1
abcdefghij
```算法检查`len(word) <= 10`。 由于长度正好是 10，因此条件为真，并打印原始单词。 

输出：```
abcdefghij
```这避免了常见的大错特错，即缩写应该保持不变的单词。 

很长的单词必须正确计算中间计数。 

输入：```
1
internationalization
```长度为 20。算法计算：```
20 - 2 = 18
```然后它结合：```
i + 18 + n
```输出：```
i18n
```这证实计数仅指第一个和最后一个字母之间的字符。 

单字符单词也可以正常工作。 

输入：```
1
a
```长度为1，因此该词不缩写。 该算法直接打印原始单词。 

输出：```
a
```不需要特殊情况处理，因为该条件可以防止不必要的缩写逻辑。
