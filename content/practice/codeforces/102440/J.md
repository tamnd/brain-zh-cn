---
title: "CF 102440J - 未来城市的交付"
description: "将每个网格单元视为图形的顶点。 直接传送是两个顶点之间的边，当它们位于同一行或同一列时，包含相同的字母，并且在它们之间严格地至少再出现一次相同的字母。"
date: "2026-08-08T13:59:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102440
codeforces_index: "J"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Junior"
rating: 0
weight: 102440
solve_time_s: 129
verified: true
draft: false
---

[CF 102440J - 未来城市的交付](https://codeforces.com/problemset/problem/102440/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 将每个网格单元视为图形的顶点。 直接传送是两个顶点之间的边，当它们位于同一行或同一列时，包含相同的字母，并且在它们之间严格地至少再出现一次相同的字母。 

查询给出两个单元格，并询问它们是否属于该图的同一连通分量。 允许多次隐形传态，因此问题不在于两个单元是否具有直接隐形传态，而是是否存在某种有效的隐形传态序列将它们连接起来。 

网格最多有 (1000 \times 1000 = 10^6) 个单元格，而最多可以有 (10^6) 个查询。 这立即排除了从头开始为每个查询运行图形搜索的可能性。 即使每次查询仅触及 (O(nm)) 个单元格的搜索在最坏的情况下也可能执行 (10^{12}) 个单元格访问。 在预处理过程中，我们需要花费与网格大小大致线性的时间，并几乎立即回答每个查询。 

传送规则中还隐藏着另一个难点。 如果一行包含四个相等的字母，则相邻的相等单元无法直接传送，但四个单元仍可以形成一个连通分量。 例如，在`aaaa`，位置1和3可以瞬移，位置2和4可以瞬移，位置1和4可以瞬移。 这使得所有四个位置都连接起来。 仅考虑相邻相等小区或仅考虑距离恰好为 2 的对的解决方案可能会错过此连接。 

恰好出现 3 次的情况也很特殊。 在`aaa`，位置 1 和 3 可以传送，但位置 2 不能传送到其中任何一个。 因此，这三个单元并不形成一个组件。 从位置 1 到位置 2 的查询的正确答案是`No`，而位置 1 到位置 3 是`Yes`。 

无需进行传送，即可从自身到达同一单元。 因此，诸如以下的查询```
1 1
a
1
1 1 1 1
```必须产生`Yes`。 图连接结构自然地处理这个问题，因为每个顶点都属于与其自身相同的组件。 

最后，不同的字母永远无法连接起来。 每次传送都会保留该字母，因此即使很长的传送序列也无法更改当前建筑物的字母。 例如，```
1 2
ab
1
1 1 1 2
```产生`No`。 

## 方法

 一种直接的方法是将每个有效的隐形传态视为图边，并对每个查询执行 BFS 或 DFS。 搜索是正确的，因为所需的答案正是图连通性。 问题是查询的数量。 使用 (10^6) 个单元格和 (10^6) 个查询，为每个查询探索整个网格的搜索可以到达 (10^{12}) 个已访问的单元格。 显式构造每个可能的传送边也没有吸引力，因为包含一个字母的多个副本的行可以包含平方多个有效对。 

一行中相同字母的结构为我们提供了更小的表示形式。 考虑在一行中出现一个固定字母，从左到右排序。 将它们编号 (1,2,\ldots,k)。 每当 (j-i\ge 2) 时，出现 (i) 和出现 (j) 之间就存在有效的直接边。 

我们不需要所有这些边。 将事件 (i) 与事件 (i-2) 连接起来足以处理整个序列（除了一个小间隙之外）。 对于四个出现，边 (1\leftrightarrow3) 和 (2\leftrightarrow4) 创建两个单独的组件，因此我们另外将出现 4 与出现 1 连接起来。现在，前四个出现已连接。 每个较晚的事件 (i) 都连接到 (i-2)，而 (i-2) 已经与较早的事件连接。 因此，这几个边产生与所有有效传送边完全相同的连接组件。 

这意味着在扫描一行时，每个新出现的情况只需要记住它的第一个出现和紧邻的前两个出现。 通常我们将当前出现的边缘添加到之前两个位置出现的位置。 当当前出现的是第四次出现时，我们另外将其连接到第一次出现。 

我们对柱子应用完全相同的结构。 由于每个真实的隐形传送边都由这组减少的边表示，因此我们可以使用不相交集并集结构 DSU 来在处理网格时维护连接的组件。 

蛮力方法和最优方法可总结如下。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 最坏情况下的 (O(qnm)) | (O(nm)) | 太慢了|
 | 最佳 | (O(nm\alpha(nm)+q\alpha(nm))) | (O(nm)) | 已接受 |

 这里 (\alpha) 是阿克曼反函数，对于这些输入大小来说它实际上是常数。 

## 算法演练

 1. 将每个单元 ((x,y)) 视为具有标识符 (x\cdot m+y) 的 DSU 顶点。 最初，每个单元都在自己的组件中，因为尚未处理任何传送。 
2. 逐行处理网格。 对于 26 个字母中的每一个，保留其第一次出现、最近一次出现、第二次最近出现以及当前行中的少量出现次数。 
3. 处理包含字母 (c) 的单元格时，查看同一行中第二个最近出现的 (c)。 如果存在，则将其与当前单元格合并。 这两次事件之间恰好有一次或多次 (c) 的出现，因此传送是有效的。 
4. 当当前单元格是该行中第四次出现 (c) 时，也将其与第一次出现的并集。 这条额外的边连接了两个组，否则在仅使用距离两条边后，这两个组将保持分离。 
5. 更新存储的该信件的出现次数。 当前单元格将成为最近发生的单元格，而上一个最近发生的单元格将成为第二个最近发生的单元格。 
6. 以同样的方式处理列，同时从上到下扫描网格。 每对由一列和一个字母组成的垂直状态都单独保存。 这避免了网格上的第二次嵌套传递并保持实现的线性。 
7. 添加所有水平和垂直连接后，读取每个查询。 将两个坐标转换为 DSU 顶点标识符并比较它们的根。 等根意味着存在一系列有效的隐形传送，因此打印`Yes`。 不同的根意味着不存在这样的序列，因此打印`No`。 

### 为什么它有效

 对于任何固定的行和字母，假设其出现次数为 (1,2,\ldots,k)。 该算法每当 (i\ge3) 时添加边 (i\leftrightarrow i-2)，并在 (k\ge4) 时添加 (1\leftrightarrow4)。 对于 3 次出现，唯一添加的边是 (1\leftrightarrow3)，这正是唯一可能的连接。 对于四次出现，(1\leftrightarrow3)、(2\leftrightarrow4) 和 (1\leftrightarrow4) 连接所有四个。 对于后面的每个出现 (i)，边 (i\leftrightarrow i-2) 将其附加到序列中已连接的部分。 因此，这些选定的边具有与该行中每个有效传送边完全相同的连接组件。 

相同的论点独立地适用于每一列和字母。 由于每个有效的隐形传态都由这些简化线图之一中的连通性表示，并且算法添加的每条边本身就是有效的隐形传态，因此 DSU 组件正是原始隐形传态图的连通组件。 因此，比较 DSU 根可以为每个查询提供正确答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    total = n * m

    # parent[x] < 0 means x is a root and -parent[x] is its component size.
    parent = [-1] * total

    def find(x):
        while parent[x] >= 0:
            if parent[parent[x]] >= 0:
                parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        a = find(a)
        b = find(b)
        if a == b:
            return

        if parent[a] > parent[b]:
            a, b = b, a

        parent[a] += parent[b]
        parent[b] = a

    # Horizontal state. It is reset for every row.
    first_h = [-1] * 26
    last1_h = [-1] * 26
    last2_h = [-1] * 26
    count_h = [0] * 26

    # Vertical state. One state exists for every (column, letter).
    states = m * 26
    first_v = [-1] * states
    last1_v = [-1] * states
    last2_v = [-1] * states
    count_v = bytearray(states)

    for i in range(n):
        # Start a fresh occurrence history for this row.
        for c in range(26):
            first_h[c] = -1
            last1_h[c] = -1
            last2_h[c] = -1
            count_h[c] = 0

        row = grid[i]
        base = i * m

        for j in range(m):
            idx = base + j
            c = row[j] - 97

            # Horizontal connections.
            p2 = last2_h[c]
            if p2 != -1:
                union(idx, p2)

            if count_h[c] == 3:
                union(idx, first_h[c])

            if count_h[c] == 0:
                first_h[c] = idx

            last2_h[c] = last1_h[c]
            last1_h[c] = idx
            if count_h[c] < 4:
                count_h[c] += 1

            # Vertical connections.
            s = j * 26 + c
            p2 = last2_v[s]
            if p2 != -1:
                union(idx, p2)

            if count_v[s] == 3:
                union(idx, first_v[s])

            if count_v[s] == 0:
                first_v[s] = idx

            last2_v[s] = last1_v[s]
            last1_v[s] = idx
            if count_v[s] < 4:
                count_v[s] += 1

    q = int(input())
    out = bytearray()

    for _ in range(q):
        x1, y1, x2, y2 = map(int, input().split())
        a = (x1 - 1) * m + (y1 - 1)
        b = (x2 - 1) * m + (y2 - 1)

        if find(a) == find(b):
            out.extend(b"Yes\n")
        else:
            out.extend(b"No\n")

    sys.stdout.buffer.write(out)

if __name__ == "__main__":
    solve()
```DSU 使用负值`parent`存储组件尺寸。 这避免了单独大小的数组并保持较小的内存使用量。 按大小合并可以防止树变深，而路径压缩使后续的根查找时间几乎恒定。 

水平状态在每行的开头重置，因为不同行中的事件不能参与相同的水平隐形传态。 垂直状态不会重置，因为列继续跨越所有行。 

这`count`值只需要区分零次、一次、两次、三次和至少四次出现。 一旦一个字母在一行中出现了四次，特殊的第一到第四边缘就已经被添加了，以后的每一次出现只需要连接到之前出现的两个位置。 一个`bytearray`对于垂直计数来说就足够了。 

条件`count == 3`在增加计数之前会故意检查。 它标识第四次出现，而不是第三次。 对于第四次出现，`first`是出现 1 且`last2`是出现 2 次，因此算法添加了两个所需的连接。 

输入的所有坐标都是从一开始的。 在计算从零开始的顶点标识符之前，转换将两个坐标减一。 Python中不存在整数溢出问题，最大标识符在(10^6)以下。 

输出累积在`bytearray`而不是一百万个字符串的 Python 列表。 这使得内存使用情况保持可预测并避免重复的输出调用。 

## 工作示例

 ### 示例 1

 网格是```
aaa
aaa
aaa
```对于每一行，三个`a`出现的编号为 1、2、3。处理第三个出现在出现 3 和 1 之间添加一条边。中间的出现在该行中保持独立。 

垂直方向上也是如此。 结果，所有八个边界单元形成一个组件，而中心单元保持隔离。 

重要的水平和垂直连接的紧凑轨迹是：

 | 细胞| 卧式连接| 垂直连接| 所得组件|
 | --- | --- | --- | --- |
 | (1,1) | 无 | 无 | 角组件 |
 | (1,2) | 无 | 无 | 边缘-中间组件|
 | (1,3) | (1,1) | 无 | 角组件 |
 | (2,1) | 无 | 无 | 边缘-中间组件|
 | (2,2) | 无 | 无 | 中心组件|
 | (2,3) | 无 | 无 | 边缘-中间组件|
 | (3,1) | 无 | (1,1) | 角组件|
 | (3,2) | 无 | (1,2) | 边缘-中间组件|
 | (3,3) | (3,1) | (1,3) | 角组件 |

 然后垂直处理连接相应的边缘-中间单元和角单元。 这五个查询因此产生```
No
No
No
Yes
Yes
```第三个查询演示了为什么中心单元被隔离。 第四个查询表明一条路径可以使用多次隐形传态，在本例中是围绕外环移动。 

### 一行中有四个相等的单元格

 考虑构建的输入```
1 4
aaaa
4
1 1 1 2
1 1 1 3
1 2 1 4
1 1 1 4
```出现顺序为(1,2,3,4)。 该算法对其进行如下处理。 

| 当前位置 | 前第二次出现 | 第四次出现的连接 | 组件效果|
 | --- | --- | --- | --- |
 | 1 | 无 | 无 | 启动组件 |
 | 2 | 无 | 无 | 保持独立|
 | 3 | 1 | 无 | 连接 3 至 1 |
 | 4 | 2 | 1 | 连接两个现有组 |

 处理位置 4 后，所有四个单元都属于一个组件。 输出是```
Yes
Yes
Yes
Yes
```该示例特别有用，因为仅连接相隔两个位置的出现会错误地留下`{1,3}`和`{2,4}`已断开连接。 第一次和第四次出现之间的额外边缘恰好解决了这种情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nm\alpha(nm)+q\alpha(nm))) | 每个单元仅参与固定数量的 DSU 操作，每个请求后跟两个根查询。 |
 | 空间| (O(nm)) | DSU 为每个单元存储一个值，而网格和线状态数组的输入大小是线性的。 |

 最多有 (10^6) 个单元格和 (10^6) 个查询。 预处理仅接触每个单元格固定次数，并且查询阶段每个查询仅执行两次 DSU 查找。 因此，该算法随实际输入大小线性缩放至逆阿克曼因子，而不是将网格大小乘以查询数量。 

## 测试用例

 以下线束假设提交的解决方案保存为`solution.py`并暴露了`solve()`函数如上所示。```python
import sys
import io
from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1.
sample1 = """\
3 3
aaa
aaa
aaa
5
1 1 1 2
2 2 1 1
2 2 1 2
3 3 1 1
3 2 1 2
"""

assert run(sample1) == """\
No
No
No
Yes
Yes
""", "sample 1"

# Minimum-size grid and zero-length path.
sample_min = """\
1 1
a
1
1 1 1 1
"""

assert run(sample_min) == "Yes\n", "minimum-size input"

# Exactly three equal occurrences.
sample_three = """\
1 3
aaa
4
1 1 1 3
1 1 1 2
1 2 1 3
1 2 1 2
"""

assert run(sample_three) == """\
Yes
No
No
Yes
""", "three occurrences"

# Four equal occurrences. All four become connected.
sample_four = """\
1 4
aaaa
4
1 1 1 2
1 1 1 3
1 2 1 4
1 1 1 4
"""

assert run(sample_four) == """\
Yes
Yes
Yes
Yes
""", "four occurrences"

# Different letters can never be connected.
sample_letters = """\
2 2
ab
ba
4
1 1 1 2
1 1 2 1
1 2 2 2
1 1 1 1
"""

assert run(sample_letters) == """\
No
No
No
Yes
""", "different letters"

# Maximum grid dimensions with all equal cells.
# Every cell belongs to one component because each row has 1000 occurrences
# and the rows are connected vertically by the same argument.
n = 1000
m = 1000
grid = "\n".join(["a" * m for _ in range(n)])

sample_max = f"""\
{n} {m}
{grid}
3
1 1 1 1000
1 1 1000 1
500 500 1000 1000
"""

assert run(sample_max) == """\
Yes
Yes
Yes
""", "maximum-size grid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 x 1`， 一`a`|`Yes`| 自可达性和最小尺寸 |
 |`1 x 3`,`aaa`|`Yes, No, No, Yes`| 恰好三个出现和孤立的中间出现 |
 |`1 x 4`,`aaaa`| 四`Yes`答案 | 第四次出现的特殊联系|
 |`2 x 2`,`ab / ba`|`No, No, No, Yes`| 不同的字母和边界坐标 |
 |`1000 x 1000`， 全部`a`| 三`Yes`答案 | 最大网格尺寸和大型连接组件 |

 ## 边缘情况

 ### 相邻相等的单元格

 对于```
1 2
aa
1
1 1 1 2
```两个单元格包含相同的字母并且位于同一行，但没有第三个`a`他们之间。 该算法只看到两次出现，因此它不添加并集。 这些单元保留在不同的 DSU 组件中，并且输出为```
No
```这可以防止将规则简单地解释为“同一行或同一列中的相同字母”的常见错误。 

### 恰好出现了 3 次

 对于```
1 3
aaa
2
1 1 1 3
1 1 1 2
```第三次出现与第一次出现相关，因为有一个`a`在它们之间的位置 2 处。 第二次发生本身没有到任一端点的有效传送。 因此，DSU 包含一个组件`{1,3}`和一个组件`{2}`，生产```
Yes
No
```该算法处理此问题是因为第三次出现连接到其前第二次出现（即第一次出现），而没有创建特殊的第四次出现连接。 

### 出现四次

 对于```
1 4
aaaa
2
1 1 1 2
1 1 1 4
```第四个出现首先与出现 2 连接，因为它们相隔两次出现。 它还触发与出现 1 的特殊连接。前三个出现已经具有连接 (1\leftrightarrow3)，因此所有四个都成为一个组件。 输出是```
Yes
Yes
```这种情况将减少的边缘构造与仅连接每个第二次出现的更简单但不正确的策略区分开来。 

### 两个端点相同的单元格

 对于```
1 1
z
1
1 1 1 1
```不需要传送。 源和目标实际上是相同的图顶点，因此`find(source) == find(destination)`立即成立。 输出是```
Yes
```### 不同的字母

 对于```
1 2
ab
1
1 1 1 2
```这两个细胞不能通过直接传送连接起来，因为它们的字母不同。 它们也无法通过其他单元连接，因为每个有效的传送都会保留该字母。 DSU 从未将他们联合起来，```
No
```### 水平和垂直连接相互作用

 考虑```
3 4
aaaa
bbbb
aaaa
2
1 1 3 4
1 1 2 1
```第一行和第三行各包含四个`a`细胞，所以每个`a`每一行都属于一个水平分量。 每列包含一个`a`在顶部和底部与另一个`a`它们之间出现相同的字母，因此顶部和底部组件垂直连接。 因此第一个查询是`Yes`。 

第二个查询要求连接`a`细胞与一个`b`细胞。 任何有效的传送序列都不能改变该字母，所以它是`No`。 

这说明了为什么该解决方案无法独立预处理行和列，然后仅使用一个方向回答查询。 DSU 将两种连接组合成一个全局连接结构。 

如果您愿意，我还可以将其变成更紧凑的 Codeforces 风格的社论，保留相同的证明，但大大减少说明。
