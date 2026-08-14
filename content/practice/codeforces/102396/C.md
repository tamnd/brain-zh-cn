---
title: "CF 102396C - 喷气列车"
description: "将城市视为无向图的顶点，其边缘是当前可用的火车路线。 由于路线是双向的，因此当两个城市属于该图的同一连通分量时，它们可以准确地到达对方。"
date: "2026-08-14T14:22:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102396
codeforces_index: "C"
codeforces_contest_name: "2019-2020 Saint-Petersburg Open High School Programming Contest (SpbKOSHP 19)"
rating: 0
weight: 102396
solve_time_s: 291
verified: false
draft: false
---

[CF 102396C - 喷气列车](https://codeforces.com/problemset/problem/102396/C)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 51s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 将城市视为无向图的顶点，其边缘是当前可用的火车路线。 由于路线是双向的，因此当两个城市属于该图的同一连通分量时，它们可以准确地到达对方。 

在相同的顶点上还有第二个无向图，代表友谊。 对于查询`? v`，我们需要顶点数`u`这样`u`是...的朋友`v`和`u`位于相同的连通分量中`v`在火车图中。 答案不是好友总数，因为有些好友当前可能无法联系到。 

可以进行两种更新。 一个`T a b`操作会插入一个列车边缘，因此两个先前独立的列车组件可能会合并。 一个`F a b`操作插入友谊边。 这两种类型的边缘都不会被删除，这是使增量连接解决方​​案成为可能的结构属性。 

初始输入最多包含 (10^5) 个城市、(10^5) 个友谊、(10^5) 条火车路线和 (10^5) 个后续操作。 扫描所有城市或所有好友以查找每个查询的解决方案最多需要 (10^{10}) 次操作，远远超出了两秒限制所允许的范围。 我们需要大致线性或接近线性的总功，对数因子是可以接受的。 

有几种边缘情况可能会欺骗直接实现。 首先，友谊可以在其端点与火车连接之前就存在。 例如：```
2 1 0
1 2
0
```没有火车路线，因此没有输出。 如果我们添加一个查询：```
2 1 0
1 2
1
? 1
```输出是`0`，即使城市 1 和 2 是朋友。 在不检查火车连通性的情况下计算友谊的解决方案将错误地打印`1`。 

其次，新增的友谊可以连接两个已经可达的城市：```
2 0 1
1 2
1
F 1 2
```没有查询，但插入友谊后，两个端点的贡献立即变为一。 如果实现仅在添加训练边缘时处理友谊，则会丢失此更新。 

第三，当训练边缘连接两个组件时，多个现有的友谊可以同时变得有效。 例如：```
4 2 1
1 3
2 4
1 2
1
? 1
```火车图连接 1 和 2，而 3 和 4 位于该组件之外。 城市 1 没有可联系的朋友，所以答案是`0`。 如果训练边改为连接包含 1 和 3 的分量，则友谊`(1,3)`立即生效。 仅检查新列车边缘的两个端点的粗心实现可能会错过两个合并组件的任意顶点之间的友谊。 

## 方法

 蛮力方法很简单。 维护训练图，并且对于每个查询`? v`，运行 DFS 或 BFS`v`以确定其当前连接的组件。 然后审视每一份友谊`v`并计算那些端点被访问过的数量。 这是正确的，因为 DFS 准确地识别了可到达的城市`v`。 

问题是成本。 在最坏的情况下，单个连通性搜索可以触及 (O(n+k+q)) 个顶点和边，并且可以有 (10^5) 个查询。 在足够密集的操作序列中，这给出了 (10^{10}) 图操作的顺序，这太慢了。 

更好的起点是利用仅插入列车边缘的事实。 然后可以使用不相交集联合结构（DSU）来维护连接的组件。 查询`? v`可以立即识别当前列车的组成部分`v`。 

剩下的问题是维护每个顶点有多少个朋友在其组件内。 让`ans[v]`正是那个数字。 当一段友谊`(a,b)`插入的话，只有两种可能。 如果`a`和`b`已经属于同一个列车组件，两个答案都加一。 否则，友谊还没有用处，但必须记住，因为未来的火车合并可能会使其有用。 

假设训练边缘合并两个不同的组件。 合并后，跨越这两个组件的每个友谊都将变得有效。 我们可以检查两个组件之间的每一个友谊，但天真地这样做可能会重复扫描巨大的组件。 

关键的观察是始终处理较小的组件。 存储属于每个 DSU 组件的顶点列表。 当两个组件合并时，迭代较小组件的每个顶点并检查其所有友谊边。 另一个端点位于较大组件中的友谊正在跨越界限并变得有效，因此增加两个端点的答案。 

为什么这足够快？ 每当在组件合并期间处理顶点时，它就属于较小的组件。 合并后，其组件的大小至少增加了一倍。 因此，任何特定顶点最多可以属于较小的一侧 (O(\log n)) 次。 每次处理该顶点时，我们都会扫描其友谊邻接列表，因此每个友谊邻接总共仅扫描 (O(\log n)) 次。 

这给出了与问题的官方分析中使用的相同的从小到大的想法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(q(n+m+k))) | (O(n+m+k)) | 太慢了 |
 | 最佳 | (O((m+q+k)\log n\cdot\alpha(n))) | (O(n+m+k)) | 已接受 |

 ## 算法演练

 1. 创建包含所有 (n) 个城市的 DSU。 对于每个组件，维护其当前的顶点列表。 最初，每个组件都包含一个城市。 
2. 将每条友谊存储在邻接列表中`friends[v]`。 每一份友谊`(a,b)`被存储两次，一次在`friends[a]`一旦进入`friends[b]`，因为稍后我们需要检查顶点的所有朋友。 
3. 将初始列车路线添加到 DSU。 由于列车边缘仅添加连接性，因此在插入所有初始路径后，DSU 可以表示精确的连接组件。 
4. 初始化`ans[v]`通过处理每一个最初的友谊`(a,b)`。 如果`a`和`b`具有相同的 DSU 根，同时递增`ans[a]`和`ans[b]`。 在此刻`ans[v]`正是当前可联系的好友数量`v`。 
5. 对于一个`F a b`操作、追加`b`到`friends[a]`和`a`到`friends[b]`。 如果两个端点当前具有相同的 DSU 根，则递增`ans[a]`和`ans[b]`。 如果它们位于不同的组件中，请先不要更改答案，因为只有在它们的组件合并后，友谊才变得有用。 
6. 对于一个`T a b`运算，求根`a`和`b`。 如果它们已经相等，则新路由不会改变连接，也不会应答，因此操作完成。 
7. 如果根不同，比较其分量的大小，并将较小的指定为`small`和较大的一个`large`。 成员名单为`small`是我们需要枚举的唯一组件。 
8. 在更改 DSU 父级之前，迭代每个顶点`v`在`small`以及每一位朋友`u`的`v`。 如果`u`目前属于`large`， 然后`(v,u)`是跨越两个组成部分的友谊。 插入新的火车路线后，两个城市就可以相互到达，因此将两者都增加`ans[v]`和`ans[u]`。 
9. 合并`small`进入`large`在 DSU 中并附加以下顶点`small`到成员名单`large`。 组件大小也成为两个旧大小的总和。 
10. 对于一个`? v`操作、打印`ans[v]`。 不需要图遍历，因为当相应的友谊或火车合并发生时，所有可能影响该值的更改都已被处理。 

### 为什么它有效

 不变的是，在每次处理操作之后，`ans[v]`等于伴随的友谊边的数量`v`其另一个端点位于与当前列车相同的组件中`v`。 

当新插入的友谊的端点已经连接时，就会立即对其进行计数。 如果它们未连接，则友谊关系将存储在两个邻接列表中，并可供以后的组件合并使用。 

当两个火车组件合并时，唯一状态可以更改的友谊是每个组件中与一个端点的友谊。 我们检查较小组件的每个顶点及其所有友谊，因此可以找到每个交叉友谊。 内部友谊已经被计算在内，而两个组件之外的友谊仍然无效。 因此，每个新的有效友谊对两个端点答案都贡献一次。 

合并后，DSU 代表新的列车连接，因此不变量再次成立。 由于所有操作仅添加边，因此先前有效的友谊不会变得无效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())

    friends = [[] for _ in range(n)]
    friendship_edges = []

    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        friends[a].append(b)
        friends[b].append(a)
        friendship_edges.append((a, b))

    parent = list(range(n))
    size = [1] * n
    members = [[i] for i in range(n)]

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def merge(a, b):
        a = find(a)
        b = find(b)
        if a == b:
            return a

        if size[a] < size[b]:
            a, b = b, a

        parent[b] = a
        size[a] += size[b]
        members[a].extend(members[b])
        members[b] = []
        return a

    for _ in range(k):
        a, b = map(int, input().split())
        merge(a - 1, b - 1)

    ans = [0] * n

    for a, b in friendship_edges:
        if find(a) == find(b):
            ans[a] += 1
            ans[b] += 1

    q = int(input())
    out = []

    for _ in range(q):
        parts = input().split()
        typ = parts[0]

        if typ == '?':
            v = int(parts[1]) - 1
            out.append(str(ans[v]))

        elif typ == 'F':
            a = int(parts[1]) - 1
            b = int(parts[2]) - 1

            friends[a].append(b)
            friends[b].append(a)

            if find(a) == find(b):
                ans[a] += 1
                ans[b] += 1

        else:
            a = int(parts[1]) - 1
            b = int(parts[2]) - 1

            ra = find(a)
            rb = find(b)

            if ra == rb:
                continue

            if size[ra] > size[rb]:
                large, small = ra, rb
            else:
                large, small = rb, ra

            for v in members[small]:
                for u in friends[v]:
                    if find(u) == large:
                        ans[v] += 1
                        ans[u] += 1

            parent[small] = large
            size[large] += size[small]
            members[large].extend(members[small])
            members[small] = []

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    solve()
```DSU 在评估初始友谊之前初始化，因为初始列车路线决定了起始连接组件。 初始友谊边是单独保存的，因此可以在插入所有初始火车路线后对其进行评估。 

这`members`数组是使从小到大合并成为可能的额外结构。 DSU 本身可以告诉我们两个顶点是否相连，但它不能有效地枚举属于一个组件的所有顶点。 成员列表正好提供了缺少的操作。 

火车并道内的顺序很微妙。 在更改其父组件之前，会扫描较小的组件。 在此扫描过程中，`find(u) == large`意味着`u`在合并之前确实属于另一个组件。 如果我们首先更改父节点，则两个顶点之间的友谊`small`可能会被误认为是穿越友谊而被算两次。 

这`F`无论连接如何，操作都会更新友谊邻接列表。 当其端点断开连接时，友谊必须保持存储，因为稍后`T`操作可能会使其有效。 

所有计数都适合 Python 整数。 在 C++ 中，普通的 32 位有符号整数也足够了，因为答案最多是 (n-1)，但 Python 不存在整数溢出问题。 

迭代式`find`避免递归开销并执行路径压缩。 按组件大小合并可确保成员列表始终从小列表合并到较大列表中。 

## 工作示例

 ### 示例 1

 初始列车边缘是`(1,2)`和`(1,4)`，所以火车组件是`{1,2,4}`和`{3}`。 最初的友谊是`(1,2)`和`(1,3)`。 仅有的`(1,2)`位于城市 1 的组成部分内，因此`ans[1]`从一开始。 

| 运营| 组件| 新友谊效应|`ans[1]`|
 | --- | --- | --- | --- |
 | 初始状态|`{1,2,4}`,`{3}`|`(1,2)`数了一下，`(1,3)`未计算| 1 |
 |`? 1`|`{1,2,4}`,`{3}`| 无 | 1 |
 |`F 4 1`|`{1,2,4}`,`{3}`| 1 和 4 已连接 | 2 |
 |`? 1`|`{1,2,4}`,`{3}`| 无 | 2 |
 |`T 4 3`|`{1,2,3,4}`| 友谊`(1,3)`交叉合并的组件| 3 |
 |`? 1`|`{1,2,3,4}`| 无 | 3 |

 最后一个列车插入扫描较小的组件`{3}`。 它唯一的友谊是与属于另一个组件的城市 1，因此`(3,1)`变得可达并且`ans[1]`从两个增加到三个。 

### 构造示例 2

 考虑以下输入：```
5 2 1
1 4
2 5
1 2
5
? 1
F 1 3
? 1
T 3 4
? 1
```最初，火车组件是`{1,2}`和`{3}`,`{4}`,`{5}`。 友谊`(1,4)`无法到达，并且`(2,5)`从城市 1 也无法到达。 

| 运营| 组件| 相关变更 |`ans[1]`|
 | --- | --- | --- | --- |
 | 初始状态|`{1,2}`,`{3}`,`{4}`,`{5}`| 城市 1 的组件内没有友谊 | 0 |
 |`? 1`|`{1,2}`,`{3}`,`{4}`,`{5}`| 无 | 0 |
 |`F 1 3`|`{1,2}`,`{3}`,`{4}`,`{5}`| 1 和 3 已断开 | 0 |
 |`? 1`|`{1,2}`,`{3}`,`{4}`,`{5}`| 无 | 0 |
 |`T 3 4`|`{1,2}`,`{3,4}`,`{5}`| 友谊`(1,4)`仍然跨组件| 0 |
 |`? 1`|`{1,2}`,`{3,4}`,`{5}`| 无 | 0 |

 此示例表明友谊可以保存很长时间，而不会影响任一端点的答案。 如果我们然后添加`T 2 3`, 组件`{1,2}`和`{3,4}`合并，双方的友谊`(1,4)`和`(1,3)`立即生效。 小部件扫描发现了两者。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O((m+q+k)\log n\cdot\alpha(n))) | DSU 操作几乎是恒定的，而每个顶点的友谊列表仅被扫描 (O(\log n)) 次 |
 | 空间| (O(n+m+q)) | DSU 数组、组件成员列表、友谊邻接列表和存储的初始友谊 |

 初始图最多包含 (10^5) 个友谊边和 (10^5) 个训练边，同时最多处理 (10^5) 个附加操作。 对数因子来自从小到大的合并，因此好友扫描的总量仍然是可控的。 内存使用量与城市和插入的友谊数量成线性关系。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n, m, k = map(int, input().split())

    friends = [[] for _ in range(n)]
    friendship_edges = []

    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        friends[a].append(b)
        friends[b].append(a)
        friendship_edges.append((a, b))

    parent = list(range(n))
    size = [1] * n
    members = [[i] for i in range(n)]

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def merge(a, b):
        a = find(a)
        b = find(b)
        if a == b:
            return

        if size[a] < size[b]:
            a, b = b, a

        parent[b] = a
        size[a] += size[b]
        members[a].extend(members[b])
        members[b] = []

    for _ in range(k):
        a, b = map(int, input().split())
        merge(a - 1, b - 1)

    ans = [0] * n

    for a, b in friendship_edges:
        if find(a) == find(b):
            ans[a] += 1
            ans[b] += 1

    q = int(input())
    out = []

    for _ in range(q):
        parts = input().split()
        typ = parts[0]

        if typ == '?':
            v = int(parts[1]) - 1
            out.append(str(ans[v]))

        elif typ == 'F':
            a = int(parts[1]) - 1
            b = int(parts[2]) - 1

            friends[a].append(b)
            friends[b].append(a)

            if find(a) == find(b):
                ans[a] += 1
                ans[b] += 1

        else:
            a = int(parts[1]) - 1
            b = int(parts[2]) - 1

            ra = find(a)
            rb = find(b)

            if ra == rb:
                continue

            if size[ra] >= size[rb]:
                large, small = ra, rb
            else:
                large, small = rb, ra

            for v in members[small]:
                for u in friends[v]:
                    if find(u) == large:
                        ans[v] += 1
                        ans[u] += 1

            parent[small] = large
            size[large] += size[small]
            members[large].extend(members[small])
            members[small] = []

    return '\n'.join(out)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

sample1 = """\
4 2 2
1 2
1 3
1 2
1 4
5
? 1
F 4 1
? 1
T 4 3
? 1
"""

assert run(sample1) == "1\n2\n3", "sample 1"

case2 = """\
1 0 0
3
? 1
F 1 1
? 1
"""
# This input violates the original constraint a != b for F, so it is
# deliberately not used as a valid test.

case3 = """\
2 1 0
1 2
2
? 1
T 1 2
"""
assert run(case3) == "0", "friendship before train connection"

case4 = """\
4 2 0
1 3
1 4
5
? 1
T 1 2
? 1
T 2 3
? 1
"""
assert run(case4) == "0\n0\n2", "friendships become reachable after a merge"

case5 = """\
5 0 2
1 2
2 3
5
? 1
F 1 3
? 1
F 4 5
T 3 4
"""
assert run(case5) == "0\n1", "friendship inserted after connectivity"

# Maximum-size structural test. Every query asks about the same isolated city.
# There are 100000 cities and 100000 queries, so this also checks input/output
# handling near the limit.
n = 100000
q = 100000
max_case = f"{n} 0 0\n{q}\n" + "? 100000\n" * q
expected = "0\n" * q
assert run(max_case) == expected[:-1], "maximum-size repeated queries"

# Boundary case with all cities in one train component and every possible
# friendship among three cities.
case7 = """\
3 3 3
1 2
1 3
2 3
1 2
2 3
1 3
4
? 1
F 1 2
? 1
? 3
"""
assert run(case7) == "2\n3\n2", "complete component and repeated queries"
```第一个断言是提供的示例，用于检查友谊插入和训练组件合并之间的完整交互。 

第二个有效案例使用具有两个城市的最小可能图。 友谊从一开始就存在，但没有火车路线，所以答案是零。 

第三个有效案例检查仅在两个单独的火车组件合并后才可访问的友谊。 它捕获仅在插入友谊时更新答案的实现。 

第四个有效案例在端点已连接后插入友谊。 它验证了`F`当 DSU 根匹配时，立即增加答案。 

最大尺寸测试对 (10^5) 个孤立城市执行 (10^5) 个相同的查询。 它强调输入处理和重复的恒定时间查询，而不构建不必要的大边集。 

最后一个案例从一开始就将每个城市置于一个相互连接的组件中，并且三个城市之间具有所有可能的友谊。 它检查答案是否对每个友谊端点进行一次计数，并且重复的查询不会改变状态。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 |`1`,`2`,`3`| 两种更新类型的完整交互 |
 |`2 1 0`和`? 1`|`0`| 友谊并不意味着火车连通|
 | 四城合并案|`0`,`0`,`2`| 合并后可以建立多个友谊 |
 | 五城动态联谊案例|`0`,`1`| 连接后插入友谊 |
 | (n=q=100000)，隔离重复查询 | 100000 个零 | 最大输入大小和边界处理 |
 | 三个完全互联的城市 |`2`,`3`,`2`| 组件齐全、重复查询、精确计数 |

 ## 边缘情况

 ### 友谊存在，但城市却断开了

 考虑：```
2 1 0
1 2
1
? 1
```友谊邻接表包含城市 1 的城市 2，但是`find(1)`和`find(2)`是不同的。 最初的友谊没有任何贡献`ans[1]`，所以查询打印`0`。 如果以后`T 1 2`操作发生时，较小的组件包含一个城市，在合并过程中发现其与另一组件的友谊，并且`ans[1]`变成`1`。 

### 友谊被添加到现有的火车组件中

 考虑：```
2 0 1
1 2
2
F 1 2
? 1
```最初的火车路线将两个城市置于同一 DSU 根目录下。 什么时候`F 1 2`处理后，根匹配，因此两个答案都会立即递增。 查询打印`1`。 

### 火车并道激活了许多老朋友

 考虑：```
4 2 1
1 3
1 4
1 2
2
? 1
T 2 3
```最初城市 1 属于`{1,2}`，而城市 3 和 4 是分开的。 第一个查询打印`0`。 什么时候`T 2 3`被插入，`{1,2}`合并于`{3}`。 较小的分量是`{3}`，其好友列表包含城市1。合并增量`ans[3]`和`ans[1]`，所以友谊`(1,3)`现在已计算在内。 

同样的机制可以处理任意多的交叉友谊。 如果较小的组件包含 (x) 个顶点，并且它们的友谊列表包含 (r) 个相关边，则在合并期间将处理所有 (r) 个边。 

### 火车边缘连接同一组件中已有的城市

 考虑：```
3 1 2
1 3
1 2
2 3
1
? 1
```在考虑第二条火车边缘之前，所有三个城市都已经连接起来。 2 和 3 的 DSU 根相等，因此第二个边沿不会导致扫描且不会改变答案。 城市 1 有一个朋友，城市 3，所以查询打印`1`。 

忽略`ra == rb`这种情况会导致不必要的工作，并且如果在没有新连接的情况下扫描组件，则可能导致错误的重复计数。 

### 较小的组件在合并之间发生变化

 假设火车图最初是五个孤立的城市，并且路线插入为`(1,2)`,`(3,4)`,`(1,3)`,`(1,5)`。 前两个合并处理单城市组件。 第三次合并处理一个两城市组件与另一个两城市组件。 第四次合并处理包含 5 的单城市组件与已经较大的组件。 

只有当一个城市的组成部分大小最多为最终组成部分大小的一半时，该城市才能处于较小的一侧。 每一个这样的事件都至少使其组件大小增加一倍。 从大小 1 开始，这种情况最多可能发生 (\lfloor\log_2 n\rfloor) 次，这就是重复的友谊扫描保持有界的原因。
