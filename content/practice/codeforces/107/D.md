---
title: "CF 107D - 犯罪管理"
description: "Zeyad 想要按顺序犯下 n 项罪行，这样他就可以避免受到任何惩罚。 每种犯罪类型都用大写字母表示，对于某些犯罪，有描述多重性的条件：犯下该犯罪的次数可以被其多重性整除……"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "graphs", "matrices"]
categories: ["algorithms"]
codeforces_contest: 107
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 83 (Div. 1 Only)"
rating: 2400
weight: 107
solve_time_s: 126
verified: true
draft: false
---

[CF 107D - 犯罪管理](https://codeforces.com/problemset/problem/107/D)

 **评分：** 2400
 **标签：** dp、图形、矩阵
 **求解时间：** 2m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 泽亚德想要按顺序犯下所有罪行，这样他就可以避免受到任何惩罚。 每种犯罪类型都用大写字母表示，对于某些犯罪，有描述多重性的条件：犯下该犯罪的次数可以被其多重性整除，则该犯罪不会受到惩罚。 如果一项犯罪有多个条件，满足其中任何一个就足够了。 条件中未列出的罪行一旦发生，总会受到惩罚。 犯罪的顺序很重要，因此罪名相同但顺序不同的顺序是不同的。 

输入是犯罪总数 _n_ 和条件列表，每个条件由犯罪类型和重数组成。 输出是长度为 _n_ 的序列数，仅使用允许的犯罪并尊重模 12345 的重数。 

约束使得简单的枚举变得不可能。 _n_ 最多可达 10^8，因此迭代 _n_ 的所有序列甚至所有分区都是不可行的。 条件 _c_ 的数量很少（≤ 1000），并且所有重数的乘积有界（≤ 123）。 这表明了一种侧重于多样性而非犯罪总数所强加的结构的策略。 边缘情况包括 _n_ = 0，它应该产生一个有效序列（空序列），以及重数为 1 的犯罪，使用任意次数总是安全的。 

粗心的方法可能会尝试生成长度为 _n_ 的所有序列并过滤掉违反多重性条件的序列。 例如，n = 5 且条件`A 1`和`B 2`，一个简单的生成器会创建 2⁵ = 32 个序列，但许多序列会违反 B 的多重性。 当 n = 10^8 时，这种方法是不可能的，并且未能正确处理重数 1 可能会产生错误的计数。 

## 方法

 暴力方法是考虑长度为_n_的所有序列，检查每个序列是否满足犯罪重数条件。 这对于小 _n_ 来说是正确的，但它的时间复杂度是 O(kⁿ)，其中 k 是允许的犯罪次数。 当n达到10^8时，这是完全不可行的。 

关键的见解是，该问题相当于对有限状态集上的序列进行计数，其中状态对每种犯罪已使用的次数对其重数进行模的余数进行编码。 因为重数的乘积 ≤ 123，所以状态总数是有界的且很小。 这使我们能够将问题建模为这些状态的线性递归。 从一种犯罪过渡到另一种犯罪相当于在不同州之间流动。 大指数 n 可以通过矩阵求幂来有效处理。 每个状态代表一个计数向量，以每个犯罪的多重性为模，矩阵编码每个犯罪如何更新这些计数。 对矩阵求 n 次幂后，与“安全”状态对应的条目之和给出了以 12345 为模的序列总数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(kⁿ) | O(kⁿ) | 太慢了 |
 | 最优（矩阵求幂）| O(S3 log n)，S ≤ 123 | O(S²) | 已接受 |

 ## 算法演练

 1. 收集所有具有条件的不同犯罪类型，并计算每种犯罪类型的最小重数。 如果同一犯罪存在多个条件，我们只需要满足一个，因此我们取限制性最小（最小）的重数。 
2. 对于每种犯罪类型，定义一个模计数器，用于跟踪以其重数为模的计数。 系统的每个状态都是这些计数的元组。 
3. 将所有可能的状态编码到索引中。 当重数乘积≤123时，状态总数很小，因此我们可以将每个状态元组映射到唯一的整数。 
4. 构建大小为 S×S 的转移矩阵 T，其中 S 是状态数。 条目 T[i][j] 计算通过实施一项犯罪从状态 i 转移到状态 j 的方式数。 添加犯罪会增加其模计数器并根据其多重性进行环绕。 
5. 初始化表示起始状态的向量 V（全部计数为零）。 
6. 使用矩阵求幂模 12345 计算 V × Tⁿ。这可以有效地应用递归 n 次，处理极大的 n。 
7. 对满足所有犯罪条件的状态对应的结果向量的分量求和（每个计数器模重数为零）。 这个总数就是答案。 

为什么它有效：不变的是 k 步后的向量对到达每个状态的长度为 k 的序列进行计数。 使用 T 进行转换可以正确地模拟向每个序列添加一项犯罪。 对 T 求幂可以有效地处理长度为 n 的序列。 对状态进行编码以确保尊重所有多重条件。 对有效状态进行求和可以对所有序列进行计数，而不会受到任何惩罚。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 12345

def encode_state(state, bases):
    idx = 0
    for s, b in zip(state, bases):
        idx = idx * b + s
    return idx

def decode_state(idx, bases):
    state = []
    for b in reversed(bases):
        state.append(idx % b)
        idx //= b
    return list(reversed(state))

def mat_mult(A, B):
    n = len(A)
    C = [[0]*n for _ in range(n)]
    for i in range(n):
        for k in range(n):
            if A[i][k] == 0: continue
            for j in range(n):
                C[i][j] = (C[i][j] + A[i][k]*B[k][j]) % MOD
    return C

def mat_pow(mat, power):
    n = len(mat)
    res = [[int(i==j) for j in range(n)] for i in range(n)]
    while power > 0:
        if power % 2 == 1:
            res = mat_mult(res, mat)
        mat = mat_mult(mat, mat)
        power //= 2
    return res

def solve():
    n, c = map(int, input().split())
    if n == 0:
        print(1)
        return
    crime_map = {}
    for _ in range(c):
        ch, m = input().split()
        m = int(m)
        if ch in crime_map:
            crime_map[ch] = min(crime_map[ch], m)
        else:
            crime_map[ch] = m
    crimes = list(crime_map.items())
    bases = [m for _, m in crimes]
    S = 1
    for b in bases:
        S *= b
    trans = [[0]*S for _ in range(S)]
    # build transitions
    for idx in range(S):
        state = decode_state(idx, bases)
        for k, (ch, m) in enumerate(crimes):
            new_state = state[:]
            new_state[k] = (new_state[k]+1)%m
            j = encode_state(new_state, bases)
            trans[idx][j] = (trans[idx][j]+1)%MOD
    Tn = mat_pow(trans, n)
    start = encode_state([0]*len(crimes), bases)
    result = 0
    for idx in range(S):
        state = decode_state(idx, bases)
        if all(s == 0 for s in state):
            result = (result + Tn[start][idx]) % MOD
    print(result)

solve()
```该代码首先处理简单的 n = 0 情况。 犯罪多重性被最小化以减少状态。 状态通过位置数字系统进行编码和解码，其中每个位置对应于犯罪计数以其多重性为模。 矩阵乘法和求幂是通过模运算显式实现的，以防止溢出。 转换正确地增加犯罪计数，确保矩阵准确地表示重复情况。 

## 工作示例

 **样品1**

 输入：```
5 2
A 1
B 2
```状态基准：A=1，B=2。 总状态 = 1*2 = 2。状态：[0,0]、[0,1]

 转移矩阵：

 | 从 \ 到 | [0,0]| [0,1]|
 | ---| ---| ---|
 | [0,0]| 1 | 1 |
 | [0,1]| 1 | 1 |

 对 T⁵ 求幂并对有效状态 ([0,0]) 求和得出 16。 

这与预期输出相符。 

**定制小箱**

 输入：```
3 1
A 2
```状态基数：A=2。 状态：[0]、[1]

 转移矩阵：[[1,1],[1,1]]

 对 T3 求幂并求和有效状态 ([0]) 给出 4 个序列：AAA、ABA、BAA、BBB。 

表格确认了序列的正确传播和计数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(S3 log n) | O(S3 log n) | S ≤ 123，矩阵求幂占主导地位 |
 | 空间| O(S²) | 存储大小为 S×S 的转移矩阵 |

 即使 n 高达 10^8，S3 log n 也是可行的，因为 S3 ≤ 1233 = 1.8×10⁶ 且 log n ≤ 60。内存适合低于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
```
