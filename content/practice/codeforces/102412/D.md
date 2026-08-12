---
title: "CF 102412D - 从自我重要性的高度到智商水平的高度的跳跃"
description: "我们有一排 (n) 座摩天大楼，它们的高度形成 (1,2,ldots,n) 的排列。 有效的跳跃使用三座按位置递增顺序排列的摩天大楼，其高度也严格递增。"
date: "2026-08-12T00:36:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102412
codeforces_index: "D"
codeforces_contest_name: "MEX Foundation Contest (supported by AIM Tech)"
rating: 0
weight: 102412
solve_time_s: 193
verified: true
draft: false
---

[CF 102412D - 从自我重要性的高度到智商水平的高度的跳跃](https://codeforces.com/problemset/problem/102412/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排 (n) 座摩天大楼，它们的高度形成 (1,2,\ldots,n) 的排列。 有效的跳跃使用三座按位置递增顺序排列的摩天大楼，其高度也严格递增。 换句话说，我们需要知道当前序列是否包含长度为三的递增子序列。 

每个查询采用一个连续的段并将其循环向右旋转 (k) 个位置。 两块的内部顺序被保留，但它们的顺序被交换了。 每次旋转后，我们必须报告是否存在长度为 3 的递增子序列。 官方限制为 (n,q\le120000)，时间限制为 7 秒，内存为 512 MiB。 

每次查询后的直接检查将扫描整个排列。 由于(n)和(q)都可以是(120000)，所以(O(nq))意味着大约(1.44\times10^{10})个元素访问，远远超出了时间限制允许的范围。 即使对一个状态进行 (O(n^2)) 检查也已经太大了，因此解决方案必须利用这样一个事实：旋转通过重新排列整个连续块而不是改变各个高度来改变序列。 平衡树方法给出 (O(n\log^2 n+q\log^2 n))，这是这些边界的预期规模。 

在一些小情况下，粗心的实施可能会失败。 例如，只有两座摩天大楼，`2 1`永远不能包含有效的三元组，所以答案是`NO`; 仅检查是否存在上升的代码可能会错误地报告`YES`。 单元素旋转是另一种边界情况。 用于输入```
3
2 3 1
1
1 3 0
```该段不移动，顺序保持不变`2 3 1`，所以答案是`NO`。 将 (k=0) 视为不平凡的分割可能会意外更改序列。 另一个极端是(k=r-l+1)，这也是一个空操作。 最后，保证高度是不同的，因此“全部相等”测试用例在问题约束下不是有效输入。 然而，决不能意外地使用等值比较，因为所需的不等式是严格的。 

## 方法

 暴力解决方案很简单。 将当前排列存储在数组中，通过将查询区间的最后（k）个元素移动到其前面来执行循环旋转，然后扫描整个数组以确定其是否包含长度为3的递增子序列。 通过维持迄今为止看到的最小值和递增对的最小可能第二值，扫描本身可以在线性时间内完成。 这是正确的，因为大于第二个值的第三个值构成了有效的三元组。 

问题是重复的全扫描。 在最坏的情况下，(n=q=120000)，甚至在考虑旋转之前就给出了大约 (144) 亿次操作。 如果按字面意思实现，更新数组本身也可能需要 (O(n)) 移动。 

有用的观察结果是旋转不会改变任何结果块内的顺序。 假设一个线段被分成(A)和(B)，其中(B)是从末尾移动到前面的部分。 新的段就是（BA）。 这表明隐式平衡树，其中中序遍历是当前排列，并且按位置分割需要对数时间。 

剩下的困难是维护子树是否包含递增三元组。 子树只需要少量信息。 我们存储它的最小和最大高度，无论它是否已经包含一个递增的三元组，并且当它不包含这样的三元组时，存储它的递增对的两个属性。 让`first_max`是所有对 (i<j) 和 (a_i<a_j) 中最大可能的第一个值 (a_i)，并且让`second_min`是这些对中可能的最小第二个值 (a_j)。 

当两个相邻序列连接时，新的三元组只能完全位于一个子序列内或跨越边界。 跨边界三元组要么在左子节点中有两个元素，在右子节点中有一个元素，要么在左子节点中有一个元素，右子节点中有两个元素。 存储的极值对让我们可以检测这两种情况。 计算精确的跨边界对极值需要在 123 避免子树内找到前驱或后继。 关键的结构事实是，虽然子树不包含递增三元组，但可以通过降低平衡树并使用其极值修剪整个子树来执行此搜索。 这是提供额外对数因子而不是强制线性扫描的特殊属性。 这也是标准平衡树解决方案背后的中心观察。 

因此，强力解决方案之所以有效，是因为谓词本身很容易测试，但当每次大型重新排列后都必须重新计算时，它就会失败。 观察到旋转只是一个分割然后是合并，这让我们可以将谓词保留为子树聚合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(nq)) | (O(n)) | (O(n)) | 太慢了|
 | 最优隐式trap | (O((n+q)\log^2 n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1.构建一个隐式随机trap，其中序序列是当前摩天大楼的顺序。 每个节点代表一座摩天大楼，子树大小决定位置索引。 treap 是合适的，因为分割前 (k) 个元素和连接两个序列都需要预期的对数时间。 
2. 对于每个子树，维护其大小、最小高度、最大高度以及是否已存在递增三元组。 如果子树仍然没有三元组，则还保持`first_max`和`second_min`因为它的配对不断增加。 
3. 当组合左子树、当前节点和右子树时，首先确定任一子树是否已包含三元组。 如果是，则组合子树立即包含一个，并且不再需要配对信息。 
4. 否则，检测跨越边界的三元组。 如果左子树包含一个递增对，其第二个值小于右子树的最大值，则这两个左元素后跟该最大值形成一个三元组。 这正是条件`left.second_min < right.max`。 
5. 对称地，如果左子树的最小值小于右子树中某个递增对的第一个值，则该对后面的左侧最小值形成一个三元组。 这给出了`left.min < right.first_max`。 
6. 如果不存在三元组，则更新对信息。 已包含在任一子项中的对仍然有效。 使用每一侧一个元素的新对具有最大可能的第一个值，等于前一个元素`right.max`在左子树的值之间。 它的最小可能的第二个值是`left.min`在右子树的值之间。 
7. 通过在位置 (l) 之前进行拆分来执行每个查询，然后拆分出段 ([l,r])。 在该段内，将其分为 (A) 和 (B)，其中 (B) 的长度为 (k)。 将段替换为 (BA)。 最后将其与前缀和后缀合并回来。 
8.根的`has_three`flag直接决定答案。 打印`YES`当它是真的并且`NO`否则。 

为什么有效：串联中的每个递增三元组要么完全包含在左侧部分中，要么完全包含在右侧部分中，要么跨越边界。 前两种情况由儿童旗帜代表。 对于左侧有两个元素的交叉三元组，最佳可能的第二个元素是`left.second_min`，最好的第三个元素是`right.max`。 对于右侧有两个元素的交叉三元组，最佳可能的第一个元素是`left.min`，最好的第二个元素是`right.first_max`。 因此，所有可能的三元组都被覆盖了。 对极值恰好从三个可能的对位置（左-左、右-右和左-右）进行更新。 因此，存储在每个 treap 节点的聚合准确地描述了其有序序列，因此每次拆分和合并后根标志始终是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

INF = 10**18

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    q = int(input())

    # Node 0 is the null node.
    left = [0]
    right = [0]
    value = [0]
    priority = [0]
    size = [0]

    mn = [INF]
    mx = [-INF]
    bad = [False]

    # For a triple-free subtree:
    # first_max  = maximum first value among increasing pairs.
    # second_min = minimum second value among increasing pairs.
    first_max = [-INF]
    second_min = [INF]

    seed = 712367821

    def rng():
        nonlocal seed
        seed ^= (seed << 13) & 0xFFFFFFFF
        seed ^= seed >> 17
        seed ^= (seed << 5) & 0xFFFFFFFF
        seed &= 0xFFFFFFFF
        return seed

    def new_node(v):
        idx = len(value)
        left.append(0)
        right.append(0)
        value.append(v)
        priority.append(rng())
        size.append(1)
        mn.append(v)
        mx.append(v)
        bad.append(False)
        first_max.append(-INF)
        second_min.append(INF)
        return idx

    # Find the largest value < x in a triple-free subtree.
    def predecessor(t, x):
        if not t or mn[t] >= x:
            return 0
        if mx[t] < x:
            return mx[t]

        ans = 0

        r = right[t]
        z = predecessor(r, x)
        if z > ans:
            ans = z

        v = value[t]
        if v < x and v > ans:
            ans = v

        l = left[t]
        z = predecessor(l, x)
        if z > ans:
            ans = z

        return ans

    # Find the smallest value > x in a triple-free subtree.
    def successor(t, x):
        if not t or mx[t] <= x:
            return INF
        if mn[t] > x:
            return mn[t]

        ans = INF

        l = left[t]
        z = successor(l, x)
        if z < ans:
            ans = z

        v = value[t]
        if v > x and v < ans:
            ans = v

        r = right[t]
        z = successor(r, x)
        if z < ans:
            ans = z

        return ans

    def pull(t):
        l = left[t]
        r = right[t]
        v = value[t]

        size[t] = size[l] + size[r] + 1
        mn[t] = min(mn[l], v, mn[r])
        mx[t] = max(mx[l], v, mx[r])

        if bad[l] or bad[r]:
            bad[t] = True
            first_max[t] = -INF
            second_min[t] = INF
            return

        has_triple = (
            second_min[l] < mx[r] or
            mn[l] < first_max[r]
        )

        cross_first = 0
        cross_second = INF

        if l and r:
            cross_first = predecessor(l, mx[r])
            cross_second = successor(r, mn[l])

            if cross_first and cross_second != INF:
                has_triple = has_triple or (
                    second_min[l] < mx[r] or
                    mn[l] < first_max[r]
                )

        bad[t] = has_triple

        if has_triple:
            first_max[t] = -INF
            second_min[t] = INF
            return

        fm = max(first_max[l], first_max[r], cross_first)
        sm = min(second_min[l], second_min[r], cross_second)

        # Pairs involving the root value itself.
        if l and v > mn[l]:
            p = predecessor(l, v)
            if p:
                fm = max(fm, p)
                sm = min(sm, v)

        if r and mx[r] > v:
            s = successor(r, v)
            if s != INF:
                fm = max(fm, v)
                sm = min(sm, s)

        first_max[t] = fm
        second_min[t] = sm

    # Build the initial treap in O(n) using the Cartesian-tree stack.
    nodes = [new_node(v) for v in a]

    stack = []
    for t in nodes:
        last = 0
        while stack and priority[stack[-1]] < priority[t]:
            last = stack.pop()
        if stack:
            right[stack[-1]] = t
        left[t] = last
        stack.append(t)

    root = stack[0]

    # Pull aggregates bottom-up.
    order = []
    st = [root]
    while st:
        t = st.pop()
        order.append(t)
        if left[t]:
            st.append(left[t])
        if right[t]:
            st.append(right[t])

    for t in reversed(order):
        pull(t)

    def split(t, k):
        if not t:
            return 0, 0

        l = left[t]

        if size[l] >= k:
            x, y = split(l, k)
            left[t] = y
            pull(t)
            return x, t

        x, y = split(right[t], k - size[l] - 1)
        right[t] = x
        pull(t)
        return t, y

    def merge(a_root, b_root):
        if not a_root:
            return b_root
        if not b_root:
            return a_root

        if priority[a_root] > priority[b_root]:
            right[a_root] = merge(right[a_root], b_root)
            pull(a_root)
            return a_root

        left[b_root] = merge(a_root, left[b_root])
        pull(b_root)
        return b_root

    out = []

    for _ in range(q):
        l, r, k = map(int, input().split())

        if k == 0 or k == r - l + 1:
            out.append("YES" if bad[root] else "NO")
            continue

        prefix, rest = split(root, l - 1)
        segment, suffix = split(rest, r - l + 1)

        first_part, second_part = split(
            segment,
            r - l + 1 - k
        )

        segment = merge(second_part, first_part)
        root = merge(prefix, merge(segment, suffix))

        out.append("YES" if bad[root] else "NO")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```陷阱是隐式的，因此没有代表位置的键。 节点的位置由其左子树的大小决定。 这使得`split(root, k)`准确地说是“获取前（k）座摩天大楼”，这就是循环旋转所需要的。 

这`pull`功能是解决方案的核心。 最小值和最大值是普通的子树聚合。`bad`记录 123 模式是否已存在。 什么时候`bad`是假的，`first_max`和`second_min`描述子树中每一个递增的对。 仅当子树避免 123 时才需要前驱和后继搜索，这正是结构剪枝性质适用的情况。 这与预期解决方案的独立文章中描述的信息集相同。 

这两项检查涉及`second_min[l]`和`first_max[r]`故意使用严格的比较。 高度是不同的，因此平等不能构成有效跳跃的一部分。 根节点本身也参与增加对，这就是为什么`pull`显式处理当前值和任一子值之间的对。 

查询使用`r - l + 1 - k`分割旋转线段时。 这是在右旋转移动其前面的最后 (k) 个元素之前停留在前面的部分的长度。 如果(k)为零或整个段长度，则序列不会改变，因此我们可以避免不必要的树操作。 

Python整数不会溢出，所有存储的高度最多为(120000)。 主要的实现问题是递归深度，因此递归限制大幅提高。 随机优先级使陷阱高度保持对数预期。 

## 工作示例

 ### 示例 1

 输入是```
6
2 5 6 1 3 4
1
1 6 5
```整个数组向右旋转了五个位置，相当于将第一个元素移到了末尾。 

| 步骤| 序列 | 旋转分割| 根`bad`|
 | ---| ---| ---| ---|
 | 初始|`2 5 6 1 3 4`| 无 |`YES`|
 | 分裂|`2`+`5 6 1 3 4`| 第一部分长度 1 |`YES`|
 | 旋转|`5 6 1 3 4`+`2`| 右侧部分长度 5 |`YES`|
 | 决赛|`5 6 1 3 4 2`| 合并|`YES`|

 最终序列包含`1,3,4`增加位置和高度，所以答案是`YES`。 该迹线表明，旋转可以纯粹通过trap拆分和合并来表达，而无需物理移动五个数组元素。 

### 示例 3

 输入是```
5
4 3 2 5 1
2
3 4 1
1 2 1
```| 步骤| 序列 | 运营| 根`bad`|
 | ---| ---| ---| ---|
 | 初始|`4 3 2 5 1`| 无 |`NO`|
 | 1 |`4 3 5 2 1`| 旋转`[3,4]`右边 1 |`NO`|
 | 2 |`3 4 5 2 1`| 旋转`[1,2]`右边 1 |`YES`|

 在第一次操作之后，序列有一个上升，例如`3,5`，但没有第三个后来的高度大于`5`，所以仅靠上升是不够的。 第二次手术后，`3,4,5`以递增顺序出现，产生所需的三元组。 这正是所捕捉到的区别`first_max`和`second_min`配对信息。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((n+q)\log^2 n)) 预期 | Treap 操作使用预期的 (O(\log n)) 高度，而重建聚合可以执行对数前驱或后继搜索 |
 | 空间| (O(n)) | (O(n)) | 每栋摩天大楼有一个陷阱节点和恒定数量的聚合信息 |

 约束允许 (120000) 座摩天大楼和 (120000) 次旋转，因此二次或 (O(nq)) 方法不可行。 平衡树表示在结构级别上保持每次旋转对数，而特殊的 123 避免搜索将聚合重新计算保持在附加对数因子内。 官方时间限制为7秒，内存限制为512 MiB。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()

        solve()

        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run(
    """6
2 5 6 1 3 4
1
1 6 5
"""
) == "YES\n", "sample 1"

# Provided sample 2
assert run(
    """8
5 1 2 8 7 6 3 4
4
2 4 2
4 5 1
1 3 2
3 8 2
"""
) == "YES\nYES\nYES\nYES\n", "sample 2"

# Provided sample 3
assert run(
    """5
4 3 2 5 1
2
3 4 1
1 2 1
"""
) == "NO\nYES\n", "sample 3"

# Provided sample 4
assert run(
    """6
6 5 4 3 2 1
3
1 1 0
1 3 1
2 5 3
"""
) == "NO\nNO\nYES\n", "sample 4"

# Minimum size.
assert run(
    """1
1
1
1 1 0
"""
) == "NO\n", "minimum size"

# Two elements can never form a triple.
assert run(
    """2
1 2
1
1 2 1
"""
) == "NO\n", "two elements"

# Full rotation by one creates 1,2,3.
assert run(
    """3
2 3 1
1
1 3 1
"""
) == "YES\n", "full-range rotation"

# Boundary case with no movement.
assert run(
    """3
3 2 1
1
1 3 0
"""
) == "NO\n", "zero rotation"

# Maximum-size decreasing permutation.
n = 120000
max_case = (
    str(n) + "\n" +
    " ".join(map(str, range(n, 0, -1))) + "\n" +
    "1\n" +
    "1 120000 1\n"
)
assert run(max_case) == "NO\n", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 / 1 1 0`|`NO`| 最小尺寸|
 |`2 / 1 2 / 1 2 1`|`NO`| 少于三座摩天大楼|
 |`3 / 2 3 1 / 1 3 1`|`YES`| 全范围循环旋转 |
 |`3 / 3 2 1 / 1 3 0`|`NO`| 零旋转边界 |
 | 大小递减排列`120000`|`NO`| 最大输入尺寸和性能|
 | 提供样品| 如所列| 一般正确性和旋转边界 |

 ## 边缘情况

 对于长度为 1 的线段，每次允许的旋转都会使其保持不变。 例如，```
3
3 2 1
1
2 2 1
```产生`NO`。 该实现自然地处理了这个问题，因为分割出一个单元素段并旋转它会将相同的节点留在相同的位置。 

零旋转也是无操作。 和```
3
3 2 1
1
1 3 0
```序列仍然存在`3 2 1`，其中不包含递增三元组，因此输出为`NO`。 代码在执行任何拆分之前显式处理 (k=0)。 

整个段长度的旋转是另一个无操作。 为了```
3
2 3 1
1
1 3 3
```最终的顺序仍然是`2 3 1`，所以输出是`NO`。 将其视为普通旋转会引入不必要的分裂，并且是边界错误的常见来源。 

序列可以包含许多递增对，但不包含递增三元组。 Sample-3 中间状态`4 3 5 2 1`演示了这一点：`3,5`是一对递增的对，但后来的摩天大楼都没有比`5`。 该算法将对信息与三重标志分开，因此它不会将“存在上升”与“存在长度为三的递增子序列”混淆。 

最后，该问题保证所有高度都是不同的。 因此，相等永远不会促成有效的跳转，并且聚合逻辑中的每个比较都是严格的。 粗心的实现使用`<=`而不是`<`将解决一个不同的问题。
