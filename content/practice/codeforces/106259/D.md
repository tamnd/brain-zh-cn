---
title: "CF 106259D - AND、OR 和 XOR"
description: "给定一个整数数组，我们需要选择一个长度至少为 2 的子序列。 对于任何选定的子序列，我们计算两个按位聚合：所有选定数字的按位与和所有选定数字的按位或。"
date: "2026-06-18T23:38:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106259
codeforces_index: "D"
codeforces_contest_name: "CUET Inter University Programming Contest 2025"
rating: 0
weight: 106259
solve_time_s: 46
verified: true
draft: false
---

[CF 106259D - AND、OR 和 XOR](https://codeforces.com/problemset/problem/106259/D)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个整数数组，我们需要选择一个长度至少为 2 的子序列。 对于任何选定的子序列，我们计算两个按位聚合：所有选定数字的按位与和所有选定数字的按位或。 子序列的分数是这两个结果之间的异或。 任务是最小化所有有效子序列的分数。 

关键的观察结果是 AND 向下折叠位，而 OR 向上扩展位。 它们之间的 XOR 测量同一组的这两个极端压缩产生的最终位模式中的不一致。 我们正在搜索大小至少为 2 的所有子集，因此搜索空间是指数的，并且直接枚举是不可能的。 

约束条件很大，所有测试用例的元素总数高达三十万。 这立即消除了任何检查所有子集甚至所有对以及额外的每对处理的方法。 每个测试用例可接受的解决方案必须是线性或接近线性的。 

一种幼稚的方法可能会首先尝试所有对，并假设更大的子序列无法改善答案。 这已经很可疑了，因为添加元素会以不平凡的方式改变 AND 和 OR。 例如，添加第三个数字可以显着减少 AND，同时保持 OR 不变，从而可能降低 XOR 结果。 这意味着如果没有理由，仅成对推理是不够的。 

第二个微妙的问题是允许使用子序列，而不是子数组。 这消除了任何位置限制，并强调只有价值分布才重要，而不是排序。 

## 方法

 强力方法枚举大小至少为 2 的所有子序列，计算它们的 AND 和 OR，并评估 XOR。 对于每个子集，计算 AND 和 OR 所花费的时间与子集大小呈线性关系，因此总体复杂度与所有子集呈指数关系，即 n 的指数级。 即使限制为对也会给出 O(n²)，这对于 n 高达 3·10⁵ 来说已经失败了。 

关键的见解来自于检查 AND 和 OR 在多个元素中的行为方式。 对于固定位位置，仅当每个选定元素都设置了该位时，AND 才为 1，而如果至少一个元素设置了该位，则 OR 为 1。 对于任何位，该对（AND位、OR位）只能是(0,0)、(0,1)或(1,1)。 仅当这些不同时，异或才会起作用，这种情况恰好发生在“或”设置了一个位而“与”没有设置位时。 该条件意味着：在所选元素中，并非所有值都共享该位。 

现在考虑一下如果我们查看成对的情况会发生什么。 对于任何对 (x, y)，AND 为 x & y，OR 为 x | y，因此分数变为 (x & y) XOR (x | y)。 经典恒等式表明这等于 x XOR y。 这是因为对于每个位，当 x 和 y 之间的位不同时，AND 和 OR 完全不同，从而匹配 XOR 行为。 

这极大地简化了问题。 对于任何大小至少为 2 的子序列，其得分仅取决于其中是否存在至少一对实现类似 XOR 的小贡献。 由于添加更多元素不能减少所选集合内的最小成对异或，因此最佳子序列将始终由某个对实现。 任何更大的集合只会引入额外的对，并且分数不能低于最佳对。 

因此，问题简化为在所有对上找到 (a[i] & a[j]) XOR (a[i] | a[j]) 的最小值，这相当于在数组的所有对上找到最小 XOR。 

这将任务简化为经典的“最小 XOR 对”问题，可以使用按位 trie 在每次插入的线性时间内解决。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) 或更糟 | O(1) | O(1) | 太慢了|
 | 最小对 XOR 的按位 trie | O(n log A) | O(n log A) | O(n log A) | O(n log A) | 已接受 |

 ## 算法演练

 ### 最佳方法

1. 将每个数字视为 31 位整数，并逐一处理数字，将它们插入到二进制 trie 中。 每个 trie 节点存储对应于位 0 和位 1 的两个子节点。这种结构使我们能够有效地找到 XOR 意义上最接近的先前插入的数字。 
2. 对于每个传入的数字，在插入之前，查询字典树以找到与其异或最小的数字。 这是通过尽可能贪婪地尝试遵循相同的位来完成的，因为匹配位在 XOR 中产生 0 贡献，否则我们将被迫采取相反的分支。 
3. 查询时，沿路径累加异或值。 每次我们被迫发散时，我们都会在该位位置增加成本。 这会在先前插入的数字中构建最佳可能的匹配。 
4. 使用为每个元素找到的最小异或来更新全局答案。 这确保了我们考虑所有对，因为每个元素都与所有先前的元素恰好配对一次。 
5. 将当前数字插入到 trie 中，以便将来查询可用。 

### 为什么它有效

 trie 保证对于每个数字，我们有效地选择另一个数字，从而最大限度地减少从最高有效位向下的按位不一致。 这种贪婪构造是最优的，因为较高位的任何改进都支配所有较低位。 由于以这种不对称方式每对都被考虑一次，因此所有对上的最小 XOR 只被捕获一次并且不会被错过。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("child",)
    def __init__(self):
        self.child = [None, None]

def insert(root, x):
    node = root
    for b in range(30, -1, -1):
        bit = (x >> b) & 1
        if node.child[bit] is None:
            node.child[bit] = Node()
        node = node.child[bit]

def query(root, x):
    node = root
    res = 0
    for b in range(30, -1, -1):
        bit = (x >> b) & 1
        if node.child[bit] is not None:
            node = node.child[bit]
        else:
            node = node.child[bit ^ 1]
            res |= (1 << b)
    return res

def solve():
    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        arr = list(map(int, input().split()))

        root = Node()
        insert(root, arr[0])

        ans = float('inf')

        for i in range(1, n):
            x = arr[i]
            ans = min(ans, query(root, x))
            insert(root, x)

        out.append(str(ans))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该解决方案为每个测试用例构建一个二进制特里树。 每个数字从最高有效位向下逐位插入。 查询函数优先选择匹配位来遍历 trie，仅在必要时发散，并累积生成的 XOR 成本。 第一个元素在处理之前插入，以确保每个后续元素至少有一个候选伙伴。 

31 位的选择符合值最多为 10⁹ 的约束。 使用固定深度可以避免动态位长度检查的开销。 

## 工作示例

 ### 示例 1

 输入：```
1
3
1 2 3
```我们先插入1。 

| 步骤| 当前 x | trie 中的最佳匹配 | 异或结果 | 最佳答案 |
 | --- | --- | --- | --- | --- |
 | 1 | 2 | 1 | 3 | 3 |
 | 2 | 3 | 1 | 2 | 2 |

 然后插入 2 和 3 确保考虑所有对。 最小值为 1，通过配对 2 和 3 实现。 

该跟踪显示每个元素都与之前的元素进行比较，保证完全对覆盖，而无需重新计算所有对。 

### 示例 2

 输入：```
1
4
5 1 7 3
```| 步骤| 当前 x | trie 中的最佳匹配 | 异或结果 | 最佳答案 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 5 | 4 | 4 |
 | 2 | 7 | 5 | 2 | 2 |
 | 3 | 3 | 1 | 2 | 2 |

 最终答案是2，由多对完成。 这显示了多个候选者如何产生相同的最佳 XOR，并且 trie 确保所有候选者都被隐式检查。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log A) | O(n log A) | 每次插入和查询遍历31位|
 | 空间| O(n log A) | O(n log A) | 每个数字最多贡献 31 个 trie 节点 |

 n 的总和为 3·105，每次操作都是常数因子 31，在时间限制内很合适。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import inf

    class Node:
        __slots__ = ("child",)
        def __init__(self):
            self.child = [None, None]

    def insert(root, x):
        node = root
        for b in range(30, -1, -1):
            bit = (x >> b) & 1
            if node.child[bit] is None:
                node.child[bit] = Node()
            node = node.child[bit]

    def query(root, x):
        node = root
        res = 0
        for b in range(30, -1, -1):
            bit = (x >> b) & 1
            if node.child[bit] is not None:
                node = node.child[bit]
            else:
                node = node.child[bit ^ 1]
                res |= (1 << b)
        return res

    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        arr = list(map(int, input().split()))
        root = Node()
        insert(root, arr[0])
        ans = inf
        for i in range(1, n):
            ans = min(ans, query(root, arr[i]))
            insert(root, arr[i])
        out.append(str(ans))
    return "\n".join(out)

# sample
assert run("1\n3\n1 2 3\n") == "1"

# minimum size
assert run("1\n2\n0 0\n") == "0"

# identical values
assert run("1\n4\n7 7 7 7\n") == "0"

# increasing pattern
assert run("1\n4\n1 2 4 8\n") == "3"

# mixed case
assert run("1\n5\n5 1 7 3 2\n") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 0 0 | 0 | 相同的值|
 | 1 2 4 8 | 1 2 4 8 3 | 结构化位模式|
 | 5 1 7 3 2 | 5 1 7 3 2 1 | 混合互动|

 ## 边缘情况

 对于所有值都相同的数组，每对产生零异或，并且特里树立即找到相同的匹配，产生零。 该算法插入第一个值，并且每个后续查询在每个级别都会找到相同的位路径。 

对于严格的 2 的递增幂，每个数字恰好在一位位置上不同，并且 trie 强制在最高不同位处发散，从而产生可预测的 XOR 值。 贪婪遍历正确地识别了位空间中的最近邻居。 

对于有零的情况，首先插入零可确保所有将来的查询可以立即匹配零位，通常会产生非常小的 XOR 值。 trie 可以正确处理全零分支，无需特殊的大小写。
