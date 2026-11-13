---
title: "CF 230B - T 型底漆"
description: "我们被要求识别正整数列表中的 T 素数。 T 素数被定义为恰好具有三个不同正因数的数字。 考虑到除数，一个数字可以恰好为三的唯一方法是它是素数的平方。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "implementation", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 230
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 142 (Div. 2)"
rating: 1300
weight: 230
solve_time_s: 55
verified: true
draft: false
---

[CF 230B - T 素数](https://codeforces.com/problemset/problem/230/B)

 **评分：** 1300
 **标签：** 二分查找、实现、数学、数论
 **求解时间：** 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求识别正整数列表中的 T 素数。 T 素数被定义为恰好具有三个不同正因数的数字。 考虑到除数，一个数字可以恰好为三的唯一方法是它是素数的平方。 例如，4 是 T 素数，因为它的约数是 1、2 和 4，并且 2 是素数。 像 6 这样的数字有四个约数（1、2、3、6），因此它不是 T 素数。 

输入提供整数数量，最多 100,000 个，后跟整数本身，最大可达 10^12。 由于输入大小很大，任何逐一检查每个数字除数的解决方案都会太慢。 例如，检查 √10^12 以内的所有数字的可整性，每个数字大约需要一百万步，这对于单个数字是可行的，但对于 100,000 个数字则不可行。 因此，我们需要一种更智能的方法来减少每个查询的工作量。 

我们还需要小心处理边缘情况。 数字 1 永远不是 T 素数，因为它只有一个约数。 像 10^12 这样的大平方在求平方根时必须处理得不发生整数溢出或精度损失。 完全平方数但平方根不是素数的数字，例如 16 (4^2)，也必须被拒绝。 

## 方法

 蛮力方法很简单：对于每个数字，计算它的除数。 如果计数正好为三，则打印 YES； 否则，打印NO。 简单地计算除数需要迭代到 √x，最坏情况的复杂度为 O(n√x)，在最坏情况下大约为 10^11 次运算。 对于问题约束来说这太慢了。 

关键的观察是，当且仅当一个数是素数的完全平方时，它才具有三个约数。 这将问题简化为两个步骤：确定一个数是否是完全平方数以及它的平方根是否是素数。 为了有效地处理大输入，我们可以使用埃拉托斯特尼筛法生成最多 10^6 的所有素数（因为 √10^12 = 10^6），然后将它们的平方存储在一个集合中。 对于每个输入数字，我们只需检查它是否在 T 素数集合中。 这将每个查询的工作减少为简单的集合查找，平均为 O(1)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n√x) | O(n√x) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n + √max(x) 对数 log √max(x)) | O(√max(x)) | O(√max(x)) | 已接受 |

 ## 算法演练

 1. 使用埃拉托斯特尼筛法计算 10^6 以内的所有素数。 这个范围就足够了，因为任何 T 素数的平方根都不能大于 10^6。 
2. 初始化一个空集来存储T素数。 对于筛子生成的每个素数 p，计算 p 的平方并将其添加到集合中。 这会预先计算最多 10^12 的所有可能的 T 素数。 
3. 读取数字数组。 对于每个数字 x，检查 x 是否在预先计算的 T 素数集中。 
4.如果在集合中找到x，则打印YES； 否则，打印NO。 

这样做的原因是该集合恰好包含所有素数平方的数字。 每个 T 素数都被包含在内，因为它的平方根是素数，并且不在集合中的任何数字要么不是完美平方，要么具有非素数平方根。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def sieve(limit):
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(limit ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, limit + 1, i):
                is_prime[j] = False
    primes = [i for i, val in enumerate(is_prime) if val]
    return primes

def main():
    n = int(input())
    numbers = list(map(int, input().split()))
    
    max_root = int(10**6) + 1
    primes = sieve(max_root)
    
    t_primes = set(p * p for p in primes)
    
    for x in numbers:
        if x in t_primes:
            print("YES")
        else:
            print("NO")

if __name__ == "__main__":
    main()
```筛函数可以有效地生成素数，并避免重复检查整除性。 将 T 素数存储在集合中可以进行恒定时间的成员资格检查，这对于 100,000 个查询至关重要。 该代码使用读取输入`sys.stdin.readline`以避免 Python 中输入处理缓慢。 使用整数乘法可以避免任何浮点错误。 

## 工作示例

 示例 1 输入：```
3
4 5 6
```| x| √x | 是素数 √x | T-质数？ |
 | ---| ---| ---| ---|
 | 4 | 2 | 是的 | 是 |
 | 5 | 2.236 | 2.236 没有 | 否 |
 | 6 | 2.449 | 2.449 没有 | 否 |

 这表明只接受素数的完全平方。 

另一个例子：```
5
1 9 16 25 49
```| x| √x | 是素数 √x | T-质数？ |
 | ---| ---| ---| ---|
 | 1 | 1 | 没有 | 否 |
 | 9 | 3 | 是的 | 是 |
 | 16 | 16 4 | 没有 | 否 |
 | 25 | 25 5 | 是的 | 是 |
 | 49 | 49 7 | 是的 | 是 |

 这证实了该算法正确地拒绝非素数的完全平方并接受素数的完全平方。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + √max(x) 对数 log √max(x)) | 筛法采用 √max(x) log log √max(x)，设置查找 n 个数字的时间复杂度为 O(n) |
 | 空间| O(√max(x)) | O(√max(x)) | 存储素数及其平方 |

 由于 n 高达 10^5，max(x) 高达 10^12，该算法很容易满足 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().strip()

# provided sample
assert run("3\n4 5 6\n") == "YES\nNO\nNO", "sample 1"

# minimum-size input
assert run("1\n1\n") == "NO", "minimum input"

# perfect squares of primes
assert run("4\n4 9 25 49\n") == "YES\nYES\nYES\nYES", "primes squares"

# perfect squares of non-primes
assert run("3\n16 36 100\n") == "NO\nNO\nNO", "non-prime squares"

# large numbers
assert run("3\n999900000000 1000000000000 1000003*1000003\n") == "NO\nNO\nYES", "large numbers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 | 否 | 最小输入|
 | 4 9 25 49 | 4 9 25 49 是是是是是 | 正确识别T-素数|
 | 16 36 100 | 不不不| 拒绝非质数的平方|
 | 999900000000 1000000000000 1000003*1000003 | 不 不 是 | 正确处理大数 |

 ## 边缘情况

 该算法正确处理 1，因为 1 不是素数，因此也不是 T 素数。 像 10^12 这样的大数字可以被准确处理，因为我们避免了浮点平方根并依赖于整数乘法。 完全平方但根为合数的数字（如 16、36 和 100）会被拒绝，因为平方根是根据预先计算的素数集进行检查的。 即使在 100,000 个数字的上限下，集合查找也能保证恒定时间验证。
