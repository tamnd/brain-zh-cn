---
title: "CF 994A - 指纹"
description: "输入描述了固定的数字序列，例如记录的键盘历史记录，以及与带有指纹的按键相对应的一组单独的数字。"
date: "2026-06-17T00:08:50+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 994
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 488 by NEAR (Div. 2)"
rating: 800
weight: 994
solve_time_s: 251
verified: true
draft: false
---

[CF 994A - Fingerprints](https://codeforces.com/problemset/problem/994/A)

 **评分：** 800
 **标签：** 实施
 **Solve time:** 4m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入描述了固定的数字序列，例如记录的键盘历史记录，以及与带有指纹的按键相对应的一组单独的数字。 任务是通过从左到右扫描原始序列并仅保留那些密钥被标记为指纹的数字来重建可以形成的最长的代码。 The relative order of kept digits must not change, and you are not allowed to reorder or skip arbitrarily beyond filtering.

 So the output is simply the original sequence filtered by membership in the fingerprint set, preserving the original ordering.

 约束非常小，序列长度和指纹数字的数量都以 10 为界。这立即告诉我们，从线性过滤到二次或强力子集检查的任何解决方案都可以立即运行，而且预期的解决方案可能是一个简单的实现任务，而不是搜索问题。 

一些边缘情况以微妙的方式发挥着重要作用。 

If no digit in the sequence is fingerprinted, the output is empty. For example, sequence`3 4 5`带指纹设置`1 2 7`什么也不产生。 A naive implementation that assumes at least one match and prints without checking could accidentally output garbage or an extra space.

 If all digits are fingerprinted, the output is the original sequence unchanged. 例如，序列`1 2 3`带指纹设置`1 2 3`必须准确地再现完整的序列。 

另一个极端情况是指纹集可能不会按排序顺序出现，或者可能与序列顺序不对齐。 例如，序列`5 1 0 7`有指纹`0 1 7`必须产生`1 0 7`，不是按数字值排序，而是按序列中的出现排序。 

## 方法

 考虑该问题的一种强力方法是考虑给定序列的每个子序列并检查其所有元素是否包含在指纹集中。 在这些有效子序列中，我们选择最长的一个。 这是有效的，因为它明确地探索了所有可能性，但长度为 n 的序列的子序列数量为 2ⁿ，即使这里 n 很小，它也会快速增长。 每次有效性检查还需要扫描元素，因此这成为不必要的开销。 

关键的观察是我们实际上根本不需要在子序列中搜索。 该问题不会施加任何额外的约束，例如最大化词典顺序或在冲突的选项中进行选择。 唯一的要求是必须允许每个选定的数字并保留该顺序。 这消除了任何组合选择：对于序列中的每个位置，我们仅根据指纹集中的成员身份独立决定是否保留它。 

因此，问题简化为单个线性传递：按集合成员资格过滤元素。 

蛮力方法在概念上是可行的，因为它枚举了所有可能性，但由于指数增长而效率较低。 不同位置的决策之间不存在依赖性的观察结果将任务转换为每个元素的简单成员资格测试，使用集合的时间复杂度为 O(1)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2ⁿ·n) | O(2ⁿ·n) | O(n) | 太慢了 |
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取序列长度、指纹计数、序列本身和指纹数字。 目标是快速识别允许使用哪些数字。 
2. 将指纹数字存储在哈希集中。 这样做是为了可以在恒定时间内回答对数字的成员资格查询。 
3. 从左到右迭代原始序列。 对于每个数字，检查它是否存在于指纹集中。 
4. 如果该数字在集合中，则将其附加到输出序列中。 如果没有，就完全忽略它。 
5. 处理完所有数字后，打印结果过滤序列，并用空格分隔。 如果没有收集到任何内容，则输出空行。 

此过程背后的原因是序列中的每个位置都是独立的。 是否包含数字仅取决于是否允许，而不取决于之前或之后的数字。 

### 为什么它有效

 构造的输出恰好包含原始序列中满足指纹条件的那些元素。 由于我们从左到右迭代而不重新排序，因此会自动保留相对顺序。 不可能产生比这个更长的有效序列，因为每个有效子序列只能使用已经按顺序出现的数字，并且我们单独包含每个有效候选序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    allowed = set(map(int, input().split()))

    res = []
    for x in a:
        if x in allowed:
            res.append(str(x))

    print(" ".join(res))

if __name__ == "__main__":
    solve()
```该解决方案使用快速 I/O 读取输入以避免开销，但考虑到限制，这并不是绝对必要的。 

指纹数字存储在称为`allowed`，这使得 O(1) 成员资格检查成为可能。 这是中心优化，取代了搜索或嵌套循环的任何需要。 

循环结束`a`是直接过滤器。 每个数字仅在保留时才转换为字符串，因为最终输出格式需要空格分隔的整数。 

连接操作正确处理非空和空输出。 如果`res`是空的，`" ".join(res)`产生一个空字符串，满足不打印任何内容或空行的要求。 

## 工作示例

 考虑样本序列`7 5 3 1 6 2 8`有指纹数字`1 2 7`。 

在每一步我们都会检查成员资格：

 | 索引 | 数字| 在指纹中| 迄今为止的输出 |
 | ---| ---| ---| ---|
 | 0 | 7 | 是的 | 7 |
 | 1 | 5 | 没有| 7 |
 | 2 | 3 | 没有| 7 |
 | 3 | 1 | 是的 | 7 1 |
 | 4 | 6 | 没有| 7 1 |
 | 5 | 2 | 是的 | 7 1 2 | 7 1 2
 | 6 | 8 | 没有| 7 1 2 | 7 1 2

 最终输出是`7 1 2`，证明顺序被保留，而过滤纯粹是每个元素本地的。 

现在考虑一个构造的例子：序列`4 0 9 1`有指纹`0 1`。 

| 索引 | 数字| 在指纹中| 迄今为止的输出 |
 | ---| ---| ---| ---|
 | 0 | 4 | 没有| |
 | 1 | 0 | 是的 | 0 |
 | 2 | 9 | 没有| 0 |
 | 3 | 1 | 是的 | 0 1 |

 这证实了该算法可以正确处理有效数字与无效数字交织的情况，而不会丢失顺序。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 单次遍历序列，每个元素进行 O(1) 成员资格检查 |
 | 空间| O(米) | 设置存储指纹数字|

 输入范围非常小，因此这种线性扫描远远低于任何性能限制。 即使对于更大的约束，由于恒定时间过滤，该方法仍将保持高效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    allowed = set(map(int, input().split()))

    res = []
    for x in a:
        if x in allowed:
            res.append(str(x))
    print(" ".join(res))

assert run("7 3\n3 5 7 1 6 2 8\n1 2 7\n") == "7 1 2", "sample 1"
assert run("3 2\n1 2 3\n4 5\n") == "", "no matches"
assert run("4 3\n1 2 3 4\n1 2 3\n") == "1 2 3", "prefix match"
assert run("5 2\n9 8 7 6 5\n5 9\n") == "9 5", "scattered matches"
assert run("1 1\n0\n0\n") == "0", "single element"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 3 2 / 1 2 3 / 4 5 | 3 2 / 1 2 3 / 4 5 空 | 无有效数字情况 |
 | 4 3 / 1 2 3 4 / 1 2 3 | 4 3 / 1 2 3 4 / 1 2 3 1 2 3 | 1 2 3 部分前缀保留 |
 | 5 2 / 9 8 7 6 5 / 5 9 | 5 2 / 9 8 7 6 5 / 5 9 9 5 | 非单调选择|

 ## 边缘情况

 当没有数字与指纹集匹配时，算法将构建一个空的结果列表。 例如，输入`3 2 / 3 4 5 / 1 2`从不触发任何追加，所以`res`保持为空，打印时会根据需要生成一个空行。 

当每个数字都匹配时，例如`4 4 / 1 2 3 4 / 1 2 3 4`，每次迭代都会附加到结果中。 最终输出完全反映了输入序列，确认过滤不会扭曲顺序。 

当匹配稀疏且分离时，例如`6 2 / 1 0 1 0 1 0 / 1 0`，算法在追加和跳过之间交替。 每个决策都是局部的，因此输出变为`1 0 1 0 1 0`，保留完整的结构，无需任何回溯或重建。
