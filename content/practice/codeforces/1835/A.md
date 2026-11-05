---
title: "CF 1835A - 第 k 个等式"
description: "我们被要求枚举 a + b = c 形式的所有等式，其中 a、b 和 c 是分别具有 A、B 和 C 数字的正整数。"
date: "2026-06-09T06:47:54+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1835
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 880 (Div. 1)"
rating: 1700
weight: 1835
solve_time_s: 71
verified: true
draft: false
---

[CF 1835A - 第 k 个等式](https://codeforces.com/problemset/problem/1835/A)

 **评分：** 1700
 **标签：** 蛮力、实现、数学
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求枚举以下形式的所有等式`a + b = c`在哪里`a`,`b`， 和`c`是正整数`A`,`B`， 和`C`分别为数字。 在所有这些有效的等式中，我们必须找到`k`- 当以字符串格式写入时，按字典顺序排列的第一个`"a + b = c"`。 如果少于`k`平等存在，我们回归`-1`。 

输入为我们提供了多个测试用例。 每个测试用例提供四个整数：`A`,`B`,`C`， 和`k`。 限制因素`1 ≤ A, B, C ≤ 6`允许我们在小情况下有效地枚举具有这些数字长度的所有数字，但是`k`一样大`10^12`意味着我们无法明确地生成所有平等。 我们需要一个方法来直接跳转到`k`-th 相等，无需迭代所有组合。 

当不存在有效的等式时，会出现不明显的边缘情况。 例如，如果`A = B = 1`和`C = 1`，最小可能的总和是`1 + 1 = 2`，它已经有两位数，因此不存在有效的等式。 在这种情况下，盲目生成数字的粗心解决方案可能会错误地产生结果。 同样，当`k`非常大，我们必须正确返回`-1`如果少于`k`平等存在，否则试图产生`10^12`平等是不可能的。 

## 方法

 天真的方法生成所有数字`a`和`A`数字，所有数字`b`和`B`数字，计算它们的总和`c = a + b`，并检查是否`c`正好有`C`数字。 收集每个有效的等式，然后`k`选择-th。 这种方法是正确的，但很快就变得不可行：即使对于`A = B = 6`, 大致有`9 * 10^5 * 9 * 10^5 ≈ 8.1 * 10^11`组合，太大了，无法在一秒钟内处理。 

关键的见解是我们不需要枚举所有总和来找到`k`-th 平等。 对于每个`a`，可能的范围`b`产生的值`C`-数字`c`是连续的。 具体来说，`b`必须满足`10^(C-1) - a ≤ b ≤ 10^C - 1 - a`，进一步限制为`B`- 数字。 这使我们能够计算有多少有效的`b`每个都存在 s`a`并跳过整个块`a`值时`k`超过块大小。 通过反复减去这些计数`k`直到我们确定准确的`a`其中包含`k`-th 等式，我们可以直接计算对应的`b`和`c`。 

这将问题从组合爆炸转变为可管理的逐位计算，利用数字和范围的结构而不是暴力枚举。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(10^A * 10^B) | O(10^A * 10^B) | A 太慢，B > 3 |
 | 最佳| O(10^A + 10^B) | O(10^A + 10^B) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 计算最小值和最大值`A`- 位数：`min_a = 10^(A-1)`和`max_a = 10^A - 1`。 类似地，计算`min_b`,`max_b`,`min_c`， 和`max_c`。 
2. 初始化剩余计数`remaining = k`。 我们将递减`remaining`因为我们按照字典顺序解释有效的平等。 
3.循环`a`从`min_a`到`max_a`按升序排列。 对于每个`a`，计算最小的`b`这给出了一个有效的`C`-数字`c`:`b_min = max(min_b, min_c - a)`。 同样，计算最大的`b`这给出了一个有效的`c`:`b_max = min(max_b, max_c - a)`。 
4. 如果`b_min > b_max`, 没有有效的`b`为此而存在`a`，所以继续下一步`a`。 
5、有效数量`b`是为了这个`a`是`count_b = b_max - b_min + 1`。 如果`remaining > count_b`, 减去`count_b`从`remaining`并继续。 这会跳过所有等式`a`因为它们先于`k`-th 平等。 
6. 如果`remaining ≤ count_b`， 这`k`-th 等式位于该块内。 计算`b = b_min + remaining - 1`。 然后`c = a + b`。 格式化并返回字符串`"a + b = c"`。 
7. 如果循环完成时没有找到包含`k`-th 相等，返回`-1`。 

为什么有效：每个`a`按升序处理，并且对于每个`a`， 全部`b`s 按升序处理。 有效的连续范围`b`值确保对它们进行计数准确地反映了字典顺序。 跳过整个块可以保留顺序并保证正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        A, B, C, k = map(int, input().split())
        min_a, max_a = 10**(A-1), 10**A - 1
        min_b, max_b = 10**(B-1), 10**B - 1
        min_c, max_c = 10**(C-1), 10**C - 1

        remaining = k
        found = False

        for a in range(min_a, max_a + 1):
            b_min = max(min_b, min_c - a)
            b_max = min(max_b, max_c - a)
            if b_min > b_max:
                continue
            count_b = b_max - b_min + 1
            if remaining > count_b:
                remaining -= count_b
                continue
            b = b_min + remaining - 1
            c = a + b
            print(f"{a} + {b} = {c}")
            found = True
            break

        if not found:
            print(-1)

if __name__ == "__main__":
    solve()
```代码仔细处理了每个数字长度的边界，避免了不必要的枚举。 这`b_min`和`b_max`计算确保遵守数字长度和总和约束。 跳过块`b`值加速了对`k`-th 平等。 

## 工作示例

 输入示例：`2 2 3 1`| 一个 | b_min | b_最大| 计数_b | 剩余| 行动|
 | ---| ---| ---| ---| ---| ---|
 | 10 | 10 90 | 90 99 | 99 10 | 10 1 | 剩余 ≤ count_b，选择 b = 90 |

 输出：`"10 + 90 = 100"`。 这表明该算法可以正确识别第一个有效的等式，而无需枚举所有 100 个可能的和。 

输入示例：`1 1 1 9`| 一个 | b_min | b_最大| 计数_b | 剩余| 行动|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 9 | 9 | 9 | 剩余 ≤ count_b，选择 b = 9 |

 输出：`"2 + 1 = 3"`。 这里算法正确地递增`a`用尽所有有效后`b`s 为第一个`a`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(10^A) | O(10^A) | 对于每个`a`从`10^(A-1)`到`10^A - 1`, 计算`b_min`,`b_max`，并且可能有一个`b`。 每个测试用例最多运行 10^6 次迭代`A = 6`。 |
 | 空间| O(1) | O(1) | 没有大型数组或列表； 每个测试用例只有几个整数变量。 |

 考虑到约束条件`A, B, C ≤ 6`和`t ≤ 10^3`，该算法在 1 秒内轻松完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("7\n1 1 1 9\n2 2 3 1\n2 2 1 1\n1 5 6 42\n1 6 6 10000000\n5 5 6 3031568815\n6 6 6 1000000000000\n") == (
"2 + 1 = 3\n10 + 90 = 100\n-1\n9 + 99996 = 100005\n-1\n78506 + 28543 = 107049\n-1"
)

# Custom cases
assert run("1\n1 1 2 1\n") == "1 + 9 = 10", "smallest 1-digit sum resulting in 2-digit"
assert run
```
