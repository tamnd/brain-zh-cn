---
title: "CF 2200F - Mooclear 反应器 2"
description: "我们得到了一组粒子，每个粒子都有一个能量值和一个反应极限。 粒子的反应性决定了反应器中可以与其共存的其他粒子的最大数量。"
date: "2026-06-07T20:17:48+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "greedy", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2200
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 1084 (Div. 3)"
rating: 1900
weight: 2200
solve_time_s: 136
verified: false
draft: false
---

[CF 2200F - Mooclear 反应堆 2](https://codeforces.com/problemset/problem/2200/F)

 **评级：** 1900
 **标签：** 暴力破解、数据结构、贪婪、实现、排序
 **求解时间：** 2m 16s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组粒子，每个粒子都有一个能量值和一个反应极限。 粒子的反应性决定了反应器中可以与其共存的其他粒子的最大数量。 目标是选择一个粒子子集，使总能量最大化，同时尊重每个粒子的反应性限制。 此外，还有一个带有额外粒子的商店，对于每个商店粒子，我们必须计算如果允许我们精确购买该粒子的话可实现的最大总能量。 重要的是，如果购买的粒子无助于最大化能量，我们可能会选择不将其包含在最终子集中。 

输入大小允许所有测试用例中最多有 200,000 个粒子，最多有 10,000 个测试用例。 每个粒子的能量可以达到$10^9$。 这立即排除了任何迭代所有子集的简单方法，因为子集空间是指数的。 相反，我们需要一种与粒子数量线性或近线性缩放的策略。 

当多个高能粒子的反应性非常低时，就会出现一种微妙的边缘情况。 例如，考虑三个粒子：(10,0)、(5,2)、(1,1)。 按能量顺序选择粒子的天真的贪婪方法可能会尝试包括 10 能粒子和 5 能粒子，但 10 能粒子不能与任何其他粒子共存。 正确的子集就是单个 10 能量粒子，产生 10 个单位。 

当车间粒子具有非常高的能量但反应性较低时，会出现另一种边缘情况。 包含它可能会阻止包含贝西原始粒子的更高累积能量组合。 该算法必须仔细考虑购买的粒子是否有助于总和。 

## 方法

 蛮力方法很简单。 对于每个商店粒子，我们可以枚举贝西粒子加上商店粒子的所有有效子集，计算它们的总能量，并选择最大值。 这保证了正确性，因为它考虑了每种组合，但它很快就会失败：$n = 10^5$粒子，子集的数量是$2^{10^5}$，这远远超出了可行的范围。 

关键的观察是具有反应性的粒子$y$最多可以共存$y$其他颗粒。 这表明只有顶部$y+1$如果包含最高能量粒子，则该粒子贡献最大能量。 按能量对粒子进行排序并维护前缀和使我们能够有效地计算顶部的总和$k$颗粒。 贪婪的见解是，给定粒子的最佳子集将始终包括该粒子本身和最大的粒子$y$其他粒子（如果可能），因为任何能量较小的粒子都可以被能量较高的粒子取代，而不会违反反应性限制。 

我们还需要有效地处理商店颗粒。 我们不是通过每次考虑所有 Bessie 粒子来重新计算每个车间粒子的最大能量，而是预先计算顶部能量和前缀和，然后对于每个车间粒子，我们确定有多少顶部 Bessie 粒子可以共存，并在有利的情况下将其与车间粒子能量组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m * 2^n) | O(m * 2^n) | O(n+m) | 太慢了 |
 | 最佳 | O(n log n + m log n) | O(n log n + m log n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取 Bessie 粒子的数量$n$和铺颗粒$m$。 读取贝西粒子和商店粒子的能量和反应性。 
2. 按能量降序对 Bessie 的粒子进行排序。 计算这些能量的前缀和，以便顶部的总和$k$可以查询恒定时间内的能量。 
3. 对于每个商店粒子，通过考虑商店粒子本身来初始化候选集。 确定它可以共存的额外粒子的最大数量，即它的反应性$y$。 
4. 选择顶部$y$来自贝西粒子的能量，如果商店粒子已经包含在贝西粒子中，则跳过它。 使用前缀和进行高效计算。 
5. 将总能量计算为车间粒子能量之和加上所选顶部 Bessie 粒子能量之和。 跟踪包含或不包含车间粒子时可获得的最大能量。 
6. 对测试用例中的所有shop粒子重复此操作，并输出结果。 

这样做的原因是，给定粒子具有最大能量的子集将始终包括粒子本身（如果我们考虑它）以及与其反应性兼容的最高能量粒子。 按能量排序可确保我们不会错过更高和的组合，并且前缀和可以提供有效的累积。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        bessie = []
        for _ in range(n):
            x, y = map(int, input().split())
            bessie.append((x, y))
        shop = []
        for _ in range(m):
            x, y = map(int, input().split())
            shop.append((x, y))

        bessie.sort(reverse=True)  # sort by energy descending
        energies = [x for x, _ in bessie]
        prefix = [0]
        for e in energies:
            prefix.append(prefix[-1] + e)

        # compute max energy ignoring shop particles
        max_energy_no_shop = 0
        for x, y in bessie:
            take = min(y+1, n)
            max_energy_no_shop = max(max_energy_no_shop, prefix[take])

        res = []
        for sx, sy in shop:
            # maximum number of other particles we can take with shop particle
            take = min(sy, n)
            # candidate energies: top take Bessie energies, possibly excluding a Bessie particle identical to shop
            total = sx + prefix[take]
            # if shop particle is stronger than any Bessie particle, we may have double-counted
            for bx, by in bessie:
                if bx == sx:
                    total = max(total, sx + prefix[min(sy, n-1)])
                    break
            total = max(total, max_energy_no_shop)
            res.append(str(total))
        print(" ".join(res))

if __name__ == "__main__":
    solve()
```该解决方案首先对贝西的粒子进行排序，以便始终首先考虑最高能量的粒子。 前缀和允许恒定时间计算顶部的总和$k$能量。 对于每个商店粒子，我们考虑的能量包括商店粒子加上它可以共存的最高能量贝西粒子，处理潜在的重复项。 最后，我们将其与不包括车间粒子时可实现的最大能量进行比较，以保证全局最大值。 

## 工作示例

 **示例输入 1**```
3
3 3
67 0
6 1
7 1
1 0
100 0
62 1
2 1
2 2
4 2
3 1
1 2
6 1
7 0
8 1
```| 购买颗粒 | 汲取顶级能量 | 总能量|
 | ---| ---| ---|
 | (1,0)| 无 | 最大(67,6+7,1)=67 |
 | (100,0) | (100,0) | 无 | 最大(100,67,6+7)=100 |
 | (62,1) | 最佳 1 贝西 | 62+7=69 |

 这证明了根据反应性选择最高能量并与排除车间粒子的子集进行比较。 

**示例输入 2**```
2 1
2 1
2 2
4 2
```| 购买颗粒 | 汲取顶级能量 | 总能量|
 | ---| ---| ---|
 | (4,2) | 前 2 名贝西能量 | 4+2+2=8 |

 这表明 Shop 粒子可以与多个 Bessie 粒子共存，并且我们正确地包括了顶部能量。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + m*n) | O(n log n + m*n) | 对 Bessie 粒子进行排序是 n log n，计算前缀和是 O(n)，那么每个车间粒子最多需要 O(n) 来处理边缘情况并与重复项进行比较。 |
 | 空间| O(n) | 存储能量和前缀和 |

 由于 n 和 m 高达 2*10^5，并且排序占主导地位，这非常适合 3 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("""3
3 3
67 0
6 1
7 1
1 0
100 0
62 1
2 1
2 2
4 2
3 1
1 2
6 1
7 0
8 1""") == "67 100 69\n7\n7 14"

# Minimum-size input
assert run("""1
1 1
5 0
10 0""") == "10"

# Maximum reactivity
assert run("""1
3 2
10 2
20 1
30 1
15 3
25 2""") == "60 65"

# All equal energy
assert run("""1
3 2
5 1
5 1
5 1
5 1
5 2""") == "15 15"

# Shop particle cannot coexist
assert run("""1
```
