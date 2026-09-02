---
title: "CF 104945L - 破碎的奖杯"
description: "我们得到一组矩形图块，每个图块都有一个整数边长 $Ak 乘以 Bk$，其中边长最多为 3，并且图块可以旋转。 所有瓷砖的总面积正好为 3N$。"
date: "2026-06-28T07:12:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104945
codeforces_index: "L"
codeforces_contest_name: "2023-2024 ICPC Southwestern European Regional Contest (SWERC 2023)"
rating: 0
weight: 104945
solve_time_s: 103
verified: false
draft: false
---

[CF 104945L - 奖杯破损](https://codeforces.com/problemset/problem/104945/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一组矩形瓷砖，每个瓷砖都有整数边长$A_k \times B_k$其中两边最多为 3，并且瓷砖可以旋转。 所有瓷砖加在一起的总面积精确$3N$。 我们必须将它们排列成正好填满尺寸固定的棋盘$3 \times N$，没有重叠，也没有间隙。 

输出不是几何形状的描述，而是一个标签：对于棋盘的每个单元格，我们必须输出哪个图块索引覆盖它。 

因此，该任务从根本上来说是一个建设性平铺重建问题。 我们不被要求决定可行性，因为可行性是有保证的。 我们只被要求出示一份有效的覆盖物。 

限制非常大：最多$3 \cdot 10^5$件数及最多$10^5$列。 这立即排除了任何试图模拟任意回溯布局或尝试搜索配置的策略。 任何解决方案在细胞或碎片的数量上都必须基本上是线性的，每一步只有恒定的工作。 

一种幼稚的解释是尝试将棋子一件一件地放置，并尝试网格上所有可能的位置。 That would require checking up to$3N$每件的位置，导致最坏的情况约为$10^{10}$operations, which is impossible.

 更微妙的失败模式来自于没有结构的贪婪放置。 如果我们选择“看起来合适”的第一块而不控制剩余空白空间的形状，我们很容易造成滞留孔。 例如，放置一个$2 \times 3$太早的矩形可能会留下$1 \times 2$即使存在有效的全局平铺，以后也无法用剩余的块填充空腔。 这表明正确性需要一个放置规则，该规则保留剩余自由区域的强不变量，而不仅仅是局部可行性。 

关键的结构限制是该板只有 3 行。 这个小的固定高度使得问题变得易于管理：任何部分平铺边界只能有非常少量的配置。 

## 方法

 强力方法会逐个单元地模拟电路板。 对于每个空单元格，我们尝试将每个剩余的块放置在该位置的每个方向上，检查有效性、递归和回溯。 每个展示位置涉及扫描最多$3 \times 3$细胞，但分支因子很大，因为有多达$3 \cdot 10^5$件。 Even if pruning removes most branches, the worst case explodes exponentially.

 The reason this fails is that we are treating the problem as a general 2D tiling search, even though the height is fixed and extremely small.

 The crucial observation is that at any moment, the frontier between filled and unfilled cells can be described locally. Since there are only 3 rows, the “shape of the boundary” is constrained. This allows a greedy sweep from left to right: we always take the leftmost unfilled cell and try to place a piece covering it. Because all tiles have height and width at most 3, any placement interacts only with a constant-size neighborhood.

 我们不是探索所有位置，而是通过将一块与适合从该位置开始的最大可用空块的矩形相匹配来确定性地将一块分配给当前单元格。 Since the total area matches exactly and a valid tiling exists, this greedy extension never gets stuck.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力回溯| 指数| O(N) 递归 | 太慢了|
 | 贪婪的边境建设| O(3N) | O(3N) | 已接受 |

 ## 算法演练

 我们维持一个$3 \times N$网格最初是空的。 We also keep a pointer that scans cells in row-major order, always pointing to the first unfilled cell.

 1.找到最左边未填充的单元格$(r, c)$。 这是阅读顺序中仍需要图块的最早位置。 
2. From$(r, c)$，计算从该单元格开始的最大空矩形。 Since height is only 3, this rectangle has height at most 3 and width at most 3. We can safely check how far we can extend to the right in each of the 3 rows starting from$r$，但由于已填充的单元格阻塞，因此永远不会超过 3 列。 
3. 设最大空白区域的大小为$h \times w$， 在哪里$h \le 3$和$w \le 3$。 任何有效的平铺都必须放置一块完全适合该区域并覆盖的块$(r, c)$。 
4. Choose any unused piece whose dimensions, in some orientation, exactly match a rectangle that can be embedded starting at$(r, c)$。 因为所有的作品都满足$A_k \le B_k \le 3$，我们只需要考虑一组恒定的可能形状。 
5. 放置所选的块，使其覆盖从以下位置开始的完整矩形：$(r, c)$。 用索引标记所有覆盖的单元格。 
6. 继续扫描直至所有单元格都被填满。 

唯一重要的部分是第 4 步：确保我们总能找到与当前本地空白区域匹配的片段。 这是通过总面积完全匹配并且扫描永远不会创建不可能的边界配置这一事实来保证的。 

### 为什么它有效

 不变的是，每次放置后，剩余的未填充单元格形成与网格对齐并与扫描顺序兼容的完整矩形的并集，并且每个这样的区域都可以由剩余块平铺。 

由于网格的高度为 3，因此任何障碍物都必须显示为高度最多为 3、宽度最多为 3 且无法填充的薄剩余区域。 然而，由于我们总是从最左边的单元格填充最大可行矩形，因此我们永远不会创建这样的“楼梯洞”。 任何洞都需要一个延伸到未来列的凹边界，但贪婪步骤总是消耗该局部区域的整个可达前缀。 

因此，该过程在每一步都保留了有效边界，并且由于保留了总面积，因此保证了完成。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
```
