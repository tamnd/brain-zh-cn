---
title: "CF 102365H - 古老的智慧"
description: "设大卫的年龄为(d)，亚兰的年龄为(a)，并设给定整数为(C)。 对话告诉我们，大卫的年龄乘以 (C) 可以得到阿兰年龄的平方：[ C d^3 = a^2。 ] 两个年龄都是正整数。"
date: "2026-08-12T23:56:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102365
codeforces_index: "H"
codeforces_contest_name: "UBC Programming Contest 2019 (UBCPC 2019)"
rating: 0
weight: 102365
solve_time_s: 85
verified: true
draft: false
---

[CF 102365H - 古代智慧](https://codeforces.com/problemset/problem/102365/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 设大卫的年龄为(d)，亚兰的年龄为(a)，并设给定整数为(C)。 对话告诉我们，大卫的年龄乘以 (C) 可以得到阿兰年龄的平方：

 [
 C d^3 = a^2。 
]

 两个年龄都是正整数。 对于给定的 (C)，我们需要 (d) 的最小可能值。 

关键的困难在于（C）可以大到（2^{63}-1），大约为（9.2\cdot10^{18}）。 直接搜索可能的年龄是不可能的，甚至在最坏的情况下，即使普通的试除法达到 (\sqrt C) 也可能需要大约 (2^{31}) 次除法。 一秒的限制排除了任何接近十亿次迭代的情况，因此因式分解本身必须比试除法快得多。 

该方程完全由素数指数控制。 假设

 [
 C=\prod p_i^{e_i}
 ]

 和

 [
 d=\prod p_i^{f_i}。 
]

 那么 (Cd^3) 中 (p_i) 的指数为

 [
 e_i+3f_i。 
]

 为了使 (Cd^3) 成为完全平方数，每个这样的指数必须是偶数。 由于 (3) 是奇数，这意味着

 [
 e_i+f_i\equiv0\pmod2,
 ]

 因此 (f_i) 必须与 (e_i) 具有相同的奇偶校验。 因此，当 (e_i) 为奇数时，最小可能的选择为 (f_i=1)；当 (e_i) 为偶数时，最小可能的选择为 (f_i=0)。 

因此，答案正是 (C) 的那些指数为奇数的素因数的乘积。 这是 (C) 的无平方核。 

一些边缘情况很容易被错误处理。 用于输入`1`，因式分解没有奇数指数的质因数，所以答案是`1`。 从年龄开始搜索的暴力实现`2`会错误地拒绝有效的最小值。 

用于输入`8`，我们有 (8=2^3)。 (2) 的指数是奇数，所以答案是`2`。 确实，

 [
 8\cdot2^3=64=8^2。 
]

 简单地采用不同质因数的实现也会碰巧返回`2`在这里，但是这个想法在输入时失败了`12`。 由于(12=2^2\cdot3)，只有(3)的指数是奇数，所以答案是`3`。 使用所有不同的质因数会错误地产生`6`。 

第二个微妙的情况是大素数。 如果(C)本身是素数，它唯一的指数是(1)，所以答案是(C)。 基于试除法 (\sqrt C) 的实现可以花费数十亿次迭代来证明这样的数字是素数。 

## 方法

 最直接的方法是从（1）开始尝试大卫的年龄，计算（Cd^3），并检查结果是否是完全平方数。 这是正确的，因为第一个成功的 (d) 正是最小年龄。 然而，答案没有有用的小上限。 特别是，当 (C) 是一个大素数时，答案本身约为 (9\cdot10^{18})，因此搜索候选年龄是没有希望的。 

相反，我们可以推理素数指数。 对于每个素数 (p)，(Cd^3) 中的指数必须是偶数。 如果 (p) 在 (C) 中出现奇数次，我们需要 (d) 中的 (p) 的一个副本。 如果 (p) 出现偶数次，我们就不需要副本。 添加更多副本只会使 (d) 变大，而无助于将其最小化。 

因此，问题已简化为求每个素数除法 (C) 的指数的奇偶性。 通过试除法对 (C) 进行因式分解仍然太慢，因为 (C) 可以逼近 (2^{63})。 适用于任意 64 位整数的适当工具是确定性 Miller-Rabin 素性测试与 Pollard-Rho 分解相结合。 

Miller-Rabin 让我们快速识别质因数，而 Pollard-Rho 则无需扫描每个可能的除数即可找到合数的非平凡因数。 对于 64 位输入，一组固定的 Miller-Rabin 基数使素性测试具有确定性。 经过递归分解（C）后，我们计算每个素数的出现次数，并将出现奇数次的素数相乘。 

蛮力方法之所以有效，是因为可以直接测试每个可能的年龄，但它会失败，因为答案本身可能是巨大的。 指数观察将数学问题简化为因式分解，而 Pollard-Rho 将因式分解简化为 63 位整数的实际工作量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 多年来的蛮力 | (O(d)) | (O(1)) | (O(1)) | 太慢了|
 | 审判庭| (O(\sqrt C)) | (O(1)) | (O(1)) | 对于 (C\approx2^{63}) | 来说太慢
 | 米勒-拉宾 + 波拉德-罗 | 预期 sub-(\sqrt C)，适用于 63 位整数 | (O(\log C)) 递归 | 已接受 |

 ## 算法演练

 1. 阅读(C)。 如果(C=1)，立即返回`1`，因为 (1\cdot1^3=1^2)。 
2. 使用确定性 Miller-Rabin 确定一个数是否为素数。 对于低于 (2^{64}) 的值，基数 (2,325,9375,28178,450775,9780504,1795265022) 足以进行确定性测试。 
3. 使用 Pollard-Rho 求每个合数的非平凡除数。 如果当前数字是素数，则存储它。 否则，将其拆分为 Pollard-Rho 返回的除数和相应的商，然后递归地对两者进行因式分解。 
4. 计算每个素数在 (C) 的因式分解中出现了多少次。 平价才是最重要的。 例如，如果因式分解包含 (2^4)，则 (2) 的四个副本从要求中取消，因为指数已经是偶数。 如果包含(7^3)，则(7)的一份副本必须包含在大卫的年龄中。 
5. 乘以每个指数为奇数的素数。 将此产品称为 (d)。 这是可能的最小大卫年龄，因为 (C) 中每个具有奇数指数的素数必须在 (d) 中至少出现一次，而具有偶数指数的素数根本不需要出现。 
6. 打印 (d)。 

### 为什么它有效

 考虑任何素数 (p)，其指数 (e) 在 (C) 中，指数 (f) 在大卫的年龄。 它在 (Cd^3) 中的指数是 (e+3f)。 由于完全平方数只有偶数素数指数，因此我们需要 (e+3f) 为偶数。 因为 (3) 是奇数，所以这相当于 (e+f) 是偶数。 因此（f）必须与（e）具有相同的奇偶性。 

当(e)为偶数时，最小有效(f)为(0)。 当(e)为奇数时，最小有效(f)为(1)。 这些选择对于每个素数都是独立的，因此它们的乘积是全局可能的最小年龄。 因式分解阶段精确地找到这些指数，而最终的乘法则精确地构造出该最小值。 

## Python 解决方案```python
import sys
import random
import math

input = sys.stdin.readline

def is_prime(n):
    if n < 2:
        return False

    small_primes = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
    for p in small_primes:
        if n % p == 0:
            return n == p

    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2

    bases = (
        2,
        325,
        9375,
        28178,
        450775,
        9780504,
        1795265022,
    )

    for a in bases:
        if a % n == 0:
            continue

        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue

        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False

    return True

def pollard_rho(n):
    if n % 2 == 0:
        return 2
    if n % 3 == 0:
        return 3

    while True:
        y = random.randrange(1, n - 1)
        c = random.randrange(1, n - 1)
        m = 128

        g = 1
        r = 1
        q = 1

        while g == 1:
            x = y

            for _ in range(r):
                y = (y * y + c) % n

            k = 0
            while k < r and g == 1:
                ys = y
                for _ in range(min(m, r - k)):
                    y = (y * y + c) % n
                    q = q * abs(x - y) % n

                g = math.gcd(q, n)
                k += m

            r <<= 1

        if g == n:
            while True:
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
                if g > 1:
                    break

        if g != n:
            return g

def factor(n, result):
    if n == 1:
        return

    if is_prime(n):
        result.append(n)
        return

    d = pollard_rho(n)
    factor(d, result)
    factor(n // d, result)

def solve():
    c = int(input())

    if c == 1:
        print(1)
        return

    factors = []
    factor(c, factors)
    factors.sort()

    answer = 1
    i = 0

    while i < len(factors):
        j = i + 1
        while j < len(factors) and factors[j] == factors[i]:
            j += 1

        if (j - i) & 1:
            answer *= factors[i]

        i = j

    print(answer)

if __name__ == "__main__":
    solve()
```这`is_prime`函数首先删除一组微小的素数情况。 这使得常见的小因子的处理成本低廉，并且还避免了不必要的米勒-拉宾工作。 

剩下的素性测试将 (n-1) 写为 (d2^s)，其中 (d) 为奇数。 每个 Miller-Rabin 基数都会检查该数字在模幂运算下是否表现得像素数。 这里使用的七个固定基数是 (2^{64}) 以下所有整数的确定性集合，它覆盖了整个输入范围。 

这`pollard_rho`函数使用伪随机递归搜索因子

 [
 x_{i+1}=x_i^2+c\pmod n。 
]

 两个序列之间差异的最大公约数可以揭示因子(n)。 该实现使用 Brent 的批处理变体，与简单的 Pollard-Rho 循环相比，它减少了昂贵的 gcd 调用数量。 

递归`factor`函数有一个简单的停止条件。 立即添加一个素数。 一个合数被分成两个较小的数，并且两个数都被递归分解。 由于每个递归分支都会减少被分解的数量，因此递归终止。 

对因子进行排序后，相等的素数形成连续的组。 该代码对每个组进行计数，并在计数为奇数时将素数乘以答案。 排序在这里很方便，因为它避免了维护单独的字典并使奇偶校验计算变得简单。 

Python整数具有任意精度，因此在计算最终答案或中间模块化产品时不会溢出。 Pollard-Rho 内部的模乘法也是安全的，因为 Python 会自动扩展整数存储。 

## 工作示例

 提供的原始语句不包含具体的示例输入和输出值，因此以下跟踪使用两个小输入来执行不同的指数模式。 

对于 (C=12)，因式分解为 (2^2\cdot3)。 (2)的指数是偶数，而(3)的指数是奇数。 

| 舞台| 发现因素| 当前黄金| 计数 | 回答 |
 | ---| ---| ---| ---| ---|
 | 开始| 无 | 无 | 无 | 1 |
 | 因式分解 | 2, 2, 3 | 无 | 无 | 1 |
 | 第 2 组 | 2, 2, 3 | 2 | 2 | 1 |
 | 第 3 组 | 2, 2, 3 | 3 | 1 | 3 |
 | 完成 | 2, 2, 3 | 无 | 无 | 3 |

 得出的年龄是`3`。 检查原始方程得出 (12\cdot3^3=324=18^2)。 该迹线说明了为什么使用不同的质因数是不正确的，因为重复的因数 (2^2) 对答案没有任何贡献。 

对于 (C=72)，我们有

 [
 72=2^3\cdot3^2。 
]

 只有 (2) 的指数是奇数。 

| 舞台| 发现因素| 当前黄金| 计数 | 回答 |
 | ---| ---| ---| ---| ---|
 | 开始| 无 | 无 | 无 | 1 |
 | 因式分解 | 2, 2, 2, 3, 3 | 2, 2, 2, 3, 3 | 无 | 无 | 1 |
 | 第 2 组 | 2, 2, 2, 3, 3 | 2, 2, 2, 3, 3 | 2 | 3 | 2 |
 | 第 3 组 | 2, 2, 2, 3, 3 | 2, 2, 2, 3, 3 | 3 | 2 | 2 |
 | 完成 | 2, 2, 2, 3, 3 | 2, 2, 2, 3, 3 | 无 | 无 | 2 |

 答案是`2`，因为 (72\cdot2^3=576=24^2)。 该迹线证实奇数指数恰好贡献了其素数的一个副本，无论该指数是 (1)、(3)、(5) 还是更大。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 预期 sub-(\sqrt C)，适用于 63 位整数 | Miller-Rabin 执行恒定数量的模幂运算，而 Pollard-Rho 使用随机序列查找因子 |
 | 空间| (O(\log C)) | 因式分解递归具有对数深度，并且最多有 (O(\log C)) 个以重数计算的质因数 |

 与试除法的关键区别在于该算法从不扫描直到 (\sqrt C) 的所有整数。 由于 (C<2^{63})，确定性 Miller-Rabin 能够可靠地处理素数，而 Pollard-Rho 正是为分解这种大小的整数而设计的。 与 1024 MB 限制相比，内存使用量很小。 

## 测试用例

 该语句不提供实际的样本值，因此下面的测试套件使用来自工作轨迹的相同两个构造示例以及边界和大值情况。```python
# helper: run solution on input string, return output string
import sys
import io
import random
import math

def is_prime(n):
    if n < 2:
        return False

    small_primes = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
    for p in small_primes:
        if n % p == 0:
            return n == p

    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2

    bases = (
        2,
        325,
        9375,
        28178,
        450775,
        9780504,
        1795265022,
    )

    for a in bases:
        if a % n == 0:
            continue

        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue

        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False

    return True

def pollard_rho(n):
    if n % 2 == 0:
        return 2
    if n % 3 == 0:
        return 3

    while True:
        y = random.randrange(1, n - 1)
        c = random.randrange(1, n - 1)
        m = 128

        g = 1
        r = 1
        q = 1

        while g == 1:
            x = y

            for _ in range(r):
                y = (y * y + c) % n

            k = 0
            while k < r and g == 1:
                ys = y

                for _ in range(min(m, r - k)):
                    y = (y * y + c) % n
                    q = q * abs(x - y) % n

                g = math.gcd(q, n)
                k += m

            r <<= 1

        if g == n:
            while True:
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
                if g > 1:
                    break

        if g != n:
            return g

def factor(n, result):
    if n == 1:
        return

    if is_prime(n):
        result.append(n)
        return

    d = pollard_rho(n)
    factor(d, result)
    factor(n // d, result)

def solve_value(c):
    if c == 1:
        return 1

    factors = []
    factor(c, factors)
    factors.sort()

    answer = 1
    i = 0

    while i < len(factors):
        j = i + 1
        while j < len(factors) and factors[j] == factors[i]:
            j += 1

        if (j - i) & 1:
            answer *= factors[i]

        i = j

    return answer

def run(inp: str) -> str:
    return str(solve_value(int(inp.strip()))) + "\n"

# constructed samples
assert run("12") == "3\n", "sample-like case 1"
assert run("72") == "2\n", "sample-like case 2"

# minimum input
assert run("1") == "1\n", "C = 1"

# all prime exponents even
assert run("36") == "1\n", "36 = 2^2 * 3^2"

# all distinct prime exponents are odd
assert run("30") == "30\n", "30 = 2 * 3 * 5"

# boundary near 2^63
assert run("9223372036854775807") == "188232082384791343\n", "2^63 - 1"

# large power with an even exponent
assert run("4611686018427387904") == "1\n", "2^62"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1`|`1`| 最小可能输入和空奇指数因子集 |
 |`36`|`1`| 每个素数指数都是偶数 |
 |`30`|`30`| 几个不同的素数都有奇数指数 |
 |`9223372036854775807`|`188232082384791343`| 大 63 位边界值和非平凡因式分解 |
 |`4611686018427387904`|`1`| 具有偶素数指数的非常大的幂 |

 ## 边缘情况

 对于 (C=1)，输入为`1`。 根本不存在素数因数，因此奇数指数素数的乘积是空乘积，即`1`。 该算法在调用 Pollard-Rho 并打印之前处理此问题`1`。 

对于 (C=12)，因式分解为 (2^2\cdot3)。 因式分解阶段产生`2, 2, 3`。 该组包含两个副本`2`大小均匀，所以`2`被排除在外。 包含一份副本的组`3`有奇怪的大小，所以`3`包括在内。 输出是`3`。 

对于 (C=8)，因式分解为 (2^3)。 单个组的大小为奇数，因此答案变为`2`。 所得方程为 (8\cdot2^3=64=8^2)。 这抓住了一个常见的错误，即将答案视为基于 (C) 的数值大小而不是其素数指数的奇偶性。 

对于大边界输入`9223372036854775807`，即 (2^{63}-1)，因式分解为

 [
 7^2\cdot73\cdot127\cdot337\cdot92737\cdot649657。 
]

 的指数`7`是偶数，而其他所有显示的指数都是奇数。 该算法因此删除因子 (7^2) 并返回

 [
 73\cdot127\cdot337\cdot92737\cdot649657
 =188232082384791343。 
]

 这个案例说明了为什么审判分割是不合适的。 尽管最终答案是从相对少量的因式分解信息中获得的，但通过扫描最多 (\sqrt C) 的每个除数来证明因子将需要大约 (3\cdot10^9) 个候选除法，远远超出了预期的时间预算。
