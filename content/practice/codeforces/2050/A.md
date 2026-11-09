---
title: "CF 2050A - 断线"
description: "我们得到一个单词列表和一个可以容纳一定数量字符的固定长度条带。 任务是决定我们可以在不超过其长度的情况下在第一个条上连续放置多少个单词，而剩余的单词则放在第二个条上，该条具有......"
date: "2026-06-08T08:46:56+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2050
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 991 (Div. 3)"
rating: 800
weight: 2050
solve_time_s: 95
verified: true
draft: false
---

[CF 2050A - 换行符](https://codeforces.com/problemset/problem/2050/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 1m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个单词列表和一个可以容纳一定数量字符的固定长度条带。 任务是决定我们可以在第一个条带上连续放置多少个单词而不超过其长度，而剩余的单词则放在实际上具有无限空间的第二个条带上。 单词必须连续书写，不能有空格，单词之间不能分开。 输出是适合第一个条带的最大单词数。 

查看约束，我们发现每个测试用例最多有 50 个单词，每个单词最多 10 个字符长，条带最多可容纳 500 个字符。 这足够小，可以考虑一个简单的迭代解决方案，其中我们将字长一一相加，因为即使在最坏的情况下，我们最多也会对每个测试用例进行 50 次添加，并且最多有 1000 个测试用例。 因此，一个简单的解决方案将足够快。 

要考虑的边缘情况包括第一个单词本身比条带长的情况，这意味着可以容纳零个单词。 另一个微妙的情况是所有单词的长度之和恰好等于条带长度。 粗心的实现可能会在添加最后一个单词之前停止，从而产生相差一错误。 

## 方法

 蛮力方法迭代单词，保持它们长度的连续总和。 对于每个单词，我们检查添加它是否会超出条带长度。 如果是，我们会停止并返回到目前为止添加的单词数。 这种方法是正确的，因为它尊重单词的顺序，并且当我们无法容纳下一个单词时就停止。 每个测试用例的复杂度为 O(n)，或者最多 50 次操作，这对于我们的约束是可以接受的。 

在这种情况下，最佳方法实际上是相同的，因为问题很小并且不需要更快的方法。 关键的见解是认识到我们只需要对带有运行总数的单词进行一次传递。 不需要动态规划或二分搜索，因为问题规模很小，并且求和计算很简单。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个测试用例 O(n) | O(1) | O(1) | 已接受 |
 | 最佳 | 每个测试用例 O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`和`m`，代表字数和条带长度。 
3. 初始化`current_length`到 0 和`count`至 0。 
4. 迭代列表中的每个单词：

 1. 测量单词的长度。 
2. 检查是否将此长度添加到`current_length`超过`m`。 
3. 如果不是，则将长度添加到`current_length`并增加`count`。 
4. 如果是，则中断循环，因为无法添加更多单词。 
5. 迭代完单词后，`count`包含适合的最大单词数。 
6. 打印该测试用例的结果。 

为什么有效：运行总计保证我们永远不会超过带材长度。 因为我们按顺序检查每个单词，所以我们确保所有选定的单词从一开始就是连续的。 不变的是`current_length`始终等于当前计算的单词长度之和，并且永远不会超过`m`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    words = [input().strip() for _ in range(n)]
    current_length = 0
    count = 0
    for word in words:
        length = len(word)
        if current_length + length <= m:
            current_length += length
            count += 1
        else:
            break
    print(count)
```代码首先读取测试用例的数量。 对于每个测试用例，它读取单词数和条带长度，然后读取单词本身。 我们维护字长的运行总和和计数器。 条件`current_length + length <= m`确保我们不超过剥离长度。 一旦单词溢出条带，循环就会中断，从而保证正确性并避免差一错误。 使用`input().strip()`从单词中删除换行符。 

## 工作示例

 **示例输入 1：**```
3 1
a
b
c
```| 词| 当前长度| 计数 | 行动|
 | --- | --- | --- | --- |
 | 一个 | 0 + 1 = 1 | 1 | 适合，继续 |
 | 乙| 1 + 1 = 2 | - | 超过1，停止|

 输出：`1`第一个单词适合，但添加第二个单词超出了条带长度，因此只计算一个单词。 

**示例输入 2：**```
2 9
alpha
beta
```| 词| 当前长度| 计数 | 行动|
 | --- | --- | --- | --- |
 | 阿尔法| 0 + 5 = 5 | 1 | 适合，继续 |
 | 测试版 | 5 + 4 = 9 | 5 + 4 = 9 2 | 完全适合，继续 |

 输出：`2`所有单词都完全适合条带，演示了总长度等于的边缘情况`m`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * t) | 每个测试用例都会迭代所有测试用例`n`总共 t 个测试用例 |
 | 空间| O(n) | 存储每个测试用例的单词 |

 给定约束（n ≤ 50，t ≤ 1000），该解决方案最多执行 50,000 次操作，完全在 1 秒的时间限制内。 内存使用量极低，刚好低于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        words = [input().strip() for _ in range(n)]
        current_length = 0
        count = 0
        for word in words:
            length = len(word)
            if current_length + length <= m:
                current_length += length
                count += 1
            else:
                break
        print(count)
    return output.getvalue().strip()

# Provided samples
assert run("5\n3 1\na\nb\nc\n2 9\nalpha\nbeta\n4 12\nhello\nworld\nand\ncodeforces\n3 2\nab\nc\nd\n3 2\nabc\nab\na\n") == "1\n2\n2\n1\n0", "sample 1"

# Custom cases
assert run("1\n1 1\na\n") == "1", "single word fits"
assert run("1\n1 1\nab\n") == "0", "single word too long"
assert run("1\n3 5\na\nb\nc\n") == "3", "all words fit"
assert run("1\n3 2\na\nb\nc\n") == "2", "exact fit before last word"
assert run("1\n2 5\nabc\nde\n") == "2", "sum equals m"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 个字适合 | 1 | 适合单词的最小输入 |
 | 1 个字太长 | 0 | 无法容纳单词的最小输入 |
 | 多个小词| 3 | 所有单词都很容易匹配 |
 | 多个字，最后太大 | 2 | 检查停在最后一个词 |
 | 总和等于条 | 2 | 精确贴合边缘外壳 |

 ## 边缘情况

 如果第一个单词本身超过`m`，算法返回`0`。 例如，输入`1 2\nabc`产生`0`因为`len("abc") = 3 > 2`。 如果多个单词的总和正好等于`m`，全部计算正确。 运行总和确保我们永远不会超过`m`，并且break语句可以防止任何过度计数。 该算法可以优雅地处理单字和空条。
