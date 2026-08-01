---
title: "CF 104069E - El 分类器"
description: "我们正在管理一系列存储在多组结构中的鞋码，其中的删除是永久性的。 每次客户到达时，他们都会指定可接受的最小鞋子尺码，我们必须为他们提供尺码至少为该阈值的最小可用鞋子。"
date: "2026-07-02T02:59:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104069
codeforces_index: "E"
codeforces_contest_name: "VII MaratonUSP Freshman Contest"
rating: 0
weight: 104069
solve_time_s: 43
verified: true
draft: false
---

[CF 104069E - El Classificador](https://codeforces.com/problemset/problem/104069/E)

 **评级：** -
 **标签：** -
 **求解时间：** 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在管理一系列存储在多组结构中的鞋码，其中的删除是永久性的。 每次客户到达时，他们都会指定可接受的最小鞋子尺码，我们必须为他们提供尺码至少为该阈值的最小可用鞋子。 一旦鞋子被分配，它就会从库存中消失并且不能重复使用。 

输入给出了一个初始的鞋码数组，然后是一系列查询。 每个查询在输入上都是独立的，但在执行上却不是，因为早期的分配会更改稍后查询的可用池。 对于每个查询，我们要么输出分配的鞋子的尺寸，如果不存在合适的鞋子，则输出 -1。 

该约束允许最多 200,000 只鞋子和 200,000 个查询，值最多为 10^9。 任何尝试扫描整个数组以查找每个查询的解决方案都将按 n·q 操作的顺序执行，在最坏的情况下最多可进行 4·10^10 次比较。 这远远超出了 Python 甚至优化的 C++ 中几秒钟内运行的速度。 

在简单的场景中，简单的方法会失败，比如已经排序的列表，并且查询量逐渐减少。 例如，如果鞋子是 [1, 2, 3, 4, 5] 并且查询都是 5，则每个查询将扫描完整列表以查找最后一个剩余的有效元素。 尽管答案很明显，但重复的线性扫描在运行时占据主导地位。 

一个微妙的边缘情况是重复相同的值。 如果输入是 [4, 4, 4] 并且查询是 [4, 4, 4, 4]，则正确的行为是每个查询消耗一个 4 直到耗尽，然后返回 -1。 如果一个简单的解决方案忘记将元素标记为已删除或错误地处理重复项，那么它要么多次重复使用同一只鞋，要么跳过有效的匹配。 

## 方法

 暴力破解策略很简单：对于每个查询，从左到右扫描整个数组，找到第一个至少为 x 的元素，输出它，并将其从数组中删除。 可以通过物理删除元素或对其进行标记来完成删除。 正确性是立竿见影的，因为我们直接模拟了语句中给出的规则。 

失败点是性能。 在最坏的情况下，每个查询的成本为 O(n)，并且有 q 个查询，导致 O(nq)。 当 n 和 q 都达到 2·10^5 时，这是不可行的。 

关键的观察是，我们重复需要对动态值集进行两次操作：找到至少为 x 的最小元素，然后将其删除。 这正是动态有序集上类似前驱的查询。 一旦我们对初始数组进行排序，问题就减少到维护一个有效支持下限搜索和删除的结构。 

平衡二叉搜索树或多集直接支持这一点，但在竞争性编程中，我们可以使用排序结构加上二分搜索来有效地模拟它。 然而，Python 列表中的删除是线性的，因此我们需要一个结构，其中删除不会移动大段。 基于频率计数的线段树或具有二等分加延迟删除的排序容器也可以，但最干净的方法是基于压缩值域的线段树或存储出现次数的芬威克树，使我们能够通过二进制提升定位下一个可用值。 

我们压缩值是因为大小达到 10^9 但仅存在 2·10^5 个不同值。 压缩后，我们保持频率。 每个查询变成“在受 x 约束的值顺序中查找前缀总和≥目标位置的第一个索引”。 我们首先使用二分搜索找到第一个值≥x的压缩索引，然后使用芬威克树“kth”风格的遍历找到下一个可用的活动索引。 这给了我们最小的有效可用鞋，我们减少它的数量。 

这将每个查询减少到 O(log n)，总共为 O((n + q) log n)。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了 |
 | 最优（Fenwick / 多集模拟）| O((n+q) log n) | O((n+q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们首先对鞋子尺码进行排序和压缩，以便我们可以按升序推理它们，同时仍然映射回原始值。 每个不同的大小在排序数组中都有一个索引。 

我们在这些索引上构建一棵芬威克树，其中每个位置存储当前可用的该尺寸的鞋子数量。 

对于每个查询 x，我们将 x 转换为压缩数组中值至少为 x 的第一个索引。 从那时起，我们只关心结构的后缀，因为 x 之前的所有内容对于该查询都是无效的。 

然后，我们使用芬威克树来查找该索引处或之后仍具有正计数的第一个位置。 这是标准的“查找累积频率达到目标的第一个前缀”操作，适合从下限索引而不是从 1 开始。 

一旦我们找到该位置，我们就输出它的值并减少它在芬威克树中的频率。 

如果不存在这样的位置，我们输出−1。 

### 为什么它有效

 在每一步中，Fenwick 树都会保留准确的多组可用鞋子。 二分搜索步骤确保我们永远不会考虑小于查询阈值的值。 “kth-like”遍历确保我们选择有效候选者中仍然存在的最小索引。 由于每次移除都会立即更新结构，因此未来的查询始终反映正确的剩余库存，因此模拟与问题定义完全匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

    def kth(self, k):
        pos = 0
        bitmask = 1 << (self.n.bit_length())
        while bitmask:
            nxt = pos + bitmask
            if nxt <= self.n and self.bit[nxt] < k:
                k -= self.bit[nxt]
                pos = nxt
            bitmask >>= 1
        return pos + 1

def lower_bound(arr, x):
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] >= x:
            hi = mid
        else:
            lo = mid + 1
    return lo

def main():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    vals = sorted(set(a))
    idx = {v: i + 1 for i, v in enumerate(vals)}

    fw = Fenwick(len(vals))

    for v in a:
        fw.add(idx[v], 1)

    for _ in range(q):
        x = int(input())
        pos = lower_bound(vals, x)
        if pos == len(vals):
            print(-1)
            continue

        # convert to Fenwick index range [pos+1 ... end]
        # we need first active in suffix, so we compare counts
        total_before = fw.sum(pos)
        total_all = fw.sum(len(vals))
        if total_all - total_before <= 0:
            print(-1)
            continue

        # find (total_before + 1)-th alive element overall
        # but must ensure it's within suffix; this is guaranteed by construction
        k = total_before + 1
        i = fw.kth(k)

        if i < pos + 1:
            # fallback safety, should not happen
            i = fw.kth(total_before + 1)

        print(vals[i - 1])
        fw.add(i, -1)

if __name__ == "__main__":
    main()
```芬威克树以压缩形式维护每种鞋码的频率。 这`lower_bound`函数定位第一个符合条件的大小索引。 然后，我们计算该索引之前存在多少有效鞋子，并使用全局第 k 个查询来选择下一个可用的鞋子。 这是有效的，因为通过限制起始排名可以有效地跳过所有无效候选者。 

一个常见的微妙之处是确保我们不会意外地选择小于 x 的鞋子。 这就是为什么我们明确比较前缀计数并从第一个有效排名开始选择。 另一个微妙之处是正确处理重复项：芬威克树存储多重性，因此相同的大小自然会被一一消耗。 

## 工作示例

 ### 示例 1

 输入：```
5 3
1 2 3 4 5
2
4
3
```我们直接压缩值[1,2,3,4,5]。 

| 查询 | x| 下限 pos | 前缀计数 | 选择索引| 输出| 剩余多重集 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 2 | 1 | 2 | 2 | [1,3,4,5]|
 | 2 | 4 | 4 | 2 | 4 | 4 | [1,3,5]|
 | 3 | 3 | 3 | 1 | 3 | 3 | [1,5]|

 该跟踪显示了结构如何始终跳过已删除的元素并遵守最小约束。 

### 示例 2

 输入：```
3 4
4 4 4
4
4
4
4
```| 查询 | x| x | 之前的前缀计数 选择| 输出| 剩余|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 4 | 0 | 第一 | 4 | [4,4]|
 | 2 | 4 | 0 | 第一 | 4 | [4] |
 | 3 | 4 | 0 | 第一 | 4 | []|
 | 4 | 4 | 0 | 无 | -1 | []|

 这证实了重复和耗尽的正确处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每次插入和查询都使用 Fenwick 操作 |
 | 空间| O(n) | 压缩值加上 Fenwick 树 |

 这些约束允许最多 2·10^5 运算，并且当使用简单循环实现时，在 Python 中，18 左右的对数因子很容易足够快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import main
    import contextlib
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        main()
    return output.getvalue().strip()

# provided sample-style cases
assert run("5 3\n1 2 3 4 5\n2\n4\n3\n") == "2\n4\n3"
assert run("3 4\n4 4 4\n4\n4\n4\n4\n") == "4\n4\n4\n-1"

# custom edge cases
assert run("1 2\n10\n10\n10\n") == "10\n-1"
assert run("2 2\n1 100\n50\n50\n") == "100\n-1"
assert run("5 5\n5 4 3 2 1\n1\n1\n1\n1\n1\n") == "1\n2\n3\n4\n5"
assert run("4 3\n2 2 2 2\n3\n1\n2\n") == "-1\n2\n2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素穷举 | 10, -1 | 边界去除 |
 | 混合值阈值| 100, -1 | 正确性下限 |
 | 逆序满耗| 1..5 | 1..5 重复第 k 个逻辑 |
 | 重复项 + 阈值跳过 | -1,2,2 | 重复处理|

 ## 边缘情况

 对于系统中的单只鞋，算法可以正确处理即时耗尽。 如果输入是`10`接下来是两个查询`10, 10`，芬威克树最初有一个活跃元素。 第一个查询找到它，将其删除，第二个查询看到剩余元素为零，返回 -1。 

对于重复项，该结构会独立处理每次出现的情况。 在这样的情况下`[4,4,4]`有疑问`[4,4,4,4]`，每个成功的查询都会将频率恰好减少 1。 最终查询观察到总前缀和为零，超出阈值并正确输出 -1。 

对于阈值跳跃，请考虑`[1,100]`带查询`50`。 下限从 100 开始，因此算法从不考虑 1。然后，芬威克树直接返回 100 作为第一个有效元素，即使数组中较早存在无效的较小元素，也能保持正确性。
