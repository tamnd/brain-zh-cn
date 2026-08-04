---
title: "CF 102680B - 苹果笔"
description: "该问题描述了一个名为“uh”的操作。 如果项目 A 与项目 B 进行 uh-ed，则结果是名称为 B-A 的新项目，这意味着第二个项目放置在第一个项目之前，两者之间有连字符。"
date: "2026-08-01T23:30:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102680
codeforces_index: "B"
codeforces_contest_name: "Brookfield Computer Programming Challenge 1"
rating: 0
weight: 102680
solve_time_s: 87
verified: true
draft: false
---

[CF 102680B - 苹果笔](https://codeforces.com/problemset/problem/102680/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题描述了一个名为“uh”的操作。 如果一个项目`A`是一个项目`B`，结果是一个新项目，其名称为`B-A`，这意味着第二个项目放置在第一个项目之前，两者之间有连字符。 任务是对给定项目对独立执行此操作，并按照与项目对出现的顺序相同的顺序打印结果项目名称。 

输入包含操作数，后跟`2*n`物品的描述。 每两个连续的描述形成一对。 每个描述在实际项目名称周围都有额外的单词，因此实现必须仅从每行中提取最终单词。 输出应为每一对包含一个格式化句子，其中第二项在生成的名称中排在第一位。 

就项目数量而言，限制很小。 最多可以有 1000 个操作，项目名称最多可以包含 1000 个字符。 这意味着文本总量可以达到大约 200 万个字符，因此解决方案应该仅处理每个字符恒定的次数。 任何不必要地重复扫描或重建长字符串的方法都可能会变得更慢，但直接线性传递就足够了。 

主要的边缘情况是由解析和排序错误而不是算法复杂性引起的。 

考虑输入：```
1
I have a Apple
I have a Pen
```正确的输出是：```
Uh! Pen-Apple!
```粗心的实现可能会保留完整的句子并产生类似的结果`Uh! I have a Pen-I have a Apple!`，因为有意义的数据只是每行的最后一个单词。 

另一种情况是项目已经包含连字符：```
1
I have a Apple-Pen
I have a Pen-Pineapple
```正确的输出是：```
Uh! Pen-Pineapple-Apple-Pen!
```每个项目中现有的连字符必须保持不变。 用连字符分割项目名称并再次连接是不必要的，并且存在更改原始文本的风险。 

## 方法

 暴力解释是模拟整个操作，同时保留所有单词的原始句子形式，然后手动搜索每一行以找到该项目。 这种方法仍然给出正确的答案，因为唯一需要的信息是项目名称，但它执行了不必要的工作。 如果实现得不好，重复搜索长字符串可能会使运行时间与输入总长度乘以操作数成正比。 

输入的结构提供了更简单的观察。 每行始终遵循相同的格式，并且该项目始终是最后一个以空格分隔的标记。 由于每个操作只需要两个相邻的项，因此不需要存储、匹配或任何更复杂的数据结构。 我们可以提取两个项目名称并立即打印结果。 

暴力方法之所以有效，是因为它最终会发现操作所需的两个名称，但它会将不相关的文本视为重要的文本。 关键的观察结果是，只有每行的最后一个单词参与，这让我们可以将解决方案简化为对输入进行单次传递。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * L) 或更糟，具体取决于解析方法 | O(L) | 不必要的工作 |
 | 最佳 | O(总输入长度) | 除了输入缓冲之外，O(1) | 已接受 |

 ## 算法演练

 1.读取呃操作的次数。 每个操作恰好消耗两个项目描述，因此可以连续对处理剩余的输入。 
2. 对于每对行，用空格分隔每行并取出最后一个元素。 这是有效的，因为项目名称保证是最终的单词并且不包含空格。 
3. 首先使用第二个提取的项目打印结果，后跟连字符，最后使用第一个提取的项目。 这直接遵循 uh 操作的定义。 
4. 继续，直到处理完所有对。 

为什么它有效：

 该算法仅保留两条影响答案的信息：第一个项目的名称和第二个项目的名称。 操作定义表示输出名称恰好是第二项，后跟第一项，并用连字符分隔。 由于每一输入行末尾都有一个相关标记，因此提取这些标记不会丢失任何所需信息。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    ans = []

    for _ in range(n):
        a = input().split()[-1]
        b = input().split()[-1]
        ans.append(f"Uh! {b}-{a}!")

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```程序首先读取`n`，它告诉我们必须处理多少对。 循环完全运行`n`次，与呃操作的次数相匹配。 

对于每次迭代，两个输入行都被分成单词。 服用指数`-1`无论项目长度如何，都能安全地检索最后一个单词。 该项目本身可能包含连字符，但这并不影响`split()`因为分隔符是一个空格。 

变量的顺序很重要。 第一个提取的项目是操作的左侧，而第二个提取的项目则成为答案的开头。 交换它们会反转所需的结果。 

最后收集答案并打印在一起。 这可以避免重复的输出调用，并使程序在最大输入大小下保持高效。 

## 工作示例

 对于第一个样本：```
2
I have a Apple
I have a Pen
I have a Apple-Pen
I have a Pen-Pineapple
```踪迹是：

 | 步骤| 第一项 | 第二项 | 产出 |
 | --- | --- | --- | --- |
 | 1 | 苹果| 笔| 呃！ 笔苹果！ |
 | 2 | 苹果笔| 笔-菠萝| 呃！ 笔-菠萝-苹果-笔！ |

 第一个操作演示了顺序的基本反转。 第二个表明现有的连字符保持不变。 

对于自定义示例：```
3
I have a A
I have a B
I have a C-D
I have a E
I have a Long-Name
I have a X-Y-Z
```踪迹是：

 | 步骤| 第一项 | 第二项 | 产出 |
 | --- | --- | --- | --- |
 | 1 | 一个 | 乙| 呃！ 乙-甲！ |
 | 2 | C-D| 电子| 呃！ E-C-D！ |
 | 3 | 长名 | X-Y-Z| 呃！ X-Y-Z-长名！ |

 这证实了该算法不会专门解释连字符。 它们只是项目名称中的字符。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(S)| 输入中的每个字符在分割行时都会被处理固定次数。 |
 | 空间| O(n) | 输出列表存储打印前生成的行。 |

 这里，`S`是输入中的字符总数。 由于每个项目最多 1000 次操作和 1000 个字符，线性扫描完全在限制范围内。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

# provided samples
assert run(
"""2
I have a Apple
I have a Pen
I have a Apple-Pen
I have a Pen-Pineapple
"""
) == """Uh! Pen-Apple!
Uh! Pen-Pineapple-Apple-Pen!
""", "sample"

# minimum size
assert run(
"""1
I have a A
I have a B
"""
) == """Uh! B-A!
""", "single pair"

# all equal values
assert run(
"""2
I have a Apple
I have a Apple
I have a Apple
I have a Apple
"""
) == """Uh! Apple-Apple!
Uh! Apple-Apple!
""", "same names"

# boundary with long names
assert run(
"""1
I have a ABC-ABC-ABC
I have a XYZ-XYZ-XYZ
"""
) == """Uh! XYZ-XYZ-XYZ-ABC-ABC-ABC!
""", "hyphen preservation"

# multiple operations
assert run(
"""3
I have a One
I have a Two
I have a Three
I have a Four
I have a Five
I have a Six
"""
) == """Uh! Two-One!
Uh! Four-Three!
Uh! Six-Five!
""", "multiple pairs"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一对与`A`和`B`|`Uh! B-A!`| 最小输入处理 |
 | 重复`Apple`项目 | 相同的名称正确连接 | 等值且无特殊外壳 |
 | 包含多个连字符的名称 | 连字符保持不变 | 正确提取物品名称 |
 | 连续几对 | 三个独立输出| 对加工订单 |

 ## 边缘情况

 对于第一个解析边缘情况：```
1
I have a Apple
I have a Pen
```该算法提取`Apple`和`Pen`从每一行中取出最后一个标记。 然后它构建`Pen-Apple`，生产：```
Uh! Pen-Apple!
```使用整行而不是项目标记的解决方案将包含不相关的单词并失败。 

对于第二种边缘情况：```
1
I have a Apple-Pen
I have a Pen-Pineapple
```提取的值已经是完整的项目名称。 该算法不会进一步拆分它们，因此直接将它们组合起来：```
Uh! Pen-Pineapple-Apple-Pen!
```这可以正确处理看起来嵌套的名称，因为该操作仅在两个原始名称之间添加一个新连字符。
