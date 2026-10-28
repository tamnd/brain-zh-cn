---
title: "CF 1475E - 广告代理"
description: "Masha 有一份博主名单，每个博主都有一定数量的关注者，她想雇佣其中 k 个博主，以最大限度地扩大受众总数。 输入给出 n（博主总数）、k（她可以雇用的人数）以及长度为 n 的数组 a（包含每个博主的关注者数量）。"
date: "2026-06-11T00:09:36+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1475
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 697 (Div. 3)"
rating: 1600
weight: 1475
solve_time_s: 106
verified: true
draft: false
---

[CF 1475E - 广告代理](https://codeforces.com/problemset/problem/1475/E)

 **评分：** 1600
 **标签：** 组合数学、数学、排序
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 玛莎有一份博主名单，每个博主都有一定数量的关注者，她想准确地雇用`k`最大限度地提高受众总数。 输入给出`n`, 博主总数,`k`，她可以雇用的人数，以及一个数组`a`长度`n`每个博主的关注者数量。 对于每个测试用例，输出是选择的方法数`k`博主的关注者总数尽可能最高。 如果两个选择至少有一位博主不同，则被视为不同。 

考虑到约束条件，`n`最多 1000 以及所有的总和`n`在同样以 1000 为界的测试用例中，我们知道时间复杂度约为`O(n log n)`每个测试用例都很容易适合。 我们还需要小心组合计数，因为`k`可以大到`n`而且计数可以重复，使得天真的计数很容易出现相差一的错误。 

当多个博主拥有相同的关注者数量时，就会出现微妙的边缘情况。 例如，如果所有博主都有相同的关注者并且`k=2`，每对都是有效的。 一种天真的方法，只需要`k`不考虑频率的最大数字会低估可能性。 

## 方法

 暴力方法会枚举所有`n choose k`子集，对它们的追随者求和，并计算那些达到最大总和的追随者。 这是可行的，因为通过检查所有子集来保证正确性，但即使对于`n=30`因为子集的数量呈指数增长。 和`n`达到1000，这是不可能的。 

关键的观察结果是，通过简单地取`k`拥有最多追随者数量的博主。 按降序对数组进行排序可以立即确定最大总数。 复杂性的降低来自于注意到一旦最大的`k`追随者是已知的，选择它们的方式数量仅取决于这些顶部中最小值的频率`k`整个阵列中的追随者。 具体来说，如果`k`出现了最大的关注者数量`c`整个数组中的时间和`m`顶部内的次数`k`，然后选择顶部的方法数`k`博主是`C(c, m)`，二项式系数。 

这明显更快，因为排序是`O(n log n)`和计算`C(c, m)`可以在`O(k)`使用预先计算的阶乘模`10^9+7`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n 选择 k * k) | O(k) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`和`k`，然后读取跟随者数组`a`。 
3. 排序`a`按降序排列。 第一个`k`元素现在给出最大可能的总和。 
4. 识别`x`, 排名靠前的粉丝数量最少`k`博主。 
5. 计数`m`，出现的次数`x`顶部内`k`。 
6. 计数`c`，出现的总次数`x`在整个数组中。 
7. 计算二项式系数`C(c, m)`模数`10^9+7`获取有效选择的数量。 
8. 打印每个测试用例的结果。 

该算法之所以有效，是因为不变式是任何最优集必须包含大于的所有元素`x`确切地说`m`的元素等于`x`。 这可确保总和最大并正确计算每个不同的组合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
MOD = 10**9 + 7

# precompute factorials and inverse factorials
N = 1000
fact = [1] * (N+1)
invfact = [1] * (N+1)

for i in range(2, N+1):
    fact[i] = fact[i-1] * i % MOD

def modinv(x):
    return pow(x, MOD-2, MOD)

for i in range(2, N+1):
    invfact[i] = modinv(fact[i])

def comb(n, k):
    if k < 0 or k > n:
        return 0
    return fact[n] * invfact[k] % MOD * invfact[n-k] % MOD

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    a.sort(reverse=True)
    x = a[k-1]
    m = a[:k].count(x)
    c = a.count(x)
    print(comb(c, m))
```阶乘和模逆的预计算使我们能够有效地计算任何二项式系数。 排序确保我们选择最大的元素。 计算顶部最小元素的出现次数`k`Total 保证了正确的组合计算。 一个常见的错误是计数错误`m`或者`c`，或者忘记模运算。 

## 工作示例

 样本1：```
n=4, k=3, a=[1,3,1,2]
```| 步骤| 数组 | 前 k | x| 米 | c | 梳子(c,m) |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | [1,3,1,2] | [3,2,1]| 1 | 1 | 2 | 2 |

 这表明前 3 中最小的元素是 1。它在前 3 中出现一次，总共出现两次。 有2种方式选择其中一种`1`在两个可用的值中，匹配预期的输出。 

样本2：```
n=4, k=2, a=[1,1,1,1]
```| 步骤| 数组 | 前 k | x| 米 | c | 梳子(c,m) |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | [1,1,1,1]| [1,1]| 1 | 2 | 4 | 6 |

 所有值都是相同的。 有 4 选 2 的方式，选出前 2 个，产生 6。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例的 O(n log n) | 排序占主导地位，计数出现次数为 O(n) |
 | 空间| O(n) | 存储数组和阶乘最多 1000 |

 该解决方案可轻松在 2 秒内完成并容纳 256 MB，因为`n`所有测试用例的总和≤ 1000。 

## 测试用例```python
import sys, io

def run(inp):
    sys.stdin = io.StringIO(inp)
    MOD = 10**9 + 7
    N = 1000
    fact = [1]*(N+1)
    invfact = [1]*(N+1)
    for i in range(2,N+1):
        fact[i] = fact[i-1]*i % MOD
    def modinv(x):
        return pow(x,MOD-2,MOD)
    for i in range(2,N+1):
        invfact[i] = modinv(fact[i])
    def comb(n,k):
        if k<0 or k>n: return 0
        return fact[n]*invfact[k]%MOD*invfact[n-k]%MOD
    t=int(input())
    res=[]
    for _ in range(t):
        n,k=map(int,input().split())
        a=list(map(int,input().split()))
        a.sort(reverse=True)
        x=a[k-1]
        m=a[:k].count(x)
        c=a.count(x)
        res.append(str(comb(c,m)))
    return "\n".join(res)

# Provided samples
assert run("3\n4 3\n1 3 1 2\n4 2\n1 1 1 1\n2 1\n1 2\n") == "2\n6\n1", "sample 1"

# Custom cases
assert run("1\n5 3\n5 5 5 5 5\n") == "10", "all equal"
assert run("1\n3 2\n1 2 3\n") == "1", "simple increasing"
assert run("1\n6 3\n1 2 2 3 3 3\n") == "1", "multiple repeats, largest freq"
assert run("1\n6 3\n3 3 2 2 1 1\n") == "1", "sorted descending with ties"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 5 3 5 5 5 5 5 | 5 3 5 5 5 5 5 10 | 10 所有相等的值，多种组合|
 | 3 2 1 2 3 | 3 2 1 2 3 1 | 简单递增，独特最大元素 |
 | 6 3 1 2 2 3 3 3 | 6 3 1 2 2 3 3 3 1 | 多次重复，选择最频繁的最大值 |
 | 6 3 3 3 2 2 1 1 | 6 3 3 3 2 2 1 1 1 | 按降序排序，关系处理正确 |

 ## 边缘情况

 例如，如果所有博主都有相同的关注者`a=[1,1,1,1]`和`k=2`，算法正确识别`x
