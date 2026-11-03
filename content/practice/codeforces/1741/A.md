---
title: "CF 1741A - 比较 T 恤尺寸"
description: "我们被要求比较以字符串表示的两种 T 恤尺寸。 每个字符串以三个字母之一结尾：S 表示小，M 表示中，L 表示大。 此外，S或L之前可能有一系列X，表示特小或特大。"
date: "2026-06-09T16:25:33+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1741
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 826 (Div. 3)"
rating: 800
weight: 1741
solve_time_s: 159
verified: true
draft: false
---

[CF 1741A - 比较 T 恤尺寸](https://codeforces.com/problemset/problem/1741/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 2m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求比较以字符串表示的两种 T 恤尺寸。 每个字符串以三个字母之一结尾：S 表示小，M 表示中，L 表示大。 此外，S或L之前可能有一系列X，表示特小或特大。 Medium 从来没有 X，所以 M 是固定的。 输入给出了多对尺寸，对于每对，我们必须打印第一对是小于、大于还是等于第二对。 

关键是理解顺序。 任何小号都比中号或大号小，任何大号都比中号或小号大。 在小号中，X 越多，衬衫就越小，例如 XXXS < XS。 在大号中，X 越多，它就越大，例如 XXXL > XL。 中号总是介于所有小号和所有大号之间。 

约束告诉我们最多可以有 10,000 个测试用例，每个大小的字符串最多为 50 个字符。 涉及字符串字符上的任何嵌套循环的简单方法仍然可以工作，因为 50 × 10,000 = 500,000 次操作，这对于 1 秒的限制是可以接受的。 然而，需要仔细的字符串解析来处理不同数量的 X 和最后的字母。 

当比较极端尺寸或不寻常的组合时，就会出现边缘情况。 例如，XXXXXS 与 M 应该返回`<`，因为任何小号，无论长度如何，都比中号小。 同样，L 与 XXXL 应该返回`<`，因为 XXXL 是一个大值，L 是一个大值，所以 XXXL > L。这里，简单的词典字符串比较会失败，因为“XXXXXS”>“M”作为字符串，即使大小较小。 

## 方法

 暴力方法是将每个 T 恤尺寸编码为表示其绝对排名的整数，然后比较这些整数。 对于小数，我们可以分配一个负数，随着 X 的数量而减少； 对于中等，为零； 对于大的，一个正数随着 X 的数量而增加。 这是可行的，因为所有大小都属于线性顺序，并且对它们进行编码允许进行简单的数字比较。 这种方法是正确的，但如果我们只需要一次比较两个字符串，则会引入不必要的簿记。 

最佳方法利用了排序规则简单且本地化的事实：最后一个字符决定类别（S、M、L），前面的 X 的数量决定 S 和 L 内的相对排序。我们可以首先检查最后一个字符。 如果它们不同，则立即比较：S < M < L。如果最后一个字符相等，我们比较 X 的数量：对于 S，X 越多意味着越小；对于 S 来说，X 越多意味着越小；对于 S 来说，X 越多意味着越小； 对于 L，X 越多意味着越大。 这最多需要对每个字符串的字符进行计数，这与字符串长度成线性关系，或者因为长度≤50，所以时间复杂度为O(1)。不需要额外的数据结构，我们可以有效地处理所有测试用例。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（排名编码）| O(t * n) | O(1) | O(1) | 已接受但稍微复杂 |
 | 最佳（基于字符的比较）| O(t * n) | O(1) | O(1) | 被接受且更简单 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，读取两个 T 恤尺寸字符串`a`和`b`。 
3. 提取每个字符串的最后一个字符以确定其类型：小、中或大。 
4. 如果类型不同，直接按顺序 S < M < L 进行比较。 打印`<`如果`a`较小，`>`如果更大，或者如果相等则继续。 
5. 如果类型相同，则统计每个字符串中 X 的数量。 对于小号来说，X 越多意味着尺码越小； 对于大号来说，X 越多意味着尺码越大。 Medium 没有 X，并且始终等于另一种 Medium。 
6.根据类型比较计数并打印`<`,`>`， 或者`=`视情况而定。 

为什么它有效：该算法依赖于两个属性。 首先，最后一个字符对主类别进行编码，该类别已经对所有尺寸进行了部分排序。 其次，X 的数量微调 S 或 L 类别内的顺序。 通过显式处理这两种情况，该算法保证了所有有效大小字符串的正确比较。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    a, b = input().split()
    type_a, type_b = a[-1], b[-1]
    
    if type_a != type_b:
        if type_a == 'S':
            print('<')
        elif type_a == 'M':
            if type_b == 'S':
                print('>')
            else:
                print('<')
        else:  # type_a == 'L'
            print('>' if type_b != 'L' else '=')
    else:
        count_a, count_b = a.count('X'), b.count('X')
        if type_a == 'S':
            print('<' if count_a > count_b else '>' if count_a < count_b else '=')
        elif type_a == 'L':
            print('>' if count_a > count_b else '<' if count_a < count_b else '=')
        else:
            print('=')
```该代码首先读取测试用例的数量并循环它们。 最后一个字符决定了主要类型，允许我们在类型不同时缩短比较。 如果类型匹配，我们计算 X 并根据它是 S 还是 L 来调整比较。S 的顺序是相反的，因为 X 越多，它就越小。 Medium 被作为简单的等式处理。 

## 工作示例

 用于输入`XXXS XS`：

 | 一个 | 乙| 类型_a | 类型_b | 计数_a | 计数_b | 比较|
 | --- | --- | --- | --- | --- | --- | --- |
 | XXXS | XS | S | S | 3 | 1 | 计数_a > 计数_b →`<`|

 我们看到 XXXS 比 XS 小，因为三个 X 使它更小。 

用于输入`XL M`：

 | 一个 | 乙| 类型_a | 类型_b | 计数_a | 计数_b | 比较|
 | --- | --- | --- | --- | --- | --- | --- |
 | XL | 中号 | 左 | 中号 | 1 | 0 | 类型_a > 类型_b →`>`|

 XL 是大号，M 是中号，所以 XL > M。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t * n) | 每个测试用例最多扫描 50 个字符来计数 X，重复 t 次 |
 | 空间| O(1) | O(1) | 只有几个变量用于计数和类型比较 |

 当 t ≤ 10,000 且 n ≤ 50 时，该算法最多执行 500,000 次操作，完全在 1 秒限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        t = int(input())
        for _ in range(t):
            a, b = input().split()
            type_a, type_b = a[-1], b[-1]
            
            if type_a != type_b:
                if type_a == 'S':
                    print('<')
                elif type_a == 'M':
                    print('>' if type_b == 'S' else '<')
                else:  # type_a == 'L'
                    print('>' if type_b != 'L' else '=')
            else:
                count_a, count_b = a.count('X'), b.count('X')
                if type_a == 'S':
                    print('<' if count_a > count_b else '>' if count_a < count_b else '=')
                elif type_a == 'L':
                    print('>' if count_a > count_b else '<' if count_a < count_b else '=')
                else:
                    print('=')
    return out.getvalue().strip()

# provided samples
assert run("6\nXXXS XS\nXXXL XL\nXL M\nXXL XXL\nXXXXXS M\nL M\n") == "<\n>\n>\n=\n<\n>", "sample 1"

# custom cases
assert run("3\nM M\nS M\nXXXL L\n") == "=\n<\n>", "medium equality and extremes"
assert run("2\nXS XXS\nXL XXL\n") == ">\n<", "small and large X counts"
assert run("1\nXXXXXXS XXXXXS\n") == "<", "multiple Xs for small"
assert run("1\nXXXL XXXL\n") == "=", "identical large sizes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | MM | = | 中等平等 |
 | SM | <| 小型与中型 |
 | XXXL 大号 | > | 带有额外 X 的大号 |
 | XS XXS | > | 小 X 数量订购 |
 | XXL 号 | < | 大 X 计数订购 |
 | XXXXXX XXXXX | < | 极小尺寸 |
 | XXXL XXXL | = | 相同大尺寸|

 ## 边缘情况

 用于输入`XXXXXS M`，最后一个字符比较立即识别出 M 比任何小字符都大。 算法打印`<`无需计算 X。 为了`XXXL L`，两者都很大，因此比较 X 的计数：3 X > 1 X，结果是`>`。 对于`
