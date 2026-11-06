---
title: "CF 1886B - 对黑暗的恐惧"
description: "Monocarp 从原点 $(0,0)$ 出发，想要在 $P$ 点到达他的家。 唯一照亮的区域来自位于 $A$ 和 $B$ 点的两个灯笼。 两个灯笼必须使用相同的功率 $w$，这意味着每个灯笼照亮半径为 $w$ 的圆盘。"
date: "2026-06-08T22:15:18+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "geometry", "math"]
categories: ["algorithms"]
codeforces_contest: 1886
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 156 (Rated for Div. 2)"
rating: 1200
weight: 1886
solve_time_s: 131
verified: true
draft: false
---

[CF 1886B - 对黑暗的恐惧](https://codeforces.com/problemset/problem/1886/B)

 **评分：** 1200
 **标签：** 二分查找、几何、数学
 **求解时间：** 2m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 单果树从原点开始$(0,0)$并想在指定时间到达他家$P$。 唯一的照明区域来自位于不同点的两个灯笼$A$和$B$。 两个灯笼必须使用相同的电源$w$，这意味着每个灯笼照亮一个半径为$w$。 

我们需要的最小值$w$这样就存在从原点到房屋的连续路径，永远不会离开照明区域。 

照明区域只是两个半径相等的圆的并集$w$。 如果两个端点（原点和房屋）属于同一连接的照明组件，则存在有效路径。 

坐标最多为$1000$的大小，并且有多达$10^4$测试用例。 任何为每个测试用例做大量工作的解决方案都是浪费的。 由于只有四个相关点，$O$,$P$,$A$， 和$B$，我们应该期望一个恒定时间的几何解。 

有几种情况很容易被忽视。 

假设原点和房子都被同一个灯笼覆盖。 例如：```
P=(2,0)
A=(1,0)
B=(100,100)
```答案只是较大的$AO$和$AP$。 总是尝试使用两个灯笼的解决方案会高估结果。 

当原点被一个灯笼覆盖而房子被另一个灯笼覆盖时，就会出现另一种棘手的情况。 然后，两个被照亮的圆圈必须相交或接触，以便 Monocarp 可以从一个被照亮的区域转移到另一个被照亮的区域。 例如：```
P=(10,0)
A=(0,0)
B=(10,0)
```最小半径为$5$， 不是$0$。 每个端点都已位于灯笼中心，但圆必须连接。 

触摸算作连接，因为圆圈边界被照亮。 如果灯笼中心之间的距离正好是$2w$，圆在一点相交，并且路径仍然存在。 

## 方法

 自然的第一个想法是对答案进行二分搜索。 

对于固定半径$w$，我们可以检查是否存在有效的照明路径。 原点属于圆$A$如果$AO \le w$，对于所有其他点-圆关系也类似。 任何时候这两个圆都是相连的$AB \le 2w$。 这将创建一个由原点、房屋和两个圆圈组成的小图。 我们可以确定原点和房屋是否位于同一个连接的照明组件中。 

检查需要恒定的时间，并且对实数的二分搜索需要大约六十次迭代才能达到比所需的精度更高的精度。 This already passes comfortably.

 关键的观察是只有两个灯笼。 任何有效路径都必须属于极少数配置之一。 

要么一个灯笼单独覆盖两个端点，要么一个灯笼覆盖原点，另一个灯笼覆盖房子。 There are no other possibilities.

 如果单个灯笼覆盖两个端点，则所需的半径只是其到两个端点的距离的最大值。 

如果两个端点由不同的灯笼负责，则必须同时满足三个条件：

 1. The first lantern covers its endpoint.
 2. 第二个灯笼覆盖其端点。 
3. The two circles intersect.

 所需半径是这三个要求中的最大值。 

由于灯笼到端点的分配只有两种可能，因此我们可以直接计算所有候选者并取最小值。 这完全消除了二分搜索的需要。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | Binary Search + Feasibility Check | O(对数精度) | O(1) | O(1) | 已接受 |
 | Direct Geometric Formula | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. Compute all relevant distances:

 -$AO, AP, BO, BP,$和$AB$。 
2. 考虑灯笼的情况$A$仅此一项就涵盖了出身和房屋。 

所需半径为：$$\max(AO, AP)$$3. 考虑灯笼的情况$B$仅此一项就涵盖了出身和房屋。 

所需半径为：$$\max(BO, BP)$$4.考虑原点被灯笼遮住的情况$A$和灯笼下的房子$B$。 

产地要求$AO \le w$, 房子需要$BP \le w$，并且圆必须相交，这需要：$$AB \le 2w$$因此：$$w=\max\left(AO,\ BP,\ \frac{AB}{2}\right)$$5. 考虑原点被灯笼覆盖的对称分配$B$和灯笼下的房子$A$。 

所需半径为：$$w=\max\left(BO,\ AP,\ \frac{AB}{2}\right)$$6. 答案是四个候选半径中最小的一个。 

### 为什么它有效

 照亮的区域恰好是两个圆盘的并集。 从原点到房屋的任何路径都必须从包含原点的磁盘开始，并以包含房屋的磁盘结束。 

如果两个端点位于同一圆盘中，则该圆盘单独提供连接的照明路线。 这产生了前两个候选者。 

否则，原点和房屋必须位于不同的磁盘上。 由于只有两个圆盘存在，Monocarp 必须从一个圆盘移动到另一个圆盘。 当圆盘相交或接触时，这就是可能的。 半径必须同时满足两个端点的覆盖要求和相交要求。 这产生了剩下的两名候选人。 

每个可能的有效配置都属于这四种情况之一，并且每个候选者都是使其情况可行的最小半径。 对所有情况取最小值给出全局最优值。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def dist(x1, y1, x2, y2):
    return math.hypot(x1 - x2, y1 - y2)

t = int(input())

for _ in range(t):
    px, py = map(int, input().split())
    ax, ay = map(int, input().split())
    bx, by = map(int, input().split())

    ao = dist(ax, ay, 0, 0)
    ap = dist(ax, ay, px, py)

    bo = dist(bx, by, 0, 0)
    bp = dist(bx, by, px, py)

    ab = dist(ax, ay, bx, by)

    ans = min(
        max(ao, ap),
        max(bo, bp),
        max(ao, bp, ab / 2.0),
        max(bo, ap, ab / 2.0),
    )

    print(f"{ans:.10f}")
```第一部分计算完整描述与问题相关的几何形状的五个距离。 

接下来的四个表达式与证明中讨论的四种可能的连接模式完全对应。 

微妙的一点是外观`ab / 2.0`。 两个半径相等的圆$w$相交时$AB \le 2w$，这相当于$w \ge AB/2$。 忘记二这个因数是最常见的错误。 

使用`math.hypot`避免手动求平方和求平方根，同时保持数值稳定。 

打印十位小数轻松满足要求$10^{-6}$精确。 

## 工作示例

 ### 示例 1，测试用例 1```
P = (3,3)
A = (1,0)
B = (-1,6)
```| 数量 | 价值|
 | --- | --- |
 | AO | 1.000000 |
 | 美联社| 3.605551 |
 | 博 | 6.082763 |
 | 英国石油公司 | 5.000000 |
 | AB | 6.324555 | 6.324555
 | 最大（AO，AP）| 3.605551 |
 | 最大（BO，BP）| 6.082763 |
 | 最大（AO，BP，AB / 2）| 5.000000 |
 | 最大(BO, AP, AB/2) | 6.082763 |

 回答：$$\min(3.605551, 6.082763, 5.000000, 6.082763) = 3.605551$$最优解使用灯笼$A$独自的。 它已经覆盖了两个端点。 

### 示例 1，测试用例 2```
P = (3,3)
A = (-1,-1)
B = (4,3)
```| 数量 | 价值|
 | --- | --- |
 | AO | 1.414214 |
 | 美联社| 5.656854 |
 | 博 | 5.000000 |
 | 英国石油公司 | 1.000000 |
 | AB | 6.403124 |
 | 最大（AO，AP）| 5.656854 |
 | 最大（BO，BP）| 5.000000 |
 | 最大（AO，BP，AB / 2）| 3.201562 |
 | 最大(BO, AP, AB/2) | 5.656854 |

 回答：$$\min(5.656854, 5.000000, 3.201562, 5.656854) = 3.201562$$这里的原点被灯笼遮住了$A$，灯笼下的房子$B$，当半径达到时，圆恰好相交$AB/2$。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅进行固定次数的距离计算和比较|
 | 空间| O(1) | O(1) | 没有使用辅助数据结构 |

 每个测试用例执行恒定量的几何计算。 即使与$10^4$测试用例时，运行时间可以忽略不计，并且很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import io
import sys
import math

def solve():
    input = sys.stdin.readline

    def dist(x1, y1, x2, y2):
        return math.hypot(x1 - x2, y1 - y2)

    t = int(input())
    out = []

    for _ in range(t):
        px, py = map(int, input().split())
        ax, ay = map(int, input().split())
        bx, by = map(int, input().split())

        ao = dist(ax, ay, 0, 0)
        ap = dist(ax, ay, px, py)
        bo = dist(bx, by, 0, 0)
        bp = dist(bx, by, px, py)
        ab = dist(ax, ay, bx, by)

        ans = min(
            max(ao, ap),
            max(bo, bp),
            max(ao, bp, ab / 2.0),
            max(bo, ap, ab / 2.0),
        )

        out.append(f"{ans:.10f}")

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return result

# provided sample
out = run(
"""2
3 3
1 0
-1 6
3 3
-1 -1
4 3
"""
).strip().splitlines()

assert abs(float(out[0]) - 3.6055512755) < 1e-6
assert abs(float(out[1]) - 3.2015621187) < 1e-6

# single lantern A covers everything
out = float(run(
"""1
2 0
1 0
100 100
"""
).strip())
assert abs(out - 1.0) < 1e-6

# symmetric transfer through touching circles
out = float(run(
"""1
10 0
0 0
10 0
"""
).strip())
assert abs(out - 5.0) < 1e-6

# choose lantern B alone
out = float(run(
"""1
1 1
100 100
0 1
"""
).strip())
assert abs(out - 1.0 < 1e-6)

# negative coordinates
out = float(run(
"""1
-3 -4
-1 0
-4 -3
"""
).strip())
assert out > 0
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 房子近灯笼A，灯笼B远| 1.0 | 单灯笼解决方案|
 | 线段端点处的灯笼 | 5.0 | 圆相交要求 |
 | 灯笼 B 覆盖两个端点 | 1.0 | A 和 B 之间的对称性 |
 | 负坐标 | 肯定的有限答案 | 所有象限的距离计算 |

 ## 边缘情况

 ### 一个灯笼就够了

 输入：```
1
2 0
1 0
100 100
```距离为：```
AO = 1
AP = 1
```灯笼$A$用半径覆盖两个端点$1$。 该算法计算`max(AO, AP)=1`并返回它。 任何迫使两个灯笼参与的方法都会产生更大的答案。 

### 不同的灯笼覆盖两个端点

 输入：```
1
10 0
0 0
10 0
```起源于灯笼$A$的中心和房子位于灯笼$B$的中心。 仅覆盖范围就表明半径$0$，但照明区域将被断开。 

该算法还检查$AB/2 = 5$，生产：```
max(AO, BP, AB/2) = 5
```这是真正的最小半径。 

### 圆圈只接触

 输入：```
1
4 0
0 0
4 0
```最佳半径为$2$。 

这些圆正好在一点相交，因为：$$AB = 4 = 2 \times 2$$触摸就足够了，因为界限被照亮了。 该公式自然可以处理此问题，因为它使用非严格条件$AB \le 2w$。 

### 对称分配

 输入：```
1
3 3
4 3
-1 -1
```这是灯笼标签交换的第二个示例。 

该算法评估两种混合分配：$$\max(AO, BP, AB/2)$$和$$\max(BO, AP, AB/2)$$因此，无论哪个灯笼覆盖原点以及哪个灯笼覆盖房子，它都保持正确。
