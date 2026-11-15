---
title: "CF 920G - 整数列表"
description: "该问题要求我们为多个查询生成一个特殊的整数列表。 对于给定的包含整数 x、p 和 k 的查询，我们需要找到大于 x 且与 p 互质的第 k 个整数。 互质表示该数与 p 的最大公约数 (gcd) 为 1。"
date: "2026-06-13T02:54:45+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "bitmasks", "brute-force", "combinatorics", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 920
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 37 (Rated for Div. 2)"
rating: 2200
weight: 920
solve_time_s: 274
verified: true
draft: false
---

[CF 920G - 整数列表](https://codeforces.com/problemset/problem/920/G)

 **评分：** 2200
 **标签：** 二分查找、位掩码、暴力破解、组合数学、数学、数论
 **求解时间：** 4m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们为多个查询生成一个特殊的整数列表。 对于给定的整数查询`x`,`p`， 和`k`，我们需要找到`k`-第一个整数大于`x`与`p`。 Coprime 表示数字和的最大公约数 (gcd)`p`是 1。例如，如果`x = 7`和`p = 22`，大于 7 且与 22 互质的数字为 9、13、15、17 等。 查询想要`k`此序列中的第 - 个数字。 

这些约束为我们提供了最多 30,000 个查询，每个查询最多有 1,000,000 个数字。 检查上面每个整数的简单方法`x`每个查询都需要一一计算 gcd，以获取可能数百万个数字，这太慢了。 和`t`30,000 且数字达到`10^6`，我们需要一种方法，可以大致按对数顺序缩放或按质因数的数量线性缩放`p`。 

当发生微妙的边缘情况时`p`有许多小的质因数。 例如，如果`p = 6`，必须跳过 2 或 3 的倍数的数字。 幼稚的方法可能会错误地计算可被任何质因数整除的数字`p`。 相似地，`x`可能正好低于一个与`p`，因此计数或索引中的相差一错误可能会导致返回错误的数字。 例如，与`x = 5`,`p = 6`， 和`k = 1`，正确答案是 7，而不是 6。 

## 方法

 蛮力法很简单：从`x + 1`，依次检查每个数字并计算有多少个数字与`p`。 一旦计数达到`k`，这个数字就是答案。 这是有效的，因为它直接模拟序列的定义。 问题是最坏的情况：如果`p`像 2 这样小，大约一半的数字是互质的，我们可能必须迭代到`10^6`每个查询的数量。 和`t`30,000 的话，这可能会达到`3 * 10^10`的操作，这显然是不可行的。 

关键的观察是互质性是由`p`。 如果我们知道质因数分解`p`，我们可以使用包含-排除来计算有多少个数字小于或等于某个值`y`互质于`p`。 有了这个，我们可以把这个问题当作一个搜索：找到最小的数字`y`大于`x`使得恰好有`k`之间的数字`x`和`y`互质于`p`。 这将问题简化为二分搜索与快速计数功能相结合。 通过包含-排除进行计数是有效的，因为任何数字的不同质因数的数量最多可达`10^6`至多为 7（因为 2 * 3 * 5 * 7 * 11 * 13 * 17 > 10^6）。 

蛮力方法和最优方法的比较如下：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每个查询 O(k * log p) | O(1) | O(1) | 对于大 k 或小 p 来说太慢 |
 | 包含-排除+二分查找| 每个查询 O(2^m * log(range))，m = #p 的质因数 | O(米) | 高效且被接受 |

 ## 算法演练

 1. 预先计算直到`10^6`使用埃拉托斯特尼筛法。 这让我们可以分解任何`p`高效。 
2. 对于每个查询`(x, p, k)`， 因素`p`成其独特的素因数。 因素数量`m`很小。 
3. 定义函数`count_coprime(y)`计算有多少个整数 ≤`y`互质于`p`。 使用包含-排除，迭代主要因子的所有子集`p`。 对于每个子集，计算素数的乘积并减去或加上底除法`y // product`根据子集大小的奇偶校验。 
4. 对最小整数执行二分查找`y`这样`count_coprime(y) - count_coprime(x) == k`。 初始化`low = x + 1`和`high`作为`x + k * p`（这是一个上限；在最坏的情况下，每个`p`数至少包含一个互质数）。 
5. 返回`y`作为`k`序列中的第 - 个数字。 

这是有效的，因为包含-排除计数给出了与它互质的整数的确切数量。`p`达到任何限制。 二分查找可以有效地找到确切位置的数字`k`互质数出现在`x`。 不变的是，在搜索的每一步中，真实答案都保持在搜索区间内。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def sieve(n):
    spf = list(range(n + 1))
    for i in range(2, int(n**0.5) + 1):
        if spf[i] == i:
            for j in range(i*i, n+1, i):
                if spf[j] == j:
                    spf[j] = i
    return spf

def factorize(n, spf):
    primes = set()
    while n > 1:
        primes.add(spf[n])
        n //= spf[n]
    return list(primes)

def count_coprime(y, primes):
    from itertools import combinations
    res = y
    m = len(primes)
    for sz in range(1, m+1):
        for comb in combinations(primes, sz):
            prod = 1
            for c in comb:
                prod *= c
            if sz % 2 == 1:
                res -= y // prod
            else:
                res += y // prod
    return res

def solve():
    spf = sieve(10**6)
    t = int(input())
    for _ in range(t):
        x, p, k = map(int, input().split())
        primes = factorize(p, spf)
        low = x + 1
        high = x + k * p
        while low < high:
            mid = (low + high) // 2
            if count_coprime(mid, primes) - count_coprime(x, primes) >= k:
                high = mid
            else:
                low = mid + 1
        print(low)

solve()
```筛子用于分解因子`p`高效。 这`count_coprime`函数对质数因子应用包含-排除来确定互质的整数的确切数量`p`直到任何值。 二分查找找到`k`- 余质数大于`x`。 注意安全地将搜索上限设置为`x + k * p`以避免超调。 

## 工作示例

 输入示例 1：```
x = 7, p = 22, k = 3
```22 的质因数：2、11。 

二分查找使用包含-排除来计算互质数：

 | 中| count_coprime(中) | count_coprime(中) - count_coprime(7) | 二分查找决策|
 | ---| ---| ---| ---|
 | 13 | 6 | 2 | 增加低位|
 | 15 | 15 7 | 3 | 降低高 |

 结果：`15`。 

输入示例 2：```
x = 5, p = 6, k = 4
```质因数：2、3。互质数 >5：7、11、13、17。结果：`17`。 

这表明该算法处理小`x`和小`p`正确的是，跳过能被 2 或 3 整除的数字。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t * 2^m * log(k*p)) | O(t * 2^m * log(k*p)) | 二分查找结束`y`包含-排除`m`的质因数`p`|
 | 空间| O(n) | 筛选存储最多 10^6，每个查询的质因数数组 |

 为了`t = 3 * 10^4`和`m ≤ 7`，这在 5 秒限制下已经足够快了。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# provided samples
assert run("3\n7 22 1\n7 22 2\n7 22 3\n") == "9\n13\n15", "sample 1"

# minimum-size input
assert run("1\n1 1 1\n") == "2", "minimum input"

# maximum-size p
assert run("1\n1 1000000 5\n") == "6\n7\n11\n13\n17".split()[4], "large p"

# all equal values
assert run("1\n5 6 3\n") == "13", "skip multiples"

#
```
