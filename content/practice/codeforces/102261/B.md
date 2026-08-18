---
title: "CF 102261B - \u0421\u043f\u043e\u0440\u0442\u0438\u0432\u043d\u044b\u0439\u0442\u0443\u0440\u043d\u0438\u0440"
description: "我们得到了单场淘汰赛中的国际象棋比赛列表。 正好有 (n=2^k-1) 场比赛，因此锦标赛必须有 (2^k) 名选手和 (k) 轮比赛。"
date: "2026-08-17T20:36:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102261
codeforces_index: "B"
codeforces_contest_name: "\u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e - \u043a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f (\u042f\u043d\u0434\u0435\u043a\u0441)"
rating: 0
weight: 102261
solve_time_s: 120
verified: true
draft: false
---

[CF 102261B - \u0421\u043f\u043e\u0440\u0442\u0438\u0432\u043d\u044b\u0439 \u0442\u0443\u0440\u043d\u0438\u0440](https://codeforces.com/problemset/problem/102261/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了单场淘汰赛中的国际象棋比赛列表。 正好有 (n=2^k-1) 场比赛，因此锦标赛必须有 (2^k) 名选手和 (k) 轮比赛。 对于每场比赛，我们只知道两名参与者，而不知道比赛发生的回合，也不知道谁获胜。 

该任务同时包含两个部分。 首先，我们必须确定记录的对是否可以属于某个有效的单淘汰赛分组。 其次，如果存在这样的括号，我们必须打印出可能进入决赛的两名球员。 他们的实际获胜者未知，因此两名决赛选手都有可能成为锦标赛获胜者。 官方分析是利用每位参赛者所玩的比赛场数来间接重建回合数。 

令 (d(v)) 为涉及玩家 (v) 的已记录游戏数量。 在第 (r) 轮中失败的玩家可以参加 (r) 场比赛，而决赛入围者则可以参加所有 (k) 轮比赛。 因此，只要记录的括号有效，两名决赛入围者必须正是具有 (d(v)=k) 的选手。 

约束 (n\le 2^{16}-1=65535) 意味着最多可以有 (65536) 个不同的参与者。 读取和处理每个游戏恒定次数很容易就足够快一秒，而游戏数量的任何二次方都已经需要在最大大小下进行大约 (4.3\cdot10^9) 次操作。 我们需要一个线性或近线性的解决方案。 

在一些微妙的情况下，仅仅查看底层图表是不够的。 例如，三场比赛```
3
A B
B C
C A
```每个玩家都会参与两次，因此粗心的实现可能会认为这三个参与者都是可能的决赛选手。 正确答案是`NO SOLUTION`，因为四人淘汰赛中的三场比赛不能形成一个循环。 问题不只是程度的问题，而是比赛是否可以分成有效的回合的问题。 

第二个重要案例是```
3
A B
C D
B C
```正确的输出是`B C`。 这里（A）和（D）玩一次，而（B）和（C）玩两次。 前两场比赛可以是第一轮，并且`B C`可以是决赛。 假设输入顺序是时间顺序的解决方案恰好会接受这个示例，但该假设通常是无效的。 

第三种情况是重复参与同一推断回合：```
3
A B
A B
C D
```计数为 (d(A)=d(B)=2) 和 (d(C)=d(D)=1)。 两场比赛`A B`两人都被迫进入参与人数较少的一轮，因此同一名玩家必须在一轮中玩两次。 正确答案是`NO SOLUTION`。 

## 方法

 直接的暴力方法会尝试将每场记录的比赛分配到 (k) 轮中的一轮。 回合 (r) 必须恰好包含 (2^{k-r}) 场比赛，因此 (n) 场比赛可能分配给回合的数量为

 [
 \frac{n!}{\prod_{r=1}^{k}(2^{k-r})!}。 
]

 对于每个这样的任务，我们可以检查是否没有玩家在同一轮中出现两次，以及由此产生的赛程是否构成淘汰赛。 每个候选作业需要 (\Theta(n)) 工作来检查，因此最坏情况的操作计数是

 [
 \θ\左(
 n\cdot
 \frac{n!}{\prod_{r=1}^{k}(2^{k-r})!}
 \右）。 
]

 即使对于（n=7），这也已经考虑了许多可能性，而对于（n=65535），该表达式是完全不可行的。 蛮力在概念上很有用，因为它告诉我们最终必须建立一个有效的解决方案，但当未知的轮数实际上由参与计数决定时，它将未知的轮数视为独立选择。 

关键的观察结果是，玩家 (u) 和 (v) 之间的游戏必须在回合中发生

 [
 \min(d(u),d(v))。 
]

 假设 (d(u)=3) 和 (d(v)=5)。 玩家（u）在第三场比赛后停止参加，因此他们对阵（v）的比赛必须是他们的第三场也是最后一场比赛。 因此，该游戏属于第 3 轮。一旦知道所有参与计数，该轮就没有自由度了。 

这让我们可以为每场比赛定义一个伪回合。 当 (\min(d(u),d(v))=r) 时，游戏 ((u,v)) 属于伪回合 (r)。 在真正的淘汰赛中，第(r)轮正好包含(2^{k-r})场比赛，并且每个玩家在该轮中最多出现一场比赛。 值得注意的是，这两个条件不仅是必要的，而且是充分的。 这是官方解决方案中使用的中心特征。 

为什么充足性是合理的？ 考虑伪第 1 轮。每个参与者都必须出现在那里，因为任何至少玩过一场比赛的人都必须在第 1 轮中开始锦标赛。一旦第一轮被删除，每个剩余的参与者实际上就少玩了一场比赛，因此相同的论点递归地适用于少一轮的锦标赛。 这给出了 (k) 的归纳。 

生成的算法只需要参与计数、伪轮分配以及检查每个伪轮是否包含所需数量的不同参与者。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (\Theta\left(n\cdot\frac{n!}{\prod_r(2^{k-r})!}\right)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(n)) 预期 | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 读取所有 (n) 场比赛并计算每个选手出现的次数。 将此值称为 (d(v))。 这是推断每场比赛的回合所需的唯一信息。 
2. 计算 (k=\log_2(n+1))。 由于输入保证(n=2^k-1)，在Python中我们可以直接获取它：`(n + 1).bit_length() - 1`。 
3. 对于每场记录的比赛 ((u,v))，计算

 [
 r=\min(d(u),d(v))。 
]

 将游戏置于伪回合(r)。 较小的参与计数表明参与者已经完成了最后一场比赛，因此该比赛不能在后面的回合中进行。 
4. 对于从 1 到 (k-1) 的每个伪轮 (r)，验证它是否准确包含

 [
 2^{k-r}
 ]

 游戏。 真正的回合恰好有这么多场比赛，因为在开始时还有 (2^{k-r+1}) 名玩家还活着。 
5. 对于同一个伪回合，维护一组参与者。 如果游戏的任一端点已出现在该集合中，则拒绝输入。 淘汰赛的同一轮比赛中，一名球员不能参加两次比赛。 
6. 找到所有具有 (d(v)=k) 的玩家。 如果前面的检查都通过了，那么这样的玩家肯定有两个。 他们是唯一每轮都存活下来的选手，因此他们是决赛的两名选手。 
7. 打印出这两个名字。 如果任何有效性检查失败，则打印`NO SOLUTION`。 

### 为什么它有效

 不变量是伪回合 (r) 恰好包含真实回合 (r) 中必须发生的比赛。 对于一场比赛 ((u,v))，至少有一个端点必须在该比赛结束后立即停止比赛，因此其回合恰好是 (d(u)) 和 (d(v)) 中较小的一个。 因此，没有有效的括号可以将游戏放置在其他地方。 

如果每个伪回合都有正确的比赛数量，并且没有参与者在一个伪回合内出现两次，则第一个伪回合由有效的不相交的第一轮比赛组成。 每场比赛都有一名参与计数为 1 的球员和一名继续比赛的球员。 删除该伪回合会使每个幸存玩家的参与计数减少 1，并且为具有 (k-1) 轮的锦标赛留下完全相同的条件。 基本情况是两名玩家之间的一场游戏。 归纳起来，整组比赛可以排列为有效的淘汰赛。 

## Python 解决方案```python
import sys
from collections import Counter

input = sys.stdin.readline

def solve():
    n = int(input())
    games = [tuple(input().split()) for _ in range(n)]

    # n = 2^k - 1, so n + 1 = 2^k.
    k = (n + 1).bit_length() - 1

    degree = Counter()

    for u, v in games:
        degree[u] += 1
        degree[v] += 1

    rounds = [[] for _ in range(k + 1)]

    for u, v in games:
        r = min(degree[u], degree[v])

        if r < 1 or r > k:
            print("NO SOLUTION")
            return

        rounds[r].append((u, v))

    for r in range(1, k):
        expected = 1 << (k - r)

        if len(rounds[r]) != expected:
            print("NO SOLUTION")
            return

        used = set()

        for u, v in rounds[r]:
            if u in used or v in used:
                print("NO SOLUTION")
                return

            used.add(u)
            used.add(v)

    finalists = [name for name, cnt in degree.items() if cnt == k]

    if len(finalists) != 2:
        print("NO SOLUTION")
        return

    print(finalists[0], finalists[1])

if __name__ == "__main__":
    solve()
```第一个路过`games`构建`degree`，它直接对应于算法中的参与计数 (d(v))。 一个`Counter`很方便，因为每个姓氏都可以用作字典键。 

第二遍将每个游戏分配给`rounds[min(degree[u], degree[v])]`。 输入保证游戏总数的形式为 (2^k-1)，因此`k`无需浮点对数即可恢复。 使用位运算还可以避免任何舍入问题。 

只有伪回合 1 到 (k-1) 需要显式碰撞检查。 一旦这些回合满足特征，剩余的比赛必然形成最后一轮。 该代码仍然存储伪轮（k），但不需要单独检查它。 

套装`used`每轮都会重新创建。 这是必要的，因为一个玩家可能在几个不同的回合中合法地出现一次。 仅仅因为某个名字出现在前一轮就拒绝它，会错误地拒绝进入后期阶段的玩家。 

最后，有效的锦标赛恰好有两名参与计数为（k）的玩家，即两名决赛入围者。 明确的`len(finalists) != 2`即使输入违反了结构假设，导致早期检查不充分，检查也会使实现变得稳健。 

## 工作示例

 ### 示例 1

 七场比赛意味着 (k=3)，因此有效锦标赛第一轮有四场比赛，第二轮有两场比赛，最后一场是决赛。 

参与次数为

 | 玩家| 玩过的游戏 |
 | ---| ---|
 | 戈尔博夫斯基 | 3 |
 | 阿巴尔金 | 1 |
 | 西科尔斯基 | 2 |
 | 卡默勒 | 1 |
 | 贝科夫 | 2 |
 | 尤尔科夫斯基 | 3 |
 | 普里瓦洛夫 | 1 |
 | 基夫林 | 1 |

 现在按照参与人数较少的对每场比赛进行分类。 

| 游戏| 计数| 伪圆|
 | ---| ---| ---|
 | 戈尔博夫斯基·阿巴尔金 | 3, 1 | 1 |
 | SIKORSKI KAMMERER | 西科尔斯基·卡默勒 2, 1 | 1 |
 | 西科尔斯基·戈尔博夫斯基 | 2, 3 | 2 |
 | 贝科夫·尤尔科夫斯基 | 2, 3 | 2 |
 | 普里瓦洛夫·拜科夫 | 1, 2 | 1 |
 | 戈尔博夫斯基 | 戈尔博夫斯基 | 尤尔科夫斯基 | 3, 3 | 3 |
 | 伊尔科夫斯基·基夫林 | 3, 1 | 1 |

 伪第 1 轮有四场比赛，所有八名选手都只参加一次。 伪第 2 轮有两场比赛，包含`SIKORSKI`,`GORBOVSKII`,`BYKOV`， 和`IURKOVSKII`正好一次。 最终决赛是`GORBOVSKII IURKOVSKII`。 

两名等级为 3 的选手是`GORBOVSKII`和`IURKOVSKII`，所以算法会打印它们。 

### 示例 2

 这里(n=3)，因此(k=2)。 

| 玩家| 玩过的游戏 |
 | ---| ---|
 | 伊万诺夫 | 2 |
 | 彼得罗夫 | 2 |
 | 博希罗夫 | 2 |

 每场比赛都有伪回合

 [
 \min(2,2)=2。 
]

 因此，伪回合 1 包含零场比赛，而不是所需的两场比赛，而伪回合 2 包含所有三场比赛，而不是所需的一场。 

该算法立即拒绝输入。 这说明了为什么仅仅知道三个参与者具有相同的最大程度是不够的。 有效的四人淘汰赛必须在决赛前进行两场首轮比赛。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n)) 预期 | 每个游戏都会被处理固定次数，并且预计会进行集合操作 (O(1))。 |
 | 空间| (O(n)) | (O(n)) | 最多有 (2n) 个参与者事件和 (n) 个存储的游戏。 |

 在最多 (n=65535) 的情况下，该算法仅在大约六万五千个游戏中执行几次线性传递。 不同参与者的数量最多为 (65536)，因此字典、列表和临时集完全在 256 MB 内存限制内。 

## 测试用例```python
import sys
import io
from collections import Counter

def solve():
    input = sys.stdin.readline

    n = int(input())
    games = [tuple(input().split()) for _ in range(n)]

    k = (n + 1).bit_length() - 1

    degree = Counter()
    for u, v in games:
        degree[u] += 1
        degree[v] += 1

    rounds = [[] for _ in range(k + 1)]

    for u, v in games:
        r = min(degree[u], degree[v])
        if r < 1 or r > k:
            print("NO SOLUTION")
            return
        rounds[r].append((u, v))

    for r in range(1, k):
        expected = 1 << (k - r)

        if len(rounds[r]) != expected:
            print("NO SOLUTION")
            return

        used = set()

        for u, v in rounds[r]:
            if u in used or v in used:
                print("NO SOLUTION")
                return
            used.add(u)
            used.add(v)

    finalists = [name for name, cnt in degree.items() if cnt == k]

    if len(finalists) != 2:
        print("NO SOLUTION")
        return

    print(finalists[0], finalists[1])

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def normalized(s: str):
    if s == "NO SOLUTION":
        return s
    return tuple(sorted(s.split()))

sample1 = """\
7
GORBOVSKII ABALKIN
SIKORSKI KAMMERER
SIKORSKI GORBOVSKII
BYKOV IURKOVSKII
PRIVALOV BYKOV
GORBOVSKII IURKOVSKII
IURKOVSKII KIVRIN
"""

sample2 = """\
3
IVANOV PETROV
PETROV BOSHIROV
BOSHIROV IVANOV
"""

assert normalized(run(sample1)) == ("GORBOVSKII", "IURKOVSKII"), "sample 1"
assert run(sample2) == "NO SOLUTION", "sample 2"

minimum_valid = """\
3
A B
C D
B C
"""
assert normalized(run(minimum_valid)) == ("B", "C"), "minimum valid bracket"

all_equal_degrees = """\
3
A B
B C
C A
"""
assert run(all_equal_degrees) == "NO SOLUTION", "cycle with equal degrees"

duplicate_in_round = """\
3
A B
A B
C D
"""
assert run(duplicate_in_round) == "NO SOLUTION", "same player twice in one round"

def make_maximum_valid():
    k = 16
    players = [f"P{i}" for i in range(1 << k)]
    current = players
    games = []

    while len(current) > 1:
        nxt = []
        for i in range(0, len(current), 2):
            u = current[i]
            v = current[i + 1]
            games.append((u, v))
            nxt.append(v)
        current = nxt

    lines = [str(len(games))]
    lines.extend(f"{u} {v}" for u, v in games)
    return "\n".join(lines) + "\n"

maximum_valid = make_maximum_valid()
maximum_answer = normalized(run(maximum_valid))
assert maximum_answer == ("P32767", "P65535"), "maximum valid bracket"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3 / A B / C D / B C`|`B C`| 最低有效锦标赛和正确的最后一轮检测 |
 |`3 / A B / B C / C A`|`NO SOLUTION`| 三名参赛者学位相同，但比赛不能组成一个括号 |
 |`3 / A B / A B / C D`|`NO SOLUTION`| 一名参与者在一轮推断中出现两次 |
 | 生成(65535)-游戏支架|`P32767 P65535`| 最大输入大小、圆形边界和线性时间处理 |

 ## 边缘情况

 三人循环```
3
A B
B C
C A
```给出 (k=2) 和度 (d(A)=d(B)=d(C)=2)。 每个游戏都被分配到伪回合 2，因为最小度始终为 2。伪回合 1 所需的游戏数量为 (2^{2-1}=2)，但其中包含零，因此算法返回`NO SOLUTION`。 这就犯了仅将参与者学位视为充分的错误。 

最低有效锦标赛```
3
A B
C D
B C
```有度数 (1,2,2,1)。 游戏`A B`和`C D`被分配给伪第 1 轮，而`B C`分配给伪第 2 轮。第一轮包含两场不相交的比赛，第二轮包含单场决赛。 两名 2 级选手是`B`和`C`，所以输出是`B C`。 

重复博弈案例```
3
A B
A B
C D
```有度 (2,2,1,1)。 两份副本`A B`被分配给伪第 2 轮，而`C D`被分配给伪回合 1。伪回合 1 具有正确的比赛数量，但伪回合 2 有两场比赛而不是一场。 在重复的参与者可能导致任何歧义之前，计数检查会拒绝它。 

在最大规模下，(n=65535) 给出 (k=16) 且正好 (65536) 个玩家。 第一个伪回合必须包含 (32768) 个不相交的游戏，第二个伪回合必须包含 (16384) 个，依此类推，直到决赛。 生成的最大测试完全遵循这个结构，所有 16 轮中出现的两名玩家是`P32767`和`P65535`。 该实现本身从不构造括号树，它仅验证参与计数隐含的回合结构，这就是为什么相同的线性方法可以处理最小和最大的有效锦标赛。
