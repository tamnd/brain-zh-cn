---
title: "CF 102341J - 胖夫"
description: "我们有一个（n×m）小写字母网格。 路线从左上角的单元格开始，到右下角的单元格结束，并且仅包含向右和向下的移动。 每条路线恰好访问 (n+m-1) 个单元格，因此每条路线都会生成相同长度的字符串。"
date: "2026-08-13T03:20:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "J"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 195
verified: true
draft: false
---

[CF 102341J - Jigglypuff](https://codeforces.com/problemset/problem/102341/J)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个（n \times m）小写字母网格。 路线从左上角的单元格开始，到右下角的单元格结束，并且仅包含向右和向下的移动。 每条路线恰好访问 (n+m-1) 个单元格，因此每条路线都会生成相同长度的字符串。 

问题是某个特定的字符串是否可以通过至少三个不同的路径生成。 路线本身不必是不相交的。 它们可能共享长前缀和后缀，甚至大部分单元格。 重要的是他们访问的字母序列是相同的，而他们的移动序列是不同的。 

边界 (n,m\le 3000) 最多提供 900 万个网格单元。 检查每个细胞恒定次数的解决方案是合适的。 任何单元格数量的二次方，例如 (O(n^2m^2))，都太大了，显式枚举路线是完全不可能的，因为它们的数量是

 [
 \binom{n+m-2}{n-1}。 
]

 对于 (n=m=3000)，这大约是 (10^{1803}) 条路线。 即使每条路线写下一点信息也已经是不可行的。 

在一些边缘情况下，表面上合理的条件会给出错误的答案。 首先，一个 (2\times2) 方格可以有两条路线产生相同的字符串，但永远不可能有三个路线。```
2 2
aa
aa
```正确答案是`NO`。 如果粗心的解决方案只检查两个不同的路由是否可以具有相同的字符串，则会错误地打印`YES`。 

第二种边缘情况是两个有用的局部配置可能位于同一行，但被多于一列分开。```
2 4
abca
bday
```好的单元格位于第一行的第 1 列和第 3 列，使用基于 1 的坐标。 它们不相邻，因此不会给出三个相等的路线。 答案是`NO`。 将同一行中的任何两个好单元格视为足够是错误的。 

两个相邻的好小区确实给出了 3 条路线。 例如，```
2 3
aba
bab
```有3条不同的路线，全部生产`abab`，所以答案是`YES`。 

垂直方向也发生同样的现象：```
3 2
ab
ba
ab
```再次有 3 条生产路线`abab`，所以答案是`YES`。 

## 方法

 直接方法将枚举每个单调路由，构造其字符串，并计算每个字符串出现的次数。 这是正确的，因为每个路由都会被考虑，并且产生相同字符串的路由会被分组在一起。 问题是路线的数量。 它们有 (\binom{n+m-2}{n-1}) 个，构造每个字符串需要 (O(n+m))，给出

 [
 O\left((n+m)\binom{n+m-2}{n-1}\right)
 ]

 时间。 对于 (3000\times3000) 网格，这大约是 (10^{1807}) 个字符操作，因此该方法不仅太慢，而且根本无法使用。 

有用的观察结果是，两条单调路线只能通过交换先向右移动再向下移动与先向下移动再向右移动来局部不同。 考虑一个单元格 ((r,c))。 两种局部可能性是

 [
 (r,c)\右箭头(r,c+1)\右箭头(r+1,c+1)
 ]

 和

 [
 (r,c)\右箭头(r+1,c)\右箭头(r+1,c+1)。 
]

 第一个和最后一个单元格是共享的。 两个中间单元格必须具有相同的字符，两条路由才能生成相同的子字符串。 因此定义一个单元格 ((r,c)) 为好，当

 [
 网格[r][c+1]=网格[r+1][c]。 
]

 好的单元格代表不会更改生成的字符串的本地交换。 

令人惊讶的是，只有通过良好细胞的两种特定排列才能存在三个相等的路线。 第一种排列由两个好单元 ((r_1,c_1)) 和 ((r_2,c_2)) 组成

 [
 r_1<r_2,\qquad c_1<c_2。 
]

 它们严格位于东南方，因此两个本地交换可以独立执行。 从穿过两个方块的路线开始，我们可以选择两个都不交换，只选择第一个，只选择第二个，或者两者都选择。 这给出了至少三个具有相同字符串的不同路由。 

第二种排列由两个相邻的好单元组成。 它们要么水平相邻，

 [
 (r,c),\ (r,c+1),
 ]

 或垂直相邻，

 [
 (r,c),\(r+1,c)。 
]

 两个方块接触，因此通过其组合区域的三种可能的方式已经用同一根绳子给出了三种不同的路线。 

反过来是关键的结构引理。 如果三个路线产生相同的字符串，则在网格的每个对角线上从上到下对它们进行排序。 压缩它们共同的前缀和后缀。 保留三个不同路线选择的第一个区域必须包含两个在两个坐标中严格分离的独立本地交换，或者两个共享一侧的交换。 由于所有三个路由对应位置上的标签一致，因此每个所需的本地交换都是一个好单元。 因此，必须出现上述两种配置之一。 官方社论准确地表述了这一特征。 

这将原始路径问题简化为关于好单元集的几何问题。 我们需要检测相邻的对，或者严格递增的行和列的对。 

对于严格的东南情况，从上到下扫描行。 对于每一行，找到包含好单元格的最小和最大列。 如果当前行在 (c) 列有一个好的单元格，并且前一行在较小的列有一个好的单元格，则我们有第一个配置。 记住前面行中所有好单元格中的最小列就足够了。 如果当前行的最大好列大于该最小值，则所需的对存在。 

剩下的问题是在 Python 中快速进行良好单元计算。 网格有多达 900 万个单元，因此在一秒的限制下，每个字符上的嵌套 Python 循环可能会不必要地昂贵。 我们可以将每一行打包成一个 Python 整数，每个网格字符使用一个字节。 对于两个连续行 (A) 和 (B)，位置 (c) 处的字节

 [
 (A\mathbin{>>}8)\mathbin{\mathsf{异或}}B
 ]

 当 (A[c+1]=B[c]) 时为零，这正是好单元的定义。 Python 在优化的本机代码中执行这些大整数运算。 

标准的零字节检测表达式，

 [
 (x-L)\ &\ \sim x\ &\ H,
 ]

其中 (L) 在每个位置都包含字节值 (1)，(H) 在每个位置都包含字节值 (128)，给出一个位掩码，其集合字节对应于 (x) 的零字节。 这让我们可以一次找到一对行中的所有好单元格。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O((n+m)\binom{n+m-2}{n-1})) | 网格尺寸呈指数 | 太慢了|
 | 最佳| (O(nm)) | (O(米)) | 已接受 |

 ## 算法演练

 1. 读取第一个网格行并将其字符打包为一个 Python 整数。 仅需要前一行，因为好单元格是由两个连续的行确定的。 
2. 对于接下来的每一行，将其打包为一个整数并计算 (x=(previous>>8)\mathbin{\mathsf{XOR}}current)。 (x)的字节(c)将前一行的(c+1)列的字符与当前行的(c)列的字符进行比较。 
3. 提取(x)的零字节。 每个这样的字节代表一个好单元。 从生成的位掩码中，获取当前行对中的第一个和最后一个好列。 
4. 检查当前的好掩模是否与之前的好掩模相交。 如果是，则有两个垂直相邻的好单元格，这是第二种配置，所以答案是`YES`。 
5. 检查当前好的掩码是否包含相隔一列的两个位置。 这是通过检测到的`good & (good >> 8)`。 这样的一对水平相邻并且也给出了第二种配置。 
6. 如果前一行在该列中包含一个好的单元格`p`，并且当前行在大于的列中包含一个好单元格`p`，这两个牢房严格位于彼此的东南方。 保留所有先前行中看到的最小的好列，因此测试很简单`current_max > minimum_previous`。 
7. 对当前行对进行所有检查后，更新全局最小良好列并记住当前良好掩码以供下一次迭代使用。 如果完整扫描后没有找到任何配置，则打印`NO`。 

不变量是在处理行对之前，`minimum_previous`是每个已处理的好单元格行中任何好单元格的最小列。 因此，将其与当前行最大的好列进行比较，就完全相当于询问是否存在严格的东南对。 同时，`previous_good`精确地表示前一行中的好单元格，因此它与当前掩模的交集检测每个垂直相邻对。 当前掩模内移动的交点检测每个水平相邻对。 上面的结构特征表明，这些正是可以产生三个相等路线的情况。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    prev = input().strip().encode()
    prev_value = int.from_bytes(prev, 'little')

    # One byte with value 1 in every position.
    low = ((1 << (8 * m)) - 1) // 255

    # One byte with the high bit set in every position.
    high = low << 7

    # We only care about the first m - 1 bytes, corresponding to
    # columns 0 .. m - 2.
    valid = (((1 << (8 * (m - 1))) - 1) // 255) << 7

    previous_good = 0
    minimum_previous = None

    for _ in range(n - 1):
        cur = input().strip().encode()
        cur_value = int.from_bytes(cur, 'little')

        # Byte c compares prev[c + 1] with cur[c].
        x = (prev_value >> 8) ^ cur_value

        # A set bit in byte c means x's byte c is zero, hence
        # prev[c + 1] == cur[c].
        good = (x - low) & ~x & high & valid

        if good:
            # Two vertically adjacent good cells.
            if good & previous_good:
                print("YES")
                return

            # Two horizontally adjacent good cells.
            if good & (good >> 8):
                print("YES")
                return

            # Strict southeast pair.
            first = ((good & -good).bit_length() - 1) >> 3
            last = (good.bit_length() - 1) >> 3

            if minimum_previous is not None and last > minimum_previous:
                print("YES")
                return

            if minimum_previous is None or first < minimum_previous:
                minimum_previous = first

        previous_good = good
        prev_value = cur_value

    print("NO")

if __name__ == "__main__":
    solve()
```输入一次处理一行，因此算法永远不需要存储整个网格。`prev_value`和`cur_value`将行包含为打包字节序列。 蟒蛇的`int.from_bytes`保留原始字符值，因此对相应字节进行异或正是字符相等测试。 

移位八位是中心索引细节。 后`prev_value >> 8`，字节零包含原始列一，字节一包含原始列二，依此类推。 将其与当前行对齐进行异或`previous[c+1]`和`current[c]`。 

零字节表达式值得关注。 减法为`low`足够独立地执行，以便标准零字节检测标识标记每个零字节的高位。 这`valid`mask 删除最后一个字节，因为列`m-1`其右侧没有单元格，因此不可能是好单元格的左侧。 

第一个设置位`good`给出最小的好列，而最后设置的位给出最大的列。 由于每个相关位都是字节的高位，因此将其位索引除以 8 可恢复列索引。 

水平邻接测试将掩码移动一个字节。 如果列 (c) 和列 (c+1) 都良好，则相应位之一在交集中幸存下来。 垂直测试直接使用前一行的掩码，因为两个掩码都描述了好单元列。 

Python 中不存在整数溢出问题。 打包的行最多有 3000 个字节，因此最大的整数只有大约 24,000 位。 

## 工作示例

 对于样本 1，第一对行在第 0 列包含一个好的单元格，因为第 0 行、第 1 列的字符是`e`，匹配第 1 行、第 0 列。下一对包含第 1 列和第 2 列的好单元格。当前最大的列是 2，而前几行中最小的好列是 0，因此立即找到严格的东南配置。 

| 行对 | 好专栏| 之前的最低值 | 上一个蒙版重叠 | 结果 |
 | --- | --- | --- | --- | --- |
 | 第 0、1 行 | 0 | 无 | 无 | 继续 |
 | 第 1、2 行 | 1, 2 | 0 | 无 | (2>0)，是 |

 两个好的细胞在`(0,0)`和`(1,1)`彼此严格位于东南方。 它们的本地交换可以独立选择，从而提供具有相同音符序列的多条路线。 因此，算法停止而不扫描网格的其余部分。 

对于样本 2，每个相邻的行对都不会产生好的单元格。 例如，在前两行之间，`b`与`f`,`c`和`g`,`d`和`h`， 等等。 每对行都会延续相同的不匹配模式。 

| 行对 | 好专栏| 之前的最低值 | 上一个蒙版重叠 | 结果 |
 | --- | --- | --- | --- | --- |
 | 第 0、1 行 | 无 | 无 | 无 | 继续 |
 | 第 1、2 行 | 无 | 无 | 无 | 继续 |
 | 第 2、3 行 | 无 | 无 | 无 | 继续 |
 | 第 3、4 行 | 无 | 无 | 无 | 继续 |

 由于根本没有好的小区，所以三种检测机制都无法成功。 最终的答案是`NO`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nm)) | 每对相邻行都被打包并比较一次，打包操作处理 (O(m)) 位。 |
 | 空间| (O(米)) | 仅维护两行打包行和恒定数量的掩码。 |

 该网格最多包含九百万个字符。 该算法对每个 (n-1) 行对的包含 (O(m)) 个字节的整数进行恒定数量的操作，从而在标准复杂性模型中给出 (O(nm)) 总工作量。 内存使用量与行宽度呈线性关系，并且远低于 512 MB 限制。 

## 测试用例```python
import sys
import io

def solve_rows(inp: str) -> str:
    it = iter(inp.splitlines())
    n, m = map(int, next(it).split())

    prev = next(it).strip().encode()
    prev_value = int.from_bytes(prev, 'little')

    low = ((1 << (8 * m)) - 1) // 255
    high = low << 7
    valid = (((1 << (8 * (m - 1))) - 1) // 255) << 7

    previous_good = 0
    minimum_previous = None

    for _ in range(n - 1):
        cur = next(it).strip().encode()
        cur_value = int.from_bytes(cur, 'little')

        x = (prev_value >> 8) ^ cur_value
        good = (x - low) & ~x & high & valid

        if good:
            if good & previous_good:
                return "YES"

            if good & (good >> 8):
                return "YES"

            first = ((good & -good).bit_length() - 1) >> 3
            last = (good.bit_length() - 1) >> 3

            if minimum_previous is not None and last > minimum_previous:
                return "YES"

            if minimum_previous is None or first < minimum_previous:
                minimum_previous = first

        previous_good = good
        prev_value = cur_value

    return "NO"

def run(inp: str) -> str:
    return solve_rows(inp)

sample1 = """\
5 8
petrozav
eiiiziio
tiiiavid
riiiiois
ozavodsk
"""

sample2 = """\
5 5
abcde
fghij
klmno
pqrst
uvwxy
"""

assert run(sample1) == "YES", "sample 1"
assert run(sample2) == "NO", "sample 2"

assert run("""\
2 2
aa
aa
""") == "NO", "minimum grid has only two routes"

assert run("""\
2 3
aba
bab
""") == "YES", "horizontal adjacent good cells"

assert run("""\
3 2
ab
ba
ab
""") == "YES", "vertical adjacent good cells"

assert run("""\
4 4
xayz
aqrs
tuxb
vwby
""") == "YES", "strict southeast good cells"

assert run("""\
2 4
abca
bday
""") == "NO", "same-row non-adjacent good cells"

max_yes = "3000 3000\n" + ("a" * 3000 + "\n") * 3000
assert run(max_yes) == "YES", "maximum-size all-equal grid"

max_no = "3000 3000\n" + (
    ("a" * 3000 if i % 2 == 0 else "b" * 3000) + "\n"
    for i in range(3000)
)
max_no = "3000 3000\n" + "".join(
    ("a" * 3000 if i % 2 == 0 else "b" * 3000) + "\n"
    for i in range(3000)
)
assert run(max_no) == "NO", "maximum-size grid with no good cells"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 2 / aa / aa`|`NO`| 最小尺寸以及一个好的正方形仅提供两条路线的事实 |
 |`2 3 / aba / bab`|`YES`| 水平相邻的好单元 |
 |`3 2 / ab / ba / ab`|`YES`| 垂直相邻的好单元 |
 |`4 4 / xayz / aqrs / tuxb / vwby`|`YES`| 两个严格东南的好小区|
 |`2 4 / abca / bday`|`NO`| 同一行不相邻的好单元格不足 |
 | 3000乘3000全部`a`|`YES`| 最大尺寸、全部相等的值和早期检测 |
 | 3000×3000交替`a`和`b`行 |`NO`| 没有好的细胞的最大尺寸，强制完整扫描 |

 ## 边缘情况

 对于最小(2\times2)网格```
2 2
aa
aa
```有一个好的细胞，`(0,0)`，因为右侧和底部的单元格都是`a`。 该算法创建一个包含第 0 列的好掩码，但在同一行或列中没有前一个好行，也没有第二个好单元格。 它打印`NO`，正确反映 (2\times2) 网格恰好有两条单调路线。 

对于水平相邻的好单元格，```
2 3
aba
bab
```第一行对具有良好的列 0 和 1。其掩码具有两个相邻的设置字节，因此`good & (good >> 8)`是非零的。 该算法立即打印`YES`。 三个路线对应于第一列之前、两列之间或之后向下移动，并且都产生`abab`。 

对于垂直相邻的好单元格，```
3 2
ab
ba
ab
```第一行对在第 0 列中有一个好单元，第二行对在第 0 列有另一个好单元。它们的掩码相交，因此`good & previous_good`当处理第二对时不为零。 算法打印`YES`。 

对于两个严格东南的好单元格，```
4 4
xayz
aqrs
tuxb
vwby
```好的细胞是`(0,0)`和`(2,2)`。 由于没有相邻的好小区，因此不会触发两次本地邻接测试。 在第一行对之后，`minimum_previous`变为 0。当包含的行对`(2,2)`处理后，其最大的好列为2，并且`2 > 0`，因此严格的东南测试成功。 这说明了为什么全局最小列足以检测第一个配置。 

对于同一行中不相邻的好单元格，```
2 4
abca
bday
```好的列是 0 和 2。它们被一列分开，因此水平邻接测试为零。 没有前一行的好单元格可以形成严格的东南对，并且只有一行包含好单元格。 算法打印`NO`。 这是有效的本地配置和诱人但不正确的概括之间的界限。 

对于最大尺寸的全等网格，每个可能的单元都是好的。 第一行对的每一列中都包含良好的单元格，第二行对也包含良好的单元格。 该算法在处理第二对后立即检测到严格的东南配置，因此返回`YES`而不做不必要的工作。 

对于最大尺寸的交替网格，每一行要么都是`a`或全部`b`，相邻行使用不同的字母。 对于每一列 (c)，比较是在不同字符之间进行的，因此不存在好的单元格。 每个好的掩码都是零，并且算法在打印之前扫描所有（2999）行对`NO`。 此案例执行完整的最坏情况扫描，同时仍仅使用两行打包的工作存储。
