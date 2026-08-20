---
title: "CF 102218J - 只是一个简单的任务"
description: "我们需要确定，对于从 0 到 n - 1 的每一天 k，有多少个有序对 (i, j) 满足 i⋅jeqik(modn)。 每个这样的对都为第 k 天贡献一个单位，因此所需的输出只是产生每个余数模 n 的对的数量。"
date: "2026-08-20T03:33:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102218
codeforces_index: "J"
codeforces_contest_name: "2019, XI Annual Programming Contest by ESCOM-IPN"
rating: 0
weight: 102218
solve_time_s: 440
verified: false
draft: false
---

[CF 102218J - 只是一个简单的任务](https://codeforces.com/problemset/problem/102218/J)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 20s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要确定，每天`k`从`0`到`n - 1`, 有多少个有序对`(i, j)`满足

 i·j·k(modn)。 

每对这样的一天恰好贡献一个单位`k`，因此所需的输出只是产生每个余数模的对的数量`n`。 

直接解释给出`n × n`乘法表模数`n`。 该观察对于理解问题很有用，但约束`n <= 2.2 × 10^6`使得构建该表变得不可能。 最多有

 (2.2×10 6 ) 2 =4.84×10 12

 配对，而原问题的时间限制仅为 2.5 秒。 我们需要一个工作接近线性的解决方案`n`。 

最微妙的情况来自以下事实：`0`也是一个留数，并且对合数求模的乘法与对质数求模的乘法的行为不同。 为了`n = 1`，只有一对`(0,0)`，所以答案是`1`。 一个粗心的实现，只循环正残基，不会产生任何结果。 

为了`n = 2`，这些对是`(0,0)`,`(0,1)`,`(1,0)`,`(1,1)`。 三产生残渣`0`并产生残留物`1`, 给予```
31
```意外假设每个非零残基具有相同数量的表示的公式在这里将失败。 

为了`n = 6`，答案开始于`15`在残留物`0`， 不是`6`。 零处的值计算所有乘积可被整除的对`6`，并且复合模量创建许多这样的对。 这正是将问题视为对素数取模的算术处理会给出错误结果的情况。 

## 方法

 暴力解法直接遵循定义。 创建一个数组`n`计数器，迭代每个`i`和每一个`j`， 计算`(i * j) % n`，并增加相应的计数器。 这是正确的，因为每个有序对都只被考虑一次，并且恰好对问题指定的留数有贡献。 

问题在于操作次数。 最大的情况下有`n² = 4.84 × 10^12`对。 即使每对非常小的常数也会远远超出时间限制。 

有用的观察是停止修复两者`i`和`j`。 使固定`i`并询问何时
 in=a(mod)
 有解决方案。 
让
 g=gcd(i,n)。 
线性同余的标准性质表明`ij ≡ k (mod n)`恰好在什么时候有解决方案`g`划分`k`。 当这个条件成立时，正好有`g`的不同值`j`模数`n`满足一致性。 

所以一个`i`贡献`gcd(i,n)`与残基配对`k`恰好当`gcd(i,n)`划分`k`。 

现在将所有分组`i`具有相同的gcd`n`。 如果

 gcd(i,n)=d,

 写`i = d x`。 然后

 gcd(x,n/d)=1。 

正好有

 φ(n/d)

 这样的价值观`i`， 在哪里`φ`是欧拉函数。 各自贡献`d`解决方案`j`，所以所有`i`gcd 等于`d`贡献

 dφ(n/d)

 到每一个残留物`k`可除以`d`。 

因此，

 c k ​ = d∣n d∣k ​ Σ ​ dφ(n/d)= d∣gcd(k,n) Σ​ dφ(n/d)。 

这个公式彻底改变了问题。 我们只需要考虑除数`n`。 对于每个除数`d`, 计算

 w d ​ =dφ(n/d)

 并添加`w_d`到每一个倍数`d`残留物之中`1,2,\ldots,n-1`。 残留物`0`可以被每个除数整除，因此它接收每个`w_d`分别地。 

总更新次数为

 d∣n Σ ​ d n ​ =n d∣n Σ ​ d 1 ​ ,

 这是`O(n log log n)`对于给定的界限，非常接近线性。 我们还避免构建一个完整的totient筛子`n`，因为只有`φ(n/d)`对于除数`n`是需要的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(n²)`|`O(n)`| 太慢了|
 | 最佳|`O(n log log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1.因素`n`进入其主要权力。 我们需要因式分解，因为它让我们可以枚举`n`并计算欧拉 totient 为`n / d`无需建立尺寸-`n`全部阵列。 
2. 生成 的所有约数`n`从它的质因数分解。 只有`τ(n)`其中，与`n`为了`n <= 2.2 × 10^6`。 
3. 对于每个除数`d`, 计算

 w=dφ(n/d)。 

这是所有人的贡献总和`i`满意的`gcd(i,n) = d`到每一个可以整除的残基`d`。 

1.添加`w`对于每个正倍数`d`以下`n`。 循环访问`d, 2d, 3d, ...`，并且这些留数中的每一个都可以被整除`d`，完全符合公式中的条件。 
2. 添加`w`到`answer[0]`以及。 零可以被每个正整数整除，但通常的倍数循环从`d`不访问零。 
3. 输出结果数组。 这些值可以大到`n²`，所以Python整数自然提供了足够的精度。 

### 为什么它有效

 对于固定的`i`, 一致性
 in=k(mod n)
 有`gcd(i,n)`解决方案`j`什么时候`gcd(i,n)`划分`k`，否则没有解决方案。 对以下值进行分组`i`经过`d = gcd(i,n)`， 有`φ(n/d)`团队中的价值观，每个人都做出贡献`d`解决方案。 因此该小组做出了贡献`d φ(n/d)`精确到可以整除的留数`d`。 该算法对每个除数精确执行这些加法`d`，包括特殊残留物`0`，因此每对都只计算一次。 

## Python 解决方案```python
Pythonimport sysinput = sys.stdin.readline

def factorize(n):    factors = []    x = n    p = 2
    while p * p <= x:        if x % p == 0:            e = 0            while x % p == 0:                x //= p                e += 1            factors.append((p, e))        p += 1 if p == 2 else 2
    if x > 1:        factors.append((x, 1))
    return factors

def get_divisors(factors):    divisors = [1]
    for p, e in factors:        old = divisors[:]        power = 1
        for _ in range(e):            power *= p            for d in old:                divisors.append(d * power)
    return divisors

def phi_from_factorization(x, factors):    result = x
    for p, _ in factors:        if x % p == 0:            result -= result // p
    return result

def compute(n):    factors = factorize(n)    divisors = get_divisors(factors)
    ans = [0] * n
    for d in divisors:        w = d * phi_from_factorization(n // d, factors)
        ans[0] += w
        for k in range(d, n, d):            ans[k] += w
    return ans

def solve():    n = int(input())    ans = compute(n)
    out = sys.stdout.buffer
    # Avoid constructing one enormous output string at once.    chunk = []    for x in ans:        chunk.append(str(x))        if len(chunk) == 100000:            out.write(("\n".join(chunk) + "\n").encode())            chunk.clear()
    if chunk:        out.write(("\n".join(chunk) + "\n").encode())

if __name__ == "__main__":    solve()
```因式分解开始于`2`然后只测试奇怪的候选人。 自从`n`至多是`2.2 × 10^6`, 试分割至`sqrt(n)`价格便宜。 

除数生成器开始于`{1}`。 对于每个素数幂`p^e`，每个现有除数都与`p`,`p²`, ...,`p^e`，精确地产生每个除数`n`一次。 

对于特定的除数`d`,`n // d`是出现在物体内部的模量。 由于素因数为`n // d`必须是主要因素之一`n`,`phi_from_factorization`可以使用计算 totient

 φ(x)=x p∣x ∏​ (1− p 1 ​ )。 

内循环开始于`d`，不为零，因为零是通过以下方式显式处理的`ans[0] += w`。 从零开始也是有效的，但它需要稍微不同的循环结构。 

答案数组包含普通的 Python 整数。 不需要溢出处理，这很重要，因为对的总数是`n²`，可以是大约`4.84 × 10^12`。 

输出以 100,000 行的块形式写入。 这使临时输出字符串保持有界，而不是构造一个同时包含每个答案的潜在大字符串。 

## 工作示例

 ### 示例 1：`n = 6`的约数为`6`是`1, 2, 3, 6`。 他们的贡献是：

 1φ(6)=2,
 2φ(3)=4,
 3φ(2)=3,
 6φ(1)=6。 

该算法将每个贡献添加到零以及其除数的所有正倍数。 

| 除数`d`|`φ(6/d)`| 贡献`dφ(6/d)`| 阳性残留物更新 |
 | --- | --- | --- | --- |
 | 1 | 2 | 2 | 1、2、3、4、5 |
 | 2 | 2 | 4 | 2, 4 |
 | 3 | 1 | 3 | 3 |
 | 6 | 1 | 6 | 无 |

 剩余零接收`2 + 4 + 3 + 6 = 15`。 

结果数组是```
1526562
```例如，残渣`4`可以整除`1`和`2`，所以它收到`2 + 4 = 6`。 它不能被整除`3`或者`6`。 

### 示例 2：`n = 5`自从`5`是质数，它的唯一约数是`1`和`5`。 

| 除数`d`|`φ(5/d)`| 贡献`dφ(5/d)`| 阳性残留物更新 |
 | --- | --- | --- | --- |
 | 1 | 4 | 4 | 1、2、3、4 |
 | 5 | 1 | 5 | 无 |

 残差零同时收到两种贡献，给出`9`。 每个非零余数只能被整除`1`，所以每个非零答案是`4`。 

输出是```
94444
```这说明了为什么素模具有特别简单的形状，而复合模需要完整的除数和。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n log log n)`| 对于每个除数`d`的`n`，我们更新大约`n/d`职位。 |
 | 空间|`O(n)`| 答案数组包含`n`整数值。 |

 除数和满足

 d∣n Σ ​ d n ​ =n n σ(n) ​ =O(nloglogn),

 因此数组更新的数量保持接近线性。 与最大输入的更新相比，因式分解和除数生成所花费的时间可以忽略不计。 这`O(n)`答案数组完全在该约束的 256 MB 内存限制之内。 

## 测试用例```python
Pythonimport sysimport io
# The functions below are the same computational functions used by the solution.
def factorize(n):    factors = []    x = n    p = 2
    while p * p <= x:        if x % p == 0:            e = 0            while x % p == 0:                x //= p                e += 1            factors.append((p, e))        p += 1 if p == 2 else 2
    if x > 1:        factors.append((x, 1))
    return factors

def get_divisors(factors):    divisors = [1]
    for p, e in factors:        old = divisors[:]        power = 1
        for _ in range(e):            power *= p            for d in old:                divisors.append(d * power)
    return divisors

def phi_from_factorization(x, factors):    result = x
    for p, _ in factors:        if x % p == 0:            result -= result // p
    return result

def compute(n):    factors = factorize(n)    divisors = get_divisors(factors)    ans = [0] * n
    for d in divisors:        w = d * phi_from_factorization(n // d, factors)
        ans[0] += w
        for k in range(d, n, d):            ans[k] += w
    return ans

def run(inp: str) -> str:    n = int(inp.strip())    ans = compute(n)    return "\n".join(map(str, ans)) + "\n"

# Provided sampleassert run("6") == "15\n2\n6\n5\n6\n2\n", "sample 1"
# Minimum sizeassert run("1") == "1\n", "n = 1"
# Small composite numberassert run("4") == "8\n4\n4\n4\n", "n = 4"
# Prime modulus, all nonzero residues have equal valuesassert run("5") == "9\n4\n4\n4\n4\n", "n = 5"
# Another composite case, useful for catching divisor/multiple errorsassert run("8") == "20\n4\n8\n4\n12\n4\n8\n4\n", "n = 8"

# Maximum-size structural test.# We do not materialize a second expected 2.2-million-line string.n = 2_200_000ans = compute(n)
assert len(ans) == n, "maximum n output length"assert sum(ans) == n * n, "every ordered pair must be counted exactly once"assert ans[0] == sum(    d * phi_from_factorization(n // d, factorize(n))    for d in get_divisors(factorize(n))), "zero residue"
```最大尺寸测试有意检查结构属性，而不是嵌入数百万条预期输出行。 身份`sum(ans) = n²`特别有用，因为每一个`n²`有序对必须恰好贡献一个残基。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1`|`1`| 零残留的最小尺寸和处理|
 |`4`|`8, 4, 4, 4`| 复合模数和重复除数贡献 |
 |`5`|`9, 4, 4, 4, 4`| 素数模和相等的非零留数 |
 |`8`|`20, 4, 8, 4, 12, 4, 8, 4`| 几个素数幂因数和多个边界 |
 |`2_200_000`| 结构检查| 最大输入大小、总对数和性能 |

 ## 边缘情况

 对于`n = 1`，唯一的一对是`(0,0)`。 除数集仅包含`1`，其贡献为

 1·φ(1)=1。 

正多重循环不执行更新，而`ans[0]`收到`1`。 输出正是`1`。 

为了`n = 2`，除数是`1`和`2`。 他们的贡献是`1·φ(2)=1`和`2·φ(1)=2`。 零接收`3`，而残渣`1`仅收到除数的贡献`1`, 给予`1`。 输出是`3,1`，正确计算出乘积为偶数的三对。 

为了`n = 5`, 除数`1`贡献`φ(5)=4`对每个留数，而除数`5`贡献`5`只到零。 因此答案是`9,4,4,4,4`。 这会导致一个简单的错误，即忘记了残数零的特殊行为。 

为了`n = 6`, 除数`3`贡献`3`至残留物`0`和`3`，而除数`2`贡献`4`到`0`,`2`， 和`4`。 残留物`4`因此收到`2 + 4 = 6`，而残渣`5`仅接收`2`。 这证实了该算法测试被除数的整除性，而不仅仅是测试余数是否与其共享素因数。 

为最大值`n = 2,200,000`，该算法从不构造`n × n`乘法表。 它只处理除数`n`及其倍数，因此工作量在以下方面保持接近线性`n`。 输出值最多仍然是有序对的总数，`n²`，Python 整数处理该范围而不会溢出。
