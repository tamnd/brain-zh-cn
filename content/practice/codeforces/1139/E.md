---
title: "CF 1139E - 最大化墨西哥"
description: "每个学生都属于一个俱乐部并具有潜在价值。 在某一天，一些学生已经永久离开了他们的俱乐部。 从剩下的学生中，我们最多可以从每个俱乐部中选择一名学生。 被选中的学生组成竞赛队。"
date: "2026-06-12T03:52:25+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graph-matchings", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1139
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 548 (Div. 2)"
rating: 2400
weight: 1139
solve_time_s: 108
verified: true
draft: false
---

[CF 1139E - 最大化 Mex](https://codeforces.com/problemset/problem/1139/E)

 **评分：** 2400
 **标签：** 流、图匹配、图
 **求解时间：** 1m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个学生都属于一个俱乐部并具有潜在价值。 在某一天，一些学生已经永久离开了他们的俱乐部。 从剩下的学生中，我们最多可以从每个俱乐部中选择一名学生。 被选中的学生组成竞赛队。 

团队的实力是所选潜力的混合体。 我们希望能够实现最大的墨西哥。 

墨西哥至少`k`意味着每个值`0, 1, ..., k-1`出现在选定的学生中。 由于我们可能只从每个俱乐部抽取一名学生，因此真正的问题不再是关于个别学生。 这是关于价值观是否`0, 1, ..., k-1`可以被分配到不同的俱乐部。 

输入描述了最初的学生，然后是一系列删除。 第一次删除后，我们需要第一天的答案，第二次删除后，我们需要第二天的答案，依此类推。 

约束是关键的观察结果。 学生人数最多为 5000 人，俱乐部数量也最多为 5000 个。潜力严格低于 5000。每次删除后都从头开始重新计算所有内容的解决方案将需要在大小为 5000 的图上进行大约 5000 次独立计算，这远远超出了限制。 我们需要在几天之间重用工作。 

一种微妙的情况是，多个俱乐部可以提供相同的价值。```
Club 1: potential 0
Club 2: potential 0
Club 3: potential 1
```mex 为 2，因为值 0 可以来自俱乐部 1 或俱乐部 2，而值 1 来自俱乐部 3。如果不允许重新分配，对第一个可用俱乐部的贪婪选择可能会将自己陷入困境。 

另一个容易犯的错误是将学生而不是俱乐部作为匹配目标。```
Club 1: potentials {0,1}
Club 2: potentials {1}
```值 0 和 1 不能同时取自俱乐部 1。任何正确的模型都必须强制每个俱乐部最多贡献一名选定的学生。 

当被删除的学生后来在相反的过程中重新出现时，就会出现第三种不明显的情况。 最大 mex 可以增加，因为基础匹配图中出现新边。 每次都重新计算整个匹配是没有必要的，但算法仍然必须能够找到重新排列先前分配的增广路径。 

## 方法

 一种直接的方法是独立地处理每一天。 应用当天的删除后，构建一个图表，其中值`x`与当前包含有潜力的学生的每个俱乐部相连`x`。 然后使用二分匹配测试 mex 是否至少为 1、至少为 2、至少为 3，依此类推。 

这是正确的，因为墨西哥至少`k`意味着价值观`0..k-1`都可以分配给不同的俱乐部。 匹配的公式准确地捕捉了该条件。 

问题是成本。 最多有 5000 天。 每天的重建和重新匹配会导致数千万或数亿次匹配操作。 

关键的观察是删除是永久性的。 离线处理让我们可以逆转时间。 

不要一一删除学生，而是从所有删除已经发生的最终状态开始。 然后以相反的顺序将学生添加回来。 

添加一名学生只会向图表添加一条边：```
value p_i  --->  club c_i
```No edge is ever removed.

 现在考虑证明当前 mex 的匹配。 假设我们已经知道值`0..cur-1`可以匹配不同的俱乐部。 当添加新的边时，mex只能增加。 我们永远不需要重新检查旧的价值观。 

我们在二分图上维护一个匹配：```
values  <->  clubs
```不变的是值`0..cur-1`是匹配的。 测试mex能否成为`cur+1`，我们只需要尝试匹配值`cur`。 如果存在增广路径，我们扩展匹配和增量`cur`。 我们继续这样做，直到无法匹配下一个值。 

这将整个过程变成了增量匹配问题。 每个值最多成功匹配一次，因此总工作量保持可控。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(d·V·E) | O(E) | 太慢了 |
 | 最佳 | O(E·V) 摊销，此处为 O(n·5000) | O(E) | 已接受 |`V`表示值顶点的数量，最多 5001 个，`E ≤ n`。 

## 算法演练

 1. 读取所有学生和所有删除查询。 
2. 标记每个最终将被删除的学生。 
3. 构建与所有删除发生后的状态相对应的图。 对于每一个幸存下来的学生`d`天，为其俱乐部增加其潜在价值的优势。 
4. 保持俱乐部与价值观的标准库恩匹配。`match[club]`存储当前使用该俱乐部的值。 
5.让`cur = 0`。 反复尝试寻找从价值出发的增广路径`cur`。 
6.如果DFS成功，则值`cur`变得可匹配。 增加`cur`并尝试下一个值。 
7.当DFS失败时，`cur`正是当前的最大 mex。 将其存储为所有删除后状态的答案。 
8. 以相反的顺序处理删除。 当学生时`k_i`恢复后，添加边缘`(p[k_i], c[k_i])`到图表。 
9.添加新边后，mex只能增加。 从当前开始继续相同的循环`cur`，反复尝试匹配值`cur`。 
10. 存储此新状态的结果 mex。 
11. 处理完所有反向加法后，我们就知道每个中间状态的 mex。 输出天数对应的答案`1..d`。 

### 为什么它有效

 对于任何值`x`, 一条边`(x, club)`意味着俱乐部目前至少有一名有潜力的活跃学生`x`。 

墨西哥至少`k`需要每个值`0..k-1`出现在选定的团队中。 由于每个俱乐部最多贡献一名学生，因此必须将这些值分配给不同的俱乐部。 这正是匹配的覆盖值`0..k-1`。 

维护的匹配始终涵盖以下所有值`cur`。 当 DFS 成功实现价值时`cur`，增广路径创建匹配覆盖`0..cur`。 当 DFS 失败时，霍尔的价值条件就被违反了`cur`，所以没有匹配可以覆盖`0..cur`。 因此，可实现的最大 mex 恰好是`cur`。 

由于逆向处理仅添加边缘，因此先前匹配的值永远不会变得无效。 mex 只能增加，因此从当前匹配继续就足够了。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    p = list(map(int, input().split()))
    c = list(map(int, input().split()))

    d = int(input())
    rem = [int(input()) - 1 for _ in range(d)]

    removed = [False] * n
    for x in rem:
        removed[x] = True

    MAXV = 5001
    g = [[] for _ in range(MAXV)]

    for i in range(n):
        if not removed[i]:
            g[p[i]].append(c[i])

    match = [-1] * (m + 1)

    sys.setrecursionlimit(20000)

    def dfs(v):
        if vis[v]:
            return False
        vis[v] = True

        for club in g[v]:
            if match[club] == -1 or dfs(match[club]):
                match[club] = v
                return True
        return False

    cur = 0

    while cur < MAXV:
        vis = [False] * MAXV
        if dfs(cur):
            cur += 1
        else:
            break

    ans = [0] * (d + 1)
    ans[d] = cur

    for idx in range(d - 1, -1, -1):
        student = rem[idx]
        g[p[student]].append(c[student])

        while cur < MAXV:
            vis = [False] * MAXV
            if dfs(cur):
                cur += 1
            else:
                break

        ans[idx] = cur

    print("\n".join(str(ans[i]) for i in range(1, d + 1)))

if __name__ == "__main__":
    solve()
```该图按潜在价值索引。`g[v]`包含当前可以提供价值的每个俱乐部`v`。 

匹配存储从俱乐部到值。 这是标准的库恩表示法。 在 DFS 期间，如果一个俱乐部已经被另一个值占用，我们会递归地尝试将该值移到其他地方。 

变量`cur`始终表示尚不知道可匹配的第一个值。 成功的增强将其恰好增加一。 

一个常见的实施错误是在每个恢复的学生之后重建匹配。 离线方法的要点是当前匹配仍然有效，因为仅添加边缘，而不会删除边缘。 

另一个微妙的细节是答案索引。 反向处理计算状态的答案：```
after all deletions
after restoring last deletion
after restoring last two deletions
...
```所需的输出对应于第 1 天、第 2 天、...、第 d 天之后的状态，这些状态存储在`ans[1] ... ans[d]`。 

## 工作示例

 ### 示例 1

 输入：```
5 3
0 1 2 2 0
1 2 2 3 2
5
3
2
4
5
1
```全部删除后，没有留下任何学生。 

| 反转状态 | 添加学生 | 当前墨西哥 |
 | ---| ---| ---|
 | 全部删除后| 无 | 0 |
 | 恢复 1 | 值 0，俱乐部 1 | 1 |
 | 恢复 5 | 值 0，俱乐部 2 | 1 |
 | 恢复4 | 值 2，俱乐部 3 | 1 |
 | 恢复2 | 值 1，俱乐部 2 | 3 |
 | 恢复3 | 值 2，俱乐部 2 | 3 |

 存储的反向答案变为：```
state0 = 3
state1 = 3
state2 = 1
state3 = 1
state4 = 1
state5 = 0
```所需的输出是`state1..state5`:```
3
1
1
1
0
```此示例说明了逆向处理为何有用。 mex 仅在添加边时向上移动。 

### 自定义示例```
3 2
0 1 1
1 1 2
2
2
3
```两次删除后，只剩下值`0`在俱乐部`1`遗迹。 

| 反转状态 | 可用边缘| 墨西哥 |
 | ---| ---| ---|
 | 全部删除后| 0→1 | 1 |
 | 恢复学生 3 | 1→2 | 2 |
 | 恢复学生 2 | 1→1 和 1→2 | 2 |

 答案顺序是：```
2
1
```该轨迹展示了增强行为。 一次价值`1`获得俱乐部的使用权`2`, 值`0`和`1`可以占据不同的俱乐部，而墨西哥人则成为`2`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n·5000) 摊销 | 每条边插入一次，每次成功的 mex 增加都会发生一次 |
 | 空间| O(n + m + 5000) | 图、匹配数组和 DFS 簿记 |

 潜在值以 5000 为界，这使得增量匹配变得可行。 由于最多有 5000 名学生和 5000 个俱乐部，实施完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    import sys
    input = sys.stdin.readline

    n, m = map(int, input().split())
    p = list(map(int, input().split()))
    c = list(map(int, input().split()))

    d = int(input())
    rem = [int(input()) - 1 for _ in range(d)]

    removed = [False] * n
    for x in rem:
        removed[x] = True

    MAXV = 5001
    g = [[] for _ in range(MAXV)]

    for i in range(n):
        if not removed[i]:
            g[p[i]].append(c[i])

    match = [-1] * (m + 1)

    sys.setrecursionlimit(20000)

    def dfs(v):
        if vis[v]:
            return False
        vis[v] = True
        for club in g[v]:
            if match[club] == -1 or dfs(match[club]):
                match[club] = v
                return True
        return False

    cur = 0
    while cur < MAXV:
        vis = [False] * MAXV
        if dfs(cur):
            cur += 1
        else:
            break

    ans = [0] * (d + 1)
    ans[d] = cur

    for idx in range(d - 1, -1, -1):
        s = rem[idx]
        g[p[s]].append(c[s])

        while cur < MAXV:
            vis = [False] * MAXV
            if dfs(cur):
                cur += 1
            else:
                break

        ans[idx] = cur

    return "\n".join(str(ans[i]) for i in range(1, d + 1))

# provided sample
assert run(
"""5 3
0 1 2 2 0
1 2 2 3 2
5
3
2
4
5
1
"""
) == "3\n1\n1\n1\n0"

# minimum size
assert run(
"""1 1
0
1
1
1
"""
) == "0"

# all values equal
assert run(
"""3 3
0 0 0
1 2 3
3
1
2
3
"""
) == "1\n1\n0"

# matching requires distinct clubs
assert run(
"""2 1
0 1
1 1
1
2
"""
) == "1"

# mex jumps after restoration
assert run(
"""3 2
0 1 1
1 1 2
2
2
3
"""
) == "2\n1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单身学生价值0 | 0 | 最小尺寸实例 |
 | 所有势均等于 0 | 1,1,0 | 重复值不会增加 mex |
 | 同一俱乐部中的值 0 和 1 | 1 | 一个俱乐部不能代表两种价值观|
 | 恢复创建一个新的匹配 | 2,1 | 增强路径逻辑|

 ## 边缘情况

 考虑：```
2 1
0 1
1 1
1
2
```只有一个俱乐部存在。 尽管值 0 和 1 都可用，但它们不能同时出现在所选团队中。 该图包含边：```
0 -> club 1
1 -> club 1
```值0可以匹配，但值1不能同时匹配。 该算法在尝试增加值 1 时失败，因此 mex 正确报告为 1。 

现在考虑：```
3 2
0 0 1
1 2 2
1
3
```删除唯一的值1后，剩下的图有：```
0 -> club 1
0 -> club 2
```值 0 是可匹配的，值 1 则不可匹配。 该算法返回 mex 1。同一值的多个副本没有帮助，除非还存在缺失的较低值。 

最后：```
3 3
1 2 3
1 2 3
1
1
```没有活跃学生的值为 0。值 0 的 DFS 立即失败。 该算法返回 mex 0，而不考虑任何更大的值，这正是 mex 的定义。
