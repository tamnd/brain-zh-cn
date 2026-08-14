---
title: "CF 102323C - 跳蛙"
description: "我们有一个圆形竞技场，有 (N) 个位置，编号从 (0) 到 (N-1)。 每个位置要么是一块岩石，写为 R，要么是一个池塘，写为 P。青蛙可以从任何一块岩石开始。 选择跳跃长度 (K) 后，每次跳跃都会将青蛙从位置 (i) 移动到 [ (i+K)bmod N。"
date: "2026-08-14T00:54:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102323
codeforces_index: "C"
codeforces_contest_name: "UCF Locals 2014"
rating: 0
weight: 102323
solve_time_s: 827
verified: true
draft: false
---

[CF 102323C - 跳青蛙](https://codeforces.com/problemset/problem/102323/C)

 **评级：** -
 **标签：** -
 **求解时间：** 13m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个圆形竞技场，有 (N) 个位置，编号从 (0) 到 (N-1)。 每个位置要么是一块石头，写成`R`，或一个池塘，写为`P`。 青蛙可以从任何岩石开始。 

选择跳跃长度 (K) 后，每次跳跃都会将青蛙从位置 (i) 移动到

 [
 (i+K)\bmod N。 
]

 青蛙一直精确地进行这一跳跃，直到返回到起始位置。 如果存在至少一个起始岩石，使得返回之前访问的每个位置也是一块岩石，则跳跃长度是有效的。 我们需要计算 (1) 到 (N-1) 范围内有多少个不同的 (K) 是有效的。 官方给出的约束有(3\le N\le10^5)，时间限制为1秒，内存限制为256 MB。 

大小 (N=10^5) 立即排除了检查跳跃长度、起始位置和访问位置的每种组合的算法。 立方上限已经约为 (10^{15}) 次运算。 我们需要利用重复添加相同 (K) 模 (N) 的算术结构。 

有几种边缘情况暴露了常见错误。 例如，如果每个位置都是一块石头`RRR`，(K=1) 和 (K=2) 都有效，所以答案是`2`。 仅检查一个特定跳跃长度的解决方案会忽略每个非零长度都有效的事实。 

例如，如果每个位置都是一个池塘`PPP`，答案是`0`。 根本没有合法的起始位置，因此假设位置 (0) 是有效起始位置的解决方案可能会在检查跳跃之前失败。 

起点可以是任何岩石，不一定是位置 (0)。 为了`PRRR`, (K=2) 从位置 (1) 开始工作：青蛙访问位置 (1) 和 (3)，都是岩石，然后返回到 (1)。 因此正确答案是`1`。 始终从位置 (0) 开始的实现会错误地拒绝 (K=2)。 

最后，跳跃长度本身与访问的不同位置的数量不同。 为了`RRPR`，(K=2)访问位置(0,2,0,\ldots)，因此它是有效的，而(K=1)和(K=3)访问每个位置并在位置(2)处遇到池塘。 正确答案是`1`。 差异来自于 (K) 和 (N) 的最大公约数。 

## 方法

 最直接的暴力解决方案是尝试每一个（K），尝试每一种可能的起始岩石，并模拟跳跃，直到青蛙回到起点或落在池塘上。 每个模拟可以检查多达 (N) 个位置，因此文字实现具有 (O(N^3)) 上限。 对于 (N=10^5)，这意味着最多 (10^{15}) 个候选位置检查，远远超出了可用时间。 

蛮力之所以有效，是因为它完全遵循青蛙的做法，但它多次重复本质上相同的循环结构。 关键的观察结果是，重复添加 (K) 模 (N) 不会产生位置的任意子集。 其结构完全由

 [
 g=\gcd(K,N)。 
]

 从位置 (s) 开始，经过 (t) 次跳跃，青蛙位于

 [
 s+tK\pmod N。 
]

 (tK\pmod N) 的每个值都是 (g) 的倍数，并且 (g) 的所有倍数都发生在序列返回到 (s) 之前。 因此，青蛙恰好访问与 (s) 模 (g) 一致的位置。 

这大大改变了问题。 我们可以询问 (N) 的除数 (g) 是否至少有一个以 (g) 为模的残差类仅包含岩石，而不是单独检查每个 (K)。 如果存在这样的类，则与(N)的最大公约数为(g)的每个跳跃长度都是有效的。 

对于固定除数 (g)，我们只需要检查哪些余数模 (g) 包含池塘。 如果池塘位置中从未出现某些残留物，则该残留物类别中的每个位置都是岩石，因此从该类别中选择任何岩石都会给出有效的起点。 

(10^5) 以内的数只有少量的约数。 我们枚举 (N) 的约数，测试每一个，最后通过 (\gcd(K,N)) 对每个 (K) 进行分类。 对于这个 (N) 范围最多有大约 128 个除数，由此产生的 (O(N\tau(N))) 式的工作很容易管理，其中 (\tau(N)) 是 (N) 的除数数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(N^3)) | (O(N)) | 太慢了 |
 | 最佳| (O(N\tau(N)+N\log N)) | (O(N)) | 已接受 |

 ## 算法演练

 1. 读取循环字符串并记录所有池塘位置的索引。 我们只需要池塘位置，因为残基类别在不包含池塘时准确有效。 
2. 生成 (N) 的每个除数 (g)。 只有除数可以出现为 (\gcd(K,N))，因此测试非除数会做不必要的工作。 
3. 对于每个真因数 (g<N)，考虑所有池塘位置模 (g)。 如果在某个位置有一个与 (r\pmod g) 一致的池塘，则标记残差 (r)。 
4. 如果至少有一个模 (g) 的余数未标记，则声明 (g) 有效。 那个残渣根本不包含池塘，所以里面的每个位置都是一块岩石，青蛙可以从那里开始。 
5. 如果池塘位置少于(g)，则立即声明(g)有效。 有 (g) 个残留物类别，但少于 (g) 个池塘，因此池塘不能占据每个残留物类别。 
6. 对于从 (1) 到 (N-1) 的每个跳跃长度 (K)，计算 (g=\gcd(K,N))。 如果 (g) 被标记为有效，则在答案中加一。 

步骤 6 足够的原因是解决方案的中心不变量：具有相同 (\gcd(K,N)) 值的所有跳转长度都访问完全相同类型的残基类。 一旦它们与 (N) 的 gcd 固定，它们的实际数值就不再重要。 

### 为什么它有效

 令(g=\gcd(K,N)) 并令起始位置为(s)。 经过(t)次跳跃后，青蛙占据(s+tK\pmod N)。 由于 (K=gK') 和 (N=gN')，其中 (K') 和 (N') 互质，因此序列 (tK'\pmod{N'}) 访问每个对 (N') 取模的残基。 乘以(g)表示青蛙原来访问过的位置正好是

 [
 s,\ s+g,\ s+2g,\l点
 ]

 绕圈。

因此，当至少一个余数类模（g）完全由岩石组成时，青蛙可以准确地完成练习。 我们的除数测试精确地检查该条件，并且最终的 gcd 计算将每个可能的 (K) 分配给正确的类。 因此，每个计数的跳跃长度都是有效的，并且每个有效的跳跃长度都被计数。 

## Python 解决方案```python
import sys
from math import gcd, isqrt

input = sys.stdin.readline

def solve_string(s: str) -> int:
    n = len(s)

    ponds = [i for i, ch in enumerate(s) if ch == 'P']

    # If there are no ponds, every non-zero jump length works.
    if not ponds:
        return n - 1

    # Generate all divisors of n.
    divisors = []
    for d in range(1, isqrt(n) + 1):
        if n % d == 0:
            divisors.append(d)
            if d * d != n:
                divisors.append(n // d)

    can_jump = [False] * (n + 1)
    pond_count = len(ponds)

    for g in divisors:
        # gcd(K, n) can never equal n for 1 <= K < n.
        if g == n:
            continue

        # With fewer ponds than residue classes, some residue is pond-free.
        if pond_count < g:
            can_jump[g] = True
            continue

        seen = bytearray(g)
        covered = 0

        for p in ponds:
            r = p % g
            if not seen[r]:
                seen[r] = 1
                covered += 1

                # Every residue contains a pond, so no all-rock class exists.
                if covered == g:
                    break

        can_jump[g] = covered < g

    answer = 0

    for k in range(1, n):
        if can_jump[gcd(k, n)]:
            answer += 1

    return answer

def main():
    s = input().strip()
    print(solve_string(s))

if __name__ == "__main__":
    main()
```这`ponds`数组准确地存储了可以使残基类无效的位置。 如果储存的池塘没有该残留物，则残留物模（g）是好的。 

除数生成最多仅达到 (\sqrt N)。 什么时候`d`划分`n`， 两个都`d`和`n // d`是约数，除非它们相等。 除数 (N) 由生成器保留，但稍后会被忽略，因为所需范围内没有 (K) 具有 (\gcd(K,N)=N)。 

这`pond_count < g`捷径在概念上和实践上都很有用。 由于池塘少于残留物类别，因此不可能每个残留物类别都包含池塘，因此至少一个类别必须仅包含岩石。 

这`bytearray`用作布尔标志的紧凑数组。`seen[r]`记录池塘是否已出现在残留类别 (r) 中。 一旦所有（g）残基都被池塘覆盖，除数就被认为是无效的并且扫描可以停止。 

最后的循环使用`math.gcd`直接地。 Python 整数在这里不存在溢出问题，因为所有值最多为 (10^5)。 

## 工作示例

 对于示例 1，竞技场是`RRR`。 没有池塘，因此每个可能的跳跃长度立即有效。 

| (K) | (\gcd(K,3)) | 有效的？ | 原因 |
 | --- | --- | --- | --- |
 | 1 | 1 | 是的 | 每一个访问过的位置都是一块石头|
 | 2 | 1 | 是的 | 每一个访问过的位置都是一块石头|

 答案是`2`。 这条轨迹展示了全摇滚捷径。 

对于示例 2，竞技场是`RRPR`。 

| (K) | (\gcd(K,4)) | 从适当的开始访问残留物 | 有效的？ |
 | --- | --- | --- | --- |
 | 1 | 1 | 所有职位| 不，位置 2 是`P`|
 | 2 | 2 | 一个余数类模 2 | 是的，位置 0 和 2 是`R`|
 | 3 | 1 | 所有职位| 不，位置 2 是`P`|

 对于 (g=2)，两个残基类别是 ({0,2}) 和 ({1,3})。 池塘位于位置（2），因此第一类无法使用，但第二类完全由岩石组成。 因此 (K=2) 有效，答案是`1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N\tau(N)+N\log N)) | 每个除数可以检查池塘位置，每个(K)需要一次gcd计算 |
 | 空间| (O(N)) | 池塘位置、除数标志和残差标记使用线性内存 |

 这里 (\tau(N)) 是 (N) 的约数个数。 对于(N\le10^5)，这个值很小，这个范围内最大为128。 由此产生的工作量对于官方 (N\le10^5)、1 秒、256 MB 的限制来说很容易实现。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    from math import gcd, isqrt

    def solve_string(s: str) -> int:
        n = len(s)
        ponds = [i for i, ch in enumerate(s) if ch == 'P']

        if not ponds:
            return n - 1

        divisors = []
        for d in range(1, isqrt(n) + 1):
            if n % d == 0:
                divisors.append(d)
                if d * d != n:
                    divisors.append(n // d)

        can_jump = [False] * (n + 1)
        pond_count = len(ponds)

        for g in divisors:
            if g == n:
                continue

            if pond_count < g:
                can_jump[g] = True
                continue

            seen = bytearray(g)
            covered = 0

            for p in ponds:
                r = p % g
                if not seen[r]:
                    seen[r] = 1
                    covered += 1
                    if covered == g:
                        break

            can_jump[g] = covered < g

        answer = 0
        for k in range(1, n):
            if can_jump[gcd(k, n)]:
                answer += 1

        return answer

    s = inp.strip()
    return str(solve_string(s)) + "\n"

# Provided samples
assert run("RRR\n") == "2\n", "sample 1"
assert run("RRPR\n") == "1\n", "sample 2"
assert run("PRP\n") == "0\n", "sample 3"

# Minimum-size case, with no rock at all.
assert run("PPP\n") == "0\n", "minimum size, all ponds"

# Starting position need not be 0.
assert run("PRRR\n") == "1\n", "valid start is position 1"

# Boundary case where gcd(K, N) = 2 is the only valid class.
assert run("RRPR\n") == "1\n", "gcd class boundary"

# Maximum-size case.
assert run("R" * 100000 + "\n") == "99999\n", "maximum size, all rocks"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`PPP`|`0`| 最小尺寸和没有任何合法的起始岩石 |
 |`PRRR`|`1`| 起始位置可能与位置 0 不同 |
 |`RRPR`|`1`| 正确处理残基类别和gcd |
 |`R`重复100000次|`99999`| 最大输入大小和全摇滚快捷方式|

 ## 边缘情况

 对于`PRRR`，正确的输出是`1`。 唯一有用的跳跃长度是（K=2）。 (N=4) 的 gcd 为 (2)，因此它访问模 2 的两个残基类别之一。从位置 (1) 开始给出循环 (1\rightarrow3\rightarrow1)，仅包含岩石。 从位置 (0) 开始将会失败，因为位置 (0) 是一个池塘。 该算法没有选择固定的起始点，因此它可以正确地检测到好的残基类别。 

为了`PPP`，正确的输出是`0`。 每个可能的残基类别都包含一个池塘，因为每个位置都是一个池塘。 对于每个真除数 (g)，所有 (g) 残基类别均由池位置标记，因此`can_jump[g]`仍然是假的。 不计算跳跃长度。 

为了`RRR`，正确的输出是`2`。 该算法在进行任何除数处理之前就达到了 all-rock 捷径并返回 (N-1=2)。 这也涵盖了跳跃可能访问每个位置的情况，因为没有池塘使这种访问非法。 

为了`RRPR`，正确的输出是`1`。 除数 (g=1) 无效，因为它唯一的残基类别包含位置 (2) 处的池塘。 除数 (g=2) 有效，因为残数 (1) 包含位置 (1) 和 (3)，都是岩石。 除数 (g=4) 被忽略，因为没有 (K<N) 可以具有 (N=4) 的 gcd (4)。 (K=1,2,3)中，只有(K=2)有gcd(2)，所以最终答案正是`1`。
