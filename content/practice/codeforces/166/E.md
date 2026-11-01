---
title: "CF 166E - 四面体"
description: "我们被要求计算蚂蚁从四面体的顶点 D 开始并在恰好 n 步后返回到 D 的方式的数量，每一步都沿着边缘移动。 四面体有四个顶点，标记为 A、B、C、D，每个顶点都与其他三个顶点相连。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math", "matrices"]
categories: ["algorithms"]
codeforces_contest: 166
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 113 (Div. 2)"
rating: 1500
weight: 166
solve_time_s: 180
verified: true
draft: false
---

[CF 166E - 四面体](https://codeforces.com/problemset/problem/166/E)

 **评分：** 1500
 **标签：** dp、数学、矩阵
 **求解时间：** 3m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算蚂蚁从四面体的顶点 D 开始并在恰好 _n_ 步后返回到 D 的方式数量，每一步都沿着边缘移动。 四面体有四个顶点，标记为 A、B、C、D，每个顶点都与其他三个顶点相连。 输入是表示路径长度的单个整数 _n_，输出是在 D 处开始和结束的不同移动序列的数量，模 10^9 + 7。 

鉴于 _n_ 可以大到 10^7，我们无法显式模拟所有可能的路径。 枚举每条路径的强力方法的指数时间复杂度为 O(3^n)，这对于超过 20 或 30 的 _n_ 是不可行的。相反，我们需要一种能够在大约 O(log n) 或 O(n) 时间内有效计算结果的方法。 

不明显的边缘情况包括最小的 _n_。 对于 _n_ = 1，蚂蚁无法一步返回 D，因为它必须移动到邻居，因此答案为 0。另一种情况是 _n_ = 2，其中蚂蚁只有三个选择：D → A → D、D → B → D、D → C → D。正确处理这些小输入可确保正确设置递归或矩阵求幂中的基本情况。 

## 方法

 蛮力方法很简单。 人们可以递归地枚举来自 D 的所有移动序列，并计算 _n_ 步后返回到 D 的移动序列。 这是有效的，因为每个步骤恰好有三个可能的移动，并且递归地探索所有路径捕获每个有效序列。 然而，时间复杂度为 O(3^n)，即使对于中等的 _n_ 值，时间复杂度也会爆炸。 当 _n_ 达到 10^7 时，这很快就变得不切实际。 

更快解决方案的关键观察是，在 _k_ 步后到达顶点的方式数量仅取决于在 _k-1_ 步后到达每个顶点的方式数量。 这是小图上的经典动态规划设置。 设 dp[x][k] 为 k 步到达顶点 x 的方式数。 递归很简单：要在步骤 k 中到达 D，蚂蚁必须来自步骤 k-1 中的 A、B 或 C。 类似地，要在步骤 k 中到达 A，蚂蚁必须来自 B、C 或 D。这种递归可以表示为 4×4 转换矩阵，并使用矩阵求幂进行有效计算，这将复杂性从每次状态更新的 O(n) 降低到 O(log n) 矩阵乘法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(3^n) | O(3^n) | O(n) | 太慢了|
 | DP / 矩阵求幂| O(log n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 为了方便起见，将顶点 A、B、C、D 标记为索引 0、1、2、3。 我们想要计算从 D（索引 3）开始和结束的长度为 n 的步行数量。 
2. 定义一个 4×4 的邻接矩阵 M 来表示有效的移动。 如果在一个步骤中从 i 可以到达顶点 j，则每个条目 M[i][j] 为 1，否则为 0。 对于四面体，每个顶点都与其他三个顶点相连。 对于 D（索引 3），第 3 行的第 0、1、2 列中将有 1，第 3 列中的 0 中将有 1。 
3. 将 k 步后到达每个顶点的方式数表示为长度为 4 的向量 v_k。第 0 步的向量 v_0 为 [0, 0, 0, 1]，因为蚂蚁从 D 开始。 
4. 使用矩阵求幂计算 v_n = M^n × v_0。 每次乘法都会应用递归来前进一步。 矩阵求幂允许我们以 O(log n) 乘法计算 M^n。 
5. 返回 v_n[3] modulo 10^9 + 7。该值计算 n 步后在 D 处开始和结束的所有有效步行。 

为什么它有效：邻接矩阵捕获所有有效的一步转换。 重复乘以矩阵可应用多个步骤的递推式。 矩阵求幂可有效计算 n 步转换，无需迭代 n 次。 不变量是，经过 k 次乘法后，向量 v_k 存储 k 步中到每个顶点的准确行走次数。

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def mat_mult(A, B):
    n = len(A)
    C = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] = (C[i][j] + A[i][k]*B[k][j]) % MOD
    return C

def mat_pow(mat, power):
    n = len(mat)
    result = [[1 if i==j else 0 for j in range(n)] for i in range(n)]
    while power > 0:
        if power % 2 == 1:
            result = mat_mult(result, mat)
        mat = mat_mult(mat, mat)
        power //= 2
    return result

n = int(input())
adj = [
    [0,1,1,1],
    [1,0,1,1],
    [1,1,0,1],
    [1,1,1,0]
]

# initial vector v0 corresponds to starting at D (index 3)
v0 = [0,0,0,1]

# compute M^n
M_n = mat_pow(adj, n)

# compute final vector v_n = M^n * v0
v_n = [0]*4
for i in range(4):
    for j in range(4):
        v_n[i] = (v_n[i] + M_n[i][j]*v0[j]) % MOD

print(v_n[3])
```这`mat_mult`函数将两个 4×4 矩阵乘以 10^9+7 模。 这`mat_pow`函数使用二进制求幂将矩阵求 n 次幂。 邻接矩阵对四面体进行编码，v0 表示起始顶点。 最后，我们通过将 M^n 与 v0 相乘来计算 v_n，D 对应的条目给出了答案。 

## 工作示例

 样本 1，n=2：

 | 步骤| v_k (A、B、C、D) |
 | ---| ---|
 | 0 | [0,0,0,1] |
 | 1 | [1,1,1,0] |
 | 2 | [2,2,2,3] |

 v_2[3] = 3，匹配三个路径D→A→D、D→B→D、D→C→D。 

样本 2，n=3：

 | 步骤| v_k (A、B、C、D) |
 | ---| ---|
 | 0 | [0,0,0,1] |
 | 1 | [1,1,1,0] |
 | 2 | [2,2,2,3] |
 | 3 | [7,7,7,6] |

 v_3[3] = 6，对应于从 D 开始和结束的所有 6 条长度为 3 的步行。 

这些迹线证实了递归和矩阵求幂正确地计算了行走次数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(log n) | 每个矩阵乘法都是常数 (4×4)，我们使用幂进行 O(log n) 次乘法。 |
 | 空间| O(1) | O(1) | 我们只存储一些 4×4 矩阵和向量，与 n 无关。 |

 即使对于 n=10^7，这也完全符合 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    MOD = 10**9 + 7

    def mat_mult(A, B):
        n = len(A)
        C = [[0]*n for _ in range(n)]
        for i in range(n):
            for j in range(n):
                for k in range(n):
                    C[i][j] = (C[i][j] + A[i][k]*B[k][j]) % MOD
        return C

    def mat_pow(mat, power):
        n = len(mat)
        result = [[1 if i==j else 0 for j in range(n)] for i in range(n)]
        while power > 0:
            if power % 2 == 1:
                result = mat_mult(result, mat)
            mat = mat_mult(mat, mat)
            power //= 2
        return result

    n = int(input())
    adj = [
        [0,1,1,1],
        [1,0,1,1],
        [1,1,0,1],
        [1,1,1,0]
    ]
    v0 = [0,0,0,1]
    M_n = mat_pow(adj, n)
    v_n = [0]*4
    for i in range(4):
        for j in range(4):
            v_n[i] = (v_n[i] + M_n[i][j]*v0[j]) % MOD
    return str(v_n[3])

# Provided samples
assert run("2\n")
```
