---
title: "CF 1950G - 随机播放歌曲"
description: "每首歌都有两个属性：流派和作者。 删除一些歌曲后，我们可以任意重新排序剩余的歌曲。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dfs-and-similar", "dp", "graphs", "hashing", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1950
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 937 (Div. 4)"
rating: 1900
weight: 1950
solve_time_s: 82
verified: true
draft: false
---

[CF 1950G - 随机播放歌曲](https://codeforces.com/problemset/problem/1950/G)

 **评级：** 1900
 **标签：** 位掩码、dfs 和类似的、dp、图形、散列、实现、字符串
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每首歌都有两个属性：流派和作者。 删除一些歌曲后，我们可以任意重新排序剩余的歌曲。 目标是对它们进行排列，使每对相邻的歌曲至少共享一个属性：相同的流派、相同的作者，或两者兼而有之。 

我们希望删除尽可能少的歌曲。 同样，我们希望保留尽可能多的歌曲，并查找这些歌曲是否可以排列成有效的序列。 

查看问题的一种有用方法是使用图表。 为每首歌曲创建一个顶点。 如果两首歌曲具有相同的流派或相同的作者，则将它们连接起来。 那么，令人兴奋的播放列表就是歌曲的排序，其中每对连续的歌曲都通过一条边连接起来。 

这意味着我们正在寻找可以排列为访问每个选定顶点一次的路径的最大顶点子集。 用图术语来说，我们需要图中包含的最大哈密顿路径的大小。 答案是：$$n - (\text{maximum number of songs that can appear in such a path})$$这些约束揭示了预期的方法。 歌曲数量最多只有16首，数量极少。 指数解为$n$是可能的。 该声明甚至给出了强烈的暗示：$2^n$所有测试用例不超过$2^{16}$。 这是子集动态规划的经典设置。 

长字符串长度在算法上并不重要。 我们只比较流派和作家的平等性。 一旦读取了字符串，就可以独立检查每对歌曲。 

一些边缘情况很容易被错误处理。 

考虑一首歌曲：```
1
pop taylor
```正确答案是 0。由一个顶点组成的路径已经有效。 需要路径中至少有一条边的实现将错误地返回 1。 

考虑三首完全不相关的歌曲：```
3
a x
b y
c z
```两首歌曲不能相邻。 最大的有效播放列表恰好包含一首歌曲，因此答案是 2。粗心的实现可能会假设每个连接的组件都贡献其所有顶点。 

考虑一个图，其中最佳解决方案不使用连接组件中的所有顶点：```
4
a x
a y
b y
c z
```歌曲 1、2 和 3 形成一条链，而歌曲 4 是孤立的。 最佳播放列表保留歌曲 1、2 和 3。答案是 1。仅靠连接性是不够的；必须保持连接性。 我们需要所选子集上的实际哈密顿路径。 

## 方法

 最直接的暴力想法是尝试歌曲的每个子集以及该子集中的每个顺序。 对于大小的子集$k$， 有$k!$可能的订单。 在最坏的情况下，这会变成$$\sum_{k=0}^{n} \binom{n}{k} k!$$这对于$n=16$。 即使检查 16 首歌曲的所有排列也需要大约$2 \times 10^{13}$命令，完全不可行。 

暴力破解在概念上起作用的原因是我们关心的属性仅取决于顺序中的连续歌曲。 挑战在于避免枚举所有可能的顺序。 

关键的观察结果是该图只有 16 个顶点。 每当问题询问是否可以将顶点子集排列成路径时，哈密顿路径样式位掩码 DP 就变得很自然。 

让`dp[mask][last]`意思是：

 “精确地使用中的顶点`mask`，是否存在最终顶点为的有效路径`last`？”

 如果存在这样的路径，我们可以附加另一个顶点`nxt`每当两者之间存在边缘时`last`和`nxt`。 

这将排列枚举转换为子集上的动态规划。 每个状态同时代表许多可能的排序。 

某些状态可达的最大子集大小给出了我们可以保留的最大歌曲数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n! \cdot n)$|$O(n)$| 太慢了 |
 | 最佳位掩码 DP |$O(2^n \cdot n^2)$|$O(2^n \cdot n)$| 已接受 |

 ## 算法演练

 1. 朗读所有歌曲。 
2. 在歌曲上构建无向图。 

连接歌曲`i`和`j`如果他们有共同的流派或共同的作家。 
3、创建DP表`dp[mask][last]`。`dp[mask][last] = True`意味着存在一条有效路径，该路径恰好使用了中的顶点`mask`并结束于`last`。 
4. 初始化所有单例子集。 

对于每首歌`i`:`dp[1<<i][i] = True`一首歌永远是一条有效的路径。 
5. 迭代所有掩码。 

对于每个可达状态`(mask, last)`，尝试延长路径。 
6. 对于每个顶点`nxt`尚未进入`mask`，检查之间是否有边`last`和`nxt`。 

如果有，请标记：`dp[mask | (1<<nxt)][nxt] = True`这对应于附加`nxt`到现有路径的末端。 
7. 每当状态可达时，使用设置的位数更新最大路径长度`mask`。 
8. 处理完所有状态后，让`best`是最大可达子集大小。 
9. 输出`n - best`。 

### 为什么它有效

 DP 状态准确存储扩展路径所需的信息：哪些顶点已被使用以及哪个顶点当前位于末尾。 

初始化涵盖长度为一的所有路径。 

每个转换都会附加一个连接到当前端点的新顶点，因此每个生成的路径都是有效的。 

相反，任何有效路径都可以通过重复删除其最后一个顶点来重建。 从第一个顶点开始，DP 将通过这些扩展重现每条有效路径。 

因为每个有效路径对应于某个可达的 DP 状态，并且每个可达的 DP 状态对应于有效路径，所以 DP 精确地枚举了所有可能的有效播放列表。 最大可达子集大小正是可以保留的最大歌曲数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n = int(input())

        genre = []
        writer = []

        for _ in range(n):
            g, w = input().split()
            genre.append(g)
            writer.append(w)

        adj = [[False] * n for _ in range(n)]

        for i in range(n):
            for j in range(i + 1, n):
                if genre[i] == genre[j] or writer[i] == writer[j]:
                    adj[i][j] = adj[j][i] = True

        m = 1 << n
        dp = [[False] * n for _ in range(m)]

        best = 1

        for i in range(n):
            dp[1 << i][i] = True

        for mask in range(m):
            length = mask.bit_count()

            for last in range(n):
                if not dp[mask][last]:
                    continue

                if length > best:
                    best = length

                for nxt in range(n):
                    if mask & (1 << nxt):
                        continue

                    if adj[last][nxt]:
                        dp[mask | (1 << nxt)][nxt] = True

        print(n - best)

solve()
```图的构造直接遵循语句中的邻接规则。 当两首歌相邻出现时，它们就准确地连接在一起。 

DP表存储的是可达性而不是路径长度。 可达性就足够了，因为每个状态都已经唯一地确定通过位掩码使用了多少个顶点。 

单例初始化是必不可少的。 如果没有它，由一首歌曲组成的路径将永远不会存在，从而导致孤立顶点的错误答案。 

过渡总是附加一个新的未使用的顶点。 由于位掩码记录了所有使用的顶点，因此任何顶点都不能在同一路径中出现两次。 

变量`best`跟踪 DP 中任何地方遇到的最大可达子集。 我们不要求路径终止于特定顶点，因此会考虑每个可到达的端点。 

## 工作示例

 ### 示例 1

 输入：```
4
electronic themotans
electronic carlasdreams
pop themotans
pop irinarimes
```图边：

 | 配对 | 已连接？ |
 | --- | --- |
 | 1-2 | 1-2 相同类型|
 | 1-3 | 1-3 同一个作者 |
 | 2-4 | 2-4 没有 |
 | 3-4 | 3-4 相同类型|

 有效路径是：```
4 -> 3 -> 1 -> 2
```DP进化：

 | 面膜| 最后 | 可达 |
 | --- | --- | --- |
 | 0001| 1 | 是的 |
 | 0101| 3 | 是的 |
 | 0111| 2 | 是的 |
 | 1111 | 1111 4 | 是的 |

 最大可达子集的大小为 4，因此：

 | 数量 | 价值|
 | --- | --- |
 | n | 4 |
 | 最好的| 4 |
 | 答案| 0 |

 这个例子表明顺序可以完全重新排列。 我们不受原始播放列表顺序的限制。 

### 示例 2

 输入：```
4
a b
c d
e f
g h
```没有歌曲共享流派或作者。 

图：

 | 顶点| 邻居 |
 | --- | --- |
 | 1 | 无 |
 | 2 | 无 |
 | 3 | 无 |
 | 4 | 无 |

 可到达的状态：

 | 面膜| 尺寸|
 | --- | --- |
 | 0001| 1 |
 | 0010| 1 |
 | 0100 | 0100 1 |
 | 1000 | 1000 1 |

 无法触及更大的掩模。 

| 数量 | 价值|
 | --- | --- |
 | n | 4 |
 | 最好的| 1 |
 | 答案| 3 |

 这表明一首孤立的歌曲仍然构成长度为一的有效播放列表。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(2^n \cdot n^2)$| 每个状态都会尝试所有可能的下一个顶点 |
 | 空间|$O(2^n \cdot n)$| 掩码和端点的 DP 表 |

 和$n \le 16$，我们最多有$2^{16} = 65536$面具。 由此产生的操作数量完全在限制范围内。 内存使用量也很小，大约有一百万个布尔状态。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    out = []

    t = int(input())

    for _ in range(t):
        n = int(input())

        genre = []
        writer = []

        for _ in range(n):
            g, w = input().split()
            genre.append(g)
            writer.append(w)

        adj = [[False] * n for _ in range(n)]

        for i in range(n):
            for j in range(i + 1, n):
                if genre[i] == genre[j] or writer[i] == writer[j]:
                    adj[i][j] = adj[j][i] = True

        m = 1 << n
        dp = [[False] * n for _ in range(m)]

        best = 1

        for i in range(n):
            dp[1 << i][i] = True

        for mask in range(m):
            for last in range(n):
                if not dp[mask][last]:
                    continue

                best = max(best, mask.bit_count())

                for nxt in range(n):
                    if (mask & (1 << nxt)) == 0 and adj[last][nxt]:
                        dp[mask | (1 << nxt)][nxt] = True

        out.append(str(n - best))

    return "\n".join(out)

# provided samples
assert run(
"""4
1
pop taylorswift
4
electronic themotans
electronic carlasdreams
pop themotans
pop irinarimes
7
rap eminem
rap drdre
rap kanyewest
pop taylorswift
indierock arcticmonkeys
indierock arcticmonkeys
punkrock theoffspring
4
a b
c d
e f
g h
"""
) == """0
0
4
3"""

# minimum size
assert run(
"""1
1
a b
"""
) == "0"

# all songs connected by same genre
assert run(
"""1
4
rock a
rock b
rock c
rock d
"""
) == "0"

# completely isolated songs
assert run(
"""1
3
a x
b y
c z
"""
) == "2"

# chain of length 3 plus isolated vertex
assert run(
"""1
4
a x
a y
b y
c z
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单曲 | 0 | 基本情况，单例路径 |
 | 全部相同类型 | 0 | 完整的哈密顿路径存在 |
 | 全部隔离| 2 | 最大路径的大小可能为 1 |
 | 链加孤立顶点 | 1 | 最佳子集不需要包括所有顶点 |

 ## 边缘情况

 考虑一首歌曲：```
1
pop taylor
```DP初始化`dp[1][0] = True`。 不存在转换，但可达子集大小已经是 1。因此`best = 1`答案是`1 - 1 = 0`。 

考虑完全断开的歌曲：```
3
a x
b y
c z
```每个单独的掩码都是可达的。 因为没有图形边缘，所以无法达到更大的掩模。 最大可达子集大小仍为 1，给出答案`3 - 1 = 2`。 

考虑一个不完全可用的连接组件：```
4
a x
a y
b y
c z
```该图包含边`(1,2)`和`(2,3)`。 顶点 4 被隔离。 DP到达该路径对应的掩码`1 -> 2 -> 3`，达到尺寸 3。无法达到尺寸 4 的状态。 算法正确报告`4 - 3 = 1`。 

这正是仅检查连通性会失败而哈密顿路径 DP 保持正确的情况。
