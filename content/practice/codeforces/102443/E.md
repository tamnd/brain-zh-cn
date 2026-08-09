---
title: "CF 102443E - 机器人捉迷藏"
description: "我们有一个（m×n）网格。 机器人占据一些单元，每个机器人都指向四个基本方向之一。 机器人向下看时会看到一个不断扩大的三角形区域：紧邻其下方的一个单元格，然后是下方两行的三个单元格，然后是下方三行的五个单元格，依此类推。"
date: "2026-08-08T12:59:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102443
codeforces_index: "E"
codeforces_contest_name: "2019-2020 Russia Team Open, High School Programming Contest (VKOSHP 19)"
rating: 0
weight: 102443
solve_time_s: 485
verified: true
draft: false
---

[CF 102443E - 机器人捉迷藏](https://codeforces.com/problemset/problem/102443/E)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个 (m\times n) 网格。 机器人占据一些单元，每个机器人都指向四个基本方向之一。 机器人向下看时会看到一个不断扩大的三角形区域：紧邻其下方的一个单元格，然后是下方两行的三个单元格，然后是下方三行的五个单元格，依此类推。 其他三个方向是对称定义的。 

我们必须旋转机器人，以便没有一对机器人看到对方。 将机器人旋转 (90^\circ) 需要执行一次操作，因此例如将 (U) 更改为 (D) 需要执行两次操作。 输出必须保持完全相同的机器人位置，并且必须达到最小总旋转数。 

有用的几何观察是，两个机器人只有当它们指向相反的方向并且该方向上的位移严格大于垂直位移时才能看到对方。 对于垂直对来说，这意味着在以下情况下，上方的机器人指向下方，下方的机器人指向上方是危险的。 

[
 |\Delta c|<|\Delta r|。 
]

 对于水平对，类似的条件是

 [
 |\Delta r|<|\Delta c|。 
]

 平等是安全的。 这种严格的不平等是很容易犯差一错误的地方。 

网格最多有 (4\cdot 10^6) 个单元格。 (O(mn\min(m,n))) 解决方案已经需要数十亿次操作，因此为每列独立枚举可能的轮廓并再次检查每行太慢。 目标是 (O(mn))，或者最多是一小部分恒定数量的此类传递。 

有几种重要的边缘情况。 

考虑```
1 3
R.L
```两个机器人位于同一排，并且彼此指向对方，因此它们能够看到对方。 将其中之一转动 (90^\circ) 就足够了，正确的最小成本是 (1)。 将对角线条件视为包含的粗心实现或仅检查相邻单元格的实现可能会错过此冲突。 

现在考虑```
3 1
R
.
L
```两个机器人位于同一列，但看起来都是水平的，因此双方都看不到对方。 正确的最小成本是 (0)。 这捕获了假设每对相反方向自动都是坏的解决方案。 

对于严格的对角边界，考虑```
2 2
D.
.U
```机器人对角相邻。 它们的行差和列差均为 (1)，因此两个视锥都不包含另一个机器人。 正确的输出可以与输入相同，但成本为 (0)。 用非严格不等式替换严格不等式会错误地强制进行轮换。 

最后，一个空网格，例如```
2 2
..
..
```已满足条件，必须原样返回。 没有理由发明机器人或修改空单元。 

## 方法

 直接的方法是考虑每个机器人，尝试其四个可能的方向，并检查结果配置是否有效。 每个机器人有四种选择，因此对于 (k) 个机器人来说，这是 (4^k)，即使对于几十个机器人来说，这也变得毫无用处。 一种稍微不那么幼稚的方法是在构造配置时检查每对机器人，但单独的对数是 (O(k^2))，并且方向分配呈指数级增长。 

有用的结构来自于首先仅查看垂直方向。 想象一下绘制所有指向上方的机器人的视锥。 它们的禁区形成单调轮廓。 每列都有一个边界行 (d_i)。 轮廓一侧的机器人必须使用向上方向，而另一侧的机器人必须使用向下方向。 精确位于轮廓上的机器人是灵活的。 轮廓在相邻列之间不能跳跃超过一行，因此

 [
 |d_i-d_{i+1}|\le 1。 
]

 这正是一维动态程序可以处理的局部条件。 该轮廓表征是已知 (O(mn)) 解背后的中心观察。 

还有一个细节。 不想使用主要垂直方向的机器人可以安全地变为水平方向，前提是规范结构中的所有此类水平机器人都使用相同的水平方向。 水平机器人就无法看到彼此，因为它们都指向同一个方向。 使用垂直方向的机器人和使用水平方向的机器人不能相互看到对方，因为相互可见需要两个机器人都沿着位移轴指向。 

因此，我们可以围绕垂直轮廓构建规范配置。 在轮廓上方，每个机器人选择 (U) 或一个固定的水平方向。 在它下面，每个机器人选择（D）或相同的固定水平方向。 在轮廓上，机器人可以选择（U）、（D）或固定的水平方向。 

有一个具有水平轮廓的对称结构。 我们调换网格，将（L/R）作为主要方向，并使用一个固定的垂直方向作为替代方向。 我们在每个方向上尝试两种固定替代方向的选择。 这仅给出四次 DP 运行，仍然是 (O(mn))。 

轮廓公式不仅仅是构建某些有效配置的一种方法。 标准的非交叉参数允许将任何最佳有效配置转换为这些规范形式之一，而不会增加其旋转成本。 如果冲突对主要是垂直的，则它们的边界可以由垂直轮廓表示。 如果相应的结构是水平的，则转置参数。 一旦轮廓确定，每个机器人都可以独立优化，所以剩下的问题就是下面描述的DP。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(4^k k^2)) | (O(k)) | 太慢了 |
 | 任意方向的成对检查 | 指数| (O(k)) | 太慢了 |
 | 轮廓 DP | (O(百万)) | (O(百万)) | 已接受 |

 ## 算法演练

 1. 首先考虑垂直轮廓。 对于每一列 (c)，选择 (0) 和 (m+1) 之间的整数边界 (d_c)。 如果 (d_c=0)，则整个列都在轮廓下方。 如果(d_c=m+1)，则整个列都在其上方。 否则行 (d_c) 是轮廓单元。 
2. 要求

 [
 |d_c-d_{c-1}|\le 1。 
]

 这正是轮廓水平移动一列时只能向上或向下移动一行的几何条件。

1. 固定一个水平逃生方向（H），（L）或（R）。 对于轮廓上方的机器人，仅考虑 (U) 和 (H)。 对于轮廓以下的机器人，仅考虑 (D) 和 (H)。 在轮廓上，(U,D,H) 可用。 
2. 将这些选择转化为轮换成本。 如果原来的方向是(x)，那么选择(y)的成本就是四个方向之间的圆距离。 因此（U\to R）和（U\to L）都花费（1），而（U\to D）花费（2）。 
3. 对于固定列和固定边界 (d)，计算其总成本。 设 (A_r) 为行 (r) 在轮廓上方时的最便宜成本，(B_r) 在轮廓下方时的最便宜成本，以及 (C_r) 当行本身是轮廓时的最便宜成本。 然后

 \sum_{r<d} A_r
 +
 C_d
 +
 \sum_{r>d} B_r。 
]

 这两个总和是通过前缀和后缀总和获得的，因此一列的 (d) 的所有 (m+2) 个可能值均在 (O(m)) 中计算。 

1.定义(dp_c[d])为处理列(0\ldots c)后的最小成本，其中(d)为列(c)中的轮廓位置。 唯一可能的先前轮廓位置是 (d-1,d,d+1)，给出

 \operatorname{成本}_c(d)
 +
 \min(dp_{c-1}[d-1],dp_{c-1}[d],dp_{c-1}[d+1])。 
]

 1. 存储使用了三个前驱状态中的哪一个。 在最后一列之后，选择最便宜的边界位置并向后遍历这些父选择以重建整个轮廓。 
2. 使用重建的轮廓来选择每个机器人的实际方向。 在轮廓上方选择 (U) 和 (H) 中较便宜的一个。 在它下面选择（D）和（H）中更便宜的一个。 在轮廓上选择 (U,D,H) 中最便宜的。 
3. 对 (H=L) 和 (H=R) 重复相同的过程。 然后转置网格并再执行对称构造两次，主要方向现在对应于 (L/R)，逃逸方向对应于 (U) 或 (D)。 
4. 保留四种最终配置中最便宜的。 在每个生成的配置中，所有使用逃生方向的机器人都指向相同的方向，因此它们无法看到对方。 主方向（U/D）或（L/R）机器人被轮廓分开，主方向机器人和逃生方向机器人由于方向垂直而不能互相看见。 

### 为什么它有效

 DP 的不变量是在处理 (c) 列之后，`dp[d]`是轮廓在 (d) 行结束的所有规范配置中的最小旋转成本。 该转换准确地考虑了与单单元斜率限制兼容的三个可能的轮廓位置，因此每个合法轮廓都被表示。 

对于固定轮廓，为一个机器人选择的方向不会影响任何其他机器人的成本。 所有水平逃生机器人都指向同一方向，而主要垂直机器人则分为向上区域和向下区域。 在等值线上，等值线的单单元斜率限制可防止两个相反的主方向在垂直方向上足够接近以看到彼此。 因此，每个 DP 状态都对应于一个有效配置。 

对称论证在转置后适用。 轮廓引理表明，最佳有效配置可以不交叉为这些规范形式之一，而无需增加其旋转次数。 由于我们枚举了两个轴和两个可能的逃逸方向，因此四个 DP 结果中的最小值是全局最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**9

# Directions are arranged clockwise.
ORDER = "URDL"
IDX = {ch: i for i, ch in enumerate(ORDER)}

def turn_cost(a, b):
    x = abs(IDX[a] - IDX[b])
    return min(x, 4 - x)

def solve_family(g, up, down, side):
    """
    Solve the contour problem on g.

    Above the contour:
        choose up or side.

    Below the contour:
        choose down or side.

    On the contour:
        choose up, down, or side.

    Returns:
        (minimum_cost, contour)
    """
    h = len(g)
    w = len(g[0])
    states = h + 2

    # parent[c * states + d]:
    # 0 -> previous d-1
    # 1 -> previous d
    # 2 -> previous d+1
    parent = bytearray(w * states)

    prev = [INF] * states

    for c in range(w):
        # Prefix costs for rows above the contour.
        pref = [0] * (h + 1)

        # Suffix costs for rows below the contour.
        suff = [0] * (h + 1)

        col = g

        for r in range(h):
            ch = col[r][c]

            a = min(turn_cost(ch, up), turn_cost(ch, side))
            pref[r + 1] = pref[r] + a

        for r in range(h - 1, -1, -1):
            ch = col[r][c]

            b = min(turn_cost(ch, down), turn_cost(ch, side))
            suff[r] = suff[r + 1] + b

        # Cost of every possible contour position.
        cost = [0] * states

        # d = 0, everything is below.
        cost[0] = suff[0]

        # d = h + 1, everything is above.
        cost[h + 1] = pref[h]

        for d in range(1, h + 1):
            ch = col[d - 1][c]

            boundary = min(
                turn_cost(ch, up),
                turn_cost(ch, down),
                turn_cost(ch, side),
            )

            cost[d] = pref[d - 1] + boundary + suff[d]

        if c == 0:
            prev = cost
            continue

        cur = [INF] * states
        base = c * states

        for d in range(states):
            best = prev[d]
            code = 1

            if d > 0 and prev[d - 1] < best:
                best = prev[d - 1]
                code = 0

            if d + 1 < states and prev[d + 1] < best:
                best = prev[d + 1]
                code = 2

            cur[d] = best + cost[d]
            parent[base + d] = code

        prev = cur

    best_d = min(range(states), key=prev.__getitem__)
    best_cost = prev[best_d]

    contour = [0] * w
    d = best_d

    for c in range(w - 1, -1, -1):
        contour[c] = d

        if c == 0:
            break

        code = parent[c * states + d]

        if code == 0:
            d -= 1
        elif code == 2:
            d += 1

    return best_cost, contour

def build_family(g, up, down, side, contour):
    h = len(g)
    w = len(g[0])

    ans = [list(row) for row in g]

    for c in range(w):
        d = contour[c]

        for r in range(h):
            ch = g[r][c]

            if ch == '.':
                continue

            if d == 0:
                choices = (down, side)
            elif d == h + 1:
                choices = (up, side)
            elif r < d - 1:
                choices = (up, side)
            elif r > d - 1:
                choices = (down, side)
            else:
                choices = (up, down, side)

            best = choices[0]
            best_cost = turn_cost(ch, best)

            for cand in choices[1:]:
                cur = turn_cost(ch, cand)
                if cur < best_cost:
                    best_cost = cur
                    best = cand

            ans[r][c] = best

    return [''.join(row) for row in ans]

def transpose_problem(g):
    """
    Transform the problem so that original horizontal directions
    become vertical directions.

    Original:
        L -> transformed U
        R -> transformed D
        U -> transformed L
        D -> transformed R
    """
    h = len(g)
    w = len(g[0])

    mp = {
        'L': 'U',
        'R': 'D',
        'U': 'L',
        'D': 'R',
        '.': '.',
    }

    t = []
    for c in range(w):
        row = []
        for r in range(h):
            row.append(mp[g[r][c]])
        t.append(''.join(row))

    return t

def untranspose_answer(t):
    """
    Inverse of transpose_problem.
    """
    h = len(t)
    w = len(t[0])

    mp = {
        'U': 'L',
        'D': 'R',
        'L': 'U',
        'R': 'D',
        '.': '.',
    }

    ans = [['.'] * h for _ in range(w)]

    for r in range(h):
        for c in range(w):
            ans[c][r] = mp[t[r][c]]

    return [''.join(row) for row in ans]

def solve_grid(g):
    best_cost = INF
    best_answer = None

    # Vertical contour.
    for side in ('L', 'R'):
        cost, contour = solve_family(g, 'U', 'D', side)

        if cost < best_cost:
            best_cost = cost
            best_answer = build_family(
                g, 'U', 'D', side, contour
            )

    # Horizontal contour, obtained by transposing.
    tg = transpose_problem(g)

    for side in ('L', 'R'):
        cost, contour = solve_family(tg, 'U', 'D', side)

        if cost < best_cost:
            transformed = build_family(
                tg, 'U', 'D', side, contour
            )
            best_cost = cost
            best_answer = untranspose_answer(transformed)

    return best_answer

def main():
    m, n = map(int, input().split())
    g = [input().strip() for _ in range(m)]

    ans = solve_grid(g)

    sys.stdout.write('\n'.join(ans))

if __name__ == "__main__":
    main()
```方向顺序`URDL`使旋转距离成为圆周距离。 例如，`U`到`D`是两圈，而`U`到任一`L`或者`R`是一回合。 

这`solve_family`函数是DP的核心。 这些状态是 (m+2) 个可能的轮廓位置。 这两个额外的状态表示完全高于或完全低于网格的轮廓，因此不存在涉及实际网格中的人工行的特殊情况。 

对于每一列，`pref`存储将轮廓上方的行放入到的累积成本`up-or-side`类别。`suff`对于轮廓下方的行执行相同的操作。 因此，在两次线性扫描之后，在恒定时间内评估每个可能的轮廓位置。 

这一转变正好考察了三个前任。 字节数组`parent`就足够了，因为每个状态只需要记住前一个轮廓是在上面一行、等于还是在下面一行。 使用`bytearray`而不是 Python 整数列表，使 (O(mn)) 重建内存保持较小。 

重建使用与 DP 完全相同的选择。 轮廓上方的机器人在主要方向和固定逃生方向之间进行选择。 下面的机器人以相反的主要方向做类似的事情。 轮廓上的机器人可以额外选择另一个主要方向。 

第二对运行是转置网格后的相同算法。 方向映射是必要的，因为原始`L`变得转变`U`, 原来的`R`变得转变`D`, 原来的`U`变得转变`L`，以及一个原始的`D`变得转变`R`。 

Python 中不存在整数溢出问题。 最大有用成本最多是机器人数量的两倍，因此一个很大的有限`INF`就足够了。 

## 工作示例

 ### 示例 1

 输入是```
2 3
RDL
.U.
```可以垂直观察一种最佳轮廓。 考虑使用`L`作为固定的水平逃逸方向。 轮廓可以停留在每列的第 (1) 行。 

| 专栏 | 边界| 高于成本| 边界成本| 低于成本| 总计 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 0 |`R -> U`= 1 | 0 | 1 |
 | 2 | 1 | 0 |`D -> D`= 0 |`U -> L`= 1 | 1 |
 | 3 | 1 | 0 |`L -> L`= 0 | 0 | 0 |

 总数为(2)。 一种可能的最佳结果是样本输出：```
UDL
.R.
```第一个机器人从`R`到`U`，第二排机器人从`U`到`R`在样本输出中。 这两项改变都需要花费一分钱。 

重要的一点是，离开第一个`R`第三个`L`不变将使这两个机器人水平地看到对方。 轮廓 DP 完全满足必要的分离。 

### 示例 2

 输入是```
2 2
..
..
```没有机器人，因此每个轮廓的成本为零。 

| 专栏 | 边界| DP成本|
 | ---| ---| ---|
 | 1 | 0 | 0 |
 | 2 | 0 | 0 |

 重建的网格仍然是空的：```
..
..
```这证实了人工轮廓状态不会创建机器人或修改空单元。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(百万)) | 四次轮廓 DP 运行只是一个常数因子，每次运行都会扫描每个细胞恒定的次数 |
 | 空间| (O(百万)) | 父数组存储每个轮廓状态的三路前驱选择 |

 网格最多包含 (4\cdot10^6) 个单元格。 该算法仅对这些单元执行恒定数量的线性传递，而不是枚举机器人对或方向分配。 (O(mn)) 内存在 512 MB 限制之内，尽管 Python 的紧凑性`bytearray`家长代表在这里特别有用。 

## 测试用例

 输出不是唯一的，因此测试应该验证返回的配置，而不是逐个字符进行比较。 对于小情况，我们可以对每一对进行强力检查以检查有效性并计算准确的旋转成本。```python
# helper: run solution on input string, return output string
import sys
import io
from itertools import product

# Assume the editorial solution above has been placed in a module
# named solution, or copy solve_grid into this test file.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    m, n = map(int, sys.stdin.readline().split())
    g = [sys.stdin.readline().strip() for _ in range(m)]

    ans = solve_grid(g)

    sys.stdin = old_stdin
    return '\n'.join(ans)

ORDER = "URDL"
IDX = {c: i for i, c in enumerate(ORDER)}

def dist(a, b):
    x = abs(IDX[a] - IDX[b])
    return min(x, 4 - x)

def sees(r1, c1, d, r2, c2):
    dr = r2 - r1
    dc = c2 - c1

    if d == 'U':
        return dr < 0 and abs(dc) < -dr
    if d == 'D':
        return dr > 0 and abs(dc) < dr
    if d == 'L':
        return dc < 0 and abs(dr) < -dc
    return dc > 0 and abs(dr) < dc

def validate(inp, out):
    data = inp.strip().splitlines()
    m, n = map(int, data[0].split())
    original = data[1:]

    answer = out.splitlines()

    assert len(answer) == m
    assert all(len(row) == n for row in answer)

    robots = []

    for r in range(m):
        for c in range(n):
            assert (original[r][c] == '.') == (answer[r][c] == '.')

            if answer[r][c] != '.':
                robots.append((r, c, answer[r][c]))

    for i in range(len(robots)):
        r1, c1, d1 = robots[i]

        for j in range(i + 1, len(robots)):
            r2, c2, d2 = robots[j]

            assert not (
                sees(r1, c1, d1, r2, c2)
                and sees(r2, c2, d2, r1, c1)
            )

    cost = 0

    for r in range(m):
        for c in range(n):
            if original[r][c] != '.':
                cost += dist(original[r][c], answer[r][c])

    return cost

# Provided sample 1.
sample1 = """\
2 3
RDL
.U.
"""

out = run(sample1)
assert validate(sample1, out) == 2, "sample 1"

# Provided sample 2.
sample2 = """\
2 2
..
..
"""

out = run(sample2)
assert validate(sample2, out) == 0, "sample 2"

# Minimum-size input.
case3 = """\
1 1
U
"""

out = run(case3)
assert validate(case3, out) == 0, "single robot needs no rotation"

# All robots already point in the same direction.
case4 = """\
3 4
RRRR
RRRR
RRRR
"""

out = run(case4)
assert validate(case4, out) == 0, "all equal directions"

# Opposite horizontal directions in one row.
case5 = """\
1 3
R.L
"""

out = run(case5)
assert validate(case5, out) == 1, "horizontal mutual visibility"

# Opposite horizontal directions in one column.
case6 = """\
3 1
R
.
L
"""

out = run(case6)
assert validate(case6, out) == 0, "same column is safe"

# Equal row/column displacement is not visible.
case7 = """\
2 2
D.
.U
"""

out = run(case7)
assert validate(case7, out) == 0, "diagonal equality is safe"

# Maximum-size input shape, chosen so the expected cost is obvious.
m = 2000
n = 2000
large = str(m) + " " + str(n) + "\n" + "\n".join(["U" * n] * m) + "\n"

out = run(large)
assert all(row == "U" * n for row in out.splitlines()), \
    "maximum-size all-U case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 3 / RDL / .U.`| 成本为 2 的任何有效配置 | 提供样本和轮廓重建 |
 |`2 2 / .. / ..`| 空网格| 空输入 |
 |`1 1 / U`|`U`| 最小尺寸输入 |
 |`3 4`每个细胞`R`| 同格| 所有方向均等 |
 |`1 3 / R.L`| 成本为 1 的任何有效配置 | 横向相互可见性|
 |`3 1 / R / . / L`| 同格| 一列中相反的水平方向 |
 |`2 2 / D. / .U`| 同格| 严格的对角线边界 |
 |`2000 x 2000`全部`U`| 同格| 最大尺寸输入和性能|

 ## 边缘情况

 第一个边缘情况是空网格。 为了```
2 2
..
..
```每列都可以使用轮廓状态（0）、（1）、（2）或（3），并且每列成本为零。 因此 DP 返回零，并且重建将每个单元保留为`.`。 

第二个边缘情况是单个机器人。 为了```
1 1
L
```我们可以直接通过该单元选择轮廓，因此机器人可以保留`L`以零成本。 DP 的边界过渡包括通过其允许方向的最小值的原始方向，因此它不会强制进行不必要的旋转。 

第三种边缘情况是严格的对角线边界：```
2 2
D.
.U
```两个机器人处于位移 ((1,1))。 向下的圆锥体仅包含其第一行中的同一列单元格，因此对角单元格不可见。 对于向上的锥体也是如此。 该算法从不引入相等约束，因为轮廓参数使用严格的圆锥体，与原始几何形状相匹配。 

第四种边缘情况在一列中水平方向相反：```
3 1
R
.
L
```这些机器人无法看到对方，因为它们的水平位移为零。 垂直轮廓表示可能不太方便保留两个方向，但转置网格后，它们位于相同的水平轮廓边界上。 对称 DP 可以同时处理`L`和`R`无需强制轮换，成本为零。 

最后一个微妙的情况是当许多机器人躺在轮廓上时。 连续的轮廓行最多可以相差一，因此两个边界机器人的垂直位移不大于其水平位移。 这与垂直相互观点所需的严格条件正好相反。 这就是为什么轮廓上的机器人可以使用两个主要方向而不会产生隐藏的垂直冲突。 

实际实现注意事项：四个常数因子 DP 运行是 Python 中最值得优化的部分。 这`bytearray`父存储和避免 DP 状态的嵌套 Python 对象是 2000×2000 限制的深思熟虑的选择。
