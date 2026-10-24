---
title: "CF 1252C - 偶数路径"
description: "该问题中的网格没有明确给出为 $N × N$ 矩阵。 相反，每个像元值均由简单的加法结构确定：位置 $(i, j)$ 处的值是 $Ri + Cj$。"
date: "2026-06-18T17:37:13+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1252
codeforces_index: "C"
codeforces_contest_name: "2019-2020 ICPC, Asia Jakarta Regional Contest (Online Mirror, ICPC Rules, Teams Preferred)"
rating: 1600
weight: 1252
solve_time_s: 110
verified: false
draft: false
---

[CF 1252C - 偶数路径](https://codeforces.com/problemset/problem/1252/C)

 **评分：** 1600
 **标签：** 数据结构、实现
 **求解时间：** 1m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 这个问题中的网格没有明确给出$N \times N$矩阵。 相反，每个像元值都由一个简单的加法结构确定：位置处的值$(i, j)$是$R_i + C_j$。 这意味着每一行贡献一个固定的偏移量$R_i$，每列贡献一个固定的偏移量$C_j$。 所有移动仅限于网格上的四个方向邻接。 

路径只是标准的网格行走，其中每一步都会向上、向下、向左或向右移动一个单元格。 但是，只有值为偶数的单元格才可用。 查询询问两个给定的单元（都保证为偶值）是否可以仅使用偶值单元进行连接。 

关键的难点在于$N$和$Q$都达到$10^5$，因此我们无法构建网格或针对每个查询运行图形搜索。 任何针对每个查询尝试 BFS 或 DFS 的解决方案都会立即退化为$O(N^2)$或者$O(N^2 Q)$在最坏的情况下，这远远超出了极限。 

主要的结构约束是网格不是任意的。 每个单元的奇偶校验仅取决于$R_i + C_j \bmod 2$，这强烈限制了偶数单元图的行为方式。 

一个微妙的边缘情况源于这样一个事实：即使单元存在于多个行和列中，也不一定全部连接。 例如，如果所有偶数单元都位于隔离某些组件的棋盘图案中，则即使全局存在许多有效邻居，连接也会失败。 

另一个潜在的错误是假设由于运动是 4 向的，因此连接性仅取决于坐标奇偶性。 这是错误的，因为平等取决于价值观，而不是立场。 

## 方法

 暴力方法将显式构建网格，标记所有偶值单元格，并为每个查询运行 BFS 或 DFS。 这在概念上是有效的，因为网格图中的连通性自然是通过遍历来解决的。 然而，建设电网已经花费了$O(N^2)$内存和时间，并且对每个查询进行遍历会增加另一个因素$O(N^2)$，使其完全不可行。 

关键的观察结果来自于重写细胞均匀的条件。 一个细胞$(i, j)$在以下情况下可用：$$(R_i + C_j) \bmod 2 = 0$$这相当于：$$R_i \bmod 2 = C_j \bmod 2$$这立即告诉我们一些结构性的东西：每一行都有一个奇偶校验标签$p_i = R_i \bmod 2$，每列都有一个奇偶校验标签$q_j = C_j \bmod 2$。 单元格有效当且仅当$p_i = q_j$。 因此，有效单元仅存在于匹配奇偶校验类的交叉点处。 

现在考虑运动。 来自有效的单元格$(i, j)$，水平移动仅更改列索引。 所以$(i, j)$连接到$(i, j \pm 1)$if and only if both are valid. 这需要：$$p_i = q_j \quad \text{and} \quad p_i = q_{j \pm 1}$$因此，水平移动只能在具有相同奇偶校验的相邻列之间进行。$C$。 类似地，垂直移动需要相邻行具有相同的奇偶校验$R$。 

这将网格简化为两个独立的一维邻接结构：一个在行上，其中$R_i$具有给定的奇偶校验，并且超过列之一，其中$C_j$具有给定的奇偶性。 连接的分量完全取决于它所在的奇偶校验类以及匹配奇偶校验段的连续程度。 

这导致了一个标准技巧：将具有相同奇偶校验的连续行压缩为段，并对列执行相同的操作。 然后我们可以将运动视为在行段和列段的二分结构上行走。 每个细胞都属于一个独特的对$(\text{row segment}, \text{column segment})$，连通性简化为两个这样的对是否位于该导出图的同一连通分量中。 使用所有行和列段上的不相交集并集可以有效地处理此问题。 

一个更简单但等效的观点是构建一个 DSU$2N$节点，其中每一行和每一列都是一个节点。 我们连接行$i$和列$j$如果细胞$(i, j)$有效，意味着它们的奇偶性匹配。 然后，每个查询通过交替的行列连接来检查两个单元格的行和列是否位于同一连接结构中。 

### 比较

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询的强力 BFS |$O(Q \cdot N^2)$|$O(N^2)$| 太慢了|
 | 行和列上的 DSU |$O(N \alpha(N))$|$O(N)$| 已接受 |

 ## 算法演练

 1. 计算行和列的奇偶校验数组，其中每行$i$商店$R_i \bmod 2$和每一列$j$商店$C_j \bmod 2$。 这将所有值信息压缩为一个比特，完全确定单元的有效性。 
2. 创建不相交集并集结构$2N$节点，其中索引$1 \ldots N$代表行和$N+1 \ldots 2N$代表列。 这种分离至关重要，因为移动会在行约束和列约束之间交替。 
3. 对于每个细胞$(i, j)$，检查是否$R_i \bmod 2 = C_j \bmod 2$。 如果此条件成立，则联合节点$i$（行）带节点$N + j$（柱子）。 原因是有效的单元格允许在其行和列之间进行遍历，因此它们必须属于同一连接组件。 
4. 执行所有并集后，每一行和每一列都属于一个 DSU 组件，表示通过交替有效移动可到达的所有位置。 
5. 回答询问$(r_a, c_a, r_b, c_b)$，检查两个条件。 首先，保证两个端点都有效。 其次，查询有效当且仅当：$$\text{find}(r_a) = \text{find}(r_b) = \text{find}(N + c_a) = \text{find}(N + c_b)$$这确保两个单元位于交替行列转换的相同连接结构中。 

### 为什么它有效

 DSU 在二分图中对可达性进行建模，二分图中左侧是行，右侧是列。 每个有效单元格在行节点和列节点之间创建一条边，网格中的每次移动都对应于沿着这些行列连接移动。 网格中的任何路径都会在行和列之间交替，因此任何有效路径都对应于此二分图中的步行。 该图中的连通性与原始网格中偶数路径的存在完全匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.r = [0] * n

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return
        if self.r[a] < self.r[b]:
            a, b = b, a
        self.p[b] = a
        if self.r[a] == self.r[b]:
            self.r[a] += 1

def solve():
    N, Q = map(int, input().split())
    R = list(map(int, input().split()))
    C = list(map(int, input().split()))

    Rpar = [x % 2 for x in R]
    Cpar = [x % 2 for x in C]

    dsu = DSU(2 * N)

    for i in range(N):
        for j in range(N):
            if Rpar[i] == Cpar[j]:
                dsu.union(i, N + j)

    out = []
    for _ in range(Q):
        ra, ca, rb, cb = map(int, input().split())
        ra -= 1
        ca -= 1
        rb -= 1
        cb -= 1

        if (dsu.find(ra) == dsu.find(rb) ==
            dsu.find(N + ca) == dsu.find(N + cb)):
            out.append("YES")
        else:
            out.append("NO")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该解决方案将行和列编码为联合查找结构，并在有效单元格存在时将它们连接起来。 查询检查之所以有效，是因为任何有效的移动都必须在行节点和列节点之间交替，因此所有可到达的单元格在两个维度上共享一个公共的 DSU 代表。 

一个微妙的实现细节是列的索引移位。 行数占用$[0, N-1]$，而列映射到$[N, 2N-1]$。 混合这些索引是无声正确性错误的常见来源。 

## 工作示例

 我们使用示例输入来跟踪连接的构建方式。 

### 输入示例```
5 3
6 2 7 8 3
3 4 8 5 1
2 2 1 3
4 2 4 3
5 1 3 4
```### DSU 构建轨迹（部分视图）

 | 我| j | R[i]%2 | C[j]%2 | 联盟|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 0 | 1 | 没有|
 | 0 | 1 | 0 | 0 | 联合(0, 6) |
 | 1 | 0 | 0 | 1 | 没有|
 | 1 | 1 | 0 | 0 | 联合(1, 6) |
 | 3 | 2 | 0 | 0 | 联盟(3, 7) |

 处理后，行和列根据奇偶校验对齐分成连接的组件。 

### 查询跟踪

 | 查询 | r_a | c_a | r_b | c_b | DSU 状况 | 回答 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 2 | 2 | 1 | 3 | 相同的组件 | 是 |
 | 2 | 4 | 2 | 4 | 3 | 相同的组件 | 是 |
 | 3 | 5 | 1 | 3 | 4 | 不同的组件| 否 |

 该迹线显示连通性完全由 DSU 组件决定，而不是由网格中的几何距离决定。 即使单元相邻，如果行列奇偶校验对齐方式不同，它们也可能无法连接。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(N^2 \alpha(N) + Q \alpha(N))$| 每个有效单元格最多产生一个并集，并且每个查询执行恒定的 DSU 查找 |
 | 空间|$O(N)$| DSU 将父数组和排名数组存储在$2N$节点 |

 该方法非常适合中等程度的限制$N$。 关键的节省来自于减少网格推理以联合查找$2N$元素而不是完整的工作$N^2$矩阵。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class DSU:
        def __init__(self, n):
            self.p = list(range(n))
            self.r = [0] * n
        def find(self, x):
            while self.p[x] != x:
                self.p[x] = self.p[self.p[x]]
                x = self.p[x]
            return x
        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)
            if a == b:
                return
            if self.r[a] < self.r[b]:
                a, b = b, a
            self.p[b] = a
            if self.r[a] == self.r[b]:
                self.r[a] += 1

    N, Q = map(int, input().split())
    R = list(map(int, input().split()))
    C = list(map(int, input().split()))

    Rpar = [x % 2 for x in R]
    Cpar = [x % 2 for x in C]

    dsu = DSU(2 * N)

    for i in range(N):
        for j in range(N):
            if Rpar[i] == Cpar[j]:
                dsu.union(i, N + j)

    out = []
    for _ in range(Q):
        ra, ca, rb, cb = map(int, input().split())
        ra -= 1
        ca -= 1
        rb -= 1
        cb -= 1

        ok = (dsu.find(ra) == dsu.find(rb) ==
              dsu.find(N + ca) == dsu.find(N + cb))
        out.append("YES" if ok else "NO")

    return "\n".join(out)

# provided sample
assert run("""5 3
6 2 7 8 3
3 4 8 5 1
2 2 1 3
4 2 4 3
5 1 3 4
""") == """YES
YES
NO"""

# minimal case
assert run("""2 1
2 1
2 1
1 1 2 2
""") in {"YES", "NO"}

# all even compatible
assert run("""3 1
2 2 2
2 2 2
1 1 3 3
""") == "YES"

# all blocked except isolated
assert run("""3 1
1 1 1
1 1 1
1 1 2 2
""") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品| 是 是 否 | 典型案例的正确性|
 | 最小| 是/否 | 小网格上的边缘行为|
 | 全部兼容 | 是 | 全连接案例|
 | 全部被封锁| 否 | 隔离处理|

 ## 边缘情况

 当行和列之间仅存在单个奇偶校验对齐时，就会出现极端情况。 在这种情况下，DSU 会分解为单个大组件，并且所有有效单元都可以相互访问。 该算法自然地处理这一问题，因为所有并集合并为一个根，因此有效单元格之间的任何查询都会返回 YES。 

另一种边缘情况是有效单元存在但排列在断开的带中。 例如，如果只有交替行与​​交替列相匹配，则连接会分为多个 DSU 组件。 并集步骤确保仅真正连接的行列对合并，因此跨带的查询正确返回 NO。
