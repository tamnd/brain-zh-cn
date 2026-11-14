---
title: "CF 468B - 两套"
description: "我们得到一组 n 个不同的整数。 每个数字必须分配给两个组之一。 如果一个数x被放入组A中，那么它相对于a的补码，即a - x，也必须存在并且必须属于A。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "2-sat", "dfs-and-similar", "dsu", "graph-matchings", "greedy"]
categories: ["algorithms"]
codeforces_contest: 468
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 268 (Div. 1)"
rating: 2000
weight: 468
solve_time_s: 152
verified: true
draft: false
---

[CF 468B - 两套](https://codeforces.com/problemset/problem/468/B)

 **评级：** 2000
 **标签：** 2-sat、dfs 和类似、dsu、图形匹配、贪婪
 **求解时间：** 2m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一组`n`不同的整数。 每个数字必须分配给两个组之一。 

如果一个数字`x`被放入组中`A`，那么它的补集`a`，即`a - x`，也必须存在并且必须属于`A`。 

同样，如果`x`被放入组中`B`，那么它的补集`b`，即`b - x`，也必须存在并且必须属于`B`。 

数字本身是固定的。 我们不允许添加缺失值。 我们只选择每个现有号码是否属于组`A`或团体`B`。 

输出是每个输入数字的分配。 按照惯例，`0`表示该号码属于`A`， 和`1`意味着它属于`B`。 

约束条件`n ≤ 100000`立即排除任何指数搜索。 甚至一个`O(n²)`算法需要大约`10¹⁰`最坏情况下的操作，远远超出了极限。 我们需要一些接近线性或`O(n log n)`。 

一些边缘情况使问题变得棘手。 

考虑：```
n = 1
a = 10
b = 20
p = [3]
```数量`3`既没有补集`7`也不补充`17`在集合中。 无法进行分配，所以答案是`NO`。 

现在考虑：```
n = 2
a = 5
b = 100
p = [2, 3]
```这里`2`和`3`形成有效的总和对`5`。 两个数字都没有有效的总和伙伴`100`。 两个数字都被强制设置`A`。 

尝试独立决定数字的粗心解决方案可能会在以下情况下失败：```
a = 10
b = 12
p = [1, 9, 3]
```数字`1`只能参加总和`10`， 自从`9`存在。 数字`3`只能参加总和`12`， 但`9`那么就需要同时在两个集合中。 答案是`NO`。 

主要困难在于决策通过补关系图传播。 

## 方法

 最直接的方法就是暴力破解。 对于每个数字，选择任意一组`A`或设置`B`，然后验证所有补集要求是否成立。 

有`2ⁿ`作业。 和`n = 100000`，这是完全不可能的。 

蛮力在概念上起作用的原因是约束是局部的。 一个数只关心它的补数`a`和`b`。 问题在于本地选择相互作用，形成长长的依赖链。 

关键的观察是每个数字最多可以有一个伙伴来求和`a`最多有一个合伙人的金额`b`。 

如果我们构建一个图，其顶点是给定的数字，那么：

 A型边：`x ↔ a - x`每当两个数字都存在时。 

B型边：`x ↔ b - x`每当两个数字都存在时。 

假设一个数字缺少其 A 伙伴。 那么它永远不能属于集合`A`，所以它被迫进入集合`B`。 

同样，如果一个数缺少它的 B 伙伴，它就会被迫进入集合`A`。 

这些被迫的选择不断传播。 如果一个顶点被强制进入`A`，那么通过 A 边连接的每个顶点也必须在`A`。 如果这些顶点之一已经被强制进入`B`，我们有矛盾。 

该结构非常适合不相交集并集构造。 

引入两个特殊节点：`SA`意思是“属于A”`SB`意思是“属于B”

 对于每个数字：

 如果其 A 伙伴不存在，则将其与`SB`。 

如果其 B 伙伴不存在，则将其与`SA`。 

对于每个现有的 A 边`(x, a-x)`：

 合并相应的顶点。 

对于每个现有的 B 边`(x, b-x)`：

 合并相应的顶点。 

经典的公认解决方案实际上将问题建模为一个图，其连接组件是路径或循环。 在每个组件内，所有顶点必须位于同一组中。 DSU 准确地捕获了这种传播。 

毕竟工会，如果`SA`和`SB`连接起来，约束不一致。 

否则，连接到的每个组件`SA`被分配给集合`A`，每个组件连接到`SB`被分配给集合`B`，剩余的空闲组件可以任意分配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2ⁿ·n) | O(2ⁿ·n) | O(n) | 太慢了 |
 | 最佳 DSU | O(n α(n)) | O(n α(n)) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有数字并构建从值到索引的哈希映射。 
2. 创建 DSU`n + 2`顶点。 

最后两个顶点代表特殊状态`SA`和`SB`。 
3. 对于每个数字`x`，检查是否`a - x`存在。 

如果不存在，那么`x`不能属于集合`A`。 将其顶点与`SB`。 
4. 对于每个数字`x`，检查是否`b - x`存在。 

如果不存在，那么`x`不能属于集合`B`。 将其顶点与`SA`。 
5. 对于每个现有的 A 伙伴对，合并两个相应的顶点。 

如果一个顶点属于`A`，另一个也必须属于`A`。 
6. 对于每个现有的 B 伙伴对，合并两个相应的顶点。 

如果一个顶点属于`B`，另一个也必须属于`B`。 
7. 所有并集后，检查是否`SA`和`SB`属于同一个DSU组件。 

如果这样做，则某些数字会同时强制进入两个集合，并且不存在有效的分配。 
8. 否则，确定每个数字的分配。 

如果其组件连接到`SA`， 输出`0`。 

否则输出`1`。 

### 为什么它有效

 缺少 A 伙伴意味着该号码永远无法放入集合中`A`，所以它一定属于`B`。 对称陈述适用于缺失的 B 伙伴。 

每个补关系都要求两个端点接收相同的分配。 DSU 精确合并必须始终一起移动的顶点。 

处理完所有这些含义后，每个 DSU 组件都代表一组数字，其分配是不可分割的。 将组件连接到`SA`将其修复为设置`A`，同时将其连接到`SB`将其修复为设置`B`。 

如果`SA`和`SB`最终出现在同一个组件中，一些影响链迫使一个数字同时属于两个集合。 否则，每个组件都有一致的分配，从而给出有效的分区。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)

        if a == b:
            return

        if self.size[a] < self.size[b]:
            a, b = b, a

        self.parent[b] = a
        self.size[a] += self.size[b]

def solve():
    n, a, b = map(int, input().split())
    p = list(map(int, input().split()))

    pos = {x: i for i, x in enumerate(p)}

    SA = n
    SB = n + 1

    dsu = DSU(n + 2)

    for i, x in enumerate(p):
        ax = a - x
        bx = b - x

        if ax not in pos:
            dsu.union(i, SB)

        if bx not in pos:
            dsu.union(i, SA)

    for i, x in enumerate(p):
        ax = a - x
        bx = b - x

        if ax in pos:
            dsu.union(i, pos[ax])

        if bx in pos:
            dsu.union(i, pos[bx])

    if dsu.find(SA) == dsu.find(SB):
        print("NO")
        return

    rootA = dsu.find(SA)

    ans = []
    for i in range(n):
        if dsu.find(i) == rootA:
            ans.append("0")
        else:
            ans.append("1")

    print("YES")
    print(" ".join(ans))

solve()
```哈希图`pos`允许恒定时间查找补集。 如果没有它，每个补集搜索都需要线性扫描，并且解将变成二次的。 

两个特殊的 DSU 顶点是中心思想。 它们代表了两组中一组的强制成员资格。 缺少补充会立即产生这些强制分配。 

第二遍合并所有补码对。 由于每个补码规则都需要相等的分配，因此 DSU 正是正确的结构。 

最终检查比较了以下代表`SA`和`SB`。 匹配意味着矛盾的要求达到了同一组件。 

在构建答案时，每个组件都连接到`SA`被分配给集合`A`。 所有剩余组件都属于集合`B`。 因为`SA`和`SB`断开连接时，该分配始终是一致的。 

## 工作示例

 ### 示例 1

 输入：```
4 5 9
2 3 4 5
```| 数量 | A-合作伙伴| 存在 | B-伙伴| 存在 |
 | --- | --- | --- | --- | --- |
 | 2 | 3 | 是的 | 7 | 没有 |
 | 3 | 2 | 是的 | 6 | 没有 |
 | 4 | 1 | 没有 | 5 | 是的 |
 | 5 | 0 | 没有 | 4 | 是的 |

 强制分配：

 | 数量 | 被迫|
 | --- | --- |
 | 2 | 一个 |
 | 3 | 一个 |
 | 4 | 乙|
 | 5 | 乙|

 补充工会连接`(2,3)`和`(4,5)`。 

最终作业：

 | 数量 | 设置|
 | --- | --- |
 | 2 | 一个 |
 | 3 | 一个 |
 | 4 | 乙|
 | 5 | 乙|

 输出：```
YES
0 0 1 1
```这个例子展示了缺失的补体如何立即迫使组件向一侧移动。 

### 示例 2

 输入：```
3 10 12
1 9 3
```| 数量 | A-合作伙伴| 存在 | B-伙伴| 存在 |
 | --- | --- | --- | --- | --- |
 | 1 | 9 | 是的 | 11 | 11 没有 |
 | 9 | 1 | 是的 | 3 | 是的 |
 | 3 | 7 | 没有 | 9 | 是的 |

 力量：

 | 数量 | 被迫|
 | --- | --- |
 | 1 | 一个 |
 | 3 | 乙|

 A 边连接`1`和`9`。 

B边连接`9`和`3`。 

所有三个数字都成为一个 DSU 组件的一部分。 

该组件连接到两者`SA`和`SB`，产生矛盾。 

输出：```
NO
```这证明了独立的局部约束如何通过互补关系链发生冲突。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n α(n)) | O(n α(n)) | 哈希查找加上 DSU 操作 |
 | 空间| O(n) | DSU 数组和哈希映射 |`α(n)`是阿克曼反函数，对于所有实际输入大小来说都是有效的常数。 和`n = 100000`，该解决方案很容易满足时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string

import sys
import io

def run(inp: str) -> str:
    out = io.StringIO()

    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
            self.size = [1] * n

        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x

        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)
            if a == b:
                return
            if self.size[a] < self.size[b]:
                a, b = b, a
            self.parent[b] = a
            self.size[a] += self.size[b]

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n, a, b = map(int, input().split())
    p = list(map(int, input().split()))

    pos = {x: i for i, x in enumerate(p)}

    SA = n
    SB = n + 1

    dsu = DSU(n + 2)

    for i, x in enumerate(p):
        if a - x not in pos:
            dsu.union(i, SB)
        if b - x not in pos:
            dsu.union(i, SA)

    for i, x in enumerate(p):
        if a - x in pos:
            dsu.union(i, pos[a - x])
        if b - x in pos:
            dsu.union(i, pos[b - x])

    if dsu.find(SA) == dsu.find(SB):
        return "NO"

    rootA = dsu.find(SA)
    ans = []

    for i in range(n):
        ans.append("0" if dsu.find(i) == rootA else "1")

    return "YES\n" + " ".join(ans)

# provided sample
assert run("4 5 9\n2 3 4 5\n") == "YES\n0 0 1 1"

# single value, impossible
assert run("1 10 20\n3\n") == "NO"

# pair forced into A
assert run("2 5 100\n2 3\n") == "YES\n0 0"

# contradiction through chain
assert run("3 10 12\n1 9 3\n") == "NO"

# all numbers belong to B
assert run("2 100 5\n2 3\n") == "YES\n1 1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 10 20 / 3`|`NO`| 数字没有有效的补数 |
 |`2 5 100 / 2 3`|`YES 0 0`| 整个组件强制进入 A |
 |`3 10 12 / 1 9 3`|`NO`| 矛盾传播|
 |`2 100 5 / 2 3`|`YES 1 1`| 整个组件强制进入 B |

 ## 边缘情况

 考虑：```
1 10 20
3
```数量`3`缺乏两种补充`7`和`17`。 该算法将其组件与两者结合起来`SA`和`SB`。 由于这些代表变得相同，所以答案立即是`NO`。 

考虑：```
2 5 100
2 3
```两个号码都有有效的 A 合作伙伴，但没有有效的 B 合作伙伴。 该算法将两个顶点连接到`SA`，通过 A 边合并它们，并且从不接触`SB`。 最终的分配是唯一确定的`A`。 

考虑：```
3 10 12
1 9 3
```顶点`1`被迫`A`, 顶点`3`被迫`B`。 补边合并`1 ↔ 9`和`9 ↔ 3`，因此所有三个顶点都成为一个 DSU 组件。 该组件触及两个特殊节点，从而产生矛盾。 算法正确输出`NO`。 

考虑：```
4 8 8
1 7 3 5
```这里两个总和是相同的。 每个补关系都是相同的关系。 DSU 只是合并匹配对。 不会出现任何矛盾，任何一致的分配都有效。 该算法自然地处理这个问题，因为联合是幂等的。
