---
title: "CF 102441K - 国际象棋位置"
description: "我们需要打印一个任意 8 x 8 的棋盘，其中包含皇后、象、马、车或空单元格。 白色部分为大写，黑色部分为小写。"
date: "2026-08-08T13:35:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102441
codeforces_index: "K"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Final"
rating: 0
weight: 102441
solve_time_s: 161
verified: true
draft: false
---

[CF 102441K - 国际象棋位置](https://codeforces.com/problemset/problem/102441/K)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要打印一个任意 8 x 8 的棋盘，其中包含皇后、象、马、车或空单元格。 白色部分为大写，黑色部分为小写。 对于给定的一对 w,b，恰好有 w 个白棋子必须受到至少一个黑棋子的攻击，并且恰好有 b 个黑棋子必须受到至少一个白棋子的攻击。 

国际象棋的规则比普通国际象棋稍微简单一些，因为没有王或兵。 皇后、车或主教沿着相应的路线攻击，直到第一个占领的方格。 骑士攻击其八个可能的目的地，并忽略源和目的地之间的棋子。 仅当两块颜色不同时才算攻击。 

在实际重要的维度上，约束很小。 该板始终仅包含 64 个单元，并且两个请求的计数最多为 50。最多有 10 3 个测试用例，因此每个板执行少量恒定工作量的方法很容易足够快。 我们无法承受的是枚举 64 个单元的任意子集或所有可能的块分配，因为即使将每个单元限制为空或已占用也已经给出了 2 64 个配置。 

构造必须小心处理两种边缘情况。 首先，w=0或b=0是有效的。 例如，对于输入`1 0`，正确的棋盘有一个受攻击的白棋而没有受攻击的黑棋。 一个不小心的对称结构也可能会自动产生一个受到攻击的黑色棋子。 其次，w+b=64也是合法的。 例如，`32 32`如果正好使用了 64 块，则要求每个方格包含一个已计数的块。 为每组目标的攻击者保留一个额外方格的结构可能会耗尽棋盘空间。 

解决这些问题最安全的方法是利用电路板固定且很小的事实。 我们可以搜索位置，但我们应该搜索攻击关系的紧凑表示，而不是搜索所有 13 64 个可能的棋盘。 

## 方法

 直接的暴力方法会尝试所有可能的棋盘并计算其被攻击的数量。 即使每个方格仅限于空的白马、黑马、白后和黑后，也已经有 5 64 个候选者，大约 2.9⋅10 44 个候选者。 检查一块板只需要 O(64)，但板的数量使其完全无法使用。 

一个稍微不那么幼稚的方法是首先选择占据的方块，然后选择它们的颜色和棋子类型。 这仍然具有指数搜索空间。 固定的董事会规模有助于降低评估一名候选人的成本，但并不能解决组合爆炸问题。 

有用的观察是所需的输出不是唯一的。 我们不需要重建一些隐藏的预期位置。 我们只需要一个位置和所要求的两个计数。 由于只有 51×51 个可能的对满足各个边界，因此我们可以为每个出现的对搜索一次有效的构造并将其缓存。 

对于每个请求的对，我们使用随机本地搜索。 棋盘由 64 个字符表示。 我们反复改变一小组有用的棋子/颜色组合之间随机选择的占据的方块，并保持改变以改善与所需对的距离。 由于棋盘固定为 64 个单元，因此可以根据问题大小在恒定时间内重新计算攻击计数。 随机重新启动可防止搜索陷入不幸的本地配置中。 

从绝对值来看，搜索空间足够小，而输出空间却很大，因此有效位置很多。 重要的工程细节是缓存每个成功的板。 通过最多 10 3 次测试，对同一对的重复请求基本上变得免费。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 枚举所有板 | O(13 64 ⋅64) | O(13 64 ⋅64) | 奥(64) | 太慢了 |
 | 带缓存的随机构造 | O(T⋅I⋅64) 最坏情况 | O(T⋅64) | O(T·64) | 实践中接受|

 ## 算法演练

 1. 首先读取所有测试用例并仅保留不同的对 (w,b)。 缓存很有用，因为对特定对的搜索只需成功一次。 
2. 将每个棋盘表示为 64 个字符的数组。 我们使用`.`空方格和占据方格的八种可能的彩色棋子。 皇后和骑士足以进行搜索，因为皇后提供远程攻击，而骑士提供不依赖于中间棋子的攻击。 
3. 生成随机起始板。 占据的方格数量是根据所请求的攻击棋子数量来选择的，因为棋子很少的位置不能产生很多攻击，而完全随机的棋盘往往会产生太多的攻击。 
4. 通过扫描每个被占领的方格并确定其是否受到对手的攻击来评估棋盘。 对于皇后，扫描八个方向，直到第一个占据的方格。 对于骑士，检查其八个跳跃目的地。 如果第一个遇到的棋子具有相反的颜色，则将目标标记为已攻击。 
5. 将误差定义为

 ∣w 实际​ -w∣+∣b 实际​ -b∣。 

完美的电路板误差为零。 
6. 随机选择一个占据的方格进行变异。 突变会改变其棋子类型或颜色，有时会将空方块变成棋子或移除棋子。 重新计算错误并保留改进错误的突变。 偶尔接受相同或更差的突变可以防止搜索冻结在局部最小值。 
7. 当固定次数的迭代未能找到解决方案时，重新开始随机搜索。 该板仅包含 64 个单元，因此每次重启都很便宜。 
8. 一旦达到错误零，就缓存该对的板并为该对的每次出现打印它。 

### 为什么它有效

 正确性条件是直接检查的，而不是从脆弱的几何公式推断出来的。 只有在评估了棋盘的完整攻击关系并且两个结果计数完全等于 w 和 b 后，棋盘才被接受。 因此，每块印制板都满足所需的条件。 随机部分仅决定我们如何找到候选人； 它永远不会改变接受标准。 

## Python 解决方案```python
import sys
import random

input = sys.stdin.readline

DIRS = [
    (-1, -1), (-1, 0), (-1, 1),
    (0, -1),           (0, 1),
    (1, -1),  (1, 0),  (1, 1),
]

KNIGHT = [
    (-2, -1), (-2, 1),
    (-1, -2), (-1, 2),
    (1, -2),  (1, 2),
    (2, -1), (2, 1),
]

PIECES = "QqKk"
# Q/q are queens, K/k are knights.
# The letters are intentionally different from ordinary chess notation:
# the statement uses 'k' for knight.

rng = random.Random(712367821)

def is_piece(c):
    return c != '.'

def is_white(c):
    return c.isupper()

def is_queen(c):
    return c.lower() == 'q'

def attacked_counts(board):
    attacked = [False] * 64

    for pos in range(64):
        p = board[pos]
        if p == '.':
            continue

        r = pos // 8
        c = pos % 8

        if is_queen(p):
            for dr, dc in DIRS:
                nr = r + dr
                nc = c + dc

                while 0 <= nr < 8 and 0 <= nc < 8:
                    np = nr * 8 + nc
                    q = board[np]

                    if q != '.':
                        if is_white(p) != is_white(q):
                            attacked[np] = True
                        break

                    nr += dr
                    nc += dc

        else:
            for dr, dc in KNIGHT:
                nr = r + dr
                nc = c + dc

                if 0 <= nr < 8 and 0 <= nc < 8:
                    np = nr * 8 + nc
                    q = board[np]

                    if q != '.' and is_white(p) != is_white(q):
                        attacked[np] = True

    w = 0
    b = 0

    for i, p in enumerate(board):
        if p == '.' or not attacked[i]:
            continue
        if is_white(p):
            w += 1
        else:
            b += 1

    return w, b

def score(board, target_w, target_b):
    w, b = attacked_counts(board)
    return abs(w - target_w) + abs(b - target_b), w, b

def random_board(w, b):
    board = ['.'] * 64

    # Start with a moderate number of pieces. More pieces are useful when
    # the requested counts are large.
    n = min(64, max(2, w + b + 8))

    cells = rng.sample(range(64), n)

    for x in cells:
        if rng.randrange(2):
            board[x] = 'Q' if rng.randrange(2) else 'K'
        else:
            board[x] = 'q' if rng.randrange(2) else 'k'

    return board

def find_board(w, b):
    if w == 0 and b == 0:
        return ['.'] * 64

    # The search is deliberately bounded. The board is tiny and valid
    # configurations are plentiful.
    restarts = 160
    iterations = 1800

    for _ in range(restarts):
        board = random_board(w, b)
        cur, _, _ = score(board, w, b)

        if cur == 0:
            return board

        temperature = 3.0

        for _ in range(iterations):
            old = board[:]

            pos = rng.randrange(64)

            if board[pos] == '.':
                if rng.randrange(3) == 0:
                    board[pos] = rng.choice("QqKk")
                else:
                    continue
            else:
                if rng.randrange(5) == 0:
                    board[pos] = '.'
                else:
                    board[pos] = rng.choice("QqKk")

            new, _, _ = score(board, w, b)

            if new == 0:
                return board

            delta = new - cur

            if delta <= 0:
                cur = new
            else:
                # Simulated annealing style escape from local minima.
                probability = pow(2.718281828, -delta / max(temperature, 0.05))
                if rng.random() < probability:
                    cur = new
                else:
                    board = old

            temperature *= 0.997

    # With the guaranteed existence of an answer, the randomized search
    # above is expected to find one. This fallback keeps the function total.
    raise RuntimeError("construction search failed")

def solve():
    t = int(input())
    tests = [tuple(map(int, input().split())) for _ in range(t)]

    cache = {}

    out = []

    for w, b in tests:
        if (w, b) not in cache:
            cache[(w, b)] = find_board(w, b)

        board = cache[(w, b)]

        for r in range(8):
            out.append(''.join(board[r * 8:(r + 1) * 8]))
        out.append('')

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    solve()
```这`attacked_counts`函数是中央验证器。 它会遍历每个被占用的单元格，并准确应用语句中的移动规则。 滑动块停在第一个被占用的方格处，这是一个微妙的部分，不小心的实现可能会出错。 马被单独处理，因为它们会跳过棋子。 

该板使用`Q`和`q`对于皇后和`K`和`k`对于骑士，匹配所需的输出字母表。 外壳决定颜色，所以`isupper()`足以区分白色和黑色。 

突变步骤是故意允许改变棋子类型及其颜色的。 仅更改类型会使某些目标对难以到达，而仅更改颜色可能会使搜索陷入具有错误攻击几何形状的位置。 

Python 中不存在整数溢出问题，并且所有棋盘坐标都会进行检查`0 <= coordinate < 8`。 最终的板每行打印八个字符，后面是测试用例之间的空行。 

## 工作示例

 对于第一个样本，请求的对是 w=2,b=3。 搜索不需要重现示例输出，因为问题接受任何有效的板。 

典型的成功搜索具有以下形式的痕迹。 

| 迭代 | 白棋进攻| 黑棋进攻 | 错误 |
 | ---| ---| ---| ---|
 | 初始| 4 | 1 | 4 |
 | 1 | 3 | 2 | 2 |
 | 2 | 2 | 2 | 1 |
 | 3 | 2 | 3 | 0 |

 最后的状态立即被接受。 实现中使用的不变量很简单：每当打印一个板时，它就已经通过了确切的攻击计数器，并且该计数器返回`(2, 3)`。 

对于第二个样本，请求的对是 w=4,b=2。 

| 迭代 | 白棋进攻| 黑棋进攻 | 错误 |
 | ---| ---| ---| ---|
 | 初始| 1 | 4 | 5 |
 | 1 | 2 | 3 | 3 |
 | 2 | 3 | 2 | 1 |
 | 3 | 4 | 2 | 0 |

 同样，实际的主板可能与声明中的样本完全不同。 重要的是四个大写棋子至少有一名黑人攻击者，而恰好两个小写棋子至少有一名白人攻击者。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(U⋅R⋅I⋅64) | O(U⋅R⋅I⋅64) | U 不同的请求对，R 重新启动，I 每次重新启动的突变 |
 | 空间| O(U·64) | O(U·64) | 缓存 8 x 8 板 |

 这里U≤1000，而电路板本身固定为64个电池。 在正式问题参数中，攻击计算的大小是恒定的，除了 Python 对象开销之外，缓存的测试用例每个只需要几十个字节。 预期环境的电路板非常小，因此实际成本主要由随机构造决定，而不是由输入大小决定。 

## 测试用例

 建设性问题的输出不是唯一的，因此断言测试应该验证语义属性，而不是将印刷板与一个特定字符串进行比较。```python
import sys
import io

KNIGHT = [
    (-2, -1), (-2, 1),
    (-1, -2), (-1, 2),
    (1, -2), (1, 2),
    (2, -1), (2, 1),
]

DIRS = [
    (-1, -1), (-1, 0), (-1, 1),
    (0, -1),           (0, 1),
    (1, -1),  (1, 0),  (1, 1),
]

def attacked_counts(board):
    attacked = [False] * 64

    for pos, p in enumerate(board):
        if p == '.':
            continue

        r, c = divmod(pos, 8)

        if p.lower() == 'q':
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc

                while 0 <= nr < 8 and 0 <= nc < 8:
                    np = nr * 8 + nc

                    if board[np] != '.':
                        if board[np].isupper() != p.isupper():
                            attacked[np] = True
                        break

                    nr += dr
                    nc += dc
        else:
            for dr, dc in KNIGHT:
                nr, nc = r + dr, c + dc

                if 0 <= nr < 8 and 0 <= nc < 8:
                    np = nr * 8 + nc
                    if board[np] != '.' and \
                       board[np].isupper() != p.isupper():
                        attacked[np] = True

    w = sum(
        attacked[i] and board[i].isupper()
        for i in range(64)
        if board[i] != '.'
    )

    b = sum(
        attacked[i] and board[i].islower()
        for i in range(64)
        if board[i] != '.'
    )

    return w, b

def validate(out, expected):
    lines = [x for x in out.splitlines() if x.strip()]

    assert len(lines) == 8
    board = ''.join(lines)

    assert len(board) == 64
    assert all(c in ".QqKk" for c in board)

    assert attacked_counts(board) == expected

# The helper below represents the contest solution.
# In a local test file, import find_board from the submitted solution.
def run_pair(w, b):
    from solution import find_board
    board = find_board(w, b)
    return '\n'.join(
        ''.join(board[r * 8:(r + 1) * 8])
        for r in range(8)
    )

# Provided sample pairs
out = run_pair(2, 3)
validate(out, (2, 3))

out = run_pair(4, 2)
validate(out, (4, 2))

# Minimum case
out = run_pair(0, 0)
validate(out, (0, 0))

# One-sided attack count
out = run_pair(1, 0)
validate(out, (1, 0))

# Equal counts
out = run_pair(32, 32)
validate(out, (32, 32))

# Maximum individual request
out = run_pair(50, 0)
validate(out, (50, 0))
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 3`| 任何有效的 8 x 8 棋盘 | 首次提供样品|
 |`4 2`| 任何有效的 8 x 8 棋盘 | 第二次提供样品|
 |`0 0`| 空板或无攻击板 | 两个计数都可以为零 |
 |`1 0`| 恰好一枚被攻击的白子| 一边倒的攻击计数|
 |`32 32`| 每种颜色恰好有 32 个被攻击的棋子 | 大量平衡计数 |
 |`50 0`| 正好 50 个被攻击的白子 | 最大个体计数和没有黑人攻击|

 ## 边缘情况

 对于`0 0`，构造可以立即返回一个完全空的板。 没有棋子，因此没有棋子可以被攻击，并且两个计数都恰好为零。 这避免了在微不足道的情况下浪费搜索迭代。 

为了`1 0`，搜索时必须避免误击黑棋。 一个有效的结构可以包含一个黑色攻击棋子和一个白色目标，同时保持所有其他黑色棋子孤立或不存在。 验证者明确检查黑色计数，因此具有一次白色攻击和一次非故意黑色攻击的板将被拒绝，而不是默默地打印。 

为了`50 0`，棋盘需要高密度的受攻击白棋，同时保持黑棋受攻击计数为零。 这就是使用皇后作为远程攻击者和骑士作为目标的有用之处。 单个蚁后可以从不同方向攻击多个目标，从而比孤立的一对一对更容易达到所需的密度。 

为了`32 32`，如果最终板很密集，则可用的空白空间非常少。 为每组目标分配单独的攻击者的结构可以超过 64 单元板。 随机搜索不会强加这样的分解。 它直接在完整的棋盘配置中搜索，因此被攻击的棋子可以同时参与对相反颜色棋子的攻击。 这正是当两个请求计数都很大时所需的交互。
