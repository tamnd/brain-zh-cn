---
problem: 1311B
contest_id: 1311
problem_index: B
name: "WeirdSort"
contest_name: "Codeforces Round 624 (Div. 3)"
rating: 1200
tags: ["dfs and similar", "sortings"]
answer: passed_samples
verified: true
solve_time_s: 97
date: 2026-06-14
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a2ddd1f-d1b0-83ec-a3a6-913f2c755799
---

# CF 1311B - 怪异排序

 **评分：** 1200
 **Tags:** dfs and similar, sortings
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 37s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a2ddd1f-d1b0-83ec-a3a6-913f2c755799

 ---

 ## 解决方案

 ## 问题理解

 我们得到一个整数数组和一组有限的“交换权限”。 Each permission corresponds to a position`i`，这意味着我们可以交换这对`(a[i], a[i+1])`。 每个这样的交换都可以任意多次使用，因此我们可以有效地执行相邻交换，但只能在数组的某些边缘上进行。 

问题是我们是否可以仅使用这些允许的相邻交换将数组转换为完全非递减序列。 

重新解释这一点的一个有用方法是将数组视为由边连接的位置线。 如果位置`i`是在集合中`p`，那么之间有一条边`i`和`i+1`允许交换。 如果我们可以沿着连接的边序列交换，则该连接段内的元素可以任意重新排列，因为相邻的交换会在连接的组件内生成任何排列。 

这将问题转变为检查由允许的交换边引起的每个连接的组件是否可以独立排序以匹配全局排序的数组。 

限制很小：`n ≤ 100`和`t ≤ 100`。 这意味着即使是`O(n^2)`或者`O(n log n)`每个测试用例的解决方案很容易就足够了。 我们不需要先进的数据结构或繁重的图算法。 

一个天真的但不正确的想法是尝试贪婪地模拟交换，总是尽可能地交换以将元素移向排序顺序。 这可能会失败，因为局部贪婪交换无法捕获全局连接结构。 另一种不正确的方法是假设如果允许一个位置，它可以在一个方向上自由地移动元素，这忽略了必须重复且对称地应用交换。 

当允许的位置稀疏时，就会出现微妙的边缘情况。 例如，如果未提供交换位置，则数组必须已排序。 如果提供了所有位置，则数组始终可以排序，因为它的行为就像完全连接的线。 有趣的情况是部分连接，其中只能重新排列段。 

## 方法

 暴力解释将模拟所有可能的允许交换序列。 由于每个交换可以任意多次应用，因此这成为对相邻转置生成的排列的无界搜索。 最坏情况下，可达状态数为`n!`，即使对于`n = 10`。 

关键的见解是，允许位置上的邻接交换定义了索引图，并且该图的每个连接组件都允许其内部完全自由排列。 这意味着我们永远不需要模拟操作。 相反，我们只需要对通过允许的交换可相互访问的索引进行分组。 

一旦知道了组件，我们就可以提取属于每个组件的值，对它们进行排序，并验证将排序后的值放回到相同的索引中会产生一个全局排序的数组。 

这将问题从动态转换减少为静态分组和比较问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| 指数| 指数| 太慢了|
 | 组件 + 排序 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 我们将数组索引建模为节点`0`到`n-1`。 对于每个允许的交换位置`p`，我们连接`p-1`和`p`（基于 0 的索引）。 每个连接的分量代表其值可以任意排列的索引。 

然后，我们验证每个组件内部的排序是否足以生成全局排序的数组。 

1. 在索引上构建不相交集并集 (DSU) 或图邻接结构。 

每个允许的位置`p`连接索引`p-1`和`p`。 该模型直接交换能力。 
2. 计算索引图的连通分量。 

同一组件中的任何两个索引都可以通过一系列相邻交换来交换值。 
3. 对于每个组件，收集属于它的所有索引。 

我们正在对共享完全排列自由的位置进行分组。 
4. 从原始数组中提取与这些索引对应的值并对两者进行排序：

 一份来自原始数组的列表，一份来自目标排序数组位置的列表。 
5. 比较每个组件的两个多重集。 

如果任何组件无法匹配排序的目标分布，则排序是不可能的。 
6. 如果所有组件匹配，则输出“YES”，否则输出“NO”。 

### 为什么它有效

 关键的不变量是交换仅发生在允许的边上，因此值永远不能在不同的连接组件之间移动。 这意味着每个组件都会永远保留其多组值。 在组件内，相邻交换足以生成任何排列，因此组件内值的任何重新排列都是可以实现的。 

因此，问题简化为检查每个组件是否可以在全局排序数组中准确地分配其所需的值。 如果每个组件都与其所需的多重集匹配，则存在有效的交换序列； 否则，某些值必须跨越禁止边界，这是不可能的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        p = list(map(int, input().split()))

        dsu = DSU(n)

        for x in p:
            dsu.union(x - 1, x)

        groups = {}
        for i in range(n):
            root = dsu.find(i)
            if root not in groups:
                groups[root] = []
            groups[root].append(i)

        sorted_a = sorted(a)

        pos_map = {}
        for i in range(n):
            root = dsu.find(i)
            pos_map.setdefault(root, []).append(i)

        for root, indices in pos_map.items():
            original_vals = [a[i] for i in indices]
            target_vals = [sorted_a[i] for i in indices]

            if sorted(original_vals) != sorted(target_vals):
                print("NO")
                break
        else:
            print("YES")

if __name__ == "__main__":
    solve()
```DSU 在可以直接交换的索引之间建立连接。 并集步骤将每个允许的位置转换为两个相邻索引之间的边缘。 

构建组件后，我们迭代每个根并收集属于该组件的所有索引。 对于每个这样的组，我们将其当前包含的值与全局排序数组中应包含的值进行比较。 全局排序数组充当最终目标配置。 

关键的微妙之处在于使用索引而不是值进行分组。 一个常见的错误是试图直接对数字而不是位置进行推理，但操作约束是位置的。 

决赛`else`on 循环确保我们仅在没有组件未通过验证时打印“YES”。 

## 工作示例

 ### 示例 1

 输入：```
n = 4
a = [2, 1, 4, 3]
p = [1, 3]
```我们建立联系`(0,1)`和`(2,3)`，给出两个分量：`{0,1}`和`{2,3}`。 

| 组件| 指数| a 值 | 已排序的 a 值 | 排序后的目标值 |
 | ---| ---| ---| ---| ---|
 | 1 | [0,1]| [2,1]| [1,2]| [1,2]|
 | 2 | [2,3]| [4,3]| [3,4]| [3,4]|

 两个组件都匹配，所以答案是肯定的。 

这证实了独立的片段可以自由地重新排列。 

### 示例 2

 输入：```
n = 4
a = [4, 1, 2, 3]
p = [3, 2]
```边缘是`(2,3)`和`(1,2)`因此所有索引都连接到一个组件中`{0,1,2,3}`。 

| 组件| 指数| a 值 | 已排序的 a 值 | 排序后的目标值 |
 | ---| ---| ---| ---| ---|
 | 1 | [0,1,2,3]| [4,1,2,3] | [1,2,3,4] | [1,2,3,4] |

 乍一看，这似乎是有效的，但这正是粗心的实现如果不正确地拆分组件仍然可能失败的地方。 由于所有索引都是相连的，因此排序是完全可能的，答案是肯定的。 

现在考虑一个失败式的案例：```
a = [4,3,2,1], p = [1,3]
```组件有`{0,1}`和`{2,3}`。 

| 组件| 指数| a 值 | 已排序的 a 值 | 目标值|
 | ---| ---| ---| ---| ---|
 | 1 | [0,1]| [4,3]| [3,4]| [1,2]|
 | 2 | [2,3]| [2,1]| [1,2]| [3,4]|

 不匹配立即出现，所以答案是否定的。 

这些痕迹表明，正确性完全取决于尊重组件边界。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例的 O(n log n) | 组件内部的值排序在运行时占据主导地位
 | 空间| O(n) | DSU 阵列和分组存储 |

 和`n ≤ 100`和`t ≤ 100`，即使重复排序，这也足够快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
            self.size = [1]*n

        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x

        def union(self, a, b):
            ra, rb = self.find(a), self.find(b)
            if ra != rb:
                self.parent[rb] = ra

    def solve():
        t = int(input())
        out = []
        for _ in range(t):
            n, m = map(int, input().split())
            a = list(map(int, input().split()))
            p = list(map(int, input().split()))

            dsu = DSU(n)
            for x in p:
                dsu.union(x-1, x)

            sorted_a = sorted(a)

            comp = {}
            for i in range(n):
                r = dsu.find(i)
                comp.setdefault(r, []).append(i)

            ok = True
            for idxs in comp.values():
                if sorted([a[i] for i in idxs]) != sorted([sorted_a[i] for i in idxs]):
                    ok = False
                    break

            out.append("YES" if ok else "NO")

        return "\n".join(out)

    return solve()

# provided samples
assert run("""6
3 2
3 2 1
1 2
4 2
4 1 2 3
3 2
5 1
1 2 3 4 5
1
4 2
2 1 4 3
1 3
4 2
4 3 2 1
1 3
5 2
2 1 2 3 3
1 4
""") == """YES
NO
YES
YES
NO
YES"""

# custom cases
assert run("""1
3 0
3 2 1
""") == "NO", "no swaps"

assert run("""1
3 2
3 2 1
1 2
""") == "YES", "full connectivity"

assert run("""1
5 1
5 4 3 2 1
2
""") == "NO", "limited swap blocks"

assert run("""1
4 2
1 3 2 4
2 3
""") == "YES", "middle swap only"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 没有掉期 | 否 | 数组必须已排序 |
 | 全面连接 | 是 | 所有可能的排列 |
 | 有限的交换块| 否 | 断开的组件限制排序|
 | 仅中间交换 | 是 | 局部重排就足够了|

 ## 边缘情况

 一个关键的边缘情况是当`m = 0`，意味着不允许交换。 在这种情况下，每个索引都是其自己的组件，因此每个组件仅包含一个值。 该算法将每个单个值与相应的排序值进行比较，并检测不匹配，除非数组已经排序。 

另一种边缘情况发生在`m = n-1`，意味着允许所有相邻的交换。 这会产生单个连通分量，因此该算法简化为检查是否可以对整个数组进行排序，这始终是正确的，因为存在完全的排列自由。 

更微妙的情况是组件很大但以交替边缘的模式断开连接。 该算法可以自然地处理此问题，因为 DSU 仅合并相邻允许的交换，确保不会发生意外的跨组件混合。
