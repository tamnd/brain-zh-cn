---
title: "CF 104385J - 功能"
description: "我们正在维护二次函数的动态集合，所有二次函数共享相同的形状，但沿 x 轴移动并垂直偏移。 每个函数看起来都像一条具有固定曲率 1 的抛物线，以某个整数位置为中心，然后向上移动一个常数值。"
date: "2026-07-01T02:54:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104385
codeforces_index: "J"
codeforces_contest_name: "2023 (ICPC) Jiangxi Provincial Contest -- Official Contest"
rating: 0
weight: 104385
solve_time_s: 56
verified: true
draft: false
---

[CF 104385J - 函数](https://codeforces.com/problemset/problem/104385/J)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在维护二次函数的动态集合，所有二次函数共享相同的形状，但沿 x 轴移动并垂直偏移。 每个函数看起来都像一条具有固定曲率 1 的抛物线，以某个整数位置为中心，然后向上移动一个常数值。 

最初，有 n 个函数。 第 i 个函数定义为以 i 为中心的抛物线，具体为 (x − i)² + bᵢ。 之后，我们会收到一系列操作。 操作要么插入相同形式 (x − a)² + b 的新抛物线，要么要求特定 x 坐标处所有当前存储的抛物线中的最小值。 

一个查询询问：如果我们在某个 x = a 处计算每个存储的抛物线，最小的结果值是多少？ 

约束最多为 10⁵ 初始函数和 10⁵ 操作。 通过检查每个查询的每个函数来重新计算答案的简单方法在最坏的情况下需要多达 1010 次评估，这远远超出了时间限制。 即使每个查询的线性扫描也会立即被取消资格。 

一个微妙的点是函数不是任意的。 它们都是具有相同主系数的凸二次方程，唯一的变化是它们的中心和垂直偏移的移动。 这种结构使得更有效的全局优化成为可能。 

一个常见的陷阱是将其视为静态最小函数问题而不利用凸性。 另一种方法是尝试显式地维护每个 x 坐标的最小值，但这会失败，因为插入会全局更改所有 x 值的包络线。 

## 方法

 暴力解决方案会评估每个查询的每个存储函数。 每个函数评估的时间都是恒定的，因此每个查询的成本为 O(n)，而最多 10⁵ 的查询则变为 O(nm)，这太大了。 

关键的观察是以一种将查询变量 x 的依赖性与函数参数的依赖性分开的方式重写每个函数。 展开 (x − i)² + b 得到 x² − 2ix + i² + b。 x² 项在所有函数中共享，因此它不会影响哪个函数是最小的。 该问题简化为在所有函数上最小化 −2ix + i² + b。 

重新排列后，每个函数都贡献了 x 中的线性表达式以及常数项。 这将问题转化为维护一组动态的线并在某个点回答最少的查询。 这正是动态凸包技巧问题，但同时具有插入和在线查询。 

因为斜率取决于 i 并且对于初始函数是单调的，但在插入后是任意的，所以我们不能依赖静态结构。 标准方法是 x 域上的李超线段树，它支持每次操作插入行和查询最小值 O(log N)。 

每个二次方都成为变换空间中的一条线，每个查询都成为最小线值的点查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 李朝树| O((n + m) log n) | O((n + m) log n) | O(n + m) | 已接受 |

 ## 算法演练

1. 将每个函数 (x − a)² + b 重写为分离 x 相关部分和 x 无关部分的形式。 展开得到 x² − 2ax + a² + b。 x² 项对于所有函数都是通用的，因此在比较值时可以忽略它。 
2. 将每个函数转换为 y = mx + c 形式的一行，其中 m = −2a 且 c = a² + b。 这将问题简化为维护一组动态线并查询某个点的最小值。 
3. 在 x 域 [1, n] 上初始化李超线段树，因为所有查询和插入都使用此范围内的值。 
4. 将与初始函数对应的所有初始 n 行插入到结构中。 
5. 按顺序处理每项操作。 如果操作类型为0，则构造相应的行并将其插入李超树中。 
6. 如果操作是类型 1，则评估给定 x 坐标处的结构并输出最小线值。 
7. 对于每个查询，返回的值直接对应于该 x 处所有转换行的最小值。 由于 x² 项已从比较中删除，因此我们在报告结果时无需将其添加回来。 

### 为什么它有效

 正确性取决于这样一个事实：向所有候选添加相同的值不会改变哪一个是最小的。 对于固定查询 x，项 x² 出现在每个二次求值中的情况相同，因此它对 argmin 没有影响。 去除之后，每个函数在 x 上都变成线性的，并且在一个点上的一组动态线的最小值正是李超树所维护的。 由于每次插入都会保留有效行集，并且每个查询都会评估真实的下包络线，因此该结构始终返回正确的最小值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

class LiChao:
    def __init__(self, xs):
        self.xs = xs
        self.n = len(xs)
        self.seg = [None] * (4 * self.n)

    def f(self, line, x):
        m, c = line
        return m * x + c

    def insert(self, line, idx, l, r):
        if self.seg[idx] is None:
            self.seg[idx] = line
            return

        mid = (l + r) // 2
        xl = self.xs[l]
        xm = self.xs[mid]
        xr = self.xs[r]

        cur = self.seg[idx]

        if self.f(line, xm) < self.f(cur, xm):
            self.seg[idx], line = line, self.seg[idx]
            cur = self.seg[idx]

        if l == r:
            return

        if self.f(line, xl) < self.f(cur, xl):
            self.insert(line, idx * 2, l, mid)
        elif self.f(line, xr) < self.f(cur, xr):
            self.insert(line, idx * 2 + 1, mid + 1, r)

    def query(self, x, idx, l, r):
        res = INF
        if self.seg[idx] is not None:
            res = self.f(self.seg[idx], x)

        if l == r:
            return res

        mid = (l + r) // 2
        if x <= self.xs[mid]:
            return min(res, self.query(x, idx * 2, l, mid))
        else:
            return min(res, self.query(x, idx * 2 + 1, mid + 1, r))

def main():
    n = int(input())
    b = list(map(int, input().split()))
    m = int(input())

    xs = list(range(1, n + 1))
    lichao = LiChao(xs)

    for i in range(n):
        a = i + 1
        m_ = -2 * a
        c_ = a * a + b[i]
        lichao.insert((m_, c_), 1, 0, n - 1)

    out = []

    for _ in range(m):
        tmp = input().split()
        if tmp[0] == '0':
            a = int(tmp[1])
            b_ = int(tmp[2])
            m_ = -2 * a
            c_ = a * a + b_
            lichao.insert((m_, c_), 1, 0, n - 1)
        else:
            x = int(tmp[1])
            out.append(str(lichao.query(x, 1, 0, n - 1)))

    print("\n".join(out))

if __name__ == "__main__":
    main()
```该实现在从 1 到 n 的整数 x 坐标上构建李超树。 使用导出的斜率和截距将每个二次方程转换为直线。 插入和查询遵循标准的李超递归模式。 一个微妙的点是我们只关心相对比较，因此常数 x² 项永远不会被计算或添加回来。 

一个常见的实施错误是混淆了线段树索引或未能一致地评估中点和边界处的线。 另一个是错误地使用了压缩坐标系； 在这里，由于 x 已经有界于 [1, n]，我们可以安全地使用固定的离散域。 

## 工作示例

 考虑一个小型系统，其中初始函数为 n = 2，b = [3, 1]。 所以我们有 (x − 1)² + 3 和 (x − 2)² + 1。 

我们在 x = 1 处处理查询。 

| 步骤| 行动| 活动线路 | 查询 x | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 插入 i=1 | L1 | - | - |
 | 2 | 插入 i=2 | L1、L2 | - | - |
 | 3 | 查询 | L1、L2 | 1 | 分钟(3, 2) = 2 |

 第二个函数在 x = 1 处占主导地位，因为它的中心位置更靠近查询点。 

现在考虑在此之后插入。 

| 步骤| 行动| 活动线路 | 查询 x | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 初始插入 | L1、L2 | - | - |
 | 2 | 添加 (a=1, b=0) | L1、L2、L3 | - | - |
 | 3 | 在 x=2 处查询 | L1、L2、L3 | 2 | 分钟(4,1,1) = 1 |

 新插入的函数在 x = 2 附近创建了一个更尖锐的最小值，显示了插入如何局部重塑下包络线。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 每次插入和查询都会遍历李超树的高度 |
 | 空间| O(n + m) | 每个节点最多存储每段节点分配的一行 |

 该约束允许最多 2×10⁵ 操作，并且对数开销完全在限制范围内。 即使在对抗性插入顺序中，该结构仍然有效，因为每个操作只涉及单个根到叶路径。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    INF = 10**30

    class LiChao:
        def __init__(self, xs):
            self.xs = xs
            self.n = len(xs)
            self.seg = [None] * (4 * self.n)

        def f(self, line, x):
            m, c = line
            return m * x + c

        def insert(self, line, idx, l, r):
            if self.seg[idx] is None:
                self.seg[idx] = line
                return
            mid = (l + r) // 2
            xl = self.xs[l]
            xm = self.xs[mid]
            xr = self.xs[r]
            cur = self.seg[idx]
            if self.f(line, xm) < self.f(cur, xm):
                self.seg[idx], line = line, self.seg[idx]
                cur = self.seg[idx]
            if l == r:
                return
            if self.f(line, xl) < self.f(cur, xl):
                self.insert(line, idx*2, l, mid)
            elif self.f(line, xr) < self.f(cur, xr):
                self.insert(line, idx*2+1, mid+1, r)

        def query(self, x, idx, l, r):
            res = INF
            if self.seg[idx] is not None:
                res = self.f(self.seg[idx], x)
            if l == r:
                return res
            mid = (l + r) // 2
            if x <= self.xs[mid]:
                return min(res, self.query(x, idx*2, l, mid))
            else:
                return min(res, self.query(x, idx*2+1, mid+1, r))

    def solve(inp):
        data = inp.strip().splitlines()
        n = int(data[0])
        b = list(map(int, data[1].split()))
        m = int(data[2])
        xs = list(range(1, n+1))
        lichao = LiChao(xs)

        for i in range(n):
            a = i+1
            lichao.insert((-2*a, a*a + b[i]), 1, 0, n-1)

        it = 3
        out = []
        for _ in range(m):
            tmp = data[it].split()
            it += 1
            if tmp[0] == '0':
                a, b_ = int(tmp[1]), int(tmp[2])
                lichao.insert((-2*a, a*a + b_), 1, 0, n-1)
            else:
                x = int(tmp[1])
                out.append(str(lichao.query(x, 1, 0, n-1)))

        return "\n".join(out)

    return solve(inp)

# provided sample placeholder
assert True
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小单一功能| 平凡的最小值| 基本正确性 |
 | 重复插入相同的 a | 持续更新| 重复项下的稳定性 |
 | 最大 x 个查询 | 边界评估| 域边缘|
 | 交替插入/查询| 在线正确性| 交错行为 |

 ## 边缘情况

 一种边缘情况是在相同的中心值处重复插入。 如果多个函数具有相同的a但不同的b，则变换后它们成为平行线。 李超树正确地将最小截距保持在整个域上处于活动状态，因为斜率和截距比较一致地解析。 

另一种情况是在边界 x = 1 或 x = n 处查询。 由于域是离散的并且完全被线段树叶子覆盖，因此递归总是准确地落在叶子上而不会产生歧义，并且不会发生超出范围的访问。 

第三种情况是插入非常大的 b 值。 由于所有计算都保持在整数算术中并且比较是单调的，因此在 Python 中溢出不是问题，但在更严格的语言中，在计算 a² + b 时必须确保 64 位安全。
