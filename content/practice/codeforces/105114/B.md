---
title: "CF 105114B - 批量 GCD"
description: "给定一个整数列表，需要确定是否存在至少一对最大公约数大于 1 的不同元素。"
date: "2026-06-27T19:48:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105114
codeforces_index: "B"
codeforces_contest_name: "NUS CS3233 Final Team Contest 2024"
rating: 0
weight: 105114
solve_time_s: 71
verified: true
draft: false
---

[CF 105114B - 批量 GCD](https://codeforces.com/problemset/problem/105114/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个整数列表，需要确定是否存在至少一对最大公约数大于 1 的不同元素。 更具体地说，该任务是询问是否有任何质数可以整除列表中的至少两个不同的数字。 

输入规模很大，最多有百万个整数，每个整数有百亿个。 这立即排除了任何直接比较对的方法。 简单的成对 gcd 检查大约需要 n²/2 次比较，在最坏的情况下会变成大约 10^2 次操作，远远超出了在时间限制内可以执行的操作。 

价值观的大小也很重要。 每个数字最大为 10^10，因此任何分解策略都只能达到该界限的平方根，即 10^5。 这意味着预先计算最多 100000 个素数足以对每个输入值进行完全因式分解。 

当许多数字等于 1 或成对互质时，就会出现微妙的失败情况。 例如，输入类似`1 1 1 1`应该产生`NO`，因为 1 没有质因数，因此无法促成大于 1 的 gcd。错误地将重复值视为自动有效的简单方法将错误地返回`YES`如果它只检查相等而不是共享素因数。 

另一个边缘情况是重复的合数。 例如，`6 10 15`不存在任何对同时共享所有对共同的素因数，但是`6`和`10`分享2，所以正确答案已经`YES`。 任何正确的解决方案都必须检测任何对之间的共享素数，而不仅仅是全分解的全局交集。 

## 方法

 暴力方法检查每对数字并计算它们的 gcd。 这是可行的，因为 gcd 计算非常高效，值大小大致为对数。 然而，对于多达一百万个数字，对的数量约为 5 × 10^1，这使得这完全不可行。 即使每个 gcd 操作都非常快，对枚举的规模也决定了一切。 

关键的观察结果是，当它们共享至少一个素因子时，它们的 gcd 大于 1。 这将问题从数字之间的成对交互转变为跟踪全局质因数的出现。 我们不是直接比较数字，而是分解每个数字并记录我们已经看到的素数。 如果素数再次以不同的数字出现，我们立即知道存在一个有效的对。 

这将问题转化为增量分解加上哈希集中的成员资格检查。 使用试除法将每个数字分解为素数直到其平方根。 在分解过程中，每个不同的质因数都会根据全局集进行检查。 第一次重复就会触发答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n² log A) | O(n² log A) | O(1) | O(1) | 太慢了 |
 | 因式分解的素数跟踪 | 最坏情况 | O(n √A) O(#primes) | O(#primes) | 已接受 |

 ## 算法演练

 1. 使用筛子预先计算 100000 以内的所有素数。 这已经足够了，因为任何 10^10 以下的合数都必须有一个不大于其平方根的质因数。 
2. 维护一个空集，用于存储已经出现在已处理数字中的素因数。 该集合代表所有已被早期元素“声明”的素数。 
3. 对于输入中的每个数字，使用预先计算的素数将其分解。 在因式分解过程中，最多提取每个不同的质因数一次。 
4. 对于当前数字的每个不同素因数，检查它是否已经存在于全局集合中。 如果有则立即输出`YES`因为这个素数至少在两个数之间共享。 
5. 如果集合中尚不存在质因数，则将其插入并继续处理数字的其余部分。 
6. 如果处理完所有数字都没有检测到重复素因数，则输出`NO`。 

重要的想法是，我们只关心素数是否出现在至少两个不同的数字中。 单个数字内的重数并不重要，因此我们确保每个数字对每个素数考虑一次。 

### 为什么它有效

 每个大于一的整数都可以唯一地分解为质因数。 如果两个数的 gcd 大于 1，则它们必须至少共享一个素因数。 相反，如果质因数出现在两个不同的数字中，则这些数字自动具有至少该质数的 gcd。 因此，跟踪数字中素数的首次出现对于检测任何有效对来说既是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    arr = list(map(int, input().split()))

    if n <= 1:
        print("NO")
        return

    max_p = 100000

    is_prime = [True] * (max_p + 1)
    is_prime[0] = is_prime[1] = False
    primes = []

    for i in range(2, max_p + 1):
        if is_prime[i]:
            primes.append(i)
            step = i * i
            for j in range(step, max_p + 1, i):
                is_prime[j] = False

    seen = set()

    for x in arr:
        original = x
        for p in primes:
            if p * p > x:
                break
            if x % p == 0:
                if p in seen:
                    print("YES")
                    return
                seen.add(p)
                while x % p == 0:
                    x //= p
        if x > 1:
            if x in seen:
                print("YES")
                return
            seen.add(x)

    print("NO")

if __name__ == "__main__":
    solve()
```筛子构建最多 100000 个素数列表，这足以安全地分解所有输入值。 在处理过程中，每个数字通过除掉其素数因子来减少，确保每个素数只被考虑一次。 这`seen`集合存储已经与先前数字关联的素数，因此重复表示共享因子。 

这里的一个常见错误是忘记删除同一数字内重复的质因数。 没有内在的`while x % p == 0`循环中，像 12 这样的数字会错误地注册素数 2 两次，这可能会错误地触发匹配。 

## 工作示例

 ### 示例 1

 输入：```
1
2
```| 步骤| 当前数量 | 发现质因数 | 看过集 | 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 2 | {2} | {} | 插入 2 |

 没有重复发生，所以输出是`NO`。 

这证实了单个元素无法形成有效的对，无论其值如何。 

### 示例 2

 输入：```
2
1 1
```| 步骤| 当前数量 | 发现质因数 | 看过集 | 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 1 | {} | {} | 什么都没有|
 | 2 | 1 | {} | {} | 什么都没有|

 No primes exist in either number, so no shared factor can ever appear.

 结果是`NO`，表明 1 的重复项不会创建有效的 gcd 条件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n√A) | O(n√A) | 每个数字都通过试除法使用质数到其平方根 | 进行因式分解。 
| 空间| O(√A + k) | O(√A + k) | 素数筛存储加上一组可见的素数 |

 约束允许这样做，因为 √A 至多为 10⁵，并且筛子是可控的。 该算法避免了数字之间的任何二次交互作用，这对于 n 高达一百万至关重要。 

## 测试用例```python
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    n = int(input())
    arr = list(map(int, input().split()))

    max_p = 100000

    is_prime = [True] * (max_p + 1)
    is_prime[0] = is_prime[1] = False
    primes = []

    for i in range(2, max_p + 1):
        if is_prime[i]:
            primes.append(i)
            for j in range(i * i, max_p + 1, i):
                is_prime[j] = False

    seen = set()

    for x in arr:
        for p in primes:
            if p * p > x:
                break
            if x % p == 0:
                if p in seen:
                    print("YES")
                    return
                seen.add(p)
                while x % p == 0:
                    x //= p
        if x > 1:
            if x in seen:
                print("YES")
                return
            seen.add(x)

    print("NO")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out.strip()

# provided samples
assert run("1\n2\n") == "NO", "sample 1"
assert run("2\n1 1\n") == "NO", "sample 2"
assert run("2\n2 2\n") == "YES", "sample 3"

# custom cases
assert run("3\n2 3 5\n") == "NO", "all primes distinct"
assert run("3\n6 10 15\n") == "YES", "shared prime exists"
assert run("4\n1 1 1 1\n") == "NO", "all ones"
assert run("3\n4 9 25\n") == "NO", "perfect squares distinct primes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 个不同的素数 | 否 | 没有共同因素 |
 | 6 10 15 | 6 10 15 是 | 跨数共享素数检测 |
 | 所有的| 否 | 处理没有素数的数字 |
 | 4 9 25 | 否 | 重复结构无重叠 |

 ## 边缘情况

 一种边缘情况是所有数字均为 1。该算法处理每个数字，但不会将任何内容插入到素数集中，因此不会出现误报，并且输出仍然存在`NO`。 

另一个边缘情况是重复的合数，例如`8 8`。 前 8 个将质数 2 插入到集合中。 第二个 8 再次产生素数 2，在集合中找到，立即触发`YES`。 这表明正确处理跨位置的重复项，而不是单个数字内的重复项。 

最后的边缘情况是当数字成对互质但很大时，例如`2, 3, 5, 7, 11`。 每个质数都会插入一次，并且不会重新访问，因此算法可以正确完成而不会触发匹配。
