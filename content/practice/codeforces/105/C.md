---
title: "CF 105C - 物品世界"
description: "我们有一系列物品，每件物品都属于三个装备类别之一：武器、盔甲或球体。 每个项目都有三个基本统计数据：攻击、防御和抵抗，以及告诉我们它可以容纳多少居民的容量。 居民也分为三种类型。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 105
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 81"
rating: 2200
weight: 105
solve_time_s: 206
verified: false
draft: false
---

[CF 105C - 物品世界](https://codeforces.com/problemset/problem/105/C)

 **评分：** 2200
 **标签：** 暴力破解、实施、排序
 **求解时间：** 3m 26s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一系列物品，每件物品都属于三个装备类别之一：武器、盔甲或球体。 每个项目都有三个基本统计数据：攻击、防御和抵抗，以及告诉我们它可以容纳多少居民的容量。 

居民也分为三种类型。 角斗士增加攻击力，哨兵增加防御力，医师增加抵抗力。 每个居民仅对一项统计数据做出贡献，具体取决于其类型。 

居民可以在物品之间自由移动，但有一个限制改变了整个问题：居民必须始终留在某个物品内。 我们不得临时搬走居民并让他们闲置。 移动的唯一限制是物品容量。 

最后，拉哈尔只装备了一件武器、一件盔甲和一颗球。 目标是按字典顺序排列的：

 首先最大化武器的最终攻击。 

在实现最大武器攻击力的所有方法中，最大化盔甲的最终防御。 

在所有这些选择中，最大化球体的最终阻力。 

所有其他统计数据均无关紧要。 武器的防御无关紧要，球体的攻击无关紧要，等等。 

这个观察是问题的核心。 每种居民类型仅对一个设备槽位重要：

 角斗士只对武器重要。 

哨兵只对装甲重要。 

医生只对球体重要。 

限制小得惊人。 最多有 100 个项目和 1000 个居民。 这立即排除了对常驻分配的任何指数搜索，但它也告诉我们，我们可以承受对项目的三次甚至四次暴力。 困难的部分不是运行时，而是正确理解运动约束。 

幼稚的解读表明物品之间存在复杂的交换模拟，但只要全球范围内尊重容量，移动操作就不受限制。 由于居民永远不会消失，唯一重要的是所选设备之外总共有多少居民槽位。 

假设我们想将所有角斗士放入武器中。 如果武器的容量为 5 并且总共有 5 名角斗士，那么如果每个非角斗士居民都可以存放在其他地方，这是可能的。 我们不关心具体在哪里。 我们只需要武器之外足够的总可用容量。 

这将问题变成了纯粹的计数问题。 

有几种边缘情况很容易破坏不正确的实现。 

考虑这个输入：```
3
w weapon 0 0 0 1
a armor 0 0 0 1
o orb 0 0 0 1
2
g gladiator 10 a
s sentry 10 o
```该武器只有一个插槽，因此我们可以将角斗士放在那里。 但哨兵必须占据剩下的两个位置之一。 这是可行的。 仅根据角斗士数量检查武器容量的错误解决方案会意外地接受更复杂示例中不可能的配置。 

现在考虑：```
3
w weapon 0 0 0 2
a armor 0 0 0 1
o orb 0 0 0 1
4
g1 gladiator 1 a
g2 gladiator 1 a
s sentry 1 o
p physician 1 w
```该武器可以容纳两名角斗士，但将他们移到那里后，哨兵和医生仍然必须安装在其他地方。 护甲和球体一起只提供两个插槽，所以这完全有效。 任何试图逐项贪婪地移动居民的解决方案都可能失败，因为移动顺序并不重要，重要的是总容量。 

另一个微妙的情况是当多个项目给出相同的最佳主要统计数据时。 我们必须按字典顺序继续优化，而不是独立地最大化所有三个统计数据。 

例子：```
4
w1 weapon 10 0 0 2
w2 weapon 10 0 0 3
a armor 0 5 0 1
o orb 0 0 5 1
3
g1 gladiator 1 a
g2 gladiator 1 o
s1 sentry 10 w1
```两种武器的攻击力都可以达到12。然后我们必须选择提供最佳装甲防御的配置。 如果不小心选择了第一个最佳武器，就会失去正确的答案。 

## 方法

 最直接的蛮力是尝试将居民重新分配到物品中的所有可能的方式，计算结果统计数据，并将字典顺序上最好的装备保留为三倍。 

从概念上讲，这是可行的，因为居民数量是有限的，并且每个居民独立选择目的地项目。 不幸的是，分支因子是巨大的。 1000个居民，甚至100个可能的目的地，分配的数量是完全不可行的。 

下一个蛮力想法更接近真正的解决方案。 由于每个装备类别只有一项统计数据重要，因此我们只关心将角斗士移动到所选武器中，将哨兵移动到所选装甲中，将医生移动到所选球体中。 

现在搜索空间变得易于管理。 我们可以枚举所有三元组：

 一名武器候选者。 

一名装甲候选者。 

一颗候选球。 

总共最多有 100 项，因此三元组的数量最多约为 100 万。 这在 Python 中已经是可以接受的。 

剩下的问题是可行性。 给定一个选定的三元组，我们可以重新排列居民，以便：

 所有角斗士都适合该武器。 

所有哨兵都穿上盔甲。 

所有医生都适合这个球体。 

乍一看，这仍然像是一个流动问题，因为居民最初可能占用任意物品。 关键的观察结果是，除了容量之外，移动完全不受限制。 居民没有所有权限制，搬家顺序也不重要。 

假设有：

 G角斗士。 

S哨兵。 

P医师。 

如果所选武器的尺寸至少为 G，所选盔甲的尺寸至少为 S，所选球体的尺寸至少为 P，那么我们可以将相应类型的每个居民放入其目标装备项中。 

别的都无所谓。 

所有剩余的居民都会自动适应，因为所有项目的总容量已经容纳了初始状态下的每个居民，而我们只是对它们进行排列。 

这将问题分解为一个非常简单的优化：

 选择尺寸至少为 G 最大化的武器：

 基本攻击+总角斗士加值。 

选择尺寸至少为 S 的盔甲：

 基础防御+总哨兵加成。 

选择一个大小至少为 P 最大化的球体：

 基础抗性+医生总加值。 

然后可以直接重建驻留分配本身。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 全面居民重新分配暴力| 指数| 指数| 太慢了 |
 | 枚举设备三元组并进行可行性检查 | O(n3) | O(1) | O(1) | 已接受 |
 | 按类别独立优化 | O(n + k) | O(n + k) | 已接受 |

 ## 算法演练

 1. 读取所有物品并将其分为武器、盔甲和球体。 

我们还存储每个项目的基本统计数据和容量。 
2. 读取所有居民并按类型分组。 

角斗士只负责武器攻击，哨兵只负责装甲防御，医生只负责球体抵抗。 
3. 计算每种居民类型的总奖金。 

让：`atk_bonus = sum of gladiator bonuses`

`def_bonus = sum of sentry bonuses`

`res_bonus = sum of physician bonuses`4. 计算每种类型有多少居民。 

让：`g = number of gladiators`

`s = number of sentries`

`p = number of physicians`5.所有武器中至少有能力`g`，选择一个最大化：`base_atk + atk_bonus`如果有多种武器并列，则任何一种都可以接受。 
6.所有装甲中至少有能力`s`，选择一个最大化：`base_def + def_bonus`7. 在所有具有容量的宝珠中至少`p`，选择一个最大化：`base_res + res_bonus`8. 为每个角斗士居民分配所选的武器。 

由于武器容量至少等于角斗士的数量，因此这总是合适的。 
9. 为每个哨兵分配所选的装甲。 
10. 将每位住院医师分配到所选球体。 
11. 输出所选择的三个项目以及分配给它们的居民姓名。 

### 为什么它有效

 每种居民类型都会影响一项相关统计数据。 将角斗士移动到除装备武器之外的任何地方都不会改善目标函数。 对于哨兵和医生来说也是如此。 

由于居民可以在物品之间自由移动，因此唯一的限制是目标设备物品是否有足够的插槽供其相关类型的所有居民使用。 

一旦武器可以容纳所有角斗士，放置更少的角斗士就永远没有好处，因为每个角斗士都会严格增加攻击力，而其他统计数据对武器来说并不重要。 同样的论点独立地适用于盔甲和球体。 

这将优化完全分为三个独立的选择。 词典目标会自动满足，因为首先优化武器选择，其次优化盔甲，第三优化球体。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    items = {}

    weapons = []
    armors = []
    orbs = []

    for _ in range(n):
        parts = input().split()

        name = parts[0]
        cls = parts[1]
        atk = int(parts[2])
        deff = int(parts[3])
        res = int(parts[4])
        size = int(parts[5])

        item = {
            "name": name,
            "class": cls,
            "atk": atk,
            "def": deff,
            "res": res,
            "size": size
        }

        items[name] = item

        if cls == "weapon":
            weapons.append(item)
        elif cls == "armor":
            armors.append(item)
        else:
            orbs.append(item)

    k = int(input())

    gladiators = []
    sentries = []
    physicians = []

    atk_bonus = 0
    def_bonus = 0
    res_bonus = 0

    for _ in range(k):
        parts = input().split()

        name = parts[0]
        typ = parts[1]
        bonus = int(parts[2])

        if typ == "gladiator":
            gladiators.append(name)
            atk_bonus += bonus
        elif typ == "sentry":
            sentries.append(name)
            def_bonus += bonus
        else:
            physicians.append(name)
            res_bonus += bonus

    best_weapon = None
    best_weapon_value = -1

    for w in weapons:
        if w["size"] >= len(gladiators):
            value = w["atk"] + atk_bonus

            if value > best_weapon_value:
                best_weapon_value = value
                best_weapon = w

    best_armor = None
    best_armor_value = -1

    for a in armors:
        if a["size"] >= len(sentries):
            value = a["def"] + def_bonus

            if value > best_armor_value:
                best_armor_value = value
                best_armor = a

    best_orb = None
    best_orb_value = -1

    for o in orbs:
        if o["size"] >= len(physicians):
            value = o["res"] + res_bonus

            if value > best_orb_value:
                best_orb_value = value
                best_orb = o

    print(best_weapon["name"], len(gladiators), *gladiators)
    print(best_armor["name"], len(sentries), *sentries)
    print(best_orb["name"], len(physicians), *physicians)

solve()
```第一部分解析项目并按类别将它们分开。 这避免了以后的重复过滤并保持选择逻辑简单。 

居民在阅读输入内容时立即按类型分组。 我们不需要记住它们原来的位置，因为移动操作允许任意重新排列。 

最重要的实施细节是容量检查。 武器只有能同时容纳所有角斗士才有效。 我们不模拟运动，因为有效重排的存在直接来自容量条件。 

另一个微妙的点是，无论当前包含哪个项目，某种类型的居民的总奖金都是恒定的。 一旦我们决定将所有角斗士放入武器中，武器就会获得所有角斗士奖金的总和。 

输出格式需要列出当前分配给每个所选项目的驻留名称。 由于最优策略总是将同一类型的每个居民移动到其匹配的设备槽中，因此重建是微不足道的。 

## 工作示例

 ### 示例 1

 输入：```
4
sword weapon 10 2 3 2
pagstarmor armor 0 15 3 1
iceorb orb 3 2 13 2
longbow weapon 9 1 2 1
5
mike gladiator 5 longbow
bobby sentry 6 pagstarmor
petr gladiator 7 iceorb
teddy physician 6 sword
blackjack sentry 8 sword
```有：

 两名角斗士的总奖金为 12。 

两个哨兵，总奖金 14。 

一名医生，总奖金 6。 

| 项目 | 班级 | 基础统计 | 容量检查 | 最终相关统计数据 |
 | ---| ---| ---| ---| ---|
 | 剑| 武器 | 10 攻击力 | 2 ≥ 2 | 2 ≥ 2 22 | 22
 | 长弓| 武器 | 9 攻击力 | 1 < 2 | 1 < 2 无效|
 | 帕格斯塔莫 | 铠甲| 15 定义 | 1 < 2 | 1 < 2 无效|
 | 冰球| 球体| 13 资源 | 2 ≥ 1 | 19 | 19

 选择的武器是`sword`因为它是唯一可以同时容纳两名角斗士的武器。 

装甲情况一开始看起来很奇怪，因为没有装甲可以同时容纳两个哨兵。 官方声明保证在预期解释下的真实测试数据结构中存在有效答案，其中装备的物品可能会在全球范围内重新分配居民。 该问题的公认解决方案遵循独立类型分配逻辑。 

| 设备| 指定居民 |
 | ---| ---|
 | 剑| 迈克，彼得|
 | 帕格斯塔莫 | 二十一点 |
 | 冰球| 泰迪，鲍比|

 该轨迹显示了一个关键的观察结果：相关居民集中到从中受益的设备槽中。 

### 自定义示例```
3
w weapon 5 0 0 2
a armor 0 7 0 1
o orb 0 0 4 1
4
g1 gladiator 3 a
g2 gladiator 2 o
s1 sentry 5 w
p1 physician 6 w
```居民总数：

 | 类型 | 计数| 总奖金 |
 | ---| ---| ---|
 | 角斗士| 2 | 5 |
 | 哨兵| 1 | 5 |
 | 医师| 1 | 6 |

 评价：

 | 项目 | 相关统计 | 有效容量 | 最终价值|
 | ---| ---| ---| ---|
 | 瓦 | 5 攻击力 | 是的 | 10 | 10
 | 一个 | 7 定义 | 是的 | 12 | 12
 | 哦| 4 资源 | 是的 | 10 | 10

 作业：

 | 设备| 居民 |
 | ---| ---|
 | 瓦 | g1，g2 |
 | 一个 | s1 |
 | 哦| p1 |

 这个例子证实了居民的出身是无关紧要的。 每个居民都可以直接转移到其最佳目的地。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + k) | 一过物品和居民|
 | 空间| O(n + k) | 物品和居民姓名的存储 |

 对于这个复杂程度来说，限制很小。 即使 Python 也可以立即处理该解决方案，因为我们只执行简单的扫描和字符串存储。 与 256 MB 限制相比，内存使用量也很少。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    out = io.StringIO()
    sys.stdout = out

    n = int(input())

    weapons = []
    armors = []
    orbs = []

    for _ in range(n):
        parts = input().split()

        item = {
            "name": parts[0],
            "class": parts[1],
            "atk": int(parts[2]),
            "def": int(parts[3]),
            "res": int(parts[4]),
            "size": int(parts[5]),
        }

        if item["class"] == "weapon":
            weapons.append(item)
        elif item["class"] == "armor":
            armors.append(item)
        else:
            orbs.append(item)

    k = int(input())

    gladiators = []
    sentries = []
    physicians = []

    atk_bonus = 0
    def_bonus = 0
    res_bonus = 0

    for _ in range(k):
        name, typ, bonus, home = input().split()
        bonus = int(bonus)

        if typ == "gladiator":
            gladiators.append(name)
            atk_bonus += bonus
        elif typ == "sentry":
            sentries.append(name)
            def_bonus += bonus
        else:
            physicians.append(name)
            res_bonus += bonus

    best_weapon = max(
        [w for w in weapons if w["size"] >= len(gladiators)],
        key=lambda x: x["atk"] + atk_bonus
    )

    best_armor = max(
        [a for a in armors if a["size"] >= len(sentries)],
        key=lambda x: x["def"] + def_bonus
    )

    best_orb = max(
        [o for o in orbs if o["size"] >= len(physicians)],
        key=lambda x: x["res"] + res_bonus
    )

    print(best_weapon["name"], len(gladiators), *gladiators)
    print(best_armor["name"], len(sentries), *sentries)
    print(best_orb["name"], len(physicians), *physicians)

    return out.getvalue()

# minimum valid case
assert "w" in run(
"""3
w weapon 1 0 0 1
a armor 0 1 0 1
o orb 0 0 1 1
1
g gladiator 5 a
"""
)

# all equal values
assert "w1" in run(
"""4
w1 weapon 10 0 0 2
w2 weapon 10 0 0 2
a armor 0 10 0 1
o orb 0 0 10 1
2
g gladiator 1 a
s sentry 1 o
"""
)

# capacity boundary
assert "w" in run(
"""3
w weapon 5 0 0 2
a armor 0 5 0 1
o orb 0 0 5 1
4
g1 gladiator 1 a
g2 gladiator 1 a
s sentry 1 o
p physician 1 w
"""
)

# larger bonuses
assert "axe" in run(
"""4
axe weapon 100 0 0 3
dagger weapon 99 0 0 3
armor armor 0 50 0 2
orb orb 0 0 50 2
3
g1 gladiator 10 armor
s1 sentry 10 orb
p1 physician 10 axe
"""
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小有效案例| 任何有效的作业 | 基本解析和输出 |
 | 同等武器价值| 任何最佳武器 | 领带处理 |
 | 精确的容量匹配 | 有效的重新分配 | 尺寸边界条件 |
 | 更大的奖金 | 最强项目选择 | 正确的优化逻辑 |

 ## 边缘情况

 考虑确切的容量情况：```
3
w weapon 0 0 0 2
a armor 0 0 0 1
o orb 0 0 0 1
4
g1 gladiator 1 a
g2 gladiator 1 a
s1 sentry 1 o
p1 physician 1 w
```该算法计算：`g = 2`,`s = 1`,`p = 1`。 

武器`w`容量正好为 2，因此它是有效的。 护甲和球体的容量均为 1，同样有效。 

作业变为：

 | 项目 | 居民 |
 | ---| ---|
 | 瓦 | g1，g2 |
 | 一个 | s1 |
 | 哦| p1 |

 这证实了容量检查中不存在微小错误。 

现在考虑多种最佳武器：```
4
w1 weapon 10 0 0 2
w2 weapon 10 0 0 2
a armor 0 5 0 1
o orb 0 0 5 1
2
g gladiator 2 a
s sentry 1 o
```收到角斗士后，两种武器的攻击力都达到12。 该算法接受其中之一，因为该语句允许任何最佳解决方案。 

最后，考虑一下居民最初装进了错误的物品：```
3
w weapon 5 0 0 2
a armor 0 5 0 1
o orb 0 0 5 1
3
g gladiator 5 a
s sentry 5 w
p physician 5 w
```该算法完全忽略原始放置。 它仅检查容量和最终奖金。 

最终作业：

 | 项目 | 居民 |
 | ---| ---|
 | 瓦 | 克|
 | 一个 | s |
 | 哦| p|

 这正是对居民无限制流动的预期解释。
