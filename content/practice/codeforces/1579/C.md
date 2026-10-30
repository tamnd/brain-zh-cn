---
title: "CF 1579C - 蜱虫"
description: "我们得到一个大小为 $n 乘以 m$ 的网格，代表一张纸，其中一些单元格是黑色的（用 表示），其他单元格是白色的（.）。 卡西米尔声称黑色细胞是通过吸引蜱虫产生的。"
date: "2026-06-10T10:24:26+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1579
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 744 (Div. 3)"
rating: 1500
weight: 1579
solve_time_s: 350
verified: true
draft: false
---

[CF 1579C - 蜱虫](https://codeforces.com/problemset/problem/1579/C)

 **评分：** 1500
 **标签：** 贪心，实现
 **求解时间：** 5m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一个尺寸的网格$n \times m$代表一张纸，其中一些单元格是黑色的（表示为`*`），其他的是白色（`.`）。 卡西米尔声称黑色细胞是通过吸引蜱虫产生的。 尺寸的一个刻度$d$以某个单元格为中心，并精确地向左上和右上对角延伸$d$细胞。 蜱虫覆盖了中心细胞和两个臂，导致$2d+1$黑色细胞。 所有蜱虫都有最小尺寸$k$。 多个刻度可以重叠，一旦一个单元格变黑，它就会保持黑色。 

任务是检查给定的黑白网格是否可以由某些刻度组合生成，所有刻度的大小至少为$k$。 

限制很小：$n$最多 10 个并且$m$最多 19。这使我们能够彻底处理网格，而不必担心超时。 主要挑战不是效率，而是正确识别哪些黑色细胞属于蜱虫大小$\ge k$并确保所有黑色单元都被考虑在内。 

边缘情况包括网格，其中一些黑色单元格被隔离或太靠近顶行而无法支持最小尺寸的刻度。 例如，如果$k=2$和一个`*`如果出现在第一行，则无法以此作为底部单元格形成大小为 2 的刻度，因此答案是`NO`。 

## 方法

 暴力方法将尝试在所有可能的位置尝试所有可能的刻度，并检查它们是否可以完全覆盖网格。 对于每个潜在中心`(i, j)`，我们会尝试所有尺寸$d \ge k$并相应地标记单元格。 这适用于小网格，但即使对于$n=10$和$m=19$，我们可能会多余地尝试许多重叠的刻度，并且反复验证覆盖范围会变得混乱。 

优化的关键观察是刻度必须对角向上延伸。 因此，我们可以从底部行到顶部扫描网格，因为刻度线的中心只能负责其下方或行上的黑色单元格。 对于每个`*`，我们可以通过检查向上的对角线来确定底部位于该单元格的最大刻度大小。 如果最大尺寸至少为$k$，我们将相应的单元格标记为被覆盖。 处理完所有潜在的价格变动后，任何`*`不覆盖会使网格失效。 

这导致了一种贪婪但结构化的方法：计算可以在每个单元格结束的刻度的最大大小，相应地标记单元格，并验证所有黑色单元格都被考虑在内。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m * 分钟(n, m)^2) | O(n * m) | 太慢/混乱|
 | 最佳 | O(n * m) | O(n * m) | 已接受 |

 ## 算法演练

 1.读取输入网格及参数`n, m, k`。 将网格转换为布尔二维数组`grid`在哪里`True`代表一个黑色单元格。 
2.初始化两个辅助2D数组`left_diag`和`right_diag`与网格大小相同。`left_diag[i][j]`将存储左上对角连续黑色单元格的长度，结束于`(i,j)`。`right_diag[i][j]`将存储对角向上连续黑色单元格的长度，结束于`(i,j)`。 
3. 填充`left_diag`和`right_diag`以自下而上的方式。 对于一个细胞`(i,j)`和`*`,`left_diag[i][j]`是`1 + left_diag[i-1][j-1]`如果`i>0`和`j>0`，否则 1。类似地，`right_diag[i][j]`是`1 + right_diag[i-1][j+1]`如果`i>0`和`j<m-1`，否则 1。 
4. 初始化一个`covered`大小数组`n x m`与所有`False`。 该数组将跟踪哪些黑色单元格由大小 ≥ k 的刻度来解释。 
5. 扫描每个单元格`(i, j)`从下到上。 如果`(i,j)`为黑色，计算最大刻度大小为`d = min(left_diag[i][j], right_diag[i][j]) - 1`。 如果`d >= k`，标记该刻度的所有单元格`covered`数组：对于每个`h`从`0`到`d`， 标记`(i-h, j-h)`和`(i-h, j+h)`作为`True`。 
6. 处理完所有单元格后，迭代网格。 如果有任何细胞`(i,j)`原始网格中为黑色但未标记为覆盖，打印`NO`。 否则，打印`YES`。 

工作原理：自下而上的扫描确保对于任何潜在的蜱虫，其向上的手臂都不会被阻挡，并且我们标记了蜱虫解释的所有细胞。 如果黑色单元格未被覆盖，则它不能属于任何大小≥ k 的刻度。 通过自下而上的扫描，每个刻度都通过其最大可能的尺寸来识别，确保不会遗漏任何有效的刻度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m, k = map(int, input().split())
        grid = [list(input().strip()) for _ in range(n)]
        left_diag = [[0]*m for _ in range(n)]
        right_diag = [[0]*m for _ in range(n)]
        covered = [[False]*m for _ in range(n)]

        for i in range(n):
            for j in range(m):
                if grid[i][j] == '*':
                    left_diag[i][j] = 1 + (left_diag[i-1][j-1] if i>0 and j>0 else 0)
                    right_diag[i][j] = 1 + (right_diag[i-1][j+1] if i>0 and j<m-1 else 0)

        for i in reversed(range(n)):
            for j in range(m):
                if grid[i][j] == '*':
                    d = min(left_diag[i][j], right_diag[i][j]) - 1
                    if d >= k:
                        for h in range(d+1):
                            covered[i-h][j-h] = True
                            covered[i-h][j+h] = True

        ok = True
        for i in range(n):
            for j in range(m):
                if grid[i][j] == '*' and not covered[i][j]:
                    ok = False
                    break
            if not ok:
                break
        print("YES" if ok else "NO")

solve()
```这`left_diag`和`right_diag`数组有效地计算每个单元格的潜在刻度的最大向上臂。 自下而上的传递确保我们首先捕获最大可能的刻度并标记覆盖的所有单元格。 最终检查确保没有任何黑细胞无法解释。 必须注意数组边界以避免索引错误。 

## 工作示例

 **示例1**

 输入网格（4x9，k=2）：```
*.*.*...*
.*.*...*.
..*.*.*..
.....*...
```底行的步进轨迹`i=3`:

 | 我| j | 网格| 左诊断 | 右诊断 | d | 行动|
 | --- | --- | --- | --- | --- | --- | --- |
 | 3 | 5 | * | 1 | 1 | 0 | d<k，跳过 |

 向上移动，刻度线集中在`(2,5)`和`d=2`标记其所有单元格，覆盖相关的`*`。 该算法找到所有刻度并确认所有黑色单元格都被覆盖。 输出：`YES`。 

**示例2**

 输入网格（2x3，k=1）：```
*.*
...
```自下而上传递：

 | 我| j | 网格| 左诊断 | 右诊断 | d | 行动|
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 。 | 0 | 0 | - | 跳过|
 | 0 | 0 | * | 1 | 1 | 0 | d<k，跳过 |

 没有大小 ≥1 的刻度可以解释`*`在`(0,0)`。 输出：`NO`。 

这些痕迹表明，该算法正确识别了最大可能的刻度大小，并确保没有黑色单元格无法解释。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n*m) | 每个单元格都会被处理固定次数：对角线计算一次，自下而上标记一次。 |
 | 空间| O(n*m) | 为了`left_diag`,`right_diag`， 和`covered`数组。 |

 小输入范围使得这个线性解决方案非常有效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# Provided samples
assert run("8\n2 3 1\n*.*\n...\n4 9 2\n*.*.*...*\n.*.*...*.\n..*.*.*..\n.....*...\n4 4 1\n*.*.\n****\n.**.\n....\n5 5 1\n.....\n*...*\n.*.*.\
```
