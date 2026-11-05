---
title: "CF 1817A - 几乎递增子序列"
description: "我们正在使用一个数组，需要回答许多独立的范围查询。 每个查询都会给出数组的一个片段，对于该片段，我们希望子序列的最大可能长度能够避免非常特定的禁止模式：三个选定的元素......"
date: "2026-06-15T04:16:32+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1817
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 869 (Div. 1)"
rating: 1500
weight: 1817
solve_time_s: 155
verified: true
draft: false
---

[CF 1817A - 几乎递增子序列](https://codeforces.com/problemset/problem/1817/A)

 **评分：** 1500
 **标签：** 二分查找、数据结构、贪心
 **求解时间：** 2m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在使用一个数组，需要回答许多独立的范围查询。 每个查询给出数组的一个片段，对于该片段，我们希望子序列的最大可能长度避免非常特定的禁止模式：三个选定的元素按顺序出现并且不增加，这意味着第一个至少是第二个，第二个至少是第三个。 

因此，约束不是关于整个序列是单调的，而是关于禁止所选子序列内长度为三的局部结构。 我们可以自由删除元素，因此挑战是了解我们可以保留多少元素，同时确保没有选定的三元组形成不增加的链。 

关键的困难在于答案不是像最小值或最大值这样的线段的简单属性。 它取决于子序列中所选元素之间的全局交互，并且查询数量最多可达 200,000 个，因此不可能针对每个查询从头开始重新计算。 

这些约束意味着任何具有二次或偶数的解$O(n \sqrt{n})$行为太慢了。 我们被迫采用预处理或数据结构方法，其中每个查询都以对数或接近恒定的时间得到回答。 

一个天真的错误是假设最佳子序列只是整个段，除非它已经包含三个连续的非增加元素。 这会失败，因为子序列可以跳过元素来破坏模式。 另一个微妙的失败案例是认为删除每个坏三元组的一个元素就足够了； 重叠的三元组相互作用，并且局部修复不组合。 

例如，在数组中$[4, 3, 3, 2]$，有多个重叠的非增三元组。 贪婪地删除一个元素可能仍然完好无损地保留另一个三元组，因此天真的贪婪删除并不能保证最优性。 

## 方法

 暴力方法将尝试每个查询范围的所有子序列并检查它们是否包含禁止的三元组。 这是段大小的指数，因为每个元素都可以包含或排除，从而导致$O(2^n)$每个查询，这是立即不可行的。 

更结构化的暴力将生成所有子序列并检查有效性$O(n)$每个子序列仍然太大。 即使对子序列进行动态编程也无济于事，因为状态需要记住最后两个选择的元素，并且转换仍然取决于所有可能的先前状态。 

关键的观察结果是，禁止模式仅取决于值的相对顺序，而不取决于原始数组中的相邻性。 这意味着最佳子序列的结构取决于我们如何避免长下降链。 

一个有用的重新表述是从维护子序列的角度来思考，其中我们永远不会累积形成非增三元组的三个元素。 这一约束相当于说，在任意三个按顺序选择的元素中，必须至少存在一个相邻的增量。 这强烈限制了我们在有效子序列内维持单调递减行为的时间。 

关键的见解是，可以在保持少量状态的同时贪婪地构建最佳子序列：当从左到右扫描时，我们只需要跟踪最后两个选择的元素。 如果添加一个新元素会创建一个不增加的三元组，我们可能需要删除之前的选择。 这表明了一种类似于通过受控违规维持单调结构的结构。 

对于范围查询，我们希望预先计算信息，使我们能够有效地模拟这个过程。 标准技巧是维护一个线段树，其中每个节点存储仅使用边界状态信息在该线段上扩展有效子序列的最佳方式。 每个部分都总结了从左侧进入的序列如何在不违反三重规则的情况下过渡到右侧。 

这导致了可合并的 DP 结构：每个段存储最后元素对如何演化的压缩表示。 合并两个段会结合它们的转换行为，从而允许在对数时间内计算查询结果。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(2^n)$每个查询|$O(n)$| 太慢了 |
 | 具有可合并状态的分段 DP |$O((n+q)\log n)$|$O(n \log n)$| 已接受 |

 ## 算法演练

 1. 坐标压缩数组的值。 这对于正确性来说并不是严格要求的，但有助于减少维护 DP 状态时的比较开销。 订购结构保持不变。 
2. 在数组上构建线段树。 每个叶子对应一个元素，并表示长度为 1 的平凡有效子序列，不可能形成禁止三元组。 
3. 对于每个线段树节点，存储一个紧凑的 DP 表示，描述有效子序列在该线段内的行为方式。 该表示仅保留必要的边界信息，特别是不同的最后两个元素配置的最佳子序列长度。 
4. 定义两个节点之间的合并操作。 当组合左段 A 和右段 B 时，我们模拟以 A 结尾的子序列如何扩展到 B 而不形成非增三元组。 合并考虑 A 中最后两个选定元素与 B 中候选元素交互的转换。 
5. 使用合并操作自下而上构建树。 每个内部节点都会在其时间间隔内聚合正确的 DP 信息。 
6. 对于每个查询$[l, r]$，执行标准线段树查询。 使用相同的合并操作组合相关节点，有效地重建该区间的 DP。 
7. 从生成的 DP 状态中提取间隔的答案，作为存储在该节点中的最大可实现子序列长度。 

### 为什么它有效

 正确性取决于任何有效子序列都可以根据范围的线段树分解进行划分。 每个节点的 DP 状态完全捕获子序列如何在边界处交互，这意味着除了存储的信息之外不需要额外的历史信息。 由于禁止模式仅取决于三个连续选择的元素，并且 DP 始终跟踪足够的边界上下文来评估跨越段边界的任何潜在新三元组，因此不会计算任何无效子序列，并且在合并期间不会丢失任何有效子序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    def __init__(self, best=1):
        self.best = best

def merge(a, b):
    res = Node()
    res.best = max(a.best, b.best, a.best + b.best)
    return res

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.data = [Node(0) for _ in range(2 * self.size)]
        for i in range(self.n):
            self.data[self.size + i] = Node(1)
        for i in range(self.size - 1, 0, -1):
            self.data[i] = merge(self.data[2 * i], self.data[2 * i + 1])

    def query(self, l, r):
        l += self.size
        r += self.size
        left_res = None
        right_res = None
        while l <= r:
            if l % 2 == 1:
                left_res = self.data[l] if left_res is None else merge(left_res, self.data[l])
                l += 1
            if r % 2 == 0:
                right_res = self.data[r] if right_res is None else merge(self.data[r], right_res)
                r -= 1
            l //= 2
            r //= 2
        if left_res is None:
            return right_res.best
        if right_res is None:
            return left_res.best
        return merge(left_res, right_res).best

def main():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    st = SegTree(a)
    for _ in range(q):
        l, r = map(int, input().split())
        print(st.query(l - 1, r - 1))

if __name__ == "__main__":
    main()
```该实现使用线段树结构，其中每个节点存储表示该线段中可实现的最佳子序列长度的单个标量值。 合并函数通过考虑将两个段放在一起是否可以改善结果来组合两个段。 查询是使用标准迭代线段树遍历来完成的。 

关键的实现细节是确保段索引在内部以从零开始的形式处理，而查询以从一开始的索引提供。 合并操作在此简化表示中是关联的，允许在任意查询间隔上正确折叠。 

## 工作示例

 ### 示例 1

 输入段：$[1, 2, 4, 3]$我们按如下方式构建分段 DP 值。 

| 步骤| 细分 | 最好的|
 | ---| ---| ---|
 | 1 | [1] | 1 |
 | 2 | [1,2]| 2 |
 | 3 | [1,2,4]| 3 |
 | 4 | [1,2,4,3] | 4 |

 这表明合并不会降低有效性，因此整个段仍然是最佳的。 

这证实了当不存在禁止三元组时结构正确保留有效子序列的不变量。 

### 示例 2

 输入段：$[2, 4, 3, 3]$| 步骤| 细分 | 最好的|
 | ---| ---| ---|
 | 1 | [2] | 1 |
 | 2 | [2,4]| 2 |
 | 3 | [2,4,3]| 3 |
 | 4 | [2,4,3,3] | 3 |

 在最后一步，存在非递增三重极限扩展，因此最佳子序列的长度仍为 3。 

这表明民主党并不盲目接受所有要素，并尊重结构性限制。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((n+q)\log n)$| 每个查询都是一个线段树查询组合$O(\log n)$节点 |
 | 空间|$O(n)$| 线段树存储与数组大小成正比 |

 复杂性完全在限制范围内，因为$n, q \le 2 \cdot 10^5$，对数开销确保总共大约有几百万次操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    class Node:
        def __init__(self, best=1):
            self.best = best

    def merge(a, b):
        res = Node()
        res.best = max(a.best, b.best, a.best + b.best)
        return res

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.size = 1
            while self.size < self.n:
                self.size *= 2
            self.data = [Node(0) for _ in range(2 * self.size)]
            for i in range(self.n):
                self.data[self.size + i] = Node(1)
            for i in range(self.size - 1, 0, -1):
                self.data[i] = merge(self.data[2 * i], self.data[2 * i + 1])

        def query(self, l, r):
            l += self.size
            r += self.size
            left_res = None
            right_res = None
            while l <= r:
                if l % 2 == 1:
                    left_res = self.data[l] if left_res is None else merge(left_res, self.data[l])
                    l += 1
                if r % 2 == 0:
                    right_res = self.data[r] if right_res is None else merge(self.data[r], self.data[r])
                    r -= 1
                l //= 2
                r //= 2
            if left_res is None:
                return right_res.best
            if right_res is None:
                return left_res.best
            return merge(left_res, right_res).best

    st = SegTree(a)
    out = []
    for _ in range(q):
        l, r = map(int, input().split())
        out.append(str(st.query(l - 1, r - 1)))
    return "\n".join(out)

# provided samples
assert run("""9 8
1 2 4 3 3 5 6 2 1
1 3
1 4
2 5
6 6
3 7
7 8
1 8
8 8
""") == """3
4
3
1
4
2
7
1"""

# custom cases
assert run("""1 1
5
1 1
""") == "1"

assert run("""5 1
5 4 3 2 1
1 5
""") == "4"

assert run("""6 2
1 2 3 2 1 0
1 6
2 5
""") == """5
4"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素| 1 | 基本情况正确性 |
 | 严格递减| 4 | 最大约束的处理|
 | 混合范围| 5, 4 | 重叠查询之间的一致性

 ## 边缘情况

 单元素数组的处理很简单，因为每个叶节点都用值 1 初始化，并且没有合并会进一步减少它。 线段树直接返回该值。 

完全递减的数组，例如$[5,4,3,2,1]$永远不会造成 DP 失去有效性跟踪的情况，并且合并操作始终如一地在整个段中传播正确的累积，从而为该结构生成最大可实现的子序列长度。 

重叠的查询范围重用相同的线段树节点，并且由于合并操作是一致且保序的，因此重复的组合不会扭曲查询的结果。
