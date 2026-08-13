---
title: "CF 102297J - 你应该通过"
description: "我们最多有 50 名学生，每个学生必须被分配到 Matt 的班级或 Sean 的班级。 学生 (i) 有一个基本概率通过 Matt 的课程，另一个基本概率通过 Sean 的课程。"
date: "2026-08-13T08:38:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102297
codeforces_index: "J"
codeforces_contest_name: "UCF Locals 2015"
rating: 0
weight: 102297
solve_time_s: 117
verified: true
draft: false
---

[CF 102297J - 你应该通过](https://codeforces.com/problemset/problem/102297/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们最多有 50 名学生，每个学生必须被分配到 Matt 的班级或 Sean 的班级。 学生 (i) 有一个基本概率通过 Matt 的课程，另一个基本概率通过 Sean 的课程。 

如果两个学生 (i) 和 (j) 被分在同一班级，则学习小组将学生 (i) 的概率增加 (a_{ij})，并将学生 (j) 的概率增加 (a_{ji})。 因此，对于放置在一起的一对，该对的总贡献为 (a_{ij}+a_{ji})。 如果他们分开，则不会收到任何捐款。 

目标是最大限度地提高预期通过考试的学生人数。 由于总和的期望是期望的总和，因此我们只需要最大化所有个体通过概率的总和即可。 

输入包含几个学期。 对于每个学期，(n) 是学生人数，后面是 (n) 马特概率、(n) 肖恩概率，以及描述学习小组改进的 (n\times n) 矩阵。 输出是预计通过的学生的最大可能数量，打印到小数点后两位。 官方竞赛 PDF 确认了完整的示例输入，包括在提供的摘录中丢失的测试用例和学生人数。 

界限 (n\leq 50) 是关键约束。 有 (2^n) 种可能的班级分配，这已经是 (n=50) 处的大约 (1.13\times10^{15}) 种分配。 即使在 (O(n^2)) 中评估作业也是没有希望的。 另一方面，只有大约 50 个学生顶点的图很小，因此多项式时间最大流或最小割算法很容易实用。 

小数值的小数点后恰好有两位数。 我们可以将每个值乘以 100，并且完全使用整数。 这消除了浮点错误并使最终答案成为精确的百分之几整数。 

一个微妙的例子是不对称的研究组矩阵。 例如，有两个学生和```
1
2
0.50 0.50
0.50 0.50
0.00 0.30
0.10 0.00
```将两个学生放在一起会得到额外的 (0.30+0.10=0.40)，所以答案是`1.40`。 仅使用 (a_{ij}) 而不是两个方向的粗心实现将错误地获得`1.30`。 

另一个边缘情况是一个类可能是空的。 和```
1
2
1.00 0.00
0.00 1.00
0.00 0.00
0.00 0.00
```将学生 1 与 Matt 放在一起，将学生 2 与 Sean 放在一起，得到的期望值为`2.00`。 任何假设两个班级都必须包含一名学生的方法都将不必要地排除其他情况下有效的全一侧作业。 

第三个问题是精确的小数处理。 由于每个输入值都是 (0.01) 的倍数，因此最优值也是 (0.01) 的倍数。 使用二进制浮点然后格式化结果可以在小数点边界附近引入可避免的错误。 整数缩放完全避免了这个问题。 

## 方法

 直接的方法是枚举学生在两个班级中的每一个可能的分配。 通过二进制向量表示赋值，其中 0 表示 Sean，1 表示 Matt。 对于每项作业，我们可以计算每个学生的基本概率，然后检查每对学生以确定他们的学习小组贡献是否适用。 有 (2^n) 项作业，评估一项作业需要 (O(n^2)) 时间，需要 (O(2^n n^2)) 时间。 在 (n=50) 时，这大约是 (1.13\times10^{15}\cdot2500)，远远超出了任何实际值。 

蛮力之所以有效，是因为每项作业都可以独立、直接地评估。 问题在于，目标具有比任务之间的任意依赖性更有用的结构。 

对于每一对 (i,j)，如果它们属于同一类，我们将获得

 [
 w_{ij}=a_{ij}+a_{ji}。 
]

 如果它们分开，我们就会损失全部金额。 由于所有研究组的值都是非负的，因此分开一对只能消除奖励。 这正是可以用无向切割边表示的成对相互作用。 

学生的个人偏好也可以表示为一元项。 定义

 [
 d_i = M_i-S_i,
 ]

 其中 (M_i) 和 (S_i) 是两个基本概率。 如果学生 (i) 从 Sean 转到 Matt，则基本贡献会改变 (d_i)。 

选择 Sean 作为参考配置，这意味着最初每个学生都在 Sean 的班级中。 在该配置中，该值为

 [
 B=\sum_i S_i+\sum_{i<j}w_{ij}。 
]

 如果学生转向马特，我们就会获得 (d_i)。 如果两个学生最终站在不同的一边，我们就输了 (w_{ij})。 因此，对于分配给 Matt 的一组 (X) 学生，

 B+\sum_{i\in X}d_i
 -\sum_{\substack{i<j\i\in X,\ j\notin X}}w_{ij}。 
]

 这是一个二元优化问题，具有一元增益和用于分离两个顶点的非负惩罚。 我们可以将其转换为最小 (s)-(t) 割。 

唯一的小复杂之处是最小削减只能代表非负成本。 添加

 [
 P=\sum_i\max(d_i,0)
 ]

 到切割配方。 对于 (d_i>0) 的学生，如果该学生站在 Sean 一边，图表将支付 (d_i)，因为这样做会放弃对 Matt 的积极偏好。 对于 (d_i<0)，如果学生转到 Matt，则图表将支付 (-d_i)，因为这会放弃对 Sean 的偏好。 

对于每一对，添加一条无向容量边 (w_{ij})。 如果两个学生都在同一侧，则该边缘对切割没有任何贡献。 如果它们位于相对侧，则恰好有一个有向弧穿过切口并贡献 (w_{ij})。 

因此，

 P-\sum_{i\in X}d_i
 +\sum_{\text{分隔}i,j}w_{ij},
 ]

 因此

 [
 \盒装{
 \text{答案}=B+P-\text{最小切割}
 }。 
]

 观察到成对奖励正是分离两个学生的惩罚，这使得明显的指数划分问题变成了标准的最小割问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^n n^2)) | (O(n^2)) | 太慢了 |
 | 最佳| (O(n^4)) 与泛型 Dinic | (O(n^2)) | 已接受 |

 (O(n^4)) 界限是该图上 Dinic 的标准 (O(V^2E)) 最坏情况界限，其中 (V=O(n)) 和 (E=O(n^2))。 由于只有 50 名学生，生成的图表非常小。 

## 算法演练

 1. 将每个概率解析为百分之一的整数。 例如，`0.75`变成`75`。 这使得整个优化可以使用精确的整数算术来运行。 
2. 计算将每个学生放入 Sean 班级所对应的基线值 (B)。 从 Sean 的基本概率之和开始。 然后，对于每一对 (i<j)，添加 (a_{ij}+a_{ji})，因为两个学生在一起时都会获得各自学习小组的进步。 
3. 对于每个学生，计算 (d_i=M_i-S_i)。 同时累加 (P=\sum_i\max(d_i,0))。 值 (P) 是将正一元奖励转换为非负削减成本所需的常数。 
4. 创建代表 Matt 类的源顶点和代表 Sean 类的接收器顶点。 源端的学生被解释为在 Matt 的班级中，而接收端的学生被解释为在 Sean 的班级中。 
5. 如果 (d_i>0)，则添加一条从源到容量为 (d_i) 的学生 (i) 的边。 削减这一优势意味着让更喜欢马特的学生站在肖恩一边，所以削减的费用正好弥补了失去的偏好。 如果 (d_i<0)，则添加从学生 (i) 到容量为 (-d_i) 的接收器的边。 打破这一优势意味着将更喜欢肖恩的学生转移到马特的班级，再次为失去的偏好付出代价。 
6. 对于每对 (i<j)，计算 (w_{ij}=a_{ij}+a_{ji})。 在两个学生顶点之间的两个方向上添加容量 (w_{ij})。 如果两个学生都获得相同的班级标签，则两个方向都不会跨越界限。 如果它们的标签不同，则一个方向交叉并恰好贡献 (w_{ij})。 
7. 运行从源到接收器的最大流量算法。 根据最大流量/最小切割定理，所得流量值等于最小切割能力。 最小削减代表考虑了学生偏好和分开的学习小组后可能的最小损失。 
8. 返回 (B+P-\text{flow})，除以 100。由于每个数量都以百分之一的形式存储，因此该除法给出精确的两位小数答案，无需任何舍入计算。 

### 为什么它有效

 对于任何班级作业 (X)，基线 (B) 已包含将每个人归入 Sean 班级的值。 将学生 (i) 移至 Matt 将基本贡献更改为 (d_i)，而将一对 (i,j) 分开会从基线学习组奖励中删除 (w_{ij})。 

构造的切割具有恰好的补充成本。 当 (i) 错误地留在 Sean 一侧时，正值 (d_i) 将精确地贡献 (d_i)，而当 (i) 移动到 Matt 一侧时，负值 (d_i) 将精确地贡献 (-d_i)。 当两个学生分开时，一对贡献 (w_{ij}) 。 添加 (P) 使所有一元成本都非负，因此每次分配都减少了成本

 [
 P+\bigl(B-\text{值}(X)\bigr)。 
]

 因此，最小化削减完全相当于最大化预期通过的学生数量。 因此，最小划分给出了全局最优的类别划分。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Dinic:
    class Edge:
        __slots__ = ("to", "rev", "cap")

        def __init__(self, to, rev, cap):
            self.to = to
            self.rev = rev
            self.cap = cap

    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]
        self.level = [-1] * n
        self.it = [0] * n

    def add_edge(self, u, v, cap):
        a = self.Edge(v, len(self.g[v]), cap)
        b = self.Edge(u, len(self.g[u]), 0)
        self.g[u].append(a)
        self.g[v].append(b)

    def bfs(self, s, t):
        self.level = [-1] * self.n
        q = [s]
        self.level[s] = 0

        head = 0
        while head < len(q):
            u = q[head]
            head += 1

            for e in self.g[u]:
                if e.cap > 0 and self.level[e.to] == -1:
                    self.level[e.to] = self.level[u] + 1
                    q.append(e.to)

        return self.level[t] != -1

    def dfs(self, u, t, pushed):
        if u == t:
            return pushed

        while self.it[u] < len(self.g[u]):
            e = self.g[u][self.it[u]]

            if e.cap > 0 and self.level[e.to] == self.level[u] + 1:
                flow = self.dfs(e.to, t, min(pushed, e.cap))

                if flow:
                    e.cap -= flow
                    self.g[e.to][e.rev].cap += flow
                    return flow

            self.it[u] += 1

        return 0

    def max_flow(self, s, t):
        flow = 0
        INF = 10**30

        while self.bfs(s, t):
            self.it = [0] * self.n

            while True:
                pushed = self.dfs(s, t, INF)
                if pushed == 0:
                    break
                flow += pushed

        return flow

def parse100(x):
    whole, frac = x.split(".")
    return int(whole) * 100 + int(frac)

def solve_case(n, matt, sean, a):
    source = n
    sink = n + 1

    dinic = Dinic(n + 2)

    baseline = sum(sean)

    d = [matt[i] - sean[i] for i in range(n)]
    positive = 0

    for i in range(n):
        if d[i] > 0:
            dinic.add_edge(source, i, d[i])
            positive += d[i]
        elif d[i] < 0:
            dinic.add_edge(i, sink, -d[i])

    for i in range(n):
        for j in range(i + 1, n):
            w = a[i][j] + a[j][i]

            baseline += w

            if w:
                dinic.add_edge(i, j, w)
                dinic.add_edge(j, i, w)

    cut = dinic.max_flow(source, sink)

    return baseline + positive - cut

def solve():
    g = int(input())

    out = []

    for _ in range(g):
        n = int(input())

        matt = [parse100(x) for x in input().split()]
        sean = [parse100(x) for x in input().split()]

        a = []
        for _ in range(n):
            a.append([parse100(x) for x in input().split()])

        ans = solve_case(n, matt, sean, a)

        out.append(f"{ans // 100}.{ans % 100:02d}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`parse100`函数故意对原始字符串进行处理，而不是通过`float`。 诸如以下的值`0.20`恰好变成 20，因此所有图容量都是整数。 

基线使用所有 Sean 概率进行初始化，然后接收每对的组合奖励。 矩阵的对角线条目被忽略，因为学习小组的贡献描述了一对不同的学生。 对于每一对 (i<j)，两个方向都组合成一个奖励 (w_{ij})，因此可以正确处理不对称输入。 

一元边遵循 (d_i) 的符号。 正差异意味着 Matt 对该学生更好，因此当学生留在 Sean 一边时，来源与学生的优势会产生差异。 负差值意味着 Sean 更好，因此当学生与 Matt 放在一起时，学生到水槽边缘会收取绝对差值。 

在两个方向上添加对边。 呼唤`add_edge(i, j, w)`仅此一项就会产生容量为零的剩余反向边缘，这不足以对无向削减惩罚进行建模。 添加相反的边显式地给出了两个方向上的图容量 (w)。 当学生分开时，这两条弧线中的一条正好穿过 (s)-(t) 切口。 

Python 整数具有任意精度，因此即使所有容量按 100 缩放，也不存在溢出问题。与 Python 的整数范围相比，最大的总目标也很小。 

最后，`ans`已经是精确的百分之几了。 表达式`ans // 100`给出整数部分和`ans % 100`给出两位小数。 不需要浮点舍入。 

## 工作示例

 ### 示例 1

 第一学期有两名学生。 他们的基本概率是

 [
 M=(0.75,0.25),\qquad S=(0.25,0.75)。 
]

 学习组矩阵给出 (a_{12}=0.20) 和 (a_{21}=0.20)，因此将两个学生放在一起给出的总配对奖励为 (0.40)。 

关键的整数值如下所示。 

| 变量| 价值|
 | --- | --- |
 | 肖恩基线 | 100 | 100
 | 配对奖励 | 40|
 | 总基线 (B) | 140 | 140
 | (d_1) | (d_1) | 50 | 50
 | (d_2) | -50 |
 | 正和 (P) | 50 | 50
 | 最小切割| 20 | 20
 | 最终值| 170 | 170

 最小割让学生 1 站在 Matt 一边，学生 2 站在 Sean 一边。 配对奖励 40 丢失，但学生 1 通过选择 Matt 而不是 Sean 获得 50。 相对于全 Sean 基线，净增益为 10，即百分之 (150)，或者`1.50`。 

图形计算给出了相同的结果

 [
 B+P-\text{剪切}=140+50-20=170。 
]

 这里必须仔细解释基线。 它包含每个人在一起的配对奖励，而最低削减则删除了所选分割不保留的奖励和偏好。 

### 示例 2

 第二学期有三名学生。 Sean 概率为 (0.40,0.40,0.95)，唯一的非零研究组值为 (a_{13}=0.55) 和 (a_{23}=0.35)。 

将每个人都放入 Sean 的班级可以得到

 [
 0.40+0.55+0.40+0.35+0.95=2.65。 
]

 图形变量是：

 | 变量| 价值|
 | --- | --- |
 | 肖恩·基森 | 175 | 175
 | 配对奖励 (w_{13}) | 55 | 55
 | 配对奖励 (w_{23}) | 35 | 35
 | 总基线 (B) | 265 | 265
 | (d_1) | (d_1) | -20 | -20
 | (d_2) | 20 | 20
 | (d_3) | 0 |
 | 正和 (P) | 20 | 20
 | 最小切割| 20 | 20
 | 最终值| 265 | 265

 学生 2 对 Matt 的偏好为 20%，因此该图包含容量为 20 的源到学生 2 的边缘。将学生 2 移至 Matt 也会将该学生与学生 3 分开，从而失去 35% 的学习组奖励。 因此，最低削减让所有人都站在肖恩一边，并支付百分之二十的一元优势。 

最终结果是

 [
 265+20-20=265，
 ]

 这是`2.65`。 

该轨迹说明了为什么该图必须同时考虑学生偏好和配对奖励。 仅根据每个学生更好的基本概率来选择班级可能不是最理想的，因为移动一个学生可能会破坏多个学习小组的奖励。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^4)) | 该图有 (O(n)) 个顶点和 (O(n^2)) 个边，通用 Dinic 具有 (O(V^2E)) 最坏情况界限。 |
 | 空间| (O(n^2)) | 密集对图包含 (O(n^2)) 条残差边。 |

 对于 (n\leq50)，在计算剩余边之前，图最多有 52 个顶点和大约 (O(2500)) 个学生对边。 即使是保守的 (O(n^4)) 界限在这个规模上也很小，并且内存使用量是二次的。 

(2^{50}) 赋值的指数枚举是真正的障碍。 用一个小的最小割计算代替它使得该解决方案变得实用。 

## 测试用例```python
import sys
import io

class Dinic:
    class Edge:
        __slots__ = ("to", "rev", "cap")

        def __init__(self, to, rev, cap):
            self.to = to
            self.rev = rev
            self.cap = cap

    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]
        self.level = [-1] * n
        self.it = [0] * n

    def add_edge(self, u, v, cap):
        a = self.Edge(v, len(self.g[v]), cap)
        b = self.Edge(u, len(self.g[u]), 0)
        self.g[u].append(a)
        self.g[v].append(b)

    def bfs(self, s, t):
        self.level = [-1] * self.n
        self.level[s] = 0
        q = [s]
        head = 0

        while head < len(q):
            u = q[head]
            head += 1

            for e in self.g[u]:
                if e.cap > 0 and self.level[e.to] == -1:
                    self.level[e.to] = self.level[u] + 1
                    q.append(e.to)

        return self.level[t] != -1

    def dfs(self, u, t, pushed):
        if u == t:
            return pushed

        while self.it[u] < len(self.g[u]):
            e = self.g[u][self.it[u]]

            if e.cap > 0 and self.level[e.to] == self.level[u] + 1:
                got = self.dfs(e.to, t, min(pushed, e.cap))

                if got:
                    e.cap -= got
                    self.g[e.to][e.rev].cap += got
                    return got

            self.it[u] += 1

        return 0

    def max_flow(self, s, t):
        flow = 0
        INF = 10**30

        while self.bfs(s, t):
            self.it = [0] * self.n

            while True:
                pushed = self.dfs(s, t, INF)
                if pushed == 0:
                    break
                flow += pushed

        return flow

def parse100(x):
    whole, frac = x.split(".")
    return int(whole) * 100 + int(frac)

def solve_case(n, matt, sean, a):
    source = n
    sink = n + 1
    dinic = Dinic(n + 2)

    baseline = sum(sean)
    positive = 0

    for i in range(n):
        d = matt[i] - sean[i]

        if d > 0:
            dinic.add_edge(source, i, d)
            positive += d
        elif d < 0:
            dinic.add_edge(i, sink, -d)

    for i in range(n):
        for j in range(i + 1, n):
            w = a[i][j] + a[j][i]
            baseline += w

            if w:
                dinic.add_edge(i, j, w)
                dinic.add_edge(j, i, w)

    return baseline + positive - dinic.max_flow(source, sink)

def solve():
    input = sys.stdin.readline
    g = int(input())
    out = []

    for _ in range(g):
        n = int(input())
        matt = [parse100(x) for x in input().split()]
        sean = [parse100(x) for x in input().split()]
        a = [[parse100(x) for x in input().split()] for _ in range(n)]

        ans = solve_case(n, matt, sean, a)
        out.append(f"{ans // 100}.{ans % 100:02d}")

    return "\n".join(out)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

sample = """\
2
2
0.75 0.25
0.25 0.75
0.00 0.20
0.20 0.00
3
0.20 0.60 0.95
0.40 0.40 0.95
0.00 0.00 0.55
0.00 0.00 0.35
0.00 0.00 0.00
"""

assert run(sample) == "1.50\n2.65", "official sample"

minimum = """\
1
2
1.00 0.00
0.00 1.00
0.00 0.00
0.00 0.00
"""

assert run(minimum) == "2.00", "minimum n and opposite class preferences"

asymmetric = """\
1
2
0.50 0.50
0.50 0.50
0.00 0.30
0.10 0.00
"""

assert run(asymmetric) == "1.40", "both directions of a study group must be counted"

zero_interactions = """\
1
2
0.25 0.80
0.75 0.20
0.00 0.00
0.00 0.00
"""

assert run(zero_interactions) == "1.55", "each student independently chooses the better class"

n = 50
matt = " ".join(["0.50"] * n)
sean = " ".join(["0.50"] * n)
zero_row = " ".join(["0.00"] * n)

maximum_size = "1\n" + str(n) + "\n"
maximum_size += matt + "\n"
maximum_size += sean + "\n"
maximum_size += "\n".join([zero_row] * n) + "\n"

assert run(maximum_size) == "25.00", "maximum n with all equal values"
```第一个断言使用官方的两学期样本。 最小规模案例检查有效的最佳方案是否可以将学生分入不同的班级，并且也允许空班级。 

非对称情况专门设计用于捕获将 (a_{ij}) 和 (a_{ji}) 视为一个值的常见错误。 当学生共享一个班级时，这两项贡献均适用，因此两人奖励为百分之四十。 

零交互案例将问题简化为每个学生的独立决策。 学生 1 选择 Sean 的 (0.75)，而学生 2 选择 Matt 的 (0.80)，给出`1.55`。 

最终测试使用允许的最大值 (n=50)，每个概率等于`0.50`每个研究组值都为零。 每个赋值都有相同的值，即(50\times0.50=25.00)。 它还检查密集输入矩阵和图形构造是否在最大允许大小下工作。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 官方两学期样本|`1.50`和`2.65`| 主要结构和示例行为|
 | (n=2)，相反的阶级偏好 |`2.00`| 最小尺寸和空类可能性 |
 | (a_{12}=0.30,\a_{21}=0.10) |`1.40`| 不对称对贡献 |
 | 零交互矩阵|`1.55`| 独立一元选择 |
 | (n=50)，所有值均相等 |`25.00`| 最大尺寸和密集矩阵处理|

 ## 边缘情况

 ### 空类

 考虑```
1
2
1.00 0.00
0.00 1.00
0.00 0.00
0.00 0.00
```没有配对奖励。 差异为 (d_1=1.00) 和 (d_2=-1.00)。 该图的源到学生 1 的边的容量为 100，学生 2 到汇的边的容量为 100。最小割将学生 1 与 Matt 放在一起，学生 2 与 Sean 放在一起，给出的值为百分之 200，或者`2.00`。 

如果每个学生都喜欢同一个班级，那么最低削减将使每个人都站在这一侧，而另一个班级则空着。 该图没有强加任何两边都包含顶点的要求。 

### 不对称学习小组

 考虑```
1
2
0.50 0.50
0.50 0.50
0.00 0.30
0.10 0.00
```基值为百分之一。 如果学生们在一起，则配对奖励为 (30+10=40)，即百分之 140。 如果分开，配对奖励消失，价值仅为 100。 

该图在学生顶点之间包含两条容量为 40 的相对弧。 将它们分开的切口恰好穿过其中一条弧线，支付 40。将它们保持在一起的切口则不会穿过其中任何一个弧线。 因此最小割选择相同的类别，输出为`1.40`。 

### 零互动

 对于```
1
2
0.25 0.80
0.75 0.20
0.00 0.00
0.00 0.00
```第一个学生通过选择 Sean 获得百分之 50，而第二个学生通过选择 Matt 获得百分之 60。 根本不存在对边。 最小切割做出这两个独立的决定，给出（75+80=155）百分之一，或者`1.55`。 

这是一个有用的健全性检查，因为当每个研究组值为零时，图表应减少为两个独立的一元选择。 

### 精确的十进制算术

 每个输入值都表示为百分之一的整数。 例如，`0.75`变成 75 岁并且`0.20`变为20。因此每个图的容量都是一个整数，最终的最优值也是一个整数百。 

对于官方的第一个样本，结果是 150，因此程序打印`150 // 100 = 1`其次是`50`作为小数部分，产生`1.50`。 优化中的任何地方都没有浮点计算，因此诸如`0.10 + 0.20`无法累积二进制表示错误。 

### 最大学生人数

 在 (n=50) 处，有 50 个学生顶点以及源点和汇点。 学生对部分最多包含 (50\cdot49/2=1225) 个不同的对，每对使用两个定向容量。 该图仍然很小，Dinic 可以轻松处理它。 

全部相等的最大尺寸情况使每个学生都有概率`0.50`在两个班级中都没有学习小组奖励。 每个分配的期望值恰好为 25，因此算法可能返回任何最小割，但计算的目标始终是`25.00`。 这证实了关系不需要任何特殊处理。
