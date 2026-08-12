---
title: "CF 102386G - \u0423\u0440\u0430\u043b\u044c\u0441\u043a\u0438\u0435\u0431\u043b\u0438\u043d\u0447\u0438\u043a\u0438"
description: "将每个未烧毁的单元视为图的顶点。 当两个顶点的单元共享一条边时，它们就被连接起来。 该语句保证该图是连通的。"
date: "2026-08-12T21:44:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102386
codeforces_index: "G"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0442\u0443\u0440 \u0423\u0440\u0430\u043b\u044c\u0441\u043a\u043e\u0433\u043e \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044c\u0444\u0438\u043d\u0430\u043b\u0430 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u043c\u0438\u0440\u0430 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2019"
rating: 0
weight: 102386
solve_time_s: 530
verified: true
draft: false
---

[CF 102386G - \u0423\u0440\u0430\u043b\u044c\u0441\u043a\u0438\u0435 \u0431\u043b\u0438\u043d\u0447\u0438\u043a\u0438](https://codeforces.com/problemset/problem/102386/G)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 将每个未烧毁的单元视为图的顶点。 当两个顶点的单元共享一条边时，它们就被连接起来。 该语句保证该图是连通的。 每个煎饼最初都占据自己的顶点，并且每次移动都会将顶部煎饼从一个顶点移动到相邻顶点。 一次移动会翻转煎饼，因此在奇数次移动后，它会正确定向，而在偶数次移动后，它会返回到原来的方向。 

堆栈使问题变得具有欺骗性。 煎饼可以暂时与其他煎饼共享一个单元格，但只有顶部的煎饼可以再次移动。 最后，每个煎饼都必须是单独的，并且每个煎饼都必须移动奇数次。 

网格图是二分图。 当单元格的行索引和列索引之和为偶数时，将单元格设置为黑色，否则设置为白色。 每一个动作都在相反的颜色之间进行。 因此，从黑色开始并最终方向正确的煎饼必须以白色结束，而从白色开始的煎饼必须以黑色结束。 最终的位置是不同的，因此最初黑色的煎饼数量不能超过白色单元的数量，并且对称地最初白色的煎饼的数量不能超过黑色单元的数量。 

最多 100 行 100 列，最多有 10,000 个可用单元格。 线性或近线性图算法很容易满足一秒的限制。 指数依赖煎饼数量的算法是完全不可行的，因为煎饼的最大数量也是 10,000。 

单独的颜色计数条件会忽略一种结构边缘情况。 考虑```
1 2
PP
```有一个黑色单元格和一个白色单元格，因此计数看起来完美平衡。 然而答案是`NO`。 只有两个相邻的单元格时，无论哪个煎饼移动到另一个煎饼上，都会成为顶部煎饼。 它必须向后移动才能拿到下面的煎饼，因此两个煎饼无法交换。 更一般地，当每个可用单元都被占用时，我们需要可用单元图中的一个循环来提供真正的缓冲区。 

另一个容易处理不当的情况是样本```
1 3
P.P
```两张煎饼的单元格颜色相同，而只有一个单元格颜色相反。 两个煎饼都必须在不同颜色的细胞上完成，这是不可能的。 答案是`NO`。 

最后一个边缘情况是单个煎饼。 例如，```
1 2
P.
```有一张黑煎饼和一个白色目标细胞，所以答案是`YES`。 煎饼只需移动一次。 任何需要至少两个煎饼的解决方案都会错误地拒绝这种情况。 

## 方法

 直接的暴力解决方案会将整个安排视为一个状态。 一个州必须记录每个煎饼的位置、方向以及每叠煎饼内的顺序。 从每个状态，我们可以尝试将每个非空单元格的顶部煎饼移动到每个相邻的可用单元格。 广度优先搜索是正确的，因为每个合法操作都由一个转换表示，并且达到所有煎饼正确定向和分离的状态证明存在有效序列。 

问题在于该状态空间的大小。 如果有 (V) 个可用单元和 (k) 个煎饼，只需为每个标记的煎饼选择一个单元即可给出 (V^k) 个可能性。 方向将其乘以 (2^k)，堆栈内可能的顺序会添加另一个阶乘大小的分量。 即使是小得多的上限 (2^kV^k) 对于 (k,V) 大约 10,000 来说也已经没有希望了。 蛮力对于理解规则很有用，但对于解决实际约束没有帮助。 

关键的观察是，准确的移动顺序是不必要的。 每一步都会改变煎饼的位置颜色和方向。 因此，一个从黑色开始的煎饼只有当它结束为白色时才是正确的，而一个从白色开始的煎饼只有当它结束为黑色时才是正确的。 这立即给出了必要的颜色容量不平等。 

令人惊讶的是，只要有至少一个空的可用单元格，这些不等式也足够了。 由于可用图已连接，因此可以通过图传输该空单元格并将其用作缓冲区。 堆栈允许煎饼穿过占用的顶点，同时缓冲区移动。 因此，我们可以实现煎饼在两个颜色类别之间所需的重新分配。 

如果每个可用单元都已包含煎饼，则不存在空缓冲区。 在这种情况下，一个循环是必要且充分的。 在循环中，煎饼可以在其周围移动，因此循环中的每个煎饼都可以移动奇数次，而不会留下一堆。 然后，该循环充当缺失的工作空间，用于重新排列连接图的剩余部分。 没有循环的连通图是一棵树，并且每个顶点都被占用，因此无法创建永久工作区并更改所需的排列。 

因此，整个问题简化为两个检查：二分颜色容量，以及仅当每个可用单元都被占用时，可用单元图是否包含循环。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 最坏情况下的 (O(2^kV^k k!)) 状态 | (O(2^kV^k k!)) | 太慢了 |
 | 最佳| (O(nm)) | (O(nm)) | 已接受 |

 ## 算法演练

 1. 对待每一个细胞都不同`#`作为可用图的顶点。 根据 ((i+j)\bmod 2) 将其着色为黑色或白色。 这是一个有效的二分，因为每一次合法的移动都会精确地改变一行或一列。 
2. 统计可用的黑白格子总数，并分别统计最初占据黑白格子的煎饼数量。 如果黑煎饼的数量大于白色可用单元的数量，则打印`NO`。 如果白煎饼的数量大于黑色可用单元的数量，则打印`NO`。 每个煎饼的颜色必须相反，并且最后的单元格不能包含两个煎饼。 
3. 数出可用的细胞和煎饼。 如果煎饼的数量小于可用单元格的数量，则至少有一个单元格是空的。 然后，连接的图可以使用该空单元格作为移动缓冲区，因此颜色不等式就足够了。 打印`YES`。 
4. 如果每个可用单元格都包含煎饼，则颜色不等式意味着两个颜色类具有相同的大小。 我们现在需要确定可用图是否包含环。 将每对相邻的可用单元格视为无向边。 因为图是连通的，所以当边的数量至少是顶点的数量时，它就包含一个环。 
5. 如果完整的可用图表包含循环，则打印`YES`; 否则打印`NO`。 连接的非循环图是一棵树，当每个顶点都被占用时，就没有空单元格或循环可用于重新排列煎饼。 

为什么它有效：每个合法的移动都会穿过二分并翻转煎饼，因此正确方向的煎饼必须以与其起始单元格相反的颜色结束。 这证明了两个容量不等式是必要的。 当存在空单元格时，连接性允许我们在图形中移动煎饼时将其用作缓冲区，并且堆栈规则允许临时碰撞。 当没有空单元时，循环正是提供封闭缓冲路径的结构。 树没有这样的路线，而循环则可以旋转占用的配置并通过它处理剩余的连接部分。 因此，上述检查准确地表征了有效序列何时存在。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    cells = 0
    pancakes = 0

    black_cells = 0
    white_cells = 0
    black_pancakes = 0
    white_pancakes = 0

    edges = 0

    for i in range(n):
        for j in range(m):
            if grid[i][j] == '#':
                continue

            cells += 1

            if (i + j) % 2 == 0:
                black_cells += 1
            else:
                white_cells += 1

            if grid[i][j] == 'P':
                pancakes += 1
                if (i + j) % 2 == 0:
                    black_pancakes += 1
                else:
                    white_pancakes += 1

            if i + 1 < n and grid[i + 1][j] != '#':
                edges += 1
            if j + 1 < m and grid[i][j + 1] != '#':
                edges += 1

    if black_pancakes > white_cells:
        print("NO")
        return

    if white_pancakes > black_cells:
        print("NO")
        return

    if pancakes < cells:
        print("YES")
        return

    # Every usable cell is occupied.
    # The usable graph is connected, so it has a cycle iff E >= V.
    if edges >= cells:
        print("YES")
    else:
        print("NO")

if __name__ == "__main__":
    solve()
```第一个循环根据坐标的奇偶性对每个可用单元进行分类。 使用从零开始的索引不会更改二分，因为向两个坐标添加 1 会将它们的总和更改为 2。 

两个煎饼计数器记录初始位置的颜色。 将它们与相反颜色的可用单元格数量进行比较，因为每个正确完成的煎饼必须经过二分奇数次。 

边缘计数器只向下和向右看。 因此，每个水平或垂直边缘都被精确计算一次，从而避免重复计算和单独的图形数据结构。 

这`pancakes < cells`检查是两种结构情况之间的关键区别。 如果至少有一个空的可用单元格，则应用缓冲区参数。 如果所有可用单元都被占用，我们需要检查图形是否有一个周期。 

因为可用区域保证是连通的，所以树的标准特征适用：具有 (V) 个顶点的连通图在具有 (V-1) 条边时恰好是非循环的。 因此`edges >= cells`检测没有 DFS 或不相交集结构的循环。 

任何算术都不能超过几万，因此整数溢出在 Python 或典型的 C++ 实现中不是问题。 

## 工作示例

 ### 示例 1

 输入是```
1 3
P.P
```使用从零开始的坐标，单元格 0 和 2 具有相同的颜色。 

| 变量| 扫描后|
 | --- | --- |
 |`cells`| 3 |
 |`pancakes`| 2 |
 |`black_cells`| 2 |
 |`white_cells`| 1 |
 |`black_pancakes`| 2 |
 |`white_pancakes`| 0 |

 条件`black_pancakes > white_cells`是 (2 > 1)，所以算法立即打印`NO`。 

这说明了为什么仅仅检查是否有空闲单元是不够的。 有一个空闲单元，但是两个煎饼在翻转后都需要相反颜色的不同单元。 

### 示例 2

 输入是```
2 2
PP
PP
```四个细胞形成 4 个循环，每种颜色有两个细胞。 

| 变量| 扫描后|
 | --- | --- |
 |`cells`| 4 |
 |`pancakes`| 4 |
 |`black_cells`| 2 |
 |`white_cells`| 2 |
 |`black_pancakes`| 2 |
 |`white_pancakes`| 2 |
 |`edges`| 4 |

 两个颜色容量不等式都成立。 自从`pancakes == cells`，算法检查循环。 这里`edges >= cells`，因为 (4 \ge 4)，所以答案是`YES`。 

该循环恰好提供了两单元情况下所缺少的工作空间。 四个煎饼可以在正方形周围移动，将每个煎饼移动到相反的颜色。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nm)) | 每个网格单元都被检查一次，并且只为每个单元执行恒定的工作。 |
 | 空间| (O(nm)) | 网格本身使用(O(nm))内存； 所有附加计数器都使用 (O(1))。 |

 在最大尺寸下，网格仅包含 10,000 个单元，因此算法对每个单元执行一些恒定时间检查。 它完全在竞赛问题的 1 秒和 256 MB 限制之内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    cells = 0
    pancakes = 0
    black_cells = 0
    white_cells = 0
    black_pancakes = 0
    white_pancakes = 0
    edges = 0

    for i in range(n):
        for j in range(m):
            if grid[i][j] == '#':
                continue

            cells += 1

            if (i + j) % 2 == 0:
                black_cells += 1
            else:
                white_cells += 1

            if grid[i][j] == 'P':
                pancakes += 1
                if (i + j) % 2 == 0:
                    black_pancakes += 1
                else:
                    white_pancakes += 1

            if i + 1 < n and grid[i + 1][j] != '#':
                edges += 1
            if j + 1 < m and grid[i][j + 1] != '#':
                edges += 1

    if black_pancakes > white_cells:
        print("NO")
    elif white_pancakes > black_cells:
        print("NO")
    elif pancakes < cells:
        print("YES")
    elif edges >= cells:
        print("YES")
    else:
        print("NO")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# provided samples
assert run("1 3\nP.P\n") == "NO", "sample 1"
assert run("2 2\nPP\nPP\n") == "YES", "sample 2"
assert run("2 2\nPP\nP#\n") == "NO", "sample 3"

# minimum-size board, one pancake and one available neighbor
assert run("1 2\nP.\n") == "YES", "single pancake"

# two cells, both occupied, balanced colors but no cycle
assert run("1 2\nPP\n") == "NO", "occupied tree with two vertices"

# full 1 x 4 path, balanced colors but still no cycle
assert run("1 4\nPPPP\n") == "NO", "full occupied tree"

# maximum-size grid, all cells occupied, many cycles and balanced colors
grid = "\n".join(["P" * 100 for _ in range(100)])
assert run("100 100\n" + grid + "\n") == "YES", "maximum grid"

# a connected region with an empty cell and valid color capacities
assert run("2 3\nPP.\n...\n") == "YES", "empty buffer"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 2 / P.`|`YES`| 最少的不平凡的董事会和一个煎饼。 |
 |`1 2 / PP`|`NO`| 当二顶点树的每个顶点都被占用时，平衡的颜色计数是不够的。 |
 |`1 4 / PPPP`|`NO`| 完全占据更大的非循环图，捕获仅检查颜色计数的解决方案。 |
 |`100 100 / all P`|`YES`| 最大网格尺寸和大连通区域上的循环条件。 |
 |`2 3 / PP. / ...`|`YES`| 存在一个空的缓冲单元，其中颜色不等式足够。 |

 ## 边缘情况

 第一个边缘情况是一块带有两个可用单元和两个煎饼的板：```
1 2
PP
```每种颜色都有一个单元格，每种颜色都有一个煎饼，因此两个容量不等式都通过了。 然而，所有单元格都被占用，并且图有一条边和两个顶点，所以`edges >= cells`是假的。 算法打印`NO`。 缺少的循环不能通过堆叠来替代，因为顶部煎饼必须在底部煎饼移动之前离开第二个单元。 

第二个边缘情况是原始情况`1 x 3`例子：```
1 3
P.P
```可用的单元格颜色有黑色、白色、黑色。 有两个黑色煎饼，但只有一个白色单元格。 第一次容量检查立即失败，给出`NO`。 再多的临时堆叠也无法解决最终电池可能出现的短缺问题。 

第三个边缘情况是单个煎饼：```
1 2
P.
```有一张黑煎饼和一张白细胞。 第一个容量不等式是 (1 \le 1)，第二个是微不足道的，并且存在一个空单元格，因为两个可用单元格仅包含一个煎饼。 算法打印`YES`，相当于将煎饼移动到其相邻单元格一次。 

第四种边缘情况是具有四个单元的完全占用的路径：```
1 4
PPPP
```两种颜色各包含两个单元格和两个煎饼，因此奇偶校验计数是平衡的。 然而，该图有四个顶点，只有三个边，使其成为一棵树。 由于没有空单元格和循环，该算法打印`NO`。 这是两细胞阻塞的放大版本。 

第五个边缘情况是完全占用的（2 × 2）板：```
2 2
PP
PP
```每种颜色有两个单元格和煎饼，四个可用单元格包含围绕一个循环的四个边缘。 该算法到达完全占用分支并发现`edges >= cells`，所以它打印`YES`。 该周期允许所占用的配置旋转并给出所需的奇数移动计数。
