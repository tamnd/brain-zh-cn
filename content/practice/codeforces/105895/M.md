---
title: "CF 105895M - \u732b\u5a18\u90e8\u7f72"
description: "我们有一个小网格，最大为 8 x 8，其中每个单元格要么是允许的，要么是禁止的。 允许的单元格包含一只猫并标有 Y 等字符，而禁止的单元格则标记为 N。"
date: "2026-06-21T15:15:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105895
codeforces_index: "M"
codeforces_contest_name: "The 21st Southeast University Programming Contest (Summer)"
rating: 0
weight: 105895
solve_time_s: 46
verified: true
draft: false
---

[CF 105895M - \u732b\u5a18\u90e8\u7f72](https://codeforces.com/problemset/problem/105895/M)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个小网格，最大为 8 x 8，其中每个单元格要么是允许的，要么是禁止的。 允许的单元格包含一只猫并标有类似字符`Y`，而禁止单元格标记为`N`。 任务是将尽可能多的猫女放置在允许的单元格上，限制条件是放置的两个猫女不能水平或垂直相邻。 

这基本上是删除了一些顶点的网格图上的最大独立集问题。 每个单元格如果可用的话就是一个顶点，边连接正交相邻的单元格。 我们想要选择可用顶点的最大子集，以便没有边同时选择两个端点。 

约束 n, m ≤ 8 是关键的结构信号。 网格最多有 64 个单元，这会立即排除在不进行修剪的情况下对所有单元子集进行一般指数搜索的可能性。 朴素的子集枚举最多会考虑 2^64 个状态，即使采用积极的修剪，这也太大了。 同时，小宽度强烈表明行或列上的配置文件动态编程或位掩码 DP。 

打破贪婪直觉的一个微妙情况是局部最优布局阻塞了未来的密集区域。 例如，在 2x3 全`Y`网格，贪婪地放置在棋盘图案中可能会错过在行之间移动密度的配置。 

另一个极端情况是当所有单元格都处于`N`除了像对角线这样的稀疏结构。 任何解决方案都必须尊重邻接仅是水平和垂直的，因此对角线放置不会干扰并且都应该被允许。 

## 方法

 强力方法将尝试网格单元的所有子集，并通过扫描所有对或检查邻接约束来检查有效性。 这在概念上很简单：选择一个子集，验证没有两个选定的单元格相邻，并计算大小（如果有效）。 正确性很简单，因为它直接编码了问题的定义。 

然而，子集的数量以 2^(n·m) 的形式增长。 在8×8网格的最坏情况下，这是2^64，这是完全不可行的。 即使每个子集的有效性检查是 O(64)，总工作量也是天文数字。 

关键的观察结果是邻接是局部的并且网格很窄。 我们不是独立地决定所有单元格，而是逐行处理并将每个行选择编码为位掩码。 行的有效配置是没有两个选定单元格水平相邻的配置。 然后，连续行之间的兼容性强制垂直相邻的单元格不会同时被选择。 

这将问题转换为行上的配置文件 DP，其中每个状态都是行的有效位掩码，并且转换仅取决于相邻行。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 对子集的暴力破解 | O(2^(nm) · nm) | O(2^(nm) · nm) | O(纳米) | 太慢了|
 | 具有位掩码状态的行 DP | O(n·2^m·2^m) | O(n·2^m·2^m) | O(2^m) | O(2^m) | 已接受 |

 ## 算法演练

 我们独立处理每一行，并使用长度为 m 的位掩码表示行中的选择。 如果我们在该列中放置一个猫女孩，那么位就是 1。 

1. 对于每一行，枚举从 0 到 2^m − 1 的所有位掩码，并仅保留行内有效的位掩码。 如果掩码未将两个 catgirls 放置在相邻列中（这意味着没有两个连续位为 1），并且它仅将 catgirls 放置在包含以下内容的单元格上，则该掩码有效：`Y`。 这确保我们永远不会违反水平邻接或放置在禁止的单元格上。 
2. 对于每一行，预先计算哪些掩码与该行的网格约束兼容。 我们为每一行存储有效掩码的列表及其相应的选定单元格计数。 
3. 定义 DP，其中 dp[row][mask] 是如果我们为该行选择配置掩码，则我们可以放置到该行的最大猫女孩数量。 
4. 通过将 dp[0][mask] 设置为所有有效掩码的掩码中设置的位数，初始化第 0 行的 dp。 
5. 对于每个后续行，从每个有效的先前掩码转换到每个有效的当前掩码，但前提是这两个掩码不垂直重叠。 这意味着没有列在两个掩码中都为 1，因为这会将猫女孩放置在同一列的相邻行中。 
6. 将 dp[row][cur_mask] 更新为 dp[row-1][prev_mask] 的所有兼容先前掩码的最大值加上 cur_mask 的 popcount。 
7. 答案是所有 dp[last_row][mask] 中的最大值。 

我们可以有效地做到这一点的原因是，每一行仅依赖于前一行，因此状态会折叠到可管理的 2^m 空间，而不是所有单元格的指数。 

### 为什么它有效

 DP 状态完全捕获未来决策所需的唯一相关历史记录，即前一行所选择的配置。 任何较早的行仅通过它们对已存储在 DP 值中的总计数的贡献来影响未来。 兼容性检查强制不发生垂直或水平邻接违规，因此每个转换都保持有效性。 由于每个有效的全局布局恰好对应于一个行掩码序列，并且考虑了所有此类序列，因此保证能找到最大值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def valid_masks(row_str, m):
    masks = []
    for mask in range(1 << m):
        ok = True
        for j in range(m):
            if (mask >> j) & 1:
                if row_str[j] == 'N':
                    ok = False
                    break
                if j > 0 and (mask >> (j - 1)) & 1:
                    ok = False
                    break
        if ok:
            cnt = bin(mask).count("1")
            masks.append((mask, cnt))
    return masks

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    row_masks = [valid_masks(grid[i], m) for i in range(n)]

    prev = {0: 0}

    for i in range(n):
        curr = {}
        for cmask, ccnt in row_masks[i]:
            best = 0
            for pmask, pval in prev.items():
                if pmask & cmask == 0:
                    best = max(best, pval + ccnt)
            curr[cmask] = max(curr.get(cmask, 0), best)
        prev = curr

    print(max(prev.values()))

if __name__ == "__main__":
    solve()
```该解决方案为每一行构建尊重水平邻接并避免禁止单元的所有配置。 DP词典`prev`存储前一行的每个掩码的最佳可实现值。 

转换检查`pmask & cmask == 0`，逐列强制执行垂直邻接约束。 如果两行都将猫女放在同一列，则它们将垂直相邻，这是禁止的。 

基于字典的 DP 完全避免了对无效状态的迭代，这在较小的约束下使实现变得简单。 由于 m ≤ 8，每行掩码的数量最多为 256 个，这是非常易于管理的。 

## 工作示例

 考虑一个小的 3×3 网格：```
YYY
YNY
YYY
```我们跟踪每行的 DP。 

### 第 0 行

 | 面膜| 有效 | 计数| DP |
 | --- | --- | --- | --- |
 | 000 | 000 是的 | 0 | 0 |
 | 001| 是的 | 1 | 1 |
 | 010| 是的 | 1 | 1 |
 | 100 | 100 是的 | 1 | 1 |
 | 101 | 101 是的 | 2 | 2 |
 | 110 | 110 是的 | 2 | 2 |

 ### 第 1 行（中间行有中心遮挡）

 有效掩码不包括任何设置了中心位的掩码。 

| 面膜| 有效 | 计数|
 | --- | --- | --- |
 | 000 | 000 是的 | 0 |
 | 001| 是的 | 1 |
 | 010| 没有| - |
 | 100 | 100 是的 | 1 |
 | 101 | 101 是的 | 2 |
 | 110 | 110 没有| - |

 过渡结合了兼容的蒙版。 例如，由于列重叠，第 1 行中的掩码 101 无法与第 0 行掩码 101 配对，但可以根据约束与 010 或 001 配对。 

DP 通过取最大兼容和来演化。 

### 第 2 行

 与第 0 行相同，但转换仅取决于第 1 行结果。 

此跟踪显示决策是按行本地化的，并且仅通过列重叠才会出现冲突。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·4^m) | O(n·4^m) | 对于每一行，我们都会针对所有先前的掩码尝试所有有效的掩码，每个掩码最多 2^m |
 | 空间| O(2^m) | O(2^m) | 我们仅存储先前行状态的 DP |

 由于 m ≤ 8、4^m ≤ 65536 和 n ≤ 8，因此总工作量对于 2 秒的限制来说足够小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def valid_masks(row_str, m):
        masks = []
        for mask in range(1 << m):
            ok = True
            for j in range(m):
                if (mask >> j) & 1:
                    if row_str[j] == 'N':
                        ok = False
                        break
                    if j > 0 and (mask >> (j - 1)) & 1:
                        ok = False
                        break
            if ok:
                cnt = bin(mask).count("1")
                masks.append((mask, cnt))
        return masks

    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]
    row_masks = [valid_masks(grid[i], m) for i in range(n)]

    prev = {0: 0}
    for i in range(n):
        curr = {}
        for cmask, ccnt in row_masks[i]:
            best = 0
            for pmask, pval in prev.items():
                if pmask & cmask == 0:
                    best = max(best, pval + ccnt)
            curr[cmask] = max(curr.get(cmask, 0), best)
        prev = curr

    return str(max(prev.values()))

# provided sample (structure inferred)
assert run("4 4\nYYYY\nYYNN\nNYNY\nYYYY\n") == "7"

# all blocked
assert run("2 2\nNN\nNN\n") == "0"

# single row all valid
assert run("1 5\nYYYYY\n") == "3"

# checkerboard free placement
assert run("3 3\nYYY\nYYY\nYYY\n") == "5"

# sparse diagonal
assert run("3 3\nYNN\nNYN\nNNY\n") == "3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 全N格| 0 | 空可行性|
 | 单排| 最大独立行集| 水平约束|
 | 全格| 冲突密集| DP 正确性 |
 | 对角线| 没有邻接交互| 垂直/水平分离|

 ## 边缘情况

 完全阻塞的网格可以被干净地处理，因为每行只有掩码 0 有效。 DP 永远不会超过零并返回 0。 

单行网格简化为选择一行中不相邻的单元格。 行掩码生成强制没有连续位，因此 DP 正确折叠为 1D 最大独立集。 

像这样的对角线图案```
YNN
NYN
NNY
```确保垂直邻接永远不会触发。 每行独立地允许单个放置，并且由于永远不会发生列重叠，因此 DP 累积所有三个放置。
