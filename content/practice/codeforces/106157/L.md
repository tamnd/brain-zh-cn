---
title: "CF 106157L - 最后订单"
description: "我们有一个小镇，在道路网的每个路口都有一家酒吧。 沿路行驶需要时间，而且每家酒吧都有打烊时间。 我们在时间 0 从 1 号酒吧开始。饮酒时间的持续时间是预先确定的。"
date: "2026-06-25T11:20:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106157
codeforces_index: "L"
codeforces_contest_name: "2025 United Kingdom and Ireland Programming Contest (UKIEPC 2025)"
rating: 0
weight: 106157
solve_time_s: 48
verified: true
draft: false
---

[CF 106157L - 最后订单](https://codeforces.com/problemset/problem/106157/L)

 **评级：** -
 **标签：** -
 **求解时间：** 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个小镇，在道路网的每个路口都有一家酒吧。 沿路行驶需要时间，而且每家酒吧都有打烊时间。 我们从时间 0 的 pub 1 开始。 

饮酒时间的持续时间是预先确定的。 第一品脱需要$t_1$秒，第二个需要$t_2$，依此类推，直到$t_r$。 持续时间不一定会增加。 

只有在酒吧关门之前喝完一品脱才算数。 我们可以以任何我们喜欢的方式穿过道路网络，多次重游酒吧，甚至不喝酒就经过酒吧。 唯一的限制是不能在同一家酒吧连续喝两品脱。 目标是最大限度地增加消耗的品脱数量。 

品脱数量的限制很小，$r \le 100$，酒吧数量适中，$k \le 300$。 该图可能非常密集，包含多达 90,000 条道路。 

对所有可能的酒吧序列进行暴力搜索是没有希望的。 即使为每品脱啤酒选择一家酒吧也已经大致给出了$k^r$的可能性。 和$k=300$和$r=100$，这是一个天文数字。 

图表大小表明计算每对酒吧之间的最短旅行时间是可行的。 一旦知道了这些最短路径，实际的道路结构就不再重要，重要的是酒吧之间的最短旅行时间。 

当重新光顾酒吧时，会出现一种微妙的边缘情况。 允许再次访问，但仅限于在其间的其他地方喝过酒之后。 

例子：```
2
5 5
2
20 20
1
1 2 1
```序列 pub 1 → pub 1 是非法的，因为相同的 pub 用于连续的品脱。 仅检查关闭时间的解决方案会错误地计算两品脱。 

另一个边缘情况是第一品脱啤酒不需要在 1 号酒吧喝掉。 

示例：```
1
10
2
100 15
1
1 2 1
```前往酒吧 2 需要 1 秒，因此第一品脱在时间 11 结束并且有效。 任何强制在酒吧 1 消费第一品脱的解决方案都会错过这种可能性。 

第三种边缘情况是该图可能包含同一对路口之间的多条道路。 只有最短的旅行时间才重要。 使用任意道路而不是最佳道路可能会使可行的时间表变得不可能。 

## 方法

 最直接的想法是尝试每种可能的酒吧选择。 如果当前的品脱在酒吧里喝醉了$u$，我们选择一家酒吧$v \ne u$对于下一个，添加旅行时间和饮酒时间，并检查是否遵守关闭时间。 

这种方法是正确的，因为它显式枚举了所有有效的计划。 问题在于可能性的数量。 即使忽略旅行细节，也大致有$k$每品脱的选择，生产$k^r$州。 和$k=300$和$r=100$，这是完全不可行的。 

关键的观察结果是，只有最早的完成时间才重要。 

假设我们已经喝醉了$j$品脱，最后一品脱是在酒吧喝完的$u$。 如果两个不同的调度达到相同的状态$(j,u)$，完成时间较短的计划总是至少与另一个一样好。 提前到达永远不会减少未来的选择，因为所有限制都是时间的上限。 

这给出了动态规划公式。 

在 DP 之前，我们计算所有对的最短路径。 两个酒吧之间的任何路线都可以替换为最短的路线，因为早点到达总是更好。 

定义：$$dp[j][u]$$作为最小可能的绝对时间$j$- 酒吧的油漆完成$u$。 

在这样的状态下，下一品脱可以在任何酒吧喝完$v \ne u$。 完成时间变为：$$dp[j][u] + dist[u][v] + t_{j+1}$$并且只有当完成时间不超过$c_v$。 

状态数量仅$r \times k$，每个州都会尝试所有可能的下一个酒吧，给出$O(rk^2)$过渡。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(k^r)$|$O(r)$| 太慢了 |
 | 最佳 |$O(k^3 + rk^2)$|$O(rk)$| 已接受 |

 ## 算法演练

 1. 了解饮酒时间、酒吧关门时间和道路网络。 
2. 构建一个初始化为无穷大的距离矩阵。 
3. 将每个 pub 到其自身的距离设置为 0。 
4. 对于每条道路，保持其端点之间的最小权重。 多条道路可能连接同一对酒吧。 
5. 运行 Floyd-Warshall 来计算每对酒吧之间的最短旅行时间。 
6. 创建一个DP表，其中`dp[j][u]`准确存储饮用后最早可能完成的时间`j`品脱并在酒吧结束`u`。 
7. 初始化第一品脱。 对于每个酒吧`u`，第一品脱可以在那里喝，如果$$dist[1][u] + t_1 \le c_u$$当这种情况成立时，将完成时间存储在`dp[1][u]`。 

1. 对于每消耗的品脱数量`j`从 1 到`r-1`, 处理所有可达的结束 pub`u`。 
2. 对于每个目的地酒吧`v`不同于`u`, 计算$$finish = dp[j][u] + dist[u][v] + t_{j+1}$$如果`finish <= c[v]`， 更新$$dp[j+1][v]$$迄今为止找到的最短完成时间。 

1.答案最大`j`对于某些状态`dp[j][u]`是可达的。 

### 为什么它有效

 DP 状态记录了固定对的最早可达到的完成时间，该固定对由消耗的品脱数量和喝完最后一品脱的酒吧组成。 

任何未来的决定仅取决于这两条信息。 提前完成总是至少与推迟完成一样好，因为所有限制都是最后期限。 用另一个更早达到相同状态的计划替换一个计划不会使任何未来的移动顺序无效。 

弗洛伊德·沃歇尔保证`dist[u][v]`是酒吧之间可能的最短旅行时间。 任何使用较长路线的时间表只能稍后完成，因此考虑最短路径就足够了。 

由于每个有效的 pubs 序列都对应于一系列 DP 转换，并且每个 DP 转换代表一个有效的操作序列，因此 DP 会精确地探索所有可行的调度。 可达到的最大品脱数量是最佳的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

r = int(input())
t = list(map(int, input().split()))

k = int(input())
c = list(map(int, input().split()))

m = int(input())

dist = [[INF] * k for _ in range(k)]

for i in range(k):
    dist[i][i] = 0

for _ in range(m):
    a, b, d = map(int, input().split())
    a -= 1
    b -= 1
    if d < dist[a][b]:
        dist[a][b] = d
        dist[b][a] = d

for mid in range(k):
    dm = dist[mid]
    for i in range(k):
        if dist[i][mid] == INF:
            continue
        via = dist[i][mid]
        di = dist[i]
        for j in range(k):
            nd = via + dm[j]
            if nd < di[j]:
                di[j] = nd

dp = [[INF] * k for _ in range(r + 1)]

start = 0

for u in range(k):
    if dist[start][u] == INF:
        continue
    finish = dist[start][u] + t[0]
    if finish <= c[u]:
        dp[1][u] = finish

answer = 0

for u in range(k):
    if dp[1][u] < INF:
        answer = 1

for drank in range(1, r):
    for u in range(k):
        cur = dp[drank][u]
        if cur == INF:
            continue

        for v in range(k):
            if v == u:
                continue
            if dist[u][v] == INF:
                continue

            finish = cur + dist[u][v] + t[drank]

            if finish <= c[v] and finish < dp[drank + 1][v]:
                dp[drank + 1][v] = finish
                answer = max(answer, drank + 1)

print(answer)
```第一部分构造最短路径矩阵。 通过仅保留最小边权重来处理同一对酒吧之间的多条道路。 

Floyd-Warshall 实施更新了适当的矩阵。 自从$k \le 300$， 这$O(k^3)$复杂性是可以接受的。 

DP 表存储最早的完成时间而不是布尔可达性。 这是最关键的优化。 如果两个时间表在同一家酒吧喝了相同数量的品脱后结束，则只有较早的一个重要。 

第一品脱需要特殊处理，因为没有以前的酒吧。 我们只需从 1 号酒吧前往所选的酒吧并消费$t_1$在那里喝酒秒。 

过渡跳过`v == u`，强制规定不能在同一家酒吧连续消费品脱。 

## 工作示例

 ### 示例 1```
2
5 5
2
10 20
1
1 2 2
```最短距离：

 | 来自 | 至 1 | 至 2 |
 | ---| ---| ---|
 | 1 | 0 | 2 |
 | 2 | 2 | 0 |

 初始化：

 | 酒吧| 喝完第一品脱 | 有效 |
 | ---| ---| ---|
 | 1 | 5 | 是的 |
 | 2 | 7 | 是的 |

 DP 转换：

 | 品脱 | 当前酒吧 | 时间 | 下一个酒吧 | 新时代 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 5 | 2 | 12 | 12
 | 1 | 2 | 7 | 1 | 14 | 14

 只有第一个转换遵循 pub 2 的关闭时间。 

答：`2`。 

该跟踪显示了我们存储最早完成时间的原因。 在酒吧 1 结束第一品脱啤酒比在酒吧 2 结束要好，因为这样可以为以后的行动留下更多时间。 

### 示例 2```
3
4 4 4
3
5 20 20
2
1 2 1
2 3 1
```初始化：

 | 酒吧| 喝完第一品脱 |
 | ---| ---|
 | 1 | 4 |
 | 2 | 5 |
 | 3 | 6 |

 一品脱后：

 | 品脱 | 酒吧| 时间 |
 | ---| ---| ---|
 | 1 | 1 | 4 |
 | 1 | 2 | 5 |
 | 1 | 3 | 6 |

 两品脱之后：

 | 品脱 | 酒吧| 最好的时光 |
 | ---| ---| ---|
 | 2 | 2 | 9 |
 | 2 | 3 | 10 | 10

 三品脱之后：

 | 品脱 | 酒吧| 最好的时光 |
 | ---| ---| ---|
 | 3 | 3 | 14 | 14

 回答：`3`。 

这个例子表明，重新访问和穿过中间的酒吧是通过最短路径距离自然处理的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(k^3 + rk^2)$| Floyd-Warshall 加上 DP 过渡 |
 | 空间|$O(rk + k^2)$| DP表和距离矩阵|

 和$k \le 300$和$r \le 100$，Floyd-Warshall 阶段执行约 2700 万次更新，DP 执行约 900 万次转换，两者都在典型的竞赛限制内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    INF = 10**18

    r = int(input())
    t = list(map(int, input().split()))

    k = int(input())
    c = list(map(int, input().split()))

    m = int(input())

    dist = [[INF] * k for _ in range(k)]
    for i in range(k):
        dist[i][i] = 0

    for _ in range(m):
        a, b, d = map(int, input().split())
        a -= 1
        b -= 1
        dist[a][b] = min(dist[a][b], d)
        dist[b][a] = min(dist[b][a], d)

    for mid in range(k):
        for i in range(k):
            for j in range(k):
                dist[i][j] = min(
                    dist[i][j],
                    dist[i][mid] + dist[mid][j]
                )

    dp = [[INF] * k for _ in range(r + 1)]

    for u in range(k):
        finish = dist[0][u] + t[0]
        if finish <= c[u]:
            dp[1][u] = finish

    ans = 0
    for u in range(k):
        if dp[1][u] < INF:
            ans = 1

    for drank in range(1, r):
        for u in range(k):
            if dp[drank][u] == INF:
                continue
            for v in range(k):
                if v == u:
                    continue
                finish = dp[drank][u] + dist[u][v] + t[drank]
                if finish <= c[v]:
                    dp[drank + 1][v] = min(
                        dp[drank + 1][v],
                        finish
                    )
                    ans = max(ans, drank + 1)

    return str(ans) + "\n"

# minimum size
assert run("""1
5
1
5
1
1 1 1
""") == "1\n"

# cannot drink any pint
assert run("""1
10
1
5
1
1 1 1
""") == "0\n"

# alternating between two pubs
assert run("""2
5 5
2
10 20
1
1 2 2
""") == "2\n"

# revisiting allowed, consecutive not allowed
assert run("""3
1 1 1
2
100 100
1
1 2 1
""") == "3\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单一酒吧，一品脱可行 | 1 | 最小有效实例 |
 | 单身酒吧，已错过截止日期 | 0 | 没有可达状态 |
 | 两个酒吧，一个过渡 | 2 | 基本 DP 转换 |
 | 反复在两家酒吧之间交替 | 3 | 允许重访 |

 ## 边缘情况

 考虑连续使用同一个 pub 两次的情况：```
2
1 1
1
100
1
1 1 1
```第一品脱之后，唯一的 pub 仍然是 pub 1。转换循环拒绝`v == u`，因此不会生成第二品脱。 答案仍然是1。 

考虑第一品脱啤酒在酒吧 1 中没有喝完的情况：```
1
10
2
100 15
1
1 2 1
```初始化会检查每个 pub。 对于酒吧 2，结束时间是`1 + 10 = 11`，满足关闭时间。 国家`dp[1][2] = 11`已创建，给出正确答案 1。 

考虑同一酒吧之间的多条道路：```
1
5
2
100 100
2
1 2 100
1 2 1
```该算法存储最小边权重，即 1。然后，最短路径矩阵正确记录行程时间 1 而不是 100。任何忽略平行边的实现都可能错误地消除可行的调度。
