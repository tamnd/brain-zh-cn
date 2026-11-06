---
title: "CF 188C-液晶模组"
description: "给定两个正整数，需要计算它们的最小公倍数。 最小公倍数，通常缩写为 LCM，是可以被两个数整除且不留余数的最小正整数。"
date: "2026-06-04T23:19:02+07:00"
tags: ["codeforces", "competitive-programming", "*special", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 188
codeforces_index: "C"
codeforces_contest_name: "Surprise Language Round 6"
rating: 1400
weight: 188
solve_time_s: 182
verified: true
draft: false
---

[CF 188C - LCM](https://codeforces.com/problemset/problem/188/C)

 **评分：** 1400
 **标签：** *特殊、实现、数学
 **求解时间：** 3m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定两个正整数，需要计算它们的最小公倍数。 最小公倍数，通常缩写为 LCM，是可以被两个数整除且不留余数的最小正整数。 

例如，如果数字是 10 和 42，则 210 可以同时被 10 和 42 整除，并且没有更小的正数具有该属性。 

限制非常小。 这两个数字最多为 1000，因此即使效率相当低的方法也会很快完成。 也就是说，这个问题本质上是一个数学问题，有一个标准公式可以立即计算出答案。 由于输入仅包含两个数字，因此运行时间实际上是恒定的。 

一个常见的错误是直接将数字相乘并假设乘积始终是 LCM。 

考虑：```
Input:
6 8
```正确答案是：```
24
```粗心的实现可能会输出：```
48
```因为 6 × 8 = 48。乘积可以被两个数字整除，但它不是最小的此类值。 

当一个数字已经整除另一个数字时，就会出现另一种微妙的情况。```
Input:
5 10
```正确答案是：```
10
```较大的数字已经是两个值的公倍数。 退回产品 50 是不正确的。 

## 方法

 最直接的方法就是暴力破解。 从两个数字中较大的一个开始，重复测试连续的整数，直到找到一个可被两个输入整除的整数。 第一个这样的数字是 LCM。 

这是可行的，因为 LCM 的定义正是“最小正公倍数”。 最终必须出现公倍数，因此搜索终止。 

尽管限制很小，但蛮力也会做不必要的工作。 在最坏的情况下，我们可能会测试许多候选数才能得出答案。 

关键观察是最大公约数 (GCD) 和最小公倍数之间的关系：$$\text{LCM}(a,b)\times\text{GCD}(a,b)=a\times b$$这个公式之所以有效，是因为 GCD 代表将两个数字相乘时计算两次的因子。 除以 GCD 可以消除重复项。 

一旦我们使用欧几里得算法计算 GCD，LCM 立即如下：$$\text{LCM}(a,b)=\frac{a\times b}{\text{GCD}(a,b)}$$欧几里得算法运行速度极快，使得这种方法既优雅又高效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(LCM(a,b)) | O(1) | O(1) | 接受这些限制，但效率低下 |
 | 最佳 | O(log(min(a,b))) | O(log(min(a,b))) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取整数`a`和`b`。 
2. 计算`g = gcd(a, b)`使用欧几里得算法。 

欧几里得算法反复替换`(a, b)`和`(b, a % b)`直到第二个值变为零。 剩余的非零值是 GCD。 
3. 使用以下方法计算最小公倍数：$$\text{lcm}=\frac{a\times b}{g}$$除法必须由 GCD 进行，因为公因数在乘积中被计算了两次。 
4. 输出结果LCM。 

### 为什么它有效

 正确性来自于身份$$\text{LCM}(a,b)\times\text{GCD}(a,b)=a\times b.$$GCD 恰好包含两个数字共有的因子。 相乘时`a`和`b`，这些共同因素出现两次。 除以 GCD 会删除每个共享因子的一个副本，留下仍包含两个输入所需的所有素因子的最小数字。 这个数字正是最小公倍数。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

a, b = map(int, input().split())

print(a * b // gcd(a, b))
```该解决方案读取两个整数并使用 Python 的内置计算它们的最大公约数`gcd`功能。 

公式`a * b // gcd(a, b)`直接实现了GCD和LCM之间的数学关系。 使用整数除法是因为保证结果是整数。 

值得记住的一个实现细节是操作顺序。 乘法应该在除法之前进行。 在具有固定宽度整数类型的语言中，这可能会导致溢出，但 Python 整数会自动增长，因此这里没有风险。 

## 工作示例

 ### 示例 1

 输入：```
10 42
```| 步骤| 一个 | 乙| GCCD | 液晶显示器|
 | --- | --- | --- | --- | --- |
 | 读取输入| 10 | 10 42 | 42 - | - |
 | 计算 GCD | 10 | 10 42 | 42 2 | - |
 | 计算 LCM | 10 | 10 42 | 42 2 | 210 | 210

 输出：```
210
```此示例显示了数字共享一个公因数的标准情况。 GCD 为 2，因此将乘积 420 除以 2 得到最小公倍数 210。 

### 示例 2

 输入：```
5 10
```| 步骤| 一个 | 乙| GCCD | 液晶显示器|
 | --- | --- | --- | --- | --- |
 | 读取输入| 5 | 10 | 10 - | - |
 | 计算 GCD | 5 | 10 | 10 5 | - |
 | 计算 LCM | 5 | 10 | 10 5 | 10 | 10

 输出：```
10
```该迹线演示了一个数字除另一个数字的情况。 LCM 只是较大的值。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(log(min(a, b))) | O(log(min(a, b))) | 欧几里得算法在对数时间内计算 GCD |
 | 空间| O(1) | O(1) | 仅存储了几个变量|

 当输入不超过 1000 时，该解决方案基本上可以立即运行，并且使用的内存可以忽略不计。 它很容易符合给定的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io
from math import gcd

def solve():
    a, b = map(int, input().split())
    print(a * b // gcd(a, b))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    global input
    input = sys.stdin.readline

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return out

# provided sample
assert run("10 42\n") == "210\n", "sample 1"

# custom cases
assert run("1 1\n") == "1\n", "minimum values"
assert run("5 10\n") == "10\n", "one divides the other"
assert run("6 8\n") == "24\n", "shared factors"
assert run("1000 1000\n") == "1000\n", "maximum equal values"
assert run("999 1000\n") == "999000\n", "coprime near upper bound"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`1`| 最小有效输入 |
 |`5 10`|`10`| 一个数除另一个数 |
 |`6 8`|`24`| 正确处理共享因素|
 |`1000 1000`|`1000`| 上限相同的值 |
 |`999 1000`|`999000`| 接近最大约束的互质数 |

 ## 边缘情况

 考虑输入：```
5 10
```该算法计算：```
gcd(5, 10) = 5
lcm = (5 × 10) / 5 = 10
```输出是：```
10
```这可以正确处理一个数字已经是另一个数字的倍数的情况。 

现在考虑：```
6 8
```该算法计算：```
gcd(6, 8) = 2
lcm = (6 × 8) / 2 = 24
```输出是：```
24
```这证实了除以 GCD 可以从乘积中删除重复的公因子。 

最后，考虑相同的数字：```
1000 1000
```计算变为：```
gcd(1000, 1000) = 1000
lcm = (1000 × 1000) / 1000 = 1000
```结果正是原始数字，当两个输入相同时，它是正确的最小公倍数。
