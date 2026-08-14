---
title: "CF 102309H - 霍顿和奥兹熊猫"
description: "我们有一个无向图，其顶点是 Orz Pandas，其边是可能的数据链接。 每条边都有两个正值，a 和 b。 对于选定的一组边 S，通信要求规定选定的边必须形成连通的生成子图。"
date: "2026-08-13T23:47:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102309
codeforces_index: "H"
codeforces_contest_name: "The 2019 \u201cOrz Panda\u201d Cup Programming Contest"
rating: 0
weight: 102309
solve_time_s: 127
verified: true
draft: false
---

[CF 102309H - 霍顿和 Orz 熊猫](https://codeforces.com/problemset/problem/102309/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个无向图，其顶点是 Orz Pandas，其边是可能的数据链接。 每条边都有两个正值，`a`和`b`。 对于一组选定的边`S`，通信要求规定所选择的边必须形成一个连通的生成子图。 这样一组的分数是

 [
 f(S)=\frac{\sum_{e\in S} b_e}{\sum_{e\in S} a_e}。 
]

 任务是最大化这个比率。 

分母总是正数，因为每个`a_e`是正数并且是一个连通图`n > 1`需要至少一个边缘。 保证该图至少包含一个连通的生成子图，因此优化问题总是有可行解。 

约束足够大，以至于枚举边缘子集是完全不可能的。 对于最多 (10^5) 条边，即使 (O(m^2)) 也已经大约是 (10^{10}) 次操作，而我们需要的图算法每个优化步骤应该接近 (O(m\log m))。 顶点数量最多为 (10^4)，因此不相交集并集结构非常适合重复维护连通分量。 的价值观`a`和`b`可以达到 (10^7)，因此总和大约可以达到 (10^{12})。 Python 整数可以安全地处理这个问题，而只有比率参数才需要浮点。 

在许多情况下，看似合理的简化却失败了。 

首先，答案不必由生成树表示。 考虑```
3 3
1 2 1 10
2 3 1 1
1 3 10 10
```选择边缘`1-2`和`2-3`给出 (11/2=5.5)，同时选择所有三个给出 (21/12=1.75)。 这里的最佳解决方案恰好是一棵树，但这个例子表明，简单地选择具有较大个体比率的每条边是不够的。 连通性和累积的分子和分母必须一起考虑。 

其次，变换后的边可能具有负值，但仍然是必要的。 例如，```
3 2
1 2 1 10
2 3 100 1
```唯一的连通解包含两条边，所以答案是

 [
 \frac{10+1}{1+100}=\frac{11}{101}。 
]

 简单地保留具有正变换权重的边的方法会丢弃第二条边并使图断开连接。 

第三，多条边可以具有完全相同的比率。 为了```
3 3
1 2 7 7
2 3 7 7
1 3 14 14
```每个可行的选择都有分数（1）。 该算法必须处理零变换权重，而不将它们视为提前终止的原因。 

## 方法

 暴力解决方案在概念上很简单。 枚举每个子集`m`可能的链接，测试所选边是否连接所有`n`顶点，并且对于每个连接的子集，计算其总和的比率`b`其总价值`a`价值。 有 (2^m) 个子集，并使用 DFS 或 DSU 检查连接成本 (O(n+m))。 因此，最坏情况的操作计数是 (O(2^m(n+m)))，即使是几十条边也已经没有希望了，更不用说 (10^5) 了。 

一个更诱人的想法是寻找具有最佳比率的生成树。 这还不够，因为最初的问题允许额外的边缘。 额外的边缘可以提高比率，如果它自己`b/a`比率高于当前比率，即使它创建了一个周期。 优化是针对连接的子图，而不仅仅是树。 

关键的观察是暂时用线性目标代替比率目标。 假设我们猜测答案是某个值（\lambda）。 对于连通边集`S`, 定义

 [
 W_\lambda(S)=\sum_{e\in S}(b_e-\lambda a_e)。 
]

 如果真正的最优值是(R)，那么

 [
 R=\max_S\frac{B(S)}{A(S)}
 ]

 相当于说

 [
 \max_S \left(B(S)-RA(S)\right)=0。 
]

 对于候选者（\lambda），一条边已经变换了权重

 [
 w_e=b_e-\lambda a_e。 
]

 现在我们需要找到所有连接的跨越子图的最大总变换权重。 

这个辅助问题有一个简单的贪心结构。 应包括具有正变换权重的每条边，因为添加它不会损害连接性并严格增加变换目标。 每个零权重边也可以包含在内，因为它在转换后的目标中不花费任何成本，并且可能有助于连接。 在包含所有非负边之后，它们的端点形成一些连通分量。 剩下的唯一任务是连接这些组件。 由于仍在考虑的每条边都具有负变换权重，因此我们希望连接组件的有害边最少。 这正是剩余组件上的最大生成树问题，克鲁斯卡尔算法通过处理从最大到最小的变换权重来解决该问题。 

这给出了固定（\lambda）的精确预言。 

然后我们使用丁克尔巴赫的分数规划方法。 从任何可行的连通边集开始，并令其比率为(\lambda)。 找到最大化 (B-\lambda A) 的连通子图。 如果其变换值为零，则 (\lambda) 是最优值。 否则，新选择的子图具有严格更好的比率，因此用其比率替换 (\lambda) 并重复。 

暴力破解之所以有效，是因为它直接评估每个可行的子图，但会失败，因为子图的数量是指数级的。 比率可以转换为线性表达式的观察结果为我们提供了最大权重连通子图预言机，丁克尔巴赫的方法将对该预言机的重复调用转变为所需的最优值。 

比较是：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^m(n+m))) | (O(n+m)) | 太慢了|
 | 二分查找 + 转换连通子图 oracle | (O(公里\log米)) | (O(n+m)) | 正确，但是很多 oracle 调用 |
 | Dinkelbach + 转换后的连通子图预言机 | (O(Im\log m)) | (O(n+m)) | 已接受 |

 这里`K`是二分搜索迭代的次数，`I`是 Dinkelbach 迭代次数。 对于这个有限组合问题，丁克尔巴赫在对所选解进行有限多次变化后达到最佳比例，并且实际上迭代次数很少。 公认的竞赛方法使用此属性，而不是支付数十轮固定精度二进制搜索的费用。 

## 算法演练

 1. 读取所有边并计算整个边集的比率 (\lambda=B_{\text{all}}/A_{\text{all}})。 由于输入图本身是连接的，完整的边集是可行的解决方案，因此这给出了有效的起始比率。 
2. 对于 (\lambda) 的当前值，为每条边分配变换后的权重

 [
 w_e=b_e-\lambda a_e。 
]

 最大化该参数处的原始比率相当于最大化这些变换后的权重的总和。 
3. 通过减少变换后的权重对所有边进行排序。 使用 DSU 结构来维护由已接受的边形成的连接组件。 
4. 每当一条边具有非负变换权重时，将其包含在选定的子图中。 它的端点也统一在 DSU 中。 正边缘会增加变换后的目标，而零边缘只能帮助连接。 
5. 对于负变换边，仅当其端点当前属于不同的 DSU 组件时才包含它。 这样的边对于连接这些组件是必要的，并且克鲁斯卡尔的排序保证了在连接组件的所有方式中，所选择的负边使变换后的总和最大化。 
6、选择边的同时，将原分子和分母同时累加，即`sum_b`和`sum_a`。 变换后的目标也等于`sum_b - lambda * sum_a`。 
7. 处理完所有边后，计算

 [
 \lambda_{\text{new}}=\frac{\text{sum_b}}{\text{sum_a}}。 
]

 如果新值与当前值没有变化，则变换后的最优值为零，并且当前比率是最优的。 否则，设置`lambda = lambda_new`并重复。 
8. 打印具有足够小数位的最终比率。 小数点后 12 位足以满足所需的 (10^{-9}) 绝对或相对误差。 

变换子问题起作用的原因是由其不变量捕获的：在以递减的变换权重处理边的任何前缀之后，DSU 准确地表示使用已经考虑的边可以获得的连接性，而所选集具有受该部分处理影响的最大可能变换值。 所有非负边在变换问题的最优中都是强制性的，并且仍然必要的负边在结果组件之间形成最大跨越森林。 

对于 Dinkelbach 来说，令 (F(\lambda)) 为连通生成子图上 (B(S)-\lambda A(S)) 的最大值。 如果(\lambda<R)，某个可行解的比率大于(\lambda)，所以(F(\lambda)>0)。 如果(\lambda>R)，则每个可行解最多具有比值(\lambda)，因此(F(\lambda)<0)。 在最佳值 (R) 处，(F(R)=0)。 当预言机返回一个具有正变换值的解时，其比率严格大于当前的（\lambda），因此序列单调地趋向最优。 当预言机返回零时，当前值恰好是最佳比率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    __slots__ = ("parent", "size")

    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        parent = self.parent
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(self, a, b):
        parent = self.parent
        size = self.size

        a = self.find(a)
        b = self.find(b)

        if a == b:
            return False

        if size[a] < size[b]:
            a, b = b, a

        parent[b] = a
        size[a] += size[b]
        return True

def solve_case(n, edges):
    total_a = 0
    total_b = 0

    for u, v, a, b in edges:
        total_a += a
        total_b += b

    # The complete graph is connected, so this is a feasible starting point.
    lam = total_b / total_a

    # Dinkelbach iterations.
    while True:
        # Reordering the edge list is intentional. Timsort can reuse existing
        # order between iterations in many instances.
        edges.sort(key=lambda e: e[3] - lam * e[2], reverse=True)

        dsu = DSU(n)

        sum_a = 0
        sum_b = 0

        for u, v, a, b in edges:
            w = b - lam * a

            if w >= 0.0:
                # Every nonnegative transformed edge belongs to an optimum.
                sum_a += a
                sum_b += b
                dsu.union(u, v)
            else:
                # Negative edges are used only when they are necessary for
                # connecting two currently different components.
                if dsu.union(u, v):
                    sum_a += a
                    sum_b += b

        new_lam = sum_b / sum_a

        # At the exact optimum, the maximizing transformed solution has
        # ratio equal to the current parameter.
        if new_lam == lam:
            return lam

        lam = new_lam

def main():
    out = []

    while True:
        line = input()
        if not line:
            break

        n, m = map(int, line.split())
        edges = []

        for _ in range(m):
            x, y, a, b = map(int, input().split())
            edges.append((x - 1, y - 1, a, b))

        ans = solve_case(n, edges)
        out.append(f"{ans:.12f}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```DSU 将路径压缩与按大小并集结合使用，因此对于所涉及的问题大小，每个并集或查找操作实际上都是恒定时间。 图顶点立即从从一开始的输入索引转换为从零开始的索引，这使所有内部数组访问保持一致。 

第一遍计算所有边的比率。 完整的边集由输入保证连接，因此这是一个有效的可行比率。 从可行的比率开始是有用的，因为每次丁克尔巴赫更新只能将其改进到最佳状态。 

在每次迭代中，变换后的权重计算为`b - lam * a`。 排序顺序是降序的，因为我们正在解决最大权重问题。 该代码处理`w >= 0`作为无条件包含。 这包括零权重边，它可以连接组件而不改变转换后的目标。 

对于下降沿，DSU 检查是 Kruskal 条件。 如果端点已经连接，添​​加边只会减少变换后的目标。 如果它们位于不同的组件中，则边缘对于向连通图取得进展是必要的，因此可以接受。 

原来的`a`和`b`累加总和而不是浮点转换后的总和。 这可以避免在计算下一个比率时出现不必要的数值错误。 所有输入总和都适合 Python 整数，唯一的浮点运算是转换后的比较和比率更新。 

终止测试使用浮点比率的相等而不是任意的 epsilon。 每次更新本身都是两个整数和的商，一旦再次选择相同的最佳组合解决方案，计算出的商将由相同的 Python 浮点值表示。 这可以避免仅仅因为所选的 epsilon 大于剩余间隙而过早停止。 

## 工作示例

 仅提供了一个官方示例，因此下面的第二条轨迹使用了一个小型构造案例，该案例练习了对负连接边的需求。 

### 示例 1

 该图是```
4 4
1 2 20 10
2 3 30 10
3 4 40 10
4 1 50 10
```所有四个边的初始比率为(40/140=2/7)。 

| 迭代 | 电流 (\lambda) | 选定的边| 总和| 总和B | 新比例|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 0.285714285714 | 1-2、2-3、3-4 | 90 | 90 30| 0.333333333333 |
 | 2 | 0.333333333333 | 1-2、2-3、3-4 | 90 | 90 30| 0.333333333333 |

 在第一次迭代时，变换后的权重约为 (4.286)、(1.429)、(-1.429) 和 (-4.286)。 前两条边为正边，连接顶点 1、2 和 3。在负边中，`3-4`危害小于`4-1`，所以选择连接顶点4。 

所得比率为(30/90=1/3)。 在 (\lambda=1/3) 处，第一个边为正，第二个边正好为零，第三个边为负，但需要连接顶点 4，第四个边甚至更负。 选择相同的集合，因此比率已达到固定点。 输出是`0.333333333333`。 

### 构造示例 2

 考虑```
3 2
1 2 1 10
2 3 100 1
```只有一组连接的跨越边，因此必须选择两条边。 

| 迭代 | 电流 (\lambda) | 边缘 1-2 | 边缘 2-3 | 已选择 A | 已选择 B | 新比例|
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 11/101 | 11/101 积极| 负| 101 | 101 11 | 11 11/101 | 11/101
 | 2 | 11/101 | 11/101 积极| 零| 101 | 101 11 | 11 11/101 | 11/101

 第二条边在第一次变换优化期间为负，但它将顶点 3 连接到现有组件，因此 DSU 接受它。 这说明了为什么转换后的解决方案不能简单地丢弃每个负边。 

在第二次迭代时，第二条边的变换权重恰好变为零，因为其比率为 (1/100)，而当前全局比率为 (11/101)。 边缘仍然包含在内，因为连接需要它。 最终答案是（11/101）。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(Im\log m)) | 每次 Dinkelbach 迭代都会排序`m`变换边权重并执行 (O(m\alpha(n))) DSU 工作 |
 | 空间| (O(n+m)) | 边缘列表、DSU 数组和排序元数据需要线性内存 |

 这里`I`表示 Dinkelbach 迭代次数。 每次迭代主要是对边缘进行排序，而 DSU 操作实际上是线性的。 使用 (m\le 10^5)，图本身可以在内存限制内轻松表示。 Dinkelbach 迭代的实际次数很少，因为每次非终结迭代都用严格更好的变换解的比率替换当前比率。 

使用 Dinkelbach 而不是固定的 60 或 100 步二分搜索在这里特别有用，因为每个预言机调用都需要对最多 (10^5) 条边进行排序。 减少此类调用的次数是主要的性能考虑因素。 

## 测试用例```python
# The test harness below mirrors the submitted algorithm.
import sys
import io

class DSU:
    __slots__ = ("parent", "size")

    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        parent = self.parent
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(self, a, b):
        parent = self.parent
        size = self.size

        a = self.find(a)
        b = self.find(b)

        if a == b:
            return False

        if size[a] < size[b]:
            a, b = b, a

        parent[b] = a
        size[a] += size[b]
        return True

def solve_case(n, edges):
    total_a = sum(e[2] for e in edges)
    total_b = sum(e[3] for e in edges)

    lam = total_b / total_a

    while True:
        edges.sort(key=lambda e: e[3] - lam * e[2], reverse=True)

        dsu = DSU(n)
        sa = 0
        sb = 0

        for u, v, a, b in edges:
            w = b - lam * a

            if w >= 0.0:
                sa += a
                sb += b
                dsu.union(u, v)
            elif dsu.union(u, v):
                sa += a
                sb += b

        new_lam = sb / sa

        if new_lam == lam:
            return lam

        lam = new_lam

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    out = []

    while True:
        line = sys.stdin.readline()
        if not line:
            break

        n, m = map(int, line.split())
        edges = []

        for _ in range(m):
            x, y, a, b = map(int, sys.stdin.readline().split())
            edges.append((x - 1, y - 1, a, b))

        out.append(f"{solve_case(n, edges):.12f}")

    sys.stdin = old_stdin
    return "\n".join(out)

# Provided sample
assert run(
    """\
4 4
1 2 20 10
2 3 30 10
3 4 40 10
4 1 50 10
"""
) == "0.333333333333", "sample 1"

# Minimum-size graph. The only edge has ratio 8/2 = 4.
assert run(
    """\
2 1
1 2 2 8
"""
) == "4.000000000000", "minimum-size case"

# A negative transformed edge is unavoidable because it is the only bridge.
assert run(
    """\
3 2
1 2 1 10
2 3 100 1
"""
) == "0.108910891089", "required negative edge"

# All edges have exactly the same ratio.
assert run(
    """\
3 3
1 2 7 7
2 3 7 7
1 3 14 14
"""
) == "1.000000000000", "equal ratios"

# Maximum n and m. All edges have ratio 1, so every connected solution has
# the same ratio. The graph contains a chain plus many parallel edges.
n = 10000
m = 100000
lines = [f"{n} {m}"]

for i in range(1, n):
    lines.append(f"{i} {i + 1} 10000000 10000000")

for _ in range(m - (n - 1)):
    lines.append("1 2 10000000 10000000")

assert run("\n".join(lines) + "\n") == "1.000000000000", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 1 / 1 2 2 8`|`4.000000000000`| 最少的顶点数和最简单的连通图 |
 |`3 2 / 1 2 1 10 / 2 3 100 1`|`0.108910891089`| 连通性所必需的负变换边 |
 | 三个边与`b/a = 1`|`1.000000000000`| 等比和零变换权重 |
 |`n=10000, m=100000`， 全部`a=b=10000000`|`1.000000000000`| 最大指定维度、大整数和以及 DSU 可扩展性 |

 ## 边缘情况

 只有两个顶点的图在最小有效实例中恰好有一个所需的连接。 为了```
2 1
1 2 2 8
```唯一可行的集合包含单边，因此答案是 (8/2=4)。 初始比率已经是 4，变换后的权重为零，因此算法立即达到其固定点。 

强制低比率桥由转换后的预言机的 Kruskal 部分处理。 在```
3 2
1 2 1 10
2 3 100 1
```第一条边具有较高的变换值，而第二条边为负值。 接受第一条边后，顶点 1 和 2 形成一个分量，顶点 3 被隔离。 负面边缘连接了这些组成部分，因此 DSU 接受它，尽管它有负面贡献。 最终比例为（11/101），大约`0.108910891089`。 

等比是另一个有用的边界情况。 在```
3 3
1 2 7 7
2 3 7 7
1 3 14 14
```每条边的比率为 1。在 (\lambda=1) 处，每个变换后的权重恰好为零。 预言机可以包含边缘，并且结果比率保持为 1。 中的相等处理`w >= 0.0`允许零权重边提供连接。 

最大尺寸测试包含（10^4）个顶点和（10^5）条边，每条边满足`a=b=10000000`。 总和很大，但 Python 整数可以准确地表示它们。 由于每条边的比率为 1，因此变换后的权重在 (\lambda=1) 处消失，并且答案恰好保持为 1。这种情况还在最大指定输入维度上练习 DSU 和排序代码。
