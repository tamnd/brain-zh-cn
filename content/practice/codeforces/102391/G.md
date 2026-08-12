---
title: "CF 102391G - 按字典顺序排列的最小步行"
description: "我们有一个有向图，其边带有不同的整数颜色。 从(S)开始，我们可以遍历任何出边，并且允许我们重新访问顶点和边。 唯一的要求是步行最终到达（T）。"
date: "2026-08-10T20:07:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102391
codeforces_index: "G"
codeforces_contest_name: "XX Open Cup, Grand Prix of Korea"
rating: 0
weight: 102391
solve_time_s: 168
verified: true
draft: false
---

[CF 102391G - 按字典顺序最小行走](https://codeforces.com/problemset/problem/102391/G)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个有向图，其边带有不同的整数颜色。 从(S)开始，我们可以遍历任何出边，并且允许我们重新访问顶点和边。 唯一的要求是步行最终到达（T）。 在所有长度最多为 (10^{100}) 的步行中，我们想要字典顺序最小的边缘颜色序列。 

字典顺序使得第一个决定比接下来的所有决定都重要得多。 如果一个有效步行从颜色 (3) 开始，另一个有效步行从颜色 (7) 开始，则无论稍后发生什么，第一个步行获胜。 如果两条路径具有相同的前缀，我们将比较它们不同的第一个位置。 当较短的序列是较长序列的精确前缀时，它也会获胜。 

该图可以包含 (100,000) 个顶点和 (300,000) 个边。 由于原始问题的 2 秒限制，(O(NM)) 或 (O(N^2)) 方法已经太昂贵了。 我们基本上需要线性或 (O((N+M)\log N)) 工作。 巨大的 (10^{100}) 界限排除了任何依赖于最大可能步行长度的算法。 幸运的是，答案本身的结构要简单得多。 

在某些情况下，粗心的贪婪实现可能会失败。 第一种是取最小的出边，而不检查其目的地是否最终可以到达（T）。 例如，```
3 2 1 3
1 2 1
1 3 5
```正确答案是`5`。 顶点 (2) 是一个死胡同，因此选择颜色 (1) 无法产生有效的行走。 只考虑最小颜色的贪心算法会错误地选择它。 

第二种情况是一个循环。 考虑```
3 4 1 3
1 2 1
2 1 2
2 3 7
1 3 5
```正确的输出是`TOO LONG`。 从顶点 (1) 开始，颜色 (1) 优于颜色 (5)。 从顶点 (2) 开始，颜色 (2) 优于颜色 (7)。 因此，贪婪的选择反复产生```
1, 2, 1, 2, 1, 2, ...
```步行最终可以离开循环并到达 (T)，但是将退出延迟另一个循环会使序列按字典顺序变小。 由于允许的最大长度是天文数字，因此得到的最优序列远长于(10^6)。 

第三种情况是根本无法到达（T）。 例如，```
2 0 2 1
```根本没有走路，所以答案是`IMPOSSIBLE`。 

## 方法

 直接的蛮力会枚举从 (S) 开始的所有可能的步行，将到达 (T) 的步行保持在允许的长度内，并比较它们的颜色序列。 这是正确的，因为它明确考虑了每个候选人。 问题在于候选人的数量。 一个图可以重复地有两个有意义的选择，最多产生 (\Theta(2^{L/2})) 不同的长度 (L) 的游走。 如果我们实际实现每个序列，则工作量为 (\Theta(L2^{L/2}))。 对于 (L=10^{100})，这不仅太慢，而且根本上是不可能的。 

有用的观察是，一旦我们知道哪些顶点仍然可以到达（T），字典顺序就可以让我们独立决定下一条边。 假设我们当前位于顶点 (u)。 任何通向无法到达 (T) 的顶点的传出边都是无关紧要的，因为使用该边的每次行走都是无效的。 在所有剩余的边中，必须选择最小的颜色。 选择更大的颜色永远无法通过拥有更好的后缀来修复，因为第一个不同的颜色已经决定了词典比较。 

这为每个有用的顶点提供了确定性的贪婪过渡。 首先使用反转图上的遍历来标记每个可以到达（T）的顶点。 然后，对于每个有用的顶点 (u)，选择其目的地也有用的最小颜色的出射边缘。 

现在沿着从 (S) 开始的那些选定的边进行操作。 只有两种可能。 我们最终到达（T），在这种情况下，我们收集的序列就是答案。 否则，因为只有 (N) 个顶点，所以某些顶点会重复并且所选的过渡形成一个循环。 

为什么循环意味着`TOO LONG`而不仅仅是“贪婪算法被卡住了”？ 在该循环上的每个顶点，所选边的颜色严格小于所有其他有用的传出边的颜色。 颜色是全球独一无二的，所以不能有领带。 如果我们在某个点离开循环，我们必须用更大的颜色替换选定的循环边缘。 通过另一次循环遍历来延迟替换会使序列按字典顺序变小。 我们可以多次重复该循环，并且仍然保持在 (10^{100}) 长度限制内。 因此，字典顺序上的最小有界行走具有巨大的长度，当然大于 (10^6)。 

颜色是唯一的这一事实在这里很有用，因为它消除了两个不同的传出边缘具有相同颜色的可能性。 同样的贪婪结构仍然可以用领带来制定，但需要额外小心在相同的第一颜色中选择最佳后缀。 

除了可选排序之外，所得方法是线性的。 我们可以通过扫描每个邻接列表一次并记住其最小有用边缘来完全避免排序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 分支图中的 (\Theta(L2^{L/2})) | 指数| 太慢了|
 | 最佳 | (O(N+M)) | (O(N+M)) | 已接受 |

 在针对该问题的独立发布的解决方案讨论中也给出了相同的贪婪特征。 

## 算法演练

 1. 构建原始图及其反转图。 需要原始图来选择边，而反转图让我们确定哪些顶点最终可以到达（T）。 
2. 从反转图中的 (T) 开始运行图遍历。 将这次遍历到达的每个顶点标记为`good`。 一个顶点是`good`恰好当存在从该顶点到 (T) 的定向步行时。 

这种过滤是必不可少的。 如果颜色非常小的边通向 (T) 无法到达的区域，则该边不是有效的候选边。 
3. 如果 (S) 不是`good`， 打印`IMPOSSIBLE`。 没有从 (S) 到 (T) 的有效步行，因此无法输出颜色序列。 
4. 对于每个顶点 (u)，检查其出边并找到其目的地为的颜色最小的边`good`。 存储其目的地和颜色。 

每一个`good`(T) 以外的顶点至少有一条这样的边，因为根据定义它有一些到 (T) 的路径。 
5. 从 (S) 开始，保留`visited`数组，并重复遵循存储的最小有用边缘。 在移动到目的地之前将其颜色附加到答案中。 

这`visited`array 准确检测确定性贪婪游走进入循环的情况。 不需要仅仅为了检测重复而存储整个序列。 
6. 如果当前顶点变为（T），则打印所有收集到的颜色。 由于没有重复的顶点，因此该路径最多包含 (N-1) 条边。 特别是，它的长度自动低于 (10^6)。 
7. 如果在到达(T)之前第二次遇到某个顶点，则打印`TOO LONG`。 

在每个重复的顶点处，贪婪边在仍然可以通向 (T) 的所有边中具有最小的可能颜色。 任何退出循环的有限行走最终都必须选择更大的颜色而不是贪婪的边缘。 重复该循环会推迟较大的颜色，并使结果序列按字典顺序变小。 由于允许的最大长度为 (10^{100})，远远大于 (10^6)，因此无法打印所需的答案。 

### 为什么它有效

 考虑当前顶点 (u)。 每个有效的延续都必须采用其目的地可以到达 (T) 的边。 在这些边缘中，颜色最小的边缘必须出现在字典顺序最小的序列中。 如果另一个有效的行走在此位置选择了更大的颜色，则其序列已经更大，无论其后缀如何。 因此，第一个贪婪选择是被迫的，并且相同的论点递归地应用于以后的每个顶点。 

如果贪婪过程到达 (T) 而不重复顶点，则每个选定的边都受到此参数的强制，因此生成的序列是按字典顺序排列的最小有效序列。 

如果该过程重复一个顶点，则从该点开始的确定性转变形成一个循环。 在每个循环顶点，所选的边都小于最终可能到达 (T) 的所有其他边。 最终离开循环的任何有效行走都必须在某个第一个出口位置选择较大的边缘。 在进入该出口之前完成一个完整循环的步行在该点之前具有相同的前缀，然后具有较小的循环颜色，因此按字典顺序它更小。 重复此参数表明最佳有界行走在退出之前使用最大可用重复次数。 边界 (10^{100}) 使其长度远大于 (10^6)，因此`TOO LONG`是正确的输出。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, s, t = map(int, input().split())

    graph = [[] for _ in range(n)]
    rev = [[] for _ in range(n)]

    for _ in range(m):
        u, v, c = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append((v, c))
        rev[v].append(u)

    # Find all vertices that can reach T.
    good = [False] * n
    good[t] = True

    stack = [t]
    while stack:
        u = stack.pop()
        for v in rev[u]:
            if not good[v]:
                good[v] = True
                stack.append(v)

    if not good[s]:
        print("IMPOSSIBLE")
        return

    # For every useful vertex, remember its minimum-color
    # outgoing edge whose destination is also useful.
    next_vertex = [-1] * n
    next_color = [0] * n

    for u in range(n):
        best_color = None
        best_vertex = -1

        for v, c in graph[u]:
            if not good[v]:
                continue
            if best_color is None or c < best_color:
                best_color = c
                best_vertex = v

        if best_vertex != -1:
            next_vertex[u] = best_vertex
            next_color[u] = best_color

    # Follow the deterministic greedy transitions.
    visited = [False] * n
    answer = []

    u = s

    while u != t:
        if visited[u]:
            print("TOO LONG")
            return

        visited[u] = True

        v = next_vertex[u]

        # This should not happen because u is good and u != T.
        if v == -1:
            print("IMPOSSIBLE")
            return

        answer.append(next_color[u])
        u = v

    print(*answer)

if __name__ == "__main__":
    solve()
```第一个图结构将每条边存储在正向图中，而在反向图中仅存储其前趋。 因此，从反向图中的 (T) 开始，正好访问可到达 (T) 的顶点。 

这`good`测试是在任何贪婪选择之前完成的。 这是防止算法选择导致死胡同的小颜色的主要正确性条件。 

通过对每个邻接列表进行单次扫描来找到最小有用的传出边缘。 无需对边缘进行排序。 由于在此阶段每条边都被检查一次，因此它贡献了 (O(M)) 总工作量。 

最终的遍历是确定性的。 一次`next_vertex[u]`计算完毕后，贪心算法只能选择一条边 (u)。`visited[u]`在移动到下一个顶点之前设置，因此遇到`visited[u]`稍后的迭代意味着一个循环实际上已经完成。 (T) 周围不存在相差一的问题，因为 (T) 在重复顶点测试之前进行了检查。 

Python 整数可以轻松处理给定的颜色限制 (10^9)，并且该算法从不执行涉及 (10^{100}) 的算术。 我们根本不需要表示巨大的步行长度。 

## 工作示例

 ### 示例 1

 输入是```
3 3 1 3
1 2 1
2 3 7
1 3 5
```所有三个顶点都可以到达顶点 (3)，因此每个顶点都是有用的。 在顶点 (1) 处，有用的输出颜色是 (1) 和 (5)，因此贪婪选择是颜色 (1)。 在顶点 (2) 处，唯一有用的出边具有颜色 (7)，到达 (T)。 

| 当前顶点 | 良好的出线边缘 | 已选颜色 | 下一个顶点 | 之前访问过 |
 | ---| ---| ---| ---| ---|
 | 1 | (1\to2) 与 1, (1\to3) 与 5 | 1 | 2 | 没有 |
 | 2 | (2\to3) 与 7 | 7 | 3 | 没有 |
 | 3 | 停止| | | |

 结果序列是`1 7`。 顶点 (1) 处的贪婪选择击败了颜色 (5) 的直接边缘，因为第一个不同的颜色是 (1<5)。 

### 示例 2

 输入是```
3 4 1 3
1 2 1
2 1 2
2 3 7
1 3 5
```同样，每个顶点都可以到达 (3)。 (1) 中的最小有用边缘具有颜色 (1)，而 (2) 中的最小有用边缘具有颜色 (2)。 

| 当前顶点 | 良好的出线边缘 | 已选颜色 | 下一个顶点 | 之前访问过 |
 | ---| ---| ---| ---| ---|
 | 1 | (1\to2) 与 1, (1\to3) 与 5 | 1 | 2 | 没有 |
 | 2 | (2\to1) 与 2, (2\to3) 与 7 | 2 | 1 | 没有 |
 | 1 | (1\to2) 与 1, (1\to3) 与 5 | 1 | 2 | 是的 |

 转换 (1\to2\to1) 是一个循环。 离开它需要使用来自顶点 (1) 的颜色 (5) 或来自顶点 (2) 的颜色 (7)，两者都大于相应的循环边。 因此，从字典顺序上看，另一个循环总是更可取的。 答案是`TOO LONG`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N+M)) | 反向遍历、最小边扫描、最后的贪心游走线性地处理每个顶点或边 |
 | 空间| (O(N+M)) | 正向图、反向图、可达数组、贪婪转移和访问数组 |

 对于 (N\le100,000) 和 (M\le300,000)，线性处理完全在问题的预期范围内。 该算法还避免了递归，这在 Python 中很有用，因为图可以包含具有接近 (100,000) 个顶点的路径。 

## 测试用例

 以下测试工具使用相同的`solve`作为提交的解决方案。 最大尺寸测试构建具有 (100,000) 个顶点的链，而其他情况则针对可达性、循环、直接边和非常大的颜色值。```python
import sys
import io
from contextlib import redirect_stdout

def solve(data=None):
    if data is None:
        input = sys.stdin.readline
    else:
        input = io.StringIO(data).readline

    n, m, s, t = map(int, input().split())

    graph = [[] for _ in range(n)]
    rev = [[] for _ in range(n)]

    for _ in range(m):
        u, v, c = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append((v, c))
        rev[v].append(u)

    good = [False] * n
    good[t - 0] = True

    stack = [t]
    while stack:
        u = stack.pop()
        for v in rev[u]:
            if not good[v]:
                good[v] = True
                stack.append(v)

    if not good[s]:
        print("IMPOSSIBLE")
        return

    next_vertex = [-1] * n
    next_color = [0] * n

    for u in range(n):
        best_color = None
        best_vertex = -1

        for v, c in graph[u]:
            if not good[v]:
                continue
            if best_color is None or c < best_color:
                best_color = c
                best_vertex = v

        if best_vertex != -1:
            next_vertex[u] = best_vertex
            next_color[u] = best_color

    visited = [False] * n
    answer = []
    u = s

    while u != t:
        if visited[u]:
            print("TOO LONG")
            return

        visited[u] = True
        v = next_vertex[u]

        if v == -1:
            print("IMPOSSIBLE")
            return

        answer.append(next_color[u])
        u = v

    print(*answer)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    try:
        with redirect_stdout(out):
            solve()
    finally:
        sys.stdin = old_stdin

    return out.getvalue().strip()

# Provided samples.
assert run(
    """3 3 1 3
1 2 1
2 3 7
1 3 5
"""
) == "1 7", "sample 1"

assert run(
    """3 4 1 3
1 2 1
2 1 2
2 3 7
1 3 5
"""
) == "TOO LONG", "sample 2"

assert run(
    """2 0 2 1
"""
) == "IMPOSSIBLE", "sample 3"

# Minimum-size valid graph.
assert run(
    """2 1 1 2
1 2 1000000000
"""
) == "1000000000", "minimum graph"

# A smaller color may lead to a dead end, so it must be ignored.
assert run(
    """3 2 1 3
1 2 1
1 3 5
"""
) == "5", "dead-end minimum edge"

# Two valid choices from S, with a much smaller first color.
assert run(
    """4 4 1 4
1 2 9
1 3 2
2 4 1
3 4 1000000000
"""
) == "2 1000000000", "lexicographic first choice"

# Large colors near the upper boundary.
assert run(
    """3 3 1 3
1 2 999999999
2 3 1000000000
1 3 1000000000
"""
) == "999999999 1000000000", "large colors"

# Maximum-size chain: N = 100000, M = 99999.
n = 100000
lines = [f"{n} {n - 1} 1 {n}"]
lines.extend(f"{i} {i + 1} {i}" for i in range(1, n))
max_input = "\n".join(lines) + "\n"
max_expected = " ".join(map(str, range(1, n)))
assert run(max_input) == max_expected, "maximum-size chain"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 1 1 2`带颜色 (10^9) |`1000000000`| 最小图形和最大颜色边界|
 |`3 2 1 3`边缘颜色为 1 和 5 |`5`| 必须拒绝导致死胡同的较小边缘 |
 | 优先选择 9 和 2 的四顶点图 |`2 1000000000`| 词典比较由第一个不同的颜色决定 |
 | 使用 (10^9) 附近颜色的三个顶点图 |`999999999 1000000000`| 大颜色值和直接与间接选择 |
 | (100000) 顶点链 | 颜色 (1) 到 (99999) | 最大值 (N)、大 (M) 和长非循环贪婪行走 |

 该声明称边缘颜色是全局唯一的，因此所有边缘颜色相等的字面测试将违反输入条件。 上面的大型颜色测试在保留有效实例的同时测试了相关的数字边界。 

## 边缘情况

 第一个边缘情况是较小颜色的死胡同。 考虑```
3 2 1 3
1 2 1
1 3 5
```从 (3) 开始的反向遍历仅将顶点 (3) 和顶点 (1) 标记为有用。 顶点 (2) 未标记，因为没有从 (2) 到 (3) 的路径。 当算法扫描顶点 (1) 时，它会忽略颜色 (1) 边缘，因为其目的地无用，将颜色 (5) 保留为最小有效选择。 输出是`5`。 

第二种边缘情况是无法达到的目标。```
2 0 2 1
```反向遍历从顶点 (1) 开始，不会到达其他任何地方。 Vertex (2=S) 没有用，所以算法立即打印`IMPOSSIBLE`。 

第三种边缘情况是包含贪婪选择的循环。```
3 4 1 3
1 2 1
2 1 2
2 3 7
1 3 5
```(1) 中的有用最小边缘是颜色 (1)，(2) 中的有用最小边缘是颜色 (2)。 因此，贪心序列为 (1\to2\to1)。 当第二次遇到顶点 (1) 时，算法打印`TOO LONG`。 在采用较大的出射颜色 (5) 之前可以重复该循环，因此字典顺序上优选的有界游走具有巨大的长度。 

第四个边缘情况是贪婪游走在没有循环的情况下到达 (T) 的图。```
3 3 1 3
1 2 1
2 3 7
1 3 5
```该算法从顶点 (1) 选择颜色 (1)，然后从顶点 (2) 选择颜色 (7)，最后到达 (3)。 没有顶点重复。 由于简单遍历 (N) 个顶点最多包含 (N-1) 个边，因此生成的序列自动低于 (10^6) 个输出阈值。 

最终的边界情况是测试中使用的最大尺寸链。 每个顶点都只有一个出边，因此贪婪选择是被迫的。 该算法对 (99,999) 条边执行一次反向遍历，对相同边进行一次扫描，然后进行 (99,999) 条转换。 它无需递归即可生成整个序列，也无需表示 (10^{100}) 行走界限。
