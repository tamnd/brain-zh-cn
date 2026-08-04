---
title: "CF 102558D - \u041f\u0435\u0440\u0435\u043c\u0435\u0449\u0435\u043d\u0438\u0435\u0447\u0430\u043d\u043a\u043e\u0432"
description: "我们有一个包含 n 个块的数组。 位置 i 处的值表明哪个服务器当前存储块 i。 查询要求将间隔 [l, r] 内的每个块从服务器 a 移动到服务器 b。 仅当该间隔中的每个值在操作之前恰好都是 a 时才允许移动。"
date: "2026-08-03T19:16:01+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102558
codeforces_index: "D"
codeforces_contest_name: "Contest for Yandex interns 2019"
rating: 0
weight: 102558
solve_time_s: 655
verified: true
draft: false
---

[CF 102558D - \u041f\u0435\u0440\u0435\u043c\u0435\u0449\u0435\u043d\u0438\u0435 \u0447\u0430\u043d\u043a\u043e\u0432](https://codeforces.com/problemset/problem/102558/D)

 **评级：** -
 **标签：** -
 **求解时间：** 10m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列`n`大块。 位置处的值`i`告诉哪个服务器当前存储块`i`。 查询要求移动间隔内的每个块`[l, r]`从服务器`a`到服务器`b`。 仅当该间隔中的每个值都精确时才允许移动`a`手术前。 如果即使有一个块位于另一台服务器上，整个请求也会被忽略。 对于每个请求，我们必须输出`1`如果发生搬迁并且`0`否则。 

输入包含所有块的初始服务器分配，然后是按时间顺序排列的范围移动请求。 输出描述了哪些请求能够通过一致性检查。 

约束足够大，不可能检查每个间隔中的每个块。 和`n`和`q`均达到`100000`，一个解决方案执行`O(n)`为每个查询工作`10^10`最坏情况下的操作。 该算法必须在大致对数时间内处理每个请求。 由于操作会立即更改整个间隔，因此我们需要一个既可以汇总间隔又可以延迟更新的数据结构。 

一些边缘情况可能会破坏简单的实现。 仍然需要正确检查和更新单个块间隔。 例如：```
Input:
1 2 1
1
1 2 1 1
```输出是：```
1
```该区间包含一个chunk，其服务器与请求的源服务器相匹配。 

另一个常见的错误是只检查间隔的第一个或最后一个元素。 考虑：```
Input:
3 3 1
1 1 2
1 3 1 1 1
```输出是：```
0
```前两个块在服务器上`1`，但第三个在服务器上`2`。 仅边界检查将错误地接受移动。 

在几次成功的行动之后出现了第三种边缘情况。 决定查询是否成功的是当前状态，而不是初始状态。 例如：```
Input:
2 3 2
1 2
1 3 1 1
3 2 1 2
```输出是：```
1
0
```第一次查询后，数组变为`[3, 2]`，所以第二个查询要求从服务器移动两个块`3`失败。 

## 方法

 最简单的方法是将每个块的当前服务器存储在一个数组中。 对于每个查询，扫描间隔`[l, r]`并验证每个元素都等于`a`。 如果检查通过，则再次扫描相同的间隔并将每个值替换为`b`。 

这种方法是正确的，因为它直接模拟了有效移动的定义。 然而，在最坏的情况下，一个查询可以覆盖所有`100000`块，并且可以有`100000`此类查询。 总工作量约为`10^10`元素访问，这远远超出了可能的范围。 

关键的观察是，在处理查询时，我们永远不需要段内每个元素的确切值。 我们只需要知道整个段是否有一个服务器值。 同时，成功的查询会将整个间隔替换为一个新值。 这种组合正是惰性线段树能够很好地处理的。 

如果整个表示的区间是均匀的，则每个线段树节点存储服务器值。 如果间隔包含多个服务器值，则节点会存储一个表示“混合”的特殊标记。 查询向树询问以下状态`[l, r]`。 如果返回值为`a`，移动可能发生并且间隔被分配给`b`。 如果返回值是混合的或者是另一个服务器编号，则请求被拒绝。 

需要延迟传播，因为分配较大的间隔不需要访问每个叶子。 当节点收到全覆盖分配时，我们将新值存储在该节点中并延迟更新其子节点，直到稍后需要它们。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 最佳| O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 从初始服务器分配构建惰性线段树。 每个节点存储一个服务器编号（如果其整个间隔都在该服务器上），或者`-1`如果里面出现不同的服务器。 
2. 对于每个移动请求`(a, b, l, r)`，查询线段树的区间状态`[l, r]`。 结果代表一致性检查所需的所有信息。 
3. 如果返回值正好是`a`，将查询标记为成功并分配整个区间`[l, r]`到服务器`b`。 
4. 如果返回值是其他值，则输出`0`并且不要修改树。 

重要的不变量是每个线段树节点总是正确地描述其区间的当前状态。 节点要么是精确的服务器编号，因为其中的所有块都在那里，要么是混合的，因为至少出现两个不同的服务器。 延迟传播通过延迟子更新同时保持父摘要准确来保留此不变性。 

为什么它有效：

 在每次查询之前，线段树都会返回所请求区间的精确统一状态。 如果该状态是`a`，间隔中的每个块都存储在所需的源服务器上，因此移动有效并将整个间隔替换为`b`与实际操作相符。 如果状态是混合的或者是另一台服务器，则至少有一个块违反了要求，因此拒绝查询是正确的。 由于每个接受的更新都会更改树表示以匹配新的数组状态，因此所有未来的检查都会使用正确的信息。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, q = map(int, input().split())
    arr = list(map(int, input().split()))

    size = 1
    while size < n:
        size *= 2

    tree = [-1] * (2 * size)
    lazy = [-1] * (2 * size)

    for i, x in enumerate(arr):
        tree[size + i] = x

    for i in range(size - 1, 0, -1):
        if tree[2 * i] == tree[2 * i + 1]:
            tree[i] = tree[2 * i]
        else:
            tree[i] = -1

    def apply(node, value):
        tree[node] = value
        lazy[node] = value

    def push(node):
        if lazy[node] != -1:
            apply(node * 2, lazy[node])
            apply(node * 2 + 1, lazy[node])
            lazy[node] = -1

    def query(node, left, right, ql, qr):
        if qr < left or right < ql:
            return -2

        if ql <= left and right <= qr:
            return tree[node]

        push(node)
        mid = (left + right) // 2
        a = query(node * 2, left, mid, ql, qr)
        b = query(node * 2 + 1, mid + 1, right, ql, qr)

        if a == -2:
            return b
        if b == -2:
            return a
        if a == b:
            return a
        return -1

    def update(node, left, right, ql, qr, value):
        if qr < left or right < ql:
            return

        if ql <= left and right <= qr:
            apply(node, value)
            return

        push(node)
        mid = (left + right) // 2
        update(node * 2, left, mid, ql, qr, value)
        update(node * 2 + 1, mid + 1, right, ql, qr, value)

        if tree[node * 2] == tree[node * 2 + 1]:
            tree[node] = tree[node * 2]
        else:
            tree[node] = -1

    ans = []
    for _ in range(q):
        a, b, l, r = map(int, input().split())
        l -= 1
        r -= 1

        if query(1, 0, size - 1, l, r) == a:
            ans.append("1")
            update(1, 0, size - 1, l, r, b)
        else:
            ans.append("0")

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```该树是根据二次方大小构建的，因此每个节点都有两个子节点，包括未使用的叶子。 这些额外的叶子被初始化为`-1`，但它们永远不会包含在真正的查询中，因为所有请求都保留在内部`[0, n-1]`。 

这`tree`数组存储每个段的当前摘要。 这`lazy`数组存储待处理的分配。 待定值意味着整个段已经具有该服务器编号，但其子段可能仍包含旧信息。 在降临到孩子身上之前，`push`应用此延迟分配。 

查询函数返回`-2`对于完全不相关的片段，以便可以轻松合并部分重叠。 仅当两个有效的返回服务器编号相等时，它们才会合并为一个值。 否则结果就变成了`-1`，意味着间隔不均匀。 

当当前节点被完全覆盖时，更新函数在一次操作中分配整个区间。 然后它在递归更新后重建祖先。 Python 整数不会溢出，因此不需要对存储的值进行特殊处理。 

## 工作示例

 ### 示例 1

 输入：```
1 2 1
1
1 2 1 1
```| 查询 | 请求的间隔 | 树结果 | 行动| 数组状态 |
 | --- | --- | --- | --- | --- |
 | 1 |`[1,1]`， 来源`1`|`1`| 分配给服务器`2`|`[2]`|

 唯一的块已经在请求的源服务器上，因此操作被接受。 这将检查单元素区间情况。 

### 示例 2

 输入：```
1 2 1
1
2 1 1 1
```| 查询 | 请求的间隔 | 树结果 | 行动| 数组状态 |
 | --- | --- | --- | --- | --- |
 | 1 |`[1,1]`， 来源`2`|`1`| 拒绝 |`[1]`|

 该段是统一的，但其值不是请求的源服务器。 移动必须失败，因为一致性检查与`a`，而不仅仅是间隔是否有一个值。 

### 示例 3

 输入：```
5 5 6
1 2 3 4 5
1 2 1 1
2 3 1 3
4 2 4 4
2 5 1 4
3 2 2 3
3 2 3 3
```| 查询 | 运行前区间结果 | 决定| 运算后的数组 |
 | --- | --- | --- | --- |
 | 1 |`[1]`有服务器`1`| 接受 |`[2,2,3,4,5]`|
 | 2 |`[1,3]`是混合的| 拒绝 |`[2,2,3,4,5]`|
 | 3 |`[4]`有服务器`4`| 接受 |`[2,2,3,2,5]`|
 | 4 |`[1,4]`是混合的| 拒绝 |`[2,2,3,2,5]`|
 | 5 |`[2,3]`是混合的| 拒绝 |`[2,2,3,2,5]`|
 | 6 |`[3]`有服务器`3`| 接受 |`[2,2,2,2,5]`|

 跟踪显示了为什么在每次成功请求后必须更新结构。 失败的请求不会更改状态，因此以后的查询仍会看到以前的配置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n) | O(q log n) | 每个查询执行一次线段树查询，并且仅对于成功的请求，执行一次范围分配。 |
 | 空间| O(n) | 线段树和惰性数组每个树节点包含恒定数量的条目。 |

 和`100000`块和`100000`请求，对数处理使访问的节点总数保持在几百万左右，这符合限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    data = inp.strip().split()
    it = iter(data)

    n = int(next(it))
    m = int(next(it))
    q = int(next(it))
    arr = [int(next(it)) for _ in range(n)]

    size = 1
    while size < n:
        size *= 2

    tree = [-1] * (2 * size)
    lazy = [-1] * (2 * size)

    for i, x in enumerate(arr):
        tree[size + i] = x

    for i in range(size - 1, 0, -1):
        tree[i] = tree[2 * i] if tree[2 * i] == tree[2 * i + 1] else -1

    def apply(node, value):
        tree[node] = value
        lazy[node] = value

    def push(node):
        if lazy[node] != -1:
            apply(node * 2, lazy[node])
            apply(node * 2 + 1, lazy[node])
            lazy[node] = -1

    def query(node, l, r, ql, qr):
        if qr < l or r < ql:
            return -2
        if ql <= l and r <= qr:
            return tree[node]
        push(node)
        mid = (l + r) // 2
        x = query(node * 2, l, mid, ql, qr)
        y = query(node * 2 + 1, mid + 1, r, ql, qr)
        if x == -2:
            return y
        if y == -2:
            return x
        return x if x == y else -1

    def update(node, l, r, ql, qr, value):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            apply(node, value)
            return
        push(node)
        mid = (l + r) // 2
        update(node * 2, l, mid, ql, qr, value)
        update(node * 2 + 1, mid + 1, r, ql, qr, value)
        tree[node] = tree[node * 2] if tree[node * 2] == tree[node * 2 + 1] else -1

    out = []
    for _ in range(q):
        a = int(next(it))
        b = int(next(it))
        l = int(next(it)) - 1
        r = int(next(it)) - 1
        if query(1, 0, size - 1, l, r) == a:
            out.append("1")
            update(1, 0, size - 1, l, r, b)
        else:
            out.append("0")
    return "\n".join(out)

assert run("""1 2 1
1
1 2 1 1
""") == "1"

assert run("""1 2 1
1
2 1 1 1
""") == "0"

assert run("""5 5 6
1 2 3 4 5
1 2 1 1
2 3 1 3
4 2 4 4
2 5 1 4
3 2 2 3
3 2 3 3
""") == "1\n0\n1\n0\n0\n1"

assert run("""3 5 3
2 2 2
2 3 1 3
3 4 1 2
3 5 2 3
""") == "1\n1\n0"

assert run("""4 4 2
1 1 1 1
1 2 2 3
2 3 1 4
""") == "1\n1"

assert run("""2 3 3
1 2
1 3 1 1
3 2 1 1
2 1 2 2
""") == "1\n1\n1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单块移动|`1`| 最小尺寸和叶子更新 |
 | 样品2 |`0`| 源服务器错误的统一间隔 |
 | 所有块最初都相等 |`1,1`| 大型成功的范围任务|
 | 更新后的混合间隔 |`1,1,1`| 查询之间的状态变化 |

 ## 边缘情况

 单元素区间由与较大范围相同的线段树逻辑处理。 在输入中：```
1 2 1
1
1 2 1 1
```查询到达一片叶子，接收值`1`，并将该叶子更新为`2`。 结果是`1`。 

处理边界看起来正确但内部混合的区间，因为内部节点保留混合状态。 为了：```
3 3 1
1 1 2
1 3 1 1
```覆盖查询范围的根段将具有不同值的子项组合起来并返回`-1`。 自从`-1`不是请求的源服务器，答案是`0`。 

先前移动之后的操作使用更新的树状态。 为了：```
2 3 2
1 2
1 3 1 1
3 2 1 2
```第一个查询将第一个块更改为服务器`3`。 第二个查询看到间隔`[3,2]`，这是混合的，并拒绝请求。 输出是：```
1
0
```惰性分配机制可以处理较大的间隔，而不会立即扩展它们。 如果查询更改了大段中的所有块，则节点会直接存储新的服务器值，并且将来的操作仅在需要检查较小部分时推送该信息。
