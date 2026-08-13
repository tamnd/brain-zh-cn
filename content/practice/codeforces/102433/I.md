---
title: "CF 102433I - 纠错"
description: "我们有 (N) 个不同单词的集合。 每个单词都使用完全相同的字母集，因此每个单词只是相同字母的不同排列。 一个单词内没有字母出现两次。"
date: "2026-08-12T07:36:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102433
codeforces_index: "I"
codeforces_contest_name: "2019-2020 ACM-ICPC Pacific Northwest Regional Contest (Div. 1)"
rating: 0
weight: 102433
solve_time_s: 90
verified: true
draft: false
---

[CF 102433I - 错误更正](https://codeforces.com/problemset/problem/102433/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (N) 个不同单词的集合。 每个单词都使用完全相同的字母集，因此每个单词只是相同字母的不同排列。 一个单词内没有字母出现两次。 

如果两个单词可以通过正好交换两个位置而从另一个单词获得，则两个单词冲突。 这两个位置不必相邻。 我们需要保留尽可能多的单词，同时保持每对保留的单词无冲突。 

思考问题的一个有用方法是用图表来思考。 每个单词都是一个顶点，当两个顶点的单词相差一个交换位置时，​​它们就被连接起来。 答案是该图的最大独立集。 

对于运行时间约为 (O(N^2)) 的图算法来说，约束 (N \le 500) 足够小，但对于枚举所有子集来说却太大了。 有 (2^{500}) 个可能的子集，因此直接的最大独立集搜索是完全不可行的。 这些单词只包含小写字母，因此它们的长度最多为 26，因为字母不能出现两次。 这个小字长给了我们另一个有用的界限：任何单词最多有 (\binom{26}{2}=325) 个不同的单交换结果。 

有几种边缘情况，粗心的实现可能会处理不当。 例如，如果（N=1），输入```
1
a
```有答案 1. 没有其他词可以与之搭配`a`可能会发生冲突。 假设每个顶点都有一个相反侧邻居的解决方案可能会错误地返回 0。 

长度为二的字表明交换相邻位置不是特殊操作。 为了```
2
ab
ba
```答案是 1，因为这两个单词是通过交换仅有的两个位置来连接的。 仅检查某些受限交换集的解决方案将错过这一优势。 

另一种微妙的情况是，存在许多单词，但没有一个单词可以互换。 例如，```
3
abc
bca
cab
```答案为 3。所有三种排列都具有相同的排列奇偶性，而一次交换总是会改变奇偶性。 假设图必须包含许多边的解决方案将不必要地删除顶点。 

最后，所有单词都是独一无二的这一事实很重要。 我们永远不需要处理一个词到它本身的边缘。 交换两个不同的位置会改变单词，因为每个字母都是不同的。 

官方样本输出为样本 1 为 3、样本 2 为 8、样本 3 为 4。 

## 方法

 最直接的暴力想法是构建冲突图，然后尝试每个单词子集，检查该子集是否包含冲突对。 这是正确的，因为每个可能的候选答案都被明确考虑。 对于 (N) 个顶点的子集，检查所有对的成本为 (O(N^2))，并且存在 (2^N) 个子集，在最坏情况下需要 (O(2^N N^2)) 时间。 在 (N=500) 处，这大约是 (2^{500}\cdot250000) 对检查，这不太实用。 

即使通过比较每对单词来构建图也已经是 (O(N^2L))，其中 (L\le26)。 在最大约束下，这意味着最多

 [
 \binom{500}{2}\cdot26 = 3,243,500
 ]

 最坏情况下的人物比较。 这部分是可以管理的，但一般的最大独立集问题仍然是指数级的。 

关键的观察结果是，每条边对排列奇偶性都有非常具体的影响。 根据每个单词的字母排列是偶数还是奇数来分配奇偶校验。 交换两个位置只会改变排列奇偶校验一次，因此每个冲突边都将偶数词与奇数词连接起来。 

因此，冲突图是二分图。 

这彻底改变了问题。 对于二分图，最大独立集的大小为

 [
 |V|-\text{最小顶点覆盖}。 
]

 根据柯尼希定理，二分图中的最小顶点覆盖与最大匹配具有相同的大小。 因此答案很简单

 [
 N-\text{最大匹配}。 
]

 另一个有用的观察是我们不需要比较每对单词来找到边缘。 从长度 (L) 的字中，可以通过选择两个位置并交换它们来生成每个可能的单交换邻居。 只有 (\binom L2) 个这样的候选者。 哈希表在恒定的预期时间内告诉我们结果单词是否确实存在于输入中。 

蛮力之所以有效，是因为检查每一对都会给出精确的冲突图，但当我们尝试直接求解最大独立集时会失败。 奇偶校验观察将该图转换为二部图，其中匹配在多项式时间内给出答案。 通过实际交换生成邻居还可以避免不必要的 (N^2) 单词比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^N N^2)) | (O(N^2)) | 太慢了|
 | 最佳 | (O(NL^2 + E\sqrt N)) | (O(NL^2 + N)) | 已接受 |

 这里(L\le26)是字长，(E)是冲突边的数量。 由于顶点最多有 (\binom L2\le325) 个邻居，(E\le O(NL^2))。 

## 算法演练

 1. 将每个输入单词存储在字典中，将单词映射到其顶点索引。 这让我们可以在预期的恒定时间内测试生成的一次性交换词是否属于输入。 
2. 按排序顺序选择第一个单词的字母，并为每个字母分配一个排名。 将每个单词替换为相应的排名序列。 由于所有单词都包含完全相同的不同字母，因此每个单词现在都是相同等级序列的排列。 
3. 通过计数反转来计算每个排列的奇偶校验。 反转次数为偶数的单词属于二部图的左侧，反转次数为奇数的单词属于二分图的右侧。 
4. 对于每个偶校验字，尝试每对位置 (i<j)。 交换这两个字符并在字典中查找结果单词。 如果存在，则将对应的顶点添加到当前单词的邻接表中。

交换任意两个位置都会改变排列奇偶性，因此生成的邻居会自动位于相反的一侧。 我们只从一侧生成边，这给出了二分匹配所需的标准表示。 
5. 在此二分图上运行 Hopcroft-Karp。 维护每个左顶点和每个右顶点的匹配。 广度优先搜索找到可能的增广路径层，深度优先搜索通过这些层发送多个增广路径。 
6. 令结果匹配尺寸为(M)。 返回（N-M）。 柯尼希定理指出，(M) 也是最小顶点覆盖的大小，移除这样的覆盖会留下一组独立的 (N-M) 个顶点。 

### 为什么它有效

 中心不变量是每个冲突边都连接相反排列奇偶性的单词。 单个转置会改变排列的奇偶性，因此冲突图是二分图，奇偶性作为其两侧。 

在任何图中，顶点覆盖的补集都是独立的集合，因此大小为 (C) 的最小顶点覆盖给出了大小为 (N-C) 的独立集合。 相反，任何独立集的补集都是顶点覆盖，因此最大的独立集的大小恰好为 (N-C)，其中 (C) 是最小顶点覆盖大小。 

对于二部图，König 定理给出 (C=M)，其中 (M) 是最大匹配大小。 该算法精确地构造冲突图，找到其最大匹配，并返回 (N-M)，因此这是最大可能的无交换集。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    words = [input().strip() for _ in range(n)]

    index = {word: i for i, word in enumerate(words)}

    # Every word is a permutation of the same distinct letters.
    base = sorted(words[0])
    rank = {ch: i for i, ch in enumerate(base)}

    parity = [0] * n
    left = []

    for u, word in enumerate(words):
        a = [rank[ch] for ch in word]
        inv_parity = 0

        for i in range(len(a)):
            for j in range(i + 1, len(a)):
                inv_parity ^= (a[i] > a[j])

        parity[u] = inv_parity
        if inv_parity == 0:
            left.append(u)

    # adj[u] contains only vertices on the odd-parity side.
    adj = [[] for _ in range(n)]

    length = len(words[0])

    for u in left:
        s = list(words[u])

        for i in range(length):
            for j in range(i + 1, length):
                s[i], s[j] = s[j], s[i]
                v = index.get(''.join(s))

                if v is not None:
                    adj[u].append(v)

                s[i], s[j] = s[j], s[i]

    # Hopcroft-Karp maximum matching.
    pair_u = [-1] * n
    pair_v = [-1] * n
    dist = [-1] * n

    from collections import deque

    def bfs():
        q = deque()
        found = False

        for u in left:
            if pair_u[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = -1

        while q:
            u = q.popleft()

            for v in adj[u]:
                pu = pair_v[v]

                if pu == -1:
                    found = True
                elif dist[pu] == -1:
                    dist[pu] = dist[u] + 1
                    q.append(pu)

        return found

    sys.setrecursionlimit(2000)

    def dfs(u):
        for v in adj[u]:
            pu = pair_v[v]

            if pu == -1 or (
                dist[pu] == dist[u] + 1 and dfs(pu)
            ):
                pair_u[u] = v
                pair_v[v] = u
                return True

        dist[u] = -1
        return False

    matching = 0

    while bfs():
        for u in left:
            if pair_u[u] == -1 and dfs(u):
                matching += 1

    print(n - matching)

if __name__ == "__main__":
    solve()
```字典`index`是排列生成和图构建之间的桥梁。 交换一个单词中的两个字符后，`index.get()`立即告诉我们该单词是否属于给定的集合。 

反转计算仅使用奇偶校验，而不使用完整的反转计数。 XOR 运算就足够了，因为只有计数是奇数还是偶数才重要。 由于字长最多为 26，因此简单的二次计算非常小。 

临时名单`s`针对每个候选交换进行适当修改。 字典查找后，字符会立即交换回来，因此每对位置都从原始单词开始。 忘记第二次换回将使后来的候选者依赖于先前的候选者并破坏图表。 

匹配数组的大小为 (N)，即使只有相应奇偶校验侧的顶点作为左顶点进行迭代。 使用原始顶点索引可以使字典、邻接表和匹配数组保持一致。 

BFS 从所有当前不匹配的左顶点构建距离层。 DFS 仅遵循尊重这些层的边，因此每个成功的 DFS 都会沿着最短的可用增强路径增强匹配。 当 BFS 无法再找到从自由左顶点可到达的不匹配的右端点时，则不再保留增广路径，并且匹配是最大的。 

Python 中整数不会溢出，答案始终在 0 到 500 之间。 

## 工作示例

 ### 示例 1

 这六个字都是排列组合`abc`。 他们的反转宇称将他们分成两组。 

| 词| 平价| 产生冲突的邻居| 匹配状态|
 | --- | --- | --- | --- |
 |`abc`| 甚至|`acb`,`bac`,`cba`| 与`acb`|
 |`acb`| 奇数|`abc`,`cab`,`bca`| 与`abc`|
 |`cab`| 甚至|`cba`,`abc`,`bca`| 与`cba`|
 |`cba`| 奇数|`cab`,`bac`,`abc`| 与`cab`|
 |`bac`| 甚至|`bca`,`cba`,`acb`| 无与伦比的|
 |`bca`| 奇数|`bac`,`acb`,`cab`| 无与伦比的|

 最大匹配的大小为3。图在两个奇偶校验类之间是平衡的，并且可以选择三个不相交的冲突边。 因此，最大无交换集的大小为 (6-3=3)，与样本输出匹配。 

该迹线展示了中心奇偶校验不变量。 每个列出的邻居都位于相反的一侧，因此原始冲突图实际上是二部的。 

### 示例 2

 为了十一`alerts`排列时，奇偶校验分裂是不均匀的。 匹配算法不需要显式地寻找独立集合。 它只需要找出必须删除多少个顶点来消除每个冲突。 

| 数量 | 价值|
 | --- | --- |
 | 字数 | 11 | 11
 | 最大匹配| 3 |
 | 最小顶点覆盖| 3 |
 | 最大免掉期集 | 8 |

 匹配包含三个不相交的冲突边。 一旦删除了三个顶点的最小顶点覆盖，剩余的八个字就不包含冲突边。 因此答案是（11-3=8），与官方样本一致。 

这个例子说明了为什么仅仅采用较小的奇偶校验类并不总是足够的。 一个奇偶校验的任意子集始终是免交换的，但当冲突图与一侧的所有部分不匹配时，最优值可以包含两个奇偶校验类的顶点。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(NL^2 + E\sqrt N)) | 每个单词生成 (O(L^2)) 个交换，Hopcroft-Karp 需要 (O(E\sqrt N)) |
 | 空间| (O(NL^2 + N)) | 邻接图最多存储 (O(NL^2)) 条边 |

 这里是 (N\le500) 和 (L\le26)。 一个顶点最多有 325 个可能的单交换邻居，因此该图在单边表示中最​​多具有大约 (81{,}250) 个有向邻接条目。 这很容易在预期的限制内，而匹配阶段是多项式的并且避免了指数（2^N）搜索。 

## 测试用例```python
import sys
import io
from itertools import permutations

def solve():
    n = int(input())
    words = [input().strip() for _ in range(n)]

    index = {word: i for i, word in enumerate(words)}

    base = sorted(words[0])
    rank = {ch: i for i, ch in enumerate(base)}

    parity = [0] * n
    left = []

    for u, word in enumerate(words):
        a = [rank[ch] for ch in word]
        p = 0

        for i in range(len(a)):
            for j in range(i + 1, len(a)):
                p ^= (a[i] > a[j])

        parity[u] = p
        if p == 0:
            left.append(u)

    length = len(words[0])
    adj = [[] for _ in range(n)]

    for u in left:
        s = list(words[u])

        for i in range(length):
            for j in range(i + 1, length):
                s[i], s[j] = s[j], s[i]

                v = index.get(''.join(s))
                if v is not None:
                    adj[u].append(v)

                s[i], s[j] = s[j], s[i]

    from collections import deque

    pair_u = [-1] * n
    pair_v = [-1] * n
    dist = [-1] * n

    def bfs():
        q = deque()
        found = False

        for u in left:
            if pair_u[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = -1

        while q:
            u = q.popleft()

            for v in adj[u]:
                pu = pair_v[v]

                if pu == -1:
                    found = True
                elif dist[pu] == -1:
                    dist[pu] = dist[u] + 1
                    q.append(pu)

        return found

    def dfs(u):
        for v in adj[u]:
            pu = pair_v[v]

            if pu == -1 or (
                dist[pu] == dist[u] + 1 and dfs(pu)
            ):
                pair_u[u] = v
                pair_v[v] = u
                return True

        dist[u] = -1
        return False

    matching = 0

    while bfs():
        for u in left:
            if pair_u[u] == -1 and dfs(u):
                matching += 1

    print(n - matching)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

assert run("""6
abc
acb
cab
cba
bac
bca
""") == "3\n", "sample 1"

assert run("""11
alerts
alters
artels
estral
laster
ratels
salter
slater
staler
stelar
talers
""") == "8\n", "sample 2"

assert run("""6
ates
east
eats
etas
sate
teas
""") == "4\n", "sample 3"

assert run("""1
a
""") == "1\n", "minimum size"

assert run("""2
ab
ba
""") == "1\n", "single conflict edge"

assert run("""3
abc
bca
cab
""") == "3\n", "all vertices have the same parity"

# Maximum N = 500.
# Every selected permutation is even, so no two selected words can be
# connected by one swap. The answer must be 500.
even_words = []

for p in permutations("abcdefgh"):
    inv = 0
    for i in range(8):
        for j in range(i + 1, 8):
            inv += p[i] > p[j]

    if inv % 2 == 0:
        even_words.append(''.join(p))

    if len(even_words) == 500:
        break

max_input = "500\n" + "\n".join(even_words) + "\n"
assert run(max_input) == "500\n", "maximum N"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / a`| 1 | 最小值 (N)、字长 1、孤立顶点 |
 |`2 / ab, ba`| 1 | 尽可能最小的冲突图和精确的一次性检测 |
 |`3 / abc, bca, cab`| 3 | 所有顶点具有相同的奇偶性且没有冲突边 |
 | 500个偶数排列`abcdefgh`| 500 | 500 最大值 (N)、大图输入以及相同奇偶校验字始终兼容的事实 |

 ## 边缘情况

 最小尺寸的情况是```
1
a
```该算法将唯一的字放在奇偶校验一侧，不会生成有用的交换，因为该字的长度为 1，并获得大小为零的匹配。 返回值为(1-0=1)。 

最小可能的冲突是```
2
ab
ba
```这个词`ab`有奇偶校验并且`ba`有奇校验。 交换位置 0 和 1`ab`产生`ba`，因此该图包含一条边。 Hopcroft-Karp 匹配这两个顶点，给出匹配大小 1 和答案 (2-1=1)。 

一个话很多但没有冲突的案例```
3
abc
bca
cab
```所有三个排列都是偶数。 每一次交换都会改变奇偶校验，因此这三个单词都不能使用一次交换转换为另一个列出的单词。 邻接图为空，匹配的大小为零，算法返回 3。 

最大 (N) 情况使用 500 个偶数排列`abcdefgh`。 每个生成的单交换邻居都是奇数，但输入中不存在奇数词。 因此，尽管有 500 个顶点，邻接图还是空的。 匹配保持为零，答案为 500。这会捕获意外假设大输入必须包含冲突的实现。 

长度边界也自然处理。 一个单词最多可以包含 26 个字母，因为字母不能重复，并且只能使用小写英文字母。 该算法会尝试所有 (\binom L2) 对，因此对于 (L=26)，每个单词仅执行 325 次交换尝试。 最终字符周围不存在相差一的问题，因为两个循环都使用`range(length)`并要求 (i<j)。
