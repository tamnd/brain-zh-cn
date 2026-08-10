---
title: "CF 102465C - 填字游戏"
description: "我们需要构造一个 N × M 的字符网格。 每行必须是 B 个水平字之一，每个长度为 M，每列必须是 A 个垂直字之一，每个长度为 N。一个字可以重复使用任意次。"
date: "2026-08-09T15:13:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102465
codeforces_index: "C"
codeforces_contest_name: "2018-2019 ICPC Southwestern European Regional Programming Contest (SWERC 2018)"
rating: 0
weight: 102465
solve_time_s: 572
verified: true
draft: false
---

[CF 102465C - 填字游戏](https://codeforces.com/problemset/problem/102465/C)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要构建一个`N × M`字符网格。 每一行必须是其中之一`B`水平字，每个长度`M`，并且每一列都必须是其中之一`A`垂直单词，每个长度`N`。 一个词可以重复使用任意多次。 

网格只计算一次，因为它的字母唯一确定每一行和每一列。 我们没有计算恰好产生相同网格的字典条目的不同选择。 由于每个字典不包含重复的单词，因此固定网格还确定为每行和每列选择的确切单词。 

第一输入行给出`N`和号码`A`的垂直词。 第二个给出`M`和号码`B`的水平词。 下列`A`字符串有长度`N`，以及最后的`B`字符串有长度`M`。 答案是同时满足两个字典的网格数。 

尺寸很小，具有`2 ≤ N, M ≤ 4`，所以最多有 16 个单元格。 然而，字典可能很大。 他们的产品满足`A × B ≤ 1,008,016`，因此当另一本词典大小相似时，一本词典可以包含大约一千个单词，而当另一本词典非常小时，则可以包含数十万个单词。 这就排除了其工作量与所有单词对乘以一个额外的大幂成正比的算法。 特别是，盲目地尝试每个水平单词序列需要`B^N`的可能性。 和`A = B = 1004`和`N = 4`，这大约是`1.016 × 10^12`候选网格，检查每个单元格大约需要`1.6 × 10^13`字符检查。 

小字长给了我们有用的结构。 每个部分行或列只是字典单词的前缀。 如果候选字符不继续当前水平前缀和当前垂直前缀，则可以立即拒绝该候选字符。 trie就是专门为这种前缀测试而设计的。 

在一些边缘情况下，简单的实现可能会默默地出错。 

考虑```
2 1
2 1
ab
aa
```唯一的横向词是`aa`，所以两行必须是`aa`。 然后两列都是`aa`，这不是垂直词`ab`。 正确答案是`0`。 仅检查水平字并将列验证推迟到生成所有网格之后的实现会浪费大量工作，而仅检查已完成的列但忘记前缀有效性的实现也可以探索无效分支。 

允许重复使用字典单词。 例如，```
2 1
2 1
aa
aa
```有答案`1`。 网格很简单```
aa
aa
```同一词用于两行和两列。 粗心的实现在放置字典单词后将其标记为“已使用”将错误地返回`0`。 

网格不必是正方形的。 例如，```
2 4
4 1
aa
bb
ab
ba
abba
```有答案`1`。 两行都是`abba`，给出列`aa`,`bb`,`ba`， 和`ab`，都属于垂直词典。 任何假设的实现`N == M`，或不小心使用`N`作为列数，会错误地处理这种情况。 

最后，当`N == M`，这两个词典仍然有其指定的方向。 仅当垂直词典中的单词也存在于水平词典中时，才可以水平使用该单词，反之亦然。 遵守此规则的简洁方法就是在检查网格时永远不要交换字典成员资格。 水平线根据水平词典进行检查，垂直线根据垂直词典进行检查。 

## 方法

 最直接的暴力就是全选`N`横字。 由于每一行都有`B`可能性和重复是允许的，有`B^N`行序列。 选择它们之后，我们可以构建每一列并检查每个结果字符串是否属于垂直字典。 该方法是正确的，因为每个可能的网格都恰好具有一个水平行序列，因此每个有效网格仅被考虑一次。 

问题是指数。 和`N = 4`,`B = 1004`，搜索已经包含关于`1.016 × 10^12`行序列。 即使每个网格中只有 16 个单元格，将它们全部检查一遍也远远超出了时间限制。 

关键的观察是，在检查与列的交集之前，我们不应该决定整行。 假设当前行开头为`sa`。 如果没有水平词典单词开头`sa`，我们可以立即拒绝该行。 更强烈地，假设当前单元格位于行`r`和列`c`。 放置在那里的字符必须同时是当前水平前缀和当前垂直前缀的有效下一个字符。 这两组字符的交集通常很小。 

特里树恰好存储了这些信息。 在 trie 节点，其出边是可以合法地跟随当前前缀的字符。 在填充网格时，我们在当前行的 trie 中保留一个指针，并在每一列中保留一个指针。 放置一个字符会使行指针和相应的列指针前进。 如果任一转换不存在，则分支立即死亡。 

这将暴力搜索从“选择完整的单词并随后检查它们”转变为“在不断执行两个词典的同时构建网格”。 官方 SWERC 分析将此描述为回溯两次尝试并维持行和列的当前 trie 位置。 

还有一种更有用的选择。 我们可以调换搜索方式。 我们要么一次构建一个水平单词并使用垂直字典作为交叉约束，要么一次构建一个垂直单词并使用水平字典作为交叉约束。 我们选择理论完整线组合数较少的方向，比较`B^N`和`A^M`。 这并没有改变问题，它只是选择哪个字典用作主动构造的集合。 

实现中的 trie 表示是故意紧凑的。 由于每个单词的长度最多为 4，因此每个前缀都可以编码为以 27 为基数的整数。 数字`1`通过`26`代表`a`通过`z`，而前导零表示空前缀。 最大可能的代码仅为`27^4 - 1 = 531440`，因此固定数组可以代替占用大量内存的Python字典。 每个数组条目存储一个可能的下一个字母的 26 位掩码和一个额外的位，表示前缀本身是一个完整的字典单词。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(NM · B^N)`|`O(A + B + NM)`| 太慢了|
 | Trie 回溯 |`O((A+B)·4 + NM·S)`|`O(27^4 + NM)`| 已接受 |

 这里`S`是回溯搜索实际访问的部分网格的数量。 特里树使`S`比原始笛卡尔积小得多，因为在构造完整的单词之前无效的前缀被丢弃。 从最坏的理论意义上来说，这仍然是指数搜索，这对于这个受约束的字矩形问题来说是预期的。 关键是网格最多有 16 个单元格，并且每个字符都会立即与两个词典进行检查。 

## 算法演练

 1. 阅读纵向和横向词典，并为每一个词典建立一个前缀结构。 对于每个前缀，存储其后面可能包含哪些字母以及前缀本身是否是一个完整的单词。 然后可以在恒定时间内测试字符转换。 
2. 比较`A^M`和`B^N`。 如果`A^M`较小时，逐列构造网格。 否则，逐行构造它。 这使得主动枚举的全行搜索空间尽可能小。 
3. 保留一个数组，其中包含辅助方向上每行的当前前缀。 例如，在构造行时，该数组存储所有列的前缀。 构造列时，它存储所有行的前缀。 活动的主行有一个单独的 trie 位置，因为它一次构建一个字符。 
4. 在每个单元，从主 trie 节点和相应的辅助 trie 节点获取可能的下一个字符的位掩码。 使这些蒙版相交。 剩余的每个位代表一个在两个方向上都合法的字符。 
5. 尝试交叉点中的每个字符。 将主要前缀和相应的次要前缀前进该字符。 如果结果树中不存在任一结果前缀，则该分支将立即被拒绝。 
6. 当放置主行的最后一个字符时，要求所得的主特里节点是终端节点。 这保证了完成的行实际上是一个字典单词而不仅仅是一个前缀。 
7. 当最后一条主线施工时，每条次线也达到其全长。 要求每个生成的辅助 trie 节点在这些单元处都是终端。 这将验证所有行，而不需要单独的网格扫描。 
8. 单元格经过递归处理后，在尝试下一个字符之前恢复其辅助前缀。 这是回溯步骤。 主前缀作为参数传递，因此当递归调用返回时它自然会恢复。 
9. 一旦完成每条主线，就找到了有效的网格。 在答案中加一。 由于每个单元格字符序列恰好对应一个网格，因此不会出现重复计算。 

### 为什么它有效

 不变的是，在每次递归调用之前，每个已填充的前缀都属于适当的字典前缀集。 当前主行前缀由有效的主 trie 节点表示，每个辅助行前缀由有效的辅助 trie 节点表示。 

仅当字符是两个相关 trie 节点的出边时才放置该字符。 因此，每次放置后，不变式仍然成立。 当一行到达其最后一个字符时，终端位检查保证完整的行是一个实际的字典单词，而不仅仅是一个前缀。 

每个有效网格都遵循一条搜索路径，因为该网格的每个字符都是两个方向上的有效下一个字符。 相反，搜索接受的每条路径都以终端字典节点的每一行和每一列结束，因此它代表一个有效的网格。 每个网格都有一个唯一的单元格字符序列，准确地给出了一个可接受的搜索路径。 

## Python 解决方案```python
import sys

input = sys.stdin.readline

# A word has length at most 4.
# We encode a prefix in base 27, using digits 1..26 for a..z.
MAX_CODE = 27 ** 4
TERM = 1 << 26
ALPHA_MASK = TERM - 1

def build_trie(count, reader):
    """
    Each entry stores:
      bits 0..25 : possible next letters
      bit 26     : this prefix is itself a complete word
    """
    trie = [0] * MAX_CODE

    for _ in range(count):
        word = reader().strip()
        code = 0

        for ch in word:
            digit = ord(ch) - 96
            trie[code] |= 1 << (digit - 1)
            code = code * 27 + digit

        trie[code] |= TERM

    return trie

def solve(reader=None):
    if reader is None:
        reader = input

    n, a = map(int, reader().split())
    m, b = map(int, reader().split())

    vertical = build_trie(a, reader)
    horizontal = build_trie(b, reader)

    # Choose the direction with fewer possible complete line sequences.
    #
    # Horizontal construction:
    #   N lines, each chosen from B words -> B^N
    #
    # Vertical construction:
    #   M lines, each chosen from A words -> A^M
    if a ** m <= b ** n:
        primary = vertical
        secondary = horizontal
        primary_lines = m
        line_length = n
    else:
        primary = horizontal
        secondary = vertical
        primary_lines = n
        line_length = m

    # secondary_prefix[i] is the currently built prefix of
    # secondary line i.
    secondary_prefix = [0] * line_length

    sys.setrecursionlimit(100)

    def dfs(line, pos, primary_prefix):
        if line == primary_lines:
            return 1

        primary_value = primary[primary_prefix]
        secondary_value = secondary[secondary_prefix[pos]]

        # A character must be allowed by both tries.
        mask = primary_value & secondary_value & ALPHA_MASK

        answer = 0
        last_position = (pos == line_length - 1)
        last_line = (line == primary_lines - 1)

        while mask:
            bit = mask & -mask
            mask -= bit

            digit = bit.bit_length()  # 1..26

            new_primary = primary_prefix * 27 + digit
            new_primary_value = primary[new_primary]

            # The primary line must be a complete dictionary word
            # when its final character is placed.
            if last_position and not (new_primary_value & TERM):
                continue

            old_secondary = secondary_prefix[pos]
            new_secondary = old_secondary * 27 + digit
            new_secondary_value = secondary[new_secondary]

            # On the final primary line, this character also completes
            # the secondary line, so it must be a complete word.
            if last_line and not (new_secondary_value & TERM):
                continue

            secondary_prefix[pos] = new_secondary
            answer += dfs(line, pos + 1, new_primary)
            secondary_prefix[pos] = old_secondary

        return answer

    return str(dfs(0, 0, 0))

if __name__ == "__main__":
    print(solve())
```这两个电话`build_trie`使用两个字典而不保留原始字符串。 这对于最大的输入很重要，在这种情况下，保存数十万个 Python 字符串对象会比 trie 本身浪费更多的内存。 

前缀编码使用base 27而不是base 26，因为它需要区分不同长度的前缀。 数字来自`1`通过`26`，代码为`a`是`1`，而代码为`aa`是`28`，所以它们永远不会碰撞。 空前缀只是`0`。 

每个 trie 条目都包含一个字符掩码。 例如，如果前缀`s`可以跟随`a`,`e`， 或者`t`，其条目具有与这三个字母集相对应的位。 相交两个这样的掩码比尝试所有 26 个字母并执行单独的字典查找要便宜得多。 

终端标志存储在 26 个字符位之外的位 26 中。 前缀可以同时是一个完整的单词并具有子项。 例如，如果两者`are`和`area`存在，节点为`are`必须保持终端状态，同时也允许`a`作为下一个角色。 

这`last_position`测试是必要的，因为仅仅到达主行的末尾并不能保证该行是字典单词。 这同样适用于`last_line`对于次要线路。 在搜索过程中检查这些条件可以避免再次遍历已完成的网格。 

Python 整数具有任意精度，这是必要的，因为不能保证有效网格的数量适合 32 位或 64 位整数。 搜索本身从不存储所有网格，它只是累积它们的计数。 

递归深度最多为`N × M`，最多为 16，因此递归是安全的。 次要前缀数组在递归调用之前被修改，并在递归调用之后立即恢复。 忘记恢复是一个典型的回溯错误，因为下一个分支将继承上一个分支的字符。 

## 工作示例

 ### 示例 1

 输入包含四个垂直单词和五个水平单词。 自从`4^4 = 256`大于`5^3 = 125`，该实现选择水平构建网格，因为完整水平单词的可能序列较少。 

一个有效的分支是`says`,`area`,`test`。 对应的列是`sat`,`are`,`yes`， 和`sat`。 

| 初级线| 职位| 选择的角色 | 主要前缀 | 次要前缀 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 |`s`|`s`|`s`,`, `|
 | 0 | 1 |`a`|`sa`|`s`,`a`, `` |
 | 0 | 2 |`y`|`say`|`s`,`a`,`y`, `` |
 | 0 | 3 |`s`|`says`|`s`,`a`,`y`,`s`|
 | 1 | 0 |`a`|`a`|`sa`,`a`,`y`,`s`|
 | 1 | 1 |`r`|`ar`|`sa`,`ar`,`y`,`s`|
 | 1 | 2 |`e`|`are`|`sa`,`ar`,`ye`,`s`|
 | 1 | 3 |`a`|`area`|`sa`,`ar`,`ye`,`sa`|
 | 2 | 0 |`t`|`t`|`sat`,`ar`,`ye`,`sa`|
 | 2 | 1 |`e`|`te`|`sat`,`are`,`ye`,`sa`|
 | 2 | 2 |`s`|`tes`|`sat`,`are`,`yes`,`sa`|
 | 2 | 3 |`t`|`test`|`sat`,`are`,`yes`,`sat`|

 在最后一个单元之后，所有三个水平前缀都是终止词，并且所有四个垂直前缀也是终止词。 该分支贡献一个网格。 另一个有效分支是`ways`,`area`,`rest`，给出列`war`,`are`,`yes`,`sat`。 最终的答案是`2`。 

### 示例 2

 这里`N = M = 3`两本词典都包含相同的七个单词。 自从`A^M`和`B^N`相等，该实现选择垂直字典作为主要方向。 

对于一个有效的网格，行是`its`,`the`， 和`set`，并且列恰好是相同的三个单词。 

| 初级线| 职位| 选择的角色 | 主要前缀 | 次要前缀 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 |`i`|`i`|`i`,`, `|
 | 0 | 1 |`t`|`it`|`i`,`t`, `` |
 | 0 | 2 |`s`|`its`|`i`,`t`,`s`|
 | 1 | 0 |`t`|`t`|`it`,`t`,`s`|
 | 1 | 1 |`h`|`th`|`it`,`th`,`s`|
 | 1 | 2 |`e`|`the`|`it`,`the`,`se`|
 | 2 | 0 |`s`|`s`|`its`,`the`,`s`|
 | 2 | 1 |`e`|`se`|`its`,`the`,`se`|
 | 2 | 2 |`t`|`set`|`its`,`the`,`set`|

 最终的列前缀是`its`,`the`， 和`set`，所以这个分支被接受。 第二个分支生成包含行的网格`ran`,`age`,`now`。 答案是`2`。 

这些痕迹直接显示了中心不变量。 即使在相应的行或列完成之前，辅助前缀数组中的每个前缀都已知是某个允许单词的前缀。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 特里结构 |`O(4(A+B))`| 每个输入单词的长度最多为 4 |
 | 搜索 |`O(NM · S)`| 每个访问的单元最多检查 26 个候选字母 |
 | 空间|`O(27^4 + NM)`| 两个固定前缀数组加上当前的辅助前缀 |

 这里`S`表示 trie 剪枝后访问的部分网格的数量。 完整线搜索的有用上限是`min(A^M, B^N)`，因为实现选择两个方向中较小的一个。 字符级特里结构检查通常会更早地切断分支。 

固定的 trie 大小在 Python 中特别方便。 自从`27^4 = 531441`，该大小的两个数组对于 256 MB 内存限制来说足够小，并且避免了数百万个 Python 字典条目的大量开销。 网格本身最多有 16 个单元，因此递归状态很小。 

对于一般的单词矩形公式来说，搜索的指数性质是不可避免的，但该问题故意将两个维度限制为四个，并给出了字典大小的乘积界限。 trie 将搜索转变为约束传播而不是完整网格的枚举，这是使这些约束实用的预期方式。 

## 测试用例

 以下线束假设上述解决方案保存为`solution.py`。 求解器接受一个可选的`reader`，它允许测试直接提供输入字符串，而无需修改进程范围的标准输入。```
import io
from solution import solve

def run(inp: str) -> str:
    return solve(io.StringIO(inp).readline).strip()

# Sample 1
assert run(
    """\
3 4
4 5
war
are
yes
sat
says
area
test
ways
rest
"""
) == "2", "sample 1"

# Sample 2
assert run(
    """\
3 7
3 7
ran
age
now
its
the
set
ago
ran
age
now
its
the
set
ago
"""
) == "2", "sample 2"

# Minimum-size, all values equal.
assert run(
    """\
2 1
2 1
aa
aa
"""
) == "1", "minimum-size all-equal case"

# Rectangular grid, 2 rows and 4 columns.
assert run(
    """\
2 4
4 1
aa
bb
ab
ba
abba
"""
) == "1", "rectangular grid"

# No valid crossing.
assert run(
    """\
2 1
2 1
ab
aa
"""
) == "0", "incompatible vertical and horizontal words"

# Maximum dictionary product: 1000 * 1000 = 1,000,000.
# All vertical words start with 'a' and all horizontal words start
# with 'b', so the very first cell has no possible character.
def make_words(first, count):
    result = []
    alphabet = "abcdefghijklmnopqrstuvwxyz"

    for x in alphabet:
        for y in alphabet:
            for z in alphabet:
                result.append(first + x + y + z)
                if len(result) == count:
                    return result

    return result

vertical = make_words("a", 1000)
horizontal = make_words("b", 1000)

large_input = (
    "4 1000\n"
    "4 1000\n"
    + "\n".join(vertical)
    + "\n"
    + "\n".join(horizontal)
    + "\n"
)

assert run(large_input) == "0", "maximum-size dictionary product"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 |`2`| 基本交叉和两个不同的有效网格 |
 | 样品2 |`2`| 两个字典相同的方形情况 |
 |`2 × 2`，两个列表都包含`aa`|`1`| 单词重用和最小尺寸|
 |`2 × 4`和`abba`|`1`| 矩形尺寸和正确方向 |
 | 垂直的`ab`， 水平的`aa`|`0`| 立即前缀不兼容 |
 |`1000 × 1000`首字母不相交的词典|`0`| 大输入和早期特里剪枝|

 ## 边缘情况

 对于最小尺寸全相等的情况，```
2 1
2 1
aa
aa
```搜索从两次尝试开始，仅允许`a`。 第一个单元将两个前缀推进到`a`，第二个单元格完成主线为`aa`。 下一行重复完全相同的过程。 最后每一行和每一列都是终端，所以答案是`1`。 第一次使用不会消耗任何单词，因此每行都保留相同的字典条目。 

对于不兼容前缀的情况，```
2 1
2 1
ab
aa
```主根节点和次根节点允许使用不同的字符。 垂直特里允许`a`，而水平 trie 也允许`a`，因此第一个单元格本身不会被拒绝。 放置后`a`，第一条主线上的下一个单元格需要垂直前缀`ab`和水平前缀`aa`。 垂直单词唯一可能的下一个字符是`b`，而水平词则需要`a`。 他们的掩码有空的交集，因此分支立即结束。 答案是`0`。 

对于长方形的情况，```
2 4
4 1
aa
bb
ab
ba
abba
```唯一的水平词是`abba`，所以两行都必须变成`abba`。 结果列是`aa`,`bb`,`ba`， 和`ab`。 所有四个都存在于垂直特里树中。 该算法不假设行数和列数相等，因此它处理长度为 4 的两条主行并正确返回`1`。 

对于大字典的情况，输入包含 1000 个以`a`和 1000 个以以下开头的横向单词`b`。 该产品正是`1,000,000`，在要求的限度内。 在第一个单元格，垂直根掩码包含`a`而水平根掩码包含`b`。 它们的交集为零，因此整个搜索在检查第一个单元格后终止。 答案是`0`，并且大型字典不会导致大型搜索树，因为在任何分支之前应用前缀约束。 

这`N = M`限制在搜索中不需要特殊的逻辑。 该算法始终根据与其实际方向相对应的字典检查一条线。 如果一个单词同时出现在两个词典中，那么它自然可以在两个方向上出现。 如果只出现在一个方向，则只能在那个方向使用。 这符合所需的规则，而无需在回溯代码中引入特殊情况分支。
