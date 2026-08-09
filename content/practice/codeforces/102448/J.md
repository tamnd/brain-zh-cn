---
title: "CF 102448J - 铃儿响叮当"
description: "我们有一棵有 (N) 个顶点和 (N-1) 个边的树。 每条边要么已经具有五种颜色之一，编号为 (1) 到 (5)，要么仍然未着色并用 (0) 标记。 最终的绘画会为每个未着色的边缘分配颜色，同时保持所有现有颜色不变。"
date: "2026-08-08T12:28:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102448
codeforces_index: "J"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2020"
rating: 0
weight: 102448
solve_time_s: 504
verified: true
draft: false
---

[CF 102448J - 铃儿响叮当](https://codeforces.com/problemset/problem/102448/J)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有 (N) 个顶点和 (N-1) 个边的树。 每条边要么已经具有五种颜色之一，编号为 (1) 到 (5)，要么仍然未着色并用 (0) 标记。 最终的绘画会为每个未着色的边缘分配颜色，同时保持所有现有颜色不变。 

当在每个顶点，所有入射边都具有不同的颜色时，最终着色有效。 相同的颜色可以在树中出现多次，但共享一个顶点的两条边可能永远不会具有相同的颜色。 答案是部分着色树的有效完成数，取模 (10^9+7)。 原始约束允许 (N) 最多 (10^5) 个，并且具有恰好 (N-1) 个边缘描述。 

树的大小排除了 (N) 中的任何指数。 可以有 (5^{N-1}) 个分配给未着色的边，因此对于只有几十条边的树来说，枚举它们已经是不可能的。 即使是 (O(N^2)) 算法对于 2 秒限制下的 (10^5) 个顶点来说也太大了。 我们基本上需要线性时间，只有一个很小的常数因子，具体取决于五种可用颜色。 

关键的结构事实是，有效顶点最多可以有五个入射边。 一旦我们知道了将顶点连接到其父级的边的颜色，所有子边的颜色只需彼此不同并且与父级颜色不同即可。 由于只有五种颜色，因此子边缘使用的完整颜色集适合 5 位掩码。 

一些边缘情况很容易被错误处理。 

考虑单个顶点：```
1
```没有可着色的边缘，因此只有一幅有效的绘画。 假设每个顶点都有父边的 DP 实现可能会意外地返回零。 正确的输出是`1`。 

具有相同预先指定颜色的相邻边使答案立即为零：```
3
1 2 1
2 3 1
```在顶点 (2) 处，两个入射边都已具有颜色 (1)，因此不可能完成。 正确的输出是`0`。 仅在为未着色边缘选择颜色时检查冲突的实现会默默地忽略此矛盾。 

具有超过五个入射边的顶点也是不可能的：```
7
1 2 0
1 3 0
1 4 0
1 5 0
1 6 0
1 7 0
```所有六个边都必须在顶点 (1) 处接收成对不同的颜色，但只存在五种颜色。 正确的输出是`0`。 掩码实现不得意外地仅处理前五个子级而忽略第六个。 

最后，不在顶点相交的边上允许使用相同的颜色：```
4
1 2 1
2 3 2
3 4 1
```每个顶点仍然看到不同的入射颜色，因此这是有效的着色，答案是`1`。 将每种颜色视为全局可用一次的粗心实现会错误地拒绝它。 

## 方法

 直接的方法是为每个未着色的边缘分配五种颜色中的一种，然后检查所得的着色是否有效。 如果有 (K) 个未着色边缘，则会产生 (5^K) 个候选边缘。 在最坏的情况下（K=N-1），所以有（5^{N-1}）个完整的着色。 检查一种颜色需要 (\Theta(N)) 时间，因为可能需要检查每个边或顶点。 因此，总工作量为 (\Theta(N5^{N-1}))，这几乎立即变得毫无希望。 

蛮力之所以有效，是因为每个完整的作业都可以独立检查。 它失败是因为它重复求解相同的子树。 例如，一旦进入子树的边的颜色固定，则该边以下的所有内容都可以独立于树的其余部分进行计数。 这正是 DP 可以利用的重复结构树。 

树的根位于任意顶点。 对于每个顶点 (v)，假设其父顶点的边具有颜色 (p)。 树的其余部分中对 (v) 的子树重要的唯一信息是该值 (p)。 定义 (dp[v][p]) 为 (v) 子树的有效着色数，假设父边具有颜色 (p)。 

(v) 的子级不能共享颜色，并且它们的颜色不能等于 (p)。 对于从 (v) 到子树 (u) 的无色边，选择颜色 (c) 会从子树的子树中贡献 (dp[u][c]) 路。 对于颜色为 (c) 的已着色边缘，只有一种可能的选择，贡献 (dp[u][c])，前提是 (c) 尚未在 (v) 中使用。 

剩下的挑战是在不显式尝试每个 (5^5) 分配的情况下组合子级。 由于只有五种颜色，因此用 5 位掩码表示已处理的子边缘中已使用的颜色。 只有 (2^5=32) 个掩码。 我们可以对孩子们运行一个小的子集 DP。 

有一项有用的优化可以使 DP 更干净。 子边缘分配本身不依赖于父颜色 (p)。 我们可以首先计算所有不同的子边缘颜色分配，存储它们使用的颜色掩码。 之后，(dp[v][p]) 只是不包含颜色 (p) 的掩模之和。 对于根来说，没有父边，用 (p=0) 表示，因此允许使用每个掩码。 

由此产生的复杂性与顶点数量呈线性关系，直至来自五种颜色和 32 个遮罩的常数因子。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (\Theta(N5^{N-1})) | (O(N)) | 太慢了 |
 | 最佳 | (O(N\cdot 5\cdot 32)) | (O(N\cdot 5)) | 已接受 |

 ## 算法演练

 1. 树的根位于顶点 (1)。 对于每个顶点，记住其父顶点，以便在处理其子顶点时排除朝向父顶点的边。 在 Python 中迭代遍历是更可取的，因为树可以是长度为 (10^5) 的路径，这将超出正常的递归调用堆栈限制。 
2. 为 (p\in{0,1,2,3,4,5}) 定义 (dp[v][p])。 对于 (p=1,\ldots,5)，当父边具有颜色 (p) 时，它会计算 (v) 子树内的有效着色。 状态 (p=0) 仅用于根，其中没有父边。 
3. 以反向遍历顺序处理顶点，以便在处理其父级时每个子级的 DP 值都已知。 对于顶点 (v)，启动子集 DP`ways[0] = 1`。 掩码准确记录哪些颜色已分配给已处理的子边缘。 
4. 对于已经用颜色 (c) 着色的子边缘，只能使用该颜色。 如果当前蒙版已包含 (c)，则禁止过渡，因为 (v) 处的两个入射边将共享颜色。 否则，将子级的 (dp[u][c]) 方法添加到包含 (c) 的掩码中。 
5. 对于未着色的子边缘，尝试其位尚未出现在蒙版中的每种颜色 (c)。 选择 (c) 会贡献 (dp[u][c]) 种方式，因为在固定边缘颜色之后，整个子子树恰好具有那么多的有效补全。 
6. 处理完所有孩子后，`ways[mask]`表示对所有子边的有效分配数量，这些子边完全使用中的颜色`mask`。 对于根，将每个蒙版求和，因为没有父颜色。 对于非根顶点和父颜色 (p)，仅对不包含 (p) 的蒙版求和。 这是父边缘必须与每个子边缘具有不同颜色的局部条件。 
7. 将这六个值存储为`dp[v]`并继续向上。 处理顶点(1)时，所需答案为`dp[1][0]`，因为根没有父边。 

不变量是处理完一个顶点(v)后，`dp[v][p]`在父边具有颜色 (p) 的单一假设下，对整个子树的每个有效着色进行一次计数。 子集 DP 强制所有子边之间成对不同的颜色，而最终掩模过滤强制与父边不等。 由于不同的子子树只共享顶点（v），一旦它们的入射边颜色固定，它们的内部选择是独立的。 因此，每个有效的全局着色恰好对应于一个DP路径，并且每个DP路径代表一种有效的着色。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007
FULL = 31

def solve():
    n = int(input())

    graph = [[] for _ in range(n)]

    for _ in range(n - 1):
        u, v, c = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append((v, c))
        graph[v].append((u, c))

    parent = [-1] * n
    parent[0] = -2
    order = [0]

    for v in order:
        for u, c in graph[v]:
            if u == parent[v]:
                continue
            parent[u] = v
            order.append(u)

    dp = [[0] * 6 for _ in range(n)]

    for v in reversed(order):
        ways = [0] * 32
        ways[0] = 1

        for u, edge_color in graph[v]:
            if u == parent[v]:
                continue

            new_ways = [0] * 32

            if edge_color != 0:
                bit = 1 << (edge_color - 1)
                child_ways = dp[u][edge_color]

                if child_ways:
                    for mask in range(32):
                        value = ways[mask]
                        if value and not (mask & bit):
                            new_ways[mask | bit] += value * child_ways

            else:
                child_dp = dp[u]

                for mask in range(32):
                    value = ways[mask]
                    if not value:
                        continue

                    for color in range(1, 6):
                        bit = 1 << (color - 1)
                        if not (mask & bit):
                            new_ways[mask | bit] += value * child_dp[color]

            for mask in range(32):
                new_ways[mask] %= MOD

            ways = new_ways

        total = sum(ways) % MOD
        dp[v][0] = total

        for color in range(1, 6):
            bit = 1 << (color - 1)
            count = 0

            for mask in range(32):
                if not (mask & bit):
                    count += ways[mask]

            dp[v][color] = count % MOD

    print(dp[0][0])

if __name__ == "__main__":
    solve()
```邻接列表存储每条边的两个端点及其固定颜色。 颜色为零意味着过渡可以选择五种颜色中的任何一种。 

这`parent`和`order`数组将无向树转变为有根树，无需递归。 因为`order`是从根向外构建的，反转它可以保证孩子在父母之前被处理。 

实现的核心部分是`ways`。 它的索引是一个五位掩码，其中位 (c-1) 表示颜色 (c) 已被处理的子边缘之一使用。 固定边缘恰好具有一种可能的颜色，而未着色的边缘会尝试蒙版中尚未表示的所有五种颜色。 

子 DP 值会乘以每个转换。 这是独立子树的乘积规则：在判定边 ((v,u)) 具有颜色 (c) 后，有`dp[u][c]`完成以下所有内容的可能方法 (u)。 

该代码延迟模运算，直到每个子项都被合并之后。 每个进入转换的 DP 值都已经低于 (10^9+7)，并且每个中间值`new_ways`对于 Python 的整数算术来说，值仍然足够小。 在每个子项之后进行减少可以保持值有界，而无需在每个单独的转换上进行模运算。 

最后的循环计算`dp[v][color]`通过排除包含该颜色的蒙版。 这相当于在分配所有子边之后强制执行父边限制。 对于根来说，`dp[0][0]`对每个掩码求和，因为颜色零不对应于实际的边缘颜色。 

Python中不存在整数溢出问题，但是模运算仍然是必要的，因为请求的答案是模（10^9+7）。 更重要的是，保持 DP 值减小可以防止中间整数不必要地增长。 

## 工作示例

 ### 示例 1

 该树的根位于顶点 (1)。 边缘 (1-3) 固定为颜色 (1)，而边缘 (1-2) 和 (3-4) 未着色。 

| 顶点| 子缘| 儿童 DP 值 | 非零`ways`口罩| DP | 产生的结果
 | ---| ---| ---| ---| ---|
 | 4 | 无 | 所有状态 (=1) | 掩码 (0:1) | (dp[4][p]=1) |
 | 3 | (3-4) 无色 | 所有状态 (=1) | 五个一位掩码，每个 (1) | (dp[3][0]=5,\ dp[3][1..5]=4) |
 | 2 | 无 | 所有状态 (=1) | 掩码 (0:1) | (dp[2][p]=1) |
 | 1 | (1-2) 未着色，(1-3) 固定 (1) | (dp[2][c]=1,\dp[3][1]=4) | 包含颜色 (1) 和另一种颜色的蒙版，每种颜色 (4) | (dp[1][0]=16) |

 在顶点 (3) 处，到顶点 (4) 的边可以使用五种颜色中的任何一种。 如果父边缘的颜色为 (1)，则仅保留其中四个选项，即 (dp[3][1]=4)。 

在顶点 (1) 处，到顶点 (3) 的边必须使用颜色 (1)。 然后，边到顶点 (2) 可以使用其他四种颜色中的任何一种。 对于每个这样的选择，顶点 (3) 的子树都有四个完成。 因此答案是(4\cdot4=16)。 

### 示例 2

 这是一条具有三个未着色边缘的路径。 

| 顶点| 子缘| 儿童 DP 值 |`ways`孩子之后| DP | 产生的结果
 | ---| ---| ---| ---| ---|
 | 4 | 无 | 所有状态 (=1) | 掩码 (0:1) | 所有州 (1) |
 | 3 | (3-4) 无色 | 全部 (1) | 五个一位掩码，每个 (1) | (dp[3][0]=5,\ dp[3][1..5]=4) |
 | 2 | (2-3) 无色 | (dp[3][c]=4) | 五个一位掩码，每个 (4) | (dp[2][0]=20,\ dp[2][1..5]=16) |
 | 1 | (1-2) 无色 | (dp[2][c]=16) | 五个一位掩码，每个 (16) | (dp[1][0]=80) |

 第一条边有五个选择。 一旦其颜色固定，下一条边就有四种选择，最后一条边也有四种选择。 DP 精确计算 (5\cdot4\cdot4=80)，与样本输出匹配。 

该示例还演示了为什么父颜色必须是 DP 状态的一部分。 在顶点 (3) 处，当没有施加父颜色时，有五种可能性，但在父边缘已使用五种颜色之一后，只有四种可能性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N\cdot5\cdot32)) | 每个孩子最多处理 32 个面具和 5 种可能的颜色 |
 | 空间| (O(N\cdot5+N)) | DP 为每个顶点存储六个状态，以及树和遍历数组 |

 颜色数固定为五，因此因子 (5) 和 (32=2^5) 是常数。 因此，出于渐近目的，该算法在顶点数量上是线性的。 对于 (N\le10^5)，树边的数量也是 (O(10^5))，因此该解决方案非常适合预期的内存范围，并避免指数 (5^{N-1}) 搜索。 

## 测试用例

 下面的测试工具使用相同的`solve()`作为提交的解决方案。 最大尺寸的情况生成为具有 (100000) 个顶点的星形。 它的中心有 (99999) 个入射边，所以答案立即为零。```python
import sys
import io

MOD = 1_000_000_007

def solve():
    input = sys.stdin.readline

    n = int(input())
    graph = [[] for _ in range(n)]

    for _ in range(n - 1):
        u, v, c = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append((v, c))
        graph[v].append((u, c))

    parent = [-1] * n
    parent[0] = -2
    order = [0]

    for v in order:
        for u, c in graph[v]:
            if u == parent[v]:
                continue
            parent[u] = v
            order.append(u)

    dp = [[0] * 6 for _ in range(n)]

    for v in reversed(order):
        ways = [0] * 32
        ways[0] = 1

        for u, edge_color in graph[v]:
            if u == parent[v]:
                continue

            new_ways = [0] * 32

            if edge_color != 0:
                bit = 1 << (edge_color - 1)
                child_ways = dp[u][edge_color]

                if child_ways:
                    for mask in range(32):
                        value = ways[mask]
                        if value and not (mask & bit):
                            new_ways[mask | bit] += value * child_ways
            else:
                child_dp = dp[u]

                for mask in range(32):
                    value = ways[mask]
                    if not value:
                        continue

                    for color in range(1, 6):
                        bit = 1 << (color - 1)
                        if not (mask & bit):
                            new_ways[mask | bit] += value * child_dp[color]

            for mask in range(32):
                new_ways[mask] %= MOD

            ways = new_ways

        dp[v][0] = sum(ways) % MOD

        for color in range(1, 6):
            bit = 1 << (color - 1)
            total = 0
            for mask in range(32):
                if not (mask & bit):
                    total += ways[mask]
            dp[v][color] = total % MOD

    print(dp[0][0])

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

# Provided sample 1
assert run(
    """4
1 2 0
1 3 1
3 4 0
"""
) == "16", "sample 1"

# Provided sample 2
assert run(
    """4
1 2 0
2 3 0
3 4 0
"""
) == "80", "sample 2"

# Minimum-size tree: no edges means exactly one empty coloring.
assert run(
    """1
"""
) == "1", "minimum-size tree"

# Two vertices and one uncolored edge: any of the five colors works.
assert run(
    """2
1 2 0
"""
) == "5", "single uncolored edge"

# Adjacent fixed edges with the same color are impossible.
assert run(
    """3
1 2 1
2 3 1
"""
) == "0", "adjacent equal fixed colors"

# A vertex with exactly five incident edges can use every color once.
assert run(
    """6
1 2 0
1 3 0
1 4 0
1 5 0
1 6 0
"""
) == "120", "degree five"

# Maximum-size input. The center has 99999 incident edges,
# so no proper edge coloring with five colors exists.
max_n = 100000
max_input = str(max_n) + "\n" + "".join(
    f"1 {v} 0\n" for v in range(2, max_n + 1)
)
assert run(max_input) == "0", "maximum-size impossible star"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1`|`1`| 空树和根状态 |
 | 两个顶点，一条无色边 |`5`| 基本五色选择和边界索引 |
 | 具有固定边颜色的三顶点路径`1`|`0`| 检测现有的本地冲突 |
 | 五棱无色星|`120`| 精确的五度边界，给出 (5!) |
 | (100000)-顶点无色星 |`0`| 最大输入大小和次数大于 5 |

 ## 边缘情况

 对于单顶点情况，输入很简单：```
1
```遍历仅包含顶点 (1)。 它的子集 DP 开头`ways[0] = 1`并且不处理边缘，因此唯一的掩模仍然有效。 根使用状态`p=0`，对所有掩码求和并给出`1`。 实施过程中无需特殊情况。 

对于具有相同颜色的相邻预着色边缘，请考虑：```
3
1 2 1
2 3 1
```当处理顶点（2）时，子边缘信息和父边缘信息最终都需要同一顶点处的颜色（1）。 在子集DP中，第一固定颜色占据位(0)，而第二固定颜色尝试占据相同位。 由于该位已经存在，因此转换不会产生任何状态。 DP值变为零，最终答案为`0`。 

对于具有五个以上入射边的顶点，请考虑六边星形：```
7
1 2 0
1 3 0
1 4 0
1 5 0
1 6 0
1 7 0
```处理完五个子项后，每个可能的掩码最多设置五个位。 第六个子元素不能选择任何缺失位的颜色，因此每次转换都会产生零。 决赛`ways`数组全为零，给出答案`0`。 该实现不需要单独的程度检查，因为五位状态空间自然地检测到这种可能性。 

对于颜色在树的不同部分重复的情况，请考虑：```
4
1 2 1
2 3 2
3 4 1
```两条 color-1 边不相邻，因此不存在冲突。 每条边都已经固定，并且每个顶点都看到不同的入射颜色。 DP 在每个顶点精确地遵循一次转换并返回`1`。 这证实了遮罩仅跟踪与当前顶点相关的边缘之间的颜色，而不是错误地将颜色视为全局唯一的。
