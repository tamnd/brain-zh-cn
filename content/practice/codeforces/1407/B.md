---
title: "CF 1407B - 大沃瓦"
description: "给定一个正整数序列，我们需要将它们重新排序为序列 $b$，使得前缀最大公约数序列 $ci = gcd(b1, b2,dots, bi)$ 按字典顺序最大。"
date: "2026-06-11T07:48:59+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1407
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 669 (Div. 2)"
rating: 1300
weight: 1407
solve_time_s: 92
verified: false
draft: false
---

[CF 1407B - 大沃瓦](https://codeforces.com/problemset/problem/1407/B)

 **评分：** 1300
 **标签：** 蛮力、贪心、数学、数论
 **求解时间：** 1m 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一个正整数序列，我们需要将它们重新排序为一个序列$b$这样前缀最大公约数的序列$c_i = \gcd(b_1, b_2, \dots, b_i)$按字典顺序是最大的。 换句话说，在每个位置，我们希望与任何其他排序相比，最左边不同位置的运行 GCD 尽可能大。 

输入由多个测试用例组成，每个测试用例都有一个相对较小的序列（$n \le 10^3$) 和以下范围内的数字$10^3$。 因为所有的总和$n$跨测试用例不超过$10^3$， 一个$O(n^2)$每个测试用例的解决方案是可以接受的。 

当多个数字共享因子但大小不同时，就会出现不明显的边缘情况。 例如，如果序列是`[4, 2, 8]`，始终首先选择最大数字的天真的方法可能会失败，因为首先选择 8 会产生前缀 GCD`[8, 2, 2]`，而从 4 开始给出`[4, 2, 2]`。 这里，贪婪步骤必须考虑每个候选者的当前 GCD，并选择最大化所得 GCD 的那个。 单元素序列、所有数字都相等的序列以及包含 1 的序列也必须正确处理。 

## 方法

 暴力法是生成所有$n!$序列的排列，计算每个排列的前缀 GCD 序列，并选择产生字典顺序最大的前缀 GCD 序列的排列。 这是正确的，因为它探索了所有可能的排序，但即使对于$n = 10$， 作为$10! = 3.6 \cdot 10^6$操作和计算 GCD 序列会进一步增加开销。 

最佳解决方案的关键见解是前缀 GCD 序列是非递增的：$\gcd(b_1, \dots, b_{i+1}) \le \gcd(b_1, \dots, b_i)$。 因此，第一个元素应该始终是最大化的最大数字$c_1$。 在第一个元素之后，在每一步中，我们从剩余池中选择与当前前缀 GCD 组合时最大化 GCD 的数字。 这种贪婪方法是有效的，因为字典比较主要取决于最左边的元素：在每一步最大化当前 GCD 可确保较小的 GCD 不会出现在序列的较早位置。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n! * n) | O(n! * n) | O(n) | 太慢了|
 | 最优贪心 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 读取测试用例的数量并循环遍历每个用例。 
2. 对于每个测试用例，阅读序列$a$并初始化一个空的结果列表$b$。 
3. 选择其中最大的数字$a$作为第一个元素$b$。 这确保了第一个前缀 GCD 是最大的。 将其从池中取出。 
4. 初始化`current_gcd`作为第一个元素的值。 
5. 当池中还有剩余数字时，迭代它们并计算 GCD`current_gcd`与每位候选人。 选择最大化此 GCD 的数字。 将其附加到$b$并更新`current_gcd`。 从池中删除选定的号码。 
6. 重复，直到所有数字都放入$b$。 输出$b$。 

工作原理：在每一步中，算法都会保持这样一个不变式：到目前为止生成的前缀 GCD 序列相对于剩余数字的任何排序在字典顺序上都是最大的。 由于前缀 GCD 是非递增的，因此局部最大化每个步骤可以保证全局字典序最大值。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        used = [False] * n
        b = []
        # Step 1: pick the largest number first
        max_idx = a.index(max(a))
        b.append(a[max_idx])
        used[max_idx] = True
        current_gcd = a[max_idx]

        for _ in range(1, n):
            best_gcd = -1
            best_idx = -1
            for i in range(n):
                if not used[i]:
                    g = math.gcd(current_gcd, a[i])
                    if g > best_gcd:
                        best_gcd = g
                        best_idx = i
            b.append(a[best_idx])
            used[best_idx] = True
            current_gcd = best_gcd
        print(*b)

if __name__ == "__main__":
    solve()
```代码首先选择最大的数字，因为这会最大化第一个前缀 GCD。 这`used`数组跟踪已选择的数字以避免重复。 内部循环选择当前前缀给出最高 GCD 的数字，反映了贪婪不变量。 使用`math.gcd`确保正确性并避免手动 GCD 计算。 

## 工作示例

 ### 输入示例 1```
2
2
2 5
3
3 8 9
```#### 第一个测试用例的跟踪`[2,5]`| 步骤| 当前 GCD | 剩余| 精选| 与候选人的 GCD |
 | --- | --- | --- | --- | --- |
 | 1 | - | [2,5]| 5 | - |
 | 2 | 5 | [2] | 2 | gcd(5,2)=1 | gcd(5,2)=1 |

 输出：`5 2`。 第一个 GCD 是最大的 5。 

#### 第二个测试用例的跟踪`[3,8,9]`| 步骤| 当前 GCD | 剩余| 精选| 与候选人的 GCD |
 | --- | --- | --- | --- | --- |
 | 1 | - | [3,8,9]| 9 | - |
 | 2 | 9 | [3,8]| 3 | gcd(9,3)=3 | gcd(9,3)=3 |
 | 3 | 3 | [8] | 8 | gcd(3,8)=1 | gcd(3,8)=1 |

 输出：`9 3 8`。 该序列确保前缀 GCD 的字典顺序最大`[9,3,1]`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 对于 n 个位置中的每一个，我们扫描最多 n 个剩余元素来计算 GCD。 |
 | 空间| O(n) | 存储使用的数组和结果序列。 |

 给定$n \le 10^3$并且测试用例中的 n 之和≤ 10^3，该解决方案最多执行$10^6$操作，完全在 1 秒的时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# Provided samples
assert run("7\n2\n2 5\n4\n1 8 2 3\n3\n3 8 9\n5\n64 25 75 100 50\n1\n42\n6\n96 128 88 80 52 7\n5\n2 4 8 16 17\n") == \
    "5 2\n8 2 1 3\n9 3 8\n100 50 25 75 64\n42\n128 96 80 88 52 7\n17 2 4 8 16"

# Minimum-size input
assert run("1\n1\n1\n") == "1"

# All equal
assert run("1\n4\n5 5 5 5\n") == "5 5 5 5"

# Maximum element first vs last
assert run("1\n5\n2 4 6 8 10\n") == "10 8 6 4 2"

# Contains 1
assert run("1\n3\n1 3 6\n") == "6 3 1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1\n1`|`1`| 单元素序列 |
 |`1\n4\n5 5 5 5`|`5 5 5 5`| 所有元素都相等 |
 |`1\n5\n2 4 6 8 10`|`10 8 6 4 2`| 贪心挑选最大的GCD作品|
 |`1\n3\n1 3 6`|`6 3 1`| 包含 1 的序列已正确处理 |

 ## 边缘情况

 包含 1 的序列，例如`[1, 3, 6]`，证明首先选择最大的数字可以避免 GCD 过早下降。 该算法首先选择 6 个（`current_gcd=6`), 然后 3 (`gcd(6,3)=3`)，然后 1 (`gcd(3,1)=1`）。 这保证了前缀GCD序列`[6,3,1]`是最大的。 如果每一步都没有贪婪选择，那么首先选择 3 将产生“[3，
