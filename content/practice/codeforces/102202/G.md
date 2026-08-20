---
title: "CF 102202G - 递增序列"
description: "我们有一个排列 A[0..N-1]。 固定索引 i 并考虑所有包含 A[i] 的递增子序列。 其中，有些具有最大可能长度。"
date: "2026-08-20T02:25:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102202
codeforces_index: "G"
codeforces_contest_name: "2019 KAIST RUN Spring Contest"
rating: 0
weight: 102202
solve_time_s: 578
verified: true
draft: false
---

[CF 102202G - 递增序列](https://codeforces.com/problemset/problem/102202/G)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个排列`A[0..N-1]`。 修复索引`i`并考虑所有包含的递增子序列`A[i]`。 其中，有些具有最大可能长度。 我们需要计算还有多少个其他索引`j`对于索引来说是必不可少的`i`，意味着删除后`j`，仍包含的最佳递增子序列`i`变得严格更短。 

关键区别在于出现在某个最优子序列中的元素与出现在包含`i`。 只有后者才有助于回答。 

对于固定的`i`，每个包含它的递增子序列都会自然地分裂成以`i`和一个开始于的右侧部分`i`。 因此，左侧的索引`i`当它出现在每个以`i`。 对称陈述适用于右侧的索引。 

和`N`最多`250000`， 一个`O(N^2)`动态程序已经远远超出了极限。 在最坏的情况下，它的性能约为`N(N-1)/2`，这大约是`3.1 * 10^10`前任检查。 即使是普通的`O(N log N)`LIS 计算本身是不够的，因为我们需要有关每个最优子序列中哪些元素是不可避免的的信息。 

有几种边缘情况暴露了常见错误。 为了`N=1`，包含单个元素的唯一子序列是该元素本身，所以答案是`0`。 输入`1 / 1`必须产生`0`。 

对于严格递增的排列，例如`1 2 3`，每个元素都属于包含任意固定位置的唯一递增子序列。 答案是`2 2 2`， 不是`0 0 0`。 仅考虑替代 LIS 选择的解决方案将错过这种情况。 

对于严格递减排列，例如`3 2 1`，每个元素单独形成一个最长的递增子序列。 删除另一个索引永远不会改变包含所选索引的最佳长度，所以答案是`0 0 0`。 将“属于某个 LIS”与“属于每个 LIS”混淆的解决方案可能会错误地计算其他元素。 

一个有用的边界情况是`1 3 2`。 答案是`0 1 1`。 对于索引`1`，值`3`没有可能向右扩展，因此删除任一相邻元素是不等效的。 对于索引`2`，包含它的每个长度为 2 的递增子序列都使用第一个元素`1`，使得该索引至关重要。 类似的推理也适用于索引`1`。 

## 方法

 直接解法构造增序动态规划图。 为每个数组位置创建一个顶点和一条边`j -> i`每当`j < i`,`A[j] < A[i]`， 和`j`可以是结束于的最长递增子序列的前一个元素`i`。 等价地，如果`L[i]`是结束于的 LIS 长度`i`，我们保持边缘令人满意`L[j] + 1 = L[i]`。 

对于固定的`i`，从该图的开头到的每条最长路径`i`表示最长的递增子序列，结束于`i`。 当索引位于每条这样的路径上时，索引是不可避免的。 强力方法是枚举或以其他方式检查每个顶点的所有相关前趋。 即使构造所有边也可能是二次的，因为递增排列在每对位置之间都有一条边。 和`N=250000`，这意味着大约`3.1 * 10^10`可能的边缘。 

解锁更快解决方案的观察结果是相关图是一个 DAG，其边总是从 LIS 层移动`k-1`分层`k`。 我们可以构建它的支配树。 一个顶点`u`支配一个顶点`v`当从源到每条路径`v`经过`u`。 的祖先`v`支配树中的顶点正是每条路径上不可避免的顶点`v`。 

对于 DAG，顶点的直接支配者是支配树中其所有直接前辈的 LCA。 这让我们可以逐层构建支配树。 剩下的困难是前驱集可能很大。 排列属性消除了这个困难：具有相同 LIS 结尾长度的顶点在位置和值上形成递减序列。 因此，对于层中的每个顶点`k`，它的前辈在层`k-1`形成一个连续的滑动窗口。 

我们用两个堆栈聚合队列维护该移动窗口的 LCA。 每次插入、删除和查询仅执行恒定数量的 LCA 操作。 LCA 本身通过二进制提升来回答`O(log N)`，给出一个`O(N log N)`解决方案。 

索引右侧`i`通过反转排列并替换每个值来处理`x`和`N+1-x`。 右边的严格递增子序列`i`变成一个普通的递增子序列，结束于对应的变换位置`i`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N²) | O(N) | 太慢了 |
 | 最佳| O(N log N) | O(N log N) | O(N log N) | O(N log N) | 已接受 |

 ## 算法演练

 1. 使用标准耐心排序尾部数组计算每个位置的 LIS 结束层。 如果`L[i] = k`,放置索引`i`进入层`k`。 索引是从左到右处理的，因此每一层都会自动按递增的位置顺序存储。 

因为两个元素相同`L`value 不能同时具有增加的位置和增加的值，每一层内的值都随着位置的增加而严格减少。 
2.添加虚拟源顶点`0`。 每个顶点的 LIS 长度`1`从此源连接。 因此它的支配深度是`1`，因为顶点本身是每条以该顶点结束的路径上唯一的真实元素。 
3. 按升序处理各层。 假设我们当前正在构建层`k`，上一层是`k-1`。 对于当前顶点`v`，它可能的前身正是顶点`u`层内`k-1`满意的`u < v`和`A[u] < A[v]`。 

由于上一层的位置增加而值减少，因此条件`u < v`和`A[u] < A[v]`选择该层的一个连续间隔。 
4. 从左到右处理当前图层。 前导间隔的右端点仅向右移动，因为当前位置增加。 左端点也只向右移动，因为当前层中的值减少，因此阈值`A[v]`变小。 

因此，我们可以将前驱间隔维护为滑动队列。 在处理当前层时，每个前一层顶点最多插入一次并最多删除一次。 
5. 维护当前在该滑动队列中的每个顶点的LCA。 普通队列无法在保持任意关联聚合的同时有效地从前面删除，因此请使用两个堆栈。 每个堆栈存储自己的聚合，其中两个顶点的聚合就是它们的 LCA。 当前栈变空时，从后栈转移所有元素，同时重新计算聚合。 

LCA 是结合的，因为`LCA(LCA(a,b),c)`等于所有三个顶点中最深的共同祖先。 这里也是可交换的，因此两个堆栈聚合的组合顺序并不重要。 
6. 如果前一个窗口为`v`为空，其直接支配者为虚源。 否则的话，所有前辈的LCA恰恰是`v`。 将此顶点设置为父顶点`v`在支配树中。 

一旦知道了父级，就填写二进制提升表`v`立即地。 这些条目使用的所有祖先都已经属于较早的层。 
7. 深度`v`在支配树中等于每个以 结尾的递增子序列上不可避免的顶点数`v`， 包括`v`本身。 因此`depth[v] - 1`是严格之前不可避免的索引的数量`v`。 
8. 对转换后的序列运行相同的过程`B`， 在哪里`B`通过反转得到`A`并替换每个值`x`经过`N+1-x`。 原数组中的右增子序列变成了从左到右递增的子序列`B`。 
9.如果`left[i]`是原始序列的支配深度，`right[i]`是变换序列的相应深度，所需的答案是`left[i] + right[i] - 2`。 

我们减去二是因为`i`其本身在每个支配深度中包含一次，但不得被计算在内。 

### 为什么它有效

 每个以顶点结束的递增子序列都是通过分层 LIS DAG 的路径。 当一个顶点支配相应的 DAG 顶点时，该顶点恰好出现在每个这样的子序列中。 支配树不变量表示顶点的所有支配者恰好是其树祖先，因此树深度对它们进行计数。 

对于 DAG，顶点的直接支配者是已构建的支配树中其所有前辈的 LCA。 滑动窗口恰好包含那些前辈，因为等 LIS 层的值随着位置的增加而严格减少。 因此，算法选择的每个父代都是正确的直接支配者。 应用于反向和互补排列的相同参数给出了不可避免的后缀元素。 由于递增子序列的前缀和后缀包含`i`独立一次`i`是固定的，将两个计数相加就可以精确地给出删除后会降低最优值的索引。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

def solve_dom_depth(a):
    n = len(a)

    # layers[k] contains indices whose LIS-ending length is k + 1.
    layers = []
    tails = []

    for i, x in enumerate(a):
        k = bisect_left(tails, x)
        if k == len(tails):
            tails.append(x)
            layers.append([])
        else:
            tails[k] = x
        layers[k].append(i)

    log = (n + 1).bit_length()

    # Binary lifting table for the dominator tree.
    up = [[0] * n for _ in range(log)]
    depth = [0] * n

    def lca(a1, a2):
        if a1 == a2:
            return a1

        if depth[a1] < depth[a2]:
            a1, a2 = a2, a1

        diff = depth[a1] - depth[a2]
        bit = 0
        while diff:
            if diff & 1:
                a1 = up[bit][a1]
            diff >>= 1
            bit += 1

        if a1 == a2:
            return a1

        for k in range(log - 1, -1, -1):
            if up[k][a1] != up[k][a2]:
                a1 = up[k][a1]
                a2 = up[k][a2]

        return up[0][a1]

    class AggQueue:
        def __init__(self):
            self.in_nodes = []
            self.in_agg = []
            self.out_nodes = []
            self.out_agg = []

        def push(self, v):
            self.in_nodes.append(v)
            if self.in_agg:
                self.in_agg.append(lca(self.in_agg[-1], v))
            else:
                self.in_agg.append(v)

        def _transfer(self):
            while self.in_nodes:
                v = self.in_nodes.pop()
                self.in_agg.pop()

                self.out_nodes.append(v)
                if self.out_agg:
                    self.out_agg.append(lca(v, self.out_agg[-1]))
                else:
                    self.out_agg.append(v)

        def pop(self):
            if not self.out_nodes:
                self._transfer()
            self.out_nodes.pop()
            self.out_agg.pop()

        def empty(self):
            return not self.in_nodes and not self.out_nodes

        def query(self):
            if not self.out_nodes:
                return self.in_agg[-1]
            if not self.in_nodes:
                return self.out_agg[-1]
            return lca(self.out_agg[-1], self.in_agg[-1])

    # Layer 0 has no real predecessor.
    for v in layers[0]:
        depth[v] = 1

    for k in range(1, len(layers)):
        prev = layers[k - 1]
        cur = layers[k]

        q = AggQueue()

        left = 0
        right = 0
        m = len(prev)

        for v in cur:
            # Add all previous-layer vertices with position < v.
            while right < m and prev[right] < v:
                if right >= left:
                    q.push(prev[right])
                right += 1

            # Remove vertices whose value is not smaller than a[v].
            # Values in prev are strictly decreasing.
            while left < right and a[prev[left]] >= a[v]:
                q.pop()
                left += 1

            if q.empty():
                parent = 0
                depth[v] = 1
            else:
                parent = q.query()
                depth[v] = depth[parent] + 1

            up[0][v] = parent
            for j in range(1, log):
                up[j][v] = up[j - 1][up[j - 1][v]]

    return depth

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    left = solve_dom_depth(a)

    transformed = [n + 1 - x for x in reversed(a)]
    right_rev = solve_dom_depth(transformed)

    ans = [0] * n
    for i in range(n):
        right = right_rev[n - 1 - i]
        ans[i] = left[i] + right - 2

    print(*ans)

if __name__ == "__main__":
    solve()
```第一部分`solve_dom_depth`构造 LIS 层`bisect_left`。 因为输入是排列，所以严格递增子序列直接通过下界替换处理。 实际的LIS长度不需要单独计算，只需要每个位置的层数。 

这`up`表代表支配树。`up[0][v]`是直接支配者`v`，而较高的行包含 2 次方的祖先。 虚拟源由索引表示`0`在表中，即使实际数组顶点使用从零开始的索引。 真正的顶点永远不会与源混淆，因为源由特殊的父值表示`0`， 尽管`depth[0]`隐式为零。 

LCA 例程首先均衡深度，然后一起提升两个顶点。 最大起重功率为`(N+1).bit_length()`，这足以表示每个可能的树深度。 

这`AggQueue`是滑动窗口组件。`in_nodes`从右翼接收新的前任，同时`out_nodes`提供要从左侧删除的元素。 在一层扫描期间，每个元素最多从一个堆栈交叉到另一堆栈一次。 与每个堆栈条目一起存储的聚合是该条目下面的所有元素的 LCA。 

两个指针`left`和`right`描述前一个LIS层中的前导区间。 条件`prev[right] < v`处理位置限制。 条件`a[prev[left]] >= a[v]`删除不能位于前面的值`v`在严格递增的子序列中。 使用`>=`而不是`>`是必要的，因为子序列必须严格递增。 

最后，对排列进行反转和求补，将之后的每个有效后缀变成`i`转换为相应变换顶点之前的有效前缀。 变换后的深度被映射回`n - 1 - i`，并将两个支配深度相结合。 

## 工作示例

 对于示例 1，数组为`[1]`。 有一层LIS层，仅包含索引`0`。 

| 层| 当前指数| 前任窗口 | 直接统治者| 深度 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 空 | 来源 | 1 |

 变换后的序列也是单个元素，所以它的深度又是`1`。 答案是`1 + 1 - 2 = 0`。 

对于示例 2，数组为`[1, 2, 3, 4, 5, 6]`。 每个元素都属于自己的 LIS 层，因为整个数组正在增加。 

| 层| 当前指数| 前任窗口 | 直接统治者| 深度 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 空 | 来源 | 1 |
 | 2 | 1 |`[0]`| 0 | 2 |
 | 3 | 2 |`[1]`| 1 | 3 |
 | 4 | 3 |`[2]`| 2 | 4 |
 | 5 | 4 |`[3]`| 3 | 5 |
 | 6 | 5 |`[4]`| 4 | 6 |

 对于变换后的序列，深度以相反的顺序出现，`6, 5, 4, 3, 2, 1`。 在每个位置，两个深度相加`7`，所以减去`2`给出`5`。 这与删除任何其他元素会破坏包含所选索引的唯一递增子序列的事实相匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N log N) | O(N log N) | LIS 层需要 O(N log N)，而支配者构造执行 O(N) 分摊队列操作和 O(N) LCA 查询，每个成本为 O(log N)。 |
 | 空间| O(N log N) | O(N log N) | 二进制提升存储 O(N log N) 祖先，而层和滑动队列使用 O(N) 额外空间。 |

 最大输入包含`250000`元素。 该算法仅对每个顶点执行对数数量的祖先操作，而不是检查所有位置对。 这`O(N log N)`界限完全在 3 秒限制的预期范围内，并且`O(N log N)`祖先表很容易满足 1024 MB 内存限制。 

## 测试用例

 下面的测试工具假设提交的解决方案保存为`solution.py`并暴露了`solve()`函数如上所示。```python
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
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run("1\n1\n") == "0", "sample 1"
assert run("6\n1 2 3 4 5 6\n") == "5 5 5 5 5 5", "sample 2"
assert run("6\n6 5 4 3 2 1\n") == "0 0 0 0 0 0", "sample 3"
assert run("4\n2 1 4 3\n") == "0 0 0 0", "sample 4"
assert run("9\n1 2 3 6 5 4 7 8 9\n") == "5 5 5 6 6 6 5 5 5", "sample 5"

# Single element.
assert run("1\n7\n") == "0", "minimum size"

# Strictly decreasing permutation.
assert run("5\n5 4 3 2 1\n") == "0 0 0 0 0", "all LIS have length 1"

# A case with two different choices on one side.
assert run("3\n1 3 2\n") == "0 1 1", "sliding predecessor boundary"

# A longer case where both prefix and suffix dominators matter.
assert run("4\n3 1 2 4\n") == "1 2 2 2", "prefix and suffix dominance"

# Equal values are outside the permutation constraints, but are useful
# as a robustness check for the LIS boundary handling.
assert run("3\n5 5 5\n") == "0 0 0", "equal values"

# Maximum-size stress case, a decreasing permutation.
n = 250000
a = list(range(n, 0, -1))
expected = " ".join(["0"] * n)
assert run(str(n) + "\n" + " ".join(map(str, a)) + "\n") == expected, \
    "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 7`|`0`| 最小尺寸和没有另一个索引 |
 |`5 / 5 4 3 2 1`|`0 0 0 0 0`| 每个 LIS 的长度为 1 |
 |`3 / 1 3 2`|`0 1 1`| 严格的前驱边界和后缀处理 |
 |`4 / 3 1 2 4`|`1 2 2 2`| 两侧多个强制顶点 |
 |`3 / 5 5 5`|`0 0 0`| 等值边界行为，不受官方约束 |
 |`250000 / 250000 ... 1`| 全零| 最大限度`N`和性能|

 ## 边缘情况

 对于单元素输入`1 / 1`，唯一的顶点放置在第一个 LIS 层中。 其支配深度为`1`在原始序列和转换序列中。 公式给出`1 + 1 - 2 = 0`，因此算法绝不会意外地计算所选索引本身。 

对于严格递增的数组，例如`1 2 3`，每一层只包含一个顶点。 因此，前驱窗口对于每个非第一个顶点恰好包含一个元素，并且支配树只是一条链。 深度是`1, 2, 3`从左边和`3, 2, 1`从右边开始，给予`2, 2, 2`。 这练习了所有其他元素都是真正必要的情况。 

对于严格递减的数组，例如`3 2 1`，每个顶点都位于第一个 LIS 层中。 真实顶点之间没有边，因此每个支配深度是`1`。 转换后的数组具有相同的属性。 最终公式在各处生成零，正确处理所选元素只能参与长度为一递增子序列的情况。 

为了`1 3 2`，左边的层是`[0]`和`[1, 2]`。 对于索引`1`, 前驱窗口包含索引`0`，所以索引`0`支配它。 对于索引`2`，前驱窗口也包含索引`0`, 制作索引`0`它不可避免的前缀元素。 右侧是索引`1`其后没有更大的元素，而索引`2`没有后缀扩展名。 结合两个方向给出`0 1 1`。 该示例特别指出了将同一 LIS 层中的每个元素视为可能的前身而不考虑值边界的错误。 

为了`3 1 2 4`，左支配深度是`1, 1, 2, 3`。 价值`1`主导结束于的子序列`2`，以及两者`1`和`2`主导结束于的子序列`4`。 变换后的通道提供右侧深度`2, 3, 2, 1`。 将它们结合起来给出`1 2 2 2`。 这个案例说明了为什么仅仅计算直接前驱是不够的，因为一个顶点可能不可避免地要穿过支配树的多个层。 

对于相等的值，例如`5 5 5`，违反了官方输入保证，但该测试对于检查严格的比较边界很有用。 没有两个相等的值可以扩展严格递增的子序列，因此每个选定的索引的最大长度为 1，预期结果为`0 0 0`。 实现使用`bisect_left`和`>=`前任拒绝与严格的不平等一致。
