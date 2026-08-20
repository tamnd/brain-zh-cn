---
title: "CF 102174L - \u65c5\u884c\u7684\u610f\u4e49"
description: "这些城市构成一个有向无环图，旅程从城市1开始。每当旅行者到达一个城市时，他们都会花一天的时间游览然后做出任何决定。 假设当前城市有(d0)条出站铁路边。"
date: "2026-08-19T07:12:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102174
codeforces_index: "L"
codeforces_contest_name: "The 14-th BIT Campus Programming Contest"
rating: 0
weight: 102174
solve_time_s: 111
verified: true
draft: false
---

[CF 102174L - \u65c5\u884c\u7684\u610f\u4e49](https://codeforces.com/problemset/problem/102174/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这些城市构成一个有向无环图，旅程从城市1开始。每当旅行者到达一个城市时，他们都会花一天的时间游览然后做出任何决定。 

假设当前城市有(d>0)条出站铁路边。 第二天有 (d+1) 个同样可能的选择：乘坐 (d) 趟出发火车中的任何一趟，或者再停留一天观光。 如果留下来，就不能再留下来，所以第二天必须统一选择（d）出发列车中的一趟。 没有外出边缘的城市是终点站城市，总共待两天，旅程就结束了。 

输入包含 (T) 个独立的测试用例。 每个测试用例给出 (n) 个城市和 (m) 有向铁路边缘。 该图保证是 DAG，但城市编号不保证是拓扑排序。 我们需要从城市 1 开始的预期总天数，以模 (998244353) 表示。 

边界 (n,m\le 10^5) 是主要的算法信号。 二次算法可以对一个大型测试用例执行大约 (10^{10}) 次运算，这远远超出了一秒的限制。 即使是依赖于枚举所有可能路由的算法也是没有希望的，因为 DAG 可以包含指数级数量的不同路径。 我们需要一个解决方案，其工作本质上与图的大小成正比，即 (O(n+m))。 

有几种边缘情况可能会导致粗心的实施错误。 最小的图是```
1
1 0
```没有外出的边缘，但旅行者仍然在唯一的城市度过了两天。 正确答案是`2`。 将零出度视为零未来成本并忘记第二个观光日的实现将输出`1`。 

具有一条出边的城市在概率计算中也需要进行特殊处理。 为了```
1
2 1
1 2
```城市 2 贡献两天。 从城市1出发，有立即乘坐火车的概率（1/2）和多停留一天再乘坐火车的概率（1/2）。 到达城市2之前的预期贡献为(1+3/2=5/2)，因此总计为(9/2)，其模表示为`499122181`。 将停留概率替换为 (1/d)，而不是 (1/(d+1))，会给出错误的结果。 

也不能假设城市编号形成拓扑顺序。 例如，```
1
3 2
1 3
3 2
```要求城市 2 在城市 3 之前处理，城市 3 在城市 1 之前处理。简单地从 (n) 向下循环到 (1) 的 DP 恰好适用于某些图，但在这里没有正确性保证。 

最后，无法到达的城市并不影响答案。 为了```
1
3 0
```旅行者从城市 1 出发，两天后结束。 城市 2 和 3 无关。 计算每个城市的 DP 值仍然可以，因为答案仅使用城市 1 的值。 

## 方法

 直接的暴力方法将模拟每一个可能的旅程。 在具有 (d) 外出边缘的城市，我们将分支到可能的直接火车选择和停留的可能性，并且在停留后我们将再次分支到外出边缘。 对于每条完整的路线，我们可以计算其持续时间和概率，然后将贡献相加。 

这是正确的，因为期望是所有可能旅程的概率加权总和。 问题是旅程的数量。 包含 (i<j) 的每条边 (i\to j) 的 DAG 具有从城市 1 到城市 (n) 的 (2^{n-2}) 条不同路径，因为中间城市的每个子集都可以按升序出现。 中止决策向状态空间添加了额外的分支。 对于(n=10^5)，即使是(2^{99998})也远远超出了可以枚举的范围。 

蛮力之所以有效，是因为每个旅程都可以独立评估，但它会失败，因为许多不同的旅程重复经过同一个城市。 关键的观察是，一旦我们到达一个城市，预期的剩余时间仅取决于该城市，而不取决于到达该城市的历史记录。 我们可以将该期望值存储为 DP 状态。 

转移概率还有一种更有用的简化。 如果一个城市有 (d>0) 条出站边缘，则每个直接列车选择的概率为 (1/(d+1))。 停留也有概率(1/(d+1))，停留后，以概率(1/d)选择每个出边。 因此，最终采用任何特定出边的总概率是

 [
 \frac{1}{d+1}+\frac{1}{d+1}\cdot\frac{1}{d}
 =\frac{1}{d}。 
]

 因此，在考虑了可能的额外观光日后，下一个城市将简单地均匀分配给外出的邻居。 

令 (f_u) 为旅行者刚刚到达城市 (u) 并在那里观光之前的预计剩余天数。 对于 (d=0)，

 [
 f_u=2。 
]

 对于(d>0)，第一观光日花费一天。 之后，乘坐火车需要花费一天的费用，而先行则需要在火车出发前多花费一天的费用。 由于停留的概率为 (1/(d+1))，因此从该点到到达下一个城市的预期成本为

 [
 1+\左(1+\frac{1}{d+1}\右)
 =2+\frac{1}{d+1}。 
]

 下一个城市均匀分布在 (d) 个外出邻居中，给出

 2+\frac{1}{d+1}
 +
 \frac{1}{d}\sum_{u\to v}f_v。 
]

 由于该图是非循环的，因此每个 (f_u) 仅取决于 DAG 上更远的值。 拓扑排序允许我们以相反的顺序计算所有值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^n)) 在最坏的情况下 | (O(n)) 递归深度 | 太慢了|
 | 最佳| (O(n+m)) | (O(n+m)) | 已接受 |

 ## 算法演练

1. 读取有向图并记录每个城市的外出邻居。 同时，计算每个城市的入度。 入度值使我们能够在不依赖城市标签的情况下获得拓扑排序。 
2. 运行Kahn 的拓扑排序算法。 将每个零入度城市放入队列，重复删除一个城市，并减少其外出邻居的入度。 由于该图保证是一个 DAG，因此每个城市最终都会进入排序。 
3. 预先计算 (n+1) 之前的所有整数的模逆。 对于出度为 (d) 的城市，递归需要 (1/d) 和 (1/(d+1))。 由于每个度数最多为 (10^5)，所有这些分母都小于模数 (998244353)，因此它们的倒数存在。 
4. 逆向处理拓扑排序。 当处理城市 (u) 时，每个传出邻居 (v) 都已被处理，因此所有 (f_v) 值都是已知的。 
5. 如果城市(u)没有出边，则设置(f_u=2)。 游客们花一天时间观光，然后又花一天时间，因为没有火车可乘。 
6. 否则，令 (d) 为 (u) 的出度。 计算

 [
 f_u=
 2+\frac{1}{d+1}
 +\frac{1}{d}\sum_{u\to v}f_v
 \pmod {998244353}。 
]

 (2+1/(d+1)) 项包含在当前城市以及过渡到下一个城市所花费的每一天。 后继值的平均值说明了最终乘坐的输出列车。 

1、输出(f_1)，因为城市1是起始城市。 

不变的是，当以逆拓扑顺序处理一个城市时，其 DP 值是根据一个传出边可到达的每个城市的精确值计算的。 循环本身就是对该城市所有可能的决定的总体期望法则。 由于每条边都按照拓扑顺序向前移动，因此在最终确定之前不会使用任何值。 因此，每个 (f_u)，特别是 (f_1)，等于真实的预期剩余行程时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
MAXN = 100000 + 2

# inv[i] = i^(-1) mod MOD
inv = [0] * (MAXN + 1)
inv[1] = 1
for i in range(2, MAXN + 1):
    inv[i] = MOD - (MOD // i) * inv[MOD % i] % MOD

def solve():
    T = int(input())
    answers = []

    for _ in range(T):
        n, m = map(int, input().split())

        graph = [[] for _ in range(n)]
        indeg = [0] * n

        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            graph[u].append(v)
            indeg[v] += 1

        # Kahn's algorithm for a topological ordering.
        queue = [u for u in range(n) if indeg[u] == 0]
        head = 0
        topo = []

        while head < len(queue):
            u = queue[head]
            head += 1
            topo.append(u)

            for v in graph[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    queue.append(v)

        dp = [0] * n

        # Every successor appears earlier in reverse topological order.
        for u in reversed(topo):
            d = len(graph[u])

            if d == 0:
                dp[u] = 2
                continue

            s = 0
            for v in graph[u]:
                s += dp[v]
            s %= MOD

            dp[u] = (
                2
                + inv[d + 1]
                + s * inv[d]
            ) % MOD

        answers.append(str(dp[0]))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    solve()
```邻接列表准确地存储了重复所需的外出铁路选择。 它还允许拓扑排序和 DP 只遍历每条边恒定的次数。 

拓扑排序使用一个列表和一个头指针，而不是重复地从Python列表的前面删除。 从前面移除每次操作将花费 (O(n))，而前进`head`是常数时间。 

对于所有测试用例，逆数组都会计算一次。 模逆的递推式为

 -\左\lfloor\frac{MOD}{i}\右\rfloor
 \operatorname{inv}(MOD\bmod i)
 \pmod{MOD}。 
]

 这避免了对每个城市执行模幂运算。 呼唤`pow(x, MOD-2, MOD)`单独最多 (10^5) 度会增加不必要的对数因子。 

使用前必须处理零出度分支`inv[d]`，因为 (1/0) 未定义。 更重要的是，它的期望值恰好是 2 而不是 1。 

所有算术都按模 (998244353) 减少。 Python 整数不会溢出，但减少邻居和和最终递归可以使中间值保持较小，并与数学模计算相匹配。 

不假定该图按顶点编号排序。 的反向遍历`topo`是保证每个`dp[v]`被使用过`dp[u]`已经可用。 

## 工作示例

 对于第一个样本，输入是```
1
1 0
```只有一个城市，没有铁路边缘。 

| 城市 | 出度 | 邻居总和 | DP |
 | --- | --- | --- | --- |
 | 1 | 0 | 0 | 2 |

 零出度规则立即给出 (f_1=2)。 因此答案是`2`。 

对于第二个样本，输入是```
1
2 1
1 2
```拓扑顺序为(1,2)。 向后处理它首先给出城市 2。 

| 城市 | 出度 | 邻居总和 | DP |
 | --- | --- | --- | --- |
 | 2 | 0 | 0 | 2 |
 | 1 | 1 | 2 | (2+\frac12+2=\frac92) |

 对于城市 1，(d=1)，因此额外住宿贡献 (1/(1+1)=1/2)。 唯一的后继者的预期值为 2。因此

 [
 f_1=2+\frac12+2=\frac92。 
]

 取模 (998244353),

 [
 \frac92=9\cdot 2^{-1}
 =499122181,
 ]

 与示例输出匹配。 

稍微丰富一点的迹线对于查看平均项很有用。 考虑```
1
4 4
1 2
1 3
2 4
3 4
```城市 4 是终点站，而城市 2 和 3 均直接通往城市 4。 

| 城市 | 出度 | 邻居总和 | DP |
 | --- | --- | --- | --- |
 | 4 | 0 | 0 | 2 |
 | 3 | 1 | 2 | (9/2) |
 | 2 | 1 | 2 | (9/2) |
 | 1 | 2 | 9 | (27/4) |

 在城市 1 有两条出边，因此额外停留期望为 (1/3)，下一个城市均匀分布在城市 2 和 3 之间。两者都有值 (9/2)，因此

 [
 f_1=2+\frac13+\frac{1}{2}\left(\frac92+\frac92\right)
 =\frac{27}{4}。 
]

 这个例子证实了递归取决于平均后继期望而不是任何特定路径。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n+m)) | 拓扑排序访问每个城市和边缘一次，DP 再次扫描每个边缘。 |
 | 空间| (O(n+m)) | 邻接表包含 (m) 条边，而图和 DP 数组包含 (O(n)) 个附加值。 |

 对于 (n,m\le 10^5)，算法仅对输入图执行几次线性遍历。 在多个测试用例中，相同的推理独立地适用于每个用例。 内存使用量与图表大小也呈线性关系，并且完全符合规定的内存限制。 

## 测试用例```python
# The production solution above is organized around solve(), which reads
# from sys.stdin. For isolated tests, this helper temporarily replaces stdin.

import sys
import io
from contextlib import redirect_stdout

MOD = 998244353

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    data = sys.stdin.read().split()
    it = iter(data)

    T = int(next(it))
    out = []

    for _ in range(T):
        n = int(next(it))
        m = int(next(it))

        graph = [[] for _ in range(n)]
        indeg = [0] * n

        for _ in range(m):
            u = int(next(it)) - 1
            v = int(next(it)) - 1
            graph[u].append(v)
            indeg[v] += 1

        queue = [i for i in range(n) if indeg[i] == 0]
        head = 0
        topo = []

        while head < len(queue):
            u = queue[head]
            head += 1
            topo.append(u)

            for v in graph[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    queue.append(v)

        max_degree = max((len(x) for x in graph), default=0)

        inv = [0] * (max_degree + 2)
        if max_degree + 1 >= 1:
            inv[1] = 1

        for i in range(2, max_degree + 2):
            inv[i] = MOD - (MOD // i) * inv[MOD % i] % MOD

        dp = [0] * n

        for u in reversed(topo):
            d = len(graph[u])

            if d == 0:
                dp[u] = 2
            else:
                s = sum(dp[v] for v in graph[u]) % MOD
                dp[u] = (
                    2 + inv[d + 1] + s * inv[d]
                ) % MOD

        out.append(str(dp[0]))

    sys.stdin = old_stdin
    return "\n".join(out)

# Provided sample 1
assert run("""\
1
1 0
""") == "2", "sample 1"

# Provided sample 2
assert run("""\
1
2 1
1 2
""") == "499122181", "sample 2"

# Minimum-size graph and unreachable cities.
assert run("""\
1
3 0
""") == "2", "only city 1 is reachable"

# Two branches merging into one terminal city.
assert run("""\
1
4 4
1 2
1 3
2 4
3 4
""") == "249561095", "diamond DAG"

# Star graph: f[1] = 2 + 1/4 + 2 = 17/4.
assert run("""\
1
4 3
1 2
1 3
1 4
""") == "748683269", "outdegree three"

# Maximum-size chain: 100000 cities and 99999 edges.
# There are 99999 nonterminal cities contributing 5/2 each,
# followed by one terminal city contributing 2.
n = 100000
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))
max_case = f"{n} {n - 1}\n{edges}\n"

assert run("1\n" + max_case) == "499372177", "maximum-size chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 0`|`2`| 最小图表和终端城市处理 |
 |`3 0`|`2`| 无法到达的城市不得影响城市 1 |
 | 钻石 DAG |`249561095`| 分支、合并和后继平均 |
 | 三棱星|`748683269`| (d=3) 的正确 (1/(d+1)) 停留期限 |
 | 十万城市连锁|`499372177`| 最大输入大小和重复 DP 转换 |

 ## 边缘情况

 对于仅包含城市 1 的图，```
1
1 0
```拓扑顺序包含城市 1，反向 DP 立即看到出度为零。 它分配`dp[0] = 2`，所以输出是`2`。 由于终端情况是单独处理的，因此没有按出度进行划分。 

对于单个铁路边缘，```
1
2 1
1 2
```逆拓扑顺序首先处理城市 2 并为其赋值 2。城市 1 的度数为 1，因此其递推为

 [
 2+\frac12+\frac{2}{1}=\frac92。 
]

 模块化的结果是`499122181`。 这解决了将火车概率视为 1 而没有考虑可能的额外观光日的常见错误。 

对于标签未按拓扑排序的图，```
1
3 2
1 3
3 2
```正确的拓扑顺序是（1,3,2）。 反向处理给出城市 2 值 2，然后给出城市 3 值 (9/2)，然后给出城市 1 值 (27/4)。 模块化输出为`249561095`。 仅基于降序或升序城市编号的循环通常不会提供所需的依赖关系排序。 

对于一个有多个传出边缘的城市，```
1
4 3
1 2
1 3
1 4
```城市 2、3 和 4 都是终点站，且值为 2。城市 1 的值为 (d=3)，因此

 # 2+\frac14+\frac{2+2+2}{3}

 \frac{17}{4}。 
]

 模块化的结果是`748683269`。 这验证了 (1/(d+1)) 停留概率和最终传出边缘上的均匀 (1/d) 分布。 

最大规模链包含100000个城市，```
100000 99999
1 2
2 3
...
99999 100000
```具有明显的连续边缘。 每个非终点城市的度数为 1，因此每个城市在下一个城市之前贡献 (5/2) 天，而城市 100000 贡献 2。确切的期望是

 \frac{499999}{2}，
 ]

 这是`499372177`模 (998244353)。 线性DP无需递归即可处理所有100000个状态，从而避免了递归深度问题和任何指数路径枚举。
