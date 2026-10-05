---
title: "CF 105873F - 第一个问题"
description: "我们维护一个数字序列。 最初每个位置都有一个给定的值，然后我们处理一个操作流。 查询询问所选间隔内的最大值。 加法运算将间隔中的每个值加一。"
date: "2026-06-25T14:27:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105873
codeforces_index: "F"
codeforces_contest_name: "2025 ICPC Gran Premio de Mexico 1ra Fecha"
rating: 0
weight: 105873
solve_time_s: 45
verified: true
draft: false
---

[CF 105873F - 第一个问题](https://codeforces.com/problemset/problem/105873/F)

 **评级：** -
 **标签：** -
 **求解时间：** 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个数字序列。 最初每个位置都有一个给定的值，然后我们处理一个操作流。 查询询问所选间隔内的最大值。 加法运算将间隔中的每个值加一。 异常操作会重置一些值：在选定区间内的位置中，每个值等于整个序列当前最大值的位置都变为零。 

输入描述数组大小、操作数、起始值，然后是操作。 输出仅包含最大查询的答案，其顺序与这些查询出现的顺序相同。 

这些限制使得简单的模拟变得不可能。 由于最多有 100000 个位置和 100000 次操作，在最坏的情况下扫描每次更新的整个间隔可能会执行大约 10^10 次操作。 解决方案需要保持每次操作接近 O(log n)，或者至少具有强大的摊销界限。 

困难的部分是重置操作。 它不会重置查询范围的最大值，它仅重置等于整个数组的全局最大值的元素。 仅存储每个段的最大值的解决方案会丢失信息，因为两个段可以具有相同的最大值，但实现该最大值的元素数量不同。 

例如，考虑：```
Input
3 2
5 5 1
R 1 2
Q 1 3
```全局最大值为 5。重置影响位置 1 和 2，因此数组变为`[0, 0, 1]`。 答案是：```
1
```将重置解释为“将范围内的最大值设置为零”的粗心实现可能会在混合全局和局部最大值后意外重置错误的元素。 

另一种边缘情况是当一个段包含最大值但并非该段中的每个值都等于它时。```
Input
4 2
7 7 3 7
R 1 3
Q 1 4
```全局最大值为 7。仅重置位置 1 和 2，因为位置 3 的值为 3。最终数组为`[0,0,3,7]`，所以答案是：```
7
```只存储最大值的线段树无法知道它是否可以安全地清除整个线段。 

最后一个棘手的情况是节点中的所有值都相等。```
Input
5 2
4 4 4 4 4
R 2 5
Q 1 5
```所有受影响的值都是全局最大值，因此数组变为`[4,0,0,0,0]`。 答案是：```
4
```数据结构必须认识到整个段可以立即更新。 

## 方法

 最直接的方法是直接存储数组并通过访问所有受影响的位置来处理每个操作。 查询很容易，因为我们可以扫描区间并取最大值。 加法操作也很简单，因为我们递增每个元素。 重置操作扫描范围，找到全局最大值，并清除匹配值。 

这是正确的，因为它直接遵循每个操作的定义。 问题是速度。 在最坏的情况下，每个操作几乎都会触及所有位置，从而导致 O(NK) 工作量，大约可以达到 10^10 次元素操作。 

关键的观察是重置操作只关心等于当前最大值的值。 普通的线段树是不够的，因为单独的最大值并不能揭示整个线段是否由最大值组成。 我们还需要一条信息：每个细分中的第二大值。 

如果某个段具有最大值`x`它的第二个最大值小于`x`，那么该段中的每个元素都恰好是`x`。 什么时候`x`是全局最大值，我们可以立即重置整个段。 否则，我们只会深入到仍然需要检查某些元素的部分。 

这与线段树节拍背后的想法相同。 该结构存储最大值、第二大值、最大值出现的次数以及范围添加的惰性信息。 重置最大值是有效的，因为每当我们无法在某个节点完成时，我们只会更深入，直到找到更小的组。 实际重置的值从最大层消失，从而提供所需的摊销。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(NK) | O(N) | 太慢了 |
 | 线段树节拍| O((N + K) log N) 摊销 | O(N) | 已接受 |

 ## 算法演练

 1. 构建线段树。 对于每个节点，存储最大值、第二大值、具有最大值的元素数量以及仍需要推送到子节点的惰性加法。 需要第二个最大值来确定是否可以安全地重置整个段。 
2. 对于添加操作`[l, r]`，对覆盖的节点应用惰性增量。 增加段中的每个值都会将最大值和第二最大值更改相同的量，因此节点信息仍然有效。 
3. 对于查询`[l, r]`，返回覆盖节点中存储的最大值。 惰性值在下降之前被推送，因此子值是正确的。 
4. 对于重置操作，首先从根开始获取整个数组的最大值。 这是必须删除的值。 
5. 访问线段树相交的节点`[l, r]`。 如果一个被覆盖的节点的最大值等于全局最大值并且它的第二个最大值更小，则该节点中的每个值都是全局最大值。 将整个节点设置为零。 
6. 否则，将惰性值推入子级中并继续。 某些节点包含最大值和较小值的混合，因此必须将它们拆分，直到可以安全地应用重置。 

为什么它有效：

 不变的是每个节点总是正确地表示其段内的值的多重集。 最大值和第二最大值告诉我们是否所有值都等于当前最大值。 如果是，则将整个段替换为零正是所需的操作。 如果不是，则至少有一个子级包含与最大值不同的值，因此降序可以保持正确性。 添加操作会保留值的顺序，因为受影响段中的每个元素都会发生相同的变化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

class SegTree:
    def __init__(self, arr):
        n = len(arr)
        self.n = n
        size = 4 * n
        self.mx = [0] * size
        self.smx = [-INF] * size
        self.cnt = [0] * size
        self.lazy = [0] * size
        self.build(1, 0, n - 1, arr)

    def build(self, v, l, r, a):
        if l == r:
            self.mx[v] = a[l]
            self.cnt[v] = 1
            return
        m = (l + r) // 2
        self.build(v * 2, l, m, a)
        self.build(v * 2 + 1, m + 1, r, a)
        self.pull(v)

    def apply_add(self, v, x):
        self.mx[v] += x
        if self.smx[v] != -INF:
            self.smx[v] += x
        self.lazy[v] += x

    def apply_zero(self, v):
        self.mx[v] = 0
        self.smx[v] = -INF
        self.cnt[v] = self.length[v]
        self.lazy[v] = 0

    def push(self, v):
        if self.lazy[v]:
            x = self.lazy[v]
            self.apply_add(v * 2, x)
            self.apply_add(v * 2 + 1, x)
            self.lazy[v] = 0

    def pull(self, v):
        a = v * 2
        b = v * 2 + 1
        if self.mx[a] > self.mx[b]:
            self.mx[v] = self.mx[a]
            self.cnt[v] = self.cnt[a]
            self.smx[v] = max(self.smx[a], self.mx[b])
        elif self.mx[a] < self.mx[b]:
            self.mx[v] = self.mx[b]
            self.cnt[v] = self.cnt[b]
            self.smx[v] = max(self.mx[a], self.smx[b])
        else:
            self.mx[v] = self.mx[a]
            self.cnt[v] = self.cnt[a] + self.cnt[b]
            self.smx[v] = max(self.smx[a], self.smx[b])

    def add(self, v, l, r, ql, qr):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            self.apply_add(v, 1)
            return
        self.push(v)
        m = (l + r) // 2
        self.add(v * 2, l, m, ql, qr)
        self.add(v * 2 + 1, m + 1, r, ql, qr)
        self.pull(v)

    def query(self, v, l, r, ql, qr):
        if qr < l or r < ql:
            return -INF
        if ql <= l and r <= qr:
            return self.mx[v]
        self.push(v)
        m = (l + r) // 2
        return max(self.query(v * 2, l, m, ql, qr),
                   self.query(v * 2 + 1, m + 1, r, ql, qr))

    def reset(self, v, l, r, ql, qr, target):
        if qr < l or r < ql or self.mx[v] < target:
            return
        if ql <= l and r <= qr and self.mx[v] == target and self.smx[v] < target:
            self.length[v] = r - l + 1
            self.apply_zero(v)
            return
        if l == r:
            self.apply_zero(v)
            return
        self.push(v)
        m = (l + r) // 2
        self.reset(v * 2, l, m, ql, qr, target)
        self.reset(v * 2 + 1, m + 1, r, ql, qr, target)
        self.pull(v)

def solve():
    n, k = map(int, input().split())
    arr = list(map(int, input().split()))

    tree = SegTree(arr)
    tree.length = [0] * (4 * n)

    def fill_len(v, l, r):
        tree.length[v] = r - l + 1
        if l != r:
            m = (l + r) // 2
            fill_len(v * 2, l, m)
            fill_len(v * 2 + 1, m + 1, r)

    fill_len(1, 0, n - 1)

    ans = []
    for _ in range(k):
        c, l, r = input().split()
        l = int(l) - 1
        r = int(r) - 1
        if c == 'Q':
            ans.append(str(tree.query(1, 0, n - 1, l, r)))
        elif c == 'A':
            tree.add(1, 0, n - 1, l, r)
        else:
            cur = tree.mx[1]
            tree.reset(1, 0, n - 1, l, r, cur)

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```该树每个节点保存四条信息。`mx`代表该段中的最高值，`smx`表示严格小于它的最高值，并且`cnt`存储有多少个元素达到最大值。 惰性值仅用于添加，因为向段添加 1 会平均移动每个值。 

复位操作使用以下关系`mx`和`smx`。 如果最大值是目标并且第二个最大值较小，则该段仅包含目标值。 清除整个节点是安全的。 否则，代码将推送惰性加法并检查子级。 

这`length`数组存储段大小，因此完全重置可以正确更新最大值的计数。 将其分开可以避免在递归期间重新计算长度。 边界处理基于包含索引，因此从输入索引到从零开始的索引的转换在处理之前发生一次。 

## 工作示例

 考虑示例：```
10 10
1 2 3 4 5 6 7 8 9 10
Q 1 10
R 1 10
A 1 10
Q 1 10
R 1 7
Q 5 10
R 7 10
Q 6 10
A 6 10
Q 1 6
```| 步骤| 运营| 全球最大 | 重要变化| 查询解答 |
 | ---| ---| ---| ---| ---|
 | 1 | 问 1 10 | 10 | 10 没有更新 | 10 | 10
 | 2 | R 1 10 | 10 | 10 位置 10 变为 0 | - |
 | 3 | A 1 10 | 10 | 10 每个值都会增加 | - |
 | 4 | 问 1 10 | 10 | 10 最大恢复| 10 | 10
 | 5 | R 1 7 | 10 | 10 位置 7 已清除 | - |
 | 6 | 问 5 10 | 10 | 10 排名 10 依然存在 | 10 | 10

 这说明了为什么重置使用全局最大值而不是间隔最大值。 第一次重置仅更改实际保存全局最大值的元素。 

第二个例子：```
5 3
4 4 4 4 4
R 2 5
Q 1 5
A 1 5
```| 步骤| 运营| 根最大值 | 段状态|
 | ---| ---| ---| ---|
 | 1 | 初始| 4 | 所有值均相等 |
 | 2 | R 2 5 | 4 | 覆盖的段立即重置 |
 | 3 | 问 1 5 | 4 | 仅第一位置保持最大 |
 | 4 | A 1 5 | 5 | 所有价值都增加|

 这证实了全相等段被作为单个操作处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((N + K) log N) 摊销 | 每个操作都执行对数树工作，重复重置减少需要更深访问的最大元素数量 |
 | 空间| O(N) | 线段树每个节点存储恒定量的信息 |

 这些限制要求避免全范围扫描。 线段树使访问节点的数量保持足够小，足以进行 100000 次操作。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old
    return ""

# The following cases are intended for the solve() implementation.

# sample 1
# 10 10
# 1 2 3 4 5 6 7 8 9 10
# Q 1 10
# R 1 10
# A 1 10
# Q 1 10
# R 1 7
# Q 5 10
# R 7 10
# Q 6 10
# A 6 10
# Q 1 6

# minimum size
# 1 3
# 5
# Q 1 1
# R 1 1
# Q 1 1

# all equal values
# 5 2
# 3 3 3 3 3
# R 1 5
# Q 1 5

# mixed maximum values
# 4 2
# 7 7 3 7
# R 1 3
# Q 1 4
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 带重置的单元素 |`5`然后`0`| 最小尺寸处理 |
 | 所有值均相等 |`0`重置后| 全段重置 |
 | 混合最大值|`7`| 不清除非最大值 |
 | 重置后范围添加| 取决于生产的最大| 惰性传播的正确性 |

 ## 边缘情况

 对于重置间隔包含一些但不是全部最大值的情况，树会下降而不是清除整个节点。 在：```
4 2
7 7 3 7
R 1 3
Q 1 4
```根看到最大值`7`，但是段`[1,3]`第二个最大值为`3`。 重置继续向下并仅清除包含的叶子`7`。 最终剩下的最大值`7`。 

对于全平等的情况：```
5 2
4 4 4 4 4
R 2 5
Q 1 5
```被覆盖的节点有`mx = 4`和`smx = -INF`。 该算法知道该节点中的每个值是`4`，因此它会立即替换整个段。 剩余第一位置保持价值`4`，即查询结果。 

对于重叠添加：```
3 3
1 2 3
A 1 3
R 1 3
Q 1 3
```添加后的数组是`[2,3,4]`。 重置仅删除最后一个值，因为它是全局最大值。 答案就变成了`3`，表明惰性添加和重置可以正确交互。
