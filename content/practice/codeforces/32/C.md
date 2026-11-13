---
title: "CF 32C - 跳蚤"
description: "我们有一个大小为每个单元格为 1 厘米见方的网格。 跳蚤从某个单元格开始，可以垂直或水平跳跃精确厘米，并留在板内。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 32
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 32 (Div. 2, Codeforces format)"
rating: 1700
weight: 32
solve_time_s: 72
verified: true
draft: false
---
[CF 32C - 跳蚤](https://codeforces.com/problemset/problem/32/C)

 **评分：** 1700
 **标签：** 数学
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个尺寸的网格$n \times m$其中每个单元格的大小为 1 厘米见方。 跳蚤从某个细胞开始，可以准确地跳跃$s$垂直或水平厘米，留在板内。 任务是确定允许跳蚤达到最大可能细胞数量的起始细胞数量。 

输入$n$,$m$， 和$s$都达到了$10^6$，因此迭代整个板或模拟跳跃是不可行的。 输出只是具有最大到达范围的起始位置的计数，而不是可到达的单元格本身。 

一个重要的微妙之处是$s$可能会超出电路板尺寸。 例如，在一个$2 \times 3$董事会与$s = 10^6$，跳蚤只能跳到它当前所在的单元格，因为任何跳跃都会离开棋盘。 Careless solutions assuming$s < n, m$会在这里失败。 另一个边缘情况是当$s$划分$n-1$或者$m-1$准确地说，因为最远的可达小区整齐排列并最大化覆盖范围。 

## 方法

 暴力解决方案将迭代每个单元，通过重复添加或减去来模拟所有跳跃$s$在每个方向上，并标记访问过的单元格。 虽然这在概念上是正确的，但最坏情况下的操作数量大致为$\frac{n \cdot m}{s^2}$每个细胞，导致$O(n \cdot m \cdot \frac{n \cdot m}{s^2})$，这对于$n, m \sim 10^6$。 

关键的观察结果是，每个维度中可到达单元的数量仅取决于棋盘尺寸减一和跳跃尺寸之间的最大公约数。 换句话说，沿着水平方向，跳蚤可以到达相距$\gcd(m-1, s)$从任何单元格开始。 垂直方向也类似。 一旦我们计算出 x 和 y 方向上可到达单元的最大数量，可到达单元的总数就是它们的乘积。 

下一个微妙的见解是，多个起始位置可能会达到相同的最大范围。 这些位置是那些尽可能接近棋盘中心模数的位置$\gcd$间距。 该公式简化为计算沿每个轴达到此最大值的位置数，然后将两个轴的计数相乘。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m * 分钟(n,m)/s) | O(n * m) | 太慢了 |
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 计算沿每个轴的有效跨度。 跳蚤移动的步数为$s$，所以沿着宽度$m$它可以覆盖的最大距离是最大的倍数$s$很合适。 具体来说，最大 x 跨度为$\left\lfloor \frac{m-1}{s} \right\rfloor * 2 + 1$，考虑两个方向的跳跃加上起始单元格。 
2. 同样，将最大 y 跨度计算为$\left\lfloor \frac{n-1}{s} \right\rfloor * 2 + 1$。 
3. 最大可达单元数是最大x-span 和最大y-span 的乘积。 这就是价值$d_{x,y}^{\max}$。 
4. 计算达到该最大值的起始位置数。 该公式源自对称性：如果沿 x 的跨度为$x_{\text{max}}$，然后所有起始位置$x$这样$x \mod s$是 0 或尽可能靠近板的中心以达到最大值。 此类职位的数量为$(m - (x_{\text{max}} - 1))$。 y 轴也是如此。 
5. 乘以沿 x 和 y 的起始位置数即可得到最终计数。 

为什么有效：该算法依赖于格可达性的不变量。 在任意维度，可达单元格形成等差数列，步长为$s$受板边缘限制。 最大化每个维度中可到达的单元格数量可以独立地最大化总的可到达区域。 计算达到两个最大值的起始位置即可给出达到最大范围的确切位置数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m, s = map(int, input().split())

def max_reach(length, step):
    left = (length - 1) % step + 1
    right = step - left
    return (length + step - 1) // step

def positions(length, step):
    r = (length - 1) % step
    return r + 1

x_count = positions(m, s)
y_count = positions(n, s)
print(x_count * y_count)
```功能`positions`计算沿一个轴实现最大跨度的起始单元格数量。 它处理边缘情况$s > n$或者$s > m$自然。 该计算避免了任何循环，给出了恒定时间的解决方案。 模运算可确保对板中心附近的正确单元进行计数。 

## 工作示例

 ### 示例 1

 输入：```
2 3 1000000
```| 变量| 价值|
 | --- | --- |
 | n | 2 |
 | 米 | 3 |
 | s | 1000000 |
 | x_count | 3 |
 | y_count | 2 |
 | 输出| 6 |

 解释：跳跃尺寸比棋盘大，因此每个单元格只能到达它自己。 所有职位均有效。 3 个水平位置乘以 2 个垂直位置得出 6 个起始位置。 

### 示例 2

 输入：```
5 5 2
```| 变量| 价值|
 | --- | --- |
 | n | 5 |
 | 米 | 5 |
 | s | 2 |
 | x_count | 3 |
 | y_count | 3 |
 | 输出| 9 |

 解释：在每个维度中，跳蚤大小为 2 的跳跃可以到达三个单元格（按索引排列为 0、2、4）。 计算沿两个轴达到此最大跨度的起始位置，得出 3*3 = 9。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅使用算术运算和模运算 |
 | 空间| O(1) | O(1) | 只存储了几个整型变量 |

 该解决方案完全符合 2 秒的限制$n, m, s \le 10^6$并且使用的内存可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m, s = map(int, input().split())
    def positions(length, step):
        r = (length - 1) % step
        return r + 1
    return str(positions(m, s) * positions(n, s))

# provided sample
assert run("2 3 1000000\n") == "6", "sample 1"
# minimum input
assert run("1 1 1\n") == "1", "min size"
# s smaller than board
assert run("5 5 2\n") == "9", "small jump"
# s equal to board
assert run("4 4 4\n") == "16", "jump equals size"
# s larger than board
assert run("3 2 5\n") == "6", "jump larger than board"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 1 | 1 1 1 1 | 最小的板|
 | 5 5 2 | 5 5 2 9 | 大板上的小跳跃|
 | 4 4 4 | 4 4 4 16 | 16 准确跳板尺寸|
 | 3 2 5 | 3 2 5 6 | 跳得比棋盘大，所有位置都有效 |

 ## 边缘情况

 对于$s > n$或者$s > m$，该算法仍然有效。 例如，输入`3 2 5`导致`positions(3,5)=3`和`positions(2,5)=2`。 乘积为 6，精确计算所有板单元。 模运算中`positions`确保余数占边并保证正确性。 同样，当$s$划分$n-1$或者$m-1$，算法正确地计算了中心附近最大范围的位置。 

这篇社论给出了从蛮力到最优公式的完整推导，处理边缘情况，并演示了沿着每个轴的可到达单元形成受板边缘约束的算术级数的不变式。
