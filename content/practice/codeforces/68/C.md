---
title: "CF 68C - 同步相加速器"
description: "我们有一个关于顶点 1...n 的有向无环图。 对于每一对 i < j，从 i 到 j 恰好有一条有向边。 每个管道都有三个参数。 即使我们不想使用该管道，它也必须包含 l 和 h 单位之间的流量（含）。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 68
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 62"
rating: 2200
weight: 68
solve_time_s: 423
verified: true
draft: false
---

[CF 68C - 同步相加速器](https://codeforces.com/problemset/problem/68/C)

 **评分：** 2200
 **标签：** 暴力破解
 **求解时间：** 7m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个关于顶点的有向无环图`1...n`。 对于每对`i < j`，恰好有一个有向边`i`到`j`。 

每个管道都有三个参数。 它必须在`l`和`h`即使我们不想使用该管道，也包括流量单位。 如果通过管道的实际流量为正，我们支付启动成本`a`加上流量的平方。 如果流量为零，我们无需支付任何费用。 

燃料进入节点`1`并通过节点离开`n`。 每个中间节点必须保存流量，传入等于传出。 所有流量都是整数。 

在所有可行的流量分配中，我们首先要最小化到达节点的总量`n`。 在具有最小总流量的所有解决方案中，我们希望总成本尽可能最大。 

图表很小。`n ≤ 6`，所以边数最多为`15`。 每条边的容量最多为`5`。 这完全改变了问题的性质。 我们并不是在寻找复杂的多项式优化算法。 搜索空间足够小，使得边缘流上的暴力破解变得现实。 

尽管如此，对所有任务的简单暴力还是太大了。 每条边都可以取值`0...5`，所以在最坏的情况下有`6^15 ≈ 4.7e11`作业。 即使采取积极的修剪，也是没有希望的。 

小容量才是真正的关键。 通过网络的流量总量永远不会变大。 由于只有边离开节点`1`创建流量并且每个这样的边缘最多有容量`5`，进入整个图的总流量最多为`5 * (n-1) ≤ 25`。 

这意味着我们可以考虑节点平衡而不是独立的边缘选择。 

有一些微妙的边缘情况。 

第一个是下限甚至适用于非活动边缘。 考虑：```
3
1 2 0 2 0
2 3 3 5 0
1 3 0 5 0
```边缘`2 -> 3`必须至少携带`3`，所以节点`2`必须至少收到`3`。 但边缘`1 -> 2`最多可以携带`2`。 正确答案是：```
-1 -1
```仅检查已使用边缘上的容量的粗心实现将错误地接受网络。 

另一个陷阱是零流量解决方案。 例子：```
2
1 2 0 5 3
```我们可以通过唯一的边缘发送零个单位。 由于边缘不活动，因此成本也为零。 正确的输出是：```
0 0
```如果我们总是在边缘存在时添加激活成本，我们就会得到错误的答案。 

成本函数也以非直观的方式表现。 由于我们最大化平方和，因此将流分割到多个边可以增加总数，因为每个激活的边都会贡献自己的激活奖励。 例子：```
4
1 2 0 2 5
1 3 0 2 5
1 4 0 2 0
2 3 0 2 5
2 4 0 2 5
3 4 0 2 5
```假设最小可行总流量为`2`。 沿着一条路径发送两个单元所产生的激活边缘比将单元分割到不同路径上的激活边缘要少。 最佳答案是尽可能激活更多边缘。 

最后一个微妙之处是下界可以强制 DAG 内部出现类似于循环的行为。 由于图仅从较小的顶点到较大的顶点，因此循环是不可能的，但由于传出下限，中间顶点仍然可以被迫中继强制流。 

## 方法

 最直接的暴力就是给每条边独立赋值。 对于每条边，我们尝试之间的每个整数流`0`和`h`，拒绝违反下限或流量守恒的分配，然后计算总流量和成本。 

这是正确的，因为每个可行的解决方案都对应于一个边缘值的分配。 

问题在于搜索空间的大小。 和`15`边缘和`6`每条边的选择，我们大致得到`4.7e11`州。 即使每个状态占用一条CPU指令，这仍然是不可能的。 

图结构为我们提供了更好的思考问题的方式。 

对于每个顶点，除了`1`和`n`，一旦我们知道传入流量，流量守恒就决定了总的传出流量。 由于容量很小，进入任何节点的总量也很小。 

这表明对顶点和平衡进行动态规划。 

从左到右处理顶点。 当我们到达顶点时`v`，所有传入边进入`v`已经固定，因为它们来自较小的顶点。 它们的总和准确地确定了必须留下多少流出流量`v`。 

现在我们只需要在边之间分配所需的数量`v -> u`在哪里`u > v`，尊重下限和上限。 

可能的分布数量很少。 一个顶点最多有`5`输出边，每条边最多携带`5`。 总流出流量最多为`25`。 枚举所有分布变得可行。 

关键的观察是，一旦我们按顺序处理顶点，未来的决定就无法改变已处理顶点的平衡。 这将全球可行性问题转变为局部过渡问题。 

我们保持 DP 状态来描述每个未来顶点到目前为止已经积累了多少传入流。 处理顶点时`v`，我们知道它当前来自国家的收入金额。 我们枚举所有有效的传出任务并更新未来的余额。 

总状态空间保持可控，因为只有`5`未来的顶点和每个平衡最多`25`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 对所有边缘分配进行暴力破解 |$O(6^{15})$|$O(15)$| 太慢了|
 | DP 与顶点平衡 | 大致$O(\text{states} \times \text{transitions})$少于几百万次操作|$O(\text{states})$| 已接受 |

 ## 算法演练

 1.读取所有边并存储它们的下界`l`, 上限`h`，以及激活成本`a`。 
2.处理顶点后定义一个DP状态`1...v-1`。 

状态存储，对于每个未来的顶点`u ≥ v`，有多少传入流量已分配给`u`。 

由于边仅向前移动，因此未来的决策无法修改早期顶点的平衡。 
3. 在处理任何顶点之前，所有余额均为零。 
4.处理顶点时`v`，确定必须离开的流量。 

为了`v = 1`，这个数量不受限制，因为节点`1`是源头。 它的输出总数将成为我们指定的值。 

对于中间顶点，传出流量必须等于该状态中该顶点已经累积的传入流量。 
5. 枚举出边的每个可能的分配`v -> u`。 

每个边流必须位于`[l, h]`。 

对于中间顶点，分配的流出流量之和必须等于所需的流出量。 

对于顶点`1`，任何总计都是允许的，因为它是源。 
6. 对于每项作业，计算：

 - 增加的成本，
 - 额外的传入流对未来的顶点做出了贡献，
 - 最终到达节点的总流量`n`。 
7. 更新下一个顶点的 DP 状态。 

如果两条路达到相同状态且最终总流量相同，则保留较大的成本。 
8. 处理完所有顶点后，检查节点的状态`n`积累了一些流量。 

进入节点的金额`n`正是传送到同步相加速器的总量。 
9. 选择最小的可行总流量。 其中，选择最大成本。 

### 为什么它有效

 不变量是处理顶点后`1...v-1`，DP状态准确记录所有已经强制进入顶点的流`v...n`。 

由于图是非循环的并且边总是向前移动，因此未来的决策不能改变已处理顶点的平衡。 每个可行的全局流对应于DP期间的本地输出分配的一个序列，并且DP生成的每个序列满足所有守恒和容量约束。 

DP 探索每个顶点的输出流的所有可行分布。 由于转换保留了精确的平衡和容量，因此不会存在无效的解决方案。 由于每个有效解都可以逐个顶点重建，因此不会丢失任何可行解。 

## Python 解决方案```python
import sys
from collections import defaultdict
from itertools import product

input = sys.stdin.readline

def solve():
    n = int(input())

    l = [[0] * n for _ in range(n)]
    h = [[0] * n for _ in range(n)]
    a = [[0] * n for _ in range(n)]

    for _ in range(n * (n - 1) // 2):
        s, f, lo, hi, cost = map(int, input().split())
        s -= 1
        f -= 1

        l[s][f] = lo
        h[s][f] = hi
        a[s][f] = cost

    # state:
    # tuple of accumulated incoming flow for every vertex
    # dp[state] = maximum cost

    start = tuple([0] * n)
    dp = {start: 0}

    for v in range(n - 1):
        ndp = dict()

        targets = list(range(v + 1, n))

        ranges = [range(l[v][u], h[v][u] + 1) for u in targets]

        for state, cur_cost in dp.items():

            required = state[v]

            for flows in product(*ranges):

                total_out = sum(flows)

                # conservation for intermediate vertices
                if v != 0 and total_out != required:
                    continue

                new_state = list(state)

                add_cost = 0

                for idx, u in enumerate(targets):
                    f = flows[idx]
                    new_state[u] += f

                    if f > 0:
                        add_cost += a[v][u] + f * f

                new_state = tuple(new_state)

                value = cur_cost + add_cost

                if new_state not in ndp or ndp[new_state] < value:
                    ndp[new_state] = value

        dp = ndp

    best_flow = None
    best_cost = -1

    for state, cost in dp.items():
        flow = state[n - 1]

        if best_flow is None or flow < best_flow:
            best_flow = flow
            best_cost = cost
        elif flow == best_flow:
            best_cost = max(best_cost, cost)

    if best_flow is None:
        print("-1 -1")
    else:
        print(best_flow, best_cost)

solve()
```实现的核心思想是`state[i]`存储有多少传入流顶点`i`已经从处理过的顶点累积。 

处理顶点时`v`，所有传入边进入`v`已经固定，因为每个这样的边都源自一个较小的顶点。 这意味着`state[v]`是必须离开的确切金额`v`如果`v`是中间顶点。 

转换使用以下方式枚举所有可能的传出分配`itertools.product`。 这是有效的，因为每个边缘容量最多`5`并且最多有`5`传出边缘。 

条件```
if v != 0 and total_out != required:
```实现流量守恒。 顶点`1`被排除，因为它是源并且可能注入任意流。 

另一个微妙的点是激活成本：```
if f > 0:
    add_cost += a[v][u] + f * f
```如果边实际上带有正流量，我们只支付固定的激活成本。 

DP 仅存储每个状态的最大可实现成本。 如果两种不同的结构产生相同的累积余额，则未来的可能性变得相同，因此保持较大的成本支配较小的成本。 

## 工作示例

 ### 示例 1

 输入：```
2
1 2 1 2 3
```处理顶点`1`：

 | 之前声明 | 选择流程| 新状态 | 增加成本|
 | ---| ---| ---| ---|
 | (0,0) | (0,0) | 1 | (0,1)| 4 |
 | (0,0) | (0,0) | 2 | (0,2) | 7 |

 最终状态：

 | 最终流向节点2 | 成本|
 | ---| ---|
 | 1 | 4 |
 | 2 | 7 |

 最小可行输送流量为`1`，在这些状态中，最大成本是`4`。 

输出：```
1 4
```该跟踪显示了源顶点的不同处理方式。 允许在边缘容量内生成任意输出流。 

### 示例 2

 输入：```
3
1 2 0 2 0
1 3 0 5 0
2 3 3 5 0
```处理顶点`1`：

 | 流程 1->2 | 流程 1->3 | 之后的状态 |
 | ---| ---| ---|
 | 0 | 0 | (0,0,0) | (0,0,0) |
 | 1 | 0 | (0,1,0) | (0,1,0) |
 | 2 | 0 | (0,2,0) | (0,2,0) |
 | ... | ... | ... |

 现在处理顶点`2`。 

如果状态是`(0,0,0)`，所需的输出流量为`0`，但边缘`2->3`必须至少携带`3`。 

| 需要传出| 允许的边缘流| 有效的？ |
 | ---| ---| ---|
 | 0 | 3..5 | 3..5 没有 |
 | 1 | 3..5 | 3..5 没有 |
 | 2 | 3..5 | 3..5 没有 |

 没有国家能够幸存。 

输出：```
-1 -1
```这表明即使每个单独的边看起来局部有效，下限也会导致不可行性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 大致$O(S \cdot T)$|`S`是可达到平衡状态的数量，`T`是输出流组合的数量 |
 | 空间|$O(S)$| DP 为每个可达状态存储一个值 |

 实际上，限制很小。 最多有`15`边且每条边的容量最多为`5`。 可到达的状态数量保持在很小的范围内，并且该解决方案很容易适应`3s`Python 中的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import defaultdict
from itertools import product

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())

    l = [[0] * n for _ in range(n)]
    h = [[0] * n for _ in range(n)]
    a = [[0] * n for _ in range(n)]

    for _ in range(n * (n - 1) // 2):
        s, f, lo, hi, cost = map(int, input().split())
        s -= 1
        f -= 1

        l[s][f] = lo
        h[s][f] = hi
        a[s][f] = cost

    start = tuple([0] * n)
    dp = {start: 0}

    for v in range(n - 1):
        ndp = dict()

        targets = list(range(v + 1, n))
        ranges = [range(l[v][u], h[v][u] + 1) for u in targets]

        for state, cur_cost in dp.items():

            required = state[v]

            for flows in product(*ranges):

                total_out = sum(flows)

                if v != 0 and total_out != required:
                    continue

                new_state = list(state)

                add_cost = 0

                for idx, u in enumerate(targets):
                    f = flows[idx]
                    new_state[u] += f

                    if f > 0:
                        add_cost += a[v][u] + f * f

                new_state = tuple(new_state)

                value = cur_cost + add_cost

                if new_state not in ndp or ndp[new_state] < value:
                    ndp[new_state] = value

        dp = ndp

    best_flow = None
    best_cost = -1

    for state, cost in dp.items():
        flow = state[n - 1]

        if best_flow is None or flow < best_flow:
            best_flow = flow
            best_cost = cost
        elif flow == best_flow:
            best_cost = max(best_cost, cost)

    if best_flow is None:
        return "-1 -1"

    return f"{best_flow} {best_cost}"

# provided sample
assert run(
"""2
1 2 1 2 3
"""
) == "1 4", "sample 1"

# zero-flow solution
assert run(
"""2
1 2 0 5 3
"""
) == "0 0", "zero flow"

# impossible because of lower bounds
assert run(
"""3
1 2 0 2 0
1 3 0 5 0
2 3 3 5 0
"""
) == "-1 -1", "infeasible network"

# forcing relay through intermediate node
assert run(
"""3
1 2 2 2 1
1 3 0 0 0
2 3 2 2 1
"""
) == "2 10", "exact forced flow"

# activation-cost maximization
assert run(
"""3
1 2 0 1 5
1 3 0 2 0
2 3 0 1 5
"""
) == "0 0", "minimum flow dominates cost"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 下限为 1 的单边 |`1 4`| 基本正确性|
 | 下界为 0 的边 |`0 0`| 正确处理非活动边缘 |
 | 不可能的中继约束 |`-1 -1`| 导致不可行的下限 |
 | 精确的强制流经路径 |`2 10`| 流量守恒正确性 |
 | 竞争高成本航线|`0 0`| 词典优化，流量最小化优先 |

 ## 边缘情况

 再次考虑不可行的继电器情况：```
3
1 2 0 2 0
1 3 0 5 0
2 3 3 5 0
```后处理节点`1`, 最大流入流量节点`2`可以积累的是`2`。 

处理节点时`2`，守恒要求流出流量等于流入流量。 但边缘`2 -> 3`有下界`3`，所以每次转换至少需要`3`外出单位。 没有国家能够幸存。 DP自然排除了所有不可能的配置并返回`-1 -1`。 

现在考虑零流量情况：```
2
1 2 0 5 3
```DP 枚举流`0...5`在唯一的边缘。 流动`0`有效，因为它满足下界。 由于边缘处于非活动状态，因此不会添加激活成本。 最终答案变成`0 0`。 

一个常见的错误是只要存在边就增加激活成本，而不是仅在其流量为正时增加激活成本。 

最后，考虑最大化成本更喜欢激活更多边的情况：```
4
1 2 0 1 5
1 3 0 1 5
1 4 0 2 0
2 4 0 1 5
3 4 0 1 5
2 3 0 0 0
```假设我们想要总交付流量`2`。 

一种可能性是直接发送两个单位`1 -> 4`， 成本`4`。 

另一种可能性是分裂：`1 -> 2 = 1`,`2 -> 4 = 1`,`1 -> 3 = 1`,`3 -> 4 = 1`。 

这会激活四个昂贵的边，给出成本：```
(5+1) + (5+1) + (5+1) + (5+1) = 24
```DP 在同等平衡的状态之间保持较大的成本，因此它正确地更喜欢拆分配置。
