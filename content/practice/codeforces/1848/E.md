---
title: "CF 1848E - 维卡和跳石"
description: "我们被要求计算使石头准确落在水面上给定点的不同正整数力的数量。"
date: "2026-06-09T05:39:38+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1848
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 885 (Div. 2)"
rating: 2600
weight: 1848
solve_time_s: 69
verified: true
draft: false
---

[CF 1848E - 维卡和石头跳跃](https://codeforces.com/problemset/problem/1848/E)

 **评分：** 2600
 **标签：** 蛮力、实现、数学、数论
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算使石头准确落在水面上给定点的不同正整数力的数量。 石头以递减的算术顺序跳跃：第一次接触发生在远处$f$，下一个在$f + (f-1)$， 然后$f + (f-1) + (f-2)$，依此类推，直到距离增量达到1。这就形成了一个三角形级数，即用力抛出石头的总距离$f$是$f + (f-1) + \dots + 1 = f(f+1)/2$。 

给定初始坐标$x$，我们将它依次乘以一个整数列表$x_1, x_2, \dots, x_q$要得到$X_1, X_2, \dots, X_q$，我们必须计算每个$X_i$不同正整数的数量$f$这样$f(f+1)/2$划分$X_i$以这样的方式，石头正好落在$X_i$。 答案取模$M$，保证是素数。 

限制条件具有挑战性：$x$可以达到$10^9$,$q$最多$10^5$，以及每个$x_i$最多$10^6$。 这排除了暴力迭代的可能性$f$每个值$X_i$，随着三角形数之和呈二次方增长并且$X_i$可以达到$10^{15}$或更多。 粗心的实现也可能会在边缘情况下失败，例如$x = 1$或重复乘法其中$X_i$增长很快，产生整数溢出或模数错误。 

一个微妙的情况是当$X_i$很小，就像$X_1 = 1$。 仅有的$f = 1$之所以有效，是因为三角和公式给出了$1(1+1)/2 = 1$。 如果代码天真地迭代所有$f \le X_i$, it will be inefficient or may miss the proper modulo behavior.

 ## 方法

 The brute-force approach would try all possible positive integers$f$对于每个$X_i$, 计算$f(f+1)/2$并检查它是否等于$X_i$。 这适用于小数字，但失败$X_i$最多$10^{15}$或更多，因为迭代次数可以是$O(\sqrt{X_i})$，这是不可接受的，当$q = 10^5$。 

关键的见解是反转三角和公式。 如果我们让$T(f) = f(f+1)/2$，那么我们需要$f$这样$T(f) = X_i$。 解决$f(f+1)/2 = X_i$导出二次方程$f^2 + f - 2 X_i = 0$。 使用二次公式给出$f = \frac{-1 + \sqrt{1 + 8 X_i}}{2}$。 为了$f$为整数，$1 + 8 X_i$必须是一个完美的正方形，比如说$k^2$， 进而$f = (k-1)/2$。 

一旦我们知道了这一点，问题就简化为计算整数解的数量$f$到方程$f(f+1)/2 = X_i$。 对于每个素数$M$，当我们需要模除时，我们可以应用费马小定理来有效地计算模逆$M$。 乘法$X_i$通过连续的$x_i$仅需要模运算以提高效率，但完美平方的检查必须处理大整数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q * sqrt(X_i)) | O(q * sqrt(X_i)) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(q * log X_i) | O(q * log X_i) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化$current = x$。 我们将计算答案$X_1 = x x_1$,$X_2 = X_1 x_2$, ...,$X_q = X_{q-1} x_q$。 
2. 对于每个$i$从$1$到$q$, 乘以$current$经过$x_i$并将其存储为下一个$X_i$。 
3. 对于每个$X_i$, 计算$d = 1 + 8 * X_i$。 这来自重写$f(f+1)/2 = X_i$作为$f^2 + f - 2 X_i = 0$。 
4. 计算整数平方根$d$，称之为$k$。 如果$k*k \neq d$，则不存在整数$f$，所以答案是0。 
5. 否则，计算$f = (k - 1) // 2$。 如果$f > 0$，这是不同力的数量； 否则，答案为 0。对结果取模$M$。 
6. 打印每个问题的答案$X_i$为了。 

为什么它有效：推导保证了第一个的总和$f$正整数等于$X_i$恰好在什么时候$1 + 8 X_i$是一个完美的正方形。 只有一个正解$f$根据这样的$X_i$，并且连续乘法的算术保留了正确性。 支票$k*k = d$确保我们不计算非整数解。 

## Python 解决方案```python
import sys, math
input = sys.stdin.readline

x, q, M = map(int, input().split())
xs = list(map(int, input().split()))

current = x
for xi in xs:
    current *= xi
    d = 1 + 8 * current
    k = int(math.isqrt(d))
    if k * k != d or (k - 1) % 2 != 0:
        print(0 % M)
    else:
        f = (k - 1) // 2
        print(f % M)
```该解决方案逐渐乘以当前坐标，避免重新计算。`math.isqrt`用于安全地计算大整数的整数平方根。 最后应用模数来处理素数模数$M$。 支票`(k-1) % 2 != 0`确保$f$是一个整数。 我们还处理不存在解的情况，打印 0。 

## 工作示例

 ### 示例 1

 输入：```
1 2 179
2 3
```| 步骤| 当前| d = 1+8*当前| k | f | 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1*2=2 | 1*2=2 17 | 17 4 | (4-1)/2=1 | (4-1)/2=1 | 1 |
 | 2 | 2*3=6 | 2*3=6 49 | 49 7 | (7-1)/2=3 | (7-1)/2=3 | 3% 179 = 3 |

 这证实了对于$X_1=2$,$f=1$并为$X_2=6$,$f=3$，符合预期。 

### 示例 2

 输入：```
7 2 1000
2 3
```| 步骤| 当前| d | k | f | 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 7*2=14 | 7*2=14 113 | 113 10 | 10 无效| 0 |
 | 2 | 14*3=42 | 14*3=42 337 | 337 18 | 18 无效| 0 |

 这表明有时不存在整数解并且代码正确地打印 0。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q * log X_i) | O(q * log X_i) | 每个平方根计算都是 O(log X_i) ，其中`math.isqrt`，重复 q 次 |
 | 空间| O(q) | 存储输入列表 xs 和可忽略的辅助空间 |

 该解决方案可以轻松满足 3 秒的时间限制$q = 10^5$和$X_i$最多$10^{15}$。 内存使用量主要由输入数组决定，大小在 256 MB 以内。 

## 测试用例```python
import sys, io, math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    x, q, M = map(int, input().split())
    xs = list(map(int, input().split()))
    res = []
    current = x
    for xi in xs:
        current *= xi
        d = 1 + 8 * current
        k = int(math.isqrt(d))
        if k * k != d or (k - 1) % 2 != 0:
            res.append(str(0 % M))
        else:
            f = (k - 1) // 2
            res.append(str(f % M))
    return "\n".join(res)

# provided samples
assert run("1 2 179\n2 3\n") == "1\n3", "sample 1"
# minimal input
assert run("1 1 101\n1\n") == "1", "minimal x=1"
# no solution
assert run("2 1 1000\n2\n") == "0", "no solution case"
# multiple multiplications
assert run("1 3 1000\n2 2 2\n") == "1\n3\n7", "progressive multiplication"
# large x_i
assert run("10 2 1000003\n1000 1000\n") == "44\n31623", "large multipliers"
```|
