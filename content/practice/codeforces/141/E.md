---
title: "CF 141E - 清理"
description: "我们得到一个无向图，其中每条边都属于两个类别之一。 标记为“S”的道路是精灵清理的狭窄道路，标记为“M”的道路是圣诞老人清理的宽阔道路。 我们必须选择同时满足两个条件的道路子集。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dp", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 141
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 101 (Div. 2)"
rating: 2300
weight: 141
solve_time_s: 171
verified: true
draft: false
---

[CF 141E - 清理](https://codeforces.com/problemset/problem/141/E)

 **评分：** 2300
 **标签：** 构造性算法、dp、dsu、图
 **求解时间：** 2m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个无向图，其中每条边都属于两个类别之一。 道路标记`"S"`是精灵清理的狭窄道路，以及标记的道路`"M"`是圣诞老人清理的宽阔道路。 

我们必须选择同时满足两个条件的道路子集。 

首先，所选择的道路必须在所有小屋上方形成一棵树。 每对小屋之间必须有一条简单路径，这是生成树的定义属性。 上的一棵生成树`n`顶点总是包含精确的`n - 1`边缘。 

二、数量`"S"`边缘和`"M"`该生成树内的边必须相等。 

这立即给出了一个重要的观察结果。 既然树有`n - 1`边总数，这个数字必须是偶数。 否则不可能在两种类型之间均匀分割边缘。 

该图的顶点数很小，最多只有`1000`，但边数可以达到`100000`。 这完全改变了解决方案的形状。 尝试许多边子集的算法是没有希望的，但基于重复 DSU 操作的算法足够快，因为 DSU 几乎以恒定的摊余时间运行。 一个`O(m α(n))`或者`O(m log n)`解决方案很容易被接受。 

有几种容易被忽略的边缘情况。 

即使我们忽略边类型，图也可能已经断开连接。```
4 2
1 2 S
3 4 M
```这里不存在生成树，所以正确答案是`-1`。 

当一种边类型无法在任何生成树中出现足够的次数时，就会出现另一种微妙的情况。```
3 2
1 2 S
2 3 S
```生成树存在，但它只包含`"S"`边缘。 因为有效的答案需要一个`"S"`和一个`"M"`边缘，答案仍然是`-1`。 

自循环是另一个陷阱。```
2 2
1 1 S
1 2 M
```自循环永远不会帮助连接组件，因此盲目地按类型计算边的粗心实现可能会错误地接受它。 

平行边缘也很重要。```
2 3
1 2 S
1 2 S
1 2 M
```生成树中只能出现一条边。 该算法必须独立处理每条边，并避免添加形成循环的重复项。 

## 方法

 蛮力的想法很简单。 上的一棵生成树`n`顶点恰好包含`n - 1`边，所以我们可以尝试该大小的每个子集，检查它是否形成一棵树，并验证它的数量`"S"`和`"M"`边相等。 

这是合乎逻辑的，因为定义有效答案的约束很容易测试。 连通性和非循环性都可以使用 DSU 或 DFS 检查。 

问题是子集的数量。 在最坏的情况下，我们会检查$$\binom{100000}{999}$$子集，这是完全不可能的。 

关键的观察是唯一困难的部分是平衡边缘类型的数量。 生成树结构本身很容易使用 DSU 进行管理。 

认为`k = (n - 1) / 2`。 任何有效的树必须准确包含`k` `"S"`边缘和精确`k` `"M"`边缘。 

我们可以根据可行性范围来思考，而不是立即构建整个树。 

首先，最少数量是多少`"S"`任何生成树必须包含的边？ 如果我们贪婪地仅使用连接组件`"M"`首先是边，然后每个剩余的强制连接必须使用`"S"`边缘。 这给出了最小可能的数量`"S"`边缘。 

同样，如果我们贪婪地使用`"S"`首先，我们得到最大可能的边数`"S"`边缘。 

如果`k`在此区间之外，则不存在答案。 

更好的是，一旦可行性得到确认，我们就可以显式地构建这样一棵树。 我们首先精确地强制`k` `"S"`边缘，同时保留生成树的可扩展性。 然后我们使用完成剩余的连接`"M"`边缘。 

整个解决方案变成 DSU 遍历边缘列表的序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(n) | 太慢了|
 | 最佳| O(m α(n)) | O(m α(n)) | O(n) | 已接受 |

 ## 算法演练

 1.读取所有边并将它们分成两个列表，`"S"`边缘和`"M"`边缘。 
2.如果`n - 1`为奇数，立即打印`-1`。 

有效的生成树需要两种边类型的计数相等，因此边的总数必须能被二整除。 
3.让`k = (n - 1) / 2`。 
4. 计算最少可能的数量`"S"`任何生成树中的边。 

启动一个DSU并贪婪地添加所有可能的`"M"`首先是边缘。 之后，尝试添加`"S"`边缘。 每一个`"S"`实际上合并两个组件的边是不可避免的，所以算一下。 
5. 如果该最小值超过`k`， 打印`-1`。 

每棵生成树都会包含太多`"S"`边缘。 
6. 计算最大可能的数量`"S"`边缘。 

启动另一个 DSU 并贪婪地添加所有可能的`"S"`首先是边缘。 数一下添加了多少个。 
7. 如果该最大值小于`k`， 打印`-1`。 

生成树无法包含足够多的内容`"S"`边缘。 
8. 准确构建`k` `"S"`边缘。 

从新的 DSU 开始。 首先贪心地添加`"S"`每当它们连接不同的组件时。 暂时存储这些边缘。 

这创建了一个最大的森林`"S"`边缘。 
9.其中一些`"S"`边缘可能是不必要的。 我们只需要准确地`k`。 

从头开始重建 DSU。 迭代存储的`"S"`边并将它们一一相加，直到恰好`k`已被选择。 
10.继续扫描全部`"S"`再次边缘。 

如果我们仍然少于`k`已选择`"S"`边，每当它们连接不同的组件时添加更多。 

此时我们正好有`k` `"S"`边缘形成森林。 
11.使用完成生成树`"M"`边缘。 

迭代所有`"M"`边并添加端点属于不同组件的任何边。 
12. 如果所选边的总数不是`n - 1`， 打印`-1`。 

否则输出所选的边缘索引。 

### 为什么它有效

 最小和最大可行性检查基于标准生成树交换参数。 贪婪地占据一切可能`"M"`边缘最小化所需的数量`"S"`边缘，因为每次避免合并使用`"M"`只会强迫另一个人`"S"`稍后合并。 对称参数给出最大值。 

施工过程中，选定`"S"`边缘总是形成无环森林。 每次我们添加一个组件时，它都会合并两个先前断开连接的组件。 由于可行性区间已经证明了`k` `"S"`边缘是可以实现的，选择后我们可以安全地停止`k`这样的边缘并使用完成剩余的连接`"M"`边缘。 

最终的 DSU 状态保证了非循环性和连接性。 我们只添加连接不同组件的边，因此循环永远不会出现。 上的一棵生成树`n`顶点与`n - 1`边是自动连接的并且是非循环的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.size = [1] * (n + 1)

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)

        if a == b:
            return False

        if self.size[a] < self.size[b]:
            a, b = b, a

        self.parent[b] = a
        self.size[a] += self.size[b]
        return True

def solve():
    n, m = map(int, input().split())

    edges_s = []
    edges_m = []

    all_edges = []

    for idx in range(1, m + 1):
        u, v, t = input().split()
        u = int(u)
        v = int(v)

        edge = (u, v, idx)

        all_edges.append((u, v, t, idx))

        if t == 'S':
            edges_s.append(edge)
        else:
            edges_m.append(edge)

    if (n - 1) % 2:
        print(-1)
        return

    k = (n - 1) // 2

    # minimum possible number of S edges
    dsu = DSU(n)

    for u, v, _ in edges_m:
        dsu.union(u, v)

    min_s = 0

    for u, v, _ in edges_s:
        if dsu.union(u, v):
            min_s += 1

    if min_s > k:
        print(-1)
        return

    # maximum possible number of S edges
    dsu = DSU(n)

    max_s = 0

    for u, v, _ in edges_s:
        if dsu.union(u, v):
            max_s += 1

    if max_s < k:
        print(-1)
        return

    # build exactly k S edges
    dsu = DSU(n)

    useful_s = []

    for u, v, idx in edges_s:
        if dsu.union(u, v):
            useful_s.append((u, v, idx))

    dsu = DSU(n)

    answer = []
    used_s = 0

    for u, v, idx in useful_s:
        if used_s == k:
            break

        if dsu.union(u, v):
            answer.append(idx)
            used_s += 1

    for u, v, idx in edges_s:
        if used_s == k:
            break

        if dsu.union(u, v):
            answer.append(idx)
            used_s += 1

    # finish with M edges
    for u, v, idx in edges_m:
        if dsu.union(u, v):
            answer.append(idx)

    if len(answer) != n - 1:
        print(-1)
        return

    print(len(answer))
    print(*answer)

solve()
```第一个重要的细节是分离`"S"`和`"M"`边缘。 整个构造依赖于独立处理这两种类型。 

最小和最大可行性检查重用相同的 DSU 结构，但顺序相反。 顺序就是整个论证。 添加全部`"M"`边缘第一叶仅强制`"S"`合并，同时添加所有`"S"`边首先最大化有多少这样的边可以参与。 

施工阶段有一个微妙的两阶段结构。 第一个路过`"S"`边缘计算潜在有用的最大森林`"S"`边缘。 第二遍只仔细选择`k`其中。 

如果不在第二阶段之前重建 DSU，我们会意外地保留太多`"S"`边缘已经合并到结构中。 

另一个容易犯的错误是假设完全达到`k` `"S"`边缘自动保证连接。 事实并非如此。 最后的传球`"M"`连接所有剩余组件仍然需要边缘。 

最后检查`len(answer) != n - 1`干净地捕捉断开的情况。 

## 工作示例

 ### 示例 1

 输入：```
1 2
1 1 S
1 1 M
```这里`n - 1 = 0`， 所以`k = 0`。 

| 步骤| 行动| 选定的边| 组件|
 | --- | --- | --- | --- |
 | 初始| 无需边缘 | {} | 1 |
 | 决赛| 树已经完成 | {} | 1 |

 输出：```
0
```此示例证实具有一个顶点的图根本不需要边。 自循环被忽略，因为它们从不合并组件。 

### 示例 2

 输入：```
3 3
1 2 S
2 3 M
1 3 S
```我们正好需要一个`"S"`边和一`"M"`边缘。 

| 步骤| 边缘考虑| 已接受 | 二手 S | DSU 组件 |
 | --- | --- | --- | --- | --- |
 | 1 | 1-2 小号 | 是的 | 1 | {1,2}, {3} |
 | 2 | 1-3 小号 | 暂时跳过 | 1 | {1,2}, {3} |
 | 3 | 2-3 M | 是的 | 1 | {1,2,3} |

 选择的边是`{1, 2}`。 

该迹线展示了关键不变量。 这`"S"`仅当它们扩展森林时才选择边缘，并且`"M"`边缘完成连接而不创建循环。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m α(n)) | O(m α(n)) | 每条边参与恒定数量的 DSU 操作 |
 | 空间| O(n) | DSU 阵列和应答存储 |

 该图最多包含`100000`边缘，因此对边缘列表的线性传递完全没问题。 DSU 操作实际上是常数时间，因为逆阿克曼增长在实践中很小。 该解决方案很容易满足时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class DSU:
        def __init__(self, n):
            self.parent = list(range(n + 1))
            self.size = [1] * (n + 1)

        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x

        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)

            if a == b:
                return False

            if self.size[a] < self.size[b]:
                a, b = b, a

            self.parent[b] = a
            self.size[a] += self.size[b]
            return True

    n, m = map(int, input().split())

    edges_s = []
    edges_m = []

    for idx in range(1, m + 1):
        u, v, t = input().split()
        u = int(u)
        v = int(v)

        if t == 'S':
            edges_s.append((u, v, idx))
        else:
            edges_m.append((u, v, idx))

    if (n - 1) % 2:
        return "-1"

    k = (n - 1) // 2

    dsu = DSU(n)

    for u, v, _ in edges_m:
        dsu.union(u, v)

    min_s = 0

    for u, v, _ in edges_s:
        if dsu.union(u, v):
            min_s += 1

    if min_s > k:
        return "-1"

    dsu = DSU(n)

    max_s = 0

    for u, v, _ in edges_s:
        if dsu.union(u, v):
            max_s += 1

    if max_s < k:
        return "-1"

    dsu = DSU(n)

    useful_s = []

    for u, v, idx in edges_s:
        if dsu.union(u, v):
            useful_s.append((u, v, idx))

    dsu = DSU(n)

    ans = []
    used_s = 0

    for u, v, idx in useful_s:
        if used_s == k:
            break

        if dsu.union(u, v):
            ans.append(idx)
            used_s += 1

    for u, v, idx in edges_s:
        if used_s == k:
            break

        if dsu.union(u, v):
            ans.append(idx)
            used_s += 1

    for u, v, idx in edges_m:
        if dsu.union(u, v):
            ans.append(idx)

    if len(ans) != n - 1:
        return "-1"

    return str(len(ans))

# provided sample
assert run(
"""1 2
1 1 S
1 1 M
"""
) == "0", "sample 1"

# impossible because n-1 is odd
assert run(
"""2 1
1 2 S
"""
) == "-1", "odd tree size"

# disconnected graph
assert run(
"""4 2
1 2 S
3 4 M
"""
) == "-1", "disconnected"

# only one edge type available
assert run(
"""3 2
1 2 S
2 3 S
"""
) == "-1", "cannot balance types"

# simple valid case
assert run(
"""3 3
1 2 S
2 3 M
1 3 S
"""
) == "2", "balanced spanning tree exists"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 带循环的单节点 | 0 | Self-loops are ignored correctly |
 |`n - 1`奇数| -1 | Equal split impossible |
 | Disconnected graph | -1 | 强制执行连接要求 |
 | Only one edge type | -1 | 可行性区间检查 |
 | Small balanced graph | 2 | 施工成功|

 ## 边缘情况

 考虑断开连接的图：```
4 2
1 2 S
3 4 M
```最低`"S"`计算开始时添加`"M"`边缘，生产组件`{1}`,`{2}`,`{3,4}`。 这`"S"`边缘合并`{1}`和`{2}`，留下两个连通分量。 由于最终的图永远无法连接，因此构建阶段以少于`n - 1`边缘并正确打印`-1`。 

现在考虑只有`"S"`边缘：```
3 2
1 2 S
2 3 S
```这里`k = 1`。 最大可能数量`"S"`边缘是`2`，但最少可能的数量`"S"`边缘也是`2`因为没有`"M"`根本没有边缘。 自从`min_s > k`，算法立即拒绝该实例。 

最后，考虑平行边：```
2 3
1 2 S
1 2 S
1 2 M
```DSU 仅接受合并两个顶点的第一条边。 每一个后来的平行边都会被拒绝，因为两个端点已经属于同一个组件。 这保证了最终答案仍然是非循环的。
