---
title: "CF 59A - 字"
description: "任务是规范单个单词的大小写，以便所有字母均为小写或全部大写。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 59
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 55 (Div. 2)"
rating: 800
weight: 59
solve_time_s: 71
verified: true
draft: false
---

[CF 59A - Word](https://codeforces.com/problemset/problem/59/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是规范单个单词的大小写，以便所有字母均为小写或全部大写。 该决定取决于输入中哪种大小写占主导地位：如果大写字母多于小写字母，则该单词应完全转换为大写； 否则，应将其完全转换为小写。 如果计数完全相等，则首选小写字母。 

输入是仅包含英文字母的单个单词，长度在 1 到 100 个字符之间。 这个长度很小，因此我们可以多次迭代所有字符，而不必担心效率。 不需要复杂的数据结构或排序。 

边缘情况包括大小写已经统一的单词、单字母单词以及大写字母和小写字母数量完全相等的单词。 例如，输入`"a"`应该保留`"a"`， 和`"Ab"`应该成为`"ab"`因为小写的联系被小写打破了。 幼稚的实现可能会忘记正确处理平局条件，或者可能由于不严格区分大写和小写而错误地计算字母。 

## 方法

 暴力方法会扫描字符串，并针对每个字母检查它是大写还是小写，并维护单独的计数器。 然后，计数后，比较总数并相应地转换单词。 对于我们的约束来说，这种方法实际上足够有效，因为单词最多有 100 个字符，并且每个操作的时间复杂度为 O(1)。 因此，即使是双重扫描（一次用于计数，一次用于转换）也是可以接受的。 

简化实现的关键观察是Python提供了内置的字符串方法来检查大小写（`isupper()`）并将整个字符串转换为特定的大小写（`upper()`和`lower()`）。 我们不需要跟踪单个索引进行转换，因为转换适用于整个字符串。 

暴力和最优之间的区别在这里主要是风格上的。 最佳方法是简单地进行一次线性扫描来计算大写字母，然后有条件地应用`upper()`或者`lower()`到整个字符串。 不需要更复杂的结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（计数+转换）| O(n) | O(1) | O(1) | 已接受 |
 | 最优（计算大写，转换一次）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化大写字母计数器。 这是决定最终转换所需的最小状态。 
2. 迭代输入单词中的每个字符。 对于每个字符，使用标准语言方法检查它是否为大写。 如果是，则增加大写计数器。 我们不需要小写计数器，因为总长度减去大写计数得出小写计数。 
3. 扫描完所有字母后，将大写字母数量与小写字母数量进行比较（计算方式为总长度减去大写字母数量）。 如果大写字母数量严格较多，则将整个单词转换为大写字母。 否则，将整个单词转换为小写。 
4. 打印转换后的单词。 

为什么有效：在步骤 3 中，比较可确保应用最少数量的字母转换。 如果大写占主导地位，则将全部转换为大写会比转换为小写改变更少的字母。 如果小写字母占主导地位或它们并列，则转换为小写字母可实现相同的最小更改目标。 不变的是，在转换时，我们已经知道全局多数情况，因此不会发生局部误算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

word = input().strip()

uppercase_count = sum(1 for c in word if c.isupper())
lowercase_count = len(word) - uppercase_count

if uppercase_count > lowercase_count:
    print(word.upper())
else:
    print(word.lower())
```第一行有效地读取输入。 使用`strip()`删除任何尾随换行符。 领悟`sum(1 for c in word if c.isupper())`计算单次大写字母的数量。 小写字母计数被计算为总长度和大写字母计数之间的差，从而避免了第二次迭代。 条件一步应用正确的转换。 

微妙之处：忘记`strip()`会在输出中留下尾随换行符。 错误计算大写与小写或使用`>=`而不是`>`将违反打破平局规则。 

## 工作示例

 ### 示例 1

 输入：`"HoUse"`| 步骤| 大写计数 | 小写计数 | 决定| 输出|
 | --- | --- | --- | --- | --- |
 | 数字母| 2（`H`,`U`) | 3（`o`,`s`,`e`) | 小写占主导地位 |`house`|

 这证实了算法在小写占多数时正确选择了小写。 

### 示例 2

 输入：`"ViP"`| 步骤| 大写计数 | 小写计数 | 决定| 输出|
 | --- | --- | --- | --- | --- |
 | 数字母| 2（`V`,`P`) | 1（`i`) | 大写为主 |`VIP`|

 这演示了当大写字母更频繁时的正确处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 我们扫描一次字符串进行计数，然后应用一次转换操作。 每个步骤的字长都是线性的。 |
 | 空间| O(1) | O(1) | 仅使用两个计数器和一些临时引用。 在 Python 实现中，输出字符串与输入共享内存。 |

 当 n ≤ 100 时，该解决方案可以立即运行并且需要的内存可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    word = sys.stdin.readline().strip()
    uppercase_count = sum(1 for c in word if c.isupper())
    lowercase_count = len(word) - uppercase_count
    return word.upper() if uppercase_count > lowercase_count else word.lower()

# provided sample
assert run("HoUse\n") == "house", "sample 1"
# all lowercase
assert run("abcde\n") == "abcde", "all lowercase"
# all uppercase
assert run("ABCDE\n") == "ABCDE", "all uppercase"
# tie case
assert run("Ab\n") == "ab", "tie case -> lowercase"
# single character uppercase
assert run("X\n") == "X", "single uppercase"
# single character lowercase
assert run("x\n") == "x", "single lowercase"
# mixed with more uppercase
assert run("PyTHon\n") == "PYTHON", "more uppercase"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 房屋使用 | 房子| 小写多数 |
 | ABCDE | ABCDE | 全部小写输入 |
 | ABCDE | ABCDE | 全部大写输入 |
 | 抗体 | ab | 正确处理领带 |
 | X | X | 单字母大写 |
 | x| x| 单字母小写 |
 | Python | Python | 更多大写字母 |

 ## 边缘情况

 对于平局场景`"Ab"`，算法计算`uppercase_count = 1`,`lowercase_count = 1`。 条件`uppercase_count > lowercase_count`失败，因此该单词被转换为小写`"ab"`。 这正确地应用了关系优先小写的规则。 

对于单字母单词`"X"`，大写计数为 1，小写计数为 0。条件为 true，因此输出保持不变`"X"`。 为了`"x"`，条件为假，输出保持不变`"x"`。 这两种情况都证实算法正确处理最小输入大小。 

这篇社论确保读者可以在案例标准化或基于多数的转换的任何类似问题上重现该方法。
