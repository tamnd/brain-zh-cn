---
title: "CF 2034A - 凯霍斯罗国王之谜"
description: "该问题要求我们找到一个满足相对于两个给定数字 $a$ 和 $b$ 的两个属性的数字。 具体来说，我们想要最小的整数 $m$，使得 $m$ 至少与两个数字之一一样大，并且 $m$ 除以 $a$ 后的余数等于..."
date: "2026-06-08T11:32:12+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "chinese-remainder-theorem", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 2034
codeforces_index: "A"
codeforces_contest_name: "Rayan Programming Contest 2024 - Selection (Codeforces Round 989, Div. 1 + Div. 2)"
rating: 800
weight: 2034
solve_time_s: 80
verified: true
draft: false
---

[CF 2034A - 凯霍斯罗国王之谜](https://codeforces.com/problemset/problem/2034/A)

 **评分：** 800
 **标签：** 暴力破解、中国剩余定理、数学、数论
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们找到一个满足相对于两个给定数字的两个属性的数字，$a$和$b$。 具体来说，我们想要最小的整数$m$这样$m$至少与两个数之一和其余数一样大$m$当除以$a$等于除以的余数$b$。 换句话说，如果您想象以$a$和$b$从零开始，$m$是两个序列在​​余数中“对齐”的第一个数字。 

输入由多个测试用例组成，每个测试用例提供$a$和$b$。 这两个值的上限都是 1000，测试用例的数量最多为 100。因为$a$和$b$相对较小，我们可以考虑在不超过时间限制的情况下迭代或计算倍数的方法。 

当发生微妙的边缘情况时$a = b$。 任何大于或等于的数字$a$自动满足余数条件，因此最小$m$简直就是$a$（或者$b$）。 另一种情况是当$a$和$b$是互质的。 余数仅在其最小公倍数之后才匹配，因此算法必须处理比任一输入大得多的数字。 粗心的强力检查可能会不必要地遍历每个整数，并且可能会错过第一个有效数字恰好是最小公倍数 (LCM)。 

## 方法

 暴力方法将从$\max(a, b)$并增加$m$直到$m \bmod a = m \bmod b$。 这是可行的，因为它直接实现了问题的条件，但对于大输入，其性能会下降。 例如，如果$a = 999$和$b = 1000$，第一个满足余数条件的数是$999 \cdot 1000 = 999000$。 为每个测试用例迭代近一百万个数字在这里是可行的，但效率低下，并且在更大的范围内会很慢。 

关键的见解来自于重写条件$m \bmod a = m \bmod b$。 这相当于说$m$留下相同的余数模最大公约数$a$和$b$。 更具体地说，如果我们让$d = \gcd(a, b)$，然后是数字$m$满足余数相等的正是以下形式$m = k \cdot \mathrm{lcm}(a, b)$对于某个整数$k \ge 1$。 最小的这样$m$那至少是$\max(a, b)$正好是最小公倍数$a$和$b$。 

因此，最佳方法是计算 LCM$a$和$b$对于每个测试用例并返回它。 这使用标准数论：$\mathrm{lcm}(a, b) = \frac{a \cdot b}{\gcd(a, b)}$。 这完全避免了迭代，并且对于给定的约束有效地工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 最坏情况 O(a*b) | O(1) | O(1) | 正确但在边缘情况下速度较慢 |
 | 最优（通过 GCD 的 LCM）| O(log(min(a,b))) | O(log(min(a,b))) | O(1) | O(1) | 快速并被接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 这决定了我们将处理多少对数字。 
2. 对于每个测试用例，读取整数$a$和$b$。 
3. 计算最大公约数$d = \gcd(a, b)$。 这使用了欧几里得算法，该算法非常高效并且需要$O(\log \min(a, b))$步骤。 
4. 使用以下方法计算最小公倍数$\mathrm{lcm}(a, b) = a \cdot b // d$。 这保证了可以被两者整除的最小数字$a$和$b$，这也满足$m \bmod a = m \bmod b$。 
5. 打印计算出的 LCM。 这是最小的$m$满足测试用例的两个条件。 

为什么有效：任何数字$m$和$m \bmod a = m \bmod b$必须是的倍数$\mathrm{lcm}(a, b)$因为余数重复 LCM 的每个倍数。 取第一个倍数可确保最小性，并且由于 LCM 始终大于或等于两者$a$和$b$，它满足“至少一个$a, b$“条件。欧几里得算法确保 LCM 计算正确且高效。

 ## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    a, b = map(int, input().split())
    lcm = a * b // math.gcd(a, b)
    print(lcm)
```该代码从快速输入读取开始。 对于每个测试用例，它解析两个数字，使用 Python 的内置函数计算它们的 GCD`math.gcd`，然后通过整数除法计算 LCM 以避免浮点错误。 最后，它立即打印结果。 处理多个测试用例非常简单，并且不存在相差一的错误，因为 LCM 本质上满足最小条件。 

## 工作示例

 输入示例：```
4 6
472 896
```| 一个 | 乙| gcd(a,b) | gcd(a,b) | lcm(a,b) | 米（输出）|
 | --- | --- | --- | --- | --- |
 | 4 | 6 | 2 | 12 | 12 12 | 12
 | 472 | 472 896 | 16 | 16 52864 | 52864 |

 在第一种情况下，LCM(4,6) = 12，这是第一个数字，其中 12 % 4 = 12 % 6 = 0。对于第二种情况，LCM(472, 896) = 52864，满足相同的余数条件。 这证实了计算 LCM 直接找到了最小$m$高效。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t * log(min(a,b))) | O(t * log(min(a,b))) | 通过欧几里得算法进行的每个 GCD 计算都是两个数字中较小的一个的对数。 |
 | 空间| O(1) | O(1) | 每个测试用例只需要几个变量； 没有大型数据结构。 |

 给定$t \le 100$和$a, b \le 1000$，该算法最多执行几千个 GCD 步骤，完全在 1 秒的时间限制内。 

## 测试用例```python
import sys, io
import math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        a, b = map(int, input().split())
        lcm = a * b // math.gcd(a, b)
        output.append(str(lcm))
    return "\n".join(output)

# Provided samples
assert run("2\n4 6\n472 896\n") == "12\n52864", "Sample test cases"

# Custom cases
assert run("1\n1 1\n") == "1", "Minimum equal values"
assert run("1\n1000 1000\n") == "1000", "Maximum equal values"
assert run("1\n2 3\n") == "6", "Small coprime numbers"
assert run("1\n5 7\n") == "35", "Another coprime example"
assert run("1\n8 12\n") == "24", "Shared divisors"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 | 1 1 | 最小输入，a = b |
 | 1000 1000 | 1000 1000 1000 | 1000 最大相等输入|
 | 2 3 | 6 | 小互质数 |
 | 5 7 | 35 | 35 互质数 |
 | 8 12 | 24 | 具有共享约数的数字 |

 ## 边缘情况

 对于输入`1 1`，GCD为1，LCM为1。算法正确返回1，立即满足余数条件。 

为了`1000 1000`，GCD = 1000，因此 LCM = 1000。此输出是第一个同时满足极小条件和余数相等的数字。 

对于互质数，例如`2 3`，余数的第一次对齐发生在 6 处，确认 LCM 方法可以正确处理互质数。 

对于具有公约数的数字，`8 12`，LCM = 24，这确实是大于任一输入且余数相等的最小数字。 每条轨迹都表明该算法可以准确地处理最小、最大、互质和共享除数输入。
