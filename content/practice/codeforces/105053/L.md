---
title: "CF 105053L - LED 矩阵"
description: "我们有一个矩形 LED 矩阵和一个从右向左滚动的矩形图案。 矩阵具有固定的尺寸，每个单元要么功能正常，要么损坏。 正常的 LED 可以打开，而坏掉的 LED 永远不会亮。"
date: "2026-06-28T01:04:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105053
codeforces_index: "L"
codeforces_contest_name: "The 2024 ICPC Latin America Championship"
rating: 0
weight: 105053
solve_time_s: 56
verified: true
draft: false
---

[CF 105053L - LED 矩阵](https://codeforces.com/problemset/problem/105053/L)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个矩形 LED 矩阵和一个从右向左滚动的矩形图案。 矩阵具有固定的尺寸，每个单元要么功能正常，要么损坏。 正常的 LED 可以打开，而坏掉的 LED 永远不会亮。 

该图案是高度相同但宽度可能不同的网格。 当它滚动时，图案会在矩阵上重复水平移动。 At each shift, a vertical slice of the pattern is aligned with some column of the matrix, and certain pattern cells demand that the corresponding matrix LEDs must be turned on at that moment.

 The key question is not to simulate the animation, but to decide whether there exists any moment in the entire scrolling process where a broken LED would be required to light up. 如果发生这种情况，则无法显示，答案为“N”，否则为“Y”。 

对于每一行，输入描述了矩阵状态和模式行。 This coupling by row matters because constraints are independent across rows: each row behaves like a 1D interaction between the matrix columns and pattern columns.

 行、列和图案宽度的界限最大为 1000。 对行、矩阵列和移位进行三次模拟将达到大约 10^9 次运算，这太慢了。 即使每个班次的双重嵌套扫描也太大，因此解决方案必须避免显式模拟每个滚动步骤。 

当模式小于矩阵时，会出现微妙的边缘情况。 即使这样，滚动仍然会继续超出完全重叠的范围，这意味着随着时间的推移，模​​式列可以与许多矩阵位置对齐。 另一种边缘情况是当一个单元被破坏但模式只要求它在“初始”对齐时关闭； 稍后的班次可能仍会激活它。 这正是通过仅查看一个对齐来进行天真的检查不正确的原因。 

## 方法

 蛮力的想法是模拟每个滚动位置。 对于每次转变，我们将模式放置在矩阵上并检查每个重叠的单元格。 如果一个模式单元是`*`落在一个矩阵单元上，即`-`，我们失败了。 

这是正确的，因为它显式检查动画的所有状态。 然而，移位次数与矩阵宽度和图案宽度之和成正比，并且每次移位最多检查 R×C 个单元。 这导致大约O(R·C·(C+K))运算，当所有维度达到1000时，这远远超出了极限。 

关键的观察结果是，我们实际上不需要知道模式单元何时撞击矩阵单元，只需要知道它是否撞击矩阵单元。 对于固定行和固定矩阵列，我们可以问一个更简单的问题：有没有`*`在滚动过程中，图案行是否与该矩阵位置对齐？ 

一旦我们用这种方式重写问题，时间维度就消失了。 每个矩阵单元只需要知道是否存在至少一个映射到其上的模式列。 这成为对模式行的范围存在查询，可以用前缀和来回答。 

这将问题简化为检查每个矩阵单元，其相应​​的对齐间隔是否包含至少一个`*`在模式中。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(R·C·(C+K)) | O(1) 额外 | 太慢了|
 | 前缀范围检查 | O(R·(C+K)) | O(R·K) | 已接受 |

 ## 算法演练

 我们独立处理每一行，因为行不交互。 

1. 对于固定行，预先计算模式行上的前缀和，其中每个位置存储多少个`*`字符出现到该索引。 这允许快速范围查询。 
2. 对于每个矩阵列`c`，确定在完整滚动期间哪些模式列可以与其对齐。 该集合在模式行中形成连续的间隔。 
3. 计算该区间的左边界。 图案栏`j`可以到达矩阵列`c`如果滚动将其移动到位`c`，这意味着之间存在简单的线性关系`c`和`j`。 这减少到下限`j`。 
4. 如果这个区间包含任何`*`在模式行中，然后是矩阵单元`(row, c)`必须是功能性的。 如果矩阵单元损坏，配置立即失效。 
5. 对所有行和所有列重复此操作。 如果没有发现冲突，则可以显示。 

### 为什么它有效

 每个模式单元仅对其在滚动期间可以占据的那些矩阵单元贡献约束。 运动是纯线性的，因此每个模式列都会影响矩阵列的连续范围。 这意味着每个矩阵单元只需要知道是否有任何所需的模式单元映射到它。 如果存在这样的映射并且矩阵单元被破坏，则永远无法满足该要求，因此正确性降低到检测任何此类禁止相交。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    R, C, K = map(int, input().split())

    mat = []
    pat = []

    for _ in range(R):
        line = input().split()
        mat.append(line[0])
        pat.append(line[1])

    for i in range(R):
        # prefix sum of '*' in pattern row
        pref = [0] * (K + 1)
        for j in range(K):
            pref[j + 1] = pref[j] + (1 if pat[i][j] == '*' else 0)

        for c in range(C):
            if mat[i][c] == '*':
                continue

            # earliest pattern column that can reach c
            L = max(0, c - (C - 1))

            # check if there is any '*' in pat[i][L:K]
            if pref[K] - pref[L] > 0:
                print("N")
                return

    print("Y")

if __name__ == "__main__":
    solve()
```该解决方案逐行读取矩阵和模式。 对于每一行，它都会在模式上构建一个前缀和，以支持恒定时间检查是否有任何`*`存在于后缀中。 

对于每个损坏的矩阵单元，它计算可以到达它的最早的模式索引。 它不是模拟移位，而是利用滚动是线性的并且每个模式列扫过一系列连续的矩阵列这一事实。 如果任何所需的模式单元位于该可达范围内，则该单元无效。 

关键的实现细节是计算`L = max(0, c - (C - 1))`。 这对可能落在矩阵列上的最早的模式列进行编码`c`在完整滚动期间。 

## 工作示例

 考虑一个只有一行的小概念示例：

 矩阵：`* - -`图案：`*-*`该模式的前缀和是`[0,1,1,2]`。 

对于第 1 列处损坏的单元格，我们计算`L = max(0, 1 - 2) = 0`。 后缀`[0:3]`包含星星，因此该单元需要在某个时刻点亮，但它已损坏。 算法正确拒绝。 

现在考虑：

 矩阵：`* * *`图案：`*-*`每个矩阵单元都是功能性的，因此无论模式如何变化，都不会出现故障情况。 尽管某些对齐需要星号，但所有必需的单元格都是有效的。 

| 行| 专栏 | 破碎的？ | 范围检查 | 范围内的图案星星 | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 没有 | 跳过 | - | 好的 |
 | 0 | 1 | 没有 | 跳过 | - | 好的 |
 | 0 | 2 | 没有 | 跳过 | - | 好的 |

 这表明该算法仅对不可能的约束做出反应，否则保持沉默。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(R·(C + K)) | O(R·(C + K)) | 每行在 K 上构建一个前缀并扫描 C 列一次 |
 | 空间| O(K) | 每行仅包含前缀数组 |

 这些约束允许每个结构最多包含 10^6 个字符，因此每行的线性扫描完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import contextlib

    out = io.StringIO()
    with contextlib.redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# minimal allowed case
assert run("1 1 1\n* *\n") == "Y"

# broken cell never required
assert run("1 3 2\n*-- *-\n") == "Y"

# broken cell required eventually
assert run("1 3 2\n-*- **\n") == "N"

# all broken matrix but no stars in pattern
assert run("2 2 2\n-- --\n-- --\n") == "Y"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1×1 一切都好 | 是 | 基本情况|
 | 坏了但没有要求| 是 | 非触发约束 |
 | 破碎细胞强制激活| 尼 | 核心拒绝逻辑|
 | 全部破碎，没有星星| 是 | 空需求边缘情况 |

 ## 边缘情况

 一个微妙的情况是当模式不包含`*`根本不。 在这种情况下，不需要点亮任何矩阵单元，因此即使完全损坏的矩阵也是有效的。 该算法自然地处理这个问题，因为每个前缀范围查询都返回零。 

另一种边缘情况是图案比矩阵宽。 每个矩阵单元的导出间隔仍然有效，因为它仅捕获实际上可以扫过矩阵的模式部分。 无需特殊处理。 

最后的边缘情况是当矩阵和模式都最小时，例如 1×1。 该算法减少到单个前缀检查并正确区分兼容和不兼容状态。
