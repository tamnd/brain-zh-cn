---
title: "CF 292D - 连接组件"
description: "我们有一个代表计算机网络的无向图。 顶点是计算机，边缘是电缆。 电缆按照它们在输入中出现的顺序从 1 到 m 进行编号。"
date: "2026-06-05T17:13:14+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "dp", "dsu"]
categories: ["algorithms"]
codeforces_contest: 292
codeforces_index: "D"
codeforces_contest_name: "Croc Champ 2013 - Round 1"
rating: 1900
weight: 292
solve_time_s: 131
verified: true
draft: false
---

[CF 292D - 连接组件](https://codeforces.com/problemset/problem/292/D)

 **评级：** 1900
 **标签：** 数据结构、dfs 和类似、dp、dsu
 **求解时间：** 2m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个代表计算机网络的无向图。 顶点是计算机，边缘是电缆。 电缆编号从 1 到`m`按照它们在输入中出现的顺序。 

每个查询从索引中删除一个连续的边块`l`索引`r`，并询问当这些边暂时断开连接时，图中还保留有多少个连接的组件。 回答后，图表返回到下一个查询之前的原始状态。 

该图本身的顶点数量非常小，最多只有 500 个节点。 挑战来自边和查询的数量。 最多可以有 10,000 条边和 20,000 个查询。 任何重建图并为每个查询执行完整遍历的解决方案都将过于昂贵。 

一个有用的观察是每个查询恰好保留两个边缘范围：

 - 之前的边缘`l`- 之后的边缘`r`删除的间隔始终是连续的。 这种结构使得问题变得容易处理。 

有几种微妙的情况很容易破坏错误的解决方案。 

考虑平行边：```
2 2
1 2
1 2
1
1 1
```仅删除第一条边仍然留下第二条边，因此图保持连通，答案是`1`。 仅跟踪两个顶点之间是否存在边的解决方案将错误地返回`2`。 

另一个重要的情况是删除所有边缘：```
3 2
1 2
2 3
1
1 2
```图变成三个孤立的顶点，所以答案是`3`。 任何假设至少有一条剩余边的方法在这里都会失败。 

第三种情况是图已经断开连接时：```
4 1
1 2
1
1 1
```删除唯一的边后，所有四个顶点都是孤立的，所以答案是`4`。 分量的数量与原始图的连通性无关。 

这些限制强烈表明我们需要大约几百万次操作。 和`m = 10^4`和`k = 2·10^4`， 一个`O(m)`或者`O(m log n)`每个查询的答案将需要数亿次操作，并且在时间限制内无法轻松完成。 

## 方法

 最直接的解决方案是独立处理每个查询。 

对于查询`[l, r]`，构建一个包含除该区间内的边之外的所有边的图，然后运行 ​​DFS 或 BFS 来计算连接的组件。 这显然是正确的，因为它完全模拟了声明中描述的实验。 

问题是成本。 查询可能需要扫描所有`m`边，然后遍历图。 复杂度大致变为`O(k · (m + n))`。 

具有最大限制：```
k = 20000
m = 10000
```在考虑图遍历开销之前，我们获得了大约 2 亿次边缘操作。 这太慢了。 

关键的观察结果是该图只有 500 个顶点。 

当我们只关心连接的组件时，DSU 就足够了。 DSU 状态完全由已添加的边集确定。 此外，每个查询保留两个不相交的边段：```
[1, l-1]
[r+1, m]
```这建议预先计算前缀和后缀的 DSU 信息。 

对于边的每个前缀，我们存储构建该前缀时执行的成功并集的序列。 同样，对于每个后缀，我们存储从最后构建该后缀时执行的成功联合。 

然后，对于一个查询`[l, r]`，我们从一个空的 DSU 开始并重播：

 - 来自前缀的所有联合`l-1`- 后缀中的所有联合`r+1`由于只有 500 个顶点，一个 DSU 最多可以执行`n-1 ≤ 499`成功合并。 因此，每个存储的前缀或后缀最多包含 499 个联合运算。 

我们不是每个查询处理最多 10,000 个边，而是每个查询最多处理大约 1000 个存储的合并。 

这样的减少足以让你轻松通过。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k(m+n)) | O(k(m+n)) | O(m+n) | 太慢了 |
 | 最佳 | O(mn + kn) | O(百万) | 已接受 |

 ## 算法演练

 1. 读取所有边并在内部将它们转换为基于 0 的索引。 
2. 构建前缀信息。 

创建 DSU 并从左到右添加边。 每当一条边连接两个先前独立的组件时，将该对存储在`pref[i]`， 在哪里`i`代表第一个`i`边缘。 

仅存储成功的联合，因为失败的联合永远不会影响未来的连接。 
3.构建后缀信息。 

创建另一个 DSU 并从右到左添加边。 每当一条边连接两个组件时，将该对存储在`suf[i]`， 在哪里`i`代表边从`i`通过`m`。 
4. 对于每个查询`[l, r]`，创建一个新的 DSU，其中包含`n`孤立的顶点。 
5. 重放每个存储的合并`pref[l-1]`。 

这些合并准确地表示了删除间隔之前所有边所贡献的连接性。 
6. 重放每个存储的合并`suf[r+1]`。 

这些合并准确地表示了删除间隔后所有边所贡献的连接性。 
7. DSU 的分量计数器现在等于删除边后连接的分量数`l...r`。 
8. 输出该计数器。 

### 为什么它有效

 考虑任何查询`[l, r]`。 

剩余的图由两个边集组成：```
Eleft  = edges 1 ... l-1
Eright = edges r+1 ... m
```前缀预处理存储了一个生成林`Eleft`。 后缀预处理存储了一个生成森林`Eright`。 

跨越森林准确地保留了连接的组件。 任何不执行并集的边都会连接已通过先前选择的边连接的顶点，并且与组件结构无关。 

当我们将两个森林中的所有成功并集重放到新的 DSU 中时，我们会重建与使用所有剩余边生成的完全相同的连接组件。 因此，DSU 的组件数量是正确答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)

        if a == b:
            return False

        if self.size[a] < self.size[b]:
            a, b = b, a

        self.parent[b] = a
        self.size[a] += self.size[b]
        self.components -= 1
        return True

def solve():
    n, m = map(int, input().split())

    edges = []
    for _ in range(m):
        u, v = map(int, input().split())
        edges.append((u - 1, v - 1))

    pref = [[] for _ in range(m + 1)]

    dsu = DSU(n)
    pref[0] = []

    for i in range(1, m + 1):
        pref[i] = pref[i - 1][:]

        u, v = edges[i - 1]
        if dsu.union(u, v):
            pref[i].append((u, v))

    suf = [[] for _ in range(m + 2)]

    dsu = DSU(n)

    for i in range(m, 0, -1):
        suf[i] = suf[i + 1][:]

        u, v = edges[i - 1]
        if dsu.union(u, v):
            suf[i].append((u, v))

    k = int(input())
    ans = []

    for _ in range(k):
        l, r = map(int, input().split())

        dsu = DSU(n)

        for u, v in pref[l - 1]:
            dsu.union(u, v)

        for u, v in suf[r + 1]:
            dsu.union(u, v)

        ans.append(str(dsu.components))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```前缀构造维护一个包含第一个的 DSU`i`边缘。 每当一条边实际合并两个组件时，该合并就会附加到存储的森林中。 因为至多`n-1`可以发生成功的联合，每个存储的列表仍然很小。 

后缀结构是对称的。`suf[i]`存储边缘的跨越森林`i...m`。 

对于每个查询，我们从一个空的 DSU 开始。 重放前缀森林和后缀森林会重建所有幸存边的连接性。 DSU维护的组件计数器直接给出了答案。 

最常见的实施错误是索引。 输入使用从 1 开始的边编号。`pref[i]`对应于第一个`i`边，所以一个查询`[l, r]`用途`pref[l-1]`。 同样，删除间隔后的第一个幸存边是`r+1`，所以我们使用`suf[r+1]`。 

## 工作示例

 ### 示例 1

 输入：```
6 5
1 2
5 4
2 3
3 1
3 6
1
1 3
```查询删除边 1 到 3。 

剩下的边是：```
3-1
3-6
```| 步骤| 行动| 组件|
 | --- | --- | --- |
 | 开始| 六个孤立的顶点 | 6 |
 | 添加 3-1 | 合并| 5 |
 | 添加 3-6 | 合并| 4 |

 回答：```
4
```这表明只有移除间隔之外的边缘才重要，并且 DSU 组件计数会立即给出结果。 

### 自定义示例```
4 3
1 2
2 3
3 4
1
2 2
```边 2 被移除。 

剩余边缘：```
1-2
3-4
```| 步骤| 行动| 组件|
 | --- | --- | --- |
 | 开始| 四个孤立的顶点 | 4 |
 | 添加 1-2 | 合并| 3 |
 | 添加 3-4 | 合并| 2 |

 回答：```
2
```此示例展示了在删除中间边缘后如何将图拆分为多个大组件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(mn + kn) | 每个前缀和后缀森林最多包含`n-1`合并|
 | 空间| O(百万) | 我们存储最多`n-1`合并每个前缀和后缀 |

 自从`n ≤ 500`，每个存储森林的大小最多为 499。预处理大致执行`m·n`工作，最坏的情况下大约有 500 万次操作。 每个查询最多重播约一千次合并，产生大约一千万以上的操作。 这完全符合限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
            self.size = [1] * n
            self.components = n

        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x

        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)

            if a == b:
                return False

            if self.size[a] < self.size[b]:
                a, b = b, a

            self.parent[b] = a
            self.size[a] += self.size[b]
            self.components -= 1
            return True

    input = sys.stdin.readline

    n, m = map(int, input().split())
    edges = []

    for _ in range(m):
        u, v = map(int, input().split())
        edges.append((u - 1, v - 1))

    pref = [[] for _ in range(m + 1)]
    dsu = DSU(n)

    for i in range(1, m + 1):
        pref[i] = pref[i - 1][:]
        u, v = edges[i - 1]
        if dsu.union(u, v):
            pref[i].append((u, v))

    suf = [[] for _ in range(m + 2)]
    dsu = DSU(n)

    for i in range(m, 0, -1):
        suf[i] = suf[i + 1][:]
        u, v = edges[i - 1]
        if dsu.union(u, v):
            suf[i].append((u, v))

    k = int(input())
    out = []

    for _ in range(k):
        l, r = map(int, input().split())

        dsu = DSU(n)

        for u, v in pref[l - 1]:
            dsu.union(u, v)

        for u, v in suf[r + 1]:
            dsu.union(u, v)

        out.append(str(dsu.components))

    return "\n".join(out)

assert run(
"""6 5
1 2
5 4
2 3
3 1
3 6
6
1 3
2 5
1 5
5 5
2 4
3 3
"""
) == """4
5
6
3
4
2""", "sample 1"

assert run(
"""2 1
1 2
1
1 1
"""
) == "2", "minimum graph"

assert run(
"""3 2
1 2
2 3
1
1 2
"""
) == "3", "remove all edges"

assert run(
"""2 2
1 2
1 2
1
1 1
"""
) == "1", "parallel edges"

assert run(
"""4 3
1 2
2 3
3 4
1
2 2
"""
) == "2", "middle interval removal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单边图 | 2 | 最小有意义的实例 |
 | 删除所有边缘 | 3 | 清空剩余图|
 | 平行边| 1 | 多个相同的边|
 | 删除中间边缘的路径 | 2 | 正确的间隔处理 |
 | 官方样品| 给定输出 | 全面集成测试|

 ## 边缘情况

 考虑平行边：```
2 2
1 2
1 2
1
1 1
```第一条边被删除，但第二条边保留。 在预处理过程中，其中一条平行边出现在生成林中，而另一条则没有。 当查询重播后缀森林时，幸存的边仍然连接两个顶点，生成一个组件。 答案是：```
1
```考虑删除每条边：```
3 2
1 2
2 3
1
1 2
```查询使用`pref[0]`和`suf[3]`，都是空的。 新的 DSU 从不执行任何合并并保留三个组件。 答案是：```
3
```考虑一个开始断开连接的图：```
4 1
1 2
1
1 1
```同样，两个重播的森林都是空的。 DSU 从四个组件开始并保持不变，产生：```
4
```这些示例说明了中心不变量：重放跨越森林的前缀和后缀可以准确地重建删除查询间隔后剩余的所有边的连接性。
