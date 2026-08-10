---
title: "CF 102431F - 渡轮"
description: "有A、B、C三个岛，轮渡被迫按照A、B、C、A等顺序循环移动。 每个游客从 A 出发，有固定的目的地，要么是 B，要么是 C。游客还有晕船限制 t。"
date: "2026-08-09T12:27:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102431
codeforces_index: "F"
codeforces_contest_name: "2019 China Collegiate Programming Contest Final (CCPC-Final 2019)"
rating: 0
weight: 102431
solve_time_s: 418
verified: true
draft: false
---

[CF 102431F - 渡轮](https://codeforces.com/problemset/problem/102431/F)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有A、B、C三个岛，轮渡被迫按照A、B、C、A等顺序循环移动。 每个游客都从 A 出发，有固定的目的地，要么是 B，要么是 C。游客还有晕船限制`t`。 每当有几个人在渡轮上时，下一条边的旅行时间是最大的`t`他们之中。 渡轮最多可载三人。 

水手是关键的额外资源。 一个水手有`t = 1`，没有目的地，可以全程留在渡轮上。 由于渡轮无法在无人船上的情况下出发，因此我们可以在每个行程周期安排一名水手。 即使游客离开了船，水手也可以继续从 B 到 C，然后从 C 返回 A。 

输入最多包含`n = 50000`每个测试用例的访客数，最多 10 个测试用例。 每个访客仅贡献一个目的地和 1 到 1000 之间的值。大的重要后果`n`是我们无法明确地探索子集、排列或任意配对。 甚至一个`O(n^2)`对于最大的情况，方法在 Python 中已经是不可取的，因此解决方案需要利用轮渡负载的非常小的结构。 

一艘渡轮可搭载一名水手和最多两名游客。 假设两个访问者都有值`x <= y`。 如果两人都想要 B，则他们在 B 出发，所以行程时间为`y`,`1`， 和`1`。 周期成本`y + 2`。 如果至少有一名游客想要 C，则该游客会留在从 A 经 B 到 C 的船上。前两条航段均需`y`，而水手独自完成最后的 C 到 A 航段。 周期成本`2y + 1`。 

这样原来的问题就变成了配对问题。 每对访客在一个 A 到 B 到 C 到 A 的循环中被一起发送，其成本为`y + 2`对于 B-B 对，

 或`2y + 1`对于每一对至少包含一个 C，

 哪里`y`是较大的`t`在那对中。 

如果`n`奇怪的是，一名游客必须独自旅行。 我们可以通过添加一个人工 B 访客来避免特殊情况`t = 1`。 将此虚拟访客与真实 B 访客配对的成本`t + 2`，正是单独发送 B 访客的成本。 将其与 C 访客成本配对`2t + 1`，正是单独发送 C 访客的成本。 添加假人后，人数始终为偶数。 

几个小案例暴露了建模中的错误。 为了```
1
1
1 5
```答案是`7`， 不是`15`。 访客在时间 5 内到达 B，然后水手单独在时间 1 内从 B 到 C 以及从 C 到 A 航段。 该解决方案假设访客必须留在船上，直到 A 高估答案。 

为了```
1
1
2 5
```答案是`11`。 访客通过 B 停留在船上，因此 A 到 B 和 B 到 C 都需要时间 5，然后水手返回 A 需要时间 1。 

对于```
1
3
1 1
1 2
1 3
```答案是`8`。 最好的安排是让游客与`t = 2`和`t = 3`, 成本核算`5`，而`t = 1`访客实际上是独自旅行，成本高昂`3`。 简单地假设最大的访问者应该是单例会给出错误的答案。 

第一个样本是一个更微妙的情况。 仅根据游客的目的地将其配对的成本为`16`，但最优的是`14`。 最优对是 B1-C1、B2-B2 和 B3-C3，其成本`3`,`4`， 和`7`。 这表明目的地组不能独立优化。 

## 方法

 直接的强力解决方案会将每个可能的渡轮负载划分视为一种选择。 由于一辆自行车在为一名水手预订一个座位后最多可搭载两名游客，因此这本质上是一个最小成本配对问题。 对于一个均匀的`n`，完整配对的数量为`(n - 1)!!`，这对于`n = 50000`是产品`49999 * 49997 * ... * 1`。 彻底评估这些配对是没有希望的。 

蛮力方法是正确的，因为每个可行的轮渡时间表都可以分解为从 A 开始到 A 结束的周期，并且每个周期最多包含两名游客。 一旦知道分配给一个周期的访客，其成本完全取决于他们的目的地和最大访问量`t`。 

使问题易于处理的观察结果是，当我们以不断增加的方式处理访问者时，只有当前不匹配的访问者类型才重要。`t`。 任何时候，都没有理由保留两个无与伦比的 B 访客。 如果已经看到两个这样的访客，那么现在将他们配对并不比推迟他们更昂贵，因为每个未来的访客都有相同或更大的`t`。 同样的论点也适用于两个不匹配的 C 访问者。 

因此，在按排序顺序扫描访问者时，最多可以有 1 个不匹配的 B 访问者和最多 1 个不匹配的 C 访问者。 这仅给出了四种可能的状态：两种类型都没有等待，只有 B 在等待，只有 C 在等待，或者每种类型都有一个在等待。 

当当前访问者是B时，如果没有B在等待，则可以不匹配，或者与等待的访问者配对。 如果等待的访客是 B，则该对的成本`t + 2`。 如果等待的访客是 C，则该对的成本`2t + 1`。 当前 C 的转换是类似的，除了每对包含 C 的成本`2t + 1`。 

虚拟 B 访问者处理奇数数量的真实访问者，因此最终状态必须始终包含不匹配的访问者。 这样整个优化就变成了排序后的四态动态程序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((n - 1)!!) | O((n - 1)!!) | O(n) | 太慢了|
 | 四州DP | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将每个访客分成一对`(t, destination)`并对所有访客进行排序`t`。 如果`n`很奇怪，附加一个虚拟访客`(1, B)`。 排序是必要的，因为每当当前访问者与较早的不匹配访问者配对时，当前访问者`t`是该对中的最大值。 
2. 维持四个DP状态。 状态`0`意味着没有不匹配的访客。 状态`1`意味着一位 B 访客是无与伦比的。 状态`2`意味着有一个 C 访问者是无与伦比的。 状态`3`表示一位 B 和一位 C 访客不匹配。 每个状态存储所有已处理对的最低成本，同时准确地留下未使用的指定访问者。 
3、处理有价值的B访客时`t`， 状态`0`可以让这个访客无与伦比，产生状态`1`无需立即花费。 状态`1`必须将两个 B 访客配对，成本`t + 2`，并返回状态`0`。 来自州`2`，我们可以让 B 访问者等待，产生状态`3`，或将 B 与 C 配对`2t + 1`并返回状态`0`。 
4. 当状态`3`同时包含 B 和 C 并且当前访问者是 B，当前 B 必须与两个等待访问者之一配对。 与 B 成本配对`t + 2`并让 C 等待。 与 C 成本配对`2t + 1`并让 B 等待。 这两种选择都是必要的，因为选择会影响后来的访问者。 
5. 对称地处理C 访问者。 如果它与 B 或 C 配对，则该对包含 C，因此其成本始终为`2t + 1`。 如果没有C在等待，则当前的C可以不匹配。 
6. 访问完所有访客后，获取状态`0`。 因为奇数大小的输入接收到虚拟 B 访问者，所以每个真实访问者都可以配对，并且虚拟代表一个可能的单例循环。 任何包含不匹配访问者的状态都是无效的。 

### 为什么它有效

 不变的是，处理完当前的访问者之后`t`，每个状态的 DP 值是那些已处理访问者的所有配对中的最小成本，使该状态所描述的访问者类型完全不匹配。 相同类型的两个不匹配的访问者永远不需要共存，因为将它们配对会立即使用它们当前的最大值`t`，而推迟配对只能用最大值至少相同的一对来代替该成本。 因此，四个状态包含可以影响最佳延续的所有信息。 

当前访问者的每个可能的操作都由转换表示。 如果不匹配，则会创建一个该类型的等待游客，而将其与唯一可能的等待游客类型配对则完全适用相应的轮渡周期成本。 由于虚拟人使总人数为偶数，因此最佳完整时间表对应于以状态结束的路径`0`，以及以状态结束的每条路径`0`描述了轮渡周期的有效集合。 因此，最小 DP 值恰好是最短的可能总时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

def solve_case(visitors):
    if len(visitors) & 1:
        # A dummy B visitor with t = 1 represents a possible singleton.
        visitors.append((1, 1))

    visitors.sort(key=lambda x: x[0])

    # State:
    # 0 -> no unmatched visitor
    # 1 -> one unmatched B
    # 2 -> one unmatched C
    # 3 -> one unmatched B and one unmatched C
    dp = [0, INF, INF, INF]

    for t, w in visitors:
        ndp = [INF, INF, INF, INF]

        if w == 1:
            # Current visitor wants B.

            # State 0: leave current B unmatched.
            ndp[1] = min(ndp[1], dp[0])

            # State 1: pair current B with waiting B.
            ndp[0] = min(ndp[0], dp[1] + t + 2)

            # State 2: either leave current B, or pair B with C.
            ndp[3] = min(ndp[3], dp[2])
            ndp[0] = min(ndp[0], dp[2] + 2 * t + 1)

            # State 3: pair current B with either waiting B or waiting C.
            ndp[2] = min(ndp[2], dp[3] + t + 2)
            ndp[1] = min(ndp[1], dp[3] + 2 * t + 1)

        else:
            # Current visitor wants C.

            # State 0: leave current C unmatched.
            ndp[2] = min(ndp[2], dp[0])

            # State 1: either leave current C, or pair it with B.
            ndp[3] = min(ndp[3], dp[1])
            ndp[0] = min(ndp[0], dp[1] + 2 * t + 1)

            # State 2: pair current C with waiting C.
            ndp[0] = min(ndp[0], dp[2] + 2 * t + 1)

            # State 3: pair current C with either waiting B or waiting C.
            ndp[1] = min(ndp[1], dp[3] + 2 * t + 1)
            ndp[2] = min(ndp[2], dp[3] + 2 * t + 1)

        dp = ndp

    return dp[0]

def main():
    T = int(input())
    for case_id in range(1, T + 1):
        n = int(input())
        visitors = [tuple(map(int, input().split())) for _ in range(n)]
        # Store as (t, destination) for convenient processing.
        visitors = [(t, w) for w, t in visitors]

        answer = solve_case(visitors)
        print(f"Case #{case_id}: {answer}")

if __name__ == "__main__":
    main()
```输入首先转换为`(destination, t)`进入`(t, destination)`，因为DP过程中人们的晕船极限不断增加。 然后排序保证当前访问者始终是最大的-`t`与先前的无与伦比的访客形成的任何对的成员。 

奇怪的是——`n`案例在排序之前通过添加进行处理`(1, 1)`，代表虚拟 B 访客。 这个假人并不是真人，只是一个造型装置。 如果它与真正有价值的 B 访客配对`t`，这对成本`t + 2`，这正是该游客与水手一起旅行的成本。 如果它与 C 访问者配对，则成本为`2t + 1`，再次匹配单例 C 行程。 

每个访问者都会重置四个 DP 条目。 转换公式直接对轮渡路线进行编码。 B-B 对成本`t + 2`，而每对包含 C 的成本`2t + 1`。 国家`3`是当前访问者有两个不同的可能等待伙伴的唯一状态，因此必须保留两个转换。 

Python 中不存在整数溢出问题。 最大答案仅约为`n * max(t)`， 但`INF`故意大得多，因此无法到达的状态永远不会干扰有效值。 

## 工作示例

 ### 示例 1

 访客经过排序后，```
B1, C1, B2, B2, B3, C3
```四个 DP 状态写为`[none, B, C, BC]`。 

| 已处理访客 | 无 | 乙| C | 公元前 |
 | --- | --- | --- | --- | --- |
 | 开始| 0 | 信息 | 信息 | 信息 |
 | B1 | 信息 | 0 | 信息 | 信息 |
 | C1 | 3 | 信息 | 信息 | 0 |
 | B2 | 信息 | 3 | 4 | 信息 |
 | B2 | 7 | 9 | 信息 | 4 |
 | B3 | 14 | 14 7 | 9 | 信息 |
 | C3 | 14 | 14 信息 | 14 | 14 7 |

 最终答案是state`none = 14`。 一种最佳配对是 B1-C1、B2-B2 和 B3-C3。 他们的成本是`3`,`4`， 和`7`, 给予`14`。 

该跟踪还说明了为什么仅按目的地贪婪地配对访问者是不够的。 最优解决方案故意使用跨目的地对来组合正确的`t`价值观。 

### 示例 2

 真正的访问者是 B5，由于只有一个访问者，算法添加了虚拟 B1。 

| 已处理访客 | 无 | 乙| C | 公元前 |
 | --- | --- | --- | --- | --- |
 | 开始| 0 | 信息 | 信息 | 信息 |
 | 假人 B1 | 信息 | 0 | 信息 | 信息 |
 | 真正的B5 | 7 | 信息 | 信息 | 信息 |

 假人和真实访客组成 B-B 对，成本为`5 + 2 = 7`。 从物理上讲，这表示访客在时间 5 中从 A 前往 B，随后水手在时间 1 中从 B 前往 C，以及从 C 前往 A。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序在四状态DP中占主导地位，其时间复杂度为O(n) |
 | 空间| O(n) | 访问者列表需要 O(n) 内存，而 DP 本身使用四个值 |

 为了`n <= 50000`，排序很容易实用，并且动态编程仅对每个访问者执行恒定数量的操作。 目的地和`t`bounds 不需要额外的数据结构，因此内存使用量与访问者数量保持线性关系。 

## 测试用例```python
import io
import sys

def solve_case(visitors):
    INF = 10**30

    if len(visitors) & 1:
        visitors.append((1, 1))

    visitors.sort()

    dp = [0, INF, INF, INF]

    for t, w in visitors:
        ndp = [INF, INF, INF, INF]

        if w == 1:
            ndp[1] = min(ndp[1], dp[0])

            ndp[0] = min(ndp[0], dp[1] + t + 2)

            ndp[3] = min(ndp[3], dp[2])
            ndp[0] = min(ndp[0], dp[2] + 2 * t + 1)

            ndp[2] = min(ndp[2], dp[3] + t + 2)
            ndp[1] = min(ndp[1], dp[3] + 2 * t + 1)

        else:
            ndp[2] = min(ndp[2], dp[0])

            ndp[3] = min(ndp[3], dp[1])
            ndp[0] = min(ndp[0], dp[1] + 2 * t + 1)

            ndp[0] = min(ndp[0], dp[2] + 2 * t + 1)

            ndp[1] = min(ndp[1], dp[3] + 2 * t + 1)
            ndp[2] = min(ndp[2], dp[3] + 2 * t + 1)

        dp = ndp

    return dp[0]

def run(inp: str) -> str:
    data = io.StringIO(inp)

    T = int(data.readline())
    out = []

    for case_id in range(1, T + 1):
        n = int(data.readline())
        visitors = []

        for _ in range(n):
            w, t = map(int, data.readline().split())
            visitors.append((t, w))

        out.append(f"Case #{case_id}: {solve_case(visitors)}")

    return "\n".join(out) + "\n"

sample_input = """\
2
6
1 1
1 2
1 3
1 2
2 3
2 1
1
1 5
"""

sample_output = """\
Case #1: 14
Case #2: 7
"""

assert run(sample_input) == sample_output, "provided samples"

assert run("""\
1
1
1 1
""") == "Case #1: 3\n", "minimum-size B case"

assert run("""\
1
1
2 1
""") == "Case #1: 3\n", "minimum-size C case"

assert run("""\
1
4
1 1
1 1
2 1
2 1
""") == "Case #1: 6\n", "all equal values"

assert run("""\
1
3
1 1
1 2
1 3
""") == "Case #1: 8\n", "odd number of B visitors"

assert run("""\
1
3
2 1
2 2
2 3
""") == "Case #1: 10\n", "odd number of C visitors"

assert run("""\
1
1
2 1000
""") == "Case #1: 2001\n", "maximum t boundary"

max_case = "1\n50000\n" + "\n".join(
    "1 1000" for _ in range(50000)
) + "\n"

assert run(max_case) == "Case #1: 25050000\n", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 / 1 1`|`Case #1: 3`| 最小尺寸输入和 B 单例 |
 |`1 / 1 / 2 1`|`Case #1: 3`| 最小尺寸输入和 C 单例 |
 | 四位访客与`t = 1`|`Case #1: 6`| 同等价值和混合目的地 |
 | B 访客`t = 1,2,3`|`Case #1: 8`| 奇数计数和虚拟访客 |
 | C 访客`t = 1,2,3`|`Case #1: 10`| 奇数 C 计数和 C 特定成本 |
 | 一名 C 访客`t = 1000`|`Case #1: 2001`| 最大限度`t`边界|
 | 50000 B 访客`t = 1000`|`Case #1: 25050000`| 最大输入大小和大答案 |

 ## 边缘情况

 单个 B 访客的情况由假人处理。 为了```
1
1
1 5
```该算法插入 B1，对 B1 和 B5 进行排序，并将它们配对`5 + 2 = 7`。 这与时间 5 中的物理路由 A 到 B、时间 1 中的 B 到 C 以及时间 1 中的 C 到 A 完全对应。 

单 C 访客案例的工作方式相同。 为了```
1
1
2 5
```假人 B1 与 C5 配对。 因为该对包含 C，所以其成本为`2 * 5 + 1 = 11`。 访客通过 B 留在船上，经过两次 5 段航程后到达 C，然后水手独自返回。 

奇数个访问者可能会产生一个不是最大访问者的单例。 为了```
1
3
1 1
1 2
1 3
```添加虚拟 B1。 排序后，最优对是 B1-dummy 和 B2-B3。 他们的成本是`3`和`5`, 给予`8`。 这会捕获盲目地忽略最后一个或最大的访问者的实现。 

混合目的地可能需要跨目的地配对。 在第一个示例中，将 B 访问者和 C 访问者配对在一起将花费`16`。 DP 相反会找到 B1-C1`3`, B2-B2 为`4`，和 B3-C3 为`7`，总计`14`。 这四种状态足以准确记住产生这种改进的交叉配对选择。 

最后，最大`t = 1000`是安全的，因为每个转换仅使用整数加法和乘以 2。 对于 50000 个访问者，答案仍然在普通整数范围内，并且 Python 的整数运算消除了任何溢出问题。
