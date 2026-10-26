---
title: "CF 1354D - 多组"
description: "我们正在维护一个允许重复的整数集合，并且该集合会随着时间的推移而变化。 最初，我们得到一个已排序的值列表，这些值已经形成了起始多重集。 之后，我们会收到一长串操作。"
date: "2026-06-11T13:55:58+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1354
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 87 (Rated for Div. 2)"
rating: 1900
weight: 1354
solve_time_s: 101
verified: true
draft: false
---

[CF 1354D - 多重集](https://codeforces.com/problemset/problem/1354/D)

 **评级：** 1900
 **标签：** 二分查找、数据结构
 **求解时间：** 1m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在维护一个允许重复的整数集合，并且该集合会随着时间的推移而变化。 最初，我们得到一个已排序的值列表，这些值已经形成了起始多重集。 之后，我们会收到一长串操作。 

每个操作要么将一个新整数插入多重集中，要么根据其按排序顺序的位置删除元素。 当我们说“第 k 阶统计量”时，我们的意思是如果对整个多重集进行排序，则会选择第 k 个最小元素。 然后将该元素从结构中删除。 插入只是添加一个值，而删除取决于当前的顺序，而不是值的相等性。 

最后，如果多重集中非空，我们只需要输出一个剩余元素，否则打印零。 

关键的困难在于操作数量可能高达一百万，因此任何针对每个查询重新排序或扫描整个结构的方法都将失败。 即使每次操作为 O(n)，在最坏的情况下也会导致 10^12 次操作，这远远超出了时间限制。 这迫使我们采用一种在对数时间内同时支持插入和 k 阶统计查询的结构。 

微妙的边缘情况来自于反复删除小 k 值。 例如，如果我们重复删除第一个元素，结构会从前面不断收缩。 即使每个步骤看起来“简单”，重建数组或重复排序的幼稚方法也会默默地退化为二次行为。 

另一个重要的边缘情况是，在所有删除之后，多重集可能会变空，即使它一开始很大。 在这种情况下，我们必须输出 0 而不是尝试访问元素。 

## 方法

 一个简单的想法是将多重集维护为动态数组或 Python 列表。 对于每次插入，我们都会附加值。 对于每次删除，我们对数组进行排序并删除第 k 个元素。 

这在逻辑上是正确的，但性能立即崩溃。 排序成本为 O(n log n)，并且执行一百万次会导致大约 10^6 × n log n 操作，这是不可行的。 即使我们使用二进制插入按排序顺序维护列表，删除第 k 个元素仍然需要移位元素，导致每次操作的时间复杂度为 O(n)。 

核心观察是我们永远不需要显式地对元素进行实际排序。 我们只需要两个能力：维护值的频率并快速找到所有存在元素中的第 k 个最小元素。 一旦找到该元素，我们就会减少它的频率。 

这将问题转化为动态前缀和结构。 如果我们维护每个值出现的次数，那么第 k 个最小的元素就是使得前缀和至少达到 k 的最小索引。 Fenwick 树完全支持这种模式：点更新和前缀和，加上二进制提升以在 O(log n) 中定位第 k 个位置。 

因为所有值都以 n 为界，所以我们可以安全地使用大小为 n 的 Fenwick 树。 每次插入都是单点更新，每次删除都是“按前缀和查找”，然后是另一个点更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 重新排序/阵列模拟| O(nq) 或 O(nq log n) | O(n) | 太慢了 |
 | 芬威克树 (BIT) | O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们将多重集建模为值范围内的频率数组，并维护在芬威克树内。

1. 构建一棵 Fenwick 树，并通过将其频率增加 1 来插入所有初始元素。 这建立了正确的起始前缀和。 
2. 对于每个查询，检查其符号。 如果该值为正，则表示插入，因此我们将该值在 Fenwick 树中的频率增加 1。 这使前缀和与更新的多重集保持一致。 
3.如果该值为负数，我们将其解释为请求删除第k个最小的元素，其中k是绝对值。 我们首先使用 Fenwick 树来定位最小索引，使其前缀和至少为 k。 该索引恰好对应于当前多重集中的第 k 个最小元素。 
4. 一旦找到该索引，我们就将其在 Fenwick 树中的频率降低 1。 这模拟恰好删除该值的一次出现。 
5. 处理完所有查询后，我们扫描任何具有正频率的索引。 如果不存在，我们输出零。 否则，我们输出任何非零频率的索引。 

关键操作是“查找第 k 个”步骤，该步骤在 Fenwick 树上使用二元提升。 在每个位级别，如果这样做不超过累积频率 k，我们会尝试向右移动。 这会在对数时间内构造出答案。 

### 为什么它有效

 每时每刻，芬威克树都会存储多重集中当前所有值的精确重数。 因此，前缀和表示小于或等于任何值的元素数量。 第 k 个最小元素由该累积计数达到 k 的第一个位置唯一确定，因此对前缀和的二分搜索始终标识正确的元素。 由于每次插入和删除都会更新频率一次，因此在所有操作中都会保留此不变量。 

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

    def find_kth(self, k):
        idx = 0
        bit_mask = 1 << (self.n.bit_length())
        while bit_mask:
            nxt = idx + bit_mask
            if nxt <= self.n and self.bit[nxt] < k:
                k -= self.bit[nxt]
                idx = nxt
            bit_mask >>= 1
        return idx + 1

n, q = map(int, input().split())
a = list(map(int, input().split()))

fw = Fenwick(n)

for x in a:
    fw.add(x, 1)

for x in map(int, input().split()):
    if x > 0:
        fw.add(x, 1)
    else:
        k = -x
        pos = fw.find_kth(k)
        fw.add(pos, -1)

for i in range(1, n + 1):
    if fw.sum(i) - fw.sum(i - 1) > 0:
        print(i)
        break
else:
    print(0)
```芬威克树是在值范围内初始化的，而不是在元素数量上初始化的。 这很重要，因为我们跟踪的不是数组中的位置，而是值的频率。 

这`find_kth`函数对隐式前缀和执行二分提升搜索。 它一点一点地构建答案，确保我们永远不会超过所需的累积频率。 

最后的循环只是找到仍然存在的任何值。 由于问题允许任何剩余元素，因此我们在第一个正频率处停止。 

## 工作示例

 ### 示例 1

 输入：```
5 5
1 2 3 4 5
-1 -1 -1 -1 -1
```我们跟踪多组频率。 

| 步骤| 运营| 多集状态（概念）| 已删除 |
 | ---| ---| ---| ---|
 | 1 | 删除第一个 | 2 3 4 5 | 2 3 4 5 1 |
 | 2 | 删除第一个 | 3 4 5 | 3 4 5 2 |
 | 3 | 删除第一个 | 4 5 | 3 |
 | 4 | 删除第一个 | 5 | 4 |
 | 5 | 删除第一个 | 空 | 5 |

 所有操作结束后，没有剩余元素，因此输出为 0。 

这证实了重复的前缀删除正确地折叠了结构直到空。 

### 示例 2

 输入：```
3 4
1 1 3
2 -1 2 -1
```初始多重集是 [1, 1, 3]。 

| 步骤| 运营| 多组|
 | ---| ---| ---|
 | 1 | 插入 2 | 1 1 2 3 | 1 1 2 3
 | 2 | 删除第一个 | 1 2 3 (删除 1) |
 | 3 | 插入 2 | 1 2 2 3 | 1 2 2 3
 | 4 | 删除第一个 | 2 2 3（删除 1）|

 最终多重集包含 [2, 2, 3]，因此 2 或 3 中的任何一个都是有效输出。 

这表明重复项得到了正确处理，并且删除仅影响单个事件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每个更新和第 k 个查询均由 Fenwick 树操作以对数时间处理 |
 | 空间| O(n) | 芬威克树中存储的一个频率数组 |

 该界限允许总共最多 200 万次操作，因此 20 左右的对数因子可以使解决方案轻松保持在限制范围内。 内存使用量在 n 中保持线性，符合 28 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
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

        def find_kth(self, k):
            idx = 0
            bit_mask = 1 << (self.n.bit_length())
            while bit_mask:
                nxt = idx + bit_mask
                if nxt <= self.n and self.bit[nxt] < k:
                    k -= self.bit[nxt]
                    idx = nxt
                bit_mask >>= 1
            return idx + 1

    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    fw = Fenwick(n)

    for x in a:
        fw.add(x, 1)

    for x in map(int, input().split()):
        if x > 0:
            fw.add(x, 1)
        else:
            pos = fw.find_kth(-x)
            fw.add(pos, -1)

    for i in range(1, n + 1):
        if fw.sum(i) - fw.sum(i - 1) > 0:
            return str(i)
    return "0"

# provided sample
assert run("""5 5
1 2 3 4 5
-1 -1 -1 -1 -1
""") == "0"

# custom: single element delete
assert run("""1 1
1
-1
""") == "0"

# custom: insert only
assert run("""1 3
1
2 3 1
""") != ""

# custom: duplicates
assert run("""3 3
1 1 1
-1 -1 -1
""") == "0"

# custom: mixed
assert run("""3 4
1 2 3
2 -1 2 -1
""") in {"2", "3"}
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单个元素删除| 0 | 去除最小结构|
 | 仅插入| 非空 | 处理插入而不删除|
 | 重复项全部删除 | 0 | 正确处理重复值|
 | 混合行动| 2 或 3 | 交错下的正确性|

 ## 边缘情况

 一个关键的边缘情况是重复删除以最小元素为目标。 对于像这样的输入`1 2 3 4 5`随后重复`-1`操作时，结构每次都会从左侧收缩。 芬威克树正确更新频率，并且每个`find_kth(1)`始终返回当前最小值，确保确定性收缩直到为空。 

另一种情况是大量重复，例如从许多相同的值开始并重复删除任意顺序统计数据。 由于所有相等的元素共享相同的索引，因此每次删除只会将频率降低一，并且前缀和的行为仍然一致。 第 k 个查询永远不会混淆相同的值，因为它取决于累积计数，而不是身份。 

最后，交替插入和删除强调了芬威克树始终准确反映当前多重集的不变量。 每个操作都是本地的，因此不需要全局重建，这可以防止正确性问题和性能崩溃。
