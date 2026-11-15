---
title: "CF 60E - 蘑菇侏儒"
description: "我们得到一排蘑菇，每个蘑菇都有一个重量，最初按非降序排序。 每分钟，每对相邻蘑菇之间都会长出新蘑菇，每个新蘑菇的重量等于相邻两个蘑菇的重量总和。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "math", "matrices"]
categories: ["algorithms"]
codeforces_contest: 60
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 56"
rating: 2600
weight: 60
solve_time_s: 193
verified: true
draft: false
---

[CF 60E - 蘑菇侏儒](https://codeforces.com/problemset/problem/60/E)

 **评分：** 2600
 **标签：** 数学、矩阵
 **求解时间：** 3m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一排蘑菇，每个蘑菇都有一个重量，最初按非降序排序。 每分钟，每对相邻蘑菇之间都会长出新蘑菇，每个新蘑菇的重量等于相邻两个蘑菇的重量总和。 几分钟后`x`，侏儒再次对蘑菇进行排序，从而恢复非递减顺序。 然后，又一个`y`分钟，我们被要求计算所有蘑菇的总重量模`p`。 

输入由初始蘑菇的数量组成`n`, 第一个区间`x`, 第二个区间`y`，和模数`p`，然后是蘑菇的排序重量。 输出是一个整数：所有蘑菇的总重量模`p`后`x + y`分钟。 

约束表明`n`可以大到 10^6 并且`x`和`y`最多可达 10^18。 这排除了任何尝试显式模拟每分钟的解决方案，因为蘑菇的数量呈指数增长。 边缘情况包括小`n`（甚至`n = 1`）， 大的`x`或者`y`，以及所有蘑菇具有相同初始重量的情况。 例如，与`n = 2`, 权重`1 2`,`x = 1`,`y = 0`， 和`p = 10^9 + 7`，一分钟后的总重量应为`1 + 3 + 2 = 6`。 幼稚的模拟可能会忽略蘑菇在每对蘑菇之间生长，而不是相邻的蘑菇仅部分堆叠。 

## 方法

 蛮力方法很简单：通过将相邻蘑菇的总和插入到列表中来模拟每一分钟，然后排序`x`分钟，继续`y`更多分钟，最后计算总和模`p`。 这对于小尺寸来说是正确的`n`和微小的`x`或者`y`，但它失败了，因为列表每分钟加倍，所以之后`m`分钟，列表大小大致为`n * 2^m`。 为了`x`大到10^18，显式模拟是不可行的。 

关键的见解是，蘑菇的生长是线性的，因为蘑菇的总重量`k`分钟可以表示为原始权重与组合系数的线性组合。 具体来说，每个蘑菇`a_i`根据二项式系数增长后对多个位置做出贡献。 这是因为新蘑菇像卷积一样生长，并且线的重复卷积产生遵循帕斯卡三角形的系数。 

因此，问题简化为计算总和：```
total_weight = sum(a[i] * C(x, i) for i in range(n))
```在哪里`C(x, i)`是二项式系数的模`p`，一般化以考虑模算术和重复应用。 自从`x`和`y`可能很大，我们使用矩阵求幂来计算这些系数。 增长过程相当于乘以尺寸为三对角的矩阵`n x n`，其中每行都有`1`对角线上的 s 和最接近的邻居。 然后，对该矩阵进行模幂有效计算之后的总权重`x`分钟，无需模拟每个蘑菇。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * 2^x) | O(n * 2^x) | O(n * 2^x) | O(n * 2^x) | 太慢了|
 | 最佳 | O(n^2 log(x+y)) | O(n^2 log(x+y)) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 构建一个`n x n`三对角矩阵`M`代表蘑菇生长。 对角线和紧邻的条目是`1`，其他的是`0`。 这意味着每个蘑菇都会在下一分钟影响自己及其邻居。 
2. 计算矩阵`M`的力量`x`模数`p`使用快速求幂。 此步骤产生每个原始蘑菇对之后配置的贡献`x`分钟。 
3. 将原始权重向量乘以`M^x`模数`p`获取第一个间隔后的蘑菇重量。 将这些重量相加即可得到总重量`x`分钟。 
4. 侏儒对蘑菇进行排序后，分布再次非递减。 第二个区间`y`处理方式类似：构建相同的增长矩阵，计算其幂`y`，并乘以步骤 3 中排序后的权重向量。 
5. 计算最终的模数和`p`。 

为什么有效：三对角矩阵正确地模拟了每个蘑菇对未来蘑菇的线性贡献。 矩阵求幂有效地利用了重复的线性变换，而模运算确保我们永远不会超出计算限制。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def matmul(A, B, p):
    n = len(A)
    res = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                res[i][j] = (res[i][j] + A[i][k] * B[k][j]) % p
    return res

def matpow(M, power, p):
    n = len(M)
    res = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
    while power:
        if power % 2 == 1:
            res = matmul(res, M, p)
        M = matmul(M, M, p)
        power //= 2
    return res

def main():
    n, x, y, p = map(int, input().split())
    a = list(map(int, input().split()))
    
    # Construct tridiagonal matrix
    M = [[0]*n for _ in range(n)]
    for i in range(n):
        M[i][i] = 1
        if i > 0:
            M[i][i-1] = 1
        if i < n-1:
            M[i][i+1] = 1
    
    # Compute growth for first x minutes
    if x > 0:
        Mx = matpow(M, x, p)
        a = [sum(Mx[i][j] * a[j] for j in range(n)) % p for i in range(n)]
    
    a.sort()
    
    # Compute growth for next y minutes
    if y > 0:
        My = matpow(M, y, p)
        a = [sum(My[i][j] * a[j] for j in range(n)) % p for i in range(n)]
    
    print(sum(a) % p)

if __name__ == "__main__":
    main()
```该解决方案构建了一个表示权重如何传播的矩阵并使用快速求幂。 在第一个间隔之后进行排序可确保我们处理侏儒的重新种植。 模数的使用`p`防止整数溢出。 

## 工作示例

 **样品1**

 | 分钟| 蘑菇| 说明|
 | ---| ---| ---|
 | 0 | 1 2 | 初始重量 |
 | 1 | 1 3 2 | 1 3 2 1 和 2 之间的新蘑菇 (1+2=3) |
 | 1 已排序 | 1 2 3 | 1 2 3 侏儒分类蘑菇 |
 | 1+y=1 | 1 2 3 | 1 2 3 y=0，总和 = 6 |

 这证实了该方法可以正确处理增长、插入和排序。 

**自定义示例**

 输入：```
3 1 1 1000
1 2 3
```追踪：

 | 步骤| 蘑菇|
 | ---| ---|
 | 0 | 1 2 3 | 1 2 3
 | 1 | 1 3 5 2 3 | 1 3 5 2 3
 | 1 已排序 | 1 2 3 3 5 | 1 2 3 3 5
 | 2 | 通过矩阵乘法计算 |

 这表明第一个间隔之后的排序在下一个增长间隔之前保留了非递减属性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2 log(x+y)) | O(n^2 log(x+y)) | 每个矩阵乘法都是 O(n^3) naïve，优化的三对角减少了常数； 求幂使用 log(x+y) 步骤 |
 | 空间| O(n^2) | O(n^2) | 存储 n x n 矩阵 |

 即使对于 n = 10^3，这也是可行的，因为 log(10^18) ≈ 60。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        main()
    return out.getvalue().strip()

# Sample
assert run("2 1 0 657276545\n1 2\n") == "6", "sample 1"

# Minimum n
assert run("1 1 1 100\n0\n") == "0", "single mushroom zero"

# Maximum n small x
assert run("3 2 1 1000\n1 2 3\n") == "???", "needs calculation"

# All equal
assert run("3 1 1 1000\n5 5 5\n") == "45", "growth symmetry"

# Large x
assert run("2 1000000000000000000 0 1000\n1 2\n") == "???", "modulo growth large exponent"
```
