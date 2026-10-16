---
title: "CF 106260C - 背包"
description: "我们得到了洞穴和隧道的有向图。 我们从背包 0 块岩石的洞穴 1 开始，想要到达洞穴 n。 当我们进入隧道时，它会添加一块岩石，当我们离开隧道时，会移除b块岩石。"
date: "2026-06-25T07:24:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106260
codeforces_index: "C"
codeforces_contest_name: "2025 SiChuan University for new student"
rating: 0
weight: 106260
solve_time_s: 76
verified: true
draft: false
---

[CF 106260C - 背包](https://codeforces.com/problemset/problem/106260/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了洞穴和隧道的有向图。 我们从洞穴开始`1`背包里的石头为零，想要到达洞穴`n`。 

一条隧道增加了`a`当我们进入它时会晃动，然后移除`b`当我们离开它时，它会很摇滚。 如果我们有少于`b`岩石可用，隧道移除了所有东西。 如果当前的岩石数量是`r`，那么穿过隧道后新的数量是```
max(0, r + a - b)
```定义起来很方便```
w = a - b
```所以每个隧道都适用```
r -> max(0, r + w)
```任务是找到当我们第一次到达洞穴时可以出现的最小岩石数量`n`。 如果洞穴`n`无法到达，答案是`-1`。 

该图最多有 300 个顶点，但可以非常密集，最多可达`n(n-1)`有向边。 隧道参数满足`0 ≤ a, b ≤ 10`，因此在应用归零操作之前，每条边都会将岩石计数最多更改 10。 

小边权重是关键的观察结果。 一条简单路径最多包含`n - 1`边，因此沿着任何简单路径，总减少量最多为```
10 * (n - 1) ≤ 2990
```这立即表明只需要明确表示岩石数量的有限范围。 

当循环存在时，会出现微妙的边缘情况。 

例子：```
1 -> 2 : +10
2 -> 3 : -9
3 -> 2 : 0
```最短路径式解决方案会失败，因为重新访问顶点会改变岩石数量并可能改善最终答案。 

另一个重要的情况是，一条路径需要暂时积累许多岩石，然后再减少它们。 

例子：```
1 -> 2 : +10
2 -> 2 : +10
2 -> n : -10
```最佳步行可能会在离开前使用正循环几次。 任何只考虑简单路径的解决方案都会错过这样的步行。 

最后，该图可能包含可达到的正循环，允许任意大的岩石计数。 我们无法显式存储每个可能的值，因此必须仔细压缩状态空间。 

## 方法

 暴力搜索将状态视为`(vertex, rocks)`并探索所有可达状态。 

这是正确的，因为转换是确定性的：```
r -> max(0, r + w)
```问题在于岩石数量理论上是无限的。 一个可达到的正循环可以永远增加岩石的数量，产生无限多种状态。 

关键的观察结果是边权重以 10 为界，并且该图仅包含 300 个顶点。 

让```
B = 10 * (n - 1)
```对于这个问题，```
B ≤ 2990
```假设我们目前有超过`B`岩石。 没有任何简单的路径可以将计数减少超过`B`，因为每条边至少贡献`-10`。 

这意味着一旦计数变得足够大，确切的值就不再重要。 每个高于固定阈值的值都表现相似。 我们可以显式地存储所有计数到一个限制，并将所有更大的计数合并到一个特殊状态中。 

一个方便的选择是```
LIMIT = B + 10 = 3000
```如果我们有超过 3000 个岩石，那么在穿过任何边缘后，我们仍然有超过 2990 个岩石。 当我们留在这个地区时，零下限操作永远不会变得有意义。 

这将无限状态空间转换为有限状态空间：```
(vertex, 0..3000)
```每个顶点加上一个额外的“大”状态。 

剩下的挑战是效率。 我们不是单独存储可达计数，而是将它们存储为位集。 长度为 3001 的位集很适合 Python 整数，并且每个边缘变换都变成了一些位操作。 

所得算法是有限图上的单调可达性传播，并收敛到完整的可达状态集。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解精确的岩石数量 | 无界| 无界| 太慢了|
 | 具有压缩大状态的位集可达性 | 实践中的 O(m·LIMIT / word_size) | O(n·极限) | 已接受 |

 ## 算法演练

 1. 对于每个隧道计算```
w = a - b
```因为转换仅取决于该值。 
2.让```
LIMIT = 3000
```计数`0..3000`都有明确表示。 
3.对于每个顶点维护：```
bits[v]
```哪里位`k`如果岩石计数则设置`k`在顶点处可达`v`。 

还维护```
big[v]
```这意味着在顶点处可以达到一些大于 3000 的计数`v`。 
4. 初始化```
bits[1] = {0}
```因为我们从 1 号洞穴开始，岩石为零。 
5. 沿传出边缘重复传播信息。 

对于非负权重`w`：```
k -> k + w
```超过 3000 的计数会生成`big`状态。 
6. 对于负权重`-d`：```
k -> max(0, k - d)
```这是通过位集右移来实现的，如果有任何计数低于，则加上设置位 0`d`是可以到达的。 
7. 如果`big[u]`是真的并且有一个优势`u -> v`， 然后`big[v]`也成为事实。 

任何高于 3000 的计数在一次转换后仍保持在 2990 以上，因此确切的值无关紧要。 
8. 使用队列。 每当一个顶点接收到新的可达状态时，将其推入队列，以便再次处理其传出边缘。 
9. 到达固定点后，检查顶点的bitset`n`。 

最小的设定钻头是最小可到达的岩石数量。 
10. 如果在顶点处既不能到达位集也不能到达大状态`n`， 输出`-1`。 

### 为什么它有效

 该算法计算可达性关系的最小不动点。 

每个可达状态都会生成，因为我们从初始状态开始并重复应用所有有效转换。 没有省略任何可达状态。 

压缩是安全的，因为大于 3000 的值永远无法在单个步骤中直接返回到显式范围。 一个边沿的最大减少量为 10，因此大于 3000 的计数在转换后始终保持大于 2990。 一旦我们进入该区域，确切的值就无关紧要了，并且单个`big`状态捕获了所有这些可能性。 

由于对有限状态空间进行了详尽的探索，并且对每个转变进行了精确建模，因此洞穴中可到达的岩石集`n`是正确的。 取最小的可达计数即可给出所需的答案。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

LIMIT = 3000
MASK = (1 << (LIMIT + 1)) - 1

def transform(bits, w):
    if bits == 0:
        return 0, False

    if w >= 0:
        shifted = bits << w

        low = shifted & MASK
        high = shifted >> (LIMIT + 1)

        return low, high != 0

    d = -w

    low_part = bits & ((1 << d) - 1) if d <= LIMIT else bits
    res = bits >> d

    if low_part:
        res |= 1

    return res, False

def solve():
    n, m = map(int, input().split())

    g = [[] for _ in range(n)]

    for _ in range(m):
        x, y, a, b = map(int, input().split())
        g[x - 1].append((y - 1, a - b))

    bits = [0] * n
    big = [False] * n

    bits[0] = 1  # rock count 0

    q = deque([0])
    inq = [False] * n
    inq[0] = True

    while q:
        u = q.popleft()
        inq[u] = False

        cur_bits = bits[u]
        cur_big = big[u]

        for v, w in g[u]:
            add_bits, make_big = transform(cur_bits, w)

            changed = False

            new_bits = bits[v] | add_bits
            if new_bits != bits[v]:
                bits[v] = new_bits
                changed = True

            if cur_big or make_big:
                if not big[v]:
                    big[v] = True
                    changed = True

            if changed and not inq[v]:
                inq[v] = True
                q.append(v)

    target = bits[n - 1]

    if target == 0 and not big[n - 1]:
        print(-1)
        return

    answer = (target & -target).bit_length() - 1
    print(answer)

solve()
```该解决方案将所有可达 3000 以内的计数存储在一个 Python 整数内。 少量`k`对应于岩石数量`k`。 

对于非负边权重，我们将位集左移。 任何超出位置 3000 的位都表示计数大于显式范围，因此目标顶点接收到`big`旗帜。 

对于负边权重，我们向右移动。 计数小于负权重崩溃至零的幅度，因为`max(0, ...)`手术。 这就是为什么每当这些小计数之一可达时就必须添加位 0。 

基于队列的传播是标准的单调数据流过程。 仅当顶点的可达状态集增长时，才会再次处理该顶点。 

表达式```
(target & -target).bit_length() - 1
```返回最低设置位的索引，这正是最小的可达岩石数。 

## 工作示例

 ### 示例 1

 输入：```
4 4
1 2 10 0
2 4 2 1
4 3 0 5
3 2 3 3
```有效边权重为：```
1 -> 2 : +10
2 -> 4 : +1
4 -> 3 : -5
3 -> 2 : 0
```| 步骤| 顶点| 岩石|
 | ---| ---| ---|
 | 开始| 1 | 0 |
 | 1 -> 2 | 1 -> 2 2 | 10 | 10
 | 2 -> 4 | 4 | 11 | 11
 | 4 -> 3 | 4 -> 3 | 3 | 6 |
 | 3 -> 2 | 3 -> 2 2 | 6 |
 | 2 -> 4 | 4 | 7 |
 | 4 -> 3 | 4 -> 3 | 3 | 2 |
 | 3 -> 2 | 3 -> 2 2 | 2 |
 | 2 -> 4 | 4 | 3 |
 | 4 -> 3 | 4 -> 3 | 3 | 0 |
 | 3 -> 2 | 3 -> 2 2 | 0 |
 | 2 -> 4 | 4 | 1 |

 洞穴 4 的最小可达值为 1。 

### 示例 2

 输入：```
3 2
1 2 5 0
2 3 0 10
```有效重量：```
1 -> 2 : +5
2 -> 3 : -10
```| 步骤| 顶点| 岩石|
 | ---| ---| ---|
 | 开始| 1 | 0 |
 | 1 -> 2 | 1 -> 2 2 | 5 |
 | 2 -> 3 | 2 -> 3 | 3 | 0 |

 第二条边移除了所有可用的岩石，因此答案为 0。 

这个例子说明了为什么转换不是普通的加法。 绝对不允许使用负值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 实践中的 O(m·LIMIT / word_size) | Bitset 操作同时处理许多岩石计数 |
 | 空间| O(n·极限) | 每个顶点一个长度为 3001 的位集 |

 和`n ≤ 300`和`LIMIT = 3000`，总状态表示低于一百万位。 基于位集的传播很容易满足内存限制，并且对于该问题中的图大小来说足够快。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    LIMIT = 3000
    MASK = (1 << (LIMIT + 1)) - 1

    def transform(bits, w):
        if bits == 0:
            return 0, False

        if w >= 0:
            shifted = bits << w
            return shifted & MASK, (shifted >> (LIMIT + 1)) != 0

        d = -w
        low_part = bits & ((1 << d) - 1)
        res = bits >> d
        if low_part:
            res |= 1
        return res, False

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n, m = map(int, input().split())

    g = [[] for _ in range(n)]

    for _ in range(m):
        x, y, a, b = map(int, input().split())
        g[x - 1].append((y - 1, a - b))

    from collections import deque

    bits = [0] * n
    big = [False] * n

    bits[0] = 1

    q = deque([0])
    inq = [False] * n
    inq[0] = True

    while q:
        u = q.popleft()
        inq[u] = False

        for v, w in g[u]:
            add_bits, make_big = transform(bits[u], w)

            changed = False

            nb = bits[v] | add_bits
            if nb != bits[v]:
                bits[v] = nb
                changed = True

            if big[u] or make_big:
                if not big[v]:
                    big[v] = True
                    changed = True

            if changed and not inq[v]:
                inq[v] = True
                q.append(v)

    target = bits[n - 1]

    if target == 0 and not big[n - 1]:
        return "-1\n"

    ans = (target & -target).bit_length() - 1
    return str(ans) + "\n"

# sample
assert run(
"""4 4
1 2 10 0
2 4 2 1
4 3 0 5
3 2 3 3
"""
) == "1\n"

# minimum graph
assert run(
"""1 1
1 1 0 0
"""
) == "0\n"

# unreachable target
assert run(
"""3 1
1 2 1 0
"""
) == "-1\n"

# saturation at zero
assert run(
"""3 2
1 2 5 0
2 3 0 10
"""
) == "0\n"

# positive cycle
assert run(
"""3 3
1 2 10 0
2 2 10 0
2 3 0 10
"""
) == "0\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单顶点图 | 0 | 起点等于终点 |
 | 无法到达的目的地| -1 | 可达性处理 |
 | 大负沿 | 0 | 正确的零下限行为 |
 | 正循环| 0 | 无限状态压缩 |
 | 示例图| 1 | 完整的问题逻辑 |

 ## 边缘情况

 考虑：```
3 2
1 2 5 0
2 3 0 10
```从 5 块岩石到第二条边的过渡是```
max(0, 5 - 10) = 0
```该算法通过负权重变换来处理这个问题。 任何低于所需减少量的计数都会影响目标位集中的位 0。 

现在考虑一个无法到达的目的地：```
3 1
1 2 1 0
```没有任何状态被传播到顶点 3。它的位集保持为空并且它的`big`标志仍然为假，因此算法正确输出`-1`。 

最后，考虑一个可达到的正循环：```
3 3
1 2 10 0
2 2 10 0
2 3 0 10
```顶点2处的自循环可以无限制地增加岩石数量。 一旦计数超过明确的限制，算法就会切换到压缩的`big`表示。 可达性保持正确，无需存储无限多个值。
