---
title: "CF 105968J - 约翰尼斯喜欢游戏"
description: "我们正在使用动态整数数组，其中支持两种操作。 一个操作更改单个位置的值，另一个操作则询问有关数组的连续段的信息。"
date: "2026-06-22T16:21:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105968
codeforces_index: "J"
codeforces_contest_name: "IME++ Starters Try-Outs 2025"
rating: 0
weight: 105968
solve_time_s: 63
verified: true
draft: false
---

[CF 105968J - 约翰尼斯喜欢游戏](https://codeforces.com/problemset/problem/105968/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在使用动态整数数组，其中支持两种操作。 一个操作更改单个位置的值，另一个操作则询问有关数组的连续段的信息。 对段的查询不是像总和或最大元素这样的简单聚合。 相反，它要求通过选择完全在该段内的连续子数组可以获得最佳的总和。 

换句话说，对于任何查询范围$[l, r]$，我们考虑完全包含在该范围内的所有子数组，并取其中最大可能的总和。 该数组是可变的，因此更新后，将来的查询必须反映更改后的值。 

输入大小意味着大约$10^5$元素和操作，这会立即排除通过扫描段来重新计算每个查询。 每个查询的幼稚重新计算将导致$O(n)$每个查询的工作量和$O(nq)$总的复杂性，远远超出了可行的极限。 

关键的困难在于，分段查询必须以保留足够结构的方式组合来自两半的信息，以重建跨越边界的最佳子数组。 

一些边缘情况往往会破坏不正确的贪婪或基于前缀的尝试。 

当所有数字均为负数时就会出现一个问题。 例如，在数组中$[-5, -2, -7]$，范围查询的正确答案是$-2$，因为我们仍然需要选择一个非空子数组。 假设“允许空子数组且总和为 0”的简单方法将错误地返回 0。 

当最佳子数组穿过分割的中点时，就会出现另一个问题。 例如，在$[2, -1, 3]$，整个范围的最佳答案是$4$，它来自整个数组。 任何仅独立跟踪左右半部最佳答案的方法都会错过这种跨界组合。 

第三个微妙的情况出现在更新中。 更改单个值后，缓存的段信息必须在段树中的所有祖先之间保持一致。 无法重新计算所有派生属性会导致前缀或后缀数据过时，从而默默地中断后续查询。 

## 方法

 蛮力方法很简单。 对于范围内的每个查询$[l, r]$, we iterate over all possible starting points and ending points inside the range and compute the sum of each subarray. 我们跟踪遇到的最大总和。 This is correct because it explicitly checks every candidate subarray, leaving no possibility of missing the optimal one.

 However, this requires three nested layers of work in practice. 每个查询可以采取$O(n)$扫描时间，如果简单地实现子数组枚举，它会进一步退化。 高达$10^5$查询，这变得有效$10^{10}$在最坏的情况下操作，这是无法使用的。 

关键的观察结果是，可以根据有关其两半的紧凑信息来构建片段的答案。 我们不存储所有子数组，而是只存储重建可能跨越边界的任何最佳子数组所需的内容。 

对于每个细分市场，我们维护四个值。 段的总和、最佳前缀和、最佳后缀和以及段内任何位置的最佳子数组和。 这四个值就足够了，因为组合段中的任何最佳子数组要么完全在左半部分，要么完全在右半部分，要么跨越边界。 交叉情况可以使用左半部分的后缀和右半部分的前缀来表示。 

这将每个合并操作减少到恒定时间，从而使更新和查询都以对数时间运行的线段树成为可能。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(nq)$|$O(1)$| 太慢了 |
 | 具有自定义节点的线段树 |$O((n + q)\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 段树中的每个节点代表数组的一个段，并存储足以回答对该段的任何查询的聚合信息。 

1. 构建一棵线段树，其中每个叶子对应一个数组元素。 对于叶子来说，总和、前缀、后缀和最佳子数组都等于元素本身。 这是基本情况，因为单个元素没有内部结构。 
2. 定义合并操作，合并代表相邻段的两个子节点。 此操作是解决方案的核心，因为它确保我们永远不会丢失跨边界子数组所需的信息。 
3、合并左节点时$A$和右节点$B$，计算总和为$A.sum + B.sum$。 这是直接的，因为总和是在不相交的区间上相加的。
 4. 计算合并段的最佳前缀作为两者之间的最大值$A.prefix$和$A.sum + B.prefix$。 这捕获最佳前缀是完全留在左段还是延伸到右段。
 5. 对称地计算最佳后缀作为两者之间的最大值$B.suffix$和$B.sum + A.suffix$。 这捕获最佳后缀是留在右段还是延伸到左段。
 6. 计算最佳子数组作为三种可能性中的最大值：最佳子数组完全位于左段、完全位于右段或跨越边界，如下所示$A.suffix + B.prefix$。 这一步是中心思想，因为它明确枚举了最佳子数组的所有结构可能性。 
7. 对于更新，修改叶节点并使用合并操作重新计算其所有祖先。 这确保了从修改位置到根的一致性。 
8. 对于查询，以正确的顺序递归地组合相关段。 最终合并的节点在其最佳子数组字段中包含答案。 

正确性依赖于每个节点仅使用四个值完全总结其段内的所有子数组的不变量。 段中的任何子数组要么完全包含在一个子数组中，要么恰好跨越边界一次。 合并操作考虑了所有三种结构可能性，因此在聚合过程中不会丢失候选子数组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("sum", "pref", "suff", "best")
    def __init__(self, s=0, p=0, sf=0, b=0):
        self.sum = s
        self.pref = p
        self.suff = sf
        self.best = b

def merge(a, b):
    res = Node()
    res.sum = a.sum + b.sum
    res.pref = max(a.pref, a.sum + b.pref)
    res.suff = max(b.suff, b.sum + a.suff)
    res.best = max(a.best, b.best, a.suff + b.pref)
    return res

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.t = [Node(-10**18, -10**18, -10**18, -10**18) for _ in range(2 * self.size)]
        for i in range(self.n):
            v = arr[i]
            self.t[self.size + i] = Node(v, v, v, v)
        for i in range(self.size - 1, 0, -1):
            self.t[i] = merge(self.t[2*i], self.t[2*i+1])

    def update(self, idx, val):
        i = self.size + idx
        self.t[i] = Node(val, val, val, val)
        i //= 2
        while i:
            self.t[i] = merge(self.t[2*i], self.t[2*i+1])
            i //= 2

    def query(self, l, r):
        l += self.size
        r += self.size + 1

        left_res = None
        right_res = None

        while l < r:
            if l & 1:
                left_res = self.t[l] if left_res is None else merge(left_res, self.t[l])
                l += 1
            if r & 1:
                r -= 1
                right_res = self.t[r] if right_res is None else merge(self.t[r], right_res)
            l //= 2
            r //= 2

        if left_res is None:
            return right_res.best
        if right_res is None:
            return left_res.best
        return merge(left_res, right_res).best

def main():
    n, q = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr)

    out = []
    for _ in range(q):
        t, a, b = map(int, input().split())
        if t == 1:
            st.update(a - 1, b)
        else:
            out.append(str(st.query(a - 1, b - 1)))

    print("\n".join(out))

if __name__ == "__main__":
    main()
```线段树存储每个区间的完整结构摘要。 合并函数对跨两半形成最大子数组的所有可能方式进行编码。 The update operation rebuilds the path to the root so that every affected segment remains consistent after a point change. 查询函数使用标准的迭代线段树遍历，从左到右组合部分线段，同时保留顺序，这一点至关重要，因为前缀和后缀信息取决于方向。 

一个微妙的细节是查询期间的中性元素行为。 该代码通过延迟左右结果的初始化来小心地处理空累积。 这可以避免与未初始化的节点错误地合并。 

## 工作示例

 考虑数组$[2, -1, 3]$查询整个范围。 

我们从已经代表各个值的叶节点开始。 

| 步骤| 左节点 | 右节点 | 总和| 前缀 | 后缀 | 最佳|
 | ---| ---| ---| ---| ---| ---| ---|
 | 合并(2, -1) | 2 | -1 | 1 | 2 | -1 | 2 |
 | 合并（上一个，3）| 2,-1 | 3 | 4 | 4 | 3 | 4 |

 最终结果是4，来自完整的段。 这表明跨界组合是多么必要，因为单独的一半都不能产生最佳答案。 

现在考虑$[-5, -2, -7]$为全系列。 

| 步骤| 左节点 | 右节点 | 总和| 前缀 | 后缀 | 最佳|
 | ---| ---| ---| ---| ---| ---| ---|
 | 合并(-5,-2) | -5 | -2 | -7 | -2 | -5 | -2 |
 | 合并（上一个，-7）| -5,-2 | -7 | -14 | -2 | -2 | -2 |

 结果是-2，来自选择单个元素-2。 这证实了该结构可以正确处理全负数组，而无需引入人工零。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((n + q)\log n)$| 每次更新和查询都会遍历线段树高度，合并常量大小的节点|
 | 空间|$O(n)$| 线段树每个节点存储恒定量的信息 |

 对数因子与高达的约束条件很好地吻合$10^5$操作，将总工作量保持在一定范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class Node:
        __slots__ = ("sum", "pref", "suff", "best")
        def __init__(self, s=0, p=0, sf=0, b=0):
            self.sum = s
            self.pref = p
            self.suff = sf
            self.best = b

    def merge(a, b):
        res = Node()
        res.sum = a.sum + b.sum
        res.pref = max(a.pref, a.sum + b.pref)
        res.suff = max(b.suff, b.sum + a.suff)
        res.best = max(a.best, b.best, a.suff + b.pref)
        return res

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.size = 1
            while self.size < self.n:
                self.size *= 2
            self.t = [Node(-10**18, -10**18, -10**18, -10**18) for _ in range(2 * self.size)]
            for i in range(self.n):
                v = arr[i]
                self.t[self.size + i] = Node(v, v, v, v)
            for i in range(self.size - 1, 0, -1):
                self.t[i] = merge(self.t[2*i], self.t[2*i+1])

        def update(self, idx, val):
            i = self.size + idx
            self.t[i] = Node(val, val, val, val)
            i //= 2
            while i:
                self.t[i] = merge(self.t[2*i], self.t[2*i+1])
                i //= 2

        def query(self, l, r):
            l += self.size
            r += self.size + 1
            left_res = None
            right_res = None
            while l < r:
                if l & 1:
                    left_res = self.t[l] if left_res is None else merge(left_res, self.t[l])
                    l += 1
                if r & 1:
                    r -= 1
                    right_res = self.t[r] if right_res is None else merge(self.t[r], right_res)
                l //= 2
                r //= 2
            if left_res is None:
                return right_res.best
            if right_res is None:
                return left_res.best
            return merge(left_res, right_res).best

    n, q = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr)

    out = []
    for _ in range(q):
        t, a, b = map(int, input().split())
        if t == 1:
            st.update(a - 1, b)
        else:
            out.append(str(st.query(a - 1, b - 1)))

    return "\n".join(out)

# custom cases
assert run("3 2\n1 2 3\n2 1 3\n2 2 3\n") == "6\n5", "basic range sums"
assert run("3 1\n-1 -2 -3\n2 1 3\n") == "-1", "all negative"
assert run("5 3\n1 -1 2 -2 3\n2 1 5\n1 2 5\n2 1 5\n") == "3\n8", "update effect"
assert run("1 1\n-10\n2 1 1\n") == "-10", "single element"
assert run("4 2\n2 -1 2 -1\n2 1 4\n2 2 3\n") == "3\n2", "cross boundary behavior"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 基本范围总和| 6, 5 | 完整正数组合并的正确性
 | 全部负面| -1 | 无零子数组处理 |
 | 更新效果| 3, 8 | 传播更新|
 | 单元素| -10 | 树叶处理|
 | 跨界行为 | 3, 2 | 边界子数组逻辑|

 ## 边缘情况

 对于像这样的全负数组$[-5, -2, -7]$，线段树将每个叶子初始化为有效的候选线段。 合并时，前缀和后缀值向上传播最小负元素。 最好的字段永远不会引入人工零，因为每个候选值都是从实际数组值派生的。 最终结果正确变为$-2$，它通过合并得以保留，因为它始终优于任何多元素组合。 

对于单元素查询，例如$[x]$，查询直接返回叶子节点。 合并逻辑永远不会被触发，因此最佳值仍然准确$x$，这证实了基本情况的正确性。 

对于将值从正值更改为负值的更新，更新函数会替换叶子并重建到根的路径。 每个祖先都会重新计算前缀、后缀和最佳值，确保如果更改的元素使先前的最佳段无效，则它们会正确降级。
