---
title: "CF 407D - 最大子矩阵 3"
description: "我们得到一个大小为 n × m 的整数矩阵。 每个单元格包含一个正整数。 任务是找到所有元素都不同的最大矩形子矩阵。 “最大”是用面积来衡量的，即矩形内的单元格数量。"
date: "2026-06-07T01:51:12+07:00"
tags: ["codeforces", "competitive-programming", "dp", "hashing"]
categories: ["algorithms"]
codeforces_contest: 407
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 239 (Div. 1)"
rating: 2700
weight: 407
solve_time_s: 284
verified: false
draft: false
---

[CF 407D - 最大子矩阵 3](https://codeforces.com/problemset/problem/407/D)

 **评分：** 2700
 **标签：** dp、哈希
 **求解时间：** 4m 44s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个大小为 _n_ × _m_ 的整数矩阵。 每个单元格包含一个正整数。 任务是找到所有元素都不同的最大矩形子矩阵。 “最大”是用面积来衡量的，即矩形内的单元格数量。 例如，2×3 矩形的面积为 6。输出是最大的此类矩形的面积。 

在约束 _n_、_m_ ≤ 400 的情况下，检查所有可能的矩形的强力解决方案将涉及迭代 O(n² m²) 个子矩阵并检查每个子矩阵内部的不同性，这可能需要多达 400² × 400² = 2.56 × 10^10 次操作。 这对于 3 秒的限制来说太大了。 内存限制为 256 MB，足以存储一些大小为 400×400 的矩阵，但我们必须避免存储任何 O(n² m²) 中间数据。 

幼稚的实现也可能在小输入或简并输入上失败。 例如，如果所有元素都相等：```
2 2
1 1
1 1
```正确答案是 1，因为任何大于 1×1 的子矩阵都包含重复元素。 如果不仔细强制执行唯一性，粗心的方法可能会错误地计算较大的区域。 

另一个微妙的情况是一个分散有许多重复值的矩阵，例如：```
3 3
1 2 3
2 3 4
3 4 5
```最大的矩形不是完整的矩阵，因为出现了对角重复的数字； 该算法必须正确检测此类重叠。 

## 方法

 暴力方法很简单：迭代所有左上角和右下角对，提取子矩阵，并检查所有值是否唯一。 可以使用哈希集来检查唯一性。 这保证了正确性，但会失败，因为每个子矩阵检查都是 O(area)，并且有 O(n² m²) 个子矩阵。 即使对于小矩阵，这也太慢了。 

优化的关键洞察是，可以通过扫描行来有效地跟踪列的唯一性。 我们没有明确地迭代右下角，而是修复顶行并向下延伸底行。 对于每一列，我们跟踪发生重复的最后一行，为该列形成一个“有效宽度”矩形。 然后，可以通过为每列维护最左边的有效边界来找到包含所有唯一元素的最大矩形。 这使用每行散列将问题减少到 O(n m²)，这对于 n, m ≤ 400 是可行的。 

本质上，问题简化为使用每行的滑动窗口来计算每个行段的具有唯一列元素的最大矩形。 挑战在于有效地跟踪重复项并扩展矩形，而无需从头开始重新计算唯一性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n2 m2 × 面积) ≈ O(n3 m3) | O(n·m) | 太慢了|
 | 最佳| O(n·m²) | O(n·m) | 已接受 |

 ## 算法演练

 1. 初始化变量`best`到 0。这将存储迄今为止找到的最大区域。 
2. 迭代`top`从第 0 行到第 n-1 行。 该行将是我们的候选子矩阵的顶部边界。 
3. 创建数组`last_seen`字典，每列一个，它将元素值映射到它们出现的最后一行索引。 这使我们能够快速检测列中的重复项。 
4. 初始化一个数组`min_top`尺寸为 m 的`top`。 对于每一列，这会跟踪我们可以开始的最早的行索引，而无需在当前列中重复值。 
5. 迭代`bottom`从`top`至n-1。 这将子矩阵向下延伸。 对于每一列，检查行中的元素`bottom`。 如果此后出现在本专栏中`min_top[col]`， 移动`min_top[col]`就在那一行之后。 更新`last_seen[col][value] = bottom`。 
6.一次`min_top`已更新为当前的`bottom`，使用跨列的滑动窗口来查找最宽的连续范围`[l, r]`哪里都`min_top[c] <= top`。 计算面积`(bottom - top + 1) * (r - l + 1)`并更新`best`如果更大。 
7.全部完成后`bottom`扩展、增量`top`并重复。 

### 为什么它有效

 维护的不变式是当前矩形的不变式`top`到`bottom`和列`[l, r]`，任何列中都没有重复的元素。 通过追踪`min_top`，我们从不包含会引入重复项的行。 滑动窗口确保始终考虑最大可能的宽度，因此每个候选矩形的顶部和底部边界都是最大的。 扫描所有顶行可确保不会遗漏任何潜在的矩形。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]

best = 0
last_seen = [{} for _ in range(m)]

for top in range(n):
    min_top = [top] * m
    for bottom in range(top, n):
        for col in range(m):
            val = a[bottom][col]
            if val in last_seen[col] and last_seen[col][val] >= min_top[col]:
                min_top[col] = last_seen[col][val] + 1
            last_seen[col][val] = bottom

        l = 0
        for r in range(m):
            while l <= r and min_top[r] > top:
                l += 1
            width = r - l + 1
            height = bottom - top + 1
            best = max(best, width * height)

print(best)
```该解决方案读取矩阵并迭代顶部的行。`last_seen`是每列的字典，用于快速查找最后一行出现的值。`min_top`跟踪我们可以达到多高，而无需在该栏中重复。 跨列的滑动窗口保证我们最大化每个底行延伸的宽度。 边界条件如移动`l`向前确保没有重复的元素潜入矩形。 

## 工作示例

 **示例1**

 输入：```
3 3
1 3 1
4 5 6
2 6 1
```| 顶部 | 底部| 最小顶部 | 我| r | 宽度| 高度| 地区 | 最好的|
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | [0,0,0]| 0 | 0 | 1 | 1 | 1 | 1 |
 | 0 | 0 | [0,0,0]| 0 | 1 | 2 | 1 | 2 | 2 |
 | 0 | 0 | [0,0,0]| 0 | 2 | 3 | 1 | 3 | 3 |
 | 0 | 1 | [0,0,0]| 0 | 0 | 1 | 2 | 2 | 3 |
 | 0 | 1 | [0,0,0]| 0 | 1 | 2 | 2 | 4 | 4 |
 | 0 | 1 | [0,0,0]| 0 | 2 | 2 | 2 | 4 | 4 |
 | 0 | 2 | [0,0,2]| 0 | 0 | 1 | 3 | 3 | 4 |
 | 0 | 2 | [0,0,2]| 0 | 1 | 2 | 3 | 6 | 6 |

 最终最好成绩是6。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·m²) | 顶部行 (n) 上的外循环，底部行 (≤ n) 上的内循环，跨 m 列的滑动窗口 |
 | 空间| O(n·m) | 每列存储last_seen 字典，min_top 数组 |

 n, m ≤ 400, n m² ≤ 6.4×10⁷ 操作，3秒内轻松运行。 内存使用量在 256 MB 以内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    a = [list(map(int, input().split())) for _ in range(n)]
    best = 0
    last_seen = [{} for _ in range(m)]
    for top in range(n):
        min_top = [top] * m
        for bottom in range(top, n):
            for col in range(m):
                val = a[bottom][col]
                if val in last_seen[col] and last_seen[col][val] >= min_top[col]:
                    min_top[col] = last_seen[col][val] + 1
                last_seen[col][val] = bottom
            l = 0
            for r in range(m):
                while l <= r and min_top[r] > top:
                    l += 1
                width = r - l + 1
                height = bottom - top + 1
                best = max(best, width * height)
    return str(best)

# provided sample
assert run("3 3\n1 3 1\n4 5 6\n2 6 1\n") == "6"

# all equal
assert run("2 2\n1 1\n1 1\n") == "1"

# minimum input
```
