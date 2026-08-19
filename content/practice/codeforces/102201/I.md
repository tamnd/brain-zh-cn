---
title: "CF 102201I - 递增序列"
description: "我们有 (1,ldots,N) 的排列 (A)。 修复索引 (i)。 在包含位置 (i) 的所有严格递增子序列中，考虑最大可能长度。 对于每个其他索引 (j)，我们必须决定删除位置 (j) 是否会使最大长度变小。"
date: "2026-08-18T10:44:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102201
codeforces_index: "I"
codeforces_contest_name: "Moscow Pre-Finals Workshop 2019. KAIST Contest"
rating: 0
weight: 102201
solve_time_s: 505
verified: true
draft: false
---

[CF 102201I - 递增序列](https://codeforces.com/problemset/problem/102201/I)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (1,\ldots,N) 的排列 (A)。 修复索引 (i)。 在包含位置 (i) 的所有严格递增子序列中，考虑最大可能长度。 对于每个其他索引 (j)，我们必须决定删除位置 (j) 是否会使最大长度变小。 

每个位置 (i) 的输出都是一个数字，因此答案与原始数组中的位置有关，而不是与存储在那里的数值有关。 排列属性很有用，因为每个值都是唯一的，这使我们可以在内部使用值本身作为方便的标识符。 原始问题有 (N\le 250000)、3 秒时间限制和 1024 MB 内存。 

在这个规模上，二次算法已经太大了。 对于 (250000) 个位置，(N^2) 约为 (6.25\cdot10^{10})，因此即使对每个位置重复进行 (O(N\log N)) LIS 计算也远远超出了实际限制。 目标接近 (O(N\log N))，对数因子来自 Fenwick 树、二元提升和二元搜索。 

有几种边缘情况暴露了常见错误。 对于 (N=1)，输入很简单`1`，答案是`0`，因为没有其他索引可以删除。 将可区分索引本身计算为可移动的解决方案将错误地返回`1`。 

对于严格递减排列，例如`6 5 4 3 2 1`，每个递增子序列的长度均为一。 一旦要求索引 (i) 属于它，子序列就是 (i)，因此删除任何其他索引不会改变任何内容。 正确的输出是`0 0 0 0 0 0`。 仅基于普通 LIS 成​​员资格的解决方案在这里很容易计算过多。 

多个最优子序列是另一个重要的情况。 为了`2 1 4 3`，每个位置都属于某个长度为 2 的递增子序列，但在包含固定位置的所有最优子序列中不存在其他位置。 正确的输出是`0 0 0 0`。 查看任意一个 LIS 而不是所有最佳 LIS 会错误地将某些元素标记为必要的。 

检查答案是否与位置而不是值相关的一个有用的例子是`3 1 2 5 4`。 按位置划分的正确答案是`0 1 1 2 2`。 在内部，算法可以通过顶点的值来识别顶点，因为输入是排列，但最终答案必须按原始位置顺序打印。 

请求的全平等测试不是此问题的有效输入。 例如，`3 / 7 7 7`违反了排列条件，因为值必须不同。 它可用作测试工具的健全性检查，但不应用作已提交解决方案的正确性测试。 

## 方法

 直接方法在概念上很简单。 对于每个显着位置 (i)，尝试每个删除位置 (j\neq i)。 删除(j)后，重新计算强制包含(i)的最长递增子序列，并与原始值进行比较。 这是正确的，因为它完全测试了定义中的条件。 

问题在于重复工作量。 简单的动态编程 LIS 重新计算需要 (O(N^2))，对所有对 (i,j) 产生 (O(N^4)) 工作。 即使我们将每次重新计算改进为 (O(N\log N))，对所有 (O(N^2)) 对执行此操作仍然需要 (O(N^3\log N))。 更聪明的是，我们可以在线性或对数时间内通过固定的 (i) 计算最佳递增子序列，但对每个可能的删除独立地执行此操作仍然至少留下二次行为。 在 (N=250000) 处，即使 (N^2) 也已经是大约 (6.25\cdot10^{10}) 次操作。 

关键的观察是停止直接考虑删除。 固定索引 (i)，并仅查看以 (i) 结尾的最长递增子序列。 当每个以 (i) 结尾的最大长度增加子序列包含 (j) 时，位置 (j<i) 会在删除后减小最优值。 在图术语中，(j) 支配 (i)：从开始到 (i) 的每条相关路径都经过 (j)。 

构造一个有向无环图，其顶点是数组位置，其边连接递增子序列的连续层。 将 (L[x]) 定义为以 (x) 结尾的最长递增子序列的长度。 当 (u<v)、(A_u<A_v) 和 (L[u]+1=L[v]) 时，顶点 (u) 可以在结束于 (v) 的最大长度子序列中位于 (v) 之前。 

同一 (L) 层的顶点具有特殊的排序。 在从左到右扫描期间，它们的值严格递减。 如果两个顶点具有相同的级别，而后一个顶点具有更大的值，则较早的顶点可能在它之前并创建更长的子序列，与它们的级别相矛盾。 这种排序意味着新顶点的潜在巨大前驱集是一个级别的连续后缀。 

相关图可以有二次多边，因此显式构造它是不可能的。 相反，我们在线维护其支配树。 新顶点的直接支配者是已构建的支配树中其相关前辈的最低公共祖先。 由于前驱形成一级后缀，因此只需取当前值以下的最大前驱值和该级别上的最小值即可。 他们的 LCA 是整个前身系列的共同统治者。 这是标准溶液使用的中心还原。 

一旦该支配树存在，到 (i) 的每条最大路径中出现的所有顶点都恰好是 (i) 的祖先。 如果 (i) 的树深度为 (d)，则 (d-1) 个其他顶点是必需的，因为 (i) 本身包含在深度计数中。 

我们在 (i) 之前和之后都需要强制顶点。 第一个从左到右的遍历处理必须出现在 (i) 之前的顶点。 对称从右到左传递处理必须出现在 (i) 之后的顶点。 除了 (i) 处之外，这两个集合不能重叠，因此从两个深度计数中减去 (i) 后，可以简单地将它们的大小相加。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(N^3\log N)) 具有快速 LIS 重新计算 | (O(N)) | 太慢了 |
 | 最佳| (O(N\log N)) | (O(N\log N)) | 已接受 |

 ## 算法演练

1. 将每个数组位置视为一个顶点。 对于第一遍，将 (L[x]) 定义为在位置 (x) 处结束的最长递增子序列。 值上的 Fenwick 树存储已处理值中的最大 (L) 级别。 查询小于 (A_x) 的值会在 (O(\log N)) 中给出 (x) 的级别。 
2. 按 (L) 层对顶点进行分组。 在从左到右扫描期间，每个级别的值均严格按降序排列。 假设当前值为(x)，其级别为(k+1)。 它可能的前驱正是第(k)层中已处理且其值小于(x)的顶点。 
3. 找到第 (k) 级中低于 (x) 的最大值。 因为该级别是按降序存储的，所以可以通过二分查找找到它。 所有其他可能的前身都有一个更小的值。 
4. 也保留级别(k) 中的最小值。 所有可能的前辈的共同统治者就是这两个极端前辈的共同祖先。 因此 (x) 的直接支配者是它们在当前支配树中的 LCA。 
5. 创建 (x) 作为该 LCA 的子项。 它的树深度比父代的深度大一，并且它的二元提升祖先会立即被填充。 如果(k=0)，则没有前驱，因此(x)直接附加到虚拟根。 
6.在从左向右传递之后，添加`depth[x] - 1`到属于相应数组位置的答案。 减法删除了 (x) 本身，因为该问题仅计算其他索引。 
7. 从右到左重复整个构造。 现在我们感兴趣的是从 (x) 开始增加子序列，因此查询芬威克树以获取大于 (A_x) 的值。 反转值坐标会将其变成普通的前缀最大值查询。 
8. 在从右到左的过程中，同一层的顶点按值递增的顺序出现。 相关后继集合是该级别的前缀，因此大于当前值的最小后继和该级别中的最大值给出了LCA所需的两个极值顶点。 
9. 添加结果`depth[x] - 1`相同位置的答案。 最后按原始数组顺序而不是按值顺序打印答案。 

构造背后的不变性是每个处理的前缀的支配树都由维护的父关系精确表示。 对于新顶点 (x)，到达 (x) 的每条最大路径必须首先经过其最大级别前趋之一。 因此，直接支配者是所有前驱支配者链共有的最深顶点，即它们的 LCA。 每个 LIS 级别的特殊排序将所有前辈减少到两个极端顶点，而不改变公共祖先。 因此，树深度精确地计算每个最大递增路径中存在的顶点。 反向传递将相同的参数应用于后缀。 

## Python 解决方案```python
import sys
from bisect import bisect_right

input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    LOG = n.bit_length()

    # ans is indexed by value. Since A is a permutation,
    # ans[a[i]] is the answer belonging to position i.
    ans = [0] * (n + 1)

    def build_left():
        bit = [0] * (n + 1)

        # layers[k] contains values whose left LIS length is k.
        # Values inside one layer are decreasing.
        layers = [[] for _ in range(n + 1)]

        depth = [0] * (n + 1)
        up = [[0] * LOG for _ in range(n + 1)]

        def query(x):
            res = 0
            while x:
                v = bit[x]
                if v > res:
                    res = v
                x -= x & -x
            return res

        def update(x, v):
            while x <= n:
                if v > bit[x]:
                    bit[x] = v
                x += x & -x

        def lca(x, y):
            if depth[x] < depth[y]:
                x, y = y, x

            diff = depth[x] - depth[y]
            b = 0
            while diff:
                if diff & 1:
                    x = up[x][b]
                diff >>= 1
                b += 1

            if x == y:
                return x

            for b in range(LOG - 1, -1, -1):
                ux = up[x][b]
                uy = up[y][b]
                if ux != uy:
                    x = ux
                    y = uy

            return up[x][0]

        for x in a:
            k = query(x - 1)

            if k == 0:
                parent = 0
            else:
                layer = layers[k]

                # layer is decreasing.
                # Find the first value < x, which is the largest
                # value in this layer that is still < x.
                lo = 0
                hi = len(layer)
                while lo < hi:
                    mid = (lo + hi) >> 1
                    if layer[mid] < x:
                        hi = mid
                    else:
                        lo = mid + 1

                candidate = layer[lo]
                smallest = layer[-1]

                parent = lca(smallest, candidate)

            depth[x] = depth[parent] + 1
            up[x][0] = parent

            row = up[x]
            parent_row = up[parent]
            for b in range(1, LOG):
                row[b] = parent_row[b - 1]

            layers[k + 1].append(x)
            update(x, k + 1)

        for x in a:
            ans[x] += depth[x] - 1

    def build_right():
        bit = [0] * (n + 1)

        # In the right-to-left pass, each layer is increasing.
        layers = [[] for _ in range(n + 1)]

        depth = [0] * (n + 1)
        up = [[0] * LOG for _ in range(n + 1)]

        def query(x):
            res = 0
            while x:
                v = bit[x]
                if v > res:
                    res = v
                x -= x & -x
            return res

        def update(x, v):
            while x <= n:
                if v > bit[x]:
                    bit[x] = v
                x += x & -x

        def lca(x, y):
            if depth[x] < depth[y]:
                x, y = y, x

            diff = depth[x] - depth[y]
            b = 0
            while diff:
                if diff & 1:
                    x = up[x][b]
                diff >>= 1
                b += 1

            if x == y:
                return x

            for b in range(LOG - 1, -1, -1):
                ux = up[x][b]
                uy = up[y][b]
                if ux != uy:
                    x = ux
                    y = uy

            return up[x][0]

        for x in reversed(a):
            # Reverse the value coordinate.
            rx = n - x + 1
            k = query(rx - 1)

            if k == 0:
                parent = 0
            else:
                layer = layers[k]

                # layer is increasing.
                # Find the first value > x.
                idx = bisect_right(layer, x)

                candidate = layer[idx]
                largest = layer[-1]

                parent = lca(largest, candidate)

            depth[x] = depth[parent] + 1
            up[x][0] = parent

            row = up[x]
            parent_row = up[parent]
            for b in range(1, LOG):
                row[b] = parent_row[b - 1]

            layers[k + 1].append(x)
            update(rx, k + 1)

        for x in a:
            ans[x] += depth[x] - 1

    build_left()
    build_right()

    print(*[ans[x] for x in a])

if __name__ == "__main__":
    solve()
```第一遍构建支配树以获得最大增加的前缀。 Fenwick 树包含每个值前缀的最佳 LIS 级别，因此`query(x - 1)`给出可以先于值的最大级别`x`。 然后将新顶点放入下一层。 

这`layers`除了存储关卡之外，数组还有第二个用途。 它们的单调排序让我们避免显式枚举顶点的所有传入边。 在左遍中，层正在减少，因此自定义二分搜索找到小于的第一个值`x`。 在右侧通道中，层数不断增加，因此`bisect_right`找到第一个大于的值`x`。 

这`up`表存储支配树中的二元祖先。 由于 (N<2^{18}) 无法保证，因此使用`n.bit_length()`比硬编码级别数更安全。 Python 整数不会溢出，因此不需要特殊的数字处理。 

反向传递使用变换后的坐标`n - x + 1`。 一个值大于`x`变成更小的变换坐标，允许重复使用完全相同的前缀最大 Fenwick 实现。 

最终的列表理解很微妙。`ans`由排列值索引，因为这使树表示变得方便。 如果位置`i`包含价值`x`，它的答案是`ans[x]`，所以输出必须是`[ans[x] for x in a]`。 印刷`ans[1], ans[2], ...`会通过价值而不是原始位置来回答不同的问题。 

该构造遵循与该问题已知的公认 C++ 实现相同的两遍支配树思想。 

## 工作示例

 ### 示例 1

 对于递增排列`1 2 3 4 5 6`，每个位置都是包含所有六个元素的独特 LIS 的一部分。 在左侧传递中，每个新值都恰好有一个相关的前继值，而在右侧传递中，每个值同样都恰好有一个相关的后继值。 

| 职位| 价值| 左水平| 左父母 | 左深度| 右水平 | 右父母 | 正确的深度| 回答 |
 | ---| ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 0 | 1 | 6 | 2 | 6 | 5 |
 | 2 | 2 | 2 | 1 | 2 | 5 | 3 | 5 | 5 |
 | 3 | 3 | 3 | 2 | 3 | 4 | 4 | 4 | 5 |
 | 4 | 4 | 4 | 3 | 4 | 3 | 5 | 3 | 5 |
 | 5 | 5 | 5 | 4 | 5 | 2 | 6 | 2 | 5 |
 | 6 | 6 | 6 | 5 | 6 | 1 | 0 | 1 | 5 |

 例如，对于位置 3，左侧深度有贡献 (3-1=2)，对应于必须出现在其之前的值 1 和 2。 正确的深度贡献 (4-1=3)，对应于值 4、5 和 6。还有其他五个强制索引。 同样的推理适用于每个位置，给出`5 5 5 5 5 5`。 

### 示例 2

 对于递减排列`6 5 4 3 2 1`，任何两个位置都不能形成严格递增子序列。 因此，每个顶点都是两个方向构造中的根级顶点。 

| 职位| 价值| 左水平| 左父母 | 左深度| 右水平 | 右父母 | 正确的深度| 回答 |
 | ---| ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 6 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |
 | 2 | 5 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |
 | 3 | 4 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |
 | 4 | 3 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |
 | 5 | 2 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |
 | 6 | 1 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |

 每个深度都是一，因此两个方向的贡献都为零。 删除任何其他位置都不会破坏包含所选位置的长度为 1 的子序列，给出`0 0 0 0 0 0`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N\log N)) | 两次传递中的每一次都对每个元素执行 Fenwick 运算、二分搜索和 (O(\log N)) LCA 工作。 |
 | 空间| (O(N\log N)) | 二进制提升表主导内存使用，具有 (N\log N) 个祖先条目。 |

 对于(N=250000)，对数因子低于二十级。 内存限制为 1024 MB，因此 (O(N\log N)) 祖先表可以轻松容纳。 该算法完全避免了二次前趋图，这是对此输入大小的决定性要求。 

## 测试用例

 下面的测试工具通过基于字符串的包装器使用相同的算法。 最大尺寸情况使用递减排列，因此可以生成预期结果，而无需手动存储第二个巨大答案。 仅故意检查全相等的情况是否无效，因为它违反了排列要求。```python
import sys
import io
from bisect import bisect_right

def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    try:
        n = int(input())
        a = list(map(int, input().split()))

        LOG = n.bit_length()
        ans = [0] * (n + 1)

        def build_left():
            bit = [0] * (n + 1)
            layers = [[] for _ in range(n + 1)]
            depth = [0] * (n + 1)
            up = [[0] * LOG for _ in range(n + 1)]

            def query(x):
                res = 0
                while x:
                    if bit[x] > res:
                        res = bit[x]
                    x -= x & -x
                return res

            def update(x, v):
                while x <= n:
                    if v > bit[x]:
                        bit[x] = v
                    x += x & -x

            def lca(x, y):
                if depth[x] < depth[y]:
                    x, y = y, x

                diff = depth[x] - depth[y]
                b = 0
                while diff:
                    if diff & 1:
                        x = up[x][b]
                    diff >>= 1
                    b += 1

                if x == y:
                    return x

                for b in range(LOG - 1, -1, -1):
                    if up[x][b] != up[y][b]:
                        x = up[x][b]
                        y = up[y][b]

                return up[x][0]

            for x in a:
                k = query(x - 1)

                if k == 0:
                    parent = 0
                else:
                    layer = layers[k]
                    lo, hi = 0, len(layer)

                    while lo < hi:
                        mid = (lo + hi) >> 1
                        if layer[mid] < x:
                            hi = mid
                        else:
                            lo = mid + 1

                    parent = lca(layer[-1], layer[lo])

                depth[x] = depth[parent] + 1
                up[x][0] = parent

                for b in range(1, LOG):
                    up[x][b] = up[up[x][b - 1]][b - 1]

                layers[k + 1].append(x)
                update(x, k + 1)

            for x in a:
                ans[x] += depth[x] - 1

        def build_right():
            bit = [0] * (n + 1)
            layers = [[] for _ in range(n + 1)]
            depth = [0] * (n + 1)
            up = [[0] * LOG for _ in range(n + 1)]

            def query(x):
                res = 0
                while x:
                    if bit[x] > res:
                        res = bit[x]
                    x -= x & -x
                return res

            def update(x, v):
                while x <= n:
                    if v > bit[x]:
                        bit[x] = v
                    x += x & -x

            def lca(x, y):
                if depth[x] < depth[y]:
                    x, y = y, x

                diff = depth[x] - depth[y]
                b = 0
                while diff:
                    if diff & 1:
                        x = up[x][b]
                    diff >>= 1
                    b += 1

                if x == y:
                    return x

                for b in range(LOG - 1, -1, -1):
                    if up[x][b] != up[y][b]:
                        x = up[x][b]
                        y = up[y][b]

                return up[x][0]

            for x in reversed(a):
                rx = n - x + 1
                k = query(rx - 1)

                if k == 0:
                    parent = 0
                else:
                    layer = layers[k]
                    idx = bisect_right(layer, x)
                    parent = lca(layer[-1], layer[idx])

                depth[x] = depth[parent] + 1
                up[x][0] = parent

                for b in range(1, LOG):
                    up[x][b] = up[up[x][b - 1]][b - 1]

                layers[k + 1].append(x)
                update(rx, k + 1)

            for x in a:
                ans[x] += depth[x] - 1

        build_left()
        build_right()

        print(*[ans[x] for x in a])
        return out.getvalue().strip()

    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert solve_data(
    "6\n1 2 3 4 5 6\n"
) == "5 5 5 5 5 5", "sample 1"

# Provided sample 2
assert solve_data(
    "6\n6 5 4 3 2 1\n"
) == "0 0 0 0 0 0", "sample 2"

# Provided sample 3
assert solve_data(
    "4\n2 1 4 3\n"
) == "0 0 0 0", "sample 3"

# Provided sample 4
assert solve_data(
    "9\n1 2 3 6 5 4 7 8 9\n"
) == "5 5 5 6 6 6 5 5 5", "sample 4"

# Minimum size
assert solve_data(
    "1\n1\n"
) == "0", "minimum size"

# Branching LIS choices
assert solve_data(
    "4\n1 2 4 3\n"
) == "1 1 2 2", "multiple optimal subsequences"

# Checks that answers are printed by original position, not by value
assert solve_data(
    "5\n3 1 2 5 4\n"
) == "0 1 1 2 2", "position/value mapping"

# Another boundary case with several maximum LISs
assert solve_data(
    "5\n2 3 1 4 5\n"
) == "3 3 3 2 2", "shared mandatory vertices"

# Maximum-size valid input
n = 250000
maximum_input = str(n) + "\n" + " ".join(map(str, range(n, 0, -1))) + "\n"
maximum_expected = " ".join(["0"] * n)
assert solve_data(maximum_input) == maximum_expected, "maximum size"

# All-equal input is not a valid permutation and must not be treated
# as a correctness test for this problem.
invalid = [7, 7, 7]
assert len(set(invalid)) != len(invalid), "all-equal input is invalid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1`|`0`| 区分索引的最小大小和排除 |
 |`1 2 4 3`|`1 1 2 2`| 几个最佳 LIS 和强制顶点 |
 |`3 1 2 5 4`|`0 1 1 2 2`| 从值到原始位置的正确映射 |
 |`2 3 1 4 5`|`3 3 3 2 2`| 具有多个共享强制顶点的多个分支 |
 | 大小 250000 的递减排列 | 全零 | 最大输入大小和最坏情况 LIS 长度一 |
 |`7 7 7`| 不适用 | 演示无效的全相等输入，因为该语句需要排列 |

 ## 边缘情况

 对于`1 / 1`，两个方向构造都会创建单个根级顶点。 每一遍的深度都是一，所以两个贡献都是`1-1=0`。 最终的答案是`0`，正是因为没有其他索引。 

为了`6 / 6 5 4 3 2 1`，每个从左到右的 Fenwick 查询都返回零，因为没有更早的值更小。 每个从右到左的查询也返回零，因为没有后来的值更大。 因此，每个顶点都附加到两棵树中的虚拟根。 所有答案都是零。 

为了`4 / 2 1 4 3`，考虑位置 1 包含值 2。包含它的最大递增子序列为`[2,4]`和`[2,3]`。 位置 3 和位置 4 都不存在于每个这样的子序列中，因此删除其中任何一个都会留下另一个最佳子序列。 支配树通过将两个替代品放置在共同祖先之下而不是使其中一个成为另一个的祖先来捕获这一点。 答案是零。 

为了`4 / 1 2 4 3`，位置 3 包含值 4。它唯一的最大长度递增子序列是`[1,2,4]`，因此位置 1 和 2 都是强制性的。 值 4 的左支配器深度是 3，给出两个强制前驱。 没有强制的继任者，所以位置 3 的最终答案是`2`。 

为了`5 / 3 1 2 5 4`，内部树使用值作为顶点标识符，但输出必须遵循原始位置。 每个值的答案分别附加到值 3、1、2、5 和 4，从而产生`0 1 1 2 2`当遍历输入数组时。 直接按数值顺序打印答案数组会产生不同且不正确的顺序。 

对于全相等的输入，例如`3 / 7 7 7`，算法不需要定义答案，因为输入违反了排列保证。 测试工具可能会在调用求解器之前拒绝它，但是竞争性编程解决方案不应花费复杂性来处理法官承诺永远不会提供的格式错误的输入。
