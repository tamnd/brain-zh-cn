---
title: "CF 102452I - 即将到来的小行星"
description: "我们为每个天文台维护一个非递减计数器。 成员在某个时间点加入，最多选择三个不同的天文台，并要求这些天文台总共至少 y 分钟。"
date: "2026-08-10T06:31:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102452
codeforces_index: "I"
codeforces_contest_name: "2019-2020 ICPC Asia Hong Kong Regional Contest"
rating: 0
weight: 102452
solve_time_s: 519
verified: true
draft: false
---

[CF 102452I - 即将到来的小行星](https://codeforces.com/problemset/problem/102452/I)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们为每个天文台维护一个非递减计数器。 成员在某个时间点加入，最多选择三个不同的天文台，并要求总共至少`y`距这些天文台仅几分钟路程。 只有会员加入后收集的视频才会计入该会员的目标。 

当更新添加时`w`分钟到天文台`x`，每个仍然活跃的成员使用`x`得到`w`距离该天文台还有几分钟的路程。 我们必须准确报告本次更新期间首次达到目标总数的会员。 报告的 ID 必须逐渐排序。 

输入是故意在线的。 价值`last`，等于先前类型 2 事件报告的成员数量，用于对当前事件进行异或解码。 第一个查询使用`last = 0`。 1 类事件有其目标，并且每个观测站索引都与`last`，而类型 2 事件同时具有其观测站和增量 XOR 与`last`。 在使用事件的任何值之前，我们必须对其进行解码。 

官方给出的问题是`n,m <= 2 * 10^5`，最多目标和更新值`10^6`，以及 512 MB 内存的 2 秒时间限制。 这立即排除了每次更新后扫描所有成员的算法。 和`2 * 10^5`事件，二次工作将围绕`4 * 10^10`最坏情况下的操作，远远超出了实际情况。 

还有一个有用的结构限制：每个成员最多使用三个天文台。 这个常数界限是更快解决方案的关键。 每当某个成员的警报响起时，我们就有能力检查属于该成员的所有天文台，因为最多有三个。 

一些边缘情况很容易被错误处理。 首先，会员加入之前收集的视频不得计算在内。 考虑：```
1 3
2 1 5
1 3 1 1
2 1 3
```第一次更新使观测站 1 包含 5 分钟，但还没有成员，所以答案是`0`。 然后该成员加入目标 3。之前的 5 分钟不计算在内。 最终更新增加了 3 分钟，因此正确的输出是：```
0
0
1 1
```如果解决方案只是将每个成员的目标与全球观察站总数进行比较，那么该解决方案会在成员加入后立即错误地完成该目标。 

其次，一个完整的成员必须永久消失。 例如：```
1 3
1 2 1 1
2 1 2
2 0 0
```成员加入后的第一次更新恰好为 2 分钟，因此第一个查询打印`1 1`。 自从`last = 1`，最终的加密更新`2 0 0`其实就是天文台的意思`1`, 增量`1`。 该成员已经完成，因此正确的输出是：```
1 1
0
```粗心的实施会导致成员的警报处于活动状态，从而再次报告该警报。 

第三，XOR解码取决于先前的答案计数。 例如：```
1 4
1 1 1 1
2 1 1
1 0 1 0
2 0 0
```第一个成员在第二个事件之后完成，所以`last = 1`。 因此，第三个事件从`1 0 1 0`给具有目标 1 和观测站 1 的新成员。第四个事件通过 1 解码为观测站 1 的另一个更新。输出为：```
1 1
1 2
```如果使用错误的方式应用 XOR`last`，每个后来的事件都会被损坏。 

## 方法

 直接的解决方案是为每个成员保留其选择的观察站、其目标以及自该成员加入以来从这些观察站收集的视频量。 关于天文台的更新`x`，我们可以检查每个使用的成员`x`，重新计算当前总数，并检查是否达到目标。 

这是正确的，因为更新仅更改的贡献`x`。 问题在于此类检查的数量。 在最坏的情况下，大约一半的事件创建成员，另一半更新同一个观测站。 如果每个成员都使用该天文台，我们的表现大约是

 [
 \frac m2 \cdot \frac m2 = \Theta(m^2)
 ]

 会员资格检查。 为了`m = 2 * 10^5`，这的顺序是`10^10`检查。 

有用的观察是，一个成员`k`天文台无法达到剩余目标`r`除非其至少一个天文台至少接收到

 [
 \left\lceil \frac r k \right\rceil
 ]

 额外的分钟数。 这就是鸽巢原理。 如果全部`k`天文台收到的金额少于该金额，则其总增量将严格小于`r`。 

这让我们可以用几个简单的本地警报来代替一种困难的全局条件。 假设一个会员当前需要`r`更多分钟并使用天文台`q1, ..., qk`。 我们为每个人设置了警报`qi`，表示当该天文台获得另一个成员时我们要检查该成员`ceil(r/k)`分钟。 

每个观测站都可以将其警报维护在按警报触发的绝对计数器值排序的最小堆中。 天文台更新`x`只需要检查属于的堆`x`。 

有趣的部分是当警报响起但成员实际上尚未完成时会发生什么。 我们重新计算会员的真实剩余目标。 假设现在是`r' > 0`。 我们使用安装新警报

 [
 \left\lceil \frac{r'}k \right\rceil。 
]

 因为旧警报至少在`ceil(r/k)`在一个天文台收集了新的分钟数，剩余目标至少减少`ceil(r/k)`。 特别是，

 [
 r' \le r-\left\lceil\frac rk\right\rceil
 \le \frac{k-1}{k}r。 
]

自从`k <= 3`，每个失败的警报都会使剩余目标减少一个常数分数。 为了`k = 3`, 至多是`2r/3`。 由于最初的目标最多是`10^6`, 只能重构一个成员`O(log 10^6)`次。 

这就是堆方法起作用的原因。 蛮力在每次更新时检查每个成员，而警报结构仅在发生足够的进展以至于其剩余工作必须大幅缩减后才检查成员。 官方竞赛社论准确地描述了这一策略，为每个顶点使用一堆警报。 

Python 中存在一个实现问题。 简单的惰性堆会在每次重建期间插入新警报，并将旧警报留在堆内。 这很容易编写，但它可能会创建许多过时的堆条目。 相反，下面的实现使用索引二进制堆。 每个成员最多有三个报警节点，重建成员会更改这些现有节点的键，而不是分配新的堆条目。 当某个成员完成后，其所有报警节点都会被直接移除。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(m^2)`|`O(m)`| 太慢了 |
 | 堆警报|`O(m log m log V)`|`O(n + m)`| 已接受 |

 这里`V <= 10^6`是最大目标。 因素`k <= 3`被吸收到常数中。 

## 算法演练

 1. 维护`value[x]`, 天文台收集的总金额`x`迄今为止。 该值包括会员加入之前收集的视频，因此每个会员还存储加入时所选的每个观测站的值。 减去这些保存的值即可准确得出该成员的贡献值。 
2.当新成员有目标时`y`和`k`天文台到达，保存其选定的天文台及其当前`value`柜台。 对于每个选定的观测站，创建一个警报，其目标是当前计数器加上

 [
 \left\lceil\frac yk\right\rceil。 
]

 目标是绝对计数器值，因此警报不需要记住观测站在事件之间发生了多少变化。 
3. 将属于同一观测站的所有警报存储在最小堆中。 最小的目标是可能在那里触发的下一个警报。 索引堆还记住每个警报节点的位置，允许我们更改或删除任意警报`O(log m)`时间。 
4. 对于类型 2 事件，首先对观测站进行异或解码，并使用之前的增量进行增量`last`。 增加`value[x]`通过解码的增量。 
5. 当最小警报处于`x`目标不大于新目标`value[x]`，处理该警报。 附加到警报的成员保证是由于此更新而可能变得完整的成员之一。 
6. 通过求和计算出会员实际收取的金额`value[q] - base[q]`最多三个天文台。 如果该总和至少是该成员的目标，则将该成员标记为已完成，删除其所有警报节点，并将其 ID 附加到此更新的答案中。 
7. 如果会员尚未完成，让`r`是其剩余的目标。 套装

 [
 d=\left\lceil\frac rk\right\rceil。 
]

 更改成员的每个警报节点，使其新目标为`value[q] + d`。 这些是未来的增量，因此当前计数器用作新的起点。 
8. 处理完本次更新期间触发的所有警报后，对本次更新收集的 ID 进行排序并打印它们。 放`last`报告的 ID 数量。 然后该值用于解码下一个事件。 

### 为什么它有效

 不变的是，每个活跃成员在其选定的每个观测站上都有一个警报，并且每个警报都准确定位`ceil(r/k)`未来的单位远在哪里`r`是成员当前剩余的目标。 如果该成员达到了其目标，则至少一个选定的天文台必须至少获得`ceil(r/k)`自上次重建以来，因此这些警报之一必须在成员完成时触发。 因此，成员不能在未经检查的情况下默默地通过其完成点。 

当警报响起时，我们会计算自该会员加入以来的准确累计贡献。 如果达到目标，我们会举报该会员并删除其所有警报，这样就不会再被举报。 否则，它的剩余目标最多变成`(k-1) / k`之前的剩余目标，并且警报从新状态重建。 因此，每个成员只能以对数方式重建多次。 

存储的基值处理其他正确性条件：在成员加入之前进行的观察永远不会进入其贡献计算。 最后，在每次更新后对 ID 进行排序可以准确地给出所需的递增顺序。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    # Current total collected at every observatory.
    value = [0] * n

    # Member data, indexed by member id.
    goals = [0]
    positions = [()]
    bases = [()]
    nodes_of_member = [()]
    active = [False]

    # Every alarm is represented by one node.
    # node_target[node] is its absolute firing target.
    # node_member[node] is the member owning it.
    # node_pos[node] is the observatory heap containing it.
    # node_index[node] is its current index inside that heap.
    node_target = []
    node_member = []
    node_pos = []
    node_index = []

    # One indexed binary min-heap per observatory.
    heaps = [[] for _ in range(n)]

    def less(a, b):
        ta = node_target[a]
        tb = node_target[b]
        if ta != tb:
            return ta < tb
        return a < b

    def sift_up(heap, i):
        node = heap[i]
        while i:
            p = (i - 1) >> 1
            parent = heap[p]
            if not less(node, parent):
                break
            heap[i] = parent
            node_index[parent] = i
            i = p
        heap[i] = node
        node_index[node] = i

    def sift_down(heap, i):
        node = heap[i]
        size = len(heap)
        while True:
            left = i * 2 + 1
            if left >= size:
                break
            right = left + 1
            child = left
            if right < size and less(heap[right], heap[left]):
                child = right
            if not less(heap[child], node):
                break
            heap[i] = heap[child]
            node_index[heap[i]] = i
            i = child
        heap[i] = node
        node_index[node] = i

    def insert_node(node, pos):
        heap = heaps[pos]
        node_pos[node] = pos
        heap.append(node)
        node_index[node] = len(heap) - 1
        sift_up(heap, len(heap) - 1)

    def remove_node(node):
        pos = node_pos[node]
        heap = heaps[pos]
        i = node_index[node]
        last_node = heap.pop()

        if i < len(heap):
            heap[i] = last_node
            node_index[last_node] = i

            if i and less(last_node, heap[(i - 1) >> 1]):
                sift_up(heap, i)
            else:
                sift_down(heap, i)

        node_index[node] = -1

    def change_key(node, new_target):
        node_target[node] = new_target
        pos = node_pos[node]
        heap = heaps[pos]
        i = node_index[node]

        if i and less(node, heap[(i - 1) >> 1]):
            sift_up(heap, i)
        else:
            sift_down(heap, i)

    last = 0
    member_count = 0
    output = []

    for _ in range(m):
        parts = list(map(int, input().split()))
        op = parts[0]

        if op == 1:
            enc_y = parts[1]
            k = parts[2]

            y = enc_y ^ last

            qs = []
            bs = []

            for j in range(k):
                q = parts[3 + j] ^ last
                q -= 1
                qs.append(q)
                bs.append(value[q])

            member_count += 1
            mid = member_count

            goals.append(y)
            positions.append(tuple(qs))
            bases.append(tuple(bs))
            nodes_of_member.append(())
            active.append(True)

            delta = (y + k - 1) // k
            member_nodes = []

            for q in qs:
                node = len(node_target)

                node_target.append(value[q] + delta)
                node_member.append(mid)
                node_pos.append(q)
                node_index.append(-1)

                member_nodes.append(node)
                insert_node(node, q)

            nodes_of_member[mid] = tuple(member_nodes)

        else:
            x = (parts[1] ^ last) - 1
            add = parts[2] ^ last

            value[x] += add
            answer = []

            heap = heaps[x]

            while heap:
                node = heap[0]
                if node_target[node] > value[x]:
                    break

                mid = node_member[node]

                if not active[mid]:
                    remove_node(node)
                    continue

                qs = positions[mid]
                bs = bases[mid]
                k = len(qs)

                collected = 0
                for j in range(k):
                    collected += value[qs[j]] - bs[j]

                if collected >= goals[mid]:
                    active[mid] = False
                    answer.append(mid)

                    for nd in nodes_of_member[mid]:
                        remove_node(nd)
                else:
                    remaining = goals[mid] - collected
                    delta = (remaining + k - 1) // k

                    for j, nd in enumerate(nodes_of_member[mid]):
                        q = qs[j]
                        change_key(nd, value[q] + delta)

            answer.sort()

            output.append(str(len(answer)) + (
                " " + " ".join(map(str, answer)) if answer else ""
            ))

            last = len(answer)

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```这`value`数组表示每个天文台当前的累计数量。 当成员加入时，它故意不重置。 反而，`bases`记录每个摄像机的旧值，因此与成员相关的贡献是`value[q] - bases[q]`。 

这`goals`,`positions`,`bases`， 和`nodes_of_member`数组均按成员 ID 进行索引。 由于成员最多使用三个观测站，因此每个记录的大小都保持不变。 

堆实现是索引的而不是惰性的。 每个报警都有一个稳定的节点ID，并且`node_index`准确地告诉我们该节点在其观察站堆中的位置。`change_key`因此可以修改现有警报`O(log m)`， 尽管`remove_node`可以在相同复杂度下删除一个。 这可以避免重建后保留过时的警报。 

当某个成员未通过检查时，代码会计算其确切的剩余目标，并设置相对于当前观测站计数器的所有警报目标。 天花板的表情`(remaining + k - 1) // k`是整数形式`ceil(remaining / k)`。 

当成员完成时，其所有警报节点将立即删除。 这就是为什么即使稍后更新了另一个选定的天文台，也无法再次报告已完成的成员。 

在任何状态改变之前对输入进行解码。 对于 1 类事件，`last`应用于目标和每个观测站指标。 对于类型 2 事件，它适用于观测站和增量。 处理完 2 类事件后，`last`成为该事件报告的成员数量。 

Python 整数具有任意精度，因此不存在溢出问题。 最大实际计数器可以超过`10^6`因为许多更新可能会在同一个观测站累积，这是在解释或实现中不使用固定宽度假设的另一个原因。 

## 工作示例

 ### 示例 1

 样本是：```
3 5
1 5 3 1 2 3
2 2 1
1 2 2 1 2
2 3 1
2 1 3
```第一个成员有目标 5 和观测站 1、2 和 3 的摄像机。其初始警报增量为`ceil(5 / 3) = 2`。 

| 活动 |`last`之前| 运营| 天文台总计 | 会员国 | 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 添加成员 1，目标 5，`{1,2,3}`|`(0,0,0)`| 剩余 5 个，报警时间为`2`| |
 | 2 | 0 | 将 1 添加到观测站 2 |`(0,1,0)`| 剩余 4 |`0`|
 | 3 | 0 | 添加成员 2，目标 2，`{1,2}`|`(0,1,0)`| 成员 2 从这些值开始 | |
 | 4 | 0 | 将 1 添加到观测站 3 |`(0,1,1)`| 没有警报达到目标|`0`|
 | 5 | 0 | 将 3 添加到观测站 1 |`(3,1,1)`| 会员 1 有`3+1+1=5`; 成员 2 有`3+0=3`|`2 1 2`|

 第四个事件没有完成成员 1，因为它的贡献只是`0 + 1 + 1 = 2`。 最终更新将观测站 1 提升到足以向两个成员发出警报，并且两次精确检查都成功。 ID 在打印前进行排序。 

### 示例 2

 考虑以加密为中心的示例：```
1 4
1 1 1 1
2 1 1
1 0 1 0
2 0 0
```| 活动 |`last`之前| 解码操作| 天文台总计| 活跃会员 | 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 成员 1：目标 1，摄像机 1 | 0 |`{1}`| |
 | 2 | 0 | 天文台 1 得 1 | 1 |`{}`|`1 1`|
 | 3 | 1 | 成员2：目标`0 XOR 1 = 1`， 相机`0 XOR 1 = 1`| 1 |`{2}`| |
 | 4 | 1 | 天文台`0 XOR 1 = 1`得到`0 XOR 1 = 1`| 2 |`{}`|`1 2`|

 第三个事件是示例中有用的部分。 如果直接解释，它的加密值看起来无效，但在异或之后`last = 1`它们成为有效的目标和观察指标。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(m log m log V)`| 每个成员都被重建`O(log V)`次，每次重建最多触及三个堆节点，并且每次堆操作成本`O(log m)`|
 | 空间|`O(n + m)`| 有`n`堆，每个成员最多三个警报节点 |

 几何减少来自

 [
 r'\le\frac{k-1}{k}r。 
]

 最慢的情况是`k = 3`，大致给出`r' <= 2r/3`。 开始于`10^6`，这仅需要一名成员进行大约 35 次失败的重建。 由于每个成员最多有3个报警，因此存活堆节点总数为`O(m)`。 即使在多次警报重建之后，索引堆仍会保持此内存限制。 

为了`n,m <= 2 * 10^5`，对数因子对于堆组织是必要的，但关键的改进是我们在更新后从不扫描不相关的成员。 常数`k <= 3`使每次重建都足够小，以满足预期的复杂性。 

## 测试用例

 以下测试工具假设上述解决方案保存为`solution.py`。```python
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

# Provided sample.
assert run(
    """3 5
1 5 3 1 2 3
2 2 1
1 2 2 1 2
2 3 1
2 1 3
"""
) == "0\n0\n2 1 2", "sample"

# Minimum-size case: an update with no members.
assert run(
    """1 1
2 1 7
"""
) == "0", "minimum-size case"

# All three cameras receive equal amounts.
assert run(
    """3 4
1 9 3 1 2 3
2 1 3
2 2 3
2 3 3
"""
) == "0\n0\n1 1", "equal contributions"

# Boundary case: the total reaches the goal only on the third camera.
assert run(
    """3 4
1 6 3 1 2 3
2 1 2
2 2 2
2 3 2
"""
) == "0\n0\n1 1", "boundary and rebuild"

# XOR encoding after a nonzero last value.
assert run(
    """1 4
1 1 1 1
2 1 1
1 0 1 0
2 0 0
"""
) == "1 1\n1 2", "online xor decoding"

# Maximum event count: all events add members, so there are no output lines.
# Every event is valid because last remains zero.
max_case = "200000 200000\n" + ("1 1 1 1\n" * 200000)
assert run(max_case) == "", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`一次更新 |`0`| 最小尺寸和空警报堆 |
 | 三摄像头等增量|`0`,`0`,`1 1`| 多次重建和`k = 3`案例 |
 | 目标 6 有贡献`2,2,2`|`0`,`0`,`1 1`| 精确的阈值边界和上限划分|
 | 加密单天文台案例|`1 1`,`1 2`| 正确使用前面的`last`|
 |`200000`1 类事件 | 空输出 | 最大事件计数和内存处理 |

 ## 边缘情况

 第一个边缘情况是在成员加入之前收集的视频。 在```
1 3
2 1 5
1 3 1 1
2 1 3
```在成员存在之前，全局计数器变为 5。 创建成员时，实现存储`base = 5`。 最终更新后，相关贡献为`value[1] - base = 8 - 5 = 3`，因此该成员恰好在那时达到了目标。 输出是`0`,`0`,`1 1`。 

第二种边缘情况是成员完成并随后接收更多更新。 在```
1 3
1 2 1 1
2 1 2
2 0 0
```第一次更新使会员完整。 它是`active`flag 变为 false，并且其所有警报节点均被删除。 自从`last = 1`，最终的编码更新是对观测站 1 的另一个更新。它的堆是空的，因此没有报告任何内容。 输出是`1 1`,`0`。 

第三种边缘情况是导致警报但未完成的更新。 考虑：```
3 4
1 6 3 1 2 3
2 1 2
2 2 2
2 3 2
```最初，每个警报都会在未来两分钟后发生，因为`ceil(6/3)=2`。 第一次更新在观测站 1 发出警报，但该成员只收集了 2 分钟。 其剩余目标是 4，因此警报会以增量重建`ceil(4/3)=2`。 第二次更新会触发另一个警报，还剩 2 分钟。 然后以增量重建警报`ceil(2/3)=1`。 第三次更新触发最终警报，确切总数为 6。输出为`0`,`0`,`1 1`。 

第四个边缘情况是一个大更新。 假设一个成员有目标10和三台摄像机，那么一台摄像机突然收到100分钟。 它的警报响起一次，精确检查立即发现目标已达到。 没必要一一模拟这100分钟。 堆只关心绝对报警目标是否被越过。 

最后的边缘情况是多个成员共享同一个天文台。 它们在该观测站的堆中都有单独的警报节点。 更新首先处理最小的目标，在该成员完成或重建后，再次检查堆。 重复此过程，直到最小目标大于当前观测值。 与该观测站无关的成员永远不会受到更新的影响。 

如果您愿意，我还可以使用较新的二进制警报技术提供社论的第二个版本，该技术将渐近界限提高到大约`O(m log V)`但实施起来要复杂得多。
