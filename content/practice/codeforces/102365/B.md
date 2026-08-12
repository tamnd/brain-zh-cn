---
title: "CF 102365B - 平衡战斗机"
description: "我们有多达 100 名战士。 每个战士都由一个名字和三个统计数据来描述：健康、攻击和防御。 当两名战士相遇时，每一回合都会对双方造成固定伤害。"
date: "2026-08-12T23:45:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102365
codeforces_index: "B"
codeforces_contest_name: "UBC Programming Contest 2019 (UBCPC 2019)"
rating: 0
weight: 102365
solve_time_s: 92
verified: true
draft: false
---

[CF 102365B - 平衡战斗机](https://codeforces.com/problemset/problem/102365/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有多达 100 名战士。 每个战士都由一个名字和三个统计数据来描述：健康、攻击和防御。 当两名战士相遇时，每一回合都会对双方造成固定伤害。 战士的传入伤害是对手的攻击减去自己的防御，固定为零。 两个伤害值同时应用。 

任务是找到每组三名战士，其配对结果形成有向循环。 对于三名战士 A、B 和 C，这意味着一名战士击败第二名，第二名击败第三名，第三名击败第一名。 平局不算是胜利，因此循环中的每条边线都必须代表真正的胜利。 

第一输入行给出 N，后面是 N 个战斗机描述。 输出以有效三元组的数量开始，后跟每个这样的三元组的一行。 三元组的顺序以及每个三元组内三个名称的顺序不受限制。 

对于 O(N^3) 来说，约束 N <= 100 足够小，这意味着我们可以检查每个可能的三组。 我们无法承受的是为每个三元组中的每一对重复模拟数千轮战斗。 如果有 100 架战斗机，则有 C(100, 3) = 161,700 个三元组，如果直接模拟每次战斗，则可能需要数百万或数十亿轮操作。 因此，有用的目标是使每个配对的战斗时间恒定，然后仅花费 O(N^3) 来检查三元组。 

生命值、攻击力和防御力值最多为 10,000。 Python整数可以轻松处理所有涉及的乘积，因此不存在溢出问题。 更重要的是，一旦造成积极伤害，最大生命值限制了杀死战斗机所需的回合数，但依靠这一事实进行直接模拟仍然太昂贵。 

有几种边缘情况可能会导致粗心的实施错误。 第一种是双方都无法伤害对方的战斗。 例如，```
1
Solo 500 500 500
```没有对手，所以答案就是零。 更一般地说，如果两个传入伤害值都为零，则战斗永远不会结束，必须被视为平局。 等待一个生命值变为非正值而不检查零伤害的模拟将永远循环。 

第二个极端情况是同时死亡。 考虑两名具有以下统计数据的战士：```
2
A 4 6 1
B 10 3 1
```A对B每轮造成5点伤害，B对A每轮造成2点伤害。B在2轮后死亡，而A在2轮后也归零。 结果是平局，而不是 A 胜利。 获胜条件很严格：杀戮回合结束后，获胜者必须仍然拥有积极的生命值。 

当一名战士需要几轮才能击败另一名战士时，就会出现第三种边缘情况。 假设A每轮对B造成5点伤害，B一开始有10点生命值，B对A每轮造成2点伤害。如果A有5点生命，则第二轮后双方都会死亡。 如果 A 的 HP 为 6，则 A 在该轮中存活并获胜。 使用非严格比较，例如`<=`在最终的健康测试中，会将第一个案例错误地归类为胜利。 

最后，平局一定不能意外地成为战斗机结果图中的边缘。 包含平局的三元组不能是不及物三元组，即使其他两对配对比赛获胜。 

## 方法

 直接的做法是枚举每一个三重斗士并模拟所需的三场战斗来判断是否是不及物的。 这是正确的，因为不及物三元组的定义仅取决于这三个成对的结果。 如果一次模拟一场战斗，则每一轮都会更新两个生命值，直到一名战士死亡或战斗被视为平局。 

问题是重复工作。 当N为100时，有161,700个可能的三元组。每个三元组需要3次战斗，当每轮伤害只有1点时，一次战斗可能需要最多10,000轮。 这给出了大约 48.5 亿轮模拟的最坏情况上限。 对于许多输入来说，实际数字可能更小，但这远不适合一秒的限制。 

关键的观察是，战斗实际上并不需要逐轮模拟。 面对固定的对手，两名战士每轮都会受到完全相同的伤害。 我们可以计算每个战士需要死多少回合，并直接比较这两个数字。 

假设A正在与B战斗。令`damage_to_A = max(0, AT_B - DF_A)`和`damage_to_B = max(0, AT_A - DF_B)`。 

如果`damage_to_B`呈阳性，B 死亡后`ceil(HP_B / damage_to_B)`回合。 就在那一轮，当 A 的剩余生命值为正时，A 获胜。 因此，当 A 击败 B 时`ceil(HP_B / damage_to_B) * damage_to_A < HP_A`。 

如果B不能伤害A的对手，意味着`damage_to_B`为零，B永远不会死，所以A无法获胜。 同样的推理处理相反的方向。 

这将每对配对的战斗变成了 O(1)。 我们可以预先计算每个有序对的获胜者一次，并将结果存储在布尔矩阵中。 之后，检查三元组只需要一些布尔运算。 暴力破解的想法在外部层面仍然存在，但昂贵的部分已被删除。 

因此，这两种方法之间的关系很简单。 暴力解决方案之所以有效，是因为每个三元组都可以独立检查，但它会失败，因为它重复执行相同的战斗模拟。 观察到战斗每轮都有恒定的伤害，我们可以用算术计算来代替每次模拟。 一旦所有成对结果都被缓存，检查 O(N^3) 中的所有三元组就足够快了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N^3·H) | O(N^3·H) | O(1) | O(1) | 太慢了 |
 | 最佳| O(N^2 + N^3) = O(N^3) | O(N^2 + N^3) = O(N^3) | O(N^2) | O(N^2) | 已接受 |

 这里H是最大模拟轮数，可以大到10,000。 

## 算法演练

 1.读取所有战士并存储他们的姓名、生命值、攻击力和防御力。 我们保持战士的输入顺序，以便每个索引组合`i < j < k`恰好代表一组三名战士。 
2. 创建一个 N × N 布尔矩阵`win`。 价值`win[i][j]`将意味着战斗机 i 击败战斗机 j。 缺失值或错误值意味着我没有获胜，包括失败和平局。 
3. 对于每对不同的战士 A 和 B，计算 A 从 B 受到的伤害以及 B 从 A 受到的伤害。这些值在战斗期间不会改变，因此没有理由模拟各个回合。 
4. 如果B对A的伤害为零，则A不可能击败B，因为A的生命值永远不可能为零。 否则计算B需要死亡的回合数为`(HP_B + damage_to_B - 1) // damage_to_B`。 当 A 在这些回合中受到的伤害仍然严格小于 A 的起始生命值时，A 获胜。 
5. 将结果存储在`win[A][B]`。 对每个订购的对重复此操作。 由于战斗的结果不一定是对称的，因此需要考虑两个方向，尽管实际上一对的计算可以确定两个方向。 
6. 枚举每个三元组`i < j < k`。 如果结果在任一方向形成循环，则三元组有效。 我们检查`i beats j`,`j beats k`,`k beats i`，或逆循环`i beats k`,`k beats j`,`j beats i`。 

检查两个方向很重要，因为输出没有规定哪架战斗机必须首先出现。 对于形成定向循环的任何三架战斗机，这两个方向之一将恰好匹配。 
7. 存储每个有效的三元组，最后打印其计数，后跟三个相应的战斗机名称。 因为索引仅被考虑`i < j < k`，同一套战机永远不可能输出两次。 

为什么它有效：经过预处理后，`win[A][B]`当 A 在 B 的生命值达到零的回合后具有正的生命值时，该值恰好为真。 该回合计数的公式是准确的，因为 B 每回合都会损失相同的正数。 如果 B 无法受到伤害，则存储的结果为假，正确代表平局或 A 无法获胜的情况。 因此，每条边`win`矩阵恰恰代表着真正的胜利。 对于每三个索引，算法精确地接受这三个边形成有向循环的时间，这正是不及物三元组的定义。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    fighters = []
    for _ in range(n):
        name, hp, atk, defense = input().split()
        fighters.append((name, int(hp), int(atk), int(defense)))

    win = [[False] * n for _ in range(n)]

    for i in range(n):
        name_a, hp_a, atk_a, def_a = fighters[i]

        for j in range(n):
            if i == j:
                continue

            name_b, hp_b, atk_b, def_b = fighters[j]

            damage_to_a = max(0, atk_b - def_a)
            damage_to_b = max(0, atk_a - def_b)

            if damage_to_b == 0:
                continue

            rounds_to_kill_b = (
                hp_b + damage_to_b - 1
            ) // damage_to_b

            if rounds_to_kill_b * damage_to_a < hp_a:
                win[i][j] = True

    answer = []

    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                cycle_1 = (
                    win[i][j]
                    and win[j][k]
                    and win[k][i]
                )

                cycle_2 = (
                    win[i][k]
                    and win[k][j]
                    and win[j][i]
                )

                if cycle_1 or cycle_2:
                    answer.append(
                        (fighters[i][0], fighters[j][0], fighters[k][0])
                    )

    print(len(answer))
    for a, b, c in answer:
        print(a, b, c)

if __name__ == "__main__":
    solve()
```输入循环将每个战斗机存储为`(name, HP, AT, DF)`。 将这三个统计数据立即转换为整数可以使后面的算术变得简单。 

成对预处理遵循第四和第五算法步骤。 对于 A 对 B，`damage_to_b`是 B 每轮损失的金额。 如果为零，B 永远无法达到零 HP，因此 A 无法获胜，矩阵条目仍为 false。 

什么时候`damage_to_b`为正数，则上限除法计算出 B 的健康状况为非正数的确切第一轮。 表达式`(hp_b + damage_to_b - 1) // damage_to_b`是上限除法的标准纯整数形式。 Python 任意精度整数也可以进行乘法运算`rounds_to_kill_b * damage_to_a`安全，无需任何特殊处理。 

这种比较是刻意严格的。 如果产品等于`hp_a`，A 在该回合也归零，所以这场战斗是平局。 胜利需要`rounds_to_kill_b * damage_to_a < hp_a`。 

三重循环使用`i < j < k`，因此每组无序的三名战斗机都只出现一次。 这两个循环表达式涵盖了有向三循环的两种可能的方向。 平局永远不会满足任一表达式，因为平局由错误条目表示`win`。 

最终程序中没有出现战斗模拟。 每对都减少为一些算术运算，每个三元组都减少为六个布尔查找。 

## 工作示例

 第一个样本包含五名战士：```
5
TheStrong 90 60 10
TheInvincible 10000 10000 10000
TheTough 70 50 25
TheBrick 3 1 4159
TheResilient 160 40 10
```相关的成对结果可以追踪如下。 

| 配对 | 损害第一 | 对第二个的伤害| 回合杀第二 | 首先生存？ | 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 强者 vs 强者 | 40| 35 | 35 2 | 90 - 70 = 20 > 0 | 90 - 70 = 20 > 0 | 强胜|
 | TheTough 与 TheResilient | 15 | 15 40| 4 | 70 - 60 = 10 > 0 | 70 - 60 = 10 > 0 艰难的胜利 |
 | TheResilient 与 TheStrong | 30| 50 | 50 2 | 160 - 60 = 100 > 0 | 坚韧的胜利 |

 这三个结果形成一个循环`TheStrong -> TheTough -> TheResilient -> TheStrong`。 其他战士不会再创造另一个有效循环，因此最终输出是三倍。```
1
TheStrong TheTough TheResilient
```官方示例允许对名称进行任何排序，因此这相当于示例的排序。 

第二个样本仅包含一架战斗机：```
1
TheLonely 500 500 500
```三重枚举没有满足的组合`i < j < k`，因此根本不需要进行配对战斗。 

| 我| j | k | 三重检查？ | 结果 |
 | --- | --- | --- | --- | --- |
 | 无 | 无 | 无 | 不，N < 3 | 没有三元组|

 因此，输出为：```
0
```该轨迹使用了尽可能小的输入，并确认该算法不假设至少存在三名战斗机。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N^3) | O(N^3) | O(N^2) 成对预处理加上 O(N^3) 三重枚举 |
 | 空间| O(N^2) | O(N^2) | 获胜者矩阵为每个有序对存储一个结果 |

 对于 N = 100，三重枚举仅检查 161,700 种组合。 成对预处理会检查 10,000 个有序对，并且这些循环内的每个操作都是恒定时间。 这完全在规定的范围内。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    fighters = []

    for _ in range(n):
        name, hp, atk, defense = input().split()
        fighters.append((name, int(hp), int(atk), int(defense)))

    win = [[False] * n for _ in range(n)]

    for i in range(n):
        _, hp_a, atk_a, def_a = fighters[i]

        for j in range(n):
            if i == j:
                continue

            _, hp_b, atk_b, def_b = fighters[j]

            damage_to_a = max(0, atk_b - def_a)
            damage_to_b = max(0, atk_a - def_b)

            if damage_to_b == 0:
                continue

            rounds = (hp_b + damage_to_b - 1) // damage_to_b

            if rounds * damage_to_a < hp_a:
                win[i][j] = True

    answer = []

    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                if (
                    (win[i][j] and win[j][k] and win[k][i])
                    or
                    (win[i][k] and win[k][j] and win[j][i])
                ):
                    answer.append((
                        fighters[i][0],
                        fighters[j][0],
                        fighters[k][0]
                    ))

    result = [str(len(answer))]
    for a, b, c in answer:
        result.append(f"{a} {b} {c}")

    return "\n".join(result)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

sample1 = """\
5
TheStrong 90 60 10
TheInvincible 10000 10000 10000
TheTough 70 50 25
TheBrick 3 1 4159
TheResilient 160 40 10
"""

assert run(sample1) == """\
1
TheStrong TheTough TheResilient
""", "sample 1"

assert run("""\
1
TheLonely 500 500 500
""") == """\
0
""", "sample 2"

assert run("""\
3
A 10 10 10
B 10 10 10
C 10 10 10
""") == """\
0
""", "all equal values"

assert run("""\
2
A 4 6 1
B 10 3 1
""") == """\
0
""", "simultaneous death must be a draw"

assert run("""\
3
A 6 6 1
B 10 3 1
C 100 1 100
""") == """\
0
""", "boundary and no-damage cases"

max_input = ["100"]
for i in range(100):
    max_input.append(f"F{i} 10000 10000 10000")

assert run("\n".join(max_input) + "\n") == """\
0
""", "maximum N with all equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / TheLonely 500 500 500`|`0`| 没有可能的三元组的最小尺寸输入 |
 | 三个一模一样的战斗机|`0`| 所有战斗都是平局，因为每次攻击都会被防御吸收 |
 |`A 4 6 1`,`B 10 3 1`|`0`| 两名战士在同一回合中死亡，因此平等不能算作胜利 |
 | 三名战士，其中一名战士防御 100，攻击 1 |`0`| 零伤害战斗和边界算术|
 | 100个一模一样的战斗机|`0`| 实际约束下的最大N和O(N^3)枚举|

 样本测试使用由以下方式产生的确定性顺序`i < j < k`。 由于该问题接受任意顺序，因此不同的有效实现可以以另一种顺序打印相同的三元组。 

## 边缘情况

 零损坏案件是在天花板划分之前处理的。 考虑一场 A 无法伤害 B 的战斗，因为`AT_A <= DF_B`。 然后`damage_to_b`为零，因此 B 的生命值永远不会减少。 算法立即记录`win[A][B] = False`。 例如，与`A 100 10 100`和`B 100 10 100`，双方伤害值都为零，所以战斗是平局。 该算法从不尝试无限模拟。 

同时死亡案件由严格处理`<`比较。 和```
2
A 4 6 1
B 10 3 1
```优惠`6 - 1 = 5`对 B 造成伤害，同时 B 造成`3 - 1 = 2`A、B 的伤害达到零后`ceil(10 / 5) = 2`回合。 A已采取`2 * 2 = 4`伤害，正是其初始健康状况。 自从`4 < 4`是假的，`win[A][B]`仍然是假的。 相反的方向也是错误的，因此结果被正确地视为平局。 

精确的决赛轮边界与另一侧的比较相同。 如果 A 有 5 HP，而不是该示例中的 4 HP，A 将会有`5 - 4 = 1`B死后HP，所以`4 < 5`为真，A 会获胜。 改变一个生命值就会改变游戏规则所规定的结果。 

没有受到对手伤害的战斗机也是正确处理的。 假设A的防御为100，B的攻击为1，则A的伤害为`max(0, 1 - 100) = 0`。 A可以无限期地生存，但这并不意味着A会获胜。 该算法单独检查A最终是否可以杀死B。如果A也造成零伤害，则结果是平局。 如果A造成正伤害，B最终会死亡而A还活着，所以A获胜。 

最后，在两个方向上检查三元组。 假设结果是`A beats B`,`B beats C`， 和`C beats A`。 如果索引恰好按 A、C、B 排序，则第一个循环表达式将与该索引顺序不匹配，但反向表达式却可以。 检查两个方向使得结果独立于战斗机的输入顺序。 因为每个三元组仍然只生成一次`i < j < k`，这不会引入重复输出。
