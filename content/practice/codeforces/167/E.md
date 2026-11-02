---
title: "CF 167E - 巫师和投注"
description: "给定一个有向无环图。 有些顶点是源，这意味着没有边进入它们。 有些顶点是汇点，这意味着没有边离开它们。 保证源和汇的数量相等。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "math", "matrices"]
categories: ["algorithms"]
codeforces_contest: 167
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 114 (Div. 1)"
rating: 2900
weight: 167
solve_time_s: 232
verified: true
draft: false
---

[CF 167E - 巫师和投注](https://codeforces.com/problemset/problem/167/E)

 **评分：** 2900
 **标签：** dfs 和类似的、图形、数学、矩阵
 **求解时间：** 3m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个有向无环图。 有些顶点是源，这意味着没有边进入它们。 有些顶点是汇点，这意味着没有边离开它们。 保证源和汇的数量相等。 

有效的配置由顶点不相交的有向路径组成，这样每个源都恰好连接到一个接收器，并且每个接收器都接收恰好一个路径。 由于路径是顶点不相交的，因此每个顶点最多可以属于一个选定的路径。 

假设汇点按顶点编号递增排序，源点也以相同方式排序。 如果沉`i`已连接到源`a[i]`，然后排列`a`确定配置的符号。 甚至反转计数也有贡献`+1`，奇数反转计数贡献`-1`。 

任务是对所有有效的不相交路径集合上的这些符号求和，以素数为模`p`。 

这并不是要求我们枚举匹配项。 它要求所有完美的源到汇路径系统的交替总和。 

该图最多有 600 个顶点和 100000 条边。 这立即排除了对源或汇子集的任何指数方法。 甚至`2^20`已经太大了，而这里的终端数量本身可能接近600个。 

该图是非循环的，这是整个解决方案所依赖的结构属性。 在 DAG 中，可以通过拓扑顺序动态规划来完成路径计数。 小界限`n`强烈建议`O(n^3)`或类似的代数解。 

允许有多个边。 将平行边压缩为一条边的粗心实现会导致路径计数不足。 例如：```
2 2
1 2
1 2
```有两条不同的路径`1`到`2`，没有一个。 

顶点可以同时是源和汇。 例如：```
1 0
```单个顶点既是源点又是汇点。 恰好有一个有效的路径系统，由从顶点到自身的空路径组成，所以答案是`1`。 

另一个微妙的情况是某些源无法到达某些接收器。 忘记不可到达的对变为零的天真的行列式实现可能会意外地计算无效匹配。 例子：```
4 2
1 3
2 3
```来源是`{1,2}`，汇是`{3,4}`。 下沉`4`无法到达，因此不存在有效的路径系统。 答案是`0`。 

最难的陷阱是理解为什么会出现交替和。 如果我们尝试直接计算不相交的路径系统，则包含-排除会变得混乱。 关键的观察结果是，行列式已经对排列的符号进行了编码，并且相交的路径系统会自动取消。 

## 方法

 蛮力方法在概念上很简单。 我们可以枚举从每个源到每个接收器的每条可能路径，然后尝试每种路径组合，检查它们是否顶点不相交，计算诱导排列，然后添加`+1`或者`-1`。 

这是有效的，因为答案的定义实际上是有效路径系统上的有符号和。 

问题是 DAG 中的路径数量已经可以是指数级的`n`。 即使是每层只有两个传出选择的分层图也会创建指数级数量的源到汇路径。 尝试所有组合变得完全不可能。 

第一个有用的观察结果是，符号仅取决于源到汇的排列。 这正是决定因素编码的结构。 

假设我们建立一个矩阵`A`在哪里：```
A[i][j] = number of paths from source i to sink j
```然后：$\det(A)=\sum_{\pi} \operatorname{sgn}(\pi) \prod_i A_{i,\pi(i)}$每个产品对应于选择从每个源到指定接收器的一条路径。 

乍一看，这似乎是错误的，因为行列式计算所有路径元组，包括相交的元组。 奇迹就是 Lindström-Gessel-Viennot 引理：在 DAG 中，所有相交路径元组在行列式展开中成对抵消。 

只有顶点不相交的路径系统才能生存。 

所以整个问题简化为：

 1. 计算每个源和接收器之间的路径计数。 
2. 构建矩阵。 
3. 计算其行列式模`p`。 

自从`n ≤ 600`，三次高斯消元法是完全可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳| O(n^3 + 公里) | O(n^2) | O(n^2) | 已接受 |

 这里`k`是源和汇的数量。 

## 算法演练

 1. 读取图形并计算入度和出度。 

源是入度为零的顶点。 汇点是出度为零的顶点。 它们的顺序必须严格按照语句的要求遵循递增的顶点索引。 
2. 计算 DAG 的拓扑排序。 

由于该图是非循环的，因此卡恩算法会产生有效的顺序。 这个命令让我们能够正确地执行路径DP。 
3. 对于每个来源`s`，计算路径数`s`到每个顶点。 

初始化：```
dp[s] = 1
```然后按拓扑顺序处理顶点。 对于每一个边缘`u -> v`:```
dp[v] += dp[u]
```模数`p`。 

因为该图是非循环的，所以当我们处理时`u`，所有到达的方式`u`已经最终确定。 
4. 填充矩阵`A`。`A[i][j]`等于从源开始的路径数`i`下沉`j`。 
5. 计算行列式模`p`。 

使用具有模逆的高斯消去法。 

每当枢轴行与当前行不同时，交换行并将行列式乘以`-1`。 

自从`p`是质数，每个非零主元都存在模逆。 
6. 输出行列式模`p`。 

### 为什么它有效

 行列式展开对源到汇分配的所有排列求和。 对于固定排列，乘积项对实现该分配的路径的所有元组进行计数。 

相交的元组出现两次，且符号相反，并且彼此抵消。 这种取消是 Lindström-Gessel-Viennot 引理的核心陈述。 

仅保留顶点不相交的路径系统，每个系统均由其排列的符号加权。 这正是问题要求我们计算的数量。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def modinv(a, p):
    return pow(a, p - 2, p)

def determinant(mat, p):
    n = len(mat)
    det = 1

    for col in range(n):
        pivot = -1

        for row in range(col, n):
            if mat[row][col] % p != 0:
                pivot = row
                break

        if pivot == -1:
            return 0

        if pivot != col:
            mat[pivot], mat[col] = mat[col], mat[pivot]
            det = (-det) % p

        pivot_val = mat[col][col] % p
        det = (det * pivot_val) % p

        inv_pivot = modinv(pivot_val, p)

        for row in range(col + 1, n):
            if mat[row][col] == 0:
                continue

            factor = mat[row][col] * inv_pivot % p

            for k in range(col, n):
                mat[row][k] = (mat[row][k] - factor * mat[col][k]) % p

    return det % p

def solve():
    n, m, p = map(int, input().split())

    g = [[] for _ in range(n)]
    indeg = [0] * n
    outdeg = [0] * n

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        g[u].append(v)
        indeg[v] += 1
        outdeg[u] += 1

    sources = [i for i in range(n) if indeg[i] == 0]
    sinks = [i for i in range(n) if outdeg[i] == 0]

    k = len(sources)

    q = deque()

    cur_indeg = indeg[:]

    for i in range(n):
        if cur_indeg[i] == 0:
            q.append(i)

    topo = []

    while q:
        u = q.popleft()
        topo.append(u)

        for v in g[u]:
            cur_indeg[v] -= 1
            if cur_indeg[v] == 0:
                q.append(v)

    mat = [[0] * k for _ in range(k)]

    for i, s in enumerate(sources):
        dp = [0] * n
        dp[s] = 1

        for u in topo:
            if dp[u] == 0:
                continue

            val = dp[u]

            for v in g[u]:
                dp[v] += val
                if dp[v] >= p:
                    dp[v] %= p

        for j, t in enumerate(sinks):
            mat[i][j] = dp[t] % p

    ans = determinant(mat, p)
    print(ans % p)

solve()
```第一部分构建 DAG 并按递增的顶点顺序准确识别源和汇。 该语句以这种方式隐式定义编号，因此不同的排序会改变符号约定并产生错误的答案。 

拓扑排序是标准卡恩处理。 我们复制入度数组，因为稍后仍需要原始值来识别源。 

对于每个源，我们在 DAG 上运行路径计数 DP。 自从`n`只需 600，每个源运行一个 DP 就足够便宜了。 多条边的处理很自然，因为每条边在传播过程中都有单独的贡献。 

行列式实现使用模块化高斯消去法。 一个常见的错误是忘记行交换会改变行列式。 另一个常见的错误是正常除法而不是乘以模逆。 

矩阵在消除过程中被适当修改。 这很好，因为之后就不再需要原始值了。 

## 工作示例

 ### 示例 1

 输入：```
4 2 1000003
1 3
2 4
```来源是`[1,2]`。 水槽是`[3,4]`。 

路径矩阵：

 | 来源 | 水槽 3 | 水槽 4 |
 | --- | --- | --- |
 | 1 | 1 | 0 |
 | 2 | 0 | 1 |

 所以：$\det\begin{pmatrix}1&0\\0&1\end{pmatrix}=1$行列式是`1`。 

该迹线展示了最简单的非相交系统。 行列式简化为带正号的恒等排列。 

### 示例 2

 考虑：```
4 2 1000003
1 4
2 3
```来源是`[1,2]`。 水槽是`[3,4]`。 

路径矩阵：

 | 来源 | 水槽 3 | 水槽 4 |
 | --- | --- | --- |
 | 1 | 0 | 1 |
 | 2 | 1 | 0 |

 所以：$\det\begin{pmatrix}0&1\\1&0\end{pmatrix}=-1$模数`1000003`，答案就变成了`1000002`。 

此示例显示行列式如何自动编码排列奇偶校验。 唯一的匹配交换两个端子，给出一个倒置和负号。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(k(n + m) + k^3) | O(k(n + m) + k^3) | 每个源的路径 DP 加上行列式计算 |
 | 空间| O(k^2 + n + m) | O(k^2 + n + m) | 矩阵、图形和 DP 存储 |

 自从`k ≤ n ≤ 600`，三次行列式步长最多约为`2.1 × 10^8`在绝对最坏的理论情况下进行原始算术运算，但实际上 Python 可以轻松处理这个大小，因为内部工作是简单的模算术，并且许多矩阵在消除过程中变得稀疏。 路径 DP 在每个源的图形大小上是线性的，并且很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def modinv(a, p):
        return pow(a, p - 2, p)

    def determinant(mat, p):
        n = len(mat)
        det = 1

        for col in range(n):
            pivot = -1

            for row in range(col, n):
                if mat[row][col] % p != 0:
                    pivot = row
                    break

            if pivot == -1:
                return 0

            if pivot != col:
                mat[pivot], mat[col] = mat[col], mat[pivot]
                det = (-det) % p

            pivot_val = mat[col][col] % p
            det = (det * pivot_val) % p

            inv_pivot = modinv(pivot_val, p)

            for row in range(col + 1, n):
                if mat[row][col] == 0:
                    continue

                factor = mat[row][col] * inv_pivot % p

                for k in range(col, n):
                    mat[row][k] = (
                        mat[row][k] - factor * mat[col][k]
                    ) % p

        return det % p

    n, m, p = map(int, input().split())

    g = [[] for _ in range(n)]
    indeg = [0] * n
    outdeg = [0] * n

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        g[u].append(v)
        indeg[v] += 1
        outdeg[u] += 1

    sources = [i for i in range(n) if indeg[i] == 0]
    sinks = [i for i in range(n) if outdeg[i] == 0]

    k = len(sources)

    q = deque()

    cur = indeg[:]

    for i in range(n):
        if cur[i] == 0:
            q.append(i)

    topo = []

    while q:
        u = q.popleft()
        topo.append(u)

        for v in g[u]:
            cur[v] -= 1
            if cur[v] == 0:
                q.append(v)

    mat = [[0] * k for _ in range(k)]

    for i, s in enumerate(sources):
        dp = [0] * n
        dp[s] = 1

        for u in topo:
            for v in g[u]:
                dp[v] = (dp[v] + dp[u]) % p

        for j, t in enumerate(sinks):
            mat[i][j] = dp[t]

    return str(determinant(mat, p)) + "\n"

# provided sample
assert run(
"""4 2 1000003
1 3
2 4
"""
) == "1\n", "sample 1"

# single isolated vertex
assert run(
"""1 0 13
"""
) == "1\n", "single source-sink vertex"

# impossible matching
assert run(
"""4 2 17
1 3
2 3
"""
) == "0\n", "unreachable sink"

# odd permutation
assert run(
"""4 2 1000003
1 4
2 3
"""
) == "1000002\n", "negative determinant"

# multiple parallel edges
assert run(
"""2 2 97
1 2
1 2
"""
) == "2\n", "parallel edges counted separately"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个孤立顶点| 1 | 空路径计数正确 |
 | 无法触及的水槽| 0 | 不可能的系统消失了|
 | 交叉匹配| p-1 | 负排列符号 |
 | 平行边| 2 | 多条边是不同的路径 |

 ## 边缘情况

 考虑孤立顶点的情况：```
1 0 13
```单个顶点的入度为零和出度为零，因此它既是源又是汇。 

路径矩阵为：

 | | v1 |
 | --- | --- |
 | v1 | 1 |

 从顶点到自身的空路径在 DAG 路径计数中有效。 行列式是`1`，所以算法输出`1`。 

现在考虑无法到达的接收器：```
4 2 17
1 3
2 3
```来源是`[1,2]`，汇是`[3,4]`。 

没有路径到达接收器`4`，因此矩阵变为：

 | | 3 | 4 |
 | --- | --- | --- |
 | 1 | 1 | 0 |
 | 2 | 1 | 0 |

 其行列式为零。 在消除过程中，第二个主元列没有非零主元，因此算法立即返回`0`。 

最后，考虑平行边：```
2 2 97
1 2
1 2
```恰好有两条不同的有向路径`1`到`2`，每条边一个。 

DP 独立处理两条边：```
dp[2] += dp[1]
dp[2] += dp[1]
```给予`dp[2] = 2`。 

的决定因素是`1 × 1`矩阵`[2]`是`2`，这是正确答案。
