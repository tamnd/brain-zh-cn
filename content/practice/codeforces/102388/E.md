---
title: "CF 102388E - 马厩"
description: "我们有一个最多包含 50 个城市的无向图。 道路可以让马在其两个端点之间一步移动，并且道路也可以是自循环的。 对于固定城市 v，我们需要确定是否存在从 v 开始、恰好使用 k 条道路并在 v 结束的步行。"
date: "2026-08-16T08:50:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102388
codeforces_index: "E"
codeforces_contest_name: "SUFE ICPC Team Formation Test"
rating: 0
weight: 102388
solve_time_s: 360
verified: false
draft: false
---

[CF 102388E - 马厩](https://codeforces.com/problemset/problem/102388/E)

 **评级：** -
 **标签：** -
 **求解时间：** 6m
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个最多包含 50 个城市的无向图。 道路可以让马在其两个端点之间一步移动，并且道路也可以是自循环的。 对于固定城市 v，我们需要确定是否存在从 v 开始、恰好使用 k 条道路并在 v 结束的步行。答案是存在这种封闭步行的城市数量。 

输入最多包含 20 个独立图表。 该图的顶点数很小，n≤50，但k可以大到10 9。这种组合是关键的难点。 任何每天执行一次操作或每一步执行一次图遍历的算法都无法承受十亿步。 另一方面，n=50 足够小，我们可以负担得起涉及 k 每位大约 n 2 工作的算法。 由于 10 9 只有大约 30 个二进制数字，因此对数幂是一个自然的目标。 

有几种边缘情况很容易破坏实现。 当 k=0 时，每个城市都有资格，因为空走已经在同一个城市开始和结束。 例如，```
13 0 0
```有输出```
3
```至少需要一条道路的解决方案将错误地返回零。 

当 k=1 时，自环尤其重要。 为了```
12 1 10 0
```答案是`1`，因为城市 0 可以自循环一次并返回到自身，而城市 1 则被孤立。 将图视为简单图而不保留对角线条目的解决方案将错过城市 0。 

平行道路不需要特殊处理。 如果两条道路连接同一对城市，则它们不会为步行的存在提供额外的可能性。 我们只关心是否至少存在一个转变。 例如，```
12 3 20 10 10 1
```有输出`2`。 两个城市都可以去对方城市并立即返回。 

最后，平价可能具有欺骗性。 在二分图中，每个闭合游走的长度均为偶数，但奇数循环的存在改变了情况。 例如，```
13 3 30 11 22 0
```有输出`3`，因为每个城市都位于三角形上。 尝试仅使用图二分性来解决问题也会错过特殊情况，例如附加到奇数循环的顶点，其中可能存在足够长的奇数闭合游走，但可能不存在短奇数闭合游走。 矩阵公式避免了必须手动表征所有这些情况。 

## 方法

 最直接的方法是在每一步之后模拟可能的位置。 固定起始城市 s，保持城市集合在恰好 t 个步骤后可达，并通过图表重复扩展该集合。 k轮后，检查s是否可达。 这是正确的，因为第 t 轮之后的集合恰好表示从 s 开始的长度为 t 的步行的端点。 

问题是k。 最坏的情况下，一轮可能会检查每条道路，因此处理一个起始城市需要 O(km)。 对所有 n 个起始城市重复此操作，得到 O(knm)。 在最大约束下，这大约是

 10 9 ⋅50⋅2500=1.25×10 14

 路考，远远超出了时间限制。 

该图足够小，可以用矩阵求幂代替逐步模拟。 定义一个布尔邻接矩阵 A，其中当道路允许从 i 移动到 j 时，A[i][j] 恰好为真。 在布尔矩阵乘法下，条目 (A t )[i][j] 告诉我们是否存在从 i 到 j 的恰好 t 步的游走。 因此，当对角线条目 (A k )[i][i] 为真时，城市 i 恰好有效。 

二进制求幂将矩阵乘法的次数从 k 减少到 O(logk)。 传统的矩阵乘法将花费 O(n 3 )，这对于 n=50 来说已经是合理的，但 Python 可以通过将每个矩阵行表示为单个整数位集来做得更好。 然后，一行包含以位形式表示的一组可达顶点，并且将两个布尔矩阵相乘就变成了按位或运算的序列。 

对于左矩阵的第i行，每设置一个位j就意味着i可以到达j。 右侧矩阵的相应行 B[j] 包含从 j 可到达的所有顶点。 因此，结果行只是 B[j] 对行 i 中所有设置位 j 进行或运算。 这将实际乘法减少为 O(n 2 ) 行运算，每个运算都使用 Python 高度优化的任意精度整数。 

蛮力方法之所以有效，是因为它明确地遵循一次一步的行走，但由于 k 太大而失败。 观察结果表明，只有 k 的二进制表示才重要，让我们可以一次跳过指数级的多个步骤。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(knm) | O(n) | 太慢了 |
 | 使用位集进行布尔矩阵求幂 | O(n 2 logk) 位集操作 | O(n) 位集 | 已接受 |

 ## 算法演练

 1. 为每个城市建立邻接关系作为位集。 当 i 和 j 之间存在道路时，设置第 i 行中的位 j。 由于该图是无向的，因此输入边 (x,y) 同时设置 x→y 和 y→x。 对于自循环，这自然会设置对角位。 
2. 将单位矩阵表示为位集。 它的第 i 行仅包含第 i 位，因为单位矩阵表示位于同一城市的长度为零的步行。 
3.维护两个布尔矩阵，`result`和`base`。 最初，`result`是单位矩阵并且`base`是邻接矩阵。 不变的是`result`表示已经从 k 的处理位中选择的原始邻接矩阵的幂的乘积，而`base`代表当前功率A 2 p。 
4. 从最低有效位开始检查 k 的二进制表示形式。 如果当前位为 1，则乘以`result`经过`base`。 这将相应的功率 A 2 p 纳入到答案中。 
5. 正方形`base`获得下一个2的幂。 这里使用布尔矩阵乘法是因为我们关心是否至少存在一条游走，而不是存在多少条游走。 
6. 将 k 右移一位并继续，直到处理完每一位。 最多需要 30 位，因为 k≤10 9。 
7. 求幂后，检查对角线`result`。 如果第 i 位设置在第 i 行，则从城市 i 回到城市 i 需要步行恰好 k 步。 数一数所有这样的城市。 

### 为什么它有效

 中心不变量是在处理 k 的二进制表示的某些前缀之后，`result`等于与已处理的一位对应的幂的布尔乘积。 由于布尔矩阵乘法构成了路径的存在性，因此当某个长度为 t 的路径将 i 与 j 连接时，A t [i][j] 恰好为真。 二进制求幂最终构造出 A k，因此它的对角线恰好包含允许长度为 k 的闭合步行的城市。 位集实现仅更改布尔乘法的计算方式，而不更改其表示的数学结果。 

## Python 解决方案```python
Pythonimport sysinput = sys.stdin.readline

def multiply(A, B, n):    """    Boolean matrix multiplication.
    Each row is a bitset. For every set bit j in A[i],    row B[j] contributes all vertices reachable after the    second part of the walk.    """    C = [0] * n
    for i in range(n):        mask = A[i]        row = 0
        while mask:            bit = mask & -mask            j = bit.bit_length() - 1            row |= B[j]            mask ^= bit
        C[i] = row
    return C

def solve():    T = int(input())    answers = []
    for _ in range(T):        n, m, k = map(int, input().split())
        adj = [0] * n
        for _ in range(m):            x, y = map(int, input().split())            adj[x] |= 1 << y            adj[y] |= 1 << x
        # A^0 = I.        result = [1 << i for i in range(n)]
        # A^(2^p), starting with A^1.        base = adj
        while k:            if k & 1:                result = multiply(result, base, n)
            k >>= 1
            if k:                base = multiply(base, base, n)
        answer = 0        for i in range(n):            if result[i] & (1 << i):                answer += 1
        answers.append(str(answer))
    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":    solve()
```每个城市的邻接构造使用一个整数。 少量`j`代表城市`j`，所以设置`1 << j`记录了到该城市的过渡的存在。 设置两个方向可以处理无向道路，并且对平行边执行两次相同的操作没有效果，这正是我们想要的。`result = [1 << i for i in range(n)]`创建单位矩阵。 即使当 k=0 时，这也是必要的，因为 A 0 =I，并且恒等式的对角线包含每个城市。 这`while k`因此，循环无需任何特殊分支即可处理 k=0。 

乘法例程最值得关注。 假设位 j 设置为`A[i]`。 这意味着从 i 到 j 有一个第一步。 每一位都设置在`B[j]`表示从 j 到某个目的地的第二段。 对所有此类进行“或”运算`B[j]`因此准确给出了通过串联步行可到达的目的地。 

表达式`mask & -mask`提取最低设置位。`bit.bit_length() - 1`将该位转换为其顶点索引。 删除它与`mask ^= bit`保证每个可达的中间顶点都被处理一次。 

不存在整数溢出问题。 Python 整数自动增长，最大的位集只有 50 个有意义的位。 k 的值也直接作为 Python 整数处理，因此 10 9 界限不需要特殊的算术。 

求幂循环中的运算顺序也是经过深思熟虑的。 如果k的当前位为1，则当前功率必须乘以`result`。 之后，对当前功率进行平方以准备下一个二进制数字。 这`if k`后卫避免了一次不必要的最终平局。 

## 工作示例

 第一个示例测试用例是```
3 2 30 10 2
```该图是一条长度为 2 的路径，城市 0 位于中间。 我们想要一条长度为 3 的闭合步行。 

邻接行由位集表示。 位位置0、1和2对应于三个城市。 

| 舞台| k |`result`行 |`base`代表 |
 | ---| ---| ---| ---|
 | 初始| 3 |`001`,`010`,`100`| 一个 1 |
 | 位 0 = 1 | 3 | 一个 | 一个 1 |
 | 班次| 1 | 一个 | 一个 2 |
 | 位 1 = 1 | 1 | A 3 | 一个 2 |
 | 完成 | 0 | A 3 | 一个 2 |

 没有奇数循环，也没有自循环，因此该图是二分图，并且每个闭合游走的长度均为偶数。 A 3 的对角线完全错误，给出答案`0`。 

第二个示例测试用例是```
3 2 40 10 2
```这是同一张图，但现在 k=4。 

| 舞台| k |`result`|`base`|
 | ---| ---| ---| ---|
 | 初始| 4 | 我| 一个 |
 | 班次| 2 | 我| 一个 2 |
 | 班次| 1 | 我| A 4 |
 | 位 2 = 1 | 1 | A 4 | A 4 |
 | 完成 | 0 | A 4 | A 4 |

 每个城市都有一条长度为 4 的封闭步行道。 例如，从城市 1 开始，我们可以使用

 1→0→1→0→1。 

城市 2 也可以进行相同的建设，而城市 0 可以与任一相邻城市交替。 因此 A 4 的每个对角线条目都是真的，答案是`3`。 

这两条轨迹还说明了为什么仅关注可达性而不跟踪确切的步行长度是不够的。 该图在两种情况下都是连通的，但长度 3 不产生封闭步行，而长度 4 则在每个城市产生一个封闭步行。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n 2 logk) 位集操作 | 有 O(logk) 个矩阵乘积，每个乘积最多处理 n 2 个集合位 |
 | 空间| O(n) Python 整数 | 存储两个n行布尔矩阵，每行仅包含n个相关位|

 对于n≤50且k≤10 9，最多有30个求幂级别。 每个布尔矩阵乘法最多处理50 2 =2500个行关系，并且每个关系都通过本机整数位运算来处理。 这完全在 3 秒的时间限制内，并且远低于 256 MB 内存限制。 

此实现与普通 O(n 3 logk) 矩阵乘法之间的区别在 Python 中很有用。 位集表示将整个布尔行压缩为一个整数，因此昂贵的内部操作是通过优化的整数算术来执行的，而不是通过所有可能的目标进行 Python 级循环。 

## 测试用例```python
Pythonimport sysimport io

def solve_data(inp: str) -> str:    old_stdin = sys.stdin    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)    out = io.StringIO()    sys.stdout = out
    try:        T = int(sys.stdin.readline())        answers = []
        def multiply(A, B, n):            C = [0] * n
            for i in range(n):                mask = A[i]                row = 0
                while mask:                    bit = mask & -mask                    j = bit.bit_length() - 1                    row |= B[j]                    mask ^= bit
                C[i] = row
            return C
        for _ in range(T):            n, m, k = map(int, sys.stdin.readline().split())            adj = [0] * n
            for _ in range(m):                x, y = map(int, sys.stdin.readline().split())                adj[x] |= 1 << y                adj[y] |= 1 << x
            result = [1 << i for i in range(n)]            base = adj
            while k:                if k & 1:                    result = multiply(result, base, n)
                k >>= 1
                if k:                    base = multiply(base, base, n)
            answer = sum(                1 for i in range(n)                if result[i] & (1 << i)            )            answers.append(str(answer))
        sys.stdout.write("\n".join(answers))        return out.getvalue()
    finally:        sys.stdin = old_stdin        sys.stdout = old_stdout

# Provided sampleassert solve_data("""\33 2 30 10 23 2 40 10 25 5 50 11 22 03 44 0""") == "0\n3\n4", "provided sample"

# Minimum-size graph, k = 0.# The empty walk is valid at the only city.assert solve_data("""\11 0 0""") == "1", "k = 0"

# One vertex with a self-loop.# The loop can be traversed any positive number of times.assert solve_data("""\11 1 10 0""") == "1", "self-loop and k = 1"

# Two isolated vertices, k > 0.# There is no road at all, so no positive-length walk exists.assert solve_data("""\12 0 7""") == "0", "isolated vertices"

# Parallel edges and an even walk.# Multiplicity does not matter because we only ask whether a walk exists.assert solve_data("""\12 3 20 10 10 1""") == "2", "parallel edges"

# A triangle, k = 3.# Every vertex can traverse the triangle once and return.assert solve_data("""\13 3 30 11 22 0""") == "3", "odd cycle"

# Maximum-size vertex count and a huge k.# Complete graph has a closed walk of every positive length at every vertex.edges = []n = 50for i in range(n):    for j in range(i + 1, n):        edges.append(f"{i} {j}")
max_case = "1\n50 1225 1000000000\n" + "\n".join(edges) + "\n"assert solve_data(max_case) == "50", "maximum n and huge k"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0 0`|`1`| 最小图和 k=0 边界 |
 | 一顶点一循环，k=1 |`1`| 自循环精准一步返回|
 | 两个孤立的顶点，k=7 |`0`| 没有正长度步行|
 | 两个顶点之间的三个平行边，k=2 |`2`| 平行边不影响存在|
 | 三角形，k=3 |`3`| 奇怪的封闭步道|
 | 50 个顶点的完整图，k=10 9 |`50`| 最大 n、大 k 和二进制求幂 |

 ## 边缘情况

 ### 零步

 考虑```
13 0 0
```算法初始化`result`到单位矩阵并且永远不会进入求幂循环，因为`k`为零。 单位矩阵具有每个对角线条目集，因此所有三个城市都被计算在内。 这符合长度零行走的定义。 

### 一步自循环

 考虑```
12 1 10 0
```城市 0 的邻接行包含位 0，而城市 1 有空行。 由于 k=1，`result`成为邻接矩阵本身。 它的对角线仅在城市 0 处包含真实值，所以答案是`1`。 

这种情况捕获了意外忽略自循环或仅在端点不同时插入边的实现。 

### 孤立的顶点

 考虑```
12 0 7
```邻接矩阵全为零。 零布尔矩阵的每个正幂都保持为零，因此不设置对角线条目。 答案是`0`。 单位矩阵不会导致误报，因为它仅用于指数零，并且此处指数为正。 

### 平行道路

 考虑```
12 3 20 10 10 1
```三个输入路都设置相同的两个邻接位。 构造后，该矩阵正是单条无向边的邻接矩阵。 将其平方得到两个顶点处的对角线 true，对应于路径 0→1→0 和 1→0→1。 答案是`2`。 

将输入视为带有计数的多重图是没有必要的，因为问题要求存在而不是可能的游走数量。 

### 奇数循环

 考虑```
13 3 30 11 22 0
```第一个幂允许有一条边，并且对布尔邻接矩阵求三次方可检测从每个顶点回到自身的三角形行走。 A 3 的对角线完全正确，所以答案是`3`。 

这也是为什么仅基于偶数或奇数 k 的解决方案是不够的。 图结构决定了可能的精确长度，布尔矩阵幂直接表示该结构。
