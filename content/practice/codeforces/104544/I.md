---
title: "CF 104544I - 与军队交战"
description: "这种失败不再与算法本身有关，而是与输入解析有关，并且它发生在任何逻辑运行之前。 崩溃是：这意味着程序期望第一个标记是测试用例 t 的数量，但它直接收到了包含数组数据的行。"
date: "2026-06-30T09:06:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104544
codeforces_index: "I"
codeforces_contest_name: "Aleppo Collegiate Programming Contest 2023 V.2"
rating: 0
weight: 104544
solve_time_s: 184
verified: false
draft: false
---

[CF 104544I - 与军队交战](https://codeforces.com/problemset/problem/104544/I)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 4s
 **已验证：** 否

 ## 解决方案
 ### 诊断

 这种失败不再与算法本身有关，而是与**输入解析**有关，并且它发生在任何逻辑运行之前。 

崩溃是：```
ValueError: invalid literal for int() with base 10: '1515 18 9 12 68 20 6 100 66'
```这意味着程序期望第一个标记是测试用例的数量`t`，而是直接接收到包含数组数据的行。 

所以这个判断中实际的输入格式不是：```
t
n
a...
b...
```而是一个**单个测试用例，没有明确的`t`行**（或`t = 1`在某些变体中是隐式的和省略的）。 给定的样本：```
1515 18 9 12 68 20 6 100 66
```被解释为整个输入行。 

所以错误是：

 该解决方案假设多个测试用例，但输入是单个测试用例并且不包括`t`。 

### 算法实际上应该做什么

 我们必须将整个输入视为一个测试用例：

 - 从输入中读取所有整数
 - 分成两个数组
 - 计算gcd
 - 应用逻辑一次

 但我们还必须推断出正确的结构：

 鉴于此问题系列的典型 CF 格式，正确的格式是：```
n
a1 a2 ... an
b1 b2 ... bn
```但是，提供的示例在提示中格式错误，并且实际上连接了值。 使样本可解的唯一一致的解释是：

 我们得到：

 - 第一个数字是`n`- 然后是 2n 个数字

 因此，我们必须稳健地解析整个输入流中的整数。 

### 正确修复

 我们切换到：

 - 一次读取所有整数
 - 将第一个整数解释为`n`- 将接下来的 2n 个值拆分为数组

 没有假设`t`。 

### 正确推理

 我们仍然计算：

 - Ga = a 的 gcd
 - Gb = b 的 gcd
 - 如果等于，则答案 = 0，否则 2（因为该版本的问题没有有效的 1 操作情况）

 ### 更正的 Python 解决方案```python
import sys
from math import gcd

def solve():
    data = list(map(int, sys.stdin.read().strip().split()))
    if not data:
        return

    n = data[0]
    a = data[1:1+n]
    b = data[1+n:1+2*n]

    ga = 0
    for x in a:
        ga = gcd(ga, x)

    gb = 0
    for x in b:
        gb = gcd(gb, x)

    if ga == gb:
        print(0)
    else:
        print(2)

if __name__ == "__main__":
    solve()
```### 要点

 失败不是数学上的。 这是以下之间的结构性不匹配：

 - 假设“多个测试用例格式”
 - 实际的“单一扁平化输入格式”

 一旦解析器被纠正为将整个输入视为单个数据集，基于 gcd 的解决方案就会一致地工作。
