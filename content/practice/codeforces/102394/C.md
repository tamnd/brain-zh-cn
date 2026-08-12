---
title: "CF 102394C - 瑞士体系中的竞争"
description: "有 (n) 名玩家和 (m) 轮。 在每一轮中，一名球员要么参加一场比赛，要么轮空。 一场比赛包含两场或三场比赛，输入直接给出每个玩家赢了多少场比赛以及平局了多少场。"
date: "2026-08-10T21:22:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102394
codeforces_index: "C"
codeforces_contest_name: "The 2019 China Collegiate Programming Contest Harbin Site"
rating: 0
weight: 102394
solve_time_s: 137
verified: true
draft: false
---

[CF 102394C - 瑞士体系中的竞争](https://codeforces.com/problemset/problem/102394/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有 (n) 名玩家和 (m) 轮。 在每一轮中，一名球员要么参加一场比赛，要么轮空。 一场比赛包含两场或三场比赛，输入直接给出每个玩家赢了多少场比赛以及平局了多少场。 

对于每个球员，我们必须在每轮比赛后报告四项统计数据。 MP是累积的赛点。 GW 是累积游戏点数除以最大可能游戏点数，下限为 (1/3)。 OMW 是球员当前面对的每个对手的比赛获胜百分比的平均值，单独计算重复的交锋。 OGW 使用当前比赛获胜百分比以相同的方式定义。 轮空会为球员自己的统计数据贡献分数和比赛，但永远不会创造对手。 

输入给出每轮比赛的数量，后面是按轮次顺序排列的比赛。 缺席一轮比赛名单的球员将自动被视为轮空。 

Codeforces 官方页面给出了 2 秒的时间限制和 512 MB 的内存限制。 主要结构约束为 (m\le16)，而所有测试用例的 (n\cdot m) 之和最多为 (3\cdot10^5)。 最后一个条件意味着对所有玩家轮对的 (O(nm)) 传递是很容易负担得起的。 即使 (O(nm^2)) 算法实际上最多也是 (n m) 的一个小常量倍数，因为 (m) 的边界为 16。然而，当 (n=10,000) 时，涉及所有玩家对的算法将过于昂贵。 

有几个地方直接实现可能会默默地出错。 

### 边缘情况：玩家只收到轮空

 考虑```
1
2 1
0
```两名球员都得到了轮空。 每个人获得 3 MP、6 个游戏点，并且已经玩了两场比赛。 他们的 GW 是 (6/(3\cdot2)=1)。 由于两者都没有对手，因此 OMW 和 OGW 都定义为 (1/3)。 正确的输出是```
Round 1
3 1/3 1/1 1/3
3 1/3 1/1 1/3
```一个常见的错误是将轮空视为对手或使用 (1) 表示对手百分比，因为轮空相当于 2-0 的比赛。 仅针对玩家自己的统计数据就相当于胜利。 

### 边缘情况：(1/3) 下限改变分数

 考虑```
1
2 1
1
1 2 0 0 2
```这场比赛是平局，因为双方球员都赢了零局。 每人从两场平局比赛中获得 1 MP 和 2 局分。 他们的原始比赛百分比是（1/3），而他们的原始比赛百分比是（2/6=1/3）。 因此，两个百分比都是 (1/3)，并且每个玩家的对手具有相同的值。 

正确的输出是```
Round 1
1 1/3 1/3 1/3
1 1/3 1/3 1/3
```更一般地，在第(r)轮之后，上限匹配百分比可以表示为

 [
 \frac{\max(r,\mathrm{MP})}{3r}。 
]

 对于游戏，如果玩家玩了 (g) 场游戏并获得 (G) 游戏积分，则上限值为

 [
 \frac{\max(g,G)}{3g}。 
]

 在计算 OMW 或 OGW 时使用无上限值会给成绩不佳的玩家带来错误的答案。 

### 边缘情况：同一对手出现多次

 考虑```
1
2 2
1 1
1 2 2 0 0
1 2 0 2 0
```玩家 1 赢得第一场比赛并输掉第二场比赛。 玩家 2 则做相反的事情。 第一轮结束后，玩家 1 拥有 MP 3，玩家 2 拥有 MP 0。第二轮结束后，两人都玩了两次，因此玩家 1 仍然拥有 MP 3，玩家 2 仍然拥有 MP 3。 

每个玩家的对手列表中包含同一玩家两次。 第二轮 OMW 必须平均对手当前百分比两次，而不是一次。 正确的输出是```
Round 1
3 1/3 1/1 1/3
0 1/1 1/3 1/1
Round 2
3 1/1 1/1 1/3
3 1/1 1/3 1/1
```仅存储一组不同对手的解决方案会默默地低估重复比赛的数量。 

## 方法

 最直接的暴力解决方案存储迄今为止看到的所有匹配项。 每轮结束后，对于每个玩家，它都会扫描之前的每场比赛，检查该玩家是否参加过比赛，如果是，则添加对手当前的 MW 和 GW。 这是正确的，因为 OMW 和 OGW 的定义恰好是历史比赛的平均值。 

问题在于重复工作量。 在最坏的情况下，几乎每个玩家都会参加每一轮，因此在第 (r) 轮之后大约有 (nr/2) 场比赛。 为所有 (n) 名玩家单独扫描这些比赛大约需要在该轮中进行 (n^2r/2) 次检查。 总结所有 16 轮，最坏的情况是

 136n^2。 
]

 对于 (n=10,000)，在计算分数算术或输出之前，大约有 (136) 亿次匹配检查。 

蛮力之所以有效，是因为每个统计数据仅取决于已经发生的比赛，但它会反复重新发现哪些对手属于每个玩家。 关键的观察是对手关系永远不会消失。 一旦玩家 (u) 和 (v) 打完比赛，(v) 仍然是 (u) 后续每一轮的对手之一。 由于玩家每轮最多可以玩一次，因此在整个比赛结束后，每个玩家最多有 (m) 个对手参赛。 

因此，我们可以为每个玩家存储一个包含他们参加过的每场比赛的对手的列表。 处理完一轮后，我们只需浏览这些列表即可。 在第(r)轮，每个列表的长度最多为(r)，因此整个比赛期间检查的对手条目总数为

 [
 O\left(n\sum_{r=1}^{m}r\right)=O(nm^2)。 
]

 因为(m\le16)，这个很小。 全局条件 (\sum nm\le3\cdot10^5) 使其在多个测试用例中更加安全。 

OMW 有一个额外的简化。 在固定回合 (r) 中，每个玩家的 MW 都有分母 (3r)。 如果玩家 (v) 有 MP (P_v)，则其上限 MW 为

 [
 \frac{\max(r,P_v)}{3r}。 
]

 因此，玩家 (d) 对手条目的平均值就是

 [
 \frac{\sum_v\max(r,P_v)}{3rd}。 
]

 OGW 没有共同点，因为球员可能会因为轮空次数以及两场或三场比赛的次数不同而打了不同场次的比赛。 因此，我们用普通的精确分数算术将对手 GW 分数相加。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2m^2)) | (O(nm)) | 太慢了|
 | 最佳 | (O(nm^2)) | (O(nm)) | 已接受 |

 ## 算法演练

 1. 为每个玩家累积的 MP、游戏点数和游戏次数创建数组。 还为每个玩家创建一个对手列表。 对手列表每场比赛存储一个条目，因此重复的会议自然会出现多次。 
2. 按顺序处理回合。 对于每场比赛，将双方球员标记为已参加本轮比赛，并根据提供的比赛结果更新他们的 MP、游戏分数和比赛数量。 

如果 (w_1>w_2)，玩家 1 获得 3 MP，玩家 2 获得 0。如果 (w_1<w_2)，则情况相反。 如果（w_1=w_2），双方都获得 1 MP。 游戏点数为(3w+d)，游戏次数为(w_1+w_2+d)。 
3. 将每个玩家添加到对方的对手列表中。 这种情况每场比赛只会发生一次，即使两名球员以前见过面。 重复是必需的，因为定义是对比赛而不是不同对手的平均。 
4. 本轮所有比赛结束后，每位未标记的球员轮空。 为该玩家添加 3 MP、6 个游戏点和 2 场比赛。 

通过在实际比赛后处理轮空，可以在计算任何百分比之前获得当前回合的完整统计数据。 
5. 对于每个玩家，根据自己累积的游戏积分和游戏计算上限 GW：

 [
 GW_i=\frac{\max(\mathrm{游戏}_i,\mathrm{游戏点数}_i)}
 {3\mathrm{游戏}_i}。 
]

 用最大公约数减少分数。 

1. 计算每个玩家当前的MW分子为

[
 M_i=\max(r,\mathrm{MP}_i)。 
]

 实际MW为(M_i/(3r))。 对于有对手的玩家，对每个对手条目 (v) 求和 (M_v)，然后除以 (3r) 乘以对手条目数。 

1. 对于 OGW，浏览相同的对手列表。 对于每个对手 (v)，获取其当前上限 GW：

 [
 \frac{\max(\mathrm{游戏}_v,\mathrm{游戏点}_v)}
 {3\mathrm{游戏}_v}。 
]

 精确地添加这些分数，最后除以对手参赛的数量。 

1. 如果玩家没有对手，则 OMW 和 OGW 都打印 (1/3)。 否则减少计算出的分数并打印四个统计数据。 
2. 每一轮后重复此过程。 由于所有统计数据都是累积的，因此除了对手的平均值之外，不需要从原始比赛结果中重新计算任何内容。 

### 为什么它有效

 在第 (r) 轮之后，数组 MP、游戏点数和游戏准确地包含通过该轮获得的累积值，因为每场比赛和每场轮空都已处理一次。 每个球员的对手列表中只包含该球员参加过的每场比赛的一个条目，包括重复的对手和不包括轮空。 

MW 计算使用 (\max(r,\mathrm{MP})/(3r))，这正是所需的 (1/3) 上限的匹配百分比。 将对手列表上的这些值相加并除以其长度即可得出 OMW。 同样的论点也适用于 GW 和 OGW，只不过每个对手的比赛分母取决于该对手自己的比赛数量。 由于所有算术都是用整数执行并通过 GCD 约简，因此打印的分数是精确且不可约的。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

def reduce_fraction(num, den):
    g = gcd(num, den)
    return num // g, den // g

def add_fraction(a, b, c, d):
    g = gcd(b, d)
    b1 = b // g
    d1 = d // g
    num = a * d1 + c * b1
    den = b1 * d
    g2 = gcd(num, den)
    return num // g2, den // g2

def main():
    T = int(input())
    out = []

    for _ in range(T):
        n, m = map(int, input().split())
        cnt = list(map(int, input().split()))

        mp = [0] * n
        game_points = [0] * n
        games = [0] * n
        opponents = [[] for _ in range(n)]

        for rnd in range(1, m + 1):
            played = [False] * n

            for _ in range(cnt[rnd - 1]):
                p1, p2, w1, w2, d = map(int, input().split())
                p1 -= 1
                p2 -= 1

                played[p1] = True
                played[p2] = True

                if w1 > w2:
                    mp[p1] += 3
                elif w1 < w2:
                    mp[p2] += 3
                else:
                    mp[p1] += 1
                    mp[p2] += 1

                game_points[p1] += 3 * w1 + d
                game_points[p2] += 3 * w2 + d

                total_games = w1 + w2 + d
                games[p1] += total_games
                games[p2] += total_games

                opponents[p1].append(p2)
                opponents[p2].append(p1)

            for i in range(n):
                if not played[i]:
                    mp[i] += 3
                    game_points[i] += 6
                    games[i] += 2

            out.append(f"Round {rnd}")

            for i in range(n):
                gw_num = max(games[i], game_points[i])
                gw_den = 3 * games[i]
                gw_num, gw_den = reduce_fraction(gw_num, gw_den)

                if not opponents[i]:
                    omw_num, omw_den = 1, 3
                    ogw_num, ogw_den = 1, 3
                else:
                    opponent_count = len(opponents[i])

                    omw_sum = 0
                    for v in opponents[i]:
                        omw_sum += max(rnd, mp[v])

                    omw_num = omw_sum
                    omw_den = 3 * rnd * opponent_count
                    omw_num, omw_den = reduce_fraction(
                        omw_num, omw_den
                    )

                    ogw_num, ogw_den = 0, 1
                    for v in opponents[i]:
                        v_num = max(games[v], game_points[v])
                        v_den = 3 * games[v]
                        ogw_num, ogw_den = add_fraction(
                            ogw_num, ogw_den, v_num, v_den
                        )

                    ogw_den *= opponent_count
                    ogw_num, ogw_den = reduce_fraction(
                        ogw_num, ogw_den
                    )

                out.append(
                    f"{mp[i]} "
                    f"{omw_num}/{omw_den} "
                    f"{gw_num}/{gw_den} "
                    f"{ogw_num}/{ogw_den}"
                )

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这三个累加数组足以重建每个玩家自己的百分比。 MP 根据比赛获胜者或平局进行更新，而游戏点数和游戏计数直接使用提供的游戏计数。 轮空由与指定的 2-0 轮空结果完全相同的累积增量表示。 

这`opponents`列表是中心数据结构。 如果玩家 1 和 2 相遇 3 次，则玩家 1 的列表包含`[2, 2, 2]`。 不执行重复数据删除，因为锦标赛定义会计算每次会议。 

更新的顺序很重要。 在计算任何百分比之前必须处理完整的回合，因为 OMW 和 OGW 在该回合后使用对手的当前统计数据。 该代码首先处理每个匹配，然后分配所有轮空，然后才计算输出。 

OMW 计算完全避免了分数加法。 在第 (r) 轮，每个 MW 都有分母 (3r)，因此只有整数分子`max(r, mp[v])`需要积累。 OGW 需要实分数加法，因为两个对手可以有不同的比赛数。 

Python整数是任意精度的，因此不存在溢出问题。 无论如何，最大的分母都很小，因为一名球员最多打 16 轮，每场比赛最多打 3 场比赛，其中轮空贡献两场比赛。 

这`add_fraction`每次添加后函数都会减少。 这使得中间整数保持较小，并避免在所有对手之间构建一个大的共同点。 

## 工作示例

 ### 示例 1

 第一个测试用例有两名玩家和三轮。 第一轮没有比赛，因此双方球员轮空。 第 2 轮包含一场 2-0-1 比赛，第 3 轮包含一场 1-1-1 比赛。 

| 圆形| 玩家| 国会议员 | 游戏积分| 游戏 | 对手|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 3 | 6 | 2 | []|
 | 1 | 2 | 3 | 6 | 2 | []|
 | 2 | 1 | 6 | 13 | 5 | [2] |
 | 2 | 2 | 3 | 7 | 5 | [1] |
 | 3 | 1 | 7 | 17 | 17 8 | [2] |
 | 3 | 2 | 4 | 11 | 11 8 | [1] |

 第2轮后，玩家1拥有MW（6/6=1），而玩家2拥有MW（3/6=1/2）。 它们的 GW 值为 (13/15) 和 (7/15)。 由于他们每个人都只和一个对手交过手，这些值就变成了对方的 OMW 和 OGW。 

第三轮之后，相同的对手名单仍然存在，但他们当前的统计数据发生了变化。 玩家 2 现在拥有 GW (11/24)，因此成为玩家 1 的 OGW。 玩家 1 拥有 GW (17/24)，因此它成为玩家 2 的 OGW。 

该跟踪说明了为什么必须使用当前统计数据而不是比赛发生时那轮的统计数据来计算对手百分比。 

### 示例 2

 第二个测试用例有三名玩家。 在第一轮中，玩家 1 和 2 进行比赛，而玩家 3 轮空。 在第 2 轮中，玩家 2 与玩家 3 比赛，而玩家 1 轮空。 

| 圆形| 玩家| 国会议员 | 游戏积分| 游戏 | 对手|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 0 | 2 | [2] |
 | 1 | 2 | 3 | 6 | 2 | [1] |
 | 1 | 3 | 3 | 6 | 2 | []|
 | 2 | 1 | 3 | 6 | 4 | [2] |
 | 2 | 2 | 6 | 12 | 12 4 | [1, 3] |
 | 2 | 3 | 3 | 6 | 4 | [2] |

 第 1 轮之后，玩家 1 的原始 MW 为零，因此上限为 (1/3)。 玩家 2 的 MW 为 1，因此玩家 1 拥有 OMW (1)，而玩家 2 拥有 OMW (1/3)。 

第 2 轮结束后，玩家 2 面对了两个对手。 玩家1有MW（3/6=1/2），玩家3也有MW（3/6=1/2）。 因此，玩家 2 的 OMW 为

 [
 \frac{1/2+1/2}{2}=\frac12。 
]

 OGW 的平均成绩也是如此，此时所有三名球员都已经打了四场比赛。 

该跟踪既验证了轮空，也验证了玩家的对手列表可以包含具有不同当前统计数据的不同玩家的事实。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(nm^2)) | 在第(r)轮之后，每个玩家最多有(r)个对手条目，因此所有对手列表包含(O(nr))个条目。 对所有轮次求和得出 (O(nm^2))。 |
 | 空间| (O(nm)) | 累积统计使用 (O(n)) 内存，所有对手列表总共最多包含 (nm) 个条目。 |

 由于 (m\le16)，(m^2) 因子最多为 256。更重要的是，输入保证所有情况下的 (n m) 之和仅为 (3\cdot10^5)。 对手列表迭代的结果数量完全在预期范围内，而内存使用量在总锦标赛大小中保持线性。 

## 测试用例```python
import io
import sys
from math import gcd

def solve(data: str) -> str:
    inp = io.StringIO(data)

    def rd():
        return inp.readline()

    t = int(rd())
    out = []

    def reduce_fraction(a, b):
        g = gcd(a, b)
        return a // g, b // g

    def add_fraction(a, b, c, d):
        g = gcd(b, d)
        b1 = b // g
        d1 = d // g
        a = a * d1 + c * b1
        b = b1 * d
        g = gcd(a, b)
        return a // g, b // g

    for _ in range(t):
        n, m = map(int, rd().split())
        counts = list(map(int, rd().split()))

        mp = [0] * n
        gp = [0] * n
        games = [0] * n
        opp = [[] for _ in range(n)]

        for r in range(1, m + 1):
            played = [False] * n

            for _ in range(counts[r - 1]):
                p1, p2, w1, w2, d = map(int, rd().split())
                p1 -= 1
                p2 -= 1

                played[p1] = True
                played[p2] = True

                if w1 > w2:
                    mp[p1] += 3
                elif w2 > w1:
                    mp[p2] += 3
                else:
                    mp[p1] += 1
                    mp[p2] += 1

                gp[p1] += 3 * w1 + d
                gp[p2] += 3 * w2 + d

                g = w1 + w2 + d
                games[p1] += g
                games[p2] += g

                opp[p1].append(p2)
                opp[p2].append(p1)

            for i in range(n):
                if not played[i]:
                    mp[i] += 3
                    gp[i] += 6
                    games[i] += 2

            out.append(f"Round {r}")

            for i in range(n):
                gw_num, gw_den = reduce_fraction(
                    max(games[i], gp[i]),
                    3 * games[i]
                )

                if not opp[i]:
                    omw_num, omw_den = 1, 3
                    ogw_num, ogw_den = 1, 3
                else:
                    d = len(opp[i])

                    omw_num = sum(max(r, mp[v]) for v in opp[i])
                    omw_den = 3 * r * d
                    omw_num, omw_den = reduce_fraction(
                        omw_num, omw_den
                    )

                    ogw_num, ogw_den = 0, 1
                    for v in opp[i]:
                        x = max(games[v], gp[v])
                        y = 3 * games[v]
                        ogw_num, ogw_den = add_fraction(
                            ogw_num, ogw_den, x, y
                        )

                    ogw_den *= d
                    ogw_num, ogw_den = reduce_fraction(
                        ogw_num, ogw_den
                    )

                out.append(
                    f"{mp[i]} {omw_num}/{omw_den} "
                    f"{gw_num}/{gw_den} {ogw_num}/{ogw_den}"
                )

    return "\n".join(out)

def run(inp: str) -> str:
    return solve(inp)

sample = """\
2
2 3
0 1 1
1 2 2 0 1
1 2 1 1 1
3 2
1 1
1 2 0 2 0
2 3 2 0 0
"""

sample_expected = """\
Round 1
3 1/3 1/1 1/3
3 1/3 1/1 1/3
Round 2
6 1/2 13/15 7/15
3 1/1 7/15 13/15
Round 3
7 4/9 17/24 11/24
4 7/9 11/24 17/24
Round 1
0 1/1 1/3 1/1
3 1/3 1/1 1/3
3 1/3 1/1 1/3
Round 2
3 1/1 1/2 1/1
6 1/2 1/1 1/2
3 1/1 1/2 1/1
"""

assert run(sample) == sample_expected, "official sample"

case_min = """\
1
2 1
0
"""

expected_min = """\
Round 1
3 1/3 1/1 1/3
3 1/3 1/1 1/3
"""

assert run(case_min) == expected_min, "minimum all-bye case"

case_draw = """\
1
2 1
1
1 2 1 1 1
"""

expected_draw = """\
Round 1
1 1/3 4/9 4/9
1 1/3 4/9 4/9
"""

assert run(case_draw) == expected_draw, "draw and exact 1/3 cap"

case_repeat = """\
1
2 2
1 1
1 2 2 0 0
1 2 0 2 0
"""

expected_repeat = """\
Round 1
3 1/3 1/1 1/3
0 1/1 1/3 1/1
Round 2
3 1/1 1/1 1/3
3 1/1 1/3 1/1
"""

assert run(case_repeat) == expected_repeat, "repeated opponent"

case_equal = """\
1
4 2
2 2
1 2 1 1 1
3 4 1 1 1
1 2 1 1 1
3 4 1 1 1
"""

expected_equal = """\
Round 1
1 1/3 4/9 4/9
1 1/3 4/9 4/9
1 1/3 4/9 4/9
1 1/3 4/9 4/9
Round 2
2 1/3 4/9 4/9
2 1/3 4/9 4/9
2 1/3 4/9 4/9
2 1/3 4/9 4/9
"""

assert run(case_equal) == expected_equal, "all equal results"

# Maximum n*m case: 10,000 players, 16 rounds, every player gets a bye.
# This checks both the input-size boundary and repeated-round processing.
n = 10000
m = 16
max_case = "1\n10000 16\n" + " ".join(["0"] * 16) + "\n"

max_output = run(max_case)
lines = max_output.splitlines()

assert len(lines) == 16 * (n + 1), "maximum-size output length"

for r in range(1, 17):
    base = (r - 1) * (n + 1)
    assert lines[base] == f"Round {r}", "round header"

    expected_line = f"{3 * r} 1/3 1/1 1/3"
    assert lines[base + 1] == expected_line, "first player"
    assert lines[base + n] == expected_line, "last player"
```最小情况检查轮空是否会更新 MP、游戏点数和游戏而不创建对手。 抽签情况检查未获胜的比赛和精确的分数减少。 重复对手的情况验证了同一对手每场比赛都会被计算一次。 完全平等的情况检查具有相同统计数据的重复轮次，并捕获意外状态替换而不是累积更新。 最终测试使用允许的最大值 (n) 和 (m) 一起，其中 (n m=160,000)，并验证整个输出结构，而不存储巨大的手写预期字符串。 

| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | (n=2,m=1)，没有匹配项 | 两名球员都有`3 1/3 1/1 1/3`| 再见处理和无对手百分比|
 | (n=2,m=1)，一场 1-1-1 平局 | 两名球员都有`1 1/3 4/9 4/9`| 绘制分数和精确分数 |
 | (n=2,m=2)，相同玩家相遇两次 | 上面显示的与回合相关的累积值 | 屡屡对手|
 | (n=4,m=2)，每场比赛都是平局 | 所有玩家保持对称 | 累积状态和平等统计|
 | (n=10000,m=16)，没有匹配项 | 16轮轮空结果相同| 最大（n）、最大（m）、输出尺寸、性能|

 ## 边缘情况

 只轮空的球员由`played`大批。 当一轮中的所有实际比赛都处理完毕后，每个旗帜仍然为假的玩家将获得 3 MP、6 个游戏点和 2 场比赛。 他们的对手列表仍然为空，因此输出明确对 OMW 和 OGW 使用 (1/3)。 对于输入```
1
2 1
0
```第一个玩家达到 MP 3 和 GW (6/6=1)，给予`3 1/3 1/1 1/3`，第二个玩家得到相同的结果。 

(1/3) 上限通过以下方式应用`max(r, mp[i])`对于兆瓦和`max(games[i], gp[i])`对于GW。 假设一名球员输掉了每场比赛。 第 3 轮之后，他们的 MP 可能为零，但他们的 MW 分子仍然是`max(3, 0) = 3`，给出 (3/9=1/3)。 同样的结构也适用于 GW，其中游戏点数为零的玩家仍会收到等于其游戏次数的上限分子。 

通过在每场比赛中附加对手来保留重复的对手。 如果对手名单变成`[2, 2]`，OMW 循环处理玩家 2 两次。 第二轮之后，两个条目都使用玩家 2 当前的第 2 轮 MW，与定义完全匹配。 算法中的任何地方都没有出现设置或重复数据删除操作。 

百分比计算的时间也很重要。 假设玩家 1 和 2 在第 1 轮中相遇，然后玩家 2 在第 2 轮中与其他人比赛。在第 2 轮后计算玩家 1 的 OMW 时，玩家 2 的第 2 轮结果必须已经包括在内。 该实现在计算任何输出之前会处理所有第 2 轮比赛和所有第 2 轮轮空，因此每个对手统计数据都来自同一轮已完成的比赛。 

最后，游戏百分比不能使用回合数作为分母。 一场轮空贡献两场比赛，一场正常比赛可能包含两场或三场比赛，因此不同的球员可以有不同的比赛场数。 代码维护了`games[i]`明确并使用 (3\cdot\mathrm{games}[i]) 作为最大可能的游戏点数。 这也是为什么 OGW 是通过添加对手的个人 GW 分数来计算的，而不是尝试将他们的游戏分数和游戏计数相结合。
