---
title: "CF 1696G - 钓鱼王子再次玩转阵列"
description: "我们得到一个数组，其值代表必须删除的数量。 操作作用于一对相邻的操作。 如果我们在边 $(i,i+1)$ 上花费 $t$ 秒，我们可以从该对中减去 $(x t, y t)$ 或从该对中减去 $(y t, x t)$。"
date: "2026-06-09T22:38:45+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "geometry", "math"]
categories: ["algorithms"]
codeforces_contest: 1696
codeforces_index: "G"
codeforces_contest_name: "Codeforces Global Round 21"
rating: 3300
weight: 1696
solve_time_s: 175
verified: false
draft: false
---

[CF 1696G - Fishingprince 再次玩转数组](https://codeforces.com/problemset/problem/1696/G)

 **评分：** 3300
 **标签：** 蛮力、数据结构、几何、数学
 **求解时间：** 2m 55s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个数组，其值代表必须删除的数量。 操作作用于一对相邻的操作。 

如果我们花$t$边缘秒$(i,i+1)$，我们可以减去$(x t, y t)$来自对或$(y t, x t)$来自这对。 

对于任意子数组$a=[b_l,\dots,b_r]$， 定义$f(a)$作为每个元素变为非正值所需的最小总时间。 

数组在线更新，每次类型 2 查询后我们必须报告$f$对于所请求的段。 

困难不在于更新。 真正的挑战是了解什么数量$f(a)$实际上是。 

数组长度最大为$2\cdot 10^5$，并且最多有$2\cdot 10^5$更新和范围查询。 任何从头开始重新计算分段答案的解决方案都会立即被排除。 甚至$O(\text{length})$每个查询需要大约$4\cdot 10^{10}$最坏情况下的操作。 

答案也是一个实数，这通常表明优化问题应该转换为线性程序或某种等效的组合结构。 

当一个位置与产生下限的参数中的所有其他位置隔离时，就会出现微妙的边缘情况。 

例如，与$x=1,y=2$和数组$[100,1,100]$，位置 1 和 3 决不属于同一操作。 仅基于总和的天真的论证会给出$$\frac{201}{3}=67.$$但位置 1 和位置 3 一起至少需要$$\frac{100+100}{2}=100$$秒，因为每个操作最多只能减少其中一个操作的速率$2$。 正确答案由更强的约束决定。 

另一个容易犯的错误是假设每个职位都是独立贡献的。 

为了$[100,100]$,$$f=\frac{200}{x+y},$$不是$$\frac{100}{y}+\frac{100}{y}.$$通过在两个位置之间的单个边缘上操作，可以同时处理两个位置。 

整个解决方案来自于准确理解可以同时实现哪些下限。 

## 方法

 蛮力视图是为每个可能的操作引入一个变量。 让$p_i$是在边缘度过的时间$i$使用方向$(x,y)$， 和$q_i$使用定向所花费的时间$(y,x)$。 

每个阵列位置接收来自相邻边缘的贡献。 我们想要最少的总时间$$\sum_i (p_i+q_i)$$前提是每个元素都减少到零。 

这是一个线性规划。 这是正确的，但它包含$O(n)$即使对于单个查询也可以使用变量。 直接解决是没有希望的。 

关键的观察结果是对偶线性程序具有出乎意料的简单结构。 假设之后$x\le y$，对偶变量可以解释为权重$d_i$分配到职位。 

双重约束意味着每个$d_i$必须是其中之一$$0,\quad \frac1{x+y},\quad \frac1y,$$以及每当$d_i=\frac1y$，两个邻居都必须为零。 换句话说，使用系数的位置$1/y$其行为类似于独立路径集中的选定顶点。 使用系数的位置$1/(x+y)$与其他任何东西都没有交互。 

通过 LP 对偶性证明的一个重要事实是，每个可行的对偶解都给出了一个下界$f(a)$，并且最好的下界恰好等于$f(a)$。 

于是原来的优化问题就变成了：$$f(a)= \max \sum_i a_i d_i,$$其中每个$d_i$选自$$0,\frac1{x+y},\frac1y,$$和位置使用$1/y$不能相邻。 

现在的问题纯粹是组合问题。 每个位置都有三种可能的状态。 

状态 0 贡献$0$。 

状态 1 贡献$a_i/(x+y)$。 

状态 2 贡献$a_i/y$。 

唯一的限制是两个连续位置不能同时处于状态 2。 

这是一条路径DP。 由于查询要求具有更新的任意子段，因此我们将 DP 转换存储为最大加矩阵，并在段树中维护矩阵乘积。 这正是公认的解决方案中使用的结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |

 |---|------|---|

 | 每个查询的线性规划 | 远高于此输入大小的多项式限制 | 大| 太慢了|

 | max-plus 矩阵的线段树 |$O(\log n)$每次更新/查询 |$O(n)$| 已接受 |

 ## 算法演练

 假设$x \le y$。 如果没有，请交换它们。 

对于一个职位$i$，定义三种状态。 

状态0表示系数$0$。 

状态1表示系数$1/(x+y)$。 

状态2表示系数$1/y$。 

职位贡献的价值$i$是：$$0,\quad \frac{a_i}{x+y},\quad \frac{a_i}{y}$$分别。 

1. 建立一个$3\times3$每个位置的最大加矩阵。 

该矩阵仅包含对角线值。 

状态 0 贡献$0$。 

状态 1 贡献$a_i/(x+y)$。 

状态 2 贡献$a_i/y$。 
2. 创建相邻位置之间的转移矩阵。 

除了状态之外，任何转换都是允许的$2 \to 2$。 

这编码了使用系数定位的规则$1/y$不能相邻。 
3. 使用 max-plus 矩阵乘法组合相邻段。 

如果矩阵$A$代表左段和$B$正确的段，然后$$A \cdot T \cdot B$$表示它们的串联，其中$T$是转移矩阵。 
4. 将这些矩阵存储在线段树中。 

每个节点存储描述其间隔的矩阵。 
5. 对于更新，重建叶矩阵并重新计算到根的路径上的矩阵。 
6. 对于范围查询$[l,r]$，获得准确表示该区间的矩阵。 
7. 答案是所得矩阵的最大条目。 

这对应于边界态的最佳选择，因此对应于最佳对偶值。 

### 为什么它有效

 对偶表征表明每个可行解都是一系列状态$0,1,2$，其中状态 2 不能出现在相邻位置。 目标价值正是国家贡献的总和。 

段矩阵存储每对边界状态的最佳可实现值。 最大加乘法是连接 DP 间隔同时增强相邻状态兼容性的标准方法。 

由于矩阵乘法精确地再现了路径 DP 递归，因此每个线段树节点都存储其区间的最优值。 查询矩阵的最大条目是所有可能的边界选择中的最优值，这等于对偶最优值。 LP对偶性保证了对偶最优值等于原来的最短时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 1e100

def mat_mul(A, B):
    C = [[-INF] * 3 for _ in range(3)]
    for i in range(3):
        ai = A[i]
        for k in range(3):
            if ai[k] <= -INF / 2:
                continue
            v = ai[k]
            bk = B[k]
            for j in range(3):
                nv = v + bk[j]
                if nv > C[i][j]:
                    C[i][j] = nv
    return C

class SegTree:
    def __init__(self, arr, x, y):
        self.n = len(arr)
        self.x = x
        self.y = y

        self.trans = [[-INF] * 3 for _ in range(3)]
        for i in range(3):
            for j in range(3):
                if ((i != 2 and j != 2) or i == 0 or j == 0):
                    self.trans[i][j] = 0.0

        self.seg = [None] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def leaf(self, val):
        M = [[-INF] * 3 for _ in range(3)]
        M[0][0] = 0.0
        M[1][1] = val / (self.x + self.y)
        M[2][2] = val / self.y
        return M

    def merge(self, A, B):
        return mat_mul(mat_mul(A, self.trans), B)

    def build(self, p, l, r, arr):
        if l == r:
            self.seg[p] = self.leaf(arr[l])
            return

        m = (l + r) // 2
        self.build(p * 2, l, m, arr)
        self.build(p * 2 + 1, m + 1, r, arr)
        self.seg[p] = self.merge(self.seg[p * 2], self.seg[p * 2 + 1])

    def update(self, p, l, r, idx, val):
        if l == r:
            self.seg[p] = self.leaf(val)
            return

        m = (l + r) // 2
        if idx <= m:
            self.update(p * 2, l, m, idx, val)
        else:
            self.update(p * 2 + 1, m + 1, r, idx, val)

        self.seg[p] = self.merge(self.seg[p * 2], self.seg[p * 2 + 1])

    def modify(self, idx, val):
        self.update(1, 0, self.n - 1, idx, val)

    def query(self, p, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.seg[p]

        m = (l + r) // 2
        if qr <= m:
            return self.query(p * 2, l, m, ql, qr)
        if ql > m:
            return self.query(p * 2 + 1, m + 1, r, ql, qr)

        left = self.query(p * 2, l, m, ql, qr)
        right = self.query(p * 2 + 1, m + 1, r, ql, qr)
        return self.merge(left, right)

    def range_answer(self, l, r):
        M = self.query(1, 0, self.n - 1, l, r)
        ans = -INF
        for i in range(3):
            for j in range(3):
                ans = max(ans, M[i][j])
        return ans

def solve():
    n, q = map(int, input().split())
    x, y = map(int, input().split())

    if x > y:
        x, y = y, x

    b = list(map(int, input().split()))

    seg = SegTree(b, x, y)

    out = []

    for _ in range(q):
        op, a, c = map(int, input().split())

        if op == 1:
            seg.modify(a - 1, c)
        else:
            out.append(f"{seg.range_answer(a - 1, c - 1):.15f}")

    sys.stdout.write("\n".join(out))

solve()
```叶矩阵表示单个位置的三种可能状态。 只有对角线条目有效，因为长度为 1 的线段以相同状态开始和结束。 

转移矩阵包含零（表示允许的状态对）和负无穷大（表示禁止的状态对）。 唯一禁止的邻接是状态 2 与状态 2 相邻。 

合并操作执行$$A \cdot T \cdot B$$在最大加代数中。 这是连接两个区间的 DP 递归。 

查询结果是描述整个段的矩阵。 取最大条目消除了对边界状态的任何限制并产生最佳值。 

## 工作示例

 ### 示例 1

 输入段：$[3,1,1,4]$,$x=1$,$y=2$。 

权重为：$$\frac{a_i}{x+y}= \left[1,\frac13,\frac13,\frac43\right]$$和$$\frac{a_i}{y}= \left[1.5,0.5,0.5,2\right].$$| 职位| 状态 1 值 | 状态 2 值 |
 | --- | --- | --- |
 | 1 | 1.0 | 1.5 | 1.5
 | 2 | 0.333333 | 0.5 | 0.5
 | 3 | 0.333333 | 0.5 | 0.5
 | 4 | 1.333333 | 2.0 |

 最佳选择是位置 1 和 4 处的状态 2，邻居不使用状态 2。 

| 职位| 选择的状态 | 贡献 |
 | --- | --- | --- |
 | 1 | 2 | 1.5 | 1.5
 | 2 | 0 | 0 |
 | 3 | 0 | 0 |
 | 4 | 2 | 2.0 |

 全部的：$$1.5+2.0=3.5.$$这与示例输出相匹配。 

该迹线展示了独立集限制。 位置1和位置4相距较远，因此都可以使用较强的系数$1/y$。 

### 小自定义示例

 数组$[1,1,1]$,$x=1$,$y=2$。 

| 职位| 状态 1 值 | 状态 2 值 |
 | --- | --- | --- |
 | 1 | 0.333333 | 0.5 | 0.5
 | 2 | 0.333333 | 0.5 | 0.5
 | 3 | 0.333333 | 0.5 | 0.5

 在位置 1 和 3 上选择状态 2 给出：

 | 职位| 状态| 贡献 |
 | --- | --- | --- |
 | 1 | 2 | 0.5 | 0.5
 | 2 | 0 | 0 |
 | 3 | 2 | 0.5 | 0.5

 全部的$=1.0$。 

该跟踪显示了为什么状态 2 的行为与选择路径上独立集合的顶点完全相同。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(\log n)$每次更新/查询 | 线段树高度，矩阵大小不变|
 | 空间|$O(n)$| 线段树存储一$3\times3$每个节点的矩阵 |

 矩阵只是$3\times3$，所以每次乘法都是常数时间。 和$2\cdot10^5$操作时，总运行时间完全在限制范围内。 

## 测试用例```python
# helper skeleton

import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdout = sys.__stdout__
    return out.getvalue()

# sample
assert run(
"""4 3
1 2
3 1 1 4
2 1 4
1 1 1
2 1 3
"""
).strip().splitlines()[0] == "3.500000000000000"

# minimum length
run(
"""2 1
1 2
1 1
2 1 2
"""
)

# all equal values
run(
"""5 1
1 2
10 10 10 10 10
2 1 5
"""
)

# update first position
run(
"""3 2
1 2
1 2 3
1 1 100
2 1 3
"""
)

# update last position
run(
"""3 2
1 2
1 2 3
1 3 100
2 1 3
"""
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品| 3.5 然后 1.0 | 基本正确性|
 | 长度 2 | 有限有效答案 | 允许的最小段 |
 | 一切平等| 对称行为| 重复值 |
 | 更新第一位置 | 正确的重新计算 | 左边界更新 |
 | 更新最后位置 | 正确的重新计算 | 右边界更新 |

 ## 边缘情况

 考虑$x=1,y=2$和数组$[100,1,100]$。 

总和下界仅给出$$201/3=67.$$我们的 DP 可以在位置 1 和 3 处选择状态 2。 

| 职位| 状态| 贡献 |
 | --- | --- | --- |
 | 1 | 2 | 50 | 50
 | 2 | 0 | 0 |
 | 3 | 2 | 50 | 50

 答案至少变成$100$，这才是真正的瓶颈。 独立集结构自动捕获这一点。 

考虑$[100,100]$。 

禁止在两个位置上选择状态 2。 最好的解决方案是：

 | 职位| 状态| 贡献 |
 | --- | --- | --- |
 | 1 | 1 | 100/（x+y）|
 | 2 | 1 | 100/（x+y）|

 全部的：$$\frac{200}{x+y}.$$这与唯一边缘上的一个操作可以同时处理两个元素这一事实相匹配。 

考虑在数组边界处进行长度为 2 的范围查询，例如$[1,2]$。 

线段树查询准确地返回该区间的矩阵。 不需要特殊处理，因为边界状态是在矩阵本身内部编码的。 自动获取最大条目会考虑每个有效的开始和结束状态。
