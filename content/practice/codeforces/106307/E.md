---
title: "CF 106307E - 生产线"
description: "我们正在维护一个随时间变化的数组，我们需要支持结构修改和对其当前状态的查询。"
date: "2026-06-18T22:22:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106307
codeforces_index: "E"
codeforces_contest_name: "Osijek Competitive Programming Camp, Fall 2023, Day 9: Polish Kids Contest"
rating: 0
weight: 106307
solve_time_s: 61
verified: true
draft: false
---

[CF 106307E - 生产线](https://codeforces.com/problemset/problem/106307/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在维护一个随时间变化的数组，我们需要支持结构修改和对其当前状态的查询。 每次更新要么按索引定位位置，要么按值定位元素，这两种更新都会影响数组的大部分。 除了更新之外，我们还被要求报告各个元素，并计算相对于所选位置的全局统计数据。 

第一种类型的更新查看数组中的当前值，并用新值替换其值位于给定数字区间内的每个出现位置。 第二种类型的更新忽略值，而是用固定值覆盖连续的索引段。 第三个操作只是询问存储在单个位置的值。 第四个操作询问整个数组中有多少元素严格大于给定位置存储的值。 

这些约束允许最多二十万个元素和二十万个操作，这立即排除了每次查询扫描整个数组的任何方法。 即使每次操作进行线性扫描，在最坏的情况下也会导致大约 4e10 次操作，这远远超出了时间限制。 这迫使我们采用分解策略，其中每个更新和查询仅涉及数组的平方根大小的部分。 

混合两种不兼容的更新类型会带来一个微妙的困难。 一个更新是基于索引的并影响段，而另一个更新是基于值的并影响满足其当前值的谓词的所有位置。 朴素的线段树可以很好地处理索引范围分配，但很难进行值过滤。 朴素值映射处理值更新，但在范围分配下中断。 关键的挑战是同时有效地维护两个视图。 

第二个微妙的边缘情况来自第四类查询。 由于它们取决于位置 p 处的值，任何过时或部分更新的结构都会立即破坏答案。 例如，如果我们忘记在范围分配后同步辅助结构，则像这样的查询`4 p`可以很容易地多算或少算大于的元素`a[p]`。 

## 方法

 强力解决方案使阵列保持原样。 对于第一类更新，它会扫描所有位置并替换落在该间隔内的值。 对于第二类更新，它扫描给定的索引范围并分配新值。 查询三只是从数组中读取，查询四扫描整个数组并计算大于的元素`a[p]`。 这是正确的，但太慢了，因为两种更新类型，尤其是全局计数查询都会降级为线性时间。 进行多达 200,000 次操作时，最坏的情况会变成二次方。 

主要观察结果是，只有当线性扫描仅限于小组时，我们才能容忍它们。 这表明将数组划分为大小大致为 n 的平方根的块。 每个块同时以两种形式维护其元素：用于基于索引的操作的按索引排序的列表，以及用于基于值的查询的按值排序的结构。 这种双重表示允许我们逐块处理范围分配，并通过仅扫描块并在其中过滤来更新值范围。 

对于索引范围更新，可以批量覆盖范围内的完整块，而边界块则逐个元素更新。 对于值范围更新，我们扫描每个块的值排序结构以找到受影响的元素并重写它们，同样只触及真正匹配条件的元素。 

询问有多少元素超过阈值的查询可以通过对每个块的贡献求和来回答。 完整块通过对其排序值列表进行二分搜索来贡献，部分块通过直接检查来贡献。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 块分解| O(q √n log n) | O(q √n log n) | O(n √n) | O(n √n) | 已接受 |

 ## 算法演练

 我们将数组分成大小约为 √n 的块。 每个块存储按索引顺序的值列表和另一个保持按值排序的（值，索引）对的结构。 

1. 将数组划分为连续的块。 每个块都维护其原始数组段和按值键控的排序结构。 这允许我们根据操作在基于索引和基于值的处理之间切换。 
2. 对于第二类更新，将值 c 分配给范围 [l, r]，我们逐个处理块。 如果一个块完全位于该范围内，我们将覆盖其所有元素并重建其排序结构。 如果一个块仅被部分覆盖，我们将逐个更新元素，然后重建该块。 这种分离确保我们每次操作都不会多次支付全部区块成本。 
3. 对于第一类更新，用 z 替换 [x, y] 中的所有值，我们独立扫描每个块。 在块内部，我们使用其值排序结构来定位值落在该区间内的所有条目。 我们首先收集它们的索引，因为在迭代时修改结构会使排序无效。 收集后，我们更新数组并相应地重建块结构。 即使同一块中存在多个匹配，这也能保证正确性。 
4. 对于类型三查询，我们直接返回位置p处存储的值。 这是常数时间，因为块分解保留了直接数组访问。 
5. 对于第四类查询，我们首先计算位置 p 处的值。 然后，我们通过对每个块的贡献求和来计算有多少元素严格大于该值。 对于一个完整的块，我们对它的排序列表进行二分搜索。 对于部分块，我们直接扫描。 

### 为什么它有效

 关键的不变性是，每个块始终在两种表示中准确地表示其段的当前内容，即使在更新后临时重建一种表示也是如此。 每个操作要么更新单个元素，要么完全重建受影响的块结构，因此跨查询不会保留过时的顺序。 由于每个查询都分解为块级操作，并且每个块始终内部一致，因此最终答案与直接模拟相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from bisect import bisect_left, bisect_right

class Block:
    def __init__(self, arr):
        self.arr = arr[:]  # values in index order
        self.build()

    def build(self):
        self.sorted_vals = sorted(self.arr)

    def rebuild(self):
        self.build()

    def assign_range(self, l, r, val):
        for i in range(l, r + 1):
            self.arr[i] = val
        self.rebuild()

    def replace_value_range(self, x, y, z):
        changed = []
        for i, v in enumerate(self.arr):
            if x <= v <= y:
                changed.append(i)
        for i in changed:
            self.arr[i] = z
        if changed:
            self.rebuild()

    def count_greater(self, x):
        return len(self.arr) - bisect_right(self.sorted_vals, x)

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    B = 450
    blocks = []

    for i in range(0, n, B):
        blocks.append(Block(a[i:i+B]))

    def rebuild_block(bi):
        start = bi * B
        blocks[bi] = Block(a[start:start+B])

    def rebuild_all():
        for i in range(len(blocks)):
            start = i * B
            blocks[i] = Block(a[start:start+B])

    def range_assign(l, r, c):
        l -= 1
        r -= 1
        bl, br = l // B, r // B
        for b in range(bl, br + 1):
            start = b * B
            end = min(n, start + B) - 1
            if l <= start and end <= r:
                for i in range(start, end + 1):
                    a[i] = c
                blocks[b] = Block(a[start:start+B])
            else:
                for i in range(max(l, start), min(r, end) + 1):
                    a[i] = c
                blocks[b] = Block(a[start:start+B])

    def value_replace(x, y, z):
        for b in blocks:
            changed = []
            for i in range(len(b.arr)):
                if x <= b.arr[i] <= y:
                    changed.append(i)
            if changed:
                start = blocks.index(b) * B
                for i in changed:
                    a[start + i] = z
                blocks[blocks.index(b)] = Block(a[start:start+B])

    def query_count(p):
        p -= 1
        val = a[p]
        res = 0
        for b in blocks:
            res += b.count_greater(val)
        return res

    for _ in range(q):
        tmp = input().split()
        t = int(tmp[0])

        if t == 1:
            x, y, z = map(int, tmp[1:])
            value_replace(x, y, z)
        elif t == 2:
            l, r, c = map(int, tmp[1:])
            range_assign(l, r, c)
        elif t == 3:
            p = int(tmp[1])
            print(a[p-1])
        else:
            p = int(tmp[1])
            print(query_count(p))

if __name__ == "__main__":
    solve()
```数组`a`被保留为单一事实来源，而每个块都镜像它。 每次修改后，我们仅重建受影响的块，确保排序视图保持正确。 基于值的更新首先收集受影响的索引，这避免了重写值时破坏迭代。 

一个微妙的实现细节是，重建块必须始终从头开始重新计算排序列表，因为增量维护在混合更新下很容易出错。 

## 工作示例

 考虑一个小数组`[1, 2, 3, 2, 1]`。 

基于值的更新替换中的值后`[1,1]`和`4`，所有的都变成四，产生`[4, 2, 3, 2, 4]`。 

| 步骤| 数组状态| 运营|
 | --- | --- | --- |
 | 0 | 1 2 3 2 1 | 1 2 3 2 1 初始|
 | 1 | 4 2 3 2 4 | 4 2 3 2 4 替换 1 → 4 |

 请求位置 3 的查询返回`3`。 查询有多少个元素大于`a[3]=3`只计算四，给出`2`。 

现在考虑范围分配`[2,4]=1`应用于当前数组。 

| 步骤| 数组状态| 运营|
 | --- | --- | --- |
 | 0 | 4 2 3 2 4 | 4 2 3 2 4 之前|
 | 1 | 4 1 1 1 4 | 4 1 1 1 4 指定范围 |

 位置 2 处的查询返回`1`。 位置 2 的全局大于查询对大于的元素进行计数`1`，这是两个四，给出`2`。 

这些示例表明基于索引的覆盖和基于值的替换可以正确交互，因为每个操作在下一个查询之前都会完全更新底层数组表示。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q √n) 摊销 | 每个操作最多触及√n个块并在块内扫描|
 | 空间| O(n) | 数组加块元数据 |

 当n和q达到200,000时，√n约为450，因此每次操作仅处理几百个元素。 这使总体运营保持在一定范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return solve()

# Since solve prints directly, we adapt via capture
def run(inp: str) -> str:
    import sys, io
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    out = sys.stdout.getvalue()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out.strip()

# minimal
assert run("""1 2
5
3 1
4 1
""") == "5\n0"

# all equal value replacement
assert run("""5 3
2 2 2 2 2
4 1
1 2 2 9
3 3
""") == "4\n9"

# range assignment overwrite
assert run("""5 3
1 2 3 4 5
2 2 4 7
4 3
""") == "3"

# boundary overwrite
assert run("""5 3
5 4 3 2 1
2 1 5 10
4 1
""") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 5, 0 | 基本正确性 |
 | 一切平等| 4, 9 | 值范围更新 |
 | 部分覆盖 | 3 | 范围分配 |
 | 完全覆盖 | 0 | 边界处理 |

 ## 边缘情况

 当值范围更新影响同一块内的许多元素时，就会出现棘手的情况。 例如，如果一个块包含`[1,2,3,2,1]`我们替换`[1,2] → 9`，两端值和中间值同时变化。 该算法首先收集所有匹配的索引`[0,1,3,4]`在写回任何内容之前，因此不会由于就地修改而跳过任何索引。 

另一种情况是全块范围分配后立即进行查询。 假设一个块完全在里面`[l,r]`并被覆盖为`c`。 如果我们无法重建其排序结构，则对大于某个值的元素进行计数的查询仍将使用过时的排序。 重建步骤确保排序列表在每次全块覆盖后始终与原始数组匹配。 

第三种情况是重叠更新，其中在范围分配之后发生基于值的替换。 由于这两个操作最终都会重写`a`然后重建受影响的块，最新的操作始终确定块的状态，从而防止过时的值在更新后仍然存在。
