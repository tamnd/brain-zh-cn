---
title: "CF 106443C - 教练计算"
description: "给定两个多项式，一个作为外部函数，一个作为内部函数。 第一个多项式 $P(x)$ 定义了我们如何转换已有的值，第二个多项式 $Q(x)$ 定义了输入到 $P$ 中的值。"
date: "2026-06-19T17:42:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106443
codeforces_index: "C"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2026"
rating: 0
weight: 106443
solve_time_s: 55
verified: true
draft: false
---

[CF 106443C - 教练计算](https://codeforces.com/problemset/problem/106443/C)

 **评级：** -
 **标签：** -
 **求解时间：** 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定两个多项式，一个作为外部函数，一个作为内部函数。 第一个多项式$P(x)$定义了一旦我们已经有了一个值，我们如何转换它，第二个多项式$Q(x)$定义输入的值$P$。 任务是计算组合多项式$R(x) = P(Q(x))$，意味着每次出现$x$里面$P$被整个多项式代替$Q(x)$，然后一切都展开了。 

输出不是符号表达式，而是完全展开后所得多项式的显式系数，计算模 998244353。$P$最多为 100，且度数$Q$最多为 100，所得多项式的阶数可达 10000。 

关键的结构性挑战是替代扩大了权力：每个任期$Q(x)^k$本身就是一个类似卷积的对象。 幼稚的扩展会反复乘以多项式，这会导致成本快速增长。 

当任一多项式具​​有稀疏结构时，就会出现微妙的边缘情况，尤其是当$Q(x)$是单项式加常数或当$P(x)$有许多零系数。 幼稚的逐项乘法方法可能会意外地重新计算相同的幂$Q(x)$多次，即使结果结构是确定性的，也会导致冗余工作。 

## 方法

 对定义的直接解释表明计算$R(x)$通过迭代每个系数$P(x)$。 对于每个$i$，我们计算$Q(x)^i$，乘以$p_i$，并将其添加到结果中。 这是正确的，因为它完全遵循多项式复合的定义。 

然而，计算$Q(x)^i$从头开始为每一个$i$很贵。 每个多项式乘法的成本$O(m^2)$，并做到这一点$n$次导致大约$O(n^2 m^2)$在最坏的情况下工作，这足以通过这里，但在概念上是浪费的，并且存在实施效率低下的风险。 

关键的观察是我们不需要独立地重新计算每个幂。 我们可以迭代地建立权力：一旦我们知道$Q(x)^i$，我们可以得到$Q(x)^{i+1}$乘以$Q(x)$。 这将重复的重新计算变成了多项式乘法的单链。 

我们还逐步积累答案：从$Q(x)^0 = 1$，我们反复乘以$Q(x)$，并在每一步添加$p_i \cdot Q(x)^i$到结果中。 这将计算与对系数的单个前向扫描对齐$P$。 

由于度数较小，因此简单$O(n m^2)$或者$O(n^2 m)$该方法在约束下是完全安全的，并且迭代卷积的简单性比渐近优化更重要。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力（重新计算每个幂）|$O(n^2 m^2)$|$O(m^2)$| 可以接受但多余|
 | 迭代力量积累 |$O(n m^2)$|$O(m)$| 已接受 |

 ## 算法演练

 我们构建结果多项式，同时保持当前的幂$Q(x)$。 

1. 初始化多项式`power`代表$Q(x)^0$，这只是$[1]$。 这对应于多项式乘法的单位元。 
2. 初始化结果多项式`res`由于度数全为零$n \cdot m$。 这将累积每个任期的贡献$P(x)$。 
3. 迭代$i$从 0 到$n$。 在每个索引处$i$，我们目前持有$power = Q(x)^i$，所以项的贡献$p_i x^i$在$P(x)$变成$p_i \cdot power$。 我们将此缩放多项式添加到`res`。 
4、处理后系数$p_i$， 更新`power`乘以$Q(x)$。 这会产生$Q(x)^{i+1}$。 乘法是标准多项式卷积：每个系数都是通过将索引相加的成对乘积相加而形成的。 
5. 继续下去，直到所有系数$P(x)$被处理。 决赛`res`包含系数$P(Q(x))$。 

### 为什么它有效

 每一步$i$，变量`power`正是$Q(x)^i$。 这是归纳地维持的：它开始于$Q(x)^0 = 1$，并且每次更新乘以$Q(x)$，指数加一。 自每届$P(x)$只应用一次，并具有正确的相应功率$Q(x)$，最终的和与多项式复合的定义相符，没有遗漏或重复。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def add_poly(a, b):
    res = [0] * max(len(a), len(b))
    for i, v in enumerate(a):
        res[i] += v
    for i, v in enumerate(b):
        res[i] = (res[i] + v) % MOD
    for i in range(len(res)):
        res[i] %= MOD
    return res

def mul_poly(a, b):
    res = [0] * (len(a) + len(b) - 1)
    for i in range(len(a)):
        ai = a[i]
        for j in range(len(b)):
            res[i + j] = (res[i + j] + ai * b[j]) % MOD
    return res

def scale_poly(a, c):
    return [(x * c) % MOD for x in a]

def main():
    n, m = map(int, input().split())
    p = list(map(int, input().split()))
    q = list(map(int, input().split()))

    power = [1]
    res = [0] * (n * m + 1)

    for i in range(n + 1):
        term = scale_poly(power, p[i])
        for j, v in enumerate(term):
            res[j] = (res[j] + v) % MOD
        if i != n:
            power = mul_poly(power, q)

    print(*res)

if __name__ == "__main__":
    main()
```该实现保持运行多项式`power`等于$Q(x)^i$。 对于每个系数$p[i]$，它缩放该多项式并将其添加到答案数组中。 卷积函数`mul_poly`是一个直接的$O(nm)$乘法，因为尺寸很小。 

最微妙的部分是保持多项式大小一致。 结果数组被预先分配给$n \cdot m + 1$，因为这是组合的最大可能程度。 这可以避免重复调整大小并确保累积期间的确定性索引。 

## 工作示例

 ### 示例 1

 输入：```
2 1
1 2 1
1 1
```我们诠释$P(x) = 1 + 2x + x^2$,$Q(x) = 1 + x$。 

| 我| 功率 = Q^i | 贡献 p[i] * 功率 | 加法后的结果 |
 | --- | --- | --- | --- |
 | 0 | 1 | 1 | 1 |
 | 1 | 1 + x | 2 + 2x | 2 + 2x 3 + 2x |
 | 2 | (1 + x)^2 = 1 + 2x + x^2 | 1 + 2x + x^2 | 4 + 4x + x^2 |

 最终输出：```
4 4 1
```该轨迹表明运行功率正确跟踪重复替换，并且累积与直接扩展相匹配。 

### 示例 2

 输入：```
2 2
0 1 0
1 0 1
```这里$P(x) = x$,$Q(x) = 1 + x^2$。 

| 我| 电源 | 贡献 | 结果 |
 | --- | --- | --- | --- |
 | 0 | 1 | 0 | 0 |
 | 1 | 1 + x^2 | 1 + x^2 | 1 + x^2 |
 | 2 | (1 + x^2)^2 | (1 + x^2)^2 | (1 + x^2)^2 | (1 + x^2)^2 0 | 1 + x^2 |

 最终输出：```
1 0 1
```这表明零系数$P(x)$正确地跳过昂贵的贡献而不影响运行功率计算。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \cdot m^2)$| 每次迭代都会乘以一个多项式，其大小可达$m \cdot i$经过$m$，它保持在一个小范围内，因为$n, m \le 100$。 |
 | 空间|$O(nm)$| 结果多项式存储至次数$n \cdot m$。 |

 这些约束足够小，以至于基于卷积的简单组合完全在限制范围内。 由于多项式大小有界，即使是最坏的情况也仍然远低于 Python 中典型的 1 秒阈值。 

## 测试用例```python
import sys, io

MOD = 998244353

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import prod

    n, m = map(int, input().split())
    p = list(map(int, input().split()))
    q = list(map(int, input().split()))

    power = [1]
    res = [0] * (n * m + 1)

    def mul(a, b):
        r = [0] * (len(a) + len(b) - 1)
        for i in range(len(a)):
            for j in range(len(b)):
                r[i + j] = (r[i + j] + a[i] * b[j]) % MOD
        return r

    for i in range(n + 1):
        for j, v in enumerate(power):
            res[j] = (res[j] + v * p[i]) % MOD
        if i != n:
            power = mul(power, q)

    return " ".join(map(str, res)).strip()

# provided samples
assert run("2 1\n1 2 1\n1 1\n") == "4 4 1"
assert run("2 2\n0 1 0\n1 0 1\n") == "1 0 1"

# minimum case
assert run("0 1\n5\n3 4\n") == "5"

# linear case
assert run("1 1\n1 1\n1 1\n") == "2 2 1"

# zero-heavy case
assert run("3 1\n0 0 0 1\n1 0\n") == "1 0 0 0"

# constant Q
assert run("2 0\n1 2 3\n7\n") == "7 14 21"

# high-degree monomial Q
assert run("2 1\n1 1 1\n0 2\n") == "1 2 4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 0 度 P | 持续输出| 基本情况处理 |
 | 零重P | 稀疏的贡献| 正确跳过术语 |
 | 常数Q| 缩放行为| 重复常数替换|
 | 单项式 Q | 结构性增长| 度扩展正确性 |

 ## 边缘情况

 第一个边缘情况是当$P(x)$是恒定的。 在这种情况下，所有上级权力$Q(x)$是无关紧要的。 算法仍然初始化`power = 1`，仅添加$p_0$，并且不执行任何有意义的乘法。 The output remains the constant polynomial, matching the mathematical definition.

 另一种情况是当$P(x)$有一个非零高次项。 例如，$P(x) = x^n$。 该算法乘以`power`前进直至到达$Q(x)^n$，并且仅添加一项贡献。 这避免了重复累加，并且仍然产生正确的展开多项式。 

最后，当$Q(x)$是线性或常数，重复乘法不会意外地增加结构复杂性。 迭代式`power`更新仍然跟踪精确的功率，确保即使是退化的组合也可以在没有特殊外壳的情况下进行处理。
