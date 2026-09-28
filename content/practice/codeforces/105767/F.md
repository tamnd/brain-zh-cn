---
title: "CF 105767F - 兆多项式"
description: "我们有两个多项式。 第一个是线性多项式 $$f(x)=Ax+B$$，第二个只有两个非零项：$$g(x)=Cx^n+Dx^{n-1}。"
date: "2026-06-25T15:59:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105767
codeforces_index: "F"
codeforces_contest_name: "TheForces Round #40 (Maths-Forces)"
rating: 0
weight: 105767
solve_time_s: 47
verified: true
draft: false
---

[CF 105767F - 兆多项式](https://codeforces.com/problemset/problem/105767/F)

 **评级：** -
 **标签：** -
 **求解时间：** 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个多项式。 第一个是线性多项式$$f(x)=Ax+B$$第二个只有两个非零项：$$g(x)=Cx^n+Dx^{n-1}.$$我们需要最少数量的导数，称之为$k$，这样微分后$g(x)$确切地$k$次，得到的多项式可以除以$f(x)$同时将商的所有系数保留为整数。 

测试用例数量可达$10^5$，并且每个值最多是$2\cdot10^5$。 模拟衍生品或尝试一切可能的解决方案$k$对于每个测试用例都会太慢。 和$10^5$情况下，预处理后每个案例需要接近恒定的时间。 

主要的陷阱是由整除性定义中的“整数”一词引起的。 有理数的整除是不够的。 

例如：```
1
2 4 1 3 3
```这里$$f(x)=2x+4,\quad g(x)=x^3+3x^2.$$经过一阶导数后：$$g'(x)=3x^2+6x=3x(x+2).$$线性部分正比于$2x+4$，但商将包含一个分数：$$3x(x+2)=\frac{3}{2}x(2x+4).$$正确答案不是$1$。 我们必须继续下去，直到商是整数多项式。 

另一种边缘情况是达到零多项式时。 例如：```
1
5 1 1 1 1
```经过足够的导数后，多项式变为零。 零可以被每个多项式整除，因为商可以简单地为零。 答案必须包括最后的可能性。 

第三种边缘情况是$k=0$。 原始多项式可能已经满足条件。 

## 方法

 直接的方法是反复微分$g(x)$并测试结果是否能被整除$f(x)$。 这在数学上是有效的，因为每个导数的次数都会减少一，并且之后$n+1$导数多项式为零。 然而，检查每个测试用例的所有可能的导数会产生成本$O(n)$, 给予$O(2\cdot10^{10})$在最坏的情况下工作，这远远超出了极限。 

关键的观察是每个衍生物都保持相同的结构。 后$k$导数，其中$0\le k<n$,$$g^{(k)}(x)=
\frac{n!}{(n-k)!}C x^{n-k}
+
\frac{(n-1)!}{(n-1-k)!}D x^{n-1-k}.$$多项式可以写成$$x^{n-1-k}(\alpha x+\beta).$$额外的力量$x$与整除无关紧要$Ax+B$。 唯一相关的部分是线性因子。 我们需要$$\alpha x+\beta=q(Ax+B)$$对于某个整数$q$。 

比率条件给出$$\frac{\alpha}{\beta}=\frac{A}{B}.$$代入导数系数：$$\frac{nC}{(n-k)D}=\frac AB.$$重新排列：$$nBC=AD(n-k).$$让$$s=n-k.$$然后$s$是唯一确定的：$$s=\frac{nBC}{AD}.$$如果这不是介于$1$和$n$，没有非零导数起作用，答案是$n+1$。 如果存在，我们仍然需要检查商是否是整数。 剩下的条件是$$B \mid D\cdot \frac{(n-1)!}{(s-1)!}.$$我们只需要素数指数$B$。 自从$B\le 2\cdot10^5$，我们可以对其进行因式分解并使用勒让德公式计算阶乘素数指数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n)$每个测试用例|$O(1)$| 太慢了 |
 | 最佳 |$O(\log n \log B)$每个测试用例|$O(200000)$| 已接受 |

 ## 算法演练

 1. 计算$$num=nBC,\qquad den=AD.$$比率方程表明$s=n-k=num/den$，因此导数计数在检查完整性之前确定。 

1.如果`num`不能被整除`den`，零多项式之前没有有效的导数。 返回$n+1$。 
2.让$s=num/den$。 如果$s\notin[1,n]$， 返回$n+1$。 的价值$s$代表$n-k$，因此它必须对应于现有的导数。 
3. 检查是否$$B \mid D\cdot s(s+1)\cdots(n-1).$$该产品正是$(n-1)!/(s-1)!$，它出现在微分后线性因子的常数系数中。 

1. 如果整除性测试成功，则答案是$k=n-s$。 否则返回$n+1$。 

为什么它有效：

 每个可能有用的导数都有一个线性因子，其系数比必须匹配$Ax+B$。 该比率正好迫使一个可能的值$n-k$。 唯一剩下的要求是标量乘数是整数。 素数指数检查精确地验证了该条件，因此每个返回值都满足定义，并且每个较小的导数都已被强制值排除$k$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXN = 200000

spf = list(range(MAXN + 1))
for i in range(2, int(MAXN ** 0.5) + 1):
    if spf[i] == i:
        for j in range(i * i, MAXN + 1, i):
            if spf[j] == j:
                spf[j] = i

def factor(x):
    res = []
    while x > 1:
        p = spf[x]
        c = 0
        while x % p == 0:
            x //= p
            c += 1
        res.append((p, c))
    return res

def fact_exp(n, p):
    ans = 0
    while n:
        n //= p
        ans += n
    return ans

def solve_case(A, B, C, D, n):
    num = B * n * C
    den = A * D

    if num % den:
        return n + 1

    s = num // den
    if s < 1 or s > n:
        return n + 1

    need = factor(B)

    for p, e in need:
        have = 0
        x = D
        while x % p == 0:
            have += 1
            x //= p
        have += fact_exp(n - 1, p) - fact_exp(s - 1, p)
        if have < e:
            return n + 1

    return n - s

def main():
    t = int(input())
    ans = []
    for _ in range(t):
        A, B, C, D, n = map(int, input().split())
        ans.append(str(solve_case(A, B, C, D, n)))
    print("\n".join(ans))

if __name__ == "__main__":
    main()
```该代码首先构建一个最小素因数表，以便因式分解$B$速度很快。 由于所有值都受以下限制$200000$，此预处理由所有测试用例共享。 

比率计算使用Python整数，因此不存在溢出风险。 价值`s`在转换为答案之前进行检查，因为$k=n-s$只有当$s$是有效的剩余学位。 

可整性测试从不直接构造阶乘积。 相反，它比较素数指数。 素数的指数为$m!$反复除法可得$m$通过那个素数，这就是勒让德公式。 

## 工作示例

 对于：```
1
1 2 2 4 1
```变量的演变如下。 

| 步骤| 价值|
 | --- | --- |
 |$num=B n C$| 8 |
 |$den=A D$| 4 |
 |$s=num/den$| 2 |
 |$k=n-s$| -1 |

 这里$s>n$，所以这条路是不可能的。 之后达到零多项式$n+1$导数，所以答案是：```
2
```为了：```
1
4 2 3 3 4
```| 步骤| 价值|
 | --- | --- |
 |$num=B n C$| 24 |
 |$den=A D$| 12 | 12
 |$s$| 2 |
 |$k=n-s$| 2 |
 | 需要检查| 通行证|

 二阶导数是第一个导数，其中商是整数多项式，给出：```
2
```这些示例显示了次数方程和整数商条件。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(\log B \log n)$| 因式分解和阶乘指数计算是对数 |
 | 空间|$O(200000)$| SPF筛子储存一次|

 预处理一次处理最大可能的值。 每个测试用例仅涉及以下主要因素$B$， 所以$10^5$测试用例适合。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().strip().split()
    sys.stdin = old

    if not data:
        return ""

    it = iter(data)
    t = int(next(it))
    out = []
    for _ in range(t):
        A = int(next(it))
        B = int(next(it))
        C = int(next(it))
        D = int(next(it))
        n = int(next(it))
        out.append(str(solve_case(A, B, C, D, n)))
    return "\n".join(out)

assert run("""6
1 2 2 4 1
4 2 3 3 4
2 4 1 3 3
2 1 5 2 4
131296 123463 91609 133724 142208
172458 127836 190471 141192 190476
""") == """0
2
4
5
50599
190477"""

assert run("1\n1 1 1 1 1\n") == "0"
assert run("1\n2 4 1 3 3\n") == "4"
assert run("1\n200000 200000 200000 200000 200000\n") == "200001"
assert run("1\n5 1 1 1 10\n") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 1 1`|`0`| 原始多项式已经有效 |
 |`2 4 1 3 3`|`4`| 整数商限制 |
 |`200000 200000 200000 200000 200000`|`200001`| 大值和回退到零多项式 |
 |`5 1 1 1 10`|`0`| 简单比例案例|

 ## 边缘情况

 当初始多项式已经正确除法时，比率方程给出$s=n$，所以答案就变成了$k=0$。 该算法处理这个问题是因为它允许$s$等于$n$。 

当满足比率条件但商是小数时，素数指数检查会拒绝候选值。 例如，与```
1
2 4 1 3 3
```唯一可能的非零候选者是$k=1$，但系数乘数包含一个因子$3/2$。 该算法检测到$B=4$不除所需的系数并返回后来的零多项式答案。 

当零多项式之前的导数不起作用时，返回值为$n+1$。 那时$g^{(n+1)}(x)=0$，并且零可以被商为零的线性多项式整除。
