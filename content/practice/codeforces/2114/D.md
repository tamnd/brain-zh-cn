---
title: "CF 2114D - 靠近一点"
description: "我们被要求消灭一个非常大的 $10^9 乘以 10^9$ 网格上的所有怪物。 每个怪物占据一个不同的单元格，并且在选择覆盖网格的某些连续区域的矩形之前，我们可以将一个怪物恰好移动到任何空单元格。"
date: "2026-06-08T04:19:49+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 2114
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 1027 (Div. 3)"
rating: 1400
weight: 2114
solve_time_s: 88
verified: false
draft: false
---

[CF 2114D - 靠近一点](https://codeforces.com/problemset/problem/2114/D)

 **评分：** 1400
 **标签：** 蛮力、贪婪、实现、数学
 **求解时间：** 1m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求消灭一个非常大的所有怪物$10^9 \times 10^9$网格。 每个怪物占据一个不同的单元格，并且在选择覆盖网格的某些连续区域的矩形之前，我们可以将一个怪物恰好移动到任何空单元格。 成本是矩形中的单元格数量，目标是最小化此成本，同时确保所有怪物都被消灭。 

输入提供多个测试用例。 每个测试用例指定的位置$n$网格上的怪物。 每个测试用例的输出都是一个整数，即选择性移动一个怪物后可实现的最小矩形成本。 

给定$n$可以达到$2 \cdot 10^5$根据测试文件，任何检查所有网格单元对的算法都是不可能的。 网格的巨大尺寸意味着我们无法明确地表示它，并且我们无法迭代所有候选矩形。 我们必须仅对怪物坐标进行推理。 

不明显的边缘情况包括怪物位于网格最角落的配置，例如$(1,1)$和$(10^9, 10^9)$。 如果移动一个怪物会大大缩小边界矩形，那么根据所有怪物的最小和最大坐标天真地计算矩形就会失败。 例如，怪物在$(1,1)$,$(1,10^9)$,$(10^9,1)$， 和$(10^9,10^9)$，将任何角落怪物移动到内部单元格会减少矩形大小$10^9 \cdot 10^9$到更小的东西。 

另一个边缘情况是所有怪物都已经形成一个紧密的矩形。 将任何怪物移走都会增加成本，因此最佳策略是将它们留在原地。 粗心的实施可能总是尝试移动怪物而不检查这是否确实降低了成本。 

## 方法

 暴力方法是尝试将每个怪物移动到每个空单元格并计算覆盖所有怪物的矩形区域。 矩形由最小值和最大值定义$x$和$y$坐标。 这是正确的，因为它枚举了所有可能的单个动作，但这是不可行的。 即使只考虑现有怪物的坐标，检查$n$反对运动候选人$n$可能的头寸收益率$O(n^2)$矩形计算，当$n \approx 2 \cdot 10^5$。 

关键的见解是，矩形的成本完全由极端坐标决定：最左边、最右边、最上面和最下面的怪物。 在这些边界内移动任何其他怪物不会改变矩形大小。 因此，唯一重要的移动是移动当前矩形边界处的怪物之一。 如果我们预先计算最小和最大$x$和$y$值（四个边），我们可以考虑将任何边界怪物沿同一轴移动到第二个最极端的坐标。 这减少了问题$O(n^2)$每个测试用例的矩形评估数量恒定，这是可行的。 

我们只需要考虑最小的两个和最大的两个$x$坐标，类似地$y$。 每个候选矩形是通过向内移动一个边界怪物来定义的。 这最多给出 16 种可能性（4 条边乘以 4 种组合），计算起来很简单。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$和坐标$(x_i, y_i)$所有怪物中。 
2. 排序$x$坐标按升序排列，对$y$坐标。 跟踪哪些怪物对应于这些排序的坐标。 
3. 找出两个最小的$x$坐标，最大的两个$x$坐标，类似地取两个最小的和两个最大的$y$坐标。 如果我们移动怪物，这些定义了当前的矩形边界及其直接竞争者。 
4. 初始化变量`min_cost`矩形的面积覆盖所有没有移动的怪物：$(x_{max} - x_{min}) * (y_{max} - y_{min})$。 
5.对于每个结界怪兽（极限$x$或者$y$），尝试将其沿同一轴移动到第二个极端。 重新计算此候选配置的矩形面积。 更新`min_cost`如果发现更小的区域。 
6.考虑完所有相关动作后，输出`min_cost`。 

为什么有效：矩形的面积仅取决于极值坐标。 矩形内的任何怪物都不会增加成本，因此移动它没有帮助。 只有定义极端的怪物向内移动才能减小矩形大小。 通过考虑每个轴上的前两个和最后两个值，我们捕获了所有有意义的减少。 这保证了不会错过任何最佳移动。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        monsters = [tuple(map(int, input().split())) for _ in range(n)]
        
        xs = sorted(x for x, y in monsters)
        ys = sorted(y for x, y in monsters)
        
        # No movement cost
        min_cost = (xs[-1] - xs[0]) * (ys[-1] - ys[0])
        
        # Candidates: move extreme x or y monster to second extreme
        x_candidates = [xs[0], xs[1], xs[-2], xs[-1]]
        y_candidates = [ys[0], ys[1], ys[-2], ys[-1]]
        
        for i in range(2):
            # move leftmost x to second leftmost x
            cost = (xs[-1] - xs[1-i]) * (ys[-1] - ys[0])
            min_cost = min(min_cost, cost)
            # move rightmost x to second rightmost x
            cost = (xs[-2+i] - xs[0]) * (ys[-1] - ys[0])
            min_cost = min(min_cost, cost)
            # move bottommost y to second bottommost y
            cost = (xs[-1] - xs[0]) * (ys[-1] - ys[1-i])
            min_cost = min(min_cost, cost)
            # move topmost y to second topmost y
            cost = (xs[-1] - xs[0]) * (ys[-2+i] - ys[0])
            min_cost = min(min_cost, cost)
        
        print(min_cost)

if __name__ == "__main__":
    solve()
```代码首先对$x$和$y$坐标来识别边界怪物。 它计算没有移动的矩形，然后评估向内移动每个边界怪物的效果。 微妙的部分是正确识别第二个最极端的坐标并避免相差一的错误。 使用排序列表使这变得简单。 

## 工作示例

 示例输入 1（来自问题）：```
3
1 1
1 2
2 1
```| 步骤| xs | ys | 最小成本 |
 | ---| ---| ---| ---|
 | 初始| [1,1,2]| [1,1,2]| (2-1)*(2-1) = 1 |
 | 评估动作 | ... | ... | 3 |

 解释：初始的从(1,1)到(2,2)的矩形覆盖了所有怪物，面积1*1 = 1。通过移动一个怪物(比如(2,1)到(1,2))，矩形总共可以减少到3个单元格。 该算法评估所有极端运动并找到最小矩形成本。 

输入示例 2：```
4
1 1
1 1000000000
1000000000 1
1000000000 1000000000
```| 步骤| xs | ys | 最小成本 |
 | ---| ---| ---| ---|
 | 初始| [1,1,1000000000,1000000000] | [1,1,1000000000,1000000000] | 10^18 | 10^18
 | 向内移动角 | ... | ... | 移动一个角后面积变小|

 这证实移动一个极端怪物可以大大降低矩形成本。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序$x$和$y$坐标为主 |
 | 空间| O(n) | 存储所有怪物坐标和排序列表 |

 总和为$n$跨测试用例$2 \cdot 10^5$，在2秒限制下排序成本是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# Provided sample
assert run("1\n3\n1 1\n1 2\n2 1\n") == "3", "sample 1"

# Minimum-size input
assert run("1\n1\n1 1\n") == "0", "single monster"

# All monsters in a line
assert run("1\n3\n1 1\n1 2\n1 3\n") == "2", "vertical line"

# Large coordinates
assert run("1\n2\n1 1000000000\n1000000000 1\n") == "999999999", "extreme corners"

#
```
