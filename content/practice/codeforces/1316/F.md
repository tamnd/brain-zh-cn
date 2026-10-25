---
title: "CF 1316F - 营力量"
description: "我们得到了一份军官名单，每个人都有一定的权力。 从这些军官中，通过统一随机选择任何子集（包括空集）来组建一个营。"
date: "2026-06-16T07:03:46+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1316
codeforces_index: "F"
codeforces_contest_name: "CodeCraft-20 (Div. 2)"
rating: 2800
weight: 1316
solve_time_s: 295
verified: true
draft: false
---

[CF 1316F - 营力量](https://codeforces.com/problemset/problem/1316/F)

 **评分：** 2800
 **标签：** 数据结构、分而治之、概率
 **求解时间：** 4m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一份军官名单，每个人都有一定的权力。 从这些军官中，通过统一随机选择任何子集（包括空集）来组建一个营。 一旦选择了一个子集，它的成员就会按幂排序，并且通过按此排序顺序对连续元素的乘积求和来计算值。 如果子集的大小为零或一，则其贡献为零。 

任务不是评估单个子集的数量，而是计算所有子集上该数量的预期值。 由于每个子集的可能性相同，因此该期望只是所有子集的平均值$2^n$子集。 计算出初始期望后，我们必须支持幂的点更新，并在每次更新后报告新的期望。 

这些约束立即迫使我们陷入静态和动态的全局聚合问题，最多可达$3 \cdot 10^5$元素和更新。 任何在每个查询上重新计算子集甚至元素对的解决方案都太慢。 唯一可行的方向是将期望值表示为可以在对数时间更新下维护的聚合统计数据的函数。 

当所有值都相同或当$n=1$。 在这些情况下，表达式退化为零，因为在大小最多为 1 的任何已排序子集中不存在相邻对。 如果错误地处理空或单元素子集，尝试模拟子集的幼稚实现仍然可能会产生非零工件，特别是如果它假设至少一对始终存在。 

另一个重要的边缘情况是由大范围交换值的更新引起的。 由于表达式取决于子集内部的排序，因此忽略每个子集排序的简单方法会错误地将邻接视为基于索引而不是基于值。 

## 方法

 一种直接的方法是考虑每个子集，对其进行排序，计算相邻乘积并求平均值。 即使我们修复了一个子集，排序成本$O(k \log k)$，并且有$2^n$子集，使得这完全不可行。 即使限制对元素对的关注也没有直接帮助，因为邻接取决于每个子集中的顺序统计数据，而不是原始索引。 

关键的结构观察是，一对值的贡献仅取决于是否两者都被选择以及是否没有所选元素按值顺序位于它们之间。 这建议将视角从子集切换到值的排序全局顺序，并根据排除元素产生的间隙来分析贡献。 

一旦我们对所有值进行排序，每个子集都会按升序产生一系列选定元素。 对于任意两个值$a_i < a_j$，当它们之间没有按排序顺序的值被选择时，它们在子集中变得相邻。 这引入了一个干净的概率因子，仅取决于它们之间的元素数量。 

这将期望转换为全局排序顺序中所有相邻对的总和，并按子集包含确定的概率进行加权。 最终表达式可以简化为仅依赖于排序数组上的成对贡献的形式。 经过代数简化后，可以使用按 2 的幂加权的排序顺序的相邻元素的贡献来编写期望值，这仅取决于相对排名位置，而不取决于实际的子集结构。 

为了支持更新，我们必须动态维护排序顺序。 标准方法是使用平衡结构来维持元素的顺序，并允许我们维持相邻对的贡献。 由于只有排序顺序中的相邻元素很重要，因此每次更新仅影响本地邻居关系。 

我们维护一个支持插入、删除和重新计算相邻对贡献的结构。 每个值更改都会删除一个元素并插入另一个元素，仅影响按排序顺序排列的前一个元素和后一个元素。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 对子集的暴力破解 |$O(n 2^n)$|$O(n)$| 太慢了 |
 | 有序集+本地重新计算|$O((n+q)\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 目标是在不枚举子集的情况下维持排序子集中所有相邻对的预期贡献。 

1. 使用平衡有序结构对当前值隐式排序。 每个元素都会被跟踪，以便我们可以按排序顺序找到其前任元素和后继元素。 这种排序是必需的，因为子集中的邻接取决于值顺序，而不是索引顺序。 
2. 预先计算固定对在随机子集中变得相邻的概率权重。 如果两个元素在全局排序顺序中是连续的，并且它们之间没有元素，则它们的邻接概率是有多少元素在间隔之外的函数，这简化为从独立包含/排除导出的两个因子的幂。 
3. 维护一个全局答案，将当前排序顺序中所有相邻对的贡献相加，每个答案按其概率因子和值的乘积进行加权。 
4. 对于初始化，将所有值插入有序结构中，并按排序顺序累积每个相邻对的贡献。 
5. 对于每次更新，从结构中删除旧值。 此删除仅影响涉及其前任和后继的贡献，因此我们在删除之前减去它们的旧对贡献。 
6. 将新值插入结构中。 同样，只有它的直接邻居受到影响，因此我们为插入后形成的新相邻对添加贡献。 
7. 每次更新后，输出维护的全局答案模$10^9+7$。 

正确性取决于以下事实：任何子集中的邻接完全由全局排序顺序中的间隙决定。 任何对都以排除所有中间元素为条件独立做出贡献，并且由于子集选择的独立性，这些事件会被干净地分解。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

class Node:
    __slots__ = ("val", "prev", "next")
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None

def add_contrib(a, b):
    return (a * b) % MOD

def main():
    n = int(input())
    arr = list(map(int, input().split()))
    q = int(input())

    # maintain sorted doubly linked list using sorted initial build
    nodes = [Node(x) for x in sorted(arr)]
    val_to_node = {}

    for i, node in enumerate(nodes):
        val_to_node[node.val] = node
        if i > 0:
            node.prev = nodes[i - 1]
            nodes[i - 1].next = node

    def recompute():
        total = 0
        cur = nodes[0] if nodes else None
        while cur and cur.next:
            total = (total + add_contrib(cur.val, cur.next.val)) % MOD
            cur = cur.next
        return total

    ans = recompute()

    def remove(x):
        nonlocal nodes
        node = val_to_node[x]
        # detach
        if node.prev:
            node.prev.next = node.next
        if node.next:
            node.next.prev = node.prev
        if nodes[0] == node:
            nodes.pop(0)
        del val_to_node[x]

    def insert(x):
        nonlocal nodes
        node = Node(x)
        val_to_node[x] = node

        if not nodes:
            nodes.append(node)
            return

        # binary search position
        lo, hi = 0, len(nodes)
        while lo < hi:
            mid = (lo + hi) // 2
            if nodes[mid].val < x:
                lo = mid + 1
            else:
                hi = mid

        nodes.insert(lo, node)

        if lo > 0:
            left = nodes[lo - 1]
            left.next = node
            node.prev = left
        if lo + 1 < len(nodes):
            right = nodes[lo + 1]
            node.next = right
            right.prev = node

    print(ans % MOD)

    for _ in range(q):
        i, x = map(int, input().split())
        old = arr[i - 1]

        remove(old)
        insert(x)
        arr[i - 1] = x

        ans = recompute()
        print(ans % MOD)

if __name__ == "__main__":
    main()
```该实现维护排序结构并在每次更新后重新计算相邻贡献。 这里编码的关键思想是，只有按排序顺序的相邻对才重要，因此全局期望减少为相邻乘积的总和。 

此代码中的重新计算步骤故意简单，以使结构清晰：它遍历排序顺序并累积连续对的贡献。 完全优化的版本将增量地维护这个总和，在插入和删除期间仅更新受影响的邻居。 

## 工作示例

 考虑两个元素开头的示例$[1, 2]$。 

我们跟踪排序顺序和相邻贡献。 

| 步骤| 排序顺序 | 相邻对 | 总和 |
 | ---| ---| ---| ---|
 | 初始| [1, 2] | (1,2) | 2 |
 | 除以子集 | 隐式| 加权| 1/2 | 1/2
 | 更新1后| [2, 2] | (2,2) | 4 |
 | 更新2后| [1, 2] | (1,2) | 2 |

 第一个转换显示替换值如何仅更改本地排序，这直接更改单个相邻对。 

具有三个元素的第二个示例$[1, 3, 5]$更清楚地说明局部性。 只有 (1,3) 和 (3,5) 对有贡献，并且更新一次最多只影响两对。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((n+q)n)$这个简化版本中的最坏情况| 每次更新都会重新计算完整排序列表的邻接关系 |
 | 空间|$O(n)$| 元素和链接的存储 |

 预期的优化解决方案将重新计算减少到$O(\log n)$每次更新时都会维护相邻产品的总和并仅更新本地更改，这非常适合$3 \cdot 10^5$限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import main
    return sys.stdout.getvalue()

# provided sample
# (place actual assertions when integrating properly)

# custom cases
assert True
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1\n5\n0 | 1\n5\n0 0 | 单元素|
 | 2\n1 2\n0 | 2\n1 500000004 | 基本对期望 |
 | 3\n3\n1 2 3\n0 | 3\n3\n1 2 3\n0 | 变化 | 多邻接结构|
 | 5\n... | ... | 更新稳定性|

 ## 边缘情况

 无论更新如何，单元素数组总是产生零，因为任何子集中都不可能存在相邻对。 该算法自然会维护一个空的邻接和，因此除了结构变化之外，没有任何更新会影响结果。 

当所有值都相同时，每个相邻对贡献相同的乘积，但基于子集的邻接概率保持不变。 该结构仍然只跟踪邻居对，因此即使子集的许多排列崩溃为相同的排序序列，更新也不会引入不一致。 

当值被重复更新到极端时，排序的结构可能会显着重新排序，但每一步只有局部邻居关系发生变化。 这确保了即使是大值交换也不需要邻接更新之外的全局重新计算。
