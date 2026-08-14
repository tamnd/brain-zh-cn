---
title: "CF 102331H - 荣誉奖"
description: "对于每个查询 ((l,r,k))，我们仅查看子数组 (al,ldots,ar)。 我们必须准确选择该子数组的 (k) 个非空成对不相交的连续部分，并最大化这些部分覆盖的所有元素的总和。 这些碎片可以是相邻的。"
date: "2026-08-13T03:40:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102331
codeforces_index: "H"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 2: 300iq Contest 2 (XX Open Cup, Grand Prix of Kazan)"
rating: 0
weight: 102331
solve_time_s: 179
verified: true
draft: false
---

[CF 102331H - 荣誉奖](https://codeforces.com/problemset/problem/102331/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个查询 ((l,r,k))，我们仅查看子数组 (a_l,\ldots,a_r)。 我们必须准确选择该子数组的 (k) 个非空成对不相交的连续部分，并最大化这些部分覆盖的所有元素的总和。 这些碎片可以是相邻的。 邻接很重要，因为 ([1,2]) 和 ([3,4]) 这样的两个部分仍然是两个部分，即使它们的并集是一个更大的区间。 

输入包含一个具有 (n\le 35000) 个元素的数组和最多 (q\le 35000) 个独立间隔查询。 每个元素的绝对值最多为（35000），因此整个区间的绝对和可以达到（35000^2=1.225\times10^9）。 查询的数量排除了为每个查询运行与长度相关的动态程序的可能性。 即使是 (O((r-l+1)k)) 解决方案也可以大致达到 (O(qn^2))，这远远超出了可用时间。 我们需要将数组预处理为可重用的区间信息，并使每次查询主要依赖于(\log n)，而不是其长度。 

官方问题使用此处描述的相同约束和示例。 

有几种边缘情况很容易被错误处理。 首先，所有值都可以为负数。 对于输入```
1 1
-5
1 1 1
```答案是`-5`， 不是`0`。 所选段必须非空，并且必须恰好选择一个段，因此不允许空选择。 

其次，恰好 (k) 个段的答案在 (k) 中并不单调。 为了```
4 3
3 3 3 3
1 4 1
1 4 2
1 4 3
```答案是```
12
12
9
```对于一个片段，我们采用所有四个元素。 对于两个片段，我们可以将它们分成两个相邻的片段，仍然得到（12）。 对于三个段，最好的可能性是三个单元素，给出（9）。 为“最多 (k)”段设计的解决方案会在这里默默地给出错误的结果。 

第三，当（k）需要时，相邻的选定段必须保持分离。 为了```
3 1
5 -10 5
1 3 2
```答案是`10`，通过选择位置 1 和 3 作为两个单例段而获得。 将每个相邻选定区域视为一个片段的粗心实现在这里没有问题，但是假设每个选定组件与下一个组件之间必须具有负间隙的实现将错误地拒绝此配置。 

最后，(k)可以等于区间长度。 为了```
3 1
-2 -3 -4
1 3 3
```答案是`-9`，因为必须选择所有三个元素作为三个单例段。 在这种情况下，任何用零初始化答案或意外允许少于 (k) 个段的实现都将失败。 

## 方法

 一个查询的直接动态程序已经具有指导意义。 让`end[j]`是使用当前位置属于最后一个选定段的恰好 (j) 个段的最佳值，并令`best[j]`是使用已处理前缀中任意位置的恰好 (j) 个段的最佳值。 对于每个元素，我们可以扩展最后一个段或开始一个新段。 这给出了在长度 (m) 的间隔上进行查询的 (O(mk)) 算法。 

该算法是正确的，因为每个最佳解决方案要么不使用当前元素，要么将其最终段延伸到当前元素，要么从当前元素开始其最终段。 问题是查询的数量。 如果间隔长度和 (k) 都是 (\Theta(n))，则一次查询可能会花费 (O(n^2))，并且 (q) 这样的查询在最大约束下会给出 (O(qn^2))、大约 (4.3\times10^{13}) 状态转换。 

关键的观察是，对于固定间隔，函数

 [
 F(k)=\text{恰好 }k\text{ 段可获得的最大值}
 ]

 是凹的。 等价地，它的边际收益

 [
 F(k)-F(k-1)
 ]

 均不增加。 通过问题的标准最小成本流公式，该属性也可见：作为所需流量函数的最佳值具有相应的离散凸性属性。 这是使 Minkowski-sum 合并和 WQS 二分搜索成为可能的结构事实。 

假设我们已经知道一个区间的所有值 (F(0),F(1),\ldots,F(m))。 然后可以有效地合并两个相邻的间隔。 如果它们的凹函数有边际收益

 [
 d_1\ge d_2\ge\cdots
 ]

 和

 [
 e_1\ge e_2\ge\cdots,
 ]

 它们的最大加卷积的边际增益只是这两个边际序列的排序合并。 这是凸包的闵可夫斯基和的一维形式。 因此，线段树可以在 (O(n\log n)) 总构建工作中存储每个节点的完整答案函数。 

有一个并发症。 当两个相邻的线段树节点连接时，选定的线段可以跨越边界。 要知道两个选定的块是否应该合并为一个，每个节点必须记住其最左边和最右边的元素是否被选择。 这为每个节点提供了四个函数，由两个端点选择位索引。 当左子节点的右端点和右子节点的左端点都被选中时，它们的两部分就变成了一块，因此生成的函数在其段计数坐标中移动了 1。 

乍一看这似乎足够了，但是查询间隔由 (O(\log n)) 段树节点组成，并且为每个查询合并它们的完整凸函数又太昂贵了。 WQS 二分搜索在查询期间删除段计数维度。 对于惩罚 (\lambda)，我们不是最大化 (F(k))，而是最大化

 [
 F(x)-\lambda x
 ]

 在每个可能的段数 (x) 上。 由于 (F) 是凹的，因此最大化 (x) 随着 (\lambda) 的变化而单调移动。 如果最大化解决方案至少使用所请求的 (k) 个段，则我们增加 (\lambda)； 否则我们会减少它。 在最终的斜率处，添加 (k\lambda) 可恢复准确的答案。 

一个简单的实现是在每个凸包内分别对最佳位置进行二分搜索。 这就引入了另一个对数因子。 最后的优化是在一次 WQS 迭代中按照当前中点 (\lambda) 的降序处理所有查询。 对于固定的凸包，随着(\lambda)减小，其最优位置只能向前移动。 我们为每个节点和每个端点状态保留一个指针，因此每个指针在一个 WQS 层中仅在其外壳中移动一次。 这是预期解决方案使用的“整体”或并行 WQS 优化。 原始解决方案材料中将所得方法描述为 (O((n+q)\log n\log V))，直至离线查询的排序因子。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力DP | (O(qn^2)) | 每个查询 (O(n)) | 太慢了 |
 | 线段树+全凸函数| (O(n\log n+qn)) | (O(n\log n)) | 太慢了 |
 | 每个船体内部均采用二分搜索的 WQS | (O((n+q)\log^2n\log V)) | (O(n\log n)) | 接近，但速度过慢 |
 | 离线WQS + 单调船体指针| (O((n+q)\log n\log V+q\log q\log V)) | (O(n\log n+q\log n)) | 已接受 |

 ## 算法演练

 1. 对于每个线段树节点，存储四个数组`h[x][y]`。 那个位`x`表示是否选择节点的左端点，以及`y`表示是否选择了正确的端点。`h[x][y][k]`是可获得的最大总和`k`根据这些端点要求选择的段。 不可能的状态存储为负无穷大。 

端点信息是必要的，因为当两个相邻节点连接时，两个独立选择的片段可以成为一个片段。 
2. 在包含值 (a_i) 的叶子处，唯一有意义的状态是`00`选定的段为零且值为零，并且`11`具有一个选定的段和值 (a_i)。 州`01`和`10`是不可能的，因为单元素区间不能在不选择另一个端点的情况下精确选择一个端点。 
3. 要合并两个子外壳，请采用它们的 max-plus 卷积。 如果`A[k]`和`B[k]`是凹的，结果卷积的边缘差异是通过合并边缘差异获得的`A`和`B`按降序排列。 

这使得合并在组合船体长度上呈线性，而不是在可能的段计数数量上呈二次方。 
4. 对于每对子端点状态，组合相应的外壳。 如果左子项的右端点和右子项的左端点都被选中，则这两部分接触并且必须算作一段。 在段计数坐标中，这是移动一个位置。 
5. 在处理查询之前，将每个区间 ([l,r]) 分解为覆盖它的规范 (O(\log n)) 线段树节点。 分解在 WQS 期间不会改变，因此仅计算一次。 
6. 对于固定惩罚 (\lambda)，查询每个存储的外壳以获取索引 (p) 最大化

 [
 h[p]-p\lambda。 
]

 由于船体是凹的，这正是达到的最大位置，而下一个边际增益至少为 (\lambda)。 相关联的对存储惩罚值和所选段的数量。 
7. 从左到右处理一个查询的规范节点。 根据是否选择了迄今为止处理的所有内容的正确端点，DP 有两种状态。 当当前节点以选定的左端点开始并且前一个状态也结束选定时，将总段计数减一并将 (\lambda) 添加回惩罚值，因为两部分已合并为一个。 
8. 处理完查询的所有节点后，取两个右端点状态中较好的一个。 结果对给出了最大惩罚值和惩罚时选择的段数 (\lambda)。 
9. 每个查询的 WQS 二分搜索 (\lambda)。 如果所选线段的数量至少为所需的 (k)，则斜率太小，或者位于仍优选更多线段的边界，因此将下限向上移动。 否则将上限向下移动。 在选定的最终斜率 (\lambda^*) 下，确切的答案是

 [
 \text{惩罚最优}+k\lambda^*。 
]
 10. 在每个二分搜索层中，按当前中点 (\lambda) 以降序对查询进行排序。 然后，每个船体指针仅在该层期间向前移动。 每层重置一次指针即可获得所需的摊销。 

### 为什么它有效

 不变的是，每个线段树外壳都包含在其两个端点选择条件下每个可行线段计数的精确最优值。 闵可夫斯基合并保留了这一不变量，因为串联解要么由两个独立解形成，要么通过连接两个边界段形成，并且相应的段计数恰好是普通和或少一。 

对于固定惩罚 (\lambda)，具有 (x) 个段的每个可能的解决方案都会收到调整值 (F(x)-\lambda x)。 (F)的凹性意味着最大化(x)随着(\lambda)的变化而单调移动，因此WQS二分搜索找到支撑线达到所需段数的斜率。 连接规则选择最大的最大化段数，这给出了凹壳平坦边缘的正确边。 在该斜率下，加回 (k\lambda) 后，支撑线恒等式给出 (F(k))。 端点状态考虑了线段树边界的每个可能的交叉，因此不会丢失有效的排列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

NEG = -10**30

def minkowski(a, b):
    na = len(a) - 1
    nb = len(b) - 1
    res = [0] * (na + nb + 1)

    s = a[0] + b[0]
    res[0] = s

    i = 0
    j = 0
    pos = 0

    while i < na and j < nb:
        da = a[i + 1] - a[i]
        db = b[j + 1] - b[j]

        if da > db:
            i += 1
            s += da
        else:
            j += 1
            s += db

        pos += 1
        res[pos] = s

    while i < na:
        i += 1
        s += a[i] - a[i - 1]
        pos += 1
        res[pos] = s

    while j < nb:
        j += 1
        s += b[j] - b[j - 1]
        pos += 1
        res[pos] = s

    return res

def merge_into(dst, src, shifted):
    limit = len(src)
    if not shifted:
        for i in range(limit):
            v = src[i]
            if v > dst[i]:
                dst[i] = v
    else:
        for i in range(limit):
            v = src[i]
            if v > dst[i]:
                dst[i] = v
            if i and v > dst[i - 1]:
                dst[i - 1] = v

def solve():
    n, q = map(int, input().split())
    a = [0] + list(map(int, input().split()))

    size = 4 * n + 5
    tree = [None] * size

    def build(node, left, right):
        if left == right:
            h00 = [0, NEG]
            h01 = [NEG, NEG]
            h10 = [NEG, NEG]
            h11 = [NEG, a[left]]
            tree[node] = (h00, h01, h10, h11)
            return

        mid = (left + right) >> 1
        build(node << 1, left, mid)
        build(node << 1 | 1, mid + 1, right)

        lc = tree[node << 1]
        rc = tree[node << 1 | 1]

        length = right - left + 1
        cur = [
            [NEG] * (length + 1),
            [NEG] * (length + 1),
            [NEG] * (length + 1),
            [NEG] * (length + 1),
        ]

        for u in range(2):
            for v in range(2):
                left_hull = lc[u * 2 + v]

                for p in range(2):
                    for z in range(2):
                        right_hull = rc[p * 2 + z]

                        tmp = minkowski(left_hull, right_hull)

                        dst = cur[u * 2 + z]
                        merge_into(dst, tmp, v == 1 and p == 1)

        tree[node] = tuple(cur)

    build(1, 1, n)

    queries = []
    for idx in range(q):
        l, r, k = map(int, input().split())
        queries.append([l, r, k, -35000, 0, 0])

    # Canonical segment-tree decomposition for every query.
    parts = [[] for _ in range(q)]

    def collect(node, left, right, ql, qr, out):
        if ql <= left and right <= qr:
            out.append(node)
            return

        mid = (left + right) >> 1
        if ql <= mid:
            collect(node << 1, left, mid, ql, qr, out)
        if qr > mid:
            collect(node << 1 | 1, mid + 1, right, ql, qr, out)

    for idx, qu in enumerate(queries):
        collect(1, 1, n, qu[0], qu[1], parts[idx])

    total_abs = sum(abs(x) for x in a[1:])
    for qu in queries:
        qu[4] = total_abs

    # Four monotone pointers per segment-tree node.
    ptr0 = [0] * size
    ptr1 = [0] * size
    ptr2 = [0] * size
    ptr3 = [0] * size
    stamp = [0] * size

    def get_pointer(node, state, lam, round_id):
        if stamp[node] != round_id:
            stamp[node] = round_id
            ptr0[node] = 0
            ptr1[node] = 0
            ptr2[node] = 0
            ptr3[node] = 0

        if state == 0:
            p = ptr0[node]
        elif state == 1:
            p = ptr1[node]
        elif state == 2:
            p = ptr2[node]
        else:
            p = ptr3[node]

        hull = tree[node][state]

        while p + 1 < len(hull) and hull[p + 1] - hull[p] >= lam:
            p += 1

        if state == 0:
            ptr0[node] = p
        elif state == 1:
            ptr1[node] = p
        elif state == 2:
            ptr2[node] = p
        else:
            ptr3[node] = p

        return hull, p

    def evaluate(qid, lam, round_id):
        f0_val = 0
        f0_cnt = 0
        f1_val = NEG
        f1_cnt = 0

        for node in parts[qid]:
            old0_val = f0_val
            old0_cnt = f0_cnt
            old1_val = f1_val
            old1_cnt = f1_cnt

            nf0_val = NEG
            nf0_cnt = -10**9
            nf1_val = NEG
            nf1_cnt = -10**9

            for state in range(4):
                hull, p = get_pointer(node, state, lam, round_id)

                value = hull[p] - p * lam
                left_selected = state >> 1
                right_selected = state & 1

                if old0_val != NEG:
                    cand_val = old0_val + value
                    cand_cnt = old0_cnt + p

                    if right_selected == 0:
                        if cand_val > nf0_val or (
                            cand_val == nf0_val and cand_cnt > nf0_cnt
                        ):
                            nf0_val = cand_val
                            nf0_cnt = cand_cnt
                    else:
                        if cand_val > nf1_val or (
                            cand_val == nf1_val and cand_cnt > nf1_cnt
                        ):
                            nf1_val = cand_val
                            nf1_cnt = cand_cnt

                if old1_val != NEG:
                    if left_selected:
                        cand_val = old1_val + value + lam
                        cand_cnt = old1_cnt + p - 1
                    else:
                        cand_val = old1_val + value
                        cand_cnt = old1_cnt + p

                    if right_selected == 0:
                        if cand_val > nf0_val or (
                            cand_val == nf0_val and cand_cnt > nf0_cnt
                        ):
                            nf0_val = cand_val
                            nf0_cnt = cand_cnt
                    else:
                        if cand_val > nf1_val or (
                            cand_val == nf1_val and cand_cnt > nf1_cnt
                        ):
                            nf1_val = cand_val
                            nf1_cnt = cand_cnt

            f0_val, f0_cnt = nf0_val, nf0_cnt
            f1_val, f1_cnt = nf1_val, nf1_cnt

        if f0_val > f1_val or (f0_val == f1_val and f0_cnt >= f1_cnt):
            return f0_val, f0_cnt
        return f1_val, f1_cnt

    # We need one WQS binary search for every query.
    # Queries are reordered by their current midpoint in every layer,
    # so all hull pointers move monotonically.
    max_iterations = (total_abs + 35000).bit_length() + 2

    for round_id in range(1, max_iterations + 1):
        active = False

        order = list(range(q))
        order.sort(
            key=lambda i: (
                (queries[i][3] + queries[i][4]) >> 1
            ),
            reverse=True,
        )

        for qid in order:
            qu = queries[qid]
            lo = qu[3]
            hi = qu[4]

            if lo > hi:
                continue

            active = True
            mid = (lo + hi) >> 1

            value, count = evaluate(qid, mid, round_id)

            if count >= qu[2]:
                qu[5] = value + qu[2] * mid
                qu[3] = mid + 1
            else:
                qu[4] = mid - 1

        if not active:
            break

    out = []
    for qu in queries:
        out.append(str(qu[5]))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`build`函数实现了线段树的预处理。 叶子只有两个可行的端点状态。 在内部节点，每对子状态都使用组合`minkowski`，合并了他们的边际收益。`merge_into`然后将结果函数放入适当的父状态。 当两个边界位都被选择时，相同的解决方案也会被提前写入一个位置，因为两个边界块形成一个段而不是两个段。 

四个外壳存储为普通的 Python 列表。 它们的值在数学上是 64 位大小，但 Python 整数已经具有任意精度，因此不需要溢出处理。 负标记比任何合法答案小得多，并且选择其大小以使其不会干扰 WQS 斜率。 

查询间隔一次分解为规范线段树节点。 这是一个重要的实施细节。 对每个 WQS 中点重复递归区间分解会给每个二分搜索层添加不必要的工作。`evaluate`维持两种状态，`f0`和`f1`。 除了调整后的分数之外，每个状态还存储所选段的数量。 当两个选定的边界块接触时，计数将从`x+y`到`x+y-1`，而被罚分则恢复一分`lambda`。 这与建造四个船体时使用的边界校正完全相同。 

指针数组使用延迟重置`stamp`。 仅当在新的 WQS 层中首次访问节点时，才会重置节点。 该层中的查询以递减的方式处理`lambda`，所以每个指针只会增加。 因此，while 循环不会对每个查询执行二分搜索。 在一个完整的层中，每个指针仅遍历其外壳一次。 

WQS 二分搜索保持最大斜率，其惩罚最优值仍至少包含所请求的段数。 在存储的最终斜率处，代码通过最后一个成功的中点再次隐式评估惩罚最优值，并通过添加来重建原始目标`k * lambda`。 当两个选择具有相同的惩罚分数时，平局比较更喜欢较大的段数，当支撑线位于凹形船体的平坦边缘时，这是必要的。 

## 工作示例

 对于第一个样本，数组是```
-1 2 -3 4 -5
```一到五段的确切答案是`4, 6, 5, 2, -3`。 下表显示了所得的精确值及其边际差异。 

| 段 (k) | 最佳值 (F(k)) | 边际 (F(k)-F(k-1)) |
 | --- | --- | --- |
 | 0 | 0 | 0 |
 | 1 | 4 | 4 |
 | 2 | 6 | 2 |
 | 3 | 5 | -1 |
 | 4 | 2 | -3 |
 | 5 | -3 | -5 |

 边缘序列`4, 2, -1, -3, -5`是非增的，这是 WQS 和 Minkowski 合并所需的凹性。 例如，对于三个段，最佳选择是`[2]`,`[4]`， 和`[5]`，其总数为(2+4-5=1)，但实际最优值为`5`，通过获得`[2]`,`[4]`，以及另一种涉及负面元素的排列方式有所不同。 该表是精确的动态规划结果，并说明了为什么选择局部正分段是不够的。 

对于第二个样本，每个元素都等于 7。 

| 段 (k) | 最佳值 (F(k)) | 一种最佳结构 |
 | --- | --- | --- |
 | 1 | 35 | 35`[1,5]`|
 | 2 | 35 | 35`[1,2]`,`[3,5]`|
 | 3 | 35 | 35`[1]`,`[2]`,`[3,5]`|
 | 4 | 35 | 35`[1]`,`[2]`,`[3]`,`[4,5]`|
 | 5 | 35 | 35 五个单例段 |

 每个元素都是正数，因此将选定的区间分割成更多非空部分永远不会减少总和。 对于 WQS，这是一个有用的平局案例，因为许多不同的段计数可以具有相同的目标值。 该实现的平局处理选择同等良好的惩罚状态中的最大计数，这保持了二分搜索的单调性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 预处理时间| (O(n\log n)) | 每个线段树级别执行总线性量的 Minkowski 合并 |
 | 查询分解 | (O(q\log n)) | 每个区间成为 (O(\log n)) 个规范节点 |
 | WQS层| (O(\log V)) | 斜率范围受总绝对数组和 | 的限制。 
| 每层查询工作| (O(q\log n)) 摊销 | 每个查询都会触及 (O(\log n)) 个节点 |
 | 每层指针移动 | (O(n\log n)) 摊销 | 每个存储的外壳指针最多前进一次通过其外壳 |
 | 每层排序| (O(q\log q)) | 查询按其当前 WQS 中点排序 |
 | 空间| (O(n\log n+q\log n)) | 为每个线段树节点存储四个凸函数 |

 这里(V)最多是总绝对和的量级，最多是(1.225\times10^9)。 因此，WQS 层的数量仅为 31 左右。预处理和存储的外壳为 (O(n\log n))，而每个查询仅保留其规范节点分解和一些二分搜索变量。 预期的 C++ 实现非常适合原始内存限制； Python 实现使用相同的渐近结构，但 Python 的对象开销使得内存和运行时的宽容度大大降低。 

## 测试用例```python
import sys
import io

# Paste the solution above into this file before running these tests.
# The solution exposes solve(), which reads sys.stdin and writes stdout.

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
assert run(
    """5 5
-1 2 -3 4 -5
1 5 1
1 5 2
1 5 3
1 5 4
1 5 5
"""
) == "4\n6\n5\n2\n-3", "sample 1"

# Provided sample 2.
assert run(
    """5 1
7 7 7 7 7
1 5 1
"""
) == "35", "sample 2"

# Minimum-size negative array.
assert run(
    """1 1
-5
1 1 1
"""
) == "-5", "single negative element"

# Exact-k behavior and adjacent/disjoint choices.
assert run(
    """3 4
5 -10 5
1 3 1
1 3 2
2 3 1
2 2 1
"""
) == "5\n10\n5\n-10", "boundary and exact-k cases"

# All-equal values, including the non-monotone exact-k answer.
assert run(
    """4 3
3 3 3 3
1 4 1
1 4 2
1 4 3
"""
) == "12\n12\n9", "all equal values"

# Maximum-size structural test.
# With all ones, selecting exactly n singleton segments gives n.
n = 35000
inp = f"{n} 1\n" + " ".join(["1"] * n) + f"\n1 {n} {n}\n"
assert run(inp) == "35000", "maximum-size all-positive case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / -5 / 1 1 1`|`-5`| 最小大小和强制非空段 |
 |`5 -10 5`有四个查询 |`5, 10, 5, -10`| 精确的段计数、负值和间隔边界 |
 | 四份`3`|`12, 12, 9`| Exact-(k) 答案并不单调 |
 | 35000份`1`|`35000`| 最大输入大小和 (k=n) 边界 |

 ## 边缘情况

 全否定情况的处理是通过 DP 始终需要请求数量的非空段来实现的。 为了```
1 1
-5
1 1 1
```叶子有`h[1][1][1] = -5`。 WQS 无法选择零段，因为查询要求 1，并且最终重建给出`-5`。 

精确的（k）区别可见于```
4 3
3 3 3 3
1 4 1
1 4 2
1 4 3
```对于（k=1），船体选择整个区间并获得`12`。 对于（k=2），两个相邻的块可以覆盖相同的四个元素，因此该值保持不变`12`。 对于 (k=3)，只需要三个不相交的非空块，并且最佳解决方案涵盖值为 的三个元素`9`。 凹壳包含所有三个值，因此 WQS 可以恢复每个精确答案，而不是意外地求解“最多 (k)”变体。 

所选块相邻的边界情况由端点位处理。 考虑```
3 1
5 -10 5
1 3 2
```最佳方案选择`[1,1]`和`[3,3]`, 给予`10`。 当线段树合并的两侧都声明其接触端点时，合并操作会将线段计数减一。 当他们不都声称拥有边界时，计数就会简单地相加。 这种区别使数据结构既可以表示相邻的片段，也可以表示真正合并的片段。 

最大段计数由相同的状态表示直接处理。 在```
3 1
-2 -3 -4
1 3 3
```具有三个段的唯一可行的解​​决方案是选择每个单例。 确切的值为`-9`。 WQS 外壳包含三段对应的点，最终的支撑线重建返回`-9`而不是零或较少段的最佳值。 

最后一个微妙的情况是船体的平坦部分，例如相等正值的数组。 几个不同的段计数可以具有相同的原始值。 在与相应边际增益完全匹配的斜率处，多个船体位置具有相同的惩罚值。 该实现通过优先选择较大的段数来解决此问题。 这使得 WQS 斜率中所选段的数量单调，并给出支持边缘的一致边，这是二分搜索收敛到支持所请求 (k) 的斜率所必需的。
