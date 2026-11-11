---
title: "CF 2129A - 双视角"
description: "我们得到了一条线上的线段集合，每个线段也充当两个顶点之间的边。 我们必须从这个集合中选择一些边的子集。 根据所选子集计算两个不同的量。"
date: "2026-06-08T03:01:49+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dp", "dsu", "graphs", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2129
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 1040 (Div. 1)"
rating: 1300
weight: 2129
solve_time_s: 82
verified: true
draft: false
---

[CF 2129A - 双重视角](https://codeforces.com/problemset/problem/2129/A)

 **评分：** 1300
 **标签：** 构造性算法、dp、dsu、图、贪婪、排序
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一条线上的线段集合，每个线段也充当两个顶点之间的边。 我们必须从这个集合中选择一些边的子集。 根据所选子集计算两个不同的量。 

第一个量测量数轴上有多少个单位间隔被至少一个选定的线段覆盖。 如果一个段跨越$a$到$b$，它覆盖了它们之间的所有整数单位块。 重叠不会增加联合之外的计数。 

第二个量是基于图表的。 每个线段都被视为其端点之间的无向边。 我们查看该图中长度至少为 3 的所有简单循环，并计算至少一个这样的循环上有多少个不同的顶点。 

目标是选择边的子集，使总覆盖长度与参与循环的顶点数量之间的差异最大化。 

约束结构很重要。 每个测试最多有 3000 个段，并且总和$n^2$过度测试的界限为$9 \cdot 10^6$。 这立即表明$O(n^2)$每次测试都是可以接受的，而每次测试任何立方体则不可接受。 

检查所有子集的简单方法是不可能的，因为$2^n$长得太快了。 即使评估单个子集也需要重新计算联合长度和循环参与，这已经至少花费了线性或接近线性的时间。 

第二个天真的想法是贪婪地选择增加联合长度的段，但这失败了，因为添加段可以创建循环并通过增加来减少分数$g(S)$，即使它增加了覆盖范围。 

当在不增加覆盖范围的情况下形成循环时，会出现微妙的边缘情况。 

例如，考虑：```
3
1 2
2 3
1 3
```选择所有边会给出并集长度 2，但会创建一个涉及所有三个节点的三角形循环，从而增加了惩罚。 最佳解决方案是选取形成路径的任意两条边，而不是整个循环。 

这显示了关键的张力：我们想要覆盖范围，但我们必须避免引发循环的边缘。 

## 方法

 关键的观察是$g(S)$仅当选定的边在图中形成循环时才变为非零。 任何循环都意味着某些边在连通性方面是多余的，因为在森林中根本不存在循环。 

因此，如果我们将自己限制在森林中，我们保证$g(S) = 0$。 然后，问题简化为选择边的子集，以最大化覆盖范围，同时保持图非循环。 

这暗示了一种结构：我们正在寻找类似森林的跨越选择，但不一定连接所有内容，而是优化由覆盖贡献定义的权重。 

暴力视图是：尝试所有子集、计算联合覆盖率并使用 DFS 或 DSU 检测循环。 这是$O(2^n \cdot n)$，完全不可行。 

关键的见解是以一种避免贪婪循环的方式处理边缘，同时仍然捕获覆盖范围增益。 如果一条边产生了一个循环，那也没有什么帮助$g(S)$，但仍然可以增加覆盖范围。 然而，关键的结构事实是，任何循环边缘在连接性方面都是冗余的，并且其覆盖范围已经可以通过最佳结构中的替代路径来表示。 这使我们能够将注意力限制在非循环选择上。 

因此，我们构建了一个最大跨度的类似森林的结构，但具有与覆盖贡献相对应的权重定义。 由于端点的边界为$2n$，我们可以按有用性的排序顺序处理边，并维护 DSU 以进行循环检测。 

最终的结构确保没有循环，所以$g(S)=0$，并且我们通过仔细包含延伸先前未覆盖区域的边缘来最大化覆盖范围。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(2^n \cdot n)$|$O(n)$| 太慢了 |
 | 循环感知贪婪算法 (DSU) |$O(n \alpha(n))$或者$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们将问题简化为选择一组避免循环的边缘，同时最大化每个边缘对覆盖的有效贡献。 

1. 以任何固定顺序对边进行排序（或使用 DSU 时给定的过程）。 

顺序不需要按权重严格，因为避免循环主导着正确性。 
2. 对端点中出现的所有顶点初始化 DSU 结构。 

这使我们能够检测添加边缘是否会产生循环。 
3. 一条一条地迭代边。 

对于边缘$(a, b)$，检查是否$a$和$b$已连接到 DSU 中。 

如果它们是相连的，添加这条边会形成一个循环，所以我们跳过它。 
4. 如果它们没有连接，我们将这条边添加到答案集中，并在 DSU 中合并它们的组件。 

这可确保选定的边始终形成森林。 
5. 输出所有选定的边。 

这样做的原因是，为了最大化目标，任何循环总是不必要的。 循环边缘永远不会改善连通性，只会增加风险$g(S)$，而它对覆盖的贡献可以通过已经选择的树路径或同一组件结构中的替代非循环边来复制。 因此，限制森林并不会失去最佳解决方案。 

不变量是，处理每条边后，选定的边形成森林。 这保证了$g(S)=0$整个施工过程中。 由于没有循环形成，我们完全消除了惩罚项。 剩下的任务是最大化非循环约束内的覆盖范围，这是通过包含连接两个先前独立组件的每条边来实现的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.size = [1] * (n + 1)

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        edges = []
        maxv = 0

        for i in range(n):
            a, b = map(int, input().split())
            edges.append((a, b, i + 1))
            maxv = max(maxv, a, b)

        dsu = DSU(maxv)
        res = []

        for a, b, idx in edges:
            if dsu.union(a, b):
                res.append(idx)

        print(len(res))
        print(*res)

if __name__ == "__main__":
    solve()
```DSU 纯粹用作循环检测器。 仅当每条边连接两个先前断开连接的组件时，该边才被接受。 这保证了最终的结构是一个森林，因此不存在循环。 

该实现仔细地使用路径压缩和按大小并集，以确保每个操作的平摊时间接近恒定，考虑到总的时间，这是必要的$O(n^2)$跨测试的约束。 

## 工作示例

 ### 示例 1

 输入：```
1
3
1 2
2 3
1 3
```我们按输入顺序处理边。 

| 步骤| 边缘| DSU 已连接？ | 行动| 已选择 |
 | ---| ---| ---| ---| ---|
 | 1 | 1-2 | 1-2 没有 | 占据优势| {1-2} |
 | 2 | 2-3 | 2-3 没有 | 占据优势| {1-2,2-3} |
 | 3 | 1-3 | 1-3 是的 | 跳过边缘| {1-2,2-3} |

 最终输出选择形成路径的两条边。 这避免了循环并保持$g(S)=0$。 

### 示例 2

 输入：```
1
4
1 2
2 3
3 4
1 3
```| 步骤| 边缘| DSU 已连接？ | 行动| 已选择 |
 | ---| ---| ---| ---| ---|
 | 1 | 1-2 | 1-2 没有 | 采取| {1-2} |
 | 2 | 2-3 | 2-3 没有 | 采取| {1-2,2-3} |
 | 3 | 3-4 | 3-4 没有 | 采取| {1-2,2-3,3-4} |
 | 4 | 1-3 | 1-3 是的 | 跳过| 相同 |

 这将构建一棵跨越所有四个节点的树，同时避免创建循环。 

这些痕迹证实 DSU 不变量正确地防止了每一步的循环形成。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \alpha(n))$每次测试 | 每个边沿最多触发两个 DSU 查找和一个并集 |
 | 空间|$O(n)$| DSU 阵列和存储的选定边 |

 考虑到全局约束$\sum n^2 \le 9 \cdot 10^6$，这种线性每边缘处理很容易满足限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class DSU:
        def __init__(self, n):
            self.parent = list(range(n + 1))
            self.size = [1] * (n + 1)

        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x

        def union(self, a, b):
            ra, rb = self.find(a), self.find(b)
            if ra == rb:
                return False
            if self.size[ra] < self.size[rb]:
                ra, rb = rb, ra
            self.parent[rb] = ra
            self.size[ra] += self.size[rb]
            return True

    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        edges = []
        maxv = 0
        for i in range(n):
            a, b = map(int, input().split())
            edges.append((a, b, i + 1))
            maxv = max(maxv, a, b)

        dsu = DSU(maxv)
        res = []
        for a, b, idx in edges:
            if dsu.union(a, b):
                res.append(idx)

        out.append(str(len(res)))
        out.append(" ".join(map(str, res)) if res else "")
    return "\n".join(out)

# provided samples
assert run("""2
1
1 2
4
1 2
2 3
1 3
3 5
""") == """1
1
3
1 2 4"""

# custom: single edge
assert run("""1
1
1 2
""").split()[0] == "1"

# custom: all form cycle
assert run("""1
3
1 2
2 3
1 3
""").split()[0] == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单边| 已选择 1 条边 | 基本情况|
 | 三角形| 已选择 2 条边 | 循环去除|
 | 4 链 | 保留所有边缘| 线性结构|

 ## 边缘情况

 每个边都参与循环的小输入是三角形情况。 该算法首先处理两条边，合并组件，然后拒绝第三条边，因为它连接已经连接的节点。 这确保不会形成循环，并且所选集合在 DSU 约束下保持最佳状态。 

另一种情况是一行节点，其中每条边都是独立的。 DSU 接受每个边缘，因为没有重复的连接，因此该解决方案正确输出所有边缘，最大化覆盖范围，同时仍然保持$g(S)=0$。 

最后一种情况是断开连接的组件，其中 DSU 在每个组件中独立构建一个森林。 由于循环形成对于组件而言是局部的，因此该算法在图的所有部分上表现一致，而不会相互干扰。
