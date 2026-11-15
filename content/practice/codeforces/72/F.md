---
title: "CF 72F - 油"
description: "我们有一个 n × m 的网格。 有些整行为空，有些整列为空，每个空单元格至少属于这些空行或空列之一。 所有剩余的细胞都含有油。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 72
codeforces_index: "F"
codeforces_contest_name: "Unknown Language Round 2"
rating: 1900
weight: 72
solve_time_s: 103
verified: true
draft: false
---

[CF 72F - 石油](https://codeforces.com/problemset/problem/72/F)

 **评级：** 1900
 **标签：** *特殊、贪心、数学
 **求解时间：** 1m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个`n × m`网格。 有些整行为空，有些整列为空，每个空单元格至少属于这些空行或空列之一。 

所有剩余的细胞都含有油。 如果我们在一个油单元中钻一口井，我们可以到达通过边缘相邻油单元连接的每个油单元。 任务是计算存在多少个相连的油区。 

考虑网格的另一种方式是：

 细胞含有油当且仅当：```
its row is not empty
and
its column is not empty
```所以去掉禁止行和禁止列后，剩下的油格就形成了几个矩形块。 我们需要计算这些块创建了多少个连接组件。 

限制非常小，最多只能达到`100 × 100`。 即使是整个网格上的简单 BFS 或 DFS 也是完全安全的。 一次完整的遍历最多触及`10^4`细胞，对于 2 秒的限制来说很小。 

棘手的部分不是性能，而是正确理解结构。 

考虑这个例子：```
n = 5, m = 5
empty rows: 3
empty cols: none
```网格分为：```
rows 1-2
row 3 removed
rows 4-5
```所以正好有 2 个相连的油区。 

现在考虑：```
n = 5, m = 5
empty rows: 3
empty cols: 3
```删除的行和删除的列形成十字。 剩余的油细胞分裂成 4 个不相连的矩形，所以答案是 4。 

粗心的实现可能会错误地认为答案是：```
(#non-empty row segments) + (#non-empty column segments)
```但正确的结构是乘法，而不是加法。 

当每行或每列都为空时，就会出现另一个容易出现的错误。 

例子：```
2 3
2 1 2
0
```所有行都被移除，因此根本没有油细胞​​。 答案是`0`， 不是`1`。 

相似地：```
3 3
0
0
```没有行或列被删除，因此整个网格是一个连接的组件。 答案是`1`。 

## 方法

 最直接的解决方案是显式构建网格。 

我们标记每一行为空，每一列为空。 然后是一个细胞`(i, j)`恰好在以下情况下含有油：```
row i is not empty
and
column j is not empty
```一旦我们构建了这个布尔网格，问题就变成了二维网格上的标准连通分量问题。 我们从每个未访问的油单元运行 BFS 或 DFS，并计算我们开始的遍历次数。 

这种强力方法是完全正确的，因为连接正是通常的四向网格连接。 每个 DFS 都会发现一整个油区。 

其复杂度为：```
O(n * m)
```因为每个单元格都会被处理固定次数。 

和`n, m ≤ 100`，这已经很舒服地过去了。 

下面还隐藏着一个结构观察。 

假设我们删除几行。 其余行分为连续的行段。 对于列也会发生同样的情况。 

例如：```
rows:    valid valid removed valid valid removed valid
segments:   [1]                [2]                [3]
```每个连接的油组件都是：```
(one row segment) × (one column segment)
```因为在这样的矩形内，所有单元格都存在并连接，而删除的行或列会阻止矩形之间的交叉。 

所以答案等于：```
(number of non-empty row segments)
*
(number of non-empty column segments)
```这完全避免了图遍历。 

暴力解决方案之所以有效，是因为网格很小，但关键的见解是删除完整的行和列会将网格划分为独立的矩形。 一旦我们认识到这种结构，问题就简化为计算连续的存活间隔。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力DFS/BFS | O(纳米) | O(纳米) | 已接受 |
 | 最佳分段计数 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 读取空行和空列的集合。 

我们需要恒定时间检查行或列是否被删除，因此集合或布尔数组是理想的选择。 
2. 计算存在多少个连续的非空行段。 

我们扫描行`1`到`n`。 

每当一行非空并且：```
it is the first row
or
the previous row is empty
```我们开始一个新的行段。 

连续的非空行属于同一个连接的垂直块。 
3. 计算存在多少个连续的非空列段。 

这与行过程相同。 
4. 将两个计数相乘。 

每个行段与每个列段结合形成一个相连的油单元矩形。 
5.自动处理退化情况。 

如果没有幸存的行或没有幸存的列，则计数之一变为`0`，所以最终的答案也是`0`。 

### 为什么它有效

 删除行会产生无法跨越的水平障碍。 拆除柱子会产生无法跨越的垂直障碍。 

在所有移除之后，每个幸存的油细胞都属于一对：```
(row segment, column segment)
```在这样的一对内部，所有单元格形成一个完整的矩形，因此任何两个单元格通过普通的网格移动连接。 

属于不同行段的两个单元格无法连接，因为空行将它们分开。 属于不同列段的两个单元格无法连接，因为空列将它们分开。 

因此连接的组件与以下项一一对应：```
row segments × column segments
```将计数相乘即可得出确切的油区数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    row_data = list(map(int, input().split()))
    t = row_data[0]
    empty_rows = set(row_data[1:])

    col_data = list(map(int, input().split()))
    s = col_data[0]
    empty_cols = set(col_data[1:])

    row_segments = 0

    for i in range(1, n + 1):
        if i not in empty_rows:
            if i == 1 or (i - 1) in empty_rows:
                row_segments += 1

    col_segments = 0

    for j in range(1, m + 1):
        if j not in empty_cols:
            if j == 1 or (j - 1) in empty_cols:
                col_segments += 1

    print(row_segments * col_segments)

solve()
```该实现直接反映了数学结构。 

我们首先将空行和空列存储在集合中。 会员资格检查例如：```
i in empty_rows
```以恒定的预期时间运行。 

行扫描对连续有效间隔的开始进行计数。 仅当当前行存活但前一行不存活时，新段才开始。 

例如：```
rows: valid valid empty valid
```第一个有效行开始一个段，空行后面的行开始另一个段。 

列逻辑是相同的。 

乘法步骤之所以有效，是因为每个行间隔与一个连接矩形中的每个列间隔相交。 

一个微妙的细节是处理完全空的网格。 假设所有行都被删除。 那么没有行满足开始段的条件，所以：```
row_segments = 0
```最终产品自动归零。 不需要特殊情况。 

差一错误的另一个常见来源是索引。 输入使用从 1 开始的行和列编号，因此循环有意从`1`通过`n`和`m`。 

## 工作示例

 ### 示例 1

 输入：```
2 3
1 2
1 2
```行：```
1 = valid
2 = empty
```栏目：```
1 = valid
2 = empty
3 = valid
```### 行扫描

 | 行| 空的？ | 开始新的细分市场？ | 行段 |
 | ---| ---| ---| ---|
 | 1 | 没有 | 是的 | 1 |
 | 2 | 是的 | 没有 | 1 |

 ### 列扫描

 | 专栏 | 空的？ | 开始新的细分市场？ | col_segments |
 | ---| ---| ---| ---|
 | 1 | 没有 | 是的 | 1 |
 | 2 | 是的 | 没有 | 1 |
 | 3 | 没有 | 是的 | 2 |

 最终答案：```
1 × 2 = 2
```剩余的油细胞形成两个不相连的矩形：```
(1,1)
(1,3)
```它们无法连接，因为第 2 列完全是空的。 

### 示例 2

 输入：```
5 5
1 3
1 3
```行：```
1-2 valid
3 empty
4-5 valid
```栏目：```
1-2 valid
3 empty
4-5 valid
```### 行扫描

 | 行| 空的？ | 开始新的细分市场？ | 行段 |
 | ---| ---| ---| ---|
 | 1 | 没有 | 是的 | 1 |
 | 2 | 没有 | 没有 | 1 |
 | 3 | 是的 | 没有 | 1 |
 | 4 | 没有 | 是的 | 2 |
 | 5 | 没有 | 没有 | 2 |

 ### 列扫描

 | 专栏 | 空的？ | 开始新的细分市场？ | col_segments |
 | ---| ---| ---| ---|
 | 1 | 没有 | 是的 | 1 |
 | 2 | 没有 | 没有 | 1 |
 | 3 | 是的 | 没有 | 1 |
 | 4 | 没有 | 是的 | 2 |
 | 5 | 没有 | 没有 | 2 |

 最终答案：```
2 × 2 = 4
```空行和空列将棋盘分为四个不相连的象限。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | 对行和列的一次线性扫描 |
 | 空间| O(n + m) | 设置存储删除的行和列 |

 限制非常小，因此即使是完整的图遍历也可以轻松通过。 这种优化的解决方案仍然有用，因为它捕获了问题的实际结构，而不是将其视为通用连接任务。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    row_data = list(map(int, input().split()))
    empty_rows = set(row_data[1:])

    col_data = list(map(int, input().split()))
    empty_cols = set(col_data[1:])

    row_segments = 0

    for i in range(1, n + 1):
        if i not in empty_rows:
            if i == 1 or (i - 1) in empty_rows:
                row_segments += 1

    col_segments = 0

    for j in range(1, m + 1):
        if j not in empty_cols:
            if j == 1 or (j - 1) in empty_cols:
                col_segments += 1

    print(row_segments * col_segments)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided sample
assert run("2 3\n1 2\n1 2\n") == "2", "sample 1"

# minimum grid, all oil
assert run("1 1\n0\n0\n") == "1", "single oil cell"

# completely empty grid
assert run("2 2\n2 1 2\n0\n") == "0", "all rows removed"

# cross split into four components
assert run("5 5\n1 3\n1 3\n") == "4", "four quadrants"

# alternating empty columns
assert run("3 5\n0\n2 2 4\n") == "3", "three vertical strips"

# large contiguous surviving block
assert run("100 100\n1 50\n1 50\n") == "4", "large grid split once"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1×1`没有任何搬迁|`1`| 最小的非空网格 |
 | 删除所有行 |`0`| 不存在油细胞|
 | 单个删除的行和列 |`4`| 乘法组件结构 |
 | 交替空列 |`3`| 多列段 |
 |`100×100`分裂一次|`4`| 大边界尺寸输入|

 ## 边缘情况

 考虑每行都是空的情况：```
2 3
2 1 2
0
```行扫描期间：```
row 1 -> empty
row 2 -> empty
```没有创建行段，因此：```
row_segments = 0
```列仍然形成一个段，但是：```
0 × 1 = 0
```这是正确的，因为没有油细胞​​残留。 

现在考虑完全不删除：```
3 3
0
0
```所有行都属于一个连续的行段，所有列都属于一个连续的列段。 

所以：```
1 × 1 = 1
```整个网格已连接。 

最后，考虑分隔的有效区间：```
7 1
2 3 6
0
```幸存的行是：```
1-2, 4-5, 7
```这将创建三个行段。 

由于只有一列幸存下来，因此存在一个列段。 

所以答案就变成了：```
3 × 1 = 3
```当幸存行跟随已删除行时，该算法会准确检测每个新段，从而正确处理孤立行和多个间隙。
