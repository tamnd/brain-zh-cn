---
title: "CF 70B - 短信"
description: "我们给出了一条 SMS 消息的最大长度和一个由空格分隔的句子组成的完整文本。 句子始终以 .、? 或 ! 之一结尾。 单词仅包含字母。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "expression-parsing", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 70
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 64"
rating: 1600
weight: 70
solve_time_s: 99
verified: true
draft: false
---

[CF 70B - 短信](https://codeforces.com/problemset/problem/70/B)

 **评分：** 1600
 **标签：** 表达式解析、贪心、字符串
 **求解时间：** 1m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一条 SMS 消息的最大长度和一个由空格分隔的句子组成的完整文本。 一个句子总是以其中之一结尾`.`,`?`， 或者`!`。 单词仅包含字母。 

任务是将文本分割成尽可能少的消息，这样消息之间就不会出现句子中断的情况。 如果消息符合长度限制，则消息可以包含多个连续的句子。 当两个连续的句子被放入不同的消息中时，分隔空间就会消失，因为 Fangy 根本不输入它。 

这个关于空间的细节就是问题的全部技巧。 在一封邮件中，原始空格必须保留。 在两个不同的消息之间，可以省略分隔空间。 

文本长度最多为`10^4`，对于线性或二次处理来说足够小。 由于留言限制`n`至多是`255`，检查句子长度是微不足道的。 立方解决方案已经存在风险，因为重复重建子串或重新计算长度可能会将操作数推至数千万或数亿。 干净的贪婪或动态规划解决方案更合适。 

第一个重要的边缘情况是单个句子已经超过消息限制。 

输入：```
5
Hello!
```这句话`"Hello!"`有长度`6`，因此不存在有效的分割。 

正确输出：```
Impossible
```粗心的实现可能只检查组合消息长度而忘记验证单个句子。 

另一个微妙的情况是消息之间消失的空间。 

输入：```
7
Hi. Bye.
```整个文本有长度`8`，但仍然可以通过两条消息发送：`"Hi."`和`"Bye."`正确输出：```
2
```总是计算句子之间空格的实现会错误地认为这是不可能的。 

当几个短句子一起超过限制恰好一个分隔空格时，就会出现一种更棘手的情况。 

输入：```
10
Hi. Hello.
```

`"Hi. Hello."`有长度`10`，因此它适合一条消息。 

如果极限是`9`，我们需要两条消息，因为当两个句子放在一起时，内部空间必须保留。 

正确输出为`n = 9`：```
2
```内部空间和移除的边界空间之间的这种区别是许多差一错误发生的地方。 

## 方法

 蛮力的想法很简单。 首先将文本分成句子。 然后尝试将连续句子分组为消息的每一种可能，并使用动态规划计算消息的最小数量。 

假设有`k`句子。 一个天真的 DP 可以定义`dp[i]`作为第一条消息所需的最小数量`i`句子。 对于每一个`i`，我们尝试之前的每一个位置`j`并检查句子是否`j...i-1`适合一条消息。 

昂贵的部分是重复计算一个组的长度。 如果我们每次都重建子串或重新计算空格，则每次转换可能会花费`O(k)`，产生一个`O(k^3)`解决方案。 与周围`10^4`字符，句子的数量也可能足够大，以至于变得太慢。 

关键的观察是句子长度就是我们实际需要的。 一旦文本被解析为句子长度，检查几个连续的句子是否组合在一起就变成了一个简单的算术表达式。 

假设句子长度为：```
len[0], len[1], ..., len[k-1]
```如果我们放置句子`l...r`到一条消息中，总长度变为：```
sum(len[l...r]) + (r - l)
```额外的`(r - l)`来自同一消息内连续句子之间的空格。 不同消息之间的空格消失并且不被计算在内。 

现在问题变得简单多了。 我们只需要把序列分成最少的组，使得每组的总长度不超过`n`。 

此时，贪婪就变得自然了。 从当前句子开始，我们应该将尽可能多的连续句子打包到当前消息中。 留下未使用的空间永远不会有帮助，因为所有未来的句子仍然必须放置在某个地方。 采用最大有效前缀可以最大限度地减少组数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k³) | O(k) | 太慢了 |
 | 最佳| O( | 文本 | ) |

 ## 算法演练

 1. 解析文本并提取每个句子的长度。 

我们逐个字符地扫描字符串。 每次我们遇到`.`,`?`， 或者`!`，我们完成一句话。 句子长度包括从开头到标点符号的每个字符。 
2. 检查单个句子长度是否超过`n`。 

即使一个句子太大，也不存在有效的排列，因为句子无法跨消息拆分。 
3. 开始贪婪地构建消息。 

维护当前消息长度和迄今为止使用的消息数量。 
4. 将第一句话放入当前消息中。 

由于我们已经验证了每个句子都单独适合，因此这总是可能的。 
5. 对于接下来的每个句子，确定它是否可以加入当前消息。 

如果当前消息已包含某些内容，则添加另一句话需要一个额外的空格。 因此增加的成本变为：```
1 + next_sentence_length
```6. 如果新的总数不超过`n`，将句子附加到当前消息中。 

这样可以保持消息数量不变，同时最大限度地利用当前消息。 
7. 否则，用这句话开始新消息。 

分隔空间消失了，因为句子现在处于不同的消息中。 
8. 处理完所有句子后，输出所使用的消息数。 

### 为什么它有效

 贪婪选择是最优的，因为消息仅包含连续的句子。 假设当前消息仍然可以容纳另一个句子。 提前拆分而不是添加这句话只会浪费可用空间，并且无法创造更多的未来机会。 后面的每个句子都必须仍然出现在当前句子之后，因此延迟拆分永远不会增加所需的消息数量。 

该算法保持当前消息包含符合限制的最大可能数量的连续句子的不变量。 由于每条消息都被最大程度地打包，因此消息总数最少。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    text = input().rstrip()

    sentences = []

    start = 0

    for i, ch in enumerate(text):
        if ch in ".?!":
            sentences.append(i - start + 1)

            if i + 1 < len(text):
                start = i + 2

    for length in sentences:
        if length > n:
            print("Impossible")
            return

    messages = 1
    current = sentences[0]

    for length in sentences[1:]:
        if current + 1 + length <= n:
            current += 1 + length
        else:
            messages += 1
            current = length

    print(messages)

solve()
```第一部分扫描文本并提取句子长度。 变量`start`存储当前句子开始的索引。 每当找到标点符号时，句子长度就是：```
i - start + 1
```一个句子结束后，下一个句子会在两个位置后开始，因为语法保证连续句子之间恰好有一个分隔空间。 

第二个循环检查可行性。 这必须在贪婪打包阶段之前发生，因为单个过大的句子立即使任务变得不可能。 

贪心构造仅保留当前消息长度。 当附加另一个句子时，我们为内部空间添加一个额外的字符：```
current + 1 + length
```仅当两个句子位于同一消息中时才计算此空格。 开始一条新消息会将长度重置为单独的新句子。 

一个微妙的边界条件是初始化：```
messages = 1
current = sentences[0]
```保证文本至少包含一个句子，因此这始终是安全的。 

## 工作示例

 ### 示例 1

 输入：```
25
Hello. I am a little walrus.
```提取的句子长度：```
[6, 21]
```| 步骤| 当前句子长度 | 当前消息长度 | 行动| 留言 |
 | --- | --- | --- | --- | --- |
 | 开始| 6 | 6 | 开始第一条消息 | 1 |
 | 下一页 | 21 | 21 6 |`6 + 1 + 21 = 28 > 25`, 开始新消息| 2 |

 最终答案：```
2
```这条痕迹显示了为什么分隔空间很重要。 组合长度变为`28`因为如果将两个句子放在一起，则需要一个内部空间。 

### 示例 2

 输入：```
7
Hi. Bye.
```提取的句子长度：```
[3, 4]
```| 步骤| 当前句子长度 | 当前消息长度 | 行动| 留言 |
 | --- | --- | --- | --- | --- |
 | 开始| 3 | 3 | 开始第一条消息 | 1 |
 | 下一页 | 4 | 3 |`3 + 1 + 4 = 8 > 7`, 开始新消息| 2 |

 最终答案：```
2
```此示例演示了消息之间的空格消失的规则。 虽然原文长度是`8`，两个单独的消息是有效的，因为省略了分隔空格。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O( | 文本 |
 | 空间| O(k) | 存储句子长度`k`句子|

 输入长度最多为`10^4`，因此线性扫描速度非常快。 内存使用量也很小，因为我们每个句子只存储一个整数。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    text = input().rstrip()

    sentences = []

    start = 0

    for i, ch in enumerate(text):
        if ch in ".?!":
            sentences.append(i - start + 1)

            if i + 1 < len(text):
                start = i + 2

    for length in sentences:
        if length > n:
            return "Impossible"

    messages = 1
    current = sentences[0]

    for length in sentences[1:]:
        if current + 1 + length <= n:
            current += 1 + length
        else:
            messages += 1
            current = length

    return str(messages)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return solve()

# provided sample
assert run("25\nHello. I am a little walrus.\n") == "2", "sample 1"

# impossible because one sentence is too long
assert run("5\nHello!\n") == "Impossible", "single oversized sentence"

# exactly fits into one message
assert run("10\nHi. Hello.\n") == "1", "boundary fit"

# requires split because of one extra space
assert run("9\nHi. Hello.\n") == "2", "space handling"

# minimum size style case
assert run("2\nA.\n") == "1", "smallest valid sentence"

# many short sentences
assert run("3\nA. B. C.\n") == "3", "every sentence isolated"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`5 / Hello!`|`Impossible`| 检测超大句子 |
 |`10 / Hi. Hello.`|`1`| 精确边界拟合 |
 |`9 / Hi. Hello.`|`2`| 内部空间计算正确 |
 |`2 / A.`|`1`| 最小有效输入|
 |`3 / A. B. C.`|`3`| 频繁的消息分割 |

 ## 边缘情况

 考虑不可能的情况：```
5
Hello!
```解析器提取一个长度的句子`6`。 自从`6 > 5`，算法立即打印：```
Impossible
```不会发生贪婪打包，因为输入已经无效。 

现在考虑空间消失的情况：```
7
Hi. Bye.
```提取的句子长度为`[3, 4]`。 

该算法排名第一`"Hi."`进入当前消息。 当尝试追加时`"Bye."`，所需长度变为：```
3 + 1 + 4 = 8
```这超出了限制，因此开始一条新消息。 消息之间的分隔空间不再被计算，从而准确地生成两条有效消息。 

最后，检查边界条件：```
10
Hi. Hello.
```长度是`[3, 6]`。 

附加第二句给出：```
3 + 1 + 6 = 10
```由于允许相等，因此两个句子会一起出现在一条消息中。 这证实了该算法可以正确处理精确拟合，而不会出现相差一的错误。
