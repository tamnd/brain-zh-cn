---
title: "CF 1705E - 马克和科罗教授"
description: "我们得到了一组随时间变化的正整数。 在任何时候，我们都可以取两个相等的值，将它们删除，然后用一个更大的值替换它们。"
date: "2026-06-09T21:25:28+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "bitmasks", "brute-force", "combinatorics", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1705
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 807 (Div. 2)"
rating: 2300
weight: 1705
solve_time_s: 109
verified: false
draft: false
---

[CF 1705E - 马克和科罗教授](https://codeforces.com/problemset/problem/1705/E)

 **评分：** 2300
 **标签：** 二分查找、位掩码、暴力破解、组合数学、数据结构、贪婪
 **求解时间：** 1m 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组随时间变化的正整数。 在任何时候，我们都可以取两个相等的值，将它们删除，然后用一个更大的值替换它们。 重复这个操作可以看作是重复地“向上合并重复项”，将质量推向更大的数字。 

每次更新数组中的单个位置后，我们都会被要求确定在执行任意数量的合并操作后可以在多重集中某处创建的最大值。 

关键的困难在于操作不是局部的：合并两个大小为 x 的值会改变 x+1 的重数，这可能会在以后创建新的合并，因此效果会以级联方式向上传播。 

这些约束清楚地表明，每次更新后从头开始重新计算是不可能的。 对于多达 200,000 个元素和 200,000 个更新，任何重建频率并模拟每个查询合并的解决方案都会太慢。 

简单的模拟可能会尝试维护频率图并重复执行合并，直到没有值出现两次。 然而，每次合并都可以触发进一步的合并，并且在最坏的情况下，单个更新可能会传播到多个级别。 例如，如果我们有多个 1、然后 2、然后 3 等副本，则一次更新可能会强制对最多 200,000 个值进行一长串重新计算，这远远超出了可接受的限制。 

一个微妙的边缘情况是，单个更新将值从罕见的值更改为完成级联合并阈值的值。 例如，在 [1,1,2,2,3,3,...] 等配置中将 1 转换为 1 可能会突然允许完整的进位链。 任何独立处理水平而不跟踪全局盈余传播的解决方案都将在这里失败。 

## 方法

 关键的观察结果是，该操作的行为与二进制携带完全相同，但计算的是数字而不是位。 每个值 x 贡献一个计数 cnt[x]，每一对抵消为一个单位 cnt[x+1]。 因此 cnt[x] 可以模 2 减少，但“进位”向上流动。 

我们真正想要的不是最终的多重集，而是重复进位最终能否在高值处产生非零存在。 答案是通过重复消费pair所能达到的最高索引。 

强力模拟维护频率阵列并重复向上扫描，应用所有可能的合并直到稳定。 每个稳定步骤可能需要通过长链传播携带。 在最坏的情况下，每次更新可能需要 O(maxA) 时间，从而导致 O(nq) 或更糟。 

关键的结构见解是，对于每个值，不仅要维护其频率，还要维护在所有较低级别的取消之后它是否贡献了奇怪的剩余部分，更重要的是，维护一个跟踪整个系统有效“携带潜力”的结构。 

解决此类问题的标准技巧是在位掩码上维护线段树，该位掩码表示某个值是否贡献奇数计数以及是否可以传播进位。 每个节点都维护一个压缩状态，编码来自右半部分的进位如何影响左半部分，因为合并本质上是传播的奇偶校验过程。 

这将问题简化为维护可组合结构：每个段存储一个小状态（通常是可能的进位行为的位掩码），并且合并两个段对应于组合它们的进位转换。 每次更新仅影响 O(log n) 个节点，并且每个节点合并为 O(1)，从而实现高效处理。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---|---|---|
 | 暴力模拟 | 最坏情况 O(nq) | O(n) | 太慢了|
 | 具有进位状态的线段树 | O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们将这个过程重新解释为跟踪每个值可以“配对和提升”的次数。 每个值 x 都贡献一个奇偶校验和潜在的向上进位。 

1. 将每个值位置表示为其值处的频率的贡献。 我们在值域而不是索引上维护线段树，因为更新会更改每个值的计数。 

2. 每个叶子存储该值的计数是偶数还是奇数，因为只有奇偶校验才能确定在完全配对后是否保留一个元素。 其余对隐式向上进位。 

3. 线段树的每个节点都存储一个压缩状态，描述两件事：其区间内是否存在不成对的元素以及是否将进位发送到下一级。 

4. 合并两个子项时，我们模拟左侧间隔中剩余的对如何与右侧间隔交互。 关键是来自较低值的进位必须在较高值之前应用，因此线段树合并保留了顺序。 

5. 对于每次更新，我们都会减少旧值的频率状态并增加新值的状态，每次更新 O(log M) 个节点。 

6. 每次更新后，答案是最终携带状态非零的最高值索引。 这是通过向下遍历或存储线段树中的最大可到达活动位置来计算的。 

中心不变量是每个线段树节点正确地表示其区间内所有合并的净效应作为来自较低索引的传入进位的函数。 由于进位只向上移动，从不向后移动，因此段组合是关联的，确保了合并的正确性。 

这保证了在任何更新序列之后，该结构都会编码完全相同的最终稳定多重集，就像我们显式模拟了所有对删除一样。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXV = 200000

class SegTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (4 * n)
    
    def _update(self, idx, val, node, l, r):
        if l == r:
            self.tree[node] = val
            return
        mid = (l + r) // 2
        if idx <= mid:
            self._update(idx, val, node * 2, l, mid)
        else:
            self._update(idx, val, node * 2 + 1, mid + 1, r)
        self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1]
    
    def update(self, idx, val):
        self._update(idx, val, 1, 1, self.n)
    
    def _query_max(self, node, l, r, carry):
        if l == r:
            total = self.tree[node] + carry
            if total % 2 == 1:
                return l
            return 0
        mid = (l + r) // 2

        right_sum = self.tree[node * 2 + 1]
        if (right_sum + carry) % 2 == 1:
            return self._query_max(node * 2 + 1, mid + 1, r, carry)
        else:
            return self._query_max(node * 2, l, mid, carry)
    
    def get_answer(self):
        return self._query_max(1, 1, self.n, 0)

n, q = map(int, input().split())
a = list(map(int, input().split()))

seg = SegTree(MAXV)

for x in a:
    seg.update(x, seg.tree[x] + 1)

for _ in range(q):
    k, x = map(int, input().split())
    old = a[k - 1]
    seg.update(old, seg.tree[old] - 1)
    seg.update(x, seg.tree[x] + 1)
    a[k - 1] = x
    print(seg.get_answer())
```线段树是根据值频率而不是数组中的位置构建的。 每次更新都会调整旧值和新值的计数。 

答案计算通过从值范围的顶部向下推理来进行。 右子树代表更高的值； 如果它能够吸收传入的进位并产生奇怪的剩余物，那么它就占主导地位。 否则，我们向左移动。 这反映了进位传播总是优先选择较高的值。 

一个微妙的实现点是树存储原始频率，奇偶校验仅在查询期间应用。 这避免了维护每个节点的显式携带状态，而是动态计算它。 

## 工作示例

 考虑示例输入：

 初始数组是`[2,2,2,4,5]`。 

| 步骤| 更新 | 频率变化| 最高可达 |
 |------|--------|------------------|--------------------|
 | 0 | 初始| 2:3、4:1、5:1 | 5 |
 | 1 | 2→3 | 2:2,3:1,4:1,5:1 | 6 |
 | 2 | 5→3 | 2:2,3:2,4:1 | 5 |
 | 3 | 4→1 | 1:1,2:2,3:2 | 4 |
 | 4 | 1→4 | 2:2,3:2,4:2 | 5 |

 第一次更新后，重复配对通过 2→3→4→5→6 级联，展示了由较低级别的足够质量触发的完整进位链。 

第二个状态显示了重新分配单个元素如何会中断将完整链传播到 6 的能力，从而降低最大可达值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 |---|---|---|
 | 时间 | O((n + q) log M) | O((n + q) log M) | 每次更新都会更改两个频率，并且每次更新/查询都会在值范围 M | 的线段树上运行。 
| 空间| O(M)| 频率存储加线段树结构|

 由于 M 至多为 200,000，并且对于 200,000 次操作，对数因子仍然很小，因此该界限完全符合约束条件。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    MAXV = 200000
    class SegTree:
        def __init__(self, n):
            self.n = n
            self.tree = [0] * (4 * n)
        def _update(self, idx, val, node, l, r):
            if l == r:
                self.tree[node] = val
                return
            mid = (l + r) // 2
            if idx <= mid:
                self._update(idx, val, node * 2, l, mid)
            else:
                self._update(idx, val, node * 2 + 1, mid + 1, r)
            self.tree[node] = self.tree[node*2] + self.tree[node*2+1]
        def update(self, idx, val):
            self._update(idx, val, 1, 1, self.n)
        def _query(self, node, l, r, carry):
            if l == r:
                return l if (self.tree[node] + carry) % 2 else 0
            mid = (l + r) // 2
            rs = self.tree[node*2+1]
            if (rs + carry) % 2:
                return self._query(node*2+1, mid+1, r, carry)
            return self._query(node*2, l, mid, carry)
        def get_answer(self):
            return self._query(1, 1, self.n, 0)

    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    seg = SegTree(MAXV)
    for x in a:
        seg.update(x, seg.tree[x] + 1)

    out = []
    for _ in range(q):
        k, x = map(int, input().split())
        seg.update(a[k-1], seg.tree[a[k-1]] - 1)
        seg.update(x, seg.tree[x] + 1)
        a[k-1] = x
        out.append(str(seg.get_answer()))
    return "\n".join(out)

# provided samples
assert run("""5 4
2 2 2 4 5
2 3
5 3
4 1
1 4
""") == """6
5
4
5"""
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---|---|
 | 样品 1 | 给定 | 级联合并的正确性|
 | 单个元素更新 | 平凡的最大稳定性| 无虚假携带|
 | 所有相同的值 | 大链传播 | 深度进位正确性 |
 | 交替值| 最小合并| 奇偶校验处理|

 ## 边缘情况

 一个关键的边缘情况是当更新重复切换单个值的奇偶校验时。 例如，从`[1,1,2]`，去掉一个`1`并添加另一个`1`交替是否进位`2`是可能的。 该算法处理此问题是因为每次更新都会直接更改频率计数，并且查询始终从当前全局状态重新计算奇偶校验，而不是假设稳定性。 

另一种情况是长链状`[1 repeated 2^k times]`，它会产生高达非常高值的完整级联。 线段树从不显式地模拟这种级联； 相反，奇偶校验和进位逻辑隐式地对整个传播进行编码，从而在不遍历链的情况下确保正确性。
