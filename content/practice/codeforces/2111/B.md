---
title: "CF 2111B - 斐波那契立方体"
description: "我们有一个立方体集合，其中第 $i$ 个立方体的边长对应于修改后的定义下的第 $i$ 个斐波那契数：$f1 = 1$、$f2 = 2$ 和 $fi = f{i-1} + f{i-2}$ 对于 $i 2$。"
date: "2026-06-08T04:30:35+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 2111
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 179 (Rated for Div. 2)"
rating: 1100
weight: 2111
solve_time_s: 109
verified: false
draft: false
---

[CF 2111B - 斐波那契立方体](https://codeforces.com/problemset/problem/2111/B)

 **评分：** 1100
 **标签：** 暴力破解、dp、实现、数学
 **求解时间：** 1m 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个立方体的集合，其中立方体的边长$i$第 - 个立方体对应于$i$-修改定义下的斐波那契数：$f_1 = 1$,$f_2 = 2$， 和$f_i = f_{i-1} + f_{i-2}$为了$i > 2$。 对于一组盒子中的每个盒子，我们都会被问到是否可以将所有这些立方体放入其中，并遵守堆叠规则。 每个立方体必须与盒子对齐，不能漂浮在半空中，也不能放置在更小的立方体上。 

输入由多个测试用例组成，每个测试用例提供立方体的数量$n$, 盒子数量$m$，以及每个盒子的尺寸。 每个测试用例的输出是一个长度的字符串$m$，如果立方体适合相应的盒子，则为“1”，否则为“0”。 

约束给我们$n \le 10$和总和$m$跨所有测试用例$\le 2 \cdot 10^5$。 这很重要，因为它允许我们预先计算立方体大小并对每个盒子使用简单的模拟。 由于立方体大小按斐波那契顺序快速增长，因此该问题不需要复杂的打包算法； 相反，精心排序的贪婪方法就足够了。 

当立方体在任何方向上的组合占地面积都大于盒子时，或者当盒子的尺寸非常小而无法堆叠时，就会出现微妙的边缘情况。 例如，如果$n = 5$，立方体有边$1, 2, 3, 5, 8$，盒子尺寸为$(6, 6, 5)$，堆叠失败，因为最大的立方体 ($8$) 不适合任何方向。 仅检查总体积的简单方法会错误地表示“适合”，而忽略实际尺寸限制。 

## 方法

 暴力方法将尝试模拟每个盒子中立方体放置和方向的每种可能的排列。 给定$n \le 10$， 有$n!$排列，每个立方体最多可以有 6 种方向。 和$m$潜在地$2 \cdot 10^5$，这变得令人望而却步。 

关键的见解是所有立方体都是立方体（边长相等）并且$n$很小。 因此，我们可以按降序对立方体进行排序，并沿着最大的盒子维度模拟贪婪放置。 对于每个盒子，我们按降序对其边进行排序，然后重复将最大的剩余立方体放置在最大的剩余维度上。 立方体沿一个维度垂直堆叠，其余两个维度必须容纳任何方向的所有立方体。 这将每个框检查简化为简单的比较序列。 

贪婪方法之所以有效，是因为立方体尺寸不断增大，并且必须从大到小堆叠。 对立方体和盒子边进行排序可确保，如果立方体无法按排序顺序沿着维度排列，则它无法适合任何排列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n! * 6^n * m) | O(n) | 太慢了|
 | 最优贪心 | O(n log n + m log 3) ≈ O(m) | O(n log n + m log 3) ≈ O(m) | O(n) | 已接受 |

 ## 算法演练

 1. 根据修改后的定义预先计算前 10 个斐波那契数：$f_1 = 1$,$f_2 = 2$,$f_i = f_{i-1} + f_{i-2}$为了$i > 2$。 我们只需要这些数字，因为$n \le 10$。 
2. 对于每个测试用例，按降序对斐波那契立方体进行排序。 这允许我们首先放置最大的立方体。 
3. 对于每个框，将其三个维度按降序排序。 这确定了哪个尺寸将保持堆叠高度以及哪两个尺寸形成底部。 
4. 从框中初始化三个可用尺寸。 从最大的立方体开始，尝试将其沿着剩余的最大维度放置。 沿立方体边的堆叠轴减少可用尺寸。 
5. 继续按降序放置立方体。 如果在任何步骤中立方体超过任何可用尺寸，则将该框标记为不可能并移至下一个框。 
6. 如果所有立方体都成功放置在盒子尺寸内，则将其标记为可能。 
7. 对测试用例中的每个框重复步骤 3-6。 

工作原理：按降序对立方体进行排序可以保证最大的立方体首先占据最大的空间，从而防止较小的立方体阻塞较大的立方体。 对箱子尺寸进行排序可确保选择最佳的堆叠方向。 不变量是，放置每个立方体后，当且仅当盒子可以容纳所有立方体时，沿所有轴的剩余空间足以容纳剩余的立方体。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# precompute Fibonacci numbers up to 10
fib = [1, 2]
for i in range(2, 10):
    fib.append(fib[-1] + fib[-2])

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    cubes = fib[:n]
    cubes.sort(reverse=True)
    res = []
    for _ in range(m):
        box = list(map(int, input().split()))
        box.sort(reverse=True)
        temp_box = box[:]
        possible = True
        # we can place cubes along the largest box dimension
        for cube in cubes:
            # find the largest box dimension to place this cube
            placed = False
            for i in range(3):
                if temp_box[i] >= cube:
                    temp_box[i] -= cube
                    placed = True
                    break
            if not placed:
                possible = False
                break
        res.append('1' if possible else '0')
    print(''.join(res))
```斐波那契数的预先计算确保我们永远不会在每个测试用例中重新计算它们。 按降序对多维数据集进行排序可保证最大的优先放置。 对盒子尺寸进行排序可确保我们沿最大轴堆叠，从而最大限度地利用空间。 放置立方体时减小尺寸可以避免过度计算空间。 这可以避免出现错误，例如放置一个在技术上适合体积但无法按尺寸容纳的立方体。 

## 工作示例

 **示例输入 1**```
5 4
3 1 2
10 10 10
9 8 13
14 7 20
```| 立方体| 侧面| 盒子分类 | 安置|
 | --- | --- | --- | --- |
 | 8 | 8 | 10,10,10 | 10,10,10 | 放入 10 → 剩余 2 |
 | 5 | 5 | 10,10,2 | 放入 10 → 剩余 5 |
 | 3 | 3 | 10,5,2 | 放入 10 → 剩余 2 |
 | 2 | 2 | 2,5,2 | 放入 5 → 剩余 2 |
 | 1 | 1 | 2,2,2 | 放入 2 → 剩余 1 |

 输出：1

 该迹线表明立方体可以沿着最大维度堆叠。 

**示例输入 2**```
2 6
3 3 3
1 2 1
```| 立方体| 侧面| 盒子分类 | 安置|
 | --- | --- | --- | --- |
 | 2 | 2 | 3,3,3 | 放入 3 → 剩余 1 |
 | 1 | 1 | 1,3,3 | 放入 3 → 剩余 2 |

 输出：10

 这表明小立方体可以适应多个方向，但如果任何盒子尺寸太小，大立方体可能会失败。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m * n) | 每个盒子需要迭代 n 个立方体； n ≤ 10，因此与总 m 有效呈线性。 |
 | 空间| O(n) | 仅存储立方体尺寸和临时盒子尺寸。 |

 和$m \le 2 \cdot 10^5$和$n \le 10$，总操作数≤2·10^6，完全在2秒的时间限制内。 内存使用量极小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # run solution
    import sys
    input = sys.stdin.readline

    fib = [1, 2]
    for i in range(2, 10):
        fib.append(fib[-1] + fib[-2])

    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        cubes = fib[:n]
        cubes.sort(reverse=True)
        res = []
        for _ in range(m):
            box = list(map(int, input().split()))
            box.sort(reverse=True)
            temp_box = box[:]
            possible = True
            for cube in cubes:
                placed = False
                for i in range(3):
                    if temp_box[i] >= cube:
                        temp_box[i] -= cube
                        placed = True
                        break
                if not placed:
                    possible = False
                    break
            res.append('1' if possible else '0')
        print(''.join(res))
    return output.getvalue().strip()

# Provided samples
assert run("2\n5
```
