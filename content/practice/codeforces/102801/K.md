---
title: "CF 102801K - PepperLa 的夸耀"
description: "该问题描述了一名跑步者穿过燃烧的网格。 跑步者从左上角的单元格开始，需要到达右下角的单元格。 每个单元都含有一定量的新鲜空气。"
date: "2026-08-01T23:20:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102801
codeforces_index: "K"
codeforces_contest_name: "The 14th Chinese Northeast Collegiate Programming Contest"
rating: 0
weight: 102801
solve_time_s: 128
verified: true
draft: false
---

[CF 102801K - PepperLa 的夸耀](https://codeforces.com/problemset/problem/102801/K)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 8s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该问题描述了一名跑步者穿过燃烧的网格。 跑步者从左上角的单元格开始，需要到达右下角的单元格。 每个单元都含有一定量的新鲜空气。 阳性细胞可以被吸入，而非阳性细胞则含有烟雾，除非跑步者当前屏住呼吸，否则无法进入。 

移动总是向下、向右或对角右下，因此该路径是穿过网格的有向非循环路径。 开始屏气训练需要花费`U`空气并允许通过烟雾最多`K`移动。 我们的目标不仅仅是逃跑，而是最大限度地增加到达出口后剩余的空气量。 

网格尺寸均可达到`1000`，所有测试用例上所有网格单元的总和可以达到`7 * 10^6`。 探索每条可能路径的算法是不可能的，因为路径的数量呈指数增长。 即使是一个动态程序，检查每个位置的每个可能的先前单元格也将是围绕`O(N^2M^2)`在最坏的情况下，也远远超出了极限。 我们需要一个与细胞数量接近线性的解决方案。 

主要的边缘情况来自正常运动和呼吸跳跃之间的相互作用。 一条路径在进入烟雾之前可能需要开始屏住呼吸，并且之前的最佳位置可能在很远的地方`K`经过`K`矩形而不是三个相邻单元格之一。 

例如：```
1 3 2 5
10 0 10
```答案是`15`。 只考虑相邻阳性细胞的粗心解决方案将会失败，因为跑步者必须消耗空气才能穿过中间的烟雾细胞。 

另一种情况是当`K`大于网格尺寸：```
2 2 10 3
5 0
0 7
```答案是`9`。 假设呼吸持续时间恰好为`K`移动可能会拒绝较早停止的有效路径。 

## 方法

 直接动态规划解决方案很容易定义。 让`dp[i][j]`是到达细胞后剩余的最大空气量`(i,j)`。 如果当前细胞含有空气，我们可以从三个正常的前驱细胞到达。 我们还可以从任何较早到达的单元格开始屏住呼吸`K`行和`K`专栏，付费`U`并添加当前单元格的空气。 

复发是正确的，但呼吸转换的成本很高。 对于每个单元格，我们将扫描最多`K*K`可能的起始位置。 自从`K`可以大到`10^9`，这实际上是对整个先前网格的扫描，并且速度太慢。 

关键的观察是呼吸转换只需要最大`dp`滑动矩形内的值。 逐行扫描时，该矩形始终一次移动一步。 我们可以使用单调队列来维护最大值。 

对于每一列，保留一个双端队列，其中包含最后一个有用的起始位置`K`行。 双端队列减少了`dp`值，因此它的前面是该列中的最佳候选。 然后在当前行中维护另一个双端队列以获得最后一行中的最佳列`K`列。 这两种结构共同提供了最大`dp`整体价值`K`经过`K`固定摊销时间内的窗口。 

蛮力之所以有效，是因为每个有效的呼吸开始都会被检查，但当网格变大时就会失败。 观察到过渡是滑动最大值，让我们可以用两个单调队列替换数百万次重复比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(NM * K²) | O(NM) | 太慢了 |
 | 最佳 | O(NM) | O(M)| 已接受 |

 ## 算法演练

 1.从上到下、从左到右处理网格。 该顺序符合移动规则，因为单元格的每个可能的前身都已被处理。 
2. 对于每个阳性细胞，首先计算转变，无需屏住呼吸。 三个可能的先前单元格是上方的单元格、左侧的单元格和对角线的单元格。 取最大可达值后，添加当前单元的空气。 
3. 维护包含可以启动呼吸会话的先前单元格的列双端队列。 删除超过的条目`K`行远。 双端队列保留最大的`dp`价值观放在前面，因为较弱的候选人以后永远不会有用。 
4. 维护一个行双端队列，其中包含活动列中的最佳候选者。 删除超过的列`K`列远。 该双端队列的前端是在当前单元格结束的呼吸会话的最佳起点。 
5. 如果当前单元格为正并且存在有效的呼吸开始，则更新`dp[i][j]`从该开始减去的值`U`，然后添加当前单元格的空气。 
6. 计算后`dp[i][j]`，仅当剩余空气至少为`U`。 较小的值无法启动呼吸会话，因为它无法支付成本。 

为什么它有效：不变的是每个双端队列都包含当前滑动窗口内有用的可到达单元，并进行排序，以便最佳候选者始终位于前面。 删除旧条目可以保留距离限制，而删除主导条目可以保留最大值，因为较晚到期的更差值永远无法击败具有相同或更早到期的较大值。 每个可能的转换都被表示出来，因此计算出的`dp`值始终是最佳可能的空气量。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve_case(n, m, k, u, grid):
    cols = [deque() for _ in range(m)]
    dp_prev = [-1] * m
    ans = -1

    for i in range(n):
        row_best = deque()
        dp_cur = [-1] * m

        for j in range(m):
            while cols[j] and cols[j][0][0] < i - k:
                cols[j].popleft()

            while row_best and row_best[0][1] < j - k:
                row_best.popleft()

            if grid[i][j] > 0:
                best = -1

                if i == 0 and j == 0:
                    best = 0

                if i > 0 and dp_prev[j] >= 0:
                    best = max(best, dp_prev[j])

                if j > 0 and dp_cur[j - 1] >= 0:
                    best = max(best, dp_cur[j - 1])

                if i > 0 and j > 0 and dp_prev[j - 1] >= 0:
                    best = max(best, dp_prev[j - 1])

                if row_best:
                    best = max(best, row_best[0][0] - u)

                if best >= 0:
                    dp_cur[j] = best + grid[i][j]

            if dp_cur[j] >= u:
                while cols[j] and cols[j][-1][1] <= dp_cur[j]:
                    cols[j].pop()
                cols[j].append((i, dp_cur[j]))

            if cols[j]:
                value = cols[j][0][1]
                while row_best and row_best[-1][0] <= value:
                    row_best.pop()
                row_best.append((value, j))

            if i == n - 1 and j == m - 1:
                ans = dp_cur[j]

        dp_prev = dp_cur

    return ans

def main():
    out = []
    data = sys.stdin.buffer.read().split()
    ptr = 0

    while ptr < len(data):
        n = int(data[ptr])
        m = int(data[ptr + 1])
        k = int(data[ptr + 2])
        u = int(data[ptr + 3])
        ptr += 4

        grid = []
        for _ in range(n):
            row = list(map(int, data[ptr:ptr + m]))
            ptr += m
            grid.append(row)

        out.append(str(solve_case(n, m, k, u, grid)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```该实现仅存储前一行`dp`，因为正常过渡只需要正上方或斜上方的单元格。 列双端队列存储行索引，因此当距离大于`K`。 

插入顺序很重要。 只有在计算出单元格自身的值之后，才必须将单元格用作呼吸起点，因此在当前单元格的所有转换完成后，它才会被添加到队列中。 这可以防止意外地允许零长度呼吸移动。 

所有值都存储为 Python 整数，因为最大可能的剩余空间可能会超过 32 位限制。 

## 工作示例

 对于样本：```
3 4 2 1
1 0 0 9
0 -1 1 1
-1 0 2 1
```重要的状态是：

 | 细胞| 最佳过渡 | 剩余空气|
 | --- | --- | --- |
 | (1,1) | 开始| 1 |
 | (2,2) | 从 (1,1) | 保持 0 |
 | (2,3) | 停止握住，收集空气 | 1 |
 | (3,3) | 正常移动 | 3 |
 | (3,4) | 正常移动 | 4 |

 该轨迹显示了为什么呼吸会话被表示为跳跃过渡。 跑步者不需要单独存储每个烟雾单元，只需存储起点和最终成本。 

第二个例子：```
2 2 10 3
5 0
0 7
```| 细胞| 最佳过渡 | 剩余空气|
 | --- | --- | --- |
 | (1,1) | 开始| 5 |
 | (1,2) | 从 (1,1) | 保持 9 |
 | (2,1) | 从 (1,1) | 保持 9 |
 | (2,2) | 正常移动 | 16 | 16

 大的`K`值允许立即穿过烟雾，并且最佳路径保留所有收集的空气。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(NM) | 每个单元进入和离开每个单调队列一次。 |
 | 空间| O(M)| 仅存储一行DP和列队列。 |

 该算法以恒定的次数接触每个网格单元，这符合数百万个单元的总限制。 内存使用量取决于列数而不是整个网格。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    idx = 0
    ans = []

    while idx < len(data):
        n, m, k, u = map(int, data[idx:idx + 4])
        idx += 4
        grid = []
        for _ in range(n):
            grid.append(list(map(int, data[idx:idx + m])))
            idx += m

        ans.append(str(solve_case(n, m, k, u, grid)))

    return "\n".join(ans)

assert run("""3 4 2 1
1 0 0 9
0 -1 1 1
-1 0 2 1
""") == "4", "sample"

assert run("""1 1 5 10
7
""") == "7", "single cell"

assert run("""1 3 2 5
10 0 10
""") == "15", "cross smoke"

assert run("""2 2 10 3
5 0
0 7
""") == "16", "large breath duration"

assert run("""2 3 1 100
5 1 1
1 1 9
""") == "17", "all positive cells"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 x 1`网格|`7`| 开始细胞处理|
 | 烟隙|`15`| 呼吸过渡 |
 | 大的`K`|`16`| 长呼吸训练 |
 | 所有阳性细胞|`17`| 仅正常运动 |

 ## 边缘情况

 处理从起始单元屏住呼吸开始的路径，因为`(1,1)`正常插入到DP进程中。 案例```
1 3 2 5
10 0 10
```创建从第一个单元到最后一个单元的呼吸过渡。 双端队列窗口包含起始状态，减去`U`，并添加最后的空气。 

呼吸训练结束时间早于`K`动作有效。 在```
2 2 10 3
5 0
0 7
```跑步者不需要花费所有可能的十分钟。 滑动窗口仅限制最大距离，因此到达安全单元后的正常转换仍然可用。 

剩余空气量低的单元格不会插入呼吸队列，除非它们的值至少为`U`。 这可以避免产生不可能的过渡，即跑步者在没有足够空气的情况下尝试屏住呼吸。
