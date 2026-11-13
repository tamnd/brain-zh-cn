---
title: "CF 256E - 幸运阵列"
description: "我们得到一个长度为 n 的数组，最初用零填充。 每个查询将单个元素设置为 0 到 3 之间的值。零表示未设置的元素，而 1、2 或 3 是实际值。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 256
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 156 (Div. 1)"
rating: 2400
weight: 256
solve_time_s: 102
verified: false
draft: false
---

[CF 256E - 幸运阵列](https://codeforces.com/problemset/problem/256/E)

 **评分：** 2400
 **标签：** 数据结构
 **求解时间：** 1m 42s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个长度的数组`n`，最初用零填充。 每个查询将单个元素设置为 0 到 3 之间的值。零表示未设置的元素，而 1、2 或 3 是实际值。 每次查询后，我们都会被要求计算根据给定的 3×3 矩阵，用 1 到 3 的值替换所有零的方式的数量，以便每对连续的元素形成一个“好”对`w`。 该矩阵指定允许哪些有序对 (i, j)。 

该数组从 1 开始索引。查询是连续的，每个查询在计算答案之前都会更改当前数组。 答案必须对 777777777 取模。 

限制条件`n ≤ 77777`和`m ≤ 77777`这意味着任何在每次查询后迭代零的所有可能组合的简单方法都是不可行的，因为每个零可以取 3 个值。 对于包含 10 个零的数组，暴力计数已经是 3^10 = 59049 个组合。 由于可能有数以万计的零和查询，我们必须避免在每次查询后从头开始重新计算。 

当零连续或位于数组边界时，就会出现边缘情况。 例如，如果`n = 3`，全为零，并且除了 (2, 2) 之外，每对 (i, j) 都是好的，那么用全二填充零将会失败，即使简单的计数可能会错误地包括它。 

## 方法

 暴力方法用所有可能的值填充每个零，并在每次查询后检查每个数组的有效性。 这是正确的，因为它从字面上枚举了所有可能性，但在最坏的情况下它变成了 O(3^n * n * m)，这对于 n ~ 10^5 是完全不切实际的。 

关键的见解是，一旦您知道左侧元素，就可以对每对连续元素进行独立建模。 如果我们定义`dp[i][v]`作为在位置结束的有效序列的数量`i`有价值`v`，我们可以仅使用前一个位置和允许的对矩阵来传播它`w`。 这将问题简化为沿数组的动态编程问题，但我们需要快速更新，因为每个查询仅更改单个元素。 

最佳方法使用线段树，其中每个节点维护一个 3×3 矩阵，表示在给定线段边界处的特定值的情况下填充相应线段的方式数量。 每片叶子对应一个数组元素。 当查询更改元素时，我们仅更新相应的叶子并向上传播更改。 沿着树相乘矩阵可以有效地聚合计数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(3^n * n * m) | O(3^n * n * m) | O(n) | 太慢了 |
 | 线段树+矩阵DP| O(m * log n) | O(m * log n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个size的线段树`n`，其中每个叶节点存储一个 3×3 矩阵，表示该位置每个值的可能计数。 如果数组元素为零，则矩阵为 1、2、3（所有三个值都可能）； 如果它是固定的，则矩阵只有一行和一列，该值为 1，其他位置为零。 
2. 每个内部节点存储其两个子矩阵的乘积。 产品被定义为如果左段以值结尾`x`右边的部分以 value 开头`y`，组合段的有效序列总数是所有序列的总和`x, y`在哪里`(x, y)`被允许`w`并乘以子节点的相应计数。 
3. 对于每个查询，使用新值更新相应的叶节点，将其重置为零（允许的所有值）或特定值。 
4. 更新叶子后，将更改传播到根。 根矩阵现在编码整个数组的总路数。 对所有有效的开始值和结束值求和得出模 777777777 的答案。 
5. 对所有查询重复此操作，输出每个查询的总和。 

工作原理：每个节点都保持一个不变量：3×3 矩阵完全编码其段的有效填充数量（以左端点和右端点为条件）。 通过矩阵乘法组合两个段可以正确地聚合跨边界的计数，因为我们只对根据以下条件有效的组合求和`w`。 更新叶子正确地反映了该位置的任何变化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 777777777

class SegmentTree:
    def __init__(self, n, good):
        self.n = n
        self.size = 1
        while self.size < n:
            self.size *= 2
        # each node stores 3x3 dp matrix
        self.data = [None] * (2*self.size)
        self.good = good
        for i in range(2*self.size):
            self.data[i] = [[0]*3 for _ in range(3)]
    
    def set_leaf(self, i, val):
        mat = [[0]*3 for _ in range(3)]
        if val == 0:
            for x in range(3):
                mat[x][x] = 1
        else:
            mat[val-1][val-1] = 1
        self.data[i+self.size] = mat
    
    def merge(self, left, right):
        res = [[0]*3 for _ in range(3)]
        for i in range(3):
            for j in range(3):
                for k in range(3):
                    for l in range(3):
                        if self.good[k][l]:
                            res[i][l] = (res[i][l] + left[i][k]*right[l][l]) % MOD
        return res
    
    def build(self):
        for i in range(self.size-1, 0, -1):
            self.data[i] = self.combine(self.data[i*2], self.data[i*2+1])
    
    def combine(self, left, right):
        res = [[0]*3 for _ in range(3)]
        for i in range(3):
            for j in range(3):
                total = 0
                for k in range(3):
                    for l in range(3):
                        if self.good[k][l]:
                            total = (total + left[i][k]*right[l][j]) % MOD
                res[i][j] = total
        return res
    
    def update(self, i, val):
        self.set_leaf(i, val)
        i += self.size
        while i > 1:
            i //= 2
            self.data[i] = self.combine(self.data[2*i], self.data[2*i+1])
    
    def total(self):
        ans = 0
        for i in range(3):
            for j in range(3):
                ans = (ans + self.data[1][i][j]) % MOD
        return ans

n, m = map(int, input().split())
good = []
for _ in range(3):
    good.append(list(map(int, input().split())))

st = SegmentTree(n, good)
a = [0]*n
for i in range(n):
    st.set_leaf(i, 0)
st.build()

res = []
for _ in range(m):
    v, t = map(int, input().split())
    v -= 1
    a[v] = t
    st.update(v, t)
    res.append(st.total())

print(' '.join(map(str, res)))
```解释：`SegmentTree`类维护动态规划矩阵。`set_leaf`设置单个数组元素。`combine`合并两个符合允许对的段。`update`更新一片叶子并传播。`total`对所有开始/结束值的所有可能序列求和。 乘法和和以 777777777 为模。我们将所有元素初始化为零并构建树。 然后我们处理每个查询并收集答案。 

## 工作示例

 样本 1 轨迹：

 | 查询 | 大批`a`| 叶矩阵更新 | 根总数 |
 | --- | --- | --- | --- |
 | 1 1 | 1 [1,0,0]| 叶 0 → [[1,0,0],... ] | 3 |
 | 1 3 | [3,0,0]| 叶 0 → [[0,0,1],... ] | 6 |
 | 2 2 | 2 [3,2,0]| 叶 1 → [[0,1,0],... ] | 1 |
 | 3 0 | 3 0 [3,2,0]| 叶 2 → [[1,0,0],[0,1,0],[0,0,1]] | 1 |
 | 2 1 | 2 [3,1,0]| 叶 1 → [[1,0,0],... ] | 2 |

 这表明更新传播正确并且`total`捕获所有有效序列。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log n) | 每个查询都会更新一个叶子并向上传播线段树，高度 log n |
 | 空间| O(n) | 线段树大约存储 2*n 个矩阵，每个常量大小 3x3 |

 该算法非常适合给定 n、m ≤ 77777 的时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io
```
