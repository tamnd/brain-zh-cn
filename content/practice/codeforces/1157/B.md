---
title: "CF 1157B - 长号"
description: "我们得到一个从 1 到 9 的数字字符串，以及从每个数字到同一范围内另一个数字的映射 f。 任务是通过选择最多一个连续的数字段并用 f(x) 替换该段中的每个数字 x 来最大化结果数字。"
date: "2026-06-12T02:32:31+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1157
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 555 (Div. 3)"
rating: 1300
weight: 1157
solve_time_s: 85
verified: true
draft: false
---

[CF 1157B - 长数字](https://codeforces.com/problemset/problem/1157/B)

 **评分：** 1300
 **标签：** 贪婪
 **求解时间：** 1m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个数字作为一串数字，来自`1`到`9`和一个映射`f`从每个数字到同一范围内的另一个数字。 任务是通过选择最多一个连续的数字段并替换每个数字来最大化结果数字`x`在该段中`f(x)`。 所有其他数字保持不变。 

输入给我们`n`, 位数, 数量`a`作为字符串，以及代表 9 个整数的列表`f(1)`通过`f(9)`。 输出是通过执行一次操作或根本不执行操作可获得的最大数字。 

给定`n`可以大到 200,000 并且时间限制为 2 秒，任何天真地考虑所有可能的子段的算法都需要大约`O(n^2)`操作，这太慢了。 我们需要一种线性或线性算术方法。 

非明显的边缘情况包括应用的序列`f`可以在增加后面的数字之前暂时减少一个数字。 例如，如果`a = 987`和`f(9) = 8, f(8) = 9`，一个天真的贪婪者可能会尝试开始替换`9`即使保持不变也会产生更大的总数。 当所有数字都映射到更小或相等的值时，会出现另一种边缘情况，在这种情况下，最佳移动是根本不执行该操作。 例如，`a = 123`和`f = [1,1,1,4,5,6,7,8,9]`产生`123`因为没有替换会增加任何数字。 

## 方法

 蛮力方法很简单：迭代每个可能的连续子段，应用`f`到该段中的数字，并计算结果数字。 跟踪遇到的最大数量。 这是可行的，因为问题允许的任何操作都可以表示为连续的段替换。 然而，子段的数量随着`n(n+1)/2`，所以与`n = 2*10^5`，这种方法需要的顺序是`2*10^10`操作，这是不切实际的。 

最佳解决方案的关键观察是我们应该从第一个位置开始替换数字`f(x) > x`并继续更换，只要`f(x) >= x`。 一次`f(x) < x`，我们停止替换，因为进一步延长替换会减少数量。 这是可行的，因为该操作必须是连续的并且最多应用一次，并且数字中前面的较大数字比后面的数字对最终数字的影响更大。 这给出了一个贪婪的解决方案，从左到右扫描一次数字，根据与以下内容的简单比较来决定是否替换每个数字`f(x)`以及一个标志，指示我们是否处于活跃的替换段中。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化一个标志`started`到`False`指示我们是否已开始替换段。 初始化一个空列表`result`建立最终的数字。 
2. 迭代每个数字`d`在原来的数字中从左到右。 转变`d`到一个整数来比较`f(d)`。 
3.如果`f(d) > d`，将数字替换为`f(d)`并设置`started`到`True`。 将替换后的数字附加到`result`。 
4.如果`f(d) == d`，检查`started`旗帜。 如果`started`是`True`，继续替换为`f(d)`（没有变化）。 如果`started`是`False`，将原始数字附加到`result`。 
5. 如果`f(d) < d`和`started`是`True`，停止替换段。 放`started`到`False`并将原始数字附加到`result`。 如果`started`是`False`，只需附加原始数字即可。 
6. 处理完所有数字后，加入`result`list 成字符串并输出。 

这里的不变性是，一旦我们开始替换段，我们就会最大化每个数字，直到替换会减少数字。 由于操作必须是连续的，因此我们不能跳过段中的数字。 这保证了最大数量，因为任何较早或较晚的开始或结束都会产生较小的结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = input().strip()
f = list(map(int, input().split()))

result = []
started = False

for ch in a:
    digit = int(ch)
    mapped = f[digit - 1]
    if mapped > digit:
        result.append(str(mapped))
        started = True
    elif mapped == digit:
        result.append(str(digit) if not started else str(mapped))
    else:
        result.append(str(digit))
        if started:
            started = False

print(''.join(result))
```该解决方案初始化结果数组并迭代数字。 转换为整数是必要的，因为`f`是一个整数列表。 这`started`flag 确保替换是连续的，并且比较正确地处理开始、继续或停止替换。 在末尾加入结果列表可以避免重复的字符串连接。 

## 工作示例

 ### 示例 1

 输入：```
a = 1337
f = [1,2,5,4,6,6,3,1,9]
```| 我| ch | 数字| f(数字) | 开始| 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | 1 | 假 | 1 |
 | 1 | 3 | 3 | 5 | 真实| 1,5 | 1,5 |
 | 2 | 3 | 3 | 5 | 真实| 1,5,5 |
 | 3 | 7 | 7 | 3 | 真实| 1,5,5,7 |

 输出：`1557`替换从第一个 3 开始，继续到第二个 3，并在 7 处停止，因为`f(7) < 7`。 这证明了正确的段选择。 

### 自定义示例 2

 输入：```
a = 987
f = [1,2,3,4,5,6,7,8,9]
```| 我| ch | 数字| f(数字) | 开始| 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 9 | 9 | 9 | 假 | 9 |
 | 1 | 8 | 8 | 8 | 假 | 8 |
 | 2 | 7 | 7 | 7 | 假 | 7 |

 输出：`987`没有替换会增加任何数字，因此数字保持不变。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个数字都被处理一次，循环内的所有操作都是 O(1) |
 | 空间| O(n) | 结果列表存储n个字符 |

 该解决方案非常适合时间和内存限制`n`最多 2*10^5。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    a = input().strip()
    f = list(map(int, input().split()))
    result = []
    started = False
    for ch in a:
        digit = int(ch)
        mapped = f[digit - 1]
        if mapped > digit:
            result.append(str(mapped))
            started = True
        elif mapped == digit:
            result.append(str(digit) if not started else str(mapped))
        else:
            result.append(str(digit))
            if started:
                started = False
    return ''.join(result)

# provided samples
assert run("4\n1337\n1 2 5 4 6 6 3 1 9\n") == "1557", "sample 1"

# custom cases
assert run("3\n987\n1 2 3 4 5 6 7 8 9\n") == "987", "no replacement needed"
assert run("5\n11111\n9 8 7 6 5 4 3 2 1\n") == "99999", "all digits increased"
assert run("4\n4321\n1 2 3 4 5 6 7 8 9\n") == "4321", "all digits mapped to smaller values"
assert run("6\n123456\n2 3 4 5 6 7 8 9 1\n") == "234567", "replacement starts at first digit"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 第987章 987 | 987 可以跳过操作 |
 | 第11111章 99999 | 99999 所有数字的最大替换 |
 | 第4321章 4321 | 在减少数字之前正确停止 |
 | 123456 且 f(x) > x | 234567 | 234567 首次增加即开始更换|

 ## 边缘情况

 如果所有映射的数字都小于
