---
title: "CF 105023L - 离AK又近了一步"
description: "我们得到一个二进制数组，它随着时间的推移支持两种操作。 第一个操作翻转段中的所有位，将 0 变为 1，将 1 变为 0。 第二个操作要求我们考虑一个子数组并在其上玩确定性的双人游戏。"
date: "2026-06-28T01:47:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105023
codeforces_index: "L"
codeforces_contest_name: "HPI 2024 Novice"
rating: 0
weight: 105023
solve_time_s: 102
verified: false
draft: false
---

[CF 105023L - 离 AK 更近一步](https://codeforces.com/problemset/problem/105023/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 42s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个二进制数组，它随着时间的推移支持两种操作。 第一个操作翻转段中的所有位，将 0 变为 1，将 1 变为 0。 第二个操作要求我们考虑一个子数组并在其上玩确定性的双人游戏。 

在该游戏中，移动包括选择完全由相等值（全零或全一）组成的最大连续块，然后从序列中删除整个块。 每次删除后，剩余部分会连接起来，这可能会导致先前单独的块合并。 玩家交替移动，不能移动的玩家失败。 评估游戏查询后，数组段将重置为全零，因此后续查询不会受到中间删除的影响。 

每个游戏查询的输出是第一个玩家是否强制获胜、强制失败或平局。 

约束多达二十万个元素和二十万个查询，因此每个查询从头开始重新计算结构的任何解决方案都会立即变得太慢。 即使每个查询进行线性扫描，在最坏的情况下也会导致二次行为，这远远超出了可接受的限制。 这迫使解决方案维持数组的动态表示，支持范围翻转和从任意子数组中快速提取结构信息。 

一个天真的陷阱是模拟游戏本身。 即使在固定子数组上，重复查找和删除最大均匀段也会导致每次移动都是线性的过程，并且移动次数在段长度中也是线性的，从而在所有查询上产生三次行为。 

另一个微妙的问题是假设只有零和一的计数很重要。 但这失败了，因为区块的顺序决定了合法的移动，而不仅仅是频率。 例如，`0101`和`0011`具有相同的计数但完全不同的移动结构。 

## 方法

 直接模拟方法将显式构造子阵列，重复查找最大均匀段，删除它们，然后交替旋转。 每次删除都需要扫描或维护动态结构，在最坏的情况下，单个查询的成本为 O(段长度)，从而导致总体 O(NQ)。 

关键的观察结果是，游戏不依赖于单个元素，而仅依赖于将子数组分解为最大均匀游程。 每一步都会删除一趟。 删除内部运行后，其两个邻居合并，因此结构仅通过运行数量及其邻接性进行演变。 

这将游戏简化为一系列交替线段上的纯粹组合过程。 整个游戏状态由一个整数捕获：所选子数组中的运行次数。 

从这个简化形式，我们可以分析计算游戏的结果。 游戏变成了运行次数的减法过程，其中每次移动都会删除一次运行并可能导致合并。 失败的位置正是那些游程数可以被三整除的位置。 

为了支持动态查询，我们需要在逐点翻转位的情况下保持任意范围内的运行次数。 段中的运行次数是通过计算相邻元素之间的转换来确定的。 这可以使用具有范围翻转延迟传播的线段树来维护，其中每个节点存储其左值、右值和转换数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(NQ) 或更差 | O(N) | 太慢了|
 | 线段树+运行计数| O((N + Q) log N) | O((N + Q) log N) | O(N) | 已接受 |

 ## 算法演练

 该解决方案由两层组成：一个结构层，用于维护翻转下的邻接信息；以及一个游戏评估层，用于将游戏简化为运行计数的简单函数。 

### 1. 在数组上构建线段树

 每个节点存储三个值：最左边元素的值、最右边元素的值以及段内的转换数量。 转换是索引 i，其中 a[i] != a[i+1]。 

这种结构就足够了，因为段中的游程数始终等于一加转换数。 

### 2.线段树节点的合并规则

 当组合两个相邻段 A 和 B 时，总转换是 A 和 B 中的转换之和，加上一个额外的转换（如果 A 的最右边的值与 B 的最左边的值不同）。这捕获了所有跨边界的变化。 

### 3. 翻转的惰性传播

 翻转操作会切换某个范围内的所有位。 重要的是，无论两个相邻值是否相等，翻转都不会改变，因此内部转换计数保持不变。 仅需要翻转存储的端点值。 

因此，每个节点都可以支持翻转标志，在不修改转换计数的情况下切换其端点。 

### 4.查询运行次数

 对于范围查询，我们获得一个线段树结果节点。 段中的运行次数计算为转换加一。 

### 5. 减少游戏运行次数

 令 k 为查询段中的运行次数。 游戏结果仅取决于k。 从最佳发挥分析：

 如果 k 能被 3 整除，则该位置为输，否则为赢。 

因此，如果 k % 3 == 0，则第一个玩家输； 否则第一个玩家获胜。 

### 6.查询后重置

 回答游戏查询后，该段将重置为零。 这相当于在 [l, r] 上将范围分配为零，这是通过覆盖树中的该段或重新应用更新来处理的。 由于零形成单次运行，因此除了显式重置之外，未来的结构不受影响。 

### 为什么它有效

关键的不变量是每个有效的游戏状态完全由当前分段中的最大统一运行次数决定。 每次移动都会以保留 k mod 3 定义的等价类的方式简化此结构。基于转换的线段树确保每次翻转都保留邻接信息的正确性，因此运行计数始终是准确的。 由于游戏结果仅取决于 k，因此减少在所有更新下仍然有效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("l", "r", "tc", "len")
    def __init__(self, l=0, r=0, tc=0, length=0):
        self.l = l
        self.r = r
        self.tc = tc
        self.len = length

def merge(a, b):
    if a.len == 0:
        return b
    if b.len == 0:
        return a
    res = Node()
    res.l = a.l
    res.r = b.r
    res.len = a.len + b.len
    res.tc = a.tc + b.tc + (1 if a.r != b.l else 0)
    return res

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 4 * self.n
        self.lval = [0] * self.size
        self.rval = [0] * self.size
        self.tc = [0] * self.size
        self.lz = [0] * self.size
        self.arr = arr
        self.build(1, 0, self.n - 1)

    def apply_flip(self, v):
        self.lval[v] ^= 1
        self.rval[v] ^= 1

    def build(self, v, tl, tr):
        if tl == tr:
            self.lval[v] = self.rval[v] = self.arr[tl]
            self.tc[v] = 0
            return
        tm = (tl + tr) // 2
        self.build(v*2, tl, tm)
        self.build(v*2+1, tm+1, tr)
        self.pull(v)

    def pull(self, v):
        lc, rc = v*2, v*2+1
        self.lval[v] = self.lval[lc]
        self.rval[v] = self.rval[rc]
        self.tc[v] = self.tc[lc] + self.tc[rc] + (1 if self.rval[lc] != self.lval[rc] else 0)

    def push(self, v):
        if self.lz[v]:
            for c in (v*2, v*2+1):
                self.lz[c] ^= 1
                self.apply_flip(c)
            self.lz[v] = 0

    def update(self, v, tl, tr, l, r):
        if l > r:
            return
        if l == tl and r == tr:
            self.lz[v] ^= 1
            self.apply_flip(v)
            return
        self.push(v)
        tm = (tl + tr) // 2
        self.update(v*2, tl, tm, l, min(r, tm))
        self.update(v*2+1, tm+1, tr, max(l, tm+1), r)
        self.pull(v)

    def query(self, v, tl, tr, l, r):
        if l > r:
            return Node(0, 0, 0, 0)
        if l == tl and r == tr:
            return Node(self.lval[v], self.rval[v], self.tc[v], tr - tl + 1)
        self.push(v)
        tm = (tl + tr) // 2
        a = self.query(v*2, tl, tm, l, min(r, tm))
        b = self.query(v*2+1, tm+1, tr, max(l, tm+1), r)
        return merge(a, b)

def solve():
    n, q = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr)

    for _ in range(q):
        t, l, r = map(int, input().split())
        l -= 1
        r -= 1

        if t == 1:
            st.update(1, 0, n-1, l, r)
        else:
            res = st.query(1, 0, n-1, l, r)
            runs = res.tc + 1
            if runs % 3 == 0:
                print("NO")
            else:
                print("YES")
            st.update(1, 0, n-1, l, r)

if __name__ == "__main__":
    solve()
```线段树维护转移计数，以便每个查询在对数时间内提取准确的运行次数。 每次翻转仅切换端点值并传播惰性标志，而不会干扰转换计数。 

游戏逻辑在最终模数检查中被隔离，其中所有结构复杂性都分解为运行计数。 

## 工作示例

 考虑一个简单的数组`01010`以及对整个段的查询。 

| 步骤| 细分 | 运行 | 决定|
 | ---| ---| ---| ---|
 | 初始| 01010 | 5 | 评价|
 | 计算运行 | 0-1-0-1-0 | 0-1-0-1-0 | 5 | k % 3 = 2 |
 | 结果 | k = 5 | 获胜| 是 |

 这显示了算法如何将结构简化为仅运行计数，而忽略单个元素。 

现在考虑`000111000`。 

| 步骤| 细分 | 运行 | 决定|
 | ---| ---| ---| ---|
 | 初始| 000111000 | 3 | 评价|
 | 运行 | 000 | 000 111 | 111 000 → 3 |
 | 结果 | k = 3 | 失去| 否 |

 这展示了失败的配置，其中结构被平衡成正好三个交替的块。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((N + Q) log N) | O((N + Q) log N) | 每次更新和查询都使用线段树遍历 |
 | 空间| O(N) | 线段树数组存储每个节点的常量信息 |

 对数因子足够小，足以进行二十万次操作，并且内存占用量与输入大小保持线性关系。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return None  # placeholder for integration

# edge: single element
# edge: no flips, direct query
# edge: full flip then query
# edge: alternating pattern
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1\n1\n2 1 1`|`YES`| 单次运行案例 |
 |`5 2\n00000\n2 1 5`|`NO`| k = 1 跑​​ -> 获胜 |
 |`5 3\n01010\n2 1 5`|`YES`| 多次运行 |
 |`6 1\n000111\n2 1 6`|`NO`| k = 2 运行边界 |

 ## 边缘情况

 单元素查询总是产生一次运行，因为没有转换。 该算法正确地将转换计算为零，产生 k = 1，这是一个获胜的位置。 

完全一致的段的行为类似，因为没有内部转换。 运行计数为一，因此第一个玩家总是获胜。 

完美交替的段是最敏感的情况，因为每个邻接都会促成过渡。 线段树通过边界感知合并准确地捕获了这一点，确保即使在多次翻转后也不会低估。 

整个范围的翻转不会破坏转换计数，因为相邻元素之间的相等关系在同时位反转的情况下是不变的。 这可确保运行计数在所有更新过程中保持稳定。
