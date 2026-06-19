---
title: "CF 106118K - 井字棋之王"
description: "我们有一个 3 × 3 的 Tic-Tac-Toe 棋盘。 每个单元格包含 X、O 或 .. 不能保证棋盘处于正常游戏的有效状态，因此 X 和 O 的计数并不重要。 大雄获得了一种特殊的能力：他可以在任意两个空单元格上连续放置两个 O 标记。"
date: "2026-06-19T20:07:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106118
codeforces_index: "K"
codeforces_contest_name: "2025 ICPC, Chula Selection Contest"
rating: 0
weight: 106118
solve_time_s: 50
verified: true
draft: false
---

[CF 106118K - 井字棋之王](https://codeforces.com/problemset/problem/106118/K)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个 3 × 3 的 Tic-Tac-Toe 棋盘。 每个单元格包含`X`,`O`， 或者`.`。 棋盘不能保证是正常游戏的有效状态，因此计数`X`和`O`没关系。 

大雄获得了一种特殊的能力：他可以放置两个`O`在任意两个空单元格上连续标记。 在这两个位置之后，游戏立即结束。 如果生成的棋盘包含至少一个完整的行、列或对角线，全部由`O`，则大雄获胜。 

对于每个测试用例，我们必须确定是否存在这样的一对移动。 如果是，我们打印`YES`以及由此产生的获胜板。 否则，我们打印`NO`。 

电路板尺寸固定为 3 × 3。尽管可能有多达 1000 个测试用例，但每个电路板仅包含 9 个单元。 任何在每个板上执行恒定工作量的算法都足够快。 我们不需要复杂的优化，因为搜索空间很小。 

主要挑战不是性能而是正确性。 我们必须仔细考虑所有可能的方式来放置这两个新的`O`标记。 

一个简单的错误是只检查已经包含某些内容的行`O`s。 获胜行可能需要填写两个空单元格。 

例如：```
...
OO.
...
```放置一个`O`中间行最后一个单元格立即获胜。 由于大雄必须恰好走两步，所以他可以放置第二步`O`其他任何地方。 正确答案是`YES`。 

另一个微妙的情况是获胜行不包含现有的`O`根本不。```
...
.X.
...
```大雄可以放置两个`O`s 在同一行，但仍然只给出两个分数。 一条完整的线需要三个`O`s，所以答案是`NO`。 

另一种错误是在发现一招没有获胜后就停止。 我们需要考虑每一对空单元格。```
X.X
.O.
...
```某些放置失败，但选择中间行的左侧和右侧单元格会创建`OOO`。 正确答案是`YES`。 

## 方法

 最直接的想法就是暴力。 收集所有空单元格，选择每一对可能的不同空单元格，放置`O`在这些位置上，并检查最终的棋盘是否包含获胜线。 

Tic-Tac-Toe 棋盘最多有 9 个单元格，因此最多有 9 个空位置。 对的数量最多为：$$\binom{9}{2} = 36$$对于每一对，我们检查 8 条可能获胜的线，即 3 行、3 列和 2 对角线。 每个测试用例的总工作量只有几百次操作。 

由于电路板尺寸是固定的，这种强力搜索在实践中已经是最佳的。 没有更大的结构可供利用，任何更复杂的方法只会增加不必要的复杂性。 

关键的观察结果是，棋盘是如此之小，以至于穷举搜索实际上是常数时间。 我们可以简单地测试每对合法的棋步并直接验证结果，而不是单独推理潜在的获胜线。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 对所有移动对进行暴力破解 | O(E²) 其中 E ≤ 9 | O(1) | O(1) | 已接受 |
 | 最佳 | O(E²) 其中 E ≤ 9 | O(1) | O(1) | 已接受 |

 自从`E`最多为 9，两种描述都代表相同的实际解决方案。 

## 算法演练

 1. 阅读 3 × 3 板。 
2. 收集所有空单元格的坐标。 
3. 对于每对不同的空单元格：

 地点`O`在董事会的临时副本上担任这两个职位。 
4. 检查修改后的棋盘是否包含获胜线`O`。 

获胜线是任意行、列或对角线，其三个单元格都为`O`。 
5. 如果存在获胜行，则打印`YES`和修改后的主板。 

我们可能会立即停止，因为该问题接受任何获胜的棋盘。 
6. 如果所有对都经过测试，但没有一个获胜，则打印`NO`。 

### 为什么它有效

 该算法会检查大雄可以使用他的双招的每一种合法方式。 两次放置后的每个可能结果恰好对应于一对空单元，并且对每一对空单元进行测试。 

当测试一对时，算法会明确检查所有 8 条获胜线。 如果任何行完全由`O`，该董事会获胜。 如果没有线，则该棋盘没有获胜。 

由于每对有效的棋步都会被考虑，并且每个结果棋盘都会被正确评估，因此只要存在棋盘，算法就会找到获胜棋盘并报告`NO`仅当不存在时。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_win(board):
    for r in range(3):
        if all(board[r][c] == 'O' for c in range(3)):
            return True

    for c in range(3):
        if all(board[r][c] == 'O' for r in range(3)):
            return True

    if all(board[i][i] == 'O' for i in range(3)):
        return True

    if all(board[i][2 - i] == 'O' for i in range(3)):
        return True

    return False

t = int(input())

for _ in range(t):
    board = [list(input().strip()) for _ in range(3)]

    empty = []
    for r in range(3):
        for c in range(3):
            if board[r][c] == '.':
                empty.append((r, c))

    found = False

    m = len(empty)
    for i in range(m):
        for j in range(i + 1, m):
            temp = [row[:] for row in board]

            r1, c1 = empty[i]
            r2, c2 = empty[j]

            temp[r1][c1] = 'O'
            temp[r2][c2] = 'O'

            if is_win(temp):
                print("YES")
                for row in temp:
                    print("".join(row))
                found = True
                break

        if found:
            break

    if not found:
        print("NO")
```辅助函数`is_win`检查所有八条可能的获胜线。 由于棋盘尺寸是固定的，显式测试行、列和对角线是最简单、最安全的实现。 

名单`empty`存储每个可用的移动位置。 嵌套循环迭代所有无序的空单元对。 使用`j = i + 1`避免两次测试同一对并防止两次选择同一单元。 

对于每个候选对，都会创建一个新的董事会副本。 这避免了事后撤消移动并保持逻辑简单。 

一旦找到获胜棋盘，循环就会终止并打印棋盘。 任何有效的获胜板都可以接受，因此无需继续搜索。 

## 工作示例

 ### 示例 1

 输入板：```
X.X
.O.
...
```空单元格：

 | 配对测试 | 赢了？ |
 | --- | --- |
 | (0,1), (1,0) | (0,1), (1,0) | 没有 |
 | (0,1), (1,2) | (0,1), (1,2) | 没有 |
 | (1,0), (1,2) | (1,0), (1,2) | 是的 |

 结果板：```
X.X
OOO
...
```中间一排完全变成`O`，因此搜索立即停止。 这表明我们必须检查多个对而不是做出贪婪的选择。 

### 示例 2

 输入板：```
X.X
.X.
...
```空单元格：

 | 配对测试 | 赢了？ |
 | --- | --- |
 | 任意一对 | 没有 |

 无论两个新人在哪里`O`放置，一行中最多两个单元格可以成为`O`。 由于一开始并没有什么用处`O`要完成三细胞系，胜利是不可能的。 

这个例子表明，两次移动并不足以自动创建获胜线。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(E²) | 枚举所有空单元对，其中 E ≤ 9 |
 | 空间| O(1) | O(1) | 棋盘尺寸固定为 3 × 3 |

 自从`E`永远不会超过 9，最多检查 36 对。 即使有 1000 个测试用例，总工作量仍然很小，并且很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    def is_win(board):
        for r in range(3):
            if all(board[r][c] == 'O' for c in range(3)):
                return True

        for c in range(3):
            if all(board[r][c] == 'O' for r in range(3)):
                return True

        if all(board[i][i] == 'O' for i in range(3)):
            return True

        if all(board[i][2 - i] == 'O' for i in range(3)):
            return True

        return False

    t = int(input())

    out = []

    for _ in range(t):
        board = [list(input().strip()) for _ in range(3)]

        empty = []
        for r in range(3):
            for c in range(3):
                if board[r][c] == '.':
                    empty.append((r, c))

        found = False

        for i in range(len(empty)):
            for j in range(i + 1, len(empty)):
                temp = [row[:] for row in board]

                r1, c1 = empty[i]
                r2, c2 = empty[j]

                temp[r1][c1] = 'O'
                temp[r2][c2] = 'O'

                if is_win(temp):
                    out.append("YES")
                    out.extend("".join(row) for row in temp)
                    found = True
                    break

            if found:
                break

        if not found:
            out.append("NO")

    print("\n".join(out))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue()

# sample 1
res = run("""1
X.X
.O.
...
""")
assert res.startswith("YES")

# sample 2
res = run("""1
O.X
.O.
X..
""")
assert res.startswith("YES")

# impossible case
assert run("""1
X.X
.X.
...
""").strip() == "NO"

# diagonal completion
res = run("""1
O..
.X.
...
""")
assert res.startswith("YES")

# many empty cells
res = run("""1
...
...
...
""")
assert res.strip() == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`X.X / .O. / ...`| 是 | 样品式获奖排|
 |`O.X / .O. / X..`| 是 | 样本式获胜安置 |
 |`X.X / .X. / ...`| 否 | 两次移动后没有可能的路线 |
 |`O.. / .X. / ...`| 是 | 对角线完成 |
 | 空板| 否 | 单独两招不能组成三招`O`s |

 ## 边缘情况

 ### 获胜线需要两个新动作

 输入：```
...
.O.
...
```中间一行仅包含一个`O`。 大雄可以放置`O`在该行的两个剩余单元格中：```
...
OOO
...
```该算法测试配对并正确报告`YES`。 

### 在一对成功之前，许多对都失败了

 输入：```
X.X
.O.
...
```几对空单元格不会创建获胜线。 该算法不断搜索，直到到达与中间行的两侧单元相对应的对。 因为每一对都会被检查，所以获胜的配置永远不会被错过。 

### 没有现有的线路支持

 输入：```
...
.X.
...
```两次移动后，大雄最多可以创建两个`O`s 在任何行、列或对角线上。 获胜线需要三个。 该算法耗尽所有对，找到没有获胜的板，并打印`NO`。 

### 存在多个获胜答案

 输入：```
OO.
...
...
```放置一个`O`顶行的剩余单元格中已经完成了一行，第二次移动可能在其他任何地方。 存在多个有效输出。 该算法返回它遇到的第一个获胜棋盘，这是问题陈述所允许的。
