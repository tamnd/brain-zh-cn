---
title: "CF 1641C - 匿名很重要"
description: "我们排了n个人。 每个人要么生病，要么健康。 当信息到达时，我们收到两种陈述。 x = 0 的语句表示区间 [l, r] 内没有人生病。 在这个范围内的每个人都肯定会变得健康。"
date: "2026-06-10T04:21:22+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "dsu", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1641
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 773 (Div. 1)"
rating: 2200
weight: 1641
solve_time_s: 122
verified: true
draft: false
---

[CF 1641C - 匿名很重要](https://codeforces.com/problemset/problem/1641/C)

 **评分：** 2200
 **标签：** 二分查找、暴力破解、数据结构、DSU、贪婪、排序
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一行`n`人们。 每个人要么生病，要么健康。 

当信息到达时，我们收到两种陈述。 

声明与`x = 0`说在这段时间里没有人`[l, r]`生病了。 在这个范围内的每个人都肯定会变得健康。 

声明与`x = 1`说里面至少有一个病人`[l, r]`。 这并不能识别谁生病了，它只是保证该时间间隔至少包含一名病人。 

与这些陈述混合在一起的是询问单个职位的查询`j`。 我们必须回答：`NO`如果人`j`绝对是健康的。`YES`如果人`j`肯定是生病了。`N/A`如果这两种可能性仍然与迄今为止看到的所有信息一致。 

限制才是真正的挑战。 两个都`n`和`q`一样大`2 · 10^5`。 任何在更新期间扫描间隔或在查询期间扫描所有存储约束的解决方案都会立即变得太慢。 二次方法的执行顺序为`4 · 10^10`运营。 

棘手的案例来自于正面信息和负面信息之间的相互作用。 

假设我们知道：```
0 1 2 0
0 1 3 1
```第一条语句表明立场`1`和`2`健康。 第二份声明称，有一名病人`[1,3]`。 由于只有位置`3`仍然有可能，位置的答案`3`是`YES`。 

仅存储间隔的简单解决方案`[1,3]`并且从不合并后来的消除将错过此扣除。 

另一个微妙的情况是嵌套的正区间。```
[2,10] contains a sick person
[4,6] contains a sick person
```第二种说法严格来说更强。 一旦我们知道`[4,6]`包含一个病人，较大的间隔没有贡献任何新内容。 保留这两个间隔只会产生多余的工作。 

这一观察结果是公认解决方案的关键。 

## 方法

 蛮力的想法很简单。 

维护每个人的地位。 对于每个语句`x = 0`，将整个区间标记为健康。 对于每个语句`x = 1`，存储间隔。 当被问及职位时`j`，检查所有存储的间隔并检查累积的信息力是否`j`生病了。 

这是正确的，因为它直接对约束进行建模，但它变得极其缓慢。 和`2 · 10^5`运算和长度间隔`2 · 10^5`，最坏情况达到数百亿次运算。 

关键的观察是，健康的人是唯一永久为人所知的位置。 一旦一个人被证明是健康的，他们就可以永远被排除在外。 

想象一下维护一组状态仍然未知的人。 

对于积极的声明`[l, r]`，我们真正关心的是，在该区间目前未知的位置中，至少有一个最终一定会生病。 

现在考虑两个正区间，其中一个包含另一个。 

如果`[4,6]`已经保证了一个病人，那么`[2,10]`没有添加新信息。 任何满足较小区间的分配都会自动满足较大区间。 

所以我们只需要在遏制下保持最小的正间隔。 

当查询询问位置时`j`， 让：`L`= 之前的未知位置`j`

`R`= 之后的下一个未知位置`j`然后`(L, R)`恰好包含一个未知人，即`j`。 

如果完全存在存储的正区间`(L, R)`并含有`j`，该区间只剩下一个候选者。 所需的病人必须是`j`。 

这将问题转化为维护：

 一组仍然未知的动态位置。 

按左端点排序的非冗余正区间的集合。 

两者都可以在对数时间内处理。 

公认的解决方案使用类似 DSU 的“下一个活着”结构来有效删除健康位置和最小正区间的有序图。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(n + q) | 太慢了 |
 | 最佳| O((n + q) log n) | O((n + q) log n) | O(n + q) | 已接受 |

 ## 算法演练

 1. 维持状态仍未知的一组仓位。 

最初每个位置都属于这个集合。 
2. 对于声明`[l, r]`和`x = 0`，从未知集中删除该区间中的每个位置。 

那些人现在绝对健康。 
3. 使用 DSU“下一个指针”结构来跳过已删除的位置。 

每个位置最多被删除一次，因此所有删除总体上几乎是线性的。 
4. 对于声明`[l, r]`和`x = 1`，将区间插入正约束的有序映射中。 
5. 如果现有的存储区间完全包含在`[l, r]`，新的区间是多余的，可以忽略。 

间隔越小，严格强度越强。 
6. 否则插入`[l, r]`并删除任何先前存储的包含它的间隔。 

在此步骤之后，存储的间隔不再包含另一个间隔。 
7. 位置查询`j`,首先检查是否`j`仍属于未知集。 

如果没有，请回答`NO`。 
8.让`L`是先前的未知位置并且`R`下一个未知的位置。 

由于未知位置按顺序存储，因此可以在对数时间内找到这些邻居。 
9. 搜索第一个左端点大于的存储区间`L`。 
10. 如果这样的间隔开始于或之前`j`并在之前结束`R`， 回答`YES`。 

该区间完全位于块内，其唯一未知的位置是`j`，所以它所要求的病人必须是`j`。 
11.否则回答`N/A`。 

### 为什么它有效

 未知集总是包含尚未被证明健康的位置。 

区间结构仅存储最小的正约束。 删除包含较小间隔的较大间隔永远不会更改有效分配的集合，因为满足较小间隔会自动满足较大间隔。 

对于查询的职位`j`, 邻居`L`和`R`定界最大段，其唯一未知位置是`j`。 该细分市场内的所有其他位置都已知是健康的。 

如果正区间完全位于`(L, R)`并包含`j`，那么该区间正好剩下一个可能患病的候选者。 因此`j`一定是生病了。 

如果不存在这样的区间，我们总是可以构造一个有效的赋值，其中`j`是健康的，所以信息不足以迫使疾病。 

这两个事实与所需的答案完全相符。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right
import random

input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, val):
        n = self.n
        while idx <= n:
            self.bit[idx] += val
            idx += idx & -idx

    def sum(self, idx):
        res = 0
        while idx:
            res += self.bit[idx]
            idx -= idx & -idx
        return res

    def kth(self, k):
        idx = 0
        bitmask = 1 << (self.n.bit_length())
        while bitmask:
            nxt = idx + bitmask
            if nxt <= self.n and self.bit[nxt] < k:
                k -= self.bit[nxt]
                idx = nxt
            bitmask >>= 1
        return idx + 1

class DSU:
    def __init__(self, n):
        self.p = list(range(n + 3))

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def erase(self, x):
        self.p[x] = self.find(x + 1)

class Node:
    __slots__ = ("l", "r", "prio", "left", "right")

    def __init__(self, l, r):
        self.l = l
        self.r = r
        self.prio = random.randint(1, 1 << 30)
        self.left = None
        self.right = None

def split(root, key):
    if not root:
        return (None, None)
    if root.l < key:
        a, b = split(root.right, key)
        root.right = a
        return (root, b)
    a, b = split(root.left, key)
    root.left = b
    return (a, root)

def merge(a, b):
    if not a or not b:
        return a or b
    if a.prio > b.prio:
        a.right = merge(a.right, b)
        return a
    b.left = merge(a, b.left)
    return b

def insert(root, node):
    if not root:
        return node
    if node.prio > root.prio:
        node.left, node.right = split(root, node.l)
        return node
    if node.l < root.l:
        root.left = insert(root.left, node)
    else:
        root.right = insert(root.right, node)
    return root

def lower_bound(root, key):
    ans = None
    while root:
        if root.l >= key:
            ans = root
            root = root.left
        else:
            root = root.right
    return ans

def predecessor(root, key):
    ans = None
    while root:
        if root.l < key:
            ans = root
            root = root.right
        else:
            root = root.left
    return ans

def erase_key(root, key):
    if not root:
        return None
    if root.l == key:
        return merge(root.left, root.right)
    if key < root.l:
        root.left = erase_key(root.left, key)
    else:
        root.right = erase_key(root.right, key)
    return root

n, q = map(int, input().split())

fw = Fenwick(n + 2)
for i in range(n + 2):
    fw.add(i + 1, 1)

alive = [True] * (n + 2)

dsu = DSU(n + 2)
root = None

out = []

for _ in range(q):
    data = list(map(int, input().split()))

    if data[0] == 0:
        l, r, x = data[1], data[2], data[3]

        if x == 0:
            p = dsu.find(l)
            while p <= r:
                if alive[p]:
                    alive[p] = False
                    fw.add(p + 1, -1)
                dsu.erase(p)
                p = dsu.find(p)

        else:
            cur = lower_bound(root, l)

            if cur and cur.r <= r:
                continue

            root = insert(root, Node(l, r))

            while True:
                prv = predecessor(root, l)
                if prv is None or prv.r < r:
                    break
                root = erase_key(root, prv.l)

    else:
        j = data[1]

        if not alive[j]:
            out.append("NO")
            continue

        rank = fw.sum(j + 1)

        left_pos = fw.kth(rank - 1) - 1
        right_pos = fw.kth(rank + 1) - 1

        cur = lower_bound(root, left_pos + 1)

        if cur and cur.l <= j and cur.r < right_pos:
            out.append("YES")
        else:
            out.append("N/A")

sys.stdout.write("\n".join(out))
```DSU 仅负责区间删除。 一旦位置变得健康，它就永远不会返回，因此每个索引最多被删除一次。 

芬威克树维护未知位置的有序集合。 它可以让我们通过订单统计找到查询位置的前任和后继。 

treap 存储按左端点排序的最小正区间。 插入删除了较大的冗余间隔，保留了存储间隔不包含另一个间隔的不变性。 

查询逻辑直接遵循证明。 如果一个区间被困在间隙内，其唯一未知的位置是`j`， 然后`j`必须是该间隔所需的病人。 

## 工作示例

 ### 示例 1

 输入：```
6 9
0 4 5 0
1 5
1 6
0 4 6 1
1 6
0 2 5 1
0 2 2 0
1 3
1 2
```| 运营| 未知职位 | 存储的正区间 | 回答 |
 | ---| ---| ---| ---|
 | 0 4 5 0 | 0 4 5 0 {1,2,3,6} | {} | |
 | 1 5 | 1 {1,2,3,6} | {} | 否 |
 | 1 6 | {1,2,3,6} | {} | 不适用 |
 | 0 4 6 1 | 0 4 6 1 {1,2,3,6} | {[4,6]} | |
 | 1 6 | {1,2,3,6} | {[4,6]} | 是 |
 | 0 2 5 1 | 0 2 5 1 {1,2,3,6} | {[2,5]} | |
 | 0 2 2 0 | 0 2 2 0 {1,3,6} | {[2,5]} | |
 | 1 3 | {1,3,6} | {[2,5]} | 是 |
 | 1 2 | {1,3,6} | {[2,5]} | 否 |

 关键时刻是在位置之后`2`变得健康。 间隔`[2,5]`仍然需要一个病人和位置`3`是该区域内唯一剩下的候选人。 

### 自定义示例```
5 4
0 1 5 1
1 3
0 1 4 0
1 5
```| 运营| 未知职位 | 存储的正区间 | 回答 |
 | ---| ---| ---| ---|
 | 0 1 5 1 | 0 1 5 1 {1,2,3,4,5} | {[1,5]} | |
 | 1 3 | {1,2,3,4,5} | {[1,5]} | 不适用 |
 | 0 1 4 0 | 0 1 4 0 {5} | {[1,5]} | |
 | 1 5 | 1 {5} | {[1,5]} | 是 |

 最初任何位置都可以满足正区间。 职位后`1..4`变得健康，才有地位`5`遗迹。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每次删除发生一次，每个树操作都是对数 |
 | 空间| O(n + q) | DSU、Fenwick 树和存储区间 |

 和`n, q ≤ 2 · 10^5`，对数更新和查询很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    # call solve() here in a real test harness
    pass

# sample 1
assert run(
"""6 9
0 4 5 0
1 5
1 6
0 4 6 1
1 6
0 2 5 1
0 2 2 0
1 3
1 2
"""
) == """NO
N/A
YES
YES
NO"""

# minimum size
assert run(
"""1 2
1 1
1 1
"""
) == """N/A
N/A"""

# single forced sick person
assert run(
"""3 3
0 1 2 0
0 1 3 1
1 3
"""
) == "YES"

# everybody healthy
assert run(
"""4 3
0 1 4 0
1 1
1 4
"""
) == """NO
NO"""

# boundary positions
assert run(
"""5 4
0 2 4 0
0 1 5 1
1 1
1 5
"""
) == """N/A
N/A"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小尺寸外壳 | 不适用 | 无可用信息 |
 | 被迫幸存者| 是 | 正区间崩溃为一个候选 |
 | 一切健康| 否 | 范围删除逻辑 |
 | 边界位置| 不适用 | 前任/继任者处理近端问题 |

 ## 边缘情况

 考虑：```
3 3
0 1 2 0
0 1 3 1
1 3
```在第一个声明之后，位置`1`和`2`从未知集合中删除。 间隔`[1,3]`仍然需要一个病人。 唯一剩下的候选人是`3`，因此算法发现该区间完全位于间隙内，其唯一未知位置是`3`和答案`YES`。 

现在考虑嵌套区间：```
5 3
0 1 5 1
0 2 4 1
1 3
```间隔`[2,4]`强于`[1,5]`。 该算法仅保留最小间隔。 删除较大的间隔不会更改任何有效的分配，这正是包含修剪正确的原因。 

最后，考虑：```
4 2
0 1 4 0
1 2
```位置`2`当健康间隔到达时立即删除。 该查询甚至从不检查积极约束并直接回答`NO`，这是唯一可能的结果。
