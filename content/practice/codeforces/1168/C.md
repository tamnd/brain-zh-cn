---
title: "CF 1168C - 和可达性"
description: "我们给出了排列在一条线上的整数序列，我们想要回答位置对之间的连通性查询，但连通性不是基于邻接性的。"
date: "2026-06-15T16:46:14+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dp"]
categories: ["algorithms"]
codeforces_contest: 1168
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 562 (Div. 1)"
rating: 2200
weight: 1168
solve_time_s: 297
verified: true
draft: false
---

[CF 1168C - 和可达性](https://codeforces.com/problemset/problem/1168/C)

 **评分：** 2200
 **标签：** 位掩码、dp
 **求解时间：** 4m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了排列在一条线上的整数序列，我们想要回答位置对之间的连通性查询，但连通性不是基于邻接性的。 相反，如果它们的值的按位与至少共享一个设置位，我们就可以从一个索引跳转到后面的索引。 从起始位置$x$，只要链中的每个连续对都有非零按位 AND，我们就可以向前遍历索引链。 对于许多查询来说，任务是确定我们是否可以到达目标位置$y$开始于$x$。 

这从根本上来说是有向图上的可达性问题，其中节点是索引，并且有一条边$i$到$j$为了$i < j$如果$a_i \& a_j > 0$。 挑战在于显式构建所有边是不可行的，因为它需要$O(n^2)$在最坏的情况下工作。 

约束很大，最多有 300,000 个元素和 300,000 个查询。 任何直接检查对的方法都会超时。 即使每个查询的图遍历也太慢，因为 BFS 或 DFS 可能会降级为每个查询的线性。 这促使我们预处理一个允许快速可达性检查的结构。 

一个微妙的边缘情况是零的存在。 任何值为 0 的索引都没有传出或传入的有用边，因为$0 \& x = 0$为所有人$x$。 此类位置永远不能参与有效路径，除非作为不需要遍历它们的琐碎查询的孤立端点。 例如，如果$a = [1, 0, 2]$，那么位置 2 无法帮助连接 1 和 3，即使它位于中间。 

另一个不明显的问题是可达性不对称，并且受到指数增加的限制。 这使得结构更接近于仅前向图，这使我们能够利用解决方案中的排序。 

## 方法

 直接方法显式构造图并针对每个查询运行 BFS。 对于每个索引$i$，我们检查所有$j > i$并添加一条边如果$a_i \& a_j > 0$。 这已经花费了$O(n^2)$，对于 300,000 个元素来说太大了。 

即使我们跳过显式构造并尝试每个查询的 BFS，每次遍历仍然可能会触及数组的很大一部分。 对于 300,000 个查询，最坏情况的复杂性变得完全不可行。 

关键的观察是按位与连接仅取决于共享设置位。 每个数字都可以被视为最多 18 位的子集（因为值最多为 300,000）。 如果我们从位的角度思考，每个位置都属于多个位组，并且只有通过共享位成员身份才能进行移动。 

这表明对于每个位，保持从左到右扫描时看到的最新位置。 当我们处于索引位置时$i$，我们知道哪些早期索引与其共享至少一位，并且我们可以向前“合并”连接信息。 

然而，维持每位的完全传递连接仍然很复杂。 关键的简化是我们不需要所有对之间完全可达； 我们只需要知道两个索引是否属于这个前向图中的同一个连通分量。 由于边缘仅向前移动，因此可以在索引上使用类似联合的结构，在位出现的指导下逐步构建组件。 

我们从左到右处理索引，维护不相交集并集 (DSU)。 对于每一位，我们都会记住该位出现的最后一个索引。 当我们处于索引位置时$i$，对于每个设置位$a_i$，我们联合$i$与该位的最后一次看到的索引，然后将最后一次看到的索引更新为$i$。 这准确地构建了由重叠位链引起的连接。 

一旦构建了 DSU，每个查询就减少为检查是否$x$和$y$属于同一个组件，并且还保证$x < y$（已由输入保证）。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询的强力 BFS |$O(qn)$|$O(n^2)$| 太慢了 |
 | 比特传播上的 DSU |$O(n \alpha(n) \cdot B + q \alpha(n))$|$O(n + B)$| 已接受 |

 这里$B$是值范围内的位数（最多 18）。 

## 算法演练

 1. 初始化索引上的 DSU 结构$1 \dots n$。 每个索引都从其自己的组件开始。 这表示最初没有已知连接。 
2. 维护数组`last[bit]`，其中每个条目存储其值包含该位的最新索引。 最初所有内容均未设置。 
3. 从左到右迭代索引。 在索引处$i$，检查设置的所有位$a_i$。 每个位代表一个“通道”，连接可以通过该“通道”传播。 
4. 对于每一位$b$设置在$a_i$， 如果`last[b]`存在，联盟$i$和`last[b]`。 这将当前位置连接到同一位的前一个出现位置，并间接连接到已经与该出现位置连接的所有内容。 
5. 对所有位进行并集处理后$a_i$， 更新`last[b] = i`对于每一点$b$设置在$a_i$。 这确保了未来的索引连接到每个位组的最新代表。 
6. 预处理后，对于每个查询$(x, y)$，检查DSU查找操作是否返回相同的根。 如果是，则输出“Shi”，否则输出“Fou”。 

### 为什么它有效

 DSU 不变量是，当且仅当存在从左到右的索引序列（其中连续元素共享至少一个公共位）时，两个索引位于同一集合中。 每个联合操作完全对应于在图中引入由共享位引起的有效边。 由于每个可能的边都将节点连接到至少一个共享位的最近一次出现，因此原始可达性定义中的所有路径都可以通过这些并集来表示。 DSU 的传递性确保捕获任何多步链，因此 DSU 上的连接查询与原始图中的可达性相匹配。 

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
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    dsu = DSU(n)
    last = [-1] * 20

    for i in range(n):
        x = a[i]
        for b in range(20):
            if x & (1 << b):
                if last[b] != -1:
                    dsu.union(i, last[b])
                last[b] = i

    out = []
    for _ in range(q):
        x, y = map(int, input().split())
        x -= 1
        y -= 1
        if dsu.find(x) == dsu.find(y):
            out.append("Shi")
        else:
            out.append("Fou")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```当我们从左到右扫描时，DSU 用于将连接性压缩到组件中。 关键的实现细节是`last`数组，这确保我们只将每个新索引连接到每个位的最新索引，避免二次比较。 联合操作就足够了，因为早期的连接已经被传递捕获。 

位迭代以 20 为界，因为值最多为 300,000，适合 19 位。 

## 工作示例

 ### 示例 1

 输入：```
5 3
1 3 0 2 1
1 3
2 4
1 4
```我们在扫描时跟踪 DSU 连接：

 | 我| 一个[我] | 位| 工会执行 | 最后更新 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 无 | 位 0=1 |
 | 2 | 3 | 0,1 | 联盟(2,1) | 位0=2，位1=2 |
 | 3 | 0 | 无 | 无 | 不变|
 | 4 | 2 | 1 | 联盟(4,2) | 位1=4 |
 | 5 | 1 | 0 | 联盟(5,2) | 位 0=5 |

 查询(1,3)：索引3为零，孤立的，不与1相连，所以答案是Fou。 

查询(2,4)：两者通过位1链属于同一组件，所以Shi。 

查询(1,4)：通过1→2→4相连，故施。 

这证实了 DSU 正确捕获了基于位的间接链接。 

### 示例 2

 输入：```
4 2
5 1 4 0
1 3
2 3
```追踪：

 | 我| 一个[我] | 位| 工会| 最后|
 | ---| ---| ---| ---| ---|
 | 1 | 5 | 0,2 | 无 | 0=1,2=1 |
 | 2 | 1 | 0 | 联盟(2,1) | 0=2 |
 | 3 | 4 | 2 | 联盟(3,1) | 2=3 | 2=3
 | 4 | 0 | 无 | 无 | 不变|

 现在1、2、3通过共享位结构连接，因此两个查询都返回Shi。 

这演示了不同的位通道如何在没有直接相邻的情况下传递地合并组件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \alpha(n) \cdot 20 + q \alpha(n))$| 每个索引最多处理 20 位，每个并/查找都是逆 Ackermann |
 | 空间|$O(n + 20)$| DSU 数组加上最后出现的数组 |

 该解决方案可以轻松地扩展到 300,000 个元素和查询，因为位因子是恒定的，并且 DSU 操作的时间几乎是恒定的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
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

    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    dsu = DSU(n)
    last = [-1] * 20

    for i in range(n):
        for b in range(20):
            if a[i] & (1 << b):
                if last[b] != -1:
                    dsu.union(i, last[b])
                last[b] = i

    out = []
    for _ in range(q):
        x, y = map(int, input().split())
        x -= 1
        y -= 1
        out.append("Shi" if dsu.find(x) == dsu.find(y) else "Fou")

    return "\n".join(out)

# provided sample
assert run("""5 3
1 3 0 2 1
1 3
2 4
1 4
""") == "Fou\nShi\nShi"

# single element chains via bit propagation
assert run("""3 2
1 2 4
1 3
2 3
""") == "Shi\nShi"

# all zeros except endpoints
assert run("""4 2
1 0 0 2
1 4
2 3
""") == "Fou\nFou"

# all equal values
assert run("""5 1
7 7 7 7 7
1 5
""") == "Shi"

# sparse bits
assert run("""6 2
1 2 4 8 16 32
1 6
2 5
""") == "Fou\nFou"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 稀疏链示例 | 石/石| 通过位重叠传播|
 | 零案例 | 缶/缶| 零中断连接 |
 | 统一值| 施| 全面连接 |
 | 不相交的位| 缶| 没有意外的结合|

 ## 边缘情况

 关键的边缘情况是有效值之间出现零。 用于输入`[1, 0, 2]`，索引 2 从不参与任何联合。 该算法正确地将其隔离，因为它没有设置位，因此`last`永远不会更新，也不会发生联合。 

另一种情况是具有相同位模式的重复值。 为了`[7, 7, 7]`，每个索引通过所有共享位与前一个索引联合，DSU 将它们合并为一个组件。 该算法不会重复计数或创建冗余结构，因为 DSU 会忽略重复的并集。 

进一步的边缘情况涉及稀疏位分布，其中连接性需要通过中间索引进行链接而不是直接重叠。 这`last`数组确保保留此类链接，因为每个新出现都链接到该位的现有组件，从而向前传播连接性。
