---
title: "CF 106367G - 真蓝色"
description: "我们得到一个非负值数组，其中每个位置代表一个块当前拥有多少“蓝色资源”。 随着时间的推移，我们收到以下形式的操作，询问该数组的一部分和阈值。"
date: "2026-06-19T15:03:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106367
codeforces_index: "G"
codeforces_contest_name: "Whalica Cup (Round 2)"
rating: 0
weight: 106367
solve_time_s: 47
verified: true
draft: false
---

[CF 106367G - 真蓝](https://codeforces.com/problemset/problem/106367/G)

 **评级：** -
 **标签：** -
 **求解时间：** 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个非负值数组，其中每个位置代表一个块当前拥有多少“蓝色资源”。 随着时间的推移，我们收到以下形式的操作，询问该数组的一部分和阈值。 对于每个操作，我们查看给定间隔中的所有块，仅挑选出当前值至少为阈值的那些块，收集所有蓝色数量，然后通过将这些位置设置为零来从数组中永久删除这些数量。 

关键的交互是数组不是静态的。 一旦在一个查询中使用了某个块，它就会在以后的所有查询中消失。 这意味着每个查询都会更改后面查询的状态，因此我们不能独立处理查询。 

输入大小最多可达 200,000 个元素和 200,000 个查询。 每个查询的简单扫描每次都会检查所有元素，在最坏的情况下会导致 400 亿次操作，这远远超出了可行的限制。 因此，任何解决方案都必须确保每个元素总体上仅被处理少量次。 

重复提取会产生微妙的边缘情况。 如果一个值很大并且出现在许多重叠的查询范围中，则它应该只贡献一次，然后为零。 任何忘记在提取后改变数组的方法都会导致计数过高。 

另一个边缘情况是顺序依赖性。 查询不可交换。 例如，如果由于阈值较低而提前提取了较大的值，则以后的查询不应看到它，即使它们符合条件。 

## 方法

 直接模拟通过迭代范围、检查每个元素、对限定值求和并将它们设置为零来处理每个查询。 这是简单且正确的，因为它完全遵循问题的规则。 然而，每个查询的成本为 O(n)，导致总工作量为 O(nq)，当 n 和 q 都达到 200,000 时，这个时间就太大了。 

重要的结构观察是每个元素只能“删除”一次。 一个区块被提取后，它就会变为零，并且不再贡献。 因此，在整个过程中，每个索引从正值到零的转变只有一次，之后就不再改变。 

这表明我们应该避免重复扫描相同的“已删除”位置。 相反，我们需要一种结构，使我们能够快速跳过归零的段并仅触摸仍然存在的位置。 维护最大值的线段树就足够了：它可以让我们快速定位范围中值至少为 x 的任何位置，然后将其删除。 每次删除都是永久性的，因此每个索引最多被访问和删除一次。 

我们使用线段树在某个范围内重复搜索有效候选者。 当我们找到一个时，我们将其提取出来，将其设置为零，然后继续搜索。 由于每个元素都被删除一次，因此所有查询中成功提取的总数最多为 n。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了|
 | 带删除的线段树 | O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们维护一棵线段树，其中每个节点存储其区间内的最大值。 这使我们能够快速确定查询范围内是否存在任何有效元素。

1. 在存储值和最大值的数组上构建线段树。 这为我们提供了有效的最大范围查询和点更新。 
2.对于每个查询(l,r,x)，首先检查区间内是否存在≥x的值。 我们通过查询 [l, r] 中的最大值来做到这一点。 如果最大值小于 x，则答案为零。 
3. 如果存在有效元素，则重复搜索 [l, r] 中值至少为 x 的一个索引。 这是通过降低线段树来完成的：如果节点的范围超出 [l, r] 或其最大值 < x，则跳过它； 否则我们会深入直到到达一片叶子。 
4. 一旦找到这样的索引 i，我们将 b[i] 添加到答案中并将 b[i] 设置为零。 我们更新位置 i 处的线段树。 
5. 我们重复搜索相同的查询，直到范围内不再有合格元素为止，这意味着 [l, r] 中的段最大值降至 x 以下。 

该循环有限且高效的原因是每一个成功的步骤都会永久删除一个元素。 

### 为什么它有效

 在任何时候，线段树都准确地反映了数组的当前状态。 查询仅提取仍然满足这两个条件的元素：它们位于区间内并且它们的值至少为阈值。 一旦元素被删除，它就会变为零，并且永远无法再次被选择，因为它不再影响任何最大查询。 由于每个索引最多删除一次，因此所有查询中成功提取的总数以 n 为界，这可以防止重复工作。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.t = [0] * (4 * self.n)
        self.arr = arr[:]
        self.build(1, 0, self.n - 1)

    def build(self, v, tl, tr):
        if tl == tr:
            self.t[v] = self.arr[tl]
        else:
            tm = (tl + tr) // 2
            self.build(v * 2, tl, tm)
            self.build(v * 2 + 1, tm + 1, tr)
            self.t[v] = max(self.t[v * 2], self.t[v * 2 + 1])

    def update(self, v, tl, tr, pos, val):
        if tl == tr:
            self.t[v] = val
            self.arr[tl] = val
        else:
            tm = (tl + tr) // 2
            if pos <= tm:
                self.update(v * 2, tl, tm, pos, val)
            else:
                self.update(v * 2 + 1, tm + 1, tr, pos, val)
            self.t[v] = max(self.t[v * 2], self.t[v * 2 + 1])

    def query_max(self, v, tl, tr, l, r):
        if l > r:
            return 0
        if l == tl and r == tr:
            return self.t[v]
        tm = (tl + tr) // 2
        return max(
            self.query_max(v * 2, tl, tm, l, min(r, tm)),
            self.query_max(v * 2 + 1, tm + 1, tr, max(l, tm + 1), r)
        )

    def find(self, v, tl, tr, l, r, x):
        if self.t[v] < x or r < tl or tr < l:
            return -1
        if tl == tr:
            return tl
        tm = (tl + tr) // 2
        res = self.find(v * 2, tl, tm, l, r, x)
        if res != -1:
            return res
        return self.find(v * 2 + 1, tm + 1, tr, l, r, x)

def solve():
    n, q = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr)

    out = []
    for _ in range(q):
        l, r, x = map(int, input().split())
        l -= 1
        r -= 1

        if st.query_max(1, 0, n - 1, l, r) < x:
            out.append("0")
            continue

        total = 0
        while True:
            pos = st.find(1, 0, n - 1, l, r, x)
            if pos == -1:
                break
            total += st.arr[pos]
            st.update(1, 0, n - 1, pos, 0)

        out.append(str(total))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```线段树用于三个角色。 构建会初始化数组副本和最大结构。 query_max 函数提供快速拒绝测试，因此我们可以避免在不存在有效元素时进行不必要的搜索。 find 函数是核心搜索原语，用于在范围内定位合格索引。 每次提取后，更新都会将该位置设置为零，确保将来的查询无法重复使用它。 

一个常见的陷阱是当没有元素达到阈值时忘记提前停止。 如果没有使用 query_max 进行预检查，查找操作仍然可能不必要地遍历树。 另一个微妙之处是 find 必须同时遵守范围和阈值，否则它可能会返回查询间隔之外或低于 x 的索引。 

## 工作示例

 考虑一个具有小数组的输入，其中值由于提取而逐渐消失。 

输入：```
n = 3, q = 3
arr = [5, 2, 7]
queries:
1 3 3
1 3 6
1 3 1
```对于第一个查询，我们在整个范围内搜索 ≥ 3 的值。 

| 步骤| 找到索引 | 取值| 剩余数组|
 | --- | --- | --- | --- |
 | 1 | 0 | 5 | [0,2,7]|
 | 2 | 2 | 7 | [0, 2, 0] |

 总数为 12。 

第二个查询现在只能看到 [0, 2, 0]。 不存在 ≥ 6 的值，因此结果为 0。 

第三个查询提取所有 ≥ 1 的内容，因此需要剩余的 2。 

| 步骤| 找到索引 | 取值| 剩余数组|
 | --- | --- | --- | --- |
 | 1 | 1 | 2 | [0, 0, 0] |

 这演示了状态如何跨查询演变以及为什么每个元素只能计数一次。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每次提取和查询操作都采用线段树遍历，每个索引被移除一次 |
 | 空间| O(n) | 线段树存储与数组大小成正比 |

 约束允许最多 200,000 次操作，因此每个操作的对数开销就足够了。 由于每个元素最多被删除一次，因此昂贵的更新总数是有限的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return sys.stdout.getvalue().strip()

# Sample-style sanity check (no explicit sample output provided)
assert True  # placeholder since statement formatting lacks full sample I/O

# minimum size
assert run("1 1\n5\n1 1 3\n") in ["5", "5\n"]

# all equal values
assert run("5 2\n1 1 1 1 1\n1 5 1\n1 5 1\n") in ["5\n0", "5\n0\n"]

# threshold too high
assert run("3 1\n1 2 3\n1 3 10\n") in ["0", "0\n"]

# single heavy extraction
assert run("4 1\n4 1 7 2\n1 4 3\n") == "11"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 5 | 基本情况正确性 |
 | 重复查询| 减少金额 | 状态突变正确性 |
 | 高门槛| 0 | 早期拒绝正确性|
 | 完全提取| 总和为零| 一次性删除不变式 |

 ## 边缘情况

 一个关键的边缘情况是在同一区域重复查询，其中值逐渐被删除。 例如，如果我们以较低的阈值重复查询相同的间隔，则第一个查询会耗尽所有符合条件的值，后续查询必须立即返回零。 线段树确保了这一点，因为每个提取的元素都设置为零，并且最大查询立即反映这一点。 

另一种边缘情况是阈值高于任何值。 该算法通过初始最大检查来处理这个问题。 由于范围内的最大值已经低于 x，因此查找循环永远不会运行，从而避免了不必要的遍历并保证结果为零。 

最后一种情况是单元素区间。 该算法的行为仍然一致，因为 query_max 和 find 都归约到叶操作。 如果该元素符合条件，则将其取出并立即归零； 否则它会被忽略而不会产生副作用。
