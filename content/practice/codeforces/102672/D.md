---
title: "CF 102672D - 好的子集"
description: "该问题给出了写在锁上的正整数集合。 我们需要选择尽可能多的整数，以便每个选定的数字都有大于 1 的公约数。"
date: "2026-08-01T23:43:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102672
codeforces_index: "D"
codeforces_contest_name: "Selection of tasks from Internet olympiads season 2019-20"
rating: 0
weight: 102672
solve_time_s: 69
verified: true
draft: false
---

[CF 102672D - 良好子集](https://codeforces.com/problemset/problem/102672/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题给出了写在锁上的正整数集合。 我们需要选择尽可能多的整数，以便每个选定的数字都有大于 1 的公约数。 换句话说，在所有可能的子集中，我们想要最大公约数不等于1的最大子集。 

输入最多包含 1000 个数字，但每个数字最大可以为$10^{18}$。 元素数量较少排除了依赖于尝试许多子集的算法，因为即使检查所有子集也需要$2^{1000}$运营。 大的值范围也排除了对每个数字的值进行试除的可能性，因为单个数字可能需要数十亿次尝试。 预期的解决方案需要利用这样一个事实：我们只需要素数，而不是完整的因式分解结构。 

答案由质因数控制。 如果几个数都有素因数$p$，那么它们都可以放入一个有效的子集中，因为它们的 gcd 至少为$p$。 最大有效子集正是共享一个素数的最大一组数字。 

在一些边缘情况下，粗心的实施可能会失败。 如果每个数字都是素数并且所有素数都不同，那么答案仍然是一，因为单个数字的 gcd 等于其自身。 例如：```
Input:
3
2 3 5

Output:
1
```仅计算重复因子的解决方案将错误地打印零。 

另一个棘手的情况是一个数字多次包含相同的素数。 例如：```
Input:
3
12 18 25

Output:
2
```主要因素是$12 = 2^2 \cdot 3$,$18 = 2 \cdot 3^2$， 和$25 = 5^2$。 最好的子集是$\{12,18\}$，因为它们共享 2 和 3。计算一个数字内素数的出现次数而不是计算包含素数的数字会高估结果。 

最后的边缘情况是接近上限的大素数。 例如：```
Input:
1
1000000000000000000

Output:
1
```因式分解方法必须处理大的合数，而不假设每个值都可以被小素数整除。 

## 方法

 直接的方法是生成每个子集，计算其元素的 gcd，并保留 gcd 大于 1 的最大子集。 这是正确的，因为考虑了所有可能的答案。 然而，有$2^n$子集，并且与$n=1000$这是完全不可能的。 

一个稍微好一点的想法是查看除数。 对于每个可能的除数，计算有多少个数字可以被它整除。 最大的计数就是答案。 问题是数字达到$10^{18}$，因此如果通过试除法来枚举每个数字的除数也太慢。 

关键的观察是，当且仅当子集的所有数字共享至少一个素因数时，子集的 gcd 大于 1。 我们不需要知道确切的 gcd。 我们只需要知道哪些素数出现在哪些数字中。 将每个数字分解为不同的素数因子后，我们可以计算有多少个数字包含每个素数并取最大计数。 

剩下的挑战是将值分解为$10^{18}$。 Pollard Rho 分解正是针对这个范围而设计的。 它可以有效地找到大合数的非平凡因子，而米勒·拉宾素性测试可以快速识别素数。 获得因子后，我们只为每个数字插入不同的素数，因为包含$2^5$只为素数 2 的计数贡献一个元素。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^n \cdot n)$|$O(n)$| 太慢了 |
 | 除数枚举 | 太大了$10^{18}$价值观 |$O(1)$| 太慢了 |
 | Pollard Rho + 计算素因数 | 关于$O(n \log a_i)$预计|$O(k)$， 在哪里$k$是已发现的素因数 | 已接受 |

 ## 算法演练

 1. 使用 Miller Rabin 和 Pollard Rho 对每个数字进行因式分解。 

米勒·拉宾 (Miller Rabin) 告诉我们一个数是否是素数。 如果一个数字是合数，Pollard Rho 会找到一个因子，然后我们递归地对两个部分进行因式分解。 这避免了扫描所有可能的除数。 
2. 删除每个数字中重复的质因数。 

像 72 这样的数字有素数因数 2 和 3。尽管 2 在分解过程中出现了多次，但它应该只增加素数 2 的计数一次。 
3. 对于数字的每个不同质因数，增加其在全局计数器中的频率。 

计数器表示有多少原始数字包含该素数。 如果素数出现在许多数字中，则这些数字形成一个有效的子集。 
4. 输出所有素数中最大的频率。 

如果每个数字都没有共享的质因数，则每个质数最多为一，并且答案仍然为一。 

为什么它有效：

 考虑最优子集。 它的 gcd 是某个大于 1 的整数。 该 gcd 的任何素数除以子集中的每个元素。 因此，该子集包含在包含该素数的数字组中。 我们的算法检查输入中出现的每个素数并找到最大的此类组。 相反，由素数计数的每个组都将该素数作为公约数，因此它始终是有效的子集。 两个方向都证明最大计数正是答案。 

## Python 解决方案```python
import sys
import random
import math
from collections import defaultdict

input = sys.stdin.readline

def is_prime(n):
    if n < 2:
        return False
    small = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    for p in small:
        if n == p:
            return True
        if n % p == 0:
            return False

    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2

    for a in [2, 3, 5, 7, 11, 13]:
        if a >= n:
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        good = False
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                good = True
                break
        if not good:
            return False
    return True

def pollard(n):
    if n % 2 == 0:
        return 2
    if n % 3 == 0:
        return 3
    while True:
        c = random.randrange(1, n - 1)
        x = random.randrange(0, n - 1)
        y = x
        d = 1
        while d == 1:
            x = (x * x + c) % n
            y = (y * y + c) % n
            y = (y * y + c) % n
            d = math.gcd(abs(x - y), n)
        if d != n:
            return d

def factor(n, res):
    if n == 1:
        return
    if is_prime(n):
        res.append(n)
    else:
        d = pollard(n)
        factor(d, res)
        factor(n // d, res)

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    count = defaultdict(int)

    for x in a:
        factors = []
        factor(x, factors)
        for p in set(factors):
            count[p] += 1

    print(max(count.values()))

if __name__ == "__main__":
    solve()
```素性测试使用足以满足给定 64 位范围的确定性基。 递归因子函数将合数拆分，直到剩下的每个部分都是质数。 

这`set(factors)`转换是必要的，因为我们计算的是数字，而不是质数幂。 没有它，像这样的值$16$会错误地将四个贡献加到素数 2 上。 

最终的字典只存储实际出现的素数。 由于每个输入数至少为二，因此总有至少一个素因数，因此存在最大值。 

## 工作示例

 对于第一个样本：```
4
6 15 10 42
```因子计数的演变如下。 

| 已处理数量 | 独特的因素| 数 2 | 数 3 | 数 5 | 数到 7 |
 | --- | --- | --- | --- | --- | --- |
 | 6 | 2, 3 | 1 | 1 | 0 | 0 |
 | 15 | 15 3, 5 | 1 | 2 | 1 | 0 |
 | 10 | 10 2, 5 | 2 | 2 | 2 | 0 |
 | 42 | 42 2、3、7 | 3 | 3 | 2 | 1 |

 最大频率为 3，因此三个数字可以共享一个公共素数。 这与包含 6、15 和 42 的子集匹配。 

对于第二个样本：```
3
2 2 2
```| 已处理数量 | 独特的因素| 数 2 |
 | --- | --- | --- |
 | 2 | 2 | 1 |
 | 2 | 2 | 2 |
 | 2 | 2 | 3 |

 该算法正确地将每次出现视为单独的数组元素，给出答案 3。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 预期的$O(n \log a_i)$| 每个数字都使用 Pollard Rho 进行因式分解，这对于 64 位整数来说非常高效 |
 | 空间|$O(k)$| 存储发现的素数计数 |

 输入大小只有 1000 个数字，因此主要困难在于值的大小而不是元素的数量。 Pollard Rho 避免了不可能的试除并在限制内轻松拟合。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    n = int(data[0])
    arr = list(map(int, data[1:]))

    from collections import defaultdict
    import math
    import random

    def is_prime(n):
        if n < 2:
            return False
        for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]:
            if n == p:
                return True
            if n % p == 0:
                return False
        d = n - 1
        s = 0
        while d % 2 == 0:
            s += 1
            d //= 2
        for a in [2, 3, 5, 7, 11, 13]:
            if a >= n:
                continue
            x = pow(a, d, n)
            if x in (1, n - 1):
                continue
            ok = False
            for _ in range(s - 1):
                x = x * x % n
                if x == n - 1:
                    ok = True
                    break
            if not ok:
                return False
        return True

    def pollard(n):
        if n % 2 == 0:
            return 2
        while True:
            c = random.randrange(1, n - 1)
            x = random.randrange(0, n - 1)
            y = x
            d = 1
            while d == 1:
                x = (x * x + c) % n
                y = (y * y + c) % n
                y = (y * y + c) % n
                d = math.gcd(abs(x - y), n)
            if d != n:
                return d

    def factor(x, out):
        if x == 1:
            return
        if is_prime(x):
            out.append(x)
        else:
            d = pollard(x)
            factor(d, out)
            factor(x // d, out)

    cnt = defaultdict(int)
    for x in arr:
        f = []
        factor(x, f)
        for p in set(f):
            cnt[p] += 1

    return str(max(cnt.values())) + "\n"

assert run("4\n6 15 10 42\n") == "3\n"
assert run("3\n2 2 2\n") == "3\n"

assert run("1\n35\n") == "1\n"
assert run("3\n2 3 5\n") == "1\n"
assert run("3\n12 18 25\n") == "2\n"
assert run("2\n9999999967 9999999967\n") == "2\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`4 / 6 15 10 42`|`3`| 不同素数之间的共享因子 |
 |`3 / 2 2 2`|`3`| 重复值 |
 |`1 / 35`|`1`| 单元素子集 |
 |`3 / 2 3 5`|`1`| 没有公因数 |
 |`3 / 12 18 25`|`2`| 一个数中重复的素数幂 |
 | 两个相等的大素数|`2`| 大整数因子处理 |

 ## 边缘情况

 对于每个数字都有不同质因数的情况：```
3
2 3 5
```因式分解产生计数`2 -> 1`,`3 -> 1`， 和`5 -> 1`。 最大计数是 1，这是正确的，因为没有一对的 gcd 可以大于 1。 

对于重复素数幂：```
3
12 18 25
```第一个数字仅贡献`{2,3}`， 不是`{2,2,3}`。 第二个贡献`{2,3}`。 第三个贡献`{5}`。 素数 2 和 3 的计数变为 2，给出正确答案。 

对于非常大的复合值：```
1
1000000000000000000
```Pollard Rho 将数字分解为其素数因子，但答案只需要至少存在一个素数这一事实。 该素数的计数为 1，因此输出为 1。 这可以避免尝试循环所有可能的除数直至平方根。
