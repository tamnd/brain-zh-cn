---
title: "CF 102460D - 木薯粉"
description: "菜名恰好包含三个小写单词。 其中一些文字是木薯粉装饰的一部分，必须删除。 可移除的文字正是“bubble”和“tapioka”。"
date: "2026-08-08T10:02:03+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102460
codeforces_index: "D"
codeforces_contest_name: "2019-2020 ICPC Asia Taipei-Hsinchu Regional Contest"
rating: 0
weight: 102460
solve_time_s: 194
verified: true
draft: false
---

[CF 102460D - 塔皮奥卡](https://codeforces.com/problemset/problem/102460/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 菜名恰好包含三个小写单词。 其中一些文字是木薯粉装饰的一部分，必须删除。 可移动的单词正是`bubble`和`tapioka`。 其他所有单词都属于实际菜肴，并且必须保持相对于其他幸存单词的原始位置。 

例如，`bubble tea pizza`变成`tea pizza`， 尽管`tapioka cake tapiokas`变成`cake tapiokas`。 第二个例子是故意有用的，因为`tapiokas`与以下单词不同`tapioka`，因此不得将其删除。 

过滤完这三个词之后，可能就什么也没有剩下了。 在这种情况下，所需的输出是单词`nothing`。 

输入非常小：只有三个单词，每个单词的长度最多为 32。即使重复扫描整个输入的算法也只能执行恒定数量的操作。 因此，2秒的时间限制和大内存限制对于这个问题不是限制性的。 更一般地说，如果将相同的任务扩展到最多包含 (10^5) 个单词的数组，则 (O(n)) 解决方案将是自然目标，而在每次删除后重复扫描整个数组可能会变为 (O(n^2))。 

在某些情况下，粗心的实施可能会产生错误的结果。 首先，单词必须完全匹配。 为了`tapioka cake tapiokas`，正确的输出是`cake tapiokas`。 基于子字符串的替换可能会错误地处理`tapiokas`包含可移除单词`tapioka`，这将删除应该保留的单词。 

其次，所有可移动的单词都可能消失。 为了`tapioka bubble tapioka`，每个单词都是可移动的，所以正确的输出是`nothing`。 简单地连接剩余列表的解决方案将产生一个空行。 

第三，残存单词的顺序不得改变。 为了`bubble ramen cake`，正确的输出是`ramen cake`。 就地过滤或构建新列表都可以，但排序或以其他方式重新排列单词会违反所需的顺序。 

## 方法

 直接的暴力解释是重复查看当前列表，删除每个等于的单词`bubble`或者`tapioka`，并继续，直到没有可移除的单词剩余。 这是正确的，因为每个出现的单词最终都会被删除，而其他所有单词都会被保留。 如果只有三个单词，最坏的情况最多执行 3 次全扫描，每次最多检查 3 个位置，因此最多有 9 个单词比较。 这个版本在实际限制下不可能变得太慢。 

然而，如果我们想象对 (n) 个单词进行相同的操作，那么在最坏的情况下，删除后重复扫描可能需要 (O(n^2)) 次比较。 这个问题的结构给了我们一个更简单的观察：删除一个单词并不影响是否应该删除任何其他单词。 每个单词可以通过检查它是否完全正确来独立分类`bubble`或者确切地说`tapioka`。 这意味着根本不需要模拟移除。 

最优解是一次性通过这三个单词。 如果一个单词是可移动的，我们会跳过它。 否则，我们将其附加到答案中。 最后，空答案被替换为`nothing`。 这将问题的广义版本减少为线性时间，并且比重复修改输入更简单。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2)) 在广义版本中，这里最多 9 次比较 | (O(n)) | (O(n)) | 此处接受 |
 | 最佳 | (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 这里 (n=3) 是针对实际问题，因此两种方法都足够快。 一次性版本更可取，因为它的正确性直接来自于每个单词的独立处理。 

## 算法演练

 1. 读取单个输入行并将其拆分为三个单词。 按空格分割为我们提供了单独的盘子组件，而无需手动处理字符位置。 
2. 为属于实际菜肴的单词创建一个空列表。 
3. 检查每个输入单词一次。 如果确实如此`bubble`或者确切地说`tapioka`，丢弃它。 否则，将其附加到结果列表中。 精确相等是必要的，因为诸如此类的词`tapiokas`必须生存。 
4. 三个单词全部处理完毕后，检查结果列表是否为空。 如果为空则打印`nothing`，因为整道菜都是由可移动的单词组成的。 
5. 否则，用单个空格连接剩余的单词并打印它们。 由于单词是按其原始顺序附加的，因此输出顺序会自动正确。 

### 为什么它有效

 处理输入的任何前缀后，结果列表恰好包含该前缀中既不是的单词`bubble`也不`tapioka`，按其原始顺序。 当下一个单词可移动时，跳过它会保留此属性。 当下一个单词不可移除时，附加它也会保留该属性。 处理完所有三个单词后，结果将准确包含每个所需的单词，并且没有可删除的单词。 如果结果为空，则每个输入单词都是可移动的，所以`nothing`正是所需的输出。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    words = input().split()

    result = []

    for word in words:
        if word != "bubble" and word != "tapioka":
            result.append(word)

    if result:
        print(" ".join(result))
    else:
        print("nothing")

if __name__ == "__main__":
    solve()
```输入被读取为一行并分成单独的单词，与菜肴名称恰好包含三个单词的事实相匹配。 这`result`列表仅存储在算法过滤步骤中幸存下来的单词。 

该条件使用精确的字符串相等而不是子字符串检查。 这是实现的微妙部分：`tapiokas`,`bubbletea`，以及包含可移除单词的其他单词仍然是有效的菜肴单词，并且必须保持不变。 

该循环对每个单词只处理一次，因此不存在可能引入差一错误的索引操作或删除操作。 Python的字符串直接比较，没有数值计算，所以整数溢出是无关紧要的。 

最后，检查`if result`区分两种可能的输出形式。 非空结果用空格连接，而空结果则变为`nothing`。 

## 工作示例

 ### 示例 1

 对于输入`bubble tea pizza`，第一个单词可移除，而其他两个单词则保留。 

| 词| 可拆卸的？ | 步骤后的结果 |
 | ---| ---| ---|
 |`bubble`| 是的 |`[]`|
 |`tea`| 没有 |`[`茶`]`|
 |`pizza`| 没有 |`[`茶`, `比萨`]`|

 最终名单包含`tea`和`pizza`，因此将其与空格连接会产生`tea pizza`。 这表明过滤保留了幸存单词的原始顺序。 

### 示例 2

 对于输入`tapioka cake tapiokas`，第一个单词被删除。 第二个和第三个词之所以保留下来是因为`cake`与木薯粉无关并且`tapiokas`不完全是`tapioka`。 

| 词| 可拆卸的？ | 步骤后的结果 |
 | ---| ---| ---|
 |`tapioka`| 是的 |`[]`|
 |`cake`| 没有 |`[`蛋糕`]`|
 |`tapiokas`| 没有 |`[`蛋糕`, `木薯粉`]`|

 最终输出是`cake tapiokas`。 该跟踪明确确认比较必须针对完整单词而不是子字符串。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n)) | (O(n)) | 每个输入单词都被检查一次，此处为 (n=3)。 |
 | 空间| (O(n)) | (O(n)) | 幸存的单词存储在结果列表中。 |

 对于实际问题，(n) 始终为 3，并且每个单词最多有 32 个字符，因此该算法仅执行少量字符串比较，并且使用的内存可以忽略不计。 它在给定的范围内舒适。 

## 测试用例```python
import sys
import io

def solve(inp: str) -> str:
    words = inp.split()

    result = []
    for word in words:
        if word != "bubble" and word != "tapioka":
            result.append(word)

    if result:
        return " ".join(result)
    return "nothing"

# Provided samples
assert solve("bubble tea pizza") == "tea pizza", "sample 1"
assert solve("tapioka cake tapiokas") == "cake tapiokas", "sample 2"
assert solve("tapioka jasmine tea") == "jasmine tea", "sample 3"
assert solve("tapioka bubble tapioka") == "nothing", "sample 4"

# Minimum-size style case: three words with two removable words.
assert solve("bubble tapioka cake") == "cake", "two removable words"

# All three words are removable.
assert solve("tapioka tapioka tapioka") == "nothing", "all removable"

# Exact-word boundary: tapiokas must not be removed.
assert solve("bubble tapiokas bubble") == "tapiokas", "exact word matching"

# Maximum word length and non-removable words.
w = "a" * 32
x = "b" * 32
assert solve(f"bubble {w} {x}") == f"{w} {x}", "maximum word length"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`bubble tapioka cake`|`cake`| 多个可移动单词和单个幸存单词 |
 |`tapioka tapioka tapioka`|`nothing`| 每个字都被删除了|
 |`bubble tapiokas bubble`|`tapiokas`| 精确匹配而不是子串匹配 |
 |`bubble`接下来是两个 32 个字母的单词 | 两个长字| 普通单词的最大字长和保存 |

 ## 边缘情况

 第一个重要的边缘情况是每个单词都可以删除。 为了`tapioka bubble tapioka`，循环跳过所有三个单词，留下`result`空的。 最终检查检测到这一点并打印`nothing`而不是打印空行。 

第二种边缘情况是精确的单词匹配。 为了`tapioka cake tapiokas`，第一个词满足`word == "tapioka"`并被删除。 这个词`tapiokas`比较失败并附加到结果中。 最终输出是`cake tapiokas`。 子字符串替换，例如替换每个出现的`"tapioka"`行内会错误地损坏该单词。 

第三种边缘情况是可移动单词可以出现在普通单词旁边任何允许的位置。 为了`bubble tapiokas bubble`，第一个和第三个单词被丢弃，而中间的单词保留。 该算法产生`tapiokas`，表明它不依赖于将可移动单词限制在一个特定位置。 

第四种边缘情况是最大字长。 对于32个字符的普通字，比较逻辑根本没有改变。 由于Python直接处理完整的字符串，因此字长只会影响字符串比较的较小成本，并且不会产生任何边界问题。
