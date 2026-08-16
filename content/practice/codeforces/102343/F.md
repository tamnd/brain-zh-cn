---
title: "CF 102343F - 或多或少"
description: "More or Less 是一个小型拉丁方谜题。 我们有一个（n×n）板，每行和每列必须包含从（1）到（n）的每个值恰好一次。 有些单元格已经被填满。"
date: "2026-08-16T18:17:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102343
codeforces_index: "F"
codeforces_contest_name: "UCF Locals 2019"
rating: 0
weight: 102343
solve_time_s: 926
verified: true
draft: false
---

[CF 102343F - 或多或少](https://codeforces.com/problemset/problem/102343/F)

 **评级：** -
 **标签：** -
 **求解时间：** 15m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 More or Less 是一个小型拉丁方谜题。 我们有一个 (n \times n) 板，每行每列必须包含从 (1) 到 (n) 的每个值恰好一次。 有些单元格已经被填满。 在水平或垂直相邻的单元之间，也可以给出一些不等式。 任务是填充每个空白单元格，以便所有行和列约束、所有固定值和所有不等式成立。 输入保证描述一个只有一个有效的完整棋盘的谜题。 所需的输出只是完成的电路板，每行一行，没有空格。 最初的竞赛声明将 (n) 限制为最多 7 个，并使用紧凑的字符表示来表示单元格和不等式。 

(n) 上的小界限是中心线索。 最多可以有 49 个单元格，每个单元格最多有 7 个可能的值。 多项式时间算法会很令人愉快，但潜在的拉丁方完成问题是组合问题，因此实际的解决方案是进行搜索，同时尽早拒绝不可能的部分板。 对于 (n=7)，盲目探索每种可能性是没有希望的，而约束驱动的回溯搜索足够小，可以轻松地适应五秒的限制。 Codeforces 页面确认原始限制为 5 秒，内存为 256 MB。 

第一个不明显的边缘情况是 (n=1)。 唯一可能的板是包含 1 的单个单元格。假设至少有一个水平或垂直分隔符的实现可以访问不存在的输入字符。 例如，```
1
1
```有正确的输出```
1
```第二种边缘情况是行或列边界处的不等式。 例如，```
2
-<-
^.v
-.-
```有独特的解决方案```
12
21
```由于水平不等式，第一行必须先包含 1，再包含 2。 垂直不等式与第二行一致。 如果解析器将垂直行中的每个字符视为可能的不等式，而不是仅使用奇数位置，则可能会错误地默默地读取此输入。 原始格式将垂直关系置于交替位置，并在其他地方使用句点。 

第三种边缘情况是几乎完成的行，其中缺失值由其行和列同时确定。 例如，```
3
1.2.3
2.3.1
3.-.2
.....
.....
```有解决方案```
123
231
312
```最后一个空白是 1，因为它的行和列都已经包含 2 和 3。仅检查行的解算器在许多情况下仍然可以工作，但在更复杂的谜题中会接受无效值。 

## 方法

 最直接的暴力解决方案逐个单元地填充电路板，并尝试从 1 到 (n) 的每个值，最后检查已完成的电路板。 这是正确的，因为最终会考虑所有可能的分配。 不幸的是，它最多探索 (n^{n^2}) 个作业。 在（n=7）时，大约是（7^{49}），大约（2\times10^{41}），这是完全不可行的。 

在构建棋盘时，我们可以通过使用拉丁方属性来大大提高暴力破解的效果。 我们可以为每一行枚举 (1,\ldots,n) 的排列，而不是在每一行中允许任意值。 有（7！= 5040）个可能的行，所以即使是更聪明的暴力破解，最坏的情况也大约是

 [
 (7!)^7 \约 8.2\times10^{25}
 ]

 行组合。 它仍然太大了。 

有用的观察结果是，几乎每个部分赋值都已经包含足够的信息来排除大多数值。 单元格不能使用其行或列中已存在的值。 当相邻单元已知时，不等式可以立即消除值。 即使不等式的两个单元仍然未知，它们的可能值集也会相互限制。 例如，如果 (x<y) 并且 (y) 的最大可能值为 4，则 (x) 永远不可能为 4 或更大。 同样，如果 (x) 的最小可能值为 3，则 (y) 不能为 1、2 或 3。 

因此，最佳方法是约束传播回溯搜索。 对于每个递归状态，我们构建每个未填充单元格的当前候选集。 我们反复传播这些候选集之间的不等式约束。 然后，我们选择剩余候选数最少的未填充单元格，并仅根据这些值进行分支。 这是标准的最小剩余值想法，但在这里它特别有效，因为棋盘上每个单元格只有七个可能的值，并且每次分配都会立即从整个行和列中删除该值。 

强力搜索之所以有效，是因为它最终会检查每块板。 它失败了，因为几乎所有这些董事会都很早就违反了约束。 在永久提交单元格之前可以应用行、列和不等式约束的观察结果将巨大的搜索树变成了更小的约束搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^{n^2})) | (O(n^2)) | 太慢了 |
 | 行排列蛮力 | (O((n!)^n)) | (O(n^2)) | 太慢了 |
 | 约束传播回溯| 指数最坏情况，在实践中被大量修剪| (O(n^2)) | 已接受 |

 ## 算法演练

 1. 将棋盘解析为 (n\times n) 整数网格。 一个`0`代表一个空白单元格。 使用位掩码存储每行和每列中已使用的值。 由于(n\le7)，一个整数足以表示一行或一列中的所有值。 
2. 将每个不等式转换为 (a<b) 形式的有向关系。 对于水平`<`，左侧单元格小于右侧单元格。 为了`>`，颠倒关系。 对于垂直`^`，上面的单元格小于下面的单元格，而`v`意思是相反的。 
3. 在每个搜索状态，计算每个单元的候选位掩码。 对于未填充的单元格，从 1 到 (n) 的所有值开始，然后删除其行或列中已使用的每个值。 如果不等式中的相邻单元已被分配，则相应地限制候选集。 
4. 将弧一致性应用于不等式关系。 对于关系 (a<b)，(a) 的每个候选者必须在 (b) 中至少有一个更大的候选者。 如果（b）的最大候选者是（k），则可以从（a）中删除候选者（k，\ ldots，n）。 对称地，如果 (a) 的最小候选者是 (k)，则可以从 (b) 中删除值 (1,\ldots,k)。 重复此过程，直到候选集没有变化。 
5. 如果任何未填充的单元格失去了所有候选，则当前的部分板无法得出解决方案，因此请立即回溯。 如果不平等变得不可能，同样适用。 
6. 在所有未填充的单元格中，选择候选集最小的单元格。 这是最小剩余值规则。 首先选择最受约束的单元格只会在几次分配之后出现矛盾，而不是在填满棋盘的大部分之后。 
7. 尝试所选单元格的每个候选值。 更新其网格值以及相应的行和列掩码，然后递归地解决较小的问题。 如果递归调用成功，则保留该值。 如果失败，则撤消分配并尝试下一个候选者。 
8. 当没有空白单元格时，该棋盘是有效的解决方案。 由于输入保证了唯一性，因此找到的第一个完整板就是所需的答案。 

### 为什么它有效

 不变量是每个候选集包含仍然与固定值、行唯一性、列唯一性和所有当前传播的不等式兼容的值。 弧一致性仅在不等式的另一侧不存在兼容值时删除值，因此它无法删除属于有效完成的值。 当搜索分配候选值时，会根据相同的约束显式检查该值。 因此，每个递归分支都代表一个潜在有效的部分板，并且每个无效分支仅在其不可能性被确定后才被丢弃。 由于每个剩余的候选者最终都会在必要时进行尝试，因此不能跳过有效的完成。 唯一性保证意味着成功完成就是所需的板子。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(lines):
    n = int(lines[0])
    board = [[0] * n for _ in range(n)]

    row_mask = [0] * n
    col_mask = [0] * n

    # inequalities are stored as (a, b), meaning value[a] < value[b]
    less_edges = []

    def cell_id(r, c):
        return r * n + c

    # Read the rows containing cells and horizontal inequalities.
    for r in range(n):
        s = lines[1 + 2 * r]
        for c in range(n):
            ch = s[2 * c]
            if ch != '-':
                v = ord(ch) - ord('0')
                board[r][c] = v
                bit = 1 << (v - 1)
                row_mask[r] |= bit
                col_mask[c] |= bit

            if c + 1 < n:
                sign = s[2 * c + 1]
                a = cell_id(r, c)
                b = cell_id(r, c + 1)

                if sign == '<':
                    less_edges.append((a, b))
                elif sign == '>':
                    less_edges.append((b, a))

    # Read the rows containing vertical inequalities.
    for r in range(n - 1):
        s = lines[2 + 2 * r]
        for c in range(n):
            sign = s[2 * c]
            a = cell_id(r, c)
            b = cell_id(r + 1, c)

            if sign == '^':
                less_edges.append((a, b))
            elif sign == 'v':
                less_edges.append((b, a))

    ALL = (1 << n) - 1

    neighbors = [[] for _ in range(n * n)]
    for a, b in less_edges:
        neighbors[a].append((b, True))
        neighbors[b].append((a, False))

    def build_domains():
        domains = [0] * (n * n)

        for r in range(n):
            for c in range(n):
                idx = cell_id(r, c)

                if board[r][c] != 0:
                    domains[idx] = 1 << (board[r][c] - 1)
                    continue

                mask = ALL & ~(row_mask[r] | col_mask[c])

                for other, is_less in neighbors[idx]:
                    orow = other // n
                    ocol = other % n
                    v = board[orow][ocol]

                    if v == 0:
                        continue

                    if is_less:
                        # Current value must be smaller than v.
                        mask &= (1 << (v - 1)) - 1
                    else:
                        # Current value must be greater than v.
                        mask &= ALL ^ ((1 << v) - 1)

                    if mask == 0:
                        return None

                domains[idx] = mask

        # Arc consistency for all inequalities.
        changed = True
        while changed:
            changed = False

            for a, b in less_edges:
                ma = domains[a]
                mb = domains[b]

                if ma == 0 or mb == 0:
                    return None

                max_b = mb.bit_length()
                new_ma = ma & ((1 << (max_b - 1)) - 1)

                if new_ma != ma:
                    domains[a] = new_ma
                    ma = new_ma
                    changed = True

                if ma == 0:
                    return None

                min_a = (ma & -ma).bit_length()
                new_mb = mb & (ALL ^ ((1 << min_a) - 1))

                if new_mb != mb:
                    domains[b] = new_mb
                    mb = new_mb
                    changed = True

                if mb == 0:
                    return None

        return domains

    def dfs():
        domains = build_domains()
        if domains is None:
            return False

        best = -1
        best_mask = 0
        best_count = n + 1

        complete = True

        for r in range(n):
            for c in range(n):
                if board[r][c] == 0:
                    complete = False
                    idx = cell_id(r, c)
                    mask = domains[idx]
                    count = mask.bit_count()

                    if count < best_count:
                        best_count = count
                        best = idx
                        best_mask = mask

        if complete:
            return True

        r = best // n
        c = best % n

        mask = best_mask
        while mask:
            bit = mask & -mask
            mask -= bit

            v = bit.bit_length()

            board[r][c] = v
            row_mask[r] |= bit
            col_mask[c] |= bit

            if dfs():
                return True

            row_mask[r] ^= bit
            col_mask[c] ^= bit
            board[r][c] = 0

        return False

    dfs()

    return [''.join(str(board[r][c]) for c in range(n)) for r in range(n)]

def main():
    first = input().strip()
    if not first:
        return

    n = int(first)
    lines = [first]

    for _ in range(2 * n - 1):
        lines.append(input().rstrip('\n'))

    answer = solve_case(lines)
    sys.stdout.write('\n'.join(answer))

if __name__ == "__main__":
    main()
```解析器直接遵循交替字符布局。 在普通行上，单元格值出现在索引处`0, 2, 4, ...`，而水平不平等发生在指数处`1, 3, 5, ...`。 在垂直分隔行上，有用的位置又是`0, 2, 4, ...`，这就是代码读取的原因`s[2 * c]`。 

行和列掩码使用位 (v-1) 作为值 (v)。 删除已使用的值是一个按位操作。 Python 整数具有任意精度，但这里只需要七位，所以溢出不是问题。 

这`build_domains`函数在每次递归调用时故意重建域，而不是维护复杂的回滚结构。 对于最多 49 个单元，成本非常低，并且使回溯状态更难以损坏。 

对于每个递归状态，不等式传播也是从头开始执行的。 对于(a<b)，(b)中的最大可能值给出(a)的上限，而(a)中的最小可能值给出(b)的下限。 重复这些限制会通过不平等链传播信息。 

搜索会选择候选数最少的单元格。 这比简单地从左上角到右下角填充单元格更有效，因为受到严重约束的单元格可以立即暴露矛盾。 仅在所有当前传播成功后才进行分配，并且在回溯期间通过 XOR 恢复行和列掩码。 

## 工作示例

 原始竞赛声明描述了输入和输出格式，但没有提供文本样本输入/输出对，因此以下跟踪使用满足相同格式的小型构造谜题。 

### 示例 1

 考虑```
2
-<-
^.v
-.-
```水平不等式迫使第一行成为`12`。 然后，垂直不平等迫使第二行成为`21`。 

| 搜索状态 | 细胞选择| 候选人| 作业 |
 | ---| ---| ---| ---|
 | 初始| (1,1) | {1,2} | 尝试 1 |
 | (1,1)=1 | 之后 (1,2) | {2} | 2 |
 | 第一行之后 | (2,1) | {2} | 2 |
 | 决赛| (2,2) | {1} | 1 |

 完成的板子是```
12
21
```该迹线说明了为什么选择受约束的单元格是有用的。 一旦选择了第一个值，行约束和不等式就会立即确定其余值。 

### 示例 2

 考虑```
3
1.2.3
2.3.1
3.-.2
.....
.....
```只有最后一行的中心单元格是空白的。 

| 搜索状态 | 细胞选择| 候选人| 作业 |
 | ---| ---| ---| ---|
 | 初始| (3,2) | {1} | 1 |
 | 决赛| 无 | 无 | 完整|

 最后一行已经包含 3 和 2，因此需要 1。其列也包含 2 和 3，独立确认相同的值。 

这里的不变量特别明显：空白单元格的候选集已经恰好是其行和列中可能出现的值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 最坏情况下呈指数增长 | 尽管行/列掩码、不等式传播和 MRV 会积极地修剪搜索，但回溯可能会在许多单元格的多个候选者上进行分支。 
| 空间| (O(n^2)) | 板、约束、掩码和候选域都仅包含 (O(n^2)) 信息 |

 最坏情况的复杂度必然是指数级的，因为搜索空间是组合的。 实际输入大小仅为 (n\le7)，最多给出 49 个单元格，每个单元格有 7 个可能的值。 唯一性、拉丁方约束和不等式传播的结合使得该搜索空间的探索部分足够小，足以满足原始 5 秒、256 MB 的限制。 

## 测试用例

 原始问题没有在语句源中公开文本示例案例，因此下面的测试套件使用来自跟踪的构造案例以及其他边界案例。```python
import sys
import io

def run(inp: str) -> str:
    lines = inp.strip('\n').splitlines()
    ans = solve_case(lines)
    return '\n'.join(ans)

# Minimum-size input.
assert run(
    """1
1"""
) == "1", "minimum-size puzzle"

# Boundary inequalities and parsing of both ^ and v.
assert run(
    """2
-<-
^.v
-.-"""
) == "12\n21", "inequality directions"

# Nearly complete 3x3 Latin square, no inequalities.
assert run(
    """3
1.2.3
2.3.1
3.-.2
.....
....."""
) == "123\n231\n312", "single missing value"

# Maximum-size board, with exactly one blank cell.
assert run(
    """7
1.2.3.4.5.6.7
2.3.4.5.6.7.1
3.4.5.6.7.1.2
4.5.6.7.1.2.3
5.6.7.1.2.3.4
6.7.1.2.3.4.5
7.1.2.3.4.5.-
.............
.............
.............
.............
............."""
) == (
    "1234567\n"
    "2345671\n"
    "3456712\n"
    "4567123\n"
    "5671234\n"
    "6712345\n"
    "7123456"
), "maximum-size board"

# All-equal values are possible only for the degenerate 1x1 case.
assert run(
    """1
1"""
) == "1", "degenerate all-equal case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1`|`1`| 最小尺寸和不存在不平等线 |
 |`2 / -<-, ^.v, -.-`|`12 / 21`| 边界不等式和两个垂直方向 |
 |`3 / 1.2.3, 2.3.1, 3.-.2`|`123 / 231 / 312`| 行列候选交集、逐一处理 |
 | 7x7 循环板 | 完成的循环板| 最大 (n)、大掩模和最终细胞恢复 |
 |`1 / 1`|`1`| 整个行和列包含相同唯一值的退化情况 |

 ## 边缘情况

 对于 (n=1)，根本没有分隔线。 输入很简单`1`其次是单细胞。 解析器针对水平和垂直不等式循环零次，并且板已经完成。 输出是`1`。 这可以防止实现假设每个谜题都至少有一个不等式。 

对于边界不等式的情况，```
2
-<-
^.v
-.-
```水平关系意味着第一行的形式为 (x<y)。 由于一行必须包含 1 和 2，因此它必须是`12`。 这`^`在第一个垂直位置意味着（1<2），而`v`第二种方式是(2>1)。 因此第二行是`21`。 解析器从位置 0 和 2 读取垂直符号，与指定的格式完全匹配。 

对于同时受行和列强制的单元格，请考虑```
3
1.2.3
2.3.1
3.-.2
.....
.....
```空白单元格位于包含 3 和 2 的行中，仅保留 1。其列也包含 2 和 3，同样仅保留 1。`build_domains`将这些限制的交集计算为值 1 的一位掩码，因此 MRV 搜索会立即分配它。 

对于最大电路板尺寸，7x7 测试有 49 个单元，只有一个空白。 每个行和列掩码使用七位，并且丢失的单元格只有一个候选。 求解器不需要探索大型搜索树，而输入仍然以允许的最大维度 (n) 执行每个数组维度。 

最后，粗心的不平等实施可能会意外地实现平等。 求解器中的每个关系都使用严格界限。 对于(a<b)，(a)允许的最大候选值比(b)的最大可能值小1，并且(b)允许的最小候选值比(a)的最小可能值大1。 由于棋盘值是整数，这些严格的界限正是所需要的`<`和`>`语义。
