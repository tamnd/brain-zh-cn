---
title: "CF 1470B - 奇怪的定义"
description: "我们得到一个整数数组。 当 $$frac{operatorname{lcm}(x,y)}{gcd(x,y)}$$ 是完全平方数时，定义两个值相邻。 每一秒，每个数组元素都会被所有当前相邻元素的乘积替换。"
date: "2026-06-11T01:00:24+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "graphs", "hashing", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1470
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 694 (Div. 1)"
rating: 1900
weight: 1470
solve_time_s: 187
verified: true
draft: false
---

[CF 1470B - 奇怪的定义](https://codeforces.com/problemset/problem/1470/B)

 **评级：** 1900
 **标签：** 位掩码、图形、哈希、数学、数论
 **求解时间：** 3m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组。 定义两个值相邻时$$\frac{\operatorname{lcm}(x,y)}{\gcd(x,y)}$$是一个完美的正方形。 

每一秒，每个数组元素都会被所有当前相邻元素的乘积替换。 我们关心的数量是数组的美感，即所有位置中最大的邻接数。 

对于每个查询值$w$，我们必须准确地报告美丽$w$秒。 

第一个挑战是理解邻接性。 第二个挑战是了解重复的变换如何影响数组。 查询要求任意大的时间，最多$10^{18}$，所以直接模拟是不可能的。 

所有测试用例的数组元素总数最多为$3 \cdot 10^5$，同样的界限也适用于查询总数。 这立即排除了任何二次方$n$。 一个$O(n^2)$邻接图大约需要$9 \cdot 10^{10}$最坏情况下的比较。 我们需要一些接近线性或$O(n \log n)$每个测试用例。 

价值观本身最多是$10^6$。 它足够小，可以使用筛子预处理每个数字的素因数。 

一个常见的错误是使用原始数字而不是无平方核。 

考虑：```
1
3
12 3 48
1
0
```两个都$12$和$48$减少到$3$删除所有质因数平方后：$$12 = 2^2 \cdot 3 \rightarrow 3$$

$$48 = 2^4 \cdot 3 \rightarrow 3$$所有三个值都属于同一邻接类，因此答案是 3。将原始数字视为不同的数字会错误地生成更小的组。 

另一个微妙的情况是值 1。```
1
4
1 4 9 16
2
0
1
```每个数字都减少到无平方核 1。最初最大的组大小是 4。稳定后它仍然是 4。忘记完全平方折叠到核 1 会产生错误的答案。 

最重要的边缘情况涉及大$w$。```
1
3
2 2 3
2
0
100
```答案为$w=0$与答案不同$w>0$。 该过程在一次转变后趋于稳定，因此所有积极的时间都有相同的答案。 模拟时间会错过这种结构简化。 

## 方法

 暴力解决方案将首先构建邻接图。 对于每对$(i,j)$，计算是否$$\frac{\operatorname{lcm}(a_i,a_j)}{\gcd(a_i,a_j)}$$是一个完美的正方形。 

这需要$O(n^2)$配对检查。 即使每次检查的时间都是恒定的，$n=3\cdot10^5$使得这完全不可行。 

关键的观察来自素因数分解。 

让$$x=\prod p_i^{\alpha_i}, \qquad y=\prod p_i^{\beta_i}.$$自从$$\frac{\operatorname{lcm}(x,y)}{\gcd(x,y)} = \prod p_i^{|\alpha_i-\beta_i|},$$当每个指数差都是偶数时，结果就是完全平方数。 

这意味着$$\alpha_i \equiv \beta_i \pmod 2$$对于每个素数。 

只有指数奇偶性才重要。 

对于每个数字，精确保留指数为奇数的素数。 他们的产品被称为无方形内核。 

示例：$$12 = 2^2\cdot3 \rightarrow 3$$

$$18 = 2\cdot3^2 \rightarrow 2$$

$$72 = 2^3\cdot3^2 \rightarrow 2$$两个数字相邻当且仅当它们具有相同的无平方核。 

这将问题转化为计算内核的频率。 

剩下的问题就是阵法的反复演化。 

假设一个内核类包含$k$元素。 该类中的每个元素都乘以完全相同的一组值，即该类的所有成员。 因此，一秒钟后，类中的每个元素都变得相同。 

更深入的分析表明，在一步之后，每个核为 1 或大小为偶数的类都会折叠为核 1。具有奇数大小和非 1 核的类仍然不同。 

这是官方解决方案中使用的中心观察。 

让：

-`mx0`是所有内核中最大的频率。 
-`mx1`是以下各项的总频率：

 - 内核 1,
 - 频率为偶数的每个非单一内核。 

然后所有剩余的奇数频率非单一内核保持分离。 

对于任何积极的时间，答案变成$$\max(mx1,\text{largest odd-frequency non-one class}).$$该值传统上称为`mx_inf`。 

该过程立即稳定下来，因此：

 -$w=0$用途`mx0`。 
-$w>0$用途`mx_inf`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2)$|$O(n^2)$| 太慢了|
 | 最佳 |$O(n \log \log M + n)$筛后预处理|$O(n)$| 已接受 |

 这里$M=10^6$。 

## 算法演练

 ### 预处理

 计算每个整数的最小质因数$10^6$。 这让我们可以快速分解每个数组值。 

### 每个测试用例

 1. 对于每个数组值，计算其无平方核。 

对数字进行因式分解并仅保留指数为奇数的素数。 
2. 统计每个内核的频率。 

让`cnt[k]`是 kernel 出现的次数`k`。 
3. 计算`mx0`。 

这只是所有内核中的最大频率。 
4. 计算稳定大群。 

初始化$$\text{good}=0.$$对于每个核频率对：

 - 如果内核等于 1，则将其频率添加到`good`。 
- 否则，如果频率是偶数，则将其频率添加到`good`。 

这些组在一步后合并到 kernel-1 组件中。 
5. 计算最大的剩余奇数频率非一类。 

让$$\text{oddmax}$$是频率为奇数的不同于 1 的核中的最大频率。 
6. 定义$$mx\_inf=\max(\text{good},\text{oddmax}).$$这是每一个积极时刻的答案。 
7. 对于每个查询：

 - 如果$w=0$， 打印`mx0`。 
- 否则，打印`mx_inf`。 

### 为什么它有效

 邻接仅取决于素数分解中的指数奇偶性。 用无平方核替换每个数字可以保留所有邻接关系。 

所有具有相同内核的数字构成一个完整的组件，并且具有不同内核的数字永远不会相邻。 经过一次转换后，组件内的每个元素都变得相同，因为每个元素都乘以完全相同的一组值。 

具有偶数大小的组件会产生完美的平方因子贡献并折叠到内核 1 中。已经具有内核 1 的组件也属于那里。 奇数大小的非单一组件保留其内核。 在第一次转换之后，分区不再改变，因此该过程永远稳定。 

因此，时间 0 的美度是最大的原始组件尺寸，而每个正时间的美度是稳定后的最大组件尺寸。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXA = 10 ** 6

spf = list(range(MAXA + 1))
for i in range(2, int(MAXA ** 0.5) + 1):
    if spf[i] == i:
        for j in range(i * i, MAXA + 1, i):
            if spf[j] == j:
                spf[j] = i

def kernel(x):
    res = 1
    while x > 1:
        p = spf[x]
        cnt = 0
        while x % p == 0:
            x //= p
            cnt ^= 1
        if cnt:
            res *= p
    return res

t = int(input())

for _ in range(t):
    n = int(input())
    arr = list(map(int, input().split()))

    freq = {}

    for x in arr:
        k = kernel(x)
        freq[k] = freq.get(k, 0) + 1

    mx0 = max(freq.values())

    good = 0
    oddmax = 0

    for k, c in freq.items():
        if k == 1 or c % 2 == 0:
            good += c
        else:
            oddmax = max(oddmax, c)

    mx_inf = max(good, oddmax)

    q = int(input())

    for _ in range(q):
        w = int(input())
        if w == 0:
            print(mx0)
        else:
            print(mx_inf)
```筛子计算每个数字的最小质因数一次。 因为所有的值最多都是$10^6$，这个预处理成本由每个测试用例共享。 

这`kernel`函数删除素数贡献的平方。 它不存储完整指数，而是跟踪奇偶校验。 每当一个素数出现奇数次时，该素数就会对内核做出贡献。 

频率图表示邻接图中的连接分量。 具有相同内核的每个数字都属于相同的组件。`mx0`回答原始数组。 变量`good`和`oddmax`对稳定状态进行编码。 核 1、偶数组和奇数非一组之间的区别正是上面证明的表征。 

查询处理非常简单，因为一步之后该过程就稳定了。 每个查询都带有$w>0$收到相同的答案。 

## 工作示例

 ### 示例 1

 输入数组：```
6 8 4 2
```| 价值| 因式分解 | 内核|
 | ---| ---| ---|
 | 6 |$2\cdot3$| 6 |
 | 8 |$2^3$| 2 |
 | 4 |$2^2$| 1 |
 | 2 |$2$| 2 |

 频率表：

 | 内核| 频率|
 | ---| ---|
 | 6 | 1 |
 | 2 | 2 |
 | 1 | 1 |

 然后：

 | 变量| 价值|
 | ---| ---|
 | MX0 | 2 |
 | 好| 3 |
 | 奇数最大 | 1 |
 | MX_INF | 3 |

 查询是$w=0$，所以答案是`mx0 = 2`。 

此示例显示时间 0 使用原始组件大小，而不是稳定的组件大小。 

### 示例 2

 输入数组：```
12 3 20 5 80 1
```内核减少：

 | 价值| 内核|
 | ---| ---|
 | 12 | 12 3 |
 | 3 | 3 |
 | 20 | 5 |
 | 5 | 5 |
 | 80| 5 |
 | 1 | 1 |

 频率表：

 | 内核| 频率|
 | ---| ---|
 | 3 | 2 |
 | 5 | 3 |
 | 1 | 1 |

 计算值：

 | 变量| 价值|
 | ---| ---|
 | MX0 | 3 |
 | 好| 3 |
 | 奇数最大 | 3 |
 | MX_INF | 3 |

 查询是$w=1$，所以答案是`mx_inf = 3`。 

此示例表明，即使在稳定后，奇数大小的非单一组件仍可以保持最大的组。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log \log 10^6 + q)$预处理后每个测试用例的总体情况 使用 SPF 分解，核计算接近线性 |
 | 空间|$O(n)$| 每个不同内核的频率映射最多存储一个条目 |

 所有测试用例的数组元素和查询总数仅为$3 \cdot 10^5$。 筛子构建一次，每个值都会使用其最小的质因数快速分解。 该解决方案完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    from collections import defaultdict

    data = io.StringIO(inp)
    input = data.readline

    MAXA = 10**6

    spf = list(range(MAXA + 1))
    for i in range(2, int(MAXA ** 0.5) + 1):
        if spf[i] == i:
            for j in range(i * i, MAXA + 1, i):
                if spf[j] == j:
                    spf[j] = i

    def kernel(x):
        r = 1
        while x > 1:
            p = spf[x]
            parity = 0
            while x % p == 0:
                x //= p
                parity ^= 1
            if parity:
                r *= p
        return r

    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        arr = list(map(int, input().split()))

        freq = defaultdict(int)
        for x in arr:
            freq[kernel(x)] += 1

        mx0 = max(freq.values())

        good = 0
        oddmax = 0

        for k, c in freq.items():
            if k == 1 or c % 2 == 0:
                good += c
            else:
                oddmax = max(oddmax, c)

        mx_inf = max(good, oddmax)

        q = int(input())
        for _ in range(q):
            w = int(input())
            out.append(str(mx0 if w == 0 else mx_inf))

    return "\n".join(out) + "\n"

# provided samples
assert run(
"""2
4
6 8 4 2
1
0
6
12 3 20 5 80 1
1
1
"""
) == """2
3
"""

# minimum size
assert run(
"""1
1
1
2
0
100
"""
) == """1
1
"""

# all equal values
assert run(
"""1
5
2 2 2 2 2
2
0
1
"""
) == """5
5
"""

# all perfect squares
assert run(
"""1
4
4 9 16 25
2
0
10
"""
) == """4
4
"""

# mixed parity frequencies
assert run(
"""1
5
2 8 18 50 3
2
0
1
"""
) == """4
4
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单值 1 | 1, 1 | 最小尺寸和内核 1 处理 |
 | 所有值均相等 | 5, 5 | 一大组件 |
 | 所有完全平方 | 4, 4 | 一切都崩溃到内核 1 |
 | 混合奇偶校验频率| 4, 4 | 正确对待偶数和奇数班级人数 |

 ## 边缘情况

 ### 所有值都减少到内核 1

 输入：```
1
4
4 9 16 25
1
100
```内核是：```
1 1 1 1
```频率表：```
{1: 4}
```我们得到：```
mx0 = 4
good = 4
oddmax = 0
mx_inf = 4
```答案：4。 

将原始值分开的实现会错误地生成四个单例组。 

### 大正时间

 输入：```
1
3
2 2 3
2
1
1000000000000000000
```内核频率：```
2 -> 2
3 -> 1
```然后：```
mx0 = 2
good = 2
oddmax = 1
mx_inf = 2
```两个正时间查询都返回 2。 

该算法从不模拟时间。 它利用了过程在一次变换后稳定下来的事实。 

### 奇数非单一组件

 输入：```
1
3
20 5 80
2
0
1
```所有三个数字都减少到内核 5。 

频率表：```
5 -> 3
```然后：```
mx0 = 3
good = 0
oddmax = 3
mx_inf = 3
```答案：```
3
3
```这验证了奇数大小的非单一群体在稳定后仍然保持分离，并且在计算时仍然必须考虑`mx_inf`。
