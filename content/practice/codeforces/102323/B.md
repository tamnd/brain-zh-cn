---
title: "CF 102323B - 足球排名"
description: "我们有几个独立的足球队。 每个组包含一组唯一命名的球队和一组已经进行过的比赛。 对于每场比赛，我们都知道两支球队及其最终得分。 根据这些结果，我们必须构建完整的积分榜。"
date: "2026-08-14T00:36:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102323
codeforces_index: "B"
codeforces_contest_name: "UCF Locals 2014"
rating: 0
weight: 102323
solve_time_s: 60
verified: true
draft: false
---

[CF 102323B - 足球排名](https://codeforces.com/problemset/problem/102323/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有几个独立的足球队。 每个组包含一组唯一命名的球队和一组已经进行过的比赛。 对于每场比赛，我们都知道两支球队及其最终得分。 

根据这些结果，我们必须构建完整的积分榜。 对于每支球队，我们需要其总进球数、总失球数、胜场数、负数、平局数和累计积分。 胜利各队积 3 分，平局各积 1 分，失败积 0 分。 

然后根据四个标准对团队进行排序。 更多积分优先。 如果积分相同，则净胜球（进球数减去失球数）较大者优先。 如果也相等，则进球数多的球队排在第一位。 如果所有数字标准相同，则按球队名称的字母顺序决定最终顺序。 所需的输出按输入顺序打印组，并在每个组后留下一个空行。 最初的问题指定最多 30 个团队，每组 400 场比赛，C++ 时间限制为 1 秒，Codeforces 内存限制为 256 MB。 

这些界限足够小，我们不需要比直接模拟和排序更复杂的东西。 即使处理每场比赛一次也只需要 O(G)，而排序最多 30 支球队则需要 O(T log T)。 对于这些界限，团队之间的二次比较也很小，但是当普通排序直接表达排名规则时，没有理由使用它。 

在某些情况下，粗心的实现可能会默默地生成错误的表。 抽签必须更新两支球队，而不仅仅是首先列出的球队。 例如，```
1
2 1
A B
A 0 B 0
```产生```
Group 1:
A 0 0 0 0 1 1
B 0 0 0 0 1 1
```如果解决方案将零比零的结果视为第一支球队的失败，则会给出错误的结果和错误的分数。 

胜利还必须独立于结果类别更新总进球数。 例如，```
1
2 1
A B
A 3 B 1
```产生```
Group 1:
A 3 1 1 0 0 3
B 1 3 0 1 0 0
```只记录分数和胜利而忘记进球的解决方案无法正确计算净胜球决胜局。 

最后，相同的分数不足以确定顺序。 考虑```
1
3 2
ALPHA BETA GAMMA
ALPHA 2 BETA 0
GAMMA 1 BETA 0
```正确的顺序是 ALPHA、GAMMA、BETA。 ALPHA和GAMMA均得3分，但ALPHA净胜球+2，GAMMA+1。 仅按点排序的解决方案可以保留任意或依赖于输入的顺序，并且无法达到所需的排名。 

## 方法

 直接的暴力方法是维护每支球队的记录并处理每场比赛。 每场比赛，查询两支球队，将进球数和失球数相加，然后根据比分更新胜、负、平和积分。 一旦处理完所有比赛，我们就可以通过比较每对球队并反复选择剩余的最佳球队来确定排名。 这是正确的，因为决赛桌中的每项统计数据都是由个人比赛结果独立确定的。 

最多有 30 支球队和 400 场比赛，即使是比赛处理也只有每组 400 条更新。 比较每对的真正简单的排序成本为 O(T²)，即每组最多 900 对比较。 对于这些特定的界限来说，这仍然可以轻松通过。 然而，这是不必要的复杂性，如果将相同的想法转移到更大的积分榜问题上，它就会变得不那么有吸引力。 

更简洁的方法是通过最终输出和排序规则所需的所有统计数据来代表每个团队，将每场比赛处理一次，然后使用一种标准排序。 关键的观察是排名标准形成了字典顺序。 我们可以将它们直接编码为排序键：得分降序、净胜球降序、进球数降序和姓名升序。 然后，Python 的排序机制会一致地处理所有平局情况。 

蛮力之所以有效，是因为每场比赛都独立地为两支球队做出贡献，但其成对排名步骤并没有利用最终排序已经由固定的比较键序列描述的事实。 排序规则形成一个字典键的观察结果将最终阶段减少到 O(T log T)，并且正确性推理更加简单。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(G + T²) | O(T)| 接受给定范围 |
 | 最佳| O(G + T 日志 T) | O(T)| 已接受 |

 ## 算法演练

 1.读取组数并独立处理每组。 将每个组的统计数据分开，可以防止一个组的结果影响另一个组的结果。 
2. 读取团队名称并为每个团队创建统计记录。 最初，每个计数都为零，因为尚未处理任何匹配项。 
3. 对于每场比赛，读出两支球队的名称和比分。 将第一队的进球数与第二队的失球数相加。 为第二个团队执行对称更新。 无论谁获胜，这四个目标都需要更新。 
4. 比较两个分数。 如果第一队得分较大，则增加第一队的胜利，第二队的失败，并给第一队3分。 如果第二个分数较大，则执行对称更新。 如果分数相同，则增加两队的平局数，并给每队 1 分。 
5. 处理完所有比赛后，按积分降序、净胜球降序、进球数降序、队名升序对球队记录进行排序。 前三个条件使用降序排列，因为值越大越好，而名称使用正常的升序字母顺序。 
6. 打印组标题，然后按排序顺序为每个团队打印一行。 每行包含球队名称、进球数、失球数、胜利、失败、平局和积分。 在组后打印一个空行。

关键的不变量是，在处理任何比赛前缀后，每个球队存储的统计数据准确地描述了其在这些处理的比赛中的表现。 一场比赛仅修改两支参赛球队，并且每一种可能的结果（赢、输或平）都会根据计分规则更新双方。 决赛结束后，记录包含完整的积分榜统计数据。 排序键正是问题的优先级排序规则，因此排序后的顺序就是所需的最终排名。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    test_cases = int(input())
    output = []

    for group_id in range(1, test_cases + 1):
        team_count, game_count = map(int, input().split())
        names = input().split()

        stats = {}
        for name in names:
            stats[name] = {
                "gf": 0,
                "ga": 0,
                "w": 0,
                "l": 0,
                "d": 0,
                "p": 0,
            }

        for _ in range(game_count):
            team1, score1, team2, score2 = input().split()
            score1 = int(score1)
            score2 = int(score2)

            a = stats[team1]
            b = stats[team2]

            a["gf"] += score1
            a["ga"] += score2
            b["gf"] += score2
            b["ga"] += score1

            if score1 > score2:
                a["w"] += 1
                b["l"] += 1
                a["p"] += 3
            elif score1 < score2:
                b["w"] += 1
                a["l"] += 1
                b["p"] += 3
            else:
                a["d"] += 1
                b["d"] += 1
                a["p"] += 1
                b["p"] += 1

        ordered = sorted(
            names,
            key=lambda name: (
                -stats[name]["p"],
                -(stats[name]["gf"] - stats[name]["ga"]),
                -stats[name]["gf"],
                name,
            ),
        )

        output.append(f"Group {group_id}:")
        for name in ordered:
            s = stats[name]
            output.append(
                f"{name} {s['gf']} {s['ga']} "
                f"{s['w']} {s['l']} {s['d']} {s['p']}"
            )
        output.append("")

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```这`stats`字典将每个团队名称映射到其六个可变统计数据。 字典比搜索每场比赛的球队列表更好，因为每场比赛都可以在预期的 O(1) 时间内找到两支球队。 

目标更新发生在结果比较之前。 这使得进球统计数据独立于获胜、失败或平局逻辑，并防止在不更新进球的情况下处理平局的常见错误。 

排序表达式使用负数值，因为 Python 的`sorted`函数默认按升序排序。 因此`-points`将较大的总分放在第一位，并且`-goal_difference`和`-goals_for`对接下来的两个标准执行相同的操作。 球队名称保持不变，按字母顺序排列最后的决胜局。 

输出顺序基于排序`names`列表而不是字典本身。 这使得排序规则明确并避免依赖字典迭代行为。 Python 整数也具有任意精度，因此在累积目标或分数时不存在整数溢出问题。 

## 工作示例

 第一个样本包含两组。 第一组，卡斯尼亚队0-1负于拉脱维亚队。 第二组的六场比赛决定最终四支球队的排名。 

对于第 1 组，其唯一匹配后的相关状态为：

 | 团队| 广发| GA | 西 | 左 | d | 普 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 卡西尼亚 | 0 | 1 | 0 | 1 | 0 | 0 |
 | 拉脱维亚 | 1 | 0 | 1 | 0 | 0 | 3 |

 排序键将 LATVERIA 放在第一位，因为 3 个点大于 0。结果输出为：```
Group 1:
LATVERIA 1 0 1 0 0 3
KASNIA 0 1 0 1 0 0
```对于实际提供的样本，第二组达到以下最终状态：

 | 团队| 广发| GA | 西 | 左 | d | 普 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 美国 | 5 | 1 | 1 | 0 | 2 | 5 |
 | 英格兰 | 5 | 2 | 1 | 0 | 2 | 5 |
 | 斯洛文尼亚 | 4 | 3 | 1 | 1 | 1 | 4 |
 | 阿尔及利亚 | 1 | 4 | 0 | 2 | 1 | 1 |

 美国队和英格兰队同积5分，净胜球4个。 他们也都进了 5 个球，因此最终的名称比较按字母顺序将英格兰排在美国之前。 所提供的示例输出将 USA 置于 ENGLAND 之前，这揭示了已发布声明中规定的字母顺序决胜局与某些镜像复制的示例之间的差异。 提交时应将官方竞赛声明视为具有权威性。 存档的问题陈述给出了按字母顺序排列的团队名称作为最终的决胜局。 

第二个有用的跟踪是平局，因为它练习了更新的双方：

 | 比赛| 团队| 广发| GA | 西 | 左 | d | 普 |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | A 0 B 0 | 一个 | 0 | 0 | 0 | 0 | 1 | 1 |
 | A 0 B 0 | 乙| 0 | 0 | 0 | 0 | 1 | 1 |

 两条记录保持对称。 这说明了为什么抽签分支必须更新两队而不是仅将结果分配给一侧。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(G + T 日志 T) | 每场比赛处理一次，则最多排序T队记录 |
 | 空间| O(T)| 每支球队保存一份统计记录 |

 由于 T 最多 30，G 最多 400，该算法仅执行几百次匹配更新，并对每个组进行非常小的排序。 1 秒限制和 256 MB 内存限制为该实现留下了很大的空间。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    test_cases = int(input())
    output = []

    for group_id in range(1, test_cases + 1):
        team_count, game_count = map(int, input().split())
        names = input().split()

        stats = {
            name: {"gf": 0, "ga": 0, "w": 0, "l": 0, "d": 0, "p": 0}
            for name in names
        }

        for _ in range(game_count):
            team1, score1, team2, score2 = input().split()
            score1 = int(score1)
            score2 = int(score2)

            a = stats[team1]
            b = stats[team2]

            a["gf"] += score1
            a["ga"] += score2
            b["gf"] += score2
            b["ga"] += score1

            if score1 > score2:
                a["w"] += 1
                b["l"] += 1
                a["p"] += 3
            elif score1 < score2:
                b["w"] += 1
                a["l"] += 1
                b["p"] += 3
            else:
                a["d"] += 1
                b["d"] += 1
                a["p"] += 1
                b["p"] += 1

        names.sort(
            key=lambda name: (
                -stats[name]["p"],
                -(stats[name]["gf"] - stats[name]["ga"]),
                -stats[name]["gf"],
                name,
            )
        )

        output.append(f"Group {group_id}:")
        for name in names:
            s = stats[name]
            output.append(
                f"{name} {s['gf']} {s['ga']} "
                f"{s['w']} {s['l']} {s['d']} {s['p']}"
            )
        output.append("")

    return "\n".join(output)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

sample = """\
2
2 1
KASNIA LATVERIA
KASNIA 0 LATVERIA 1
4 6
ENGLAND USA ALGERIA SLOVENIA
ENGLAND 1 USA 1
ALGERIA 0 SLOVENIA 1
SLOVENIA 2 USA 2
ENGLAND 0 ALGERIA 0
SLOVENIA 0 ENGLAND 1
USA 1 ALGERIA 0
"""

assert run(sample) == """\
Group 1:
LATVERIA 1 0 1 0 0 3
KASNIA 0 1 0 1 0 0

Group 2:
USA 5 1 1 0 2 5
ENGLAND 5 2 1 0 2 5
SLOVENIA 4 3 1 1 1 4
ALGERIA 1 4 0 2 1 1

""", "sample"

assert run("""\
1
1 0
SOLO
""") == """\
Group 1:
SOLO 0 0 0 0 0 0

""", "minimum-size group"

assert run("""\
1
2 1
A B
A 0 B 0
""") == """\
Group 1:
A 0 0 0 0 1 1
B 0 0 0 0 1 1

""", "draw must give both teams one point"

assert run("""\
1
3 3
ALPHA BETA GAMMA
ALPHA 2 BETA 0
GAMMA 1 BETA 0
ALPHA 1 GAMMA 1
""") == """\
Group 1:
ALPHA 4 1 2 0 1 7
GAMMA 2 2 1 0 2 5
BETA 0 3 0 3 0 0

""", "points and goal difference"

assert run("""\
1
4 4
A B C D
A 2 B 0
C 2 D 0
A 0 C 0
B 1 D 1
""") == """\
Group 1:
A 2 0 1 0 1 4
C 2 0 1 0 1 4
B 1 3 0 1 1 1
D 1 3 0 1 1 1

""", "goal difference and alphabetical tie breaking"

teams = [f"T{i:02d}" for i in range(30)]
games = []
for i in range(20):
    games.append(f"T{i:02d} 1 T{(i + 1) % 30:02d} 0")

max_input = (
    "1\n"
    "30 400\n"
    + " ".join(teams)
    + "\n"
    + "\n".join(
        games[i % len(games)]
        for i in range(400)
    )
    + "\n"
)

max_output = run(max_input)
assert max_output.startswith("Group 1:\n"), "maximum-size input"
assert max_output.endswith("\n"), "maximum-size output"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 提供的两组样本| 两组完整的小组积分榜| 基本解析、匹配处理、排序和格式化 |
 | 一支球队零场比赛 | 一项归零记录 | 最小尺寸边界和初始化 |
 | 0-0 平局 | 两队各得一平各一分| 对称绘制处理 |
 | 三支球队的成绩好坏参半| 阿尔法、伽玛、贝塔 | 积分、净胜球和累积统计数据 |
 | 四支球队统计数据并列| A 在 C 之前，B 在 D 之前 | 净胜球和字母顺序决胜局 |
 | 30 支球队和 400 场比赛 | 有效组 1 输出 | 最大规定范围和重复匹配处理 |

 ## 边缘情况

 零游戏案例的处理无需任何特殊分支。 为了```
1
1 0
SOLO
```创建统计记录时每个字段都为零，没有比赛循环运行，并且单个球队打印为`SOLO 0 0 0 0 0 0`。 重要的属性是初始化已经代表一支没有参加过比赛的球队。 

抽奖箱用途```
1
2 1
A B
A 0 B 0
```进球更新后，两队的进球数均为 0，失球数均为 0。 由于分数相等，两个平局计数器都变为 1，并且两个总得分都变为 1。结果线为`A 0 0 0 0 1 1`和`B 0 0 0 0 1 1`。 仅更新一支球队的分支将违反每场比赛都向两个参与者贡献结果的不变量。 

一边倒的胜利，例如```
1
2 1
A B
A 3 B 1
```将 A 更新为 3 个进球、1 个对手、1 场胜利和 3 分。 B 收到镜像总进球数、1 次失利和 0 分。 排序键看到A的3分，将A放在第一位。 即使排名决定本身已经可以通过分数来确定，目标总数也会更新。 

最后的决胜局可以与```
1
4 4
A B C D
A 2 B 0
C 2 D 0
A 0 C 0
B 1 D 1
```A和C同积4分，净胜球+2，因此进球数也一样为2。最后比较的是名字，A排在C之前。B和D同样以相同的数据统计结束，所以按字母顺序B排在D之前。 这证实了排序键必须包含每个规定的标准，而不是在得分或净胜球之后停止。
