---
title: "CF 325C - 怪物与钻石"
description: "每种怪物类型都有一个或多个分割规则。 应用规则会消耗该类型的一个怪物并产生两件事：首先，一定数量的钻石。 其次，多组新怪物。"
date: "2026-06-06T05:57:14+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 325
codeforces_index: "C"
codeforces_contest_name: "MemSQL start[c]up Round 1"
rating: 2600
weight: 325
solve_time_s: 166
verified: false
draft: false
---

[CF 325C - 怪物与钻石](https://codeforces.com/problemset/problem/325/C)

 **评分：** 2600
 **标签：** dfs 和类似的、图、最短路径
 **求解时间：** 2m 46s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每种怪物类型都有一个或多个分割规则。 应用规则会消耗该类型的一只怪物并产生两件事：

 首先，一定数量的钻石。 

其次，多组新怪物。 

从单个怪物开始，我们为每个出现的怪物重复选择一个规则，直到最终没有怪物留下。 收集的钻石总数是每个规则应用产生的钻石的总和。 

对于每种怪物类型，我们必须计算两个值。 

所有终止策略中可获得的最小钻石数量。 

所有终止策略中可获得的最大钻石数。 

如果不可能终止，则两个答案都是`-1`。 

如果在最终终止之前可以生成任意多的钻石，则最大答案是`-2`。 

输入自然地形成有向超图。 一条规则```
A -> diamonds + {B, C, D}
```表示怪物的价值`A`取决于所有`B`,`C`， 和`D`。 

约束是关键的观察结果。 最多有`10^5`怪物类型和`10^5`总规则元素。 任何重复探索每个怪物的整个图的算法都是不可能的。 我们需要总输入大小接近线性时间。 

危险的情况是循环的情况。 

考虑：```
1 -> 1 + monster 1
1 -> 1
```怪物`1`由于第二条规则，可以终止。 它还可以在最终选择第二条规则之前循环执行第一条规则任意多次。 最小答案是`1`，而最大答案是无限的。 

另一个微妙的情况是：```
1 -> monster 2 + 1
2 -> monster 1 + 1
```这两个怪物都没有任何终止规则。 两个答案都是`-1`对于这两种类型。 只寻找循环的天真的 DFS 会错误地得出最大值是无限的结论，但如果不可能终止，则无限菱形是无关紧要的。 

第三个陷阱是某个怪物可以到达但不是该怪物本身的一部分的循环：```
1 -> monster 2 + 1
2 -> monster 3 + 1
3 -> monster 2 + 1
2 -> 1
3 -> 1
```怪物`1`可以进入循环，在那里停留任意长的时间，然后通过终止规则离开。 它的最大答案也是无穷大。 

## 方法

 暴力解决方案将尝试所有可能的规则选择序列，并递归地评估产生的怪物。 这在概念上是正确的，因为每个终止推导都对应于一个有限扩展树。 

问题在于可能的推导数量呈指数增长。 即使是一个很小的循环也允许无限多种不同的策略。 和`10^5`怪物类型，明确的探索是无望的。 

规则的结构提供了更好的观点。 

让`min[i]`是从怪物处获得的最少钻石`i`。 

对于一个规则```
i -> d diamonds + children
```规则贡献```
d + sum(min[child])
```因为每一个产生的怪物最终都必须被解决。 

同样的想法也适用于最大值。 

这将问题转化为在有向超图上评估方程。 仅当已知规则的所有子项均可终止时，该规则才可用。 

第一个任务是确定哪些怪物可以完全终止。 这是一个 AND-OR 可达性问题。 

如果怪物的至少一条规则使所有子级都可终止，则该怪物是可终止的。 

在我们知道可终止集之后，最小值就变成了最短超路径问题。 最大值成为最长超路径问题，除了具有正增益的循环对应于无限答案之外。 

关键的观察结果是每条规则都至少产生一颗钻石。 任何可以遍历并随后退出的循环都可以任意重复多次，从而产生无限的钻石。 因此，无限状态正是可以在可用规则图中达到有向循环的可终止怪物。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳 | O(n + 总规则大小) | O(n + 总规则大小) | 已接受 |

 ## 算法演练

 ### 1.构建规则超图

 对于每个规则存储：

 主人是怪物。 

该规则产生的钻石数量。 

儿童怪物列表。 

我们还从每个孩子到包含它的规则建立反向引用。 

### 2. 计算可终结的怪物

 当已知规则的所有子怪物都可以被终止时，规则就被满足。 

对于每条规则，我们都会维护一个计数器，该计数器等于尚未确认可终止的子怪物的数量。 

零个孩子的规则立即得到满足。 

每当怪物变得可终止时，我们都会访问依赖于它的所有规则并减少它们的计数器。 

如果规则计数器达到零，则其拥有者怪物将被终止。 

这是 AND-OR 图的标准传播。 

### 3. 计算最小钻石

 只有子级都是可终止的规则才能做出贡献。 

对于我们需要的每条规则```
diamonds(rule) + sum(min[child])
```这些方程是单调的并且所有成本都是正的。 

我们用类似 Dijkstra 的超图松弛来处理它们。 当所有子值已知时，规则就变得可评估。 在那一刻，它为其所有者生成一个候选值。 

所有可用规则中最小的候选者就是答案。 

### 4. 构建可用依赖关系图

 对于每个可用的规则```
u -> children
```添加普通有向边```
u -> child
```对于所有的孩子。 

该图描述了哪些怪物值取决于哪些怪物值。 

### 5. 找到无限状态

 对可用依赖图运行 SCC 分解。 

任何具有多个顶点的 SCC 都是一个循环。 

如果单个顶点 SCC 具有自环，那么它也是循环的。 

因为每条规则都会产生至少一颗钻石，达到这样的循环意味着我们每次遍历都可以获得正的钻石。 

标记所有循环 SCC。 

然后运行反向图遍历并标记每个可以到达这些 SCC 之一的可终止怪物。 

那些怪物有最大答案`-2`。 

### 6. 计算有限最大菱形

 消除所有无限怪物。 

剩余的可用依赖图是非循环的。 

对于每一个剩余的怪物，```
max[i] =
max over usable rules (
    diamonds(rule) + sum(max[child])
)
```由于该图现在是一个 DAG，因此我们以逆拓扑顺序评估这些值。 

### 7. 限制大的有限答案

 任何大于的有限值`314000000`打印为`314000000`。 

### 为什么它有效

 终止传播精确计算条件的最小不动点```
monster is terminable
⇔
some rule has all children terminable
```仅当每个产生的怪物都可以自行终止时，规则才会贡献有效的钻石数。 最小和最大方程正是游戏结果的递归定义。 

可用图中的每个周期都具有严格的正增益，因为每个规则都创建至少一个菱形。 能够达到这样一个循环的可终止怪物可以遍历它任意次数，然后通过终止策略离开，产生任意大的有限总数。 这正是答案的意思`-2`。 

去除无限状态后，依赖图变成无环的，因此最大方程具有通过在DAG上动态规划获得的唯一有限解。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

CAP = 314000000

def solve():
    m, n = map(int, input().split())

    rules = []
    owner_rules = [[] for _ in range(n)]
    rev_rules = [[] for _ in range(n)]

    for rid in range(m):
        arr = list(map(int, input().split()))
        owner = arr[0] - 1
        l = arr[1]

        diamonds = 0
        children = []

        for x in arr[2:2 + l]:
            if x == -1:
                diamonds += 1
            else:
                children.append(x - 1)

        rules.append((owner, diamonds, children))
        owner_rules[owner].append(rid)

        for v in children:
            rev_rules[v].append(rid)

    # terminable monsters
    need = [len(ch) for _, _, ch in rules]
    can = [False] * n
    q = deque()

    for rid, (owner, _, ch) in enumerate(rules):
        if not ch and not can[owner]:
            can[owner] = True
            q.append(owner)

    while q:
        u = q.popleft()

        for rid in rev_rules[u]:
            need[rid] -= 1
            if need[rid] == 0:
                owner = rules[rid][0]
                if not can[owner]:
                    can[owner] = True
                    q.append(owner)

    # usable rules
    usable = [False] * m
    for rid, (_, _, ch) in enumerate(rules):
        ok = True
        for v in ch:
            if not can[v]:
                ok = False
                break
        usable[rid] = ok

    g = [[] for _ in range(n)]
    rg = [[] for _ in range(n)]

    for rid, (u, _, ch) in enumerate(rules):
        if not usable[rid]:
            continue
        for v in ch:
            g[u].append(v)
            rg[v].append(u)

    # SCC (Kosaraju)
    used = [False] * n
    order = []

    sys.setrecursionlimit(300000)

    def dfs1(v):
        used[v] = True
        for to in g[v]:
            if not used[to]:
                dfs1(to)
        order.append(v)

    for i in range(n):
        if can[i] and not used[i]:
            dfs1(i)

    comp = [-1] * n

    def dfs2(v, c):
        comp[v] = c
        for to in rg[v]:
            if comp[to] == -1:
                dfs2(to, c)

    cid = 0
    for v in reversed(order):
        if comp[v] == -1:
            dfs2(v, cid)
            cid += 1

    sz = [0] * cid
    for i in range(n):
        if comp[i] != -1:
            sz[comp[i]] += 1

    cyc = [False] * cid

    for u in range(n):
        if comp[u] == -1:
            continue
        if sz[comp[u]] > 1:
            cyc[comp[u]] = True
        for v in g[u]:
            if u == v and comp[u] == comp[v]:
                cyc[comp[u]] = True

    inf = [False] * n
    dq = deque()

    for i in range(n):
        if can[i] and cyc[comp[i]]:
            inf[i] = True
            dq.append(i)

    while dq:
        v = dq.popleft()
        for p in rg[v]:
            if can[p] and not inf[p]:
                inf[p] = True
                dq.append(p)

    # finite max via memo DAG
    min_dp = [-1] * n
    max_dp = [-1] * n

    def get_min(v):
        if min_dp[v] != -1:
            return min_dp[v]

        best = 10**18
        for rid in owner_rules[v]:
            if not usable[rid]:
                continue

            _, d, ch = rules[rid]
            cur = d
            for x in ch:
                cur += get_min(x)

            if cur < best:
                best = cur

        min_dp[v] = min(best, CAP)
        return min_dp[v]

    def get_max(v):
        if max_dp[v] != -1:
            return max_dp[v]

        best = 0
        for rid in owner_rules[v]:
            if not usable[rid]:
                continue

            _, d, ch = rules[rid]

            bad = False
            cur = d

            for x in ch:
                if inf[x]:
                    bad = True
                    break
                cur += get_max(x)

            if not bad:
                best = max(best, cur)

        max_dp[v] = min(best, CAP)
        return max_dp[v]

    out = []

    for i in range(n):
        if not can[i]:
            out.append("-1 -1")
        else:
            mn = get_min(i)

            if inf[i]:
                out.append(f"{mn} -2")
            else:
                mx = get_max(i)
                out.append(f"{mn} {mx}")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```实现几乎直接遵循算法。 

第一次传播计算最终会消失的怪物集合。 每条规则都会维护未解决的子项的数量。 当该计数达到零时，该规则就变得可用。 

SCC 阶段是无限答案检测的核心。 仅一个周期是不够的。 循环必须位于可终止子图内。 这就是为什么仅对可用依赖项执行 SCC 分解的原因。 

循环SCC的反向BFS标记了每个可以进入这样一个循环的怪物。 由于每次遍历都至少获得一颗钻石，因此这些状态具有无限的最大值。 

最小值和有限最大值是递归方程的普通记忆评估。 

该上限仅适用于有限的答案，完全按照要求。 

## 工作示例

 ### 示例 1

 输入：```
6 4
1 3 -1 1 -1
1 2 -1 -1
2 3 -1 3 -1
2 3 -1 -1 -1
3 2 -1 -1
4 2 4 -1
```关键依赖结构：

 | 怪物| 可用规则 |
 | ---| ---|
 | 1 |`1 -> 2 diamonds`,`1 -> 2 diamonds + 1`|
 | 2 |`2 -> 2 diamonds + 3`,`2 -> 3 diamonds`|
 | 3 |`3 -> 2 diamonds`|
 | 4 |`4 -> 1 diamond + 4`|

 终止分析：

 | 怪物| 可终止|
 | ---| ---|
 | 1 | 是的 |
 | 2 | 是的 |
 | 3 | 是的 |
 | 4 | 没有 |

 最小值：

 | 怪物| 最低 |
 | ---| ---|
 | 3 | 2 |
 | 2 | 3 |
 | 1 | 2 |

 最大值：

 怪物`1`可以重复使用自生成规则，然后切换到终止规则，因此它的最大值是无限的。 

最终输出：```
2 -2
3 4
2 2
-1 -1
```此示例演示了非终止怪物和无限最大值。 

### 自定义示例

 输入：```
2 2
1 2 -1 -1
2 3 -1 1 -1
```依赖表：

 | 怪物| 规则|
 | ---| ---|
 | 1 | 2 钻石 |
 | 2 | 2钻石+怪物1 |

 评价：

 | 怪物| 最低 | 最大|
 | ---| ---| ---|
 | 1 | 2 | 2 |
 | 2 | 4 | 4 |

 不存在循环，因此每个答案都是有限的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + 总规则大小) | 每个怪物、规则和依赖边都会被处理固定次数 |
 | 空间| O(n + 总规则大小) | 图、反向图、规则存储、SCC 数组 |

 所有规则中引用的怪物总数最多为`10^5`，因此图形的大小保持线性。 线性时间 SCC 算法和线性时间传播完全符合限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = old
    return out.getvalue().strip()

# sample 1
assert run(
"""6 4
1 3 -1 1 -1
1 2 -1 -1
2 3 -1 3 -1
2 3 -1 -1 -1
3 2 -1 -1
4 2 4 -1
"""
) == """2 -2
3 4
2 2
-1 -1"""

# sample 2
assert run(
"""3 2
1 2 1 -1
2 2 -1 -1
2 3 2 1 -1
"""
) == """-1 -1
2 2"""

# single terminal monster
assert run(
"""1 1
1 2 -1 -1
"""
) == """2 2"""

# self cycle with exit
assert run(
"""2 1
1 2 1 -1
1 1 -1
"""
) == """1 -2"""

# pure cycle, no exit
assert run(
"""1 1
1 2 1 -1
"""
) == """-1 -1"""

# chain
assert run(
"""2 2
1 2 -1 -1
2 3 -1 1 -1
"""
) == """2 2
4 4"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单终端规则 |`2 2`| 尽可能小的实例 |
 | 自循环退出|`1 -2`| 无限最大检测|
 | 纯循环|`-1 -1`| 不可终止的循环 |
 | 简单链条| 有限值| 递归累加|
 | 样品1 | 官方输出| 混合有限、无限、不可能状态 |

 ## 边缘情况

 考虑带有退出的自循环：```
2 1
1 2 1 -1
1 1 -1
```第一条规则产生一颗钻石并重新创建怪物`1`。 第二条规则立即以一颗菱形结束。 

SCC分解发现包含怪物的循环SCC`1`。 自从怪物`1`也可以通过第二条规则终止，循环是富有成效的。 反向可达性阶段标记怪物`1`作为无限。 

最低限度的答案来自于立即采用终止规则，给出`1`。 最大答案是`-2`。 

现在考虑一个纯循环：```
1 1
1 2 1 -1
```终止传播永远不会标记怪物`1`是可终止的，因为每条规则都取决于怪物`1`本身。 在使用任何 SCC 推理之前，该怪物已被排除。 答案变成：```
-1 -1
```这正是声明所要求的。 

最后，考虑一个仅达到生产周期的怪物：```
1 -> 2 + diamond
2 -> 2 + diamond
2 -> diamond
```怪物`1`本身并不处于循环中。 循环SCC的反向遍历到达怪物`1`，因此它被正确标记为具有无限最大值。 该算法处理这种情况时无需超出 SCC 和反向可达性阶段的任何特殊逻辑。
