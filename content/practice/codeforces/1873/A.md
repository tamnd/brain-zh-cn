---
title: "CF 1873A - 短排序"
description: "我们得到三张不同的卡片，分别标记为 a、b 和 c，并按某种顺序排列。 我们的目标是确定是否最多使用两张卡的一次交换，将行转换为有序序列 abc。"
date: "2026-06-08T23:12:44+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1873
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 898 (Div. 4)"
rating: 800
weight: 1873
solve_time_s: 79
verified: true
draft: false
---

[CF 1873A - 短排序](https://codeforces.com/problemset/problem/1873/A)

 **评分：** 800
 **标签：** 暴力破解、实施
 **求解时间：** 1m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了三张不同的卡片，标有`a`,`b`， 和`c`，按某种顺序排列。 我们的目标是确定是否可以通过最多使用两张卡的一次交换来将行转换为有序序列`abc`。 每个测试用例都由长度为 3 的字符串组成，其中恰好包含这三个字母的某种排列。 如果可以获得有序序列，则每种情况的输出为“是”，否则为“否”。 

因为只有三个元素，所以排列总数为六。 这意味着我们可以详尽地推理问题，但我们还应该了解单次交换就足够的确切条件。 交换可以修复一对放错位置的对，或者如果序列已经存在则不需要交换`abc`。 限制很小：最多有六个测试用例，每个测试用例仅涉及三个字母，任何合理的方法都将在可以忽略不计的时间内运行。 边缘情况包括已经排序的序列（`abc`），不可能通过一次交换来修复的序列（`bca`或者`cab`），以及一个交换掉的序列（`acb`,`bac`,`cba`）。 

幼稚的实现可能会错误地认为交换任意两个字母总是足够的。 例如，`bca`不能成为`abc`只需一次交换。 仅检查放错位置的字母的数量会导致误报。 该算法必须考虑每个字符相对于目标的位置`abc`。 

## 方法

 暴力方法会明确尝试所有可能的位置对进行交换，然后检查结果是否匹配`abc`。 对于三个字母，存在三种可能的交换：位置 0 和 1、位置 0 和 2、位置 1 和 2。每次交换后，我们将字符串与`abc`。 如果任何交换产生目标，我们打印“YES”； 否则，“否”。 这是正确的，因为我们涵盖了所有可能的单交换操作，并且在给定固定输入大小的情况下，它以恒定的时间运行。 缺点是这种方法不能扩展到更大的数组，但在这里它是可以接受的。 

进一步简化的关键观察是三个字母的排列最多与`abc`当且仅当它已经是`abc`或者它的第一个和最后一个字母交换了（`acb`,`bac`,`cba`）。 序列`bca`和`cab`需要两次交换并且无法在一次操作中修复。 通过根据这些模式检查字符串，我们可以在一次比较中确定答案，每个测试用例的时间复杂度实际上是 O(1)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（尝试所有交换）| O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 模式检查（检查可解排列）| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，读取代表卡片序列的三字符字符串。 
3. 检查字符串是否正确`abc`。 如果是这样，请打印“YES”并继续。 
4. 否则，检查字符串是否与可以变为的三个排列之一匹配`abc`一次交换：`acb`,`bac`,`cba`。 如果是，则打印“YES”。 
5. 如果这些条件都不满足，则打印“NO”。 这些是序列`bca`和`cab`，这需要两次交换。 
6. 对所有测试用例重复步骤 2-5。 

为什么有效：对于三元素排列，任何字符串要么已经与目标匹配，要么可以通过恰好交换两个元素来修复，要么需要多个交换。 我们检查的三种模式涵盖了一次交换即可解决的所有情况，确保了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    s = input().strip()
    if s == "abc" or s in {"acb", "bac", "cba"}:
        print("YES")
    else:
        print("NO")
```代码首先读取测试用例的数量。 对于每个测试用例，我们读取字符串，去除所有空格，并将其与目标进行比较`abc`。 如果字符串匹配`abc`或者是一次交换（`acb`,`bac`,`cba`），我们打印“YES”。 否则，我们打印“NO”。 使用一组一次性交换模式可以进行有效的成员资格检查。 

## 工作示例

 考虑输入字符串`acb`。 

| 步骤| s | 检查 | 输出|
 | ---| ---| ---| ---|
 | 1 | “ACB”| s==“abc”？ 没有 | - |
 | 2 | “ACB”| 是在 {"acb", "bac", "cba"} 中吗？ 是的 | 是 |

 我们检测到`acb`可以成为`abc`通过交换最后两个字符。 

考虑`bca`:

 | 步骤| s | 检查 | 输出|
 | ---| ---| ---| ---|
 | 1 | “BCA”| s==“abc”？ 没有 | - |
 | 2 | “BCA”| 是在 {"acb", "bac", "cba"} 中吗？ 没有 | 否 |`bca`需要两次交换，因此算法正确输出“NO”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t) | 每个测试用例都涉及恒定数量的字符串比较，并且 t ≤ 6。 
| 空间| O(1) | O(1) | 仅存储输入字符串和一小组模式。 |

 该解决方案非常适合问题的限制。 每个操作都很琐碎，内存使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution
    t = int(input())
    for _ in range(t):
        s = input().strip()
        if s == "abc" or s in {"acb", "bac", "cba"}:
            print("YES")
        else:
            print("NO")
    return output.getvalue().strip()

# provided samples
assert run("6\nabc\nacb\nbac\nbca\ncab\ncba\n") == "YES\nYES\nYES\nNO\nNO\nYES", "sample 1"

# custom cases
assert run("2\nabc\nbca\n") == "YES\nNO", "already sorted and impossible"
assert run("1\ncba\n") == "YES", "reverse order solvable by one swap"
assert run("1\ncab\n") == "NO", "cannot solve in one swap"
assert run("3\nacb\nbac\nabc\n") == "YES\nYES\nYES", "all one-swap or sorted cases"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | ABC | 是 | 已经排序的序列 |
 | BCA | 否 | 需要两次交换，不可能 |
 | 篮球协会| 是 | 逆序，一次交换即可解决 |
 | 驾驶室 | 否 | 一次性解决方案不可能实现 |
 | acb、bac、abc | 是 | 确认检测到一次性互换模式 |

 ## 边缘情况

 该算法处理已排序序列的边缘情况`abc`首先明确检查是否相等。 为了`bca`和`cab`，算法正确地识别出没有单个交换可以修复序列，输出“NO”。 为了`cba`，相反，算法将其检测为一次交换情况，输出“YES”。 使用一组进行单交换排列的决定可确保捕获所有可解排列，而不会丢失任何有效配置。
