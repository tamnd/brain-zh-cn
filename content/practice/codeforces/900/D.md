---
problem: 900D
contest_id: 900
problem_index: D
name: "Unusual Sequences"
contest_name: "Codeforces Round 450 (Div. 2)"
rating: 2000
tags: ["bitmasks", "combinatorics", "dp", "math", "number theory"]
answer: passed_samples
verified: true
solve_time_s: 71
date: 2026-06-17
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
---

# CF 900D - 不寻常的序列

 **评级：** 2000
 **标签：** 位掩码、组合数学、dp、数学、数论
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 11s
 **已验证：** 是（1/1 样品）

 ---

 ## 解决方案

 ## 问题理解

 我们被要求计算有多少固定长度的正整数序列产生特定的最大公约数，同时还满足涉及它们的总和的附加约束。 

看待问题的一个更清晰的方法是考虑构建一个长度数组`n`，其中每个元素至少为 1。序列必须使得所有元素的 gcd 等于给定值`x`，同时所有元素的总和等于另一个给定值`y`。 如果两个序列至少在一个位置上不同，则认为它们是不同的。 

gcd 条件是主要的结构约束。 它强制每个有效元素都可以被整除`x`，并且它还强制按比例缩小的序列的 gcd 恰好为 1。这是消除对`x`并将问题简化为互质序列上的标准计数问题。 

约束很大，值高达 10^9。 这立即排除了任何迭代可能的序列甚至分解大范围的方法。 任何解决方案都必须将问题简化为对导出值的除数进行算术运算，并使用包含排除或莫比乌斯反转来避免计数过多。 

当发生微妙的边缘情况时`y`不能被整除`x`。 在这种情况下，没有序列可以精确地具有 gcd`x`同时总结到`y`，因为每个元素都必须是`x`，迫使总和也是以下的倍数`x`。 例如，如果`x = 3`和`y = 10`，无法将 10 表示为全部能被 3 整除的数字之和，因此答案一定是 0。 

当导出的缩放和变为 1 时，会出现另一种边缘情况。在这种情况下，唯一可能的序列是 1 的序列，其 gcd 为 1。这通常成为包含排除推理中的基本情况，并且不能通过过度减法来错误处理。 

## 方法

 强力解释是生成所有正整数序列，其总和为`y`并检查哪些有gcd`x`。 即使我们通过将所有值除以来进行归一化`x`，我们仍然需要生成一个数字的所有组合`k = y / x`并检查 gcd 约束。 此类组合物的数量呈指数增长`k`，大约为 2^(k-1)，即使对于 40 这样的中等值也是不可行的。 

关键的观察是 gcd 条件可以反转。 我们不是直接强制 gcd 等于 1（缩放后），而是对所有元素均可被所选除数整除的序列进行计数`d`，然后使用除数的包含-排除来纠正过度计数。 这是一个经典的莫比乌斯反演设置：对 gcd 恰好为 1 的序列进行计数可以用序列计数来表示，其中 gcd 可被某些整除`d`。 

缩放后`x`，我们将问题简化为对正整数序列进行计数，总和为`k = y / x`gcd 等于 1。令`f(k)`是正整数序列的数量，总和为`k`。 这是标准的星条结果：`f(k) = 2^(k-1)`。 

现在定义`g(k)`作为 gcd 恰好为 1 的序列数。任何 gcd 为`d`对应于总和为的正整数序列`k/d`。 因此我们有：`f(k) = sum_{d | k} g(d)`在变换除数的意义上，这导致：`g(k) = sum_{d | k} mu(d) * f(k/d)`。 

这给出了一个涉及除数的直接公式`k`，它足够小，因为`k ≤ 10^9`但约数最多为 10^3 左右。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力枚举| 指数| O(1) | O(1) | 太慢了|
 | 除数上的莫比乌斯反演 | O(sqrt(n)) | O(1) | O(1) | 已接受 |

 ## 算法演练

 ### 第 1 步：使问题正常化

 我们检查是否`y`可以整除`x`。 如果不是，答案立即为 0，因为 gcd`x`强制所有元素都是以下的倍数`x`。 

之后，我们定义`k = y / x`。 问题变成了计算正整数序列的总和`k`gcd 等于 1。 

### 步骤 2：忽略 gcd 计算所有序列

 我们计算正整数序列的总数，总和为`k`。 这是一个标准的组合恒等式：每个序列对应于在其中放置分隔符`k`无法区分的单位，给出`2^(k-1)`序列。 

我们将该值表示为`F(k)`。 

### 步骤 3：在 gcd 结构上应用包含-排除

 我们定义`G(k)`作为 gcd 恰好为 1 的序列数。每个 gcd 为`d`对应于一个序列求和为`k/d`因式分解后`d`。 这产生了除数结构。 

我们计算`G(k)`使用莫比乌斯反演：`G(k) = sum_{d | k} mu(d) * F(k/d)`。 

莫比乌斯函数基于素数分解交替包含和排除，确保仅保留 gcd 恰好为 1 的序列。 

### 步骤 4：高效计算

 我们枚举所有除数`d`的`k`最高可达 sqrt(k)。 对于每个除数对，我们使用模幂计算贡献`2^(k/d - 1)`。 

### 为什么它有效

 中心不变量是每个序列都根据其 gcd 值进行唯一分类。 通过 gcd 进行缩放将任何序列减少为 gcd 1 的原始序列，并且每个原始序列按除数缩放精确地扩展为一个序列。 具有 gcd 的序列之间的双射`d`具有较小和的 gcd 1 的序列可确保包含-排除正确地隔离原始类，而不会重叠或遗漏。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modexp(a, e):
    res = 1
    while e:
        if e & 1:
            res = (res * a) % MOD
        a = (a * a) % MOD
        e >>= 1
    return res

def solve():
    x, y = map(int, input().split())
    
    if y % x != 0:
        print(0)
        return
    
    k = y // x
    
    if k == 1:
        print(1)
        return
    
    # compute divisors of k
    divs = []
    i = 1
    while i * i <= k:
        if k % i == 0:
            divs.append(i)
            if i * i != k:
                divs.append(k // i)
        i += 1
    
    # Möbius via factorization per divisor
    def mobius(n):
        cnt = 0
        i = 2
        while i * i <= n:
            if n % i == 0:
                if (n // i) % i == 0:
                    return 0
                cnt += 1
                n //= i
            else:
                i += 1
        if n > 1:
            cnt += 1
        return -1 if cnt % 2 else 1
    
    ans = 0
    for d in divs:
        mu = mobius(d)
        if mu == 0:
            continue
        val = modexp(2, k // d - 1)
        ans = (ans + mu * val) % MOD
    
    print(ans % MOD)

if __name__ == "__main__":
    solve()
```该代码首先通过可分性检查可行性。 然后，它将问题简化为对序列进行计数，总和为`k`。 这`modexp`函数可以有效地计算模数下 2 的幂，这是必需的，因为组合的数量在`k`。 

除数枚举确保我们只考虑 gcd 分解的有效缩放因子。 莫比乌斯函数是按除数直接计算的，因为除数计数足够小，可以进行平方根因式分解。 

每学期`2^(k/d - 1)`表示分解出公约数后的序列数`d`，并且交替的莫比乌斯符号消除了非原始 gcd 结构中的过度计数。 

## 工作示例

 ### 示例 1

 输入：```
3 9
```这里`k = 9 / 3 = 3`。 

3 的约数是 1 和 3。 

| d | 亩(d) | 千/日 | 2^(k/d - 1) | 2^(k/d - 1) | 贡献 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 3 | 4 | 4 |
 | 3 | -1 | 1 | 1 | -1 |

 结果 = 4 - 1 = 3

 这匹配三个有效序列：(3,3,3)、(3,6)、(6,3)。 

### 示例 2

 输入：```
2 4
```这里`k = 2`。 

除数：1、2。 

| d | 亩(d) | 千/日 | 2^(k/d - 1) | 2^(k/d - 1) | 贡献 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 2 | 2 | 2 |
 | 2 | -1 | 1 | 1 | -1 |

 结果 = 1

 缩放后的序列只有(1,1)，对应原始的(2,2)。 

这证实了反演正确地过滤掉了 gcd 大于 1 的序列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(sqrt(k)) | 除数枚举加上每个除数因式分解 |
 | 空间| O(1) | O(1) | 只存储一些变量和除数列表 |

 该解决方案可以在限制内轻松运行，因为即使对于`k = 10^9`，除数的数量足够小，并且所有运算都是对数或平方根有界的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    MOD = 10**9 + 7

    def modexp(a, e):
        res = 1
        while e:
            if e & 1:
                res = (res * a) % MOD
            a = (a * a) % MOD
            e >>= 1
        return res

    x, y = map(int, sys.stdin.readline().split())
    if y % x != 0:
        return "0"

    k = y // x
    if k == 1:
        return "1"

    divs = []
    i = 1
    while i * i <= k:
        if k % i == 0:
            divs.append(i)
            if i * i != k:
                divs.append(k // i)
        i += 1

    def mobius(n):
        cnt = 0
        i = 2
        while i * i <= n:
            if n % i == 0:
                if (n // i) % i == 0:
                    return 0
                cnt += 1
                n //= i
            else:
                i += 1
        if n > 1:
            cnt += 1
        return -1 if cnt % 2 else 1

    ans = 0
    for d in divs:
        mu = mobius(d)
        if mu:
            ans = (ans + mu * modexp(2, k // d - 1)) % MOD

    return str(ans % MOD)

# provided sample
assert run("3 9") == "3"

# custom cases
assert run("1 1") == "1", "single element"
assert run("2 3") == "0", "non divisible case"
assert run("2 4") == "1", "minimal valid pair"
assert run("1 4") == "8", "all sequences of sum 4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 | 1 1 | 最小的非平凡情况|
 | 2 3 | 0 | 由于可分性而不可能 |
 | 2 4 | 1 | gcd 过滤正确性 |
 | 1 4 | 8 | 完整组合计数|

 ## 边缘情况

 当`y`不能被整除`x`，该算法在任何组合之前立即返回 0。 例如，输入`x = 3, y = 10`被拒绝，因为缩放需要分数序列元素，这与正性和整数约束相矛盾。 

什么时候`k = 1`，除数循环仍然有效，但公式简化为单个序列。 该实现显式返回 1 以避免微妙的问题`2^(0)`处理和不必要的莫比乌斯计算。
