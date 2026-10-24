---
title: "CF 125E - MST 公司"
description: "给定一个带权无向图，其首都为顶点1。我们必须选择一组连接所有城市的道路。 由于所选图必须是连通的并且具有最小的总权重，因此只要存在解，解就始终是生成树。"
date: "2026-06-02T16:20:28+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "graphs"]
categories: ["algorithms"]
codeforces_contest: 125
codeforces_index: "E"
codeforces_contest_name: "Codeforces Testing Round 2"
rating: 2400
weight: 125
solve_time_s: 147
verified: true
draft: false
---

[CF 125E - MST 公司](https://codeforces.com/problemset/problem/125/E)

 **评分：** 2400
 **标签：** 二分查找、图
 **求解时间：** 2m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个带权无向图，其首都为顶点 1。 

我们必须选择一套连接所有城市的道路。 由于所选图必须是连通的并且具有最小的总权重，因此只要存在解，解就始终是生成树。 

额外的限制是`k`生成树的边必须与首都相连。 

所以任务是：

 找到一棵最小权生成树，其度数在顶点`1`正是`k`，并输出其边缘索引。 

该图最多包含 5000 个顶点和 100000 条边。 经典的最小生成树可以用 Kruskal 找到`O(m log m)`，这完全没问题。 困难的部分是对单个特殊顶点强制执行度数约束。 

约束大小立即排除任何枚举大写边缘子集的内容。 即使检查顶点 1 度数的所有可能性也是无望的，因为入射边的数量可能大到`10^5`。 

关键的观察结果是，该限制仅影响一类特殊的边，即那些接触顶点 1 的边。该结构正是允许拉格朗日松弛的结构，在竞争性编程中通常称为 WQS 二分搜索。 

有几种不明显的边缘情况。 

假设即使所有边都可用，图也断开连接：```
3 1 1
1 2 5
```顶点 3 被隔离。 不存在生成树，所以答案是`-1`。 

另一个重要的情况是资本边缘太少。```
4 2 2
1 2 1
2 3 1
```只有一条边接触顶点 1，因此在首都获得度 2 是不可能的。 

当许多生成树在二分搜索期间具有相同的修改成本时，就会出现更微妙的情况。 如果联系处理不当，所选资本边数的单调性就会破坏，重建就会失败。 实现必须在同等修改权重中明确优先选择资本边缘。 

## 方法

 蛮力观点很有用，因为它揭示了我们真正优化的内容。 

想象一下枚举所有生成树。 对于每棵树，计算有多少条边与顶点 1 相关。`k`这样的边，保留总重量最小的边。 

这显然是正确的，因为它直接符合答案的定义。 不幸的是，具有 5000 个顶点的图可能具有天文数字的生成树。 甚至生成它们也是不可能的。 

下一个自然的想法是运行 Kruskal，同时以某种方式跟踪使用了多少资本边缘。 这立即遇到了一个问题：Kruskal 只优化总重量，对度数约束一无所知。 

关键的观察是，每个资本边缘都属于同一类别。 而不是完全强迫`k`其中，我们可以暂时改变它们的权重。 

让`C`是一个参数。 

对于每条接触顶点 1 的边，将其权重替换为`w + C`。 

所有其他边都保持其原始重量。 

现在对这些修改后的权重运行标准 MST 算法。 

如果`C`规模非常大，资本优势变得昂贵，而 MST 使用的资本优势很少。 

如果`C`是非常负面的，资本优势变得有吸引力，MST 利用了其中的许多优势。 

这创建了一个单调函数：`cnt(C) = number of capital edges in the MST`。 

作为`C`增加，`cnt(C)`永远不会增加。 

这种单调性允许二分搜索。 

找到最大值后`C`MST 仍然至少包含`k`资本边，我们重建一棵生成树`k`通过在相同的修改权重下再次运行 Kruskal 并拒绝采取超过`k`资本边缘。 

其起作用的原因是标准的拉格朗日松弛特性。 在二分搜索边界，每个最优修改 MST 都对应于一个具有度约束的最优原始解`k`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解跨树 | 指数| 指数| 太慢了 |
 | 二分查找+Kruskal | O(log W·m log m) | O(log W·m log m) | O(米) | 已接受 |

 这里`W`是体重范围。 

## 算法演练

 1. 标准化每条边，以便如果一个端点是大写字母，则将其存储为`(1, x)`。 
2. 定义函数`count_capital(C)`。 

添加`C`计算每个大写边的权重，按修改后的权重对所有边进行排序，然后运行 ​​Kruskal。 

当两条边具有相同的修改权重时，首先放置大边。 这使得所有最优修改 MST 中选定的资本边的数量最大化。 

返回使用的大写边数。 
3. 二分查找`C`。 

我们需要最大的值`C`这样`count_capital(C) >= k`。 

增加`C`使大写边缘不那么有吸引力，因此谓词是单调的。 
4. 令结果参数为`best`。 
5. 使用修改后的权重再次运行 Kruskal`best`。 
6. 构建树时，切勿允许所选首都边的数量超过`k`。 

非大写边缘将正常处理。 

仅在以下情况下才接受大写边缘：

 - 它连接两个不同的组件，并且
 - 少于`k`资本边缘已经选定。 
7. 如果我们无法准确获得`n - 1`边缘或无法准确到达`k`资本边，不存在有效的生成树。 
8. 否则输出选择的边缘索引。 

### 为什么它有效

 对于固定参数`C`，Kruskal 在图中找到一个最小生成树，其权重通过添加来修改`C`到每一个资本边缘。 

让一棵树包含`d`资本边缘。 其修正成本为`original_cost + C * d`。 

二分搜索找到最优修改 MST 至少仍然使用的最大参数`k`资本边缘。 

在这个边界上，所有度数大于的树`k`以及度数小于的所有树`k`围绕拉格朗日松弛的同一支撑线平衡。 最优约束解位于最优修改 MST 之中。 通过重建 MST 并限制我们自己`k`每当存在等成本选择时，我们就获得这些最优约束树之一。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.p = list(range(n + 1))

    def find(self, x):
        p = self.p
        while p[x] != x:
            p[x] = p[p[x]]
            x = p[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return False
        self.p[a] = b
        return True

def solve():
    n, m, k = map(int, input().split())

    edges = []

    for idx in range(1, m + 1):
        u, v, w = map(int, input().split())

        if u > v:
            u, v = v, u

        edges.append([u, v, w, idx])

    def count_capital(add):
        arr = []

        for u, v, w, idx in edges:
            if u == 1:
                arr.append((w + add, 0, u, v))
            else:
                arr.append((w, 1, u, v))

        arr.sort()

        dsu = DSU(n)
        cnt = 0
        taken = 0

        for _, typ, u, v in arr:
            if dsu.union(u, v):
                taken += 1
                if typ == 0:
                    cnt += 1
                if taken == n - 1:
                    break

        return cnt

    L = -100000
    R = 100000
    best = None

    while L <= R:
        mid = (L + R) // 2

        if count_capital(mid) >= k:
            best = mid
            L = mid + 1
        else:
            R = mid - 1

    if best is None:
        print(-1)
        return

    arr = []

    for u, v, w, idx in edges:
        if u == 1:
            arr.append((w + best, 0, u, v, idx))
        else:
            arr.append((w, 1, u, v, idx))

    arr.sort()

    dsu = DSU(n)

    answer = []
    capital_used = 0

    for _, typ, u, v, idx in arr:
        if typ == 0 and capital_used == k:
            continue

        if dsu.union(u, v):
            answer.append(idx)

            if typ == 0:
                capital_used += 1

    if len(answer) != n - 1 or capital_used != k:
        print(-1)
        return

    print(n - 1)
    print(*answer)

solve()
```第一个重要的细节是排序顺序。 大写边缘接收类型`0`和非首都边缘接收类型`1`。 由于 Python 按字典顺序对元组进行排序，因此相同的修改权重会自动优先选择大写边缘。 如果没有这个决胜局，二分搜索所使用的单调性可能会失败。 

二分查找寻找最大的参数，其 MST 至少仍包含`k`资本边缘。 确切的方向很重要。 颠倒它会改变重建论证并破坏正确性。 

在重建过程中，我们在相同的修改权重下再次运行 Kruskal。 唯一的额外规则是一旦`k`大写边缘已经被选择，每一个进一步的大写边缘都会被跳过。 这是将最优松弛解转换为满足精确度要求的最优解的步骤。 

DSU 实现使用路径压缩。 对于这些约束，按等级联合是不必要的。 

## 工作示例

 ### 示例 1

 输入：```
4 5 2
1 2 1
2 3 1
3 4 1
1 3 3
1 4 2
```假设二分查找已经找到了正确的参数。 

| 边缘考虑| 选择了？ | 使用的资本边缘 | DSU 组件 |
 | ---| ---| ---| ---|
 | 1-2 | 1-2 是的 | 1 | 合并|
 | 2-3 | 2-3 是的 | 1 | 合并|
 | 3-4 | 3-4 是的 | 1 | 树完整|

 无约束 MST 仅使用一个资本边缘。 

应用最佳参数并重建后：

 | 边缘考虑| 选择了？ | 使用的资本边缘 |
 | ---| ---| ---|
 | 1-2 | 1-2 是的 | 1 |
 | 1-4 | 1-4 是的 | 2 |
 | 2-3 | 2-3 是的 | 2 |

 生成的树正好有两个大边和最小总权重。 

该轨迹说明了为什么改变大写边的权重可以迫使 Kruskal 达到所需的程度。 

### 示例 2

 输入：```
3 1 1
1 2 5
```| 步骤| 结果 |
 | ---| ---|
 | 克鲁斯卡尔完成 | 仅选择一条边 |
 | 所需的树尺寸 | 2 条边 |
 | 已连接？ | 没有 |

 由于无法形成生成树，因此算法输出`-1`。 

此示例练习连接故障路径。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(log W·m log m) | O(log W·m log m) | 每个二分搜索步骤都会运行一个 Kruskal |
 | 空间| O(米) | 存储所有边和排序缓冲区 |

 重量范围最多为`10^5`，因此大约 18 次二分搜索迭代就足够了。 和`m = 100000`，总工作量保持在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    # placeholder for local testing
    pass

# sample 1
# verify manually against accepted solution

# minimum graph
inp = """\
1 0 0
"""
# expected: empty spanning tree

# disconnected graph
inp = """\
3 1 1
1 2 5
"""
# expected: -1

# impossible degree
inp = """\
4 2 2
1 2 1
2 3 1
"""
# expected: -1

# boundary degree
inp = """\
3 3 2
1 2 1
1 3 1
2 3 100
"""
# expected tree uses both capital edges
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单顶点 | 空树| 最小尺寸实例 |
 | 断开连接图| -1 | 连通性检测|
 | 资本优势太少 | -1 | 度不可行 |
 | 度数等于 2 | 有效树 | 精确度重建|

 ## 边缘情况

 考虑断开连接的图：```
3 1 1
1 2 5
```Kruskal 最多可以选择一条边。 三个顶点上的生成树需要两条边。 在重建过程中，算法完成时少于`n - 1`边缘和印花`-1`。 

考虑资本优势不足：```
4 2 2
1 2 1
2 3 1
```无论二分搜索参数变得多么负，该图实际上只包含一个大写边。 重建阶段无法达到`capital_used = 2`，因此最终的有效性检查会拒绝该实例。 

考虑相等的修改权重。 假设多个资本和非资本边缘具有相同的修正成本。 该算法始终将大写边缘放在排序中的第一位。 这保证了`count_capital(C)`表示最优修改MST中最大可能的大写边数，这正是二分查找所需的单调数量。 如果没有这种平局打破规则，Kruskal 的不同执行可能会对同一参数产生不同的计数，从而破坏搜索。
