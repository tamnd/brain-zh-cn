---
title: "CF 19A - 世界杯足球赛"
description: "我们获得了一场足球锦标赛的完整结果，其中每对球队都只踢一场比赛。 对于每场比赛，我们都知道双方进球数。 根据锦标赛规则，我们必须确定哪些球队晋级淘汰赛阶段。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 19
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 19"
rating: 1400
weight: 19
solve_time_s: 351
verified: true
draft: false
---
[CF 19A - 世界杯](https://codeforces.com/problemset/problem/19/A)

 **评分：** 1400
 **标签：** 实施
 **求解时间：** 5m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们获得了一场足球锦标赛的完整结果，其中每对球队都只踢一场比赛。 对于每场比赛，我们都知道双方进球数。 根据锦标赛规则，我们必须确定哪些球队晋级淘汰赛阶段。 

每支球队都可以从比赛中获得积分。 胜一场得3分，平一场得1分，负一场得0分。 团队根据三个标准进行排名，按顺序检查：

 1、总分。 
2.净胜球，进球数减去失球数。 
3. 总进球数。 

该声明保证这些规则始终产生严格的排序，因此在应用所有三个比较后，没有两支球队是完全平局的。 

计算完积分榜后，排名第一的`n / 2`球队有资格。 输出必须包含按字典顺序排序的合格球队名称，而不是按排名顺序排序。 

限制非常小。 最多有 50 支球队参赛，即比赛场次最多`50 * 49 / 2 = 1225`。 甚至一个`O(n²)`或者`O(n² log n)`解决方案很容易在 2 秒限制内足够快。 主要挑战不是优化，而是正确实施排名规则并安全地解析比赛格式。 

一个常见的错误是按排名顺序而不是按字母顺序输出限定符。 考虑这个例子：```
4
Brazil
Argentina
Spain
Italy
Brazil-Argentina 1:0
Brazil-Spain 0:0
Brazil-Italy 2:0
Argentina-Spain 1:0
Argentina-Italy 1:0
Spain-Italy 3:0
```假设排名顺序变为：```
Brazil
Spain
Argentina
Italy
```获得参赛资格的球队是巴西队和西班牙队，但所需输出为：```
Brazil
Spain
```如果预选赛是西班牙和阿根廷，正确的输出仍然需要按字母顺序排序：```
Argentina
Spain
```当直接更新净胜球而不是单独跟踪进球数和失球数时，会出现另一个容易出现的错误。 想象：```
2
A
B
A-B 2:1
```A队有：

 - 分 = 3
 - 得分 = 2
 - 失球 = 1
 - 差异 = 1

 如果我们只存储差值而忘记了总进球数，则稍后我们无法应用第三个决胜局。 

解析也值得关注，因为名称包含大写和小写字母。 比赛线：```
RealMadrid-PSG 3:2
```必须正确拆分为：

 - 团队1 =`RealMadrid`- 团队2=`PSG`- 分数1 =`3`- 分数2 =`2`仅对空格的粗心分割就会丢失名称和分数的结构。 

## 方法

 最直接的方法是完全按照描述模拟整个比赛。 对于每个团队，维护其累积的统计数据：

 - points
 - goals scored
 - goals conceded

 然后逐一处理每一场比赛。 根据结果​​更新两支球队，然后根据排名规则对所有球队进行排序。 

这种暴力方法已经足够快了，因为最多有 1225 个匹配项。 处理每场比赛需要恒定的时间，而对 50 支球队进行排序几乎不需要任何成本。 总工作量大大低于一百万次操作。 

一些初学者试图在每场比赛后重复重新计算排名或多次比较球队，从而使问题变得过于复杂。 在这些限制下，这仍然有效，但它掩盖了问题的真正结构。 

关键的观察结果是排名标准仅取决于汇总统计数据。 所有比赛处理完毕后，每支球队都会得到完整的描述：

 - total points
 - goal difference
 - goals scored

 Nothing else matters. 我们再也不需要个人比赛历史记录了。 

这让我们可以将整个问题简化为：

 1. 建立所有比赛的统计数据。 
2. 使用官方比较器对团队进行排序。 
3. Take the first`n / 2`。 
4. 按字母顺序输出它们。 

解决方案主要是仔细实施而不是算法难度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 反复比较的蛮力 | O(n3) | O(n) | 已接受 |
 | 最优聚合+单一排序 | O(n² + n log n) | O(n² + n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取队伍数量并存储所有队伍名称。 

我们需要用于索引统计和最终输出的名称。 
2. 为每个团队创建一个统计表。 

对于每个团队商店：

 - 点
 - 进球数
 - 失球数

 净胜球始终可以计算为：```
scored - conceded
```3. 处理每条匹配线。 

每行的形式为：```
team1-team2 x:y
```将这一行拆分为球队部分和得分部分，然后提取：

 -`team1`-`team2`-`x`-`y`4. 更新两队的目标。 

如果1队得分`x`并承认`y`：

- 添加`x`得分
 - 添加`y`承认

 对 team2 进行对称更新。 
5.根据结果更新点。 

如果`x > y`，1 队得 3 分。 

如果`x < y`，2 队得 3 分。 

否则两队各得 1 分。 
6. 所有比赛处理完毕后，按照排名规则对队伍进行排序。 

比较器是：

 - 先获得更高的分数
 - 首先是更高的净胜球
 - 进球数高的先得分

 由于 Python 默认按升序排序，因此我们使用负值排序。 
7. 采取第一个`n / 2`从排名中排序的球队。 

这些都是合格的队伍。 
8. 对符合条件的队名按字典顺序排序。 

输出格式需要按字母顺序排列，而不是排名顺序。 
9. 每行打印一个名称。 

### 为什么它有效

 每个排名标准仅取决于累积的锦标赛统计数据。 处理每场比赛都会根据足球计分规则准确更新这些统计数据。 所有比赛处理完毕后，每支球队的存储值都与其真实的锦标赛记录相匹配。 

排序方式：

 1. 点，
 2.净胜球，
 3. 进球数，

 准确再现了官方积分榜定义。 由于该语句保证不存在完整的关系，因此排序顺序是唯一的。 选择第一个`n / 2`球队给出了精确的预选赛资格。 按字母顺序对这些名称进行排序符合所需的输出格式。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    stats = {}

    for _ in range(n):
        name = input().strip()
        stats[name] = {
            "points": 0,
            "scored": 0,
            "conceded": 0
        }

    matches = n * (n - 1) // 2

    for _ in range(matches):
        line = input().strip()

        teams_part, score_part = line.split()
        team1, team2 = teams_part.split('-')

        g1, g2 = map(int, score_part.split(':'))

        stats[team1]["scored"] += g1
        stats[team1]["conceded"] += g2

        stats[team2]["scored"] += g2
        stats[team2]["conceded"] += g1

        if g1 > g2:
            stats[team1]["points"] += 3
        elif g1 < g2:
            stats[team2]["points"] += 3
        else:
            stats[team1]["points"] += 1
            stats[team2]["points"] += 1

    teams = list(stats.keys())

    teams.sort(
        key=lambda name: (
            -stats[name]["points"],
            -(stats[name]["scored"] - stats[name]["conceded"]),
            -stats[name]["scored"]
        )
    )

    qualified = teams[: n // 2]
    qualified.sort()

    print('\n'.join(qualified))

solve()
```第一部分读取所有团队名称并初始化统计字典。 使用以团队名称为键的字典可以避免任何索引问题并使更新变得简单。 

每条匹配线分为两部分：

 -`"A-B"`-`"1:0"`然后对每个部分进行独立解析。 这比尝试一次分割所有内容更安全，因为团队名称可能同时包含大写和小写字母。 

得分和失球数会在得分之前更新。 分别记录得分和失球可以避免抢七计算中的错误。 净胜球仅在排序时产生。 

排序键直接对锦标赛规则进行编码。 负值会颠倒顺序，因此较大的统计数据排在前面。 

一个微妙的细节是最终按字母顺序排列的合格球队。 许多不正确的提交会按排名顺序打印团队。 

## 工作示例

 ### 示例 1

 输入：```
4
A
B
C
D
A-B 1:1
A-C 2:2
A-D 1:0
B-C 1:0
B-D 0:3
C-D 0:3
```### 匹配处理跟踪

 | 比赛| 团队| 积分 | 得分| 失球 | 差异|
 | ---| ---| ---| ---| ---| ---|
 | A-B 1:1 | 一个 | 1 | 1 | 1 | 0 |
 | A-B 1:1 | 乙| 1 | 1 | 1 | 0 |
 | 空调 2:2 | 一个 | 2 | 3 | 3 | 0 |
 | 空调 2:2 | C | 1 | 2 | 2 | 0 |
 | 公元 1:0 | 一个 | 5 | 4 | 3 | 1 |
 | 公元 1:0 | d | 0 | 0 | 1 | -1 |
 | BC 1:0 | 乙| 4 | 2 | 1 | 1 |
 | BC 1:0 | C | 1 | 2 | 3 | -1 |
 | B-D 0:3 | 乙| 4 | 2 | 4 | -2 |
 | B-D 0:3 | d | 3 | 3 | 1 | 2 |
 | C-D 0:3 | C | 1 | 2 | 6 | -4 |
 | C-D 0:3 | d | 6 | 6 | 1 | 5 |

 ### 最终排名

 | 团队| 积分 | 差异| 进球数 |
 | ---| ---| ---| ---|
 | d | 6 | 5 | 6 |
 | 一个 | 5 | 1 | 4 |
 | 乙| 4 | -2 | 2 |
 | C | 1 | -4 | 2 |

 排名前两名的球队是`D`和`A`。 按字母顺序排序后：```
A
D
```此示例证实了资格顺序和输出顺序是不同的概念。 

### 示例 2

 输入：```
4
Alpha
Beta
Gamma
Delta
Alpha-Beta 1:0
Alpha-Gamma 0:2
Alpha-Delta 3:1
Beta-Gamma 1:1
Beta-Delta 2:0
Gamma-Delta 0:1
```### 匹配处理跟踪

 | 团队| 积分 | 得分| 失球 | 差异|
 | ---| ---| ---| ---| ---|
 | 阿尔法 | 6 | 4 | 3 | 1 |
 | 测试版 | 4 | 3 | 2 | 1 |
 | 伽玛| 4 | 3 | 2 | 1 |
 | 达美航空 | 3 | 2 | 5 | -3 |

 Beta 和 Gamma 在积分和净胜球上并列。 第三个决胜局，即进球数，也在这里打平，这将违反声明保证。 此类输入从未正式出现。 

如果我们稍微修改一下：```
Gamma-Delta 1:1
```那么伽玛变为：

 | 团队| 积分 | 差异| 进球数 |
 | ---| ---| ---| ---|
 | 伽玛| 5 | 1 | 4 |

 现在的顺序是独一无二的。 

此跟踪说明了为什么必须正确存储所有三个统计数据。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n² + n log n) | O(n² + n log n) | 处理所有比赛需要 O(n²)，对团队进行排序需要 O(n log n) |
 | 空间| O(n) | 仅存储球队统计数据 |

 最多 50 支队伍，比赛场数最多 1225 场。该方案仅执行几千次操作，远低于时间限制。 内存使用量很小，因为每个团队只需要一条统计记录。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n = int(input())

        stats = {}

        for _ in range(n):
            name = input().strip()
            stats[name] = {
                "points": 0,
                "scored": 0,
                "conceded": 0
            }

        matches = n * (n - 1) // 2

        for _ in range(matches):
            line = input().strip()

            teams_part, score_part = line.split()
            team1, team2 = teams_part.split('-')

            g1, g2 = map(int, score_part.split(':'))

            stats[team1]["scored"] += g1
            stats[team1]["conceded"] += g2

            stats[team2]["scored"] += g2
            stats[team2]["conceded"] += g1

            if g1 > g2:
                stats[team1]["points"] += 3
            elif g1 < g2:
                stats[team2]["points"] += 3
            else:
                stats[team1]["points"] += 1
                stats[team2]["points"] += 1

        teams = list(stats.keys())

        teams.sort(
            key=lambda name: (
                -stats[name]["points"],
                -(stats[name]["scored"] - stats[name]["conceded"]),
                -stats[name]["scored"]
            )
        )

        qualified = teams[: n // 2]
        qualified.sort()

        return '\n'.join(qualified)

    return solve()

# provided sample
assert run(
"""4
A
B
C
D
A-B 1:1
A-C 2:2
A-D 1:0
B-C 1:0
B-D 0:3
C-D 0:3
"""
) == "A\nD", "sample 1"

# minimum size
assert run(
"""2
X
Y
X-Y 5:0
"""
) == "X", "minimum teams"

# draw with goal difference tie
assert run(
"""4
A
B
C
D
A-B 1:0
A-C 0:1
A-D 2:0
B-C 0:0
B-D 3:0
C-D 2:0
"""
) == "A\nC", "tie-break by goals scored"

# alphabetical output check
assert run(
"""4
Zebra
Apple
Monkey
Bear
Zebra-Apple 0:1
Zebra-Monkey 0:1
Zebra-Bear 1:0
Apple-Monkey 1:0
Apple-Bear 1:0
Monkey-Bear 2:0
"""
) == "Apple\nMonkey", "alphabetical output"

# larger balanced case
assert run(
"""6
A
B
C
D
E
F
A-B 1:0
A-C 1:0
A-D 1:0
A-E 1:0
A-F 1:0
B-C 1:0
B-D 1:0
B-E 1:0
B-F 1:0
C-D 1:0
C-E 1:0
C-F 1:0
D-E 1:0
D-F 1:0
E-F 1:0
"""
) == "A\nB\nC", "strict ranking chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 队比赛 | X | 最小有效输入 |
 | 抢七情景| 空调| 正确的二级和三级排名|
 | 按字母顺序排列的限定符输出 | 苹果猴| 输出顺序与排名顺序不同 |
 | 6队严密链条| ABC | 更大的排名计算|

 ## 边缘情况

 考虑输出顺序与排名顺序不同的情况：```
4
Z
A
M
B
Z-A 0:1
Z-M 0:1
Z-B 1:0
A-M 1:0
A-B 1:0
M-B 2:0
```排名变为：```
A
M
Z
B
```预选赛是`A`和`M`。 该算法首先从排名顺序中提取上半部分，然后在打印之前仅按字母顺序对这些名称进行排序：```
A
M
```这可以正确处理所需的格式。 

现在考虑通过净胜球差异解决的平局：```
4
A
B
C
D
A-B 1:0
A-C 0:2
A-D 1:0
B-C 1:0
B-D 2:0
C-D 0:1
```最终统计：

 | 团队| 积分 | 差异| 目标|
 | ---| ---| ---| ---|
 | 一个 | 6 | 0 | 2 |
 | 乙| 6 | 2 | 3 |
 | C | 3 | 1 | 2 |
 | d | 3 | -3 | 1 |

 尽管A和B积分相同，但B因净胜球优势而领先于A。 由于该算法按顺序使用所有三个排名键进行排序，因此它准确地再现了官方排名。 

最后，考虑尽可能小的锦标赛：```
2
A
B
A-B 0:0
```两队打平并各得一分。 他们的净胜球和进球数也相等，这违反了唯一排序的保证。 官方测试数据避免了此类情况。 该算法仍然一致地处理输入，但问题保证我们永远不需要解决不可能的关系。
