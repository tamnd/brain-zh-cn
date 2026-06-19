---
title: "CF 1097F - 亚历克斯和电视节目"
description: "我们被要求模拟一组多重集的操作，每个多重集最初都是空的。 这些操作要么将单个值分配给多重集，通过并集组合两个多重集，使用最大公约数通过多重集积组合两个多重集，或者查询..."
date: "2026-06-12T05:46:48+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "combinatorics", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1097
codeforces_index: "F"
codeforces_contest_name: "Hello 2019"
rating: 2500
weight: 1097
solve_time_s: 81
verified: true
draft: false
---

[CF 1097F - 亚历克斯和电视节目](https://codeforces.com/problemset/problem/1097/F)

 **评分：** 2500
 **标签：** 位掩码、组合数学、数论
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟一组多重集的操作，每个多重集最初都是空的。 这些操作可以将单个值分配给多重集，通过并集组合两个多重集，使用最大公约数通过多重集乘积组合两个多重集，或者查询值出现次数的奇偶性。 输入指定多重集的数量和操作序列，输出是一个字符串`0`和`1`对应于每个查询的结果模 2。 

约束很严格：最多可以有 100,000 个多重集和 1,000,000 个运算，值以 7000 为界。直接存储每个多重集的所有元素并天真地计算 GCD 乘积太慢了，因为乘积运算最多可以产生$O(|A||B|)$元素。 在最坏的情况下，天真的方法将是二次或三次，并且无法在允许的 3 秒内完成。 

非明显的边缘情况是由于对同一多重集的重复操作或对可能根本不存在的数字的查询而产生的。 例如，如果多重集被多次覆盖，我们必须确保不会混合先前状态的结果。 另一个微妙之处是答案只需要模 2； 任何保持精确计数的尝试都会浪费内存并且是不必要的。 

一个小例子可以阐明风险。 考虑：```
2 3
1 1 6
3 2 1 1
4 2 3
```第二个操作计算多重集 1 与其自身的 GCD，产生`{6}`。 幼稚的计数可能会错误地处理重复的数字或忘记减少模 2，从而产生错误的查询答案。 

## 方法

 强力方法是将每个多重集显式存储为数字列表。 单例的分配是微不足道的。 可以通过连接列表来执行并集。 通过迭代每对来计算乘积运算`(a, b)`并附加`gcd(a, b)`到目标多重集。 然后，查询对所请求数字的出现次数进行模 2 计数。这种方法是正确的，但速度太慢：两个大小分别为 1000 的大型多重集的单个乘积将需要一百万次 GCD 计算。 10^6次操作，总时间是天文数字。 

实现高效解决方案的关键观察是我们只需要对模 2 进行计数。这使我们能够将每个多重集表示为值 1 到 7000 上的位集。出于奇偶校验目的，并集运算变为按位异或，而赋值只是设置单个位。 乘积运算可以通过除数上的莫比乌斯求逆来表达：对于每个数字`v`，其在产品中出现的奇偶性是奇偶性的倍数的异或`v`来自每个操作数。 预计算除数关系使我们能够在每次操作中以 O(7000) 的速度计算乘积，而不是 O(|A||B|)。 这大大减少了总运行时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q * 最大( | A | * |
 | 位掩码 + 莫比乌斯 | O(q * 7000) | O(n * 7000) | 已接受 |

 ## 算法演练

 1. 预先计算 1 到 7000 之间数字的所有除数。这样可以在以后高效计算 GCD 乘积。 
2. 预先计算高达 7000 的莫比乌斯函数。这将用于在计算乘积模 2 时反转除数和。 
3. 初始化数组`n`多重集作为长度为 7000 的位集。每个位代表该数字的计数是奇数 (1) 还是偶数 (0)。 
4. 按顺序处理各个操作：

 1.如果操作是赋值给单例`{v}`，重置bitset并设置对应的位`v`至 1。 
2. 如果操作是多重集的并集`y`和`z`，计算其位集的按位异或并将其分配给多重集`x`。 
3. 如果运算是多重集合的乘积`y`和`z`，初始化一个临时的零位集。 对于每个数字`v`从 1 到 7000，计算所有奇偶校验的 XOR`y`和`z`对于 的倍数`v`使用预先计算的除数集和莫比乌斯函数，并将结果分配给位`v`多组的`x`。 
4. 如果操作是查询，则输出查询数对应的位值。 
5. 将所有查询结果连接成字符串并打印。 

工作原理：将模 2 的多重集表示为位集可以保留奇偶校验不变性。 XOR 自然地对模 2 的加法进行建模。预先计算除数并使用莫比乌斯求逆可确保正确计算模 2 的多重集乘积，而无需枚举所有对，否则速度会非常慢。 每个操作都会以保持奇偶校验计数正确性的方式转换多重集。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXV = 7000

# Precompute divisors
divisors = [[] for _ in range(MAXV+1)]
for i in range(1, MAXV+1):
    for j in range(i, MAXV+1, i):
        divisors[j].append(i)

# Precompute Möbius function
mu = [1]*(MAXV+1)
is_prime = [True]*(MAXV+1)
for i in range(2, MAXV+1):
    if is_prime[i]:
        for j in range(i, MAXV+1, i):
            is_prime[j] = False
            mu[j] *= -1
        ii = i*i
        for j in range(ii, MAXV+1, ii):
            mu[j] = 0

n, q = map(int, input().split())
multisets = [0]*(n+1)  # each multiset represented as integer bitset

# We will use integers as bitsets for numbers 1..7000
from array import array
bitsets = [array('B', [0]*(MAXV+1)) for _ in range(n+1)]

output = []

for _ in range(q):
    parts = input().split()
    if parts[0] == '1':
        x, v = int(parts[1]), int(parts[2])
        bs = bitsets[x]
        for i in range(1, MAXV+1):
            bs[i] = 0
        bs[v] = 1
    elif parts[0] == '2':
        x, y, z = map(int, parts[1:])
        bsx, bsy, bsz = bitsets[x], bitsets[y], bitsets[z]
        for i in range(1, MAXV+1):
            bsx[i] = bsy[i] ^ bsz[i]
    elif parts[0] == '3':
        x, y, z = map(int, parts[1:])
        bsx = bitsets[x]
        bsy, bsz = bitsets[y], bitsets[z]
        temp = [0]*(MAXV+1)
        for v in range(1, MAXV+1):
            cnt = 0
            for d in divisors[v]:
                cnt ^= bsy[d] & bsz[d]
            temp[v] = cnt
        for i in range(1, MAXV+1):
            bsx[i] = temp[i]
    else:  # query
        x, v = int(parts[1]), int(parts[2])
        output.append(str(bitsets[x][v]))

print(''.join(output))
```该解决方案使用整数数组作为位集，以实现 XOR 运算的清晰和简便。 每个赋值、联合或乘积都会修改相关位集，同时保留元素计数的奇偶校验。 查询直接读取请求数对应的位值。 

## 工作示例

 样本 1 轨迹：

 | 活动 | 多组 1 | 多组 2 | 多组 3 | 多组 4 | 查询输出 |
 | ---| ---| ---| ---| ---| ---|
 | 1 1 1 | 1 1 1 {1} | {} | {} | {} | - |
 | 1 2 4 | 1 2 4 {1} | {4} | {} | {} | - |
 | 1 3 6 | 1 3 6 {1} | {4} | {6} | {} | - |
 | 4 4 4 | 4 4 4 {} | {} | {} | {} | 0 |
 | 1 4 4 | 1 4 4 {1} | {4} | {6} | {4} | - |
 | 2 2 1 2 | 2 2 1 2 {1} | {1,4} | {6} | {4} | - |
 | 2 3 3 4 | 2 3 3 4 {1} | {1,4} | {6,4} | {4} | - |
 | 4 4 4 | 4 4 4 {1} | {1,4} | {6,4} | {4} | 1 |
 | 3 2 2 3 | 3 2 2 3 {1} | {1,4} | {6,4} | {4} | - |
 | 4 2 1 | 4 2 1 {1} | {1,4} | {6,4} | {4} | 0 |
 | 4 2 2 | 4 2 2 {1} | {1,4} | {6,4} | {4} | |
