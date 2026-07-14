---
title: "CF 103399D - 快速模乘模 64 位模"
description: "我们得到两个整数，并要求在非常大的模数下计算它们的乘积，其中模数是完整的 64 位值。"
date: "2026-07-03T12:08:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103399
codeforces_index: "D"
codeforces_contest_name: "Fast modular multiplication"
rating: 0
weight: 103399
solve_time_s: 45
verified: true
draft: false
---

[CF 103399D - 快速模乘模 64 位模](https://codeforces.com/problemset/problem/103399/D)

 **评级：** -
 **标签：** -
 **求解时间：** 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到两个整数，并要求在非常大的模数下计算它们的乘积，其中模数是完整的 64 位值。 关键的困难不是乘法本身，而是安全地执行它而不会溢出，同时仍然保持对大数取模的正确性。 

从概念上讲，任务很简单：我们要计算$a \cdot b \bmod m$，但两者都$a \cdot b$中间结果可能会超出 64 位有符号或无符号限制，具体取决于语言和实现细节。 自从$m$itself is a 64-bit integer, naive multiplication in a fixed-width type can silently wrap around before the modulus is applied, producing incorrect results.

 The input represents repeated independent queries, each consisting of two large integers and a modulus. The output for each query is the correct modular product.

 约束的含义是微妙的。 A single multiplication is constant time mathematically, but in implementation, we cannot rely on built-in 128-bit arithmetic in all environments. A solution must avoid intermediate overflow using a technique that simulates multiplication safely using only 64-bit operations.

 当两个操作数接近时会出现边缘情况$2^{64}$。 例如，如果$a = 2^{63}$,$b = 2$，那么真实的乘积立即超过 64 位。 在应用模数之前，使用包装算术的语言中的简单方法可能会计算零或不正确的包装值。 

另一个有问题的情况是当模数本身接近时$2^{64}$。 例如，如果$m = 2^{64} - 1$, even intermediate multiplication must be carefully controlled, because any overflow invalidates the modular reduction logic.

 ## 方法

 The brute-force approach is to compute the product directly using native integer multiplication and then apply modulo. This works in languages with unbounded integers, because the product is computed exactly before reduction. However, in fixed 64-bit arithmetic, multiplication overflows before the modulus is applied, so the computed value is already corrupted.

 The failure point is straightforward: multiplying two 64-bit integers can require up to 128 bits of precision. If the environment only supports 64-bit arithmetic, the intermediate result is lost.

 The key observation is that modular multiplication can be decomposed into additions. 而不是计算$a \cdot b$直接地，我们将乘法解释为重复加倍和条件加法，类似于二进制求幂逻辑。 这避免了形成大的中间产品。 每一步都会使值减少模数$m$，确保所有中间体都在范围内。 

我们还可以使用位分解来加速这一过程：我们扫描一个操作数的位并累积另一个操作数的贡献，在每一步的模数下安全地加倍。 

这将乘法从潜在溢出的操作转换为一系列受控的加法和加倍，所有这些都可以安全地减少模数$m$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(1) | O(1) | O(1) | O(1) | 固定 64 位算术失败 |
 | 按位模乘 | O(log b) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们计算$a \cdot b \bmod m$使用乘法器的二进制分解。 

1. 将结果变量初始化为零，并对两个输入数进行模减$m$。 尽早减少可确保所有后续操作保持有限并防止不必要的增长。 
2. Iterate over the bits of the multiplier$b$。 在每一步中，我们都会检查当前位是否已设置。 如果是，我们将被乘数的当前值添加到结果中，并立即应用模数。 这是有效的，因为每个设置位代表二进制扩展中的二次方贡献。 
3. 处理完每一位后，我们将模数下的被乘数加倍。 This corresponds to shifting its weight from$2^k$到$2^{k+1}$在二进制表示中。 The modulus keeps this doubling safe from overflow.
 4. Continue until all bits of the multiplier have been processed. The accumulated result is the final modular product.

 ### 为什么它有效

 The correctness comes from interpreting multiplication as a sum of shifted contributions. 任意整数$b$可以写成 2 的幂之和，然后乘以$a$distributes over this representation. 该算法准确地反映了这种分解：每当设置一个位时，我们都会添加相应的二次幂缩放值$a$，并且我们通过确保每个中间值减少模数来保持正确性$m$。 溢出不会影响正确性，因为中间计算不会以有意义的方式超出模数边界。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def mod_mul(a, b, m):
    a %= m
    b %= m
    res = 0

    while b > 0:
        if b & 1:
            res = (res + a) % m
        a = (a + a) % m
        b >>= 1

    return res

def solve():
    t = int(input())
    for _ in range(t):
        a, b, m = map(int, input().split())
        print(mod_mul(a, b, m))

if __name__ == "__main__":
    solve()
```功能`mod_mul`实现模数下的二进制乘法。 关键的想法是`a`重复加倍，代表连续的 2 次方，而`b`被一点点分解。 Whenever a bit of`b`处于活跃状态，当前贡献为`a`被添加到结果中。 

一个微妙的细节是两者的早期减少`a`和`b`模数`m`。 同时减少`a`对于保持较小的值、减少`b`对于正确性来说是可选的，但无害，有时有助于稍微减少循环迭代。 无论如何，循环结构都确保了正确性，因为它直接处理二进制表示。 

所有加法和加倍都会立即减模`m`，即使在 64 位受限环境中也能完全防止溢出。 

## 工作示例

 ### 示例 1

 让$a = 3$,$b = 5$,$m = 7$。 的二进制表示$b$是$101$。 

| 步骤| 一个 | 乙| 资源 |
 | --- | --- | --- | --- |
 | 初始化| 3 | 5 | 0 |
 | 位 1（LSB）| 3 | 5 | 3 |
 | 双a | 6 | 2 | 3 |
 | 位 0 | 6 | 2 | 3 |
 | 双a| 5 | 1 | 3 |
 | 位 1 | 5 | 1 | 1 |
 | 双a| 3 | 0 | 1 |

 最终结果是$1$, 匹配$15 \bmod 7$。 

该迹线显示了乘法器的每个二进制数字如何独立贡献以及模数缩减如何防止增长超出模数。 

### 示例 2

 让$a = 10$,$b = 6$,$m = 9$。 的二进制表示$b$是$110$。 

| 步骤| 一个 | 乙| 资源 |
 | --- | --- | --- | --- |
 | 初始化| 10 → 1 | 6 | 0 |
 | 位 0 | 1 | 6 | 0 |
 | 双a| 2 | 3 | 0 |
 | 位 1 | 2 | 3 | 2 |
 | 双a| 4 | 1 | 2 |
 | 位 1 | 4 | 1 | 6 |
 | 双a| 8 → 8 模 9 = 8 | 0 | 6 |

 最终结果是$6$, 匹配$60 \bmod 9$。 

此示例重点介绍了重复归约，并展示了即使中间值超过模数，如何通过立即归约来保持正确性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(log b) | 每次迭代处理乘法器的一位 |
 | 空间| O(1) | O(1) | Only a constant number of variables are used |

 对于 64 位整数，运行时是高效的，因为位数最多为 64。即使有许多测试用例，操作总数仍然很小并且在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def mod_mul(a, b, m):
        a %= m
        b %= m
        res = 0
        while b > 0:
            if b & 1:
                res = (res + a) % m
            a = (a + a) % m
            b >>= 1
        return res

    t = int(sys.stdin.readline())
    out = []
    for _ in range(t):
        a, b, m = map(int, sys.stdin.readline().split())
        res = mod_mul(a, b, m)
        out.append(str(res))
    return "\n".join(out)

# sample-like tests
assert run("1\n3 5 7\n") == "1", "sample 1"
assert run("1\n10 6 9\n") == "6", "sample 2"

# custom cases
assert run("1\n0 123456 7\n") == "0", "multiplication by zero"
assert run("1\n1 999999 2\n") == "1", "mod 1 behavior"
assert run("1\n2 2 3\n") == "1", "small cycle case"
assert run("1\n18446744073709551615 18446744073709551615 18446744073709551615\n") == "0", "max 64-bit edge"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 0 × large | 0 | zero absorption |
 | mod 2 身份崩溃 | 1 | reduction correctness |
 | small cyclic | 1 | 二进制分解的正确性 |
 | max 64-bit values | 0 | overflow-safe behavior |

 ## 边缘情况

 一种重要的边缘情况是当一个操作数为零时。 该算法立即返回零，因为乘法器中没有设置任何位，或者被乘数永远不会起作用。 用于输入`0 123456 7`，循环不会累积任何内容，并且结果保持为零。 

另一种情况是当模数非常小时，例如 1 或 2。对于模数 1，每次中间减少都会立即将所有值强制为零，因此输出始终为零。 对于模 2，只有奇偶校验很重要，并且该算法仍然有效，因为每次加法和加倍都保留了模 2 的正确性。 

最后的边缘情况是在大模数下最大 64 位值与其自身相乘。 为了`18446744073709551615 18446744073709551615 18446744073709551615`，该算法立即将两个操作数对模进行取模归零，因此结果为零。 尽管真正的数学乘积是巨大的，但模数约简可以防止任何溢出或不正确的计算，并且算法干净地终止，而不会形成大的中间值。
