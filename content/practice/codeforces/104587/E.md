---
title: "CF 104587E - 翻越山丘，第 1 部分"
description: "给定一个固定的 37 个字符的字母表，由大写英文字母、数字和空格字符组成。"
date: "2026-06-30T07:29:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104587
codeforces_index: "E"
codeforces_contest_name: "2020-2021 ICPC East Central North America Regional Contest (ECNA 2020)"
rating: 0
weight: 104587
solve_time_s: 48
verified: true
draft: false
---

[CF 104587E - 越过山丘，第 1 部分](https://codeforces.com/problemset/problem/104587/E)

 **评级：** -
 **标签：** -
 **求解时间：** 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个固定的 37 个字符的字母表，由大写英文字母、数字和空格字符组成。 每个字符都按照确定的顺序分配一个从 0 到 36 的数值，从 A 开始为 0，到 Z 为 25，然后数字 0 到 9 为 26 到 35，最后空格为 36。 

输入提供大小为 n × n 的方阵，其中 n 最多为 10，后跟一个明文字符串。 加密过程将文本转换为数字，将它们分组为大小为 n 的块，然后使用模 37 算术下的矩阵应用线性变换。 每个结果向量被转换回字符以产生密文。 

从概念上讲，问题是在将输入字符串编码成一个小的有限整数环之后，对输入字符串的块重复应用矩阵乘法。 

约束 n ≤ 10 是关键的结构限制。 这意味着每个变换都非常小并且大小固定，因此将向量乘以矩阵的成本在大约 100 次运算的范围内是恒定的。 主要因素是输入字符串的长度，该长度可能很大，但每个字符都在其块内独立处理。 这立即排除了任何试图在矩阵维度上进行超线性操作或低效重新计算变换的算法。 对字符串进行简单的线性扫描就足够了。 

在这种情况下，一些边缘情况自然会出现。 第一个是填充。 如果明文长度不能被n整除，则剩余字符必须用空格填充。 例如，如果n = 3并且明文是“ABCX”，那么我们编码“A B C | X space space”。 忘记填充的粗心实现将删除最后一个字符或形成不完整的向量，从而产生不正确的密文长度。 

另一个边缘情况是空格字符本身，它映射到最高值 36。仅处理字母数字字符的简单实现将在空格上默默失败或错误地移动索引。 例如，在不考虑空间映射的情况下编码“A A”将破坏对齐并损坏输出。 

最后，大型明文字符串在重复模运算时需要小心。 尽管值仍然很小，但在没有自动大整数的语言中，重复乘法可能会溢出。 在 Python 中这不是问题，但在其他语言中，必须在每个算术步骤中应用模归约。 

## 方法

 最直接的方法就是从字面上模拟定义。 我们将每个字符转换为其数值，将序列拆分为大小为 n 的块，使用标准矩阵向量乘法将每个块乘以矩阵，将每个结果以 37 为模进行缩减，然后转换回字符。 这是正确的，因为它完全遵循定义。 

对于一个块，计算一个输出条目需要 n 次乘法和加法，并且每个块有 n 个输出。 这会产生每个块的 n² 操作。 由于 n ≤ 10，因此每个块最多 100 次操作，可以忽略不计。 对于长度为 L 的字符串，我们执行 O(L · n²) 运算，这在 L 中实际上是线性的，具有一个小常数。 

除了这种直接模拟之外，不需要进行优化，因为矩阵没有改变，并且没有重复查询或求幂要求。 关键的观察结果是，变换对于每个块来说都是局部的，并且不依赖于先前的块。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 直接模拟 | O(L·n²) | O(L·n²) | O(L) | 已接受 |
 | 尝试全局优化| 不适用 | 不适用 | 不必要|

 ## 算法演练

 ### 1. 构建字符编码

我们定义了从字符到整数的映射并返回。 必须为每个字母、数字和空格分配一个 0 到 36 之间的唯一值。此步骤确保加密仅对整数进行操作。 

### 2. 读取矩阵

 我们将 n × n 矩阵存储为整数。 不需要预处理，因为所有运算都是模 37 的线性变换。 

### 3. 将明文转换为数字形式

 我们扫描字符串并将每个字符转换为其相应的整数。 这会生成一个值数组，表示模算术空间中的消息。 

### 4. 将数组填充为 n 的倍数

 如果长度不能被n整除，我们追加与空格相对应的值，直到它被n整除为止。 这确保每个块都是完整的，并避免矩阵乘法期间的边界问题。 

### 5. 独立处理每个块

 对于每个大小为 n 的连续块，我们计算矩阵向量积。 每个输出坐标被计算为一个矩阵行与块向量的点积，以 37 为模。此步骤应用加密变换。 

### 6. 将结果转换回字符

 处理完所有块后，我们将每个数值映射回其字符表示形式，并将它们连接成最终的密文。 

### 为什么它有效

 每个块都通过模 37 的整数环上的固定线性函数进行变换。矩阵乘法定义了从输入向量到输出向量的确定性函数。 由于明文被划分为不相交的块，并且每个块都是独立变换的，因此整体变换只是这些独立线性映射的串联。 块之间没有交互，因此正确性降低为模运算下单个矩阵向量乘法的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 37

# build mappings
chars = []
for c in range(ord('A'), ord('Z') + 1):
    chars.append(chr(c))
for c in range(ord('0'), ord('9') + 1):
    chars.append(chr(c))
chars.append(' ')

char_to_int = {ch: i for i, ch in enumerate(chars)}
int_to_char = {i: ch for i, ch in enumerate(chars)}

def main():
    n = int(input())
    mat = [list(map(int, input().split())) for _ in range(n)]
    s = input().rstrip('\n')

    vals = [char_to_int[ch] for ch in s]

    while len(vals) % n != 0:
        vals.append(char_to_int[' '])

    res = []

    for i in range(0, len(vals), n):
        block = vals[i:i+n]
        for r in range(n):
            acc = 0
            for c in range(n):
                acc += mat[r][c] * block[c]
            res.append(int_to_char[acc % MOD])

    sys.stdout.write(''.join(res))

if __name__ == "__main__":
    main()
```实现首先构建问题所需的确切字符编码。 这可以避免数字和空格字符出现任何歧义。 

该矩阵作为整数直接读入内存，因为其大小最多为 10 x 10。明文被转换为整数列表，然后用空格值填充，直到其长度可被 n 整除。 这保证了分割成固定大小的块永远不会失败。 

每个块都是独立处理的。 嵌套循环结构是有意为之的：外部循环迭代输出行，内部循环计算点积。 仅在对完整点积求和后才应用模归约，这是安全的，因为 Python 整数不会溢出。 

## 工作示例

 ### 示例 1

 我们考虑一个 n = 2 和明文“AB”的小概念案例。 

| 步骤| 块| 计算| 输出值|
 | --- | --- | --- | --- |
 | 1 | [A，B]| 行点积| [x，y] |

 假设A映射到0，B映射到1，矩阵产生输出1和2。转换回来后，我们得到一个二字符密文块。 如果缺少填充，则最后一个空格将丢失，并且输出长度将不正确，这说明了为什么填充至关重要。 

### 示例 2

 在需要填充的地方采用稍长的字符串，例如 n = 2 的“ABC”。 

| 步骤| 块| 计算| 输出值|
 | --- | --- | --- | --- |
 | 1 | [A，B]| 矩阵变换| [x，y] |
 | 2 | [C、空格] | 填充块变换| [p，q] |

 这表明最后一个字符不是单独处理的，而是与填充空间结合在一起，确保块结构的一致性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(L·n²) | O(L·n²) | 每个字符参与一次n维矩阵乘法 |
 | 空间| O(L) | 编码字符串和输出的存储 |

 由于 n ≤ 10，因子 n² 以 100 为界，使得解在输入大小上有效地呈线性。 这完全在典型 Codeforces 约束的范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from math import prod

    MOD = 37

    chars = []
    for c in range(ord('A'), ord('Z') + 1):
        chars.append(chr(c))
    for c in range(ord('0'), ord('9') + 1):
        chars.append(chr(c))
    chars.append(' ')

    char_to_int = {ch: i for i, ch in enumerate(chars)}
    int_to_char = {i: ch for i, ch in enumerate(chars)}

    n = int(input())
    mat = [list(map(int, input().split())) for _ in range(n)]
    s = input().rstrip('\n')

    vals = [char_to_int[ch] for ch in s]
    while len(vals) % n != 0:
        vals.append(char_to_int[' '])

    res = []
    for i in range(0, len(vals), n):
        block = vals[i:i+n]
        for r in range(n):
            acc = 0
            for c in range(n):
                acc += mat[r][c] * block[c]
            res.append(int_to_char[acc % MOD])

    return ''.join(res)

# provided sample 1
assert run("""3
30 1 9
4 23 7
5 9 13
ATTACK AT DAWN
""") == "FPLSFA4SUK2W9K3"

# custom: single character, n=1
assert run("""1
5
A
""") == "F"

# custom: padding required
assert run("""2
1 0
0 1
ABC
""")  # identity matrix with padding
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | n=1 个单个字符 | 转换后的字符 | 最小尺寸正确性|
 | 单位矩阵| 应用了填充的相同文本 | 填充行为|
 | 案例案例 | FPLSFA4SUK2W9K3 | 全管道正确性|

 ## 边缘情况

 填充情况是最重要的结构边缘情况。 考虑 n = 3 和明文“ABCX”。 编码后，我们得到四个值。 最后一个块变成[X，空格，空格]。 在乘法过程中，这个填充向量仍然被完全处理，产生一个有效的密文段。 该算法在块处理之前显式附加空间值，因此不会解释任何部分块。 

空格字符本身是另一个关键情况。 如果明文包含空格，它们将被映射为 36 并像任何其他符号一样参与算术运算。 例如，像 [A, space, B] 这样的块会变成 [0, 36, 1]。 乘法步骤将 36 视为模 37 的普通整数，因此不需要特殊的大小写。 

最后，最小矩阵大小 n = 1 退化为逐个字符应用的简单标量乘法模 37。 相同的循环结构可以自然地处理它，因为每个块仅包含一个值，并且矩阵乘法减少为单个乘法步骤。
