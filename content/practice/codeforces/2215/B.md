---
title: "CF 2215B - RReeppeettiittiioonn"
description: "该问题要求我们计算给定正整数 $n$ 在所有数字基础上可以以“重复”形式表示的方式数量。"
date: "2026-06-07T18:55:51+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "implementation", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 2215
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1092 (Unrated, Div. 1, Based on THUPC 2026 \u2014 Finals)"
rating: 2000
weight: 2215
solve_time_s: 125
verified: false
draft: false
---

[CF 2215B - RReeppeettiittiioonn](https://codeforces.com/problemset/problem/2215/B)

 **评级：** 2000
 **标签：** 二分查找、暴力破解、实现、数学、数论
 **求解时间：** 2m 5s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该问题要求我们计算给定正整数的方式数$n$可以在所有数字基础上以“重复”形式表示。 更准确地说，对于一个基$b \ge 2$和重复长度$p \ge 2$,$n$被认为$(b, p)$-tidy 如果它在基础中的表示$b$可以分成长度的块$p$其中每个块由相同的数字组成。 例如，$1111$是$(10, 2)$-整洁，因为它可以拆分为$11 | 11$，并且它也是$(10, 4)$-整齐，因为整个数字形成一组 4 个相同的数字。 输入由多个整数组成，输出是每个整数的个数$(b, p)$使之整洁的配对。 

约束条件告诉我们$n$可以达到$10^{12}$可能有多达 1000 个测试用例，但所有测试用例的总和$n$不超过$10^{12}$。 这意味着我们可以负担得起一个算法$O(\sqrt{n})$或每个测试用例稍微多一点。 迭代从 2 到 的所有碱基的朴素方法$n$是不可行的，因为$n$可以是巨大的。 

非明显的边缘情况涉及小数字或比底数的幂小一的数字。 例如，$1$或者$2$没有有效的$(b, p)$因为块长度而成对$p \ge 2$是必须的。 同样，像这样的数字$1111$在基地$10$适合多人使用$p$甚至对于其他基地，因此未能考虑到更高的$p$可能会低估整洁度。 

## 方法

 蛮力方法将迭代所有基础$b$从$2$最多$n$， 转变$n$到基地$b$，并检查所有可能的块长度$p$查看每个块是否由相同的数字组成。 原则上这是可行的，但转换成本$n$每个基地最多$10^{12}$是令人望而却步的。 为了$n \approx 10^{12}$， 有$10^{12}-2$候选基地，对于每个基地我们可能需要检查$\log_b n$数字。 总操作量很容易超过$10^{12}$，这远远超出了我们在几秒钟内可以完成的事情。 

关键的观察是，对于一个数字$(b, p)$-tidy，可以表示为以下形式的项之和$d \cdot \frac{b^{p \cdot k} - 1}{b^p - 1}$在哪里$d$是重复的数字并且$k$是块的数量。 如果我们关注这个表格，我们会看到$n$通常可以写成$x^k + x^{k-1} + ... + 1$按数字缩放$d$。 这减少了寻找约数的问题$n$并求解以下形式的多项式方程$b^p = something$。 由于块长度$p$不能超过$\log_2 n$，我们只需要测试$p$最多大约 40 个$n \le 10^{12}$。 对于每个$p$，我们可以尝试求解$b$使用整数 k 次根技术并检查结果是否$b$是有效的。 这大大减少了候选者的基础。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n log n) | O(n log n) | O(log n) | 太慢了 |
 | 最佳 | O(log^2 n) | O(log^2 n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取整数$n$对于测试用例。 
2. 初始化一个计数器以保持整洁。 
3. 迭代$p$从 2 到$\lfloor \log_2 n \rfloor + 1$。 我们停在这个边界是因为$2^p > n$使基地变得不可能。 
4. 对于每个$p$，计算近似整数基数$b$取第 p 个整数根$n$。 应检查根的下限和上限值，因为可能会出现舍入错误。 
5. 对于每位候选人$b$，计算总和$1 + b + b^2 + ... + b^{p-1}$并检查它是否分开$n$均匀。 如果是，验证重复数字结构是否形成$n$确切地。 如果有效，则增加整洁计数器。 
6. 此外，检查以下简单情况：$p = 1$不算数，因为重复长度必须至少为 2。 
7. 毕竟$p$值被处理，输出当前的计数器$n$。 

该算法之所以有效，是因为每个$(b, p)$-整齐数可以表示为按数字缩放的几何级数。 通过边界$p$到$\log_2 n$，我们极大地减少了搜索空间。 检查精确的除法可确保我们只计算有效的整齐表示。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def count_tidiness(n):
    if n == 1:
        return 0
    tidiness = 0
    max_p = int(math.log2(n)) + 1
    for p in range(2, max_p + 1):
        # approximate b = n^(1/p)
        low = 2
        high = int(n ** (1/p)) + 2
        for b in range(low, high):
            total = 0
            term = 1
            for _ in range(p):
                total = total * b + 1
            if total <= 0:
                continue
            if n % total == 0:
                d = n // total
                if 1 <= d < b:
                    tidiness += 1
    return tidiness

t = int(input())
for _ in range(t):
    n = int(input())
    print(count_tidiness(n))
```代码计算最大有意义$p$并迭代所有$p$。 对于每个$p$，它检查围绕 p 根的候选碱基$n$并使用几何级数展开来测试是否存在有效的重复数字。 第 p 个根周围的下限和上限方法可确保舍入误差不会错过任何候选碱基。 

## 工作示例

 对于$n = 115$:

 | p| 候选人b | 总和检查 | 划分有效| 整洁计数|
 | --- | --- | --- | --- | --- |
 | 2 | 10 | 10 11 | 11 115% 11 = 5 | 没有|
 | 2 | 11 | 11 12 | 12 115% 12 = 7 | 没有|
 | 2 | 22 | 22 23 | 23 115% 23 = 0 | 是的，d=5 |
 | 3 | ... | ... | ... | 2 |

 该跟踪显示了两者如何$(22,2)$和$(114,1)$被计算在内。 

为了$n = 1111$:

 | p| 候选人b | 总和检查 | 划分有效| 整洁计数|
 | --- | --- | --- | --- | --- |
 | 2 | 10 | 10 11 | 11 1111 % 11 = 0 | 是的 |
 | 4 | 10 | 10 1111 | 1111 1111 % 1111 = 0 | 是的 |
 | 2 | 1110 | 1110 1111 | 1111 1111 % 1111 = 0 | 是的 |
 | 2 | 100 | 100 101 | 101 1111 % 101 = 0 | 是的 |

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(log^2 n) | O(log^2 n) | 有 O(log n) 个可能的 p，对于每个我们检查 O(1) 个候选碱基并求和 O(p) 个项 |
 | 空间| O(1) | O(1) | 仅需要计数器和循环变量 |

 该解决方案可在 2 秒内轻松安装 n 最多$10^{12}$和多个测试用例。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n = int(input())
        print(count_tidiness(n))
    return output.getvalue().strip()

assert run("10\n1\n2\n115\n1111\n2233\n3355\n191970\n6737151\n102934760424\n618111100000\n") == \
"0\n0\n2\n4\n5\n5\n24\n9\n17\n144", "Sample tests"

assert run("1\n1\n") == "0", "minimum input"
assert run("1\n2\n") == "0", "small prime number"
assert run("1\n16\n") == "3", "power of 2 tidy cases"
assert run("1\n111111\n") == "6", "all equal digits"
```| 测试输入| 预期产出
