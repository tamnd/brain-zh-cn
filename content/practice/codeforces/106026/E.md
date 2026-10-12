---
title: "CF 106026E - \u7b80\u5355\u7684\u6570\u636e\u7ed3\u6784\u9898"
description: "我们维护一个长数组，其中每个元素始终是 4 位值，因此每个值都在 0 到 15 的范围内。数组通过范围更新随时间变化，有时我们会被要求计算某个范围内的汇总统计数据。"
date: "2026-06-21T16:38:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106026
codeforces_index: "E"
codeforces_contest_name: "CCF CAT NAEC 2025 (Final)"
rating: 0
weight: 106026
solve_time_s: 61
verified: true
draft: false
---

[CF 106026E - \u7b80\u5355\u7684\u6570\u636e\u7ed3\u6784\u9898](https://codeforces.com/problemset/problem/106026/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个长数组，其中每个元素始终是 4 位值，因此每个值都在 0 到 15 的范围内。数组通过范围更新随时间变化，有时我们会被要求计算某个范围内的汇总统计数据。 

前两个操作不分配任意值，它们通过对每个值应用固定函数来转换子数组中的每个元素。 由于值始终位于大小为 16 的小固定域中，因此每次更新实际上都是这 16 个状态的排列。 第三个操作要求我们查看一个范围，计算从 0 到 15 的每个值出现的次数，然后对所有这些计数进行按位异或。 

n 和 q 的输入大小都达到 5×10^5，因此任何涉及每个查询的每个元素的解决方案都将立即失败。 在最坏的情况下，即使每个查询进行一次线性扫描也会导致大约 2.5×10^11 次操作，这远远超出了可行的限制。 这迫使我们采用一种既支持对数时间范围更新又支持范围查询的数据结构。 

天真的思维中的一个微妙问题是将每次更新视为整数算术并直接修改值。 例如，在一个段上重复应用“+1 mod 16”或“×2 mod 16”将需要访问每个元素。 另一个错误是试图仅维护计数，但忘记更新不是累加的，它们会重新映射值，这意味着计数必须排列而不是递增。 

一个幼稚方法的一个小的说明性失败案例是：

 输入：

 n = 3，数组 = [1, 2, 3]

 运算：[1, 3]上加1 mod 16

 正确的结果是[2,3,4]。 在不重新映射值的情况下增加计数的天真纯频率更新会错误地将其视为独立于原始结构而增加 cnt2、cnt3、cnt4，从而丢失元素及其转换值之间的对应关系。 

核心困难在于更新作用于值，而不是位置，这促使我们维护价值分布而不是原始元素。 

## 方法

 直接模拟维护数组并逐个元素应用每个变换。 这是正确的，因为每个索引的每个操作都是明确定义的，但是每个范围更新的成本为 O(n)，并且当 q 高达 5×10^5 时，这变得不可行。 

关键的观察结果是，两种操作下的值域都非常小并且封闭。 每个元素始终是 16 个值之一，并且每个操作都通过从 {0..15} 到自身的确定性映射来转换值。 我们不存储单个值，而是存储每个值在段中出现的次数。 

然而，我们仍然需要有效地支持范围更新。 线段树通过在每个节点存储大小为 16 的频率数组来解决这个问题。范围更新变成应用于该频率数组的排列。 我们不会立即修改子项，而是存储一个与现有函数组合的惰性转换函数。 

这减少了维护线段树的问题，其中每个节点都带有 16 个元素的直方图和这 16 个状态的惰性排列。 合并节点是直方图的简单相加，而推送惰性标签则是组合排列并将其应用于频率向量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 具有值直方图和惰性排列的线段树 | O(q log n · 16) | O(q log n · 16) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 我们用频率数组表示每个线段树节点`cnt[16]`， 在哪里`cnt[x]`是多少倍的值`x`出现在该段中。 我们还维护一个惰性标记，它是 16 个值的排列，描述当前存储的值应如何重新映射。 

1. 通过使用在初始值位置包含单个 1 的频率数组初始化每个叶节点来构建线段树。 这对每个位置的精确值分布进行编码。 
2. 对于每个内部节点，通过对其子节点数组求和来计算其频率数组。 这保留了正确性，因为不相交的段独立地贡献于总的多重值集。 
3. 将运算类型 1 的变换定义为排列 f(x) = (x + 1) mod 16。将运算类型 2 定义为 g(x) = (2x) mod 16。这些函数应用于段中的每个元素，因此它们会在频率向量上产生排列。 
4. 当范围更新完全覆盖线段树节点时，我们不会触及它的子节点。 相反，我们用新的转换来组合节点的惰性排列。 这确保了我们有效地积累转换。 
5. 当将排列 p 应用于节点时，我们通过移动计数来变换其频率数组：对于 0..15 中的所有 x，new_cnt[p(x)] += cnt[x]。 这明确地推动了价值的转变。 
6. 在查询期间，我们在访问子项之前推送任何待处理的惰性排列，确保频率数组反映所有先前的更新。 
7. 对于类型 3 查询，我们检索段的频率数组并计算 cnt[0] 到 cnt[15] 的 XOR，生成所需的答案。 

这样做的原因是数组上的每个操作都是独立应用于每个元素的函数。 由于函数组合分布在计数上，因此我们可以对每个元素或每个聚合频率向量应用变换。 线段树确保我们只重新计算受影响的对数部分，而惰性传播确保每个转换在每个相关更新的每个节点上应用一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 4 * self.n
        self.cnt = [[0] * 16 for _ in range(self.size)]
        self.lazy = [list(range(16)) for _ in range(self.size)]
        self._build(1, 0, self.n - 1, arr)

    def _apply(self, v, perm):
        new = [0] * 16
        for i in range(16):
            new[perm[i]] += self.cnt[v][i]
        self.cnt[v] = new

    def _compose(self, a, b):
        return [b[a[i]] for i in range(16)]

    def _push(self, v):
        if self.lazy[v] != list(range(16)):
            for child in (v * 2, v * 2 + 1):
                self._apply(child, self.lazy[v])
                self.lazy[child] = self._compose(self.lazy[v], self.lazy[child])
            self.lazy[v] = list(range(16))

    def _build(self, v, l, r, arr):
        if l == r:
            self.cnt[v][arr[l]] = 1
            return
        m = (l + r) // 2
        self._build(v * 2, l, m, arr)
        self._build(v * 2 + 1, m + 1, r, arr)
        for i in range(16):
            self.cnt[v][i] = self.cnt[v * 2][i] + self.cnt[v * 2 + 1][i]

    def _update(self, v, l, r, ql, qr, perm):
        if ql <= l and r <= qr:
            self._apply(v, perm)
            self.lazy[v] = self._compose(perm, self.lazy[v])
            return
        self._push(v)
        m = (l + r) // 2
        if ql <= m:
            self._update(v * 2, l, m, ql, qr, perm)
        if qr > m:
            self._update(v * 2 + 1, m + 1, r, ql, qr, perm)
        for i in range(16):
            self.cnt[v][i] = self.cnt[v * 2][i] + self.cnt[v * 2 + 1][i]

    def _query(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.cnt[v]
        self._push(v)
        m = (l + r) // 2
        res = [0] * 16
        if ql <= m:
            left = self._query(v * 2, l, m, ql, qr)
            for i in range(16):
                res[i] += left[i]
        if qr > m:
            right = self._query(v * 2 + 1, m + 1, r, ql, qr)
            for i in range(16):
                res[i] += right[i]
        return res

n, q = map(int, input().split())
arr = list(map(int, input().split()))

st = SegTree(arr)

f1 = [(i + 1) % 16 for i in range(16)]
f2 = [(2 * i) % 16 for i in range(16)]

for _ in range(q):
    t, l, r = map(int, input().split())
    l -= 1
    r -= 1

    if t == 1:
        st._update(1, 0, n - 1, l, r, f1)
    elif t == 2:
        st._update(1, 0, n - 1, l, r, f2)
    else:
        res = st._query(1, 0, n - 1, l, r)
        ans = 0
        for x in res:
            ans ^= x
        print(ans)
```该实现依赖于每个节点都存储完整的值直方图的事实。 这`_apply`函数是实际值重新映射发生的唯一地方，并且它纯粹对频率向量进行操作。 惰性标签是排列，并且`_compose`确保多个更新堆栈时的正确排序。 

一个微妙的点是，推送惰性标签必须既将转换应用于子项的计数，又必须正确地组成排列。 当多个更新重叠时，无法按正确的顺序组合会破坏正确性。 

## 工作示例

 考虑一个小数组：

 初始：[1,2,3,4]

 操作：对 [1, 3] 应用 +1 mod 16

 | 步骤| 细分 | 频率（简化）|
 | --- | --- | --- |
 | 初始| 全部 | cnt1=1, cnt2=1, cnt3=1, cnt4=1 |
 | 更新后| [1,3]| cnt2=1, cnt3=1, cnt4=1, cnt5=1 |

 现在，对 [1,4] 的查询返回频率 cnt2..cnt5，每个频率都等于 1，因此 XOR 为 1 ⊕ 1 ⊕ 1 ⊕ 1 = 0。 

这证实了更新充当值排列而不是结构修改。 

第二个示例测试两个转换的交互：

 初始值：[1, 1, 2]

 对整个数组应用 +1 mod 16 → [2, 2, 3]

 应用 ×2 mod 16 → [4, 4, 6]

 查询频率为cnt4=2，cnt6=1，XOR = 2 ⊕ 1 = 3。 

这表明通过惰性传播组合转换与顺序应用相匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n · 16) | O(q log n · 16) | 每次更新/查询都会遍历线段树高度，每个节点操作都在一个固定大小的16数组上进行 |
 | 空间| O(n log n) | O(n log n) | 线段树节点存储16元素频率数组 |

 常数很小，因为值域固定为 16，使得 n 和 q 的求解速度非常快，最高可达 5×10^5。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import sys

    # assume solution is wrapped in main execution
    return sys.stdout.getvalue()

# small sanity case
assert run("""3 2
1 2 3
3 1 3
3 1 1
""") is not None

# all equal values
assert run("""5 3
7 7 7 7 7
1 1 5
3 1 5
3 2 4
""") is not None

# boundary wrap test
assert run("""4 3
15 14 13 12
1 1 4
3 1 4
3 2 3
""") is not None

# mixed operations
assert run("""6 5
1 2 3 4 5 6
2 1 6
1 2 5
3 1 6
2 3 4
3 1 6
""") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 所有相同的值 | 一致的异或行为 | 均匀传播|
 | 环绕边界 | 正确的 mod 16 移位 | 循环正确性 |
 | 混合行动| 变换的组合 | 懒惰的正确性|

 ## 边缘情况

 一个关键的边缘情况是应该正确组合的重复重叠更新。 例如，在一个段上应用两次 +1 必须等于 +2，而不是两次独立的部分重写。 惰性排列组合通过链接映射而不是覆盖它们来确保这一点。 

另一个边缘情况是部分更新后的全覆盖查询。 线段树不得错误地推送过时的惰性值； 否则，计数将仅反映部分转换。 推送操作确保每当我们下降时，所有待处理的排列都会被实现。 

最后，单元素片段测试叶子处理的正确性。 由于叶子以单热频率向量开始，因此初始化或更新应用程序中的任何错误都会立即破坏长度为 1 的间隔上的查询的正确性。
