---
title: "CF 106169D - 宝藏"
description: "该地图是一个矩形的岛屿网格。 单元格可以是阻碍移动的水、空的陆地单元格或包含由大写字母表示的独特地标的单元格。"
date: "2026-06-25T11:08:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106169
codeforces_index: "D"
codeforces_contest_name: "2025-2026 ICPC NERC, Kyrgyzstan Regional Contest"
rating: 0
weight: 106169
solve_time_s: 37
verified: true
draft: false
---

[CF 106169D - 宝藏](https://codeforces.com/problemset/problem/106169/D)

 **评级：** -
 **标签：** -
 **求解时间：** 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该地图是一个矩形的岛屿网格。 单元格可以是阻碍移动的水、空的陆地单元格或包含由大写字母表示的独特地标的单元格。 船长记得从未知的起点到宝藏的确切移动顺序。 地图缺失的部分只隐藏了起始位置，队长知道起始位置一定是地标单元格之一。 

对于每个地标，我们需要决定是否使用它作为起始单元格来完成整个移动序列。 在整个步行过程中，每个访问的单元都必须是陆地，并且每个有效的地标必须按字母顺序打印。 如果没有一个地标可以作为起点，那么答案是`no solution`。 

网格尺寸最多为 1000 x 1000，因此最多可以有 100 万个单元。 指令数量可以达到100000条。尝试每个网格单元并模拟整个路径的解决方案将需要多达100000000000次操作，这远远超出了正常时间限制允许的范围。 我们需要利用这样一个事实：可能的起始位置的数量要少得多：只有 26 个可能的字母。 

这些指令可以在一个方向上移动很远，一个常见的错误是只检查最终目的地。 例如，路径可以在陆地上开始和结束，但在中间穿过水域。 

例子：```
5 5
#####
#A..#
#.#.#
#...#
#####
1
S 2
```正确的输出是：```
no solution
```开始是`A`在第 2 行第 2 列。向南移动两次后，路径尝试进入第 3 行第 2 列，即水。 仅检查最终位置的解决方案将错误地接受开始，因为在完整移动后可以到达最终单元格。 

另一种边缘情况是路径净位移为零但仍穿过阻塞单元。 

例子：```
5 5
#####
#A#.#
#...#
#...#
#####
2
S 2
N 2
```正确的输出是：```
no solution
```路径返回原来的单元格，但是第一个动作进入下面的水单元格`A`。 中间状态才是重要的。 

## 方法

 直接的暴力解决方案将检查地图中每个可能的起始单元格。 对于每个单元，它将重播所有指令，并在路径进入水中时停止。 这是正确的，因为它准确地检查了问题所描述的条件。 然而，网格最多可以包含一百万个单元，并且指令列表可以包含100000个动作。 在最坏的情况下，这会进行大约 100000000000 次移动检查，这太慢了。 

关键的观察是船长只能从一个地标单元开始。 该地图最多包含 26 个这样的单元格，因为每个地标都有不同的大写字母。 我们不需要测试所有细胞，而只需测试这几个候选细胞。 

对于每个地标，我们模拟一次路径。 如果中间位置位于岛外或有水，则该地标无效。 否则，这是一个有效的答案。 由于最多有26次模拟，所以总的操作数大约只有指令数的26倍。 

蛮力之所以有效，是因为模拟路径可以正确识别起始位置是否有效，但它会在数百万个不可能的起始位置上浪费精力。 只有地标才能作为起点的观察结果将搜索空间从整个网格减少到恒定大小的集合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nm·k) | O(纳米) | 太慢了 |
 | 最佳 | O(26·k + nm) | O(26·k + nm) | O(纳米) | 已接受 |

 ## 算法演练

 1. 读取网格并存储每个地标的位置。 网格本身被保留，因为每个模拟运动都需要知道目标单元是否是水。 
2. 将每条指令转换为行和列的变化。 例如，向北移动会使行减少一，而向东移动则使列增加一。 保持这种形式的运动使模拟变得简单。 
3. 对于每个存储的地标位置，从该单元格开始模拟。 当前位置被初始化为地标坐标，因为缺少的起点必须是视线。 
4. 一项一项地应用说明。 每条指令后，更新当前行和列，然后检查新单元格。 如果位置在网格之外或者包含`#`，将此地标标记为无效并停止检查。 
5. 如果完成所有说明后没有碰到水，请将此标志性字母添加到答案中。 由于稍后按字母顺序检查地标，因此满足输出格式。 
6. 如果没有地标在模拟中幸存下来，则打印`no solution`。 

工作原理：对于固定地标，该算法遵循与船长在从那里开始时将访问的位置完全相同的顺序。 仅当每个访问位置都是有效的岛屿单元时，地标才会被接受。 因此，每个被接受的地标都是一个可能的起点，而每个被拒绝的地标都会失败，因为实际路径会在某个步骤遇到水。 检查所有可能的地标涵盖了完整的有效开始集。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    grid = []
    sights = []

    for i in range(n):
        row = input().strip()
        grid.append(row)
        for j, ch in enumerate(row):
            if 'A' <= ch <= 'Z':
                sights.append((ch, i, j))

    k = int(input())
    moves = []

    for _ in range(k):
        d, length = input().split()
        length = int(length)
        if d == 'N':
            moves.append((-length, 0))
        elif d == 'S':
            moves.append((length, 0))
        elif d == 'W':
            moves.append((0, -length))
        else:
            moves.append((0, length))

    ans = []

    for ch, sr, sc in sights:
        r, c = sr, sc
        ok = True

        for dr, dc in moves:
            r += dr
            c += dc

            if r < 0 or r >= n or c < 0 or c >= m or grid[r][c] == '#':
                ok = False
                break

        if ok:
            ans.append(ch)

    ans.sort()

    if ans:
        print(''.join(ans))
    else:
        print("no solution")

if __name__ == "__main__":
    solve()
```网格存储为字符串，因此访问单元格的时间是恒定的。 名单`sights`仅包含可能的起始位置，这使得模拟计数较小。 

每条指令立即转换为行和列偏移量。 该代码将移动长度保持在偏移量内，而不是多次重复单单元格移动，从而避免了不必要的工作。 一个动作就像`N 1000`将行更改为`-1000`一次，只有目的地很重要，因为问题保证移动是沿着单元格之间的直线进行的。 如果单个指令跳过水面，则仅检查目标单元格是不够的，因为整个段必须是清晰的。 输入的运动长度最多为 1000，因此模拟还必须检查中间单元。 

上面提供的实现可以通过存储前缀位移和使用范围检查来进一步优化，但约束已经使直接地标模拟足够了。 由于最多有 26 个地标，因此只有在总步行距离有限的情况下，将每条指令扩展其长度仍然足够小。 相反，代码使用更强的观察，即方向段必须沿着其单元格进行验证。 下面的实现包括缺少验证。```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    grid = []
    sights = []

    for i in range(n):
        row = input().strip()
        grid.append(row)
        for j, ch in enumerate(row):
            if 'A' <= ch <= 'Z':
                sights.append((ch, i, j))

    k = int(input())
    moves = []

    for _ in range(k):
        d, length = input().split()
        length = int(length)
        if d == 'N':
            moves.append((-1, 0, length))
        elif d == 'S':
            moves.append((1, 0, length))
        elif d == 'W':
            moves.append((0, -1, length))
        else:
            moves.append((0, 1, length))

    ans = []

    for ch, r, c in sights:
        ok = True

        for dr, dc, length in moves:
            for _ in range(length):
                r += dr
                c += dc
                if r < 0 or r >= n or c < 0 or c >= m or grid[r][c] == '#':
                    ok = False
                    break
            if not ok:
                break

        if ok:
            ans.append(ch)

    ans.sort()
    print(''.join(ans) if ans else "no solution")

if __name__ == "__main__":
    solve()
```第二个版本是最终的实现。 内部循环检查移动指令遍历的每个方块，这是必需的，因为移动可以穿过阻塞的单元格。 总行走距离以指令数量乘以一条指令的最大长度为界，并且仅乘以地标数量。 在给定的限制下，这仍然在可接受的范围内。 

重要的边界条件是进入新单元后立即进行检查。 起始地标本身保证是陆地，因此不需要单独验证。 此外，在访问之前会检查行索引和列索引`grid[r][c]`以避免无效的内存访问。 

## 工作示例

 对于第一个样本：```
6 10
##########
#K#..#####
#.#..##.##
#..L.#...#
###D###A.#
##########
4
N 2
S 1
E 1
W 2
```模拟是：

 | 地标| N 2 之后 | S 1 之后 | E 1 之后 | W 2 之后 | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 一个 | 第 2 行第 8 栏 | 第 3 行第 8 栏 | 第 3 行第 9 栏 | 第 3 行第 7 栏 | 有效 |
 | d | 第 2 行第 4 栏 | 第 3 行第 4 栏 | 第 3 行第 5 栏 | 第 3 行第 3 栏 | 有效 |
 | 克 | 碰到水| | | | 无效|
 | 左 | 碰到水| | | | 无效|

 有效的地标是`A`和`D`，所以答案是：```
AD
```这条轨迹显示了为什么中间位置很重要。 单独的最终位移并不能识别无效的启动。 

对于第二个样本：```
3 4
####
#.A#
####
2
W 1
N 2
```| 地标| W 1 之后 | N 2 之后 | 结果 |
 | ---| ---| ---| ---|
 | 一个 | 水 | 未检查 | 无效|

 唯一的地标立即失败，因为第一条指令进入了墙壁。 不存在有效的起始位置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(26·总步行距离) | 通过每个运动步骤模拟每个可能的地标 |
 | 空间| O(纳米) | 存储网格以用于恒定时间单元检查 |

 网格最多包含 100 万个单元，并且地标的数量限制为 26 个。这使得模拟数量对于约束而言足够小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().splitlines()
    sys.stdin = old

    it = iter(data)
    n, m = map(int, next(it).split())
    grid = []
    sights = []

    for i in range(n):
        row = next(it)
        grid.append(row)
        for j, ch in enumerate(row):
            if 'A' <= ch <= 'Z':
                sights.append((ch, i, j))

    k = int(next(it))
    moves = []
    for _ in range(k):
        d, x = next(it).split()
        x = int(x)
        if d == 'N':
            moves.append((-1, 0, x))
        elif d == 'S':
            moves.append((1, 0, x))
        elif d == 'W':
            moves.append((0, -1, x))
        else:
            moves.append((0, 1, x))

    ans = []
    for ch, r, c in sights:
        ok = True
        for dr, dc, x in moves:
            for _ in range(x):
                r += dr
                c += dc
                if r < 0 or r >= n or c < 0 or c >= m or grid[r][c] == '#':
                    ok = False
                    break
            if not ok:
                break
        if ok:
            ans.append(ch)

    ans.sort()
    return ''.join(ans) if ans else "no solution"

assert run("""6 10
##########
#K#..#####
#.#..##.##
#..L.#...#
###D###A.#
##########
4
N 2
S 1
E 1
W 2
""") == "AD"

assert run("""3 4
####
#.A#
####
2
W 1
N 2
""") == "no solution"

assert run("""3 3
###
#A#
###
1
N 1
""") == "no solution"

assert run("""5 5
#####
#A.##
#..B#
#...#
#####
1
S 1
""") == "AB"

assert run("""5 5
#####
#A..#
#...#
#..B#
#####
2
S 2
N 2
""") == "AB"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 第一个样品|`AD`| 多个有效地标和字母输出 |
 | 第二个样品|`no solution`| 立即撞墙|
 | 第三个定制案例 |`no solution`| 进入边界的最小移动量 |
 | 第四个定制案例 |`AB`| 多次有效启动|
 | 第五定制案例|`AB`| 有效移动后返回起点的路径 |

 ## 边缘情况

 对于中间穿过水域的路径，算法会检查每个单独的移动步骤。 例如：```
5 5
#####
#A..#
#.#.#
#...#
#####
1
S 2
```模拟开始于`A`，向南移动一个单元格，到达`#`。 它立即拒绝该地标，而不考虑最终目的地。 

对于返回起点的路径，该算法并不认为最终位移为零就足够了。 例如：```
5 5
#####
#A..#
#...#
#...#
#####
2
S 2
N 2
```前两步向下穿过有效单元格，接下来的两步向上返回。 由于每个访问的单元格都是陆地，因此起点被接受。 仅最终位置并不能将这种情况与之前失败的路径区分开来。 

对于边界附近的地标，在索引网格之前，会根据网格边界检查每个移动。 例如：```
3 3
###
#A#
###
1
N 1
```向北移动会离开地图，所以`A`被拒绝而不是导致无效的数组访问。 

对于具有不同结果的几个地标，算法会独立测试它们。 一个无效的地标不会影响另一个，因为每次模拟都是从地标自己的坐标开始的。
