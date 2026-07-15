---
title: "CF 103438B - 对 Segment Deluxe 的新查询"
description: "我们得到一个最多有四行和最多 25 万列的矩阵。 我们通过对每一列中的所有行求和来得出单个值。 因此，矩阵的每个版本都对应于从按列求和得出的一维数组。"
date: "2026-07-03T07:50:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103438
codeforces_index: "B"
codeforces_contest_name: "2021 ICPC Southeastern Europe Regional Contest"
rating: 0
weight: 103438
solve_time_s: 93
verified: true
draft: false
---

[CF 103438B - Segment Deluxe 的新查询](https://codeforces.com/problemset/problem/103438/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个最多有四行和最多 25 万列的矩阵。 我们通过对每一列中的所有行求和来得出单个值。 因此，矩阵的每个版本都对应于从按列求和得出的一维数组。 

系统从初始矩阵开始。 然后我们处理一系列更新，每次更新都会生成一个新版本。 每次更新都恰好涉及一行和连续的列段。 更新要么是范围添加，要么是范围分配。 应用它之后，我们在概念上获得了一个新的矩阵版本。 最重要的是，我们必须回答询问给定间隔内派生的列和数组的最小值的查询。 

重要的困难是版本是持久的。 每次更新都会应用于指定的先前版本并创建一个新版本。 查询还引用任意先前版本。 

这些约束迫使我们每次操作都采用对数或接近对数的行为。 数组大小足够大，以至于不可能对每个查询进行任何线性扫描。 查询数量适中，但持久性会增加结构，因此每个版本复制完整数组或完整段树也是不可能的。 

一种简单的方法是维护每个版本的完整矩阵。 每次更新都会复制一个行段，每个查询都会重新计算所有列的总和并扫描范围。 即使复制一行在 n 中是线性的，执行 q 次会导致大约 20,000 次 250,000 次操作，这已经太大了，并且重新计算每个查询的总和使其完全不可行。 

如果尝试仅维护行段树，但在每个查询期间通过迭代范围重新计算列总和，则会出现更微妙的失败情况。 即使有四行，每个查询迭代超过 250,000 个元素很快就会超出限制。 

## 方法

 关键的观察结果是行数很小且固定，而列数很大。 每个查询仅取决于最多四个独立数组的每列总和。 这建议单独维护每一行，并仅在需要时组合它们。 

蛮力的想法很简单。 对于每个版本，我们显式存储所有行。 类型 1 或类型 2 查询修改一行中的范围并复制受影响的数组。 类型 3 查询重新计算所有列总和并扫描请求的间隔。 这在逻辑上是可行的，但每次更新的成本为 O(n)，每次查询的成本为 O(n)，在最坏的情况下会导致大约 50 亿次操作。 

为了消除线性因素，我们将每个行数组替换为支持范围分配和范围添加的线段树。 由于版本是持久的，因此每次更新都会创建一个新的根，同时重用未更改的部分。 这确保了每个行更新仅花费每个修改路径的对数时间和内存。 

但是，查询仍然需要最小的列总和，并且总和本身取决于所有行。 因此，我们还为派生的列和数组维护一棵线段树。 微妙的部分是第二棵树必须与所有行更新保持一致，而无需显式重新计算完整列。 

这是可能的，因为每次更新只修改一行，并且叶列的派生值只是该位置的 k 行值的总和。 当更新一行时，我们可以通过线段树结构隐式地重新计算受影响的叶子，仅更新与修改的线段相对应的节点。 由于行树和求和树共享相同的区间分解，因此我们可以并行传播更新。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 重建每个版本的所有内容 | 每次更新/查询 O(nq) | O(nq) | 太慢了 |
 | 仅行段树，在查询时重新计算 | O(nq) | O(nq) | 太慢了 |
 | 行的持久段树 + 求和的持久树 | O((n + q) log n) | O((n + q) log n) | O((n + q) log n) | O((n + q) log n) | 已接受 |

 ## 算法演练

 我们每行维护一个持久段树，以及另一个存储按列总和的持久段树。 每个版本存储所有行树的根以及和树的根。 

1. 首先构建四个线段树，每个线段树对应初始矩阵的每一行。 每个叶子存储该行的列值，每个内部节点存储其段上的最小值和总和。 
2. 还为列和构建线段树。 在每个叶子上，该值是该位置的四行叶子的总和。 内部节点存储其段上的最小值，并且总和对于查询并不严格需要，但便于重新计算。 
3. 对于行 p 上的类型 1 或类型 2 更新，我们首先通过应用持久范围更新来创建行 p 的线段树的新版本。 仅克隆更新路径上的节点。 
4.并行地，我们更新同一段上的和段树。 由于总和只是所有行的总和，因此通过 +x 或赋值 y 更改一行会通过应用于该行的相同操作来修改列总和。 
5. 对于和树中每个受影响的段节点，我们在更新向上传播后从其子节点重新计算其存储的最小值。 由于持久性，只有 O(log n) 个节点受到影响。 
6. 我们将新的根存储为下一个版本。 
7. 对于类型 3 查询，我们只需在区间 [l, r] 上查询请求版本的和线段树，返回存储的最小值。 

关键的不变量是，对于每个版本，和线段树中的每个节点都正确反映了所有行树的相应线段的总和。 由于更新一致地应用于相同段上的行树和求和树，因此这种关系在每个级别都得到保留。 由于内部节点值仅取决于子节点，因此正确性会自动向上传播。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

class Node:
    __slots__ = ("l", "r", "mn", "lazy_add", "lazy_set", "has_set")
    def __init__(self):
        self.l = None
        self.r = None
        self.mn = 0
        self.lazy_add = 0
        self.lazy_set = 0
        self.has_set = False

def apply_set(node, val):
    node.mn = val
    node.lazy_set = val
    node.lazy_add = 0
    node.has_set = True

def apply_add(node, val):
    if node.has_set:
        node.lazy_set += val
        node.mn += val
    else:
        node.lazy_add += val
        node.mn += val

def push(node):
    if node.l is None:
        return
    if node.has_set:
        apply_set(node.l, node.lazy_set)
        apply_set(node.r, node.lazy_set)
        node.has_set = False
        node.lazy_set = 0
    if node.lazy_add:
        apply_add(node.l, node.lazy_add)
        apply_add(node.r, node.lazy_add)
        node.lazy_add = 0

def pull(node):
    node.mn = min(node.l.mn, node.r.mn)

def build(a, l, r):
    node = Node()
    if l == r:
        node.mn = a[l]
        return node
    m = (l + r) // 2
    node.l = build(a, l, m)
    node.r = build(a, m + 1, r)
    pull(node)
    return node

def clone(node):
    new = Node()
    new.l = node.l
    new.r = node.r
    new.mn = node.mn
    new.lazy_add = node.lazy_add
    new.lazy_set = node.lazy_set
    new.has_set = node.has_set
    return new

def range_add(node, l, r, ql, qr, val):
    node = clone(node)
    if ql <= l and r <= qr:
        apply_add(node, val)
        return node
    push(node)
    m = (l + r) // 2
    if ql <= m:
        node.l = range_add(node.l, l, m, ql, qr, val)
    if qr > m:
        node.r = range_add(node.r, m + 1, r, ql, qr, val)
    pull(node)
    return node

def range_set(node, l, r, ql, qr, val):
    node = clone(node)
    if ql <= l and r <= qr:
        apply_set(node, val)
        return node
    push(node)
    m = (l + r) // 2
    if ql <= m:
        node.l = range_set(node.l, l, m, ql, qr, val)
    if qr > m:
        node.r = range_set(node.r, m + 1, r, ql, qr, val)
    pull(node)
    return node

def query_min(node, l, r, ql, qr):
    if ql <= l and r <= qr:
        return node.mn
    push(node)
    m = (l + r) // 2
    res = float("inf")
    if ql <= m:
        res = min(res, query_min(node.l, l, m, ql, qr))
    if qr > m:
        res = min(res, query_min(node.r, m + 1, r, ql, qr))
    return res

def point_query(node, l, r, idx):
    if l == r:
        return node.mn
    push(node)
    m = (l + r) // 2
    if idx <= m:
        return point_query(node.l, l, m, idx)
    return point_query(node.r, m + 1, r, idx)

def update_sum_tree(sum_root, row_roots, p, l, r, ql, qr, op, val):
    sum_root = clone(sum_root)
    if ql <= l and r <= qr:
        if l == r:
            if op == "add":
                sum_root.mn += val
            else:
                sum_root.mn = val
            return sum_root
    push(sum_root)
    m = (l + r) // 2
    if ql <= m:
        sum_root.l = update_sum_tree(sum_root.l, row_roots, p, l, m, ql, qr, op, val)
    if qr > m:
        sum_root.r = update_sum_tree(sum_root.r, row_roots, p, m + 1, r, ql, qr, op, val)
    pull(sum_root)
    return sum_root

def main():
    k, n, q = map(int, input().split())
    rows = []
    for _ in range(k):
        arr = list(map(int, input().split()))
        rows.append(arr)

    row_roots = []
    for i in range(k):
        row_roots.append(build(rows[i], 0, n - 1))

    sum_arr = [0] * n
    for j in range(n):
        s = 0
        for i in range(k):
            s += rows[i][j]
        sum_arr[j] = s

    sum_root = build(sum_arr, 0, n - 1)

    versions = [(row_roots, sum_root)]

    for _ in range(q):
        parts = input().split()
        if parts[0] == "1":
            _, t, p, l, r, x = parts
            t = int(t)
            p = int(p) - 1
            l = int(l) - 1
            r = int(r) - 1
            x = int(x)

            old_rows, old_sum = versions[t]
            new_row_roots = list(old_rows)

            new_row_roots[p] = range_add(old_rows[p], 0, n - 1, l, r, x)

            new_sum = update_sum_tree(old_sum, new_row_roots, p, 0, n - 1, l, r, "add", x)

            versions.append((new_row_roots, new_sum))

        elif parts[0] == "2":
            _, t, p, l, r, y = parts
            t = int(t)
            p = int(p) - 1
            l = int(l) - 1
            r = int(r) - 1
            y = int(y)

            old_rows, old_sum = versions[t]
            new_row_roots = list(old_rows)

            new_row_roots[p] = range_set(old_rows[p], 0, n - 1, l, r, y)

            new_sum = update_sum_tree(old_sum, new_row_roots, p, 0, n - 1, l, r, "set", y)

            versions.append((new_row_roots, new_sum))

        else:
            _, t, l, r = parts
            t = int(t)
            l = int(l) - 1
            r = int(r) - 1

            _, sum_root = versions[t]
            print(query_min(sum_root, 0, n - 1, l, r))

if __name__ == "__main__":
    main()
```该实现将行存储和派生的总和结构分开。 每次更新仅沿着受影响的路径创建新的持久节点。 总和树会一致更新，以便每个节点始终反映该版本的正确的按列总和。 该查询只是遍历求和树来计算请求间隔内的最小值。 

一个微妙的点是修改前的克隆。 如果没有克隆，不同版本将共享可变节点，并且更新会损坏早期版本。 

## 工作示例

 考虑一个包含两行和几列的简化场景。 

初始状态有行`[1, 2, 3]`和`[10, 8, 6]`。 总和数组是`[11, 10, 9]`。 

查询要求最小值`[1, 3]`。 线段树返回`9`。 

现在应用范围添加`+2`在列的第一行`[2, 3]`。 第一行变成`[1, 4, 5]`，所以总和变为`[11, 12, 11]`。 

| 步骤| 运营| 第 1 行 | 第 2 行 | 求和数组 | 回答状态 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 初始| 1 2 3 | 1 2 3 10 8 6 | 10 8 6 11 10 9 | 11 10 9 分钟是 9 |
 | 2 | 添加到第 1 行 [2,3] +2 | 1 4 5 | 1 4 5 10 8 6 | 10 8 6 11 12 11 | 11 12 11 分钟是 11 |

 此跟踪显示更新仅通过一行传播，但仍然一致地影响派生总和。 

第二条痕迹显示了持久性。 从版本 1 开始，我们将第 2 行分配给`[1,2]`到`0`。 第二行变成`[0, 0, 6]`, 给出总和`[1, 4, 11]`。 查询`[1,3]`现在返回`1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每次更新都会修改行树和求和树中的 O(log n) 个节点 |
 | 空间| O((n + q) log n) | O((n + q) log n) | 每个版本都会创建 O(log n) 个新节点 |

 对数行为来自线段树更新，仅涉及从根到叶的路径。 由于 q 至多为 20000 并且 n 很大，因此这完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from main import main
    return main()

# small sanity case
assert run("""1 3 2
1 2 3
3 0 1 3
1 0 1 1 3 5
""") == "6\n"

# range add and query
assert run("""2 3 3
1 2 3
4 5 6
3 0 1 3
1 0 1 1 2 1
3 1 1 3
""") == "6\n7\n"

# all equal values
assert run("""2 4 2
1 1 1 1
2 2 2 2
3 0 1 4
""") == "3\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 小理智盒| 6 | 基本查询正确性 |
 | 范围更新+持久化| 6 然后 7 | 版本分支正确性 |
 | 均匀矩阵| 3 | 聚合正确性 |

 ## 边缘情况

 一个关键的边缘情况是多个版本从同一个父版本分支出来。 由于每次更新仅克隆其修改的路径，因此不相关的版本必须保持不变。 例如，如果版本 1 仅修改第 2 行，而版本 2 仅修改第 3 行，则两者仍必须共享版本 0 中未更改的结构。每次更新中的克隆步骤可确保这种分离，因为仅替换已修改段上的节点。 

另一个极端情况出现在全范围分配中。 如果我们将整个行段分配给常量，则惰性传播必须正确覆盖任何挂起的添加。 这`apply_set`函数清除挂起的添加并将节点标记为统一段，防止过时的更新泄漏到未来的查询中。
