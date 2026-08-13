---
title: "CF 102700C - 密码计数"
description: "关键的观察是两个不同的密钥字符串不一定代表两个不同的维吉尼亚密码。 如果键本身是较短字符串的重复，则定期扩展任一键会产生完全相同的移位序列。"
date: "2026-08-10T05:50:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102700
codeforces_index: "C"
codeforces_contest_name: "2020 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102700
solve_time_s: 501
verified: true
draft: false
---

[CF 102700C - 密码计数](https://codeforces.com/problemset/problem/102700/C)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 关键的观察是两个不同的密钥字符串不一定代表两个不同的维吉尼亚密码。 如果键本身是较短字符串的重复，则定期扩展任一键会产生完全相同的移位序列。 

例如，在二进制字母表上，键`0`,`00`,`000`，等等都生成相同的无限移位序列。 同样地，`01`和`0101`是等价的，因为两者都生成`010101...`。 攻击者只需尝试每个此类等价类的一个代表。 

每个非空字符串都可以唯一地写为最短字符串的重复。 最短的字符串称为它的原根。 当一个字符串本身不能被写成较短字符串的重复时，它就是原始字符串。 因此，这个问题相当于计算所有长度最多为的原始字符串`k`。 

对于大小的字母表`a`， 有`a^n`长度的字符串`n`。 让`P(n)`是长度的原始字符串的数量`n`。 每个字符串的长度`n`有一个唯一的原根，其长度除以`n`，所以

 [
 a^n = \sum_{d\mid n} P(d)。 
]

 莫比乌斯反演给出

 [
 P(n)=\sum_{d\mid n}\mu(d)a^{n/d},
 ]

 哪里`μ`是莫比乌斯函数。 这个标准的原词公式直接来自于唯一的原根分解。 

所需答案是

 [
 \sum_{n=1}^{k}P(n)。 
]

 字母大小最多为`10^3`，而最大密钥长度为`5 * 10^6`。 重要的限制是后者。 任何涉及所有可能键的算法都是指数的`k`，甚至还有一个`O(k log k)`除数枚举不必要地昂贵。 线性时间筛选和线性扫描是合适的目标。 

有几种边缘情况很容易破坏粗心的实现。 为了`a = 1`和`k = 3`，每个长度唯一可能的密钥是一串相同的符号，因此每个密钥代表相同的密码，答案是`1`。 为了`a = 2`和`k = 2`，四个可能的键是`0`,`1`,`00`， 和`11`长度最多为两个，但是`00`有原根`0`和`11`有原根`1`，所以答案是`4`， 不是`4`加上一些额外的重复键类。 为了`a = 2`和`k = 3`，原始计数是`P(1)=2`,`P(2)=2`， 和`P(3)=6`，给出答案`10`。 一个简单求和的解决方案`2^n`会错误地数次重复的键。 

官方声明给出了相同的约束和示例行为，包括以下事实：`00`和`11`不必分别尝试两者。 

## 方法

 直接方法将生成每个长度的每个可能的密钥`1`通过`k`。 有

 [
 a+a^2+\cdots+a^k
 ]

 这样的钥匙。 对于每个键，我们可以找到它的最短周期，并且只有当它是原始的时才对其进行计数。 这是正确的，因为每个密码等价类中只有一个代表是原始的。 

问题在于候选人的数量。 什么时候`a >= 2`，总计为`Θ(a^k)`，已经是指数级的了。 最大值时`a=1000`和`k=5*10^6`，长度的数量-`k`候选人本身就是`1000^{5,000,000}=10^{15,000,000}`。 如果我们还明确检查最多`k`测试周期性的位置，工作变成`Θ(k a^k)`。 枚举本身已经是不可能的，因此优化周期测试无法挽救这种方法。 

有用的观察是我们永远不需要构造密钥。 我们只需要每个长度的原始字符串的数量。 原根分解给出了干净的除数恒等式，

 [
 a^n=\sum_{d\mid n}P(d)。 
]

 莫比乌斯反演将其转换为以下公式：`P(n)`。 为每个独立计算该公式`n`仍然需要枚举除数。 第二个观察结果消除了该成本。 

开始于

 \sum_{n=1}^{k}\sum_{d\mid n}\mu(d)a^{n/d}。 
]

写`n = d x`。 然后`d x <= k`，所以

 [
 \sum_{x=1}^{k}a^x
 \sum_{d=1}^{\lfloor k/x\rfloor}\mu(d)。 
]

 定义前缀莫比乌斯和

 [
 M(t)=\sum_{d=1}^{t}\mu(d)。 
]

 整个答案变成

 [
 \盒装{
 \sum_{x=1}^{k}a^x M\left(\left\lfloor\frac{k}{x}\right\rfloor\right)
 }。 
]

 现在，一旦莫比乌斯前缀和已知，每一项都可以在恒定时间内获得。 我们可以使用线性欧拉筛生成所有莫比乌斯值，构建它们的前缀和，然后在一次线性传递中评估该公式。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`Θ(k a^k)`如果直接检查周期性|`O(k)`每个候选人 | 太慢了|
 | 最佳 |`O(k)`|`O(k)`| 已接受 |

 ## 算法演练

 1. 读取字母大小`a`和最大密钥长度`k`。 如果`a=1`，立即返回`1`，因为每个可能的密钥都由相同的符号组成并具有相同的原根。 
2. 计算莫比乌斯函数`μ(1), μ(2), ..., μ(k)`用线性欧拉筛。 筛子保留每个数字的最小质因数并构造`μ`同时。 素数获得莫比乌斯值`-1`。 如果一个数接收到的质因数已存在于其因式分解中，则其莫比乌斯值变为`0`。 否则标志就会翻转。 
3. 将莫比乌斯数组转换为其前缀和。 经过此转换后，存储在位置的值`t`是

 [
 M(t)=\mu(1)+\mu(2)+\cdots+\mu(t)。 
]

 不再需要原始莫比乌斯值，因此用于筛子的相同存储可以重新用于这些前缀和。 

1. 维护`power = a^x mod MOD`迭代时`x`从`1`到`k`。 对于当前的`x`, 添加

 [
 a^x M\left(\left\lfloor\frac{k}{x}\right\rfloor\right)
 ]

 到答案。 前缀和的索引为`k // x`因为这正是可能因数的范围`d`替换后`n = d x`。 

1. 更新`power`乘以`a`模数`10^9+7`。 最终迭代后，打印累加答案模`10^9+7`。 

### 为什么它有效

 每个非空键都有一个唯一的原根。 当两个密钥具有相同的原根时，它们会产生相同的移位周期序列，因此攻击者必须尝试的密钥数量最多恰好是长度为原字符串的数量`k`。 

对于长度`n`，每个字符串都是一个唯一原始字符串的重复，其长度除以`n`。 因此`a^n = Σ_{d|n} P(d)`，莫比乌斯反演给出`P(n) = Σ_{d|n} μ(d)a^{n/d}`。 

总结一切`n <= k`并交换求和顺序给出

 \sum_{x=1}^{k}a^xM(\lfloor k/x\rfloor)。 
]

 该算法精确地计算该表达式，因此每个原根类贡献一次且仅一次。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    a, k = map(int, input().split())

    # With a one-letter alphabet, every key is a repetition
    # of the same one-character primitive root.
    if a == 1:
        print(1)
        return

    # lp[x] = smallest prime factor of x.
    # Using a compact integer array keeps memory usage small.
    lp = array('I', [0]) * (k + 1)

    # mu[x] is stored as -1, 0, or 1.
    mu = array('b', [0]) * (k + 1)
    mu[1] = 1

    primes = array('I')

    # Linear Euler sieve for the Möbius function.
    for i in range(2, k + 1):
        if lp[i] == 0:
            lp[i] = i
            primes.append(i)
            mu[i] = -1

        li = lp[i]

        for p in primes:
            x = i * p
            if x > k:
                break

            lp[x] = p

            if p == li:
                mu[x] = 0
                break
            else:
                mu[x] = -mu[i]

    # lp is no longer needed as a smallest-prime-factor array.
    # Reuse it to store Mertens prefix sums:
    # lp[i] = mu(1) + ... + mu(i).
    prefix = 0
    for i in range(1, k + 1):
        prefix += mu[i]
        lp[i] = prefix

    del mu
    del primes

    ans = 0
    power = a % MOD

    # ans = sum_{x=1}^k a^x * M(floor(k/x)).
    for x in range(1, k + 1):
        ans = (ans + power * lp[k // x]) % MOD
        power = (power * a) % MOD

    print(ans)

if __name__ == "__main__":
    solve()
```欧拉筛是步骤2的实现。`lp`记录最小的质因数，而`mu`仅存储三个可能的值，因此有符号字节数组对于莫比乌斯函数来说就足够了。 

条件`p == li`是筛子的关键部件。 如果`p`已经是最小的素因数了`i`， 然后`i*p`包含一个质因数的平方，因此它的莫比乌斯值为零。 否则，乘以一个新素数会改变莫比乌斯值的符号。 

过筛后，`lp`不再需要因式分解。 将其重新用于 Mertens 前缀和可以避免分配另一个大型数组。 这很重要，因为`k`可以达到五百万。 

最后的循环不计算`P(x)`单独。 相反，它直接评估转换后的总和

 [
 a^xM(\lfloor k/x\rfloor)。 
]`power`总是包含`a^x mod MOD`在迭代开始时`x`。 添加当前术语后更新它可以避免差一错误。 Python 整数不会溢出，但每次乘法后进行减少可以保持中间值较小且实现高效。 

特殊情况`a=1`也不仅仅是微观优化。 它使最大长度测试立即进行，因为每个长度只有一个可能的密钥，并且所有密钥都具有相同的原根。 

## 工作示例

 ### 示例 1：`a = 26, k = 1`只允许长度为 1 的密钥。 每个单字符键都是原始的，所以答案一定是`26`。 

为了`k=1`, the Möbius values and prefix sums are:

 |`x`|`μ(x)`|`M(x)`|`a^x`|`k // x`| 添加术语 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 26 | 26 1 | 26 | 26

 最终的答案是`26`。 

这证实了变换并没有丢失最简单的情况。 该公式简化为`a^1 * M(1) = a`。 

### 示例 2：`a = 2, k = 2`有四个原始密钥：`0`,`1`,`00`， 和`11`。 前两个是原始的。 The last two are repetitions of the first two, so there are still four keys to try according to the problem's representative-key interpretation, because the primitive strings of lengths at most two are`0`,`1`,`01`， 和`10`。 

相关的莫比乌斯值是

 [
 \mu(1)=1,\qquad \mu(2)=-1,
 ]

 所以前缀和是

 [
 M(1)=1,\qquad M(2)=0。 
]

 变换后的总和为：

 |`x`|`μ(x)`|`M(x)`|`a^x`|`k // x`|`M(k // x)`| 添加术语 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 2 | 2 | 0 | 0 |
 | 2 | -1 | 0 | 4 | 1 | 1 | 4 |

 答案是`4`。 

零贡献`x=1`反映了由长度两倍的重复引起的取消。 剩下的四个代表正是长度为一和二的四个原始字符串。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(k)`| 欧拉筛执行线性工作，然后进行两次线性扫描。 |
 | 空间|`O(k)`| 最小素因子数组、莫比乌斯值和素数列表都具有线性大小。 |

 和`k <= 5 * 10^6`，线性复杂度是合适的。 该实现使用紧凑型`array`存储而不是 Python 更大的通用整数列表来存储筛数据，从而使内存使用量轻松低于`512 MB`限制。 

## 测试用例```python
import io
import sys
from array import array

MOD = 1_000_000_007

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    a, k = map(int, sys.stdin.readline().split())

    if a == 1:
        print(1)
    else:
        lp = array('I', [0]) * (k + 1)
        mu = array('b', [0]) * (k + 1)
        mu[1] = 1
        primes = array('I')

        for i in range(2, k + 1):
            if lp[i] == 0:
                lp[i] = i
                primes.append(i)
                mu[i] = -1

            li = lp[i]

            for p in primes:
                x = i * p
                if x > k:
                    break

                lp[x] = p

                if p == li:
                    mu[x] = 0
                    break
                mu[x] = -mu[i]

        s = 0
        for i in range(1, k + 1):
            s += mu[i]
            lp[i] = s

        ans = 0
        power = a % MOD

        for x in range(1, k + 1):
            ans = (ans + power * lp[k // x]) % MOD
            power = power * a % MOD

        print(ans)

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

assert run("26 1\n") == "26\n", "sample 1"
assert run("2 2\n") == "4\n", "sample 2"
assert run("1 3\n") == "1\n", "sample 3"

assert run("1 1\n") == "1\n", "minimum alphabet and key length"
assert run("2 3\n") == "10\n", "primitive lengths 1, 2, and 3"
assert run("1000 1\n") == "1000\n", "maximum alphabet at key length 1"
assert run("1 5000000\n") == "1\n", "maximum key length with one-letter alphabet"
assert run("2 4\n") == "22\n", "length-four divisor boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`1`| 最小值和单符号字母大小写 |
 |`2 3`|`10`| 几个原始长度和一个素键长度 |
 |`1000 1`|`1000`| 最大字母大小和`k=1`边界|
 |`1 5000000`|`1`| 最大限度`k`和特别的`a=1`案例 |
 |`2 4`|`22`| 具有非平凡除数的复合长度 |

 ## 边缘情况

 对于`a=1`和`k=3`，唯一可能的键是单符号字符串、其二符号重复和三符号重复。 每个人都有相同的原根。 执行返回`1`立即进行，避免不必要的筛分工作。 

为了`a=2`和`k=2`，原始字符串是`0`,`1`,`01`， 和`10`。 琴弦`00`和`11`不是新的原根，因为它们是重复的`0`和`1`。 莫比乌斯计算给出`P(1)=2`和`P(2)=4-2=2`，所以总计为`4`。 

为了`a=2`和`k=3`，长度一贡献是`2`。 长度为二时，两个非原始字符串是`00`和`11`，离开`2`原始字符串。 长度为 3 时，唯一的真因数是 1，所以`P(3)=2^3-2=6`。 答案是`2+2+6=10`。 这种情况捕获了意外排除素数长度的原始字符串的实现。 

为了`a=2`和`k=4`，长度为四的字符串包括长度为一和长度为二的根的重复。 公式给出

 [
 P(4)=2^4-2^2=12,
 ]

 因为`μ(4)=0`和`μ(2)=-1`。 总计为

 #2+2+6+12

 1.

 ]

 这会捕获涉及平方因子的除数边界错误，其中莫比乌斯值必须为零。 

最后，为了`a=1`和`k=5,000,000`，答案依然是`1`。 这既是数学边缘情况，也是实际压力情况。 不必要地构建或筛选所有长度的解决方案可能会浪费大量时间，而特殊情况会立即完成。
