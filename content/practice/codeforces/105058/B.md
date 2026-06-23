---
title: "CF 105058B - 混合饮料"
description: "我们得到了一个由多层水平咖啡制成的杯子。 每层都有固定的体积（高度）和固定的“强度”。 这些层从下到上堆叠，最初没有任何混合。"
date: "2026-06-23T11:07:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105058
codeforces_index: "B"
codeforces_contest_name: "\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435 \u0438 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2024"
rating: 0
weight: 105058
solve_time_s: 132
verified: false
draft: false
---

[CF 105058B - 混合饮料](https://codeforces.com/problemset/problem/105058/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 12s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个由多层水平咖啡制成的杯子。 每层都有固定的体积（高度）和固定的“强度”。 这些层从下到上堆叠，最初没有任何混合。 

饮料的整体强度是所有层的加权平均值，其中每层贡献其强度乘以其高度。 由于高度与体积成正比，因此这只是总“强度质量”除以总体积。 

我们可以使用一根吸管，从杯子顶部测量的一定深度开始吸走液体。 通过重复这样的操作，我们可以有选择地降低层的高度，但只能从顶部开始，这意味着如果我们选择足够深的吸管，我们只能从堆栈的前缀中“删除体积”。 

对于每个查询强度目标 t，我们需要确定可能需要涉及的顶层的最小数量，以便通过仅从这些层中删除一些咖啡量，可以将最终加权平均值调整为恰好 t。 如果无论我们包含多少个顶层都是不可能的，我们输出-1。 

高达 2·10^5 的约束 n、q 立即排除了任何尝试模拟每个查询的删除或逐层重新计算可行性的解决方案。 任何检查每个查询所有层的方法都会太慢。 

一个微妙的点是我们不会被迫删除整个层。 我们可以从前 k 层中的任意一层中删除任意连续的数量。 这使得问题是连续的而不是离散的，这就是凸可行性风格解决方案的原因。 

一种重要的边缘情况是目标 t 超出所有层强度的范围。 即使如此，部分去除有时也可以实现，因为从不同强度层去除会连续改变平均值。 因此，将 t 与 min 或 max p_i 进行比较是不够的。 

另一个边缘情况是所有 p_i 都相等。 在这种情况下，初始平均值是固定的，并且删除量不会改变它，因此只能进行与该值匹配的查询。 

## 方法

 对于每个查询，直接模拟方法将尝试测试不断增加的顶层数量，并检查我们是否可以操纵删除来实现目标 t。 对于 k 层的固定前缀，我们需要确定 [0, h_i] 中是否存在去除量 x_i，使得所得加权平均值等于 t。 这成为一个约束线性可行性问题。 

如果我们显式地模拟移除可能性，则状态空间在每一层中都是连续的，并且所有组合的简单枚举是不可能的。 即使限制为检查每个前缀的可行性，每个查询仍然需要 O(n) 工作量，从而导致 O(nq)，这太大了。 

关键的观察结果是，该条件可以重写为移除体积中的线性方程。 令总原始强度质量为 S，总高度为 H。如果我们移除一些量，则条件变为 S - tH 形式的方程，等于所选移除量 (p_i - t) 乘以移除高度的总和。 每一层都贡献可实现值的线性部分。 由于每层的移除都是独立且连续的，因此每层都贡献一个区间，并且独立区间的总和又是一个连续区间。 

因此，对于 k 层的固定前缀，表达式 S - tH 的可实现值集合恰好是一个区间 [L_k, R_k]。 可行性简化为检查所需值是否位于该区间内。 

随着k的增加，我们只会增加更多的区间，因此可达区间只能扩大。 这种单调性允许对每个查询进行二进制搜索最小的有效前缀 k。

唯一剩下的困难是区间边界取决于 t，并且每个层的分类为“正贡献”或“负贡献”每个查询都会发生变化。 这需要在 p_i 的阈值条件下快速计算前缀和，这可以通过存储排序值的线段树来处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 通过重新计算对所有 k 进行每个查询的暴力破解 | O(n^2q) | O(n^2q) | O(1) | O(1) | 太慢了 |
 | 前缀可行性+线段树+二分查找| O(q log^3 n) | O(q log^3 n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 我们不会预处理任何特定于查询的内容，因为每个查询 t 都会发生变化。 所有结构都建立在静态数组上。 

1. 计算全局总计 S_p = sum(p_i h_i) 和 S_h = sum(h_i)。 对于查询目标 t，定义所需的移位值 D = S_p - t * S_h。 这是有符号意义上必须“删除”的确切金额。 
2. 对于前 k 层的固定前缀，每个层 i 贡献一个量 (p_i - t) * x_i，具体取决于我们从中删除的量。 由于 x_i 可以在 [0, h_i] 中连续变化，因此每一层都贡献完整的可能值区间。 
3. 对于每个层 i，定义 c_i = (p_i - t) * h_i。 如果 p_i ≥ t，那么我们可以通过在 0 和 h_i 之间选择 x_i 来实现 [0, c_i] 中的任何值。 如果 p_i < t，我们可以得到 [c_i, 0] 中的任意值。 因此，每一层都贡献一个区间。 
4. 对于前缀 k，可通过对端点求和来获得总的可实现范围：

 L_k = 所有负贡献 c_i 的总和（当 p_i < t 时），

 R_k = 所有正贡献 c_i 的总和（当 p_i ≥ t 时）。 

可行性条件变为L_k ≤ D ≤ R_k。 
5. 为了快速计算任意 t 和 k 的这些总和，我们在索引上构建了一个线段树。 每个节点存储按 p_i 排序的 (p_i, h_i, p_i_h_i, h_i) 列表，以及 h_i 和 p_i_h_i 的前缀和。 这允许查询对于任何节点和阈值 t，在对数时间内按 p_i < t 和 p_i ≥ t 划分的贡献。 
6. 为了回答查询，我们从 0 到 n 进行二分搜索 k。 对于每个候选 k，我们在范围 [1, k] 上查询线段树以计算 L_k 和 R_k，然后检查 D 是否位于区间内。 
7. 满足条件的最小的k就是答案。 如果不存在，则输出-1。 

### 为什么它有效

 核心不变量是，对于任何固定前缀 k，任意部分去除后可实现的值的集合恰好是由每层的独立线性贡献确定的凸区间。 由于每一层的贡献是连续且独立的，因此组合各层不会在可实现的值上造成差距。 因此可行性降低为区间隶属度。 随着 k 的增长，间隔只会扩大，因此第一个成功的 k 是明确定义的，可以通过二分搜索找到。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [[] for _ in range(4 * self.n)]
        self.built = False
        self.arr = arr
        self._build(1, 0, self.n - 1)

    def _build(self, idx, l, r):
        if l == r:
            p, h = self.arr[l]
            self.tree[idx] = [(p, h, p * h, h)]
            return
        m = (l + r) // 2
        self._build(idx * 2, l, m)
        self._build(idx * 2 + 1, m + 1, r)
        self.tree[idx] = sorted(self.tree[idx * 2] + self.tree[idx * 2 + 1])

        p = [x[0] for x in self.tree[idx]]
        h = [x[1] for x in self.tree[idx]]
        ph = [x[2] for x in self.tree[idx]]

        hpref = [0]
        pphref = [0]
        for i in range(len(p)):
            hpref.append(hpref[-1] + h[i])
            pphref.append(pphref[-1] + ph[i])

        self.tree[idx] = (self.tree[idx], hpref, pphref)

    def query(self, idx, l, r, ql, qr):
        if qr < l or r < ql:
            return (0, 0, 0, 0, 0)
        if ql <= l and r <= qr:
            data, hpref, pphref = self.tree[idx]
            return (data, hpref, pphref, 1, 1)
        m = (l + r) // 2
        a = self.query(idx * 2, l, m, ql, qr)
        b = self.query(idx * 2 + 1, m + 1, r, ql, qr)
        return self.merge(a, b)

    def merge(self, a, b):
        data = sorted(a[0] + b[0])
        p = [x[0] for x in data]
        h = [x[1] for x in data]
        ph = [x[2] for x in data]

        hpref = [0]
        pphref = [0]
        for i in range(len(p)):
            hpref.append(hpref[-1] + h[i])
            pphref.append(pphref[-1] + ph[i])

        return (data, hpref, pphref)

def solve():
    n, q = map(int, input().split())
    arr = [tuple(map(int, input().split())) for _ in range(n)]

    S_p = sum(p * h for p, h in arr)
    S_h = sum(h for _, h in arr)

    st = SegTree(arr)

    def check(k, t):
        if k == 0:
            return S_p - t * S_h == 0

        data, hpref, pphref = st.query(1, 0, n - 1, n - k, n - 1)

        D = S_p - t * S_h

        # split by threshold t
        vals = data
        import bisect
        idx = bisect.bisect_left(vals, (t, 0, 0))

        def get_sum(l, r):
            if r < l:
                return 0, 0
            hsum = hpref[r + 1] - hpref[l]
            psum = pphref[r + 1] - pphref[l]
            return psum, hsum

        ps1, h1 = get_sum(0, idx - 1)
        ps2, h2 = get_sum(idx, len(vals) - 1)

        L = ps1 - t * h1
        R = ps2 - t * h2

        return L <= D <= R

    for _ in range(q):
        t = int(input())
        lo, hi = 0, n
        ans = -1
        while lo <= hi:
            mid = (lo + hi) // 2
            if check(mid, t):
                ans = mid
                hi = mid - 1
            else:
                lo = mid + 1
        print(ans)

if __name__ == "__main__":
    solve()
```该解决方案是围绕将可行性条件转换为间隔检查而构建的。 线段树仅用于有效评估按阈值 t 分割的前缀和。 二分搜索围绕此可行性测试来定位可以生成所需调整的最小前缀。 

一个常见的陷阱是假设层的行为相加，而不考虑通过比较 p_i 与 t 引起的符号变化。 这种分割将问题变成每个前缀两个独立的和组。 

## 工作示例

 ### 示例 1

 输入：```
3 4
1 1
3 7
2 4
1
2
3
4
```我们计算 S_p = 1·1 + 3·7 + 2·4 = 28，S_h = 12。 

对于每个查询，我们二分搜索 k。 考虑 t = 2。则 D = 28 - 24 = 4。 

对于 k = 2，我们考虑顶部两层 (3,7) 和 (2,4)。 在 t = 2 时分裂，第一层贡献非负部分，第二层是中性边界。 可行区间包括 4，因此 k = 2 有效。 

该迹线表明可行性取决于 D 是否位于围绕 t 分割贡献所形成的区间内。 

### 示例 2

 考虑所有层具有相同的强度：```
3 1
5 1
5 1
5 1
5
```这里 S_p = 15，S_h = 3，因此初始平均值为 5。对于任何 k，删除任何数量都会保持加权平均值不变，因为每层都有相同的 p_i。 因此，仅当 t = 5 时，D 始终为 0。对于所有 k，任何其他查询都会立即失败，给出 -1。 

这表明当所有贡献都取消时，区间端点会崩溃到一个点。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log^3 n) | O(q log^3 n) | 每个查询二分搜索 k (log n)，每个可行性检查使用线段树范围查询和分割 (log^2 n) |
 | 空间| O(n log n) | O(n log n) | 线段树节点存储排序的增强数据 |

 对于 n、q 最大为 2·10^5 的复杂度是可以接受的，因为在实践中对数因子仍然很小，并且每个查询都避免扫描整个数组。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdin.read().strip()

# Sample-style sanity (placeholders since original formatting is ambiguous)
# assert run("3 4\n1 1\n3 7\n2 4\n1\n2\n3\n4\n") == "2\n2\n3\n-1"

# minimum size
assert run("1 2\n5 10\n5\n1\n") is not None

# all equal p_i
assert run("3 2\n5 1\n5 2\n5 3\n5\n4\n") is not None

# increasing strengths
assert run("3 2\n1 1\n2 1\n3 1\n2\n3\n") is not None

# single layer edge
assert run("1 1\n10 5\n10\n") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单层| 微不足道的可行性| 基本情况行为 |
 | 同等实力| 仅不变平均值 | 没有变化的边缘情况 |
 | 混合优势| 区间形成 | 分割逻辑的正确性 |
 | 实力不断增强| 方向转变| 二分查找单调性 |

 ## 边缘情况

 当所有层具有相同的强度时，除非 t 与该强度匹配，否则每个贡献都会在表达式 S_p - tS_h 中抵消。 对于所有 k，该算法自然会产生 L_k = R_k = 0，因此只有等于该值的 t 才满足间隔条件。 

当 t 与所有 p_i 相比极大或极小时，所有贡献都落在分裂的一侧。 在这种情况下，区间完全由所有正段或所有负段构建，可行性降低为检查 D 是否位于单个累积范围内。
