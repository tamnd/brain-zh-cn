---
title: "CF 102180F - \u0410\u0439\u043b\u0430\u043d\u0434\u043b\u044d\u043d\u0434"
description: "有 (n) 个岛屿，最初每个岛屿都有居民。 一些报告在两个岛屿之间增加了一座无向桥梁。 其他报告描述了 (u) 岛发生洪水，之后目前居住在 (u) 岛的所有居民都搬到了 (v) 岛。"
date: "2026-08-19T06:54:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102180
codeforces_index: "F"
codeforces_contest_name: "MSPU Training Contest 2018-2019"
rating: 0
weight: 102180
solve_time_s: 97
verified: true
draft: false
---

[CF 102180F - \u0410\u0439\u043b\u0430\u043d\u0434\u043b\u044d\u043d\u0434](https://codeforces.com/problemset/problem/102180/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有 (n) 个岛屿，最初每个岛屿都有居民。 一些报告在两个岛屿之间增加了一座无向桥梁。 其他报告描述了 (u) 岛发生洪水，之后目前居住在 (u) 岛的所有居民都搬到了 (v) 岛。 岛（u）本身并未被移除，因此与其相连的桥梁仍然可以使用。 

每一份报告之后，我们都需要最少数量的新桥梁，使所有目前有人居住的岛屿能够通过陆路相互到达。 现有的桥梁可以重复使用，并且可以在任意岛屿之间建造新的桥梁。 

考虑由所有桥形成的图。 假设恰好 (c) 个连通分量包含至少一个居民。 一个额外的桥可以合并两个这样的组件，并且 (c-1) 桥总是足以连接它们。 因此，整个问题简化为维护当前包含至少一名居民的连接组件的数量。 

这些约束是直接图遍历不合适的主要原因。 对于最多 (3\cdot10^5) 个岛屿和 (3\cdot10^5) 个报告，每次操作后重新计算连接的组件可能需要 (O(nq)) 工作，在最坏的情况下大约需要 (9\cdot10^{10}) 个顶点操作。 即使每个报告单次遍历也远远超出了一秒的限制所能支持的范围。 我们需要在接近恒定的摊销时间内处理每个报告。 

第一个微妙的情况是，岛屿可以变空，但不会从图中消失。 例如，```
2 1
2 1 2
```报告后唯一有人居住的岛屿是2号岛，所以答案是`0`。 从图中物理删除岛屿 1 的解决方案将使以后的桥梁操作变得尴尬或不正确，因为岛屿 1 可能会再次有人居住。 

第二个微妙的情况是在已经属于同一连接组件的两个岛屿之间移动居民。 例如，```
3 2
1 1 2
2 1 2
```第一份报告后，岛 1 和岛 2 形成一个组成部分，岛 3 是独立的。 洪水过后，1号岛的居民全部迁移到2号岛，但组成结构没有改变。 有人居住的组件仍然`{1,2}`和`{3}`，所以答案是`1 1`。 将每次洪水视为移除一个有人居住的组件的粗心实施将错误地产生`1 0`。 

第三种情况发生在洪水前岛屿空无一人的情况下。 例如，```
3 2
2 1 2
2 1 3
```第一次报告后，1 号岛空无一人，2 号岛有居民。 第二次洪水没有移动任何东西，所以状态没有改变。 正确答案是`1 1`。 实施必须从源头检查居民数量，而不是盲目地修改组件数量。 

当桥连接两个组件且其中一个为空时，会出现第四种情况。 例如，```
3 2
2 1 2
1 1 3
```洪水过后，只有2号岛有人居住。 岛屿 1 和岛屿 3 之间的桥梁连接两个空顶点，不影响有人居住的组件数量。 答案是`1 1`。 计算每个图形组件而不是仅计算包含居民的组件的解决方案在这里将失败。 

## 方法

 一个简单的解决方案将显式维护图表，并在每次报告后从所有当前有人居住的岛屿运行 DFS 或 BFS 以确定有多少连接的组件包含居民。 这是正确的，因为图遍历直接计算出重要的连接性。 

问题是重复工作。 具有 (n) 个顶点和最多 (q) 个添加边的图可以具有 (O(n+q)) 条存储边。 在每个 (q) 个报告之后运行完整遍历可能需要 (O(q(n+q)))，即 (O(q^2+nq))。 当 (n) 和 (q) 都等于 (3\cdot10^5) 时，这大约是 (9\cdot10^{10}) 次运算或更糟。 

暴力解决方案之所以有效，是因为它从头开始重新计算精确的图状态。 它失败了，因为桥只被添加，而从未被删除。 这种单调结构意味着我们不需要在每次桥接报告后重新发现连接。 

不相交集并集结构正好适合这种情况。 (u) 和 (v) 之间的每个桥都简单地合并它们的两个 DSU 集。 DSU 为我们提供了几乎恒定的摊销时间内任何岛屿的连通分量。 

我们仍然需要应对洪水。 关键的观察结果是居民不会影响图的连通性。 洪水只会改变有居民的顶点。 对于每个 DSU 组件，我们可以存储当前其中的居民总数。 然后从 (u) 到 (v) 的洪水会移除 (u) 部分的人口并将其添加到 (v) 的部分。 如果源组件变空，则已占用组件的数量就会减少。 如果目标组件为空并接收居民，则数量会增加。 

这给了我们一个全局计数器`active`，等于具有阳性群体的 DSU 成分的数量。 连接两个不同组件的桥减少了`active`当两个组件都居住时，其中一个恰好被占用。 洪水改变`active`仅当人口在不同组件之间交叉并且两个组件之一在空和非空之间变化时。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(q(n+q))) | (O(n+q)) | 太慢了 |
 | 最佳| (O((n+q)\alpha(n))) | (O(n+q)) | 已接受 |

 这里 (\alpha(n)) 是反阿克曼函数，它低于这些约束的任何实际相关常数。 

## 算法演练

 1. 最初每个岛屿都有居民，因此每个岛屿都是有人居住的 DSU 组件。 放`population[i] = 1`对于每个岛屿并初始化`active = n`。 因此，任何报告之前的答案都是 (n-1)。 
2. 桥梁报告`1 u v`，找到 DSU 根`u`和`v`。 如果它们已经相等，则桥不会改变任何内容。 如果不同，则合并两个分量并添加它们的人口总数。 如果两个组件都有正人口，则两个有人居住的组件已成为一个，因此减少`active`一个。 
3. 洪水报告`2 u v`， 读`x = population[u]`。 如果`x`为零，没有人移动，也没有什么可更新的。 必须在更改组件总数之前处理这种情况。 
4.如果`u`有居民，找到当前的 DSU 根`ru`和`rv`。 放`population[u]`为零并添加`x`到`population[v]`。 
5. 什么时候`ru`和`rv`不同，减去`x`从总人口中`ru`。 如果总数变为零，则源组件不再有人居住，因此减少`active`。 如果目标组件在接收之前人口数为零`x`， 增加`active`。 什么时候`ru == rv`，这两个操作都发生在同一个有人居住的组件内，所以`active`不会改变。 
6. 处理报告后，打印`active - 1`。 如果有`active`至少有居住的连接组件`active - 1`需要新的桥来连接它们，并且通过将组件连接到树中，许多桥就足够了。 

中心不变量是`population[root]`存储整个 DSU 组件中的居民总数，表示为`root`， 和`active`准确计算总体为正数的根。 桥梁操作通过合并人口总数来保持这一不变量。 洪水行动通过在适当的组成总数之间移动源人口来保护它。 由于 (c) 非空组件所需的附加桥的最小数量恰好是 (c-1)，`active - 1`始终是必需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())

    parent = list(range(n))
    size = [1] * n
    population = [1] * n

    active = n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    out = []

    for _ in range(q):
        t, u, v = map(int, input().split())
        u -= 1
        v -= 1

        if t == 1:
            ru = find(u)
            rv = find(v)

            if ru != rv:
                if size[ru] < size[rv]:
                    ru, rv = rv, ru

                if population[ru] > 0 and population[rv] > 0:
                    active -= 1

                parent[rv] = ru
                size[ru] += size[rv]
                population[ru] += population[rv]

        else:
            x = population[u]

            if x > 0:
                ru = find(u)
                rv = find(v)

                population[u] = 0

                if ru != rv:
                    population[ru] -= x

                    if population[ru] == 0:
                        active -= 1

                    if population[rv] == 0:
                        active += 1

                    population[rv] += x
                else:
                    population[ru] -= x
                    population[rv] += x

        out.append(str(active - 1))

    sys.stdout.write(" ".join(out))

if __name__ == "__main__":
    solve()
```这`parent`和`size`数组通过路径压缩和按大小联合来实现 DSU。 它们共同保证了查找和合并连接组件的平摊时间几乎恒定。 

这`population`每当数组表示组件总数时，它就由 DSU 根索引。 联合后，旧的子根不再用作组件代表，因此其总体值不需要保持有意义。 新根接收两个组成群体的总和。 

对于一场洪水，`population[u]`被故意解释为当前位于实体岛上的人口`u`， 尽管`population[root]`代表一个组成部分的总人口。 这种区别是实现中最微妙的部分。 在迁移人口之前，`x = population[u]`捕获岛上人口。 设置后`population[u] = 0`，各成分总计分别调整。 

什么时候`ru == rv`，将相同的量减去并添加到相同的组件中，其总数保持不变。 显式分支很有用，因为当总体从未离开其连接的组件时，它可以防止活动组件计数器被修改。 

输入顶点立即从从一开始的索引转换为从零开始的索引。 由于问题只有一个测试用例，因此输入循环精确处理`q`报告。 Python 整数具有任意精度，因此不存在总体总数溢出的问题。 

## 工作示例

 ### 示例 1

 输入仅包含桥接报告，因此仅当两个组件合并时每个组件的数量才会发生变化。 

| 报告| 运营| 组成人口 | 有源元件| 回答 |
 | ---| ---| ---| ---| ---|
 | 1 | 桥1-2 |`{1,2}:2`,`{3}:1`,`{4}:1`,`{5}:1`| 4 | 3 |
 | 2 | 桥 2-3 |`{1,2,3}:3`,`{4}:1`,`{5}:1`| 3 | 2 |
 | 3 | 桥1-3 | 不变| 3 | 2 |
 | 4 | 桥 4-5 |`{1,2,3}:3`,`{4,5}:2`| 2 | 1 |
 | 5 | 桥 1-4 |`{1,2,3,4,5}:5`| 1 | 0 |

 第三座桥是多余的，因为岛 1 和岛 3 已经属于同一组件。 这说明了为什么 DSU 合并必须首先比较两个根。 

### 示例 2

 这里根本没有桥梁。 每个岛屿最初都会形成自己的图形组件，洪水只会在岛屿之间移动居民。 

| 报告| 运营| 非空岛| 有源元件| 回答 |
 | ---| ---| ---| ---| ---|
 | 1 | 洪水1-2 | 2、3、4、5 | 4 | 3 |
 | 2 | 洪水2-1 | 1、3、4、5 | 4 | 3 |
 | 3 | 洪水1-3 | 3, 4, 5 | 3 | 2 |
 | 4 | 洪水5-4 | 3, 4 | 2 | 1 |
 | 5 | 洪水4-3 | 3 | 1 | 0 |
 | 6 | 洪水3-1 | 1 | 1 | 0 |

 第二份报告将 2 号岛上积累的居民移回 1 号岛。有人居住的部分数量仍为 4，因为一个被占领的岛屿变得空荡荡，而另一个则被占领。 第五份报告仅留下 3 号岛被占领，最终答案为零。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((n+q)\alpha(n))) | 每个报告执行恒定数量的 DSU 操作，并且 DSU 操作几乎是恒定的摊销时间。 |
 | 空间| (O(n)) | (O(n)) | 父数组、大小数组和总体数组均包含 (n) 个值，而输出包含 (q) 个值。 |

 对于 (n,q\leq3\cdot10^5)，算法在每个报告中仅执行少量 DSU 操作。 这完全在预期的复杂性范围内，而暴力遍历方法在最坏的情况下将需要数百亿次操作。 存储的数组也与岛的数量成线性，并且输出缓冲区与报告的数量成线性。 

## 测试用例```python
import sys
import io

def solve_data(inp: str) -> str:
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    q = next(it)

    parent = list(range(n))
    size = [1] * n
    population = [1] * n
    active = n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    out = []

    for _ in range(q):
        t = next(it)
        u = next(it) - 1
        v = next(it) - 1

        if t == 1:
            ru = find(u)
            rv = find(v)

            if ru != rv:
                if size[ru] < size[rv]:
                    ru, rv = rv, ru

                if population[ru] > 0 and population[rv] > 0:
                    active -= 1

                parent[rv] = ru
                size[ru] += size[rv]
                population[ru] += population[rv]

        else:
            x = population[u]

            if x:
                ru = find(u)
                rv = find(v)

                population[u] = 0

                if ru != rv:
                    population[ru] -= x

                    if population[ru] == 0:
                        active -= 1

                    if population[rv] == 0:
                        active += 1

                    population[rv] += x

        out.append(str(active - 1))

    return " ".join(out)

# Provided sample 1
sample1 = """\
5 5
1 1 2
1 2 3
1 1 3
1 4 5
1 1 4
"""
assert solve_data(sample1) == "3 2 2 1 0", "sample 1"

# Provided sample 2
sample2 = """\
5 6
2 1 2
2 2 1
2 1 3
2 5 4
2 4 3
2 3 1
"""
assert solve_data(sample2) == "3 3 2 1 0 0", "sample 2"

# Provided sample 3
sample3 = """\
9 11
1 1 2
1 3 4
1 5 6
2 6 4
2 5 3
1 7 8
1 1 8
1 5 9
2 9 5
2 1 2
2 1 3
"""
assert solve_data(sample3) == "7 6 5 5 4 3 2 2 2 2 2", "sample 3"

# Minimum-size graph, with a flood and a bridge.
case_min = """\
2 3
2 1 2
1 1 2
2 2 1
"""
assert solve_data(case_min) == "0 0 0", "minimum size"

# Empty-source floods and a bridge through empty islands.
case_empty = """\
3 4
2 1 2
2 1 3
1 1 3
2 2 1
"""
assert solve_data(case_empty) == "1 1 1 0", "empty source"

# Redundant bridge and flood inside the same component.
case_same_component = """\
3 4
1 1 2
2 1 2
1 2 3
2 2 3
"""
assert solve_data(case_same_component) == "1 1 0 0", "same component"

# Boundary-sized generated test.
n = 300000
q = 300000
parts = [f"{n} {q}"]
parts.extend(["2 1 2"] * q)
case_large = "\n".join(parts) + "\n"
expected_large = " ".join(["299998"] + ["299998"] * (q - 1))
assert solve_data(case_large) == expected_large, "large boundary case"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 3`洪水和一座桥|`0 0 0`| 最小岛屿数量和人口反复流动|
 |`3 4`空源洪水|`1 1 1 0`| 洪水来自空岛和空顶点之间的桥梁|
 |`3 4`与连接对 |`1 1 0 0`| 人口在现有 DSU 组件和冗余连接内移动 |
 |`n=q=300000`洪水频发|`299998`重复| 最大输入大小、性能和同一源上的重复操作 |

 ## 边缘情况

 输入```
2 1
2 1 2
```从两个独立的有人居住的组件开始。 洪水将 1 号岛的单个居民移至 2 号岛，因此源组件变空，而目标组件仍然有人居住。`active`从 2 变为 1，产生`active - 1 = 0`。 物理岛1保留在DSU中，这是必要的，因为它可以参与以后的桥操作。 

为了```
3 2
2 1 2
2 1 3
```第一次洪水将 1 号岛的人口迁移到 2 号岛。第二次洪水从 1 号岛开始，该岛的人口现在为零。 该算法立即退出洪水更新，留下`active = 2`贯穿第二次报告。 输出是`1 1`。 

为了```
3 2
1 1 2
2 1 2
```该桥首先创建一个包含岛屿 1 和 2 的组件，人口为 2。 随后洪水将 1 号岛的人口迁移到 2 号岛，但两个岛仍位于同一组成部分内。 组成人口仍然是两个，并且`active`停留在 2 是因为 3 号岛是另一个有人居住的区域。 输出是`1 1`。 

为了```
3 2
2 1 2
1 1 3
```第一份报告清空了 1 号岛，仅留下 2 号岛有人居住。 第二个报告将空岛 1 和 3 连接成一个不包含居民的图形组件。 DSU 合并发现两个组成部分的总体都为零，因此它不会改变`active`。 输出保持不变`1 1`。 

该算法还处理已连接岛屿之间的桥梁。 在示例 1 中，第三份报告是`1 1 3`，但岛屿 1 和岛屿 3 通过岛屿 2 连接。它们的 DSU 根相等，因此人口总数或活跃成分计数不会改变。 答案依然存在`2`。 

最后，同一对岛屿之间的多座桥梁是无害的。 DSU 将同一组件中已有的顶点之间的每个后续桥视为无操作。 这与图语义相匹配，因为重复的桥不会创建新的连接组件，也无法减少所需的附加桥的数量。
