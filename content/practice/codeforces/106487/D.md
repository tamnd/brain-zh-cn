---
title: "CF 106487D - 博物馆里的无人机"
description: "该问题描述了一个矩形岛屿地图。 有些牢房是海洋，无法进入，而其他牢房是陆地。 一些陆地单元包含由大写字母表示的独特地标。"
date: "2026-06-25T08:47:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106487
codeforces_index: "D"
codeforces_contest_name: "XXX Spain Olympiad in Informatics, Day 1"
rating: 0
weight: 106487
solve_time_s: 33
verified: true
draft: false
---

[CF 106487D - 博物馆中的 Ladrones](https://codeforces.com/problemset/problem/106487/D)

 **评级：** -
 **标签：** -
 **求解时间：** 33s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该问题描述了一个矩形岛屿地图。 有些牢房是海洋，无法进入，而其他牢房是陆地。 一些陆地单元包含由大写字母表示的独特地标。 给出了一系列步行指令，任务是找到哪些地标可能是步行的未知起点。 A landmark is valid if starting from that cell and applying every instruction in order never steps into the sea. 最终位置不需要对照已知目标进行检查，因为宝藏位置本身是未知的。 We only need to verify that the whole route is possible.

 该地图最多可以包含一百万个单元，因为两个维度都可以达到 1000。这立即排除了从地图上的每个单元模拟路线的可能性。 The number of instructions can reach 100000, so a solution that tries all cells would perform around 10^11 movements in the worst case. The useful observation is that there are at most 26 landmarks, so checking each landmark individually is easily fast enough.

 The main edge cases come from treating the route as only a final displacement instead of a full path. 例如：```
3 5
#####
#A..#
#####
1
E 3
```正确的输出是：```
no solution
```地标移至岛外。 如果最终坐标碰巧返回陆地，则仅检查最终坐标的解决方案将错误地接受它。 

另一个重要的案例是一条暂时进入大海然后返回的航线：```
3 5
#####
#A###
#####
1
E 1
```正确的输出是：```
no solution
```第一步已经无效。 该路线必须在每条指令之后有效，而不仅仅是在完整的序列之后有效。 

第三种边缘情况是，在所有指令之后，地标根本不移动，但仍然具有无效的中间步骤。 实现必须按顺序模拟每个段。 

# 方法

 一个简单的解决方案是从每个地标开始模拟。 对于每个候选单元格，我们保留其当前的行和列，并一一应用所有指令。 如果移动到达海洋单元，则该地标将被拒绝。 如果所有指令均成功，则该地标将添加到答案中。 这种方法是正确的，因为地标成为可能的唯一条件是记住的路径实际上可以被行走。 

这种方法足够快的原因是不寻常的约束组合。 我们不必测试每个地图单元，只需测试包含地标的单元。 这样的细胞最多有26个。 即使有 100000 条指令，总工作量也约为 26×100000 次操作，也就是几百万次检查。 

一个常见的错误方向是搜索整个网格或仅计算最终位移。 最终的位移会丢失起点和终点之间的障碍物信息。 蛮力之所以有效，是因为可能的起始位置数量很少，但如果每个单元格都可以成为候选单元，那么它就会失败。 只有字母才重要的观察结果让我们可以将问题简化为少量的直接模拟。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 对每个细胞进行暴力破解 | O(nm·k) | O(1) | O(1) | 太慢了|
 | 仅模拟地标 | O(26k) | 除了输入存储之外，O(1) | 已接受 |

 # 算法演练

 1. 读取地图并存储每个地标的坐标。 其余单元格与可能的起点无关，因为只有地标才能作为答案。 
2. 阅读说明并将其存储为方向和长度对。 保持它们不变可以让每个地标都针对同一路线进行测试。 
3. 对于每个地标，从其坐标开始模拟。 当前位置表示小偷在执行到目前为止处理的指令后所处的位置。 
4. 通过一次移动一个单元格来应用每条指令。 每次移动后，检查新的单元是否是海。 这是必要的，因为即使其端点有效，长距离移动也可能穿过阻塞的单元格。 
5. 如果所有指令都完成但没有进入大海，则将地标字母添加到结果中。 由于字母是按字母顺序检查的，因此最终输出已经排序。 

为什么它有效：

 该算法直接测试有效起点的定义。 对于任何地标，模拟都遵循与窃贼完全相同的移动顺序。 如果模拟失败，则路径包含不可能的步骤，因此该地标不能作为起点。 如果模拟成功，则每个访问的单元格都是陆地，这意味着该地标满足所有要求。 由于测试了每个可能的地标，因此不会遗漏任何有效答案，也不包含无效答案。 

# Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = []
    sights = []

    for i in range(n):
        row = input().strip()
        grid.append(row)
        for j, c in enumerate(row):
            if 'A' <= c <= 'Z':
                sights.append((c, i, j))

    k = int(input())
    moves = []
    for _ in range(k):
        d, length = input().split()
        moves.append((d, int(length)))

    delta = {
        'N': (-1, 0),
        'S': (1, 0),
        'W': (0, -1),
        'E': (0, 1)
    }

    answer = []

    for c, start_r, start_c in sights:
        r, col = start_r, start_c
        possible = True

        for d, length in moves:
            dr, dc = delta[d]
            for _ in range(length):
                r += dr
                col += dc
                if grid[r][col] == '#':
                    possible = False
                    break
            if not possible:
                break

        if possible:
            answer.append(c)

    if answer:
        print(''.join(sorted(answer)))
    else:
        print("no solution")

if __name__ == "__main__":
    solve()
```输入阶段存储完整的网格，因为运动检查需要随机访问单元格。 同时，收集大写单元格的坐标，避免稍后扫描。 

指令以方向和长度对的形式存储。 方向字典将每个字符转换为行列变化，避免了模拟过程中重复的条件逻辑。 

模拟使用嵌套循环，因为指令的长度意味着遍历每个中间单元。 仅检查最终位置会错过穿过大海的路径。 地图的边界保证是海洋，因此有效的移动必须先进入海洋单元才能离开阵列。 

打印前对结果进行排序。 尽管地标是唯一的，但它们是根据其在输入网格中的位置而不是按字母顺序发现的。 

# 工作示例

 ## 示例 1

 输入：```
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
```对于地标`A`:

 | 步骤| 说明 | 职位| 有效 |
 | --- | --- | --- | --- |
 | 开始| 一个 | (4,7) | 是的 |
 | 1 | N 2 | (2,7) | 是的 |
 | 2 | S 1 | (3,7) | 是的 |
 | 3 | E 1 | (3,8) | 是的 |
 | 4 | 西2 | (3,6) | 是的 |

 对于地标`D`:

 | 步骤| 说明 | 职位| 有效 |
 | --- | --- | --- | --- |
 | 开始| d | (4,3) | 是的 |
 | 1 | N 2 | (2,3) | 是的 |
 | 2 | S 1 | (3,3) | 是的 |
 | 3 | E 1 | (3,4) | 是的 |
 | 4 | 西2 | (3,2) | 是的 |

 两条路径都成功，因此输出为`AD`。 

该轨迹表明不同的起始地标可以产生不同的最终位置。 最终位置无关紧要，只有路径有效性很重要。 

## 示例 2

 输入：```
3 4
####
#.A#
####
2
W 1
N 2
```| 步骤| 说明 | 职位| 有效 |
 | --- | --- | --- | --- |
 | 开始| 一个 | (1,2) | 是的 |
 | 1 | 西 1 | (1,1) | 没有|

 第一步到达海上，所以该地标立即被拒绝。 第二条指令永远不需要。 

# 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(26k) | 最多 26 个地标中的每一个都模拟所有步行步骤。 |
 | 空间| O(纳米) | 网格被存储，以便可以检查每个动作。 |

 最大可能的路线模拟仅执行几百万个单元检查，这完全符合限制。 该网格需要大约一百万个存储字符，这也在内存限制之内。 

# 测试用例```python
import sys
import io

def solve(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, m = map(int, input().split())
    grid = []
    sights = []

    for i in range(n):
        row = input().strip()
        grid.append(row)
        for j, c in enumerate(row):
            if 'A' <= c <= 'Z':
                sights.append((c, i, j))

    k = int(input())
    moves = []
    for _ in range(k):
        d, x = input().split()
        moves.append((d, int(x)))

    delta = {'N': (-1, 0), 'S': (1, 0), 'W': (0, -1), 'E': (0, 1)}

    ans = []
    for c, r, col in sights:
        ok = True
        for d, length in moves:
            dr, dc = delta[d]
            for _ in range(length):
                r += dr
                col += dc
                if grid[r][col] == '#':
                    ok = False
                    break
            if not ok:
                break
        if ok:
            ans.append(c)

    sys.stdin = old
    return ''.join(sorted(ans)) if ans else "no solution"

assert solve("""6 10
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

assert solve("""3 4
####
#.A#
####
2
W 1
N 2
""") == "no solution"

assert solve("""3 5
#####
#A..#
#####
1
E 3
""") == "no solution"

assert solve("""5 5
#####
#A..#
#...#
#..B#
#####
2
S 2
E 1
""") == "AB"

assert solve("""3 3
###
#A#
###
1
N 1
""") == "no solution"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 广告 | 多个有效地标 |
 | 样品2 | 没有解决办法| 立即受阻运动|
 | 直入墙壁| 没有解决办法| 检查中间运动验证 |
 | 拥有两个地标的开放区域 | AB | 检查多次成功的模拟 |
 | 最小附图| 没有解决办法| 检查边界处理 |

 # 边缘情况

 对于第一个边缘情况：```
3 5
#####
#A..#
#####
1
E 3
```该算法开始于`A`并执行三个东移。 前两次移动到达陆地，但第三次移动到达海洋边界。 模拟停止并拒绝`A`，生产`no solution`。 

对于第二种边缘情况：```
3 5
#####
#A###
#####
1
E 1
```唯一可能的举动是立即进入海牢。 该算法在第一步后检测到这一点，并且从不接受该地标。 

对于总位移返回到起始区域附近但路径无效的情况，算法仍然表现正确，因为它验证了每一个移动。 路线被视为一系列位置，而不仅仅是从起点到终点的向量。
