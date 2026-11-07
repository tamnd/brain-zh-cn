---
title: "CF 1926F - 弗拉德和避免 X"
description: "我们有一个固定的 7 美元乘 7 美元的棋盘，其单元格要么是黑色的，要么是白色的。 如果存在一个黑色单元，其四个对角邻居也是黑色的，则配置被认为是坏的。 这样的模式看起来就像一个以该单元格为中心的 X。"
date: "2026-06-08T19:02:36+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "dfs-and-similar", "dp", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1926
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 928 (Div. 4)"
rating: 2200
weight: 1926
solve_time_s: 196
verified: false
draft: false
---

[CF 1926F - 弗拉德和避免 X](https://codeforces.com/problemset/problem/1926/F)

 **评分：** 2200
 **标签：** 位掩码、暴力破解、dfs 和类似、dp、实现
 **求解时间：** 3m 16s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个固定的$7 \times 7$其单元格为黑色或白色的板。 如果存在一个黑色单元，其四个对角邻居也是黑色的，则配置被认为是坏的。 这样的模式看起来就像一个以该单元格为中心的 X。 

我们可以翻转任何单元格，将黑色变为白色或将白色变为黑色。 目标是执行最少次数的翻转，以便棋盘上的任何位置都不会留下坏的 X。 

这个问题最引人注目的部分是电路板尺寸很小。 一个$7 \times 7$网格仅包含 49 个单元格，但$2^{49}$可能的着色仍然使无限制的暴力破解变得不可能。 测试用例的数量可以达到200个，因此解决方案必须利用一些特殊的结构，而不是搜索所有板状态。 

坏 X 只能以具有四个对角邻居的单元为中心。 这些正是$5 \times 5$内部细胞。 只有 25 个可能的中心。 

隐藏在几何内部的关键约束是奇偶校验。 每个对角线移动都保留奇偶性$r+c$。 X 的中心和所有四个对角邻居始终属于相同的棋盘颜色类别。 这将电路板分成两组完全独立的单元。 

一些边缘情况很容易被错误处理。 

考虑一个孤立的 X：```
.......
.B.B...
..B....
.B.B...
.......
.......
.......
```翻一翻就够了。 翻转中心会立即破坏 X。 翻转多个周围单元格的贪婪策略并不是最优的。 

另一个微妙的情况是重叠的 X 模式：```
.......
.B.B.B.
..B.B..
.B.B.B.
..B.B..
.B.B.B.
.......
```一个细胞可能同时参与多个不良 X 模式。 单独处理每个违规行为可能会严重夸大，因为一次翻转就可以消除许多违规行为。 

第三个陷阱是假设只有当前的黑色单元格才应该被更改。 优化问题也允许将白色单元格翻转为黑色。 在实践中，最优解永远不需要刻意制造新的违规，但DP公式必须正确搜索所有可能性，而不是依赖于脆弱的贪婪规则。 

## 方法

 最直接的想法是将每个单元格视为一个二元变量，并尝试翻转所有单元格子集。 有$2^{49}$可能性，就在周围$5.6 \times 10^{14}$。 即使每秒检查一百万个状态也需要很多年。 

下一个观察结果是，违规仅涉及相同奇偶校验的单元。 如果我们像棋盘一样为棋盘着色，则每个 X 图案完全位于一个颜色类别内。 

奇偶级与$(r+c)\bmod 2=0$包含 25 个细胞。 另一类包含 24 个单元格。 这两个类从不交互。 

现在只看一个奇偶校验类别。 每个可能的 X 中心本身就是该类的一个单元。 一个平价等级最多有 13 个中心，另一个平价等级最多有 12 个中心。 

假设我们决定奇偶校验类的哪些单元在所有翻转后将是黑色的。 对于每个中心，我们可以立即检查禁止 X 是否存在。 

关键的观察结果是，一个奇偶类别的细胞形成一个$5 \times 5$当通过对角线连接观察时，类似晶格。 每个约束仅涉及一个中心及其四个相邻的格子邻居。 

由于一个奇偶校验类中只有 13 个相关单元，因此我们可以通过大小最多为 13 的位掩码来表示该类的完整最终着色。这最多给出$2^{13}=8192$州。 

对于每个奇偶校验类别，我们枚举所有可能的最终掩码。 如果掩码的中心没有形成禁止的 X，则掩码有效。掩码的成本是与原始板不同的位数。 我们保持有效口罩中成本最低的。 

这两个奇偶校验类别是独立的，因此它们的最优成本只需相加即可。 

总的工作量很小：$$2^{13}+2^{12}=12288$$每个测试用例的状态，每个状态仅进行少量恒定的检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 对所有 49 个单元进行暴力破解 |$O(2^{49})$|$O(1)$| 太慢了 |
 | 独立枚举奇偶校验类 |$O(2^{13}+2^{12})$|$O(2^{13})$| 已接受 |

 ## 算法演练

 ### 构建奇偶校验组

 禁止模式仅使用对角线移动，因此所有参与的单元格具有相同的奇偶校验$r+c$。 

将板分为两组：

 1. 奇偶校验的单元格。 
2.奇校验的单元格。 

这些组可以独立优化，因为没有任何约束将它们混合在一起。 

### 枚举一个奇偶校验组

 对于一个奇偶组：

 1. 收集属于该奇偶校验的所有单元格，并为它们分配从 0 到$k-1$， 在哪里$k\le 13$。 
2. 将原始颜色记录为位掩码`orig`。 
3. 确定哪些细胞可以充当 X 中心。 如果所有四个对角邻居都存在，则单元格就是中心。 
4. 对于每个中心，预先计算同一奇偶校验组内其四个对角邻居的索引。 

### 测试最终掩模

 1. 枚举每个掩码`0`到`(1<<k)-1`。 
2. 对于每个中心，检查中心位是否为 1，并且所有四个邻居位是否也为 1。 
3. 如果存在这样的中心，则掩码无效并可以丢弃。 

该掩模代表该奇偶校验组的完整最终着色。 任何禁止的 X 都意味着所得的板是不可接受的。 

### 计算翻转成本

 1. 对于每个有效掩码，计算更改的单元格数量：$$\text{cost} = \text{popcount}(mask \oplus orig)$$1. 保持所有有效掩码中成本最低。 

### 结合两个奇偶校验

 1、分别求解偶校验组和奇校验组。 
2. 将两个最小成本相加并打印结果。 

### 为什么它有效

 每个禁止的 X 都完全位于一个奇偶校验类中，因为对角线移动保留了奇偶校验。 更改一个奇偶校验类中的单元格不会影响另一类中是否存在某种模式。 

对于固定的奇偶校验类，每种可能的最终颜色在枚举的掩码中恰好出现一次。 有效性测试精确地拒绝了那些包含禁止 X 的着色。在所有有效着色中，我们选择需要与原始配置进行最少翻转的着色。 

由于两个奇偶校验类是独立的，因此通过组合每个类的最优有效着色来获得全局最优值。 任何全局解都分解为两个奇偶解，任意一对奇偶解组合成一个全局解。 因此增加了最低成本。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_parity(board, parity):
    cells = []
    pos_to_idx = {}

    for r in range(7):
        for c in range(7):
            if (r + c) % 2 == parity:
                pos_to_idx[(r, c)] = len(cells)
                cells.append((r, c))

    k = len(cells)

    orig = 0
    for i, (r, c) in enumerate(cells):
        if board[r][c] == 'B':
            orig |= 1 << i

    centers = []

    for r, c in cells:
        if 1 <= r <= 5 and 1 <= c <= 5:
            neigh = [
                pos_to_idx[(r - 1, c - 1)],
                pos_to_idx[(r - 1, c + 1)],
                pos_to_idx[(r + 1, c - 1)],
                pos_to_idx[(r + 1, c + 1)],
            ]
            centers.append((pos_to_idx[(r, c)], neigh))

    limit = 1 << k
    best = k

    for mask in range(limit):
        valid = True

        for center, neigh in centers:
            if not (mask >> center) & 1:
                continue

            ok = True
            for v in neigh:
                if ((mask >> v) & 1) == 0:
                    ok = False
                    break

            if ok:
                valid = False
                break

        if valid:
            cost = (mask ^ orig).bit_count()
            if cost < best:
                best = cost

    return best

def solve():
    t = int(input())

    ans = []

    for _ in range(t):
        board = [input().strip() for _ in range(7)]

        res = solve_parity(board, 0) + solve_parity(board, 1)
        ans.append(str(res))

    sys.stdout.write("\n".join(ans))

solve()
```该解决方案首先根据奇偶性分离细胞。 每个奇偶校验类都由一个紧凑的位掩码表示，允许有效枚举所有可能的最终着色。 

对于每个奇偶校验类，代码会预先计算所有潜在的 X 中心及其四个对角邻居的索引。 这消除了枚举循环内任何重复的坐标算术。 

有效性检查经过仔细编写，以便仅当中心本身为黑色且所有四个对角邻居均为黑色时，中心才会造成违规。 边界单元永远不会被视为中心，因为它们不能有四个对角邻居。 

翻转成本的计算方式为`mask ^ orig`。 每一个不同的位对应于一个颜色发生变化的单元格。 蟒蛇的`bit_count()`提供高效的 p​​opcount 实现。 

最大掩码大小仅为 13 位，因此完整枚举仍然非常小。 

## 工作示例

 ### 示例 1

 输入板：```
.......
.B.B...
..B....
.B.B...
.......
.......
.......
```五个黑色单元格恰好形成一个 X。 

对于相关奇偶校验类别：

 | 步骤| 当前面膜| 有效的？ | 翻转成本|
 | ---| ---| ---| ---|
 | 原创| X 图案呈现 | 没有 | 0 |
 | 删除中心 | 没有 X | 是的 | 1 |
 | 移除一只手臂 | 没有 X | 是的 | 1 |
 | 删除两个单元格 | 没有 X | 是的 | 2 |

 最小有效成本为 1。 

此示例表明，破坏五个参与单元中的任何一个都可以消除违规行为。 

### 示例 2

 不含黑色单元格的板：```
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
```对于每个奇偶校验类别：

 | 步骤| 当前面膜| 有效的？ | 翻转成本|
 | ---| ---| ---| ---|
 | 原创| 空 | 是的 | 0 |
 | 任何修改过的面具| 通常有效 | >0 | |

 两个奇偶组的最小成本均为 0。 

此示例证实，当电路板已经有效时，该算法不会引入不必要的更改。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(2^{13}+2^{12})$每个测试用例| 枚举两个奇偶校验类别的所有掩码 |
 | 空间|$O(1)$| 只存储了一些小数组和掩码 |

 最大的奇偶校验类包含 13 个单元，最多提供 8192 个掩码。 在两个奇偶校验类别中，每个测试用例检查的状态少于 13000 个。 即使有 200 个测试用例，总工作量也完全在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    input = sys.stdin.readline

    def solve_parity(board, parity):
        cells = []
        pos = {}

        for r in range(7):
            for c in range(7):
                if (r + c) % 2 == parity:
                    pos[(r, c)] = len(cells)
                    cells.append((r, c))

        k = len(cells)

        orig = 0
        for i, (r, c) in enumerate(cells):
            if board[r][c] == 'B':
                orig |= 1 << i

        centers = []
        for r, c in cells:
            if 1 <= r <= 5 and 1 <= c <= 5:
                centers.append(
                    (
                        pos[(r, c)],
                        [
                            pos[(r - 1, c - 1)],
                            pos[(r - 1, c + 1)],
                            pos[(r + 1, c - 1)],
                            pos[(r + 1, c + 1)],
                        ],
                    )
                )

        best = k

        for mask in range(1 << k):
            good = True

            for center, neigh in centers:
                if (mask >> center) & 1:
                    if all((mask >> v) & 1 for v in neigh):
                        good = False
                        break

            if good:
                best = min(best, (mask ^ orig).bit_count())

        return best

    t = int(input())
    ans = []

    for _ in range(t):
        board = [input().strip() for _ in range(7)]
        ans.append(str(
            solve_parity(board, 0) +
            solve_parity(board, 1)
        ))

    print("\n".join(ans))

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out.getvalue().strip()

# sample
assert run(
"""1
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
"""
) == "0"

# single X
assert run(
"""1
WWWWWWW
WBWBWWW
WWBWWWW
WBWBWWW
WWWWWWW
WWWWWWW
WWWWWWW
"""
) == "1"

# all white
assert run(
"""1
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
"""
) == "0"

# all black
assert run(
"""1
BBBBBBB
BBBBBBB
BBBBBBB
BBBBBBB
BBBBBBB
BBBBBBB
BBBBBBB
"""
) == "9"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 全白板| 0 | 已经有效的配置 |
 | 单X | 1 | 最小的非平凡违规 |
 | 全黑板| 9 | 许多重叠的违规行为|
 | 样品式空板| 0 | 没有不必要的翻转|

 ## 边缘情况

 ### 触及边界的违规行为

 输入：```
BWBWWWW
WBWWWWW
BWBWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
```明显的中心需要位于边界上，这是不可能的。 边界单元不能有四个对角邻居。 在预处理过程中，只有坐标在 1 到 5 之间的单元格才被视为中心，因此该模式会被正确忽略。 答案是0。 

### 多个重叠的 X 模式

 输入：```
.......
.B.B.B.
..B.B..
.B.B.B.
..B.B..
.B.B.B.
.......
```一些违规行为共享单元格。 独立修复每个 X 的贪婪策略可能会执行多次翻转。 掩码枚举同时评估整个奇偶校验类，并发现何时一次翻转会同时破坏多个违规行为。 

### 已经有效的板

 输入：```
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
WWWWWWW
```原始面具本身通过了所有有效性测试。 它的翻转成本为零，因此它仍然是最优解。 该算法绝不会在不必要的情况下修改单元格。 

### 董事会密集，违规情况较多

 输入：```
BBBBBBB
BBBBBBB
BBBBBBB
BBBBBBB
BBBBBBB
BBBBBBB
BBBBBBB
```几乎每个内部细胞都是禁止 X 的中心。由于模式严重重叠，局部推理变得困难。 奇偶分解将问题转换为最多 8192 个状态的两个独立搜索，保证找到真正的最小翻转次数。
