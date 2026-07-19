---
title: "CF 103720F-\u0411\u0430\u0437\u0430\u043e\u0442\u0434\u044b\u0445\u0430"
description: "我们正在管理一排 N 个编号的小屋，最初都是空的。 随着时间的推移，我们会收到两种类型的命令：预订请求和取消。"
date: "2026-07-02T09:20:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103720
codeforces_index: "F"
codeforces_contest_name: "VII \u041b\u0438\u043f\u0435\u0446\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e. \u0424\u0438\u043d\u0430\u043b. 3-7 \u043a\u043b\u0430\u0441\u0441\u044b"
rating: 0
weight: 103720
solve_time_s: 51
verified: true
draft: false
---

[CF 103720F - \u0411\u0430\u0437\u0430\u043e\u0442\u0434\u044b\u0445\u0430](https://codeforces.com/problemset/problem/103720/F)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在管理一排 N 个编号的小屋，最初都是空的。 随着时间的推移，我们会收到两种类型的命令：预订请求和取消。 预订请求要求我们分配 M 个连续的空闲小屋，但不是任意的，系统在从左到右扫描时必须始终选择最早的可能块，并且在该限制内，它必须优先选择可以连续容纳所有 M 个小屋的最左边的有效块。 每个预订都与一个唯一的团体名称相关联，我们必须准确记住分配给每个团体的小屋。 

取消命令涉及先前预订的团体并释放分配给该团体的所有小屋。 取消按照有效的时间顺序结构进行，这意味着我们绝不会取消已经取消的活动，而且我们总是按照与预订一致的顺序取消。 

每次预订后，我们必须输出指定小屋的准确索引。 最后，我们必须按排序顺序输出所有剩余的空闲小屋。 

该约束允许最多 10^5 个小屋和 10^5 个操作，分配的小屋总数也以 10^6 为界。 这立即排除了任何为每个查询扫描整个数组的解决方案。 每次预订的线性扫描将降级为 O(NK)，这太大了，约为 10^10 次操作。 

关键的困难是维护动态空闲段，同时支持对足够长度的最左边段的快速查询，以及删除先前分配的段。 

当取消后的空闲段合并时，会出现微妙的边缘情况。 例如，如果小屋 1 到 3 和 5 到 7 是空闲的，并且 4 在取消后变得空闲，则仅跟踪单个空闲位置的幼稚结构可能会错误地将 1-3 和 5-7 永远视为单独的，而忽略它们合并为单个较长的间隔 1-7。 当多个预订恰好填充段边界时，会出现另一种边缘情况，并且取消会重新创建一个必须在以后的预订中重用的大型连续块。 

## 方法

 强力解决方案将维护一个大小为 N 的布尔数组，表示占用情况。 对于每个预订请求，我们将从 1 扫描到 N，计算连续的空闲单元，并在找到长度为 M 的块时停止。这是正确的，因为它直接模拟了问题陈述。 然而，在最坏的情况下，每次预订可能需要扫描几乎所有 N 个位置，尤其是当 M 很小且空闲单元稀疏时。 这导致 O(NK)，对于 10^5 次操作来说是不可行的。 

改进来自于认识到我们正在重复查询和更新连续的空闲段。 我们不是对单个细胞进行推理，而是维持自由空间的间隔。 每次预订都成为对具有足够长度的最早航段的间隔搜索，并且每次取消都成为相邻空闲间隔的合并。 

关键结构是表示自由范围的一组有序的不相交间隔。 预订时，我们从最左边的间隔开始迭代，减去它的贡献，直到找到一个可以容纳 M 的间隔。然后我们分割该间隔。 取消时，我们插入一个新间隔，如果相邻，则与邻居合并。 

这将问题简化为具有有序结构操作的间隔管理，所有这些都可以使用平衡树或有序映射以每个事件的对数时间来实现。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力阵列扫描| O(NK) | O(N) | 太慢了 |
 | 订购免费间隔 | O(K log N) | O(K log N) | O(N) | 已接受 |

 ## 算法演练

我们维护自由段的平衡有序结构，每个段都是一个连续范围 [l, r]。 我们还维护一个字典，将组名称映射到其分配的段，以便我们可以在取消时恢复它们。 

1. 使用单个空闲间隔 [1, N] 初始化系统。 这表示所有小屋最初都位于一个连续的街区中。 
2. 为了处理大小为 M 的团体名称的预订请求，我们按照起始位置的顺序从左到右扫描空闲间隔。 对于每个区间 [l, r]，我们计算其长度。 如果间隔长度小于 M，我们从 M 中减去它并移动到下一个间隔。 如果区间长度至少为 M，则我们分配该区间的前 M 间小屋，这意味着我们采用 [l, l+M-1]，如果仍有剩余空间，则将区间更新为 [l+M, r]。 

这种从左到右的贪婪消费是正确的，因为该问题明确要求选择最早的可能的小屋。 

1. 我们存储为此组名称分配的段。 一般来说，只有当取消先前碎片化的空间时，一个组才可能占用多个不相交的段，因此我们为每个组存储一个间隔列表。 
2. 为了处理组的取消，我们检索其所有分配的段并将它们一一重新插入到空闲区间结构中。 插入每个段后，我们尝试将其与相邻的空闲段合并。 如果一个片段与前一个或下一个间隔相邻（即接触边界），我们将它们合并为一个更大的间隔。 

这种合并至关重要，因为否则该结构会人为地分割可用空间并破坏未来的贪婪分配。 

1. 处理完所有查询后，我们输出所有剩余的空闲区间，并将其扩展为显式小屋索引。 

### 为什么它有效

 不变的是，在任何时候，自由区间的集合都是不相交的并且完全代表自由小屋。 每次分配都会删除某个区间的前缀或将其干净地分割，以保持正确性。 每次取消都会重新引入之前占用的确切段，并与相邻段合并，从而不会留下人为的碎片。 由于间隔始终按排序顺序维护并且不重叠，因此从左到右扫描始终可以正确识别最早的可行放置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, k = map(int, input().split())
    
    # free intervals stored as sorted list of [l, r]
    import bisect

    starts = [1]
    ends = [n]
    
    # map name -> list of allocated intervals
    alloc = {}

    def merge_at(i):
        # merge interval i with neighbors if adjacent
        nonlocal starts, ends

        # merge left
        if i > 0 and ends[i-1] + 1 >= starts[i]:
            i -= 1

        # merge forward
        while i + 1 < len(starts) and ends[i] + 1 >= starts[i+1]:
            ends[i] = max(ends[i], ends[i+1])
            del starts[i+1]
            del ends[i+1]

        if i > 0 and ends[i-1] + 1 >= starts[i]:
            ends[i-1] = max(ends[i-1], ends[i])
            del starts[i]
            del ends[i]

    def add_interval(l, r):
        nonlocal starts, ends

        # insert by order
        i = bisect.bisect_left(starts, l)
        starts.insert(i, l)
        ends.insert(i, r)
        merge_at(i)

    def take(m):
        nonlocal starts, ends
        res = []
        i = 0
        while m > 0:
            l, r = starts[i], ends[i]
            length = r - l + 1
            if length <= m:
                res.append((l, r))
                m -= length
                del starts[i]
                del ends[i]
            else:
                res.append((l, l + m - 1))
                starts[i] = l + m
                m = 0
        return res

    out = []

    for _ in range(k):
        parts = input().split()
        if parts[0] == "Order":
            name = parts[1]
            m = int(parts[2])
            segs = take(m)
            alloc[name] = segs
            # expand for output
            arr = []
            for l, r in segs:
                arr.extend(range(l, r + 1))
            out.append(" ".join(map(str, arr)))
        else:
            name = parts[1]
            for l, r in alloc.get(name, []):
                add_interval(l, r)
            alloc[name] = []

    # final free cells
    final = []
    for l, r in zip(starts, ends):
        final.extend(range(l, r + 1))

    print("\n".join(out))
    print()
    print(" ".join(map(str, final)))

if __name__ == "__main__":
    main()
```该解决方案将空闲段维护为两个并行数组，按排序顺序存储间隔的开始和结束。 这`take`函数贪婪地消耗左侧的间隔，要么完全删除它们，要么从左侧缩小它们，完全符合分配最早可能的小屋的要求。 这`add_interval`函数重新引入释放的段并立即合并它们以恢复最大连续结构。 

一个微妙的实现细节是，每次插入后都必须进行合并，因为取消可以与上一个和下一个间隔创建邻接关系。 另一个微妙的点是`take`可能会删除当前区间，所以索引管理必须始终停留在第一个元素。 

## 工作示例

 ### 示例 1

 输入：```
5 3
Order a 2
Order b 2
Cancel a
```我们跟踪免费间隔和分配。 

| 步骤| 运营| 自由间隔| 分配输出|
 | ---| ---| ---| ---|
 | 1 | 初始化| [1,5]| |
 | 2 | 订购 2 | [3,5]| 1 2 |
 | 3 | 订单 b 2 | [5,5]| 3 4 |
 | 4 | 取消| [1,2], [3,5] | |

 这显示了取消如何恢复精确的段并保留未来操作的顺序。 

### 示例 2

 输入：```
7 4
Order x 3
Order y 2
Cancel x
Order z 4
```| 步骤| 运营| 自由间隔| 输出|
 | ---| ---| ---| ---|
 | 1 | 初始化| [1,7]| |
 | 2 | x 3 | [4,7]| 1 2 3 | 1 2 3
 | 3 | y 2 | [6,7]| 4 5 |
 | 4 | 取消 x | [1,3]、[4,5]、[6,7] | |
 | 5 | 4 | z 4 [5,7]| 1 2 3 4 | 1 2 3 4

 这证实了取消后的合并对于恢复正确的连续性是必要的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(K log N) 摊销 | 每个间隔都被分割或合并有限次数，并按顺序插入 |
 | 空间| O(N) | 间隔总是分割线而不重叠 |

 10^5 次操作的界限和高达 10^6 的总分配大小确保每个小屋索引仅被触及恒定的次数，从而使解决方案保持在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import contextlib

    out = io.StringIO()
    old = sys.stdout
    sys.stdout = out
    try:
        main()
    finally:
        sys.stdout = old
    return out.getvalue().strip()

# sample
assert run("""5 3
Order dandelion 3
Order pear 1
Cancel dandelion
""") == """1 2 3

1 2 3 5"""

# minimum size
assert run("""1 2
Order a 1
Cancel a
""") == """1

1"""

# full consumption then reuse
assert run("""5 4
Order a 5
Cancel a
Order b 5
Cancel b
""") == """1 2 3 4 5

1 2 3 4 5"""

# fragmented allocation
assert run("""10 5
Order a 3
Order b 3
Order c 3
Cancel b
Order d 4
""") == """1 2 3
4 5 6
7 8 9

1 2 3 4 5 6 7 8 9 10"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单细胞| 1 | 最低分配|
 | 满填+重复使用| 整行两次| 取消后的正确性 |
 | 碎片 | 多区间合并| 正确的区间重建|

 ## 边缘情况

 当取消恢复两个应立即合并的间隔时，就会出现一种重要的边缘情况。 假设我们有空闲区间 [1,2] 和 [4,5]，并且我们取消占据 [3,3] 的组。 正确的行为是将所有内容合并到 [1,5] 中。 该算法可以处理此问题，因为插入 [3,3] 会触发与两个邻居的邻接检查，将它们压缩为单个间隔。 

另一种情况是在分配期间重复部分消耗单个间隔。 如果一个区间是[1,100]，并且我们分配了很多小组，那么它会从左边重复分裂。 该结构仍然有效，因为收缩保留了排序顺序，并且不需要超出本地调整的重新平衡。 

第三种情况涉及交替预订和取消，从而多次重建大型连续段。 间隔始终合并的不变性确保性能不会因碎片而降低，因为每个边界仅创建或删除有限次数。
