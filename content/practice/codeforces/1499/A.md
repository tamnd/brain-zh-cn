---
title: "CF 1499A - 窗台上的多米诺骨牌"
description: "我们有一块大小为 $2 乘以 n$ 的棋盘，其中顶行的前 $k1$ 单元和底行的 $k2$ 单元为白色，其余为黑色。 我们还得到了一些白色多米诺骨牌 $w$ 和黑色多米诺骨牌 $b$。"
date: "2026-06-10T21:26:40+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "constructive-algorithms", "math"]
categories: ["algorithms"]
codeforces_contest: 1499
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 106 (Rated for Div. 2)"
rating: 800
weight: 1499
solve_time_s: 270
verified: true
draft: false
---

[CF 1499A - Windowsill 上的 Domino](https://codeforces.com/problemset/problem/1499/A)

 **评分：** 800
 **标签：** 组合数学、构造性算法、数学
 **求解时间：** 4m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一块尺寸的板$2 \times n$，其中第一个$k_1$顶行的单元格和$k_2$最下面一行的单元格是白色的，其余的单元格是黑色的。 我们还得到了一些白色的多米诺骨牌$w$和黑色多米诺骨牌$b$。 每张多米诺骨牌都是$2 \times 1$可以水平或垂直放置，但必须覆盖相同颜色的单元格。 任务是确定是否可以将所有$w + b$板上的多米诺骨牌没有重叠。 

输入描述了多个测试用例。 对于每个测试用例，$n$可以达到$1000$和测试用例的数量$t$可以达到$3000$，因此任何算法必须处理最多$3 \cdot 10^6$董事会单元总数。 这排除了任何尝试显式模拟所有多米诺骨牌放置的解决方案，因为这很容易导致$O(n^2)$每个测试用例的工作。 

当一行有零个白色或黑色单元时，当多米诺骨牌必须垂直放置但一行没有足够的相应单元时，或者当有奇数个单色单元无法形成多米诺骨牌时，就会出现不明显的边缘情况。 例如，一块板$n=1$,$k_1=0$,$k_2=1$， 和$w=1$无法容纳白色多米诺骨牌，因为只有一个白色单元格。 如果粗心地只检查白细胞总数，就会错误地认为可以进行放置。 

## 方法

 蛮力方法将尝试模拟将多米诺骨牌放置在每个有效位置。 人们可以尝试所有水平放置，然后垂直放置，或者甚至递归地尝试所有排列。 这是正确的，因为它枚举了每个有效的配置，但它太慢了。 为了$n = 1000$，展示位置的数量组合增长，并且$t = 3000$测试用例，这很快就超出了实际限制。 

关键的见解是我们不需要模拟展示位置。 每张多米诺骨牌正好覆盖两个相同颜色的单元格。 对于垂直多米诺骨牌，我们可以放置的最大数量是$\min(k_1, k_2)$对于白色多米诺骨牌和$\min(n - k_1, n - k_2)$对于黑色多米诺骨牌。 使用垂直多米诺骨牌后，每行中的其余单元只能在同一行内水平配对。 因此，一种颜色的多米诺骨牌的最大数量是垂直放置的多米诺骨牌加上剩余单色单元的一半的总和。 这将问题简化为彩色细胞计数的简单算术。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2 * t) | O(n^2 * t) | O(n) | 太慢了|
 | 细胞计数| O(t) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$,$k_1$,$k_2$,$w$,$b$。 这里$k_1$和$k_2$分别是顶行和底行中白细胞的数量。 
2. 计算可以放置的白色多米诺骨牌的最大数量。 垂直多米诺骨牌的限制为$\min(k_1, k_2)$。 顶行中剩余的白色单元格是$k_1 - \min(k_1, k_2)$，并在底行$k_2 - \min(k_1, k_2)$。 每个水平多米诺骨牌占据 2 个单元格，因此我们可以放置的水平多米诺骨牌数量为$(\text{remaining top} + \text{remaining bottom}) // 2$。 将垂直和水平计数相加即可得到`max_white`。 
3. 同样计算黑色多米诺骨牌的最大数量。 最上面一行黑色单元格的数量是$n - k_1$，并在底行$n - k_2$。 最大垂直多米诺骨牌数为$\min(n - k_1, n - k_2)$水平多米诺骨牌是剩余的黑色单元格除以 2。将这些相加得出`max_black`。 
4. 如果$w \le max_white$和$b \le max_black$，打印“是”； 否则，打印“NO”。 这确保了棋盘有足够的空间容纳所有多米诺骨牌，而无需明确放置它们。 

**为什么有效**：该算法正确计算每种颜色的最大可能多米诺骨牌数量。 垂直多米诺骨牌始终是最大化使用的最佳选择，而水平多米诺骨牌则使用任何剩余的单色单元。 由于多米诺骨牌不能重叠，并且每个多米诺骨牌正好覆盖 2 个单元格，因此不可能超过这些最大值。 这个算术保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, k1, k2 = map(int, input().split())
    w, b = map(int, input().split())
    
    # Maximum white dominoes
    vertical_white = min(k1, k2)
    remaining_white_top = k1 - vertical_white
    remaining_white_bottom = k2 - vertical_white
    horizontal_white = (remaining_white_top + remaining_white_bottom) // 2
    max_white = vertical_white + horizontal_white
    
    # Maximum black dominoes
    black_top = n - k1
    black_bottom = n - k2
    vertical_black = min(black_top, black_bottom)
    remaining_black_top = black_top - vertical_black
    remaining_black_bottom = black_bottom - vertical_black
    horizontal_black = (remaining_black_top + remaining_black_bottom) // 2
    max_black = vertical_black + horizontal_black
    
    if w <= max_white and b <= max_black:
        print("YES")
    else:
        print("NO")
```该代码首先读取测试用例的数量，然后迭代每个测试用例。 每种颜色的最大多米诺骨牌数量是单独计算的。 使用整数除法可确保仅计算完整的多米诺骨牌。 条件`w <= max_white and b <= max_black`是关键的决策点。 仔细的减法可防止出现负计数并确保除法正确代表细胞对。 

## 工作示例

 **示例1**

 输入：`1 0 1`和`w=1, b=0`| 变量| 价值|
 | --- | --- |
 | 垂直白色 | 0 |
 | 剩余白色顶部 | 0 |
 | 剩余白色底部 | 1 |
 | 水平_白色| 0 |
 | 最大白色 | 0 |

 自从`w = 1 > max_white = 0`，输出为“NO”。 

**示例2**

 输入：`4 3 1`和`w=2, b=2`| 变量| 价值|
 | --- | --- |
 | 垂直白色 | 1 |
 | 剩余白色顶部 | 2 |
 | 剩余白色底部 | 0 |
 | 水平_白色| 1 |
 | 最大白色 | 2 |
 | 黑顶 | 1 |
 | 黑底 | 3 |
 | 垂直黑色| 1 |
 | 剩余黑色顶部 | 0 |
 | 剩余黑色底部 | 2 |
 | 水平_黑色| 1 |
 | 最大黑色 | 2 |

 两个都`w <= max_white`和`b <= max_black`，输出“是”。 

这些痕迹表明该算法可以正确处理不均匀的行以及垂直和水平的多米诺骨牌放置。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t) | 每个测试用例都涉及简单的算术和比较 |
 | 空间| O(1) | O(1) | 每个测试用例只有整数变量，没有大数组 |

 该解决方案与测试用例的数量成线性比例，独立于$n$，使其对于约束足够有效$t \le 3000$和$n \le 1000$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n, k1, k2 = map(int, input().split())
        w, b = map(int, input().split())
        vertical_white = min(k1, k2)
        remaining_white_top = k1 - vertical_white
        remaining_white_bottom = k2 - vertical_white
        horizontal_white = (remaining_white_top + remaining_white_bottom) // 2
        max_white = vertical_white + horizontal_white
        black_top = n - k1
        black_bottom = n - k2
        vertical_black = min(black_top, black_bottom)
        remaining_black_top = black_top - vertical_black
        remaining_black_bottom = black_bottom - vertical_black
        horizontal_black = (remaining_black_top + remaining_black_bottom) // 2
        max_black = vertical_black + horizontal_black
        if w <= max_white and b <= max_black:
            print("YES")
        else:
            print("NO")
    return output.getvalue().strip()

# provided samples
assert run("5\n1 0 1\n1 0\n1 1 1\n0 0\n3 0 0\n1 3\n4 3 1\n2 2\n5 4 3\n3 1") == "NO\nYES\nNO\nYES\nYES"

# custom cases
assert run("1\n1 0 0\n0 1") == "YES", "single column, only black domino"
assert run("1\n1 1 1\n1 0") == "YES", "single column, only white domino"
assert run("1\n2 1 1\n1 1") == "YES", "two
```
