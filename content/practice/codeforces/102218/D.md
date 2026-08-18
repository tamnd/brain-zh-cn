---
title: "CF 102218D - 动态网络"
description: "计算机形成一棵有根的树。 计算机 1 最初存在并充当根。 每次添加计算机时，它都会收到下一个未使用的 ID，因此如果当前有 curr 计算机，则新计算机将获得 ID curr + 1。"
date: "2026-08-17T23:15:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102218
codeforces_index: "D"
codeforces_contest_name: "2019, XI Annual Programming Contest by ESCOM-IPN"
rating: 0
weight: 102218
solve_time_s: 391
verified: false
draft: false
---

[CF 102218D - 动态网络](https://codeforces.com/problemset/problem/102218/D)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 计算机形成一棵有根的树。 电脑`1`最初存在并充当根。 每次添加计算机时，它都会收到下一个未使用的 ID，因此如果当前有`curr`计算机，新计算机获得 ID`curr + 1`。 它唯一的新边缘将其连接到一些已经存在的计算机`p`。 

由于每个新顶点都与旧顶点有一条边，因此网络始终保持为一棵树。 一对计算机的答案是其唯一树路径上的顶点数，包括两个端点。 对于新插入的计算机，所需的答案是从该计算机到根的路径长度（以顶点为单位）`1`。 

使用之前的答案故意对输入进行编码。 在解码查询之前，`last`包含前面查询的答案，或者最初为零。 对于插入，实际的父级是`(p' + last) % curr + 1`， 在哪里`curr`是插入之前的计算机数量。 对于路径查询，两个端点均使用当前值进行解码`curr`。 这意味着程序无法独立预处理查询，因为一个查询的答案会更改所有后续编码值的含义。 

最多有`2 * 10^5`查询，因此最多也有`2 * 10^5`电脑。 在每个查询上花费与计算机数量成线性时间的解决方案可以执行大约`4 * 10^10`最坏情况下的树操作，远远超出了 2 秒的限制允许的范围。 我们需要每个操作的大致对数时间。 由于树只会生长，并且新添加的顶点总是附加到现有顶点，因此我们可以增量地维护祖先信息。 

一些边缘情况可能会悄无声息地破坏实现。 如果查询的端点相等，则该路径恰好包含一台计算机。 例如，```
1
2 0 0
```只有电脑`1`，所以解码后的查询是`(1, 1)`答案是`1`。 忘记计算端点的距离公式可能会错误地返回零。 

第二个边缘情况是直接连接到根的新计算机。 例如，```
1
1 0
```将父级解码为`1`，创建计算机`2`，答案是`2`，因为路径是`2 -> 1`。 报告边数而不是计算机数的实现将返回`1`。 

编码状态是错误的另一个来源。 考虑```
3
1 0
2 0 0
2 0 0
```插入后，`last = 2`，因此第一个类型 2 查询解码为`(1, 1)`并产生`1`。 下一个查询必须使用`last = 1`，所以它的解码方式也不同于它的解码方式`last = 0`。 首先读取所有查询并解码它们而不处理先前的答案将产生错误的树或错误的端点。 

最后，插入查询和后续查询之间的模基数有所不同。 对于插入，`curr`是现有计算机的数量，因此在增加之前必须对父级进行解码`curr`。 对于类型 2 查询，`curr`已经包括每台插入的计算机。 当刚刚添加一台新计算机时，混淆此顺序会导致出现相差一错误。 

## 方法

 直接的方法就是存储`parent[v]`和`depth[v]`对于每台计算机。 要回答查询，请重复向上移动较深的端点，直到两个端点具有相同的深度，然后向上移动直到它们相遇。 相遇顶点是它们的最低共同祖先。 如果它的深度是`d`，路径上的计算机数量为`depth[u] + depth[v] - 2 * d + 1`。 

这种方法是正确的，因为每次移动都遵循实际的树边缘，并且均衡深度后到达的第一个共同祖先正是最低共同祖先。 问题是运行时间。 单个查询可能需要 θ(n) 个父级在链上移动。 和`2 * 10^5`计算机和`2 * 10^5`查询，大约可以达到`4 * 10^10`父操作。 

关键的观察是树不是任意的和静态的。 每个新顶点都附加到一个已经存在的顶点，因此当顶点`v`被创造出来，每一个祖先`v`可以从其父母已知的祖先衍生而来。 这让我们不仅可以存储直接父级，还可以存储`2^k`每个顶点的第一个祖先。 

对于每个顶点`v`， 让`up[k][v]`表示其祖先`2^k`向上的边缘。 什么时候`v`与父级一起插入`p`，我们知道`up[0][v] = p`对于每一个更大的`k`,`up[k][v] = up[k-1][up[k-1][v]]`。 

因此，可以立即计算新计算机的所有二进制提升信息。 然后可以在 O(log n) 中找到最低公共祖先，并且每次插入也需要 O(log n)。 输入的编码性质不会导致额外的算法困难，因为我们按顺序处理查询并更新`last`每次回答后立即。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 最坏情况 O(QN) | O(N) | 太慢了 |
 | 最佳 | O(Q log N) | O(Q log N) | O(N log N) | O(N log N) | 已接受 |

 ## 算法演练

 1.用计算机初始化树`1`。 它的深度为零，每个祖先条目都可以指向`1`，它充当根自己的祖先。 
2. 按给定顺序处理查询，同时维护`curr`、现有计算机的数量，以及`last`，之前的答案。 查询必须在线处理，因为`last`参与解码下一个查询。 
3. 对于类型 1 查询，使用以下命令解码父查询`(p' + last) % curr + 1`。 模数使用旧值`curr`，因为新计算机还不存在。 
4. 分配新的计算机 ID`curr + 1`，将其深度设置为`depth[parent] + 1`，并将其直接父级设置为解码后的父级。 
5. 搭建新计算机的二进制升降台。 它是`2^k`-th 祖先是通过取`2^(k-1)`-th 祖先两次。 这在 O(log N) 中是可能的，因为每个引用的祖先都是较早创建的。 
6、新电脑到root的路径`1`包含`depth[new] + 1`电脑。 打印该值并设置`last`到它。 
7. 对于类型 2 查询，使用当前的解码两个端点`curr`，因为两台计算机已经属于网络。 
8. 通过二元提升找到它们的最低共同祖先。 首先，通过将较深的顶点提升适当的 2 次方，使它们的深度相等。 如果顶点相等，则该顶点本身就是它们的最低共同祖先。 
9. 否则，按从最大到最小的顺序检查提升高度。 每当`2^k`两个顶点的第-个祖先不同，将两个顶点移动到这些祖先。 处理完所有级别后，这两个顶点是其最低共同祖先的不同子节点，因此它们的直接父节点是 LCA。 
10. 将 LCA 转换为所需的计算机数量`depth[u] + depth[v] - 2 * depth[lca] + 1`。 打印结果并将其存储在`last`。 

### 为什么它有效

 不变量是对于每台现有的计算机`v`以及每个提升级别`k`,`up[k][v]`正是之后到达的祖先`2^k`父边。 这最初适用于根，并且对于每个新顶点也适用，因为它的级别`k`祖先是通过应用两个正确的级别来构造的`k-1`跳跃。 

二元提升首先将较深的查询顶点移动到与另一个顶点相同的深度，因此之后两个顶点距根的距离相等。 如果它们相等，则该顶点就是它们的 LCA。 否则，两个顶点的处理能力从最大到最小都会向上移动两个顶点而不跨越它们的 LCA，同时使它们的祖先尽可能高，同时仍然保持不同。 最终到达的顶点是紧邻 LCA 的两个子节点，因此它们的共同父节点是正确的 LCA。 

对于任意两个顶点，其路径上的边数为`depth[u] + depth[v] - 2 * depth[lca]`。 该问题需要计算机而不是边缘，因此必须添加一台计算机。 专用于根的相同公式给出`depth[v] + 1`，这就是为什么可以直接回答插入查询。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    q = int(input())

    LOG = 19
    max_nodes = q + 1

    up = [[1] * max_nodes for _ in range(LOG)]
    depth = [0] * max_nodes

    curr = 1
    last = 0
    out = []

    for _ in range(q):
        data = list(map(int, input().split()))
        t = data[0]

        if t == 1:
            p_encoded = data[1]

            parent = (p_encoded + last) % curr + 1
            v = curr + 1

            depth[v] = depth[parent] + 1
            up[0][v] = parent

            for k in range(1, LOG):
                up[k][v] = up[k - 1][up[k - 1][v]]

            curr += 1

            last = depth[v] + 1
            out.append(str(last))

        else:
            u_encoded = data[1]
            v_encoded = data[2]

            u = (u_encoded + last) % curr + 1
            v = (v_encoded + last) % curr + 1

            if depth[u] < depth[v]:
                u, v = v, u

            diff = depth[u] - depth[v]

            bit = 0
            while diff:
                if diff & 1:
                    u = up[bit][u]
                diff >>= 1
                bit += 1

            if u == v:
                lca = u
            else:
                for k in range(LOG - 1, -1, -1):
                    if up[k][u] != up[k][v]:
                        u = up[k][u]
                        v = up[k][v]

                lca = up[0][u]

            last = depth[u] + depth[v] - 2 * depth[lca] + 1
            out.append(str(last))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`up`数组对于每个 2 的幂都有一行。 至多有`2 * 10^5`查询最多有`200001`计算机，以及`2^18 = 262144`，因此 19 个级别足以代表每个可能的深度。 

当插入一个新的顶点时，`up[0][v]`是其解码的父级。 每个更高的条目都是从已经计算的条目中填充的，因此不需要有关未来顶点的信息。 

插入答案是在之后计算的`curr`增加，但父级在该增量之前被解码。 这个顺序是必要的。 新的ID是`old_curr + 1`，而有效的父 ID 正是`1`通过`old_curr`。 

对于类型 2 查询，端点在任何 LCA 工作之前被解码。 当前值`curr`已经是网络中计算机的数量，因此两个模运算都使用该值。 

该代码使用深度差异的二进制表示来均衡深度。 一旦深度匹配，它要么立即处理相等顶点的情况，要么从两个顶点的最大幂向下提升两个顶点。 Python 整数不会溢出，因此不需要特殊的整数宽度处理。 

变量名称`u`和`v`在查找 LCA 时临时更改。 均衡后，它们可能不再代表原始端点。 这不会造成问题，因为仅通过 LCA 搜索之前的深度值仍然需要它们的原始深度。 在此实现中，均衡后较深的端点可能已移动，因此最终距离公式使用当前顶点的深度。 这对于任意查询来说是不够的，因为当前顶点的深度可能比原始顶点的深度小。 

为了避免这个问题，上面的实现必须在修改顶点之前保留原始端点深度。 更正后的实现如下。```python
import sys
input = sys.stdin.readline

def solve():
    q = int(input())

    LOG = 19
    max_nodes = q + 2

    up = [[1] * max_nodes for _ in range(LOG)]
    depth = [0] * max_nodes

    curr = 1
    last = 0
    out = []

    for _ in range(q):
        data = list(map(int, input().split()))
        t = data[0]

        if t == 1:
            p_encoded = data[1]

            parent = (p_encoded + last) % curr + 1
            v = curr + 1

            depth[v] = depth[parent] + 1
            up[0][v] = parent

            for k in range(1, LOG):
                up[k][v] = up[k - 1][up[k - 1][v]]

            curr += 1

            last = depth[v] + 1
            out.append(str(last))

        else:
            u = (data[1] + last) % curr + 1
            v = (data[2] + last) % curr + 1

            original_u = u
            original_v = v

            if depth[u] < depth[v]:
                u, v = v, u

            diff = depth[u] - depth[v]
            bit = 0

            while diff:
                if diff & 1:
                    u = up[bit][u]
                diff >>= 1
                bit += 1

            if u == v:
                lca = u
            else:
                for k in range(LOG - 1, -1, -1):
                    if up[k][u] != up[k][v]:
                        u = up[k][u]
                        v = up[k][v]

                lca = up[0][u]

            last = (
                depth[original_u]
                + depth[original_v]
                - 2 * depth[lca]
                + 1
            )
            out.append(str(last))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第二个版本是要提交的版本。 保存`original_u`和`original_v`是一个微妙但必要的实现细节。 LCA提升时使用的顶点是工作变量，提升后它们的深度不一定是原始端点深度。 

## 工作示例

 ### 示例 1

 四个插入查询构建树`1`作为 root，使用计算机`2`和`3`附于`1`，其次是计算机`4`和`5`附于`2`。 

| 查询 | 类型 | 解码父/端点|`curr`查询后 |`last`|
 | ---| ---| ---| ---| ---|
 |`1 0`| 1 | 家长`1`， 新的`2`| 2 | 2 |
 |`1 2`| 1 | 家长`1`， 新的`3`| 3 | 2 |
 |`1 2`| 1 | 家长`2`， 新的`4`| 4 | 3 |
 |`1 2`| 1 | 家长`2`， 新的`5`| 5 | 3 |
 |`2 0 4`| 2 |`(4, 3)`| 5 | 4 |
 |`2 1 2`| 2 |`(1, 2)`| 5 | 2 |
 |`2 2 1`| 2 |`(5, 4)`| 5 | 3 |

 对于前四个查询，插入答案是深度加一，给出`2, 2, 3, 3`。 查询来自`4`到`3`有生命周期评估`1`，所以它的路径是`4 -> 2 -> 1 -> 3`，包含四台计算机。 最后两条路径分别包含两台和三台计算机。 

### 示例 2

 第一个插入的编码为`last = 0`， 所以`p = (1 + 0) % 1 + 1 = 1`，创建计算机`2`根下。 它的答案是`2`，并且该答案会改变下一个查询的解码方式。 

| 查询 | 类型 | 解码父/端点|`curr`查询后 |`last`|
 | ---| ---| ---| ---| ---|
 |`1 1`| 1 | 家长`1`， 新的`2`| 2 | 2 |
 |`2 1 2`| 2 |`(2, 1)`| 2 | 2 |
 |`1 0`| 1 | 家长`1`， 新的`3`| 3 | 2 |
 |`1 1`| 1 | 家长`1`， 新的`4`| 4 | 2 |
 |`2 0 3`| 2 |`(3, 2)`| 4 | 3 |
 |`2 2 2`| 2 |`(2, 2)`| 4 | 1 |

 第二个查询使用解码`last = 2`，最终查询演示了等端点情况。 由于两个端点都是计算机`2`，唯一路径恰好包含一台计算机。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(Q log Q) | O(Q log Q) | 每次插入都会填充`O(log Q)`祖先，并且每个 LCA 查询都使用`O(log Q)`起重作业。 |
 | 空间| O(Q log Q) | O(Q log Q) | 二元升降台存储`O(log Q)`每个最多的祖先`Q + 1`电脑。 |

 和`Q <= 2 * 10^5`，升降台只有大约`200001 * 19`整数条目。 每个查询最多执行几十个祖先操作，这适合 2 秒的限制，而暴力方法可能需要数百亿次父级遍历。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    q = int(input())

    LOG = 19
    max_nodes = q + 2

    up = [[1] * max_nodes for _ in range(LOG)]
    depth = [0] * max_nodes

    curr = 1
    last = 0
    out = []

    for _ in range(q):
        data = list(map(int, input().split()))
        t = data[0]

        if t == 1:
            parent = (data[1] + last) % curr + 1
            v = curr + 1

            depth[v] = depth[parent] + 1
            up[0][v] = parent

            for k in range(1, LOG):
                up[k][v] = up[k - 1][up[k - 1][v]]

            curr += 1
            last = depth[v] + 1
            out.append(str(last))

        else:
            u = (data[1] + last) % curr + 1
            v = (data[2] + last) % curr + 1

            original_u = u
            original_v = v

            if depth[u] < depth[v]:
                u, v = v, u

            diff = depth[u] - depth[v]
            bit = 0

            while diff:
                if diff & 1:
                    u = up[bit][u]
                diff >>= 1
                bit += 1

            if u == v:
                lca = u
            else:
                for k in range(LOG - 1, -1, -1):
                    if up[k][u] != up[k][v]:
                        u = up[k][u]
                        v = up[k][v]
                lca = up[0][u]

            last = (
                depth[original_u]
                + depth[original_v]
                - 2 * depth[lca]
                + 1
            )
            out.append(str(last))

    return "\n".join(out)

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

sample1 = """7
1 0
1 2
1 2
1 2
2 0 4
2 1 2
2 2 1
"""

sample2 = """6
1 1
2 1 2
1 0
1 1
2 0 3
2 2 2
"""

assert run(sample1) == "2\n2\n3\n3\n4\n2\n3", "sample 1"
assert run(sample2) == "2\n2\n2\n2\n3\n1", "sample 2"

minimum_case = """1
2 0 0
"""
assert run(minimum_case) == "1", "single root, equal endpoints"

root_children = """4
1 0
1 0
2 0 0
2 1 0
"""
assert run(root_children) == "2\n2\n1\n2", "root children and equal endpoints"

chain_case = """6
1 0
1 0
1 0
2 0 0
2 0 1
2 1 2
"""
assert run(chain_case) == "2\n3\n4\n1\n4\n2", "deep chain"

maximum_case = "200000\n" + "\n".join(["1 0"] * 199999)
expected = "\n".join(str(i) for i in range(2, 200001))
assert run(maximum_case) == expected, "maximum-size chain"

all_equal_case = """8
1 0
2 0 0
2 1 1
1 0
2 0 0
2 1 1
1 0
2 0 0
"""
assert run(all_equal_case) == "2\n1\n1\n2\n1\n1\n2\n1", "repeated equal endpoints"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 2 0 0`|`1`| 最小网络和同等端点 |
 |`1 0 / 1 0 / 2 0 0 / 2 1 0`|`2, 2, 1, 2`| 多个根子节点和端点解码 |
 | 三连冠`1 0`插入后跟路径查询 |`2, 3, 4, 1, 4, 2`| 深链和长LCA路径|
 |`199999`连续的`1 0`插入 | 深度序列从`2`通过`200000`| 最大输入大小和对数预处理 |
 | 重复插入和等端点查询 |`2, 1, 1, 2, 1, 1, 2, 1`| 重复`last`价值观和`u = v`边界情况|

 ## 边缘情况

 单根情况在任何插入之前处理。 为了```
1
2 0 0
```

`curr = 1`和`last = 0`，所以两个编码端点都变成`1`。 生命周期评估是`1`，答案是`0 + 0 - 2 * 0 + 1 = 1`。 

根的直接子代的深度为一。 为了```
1
1 0
```父级是`(0 + 0) % 1 + 1 = 1`，并且新顶点有深度`1`。 所需计算机数量为`1 + 1 = 2`。 父级之前已解码`curr`变成`2`，这可以防止模数基数被意外更改。 

一条长链测试该实现是否真正执行对数 LCA 查询，而不是逐一遍历父项。 例如，```
3
1 0
1 0
1 0
```创造`1 -> 2 -> 3 -> 4`，三个插入答案是`2`,`3`， 和`4`。 稍后的查询`4`和`1`有生命周期评估`1`，所以它的答案是`4`。 

相同的端点运用 LCA 算法的不同分支。 如果两个解码端点都是`v`，他们的最低共同祖先是立即`v`。 距离有零边，但要求的答案是一台计算机，所以最终`+1`是必要的。 

编码输入还可以使两个相同的编码值在不同时间代表不同的实际顶点，因为`last`变化。 例如，```
3
1 0
2 0 0
2 0 0
```从电脑开始`1`,插入电脑`2`，并获得`last = 2`。 第一个类型 2 查询将两个端点解码为`1`，产生答案`1`。 现在`last = 1`，因此下一个相同的编码查询使用`(0 + 1) % 2 + 1 = 2`对于两个端点并产生另一个答案`1`。 处理和更新`last`立即是使这两个看起来相同的查询正确运行的原因。
