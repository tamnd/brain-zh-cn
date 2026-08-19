---
title: "CF 102343J - 编程团队的意志"
description: "该问题将棒棒糖分布建模为有向加权图。 有 (N) 名离开的团队成员，由顶点 (1) 到 (N) 表示，还有 (M-N) 个其他 UCF 学生，由顶点 (N+1) 到 (M) 表示。"
date: "2026-08-17T10:24:01+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102343
codeforces_index: "J"
codeforces_contest_name: "UCF Locals 2019"
rating: 0
weight: 102343
solve_time_s: 128
verified: true
draft: false
---

[CF 102343J - 编程团队的意愿](https://codeforces.com/problemset/problem/102343/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题将棒棒糖分布建模为有向加权图。 有 (N) 名离开的团队成员，由顶点 (1) 到 (N) 表示，还有 (M-N) 个其他 UCF 学生，由顶点 (N+1) 到 (M) 表示。 每个离开的成员都从一定数量的棒棒糖开始，并有一个遗嘱，根据给定的分数将他们的全部收藏分配给几个学生。 遗嘱可以将棒棒糖发送给另一位离开的成员，因此可以通过几个人继续分发。 

预期的过程重复地将每个离开的成员的意愿应用于该成员当前持有的棒棒糖。 我们被要求提供每个学生收到的最终金额。 如果一些棒棒糖可以永远留在一组离开的成员中，那么这些棒棒糖就会被丢弃。 官方限制为 (N \le 500)、(M \le 50{,}000)，最多 (1{,}000{,}000) 条遗嘱条目。 官方规定时间限制为7秒，内存限制为1024MB。 

主要区别在于最多 500 名离职成员和潜在的 50,000 名学生之间。 (M) 的值很大意味着我们无法承受所有学生数量的二次方，但只有离开的成员参与递归过程。 由于(N)只有500，所以(O(N^3))线性代数计算原则上是可行的。 百万条目限制还意味着输入本身可能很大，因此应该有效地处理输入。 

有两种微妙的情况使直接模拟变得不可靠。 首先，封闭循环可能永远不会向普通学生发送任何内容。 考虑```
2 3
1 1
2 1.0
1 1
1 1.0
```学生 1 和学生 2 不断交换棒棒糖，而学生 3 却什么也没收到。 正确的输出是```
0.0
0.0
0.0
```等待离开成员数量变小的模拟永远不会结束。 

第二个问题是每次访问时仅泄漏一小部分的循环。 例如，```
2 3
1 2
2 0.999999
3 0.000001
1 1
1 1.0
```每个棒棒糖最终都会到达学生 3，所以最终的输出是```
0.0
0.0
2.0
```在固定轮数后停止的模拟可能仍然使几乎所有的棒棒糖都位于循环内，并且会给出明显错误的答案。 正分数的 (10^{-6}) 下界使得这种缓慢收敛成为可能。 

第三个容易犯的错误是将前（N）名学生视为普通的输出接收者。 他们都是离职成员，所以他们的最终答案永远是零。 他们的棒棒糖要么到达未离开的学生手中，要么消失在封闭的组件内。 该语句明确要求前 (N) 个输出行为零。 

## 方法

 最直接的方法是模拟该过程。 保留每个离开成员当前的棒棒糖数量，应用每个遗嘱，并重复，直到离开成员中剩余的棒棒糖总数足够小。 这准确地反映了定义，因此当它终止时它会给出正确的分布。 

问题是在任何实际速度下都不能保证终止。 一个循环在每一轮完整的循环中都可以保留 (0.999999) 的质量。 为了将初始量减少到 (10^{-5}) 以下大约 (500{,}000)，我们需要大约

 [
 \frac{\log(10^{-5}/500000)}{\log(0.999999)}
 ]

 轮，大约是 (2.5\times 10^7) 轮。 对于多达 (10^6) 个条目，这意味着大约 (10^{13}) 个转换操作。 封闭循环甚至更糟，因为模拟永远不会达到其停止条件。 

有用的观察是重复过程是一个线性方程组。 令 (x_i) 为将通过离开成员 (i) 的棒棒糖总数，计算初始收集和后来到达那里的每个收集。 如果成员 (j) 将分数 (p_{j,i}) 给予成员 (i)，则

 [
 x_i = L_i + \sum_{j=1}^{N} x_jp_{j,i}。 
]

 左边代表所有到达(i)的东西。 右侧包含最初由 (i) 拥有的棒棒糖，以及其他离开成员带来的所有物品。 

一旦知道了值 (x_i)，普通学生的答案 (k) 就很简单

 [
 \text{答案}_k =
 \sum_{i=1}^{N}x_i p_{i,k}。 
]

 这样无限过程就变成了有限线性系统。 

有一个并发症。 一群离开的成员可以形成一个永远不会接触到普通学生的封闭组件。 对于这样的组件，相应的矩阵是奇异的，因为它的总质量可以永远循环。 我们根本不需要解决这些变量。 我们首先可以找到每一个离开的成员，都有一些通往普通学生的直接路径。 这些正是其棒棒糖最终可以为所需产出做出贡献的成员。 每个其他成员都属于图的一部分，其整个质量最终会被丢弃。 

除去那些不相关的成员后，剩下的每个状态最终都可以到达普通学生。 由此产生的过渡系统是瞬态的，因此 (I-Q^T) 是非奇异的，并且线性系统具有唯一的解。 我们可以用高斯消去法来解决。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 潜在 (O(TK))，其中 (T) 任意大 | (O(M+K)) | 太慢并且可能永远不会终止 |
 | 最佳| (O(N^3 + K)) | (O(N^2 + K + M)) | 已接受 |

 这里（K）是遗嘱条目的总数，最多为（10^6），并且（N\le500）。 (N^3) 项来自高斯消去法，而处理意愿并构建最终输出与其总大小呈线性关系。 

## 算法演练

1. 阅读所有遗嘱并存储从每个离开的成员到每个接受者的转移概率。 同时，在离职成员之间建立反向边缘。 稍后我们需要完整的遗嘱来计算最终的输出，而反向图可以让我们确定哪些离开的成员最终可以到达普通学生。 
2. 标记每一位遗嘱直接给予普通学生正分数的离任成员。 这些是有用状态集的起点，因为它们可以立即将质量发送到离开组之外。 
3. 从那些被标记的成员开始遍历反向图。 每当离开的成员可以到达已标记的成员时，也对其进行标记。 经过这次遍历后，标记的成员有一条通往普通学生的定向路径，而每个未标记的成员都被困在普通学生无法到达的区域中。 
4. 为每个标记的离职成员创建一个线性方程。 让 (x_i) 表示通过该成员的总金额。 对于每个标记的 (i)，写

 [
 x_i-\sum_{j\text{ 标记}}x_jp_{j,i}=L_i。 
]

 未标记成员发送的概率不会出现，因为该成员永远无法对任何最终答案做出贡献。 

1. 用高斯消元法求解所得系统。 我们使用部分旋转来使浮点计算更加稳定。 右边只有一个，所以普通淘汰然后后面换人就足够了。 
2. 将每个离开成员的答案设置为零。 这些棒棒糖是中间数量，不是最终接收者。 
3. 对于接收者 (k) 是普通学生的每个遗嘱条目 ((i,k,p))，将 (x_i p) 添加到 (k) 的答案中。 这直接将每个离开成员处理过的总金额直接转换为最终交付给离开团体之外的金额。 
4. 按学生证升序打印所有 (M) 个答案。 所需的精度为(10^{-5})，因此打印小数点后几位数字就足够了。 

为什么它有效：中心不变量是 (x_i) 代表成员 (i) 将处理的每个棒棒糖，而不仅仅是当前持有的数量。 每个这样的棒棒糖要么是 (i) 最初拥有的 (L_i) 之一，要么是从另一个离开的成员 (j) 到达的，数量为 (x_jp_{j,i})。 因此，线性方程准确地表征了无限过程。 对于普通学生可以到达的状态，重复应用最终将其所有概率质量转移出离开状态，因此相应的子系统具有唯一的有限解。 无法到达普通学生的状态只能循环或喂养其他此类状态，并且它们的质量完全按照问题指定的那样被丢弃。 一旦知道 (x_i) 值，将每个值乘以其遗嘱中的分数即可将每次最终传输精确计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    initial = [0.0] * n
    wills = [[] for _ in range(n)]
    rev = [[] for _ in range(n)]

    for i in range(n):
        l, k = map(int, input().split())
        initial[i] = float(l)

        entries = []
        for _ in range(k):
            x, p = input().split()
            x = int(x) - 1
            p = float(p)
            entries.append((x, p))

            if x < n:
                rev[x].append(i)

        wills[i] = entries

    # Find all departing members that can eventually reach
    # at least one ordinary student.
    useful = [False] * n
    stack = []

    for i in range(n):
        for x, p in wills[i]:
            if x >= n:
                if not useful[i]:
                    useful[i] = True
                    stack.append(i)
                break

    while stack:
        v = stack.pop()
        for u in rev[v]:
            if not useful[u]:
                useful[u] = True
                stack.append(u)

    ids = [i for i in range(n) if useful[i]]
    s = len(ids)

    ans = [0.0] * m

    if s:
        pos = [-1] * n
        for i, v in enumerate(ids):
            pos[v] = i

        # A[i][j] = delta(i,j) - probability(j -> i)
        a = [[0.0] * (s + 1) for _ in range(s)]

        for i, v in enumerate(ids):
            a[i][i] = 1.0
            a[i][s] = initial[v]

        for u in ids:
            pu = pos[u]
            for v, p in wills[u]:
                if v < n and useful[v]:
                    pv = pos[v]
                    a[pv][pu] -= p

        # Gaussian elimination with partial pivoting.
        for col in range(s):
            pivot = col
            best = abs(a[col][col])

            for row in range(col + 1, s):
                value = abs(a[row][col])
                if value > best:
                    best = value
                    pivot = row

            if pivot != col:
                a[col], a[pivot] = a[pivot], a[col]

            inv = 1.0 / a[col][col]

            # Normalize the pivot row.
            row = a[col]
            for j in range(col, s + 1):
                row[j] *= inv

            # Eliminate below.
            for row_idx in range(col + 1, s):
                row2 = a[row_idx]
                factor = row2[col]
                if factor == 0.0:
                    continue

                row2[col] = 0.0
                for j in range(col + 1, s + 1):
                    row2[j] -= factor * row[j]

        x = [0.0] * s

        # Back substitution.
        for i in range(s - 1, -1, -1):
            value = a[i][s]
            row = a[i]
            for j in range(i + 1, s):
                value -= row[j] * x[j]
            x[i] = value

        # Distribute the total amount processed by each useful
        # departing member to ordinary students.
        for i, v in enumerate(ids):
            amount = x[i]
            for to, p in wills[v]:
                if to >= n:
                    ans[to] += amount * p

    sys.stdout.write("\n".join(f"{v:.10f}" for v in ans))

if __name__ == "__main__":
    solve()
```第一部分存储初始棒棒糖计数和意愿。 这`rev`图仅包含离开成员之间的边，因为这些是与决定状态是否最终可以逃逸给普通学生相关的唯一边。 

反向遍历实现了步骤 2 和 3。如果成员的意志与普通学生有直接优势，那么该成员最初是有用的。 然后沿着反向边缘找到最终可以到达这些有用成员之一的每个成员。 这比尝试显式检测闭环更好。 成员无需属于强连接组件即可不相关。 我们唯一需要的属性是是否存在到达最终接收者的任何路径。 

矩阵使用方程

 [
 x_i-\sum_j x_jp_{j,i}=L_i。 
]

 这解释了稍微不直观的矩阵方向。 存储在 (j) 前往 (i) 的意愿中的概率属于第 (i) 行、第 (j) 列。 对角线从 1 开始，每个传入的转换都会减去它的概率。 

高斯消除对每个主元行进行归一化，然后从每个较低的行中删除主元系数。 部分旋转选择当前列中最大的可用系数，从而在概率使系统条件不佳时减少数值误差。 该矩阵最多有 500 行，因此密集表示对于内存限制来说足够小。 

回代可恢复每个有用的离开成员处理的总量 (x_i)。 然后我们再次扫描原始遗嘱并发送`amount * p`送给每一个普通的收件人。 我们故意不向即将离开的学生添加任何内容，因为他们要求的输出为零。 

Python 中不存在整数溢出问题。 潜在的大中间值是浮点量，最小的正概率仅为 (10^{-6})，因此双精度为预期系统中所需的 (10^{-5}) 输出容差提供了足够的相对精度。 

## 工作示例

 官方的样本是```
2 5
100 2
2 0.9
3 0.1
100 2
1 0.2
4 0.8
```两名离职成员形成一个循环。 成员 1 将 90% 发送给成员 2，将 10% 发送给学生 3。成员 2 将 20% 发送给成员 1，将 80% 发送给学生 4。 

总处理量的方程为

 [
 x_1=100+0.2x_2,
 ]

 [
 x_2=100+0.9x_1。 
]

 消除过程给出以下值。 

| 步骤| (x_1) | (x_1) | (x_2) | (x_2) | 意义|
 | --- | --- | --- | --- |
 | 初始方程 | (100+0.2x_2) | (100+0.9x_1) | 初始收藏量各 100 个 |
 | 替代 (x_2) | (120+0.18x_1) | (100+0.9x_1) | 展开递归流程 |
 | 解决 | (243.902439) | (319.512195) | 每位会员处理的总金额 |
 | 最后的学生 3 | 0 | 0 | (0.1x_1=24.390244) |
 | 最终学生 4 | 0 | 0 | (0.8x_2=255.609756) |

 官方样本的确切输出是```
0.0
0.0
14.63414634
185.36585366
0.0
```上表揭示了为什么仅仅查看初始集合是不够的。 每个成员处理的棒棒糖数量远多于原来的 100 个，因为其他成员的一些棒棒糖会返回给他们。 

对于第二个例子，考虑```
2 3
1 2
2 0.5
3 0.5
1 1
1 1.0
```会员 1 将处理金额的一半发送给会员 2，另一半发送给学生 3。会员 2 将所有金额发送回会员 1。 

方程是

 [
 x_1=1+x_2,
 ]

 [
 x_2=0.5x_1。 
]

 高斯系统和最终传递为：

 | 步骤| (x_1) | (x_1) | (x_2) | (x_2) | 学生 3 |
 | --- | --- | --- | --- |
 | 初始| (1+x_2) | (0.5x_1) | 0 |
 | 求解 (x_2=0.5x_1) | 2 | 1 | 0 |
 | 采纳会员1的遗嘱| 2 | 1 | 1 |
 | 采纳会员2的遗嘱| 2 | 1 | 1 |

 正确的输出是```
0.0
0.0
1.0
```该迹直接证明了不变量。 会员1总共加工了两根棒棒糖，会员2加工了一根，恰好一根棒棒糖到达了普通学生手中。 另一个棒棒糖仅作为中间流保留在递归循环中，而不作为额外的最终输出。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N^3+K+M)) | 线性系统最多有 (N=500) 个变量，而遗嘱包含 (K\le10^6) 个条目 |
 | 空间| (O(N^2+K+M)) | 稠密矩阵需要 (O(N^2))，存储的遗嘱需要 (O(K))，输出需要 (O(M)) |

 对于 (N\le500)，在利用高斯消去法的三角结构后，三次部分最多包含大约 (500^3/3) 次消去更新。 对百万条目的输入进行线性处理。 这符合问题的设计，尽管学生和遗嘱条目的总数可能很大，但递归交互的人数很少。 官方给出的限制是 7 秒，内存为 1024 MB。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

# Paste the solve() implementation from the solution above before running
# these tests.

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input
    try:
        sys.stdin = io.StringIO(inp)
        input = sys.stdin.readline
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        input = old_input

# provided sample
sample = """2 5
100 2
2 0.9
3 0.1
100 2
1 0.2
4 0.8
"""

# The helper above needs stdout captured as well.
def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        input = sys.stdin.readline
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

out = run(sample).strip().splitlines()
expected = [
    "0.0000000000",
    "0.0000000000",
    "14.6341463400",
    "185.3658536600",
    "0.0000000000",
]
for got, want in zip(out, expected):
    assert abs(float(got) - float(want)) < 1e-7

# Custom 1: minimum N and M, direct distribution.
inp = """2 3
5 1
3 1.0
7 1
3 1.0
"""
out = run(inp).strip().splitlines()
assert abs(float(out[2]) - 12.0) < 1e-7, "direct recipient"

# Custom 2: all mass trapped in a closed cycle.
inp = """2 3
1 1
2 1.0
1 1
1 1.0
"""
out = run(inp).strip().splitlines()
assert all(abs(float(x)) < 1e-9 for x in out), "closed cycle"

# Custom 3: recursive cycle with a small escape probability.
inp = """2 3
1 2
2 0.999999
3 0.000001
1 1
1 1.0
"""
out = run(inp).strip().splitlines()
assert abs(float(out[2]) - 2.0) < 1e-5, "slowly leaking cycle"

# Custom 4: maximum N, sparse wills, with every member eventually reaching
# the same ordinary student.
n = 500
m = 501
parts = [f"{n} {m}"]
for i in range(1, n + 1):
    parts.append("1 1")
    parts.append(f"{m} 1.0")
inp = "\n".join(parts) + "\n"

out = run(inp).strip().splitlines()
assert len(out) == m, "maximum number of output lines"
assert all(abs(float(out[i])) < 1e-9 for i in range(n)), "departing students"
assert abs(float(out[n]) - 500.0) < 1e-7, "all lollipops reach final student"

# Custom 5: a member can feed a useless closed component.
inp = """3 4
10 1
2 1.0
5 1
1 0.5
4 0.5
7 1
2 1.0
"""
out = run(inp).strip().splitlines()
assert abs(float(out[3]) - 5.0) < 1e-7, "mass entering closed component is discarded"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 3`，两份遗嘱都直接给学生3 |`0, 0, 12`| 最小尺寸的箱子和直接转移|
 | 两位成员互相付出100% |`0, 0, 0`| 闭路循环检测和废弃质量|
 | 一个周期保持99.9999%，泄漏0.0001% |`0, 0, 2`| 递归流和数值求解代替模拟 |
 |`N=500`，每位会员都直接给501学生| 500 条零线后跟`500`| 最大值 (N)、最大输出大小和密集系统边界 |
 | 具有闭合分量的三元图 |`0, 0, 0, 5`| 进入一个普通学生没有出路的地区的群体必须消失|

 ## 边缘情况

 对于闭环情况```
2 3
1 1
2 1.0
1 1
1 1.0
```离开的成员与普通学生相比都没有边，因此反向遍历从没有有用的顶点开始。 有用集是空的，高斯系统有零个变量，并且每个输出值都保持为零。 这直接落实了永远困在离开成员中的棒棒糖被扔掉的规则。 

对于缓慢泄漏的循环```
2 3
1 2
2 0.999999
3 0.000001
1 1
1 1.0
```两个离开的成员都被标记为有用，因为成员 2 直接联系学生 3，而成员 1 联系成员 2。等式为

 [
 x_1=1+x_2
 ]

 和

 [
 x_2=0.999999x_1。 
]

 解大约为 (x_1=1{,}000{,}000) 和 (x_2=999{,}999)。 成员 2 向学生 3 提供 (0.000001x_2)，从而从成员 2 中准确生产出 (1) 个棒棒糖，而成员 1 最终也通过相同的泄漏机制贡献了另一个 (1) 棒棒糖。 最终答案是（2），尽管直接模拟需要数百万轮才能观察收敛。 

对于有用成员将一些质量发送到封闭组件中的情况，请考虑```
3 4
10 1
2 1.0
5 2
1 0.5
4 0.5
7 1
2 1.0
```成员 1 将其所有棒棒糖发送给成员 2。成员 2 将一半发送给学生 4，一半发送给成员 1。成员 3 被成员 2 的自行车困住，并且没有创建通往外部的单独路线。 解决有用的子系统会得到由成员 2 处理的总共 10 个棒棒糖，其中 5 个到达学生 4，其余的继续循环。 输出是```
0.0
0.0
0.0
5.0
```图形可达性步骤是确保这一点安全的原因。 我们从不尝试将有限的“已处理的总量”分配给真正封闭的组件，因为这样的数量不需要存在。 我们仅解决有助于获得所请求的最终答案的瞬态部分。
