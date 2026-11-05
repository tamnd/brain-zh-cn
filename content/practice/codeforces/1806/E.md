---
title: "CF 1806E - 树大师"
description: "该树以顶点 1 为根。每个顶点都有一个值 a[v]，并且除根之外的每个顶点都有一个父节点。 对于查询 (x, y)，两个顶点保证位于相同的深度。 从这两个顶点开始，我们一次重复地向上移动一条边。"
date: "2026-06-09T09:10:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "dfs-and-similar", "trees"]
categories: ["algorithms"]
codeforces_contest: 1806
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 858 (Div. 2)"
rating: 2200
weight: 1806
solve_time_s: 92
verified: true
draft: false
---

[CF 1806E - 树大师](https://codeforces.com/problemset/problem/1806/E)

 **评分：** 2200
 **标签：** 暴力破解、数据结构、dfs 和类似、树
 **求解时间：** 1m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该树以顶点 1 为根。每个顶点都有一个值`a[v]`，并且除根之外的每个顶点都有一个父顶点。 

对于查询`(x, y)`，两个顶点保证位于相同的深度。 从这两个顶点开始，我们一次重复地向上移动一条边。 在每一步中，我们都会将当前一对顶点上的值相乘，并将该乘积添加到答案中。 

如果我们将祖先链写为`x = x0, x1 = parent(x0), x2 = parent(x1), ...`和`y = y0, y1 = parent(y0), y2 = parent(y1), ...`那么答案是`a[x0]a[y0] + a[x1]a[y1] + a[x2]a[y2] + ...`直到两条链都到达根。 

隐藏在定义中的递归是$$f(x,y)=a_xa_y+f(p_x,p_y)$$和$$f(0,0)=0.$$限制才是真正的挑战。 两个都`n`和`q`可以达到`10^5`。 单个查询可能涉及长度的路径`10^5`，因此直接走到每个查询的根可能需要大约`10^10`最坏情况下的操作。 任何每次查询处理整个祖先链的解决方案都会被立即排除。 

内存限制非常慷慨，为 1024 MB。 这是一个强烈的暗示，我们可以缓存大量的信息，但不是所有的信息`n²`可能的顶点对。 

当两个查询的顶点相同时，会出现微妙的边缘情况。 

例子：```
3 1
2 3 5
1 2
3 3
```正确答案是$$5^2+3^2+2^2=38.$$尝试利用对称性而不正确处理相同顶点的粗心实现可能会意外地重复计数或跳过项。 

另一个容易犯的错误是假设记忆所有对都是可行的。 

考虑一颗星星：```
1
├── 2
├── 3
├── ...
└── 100000
```所有叶子都具有相同的深度。 几乎有`10^10`可能的叶子对。 存储每对值是不可能的。 

第三个陷阱来自递归深度。 递归自然意味着递归实现，但是长度链`10^5`超过了Python的递归限制。 可接受的 Python 解决方案必须小心地增加限制或使用迭代公式。 

## 方法

 暴力解法直接遵循定义。 对于每个查询，重复添加`a[x] * a[y]`，然后将两个顶点替换为其父顶点。 

复发$$f(x,y)=a_xa_y+f(p_x,p_y)$$表明这是正确的。 不幸的是，如果树是一条长链，则单个查询的成本`O(n)`， 和`10^5`查询变成`O(nq)=10^{10}`运营。 

复发也揭示了一些有用的东西。 许多查询最终到达同一对`(u,v)`。 一旦我们知道`f(u,v)`，每个达到该状态的未来计算都可以立即停止。 

问题是可能的对太多了。 我们无法记住所有这些。 

关键的观察是关于深度。 

让`cnt[d]`是深度处的顶点数`d`。 

选择阈值$$B \approx \sqrt n.$$深度最多为`B`顶点称为小深度。 

对于每个小深度，最多有`B`该深度上可能的顶点。 存储涉及这些顶点的答案变得负担得起。 

假设我们为每个顶点分配其深度级别内的一个位置。 对于一个顶点`y`在较小的深度上，我们可以存储`f(x,y)`对于每个顶点`x`。 

存储的状态数为$$\sum_{\text{small depths}} n \cdot cnt[d].$$由于每个小深度最多包含`B`顶点数，总数最多为`nB`。 

现在考虑一个查询。 向上爬时，如果当前深度很大，则该深度包含的内容超过`B`顶点。 由于顶点总数为`n`, 最多可以有`n/B`任何根路径上都有如此大的深度。 

至多之后`n/B`向上移动，我们到达一个小深度。 那时我们可以立即检索预先计算的值。 

这给出了$$O\!\left(\frac{n}{B}\right)$$每个查询的工作量和$$O(nB)$$总存储状态。 

选择$$B \approx \sqrt n$$平衡期限和收益率$$O(n\sqrt n)$$整体复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n√n + q√n) | O(n√n + q√n) | O(n√n) | O(n√n) | 已接受 |

 ## 算法演练

 1. 构建有根树并计算每个顶点的深度。 
2. 对于每个深度`d`，计算有多少个顶点属于该深度。 
3. 在每个深度内，分配一个本地索引`h[v]`到每个顶点。 该索引用于寻址记忆状态。 
4.让`B = 320`（大约`√100000`）。 
5. 定义一个记忆函数：$$f(x,y)=a_xa_y+f(p_x,p_y).$$基本情况是`f(0,0)=0`。 

1. 每当当前深度`y`很小，意思是`cnt[depth[y]] <= B`，将答案存储在表中`dp[x][h[y]]`。 

局部索引就足够了，因为同一深度的所有顶点都有不同的位置。 

1. 回答询问`(x,y)`，评估复发情况。 如果存储的值已经存在，则立即返回它。 
2. 否则计算$$f(x,y)=a_xa_y+f(p_x,p_y),$$如果深度较小则存储并返回。 

### 为什么它有效

 重现与查询的定义完全匹配。 每个递归步骤都会从总和中删除一对顶点，并将剩余的后缀委托给父对。 

记忆永远不会改变返回的值。 它只是避免重新计算之前已经解决的状态。 

对于最多包含`B`顶点，每个状态`(x,y)`在第一次计算后存储。 对于深度大于`B`，在任何根路径上都很少有这样的级别，因为每个大级别包含多个`B`顶点和树只有`n`总共的顶点。 

因此，每个查询在达到缓存状态之前仅执行有限数量的未缓存转换，并且每个返回值正是问题定义的重复值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())
    a = [0] + list(map(int, input().split()))

    parent = [0] * (n + 1)
    children = [[] for _ in range(n + 1)

]
    p = list(map(int, input().split()))

    for i in range(2, n + 1):
        parent[i] = p[i - 2]
        children[parent[i]].append(i)

    depth = [0] * (n + 1)

    cnt = [0] * (n + 1)
    pos = [0] * (n + 1)

    stack = [(1, 0)]
    while stack:
        v, d = stack.pop()
        depth[v] = d
        cnt[d] += 1
        pos[v] = cnt[d]

        for to in children[v]:
            stack.append((to, d + 1))

    B = 320

    dp = [[0] * (B + 2) for _ in range(n + 1)]

    sys.setrecursionlimit(300000)

    def ask(x, y):
        if x == 0:
            return 0

        if cnt[depth[y]] <= B:
            cached = dp[x][pos[y]]
            if cached:
                return cached

        ans = ask(parent[x], parent[y]) + a[x] * a[y]

        if cnt[depth[y]] <= B:
            dp[x][pos[y]] = ans

        return ans

    out = []
    for _ in range(q):
        x, y = map(int, input().split())
        out.append(str(ask(x, y)))

    sys.stdout.write("\n".join(out))

solve()
```第一部分构造有根树并计算深度。 在遍历树时，每个顶点都会在其自己的深度级别内接收一个位置。 如果深度包含顶点`{v1, v2, ..., vk}`，他们的位置是`1..k`。 

桌子`dp[x][pos[y]]`仅当深度为`y`很小。 因为小深度最多包含`B`顶点，`pos[y]`永远不会超过表格宽度。 

复发`ask(parent[x], parent[y]) + a[x] * a[y]`直接反映了答案的数学定义。 

缓存查找发生在递归调用之前。 一旦计算出小深度的状态，到达该状态的每个未来查询都会立即停止。 

一个实施细节很重要。 缓存使用`0`作为“未计算”标记。 这是安全的，因为每个顶点值都是正数，因此每个有效答案都是严格正数。 

另一个细节是递归限制。 链状树可以有深度`100000`，所以默认的Python递归限制是不够的。 

## 工作示例

 ### 示例 1

 输入：```
6 2
1 5 2 3 1 1
1 2 3 3 2
4 5
6 6
```供查询`(4,5)`:

 | x| y | 附加值| 运行总和 |
 | --- | --- | --- | --- |
 | 4 | 5 | 3×1=3 | 3×1=3 | 3 |
 | 3 | 3 | 2×2=4 | 2×2=4 7 |
 | 2 | 2 | 5×5=25 | 5×5=25 32 | 32
 | 1 | 1 | 1×1=1 | 1×1=1 | 33 | 33

 答案=33。 

供查询`(6,6)`:

 | x| y | 附加值| 运行总和 |
 | --- | --- | --- | --- |
 | 6 | 6 | 1×1=1 | 1×1=1 | 1 |
 | 2 | 2 | 5×5=25 | 5×5=25 26 | 26
 | 1 | 1 | 1×1=1 | 1×1=1 | 27 | 27

 答案=27。 

这个例子直接展示了递归。 每一行对应一个递归转换。 

### 自定义示例```
4 1
1 2 3 4
1 2 3
4 4
```树是一条链。 

| x| y | 附加值| 运行总和 |
 | --- | --- | --- | --- |
 | 4 | 4 | 16 | 16 16 | 16
 | 3 | 3 | 9 | 25 | 25
 | 2 | 2 | 4 | 29 | 29
 | 1 | 1 | 1 | 30|

 答案=30。 

此示例练习最大深度行为。 该算法重复应用相同的递归，直到达到`(0,0)`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n√n + q√n) | O(n√n + q√n) | 每个查询最多爬过 O(√n) 个未缓存级别 |
 | 空间| O(n√n) | O(n√n) | 所有小深度的记忆状态 |

 和`n = 10^5`,`√n`大致是`316`。 生成的操作数完全在限制范围内，并且内存使用量在可用的 1024 MB 范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    input_data = io.StringIO(inp)

    n, q = map(int, input_data.readline().split())
    a = [0] + list(map(int, input_data.readline().split()))

    parent = [0] * (n + 1)
    children = [[] for _ in range(n + 1)]

    p = list(map(int, input_data.readline().split()))
    for i in range(2, n + 1):
        parent[i] = p[i - 2]
        children[parent[i]].append(i)

    depth = [0] * (n + 1)
    cnt = [0] * (n + 1)
    pos = [0] * (n + 1)

    stack = [(1, 0)]
    while stack:
        v, d = stack.pop()
        depth[v] = d
        cnt[d] += 1
        pos[v] = cnt[d]
        for to in children[v]:
            stack.append((to, d + 1))

    B = 320
    dp = [[0] * (B + 2) for _ in range(n + 1)]

    sys.setrecursionlimit(300000)

    def ask(x, y):
        if x == 0:
            return 0
        if cnt[depth[y]] <= B and dp[x][pos[y]]:
            return dp[x][pos[y]]
        ans = ask(parent[x], parent[y]) + a[x] * a[y]
        if cnt[depth[y]] <= B:
            dp[x][pos[y]] = ans
        return ans

    out = []
    for _ in range(q):
        x, y = map(int, input_data.readline().split())
        out.append(str(ask(x, y)))

    return "\n".join(out)

# sample 1
assert run(
"""6 2
1 5 2 3 1 1
1 2 3 3 2
4 5
6 6
"""
) == "33\n27"

# minimum tree
assert run(
"""2 1
1 2
1
1 1
"""
) == "1"

# chain, same vertex
assert run(
"""4 1
1 2 3 4
1 2 3
4 4
"""
) == "30"

# star tree
assert run(
"""5 1
1 2 3 4 5
1 1 1 1
2 3
"""
) == "7"

# repeated query checks memoization path
assert run(
"""3 3
1 2 3
1 2
3 3
3 3
3 3
"""
) == "14\n14\n14"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小树| 1 | 根处理和基本情况|
 | 链，同一顶点 | 30| 深度递归路径|
 | 星树| 7 | 相同深度的叶子与共同的根|
 | 重复相同的查询 | 每次14 | 正确重用记忆状态 |

 ## 边缘情况

 考虑相同顶点的情况：```
4 1
1 2 3 4
1 2 3
4 4
```该算法计算`f(4,4) = 16 + f(3,3)`

`f(3,3) = 9 + f(2,2)`

`f(2,2) = 4 + f(1,1)`

`f(1,1) = 1 + f(0,0)`产生`30`。 不需要什么特别的，因为递归自然会处理相等的顶点。 

现在考虑一颗星：```
5 1
1 2 3 4 5
1 1 1 1
2 3
```执行是`f(2,3) = 2*3 + f(1,1)`

`f(1,1) = 1`给予`7`。 

这证实了即使查询的顶点立即发散，算法也能正确地一直持续到根。 

最后，考虑同一深度上的许多顶点。 一颗星与`99999`叶子会产生大量的潜在对。 该算法从不存储所有对值。 它只缓存涉及深度的状态，其大小最多为`B`，保持记忆在`O(n√n)`而不是`O(n²)`。 这正是平方根分解论证旨在处理的情况。
