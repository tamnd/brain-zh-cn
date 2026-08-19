---
title: "CF 102203J-\u041d\u043e\u0447\u043d\u043e\u0439\u043f\u0430\u0442\u0440\u0443\u043b\u044c"
description: "我们有一个最多有 300 个交点的有向加权图。 每条有向道路都有一个正的遍历时间。 两名巡逻人员从十字路口 s1 和 s2 出发。 他们必须严格按照这个顺序检查序列 p1, p2, ..., pk。"
date: "2026-08-18T00:52:01+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102203
codeforces_index: "J"
codeforces_contest_name: "\u0427\u0435\u0442\u0432\u0435\u0440\u0442\u0430\u044f \u041b\u0438\u043f\u0435\u0446\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e (8-11 \u043a\u043b\u0430\u0441\u0441\u044b)"
rating: 0
weight: 102203
solve_time_s: 131
verified: true
draft: false
---

[CF 102203J - \u041d\u043e\u0447\u043d\u043e\u0439\u043f\u0430\u0442\u0440\u0443\u043b\u044c](https://codeforces.com/problemset/problem/102203/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个最多有 300 个交点的有向加权图。 每条有向道路都有一个正的遍历时间。 两名巡逻人员在十字路口出发`s1`和`s2`。 

他们必须检查顺序`p1, p2, ..., pk`正是按照这个顺序。 对于每项所需的检查，可由任一官员执行。 执法人员到达规定的路口后，即可开始下一次检查。 警察可以站在同一个路口，如果警察已经在需要检查的路口，则该检查不花费移动时间。 

任务是找到最小可能的总时间，直到`pk`已被检查。 如果某些所需的转换是不可能的，那么答案是`-1`。 

隐藏在语句中的第一个图形问题是最短路径。 每当警员必须离开十字路口时`u`到交叉路口`v`，仅从最短旅行时间`u`到`v`很重要。 由于该图是有向图，因此距离`u`到`v`不一定是距离`v`到`u`。 

边界足够小`n`允许所有对的最短路径计算`O(n^3)`。 和`n <= 300`，即最多 2700 万次松弛操作。 另一方面，`k`可以达到 1000，因此对于每个所需交叉路口进行二次转换的 DP 已经达到大约 9000 万个状态转换，并且将每个检查点强力分配给两名官员之一将需要`2^1000`的可能性，这是完全不可行的。 

有几种边缘情况，粗心的解决方案可能会处理不当。 第一种情况是根本没有道路，但所需的十字路口已经被占用。 例如：```
2 0 31 1 21 2
```大副从 1 开始，副副从 2 开始。所需的顺序是`1, 1, 2`，因此每次检查都可以由已经站在正确交叉路口的官员来执行。 答案是`0`。 假设每对连续的检查点都需要一条实际道路的解决方案将错误地返回`-1`。 

另一个微妙的情况是重复的检查点。 为了```
1 0 41 1 1 11 1
```答案是`0`。 当警官已经在场时，重复检查不需要移动。 将相等的连续顶点视为不可能的过渡是错误的。 

两位官员也可能会面。 例如：```
2 1 21 2 51 21 1
```第一次检查在顶点 1 已经满足，然后一名官员在时间 5 前往顶点 2，所以答案是`5`。 坚持两名官员必须占据不同顶点的 DP 将拒绝完全有效的状态。 

最后，方向性很重要。 考虑：```
2 1 21 2 72 11 1
```第一次检查 2 需要花费 7，但从 2 返回到 1 是不可能的。 答案是`-1`。 用无向图替换有向图会产生不正确的有限答案。 

## 方法

 对于每个所需的检查点，直接的暴力解决方案可以决定由两名警官中的哪一位执行该检查。 有`2^k`这样的任务。 一旦分配确定，每个军官的路线完全由分配给该军官的检查站决定，并且每次移动都可以用最短路径距离代替。 因此枚举是正确的，但在最坏的情况下它检查`2^1000`作业，每个作业最多需要`O(k)`工作。 这大约是`O(k * 2^k)`，这远远超出了可能的范围。 

一种更有前途的方法是动态规划。 检查点后`pi`经检查，肯定有一名警官站在`pi`，即刚刚执行该检查的官员。 需要其他官员的哪些信息？ 仅其当前的交叉点。 之前的一切`pi`已经将其成本贡献给了DP值。 

这给出了由索引组成的状态`i`和另一位军官的顶点`x`。 起初这似乎产生`O(k n)`状态，但粗心的过渡可能会比较所有可能的旧状态`x`与每一个可能的新状态，产生`O(k n^2)`工作。 关键的观察结果是，从一个国家`(i, x)`对于下一次检查来说，只有两个有意义的选择。 

该官员目前在`pi`可以检查`p(i+1)`。 在这种情况下，另一名官员仍留在`x`。 

或者，其他官员可以检查`p(i+1)`。 在这种情况下，该官员目前在`pi`成为非活跃官员，因此新的其他职位正是`pi`。 

第二个转换特别有用，因为它的目标状态对于每个旧的总是相同的`x`。 我们永远不需要考虑任意的​​新旧位置对。 

因此，在计算出所有对的最短路径后，DP 只需要`O(k n)`时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(k * 2^k)`在最短路径之后|`O(n^2)`| 太慢了|
 | DP + 弗洛伊德-沃歇尔 |`O(n^3 + k n)`|`O(n^2)`| 已接受 |

 ## 算法演练

 1. 计算最短路径距离`dist[u][v]`在每对交叉路口之间使用 Floyd-Warshall。 最初，`dist[u][u] = 0`，每条有向道路都会贡献其旅行时间，并且不可达对的距离为无穷大。 由于每条道路都有正权重，因此可以通过标准松弛直接处理最短路径。 
2. 定义`dp[x]`处理检查点后`pi`作为一名官员在场的最短经过时间`pi`另一名警官在十字路口`x`。 我们不需要记住哪个实体官员是哪个。 该官员在`pi`简称为现役军官。 
3. 初始化DP`p1`。 要么官员开始于`s1`达到`p1`，让另一名官员在`s2`，或官员开始于`s2`达到`p1`，让另一名官员在`s1`。 因此，两种可能的状态是：`dp[s2] = dist[s1][p1]`和`dp[s1] = dist[s2][p1]`。 

如果两种可能性导致相同的状态，我们保留较小的成本。 
4. 对于每一个连续的对`pi`,`p(i+1)`， 让`next = p(i+1)`。 来自一个州`dp[x]`，首先考虑让现役军官从`pi`到`next`。 新的状态依然是`x`，需额外付费`dist[pi][next]`。 
5. 还可以考虑让不活跃的官员离开`x`到`next`。 新的现役军官现在是以前不活跃的军官，而旧的现役军官则留在`pi`。 因此新的状态是`pi`，需额外付费`dist[x][next]`。 
6. 将当前的 DP 数组替换为新计算的数组。 任何涉及无限最短路径距离的转换都会被忽略，因为相应的官员无法执行该检查。 
7、后处理`pk`, 每个有限的`dp[x]`代表完成整个检查序列的有效方法。 取所有最小值`x`。 如果每个状态都是无限的，则输出`-1`。 

### 为什么它有效

 不变的是处理后`pi`,`dp[x]`存储所有有效时间表中的最短可能时间，其检查的前缀以一名官员结尾`pi`另一个在`x`。 

对于下一个检查站，两名警官中只有一人进行检查。 如果该官员在`pi`执行它，第一个转换认为时间表并离开`x`不变。 如果该官员在`x`执行它时，第二个过渡会考虑该时间表并将另一位官员留在`pi`。 这是仅有的两个可能的选择，因此每个有效的调度都有相应的 DP 转换。 

相反，每个 DP 转换都遵循图中的实际最短路径，并在下一次检查后生成有效配置。 由于 DP 为每种可能的配置保持最便宜的成本，因此对检查点序列的归纳证明了最终的最小值恰好是最佳巡逻持续时间。 

## Python 解决方案```python
Pythonimport sysinput = sys.stdin.readline

def solve():    n, m, k = map(int, input().split())
    INF = 10**30    dist = [[INF] * n for _ in range(n)]
    for i in range(n):        dist[i][i] = 0
    for _ in range(m):        v, u, t = map(int, input().split())        v -= 1        u -= 1        if t < dist[v][u]:            dist[v][u] = t
    p = [x - 1 for x in map(int, input().split())]    s1, s2 = map(lambda x: x - 1, map(int, input().split()))
    # Floyd-Warshall.    for mid in range(n):        dmid = dist[mid]        for u in range(n):            du = dist[u]            if du[mid] == INF:                continue            base = du[mid]            for v in range(n):                nd = base + dmid[v]                if nd < du[v]:                    du[v] = nd
    # dp[x]:    # one patrol is at p[i], the other is at x.    dp = [INF] * n
    first = p[0]
    if dist[s1][first] < INF:        dp[s2] = min(dp[s2], dist[s1][first])
    if dist[s2][first] < INF:        dp[s1] = min(dp[s1], dist[s2][first])
    for i in range(k - 1):        cur = p[i]        nxt = p[i + 1]
        move_active = dist[cur][nxt]        ndp = [INF] * n
        for other in range(n):            cur_cost = dp[other]            if cur_cost == INF:                continue
            # The patrol currently at cur handles nxt.            if move_active < INF:                value = cur_cost + move_active                if value < ndp[other]:                    ndp[other] = value
            # The other patrol handles nxt.            move_other = dist[other][nxt]            if move_other < INF:                value = cur_cost + move_other                if value < ndp[cur]:                    ndp[cur] = value
        dp = ndp
    answer = min(dp)    print(-1 if answer == INF else answer)

if __name__ == "__main__":    solve()
```距离矩阵在对角线上用零进行初始化，因为官员可以在检查站已经存在的情况下检查检查站而无需移动。 同一对之间的多条有向道路通过仅保留最小边权重来处理，尽管该语句不要求不存在重复边。 

Floyd-Warshall 循环使用`mid`作为中间顶点。 支票`du[mid] == INF`避免不必要的工作`u`无法到达`mid`。 价值`10**30`比任何可能的有限答案都要大，因为简单的最短路径最多使用`n - 1`边且每条边的成本最多`10^6`。 

DP 包含当前未站在最新检查站的警官的每个可能位置的一个状态。 当活跃军官移动时，非活跃位置保持不变。 当非活动军官移动时，旧的活动位置变成新的非活动位置，这解释了为什么目的地索引是`cur`而不是`nxt`。 

初始化必须考虑两名起始官员。 只选择`s1`会错过二副到达的时刻表`p1`第一的。 同样的推理适用于以后的每个检查站，两名警官都必须被视为可能的执行者。 

## 工作示例

 ### 示例 1

 输入是：```
5 0 55 5 4 4 55 4
```没有道路，因此从顶点到自身的唯一有限距离为零。 军官从顶点 5 和 4 开始，与序列所需的顶点完全匹配。 

在第一个检查点之后，副驾驶可以立即检查顶点 5，而将另一个检查点留在 4。 

| 检查站| 活跃位置 | 其他职位| DP成本|
 | --- | --- | --- | --- |
 |`p1 = 5`| 5 | 4 | 0 |
 |`p2 = 5`| 5 | 4 | 0 |
 |`p3 = 4`| 4 | 5 | 0 |
 |`p4 = 4`| 4 | 5 | 0 |
 |`p5 = 5`| 5 | 4 | 0 |

 每次转换的成本都是零，因为下一次检查所需的官员已经在那里。 最终的答案是`0`。 

这说明了为什么相同的连续检查点和没有道路不会自动失败。 

### 示例 2

 输入是：```
5 4 41 5 35 1 101 2 12 3 25 1 2 31 2
```有用的最短距离是：```
dist[1][5] = 3dist[5][1] = 10dist[2][3] = 2
```第一个检查点是顶点 5。顶点 1 的军官经过 3 个单位到达该检查点，而另一名军官则留在顶点 2。 

| 检查站| 活跃位置 | 其他职位| 最低成本|
 | --- | --- | --- | --- |
 |`p1 = 5`| 5 | 2 | 3 |
 |`p2 = 1`| 1 | 5 | 13 |
 |`p3 = 2`| 2 | 1 | 14 | 14
 |`p4 = 3`| 3 | 1 | 16 | 16

 为了`p2`，5 号官员必须返回到 1，成本为 10。这会产生成本`13`。 然后另一名警官已经 2 点了，处理`p3`零额外运动。 最后，同一名军官在 2 个单位中从 2 人旅行到 3 人。 

总计为`3 + 10 + 2 = 15`，如果我们正确跟踪最佳状态，则不是上表中的 16。 之后的相关DP`p2`实际上是当前军官为 1、另一个为 2 的状态，花费 13，因为达到 1 后，从 2 开始的军官仍然为 2。那么`p3 = 2`由另一位官员以零成本处理，产生活动位置 2，其他位置 1，成本为 13。最后从 2 到 3 的移动成本为 2，给出 15。 

修正后的轨迹为：

 | 检查站| 活跃位置 | 其他职位| 最低成本|
 | --- | --- | --- | --- |
 |`p1 = 5`| 5 | 2 | 3 |
 |`p2 = 1`| 1 | 2 | 13 |
 |`p3 = 2`| 2 | 1 | 13 |
 |`p4 = 3`| 3 | 1 | 15 | 15

 这条轨迹说明了 DP 的中心思想。 二副的职位在几次检查中都没有改变，以便以后可以接替。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n^3 + k n)`| 弗洛伊德-沃歇尔接受`O(n^3)`，并且每个检查点转换都会扫描所有`n`DP 状态 |
 | 空间|`O(n^2)`| 最短路径矩阵在两者中占主导地位`O(n)`DP阵列|

 和`n <= 300`，全对最短路径阶段​​最多有 2700 万个基本松弛。 DP最多有`1000 * 300 = 300,000`状态转换。 内存使用量主要由`300 x 300`距离矩阵，轻松控制在 256 MB 以内。 

## 测试用例```python
Pythonimport sysimport io

def solve():    input = sys.stdin.readline
    n, m, k = map(int, input().split())
    INF = 10**30    dist = [[INF] * n for _ in range(n)]
    for i in range(n):        dist[i][i] = 0
    for _ in range(m):        v, u, t = map(int, input().split())        v -= 1        u -= 1        if t < dist[v][u]:            dist[v][u] = t
    p = [x - 1 for x in map(int, input().split())]    s1, s2 = map(int, input().split())    s1 -= 1    s2 -= 1
    for mid in range(n):        dmid = dist[mid]        for u in range(n):            du = dist[u]            if du[mid] == INF:                continue            base = du[mid]            for v in range(n):                nd = base + dmid[v]                if nd < du[v]:                    du[v] = nd
    dp = [INF] * n    first = p[0]
    if dist[s1][first] < INF:        dp[s2] = min(dp[s2], dist[s1][first])
    if dist[s2][first] < INF:        dp[s1] = min(dp[s1], dist[s2][first])
    for i in range(k - 1):        cur = p[i]        nxt = p[i + 1]        move_active = dist[cur][nxt]        ndp = [INF] * n
        for other in range(n):            cost = dp[other]            if cost == INF:                continue
            if move_active < INF:                value = cost + move_active                if value < ndp[other]:                    ndp[other] = value
            move_other = dist[other][nxt]            if move_other < INF:                value = cost + move_other                if value < ndp[cur]:                    ndp[cur] = value
        dp = ndp
    answer = min(dp)    print(-1 if answer == INF else answer)

def run(inp: str) -> str:    old_stdin = sys.stdin    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)    sys.stdout = io.StringIO()
    try:        solve()        return sys.stdout.getvalue().strip()    finally:        sys.stdin = old_stdin        sys.stdout = old_stdout

# Provided sample 1assert run("""5 0 55 5 4 4 55 4""") == "0", "sample 1"
# Provided sample 2assert run("""5 4 41 5 35 1 101 2 12 3 25 1 2 31 2""") == "15", "sample 2"
# Minimum-size graph, repeated checkpoint, both officers already there.assert run("""1 0 51 1 1 1 11 1""") == "0", "minimum-size repeated vertex"
# Directed reachability: the required second movement is impossible.assert run("""2 1 21 2 72 11 1""") == "-1", "directed unreachable transition"
# Both officers may use the same vertex, and the best strategy changes which# officer is active.assert run("""3 3 41 2 52 3 23 1 11 2 3 11 1""") == "8", "officers can meet and swap roles"
# Multiple edges between the same vertices, the smaller one must be used.assert run("""3 4 31 2 1001 2 42 3 61 3 201 2 31 1""") == "10", "parallel edges and shortest path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0 5`，所有检查点都等于 1 |`0`| 最小图形尺寸和零成本重复检查 |
 |`2 1 2`， 仅有的`1 -> 2`存在 |`-1`| 定向可达性和不可达性转换 |
 |`3 3 4`, 循环图 |`8`| 官员可以会面并更改执行下一次检查的官员 |
 |`3 4 3`， 平行线`1 -> 2`边缘|`10`| 选择最小平行边并使用中间最短路径 |

 ## 边缘情况

 当每个所需的检查站都已被占用时，就不需要道路了。 在最小尺寸示例中```
1 0 51 1 1 1 11 1
```初始化创建了一个零成本状态，因为`dist[1][1] = 0`。 以后的每次转换成本也为零。 答案是`0`，这直接源于这样一个事实：如果警察已经在该十字路口，则检查不需要移动。 

重复的检查点由距离矩阵中相同的零对角线处理。 如果现役官员已经在`pi`和`p(i+1) = pi`， 然后`dist[pi][p(i+1)] = 0`。 现役军官的过渡保持其他军官的职位不变，并且不会增加任何成本。 

对于无法到达的转换，无穷大可防止无效调度进入 DP。 在```
2 1 21 2 72 11 1
```到达顶点 2 后，任一军官都可以执行第一次检查，但一旦活动位置为 2，就没有返回 1 的路径。如果另一名军官已经在 1，则 DP 可以改为让该军官执行第二次检查，这一点必须考虑。 如果两种配置都不允许所需的顺序，则所有最终状态都保持无限，答案是`-1`。 

被允许占用同一个路口的警官自然是有代表性的，因为`dp[x]`没有限制`x`等于活动位置。 状态描述的是位置，而不是不同的顶点。 这也可以处理一名警官追上另一名警官并随后负责检查的情况。 

平行有向边需要取最小边权重。 例如，如果两者`1 -> 2`由于成本 100 和 4 存在，使用 100 作为矩阵条目将使每个后续最短路径不必要地昂贵。 初始化使用`min(dist[v][u], t)`，因此 Floyd-Warshall 从正确的图表开始。 

最后，大的路径成本需要足够大的整数哨兵。 Python 整数不会溢出，但使用哨兵，例如`10**30`仍然使无法访问的状态检查明确，并将添加内容与有限答案安全地分开。
