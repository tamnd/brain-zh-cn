---
title: "CF 1288A - 截止日期"
description: "对于每个测试用例，我们都有 n 天的截止日期和通常需要 d 天才能完成的程序。 在运行程序之前，我们可能会花x天的时间来优化它。"
date: "2026-06-11T19:00:43+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "math", "ternary-search"]
categories: ["algorithms"]
codeforces_contest: 1288
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 80 (Rated for Div. 2)"
rating: 1100
weight: 1288
solve_time_s: 117
verified: true
draft: false
---

[CF 1288A - 截止日期](https://codeforces.com/problemset/problem/1288/A)

 **评分：** 1100
 **标签：** 二分搜索、暴力破解、数学、三元搜索
 **求解时间：** 1m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个测试用例，我们都有一个截止日期`n`天和通常需要的程序`d`天才能完成。 

在运行程序之前，我们可能会花费`x`天优化它。 花费了这些之后`x`天，运行时间变为：$$\left\lceil \frac{d}{x+1} \right\rceil$$由于优化和执行不能同时发生，因此花费的总时间为：$$x + \left\lceil \frac{d}{x+1} \right\rceil$$我们必须判断是否存在某个非负整数`x`使得总时间最多为`n`。 

限制是主要挑战。 两个都`n`和`d`可以大到`10^9`，因此迭代每个可能的值`x`是不可能的。 即使一个测试用例也可能需要检查数十亿个候选者。 多达 50 个测试用例，任何解决方案都接近`O(d)`是完全不可行的。 

表达式$$f(x)=x+\left\lceil \frac{d}{x+1} \right\rceil$$具有有用的形状。 作为`x`增加，第一项增长，而第二项收缩。 最小值出现在这些效应相互平衡的点附近。 利用这种结构可以使问题变得简单。 

一些边缘情况可能会导致错误。 

考虑：```
1
1 1
```正确答案是`YES`因为选择`x = 0`给出总时间`1`。 仅检查正值的解决方案`x`会失败的。 

考虑：```
1
5 11
```答案是`NO`。 尽管优化有帮助，但没有任何价值`x`减少总时间`5`或更少。 诸如“继续优化直到运行时间变小时”之类的贪婪策略并不能保证最小总数。 

考虑：```
1
1000000000 1000000000
```答案是`YES`。 大值需要仔细的整数运算。 如果实现不小心，具有固定宽度整数的语言可能会溢出。 Python 会自动处理这个问题，但算法仍应避免不必要的大型计算。 

## 方法

 最直接的想法就是尝试每一个可能的优化量`x`。 对于每个候选人，我们计算$$x+\left\lceil \frac{d}{x+1} \right\rceil$$并检查是否最多`n`。 

这种强力方法是正确的，因为它审查了每一个合法选择。 问题是它的运行时间。 在最坏的情况下，`d`可以是`10^9`，因此检查来自的所有值`0`到`d`对于单个测试用例大约需要十亿次评估。 这已经远远超出了极限。 

要更快地找到东西，请查看函数$$f(x)=x+\left\lceil \frac{d}{x+1} \right\rceil.$$暂时忽略天花板给出$$x+\frac{d}{x+1}.$$这是一个经典的凸形表达。 最初，增加`x`有帮助，因为除法项下降得很快。 后来逐渐增加`x`伤害是因为线性项占主导地位。 

最小值出现在附近$$x \approx \sqrt d - 1.$$自从`d ≤ 10^9`，我们有$$\sqrt d \le 31623.$$这一观察改变了一切。 最佳值只能接近平方根，因此测试所有值大约就足够了`√d`。 每个测试用例仅花费大约三万次检查。 

另一种看待它的方式是 Codeforces 想要一种简单的数学暴力。 如果`x`变得比`√d`，线性项已经太昂贵，而除法项变化非常缓慢。 最小值无法隐藏在距离平方根区域太远的地方。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(d) | O(1) | O(1) | 太慢了|
 | 最佳 | O(√d) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于测试用例，首先检查是否`d ≤ n`。 

如果程序在截止日期前已经完成，则无需优化，立即得到答案`YES`。 
2. 计算`limit = ⌊√d⌋ + 2`。 

目标函数的最小值出现在附近`√d`，因此稍微检查一下超出该点就足够了。 
3. 对于每个整数`x`从`0`到`limit`, 计算$$x+\left\lceil \frac{d}{x+1} \right\rceil.$$上限可以使用整数算术计算：$$\left\lceil \frac{d}{x+1} \right\rceil = \frac{d+x}{x+1}$$与整数除法。 
4. 如果任何候选人的得分不超过`n`， 输出`YES`。 

我们只需要一个可行的优化量。 
5. 如果所有候选都失败，输出`NO`。 

### 为什么它有效

 功能$$f(x)=x+\left\lceil \frac{d}{x+1} \right\rceil$$是递增项和递减项之和。 它的最小值在这两种效应的平衡点附近达到，大约是`√d`。 

对于明显大于的值`√d`, 线性部分`x`已经超出了最小值可能出现的区域，而除法项仅略有变化。 检查所有值`0`大致通过`√d`保证我们遇到最小值或不比它差的值。 如果存在任何可行的解决方案，则这些检查值之一将满足截止日期条件。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

t = int(input())

for _ in range(t):
    n, d = map(int, input().split())

    ok = False
    limit = math.isqrt(d) + 2

    for x in range(limit + 1):
        total = x + (d + x) // (x + 1)
        if total <= n:
            ok = True
            break

    print("YES" if ok else "NO")
```循环结束`x`是解决方案的核心。 它不会探索所有可能的优化量，而是仅检查大约值`√d`。 

表达式```
(d + x) // (x + 1)
```实施上限划分$$\left\lceil \frac{d}{x+1} \right\rceil.$$一个常见的错误是使用普通的整数除法：```
d // (x + 1)
```它计算下限并可能错误地接受不可能的时间表。 

使用`math.isqrt(d)`避免浮点精度问题。 自从`d`可以达到`10^9`，任何一种方法都可以在这里工作，但整数平方根更干净、更精确。 

一旦找到可行值，算法就会停止，因为问题只是询问这样的值是否存在。 

## 工作示例

 ### 示例 1

 输入：```
n = 4
d = 5
```| x| 天花板 (5/(x+1)) | 总计 |
 | ---| ---| ---|
 | 0 | 5 | 5 |
 | 1 | 3 | 4 |

 在`x = 1`，总时间变为`4`，与截止日期相匹配。 

算法立即输出`YES`。 此示例表明，即使原始运行时间超过截止日期，少量优化也可能是有益的。 

### 示例 2

 输入：```
n = 5
d = 11
```| x| 天花板 (11/(x+1)) | 总计 |
 | ---| ---| ---|
 | 0 | 11 | 11 11 | 11
 | 1 | 6 | 7 |
 | 2 | 4 | 6 |
 | 3 | 3 | 6 |
 | 4 | 3 | 7 |
 | 5 | 2 | 7 |

 达到的最小总和是`6`，仍然大于`5`。 

由于没有检查值满足截止日期，所以答案是`NO`。 

此示例说明优化并不总是能够补偿较长的运行时间。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(√d) | 我们仅测试来自的值`0`到关于`√d`|
 | 空间| O(1) | O(1) | 仅存储了几个变量|

 自从`√10^9 ≈ 31623`，每个测试用例仅执行几万次迭代。 对于最多 50 个测试用例，这很容易满足时间限制，并且使用的内存可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io, math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    t = int(input())
    ans = []

    for _ in range(t):
        n, d = map(int, input().split())

        ok = False
        limit = math.isqrt(d) + 2

        for x in range(limit + 1):
            total = x + (d + x) // (x + 1)
            if total <= n:
                ok = True
                break

        ans.append("YES" if ok else "NO")

    return "\n".join(ans) + "\n"

# provided samples
assert run("3\n1 1\n4 5\n5 11\n") == "YES\nYES\nNO\n", "sample 1"

# minimum values
assert run("1\n1 1\n") == "YES\n", "minimum case"

# exact boundary where no optimization needed
assert run("1\n10 10\n") == "YES\n", "d equals n"

# impossible case
assert run("1\n1 100\n") == "NO\n", "far beyond deadline"

# maximum values
assert run("1\n1000000000 1000000000\n") == "YES\n", "maximum constraints"

# near optimum around sqrt(d)
assert run("1\n6 11\n") == "YES\n", "minimum total equals 6"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`|`YES`| 最小有效输入|
 |`10 10`|`YES`| 无需优化 |
 |`1 100`|`NO`| 显然不可能的时间表|
 |`1000000000 1000000000`|`YES`| 最大值|
 |`6 11`|`YES`| 最佳值恰好满足截止日期的边界 |

 ## 边缘情况

 考虑：```
1
1 1
```算法检查`x = 0`。$$0+\left\lceil \frac{1}{1}\right\rceil = 1$$自从`1 ≤ 1`，它输出`YES`。 这就是为什么搜索必须包括`x = 0`。 

考虑：```
1
10 10
```没有任何优化：$$0+\left\lceil \frac{10}{1}\right\rceil = 10$$条件已经成立。 算法立即找到可行值并返回`YES`。 

考虑：```
1
5 11
```检查总数为：$$11,7,6,6,7,\ldots$$最小值是`6`，仍然大于`5`。 检查所有相关值后大致`√11`，算法正确地得出结论，不存在可行的时间表并打印`NO`。 

考虑：```
1
1000000000 1000000000
```最优值出现在附近`√10^9 ≈ 31623`。 

例如：$$31622+\left\lceil \frac{10^9}{31623}\right\rceil \approx 63245$$远远低于`10^9`。 该算法快速找到这样的值并输出`YES`。 这证实了该实现可以有效地处理最大的输入。
