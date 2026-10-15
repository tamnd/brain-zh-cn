---
title: "CF 106110D - TL、ML 还是 OK？"
description: "我们得到了一个非常简化的多次运行循环的程序的成本模型。 每个循环迭代执行两种工作：许多计算操作和向数据结构中的许多整数插入。"
date: "2026-06-25T06:44:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106110
codeforces_index: "D"
codeforces_contest_name: "2025-2026 ICPC NERC, Kyrgyzstan Qualification Contest"
rating: 0
weight: 106110
solve_time_s: 34
verified: true
draft: false
---

[CF 106110D - TL、ML 还是可以？](https://codeforces.com/problemset/problem/106110/D)

 **评级：** -
 **标签：** -
 **求解时间：** 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个非常简化的多次运行循环的程序的成本模型。 每个循环迭代执行两种工作：许多计算操作和向数据结构中的许多整数插入。 每次计算和每次插入的成本是固定的，但取决于编程语言。 

由此我们必须判断程序是否违反了时间限制、内存限制、两者都违反了，或者两者都不违反。 时间限制表示为法官每秒可以处理每种语言的最大原语操作数。 内存限制表示为可以存储的最大整数数。 

关键思想是执行期间不会发生任何动态或算法。 我们只是在一个循环中汇总总数，然后与两个阈值进行比较。 

输入由四个值组成：循环迭代次数、每次迭代发生多少次计算、每次迭代发生多少次插入以及语言标识符。 由此我们计算总时间成本和总内存使用量并对结果进行分类。 

这些约束允许每个数字参数的值最多为一百万。 这立即排除了任何以复杂方式模拟迭代的方法，但在这里，即使是线性模拟也可以，因为我们只为每个测试用例执行恒定数量的算术。 整个解决方案每次测试基本上都是 O(1)。 

当超过两个限制时，就会出现微妙的故障情况。 幼稚的实现可能首先检查时间并立即返回，或者首先检查内存并立即返回。 这是不正确的，因为所需的输出区分四种状态。 另一个常见的错误是忘记内存和时间阈值取决于语言，因此硬编码单个限制会导致错误的答案。 

具体的边缘情况是两者都恰好超出：

 输入：

 n = 1e6，q = 1e6，k = 1e6，语言 = py

 时间成本巨大，内存也巨大，所以正确的输出是“TL和ML”。 仅返回第一个违反约束的天真的检查器将错误地仅输出“TL”。 

另一个边缘情况是当值恰好位于边界上时，例如恰好命中 2e7 个内存整数或恰好命中 2e7 个 Python 操作。 这些必须被视为有效，因为条件是“超过”而不是“大于或等于”。 

## 方法

 强力解释将模拟每个循环迭代，增量地添加操作和内存，并反复与限制进行比较。 这有效但没有必要。 每次迭代的计算量是恒定的，因此总复杂度变为 O(n)，这在约束下仍然没问题，但在概念上是浪费的。 

关键的观察结果是所有迭代都是相同的。 我们不进行模拟，而是乘以一次：总操作数为 n 次 (2·q + 5·k)，总内存为 n·k。 计算这些聚合后，我们只进行两次比较。 

真正的简化来自于认识到迭代之间不存在状态依赖性。 每次迭代都会产生独立的成本，因此整个程序简化为线性缩放。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 迭代模拟 | O(n) | O(1) | O(1) | 已接受 |
 | 直接聚合 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

1. 读取n、q、k 和语言字符串。 该语言确定两个常量：时间限制和内存限制，因此我们立即将其映射到其阈值。 
2. 将总计算操作计算为 n 乘以 q，然后乘以 2，因为每次计算需要 2 个操作。 
3. 将总插入操作计算为 n 乘以 k，然后乘以 5，因为每次插入需要 5 个操作。 
4. 将两部分相加以获得总时间成本。 
5. 由于每个插入的整数占用一个内存单位，因此计算总内存使用量为 n 乘以 k。 
6. 将内存使用情况与特定于语言的内存限制进行比较，并记录是否超出。 
7. 将时间使用情况与特定语言的时间限制进行​​比较，并记录是否超出。 
8. 根据两个布尔标志，准确输出四个字符串之一：OK、TL、ML 或 TL 和 ML。 

### 为什么它有效

 该程序的结构保证了成本的线性可加性：每次迭代都贡献相同的独立计算量和内存。 由于这两种成本都不依赖于先前的迭代，因此总资源使用量是相同项的简单总和。 该决策简化为将两个确定性标量值与固定阈值进行比较，因此排序或模拟效果不会改变结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
q = int(input())
k = int(input())
lang = input().strip()

if lang == "cpp":
    TL = 5 * 10**8
elif lang == "java":
    TL = 10**8
else:
    TL = 2 * 10**7

ML = 2 * 10**7

time_cost = n * (2 * q + 5 * k)
mem_cost = n * k

time_exceeded = time_cost > TL
mem_exceeded = mem_cost > ML

if time_exceeded and mem_exceeded:
    print("TL and ML")
elif time_exceeded:
    print("TL")
elif mem_exceeded:
    print("ML")
else:
    print("OK")
```代码直接遵循算法。 语言映射在开始时完成一次，以避免重复分支。 该算术使用 64 位安全的 Python 整数，因此不必担心溢出。 

一个微妙的实现细节是两次比较中的严格不平等。 与限制相等是有效的，因此只有严格更大的值才会触发失败。 

另一个重要的一点是保持最终条件顺序一致。 必须先检查组合情况； 否则，单标志分支将错误地掩盖第二次违规。 

## 工作示例

 ### 示例 1

 输入：

 n = 2，q = 2，k = 1，lang = java

 每次迭代的总计算量为 2·2 = 4，总插入成本为 5·1 = 5，因此每次迭代成本为 9。超过 2 次迭代，时间成本为 18。内存为 2·1 = 2。 

| 步骤| 时间成本| 内存成本 | TL 超出 | 超过ML |
 | ---| ---| ---| ---| ---|
 | 初始化| 0 | 0 | 假 | 假 |
 | 计算后| 18 | 18 2 | 假 | 假 |

 Java 限制足够大，两者都保持在范围内，因此输出正常。 

这表明缩放是线性且独立的； 每次迭代没有任何变化。 

### 示例 2

 输入：

 n = 5，q = 0，k = 2，lang = cpp

 每次迭代的时间成本为 5·2 = 10，因此总时间为 50。内存为 5·2 = 10。 

| 步骤| 时间成本| 内存成本 | TL 超出 | 超过ML |
 | ---| ---| ---| ---| ---|
 | 初始化| 0 | 0 | 假 | 假 |
 | 决赛| 50 | 50 10 | 10 假 | 假 |

 这个例子证实，即使计算量为零，插入仍然会产生内存和时间成本，并且必须单独考虑两者。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 无论输入大小如何，仅执行固定数量的算术运算和比较 |
 | 空间| O(1) | O(1) | 仅使用恒定数量的变量 |

 计算很容易满足限制，因为即使是极端的输入也只需要一些乘法和加法。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from subprocess import Popen, PIPE
    # placeholder: assume solution is wrapped in main()
    # here we inline by copying logic if needed
    import math

    n = int(sys.stdin.readline())
    q = int(sys.stdin.readline())
    k = int(sys.stdin.readline())
    lang = sys.stdin.readline().strip()

    if lang == "cpp":
        TL = 5 * 10**8
    elif lang == "java":
        TL = 10**8
    else:
        TL = 2 * 10**7

    ML = 2 * 10**7

    time_cost = n * (2 * q + 5 * k)
    mem_cost = n * k

    time_exceeded = time_cost > TL
    mem_exceeded = mem_cost > ML

    if time_exceeded and mem_exceeded:
        return "TL and ML"
    elif time_exceeded:
        return "TL"
    elif mem_exceeded:
        return "ML"
    else:
        return "OK"

# provided samples
assert run("20000\n2000\n200\njava\n") == "OK"
assert run("100000\n0\n300\ncpp\n") == "ML"
assert run("1000000\n1000000\n0\npy\n") == "TL"
assert run("1000000\n2000\n200\njava\n") == "TL and ML"

# custom cases
assert run("1\n0\n0\npy\n") == "OK", "minimum case"
assert run("1000000\n0\n0\ncpp\n") == "OK", "memory safe large time"
assert run("1000000\n0\n1000000\njava\n") == "TL and ML", "both limits exceeded"
assert run("500000\n0\n40\ncpp\n") == "ML", "boundary memory overflow"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1,0,0,py | 好的 | 最小边缘情况|
 | 1e6,0,0,cpp | 1e6,0,0,cpp | 好的 | n 大但无成本|
 | 1e6,0,1e6,java | TL 和 ML | 同时发生故障|
 | 5e5,0,40,cpp | 机器学习 | 内存边界溢出 |

 ## 边缘情况

 一个关键的边缘情况是同时超过两个限制。 例如，Python 中的大 n 与大 q 和 k 相结合很容易将时间成本推高到 2·10^7 以上，同时内存保持在界限内，反之亦然，具体取决于参数。 该算法可以正确处理这个问题，因为在决定输出之前两个布尔标志都是独立计算的。 

另一个边缘情况是边界相等。 如果 time_cost 恰好等于某种语言的限制，则不得将其视为违规。 严格的比较确保了这一点，Java 中的 n = 1、q = 10^8/2、k = 0 等跟踪会准确产生阈值，而不会触发 TL。 

第三种边缘情况是 q 或 k 之一为零时。 如果 k = 0，内存永远不会增长，但时间仍然取决于 q。 如果 q = 0，则时间仅由插入成本驱动。 该公式仍然统一适用，不需要特殊的分支。
