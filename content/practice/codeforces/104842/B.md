---
title: "CF 104842B - 篮球正负值"
description: "该游戏模拟一场篮球比赛，两队各有五名现役球员和五名替补球员。 随着时间的推移，会发生两件事：球员在球场和替补席之间交换，以及得分事件发生。"
date: "2026-06-28T11:31:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104842
codeforces_index: "B"
codeforces_contest_name: "2020-2021 ICPC, Moscow Subregional"
rating: 0
weight: 104842
solve_time_s: 57
verified: true
draft: false
---

[CF 104842B - 篮球正负](https://codeforces.com/problemset/problem/104842/B)

 **评级：** -
 **标签：** -
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该游戏模拟一场篮球比赛，两队各有五名现役球员和五名替补球员。 随着时间的推移，会发生两件事：球员在球场和替补席之间交换，以及得分事件发生。 不同的是，得分并不单独计入球队总得分，而是分配给当前在场上的个人球员。 

每当一支球队投篮得分为 x 分时，该球队当前在场上比赛的每位球员都会获得 x 的个人统计数据。 同时，当前在场上的对方球队的每位球员都会损失x。 换人不会影响累计得分，但会改变当前受未来得分事件影响的球员。 

任务是按顺序处理完整的换人和得分事件序列，并计算出场上的每位球员的最终正负值。 输出必须遵循玩家首次出现在比赛中的顺序，而不是输入声明顺序。 

限制很小，最多有 1000 个事件。 这立即排除了任何比线性或近线性模拟更复杂的事情。 任何更新每场比赛每支球队当前五名球员的方法都足够快，因为每场比赛最多涉及十名球员。 

一个微妙的细节是，球员只有在第一次踏上球场时才会出现在输出顺序中，而不是在他们被列入初始名单时。 另一个细节是，替换可以引入之前在赛事中未提及的球员，因此系统必须动态注册新名字。 

另一个边缘情况是重复出场：球员可以多次离开并重新进入球场，但他们的得分是在他们活跃的所有时期内累积的。 

## 方法

 直接模拟与问题陈述完全匹配。 我们维护一组中每支球队当前的五名球员，并维护一个字典，将每个球员的姓名映射到他们的累积得分。 我们还跟踪之前是否见过某个玩家，以修复输出顺序。 

对于每个得分事件，我们迭代得分队的五名现役球员并添加 x，并迭代对手的五名现役球员并减去 x。 对于替换事件，我们从活动组中删除一名球员并插入另一名球员，而不改变分数。 

这是有效的，因为活跃玩家的数量是恒定的并且很小，因此每个事件都需要持续的工作。 由于事件多达 1000 个，操作总量仍然很小。 

暴力变体会尝试重建完整的时间线并重新计算每个玩家每个事件的贡献，但这是不必要的，因为我们已经增量地维护了精确的状态。 无需重新计算或回滚； 该系统是纯粹的前向添加剂。 

关键的观察是，任何时候唯一重要的状态是每队当前的五名球员。 其他的一切都只是累积的簿记。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 模拟每个事件的完整重新计算 | O(q * n) | O(n) | 太慢/不必要|
 | 使用活动集进行直接模拟 | O(q) | O(n) | 已接受 |

 ## 算法演练

 1. 解析初始球队名称和首发阵容，并将所有这些球员标记为“已知”，以便我们以后可以保留顺序。 我们还将他们的分数初始化为零。 
2. 将每支球队当前在场的球员存储在一个集合或类似字典的结构中。 这允许在替换期间进行 O(1) 成员资格更新。 
3.维护字典`score[player]`累积整场比赛的正负值。 
4. 维护清单`order`记录每个球员第一次出现在球场上的任何位置。 该列表将用于最终输出排序。 
5. 按时间顺序处理每个事件。 
6. 如果该事件是 T 队得分为 x 的事件，则迭代 T 当前在场上的五名球员，并将 x 添加到他们的每个得分中。 然后迭代对方球队的五名球员并从他们每个人中减去x。 这直接反映了评分如何影响个人统计数据。 
7. 如果赛事为换人，则将离场球员从活跃组中移除，并插入上场球员。 如果传入的玩家以前从未出现过，则将其得分初始化为零并将其附加到输出顺序列表中。 
8. 所有事件结束后，迭代记录的顺序列表并打印每个玩家及其团队和签名得分。 

### 为什么它有效

 在任何时刻，球员对最终统计数据的贡献仅取决于他们在每次得分事件中是否在场上。 该算法在每一步都会维护准确的活跃玩家集，因此每次得分更新都会精确地应用于正确的玩家子集。 由于替换仅更改该集合中的成员身份，而不会影响过去的事件，因此按顺序处理事件可以保留正确性，而无需回滚或了解未来的信息。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def fmt(x):
    if x > 0:
        return f"+{x}"
    return str(x)

first_team = input().strip()
first_players = [input().strip() for _ in range(5)]

second_team = input().strip()
second_players = [input().strip() for _ in range(5)]

score = {}
team_of = {}

on = {first_team: set(first_players),
      second_team: set(second_players)}

order = []
seen = set()

def register(p, team):
    if p not in seen:
        seen.add(p)
        order.append(p)
        score[p] = 0
        team_of[p] = team

for p in first_players:
    register(p, first_team)

for p in second_players:
    register(p, second_team)

q = int(input())
for _ in range(q):
    line = input().strip()

    if "scored" in line:
        parts = line.split()
        team = parts[1]
        val = int(parts[-1])

        for p in on[team]:
            score[p] += val
        other = first_team if team == second_team else second_team
        for p in on[other]:
            score[p] -= val

    else:
        parts = line.split()
        team = parts[1]
        y = parts[3]
        z = parts[5]

        on[team].remove(y)
        on[team].add(z)

        register(z, team)

for p in order:
    s = score[p]
    sign = "" if s == 0 else ("+" if s > 0 else "")
    print(f"{p} ({team_of[p]}) {fmt(s)}")
```核心实现保留两个活动集，每个团队一个，并在替换发生时直接更新它们。 计分逻辑是对称的：我们循环计分队的五名球员来加分，循环计分队的五名球员来减分。 这`register`函数确保我们只将玩家添加到输出顺序中一次，并在他们第一次出现在比赛中时准确地初始化他们的元数据。 

一个微妙的点是解析事件线。 我们不依赖严格的格式化分支，而是检查关键字`"scored"`，因为这清楚地区分了两种事件类型。 另一个微妙的点是，球员可能会在出现在初始阵容顺序之前通过替补引入，因此注册必须在初始化和替补期间进行。 

## 工作示例

 我们追踪一个简化的场景，看看得分和换人是如何相互作用的。 

### 示例 1

 输入：```
A
p1
p2
p3
p4
p5
B
q1
q2
q3
q4
q5
2
Team A scored 2
Team B replaced q1 with q6
```我们跟踪活跃组数和得分。 

| 步骤| 活动 | 球场上的A | B在球场上| 分数变化|
 | --- | --- | --- | --- | --- |
 | 0 | 初始化| p1..p5 | p1..p5 | q1..q5 | 全部 0 |
 | 1 | A 得分 2 | p1..p5 | p1..p5 | q1..q5 | A +2 各，B -2 各 |
 | 2 | B 子 | p1..p5 | p1..p5 | q2..q6 | 没有变化|

 最终效果仅来自步骤1，表明替换仅影响未来的得分。 

### 示例 2

 输入：```
A
a1
a2
a3
a4
a5
B
b1
b2
b3
b4
b5
3
Team A scored 3
Team A replaced a1 with a6
Team A scored 1
```| 步骤| 活动 | 球场上的A | B在球场上| 分数变化|
 | --- | --- | --- | --- | --- |
 | 0 | 初始化| a1..a5 | a1..a5 | b1..b5 | 0 |
 | 1 | A 得分 3 | a1..a5 | a1..a5 | b1..b5 | +3 / -3 |
 | 2 | 子| a2..a6 | b1..b5 | 0 |
 | 3 | A 得分 1 | a2..a6 | b1..b5 | +1 / -1 |

 这说明了为什么跟踪当前活动组就足够了：第二个得分事件使用与第一个不同的玩家组。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q) | 每项赛事最多涉及 10 名玩家（每队 5 名）|
 | 空间| O(n) | 存储分数、团队映射和活动集 |

 对于最多 1000 个事件，该解决方案仅执行几千次操作，完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    first_team = input().strip()
    first_players = [input().strip() for _ in range(5)]

    second_team = input().strip()
    second_players = [input().strip() for _ in range(5)]

    score = {}
    team_of = {}

    on = {first_team: set(first_players),
          second_team: set(second_players)}

    order = []
    seen = set()

    def register(p, team):
        if p not in seen:
            seen.add(p)
            order.append(p)
            score[p] = 0
            team_of[p] = team

    for p in first_players:
        register(p, first_team)
    for p in second_players:
        register(p, second_team)

    q = int(input())
    for _ in range(q):
        line = input().strip()
        if "scored" in line:
            parts = line.split()
            team = parts[1]
            val = int(parts[-1])
            other = first_team if team == second_team else second_team
            for p in on[team]:
                score[p] += val
            for p in on[other]:
                score[p] -= val
        else:
            parts = line.split()
            team = parts[1]
            y = parts[3]
            z = parts[5]
            on[team].remove(y)
            on[team].add(z)
            register(z, team)

    out = []
    for p in order:
        s = score[p]
        if s > 0:
            out.append(f"{p} ({team_of[p]}) +{s}")
        elif s < 0:
            out.append(f"{p} ({team_of[p]}) {s}")
        else:
            out.append(f"{p} ({team_of[p]}) 0")

    return "\n".join(out)

# custom tests

inp = """A
a1
a2
a3
a4
a5
B
b1
b2
b3
b4
b5
1
Team A scored 1
"""
assert "a1 (A) +1" in run(inp)

inp = """A
a1
a2
a3
a4
a5
B
b1
b2
b3
b4
b5
1
Team B scored 2
"""
assert "a1 (A) -2" in run(inp)

inp = """A
a1
a2
a3
a4
a5
B
b1
b2
b3
b4
b5
3
Team A scored 1
Team A replaced a1 with a6
Team A scored 1
"""
out = run(inp)
assert "a6 (A)" in out
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单分| 玩家更新正确| 基本评分传播 |
 | 对手得分 | 负面更新有效| 更新的对称性|
 | 替换+重新进入| 新玩家追踪 | 动态名册正确性 |

 ## 边缘情况

 一种微妙的情况是，当一名球员通过替补登场并立即影响排序时。 例如，如果新玩家进入游戏中期并随后贡献得分，则他们必须按输出顺序出现在所有初始玩家之后。 这`register`函数通过仅在第一次出现时附加来确保这一点。 

另一种情况是同一名球员的重复换人。 由于我们使用集合，删除和重新添加是安全且幂等的。 分数不会重置，因此返回的玩家会继续累积过去的贡献。 

最后一种情况是，那些被列入初始名单但由于立即换人而从未出现在球场上的球员。 这些仍然出现在输出中，因为他们最初在场上，即使他们从未收到得分更新。
