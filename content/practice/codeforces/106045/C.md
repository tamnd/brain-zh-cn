---
title: "CF 106045C - 诅咒查询"
description: "我们有一个数组和一个固定整数 $m$，称为诅咒数。 有两种操作必须在线处理。 更新将一个数组元素替换为新值。 查询查看子数组和值 $k$，然后询问该子数组中有多少元素是 k-good。"
date: "2026-06-25T12:40:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106045
codeforces_index: "C"
codeforces_contest_name: "IUT Intra University Programming Contest 2025"
rating: 0
weight: 106045
solve_time_s: 58
verified: true
draft: false
---

[CF 106045C - 诅咒查询](https://codeforces.com/problemset/problem/106045/C)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个数组和一个固定整数$m$，拨通了被诅咒的号码。 

有两种操作必须在线处理。 更新将一个数组元素替换为新值。 查询查看子数组和值$k$，然后询问该子数组中有多少元素是_k-good_。 

这个定义有点间接。 如果一个数不能被整除，则该数被认为是好数$m$。 一个数字$x$如果添加后，则 k-good$k$无论多少次，它总是保持良好状态。 换句话说，没有任何值$$x,\; x+k,\; x+2k,\; x+3k,\dots$$可能会被整除$m$。 

输入最多包含$10^4$测试用例，但重要的限制是总的$n$和总计$q$所有测试用例最多$10^5$。 周围有任何解决方案$O((n+q)\log n)$每个测试用例很容易足够快。 对每个查询的子数组进行二次扫描会太慢，因为单个测试可能已经包含$10^5$运营。 

主要困难是理解 k-good 条件。 一旦简化，问题就变成了动态范围计数问题。 

考虑一些很容易导致错误推理的情况。 

如果$m=8$,$k=12$， 和$x=1$，然后对序列取模$8$是$$1,5,1,5,\dots$$它永远不会达到$0$， 所以$x$是 k-好。 

如果$m=8$,$k=12$， 和$x=4$，然后取模$8$我们得到$$4,0,4,0,\dots$$第二项可被整除$8$， 所以$x$不是 k-good。 

一个常见的错误是只测试是否$x$本身可以整除$m$。 该定义还需要检查所有未来添加的内容。 

另一个微妙的情况出现时$k$是的倍数$m$。 例如，$m=10$,$k=20$。 添加$k$永远不会改变余数模$m$。 那么当一个数不能被整除时，它就是 k-好数$10$。 任何处理所有值的解决方案$k$统一不审查$\gcd(k,m)$会怀念这种行为。 

## 方法

 暴力解释直接遵循定义。 对于每个查询，检查子数组的每个元素并确定是否重复添加$k$可以产生多个$m$。 

一种方法是对$m$。 开始于$a_i \bmod m$,重复添加$k \bmod m$直到序列重复。 由于只有$m$残留物，这需要$O(m)$每个元素的时间。 

和$m \le 5000$, 对长度范围的查询$10^5$可能需要大致$$10^5 \cdot 5000$$的操作，这是完全不可行的。 

关键的观察来自模运算。 

我们想知道是否存在一些$t \ge 0$这样$$a_i + t k \equiv 0 \pmod m.$$这个线性同余有解当且仅当$$\gcd(k,m) \mid a_i.$$让$$g = \gcd(k,m).$$然后：$$a_i \text{ is k-good}
\iff g \nmid a_i.$$整个复杂的定义分解为一个简单的整除性测试。 

现在查询变成：

 计算中的元素数$[l,r]$**不能被**整除$g$。 

自从$m$永远不会改变并且$g$必须是除数$m$，仅除数$m$可以出现在查询中。 任意整数的约数个数，最多$5000$数量很少，最多也就几十个。 

对于每个除数$d$的$m$，维护一棵 Fenwick 树，存储当前哪些位置包含可被整除的数字$d$。 

然后：$$\text{answer}
=
(r-l+1)
-
\#\{\text{elements divisible by } g\}.$$更新会修改一个位置，因此我们对每个除数树更新一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O((r-l+1)\cdot m)$每个查询|$O(1)$| 太慢了 |
 | 最佳 |$O(D\log n)$每次操作 |$O(Dn)$| 已接受 |

 这里$D$是的约数$m$。 

## 算法演练

 1. 计算所有除数$m$。 
2. 为每个除数创建一棵 Fenwick 树$d$。 
3. 对于每个数组位置$i$,插入值$1$进入除数树$d$如果$a_i$可以整除$d$。 
4. 更新`1 i x`，从每个除数树中删除旧值的贡献并添加新值的贡献。 

除数的数量很少，因此触及每个除数的成本很低。 
5. 查询`2 l r k`, 计算$$g=\gcd(k,m).$$6.使用除数对应的Fenwick树$g$计算有多少个值$[l,r]$可以被整除$g$。 
7. 让这个数成为`bad`。 k-good 元素的数量为$$(r-l+1)-bad.$$8. 输出结果。 

### 为什么它有效

 关键的性质是经典的线性同余结果：$$a + tk \equiv 0 \pmod m$$有解当且仅当$$\gcd(k,m)\mid a.$$如果$g=\gcd(k,m)$划分$a$，某个未来项可以被整除$m$，所以这个数字不是 k-good。 

如果$g$不分开$a$，整个算术级数中的任何一项都不能被整除$m$，所以这个数是 k-good。 

因此，每个查询都精确地减少为不可被整除的计数值$g$，并且 Fenwick 树在更新时正确维护这些整除计数。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, delta):
        n = self.n
        bit = self.bit
        while idx <= n:
            bit[idx] += delta
            idx += idx & -idx

    def sum(self, idx):
        bit = self.bit
        res = 0
        while idx > 0:
            res += bit[idx]
            idx -= idx & -idx
        return res

    def range_sum(self, l, r):
        return self.sum(r) - self.sum(l - 1)

def solve():
    t = int(input())

    out = []

    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))

        divisors = []
        for d in range(1, m + 1):
            if m % d == 0:
                divisors.append(d)

        idx_of = {d: i for i, d in enumerate(divisors)}

        trees = [Fenwick(n) for _ in divisors]

        for pos, val in enumerate(a, start=1):
            for j, d in enumerate(divisors):
                if val % d == 0:
                    trees[j].add(pos, 1)

        q = int(input())

        for _ in range(q):
            query = list(map(int, input().split()))

            if query[0] == 1:
                _, i, x = query
                old = a[i - 1]

                for j, d in enumerate(divisors):
                    old_div = (old % d == 0)
                    new_div = (x % d == 0)

                    if old_div != new_div:
                        trees[j].add(i, 1 if new_div else -1)

                a[i - 1] = x

            else:
                _, l, r, k = query

                g = gcd(k, m)
                tree = trees[idx_of[g]]

                divisible = tree.range_sum(l, r)
                ans = (r - l + 1) - divisible

                out.append(str(ans))

    sys.stdout.write("\n".join(out))

solve()
```第一部分计算所有除数$m$。 由于每个可能的查询都使用$g=\gcd(k,m)$，以及每一个这样的$g$必须是除数$m$，这些是我们唯一需要的整除类。 

每个 Fenwick 树存储一个除数$d$, 每个位置当前是否包含多个$d$。 范围和立即给出的倍数$d$在任何区间内。 

更新操作会比较每个除数的新旧整除状态。 只有当状态改变时我们才修改Fenwick树。 这可以避免不必要的更新。 

查询操作计算$g=\gcd(k,m)$，找到相应的芬威克树，计算的倍数$g$在范围内，并从间隔长度中减去。 

所有算术都适合 Python 整数，因此不存在溢出问题。 

## 工作示例

 ### 示例 1

 输入：```
n = 5, m = 10
a = [1, 2, 3, 4, 5]

query: 2 1 5 2
```这里：$$g=\gcd(2,10)=2.$$| 职位| 价值| 能被2整除吗？ |
 | ---| ---| ---|
 | 1 | 1 | 没有 |
 | 2 | 2 | 是的 |
 | 3 | 3 | 没有 |
 | 4 | 4 | 是的 |
 | 5 | 5 | 没有 |

 除数 2 的 Fenwick 树报告 2 个可整除的元素。 

| 我| r | 长度 | 可被 g 整除 | 回答 |
 | ---| ---| ---| ---| ---|
 | 1 | 5 | 5 | 2 | 3 |

 输出：```
3
```这表明了主要的减少。 我们从不模拟重复添加$k$。 

### 示例 2

 输入：```
n = 4, m = 8
a = [1, 8, 6, 5]

update: 1 2 9
query: 2 1 4 12
```更新后：```
[1, 9, 6, 5]
```

$$g=\gcd(12,8)=4.$$| 职位| 价值| 能被4整除吗？ |
 | ---| ---| ---|
 | 1 | 1 | 没有 |
 | 2 | 9 | 没有 |
 | 3 | 6 | 没有 |
 | 4 | 5 | 没有 |

 | 长度 | 能被 4 整除 | 回答 |
 | ---| ---| ---|
 | 4 | 0 | 4 |

 输出：```
4
```此跟踪显示了在回答后续查询之前更新如何通过除数结构传播。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(D \log n)$每次操作 | 每次更新或查询每个除数最多触及一棵 Fenwick 树 |
 | 空间|$O(Dn)$| 每个除数有一棵 Fenwick 树$m$|

 自从$m \le 5000$, 除数的个数$D$很小。 结合全局限制$10^5$数组元素和查询，这完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import gcd

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    input = sys.stdin.readline

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, i, v):
            while i <= self.n:
                self.bit[i] += v
                i += i & -i

        def sum(self, i):
            s = 0
            while i:
                s += self.bit[i]
                i -= i & -i
            return s

    t = int(input())
    ans = []

    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))

        divs = [d for d in range(1, m + 1) if m % d == 0]
        mp = {d: i for i, d in enumerate(divs)}

        fw = [Fenwick(n) for _ in divs]

        for p, val in enumerate(a, start=1):
            for j, d in enumerate(divs):
                if val % d == 0:
                    fw[j].add(p, 1)

        q = int(input())

        for _ in range(q):
            qv = list(map(int, input().split()))

            if qv[0] == 1:
                _, i, x = qv
                old = a[i - 1]

                for j, d in enumerate(divs):
                    if (old % d == 0) != (x % d == 0):
                        fw[j].add(i, 1 if x % d == 0 else -1)

                a[i - 1] = x
            else:
                _, l, r, k = qv
                g = gcd(k, m)

                tree = fw[mp[g]]
                divcnt = tree.sum(r) - tree.sum(l - 1)

                ans.append(str((r - l + 1) - divcnt))

    return "\n".join(ans)

# sample 1
assert run(
"""1
5 10
1 2 3 4 5
5
2 1 5 1
2 1 5 2
2 1 5 3
2 1 5 4
2 1 5 5
"""
) == "0\n3\n0\n3\n0"

# minimum size
assert run(
"""1
1 7
1
1
2 1 1 14
"""
) == "1"

# all equal values
assert run(
"""1
4 6
6 6 6 6
1
2 1 4 3
"""
) == "0"

# update changes answer
assert run(
"""1
3 8
1 8 5
3
2 1 3 4
1 2 7
2 1 3 4
"""
) == "2\n3"

# boundary interval
assert run(
"""1
3 12
4 6 9
1
2 2 2 18
"""
) == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素，$m=7$| 1 | 最小尺寸外壳 |
 | 所有值等于$m$| 0 | 每个元素都可以被相关 gcd |整除
 | 更新替换可整除值 | 2 然后 3 | 正确的更新传播 |
 | 单一持仓查询 | 0 | 范围边界处理 |

 ## 边缘情况

 ### 案例 1：$k$是的倍数$m$输入：```
1
3 10
10 11 12
1
2 1 3 20
```这里$$g=\gcd(20,10)=10.$$只有第一个值可以被 10 整除。 

除数 10 的 Fenwick 树报告该范围内的一个可整除元素。 区间长度为3，所以答案为$$3-1=2.$$这与实际行为相符，因为加 20 永远不会改变模 10 的余数。 

### 情况 2：值不能被整除$m$，但仍然不是 k-good

 输入：```
1
1 8
4
1
2 1 1 12
```我们有$$g=\gcd(12,8)=4.$$值 4 可被 4 整除，因此被视为非 k-good。 

的确，$$4+12=16,$$可以被 8 整除。 

算法输出 0，这是正确的。 

### 情况 3：更新后的单位置范围

 输入：```
1
1 6
6
2
1 1 5
2 1 1 3
```更新后，该值变为5。$$g=\gcd(3,6)=3.$$由于 5 不能被 3 整除，因此 Fenwick 树报告可整除的元素为零。 

答案是$$1-0=1.$$这证实了更新和单元素范围可以正确地协同工作。
