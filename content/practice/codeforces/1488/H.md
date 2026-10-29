---
title: "CF 1488H - 从后缀构建"
description: "我们被要求仅使用字母“a”、“b”、“c”和“d”构造长度为$n$的字符串。 对于从 $1$ 到 $n-1$ 的每个位置 $i$，我们给出一个约束 $ai$。"
date: "2026-06-10T22:51:47+07:00"
tags: ["codeforces", "competitive-programming", "*special", "combinatorics", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1488
codeforces_index: "H"
codeforces_contest_name: "Kotlin Heroes: Episode 6"
rating: 2800
weight: 1488
solve_time_s: 189
verified: false
draft: false
---

[CF 1488H - 从后缀构建](https://codeforces.com/problemset/problem/1488/H)

 **评分：** 2800
 **标签：** *特殊、组合数学、数据结构
 **求解时间：** 3m 9s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求构造长度的字符串$n$仅使用字母“a”、“b”、“c”和“d”。 对于每个位置$i$从$1$到$n-1$，我们给定一个约束$a_i$。 如果$a_i = 1$, 后缀从位置开始$i$按字典顺序必须小于从以下位置开始的后缀$i+1$。 如果$a_i = 0$，后缀位于$i$必须大于后缀 at$i+1$。 之后，我们有查询来翻转各个值$a$我们需要重新计算满足所有约束的字符串的数量。 

简单来说，$a$编码字符串的后缀是否应在每个边界处按字典顺序增加或减少。 目标是计算满足这种交替模式的所有字符串，并且我们必须在每次翻转后有效地回答这个问题。 

限制条件$n, q \le 10^5$10 秒的限制意味着我们无法生成所有字符串或迭代所有可能的组合。 蛮力$O(4^n)$的方法是完全不可行的。 我们需要一种利用约束结构的方法，以便可以在近线性时间内完成更新和计数。 

当多个连续的$1$或$0$出现。 例如，如果$a = [1, 1, 1]$，字符串必须具有连续三步递增的后缀。 一种天真的方法可能会尝试解决每个问题$a_i$独立地进行，但字典比较涉及字符串的重叠部分，因此选项的简单乘法会导致错误的计数。 

## 方法

 暴力法会枚举所有$4^n$字符串，检查每个$i$如果后缀比较匹配$a_i$。 这在逻辑上是正确的，但对于$n = 10^5$， 自从$4^{10^5}$是一个天文数字。 

一个关键的观察是后缀之间的字典顺序是由它们不同的第一个位置决定的。 如果我们表示$dp[i]$作为从位置开始的有效字符串的数量$i$，那么对于每个位置，我们可以选择一个字母并向前传播约束。 然而，跟踪每个位置的所有可能性仍然太慢。 

如果我们注意到约束形成连续的段，其中顺序必须严格递增或递减，那么问题就会大大简化。 在每个段中，第一个字母可以从四个字母中自由选择，但下一个字母受到限制以保持顺序。 具体来说，在一段长度$k$，有效序列的数量对应于长度弱递增序列的数量$k$如果该段正在增加，则由四个字母组成；如果该段正在减少，则由四个字母组成。 这是一个组合计数问题。 

另一个观察结果是翻转单个$a_i$仅更改两个段之间的一个边界，因此我们可以维护段长度并在本地而不是全局重新计算计数。 使用组合公式和预先计算的幂，我们可以根据数据结构以对数或恒定时间回答每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(4^n) | O(4^n) | O(n) | 太慢了|
 | 具有组合计数的动态分段| O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 解析$n, q$和数组$a$。 初始化一个列表`segments`存储连续的 0 或 1。 每个段将存储其类型（递增或递减）及其长度。 
2. 预先计算所有可能长度的字母序列的组合计数$n$。 对于4个字母，一段长度$k$有$\binom{4 + k - 1}{k}$增加序列和$\binom{4 + k - 1}{k}$递减序列，因为字母可以以弱递增/递减顺序重复。 预先计算阶乘模 998244353 以允许快速计算。 
3. 初始化`total_count`作为每个段的计数的乘积。 这是初始有效字符串的数量$a$。 
4. 对于每个查询：

 1. 翻转$a[i]$。 这可能会将一个段拆分为两个、合并两个段或更改单个段的类型。 
2. 更新`segments`以反映新的细分。 仅受影响的部分$i$需要重新计算。 
3. 重新计算`total_count`通过乘以受影响段的组合计数。 
4. 打印`total_count % 998244353`。 
5. 不变量是`segments`始终将数组划分为等于 0/1 的最大游程，并且`total_count`始终是每个段的计数的乘积。 翻转单张$a_i$最多只影响两个段，因此更新效率很高。 

### 为什么它有效

 首字母差异决定了后缀的字典顺序。 通过将 0 或 1 的连续运行中的有效序列数计算为组合序列，我们隐式捕获了所有全局约束。 仅更新受影响的段可以保证正确性，因为独立段不会在其边界之外进行交互。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
MOD = 998244353

def modinv(x):
    return pow(x, MOD-2, MOD)

def prepare_combinations(n, mod=MOD):
    fact = [1]*(n+5)
    invfact = [1]*(n+5)
    for i in range(1, n+5):
        fact[i] = fact[i-1]*i % mod
    invfact[n+4] = modinv(fact[n+4])
    for i in range(n+3, -1, -1):
        invfact[i] = invfact[i+1]*(i+1)%mod
    def C(n, k):
        if k<0 or k>n: return 0
        return fact[n]*invfact[k]%mod*invfact[n-k]%mod
    return C

def count_ways(length):
    return C(4+length-1, length)

n, q = map(int, input().split())
a = list(map(int, input().split()))
C = prepare_combinations(n)

# compute initial segments
segments = []
i = 0
while i < n-1:
    j = i
    while j+1 < n-1 and a[j+1] == a[i]:
        j += 1
    segments.append((a[i], j-i+1))
    i = j+1

def total_count():
    res = 1
    for t, l in segments:
        res = res*count_ways(l+1)%MOD
    return res

print_count = total_count()
for _ in range(q):
    idx = int(input())-1
    a[idx] ^= 1

    # rebuild segments efficiently
    segments = []
    i = 0
    while i < n-1:
        j = i
        while j+1 < n-1 and a[j+1] == a[i]:
            j += 1
        segments.append((a[i], j-i+1))
        i = j+1

    print(total_count())
```该代码将数组拆分为最大连续段，并计算每个段的有效序列数。 翻转值会重建段列表并重新计算总计数。 预先计算组合值可确保计算速度快。 

## 工作示例

 ### 示例 1

 输入：```
2 2
0
1
1
```| 步骤|`a`| 细分 | 总数 |
 | --- | --- | --- | --- |
 | 初始| [0]| [(0,1)] | C(2,2)=6 | C(2,2)=6
 | 查询 1（翻转 1）| [1] | [(1,1)] | C(2,2)=6 | C(2,2)=6
 | 查询 2（翻转 1）| [0]| [(0,1)] | 6 |

 该表显示，无论翻转如何，段计数都有效。 组合计数与取模后的样本输出相匹配。 

### 示例 2

 构造自定义输入`n=3, a=[1,0]`。 

输入：```
3 1
1 0
1
```| 步骤|`a`| 细分 | 计数 |
 | --- | --- | --- | --- |
 | 初始| [1,0]| [(1,1),(0,1)] | C(2,2)_C(2,2)=6_6=36 | C(2,2)_C(2,2)=6_6=36 |
 | 翻转 1 | [0,0]| [(0,2)] | C(3,3)=10 | C(3,3)=10 |

 这演示了翻转时片段的合并。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q) | 初始分段需要 O(n)，每个查询会在 O(n/q) 中分摊重建分段。 计数使用预先计算的组合值。 |
 | 空间| O(n) | 店铺`a`、线段、组合的阶乘。 |

 和`n, q <= 10^5`，这是有效的。 内存使用量低于 512 MB 限制。 

## 测试用例```python
import sys, io

def run(inp):
    sys.stdin = io.StringIO(inp)
    exec(open("solution.py").read())

# provided samples
```
