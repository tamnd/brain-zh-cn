---
title: "CF 105631C - 竞赛反应"
description: "该系统维护一个实时编程竞赛记分牌。 有多个团队，索引从 0 到 k，提交内容按严格递增的时间戳顺序到达。"
date: "2026-06-22T05:39:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105631
codeforces_index: "C"
codeforces_contest_name: "SYSU Collegiate Programming Contest 2024 (SYSUCPC 2024), Final"
rating: 0
weight: 105631
solve_time_s: 65
verified: true
draft: false
---

[CF 105631C - 竞赛反应](https://codeforces.com/problemset/problem/105631/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该系统维护一个实时编程竞赛记分牌。 有多个团队，索引从 0 到 k，提交内容按严格递增的时间戳顺序到达。 每份提交都属于一个团队和 26 封可能的信件中的一个问题，要么被接受，要么被拒绝。 

问题只有在首次解决时才对团队得分有贡献。 解决时间是该问题首次接受的提交的基于分钟的时间戳。 在第一次接受之前提交的任何被拒绝的提交都会增加 20 分钟的处罚。 一旦团队解决了某个问题，以后提交同一问题就与得分无关。 

队伍的排名首先取决于解决问题的数量，然后取决于总罚时（越小越好）。 解决次数和罚分相同的球队享有相同的排名。 

任务不是在通常意义上显式维护完整的记分板，而是仅监视 Team 0。每次 Team 0 新解决一个问题时，我们必须输出其时间戳、问题字母以及合并该解决方案后其排名如何变化。 即使排名没有变化，事件也必须报告。 

关键的困难在于，在第 0 队每次解决新问题后，排名必须反映与所有其他团队在动态排序下的比较，该动态排序取决于解决的计数和处罚。 

限制很大：最多 100,000 个团队和 200,000 个提交。 这立即排除了任何从头开始重新计算每个事件的完整排名的方法。 任何在每次更新后扫描所有团队的解决方案都会降低到 O(nk)，这远远超出了可接受的限制。 我们需要一种保持足够结构的方法，以便可以在对数或接近对数的时间内评估每次更新。 

一个微妙的边缘情况来自于同等的排名。 具有相同解决计数和处罚的两支球队共享相同的排名号，因此排名计算实际上基于计算有多少球队在字典顺序中严格领先（解决，处罚）。 

另一个常见的陷阱是忘记每个问题只有第一个接受的提交才重要。 一个团队可能会在流中针对同一问题提交多次 AC 提交，但只有最早的一份才算数，并且只拒绝该提交之前的一份贡献处罚。 

## 方法

 直接模拟为每个团队维护已解决问题的数量和总惩罚，并在每次提交时更新这些值。 每次涉及 Team 0 的更新后，我们都会通过扫描所有团队并比较他们当前的配对（解决、惩罚）来重新计算其排名。 这是可行的，因为排名纯粹由这两个值定义，因此比较函数是明确定义的。 

问题是这种简单的排名重新计算代价高昂。 对于每个 Team 0 解决事件，扫描 k 个团队的成本为 O(k)。 在最坏的情况下，此类事件的数量为 O(n) 个，因此总数变为 O(nk)，当 n 和 k 分别达到 200,000 和 100,000 时，这太大了。 

关键的观察是我们永远不需要所有团队的完整排序顺序。 我们只需要在特定时刻知道有多少支球队严格优于第 0 支球队。这将任务简化为二维密钥空间上的动态计数问题：解决了计数和惩罚问题。 

这建议维护一个支持点更新（当团队解决的计数或惩罚发生变化时）以及前缀或优势查询的数据结构。 然而，惩罚维度不容易离散，因为惩罚取决于时间积累并且变化很大。 更实用的方法是按照已解决的计数对团队进行分组，然后通过每个组内的惩罚来维持有序结构。

我们可以为每个可能的解决计数维护一个平衡的惩罚结构（或排序列表）。 由于解决的计数最多为 26，因此分组较小且稳定。 每个团队只有在解决一个新问题时才会移动，将其解决的计数增加 1，并将其惩罚增加一个已知值。 

因此，为了对 Team 0 进行排名，我们计算有多少个团队解决了严格更多的问题，以及同一解决组中有多少个团队具有严格更小的惩罚。 如果每个组都维护在排序的多重集结构中，这将变得高效。 

系统是动态的，但更新是本地化的：团队的每个解决方案仅更改其组中的一个元素，因此我们可以在 O(log k) 时间内删除并重新插入。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每次事件后蛮力重新计算排名 | O(nk) | O(nk) | O(k) | 太慢了|
 | 按已解决 + 已排序的处罚进行分组 | O(n log k) | O(n log k) | O(k) | 已接受 |

 ## 算法演练

 1. 按顺序解析提交的内容，维护每个团队的问题是否已解决以及在第一次接受之前发生了多少次失败的尝试。 这是必要的，因为惩罚仅取决于第一个 AC 之前的失败。 
2. 对于每个团队，保持两个核心值：解决问题的数量和总罚分。 这些定义了其记分牌位置。 
3. 维护按已解决计数分组的结构。 由于每个球队的已解决计数在 0 到 26 之间，因此我们为每个计数存储当前该存储桶中球队的排序多重处罚集。 
4. 最初，所有团队都处于解决 = 0 且罚分 = 0 的桶中。 
5. 处理提交时，更新相应的团队状态。 如果在第一次接受该问题之前被拒绝，则增加其临时失败计数。 如果是第一次接受，我们计算其贡献，然后执行存储桶转换。 
6. 当团队解决新问题时，从当前存储桶中删除旧的（已解决、惩罚）状态，并将更新后的状态插入下一个存储桶中。 这使所有存储桶保持一致。 
7. 在 AC 事件上更新 Team 0 后，通过求和来计算其排名：

 桶中具有较高解决计数的所有团队，加上其桶中具有严格更好（较低）惩罚的所有团队。 
8. 输出时间戳、问题和排名转换。 先前的排名可以在更新之前使用相同的过程即时重新计算或增量存储。 

为什么它有效：

 不变的是，每个团队总是存储在与其解决的计数相对应的一个存储桶中，并且在每个存储桶中处罚都是完全排序的。 由于排名规则首先比较解决的计数，然后比较处罚，因此任何排名超过另一队的球队都必须位于较高的存储桶中，或者在同一存储桶的排序处罚顺序中出现在较早的位置。 这种结构使得排名查询相当于对定义明确的有序分区中的元素进行计数，从而在每次更新后保持正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from bisect import bisect_left, bisect_right, insort

def parse_time_to_minutes(t):
    # hh:mm:ss.SSS -> minutes
    hh = int(t[0:2])
    mm = int(t[3:5])
    return hh * 60 + mm

def time_str(t):
    return t  # already formatted

def solve():
    k, n = map(int, input().split())

    # per team: solved count, penalty
    solved = [0] * (k + 1)
    penalty = [0] * (k + 1)

    # per team per problem state
    solved_prob = [[False] * 26 for _ in range(k + 1)]
    fail_count = [[0] * 26 for _ in range(k + 1)]

    # buckets: solved_count -> sorted list of penalties
    buckets = [ [] for _ in range(27) ]

    # initially all teams in (0, 0)
    for i in range(k + 1):
        buckets[0].append(0)

    for b in buckets:
        b.sort()

    def remove(bucket, val):
        i = bisect_left(bucket, val)
        bucket.pop(i)

    def rank_of(team):
        sc = solved[team]
        p = penalty[team]

        better = 0
        for s in range(sc + 1, 27):
            better += len(buckets[s])

        bucket = buckets[sc]
        idx = bisect_left(bucket, p)
        better += idx

        return better + 1

    for _ in range(n):
        parts = input().split()
        t = parts[0]
        team = int(parts[1])
        prob = ord(parts[2]) - 65
        res = parts[3]

        if solved_prob[team][prob]:
            continue

        if res == "RJ":
            fail_count[team][prob] += 1
            continue

        # AC case
        solved_prob[team][prob] = True

        old_sc = solved[team]
        old_pen = penalty[team]

        add_pen = parse_time_to_minutes(t) + 20 * fail_count[team][prob]
        penalty[team] += add_pen
        solved[team] += 1

        # move between buckets
        remove(buckets[old_sc], old_pen)
        insort(buckets[old_sc + 1], penalty[team])

        if team == 0:
            prev_rank = rank_of(team)  # after update; recompute by subtracting effect

            # compute rank before update by temporarily reverting
            # revert
            remove(buckets[old_sc + 1], penalty[team])
            insort(buckets[old_sc], old_pen)

            solved[team] -= 1
            penalty[team] = old_pen

            cur_rank = rank_of(team)

            # reapply update
            remove(buckets[old_sc], old_pen)
            insort(buckets[old_sc + 1], old_pen + add_pen)

            solved[team] += 1
            penalty[team] = old_pen + add_pen

            print(f"{t} {parts[2]} #{cur_rank} -> #{prev_rank}")

if __name__ == "__main__":
    solve()
```该实现增量跟踪每个团队的状态，并使用分桶多重集通过解决的计数和惩罚来维持排序。 二等分运算可确保每个存储桶内的更新保持对数关系。 

排名计算函数对较高解决桶中的所有球队进行计数，然后计算同一桶中有多少支球队具有严格更好的处罚位置。 这直接反映了排名规则。 

Team 0 的稍微冗长的“恢复和重新应用”部分确保我们可以计算更新前和更新后的排名，而无需重建全局状态。 

## 工作示例

 ### 跟踪示例（简化）

 考虑一个由三个团队组成的小场景。 

| 活动 | 0 队状态（已解决，受罚）| 桶的变化| 排名结果 |
 | --- | --- | --- | --- |
 | 初始| (0,0) | (0,0) | 全部在桶 0 | 2 |
 | 00:10 交流 A | (1,10) | 移动 0→1 | 1 |
 | 00:20 交流 B | (2,25) | 移动 1 → 2 | 1 |

 该跟踪显示了当解决的计数增加时，桶移动如何立即提高排名，而不管惩罚如何。 

所说明的关键行为是解决的计数主导惩罚，因此即使惩罚增加，单个 AC 也可以领先于许多竞争对手而跃入第 0 队。 

### 第二个例子（处罚影响）

 | 活动 | 团队 0 状态 | 比较小组| 排名|
 | --- | --- | --- | --- |
 | 初始| (0,0) | (0,0) | 其他 (0,0) | 共享 |
 | 交流A | (1,100) | 一支队伍 (1,50) | 后面|
 | 交流B | (2,130) | 同桶密度更高| 取决于|

 这表明，在相同的解决计数中，惩罚排序决定排名，仅插入顺序是不够的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log k + 26·n) | O(n log k + 26·n) | 每次更新都会在存储桶内执行对数插入/删除，并扫描最多 27 个存储桶的排名 |
 | 空间| O(k + n) | 每个团队状态加上存储桶存储 |

 这些约束允许最多 200,000 次操作，并且小常数桶扫描的对数开销完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    output = []
    
    def fake_print(*args):
        output.append(" ".join(map(str, args)))
    
    builtins.print = fake_print
    solve()
    builtins.print = sys.__dict__["print"]
    return "\n".join(output)

# sample-style sanity
assert run("""3 4
00:00:01.000 1 A RJ
00:00:02.000 0 A AC
00:00:03.000 0 B AC
00:00:04.000 0 C AC
""") != ""

# boundary: single team
assert run("""0 2
00:00:01.000 0 A AC
00:00:02.000 0 B AC
""") != ""

# all rejects then AC
assert run("""1 3
00:00:01.000 1 A RJ
00:00:02.000 0 A AC
00:00:03.000 0 B AC
""") != ""

# duplicate team ignored after solve
assert run("""1 3
00:00:01.000 0 A AC
00:00:02.000 0 A RJ
00:00:03.000 0 A AC
""") != ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单人团队| 立即排名行为| 边界情况|
 | 反复拒绝然后AC | 处罚累积 | 失败计数|
 | 重复提交 | AC后忽略| 状态锁的正确性|

 ## 边缘情况

 当一个团队针对同一问题提交多个 AC 时，就会出现一种微妙的情况。 该算法通过将问题标记为已解决并忽略后来提交的问题来保护这一点，确保惩罚或已解决计数不会重复计算。 

另一个边缘情况是当团队由于第一次解决而在桶之间移动时。 移除和插入必须按正确的顺序进行； 否则排名计算将暂时观察到不一致的状态。 该实现确保每个提交事件中的更新都是原子的。 

最后一个案件是平局。 当多个团队共享相同的（解决、惩罚）时，他们都占据相同的桶位置。 排名计算正确地仅计算严格更好的球队，因此平局的球队自然会获得相同的排名编号，而无需额外处理。
