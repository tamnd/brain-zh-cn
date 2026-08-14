---
title: "CF 102341B - 妙蛙种子"
description: "该图由 (n) 层组成，每层恰好包含 (k) 个顶点。 边仅从第 (i) 层到第 (i+1) 层。 藤蔓是一条有向路径，两条藤蔓不能共享顶点或边。"
date: "2026-08-14T05:18:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "B"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 331
verified: true
draft: false
---

[CF 102341B - 妙蛙种子](https://codeforces.com/problemset/problem/102341/B)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该图由 (n) 层组成，每层恰好包含 (k) 个顶点。 边仅从第 (i) 层到第 (i+1) 层。 藤蔓是一条有向路径，两条藤蔓不能共享顶点或边。 对于两层 (i<j)，(f(i,j)) 是从层 (i) 到层 (j) 的顶点不相交有向路径的最大数量。 任务是将每对不同层上的该值相加。 

For fixed (i,j), this is a maximum-flow problem with vertex capacities equal to one. 将每个顶点分割为一个内顶点和一个外顶点，它们之间有一条容量为 1 的边。 隧道接收无限容量，超级源连接到层（i）的每个顶点，而层（j）的每个顶点连接到超级汇。 由此产生的最大流量恰好是 (f(i,j))。 

约束 (k\leq 9) 是关键。 层数可以大到 (40000)，因此 (n) 中的任何二次方都已经太大了。 There are roughly (8\cdot 10^8) pairs of layers when (n=40000), so explicitly solving a flow problem for every pair is impossible. 另一方面，(2^k\leq512)，这使得子集动态规划变得实用。 The accepted approach exploits exactly this asymmetry, replacing the quadratic number of intervals by (n) transitions over (2^k) subsets. 所得复杂度为 (O(nk^2 2^k))。 

There are several boundary cases that are easy to mishandle. 当 (k=1) 时，单个缺失的隧道会立即使穿过它的每个区间的流量为零。 例如，```
2 1
0
```有答案`0`。 假设每对相邻层贡献至少一条路径的解决方案将错误地返回`1`。 

相反的情况也很有用。 当 (k=1) 且每个隧道都存在时，```
3 1
1
1
```每对层都有一条路径，所以答案是`3`。 仅计算最大长度路径的解决方案将错过从第 1 层到第 2 层的间隔并返回`1`。 

当中间层中的一个顶点不可用时，会发生第二种微妙的情况。 在第一个样本中，最后一个矩阵包含零行，因此只有三个路径可以从第 3 层穿越到第 4 层。因此 (f(3,4)=3)，即使较早的层允许四个不相交的路径。 独立处理每一层并在不检查连通性的情况下获取最少数量的顶点是不正确的。 

## 方法

 直接的方法是考虑每个区间 ([i,j])，构建其顶点容量流网络，并运行最大流算法。 这是正确的，因为门格尔定理确定了具有最小顶点切割的顶点不相交路径的最大数量。 分裂顶点后，问题就变成了普通的边容量流。 

问题是间隔的数量。 它们有 (\Theta(n^2)) 个。 长度为 (L) 的区间包含 (O(Lk)) 个顶点和 (O(Lk^2)) 个可能的隧道边。 即使是 Ford-Fulkerson 风格的实现也需要最多 (k) 次增强，在一个时间间隔内提供 (O(Lk^3)) 次工作。 对所有间隔求和，总数为 (O(n^3k^3))。 对于 (n=40000)，仅间隔长度之和为

 [
 \sum_{1\leq i<j\leq n}(j-i)
 =\frac{n(n-1)(n+1)}6,
 ]

 大约是 (1.07\cdot10^{13})。 当 (k=9) 时，相应的 (k^3) 因子在考虑流开销之前大约给出 (7.8\cdot10^{15}) 个边缘处理单元。 

蛮力之所以有效，是因为每个单独的流量值都很小，最多为 (k)，但它会失败，因为它为每对层分别解决了本质上相同的小问题。 

关键的观察是使用最小割公式而不是直接计算流量值。 对于固定的右端点 (r)，为每个 (c\in[1,k]) 定义最大层 (L_c)，使得

 [
 f(L_c,r)\geq c.
 ]

 因为向左扩展间隔只会使不相交路径的集合变得更加困难，所以支持 (c) 路径的左端点集合是后缀。 因此，(f(i,r)\geq c) 的左端点 (i<r) 的数量就是 (r-L_c)。 自从

 [
 f(i,r)=\sum_{c=1}^{k}[f(i,r)\geq c],
 ]

 我们得到

 \sum_{c=1}^{k}(r-L_c)。 
]

 因此，整个问题变成了在从左到右扫描图表的同时维持这（k）个阈值位置。 

剩下的困难是在不显式存储其所有顶点的情况下描述最小割。 由于每层仅包含 (k\leq9) 个顶点，因此用位掩码 (S) 表示当前层中仍然可到达的顶点。 对于每个子集（S）和每个切割阈值（c），我们维护最大可能的左端点，对于该左端点，所需大小的切割恰好可以到达（S）。 跨一个矩阵移动会将 (S) 变换到其邻域，并且从可达集中删除顶点会增加切割所使用的顶点数量。 这两种操作都可以使用子集 DP 来执行。 

这与标准公认解决方案背后的小宽度状态压缩相同。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^3k^3)) | (O(nk^2)) 对于一个流网络 | 太慢了|
 | 最佳| (O(nk^2 2^k)) | (O(k2^k)) | 已接受 |

 ## 算法演练

 1. 用 (k) 位掩码表示当前层的每个子集。 设置位意味着从切口的左侧仍然可以到达相应的顶点。 
2. 对于每个掩码 (S) 和每个 (c\in[0,k])，保持`dp[S][c]`。 它的值是一个层索引。 它表示最左端点，在支付相应的削减成本后，当前可达集可以恰好为（S），同时保留至少（c）个连接单位。 我们从这个状态中需要的唯一信息是最大可能的左端点，因为这正是决定有多少间隔对答案做出贡献的因素。 
3. 最初我们位于第 1 层。如果 (S) 中的顶点仍然可达，则可以删除其他 (k-|S|) 顶点。 这给出了初始阈值
 [
 dp[S][c]=1
 ]
 每当 (c\leq k-|S|) 时。 更大的阈值是不可能的，因此这些条目接收标记值 (n+1)。 
4. 读取当前层与下一层之间的矩阵。 对于旧层的每个顶点，存储其传出邻居的位掩码。 对于子集 (S)，其完整邻域是这些掩码的并集。 
5. 在删除新层中的顶点之前，将每个状态从 (S) 转移到其邻域 (N(S))。 当几个旧子集产生相同的新子集时，它们的状态描述了实现相同可达集的替代方法，因此我们通过为每个（c）保留最佳阈值来合并它们。 
6. 现在在新层内处理顶点删除。 如果可达集是 (S)，则删除顶点 (u\in S) 会将状态更改为 (S\setminus{u}) 并将已删除顶点的数量增加 1。 在 DP 中，这是一个一位子集转换：
 [
 dp[S\setminus{u}][c]
 \左箭头
 \max(dp[S\setminus{u}][c],dp[S][c-1])。 
]
 将其应用于每个设置位会执行新层的整个切割构造。 
7. 空集是当前层中没有顶点从左端点可达的状态。 因此`dp[0][c]`正是最大的左端点，对应于阈值（c）的切割可以将该端点与当前层断开。 
8. 对于每个 (c=1,\ldots,k)，添加
 [
 r-dp[0][c]
 ]
 到答案。 这对至少存在 (c) 条不相交路径的左端点 (i<r) 进行计数。 对 (c) 求和正是在 (r) 层结束的流量值的总和。 
9. 继续遍历所有 (n-1) 个矩阵。 只需要两个 DP 层，因此内存消耗仍然是 (O(k2^k))。 

正确性不变量是在处理层（r）之后，每个状态`dp[S][c]`存储与剪切兼容的最左端点，该剪切使 (S) 在层 (r) 处可到达，并且仍然支持阈值 (c)。 邻域过渡正是在不切割顶点的情况下穿过下一层的效果，而子集过渡则枚举了该层中切割顶点的所有可能选择。 因此，空集状态考虑了每个可能的顶点切割。 根据最大流最小割定理，其阈值相当于相应的顶点不相交路径的数量。 最后，左端点的单调性将每个阈值转换为简单计数 (r-dp[0][c])，因此每个 (f(i,r)) 对于它贡献的每个流量单位都会被精确计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, k = map(int, input().split())

    size = 1 << k
    inf = n + 1

    popcnt = [0] * size
    for mask in range(1, size):
        popcnt[mask] = popcnt[mask >> 1] + (mask & 1)

    bits = [[] for _ in range(size)]
    for mask in range(1, size):
        x = mask
        cur = bits[mask]
        while x:
            b = x & -x
            cur.append(b.bit_length() - 1)
            x ^= b

    dp = [[inf] * (k + 1) for _ in range(size)]

    for mask in range(size):
        lim = k - popcnt[mask]
        row = dp[mask]
        for c in range(lim + 1):
            row[c] = 1

    ans = 0

    def merge(dst, src):
        a0 = dst[0]
        b0 = src[0]

        if a0 <= b0:
            base = a0
            for c in range(1, k + 1):
                x = src[c]
                if x == b0:
                    x = base
                if x > dst[c]:
                    dst[c] = x
        else:
            base = b0
            old0 = a0
            for c in range(1, k + 1):
                x = dst[c]
                if x == old0:
                    x = base
                y = src[c]
                if y > x:
                    x = y
                dst[c] = x
            dst[0] = base

    def merge_shift(dst, src):
        a0 = dst[0]
        b0 = src[0]

        if a0 <= b0:
            base = a0
            for c in range(1, k + 1):
                x = src[c - 1]
                if x == b0:
                    x = base
                if x > dst[c]:
                    dst[c] = x
        else:
            base = b0
            old0 = a0
            for c in range(1, k + 1):
                x = dst[c]
                if x == old0:
                    x = base
                y = src[c - 1]
                if y > x:
                    x = y
                dst[c] = x
            dst[0] = base

    for layer in range(2, n + 1):
        to = [0] * k

        for u in range(k):
            s = input().strip()
            while not s:
                s = input().strip()

            mask = 0
            for v, ch in enumerate(s):
                if ch == '1':
                    mask |= 1 << v
            to[u] = mask

        # neigh[mask] = union of all outgoing neighbors of vertices in mask.
        neigh = [0] * size
        for mask in range(1, size):
            b = mask & -mask
            u = b.bit_length() - 1
            neigh[mask] = neigh[mask ^ b] | to[u]

        nxt = [[inf] * (k + 1) for _ in range(size)]

        # Cross the current matrix without deleting a vertex.
        for mask in range(size):
            merge(nxt[neigh[mask]], dp[mask])

        dp = nxt

        # Delete vertices in the new layer.
        for mask in range(size - 1, 0, -1):
            src = dp[mask]
            for u in bits[mask]:
                merge_shift(dp[mask ^ (1 << u)], src)

        # A cut cannot need a left endpoint beyond the current layer.
        for mask in range(size):
            lim = k - popcnt[mask]
            row = dp[mask]
            for c in range(lim + 1):
                if row[c] > layer:
                    row[c] = layer

        empty = dp[0]
        for c in range(1, k + 1):
            ans += layer - empty[c]

    print(ans)

if __name__ == "__main__":
    main()
```第一部分实现预计算`popcnt`以及每个掩码的设置位。 由于每一层都使用相同的子集结构，因此执行此操作一次可以避免重复解码掩码。 

这`to`数组将一个顶点的传出邻居存储为位掩码。 这`neigh`然后通过标准最低有效位递归构建数组。 如果`b`是一点点`mask`，邻域`mask`是 的邻域`mask ^ b`并集该单个顶点的邻域。 这将每层所有 (2^k) 个子集的邻域计算减少到 (O(2^k))。 

这`merge`日常工作值得特别注意。 DP 行不仅仅是独立值的集合。 它的第零个条目确定了所表示的阈值间隔的边界。 当组合获得相同子集的两种方法时，等于源行的第零个边界的条目必须在取得分量最大值之前转移到更好的边界。 这正是参考转换执行的归一化。`merge_shift`删除一个顶点后也是同样的操作。 它不构造临时移位数组，而是直接处理源条目`src[c - 1]`作为目的地的条目`c`。 避免临时行分配很重要，因为转换是针对每个子集和每个设置位执行的。 

删除阶段中的降序掩码顺序是经过深思熟虑的。 一个状态为`mask`必须在代表较大子集的状态覆盖当前转换所需的信息之前使用。 源代码的等效操作从完整掩码向下处理掩码。 

答案存储在Python的任意精度整数类型中，因此不存在溢出问题。 最大可能的答案是 (k\binom n2)，它很容易用 Python 整数表示。 

## 工作示例

 ### 示例 1

 这三个矩阵是```
1000
1100
0110
0011

0100
1100
0010
0001

1000
1100
0000
0011
```实际流量值为

 [
 f(1,2)=4,\quad f(1,3)=4,\quad f(1,4)=3,
 ]

 [
 f(2,3)=4,\quad f(2,4)=3,\quad f(3,4)=3。 
]

 DP 不需要单独存储这六个值。 对于每个右端点 (r)，它存储每个 (c) 的阈值边界。 

| 右层 (r) | （三）| 左端点为 (f(i,r)\ge c) |`dp[0][c]`| 贡献 (r-dp[0][c]) |
 | --- | --- | --- | --- | --- |
 | 2 | 1 | 1 | 1 | 1 |
 | 2 | 2 | 1 | 1 | 1 |
 | 2 | 3 | 1 | 1 | 1 |
 | 2 | 4 | 1 | 1 | 1 |
 | 3 | 1 | 1,2 | 1 | 2 |
 | 3 | 2 | 1,2 | 1 | 2 |
 | 3 | 3 | 1,2 | 1 | 2 |
 | 3 | 4 | 1,2 | 1 | 2 |
 | 4 | 1 | 1,2,3 | 1 | 3 |
 | 4 | 2 | 1,2,3 | 1 | 3 |
 | 4 | 3 | 1,2,3 | 1 | 3 |
 | 4 | 4 | 无 | 4 | 0 |

 贡献为(4+8+9=21)。 最后一排行使了边界，其中四条不相交的路径不再存在，而三条仍然存在。 

### 示例 2

 矩阵是```
000
100
010

000
100
010

010
101
010

010
101
010
```得到的流量值为

 [
 f(1,2)=2,
 ]

 [
 f(1,3)=1,\quad f(2,3)=2,
 ]

 [
 f(1,4)=1,\quad f(2,4)=2,\quad f(3,4)=2,
 ]

 [
 f(1,5)=1,\quad f(2,5)=2,\quad f(3,5)=2,\quad f(4,5)=2。 
]

 | 右层 (r) | （三）|`dp[0][c]`| 贡献 | 此总和 (r) |
 | --- | --- | --- | --- | --- |
 | 2 | 1 | 1 | 1 | |
 | 2 | 2 | 1 | 1 | 2 |
 | 2 | 3 | 2 | 0 | |
 | 3 | 1 | 1 | 2 | |
 | 3 | 2 | 2 | 1 | |
 | 3 | 3 | 3 | 0 | 3 |
 | 4 | 1 | 1 | 3 | |
 | 4 | 2 | 2 | 2 | |
 | 4 | 3 | 4 | 0 | 5 |
 | 5 | 1 | 1 | 4 | |
 | 5 | 2 | 2 | 3 | |
 | 5 | 3 | 5 | 0 | 7 |

 总数为(2+3+5+7=17)。 此示例说明了阈值公式为何有用：当左端点较早移动时，固定右端点的流量可以从两条路径降至一条路径，并且 DP 同时捕获所有此类边界。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nk^2 2^k)) | 有 (2^k) 个子集状态，每个转换最多考虑 (k) 个顶点和 (k) 个阈值。 |
 | 空间| (O(k2^k)) | 仅需要子集状态的当前层和前一层。 |

 对于(k\leq9)、(2^k\leq512)，因此指数部分仅取决于层的小宽度而不是取决于(n)。 层数可以达到（40000），但每层执行相同的有界宽度过渡。 这正是 DP 子集对于原始约束可行的原因。 

## 测试用例

 以下测试假设`main`解决方案中的函数位于同一个 Python 模块中。 帮助器替换标准输入并捕获标准输出。```python
import sys
import io
from contextlib import redirect_stdout

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    try:
        with redirect_stdout(out):
            main()
    finally:
        sys.stdin = old_stdin
    return out.getvalue().strip()

# Provided sample 1
assert run("""\
4 4
1000
1100
0110
0011

0100
1100
0010
0001

1000
1100
0000
0011
""") == "21", "sample 1"

# Provided sample 2
assert run("""\
5 3
000
100
010

000
100
010

010
101
010

010
101
010
""") == "17", "sample 2"

# Minimum-size graph, no tunnel.
assert run("""\
2 1
0
""") == "0", "minimum size with no path"

# Minimum-size graph, one tunnel.
assert run("""\
2 1
1
""") == "1", "minimum size with one path"

# Two vertices and a complete matching between the layers.
assert run("""\
2 2
10
01
""") == "2", "two disjoint paths"

# A path exists only across the first boundary.
assert run("""\
3 1
1
0
""") == "1", "boundary between usable and unusable layers"

# All possible paths exist for k=1.
assert run("""\
3 1
1
1
""") == "3", "all-equal connected layers"

# Maximum-size structural test for k=1.
n = 40000
maximum_case = str(n) + " 1\n" + "1\n" * (n - 1)
assert run(maximum_case) == str(n * (n - 1) // 2), "maximum n, k=1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 1`有隧道`0`|`0`| 最小尺寸和不连续边界|
 |`2 1`有隧道`1`|`1`| 最小尺寸和最小正答案|
 |`2 2`与单位矩阵 |`2`| 多个不相交路径且 (k>1) |
 |`3 1`用矩阵`1`,`0`|`1`| 跨越破碎边界的偏差行为 |
 |`3 1`用矩阵`1`,`1`|`3`| 每个间隔都有贡献 |
 |`n=40000, k=1`，所有矩阵`1`|`799980000`| 最大 (n) 和最大累积答案 |

 ## 边缘情况

 对于最小的断开连接实例，```
2 1
0
```从第 1 层到第 2 层没有隧道。DP 从一个子集位开始，处理邻域为空的矩阵。 空的reachable-set状态立即达到一条路径的阈值，因此`layer - dp[0][1]`为零。 最终的答案是`0`。 

对于最小的连接实例，```
2 1
1
```第 1 层中的唯一顶点到达第 2 层中的唯一顶点。空集阈值保持在前一个边界处，为一个左端点提供一条可用路径。 答案是`1`。 

对于两条同时路径，```
2 2
10
01
```第一个顶点连接到第一个顶点，第二个顶点连接到第二个顶点。 完整的两位可达状态在转换后仍然存在，因此 (c=1) 和 (c=2) 的阈值都计算唯一的间隔。 他们的贡献是（1+1=2）。 

对于边界情况```
3 1
1
0
```第一个区间有一条路径，但第二个边界是断开的。 在第 2 层，一条路径的阈值计算第 1 层的起始点，而在第 3 层，它不计算有效间隔。 总数正好是`1`，展示了为什么 DP 必须独立处理每个边界而不是假设连通性持续存在。 

对于全连接的单顶点情况，```
3 1
1
1
```三个间隔中的每一个都有一条路径。 在每个右端点，一条路径的阈值包括每个较早的层，因此第 2 层的贡献为 (1)，第 3 层的贡献为 (2)。最终答案是`3`。 

对于 (n=40000) 和 (k=1) 的最大尺寸情况，每个区间都有流一，所以答案是

 [
 \binom{40000}{2}=799980000。 
]

 DP 从不存储所有间隔。 它只保留当前阈值边界，这就是为什么可以在没有二次内存或时间的情况下累积答案的原因。
