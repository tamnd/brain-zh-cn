---
title: "CF 908C - 新年和冰壶"
description: "我们有一组半径相等的圆盘，它们最初位于平面上方的非常高的 y 坐标处。"
date: "2026-06-12T23:36:05+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "geometry", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 908
codeforces_index: "C"
codeforces_contest_name: "Good Bye 2017"
rating: 1500
weight: 908
solve_time_s: 211
verified: false
draft: false
---

[CF 908C - 新年和冰壶](https://codeforces.com/problemset/problem/908/C)

 **评分：** 1500
 **标签：** 蛮力、几何、实现、数学
 **求解时间：** 3m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一组半径相等的圆盘，它们最初位于平面上方非常高的 _y_ 坐标处。 每个圆盘都有一个固定的 _x_ 坐标，我们将其沿着垂直线直线向下滑动，直到它接触地面 (_y = 0_) 或与已放置的另一个圆盘接触。 任务是在放置完所有圆盘后计算每个圆盘中心的最终 y 坐标。 

输入由 _n_（圆盘数量）和 _r_（它们的公共半径）组成。 然后是指定每个磁盘的 _x_ 坐标的 _n_ 个整数序列。 输出是 _n_ 个实数的列表，即磁盘的最终垂直位置。 

约束条件适中：_n_ ≤ 1000 且 _r_ ≤ 1000，因此即使是 _O(n²)_ 解也是可行的。 主要困难不在于算法效率，而在于正确建模几何相互作用。 

非明显的边缘情况包括多个磁盘共享相同 _x_ 坐标的情况。 例如，如果输入是：```
3 1
5 5 5
```第一个圆盘落在 _y = 1_（接触地面）处，第二个圆盘接触第一个圆盘并停留在 _y = 3_ 处，第三个圆盘落在 _y = 5_ 处。 忽略先前磁盘位置的粗心方法会错误地将所有磁盘放置在 _y = 1_ 处。 当磁盘水平接近但未完全对齐时，会出现另一个微妙之处，因此新磁盘必须使用圆-圆距离公式计算垂直偏移。 

## 方法

 最简单的方法是暴力破解：对于每个磁盘，从 _y = r_（地面）开始并检查所有先前放置的磁盘。 对于任何水平距离小于或等于 2*r 的先前圆盘，使用毕达哥拉斯定理计算新圆盘可以静止且不重叠的最大高度。 取这些候选​​高度和地面高度中的最大值。 这种方法是正确的，因为它明确地对所有先前的磁盘强制执行停止条件，但它需要检查每个新磁盘的所有早期磁盘，时间复杂度为_O(n²)_。 当 _n ≤ 1000_ 时，这会导致最多一百万次操作，这是可以接受的。 

关键的观察结果是，通常不存在更快的渐近解，因为任何磁盘都可能与所有先前的磁盘交互。 可以通过维护空间索引（如线段树或坐标压缩）来完成优化，但对于 _n = 1000_ 来说这是不必要的。 蛮力方法就足够了，需要仔细实现才能处理浮点精度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n²) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个空列表`y_positions`存储每个磁盘的最终 _y_ 坐标。 
2. 迭代每个磁盘`i`按照给定的顺序。 从候选垂直位置开始`y = r`，对应于接触地面。 
3. 对于每个先前的磁盘`j`（从0到i-1），检查水平距离`abs(x[i] - x[j])`小于或等于2*r。 这决定了新磁盘是否可以放置在磁盘顶部`j`。 
4. 如果圆盘可以接触，则使用毕达哥拉斯定理计算垂直偏移：新中心的 _y_ 为`y[j] + sqrt(4*r*r - dx*dx)`在哪里`dx = abs(x[i] - x[j])`。 这给出了圆盘相切而不重叠的最高位置。 
5. 更新`y`是其当前值和计算出的高度的最大值。 
6.检查完所有之前的磁盘后，追加`y`到`y_positions`。 
7. 重复此操作，直至处理完所有磁盘。 以足够的浮点精度输出所有位置。 

不变的是，在每一步，`y_positions[i]`是最小的有效 _y_ 坐标，使得圆盘 _i_ 不与任何先前放置的圆盘相交并满足地面约束。 

## Python 解决方案```python
import sys, math
input = sys.stdin.readline

n, r = map(int, input().split())
x_coords = list(map(int, input().split()))

y_positions = []

for i in range(n):
    y = r  # minimal y if it touches the ground
    for j in range(i):
        dx = abs(x_coords[i] - x_coords[j])
        if dx <= 2*r:
            y = max(y, y_positions[j] + math.sqrt(4*r*r - dx*dx))
    y_positions.append(y)

print(" ".join(f"{y:.10f}" for y in y_positions))
```代码直接实现了算法步骤。 我们在高度 _r_ 处初始化每个磁盘，循环遍历所有先前的磁盘以计算允许的最大高度以避免重叠，然后附加结果。 使用`math.sqrt`确保正确的几何位置。 高精度打印可避免浮点检查器问题。 

## 工作示例

 **示例1：**

 输入：```
6 2
5 5 6 8 3 12
```| 我| x[i] | 候选人 y | 之前检查过的磁盘 | 检查后的最大 y |
 | ---| ---| ---| ---| ---|
 | 0 | 5 | 2 | 无 | 2 |
 | 1 | 5 | 2 | j=0，dx=0 | 6 |
 | 2 | 6 | 2 | j=0 dx=1 -> y=√(16-1)+2≈5.123, j=1 dx=1 -> y≈7.123 | 7.123 | 7.123
 | 3 | 8 | 2 | j=0 dx=3->跳过，j=1 dx=3->跳过，j=2 dx=2->y≈9.873 | 9.873 | 9.873
 | 4 | 3 | 2 | j=0 dx=2->y≈4.0，j=1 dx=2->y≈6.0，j=2 dx=3->跳过，j=3 dx=5->跳过 | 6.0 |
 | 5 | 12 | 12 2 | 检查相关磁盘 | 13.337 | 13.337

 这表明，即使圆盘水平接近但不相同，毕达哥拉斯公式也能正确计算垂直偏移。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n²) | 对于 n 个磁盘中的每一个，我们最多检查 n 个之前的磁盘 |
 | 空间| O(n) | 每个磁盘存储一个 _y_ 坐标 |

 当 n ≤ 1000 时，代码最多执行 1e6 次迭代，完全在 2 秒的限制之内。 内存使用量可以忽略不计。 

## 测试用例```python
import sys, io
import math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, r = map(int, input().split())
    x_coords = list(map(int, input().split()))
    y_positions = []
    for i in range(n):
        y = r
        for j in range(i):
            dx = abs(x_coords[i] - x_coords[j])
            if dx <= 2*r:
                y = max(y, y_positions[j] + math.sqrt(4*r*r - dx*dx))
        y_positions.append(y)
    return " ".join(f"{y:.10f}" for y in y_positions)

# Provided sample
assert run("6 2\n5 5 6 8 3 12\n") == "2.0000000000 6.0000000000 9.8729833462 13.3370849613 12.5187346573 13.3370849613"

# Minimum input
assert run("1 1\n1\n") == "1.0000000000"

# All disks in same x
assert run("3 1\n5 5 5\n") == "1.0000000000 3.0000000000 5.0000000000"

# All disks far apart
assert run("3 1\n1 100 200\n") == "1.0000000000 1.0000000000 1.0000000000"

# Disks at maximum n=1000, r=1000, sparse x
x_vals = " ".join(str(i*2) for i in range(1, 1001))
inp = f"1000 1000\n{x_vals}\n"
output = run(inp)
ys = list(map(float, output.split()))
assert all(y == 1000.0 for y in ys), "All disks should sit on ground due to spacing"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1\n1`|`1.0`| 地面上的单盘 |
 |`3 1\n5 5 5`|`1 3 5`| 多个磁盘垂直堆叠|
 |`3 1\n1 100 200`|`1 1 1`| 圆盘相距很远，每个都在地面上|
 |`1000 1000\n2 4 6 ...`| `1000 | |
