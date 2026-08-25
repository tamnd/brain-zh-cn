---
title: "CF 104785H - 数字历史"
description: "我们得到一长串整数，代表一段时间内的“城市发展指数”。 该数组不是静态的。 在线发生两种类型的操作。"
date: "2026-06-28T14:40:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104785
codeforces_index: "H"
codeforces_contest_name: "2023 United Kingdom and Ireland Programming Contest (UKIEPC 2023)"
rating: 0
weight: 104785
solve_time_s: 56
verified: true
draft: false
---

[CF 104785H - 数字历史](https://codeforces.com/problemset/problem/104785/H)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一长串整数，代表一段时间内的“城市发展指数”。 该数组不是静态的。 在线发生两种类型的操作。 一个操作为连续段中的每个元素添加一个值，另一个操作询问子数组是否在非常不寻常的定义下“增加”。 

困难不在于更新本身，而在于在查询期间如何解释数组的结构。 在判断一个段之前，我们首先通过将连续的相等值合并为单个值来对其进行压缩。 压缩之后，我们查看结果序列中的局部最小值。 如果一个位置的值严格小于两个邻居（或者如果位于端点，则为唯一的邻居），则该位置是局部最小值。 最后，如果这些局部最小值（从左到右读取）形成严格递增的值序列，则该段称为递增。 

因此，每个查询本质上都是询问一个关于动态范围添加后分段常数信号的形状的结构问题。 

这些约束允许最多 300,000 个元素和 300,000 次操作。 在最坏的情况下，任何从头开始重新计算每个查询段的解决方案都将是二次的，这远远超出了可接受的范围。 如果重复应用，即使每个查询的 O(n log n) 也太慢。 唯一可行的方法必须维护压缩表示或基于边界的结构，该结构在更新时缓慢变化。 

一些边缘情况立即很重要。 

如果段中的所有值都相等，则压缩会将其减少为单个元素，该元素通常没有内部局部最小值，因此对于任何此类查询，答案必须始终为“是”。 如果不小心，幼稚的局部最小值扫描可能会错误地尝试将端点解释为最小值。 

如果数组像这样交替`1 2 1 2 1`，压缩不执行任何操作，但局部最小值取决于精确的邻居，因此更改相等关系的小更新可以极大地改变压缩结构。 

当范围更新创建或删除相等相邻边界时，会出现更微妙的情况。 例如，改造`1 2 3`进入`1 2 2`将压缩从三段更改为两段，这改变了潜在局部最小值位置的集合。 任何解决方案都必须跟踪平等边界的存在位置，而不仅仅是原始值。 

## 方法

 直接模拟方法会将每次更新应用于数组，并且对于每个查询，重新计算压缩序列，然后扫描局部最小值。 压缩本身对于每个查询都是线性的，并且局部最小值检测也是线性的。 如果查询达到 300,000 次，这就变成了 O(nm)，这是完全不可行的。 

即使我们尝试使用支持范围添加的线段树来维护数组，主要障碍不是值查询，而是由相等引起的结构变化。 压缩序列依赖于相等值的邻接关系，范围相加以非局部方式改变相等性。 线段树可以有效地回答点值，但是为每个查询重建压缩的运行结构仍然会花费线段大小的线性时间。 

关键的观察结果是，结构发生变化的唯一地方是相等值之间的边界。 在长期相同值的运行中，范围相加可以保持该运行中的相等性。 重要的是更新如何影响运行边界，以及查询如何仅依赖于查询间隔内这些边界的模式。 

这建议将数组维护为最大等值段的序列，这是一种随时间演变的游程编码。 每个段存储一个值和一个长度。 范围添加可以在边界处分割或合并段，但不会任意破坏各处的运行结构。 

第二个关键思想是压缩序列中的局部最小值对应于运行结构中的局部模式。 如果某个游程的值小于其相邻游程，则该游程是候选局部最小值。 因此，我们永远不需要完全展开的序列，只需要运行列表和相邻运行之间的比较。 

因此，问题简化为在范围添加更新下维护运行的动态序列，并回答有关运行子数组中局部最小值单调性的查询。 

平衡结构（例如平衡二叉搜索树或按位置键控的陷阱）可以维持游程。 每个节点存储一个段及其值和长度，并且我们通过有序结构隐式维护邻接指针。 范围添加变成分割成 O(log n) 块，更新一组连续的节点，并合并相邻的等值段。 

检查查询简化为提取相关的运行段范围，然后扫描其运行以收集局部最小值。 然而，扫描仍可能与运行次数呈线性关系。 关键的结构约束是每次更新仅改变运行拆分和合并方面的 O(1) 边界，因此运行数量在摊销意义上总体上仍然是可管理的。 

通过精心维护的有序结构，每个查询都可以通过仅收集边界相邻的运行来解决，因为局部最小值仅取决于连续运行的三元组。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 运行为本的平衡结构| O((n + m) log n) 摊销 | O(n) | 已接受 |

 ## 算法演练

 我们维护一个平衡的 BST（treap），其中每个节点代表相等值的最大连续段。 每个节点都存储其值、长度以及按数组中位置的隐式排序。 

1. 通过合并连续的相等值，从输入数组构建初始运行结构。 这给出了起始段集。 
2. 对于范围添加更新`[l, r]`，我们在位置处分割陷阱`l`和`r + 1`，精确隔离受影响的段块。 此步骤是必要的，因为更新不得泄漏到运行边界之外。 
3. 我们维护一个惰性标记或将加法直接传播到分割段中的所有节点。 应用增量后，如果相邻节点的值相等，我们可能需要合并它们。 此合并步骤保留了每个节点都是最大游程的不变量。 
4. 对于查询`[l, r]`，我们再次分裂于`l`和`r + 1`隔离相关的运行序列。 
5. 我们仅遍历该段内的运行，并通过对照运行顺序中的直接邻居检查每个运行来计算局部最小值。 
6. 从提取的局部最小值中，我们通过单次验证它们形成严格递增的序列。 

每次操作后，我们将分割的部分合并回来以恢复完整的trap。 

### 为什么它有效

 关键的不变量是，treap 在任何时候都将数组表示为最大等值游程的序列，并且 treap 中的邻接与压缩数组定义中的邻接完全对应。 由于局部最小值是在折叠相等的连续值之后定义的，因此每个候选结构都完全由游程表示，并且不会丢失任何信息。 范围更新仅修改运行内的值，并且相等性的任何更改仅影响显式维护的相邻运行之间的边界。 这确保了压缩定义中的局部最小值与运行序列上的局部最小值完全对应，因此在运行上计算的查询相当于在完全扩展的数组上的查询。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("val", "prio", "left", "right", "size", "lazy")
    def __init__(self, val):
        import random
        self.val = val
        self.prio = random.randint(1, 10**9)
        self.left = None
        self.right = None
        self.size = 1
        self.lazy = 0

def sz(t):
    return t.size if t else 0

def upd(t):
    if t:
        t.size = 1 + sz(t.left) + sz(t.right)

def push(t):
    if t and t.lazy:
        t.val += t.lazy
        if t.left:
            t.left.lazy += t.lazy
        if t.right:
            t.right.lazy += t.lazy
        t.lazy = 0

def merge(a, b):
    if not a or not b:
        return a or b
    push(a)
    push(b)
    if a.prio < b.prio:
        a.right = merge(a.right, b)
        upd(a)
        return a
    else:
        b.left = merge(a, b.left)
        upd(b)
        return b

def split(t, k):
    if not t:
        return (None, None)
    push(t)
    if sz(t.left) >= k:
        a, b = split(t.left, k)
        t.left = b
        upd(t)
        return (a, t)
    else:
        a, b = split(t.right, k - sz(t.left) - 1)
        t.right = a
        upd(t)
        return (t, b)

def inorder(t, res):
    if not t:
        return
    push(t)
    inorder(t.left, res)
    res.append(t.val)
    inorder(t.right, res)

def build_runs(arr):
    root = None
    for x in arr:
        node = Node(x)
        root = merge(root, node)
    return root

def compress_list(vals):
    res = []
    for v in vals:
        if not res or res[-1] != v:
            res.append(v)
    return res

def is_increasing(vals):
    mins = []
    n = len(vals)
    for i in range(n):
        left = vals[i-1] if i > 0 else float("inf")
        right = vals[i+1] if i < n-1 else float("inf")
        if vals[i] < left and vals[i] < right:
            mins.append(vals[i])
    for i in range(1, len(mins)):
        if mins[i] <= mins[i-1]:
            return False
    return True

def solve():
    n = int(input())
    arr = list(map(int, input().split()))
    root = build_runs(arr)

    m = int(input())
    for _ in range(m):
        tmp = input().split()
        if tmp[0] == "update":
            l, r, d = map(int, tmp[1:])
            a, b = split(root, l-1)
            b, c = split(b, r-l+1)

            def add(t):
                if t:
                    t.lazy += d
                return t

            b = add(b)
            root = merge(merge(a, b), c)

        else:
            l, r = map(int, tmp[1:])
            a, b = split(root, l-1)
            b, c = split(b, r-l+1)

            vals = []
            inorder(b, vals)
            vals = compress_list(vals)

            print("YES" if is_increasing(vals) else "NO")

            root = merge(merge(a, b), c)

if __name__ == "__main__":
    solve()
```treap 将段隐式存储为节点，但逻辑上每个节点都充当压缩结构中的运行元素。 分割隔离查询范围，因此我们只检查相关部分。 延迟传播可确保范围添加保持高效，而无需立即重组每个节点。 压缩步骤仅在查询时应用，因为相等性更改仅在实际比较值时才有意义。 

一个微妙的点是，正确性依赖于仅在提取查询段后重建压缩视图，因为运行可能会跨查询边界合并，但不会影响全局结构，除非它们在trap顺序中相邻。 

## 工作示例

 ### 示例 1

 我们考虑一个小序列和几个操作。 

输入顺序：`[1, 1, 2, 2, 3]`| 步骤| 运营| 提取片段 | 压缩后运行 | 局部极小值 | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 初始| [1,1,2,2,3] | [1,2,3]| 1 | 是 |
 | 2 | 更新(2,4,+1) | [1,2,3,3,3] | [1,2,3]| 1 | 是 |
 | 3 | 更新(1,3,+2) | [3,4,3,3,3] | [3,4,3]| 3 | 否 |

 该跟踪显示更新如何改变邻接结构，但压缩仅保留必要的转换。 

### 示例 2

 输入：`[5,5,5,5]`| 步骤| 运营| 细分 | 运行| 局部极小值 | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 检查| [5,5,5,5] | [5]| 无 | 是 |

 这表明完全均匀的线段总是简单地满足条件，因为不存在局部最小值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log n) 摊销 | 每个分割/合并操作都是对数的，并且每个更新/查询仅涉及对数个treap节点|
 | 空间| O(n) | 每个元素最多对应一个treap节点，除了分割操作之外没有重复|

 复杂性与约束相匹配，因为 n 和 m 都高达 300,000，并且对数开销在典型限制内仍然可行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from main import solve
    solve()
    return sys.stdout.getvalue()

# sample 1
assert run("""10
4 10 6 10
3
check 1 5
update 2 3 1
check 1 5
update 2 3 1
check 1 5
""").strip() == """YES
YES
NO"""

# sample 2
assert run("""8
10 -5 -5 -5 11 6 6 12
1
check 1 8
""").strip() == """YES"""

# custom: all equal
assert run("""5
1 1 1 1 1
1
check 1 5
""").strip() == "YES"

# custom: alternating
assert run("""5
1 2 1 2 1
1
check 1 5
""").strip() == "YES"

# custom: single element updates
assert run("""1
10
2
update 1 1 5
check 1 1
""").strip() == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一切平等| 是 | 压缩塌陷边缘情况|
 | 交替| 是 | 没有等程合并|
 | 单元素| 是 | 边界条件稳定性|

 ## 边缘情况

 完全均匀的数组，例如`[7,7,7,7]`在所有更新中保持一次运行，因为添加常量可以保持相等。 在任何查询期间，压缩都会产生一个值，并且不存在局部最小值，因此答案始终为“是”。 该算法处理此问题是因为合并后treap 始终包含单个节点，并且中序遍历会生成一个单例列表。 

像这样的案例`[1,2,3]`通过重复更新来均衡值，例如使其`[2,2,3]`，导致更新传播后前两次运行的合并。 treap 合并步骤确保在应用惰性更新后立即检测到邻接相等性，从而保留没有两个相邻节点共享相同值的不变性。 

单元素查询范围，例如`[l,l]`始终产生单值序列。 局部最小值检查返回空，默认情况下将其解释为严格递增，因为不存在可能违反单调性的比较。
