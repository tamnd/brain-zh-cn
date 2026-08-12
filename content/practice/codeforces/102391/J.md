---
title: "CF 102391J - 公园生活"
description: "每个桥可以用半开区间([Si,Ei))来表示。 当连续点 (i) 和 (i+1) 之间的小弧位于该区间内时，可以看到桥。 输入包含 (N) 个加权电桥。"
date: "2026-08-10T20:10:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102391
codeforces_index: "J"
codeforces_contest_name: "XX Open Cup, Grand Prix of Korea"
rating: 0
weight: 102391
solve_time_s: 193
verified: true
draft: false
---

[CF 102391J - Parklife](https://codeforces.com/problemset/problem/102391/J)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个桥可以用半开区间([S_i,E_i))来表示。 当连续点 (i) 和 (i+1) 之间的小弧位于该区间内时，可以看到桥。 

输入包含 (N) 个加权电桥。 我们可以选择它们的任何子集，但对于每个基本弧，最多 (k) 个选定的桥可以覆盖它。 由于每种美学价值都是积极的，因此任务是最大化所选桥梁的总价值。 我们需要每个 (k=1,2,\ldots,N) 的最大值。 

几何条件比最初出现的要强得多。 两个桥段不能交叉，因此它们的可见区间永远不能部分重叠。 对于任何两个区间，它们要么不相交，要么一个完全包含另一个。 这种层状结构是问题的核心属性。 官方社论通过将间隔视为匹配的括号对然后形成解析树来进行相同的简化。 

(N) 的值可以达到 (250,000)，因此 (O(N^2)) 动态程序在最坏的情况下将检查至少 (625) 十亿个状态。 这远远超出了 2 秒比赛限制所能容忍的范围。 坐标范围达到（10^6），但这并不意味着我们应该在所有坐标上构建一个数组并运行基于坐标的DP。 有用的结构由 (N) 个桥本身决定，因此算法应该接近 (O(N\log N))。 

有几种边界情况很容易处理不当。 

考虑一座单桥。```
1
1 2 7
```只有一个桥，因此每个允许的 (k\ge1) 都会选择它。 答案是```
7
```将间隔视为闭合而不是半开的粗心实现可能会错误地使在端点处接触的桥重叠。 例如，```
2
1 2 5
2 3 7
```两个可见区间是 ([1,2)) 和 ([2,3))，因此它们是不相交的。 即使对于 (k=1) 也可以选择两个桥，给出```
12 12
```另一个重要的情况是嵌套区间链。```
3
1 6 10
2 5 20
3 4 30
```对于(k=1)，只能选择值(30)桥。 对于(k=2)，可以选择内部两个电桥，而对于(k=3)，可以选择所有三个电桥。 正确的输出是```
30 50 60
```简单地采用全局最佳 (k) 值的解决方案将会失败，因为嵌套约束取决于桥重叠的位置。 

最后，间隔可以具有相同的左端点。 例如，```
3
1 5 10
1 4 20
2 3 30
```正确的包含顺序是 ([1,5)) 包含 ([1,4)) 包含 ([2,3))。 仅按左端点排序不足以恢复该顺序。 当左端点相等时，较长的间隔必须在前。 

## 方法

 直接树 DP 自然是第一次尝试。 将间隔转换为包含树后，将 (F_u(k)) 定义为当每个根到后代路径最多包含 (k) 个选定顶点时，从 (u) 的子树可获得的最大值。 对于每个节点和每个（k），我们可以通过考虑（u）本身是否被选择来计算这个值。 

这个 DP 是正确的，因为每个可行的选择都恰好有这两种可能性之一。 如果不选择(u)，则每个子子树仍具有容量(k)。 如果选择 (u)，则它内部的每个间隔都会消耗一个单位的容量，因此每个子节点都会收到容量 (k-1)。 问题在于州的数量。 在考虑组合子项所需的工作之前，有 (O(N^2)) 个可能的对 ((u,k))，当 (N=250,000) 时至少给出 (625) 十亿个状态。 

暴力DP之所以有效，是因为包含树捕获了网桥之间的每一次交互。 它失败了，因为它为每个 (k) 单独存储相同的信息，即使连续 (k) 的值具有强大的结构。 

关键的观察是每个子树的 DP 作为 (k) 的函数具有递减的边际增益。 定义

 [
 D_u(k)=F_u(k)-F_u(k-1)。 
]

 这些差异不会增加。 因此，我们可以通过边际收益的多重集来表示整个函数 (F_u)，而不是存储每个 DP 值。 

假设 (u) 的子级具有边缘序列 (A,B,\ldots)。 它们的间隔是不相交的，因此所有子级都可以独立使用相同的 (k) 层。 如果两个孩子的边际收益是

 [
 a_1\ge a_2\ge\cdots
 ]

 和

 [
 b_1\ge b_2\ge\cdots,
 ]

 那么组合子树有边际收益

 [
 a_1+b_1,\a_2+b_2,\l点。 
]

 合并所有子节点后，考虑桥 (u) 本身的值 (w_u)。 选择它会消耗一层，因此得到的DP相当于在已排序的边际序列中插入一个额外的边际增益（w_u）。 

这正是官方解决方案描述的结构：子函数通过其排序导数的两两相加来组合，添加节点相当于将其权重插入到该导数集中。 

最大堆存储边际收益。 要合并两个子堆，请重复删除它们最大的元素，将这两个值相加，然后将结果值放入父堆中。 我们总是将较小的堆合并到较大的堆中。 这是标准的从小到大技术，官方分析给出了整个堆过程的 (O(N\log N)) 界限。 

最终虚拟根的值为零并包含每个桥。 它的堆代表通过增加 (k) 获得的边际改进。 我们反复取出最大的剩余边际收益并将其累加。 一旦堆变空，答案就已经达到最大值并且对于所有较大的 (k) 保持不变。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 朴素树 DP | (O(N^2)) | (O(N^2)) 或 (O(N)) 重新计算 | 太慢了 |
 | 最佳堆DP | (O(N\log N)) | (O(N)) 活动堆条目加上树 | 已接受 |

 ## 算法演练

1. 用可见区间 ([S_i,E_i)) 表示每座桥梁。 由于桥永远不会交叉，因此任何两个这样的间隔要么不相交，要么嵌套。 这将几何问题转化为层流区间问题。 
2. 添加包含整个坐标范围的虚拟区间并将其值设置为零。 该虚拟节点成为根，允许多个顶级不相交桥共存于一棵树中。 
3. 通过增加左端点对真实区间进行排序，通过减少右端点来打破平局。 这是包含树的预序。 当左端点相等时，较大的区间必须首先出现，因为它是祖先。 
4. 用栈扫描排序后的区间。 该堆栈包含从虚拟根到最近处理的间隔的当前路径。 对于新区间 ([S,E))，弹出右端点小于 (E) 的区间。 留在顶部的间隔恰好是包含新间隔的最小间隔，因此它成为新间隔的父间隔。 
5. 自下而上处理树。 对于每个节点 (u)，维护一个包含其 DP 函数边际收益的最大堆。 叶子以单个值 (w_u) 开始。 
6. 对于内部节点，首先合并其所有子节点的堆。 如果两个堆包含边缘序列 (A) 和 (B)，则成对删除它们的最大元素并插入它们的和。 这计算了 (F_A(k)+F_B(k)) 的边际序列，因为两个独立子树接收相同的容量 (k)。 
7. 始终使用较大的堆作为目标堆。 如果当前堆的元素少于另一个子堆的元素，请在合并之前交换它们。 仅需要删除较小堆中的元素，这给出了从小到大的界限。 
8. 合并所有子项后，将 (w_u) 插入堆中。 这代表选择 (u) 的选择，它会消耗一个额外的嵌套层，并为相应的边际增益准确贡献 (w_u)。 
9. 在虚拟根处，反复去除最大边际增益。 将其添加到运行答案中，并打印该运行答案以获得 (k) 的下一个值。 如果堆为空，则继续打印相同的答案，因为没有进一步的桥可以改进解决方案。 

为什么它有效：对于每个节点 (u)，堆不变量是其元素恰好是边际增益 (F_u(k)-F_u(k-1))，以非递增顺序排列。 独立的子子树添加它们的 DP 函数，因此它们的边际收益逐个位置地添加。 添加(u)本身将DP从(G(k))更改为(\max(G(k),w_u+G(k-1)))，这正是将(w_u)插入到(G)的排序边际增益中的操作。 因此，不变量从叶到根归纳成立。 从根本上来说，取最大（k）边际收益给出（F_{\text{root}}(k)），这正是容量（k）下的最大总审美价值。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve(stream=None):
    if stream is None:
        stream = sys.stdin

    read = stream.readline
    n = int(read())

    intervals = []
    for _ in range(n):
        s, e, w = map(int, read().split())
        intervals.append((s, e, w))

    # Increasing left endpoint, decreasing right endpoint.
    intervals.sort(key=lambda x: (x[0], -x[1]))

    # Node 0 is the virtual root.
    # Its interval contains every real interval and its value is zero.
    end = [1_000_001] + [0] * n
    weight = [0] * (n + 1)

    parent = [0] * (n + 1)

    # Children are stored as linked lists to avoid creating
    # N separate Python list objects.
    head = [-1] * (n + 1)
    nxt = [-1] * (n + 1)

    stack = [0]

    for u, (s, e, w) in enumerate(intervals, 1):
        end[u] = e
        weight[u] = w

        # Since left endpoints are processed increasingly,
        # containment is determined by the right endpoint here.
        while e > end[stack[-1]]:
            stack.pop()

        p = stack[-1]
        parent[u] = p

        nxt[u] = head[p]
        head[p] = u

        stack.append(u)

    # Each heap stores negative marginal gains, so heapq acts
    # as a max-heap on the original positive values.
    heaps = [None] * (n + 1)

    # Parent IDs are always smaller than child IDs because the
    # intervals were processed in preorder.
    for u in range(n, -1, -1):
        h = None
        child = head[u]

        while child != -1:
            other = heaps[child]

            if h is None:
                h = other
            else:
                # Always merge the smaller heap into the larger heap.
                if len(other) > len(h):
                    h, other = other, h

                m = len(other)

                # Pair the largest marginal gains.
                merged = [
                    heapq.heappop(h) + heapq.heappop(other)
                    for _ in range(m)
                ]

                # Rebuild once instead of performing m separate pushes.
                h.extend(merged)
                heapq.heapify(h)

            # The child heap has now been completely consumed.
            heaps[child] = None
            child = nxt[child]

        if h is None:
            h = []

        # Selecting u contributes one new marginal gain w[u].
        heapq.heappush(h, -weight[u])
        heaps[u] = h

    # Extract marginal gains from the virtual root.
    h = heaps[0]
    answer = 0
    result = []

    for _ in range(n):
        if h:
            answer -= heapq.heappop(h)
        result.append(str(answer))

    return " ".join(result)

if __name__ == "__main__":
    sys.stdout.write(solve() + "\n")
```在构造树之前对输入区间进行排序。 平局断路器是`-x[1]`，因此如果两个桥从同一点开始，则首先处理较大的区间，并且可以成为较小的区间的祖先。 

堆栈条件使用`e > end[stack[-1]]`， 不是`>=`。 允许相等的右端点，因为一个间隔可以包含另一个间隔，同时共享其右端点。 可见性间隔是半开的，因此在一个点结束的桥和从同一点开始的桥是不相交的，这自然是在弹出前一个间隔后由堆栈处理的。 

该树存储使用`head`和`nxt`而不是每个节点的列表。 当 (N) 很大时，这会大大减少 Python 对象开销。 由于排序后的区间形成前序，因此每个父代的节点索引都小于每个后代的节点索引，因此反向数值遍历对于自下而上的 DP 来说就足够了，并且避免了递归深度问题。 

堆存储负值，因为 Python`heapq`是一个最小堆。 因此，最大的原始边际增益是最小的存储值。 在子合并期间，最大的元素将从两个堆中删除，并添加它们的负表示。 如果原始增益为(a)和(b)，则存储的值为(-a)和(-b)，它们的总和为(-(a+b))，正是合并堆所需要的。 

这`merged`首先构建列表，然后将其附加到目标堆，然后添加一个`heapify`。 反复呼唤`heappush`将为每个新的合并值执行不必要的对数工作。 Python整数具有任意精度，因此总的审美价值可以达到(250,000\cdot10^9=2.5\cdot10^{14})，不需要特殊的溢出处理。 

在堆变空后，最终的提取会故意继续。 缺少边际收益意味着进一步增加 (k) 无法改善答案，因此运行总计保持不变。 

## 工作示例

 对于示例 1，包含树有两个主要分支。 第一个包含区间 ([1,2))、([2,3)) 及其父区间 ([1,3))。 第二个包含 ([3,4))、([4,5)) 及其父级 ([3,5))。 

| 处理节点| 子边缘序列 | 合并孩子后| 插入节点值后 |
 | --- | --- | --- | --- |
 | ([1,2),10) | 无 |`[]`|`[10]`|
 | ([2,3),10) | 无 |`[]`|`[10]`|
 | ([1,3),21) |`[10]`,`[10]`|`[20]`|`[21,20]`|
 | ([3,4),10) | 无 |`[]`|`[10]`|
 | ([4,5),10) | 无 |`[]`|`[10]`|
 | ([3,5),19) |`[10]`,`[10]`|`[20]`|`[20,19]`|
 | 虚拟根，0 |`[21,20]`,`[20,19]`|`[41,39]`|`[41,39,0]`|

 第一个边际增益是 (41)，因此 (k=1) 给出 (41)。 第二个边际增益是 (39)，因此 (k=2) 给出 (80)。 剩余的边际增益为零，因此每个较大的 (k) 也给出 (80)。 这会产生样本输出`41 80 80 80 80 80`。 

对于样本 2，每个区间都包含下一个区间：

 [
 [1,5)\supset[2,5)\supset[3,5)\supset[4,5)。 
]

 每座桥梁都有价值 (1)。 

| 处理节点| 子边缘序列| 插入值 1 | 后
 | --- | --- | --- |
 | ([4,5),1) |`[]`|`[1]`|
 | ([3,5),1) |`[1]`|`[1,1]`|
 | ([2,5),1) | ([2,5),1) |`[1,1]`|`[1,1,1]`|
 | ([1,5),1) | ([1,5),1) |`[1,1,1]`|`[1,1,1,1]`|
 | 虚拟根，0 |`[1,1,1,1]`|`[1,1,1,1,0]`|

 前四个正边际收益均为 (1)。 因此答案是(1,2,3,4)。 虚拟根贡献的零不会改变答案。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N\log N)) | 排序成本(O(N\log N))，从小到大的堆处理总体是(O(N\log N)) |
 | 空间| (O(N)) | 区间数组、包含树和活动堆条目包含 (O(N)) 个元素 |

 (250,000) 桥限制使得二次 DP 不可能，而 (O(N\log N)) 适合输入大小。 (10^6) 的坐标界限永远不会作为乘法因子出现，因为该算法仅适用于提供的桥及其包含关系。 Python 中的任意精度整数表示也足以满足最大可能的总值。 

## 测试用例```
# The solution is written so solve(stream) can be tested directly.
import io

def run(inp: str) -> str:
    return solve(io.StringIO(inp))

# Provided sample 1
assert run(
    """6
1 2 10
2 3 10
1 3 21
3 4 10
4 5 10
3 5 19
"""
) == "41 80 80 80 80 80", "sample 1"

# Provided sample 2
assert run(
    """4
1 5 1
2 5 1
3 5 1
4 5 1
"""
) == "1 2 3 4", "sample 2"

# Minimum-size input.
assert run(
    """1
1 2 7
"""
) == "7", "single bridge"

# Three disjoint bridges. They can all be selected already for k = 1.
assert run(
    """3
1 2 5
2 3 7
4 5 3
"""
) == "15 15 15", "disjoint intervals"

# A pure nesting chain.
assert run(
    """3
1 6 10
2 5 20
3 4 30
"""
) == "30 50 60", "nested chain"

# Endpoint touching plus an inner interval.
# [1,2) and [2,5) are disjoint, while [3,4) is nested in [2,5).
assert run(
    """3
1 2 5
2 5 100
3 4 7
"""
) == "105 112 112", "endpoint boundary"

# Same left endpoint, forcing the decreasing-right-endpoint tie breaker.
assert run(
    """3
1 5 10
1 4 20
2 3 30
"""
) == "30 50 60", "equal left endpoints"

# Maximum-size stress case.
# All 250000 intervals are pairwise disjoint and have value 1,
# so every answer is exactly 250000.
n = 250000
stress_input = str(n) + "\n" + "".join(
    f"{2 * i - 1} {2 * i} 1\n" for i in range(1, n + 1)
)
expected = " ".join(["250000"] * n)

assert run(stress_input) == expected, "maximum-size disjoint input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 2 7`|`7`| 最小值 (N)、单节点树和根处理 |
 | 三个接触或不相交的区间 |`15 15 15`| 半开可见区间和独立兄弟子树|
 |`1 6`,`2 5`,`3 4`|`30 50 60`| 纯嵌套和连续边际收益|
 |`1 2`,`2 5`,`3 4`|`105 112 112`| 端点接触与嵌套相结合|
 |`1 5`,`1 4`,`2 3`|`30 50 60`| 左端点相等和右端点递减排序 |
 | 250000 个不相交的单位间隔 |`250000`重复250000次| 最大（N）、大输出、堆和树可扩展性 |

 ## 边缘情况

 单桥情况是通过创建包含其值的叶堆来处理的。 为了```
1
1 2 7
```桥堆是`[7]`，虚拟根将该堆与其他子堆合并，并插入自己的零。 第一次提取添加 (7)，给出所需的输出`7`。 

对于触摸间隔，```
2
1 2 5
2 3 7
```第一个桥对应于 ([1,2))，第二个桥对应于 ([2,3))。 当处理第二个区间时，第一个区间不再包含它，因此堆栈返回到虚拟根。 他们成为兄弟姐妹。 它们的单元素边际堆组合为 (5+7=12)，给出单个正边际增益 (12)。 输出是`12 12`。 将间隔视为闭合会错误地使这些桥发生冲突 (k=1)。 

对于嵌套链，```
3
1 6 10
2 5 20
3 4 30
```树是一条路。 最里面的桥从边缘序列开始`[30]`。 它的母体插入物 (20)，产生`[30,20]`，以及外桥插件 (10)，产生`[30,20,10]`。 根加零。 提取这些收益给出`30`， 然后`50`， 然后`60`。 这正是最佳选择，因为每增加一个允许重叠的单位，我们就可以在链中再选择一个桥。 

对于相等的左端点，```
3
1 5 10
1 4 20
2 3 30
```排序依据`(left, -right)`将 ([1,5)) 放在 ([1,4)) 之前。 因此，堆栈正确地识别了遏制链。 如果颠倒了决胜局，则 ([1,4)) 可能会被错误地视为与其真实祖先无关。 得到的边际序列是`[30,20,10]`, 给予`30 50 60`。 

对于最大尺寸不相交的情况，每个桥都成为虚拟根的单独子节点。 每个孩子贡献一个边际收益 (1)。 由于子级是不相交的，因此它们的值被组合成单个边际增益 (250000)。 增加 (k) 没有任何好处，因此 (250000) 个答案中的每一个都是`250000`。 该案例还练习了从小到大的堆合并，并证实了该实现不依赖于接近（N）的坐标范围。 

解决类似问题的中心思想是边际增益表示：一旦层流约束变成一棵树，整个 k 维 DP 就可以折叠成每个子树的一个有序增益集合。
