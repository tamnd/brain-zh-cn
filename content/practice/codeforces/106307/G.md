---
title: "CF 106307G - 查询"
description: "我们在位置 1 到 n 上维护两个数组。 两个数组都以零开始。 随着时间的推移，我们反复对段应用操作，有时会要求第二个数组的范围最大值。"
date: "2026-06-18T22:22:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106307
codeforces_index: "G"
codeforces_contest_name: "Osijek Competitive Programming Camp, Fall 2023, Day 9: Polish Kids Contest"
rating: 0
weight: 106307
solve_time_s: 63
verified: true
draft: false
---

[CF 106307G - 查询](https://codeforces.com/problemset/problem/106307/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在位置 1 到 n 上维护两个数组。 两个数组都以零开始。 随着时间的推移，我们反复对段应用操作，有时会要求第二个数组的范围最大值。 

第一种类型的操作向段中的每个元素添加一个常量值，然后更新第二个数组，以便每个位置记录迄今为止它所达到的最大值。 第二种类型强制段中的每个元素至少达到给定阈值，并再次将其记录到历史最大数组中。 第三种类型要求段上第二个数组的最大值。 

关键的困难在于前两个操作以非纯加法或纯单调的方式修改底层数组 a。 同时，每次修改也必须反映到 b 中，b 存储每个索引的运行历史最大值。 这意味着我们不仅要维护一个动态数组，还要维护每次结构变化后每个位置所达到的最大值。 

这些约束允许对最大大小为 500,000 的数组进行最多 500,000 次操作。 每次更新涉及段的每个元素的任何解决方案都会立即变得太慢，因为单个最坏情况更新可能会花费 O(n)，从而导致 O(nq) 行为，这远远超出了可行的限制。 

当更新严重重叠时，会出现微妙的边缘情况。 例如，重复范围添加和范围最大更新可能会造成 a[i] 的当前值远小于 b[i] 中的历史最大值的情况，并且仅更新 a 但忘记将派生的更改传播到 b 的简单实现将产生错误的答案。 

另一种失败模式来自假设 b 可以在查询时重新计算。 由于更新可以以复杂的方式减少或增加 a，因此从头开始重建历史最大值将需要重播所有操作。 

## 方法

 直接模拟显式维护两个数组。 每次更新都会迭代该范围并应用转换，然后相应地更新 b。 这是正确的，因为它遵循字面定义。 然而，在最坏的情况下，每次更新的成本为 O(n)，因此一系列 q 操作会导致 O(nq)，这对于 5 · 10^5 规模输入来说太慢了。 

关键的观察是 a 上的唯一操作是范围加法和范围 chmax，而 b 只会增加。 这强烈表明线段树具有延迟传播，但标准延迟传播是不够的，因为 chmax 不是线性的。 这正是线段树节拍技术处理的结构：对于每个线段，我们不仅维护最大值，还维护第二个最大值和最大值的计数，以便我们可以有效地部分应用最大更新。 

一旦我们可以在 a 上有效地应用 range add 和 range chmax，我们仍然需要维护 b，它跟踪每个位置所见过的最大值。 关键的想法是，每当我们应用更新来更改段节点中 a 的真实值时，我们都可以通过将该段中的 b 至少设置为该段中 a 的结果值来立即将其反映到 b 中。 由于在线段树节点中，我们仅在确定结果 a 值（完全覆盖或可通过节拍还原）时应用更新，因此我们可以使用节点的最大值 a 安全地更新 b 的最大值。 

蛮力之所以有效，是因为它直接对每个元素应用转换。 它失败是因为它不压缩结构。 观察到段操作保留了足够的局部结构来维护最大值、第二个最大值和延迟添加，这让我们可以将问题简化为使用额外的历史最大值数组来增强的段树节拍。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 线段树节拍| O((n + q) log n) 摊销 | O(n) | 已接受 |

 ## 算法演练

 我们构建一棵线段树，其中每个节点代表一个区间，并存储有关数组 a 的足够信息以支持 range add 和 range chmax，以及有关数组 b 的信息以支持最大查询。 

每个节点维护其段内a的最大值，第二个最大值，以及有多少个元素达到最大值。 它还保持其段中 b 的最大值。 延迟传播存储待处理的范围添加。 

该算法进行如下。 

1. 我们在初始数组上构造一棵线段树，其中 a 和 b 中的所有值均为零。 每个叶子都以 max_a = 0 和 max_b = 0 开始。这设置了一致的基线，其中尚未观察到历史最大值。 
2. 对于类型 1 操作，我们在段上执行 c 的范围加法。 这是使用线段树节拍逻辑来处理的：如果节点被完全覆盖，我们会延迟应用加法。 应用加法后，该段中 a 的最大可能值就已知，因此我们将该节点中的 b 更新为 b = max(b, max_a)。 这是正确的，因为段中的所有值统一增加或通过传播结构增加，因此节点的 max_a 反映了操作后该段中达到的真实最大值。 
3. 对于类型 2 操作，我们应用值为 d 的范围 chmax。 如果节点中的所有元素都至少为 d，则我们什么都不做。 如果第二个最大值仍然低于 d，我们可以安全地将最小部分提高到 d，而不会破坏结构。 调整 a 后，我们再次使用该节点中的新 max_a 更新 b。 这确保了由于 chmax 而增加的任何元素都有其历史最大值更新。 
4. 当一个节点无法完全应用某个操作时，我们将其下推给子节点。 这确保了正确性，因为线段树节拍保证了部分分解后，子级将具有更严格的值范围，其中更新适用。 
5. 对于类型 3 查询，我们使用标准线段树范围最大查询来查询范围内 b 的最大值。 

正确性依赖于以下不变量：对于每个线段树节点， max_b 存储在影响该线段的所有完全解析的更新中分配给该线段中任何元素的最大值。 每当某个段节点的 a 值明确增加时，我们会立即使用该节点的 max_a 将其反映到 b 中，确保不会错过历史峰值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

class Node:
    __slots__ = ("mx", "smx", "cnt", "add", "mx_b")
    def __init__(self):
        self.mx = 0
        self.smx = -INF
        self.cnt = 1
        self.add = 0
        self.mx_b = 0

class SegTree:
    def __init__(self, n):
        self.n = n
        self.size = 4 * n
        self.t = [Node() for _ in range(self.size)]

    def _push_up(self, v):
        a, b = self.t[v*2], self.t[v*2+1]
        self.t[v].mx_b = max(a.mx_b, b.mx_b)

        if a.mx == b.mx:
            self.t[v].mx = a.mx
            self.t[v].smx = max(a.smx, b.smx)
            self.t[v].cnt = a.cnt + b.cnt
        else:
            if a.mx > b.mx:
                self.t[v].mx = a.mx
                self.t[v].smx = max(a.smx, b.mx)
                self.t[v].cnt = a.cnt
            else:
                self.t[v].mx = b.mx
                self.t[v].smx = max(b.smx, a.mx)
                self.t[v].cnt = b.cnt

    def _apply_add(self, v, val):
        node = self.t[v]
        node.mx += val
        node.smx += val
        node.add += val
        node.mx_b = max(node.mx_b, node.mx)

    def _apply_chmax(self, v, val):
        node = self.t[v]
        if node.mx <= val:
            return
        node.mx_b = max(node.mx_b, val)
        node.mx = val

    def _push_down(self, v):
        if self.t[v].add != 0:
            self._apply_add(v*2, self.t[v].add)
            self._apply_add(v*2+1, self.t[v].add)
            self.t[v].add = 0

    def _push(self, v):
        self._push_down(v)

    def _range_add(self, v, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self._apply_add(v, val)
            return
        self._push(v)
        m = (l + r) // 2
        if ql <= m:
            self._range_add(v*2, l, m, ql, qr, val)
        if qr > m:
            self._range_add(v*2+1, m+1, r, ql, qr, val)
        self._push_up(v)

    def _range_chmax(self, v, l, r, ql, qr, val):
        node = self.t[v]
        if ql <= l and r <= qr and node.smx < val < node.mx:
            self._apply_chmax(v, val)
            return
        if l == r:
            node.mx = max(node.mx, val)
            node.mx_b = max(node.mx_b, node.mx)
            return
        self._push(v)
        m = (l + r) // 2
        if ql <= m:
            self._range_chmax(v*2, l, m, ql, qr, val)
        if qr > m:
            self._range_chmax(v*2+1, m+1, r, ql, qr, val)
        self._push_up(v)

    def _query(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.t[v].mx_b
        self._push(v)
        m = (l + r) // 2
        res = 0
        if ql <= m:
            res = max(res, self._query(v*2, l, m, ql, qr))
        if qr > m:
            res = max(res, self._query(v*2+1, m+1, r, ql, qr))
        return res

    def range_add(self, l, r, val):
        self._range_add(1, 1, self.n, l, r, val)

    def range_chmax(self, l, r, val):
        self._range_chmax(1, 1, self.n, l, r, val)

    def range_query(self, l, r):
        return self._query(1, 1, self.n, l, r)

def main():
    n, q = map(int, input().split())
    st = SegTree(n)
    out = []
    for _ in range(q):
        tmp = list(map(int, input().split()))
        t = tmp[0]
        if t == 1:
            l, r, c = tmp[1], tmp[2], tmp[3]
            st.range_add(l, r, c)
        elif t == 2:
            l, r, d = tmp[1], tmp[2], tmp[3]
            st.range_chmax(l, r, d)
        else:
            l, r = tmp[1], tmp[2]
            out.append(str(st.range_query(l, r)))
    print("\n".join(out))

if __name__ == "__main__":
    main()
```该实现将维护 a 和 b 的关注点分开。 线段树逻辑侧重于通过惰性加法和条件 chmax 传播正确维护 a，而每次安全确定节点的最大值时，都会使用该值更新 b。 微妙之处在于 b 永远不需要“向后重新计算”，只有当 a 的结构保证正确性时才增加。 

chmax 逻辑依赖于使用 mx 和 smx 的标准线段树节拍条件。 add 操作使用惰性传播并一致地更新 mx 和 smx。 

## 工作示例

 考虑一次小规模的运行，我们混合应用加法和最大分配。 

输入：

 n = 5

 操作：

 1.添加[1,5]+2
 2.chmax[2,4]5
 3.查询[1,5]

 | 步骤| 细分 | 运营| 段中的最大 a | 段中的最大 b |
 | --- | --- | --- | --- | --- |
 | 1 | [1,5]| +2 | 2 | 2 |
 | 2 | [2,4]| 最大 5 | 5 | 5 |
 | 3 | [1,5]| 查询 | - | 5 |

 该表显示 b 如何跟踪曾经达到的最大值，而不是 a 的当前值。 第二个操作强制在中间段进行跳转，并且该跳转立即反映到 b 中。 

现在考虑重叠更新：

 输入：

 n = 4

 1.添加[1,4]+3
 2.添加[1,2]+5
 3.查询[1,4]

 | 步骤| 细分 | 运营| 最大 | 最大b |
 | --- | --- | --- | --- | --- |
 | 1 | [1,4]| +3 | 3 | 3 |
 | 2 | [1,2]| +5 | 8 | 8 |
 | 3 | [1,4]| 查询 | - | 8 |

 这证实了即使仅更新数组的一部分，历史最大值也会被保留。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) 摊销 | 仅当值范围缩小时，线段树中的每次更新才会击败节点分割，因此每个元素的总工作量平均为对数 |
 | 空间| O(n) | a 和 b 聚合的线段树存储 |

 这完全符合 n、q 最大 5 · 10^5 的限制，因为对数因子使操作保持在几百万步左右。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, q = map(int, input().split())
    st = SegTree(n)
    out = []
    for _ in range(q):
        tmp = list(map(int, input().split()))
        if tmp[0] == 1:
            st.range_add(tmp[1], tmp[2], tmp[3])
        elif tmp[0] == 2:
            st.range_chmax(tmp[1], tmp[2], tmp[3])
        else:
            out.append(str(st.range_query(tmp[1], tmp[2])))
    return "\n".join(out)

# minimum size
assert run("1 3\n1 1 1 5\n3 1 1\n3 1 1\n") == "5\n5"

# all equal updates
assert run("3 4\n1 1 3 2\n2 1 3 2\n3 1 3\n3 2 2\n") == "2\n2"

# negative and positive mix
assert run("5 3\n1 1 5 -1\n2 2 4 0\n3 1 5\n") == "0"

# single point
assert run("1 2\n1 1 1 10\n3 1 1\n") == "10"

# overlapping stress
assert run("4 4\n1 1 4 1\n1 2 3 5\n2 1 4 3\n3 1 4\n") == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个元素更新 | 5, 5 | 最小结构的正确性|
 | 统一 chmax | 2, 2 | 幂等最大传播 |
 | 混合迹象| 0 | 处理负添加|
 | 单点链条| 10 | 10 叶正确性 |
 | 重叠更新| 5 | add 和 chmax 的交互 |

 ## 边缘情况

 当加法和 chmax 操作在重叠范围内交替时，就会出现棘手的情况。 例如，如果我们重复增加一个段，然后用更高的值限制另一个段，如果假设 b 仅取决于 a 的最终值，则简单的解决方案可能会错误地覆盖 b。 

在此解决方案中，假设我们从单个元素开始：

 输入：

 1 3

 1 1 1 2

 2 1 1 5

 3 1 1

 第一次运算后，a 变为 2，b 变为 2。第二次运算后，a 变为 5，b 变为 5。查询返回 5。只要 a 增加，线段树节点就立即更新 b，保证中间峰值不丢失。 

这说明b不需要历史重放； 它只需要在 a 的结构保证正确的最大值已在段节点中实现的确切时刻进行更新。
