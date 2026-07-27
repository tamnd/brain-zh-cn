---
title: "CF 102780D - 强力游戏"
description: "我们需要找到最小的正整数 x，使得 a 的指数 x 的幂等于 x 的指数 b 的幂。 两个输入值是这个方程涉及的基数，答案是不超过10^18的最小有效x。"
date: "2026-07-27T20:07:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102780
codeforces_index: "D"
codeforces_contest_name: "ICPC Central Russia Regional Contest (CRRC 19)"
rating: 0
weight: 102780
solve_time_s: 71
verified: true
draft: false
---

[CF 102780D - 强力发挥](https://codeforces.com/problemset/problem/102780/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要找到最小的正整数 x，使得 a 的指数 x 的幂等于 x 的指数 b 的幂。 两个输入值是这个方程涉及的基数，答案是不超过10^18的最小有效x。 如果不存在这样的整数，我们打印 0。 

a 和 b 的值最多为 10000，因此输入本身的搜索空间很小，但 x 可能非常大。 直接搜索可能的 x 值是不可能的，因为答案可能接近 10^18 的上限。 解决方案必须使用方程的数学结构，而不是一一尝试候选者。 

主要的隐藏困难是 x 既作为底数又作为指数出现。 粗心的解决方案可能会尝试比较浮点对数，但精度错误可能会将相等检查更改为不正确的结果。 另一个常见的错误是假设解决方案总是存在，因为一些小例子有效。 

例如，输入`2 6`无解，正确的输出是`0`。 仅检查少量候选者的搜索可能会错误地过早停止，并忽略没有任何价值有效的事实。 

另一种边缘情况是有效 x 不等于 a 时。 用于输入`2 4`，答案是`16`， 因为`2^16 = 16^4`。 从底数猜测 x 或仅检查与 a 相关的 x 值会错过实际的解决方案。 

当 a 的质因数具有共同的指数结构时，会出现第三种情况。 用于输入`100 20`，答案是`10`。 解决方案来自减少 a 的素数指数，而不是尝试接近 a 的值。 

## 方法

 强力解决方案将测试从 1 到 10^18 的每个整数 x 并检查是否`a^x = x^b`。 相等性检查可以通过整数运算来完成，因此该方法是正确的，但候选者的数量远远超出了程序可以处理的范围。 即使每个候选者执行一次操作也需要大约 10^18 次操作，而一秒的限制只允许更少数量的操作。 

有用的观察来自于对主要因素的研究。 假设 a 的质因数分解为：```
a = p1^c1 * p2^c2 * ... * pk^ck
```等式右边是`x^b`，因此 x 的每个素因数必须已经出现在 a 中。 如果 x 包含一个新素数，则该素数将出现在右侧而不是左侧。 

对于每个素数 pi，令其在 x 中的指数为 ei。 比较两边的素数指数得出：```
x * ci = b * ei
```这意味着每个指数 ei 都由 x 控制。 我们首先删除 b 和 a 的所有指数共享的公约数。 让：```
g = gcd(b, c1, c2, ..., ck)
```然后：```
b = g * b'
ci = g * ci'
```方程变为：```
ei = x * ci' / b'
```所以 b' 必须整除 x。 写：```
x = b' * n
```将其代入指数公式得出：```
ei = n * ci'
```所以：```
x = p1^(n*c1') * p2^(n*c2') * ... * pk^(n*ck')
```这可以重写为：```
x = (p1^c1' * p2^c2' * ... * pk^ck')^n
```让：```
q = p1^c1' * p2^c2' * ... * pk^ck'
```现在整个问题变成找到一个满足以下条件的正整数 n：```
q^n = b' * n
```q 的值至少为 2。因为 x = q^n 不能超过 10^18，所以 n 最多只能在 60 左右。 我们可以简单地测试这个小范围内所有可能的 n 值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(10^18) | O(10^18) | O(1) | O(1) | 太慢了 |
 | 最佳| O(log(10^18) + sqrt(a)) | O(log(10^18) + sqrt(a)) | O(a 的质因数个数) | 已接受 |

 ## 算法演练

 1. 对 a 进行因式分解并存储每个素数指数。 这给出了比较方程两边素数幂所需的值 ci 。 
2. 计算`g`、b 的最大公约数和 a 因式分解的每个指数。 除以 g 会删除不必要的共享部分并留下减少的值 b' 和 ci'。 
3. 使用约简指数构建 q：```
q = product of p^(ci/g)
```该值表示约简后幂可以变为 x 的底数。 

1. 尝试从 1 开始增加 n 的值。对于每个 n，计算`q^n`如果超过 10^18 则停止。 如果：```
q^n == b' * n
```然后`q^n`是一个有效的 x。 由于 n 是按升序检查的，并且 q 大于 1，因此找到的第一个答案是最小的答案。 

1. 如果n的所有可能值都失败，则输出0，因为在允许的范围内不存在有效的x。 

为什么它有效：

 质因数比较将原始方程转换为更小的方程。 每个可能的解决方案都必须具有以下形式`x = q^n`，并且每个有效的 n 必须满足`q^n = b'n`。 该算法准确地检查这些可能的值，因此它不会错过解决方案。 由于搜索是从最小的 n 开始的，因此第一个匹配给出了可能的最小 x。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LIMIT = 10**18

def factorize(x):
    factors = []
    d = 2
    while d * d <= x:
        if x % d == 0:
            cnt = 0
            while x % d == 0:
                x //= d
                cnt += 1
            factors.append((d, cnt))
        d += 1 if d == 2 else 2
    if x > 1:
        factors.append((x, 1))
    return factors

def solve():
    a, b = map(int, input().split())

    factors = factorize(a)

    g = b
    for _, c in factors:
        g = __import__("math").gcd(g, c)

    b_red = b // g

    q = 1
    for p, c in factors:
        q *= p ** (c // g)

    power = 1
    n = 1
    while True:
        power *= q
        if power > LIMIT:
            break

        if power == b_red * n:
            print(power)
            return

        n += 1

    print(0)

if __name__ == "__main__":
    solve()
```因式分解函数提取 a 的质数表示。 10000 的输入限制使得试除法足够快。 

最大公约数计算精确地按照证明中导出的方式减少指数。 变量`q`存储减少的基数，因此每个候选答案都具有通过重复乘以 q 生成的形式。 

循环开始于`power = q`，表示 n 等于 1。每次迭代将 n 加一并更新 q^n。 一旦该值超过 10^18，后面的值会更大，因为 q 至少为 2，因此搜索可以安全停止。 

所有计算都使用Python整数，因此不存在溢出风险。 明确的限制检查可以防止不必要的巨大权力增长。 

## 工作示例

 对于输入`2 4`，因式分解为：

 | n | q^n | b' * n | 结果 |
 | ---| ---| ---| ---|
 | 1 | 2 | 4 | 不等于|
 | 2 | 4 | 8 | 不等于|
 | 3 | 8 | 12 | 12 不等于|
 | 4 | 16 | 16 16 | 16 发现 |

 这里`g = gcd(4, 1) = 1`， 所以`q = 2`和`b' = 4`。 第一个匹配的 n 是 4，给出 x = 16。 

对于输入`2 6`，简化后的方程为：

 | n | q^n | b' * n | 结果 |
 | ---| ---| ---| ---|
 | 1 | 2 | 6 | 不等于|
 | 2 | 4 | 12 | 12 不等于|
 | 3 | 8 | 18 | 18 不等于|
 | 4 | 16 | 16 24 | 不等于|
 | 5 | 32 | 32 30| 不等于|
 | 6 | 64 | 64 36 | 36 不等于|

 2 的幂最终增长得比线性表达式 6n 更快，并且在达到值限制之前不会出现等式。 该算法打印 0。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(sqrt(a) + log(10^18)) | O(sqrt(a) + log(10^18)) | 因式分解检查除数最大为 sqrt(a)，搜索仅尝试大约 60 个 n | 值
 | 空间| O(k) | 因子列表仅存储 | 的素因子。 

对 a 和 b 的约束使得因式分解成本低廉。 变换后的搜索空间很小，因为答案的边界为 10^18，并且 q 至少为 2，因此该算法很容易满足限制。 

## 测试用例```python
import sys
import io
import math

def solution(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    a, b = map(int, input().split())

    def factorize(x):
        factors = []
        d = 2
        while d * d <= x:
            if x % d == 0:
                cnt = 0
                while x % d == 0:
                    x //= d
                    cnt += 1
                factors.append((d, cnt))
            d += 1 if d == 2 else 2
        if x > 1:
            factors.append((x, 1))
        return factors

    factors = factorize(a)
    g = b
    for _, c in factors:
        g = math.gcd(g, c)

    b_red = b // g
    q = 1
    for p, c in factors:
        q *= p ** (c // g)

    power = 1
    n = 1
    while True:
        power *= q
        if power > 10**18:
            break
        if power == b_red * n:
            return str(power)
        n += 1

    return "0"

assert solution("2 4") == "16", "sample 1"
assert solution("2 6") == "0", "sample 2"
assert solution("2 32") == "256", "sample 3"
assert solution("100 20") == "10", "sample 4"

assert solution("2 3") == "0", "no solution at small values"
assert solution("10000 9999") == "0", "maximum input size"
assert solution("8 4") == "0", "equal prime exponent pattern"
assert solution("4 8") == "16", "reduced exponent boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 3`|`0`| 没有有效解的最小值 |
 |`10000 9999`|`0`| 大输入值和快速拒绝 |
 |`8 4`|`0`| 常见指数结构无法给出答案的情况 |
 |`4 8`|`16`| 减少指数并找到一个不平凡的解决方案 |

 ## 边缘情况

 对于`2 6`，算法发现`g = 1`,`q = 2`， 和`b' = 6`。 它检查所有可能的 n 值，同时`2^n`保持在限制以下。 没有值满足`2^n = 6n`，因此它输出 0。这处理了看起来有效的方程没有整数解的情况。 

为了`2 4`，算法不假设答案接近 a。 它建立了简化的方程`2^n = 4n`，发现 n 等于 4，并返回`2^4 = 16`。 这证实了生成的 x 可以比原始基数大得多。 

为了`100 20`，因式分解给出`100 = 2^2 * 5^2`。 b 和指数的 gcd 为 2，产生`q = 10`和`b' = 10`。 第一个检查给出`10^1 = 10 * 1`，因此算法立即返回 10。 这涵盖了减少素数指数产生小解的情况。 

如果您想要更紧凑的竞赛发布格式，我还可以将这篇社论改编成更短的 Codeforces 风格版本。
