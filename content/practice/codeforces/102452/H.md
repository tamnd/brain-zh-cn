---
title: "CF 102452H - 保持通话"
description: "我们有 (N) 个战壕阵列。 一条战壕最初是空的，每条战壕最多只能接收一名士兵一次。 当一名士兵被放置在位置 (x) 时，该位置将永久获得高度 (h)。 查询给出位置间隔 ([L,R]) 和敌人高度 (H)。"
date: "2026-08-10T06:22:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102452
codeforces_index: "H"
codeforces_contest_name: "2019-2020 ICPC Asia Hong Kong Regional Contest"
rating: 0
weight: 102452
solve_time_s: 388
verified: true
draft: false
---

[CF 102452H - 坚守阵线](https://codeforces.com/problemset/problem/102452/H)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (N) 个战壕阵列。 一条战壕最初是空的，每条战壕最多只能接收一名士兵一次。 当一名士兵被放置在位置 (x) 时，该位置将永久获得高度 (h)。 

查询给出位置间隔 ([L,R]) 和敌人高度 (H)。 在该区间当前存在的所有士兵中，我们需要 (|h-H|) 的最小值。 如果该区间不包含当前可用的士兵，则答案为（-1）。 

问题中隐藏着两个不同的顺序。 位置决定士兵是否属于请求的区间，而事件索引决定查询发生时该士兵是否已经被放置。 解决方案必须同时考虑这两个条件。 

这些限制使得直接扫描变得不可能。 总共可以有 (5\cdot10^5) 个战壕和 (10^6) 个事件。 在最坏的情况下，在所有(5\cdot10^5)个战壕都接收了士兵之后，大约可以查询(5\cdot10^5)个事件，因此扫描每个查询的间隔可以进行大约(2.5\cdot10^{11})个位置检查。 即使是节点包含平衡有序集的普通线段树也会给出 (O((N+M)\log^2N))，但官方社论特别指出，这种简单的解决方案对于严格的限制来说有太多的恒定开销。 

当前的 Codeforces 问题页面给出了 4.5 秒的时间限制和 512 MB 的内存限制。 这使得渐近复杂度和数据结构的表示都相关。 下面的实现使用紧凑的整数数组来表示大型单调队列，而不是数百万个 Python 对象。 

有几种边界情况很容易处理不当。 首先，可以在插入其范围内的每个士兵之前进行查询。```
1
1 1
1 1 1 5
```答案是```
-1
```还没有士兵。 如果离线算法在不检查其插入时间的情况下插入每个最终士兵，则会错误地返回值。 

第二个问题是，只有在较早的查询之后才能将士兵插入到正确的端点。```
1
2 3
1 1 2 5
0 2 5
1 1 2 5
```输出是```
-1
0
```第一个查询不能看到后面的插入。 第二个查询就可以看到。 

第三种边界情况是单位置区间。 位置测试必须包括两端。```
1
3 5
0 1 100
0 3 1
1 1 1 50
1 2 2 50
1 3 3 50
```输出是```
50
-1
49
```中间的查询仅检查位置 2，该位置为空。 在这种情况下，意外处理 ([L,R)) 而不是 ([L,R]) 的范围实现可能会默默地失败。 

最后，必须正常处理等高。 如果几个士兵的身高为 7，而敌人的身高为 7，则答案恰好为 0，而不是到其他不同高度的距离。 

## 方法

 强力解决方案保持每个沟槽的当前高度。 对于查询 ([L,R,H])，它扫描从 (L) 到 (R) 的每个位置，忽略空位置，并保留与 (H) 的最小绝对差。 这是正确的，因为每个合格的士兵都经过检查，并且所有士兵中的最小值正是所需的答案。 

问题是扫描次数。 覆盖整个数组的查询成本为 (O(N))，并且可以有 (O(M)) 个这样的查询。 在给定的聚合限制下，这大约达到 (2.5\cdot10^{11}) 位置检查，远远超出了时间限制允许的范围。 

一个自然的改进是基于位置的线段树，每个节点都有一组有序的高度。 范围查询将([L,R])分解为(O(\log N))个节点，每个节点都可以在(O(\log N))中找到(H)的前驱和后继。 这给出了 (O((N+M)\log^2N))，但是在每个段节点中维护一个单独的平衡树在内存和常数因子方面都是昂贵的。 官方社论描述了这种简单的方法，然后用离线结构代替。 

关键的观察结果是查询可以按照其右端点 (R) 的升序进行处理。 假设我们当前正在处理右端点为 (R) 的所有查询。 我们可以将最多位置（R）的每个士兵插入到数据结构中。 这完全从查询中删除了右边界。 

位置 (j) 的士兵的剩余有效条件为

 [
 j\ge L
 ]

 和

 [
 v_j < 我，
 ]

 其中 (v_j) 是插入士兵的事件索引，(i) 是当前查询的事件索引。 第一个条件是位置条件，第二个条件是时间条件。 

现在根据高度值而不是位置构建线段树。 节点表示高度区间并存储属于该高度区间的插入事件。 

一个节点内部有一个有用的支配规则。 由于外部扫描过程 (R=1,2,\ldots,N)，所以位置按递增顺序插入。 假设两个存储的士兵有位置（j<k），但它们的插入时间满足（v_j>v_k）。 士兵（j）从来没有用处。 每当士兵 (j) 年龄足够大时，士兵 (k) 也可以使用，并且 (k) 位于更右侧。 因此，对于每个下限条件 (j\ge L)，士兵 (k) 至少与 (j) 一样好。 

因此，我们可以从每个节点队列的后面删除这些受支配的元素。 幸存事件指数从前到后递增，位置也从前到后递增。 这就是官方社论描述的单调队列。 

这种单调性使得有效性测试出奇地小。 给定一个具有事件索引 (i) 和左端点 (L) 的查询，对节点队列进行二分搜索以查找至少第一个事件索引 (i)。 前一个元素是严格小于 (i) 的最大插入事件。 由于事件索引和位置一起增加，因此该元素在查询之前插入的所有士兵中也具有最大的位置。 如果其位置至少为 (L)，则该节点包含有效士兵。 如果其位置小于(L)，则没有更早的元素可以满足位置条件。 

一旦可以通过这种方式测试节点，高度搜索就变成普通的线段树导航。 我们最多搜索最大有效高度 (H)，并至少独立搜索最小有效高度 (H)。 这两个候选值就足够了，因为 (H) 以下的每个值都比它下面的最大值更远，而 (H) 以上的每个值都比它上面的最小值更远。

最终的复杂度为 (O(N\log N+M\log^2N))，与官方方法相符。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(NM)) | (O(N)) | 太慢了 |
 | 具有有序集的线段树 | (O((N+M)\log^2N)) | (O(N\log N)) | 开销太大 |
 | 具有单调队列的离线线段树| (O(N\log N+M\log^2N)) | (O(N\log N+M)) | 已接受 |

 ## 算法演练

 1. 阅读所有事件并记住每个插入战壕的士兵的位置。 对于每个查询，记住其左端点、敌人高度、事件索引和右端点。 我们按 (R) 对查询进行分组，因为离线扫描将从左到右处理位置。 
2.压缩所有士兵的身高。 只有士兵高度需要是线段树的叶子。 对于查询高度 (H)，`bisect_left`和`bisect_right`找到两侧最接近的压缩高度范围。 
3. 在压缩的士兵高度上构建线段树。 身高等级为 (p) 的士兵属于 (p) 的叶子以及该叶子的每个祖先。 因此，每个节点代表身高位于该节点值区间内的所有士兵。 
4. 在处理扫描之前，计算每个线段树节点可能需要多少个士兵条目。 每个士兵都为其根到叶路径上的每个节点贡献一个潜在条目。 该实现使用此计数来分配一个紧凑的全局整数数组，避免为每个节点使用单独的 Python 列表。 
5. 从 (1) 到 (N) 清扫沟槽位置。 当到达位置 (R) 时，将士兵插入到 (R)（如果存在）。 它的事件索引被附加到其高度路径上的每个线段树节点。 
6. 将事件索引 (i) 附加到节点时，从后面删除事件索引大于 (i) 的条目。 当前位置大于先前插入到该节点的每个位置，因此删除的条目具有较早的位置但插入时间较晚。 它永远不可能成为未来有效性检查的最佳见证。 
7. 处理右端点为当前 (R) 的所有查询。 对于每个查询，搜索高度线段树两次。 第一个搜索最多找到最大高度 (H)，其节点包含有效士兵。 第二个找到节点包含有效士兵的最小高度至少 (H)。 
8. 对于高度搜索访问的每个节点，测试其是否包含位置至少为（L）且插入事件索引小于当前查询索引的士兵。 二分查找给出小于查询的最后一个事件索引。 因为队列的位置随着其事件索引的增加而增加，所以检查单个士兵就足够了。 
9. 将两个候选高度转换为 (H) 的绝对差。 如果两边都不存在，则返回 (-1)。 否则返回较小的差值。 精确的高度会产生 0 差异，自然会胜过所有其他候选人。 

### 为什么它有效

 考虑任何线段树节点及其幸存队列。 其事件指数在严格增加，持仓量也在严格增加。 对于事件 (i) 处的查询，事件索引至少为 (i) 的每个队列条目都太晚了。 在事件索引小于(i)的条目中，最后一个具有最大位置。 因此，当最后一个较早事件至少具有位置 (L) 时，该节点恰好包含有效士兵。 

移除规则永远不会删除潜在有用的士兵。 如果前面位置的士兵比后面位置的士兵有更晚的插入时间，则后面位置的士兵不会更晚变得可用，并且满足前面的士兵可以满足的每个左界条件。 被移除的士兵因此被支配。 

外部扫描已经最多插入​​了每个位置（R），因此节点考虑的每个士兵都位于右端点的正确一侧。 事件索引测试删除当前查询之后发生的士兵。 总之，这两个条件使得 ([L,R]) 中的士兵在查询时已经存在。 

最后，在有效高度中，最接近（H）的高度必须是不超过（H）的最大高度或不小于（H）的最小高度。 两个线段树搜索精确地找到了那些候选者，因此它们距离的最小值就是所需的答案。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right
from array import array

def solve():
    input = sys.stdin.readline
    T = int(input())
    output = []

    for _ in range(T):
        N, M = map(int, input().split())

        # For every position, store its unique insertion event and height.
        update_id_at_pos = array('i', [0]) * (N + 1)
        update_height_at_pos = array('i', [0]) * (N + 1)

        # Queries are linked by their right endpoint.
        query_head = array('i', [-1]) * (N + 1)
        query_next = array('i', [-1]) * (M + 1)
        query_left = array('i', [0]) * (M + 1)
        query_height = array('i', [0]) * (M + 1)
        is_query = bytearray(M + 1)

        # Position of every update event, indexed by event id.
        update_pos = array('i', [0]) * (M + 1)

        update_heights = []

        for event_id in range(1, M + 1):
            parts = input().split()
            typ = int(parts[0])

            if typ == 0:
                x = int(parts[1])
                h = int(parts[2])

                update_id_at_pos[x] = event_id
                update_height_at_pos[x] = h
                update_pos[event_id] = x
                update_heights.append(h)
            else:
                L = int(parts[1])
                R = int(parts[2])
                H = int(parts[3])

                is_query[event_id] = 1
                query_left[event_id] = L
                query_height[event_id] = H

                query_next[event_id] = query_head[R]
                query_head[R] = event_id

        answer = array('i', [-1]) * (M + 1)

        if not update_heights:
            for event_id in range(1, M + 1):
                if is_query[event_id]:
                    output.append("-1\n")
            continue

        # Coordinate compression only needs actual soldier heights.
        values = sorted(set(update_heights))
        K = len(values)

        # Rank of the soldier height at every position.
        rank_at_pos = array('i', [0]) * (N + 1)

        # Use an iterative segment tree with K leaves.
        S = 1
        while S < K:
            S <<= 1

        node_count = 2 * S

        # cnt[node] is the maximum number of queue entries needed by
        # that node. Every update contributes once to every ancestor.
        cnt = array('i', [0]) * node_count

        for x in range(1, N + 1):
            event_id = update_id_at_pos[x]
            if event_id:
                rank = bisect_left(values, update_height_at_pos[x]) + 1
                rank_at_pos[x] = rank

                node = S + rank - 1
                while node:
                    cnt[node] += 1
                    node >>= 1

        # Give every node a fixed slice of one global queue array.
        base = array('i', [0]) * node_count
        tail = array('i', [0]) * node_count

        total = 0
        for node in range(1, node_count):
            base[node] = total
            tail[node] = total
            total += cnt[node]

        # Each entry is an event id, so 32 bits are enough.
        queue = array('i', [0]) * total

        def check(node, qid, left):
            """Does this node contain a valid soldier?"""
            b = base[node]
            t = tail[node]

            if b == t:
                return False

            # queue[b:t] contains strictly increasing event ids.
            p = bisect_left(queue, qid, b, t)

            if p == b:
                return False

            candidate = queue[p - 1]
            return update_pos[candidate] >= left

        def find_left(rank, qid, left):
            """Largest valid height rank <= rank, or 0."""
            if rank <= 0:
                return 0

            node = S + rank - 1

            if check(node, qid, left):
                return rank

            while node > 1:
                # node is a right child, so its left sibling is
                # completely inside the prefix we are searching.
                if node & 1:
                    sibling = node - 1

                    if check(sibling, qid, left):
                        node = sibling

                        # Find the rightmost valid leaf in this subtree.
                        while node < S:
                            right = node * 2 + 1
                            if check(right, qid, left):
                                node = right
                            else:
                                node *= 2

                        return node - S + 1

                node >>= 1

            return 0

        def find_right(rank, qid, left):
            """Smallest valid height rank >= rank, or 0."""
            if rank > K:
                return 0

            node = S + rank - 1

            if check(node, qid, left):
                return rank

            while node > 1:
                # node is a left child, so its right sibling is
                # completely inside the suffix we are searching.
                if (node & 1) == 0:
                    sibling = node + 1

                    if check(sibling, qid, left):
                        node = sibling

                        # Find the leftmost valid leaf in this subtree.
                        while node < S:
                            left_child = node * 2
                            if check(left_child, qid, left):
                                node = left_child
                            else:
                                node = left_child + 1

                        return node - S + 1

                node >>= 1

            return 0

        # Sweep the right endpoint.
        for R in range(1, N + 1):
            event_id = update_id_at_pos[R]

            if event_id:
                rank = rank_at_pos[R]
                node = S + rank - 1

                # Add the event to every node on the root-to-leaf path.
                # The queue is monotone in event id.
                while node:
                    t = tail[node]
                    b = base[node]

                    while t > b and queue[t - 1] > event_id:
                        t -= 1

                    queue[t] = event_id
                    tail[node] = t + 1
                    node >>= 1

            # All these queries have exactly this R as their right endpoint.
            qid = query_head[R]

            while qid != -1:
                L = query_left[qid]
                H = query_height[qid]

                # Greatest compressed value <= H.
                right_rank = bisect_right(values, H)

                # Smallest compressed value >= H.
                left_rank = bisect_left(values, H) + 1

                best = -1

                if right_rank:
                    rank = find_left(right_rank, qid, L)
                    if rank:
                        best = H - values[rank - 1]

                if left_rank <= K:
                    rank = find_right(left_rank, qid, L)
                    if rank:
                        diff = values[rank - 1] - H
                        if best == -1 or diff < best:
                            best = diff

                answer[qid] = best
                qid = query_next[qid]

        # Restore the original event order.
        for event_id in range(1, M + 1):
            if is_query[event_id]:
                output.append(str(answer[event_id]) + "\n")

    sys.stdout.write("".join(output))

if __name__ == "__main__":
    solve()
```实现的第一部分按位置存储更新并按右端点存储查询。 查询的链表表示避免了为每个事件创建一个 Python 元组，这在 (M) 达到 (10^6) 时很重要。 

身高压缩仅针对士兵实际身高进行。 查询高度不需要自己的线段树叶子。`bisect_right(values, H)`给出可以成为前任的最后一个士兵身高等级，而`bisect_left(values, H) + 1`给出第一个可能的继任者排名。 

线段树使用二的幂叶基`S`。 从 1 到 (K) 的压缩等级映射到叶子`S + rank - 1`。 当 (K) 不是 2 的幂时，树包含空叶子，但搜索函数永远不会返回这些叶子，因为`check`那里是假的。 

Python 中的队列存储值得特别关注。 每个线段树节点的普通列表可能会消耗数百兆字节，因为队列条目的数量为 (O(N\log N))。 相反，代码首先计算每个节点所需的最大容量，为每个节点分配一个连续的切片`array('i')`，并将事件索引存储在该全局缓冲区中。 总的队列存储仍然是(O(N\log N))，但是每个事件索引占用四个字节。 

当插入士兵时，代码会在附加新事件之前从尾部弹出更大的事件索引。 该位置已经在增加，因为外循环按递增顺序访问位置。 这正是单调队列背后的支配规则。 

这`check`功能用途`bisect_left`在节点的事件 ID 间隔上。 如果紧接在查询之前的插入事件至少位于(L)位置，则该节点有效。 如果不是，则任何较早的事件都无法工作，因为队列位置会随着事件 ID 的增加而增加。 

前驱和后继搜索使用从相关叶到根的路径。 每当当前路径来自右子节点时，其左兄弟节点都是前趋搜索的完全探索的候选子树。 后继搜索是对称的。 找到可行的同级后，代码分别下降到最右边或最左边的可行叶子。 

事件顺序也很微妙。 在处理右端点为 (R) 的查询之前插入位置 (R) 处的更新，即使该更新按事件顺序稍后发生。 这是故意的。 只要事件 id 不小于查询 id，单调队列的事件 id 测试就会拒绝它。 因此，扫描处理位置条件，而队列处理时间条件。 

所有高度和差值都适合有符号 32 位整数，因为高度最多为 (10^9)。 事件索引也适合有符号的 32 位整数。 Python 本身具有任意精度的整数，但紧凑数组故意使用 32 位存储。 

## 工作示例

 官方示例有一个测试用例。 事件顺序为：```
1
3 5
1 1 3 2
0 1 1
0 3 3
1 1 2 2
1 2 3 2
```第一个查询发生在插入任一士兵之前。 后面的离线扫描最终确实插入了两个士兵，但是他们的事件索引大于第一个查询的事件索引，所以两个都不能通过`check`。 

| 活动 | 行动| 当前R | 插入士兵| 查询候选人身高| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 查询 ([1,3],H=2) | 3 | 没有一个在时间上有效 | 无 | -1 |
 | 2 | 插入位置 1，高度 1 | 1 | (1\mapsto1) | (1\mapsto1) | | |
 | 3 | 插入位置 3，高度 3 | 3 | (1\mapsto1,\3\mapsto3) | (1\mapsto1,\3\mapsto3) | | |
 | 4 | 查询 ([1,2],H=2) | 2 | 位置 1 有效 | 1 | 1 |
 | 5 | 查询 ([2,3],H=2) | 3 | 位置 3 有效 | 3 | 1 |

 输出是```
-1
1
1
```有趣的部分是，在插入两个位置后，在 (R=3) 扫描期间处理第一个查询。 事件 ID 条件仍然拒绝两名士兵。 这是离线变换的中心不变量。 

对于第二个示例，请考虑：```
1
5 8
1 1 5 10
0 2 7
0 5 13
1 2 5 10
0 1 10
1 1 2 10
1 3 4 10
0 4 9
```输出是：```
-1
3
0
-1
```第一个查询发生在任何插入之前。 在第四个事件中，已插入位置 2 和 5，高度分别为 7 和 13。对于敌人高度 10，两者距离均为 3。数据结构可以选择其中之一，因为只要求差值。 

在事件 6 中，位置 1 的高度为 10 并且较早插入，因此精确匹配产生 0。在事件 7 中，请求的间隔为 ([3,4])，但位置 4 尚未插入，而位置 3 为空，因此答案为 (-1)。 

| 活动 | 行动| 当前R | 查询范围内的有效士兵| 最近的高度 | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 查询 ([1,5],H=10) | 5 | 事件 1 之前没有 | 无 | -1 |
 | 2 | 插入位置 2，高度 7 | 2 | | | |
 | 3 | 插入位置 5，高度 13 | 5 | | | |
 | 4 | 查询 ([2,5],H=10) | 5 | (2\mapsto7,\5\mapsto13) | 7 或 13 | 3 |
 | 5 | 插入位置 1，高度 10 | 1 | | | |
 | 6 | 查询 ([1,2],H=10) | 2 | (1\mapsto10,\2\mapsto7) | (1\mapsto10,\2\mapsto7) | 10 | 10 0 |
 | 7 | 查询 ([3,4],H=10) | 4 | 无有效 | 无 | -1 |
 | 8 | 插入位置 4，高度 9 | 4 | | | |

 该示例练习了高度搜索的边界以及位置顺序和事件顺序之间的区别。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N\log N+M\log^2N)) | 每次更新都会触及 (O(\log N)) 树节点。 每个查询执行两次高度搜索，每次访问 (O(\log N)) 个节点，并在每个节点队列内进行二分搜索。 |
 | 空间| (O(N\log N+M+N)) | 单调队列每个树级别的每次更新最多包含一个潜在槽，而事件和查询元数据使用 (O(M+N)) 空间。 |

 聚合约束 (\sum N\le5\cdot10^5) 将总队列容量保持在 (O(5\cdot10^5\log5\cdot10^5)) 之内，大约一千万个整数槽。 该实现将这些槽存储为四字节整数，这比 Python 整数对象列表更适合 Python。 官方社论给出了与单调队列方法相同的 (O(n\log n+m\log^2n)) 界限。 

(M\le10^6) 界限还解释了为什么代码避免使用对象较多的事件元组并通过紧凑数组和链表处理查询。 该算法是围绕每个战壕最多接收一名士兵这一事实而设计的，因此即使可能有更多的查询，最多也有 (N) 个更新。 

## 测试用例

 以下线束假设上述解决方案保存在同一个文件中，并且其入口点是`solve()`功能。 它取代了标准输入和输出，因此断言会执行实际的实现，而不是单独的参考算法。```python
# helper: run the solution on one input string
import sys
import io

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

# Official sample
assert run(
    """1
3 5
1 1 3 2
0 1 1
0 3 3
1 1 2 2
1 2 3 2
"""
) == "-1\n1\n1\n", "official sample"

# Minimum-size case
assert run(
    """1
1 3
1 1 1 7
0 1 7
1 1 1 7
"""
) == "-1\n0\n", "minimum size and future update"

# Boundary and singleton intervals
assert run(
    """1
3 5
0 1 100
0 3 1
1 1 1 50
1 2 2 50
1 3 3 50
"""
) == "50\n-1\n49\n", "singleton ranges"

# Equal heights and exact matches
assert run(
    """1
4 6
0 1 7
0 2 7
0 3 7
1 1 3 9
1 2 2 7
1 4 4 7
"""
) == "2\n0\n-1\n", "equal values"

# Queries before and after insertions, including a later right endpoint
assert run(
    """1
5 8
1 1 5 10
0 2 7
0 5 13
1 2 5 10
0 1 10
1 1 2 10
1 3 4 10
0 4 9
"""
) == "-1\n3\n0\n-1\n", "time and position boundaries"

# Maximum M stress shape: N = 1, M = 1,000,000.
# Only the first event inserts the soldier; every later query must answer 0.
M = 1_000_000
lines = ["1", f"1 {M}", "0 1 123456789"]
lines.extend("1 1 1 123456789" for _ in range(M - 1))
max_m_input = "\n".join(lines) + "\n"

expected = "0\n" * (M - 1)
assert run(max_m_input) == expected, "maximum M"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 官方样品|`-1, 1, 1`| 未来插入和普通前驱/后继搜索 |
 | (N=1) 最小情况 |`-1, 0`| 空查询后跟精确匹配 |
 | 单例间隔 |`50, -1, 49`| 包含 (L,R) 边界和空位置 |
 | 等高|`2, 0, -1`| 重复高度和精确匹配 |
 | 时间和位置的界限|`-1, 3, 0, -1`| 事件顺序与位置顺序 |
 | (M=10^6), (N=1) | (M=10^6), (N=1) | (999999) 零 | 最大事件计数和重复查询 |

 ## 边缘情况

 ### 在任何插入之前查询

 对于```
1
1 1
1 1 1 5
```查询的是事件1。没有士兵，所以答案是(-1)。 高度树为空，当没有更新时，实现直接输出（-1）。 

### 未来插入

 对于```
1
2 3
1 1 2 5
0 2 5
1 1 2 5
```扫描到达（R=2）并在处理事件 3 的查询之前插入事件 2 的士兵。对于事件 1，同一士兵也物理存在于离线结构中，但其事件索引为 2，未通过严格测试`candidate < qid`。 因此事件 1 返回 (-1)。 事件 3 看到士兵并返回 0。 

### 单例间隔

 对于```
1
3 5
0 1 100
0 3 1
1 1 1 50
1 2 2 50
1 3 3 50
```第一个查询仅看到位置 1 并返回 (|100-50|=50)。 第二个只看到位置 2，该位置为空，因此返回 (-1)。 第三个只看到位置 3 并返回 (|1-50|=49)。 扫描使用条件`update_pos[candidate] >= L`，而 (R) 已经由外循环固定，因此两个端点仍然包含在内。 

### 重复高度

 对于```
1
4 6
0 1 7
0 2 7
0 3 7
1 1 3 9
1 2 2 7
1 4 4 7
```第一个查询找到高度 7 并返回 2。第二个查询在位置 2 找到精确的高度 7 并返回 0。第三个查询仅包含空位置 4 并返回 (-1)。 压缩用途`sorted(set(update_heights))`，因此重复的高度成为一个值叶，而节点队列仍然包含具有该高度的所有插入事件。 

### 支配队列条目

 考虑同一价值段中的两个士兵，较早的位置稍后插入：```
1
2 3
0 1 10
0 2 10
1 1 2 10
```这里事件顺序恰好是增加的，因此两个条目都保留下来。 要查看优势规则，相关情况是当较小的仓位具有较大的事件索引时：```
1
2 3
1 1 2 10
0 2 10
0 1 10
```第一个查询使用事件索引 1 进行处理，因此后面的插入均无效。 在最后的询问中，两名士兵均有效。 当在（R=2）扫描过程中先插入位置2的士兵，并且只有当扫描到达位置1时才插入位置1的士兵时，队列构建遵循位置顺序而不是事件顺序。 如果后位置的士兵有较小的事件索引，它会从尾部删除较大的事件索引。 被移除的士兵占主导地位，因为新士兵既可以在更早的位置出现，也可以在更右边的位置出现。 

### 被其他高度包围的精确匹配

 假设有效高度为 3 和 9，敌人高度为 6。双方都不准确，因此需要前驱和后继：```
1
3 4
0 1 3
0 3 9
1 1 3 6
1 1 3 6
```两个候选者的距离均为 3。算法通过前驱搜索找到排名 3，通过后继搜索找到排名 9，然后取最小值。 它并不假设一侧总是足够的。 

所有这些情况中重要的不变量是节点的队列恰好包含该高度间隔的非支配插入事件。 其事件指数和持仓量同步增长。 一旦该不变量成立，单个二分搜索即可识别最新的有效事件，并且该事件也具有最远的有效位置。 然后，线段树将整个最近高度查询减少为两个单调搜索。
