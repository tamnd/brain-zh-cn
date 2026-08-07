---
title: "CF 102535R - 唯一的 3 级"
description: "我们需要计算数字对 (k, b)，其中 k 是乘数，b 是基数。 当将 k 乘以从 0 到 b-1 的每个数字位置产生包含该基数的每个可能数字恰好一次的数字根时，一对被认为是有效的。"
date: "2026-08-06T20:04:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102535
codeforces_index: "R"
codeforces_contest_name: "2020 UP ACM Algolympics Elimination Round"
rating: 0
weight: 102535
solve_time_s: 206
verified: true
draft: false
---

[CF 102535R - 唯一的 3 级](https://codeforces.com/problemset/problem/102535/R)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要计算数字对`(k, b)`在哪里`k`是一个乘数并且`b`是一个基地。 乘法时一对被认为是有效的`k`从每个数字位置`0`到`b-1`生成数字根，其中包含该基数的每个可能数字恰好一次。 

输入给出最大允许乘数`k'`和最大允许基地`b'`。 答案是有效对的数量`1 <= k <= k'`和`2 <= b <= b'`，取模`10^6`。 

这些限制远远超出了允许迭代所有对的任何限制。 最多可以有`5 * 10^9`这两个变量的可能值，因此检查每个基数和每个乘数将需要大约`2.5 * 10^19`运营。 该解决方案必须将问题简化为除数算术问题，然后利用下限除法值仅更改少量次数的事实。 

第一个隐藏的边缘情况是基础`2`。 数字根仅包含数字`0`和`1`，并且每个正数都有数字根`1`在基地`2`。 假设模数为的公式`b-1`大于一个可以在这里打破。 例如，输入`1 2`有答案`1`，因为唯一的一对`(1,2)`是有效的。 

另一个边缘情况是当`k`和`b-1`不是互质的。 直接模拟可能会意外地通过小示例，因为只检查了少数产品。 例如，输入`2 3`有答案`3`。 底座用`3`，我们需要的值`0, k, 2k`成为`0,1,2`。 和`k=2`，这些值不是排列，因为`2*2`具有相同的数字根`1*2`。 

最后的边缘情况是大边界。 输入`5000000000 5000000000`无法通过存储这种大小的数组或循环遍历每个基数来实现。 该算法必须仅适用于平方根大小的值组。 

## 方法

 最简单的方法是迭代每个碱基`b`，那么每一个`k`，并模拟数字根`0, k, 2k, ..., (b-1)k`。 模拟是正确的，因为它直接检查定义。 然而，它无法使用：仅对数就可以达到`25 * 10^18`。 

关键的观察来自数字根公式。 对于正整数`x`在基地`b`:`f_b(x) = 1 + ((x - 1) mod (b - 1))`。 

让`m = b - 1`。 的值`k, 2k, ..., mk`成为一个排列`1, 2, ..., m`恰好当乘以`k`对所有残基进行模置换`m`。 这恰恰发生在`gcd(k, m) = 1`。 

原来的问题现在是除数计数问题。 我们需要：`sum over m = 1 to b'-1 of count of k <= k' with gcd(k,m)=1`。 

使用莫比乌斯函数：`count(k <= K, gcd(k,m)=1) = sum over d|m of mu(d) * floor(K/d)`。 

交换总和得出：`answer = sum over d <= min(K, B-1) of mu(d) * floor(K/d) * floor((B-1)/d)`。 

剩下的挑战是快速评估这一点。 下限值在一定时间间隔内保持恒定。 我们可以在这些区间之间跳转，只需要莫比乌斯函数的前缀和。 莫比乌斯函数的大前缀值是通过杜角式递归获得​​的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k' * b' * b') | O(1) | O(1) | 太慢了|
 | 最佳 | 大约 O(N^(2/3)) | O(N^(1/2)) | O(N^(1/2)) | 已接受 |

 这里`N = min(k', b'-1)`。 

## 算法演练

 1. 让`n = b' - 1`。 将答案转换为莫比乌斯求和：`sum(mu(d) * floor(k'/d) * floor(n/d))`。 

该转换消除了测试各个对的需要。 
2. 计算 Mertens 函数`M(x) = mu(1) + ... + mu(x)`为楼层划分所需的值。 

小值是用线性筛预先计算的。 使用以下方法递归计算较大的值：`M(x) = 1 - sum(M(x / i))`对于所有范围，其中`x / i`是恒定的。 
3. 迭代除数变量`d`以块为单位。 对于电流`d`,计算最大的`r`这样：`k'/d`和`n/d`对于每个值都保持不变`[d, r]`。 

整个区块的贡献为：`(M(r) - M(d-1)) * floor(k'/d) * floor(n/d)`。 
4. 将每个区块贡献模数相加`10^6`。 

该算法背后的不变量是每个除数`d`准确贡献`mu(d) * floor(k'/d) * floor(n/d)`。 对相等的楼层分区进行分组只会改变相加的顺序，而不会改变值。 Mertens 函数给出块内所有莫比乌斯值的总和，因此每个除数仅包含一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**6
LIM = 2000000

mu = [1] * (LIM + 1)
prime = []
vis = [False] * (LIM + 1)
mu[0] = 0

for i in range(2, LIM + 1):
    if not vis[i]:
        prime.append(i)
        mu[i] = -1
    for p in prime:
        if i * p > LIM:
            break
        vis[i * p] = True
        if i % p == 0:
            mu[i * p] = 0
            break
        mu[i * p] = -mu[i]

pref = [0] * (LIM + 1)
for i in range(1, LIM + 1):
    pref[i] = pref[i - 1] + mu[i]

cache = {}

def mertens(n):
    if n <= LIM:
        return pref[n]
    if n in cache:
        return cache[n]
    res = 1
    i = 2
    while i <= n:
        q = n // i
        j = n // q
        res -= (j - i + 1) * mertens(q)
        i = j + 1
    cache[n] = res
    return res

def solve():
    k, b = map(int, input().split())
    n = b - 1
    limit = min(k, n)

    ans = 0
    d = 1
    while d <= limit:
        qk = k // d
        qn = n // d
        r = min(k // qk, n // qn)
        mob = mertens(r) - mertens(d - 1)
        ans = (ans + mob * qk * qn) % MOD
        d = r + 1

    print(ans % MOD)

solve()
```筛子仅计算莫比乌斯值`LIM`，因为所有较大的请求都是通过递归 Mertens 函数处理的。 递归存储重复的楼层划分参数的结果，这就是它保持快速的原因。 

主循环永远不会在整个范围内一次前进一个除数。 什么时候`k//d`或者`(b-1)//d`是常数，该区间内的所有除数具有相同的乘数，因此整个区间被一起处理。 

Python 整数避免溢出，但答案是模数减少`10^6`在每个区块贡献之后。 使用`min(k, b-1)`还避免了不必要的工作，因为较大的除数没有任何贡献。 

## 工作示例

 对于输入：```
3 5
```我们有`k'=3`和`b'-1=4`。 

| d 范围 | M(r)-M(d-1) | M(r)-M(d-1) | 楼层(3/天) | 楼层(4/天) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 3 | 4 | 12 | 12
 | 2 | -1 | 1 | 2 | -2 |
 | 3 | -1 | 1 | 1 | -1 |
 | 4 | 0 | 0 | 1 | 0 |

 总和是`9`，匹配样本。 

对于输入：```
2 3
```我们有基地`2`和`3`。 

| d | 亩(d) | 楼层(2/天) | 楼层(2/天) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 2 | 2 | 4 |
 | 2 | -1 | 1 | 1 | -1 |

 答案是`3`。 这个案例表明，并非每个乘数都适用于每个基地。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 大约 O(N^(2/3)) | 筛子处理小值，并且楼层划分分组限制递归状态 |
 | 空间| O(N^(1/2)) | O(N^(1/2)) | 存储的莫比乌斯值和记忆的 Mertens 查询 |

 最大的输入仅创建大约几十万个不同的楼层划分状态，因此该算法可以轻松地满足内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    solve()
    out = sys.stdout.getvalue()
    sys.stdin = old
    return out.strip()

assert run("3 5\n") == "9", "sample 1"
assert run("1 2\n") == "1", "minimum values"
assert run("2 3\n") == "3", "small non-coprime case"
assert run("5 2\n") == "5", "only base two"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 5`|`9`| 提供样本和一般计数 |
 |`1 2`|`1`| 尽可能小的基数和乘数 |
 |`2 3`|`3`| 互质条件 |
 |`5 2`|`5`| 处理`b-1 = 1`|

 ## 边缘情况

 对于`1 2`，算法集`n = 1`。 求和仅包含`d = 1`， 和`mu(1)=1`,`floor(1/1)=1`， 和`floor(1/1)=1`，产生答案`1`。 

为了`2 3`，该算法考虑`n = 2`。 莫比乌斯展开式给出：`floor(2/1)*floor(2/1) - floor(2/2)*floor(2/2) = 4 - 1 = 3`。 

这会计算有效对`(1,2)`,`(2,2)`， 和`(1,3)`在拒绝的同时`(2,3)`。 

对于最大值，除数循环永远不会达到数十亿次迭代。 它在两个楼层划分相等的范围之间跳转，并且通过记忆重用大型 Mertens 查询。 这使得执行独立于输入值的原始大小。
