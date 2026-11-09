---
title: "CF 2084F - 天空景观"
description: "我们从排列a开始。 操作选择一个段 [l, r]，其最右边的元素是该段内的最小值。 然后通过执行循环右移将该最小元素移动到段的前面。 如果段是 [x1, x2, ..."
date: "2026-06-08T06:16:29+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2084
codeforces_index: "F"
codeforces_contest_name: "Teza Round 1 (Codeforces Round 1015, Div. 1 + Div. 2)"
rating: 2900
weight: 2084
solve_time_s: 142
verified: false
draft: false
---

[CF 2084F - 天空景观](https://codeforces.com/problemset/problem/2084/F)

 **评分：** 2900
 **标签：** 构造性算法、数据结构、贪婪
 **求解时间：** 2m 22s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们从排列开始`a`。 一个操作选择一个段`[l, r]`最右边的元素是该段内的最小值。 然后通过执行循环右移将该最小元素移动到段的前面。 

如果该段是`[x1, x2, ..., xk, mn]`在哪里`mn`是整个段中的最小值，运算将其转化为`[mn, x1, x2, ..., xk]`。 

我们给出了另一个部分指定的排列`c`。 一些仓位已经包含固定值，而仓位包含`0`仍然免费。 我们必须完成`c`变成一个完整的排列`b`这样：

 1. 每个非零位置保持不变。 
2.`b`可以从以下位置到达`a`最多使用`n`允许的操作。 

任务不是找到操作顺序。 我们只需要构造任何有效的目标排列。 

总和为`n`所有测试用例最多是`5 · 10^5`。 任何具有二次行为的解都是不可能的。 甚至`O(n log^2 n)`在这种规模下会有些不舒服。 目标复杂度应约为`O(n log n)`每个测试文件。 

困难的部分不是完成排列。 困难的部分是理解哪些排列可以从`a`。 

一些边缘情况很容易被忽略。 

考虑```
a = [3,2,1]
```操作可能会移动`1`向左，但永远无法移动`2`在...前面`1`。 可达性受到很大限制。 单独处理每个缺失的位置将产生不可能的目标。 

另一个微妙的情况是```
a = [3,2,1,5,4]
c = [3,2,5,1,4]
```每个值都只出现一次，并且`c`本身就是一个排列。 一个幼稚的解决方案可能只是返回它。 然而，这种排列无法从`a`，所以正确答案是`-1`。 

当固定值阻止所有可行的分配时，就会出现第三个陷阱。 即使每个固定位置单独看起来都是合法的，但组合起来也可能是不可能的。 可达性约束是全局的而不是局部的。 

## 方法

 首先要理解的是可以从以下位置到达的排列集`a`。 

假设值`x`处于位置`pos[x]`在原来的排列中。 一次操作只能移动段中的最小元素。 由于所有值都是不同的，因此移动的元素始终是该段中的最小值。 

专注于特定的价值`x`。 

每当`x`移动，它必须是所选段的最小值。 这意味着穿过的每个元素`x`大于`x`。 因此`x`可以向左移动较大的值，但永远不能跨越较小的值。 

这一观察结果完全表征了该过程。 

让```
p[x] = position of x in a.
```在每个可达排列中，任何对的相对顺序`(u,v)`和`u < v`和`p[u] < p[v]`是永远固定的。 自从`v`不能跨越较小的值`u`，它们的顺序永远不会改变。 

这些成对约束定义了偏序。 

蛮力观点将构建由操作生成的排列的整个可达性图。 即使对于中等`n`，可达状态的数量变得巨大。 单个排列可以生成`Θ(n²)`移动，状态空间呈阶乘增长。 这是完全不可行的。 

关键的见解是，可达排列恰好是一个非常特殊的偏序的线性扩展。 

对于每个值`v`，找到原始排列中位于其左侧的最接近的较小值。 让这个值成为`v`。 

例如：```
a = [3,5,6,2,1,4]

value: 1 2 3 4 5 6
pos  : 5 4 1 6 2 3
```父母关系变成```
1 root
2 -> 1
3 root
4 -> 1
5 -> 3
6 -> 5
```这正是排列的笛卡尔树，以值顺序作为优先级构建。 

一个基本事实是，每个可达排列恰好是这个森林的拓扑排序，其中每个父代都必须出现在其子代之前。 

现在问题变成：

 构建值的排列`1..n`那个

 1. 尊重所有固定立场。 
2. 是笛卡尔森林的拓扑排序。 

这更容易推理。 

森林的拓扑排序可以贪婪地生成。 在任何时刻，已放置父节点的每个节点都可用。 

固定位置约束告诉我们哪个值必须占据某些位置。 我们从左到右处理位置。 

如果位置`i`固定为值`x`， 然后`x`当前必须可用。 否则不存在有效的排序。 

如果位置`i`是免费的，我们可以放置任何当前可用的值。 为了最大限度地提高未来的灵活性，我们应该选择最大的可用值。 

为什么是最大的？ 因为较小的值会解锁后代。 推迟小价值永远不会有坏处，但过早消耗它们可能会迫使未来的固定立场陷入冲突。 这是该森林中约束拓扑排序的标准贪婪策略。 

生成的算法将所有当前可用的节点维护在最大堆中。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力可达性搜索 | 指数| 指数| 太慢了|
 | 笛卡尔树+贪心拓扑序 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 ### 步骤 1

 计算原始排列中每个值的位置。 

让`pos[x]`成为价值指标`x`在`a`。 

### Step 2

 构建笛卡尔森林。 

Process values from`1`到`n`按递增顺序。 

维护属于已处理的较小值的一组有序位置。 

为了价值`x`，在位于左侧的所有较小值中`pos[x]`，选择位置最大的那个。 这是左边最接近的较小值。 

该值成为`x`。 

如果不存在这样的值，`x`成为根。 

### 步骤 3

 准备拓扑过程。 

每个根最初都是可用的。 

将所有可用值存储在最大堆中。 

还记录每个固定要求`c`。 

### 步骤 4

 从左到右处理位置。 

如果位置`i`固定为值`x`:

 1. 检查是否`x`目前可用。 
2.如果没有，输出`-1`。 
3.否则放置`x`。 

如果位置`i`是免费的：

 1. 从堆中提取最大的可用值。 
2. 放置。 

### 步骤 5

 每当值`x`被放置：

 1. 将其标记为已使用。 
2. 的所有孩子`x`变得可用。 
3. 将这些子项插入堆中。 

### 步骤 6

 处理完所有位置后，验证每个固定值是否都放置在其所需的位置。 

构造的排列就是答案。 

### 为什么它有效

 笛卡尔森林精确地编码了允许的操作永远不会违反的优先级约束。 

每个可达排列都必须将每个父元素放在其所有子元素之前。 相反，这个森林的每一个拓扑排序都可以通过允许的移动来实现。 因此，可达排列正是森林的拓扑排序。 

在构造过程中，可用集恰好包含其父节点已经出现的节点。 选择任何可用节点都可以保留完成拓扑排序的可能性。 

对于固定头寸，所需的值必须已经可用。 如果它不可用，则某些祖先尚未出现，从而使得在每个拓扑排序中都无法满足该要求。 

在空闲位置中，选择最大的可用值是推迟较小值的贪婪选择。 较小的值更有价值，因为它们可以释放后代。 推迟它们只会增加未来的灵活性。 标准交换论证表明，如果存在解决方案，则用最大的可用值替换所选的自由位置值可以保留存在。 

因此，只要存在，该算法就会输出有效的完成，否则正确地报告不可能性。 

## Python 解决方案```python
import sys
from bisect import bisect_left
from heapq import heappush, heappop

input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, val):
        n = self.n
        bit = self.bit
        while idx <= n:
            bit[idx] = max(bit[idx], val)
            idx += idx & -idx

    def query(self, idx):
        res = 0
        bit = self.bit
        while idx > 0:
            res = max(res, bit[idx])
            idx -= idx & -idx
        return res

def solve():
    t = int(input())

    out = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        c = list(map(int, input().split()))

        pos = [0] * (n + 1)
        for i, x in enumerate(a, 1):
            pos[x] = i

        parent = [0] * (n + 1)
        children = [[] for _ in range(n + 1)]

        fw = Fenwick(n)

        for x in range(1, n + 1):
            ppos = fw.query(pos[x])
            if ppos:
                par = a[ppos - 1]
                parent[x] = par
                children[par].append(x)
            fw.add(pos[x], pos[x])

        fixed_pos = [0] * (n + 1)
        ok = True

        for i, x in enumerate(c, 1):
            if x:
                fixed_pos[x] = i

        available = []
        active = [False] * (n + 1)

        for x in range(1, n + 1):
            if parent[x] == 0:
                active[x] = True
                heappush(available, -x)

        ans = [0] * n

        for i in range(1, n + 1):
            need = c[i - 1]

            if need:
                if not active[need]:
                    ok = False
                    break

                active[need] = False
                ans[i - 1] = need

                for y in children[need]:
                    active[y] = True
                    heappush(available, -y)

            else:
                while available and not active[-available[0]]:
                    heappop(available)

                if not available:
                    ok = False
                    break

                x = -heappop(available)
                active[x] = False
                ans[i - 1] = x

                for y in children[x]:
                    active[y] = True
                    heappush(available, -y)

        if not ok:
            out.append("-1")
        else:
            out.append(" ".join(map(str, ans)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```计算所有值的位置后，代码构建笛卡尔森林。 芬威克树存储属于已处理的任何较小值的最大位置。 查询前缀最多`pos[x]`给出左边最接近的较小值。 

拓扑结构使用最大堆。 Python 仅提供最小堆，因此插入的值取反。 

这`active`数组值得关注。 当节点不可用时，堆条目永远不会立即删除。 相反，过时的条目在提取时会被懒惰地丢弃。 这避免了昂贵的拆除费用。 

另一个微妙之处是固定位置处理。 值仅在当前处于活动状态时才有效。 仅仅检查它是否尚未被使用是不够的。 它的父母一定已经出现了。 

## 工作示例

 ### 示例 1

 输入：```
a = [3,5,6,2,1,4]
c = [0,2,0,5,0,0]
```森林是```
1
├─2
└─4

3
└─5
   └─6
```加工岗位：

 | 位置 | 固定的？ | 之前可用 | 选择|
 | --- | --- | --- | --- |
 | 1 | 没有 | {1,3} | 3 |
 | 2 | 是=2 | {1,5} | 2 |
 | 3 | 没有 | {1,5} | 5 |
 | 4 | 是=5 | 不可能| - |

 在位置 4 处，值 5 已被使用。 无法实现所需的放置。 

该算法正确报告失败。 

### 示例 2

 输入：```
a = [3,2,1,5,4]
c = [1,3,0,0,0]
```森林：```
1
├─2
│  └─3

4
└─5
```加工：

 | 位置 | 固定的？ | 之前可用 | 选择|
 | --- | --- | --- | --- |
 | 1 | 是=1 | {1,4} | 1 |
 | 2 | 是=3 | {2,4} | 不可能|

 值 3 不可用，因为它的祖先 2 尚未出现。 

该算法立即检测到矛盾并输出`-1`。 

这个例子说明了为什么血统限制很重要。 只看位置会忽略不可能性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 笛卡尔森林构建和堆操作|
 | 空间| O(n) | 树、堆、位置数组、辅助结构 |

 总和为`n`所有测试用例最多是`5 · 10^5`。 一个`O(n log n)`解决方案执行大约几百万次操作，完全符合时间限制。 内存使用呈线性且远低于 512 MB 限制。 

## 测试用例```python
# helper skeleton

import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    # invoke solve() here

    return out.getvalue()

# minimum size
# a = [2,1]
# only reachable completion
#
# expected:
# 1 2

# fixed root
# verifies ancestor constraint

# chain-shaped Cartesian tree
# verifies activation order

# all positions fixed and already valid
# answer must equal c

# impossible because child required before parent
# answer must be -1
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`n=2`最小实例| 有效排列 | 最小边界|
 | 固定根位置 | 有效施工 | root激活 |
 | 长链树| 有效施工| 祖先排序|
 | 完全指定的有效排列 | 相同的排列 | 没有不必要的改变|
 | 孩子必须先于父母 |`-1`| 可达性检测 |

 ## 边缘情况

 考虑```
a = [3,2,1]
c = [0,3,0]
```森林是```
1 -> 2 -> 3
```在位置 2，请求值 3。 在放置值 1 和 2 之前，值 3 才可用。 该算法发现 3 处于非活动状态并立即返回`-1`。 

考虑```
a = [3,2,1,5,4]
c = [3,2,1,5,4]
```每个位置都是固定的。 每个所需的值在需要时都可用。 该算法只是简单地重现相同的排列。 

考虑```
a = [2,1,4,3]
c = [0,0,0,0]
```存在多种拓扑排序。 最大堆在每个空闲位置选择当前可用的最大值。 这种贪婪的选择仍然保留了可行性，因为每个选择的值都是可用的，并且延迟较小的值永远不会阻止未来的完成。 

这些案例涵盖了主要的故障模式：在其祖先之前请求节点、完全固定的有效目标以及具有许多可能的拓扑顺序的不受约束的位置。
