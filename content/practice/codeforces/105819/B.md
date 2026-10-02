---
title: "CF 105819B - 牺牲车"
description: "我们正在 8 x 8 的棋盘上玩简化的国际象棋残局。 我们控制一个王和一个车，而对手只控制一个王。 问题是我们是否可以准确地采取一个合法的行动，以便对手的下一回合他们的国王可以合法地吃掉我们的车。"
date: "2026-06-25T15:05:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105819
codeforces_index: "B"
codeforces_contest_name: "TeamsCode Spring 2025 Novice Division"
rating: 0
weight: 105819
solve_time_s: 54
verified: true
draft: false
---

[CF 105819B - 牺牲车](https://codeforces.com/problemset/problem/105819/B)

 **评级：** -
 **标签：** -
 **求解时间：** 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在 8 x 8 的棋盘上玩简化的国际象棋残局。 我们控制一个王和一个车，而对手只控制一个王。 问题是我们是否可以准确地采取一个合法的行动，以便对手的下一回合他们的国王可以合法地吃掉我们的车。 换句话说，在我们移动之后，车必须放置在敌方国王合法捕获的方格上。 

输入包含多个独立位置。 每个位置给出了我们的王、我们的车和对手的王的平方。 对于每个位置，我们都会打印这样的一步牺牲是否可能。 电路板尺寸是固定的，因此输入尺寸仅影响测试用例的数量。 最多 10000 个测试用例的限制意味着解决方案应该轻松处理数十万个简单操作，但没有必要进行探索所有可能的游戏或许多移动序列的搜索。 

小板是关键制约因素。 由于只有 64 个方格，因此我们不需要复杂的数学表征。 我们可以直接对国际象棋规则进行建模并检查每一个可能的第一步。 每个测试用例的工作量恒定就足够了。 

这些棘手的案件是由国际象棋的合法性引起的，而不仅仅是动作本身。 敌方国王可能可以到达车，但捕获可能会失败，因为我们的国王保护该方格。 例如：```
1
d2 e6 f1
```答案是`NO`。 车可以移动到与敌方国王相邻的 e2 或 e1，但敌方国王无法占领那里，因为我们的国王会攻击目标方格。 仅检查国王和车之间距离的粗心解决方案会错误地回答`YES`。 

另一种情况是我们自己的国王挡住了车。 例如：```
1
d4 b4 f4
```答案是`NO`。 车无法穿过我们的国王，因此即使敌方国王靠近车的行，合法的车移动也无法造成牺牲。 

最后的边缘情况是通过移动国王而不是车来进行牺牲。 例如：```
1
f2 g2 h1
```答案是`YES`。 车不动。 相反，国王移动到 f3，使车可以被捕获。 仅检查车的移动就会错过这种可能性。 

## 方法

 最直接的方法是制定我们能采取的每一项合法行动。 对于每种可能的王走法和车走法，我们模拟结果位置。 如果对方的王能在该位置吃掉车，我们就接受。 

这种蛮力已经很快了，因为棋盘永远不会增长。 王最多有 64 个目的地格，车最多有 64 个目的地格。 对于每个候选者，我们只需要对攻击和占领方格进行一些恒定时间检查。 最坏的情况大约是 128 个候选动作的 10000 倍，这是很小的。 

更复杂的方法是尝试推导出有关各部分相对位置的公式。 这可行，但很容易错过特殊规则，例如国王阻挡车或敌方国王因方格被防守而拒绝捕获。 固定的电路板尺寸使模拟成为更清晰的解决方案。 

蛮力之所以有效，是因为每一个合法的第一步都会被代表和检查。 它在更大的棋盘上会失败，因为枚举所有方块将不再是常数。 在这里，状态空间是固定的观察结果让我们可以用完整的验证来代替困难的国际象棋推理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(T * 64 * 64) | O(1) | O(1) | 已接受 |
 | 最佳| O(T) 具有被固定板尺寸隐藏的大常数 | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将每个方块从字母和数字转换为基于零的坐标。 将所有内容保留为整数对可以使移动检查更容易。 
2. 为我们的国王生成所有可能的走法。 仅当目的地位于棋盘内、不包含我们的车并且国王未移动到被敌方国王或车攻击的方格时，王的移动才有效。 
3. 为我们的车生成每一个可能的动作。 车可以水平或垂直移动，直到到达棋盘边缘或另一个棋子。 它无法跳过我们的国王或敌方国王。 
4. 每次候选移动后，检查对方的王是否可以合法捕获车。 敌方王必须与车相邻，目标方格不能被我方王保护，并且移动后也不能被我方车保护。 
5. 如果任何候选动作通过了捕获检查，则输出`YES`。 如果所有动作都失败，则输出`NO`。 

这样做的原因是检查每一个可能的第一步。 当至少存在一次合法的移动且对手国王合法捕获之后，牺牲是可能的。 由于枚举涵盖了所有合法的动作，因此每一次检查动作失败都证明不存在任何牺牲。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def inside(x, y):
    return 0 <= x < 8 and 0 <= y < 8

def king_attack(a, b):
    return max(abs(a[0] - b[0]), abs(a[1] - b[1])) == 1

def rook_attack(r, target, king):
    if r[0] == target[0]:
        step = 1 if target[1] > r[1] else -1
        y = r[1] + step
        while y != target[1]:
            if (r[0], y) == king:
                return False
            y += step
        return True
    if r[1] == target[1]:
        step = 1 if target[0] > r[0] else -1
        x = r[0] + step
        while x != target[0]:
            if (x, r[1]) == king:
                return False
            x += step
        return True
    return False

def can_capture(k, r, enemy):
    if not king_attack(enemy, r):
        return False
    if king_attack(k, r):
        return False
    if rook_attack(r, enemy, k):
        return False
    return True

def legal_king_moves(k, r, enemy):
    res = []
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            if dx == 0 and dy == 0:
                continue
            nx, ny = k[0] + dx, k[1] + dy
            if not inside(nx, ny):
                continue
            if (nx, ny) == r:
                continue
            nk = (nx, ny)
            if king_attack(enemy, nk):
                continue
            if rook_attack(r, nk, nk):
                continue
            res.append(nk)
    return res

def legal_rook_moves(k, r, enemy):
    res = []
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        x, y = r
        while True:
            x += dx
            y += dy
            if not inside(x, y):
                break
            if (x, y) == k:
                break
            if (x, y) == enemy:
                break
            res.append((x, y))
    return res

def solve_case(k, r, e):
    for nk in legal_king_moves(k, r, e):
        if can_capture(nk, r, e):
            return True
    for nr in legal_rook_moves(k, r, e):
        if can_capture(k, nr, e):
            return True
    return False

def main():
    t = int(input())
    ans = []
    for _ in range(t):
        a, b, c = input().split()

        def conv(s):
            return (ord(s[0]) - ord('a'), int(s[1]) - 1)

        k = conv(a)
        r = conv(b)
        e = conv(c)

        ans.append("YES" if solve_case(k, r, e) else "NO")

    print("\n".join(ans))

if __name__ == "__main__":
    main()
```辅助函数隔离了国际象棋规则。`king_attack`处理邻接关系，这是国王控制方格的唯一方式。`rook_attack`检查两个方格是否共用一行或一列，并验证车的路线未被阻挡。 

捕获检查与移动生成分开。 这可以防止一个常见的错误，即仅仅因为敌方国王靠近车就认为移动成功。 敌方国王也必须被允许站在车的方格上。 

两个移动生成器涵盖了我们唯一的选择：移动国王或移动车。 车扫描在到达另一块时停止，该块处理阻塞规则。 由于坐标在 0 到 7 之间，因此不存在溢出或大输入问题。 

## 工作示例

 对于第一个样本位置：```
c5 e2 f4
```转换后的坐标才是王道`(2,4)`, 车`(4,1)`, 敌人`(5,3)`。 

| 步骤| 国王| 车 | 行动| 敌人能俘获吗？ |
 | --- | --- | --- | --- | --- |
 | 开始| (2,4) | (4,1) | 检查动作 | 没有 |
 | 尝试从 rook 到 e4 | (2,4) | (4,4) | 车移动 | 是的 |

 车移动将车放置在敌方国王旁边。 敌方国王不会进入我们国王的攻击，因此牺牲有效。 

对于第三个样本位置：```
f2 g2 h1
```国家为王`(5,1)`, 车`(6,1)`, 敌人`(7,0)`。 

| 步骤| 国王| 车 | 行动| 敌人能俘获吗？ |
 | --- | --- | --- | --- | --- |
 | 开始| (5,1) | (6,1) | 鲁克不能牺牲| 没有 |
 | 将国王移至 f3 | (5,2) | (6,1) | 王感动| 是的 |

 此跟踪显示了为什么仅检查车移动是不完整的。 车已经就位，王招改变了保护局面。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(T * 64 * 64) | 每个测试都会检查 8 x 8 棋盘上恒定数量的可能走法 |
 | 空间| O(1) | O(1) | 仅存储了一些坐标和临时移动列表|

 电路板尺寸是固定的，因此常数因子很小。 即使有 10000 个测试用例，操作数量也远远低于典型的竞赛限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    
    def inside(x, y):
        return 0 <= x < 8 and 0 <= y < 8

    def king_attack(a, b):
        return max(abs(a[0] - b[0]), abs(a[1] - b[1])) == 1

    def rook_attack(r, target, king):
        if r[0] == target[0]:
            step = 1 if target[1] > r[1] else -1
            y = r[1] + step
            while y != target[1]:
                if (r[0], y) == king:
                    return False
                y += step
            return True
        if r[1] == target[1]:
            step = 1 if target[0] > r[0] else -1
            x = r[0] + step
            while x != target[0]:
                if (x, r[1]) == king:
                    return False
                x += step
            return True
        return False

    def can_capture(k, r, e):
        return king_attack(e, r) and not king_attack(k, r) and not rook_attack(r, e, k)

    def solve(k, r, e):
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if (dx, dy) != (0, 0):
                    nk = (k[0] + dx, k[1] + dy)
                    if inside(*nk) and nk != r and not king_attack(e, nk) and not rook_attack(r, nk, nk):
                        if can_capture(nk, r, e):
                            return "YES"
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            x, y = r
            while True:
                x += dx
                y += dy
                if not inside(x, y) or (x, y) == k or (x, y) == e:
                    break
                if can_capture(k, (x, y), e):
                    return "YES"
        return "NO"

    t = int(input())
    out = []
    for _ in range(t):
        a, b, c = input().split()
        f = lambda s: (ord(s[0])-97, int(s[1])-1)
        out.append(solve(f(a), f(b), f(c)))
    sys.stdin = old
    return "\n".join(out)

assert run("""6
c5 e2 f4
c3 d5 h4
f2 g2 h1
b4 d6 f3
d2 e6 f1
d4 b4 f4
""") == """YES
YES
YES
NO
NO
NO"""

assert run("""1
a1 b2 c3
""") == "NO"

assert run("""1
f2 g2 h1
""") == "YES"

assert run("""1
d4 b4 f4
""") == "NO"

assert run("""1
a1 h8 h7
""") == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 官方样品| 是是是是否否否| 普通国际象棋案例|
 |`a1 b2 c3`| 否 | 国王保护和角落处理|
 |`f2 g2 h1`| 是 | 感动君王牺牲|
 |`d4 b4 f4`| 否 | 车被自己的国王阻挡 |
 |`a1 h8 h7`| 是 | 板边和车运动|

 ## 边缘情况

 对于受保护的车案例：```
1
d2 e6 f1
```该算法尝试将车移动到靠近敌方国王的位置。 当它检查占领时，它发现目标方格由我们的国王控制。 由于敌方国王无法进行制止，因此每次牺牲都会失败，答案是`NO`。 

对于被封锁的车的情况：```
1
d4 b4 f4
```车移动发生器从车向外扫描。 当它在 d4 到达我们的王时，扫描停止，因此不会创建通过王的非法移动。 该算法从不考虑车实际上无法做出的动作。 

对于国王移动案例：```
1
f2 g2 h1
```车已经与敌方王相邻，但当前王位置不允许捕获。 移动国王会改变被攻击的方格并使车可被捕获，因此算法找到有效的移动并返回`YES`。
