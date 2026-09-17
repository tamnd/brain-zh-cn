---
title: "CF 105586A - \u6f14\u594f\u6625\u65e5\u5f71"
description: "我们得到了一个简短的以字符串表示的歌曲播放列表。 每根弦都是原始音乐会时间表中的一个节目项目。 该任务模拟从上到下阅读此时间表时应用的简单规则。"
date: "2026-06-22T14:44:03+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105586
codeforces_index: "A"
codeforces_contest_name: "\u201c\u534e\u4e3a\u676f\u201d 2024 \u5e74\u5e7f\u4e1c\u5de5\u4e1a\u5927\u5b66 ACM \u65b0\u751f\u7a0b\u5e8f\u8bbe\u8ba1\u7ade\u8d5b\uff08\u51b3\u8d5b\uff09"
rating: 0
weight: 105586
solve_time_s: 49
verified: true
draft: false
---

[CF 105586A - \u6f14\u594f\u6625\u65e5\u5f71](https://codeforces.com/problemset/problem/105586/A)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个简短的以字符串表示的歌曲播放列表。 每根弦都是原始音乐会时间表中的一个节目项目。 

该任务模拟从上到下阅读此时间表时应用的简单规则。 每当表演者看到确切的字符串时`"Tomori"`，她立即插入一首额外的歌曲`"Haruhikage"`就在最终输出中的它之后。 所有其他字符串均按原样复制并保持其原始顺序。 

所以输出不仅仅是输入列表的副本。 它是一个转换后的列表，其中一些条目根据其值扩展为两个连续条目。 

输入大小非常小，最多 100 个字符串，每个字符串的长度最多 20。这消除了对直接线性处理之外的性能优化的任何担忧。 对输入进行一次传递就足够了。 

唯一的微妙之处是匹配必须准确且区分大小写。 字符串像`"TOMORI"`或者`"tomori"`不触发插入。 尝试不区分大小写的比较或子字符串匹配的简单方法会默默地产生不正确的输出。 

第二个极端情况是当`"Tomori"`连续出现。 在这种情况下，每次发生都会独立触发插入，因此多个`"Haruhikage"`行可能按顺序出现。 

## 方法

 思考这个问题的一个直接方法是明确地构建最终列表。 我们将所有字符串读入一个数组，然后迭代它并将每个字符串附加到结果列表中。 每当我们遇到`"Tomori"`，我们还附加`"Haruhikage"`紧随其后。 

这种方法在结构上已经是最优的。 强力解释是使用移动元素的操作（例如插入数组的中间）重复重建或插入到不断增长的列表中。 这会导致不必要的开销：每次插入基于数组的结构都会花费 O(n)，并且在最坏的情况下，每个元素都是`"Tomori"`，我们将执行 O(n) 次插入，从而产生 O(n^2) 行为。 

关键的观察是我们永远不需要修改中间的结构。 我们只需要以流的方式发出输出。 这将问题转化为单个线性扫描，其中每个输入元素贡献一个或两个输出元素。 

问题的结构保证了元素之间的独立性。 每条线都可以在不了解未来或过去值的情况下进行处理，从而消除了对复杂数据结构的任何需要。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（重复插入数组/列表）| O(n^2) | O(n^2) | O(n) | 不必要，但适用于小 n |
 | 最佳（单遍追加/输出）| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取整数`n`，表示后面有多少个字符串。 
2. 对于接下来的每一个`n`行，读取字符串`s`。 
3.立即输出`s`。 
4.如果`s`正好等于`"Tomori"`，输出附加行`"Haruhikage"`就在它之后。 

立即输出背后的原因是转换仅取决于当前元素。 不依赖于未来的元素，因此延迟处理没有任何好处。 

### 为什么它有效

 该算法保持一个简单的不变量：处理第 i 个输入字符串后，输出完全包含根据规则的前 i 个字符串的转换版本，而没有其他内容。 由于每个字符串都是独立处理的并且顺序被保留，因此连接所有局部转换会产生正确的全局结果。 不需要重新排序或缓冲，因为转换永远不会改变相对顺序，仅在特定匹配之后插入固定字符串。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input().strip())

for _ in range(n):
    s = input().strip()
    print(s)
    if s == "Tomori":
        print("Haruhikage")
```实现直接遵循算法。 使用快速 I/O 逐行处理输入。 每个字符串都去除尾随换行符以确保精确比较。 条件检查是直接相等测试，强制区分大小写。 

关键的实现细节是立即打印而不是存储结果。 虽然存储在列表中也可以，但考虑到较小的限制和流输出的简单性，这是没有必要的。 

## 工作示例

 ### 示例 1

 输入：```
3
Tomori
Neko
Tomori
```我们按顺序处理每个字符串。 

| 步骤| 输入字符串| 迄今为止的输出 |
 | --- | --- | --- |
 | 1 | 托莫里 | 友守春日影 |
 | 2 | 猫 | 友森春日影猫 |
 | 3 | 托莫里 | 托森春日影 Neko 托森春日影 |

 第一个和第三个字符串触发插入规则，所以`"Haruhikage"`在输出中出现两次。 

这表明每个事件都是独立处理的，步骤之间没有任何共享状态。 

### 示例 2

 输入：```
4
TOMORI
Tomori
Tomo
Haruhikage
```| 步骤| 输入字符串| 迄今为止的输出 |
 | --- | --- | --- |
 | 1 | 托莫里 | 托莫里 |
 | 2 | 托莫里 | 托森春日影 | 托森春日影 | 托森春日影
 | 3 | 托莫 | 友森 春日影 友 | 友森
 | 4 | 春日影 | 托莫里 托莫春日影 | 托莫春日影 | 托莫春日影

 只有准确的`"Tomori"`匹配触发器插入。 这证实了子字符串匹配和大小写变化被正确忽略。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个字符串读取一次并使用 O(1) 比较和输出操作进行处理 |
 | 空间| O(1) 辅助 | 除了当前输入字符串之外，不需要其他数据结构 |

 对于 n 高达 100 的情况，线性扫描很容易就足够了，甚至可以轻松地扩展到远远超出问题限制的范围。 除了输入缓冲之外，内存使用量保持不变。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        n = int(sys.stdin.readline().strip())
        for _ in range(n):
            s = sys.stdin.readline().strip()
            print(s)
            if s == "Tomori":
                print("Haruhikage")
    return out.getvalue().strip()

# provided sample-style tests
assert run("3\nTomori\nNeko\nTomori\n") == "Tomori\nHaruhikage\nNeko\nTomori\nHaruhikage"

# single non-trigger case
assert run("2\nNeko\nRikki\n") == "Neko\nRikki"

# case sensitivity check
assert run("3\nTOMORI\nTomori\ntomori\n") == "TOMORI\nTomori\nHaruhikage\ntomori"

# consecutive triggers
assert run("2\nTomori\nTomori\n") == "Tomori\nHaruhikage\nTomori\nHaruhikage"

# minimum case
assert run("1\nTomori\n") == "Tomori\nHaruhikage"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3线混合| 扩展与插入| 基本变换正确性 |
 | 没有托莫里 | 输出不变| 基线传递行为|
 | 案例变体 | 仅精确匹配触发器| 区分大小写 |
 | 连续托莫里| 重复插入处理| 事件的独立性|
 | 单元素| 最小边界情况| n=1 时的正确性 |

 ## 边缘情况

 一种重要的情况是根本没有匹配的字符串。 例如，如果输入是：```
2
Neko
Rikki
```该算法只是将每一行打印一次并且不执行任何插入。 由于条件永远不会满足，因此不会出现额外的输出，并且输出与输入序列相同。 

另一种情况是连续的`"Tomori"`条目：```
2
Tomori
Tomori
```该算法首先处理`"Tomori"`并立即打印`"Haruhikage"`，然后独立处理第二个并再次执行相同操作。 这两个步骤之间没有交互，因此结果正确包含两条插入的行。 

第三种情况是视觉上类似于触发器但大小写不同的字符串：```
1
TOMORI
```由于比较是精确的，因此条件失败并且不会产生额外的输出。 这证实了相等性检查是严格的并且不依赖于模式匹配或规范化。
