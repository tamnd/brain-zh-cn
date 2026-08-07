---
title: "CF 104158F - 厕所命令"
description: "我们得到了一对大整数，表示两种类型的零件（碗和盖子）的数量。 从每一对中，托马斯可以组装的完整厕所的数量由这两个数量的最大公约数决定。"
date: "2026-07-02T01:11:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104158
codeforces_index: "F"
codeforces_contest_name: "UTPC Contest 01-27-23 Div. 1 (Advanced)"
rating: 0
weight: 104158
solve_time_s: 81
verified: false
draft: false
---

[CF 104158F - 厕所命令](https://codeforces.com/problemset/problem/104158/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一对大整数，表示两种类型的零件（碗和盖子）的数量。 从每一对中，托马斯可以组装的完整厕所的数量由这两个数量的最大公约数决定。 该 gcd 代表使用完美平衡的物品选择可以形成多少个完整的碗盖对。 

对于每个测试用例，任务不是计算 gcd 本身，而是描述其主要结构。 一旦我们找到了 gcd，我们必须将其表示为素数的乘积，并报告每个不同的素数以及它在因式分解中出现的次数。 输出格式为每行一个素数，按升序排列，后跟包含零的终止行。 

这些限制促使我们谨慎地进行算术处理。 每个数字可以大到 10^12，这立即排除了重复除以 n 的简单因式分解。 即使测试 n 本身的整除性也是不可能的。 我们需要更接近平方根因式分解或更好的东西，并且我们还必须依赖 gcd 至多 10^12 的事实。 

一个微妙的边缘情况是当 gcd 为 1 时。在这种情况下，根本不存在素因数，因此我们只输出包含零的一行。 另一种情况是，当 gcd 本身是素数（例如 5）时，输出仅包含重数为 1 和后跟零的素数。 缺少最后的零或错误地打印 gcd = 1 的内容是常见的格式错误。 

## 方法

 解决该问题的直接方法是计算每对的 gcd，然后使用试除法将其分解。 一旦我们有了 g，我们就可以测试从 2 到 g 的所有整数并检查整除性。 这是正确的，但太慢了。 在 g 约为 10^12 的最坏情况下，每个测试用例需要多达一万亿次操作，这是不可行的。 

更结构化的强力通过仅检查 sqrt(g) 以内的除数来改善这一点。 对于每个候选 i，如果它整除 g，我们重复 g 除以 i 并计算重数。 这大大降低了复杂性，因为 sqrt(10^12) 是 10^6，这是边界，但如果仔细实现，对于优化的 Python 中最多 100 个测试用例来说是可以接受的。 

关键的见解是我们永远不需要单独分解 b 和 l。 gcd 已经将问题分解为单个数字，其结构比任一输入都简单。 一旦我们分离出 g，通过试除法到 sqrt(g) 的标准素因数分解就足够了。 不需要像 Pollard Rho 这样的高级方法，因为约束足够小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解高达 g | O(g) | O(1) | O(1) | 太慢了 |
 | 试除法高达 √g | 每次测试 O(√g) | O(1) | O(1) | 已接受 |

 ## 算法演练

 ### 步骤

 1. 读取每个测试用例的整数 b 和 l。 目标是仅使用他们的 gcd，因为所有所需的信息完全取决于共享因素。 
2. 计算 g = gcd(b, l)。 这将问题压缩为分解一个数字，该数字表示平衡对的最大可能数量。 
3. 如果g等于1，则立即输出0。 没有要报告的主要因素，因此不需要进一步计算。 
4. 初始化一个空的素因数列表，并从 2 开始检查除数。 
5. 对于从 2 到 sqrt(g) 的每个整数 i，检查 i 是否整除 g。 如果是这样，请重复将 g 除以 i，同时计算这种情况发生的次数。 这个计数就是质因数 i 的重数。 
6. 如果处理完所有 i 直到 sqrt(g)，g 的剩余值大于 1，则 g 本身是素数，必须以重数 1 记录。 
7. 按升序打印所有收集到的素数，每个素数后跟其重数，并以包含 0 的行结束。 

### 为什么它有效

每个大于 1 的整数都有唯一的素因数分解。 试除过程系统地按升序删除每个素因子的所有出现。 因为我们只测试 sqrt(g) 以内的值，所以任何剩余值必须是 1 或大于 sqrt(g) 的质数，因为合数已经被分解为更小的分量。 这保证了所有素数都被恰好捕获一次并且具有正确的重数。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def factorize(x):
    res = []
    i = 2
    while i * i <= x:
        if x % i == 0:
            cnt = 0
            while x % i == 0:
                x //= i
                cnt += 1
            res.append((i, cnt))
        i += 1
    if x > 1:
        res.append((x, 1))
    return res

def solve():
    t = int(input())
    for _ in range(t):
        b, l = map(int, input().split())
        g = math.gcd(b, l)

        if g == 1:
            print(0)
            continue

        factors = factorize(g)
        for p, c in factors:
            print(p, c)
        print(0)

if __name__ == "__main__":
    solve()
```该解决方案干净地分离了关注点：首先使用 gcd 压缩问题，然后使用标准试除法对减少的数字进行因式分解。 因式分解函数在继续之前仔细地完全划分每个素数，这确保了正确的重数。 循环条件 i * i <= x 随着 x 的减小而动态缩小，从而提高了实践中的性能。 

一个常见的错误是忘记根据更新的 x 重新计算绑定的循环； 此实现通过直接使用条件中 x 的当前值来避免这种情况。 另一个微妙之处是确保剩余的 x > 1 被视为素因数，因为它可能尚未被循环完全约简。 

## 工作示例

 ### 示例 1

 输入对：b = 360，l = 240

 最大CD = 120

 | 步骤| x 值 | 除数 i | 行动| 因素|
 | --- | --- | --- | --- | --- |
 | 1 | 120 | 120 2 | 除以两次 → 30 | (2,2) |
 | 2 | 30| 3 | 除一次 → 10 | (3,1) |
 | 3 | 10 | 10 5 | 除一次 → 2 | (5,1) |
 | 4 | 2 | 结束 | 剩余素数| 添加 (2,1) |

 最终分解：2^3 * 3^1 * 5^1

 输出：```
2 3
3 1
5 1
0
```这证实了重复除法正确地累积了多重性并保留了顺序。 

### 示例 2

 输入对：b = 83，l = 24

 最大公约数=1

 | 步骤| x 值 | 行动|
 | --- | --- | --- |
 | 1 | 1 | 立即终止|

 输出：```
0
```这表明 gcd 快捷方式正确地避免了不必要的因式分解工作并处理空因式分解情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(T √g) | 每个 gcd 均以对数时间计算，每个因式分解均使用试除法直至 sqrt(g) |
 | 空间| O(1) | O(1) | 每个测试用例只有一小部分因素|

 g 的值最多为 10^12，因此 sqrt(g) 最多为 10^6。 当 T 达到 100 时，这完全符合优化 Python 中的典型限制，特别是因为除法在因式分解过程中会快速减少 x。 

## 测试用例```python
import sys, io, math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math

    def factorize(x):
        res = []
        i = 2
        while i * i <= x:
            if x % i == 0:
                cnt = 0
                while x % i == 0:
                    x //= i
                    cnt += 1
                res.append((i, cnt))
            i += 1
        if x > 1:
            res.append((x, 1))
        return res

    def solve():
        t = int(sys.stdin.readline())
        for _ in range(t):
            b, l = map(int, sys.stdin.readline().split())
            g = math.gcd(b, l)

            if g == 1:
                print(0)
                continue

            for p, c in factorize(g):
                print(p, c)
            print(0)

    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    solve()
    out = sys.stdout.getvalue()
    sys.stdout = old_stdout
    return out.strip()

# provided samples
assert run("1\n360 240\n") == "2 3\n3 1\n5 1\n0"
assert run("3\n83 24\n15 25\n7 13\n") == "0\n5 1\n0\n0"

# custom cases
assert run("1\n2 2\n") == "2 1\n0"                 # minimum non-trivial gcd
assert run("1\n1000000000000 500000000000\n") == "2 45\n5 12\n0"  # large power structure
assert run("1\n17 34\n") == "17 1\n0"              # prime gcd
assert run("1\n6 10\n") == "2 1\n0"                # mixed small primes
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 2 | 2 2 1 0 | 2 1 0 最小相等情况|
 | 1e12 5e11 | 1e12 5e11 2 45 5 12 0 | 2 45 5 12 0 large exponent handling |
 | 17 34 | 17 1 0 | 17 gcd 是素数 |
 | 6 10 | 2 1 0 | 2 1 0 shared factor extraction |

 ## 边缘情况

 一种边缘情况是，即使两个输入都很大，gcd 也会崩溃为 1。 例如，b = 83 和 l = 24 立即产生 1。该算法通过在分解之前检查 g == 1 来处理此问题，确保不会产生不正确的输出行。 

另一个边缘情况是 gcd 本身为素数。 例如，b = 17 且 l = 34 得出 g = 17。循环未找到任何除数，最终剩余值触发“x > 1”条件，正确发出重数为 1 的 17。 

第三种情况是 gcd 是完美幂，例如 2^k。 在这种情况下，同一循环迭代内的重复除法可确保完全重数累积，因为 x 在移动到下一个候选除数之前不断减小。
