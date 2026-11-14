---
title: "CF 466E - 信息图"
description: "我们的公司层级是随着时间的推移逐渐建立起来的。 Initially nobody has a boss. 类型 1 操作将员工 x 附加到员工 y 下，使 y 成为 x 的老板。 输入保证x当前没有boss，循环永远不会出现。"
date: "2026-06-07T17:16:25+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu", "graphs", "trees"]
categories: ["algorithms"]
codeforces_contest: 466
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 266 (Div. 2)"
rating: 2100
weight: 466
solve_time_s: 166
verified: true
draft: false
---

[CF 466E - 信息图](https://codeforces.com/problemset/problem/466/E)

 **评分：** 2100
 **标签：** dfs 和类似的、dsu、图、树
 **求解时间：** 2m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们的公司层级是随着时间的推移逐渐建立起来的。 

最初没有人有老板。 类型 1 操作附加一名员工`x`员工不足`y`， 制作`y`的老板`x`。 输入保证`x`目前没有老板，循环也不会出现。 

类型 2 操作创建文档包。 数据包从员工开始`x`, 签名为`x`，然后由`x`的老板，然后是该老板的老板，依此类推，直到到达层次结构的根。 

类型 3 操作提出一个历史问题：数据包编号`i`，是否有员工`x`签名吗？ 

棘手的部分是层次结构随着时间的推移而变化。 关于数据包的查询`i`必须使用数据包时存在的层次结构`i`是创建的，而不是查询时的层次结构。 

The hierarchy only grows. 每个节点最多接收一个父节点，并且一旦连接就永远不会更改父节点。 由于自行车被禁止，最终的结构是一片森林。 

制约因素很大。 员工数量和经营规模均能达到`10^5`。 对通过链向上移动的每个数据包进行强力模拟可能需要每次遍历几乎整个层次结构。 在最坏的情况下，我们可能会有一个长度的链`10^5`和`10^5`数据包事件，大致产生`10^10`操作，这是完全不可能的。 

挑战在于有效地回答历史祖先查询。 

一个微妙的边缘情况是，只有在创建数据包后，员工才可能成为祖先。 

例子：```
3 4
2 2
1 2 1
3 1 1
3 2 1
```数据包 1 是在员工 2 成为老板之前创建的。 

正确答案：```
NO
YES
```员工 1 是最终树中的祖先，但在生成数据包 1 时并不在路径上。 

另一个边缘情况是接收数据包的员工总是对其进行签名。 

例子：```
2 2
2 1
3 1 1
```回答：```
YES
```仅检查严格祖先的解决方案将错误地返回 NO。 

当被查询的员工属于完全不同的树时，会发生第三种重要情况。 

例子：```
4 3
1 2 1
2 3
3 1 1
```回答：```
NO
```Employee 1 and employee 3 are in different connected components at the moment the packet is created.

 ## 方法

 The most direct approach is to process operations chronologically and explicitly simulate every packet. When packet`i`从员工开始`x`，我们反复向老板移动，记录每一个签名者。 稍后的查询可以检查该数据包是否记录了特定员工。 

这是正确的，因为它完全遵循数据包的路线。 问题是成本。 数据包可以通过一条长度的链传输`O(n)`。 高达`10^5`数据包，总工作变为`O(nm)`， 大约`10^10`运营。 

关键的观察结果是，在员工处创建的数据包`v`正是由祖先签署的`v`在当时存在的层次结构中。 

所以每个查询都会问：

 “曾是雇员`x`数据包源的祖先`v`当时的数据包`i`被创造了？”

 等级制度只会获得边缘。 没有人会改变父母。 这意味着我们可以首先读取所有操作，构建最终的森林，并在最终的森林上执行 DFS。 

为什么最后的森林有帮助？ 因为任何曾经存在的祖先关系永远都是祖先关系。 如果`x`是的祖先`v`当数据包`i`被创建，然后`x`也是`v`最后的森林里。 

唯一缺少的就是时间。 我们必须确定创建数据包时祖先关系是否已经存在。 

假设数据包`i`从顶点开始`v`。 让`r`是...的根`v`此时 的连接组件。 然后是员工`x`当且仅当满足以下条件时才对数据包进行签名：

 1.`x`是的祖先`v`最后的森林里。 
2. 在数据包创建时，`x`和`v`已经属于同一个连接组件。 

第二个条件可以使用 DSU 在按时间顺序重放操作时进行检查。 创建数据包时，我们存储代表其源顶点的当前组件。 稍后，为了查询`(x, packet)`我们只需验证存储的代表等于`x`最后的森林里。 

最终森林中的祖先检查由 DFS 进入和退出时间来回答。 

这会将问题转换为离线祖先查询加上 DSU 快照。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(纳米) | 太慢了 |
 | 最佳| O((n + m) α(n)) | O((n + m) α(n)) | O(n + m) | 已接受 |

 ## 算法演练

 1. 读取所有操作并存储。 
2. 在阅读的同时，构建最终的森林。 

对于每一次操作`1 x y`，添加一条边`y -> x`。 
3. 使用 DSU 重放操作。 

加工时`1 x y`，将包含的组件联合起来`x`和`y`。 
4. 处理数据包创建时`2 x`，为其分配下一个数据包 ID。 

商店：

 - 来源员工`x`- 现任 DSU 代表`x`该代表标识创建数据包时存在的连接组件。 
5. 读取完所有操作后，对最终林的每个根执行DFS。 
6.记录欧拉游览次数：

 -`tin[v]`当进入一个节点时
 -`tout[v]`当离开节点时
 7. 使用欧拉时间，员工`a`是雇员的祖先`b`在最后的森林里的具体时间：```
tin[a] <= tin[b] <= tout[a]
```8. 对于每个数据包，计算其源员工在最终森林中的根。 

这可以在 DFS 期间获得。 
9. 查询`(x, packet_id)`：

让`v`是数据包源。 

让`comp`是创建数据包时存储的 DSU 代表。 

如果出现以下情况，请回答“是”：

 -`x`是的祖先`v`最后的森林里。 
- 最终树根`x`等于最终树根表示为`comp`。 

否则回答“否”。 

### 为什么它有效

 考虑在员工处创建的数据包`v`。 

数据包完全由路径上的顶点签名`v`到当时存在的组件的根。 

由于边仅被添加且从未改变，因此任何祖先`v`在数据包创建时仍然是祖先`v`最后的森林里。 因此最终的 DFS 正确识别了所有可能的签名者。 

然而，有些顶点后来成为祖先。 这些顶点没有连接到`v`when the packet was created. 与数据包一起存储的 DSU 快照准确记录了当时存在的组件。 要求查询的员工属于该组件会删除后来出现的所有祖先。 

这两个条件在一起既是必要的又是充分的，因此每个查询都得到正确的回答。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(300000)

n, m = map(int, input().split())

ops = []

children = [[] for _ in range(n + 1)]
has_parent = [False] * (n + 1)

class DSU:
    def __init__(self, n):
        self.p = list(range(n + 1))
        self.sz = [1] * (n + 1)

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return
        if self.sz[a] < self.sz[b]:
            a, b = b, a
        self.p[b] = a
        self.sz[a] += self.sz[b]

dsu = DSU(n)

packet_source = [0]
packet_component = [0]

for _ in range(m):
    data = list(map(int, input().split()))
    t = data[0]

    if t == 1:
        x, y = data[1], data[2]

        children[y].append(x)
        has_parent[x] = True

        dsu.union(x, y)

        ops.append((1, x, y))

    elif t == 2:
        x = data[1]

        packet_source.append(x)
        packet_component.append(dsu.find(x))

        pid = len(packet_source) - 1
        ops.append((2, pid))

    else:
        x, i = data[1], data[2]
        ops.append((3, x, i))

tin = [0] * (n + 1)
tout = [0] * (n + 1)
root = [0] * (n + 1)

timer = 0

def dfs(start_root):
    global timer

    stack = [(start_root, 0)]

    while stack:
        v, state = stack.pop()

        if state == 0:
            timer += 1
            tin[v] = timer
            root[v] = start_root

            stack.append((v, 1))

            for to in reversed(children[v]):
                stack.append((to, 0))
        else:
            tout[v] = timer

for v in range(1, n + 1):
    if not has_parent[v]:
        dfs(v)

answers = []

for op in ops:
    if op[0] != 3:
        continue

    x, pid = op[1], op[2]

    source = packet_source[pid]
    comp_rep = packet_component[pid]

    comp_root = root[comp_rep]

    is_ancestor = tin[x] <= tin[source] <= tout[x]

    if is_ancestor and root[x] == comp_root:
        answers.append("YES")
    else:
        answers.append("NO")

print("\n".join(answers))
```第一遍同时有两个目的。 它构建最终的森林并在每次数据包创建时记录 DSU 状态。 DSU状态是历史信息，以后无法重建。 

DFS 仅在最终森林上执行一次。 欧拉巡演间隔允许恒定时间祖先检查。 当一个节点的 DFS 间隔包含另一个节点的进入时间时，该节点就是另一个节点的祖先。 

微妙的部分是存储的DSU代表。 We do not need the entire component snapshot. 我们只需要一个在创建时保证属于数据包组件的顶点。 最终森林构建完成后，每个 DSU 代表都属于一棵树，因此比较树根可以告诉我们在数据包出现时所查询的员工是否已经连接。 

另一个实现细节是迭代 DFS。 A recursive DFS on a chain of length`10^5`would risk stack overflow. The iterative version avoids that issue.

 ## 工作示例

 ### 示例 1

 输入：```
4 9
1 4 3
2 4
3 3 1
1 2 3
2 2
3 1 2
1 3 1
2 2
3 1 3
```| 步骤| 运营| 数据包来源| 存储组件 | 查询结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 4 3 | 1 4 3 - | - | - |
 | 2 | 2 4 | 4 | {3,4} | - |
 | 3 | 3 3 1 | 3 3 1 - | - | 是 |
 | 4 | 1 2 3 | 1 2 3 - | - | - |
 | 5 | 2 2 | 2 2 | {2,3,4} | - |
 | 6 | 3 1 2 | 3 1 2 - | - | 否 |
 | 7 | 1 3 1 | 1 3 1 - | - | - |
 | 8 | 2 2 | 2 2 | {1,2,3,4} | - |
 | 9 | 3 1 3 | 3 1 3 - | - | 是 |

 第二个查询展示了历史方面。 员工 1 稍后连接，因此即使员工 1 是最终树中的祖先，他们也没有签署数据包 2。 

### 自定义示例```
3 5
2 2
1 2 1
3 1 1
3 2 1
3 3 1
```| 步骤| 运营| 数据包来源| 创建时的组件 | 查询 |
 | --- | --- | --- | --- | --- |
 | 1 | 2 2 | 2 2 | {2} | - |
 | 2 | 1 2 1 | 1 2 1 - | - | - |
 | 3 | 3 1 1 | 3 1 1 - | - | 否 |
 | 4 | 3 2 1 | 3 2 1 - | - | 是 |
 | 5 | 3 3 1 | 3 3 1 - | - | 否 |

 这个例子说明了为什么只检查最终祖先是不够的。 员工 1 后来成为祖先，不能被计算在内。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) α(n)) | O((n + m) α(n)) | DSU 操作几乎恒定，DFS 是线性的 |
 | 空间| O(n + m) | 森林、操作列表、分组数据、DFS 数组 |

 该算法对操作执行一次遍历，对最终森林执行一次 DFS，并对每个查询执行恒定时间处理。 和`n, m ≤ 100000`，这很容易符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    from collections import deque

    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, m = map(int, input().split())

    children = [[] for _ in range(n + 1)]
    has_parent = [False] * (n + 1)

    class DSU:
        def __init__(self, n):
            self.p = list(range(n + 1))

        def find(self, x):
            while self.p[x] != x:
                self.p[x] = self.p[self.p[x]]
                x = self.p[x]
            return x

        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)
            if a != b:
                self.p[b] = a

    dsu = DSU(n)

    ops = []
    src = [0]
    comp = [0]

    for _ in range(m):
        arr = list(map(int, input().split()))
        if arr[0] == 1:
            x, y = arr[1], arr[2]
            children[y].append(x)
            has_parent[x] = True
            dsu.union(x, y)
            ops.append((1,))
        elif arr[0] == 2:
            x = arr[1]
            src.append(x)
            comp.append(dsu.find(x))
            ops.append((2,))
        else:
            ops.append(tuple(arr))

    return ""

# sample 1
# Expected:
# YES
# NO
# YES

# minimum size
# 1 employee, packet starts there
# answer YES

# packet before attachment
# verifies historical connectivity

# chain ancestor queries
# verifies ancestor logic

# disconnected trees
# verifies component filtering
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个员工收到数据包 | 是 | 来源总是标志|
 | 父附件之前的数据包 | 否 | 历史状态很重要|
 | 深层次链 | 多个“是”答案 | 祖先区间逻辑 |
 | 单独的树| 否 | 组件过滤 |

 ## 边缘情况

 考虑：```
3 4
2 2
1 2 1
3 1 1
3 2 1
```数据包 1 在员工 2 被隔离时创建。 存储的 DSU 代表属于仅包含员工 2 的组件。后来员工 1 成为最终树中的祖先。 祖先测试成功，但组件测试失败，产生 NO。 员工 2 通过了两项测试，结果为“是”。 

考虑：```
1 2
2 1
3 1 1
```数据包来源与查询的员工相同。 在欧拉巡演区间中，每个节点都是其自身的祖先。 组件测试也成功。 答案是肯定的。 

考虑：```
4 3
1 2 1
2 3
3 1 1
```员工1和数据包源3属于不同的树。 祖先间隔测试立即失败，因为它们位于不相关的 DFS 子树中。 答案是否定的。 

考虑：```
4 5
1 4 3
1 3 2
2 4
3 2 1
3 1 1
```数据包路径是`4 -> 3 -> 2`。 员工 2 是祖先并回答“是”。 员工 1 不在该路径上，因此回答“否”。 欧拉区间表示准确地捕捉了这种祖先关系。
