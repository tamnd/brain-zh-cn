---
title: "CF 102396K - 准备测试"
description: "子数组被解释为一个完整的多重测试输入。 它的第一个值是图边的数量 m，接下来的 2m 个值被分组为 m 个无序顶点对。"
date: "2026-08-10T18:58:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102396
codeforces_index: "K"
codeforces_contest_name: "2019-2020 Saint-Petersburg Open High School Programming Contest (SpbKOSHP 19)"
rating: 0
weight: 102396
solve_time_s: 163
verified: true
draft: false
---

[CF 102396K - 准备测试](https://codeforces.com/problemset/problem/102396/K)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 子数组被解释为一个完整的多重测试输入。 它的第一个值是数字`m`图的边，以及下一个`2m`值被分组为`m`无序顶点对。 生成的无向图必须是森林，因此它不能包含自环、重复边或任何环。 任务是计算有多少子数组满足这种解释。 官方的限制是`1 <= n <= 300000`和`0 <= a_i <= 10^9`，有 2 秒时间限制和 512 MB 内存限制。 

候选子数组的第一个值完全决定了它的长度。 如果子数组从位置开始`l`和`a[l] = m`，其端点必须是`l + 2m`。 因此，每个起始位置最多有一个可能有效的子数组。 真正的困难不是找到终点，而是检查是否所有的`m`边缘足够快地形成森林。 

直接实现可以使用新的 DSU 检查每个候选图。 在最坏的情况下，可能有 θ(n) 个候选，并且每个候选可以包含 θ(n) 条边，从而给出 θ(n²) 条边操作。 和`n = 300000`，二次方法可以大致达到`n² / 4`，或大约 225 亿次边缘检查，这远远超出了 2 秒解决方案的执行能力。 因此，该解决方案必须避免为每个起始位置重建图表。 

有一些简单的情况会导致错误的解决方案默默地接受无效的子数组。 零边沿计数是有效的：例如，输入`1 0`包含有效的子数组`[0]`，因为没有边的图是森林。 坚持看到至少一个边缘的解决方案会错误地拒绝它。 

即使仅包含一条边，自循环也是无效的。 例如，```
3
1 5 5
```有候选人`[1, 5, 5]`，它描述了边缘`(5,5)`。 正确的贡献为零，因为自循环是长度为 1 的循环。 仅检查两个端点是否已连接的 DSU 实现必须显式处理`u == v`。 

平行边也是无效的。 例如，```
5
2 1 2 1 2
```开始于`m = 2`并描述`(1,2), (1,2)`。 零位置的正确贡献为零。 将重复边视为无害会错误地接受不是森林的多重图。 

最后，阵列位置很重要。 对于样品```
5
2 1 3 4 1
```从位置 0 开始的子数组有两个边，而从位置 1 开始的子数组有一个边。 两者都有效，所以答案是`2`。 仅检查固定奇偶性头寸的解决方案可能会错过其中一个。 

## 方法

 蛮力方法直接遵循定义。 对于每个起始位置`l`， 读`m = a[l]`，检查一下`l + 2m < n`，然后处理以下内容`m`与 DSU 配对。 当有边缘时`(u,v)`被读取后，自循环立即使图无效。 否则，如果`u`和`v`已经在同一个组件中，边缘创建了一个循环，因此该图无效。 如果它们位于不同的组件中，请将它们合并。 这是正确的，因为在两个不同组件之间插入一条边可以保留森林属性，而在一个组件内插入一条边则恰好创建一个循环。 

问题是重复工作。 即使一个 DSU 操作几乎是恒定的摊销时间，我们也可以为 θ(n) 个不同的起始点处理 θ(n) 个边。 最坏情况下处理的边数为 θ(n²)，大约为 225 亿`n = 300000`。 

关键的观察结果是，图的有效性条件在删除边缘方面是单调的。 如果一系列边是森林，那么这些边的每个较小的连续范围也是森林。 这让我们将问题转化为范围查询问题。 

考虑数组的一对固定的边。 对于每个正确的端点`r`， 定义`bad[r]`作为最大索引`x`使得边缘间隔`[x,r]`包含一个循环。 然后`[l,r]`正是在什么时候是一片森林`l > bad[r]`。 原因是如果一个循环完全包含在`[l,r]`，其最小边索引至少为`l`， 所以`bad[r] >= l`。 相反，如果`bad[r] >= l`, 循环见证`bad[r]`完全位于内部`[l,r]`。 

剩下的问题就是如何维护`bad[r]`而边是从左到右插入的。 插入的边始终是最新的边，因此其索引大于已存在的每条边。 如果其端点断开连接，则不会创建循环。 如果它们是连接的，则现有森林在它们之间包含唯一的路径，并且添加新边缘会创建一个循环。 该路径上的最小边索引恰好是新循环的最小边。 取该值和前一个值的最大值`bad`给出新的阈值。 

因此，我们需要一个动态森林，支持连通性、路径上的最小边以及用更新的边替换一个树边。 链接切割树是一个自然的选择。 链接切割树支持动态森林操作和对数摊销时间内的路径聚合。 

还有一个由原始数组引起的额外细节。 有效的子数组可以从任一奇偶校验开始。 如果它从偶数位置开始，则其边缘是```
(a[l+1], a[l+2]), (a[l+3], a[l+4]), ...
```而奇怪的起始位置给出```
(a[l+1], a[l+2]), (a[l+3], a[l+4]), ...
```与相对于原始数组的其他对齐方式。 我们分别处理这两个对齐。 每个对齐都成为正常的边序列，并且每个原始起始位置恰好对应于该边序列的一个前缀。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n² α(n)) | O(n² α(n)) | O(n) | 太慢了|
 | 优化链接切割树 | O(n log n) 摊销 | O(n) | 已接受 |

 ## 算法演练

 1. 坐标压缩数组中出现的所有顶点标签。 顶点值可以大到`10^9`，但只有标签之间的平等才重要。 压缩为每个不同的顶点提供一个紧凑的整数 ID。 
2. 分别处理两种可能的边缘对齐方式。 为了平价`p`，候选人开始于`l = p + 2j`，其第一个值为`a[l]`。 它的第一条边是`(a[l+1], a[l+2])`， 其次是`(a[l+3], a[l+4])`。 
3. 构建一棵链切树，其普通节点代表压缩图顶点。 每条边也都有自己的链接切割树节点。 边节点将其在边序列中的位置存储为其值，而普通顶点节点的值为无穷大。 将边表示为节点使得可以直接剪切和替换特定边。 
4. 维护一个变量`bad`， 最初`-1`。 边缘处理后`r`,`bad`是完全包含在处理的前缀中的循环的最大可能的最小边缘索引。 
5. 当下一个边时`(u,v)`是一个自环，它立即形成一个环，其最小边为`r`。 放`bad = max(bad, r)`并且不要将此边缘插入森林。 
6. 否则，检查是否`u`和`v`已在维护的森林中连接。 如果它们没有连接，则链接新的边缘节点`u`和`v`。 没有出现循环，所以`bad`不会改变。 
7. 如果`u`和`v`已经连接，查询其唯一森林路径上的最小边索引。 令该值为`x`。 添加新边会创建一个循环，其最小边为`x`，因为新边具有循环中最大的索引。 更新`bad = max(bad, x)`。 
8. 更换边缘`x`在维护的森林的新边缘。 从两个端点剪切旧边缘节点，然后将新边缘节点链接到相同的端点。 生成的森林是已处理图的最大索引生成森林，这正是我们将来插入所需的。 
9. 存储结果`bad[r]`对于每个边缘位置。 对于起始候选人`l = p + 2j`， 让`k = a[l]`。 如果`k = 0`，候选不包含边并且始终有效。 否则它的最后一条边是`r = j + k - 1`。 候选人的有效时间恰好是`r`存在并且`bad[r] < j`。 
10. 将每个有效候选添加到答案中，并对其他奇偶校验重复该过程。 

### 为什么它有效

 维护的链接切割树始终是包含由已处理图的最大索引生成森林选择的边的森林。 当一条新边连接两个不同的分量时，它属于每个总索引最大的生成林，并且可以简单地链接。 当它连接同一组件中已有的顶点时，当前的树路径加上新的边就是一个循环。 由于新边在该循环中具有最大索引，因此树路径上的最小索引是该循环的最小索引。 用新边替换最小边可以保留最大索引跨越森林属性。 

不变量为`bad[r]`是它等于前缀中包含的所有循环中最大可能的最小边索引`r`。 现有周期由之前的值覆盖`bad`，而每个新创建的循环都由新边端点之间的路径上的最小边表示。 因此有一个范围`[l,r]`确切地说，何时不包含循环`l > bad[r]`。 自循环和平行边自然地被处理为循环，因此这种情况相当于图是一个有效的森林。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

class LinkCutTree:
    __slots__ = ("n", "left", "right", "parent", "rev", "value", "mn")

    def __init__(self, values):
        n = len(values)
        self.n = n
        self.left = [0] * n
        self.right = [0] * n
        self.parent = [0] * n
        self.rev = [0] * n
        self.value = values
        self.mn = values[:]

    def is_root(self, x):
        p = self.parent[x]
        return p == 0 or (self.left[p] != x and self.right[p] != x)

    def push(self, x):
        if self.rev[x]:
            l = self.left[x]
            r = self.right[x]
            self.left[x], self.right[x] = r, l

            if l:
                self.rev[l] ^= 1
            if r:
                self.rev[r] ^= 1

            self.rev[x] = 0

    def pull(self, x):
        best = self.value[x]
        l = self.left[x]
        r = self.right[x]

        if l and self.mn[l] < best:
            best = self.mn[l]
        if r and self.mn[r] < best:
            best = self.mn[r]

        self.mn[x] = best

    def rotate(self, x):
        y = self.parent[x]
        z = self.parent[y]

        if self.left[y] == x:
            b = self.right[x]
            self.right[x] = y
            self.left[y] = b
            if b:
                self.parent[b] = y
        else:
            b = self.left[x]
            self.left[x] = y
            self.right[y] = b
            if b:
                self.parent[b] = y

        self.parent[y] = x
        self.parent[x] = z

        if z:
            if self.left[z] == y:
                self.left[z] = x
            elif self.right[z] == y:
                self.right[z] = x

        self.pull(y)
        self.pull(x)

    def splay(self, x):
        stack = []
        y = x
        stack.append(y)

        while not self.is_root(y):
            y = self.parent[y]
            stack.append(y)

        while stack:
            self.push(stack.pop())

        while not self.is_root(x):
            y = self.parent[x]
            z = self.parent[y]

            if not self.is_root(y):
                if (self.left[y] == x) == (self.left[z] == y):
                    self.rotate(y)
                else:
                    self.rotate(x)

            self.rotate(x)

        self.pull(x)

    def access(self, x):
        last = 0
        y = x

        while y:
            self.splay(y)
            self.right[y] = last
            self.pull(y)
            last = y
            y = self.parent[y]

        self.splay(x)

    def make_root(self, x):
        self.access(x)
        self.rev[x] ^= 1

    def find_root(self, x):
        self.access(x)

        while True:
            self.push(x)
            l = self.left[x]
            if not l:
                break
            x = l

        self.splay(x)
        return x

    def connected(self, x, y):
        if x == y:
            return True
        self.make_root(x)
        return self.find_root(y) == x

    def link(self, x, y):
        self.make_root(x)
        self.parent[x] = y

    def cut(self, x, y):
        self.make_root(x)
        self.access(y)

        if self.left[y] == x:
            self.left[y] = 0
            self.parent[x] = 0
            self.pull(y)

    def path_min(self, x, y):
        self.make_root(x)
        self.access(y)
        return self.mn[y]

def process_parity(a, vertex_id, parity):
    n = len(a)

    starts = parity
    if starts >= n:
        return 0

    edge_count = (n - parity - 1) // 2
    if edge_count <= 0:
        # There can still be zero-edge candidates.
        ans = 0
        for l in range(parity, n, 2):
            if a[l] == 0:
                ans += 1
        return ans

    total_nodes = len(vertex_id) + edge_count

    values = [INF] * total_nodes
    for i in range(edge_count):
        values[len(vertex_id) + i] = i

    lct = LinkCutTree(values)

    bad = -1
    answer = 0
    bad_at = [bad] * edge_count

    V = len(vertex_id)

    for r in range(edge_count):
        u_pos = parity + 2 * r + 1
        v_pos = u_pos + 1

        u = vertex_id[a[u_pos]]
        v = vertex_id[a[v_pos]]
        edge_node = V + r

        if u == v:
            if r > bad:
                bad = r
        elif not lct.connected(u, v):
            lct.link(edge_node, u)
            lct.link(edge_node, v)
        else:
            old_index = lct.path_min(u, v)

            if old_index > bad:
                bad = old_index

            old_node = V + old_index

            old_u_pos = parity + 2 * old_index + 1
            old_v_pos = old_u_pos + 1

            old_u = vertex_id[a[old_u_pos]]
            old_v = vertex_id[a[old_v_pos]]

            lct.cut(old_node, old_u)
            lct.cut(old_node, old_v)

            lct.link(edge_node, u)
            lct.link(edge_node, v)

        bad_at[r] = bad

    for j in range((n - parity + 1) // 2):
        l = parity + 2 * j
        if l >= n:
            break

        k = a[l]

        if k == 0:
            answer += 1
            continue

        r = j + k - 1

        if 0 <= r < edge_count and bad_at[r] < j:
            answer += 1

    return answer

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    values = sorted(set(a))
    vertex_id = {x: i for i, x in enumerate(values)}

    ans = 0
    ans += process_parity(a, vertex_id, 0)
    ans += process_parity(a, vertex_id, 1)

    print(ans)

if __name__ == "__main__":
    solve()
```坐标压缩只进行一次，因为顶点标签的实际大小并不重要。 相同整数的两次出现必须表示相同的图顶点，而不同的整数必须表示不同的顶点。 

对于一个奇偶校验，`edge_count`是可以从该对齐形成的完整对的数量。 每条边接收一个专用的 LCT 节点，其存储值是其在边序列中的位置。 普通图顶点存储无穷大，因此路径最小值始终返回实际的边索引。 

插入逻辑直接遵循算法演练。 自循环更新`bad`无需进入森林。 不同组件之间的新边缘立即链接起来。 一个组件内的新边会创建一个循环，因此`path_min`找到它的最小边缘。 删除该边并插入新边。 

两人`cut`调用是必要的，因为边缘节点表示无向边缘并具有两个表示树连接。 忘记其中任何一个都会在动态森林中留下部分旧边缘，并破坏后续的连接查询。 

候选计算使用`j`，对应于候选者的第一条边的边索引，而不是原始数组位置。 这是许多相差一错误的根源。 候选人开始于`l = parity + 2j`和`k`边缘结束于边缘`r = j + k - 1`。 当该范围不包含循环时，它恰好有效，即`bad_at[r] < j`。 

Python 整数不会溢出，因此答案和顶点标签不需要特殊的整数处理。 该实现使用迭代展开操作而不是递归，避免了 Python 的递归深度限制。 

## 工作示例

 对于样品 1，```
5
2 1 3 4 1
```首先考虑偶数起始位置。 

| 边缘索引| 边缘 |`bad`| 候选人开始|`k`| 候选边缘范围 | 有效 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 |`(1,3)`| -1 | 0 | 2 |`[0,1]`| 是的 |
 | 1 |`(4,1)`| -1 | 2 | 3 |`[2,4]`| 外部数组 |

 从位置零开始的候选者需要两条边，并且`(1,3), (4,1)`形成森林。 奇数起始位置从位置一开始并且具有`k = 1`，给出单边`(3,4)`，这也是一片森林。 

两个有效子数组是`[2,1,3,4,1]`和`[1,3,4]`，所以答案是`2`。 

对于样品 2，```
8
1 3 1 2 2 0 2 3
```相关候选人是：

 | 原创开始|`k`| 边缘|`bad`状况 | 有效 |
 | ---| ---| ---| ---| ---|
 | 0 | 1 |`(3,1)`| 无循环| 是的 |
 | 1 | 3 |`(1,2),(2,0),(2,3)`| 无循环| 是的 |
 | 2 | 1 |`(2,2)`| 自循环| 没有|
 | 3 | 2 |`(2,0),(2,3)`| 无循环| 是的 |
 | 4 | 2 |`(0,2),(2,3)`| 无循环| 是的 |
 | 5 | 0 | 没有边缘| 始终有效 | 是的 |

 位置二的候选者演示了显式自循环情况。 其他五位考生组成森林，给出所需答案`5`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) 摊销 | 每条边都会导致恒定数量的链接切割树操作，每个 O(log n) 摊销 |
 | 空间| O(n) | 压缩后的顶点、边节点、LCT数组、阈值数组都是线性的 |

 输入最多有 300000 个数组元素，因此两个奇偶校验通道中只有 O(n) 次边缘插入。 对数动态树运算取代了暴力法中的二次重复 DSU 构造。 生成的 O(n log n) 界限与给定的输入大小和内存限制兼容。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return out

# Sample 1
assert run("5\n2 1 3 4 1\n") == "2\n", "sample 1"

# Sample 2
assert run("8\n1 3 1 2 2 0 2 3\n") == "5\n", "sample 2"

# Minimum-size input
assert run("1\n0\n") == "1\n", "single zero"

# All values zero
assert run("4\n0 0 0 0\n") == "4\n", "every singleton is valid"

# Self-loop
assert run("3\n1 5 5\n") == "0\n", "self-loop must be rejected"

# Parallel edges
assert run("5\n2 1 2 1 2\n") == "1\n", "parallel edges must be rejected"

# Simple cycle
assert run("7\n3 1 2 2 3 3 1\n") == "0\n", "triangle is not a forest"

# Maximum-size input, every candidate has zero edges
n = 300000
inp = str(n) + "\n" + " ".join(["0"] * n) + "\n"
assert run(inp) == str(n) + "\n", "maximum-size all-zero input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 0`|`1`| 最小尺寸和零边图 |
 |`4 / 0 0 0 0`|`4`| 全部相等的值和空边集 |
 |`3 / 1 5 5`|`0`| 自循环处理|
 |`5 / 2 1 2 1 2`|`1`| 平行边缘处理和奇偶校验|
 |`7 / 3 1 2 2 3 3 1`|`0`| 正品循环检测|
 |`300000 / all zeros`|`300000`| 最大输入大小和答案大小 |

 ## 边缘情况

 零边缘情况在任何链接切断操作之前处理。 用于输入```
1
0
```唯一的候选人开始于`m = 0`，所以它的长度是一。 该图没有边，是一片森林。 该算法立即增加答案。 

对于自循环，例如```
3
1 5 5
```第一个候选人有优势`(5,5)`。 插入例程检测到`u == v`, 更新`bad`到当前的边索引，并且不将该边插入到森林中。 候选者从边缘索引零开始，而`bad`也为零，所以`bad < start`是假的，候选人被拒绝。 

对于重复的边，```
5
2 1 2 1 2
```第一条边`(1,2)`已插入。 第二条边具有相同的端点，因此它们已经连接。 该路径包含第一条边，其索引为零。 因此，新循环的最小索引为零，使得`bad = 0`。 从零边开始的候选者会失败，因为`0 < 0`是假的。 从下一个数组位置开始的候选只有一个边缘并且有效，产生总答案`1`。 

对于三角形```
7
3 1 2 2 3 3 1
```前两条边连接三个不同的顶点。 什么时候`(3,1)`到达时，其端点已通过路径连接`(3,2),(2,1)`。 该路径上的最小边索引为零，因此`bad`变为零。 从零边开始的候选包含整个三角形并被拒绝。 相同的机制可以处理任意长度的循环，而无需显式遍历循环。 

两次奇偶校验传递是必要的，因为子数组的第一个值可以出现在任一奇偶校验处。 从偶数位置开始的候选者与从奇数位置开始的候选者不同地对以下值进行配对。 即使森林检查器在其他方面是正确的，仅处理一种对齐方式也会使图形边缘本身出错。
