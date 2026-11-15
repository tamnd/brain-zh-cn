---
title: "CF 50D - 轰炸"
description: "我们给出了一组敌人对象，每个对象都有一个固定的二维坐标和一个固定的攻击点。 目标是确定核弹头的最小撞击半径，使得未能使至少 K 个这些物体失活的概率最多为每密耳 ε。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "dp", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 50
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 47"
rating: 2100
weight: 50
solve_time_s: 102
verified: false
draft: false
---

[CF 50D - 轰炸](https://codeforces.com/problemset/problem/50/D)

 **评分：** 2100
 **标签：** 二分查找、dp、概率
 **求解时间：** 1m 42s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了一组敌人对象，每个对象都有一个固定的二维坐标和一个固定的攻击点。 目标是确定核弹头的最小撞击半径，使得无法停用的概率至少为`K`这些物体的最大 ε 每密耳。 建筑物被摧毁的概率取决于其距打击点相对于炸弹半径的距离：半径内的建筑物总是被摧毁，而半径外的建筑物根据指数衰减公式概率被摧毁。 

输入提供`N`对象（最多 100 个），必需的目标`K`(≤ N)，失败阈值`ε`（1 ≤ ε ≤ 999 每密耳，即概率高达 0.999）、打击坐标和物体坐标。 输出是表示最小半径的单个浮点数。 

约束表明`N`足够小，可以让具有三次或二次复杂度的算法在 2 秒内轻松运行。 距离以 |1000| 为界 在每个坐标中，因此平方距离在整数限制内。 

边缘情况出现时`K = 1`或者`ε = 999`当物体与打击点重叠时。 无法正确处理重叠或极其接近的物体的概率的简单方法可能会低估所需的半径。 例如，对于距撞击点距离为 0 的单个物体，最小半径为 0； 粗心的实现可能会输出负半径或无法收敛。 

## 方法

 蛮力方法是尝试每一个可能的半径，计算所有对象的概率，枚举所有的组合`K`损坏的物体，求失败概率的总和，并检查它是否低于 ε。 这是可行的，因为每个概率都是独立的，但在最坏的情况下它是 O(2^N)，这对于 N = 100 来说是令人望而却步的。 

关键的见解是将问题建模为概率动态规划问题。 每个物体都有一个破坏概率`p_i(R)`作为半径的函数`R`。 让`dp[i][k]`是精确破坏的概率`k`第一个对象`i`对象。 随着复发：```
dp[i+1][k] = dp[i][k] * (1 - p_i) + dp[i][k-1] * p_i
```我们可以计算至少破坏的概率`K`有效地对象。 这允许我们检查给定的半径`R`在 O(N*K) 时间内。 然后我们可以二分查找`R`因为失效概率随着半径的增加而单调递减：较大的半径只会增加破坏概率。 

这大大降低了复杂性：O(N_K_log(max_distance/epsilon))，在 N ≤ 100 的情况下这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^N) | O(2^N) | O(N) | 太慢了|
 | DP + 二分查找 | O(N_K_log(1e6)) | O(N_K_log(1e6)) | O(N*K) | 已接受 |

 ## 算法演练

 1. **预计算距离**：对于每个对象，计算欧氏距离`D_i`到打击点。 距离可以存储为浮点数。 这是必要的，因为破坏概率取决于距离。 
2. **定义概率函数**：对于一个候选半径`R`，计算概率`p_i(R)`那个物体`i`被摧毁了。 如果物体在半径范围内，`p_i = 1`。 否则，使用问题中给出的指数公式进行计算。 
3. **设置DP数组**：设`dp[k]`准确地表示破坏的概率`k`到目前为止所考虑的所有对象。 初始化`dp[0] = 1.0`。 
4. **迭代对象**：对于每个对象，以相反的顺序更新 DP 数组（以避免覆盖值）。 更新公式为：```
dp[k] = dp[k] * (1 - p_i) + dp[k-1] * p_i
```这说明了两种情况：对象没有被破坏，或者它被破坏了。 

1. **检查失败概率**：处理完所有对象后，求和`dp[0]`通过`dp[K-1]`得到至少破坏失败的概率`K`对象。 除以 1000，将 ε 每密耳转换为概率。 
2. **半径二分查找**：初始化`low = 0`,`high = max_distance_possible`（比如 5000），迭代直到差值小于 1e-7。 对于每个中点，计算 DP 并检查失效概率 ≤ ε。 调整`low`或者`high`因此。 
3. **输出**：二分查找后，`low`将收敛到满足概率要求的最小半径。 

**为什么有效**：破坏失败的概率`K`物体随半径单调递减。 DP 正确地解释了被破坏对象的所有子集，而无需显式枚举它们，从而确保了准确的概率计算。 二分搜索利用单调性来找到最小的足够半径。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def bombing():
    N = int(input())
    K, eps = map(int, input().split())
    eps /= 1000  # convert per mils to probability
    X0, Y0 = map(int, input().split())
    objects = [tuple(map(int, input().split())) for _ in range(N)]
    
    def prob(dist, R):
        if dist <= R:
            return 1.0
        else:
            return math.exp(1 - (dist / R) ** 2)
    
    distances = [math.hypot(x - X0, y - Y0) for x, y in objects]
    
    left, right = 0.0, 5000.0
    for _ in range(100):
        mid = (left + right) / 2
        dp = [0.0] * (N + 1)
        dp[0] = 1.0
        for d in distances:
            p = prob(d, mid)
            for k in range(N, 0, -1):
                dp[k] = dp[k] * (1 - p) + dp[k-1] * p
            dp[0] *= (1 - p)
        fail_prob = sum(dp[:K])
        if fail_prob <= eps:
            right = mid
        else:
            left = mid
    print(f"{(left + right) / 2:.12f}")

bombing()
```该代码首先将 ε 每密耳转换为适当的概率。 它预先计算距离以避免重复计算。 DP 反向更新以保留正确的先前值。 二分搜索循环迭代 100 次，这保证了给定问题边界的精度在 1e-6 以内。 

## 工作示例

 ### 示例 1

 输入：```
1
1 500
5 5
1 2
```| 中半径| 物距| p_i | dp[0] | dp[0] | dp[1] | dp[1] | 失败概率|
 | ---| ---| ---| ---| ---| ---|
 | 3.84 | 3.84 5.0 | 0.5 | 0.5 0.5 | 0.5 0.5 | 0.5 0.5 | 0.5

 DP 正确跟踪摧毁 0 和 1 个物体的概率。 二分查找收敛到半径 ≈ 3.842577615187627。 

### 定制样品

 输入：```
3
2 100
0 0
0 0
3 4
6 8
```| 半径| p_i | 3 个物体后的 dp | 失败概率|
 | ---| ---| ---| ---|
 | 5.0 | 1、0.64、0.25 | [0.14,0.36,0.5,0] | 0.14 | 0.14

 该表显示，在半径 5 处，无法停用至少 2 个物体的概率为 0.14 < 0.1，因此我们需要稍大的半径。 DP 正确处理部分概率。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N_K_log(1e6)) | O(N_K_log(1e6)) | 二分查找 ~100 次迭代； 每半径的 DP 为 O(N*K)。 |
 | 空间| O(N*K) | 存储最多 N 个对象和 K 个目标的 DP 数组。 |

 当 N ≤ 100、K ≤ 100 时，该解决方案在 2 秒内即可轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        bombing()
    return f.getvalue().strip()

# provided sample
assert abs(float(run("1\n1 500\n5 5\n1 2")) - 3.842577615187627) < 1e-6, "sample 1"

# minimum size
assert abs(float(run("1\n1 1\n0 0\n0 0")) - 0.0) < 1e-6, "single object at strike"

# all objects same point
assert abs(float(run("3\n2 500\n0 0\n0 0\n0 0\n0 0")) - 0.0) < 1e
```
