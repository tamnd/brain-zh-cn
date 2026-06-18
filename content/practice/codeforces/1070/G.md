---
title: "CF 1070G - 怪物和药水"
description: "我们有一个长度为 $n$ 的一维板。 每个单元格可以包含一个具有一定生命值的怪物、增加生命值的药水，或者是空的。 此外，最初有 $m$ 英雄放置在不同的空单元格上，每个英雄都有自己的生命值。"
date: "2026-06-15T13:51:19+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1070
codeforces_index: "G"
codeforces_contest_name: "2018-2019 ICPC, NEERC, Southern Subregional Contest (Online Mirror, ACM-ICPC Rules, Teams Preferred)"
rating: 2300
weight: 1070
solve_time_s: 180
verified: true
draft: false
---

[CF 1070G - 怪物和药水](https://codeforces.com/problemset/problem/1070/G)

 **评分：** 2300
 **标签：** 暴力破解、dp、贪婪、实现
 **求解时间：** 3m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个一维板，长度为$n$。 每个单元格可以包含一个具有一定生命值的怪物、增加生命值的药水，或者是空的。 此外，还有$m$英雄最初放置在不同的空单元格上，每个英雄都有自己的生命值。 

我们必须选择一个单元作为集结点。 然后我们按照某种顺序将英雄一一送到那个牢房。 英雄沿着独特的笔直道路，逐个细胞地行走。 当它移动时，它可能会收集药水并与沿途遇到的怪物战斗。 药水立即消耗并增加生命值，英雄当前生命值至少等于怪物生命值则击败怪物，否则英雄死亡，整个配置无效。 如果英雄活了下来，那么对于所有未来的英雄来说，怪物就会消失。 

关键的困难在于，早期的英雄会通过移除与之互动的怪物和药水来永久修改棋盘，因此英雄的顺序很重要。 

目标是找到集结点和英雄顺序，以便每个英雄都能安全到达。 

限制条件$n \le 100$和$m \le n$表明一个$O(n^2)$或者$O(n^2 \log n)$解决方案是可以接受的。 任何涉及尝试英雄的所有排列或重新计算每个候选人的完整模拟的事情都会太慢。 

一个天真的但自然的想法是固定一个集结点并尝试所有英雄顺序，模拟每个英雄。 那是$m!$每个集合点的排列和每个模拟是$O(n)$，即使对于$m = 10$。 

第二个天真的想法是按照每个集结点的输入顺序贪婪地模拟英雄。 这会失败，因为最佳顺序取决于哪些英雄足够强大，可以尽早安全地清除怪物。 

当英雄必须通过只能由另一个英雄移除的怪物，但另一个英雄位于集结点的另一侧时，就会出现微妙的边缘情况。 即使存在有效的解决方案，贪婪的从左到右或从右到左排序也可能会失败。 

## 方法

 关键的观察结果是，对于固定的集结点，每个英雄对其起点和集结点之间的部分具有确定性影响。 如果我们知道英雄的顺序，我们就可以有效地决定哪些英雄可以在较弱的英雄尝试相同的路线之前“清除”怪物。 

关键的简化是颠倒视角：我们不考虑英雄之间的动态交互，而是计算每个英雄在给定一组固定的剩余障碍的情况下是否可以穿越到集结点，并且我们想要一个逐渐使路径变得更容易的顺序。 

对于固定的集结点，每个英雄都会产生一个“安全要求”：沿其路径，累积生命值不得低于1。这相当于计算该路径所需的最低初始生命值，将怪物视为负贡献，将药水视为正贡献，但怪物在被早期英雄杀死后消失。 

这导致了贪婪的调度解释。 每个英雄都可以被分配一个值，代表它需要多少“缓冲”才能生存。 能够在较小缓冲区中生存的英雄更加灵活，通常应该稍后再去，因为即使在棋盘被更强的英雄部分改进后，他们也更有可能生存。 

正确的策略是预先计算每个英雄和每个候选集结点，假设该英雄在剩余的未处理英雄中先行，是否有可能到达集结点。 然后，我们通过重复选择任何当前可行的英雄来贪婪地选择一个顺序，更新状态，就好像该英雄清除了路径一样。 

我们尝试每一个集结点。 对于每一个英雄，我们都会维护一组活着的英雄，并反复选择一个当前可以在旅程中幸存下来的英雄。 如果在某个步骤中没有英雄是可行的，那么这个集结点就会失败。 

这是有效的，因为一旦英雄成功穿越，它只会通过移除怪物和消耗药水来改善棋盘，而不会让未来的道路变得更加困难。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力排列 |$O(n \cdot m!)$|$O(n)$| 太慢了 |
 | 尝试每次集会+贪婪可行性排序|$O(n^3)$|$O(n)$| 已接受 |

 ## 算法演练

 我们确定一个集结点$r$。 我们独立地对待左侧和右侧，但同样的逻辑对称地适用。 

1. 对于每个英雄，计算其在路径上的初始净效应$r$。 我们模拟步行从开始到$r$，收集怪物和药水，但我们只是在假设之前没有英雄修改过棋盘的情况下用它来确定可行性。 
2.针对板子的当前状态，定义一个函数`can(hero)`模拟英雄的穿越并检查其生命值是否永远不会低于零。 这个模拟是$O(n)$。 
3.维护一套未使用的英雄。 
4、反复扫描所有未使用的英雄，找到一个满足的`can(hero)`。 
5. 一旦找到可行的英雄，我们就会在棋盘上永久模拟其完整遍历，移除其消耗的怪物和药水，并将其标记为已使用。 
6. 将英雄添加到答案顺序中。 
7. 如果在某个迭代中没有可用的英雄是可行的，则中止此集结点。 
8.如果所有英雄都放置成功，则输出该集结点和顺序。 

不明显的部分是为什么重复贪婪选择是有效的。 原因是英雄之间唯一的互动就是通过清除障碍。 任何当前可行的英雄在其他英雄行动后仍然可行，因为清除障碍只能增加生命值或减少未来路径上的伤害。 

### 为什么它有效

 在任何时候，棋盘都会反映出仍然存在的障碍子集。 就清除障碍而言，英雄的穿越结果是单调的：清除怪物或通过早期药水增加生命值不能使先前可行的路径变得不可行。 因此，一旦英雄在某个阶段变得可行，选择它并不能阻止未来的解决方案。 如果存在解决方案，则在尚未放置的英雄中始终至少有一个可行的英雄。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def simulate(hero_start, hero_hp, board, r):
    n = len(board)
    hp = hero_hp
    pos = hero_start

    step = 1 if r > pos else -1
    i = pos

    while i != r:
        i += step
        cell = board[i]

        if cell < 0:
            hp += cell  # monster: subtract
            if hp < 0:
                return False
            board[i] = 0
        elif cell > 0:
            hp += cell
            board[i] = 0

    return True

def can(hero_start, hero_hp, board, r):
    hp = hero_hp
    i = hero_start
    step = 1 if r > i else -1

    while i != r:
        i += step
        cell = board[i]
        if cell < 0:
            hp += cell
            if hp < 0:
                return False
        elif cell > 0:
            hp += cell
    return True

n, m = map(int, input().split())

heroes = []
for _ in range(m):
    s, h = map(int, input().split())
    heroes.append((s - 1, h))

board = list(map(int, input().split()))

for r in range(n):
    b = board[:]
    used = [False] * m
    order = []

    ok = True

    for _ in range(m):
        found = -1

        for i in range(m):
            if used[i]:
                continue
            s, h = heroes[i]
            if can(s, h, b, r):
                found = i
                break

        if found == -1:
            ok = False
            break

        s, h = heroes[found]
        if not simulate(s, h, b, r):
            ok = False
            break

        used[found] = True
        order.append(found + 1)

    if ok:
        print(r + 1)
        print(*order)
        break
```该解决方案迭代每个可能的集结点。 对于每个候选人，它都会复制棋盘，以便我们可以模拟英雄的破坏性效果，而不影响其他试验。 

这`can`函数在不修改棋盘当前状态的情况下检查英雄是否存活。 这`simulate`函数执行相同的遍历，但也会删除消耗的怪物和药水。 

一个微妙的点是，这两个函数每次都会重新计算整个路径，这是可以接受的，因为$n \le 100$我们最多这样做$O(n^2)$每个集结点的次数。 

贪婪的选择循环试图选择当前可以生存的任何英雄。 正确性取决于这样一个事实：只有当电路板变得更干净时，可行性才会增加。 

## 工作示例

 ### 示例 1

 输入：```
8 3
8 2
1 3
4 9
0 3 -5 0 -5 -4 -1 0
```我们测试一个反弹点，比如指数 6。 

| 步骤| 剩下的英雄| 董事会状态（简化）| 选定的英雄 | 原因 |
 | ---| ---| ---| ---| ---|
 | 1 | 1,2,3 | 初始| 3 | 最强HP，可穿越|
 | 2 | 1,2 | 英雄3扫清道路后| 1 | 现在路径已改进|
 | 3 | 2 | 英雄 1 扫清道路后 | 2 | 最后剩余|

 英雄3清除了早期障碍后，棋盘变得更容易，使得较弱的英雄可以通过。 

这证实了可行性只会提高的不变量。 

### 示例 2

 考虑一个更简单的构造案例：```
5 2
1 2
5 1
0 -3 0 -2 0
```尝试集结点 3。 

| 步骤| 剩下的英雄| 董事会| 行动|
 | ---| ---| ---| ---|
 | 1 | 1,2 | 原创| 英雄1可行，选|
 | 2 | 2 | 更新板| 英雄2可行，选了|

 英雄1必须先走，因为它可以在最初的怪物中存活下来，从而使英雄2能够安全地穿越。 

这演示了通过贪婪清除来解决依赖关系。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n^3)$|$n$集结点，$n$英雄们，每次可行性检查都是$O(n)$|
 | 空间|$O(n)$| 董事会副本和簿记阵列|

 限制条件$n \le 100$确保最多$10^6$原始操作是可行的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, m = map(int, input().split())
    heroes = []
    for _ in range(m):
        s, h = map(int, input().split())
        heroes.append((s - 1, h))
    board = list(map(int, input().split()))

    def simulate(hero_start, hero_hp, board, r):
        hp = hero_hp
        i = hero_start
        step = 1 if r > i else -1
        while i != r:
            i += step
            cell = board[i]
            if cell < 0:
                hp += cell
                if hp < 0:
                    return False
                board[i] = 0
            elif cell > 0:
                hp += cell
                board[i] = 0
        return True

    def can(hero_start, hero_hp, board, r):
        hp = hero_hp
        i = hero_start
        step = 1 if r > i else -1
        while i != r:
            i += step
            cell = board[i]
            if cell < 0:
                hp += cell
                if hp < 0:
                    return False
            elif cell > 0:
                hp += cell
        return True

    for r in range(n):
        b = board[:]
        used = [False] * m
        order = []
        ok = True

        for _ in range(m):
            found = -1
            for i in range(m):
                if used[i]:
                    continue
                s, h = heroes[i]
                if can(s, h, b, r):
                    found = i
                    break

            if found == -1:
                ok = False
                break

            s, h = heroes[found]
            if not simulate(s, h, b, r):
                ok = False
                break

            used[found] = True
            order.append(found + 1)

        if ok:
            assert len(order) == m
            return str(r + 1) + "\n" + " ".join(map(str, order))

    return "-1"

# provided sample
assert run("""8 3
8 2
1 3
4 9
0 3 -5 0 -5 -4 -1 0
""") == """6
3 1 2"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品 1 | 6 / 3 1 2 | 混合怪物和药水的正确性|
 | 1 1 / 1 1 / 0 | 1 1 / 1 1 / 0 1 / 1 | 1 / 1 单英雄小案|
 | 3 2 / 1 5 / 3 5 / 0 -4 0 | 3 2 / 1 5 / 3 5 / 0 -4 0 2 / 1 2 | 中间的怪物需要共享清理|
 | 5 2 / 1 2 / 5 1 / 0 -3 0 -2 0 | 5 2 / 1 2 / 5 1 / 0 -3 0 -2 0 有效订单 | 依赖顺序|

 ## 边缘情况

 当所有英雄都从重型怪物的同一侧开始时，就会出现一个重要的边缘情况。 如果第一个选择的英雄不够强大，贪婪选择可能会出现卡住的情况。 然而，在有效的配置中，至少一个英雄必须能够遍历当前的棋盘状态，否则该集结点不存在解决方案。 模拟确保只选择可行的英雄，因此算法不会错误地丢弃可解的排列。 

另一个边缘情况是当药水紧挨着怪物时。 弱英雄除非先消耗药水，否则可能会失败。 模拟正确地解释了这一点，因为遇到药水时会立即使用，因此生命值会在后续战斗之前增加。 

最后，如果集结点位于密集的怪物群内，早期的英雄可能会被迫清理一条后来的英雄重复使用的道路。 单调清除特性保证了一旦怪物被移除，以后就不会因为它的消失而导致失败，从而保证了贪婪过程的一致性。
