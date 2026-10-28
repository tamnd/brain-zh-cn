---
title: "CF 1436C - 二分查找"
description: "我们被要求计算大小为 n 的排列，其中特定数字 x 被放置在固定索引 pos 处，并且标准二分搜索过程（如问题中所述）成功地在该位置找到 x。 这里的排列是数字 1 到 n 的任意顺序。"
date: "2026-06-11T04:50:17+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "combinatorics"]
categories: ["algorithms"]
codeforces_contest: 1436
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 678 (Div. 2)"
rating: 1500
weight: 1436
solve_time_s: 95
verified: true
draft: false
---

[CF 1436C - 二分查找](https://codeforces.com/problemset/problem/1436/C)

 **评分：** 1500
 **标签：** 二分查找，组合数学
 **求解时间：** 1m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算大小的排列`n`其中一个特定的数字`x`放置在固定索引处`pos`，并且标准二分搜索过程，如问题中所述，成功找到`x`在那个位置。 这里的排列是数字的任意顺序`1`通过`n`。 输入指定三个整数：`n`对于排列的大小，`x`对于我们正在搜索的号码，以及`pos`对于索引，其中`x`必须结束。 输出是有效排列模数`10^9+7`。 

不明显的方面是二分搜索模拟了一系列比较。 当搜索时`x`，搜索保持左右边界并重复检查中间元素。 每次比较都会有效地将剩余数组划分为必须小于或大于的数字`x`基于搜索路径。 因此，为了使排列成功，左侧的元素`pos`被访问为`mid`并与`x`必须全部小于`x`，并且右侧的元素必须更大。 

限制条件适中：`n`最多可以达到 1000，这对所有的数据都采用暴力方法`n!`排列不可行，但允许具有三次甚至二次复杂度的算法。 

关键的边缘情况发生在以下情况：`x`处于极端索引（0 或 n-1）。 二分查找只会访问某些位置，可能会跳过其他位置。 一种简单的方法，计算所有排列，其中`x`位于`pos`如果不模拟二分搜索路径，就会给出不正确的结果。 例如，与`n=3`,`x=2`， 和`pos=0`，只有其他数字的某些位置才能使二分查找成功。 

## 方法

 蛮力方法在概念上很简单。 我们生成所有大小的排列`n`， 地方`x`在`pos`，模拟每个排列的二分搜索，并计算成功次数。 这种方法是正确的，但在计算上不可行，因为`n!`增长迅速，达到 10^256`n=1000`。 

最佳方法来自分析二分搜索行为。 在索引处进行二分搜索的每次迭代`mid`确定是否`mid`小于、大于或等于`pos`。 如果`mid < pos`，元素在`mid`必须小于`x`。 如果`mid > pos`，该元素必须大于`x`。 因此，我们可以计算小于的元素数量`x`必须进入访问到的左侧的位置`pos`对于较大的元素也类似。 其余职位可自由填补。 这将问题变成了阶乘和组合的组合计数问题。 

这种见解将问题从生成所有排列简化为计算分配较小和较大数字的方法，同时尊重二分搜索路径。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 组合计数| O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 预先计算模 10^9+7 的阶乘和逆阶乘，以允许高效计算排列和组合。 
2. 初始化`left = 0`和`right = n`。 这表示二分搜索范围。 跟踪两个计数器：`less_needed`对于小于的数字`x`必须出现的，并且`greater_needed`对于大于的数字`x`那一定会出现。 
3. 模拟二分查找：while`left < right`, 计算`mid = (left + right) // 2`。 如果`mid <= pos`， 移动`left = mid + 1`并增加`less_needed`如果`mid != pos`因为该索引必须包含小于`x`。 如果`mid > pos`， 移动`right = mid`并增加`greater_needed`因为该索引必须包含一个大于`x`。 
4. 循环之后，我们确切地知道有多少个小于`x`需要占据一定的位置，有多少个数字大于`x`需要担任其他职位。 
5. 计算使用阶乘分配这些数字的方法数。 选择`less_needed`数字来自`x-1`较小的数字并排列它们。 选择`greater_needed`数字来自`n-x`较大的数字并排列它们。 剩余的数字可以自由填补剩余的位置。 
6. 将这些计数相乘并取模 10^9+7 以获得最终答案。 

为什么它有效：二分搜索路径对小于和大于的元素施加严格的顺序约束`x`。 通过精确计算有多少较小和较大的元素必须占据左侧和右侧的位置`pos`，并任意排列剩余元素，我们枚举所有有效的排列，没有重复或遗漏。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modinv(a, m):
    return pow(a, m-2, m)

def precompute_factorials(n):
    fact = [1]*(n+1)
    inv_fact = [1]*(n+1)
    for i in range(1, n+1):
        fact[i] = fact[i-1]*i % MOD
    inv_fact[n] = modinv(fact[n], MOD)
    for i in range(n-1, 0, -1):
        inv_fact[i] = inv_fact[i+1]*(i+1) % MOD
    return fact, inv_fact

def solve():
    n, x, pos = map(int, input().split())
    fact, inv_fact = precompute_factorials(n)
    
    left = 0
    right = n
    less_needed = 0
    greater_needed = 0

    while left < right:
        mid = (left + right) // 2
        if mid <= pos:
            if mid != pos:
                less_needed += 1
            left = mid + 1
        else:
            greater_needed += 1
            right = mid

    if less_needed > x - 1 or greater_needed > n - x:
        print(0)
        return

    remaining = n - 1 - less_needed - greater_needed

    def comb(a, b):
        return fact[a]*inv_fact[b]%MOD*inv_fact[a-b]%MOD

    ans = comb(x-1, less_needed) * fact[less_needed] % MOD
    ans = ans * comb(n-x, greater_needed) % MOD
    ans = ans * fact[greater_needed] % MOD
    ans = ans * fact[remaining] % MOD
    print(ans % MOD)

solve()
```该代码首先预先计算阶乘和模逆。 然后，它模拟二分搜索来计算有多少个数字小于或大于`x`必须占据特定的职位。 组合公式计算分配这些数字的方法数，并用剩余的数字填充剩余的位置。 模运算可确保值保持在范围内。 

## 工作示例

 **样品1：**`n=4, x=1, pos=2`| 步骤| 左| 对| 中| 较少需要 | 更需要|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 4 | 2 | 0 | 0 |
 | 2 | 3 | 4 | 3 | 0 | 1 |
 | 3 | 3 | 3 | - | 0 | 1 |

 剩余 = 2（位置 0 和 1）。`x-1=0`较小的数字，`n-x=3`更大的数字。 我们选择1个较大的数字来填充greater_needed，剩下的2个数字填充remaining。 总路数 = 3_1_2 = 6。 

**样本2：**`n=3, x=2, pos=0`| 步骤| 左| 对| 中| 较少需要 | 更需要|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 3 | 1 | 0 | 1 |
 | 2 | 0 | 1 | 0 | 0 | 1 |

 剩余 = 1。较小的数字 = 1，较大的数字 = 1。方式 = 1_1_1*1=1。 

这些痕迹显示二分搜索模拟正确地识别了必须占据强制位置的较小和较大数字的数量。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2) | O(n^2) | 预计算阶乘和逆运算需要 O(n)，每次二分搜索模拟都是 O(log n)，组合乘法每次都是 O(n)，因此总体 O(n^2) |
 | 空间| O(n) | 阶乘和逆数组需要 O(n) |

 该解决方案非常适合约束 n ≤ 1000。阶乘计算模 10^9+7 可以避免整数溢出。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("4 1 2\n") == "6", "sample 1"
assert run("3 2 0\n") == "1", "custom small case"

# Minimum-size input
assert run("1 1 0\n") == "1", "
```
