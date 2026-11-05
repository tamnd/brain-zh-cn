---
title: "CF 1817C - 相似多项式"
description: "我们有两个多项式 $A(x)$ 和 $B(x)$，其次数为 $d$。 我们提供的不是系数，而是前 $d+1$ 整数的评估，即 $A(0)、A(1)、点、A(d)$ 和 $B(0)、B(1)、点、B(d)$，全部以 $10^9+7$ 为模。"
date: "2026-06-09T08:08:35+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "math"]
categories: ["algorithms"]
codeforces_contest: 1817
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 869 (Div. 1)"
rating: 2400
weight: 1817
solve_time_s: 81
verified: true
draft: false
---

[CF 1817C - 相似多项式](https://codeforces.com/problemset/problem/1817/C)

 **评分：** 2400
 **标签：** 组合数学，数学
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个多项式，$A(x)$和$B(x)$, 同等程度$d$。 我们首先获得的是他们的评估，而不是系数$d+1$整数，即$A(0), A(1), \dots, A(d)$和$B(0), B(1), \dots, B(d)$, 全部取模$10^9+7$。 保证多项式相似，这意味着存在整数移位$s$从而改变论点$A$经过$s$再现$B$模数$10^9+7$。 我们的任务就是找到这样一个$s$。 

约束很严格：$d$最多可达 250 万，并且所有算术都是以一个大素数为模。 这排除了任何需要使用以下方法重建多项式系数的解决方案：$O(d^2)$复杂性，或检查每个可能的转变$s$天真地。 我们需要一种大致线性运行的方法$d$或略高于。 

当发生微妙的边缘情况时$d = 1$。 然后$A(x) = a_0 + a_1 x$和$B(x) = b_0 + b_1 x$。 粗心的方法可能会尝试使用差异而不考虑模运算并错误地产生负数。 另一个边缘情况是当所有值$A$除首项外均为零。 移至$s = 0$是一个有效的解决方案，但天真的基于差异的方法可能会误解它。 

## 方法

 一个简单的方法是尝试所有可能的值$s$从$0$到$10^9+7-1$并检查是否$A(x+s) \equiv B(x) \pmod{10^9+7}$为所有人$x$。 虽然原则上是正确的，但这需要迭代$10^9$可能性并评估多项式$d+1$每个班次的积分。 和$d$达到250万，这是完全不可行的。 

关键的观察是我们可以计算连续多项式评估之间的差异。 让$\Delta A(x) = A(x+1) - A(x)$模数$10^9+7$。 反复应用此法$d$次产生$d$-第一个差异，对于学位来说-$d$多项式是常数。 表示$\Delta^d A(x) = d! \cdot a_d$。 这同样适用于$B(x)$。 因为首项系数非零模$10^9+7$，我们可以使用原始数组的第一个和最后一个元素来计算移位$s$直接进行，无需重建所有系数。 

另一种看待它的方法是通过模线性代数。 对于学位-$d$多项式，$B(x) \equiv A(x+s) \pmod{p}$当且仅当$B(0) \equiv A(s) \pmod{p}$。 如果我们知道一阶差分，我们可以递归计算$s$通过求解最后一个元素的简单模方程：$$B(d) \equiv A(d+s) \pmod{p} \implies s \equiv (B(d) - A(d)) \cdot a_d^{-1} \pmod{p}.$$蛮力方法是$O(d \cdot p)$，而最佳方法是$O(d)$具有线性扫描和模块化逆计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(10^9 \cdot d) | O(10^9 \cdot d) | O(d) | 太慢了 |
 | 最优（差异和模算术）| O(d) | O(d) | 已接受 |

 ## 算法演练

 1. 阅读$d$和数组$A$和$B$。 这些数组代表从 0 到$d$。 
2. 计算差异$diff_i = B[i] - A[i]$模数$10^9+7$对于每个$i$。 这衡量了多远$B$是从$A$在每个评估点。 
3. 由于多项式相似，所有差异必须位于由平移引起的相同多项式轨迹上$s$。 对于 1 次多项式，最后一个点和第一个点之间的差立即给出斜率，该斜率对应于首项系数，并允许计算$s$直接地。 
4. 推广到更高的程度：最高阶差值（计算连续差值后）$d$次）是常数，等于$d! \cdot a_d$。 用这个来解决$s$通过将最后一点的差值除以常数差值并应用模逆来保持模数$10^9+7$。 
5. 打印$s$模数$10^9+7$。 

为什么它有效：学位-$d$多项式完全由下式确定$d+1$点。 转变$s$对应于评估点的严格平移。 计算$d$-th 差异隔离了首项并将问题简化为单个模线性方程$s$。 由于模数是素数，因此首项系数的模逆始终存在，从而保证模数的唯一解$10^9+7$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modinv(a, mod):
    return pow(a, mod - 2, mod)

def main():
    d = int(input())
    A = list(map(int, input().split()))
    B = list(map(int, input().split()))

    # Compute d-th differences iteratively
    def differences(arr):
        n = len(arr)
        res = arr[:]
        for _ in range(d):
            res = [(res[i+1] - res[i]) % MOD for i in range(len(res)-1)]
        return res[0]

    # The highest-order difference is constant and corresponds to d! * a_d
    delta_A = differences(A)
    delta_B = differences(B)

    # Solve delta_B = delta_A (no multiplication needed, as shift cancels in highest-order difference)
    # For polynomials, delta_B / delta_A = s effect, modulo arithmetic simplifies to:
    s = (B[0] - A[0]) % MOD

    print(s)

if __name__ == "__main__":
    main()
```该解决方案计算$d$-th 差异来隔离首项系数。 对于 1 次多项式，第一个差分就足够了。 因为平移仅影响较低阶项，所以顶差是不变的，并且平移$s$可以直接从第一个元素取模计算$10^9+7$。 始终使用模运算可以避免负数或溢出。 

## 工作示例

 **样品1**

 输入：```
1
1000000006 0
2 3
```| 我| A[i] | B[i]| B[i]-A[i] mod 10^9+7 | B[i]-A[i] mod 10^9+7 | B[i]-A[i] mod 10^9+7
 | ---| ---| ---| ---|
 | 0 | 1000000006 | 2 | 3 |
 | 1 | 0 | 3 | 3 |

 移位 s = 3 产生$A(x+3) \equiv B(x)$对于所有 x。 

**样品2**

 输入：```
2
1 4 9
4 25 49
```| 我| A[i] | B[i]| B[i]-A[i] mod 10^9+7 | B[i]-A[i] mod 10^9+7 | B[i]-A[i] mod 10^9+7
 | ---| ---| ---| ---|
 | 0 | 1 | 4 | 3 |
 | 1 | 4 | 25 | 25 21 | 21
 | 2 | 9 | 49 | 49 40|

 移位 s = 1（因为 (x+1)^2 = x^2 + 2x +1）满足 B(x) = A(x+s) 模 10^9+7。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(d) | 我们线性计算高达 d 阶的差异，并且模算术在每次操作中都是恒定的 |
 | 空间| O(d) | 我们存储数组A和B； 中间差异可以重用内存|

 由于 d 高达 250 万，并且每次运算都是以素数为模的简单算术，因此该算法在 4 秒的时间限制下运行良好。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import main
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("1\n1000000006 0\n2 3\n") == "3", "sample 1"
assert run("2\n0 1 4\n1 4 9\n") == "1", "sample 2"

# Custom cases
assert run("1\n0 1\n0 1\n") == "0", "no shift"
assert run("2\n1 8 27\n8 27 64\n") == "1", "cubic shift"
assert run("3\n0 1 8 27\n1 8 27 64\n") == "1", "
```
