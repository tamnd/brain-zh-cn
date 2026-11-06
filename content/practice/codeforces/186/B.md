---
title: "CF 186B - 种植蘑菇"
description: "我们举办了一场蘑菇种植比赛，分为两个阶段，中间有休息。 每个参与者都有两种速度，问题是我们不知道他们使用它们的顺序。 在长度为 t1 的第一阶段，蘑菇以单一速度生长。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 186
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 118 (Div. 2)"
rating: 1200
weight: 186
solve_time_s: 161
verified: true
draft: false
---

[CF 186B - 种植蘑菇](https://codeforces.com/problemset/problem/186/B)

 **评分：** 1200
 **标签：** 贪心，排序
 **求解时间：** 2m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们举办了一场蘑菇种植比赛，分为两个阶段，中间有休息。 每个参与者都有两种速度，问题是我们不知道他们使用它们的顺序。 在长度为 _t1_ 的第一阶段，蘑菇以单一速度生长。 休息后，蘑菇高度缩小了百分之_k_。 然后，在长度_t2_的第二阶段，蘑菇以第二速度生长。 每个参与者选择两个速度的顺序，以最大化最终的蘑菇高度。 我们的任务是计算所有参与者的最终身高并按从最高到最低的顺序打印它们。 如果两个蘑菇高度相等，则指数较小的参与者先行。 

输入给出_n_、参与者数量、持续时间_t1_和_t2_以及减少百分比_k_。 然后给出每个参与者的两个速度_a_i_和_b_i_。 输出是每个参与者的最大最终高度，四舍五入到小数点后两位，按所述排序。 

约束很小：_n_、_t1_、_t2_ 都最多为 1000，速度最多为 1000。这意味着我们可以轻松地进行 O(n) 或 O(n log n) 计算。 我们必须小心浮点运算，因为增长涉及百分比减少，这不是整数运算。 

可能棘手的边缘情况包括两个速度相等的参与者，其中任一顺序产生相同的结果，或极端的 _k_ 值，例如 100% 减少，这将完全消除第一阶段。 

## 方法

 蛮力方法很简单：对于每个参与者，尝试两种可能的速度顺序，计算每个顺序的最终蘑菇高度，并取最大值。 具体来说，要比较的两个高度是：```
h1 = a_i * t1 * (1 - k/100) + b_i * t2
h2 = b_i * t1 * (1 - k/100) + a_i * t2
```最大为`h1`和`h2`是该参与者的最佳身高。 这是可行的，因为参与者的数量很少，并且每次计算都是恒定时间，给出了 O(n) 解决方案。 计算身高后，我们按身高降序对参与者进行排序，如果出现平局则按指数升序对参与者进行排序。 

更快或更干净的实施的关键见解是我们不需要探索任何其他组合。 每个参与者只有两种速度，并且只有两个订单，因此不可能进一步优化。 随后的排序是标准的，可确保结果表中的正确排序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n log n) | O(n log n) | O(n) | 已接受 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 排序的时间复杂度为 O(n log n)，它主导了高度的线性 O(n) 计算。 

## 算法演练

 1.读取参加人数`n`, 两个持续时间`t1`和`t2`，以及断裂减少`k`。 将缩减因子存储为小数`r = (100 - k)/100`以简化计算。 
2.初始化一个空列表`results`将存储元组`(participant_index, max_height)`。 
3. 迭代每个参与者。 读取他们的两个速度`a`和`b`。 
4. 如果参与者使用`a`首先，然后`b`:`h1 = a * t1 * r + b * t2`。 
5. 如果参与者使用`b`首先，然后`a`:`h2 = b * t1 * r + a * t2`。 
6. 采取`max(h1, h2)`作为参与者的最佳蘑菇高度。 
7. 追加`(participant_index, max_height)`到`results`。 
8、处理完所有参与者后，排序`results`首先由`-max_height`（降序）然后通过`participant_index`（升序）解决关系。 
9. 打印每个参与者的索引和身高，格式精确到小数点后两位。 

为什么它有效：不变的是，对于每个参与者，我们已经探索了他们两种速度的所有可能顺序。 最大高度保证是正确的。 之后排序可确保正确的排名，尊重平局规则。 没有任何组合被遗漏，算术准确地反映了比赛规则。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, t1, t2, k = map(int, input().split())
r = (100 - k) / 100  # reduction factor

results = []

for i in range(1, n + 1):
    a, b = map(int, input().split())
    h1 = a * t1 * r + b * t2
    h2 = b * t1 * r + a * t2
    max_height = max(h1, h2)
    results.append((i, max_height))

# sort by height descending, then index ascending
results.sort(key=lambda x: (-x[1], x[0]))

for idx, height in results:
    print(f"{idx} {height:.2f}")
```该代码完全遵循算法步骤。 预先计算缩减因子以避免重复除法。 高度存储为浮点数以保持乘以后的精度`r`。 排序使用 lambda 函数按高度降序排序，并按参与者索引升序排序。 

## 工作示例

 输入示例 1：```
2 3 3 50
2 4
4 2
```| 参与者 | 一个 | 乙| h1 = a_t1_r + b*t2 | h1 = a_t1_r + b*t2 | h2 = b_t1_r + a*t2 | h2 = b_t1_r + a*t2 | 最大高度 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 4 | 2_3_0.5 + 4*3 = 3 + 12 = 15 | 4_3_0.5 + 2*3 = 6 + 6 = 12 | 15 | 15
 | 2 | 4 | 2 | 4_3_0.5 + 2*3 = 6 + 6 = 12 | 2_3_0.5 + 4*3 = 3 + 12 = 15 | 15 | 15

 按高度降序排序后，然后索引升序：```
1 15.00
2 15.00
```这表明该算法正确地评估了两种排序并应用了中断减少。 

自定义输入2：```
3 2 4 25
5 5
6 3
2 8
```| 参与者 | h1 | 小时2 | 最大高度 |
 | --- | --- | --- | --- |
 | 1 | 5_2_0.75 + 5*4 = 7.5 + 20 = 27.5 | 相同 = 27.5 | 27.5 | 27.5
 | 2 | 6_2_0.75 + 3*4 = 9 + 12 = 21 | 3_2_0.75 + 6*4 = 4.5 + 24 = 28.5 | 28.5 | 28.5
 | 3 | 2_2_0.75 + 8*4 = 3 + 32 = 35 | 8_2_0.75 + 2*4 = 12 + 8 = 20 | 35 | 35

 排序结果：```
3 35.00
2 28.50
1 27.50
```这说明每个参与者的最优选择并不总是“速度较大第二”； 这取决于持续时间和缩减系数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 计算每个参与者的两个高度是 O(1)，对于 n 个参与者则为 O(n)。 对结果进行排序的时间复杂度为 O(n log n)。 |
 | 空间| O(n) | 我们存储每个参与者的最大高度和指数。 |

 问题约束允许 n 最大为 1000，因此 O(n log n) 完全在 2 秒限制内。 对于这些界限来说，乘法和浮点运算的时间成本可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    # solution
    n, t1, t2, k = map(int, input().split())
    r = (100 - k) / 100
    results = []
    for i in range(1, n + 1):
        a, b = map(int, input().split())
        h1 = a * t1 * r + b * t2
        h2 = b * t1 * r + a * t2
        results.append((i, max(h1, h2)))
    results.sort(key=lambda x: (-x[1], x[0]))
    for idx, height in results:
        print(f"{idx} {height:.2f}")
    return out.getvalue().strip()

# Provided sample
assert run("2 3 3 50\n2 4\n4 2\n") == "1 15.00\n2 15.00", "sample 1"

# Minimum size
assert run("1 1 1 1\n1 1\n") == "1 1.99", "min size"

# All speeds equal
assert run("2 5 5 50\n10 10\n10 10
```
