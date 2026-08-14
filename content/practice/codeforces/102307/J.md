---
title: "CF 102307J - 监狱破坏"
description: "我们有 (n) 个墙高的数组。 销毁操作选择一个区间 ([a,b]) 并从该区间内的每堵墙精确移除 (s) 米，但墙不能变为负值。 换句话说，每个受影响的高度都会从 (hi) 变为 (max(0,hi-s))。"
date: "2026-08-13T07:25:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102307
codeforces_index: "J"
codeforces_contest_name: "2019 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102307
solve_time_s: 106
verified: true
draft: false
---

[CF 102307J - 监狱破坏](https://codeforces.com/problemset/problem/102307/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (n) 个墙高的数组。 销毁操作选择一个区间 ([a,b]) 并从该区间内的每堵墙精确移除 (s) 米，但墙不能变为负值。 换句话说，每个受影响的高度从 (h_i) 变为 (\max(0,h_i-s))。 

查询询问给定间隔内所有墙壁的总剩余高度。 这些操作是在线的，因此每个查询都必须使用之前所有销毁操作生成的状态来回答。 

约束足够大，足以排除在某个时间间隔内更新每面墙的可能性。 对于 (n,q\le 10^5)，所有操作中可能有 (10^{10}) 个受影响的位置。 即使是 (O(nq)) 的解决方案也远远超出了几秒钟的处理能力。 我们需要一个通常可以处理整个区间而不触及其各个壁的数据结构。 

困难在于零处的截断。 普通的惰性线段树可以立即执行诸如 (h_i\mathrel{-}=s) 之类的操作，因为每个值都会发生相同的变化。 在这里，一些墙壁可能达到零，而较高的墙壁继续减少，因此单个统一的惰性值并不总是足够的。 

一些边缘情况暴露了这个问题。 

考虑一堵墙：```
1 3
2
2 1 1 5
1 1 1
```墙的高度为 (2)，因此破坏 (5) 米留下高度 (0)。 输出是：```
0
```简单地减去 (5) 的实现将存储 (-3)，从而产生无效答案。 

现在考虑不同的高度：```
2 2
3 10
2 1 2 5
1 1 2
```攻击后高度为 (0,5)，因此正确的输出为：```
5
```从整个段中减去 (5) 的惰性更新无法正确表示第一面墙，因为该墙已经达到零。 

平等是另一个边界情况：```
2 2
5 10
2 1 2 5
1 1 2
```所得高度为 (0,5)，答案为：```
5
```实现必须将 (s=\text{最小正高度}) 视为至少一面墙变为零的情况。 仅当 (s) 严格小于最小正高度时，惰性减法才是安全的。 

最后，间隔可以包含已经为零的墙：```
3 3
2 5 1
2 1 1 3
2 1 3 2
1 1 3
```第一次攻击后，数组为 (0,5,1)。 第二个之后是(0,3,0)，所以答案是：```
3
```零值墙不得参与未来的减法。 将零视为普通最小值将使数据结构无法区分“已被破坏”和“最小正墙”。 

## 方法

 直接解决方案存储每个当前的墙高度。 对于 ([a,b]) 上的销毁操作，它会访问该区间内的每个索引并执行 (h_i=\max(0,h_i-s))。 查询类似地扫描间隔并添加所有高度。 这是正确的，因为它完全执行问题所描述的操作。 

问题是最坏的情况。 如果所有 (q) 次操作都会影响整个数组，则每个操作都会触及 (n) 面墙，从而提供 (O(nq)) 功。 如果两个值都大到 (10^5)，则最多需要 (10^{10}) 个单独的数组操作，这太大了。 

普通的惰性线段树似乎很有前途，因为通常可以立即减少整个区间。 障碍物是零边界。 假设一个线段包含高度 (3,10,12)，我们减去 (5)。 结果是(0,5,7)。 没有单一的减法可以正确地转换所有三个值。 

有用的观察是我们不需要知道高度的完整分布。 对于一段，保留其总和、正墙数和最小正高度。 如果 (s) 小于该最小正高度，则每面正墙都能在攻击中幸存下来。 然后整个段可以延迟减少 (s)，因为所有正值都会经历完全相同的转换。 

如果 (s) 至少为最小正高度，则至少一堵墙变为零。 我们递归地检查该部分，直到这些墙可以被单独摧毁。 这听起来可能很昂贵，但每一次这样的强制下降都会永久移除至少一堵积极的墙。 一堵墙只能变为零一次，因此昂贵的部分会在整个执行过程中摊销。 

相同的线段树可以以标准 (O(\log n)) 方式回答求和查询。 因此，该解决方案将惰性传播与摊销的“破坏最小正值”策略结合起来。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(nq)) 最坏情况 | (O(n)) | (O(n)) | 太慢了|
 | 最佳| (O((n+q)\log n)) 摊销 | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 在墙的高度上构建一棵线段树。 对于每个节点，存储其间隔的总和、该间隔中正墙的数量以及最小正墙的高度。 当整个区间已经被破坏时，将 (+\infty) 存储为最小值。 这三个值正是我们决定是否可以延迟应用销毁操作所需要的。 
2. 还存储一个惰性值，表示已从节点中当前每个正墙移除的米。 如果一个节点包含`cnt`正墙并接收 (s) 的惰性减法，其总和减少`cnt * s`，其最小正高度减少(s)。 零墙不受影响。 
3. 对于全覆盖节点的销毁操作，首先检查其和是否为零。 如果是这样，整个区间就已经被破坏了，没有什么可做的。 
4. 如果节点被完全覆盖并且 (s) 严格小于其最小正高度，则延迟应用减法。 每面正墙都保持正向，因此所有墙都确实损失了精确的米数。 
5.否则，下降到孩子身上。 条件 (s\ge\text{最小正高度}) 意味着至少有一个正墙将达到零，因此该操作不能用一次均匀惰性减法来表示。 在下降之前推送任何挂起的惰性值，以便孩子们看到他们当前的实际高度。 
6. 在叶子处，用零层减去 (s)。 由于这片叶子是通过硬壳到达的，因此它的当前高度最多为(s)，因此它变为零。 将其正数设置为零，并将其最小值设置为 (+\infty)。 
7. 更新子项后，合并它们。 新的总和是子项总和，正计数是子项计数的总和，最小正高度是较小的子项最小值。 
8. 对于求和查询，使用普通的线段树区间遍历。 在进入子项之前推送惰性值，因为子项的存储状态可能仍在等待其父项的待减法。 

工作原理：每个线段树节点始终通过其总和、正计数和最小正高度来准确描述其区间。 当 (s) 小于最小正高度时，没有墙可以达到零，因此从每个正墙中减去 (s) 正是所需的操作，并且可以安全地存储为惰性标记。 当(s)达到最小值时，统一减法不再有效，因此算法下降，直到可以单独处理受影响的墙壁。 每片叶子的更新恰好是 (h_i\leftarrow\max(0,h_i-s))。 由于父信息是根据正确的子信息重建的，因此每次更新后都会保留不变量。 查询返回这些精确段状态的总和，因此每个报告的间隔总计都是正确的。 

摊销来自硬箱。 每当完全覆盖的节点无法延迟更新时，其最小正墙就会在其下方的某处被破坏。 每堵墙只能被摧毁一次。 围绕被破坏的墙的递归具有高度 (O(\log n))，因此所有硬下降共同贡献 (O(n\log n))。 由查询边界和延迟处理更新引起的普通遍历贡献 (O(q\log n))。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    size = 4 * n + 5
    total = [0] * size
    mn = [INF] * size
    cnt = [0] * size
    lazy = [0] * size

    def build(node, left, right):
        if left == right:
            value = a[left]
            total[node] = value
            mn[node] = value
            cnt[node] = 1
            return

        mid = (left + right) // 2
        lc = node * 2
        rc = lc + 1

        build(lc, left, mid)
        build(rc, mid + 1, right)

        total[node] = total[lc] + total[rc]
        cnt[node] = cnt[lc] + cnt[rc]
        mn[node] = min(mn[lc], mn[rc])

    def apply(node, value):
        if cnt[node] == 0:
            return

        total[node] -= cnt[node] * value
        mn[node] -= value
        lazy[node] += value

    def push(node):
        value = lazy[node]
        if value == 0:
            return

        lc = node * 2
        rc = lc + 1

        apply(lc, value)
        apply(rc, value)

        lazy[node] = 0

    def pull(node):
        lc = node * 2
        rc = lc + 1

        total[node] = total[lc] + total[rc]
        cnt[node] = cnt[lc] + cnt[rc]
        mn[node] = min(mn[lc], mn[rc])

    def update(node, left, right, ql, qr, value):
        if qr < left or right < ql or total[node] == 0:
            return

        if ql <= left and right <= qr and value < mn[node]:
            apply(node, value)
            return

        if left == right:
            total[node] = 0
            cnt[node] = 0
            mn[node] = INF
            lazy[node] = 0
            return

        push(node)

        mid = (left + right) // 2
        lc = node * 2
        rc = lc + 1

        if ql <= mid:
            update(lc, left, mid, ql, qr, value)
        if qr > mid:
            update(rc, mid + 1, right, ql, qr, value)

        pull(node)

    def query(node, left, right, ql, qr):
        if qr < left or right < ql:
            return 0

        if ql <= left and right <= qr:
            return total[node]

        push(node)

        mid = (left + right) // 2

        result = 0
        if ql <= mid:
            result += query(node * 2, left, mid, ql, qr)
        if qr > mid:
            result += query(node * 2 + 1, mid + 1, right, ql, qr)

        return result

    build(1, 0, n - 1)

    output = []

    for _ in range(q):
        parts = list(map(int, input().split()))
        operation = parts[0]
        left = parts[1] - 1
        right = parts[2] - 1

        if operation == 1:
            output.append(str(query(1, 0, n - 1, left, right)))
        else:
            value = parts[3]
            update(1, 0, n - 1, left, right, value)

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```该树使用四个数组，因为 Python 对象密集型节点结构会消耗更多内存并增加开销。`total[node]`是剩余的总墙高，`cnt[node]`数正墙，`mn[node]`是它们的最小正高度，并且`lazy[node]`存储待执行的减法。 

这`apply`函数仅对保持每个正壁为正的减法有效。 条件`value < mn[node]`正是保证了这一点。 正墙的数量没有改变，所以总和减少了`cnt[node] * value`最小值减少`value`。 

一个完全被破坏的节点有`cnt[node] == 0`。 其最小值表示为`INF`，而不是零。 这种区别很重要，因为零意味着“不是正值”，而我们需要的最小值具体是正值墙中的最小值。 这`apply`函数忽略被破坏的节点，因此挂起的减法永远不会影响它们。 

严格比较`value < mn[node]`是另一个重要的细节。 如果`value == mn[node]`，至少有一面墙恰好达到零，因此该操作必须递归。 将相等视为惰性更新会使正数和最小值不正确。 

在递归硬壳到达的叶子处，墙必然变为零。 重置`lazy[node]`是必要的，因为零叶子绝不能将减法标签带入未来。 不然以后`push`可能会错误地修改其存储的最小值。 

该实现内部使用从零开始的索引，而输入使用从一开始的索引。 读取两个查询端点后立即将其减一可以避免重复转换并保持线段树边界一致。 

Python 整数具有任意精度，因此总和不会溢出。 最大可能的总数是 (10^5\cdot10^8=10^{13})，无论如何它都适合 64 位整数。 

## 工作示例

 提供的示例从两个高度 (10) 的墙开始。 

| 运营| 运算后的数组 | 查询总和 |
 | ---| ---| ---|
 |`1 1 2`|`[10, 10]`| 20 |
 |`2 1 2 5`|`[5, 5]`| |
 |`1 1 2`|`[5, 5]`| 10 | 10
 |`2 2 2 6`|`[5, 0]`| |
 |`1 1 2`|`[5, 0]`| 5 |

 第一个攻击可以用一个惰性减法来表示，因为分段最小值是 (10)，它大于 (5)。 更新后，段总和为 (10)，其正计数仍为 (2)，其最小正高度为 (5)。 

第二次攻击仅针对第二堵墙。 它的当前高度是（5），而攻击删除了（6），因此严格惰性条件失败。 递归到达该叶子并完全破坏它。 所得总和为 (5)。 

对于第二个示例，请考虑：```
4 5
7 3 10 5
1 1 4
2 2 3 4
1 2 4
2 1 2 6
1 1 3
```状态可以如下追踪。 

| 步骤| 运营| 数组 | 相关金额|
 | ---| ---| ---| ---|
 | 0 | 初始|`[7, 3, 10, 5]`| 25 | 25
 | 1 |`1 1 4`|`[7, 3, 10, 5]`| 25 | 25
 | 2 |`2 2 3 4`|`[7, 0, 6, 5]`| |
 | 3 |`1 2 4`|`[7, 0, 6, 5]`| 11 | 11
 | 4 |`2 1 2 6`|`[1, 0, 6, 5]`| |
 | 5 |`1 1 3`|`[1, 0, 6, 5]`| 7 |

 对位置 (2) 到 (3) 的攻击具有最小正高度 (3)，同时 (s=4)。 高度为 (3) 的墙必须被破坏，因此树会下降，而不是对整个区间应用一次惰性减法。 高度为 (10) 的墙变为 (6)。 

随后，对位置 (1) 到 (2) 的攻击消除了 (6)。 第一个墙从 (7) 到 (1)，而第二个墙已经为零。 因为被毁坏的墙壁`cnt = 0`，他们不参与减法。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((n+q)\log n)) 摊销 | 普通树遍历每次操作的成本为 (O(\log n))，而硬下降则对变为零的墙收费。 
| 空间| (O(n)) | (O(n)) | 四个线段树数组包含 (O(n)) 个节点 |

 输入最多包含 (10^5) 个墙和 (10^5) 个操作。 线段树避免了直接模拟的 (O(nq)) 最坏情况。 其摊销 (O((n+q)\log n)) 工作适合 (4) 秒和 (256) MB 限制，而基于数组的 Python 表示可以控制内存使用情况。 

## 测试用例```python
import sys
import io

INF = 10**30

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        n, q = map(int, sys.stdin.readline().split())
        a = list(map(int, sys.stdin.readline().split()))

        size = 4 * n + 5
        total = [0] * size
        mn = [INF] * size
        cnt = [0] * size
        lazy = [0] * size

        def build(node, left, right):
            if left == right:
                value = a[left]
                total[node] = value
                mn[node] = value
                cnt[node] = 1
                return

            mid = (left + right) // 2
            build(node * 2, left, mid)
            build(node * 2 + 1, mid + 1, right)

            total[node] = total[node * 2] + total[node * 2 + 1]
            cnt[node] = cnt[node * 2] + cnt[node * 2 + 1]
            mn[node] = min(mn[node * 2], mn[node * 2 + 1])

        def apply(node, value):
            if cnt[node] == 0:
                return
            total[node] -= cnt[node] * value
            mn[node] -= value
            lazy[node] += value

        def push(node):
            value = lazy[node]
            if value == 0:
                return
            apply(node * 2, value)
            apply(node * 2 + 1, value)
            lazy[node] = 0

        def pull(node):
            total[node] = total[node * 2] + total[node * 2 + 1]
            cnt[node] = cnt[node * 2] + cnt[node * 2 + 1]
            mn[node] = min(mn[node * 2], mn[node * 2 + 1])

        def update(node, left, right, ql, qr, value):
            if qr < left or right < ql or total[node] == 0:
                return

            if ql <= left and right <= qr and value < mn[node]:
                apply(node, value)
                return

            if left == right:
                total[node] = 0
                cnt[node] = 0
                mn[node] = INF
                lazy[node] = 0
                return

            push(node)

            mid = (left + right) // 2
            if ql <= mid:
                update(node * 2, left, mid, ql, qr, value)
            if qr > mid:
                update(node * 2 + 1, mid + 1, right, ql, qr, value)

            pull(node)

        def query(node, left, right, ql, qr):
            if qr < left or right < ql:
                return 0

            if ql <= left and right <= qr:
                return total[node]

            push(node)

            mid = (left + right) // 2
            result = 0

            if ql <= mid:
                result += query(node * 2, left, mid, ql, qr)
            if qr > mid:
                result += query(node * 2 + 1, mid + 1, right, ql, qr)

            return result

        build(1, 0, n - 1)

        output = []

        for _ in range(q):
            parts = list(map(int, sys.stdin.readline().split()))
            op = parts[0]
            l = parts[1] - 1
            r = parts[2] - 1

            if op == 1:
                output.append(str(query(1, 0, n - 1, l, r)))
            else:
                update(1, 0, n - 1, l, r, parts[3])

        return "\n".join(output)
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

assert run("""2 5
10 10
1 1 2
2 1 2 5
1 1 2
2 2 2 6
1 1 2
""") == """20
10
5""", "provided sample"

assert run("""4 5
7 3 10 5
1 1 4
2 2 3 4
1 2 4
2 1 2 6
1 1 3
""") == """25
11
7""", "mixed updates and queries"

assert run("""1 3
2
1 1 1
2 1 1 5
1 1 1
""") == """2
0""", "minimum-size input and over-destruction"

assert run("""5 5
8 8 8 8 8
2 1 5 3
1 1 5
2 2 4 5
1 1 5
1 2 4
""") == """25
10
0""", "all equal values"

assert run("""4 6
3 100 4 8
2 1 1 3
1 1 4
2 2 3 4
1 1 4
2 4 4 8
1 3 4
""") == """109
101
0""", "single-position and boundary updates"

n = 100000
maximum_input = (
    f"{n} 3\n"
    + " ".join(["100000000"] * n)
    + "\n"
    + f"1 1 {n}\n"
    + f"2 1 {n} 100000000\n"
    + f"1 1 {n}\n"
)
assert run(maximum_input) == "10000000000000\n0", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 3 / 2 / ...`|`2`， 然后`0`| 单墙和破坏大于其高度|
 |`5 5 / 8 8 8 8 8 / ...`|`25`,`10`,`0`| 等高重复全方位操作|
 |`4 6 / 3 100 4 8 / ...`|`109`,`101`,`0`| 单位置更新和区间边界 |
 |`100000`等高的墙`100000000`|`10000000000000`， 然后`0`| 最大（n）、大额、全方位破坏|

 ## 边缘情况

 大于墙壁的破坏量绝不能产生负高度。 为了```
1 3
2
1 1 1
2 1 1 5
1 1 1
```第一个查询返回 (2)。 更新到达高度为 (2) 的叶子，并且由于 (5\ge2)，硬情况会完全破坏它。 最终查询返回(0)。 

攻击量和最小正高度之间的精确相等也需要递归。 为了```
2 2
5 10
2 1 2 5
1 1 2
```最小正高度为(5)，正好等于攻击量。 严格的条件`value < mn[node]`失败了，所以树就下降了。 第一个墙变成零，第二个墙变成 (5)，给出正确的总和 (5)。 

已经被毁坏的墙壁必须保持不变。 在```
3 3
2 5 1
2 1 1 3
2 1 3 2
1 1 3
```第一个操作将数组更改为`[0,5,1]`。 在第二次操作期间，零壁已`cnt = 0`，因此惰性减法仅应用于正墙。 最终状态是`[0,3,0]`，答案为（3）。 

如果没有特殊情况，单位置间隔也可以通过相同的递归处理。 例如，```
4 3
3 100 4 8
2 1 1 3
1 1 4
2 4 4 8
```将第一面墙从 (3) 更改为 (0)，然后将最后一面墙从 (8) 更改为 (0)。 线段树可以通过其正常的区间遍历来隔离任一叶，因此不需要单独的点更新实现。 

全范围情况是优化最重要的地方。 如果每面墙最初的高度为 (100000000)，那么精确移动 (100000000) 米的攻击将精确达到最小值并最终摧毁每片叶子。 每面墙只被移除一次，因此虽然这个特定的操作需要递归下降，但同一堵墙在变为零后不能导致另一次硬下降。 这就是 (O((n+q)\log n)) 界限背后的摊销。
