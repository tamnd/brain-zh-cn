---
title: "CF 106188B - MLG 360 无瞄准镜"
description: "我们有一个玩家站在网格上的坐标（ex，ey）处。 玩家面向八个罗盘方向之一，并在旋转一整圈后发射子弹。 旋转不会改变最终方向，因此子弹只是永远沿原始方向行进。"
date: "2026-06-25T10:46:05+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106188
codeforces_index: "B"
codeforces_contest_name: "UTPC x WiCS Contest 11-12-2025"
rating: 0
weight: 106188
solve_time_s: 37
verified: true
draft: false
---

[CF 106188B - MLG 360 无范围](https://codeforces.com/problemset/problem/106188/B)

 **评级：** -
 **标签：** -
 **求解时间：** 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个玩家站在某个坐标处`(ex, ey)`在网格上。 玩家面向八个罗盘方向之一，并在旋转一整圈后发射子弹。 旋转不会改变最终方向，因此子弹只是永远沿原始方向行进。 在所有给定的敌人位置中，我们需要找到子弹到达的第一个敌人。 如果子弹路径不包含敌人，我们打印`-1`。 

输入给出了敌人的数量、玩家的位置、面向的方向以及每个敌人的坐标。 输出是沿该射线最接近玩家的敌人的坐标。 

坐标的边界为`100000`，敌人的数量也可以达到`100000`。 检查子弹路径中每个网格位置的解决方案最多可以执行大约`100000`每个方向进行检查，这是不必要的。 既然可以有`100000`敌人，我们需要一个算法来处理每个敌人恒定的次数，给出`O(n)`解决方案。 排序也是可能的，但线性扫描就足够了，因为可能的方向数量很少。 

棘手的情况来自于混淆“同一条线”和“在子弹路径中”。 例如，如果玩家处于`(1,1)`面对`NORTHEAST`，一个敌人在`(3,3)`被击中，答案是：```
3 3
```一个粗心的解决方案只检查对角方程但忘记方向可能会错误地接受`(0,0)`在允许负坐标的问题版本中，因为它位于同一对角线上但在玩家后面。 

另一个边缘情况是同一条射线上有多个敌人。 对于输入：```
2 1 1
EAST
3 1
5 1
```正确的输出是：```
3 1
```第一个敌人阻挡了第二个敌人。 仅检查该方向是否有敌人并保留最后发现的敌人可能会返回错误的目标。 

最后一个常见的错误是处理玩家自己的牌。 例如：```
1 1 1
NORTH
1 1
```答案是：```
1 1
```敌人位于起始位置，并且是遇到的第一个实体。 仅从下一个图块开始严格向前搜索的解决方案将会错过它。 

## 方法

 最直接的方法是模拟子弹路径。 从玩家的位置开始，向所选方向一次移动一个方块，并检查每个访问的坐标是否有敌人。 如果我们将敌人存储在一个集合中，那么这可以很容易实现并且是正确的，因为在路径上遇到的第一个坐标正是击中的第一个敌人。 

问题在于子弹可能穿过的空白空间的大小。 坐标范围达到`100000`，因此一次模拟可能需要大约`100000`步骤。 在某些情况下，对大量输入重复此操作仍然是可以管理的，但它会浪费工作，因为大多数访问的单元格不包含敌人。 网格很大，敌人数量却只有`100000`。 

关键的观察是我们只关心敌人的坐标。 每个方向都有一个简单的数学条件。 例如，向北移动意味着敌人必须拥有相同的`x`坐标和一个`y`值不小于玩家的值。 向东北移动意味着之间的差异`x`和`y`必须符合玩家的差异。 光线条件告诉我们哪些敌人是候选者，而与玩家的距离告诉我们首先到达哪个候选者。 

在对所有敌人进行一次扫描时，我们检查敌人是否位于射线上。 如果确实如此，我们会将其距离与迄今为止找到的最佳候选者进行比较。 由于射线仅朝一个方向传播，因此最接近的候选者恰好是第一个命中的射线。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(最大坐标) | O(n) | 从概念上讲太慢，因为它扫描空单元格 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取玩家的位置、方向以及所有敌人的位置。 将方向转换为运动向量`(dx, dy)`。 例如，北变为`(0, 1)`西南变成`(-1, -1)`。 这让每个方向都使用相同的逻辑。 
2. 对于每个敌人，计算与玩家的差异：`(tx, ty) = (enemy_x - ex, enemy_y - ey)`只有当敌人位于向量上的某个位置时才能被击中`(dx, dy)`。 
3.检查敌人是否在同一条射线上。 一点`(tx, ty)`当存在一定非负距离时位于射线上`k`这样：`tx = k * dx`和`ty = k * dy`符号必须匹配方向，并且坐标之间的比率必须匹配。 因为运动向量只包含`0`,`1`， 或者`-1`，这可以简化为检查线路状况和方向。 
4. 如果敌人有效，则计算其距离有多远。 平方距离就足够了，因为我们只比较值。 距离最小的候选者是第一个被命中的。 
5.处理完所有敌人后，打印存储的答案。 如果没有找到候选人，则打印`-1`。 

为什么有效：每个可以被击中的敌人都必须满足射线方程，因此该算法永远不会忽略可能的目标。 在所有有效目标中，子弹首先到达距离最小的目标，因为子弹从玩家不断向外移动。 保持最小距离可以保持这样的不变性：存储的答案始终是迄今为止看到的最接近的有效敌人。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, ex, ey = map(int, input().split())
    direction = input().strip()

    enemies = []
    for _ in range(n):
        x, y = map(int, input().split())
        enemies.append((x, y))

    moves = {
        "NORTH": (0, 1),
        "NORTHEAST": (1, 1),
        "EAST": (1, 0),
        "SOUTHEAST": (1, -1),
        "SOUTH": (0, -1),
        "SOUTHWEST": (-1, -1),
        "WEST": (-1, 0),
        "NORTHWEST": (-1, 1),
    }

    dx, dy = moves[direction]

    best_dist = float("inf")
    ans = None

    for x, y in enemies:
        tx = x - ex
        ty = y - ey

        if dx == 0:
            if tx != 0:
                continue
            if ty * dy < 0:
                continue
        elif dy == 0:
            if ty != 0:
                continue
            if tx * dx < 0:
                continue
        else:
            if tx * dy != ty * dx:
                continue
            if tx * dx < 0 or ty * dy < 0:
                continue

        dist = tx * tx + ty * ty
        if dist < best_dist:
            best_dist = dist
            ans = (x, y)

    if ans is None:
        print(-1)
    else:
        print(ans[0], ans[1])

if __name__ == "__main__":
    solve()
```方向字典将每个可能的面向方向映射到一个向量。 这避免了为八种情况编写单独的逻辑，并使几何检查统一。 

该循环仅检查敌人的位置。 变量`tx`和`ty`代表敌人相对于玩家的位置，这使得检查射线比使用绝对坐标简单得多。 

对于垂直方向，只有`x`坐标必须匹配。 对于水平方向，只有`y`坐标必须匹配。 对于对角线方向，相对坐标必须具有相同的比率，即等于`tx * dy == ty * dx`。 

距离比较使用平方距离，因为不需要平方根。 比较`a^2`和`b^2`给出与比较相同的顺序`a`和`b`。 坐标足够小，Python 整数可以轻松处理乘法。 

## 工作示例

 对于第一个样本：```
1 1 1
NORTHEAST
3 3
```状态变化如下：

 | 敌人| 相对位置| 上雷 | 距离 | 当前答案 |
 | ---| ---| ---| ---| ---|
 | (3,3) | (2,2) | 是的 | 8 | (3,3) |

 敌人与子弹的对角线方向相同，因此成为第一个目标。 

对于第二个例子：```
2 1 1
NORTHEAST
3 4
4 3
```| 敌人| 相对位置| 上雷 | 距离 | 当前答案 |
 | ---| ---| ---| ---| ---|
 | (3,4) | (2,3) | 没有 | 被忽略 | 无 |
 | (4,3) | (3,2) | 没有 | 被忽略 | 无 |

 两个敌人都不在对角线上`y = x`从玩家延伸出来，所以结果是`-1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个敌人都会用恒定时间算术检查一次 |
 | 空间| O(1) | O(1) | 仅存储当前最佳答案和一些变量 |

 该解决方案符合约束条件，因为`100000`敌人只需要`100000`迭代。 每次迭代内的算术运算都是恒定时间。 

## 测试用例```python
import sys
import io

def solve(data):
    input = io.StringIO(data).readline

    n, ex, ey = map(int, input().split())
    direction = input().strip()

    moves = {
        "NORTH": (0, 1),
        "NORTHEAST": (1, 1),
        "EAST": (1, 0),
        "SOUTHEAST": (1, -1),
        "SOUTH": (0, -1),
        "SOUTHWEST": (-1, -1),
        "WEST": (-1, 0),
        "NORTHWEST": (-1, 1),
    }

    dx, dy = moves[direction]

    best = float("inf")
    ans = None

    for _ in range(n):
        x, y = map(int, input().split())
        tx, ty = x - ex, y - ey

        if dx == 0:
            if tx != 0 or ty * dy < 0:
                continue
        elif dy == 0:
            if ty != 0 or tx * dx < 0:
                continue
        else:
            if tx * dy != ty * dx or tx * dx < 0 or ty * dy < 0:
                continue

        dist = tx * tx + ty * ty
        if dist < best:
            best = dist
            ans = (x, y)

    if ans is None:
        return "-1"
    return f"{ans[0]} {ans[1]}"

# samples
assert solve("""1 1 1
NORTHEAST
3 3
""") == "3 3"

assert solve("""2 1 1
NORTHEAST
3 4
4 3
""") == "-1"

# custom cases
assert solve("""1 1 1
NORTH
1 1
""") == "1 1"

assert solve("""3 5 5
EAST
10 5
7 5
8 6
""") == "7 5"

assert solve("""4 10 10
SOUTHWEST
8 8
5 5
9 9
1 2
""") == "9 9"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 1 / NORTH / 1 1`|`1 1`| 起始位置处理|
 |`3 5 5 / EAST / 10 5, 7 5, 8 6`|`7 5`| 选择射线上最近的敌人 |
 |`4 10 10 / SOUTHWEST / 8 8, 5 5, 9 9, 1 2`|`9 9`| 对角线方向并忽略不相关点|

 ## 边缘情况

 对于敌人位于玩家后面的情况，光线方向检查可以防止错误匹配。 如果玩家处于`(1,1)`面对`NORTHEAST`，一个敌人在`(0,0)`would satisfy the diagonal equation but has a negative movement distance, so it is rejected.

 For multiple enemies on the same line, the minimum distance comparison keeps the closest one. 和：```
2 1 1
EAST
3 1
5 1
```第一个敌人有距离`4`，而第二个有距离`16`。 该算法存储`(3,1)`并且永远不会用更远的敌人取代它。 

对于一个坐标中零移动的方向，特殊检查避免除法式逻辑。 面向北意味着所有有效敌人必须具有相同的`x`，并且只有敌人`y >= ey`可以到达。 这可以处理垂直和水平光线，而不会因比较比率而出现任何极端情况。
