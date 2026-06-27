---
title: "CF 105408G - GCDland 神秘阵列"
description: "我们得到一个整数列表，并要求验证一个非常具体的结构属性：列表中的每对数字必须共享完全相同的最大公约数。"
date: "2026-06-23T04:46:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105408
codeforces_index: "G"
codeforces_contest_name: "2024 ICPC Gran Premio de Mexico Repechaje"
rating: 0
weight: 105408
solve_time_s: 117
verified: true
draft: false
---

[CF 105408G - GCDland 神秘阵列](https://codeforces.com/problemset/problem/105408/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数列表，并要求验证一个非常具体的结构属性：列表中的每对数字必须共享完全相同的最大公约数。 换句话说，如果您在数组中选择任意两个位置，计算它们的 gcd，则该值不得取决于您选择的对。 

直接的含义是数组受到高度约束。 如果即使是单个对产生与另一对不同的 gcd 值，结构就会破裂，我们必须拒绝它。 

输入大小可达十万个元素，每个值可达千万级。 这使我们远离任何尝试显式检查所有对的方法，因为这需要粗略地$10^{10}$最坏情况下的 gcd 计算，远远超出了一秒的限制。 任何可接受的解决方案都必须将问题减少到接近线性或数组大小接近线性的程度。 

微妙的极端情况来自较小的值和重复的因素。 例如，像这样的数组$[2, 4, 8]$行为不同于$[2, 3, 4]$，尽管两者的 gcd 都很小。 另一个棘手的情况是，所有数字共享一个公共因子，但该因子与剩余素数的相互作用方式仍然不同，这可能会影响成对 gcd 一致性。 

例如，考虑$[6, 10, 15]$。 三者的 gcd 均为$1$，但成对的 gcd 不同：$\gcd(6,10)=2$,$\gcd(6,15)=3$,$\gcd(10,15)=5$。 “全局 gcd 为 1 就足够了”的天真假设立即失效。 

另一个失败案例是认为排序后检查相邻元素就足够了。 为了$[6, 10, 15]$，排序给出$[6,10,15]$，相邻的 gcd 是$2$和$5$，这已经不同了，但即使相邻的 gcd 在某些精心设计的情况下匹配，非相邻的对仍然可能违反条件。 

## 方法

 直接解释建议计算每对的 gcd 并检查相等性。 这是正确的，但非常昂贵。 和$N$最多$10^5$，我们会粗略计算$N(N-1)/2$GCD操作。 每个gcd都是对数的，所以在时间限制下这仍然会崩溃。 

关键的观察是，如果所有成对的 gcd 都相同，则存在一个值$g$使得每对元素共享完全相同的 gcd$g$。 这迫使结构变得强大：所有数字都必须是$g$，并将每个元素除以$g$，任何一对结果数的 gcd 必须等于$1$。 如果任意两个约简数共享一个质因数，那么它们的 gcd 将超过$1$，与要求相矛盾。 

这将问题转化为检测归一化后是否有多个素数因子出现在多个数字中。 

我们首先计算整个数组的全局 gcd。 如果条件为真，则该值必须等于常见的成对 gcd。 然后我们将所有元素除以这个 gcd。 现在的问题纯粹是关于简化的数组：我们必须确保两个不同元素之间不共享质因数。 

这可以使用具有最小素因数筛子的素因数分解来有效地检查。 每个数字都被分解一次，我们跟踪哪些素数已经出现。 如果在多个元素中出现素数，则违反该条件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解成对 gcd 检查 | O(N² log A) | O(N² log A) | O(1) | O(1) | 太慢了 |
 | GCD + 素因子追踪 | O(N log A) | O(N log A) | O(A) | 已接受 |

 ## 算法演练

 1. 计算整个数组的 gcd 并将其存储为$g$。 该值表示常见成对 gcd 的唯一可能候选值，因为每个成对 gcd 必须除以所有元素。 
2. 替换每个元素$a_i$和$a_i / g$。 这消除了强制公因子，因此我们可以只关注额外的共享结构。 
3. 使用筛子构建数组中最大值的最小素因数表。 这允许快速分解每个数字。 
4. 对于每个约简数，提取其不同的质因数。 我们只关心素数是否出现，而不关心它的重数，因为重复的幂不会改变 gcd 是否大于 1。 
5. 维护一个集合或布尔数组，标记哪些素数已在之前的数字中使用过。 
6. 如果任何质因数出现在多个不同的数字中，则立即得出结论：并非所有成对 gcd 都相等并返回 NO。 
7. 如果所有数字均已处理且没有冲突，则返回 YES。 

中心思想是，标准化后，相等的成对 gcd 会强制质数支持不相交。 两个不同元素之间质因数的任何重叠都会直接创建一个 gcd 超过共享基线的对，从而破坏条件。 

## 为什么它有效

 除以全局gcd后$g$，每个数字相对于预期的目标结构都成为互质。 如果两个约数共享一个素因数$p$，那么他们的 gcd 至少是$p$，大于$1$。 这意味着原始的成对 gcd 超过$g$，与所有成对 gcd 相等的假设相矛盾。 相反，如果没有质因数出现在多个约简数中，则每一对共享完全相同的 gcd$g$，因为除了全局因素之外不存在额外的共同结构。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXV = 10_000_000

# smallest prime factor sieve
spf = list(range(MAXV + 1))
for i in range(2, int(MAXV ** 0.5) + 1):
    if spf[i] == i:
        step = i
        start = i * i
        for j in range(start, MAXV + 1, step):
            if spf[j] == j:
                spf[j] = i

def factorize(x):
    res = []
    while x > 1:
        p = spf[x]
        res.append(p)
        while x % p == 0:
            x //= p
    return res

n = int(input())
a = list(map(int, input().split()))

import math

g = 0
for v in a:
    g = math.gcd(g, v)

used = set()

for v in a:
    v //= g
    if v == 1:
        continue
    factors = factorize(v)
    for p in set(factors):
        if p in used:
            print("NO")
            sys.exit()
        used.add(p)

print("YES")
```第一阶段计算所有元素的全局 gcd。 这锚定了条件成立时必须存在的最小公共结构。 

筛子准备快速因式分解，这很重要，因为对于十万个数字来说，重复试除法太慢了。 

每个数字都通过全局 gcd 进行约简，然后提取其素数支持度。 每个数字使用一组素数可确保重复幂不会错误地触发冲突。 

全球`used`set 确保每个素数最多出现在一个约化数中，从而强制执行表征有效数组的不相交条件。 

## 工作示例

 ### 示例 1

 输入：```
5
10 2 4 12 15
```首先我们计算全局 gcd，它是 1。没有归约改变数组。 

| 步骤| 当前值| 素因数 | 二手 Prime | 决定|
 | --- | --- | --- | --- | --- |
 | 10 | 10 2, 5 | {2,5} | {2,5} | 好的 |
 | 2 | 2 | {2} | 与 2 冲突 | 否 |

 第二步，数字2引入了一个已经被10使用过的素数，所以我们立即拒绝。 这表明即使全局 gcd 很小，跨元素的重叠素数结构也会破坏该条件。 

### 示例 2

 输入：```
3
2 4 6
```全局gcd为2，所以我们除以得到$[1, 2, 3]$。 

| 步骤| 价值| 减值| 素因数 | 二手 Prime | 决定|
 | --- | --- | --- | --- | --- | --- |
 | 2 | 1 | 1 | - | {} | 好的 |
 | 4 | 2 | 2 | {2} | {2} | 好的 |
 | 6 | 3 | 3 | {3} | {2,3} | 好的 |

 不同数字之间没有素数重复，因此结构有效，我们输出 YES。 

这表明，即使原始数字共享多个 gcd 模式，归一化也会揭示底层素数结构是否不相交。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(MAXV \log \log MAXV + N \log MAXV)$| sieve 构建最小质因数，每个数字都因式分解一次 |
 | 空间|$O(MAXV)$| SPF 阵列和跟踪结构 |

 筛子在预处理中占主导地位，但对于约束来说是可以接受的$10^7$。 由于快速分解，每个元素都在对数时间内处理，使解决方案保持在限制范围内$10^5$元素。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    MAXV = 10_000_000
    spf = list(range(MAXV + 1))
    for i in range(2, int(MAXV ** 0.5) + 1):
        if spf[i] == i:
            for j in range(i * i, MAXV + 1, i):
                if spf[j] == j:
                    spf[j] = i

    def factorize(x):
        res = []
        while x > 1:
            p = spf[x]
            res.append(p)
            while x % p == 0:
                x //= p
        return res

    import math

    n = int(input())
    a = list(map(int, input().split()))

    g = 0
    for v in a:
        g = math.gcd(g, v)

    used = set()

    for v in a:
        v //= g
        if v == 1:
            continue
        for p in set(factorize(v)):
            if p in used:
                return "NO"
            used.add(p)

    return "YES"

# provided samples
assert run("5\n10 2 4 12 15\n") == "NO", "sample 1"
assert run("3\n2 4 6\n") == "YES", "sample 2"
assert run("4\n2 4 6 8\n") == "NO", "sample 3"

# custom cases
assert run("2\n7 7\n") == "YES", "all equal"
assert run("3\n6 10 15\n") == "NO", "distinct primes overlap structure"
assert run("3\n1 1 1\n") == "YES", "all ones"
assert run("3\n2 3 5\n") == "YES", "pairwise coprime after gcd=1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 个相同的数字 | 是 | 相同的元素表现一致 |
 | 6 10 15 | 6 10 15 否 | 经典的重叠素数冲突|
 | 所有的| 是 | gcd 归一化边缘情况 |
 | 2 3 5 | 2 3 5 是 | 完全不相交的素数结构 |

 ## 边缘情况

 对于所有元素都相同的数组，全局 gcd 等于元素本身，归约后每个值都变为 1。由于没有剩下素数，因此不会发生冲突，算法正确返回 YES。 

对于像这样的数组$[6, 10, 15]$，全局 gcd 为 1，因此不会发生缩减。 素数集通过不同的对间接重叠，但实际上第一个检测到的重复素数立即违反了唯一性条件，正确地产生了 NO。 

对于包含许多 1 的数组，这些在约简后不会贡献质因子。 它们不会干扰跟踪结构，即使阵列的大部分相对于 gcd 结构呈中性，也能确保正确性。
