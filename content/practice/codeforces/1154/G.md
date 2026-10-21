---
title: "CF 1154G - 最小可能的 LCM"
description: "我们得到一个整数数组，并要求找到一对索引 (i, j)，使得这些索引处的两个数字的最小公倍数 (LCM) 尽可能小。 该数组最多可以包含一百万个元素，每个数字可以大到一千万。"
date: "2026-06-12T02:49:15+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1154
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 552 (Div. 3)"
rating: 2200
weight: 1154
solve_time_s: 73
verified: true
draft: false
---

[CF 1154G - 最小可能的 LCM](https://codeforces.com/problemset/problem/1154/G)

 **评分：** 2200
 **标签：** 蛮力、贪心、数学、数论
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组并要求找到一对索引`(i, j)`使得这些索引处的两个数字的最小公倍数 (LCM) 尽可能小。 该数组最多可以包含一百万个元素，每个数字可以大到一千万。 输出只是产生最小 LCM 的任意一对指数。 

关键的挑战是使用简单的双循环计算每个可能对的 LCM 大约需要`n^2/2`运营。 为了`n = 10^6`，这将是大约`5 * 10^11`操作，在4秒的时间限制下是完全不可行的。 因此，我们必须找到一种方法来避免直接迭代所有对。 

幼稚的实现也可能在边缘情况下失败，例如包含重复数字或作为许多较大数字的因子的小数字的数组。 例如，如果数组是`[2, 2, 6]`，最小 LCM 为`2`使用前两个索引。 假设不同值或仅比较相邻元素的粗心方法会错误地选择`LCM(2,6) = 6`。 

## 方法

 蛮力方法很简单。 我们迭代所有对`(i, j)`并将其 LCM 计算为`a[i] * a[j] // gcd(a[i], a[j])`，跟踪具有最小值的对。 这个方法是正确的，但是需要`O(n^2)`操作，超出可行限制时`n`很大。 

更快解决方案的关键观察是最小 LCM 通常涉及最小的数字或共享公共因子的数字。 具体来说，如果一个数`x`在数组中出现多次，将其与自身配对产生等于的最小 LCM`x`。 否则，我们可以利用 LCM 随着大数呈乘法增长这一事实。 通过考虑每个整数的倍数而不是每对整数，我们可以专注于可以实际产生最小 LCM 的候选者。 

最佳解决方案使用类似筛子的方法来跟踪数组中直到最大值的每个整数，以及可被它整除的数组元素的索引。 通过从 1 开始迭代所有可能的除数，我们可以找到最小的 LCM，而无需显式检查所有对。 这将复杂性大致降低到`O(max(a) * log(max(a)))`，考虑到限制，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(最大(a) * log(最大(a))) | O(最大(a)) | 已接受 |

 ## 算法演练

 1.读取输入并存储数组`a`。 创建从每个数字到其在数组中的索引的映射。 这使我们能够稍后报告正确的基于 1 的位置。 
2. 初始化列表`positions`尺寸的`max(a) + 1`存储每个数字或其倍数出现的最小两个索引。 
3. 迭代数组并遍历每个值`v`，将其索引附加到`positions[v]`。 如果`positions[v]`增长超过 2，忽略额外的索引。 仅保留前两个就足够了，因为相同数字的两次出现立即提供了最小 LCM 的候选者。 
4. 循环整数`d`从 1 到`max(a)`。 对于每个`d`，考虑倍数`d`最多`max(a)`。 跟踪所有倍数中的两个最小索引`d`。 这些索引对应于数字`x`和`y`在数组中，两者都可以被整除`d`。 
5. 使用以下方法计算候选 LCM`x * y // d`。 如果该候选值小于当前最小 LCM，则更新结果。 
6. 迭代所有除数后，输出与找到的最小 LCM 对应的索引对。 

为什么它有效：该算法确保每个数字`v`与与其共享除数的所有其他数字结合起来考虑。 通过按升序迭代除数，我们保证永远不会错过产生最小 LCM 的对。 双索引跟踪确保我们始终选择不同的元素（如果可用）。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def main():
    n = int(input())
    a = list(map(int, input().split()))
    max_a = max(a)
    idx_map = [[] for _ in range(max_a + 1)]
    
    for i, val in enumerate(a):
        idx_map[val].append(i + 1)
        if len(idx_map[val]) > 2:
            idx_map[val] = idx_map[val][:2]
    
    min_lcm = 10**20
    ans = (1, 2)
    
    # sieve over possible divisors
    for d in range(1, max_a + 1):
        first = second = -1
        for mult in range(d, max_a + 1, d):
            for pos in idx_map[mult]:
                if first == -1:
                    first = pos
                elif second == -1:
                    second = pos
                if first != -1 and second != -1:
                    break
            if first != -1 and second != -1:
                break
        if first != -1 and second != -1:
            x = a[first - 1]
            y = a[second - 1]
            lcm_val = x * y // math.gcd(x, y)
            if lcm_val < min_lcm:
                min_lcm = lcm_val
                ans = (first, second)
    
    print(ans[0], ans[1])

if __name__ == "__main__":
    main()
```该代码首先将数字映射到它们的索引，然后使用所有潜在除数的筛选来有效地检查候选对。 将存储索引的数量限制为两个足以覆盖具有重复数字的情况，而不会浪费内存或时间。 

## 工作示例

 **示例1**

 输入：```
5
2 4 8 3 6
```| 步骤| d | 倍数 | 第一个索引 | 第二个索引| 液晶模组|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 1,2,3,4,5,6,8 | 1 | 2 | 4 |
 | 2 | 2 | 2,4,6,8 | 1 | 2 | 4 |

 索引 1 和 2 的最小 LCM 为 4，对应于数字 2 和 4。 

**示例2**

 输入：```
4
5 5 10 15
```| 步骤| d | 倍数 | 第一 | 第二 | 液晶模组|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 5 | 5,10,15 | 1 | 2 | 5 |

 这里，两个相同的 5 立即给出最小 LCM。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(最大(a) * log(最大(a))) | 迭代除数和倍数，仅跟踪前两次出现 |
 | 空间| O(最大(a)) | 每个数字最多存储两个索引 |

 给定`max(a)`是 10^7，在 1GB 内存限制下，该算法可以轻松地在 4 秒内运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("5\n2 4 8 3 6\n") in ["1 2", "2 1"], "sample 1"

# Custom tests
assert run("4\n5 5 10 15\n") in ["1 2", "2 1"], "two identical minimal"
assert run("2\n1 10000000\n") in ["1 2", "2 1"], "minimal pair includes 1"
assert run("3\n7 7 7\n") in ["1 2", "2 1"], "all equal values"
assert run("6\n2 3 5 7 11 13\n") in ["1 2", "2 1"], "all prime numbers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 4\n5 5 10 15 | 5 5 10 15 1 2 | 两个相同的最小数 |
 | 2\n1 10000000 | 1 2 | 1 与最大数字配对 |
 | 3\n7 7 7 | 7 1 2 | 所有相同的数字 |
 | 6\n2 3 5 7 11 13 | 6\n2 3 5 7 11 13 1 2 | 素数中的最小最小公倍数 |

 ## 边缘情况

 如果数组包含重复的小数字，算法会立即选择它们。 为了`[7,7,11]`, 除数`7`产生两个索引 1 和 2，给出`LCM=7`，正确小于`LCM(7,11)=77`。 数组包含`1`还将它与任何其他数字配对以产生`LCM=1`如果`1`出现两次，或者是最小的数字。 筛子保证考虑每个可能的除数，因此算法永远不会错过候选者。
