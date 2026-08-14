---
title: "CF 102373E - 方格图案"
description: "我们有一块（n×m）矩形板，其单元格要么是黑色的，要么是白色的。 更改任意数量的单元格后，黑色单元格必须形成一个非空连通图，其中共享一侧的单元格相邻，并且该图必须不包含环。"
date: "2026-08-14T12:39:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102373
codeforces_index: "E"
codeforces_contest_name: "\u0426\u0438\u043a\u043b \u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434 \u0434\u043b\u044f \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u041f\u0435\u0440\u0432\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 102373
solve_time_s: 587
verified: false
draft: false
---

[CF 102373E - 方格图案](https://codeforces.com/problemset/problem/102373/E)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 47s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个（n × m）矩形板，其单元格要么是黑色的，要么是白色的。 更改任意数量的单元格后，黑色单元格必须形成一个非空连通图，其中共享一侧的单元格相邻，并且该图必须不包含环。 用图形术语来说，最后一组黑色单元格必须恰好生成一棵树。 

每个更改的单元都会为成本贡献一个单位，因此任务是找到将原始板转换为黑单元图为树的板的最小汉明距离变换。 

尺寸故意不对称。 高度可以达到（100），但宽度最多为（10）。 因此，描述与水平边界相关的所有内容的状态可以指数依赖于 (m)，同时保持实用性，因为 (m) 只有 (10)。 (n m) 的算法是不可能的，因为可能有 (1000) 个单元，而指数部分仅取决于 (m) 的算法是自然目标。 

第一个边缘情况是一块全白板。 例如，```
.
```不能保持不变，因为所需的黑色图必须非空。 正确的结果是```
#
```只需一处更改。 仅检查连接性和循环的解决方案可能会意外接受空图。 

第二个边缘情况是断开的森林。 例如，```
#.#
```已经没有循环，但它的两个黑色单元是独立的组件。 一项改变是必要的，并且```
###
```是一个有效的最优结果。 仅检查循环是不够的，因为最终的图形还必须恰好有一个组件。 

第三种边缘情况是不包含全黑（2 × 2）正方形的循环。 考虑```
###
#.#
###
```八个黑色边界单元围绕白色中心形成一个循环。 移除一个边界单元会打破该循环并给出一个更改的最佳值。 仅查找完整（2 × 2）黑色方块的测试将错过此循环。 

最后，较大棋盘中的单个黑色单元始终是有效的树。 例如，一块（100×10）全白板只需更换一次。 这很有用，因为它既检查大高度边界，又检查至少存在一个黑色单元格的要求。 

## 方法

 直接的解决方案将枚举所有可能的最终颜色。 有 (2^{nm}) 个可能的细胞子集可能是黑色的。 对于每个子集，我们可以构建其归纳图，测试连通性和非循环性，并计算其与输入的距离。 这是正确的，因为每个可能的最终模式都被明确考虑，但其最坏情况的工作是 (O(nm2^{nm}))。 最大（nm=1000）时，大约是（1000\cdot2^{1000}）次操作，远远超出了任何可行的范围。 

有用的观察是我们不需要记住整个已经处理过的板。 逐行扫描棋盘，并在每行内从左到右扫描。 一旦单元位于扫描边界后面，其黑色成分仍然可以与未处理单元相互作用的唯一方式是通过已处理单元和未处理单元之间的当前边界。 

因此，对于每一列，我们都会记住边界单元是否是黑色的，如果是黑色的，则它属于哪个连通分量。 板子加工部分中，具有相同标签的两个前沿位置属于同一元件。 标签本身没有任何意义，因此它们被规范化，例如 ((4,4,0,7)) 变为 ((1,1,0,2))。 

当插入一个新的黑色单元时，它最多有两个已处理的邻居，其左邻居和上邻居。 如果两者都存在并且属于同一组件，则添加新单元会创建一个循环。 如果它们属于不同的组件，新单元将合并这些组件。 如果两者都不存在，它将启动一个新组件。 

连接性需要一个额外的状态。 如果一个组件从边界完全消失，未来的任何细胞都无法触及它。 这样的组件就永久完成了。 有效的最终解决方案最多可以有一个完成的组件，并且一旦完成，就不能选择更多的黑色单元。 这让我们可以立即拒绝断开连接的部分解决方案，而不是携带无用的状态。 

状态的动态编程值是达到该状态所需的最小重新着色次数。 由于未来的决策仅取决于边界连接状态，而不取决于确切的历史记录，因此仅保留到达每个状态的最便宜的方式就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(nm2^{nm})) | (O(nm)) | 太慢了 |
 | 边境DP | (O(nm^2S_m)) | (O(nS_m)) 重建 | 已接受 |

 这里（S_m）表示宽度（m）的可达边界签名的数量。 由于 (m\le10)，这是该问题的宽度相关常数。 实际可达状态比所有任意标签少得多，因为组件来自平面网格森林。 

## 算法演练

1. 按行优先顺序扫描单元格并保持恰好 (m) 个位置的边界。 位置 (c) 表示接触列 (c) 中当前边界的处理后的黑色分量。 零意味着边界单元是白色的或者没有黑色分量接触那里的边界。 
2. 每次转换后规范化所有组件标签。 例如，状态 ((7,7,0,3)) 和 ((1,1,0,2)) 描述完全相同的连接性，因此它们必须存储为相同的 DP 状态。 如果没有规范化，等效状态的数量将会不必要地增加。 
3. 对于每个单元格，尝试将其设为白色。 如果它已经是白色，则其成本为 (0)；如果它最初是黑色，则其成本为 (1)。 将边界位置替换为零。 如果这删除了组件的最后一个边界出现，则该组件将永久关闭。 仅当没有其他活动组件时才保留此转换，因为关闭的组件以后永远无法连接到任何内容。 
4. 尝试将单元格设为黑色。 当原始单元为黑色时，其成本为 (0)，否则为 (1)。 如果存在先前完成的组件，则拒绝此转换，因为新的黑色单元将创建一个单独的组件。 
5. 查看上部和左侧边界标签。 如果两者均非零且相等，则新单元将连接同一组件的两个已连接的顶点，因此新边将形成一个循环。 拒绝过渡。 
6. 如果上标签和左标签是不同的非零值，则合并它们的组件并将合并的组件分配给新单元格。 如果恰好存在一个，则将新单元附加到该组件。 如果两者都不存在，则创建一个新组件。 
7. 处理完所有单元后，如果恰好有一个活动组件或恰好有一个先前完成的组件，则接受一种状态。 完全空的状态被拒绝，因为至少需要一个黑色单元。 
8. 每当状态获得更好的成本时，为每一行存储前驱状态和所选择的黑单元掩码。 找到最佳最终状态后，向后遍历这些前驱记录以恢复输出板的每一行。 

### 为什么它有效

 中心不变量是，每个非零边界标签恰好代表迄今为止处理的黑色单元的一个连接组件，并且不再接触边界的每个已处理组件都已永久关闭。 处理单元时引入的唯一边缘是其到已处理的左邻居和上邻居的边缘。 因此，当两者都存在并且属于同一组件时，就可以准确地创建循环，这正是我们拒绝的转换。 

从边界消失的组件对于任何未处理的单元都没有边缘，因此它永远无法连接到后来创建的组件。 因此，为了连接最终的图，必须拒绝关闭一个组件而另一个组件仍然存在的转换。 最后，剩下的一个组件意味着黑色单元已连接，而每个接受的插入都避免了创建循环。 因此，最终的黑色图是一棵树。 

为了最优性，每个DP状态在具有相同前沿信息的所有部分板中保持最小的变化数量。 未来的所有可能性仅取决于该信息，因此达到相同状态的更昂贵的方法永远不会导致更好的最终答案。 因此，接受的最小成本最终状态是全局最优的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def normalize(a):
    mp = {}
    nxt = 1
    for i, x in enumerate(a):
        if x:
            y = mp.get(x)
            if y is None:
                y = nxt
                mp[x] = y
                nxt += 1
            a[i] = y
    return tuple(a)

def solve_case(grid):
    n = len(grid)
    m = len(grid[0])

    start_state = (0,) * m
    start_key = (start_state, 0)

    # dp[(frontier, finished)] = minimum number of changes
    dp = {start_key: 0}

    # parents[r][state] = (previous_state, row_mask)
    parents = []

    INF = 10 ** 9

    for r in range(n):
        # value = (cost, state_before_this_row, row_mask)
        cur = {
            key: (cost, key, 0)
            for key, cost in dp.items()
        }

        for c in range(m):
            nxt = {}

            for (state, finished), (cost, prev_key, row_mask) in cur.items():
                old = state[c]
                left = state[c - 1] if c > 0 else 0
                up = old

                # Choose white.
                white_cost = cost + (grid[r][c] == '#')
                a = list(state)
                a[c] = 0

                new_finished = finished

                if old:
                    still_alive = old in a
                    if not still_alive:
                        # A component disappeared from the frontier.
                        # It is safe only if it is the only component.
                        if any(a):
                            still_alive = False
                            new_finished = -1
                        else:
                            new_finished = 1

                if new_finished != -1:
                    ns = normalize(a)
                    nk = (ns, new_finished)

                    if white_cost < nxt.get(nk, (INF, None, None))[0]:
                        nxt[nk] = (
                            white_cost,
                            prev_key,
                            row_mask
                        )

                # Choose black.
                if not finished:
                    # If left and up belong to the same component,
                    # the two edges from the new cell close a cycle.
                    if not (left and up and left == up):
                        a = list(state)

                        if up and left and up != left:
                            # Merge left's component into up's component.
                            for i in range(m):
                                if a[i] == left:
                                    a[i] = up
                            new_label = up
                        elif up:
                            new_label = up
                        elif left:
                            new_label = left
                        else:
                            new_label = max(a) + 1

                        a[c] = new_label
                        ns = normalize(a)

                        black_cost = cost + (grid[r][c] == '.')
                        nk = (ns, finished)
                        nmask = row_mask | (1 << c)

                        if black_cost < nxt.get(
                            nk, (INF, None, None)
                        )[0]:
                            nxt[nk] = (
                                black_cost,
                                prev_key,
                                nmask
                            )

            cur = nxt

        ndp = {}
        par = {}

        for key, (cost, prev_key, row_mask) in cur.items():
            ndp[key] = cost
            par[key] = (prev_key, row_mask)

        dp = ndp
        parents.append(par)

    best_key = None
    best_cost = INF

    for (state, finished), cost in dp.items():
        if finished:
            if cost < best_cost:
                best_cost = cost
                best_key = (state, finished)
        else:
            components = len({x for x in state if x})
            if components == 1 and cost < best_cost:
                best_cost = cost
                best_key = (state, finished)

    # A one-cell black tree always exists, so best_key must exist.
    row_masks = [0] * n

    key = best_key
    for r in range(n - 1, -1, -1):
        prev_key, mask = parents[r][key]
        row_masks[r] = mask
        key = prev_key

    answer = []
    for r in range(n):
        row = []
        for c in range(m):
            row.append('#' if (row_masks[r] >> c) & 1 else '.')
        answer.append(''.join(row))

    return answer

def main():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    answer = solve_case(grid)
    sys.stdout.write('\n'.join(answer))

if __name__ == "__main__":
    main()
```DP 密钥由边界元组和`finished`旗帜。 该元组仅包含连接信息，而不包含黑色单元的数量或旧组件的确切坐标，因为两者都不影响未来的转换。 

白色过渡将当前前沿位置替换为零。 微妙的部分是检测消失的组件。 如果之后旧标签不存在并且另一个非零标签仍然存在，则部分图将永久断开连接，从而丢弃该转换。 如果没有其他组件剩余，则单个组件已经完成，并且`finished`标记记录未来不能添加黑色单元。 

对于黑色过渡，`up`是当前列的旧值，`left`是上一列中已更新的值。 这个顺序是必要的。 在处理单元 ((r,c)) 时，这些正是其已处理的邻居。 

测试`left and up and left == up`检测每个新创建的周期。 如果两个邻居属于同一组件，则新单元将在它们之间提供第二条路由。 如果它们属于不同的组件，新单元将安全地将两棵树连接成一棵更大的树。 

存储在每个父记录中的行掩码足以进行重建，因为行中的所有选择都由该掩码表示。 DP本身只需要得到的边界状态，而前驱记录会记住选择哪一行来获取它。 

Python整数是无界的，但成本最多为（nm），因此不存在溢出问题。 位掩码最多有 10 位，因为 (m\le10)。 

## 工作示例

 对于样本 1，一种最佳的最终模式是`##.`,`#.#`,`###`。 它仅更改右上角的单元格。 以下跟踪使用规范组件标签，其中相同的标签意味着相应的前沿单元已连接。 

| 已处理的行| 所选行 | 行后边境| 完成 |
 | --- | --- | --- | --- |
 | 开始| 无 |`(0,0,0)`| 0 |
 | 1 |`##.`|`(1,1,0)`| 0 |
 | 2 |`#.#`|`(1,0,2)`| 0 |
 | 3 |`###`|`(1,1,1)`| 0 |
 | 结束 |`##./#.#/###`| 一个组件 | 0 |

 第一行之后，两个黑色单元格形成一个组件。 在第二行中，中间的单元格是白色的，因此左右黑色组暂时分开。 在最后一行中，中间的单元格连接这两个不同的组件。 由于发生这种情况时标签不同，因此不会创建循环。 剩下七个黑色单元格和六个边缘，所以结果是一棵树。 成本是一。 

对于样本 2，样本输出本身可以用作追踪的最佳模式。 

| 已处理的行| 所选行 | 行后边境| 完成 |
 | --- | --- | --- | --- |
 | 开始| 无 |`(0,0,0)`| 0 |
 | 1 |`##.`|`(1,1,0)`| 0 |
 | 2 |`.##`|`(0,1,1)`| 0 |
 | 3 |`#.#`|`(2,1,1)`| 0 |
 | 4 |`###`|`(1,1,1)`| 0 |
 | 结束 |`##./.##/#.#/###`| 一个组件 | 0 |

 第三行临时创建两个组件。 第四行的第一个单元格扩展了左侧组件，第二个单元格再次扩展了它。 最后一个单元格看到一个组件的左邻居和另一个组件的上邻居，因此它将合并它们而不是创建一个循环。 恰好有两个单元格与输入不同，与指定的最佳值匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nm^2S_m)) | 每个（nm）单元处理每个可到达的边界状态，以及规范化加上组件合并成本（O（m））。 |
 | 空间| (O(nS_m)) | 当前DP使用(O(S_m))状态，而行前驱记录使用(O(nS_m))空间进行重建。 |

 这里（S_m）仅取决于宽度。 宽度上限为 (10)，而高度仅为 (100)，这正是前沿动态规划有用的情况。 该算法从不枚举 (2^{nm}) 个完整的板。 

## 测试用例

 下面的测试从结构上验证输出，而不是比较确切的文本，因为该问题允许任何最佳模式。 检查器验证输出是否是一棵树，并且其重新着色的次数等于已知的最佳值。```python
import sys
import io
from collections import deque

def normalize(a):
    mp = {}
    nxt = 1
    for i, x in enumerate(a):
        if x:
            y = mp.get(x)
            if y is None:
                y = nxt
                mp[x] = y
                nxt += 1
            a[i] = y
    return tuple(a)

def solve_case(grid):
    n = len(grid)
    m = len(grid[0])

    dp = {((0,) * m, 0): 0}
    parents = []
    INF = 10 ** 9

    for r in range(n):
        cur = {
            key: (cost, key, 0)
            for key, cost in dp.items()
        }

        for c in range(m):
            nxt = {}

            for (state, finished), (cost, prev, mask) in cur.items():
                old = state[c]
                left = state[c - 1] if c else 0
                up = old

                # White
                a = list(state)
                a[c] = 0
                nf = finished

                if old and old not in a:
                    if any(a):
                        nf = -1
                    else:
                        nf = 1

                if nf != -1:
                    ns = normalize(a)
                    key = (ns, nf)
                    value = cost + (grid[r][c] == '#')
                    if value < nxt.get(key, (INF, None, None))[0]:
                        nxt[key] = (value, prev, mask)

                # Black
                if not finished and not (
                    left and up and left == up
                ):
                    a = list(state)

                    if left and up and left != up:
                        for i in range(m):
                            if a[i] == left:
                                a[i] = up
                        label = up
                    elif up:
                        label = up
                    elif left:
                        label = left
                    else:
                        label = max(a) + 1

                    a[c] = label
                    ns = normalize(a)
                    key = (ns, finished)
                    value = cost + (grid[r][c] == '.')
                    nmask = mask | (1 << c)

                    if value < nxt.get(key, (INF, None, None))[0]:
                        nxt[key] = (value, prev, nmask)

            cur = nxt

        dp = {key: value[0] for key, value in cur.items()}
        parents.append({
            key: (value[1], value[2])
            for key, value in cur.items()
        })

    best = None
    best_cost = INF

    for (state, finished), cost in dp.items():
        if finished or len({x for x in state if x}) == 1:
            if cost < best_cost:
                best_cost = cost
                best = (state, finished)

    masks = [0] * n
    key = best

    for r in range(n - 1, -1, -1):
        key, masks[r] = parents[r][key]

    return [
        ''.join('#' if (masks[r] >> c) & 1 else '.'
                for c in range(len(grid[0])))
        for r in range(n)
    ]

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]
    ans = solve_case(grid)
    sys.stdin = old_stdin
    return '\n'.join(ans)

def is_tree(board):
    n = len(board)
    m = len(board[0])

    cells = [
        (r, c)
        for r in range(n)
        for c in range(m)
        if board[r][c] == '#'
    ]

    if not cells:
        return False

    seen = {cells[0]}
    q = deque([cells[0]])

    while q:
        r, c = q.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if (
                0 <= nr < n and
                0 <= nc < m and
                board[nr][nc] == '#'
                and (nr, nc) not in seen
            ):
                seen.add((nr, nc))
                q.append((nr, nc))

    if len(seen) != len(cells):
        return False

    edges = 0
    for r, c in cells:
        if r + 1 < n and board[r + 1][c] == '#':
            edges += 1
        if c + 1 < m and board[r][c + 1] == '#':
            edges += 1

    return edges == len(cells) - 1

def check(inp, expected_cost):
    first = inp.splitlines()
    n, m = map(int, first[0].split())
    original = first[1:n + 1]

    output = run(inp)
    board = output.splitlines()

    assert len(board) == n
    assert all(len(row) == m for row in board)
    assert all(ch in '.#' for row in board for ch in row)
    assert is_tree(board)

    cost = sum(
        original[r][c] != board[r][c]
        for r in range(n)
        for c in range(m)
    )
    assert cost == expected_cost

# Provided samples
check(
    """3 3
###
#.#
###
""",
    1
)

check(
    """4 3
##.
.##
###
##.
""",
    2
)

check(
    """2 3
...
...
""",
    1
)

# Minimum-size input, already valid
check(
    """1 1
#
""",
    0
)

# Minimum-size input, empty black graph
check(
    """1 1
.
""",
    1
)

# Disconnected forest, one change is enough
check(
    """1 3
#.#
""",
    1
)

# Maximum-size board, one black cell is optimal
check(
    "100 10\n" + "\n".join(["." * 10] * 100) + "\n",
    1
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 x 1`含有`#`|`#`| 单个单元格已经是一棵有效的树。 |
 |`1 x 1`含有`.`|`#`| 黑色图必须非空。 |
 |`1 x 3`含有`#.#`| 任何树都有成本 (1) | 即使没有循环，也必须强制连接。 |
 |`100 x 10`只含有`.`| 任何单个黑色单元格| 最大尺寸和空箱到单箱。 |

 ## 边缘情况

 对于单格输入```
.
```初始 DP 状态是空边界。 选择白色会将其留空，但该状态最终会被拒绝，因为没有黑色成分。 选择黑色会创建一个组件，最终状态仅包含一个组件。 其成本为 1，因此产量为`#`。 

对于已经有效的单格输入```
#
```选择黑色成本为零。 边界包含一个组件，最终状态会立即被接受。 选择白色将创建完成的空状态，该状态会被拒绝，因为它不包含黑色单元格。 该算法最终返回`#`零变化。 

为了```
#.#
```第一个黑色单元格创建组件 (1)，中间的白色单元格使组件 (1) 保持活动状态，最后一个黑色单元格启动组件 (2)。 因此，最终边界包含两个组件，因此未更改的板将被拒绝。 DP 可以将中间单元变黑，将两侧合并为一条路径，或者删除任一端点。 两种选择的成本都是一，所以最优的选择是一。 

对于循环```
###
#.#
###
```前两行可以暂时包含几个前沿组件。 当最后一行闭合形状时，连接已经属于同一组件的两个边界单元的任何过渡都将被视为循环而被拒绝。 单单元删除会留下一个连通的非循环集，因此 DP 保留成本为 1 的解。 由于原板本身是循环的，零变化不可能是最优的，证明一是最小的。 

对于全白（100×10）板，DP 可以使每个单元保持白色，直到它选择一个黑色单元。 这会创建一个单例组件，它已经是一棵树了。 成本恰好是一，并且没有任何解决方案的成本为零，因为未更改的电路板没有黑色单元。 这可以在执行非空树条件时处理尽可能大的板。
