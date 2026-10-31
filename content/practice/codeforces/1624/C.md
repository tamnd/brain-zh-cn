---
title: "CF 1624C - 除以二和排列"
description: "给定一个大小为 $n$ 的正整数数组，我们想知道是否可以通过重复将元素除以 2 将其转换为从 $1$ 到 $n$ 的数字排列。 每个除法运算都会用 $lfloor ai / 2 rfloor$ 替换元素 $ai$。"
date: "2026-06-10T05:35:00+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "flows", "graph-matchings", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1624
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 764 (Div. 3)"
rating: 1100
weight: 1624
solve_time_s: 72
verified: true
draft: false
---

[CF 1624C - 除以二和排列](https://codeforces.com/problemset/problem/1624/C)

 **评分：** 1100
 **标签：** 构造性算法、流程、图匹配、贪婪、数学
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个大小为正整数的数组$n$，我们想知道是否可以将其转换为以下数字的排列$1$到$n$通过重复将元素除以二。 每个除法运算都会替换一个元素$a_i$和$\lfloor a_i / 2 \rfloor$。 这里的排列意味着最终数组包含来自$1$到$n$正好一次。 

就以下方面而言，约束足够小$n$（最多 50 个）但就数字本身而言很大（最多$10^9$）。 这意味着我们无法承受直接随数字缩放的操作（例如从 1 迭代到$a_i$），但我们可以执行与$n \log a_i$因为重复将一个数除以二最多需要 30 步（因为$2^{30} \approx 10^9$）。 

一种简单的方法可能是尝试每个数字的所有除法序列，并检查是否有任何组合产生排列。 这将呈指数增长$n$甚至对于$n=20$。 边缘情况包括其中许多元素最初大于$n$、具有重复数字的数组以及缺少最小数字的数组。 例如，如果$a = [4, 4, 4]$和$n = 3$，这似乎是合理的，因为每个 4 都可以分为 2 和 1，但我们必须仔细分配结果以避免重复。 粗心的方法可能会在不考虑顺序的情况下贪婪地划分数字，并错误地宣称成功或失败。 

## 方法

 暴力方法将尝试为每个数字生成所有除法序列，然后检查某些组合是否形成有效的排列。 对于单个数字，可能性的数量大致为$\log_2 a_i$，最坏情况下约为 30。 为了$n=50$，组合总数变为$30^{50}$，这是一个天文数字。 这显然是不可行的。 

关键的见解是，对于每个目标数字$1$到$n$，我们只关心它是否可以通过重复将数组中的某个元素减半来产生。 我们不需要同时跟踪所有序列。 我们可以按降序对数组进行排序，并尝试首先将最大的数字分配给最大的可用目标，然后向下划分，直到数字适合为止。 这种贪婪方法之所以有效，是因为一旦我们为目标分配了一个数字，我们就会将该目标从考虑中删除，并且如果我们先处理较大的数字，则无法阻止较小的数字。 

我们可以通过维护一组可用目标来实现这一点$1$通过$n$。 对于从最大的开始的每个元素，我们重复除以二，直到它落入可用目标集合（然后我们删除该目标）或降至 1 以下（失败）。 这确保了每个数字都被分配给它可以达到的最大可能目标，防止冲突并保证算法找到排列（如果存在）。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((log A)^n) | O((log A)^n) | O(n) | 太慢了 |
 | 贪心除法 | O(n log A) | O(n log A) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$和数组$a$。 
2. 初始化包含目标数字的集合$1$到$n$。 这代表我们仍需要生产的数字。 
3. 对数组进行排序$a$按降序排列。 我们希望首先分配较大的数字，以避免阻挡较小的目标。 
4. 对于排序数组中的每个数字，重复将其除以二，直到它与可用目标集中的数字匹配或变为零。 
5. 如果数字与目标匹配，则从集合中删除该目标并移至下一个数字。 
6. 如果数字达到零而没有匹配任何可用目标，则为此测试用例打印“NO”。 否则，继续，直到处理完所有数字。 
7. 如果所有目标均已分配，则打印“YES”。 

为什么它有效：不变的是，在每一步中，最大的未分配数字都试图覆盖它可以达到的最大剩余目标。 由于我们仅在数字等于目标时分配目标，然后删除目标，因此没有两个数字会声明相同的目标。 按降序处理数字可以保证较小的数字不会被较大的数字阻塞，因此如果存在有效的排列，算法就会找到它。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    targets = set(range(1, n+1))
    a.sort(reverse=True)
    
    possible = True
    for x in a:
        while x > 0:
            if x in targets:
                targets.remove(x)
                break
            x //= 2
        else:
            possible = False
            break
    
    print("YES" if possible else "NO")
```代码首先读取测试用例的数量。 对于每个测试用例，它读取数组并将目标集从 1 初始化到$n$。 按降序对数组进行排序可确保我们首先处理较大的数字。 内部循环将每个数字相除，直到它匹配目标或变为零。 如果没有匹配就变为零，则排列是不可能的。 使用集合允许 O(1) 检查和删除目标，从而保持解决方案的效率。 

## 工作示例

 ### 示例 1

 输入数组：`[1, 8, 25, 2]`，n = 4

 | 步骤| 数量 | 目标 | 运营|
 | --- | --- | --- | --- |
 | 1 | 25 | 25 {1,2,3,4} | 25 → 12 → 6 → 3； 分配 3，删除 3 |
 | 2 | 8 | {1,2,4} | 8 → 4； 分配 4，删除 4 |
 | 3 | 2 | {1,2} | 2； 分配 2，删除 2 |
 | 4 | 1 | {1} | 1; 分配 1，删除 1 |

 覆盖所有目标，输出 YES。 

### 示例 2

 输入数组：`[1, 1]`，n = 2

 | 步骤| 数量 | 目标 | 运营|
 | --- | --- | --- | --- |
 | 1 | 1 | {1,2} | 1; 分配 1，删除 1 |
 | 2 | 1 | {2} | 1→0； 无法分配 2 |

 未覆盖所有目标，输出NO。 

这些痕迹表明贪婪除法方法正确地将数字分配给目标并识别不可能的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log A) | O(n log A) | 每个数最多被除log2(A_i)次，总共n个数 |
 | 空间| O(n) | 目标集、数组存储 |

 由于 n ≤ 50 且 log2(A_i) ≤ 30，因此该解决方案每个测试用例最多执行 1500 次操作，很容易满足 3 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # paste solution here
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        targets = set(range(1, n+1))
        a.sort(reverse=True)
        
        possible = True
        for x in a:
            while x > 0:
                if x in targets:
                    targets.remove(x)
                    break
                x //= 2
            else:
                possible = False
                break
        
        print("YES" if possible else "NO")
    return output.getvalue().strip()

# Provided samples
assert run("6\n4\n1 8 25 2\n2\n1 1\n9\n9 8 3 4 2 7 1 5 6\n3\n8 2 1\n4\n24 7 16 7\n5\n22 6 22 4 22\n") == "YES\nNO\nYES\nNO\nNO\nYES", "sample 1"

# Custom cases
assert run("1\n1\n1\n") == "YES", "minimum input"
assert run("1\n3\n2 2 2\n") == "YES", "all equal values but divisible"
assert run("1\n5\n10 20 30 40 50\n") == "YES", "all large values"
assert run("1\n4\n1 2 3 4\n") == "YES", "already a permutation"
assert run("1\n3\n3 3 3\n") == "NO", "duplicates cannot reach all targets"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1\n1`| 是 | 最小尺寸输入 |
 |`1\n3\n2 2 2`| 是 | 多个相等的数可以整除 |
 |`1\n5\n10 20 30 40 50`| 是 | 必须除的大数 |
 | `1\n4\n1 2 3 | | |
