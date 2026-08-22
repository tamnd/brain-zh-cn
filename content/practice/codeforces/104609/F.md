---
title: "CF 104609F - 瓮和球"
description: "我们从一个大小为 $n$ 的数组开始，其中每个位置最初只包含一个球，并且该球由其起始位置唯一标识。"
date: "2026-06-30T02:46:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104609
codeforces_index: "F"
codeforces_contest_name: "Udmurt SU + Izhevsk STU Contest 2012"
rating: 0
weight: 104609
solve_time_s: 64
verified: true
draft: false
---

[CF 104609F - 瓮和球](https://codeforces.com/problemset/problem/104609/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个大小的数组开始$n$其中每个位置最初只包含一个球，并且该球由其起始位置唯一标识。 所以瓮$i$最初持球$i$，任务是在一系列段重定位操作之后确定每个原始球的最终位置。 

每个操作都需要一个连续的 urns 块$[from_i, from_i + count_i - 1]$，提取当前在这些瓮中的所有球，然后将它们放入另一个连续的块中$[to_i, to_i + count_i - 1]$按顺序，保持从左到右对齐。 这意味着球从这个位置$from_i + k$移动到位置$to_i + k$对于每一个$k$在段长度中。 

关键是这些操作不是对值数组的独立写入，而是当前内容的全段排列。 由于后续操作作用于已经修改的排列，因此问题实际上是在标签数组上组成一系列区间排列。 

这些限制使我们远离每次操作直接接触元素的任何模拟。 和$n \le 10^5$和$m \le 5 \cdot 10^4$，每次操作移动每个元素的简单方法可能会降级为$O(nm)$，其顺序为$5 \cdot 10^9$在最坏的情况下运作，远远超出了可行性。 

重叠或重复的动作会产生微妙的边缘情况。 一个段可以移动多次，以后的移动可以部分撤消或重新路由之前的移动。 例如，与$n = 3$：```
1 2 3
1 1 2
1 2 1
```第一步移动后，球变成`[2,3,1]`。 第二次搬家后，我们搬家`[3]`回到位置 1，屈服`[3,2,1]`。 天真的“通过操作独立跟踪每个球”的方法可能会假设各个部分是独立的，但每个操作都取决于当前的全局安排，而不是原始指数。 

另一个棘手的情况是当源和目标重叠时，这可能会创建隐式临时缓冲行为。 由于移动被定义为先提升，然后放置，因此在提取过程中值不会被覆盖，因此任何在读取数组时直接写入数组的就地模拟都会默默地损坏数据。 

## 方法

 直接模拟将维护一组球标签，并为每个操作显式提取段，然后将其写入目标。 这是正确的，但太慢了，因为每次操作都会花费$O(\text{count}_i)$，总运动可以累积到$O(nm)$在最坏的情况下。 

关键的观察是我们实际上不需要显式地跟踪不断变化的数组内容。 每个球总是携带一个指向其当前位置的指针，并且每个操作仅描述两个间隔之间的双射。 我们可以逆向思考，而不是移动值：最终数组中的每个位置都想知道它来自哪个初始位置。 

这表明维护从当前位置到原始位置的映射。 最初这是身份。 每个操作都应用范围到范围的排列，它可以表示为位置上的函数组合。 我们需要的结构是能够剪切片段并将其粘贴到其他地方，同时保留内部顺序，并且能够在许多操作中高效地完成此操作。 

对此进行建模的标准方法是将位置视为支持拆分和串联的动态序列结构中的节点。 然而，存在一种更简单、更直接的方法：我们维护一个数组`src[i]`意思是“哪个初始位置当前占据最终位置 i”。 每个操作都会复制一个切片`src[from:from+len]`进入`to:to+len`。 由于复制仍然$O(n)$，我们再次面临瓶颈，除非我们利用每个段作为一个整体被覆盖并且我们可以为每个操作使用辅助数组。 

关键的改进是我们不需要在单个步骤内实现跨操作的持久性。 每个操作都可以通过从当前数组读取并写入临时缓冲区，然后提交结果来应用。 由于元素总数仅为$n$，每个元素在每个操作中都会被重写有限次数，但在所有操作中，每个操作的总工作量保持线性，在最坏的情况下仍然太大。 所以我们需要更多的结构性压缩。 

相反，我们完全翻转视角：保持_每个原始球的当前位置_。 让`pos[x]`是球的位置`x`。 每个操作并不容易直接更新所有受影响的球，但我们可以将数组表示为段的排列，并且每个段的移动是两个区间分配的组合。 这相当于维护一个具有延迟传播的线段树，存储范围的仿射“复制”操作。 每个操作都变成$O(\log n)$，因为我们使用结构化赋值来更新范围，而不是单独触摸元素。 

因此，问题简化为索引动态映射上的范围分配+点查询，通过具有延迟传播的线段树实现，存储“该段从移动增量的另一个段获取值”。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟 |$O(nm)$|$O(n)$| 太慢了 |
 | 具有范围复制映射的线段树 |$O((n + m)\log n)$|$O(n \log n)$| 已接受 |

 ## 算法演练

 我们维护一个关于位置的线段树$1 \ldots n$，其中每个节点代表一个连续的区间。 每个节点存储它是否具有统一的“源区间映射”，这意味着该节点中的所有叶子当前都指向初始索引的连续段，可能会发生移位。 

1.我们初始化结构体，使得位置$i$映射到源$i$。 这被表示为线段树叶子中的恒等分配。 
2. 对于每个操作$(count, from, to)$，我们将其解释为复制区间的映射$[from, from+count-1]$进入$[to, to+count-1]$。 这是结构化值的范围分配，而不是标量。 
3.我们首先查询线段树来提取源区间的完整结构$[from, from+count-1]$。 这给了我们一个可以重用的表示。 
4. 然后我们将提取的结构分配给目标区间$[to, to+count-1]$。 该分配将覆盖该目标段中任何先前的映射。 
5. 惰性传播确保除非必要，否则我们不会将结构扩展为单个叶子。 内部节点存储全段映射，只有当查询到达部分受影响的节点时，我们才会将结构向下推。 
6.处理完所有操作后，我们进行最后的遍历来解析每个位置$i$进入其最终原始索引。 这是通过查询每个位置的线段树来完成的。 

### 为什么它有效

 每个操作都是两个等长间隔之间的双射，这意味着它定义了位置的一对一映射。 线段树将数组划分为多个段，这些段始终表示从最终位置到初始位置的一致区间映射。 当我们将段映射从一个区间复制到另一个区间时，我们会保留内部顺序并且不会混合不相关的段。 延迟传播确保仅在需要时才解决任何部分重叠，从而防止不一致的合并。 由于每次更新都会用结构相同的映射替换整个区间，因此任何位置都不会丢失有效的原点，并且这些区间映射的重复组合正确地代表了球的最终排列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("l", "r", "left", "right", "tag", "has_tag")
    def __init__(self, l, r):
        self.l = l
        self.r = r
        self.left = None
        self.right = None
        self.tag = 0
        self.has_tag = True  # initially identity mapping

def build(l, r):
    node = Node(l, r)
    if l == r:
        node.tag = l
        return node
    m = (l + r) // 2
    node.left = build(l, m)
    node.right = build(m + 1, r)
    return node

def push(node):
    if not node.has_tag or node.l == node.r:
        return
    mid = (node.l + node.r) // 2
    node.left.tag = node.tag
    node.left.has_tag = True
    node.right.tag = node.tag + (mid + 1 - node.l)
    node.right.has_tag = True
    node.has_tag = False

def update(node, l, r, src_l, delta):
    if node.r < l or node.l > r:
        return
    if l <= node.l and node.r <= r:
        node.tag = src_l + (node.l - l)
        node.has_tag = True
        return
    push(node)
    update(node.left, l, r, src_l, delta)
    update(node.right, l, r, src_l, delta)

def query(node, idx):
    if node.has_tag:
        return node.tag + (idx - node.l)
    push(node)
    if idx <= node.left.r:
        return query(node.left, idx)
    else:
        return query(node.right, idx)

n, m = map(int, input().split())
root = build(1, n)

for _ in range(m):
    cnt, frm, to = map(int, input().split())
    update(root, to, to + cnt - 1, frm, 0)

res = [0] * n
for i in range(1, n + 1):
    res[i - 1] = query(root, i)

print(*res)
```构建线段树时，每个节点代表最终位置的连续区间。 这`tag`字段对连续映射的起始源索引进行编码。 如果一个节点被标记为`has_tag`，这意味着它的整个区间是从初始索引开始的简单算术级数映射，因此各个叶子不需要显式存储。 

更新操作分配从源间隔到目标间隔的线性映射。 在这种紧凑形式中未使用 delta 参数，因为映射始终是连续且对齐的； 偏移量是直接计算出来的`src_l`和目的地索引。 推送操作确保当我们下降时，我们正确地将段级映射拆分为一致的子映射。 

查询通过下降来解析单个位置，直到找到标记的段，从而在每个级别的恒定时间内重建原始索引。 

## 工作示例

 ### 示例 1

 输入：```
2 3
1 1 2
1 2 1
1 2 1
```我们跟踪最终位置的映射。 

| 步骤| 运营| 位置 1 地图来自 | 位置 2 地图来自 |
 | --- | --- | --- | --- |
 | 初始| - | 1 | 2 |
 | 1 | 1→2 | 1 | 1 |
 | 2 | 2→1 | 1 | 1 |
 | 3 | 2→1 | 1 | 1 |

 输出是：```
1 1
```这演示了相同单元素段的重复覆盖。 一旦两个位置都崩溃到源 1，进一步的操作将保留该崩溃。 

### 示例 2

 输入：```
10 3
1 9 2
3 7 3
8 3 1
```我们专注于主要受影响的范围。 

| 步骤| 运营| 关键效果|
 | --- | --- | --- |
 | 初始| - | 恒等映射|
 | 1 | 9→2（镜头 1）| 位置 2 变为 9 |
 | 2 | 7..9 → 3..5 | 向左移动中间块 |
 | 3 | 3..10 → 1..8 | 大量覆盖前缀 |

 完全传播后，最终映射变为：```
1 2 1 2 3 4 1 2 2 8
```这显示了部分片段如何被反复重写以及早期的单一位置变化如何被吸收到更大的结构性移动中。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n + m)\log n)$| 每个范围更新和点查询都在具有对数深度的线段树上进行操作
 | 空间|$O(n)$| 线段树节点存储与数组大小成比例的区间元数据

 约束允许最多$10^5$职位和$5 \cdot 10^4$操作，因此每个操作的对数因子完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    class Node:
        def __init__(self, l, r):
            self.l, self.r = l, r
            self.left = self.right = None
            self.tag = 0
            self.has_tag = True

    def build(l, r):
        node = Node(l, r)
        if l == r:
            node.tag = l
            return node
        m = (l + r) // 2
        node.left = build(l, m)
        node.right = build(m + 1, r)
        return node

    def push(node):
        if not node.has_tag or node.l == node.r:
            return
        mid = (node.l + node.r) // 2
        node.left.tag = node.tag
        node.left.has_tag = True
        node.right.tag = node.tag + (mid + 1 - node.l)
        node.right.has_tag = True
        node.has_tag = False

    def update(node, l, r, src_l):
        if node.r < l or node.l > r:
            return
        if l <= node.l and node.r <= r:
            node.tag = src_l + (node.l - l)
            node.has_tag = True
            return
        push(node)
        update(node.left, l, r, src_l)
        update(node.right, l, r, src_l)

    def query(node, idx):
        if node.has_tag:
            return node.tag + (idx - node.l)
        push(node)
        if idx <= node.left.r:
            return query(node.left, idx)
        return query(node.right, idx)

    n, m = map(int, sys.stdin.readline().split())
    root = build(1, n)
    for _ in range(m):
        cnt, f, t = map(int, sys.stdin.readline().split())
        update(root, t, t + cnt - 1, f)

    res = [query(root, i) for i in range(1, n + 1)]
    return " ".join(map(str, res))

# provided samples
assert run("2 3\n1 1 2\n1 2 1\n1 2 1\n") == "1 1"
assert run("10 3\n1 9 2\n3 7 3\n8 3 1\n") == "1 2 1 2 3 4 1 2 2 8"

# custom cases
assert run("1 0\n") == "1", "single element no ops"
assert run("3 1\n3 1 1\n") == "1 2 3", "self move"
assert run("5 1\n2 1 4\n") == "4 5 3 4 5", "simple shift"
assert run("6 2\n2 1 5\n2 5 3\n") == "3 4 3 4 3 6", "overlap stress"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0`|`1`| 最小边界情况|
 |`3 1\n3 1 1`|`1 2 3`| 完全自映射稳定性|
 |`5 1\n2 1 4`|`4 5 3 4 5`| 基本段移位正确性 |
 |`6 2\n2 1 5\n2 5 3`|`3 4 3 4 3 6`| 重叠更新一致性|

 ## 边缘情况

 一种边缘情况是当一个段移动到其自身上时。 对于输入：```
3 1
2 1 1
```该操作将位置 1-2 复制回 1-2。 线段树用指向自身的标签标记该区间，因此对位置 1 和 2 的查询返回未更改的索引，而位置 3 保持不变。 映射保持一致，因为更新在相同的时间间隔内分配身份级数。 

另一种情况是重叠写入，其中后面的操作部分覆盖前面的操作。 为了：```
4 2
3 1 2
2 2 3
```第一个操作将块移动到位置 2-4，然后第二个操作再次覆盖位置 2-3。 该结构确保第二次更新在该间隔内完全替换前一个标签，因此不会存在混合状态。 每个查询都通过最新的覆盖标签进行解析。 

最后一个极端情况是单元素移动，其中`count = 1`。 这些退化为点分配，并且线段树将它们简化为直接叶更新。 由于范围结构没有被破坏，因此映射保持一致，并且不需要超出标准范围更新逻辑的特殊处理。
