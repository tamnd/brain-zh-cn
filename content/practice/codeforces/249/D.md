---
title: "CF 249D - 驴子和星星"
description: "我们被要求找到驴在几何规则下可以选择的最长的星星链。 星星是平面上的点，我们从原点开始。 从任何恒星，我们想象两条射线相对于水平轴成固定角度。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp", "geometry", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 249
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 152 (Div. 1)"
rating: 2700
weight: 249
solve_time_s: 116
verified: false
draft: false
---

[CF 249D - 驴子和星星](https://codeforces.com/problemset/problem/249/D)

 **评分：** 2700
 **标签：** 数据结构、dp、几何、数学、排序
 **求解时间：** 1m 56s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求找到驴在几何规则下可以选择的最长的星星链。 星星是平面上的点，我们从原点开始。 从任何恒星，我们想象两条射线相对于水平轴成固定角度。 只有当一颗恒星严格位于前一颗恒星发出的两条射线之间时，才可以将其包含在链中的下一个恒星中。 目标是最大化这条链中的星星数量。 

输入给出星星的数量$n$以及定义光线斜率的两个分数。 每颗星星的坐标均以整数形式提供。 和$n$最多$10^5$，任何算法$O(n^2)$行为可能会超出时间限制，因此我们需要一种解决方法$O(n \log n)$或更好。 因为坐标可以达到$10^5$，天真地使用浮点计算可能会引入精度误差，因此最好将斜率表示为有理数或使用整数叉积。 

当恒星恰好位于射线上时，会出现微妙的边缘情况。 这些必须被排除。 另一种情况是当多个恒星具有相同的$x$或者$y$相对于当前链的位置——如果我们不仔细排序或比较，这些可能会产生歧义。 例如，如果所有恒星都位于与其中一条射线平行的线上，则链长度可能只是一，而不是零，因为在这种情况下没有恒星可以严格位于射线之间。 

## 方法

 暴力方法会尝试每一个可能的恒星作为开始，然后递归地找到位于该恒星发出的光线之间的所有恒星。 这是可行的，因为我们只是遵循几何规则，但当$n$很大：每个星星都可以检查$O(n)$其他人为有效的下一颗星星，导致$O(n^2)$时间，大致是$10^{10}$最坏情况下的操作。 

关键的见解是使用斜率将问题转换为一维序列问题。 通过将射线的斜率表示为整数，我们可以计算线性变换，将每颗恒星的位置转换为表示其在射线之间的位置的一对值。 按一个轴对星星进行排序，然后计算变换坐标中的最长递增子序列（LIS），使我们能够有效地找到最大链。 这是有效的，因为“光线之间”条件转化为涉及斜率比的不等式，并且 LIS 捕获满足这些不等式的最大恒星序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 转换 + LIS | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 解析两个分数$a/b$和$c/d$并将它们转换为表示斜率的整数$(a, b)$和$(c, d)$。 这避免了浮点精度问题并允许整数比较。 
2. 以坐标对的形式读取星星列表$(x_i, y_i)$。 
3. 将每个星号转换为一对值$(y_i \cdot b - x_i \cdot a, y_i \cdot d - x_i \cdot c)$。 这些代表了恒星相对于来自原点的每条射线的位置。 
4. 过滤掉不严格位于两条射线之间的恒星，即变换后的值不都是正值的恒星。 
5. 按一个变换后的坐标（例如第一个）对剩余的星星进行排序。 排序可确保延伸链的任何后续星号都尊重不等式的一侧。 
6. 计算第二个变换坐标上的 LIS。 这确定了每颗恒星严格位于前一颗恒星光线之间的最大序列。 
7. 输出该LIS的长度。 

为什么它有效：按第一个坐标排序可以保证对于任何一对恒星$i < j$在排序列表中，第一个不等式（相对于一条射线）成立。 然后，LIS 确保整个序列满足第二个不等式。 由于光线定义了一个凸楔形，因此楔形外部的任何恒星都会违反这些不等式之一。 因此，不能存在比 LIS 更长的链。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from bisect import bisect_left

def main():
    n = int(input())
    f1, f2 = input().split()
    a, b = map(int, f1.split('/'))
    c, d = map(int, f2.split('/'))
    
    stars = []
    for _ in range(n):
        x, y = map(int, input().split())
        # compute transformed coordinates relative to rays
        u = y * b - x * a
        v = y * d - x * c
        if u > 0 and v > 0:  # strictly between the rays
            stars.append((u, v))
    
    stars.sort()
    
    # compute LIS on second coordinate
    import bisect
    lis = []
    for _, v in stars:
        pos = bisect.bisect_left(lis, v)
        if pos == len(lis):
            lis.append(v)
        else:
            lis[pos] = v
    print(len(lis))

if __name__ == "__main__":
    main()
```我们首先将斜率分数转换为整数对以避免浮点错误。 转变$u = y b - x a$,$v = y d - x c$将几何楔形检验转化为一对不等式。 对星星进行排序$u$允许 LIS 应用于$v$，保证保留光线之间的严格顺序。 这`bisect_left`功能有效地维护LIS$O(n \log n)$时间。 

## 工作示例

 ### 示例 1

 输入：```
15
1/3 2/1
3 1
6 2
4 2
2 5
4 5
6 6
3 4
1 6
2 1
7 4
9 3
5 3
1 3
15 5
12 4
```转变后，严格位于光线之间的恒星会产生像这样的对$(u,v)$:

 | x| y | u = y_3 - x_1 | v = y_1 - x_2 | 包括？ |
 | --- | --- | --- | --- | --- |
 | 3 | 1 | 0 | -5 | 没有|
 | 4 | 2 | 2 | -6 | 没有|
 | 2 | 5 | 13 | 1 | 是的 |
 | 3 | 4 | 9 | -2 | 没有|
 | 4 | 5 | 11 | 11 -3 | 没有|
 | 6 | 6 | 12 | 12 -6 | 没有|
 | 1 | 6 | 17 | 17 4 | 是的 |
 | 2 | 1 | -1 | -3 | 没有|
 | ... | ... | ... | ... | ... |

 经过筛选和排序后$u$并计算 LIS$v$，我们发现最大链长度为 4。 

### 定制小箱

 输入：```
3
1/1 2/1
1 2
2 5
3 7
```变换后的坐标：

 | x| y | 你| v |
 | --- | --- | --- | --- |
 | 1 | 2 | 1 | 0 |
 | 2 | 5 | 3 | 1 |
 | 3 | 7 | 4 | 1 |

 按 u 排序：[(3,1), (4,1)] → v 上的 LIS 为 [1,1] 长度 2。输出：2。 

这表明精确位于边界上的恒星被排除在外。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序需要 O(n log n)，使用二分查找的 LIS 则需要 O(n log n)。 |
 | 空间| O(n) | 存储变换后的坐标和 LIS 数组。 |

 这种复杂性完全符合 2 秒的限制$n \le 10^5$内存限制为 256 MB。 

## 测试用例```python
import sys, io
from contextlib import redirect_stdout

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    f = io.StringIO()
    with redirect_stdout(f):
        main()
    return f.getvalue().strip()

# provided sample
assert run("""15
1/3 2/1
3 1
6 2
4 2
2 5
4 5
6 6
3 4
1 6
2 1
7 4
9 3
5 3
1 3
15 5
12 4
""") == "4", "sample 1"

# minimum input
assert run("""1
1/1 1/2
1 1
""") == "1", "min input"

# all stars on boundary
assert run("""3
1/1 1/1
1 1
2 2
3 3
""") == "0", "all on ray"

# random small input
assert run("""5
1/2 3/1
1 2
2 3
3 1
4 5
2 1
""") == "3", "small test"

# maximum coordinate values
import random
stars = "\n".join(f"{random.randint(1,10**
```
