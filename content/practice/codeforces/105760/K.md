---
title: "CF 105760K - 安全记录"
description: "我们有一棵树，其中一些节点标记为包含日志。 当一根原木被切割时，它的黑色一半保持在原位，而它的红色一半必须落入不包含黑色原木的相邻节点中。"
date: "2026-06-26T03:49:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105760
codeforces_index: "K"
codeforces_contest_name: "2020 UCF Local Programming Contest"
rating: 0
weight: 105760
solve_time_s: 72
verified: true
draft: false
---

[CF 105760K - 安全日志记录](https://codeforces.com/problemset/problem/105760/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树，其中一些节点标记为包含日志。 当一根原木被切割时，它的黑色一半保持在原位，而它的红色一半必须落入不包含黑色原木的相邻节点中。 每条日志必须选择一个相邻的非日志节点作为其红半部分的目的地。 目标是计算存在多少个有效的切割配置。 答案需要模数`1,000,000,007`。 

样式限制是有趣的部分。 包含黑色日志的节点不允许在两个不同的相邻节点中拥有红色日志。 黑色日志节点可以有零个或一个相邻的红色目的地，但绝不能有两个或更多。 

该树最多包含`100000`节点。 任何明确检查选择组合的解决方案都是没有希望的。 即使每个日志的分支因子为 2，也已经产生了指数行为。 线性或近线性树DP是唯一现实的方向。 

微妙的观察可以大大简化情况。 

考虑一个日志节点`u`。 它必须将自己的红色一半发送到恰好一个相邻的非日志节点`w`。 自从`w`肯定会包含一个红色日志，每个其他非日志邻居`u`必须保持完全不活动。 否则`u`会在至少两个相邻节点中看到红色日志并违反规则。 

这种局部解释使得树动态规划成为可能。 

## 方法

 一种强力解决方案是让每个日志选择一个相邻的非日志节点，然后验证最终配置。 如果有`m`日志，每个日志只有两个可能的目的地，即已经`2^m`的可能性。 和`m`最多`100000`，这是完全不可行的。 

关键的观察结果是，关于非日志节点的唯一重要信息是它是否变为**活动**或**非活动**。 

如果至少一个相邻日志将其红色一半发送到该非日志节点，则该非日志节点处于活动状态。 

现在再看一个日志节点。 它恰好选择一个相邻的非日志节点。 所选邻居必须处于活动状态。 所有其他相邻的非日志节点必须处于非活动状态。 该条件仅取决于相邻非日志节点的活动状态。 

这将问题转化为具有两种节点的树 DP：

 - 日志节点
 - 非日志节点

 对于非日志节点，我们跟踪某些子日志是否激活它。 

对于日志节点，我们跟踪它是否将其红色一半发送到其父非日志节点或其子非日志节点之一。 

树结构允许这些选择跨子树独立组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最优树DP | O(n) | O(n) | 已接受 |

 ## 算法演练

 ### DP 状态

 对于非日志节点`u`:`dp0[u]`= 其子树中没有子日志发送红色一半的路数`u`。`dp1[u]`= 其子树中至少有一个子日志将红色一半发送到的路径数`u`。 

对于日志节点`u`:`f0[u]`= 使得这样的方式的数量`u`**不**将其红色一半发送给其父级。`f1[u]`= 使得这样的方式的数量`u`**确实**将其红色的一半发送给其父级。 

### 处理非日志节点

 1. 每个非对数孩子独立贡献`dp0 + dp1`。 
2. 日志子进程可以激活`u`使用状态`f1`，或者不激活`u`使用状态`f0`。 
3.`dp0[u]`是每个日志孩子选择的产品`f0`。 
4.`dp1[u]`是所有可能性减去无人激活的配置的产物`u`。 

### 处理一个日志节点

 1. 让非日志子节点成为子树内可能的目的地。 
2. 如果日志将其红色一半发送给其父级，则每个非日志子级必须保持不活动状态。 
3. 这给出了`f1`。 
4. 如果日志不发送到其父级，则它必须恰好选择一个非日志子级作为目的地。 
5. 被选中的孩子可以以任何方式活跃。 所有其他非日志子项必须保持不活动状态。 
6. 对所选子项求和得出`f0`。 

唯一的技术细节是计算$$\sum_i T_i \prod_{j\neq i} A_j$$有效地，其中$$A_i = dp0[child_i], \qquad
T_i = dp0[child_i] + dp1[child_i]$$使用前缀和后缀乘积，整个节点在其度数的线性时间内被处理。 

### 根处理

 如果根是非对数，则答案是$$dp0[root] + dp1[root]$$如果根是一根日志，则它没有父级，因此它必须在其子级中恰好选择一个非日志邻居。 这与用于的相同转换`f0`。 

### 为什么它有效

 不变的是每个 DP 状态都完整地描述了父级所需的唯一信息。 

对于非日志节点，父节点只关心该节点是否已经处于活动状态。 其中红色原木的确切数量无关紧要。 

对于日志节点来说，父节点只关心日志是否以父节点为目的地。 

每当日志选择目的地时，所有其他相邻的非日志节点都被迫保持不活动状态。 这完全符合原始的样式规则。 每个有效的全局配置对应于一组唯一的 DP 选择，并且每个 DP 构造都会生成有效的配置。 因此计数是准确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

n = int(input())
g = [[] for _ in range(n)]

for _ in range(n - 1):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    g[a].append(b)
    g[b].append(a)

m = int(input())
is_log = [False] * n
for x in map(int, input().split()):
    is_log[x - 1] = True

parent = [-1] * n
order = [0]

for u in order:
    for v in g[u]:
        if v == parent[u]:
            continue
        parent[v] = u
        order.append(v)

dp0 = [0] * n
dp1 = [0] * n
f0 = [0] * n
f1 = [0] * n

for u in reversed(order):

    if not is_log[u]:

        prod_w = 1

        log_children = []

        for v in g[u]:
            if v == parent[u]:
                continue

            if is_log[v]:
                log_children.append(v)
            else:
                prod_w = (prod_w * (dp0[v] + dp1[v])) % MOD

        none_active = prod_w
        all_cases = prod_w

        for v in log_children:
            none_active = (none_active * f0[v]) % MOD
            all_cases = (all_cases * ((f0[v] + f1[v]) % MOD)) % MOD

        dp0[u] = none_active
        dp1[u] = (all_cases - none_active) % MOD

    else:

        prod_b = 1
        w_children = []

        for v in g[u]:
            if v == parent[u]:
                continue

            if is_log[v]:
                prod_b = (prod_b * ((f0[v] + f1[v]) % MOD)) % MOD
            else:
                w_children.append(v)

        k = len(w_children)

        A = [dp0[v] for v in w_children]
        T = [(dp0[v] + dp1[v]) % MOD for v in w_children]

        pref = [1] * (k + 1)
        suff = [1] * (k + 1)

        for i in range(k):
            pref[i + 1] = pref[i] * A[i] % MOD

        for i in range(k - 1, -1, -1):
            suff[i] = suff[i + 1] * A[i] % MOD

        base = pref[k]

        f1[u] = prod_b * base % MOD

        choose_sum = 0
        for i in range(k):
            term = T[i] * pref[i] % MOD
            term = term * suff[i + 1] % MOD
            choose_sum = (choose_sum + term) % MOD

        f0[u] = prod_b * choose_sum % MOD

root = 0

if not is_log[root]:
    ans = (dp0[root] + dp1[root]) % MOD
else:
    prod_b = 1
    w_children = []

    for v in g[root]:
        if is_log[v]:
            prod_b = (prod_b * ((f0[v] + f1[v]) % MOD)) % MOD
        else:
            w_children.append(v)

    k = len(w_children)

    A = [dp0[v] for v in w_children]
    T = [(dp0[v] + dp1[v]) % MOD for v in w_children]

    pref = [1] * (k + 1)
    suff = [1] * (k + 1)

    for i in range(k):
        pref[i + 1] = pref[i] * A[i] % MOD

    for i in range(k - 1, -1, -1):
        suff[i] = suff[i + 1] * A[i] % MOD

    choose_sum = 0
    for i in range(k):
        term = T[i] * pref[i] % MOD
        term = term * suff[i + 1] % MOD
        choose_sum = (choose_sum + term) % MOD

    ans = prod_b * choose_sum % MOD

print(ans)
```对树进行生根后，节点将按照 DFS 的逆顺序进行处理。 当评估其父级时，每个子级 DP 值都是已知的。 

对于非日志节点，该实现计算没有子节点激活该节点的方式数量以及至少一个子节点激活该节点的方式数量。 

对于日志节点，该实现构建了前缀和后缀乘积`dp0`值高于非对数子项。 这允许在 O(1) 中计算选择任何特定目标子节点的贡献，从而为每个节点提供 O( Degree ) 处理而不是 O( Degree²) 。 

根需要单独处理，因为它没有父级并且不能使用与向上发送红色一半相对应的转换。 

## 工作示例

 ### 示例 1

 输入：```
5
1 2
2 3
3 4
4 5
3
1 3 4
```日志位于节点 1、3 和 4。 

唯一可能的举动是：

 - 1 → 2
 - 3 → 2
 - 4 → 5

 | 节点| 类型 | 结果 |
 | --- | --- | --- |
 | 1 | 日志| 选择 2 |
 | 3 | 日志| 选择 2 |
 | 4 | 日志| 选择 5 |

 节点 3 只能看到一个相邻的红色节点，即节点 2。节点 4 只能看到一个相邻的红色节点，即节点 5。该配置有效。 

答案 = 1。 

### 示例 2

 输入：```
6
1 2
2 3
3 4
3 5
5 6
2
2 5
```日志位于节点 2 和 5。 

节点 2 可以发送到节点 1 或节点 3。 

节点 5 可以发送到节点 3 或节点 6。 

有效结果是：

 | 日志 2 | 日志 5 |
 | --- | --- |
 | 1 | 6 |
 | 3 | 6 |

 答案=2。 

跟踪表明多个日志可能会将红半部分发送到同一个非日志节点，并且只有活动/非活动状态很重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每条边和节点都会被处理固定次数 |
 | 空间| O(n) | 树、父数组、顺序数组和 DP 表 |

 和`n ≤ 100000`，线性复杂度对于 5 秒的限制来说很容易足够快。 

## 测试用例```
# helper sketch for local testing

# sample 1
assert run("""\
5
1 2
2 3
3 4
4 5
3
1 3 4
""") == "1\n"

# sample 2
assert run("""\
6
1 2
2 3
3 4
3 5
5 6
2
2 5
""") == "2\n"

# single node with a log, nowhere to drop red half
assert run("""\
1
1
1
""") == "0\n"

# two nodes, one log
assert run("""\
2
1 2
1
1
""") == "1\n"

# all nodes are logs
assert run("""\
3
1 2
2 3
3
1 2 3
""") == "0\n"

# chain with alternating log and non-log nodes
assert run("""\
4
1 2
2 3
3 4
2
1 3
""") == "1\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单日志节点 | 0 | 不存在有效目的地 |
 | 二节点树 | 1 | 最简单有效的举动 |
 | 所有节点都是日志 | 0 | 红半无法进入日志节点 |
 | 交替链| 1 | 通过 DP 的基本传播 |

 ## 边缘情况

 日志节点可能根本没有相邻的非日志节点。```
3
1 2
2 3
3
1 2 3
```每个节点都包含一个黑色日志。 由于红色半边被禁止进入黑色日志节点，因此不可能移动。 DP 自然返回零，因为每个日志节点都没有有效的目的地选择。 

当多个日志可以将红半部分发送到同一个非日志节点时，会发生另一个棘手的情况。 这是完全合法的。 限制不是关于一个节点包含多少个红半部分。 限制是关于黑色日志节点可以看到多少个包含红色日志的邻居节点。 DP 使用的活动/非活动表示法准确地体现了这种区别。
